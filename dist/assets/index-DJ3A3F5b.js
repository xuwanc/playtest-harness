(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Gi=["sword-shield","dual-swords","greatsword","staff","bow"],$o=["wander","follow","keep-distance","attack","idle"],Vd={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},fo=1e-6;function na(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>fo?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>fo?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Qf(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>fo){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>fo)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Rn=1e-6,Br=Math.PI/180,Zc=-1e9;function Xd(){return{type:"none",lastAt:Zc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Hr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $l(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function qc(n,t,e){const i=e.duration>0?e.duration:jc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if($l(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Rn){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}Hr(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if($l(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Rn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,Hr(n,"hit",s.id,s.position)}}function Ro(n,t,e){qc(n,{kind:"dummy",index:t},e)}function tp(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function jc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function ep(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Br),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+l)continue;const g=u>Rn?f/u:o,y=u>Rn?d/u:r;if(u>Rn&&(f*o+d*r)/u<a)continue;let m="light";t.weapon==="greatsword"?m="knock":t.comboIndex>=3&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,c));const v=Math.max(0,x-u);Ro(n,n.dummies.indexOf(h),{type:m,duration:jc(n,m),dirX:g,dirZ:y,knockback:v})}}function np(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,g=Math.sin(i.facing),y=Math.cos(i.facing),m=Math.cos(Yl(a.arcDeg,0,180)*Br),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const v=n.dummies[x];if(i.hitIds.indexOf(v.id)>=0)continue;const _=u>Rn?Yl(((v.position.x-r)*f+(v.position.z-l)*d)/u,0,1):0,R=r+f*_,w=l+d*_,S=Math.hypot(v.position.x-R,v.position.z-w);let T=!1;if(a.shape==="circle")T=S<=a.radius+p;else if(a.shape==="capsule")T=S<=Math.max(a.radius,a.width)+p;else{const N=v.position.x-c,P=v.position.z-h,L=Math.hypot(N,P),F=L>Rn?(N*g+P*y)/L>=m:!0;T=L<=a.radius+p&&F||S<=a.width+p}if(!T)continue;const b=v.position.x-r,M=v.position.z-l,C=Math.hypot(b,M);if(C>Rn&&(b*g+M*y)/C<Math.cos(Math.max(a.arcDeg,90)*Br))continue;const U=C>Rn?b/C:g,k=C>Rn?M/C:y;qc(n,{kind:"dummy",index:x},{type:a.type,duration:a.duration,dirX:U,dirZ:k,knockback:a.knockback}),i.hitIds.push(v.id),Hr(n,"link-hit",v.id,v.position)}}function ip(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const l=r>Rn?a/r:0,c=r>Rn?o/r:1;qc(n,{kind:"player"},{type:"light",duration:jc(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:s.id})}}function sp(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&ep(n),np(n,t),ip(n)}function Yl(n,t,e){return n<t?t:n>e?e:n}const Wd=Math.PI/180,Kc=1e-6;function ap(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function po(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function $d(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Kc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Yd(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Kc)&&a<=Math.max(0,e.inputDeadZone)&&!o}function op(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function rp(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Yd(n,t,e))return!1;const i=$d(n,t,e.lookRange);if(i===null)return!1;const s=Ge(i-n.character.bodyYaw);return Math.abs(s)>Zd(n,e)}function Zd(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Wd}function cp(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!Yd(n,e,s)){po(n);return}const a=$d(n,e,s.lookRange);if(a===null){po(n);return}const o=n.character,r=Ge(a-o.bodyYaw),l=Math.abs(r),c=Zd(n,s),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Kc;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,s.settleDeg)*Wd);i.targetYaw=Ge(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ge(i.targetYaw-i.fromYaw);o.bodyYaw=Ge(i.fromYaw+d*op(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const vi=1e-6;function Ge(n){return Math.atan2(Math.sin(n),Math.cos(n))}function va(n,t,e,i){const s=Ge(t-n);return n+s*(1-Math.exp(-Math.max(e,vi)*i))}function _a(n,t,e,i,s){const o=Ge(t-n)*(1-Math.exp(-Math.max(e,vi)*s)),r=Math.max(i,0)*s;return r<=vi?n:n+ms(o,-r,r)}function Zl(n,t,e,i,s){const a=(t-n)*(1-Math.exp(-Math.max(e,vi)*s)),o=Math.max(i,0)*s;return o<=vi?n+a:n+ms(a,-o,o)}function ms(n,t,e){return n<t?t:n>e?e:n}function ql(n,t,e,i){const s=Ge(t-n),a=Math.abs(s);return a<=i||a<=e?t:Ge(n+Math.sign(s)*Math.max(e,0))}function lp(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>vi,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=na(n,e);else if(c)i.facing=_a(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=na(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,vi)){const M=Math.atan2(e.moveX,e.moveZ),C=s.facingTurnRate*Math.PI/180*t,U=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=ql(i.facing,M,C,U);else if(h>=s.facingMinMagnitude&&Math.abs(Ge(M-i.facing))>s.facingDeadbandDeg*Math.PI/180){const N=va(i.facing,M,s.facingSmoothRate,t);i.facing=ql(i.facing,N,C,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||rp(n,e)||(c?i.bodyYaw=_a(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=va(i.bodyYaw,g,s.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ge(p-i.bodyYaw))>M&&(p=i.moveYaw)}const x=o||f||m,v=s.maxHeadTurnDeg*Math.PI/180;let _;if(x){const M=c?n.config.gaze.headTurnRate:s.headTurnRate;_=c?_a(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):va(i.headYaw,p,M,t)}else{const M=Ge(i.headYaw-i.bodyYaw),C=Ge(p-i.bodyYaw),U=Math.abs(C)<Math.abs(M)-1e-9,k=U?n.config.gaze.headReturnRate:s.headTurnRate,N=U?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,P=Number.isFinite(N)?_a(M,C,k,N,t):va(M,C,k,t);_=i.bodyYaw+P}const R=Ge(_-i.bodyYaw);R>v?_=i.bodyYaw+v:R<-v&&(_=i.bodyYaw-v),i.headYaw=_;const w=n.config.gaze;let S=0;if(c)S=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const C=i.position.y+n.config.characterHeight*ms(w.eyeHeightRatio,0,1),U=M.position.y+n.config.dummies.height*ms(w.aimHeightRatio,0,1),k=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);S=Math.atan2(U-C,Math.max(vi,k))}}const T=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;S=ms(S,-T,T);const b=x?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=Zl(i.headPitch,S,b,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Zl(i.bodyPitch,i.headPitch*ms(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const qd=1e-6,Co=Math.PI/180;function Po(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function hp(n,t,e){const i=n.character.position,s=Math.max(0,e.homingConeDeg)*Co,a=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>a||Math.abs(Ge(Math.atan2(c,h)-t))>s||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function dp(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function up(n,t){const e=n.abilities,i=n.character.position,s=Math.max(1,Math.floor(t.perWave)),a=t.spreadDeg*Co,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=hp(n,e.channelYaw,t);for(let c=0;c<s;c++){const h=(c-(s-1)*.5)*a,f=e.channelYaw+h,d=(c-(s-1)*.5)*o,u=Math.sin(f),g=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+g*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(dp(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Po(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function fp(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const s=[];for(const a of i.pending){if(a.delay-=t,a.delay>0){s.push(a);continue}const o={id:++i.nextId,x:a.x,y:a.y,z:a.z,dirX:Math.sin(a.yaw),dirZ:Math.cos(a.yaw),speed:a.speed,life:e.life,radius:e.radius,targetIndex:a.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Co,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:a.wave};i.projectiles.push(o),i.volleyId+=1,Po(n,"projectile-fire",i.volleyId,o)}i.pending=s}function jl(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Po(n,"channel-end",0,n.character.position))}function pp(n,t,e,i,s,a){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=a==="skill2"?e.skill2Pressed:e.attackHeld,h=s&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){jl(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Po(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=na(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,qd),up(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){jl(n,i);break}}function mp(n,t,e){const i=Math.max(0,e.homingConeDeg)*Co,s=Math.max(0,e.homingRange),a=Math.atan2(t.dirX,t.dirZ);let o=-1,r=s+qd;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Ge(Math.atan2(h,f)-a))>i||(o=l,r=d)}return o}function gp(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=mp(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Ge(h-f),u=r.turnRate*t,g=Math.max(-u,Math.min(u,d)),y=f+g;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(!(f*f+d*d>u*u)){Ro(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const xp={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params;pp(n,t,e,a,s,i.cfg.slot),fp(n,t,a),gp(n,t,a)}},Yo=1e-6;function jd(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function vp(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),jd(n,"ring-place",i.id,e)}function _p(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Yo),a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),y=g>Yo?f/g:0,m=g>Yo?d/g:1;Ro(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:m,knockback:e.knockback})}jd(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const yp={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;s&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&vp(n,a),_p(n,t,a)}},Mp={channelVolley:xp,groundRing:yp};function Sp(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const s=i.paramsRef,a=s?e[s]:void 0;if(!a||typeof a!="object")throw new Error(`[skills] ${i.id}: paramsRef "${s??""}" 在 core.abilities 中不存在`);return{cfg:i,params:a}})}function bp(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const s=Mp[i.cfg.kind];if(!s)continue;const a=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;s.update({world:n,dt:t,intents:e,skill:i,onWeapon:a})}}function wp(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Kd(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Ep(n,t,e){bp(n,t,e)}function Zo(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Kl=1e-6;function Jl(n,t,e){return n<t?t:n>e?e:n}function Jd(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Qd(n){const t=n.camera,e=Jd();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Tp(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Jl((e.radius-d)/Math.max(Kl,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*u),s+=g,a+=c.position.x*g,o+=c.position.z*g,r+=1}const l=s<=0?0:Jl(s/(s+Math.max(Kl,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=a/s,h=o/s;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function Ap(n){const t=[],e=n.ground.size;t.push(qi("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(qi(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(qi(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(qi(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(qi(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(qi(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function qi(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const ni=1e-6;function mo(n,t,e){return n<t?t:n>e?e:n}function ia(n,t,e,i,s,a,o){const r=s*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+a+ni||c.maxY<i-o-ni||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Jc(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+s+ni||l.minY>=o-ni)continue;const c=mo(t.x,l.minX,l.maxX),h=mo(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>ni*ni){const g=Math.sqrt(u),y=(e-g)/g;t.x+=f*y,t.z+=d*y}else{const g=t.x-l.minX,y=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,x=Math.min(g,y,m,p);x===g?t.x=l.minX-e:x===y?t.x=l.maxX+e:x===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return a}function Qc(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+ni||o.minY>=a-ni)continue;const r=mo(t.x,o.minX,o.maxX),l=mo(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-ni)return!0}return!1}const gi=1e-6,ws=Math.PI/180;function tl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Gr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function tu(n){n.arrows.length=0}function Rp(n,t,e,i,s,a,o,r,l,c,h){const f=i-n,d=a-e,u=f*f+d*d;let g=0;u>gi&&(g=((o-n)*f+(r-e)*d)/u,g=Math.max(0,Math.min(1,g)));const y=n+f*g,m=e+d*g,p=y-o,x=m-r;if(p*p+x*x>h*h)return-1;const v=t+(s-t)*g;return v<l-.1||v>l+c?-1:g}function Cp(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=gi)return-1;const s=n.character.position,a=Math.max(0,e.homingConeDeg)*ws,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+gi;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-s.x,d=h.position.z-s.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(tl(Math.atan2(f,d)-t))>a||u<c&&(l=h.id,c=u)}}return l}function Pp(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const s=n.character.position,a=Math.atan2(i.position.x-s.x,i.position.z-s.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ws;return t+_s(tl(a-t),-o,o)}function Lp(n,t,e,i,s,a){const o=n.config.combat.bow.trajectory,r={vy:a*Math.sin(Math.max(0,o.launchPitchDeg)*ws),horizontal:0};if(r.horizontal=a*Math.cos(Math.max(0,o.launchPitchDeg)*ws),s<=0)return r;const l=n.dummies.find(y=>y.id===s);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(gi,a),f=l.position.y+n.config.dummies.height*_s(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,g=_s(u,-a*.45,a*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,a*a-g*g))}}function Dp(n,t,e){const i=n.config.combat.bow.trajectory,s=Math.max(0,Math.min(1,t)),a=i.speedMin+(i.speedMax-i.speedMin)*s,o=n.character.position,r=Cp(n,e),l=Pp(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,g=Lp(n,f,u,d,r,a),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ws};return n.arrows.push(y),Gr(n,"arrow-shot",s,y),y}function _s(n,t,e){return n<t?t:n>e?e:n}function kp(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,s=n.config.dummies.radius,a=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const _=n.dummies[c.stuckDummy];if(_){const R=Math.cos(_.bodyYaw),w=Math.sin(_.bodyYaw);c.x=_.position.x+c.offX*R+c.offZ*w,c.y=_.position.y+c.offY,c.z=_.position.z-c.offX*w+c.offZ*R,c.yaw=_.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const _=n.dummies.find(R=>R.id===c.targetId);if(!_)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>gi){const w=Math.atan2(_.position.x-c.x,_.position.z-c.z),S=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=S+_s(tl(w-S),-T,T);c.vx=Math.sin(b)*R,c.vz=Math.cos(b)*R;const M=Math.hypot(_.position.x-c.x,_.position.z-c.z);if(M>.3){const C=M/R,k=(_.position.y+a*_s(i.aimHeightRatio,0,1)-c.y+.5*r*C*C)/C,N=Math.max(0,i.verticalTurnRate)*t;c.vy+=_s(k-c.vy,-N,N)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,g=f+c.vy*t,y=d+c.vz*t;let m=-1,p=2;if(o)for(let _=0;_<n.dummies.length;_++){const R=n.dummies[_],w=Rp(h,f,d,u,g,y,R.position.x,R.position.z,R.position.y,a,s+i.radius);w>=0&&w<p&&(p=w,m=_)}if(m>=0){const _=n.dummies[m];c.x=h+(u-h)*p,c.y=f+(g-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=m;const R=Math.cos(_.bodyYaw),w=Math.sin(_.bodyYaw),S=c.x-_.position.x,T=c.z-_.position.z;c.offX=S*R-T*w,c.offZ=S*w+T*R,c.offY=c.y-_.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-_.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);Ro(n,m,{type:"light",duration:.22,dirX:M>gi?c.vx/M:0,dirZ:M>gi?c.vz/M:1,knockback:.14}),Gr(n,"arrow-land",_.id,c),l.push(c);continue}const x=ia(n.boxes,u,y,g+.4,.04,0,6),v=Number.isFinite(x)?x:0;if(g<=v+.02&&c.vy<0){c.x=u,c.y=v+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const _=Math.atan2(-c.vy,Math.max(gi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(_,Math.max(0,i.stickMinPitchDeg)*ws),c.rest=Math.max(.2,i.stickSec),Gr(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=g,c.z=y,l.push(c)}n.arrows=l}const Vr=1e-6,Ip=Math.PI/180;function Xr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function el(n,t,e){return n<t?t:n>e?e:n}function Lo(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Wr(n){const t=n.id,e=n.windowId;Object.assign(n,Lo()),n.id=t,n.windowId=e}function Fp(n){Wr(n)}function eu(n){Wr(n.playerLink);for(const t of n.dummies)Wr(t.link)}function Up(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function $r(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function go(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Lo()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function zp(n,t){const e=n.config.links.search,i=n.character.position,s=el(e.maxAngleDeg,0,180)*Ip;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<Vr||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Ge(d-t))>s||f<r&&(r=f,a=l.id,o=d)}return{id:a,yaw:o,dist:a>0?r:0}}function Np(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=na(n,t),l=zp(n,r),c=l.id>0?l.yaw:r,h=l.id>0?el(l.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=c,a.targetId=l.id,a.targetDist=l.dist,a.travel=h,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Xr(n,"link-start",a.id)}function Op(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){go(n);return}if(e.weapon!==n.combat.weapon){go(n);return}e.timer+=t;const s=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const l=s(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Xr(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Xr(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?el(r/o,0,1):1,e.phase==="active"&&i.active>Vr){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Vr,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Bp(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&go(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&$r(n,"sprint"),s.prevSprinting=r,Op(n,t);const l=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&Np(n,e,l,o.weapon)}const Yr=1e-6;function xi(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function nu(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Do(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=nu()}function Hp(n){return{weapon:Gi[Math.max(0,n-1)]??Gi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:nu()}}function Gp(n,t){return na(n,t)}function Vp(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function iu(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Gp(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,xi(n,"attack-start",i)}function su(n){return Math.max(0,n.config.combat.settle)}function Zr(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];iu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:su(n),lunge:Vp(n,i.lunge[e-1]??0)},e)}function Ql(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,iu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:su(n),lunge:i.lunge},0),Dp(n,e,n.combat.attackFacing),xi(n,"charge-release",e);const s=n.config.combat.bow;s.recoilSpeed>0&&(n.kick.x-=Math.sin(n.combat.attackFacing)*s.recoilSpeed,n.kick.z-=Math.cos(n.combat.attackFacing)*s.recoilSpeed)}function Xp(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const l=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",xi(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",xi(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Zr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>Yr&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Zr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function Wp(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Gi.length){const l=Gi[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Do(n),go(n),xi(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,xi(n,"combo-reset",0))),Xp(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Zr(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,xi(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,Yr)),s.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Ql(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=s.bow.minChargeToFire?Ql(n,e,l):xi(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>Yr)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,s.lungeCurve),f=y=>c*(1-Math.pow(1-Math.min(1,Math.max(0,y/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let g=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);g=Math.min(g,Math.max(0,s.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*g,n.impulse.z=Math.cos(i.attackFacing)*g}}const qr=1e-6;function qo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $p(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function au(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function th(n,t,e){return n<t?t:n>e?e:n}function Yp(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=a.x,f=a.z;for(;c<l-qr;){const d=Math.min(l,c+r),u=a.x+t*d,g=a.z+e*d,y=th(u,o.minX,o.maxX),m=th(g,o.minZ,o.maxZ),p={x:y,y:a.y,z:m};if(Qc(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=m,c=d,y!==u||m!==g))break}return{x:h,z:f}}function Zp(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,$r(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&qo(n,"dash-ready",0)}const a=n.combat,o=a.weapon==="bow"&&(a.charging||a.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(a.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(a.charging=!1,a.charge=0,a.phase!=="idle"&&Do(n));const l=Qf(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?s.blinkCooldown:s.rollCooldown,f){const d=Yp(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),$r(n,"blink"),qo(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(qr,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+h*s.rollDistance,qo(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(qr,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const en=1e-6,jr=Math.PI*2,qp=7,jp=18;function Kp(n){return Math.atan2(Math.sin(n),Math.cos(n))}function eh(n,t,e,i){return n+Kp(t-n)*(1-Math.exp(-Math.max(e,en)*i))}function nl(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Jp(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Xd(),link:Lo()})}return t}function Qp(n){const t=$o.indexOf(n);return $o[(t+1)%$o.length]}function ou(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Fp(i.link)}n.dummyAttackCount=0}function tm(n,t,e){const i=Zo(n)*jr,s=Math.sqrt(Zo(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+Zo(n)*.8)}function em(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function nm(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(em(t,i),en);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",nl(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function im(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>en?s/o:0,l=o>en?a/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&tm(n,t,e);const y=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(y,m);p>en&&(c=y/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>en&&(f=Math.atan2(c,h)):o>en&&(f=Math.atan2(r,l)),e.leashRadius>en&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const y=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;c=c*(1-y)+m*y,h=h*(1-y)+p*y;const x=Math.hypot(c,h);x>en&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function sm(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+en&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,nl(n,"dummy-attack",e))}nm(n,e,t,i);const s=im(n,e,i),a=n.config.worldBounds;(s.x>0&&e.position.x>=a.maxX-en||s.x<0&&e.position.x<=a.minX+en)&&(s.x=0),(s.z>0&&e.position.z>=a.maxZ-en||s.z<0&&e.position.z<=a.minZ+en)&&(s.z=0);const o=1-Math.exp(-Math.max(i.acceleration,en)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*o,e.facing=s.facing,e.bodyYaw=eh(e.bodyYaw,e.facing,qp,t),e.headYaw=eh(e.headYaw,e.facing,jp,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Jc(n.boxes,e.position,i.radius,i.height,c))if(Qc(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,x=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=ia(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+en&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const g=Math.hypot(e.velocity.x,e.velocity.z),y=Math.min(n.config.strideSpeedCap,g/Math.max(n.config.moveSpeed,en)),m=Math.max(n.config.strideLength*(1+y*n.config.strideSpeedGain),en);e.stride=m,e.gaitPhase=(e.gaitPhase+u/m*jr)%jr}function am(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Qp(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,nl(n,"dummy-mode",s)}for(const s of n.dummies)sm(n,t,s,i)}const Pn=1e-6,nh=Math.PI*2;function ih(n,t){return Math.sqrt(n*n+t*t)}function ya(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function om(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,n.kick.x=0,n.kick.z=0,Do(n)}function rm(n,t,e){const i=n.character,s=n.config,a=ia(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,n.kick.x=0,n.kick.z=0,Do(n),eu(n),au(n),Kd(n),tu(n),po(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Zc,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function cm(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=ih(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&a.x>=h.maxX-Pn||r<0&&a.x<=h.minX+Pn)&&(r=0),(l>0&&a.z>=h.maxZ-Pn||l<0&&a.z<=h.minZ+Pn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",g=f||u||d;s.sprinting=!g&&e.sprintHeld&&c>Pn;const y=i.combat.weapons[n.combat.weapon];let m=y?y.moveMultiplier:1;u||d?m=0:f?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*m;{const k=g?i.skillDecel:c>Pn?i.acceleration:i.friction,N=1-Math.exp(-k*t);o.x+=(r*p-o.x)*N,o.z+=(l*p-o.z)*N}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,ya(n,"jumped",i.jumpSpeed)),n.events.some(k=>k.type==="blink"&&k.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0,n.kick.x=0,n.kick.z=0);const v=a.x,_=a.z;if(a.x+=(o.x+n.impulse.x+n.kick.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.kick.z+n.playerHurt.knockZ)*t,n.kick.x!==0||n.kick.z!==0){const k=Math.exp(-Math.max(0,i.combat.bow.recoilDecay)*t);n.kick.x*=k,n.kick.z*=k,Math.abs(n.kick.x)<1e-4&&(n.kick.x=0),Math.abs(n.kick.z)<1e-4&&(n.kick.z=0)}if(Jc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(Qc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=v,a.z=_,o.x=0,o.z=0;else{const k=a.x-v,N=a.z-_;Math.abs(k)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}ya(n,"blocked",1)}a.x<h.minX?(a.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):a.x>h.maxX&&(a.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),a.z<h.minZ?(a.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):a.z>h.maxZ&&(a.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=ia(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&w>a.y+Pn&&w-a.y<=i.stepHeight+Pn&&(a.y=w,o.y=0,ya(n,"stepUp",w));const S=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const T=ia(n.boxes,a.x,a.z,S,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&a.y<=T&&o.y<=0?(a.y=T,o.y=0,s.grounded||ya(n,"landed",T),s.grounded=!0):s.grounded=!1;const b=ih(a.x-v,a.z-_);s.distance+=b;const M=b/Math.max(t,Pn),C=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,Pn)),U=Math.max(i.strideLength*(1+C*i.strideSpeedGain),Pn);s.stride=U,s.gaitPhase=(s.gaitPhase+b/U*nh)%nh}const Kr=1e-6,sh=2.399963229728653;function Ui(n,t,e){return n<t?t:n>e?e:n}function ah(n,t,e,i,s,a,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,g,y;f<Kr?(u=r,g=l,y=d):(u=c/f,g=h/f,y=d-f);const m=y+o;n.x-=u*m*s,n.z-=g*m*s,t.x+=u*m*a,t.z+=g*m*a}function lm(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*sh;ah(e[f].position,e[d].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*sh;ah(i,e[f].position,s,a,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Jc(n.boxes,h.position,a,n.config.dummies.height,l),h.position.x=Ui(h.position.x,c.minX,c.maxX),h.position.z=Ui(h.position.z,c.minZ,c.maxZ)}function hm(n,t,e,i,s,a,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=Ui(r.minScale,0,1);if(l<Kr||c<=0||h>=1)return 1;const f=s+o,d=Ui(r.approachDot,0,.99);let u=0;for(const g of a){const y=g.position.x-n,m=g.position.z-t,p=Math.hypot(y,m);if(p>=f+c)continue;if(p<Kr){u=1;continue}const x=(e*y+i*m)/(l*p);if(x<=d)continue;const v=Ui(1-(p-f)/c,0,1),_=Ui((x-d)/(1-d),0,1);u=Math.max(u,v*_)}return 1-(1-h)*Ui(u,0,1)}function dm(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=hm(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const oh=1e-6,um=Math.PI/180;function fm(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function pm(n,t,e){return n<t?t:n>e?e:n}function mm(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>oh&&(o=Math.atan2(e.moveX,e.moveZ));const l=pm(i.maxAngleDeg,0,180)*um;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-a.x,y=u.position.z-a.z,m=Math.hypot(g,y);if(m<oh||m>i.range)continue;const p=Math.atan2(g,y),x=Math.abs(Ge(p-o));if(x>l)continue;const v=m-i.frontBias*Math.cos(x);v<c&&(c=v,h=u.id,f=p,d=m)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Gn=1e-6;function gs(n,t,e){return n<t?t:n>e?e:n}function rh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function gm(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(k,N)=>{const P=k.position.x-a.x,L=k.position.z-a.z,F=Math.hypot(P,L);if(F<Gn||F>N)return 0;const I=gs((N-F)/Math.max(Gn,N-i.nearDistance),0,1);let W=I*(i.modeWeight[k.mode]??.5);return k.attackPhase==="active"&&(W+=i.attackBoost*I),W},r=[];let l=0,c=!1,h=!1,f=!1;for(const k of n.dummies){const N=o(k,i.threatRange),P=k.position.x-a.x,L=k.position.z-a.z,F=Math.hypot(P,L);N>0&&(r.push({id:k.id,x:k.position.x,z:k.position.z,dx:P,dz:L,yaw:Math.atan2(P,L),w:N}),l+=N,F<=i.approachDist&&(i.modeWeight[k.mode]??.5)>=i.hostileModeWeight&&(f=!0)),F>Gn&&F<=i.recoveryDist&&(c=!0),(k.attackPhase==="windup"||k.attackPhase==="active")&&F<=i.threatRange&&(h=!0)}const d=l<=0?0:gs(l/(l+Math.max(Gn,i.saturation)),0,1),u=r.length>0,g=s.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Gn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(s.active=y||p,!s.active){s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((k,N)=>N.w-k.w);const x=r.slice(0,Math.max(1,i.maxThreats)),v=r[0],_=Math.atan2(v.dx,v.dz),R=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let S=0,T=0,b=0;for(const k of x){const N=Math.abs(rh(k.yaw-_))/Math.PI;let P=k.w/(1+Math.max(i.spreadFalloff,0)*N*N);k!==v&&i.behindFalloff<1&&Math.abs(rh(k.yaw-w))>R&&(P*=Math.max(i.behindFalloff,0)),S+=k.x*P,T+=k.z*P,b+=P}s.mainId=v.id,s.mainYaw=_;const M=n.dummies.find(k=>k.id===v.id),C=(M?M.position.y:0)+n.config.dummies.height*gs(i.aimHeightRatio,0,1),U=a.y+n.config.characterHeight*gs(i.eyeHeightRatio,0,1);s.mainPitch=Math.atan2(C-U,Math.max(Gn,Math.hypot(v.dx,v.dz))),s.centroidYaw=b>Gn?Math.atan2(S/b-a.x,T/b-a.z):_,s.threatCount=r.length,s.threat=d}function xm(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function vm(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Gn||s>e.threatRange)return 0;const a=Math.max(Gn,e.threatRange-e.nearDistance),o=gs((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Gn,e.modeWeight.attack??1.5);return gs(r/l,0,1)}function _m(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function ym(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Ap(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Hp(1),playerLink:Lo(),arrows:[],arrowSeq:0,abilities:wp(),skills:Sp(n),impulse:{x:0,z:0},kick:{x:0,z:0},targeting:fm(),turnInPlace:ap(),playerHurt:Xd(),hitCount:0,dash:{...$p(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Jd(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:_m(),dummies:Jp(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Mm(n){om(n),ou(n),eu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Zc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Kd(n),tu(n),au(n),Qd(n),po(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function ch(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Mm(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?mm(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Bp(n,t,e),n.modules.combat&&Wp(n,t,e),n.modules.dash&&Zp(n,t,e),n.modules.movement&&cm(n,t,e),n.modules.gaze&&gm(n,t,e),n.modules.orientation&&lp(n,t,e),cp(n,t,e),n.modules.dummies&&am(n,t,e),tp(n,t),Up(n,t),n.modules.abilities&&Ep(n,t,e),n.modules.combat&&kp(n,t),n.modules.dummies&&(sp(n,t),n.modules.separation&&(lm(n),dm(n))),n.modules.camera?Tp(n):Qd(n),n}function Sm(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};ch(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){ch(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const ru={slopPx:12,longPressMs:450,doubleTapMs:280};function bm(n,t,e=ru.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function wi(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function wm(n=ru){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,l){if(t.has(a))return null;for(const c of t.values())if(c.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),wi(s,"press",0,0,0,1)},move(s,a,o,r){const l=i(s);if(!l)return null;l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,wi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(s,a,o,r){const l=i(s);if(!l)return null;t.delete(s),l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return wi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),wi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:a,y:o}),wi(l.button,"tap",c,h,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),wi(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,wi(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const jo=.001,Em=18;function Jr(n,t,e){return n<t?t:n>e?e:n}function Qr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Tm(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Am(n,t,e,i,s=Em){const a=Tm(t);if(!a)return{state:Qr(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<jo)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<jo?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<jo)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Jr(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Rm(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Jr(r,s,a):Jr(n,s,a)}function Cm(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Pm(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ko=["jump","sprint","reset","attack","skill2"],Lm=8,Dm=16,Jo=10,lh=14,hh=140,km=18,Im=16,Fm=400,Um=1.0001;function io(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function zm(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&io(e)}function Nm(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,g=0,y=null,m=-1,p=0,x=0,v=0,_=0,R=!1,w=0,S=1,T=0,b=null,M=0,C=0,U=!1,k=null,N=null,P=0,L=0,F=0,I=0,W=!1,tt=!0,pt=-1;const ot=wm({slopPx:lh,longPressMs:450,doubleTapMs:350});let ht=[],K=null;const Y=new Set;function gt(B){B&&ht.push(B)}const J=new Map;let bt=Qr(),jt=!1,Ct=1;function Lt(){const B=Array.from(J.values()),st=s(),ut=Am(bt,B,st.pinchGain,st.maxStepRatio,km);if(bt=ut.state,jt=ut.pinching,ut.scale!==1&&(Ct*=ut.scale),ut.started||ut.armedNow)b=null,U=!0,k=null;else if(ut.ended&&o===null&&B.length===1){const Ft=B[0];o=Ft.id,r=Ft.x,l=Ft.y,c=0,h=0,f=Ft.x,d=Ft.y,R=!1,w=0,S=1,T=0,performance.now(),b=null,U=!0,k=null}}const ft={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Kt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,fe=0;const qt={},It=new Set,Rt=[];function yt(){for(const B of Ko)qt[B]!==void 0&&(qt[B]=void 0),$(B);ot.reset(),Y.clear(),J.clear(),bt=Qr(),jt=!1,o=null,c=0,h=0,f=0,d=0,R=!1,w=0,S=1,T=0,p=0,x=0,v=0,_=0,y=null,m=-1,b=null,U=!1,k=null,N=null,pt=-1,F=0,I=0,W=!1,tt=!0}const Tt=()=>{document.hidden&&yt()},D=B=>{if(B.clientX===0&&B.clientY===0){g++;return}if(io(B.target)||zm(B.clientX,B.clientY)){Y.add(B.pointerId);return}if(Y.delete(B.pointerId),J.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!jt){y=null,m=-1,o=B.pointerId,r=B.clientX,l=B.clientY,c=0,h=0,f=B.clientX,d=B.clientY,performance.now();const st=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);R=st,w=0,S=1,T=0,p=st?B.screenX:0,x=st?B.screenY:0,v=p,_=x,b=B.pointerId,M=B.clientX,C=B.clientY,U=!1}Lt()},E=B=>{if(B.pointerId===N&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(P!==0||L!==0)||(tt?(F=B.clientX-P,I=B.clientY-L):(P=B.clientX,L=B.clientY,tt=!0,F=0,I=0))),gt(ot.move(B.pointerId,B.clientX,B.clientY,performance.now())),!Y.has(B.pointerId)&&J.has(B.pointerId)&&(J.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),Lt()),Y.has(B.pointerId)||B.pointerId!==o)return;const st=performance.now();if(y===B.pointerId&&st-m<150){g++;return}const ut=B.clientX,Ft=B.clientY;if(ut===0&&Ft===0&&(r!==0||l!==0)){g++;return}const $t=ut-f,z=Ft-d,vt=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),j=vt?B.screenX:0,at=vt?B.screenY:0,wt=vt&&(j!==0||at!==0),Mt=j-v,Jt=at-_;if(R&&wt){const Me=Math.hypot(Mt,Jt),Pe=Math.hypot($t,z);if(Me>3){if(w=0,T<30&&Pe>6&&Mt*$t+Jt*z>.7*Me*Pe){const De=Me/Pe;De>.2&&De<5&&(S+=(De-S)*.3,T++)}}else Pe>12&&(w++,w>=2&&(R=!1))}const ae=Math.hypot($t,z);if(!R){const Me=u<0?Number.POSITIVE_INFINITY:st-u,Pe=wt?Math.hypot(Mt,Jt):1/0;ae>28&&(Me<200||Pe<ae*.4)&&(r+=$t,l+=z,g++)}f=ut,d=Ft,v=j,_=at,B.pointerId===b&&Math.hypot(B.clientX-M,B.clientY-C)>Lm&&(U=!0);let oe,se;R&&wt?(oe=(j-p)/S,se=(at-x)/S):(oe=ut-r,se=Ft-l);const be=Math.hypot(oe,se),xe=a();be>xe&&(oe*=xe/be,se*=xe/be);const Je=Math.hypot(c,h),Qe=Math.hypot(oe,se);if(Je>10&&Qe>10){const Me=Math.abs(Math.atan2(c*se-h*oe,c*oe+h*se)),Pe=Math.max(Je,Qe)*Me,De=Math.max(Math.hypot($t,z),Math.hypot(Mt,Jt)/Math.max(.2,S));if(Me>.6&&De<Math.max(6,Pe*.5)){g++;return}}c=oe,h=se};function $(B){if(!ft[B])return;ft[B]=!1,B==="attack"&&(Kt.attackReleased=!0);const st=document.getElementById(`btn-${B}`);st==null||st.classList.remove("is-down")}function rt(){o!==null&&(y=o,m=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,w=0,S=1,T=0,p=0,x=0,v=0,_=0)}const ct=B=>{const st=J.delete(B.pointerId),ut=Y.delete(B.pointerId);st&&Lt(),B.pointerId===N&&(N=null,W?pt=performance.now():(F=0,I=0,pt=-1)),gt(ot.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const Gt of Ko)qt[Gt]===B.pointerId&&(qt[Gt]=void 0,$(Gt));const Ft=!st&&!ut&&J.size<=1&&o!==null;(B.pointerId===o||J.size===0||Ft)&&rt(),!ut&&B.pointerId===b&&(!U&&!io(B.target)&&(k={x:B.clientX,y:B.clientY}),b=null)};for(const B of Ko){const st=document.getElementById(`btn-${B}`);if(!st)continue;const ut=B==="attack"||B==="skill2",Ft=z=>{if(z.preventDefault(),qt[B]===void 0){qt[B]=z.pointerId,ft[B]=!0,B==="jump"&&(Kt.jump=!0),B==="reset"&&(Kt.reset=!0),B==="sprint"&&(Kt.sprintPressed=!0),B==="attack"&&(Kt.attackPressed=!0),B==="skill2"&&(Kt.skill2=!0),st.classList.add("is-down"),gt(ot.begin(B,z.pointerId,z.clientX,z.clientY,performance.now()));try{st.setPointerCapture(z.pointerId)}catch{}ut&&(N=z.pointerId,P=z.clientX,L=z.clientY,tt=!(z.clientX===0&&z.clientY===0),F=0,I=0,W=!1,pt=-1)}},Gt=z=>{qt[B]===z.pointerId&&(qt[B]=void 0,$(B),gt(ot.end(z.pointerId,z.clientX,z.clientY,performance.now())))},$t=z=>{qt[B]===z.pointerId&&(qt[B]=void 0,$(B),gt(ot.cancel(z.pointerId,performance.now())))};st.addEventListener("pointerdown",Ft),st.addEventListener("pointerup",Gt),st.addEventListener("pointercancel",$t),Rt.push(()=>{st.removeEventListener("pointerdown",Ft),st.removeEventListener("pointerup",Gt),st.removeEventListener("pointercancel",$t)})}const nt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of nt){const st=ut=>{ut.preventDefault(),G=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",st),Rt.push(()=>B.removeEventListener("pointerdown",st))}const kt=B=>{const st=B.key.toLowerCase();if((st===" "||st.startsWith("arrow"))&&B.preventDefault(),It.has(st))return;It.add(st),st===" "&&(Kt.jump=!0),st==="r"&&(Kt.reset=!0),st==="shift"&&(Kt.sprintPressed=!0),st==="j"&&(Kt.attackPressed=!0),st==="k"&&(Kt.skill2=!0),st>="1"&&st<="5"&&(G=Number(st)),st>="6"&&st<="9"&&(fe=Number(st)-5);const ut=Math.max(Um,s().keyStep||1.12);(st==="="||st==="+")&&(Ct*=ut),(st==="-"||st==="_")&&(Ct/=ut)},q=B=>{const st=B.key.toLowerCase();It.has(st)&&(It.delete(st),st==="j"&&(Kt.attackReleased=!0))},dt=B=>{if(io(B.target))return;B.preventDefault();const st=B.deltaMode===1?B.deltaY*Im:B.deltaMode===2?B.deltaY*Fm:B.deltaY;Ct*=Cm(st,s().wheelStep)},Bt=B=>{B.preventDefault()},it=()=>{u=performance.now()};window.addEventListener("resize",it),window.addEventListener("orientationchange",it);const xt=typeof window<"u"?window.visualViewport:null;return xt&&(xt.addEventListener("resize",it),xt.addEventListener("scroll",it)),window.addEventListener("pointerdown",D),window.addEventListener("pointermove",E),window.addEventListener("pointerup",ct),window.addEventListener("pointercancel",ct),window.addEventListener("blur",yt),document.addEventListener("visibilitychange",Tt),window.addEventListener("keydown",kt),window.addEventListener("keyup",q),window.addEventListener("wheel",dt,{passive:!1}),window.addEventListener("gesturestart",Bt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:a(),badMoves:g,screenOk:R,originSX:p,originSY:x,screenX:v,screenY:_,scale:S}},peekAim(){const B=performance.now(),st=Math.hypot(F,I),ut=N!==null||pt>=0&&B-pt<hh;if(!(ut&&W&&st>=Jo))return{active:!1,holding:ut,x:0,z:0,dx:F,dy:I};const Gt=i(),$t=F/st,z=I/st,vt=Gt.rightX*$t+Gt.forwardX*-z,j=Gt.rightZ*$t+Gt.forwardZ*-z,at=Math.hypot(vt,j)||1;return{active:!0,holding:ut,x:vt/at,z:j/at,dx:F,dy:I}},sample(){var Z;const B=a();let st=o!==null?Math.max(-1,Math.min(1,c/B)):0,ut=o!==null?Math.max(-1,Math.min(1,h/B)):0,Ft=0,Gt=0;(It.has("a")||It.has("arrowleft"))&&(Ft-=1),(It.has("d")||It.has("arrowright"))&&(Ft+=1),(It.has("w")||It.has("arrowup"))&&(Gt-=1),(It.has("s")||It.has("arrowdown"))&&(Gt+=1),st+=Ft,ut+=Gt;let $t=Math.hypot(st,ut);$t>1&&(st/=$t,ut/=$t,$t=1);const z=st,vt=ut;$t<e&&(st=0,ut=0);const j=i();let at=j.rightX*st+j.forwardX*-ut,wt=j.rightZ*st+j.forwardZ*-ut;const Mt=Math.hypot(at,wt);Mt>1&&(at/=Mt,wt/=Mt);const Jt=performance.now();gt(ot.poll(Jt));const ae=Math.hypot(F,I);N!==null&&(ae>=Dm?W=!0:ae<Jo&&(W=!1));const oe=N!==null||pt>=0&&Jt-pt<hh,se=oe&&W&&ae>=Jo;let be=0,xe=0;if(se){const Pt=F/ae,At=I/ae,ee=j.rightX*Pt+j.forwardX*-At,te=j.rightZ*Pt+j.forwardZ*-At,de=Math.hypot(ee,te)||1;be=ee/de,xe=te/de}!oe&&N===null&&(F=0,I=0,pt=-1,W=!1);const Je=k;k=null;const Qe=Ct;Ct=1;const Me={moveX:at,moveZ:wt,jumpPressed:Kt.jump,sprintHeld:ft.sprint||It.has("shift"),sprintPressed:Kt.sprintPressed,resetPressed:Kt.reset,attackPressed:Kt.attackPressed,attackHeld:ft.attack||It.has("j"),attackReleased:Kt.attackReleased,skill2Pressed:Kt.skill2,weaponSlot:G,dummyClickId:fe,aimX:be,aimZ:xe,aimActive:se};Kt.jump=!1,Kt.reset=!1,Kt.sprintPressed=!1,Kt.attackPressed=!1,Kt.attackReleased=!1,Kt.skill2=!1,G=0,fe=0;const Pe=ht.map(Pt=>bm(Pt,j,lh));ht=[],Pe.length>0&&(K=Pe[Pe.length-1]);const De=o!==null?"pointer":It.size>0?"keyboard":"idle";return{intents:Me,stickX:st,stickY:ut,stickRawX:z,stickRawY:vt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:R,stickOriginSX:p,stickOriginSY:x,stickScreenX:v,stickScreenY:_,stickScale:S,stickVpTop:((Z=Pm())==null?void 0:Z.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:F,aimDY:I,source:De,tap:Je,zoomScale:Qe,gestures:Pe,lastGesture:K}},dispose(){window.removeEventListener("pointerdown",D),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",ct),window.removeEventListener("pointercancel",ct),window.removeEventListener("blur",yt),document.removeEventListener("visibilitychange",Tt),window.removeEventListener("keydown",kt),window.removeEventListener("keyup",q),window.removeEventListener("wheel",dt),window.removeEventListener("resize",it),window.removeEventListener("orientationchange",it),xt&&(xt.removeEventListener("resize",it),xt.removeEventListener("scroll",it)),window.removeEventListener("gesturestart",Bt),ot.reset();for(const B of Rt)B()}}}const xo=1,vo=2,_o=4,cu=8,yo=16,js=32,lu=64,hu=128,Om=[[xo,"atk"],[vo,"dash"],[_o,"link"],[cu,"air"],[yo,"hurt"],[js,"aim"],[lu,"spr"],[hu,"chan"]];function ji(n){if(n===0)return"-";const t=Om.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Bm=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Hm=0,Gm=15,Qo=19,Vm=21,Xm=22,Wm=23,$m=24,Bn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},fn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Ln=n=>Math.round(n*180/Math.PI*10)/10,tr=Math.PI*2;function Ns(n){let t=n%tr;return t>Math.PI&&(t-=tr),t<-Math.PI&&(t+=tr),t}function Ym(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=xo),n.dash.phase!=="idle"&&(e|=vo),n.playerLink.phase!=="idle"&&(e|=_o),n.character.grounded||(e|=cu),n.playerHurt.type!=="none"&&(e|=yo),t.intents.aimActive&&(e|=js),n.character.sprinting&&(e|=lu),n.abilities.channeling&&(e|=hu),e}function Zm(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function qm(n){const t={sampleHz:n.sampleHz??Bn.sampleHz,sampleCapacity:n.sampleCapacity??Bn.sampleCapacity,eventCapacity:n.eventCapacity??Bn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Bn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Bn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Bn.aimDropDeg,freezeMs:n.freezeMs??Bn.freezeMs,freezeSpeed:n.freezeSpeed??Bn.freezeSpeed,stickLostMs:n.stickLostMs??Bn.stickLostMs,spikeMs:n.spikeMs??Bn.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",g=-1,y=-1,m=-1,p=0,x=-1e9,v=-1,_={},R=null,w=0,S=0,T=0,b=0;function M(P,L){const F=1/t.sampleHz,I=P[Hm];I-c<F-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(P),c=I)}function C(P,L,F,I,W,tt){const pt=_[P]??-1e9;if(L-pt<1.2)return;if(_[P]=L,P==="frameSpike"){let ht=0;for(const K of a)K.kind==="frameSpike"&&ht++;if(ht>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ot=i.slice(-7);tt&&(ot.length===0||ot[ot.length-1]!==tt)&&(ot=[...ot.slice(-6),tt]),a.push({kind:P,t:fn(L),tick:F,ms:Math.round(I),detail:W,ctx:ot}),P==="dirJump"?o.dirJumps++:P==="aimDrop"?o.aimDrops++:P==="moveFreeze"?o.freezes++:P==="stickLost"?o.stickLosts++:P==="stickJump"?o.stickJumps++:P==="stickBad"?o.stickBads++:P==="stickDrift"&&o.stickDrifts++}function U(P,L,F,I){s.length>=t.eventCapacity&&s.shift(),s.push({t:fn(F),tick:I,k:P,d:L})}function k(P){switch(P.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=P.tick;break}}function N(){const P=o,L=P.wallMs/1e3,F=P.gestures,I=ot=>Object.entries(F).filter(([ht])=>ht.endsWith(`.${ot}`)).reduce((ht,[,K])=>ht+K,0),W=[];if(W.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),W.push(`运行 ${L.toFixed(1)}s / ${P.frames} 帧 · ${P.fps.toFixed(1)}fps · 最大 ${P.dtMax.toFixed(0)}ms · 尖峰 ${P.spikes} · 步 ${P.steps}`),W.push(`摇杆活跃 ${L>0?Math.round(P.stickActiveMs/1e3/L*100):0}% · 手势 按下 ${I("press")}（单击 ${I("tap")} / 双击 ${I("doubleTap")} / 拖拽 ${I("drag")} / 长按 ${I("longPress")} / 打断 ${I("cancel")} / 拖放 ${I("release")}）`),W.push(`攻击 ${P.attacks}(中${P.hits}) · 受击 ${P.hurts} · 派生 ${P.links}(中${P.linkHits}) · 翻滚 ${P.rolls} 闪现 ${P.blinks} · 跳 ${P.jumps} · 复位 ${P.resets}`),W.push(`法杖 引导${P.channels} 飞弹${P.bolts} 电环${P.rings} · 弓蓄力${P.bowCharges} · 当前武器 ${u||"-"}`),W.push(`异常 ${P.dirJumps+P.aimDrops+P.freezes+P.stickLosts+P.stickJumps+P.stickBads+P.stickDrifts}（dir ${P.dirJumps} / aim ${P.aimDrops} / freeze ${P.freezes} / stick ${P.stickLosts} / stickJump ${P.stickJumps} / 坏指针 ${P.stickBads} / 坐标漂移 ${P.stickDrifts}） · 掉帧尖峰 ${P.spikes}`+(P.inTurns>0?` · 输入转向 ${P.inTurns} 次（最大 ${P.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ot of a.slice(-6)){W.push(`· ${ot.kind} @t${ot.t.toFixed(2)} tick${ot.tick} ${ot.ms>0?`${ot.ms}ms `:""}${ot.detail}`);const ht=ot.ctx.map(Y=>String(Y[Gm])).join(" "),K=ot.ctx.map(Y=>Y[Qo]===""||Y[Qo]==null?".":String(Y[Qo])).join(" ");if(W.push(`  yaw ${ht}`),W.push(`  in  ${K}`),ot.kind==="stickJump"||ot.kind==="stickBad"||ot.kind==="stickLost"){const Y=ot.ctx.map(J=>`${J[Vm]},${J[Xm]}`).join(" "),gt=ot.ctx.map(J=>`${J[Wm]},${J[$m]}`).join(" ");W.push(`  o   ${Y}`),W.push(`  p   ${gt}`)}}if(s.length>0){W.push("最近事件：");for(const ot of s.slice(-12))W.push(`  ${ot.t.toFixed(2)} ${ot.k} ${ot.d}`.trimEnd())}const tt=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",pt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return W.push(`摇杆坐标源 ${tt}${pt}`),W.push(`UA ${e.ua}`),W.join(`
`)}return{sample(P,L,F,I=0){o.frames++,L.stickHeld&&(L.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=I,o.wallMs+=F,F>o.dtMax&&(o.dtMax=F),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=P.time;const W=P.time;if(l<0&&(l=W),T=W,b=P.tick,!r)return;const tt=P.character,pt=Math.hypot(L.stickX,L.stickY),ot=Math.hypot(tt.velocity.x,tt.velocity.z);u=P.combat.weapon;const ht=Ym(P,L),K=tt.facing,gt=Math.hypot(L.intents.moveX,L.intents.moveZ)>.05?Math.atan2(L.intents.moveX,L.intents.moveZ):null;pt>.2&&(o.stickActiveMs+=F);const J=[fn(W),P.tick,Math.round(F*10)/10,fn(L.stickX),fn(L.stickY),fn(L.stickRawX),fn(L.stickRawY),L.stickHeld?1:0,L.source.slice(0,8),fn(L.intents.moveX),fn(L.intents.moveZ),fn(tt.position.x),fn(tt.position.z),fn(tt.velocity.x),fn(tt.velocity.z),Ln(K),Ln(tt.bodyYaw),ht,fn(tt.stride),gt===null?"":Ln(gt),L.stickId===null?"":L.stickId,Math.round(L.stickOriginX),Math.round(L.stickOriginY),Math.round(L.stickPxX),Math.round(L.stickPxY),L.stickBad,Math.round(L.stickVpTop),Math.round(L.stickOriginSX),Math.round(L.stickOriginSY),Math.round(L.stickScreenX),Math.round(L.stickScreenY),L.stickScreenOk?1:0,Math.round(L.stickScale*100)/100];M(J);const bt=W*1e3<v;if(F>t.spikeMs&&!bt&&W-l>.6&&(o.spikes++,C("frameSpike",W,P.tick,F,`dt ${F.toFixed(0)}ms fl=${ji(ht)}`,J)),h!==null&&!bt){const yt=Math.abs(Ln(Ns(K-h))),Tt=Math.abs(Ln(Ns(tt.moveYaw-f))),D=(d|ht)&(xo|vo|_o|yo)|ht&js,E=gt===null?null:Math.abs(Ln(Ns(K-gt))),$=gt===null||h===null?null:Math.abs(Ln(Ns(h-gt))),rt=E!==null&&$!==null&&E<$-.5,ct=(d&js)!==0&&(ht&js)===0&&gt===null,nt=E!==null&&(E<=12||rt);yt>t.aimDropDeg&&ct?C("aimDrop",W,P.tick,0,`${yt.toFixed(0)}° @aim→none stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${ji(ht)}`,J):yt>t.dirJumpDeg&&D===0&&!ct&&(nt?(o.inTurns++,yt>o.inTurnMax&&(o.inTurnMax=yt)):C("dirJump",W,P.tick,0,`${yt.toFixed(0)}° res${E===null?" 无输入":`${E.toFixed(0)}°`} yaw ${Ln(h)}→${Ln(K)} in ${gt===null?".":Ln(gt)}° mvΔ${Tt.toFixed(0)}° aim(${L.aimDX.toFixed(0)},${L.aimDY.toFixed(0)}) fl=${ji(d)}→${ji(ht)}`,J))}const jt=(ht&(xo|vo|_o|yo))!==0,Ct=P.tick-x<30;pt>.35&&ot<t.freezeSpeed&&!jt&&!Ct?(g<0&&(g=W),W-g>=t.freezeMs/1e3&&W>=y&&(C("moveFreeze",W,P.tick,(W-g)*1e3,`stick(${L.stickX.toFixed(2)},${L.stickY.toFixed(2)}) v${ot.toFixed(2)} ${L.source} fl=${ji(ht)}`,J),y=W+1.5,g=-1)):g=-1,L.stickHeld?(pt>p&&(p=pt),p>.35&&pt<.06?(m<0&&(m=W),W-m>=t.stickLostMs/1e3&&(C("stickLost",W,P.tick,(W-m)*1e3,`raw(${L.stickRawX.toFixed(2)},${L.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ji(ht)}`,J),m=-1,p=0)):m=-1):(p=0,m=-1);const Lt=L.stickScale>.2&&L.stickScale<5?L.stickScale:1,ft=L.stickScreenOk,Kt=ft?L.stickScreenX/Lt:L.stickPxX,G=ft?L.stickScreenY/Lt:L.stickPxY,fe=ft?L.stickOriginSX/Lt:L.stickOriginX,qt=ft?L.stickOriginSY/Lt:L.stickOriginY,It=Kt-fe,Rt=G-qt;if(L.stickHeld&&L.stickId!==null){const yt=R;if(yt&&yt.held&&yt.id===L.stickId){const Tt=Math.hypot(yt.dx,yt.dy),D=Math.hypot(It,Rt),E=Math.max(Tt,D),$=Math.hypot(Kt-yt.cx,G-yt.cy),rt=Math.abs(Ln(Ns(Math.atan2(Rt,It)-Math.atan2(yt.dy,yt.dx)))),ct=E*rt*Math.PI/180,nt=Math.hypot(fe-yt.ox,qt-yt.oy);if(E>18&&rt>35&&$<Math.max(5,ct*.35)&&C("stickJump",W,P.tick,0,`Δ${rt.toFixed(0)}° 手指只动${$.toFixed(0)}px(弧长应${ct.toFixed(0)}px) o(${Math.round(yt.ox)},${Math.round(yt.oy)})→(${Math.round(fe)},${Math.round(qt)}) 原点位移${nt.toFixed(0)}px p(${Math.round(Kt)},${Math.round(G)}) raw(${Math.round(It)},${Math.round(Rt)}) id${L.stickId} ${ft?"src=屏幕":"src=client"}`,J),ft&&yt.screenOk){const kt=Math.hypot(L.stickPxX-yt.x,L.stickPxY-yt.y),q=Math.hypot((L.stickScreenX-yt.sx)/Lt,(L.stickScreenY-yt.sy)/Lt);w+=kt-q,Math.abs(w)>20&&(C("stickDrift",W,P.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) screen(${Math.round(L.stickScreenX)},${Math.round(L.stickScreenY)})`,J),w=0)}}R={id:L.stickId,ox:fe,oy:qt,cx:Kt,cy:G,x:L.stickPxX,y:L.stickPxY,sx:L.stickScreenX,sy:L.stickScreenY,dx:It,dy:Rt,held:!0,screenOk:ft}}else R=null,w=0;if(L.stickBad>S){const yt=L.stickBad-S;C("stickBad",W,P.tick,0,`拦截 ${yt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${L.stickBad}）o(${Math.round(L.stickOriginX)},${Math.round(L.stickOriginY)}) p(${Math.round(L.stickPxX)},${Math.round(L.stickPxY)}) id${L.stickId??"-"}`,J)}S=L.stickBad,h=K,f=tt.moveYaw,d=ht},event(P,L){const F=Zm(P);k(P),r&&(P.type==="dash-ready"||P.type==="combo-reset"||P.type==="stepUp"||U(P.type,F,L,P.tick))},gesture(P){const L=`${P.button}.${P.kind}`;o.gestures[L]=(o.gestures[L]??0)+1,r&&(P.kind==="longPress"||P.kind==="doubleTap"||P.kind==="drag"||P.kind==="cancel")&&U(`g:${P.kind}`,`${P.button} ${P.heldMs.toFixed(0)}ms d${P.distance.toFixed(0)}px ${P.angleDeg.toFixed(0)}°`,T,b)},suspend(P){v=T*1e3+P,g=-1,m=-1},setEnabled(P){r=P,P||(h=null,R=null,g=-1,m=-1)},clear(){i.length=0,s.length=0,a.length=0,_={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,R=null,S=0;for(const P of Object.keys(o.gestures))delete o.gestures[P]},status(){const P=o.simS,L=a.some(F=>P-F.t<8&&(F.kind==="dirJump"||F.kind==="aimDrop"||F.kind==="moveFreeze"||F.kind==="stickLost"||F.kind==="stickJump"||F.kind==="stickBad"||F.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:L,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Bm,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:N}}const jm={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,recoilSpeed:1,recoilDecay:9,release:{windup:.04,active:.12,recovery:.26,lunge:.12},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Km={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Jm={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:8,minStep:.04,life:.09,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Qm={core:jm,scene:Km,view:Jm};function il(n){return JSON.parse(JSON.stringify(n))}const sl=Qm,t0=il(sl.core),Ma=il(sl.scene),gn=il(sl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Wn{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Wn.nextNameID=Wn.nextNameID||0,this.$name.id=`lil-gui-name-${++Wn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class e0 extends Wn{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function tc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const n0={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:tc,toHexString:tc},sa={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},i0={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=sa.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return sa.toHexString(s)}},s0={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=sa.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return sa.toHexString(s)}},a0=[n0,sa,i0,s0];function o0(n){return a0.find(t=>t.match(n))}class r0 extends Wn{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=o0(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=tc(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class er extends Wn{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class c0 extends Wn{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const v=parseFloat(this.$input.value);isNaN(v)||(this._snapClampSetValue(v+x),this.$input.value=this.getValue())},s=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},a=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=x=>{if(o){const v=x.clientX-r,_=x.clientY-l;Math.abs(_)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(v)>d&&y()}if(!o){const v=x.clientY-c;f-=v*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,v,_,R)=>(p-x)/(v-x)*(R-_)+_,e=p=>{const x=this.$slider.getBoundingClientRect();let v=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(v)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,v=p.touches[0].clientY-l;Math.abs(x)>Math.abs(v)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const v=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+v),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class l0 extends Wn{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class h0 extends Wn{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const d0=`.lil-gui {
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
}`;function u0(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let dh=!1;class Mo{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!dh&&r&&(u0(d0),dh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new l0(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new c0(this,t,e,i,s,a);case"boolean":return new e0(this,t,e);case"string":return new h0(this,t,e);case"function":return new er(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new r0(this,t,e,i)}addFolder(t){const e=new Mo({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof er||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof er)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function f0(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new Mo({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new Mo({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=q=>{const dt=a.addFolder(q);return l.push(dt),dt},h=(q,dt)=>{const Bt=q.addFolder(dt);return r.push(Bt),Bt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),g=h(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,v=h(u,"角色间分离 / 挤压阻力");v.add(x,"iterations",1,8,1).name("迭代次数"),v.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),v.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),v.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),v.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const _=o.dummies,R=h(u,"假人 AI");R.add(_,"moveSpeed",.5,8,.1).name("移动速度"),R.add(_,"wanderRadius",.5,8,.1).name("游走半径"),R.add(_,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(_,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(_,"keepDistance",1,10,.1).name("保持距离"),R.add(_,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(_,"attackRange",.5,5,.1).name("攻击距离"),R.add(_,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(_,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const w=c("步态 / 停步"),S=h(w,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(w,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(w,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(w,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const C=h(w,"足部 IK"),U=t.ik;C.add(U,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),C.add(U,"weight",0,1,.01).name("钉地权重"),C.add(U,"attackScale",0,1,.01).name("攻击时权重倍率"),C.add(U,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const k=h(w,"惯性倾斜 / 盆骨"),N=t.lean;k.add(N,"accelGain",0,.1,.002).name("前后加速度增益"),k.add(N,"turnGain",0,.2,.005).name("绕圈侧倾增益"),k.add(N,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),k.add(N,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),k.add(N,"smoothing",1,30,1).name("倾斜平滑速率"),k.add(N,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),k.add(N,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),k.add(N,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),k.add(N,"crouchSmoothing",1,30,1).name("下沉平滑速率");const P=o.orientation,L=h(w,"朝向 / 下盘带转");L.add(P,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),L.add(P,"headTurnRate",.5,40,.5).name("头部转向速率"),L.add(P,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),L.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),L.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),L.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const F=o.gaze,I=h(w,"接敌注视 / 俯仰 (v9s.18)");I.add(F,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),I.add(F,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),I.add(F,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),I.add(F,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),I.add(F,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),I.add(F,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),I.add(F,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),I.add(F,"headPitchRate",.5,20,.5).name("头部俯仰速率"),I.add(F,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),I.add(F,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),I.add(F,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const W=h(w,"原地转身 / 停步偏差 (v9s)"),tt=o.turnInPlace;W.add(tt,"enabled").name("启用原地转身 (关=纯插值)"),W.add(tt,"triggerDeg",20,180,5).name("触发夹角 (°)"),W.add(tt,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),W.add(tt,"settleDeg",0,60,1).name("转身保留余角 (°)"),W.add(tt,"durationSec",.1,1.5,.02).name("转身时长 (s)"),W.add(tt,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),W.add(tt,"inputDeadZone",0,.5,.01).name("起步输入死区"),W.add(tt,"armSec",0,.5,.01).name("触发防抖 (s)"),W.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),W.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),W.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),W.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),W.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),W.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const pt=c("战斗 / 受击"),ot=o.combat,ht=h(pt,"连击 / 武器"),K=ht.add(n.combat,"weapon",Gi).name("当前武器");ht.add(ot,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ht.add(ot,"settle",0,.8,.01).name("段间停顿 (s)"),ht.add(ot,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ht.add(ot,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ht.add(ot,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ht.add(ot,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ht.add(ot,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ht.add(ot,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ht.add(ot,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ht.add(ot,"autoCombo").name("按住自动连击"),ht.add(ot.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ht.add(ot.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ht.add(ot.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),ht.add(ot.bow,"recoilSpeed",0,5,.1).name("射击后坐力 (m/s)"),ht.add(ot.bow,"recoilDecay",1,30,.5).name("后坐力衰减 (1/s)");const Y=h(pt,"夸张化 (v9s.22)"),gt=t.animation.stretch;Y.add(gt,"enabled").name("四肢伸缩 开"),Y.add(gt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Y.add(gt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Y.add(gt,"impactSquash",0,.5,.01).name("命中挤压量"),Y.add(gt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Y.add(gt,"torsoGain",0,1,.05).name("躯干跟随比例"),Y.add(gt,"volumeExp",0,1.5,.05).name("体积补偿指数");const J=t.animation.swing;Y.add(J,"enabled").name("挥击身体幅度 开"),Y.add(J,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),Y.add(J,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),Y.add(J,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),Y.add(J,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),Y.add(J,"segBlend",0,.35,.01).name("段间姿态过渡 (s)"),Y.add(J.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const bt=t.weaponTrail;Y.add(bt,"enabled").name("挥击刀光 开"),Y.add(bt,"life",.04,.4,.01).name("刀光残留 (s)"),Y.add(bt,"intensity",0,1.5,.05).name("刀光亮度"),Y.add(bt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),Y.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),Y.add(t.hitstop,"enabled").name("命中定格 开"),Y.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const jt=t.weaponMount;Y.add(jt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),Y.add(jt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),Y.add(jt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),ht.add(ot.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ht.add(ot.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ht.add(ot.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ht.add(ot.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ht.add(ot.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ht.add(ot.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ht.add(ot.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ht.add(ot.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ht.add(ot.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ht.add(ot.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Ct=o.abilities;ht.add(Ct.arcane,"perWave",1,8,1).name("每波飞弹数"),ht.add(Ct.arcane,"waves",1,12,1).name("每次引导波数"),ht.add(Ct.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ht.add(Ct.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ht.add(Ct.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ht.add(Ct.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ht.add(Ct.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ht.add(Ct.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ht.add(Ct.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ht.add(Ct.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ht.add(Ct.arcane,"speed",3,24,.5).name("飞弹速度"),ht.add(Ct.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ht.add(Ct.ring,"radius",.5,5,.1).name("电环半径"),ht.add(Ct.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ht.add(Ct.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Lt=h(pt,"攻击动作 / 跨步 / 落地");Lt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Lt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Lt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const ft=t.animation.stride;Lt.add(ft,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Lt.add(ft,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Lt.add(ft,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Lt.add(ft,"cycles",1,3,1).name("每段跨步周期数"),Lt.add(ft,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Lt.add(ft,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Lt.add(ft,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Lt.add(ft,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Lt.add(ft,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Lt.add(ft,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Lt.add(ft,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Lt.add(ft,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Lt.add(ft,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Lt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Lt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Lt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Lt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Lt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Lt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Lt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Lt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Lt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Lt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Lt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Lt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const Kt=h(pt,"武器握持");Kt.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),Kt.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),Kt.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),Kt.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const G=o.hits,fe=h(pt,"命中 / 受击 / 击退");fe.add(G,"arcDeg",10,120,5).name("命中扇区半角 (°)"),fe.add(G,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),fe.add(G,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),fe.add(G,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),fe.add(G.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),fe.add(G.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),fe.add(G,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),fe.add(G,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const qt=o.targeting,It=h(pt,"目标辅助");It.add(qt,"targetAssist").name("启用目标辅助"),It.add(qt,"range",1,14,.5).name("锁定范围 (m)"),It.add(qt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),It.add(qt,"frontBias",0,4,.1).name("朝向加权"),It.add(qt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),It.add(qt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Rt=h(pt,"受击分层"),yt=t.hurt;Rt.add(yt,"enabled").name("启用分层受击 (关=旧版对照)"),Rt.add(yt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Rt.add(yt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Rt.add(yt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Rt.add(yt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Rt.add(yt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Rt.add(yt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Rt.add(yt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Rt.add(yt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Rt.add(yt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Rt.add(yt,"leanLight",0,1.5,.01).name("轻击力度"),Rt.add(yt,"leanHeavy",0,1.5,.01).name("重击力度"),Rt.add(yt,"leanKnock",0,1.5,.01).name("击退力度"),Rt.add(yt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:yt.abdomen},{name:"打肩 (shoulder)",p:yt.shoulder}].map(({name:q,p:dt})=>{const Bt=h(Rt,q);return Bt.add(dt,"upperPitch",0,2,.01).name("上身前后倾斜"),Bt.add(dt,"upperRoll",0,2,.01).name("上身侧倾"),Bt.add(dt,"upperYaw",0,1.5,.01).name("肩部扭转"),Bt.add(dt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),Bt.add(dt,"shift",0,.8,.01).name("身体反应位移"),Bt.add(dt,"drop",0,.4,.01).name("整体下沉"),Bt.add(dt,"back",0,.4,.01).name("屁股向后"),Bt.add(dt,"knee",0,1.6,.01).name("屈膝"),Bt.add(dt,"hip",0,1,.01).name("髋前倾"),Bt.add(dt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),Bt});const Tt=h(pt,"派生招"),D=o.links;Tt.add(D,"enabled").name("总开关 (false=旧连击)"),Tt.add(D.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),Tt.add(D.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),Tt.add(D.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),Tt.add(D,"sharedCooldown",0,3,.05).name("共享 CD (s)"),Tt.add(D,"triggerWhileSprinting").name("长跑中可直接触发"),Tt.add(D.search,"range",1,14,.1).name("索敌距离 (m)"),Tt.add(D.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),Tt.add(D.search,"stopDistance",0,3,.05).name("停住距离 (m)");const E=D.moves["sword-shield"];E&&(Tt.add(E,"enabled").name("剑盾盾击"),Tt.add(E,"distance",0,8,.1).name("冲锋极限 (m)"),Tt.add(E,"windup",0,.5,.01).name("前摇 (s)"),Tt.add(E,"active",0,.8,.01).name("冲锋 / 命中 (s)"),Tt.add(E,"recovery",0,.8,.01).name("收势 (s)"),Tt.add(E.hit,"radius",0,4,.05).name("命中半径 (m)"),Tt.add(E.hit,"width",0,2,.05).name("扫掠半径 (m)"),Tt.add(E.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),Tt.add(E.hit,"duration",0,1.5,.01).name("僵直 (s)")),Tt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const $=c("相机"),rt=h($,"基础");rt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),rt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),rt.add(t.camera,"distance",6,35,.5).name("距离"),rt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),rt.add(t.camera,"fov",25,90,1).name("FOV");const ct=o.camera,nt=h($,"智能构图");nt.add(ct,"radius",2,18,.5).name("威胁评估半径 (m)"),nt.add(ct,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),nt.add(ct,"saturation",.5,8,.1).name("威胁归一化饱和"),nt.add(ct,"pushIn",0,.5,.01).name("无威胁推进比例"),nt.add(ct,"maxPullback",0,1,.02).name("最大拉远比例"),nt.add(ct,"maxOffset",0,6,.1).name("最大构图平移 (m)"),nt.add(ct,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),nt.add(ct,"framingBias",0,1,.05).name("威胁质心平移系数"),nt.add(ct,"attackBoost",0,2,.05).name("挥砍中额外加权"),nt.add(ct.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),nt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const kt=h($,"缩放");return kt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),kt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),kt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),kt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),kt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),kt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),kt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),kt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(q=>q.close()),l.forEach(q=>q.close()),a.close(),{gui:a,refreshWeapon:()=>K.updateDisplay()}}function p0(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const o=Math.hypot(t-a.x,e-a.z);o<=a.radius&&o<s&&(i=a,s=o)}return i}function m0(n,t){return n.find(e=>e.id===t)??null}function uh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),s=i.findIndex(r=>r.id===t),a=e<0?-1:1,o=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[o]??null}function g0({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return p0(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[v,_]of l)_.classList.toggle("is-active",v===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):x&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(x=>x.index===m)??null:m0(n,m);return p?(rm(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function y(){ou(t)}if(a){a.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),a.appendChild(m);for(const _ of[...n].sort((R,w)=>R.index-w.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=_.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",_.color),R.setAttribute("aria-label",`传送到工位 ${_.index}：${_.name}`);const w=document.createElement("span");w.className="lab-idx",w.textContent=String(_.index);const S=document.createElement("span");S.className="lab-name",S.textContent=_.name,R.append(w,S),R.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(_.id)}),a.appendChild(R),l.set(_.id,R)}r=document.createElement("div"),r.className="lab-hint",a.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const v=document.createElement("button");if(v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="召回假人",v.setAttribute("aria-label","召回全部假人回到各自工位"),v.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),y()}),x.appendChild(v),s){const _=document.createElement("button");_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="镜头归位",_.setAttribute("aria-label","把镜头缩放恢复到默认"),_.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),s()}),x.appendChild(_)}a.appendChild(x)}return window.addEventListener("keydown",m=>{var p,x;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const v=uh(n,((p=d())==null?void 0:p.id)??o,-1);v&&g(v.id)}else if(m.key==="]"){const v=uh(n,((x=d())==null?void 0:x.id)??o,1);v&&g(v.id)}else m.key==="\\"&&y()}),u(),{goto:g,current:d,tick:u,recall:y,element:a}}const nr=Math.PI*2,Hn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},x0=45,v0=50;function _0(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Os(n,t,e){const i=_0(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function y0(n,t){return Math.atan2(n,-t)*180/Math.PI}function fh(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Sa(n){return(n%360+360)%360}const M0={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function S0(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=s.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Os(a.moveX,a.moveZ,e):null,f=c>.15?Os(l.x,l.z,e):null,d=Os(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?Os(a.aimX,a.aimZ,e):null,g=n.targeting,y=g.hasTarget?Os(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?fh(h,f):null,p=h!==null?fh(h,d):null,x=m!==null&&m>x0&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?y0(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function ph(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>v0&&(n.inLen>=.35||n.speed>=.4)}const mh="harness.dirDebug";function b0(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(mh)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),a&&(a.textContent=l?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(l)))}c();function h(v){if(l=v,!t)try{window.localStorage.setItem(mh,v?"1":"0")}catch{}c()}a==null||a.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",v=>{v.key.toLowerCase()==="v"&&!v.metaKey&&!v.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=M0,g=0,y="",m=8;function p(v){if(!r)return;const _=d,R=d,w=_/2,S=R/2,T=Math.min(_,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,_,R),r.beginPath(),r.arc(w,S,T,0,nr),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=v.warnMove?"rgba(251, 191, 36, 0.85)":Hn.ring,r.stroke(),r.strokeStyle=Hn.grid,r.beginPath(),r.moveTo(w-T,S),r.lineTo(w+T,S),r.moveTo(w,S-T),r.lineTo(w,S+T),r.stroke();for(let U=0;U<8;U++){const k=U*Math.PI/4,N=w+Math.sin(k)*(T-3),P=S-Math.cos(k)*(T-3),L=w+Math.sin(k)*T,F=S-Math.cos(k)*T;r.beginPath(),r.moveTo(N,P),r.lineTo(L,F),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Hn.dead,r.beginPath(),r.arc(w,S,T*b,0,nr),r.stroke(),r.restore());const M=(U,k,N,P,L=!1,F=1)=>{const I=U*Math.PI/180,W=Math.sin(I),tt=-Math.cos(I),pt=T*Math.max(.14,Math.min(1,k)),ot=w+W*T*.14,ht=S+tt*T*.14,K=w+W*pt,Y=S+tt*pt;if(r.save(),r.globalAlpha=F,r.strokeStyle=N,r.fillStyle=N,r.lineWidth=P,r.lineCap="round",L&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ot,ht),r.lineTo(K,Y),r.stroke(),!L&&pt>T*.3){const gt=-tt,J=W,bt=5.2;r.beginPath(),r.moveTo(K+W*1.5,Y+tt*1.5),r.lineTo(K-W*bt+gt*bt*.72,Y-tt*bt+J*bt*.72),r.lineTo(K-W*bt-gt*bt*.72,Y-tt*bt-J*bt*.72),r.closePath(),r.fill()}r.restore()},C=(U,k)=>{const N=U*Math.PI/180,P=Math.sin(N),L=-Math.cos(N),F=-L,I=P,W=T+1.5,tt=W+6.5;r.save(),r.fillStyle=k,r.strokeStyle=k,r.lineWidth=1,r.beginPath(),r.moveTo(w+P*tt,S+L*tt),r.lineTo(w+P*W+F*4,S+L*W+I*4),r.lineTo(w+P*W-F*4,S+L*W-I*4),r.closePath(),r.fill(),r.restore()};v.lockDeg!==null&&M(v.lockDeg,1,Hn.lock,1,!0,.7),v.rawDeg!==null&&v.stickHeld&&M(v.rawDeg,v.rawLen,Hn.raw,1,!0,.9),v.aimDeg!==null&&M(v.aimDeg,1,Hn.aim,1.6,!0,.95),M(v.faceDeg,1,Hn.face,1.1,!0,.55),v.moveDeg!==null&&M(v.moveDeg,v.speed/Math.max(1,m),Hn.move,5.5,!1,.8),v.inDeg!==null&&M(v.inDeg,v.inLen,Hn.input,2.2),C(v.faceDeg,Hn.face),r.beginPath(),r.arc(w,S,2.2,0,nr),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(v,_){const R=T=>T===null?"-":String(Math.round(Sa(T)));o.in.textContent=`入 ${R(v.inDeg)}`,o.mv.textContent=`移 ${R(v.moveDeg)}`,o.fc.textContent=`面 ${R(v.faceDeg)}`;const w=T=>T===null?"-":`${Math.round(T)}°`,S=[`Δ入→移 ${w(v.gapMove)}`,`Δ入→面 ${w(v.gapFace)}`];v.speed>.05&&S.push(`v${v.speed.toFixed(1)}`),v.lockDeg!==null&&S.push(`锁#${v.lockId} ${v.lockDist.toFixed(1)}m`),v.aimDeg!==null&&S.push("拖拽瞄准"),o.gap.textContent=S.join("  "),e.classList.toggle("is-warn",v.warnMove||ph(v,_))}return{update(v,_,R){if(!l)return;m=Math.max(1,v.config.moveSpeed*Math.max(1,v.config.sprintMultiplier));const w=S0(v,_,R,m);u=w;const S=v.combat.phase!=="idle";p(w);const T=performance.now(),b=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(T-g>90||b!==y)&&(g=T,y=b,x(w,S),e.dataset.in=w.inDeg===null?"":Sa(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":Sa(w.moveDeg).toFixed(1),e.dataset.fc=Sa(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||ph(w,S)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const w0=6,E0=480,gh=240,xh=92,T0=18;function A0(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function R0(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function C0(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function P0(n={}){const t=Math.max(1,n.windowS??w0),e=Math.max(60,n.capacity??E0),i=Math.max(1,n.speedCap??T0),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),l=a.querySelector("#motiondbg-graph"),c=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(gh*u),l.height=Math.round(xh*u);const g=b0({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function m(T){y=T,a.classList.toggle("is-off",!T),!s&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}m(!1),s||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(!y)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&m(!y)}));const p=[];let x=0,v=null,_=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function w(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function S(T,b){if(!d)return;const M=gh,C=xh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,C),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,C);const U=4,k=4,N=M-U-k,P=9,L=46,F=62,I=22,W=b-t,tt=J=>U+Math.max(0,Math.min(1,(J-W)/t))*N;for(let J=0;J<T.length;J++){if(!T[J].busy)continue;const bt=tt(T[J].t),jt=J+1<T.length?tt(T[J+1].t):bt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(bt,P,Math.max(2,jt-bt),L)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const J of[P,P+L/2,P+L])d.moveTo(U,J),d.lineTo(M-k,J);d.moveTo(U,F+I/2),d.lineTo(M-k,F+I/2),d.stroke();const ot=Math.max(1,...T.map(J=>J.speed),...T.map(J=>J.drive))*1.15,ht=J=>P+L-J/ot*L;if(T.length>1){d.beginPath(),d.moveTo(tt(T[0].t),ht(T[0].speed));for(let J=1;J<T.length;J++)d.lineTo(tt(T[J].t),ht(T[J].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(tt(T[T.length-1].t),P+L),d.lineTo(tt(T[0].t),P+L),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(tt(T[0].t),ht(T[0].drive));for(let J=1;J<T.length;J++)d.lineTo(tt(T[J].t),ht(T[J].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let K=.02;for(const J of T)K=Math.max(K,Math.abs(J.dv));K*=1.1;const Y=F+I/2,gt=I/2;for(const J of T){const bt=Math.min(gt,Math.abs(J.dv)/K*gt);d.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(tt(J.t)-.7,J.dv>=0?Y-bt:Y,1.4,Math.max(.5,bt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ot.toFixed(1),U+2,P+8),d.fillText("v",U+2,P+L-2),d.fillText("Δv",U+2,F+9),d.textAlign="right",d.fillText("0",M-k-2,P+L-2),d.textAlign="left"}return{dirDebug:g,update(T,b,M){const C=performance.now()/1e3,U=_<0?1/60:Math.max(1e-4,Math.min(.25,C-_));_=C;const k=T.character,N={x:k.position.x,z:k.position.z},P=Math.hypot(k.velocity.x,k.velocity.z),{speed:L,raw:F}=v?R0(v,N,U,i):{speed:0,raw:0},I=A0(x,L,U,C);I.drive=P,I.raw=F,I.busy=C0(T),v=N,x=L,p.push(I),p.length>e&&p.shift();const W=w(C);let tt=0;for(const pt of W)tt=Math.max(tt,pt.speed);if(R={speed:L,drive:P,raw:F,dv:I.dv,accel:I.accel,peak:tt,samples:W.length,windowS:t,busy:I.busy},g.update(T,b,M),y){S(W,C);const pt=I.dv>=0?"+":"";c.textContent=`v ${L.toFixed(2)} · 驱 ${P.toFixed(2)} · 峰 ${tt.toFixed(2)} · Δv ${pt}${I.dv.toFixed(3)} · ${W.length} 帧`}},setEnabled:m,toggle(){return m(!y),y},enabled:()=>y,last:()=>({...R}),samples:()=>w(performance.now()/1e3).map(T=>({...T}))}}const L0=["剑盾","双剑","大剑","法杖","弓"],D0={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function k0(n){return{update(t,e,i,s,a,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=ft=>ft.toFixed(2),g=ft=>(ft*180/Math.PI).toFixed(0),y=L0[Gi.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,v=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,_=x.phase==="active"?`${x.kind}@${v.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,R=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",w=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),S=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(w)+Math.abs(S)+1e-6,b=Math.round(Math.abs(S)/T*100),M=`strafe ${b}%${w<-.05?" back":""}`,C=t.camera,U=`threat ${(C.threat*100).toFixed(0)}%  dist×${u(C.distanceScale)}  off (${u(C.offsetX)},${u(C.offsetZ)})  pitch +${u(C.pitchDelta)}°  n=${C.threatCount}`,k=o?u(o.attackBlend):"-",N=o==null?void 0:o.attackWeights,P=N?`gw ${u(N.gaitScale)}  lw ${u(N.attackLegWeight)}  spd ${u(N.driveSpeed)}`:"-",L=N?`${u(N.gaitScale)}/${u(N.attackLegWeight)}`:"-",F=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",I=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",W=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",tt=o==null?void 0:o.hurt,pt=tt?`hurt ${t.playerHurt.type}  部位h${u(tt.hitHeight)}  脉冲p${u(tt.pulse)}  上身${u(tt.upperShift)}  重心${u(tt.comShift)}  后坐${u(tt.pelvisBack)}  屈膝${u(tt.knee)}`:"-",ot=tt?`${u(tt.hitHeight)}/${u(tt.pulse)}/${u(tt.knee)}`:"-",ht=o==null?void 0:o.ik,K=ht?`${ht.active?"on":"off"} w${u(ht.weight)} e${u(ht.maxError)}`:"-",Y=t.playerLink,gt=`link ${Y.kind||"-"}  ${Y.phase}  prog ${u(Y.progress)}  win ${u(Y.linkWindow)}s  cd ${u(Y.cooldown)}s  hits ${Y.hitIds.length}  travel ${u(Y.travelled)}/${u(Y.travel)}m  id ${Y.id}`,J=`${Y.phase}/${Y.kind||"-"}/w${u(Y.linkWindow)}`,bt=s.lastGesture,jt=bt?`${bt.button} ${bt.kind} ${bt.heldMs.toFixed(0)}ms d${bt.distance.toFixed(0)}px ${bt.angleDeg.toFixed(0)}° taps${bt.taps}`:"-",Ct=t.dummies.map(ft=>`${ft.id}:${D0[ft.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${Y.phase}${Y.kind?`/${Y.kind}`:""} w${u(Y.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${_}  ab ${k}  gw/lw ${L}  land ${I}  ik ${K}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ot}`,`dummies ${Ct}  atkCount ${t.dummyAttackCount}  cam ${(C.threat*100).toFixed(0)}% ×${u(C.distanceScale)}  ${W}  lk ${J}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${jt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${k}   ${P}   land ${F}`,pt,`ik ${K}  clamped ${ht?ht.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${R}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${v.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,gt,`camera ${U}  ${W}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ct}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${jt}`].join(`
`)}}}const ba=["lab","hud","motion","debug"],vh={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},_h={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function I0(n){var l;const t=Object.fromEntries(ba.map(c=>[c,document.getElementById(_h[c].toggle)])),e=Object.fromEntries(ba.map(c=>[c,document.getElementById(_h[c].panel)]));let i={},s=null;function a(){var c,h,f;for(const d of ba){const u=s===d,g=t[d],y=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${vh[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${vh[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(c=i.motion)==null||c.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){s=s===c?null:c,a()}function r(){s!==null&&(s=null,a())}for(const c of ba)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(c){i=c,a()},toggle:o,closeAll:r,isOpen:c=>s===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const al="170",F0=0,yh=1,U0=2,du=1,uu=2,ei=3,Mi=0,pn=1,Ne=2,_i=0,ys=1,pi=2,Mh=3,Sh=4,z0=5,zi=100,N0=101,O0=102,B0=103,H0=104,G0=200,V0=201,X0=202,W0=203,ec=204,nc=205,$0=206,Y0=207,Z0=208,q0=209,j0=210,K0=211,J0=212,Q0=213,tg=214,ic=0,sc=1,ac=2,Es=3,oc=4,rc=5,cc=6,lc=7,ol=0,eg=1,ng=2,yi=0,ig=1,sg=2,ag=3,og=4,rg=5,cg=6,lg=7,fu=300,Ts=301,As=302,hc=303,dc=304,ko=306,uc=1e3,Oi=1001,fc=1002,zn=1003,hg=1004,wa=1005,Xn=1006,ir=1007,Bi=1008,oi=1009,pu=1010,mu=1011,aa=1012,rl=1013,Vi=1014,ii=1015,fa=1016,cl=1017,ll=1018,Rs=1020,gu=35902,xu=1021,vu=1022,Un=1023,_u=1024,yu=1025,Ms=1026,Cs=1027,Mu=1028,hl=1029,Su=1030,dl=1031,ul=1033,so=33776,ao=33777,oo=33778,ro=33779,pc=35840,mc=35841,gc=35842,xc=35843,vc=36196,_c=37492,yc=37496,Mc=37808,Sc=37809,bc=37810,wc=37811,Ec=37812,Tc=37813,Ac=37814,Rc=37815,Cc=37816,Pc=37817,Lc=37818,Dc=37819,kc=37820,Ic=37821,co=36492,Fc=36494,Uc=36495,bu=36283,zc=36284,Nc=36285,Oc=36286,dg=3200,ug=3201,wu=0,fg=1,mi="",hn="srgb",Ls="srgb-linear",Io="linear",Re="srgb",Ki=7680,bh=519,pg=512,mg=513,gg=514,Eu=515,xg=516,vg=517,_g=518,yg=519,Bc=35044,wh=35048,Eh="300 es",si=2e3,So=2001;class Ds{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Th=1234567;const Ss=Math.PI/180,oa=180/Math.PI;function $n(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]+"-"+on[t&255]+on[t>>8&255]+"-"+on[t>>16&15|64]+on[t>>24&255]+"-"+on[e&63|128]+on[e>>8&255]+"-"+on[e>>16&255]+on[e>>24&255]+on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]).toLowerCase()}function nn(n,t,e){return Math.max(t,Math.min(e,n))}function fl(n,t){return(n%t+t)%t}function Mg(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Sg(n,t,e){return n!==t?(e-n)/(t-n):0}function Ks(n,t,e){return(1-e)*n+e*t}function bg(n,t,e,i){return Ks(n,t,1-Math.exp(-e*i))}function wg(n,t=1){return t-Math.abs(fl(n,t*2)-t)}function Eg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Tg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Ag(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Rg(n,t){return n+Math.random()*(t-n)}function Cg(n){return n*(.5-Math.random())}function Pg(n){n!==void 0&&(Th=n);let t=Th+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lg(n){return n*Ss}function Dg(n){return n*oa}function kg(n){return(n&n-1)===0&&n!==0}function Ig(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Fg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ug(n,t,e,i,s){const a=Math.cos,o=Math.sin,r=a(e/2),l=o(e/2),c=a((t+i)/2),h=o((t+i)/2),f=a((t-i)/2),d=o((t-i)/2),u=a((i-t)/2),g=o((i-t)/2);switch(s){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Fn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Te(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ah={DEG2RAD:Ss,RAD2DEG:oa,generateUUID:$n,clamp:nn,euclideanModulo:fl,mapLinear:Mg,inverseLerp:Sg,lerp:Ks,damp:bg,pingpong:wg,smoothstep:Eg,smootherstep:Tg,randInt:Ag,randFloat:Rg,randFloatSpread:Cg,seededRandom:Pg,degToRad:Lg,radToDeg:Dg,isPowerOfTwo:kg,ceilPowerOfTwo:Ig,floorPowerOfTwo:Fg,setQuaternionFromProperEuler:Ug,normalize:Te,denormalize:Fn};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(nn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ue{constructor(t,e,i,s,a,o,r,l,c){ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c)}set(t,e,i,s,a,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],y=s[0],m=s[3],p=s[6],x=s[1],v=s[4],_=s[7],R=s[2],w=s[5],S=s[8];return a[0]=o*y+r*x+l*R,a[3]=o*m+r*v+l*w,a[6]=o*p+r*_+l*S,a[1]=c*y+h*x+f*R,a[4]=c*m+h*v+f*w,a[7]=c*p+h*_+f*S,a[2]=d*y+u*x+g*R,a[5]=d*m+u*v+g*w,a[8]=d*p+u*_+g*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*a*h+i*r*l+s*a*c-s*o*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*a,u=c*a-o*l,g=e*f+i*d+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=f*y,t[1]=(s*c-h*i)*y,t[2]=(r*i-s*o)*y,t[3]=d*y,t[4]=(h*e-s*l)*y,t[5]=(s*a-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*a)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-s*c,s*l,-s*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(sr.makeScale(t,e)),this}rotate(t){return this.premultiply(sr.makeRotation(-t)),this}translate(t,e){return this.premultiply(sr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const sr=new ue;function Tu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function bo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function zg(){const n=bo("canvas");return n.style.display="block",n}const Rh={};function Zs(n){n in Rh||(Rh[n]=!0,console.warn(n))}function Ng(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function Og(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Bg(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ye={enabled:!0,workingColorSpace:Ls,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Re&&(n.r=ai(n.r),n.g=ai(n.g),n.b=ai(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Re&&(n.r=bs(n.r),n.g=bs(n.g),n.b=bs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===mi?Io:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ai(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function bs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Ch=[.64,.33,.3,.6,.15,.06],Ph=[.2126,.7152,.0722],Lh=[.3127,.329],Dh=new ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kh=new ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ye.define({[Ls]:{primaries:Ch,whitePoint:Lh,transfer:Io,toXYZ:Dh,fromXYZ:kh,luminanceCoefficients:Ph,workingColorSpaceConfig:{unpackColorSpace:hn},outputColorSpaceConfig:{drawingBufferColorSpace:hn}},[hn]:{primaries:Ch,whitePoint:Lh,transfer:Re,toXYZ:Dh,fromXYZ:kh,luminanceCoefficients:Ph,outputColorSpaceConfig:{drawingBufferColorSpace:hn}}});let Ji;class Hg{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ji===void 0&&(Ji=bo("canvas")),Ji.width=t.width,Ji.height=t.height;const i=Ji.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ji}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=bo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=ai(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ai(e[i]/255)*255):e[i]=ai(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Gg=0;class Au{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gg++}),this.uuid=$n(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(ar(s[o].image)):a.push(ar(s[o]))}else a=ar(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function ar(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Hg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Vg=0;class un extends Ds{constructor(t=un.DEFAULT_IMAGE,e=un.DEFAULT_MAPPING,i=Oi,s=Oi,a=Xn,o=Bi,r=Un,l=oi,c=un.DEFAULT_ANISOTROPY,h=mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vg++}),this.uuid=$n(),this.name="",this.source=new Au(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==fu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uc:t.x=t.x-Math.floor(t.x);break;case Oi:t.x=t.x<0?0:1;break;case fc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uc:t.y=t.y-Math.floor(t.y);break;case Oi:t.y=t.y<0?0:1;break;case fc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=fu;un.DEFAULT_ANISOTROPY=1;class Ve{constructor(t=0,e=0,i=0,s=1){Ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,_=(u+1)/2,R=(p+1)/2,w=(h+d)/4,S=(f+y)/4,T=(g+m)/4;return v>_&&v>R?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=w/i,a=S/i):_>R?_<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(_),i=w/s,a=T/s):R<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),i=S/a,s=T/a),this.set(i,s,a,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-y)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xg extends Ds{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ve(0,0,t,e),this.scissorTest=!1,this.viewport=new Ve(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new un(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Au(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends Xg{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ru extends un{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=zn,this.minFilter=zn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wg extends un{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=zn,this.minFilter=zn,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pa{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3];const d=a[o+0],u=a[o+1],g=a[o+2],y=a[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==g){let m=1-r;const p=l*d+c*u+h*g+f*y,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const R=Math.sqrt(v),w=Math.atan2(R,p*x);m=Math.sin(m*w)/R,r=Math.sin(r*w)/R}const _=r*x;if(l=l*m+d*_,c=c*m+u*_,h=h*m+g*_,f=f*m+y*_,m===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[o],d=a[o+1],u=a[o+2],g=a[o+3];return t[e]=r*g+h*f+l*u-c*d,t[e+1]=l*g+h*d+c*f-r*u,t[e+2]=c*g+h*u+r*d-l*f,t[e+3]=h*g-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(s/2),f=r(a/2),d=l(i/2),u=l(s/2),g=l(a/2);switch(o){case"XYZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"YZX":this._x=d*h*f+c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f-d*u*g;break;case"XZY":this._x=d*h*f-c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-c)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(nn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+s*c-a*l,this._y=s*h+o*l+a*r-i*c,this._z=a*h+o*c+i*l-s*r,this._w=o*h-i*r-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(t=0,e=0,i=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ih.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ih.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*s-r*i),h=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-a*f,this.z=s+l*f+a*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,l=e.z;return this.x=s*l-a*r,this.y=a*o-i*l,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return or.copy(this).projectOnVector(t),this.sub(or)}reflect(t){return this.sub(or.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(nn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const or=new H,Ih=new pa;class ma{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Dn):Dn.fromBufferAttribute(a,o),Dn.applyMatrix4(t.matrixWorld),this.expandByPoint(Dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ea.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ea.copy(i.boundingBox)),Ea.applyMatrix4(t.matrixWorld),this.union(Ea)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Dn),Dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bs),Ta.subVectors(this.max,Bs),Qi.subVectors(t.a,Bs),ts.subVectors(t.b,Bs),es.subVectors(t.c,Bs),ri.subVectors(ts,Qi),ci.subVectors(es,ts),Ei.subVectors(Qi,es);let e=[0,-ri.z,ri.y,0,-ci.z,ci.y,0,-Ei.z,Ei.y,ri.z,0,-ri.x,ci.z,0,-ci.x,Ei.z,0,-Ei.x,-ri.y,ri.x,0,-ci.y,ci.x,0,-Ei.y,Ei.x,0];return!rr(e,Qi,ts,es,Ta)||(e=[1,0,0,0,1,0,0,0,1],!rr(e,Qi,ts,es,Ta))?!1:(Aa.crossVectors(ri,ci),e=[Aa.x,Aa.y,Aa.z],rr(e,Qi,ts,es,Ta))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const jn=[new H,new H,new H,new H,new H,new H,new H,new H],Dn=new H,Ea=new ma,Qi=new H,ts=new H,es=new H,ri=new H,ci=new H,Ei=new H,Bs=new H,Ta=new H,Aa=new H,Ti=new H;function rr(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){Ti.fromArray(n,a);const r=s.x*Math.abs(Ti.x)+s.y*Math.abs(Ti.y)+s.z*Math.abs(Ti.z),l=t.dot(Ti),c=e.dot(Ti),h=i.dot(Ti);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const $g=new ma,Hs=new H,cr=new H;class Fo{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):$g.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Hs.subVectors(t,this.center);const e=Hs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Hs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(cr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Hs.copy(t.center).add(cr)),this.expandByPoint(Hs.copy(t.center).sub(cr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Kn=new H,lr=new H,Ra=new H,li=new H,hr=new H,Ca=new H,dr=new H;class pl{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Kn.copy(this.origin).addScaledVector(this.direction,e),Kn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){lr.copy(t).add(e).multiplyScalar(.5),Ra.copy(e).sub(t).normalize(),li.copy(this.origin).sub(lr);const a=t.distanceTo(e)*.5,o=-this.direction.dot(Ra),r=li.dot(this.direction),l=-li.dot(Ra),c=li.lengthSq(),h=Math.abs(1-o*o);let f,d,u,g;if(h>0)if(f=o*l-r,d=o*r-l,g=a*h,f>=0)if(d>=-g)if(d<=g){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-o*a+r)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(o*a+r)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=o>0?-a:a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(lr).addScaledVector(Ra,d),u}intersectSphere(t,e){Kn.subVectors(t.center,this.origin);const i=Kn.dot(this.direction),s=Kn.dot(Kn)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>s)||((r>i||i!==i)&&(i=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Kn)!==null}intersectTriangle(t,e,i,s,a){hr.subVectors(e,t),Ca.subVectors(i,t),dr.crossVectors(hr,Ca);let o=this.direction.dot(dr),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;li.subVectors(this.origin,t);const l=r*this.direction.dot(Ca.crossVectors(li,Ca));if(l<0)return null;const c=r*this.direction.dot(hr.cross(li));if(c<0||l+c>o)return null;const h=-r*li.dot(dr);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ke{constructor(t,e,i,s,a,o,r,l,c,h,f,d,u,g,y,m){ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c,h,f,d,u,g,y,m)}set(t,e,i,s,a,o,r,l,c,h,f,d,u,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ke().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/ns.setFromMatrixColumn(t,0).length(),a=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+g*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=g+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d+y*r,e[4]=g*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-g,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=g*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=g*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+g,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yg,t,Zg)}lookAt(t,e,i){const s=this.elements;return xn.subVectors(t,e),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),hi.crossVectors(i,xn),hi.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),hi.crossVectors(i,xn)),hi.normalize(),Pa.crossVectors(xn,hi),s[0]=hi.x,s[4]=Pa.x,s[8]=xn.x,s[1]=hi.y,s[5]=Pa.y,s[9]=xn.y,s[2]=hi.z,s[6]=Pa.z,s[10]=xn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],y=i[6],m=i[10],p=i[14],x=i[3],v=i[7],_=i[11],R=i[15],w=s[0],S=s[4],T=s[8],b=s[12],M=s[1],C=s[5],U=s[9],k=s[13],N=s[2],P=s[6],L=s[10],F=s[14],I=s[3],W=s[7],tt=s[11],pt=s[15];return a[0]=o*w+r*M+l*N+c*I,a[4]=o*S+r*C+l*P+c*W,a[8]=o*T+r*U+l*L+c*tt,a[12]=o*b+r*k+l*F+c*pt,a[1]=h*w+f*M+d*N+u*I,a[5]=h*S+f*C+d*P+u*W,a[9]=h*T+f*U+d*L+u*tt,a[13]=h*b+f*k+d*F+u*pt,a[2]=g*w+y*M+m*N+p*I,a[6]=g*S+y*C+m*P+p*W,a[10]=g*T+y*U+m*L+p*tt,a[14]=g*b+y*k+m*F+p*pt,a[3]=x*w+v*M+_*N+R*I,a[7]=x*S+v*C+_*P+R*W,a[11]=x*T+v*U+_*L+R*tt,a[15]=x*b+v*k+_*F+R*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+a*l*f-s*c*f-a*r*d+i*c*d+s*r*u-i*l*u)+y*(+e*l*u-e*c*d+a*o*d-s*o*u+s*c*h-a*l*h)+m*(+e*c*f-e*r*u-a*o*f+i*o*u+a*r*h-i*c*h)+p*(-s*r*h-e*l*f+e*r*d+s*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],y=t[13],m=t[14],p=t[15],x=f*m*c-y*d*c+y*l*u-r*m*u-f*l*p+r*d*p,v=g*d*c-h*m*c-g*l*u+o*m*u+h*l*p-o*d*p,_=h*y*c-g*f*c+g*r*u-o*y*u-h*r*p+o*f*p,R=g*f*l-h*y*l-g*r*d+o*y*d+h*r*m-o*f*m,w=e*x+i*v+s*_+a*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/w;return t[0]=x*S,t[1]=(y*d*a-f*m*a-y*s*u+i*m*u+f*s*p-i*d*p)*S,t[2]=(r*m*a-y*l*a+y*s*c-i*m*c-r*s*p+i*l*p)*S,t[3]=(f*l*a-r*d*a-f*s*c+i*d*c+r*s*u-i*l*u)*S,t[4]=v*S,t[5]=(h*m*a-g*d*a+g*s*u-e*m*u-h*s*p+e*d*p)*S,t[6]=(g*l*a-o*m*a-g*s*c+e*m*c+o*s*p-e*l*p)*S,t[7]=(o*d*a-h*l*a+h*s*c-e*d*c-o*s*u+e*l*u)*S,t[8]=_*S,t[9]=(g*f*a-h*y*a-g*i*u+e*y*u+h*i*p-e*f*p)*S,t[10]=(o*y*a-g*r*a+g*i*c-e*y*c-o*i*p+e*r*p)*S,t[11]=(h*r*a-o*f*a-h*i*c+e*f*c+o*i*u-e*r*u)*S,t[12]=R*S,t[13]=(h*y*s-g*f*s+g*i*d-e*y*d-h*i*m+e*f*m)*S,t[14]=(g*r*s-o*y*s-g*i*l+e*y*l+o*i*m-e*r*m)*S,t[15]=(o*f*s-h*r*s+h*i*l-e*f*l-o*i*d+e*r*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,l=t.z,c=a*o,h=a*r;return this.set(c*o+i,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+i,h*l-s*o,0,c*l-s*r,h*l+s*o,a*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,l=e._w,c=a+a,h=o+o,f=r+r,d=a*c,u=a*h,g=a*f,y=o*h,m=o*f,p=r*f,x=l*c,v=l*h,_=l*f,R=i.x,w=i.y,S=i.z;return s[0]=(1-(y+p))*R,s[1]=(u+_)*R,s[2]=(g-v)*R,s[3]=0,s[4]=(u-_)*w,s[5]=(1-(d+p))*w,s[6]=(m+x)*w,s[7]=0,s[8]=(g+v)*S,s[9]=(m-x)*S,s[10]=(1-(d+y))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=ns.set(s[0],s[1],s[2]).length();const o=ns.set(s[4],s[5],s[6]).length(),r=ns.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],kn.copy(this);const c=1/a,h=1/o,f=1/r;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=f,kn.elements[9]*=f,kn.elements[10]*=f,e.setFromRotationMatrix(kn),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=si){const l=this.elements,c=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,g;if(r===si)u=-(o+a)/(o-a),g=-2*o*a/(o-a);else if(r===So)u=-o/(o-a),g=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=si){const l=this.elements,c=1/(e-t),h=1/(i-s),f=1/(o-a),d=(e+t)*c,u=(i+s)*h;let g,y;if(r===si)g=(o+a)*f,y=-2*f;else if(r===So)g=a*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ns=new H,kn=new ke,Yg=new H(0,0,0),Zg=new H(1,1,1),hi=new H,Pa=new H,xn=new H,Fh=new ke,Uh=new pa;class Yn{constructor(t=0,e=0,i=0,s=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(nn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-nn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(nn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-nn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(nn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-nn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Fh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Fh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Uh.setFromEuler(this),this.setFromQuaternion(Uh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class ml{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let qg=0;const zh=new H,is=new pa,Jn=new ke,La=new H,Gs=new H,jg=new H,Kg=new pa,Nh=new H(1,0,0),Oh=new H(0,1,0),Bh=new H(0,0,1),Hh={type:"added"},Jg={type:"removed"},ss={type:"childadded",child:null},ur={type:"childremoved",child:null};class Be extends Ds{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=$n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Be.DEFAULT_UP.clone();const t=new H,e=new Yn,i=new pa,s=new H(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ke},normalMatrix:{value:new ue}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=Be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ml,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(Nh,t)}rotateY(t){return this.rotateOnAxis(Oh,t)}rotateZ(t){return this.rotateOnAxis(Bh,t)}translateOnAxis(t,e){return zh.copy(t).applyQuaternion(this.quaternion),this.position.add(zh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nh,t)}translateY(t){return this.translateOnAxis(Oh,t)}translateZ(t){return this.translateOnAxis(Bh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?La.copy(t):La.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jn.lookAt(Gs,La,this.up):Jn.lookAt(La,Gs,this.up),this.quaternion.setFromRotationMatrix(Jn),s&&(Jn.extractRotation(s.matrixWorld),is.setFromRotationMatrix(Jn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Hh),ss.child=t,this.dispatchEvent(ss),ss.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jg),ur.child=t,this.dispatchEvent(ur),ur.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Hh),ss.child=t,this.dispatchEvent(ss),ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,t,jg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gs,Kg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(a(t.materials,this.material[l]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(a(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Be.DEFAULT_UP=new H(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new H,Qn=new H,fr=new H,ti=new H,as=new H,os=new H,Gh=new H,pr=new H,mr=new H,gr=new H,xr=new Ve,vr=new Ve,_r=new Ve;class Mn{constructor(t=new H,e=new H,i=new H){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),In.subVectors(t,e),s.cross(In);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){In.subVectors(s,e),Qn.subVectors(i,e),fr.subVectors(t,e);const o=In.dot(In),r=In.dot(Qn),l=In.dot(fr),c=Qn.dot(Qn),h=Qn.dot(fr),f=o*c-r*r;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,g=(o*h-r*l)*d;return a.set(1-u-g,g,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(t,e,i,s,a,o,r,l){return this.getBarycoord(t,e,i,s,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(r,ti.z),l)}static getInterpolatedAttribute(t,e,i,s,a,o){return xr.setScalar(0),vr.setScalar(0),_r.setScalar(0),xr.fromBufferAttribute(t,e),vr.fromBufferAttribute(t,i),_r.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(xr,a.x),o.addScaledVector(vr,a.y),o.addScaledVector(_r,a.z),o}static isFrontFacing(t,e,i,s){return In.subVectors(i,e),Qn.subVectors(t,e),In.cross(Qn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return In.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),In.cross(Qn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return Mn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return Mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;as.subVectors(s,i),os.subVectors(a,i),pr.subVectors(t,i);const l=as.dot(pr),c=os.dot(pr);if(l<=0&&c<=0)return e.copy(i);mr.subVectors(t,s);const h=as.dot(mr),f=os.dot(mr);if(h>=0&&f<=h)return e.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(as,o);gr.subVectors(t,a);const u=as.dot(gr),g=os.dot(gr);if(g>=0&&u<=g)return e.copy(a);const y=u*c-l*g;if(y<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(os,r);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return Gh.subVectors(a,s),r=(f-h)/(f-h+(u-g)),e.copy(s).addScaledVector(Gh,r);const p=1/(m+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(as,o).addScaledVector(os,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Cu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Da={h:0,s:0,l:0};function yr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ie{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=hn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ye.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ye.workingColorSpace){return this.r=t,this.g=e,this.b=i,ye.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ye.workingColorSpace){if(t=fl(t,1),e=nn(e,0,1),i=nn(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=yr(o,a,t+1/3),this.g=yr(o,a,t),this.b=yr(o,a,t-1/3)}return ye.toWorkingColorSpace(this,s),this}setStyle(t,e=hn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=hn){const i=Cu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ai(t.r),this.g=ai(t.g),this.b=ai(t.b),this}copyLinearToSRGB(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=hn){return ye.fromWorkingColorSpace(rn.copy(this),t),Math.round(nn(rn.r*255,0,255))*65536+Math.round(nn(rn.g*255,0,255))*256+Math.round(nn(rn.b*255,0,255))}getHexString(t=hn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ye.workingColorSpace){ye.fromWorkingColorSpace(rn.copy(this),e);const i=rn.r,s=rn.g,a=rn.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ye.workingColorSpace){return ye.fromWorkingColorSpace(rn.copy(this),e),t.r=rn.r,t.g=rn.g,t.b=rn.b,t}getStyle(t=hn){ye.fromWorkingColorSpace(rn.copy(this),t);const e=rn.r,i=rn.g,s=rn.b;return t!==hn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(di),this.setHSL(di.h+t,di.s+e,di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(di),t.getHSL(Da);const i=Ks(di.h,Da.h,e),s=Ks(di.s,Da.s,e),a=Ks(di.l,Da.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const rn=new ie;ie.NAMES=Cu;let Qg=0;class $i extends Ds{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qg++}),this.uuid=$n(),this.name="",this.blending=ys,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ec,this.blendDst=nc,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(i.blending=this.blending),this.side!==Mi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ec&&(i.blendSrc=this.blendSrc),this.blendDst!==nc&&(i.blendDst=this.blendDst),this.blendEquation!==zi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Es&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const l=a[r];delete l.metadata,o.push(l)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class qe extends $i{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const We=new H,ka=new Wt;class sn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Bc,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ka.fromBufferAttribute(this,e),ka.applyMatrix3(t),this.setXY(e,ka.x,ka.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyMatrix3(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyMatrix4(t),this.setXYZ(e,We.x,We.y,We.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.applyNormalMatrix(t),this.setXYZ(e,We.x,We.y,We.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)We.fromBufferAttribute(this,e),We.transformDirection(t),this.setXYZ(e,We.x,We.y,We.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Fn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Te(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bc&&(t.usage=this.usage),t}}class Pu extends sn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Lu extends sn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ee extends sn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let tx=0;const wn=new ke,Mr=new Be,rs=new H,vn=new ma,Vs=new ma,tn=new H;class $e extends Ds{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tx++}),this.uuid=$n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Tu(t)?Lu:Pu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new ue().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return wn.makeRotationFromQuaternion(t),this.applyMatrix4(wn),this}rotateX(t){return wn.makeRotationX(t),this.applyMatrix4(wn),this}rotateY(t){return wn.makeRotationY(t),this.applyMatrix4(wn),this}rotateZ(t){return wn.makeRotationZ(t),this.applyMatrix4(wn),this}translate(t,e,i){return wn.makeTranslation(t,e,i),this.applyMatrix4(wn),this}scale(t,e,i){return wn.makeScale(t,e,i),this.applyMatrix4(wn),this}lookAt(t){return Mr.lookAt(t),Mr.updateMatrix(),this.applyMatrix4(Mr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ee(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ma);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];vn.setFromBufferAttribute(a),this.morphTargetsRelative?(tn.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(tn),tn.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(tn)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];Vs.setFromBufferAttribute(r),this.morphTargetsRelative?(tn.addVectors(vn.min,Vs.min),vn.expandByPoint(tn),tn.addVectors(vn.max,Vs.max),vn.expandByPoint(tn)):(vn.expandByPoint(Vs.min),vn.expandByPoint(Vs.max))}vn.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)tn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(tn));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)tn.fromBufferAttribute(r,c),l&&(rs.fromBufferAttribute(t,c),tn.add(rs)),s=Math.max(s,i.distanceToSquared(tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new sn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new H,l[T]=new H;const c=new H,h=new H,f=new H,d=new Wt,u=new Wt,g=new Wt,y=new H,m=new H;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),g.fromBufferAttribute(a,M),h.sub(c),f.sub(c),u.sub(d),g.sub(d);const C=1/(u.x*g.y-g.x*u.y);isFinite(C)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(C),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(C),r[T].add(y),r[b].add(y),r[M].add(y),l[T].add(m),l[b].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let T=0,b=x.length;T<b;++T){const M=x[T],C=M.start,U=M.count;for(let k=C,N=C+U;k<N;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const v=new H,_=new H,R=new H,w=new H;function S(T){R.fromBufferAttribute(s,T),w.copy(R);const b=r[T];v.copy(b),v.sub(R.multiplyScalar(R.dot(b))).normalize(),_.crossVectors(w,b);const C=_.dot(l[T])<0?-1:1;o.setXYZW(T,v.x,v.y,v.z,C)}for(let T=0,b=x.length;T<b;++T){const M=x[T],C=M.start,U=M.count;for(let k=C,N=C+U;k<N;k+=3)S(t.getX(k+0)),S(t.getX(k+1)),S(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new sn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new H,a=new H,o=new H,r=new H,l=new H,c=new H,h=new H,f=new H;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)tn.fromBufferAttribute(t,e),tn.normalize(),t.setXYZ(e,tn.x,tn.y,tn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,g=0;for(let y=0,m=l.length;y<m;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[g++]=c[u++]}return new sn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new $e,i=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,i);e.setAttribute(r,c)}const a=this.morphAttributes;for(const r in a){const l=[],c=a[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vh=new ke,Ai=new pl,Ia=new Fo,Xh=new H,Fa=new H,Ua=new H,za=new H,Sr=new H,Na=new H,Wh=new H,Oa=new H;class ge extends Be{constructor(t=new $e,e=new qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){Na.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=r[l],f=a[l];h!==0&&(Sr.fromBufferAttribute(f,t),o?Na.addScaledVector(Sr,h):Na.addScaledVector(Sr.sub(e),h))}e.add(Na)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ia.copy(i.boundingSphere),Ia.applyMatrix4(a),Ai.copy(t.ray).recast(t.near),!(Ia.containsPoint(Ai.origin)===!1&&(Ai.intersectSphere(Ia,Xh)===null||Ai.origin.distanceToSquared(Xh)>(t.far-t.near)**2))&&(Vh.copy(a).invert(),Ai.copy(t.ray).applyMatrix4(Vh),!(i.boundingBox!==null&&Ai.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ai)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let _=x,R=v;_<R;_+=3){const w=r.getX(_),S=r.getX(_+1),T=r.getX(_+2);s=Ba(this,p,t,i,c,h,f,w,S,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const x=r.getX(m),v=r.getX(m+1),_=r.getX(m+2);s=Ba(this,o,t,i,c,h,f,x,v,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),v=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let _=x,R=v;_<R;_+=3){const w=_,S=_+1,T=_+2;s=Ba(this,p,t,i,c,h,f,w,S,T),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const x=m,v=m+1,_=m+2;s=Ba(this,o,t,i,c,h,f,x,v,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function ex(n,t,e,i,s,a,o,r){let l;if(t.side===pn?l=i.intersectTriangle(o,a,s,!0,r):l=i.intersectTriangle(s,a,o,t.side===Mi,r),l===null)return null;Oa.copy(r),Oa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Oa);return c<e.near||c>e.far?null:{distance:c,point:Oa.clone(),object:n}}function Ba(n,t,e,i,s,a,o,r,l,c){n.getVertexPosition(r,Fa),n.getVertexPosition(l,Ua),n.getVertexPosition(c,za);const h=ex(n,t,e,i,Fa,Ua,za,Wh);if(h){const f=new H;Mn.getBarycoord(Wh,Fa,Ua,za,f),s&&(h.uv=Mn.getInterpolatedAttribute(s,r,l,c,f,new Wt)),a&&(h.uv1=Mn.getInterpolatedAttribute(a,r,l,c,f,new Wt)),o&&(h.normal=Mn.getInterpolatedAttribute(o,r,l,c,f,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new H,materialIndex:0};Mn.getNormal(Fa,Ua,za,d.normal),h.face=d,h.barycoord=f}return h}class Nn extends $e{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,o,a,0),g("z","y","x",1,-1,i,e,-t,o,a,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,a,4),g("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(f,2));function g(y,m,p,x,v,_,R,w,S,T,b){const M=_/S,C=R/T,U=_/2,k=R/2,N=w/2,P=S+1,L=T+1;let F=0,I=0;const W=new H;for(let tt=0;tt<L;tt++){const pt=tt*C-k;for(let ot=0;ot<P;ot++){const ht=ot*M-U;W[y]=ht*x,W[m]=pt*v,W[p]=N,c.push(W.x,W.y,W.z),W[y]=0,W[m]=0,W[p]=w>0?1:-1,h.push(W.x,W.y,W.z),f.push(ot/S),f.push(1-tt/T),F+=1}}for(let tt=0;tt<T;tt++)for(let pt=0;pt<S;pt++){const ot=d+pt+P*tt,ht=d+pt+P*(tt+1),K=d+(pt+1)+P*(tt+1),Y=d+(pt+1)+P*tt;l.push(ot,ht,Y),l.push(ht,K,Y),I+=6}r.addGroup(u,I,b),u+=I,d+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ps(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function ln(n){const t={};for(let e=0;e<n.length;e++){const i=Ps(n[e]);for(const s in i)t[s]=i[s]}return t}function nx(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Du(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ye.workingColorSpace}const ix={clone:Ps,merge:ln};var sx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ax=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Si extends $i{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sx,this.fragmentShader=ax,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=nx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class ku extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=si}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ui=new H,$h=new Wt,Yh=new Wt;class Tn extends ku{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=oa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return oa*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ui.x,ui.y).multiplyScalar(-t/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ui.x,ui.y).multiplyScalar(-t/ui.z)}getViewSize(t,e){return this.getViewBounds(t,$h,Yh),e.subVectors(Yh,$h)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ss*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const cs=-90,ls=1;class ox extends Be{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Tn(cs,ls,t,e);s.layers=this.layers,this.add(s);const a=new Tn(cs,ls,t,e);a.layers=this.layers,this.add(a);const o=new Tn(cs,ls,t,e);o.layers=this.layers,this.add(o);const r=new Tn(cs,ls,t,e);r.layers=this.layers,this.add(r);const l=new Tn(cs,ls,t,e);l.layers=this.layers,this.add(l);const c=new Tn(cs,ls,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,l]=e;for(const c of e)this.remove(c);if(t===si)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===So)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Iu extends un{constructor(t,e,i,s,a,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ts,super(t,e,i,s,a,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class rx extends Xi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Iu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Xn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Nn(5,5,5),a=new Si({name:"CubemapFromEquirect",uniforms:Ps(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:_i});a.uniforms.tEquirect.value=e;const o=new ge(s,a),r=e.minFilter;return e.minFilter===Bi&&(e.minFilter=Xn),new ox(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const br=new H,cx=new H,lx=new ue;class Ii{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=br.subVectors(i,e).cross(cx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(br),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||lx.getNormalMatrix(t),s=this.coplanarPoint(br).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ri=new Fo,Ha=new H;class gl{constructor(t=new Ii,e=new Ii,i=new Ii,s=new Ii,a=new Ii,o=new Ii){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=si){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],l=s[3],c=s[4],h=s[5],f=s[6],d=s[7],u=s[8],g=s[9],y=s[10],m=s[11],p=s[12],x=s[13],v=s[14],_=s[15];if(i[0].setComponents(l-a,d-c,m-u,_-p).normalize(),i[1].setComponents(l+a,d+c,m+u,_+p).normalize(),i[2].setComponents(l+o,d+h,m+g,_+x).normalize(),i[3].setComponents(l-o,d-h,m-g,_-x).normalize(),i[4].setComponents(l-r,d-f,m-y,_-v).normalize(),e===si)i[5].setComponents(l+r,d+f,m+y,_+v).normalize();else if(e===So)i[5].setComponents(r,f,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ri.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ri.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ri)}intersectsSprite(t){return Ri.center.set(0,0,0),Ri.radius=.7071067811865476,Ri.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ri)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Ha.x=s.normal.x>0?t.max.x:t.min.x,Ha.y=s.normal.y>0?t.max.y:t.min.y,Ha.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ha)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Fu(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function hx(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],y=f[u];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:s,remove:a,update:o}}class En extends $e{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),l=Math.floor(s),c=r+1,h=l+1,f=t/r,d=e/l,u=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let v=0;v<c;v++){const _=v*f-a;g.push(_,-x,0),y.push(0,0,1),m.push(v/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<r;x++){const v=x+c*p,_=x+c*(p+1),R=x+1+c*(p+1),w=x+1+c*p;u.push(v,_,w),u.push(_,R,w)}this.setIndex(u),this.setAttribute("position",new Ee(g,3)),this.setAttribute("normal",new Ee(y,3)),this.setAttribute("uv",new Ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.width,t.height,t.widthSegments,t.heightSegments)}}var dx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ux=`#ifdef USE_ALPHAHASH
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
#endif`,fx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,px=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xx=`#ifdef USE_AOMAP
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
#endif`,vx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_x=`#ifdef USE_BATCHING
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
#endif`,yx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wx=`#ifdef USE_IRIDESCENCE
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
#endif`,Ex=`#ifdef USE_BUMPMAP
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
#endif`,Tx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ax=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Px=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,kx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ix=`#define PI 3.141592653589793
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
} // validated`,Fx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ux=`vec3 transformedNormal = objectNormal;
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
#endif`,zx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ox=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vx=`#ifdef USE_ENVMAP
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
#endif`,Xx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wx=`#ifdef USE_ENVMAP
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
#endif`,$x=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yx=`#ifdef USE_ENVMAP
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
#endif`,Zx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jx=`#ifdef USE_GRADIENTMAP
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
}`,Qx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ev=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nv=`uniform bool receiveShadow;
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
#endif`,iv=`#ifdef USE_ENVMAP
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
#endif`,sv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,av=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ov=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cv=`PhysicalMaterial material;
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
#endif`,lv=`struct PhysicalMaterial {
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
}`,hv=`
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
#endif`,dv=`#if defined( RE_IndirectDiffuse )
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
#endif`,uv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_v=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yv=`#if defined( USE_POINTS_UV )
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
#endif`,Mv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ev=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`#ifdef USE_MORPHTARGETS
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
#endif`,Av=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kv=`#ifdef USE_NORMALMAP
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
#endif`,Iv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Uv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ov=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Xv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$v=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qv=`float getShadowMask() {
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
}`,jv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kv=`#ifdef USE_SKINNING
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
#endif`,Jv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qv=`#ifdef USE_SKINNING
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
#endif`,t_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,e_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,s_=`#ifdef USE_TRANSMISSION
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
#endif`,a_=`#ifdef USE_TRANSMISSION
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
#endif`,o_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const h_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,d_=`uniform sampler2D t2D;
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
}`,u_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,p_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g_=`#include <common>
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
}`,x_=`#if DEPTH_PACKING == 3200
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
}`,v_=`#define DISTANCE
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
}`,__=`#define DISTANCE
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
}`,y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,M_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S_=`uniform float scale;
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
}`,b_=`uniform vec3 diffuse;
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
}`,w_=`#include <common>
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
}`,E_=`uniform vec3 diffuse;
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
}`,T_=`#define LAMBERT
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
}`,A_=`#define LAMBERT
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
}`,R_=`#define MATCAP
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
}`,C_=`#define MATCAP
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
}`,P_=`#define NORMAL
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
}`,L_=`#define NORMAL
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
}`,D_=`#define PHONG
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
}`,k_=`#define PHONG
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
}`,I_=`#define STANDARD
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
}`,F_=`#define STANDARD
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
}`,U_=`#define TOON
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
}`,z_=`#define TOON
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
}`,N_=`uniform float size;
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
}`,O_=`uniform vec3 diffuse;
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
}`,B_=`#include <common>
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
}`,H_=`uniform vec3 color;
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
}`,G_=`uniform float rotation;
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
}`,V_=`uniform vec3 diffuse;
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
}`,pe={alphahash_fragment:dx,alphahash_pars_fragment:ux,alphamap_fragment:fx,alphamap_pars_fragment:px,alphatest_fragment:mx,alphatest_pars_fragment:gx,aomap_fragment:xx,aomap_pars_fragment:vx,batching_pars_vertex:_x,batching_vertex:yx,begin_vertex:Mx,beginnormal_vertex:Sx,bsdfs:bx,iridescence_fragment:wx,bumpmap_pars_fragment:Ex,clipping_planes_fragment:Tx,clipping_planes_pars_fragment:Ax,clipping_planes_pars_vertex:Rx,clipping_planes_vertex:Cx,color_fragment:Px,color_pars_fragment:Lx,color_pars_vertex:Dx,color_vertex:kx,common:Ix,cube_uv_reflection_fragment:Fx,defaultnormal_vertex:Ux,displacementmap_pars_vertex:zx,displacementmap_vertex:Nx,emissivemap_fragment:Ox,emissivemap_pars_fragment:Bx,colorspace_fragment:Hx,colorspace_pars_fragment:Gx,envmap_fragment:Vx,envmap_common_pars_fragment:Xx,envmap_pars_fragment:Wx,envmap_pars_vertex:$x,envmap_physical_pars_fragment:iv,envmap_vertex:Yx,fog_vertex:Zx,fog_pars_vertex:qx,fog_fragment:jx,fog_pars_fragment:Kx,gradientmap_pars_fragment:Jx,lightmap_pars_fragment:Qx,lights_lambert_fragment:tv,lights_lambert_pars_fragment:ev,lights_pars_begin:nv,lights_toon_fragment:sv,lights_toon_pars_fragment:av,lights_phong_fragment:ov,lights_phong_pars_fragment:rv,lights_physical_fragment:cv,lights_physical_pars_fragment:lv,lights_fragment_begin:hv,lights_fragment_maps:dv,lights_fragment_end:uv,logdepthbuf_fragment:fv,logdepthbuf_pars_fragment:pv,logdepthbuf_pars_vertex:mv,logdepthbuf_vertex:gv,map_fragment:xv,map_pars_fragment:vv,map_particle_fragment:_v,map_particle_pars_fragment:yv,metalnessmap_fragment:Mv,metalnessmap_pars_fragment:Sv,morphinstance_vertex:bv,morphcolor_vertex:wv,morphnormal_vertex:Ev,morphtarget_pars_vertex:Tv,morphtarget_vertex:Av,normal_fragment_begin:Rv,normal_fragment_maps:Cv,normal_pars_fragment:Pv,normal_pars_vertex:Lv,normal_vertex:Dv,normalmap_pars_fragment:kv,clearcoat_normal_fragment_begin:Iv,clearcoat_normal_fragment_maps:Fv,clearcoat_pars_fragment:Uv,iridescence_pars_fragment:zv,opaque_fragment:Nv,packing:Ov,premultiplied_alpha_fragment:Bv,project_vertex:Hv,dithering_fragment:Gv,dithering_pars_fragment:Vv,roughnessmap_fragment:Xv,roughnessmap_pars_fragment:Wv,shadowmap_pars_fragment:$v,shadowmap_pars_vertex:Yv,shadowmap_vertex:Zv,shadowmask_pars_fragment:qv,skinbase_vertex:jv,skinning_pars_vertex:Kv,skinning_vertex:Jv,skinnormal_vertex:Qv,specularmap_fragment:t_,specularmap_pars_fragment:e_,tonemapping_fragment:n_,tonemapping_pars_fragment:i_,transmission_fragment:s_,transmission_pars_fragment:a_,uv_pars_fragment:o_,uv_pars_vertex:r_,uv_vertex:c_,worldpos_vertex:l_,background_vert:h_,background_frag:d_,backgroundCube_vert:u_,backgroundCube_frag:f_,cube_vert:p_,cube_frag:m_,depth_vert:g_,depth_frag:x_,distanceRGBA_vert:v_,distanceRGBA_frag:__,equirect_vert:y_,equirect_frag:M_,linedashed_vert:S_,linedashed_frag:b_,meshbasic_vert:w_,meshbasic_frag:E_,meshlambert_vert:T_,meshlambert_frag:A_,meshmatcap_vert:R_,meshmatcap_frag:C_,meshnormal_vert:P_,meshnormal_frag:L_,meshphong_vert:D_,meshphong_frag:k_,meshphysical_vert:I_,meshphysical_frag:F_,meshtoon_vert:U_,meshtoon_frag:z_,points_vert:N_,points_frag:O_,shadow_vert:B_,shadow_frag:H_,sprite_vert:G_,sprite_frag:V_},zt={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ue},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ue}},envmap:{envMap:{value:null},envMapRotation:{value:new ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ue},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0},uvTransform:{value:new ue}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ue},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0}}},Vn={basic:{uniforms:ln([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.fog]),vertexShader:pe.meshbasic_vert,fragmentShader:pe.meshbasic_frag},lambert:{uniforms:ln([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new ie(0)}}]),vertexShader:pe.meshlambert_vert,fragmentShader:pe.meshlambert_frag},phong:{uniforms:ln([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:pe.meshphong_vert,fragmentShader:pe.meshphong_frag},standard:{uniforms:ln([zt.common,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.roughnessmap,zt.metalnessmap,zt.fog,zt.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag},toon:{uniforms:ln([zt.common,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.gradientmap,zt.fog,zt.lights,{emissive:{value:new ie(0)}}]),vertexShader:pe.meshtoon_vert,fragmentShader:pe.meshtoon_frag},matcap:{uniforms:ln([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,{matcap:{value:null}}]),vertexShader:pe.meshmatcap_vert,fragmentShader:pe.meshmatcap_frag},points:{uniforms:ln([zt.points,zt.fog]),vertexShader:pe.points_vert,fragmentShader:pe.points_frag},dashed:{uniforms:ln([zt.common,zt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pe.linedashed_vert,fragmentShader:pe.linedashed_frag},depth:{uniforms:ln([zt.common,zt.displacementmap]),vertexShader:pe.depth_vert,fragmentShader:pe.depth_frag},normal:{uniforms:ln([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,{opacity:{value:1}}]),vertexShader:pe.meshnormal_vert,fragmentShader:pe.meshnormal_frag},sprite:{uniforms:ln([zt.sprite,zt.fog]),vertexShader:pe.sprite_vert,fragmentShader:pe.sprite_frag},background:{uniforms:{uvTransform:{value:new ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pe.background_vert,fragmentShader:pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ue}},vertexShader:pe.backgroundCube_vert,fragmentShader:pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pe.cube_vert,fragmentShader:pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pe.equirect_vert,fragmentShader:pe.equirect_frag},distanceRGBA:{uniforms:ln([zt.common,zt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pe.distanceRGBA_vert,fragmentShader:pe.distanceRGBA_frag},shadow:{uniforms:ln([zt.lights,zt.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:pe.shadow_vert,fragmentShader:pe.shadow_frag}};Vn.physical={uniforms:ln([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ue},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ue},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ue},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ue},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ue},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ue}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag};const Ga={r:0,b:0,g:0},Ci=new Yn,X_=new ke;function W_(n,t,e,i,s,a,o){const r=new ie(0);let l=a===!0?0:1,c,h,f=null,d=0,u=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function y(x){let v=!1;const _=g(x);_===null?p(r,l):_&&_.isColor&&(p(_,1),v=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){const _=g(v);_&&(_.isCubeTexture||_.mapping===ko)?(h===void 0&&(h=new ge(new Nn(1,1,1),new Si({name:"BackgroundCubeMaterial",uniforms:Ps(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ci.copy(v.backgroundRotation),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(X_.makeRotationFromEuler(Ci)),h.material.toneMapped=ye.getTransfer(_.colorSpace)!==Re,(f!==_||d!==_.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=_,d=_.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new ge(new En(2,2),new Si({name:"BackgroundMaterial",uniforms:Ps(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=ye.getTransfer(_.colorSpace)!==Re,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(f!==_||d!==_.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=_,d=_.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,v){x.getRGB(Ga,Du(n)),i.buffers.color.setClear(Ga.r,Ga.g,Ga.b,v,o)}return{getClearColor:function(){return r},setClearColor:function(x,v=1){r.set(x),l=v,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(r,l)},render:y,addToRenderList:m}}function $_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,o=!1;function r(M,C,U,k,N){let P=!1;const L=f(k,U,C);a!==L&&(a=L,c(a.object)),P=u(M,k,U,N),P&&g(M,k,U,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(P||o)&&(o=!1,_(M,C,U,k),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,C,U){const k=U.wireframe===!0;let N=i[M.id];N===void 0&&(N={},i[M.id]=N);let P=N[C.id];P===void 0&&(P={},N[C.id]=P);let L=P[k];return L===void 0&&(L=d(l()),P[k]=L),L}function d(M){const C=[],U=[],k=[];for(let N=0;N<e;N++)C[N]=0,U[N]=0,k[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:U,attributeDivisors:k,object:M,attributes:{},index:null}}function u(M,C,U,k){const N=a.attributes,P=C.attributes;let L=0;const F=U.getAttributes();for(const I in F)if(F[I].location>=0){const tt=N[I];let pt=P[I];if(pt===void 0&&(I==="instanceMatrix"&&M.instanceMatrix&&(pt=M.instanceMatrix),I==="instanceColor"&&M.instanceColor&&(pt=M.instanceColor)),tt===void 0||tt.attribute!==pt||pt&&tt.data!==pt.data)return!0;L++}return a.attributesNum!==L||a.index!==k}function g(M,C,U,k){const N={},P=C.attributes;let L=0;const F=U.getAttributes();for(const I in F)if(F[I].location>=0){let tt=P[I];tt===void 0&&(I==="instanceMatrix"&&M.instanceMatrix&&(tt=M.instanceMatrix),I==="instanceColor"&&M.instanceColor&&(tt=M.instanceColor));const pt={};pt.attribute=tt,tt&&tt.data&&(pt.data=tt.data),N[I]=pt,L++}a.attributes=N,a.attributesNum=L,a.index=k}function y(){const M=a.newAttributes;for(let C=0,U=M.length;C<U;C++)M[C]=0}function m(M){p(M,0)}function p(M,C){const U=a.newAttributes,k=a.enabledAttributes,N=a.attributeDivisors;U[M]=1,k[M]===0&&(n.enableVertexAttribArray(M),k[M]=1),N[M]!==C&&(n.vertexAttribDivisor(M,C),N[M]=C)}function x(){const M=a.newAttributes,C=a.enabledAttributes;for(let U=0,k=C.length;U<k;U++)C[U]!==M[U]&&(n.disableVertexAttribArray(U),C[U]=0)}function v(M,C,U,k,N,P,L){L===!0?n.vertexAttribIPointer(M,C,U,N,P):n.vertexAttribPointer(M,C,U,k,N,P)}function _(M,C,U,k){y();const N=k.attributes,P=U.getAttributes(),L=C.defaultAttributeValues;for(const F in P){const I=P[F];if(I.location>=0){let W=N[F];if(W===void 0&&(F==="instanceMatrix"&&M.instanceMatrix&&(W=M.instanceMatrix),F==="instanceColor"&&M.instanceColor&&(W=M.instanceColor)),W!==void 0){const tt=W.normalized,pt=W.itemSize,ot=t.get(W);if(ot===void 0)continue;const ht=ot.buffer,K=ot.type,Y=ot.bytesPerElement,gt=K===n.INT||K===n.UNSIGNED_INT||W.gpuType===rl;if(W.isInterleavedBufferAttribute){const J=W.data,bt=J.stride,jt=W.offset;if(J.isInstancedInterleavedBuffer){for(let Ct=0;Ct<I.locationSize;Ct++)p(I.location+Ct,J.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Ct=0;Ct<I.locationSize;Ct++)m(I.location+Ct);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let Ct=0;Ct<I.locationSize;Ct++)v(I.location+Ct,pt/I.locationSize,K,tt,bt*Y,(jt+pt/I.locationSize*Ct)*Y,gt)}else{if(W.isInstancedBufferAttribute){for(let J=0;J<I.locationSize;J++)p(I.location+J,W.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let J=0;J<I.locationSize;J++)m(I.location+J);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let J=0;J<I.locationSize;J++)v(I.location+J,pt/I.locationSize,K,tt,pt*Y,pt/I.locationSize*J*Y,gt)}}else if(L!==void 0){const tt=L[F];if(tt!==void 0)switch(tt.length){case 2:n.vertexAttrib2fv(I.location,tt);break;case 3:n.vertexAttrib3fv(I.location,tt);break;case 4:n.vertexAttrib4fv(I.location,tt);break;default:n.vertexAttrib1fv(I.location,tt)}}}}x()}function R(){T();for(const M in i){const C=i[M];for(const U in C){const k=C[U];for(const N in k)h(k[N].object),delete k[N];delete C[U]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const C=i[M.id];for(const U in C){const k=C[U];for(const N in k)h(k[N].object),delete k[N];delete C[U]}delete i[M.id]}function S(M){for(const C in i){const U=i[C];if(U[M.id]===void 0)continue;const k=U[M.id];for(const N in k)h(k[N].object),delete k[N];delete U[M.id]}}function T(){b(),o=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:S,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function Y_(n,t,e){let i;function s(c){i=c}function a(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let g=0;for(let y=0;y<f;y++)g+=h[y]*d[y];e.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function Z_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const S=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==Un&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(S){const T=S===fa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==oi&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==ii&&!T)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:R,maxSamples:w}}function q_(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new Ii,r=new ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{const x=a?0:i,v=x*4;let _=p.clippingState||null;l.value=_,_=h(g,d,v,u);for(let R=0;R!==v;++R)_[R]=e[R];p.clippingState=_,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const y=f!==null?f.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=u+y*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,_=u;v!==y;++v,_+=4)o.copy(f[v]).applyMatrix4(x,r),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function j_(n){let t=new WeakMap;function e(o,r){return r===hc?o.mapping=Ts:r===dc&&(o.mapping=As),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===hc||r===dc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new rx(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class Uu extends ku{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const xs=4,Zh=[.125,.215,.35,.446,.526,.582],Ni=20,wr=new Uu,qh=new ie;let Er=null,Tr=0,Ar=0,Rr=!1;const Fi=(1+Math.sqrt(5))/2,hs=1/Fi,jh=[new H(-Fi,hs,0),new H(Fi,hs,0),new H(-hs,0,Fi),new H(hs,0,Fi),new H(0,Fi,-hs),new H(0,Fi,hs),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Kh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Er=this._renderer.getRenderTarget(),Tr=this._renderer.getActiveCubeFace(),Ar=this._renderer.getActiveMipmapLevel(),Rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=td(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Er,Tr,Ar),this._renderer.xr.enabled=Rr,t.scissorTest=!1,Va(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ts||t.mapping===As?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Er=this._renderer.getRenderTarget(),Tr=this._renderer.getActiveCubeFace(),Ar=this._renderer.getActiveMipmapLevel(),Rr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Xn,minFilter:Xn,generateMipmaps:!1,type:fa,format:Un,colorSpace:Ls,depthBuffer:!1},s=Jh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jh(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=K_(a)),this._blurMaterial=J_(a,t,e)}return s}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,wr)}_sceneToCubeUV(t,e,i,s){const r=new Tn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(qh),h.toneMapping=yi,h.autoClear=!1;const u=new qe({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),g=new ge(new Nn,u);let y=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,y=!0):(u.color.copy(qh),y=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):x===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const v=this._cubeSize;Va(s,x*v,p>2?v:0,v,v),h.setRenderTarget(s),y&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Ts||t.mapping===As;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=td()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qh());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const l=this._cubeSize;Va(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,wr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=jh[(s-a-1)%jh.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ge(this._lodPlanes[s],c),d=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Ni-1),y=a/g,m=isFinite(a)?1+Math.floor(h*y):Ni;m>Ni&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ni}`);const p=[];let x=0;for(let S=0;S<Ni;++S){const T=S/y,b=Math.exp(-T*T/2);p.push(b),S===0?x+=b:S<m&&(x+=2*b)}for(let S=0;S<p.length;S++)p[S]=p[S]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-i;const _=this._sizeLods[s],R=3*_*(s>v-xs?s-v+xs:0),w=4*(this._cubeSize-_);Va(e,R,w,3*_,2*_),l.setRenderTarget(e),l.render(f,wr)}}function K_(n){const t=[],e=[],i=[];let s=n;const a=n-xs+1+Zh.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let l=1/r;o>n-xs?l=Zh[o-n+xs-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,y=3,m=2,p=1,x=new Float32Array(y*g*u),v=new Float32Array(m*g*u),_=new Float32Array(p*g*u);for(let w=0;w<u;w++){const S=w%3*2/3-1,T=w>2?0:-1,b=[S,T,0,S+2/3,T,0,S+2/3,T+1,0,S,T,0,S+2/3,T+1,0,S,T+1,0];x.set(b,y*g*w),v.set(d,m*g*w);const M=[w,w,w,w,w,w];_.set(M,p*g*w)}const R=new $e;R.setAttribute("position",new sn(x,y)),R.setAttribute("uv",new sn(v,m)),R.setAttribute("faceIndex",new sn(_,p)),t.push(R),s>xs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Jh(n,t,e){const i=new Xi(n,t,e);return i.texture.mapping=ko,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Va(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function J_(n,t,e){const i=new Float32Array(Ni),s=new H(0,1,0);return new Si({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xl(),fragmentShader:`

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
		`,blending:_i,depthTest:!1,depthWrite:!1})}function Qh(){return new Si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xl(),fragmentShader:`

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
		`,blending:_i,depthTest:!1,depthWrite:!1})}function td(){return new Si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_i,depthTest:!1,depthWrite:!1})}function xl(){return`

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
	`}function Q_(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===hc||l===dc,h=l===Ts||l===As;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Kh(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new Kh(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function a(r){const l=r.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function ty(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Zs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ey(n,t,e,i){const s={},a=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const y=d.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}d.removeEventListener("dispose",o),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const y=u[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,g=f.attributes.position;let y=0;if(u!==null){const x=u.array;y=u.version;for(let v=0,_=x.length;v<_;v+=3){const R=x[v+0],w=x[v+1],S=x[v+2];d.push(R,w,w,S,S,R)}}else if(g!==void 0){const x=g.array;y=g.version;for(let v=0,_=x.length/3-1;v<_;v+=3){const R=v+0,w=v+1,S=v+2;d.push(R,w,w,S,S,R)}}else return;const m=new(Tu(d)?Lu:Pu)(d,1);m.version=y;const p=a.get(f);p&&t.remove(p),a.set(f,m)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function ny(n,t,e){let i;function s(d){i=d}let a,o;function r(d){a=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,a,d*o),e.update(u,i,1)}function c(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,a,d*o,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,y,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*y[x];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function iy(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function sy(n,t,e){const i=new WeakMap,s=new Ve;function a(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],v=r.morphAttributes.color||[];let _=0;g===!0&&(_=1),y===!0&&(_=2),m===!0&&(_=3);let R=r.attributes.position.count*_,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const S=new Float32Array(R*w*4*f),T=new Ru(S,R,w,f);T.type=ii,T.needsUpdate=!0;const b=_*4;for(let C=0;C<f;C++){const U=p[C],k=x[C],N=v[C],P=R*w*4*C;for(let L=0;L<U.count;L++){const F=L*b;g===!0&&(s.fromBufferAttribute(U,L),S[P+F+0]=s.x,S[P+F+1]=s.y,S[P+F+2]=s.z,S[P+F+3]=0),y===!0&&(s.fromBufferAttribute(k,L),S[P+F+4]=s.x,S[P+F+5]=s.y,S[P+F+6]=s.z,S[P+F+7]=0),m===!0&&(s.fromBufferAttribute(N,L),S[P+F+8]=s.x,S[P+F+9]=s.y,S[P+F+10]=s.z,S[P+F+11]=N.itemSize===4?s.w:1)}}d={count:f,texture:T,size:new Wt(R,w)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function ay(n,t,e,i){let s=new WeakMap;function a(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function o(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}class zu extends un{constructor(t,e,i,s,a,o,r,l,c,h=Ms){if(h!==Ms&&h!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ms&&(i=Vi),i===void 0&&h===Cs&&(i=Rs),super(null,s,a,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:zn,this.minFilter=l!==void 0?l:zn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Nu=new un,ed=new zu(1,1),Ou=new Ru,Bu=new Wg,Hu=new Iu,nd=[],id=[],sd=new Float32Array(16),ad=new Float32Array(9),od=new Float32Array(4);function ks(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=nd[s];if(a===void 0&&(a=new Float32Array(s),nd[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function je(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ke(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Uo(n,t){let e=id[t];e===void 0&&(e=new Int32Array(t),id[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function oy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function ry(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;n.uniform2fv(this.addr,t),Ke(e,t)}}function cy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;n.uniform3fv(this.addr,t),Ke(e,t)}}function ly(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;n.uniform4fv(this.addr,t),Ke(e,t)}}function hy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(je(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ke(e,t)}else{if(je(e,i))return;od.set(i),n.uniformMatrix2fv(this.addr,!1,od),Ke(e,i)}}function dy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(je(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ke(e,t)}else{if(je(e,i))return;ad.set(i),n.uniformMatrix3fv(this.addr,!1,ad),Ke(e,i)}}function uy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(je(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ke(e,t)}else{if(je(e,i))return;sd.set(i),n.uniformMatrix4fv(this.addr,!1,sd),Ke(e,i)}}function fy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function py(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;n.uniform2iv(this.addr,t),Ke(e,t)}}function my(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;n.uniform3iv(this.addr,t),Ke(e,t)}}function gy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;n.uniform4iv(this.addr,t),Ke(e,t)}}function xy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function vy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;n.uniform2uiv(this.addr,t),Ke(e,t)}}function _y(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;n.uniform3uiv(this.addr,t),Ke(e,t)}}function yy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;n.uniform4uiv(this.addr,t),Ke(e,t)}}function My(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(ed.compareFunction=Eu,a=ed):a=Nu,e.setTexture2D(t||a,s)}function Sy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Bu,s)}function by(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Hu,s)}function wy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Ou,s)}function Ey(n){switch(n){case 5126:return oy;case 35664:return ry;case 35665:return cy;case 35666:return ly;case 35674:return hy;case 35675:return dy;case 35676:return uy;case 5124:case 35670:return fy;case 35667:case 35671:return py;case 35668:case 35672:return my;case 35669:case 35673:return gy;case 5125:return xy;case 36294:return vy;case 36295:return _y;case 36296:return yy;case 35678:case 36198:case 36298:case 36306:case 35682:return My;case 35679:case 36299:case 36307:return Sy;case 35680:case 36300:case 36308:case 36293:return by;case 36289:case 36303:case 36311:case 36292:return wy}}function Ty(n,t){n.uniform1fv(this.addr,t)}function Ay(n,t){const e=ks(t,this.size,2);n.uniform2fv(this.addr,e)}function Ry(n,t){const e=ks(t,this.size,3);n.uniform3fv(this.addr,e)}function Cy(n,t){const e=ks(t,this.size,4);n.uniform4fv(this.addr,e)}function Py(n,t){const e=ks(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Ly(n,t){const e=ks(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Dy(n,t){const e=ks(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ky(n,t){n.uniform1iv(this.addr,t)}function Iy(n,t){n.uniform2iv(this.addr,t)}function Fy(n,t){n.uniform3iv(this.addr,t)}function Uy(n,t){n.uniform4iv(this.addr,t)}function zy(n,t){n.uniform1uiv(this.addr,t)}function Ny(n,t){n.uniform2uiv(this.addr,t)}function Oy(n,t){n.uniform3uiv(this.addr,t)}function By(n,t){n.uniform4uiv(this.addr,t)}function Hy(n,t,e){const i=this.cache,s=t.length,a=Uo(e,s);je(i,a)||(n.uniform1iv(this.addr,a),Ke(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Nu,a[o])}function Gy(n,t,e){const i=this.cache,s=t.length,a=Uo(e,s);je(i,a)||(n.uniform1iv(this.addr,a),Ke(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Bu,a[o])}function Vy(n,t,e){const i=this.cache,s=t.length,a=Uo(e,s);je(i,a)||(n.uniform1iv(this.addr,a),Ke(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Hu,a[o])}function Xy(n,t,e){const i=this.cache,s=t.length,a=Uo(e,s);je(i,a)||(n.uniform1iv(this.addr,a),Ke(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ou,a[o])}function Wy(n){switch(n){case 5126:return Ty;case 35664:return Ay;case 35665:return Ry;case 35666:return Cy;case 35674:return Py;case 35675:return Ly;case 35676:return Dy;case 5124:case 35670:return ky;case 35667:case 35671:return Iy;case 35668:case 35672:return Fy;case 35669:case 35673:return Uy;case 5125:return zy;case 36294:return Ny;case 36295:return Oy;case 36296:return By;case 35678:case 36198:case 36298:case 36306:case 35682:return Hy;case 35679:case 36299:case 36307:return Gy;case 35680:case 36300:case 36308:case 36293:return Vy;case 36289:case 36303:case 36311:case 36292:return Xy}}class $y{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Ey(e.type)}}class Yy{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Wy(e.type)}}class Zy{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const Cr=/(\w+)(\])?(\[|\.)?/g;function rd(n,t){n.seq.push(t),n.map[t.id]=t}function qy(n,t,e){const i=n.name,s=i.length;for(Cr.lastIndex=0;;){const a=Cr.exec(i),o=Cr.lastIndex;let r=a[1];const l=a[2]==="]",c=a[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===s){rd(e,c===void 0?new $y(r,n,t):new Yy(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new Zy(r),rd(e,f)),e=f}}}class lo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);qy(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function cd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const jy=37297;let Ky=0;function Jy(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const ld=new ue;function Qy(n){ye._getMatrix(ld,ye.workingColorSpace,n);const t=`mat3( ${ld.elements.map(e=>e.toFixed(4))} )`;switch(ye.getTransfer(n)){case Io:return[t,"LinearTransferOETF"];case Re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function hd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Jy(n.getShaderSource(t),o)}else return s}function tM(n,t){const e=Qy(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function eM(n,t){let e;switch(t){case ig:e="Linear";break;case sg:e="Reinhard";break;case ag:e="Cineon";break;case og:e="ACESFilmic";break;case cg:e="AgX";break;case lg:e="Neutral";break;case rg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Xa=new H;function nM(){ye.getLuminanceCoefficients(Xa);const n=Xa.x.toFixed(4),t=Xa.y.toFixed(4),e=Xa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function sM(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function aM(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function qs(n){return n!==""}function dd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ud(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const oM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hc(n){return n.replace(oM,cM)}const rM=new Map;function cM(n,t){let e=pe[t];if(e===void 0){const i=rM.get(t);if(i!==void 0)e=pe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Hc(e)}const lM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fd(n){return n.replace(lM,hM)}function hM(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function pd(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function dM(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===du?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===uu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ei&&(t="SHADOWMAP_TYPE_VSM"),t}function uM(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ts:case As:t="ENVMAP_TYPE_CUBE";break;case ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function fM(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case As:t="ENVMAP_MODE_REFRACTION";break}return t}function pM(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ol:t="ENVMAP_BLENDING_MULTIPLY";break;case eg:t="ENVMAP_BLENDING_MIX";break;case ng:t="ENVMAP_BLENDING_ADD";break}return t}function mM(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function gM(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=dM(e),c=uM(e),h=fM(e),f=pM(e),d=mM(e),u=iM(e),g=sM(a),y=s.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qs).join(`
`),p.length>0&&(p+=`
`)):(m=[pd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),p=[pd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yi?"#define TONE_MAPPING":"",e.toneMapping!==yi?pe.tonemapping_pars_fragment:"",e.toneMapping!==yi?eM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",pe.colorspace_pars_fragment,tM("linearToOutputTexel",e.outputColorSpace),nM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qs).join(`
`)),o=Hc(o),o=dd(o,e),o=ud(o,e),r=Hc(r),r=dd(r,e),r=ud(r,e),o=fd(o),r=fd(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Eh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Eh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=x+m+o,_=x+p+r,R=cd(s,s.VERTEX_SHADER,v),w=cd(s,s.FRAGMENT_SHADER,_);s.attachShader(y,R),s.attachShader(y,w),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function S(C){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(y).trim(),k=s.getShaderInfoLog(R).trim(),N=s.getShaderInfoLog(w).trim();let P=!0,L=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(P=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,y,R,w);else{const F=hd(s,R,"vertex"),I=hd(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+U+`
`+F+`
`+I)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(k===""||N==="")&&(L=!1);L&&(C.diagnostics={runnable:P,programLog:U,vertexShader:{log:k,prefix:m},fragmentShader:{log:N,prefix:p}})}s.deleteShader(R),s.deleteShader(w),T=new lo(s,y),b=aM(s,y)}let T;this.getUniforms=function(){return T===void 0&&S(this),T};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(y,jy)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ky++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=w,this}let xM=0;class vM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new _M(t),e.set(t,i)),i}}class _M{constructor(t){this.id=xM++,this.code=t,this.usedTimes=0}}function yM(n,t,e,i,s,a,o){const r=new ml,l=new vM,c=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,M,C,U,k){const N=U.fog,P=k.geometry,L=b.isMeshStandardMaterial?U.environment:null,F=(b.isMeshStandardMaterial?e:t).get(b.envMap||L),I=F&&F.mapping===ko?F.image.height:null,W=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const tt=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,pt=tt!==void 0?tt.length:0;let ot=0;P.morphAttributes.position!==void 0&&(ot=1),P.morphAttributes.normal!==void 0&&(ot=2),P.morphAttributes.color!==void 0&&(ot=3);let ht,K,Y,gt;if(W){const se=Vn[W];ht=se.vertexShader,K=se.fragmentShader}else ht=b.vertexShader,K=b.fragmentShader,l.update(b),Y=l.getVertexShaderID(b),gt=l.getFragmentShaderID(b);const J=n.getRenderTarget(),bt=n.state.buffers.depth.getReversed(),jt=k.isInstancedMesh===!0,Ct=k.isBatchedMesh===!0,Lt=!!b.map,ft=!!b.matcap,Kt=!!F,G=!!b.aoMap,fe=!!b.lightMap,qt=!!b.bumpMap,It=!!b.normalMap,Rt=!!b.displacementMap,yt=!!b.emissiveMap,Tt=!!b.metalnessMap,D=!!b.roughnessMap,E=b.anisotropy>0,$=b.clearcoat>0,rt=b.dispersion>0,ct=b.iridescence>0,nt=b.sheen>0,kt=b.transmission>0,q=E&&!!b.anisotropyMap,dt=$&&!!b.clearcoatMap,Bt=$&&!!b.clearcoatNormalMap,it=$&&!!b.clearcoatRoughnessMap,xt=ct&&!!b.iridescenceMap,B=ct&&!!b.iridescenceThicknessMap,st=nt&&!!b.sheenColorMap,ut=nt&&!!b.sheenRoughnessMap,Ft=!!b.specularMap,Gt=!!b.specularColorMap,$t=!!b.specularIntensityMap,z=kt&&!!b.transmissionMap,vt=kt&&!!b.thicknessMap,j=!!b.gradientMap,at=!!b.alphaMap,wt=b.alphaTest>0,Mt=!!b.alphaHash,Jt=!!b.extensions;let ae=yi;b.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(ae=n.toneMapping);const oe={shaderID:W,shaderType:b.type,shaderName:b.name,vertexShader:ht,fragmentShader:K,defines:b.defines,customVertexShaderID:Y,customFragmentShaderID:gt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&k._colorsTexture!==null,instancing:jt,instancingColor:jt&&k.instanceColor!==null,instancingMorph:jt&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ls,alphaToCoverage:!!b.alphaToCoverage,map:Lt,matcap:ft,envMap:Kt,envMapMode:Kt&&F.mapping,envMapCubeUVHeight:I,aoMap:G,lightMap:fe,bumpMap:qt,normalMap:It,displacementMap:d&&Rt,emissiveMap:yt,normalMapObjectSpace:It&&b.normalMapType===fg,normalMapTangentSpace:It&&b.normalMapType===wu,metalnessMap:Tt,roughnessMap:D,anisotropy:E,anisotropyMap:q,clearcoat:$,clearcoatMap:dt,clearcoatNormalMap:Bt,clearcoatRoughnessMap:it,dispersion:rt,iridescence:ct,iridescenceMap:xt,iridescenceThicknessMap:B,sheen:nt,sheenColorMap:st,sheenRoughnessMap:ut,specularMap:Ft,specularColorMap:Gt,specularIntensityMap:$t,transmission:kt,transmissionMap:z,thicknessMap:vt,gradientMap:j,opaque:b.transparent===!1&&b.blending===ys&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:wt,alphaHash:Mt,combine:b.combine,mapUv:Lt&&y(b.map.channel),aoMapUv:G&&y(b.aoMap.channel),lightMapUv:fe&&y(b.lightMap.channel),bumpMapUv:qt&&y(b.bumpMap.channel),normalMapUv:It&&y(b.normalMap.channel),displacementMapUv:Rt&&y(b.displacementMap.channel),emissiveMapUv:yt&&y(b.emissiveMap.channel),metalnessMapUv:Tt&&y(b.metalnessMap.channel),roughnessMapUv:D&&y(b.roughnessMap.channel),anisotropyMapUv:q&&y(b.anisotropyMap.channel),clearcoatMapUv:dt&&y(b.clearcoatMap.channel),clearcoatNormalMapUv:Bt&&y(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&y(b.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&y(b.iridescenceMap.channel),iridescenceThicknessMapUv:B&&y(b.iridescenceThicknessMap.channel),sheenColorMapUv:st&&y(b.sheenColorMap.channel),sheenRoughnessMapUv:ut&&y(b.sheenRoughnessMap.channel),specularMapUv:Ft&&y(b.specularMap.channel),specularColorMapUv:Gt&&y(b.specularColorMap.channel),specularIntensityMapUv:$t&&y(b.specularIntensityMap.channel),transmissionMapUv:z&&y(b.transmissionMap.channel),thicknessMapUv:vt&&y(b.thicknessMap.channel),alphaMapUv:at&&y(b.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(It||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!P.attributes.uv&&(Lt||at),fog:!!N,useFog:b.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:bt,skinning:k.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:ot,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:ae,decodeVideoTexture:Lt&&b.map.isVideoTexture===!0&&ye.getTransfer(b.map.colorSpace)===Re,decodeVideoTextureEmissive:yt&&b.emissiveMap.isVideoTexture===!0&&ye.getTransfer(b.emissiveMap.colorSpace)===Re,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ne,flipSided:b.side===pn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Jt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Jt&&b.extensions.multiDraw===!0||Ct)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(x(M,b),v(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function v(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function _(b){const M=g[b.type];let C;if(M){const U=Vn[M];C=ix.clone(U.uniforms)}else C=b.uniforms;return C}function R(b,M){let C;for(let U=0,k=h.length;U<k;U++){const N=h[U];if(N.cacheKey===M){C=N,++C.usedTimes;break}}return C===void 0&&(C=new gM(n,M,b,a),h.push(C)),C}function w(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function S(b){l.remove(b)}function T(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:w,releaseShaderCache:S,programs:h,dispose:T}}function MM(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,l){n.get(o)[r]=l}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function SM(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function md(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function gd(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,d,u,g,y,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:y,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=y,p.group=m),t++,p}function r(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function l(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||SM),i.length>1&&i.sort(d||md),s.length>1&&s.sort(d||md)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:l,finish:h,sort:c}}function bM(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new gd,n.set(i,[o])):s>=a.length?(o=new gd,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function wM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new ie};break;case"SpotLight":e={position:new H,direction:new H,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new ie,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":e={color:new ie,position:new H,halfWidth:new H,halfHeight:new H};break}return n[t.id]=e,e}}}function EM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let TM=0;function AM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function RM(n){const t=new wM,e=EM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const s=new H,a=new ke,o=new ke;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,g=0,y=0,m=0,p=0,x=0,v=0,_=0,R=0,w=0,S=0;c.sort(AM);for(let b=0,M=c.length;b<M;b++){const C=c[b],U=C.color,k=C.intensity,N=C.distance,P=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=U.r*k,f+=U.g*k,d+=U.b*k;else if(C.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(C.sh.coefficients[L],k);S++}else if(C.isDirectionalLight){const L=t.get(C);if(L.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const F=C.shadow,I=e.get(C);I.shadowIntensity=F.intensity,I.shadowBias=F.bias,I.shadowNormalBias=F.normalBias,I.shadowRadius=F.radius,I.shadowMapSize=F.mapSize,i.directionalShadow[u]=I,i.directionalShadowMap[u]=P,i.directionalShadowMatrix[u]=C.shadow.matrix,x++}i.directional[u]=L,u++}else if(C.isSpotLight){const L=t.get(C);L.position.setFromMatrixPosition(C.matrixWorld),L.color.copy(U).multiplyScalar(k),L.distance=N,L.coneCos=Math.cos(C.angle),L.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),L.decay=C.decay,i.spot[y]=L;const F=C.shadow;if(C.map&&(i.spotLightMap[R]=C.map,R++,F.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[y]=F.matrix,C.castShadow){const I=e.get(C);I.shadowIntensity=F.intensity,I.shadowBias=F.bias,I.shadowNormalBias=F.normalBias,I.shadowRadius=F.radius,I.shadowMapSize=F.mapSize,i.spotShadow[y]=I,i.spotShadowMap[y]=P,_++}y++}else if(C.isRectAreaLight){const L=t.get(C);L.color.copy(U).multiplyScalar(k),L.halfWidth.set(C.width*.5,0,0),L.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=L,m++}else if(C.isPointLight){const L=t.get(C);if(L.color.copy(C.color).multiplyScalar(C.intensity),L.distance=C.distance,L.decay=C.decay,C.castShadow){const F=C.shadow,I=e.get(C);I.shadowIntensity=F.intensity,I.shadowBias=F.bias,I.shadowNormalBias=F.normalBias,I.shadowRadius=F.radius,I.shadowMapSize=F.mapSize,I.shadowCameraNear=F.camera.near,I.shadowCameraFar=F.camera.far,i.pointShadow[g]=I,i.pointShadowMap[g]=P,i.pointShadowMatrix[g]=C.shadow.matrix,v++}i.point[g]=L,g++}else if(C.isHemisphereLight){const L=t.get(C);L.skyColor.copy(C.color).multiplyScalar(k),L.groundColor.copy(C.groundColor).multiplyScalar(k),i.hemi[p]=L,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=zt.LTC_FLOAT_1,i.rectAreaLTC2=zt.LTC_FLOAT_2):(i.rectAreaLTC1=zt.LTC_HALF_1,i.rectAreaLTC2=zt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==g||T.spotLength!==y||T.rectAreaLength!==m||T.hemiLength!==p||T.numDirectionalShadows!==x||T.numPointShadows!==v||T.numSpotShadows!==_||T.numSpotMaps!==R||T.numLightProbes!==S)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=_+R-w,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=S,T.directionalLength=u,T.pointLength=g,T.spotLength=y,T.rectAreaLength=m,T.hemiLength=p,T.numDirectionalShadows=x,T.numPointShadows=v,T.numSpotShadows=_,T.numSpotMaps=R,T.numLightProbes=S,i.version=TM++)}function l(c,h){let f=0,d=0,u=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const v=c[p];if(v.isDirectionalLight){const _=i.directional[f];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(v.isSpotLight){const _=i.spot[u];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(v.isRectAreaLight){const _=i.rectArea[g];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),o.identity(),a.copy(v.matrixWorld),a.premultiply(m),o.extractRotation(a),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const _=i.point[d];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const _=i.hemi[y];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),y++}}}return{setup:r,setupView:l,state:i}}function xd(n){const t=new RM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:r,setupLightsView:l,pushLight:a,pushShadow:o}}function CM(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new xd(n),t.set(s,[r])):a>=o.length?(r=new xd(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class PM extends $i{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=dg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class LM extends $i{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const DM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kM=`uniform sampler2D shadow_pass;
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
}`;function IM(n,t,e){let i=new gl;const s=new Wt,a=new Wt,o=new Ve,r=new PM({depthPacking:ug}),l=new LM,c={},h=e.maxTextureSize,f={[Mi]:pn,[pn]:Mi,[Ne]:Ne},d=new Si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:DM,fragmentShader:kM}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new $e;g.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ge(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=du;let p=this.type;this.render=function(w,S,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),U=n.state;U.setBlending(_i),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const k=p!==ei&&this.type===ei,N=p===ei&&this.type!==ei;for(let P=0,L=w.length;P<L;P++){const F=w[P],I=F.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",F,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;s.copy(I.mapSize);const W=I.getFrameExtents();if(s.multiply(W),a.copy(I.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/W.x),s.x=a.x*W.x,I.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/W.y),s.y=a.y*W.y,I.mapSize.y=a.y)),I.map===null||k===!0||N===!0){const pt=this.type!==ei?{minFilter:zn,magFilter:zn}:{};I.map!==null&&I.map.dispose(),I.map=new Xi(s.x,s.y,pt),I.map.texture.name=F.name+".shadowMap",I.camera.updateProjectionMatrix()}n.setRenderTarget(I.map),n.clear();const tt=I.getViewportCount();for(let pt=0;pt<tt;pt++){const ot=I.getViewport(pt);o.set(a.x*ot.x,a.y*ot.y,a.x*ot.z,a.y*ot.w),U.viewport(o),I.updateMatrices(F,pt),i=I.getFrustum(),_(S,T,I.camera,F,this.type)}I.isPointLightShadow!==!0&&this.type===ei&&x(I,T),I.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,M,C)};function x(w,S){const T=t.update(y);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,u.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Xi(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(S,null,T,d,y,null),u.uniforms.shadow_pass.value=w.mapPass.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(S,null,T,u,y,null)}function v(w,S,T,b){let M=null;const C=T.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)M=C;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const U=M.uuid,k=S.uuid;let N=c[U];N===void 0&&(N={},c[U]=N);let P=N[k];P===void 0&&(P=M.clone(),N[k]=P,S.addEventListener("dispose",R)),M=P}if(M.visible=S.visible,M.wireframe=S.wireframe,b===ei?M.side=S.shadowSide!==null?S.shadowSide:S.side:M.side=S.shadowSide!==null?S.shadowSide:f[S.side],M.alphaMap=S.alphaMap,M.alphaTest=S.alphaTest,M.map=S.map,M.clipShadows=S.clipShadows,M.clippingPlanes=S.clippingPlanes,M.clipIntersection=S.clipIntersection,M.displacementMap=S.displacementMap,M.displacementScale=S.displacementScale,M.displacementBias=S.displacementBias,M.wireframeLinewidth=S.wireframeLinewidth,M.linewidth=S.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const U=n.properties.get(M);U.light=T}return M}function _(w,S,T,b,M){if(w.visible===!1)return;if(w.layers.test(S.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===ei)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,w.matrixWorld);const k=t.update(w),N=w.material;if(Array.isArray(N)){const P=k.groups;for(let L=0,F=P.length;L<F;L++){const I=P[L],W=N[I.materialIndex];if(W&&W.visible){const tt=v(w,W,b,M);w.onBeforeShadow(n,w,S,T,k,tt,I),n.renderBufferDirect(T,null,k,tt,w,I),w.onAfterShadow(n,w,S,T,k,tt,I)}}}else if(N.visible){const P=v(w,N,b,M);w.onBeforeShadow(n,w,S,T,k,P,null),n.renderBufferDirect(T,null,k,P,w,null),w.onAfterShadow(n,w,S,T,k,P,null)}}const U=w.children;for(let k=0,N=U.length;k<N;k++)_(U[k],S,T,b,M)}function R(w){w.target.removeEventListener("dispose",R);for(const T in c){const b=c[T],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const FM={[ic]:sc,[ac]:cc,[oc]:lc,[Es]:rc,[sc]:ic,[cc]:ac,[lc]:oc,[rc]:Es};function UM(n,t){function e(){let z=!1;const vt=new Ve;let j=null;const at=new Ve(0,0,0,0);return{setMask:function(wt){j!==wt&&!z&&(n.colorMask(wt,wt,wt,wt),j=wt)},setLocked:function(wt){z=wt},setClear:function(wt,Mt,Jt,ae,oe){oe===!0&&(wt*=ae,Mt*=ae,Jt*=ae),vt.set(wt,Mt,Jt,ae),at.equals(vt)===!1&&(n.clearColor(wt,Mt,Jt,ae),at.copy(vt))},reset:function(){z=!1,j=null,at.set(-1,0,0,0)}}}function i(){let z=!1,vt=!1,j=null,at=null,wt=null;return{setReversed:function(Mt){if(vt!==Mt){const Jt=t.get("EXT_clip_control");vt?Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.ZERO_TO_ONE_EXT):Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.NEGATIVE_ONE_TO_ONE_EXT);const ae=wt;wt=null,this.setClear(ae)}vt=Mt},getReversed:function(){return vt},setTest:function(Mt){Mt?J(n.DEPTH_TEST):bt(n.DEPTH_TEST)},setMask:function(Mt){j!==Mt&&!z&&(n.depthMask(Mt),j=Mt)},setFunc:function(Mt){if(vt&&(Mt=FM[Mt]),at!==Mt){switch(Mt){case ic:n.depthFunc(n.NEVER);break;case sc:n.depthFunc(n.ALWAYS);break;case ac:n.depthFunc(n.LESS);break;case Es:n.depthFunc(n.LEQUAL);break;case oc:n.depthFunc(n.EQUAL);break;case rc:n.depthFunc(n.GEQUAL);break;case cc:n.depthFunc(n.GREATER);break;case lc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}at=Mt}},setLocked:function(Mt){z=Mt},setClear:function(Mt){wt!==Mt&&(vt&&(Mt=1-Mt),n.clearDepth(Mt),wt=Mt)},reset:function(){z=!1,j=null,at=null,wt=null,vt=!1}}}function s(){let z=!1,vt=null,j=null,at=null,wt=null,Mt=null,Jt=null,ae=null,oe=null;return{setTest:function(se){z||(se?J(n.STENCIL_TEST):bt(n.STENCIL_TEST))},setMask:function(se){vt!==se&&!z&&(n.stencilMask(se),vt=se)},setFunc:function(se,be,xe){(j!==se||at!==be||wt!==xe)&&(n.stencilFunc(se,be,xe),j=se,at=be,wt=xe)},setOp:function(se,be,xe){(Mt!==se||Jt!==be||ae!==xe)&&(n.stencilOp(se,be,xe),Mt=se,Jt=be,ae=xe)},setLocked:function(se){z=se},setClear:function(se){oe!==se&&(n.clearStencil(se),oe=se)},reset:function(){z=!1,vt=null,j=null,at=null,wt=null,Mt=null,Jt=null,ae=null,oe=null}}}const a=new e,o=new i,r=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,x=null,v=null,_=null,R=null,w=null,S=new ie(0,0,0),T=0,b=!1,M=null,C=null,U=null,k=null,N=null;const P=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let L=!1,F=0;const I=n.getParameter(n.VERSION);I.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(I)[1]),L=F>=1):I.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),L=F>=2);let W=null,tt={};const pt=n.getParameter(n.SCISSOR_BOX),ot=n.getParameter(n.VIEWPORT),ht=new Ve().fromArray(pt),K=new Ve().fromArray(ot);function Y(z,vt,j,at){const wt=new Uint8Array(4),Mt=n.createTexture();n.bindTexture(z,Mt),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Jt=0;Jt<j;Jt++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(vt,0,n.RGBA,1,1,at,0,n.RGBA,n.UNSIGNED_BYTE,wt):n.texImage2D(vt+Jt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,wt);return Mt}const gt={};gt[n.TEXTURE_2D]=Y(n.TEXTURE_2D,n.TEXTURE_2D,1),gt[n.TEXTURE_CUBE_MAP]=Y(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[n.TEXTURE_2D_ARRAY]=Y(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),gt[n.TEXTURE_3D]=Y(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),J(n.DEPTH_TEST),o.setFunc(Es),qt(!1),It(yh),J(n.CULL_FACE),G(_i);function J(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function bt(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function jt(z,vt){return f[z]!==vt?(n.bindFramebuffer(z,vt),f[z]=vt,z===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=vt),z===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=vt),!0):!1}function Ct(z,vt){let j=u,at=!1;if(z){j=d.get(vt),j===void 0&&(j=[],d.set(vt,j));const wt=z.textures;if(j.length!==wt.length||j[0]!==n.COLOR_ATTACHMENT0){for(let Mt=0,Jt=wt.length;Mt<Jt;Mt++)j[Mt]=n.COLOR_ATTACHMENT0+Mt;j.length=wt.length,at=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,at=!0);at&&n.drawBuffers(j)}function Lt(z){return g!==z?(n.useProgram(z),g=z,!0):!1}const ft={[zi]:n.FUNC_ADD,[N0]:n.FUNC_SUBTRACT,[O0]:n.FUNC_REVERSE_SUBTRACT};ft[B0]=n.MIN,ft[H0]=n.MAX;const Kt={[G0]:n.ZERO,[V0]:n.ONE,[X0]:n.SRC_COLOR,[ec]:n.SRC_ALPHA,[j0]:n.SRC_ALPHA_SATURATE,[Z0]:n.DST_COLOR,[$0]:n.DST_ALPHA,[W0]:n.ONE_MINUS_SRC_COLOR,[nc]:n.ONE_MINUS_SRC_ALPHA,[q0]:n.ONE_MINUS_DST_COLOR,[Y0]:n.ONE_MINUS_DST_ALPHA,[K0]:n.CONSTANT_COLOR,[J0]:n.ONE_MINUS_CONSTANT_COLOR,[Q0]:n.CONSTANT_ALPHA,[tg]:n.ONE_MINUS_CONSTANT_ALPHA};function G(z,vt,j,at,wt,Mt,Jt,ae,oe,se){if(z===_i){y===!0&&(bt(n.BLEND),y=!1);return}if(y===!1&&(J(n.BLEND),y=!0),z!==z0){if(z!==m||se!==b){if((p!==zi||_!==zi)&&(n.blendEquation(n.FUNC_ADD),p=zi,_=zi),se)switch(z){case ys:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pi:n.blendFunc(n.ONE,n.ONE);break;case Mh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case ys:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Mh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}x=null,v=null,R=null,w=null,S.set(0,0,0),T=0,m=z,b=se}return}wt=wt||vt,Mt=Mt||j,Jt=Jt||at,(vt!==p||wt!==_)&&(n.blendEquationSeparate(ft[vt],ft[wt]),p=vt,_=wt),(j!==x||at!==v||Mt!==R||Jt!==w)&&(n.blendFuncSeparate(Kt[j],Kt[at],Kt[Mt],Kt[Jt]),x=j,v=at,R=Mt,w=Jt),(ae.equals(S)===!1||oe!==T)&&(n.blendColor(ae.r,ae.g,ae.b,oe),S.copy(ae),T=oe),m=z,b=!1}function fe(z,vt){z.side===Ne?bt(n.CULL_FACE):J(n.CULL_FACE);let j=z.side===pn;vt&&(j=!j),qt(j),z.blending===ys&&z.transparent===!1?G(_i):G(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),a.setMask(z.colorWrite);const at=z.stencilWrite;r.setTest(at),at&&(r.setMask(z.stencilWriteMask),r.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),r.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),yt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):bt(n.SAMPLE_ALPHA_TO_COVERAGE)}function qt(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function It(z){z!==F0?(J(n.CULL_FACE),z!==C&&(z===yh?n.cullFace(n.BACK):z===U0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):bt(n.CULL_FACE),C=z}function Rt(z){z!==U&&(L&&n.lineWidth(z),U=z)}function yt(z,vt,j){z?(J(n.POLYGON_OFFSET_FILL),(k!==vt||N!==j)&&(n.polygonOffset(vt,j),k=vt,N=j)):bt(n.POLYGON_OFFSET_FILL)}function Tt(z){z?J(n.SCISSOR_TEST):bt(n.SCISSOR_TEST)}function D(z){z===void 0&&(z=n.TEXTURE0+P-1),W!==z&&(n.activeTexture(z),W=z)}function E(z,vt,j){j===void 0&&(W===null?j=n.TEXTURE0+P-1:j=W);let at=tt[j];at===void 0&&(at={type:void 0,texture:void 0},tt[j]=at),(at.type!==z||at.texture!==vt)&&(W!==j&&(n.activeTexture(j),W=j),n.bindTexture(z,vt||gt[z]),at.type=z,at.texture=vt)}function $(){const z=tt[W];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function rt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ct(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function nt(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function kt(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function q(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function dt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Bt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function it(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function xt(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function st(z){ht.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),ht.copy(z))}function ut(z){K.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),K.copy(z))}function Ft(z,vt){let j=c.get(vt);j===void 0&&(j=new WeakMap,c.set(vt,j));let at=j.get(z);at===void 0&&(at=n.getUniformBlockIndex(vt,z.name),j.set(z,at))}function Gt(z,vt){const at=c.get(vt).get(z);l.get(vt)!==at&&(n.uniformBlockBinding(vt,at,z.__bindingPointIndex),l.set(vt,at))}function $t(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},W=null,tt={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,x=null,v=null,_=null,R=null,w=null,S=new ie(0,0,0),T=0,b=!1,M=null,C=null,U=null,k=null,N=null,ht.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:J,disable:bt,bindFramebuffer:jt,drawBuffers:Ct,useProgram:Lt,setBlending:G,setMaterial:fe,setFlipSided:qt,setCullFace:It,setLineWidth:Rt,setPolygonOffset:yt,setScissorTest:Tt,activeTexture:D,bindTexture:E,unbindTexture:$,compressedTexImage2D:rt,compressedTexImage3D:ct,texImage2D:xt,texImage3D:B,updateUBOMapping:Ft,uniformBlockBinding:Gt,texStorage2D:Bt,texStorage3D:it,texSubImage2D:nt,texSubImage3D:kt,compressedTexSubImage2D:q,compressedTexSubImage3D:dt,scissor:st,viewport:ut,reset:$t}}function vd(n,t,e,i){const s=zM(i);switch(e){case xu:return n*t;case _u:return n*t;case yu:return n*t*2;case Mu:return n*t/s.components*s.byteLength;case hl:return n*t/s.components*s.byteLength;case Su:return n*t*2/s.components*s.byteLength;case dl:return n*t*2/s.components*s.byteLength;case vu:return n*t*3/s.components*s.byteLength;case Un:return n*t*4/s.components*s.byteLength;case ul:return n*t*4/s.components*s.byteLength;case so:case ao:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case oo:case ro:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case mc:case xc:return Math.max(n,16)*Math.max(t,8)/4;case pc:case gc:return Math.max(n,8)*Math.max(t,8)/2;case vc:case _c:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case yc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Mc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Sc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case bc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case wc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Ec:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Tc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ac:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Rc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Cc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Pc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Lc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Dc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case kc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ic:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case co:case Fc:case Uc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case bu:case zc:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Nc:case Oc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function zM(n){switch(n){case oi:case pu:return{byteLength:1,components:1};case aa:case mu:case fa:return{byteLength:2,components:1};case cl:case ll:return{byteLength:2,components:4};case Vi:case rl:case ii:return{byteLength:4,components:1};case gu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function NM(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,E){return u?new OffscreenCanvas(D,E):bo("canvas")}function y(D,E,$){let rt=1;const ct=Tt(D);if((ct.width>$||ct.height>$)&&(rt=$/Math.max(ct.width,ct.height)),rt<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const nt=Math.floor(rt*ct.width),kt=Math.floor(rt*ct.height);f===void 0&&(f=g(nt,kt));const q=E?g(nt,kt):f;return q.width=nt,q.height=kt,q.getContext("2d").drawImage(D,0,0,nt,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ct.width+"x"+ct.height+") to ("+nt+"x"+kt+")."),q}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ct.width+"x"+ct.height+")."),D;return D}function m(D){return D.generateMipmaps}function p(D){n.generateMipmap(D)}function x(D){return D.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?n.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(D,E,$,rt,ct=!1){if(D!==null){if(n[D]!==void 0)return n[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let nt=E;if(E===n.RED&&($===n.FLOAT&&(nt=n.R32F),$===n.HALF_FLOAT&&(nt=n.R16F),$===n.UNSIGNED_BYTE&&(nt=n.R8)),E===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(nt=n.R8UI),$===n.UNSIGNED_SHORT&&(nt=n.R16UI),$===n.UNSIGNED_INT&&(nt=n.R32UI),$===n.BYTE&&(nt=n.R8I),$===n.SHORT&&(nt=n.R16I),$===n.INT&&(nt=n.R32I)),E===n.RG&&($===n.FLOAT&&(nt=n.RG32F),$===n.HALF_FLOAT&&(nt=n.RG16F),$===n.UNSIGNED_BYTE&&(nt=n.RG8)),E===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(nt=n.RG8UI),$===n.UNSIGNED_SHORT&&(nt=n.RG16UI),$===n.UNSIGNED_INT&&(nt=n.RG32UI),$===n.BYTE&&(nt=n.RG8I),$===n.SHORT&&(nt=n.RG16I),$===n.INT&&(nt=n.RG32I)),E===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(nt=n.RGB8UI),$===n.UNSIGNED_SHORT&&(nt=n.RGB16UI),$===n.UNSIGNED_INT&&(nt=n.RGB32UI),$===n.BYTE&&(nt=n.RGB8I),$===n.SHORT&&(nt=n.RGB16I),$===n.INT&&(nt=n.RGB32I)),E===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(nt=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(nt=n.RGBA16UI),$===n.UNSIGNED_INT&&(nt=n.RGBA32UI),$===n.BYTE&&(nt=n.RGBA8I),$===n.SHORT&&(nt=n.RGBA16I),$===n.INT&&(nt=n.RGBA32I)),E===n.RGB&&$===n.UNSIGNED_INT_5_9_9_9_REV&&(nt=n.RGB9_E5),E===n.RGBA){const kt=ct?Io:ye.getTransfer(rt);$===n.FLOAT&&(nt=n.RGBA32F),$===n.HALF_FLOAT&&(nt=n.RGBA16F),$===n.UNSIGNED_BYTE&&(nt=kt===Re?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(nt=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(nt=n.RGB5_A1)}return(nt===n.R16F||nt===n.R32F||nt===n.RG16F||nt===n.RG32F||nt===n.RGBA16F||nt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function _(D,E){let $;return D?E===null||E===Vi||E===Rs?$=n.DEPTH24_STENCIL8:E===ii?$=n.DEPTH32F_STENCIL8:E===aa&&($=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Vi||E===Rs?$=n.DEPTH_COMPONENT24:E===ii?$=n.DEPTH_COMPONENT32F:E===aa&&($=n.DEPTH_COMPONENT16),$}function R(D,E){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==zn&&D.minFilter!==Xn?Math.log2(Math.max(E.width,E.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?E.mipmaps.length:1}function w(D){const E=D.target;E.removeEventListener("dispose",w),T(E),E.isVideoTexture&&h.delete(E)}function S(D){const E=D.target;E.removeEventListener("dispose",S),M(E)}function T(D){const E=i.get(D);if(E.__webglInit===void 0)return;const $=D.source,rt=d.get($);if(rt){const ct=rt[E.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&b(D),Object.keys(rt).length===0&&d.delete($)}i.remove(D)}function b(D){const E=i.get(D);n.deleteTexture(E.__webglTexture);const $=D.source,rt=d.get($);delete rt[E.__cacheKey],o.memory.textures--}function M(D){const E=i.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),i.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(E.__webglFramebuffer[rt]))for(let ct=0;ct<E.__webglFramebuffer[rt].length;ct++)n.deleteFramebuffer(E.__webglFramebuffer[rt][ct]);else n.deleteFramebuffer(E.__webglFramebuffer[rt]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[rt])}else{if(Array.isArray(E.__webglFramebuffer))for(let rt=0;rt<E.__webglFramebuffer.length;rt++)n.deleteFramebuffer(E.__webglFramebuffer[rt]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let rt=0;rt<E.__webglColorRenderbuffer.length;rt++)E.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[rt]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const $=D.textures;for(let rt=0,ct=$.length;rt<ct;rt++){const nt=i.get($[rt]);nt.__webglTexture&&(n.deleteTexture(nt.__webglTexture),o.memory.textures--),i.remove($[rt])}i.remove(D)}let C=0;function U(){C=0}function k(){const D=C;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),C+=1,D}function N(D){const E=[];return E.push(D.wrapS),E.push(D.wrapT),E.push(D.wrapR||0),E.push(D.magFilter),E.push(D.minFilter),E.push(D.anisotropy),E.push(D.internalFormat),E.push(D.format),E.push(D.type),E.push(D.generateMipmaps),E.push(D.premultiplyAlpha),E.push(D.flipY),E.push(D.unpackAlignment),E.push(D.colorSpace),E.join()}function P(D,E){const $=i.get(D);if(D.isVideoTexture&&Rt(D),D.isRenderTargetTexture===!1&&D.version>0&&$.__version!==D.version){const rt=D.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K($,D,E);return}}e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+E)}function L(D,E){const $=i.get(D);if(D.version>0&&$.__version!==D.version){K($,D,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+E)}function F(D,E){const $=i.get(D);if(D.version>0&&$.__version!==D.version){K($,D,E);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+E)}function I(D,E){const $=i.get(D);if(D.version>0&&$.__version!==D.version){Y($,D,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+E)}const W={[uc]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[fc]:n.MIRRORED_REPEAT},tt={[zn]:n.NEAREST,[hg]:n.NEAREST_MIPMAP_NEAREST,[wa]:n.NEAREST_MIPMAP_LINEAR,[Xn]:n.LINEAR,[ir]:n.LINEAR_MIPMAP_NEAREST,[Bi]:n.LINEAR_MIPMAP_LINEAR},pt={[pg]:n.NEVER,[yg]:n.ALWAYS,[mg]:n.LESS,[Eu]:n.LEQUAL,[gg]:n.EQUAL,[_g]:n.GEQUAL,[xg]:n.GREATER,[vg]:n.NOTEQUAL};function ot(D,E){if(E.type===ii&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Xn||E.magFilter===ir||E.magFilter===wa||E.magFilter===Bi||E.minFilter===Xn||E.minFilter===ir||E.minFilter===wa||E.minFilter===Bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(D,n.TEXTURE_WRAP_S,W[E.wrapS]),n.texParameteri(D,n.TEXTURE_WRAP_T,W[E.wrapT]),(D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY)&&n.texParameteri(D,n.TEXTURE_WRAP_R,W[E.wrapR]),n.texParameteri(D,n.TEXTURE_MAG_FILTER,tt[E.magFilter]),n.texParameteri(D,n.TEXTURE_MIN_FILTER,tt[E.minFilter]),E.compareFunction&&(n.texParameteri(D,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(D,n.TEXTURE_COMPARE_FUNC,pt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===zn||E.minFilter!==wa&&E.minFilter!==Bi||E.type===ii&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");n.texParameterf(D,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function ht(D,E){let $=!1;D.__webglInit===void 0&&(D.__webglInit=!0,E.addEventListener("dispose",w));const rt=E.source;let ct=d.get(rt);ct===void 0&&(ct={},d.set(rt,ct));const nt=N(E);if(nt!==D.__cacheKey){ct[nt]===void 0&&(ct[nt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,$=!0),ct[nt].usedTimes++;const kt=ct[D.__cacheKey];kt!==void 0&&(ct[D.__cacheKey].usedTimes--,kt.usedTimes===0&&b(E)),D.__cacheKey=nt,D.__webglTexture=ct[nt].texture}return $}function K(D,E,$){let rt=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(rt=n.TEXTURE_3D);const ct=ht(D,E),nt=E.source;e.bindTexture(rt,D.__webglTexture,n.TEXTURE0+$);const kt=i.get(nt);if(nt.version!==kt.__version||ct===!0){e.activeTexture(n.TEXTURE0+$);const q=ye.getPrimaries(ye.workingColorSpace),dt=E.colorSpace===mi?null:ye.getPrimaries(E.colorSpace),Bt=E.colorSpace===mi||q===dt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let it=y(E.image,!1,s.maxTextureSize);it=yt(E,it);const xt=a.convert(E.format,E.colorSpace),B=a.convert(E.type);let st=v(E.internalFormat,xt,B,E.colorSpace,E.isVideoTexture);ot(rt,E);let ut;const Ft=E.mipmaps,Gt=E.isVideoTexture!==!0,$t=kt.__version===void 0||ct===!0,z=nt.dataReady,vt=R(E,it);if(E.isDepthTexture)st=_(E.format===Cs,E.type),$t&&(Gt?e.texStorage2D(n.TEXTURE_2D,1,st,it.width,it.height):e.texImage2D(n.TEXTURE_2D,0,st,it.width,it.height,0,xt,B,null));else if(E.isDataTexture)if(Ft.length>0){Gt&&$t&&e.texStorage2D(n.TEXTURE_2D,vt,st,Ft[0].width,Ft[0].height);for(let j=0,at=Ft.length;j<at;j++)ut=Ft[j],Gt?z&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,ut.width,ut.height,xt,B,ut.data):e.texImage2D(n.TEXTURE_2D,j,st,ut.width,ut.height,0,xt,B,ut.data);E.generateMipmaps=!1}else Gt?($t&&e.texStorage2D(n.TEXTURE_2D,vt,st,it.width,it.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,it.width,it.height,xt,B,it.data)):e.texImage2D(n.TEXTURE_2D,0,st,it.width,it.height,0,xt,B,it.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Gt&&$t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,st,Ft[0].width,Ft[0].height,it.depth);for(let j=0,at=Ft.length;j<at;j++)if(ut=Ft[j],E.format!==Un)if(xt!==null)if(Gt){if(z)if(E.layerUpdates.size>0){const wt=vd(ut.width,ut.height,E.format,E.type);for(const Mt of E.layerUpdates){const Jt=ut.data.subarray(Mt*wt/ut.data.BYTES_PER_ELEMENT,(Mt+1)*wt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,Mt,ut.width,ut.height,1,xt,Jt)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ut.width,ut.height,it.depth,xt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,st,ut.width,ut.height,it.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ut.width,ut.height,it.depth,xt,B,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,j,st,ut.width,ut.height,it.depth,0,xt,B,ut.data)}else{Gt&&$t&&e.texStorage2D(n.TEXTURE_2D,vt,st,Ft[0].width,Ft[0].height);for(let j=0,at=Ft.length;j<at;j++)ut=Ft[j],E.format!==Un?xt!==null?Gt?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,ut.width,ut.height,xt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,j,st,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?z&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,ut.width,ut.height,xt,B,ut.data):e.texImage2D(n.TEXTURE_2D,j,st,ut.width,ut.height,0,xt,B,ut.data)}else if(E.isDataArrayTexture)if(Gt){if($t&&e.texStorage3D(n.TEXTURE_2D_ARRAY,vt,st,it.width,it.height,it.depth),z)if(E.layerUpdates.size>0){const j=vd(it.width,it.height,E.format,E.type);for(const at of E.layerUpdates){const wt=it.data.subarray(at*j/it.data.BYTES_PER_ELEMENT,(at+1)*j/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,at,it.width,it.height,1,xt,B,wt)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,xt,B,it.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,st,it.width,it.height,it.depth,0,xt,B,it.data);else if(E.isData3DTexture)Gt?($t&&e.texStorage3D(n.TEXTURE_3D,vt,st,it.width,it.height,it.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,xt,B,it.data)):e.texImage3D(n.TEXTURE_3D,0,st,it.width,it.height,it.depth,0,xt,B,it.data);else if(E.isFramebufferTexture){if($t)if(Gt)e.texStorage2D(n.TEXTURE_2D,vt,st,it.width,it.height);else{let j=it.width,at=it.height;for(let wt=0;wt<vt;wt++)e.texImage2D(n.TEXTURE_2D,wt,st,j,at,0,xt,B,null),j>>=1,at>>=1}}else if(Ft.length>0){if(Gt&&$t){const j=Tt(Ft[0]);e.texStorage2D(n.TEXTURE_2D,vt,st,j.width,j.height)}for(let j=0,at=Ft.length;j<at;j++)ut=Ft[j],Gt?z&&e.texSubImage2D(n.TEXTURE_2D,j,0,0,xt,B,ut):e.texImage2D(n.TEXTURE_2D,j,st,xt,B,ut);E.generateMipmaps=!1}else if(Gt){if($t){const j=Tt(it);e.texStorage2D(n.TEXTURE_2D,vt,st,j.width,j.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt,B,it)}else e.texImage2D(n.TEXTURE_2D,0,st,xt,B,it);m(E)&&p(rt),kt.__version=nt.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function Y(D,E,$){if(E.image.length!==6)return;const rt=ht(D,E),ct=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,D.__webglTexture,n.TEXTURE0+$);const nt=i.get(ct);if(ct.version!==nt.__version||rt===!0){e.activeTexture(n.TEXTURE0+$);const kt=ye.getPrimaries(ye.workingColorSpace),q=E.colorSpace===mi?null:ye.getPrimaries(E.colorSpace),dt=E.colorSpace===mi||kt===q?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Bt=E.isCompressedTexture||E.image[0].isCompressedTexture,it=E.image[0]&&E.image[0].isDataTexture,xt=[];for(let at=0;at<6;at++)!Bt&&!it?xt[at]=y(E.image[at],!0,s.maxCubemapSize):xt[at]=it?E.image[at].image:E.image[at],xt[at]=yt(E,xt[at]);const B=xt[0],st=a.convert(E.format,E.colorSpace),ut=a.convert(E.type),Ft=v(E.internalFormat,st,ut,E.colorSpace),Gt=E.isVideoTexture!==!0,$t=nt.__version===void 0||rt===!0,z=ct.dataReady;let vt=R(E,B);ot(n.TEXTURE_CUBE_MAP,E);let j;if(Bt){Gt&&$t&&e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Ft,B.width,B.height);for(let at=0;at<6;at++){j=xt[at].mipmaps;for(let wt=0;wt<j.length;wt++){const Mt=j[wt];E.format!==Un?st!==null?Gt?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt,0,0,Mt.width,Mt.height,st,Mt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt,Ft,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt,0,0,Mt.width,Mt.height,st,ut,Mt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt,Ft,Mt.width,Mt.height,0,st,ut,Mt.data)}}}else{if(j=E.mipmaps,Gt&&$t){j.length>0&&vt++;const at=Tt(xt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,vt,Ft,at.width,at.height)}for(let at=0;at<6;at++)if(it){Gt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,xt[at].width,xt[at].height,st,ut,xt[at].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ft,xt[at].width,xt[at].height,0,st,ut,xt[at].data);for(let wt=0;wt<j.length;wt++){const Jt=j[wt].image[at].image;Gt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt+1,0,0,Jt.width,Jt.height,st,ut,Jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt+1,Ft,Jt.width,Jt.height,0,st,ut,Jt.data)}}else{Gt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,st,ut,xt[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Ft,st,ut,xt[at]);for(let wt=0;wt<j.length;wt++){const Mt=j[wt];Gt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt+1,0,0,st,ut,Mt.image[at]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+at,wt+1,Ft,st,ut,Mt.image[at])}}}m(E)&&p(n.TEXTURE_CUBE_MAP),nt.__version=ct.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function gt(D,E,$,rt,ct,nt){const kt=a.convert($.format,$.colorSpace),q=a.convert($.type),dt=v($.internalFormat,kt,q,$.colorSpace),Bt=i.get(E),it=i.get($);if(it.__renderTarget=E,!Bt.__hasExternalTextures){const xt=Math.max(1,E.width>>nt),B=Math.max(1,E.height>>nt);ct===n.TEXTURE_3D||ct===n.TEXTURE_2D_ARRAY?e.texImage3D(ct,nt,dt,xt,B,E.depth,0,kt,q,null):e.texImage2D(ct,nt,dt,xt,B,0,kt,q,null)}e.bindFramebuffer(n.FRAMEBUFFER,D),It(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,ct,it.__webglTexture,0,qt(E)):(ct===n.TEXTURE_2D||ct>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,ct,it.__webglTexture,nt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(D,E,$){if(n.bindRenderbuffer(n.RENDERBUFFER,D),E.depthBuffer){const rt=E.depthTexture,ct=rt&&rt.isDepthTexture?rt.type:null,nt=_(E.stencilBuffer,ct),kt=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=qt(E);It(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,q,nt,E.width,E.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,q,nt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,nt,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,D)}else{const rt=E.textures;for(let ct=0;ct<rt.length;ct++){const nt=rt[ct],kt=a.convert(nt.format,nt.colorSpace),q=a.convert(nt.type),dt=v(nt.internalFormat,kt,q,nt.colorSpace),Bt=qt(E);$&&It(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,dt,E.width,E.height):It(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,dt,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,dt,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function bt(D,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,D),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=i.get(E.depthTexture);rt.__renderTarget=E,(!rt.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),P(E.depthTexture,0);const ct=rt.__webglTexture,nt=qt(E);if(E.depthTexture.format===Ms)It(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ct,0);else if(E.depthTexture.format===Cs)It(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function jt(D){const E=i.get(D),$=D.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==D.depthTexture){const rt=D.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),rt){const ct=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,rt.removeEventListener("dispose",ct)};rt.addEventListener("dispose",ct),E.__depthDisposeCallback=ct}E.__boundDepthTexture=rt}if(D.depthTexture&&!E.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");bt(E.__webglFramebuffer,D)}else if($){E.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[rt]),E.__webglDepthbuffer[rt]===void 0)E.__webglDepthbuffer[rt]=n.createRenderbuffer(),J(E.__webglDepthbuffer[rt],D,!1);else{const ct=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=E.__webglDepthbuffer[rt];n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,nt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),J(E.__webglDepthbuffer,D,!1);else{const rt=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ct),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,ct)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ct(D,E,$){const rt=i.get(D);E!==void 0&&gt(rt.__webglFramebuffer,D,D.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&jt(D)}function Lt(D){const E=D.texture,$=i.get(D),rt=i.get(E);D.addEventListener("dispose",S);const ct=D.textures,nt=D.isWebGLCubeRenderTarget===!0,kt=ct.length>1;if(kt||(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=E.version,o.memory.textures++),nt){$.__webglFramebuffer=[];for(let q=0;q<6;q++)if(E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer[q]=[];for(let dt=0;dt<E.mipmaps.length;dt++)$.__webglFramebuffer[q][dt]=n.createFramebuffer()}else $.__webglFramebuffer[q]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){$.__webglFramebuffer=[];for(let q=0;q<E.mipmaps.length;q++)$.__webglFramebuffer[q]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(kt)for(let q=0,dt=ct.length;q<dt;q++){const Bt=i.get(ct[q]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),o.memory.textures++)}if(D.samples>0&&It(D)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let q=0;q<ct.length;q++){const dt=ct[q];$.__webglColorRenderbuffer[q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[q]);const Bt=a.convert(dt.format,dt.colorSpace),it=a.convert(dt.type),xt=v(dt.internalFormat,Bt,it,dt.colorSpace,D.isXRRenderTarget===!0),B=qt(D);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,xt,D.width,D.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+q,n.RENDERBUFFER,$.__webglColorRenderbuffer[q])}n.bindRenderbuffer(n.RENDERBUFFER,null),D.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),J($.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(nt){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),ot(n.TEXTURE_CUBE_MAP,E);for(let q=0;q<6;q++)if(E.mipmaps&&E.mipmaps.length>0)for(let dt=0;dt<E.mipmaps.length;dt++)gt($.__webglFramebuffer[q][dt],D,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+q,dt);else gt($.__webglFramebuffer[q],D,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);m(E)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let q=0,dt=ct.length;q<dt;q++){const Bt=ct[q],it=i.get(Bt);e.bindTexture(n.TEXTURE_2D,it.__webglTexture),ot(n.TEXTURE_2D,Bt),gt($.__webglFramebuffer,D,Bt,n.COLOR_ATTACHMENT0+q,n.TEXTURE_2D,0),m(Bt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let q=n.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(q=D.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(q,rt.__webglTexture),ot(q,E),E.mipmaps&&E.mipmaps.length>0)for(let dt=0;dt<E.mipmaps.length;dt++)gt($.__webglFramebuffer[dt],D,E,n.COLOR_ATTACHMENT0,q,dt);else gt($.__webglFramebuffer,D,E,n.COLOR_ATTACHMENT0,q,0);m(E)&&p(q),e.unbindTexture()}D.depthBuffer&&jt(D)}function ft(D){const E=D.textures;for(let $=0,rt=E.length;$<rt;$++){const ct=E[$];if(m(ct)){const nt=x(D),kt=i.get(ct).__webglTexture;e.bindTexture(nt,kt),p(nt),e.unbindTexture()}}}const Kt=[],G=[];function fe(D){if(D.samples>0){if(It(D)===!1){const E=D.textures,$=D.width,rt=D.height;let ct=n.COLOR_BUFFER_BIT;const nt=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(D),q=E.length>1;if(q)for(let dt=0;dt<E.length;dt++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let dt=0;dt<E.length;dt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ct|=n.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ct|=n.STENCIL_BUFFER_BIT)),q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[dt]);const Bt=i.get(E[dt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Bt,0)}n.blitFramebuffer(0,0,$,rt,0,0,$,rt,ct,n.NEAREST),l===!0&&(Kt.length=0,G.length=0,Kt.push(n.COLOR_ATTACHMENT0+dt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Kt.push(nt),G.push(nt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Kt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),q)for(let dt=0;dt<E.length;dt++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.RENDERBUFFER,kt.__webglColorRenderbuffer[dt]);const Bt=i.get(E[dt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+dt,n.TEXTURE_2D,Bt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const E=D.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function qt(D){return Math.min(s.maxSamples,D.samples)}function It(D){const E=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Rt(D){const E=o.render.frame;h.get(D)!==E&&(h.set(D,E),D.update())}function yt(D,E){const $=D.colorSpace,rt=D.format,ct=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||$!==Ls&&$!==mi&&(ye.getTransfer($)===Re?(rt!==Un||ct!==oi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),E}function Tt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=U,this.setTexture2D=P,this.setTexture2DArray=L,this.setTexture3D=F,this.setTextureCube=I,this.rebindTextures=Ct,this.setupRenderTarget=Lt,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=It}function OM(n,t){function e(i,s=mi){let a;const o=ye.getTransfer(s);if(i===oi)return n.UNSIGNED_BYTE;if(i===cl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ll)return n.UNSIGNED_SHORT_5_5_5_1;if(i===gu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===pu)return n.BYTE;if(i===mu)return n.SHORT;if(i===aa)return n.UNSIGNED_SHORT;if(i===rl)return n.INT;if(i===Vi)return n.UNSIGNED_INT;if(i===ii)return n.FLOAT;if(i===fa)return n.HALF_FLOAT;if(i===xu)return n.ALPHA;if(i===vu)return n.RGB;if(i===Un)return n.RGBA;if(i===_u)return n.LUMINANCE;if(i===yu)return n.LUMINANCE_ALPHA;if(i===Ms)return n.DEPTH_COMPONENT;if(i===Cs)return n.DEPTH_STENCIL;if(i===Mu)return n.RED;if(i===hl)return n.RED_INTEGER;if(i===Su)return n.RG;if(i===dl)return n.RG_INTEGER;if(i===ul)return n.RGBA_INTEGER;if(i===so||i===ao||i===oo||i===ro)if(o===Re)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===so)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ao)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===oo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ro)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===so)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ao)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===oo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ro)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===pc||i===mc||i===gc||i===xc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===pc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===mc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===gc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===xc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vc||i===_c||i===yc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===vc||i===_c)return o===Re?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===yc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Mc||i===Sc||i===bc||i===wc||i===Ec||i===Tc||i===Ac||i===Rc||i===Cc||i===Pc||i===Lc||i===Dc||i===kc||i===Ic)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Mc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Sc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===bc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===wc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ec)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Tc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ac)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Rc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Pc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Lc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Dc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kc)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ic)return o===Re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===co||i===Fc||i===Uc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===co)return o===Re?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Fc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Uc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bu||i===zc||i===Nc||i===Oc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===co)return a.COMPRESSED_RED_RGTC1_EXT;if(i===zc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Nc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Rs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class BM extends Tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ce extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const HM={type:"move"};class Pr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ce,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ce,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ce,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,i),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&d>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(HM)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ce;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const GM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,VM=`
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

}`;class XM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new un,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Si({vertexShader:GM,fragmentShader:VM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new En(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WM extends Ds{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,g=null;const y=new XM,m=e.getContextAttributes();let p=null,x=null;const v=[],_=[],R=new Wt;let w=null;const S=new Tn;S.viewport=new Ve;const T=new Tn;T.viewport=new Ve;const b=[S,T],M=new BM;let C=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let Y=v[K];return Y===void 0&&(Y=new Pr,v[K]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(K){let Y=v[K];return Y===void 0&&(Y=new Pr,v[K]=Y),Y.getGripSpace()},this.getHand=function(K){let Y=v[K];return Y===void 0&&(Y=new Pr,v[K]=Y),Y.getHandSpace()};function k(K){const Y=_.indexOf(K.inputSource);if(Y===-1)return;const gt=v[Y];gt!==void 0&&(gt.update(K.inputSource,K.frame,c||o),gt.dispatchEvent({type:K.type,data:K.inputSource}))}function N(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",P);for(let K=0;K<v.length;K++){const Y=_[K];Y!==null&&(_[K]=null,v[K].disconnect(Y))}C=null,U=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,s=null,x=null,ht.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",N),s.addEventListener("inputsourceschange",P),m.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(R),s.renderState.layers===void 0){const Y={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new Xi(u.framebufferWidth,u.framebufferHeight,{format:Un,type:oi,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Y=null,gt=null,J=null;m.depth&&(J=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=m.stencil?Cs:Ms,gt=m.stencil?Rs:Vi);const bt={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(bt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Xi(d.textureWidth,d.textureHeight,{format:Un,type:oi,depthTexture:new zu(d.textureWidth,d.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(r),ht.setContext(s),ht.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function P(K){for(let Y=0;Y<K.removed.length;Y++){const gt=K.removed[Y],J=_.indexOf(gt);J>=0&&(_[J]=null,v[J].disconnect(gt))}for(let Y=0;Y<K.added.length;Y++){const gt=K.added[Y];let J=_.indexOf(gt);if(J===-1){for(let jt=0;jt<v.length;jt++)if(jt>=_.length){_.push(gt),J=jt;break}else if(_[jt]===null){_[jt]=gt,J=jt;break}if(J===-1)break}const bt=v[J];bt&&bt.connect(gt)}}const L=new H,F=new H;function I(K,Y,gt){L.setFromMatrixPosition(Y.matrixWorld),F.setFromMatrixPosition(gt.matrixWorld);const J=L.distanceTo(F),bt=Y.projectionMatrix.elements,jt=gt.projectionMatrix.elements,Ct=bt[14]/(bt[10]-1),Lt=bt[14]/(bt[10]+1),ft=(bt[9]+1)/bt[5],Kt=(bt[9]-1)/bt[5],G=(bt[8]-1)/bt[0],fe=(jt[8]+1)/jt[0],qt=Ct*G,It=Ct*fe,Rt=J/(-G+fe),yt=Rt*-G;if(Y.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(yt),K.translateZ(Rt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),bt[10]===-1)K.projectionMatrix.copy(Y.projectionMatrix),K.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const Tt=Ct+Rt,D=Lt+Rt,E=qt-yt,$=It+(J-yt),rt=ft*Lt/D*Tt,ct=Kt*Lt/D*Tt;K.projectionMatrix.makePerspective(E,$,rt,ct,Tt,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function W(K,Y){Y===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(Y.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let Y=K.near,gt=K.far;y.texture!==null&&(y.depthNear>0&&(Y=y.depthNear),y.depthFar>0&&(gt=y.depthFar)),M.near=T.near=S.near=Y,M.far=T.far=S.far=gt,(C!==M.near||U!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,U=M.far),S.layers.mask=K.layers.mask|2,T.layers.mask=K.layers.mask|4,M.layers.mask=S.layers.mask|T.layers.mask;const J=K.parent,bt=M.cameras;W(M,J);for(let jt=0;jt<bt.length;jt++)W(bt[jt],J);bt.length===2?I(M,S,T):M.projectionMatrix.copy(S.projectionMatrix),tt(K,M,J)};function tt(K,Y,gt){gt===null?K.matrix.copy(Y.matrixWorld):(K.matrix.copy(gt.matrixWorld),K.matrix.invert(),K.matrix.multiply(Y.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(Y.projectionMatrix),K.projectionMatrixInverse.copy(Y.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=oa*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=K)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let pt=null;function ot(K,Y){if(h=Y.getViewerPose(c||o),g=Y,h!==null){const gt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let J=!1;gt.length!==M.cameras.length&&(M.cameras.length=0,J=!0);for(let jt=0;jt<gt.length;jt++){const Ct=gt[jt];let Lt=null;if(u!==null)Lt=u.getViewport(Ct);else{const Kt=f.getViewSubImage(d,Ct);Lt=Kt.viewport,jt===0&&(t.setRenderTargetTextures(x,Kt.colorTexture,d.ignoreDepthValues?void 0:Kt.depthStencilTexture),t.setRenderTarget(x))}let ft=b[jt];ft===void 0&&(ft=new Tn,ft.layers.enable(jt),ft.viewport=new Ve,b[jt]=ft),ft.matrix.fromArray(Ct.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Ct.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),jt===0&&(M.matrix.copy(ft.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),J===!0&&M.cameras.push(ft)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")){const jt=f.getDepthInformation(gt[0]);jt&&jt.isValid&&jt.texture&&y.init(t,jt,s.renderState)}}for(let gt=0;gt<v.length;gt++){const J=_[gt],bt=v[gt];J!==null&&bt!==void 0&&bt.update(J,Y,c||o)}pt&&pt(K,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),g=null}const ht=new Fu;ht.setAnimationLoop(ot),this.setAnimationLoop=function(K){pt=K},this.dispose=function(){}}}const Pi=new Yn,$M=new ke;function YM(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Du(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,v,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,_)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),y(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,x,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===pn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===pn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),v=x.envMap,_=x.envMapRotation;v&&(m.envMap.value=v,Pi.copy(_),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),m.envMapRotation.value.setFromMatrix4($M.makeRotationFromEuler(Pi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ZM(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,v){const _=v.program;i.uniformBlockBinding(x,_)}function c(x,v){let _=s[x.id];_===void 0&&(g(x),_=h(x),s[x.id]=_,x.addEventListener("dispose",m));const R=v.program;i.updateUBOMapping(x,R);const w=t.render.frame;a[x.id]!==w&&(d(x),a[x.id]=w)}function h(x){const v=f();x.__bindingPointIndex=v;const _=n.createBuffer(),R=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,R,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,_),_}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const v=s[x.id],_=x.uniforms,R=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let w=0,S=_.length;w<S;w++){const T=Array.isArray(_[w])?_[w]:[_[w]];for(let b=0,M=T.length;b<M;b++){const C=T[b];if(u(C,w,b,R)===!0){const U=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let P=0;P<k.length;P++){const L=k[P],F=y(L);typeof L=="number"||typeof L=="boolean"?(C.__data[0]=L,n.bufferSubData(n.UNIFORM_BUFFER,U+N,C.__data)):L.isMatrix3?(C.__data[0]=L.elements[0],C.__data[1]=L.elements[1],C.__data[2]=L.elements[2],C.__data[3]=0,C.__data[4]=L.elements[3],C.__data[5]=L.elements[4],C.__data[6]=L.elements[5],C.__data[7]=0,C.__data[8]=L.elements[6],C.__data[9]=L.elements[7],C.__data[10]=L.elements[8],C.__data[11]=0):(L.toArray(C.__data,N),N+=F.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,v,_,R){const w=x.value,S=v+"_"+_;if(R[S]===void 0)return typeof w=="number"||typeof w=="boolean"?R[S]=w:R[S]=w.clone(),!0;{const T=R[S];if(typeof w=="number"||typeof w=="boolean"){if(T!==w)return R[S]=w,!0}else if(T.equals(w)===!1)return T.copy(w),!0}return!1}function g(x){const v=x.uniforms;let _=0;const R=16;for(let S=0,T=v.length;S<T;S++){const b=Array.isArray(v[S])?v[S]:[v[S]];for(let M=0,C=b.length;M<C;M++){const U=b[M],k=Array.isArray(U.value)?U.value:[U.value];for(let N=0,P=k.length;N<P;N++){const L=k[N],F=y(L),I=_%R,W=I%F.boundary,tt=I+W;_+=W,tt!==0&&R-tt<F.storage&&(_+=R-tt),U.__data=new Float32Array(F.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=_,_+=F.storage}}}const w=_%R;return w>0&&(_+=R-w),x.__size=_,x.__cache={},this}function y(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){const v=x.target;v.removeEventListener("dispose",m);const _=o.indexOf(v.__bindingPointIndex);o.splice(_,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const x in s)n.deleteBuffer(s[x]);o=[],s={},a={}}return{bind:l,update:c,dispose:p}}class qM{constructor(t={}){const{canvas:e=zg(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const x=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hn,this.toneMapping=yi,this.toneMappingExposure=1;const _=this;let R=!1,w=0,S=0,T=null,b=-1,M=null;const C=new Ve,U=new Ve;let k=null;const N=new ie(0);let P=0,L=e.width,F=e.height,I=1,W=null,tt=null;const pt=new Ve(0,0,L,F),ot=new Ve(0,0,L,F);let ht=!1;const K=new gl;let Y=!1,gt=!1;const J=new ke,bt=new ke,jt=new H,Ct=new Ve,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ft=!1;function Kt(){return T===null?I:1}let G=i;function fe(A,V){return e.getContext(A,V)}try{const A={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${al}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),G===null){const V="webgl2";if(G=fe(V,A),G===null)throw fe(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let qt,It,Rt,yt,Tt,D,E,$,rt,ct,nt,kt,q,dt,Bt,it,xt,B,st,ut,Ft,Gt,$t,z;function vt(){qt=new ty(G),qt.init(),Gt=new OM(G,qt),It=new Z_(G,qt,t,Gt),Rt=new UM(G,qt),It.reverseDepthBuffer&&d&&Rt.buffers.depth.setReversed(!0),yt=new iy(G),Tt=new MM,D=new NM(G,qt,Rt,Tt,It,Gt,yt),E=new j_(_),$=new Q_(_),rt=new hx(G),$t=new $_(G,rt),ct=new ey(G,rt,yt,$t),nt=new ay(G,ct,rt,yt),st=new sy(G,It,D),it=new q_(Tt),kt=new yM(_,E,$,qt,It,$t,it),q=new YM(_,Tt),dt=new bM,Bt=new CM(qt),B=new W_(_,E,$,Rt,nt,u,l),xt=new IM(_,nt,It),z=new ZM(G,yt,It,Rt),ut=new Y_(G,qt,yt),Ft=new ny(G,qt,yt),yt.programs=kt.programs,_.capabilities=It,_.extensions=qt,_.properties=Tt,_.renderLists=dt,_.shadowMap=xt,_.state=Rt,_.info=yt}vt();const j=new WM(_,G);this.xr=j,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=qt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=qt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(A){A!==void 0&&(I=A,this.setSize(L,F,!1))},this.getSize=function(A){return A.set(L,F)},this.setSize=function(A,V,et=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}L=A,F=V,e.width=Math.floor(A*I),e.height=Math.floor(V*I),et===!0&&(e.style.width=A+"px",e.style.height=V+"px"),this.setViewport(0,0,A,V)},this.getDrawingBufferSize=function(A){return A.set(L*I,F*I).floor()},this.setDrawingBufferSize=function(A,V,et){L=A,F=V,I=et,e.width=Math.floor(A*et),e.height=Math.floor(V*et),this.setViewport(0,0,A,V)},this.getCurrentViewport=function(A){return A.copy(C)},this.getViewport=function(A){return A.copy(pt)},this.setViewport=function(A,V,et,Q){A.isVector4?pt.set(A.x,A.y,A.z,A.w):pt.set(A,V,et,Q),Rt.viewport(C.copy(pt).multiplyScalar(I).round())},this.getScissor=function(A){return A.copy(ot)},this.setScissor=function(A,V,et,Q){A.isVector4?ot.set(A.x,A.y,A.z,A.w):ot.set(A,V,et,Q),Rt.scissor(U.copy(ot).multiplyScalar(I).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(A){Rt.setScissorTest(ht=A)},this.setOpaqueSort=function(A){W=A},this.setTransparentSort=function(A){tt=A},this.getClearColor=function(A){return A.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(A=!0,V=!0,et=!0){let Q=0;if(A){let X=!1;if(T!==null){const Et=T.texture.format;X=Et===ul||Et===dl||Et===hl}if(X){const Et=T.texture.type,Dt=Et===oi||Et===Vi||Et===aa||Et===Rs||Et===cl||Et===ll,Yt=B.getClearColor(),Zt=B.getClearAlpha(),Vt=Yt.r,Xt=Yt.g,Ht=Yt.b;Dt?(g[0]=Vt,g[1]=Xt,g[2]=Ht,g[3]=Zt,G.clearBufferuiv(G.COLOR,0,g)):(y[0]=Vt,y[1]=Xt,y[2]=Ht,y[3]=Zt,G.clearBufferiv(G.COLOR,0,y))}else Q|=G.COLOR_BUFFER_BIT}V&&(Q|=G.DEPTH_BUFFER_BIT),et&&(Q|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),dt.dispose(),Bt.dispose(),Tt.dispose(),E.dispose(),$.dispose(),nt.dispose(),$t.dispose(),z.dispose(),kt.dispose(),j.dispose(),j.removeEventListener("sessionstart",Je),j.removeEventListener("sessionend",Qe),Me.stop()};function at(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=yt.autoReset,V=xt.enabled,et=xt.autoUpdate,Q=xt.needsUpdate,X=xt.type;vt(),yt.autoReset=A,xt.enabled=V,xt.autoUpdate=et,xt.needsUpdate=Q,xt.type=X}function Mt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Jt(A){const V=A.target;V.removeEventListener("dispose",Jt),ae(V)}function ae(A){oe(A),Tt.remove(A)}function oe(A){const V=Tt.get(A).programs;V!==void 0&&(V.forEach(function(et){kt.releaseProgram(et)}),A.isShaderMaterial&&kt.releaseShaderCache(A))}this.renderBufferDirect=function(A,V,et,Q,X,Et){V===null&&(V=Lt);const Dt=X.isMesh&&X.matrixWorld.determinant()<0,Yt=re(A,V,et,Q,X);Rt.setMaterial(Q,Dt);let Zt=et.index,Vt=1;if(Q.wireframe===!0){if(Zt=ct.getWireframeAttribute(et),Zt===void 0)return;Vt=2}const Xt=et.drawRange,Ht=et.attributes.position;let he=Xt.start*Vt,St=(Xt.start+Xt.count)*Vt;Et!==null&&(he=Math.max(he,Et.start*Vt),St=Math.min(St,(Et.start+Et.count)*Vt)),Zt!==null?(he=Math.max(he,0),St=Math.min(St,Zt.count)):Ht!=null&&(he=Math.max(he,0),St=Math.min(St,Ht.count));const _t=St-he;if(_t<0||_t===1/0)return;$t.setup(X,Q,Yt,et,Zt);let ne,ce=ut;if(Zt!==null&&(ne=rt.get(Zt),ce=Ft,ce.setIndex(ne)),X.isMesh)Q.wireframe===!0?(Rt.setLineWidth(Q.wireframeLinewidth*Kt()),ce.setMode(G.LINES)):ce.setMode(G.TRIANGLES);else if(X.isLine){let Nt=Q.linewidth;Nt===void 0&&(Nt=1),Rt.setLineWidth(Nt*Kt()),X.isLineSegments?ce.setMode(G.LINES):X.isLineLoop?ce.setMode(G.LINE_LOOP):ce.setMode(G.LINE_STRIP)}else X.isPoints?ce.setMode(G.POINTS):X.isSprite&&ce.setMode(G.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)ce.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))ce.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Nt=X._multiDrawStarts,Ye=X._multiDrawCounts,le=X._multiDrawCount,O=Zt?rt.get(Zt).bytesPerElement:1,lt=Tt.get(Q).currentProgram.getUniforms();for(let mt=0;mt<le;mt++)lt.setValue(G,"_gl_DrawID",mt),ce.render(Nt[mt]/O,Ye[mt])}else if(X.isInstancedMesh)ce.renderInstances(he,_t,X.count);else if(et.isInstancedBufferGeometry){const Nt=et._maxInstanceCount!==void 0?et._maxInstanceCount:1/0,Ye=Math.min(et.instanceCount,Nt);ce.renderInstances(he,_t,Ye)}else ce.render(he,_t)};function se(A,V,et){A.transparent===!0&&A.side===Ne&&A.forceSinglePass===!1?(A.side=pn,A.needsUpdate=!0,ee(A,V,et),A.side=Mi,A.needsUpdate=!0,ee(A,V,et),A.side=Ne):ee(A,V,et)}this.compile=function(A,V,et=null){et===null&&(et=A),p=Bt.get(et),p.init(V),v.push(p),et.traverseVisible(function(X){X.isLight&&X.layers.test(V.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),A!==et&&A.traverseVisible(function(X){X.isLight&&X.layers.test(V.layers)&&(p.pushLight(X),X.castShadow&&p.pushShadow(X))}),p.setupLights();const Q=new Set;return A.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Et=X.material;if(Et)if(Array.isArray(Et))for(let Dt=0;Dt<Et.length;Dt++){const Yt=Et[Dt];se(Yt,et,X),Q.add(Yt)}else se(Et,et,X),Q.add(Et)}),v.pop(),p=null,Q},this.compileAsync=function(A,V,et=null){const Q=this.compile(A,V,et);return new Promise(X=>{function Et(){if(Q.forEach(function(Dt){Tt.get(Dt).currentProgram.isReady()&&Q.delete(Dt)}),Q.size===0){X(A);return}setTimeout(Et,10)}qt.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let be=null;function xe(A){be&&be(A)}function Je(){Me.stop()}function Qe(){Me.start()}const Me=new Fu;Me.setAnimationLoop(xe),typeof self<"u"&&Me.setContext(self),this.setAnimationLoop=function(A){be=A,j.setAnimationLoop(A),A===null?Me.stop():Me.start()},j.addEventListener("sessionstart",Je),j.addEventListener("sessionend",Qe),this.render=function(A,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(V),V=j.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,V,T),p=Bt.get(A,v.length),p.init(V),v.push(p),bt.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),K.setFromProjectionMatrix(bt),gt=this.localClippingEnabled,Y=it.init(this.clippingPlanes,gt),m=dt.get(A,x.length),m.init(),x.push(m),j.enabled===!0&&j.isPresenting===!0){const Et=_.xr.getDepthSensingMesh();Et!==null&&Pe(Et,V,-1/0,_.sortObjects)}Pe(A,V,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(W,tt),ft=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,ft&&B.addToRenderList(m,A),this.info.render.frame++,Y===!0&&it.beginShadows();const et=p.state.shadowsArray;xt.render(et,A,V),Y===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,X=m.transmissive;if(p.setupLights(),V.isArrayCamera){const Et=V.cameras;if(X.length>0)for(let Dt=0,Yt=Et.length;Dt<Yt;Dt++){const Zt=Et[Dt];Z(Q,X,A,Zt)}ft&&B.render(A);for(let Dt=0,Yt=Et.length;Dt<Yt;Dt++){const Zt=Et[Dt];De(m,A,Zt,Zt.viewport)}}else X.length>0&&Z(Q,X,A,V),ft&&B.render(A),De(m,A,V);T!==null&&(D.updateMultisampleRenderTarget(T),D.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(_,A,V),$t.resetDefaultState(),b=-1,M=null,v.pop(),v.length>0?(p=v[v.length-1],Y===!0&&it.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Pe(A,V,et,Q){if(A.visible===!1)return;if(A.layers.test(V.layers)){if(A.isGroup)et=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(V);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||K.intersectsSprite(A)){Q&&Ct.setFromMatrixPosition(A.matrixWorld).applyMatrix4(bt);const Dt=nt.update(A),Yt=A.material;Yt.visible&&m.push(A,Dt,Yt,et,Ct.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||K.intersectsObject(A))){const Dt=nt.update(A),Yt=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ct.copy(A.boundingSphere.center)):(Dt.boundingSphere===null&&Dt.computeBoundingSphere(),Ct.copy(Dt.boundingSphere.center)),Ct.applyMatrix4(A.matrixWorld).applyMatrix4(bt)),Array.isArray(Yt)){const Zt=Dt.groups;for(let Vt=0,Xt=Zt.length;Vt<Xt;Vt++){const Ht=Zt[Vt],he=Yt[Ht.materialIndex];he&&he.visible&&m.push(A,Dt,he,et,Ct.z,Ht)}}else Yt.visible&&m.push(A,Dt,Yt,et,Ct.z,null)}}const Et=A.children;for(let Dt=0,Yt=Et.length;Dt<Yt;Dt++)Pe(Et[Dt],V,et,Q)}function De(A,V,et,Q){const X=A.opaque,Et=A.transmissive,Dt=A.transparent;p.setupLightsView(et),Y===!0&&it.setGlobalState(_.clippingPlanes,et),Q&&Rt.viewport(C.copy(Q)),X.length>0&&Pt(X,V,et),Et.length>0&&Pt(Et,V,et),Dt.length>0&&Pt(Dt,V,et),Rt.buffers.depth.setTest(!0),Rt.buffers.depth.setMask(!0),Rt.buffers.color.setMask(!0),Rt.setPolygonOffset(!1)}function Z(A,V,et,Q){if((et.isScene===!0?et.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new Xi(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?fa:oi,minFilter:Bi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ye.workingColorSpace}));const Et=p.state.transmissionRenderTarget[Q.id],Dt=Q.viewport||C;Et.setSize(Dt.z,Dt.w);const Yt=_.getRenderTarget();_.setRenderTarget(Et),_.getClearColor(N),P=_.getClearAlpha(),P<1&&_.setClearColor(16777215,.5),_.clear(),ft&&B.render(et);const Zt=_.toneMapping;_.toneMapping=yi;const Vt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),Y===!0&&it.setGlobalState(_.clippingPlanes,Q),Pt(A,et,Q),D.updateMultisampleRenderTarget(Et),D.updateRenderTargetMipmap(Et),qt.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let Ht=0,he=V.length;Ht<he;Ht++){const St=V[Ht],_t=St.object,ne=St.geometry,ce=St.material,Nt=St.group;if(ce.side===Ne&&_t.layers.test(Q.layers)){const Ye=ce.side;ce.side=pn,ce.needsUpdate=!0,At(_t,et,Q,ne,ce,Nt),ce.side=Ye,ce.needsUpdate=!0,Xt=!0}}Xt===!0&&(D.updateMultisampleRenderTarget(Et),D.updateRenderTargetMipmap(Et))}_.setRenderTarget(Yt),_.setClearColor(N,P),Vt!==void 0&&(Q.viewport=Vt),_.toneMapping=Zt}function Pt(A,V,et){const Q=V.isScene===!0?V.overrideMaterial:null;for(let X=0,Et=A.length;X<Et;X++){const Dt=A[X],Yt=Dt.object,Zt=Dt.geometry,Vt=Q===null?Dt.material:Q,Xt=Dt.group;Yt.layers.test(et.layers)&&At(Yt,V,et,Zt,Vt,Xt)}}function At(A,V,et,Q,X,Et){A.onBeforeRender(_,V,et,Q,X,Et),A.modelViewMatrix.multiplyMatrices(et.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),X.onBeforeRender(_,V,et,Q,A,Et),X.transparent===!0&&X.side===Ne&&X.forceSinglePass===!1?(X.side=pn,X.needsUpdate=!0,_.renderBufferDirect(et,V,Q,X,A,Et),X.side=Mi,X.needsUpdate=!0,_.renderBufferDirect(et,V,Q,X,A,Et),X.side=Ne):_.renderBufferDirect(et,V,Q,X,A,Et),A.onAfterRender(_,V,et,Q,X,Et)}function ee(A,V,et){V.isScene!==!0&&(V=Lt);const Q=Tt.get(A),X=p.state.lights,Et=p.state.shadowsArray,Dt=X.state.version,Yt=kt.getParameters(A,X.state,Et,V,et),Zt=kt.getProgramCacheKey(Yt);let Vt=Q.programs;Q.environment=A.isMeshStandardMaterial?V.environment:null,Q.fog=V.fog,Q.envMap=(A.isMeshStandardMaterial?$:E).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?V.environmentRotation:A.envMapRotation,Vt===void 0&&(A.addEventListener("dispose",Jt),Vt=new Map,Q.programs=Vt);let Xt=Vt.get(Zt);if(Xt!==void 0){if(Q.currentProgram===Xt&&Q.lightsStateVersion===Dt)return de(A,Yt),Xt}else Yt.uniforms=kt.getUniforms(A),A.onBeforeCompile(Yt,_),Xt=kt.acquireProgram(Yt,Zt),Vt.set(Zt,Xt),Q.uniforms=Yt.uniforms;const Ht=Q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ht.clippingPlanes=it.uniform),de(A,Yt),Q.needsLights=He(A),Q.lightsStateVersion=Dt,Q.needsLights&&(Ht.ambientLightColor.value=X.state.ambient,Ht.lightProbe.value=X.state.probe,Ht.directionalLights.value=X.state.directional,Ht.directionalLightShadows.value=X.state.directionalShadow,Ht.spotLights.value=X.state.spot,Ht.spotLightShadows.value=X.state.spotShadow,Ht.rectAreaLights.value=X.state.rectArea,Ht.ltc_1.value=X.state.rectAreaLTC1,Ht.ltc_2.value=X.state.rectAreaLTC2,Ht.pointLights.value=X.state.point,Ht.pointLightShadows.value=X.state.pointShadow,Ht.hemisphereLights.value=X.state.hemi,Ht.directionalShadowMap.value=X.state.directionalShadowMap,Ht.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ht.spotShadowMap.value=X.state.spotShadowMap,Ht.spotLightMatrix.value=X.state.spotLightMatrix,Ht.spotLightMap.value=X.state.spotLightMap,Ht.pointShadowMap.value=X.state.pointShadowMap,Ht.pointShadowMatrix.value=X.state.pointShadowMatrix),Q.currentProgram=Xt,Q.uniformsList=null,Xt}function te(A){if(A.uniformsList===null){const V=A.currentProgram.getUniforms();A.uniformsList=lo.seqWithValue(V.seq,A.uniforms)}return A.uniformsList}function de(A,V){const et=Tt.get(A);et.outputColorSpace=V.outputColorSpace,et.batching=V.batching,et.batchingColor=V.batchingColor,et.instancing=V.instancing,et.instancingColor=V.instancingColor,et.instancingMorph=V.instancingMorph,et.skinning=V.skinning,et.morphTargets=V.morphTargets,et.morphNormals=V.morphNormals,et.morphColors=V.morphColors,et.morphTargetsCount=V.morphTargetsCount,et.numClippingPlanes=V.numClippingPlanes,et.numIntersection=V.numClipIntersection,et.vertexAlphas=V.vertexAlphas,et.vertexTangents=V.vertexTangents,et.toneMapping=V.toneMapping}function re(A,V,et,Q,X){V.isScene!==!0&&(V=Lt),D.resetTextureUnits();const Et=V.fog,Dt=Q.isMeshStandardMaterial?V.environment:null,Yt=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ls,Zt=(Q.isMeshStandardMaterial?$:E).get(Q.envMap||Dt),Vt=Q.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,Xt=!!et.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ht=!!et.morphAttributes.position,he=!!et.morphAttributes.normal,St=!!et.morphAttributes.color;let _t=yi;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(_t=_.toneMapping);const ne=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,ce=ne!==void 0?ne.length:0,Nt=Tt.get(Q),Ye=p.state.lights;if(Y===!0&&(gt===!0||A!==M)){const Se=A===M&&Q.id===b;it.setState(Q,A,Se)}let le=!1;Q.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==Ye.state.version||Nt.outputColorSpace!==Yt||X.isBatchedMesh&&Nt.batching===!1||!X.isBatchedMesh&&Nt.batching===!0||X.isBatchedMesh&&Nt.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Nt.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Nt.instancing===!1||!X.isInstancedMesh&&Nt.instancing===!0||X.isSkinnedMesh&&Nt.skinning===!1||!X.isSkinnedMesh&&Nt.skinning===!0||X.isInstancedMesh&&Nt.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Nt.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Nt.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Nt.instancingMorph===!1&&X.morphTexture!==null||Nt.envMap!==Zt||Q.fog===!0&&Nt.fog!==Et||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==it.numPlanes||Nt.numIntersection!==it.numIntersection)||Nt.vertexAlphas!==Vt||Nt.vertexTangents!==Xt||Nt.morphTargets!==Ht||Nt.morphNormals!==he||Nt.morphColors!==St||Nt.toneMapping!==_t||Nt.morphTargetsCount!==ce)&&(le=!0):(le=!0,Nt.__version=Q.version);let O=Nt.currentProgram;le===!0&&(O=ee(Q,V,X));let lt=!1,mt=!1,Ot=!1;const Ut=O.getUniforms(),Qt=Nt.uniforms;if(Rt.useProgram(O.program)&&(lt=!0,mt=!0,Ot=!0),Q.id!==b&&(b=Q.id,mt=!0),lt||M!==A){Rt.buffers.depth.getReversed()?(J.copy(A.projectionMatrix),Og(J),Bg(J),Ut.setValue(G,"projectionMatrix",J)):Ut.setValue(G,"projectionMatrix",A.projectionMatrix),Ut.setValue(G,"viewMatrix",A.matrixWorldInverse);const _e=Ut.map.cameraPosition;_e!==void 0&&_e.setValue(G,jt.setFromMatrixPosition(A.matrixWorld)),It.logarithmicDepthBuffer&&Ut.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ut.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,mt=!0,Ot=!0)}if(X.isSkinnedMesh){Ut.setOptional(G,X,"bindMatrix"),Ut.setOptional(G,X,"bindMatrixInverse");const Se=X.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),Ut.setValue(G,"boneTexture",Se.boneTexture,D))}X.isBatchedMesh&&(Ut.setOptional(G,X,"batchingTexture"),Ut.setValue(G,"batchingTexture",X._matricesTexture,D),Ut.setOptional(G,X,"batchingIdTexture"),Ut.setValue(G,"batchingIdTexture",X._indirectTexture,D),Ut.setOptional(G,X,"batchingColorTexture"),X._colorsTexture!==null&&Ut.setValue(G,"batchingColorTexture",X._colorsTexture,D));const ve=et.morphAttributes;if((ve.position!==void 0||ve.normal!==void 0||ve.color!==void 0)&&st.update(X,et,O),(mt||Nt.receiveShadow!==X.receiveShadow)&&(Nt.receiveShadow=X.receiveShadow,Ut.setValue(G,"receiveShadow",X.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Qt.envMap.value=Zt,Qt.flipEnvMap.value=Zt.isCubeTexture&&Zt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&V.environment!==null&&(Qt.envMapIntensity.value=V.environmentIntensity),mt&&(Ut.setValue(G,"toneMappingExposure",_.toneMappingExposure),Nt.needsLights&&an(Qt,Ot),Et&&Q.fog===!0&&q.refreshFogUniforms(Qt,Et),q.refreshMaterialUniforms(Qt,Q,I,F,p.state.transmissionRenderTarget[A.id]),lo.upload(G,te(Nt),Qt,D)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(lo.upload(G,te(Nt),Qt,D),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ut.setValue(G,"center",X.center),Ut.setValue(G,"modelViewMatrix",X.modelViewMatrix),Ut.setValue(G,"normalMatrix",X.normalMatrix),Ut.setValue(G,"modelMatrix",X.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Se=Q.uniformsGroups;for(let _e=0,Ie=Se.length;_e<Ie;_e++){const Le=Se[_e];z.update(Le,O),z.bind(Le,O)}}return O}function an(A,V){A.ambientLightColor.needsUpdate=V,A.lightProbe.needsUpdate=V,A.directionalLights.needsUpdate=V,A.directionalLightShadows.needsUpdate=V,A.pointLights.needsUpdate=V,A.pointLightShadows.needsUpdate=V,A.spotLights.needsUpdate=V,A.spotLightShadows.needsUpdate=V,A.rectAreaLights.needsUpdate=V,A.hemisphereLights.needsUpdate=V}function He(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,V,et){Tt.get(A.texture).__webglTexture=V,Tt.get(A.depthTexture).__webglTexture=et;const Q=Tt.get(A);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=et===void 0,Q.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,V){const et=Tt.get(A);et.__webglFramebuffer=V,et.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(A,V=0,et=0){T=A,w=V,S=et;let Q=!0,X=null,Et=!1,Dt=!1;if(A){const Zt=Tt.get(A);if(Zt.__useDefaultFramebuffer!==void 0)Rt.bindFramebuffer(G.FRAMEBUFFER,null),Q=!1;else if(Zt.__webglFramebuffer===void 0)D.setupRenderTarget(A);else if(Zt.__hasExternalTextures)D.rebindTextures(A,Tt.get(A.texture).__webglTexture,Tt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ht=A.depthTexture;if(Zt.__boundDepthTexture!==Ht){if(Ht!==null&&Tt.has(Ht)&&(A.width!==Ht.image.width||A.height!==Ht.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(A)}}const Vt=A.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(Dt=!0);const Xt=Tt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Xt[V])?X=Xt[V][et]:X=Xt[V],Et=!0):A.samples>0&&D.useMultisampledRTT(A)===!1?X=Tt.get(A).__webglMultisampledFramebuffer:Array.isArray(Xt)?X=Xt[et]:X=Xt,C.copy(A.viewport),U.copy(A.scissor),k=A.scissorTest}else C.copy(pt).multiplyScalar(I).floor(),U.copy(ot).multiplyScalar(I).floor(),k=ht;if(Rt.bindFramebuffer(G.FRAMEBUFFER,X)&&Q&&Rt.drawBuffers(A,X),Rt.viewport(C),Rt.scissor(U),Rt.setScissorTest(k),Et){const Zt=Tt.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+V,Zt.__webglTexture,et)}else if(Dt){const Zt=Tt.get(A.texture),Vt=V||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Zt.__webglTexture,et||0,Vt)}b=-1},this.readRenderTargetPixels=function(A,V,et,Q,X,Et,Dt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=Tt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Dt!==void 0&&(Yt=Yt[Dt]),Yt){Rt.bindFramebuffer(G.FRAMEBUFFER,Yt);try{const Zt=A.texture,Vt=Zt.format,Xt=Zt.type;if(!It.textureFormatReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=A.width-Q&&et>=0&&et<=A.height-X&&G.readPixels(V,et,Q,X,Gt.convert(Vt),Gt.convert(Xt),Et)}finally{const Zt=T!==null?Tt.get(T).__webglFramebuffer:null;Rt.bindFramebuffer(G.FRAMEBUFFER,Zt)}}},this.readRenderTargetPixelsAsync=async function(A,V,et,Q,X,Et,Dt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=Tt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Dt!==void 0&&(Yt=Yt[Dt]),Yt){const Zt=A.texture,Vt=Zt.format,Xt=Zt.type;if(!It.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=A.width-Q&&et>=0&&et<=A.height-X){Rt.bindFramebuffer(G.FRAMEBUFFER,Yt);const Ht=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Ht),G.bufferData(G.PIXEL_PACK_BUFFER,Et.byteLength,G.STREAM_READ),G.readPixels(V,et,Q,X,Gt.convert(Vt),Gt.convert(Xt),0);const he=T!==null?Tt.get(T).__webglFramebuffer:null;Rt.bindFramebuffer(G.FRAMEBUFFER,he);const St=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await Ng(G,St,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Ht),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Et),G.deleteBuffer(Ht),G.deleteSync(St),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,V=null,et=0){A.isTexture!==!0&&(Zs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,A=arguments[1]);const Q=Math.pow(2,-et),X=Math.floor(A.image.width*Q),Et=Math.floor(A.image.height*Q),Dt=V!==null?V.x:0,Yt=V!==null?V.y:0;D.setTexture2D(A,0),G.copyTexSubImage2D(G.TEXTURE_2D,et,0,0,Dt,Yt,X,Et),Rt.unbindTexture()},this.copyTextureToTexture=function(A,V,et=null,Q=null,X=0){A.isTexture!==!0&&(Zs("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,A=arguments[1],V=arguments[2],X=arguments[3]||0,et=null);let Et,Dt,Yt,Zt,Vt,Xt,Ht,he,St;const _t=A.isCompressedTexture?A.mipmaps[X]:A.image;et!==null?(Et=et.max.x-et.min.x,Dt=et.max.y-et.min.y,Yt=et.isBox3?et.max.z-et.min.z:1,Zt=et.min.x,Vt=et.min.y,Xt=et.isBox3?et.min.z:0):(Et=_t.width,Dt=_t.height,Yt=_t.depth||1,Zt=0,Vt=0,Xt=0),Q!==null?(Ht=Q.x,he=Q.y,St=Q.z):(Ht=0,he=0,St=0);const ne=Gt.convert(V.format),ce=Gt.convert(V.type);let Nt;V.isData3DTexture?(D.setTexture3D(V,0),Nt=G.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(D.setTexture2DArray(V,0),Nt=G.TEXTURE_2D_ARRAY):(D.setTexture2D(V,0),Nt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,V.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,V.unpackAlignment);const Ye=G.getParameter(G.UNPACK_ROW_LENGTH),le=G.getParameter(G.UNPACK_IMAGE_HEIGHT),O=G.getParameter(G.UNPACK_SKIP_PIXELS),lt=G.getParameter(G.UNPACK_SKIP_ROWS),mt=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,_t.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,_t.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Zt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Vt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,Xt);const Ot=A.isDataArrayTexture||A.isData3DTexture,Ut=V.isDataArrayTexture||V.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const Qt=Tt.get(A),ve=Tt.get(V),Se=Tt.get(Qt.__renderTarget),_e=Tt.get(ve.__renderTarget);Rt.bindFramebuffer(G.READ_FRAMEBUFFER,Se.__webglFramebuffer),Rt.bindFramebuffer(G.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let Ie=0;Ie<Yt;Ie++)Ot&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tt.get(A).__webglTexture,X,Xt+Ie),A.isDepthTexture?(Ut&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Tt.get(V).__webglTexture,X,St+Ie),G.blitFramebuffer(Zt,Vt,Et,Dt,Ht,he,Et,Dt,G.DEPTH_BUFFER_BIT,G.NEAREST)):Ut?G.copyTexSubImage3D(Nt,X,Ht,he,St+Ie,Zt,Vt,Et,Dt):G.copyTexSubImage2D(Nt,X,Ht,he,St+Ie,Zt,Vt,Et,Dt);Rt.bindFramebuffer(G.READ_FRAMEBUFFER,null),Rt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else Ut?A.isDataTexture||A.isData3DTexture?G.texSubImage3D(Nt,X,Ht,he,St,Et,Dt,Yt,ne,ce,_t.data):V.isCompressedArrayTexture?G.compressedTexSubImage3D(Nt,X,Ht,he,St,Et,Dt,Yt,ne,_t.data):G.texSubImage3D(Nt,X,Ht,he,St,Et,Dt,Yt,ne,ce,_t):A.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,X,Ht,he,Et,Dt,ne,ce,_t.data):A.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,X,Ht,he,_t.width,_t.height,ne,_t.data):G.texSubImage2D(G.TEXTURE_2D,X,Ht,he,Et,Dt,ne,ce,_t);G.pixelStorei(G.UNPACK_ROW_LENGTH,Ye),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,le),G.pixelStorei(G.UNPACK_SKIP_PIXELS,O),G.pixelStorei(G.UNPACK_SKIP_ROWS,lt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,mt),X===0&&V.generateMipmaps&&G.generateMipmap(Nt),Rt.unbindTexture()},this.copyTextureToTexture3D=function(A,V,et=null,Q=null,X=0){return A.isTexture!==!0&&(Zs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),et=arguments[0]||null,Q=arguments[1]||null,A=arguments[2],V=arguments[3],X=arguments[4]||0),Zs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,V,et,Q,X)},this.initRenderTarget=function(A){Tt.get(A).__webglFramebuffer===void 0&&D.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?D.setTextureCube(A,0):A.isData3DTexture?D.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?D.setTexture2DArray(A,0):D.setTexture2D(A,0),Rt.unbindTexture()},this.resetState=function(){w=0,S=0,T=null,Rt.reset(),$t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ye._getDrawingBufferColorSpace(t),e.unpackColorSpace=ye._getUnpackColorSpace()}}class jM extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class KM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Bc,this.updateRanges=[],this.version=0,this.uuid=$n()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$n()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$n()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const cn=new H;class wo{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix4(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyNormalMatrix(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.transformDirection(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Fn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Te(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Fn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Fn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Fn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Fn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new sn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new wo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Gc extends $i{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ds;const Xs=new H,us=new H,fs=new H,ps=new Wt,Ws=new Wt,Gu=new ke,Wa=new H,$s=new H,$a=new H,_d=new Wt,Lr=new Wt,yd=new Wt;class Md extends Be{constructor(t=new Gc){if(super(),this.isSprite=!0,this.type="Sprite",ds===void 0){ds=new $e;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new KM(e,5);ds.setIndex([0,1,2,0,2,3]),ds.setAttribute("position",new wo(i,3,0,!1)),ds.setAttribute("uv",new wo(i,2,3,!1))}this.geometry=ds,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),us.setFromMatrixScale(this.matrixWorld),Gu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),fs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&us.multiplyScalar(-fs.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const o=this.center;Ya(Wa.set(-.5,-.5,0),fs,o,us,s,a),Ya($s.set(.5,-.5,0),fs,o,us,s,a),Ya($a.set(.5,.5,0),fs,o,us,s,a),_d.set(0,0),Lr.set(1,0),yd.set(1,1);let r=t.ray.intersectTriangle(Wa,$s,$a,!1,Xs);if(r===null&&(Ya($s.set(-.5,.5,0),fs,o,us,s,a),Lr.set(0,1),r=t.ray.intersectTriangle(Wa,$a,$s,!1,Xs),r===null))return;const l=t.ray.origin.distanceTo(Xs);l<t.near||l>t.far||e.push({distance:l,point:Xs.clone(),uv:Mn.getInterpolation(Xs,Wa,$s,$a,_d,Lr,yd,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ya(n,t,e,i,s,a){ps.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(Ws.x=a*ps.x-s*ps.y,Ws.y=s*ps.x+a*ps.y):Ws.copy(ps),n.copy(t),n.x+=Ws.x,n.y+=Ws.y,n.applyMatrix4(Gu)}class vl extends $i{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Eo=new H,To=new H,Sd=new ke,Ys=new pl,Za=new Fo,Dr=new H,bd=new H;class JM extends Be{constructor(t=new $e,e=new vl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)Eo.fromBufferAttribute(e,s-1),To.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Eo.distanceTo(To);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Za.copy(i.boundingSphere),Za.applyMatrix4(s),Za.radius+=a,t.ray.intersectsSphere(Za)===!1)return;Sd.copy(s).invert(),Ys.copy(t.ray).applyMatrix4(Sd);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=h.getX(y),x=h.getX(y+1),v=qa(this,t,Ys,l,p,x);v&&e.push(v)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(u),p=qa(this,t,Ys,l,y,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=qa(this,t,Ys,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=qa(this,t,Ys,l,g-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function qa(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(Eo.fromBufferAttribute(o,s),To.fromBufferAttribute(o,a),e.distanceSqToSegment(Eo,To,Dr,bd)>i)return;Dr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Dr);if(!(l<t.near||l>t.far))return{distance:l,point:bd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const wd=new H,Ed=new H;class Vu extends JM{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)wd.fromBufferAttribute(e,s),Ed.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+wd.distanceTo(Ed);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Vc extends un{constructor(t,e,i,s,a,o,r,l,c){super(t,e,i,s,a,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Zn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let o;e?o=e:o=t*i[a-1];let r=0,l=a-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=i[s]-o,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(o-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),l=e||(o.isVector2?new Wt:new H);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new H,s=[],a=[],o=[],r=new H,l=new ke;for(let u=0;u<=t;u++){const g=u/t;s[u]=this.getTangentAt(g,new H)}a[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(s[u-1],s[u]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(nn(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(l.makeRotationAxis(r,g))}o[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(nn(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(u=-u);for(let g=1;g<=t;g++)a[g].applyMatrix4(l.makeRotationAxis(s[g],u*g)),o[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class _l extends Zn{constructor(t=0,e=0,i=1,s=1,a=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class QM extends _l{constructor(t,e,i,s,a,o){super(t,e,i,i,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function yl(){let n=0,t=0,e=0,i=0;function s(a,o,r,l){n=a,t=r,e=-3*a+3*o-2*r-l,i=2*a-2*o+r+l}return{initCatmullRom:function(a,o,r,l,c){s(o,r,c*(r-a),c*(l-o))},initNonuniformCatmullRom:function(a,o,r,l,c,h,f){let d=(o-a)/c-(r-a)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,s(o,r,d,u)},calc:function(a){const o=a*a,r=o*a;return n+t*a+e*o+i*r}}}const ja=new H,kr=new yl,Ir=new yl,Fr=new yl;class tS extends Zn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new H){const i=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:l===0&&r===a-1&&(r=a-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%a]:(ja.subVectors(s[0],s[1]).add(s[0]),c=ja);const f=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(ja.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=ja),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),kr.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,g,y,m),Ir.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,g,y,m),Fr.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(kr.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Ir.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),Fr.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(kr.calc(l),Ir.calc(l),Fr.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new H().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Td(n,t,e,i,s){const a=(i-t)*.5,o=(s-e)*.5,r=n*n,l=n*r;return(2*e-2*i+a+o)*l+(-3*e+3*i-2*a-o)*r+a*n+e}function eS(n,t){const e=1-n;return e*e*t}function nS(n,t){return 2*(1-n)*n*t}function iS(n,t){return n*n*t}function Js(n,t,e,i){return eS(n,t)+nS(n,e)+iS(n,i)}function sS(n,t){const e=1-n;return e*e*e*t}function aS(n,t){const e=1-n;return 3*e*e*n*t}function oS(n,t){return 3*(1-n)*n*n*t}function rS(n,t){return n*n*n*t}function Qs(n,t,e,i,s){return sS(n,t)+aS(n,e)+oS(n,i)+rS(n,s)}class Xu extends Zn{constructor(t=new Wt,e=new Wt,i=new Wt,s=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Wt){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Qs(t,s.x,a.x,o.x,r.x),Qs(t,s.y,a.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class cS extends Zn{constructor(t=new H,e=new H,i=new H,s=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new H){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Qs(t,s.x,a.x,o.x,r.x),Qs(t,s.y,a.y,o.y,r.y),Qs(t,s.z,a.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Wu extends Zn{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lS extends Zn{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $u extends Zn{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Js(t,s.x,a.x,o.x),Js(t,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hS extends Zn{constructor(t=new H,e=new H,i=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new H){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Js(t,s.x,a.x,o.x),Js(t,s.y,a.y,o.y),Js(t,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Yu extends Zn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(Td(r,l.x,c.x,h.x,f.x),Td(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Wt().fromArray(s))}return this}}var Ad=Object.freeze({__proto__:null,ArcCurve:QM,CatmullRomCurve3:tS,CubicBezierCurve:Xu,CubicBezierCurve3:cS,EllipseCurve:_l,LineCurve:Wu,LineCurve3:lS,QuadraticBezierCurve:$u,QuadraticBezierCurve3:hS,SplineCurve:Yu});class dS extends Zn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ad[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const o=s[a]-i,r=this.curves[a],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Ad[s.type]().fromJSON(s))}return this}}class Rd extends dS{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Wu(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new $u(this.currentPoint.clone(),new Wt(t,e),new Wt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,o){const r=new Xu(this.currentPoint.clone(),new Wt(t,e),new Wt(i,s),new Wt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Yu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,s,a,o),this}absarc(t,e,i,s,a,o){return this.absellipse(t,e,i,i,s,a,o),this}ellipse(t,e,i,s,a,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,a,o,r,l),this}absellipse(t,e,i,s,a,o,r,l){const c=new _l(t,e,i,s,a,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ml extends $e{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],l=[],c=new H,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(r,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ml(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ra extends $e{constructor(t=1,e=1,i=1,s=32,a=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let g=0;const y=[],m=i/2;let p=0;x(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Ee(f,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(u,2));function x(){const _=new H,R=new H;let w=0;const S=(e-t)/i;for(let T=0;T<=a;T++){const b=[],M=T/a,C=M*(e-t)+t;for(let U=0;U<=s;U++){const k=U/s,N=k*l+r,P=Math.sin(N),L=Math.cos(N);R.x=C*P,R.y=-M*i+m,R.z=C*L,f.push(R.x,R.y,R.z),_.set(P,S,L).normalize(),d.push(_.x,_.y,_.z),u.push(k,1-M),b.push(g++)}y.push(b)}for(let T=0;T<s;T++)for(let b=0;b<a;b++){const M=y[b][T],C=y[b+1][T],U=y[b+1][T+1],k=y[b][T+1];(t>0||b!==0)&&(h.push(M,C,k),w+=3),(e>0||b!==a-1)&&(h.push(C,U,k),w+=3)}c.addGroup(p,w,0),p+=w}function v(_){const R=g,w=new Wt,S=new H;let T=0;const b=_===!0?t:e,M=_===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,m*M,0),d.push(0,M,0),u.push(.5,.5),g++;const C=g;for(let U=0;U<=s;U++){const N=U/s*l+r,P=Math.cos(N),L=Math.sin(N);S.x=b*L,S.y=m*M,S.z=b*P,f.push(S.x,S.y,S.z),d.push(0,M,0),w.x=P*.5+.5,w.y=L*.5*M+.5,u.push(w.x,w.y),g++}for(let U=0;U<s;U++){const k=R+U,N=C+U;_===!0?h.push(N,N+1,k):h.push(N+1,N,k),T+=3}c.addGroup(p,T,_===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ra(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Sl extends ra{constructor(t=1,e=1,i=32,s=1,a=!1,o=0,r=Math.PI*2){super(0,t,e,i,s,a,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Sl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class bl extends $e{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),c(i),h(),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(a.slice(),3)),this.setAttribute("uv",new Ee(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const v=new H,_=new H,R=new H;for(let w=0;w<e.length;w+=3)u(e[w+0],v),u(e[w+1],_),u(e[w+2],R),l(v,_,R,x)}function l(x,v,_,R){const w=R+1,S=[];for(let T=0;T<=w;T++){S[T]=[];const b=x.clone().lerp(_,T/w),M=v.clone().lerp(_,T/w),C=w-T;for(let U=0;U<=C;U++)U===0&&T===w?S[T][U]=b:S[T][U]=b.clone().lerp(M,U/C)}for(let T=0;T<w;T++)for(let b=0;b<2*(w-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(S[T][M+1]),d(S[T+1][M]),d(S[T][M])):(d(S[T][M+1]),d(S[T+1][M+1]),d(S[T+1][M]))}}function c(x){const v=new H;for(let _=0;_<a.length;_+=3)v.x=a[_+0],v.y=a[_+1],v.z=a[_+2],v.normalize().multiplyScalar(x),a[_+0]=v.x,a[_+1]=v.y,a[_+2]=v.z}function h(){const x=new H;for(let v=0;v<a.length;v+=3){x.x=a[v+0],x.y=a[v+1],x.z=a[v+2];const _=m(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(_,1-R)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const v=o[x+0],_=o[x+2],R=o[x+4],w=Math.max(v,_,R),S=Math.min(v,_,R);w>.9&&S<.1&&(v<.2&&(o[x+0]+=1),_<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){a.push(x.x,x.y,x.z)}function u(x,v){const _=x*3;v.x=t[_+0],v.y=t[_+1],v.z=t[_+2]}function g(){const x=new H,v=new H,_=new H,R=new H,w=new Wt,S=new Wt,T=new Wt;for(let b=0,M=0;b<a.length;b+=9,M+=6){x.set(a[b+0],a[b+1],a[b+2]),v.set(a[b+3],a[b+4],a[b+5]),_.set(a[b+6],a[b+7],a[b+8]),w.set(o[M+0],o[M+1]),S.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),R.copy(x).add(v).add(_).divideScalar(3);const C=m(R);y(w,M+0,x,C),y(S,M+2,v,C),y(T,M+4,_,C)}}function y(x,v,_,R){R<0&&x.x===1&&(o[v]=x.x-1),_.x===0&&_.z===0&&(o[v]=R/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bl(t.vertices,t.indices,t.radius,t.details)}}const Ka=new H,Ja=new H,Ur=new H,Qa=new Mn;class uS extends $e{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(Ss*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:y,b:m,c:p}=Qa;if(y.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),Qa.getNormal(Ur),f[0]=`${Math.round(y.x*s)},${Math.round(y.y*s)},${Math.round(y.z*s)}`,f[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const v=(x+1)%3,_=f[x],R=f[v],w=Qa[h[x]],S=Qa[h[v]],T=`${_}_${R}`,b=`${R}_${_}`;b in d&&d[b]?(Ur.dot(d[b].normal)<=a&&(u.push(w.x,w.y,w.z),u.push(S.x,S.y,S.z)),d[b]=null):T in d||(d[T]={index0:c[x],index1:c[v],normal:Ur.clone()})}}for(const g in d)if(d[g]){const{index0:y,index1:m}=d[g];Ka.fromBufferAttribute(r,y),Ja.fromBufferAttribute(r,m),u.push(Ka.x,Ka.y,Ka.z),u.push(Ja.x,Ja.y,Ja.z)}this.setAttribute("position",new Ee(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Zu extends Rd{constructor(t){super(t),this.uuid=$n(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Rd().fromJSON(s))}return this}}const fS={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=qu(n,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,l,c,h,f,d,u;if(i&&(a=vS(n,t,a,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<s;g+=e)f=n[g],d=n[g+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return ca(a,o,e,r,l,u,0),o}};function qu(n,t,e,i,s){let a,o;if(s===CS(n,t,e,i)>0)for(a=t;a<e;a+=i)o=Cd(a,n[a],n[a+1],o);else for(a=e-i;a>=t;a-=i)o=Cd(a,n[a],n[a+1],o);return o&&zo(o,o.next)&&(ha(o),o=o.next),o}function Wi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(zo(e,e.next)||Oe(e.prev,e,e.next)===0)){if(ha(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ca(n,t,e,i,s,a,o){if(!n)return;!o&&a&&bS(n,i,s,a);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,a?mS(n,i,s,a):pS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),ha(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=gS(Wi(n),t,e),ca(n,t,e,i,s,a,2)):o===2&&xS(n,t,e,i,s,a):ca(Wi(n),t,e,i,s,a,1);break}}}function pS(n){const t=n.prev,e=n,i=n.next;if(Oe(t,e,i)>=0)return!1;const s=t.x,a=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=s<a?s<o?s:o:a<o?a:o,f=r<l?r<c?r:c:l<c?l:c,d=s>a?s>o?s:o:a>o?a:o,u=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&vs(s,r,a,l,o,c,g.x,g.y)&&Oe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function mS(n,t,e,i){const s=n.prev,a=n,o=n.next;if(Oe(s,a,o)>=0)return!1;const r=s.x,l=a.x,c=o.x,h=s.y,f=a.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,g=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,m=h>f?h>d?h:d:f>d?f:d,p=Xc(u,g,t,e,i),x=Xc(y,m,t,e,i);let v=n.prevZ,_=n.nextZ;for(;v&&v.z>=p&&_&&_.z<=x;){if(v.x>=u&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&vs(r,h,l,f,c,d,v.x,v.y)&&Oe(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&vs(r,h,l,f,c,d,_.x,_.y)&&Oe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=p;){if(v.x>=u&&v.x<=y&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&vs(r,h,l,f,c,d,v.x,v.y)&&Oe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=x;){if(_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&vs(r,h,l,f,c,d,_.x,_.y)&&Oe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function gS(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!zo(s,a)&&ju(s,i,i.next,a)&&la(s,a)&&la(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),ha(i),ha(i.next),i=n=a),i=i.next}while(i!==n);return Wi(i)}function xS(n,t,e,i,s,a){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&TS(o,r)){let l=Ku(o,r);o=Wi(o,o.next),l=Wi(l,l.next),ca(o,t,e,i,s,a,0),ca(l,t,e,i,s,a,0);return}r=r.next}o=o.next}while(o!==n)}function vS(n,t,e,i){const s=[];let a,o,r,l,c;for(a=0,o=t.length;a<o;a++)r=t[a]*i,l=a<o-1?t[a+1]*i:n.length,c=qu(n,r,l,i,!1),c===c.next&&(c.steiner=!0),s.push(ES(c));for(s.sort(_S),a=0;a<s.length;a++)e=yS(s[a],e);return e}function _S(n,t){return n.x-t.x}function yS(n,t){const e=MS(n,t);if(!e)return t;const i=Ku(e,n);return Wi(i,i.next),Wi(e,e.next)}function MS(n,t){let e=t,i=-1/0,s;const a=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=l&&a!==e.x&&vs(o<c?a:i,o,l,c,o<c?i:a,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(a-e.x),la(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&SS(s,e)))&&(s=e,h=f)),e=e.next;while(e!==r);return s}function SS(n,t){return Oe(n.prev,n,t.prev)<0&&Oe(t.next,n,n.next)<0}function bS(n,t,e,i){let s=n;do s.z===0&&(s.z=Xc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,wS(s)}function wS(n){let t,e,i,s,a,o,r,l,c=1;do{for(e=n,n=null,a=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,c*=2}while(o>1);return n}function Xc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function ES(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function vs(n,t,e,i,s,a,o,r){return(s-o)*(t-r)>=(n-o)*(a-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(i-r)}function TS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!AS(n,t)&&(la(n,t)&&la(t,n)&&RS(n,t)&&(Oe(n.prev,n,t.prev)||Oe(n,t.prev,t))||zo(n,t)&&Oe(n.prev,n,n.next)>0&&Oe(t.prev,t,t.next)>0)}function Oe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function zo(n,t){return n.x===t.x&&n.y===t.y}function ju(n,t,e,i){const s=eo(Oe(n,t,e)),a=eo(Oe(n,t,i)),o=eo(Oe(e,i,n)),r=eo(Oe(e,i,t));return!!(s!==a&&o!==r||s===0&&to(n,e,t)||a===0&&to(n,i,t)||o===0&&to(e,n,i)||r===0&&to(e,t,i))}function to(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function eo(n){return n>0?1:n<0?-1:0}function AS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&ju(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function la(n,t){return Oe(n.prev,n,n.next)<0?Oe(n,t,n.next)>=0&&Oe(n,n.prev,t)>=0:Oe(n,t,n.prev)<0||Oe(n,n.next,t)<0}function RS(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Ku(n,t){const e=new Wc(n.i,n.x,n.y),i=new Wc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function Cd(n,t,e,i){const s=new Wc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function ha(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Wc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function CS(n,t,e,i){let s=0;for(let a=t,o=e-i;a<e;a+=i)s+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return s}class ta{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return ta.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];Pd(t),Ld(i,t);let o=t.length;e.forEach(Pd);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Ld(i,e[l]);const r=fS.triangulate(i,s);for(let l=0;l<r.length;l+=3)a.push(r.slice(l,l+3));return a}}function Pd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Ld(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class wl extends bl{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new wl(t.radius,t.detail)}}class da extends $e{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/s,u=new H,g=new Wt;for(let y=0;y<=s;y++){for(let m=0;m<=i;m++){const p=a+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let y=0;y<s;y++){const m=y*(i+1);for(let p=0;p<i;p++){const x=p+m,v=x,_=x+i+1,R=x+i+2,w=x+1;r.push(v,_,w),r.push(_,R,w)}}this.setIndex(r),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new da(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class El extends $e{constructor(t=new Zu([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Ee(s,3)),this.setAttribute("normal",new Ee(a,3)),this.setAttribute("uv",new Ee(o,2));function c(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;ta.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const x=g[m];ta.isClockWise(x)===!0&&(g[m]=x.reverse())}const y=ta.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const x=g[m];u=u.concat(x)}for(let m=0,p=u.length;m<p;m++){const x=u[m];s.push(x.x,x.y,0),a.push(0,0,1),o.push(x.x,x.y)}for(let m=0,p=y.length;m<p;m++){const x=y[m],v=x[0]+f,_=x[1]+f,R=x[2]+f;i.push(v,_,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return PS(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}return new El(i,t.curveSegments)}}function PS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class No extends $e{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],l=[],c=[],h=new H,f=new H,d=new H;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){const y=g/s*a,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(y),f.y=(t+e*Math.cos(m))*Math.sin(y),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){const y=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,x=(s+1)*u+g;o.push(y,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Ee(r,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new No(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ua extends $i{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wu,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ju extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class LS extends Ju{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ie(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const zr=new ke,Dd=new H,kd=new H;class DS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gl,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new Ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Dd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Dd),kd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(kd),e.updateMatrixWorld(),zr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zr),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class kS extends DS{constructor(){super(new Uu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class IS extends Ju{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new kS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Id=new ke;class FS{constructor(t,e,i=0,s=1/0){this.ray=new pl(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new ml,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Id.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Id),this}intersectObject(t,e=!0,i=[]){return $c(t,this,i,e),i.sort(Fd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)$c(t[s],this,i,e);return i.sort(Fd),i}}function Fd(n,t){return n.distance-t.distance}function $c(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)$c(a[o],t,e,!0)}}class US extends Vu{constructor(t=10,e=10,i=4473924,s=8947848){i=new ie(i),s=new ie(s);const a=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const y=d===a?i:s;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new $e;h.setAttribute("position",new Ee(l,3)),h.setAttribute("color",new Ee(c,3));const f=new vl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:al}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=al);const zS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function NS(n,t,e,i){const s=new Tn(n.fov,i,.1,200),a=new H,o=new H,r=new H;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,g=n.yawDeg*Math.PI/180;r.set(Math.sin(g)*Math.cos(u),Math.sin(u),Math.cos(g)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,g,y,m,p=zS){const x=g+.6;if(!l)a.set(u,x,y),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*m);a.x+=(u-a.x)*R,a.y+=(x-a.y)*R,a.z+=(y-a.z)*R}const v=1-Math.exp(-Math.max(t.smoothing,.001)*m);h.distanceScale+=(p.distanceScale-h.distanceScale)*v,h.offsetX+=(p.offsetX-h.offsetX)*v,h.offsetZ+=(p.offsetZ-h.offsetZ)*v,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*v;const _=1-Math.exp(-Math.max(e.smoothing,.001)*m);h.zoom+=(f-h.zoom)*_,d(),(s.fov!==c||s.fov!==n.fov)&&(s.fov=n.fov,c=n.fov,s.updateProjectionMatrix()),o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},snap(u,g,y){a.set(u,g+.6,y),l=!0,o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new H().setFromMatrixColumn(s.matrixWorld,0),g=new H().setFromMatrixColumn(s.matrixWorld,2).negate(),y=Math.hypot(u.x,u.z)||1,m=Math.hypot(g.x,g.z)||1;return{rightX:u.x/y,rightZ:u.z/y,forwardX:g.x/m,forwardZ:g.z/m}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const Hi=Math.PI*2,An=1e-6;function mn(n,t,e){return n<t?t:n>e?e:n}function Qu(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function OS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function tf(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=OS(n);return i===1?s:e+(s-e)*i}function Ud(n){return(1-Math.sin(n))/2}function Tl(n,t,e){const i=Math.PI/180,s=mn(Number.isFinite(t)?t:100,0,180),a=mn(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const o=Math.cos(s*i),r=Math.cos(a*i);if(n>=o)return 1;const l=mn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Al(n,t){if(!n.grounded||n.speed<An)return Qu();const e=n.speed/Math.max(n.moveSpeed,An),i=Math.max(n.legLength,An),s=n.stride>An?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+An,h=Tl(n.localForward/Math.max(n.speed,An),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,y=s,m=N=>Math.asin(mn(N,-o,o)/i);function p(N,P){const L=tf(N,t.plantLock),F=Ud(N),I=u*d*y*L,W=-m(I),tt=P*g>0?1:-1,pt=1+tt*t.crossStep*.45,ot=g*tt*t.crossStep*y*.4*F,ht=g*f*y*t.sideWeight*pt*L+ot*f,K=m(ht),Y=t.kneeLift*F*a*(.55+.25*d+(tt>0?.2*f:0));return{pitchX:W,rollZ:K,kneeX:Y}}const x=(n.phase%Hi+Hi)%Hi,v=p(x,-1),_=p((x+Math.PI)%Hi,1),R=Math.cos(x),w=Ud(x),S=-t.comSway*a*R*(.6*d+.8*f)-g*t.comSway*a*f*.45,T=t.comBob*w*a,b=g*t.hipLean*a*f*R*.6,M=g*t.hipLean*a*f*(.45+.25*R),C=t.armSwing*a*R*(d*u+.3*f),U=C,k=-C;return{legL:v,legR:_,pelvisX:S,pelvisY:T,pelvisRoll:b,sideLean:M,armL:U,armR:k,strafe:f,backward:u<0?d:0}}function ef(n){const t=(n%Hi+Hi)%Hi,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function nf(n,t,e){const i=mn(e.progress,0,1);if(i>=1||n.speed<An)return Qu();const s=i*i*(3-2*i),a=1-s;return Al({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function sf(n,t,e,i){const s=mn(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return mn(o*s,-1,1)*(e*Math.PI/180)}function af(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const r=(a-Math.sign(a)*180)*Math.PI/180,l=mn(i,0,1),c=l*l;return e*c+r*(1-c)}function of(n,t,e,i,s){const a=Math.max(e,An),o=Math.max(0,i)*a,r=Math.max(0,s)*a,l=t>An?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>An&&n<=o&&c,resume:!d}}function rf(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return mn(n*mn(t,0,2),-i,i)}function cf(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function lf(n,t,e){const i=mn(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function BS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=mn(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function hf(n,t,e,i,s){const a=mn(n,0,1),o=mn(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),l=r*r*(3-2*r),c=a<=o?l:1-l,h=Math.hypot(e,i),f=h>An?e/h:1,d=h>An?i/h:0,u=tf(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*c,trailPitch:Math.max(0,s.stopTrailPitch)*c,leadKnee:Math.max(0,s.stopStepKnee)*c,bodyShift:Math.max(0,s.stopBodyShift)*c,bodyDip:Math.max(0,s.stopBodyDip)*c,chestPitch:Math.max(0,s.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function dn(n){return n<0?0:n>1?1:n}const ho=Math.PI*2;function HS(n){return((n+Math.PI)%ho+ho)%ho-Math.PI}function GS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function VS(n,t,e,i,s,a=n.phase){const o=dn(i);if(o<=0)return n;const r=dn(t),l=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=dn(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,g=r<=.5?r*2:(r-.5)*2,y=g*g*(3-2*g),m=r<=.5?y:1-y,p={speed:c,phase:a+ho*l/2*m,localForward:c*f,localRight:c*(1-f)*h},x=HS(p.phase-n.phase),v=o*o*(3-2*o),_=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*v,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:_+(u-_)*o*o}}function XS(n,t,e){const i=GS(),s=dn(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function df(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function zd(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*df(a,s)}function WS(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function $S(n,t,e){const i=dn(n);return{gaitScale:1-i*(1-dn(t)),attackLegWeight:dn(e)*i}}function YS(n,t){const e=dn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function ZS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return dn(t.minScale+(1-t.minScale)*e)}function qS(){return uf()}function uf(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function jS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function KS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?dn(t.forceHitHeight):n.type==="light"?dn(t.hitHeight.light):n.type==="heavy"?dn(t.hitHeight.heavy):n.type==="knock"?dn(t.hitHeight.knock):0}function JS(n,t,e){const i=dn(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function ff(n,t,e){const i=uf(),s=jS(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=dn(1-n.timer/n.duration),o=df(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=KS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*a);return i.upperPitch=s*y*f,i.upperRoll=-s*y*d*.7,i.drop=(s>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=s*o,g=JS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function pf(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const Li=1e-6;function ea(n,t,e){return n<t?t:n>e?e:n}function mf(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Li||a<=Li||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,l=Math.abs(s-a)+Li,c=Math.hypot(n.x,n.y,n.z);if(c<=Li)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=ea(u,l,r),y=u>r+Li||u<l-Li,m=Math.atan2(-d,Math.max(f,Li)),p=ea((s*s+g*g-a*a)/(2*s*g),-1,1),x=ea((a*a+g*g-s*s)/(2*a*g),-1,1),v=Math.acos(p),_=Math.acos(x),R=i>=0?1:-1;return{rootPitch:m-R*v,rootRoll:h,jointPitch:R*(v+_),clamped:y,reach:c/r}}function gf(n,t,e,i){const s=ea(e,0,1),a=Math.max(0,i),o=(r,l)=>{const c=ea((l-r)*s,-a,a);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function xf(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Rl={active:!1,weight:0,clamped:0,maxError:0};function vf(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...Rl};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=s.map(u=>u.tip.getWorldPosition(new H));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const g=s[u],y=i.worldToLocal(l[u].clone()),m={x:y.x-g.root.position.x,y:y.y-g.root.position.y,z:y.z-g.root.position.z},p=mf(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=gf({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const g=s[u].tip.getWorldPosition(new H);d=Math.max(d,g.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function _n(n,t,e){return n<t?t:n>e?e:n}function QS(n,t,e,i,s,a,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ce,d=new Ce;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ce;u.name="lower";const g=new Ce;g.name="upper",d.add(u),d.add(g);const y=[],m=(q,dt,Bt,it)=>{const xt=new ua({color:it}),B=new ge(new Nn(q,dt,Bt),xt);return B.castShadow=!0,B.receiveShadow=!0,y.push(xt),B},p=n.headSize,x=n.legLength,v=n.armLength,_=n.limbThickness,R=n.bodyHeight,w=n.bodyWidth,S=m(w,R,.28,e);S.position.y=R/2,g.add(S);const T=new Ce;T.name="headPivot",T.rotation.order="YXZ",T.position.y=R,g.add(T);const b=m(p,p,p,e);b.position.y=p/2,T.add(b);for(const q of[-1,1]){const dt=m(.06,.07,.02,t.shoe);dt.position.set(q*.09,p/2+.03,p/2+.011),T.add(dt)}const M=(q,dt)=>{const Bt=dt?v:x,it=new Ce;it.name=dt?q<0?"shoulderL":"shoulderR":q<0?"hipL":"hipR",dt||(it.rotation.order="ZYX"),it.position.set(q*(dt?w/2+_/2:w/2-_/2),dt?R-.04:0,0),(dt?g:u).add(it);const xt=m(_,Bt/2,_,t.limb);xt.position.y=-Bt/4,it.add(xt);const B=new Ce;B.name=dt?"elbow":"knee",B.position.y=-Bt/2,it.add(B);const st=m(_,Bt/2,_,t.limb);if(st.position.y=-Bt/4,B.add(st),!dt){const ut=m(_*1.15,.07,_*1.7,t.shoe);ut.position.set(0,-Bt/2+.035,.045),B.add(ut);const Ft=new Be;return Ft.name="footTip",Ft.position.y=-Bt/2,B.add(Ft),{root:it,joint:B,tip:Ft}}return{root:it,joint:B}},C=M(-1,!1),U=M(1,!1),k=M(-1,!0),N=M(1,!0),P=[C,U].map(q=>({root:q.root,joint:q.joint,tip:q.tip,upperLen:x/2,lowerLen:x/2,bend:1})),L=new qe({color:s.attackArcColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),F=new ge(new No(.62,.042,6,20,Math.PI*1.1),L);F.position.set(0,.78-x,.56),g.add(F);const I=new ie(e),W=new ie(r.flashColor),tt=new ie;let pt=null,ot=0,ht=0,K=0,Y=0,gt=0,J=0,bt=0,jt={...Rl},Ct=-1,Lt=0,ft=0,Kt=0,G=0,fe=0,qt=0,It=0,Rt=1,yt=0,Tt=0,D="none",E=0,$=!1,rt=-1,ct=!1,nt=0,kt=0;return{group:f,boneAtWorld(q,dt,Bt){const it=[{node:g,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:N.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:N.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],xt=new H,B=new H,st=new H(q,dt,Bt),ut=new H;let Ft=null,Gt=Number.POSITIVE_INFINITY;for(const $t of it){$t.node.updateWorldMatrix(!0,!1),xt.set($t.ax,$t.ay,$t.az),B.set($t.bx,$t.by,$t.bz),$t.node.localToWorld(xt),$t.node.localToWorld(B);const z=B.x-xt.x,vt=B.y-xt.y,j=B.z-xt.z,at=z*z+vt*vt+j*j;let wt=at>1e-8?((st.x-xt.x)*z+(st.y-xt.y)*vt+(st.z-xt.z)*j)/at:0;wt=Math.max(0,Math.min(1,wt));const Mt=xt.x+z*wt,Jt=xt.y+vt*wt,ae=xt.z+j*wt,oe=(st.x-Mt)**2+(st.y-Jt)**2+(st.z-ae)**2;oe<Gt&&(Gt=oe,Ft=$t.node,ut.set(Mt,Jt,ae))}return Ft?{node:Ft,point:ut.clone()}:null},update(q,dt){f.position.set(q.position.x,q.position.y,q.position.z),f.rotation.y=q.bodyYaw,T.rotation.y=(q.headYaw-q.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,q.mode!==pt&&(pt=q.mode,ot=1),ot=Math.max(0,ot-dt*2.2);const Bt=q.hurt,it=ff(Bt,q.bodyYaw,r),xt=it.flash;tt.copy(W).multiplyScalar(xt);for(const Vt of y)Vt.emissive.copy(I).multiplyScalar(ot*.5),xt>0&&Vt.emissive.add(tt);d.position.set(0,x,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const B=Math.hypot(q.velocity.x,q.velocity.z),st=_n(o.knockGaitScale??0,0,1),ut=q.hurt.knockX*st,Ft=q.hurt.knockZ*st,Gt=st>0&&Math.hypot(q.hurt.knockX,q.hurt.knockZ)>.001,$t=q.velocity.x+ut,z=q.velocity.z+Ft,vt=Math.hypot($t,z),j=Math.cos(q.bodyYaw),at=-Math.sin(q.bodyYaw),wt=B>1e-6?_n((q.velocity.x*j+q.velocity.z*at)/B,-1,1):0,Mt=B>1e-6?_n((q.velocity.x*Math.sin(q.bodyYaw)+q.velocity.z*Math.cos(q.bodyYaw))/B,-1,1):1,Jt=Tl(Mt,o.backStrafeStartDeg,o.backStrafeFullDeg);D==="settled"&&ct&&nt>kt*1.02+1e-4&&(D="none");let ae=1;D==="blend"?(ae=lf($?rt:E,o.stopYawBlendMode,$),$||(E=Math.min(1,E+dt/Math.max(.01,o.stopYawAfterSec)),(E>=1||o.stopYawBlendMode==="inStop"||ct)&&(D="settled",ae=0))):D==="settled"&&(ae=_n(B/Math.max(1e-6,o.stopEnterRatio*a),0,1));const oe=sf(wt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),se=af(Mt,wt,oe,Jt)*ae;yt+=(se-yt)*(1-Math.exp(-12*Math.max(0,dt))),u.rotation.y=yt;const be=q.bodyYaw+yt,xe=Math.sin(be),Je=Math.cos(be),Qe=Math.cos(be),Me=-Math.sin(be),Pe=$t*xe+z*Je,De=$t*Qe+z*Me,Z=Math.max(0,o.stopBlendSec||0),Pt=Z>0&&!Gt,At=of(B,Tt,a,o.stopEnterRatio,o.stopExitRatio);if(!Pt||At.resume)Ct=-1;else if(Ct<0&&At.enter){Ct=0,Lt=q.gaitPhase,ft=ef(q.gaitPhase),Kt=B,G=Math.max(q.stride,1e-6),fe=Pe,qt=De;const Vt=1/Math.max(1e-6,B);It=q.velocity.x*Vt,Rt=q.velocity.z*Vt}const ee=Tt;Tt=B;const te=Pt&&Ct>=0;te&&(Ct=Math.min(1,Ct+dt/Z)),te&&D!=="blend"&&(D="blend",E=0),$=te&&Ct<1,rt=Ct,ct=At.resume,nt=B,kt=ee;const de=te?{phase:Lt,speed:Kt,moveSpeed:a,localForward:fe,localRight:qt,legLength:n.legLength,stride:G,grounded:!0}:{phase:q.gaitPhase,speed:vt,moveSpeed:a,localForward:Pe,localRight:De,legLength:n.legLength,stride:q.stride,grounded:!0},re=te?nf(de,o,{progress:Ct,phase0:Lt,phaseEnd:ft}):Al(de,o);let an=0,He=0,A=0,V=0;if(te){const Vt=cf(q.bodyYaw,It,Rt),Xt=hf(Ct,Lt,Vt.forward,Vt.right,o);Xt.leadLeft?(re.legL.pitchX-=Xt.leadPitch,re.legL.kneeX+=Xt.leadKnee,re.legR.pitchX+=Xt.trailPitch):(re.legR.pitchX-=Xt.leadPitch,re.legR.kneeX+=Xt.leadKnee,re.legL.pitchX+=Xt.trailPitch),He=Xt.bodyShift*Xt.fwdN,an=Xt.bodyShift*Xt.rightN,A=Xt.bodyDip,V=Xt.chestPitch}C.root.rotation.x=re.legL.pitchX,U.root.rotation.x=re.legR.pitchX,C.root.rotation.z=re.legL.rollZ,U.root.rotation.z=re.legR.rollZ,C.joint.rotation.x=re.legL.kneeX,U.joint.rotation.x=re.legR.kneeX,k.root.rotation.x=re.armL,N.root.rotation.x=re.armR,k.joint.rotation.x=-.18,N.joint.rotation.x=-.18,d.position.x=re.pelvisX,d.position.y=x+re.pelvisY,d.position.z=0,d.rotation.z=re.pelvisRoll,g.rotation.z=re.sideLean*(it.intensity>0?.4:1);const et=xf(d,u),Q=te&&h.enabled?{...h,weight:1}:h,X=Q.enabled&&Q.weight>0?_n(Q.weight,0,1):0;if(d.position.x+=an,d.position.z+=He,d.position.y-=A,u.position.y+=A,X<=0&&(u.position.x-=an,u.position.z-=He),l){const Vt=Math.max(.004166666666666667,Math.min(dt,.1)),Xt=Math.sin(q.bodyYaw),Ht=Math.cos(q.bodyYaw),he=_n((q.velocity.x-ht)/Vt,-60,60),St=_n((q.velocity.z-K)/Vt,-60,60),_t=he*Xt+St*Ht,ne=Ge(q.bodyYaw-Y)/Vt,ce=l.maxForwardDeg*Math.PI/180,Nt=l.maxSideDeg*Math.PI/180,Ye=1-Math.exp(-Math.max(0,l.smoothing)*Vt);gt+=(_n(_t*l.accelGain,-ce,ce)-gt)*Ye,J+=(_n(-ne*B*l.turnGain,-Nt,Nt)-J)*Ye;const le=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;bt+=(_n(B/Math.max(a,1e-6),0,1)-bt)*(1-Math.exp(-Math.max(0,le)*Vt));const O=pf({leanForward:gt,leanSide:J,speedRatio:bt},l);g.rotation.x+=gt+V,g.rotation.z+=J,d.rotation.x+=O.pelvisPitch,d.rotation.z+=O.pelvisRoll,d.position.x+=O.pelvisX,d.position.z+=O.pelvisZ,d.position.y-=O.crouch,u.position.y+=O.crouch*(1-X)}ht=q.velocity.x,K=q.velocity.z,Y=q.bodyYaw,g.rotation.x+=it.upperPitch,g.rotation.z+=it.upperRoll,g.rotation.y+=it.upperYaw;const Et=_n(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Dt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=_n(it.upperShiftX*Et,-Dt,Dt),g.position.z+=_n(it.upperShiftZ*Et,-Dt,Dt),d.position.x+=it.comX,d.position.z+=it.comZ-it.pelvisBack,d.position.y-=it.drop;const Yt=it.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=it.pelvisBack*(1-Yt),u.position.y+=it.drop*(1-Yt),C.joint.rotation.x+=it.knee,U.joint.rotation.x+=it.knee,C.root.rotation.x-=it.hip,U.root.rotation.x-=it.hip,k.root.rotation.x+=it.arm,N.root.rotation.x+=it.arm*.8,q.attackPhase!=="idle"&&it.intensity===0){const Vt=q.attackProgress,Xt=Vt<.34?-1:Vt<.68?-1+(Vt-.34)/.34*2:Math.max(0,1-(Vt-.68)/.32),Ht=Math.max(0,-Xt),he=Math.max(0,Xt);N.root.rotation.x=-1.7*Ht+1.25*he,N.joint.rotation.x=-(.25+Ht*.45),g.rotation.y=-.28*Xt,L.opacity=q.attackPhase==="active"?.85:0,q.attackPhase==="active"&&(F.rotation.z=-1.1+Vt*3)}else L.opacity=0;const Zt=rf(yt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=Zt,T.rotation.y=(q.headYaw-q.bodyYaw-Zt+Math.PI*3)%(Math.PI*2)-Math.PI,jt=vf({root:f,pelvis:d,lower:u,limbs:P,base:et,cfg:Q,grounded:!0,attacking:q.attackPhase!=="idle"})},ik(){return jt},dispose(){f.traverse(q=>{if(q instanceof ge){q.geometry.dispose();const dt=q.material;Array.isArray(dt)?dt.forEach(Bt=>Bt.dispose()):dt.dispose()}})}}}const Di=.012,ki=.016;function tb(n,t){const e=t.lab,i=new Ce;i.name="test-lab";const s=[],a=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,v,_,R=Di){const w=l(new qe({color:v,transparent:!0,opacity:_,depthWrite:!1,side:Ne,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),S=new ge(x,w);return S.rotation.x=-Math.PI/2,S.position.y=R,S.renderOrder=2,S}function f(x,v){return c(new da(Math.max(x,.001),v,72))}function d(x,v,_,R=ki){const S=document.createElement("canvas"),T=S.getContext("2d");if(!T)return new ge;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,S.width=Ah.ceilPowerOfTwo(Math.ceil(T.measureText(x).width)+32),S.height=Ah.ceilPowerOfTwo(96*1.4);const M=S.getContext("2d");if(!M)return new ge;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=_,M.fillText(x,S.width/2,S.height/2);const C=new Vc(S);C.colorSpace=hn,a.push(C);const U=S.width/S.height,k=c(new En(v*U,v)),N=l(new qe({map:C,transparent:!0,depthWrite:!1,side:Ne,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),P=new ge(k,N);return P.rotation.x=-Math.PI/2,P.position.y=R,P.renderOrder=3,P}function u(x,v,_,R,w,S){const T=_-v,b=c(new En(T,R)),M=h(b,w,S,Di);M.position.set(T/2+v,Di,0);const C=new Ce;return C.add(M),C.rotation.y=x-Math.PI/2,C}function g(x,v,_,R,w){const S=new Zu;S.moveTo(0,v*.5),S.lineTo(-_*.5,v*.5-_*.9),S.lineTo(-_*.18,v*.5-_*.9),S.lineTo(-_*.18,-v*.5),S.lineTo(_*.18,-v*.5),S.lineTo(_*.18,v*.5-_*.9),S.lineTo(_*.5,v*.5-_*.9),S.closePath();const T=c(new El(S)),b=h(T,R,w,Di+.002),M=new Ce;return M.add(b),M.rotation.y=x+Math.PI,M}function y(x){var T;const v=new Ce,_=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),w=((T=_.geometry.parameters)==null?void 0:T.width)??3;v.add(_);const S=h(c(new En(w*.98,.08)),x.color,.7,ki);return S.position.set(0,ki,t.lab.labelTextHeight*.66),v.add(S),v.position.set(x.labelX,0,x.labelZ),v}const m=new Ce;for(const x of n??[]){const v=new Ce;if(v.position.set(x.x,0,x.z),x.shape==="square"){const _=x.radius,R=h(c(new En(_*2,_*2)),x.color,e.padOpacity*.09);v.add(R);const w=.07,S=[[0,_,_*2+w,w],[0,-_,_*2+w,w],[-_,0,w,_*2+w],[_,0,w,_*2+w]];for(const[T,b,M,C]of S){const U=h(c(new En(M,C)),x.color,e.padOpacity);U.position.x=T,U.position.z=b,v.add(U)}}else v.add(h(c(new Ml(x.radius,72)),x.color,e.padOpacity*.075)),v.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let _=0;_<4;_++){const R=_*Math.PI/4,w=_%2===0;for(const S of[0,Math.PI])v.add(u(R+S,x.radius*.12,x.radius*.94,w?.09:.055,x.color,w?.5:.32))}v.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const _=x.spawnZ-x.z,R=-x.radius+.5,w=_-R,S=h(c(new En(.06,w)),x.color,.36);S.position.set(0,Di,(_+R)/2),v.add(S);let T=0;for(let M=_;M>=R-.01;M-=1,T++){const C=T%5===0,U=h(c(new En(C?2.4:1.3,C?.1:.07)),x.color,C?.72:.42);U.position.set(0,Di,M),v.add(U);const k=d(String(T),.52,C?"#eaf4ff":"rgba(200,225,245,0.8)");k.position.set(1.6,ki,M),v.add(k)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,C]of b){const U=_-M,k=h(c(new En(1.9,.09)),"#ffffff",.5);k.position.set(-1.5,Di,U),v.add(k);const N=d(C,.42,"rgba(220, 236, 250, 0.86)");N.position.set(-3,ki,U),v.add(N)}}else if(x.id==="gait"){v.add(h(f(1.44,1.5),x.color,.5)),v.add(h(f(1.14,1.2),x.color,.22));const _=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[w,S,T]of R){const M=Math.sin(w),C=Math.cos(w),U=g(w,1.7,.34,T,.75);U.position.set(M*1.7*.5,0,_+C*1.7*.5),v.add(U);const k=d(S,.44,T);k.position.set(M*(1.7+.7),ki,_+C*(1.7+.7)),v.add(k)}}if(m.add(v),e.showLabels){const _=y(x);s.push(_),m.add(_)}}i.add(m);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[v,_,R]of x){const w=d(R,.4,"rgba(190, 224, 248, 0.8)");w.position.set(p.x+v*(p.radius+.7),ki,p.z+_*(p.radius+.7)),i.add(w),s.push(w)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const v of s)v.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of a)x.dispose();i.clear()}}}const Cl=64,_f=[0,.24,.76,1],eb=[0,1,1,0],yf=[0,.12,.28,.5,.72,.88,1],nb=[0,.16,.5,1,.5,.16,0];function Nd(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Pl(n,t,e,i,s=Cl,a="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=a==="glow"?yf:_f,c=a==="glow"?nb:eb,h=l.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/s,x=(p-.5)*e,v=Nd(p,i)*Nd(1-p,i),_=Math.sin(x),R=Math.cos(x);for(let w=0;w<h;w++){const S=o+(r-o)*l[w],T=m*h+w;d[T*3]=_*S,d[T*3+1]=0,d[T*3+2]=R*S;const b=v*c[w];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let m=0;m<s;m++)for(let p=0;p<h-1;p++){const x=m*h+p,v=x+h;g.push(x,v,x+1,x+1,v,v+1)}const y=new $e;return y.setAttribute("position",new sn(d,3)),y.setAttribute("color",new sn(u,4)),y.setIndex(g),y.computeBoundingSphere(),y}function Nr(n){const t=new qe({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=Pl(n.radius,n.thickness*f,h,n.edgeFade,Cl,n.profile??"band");if(e.set(d,g),e.size>64){for(const[y,m]of e)if(y!==d&&m!==i){m.dispose(),e.delete(y);break}}return g};i=s(n.arcRad,1);const a=new ge(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:a,update(l,c,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=s(l,g),a.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Od(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function ib(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=s.selectedArcDeg*Math.PI/180,h=a+(c-a)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:g,level:r}}function sb(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function ab(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),o=new Float32Array(i*s*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const g=u/e,y=t+(1-t)*g,m=c*s+u;a[m*3]=f*y,a[m*3+1]=0,a[m*3+2]=d*y;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*s+h,d=f+s;r.push(f,d,f+1,f+1,d,d+1)}const l=new $e;return l.setAttribute("position",new sn(a,3)),l.setAttribute("color",new sn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Bd(n){const t=n.segments??Cl,e=n.profile??"band",s=((e==="glow"?yf.length:_f.length)-1)*6,a=Pl(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),r=new ge(a,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,a.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const g=Math.min(1,Math.max(0,c)),y=Math.round(g*t),m=g>.001?Math.max(1,y)*s:0;m!==a.drawRange.count&&a.setDrawRange(0,m),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){a.dispose(),o.dispose()}}}function Hd(n){const t=new Ce,e=ab(48),i=new qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),s=new ge(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),o=Pl(1-a*.5,a,Math.PI*2,0,64,"band"),r=new qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ne,vertexColors:!0,toneMapped:!1}),l=new ge(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,g){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),s.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(g*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Gd(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function ob(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function rb(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function cb(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function lb(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function hb(n,t,e){return n?t:e}function Mf(n){return{x:0,y:0,z:1}}function db(n){return Math.asin(Mf().y)}function ub(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const Yc={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},fb=1e-6;function yn(n,t,e){return n<t?t:n>e?e:n}function Or(n,t){const e=Math.max(.2,n);return yn(Math.pow(e,-t),.5,2)}function pb(n,t){if(!t.enabled)return{...Yc};const e=yn(n.swing,-1,1),i=yn(n.charge,0,1),s=yn(n.impact,0,1),a=yn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=yn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const g=1-yn(t.impactSquash,0,.6)*s;u*=g;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*a:1)*(1-yn(t.impactSquash,0,.6)*s*.6),x=yn(t.torsoGain,0,1),v=1+(u-1)*x;return u=yn(u,.6,1.6),{arm:u,leg:yn(p,.6,1.4),torso:yn(v,.7,1.4),girthArm:Or(u,t.volumeExp),girthLeg:Or(p,t.volumeExp),girthTorso:Or(v,t.volumeExp)}}function mb(n,t,e,i){const s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),a=(o,r)=>o+(r-o)*s;return{arm:a(n.arm,t.arm),leg:a(n.leg,t.leg),torso:a(n.torso,t.torso),girthArm:a(n.girthArm,t.girthArm),girthLeg:a(n.girthLeg,t.girthLeg),girthTorso:a(n.girthTorso,t.girthTorso)}}function gb(n,t,e){const i=n*Math.exp(-Math.max(fb,e)*Math.max(0,t));return i<.001?0:yn(i,0,1)}const xb=[{kind:"right-left",wind:{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48},hit:{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14}},{kind:"left-right",wind:{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5},hit:{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13}},{kind:"overhead",wind:{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55},hit:{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1}}],no=.72;function Ao(n,t,e){return n<t?t:n>e?e:n}function Ue(n,t,e){return n+(t-n)*e}function vb(n,t,e,i){var u;const s=(((Math.round(t)||1)-1)%3+3)%3,a=xb[s],r=Ao(((u=i.weaponScale)==null?void 0:u[n])??1,0,2)*(Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1),l=Ao((e+1)/2,0,1),c=a.wind,h=a.hit,f={yaw:Ue(c.yaw,h.yaw,l)*r,pitch:Ue(c.pitch,h.pitch,l)*r,roll:Ue(c.roll,h.roll,l)*r,pelvisZ:Ue(c.pz,h.pz,l)*r,pelvisX:Ue(c.px,h.px,l)*r,armR:null,armL:null,mountPitch:a.kind==="overhead"?Ue(2.45,1.5,l):null,kind:a.kind,strike:l};if(n==="greatsword")return f.armR={pitch:Ue(c.ap,h.ap,l),yaw:Ue(c.ay,h.ay,l),roll:Ue(c.ar,h.ar,l),elbow:Ue(c.el,h.el,l)},f.armL={...f.armR,yaw:f.armR.yaw*.8,roll:.4,pitch:f.armR.pitch+.08},f;const d={pitch:Ue(c.ap,h.ap,l)*no,yaw:Ue(c.ay,h.ay,l)*no,roll:Ue(c.ar,h.ar,l)*no,elbow:Ue(c.el,h.el,l)*no};return n==="dual-swords"&&s===1?f.armL={...d,roll:-d.roll}:(f.armR=d,n==="dual-swords"&&(f.armL={...d,yaw:-d.yaw*.6,roll:-d.roll})),f}function _b(n,t,e){const i=Ao(e,0,1),s=(a,o)=>a?o?{pitch:Ue(a.pitch,o.pitch,i),yaw:Ue(a.yaw,o.yaw,i),roll:Ue(a.roll,o.roll,i),elbow:Ue(a.elbow,o.elbow,i)}:null:o;return{yaw:Ue(n.yaw,t.yaw,i),pitch:Ue(n.pitch,t.pitch,i),roll:Ue(n.roll,t.roll,i),pelvisZ:Ue(n.pelvisZ,t.pelvisZ,i),pelvisX:Ue(n.pelvisX,t.pelvisX,i),armR:s(n.armR,t.armR),armL:s(n.armL,t.armL),mountPitch:n.mountPitch===null||t.mountPitch===null?i<.5?n.mountPitch:t.mountPitch:Ue(n.mountPitch,t.mountPitch,i),kind:t.kind,strike:Ue(n.strike,t.strike,i)}}function yb(n){const t=Ao(n,0,1);return t*t*(3-2*t)}function Fe(n,t,e){return n<t?t:n>e?e:n}const fi=1e-6;function ze(n,t,e,i){const s=new ge(new Nn(n,t,e),new ua({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Ze(){return new Ce}function uo(n,t,e){const i=Ze(),s=ze(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=ze(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=ze(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=ze(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=ze(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function Mb(n){const t=uo(.72,.15,n),e=ze(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function Sb(n){const t=Ze(),e=ze(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=ze(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function bb(n){const t=Ze(),e=ze(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=ze(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new ie(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function wb(n){const t=Ze();for(let i=0;i<5;i++){const s=(i-2)*.15,a=ze(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=ze(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Eb(n){const t=Ze(),e=ze(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=ze(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function Tb(n,t,e,i,s,a,o,r,l,c,h){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},g=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=Ze(),m=Ze();m.name="pelvis",m.position.y=n.legLength,y.add(m);const p=Ze();p.name="lower";const x=Ze();x.name="upper",m.add(p),m.add(x);const v=n.headSize,_=n.legLength,R=n.armLength,w=n.limbThickness,S=n.bodyHeight,T=n.bodyWidth,b=ze(T,S,.28,t.body);b.position.y=S/2,x.add(b);const M=Ze();M.name="headPivot",M.rotation.order="YXZ",M.position.y=i.headPivotHeight,x.add(M);const C=ze(v,v,v,t.head);C.position.y=v/2,M.add(C);const U=new ua({color:"#1b2733"});for(const O of[-1,1]){const lt=new ge(new Nn(.06,.07,.02),U);lt.position.set(O*.09,v/2+.03,v/2+.011),M.add(lt)}const k=O=>{const lt=Ze();lt.name=O<0?"hipL":"hipR",lt.rotation.order="ZYX",lt.position.set(O*(T/2-w/2),0,0),p.add(lt);const mt=ze(w,_/2,w,t.limb);mt.position.y=-_/4,lt.add(mt);const Ot=Ze();Ot.name="knee",Ot.position.y=-_/2,lt.add(Ot);const Ut=ze(w,_/2,w,t.limb);Ut.position.y=-_/4,Ot.add(Ut);const Qt=ze(w*1.15,.07,w*1.7,t.shoe);Qt.position.set(0,-_/2+.035,.045),Ot.add(Qt);const ve=new Be;return ve.name="footTip",ve.position.y=-_/2,Ot.add(ve),{root:lt,joint:Ot,hand:Ze(),tip:ve,upperMesh:mt,lowerMesh:Ut,segLen:_/2}},N=O=>{const lt=Ze();lt.name=O<0?"shoulderL":"shoulderR",lt.rotation.order="ZYX",lt.position.set(O*(T/2+w/2),S-.04,0),x.add(lt);const mt=ze(w,R/2,w,t.limb);mt.position.y=-R/4,lt.add(mt);const Ot=Ze();Ot.name="elbow",Ot.position.y=-R/2,lt.add(Ot);const Ut=ze(w,R/2,w,t.limb);Ut.position.y=-R/4,Ot.add(Ut);const Qt=Ze();Qt.name=O<0?"handL":"handR",Qt.position.y=-R/2,Ot.add(Qt);const ve=ze(w*1.1,.09,w*1.1,t.head);return ve.position.y=.045,Qt.add(ve),{root:lt,joint:Ot,hand:Qt,upperMesh:mt,lowerMesh:Ut,segLen:R/2}},P=k(-1),L=k(1),F=N(-1),I=N(1),W=[P,L].map(O=>({root:O.root,joint:O.joint,tip:O.tip,upperLen:_/2,lowerLen:_/2,bend:1})),tt=Ze(),pt=Ze();tt.name="mountR",pt.name="mountL",I.hand.add(tt),F.hand.add(pt);const ot=bb(t),ht=wb(t),K=Eb(t),Y={"sword-shield":{right:uo(.42,.075,t),left:Sb(t)},"dual-swords":{right:uo(.42,.075,t),left:uo(.42,.075,t)},greatsword:{right:Mb(t),left:ze(.12,.2,.12,t.wood)},staff:{right:ot.g,left:Ze(),orb:ot.orb},bow:{right:K,left:ht.g,arrow:K,drawString:ht.drawString}};for(const O of Object.keys(Y))tt.add(Y[O].right),pt.add(Y[O].left),Y[O].right.visible=!1,Y[O].left.visible=!1;function gt(O,lt,mt){const Ot=new Be;Ot.name="bladeBase",Ot.position.y=lt,O.add(Ot);const Ut=new Be;Ut.name="bladeTip",Ut.position.y=mt,O.add(Ut)}gt(Y["sword-shield"].right,.44,.55),gt(Y["dual-swords"].right,.44,.55),gt(Y["dual-swords"].left,.44,.55),gt(Y.greatsword.right,.74,.88),gt(Y.staff.right,.78,.92);let J=null,bt=0,jt=0,Ct=0,Lt=0,ft=0,Kt=0,G=qS(),fe={...Rl},qt=0,It=0,Rt=0,yt=-1,Tt=0,D=0,E=0,$=0,rt=0,ct=0,nt=0,kt=1,q=0,dt=0,Bt=0,it=!1,xt=0,B=0,st=0,ut=0,Ft="none",Gt=0,$t=1,z=!1,vt=-1,j=!1,at=0,wt=0,Mt=0,Jt={...Yc},ae=0,oe=0,se={active:!1,dist:0,gy:0,pitch:0,joint:0},be=null,xe=null,Je=0,Qe=1,Me={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Pe=null,De=0,Z=0,Pt=1,At={speed:0,phase:0},ee={lp:0,lr:0,rp:0,rr:0},te=0,de=0,re=!0,an=0,He="none",A=0,V=0,et=0,Q=.3,X=0;function Et(O){const lt=Math.PI/180,mt=a;let Ot=0,Ut=0,Qt=0,ve=0;O==="sword-shield"?(Ot=mt.swordPitchDeg*lt,Ut=-mt.swordYawDeg*lt,Qt=mt.shieldPitchDeg*lt):O==="dual-swords"?(Ot=mt.swordPitchDeg*lt,Ut=-mt.swordYawDeg*lt,Qt=mt.swordPitchDeg*lt,ve=mt.swordYawDeg*lt):O==="greatsword"?(Ot=mt.greatswordPitchDeg*lt,Ut=-mt.greatswordYawDeg*lt,Qt=mt.greatswordPitchDeg*lt,ve=mt.greatswordYawDeg*lt):O==="staff"?Ot=mt.staffPitchDeg*lt:Qt=mt.bowPitchDeg*lt,tt.rotation.set(Ot,0,Ut),pt.rotation.set(Qt,0,ve),tt.position.x=O==="greatsword"?-Math.max(0,a.twoHandInsetX??0):0}function Dt(O){if(O!==J){J=O;for(const lt of Object.keys(Y))Y[lt].right.visible=lt===O,Y[lt].left.visible=lt===O;Et(O),ht.drawString.position.z=-.06,K.position.z=0,ot.orb.scale.setScalar(1),x.rotation.y=0}}Dt("sword-shield");const Yt=[];y.traverse(O=>{O instanceof ge&&O.material instanceof ua&&Yt.push(O.material)});const Zt=new ie(r.flashColor);function Vt(O,lt){const mt=ff(O,lt,r);G=mt,x.rotation.x+=mt.upperPitch,x.rotation.z+=mt.upperRoll,x.rotation.y+=mt.upperYaw;const Ot=Fe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Ut=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;x.position.x+=Fe(mt.upperShiftX*Ot,-Ut,Ut),x.position.z+=Fe(mt.upperShiftZ*Ot,-Ut,Ut),m.position.x+=mt.comX,m.position.z+=mt.comZ-mt.pelvisBack,m.position.y-=mt.drop;const Qt=mt.legacy?0:Fe(r.lowerScale,0,1);p.position.z+=mt.pelvisBack*(1-Qt),p.position.y+=mt.drop*(1-Qt),P.joint.rotation.x+=mt.knee,L.joint.rotation.x+=mt.knee,P.root.rotation.x-=mt.hip,L.root.rotation.x-=mt.hip,F.root.rotation.x+=mt.arm,I.root.rotation.x+=mt.arm*.8;for(const ve of Yt)ve.emissive.copy(Zt).multiplyScalar(mt.flash)}function Xt(O){return O<.22?-1:O<.5?-1+(O-.22)/.28*2:Math.max(0,1-(O-.5)/.5)}function Ht(O){for(const lt of[F,I])lt.upperMesh.scale.set(O.girthArm,O.arm,O.girthArm),lt.upperMesh.position.y=-lt.segLen/2*O.arm,lt.joint.position.y=-lt.segLen*O.arm,lt.lowerMesh.scale.set(O.girthArm,O.arm,O.girthArm),lt.lowerMesh.position.y=-lt.segLen/2*O.arm,lt.hand.position.y=-lt.segLen*O.arm;for(const lt of[P,L])lt.upperMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),lt.upperMesh.position.y=-lt.segLen/2*O.leg,lt.joint.position.y=-lt.segLen*O.leg,lt.lowerMesh.scale.set(O.girthLeg,O.leg,O.girthLeg),lt.lowerMesh.position.y=-lt.segLen/2*O.leg,lt.tip.position.y=-lt.segLen*O.leg;b.scale.set(O.girthTorso,O.torso,O.girthTorso),b.position.y=S/2*O.torso}function he(O){const lt=a.twoHandGripY??-.16,mt=Math.max(1,a.twoHandMaxStretch??1.25),Ot=R*mt*.99,Ut=F.root.position.x,Qt=F.root.position.y,ve=F.root.position.z;let Se={x:0,y:0,z:0},_e=1/0,Ie=lt;for(let qn=0;qn<5;qn++){const ga=tt.localToWorld(new H(0,Ie,0)),Is=x.worldToLocal(ga.clone());if(Se={x:Is.x-Ut,y:Is.y-Qt,z:Is.z-ve},_e=Math.hypot(Se.x,Se.y,Se.z),!Number.isFinite(_e)||_e<=fi)return;if(_e<=Ot)break;Ie*=.45}const Le=Fe(_e/Math.max(fi,R),1,mt),Xe=R/2*Le,Sn=mf(Se,Xe,Xe,-1),On=gf({rootPitch:F.root.rotation.x,rootRoll:F.root.rotation.z,jointPitch:F.joint.rotation.x},Sn,O,Math.PI);F.root.rotation.x=On.rootPitch,F.root.rotation.z=On.rootRoll,F.joint.rotation.x=Math.min(On.jointPitch,-.06);const bn=1/Math.sqrt(Le);F.upperMesh.scale.set(bn,Le,bn),F.upperMesh.position.y=-Xe/2,F.joint.position.y=-Xe,F.lowerMesh.scale.set(bn,Le,bn),F.lowerMesh.position.y=-Xe/2,F.hand.position.y=-Xe,se={active:!0,dist:_e,gy:Ie,pitch:On.rootPitch,joint:F.joint.rotation.x}}function St(O){Pe=O.mountPitch,x.rotation.y+=O.yaw,x.rotation.x+=O.pitch,x.rotation.z+=O.roll,m.position.z+=O.pelvisZ,m.position.x+=O.pelvisX,O.armR&&(I.root.rotation.x=O.armR.pitch,I.root.rotation.y=O.armR.yaw,I.root.rotation.z=O.armR.roll,I.joint.rotation.x=O.armR.elbow),O.armL&&(F.root.rotation.x=O.armL.pitch,F.root.rotation.y=O.armL.yaw,F.root.rotation.z=O.armL.roll,F.joint.rotation.x=O.armL.elbow)}function _t(O,lt){const mt=vb(O.weapon,O.comboIndex,Xt(O.attackProgress),g);O.comboIndex!==Je&&(xe=be,Qe=0,Je=O.comboIndex);const Ot=Math.max(.008,g.segBlend);Qe=Math.min(1,Qe+lt/Ot);const Ut=xe&&Qe<1?_b(xe,mt,yb(Qe)):mt;return be=Ut,Ut}function ne(O,lt){const mt=T/2+w/2,Ot=S-.04;if(!g.enabled){F.root.position.set(-mt,Ot,0),I.root.position.set(mt,Ot,0),Me={lx:-mt,ly:Ot,lz:0,rx:mt,ry:Ot,rz:0};return}const Ut=Math.max(0,g.shoulderLift),Qt=Math.max(0,g.shoulderPush),ve=O&&lt==="greatsword"?Math.max(0,g.shoulderIn):0,Se=qn=>Ut*Fe((-qn-.5)/1.45,0,1),_e=qn=>Qt*Fe((-qn-.2)/1.9,0,1),Ie=-mt+ve,Le=Ot+Se(F.root.rotation.x),Xe=_e(F.root.rotation.x),Sn=mt-ve,On=Ot+Se(I.root.rotation.x),bn=_e(I.root.rotation.x);F.root.position.set(Ie,Le,Xe),I.root.position.set(Sn,On,bn),Me={lx:Ie,ly:Le,lz:Xe,rx:Sn,ry:On,rz:bn}}function ce(O){if(O.phase==="idle"||O.charging)return;const lt=O.attackProgress,mt=Xt(lt),Ot=Math.max(0,mt),Ut=O.comboIndex%2===0?1:-1,Qt=l.stride,ve=Number.isFinite(Qt.stepReach)?Qt.stepReach:.17,Se=Number.isFinite(Qt.stepSideReach)?Qt.stepSideReach:.14,_e=Number.isFinite(Qt.stepDipReach)?Qt.stepDipReach:.05,Ie=O.weapon==="greatsword"?Fe(Number.isFinite(Qt.heavyScale)?Qt.heavyScale:1,0,1):1;m.position.z+=ve*Ot*Ie,m.position.x+=Ut*Se*Ot*Ie,m.position.y-=_e*Math.sin(Math.PI*lt)*Ie}function Nt(O,lt){if(ht.drawString.position.z=-.06,K.position.z=0,ot.orb.scale.setScalar(1),x.rotation.y=0,O.charging&&O.weapon==="bow"){const Qt=O.charge;F.root.rotation.x=-1.25,F.joint.rotation.x=-.15,I.root.rotation.x=.35+Qt*.3,I.joint.rotation.x=-1.15,ht.drawString.position.z=-.06-Qt*.22,K.position.z=-Qt*.3,x.rotation.y=-.22;return}if(O.phase==="idle"){xe=null,be=null,Je=0,Qe=1,Pe=null,O.weapon==="greatsword"&&(tt.position.x=-Math.max(0,a.twoHandInsetX??0));return}const mt=Xt(O.attackProgress),Ot=Math.max(0,-mt),Ut=Math.max(0,mt);if(O.weapon==="bow")F.root.rotation.x=-1.2,F.joint.rotation.x=-.15,I.root.rotation.x=.9-Ut*.8,I.joint.rotation.x=-.3;else if(O.weapon==="greatsword")if(g.enabled)St(_t(O,lt));else{const Qt=-1.6*Ot+1.25*Ut,ve=Fe(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);I.root.rotation.x=Qt,I.joint.rotation.x=-(.25+Ot*.4),F.root.rotation.x=Qt+.06,F.joint.rotation.x=-(.32+Ot*.4),F.root.rotation.z=.42,I.root.rotation.z=0;const Se=-Math.sin(I.root.rotation.x);I.root.rotation.y=-.72*Math.tanh(Se*4),x.rotation.y=-.2*mt*ve}else if(g.enabled)St(_t(O,lt));else{const Qt=O.comboIndex;if(Qt===1)I.root.rotation.x=-1.7*Ot+1.1*Ut,I.joint.rotation.x=-(.2+Ot*.5),F.root.rotation.x=.1,x.rotation.y=-.18*mt;else if(Qt===2)F.root.rotation.x=-1.5*Ot+1*Ut,F.joint.rotation.x=-(.2+Ot*.5),I.root.rotation.x=.2,x.rotation.y=.45*-mt;else{const ve=-1.9*Ot+1.2*Ut;F.root.rotation.x=ve,I.root.rotation.x=ve,F.joint.rotation.x=-(.15+Ot*.4),I.joint.rotation.x=-(.15+Ot*.4),x.rotation.y=-.3*mt}}if(O.weapon==="greatsword"){const Qt=Fe((-I.root.rotation.x-1.3)/1.2,0,1);tt.position.x=-Math.max(0,a.twoHandInsetX??0)*(1-Qt)}ce(O)}function Ye(O,lt){O&&(I.root.rotation.x=-1.05,I.joint.rotation.x=-.35,F.root.rotation.x=-.45,F.joint.rotation.x=-.2,x.rotation.y=-.12,ot.orb.scale.setScalar(1.25+.12*Math.sin(lt*2)))}function le(O){if(!O||O.phase==="idle")return;const lt=O.progress,mt=lt<.3?-.35+lt/.3*1.35:lt<.7?1:Math.max(0,1-(lt-.7)/.3),Ot=Math.PI/180;x.rotation.x+=d.leanDeg*Ot*mt,F.root.rotation.x-=d.shieldPitchDeg*Ot*mt,F.joint.rotation.x-=.22*mt,I.root.rotation.x-=.3*mt,m.position.z+=d.pelvisReach*Math.max(0,mt)}return{group:y,update(O,lt,mt,Ot,Ut=!1,Qt,ve,Se){Dt(lt.weapon),x.rotation.x=0,x.rotation.z=0,m.position.x=0,m.position.y=_,m.position.z=0,m.rotation.z=0,m.rotation.x=0,x.position.x=0,x.position.y=0,x.position.z=0,p.position.x=0,p.position.y=0,p.position.z=0,p.rotation.z=0;const _e=Math.max(1/240,Math.min(Ot,.1)),Ie=Qt===void 0?te+=Ot:Qt;de=Ie;const Le=l.landing;Le.enabled?re&&!O.grounded?(He="jump",A=Ie,V=Le.anticipationDuration,et=Math.max(0,Le.jumpAnticipation),Q=.32):!re&&O.grounded&&(He="land",A=Ie,V=Le.duration,et=ZS(an,Le),Q=Le.compressRatio,X=an):(He="none",et=0),Ie<A&&(He="none",et=0),re=O.grounded,an=O.velocity.y;const Xe=zd(Ie,A,V,et,Q),Sn=lt.phase!=="idle",On=(Se==null?void 0:Se.phase)==="active";De=WS(De,Sn,_e,l.attack.blendRate);const bn=$S(De,l.attack.gaitWeight,l.attack.lowerBodyWeight);Z=bn.attackLegWeight,Pt=bn.gaitScale;const qn=Math.sin(O.bodyYaw),ga=Math.cos(O.bodyYaw),Is=(O.velocity.x-bt)/_e,Sf=(O.velocity.z-jt)/_e,bf=Fe(Is,-60,60),wf=Fe(Sf,-60,60),Ef=bf*qn+wf*ga,Tf=Ge(O.bodyYaw-Ct)/_e,Af=Math.hypot(O.velocity.x,O.velocity.z),Ll=o.maxForwardDeg*Math.PI/180,Dl=o.maxSideDeg*Math.PI/180,Rf=Fe(Ef*o.accelGain,-Ll,Ll),Cf=Fe(-Tf*Af*o.turnGain,-Dl,Dl),kl=1-Math.exp(-o.smoothing*_e);Lt+=(Rf-Lt)*kl,ft+=(Cf-ft)*kl,bt=O.velocity.x,jt=O.velocity.z,Ct=O.bodyYaw;const Cn=Math.hypot(O.velocity.x,O.velocity.z),Oo=Fe(s.knockGaitScale??0,0,1),Pf=mt.knockX*Oo,Lf=mt.knockZ*Oo,Df=Oo>0&&Math.hypot(mt.knockX,mt.knockZ)>.001,Bo=O.velocity.x+Pf,Ho=O.velocity.z+Lf,Il=Math.hypot(Bo,Ho);ut=Il;const kf=Math.cos(O.bodyYaw),If=-Math.sin(O.bodyYaw),Ff=O.velocity.x*kf+O.velocity.z*If,Fl=Cn>fi?Fe(Ff/Cn,-1,1):0,Ul=Cn>fi?Fe((O.velocity.x*qn+O.velocity.z*ga)/Cn,-1,1):1,Uf=Tl(Ul,s.backStrafeStartDeg,s.backStrafeFullDeg);Ft==="settled"&&j&&at>wt*1.02+1e-4&&(Ft="none");let Fs=1;Ft==="blend"?(Fs=lf(z?vt:Gt,s.stopYawBlendMode,z),z||(Gt=Math.min(1,Gt+_e/Math.max(.01,s.stopYawAfterSec)),(Gt>=1||s.stopYawBlendMode==="inStop"||j)&&(Ft="settled",Fs=0))):Ft==="settled"&&(Fs=Fe(Cn/Math.max(fi,s.stopEnterRatio*e),0,1)),$t=Fs;const zf=sf(Fl,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),Nf=af(Ul,Fl,zf,Uf)*Fs;It+=(Nf-It)*(1-Math.exp(-i.hipYawSmoothing*_e));const Us=O.bodyYaw+It;Rt=Us;const Of=Math.sin(Us),Bf=Math.cos(Us),Hf=Math.cos(Us),Gf=-Math.sin(Us),xa={speed:Il,phase:O.gaitPhase,localForward:Bo*Of+Ho*Bf,localRight:Bo*Hf+Ho*Gf,stride:O.stride};Sn&&!it&&(Bt=O.gaitPhase),it=Sn;const Yi=De>0?VS(xa,lt.attackProgress,lt.comboIndex,De,l.stride,Bt):xa;At=Yi;const zl=Math.max(0,s.stopBlendSec||0),Nl=zl>0&&!Sn&&!Df&&O.grounded,Go=of(Cn,q,e,s.stopEnterRatio,s.stopExitRatio);if(!Nl||Go.resume)yt=-1;else if(yt<0&&Go.enter){yt=0,Tt=O.gaitPhase,D=ef(O.gaitPhase),E=Cn,$=Math.max(O.stride,fi),rt=xa.localForward,ct=xa.localRight;const Ae=1/Math.max(fi,Cn);nt=O.velocity.x*Ae,kt=O.velocity.z*Ae}const Vf=q;q=Cn;const bi=Nl&&yt>=0;bi&&(yt=Math.min(1,yt+_e/zl)),bi&&Ft!=="blend"&&(Ft="blend",Gt=0),z=bi&&yt<1,vt=yt,j=Go.resume,at=Cn,wt=Vf;const Ol=bi?{phase:Tt,speed:E,moveSpeed:e,localForward:rt,localRight:ct,legLength:n.legLength,stride:$,grounded:!0}:{phase:Yi.phase,speed:Yi.speed,moveSpeed:e,localForward:Yi.localForward,localRight:Yi.localRight,legLength:n.legLength,stride:Yi.stride??0,grounded:O.grounded},Xf=bi?nf(Ol,s,{progress:yt,phase0:Tt,phaseEnd:D}):Al(Ol,s),we=YS(Xf,bn.gaitScale);if(Mt=0,On&&Se){const Ae=BS(Se.progress,Se.dir,s),me=bn.gaitScale;we.legL.pitchX+=Ae.legL.pitchX*me,we.legL.rollZ+=Ae.legL.rollZ*me,we.legL.kneeX+=Ae.legL.kneeX*me,we.legR.pitchX+=Ae.legR.pitchX*me,we.legR.rollZ+=Ae.legR.rollZ*me,we.legR.kneeX+=Ae.legR.kneeX*me,we.pelvisY+=Ae.pelvisY*me,Mt=Ae.env}let Vo=0,Xo=0,Wo=0,Bl=0;if(bi){const Ae=cf(O.bodyYaw,nt,kt),me=hf(yt,Tt,Ae.forward,Ae.right,s);me.leadLeft?(we.legL.pitchX-=me.leadPitch,we.legL.kneeX+=me.leadKnee,we.legR.pitchX+=me.trailPitch):(we.legR.pitchX-=me.leadPitch,we.legR.kneeX+=me.leadKnee,we.legL.pitchX+=me.trailPitch),Xo=me.bodyShift*me.fwdN,Vo=me.bodyShift*me.rightN,Wo=me.bodyDip,Bl=me.chestPitch,xt=me.leadPitch,B=me.bodyShift,st=me.bodyDip}else xt=0,B=0,st=0;ee={lp:we.legL.pitchX,lr:we.legL.rollZ,rp:we.legR.pitchX,rr:we.legR.rollZ},O.grounded?(P.root.rotation.x=we.legL.pitchX,L.root.rotation.x=we.legR.pitchX,P.root.rotation.z=we.legL.rollZ,L.root.rotation.z=we.legR.rollZ,P.joint.rotation.x=we.legL.kneeX,L.joint.rotation.x=we.legR.kneeX,F.root.rotation.x=we.armL,I.root.rotation.x=we.armR,F.joint.rotation.x=-(.18+we.armL*.2),I.joint.rotation.x=-(.18+we.armR*.2),F.root.rotation.z=0,I.root.rotation.z=0,F.root.rotation.y=0,I.root.rotation.y=0,m.position.x=we.pelvisX,m.position.y=_+we.pelvisY,m.position.z=0,m.rotation.z=we.pelvisRoll):(P.root.rotation.x=-.55,L.root.rotation.x=-.25,P.joint.rotation.x=.75,L.joint.rotation.x=.55,F.root.rotation.x=-.9,I.root.rotation.x=-.7,F.joint.rotation.x=-.6,I.joint.rotation.x=-.6,P.root.rotation.z=0,L.root.rotation.z=0);const Wf=xf(m,p),zs=On?{...f,weight:0}:bi&&f.enabled?{...f,weight:1}:f,Hl=zs.enabled&&O.grounded&&zs.weight>0?Fe(zs.weight,0,1)*(Sn?Fe(zs.attackScale,0,1):1):0;m.position.x+=Vo,m.position.z+=Xo,m.position.y-=Wo,p.position.y+=Wo,Hl<=0&&(p.position.x-=Vo,p.position.z-=Xo);const Gl=Cn/Math.max(e,fi),$f=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Yf=1-Math.exp(-Math.max(0,$f)*_e);qt+=(Fe(Gl,0,1)-qt)*Yf;const Zi=pf({leanForward:Lt,leanSide:ft,speedRatio:qt},o);m.rotation.x+=Zi.pelvisPitch,m.rotation.z+=Zi.pelvisRoll,m.position.x+=Zi.pelvisX,m.position.z+=Zi.pelvisZ,m.position.y-=Zi.crouch,p.position.y+=Zi.crouch*(1-Fe(Hl,0,1)),Nt(lt,_e),Ye(Ut,O.gaitPhase),le(ve);const Zf=a.greatswordPitchDeg*Math.PI/180,Vl=lt.weapon==="greatsword",Xl=Math.hypot(O.velocity.x,O.velocity.z),qf=Vl&&lt.phase==="idle"&&Xl>.5?Math.min(1.15,Xl/Math.max(e,.001)*.9):0;Kt+=(qf-Kt)*(1-Math.exp(-6*_e)),Vl&&(tt.rotation.x=(Pe??Zf)+Kt),lt.weapon==="bow"&&(ht.g.rotation.x=-(F.root.rotation.x+F.joint.rotation.x),K.rotation.x=-(I.root.rotation.x+I.joint.rotation.x));const jf=x.rotation.y;Vt(mt,O.bodyYaw);const Wl=mt.type==="none"?1:.4;if(x.rotation.x+=Lt*Wl+Bl,x.rotation.z+=(ft+we.sideLean)*Wl,Xe>0&&(P.root.rotation.x-=Le.hipPitch*Xe,L.root.rotation.x-=Le.hipPitch*Xe,P.joint.rotation.x+=Le.kneeBend*Xe,L.joint.rotation.x+=Le.kneeBend*Xe,m.position.y-=Le.crouchDepth*Xe,p.position.y+=Le.crouchDepth*(1-Le.lowerScale)*Xe,x.rotation.x+=Le.upperPitch*Xe,F.root.rotation.x-=Le.armTuck*Xe,I.root.rotation.x-=Le.armTuck*Xe),Z>0&&O.grounded){const Ae=XS(lt.attackProgress,lt.comboIndex,l.stride),me=Z;P.root.rotation.x+=Ae.legL.pitchX*me,L.root.rotation.x+=Ae.legR.pitchX*me,P.root.rotation.z+=Ae.legL.rollZ*me,L.root.rotation.z+=Ae.legR.rollZ*me,P.joint.rotation.x+=Ae.legL.kneeX*me,L.joint.rotation.x+=Ae.legR.kneeX*me,m.position.x+=Ae.pelvisX*me,m.position.y+=Ae.pelvisY*me,m.rotation.z+=Ae.pelvisRoll*me}if(ne(Sn,lt.weapon),u.enabled){const Ae=lt.phase!=="idle"&&!lt.charging,me=Ae?Xt(lt.attackProgress):0;Ae&&oe>.55&&me<oe-1e-4&&(ae=1),oe=me,ae=gb(ae,_e,u.impactDecay);const Jf=pb({swing:me,charge:lt.charging?lt.charge:0,impact:ae,speedRatio:Gl,grounded:O.grounded},u);Jt=mb(Jt,Jf,_e,u.smoothing)}else Jt={...Yc};Ht(Jt),p.rotation.y=It,dt=rf(It,s.chestYawScale,s.chestYawMaxDeg),x.rotation.y+=dt;const Kf=jf;M.rotation.y=Ge(O.headYaw-O.bodyYaw-Kf-dt),M.rotation.x=-Fe(O.headPitch??0,-.7,.7),x.rotation.x+=-Fe(O.bodyPitch??0,-.4,.4),lt.weapon==="greatsword"&&lt.phase!=="idle"&&!lt.charging&&(y.updateWorldMatrix(!0,!0),he(Fe(Math.max(.65,De),0,1))),fe=vf({root:y,pelvis:m,lower:p,limbs:W,base:Wf,cfg:zs,grounded:O.grounded,attacking:Sn})},lean(){return{forward:Lt,side:ft}},landing(){const O=zd(de,A,V,et,Q),lt=V>0?Math.max(0,V-Math.max(0,de-A)):0;return{pulse:O,remaining:lt,kind:O>0?He:"none",impactVy:X}},hurt(){return G},ik(){return fe},stretch(){return{...Jt,impact:ae}},gripDebug(){return{...se}},swingDebug(){const O=be;return{seg:Je,kind:(O==null?void 0:O.kind)??"right-left",yaw:(O==null?void 0:O.yaw)??0,pitch:(O==null?void 0:O.pitch)??0,roll:(O==null?void 0:O.roll)??0,strike:(O==null?void 0:O.strike)??0,shoulderL:{x:Me.lx,y:Me.ly,z:Me.lz},shoulderR:{x:Me.rx,y:Me.ry,z:Me.rz}}},attackBlend(){return De},attackWeights(){return{gaitScale:Pt,attackLegWeight:Z,driveSpeed:At.speed,stridePhase:At.phase}},hipYaw(){return It},gaitDebug(){return{stopT:yt,hipYaw:It,chestYaw:dt,speed:q,gaitSpeed:ut,stopStep:xt,stopShift:B,stopDip:st,stopYawFade:$t,turnStep:Mt,legLPitch:ee.lp,legLRoll:ee.lr,legRPitch:ee.rp,legRRoll:ee.rr}},gaitYaw(){return Rt},arrowDirection(){K.updateWorldMatrix(!0,!1);const O=K.matrixWorld.elements,lt=O[8],mt=O[9],Ot=O[10],Ut=Math.hypot(lt,mt,Ot)||1;return{x:lt/Ut,y:mt/Ut,z:Ot/Ut}},weaponBlade(){if(!J)return null;const O=Y[J].right,lt=O.getObjectByName("bladeBase"),mt=O.getObjectByName("bladeTip");if(!lt||!mt)return null;lt.updateWorldMatrix(!0,!1),mt.updateWorldMatrix(!0,!1);const Ot=lt.getWorldPosition(new H),Ut=mt.getWorldPosition(new H);return{base:{x:Ot.x,y:Ot.y,z:Ot.z},tip:{x:Ut.x,y:Ut.y,z:Ut.z}}},dispose(){y.traverse(O=>{if(O instanceof ge){O.geometry.dispose();const lt=O.material;Array.isArray(lt)?lt.forEach(mt=>mt.dispose()):lt.dispose()}})}}}function Ab(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new $e,i=new Float32Array(t*2*3),s=new Float32Array(t*2*3),a=new sn(i,3),o=new sn(s,3);a.setUsage(wh),o.setUsage(wh),e.setAttribute("position",a),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,_=v+1,R=v+2,w=v+3;r.push(v,_,R,_,w,R)}e.setIndex(r),e.setDrawRange(0,0);const l=new qe({vertexColors:!0,transparent:!0,opacity:1,blending:pi,depthWrite:!1,side:Ne}),c=new ge(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ie(n.color);let f=[],d=null,u=0,g=0,y=!1,m=!1;function p(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let _=0;_<x;_++){const R=f[_],w=Math.max(0,1-R.age/v),S=w*w,T=Math.min(1,R.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*S*(.55+.45*T),M=.18+.82*w,C=_*6;i[C]=R.tx+(R.bx-R.tx)*M,i[C+1]=R.ty+(R.by-R.ty)*M,i[C+2]=R.tz+(R.bz-R.tz)*M,i[C+3]=R.tx,i[C+4]=R.ty,i[C+5]=R.tz;const U=h.r*b,k=h.g*b,N=h.b*b,P=U*.22,L=k*.22,F=N*.22;s[C]=P,s[C+1]=L,s[C+2]=F;const I=1+n.tipBoost;s[C+3]=Math.min(1,U*I),s[C+4]=Math.min(1,k*I),s[C+5]=Math.min(1,N*I)}a.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,_){if(!n.enabled){c.visible=!1;return}const R=Math.max(0,x);for(const w of f)w.age+=R;for(;f.length>0&&f[0].age>n.life;)f.shift();if(v){const w=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,R):0,S=f[f.length-1],T=S?Math.hypot(v.tip.x-S.tx,v.tip.y-S.ty,v.tip.z-S.tz):1/0;if(_&&T>=n.minStep)for(f.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:w});f.length>t;)f.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},u=w,g=T,y=!0}else d=null,y=!1,u=0,g=0;m=_,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:g,hasBlade:y,active:m}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function Rb(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Cb(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),o=new qM({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=uu,o.setSize(s,a,!1),n.appendChild(o.domElement);const r=new jM;r.background=new ie("#12161d"),r.add(new LS(11061486,2764600,1.15));const l=new IS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Ce;for(const Z of t.boxes){const Pt=Z.maxX-Z.minX,At=Z.maxY-Z.minY,ee=Z.maxZ-Z.minZ;let te=Rb(Z.kind,e);Z.kind==="step"&&(te=new ie(te).offsetHSL(0,0,Z.maxY*.09).getStyle());const de=new ua({color:te,transparent:!0,opacity:1}),re=new ge(new Nn(Pt,At,ee),de);re.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),re.castShadow=Z.kind!=="ground",re.receiveShadow=!0,re.add(new Vu(new uS(re.geometry),new vl({color:10467020,transparent:!0,opacity:.32}))),f.add(re),h.push(de)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new US(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const g=tb(i,e);r.add(g.group);const y=Tb(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),m=Ab(e.weaponTrail);r.add(m.object);const p=new Ce,x=.9,v=new Ce;v.position.y=x,y.group.position.y=-x,v.add(y.group),p.add(v),r.add(p);const _=t.dummies.map((Z,Pt)=>{const At=e.dummies.colors,ee=At[Pt%At.length]??"#cccccc",te=QS(e.voxel,e.colors,ee,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return te.group.traverse(de=>{de.userData.dummyId=Z.id}),r.add(te.group),te}),R=_.map(Z=>Z.group),w=new FS,S=e.groundRing,T=e.voxel.bodyWidth,b=Od(T,S.playerRadiusFactor),M=Od(T,S.dummyRadiusFactor),C=T*S.thicknessFactor,U=S.arcDeg*Math.PI/180;let k=0;const N=Nr({radius:b,thickness:C,arcRad:U,edgeFade:S.edgeFade,color:S.playerColor,opacity:S.playerOpacity,y:.028,renderOrder:6});N.mesh.name="player-ground-ring",r.add(N.mesh);const P=t.dummies.map(Z=>{const Pt=Nr({radius:M,thickness:C,arcRad:U,edgeFade:S.edgeFade,color:S.neutralColor,opacity:S.opacity,y:.022,renderOrder:5});return Pt.mesh.name=`dummy-ground-ring-${Z.id}`,r.add(Pt.mesh),Pt}),L=t.dummies.map(Z=>{const Pt=Nr({radius:M*S.haloRadiusFactor,thickness:C*S.haloThicknessFactor,arcRad:U,edgeFade:S.edgeFade,color:S.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Pt.mesh.name=`dummy-ground-halo-${Z.id}`,r.add(Pt.mesh),Pt}),F=t.dummies.map(()=>0),I=t.dummies.map(()=>0),W=Bd({radius:b*S.meterRadiusFactor,thickness:C*S.meterThicknessFactor,arcRad:U,edgeFade:.06,color:S.meterColorCharge,y:.03,renderOrder:8});W.mesh.name="player-ground-meter",r.add(W.mesh);const tt=t.dummies.map(Z=>{const Pt=Bd({radius:M*S.warnRadiusFactor,thickness:C*S.warnThicknessFactor,arcRad:U,edgeFade:.02,color:S.warnColor,y:.031,renderOrder:9});return Pt.mesh.name=`dummy-ground-warn-${Z.id}`,r.add(Pt.mesh),Pt}),pt=Hd({color:S.playerColor,y:.042,renderOrder:3});pt.group.name="player-landing-preview",r.add(pt.group);const ot=new ie,ht=new ie(S.playerColor),K=new ie(S.neutralColor),Y=new ie(S.lowThreatColor),gt=new ie(S.highThreatColor),J=new ie(S.meterColorCharge),bt=new ie(S.meterColorChannel),jt=new ie(S.meterColorCooldown),Ct=new ie(S.warnColor),Lt=new Ce;r.add(Lt);const ft=e.projectiles;function Kt(){const Pt=document.createElement("canvas");Pt.width=64,Pt.height=64;const At=Pt.getContext("2d");if(At){const te=At.createRadialGradient(32,32,0,32,32,32);te.addColorStop(0,"rgba(255,255,255,1)"),te.addColorStop(.28,"rgba(255,255,255,0.72)"),te.addColorStop(.62,"rgba(255,255,255,0.22)"),te.addColorStop(1,"rgba(255,255,255,0)"),At.fillStyle=te,At.fillRect(0,0,64,64)}const ee=new Vc(Pt);return ee.colorSpace=hn,ee}function G(){const At=document.createElement("canvas");At.width=2,At.height=64;const ee=At.getContext("2d");if(ee){const de=ee.createLinearGradient(0,0,0,64);de.addColorStop(0,"rgba(255,255,255,0)"),de.addColorStop(.55,"rgba(255,255,255,0.35)"),de.addColorStop(1,"rgba(255,255,255,0.95)"),ee.fillStyle=de,ee.fillRect(0,0,2,64)}const te=new Vc(At);return te.colorSpace=hn,te}const fe=Kt(),qt=G(),It=new qe({color:12577023,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),Rt=new qe({color:14217983,transparent:!0,opacity:0,side:Ne,depthWrite:!1,blending:pi}),yt=new Ce;yt.position.set(0,.95,.72),Lt.add(yt);const Tt=new Ce;Tt.rotation.x=db(e.camera.pitchDeg),yt.add(Tt);const D=new No(.78,ft.slashThickness,6,28,Math.PI*1.15),E=new Ce,$=new ge(D,It),rt=new ge(D,Rt);rt.scale.setScalar(1.09),rt.renderOrder=4,E.add($,rt),Tt.add(E);const ct=new Nn(ft.arrowWidth,ft.arrowWidth,ft.arrowLength),nt=new Sl(ft.arrowHeadSize*.42,ft.arrowHeadSize,4);nt.rotateX(Math.PI/2);const kt=new Nn(ft.arrowWidth*2.6,ft.arrowWidth*.4,.1),q=new ra(ft.arrowWidth*.45,ft.arrowWidth*1.3,ft.trailLength,6,1,!0);q.rotateX(-Math.PI/2),q.translate(0,0,-ft.trailLength/2);const dt=Array.from({length:10},()=>{const Z=new Ce,Pt=new qe({color:ft.arrowColor,transparent:!0}),At=new qe({color:ft.arrowHeadColor,transparent:!0}),ee=new Gc({map:fe,color:ft.arrowColor,transparent:!0,opacity:.85,blending:pi,depthWrite:!1}),te=new qe({color:ft.arrowTrailColor,map:qt,transparent:!0,opacity:0,blending:pi,depthWrite:!1,side:Ne}),de=new ge(ct,Pt),re=new ge(nt,At);re.position.z=ft.arrowLength/2+ft.arrowHeadSize*.42;const an=new ge(kt,At),He=new ge(kt,At);an.position.z=-ft.arrowLength/2+.08,He.position.z=an.position.z,He.rotation.z=Math.PI/2;const A=new Md(ee);A.scale.setScalar(ft.arrowGlowSize),A.renderOrder=6;const V=new ge(q,te);return V.renderOrder=5,Z.add(de,re,an,He,A,V),Z.visible=!1,r.add(Z),{group:Z,shaftMat:Pt,tipMat:At,glowMat:ee,trailMat:te,glow:A,trail:V,arrowId:0,bone:null}}),Bt=new wl(1,0),it=new H(ft.boltShapeX,ft.boltShapeY,ft.boltShapeZ),xt=new qe({color:ft.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),B=new Gc({map:fe,color:ft.boltGlowColor,transparent:!0,opacity:.45,blending:pi,depthWrite:!1}),st=new qe({color:ft.boltGlowColor,map:qt,transparent:!0,opacity:ft.trailOpacity,blending:pi,depthWrite:!1,side:Ne}),ut=new ra(.5,.03,ft.boltTrailScale,6,1,!0);ut.rotateX(-Math.PI/2),ut.translate(0,0,-ft.boltTrailScale/2);const Ft=Array.from({length:24},()=>{const Z=new Ce,Pt=new ge(Bt,xt);Pt.scale.copy(it);const At=new Md(B);At.scale.setScalar(ft.boltGlowScale),At.renderOrder=6;const ee=new ge(ut,st);return ee.renderOrder=5,Z.add(Pt,At,ee),Z.visible=!1,r.add(Z),{group:Z,core:Pt}}),Gt=Array.from({length:6},()=>{const Z=Hd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Z.group.visible=!1,r.add(Z.group),Z}),$t=e.dash,z=new da($t.ringRadius-.06,$t.ringRadius,28),vt=Array.from({length:6},()=>{const Z=new qe({color:16777215,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),Pt=new ge(z,Z);return Pt.rotation.x=-Math.PI/2,Pt.visible=!1,r.add(Pt),{mesh:Pt,mat:Z,life:0,base:1}});function j(Z,Pt,At,ee,te){const de=vt.find(re=>re.life<=0)??vt[0];de.mat.color.set(ee),de.mesh.position.set(Z,At+.04,Pt),de.base=te,de.mesh.scale.setScalar(te*.6),de.mesh.visible=!0,de.mat.opacity=.9,de.life=$t.fxDuration}const at=e.links,wt=new da(at.ringRadius-.07,at.ringRadius,28),Mt=Array.from({length:5},()=>{const Z=new qe({color:at.chargeColor,transparent:!0,opacity:0,side:Ne,depthWrite:!1}),Pt=new ge(wt,Z);return Pt.rotation.x=-Math.PI/2,Pt.visible=!1,r.add(Pt),{mesh:Pt,mat:Z,life:0,base:1}});function Jt(Z,Pt,At,ee){const te=Mt.find(de=>de.life<=0)??Mt[0];te.mesh.position.set(Z,At+.05,Pt),te.base=ee,te.mesh.scale.setScalar(ee*.55),te.mesh.visible=!0,te.mat.opacity=.85,te.life=at.fxDuration}let ae=t.playerLink.id,oe=t.playerLink.hitIds.length,se=t.dash.id,be="none";const xe=NS(e.camera,e.smartCamera,e.zoom,s/a),Je=t.character.position;xe.update(Je.x,Je.y,Je.z,1,t.camera);function Qe(Z,Pt){if(R.length===0)return 0;const At=o.domElement.getBoundingClientRect(),ee=new Wt((Z-At.left)/At.width*2-1,-((Pt-At.top)/At.height)*2+1);w.setFromCamera(ee,xe.camera);const te=w.intersectObjects(R,!0);for(const de of te){const re=de.object.userData.dummyId;if(re&&re>0)return re}return 0}function Me(Z,Pt,At){const ee=o.domElement.getBoundingClientRect(),te=new H(Z,Pt,At).project(xe.camera);return{x:ee.left+(te.x*.5+.5)*ee.width,y:ee.top+(-te.y*.5+.5)*ee.height}}let Pe=0,De=0;return{gaitDebug(){return y.gaitDebug()},trailDebug(){return m.debug()},stretchDebug(){const Z=y.stretch();return{arm:Z.arm,leg:Z.leg,torso:Z.torso,impact:Z.impact}},swingDebug(){return y.swingDebug()},render(Z,Pt){const At=Z.character,ee=Z.combat;e.hitstop.enabled&&Z.hitCount>Pe&&De<=0&&(De=Math.max(0,e.hitstop.duration)),Pe=Z.hitCount;const te=De>0;te&&(De-=Pt),p.position.set(At.position.x,At.position.y,At.position.z),p.rotation.y=At.bodyYaw;const de=Z.dash.phase==="active"&&Z.dash.kind==="roll",re=de&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;if(v.rotation.x=de?re*Math.PI*2:0,v.position.y=x-(de?.2*Math.sin(Math.PI*re):0),te||y.update(At,ee,Z.playerHurt,Pt,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace),m.update(te?0:Pt,te?null:y.weaponBlade(),!te&&(ee.phase==="active"||Z.playerLink.phase==="active"||de&&Z.dash.duration>0)),!te)for(let St=0;St<_.length;St++)Z.dummies[St]&&_[St].update(Z.dummies[St],Pt);const an=xe.camera.position,He=Math.atan2(an.x-At.position.x,an.z-At.position.z),A=Z.config.gaze.hurtHoldSec,V=Z.time-Z.playerHurt.lastAt,et=A>0&&V>=0&&V<A?1-V/A:0,Q=ib(Z.gaze.active,Z.gaze.threat,et,Z.time,S);sb(ot,ht,Y,gt,Q.level),k=hb(At.grounded,At.position.y,k),N.mesh.position.set(At.position.x,k+.028,At.position.z),N.update(Q.arcRad,Q.opacity,Q.scale,ot,He);const X=Z.config.abilities.arcane,Et=Math.max(1,Math.floor(X.waves)),Dt=Math.max(1e-4,X.waveInterval),Yt=rb({charging:ee.charging,charge:ee.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:Dt,channelProgress:Z.abilities.channeling?(Z.abilities.waveIndex+(1-Math.min(1,Math.max(0,Z.abilities.fireTimer/Dt))))/Et:0,arcaneCooldown:Z.abilities.cooldown,arcaneCooldownMax:X.cooldown,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});W.mesh.position.set(At.position.x,At.position.y+.03,At.position.z),W.set(Yt.ratio,Yt.source==="none"?0:S.meterOpacity,Yt.source==="charge"?J:Yt.source==="channel"?bt:jt,He);const Zt=Z.playerLink,Vt=Zt.weapon?Z.config.links.moves[Zt.weapon]:void 0,Xt=cb(Zt.phase,At.position.x,At.position.z,Zt.facing,Zt.travel,(Vt==null?void 0:Vt.hit.radius)??.9);pt.set(Xt.x,Xt.z,.042,Xt.radius,Xt.active?S.landingOpacity:0,Z.time);for(let St=0;St<P.length;St++){const _t=Z.dummies[St],ne=P[St],ce=L[St],Nt=tt[St];if(!_t){ne.mesh.visible=!1,ce.mesh.visible=!1,Nt.mesh.visible=!1;continue}const Ye=Z.targeting.hasTarget&&Z.targeting.targetId===_t.id;if(xm(Z,_t)){const ve=vm(Z,_t);ot.copy(Y).lerp(gt,ve)}else ot.copy(K);const le=ob(_t.attackPhase,_t.attackPhaseTimer,Z.config.dummies.attackWindup);le.active?(ot.lerp(Ct,.5*le.urgency),Nt.mesh.position.set(_t.position.x,_t.position.y+.031,_t.position.z),Nt.set(le.ratio,S.warnOpacity*(.65+.35*le.urgency),Ct,He)):Nt.set(0,0,Ct,He);const O=Ye?1:0,lt=O>F[St]?S.haloFadeInSec:S.haloFadeOutSec;F[St]=Gd(F[St],O,Pt,lt);const mt=F[St],Ot=1+.02*mt*Math.sin(Z.time*2.2+_t.id),Ut=S.arcDeg+(S.selectedArcDeg-S.arcDeg)*mt;ne.mesh.position.set(_t.position.x,_t.position.y+.022,_t.position.z),ne.update(Ut*Math.PI/180,S.opacity+(S.selectedOpacity-S.opacity)*mt,1+(S.selectedScale-1)*mt*Ot,ot,He,1+(S.selectedThicknessScale-1)*mt),I[St]=Gd(I[St],O,Pt,O>I[St]?S.haloFadeInSec:S.haloFadeOutSec);const Qt=I[St];ce.mesh.position.set(_t.position.x,_t.position.y+.019,_t.position.z),ce.update(Ut*Math.PI/180,S.haloOpacity*Qt*(.88+.12*Math.sin(Z.time*2.2+_t.id)),S.selectedScale*(.94+.06*Qt)*Ot,ot,He)}if(Lt.position.set(At.position.x,At.position.y,At.position.z),Lt.rotation.y=ee.phase!=="idle"?ee.attackFacing:At.bodyYaw,Z.dash.id!==se){se=Z.dash.id;const St=Z.dash;be=St.kind,St.kind==="blink"?(j(St.fromX,St.fromZ,At.position.y,$t.blinkColor,.9),j(St.toX,St.toZ,At.position.y,$t.blinkColor,1.35)):j(St.fromX,St.fromZ,At.position.y,$t.rollColor,1.1)}for(const St of vt){if(St.life<=0)continue;St.life-=Pt;const _t=Math.max(0,St.life/$t.fxDuration);St.mat.opacity=.9*_t,St.mesh.scale.setScalar(St.base*(.6+(1-_t)*1.2)),St.life<=0&&(St.mesh.visible=!1)}const Ht=Z.playerLink;Ht.id!==ae&&(ae=Ht.id,oe=Ht.hitIds.length,Jt(At.position.x,At.position.z,At.position.y,1)),Ht.hitIds.length>oe?(oe=Ht.hitIds.length,Jt(At.position.x,At.position.z,At.position.y,1.35)):Ht.hitIds.length<oe&&(oe=Ht.hitIds.length);for(const St of Mt){if(St.life<=0)continue;St.life-=Pt;const _t=Math.max(0,St.life/Math.max(at.fxDuration,1e-6));St.mat.opacity=.85*_t,St.mesh.scale.setScalar(St.base*(.55+(1-_t)*1.1)),St.life<=0&&(St.mesh.visible=!1)}const he=ft.slashEnabled&&ee.phase==="active"&&ee.comboIndex>=3;It.opacity=he?.7:0,Rt.opacity=he?ft.slashGlowOpacity:0,he&&(E.rotation.z=-1.2+ee.attackProgress*3.2,E.scale.setScalar(.9+ee.comboIndex*.13));for(let St=0;St<Ft.length;St++){const _t=Z.abilities.projectiles[St],ne=Ft[St];ne.group.visible=!!_t,_t&&(ne.group.position.set(_t.x,_t.y,_t.z),ne.group.scale.setScalar(_t.radius),ne.group.rotation.set(0,Math.atan2(_t.dirX,_t.dirZ),0))}for(let St=0;St<Gt.length;St++){const _t=Z.abilities.rings[St],ne=Gt[St];if(!_t){ne.group.visible=!1;continue}const ce=Math.max(0,Math.min(1,_t.life/Math.max(_t.duration,1e-6))),Nt=lb(Math.max(0,_t.duration-_t.life),S.areaExpandSec);ne.set(_t.x,_t.z,.045,_t.radius*Nt.scale,S.areaOpacity*(.35+.65*ce)*Nt.alpha,Z.time)}for(let St=0;St<dt.length;St++){const _t=Z.arrows[St],ne=dt[St];if(!_t){ne.group.visible=!1,ne.bone&&(r.attach(ne.group),ne.bone=null),ne.arrowId=0;continue}const ce=_t.stuck&&_t.stuckDummy>=0;if(ne.arrowId!==_t.id){if(ne.bone&&(r.attach(ne.group),ne.bone=null),ne.arrowId=_t.id,ne.group.position.set(_t.x,_t.y,_t.z),ne.group.rotation.set(_t.pitch,_t.yaw,0,"YXZ"),ce){const Ye=_[_t.stuckDummy],le=Ye?Ye.boneAtWorld(_t.x,_t.y,_t.z):null;le&&(le.node.attach(ne.group),ne.bone=le.node)}}else ne.bone||(ne.group.position.set(_t.x,_t.y,_t.z),ne.group.rotation.set(_t.pitch,_t.yaw,0,"YXZ"));ne.group.visible=!0;const Nt=_t.stuck?Math.min(1,_t.rest/.6):1;ne.shaftMat.opacity=Nt,ne.tipMat.opacity=Nt,ne.glowMat.opacity=(_t.stuck?.28:.85)*Nt,ne.trailMat.opacity=_t.stuck?0:ft.trailOpacity*Nt,ne.trail.visible=!_t.stuck}xe.update(At.position.x,At.position.y,At.position.z,Pt,Z.camera),o.render(r,xe.camera)},resize(){const Z=Math.max(1,n.clientWidth),Pt=Math.max(1,n.clientHeight);o.setSize(Z,Pt,!1),xe.resize(Z/Pt)},getGroundBasis(){return xe.getGroundBasis()},setCollidersVisible(Z){for(const Pt of h)Pt.opacity=Z?.3:1,Pt.wireframe=Z,Pt.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setLabVisible(Z){g.setVisible(Z)},setLabLabelsVisible(Z){g.setLabelsVisible(Z)},snapCamera(Z,Pt,At){xe.snap(Z,Pt,At)},setZoom(Z){xe.setZoom(Z)},pickDummy:Qe,projectToScreen:Me,diagnostics(){const Z=Mf(e.camera.pitchDeg),Pt=ub(Z,Lt.rotation.y);return{lean:y.lean(),slashNormal:Pt,arrowForward:y.arrowDirection(),gait:{hipYaw:y.hipYaw(),gaitYaw:y.gaitYaw()},attackBlend:y.attackBlend(),attackWeights:y.attackWeights(),landing:y.landing(),hurt:y.hurt(),ik:y.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:v.rotation.x,activeRings:vt.filter(At=>At.life>0).length,lastKind:be},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...xe.smart()}}},dispose(){y.dispose(),g.dispose();for(const Z of _)Z.dispose();N.dispose();for(const Z of P)Z.dispose();for(const Z of L)Z.dispose();W.dispose(),m.dispose();for(const Z of tt)Z.dispose();pt.dispose(),D.dispose(),It.dispose(),Rt.dispose(),Bt.dispose(),xt.dispose(),B.dispose(),st.dispose(),ut.dispose();for(const Z of Gt)Z.dispose();ct.dispose(),nt.dispose(),kt.dispose(),q.dispose();for(const Z of dt)Z.shaftMat.dispose(),Z.tipMat.dispose(),Z.glowMat.dispose(),Z.trailMat.dispose();fe.dispose(),qt.dispose();for(const Z of vt)Z.mat.dispose();z.dispose();for(const Z of Mt)Z.mat.dispose();wt.dispose(),f.traverse(Z=>{Z instanceof ge&&Z.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Pb(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Lb(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Db(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function y(){const x=n.status();s.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){d=x,e.hidden=!x,x?y():a.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();Pb(x).then(v=>{v?(p("已复制 ✓"),a.hidden=!0):(a.value=x,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),v=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Lb(`harness-${x.meta.version}-${v}.json`,JSON.stringify(x)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),a.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&y()},isOpen:()=>d,close:()=>m(!1)}}const kb={intents:{...Vd},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Ib(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=ym(t0,Ma),i=Cb(n,e,gn,Ma.stations),s=Sm(e),a=k0(t),o=I0(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.44 · 11-07 23:05 · 诊断");const l=U=>String(U).padStart(2,"0"),c=new Date,h=qm({meta:{version:"v0.9.44",buildTime:"11-07 23:05",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Db(h,r),d=P0({deadZone:()=>gn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:gn.showColliders,showGrid:gn.showGrid,showLab:gn.lab.enabled,showLabLabels:gn.lab.showLabels};let g=1;const y=Nm({maxRadiusPx:()=>gn.joystick.maxRadiusPx,deadZone:gn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>gn.zoom}),m=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function x(U){if(U===p)return;p=U;const k=Gi.indexOf(U)+1;for(const N of m)N.classList.toggle("is-active",Number(N.dataset.weapon)===k);w.refreshWeapon()}let v=kb,_=0;const R=()=>{g=1,i.setZoom(1)},w=f0(e,gn,u,{singleStep:()=>s.singleStep(v.intents),reset:()=>{g=1,s.singleStep({...Vd,resetPressed:!0})},resetZoom:R,onToggleColliders:U=>i.setCollidersVisible(U),onToggleGrid:U=>i.setGridVisible(U),onToggleLab:U=>i.setLabVisible(U),onToggleLabLabels:U=>i.setLabLabelsVisible(U)}),S=g0({stations:Ma.stations??[],world:e,view:i,onResetZoom:R});o.register({motion:d,debug:w.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:y,viewConfig:gn,debug:u,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),lab:{stations:Ma.stations??[],goto:U=>S.goto(U),current:()=>S.current(),recall:()=>S.recall()}};let T=performance.now(),b=60,M=0;function C(U){const k=Math.min((U-T)/1e3,.1);T=U,k>0&&(b=b*.9+1/k*.1);const N=y.sample();N.intents.resetPressed&&(g=1),g=Rm(g,N.zoomScale,gn.zoom.min,gn.zoom.max),i.setZoom(g);let P=N.intents.dummyClickId;if(N.tap){const I=i.pickDummy(N.tap.x,N.tap.y);I>0&&(P=I)}P>0&&(_=P),v={...N,intents:{...N.intents,dummyClickId:_}};const L=s.frame(k,v.intents,u.timeScale,u.paused,()=>{const I=e.events;for(let W=0;W<I.length;W++)h.event(I[W],e.time)});L>0&&(_=0),h.sample(e,v,k*1e3,L);for(const I of v.gestures)h.gesture(I);U-M>250&&(M=U,f.tick()),x(e.combat.weapon),i.render(e,k),S.tick(),d.update(e,v,i.getGroundBasis());const F=i.diagnostics();a.update(e,b,L,v,u,{attackBlend:F.attackBlend,attackWeights:F.attackWeights,landing:F.landing,hurt:F.hurt,ik:F.ik,zoom:F.camera.zoom},o.hudCompact()),requestAnimationFrame(C)}requestAnimationFrame(C)}Ib();

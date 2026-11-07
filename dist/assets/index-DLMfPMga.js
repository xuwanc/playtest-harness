(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const na=["sword-shield","dual-swords","greatsword","staff","bow"],mr=["wander","follow","keep-distance","attack","idle"],hu={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Do=1e-6;function bs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Do?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Do?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Mp(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Do){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Do)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const kn=1e-6,hc=Math.PI/180,vl=-1e9;function du(){return{type:"none",lastAt:vl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function dc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function dh(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function _l(n,t,e){const i=e.duration>0?e.duration:yl(n,e.type);if(t.kind==="player"){const s=n.playerHurt;if(dh(s,e.type,i,e.dirX,e.dirZ),s.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>kn){const o=e.knockback*n.config.hits.knockbackDecay;s.knockX=e.dirX*o,s.knockZ=e.dirZ*o}dc(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(a){if(dh(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>kn){const s=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*s,a.hurt.knockZ=e.dirZ*s}n.hitCount+=1,dc(n,"hit",a.id,a.position)}}function Yo(n,t,e){_l(n,{kind:"dummy",index:t},e)}function bp(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function yl(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Sp(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=e.reach[t.weapon]??0,s=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*hc),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>a+l)continue;const m=u>kn?f/u:o,y=u>kn?d/u:r;if(u>kn&&(f*o+d*r)/u<s)continue;let g="light";t.weapon==="greatsword"?g="knock":t.comboIndex>=3&&(g="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,c));const _=Math.max(0,x-u);Yo(n,n.dummies.indexOf(h),{type:g,duration:yl(n,g),dirX:m,dirZ:y,knockback:_})}}function wp(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),y=Math.cos(i.facing),g=Math.cos(uh(s.arcDeg,0,180)*hc),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const v=u>kn?uh(((_.position.x-r)*f+(_.position.z-l)*d)/u,0,1):0,R=r+f*v,w=l+d*v,b=Math.hypot(_.position.x-R,_.position.z-w);let E=!1;if(s.shape==="circle")E=b<=s.radius+p;else if(s.shape==="capsule")E=b<=Math.max(s.radius,s.width)+p;else{const z=_.position.x-c,L=_.position.z-h,k=Math.hypot(z,L),H=k>kn?(z*m+L*y)/k>=g:!0;E=k<=s.radius+p&&H||b<=s.width+p}if(!E)continue;const S=_.position.x-r,M=_.position.z-l,P=Math.hypot(S,M);if(P>kn&&(S*m+M*y)/P<Math.cos(Math.max(s.arcDeg,90)*hc))continue;const F=P>kn?S/P:m,D=P>kn?M/P:y;_l(n,{kind:"dummy",index:x},{type:s.type,duration:s.duration,dirX:F,dirZ:D,knockback:s.knockback}),i.hitIds.push(_.id),dc(n,"link-hit",_.id,_.position)}}function Ep(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>kn?s/r:0,c=r>kn?o/r:1;_l(n,{kind:"player"},{type:"light",duration:yl(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function Tp(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Sp(n),wp(n,t),Ep(n)}function uh(n,t,e){return n<t?t:n>e?e:n}const uu=Math.PI/180,Ml=1e-6;function Ap(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function ko(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function fu(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ml?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function pu(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Ml)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Rp(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Pp(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!pu(n,t,e))return!1;const i=fu(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>mu(n,e)}function mu(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*uu}function Cp(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!pu(n,e,a)){ko(n);return}const s=fu(n,e,a.lookRange);if(s===null){ko(n);return}const o=n.character,r=He(s-o.bodyYaw),l=Math.abs(r),c=mu(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ml;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*uu);i.targetYaw=He(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+d*Rp(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Pi=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ns(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,Pi)*i))}function Os(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,Pi)*a)),r=Math.max(i,0)*a;return r<=Pi?n:n+La(o,-r,r)}function fh(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Pi)*a)),o=Math.max(i,0)*a;return o<=Pi?n+s:n+La(s,-o,o)}function La(n,t,e){return n<t?t:n>e?e:n}function ph(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function Lp(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Pi,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=bs(n,e);else if(c)i.facing=Os(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=bs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Pi)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,F=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=ph(i.facing,M,P,F);else if(h>=a.facingMinMagnitude&&Math.abs(He(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const z=Ns(i.facing,M,a.facingSmoothRate,t);i.facing=ph(i.facing,z,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Pp(n,e)||(c?i.bodyYaw=Os(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Ns(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(p-i.bodyYaw))>M&&(p=i.moveYaw)}const x=o||f||g,_=a.maxHeadTurnDeg*Math.PI/180;let v;if(x){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?Os(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Ns(i.headYaw,p,M,t)}else{const M=He(i.headYaw-i.bodyYaw),P=He(p-i.bodyYaw),F=Math.abs(P)<Math.abs(M)-1e-9,D=F?n.config.gaze.headReturnRate:a.headTurnRate,z=F?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(z)?Os(M,P,D,z,t):Ns(M,P,D,t);v=i.bodyYaw+L}const R=He(v-i.bodyYaw);R>_?v=i.bodyYaw+_:R<-_&&(v=i.bodyYaw-_),i.headYaw=v;const w=n.config.gaze;let b=0;if(c)b=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*La(w.eyeHeightRatio,0,1),F=M.position.y+n.config.dummies.height*La(w.aimHeightRatio,0,1),D=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);b=Math.atan2(F-P,Math.max(Pi,D))}}const E=Math.max(0,w.maxHeadPitchDeg)*Math.PI/180;b=La(b,-E,E);const S=x?w.headPitchRate:Math.min(w.headPitchRate,w.headReturnRate);i.headPitch=fh(i.headPitch,b,S,Math.max(0,w.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=fh(i.bodyPitch,i.headPitch*La(w.bodyPitchScale,0,1),w.bodyPitchRate,Math.max(0,w.maxHeadPitchDeg)*Math.PI/180,t)}const gu=1e-6,$o=Math.PI/180;function Zo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Dp(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*$o,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(He(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function kp(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Ip(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*$o,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Dp(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(kp(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Zo(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Fp(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*$o,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Zo(n,"projectile-fire",i.volleyId,o)}i.pending=a}function mh(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Zo(n,"channel-end",0,n.character.position))}function Up(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){mh(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Zo(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=bs(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,gu),Ip(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){mh(n,i);break}}function zp(n,t,e){const i=Math.max(0,e.homingConeDeg)*$o,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+gu;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(He(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function Np(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=zp(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=He(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),y=f+m;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){Yo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Op={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Up(n,t,e,s,a,i.cfg.slot),Fp(n,t,s),Np(n,t,s)}},gr=1e-6;function xu(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Bp(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),xu(n,"ring-place",i.id,e)}function Hp(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,gr),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),y=m>gr?f/m:0,g=m>gr?d/m:1;Yo(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:g,knockback:e.knockback})}xu(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Gp={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Bp(n,s),Hp(n,t,s)}},Vp={channelVolley:Op,groundRing:Gp};function Xp(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Wp(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Vp[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Yp(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function vu(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function $p(n,t,e){Wp(n,t,e)}function xr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const gh=1e-6;function xh(n,t,e){return n<t?t:n>e?e:n}function _u(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function yu(n){const t=n.camera,e=_u();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Zp(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=xh((e.radius-d)/Math.max(gh,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:xh(a/(a+Math.max(gh,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function qp(n){const t=[],e=n.ground.size;t.push(da("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(da(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(da(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(da(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(da(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(da(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function da(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const fi=1e-6;function Io(n,t,e){return n<t?t:n>e?e:n}function Ss(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+fi||c.maxY<i-o-fi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function bl(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+fi||l.minY>=o-fi)continue;const c=Io(t.x,l.minX,l.maxX),h=Io(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>fi*fi){const m=Math.sqrt(u),y=(e-m)/m;t.x+=f*y,t.z+=d*y}else{const m=t.x-l.minX,y=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,x=Math.min(m,y,g,p);x===m?t.x=l.minX-e:x===y?t.x=l.maxX+e:x===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function Sl(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+fi||o.minY>=s-fi)continue;const r=Io(t.x,o.minX,o.maxX),l=Io(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-fi)return!0}return!1}const Ai=1e-6,Ba=Math.PI/180;function wl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function uc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Mu(n){n.arrows.length=0}function jp(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let m=0;u>Ai&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const y=n+f*m,g=e+d*m,p=y-o,x=g-r;if(p*p+x*x>h*h)return-1;const _=t+(a-t)*m;return _<l-.1||_>l+c?-1:m}function Kp(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Ai)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Ba,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Ai;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(wl(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function Jp(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Ba;return t+Fa(wl(s-t),-o,o)}function Qp(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Ba),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Ba),a<=0)return r;const l=n.dummies.find(y=>y.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Ai,s),f=l.position.y+n.config.dummies.height*Fa(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=Fa(u,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function tm(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Kp(n,e),l=Jp(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=Qp(n,f,u,d,r,s),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Ba};return n.arrows.push(y),uc(n,"arrow-shot",a,y),y}function Fa(n,t,e){return n<t?t:n>e?e:n}function em(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const R=Math.cos(v.bodyYaw),w=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*R+c.offZ*w,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*w+c.offZ*R,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(R=>R.id===c.targetId);if(!v)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>Ai){const w=Math.atan2(v.position.x-c.x,v.position.z-c.z),b=Math.atan2(c.vx,c.vz),E=c.turnRate*t,S=b+Fa(wl(w-b),-E,E);c.vx=Math.sin(S)*R,c.vz=Math.cos(S)*R;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const P=M/R,D=(v.position.y+s*Fa(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,z=Math.max(0,i.verticalTurnRate)*t;c.vy+=Fa(D-c.vy,-z,z)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,y=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const R=n.dummies[v],w=jp(h,f,d,u,m,y,R.position.x,R.position.z,R.position.y,s,a+i.radius);w>=0&&w<p&&(p=w,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=g;const R=Math.cos(v.bodyYaw),w=Math.sin(v.bodyYaw),b=c.x-v.position.x,E=c.z-v.position.z;c.offX=b*R-E*w,c.offZ=b*w+E*R,c.offY=c.y-v.position.y;const S=Math.atan2(c.vx,c.vz);c.localYaw=S-v.bodyYaw,c.yaw=S,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);Yo(n,g,{type:"light",duration:.22,dirX:M>Ai?c.vx/M:0,dirZ:M>Ai?c.vz/M:1,knockback:.14}),uc(n,"arrow-land",v.id,c),l.push(c);continue}const x=Ss(n.boxes,u,y,m+.4,.04,0,6),_=Number.isFinite(x)?x:0;if(m<=_+.02&&c.vy<0){c.x=u,c.y=_+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Ai,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*Ba),c.rest=Math.max(.2,i.stickSec),uc(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=y,l.push(c)}n.arrows=l}const fc=1e-6,nm=Math.PI/180;function pc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function El(n,t,e){return n<t?t:n>e?e:n}function qo(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function mc(n){const t=n.id,e=n.windowId;Object.assign(n,qo()),n.id=t,n.windowId=e}function im(n){mc(n)}function bu(n){mc(n.playerLink);for(const t of n.dummies)mc(t.link)}function am(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function gc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Fo(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,qo()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function sm(n,t){const e=n.config.links.search,i=n.character.position,a=El(e.maxAngleDeg,0,180)*nm;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<fc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(He(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function om(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=bs(n,t),l=sm(n,r),c=l.id>0?l.yaw:r,h=l.id>0?El(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),pc(n,"link-start",s.id)}function rm(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Fo(n);return}if(e.weapon!==n.combat.weapon){Fo(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,pc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,pc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?El(r/o,0,1):1,e.phase==="active"&&i.active>fc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(fc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function cm(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Fo(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&gc(n,"sprint"),a.prevSprinting=r,rm(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&om(n,e,l,o.weapon)}const xc=1e-6;function Ri(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Su(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function jo(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=Su()}function lm(n){return{weapon:na[Math.max(0,n-1)]??na[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:Su()}}function hm(n,t){return bs(n,t)}function dm(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function wu(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=hm(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,Ri(n,"attack-start",i)}function Eu(n){return Math.max(0,n.config.combat.settle)}function vc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];wu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Eu(n),lunge:dm(n,i.lunge[e-1]??0)},e)}function vh(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,wu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Eu(n),lunge:i.lunge},0),tm(n,e,n.combat.attackFacing),Ri(n,"charge-release",e)}function um(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",Ri(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Ri(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&vc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>xc&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&vc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function fm(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=na.length){const l=na[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,jo(n),Fo(n),Ri(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ri(n,"combo-reset",0))),um(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;vc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ri(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,xc)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,vh(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?vh(n,e,l):Ri(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>xc)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=y=>c*(1-Math.pow(1-Math.min(1,Math.max(0,y/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let m=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);m=Math.min(m,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*m,n.impulse.z=Math.cos(i.attackFacing)*m}}const _c=1e-6;function vr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function pm(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Tu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function _h(n,t,e){return n<t?t:n>e?e:n}function mm(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-_c;){const d=Math.min(l,c+r),u=s.x+t*d,m=s.z+e*d,y=_h(u,o.minX,o.maxX),g=_h(m,o.minZ,o.maxZ),p={x:y,y:s.y,z:g};if(Sl(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=g,c=d,y!==u||g!==m))break}return{x:h,z:f}}function gm(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,gc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&vr(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&jo(n));const l=Mp(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=mm(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),gc(n,"blink"),vr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(_c,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,vr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(_c,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const sn=1e-6,yc=Math.PI*2,xm=7,vm=18;function _m(n){return Math.atan2(Math.sin(n),Math.cos(n))}function yh(n,t,e,i){return n+_m(t-n)*(1-Math.exp(-Math.max(e,sn)*i))}function Tl(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function ym(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:du(),link:qo()})}return t}function Mm(n){const t=mr.indexOf(n);return mr[(t+1)%mr.length]}function Au(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,im(i.link)}n.dummyAttackCount=0}function bm(n,t,e){const i=xr(n)*yc,a=Math.sqrt(xr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+xr(n)*.8)}function Sm(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function wm(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(Sm(t,i),sn);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Tl(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function Em(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>sn?a/o:0,l=o>sn?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&bm(n,t,e);const y=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(y,g);p>sn&&(c=y/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>sn&&(f=Math.atan2(c,h)):o>sn&&(f=Math.atan2(r,l)),e.leashRadius>sn&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,m=Math.hypot(d,u);if(m>e.leashRadius){const y=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-u/m;c=c*(1-y)+g*y,h=h*(1-y)+p*y;const x=Math.hypot(c,h);x>sn&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Tm(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+sn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Tl(n,"dummy-attack",e))}wm(n,e,t,i);const a=Em(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-sn||a.x<0&&e.position.x<=s.minX+sn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-sn||a.z<0&&e.position.z<=s.minZ+sn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,sn)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=yh(e.bodyYaw,e.facing,xm,t),e.headYaw=yh(e.headYaw,e.facing,vm,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(bl(n.boxes,e.position,i.radius,i.height,c))if(Sl(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,x=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Ss(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+sn&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const m=Math.hypot(e.velocity.x,e.velocity.z),y=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,sn)),g=Math.max(n.config.strideLength*(1+y*n.config.strideSpeedGain),sn);e.stride=g,e.gaitPhase=(e.gaitPhase+u/g*yc)%yc}function Am(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Mm(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,Tl(n,"dummy-mode",a)}for(const a of n.dummies)Tm(n,t,a,i)}const Fn=1e-6,Mh=Math.PI*2;function bh(n,t){return Math.sqrt(n*n+t*t)}function Bs(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Rm(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,jo(n)}function Pm(n,t,e){const i=n.character,a=n.config,s=Ss(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,jo(n),bu(n),Tu(n),vu(n),Mu(n),ko(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=vl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Cm(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=bh(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-Fn||r<0&&s.x<=h.minX+Fn)&&(r=0),(l>0&&s.z>=h.maxZ-Fn||l<0&&s.z<=h.minZ+Fn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;a.sprinting=!m&&e.sprintHeld&&c>Fn;const y=i.combat.weapons[n.combat.weapon];let g=y?y.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const D=m?i.skillDecel:c>Fn?i.acceleration:i.friction,z=1-Math.exp(-D*t);o.x+=(r*p-o.x)*z,o.z+=(l*p-o.z)*z}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Bs(n,"jumped",i.jumpSpeed)),n.events.some(D=>D.type==="blink"&&D.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const _=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,bl(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Sl(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=_,s.z=v,o.x=0,o.z=0;else{const D=s.x-_,z=s.z-v;Math.abs(D)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(z)<Math.abs(o.z*t)*.5&&(o.z=0)}Bs(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const w=Ss(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&w>s.y+Fn&&w-s.y<=i.stepHeight+Fn&&(s.y=w,o.y=0,Bs(n,"stepUp",w));const b=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=Ss(n.boxes,s.x,s.z,b,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||Bs(n,"landed",E),a.grounded=!0):a.grounded=!1;const S=bh(s.x-_,s.z-v);a.distance+=S;const M=S/Math.max(t,Fn),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,Fn)),F=Math.max(i.strideLength*(1+P*i.strideSpeedGain),Fn);a.stride=F,a.gaitPhase=(a.gaitPhase+S/F*Mh)%Mh}const Mc=1e-6,Sh=2.399963229728653;function ji(n,t,e){return n<t?t:n>e?e:n}function wh(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,y;f<Mc?(u=r,m=l,y=d):(u=c/f,m=h/f,y=d-f);const g=y+o;n.x-=u*g*a,n.z-=m*g*a,t.x+=u*g*s,t.z+=m*g*s}function Lm(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*Sh;wh(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*Sh;wh(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)bl(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=ji(h.position.x,c.minX,c.maxX),h.position.z=ji(h.position.z,c.minZ,c.maxZ)}function Dm(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=ji(r.minScale,0,1);if(l<Mc||c<=0||h>=1)return 1;const f=a+o,d=ji(r.approachDot,0,.99);let u=0;for(const m of s){const y=m.position.x-n,g=m.position.z-t,p=Math.hypot(y,g);if(p>=f+c)continue;if(p<Mc){u=1;continue}const x=(e*y+i*g)/(l*p);if(x<=d)continue;const _=ji(1-(p-f)/c,0,1),v=ji((x-d)/(1-d),0,1);u=Math.max(u,_*v)}return 1-(1-h)*ji(u,0,1)}function km(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Dm(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const _r=1e-6,Im=Math.PI/180;function Fm(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Um(n,t,e){return n<t?t:n>e?e:n}function zm(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>_r?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>_r&&(o=Math.atan2(e.moveX,e.moveZ));const l=Um(i.maxAngleDeg,0,180)*Im;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-s.x,y=u.position.z-s.z,g=Math.hypot(m,y);if(g<_r||g>i.range)continue;const p=Math.atan2(m,y),x=Math.abs(He(p-o));if(x>l)continue;const _=g-i.frontBias*Math.cos(x);_<c&&(c=_,h=u.id,f=p,d=g)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const Kn=1e-6;function Da(n,t,e){return n<t?t:n>e?e:n}function Eh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Nm(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(D,z)=>{const L=D.position.x-s.x,k=D.position.z-s.z,H=Math.hypot(L,k);if(H<Kn||H>z)return 0;const O=Da((z-H)/Math.max(Kn,z-i.nearDistance),0,1);let I=O*(i.modeWeight[D.mode]??.5);return D.attackPhase==="active"&&(I+=i.attackBoost*O),I},r=[];let l=0,c=!1,h=!1,f=!1;for(const D of n.dummies){const z=o(D,i.threatRange),L=D.position.x-s.x,k=D.position.z-s.z,H=Math.hypot(L,k);z>0&&(r.push({id:D.id,x:D.position.x,z:D.position.z,dx:L,dz:k,yaw:Math.atan2(L,k),w:z}),l+=z,H<=i.approachDist&&(i.modeWeight[D.mode]??.5)>=i.hostileModeWeight&&(f=!0)),H>Kn&&H<=i.recoveryDist&&(c=!0),(D.attackPhase==="windup"||D.attackPhase==="active")&&H<=i.threatRange&&(h=!0)}const d=l<=0?0:Da(l/(l+Math.max(Kn,i.saturation)),0,1),u=r.length>0,m=a.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Kn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=y||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((D,z)=>z.w-D.w);const x=r.slice(0,Math.max(1,i.maxThreats)),_=r[0],v=Math.atan2(_.dx,_.dz),R=i.behindAngleDeg*Math.PI/180,w=n.character.bodyYaw;let b=0,E=0,S=0;for(const D of x){const z=Math.abs(Eh(D.yaw-v))/Math.PI;let L=D.w/(1+Math.max(i.spreadFalloff,0)*z*z);D!==_&&i.behindFalloff<1&&Math.abs(Eh(D.yaw-w))>R&&(L*=Math.max(i.behindFalloff,0)),b+=D.x*L,E+=D.z*L,S+=L}a.mainId=_.id,a.mainYaw=v;const M=n.dummies.find(D=>D.id===_.id),P=(M?M.position.y:0)+n.config.dummies.height*Da(i.aimHeightRatio,0,1),F=s.y+n.config.characterHeight*Da(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-F,Math.max(Kn,Math.hypot(_.dx,_.dz))),a.centroidYaw=S>Kn?Math.atan2(b/S-s.x,E/S-s.z):v,a.threatCount=r.length,a.threat=d}function Om(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function Bm(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Kn||a>e.threatRange)return 0;const s=Math.max(Kn,e.threatRange-e.nearDistance),o=Da((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Kn,e.modeWeight.attack??1.5);return Da(r/l,0,1)}function Hm(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Gm(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:qp(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:lm(1),playerLink:qo(),arrows:[],arrowSeq:0,abilities:Yp(),skills:Xp(n),impulse:{x:0,z:0},targeting:Fm(),turnInPlace:Ap(),playerHurt:du(),hitCount:0,dash:{...pm(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{..._u(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:Hm(),dummies:ym(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function Vm(n){Rm(n),Au(n),bu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=vl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,vu(n),Mu(n),Tu(n),yu(n),ko(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Th(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){Vm(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?zm(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),cm(n,t,e),n.modules.combat&&fm(n,t,e),n.modules.dash&&gm(n,t,e),n.modules.movement&&Cm(n,t,e),n.modules.gaze&&Nm(n,t,e),n.modules.orientation&&Lp(n,t,e),Cp(n,t,e),n.modules.dummies&&Am(n,t,e),bp(n,t),am(n,t),n.modules.abilities&&$p(n,t,e),n.modules.combat&&em(n,t),n.modules.dummies&&(Tp(n,t),n.modules.separation&&(Lm(n),km(n))),n.modules.camera?Zp(n):yu(n),n}const Ru=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff"],Ah=1e-9;function Xm(n,t,e){return n<t?t:n>e?e:n}function Pu(n){return Xm(Number.isFinite(n)?n:0,0,1)}function Cu(n,t){const e=Pu(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function Wm(){const n={};for(const t of Ru)n[t]=0;return n}function Ym(n,t){const e=Wm(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Pu(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Ah;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Ah?(a-o.t)/l:0,h=Cu(o.ease??"linear",c);for(const f of Ru){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function $m(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Cu(i,t/a);return e.turns*Math.PI*2*s}function ns(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function Zm(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Th(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Th(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Lu={slopPx:12,longPressMs:450,doubleTapMs:280};function qm(n,t,e=Lu.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Ni(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function jm(n=Lu){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Ni(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Ni(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Ni(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Ni(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),Ni(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Ni(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Ni(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const yr=.001,Km=18;function bc(n,t,e){return n<t?t:n>e?e:n}function Sc(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Jm(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Qm(n,t,e,i,a=Km){const s=Jm(t);if(!s)return{state:Sc(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<yr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<yr?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<yr)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:bc(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Rh(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?bc(r,a,s):bc(n,a,s)}function t0(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function e0(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Mr=["jump","sprint","reset","attack","skill2"],n0=8,i0=16,br=10,Ph=14,Ch=140,a0=18,s0=16,o0=400,r0=1.0001;function So(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function c0(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&So(e)}function l0(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,y=null,g=-1,p=0,x=0,_=0,v=0,R=!1,w=0,b=1,E=0,S=null,M=0,P=0,F=!1,D=null,z=null,L=0,k=0,H=0,O=0,I=!1,X=!0,mt=-1;const ot=jm({slopPx:Ph,longPressMs:450,doubleTapMs:350});let dt=[],et=null;const q=new Set;function pt(B){B&&dt.push(B)}const j=new Map;let Mt=Sc(),Ht=!1,Nt=1;function jt(){const B=Array.from(j.values()),st=a(),ut=Qm(Mt,B,st.pinchGain,st.maxStepRatio,a0);if(Mt=ut.state,Ht=ut.pinching,ut.scale!==1&&(Nt*=ut.scale),ut.started||ut.armedNow)S=null,F=!0,D=null;else if(ut.ended&&o===null&&B.length===1){const Gt=B[0];o=Gt.id,r=Gt.x,l=Gt.y,c=0,h=0,f=Gt.x,d=Gt.y,R=!1,w=0,b=1,E=0,performance.now(),S=null,F=!0,D=null}}const ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},kt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let V=0,ue=0;const $t={},Vt=new Set,It=[];function Et(){for(const B of Mr)$t[B]!==void 0&&($t[B]=void 0),$(B);ot.reset(),q.clear(),j.clear(),Mt=Sc(),Ht=!1,o=null,c=0,h=0,f=0,d=0,R=!1,w=0,b=1,E=0,p=0,x=0,_=0,v=0,y=null,g=-1,S=null,F=!1,D=null,z=null,mt=-1,H=0,O=0,I=!1,X=!0}const At=()=>{document.hidden&&Et()},C=B=>{if(B.clientX===0&&B.clientY===0){m++;return}if(So(B.target)||c0(B.clientX,B.clientY)){q.add(B.pointerId);return}if(q.delete(B.pointerId),j.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!Ht){y=null,g=-1,o=B.pointerId,r=B.clientX,l=B.clientY,c=0,h=0,f=B.clientX,d=B.clientY,performance.now();const st=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);R=st,w=0,b=1,E=0,p=st?B.screenX:0,x=st?B.screenY:0,_=p,v=x,S=B.pointerId,M=B.clientX,P=B.clientY,F=!1}jt()},T=B=>{if(B.pointerId===z&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(L!==0||k!==0)||(X?(H=B.clientX-L,O=B.clientY-k):(L=B.clientX,k=B.clientY,X=!0,H=0,O=0))),pt(ot.move(B.pointerId,B.clientX,B.clientY,performance.now())),!q.has(B.pointerId)&&j.has(B.pointerId)&&(j.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),jt()),q.has(B.pointerId)||B.pointerId!==o)return;const st=performance.now();if(y===B.pointerId&&st-g<150){m++;return}const ut=B.clientX,Gt=B.clientY;if(ut===0&&Gt===0&&(r!==0||l!==0)){m++;return}const Ut=ut-f,N=Gt-d,yt=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),J=yt?B.screenX:0,rt=yt?B.screenY:0,St=yt&&(J!==0||rt!==0),wt=J-_,Kt=rt-v;if(R&&St){const ye=Math.hypot(wt,Kt),ke=Math.hypot(Ut,N);if(ye>3){if(w=0,E<30&&ke>6&&wt*Ut+Kt*N>.7*ye*ke){const Fe=ye/ke;Fe>.2&&Fe<5&&(b+=(Fe-b)*.3,E++)}}else ke>12&&(w++,w>=2&&(R=!1))}const re=Math.hypot(Ut,N);if(!R){const ye=u<0?Number.POSITIVE_INFINITY:st-u,ke=St?Math.hypot(wt,Kt):1/0;re>28&&(ye<200||ke<re*.4)&&(r+=Ut,l+=N,m++)}f=ut,d=Gt,_=J,v=rt,B.pointerId===S&&Math.hypot(B.clientX-M,B.clientY-P)>n0&&(F=!0);let ce,ae;R&&St?(ce=(J-p)/b,ae=(rt-x)/b):(ce=ut-r,ae=Gt-l);const we=Math.hypot(ce,ae),xe=s();we>xe&&(ce*=xe/we,ae*=xe/we);const Ye=Math.hypot(c,h),Qe=Math.hypot(ce,ae);if(Ye>10&&Qe>10){const ye=Math.abs(Math.atan2(c*ae-h*ce,c*ce+h*ae)),ke=Math.max(Ye,Qe)*ye,Fe=Math.max(Math.hypot(Ut,N),Math.hypot(wt,Kt)/Math.max(.2,b));if(ye>.6&&Fe<Math.max(6,ke*.5)){m++;return}}c=ce,h=ae};function $(B){if(!ht[B])return;ht[B]=!1,B==="attack"&&(kt.attackReleased=!0);const st=document.getElementById(`btn-${B}`);st==null||st.classList.remove("is-down")}function ct(){o!==null&&(y=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,w=0,b=1,E=0,p=0,x=0,_=0,v=0)}const lt=B=>{const st=j.delete(B.pointerId),ut=q.delete(B.pointerId);st&&jt(),B.pointerId===z&&(z=null,I?mt=performance.now():(H=0,O=0,mt=-1)),pt(ot.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const Zt of Mr)$t[Zt]===B.pointerId&&($t[Zt]=void 0,$(Zt));const Gt=!st&&!ut&&j.size<=1&&o!==null;(B.pointerId===o||j.size===0||Gt)&&ct(),!ut&&B.pointerId===S&&(!F&&!So(B.target)&&(D={x:B.clientX,y:B.clientY}),S=null)};for(const B of Mr){const st=document.getElementById(`btn-${B}`);if(!st)continue;const ut=B==="attack"||B==="skill2",Gt=N=>{if(N.preventDefault(),$t[B]===void 0){$t[B]=N.pointerId,ht[B]=!0,B==="jump"&&(kt.jump=!0),B==="reset"&&(kt.reset=!0),B==="sprint"&&(kt.sprintPressed=!0),B==="attack"&&(kt.attackPressed=!0),B==="skill2"&&(kt.skill2=!0),st.classList.add("is-down"),pt(ot.begin(B,N.pointerId,N.clientX,N.clientY,performance.now()));try{st.setPointerCapture(N.pointerId)}catch{}ut&&(z=N.pointerId,L=N.clientX,k=N.clientY,X=!(N.clientX===0&&N.clientY===0),H=0,O=0,I=!1,mt=-1)}},Zt=N=>{$t[B]===N.pointerId&&($t[B]=void 0,$(B),pt(ot.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Ut=N=>{$t[B]===N.pointerId&&($t[B]=void 0,$(B),pt(ot.cancel(N.pointerId,performance.now())))};st.addEventListener("pointerdown",Gt),st.addEventListener("pointerup",Zt),st.addEventListener("pointercancel",Ut),It.push(()=>{st.removeEventListener("pointerdown",Gt),st.removeEventListener("pointerup",Zt),st.removeEventListener("pointercancel",Ut)})}const it=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of it){const st=ut=>{ut.preventDefault(),V=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",st),It.push(()=>B.removeEventListener("pointerdown",st))}const Ct=B=>{const st=B.key.toLowerCase();if((st===" "||st.startsWith("arrow"))&&B.preventDefault(),Vt.has(st))return;Vt.add(st),st===" "&&(kt.jump=!0),st==="r"&&(kt.reset=!0),st==="shift"&&(kt.sprintPressed=!0),st==="j"&&(kt.attackPressed=!0),st==="k"&&(kt.skill2=!0),st>="1"&&st<="5"&&(V=Number(st)),st>="6"&&st<="9"&&(ue=Number(st)-5);const ut=Math.max(r0,a().keyStep||1.12);(st==="="||st==="+")&&(Nt*=ut),(st==="-"||st==="_")&&(Nt/=ut)},K=B=>{const st=B.key.toLowerCase();Vt.has(st)&&(Vt.delete(st),st==="j"&&(kt.attackReleased=!0))},ft=B=>{if(So(B.target))return;B.preventDefault();const st=B.deltaMode===1?B.deltaY*s0:B.deltaMode===2?B.deltaY*o0:B.deltaY;Nt*=t0(st,a().wheelStep)},Ft=B=>{B.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const _t=typeof window<"u"?window.visualViewport:null;return _t&&(_t.addEventListener("resize",nt),_t.addEventListener("scroll",nt)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",T),window.addEventListener("pointerup",lt),window.addEventListener("pointercancel",lt),window.addEventListener("blur",Et),document.addEventListener("visibilitychange",At),window.addEventListener("keydown",Ct),window.addEventListener("keyup",K),window.addEventListener("wheel",ft,{passive:!1}),window.addEventListener("gesturestart",Ft),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:m,screenOk:R,originSX:p,originSY:x,screenX:_,screenY:v,scale:b}},peekAim(){const B=performance.now(),st=Math.hypot(H,O),ut=z!==null||mt>=0&&B-mt<Ch;if(!(ut&&I&&st>=br))return{active:!1,holding:ut,x:0,z:0,dx:H,dy:O};const Zt=i(),Ut=H/st,N=O/st,yt=Zt.rightX*Ut+Zt.forwardX*-N,J=Zt.rightZ*Ut+Zt.forwardZ*-N,rt=Math.hypot(yt,J)||1;return{active:!0,holding:ut,x:yt/rt,z:J/rt,dx:H,dy:O}},sample(){var Z;const B=s();let st=o!==null?Math.max(-1,Math.min(1,c/B)):0,ut=o!==null?Math.max(-1,Math.min(1,h/B)):0,Gt=0,Zt=0;(Vt.has("a")||Vt.has("arrowleft"))&&(Gt-=1),(Vt.has("d")||Vt.has("arrowright"))&&(Gt+=1),(Vt.has("w")||Vt.has("arrowup"))&&(Zt-=1),(Vt.has("s")||Vt.has("arrowdown"))&&(Zt+=1),st+=Gt,ut+=Zt;let Ut=Math.hypot(st,ut);Ut>1&&(st/=Ut,ut/=Ut,Ut=1);const N=st,yt=ut;Ut<e&&(st=0,ut=0);const J=i();let rt=J.rightX*st+J.forwardX*-ut,St=J.rightZ*st+J.forwardZ*-ut;const wt=Math.hypot(rt,St);wt>1&&(rt/=wt,St/=wt);const Kt=performance.now();pt(ot.poll(Kt));const re=Math.hypot(H,O);z!==null&&(re>=i0?I=!0:re<br&&(I=!1));const ce=z!==null||mt>=0&&Kt-mt<Ch,ae=ce&&I&&re>=br;let we=0,xe=0;if(ae){const Rt=H/re,Tt=O/re,te=J.rightX*Rt+J.forwardX*-Tt,Jt=J.rightZ*Rt+J.forwardZ*-Tt,le=Math.hypot(te,Jt)||1;we=te/le,xe=Jt/le}!ce&&z===null&&(H=0,O=0,mt=-1,I=!1);const Ye=D;D=null;const Qe=Nt;Nt=1;const ye={moveX:rt,moveZ:St,jumpPressed:kt.jump,sprintHeld:ht.sprint||Vt.has("shift"),sprintPressed:kt.sprintPressed,resetPressed:kt.reset,attackPressed:kt.attackPressed,attackHeld:ht.attack||Vt.has("j"),attackReleased:kt.attackReleased,skill2Pressed:kt.skill2,weaponSlot:V,dummyClickId:ue,aimX:we,aimZ:xe,aimActive:ae};kt.jump=!1,kt.reset=!1,kt.sprintPressed=!1,kt.attackPressed=!1,kt.attackReleased=!1,kt.skill2=!1,V=0,ue=0;const ke=dt.map(Rt=>qm(Rt,J,Ph));dt=[],ke.length>0&&(et=ke[ke.length-1]);const Fe=o!==null?"pointer":Vt.size>0?"keyboard":"idle";return{intents:ye,stickX:st,stickY:ut,stickRawX:N,stickRawY:yt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:R,stickOriginSX:p,stickOriginSY:x,stickScreenX:_,stickScreenY:v,stickScale:b,stickVpTop:((Z=e0())==null?void 0:Z.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:H,aimDY:O,source:Fe,tap:Ye,zoomScale:Qe,gestures:ke,lastGesture:et}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",lt),window.removeEventListener("pointercancel",lt),window.removeEventListener("blur",Et),document.removeEventListener("visibilitychange",At),window.removeEventListener("keydown",Ct),window.removeEventListener("keyup",K),window.removeEventListener("wheel",ft),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),_t&&(_t.removeEventListener("resize",nt),_t.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Ft),ot.reset();for(const B of It)B()}}}const Uo=1,zo=2,No=4,Du=8,Oo=16,ms=32,ku=64,Iu=128,h0=[[Uo,"atk"],[zo,"dash"],[No,"link"],[Du,"air"],[Oo,"hurt"],[ms,"aim"],[ku,"spr"],[Iu,"chan"]];function ua(n){if(n===0)return"-";const t=h0.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const d0=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],u0=0,f0=15,Sr=19,p0=21,m0=22,g0=23,x0=24,qn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Mn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Un=n=>Math.round(n*180/Math.PI*10)/10,wr=Math.PI*2;function is(n){let t=n%wr;return t>Math.PI&&(t-=wr),t<-Math.PI&&(t+=wr),t}function v0(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Uo),n.dash.phase!=="idle"&&(e|=zo),n.playerLink.phase!=="idle"&&(e|=No),n.character.grounded||(e|=Du),n.playerHurt.type!=="none"&&(e|=Oo),t.intents.aimActive&&(e|=ms),n.character.sprinting&&(e|=ku),n.abilities.channeling&&(e|=Iu),e}function _0(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function y0(n){const t={sampleHz:n.sampleHz??qn.sampleHz,sampleCapacity:n.sampleCapacity??qn.sampleCapacity,eventCapacity:n.eventCapacity??qn.eventCapacity,anomalyCapacity:n.anomalyCapacity??qn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??qn.dirJumpDeg,aimDropDeg:n.aimDropDeg??qn.aimDropDeg,freezeMs:n.freezeMs??qn.freezeMs,freezeSpeed:n.freezeSpeed??qn.freezeSpeed,stickLostMs:n.stickLostMs??qn.stickLostMs,spikeMs:n.spikeMs??qn.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,y=-1,g=-1,p=0,x=-1e9,_=-1,v={},R=null,w=0,b=0,E=0,S=0;function M(L,k){const H=1/t.sampleHz,O=L[u0];O-c<H-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=O)}function P(L,k,H,O,I,X){const mt=v[L]??-1e9;if(k-mt<1.2)return;if(v[L]=k,L==="frameSpike"){let dt=0;for(const et of s)et.kind==="frameSpike"&&dt++;if(dt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ot=i.slice(-7);X&&(ot.length===0||ot[ot.length-1]!==X)&&(ot=[...ot.slice(-6),X]),s.push({kind:L,t:Mn(k),tick:H,ms:Math.round(O),detail:I,ctx:ot}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function F(L,k,H,O){a.length>=t.eventCapacity&&a.shift(),a.push({t:Mn(H),tick:O,k:L,d:k})}function D(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=L.tick;break}}function z(){const L=o,k=L.wallMs/1e3,H=L.gestures,O=ot=>Object.entries(H).filter(([dt])=>dt.endsWith(`.${ot}`)).reduce((dt,[,et])=>dt+et,0),I=[];if(I.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),I.push(`运行 ${k.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),I.push(`摇杆活跃 ${k>0?Math.round(L.stickActiveMs/1e3/k*100):0}% · 手势 按下 ${O("press")}（单击 ${O("tap")} / 双击 ${O("doubleTap")} / 拖拽 ${O("drag")} / 长按 ${O("longPress")} / 打断 ${O("cancel")} / 拖放 ${O("release")}）`),I.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),I.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),I.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ot of s.slice(-6)){I.push(`· ${ot.kind} @t${ot.t.toFixed(2)} tick${ot.tick} ${ot.ms>0?`${ot.ms}ms `:""}${ot.detail}`);const dt=ot.ctx.map(q=>String(q[f0])).join(" "),et=ot.ctx.map(q=>q[Sr]===""||q[Sr]==null?".":String(q[Sr])).join(" ");if(I.push(`  yaw ${dt}`),I.push(`  in  ${et}`),ot.kind==="stickJump"||ot.kind==="stickBad"||ot.kind==="stickLost"){const q=ot.ctx.map(j=>`${j[p0]},${j[m0]}`).join(" "),pt=ot.ctx.map(j=>`${j[g0]},${j[x0]}`).join(" ");I.push(`  o   ${q}`),I.push(`  p   ${pt}`)}}if(a.length>0){I.push("最近事件：");for(const ot of a.slice(-12))I.push(`  ${ot.t.toFixed(2)} ${ot.k} ${ot.d}`.trimEnd())}const X=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return I.push(`摇杆坐标源 ${X}${mt}`),I.push(`UA ${e.ua}`),I.join(`
`)}return{sample(L,k,H,O=0){o.frames++,k.stickHeld&&(k.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=O,o.wallMs+=H,H>o.dtMax&&(o.dtMax=H),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const I=L.time;if(l<0&&(l=I),E=I,S=L.tick,!r)return;const X=L.character,mt=Math.hypot(k.stickX,k.stickY),ot=Math.hypot(X.velocity.x,X.velocity.z);u=L.combat.weapon;const dt=v0(L,k),et=X.facing,pt=Math.hypot(k.intents.moveX,k.intents.moveZ)>.05?Math.atan2(k.intents.moveX,k.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=H);const j=[Mn(I),L.tick,Math.round(H*10)/10,Mn(k.stickX),Mn(k.stickY),Mn(k.stickRawX),Mn(k.stickRawY),k.stickHeld?1:0,k.source.slice(0,8),Mn(k.intents.moveX),Mn(k.intents.moveZ),Mn(X.position.x),Mn(X.position.z),Mn(X.velocity.x),Mn(X.velocity.z),Un(et),Un(X.bodyYaw),dt,Mn(X.stride),pt===null?"":Un(pt),k.stickId===null?"":k.stickId,Math.round(k.stickOriginX),Math.round(k.stickOriginY),Math.round(k.stickPxX),Math.round(k.stickPxY),k.stickBad,Math.round(k.stickVpTop),Math.round(k.stickOriginSX),Math.round(k.stickOriginSY),Math.round(k.stickScreenX),Math.round(k.stickScreenY),k.stickScreenOk?1:0,Math.round(k.stickScale*100)/100];M(j);const Mt=I*1e3<_;if(H>t.spikeMs&&!Mt&&I-l>.6&&(o.spikes++,P("frameSpike",I,L.tick,H,`dt ${H.toFixed(0)}ms fl=${ua(dt)}`,j)),h!==null&&!Mt){const Et=Math.abs(Un(is(et-h))),At=Math.abs(Un(is(X.moveYaw-f))),C=(d|dt)&(Uo|zo|No|Oo)|dt&ms,T=pt===null?null:Math.abs(Un(is(et-pt))),$=pt===null||h===null?null:Math.abs(Un(is(h-pt))),ct=T!==null&&$!==null&&T<$-.5,lt=(d&ms)!==0&&(dt&ms)===0&&pt===null,it=T!==null&&(T<=12||ct);Et>t.aimDropDeg&&lt?P("aimDrop",I,L.tick,0,`${Et.toFixed(0)}° @aim→none stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${ua(dt)}`,j):Et>t.dirJumpDeg&&C===0&&!lt&&(it?(o.inTurns++,Et>o.inTurnMax&&(o.inTurnMax=Et)):P("dirJump",I,L.tick,0,`${Et.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${Un(h)}→${Un(et)} in ${pt===null?".":Un(pt)}° mvΔ${At.toFixed(0)}° aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${ua(d)}→${ua(dt)}`,j))}const Ht=(dt&(Uo|zo|No|Oo))!==0,Nt=L.tick-x<30;mt>.35&&ot<t.freezeSpeed&&!Ht&&!Nt?(m<0&&(m=I),I-m>=t.freezeMs/1e3&&I>=y&&(P("moveFreeze",I,L.tick,(I-m)*1e3,`stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) v${ot.toFixed(2)} ${k.source} fl=${ua(dt)}`,j),y=I+1.5,m=-1)):m=-1,k.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=I),I-g>=t.stickLostMs/1e3&&(P("stickLost",I,L.tick,(I-g)*1e3,`raw(${k.stickRawX.toFixed(2)},${k.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ua(dt)}`,j),g=-1,p=0)):g=-1):(p=0,g=-1);const jt=k.stickScale>.2&&k.stickScale<5?k.stickScale:1,ht=k.stickScreenOk,kt=ht?k.stickScreenX/jt:k.stickPxX,V=ht?k.stickScreenY/jt:k.stickPxY,ue=ht?k.stickOriginSX/jt:k.stickOriginX,$t=ht?k.stickOriginSY/jt:k.stickOriginY,Vt=kt-ue,It=V-$t;if(k.stickHeld&&k.stickId!==null){const Et=R;if(Et&&Et.held&&Et.id===k.stickId){const At=Math.hypot(Et.dx,Et.dy),C=Math.hypot(Vt,It),T=Math.max(At,C),$=Math.hypot(kt-Et.cx,V-Et.cy),ct=Math.abs(Un(is(Math.atan2(It,Vt)-Math.atan2(Et.dy,Et.dx)))),lt=T*ct*Math.PI/180,it=Math.hypot(ue-Et.ox,$t-Et.oy);if(T>18&&ct>35&&$<Math.max(5,lt*.35)&&P("stickJump",I,L.tick,0,`Δ${ct.toFixed(0)}° 手指只动${$.toFixed(0)}px(弧长应${lt.toFixed(0)}px) o(${Math.round(Et.ox)},${Math.round(Et.oy)})→(${Math.round(ue)},${Math.round($t)}) 原点位移${it.toFixed(0)}px p(${Math.round(kt)},${Math.round(V)}) raw(${Math.round(Vt)},${Math.round(It)}) id${k.stickId} ${ht?"src=屏幕":"src=client"}`,j),ht&&Et.screenOk){const Ct=Math.hypot(k.stickPxX-Et.x,k.stickPxY-Et.y),K=Math.hypot((k.stickScreenX-Et.sx)/jt,(k.stickScreenY-Et.sy)/jt);w+=Ct-K,Math.abs(w)>20&&(P("stickDrift",I,L.tick,0,`client 相对屏幕漂移 ${w>0?"+":""}${w.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) screen(${Math.round(k.stickScreenX)},${Math.round(k.stickScreenY)})`,j),w=0)}}R={id:k.stickId,ox:ue,oy:$t,cx:kt,cy:V,x:k.stickPxX,y:k.stickPxY,sx:k.stickScreenX,sy:k.stickScreenY,dx:Vt,dy:It,held:!0,screenOk:ht}}else R=null,w=0;if(k.stickBad>b){const Et=k.stickBad-b;P("stickBad",I,L.tick,0,`拦截 ${Et} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${k.stickBad}）o(${Math.round(k.stickOriginX)},${Math.round(k.stickOriginY)}) p(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) id${k.stickId??"-"}`,j)}b=k.stickBad,h=et,f=X.moveYaw,d=dt},event(L,k){const H=_0(L);D(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||F(L.type,H,k,L.tick))},gesture(L){const k=`${L.button}.${L.kind}`;o.gestures[k]=(o.gestures[k]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&F(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,E,S)},suspend(L){_=E*1e3+L,m=-1,g=-1},setEnabled(L){r=L,L||(h=null,R=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,w=0,R=null,b=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,k=s.some(H=>L-H.t<8&&(H.kind==="dirJump"||H.kind==="aimDrop"||H.kind==="moveFreeze"||H.kind==="stickLost"||H.kind==="stickJump"||H.kind==="stickBad"||H.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:k,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:d0,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:z}}const M0={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},b0={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},S0={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:-.55,armRoll:.2,elbow:-.5,rootYaw:.55,bladePitch:.3,bladePitchOff:.25}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.75,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.9,armRoll:-.14,elbow:-.12,rootYaw:-.55,bladePitch:-.05,bladePitchOff:-.05}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.75,armRoll:-.16,elbow:-.5,rootYaw:-.55,bladePitch:.3,bladePitchOff:.25}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.6,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:-.35,armRoll:.16,elbow:-.12,rootYaw:.55,bladePitch:-.05,bladePitchOff:-.05}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.3}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.35}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:-.5,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-.45,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.7,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-.5,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-.85,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.55,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.75,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:.45,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.6,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.5,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:-.35,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.55,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:-.3,armRoll:.25,elbow:-.5,armLPitch:-1.1,armLYaw:.3,armLRoll:-.25,elbowL:-.5,bladePitch:.05,bladePitchOff:.05}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:-.55,armRoll:1.15,elbow:-.05,armLPitch:-1.55,armLYaw:.55,armLRoll:-1.15,elbowL:-.05,bladePitch:0,bladePitchOff:0}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:-.35,armRoll:.6,elbow:-.25,armLPitch:-1.3,armLYaw:.35,armLRoll:-.6,elbowL:-.25,bladePitch:.02,bladePitchOff:.02}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0}}]}}}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:8,minStep:.04,life:.09,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},w0={core:M0,scene:b0,view:S0};function Al(n){return JSON.parse(JSON.stringify(n))}const Rl=w0,E0=Al(Rl.core),Hs=Al(Rl.scene),dn=Al(Rl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ti{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),ti.nextNameID=ti.nextNameID||0,this.$name.id=`lil-gui-name-${++ti.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class T0 extends ti{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function wc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const A0={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:wc,toHexString:wc},ws={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},R0={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=ws.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return ws.toHexString(a)}},P0={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=ws.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return ws.toHexString(a)}},C0=[A0,ws,R0,P0];function L0(n){return C0.find(t=>t.match(n))}class D0 extends ti{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=L0(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=wc(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Er extends ti{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class k0 extends ti{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},a=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},s=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",y)},m=x=>{if(o){const _=x.clientX-r,v=x.clientY-l;Math.abs(v)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&y()}if(!o){const _=x.clientY-c;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",y)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,_,v,R)=>(p-x)/(_-x)*(R-v)+v,e=p=>{const x=this.$slider.getBoundingClientRect();let _=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,_=p.touches[0].clientY-l;Math.abs(x)>Math.abs(_)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let y;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class I0 extends ti{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class F0 extends ti{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const U0=`.lil-gui {
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
}`;function z0(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Lh=!1;class Bo{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Lh&&r&&(z0(U0),Lh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new I0(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new k0(this,t,e,i,a,s);case"boolean":return new T0(this,t,e);case"string":return new F0(this,t,e);case"function":return new Er(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new D0(this,t,e,i)}addFolder(t){const e=new Bo({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Er||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Er)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function N0(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Bo({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Bo({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=ft=>{const Ft=s.addFolder(ft);return l.push(Ft),Ft},h=(ft,Ft)=>{const nt=ft.addFolder(Ft);return r.push(nt),nt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,R=h(u,"假人 AI");R.add(v,"moveSpeed",.5,8,.1).name("移动速度"),R.add(v,"wanderRadius",.5,8,.1).name("游走半径"),R.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(v,"keepDistance",1,10,.1).name("保持距离"),R.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(v,"attackRange",.5,5,.1).name("攻击距离"),R.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const w=c("步态 / 停步"),b=h(w,"程序化步态");b.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),b.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),b.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),b.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),b.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),b.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),b.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),b.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),b.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),b.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),b.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),b.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),b.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),b.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),b.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),b.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const E=h(w,"停步收相 / 胸朝向");E.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),E.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),E.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),E.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),E.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const S=h(w,"停步惯性");S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(w,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(w,"足部 IK"),F=t.ik;P.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(F,"weight",0,1,.01).name("钉地权重"),P.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const D=h(w,"惯性倾斜 / 盆骨"),z=t.lean;D.add(z,"accelGain",0,.1,.002).name("前后加速度增益"),D.add(z,"turnGain",0,.2,.005).name("绕圈侧倾增益"),D.add(z,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),D.add(z,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),D.add(z,"smoothing",1,30,1).name("倾斜平滑速率"),D.add(z,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),D.add(z,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),D.add(z,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),D.add(z,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,k=h(w,"朝向 / 下盘带转");k.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const H=o.gaze,O=h(w,"接敌注视 / 俯仰 (v9s.18)");O.add(H,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),O.add(H,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),O.add(H,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),O.add(H,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),O.add(H,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),O.add(H,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),O.add(H,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),O.add(H,"headPitchRate",.5,20,.5).name("头部俯仰速率"),O.add(H,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),O.add(H,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),O.add(H,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const I=h(w,"原地转身 / 停步偏差 (v9s)"),X=o.turnInPlace;I.add(X,"enabled").name("启用原地转身 (关=纯插值)"),I.add(X,"triggerDeg",20,180,5).name("触发夹角 (°)"),I.add(X,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),I.add(X,"settleDeg",0,60,1).name("转身保留余角 (°)"),I.add(X,"durationSec",.1,1.5,.02).name("转身时长 (s)"),I.add(X,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),I.add(X,"inputDeadZone",0,.5,.01).name("起步输入死区"),I.add(X,"armSec",0,.5,.01).name("触发防抖 (s)"),I.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),I.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),I.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),I.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),I.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),I.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),ot=o.combat,dt=h(mt,"连击 / 武器"),et=dt.add(n.combat,"weapon",na).name("当前武器");dt.add(ot,"comboWindow",.1,2,.05).name("连击窗口 (s)"),dt.add(ot,"settle",0,.8,.01).name("段间停顿 (s)"),dt.add(ot,"attackMoveScale",0,1,.01).name("攻击时移动比例"),dt.add(ot,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),dt.add(ot,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),dt.add(ot,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),dt.add(ot,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),dt.add(ot,"cancelWindow",0,1,.01).name("取消窗口 (s)"),dt.add(ot,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),dt.add(ot,"autoCombo").name("按住自动连击"),dt.add(ot.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),dt.add(ot.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),dt.add(ot.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const q=h(mt,"夸张化 (v9s.22)"),pt=t.animation.stretch;q.add(pt,"enabled").name("四肢伸缩 开"),q.add(pt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),q.add(pt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),q.add(pt,"impactSquash",0,.5,.01).name("命中挤压量"),q.add(pt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),q.add(pt,"torsoGain",0,1,.05).name("躯干跟随比例"),q.add(pt,"volumeExp",0,1.5,.05).name("体积补偿指数");const j=t.animation.swing;q.add(j,"enabled").name("挥击身体幅度 开"),q.add(j,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),q.add(j,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),q.add(j,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),q.add(j,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),q.add(j,"segBlend",0,.35,.01).name("段间姿态过渡 (s)"),q.add(j.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const Mt=t.weaponTrail;q.add(Mt,"enabled").name("挥击刀光 开"),q.add(Mt,"life",.04,.4,.01).name("刀光残留 (s)"),q.add(Mt,"intensity",0,1.5,.05).name("刀光亮度"),q.add(Mt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),q.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),q.add(t.hitstop,"enabled").name("命中定格 开"),q.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const Ht=t.weaponWrist;q.add(Ht,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),q.add(Ht,"lag",0,.08,.002).name("臂速 → 腕滞后"),q.add(Ht,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),q.add(Ht,"rate",4,50,1).name("腕部跟随速率 (1/s)"),q.add(Ht,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),q.add(Ht,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const Nt=t.weaponMount;q.add(Nt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),q.add(Nt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),q.add(Nt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),q.add(Nt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),q.add(Nt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),q.add(Nt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),dt.add(ot.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),dt.add(ot.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),dt.add(ot.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),dt.add(ot.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),dt.add(ot.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),dt.add(ot.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),dt.add(ot.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),dt.add(ot.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),dt.add(ot.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),dt.add(ot.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const jt=o.abilities;dt.add(jt.arcane,"perWave",1,8,1).name("每波飞弹数"),dt.add(jt.arcane,"waves",1,12,1).name("每次引导波数"),dt.add(jt.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),dt.add(jt.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),dt.add(jt.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),dt.add(jt.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),dt.add(jt.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),dt.add(jt.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),dt.add(jt.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),dt.add(jt.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),dt.add(jt.arcane,"speed",3,24,.5).name("飞弹速度"),dt.add(jt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),dt.add(jt.ring,"radius",.5,5,.1).name("电环半径"),dt.add(jt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),dt.add(jt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ht=h(mt,"攻击动作 / 跨步 / 落地");ht.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),ht.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),ht.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const kt=t.animation.stride;ht.add(kt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),ht.add(kt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),ht.add(kt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),ht.add(kt,"cycles",1,3,1).name("每段跨步周期数"),ht.add(kt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),ht.add(kt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),ht.add(kt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),ht.add(kt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),ht.add(kt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),ht.add(kt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),ht.add(kt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),ht.add(kt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),ht.add(kt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),ht.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),ht.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),ht.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),ht.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),ht.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),ht.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),ht.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),ht.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),ht.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),ht.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),ht.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),ht.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const V=h(mt,"武器握持");V.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),V.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),V.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),V.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const ue=o.hits,$t=h(mt,"命中 / 受击 / 击退");$t.add(ue,"arcDeg",10,120,5).name("命中扇区半角 (°)"),$t.add(ue,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),$t.add(ue,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),$t.add(ue,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),$t.add(ue.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),$t.add(ue.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),$t.add(ue,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),$t.add(ue,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Vt=o.targeting,It=h(mt,"目标辅助");It.add(Vt,"targetAssist").name("启用目标辅助"),It.add(Vt,"range",1,14,.5).name("锁定范围 (m)"),It.add(Vt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),It.add(Vt,"frontBias",0,4,.1).name("朝向加权"),It.add(Vt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),It.add(Vt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Et=h(mt,"受击分层"),At=t.hurt;Et.add(At,"enabled").name("启用分层受击 (关=旧版对照)"),Et.add(At,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Et.add(At,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Et.add(At,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Et.add(At,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Et.add(At,"upperShiftScale",0,1,.01).name("上身位移缩放"),Et.add(At,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Et.add(At.hitHeight,"light",0,1,.01).name("轻击命中部位"),Et.add(At.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Et.add(At.hitHeight,"knock",0,1,.01).name("击退命中部位"),Et.add(At,"leanLight",0,1.5,.01).name("轻击力度"),Et.add(At,"leanHeavy",0,1.5,.01).name("重击力度"),Et.add(At,"leanKnock",0,1.5,.01).name("击退力度"),Et.add(At,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:At.abdomen},{name:"打肩 (shoulder)",p:At.shoulder}].map(({name:ft,p:Ft})=>{const nt=h(Et,ft);return nt.add(Ft,"upperPitch",0,2,.01).name("上身前后倾斜"),nt.add(Ft,"upperRoll",0,2,.01).name("上身侧倾"),nt.add(Ft,"upperYaw",0,1.5,.01).name("肩部扭转"),nt.add(Ft,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),nt.add(Ft,"shift",0,.8,.01).name("身体反应位移"),nt.add(Ft,"drop",0,.4,.01).name("整体下沉"),nt.add(Ft,"back",0,.4,.01).name("屁股向后"),nt.add(Ft,"knee",0,1.6,.01).name("屈膝"),nt.add(Ft,"hip",0,1,.01).name("髋前倾"),nt.add(Ft,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),nt});const C=h(mt,"派生招"),T=o.links;C.add(T,"enabled").name("总开关 (false=旧连击)"),C.add(T.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),C.add(T.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),C.add(T.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),C.add(T,"sharedCooldown",0,3,.05).name("共享 CD (s)"),C.add(T,"triggerWhileSprinting").name("长跑中可直接触发"),C.add(T.search,"range",1,14,.1).name("索敌距离 (m)"),C.add(T.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),C.add(T.search,"stopDistance",0,3,.05).name("停住距离 (m)");const $=T.moves["sword-shield"];$&&(C.add($,"enabled").name("剑盾盾击"),C.add($,"distance",0,8,.1).name("冲锋极限 (m)"),C.add($,"windup",0,.5,.01).name("前摇 (s)"),C.add($,"active",0,.8,.01).name("冲锋 / 命中 (s)"),C.add($,"recovery",0,.8,.01).name("收势 (s)"),C.add($.hit,"radius",0,4,.05).name("命中半径 (m)"),C.add($.hit,"width",0,2,.05).name("扫掠半径 (m)"),C.add($.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),C.add($.hit,"duration",0,1.5,.01).name("僵直 (s)")),C.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const ct=c("相机"),lt=h(ct,"基础");lt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),lt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),lt.add(t.camera,"distance",6,35,.5).name("距离"),lt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),lt.add(t.camera,"fov",25,90,1).name("FOV");const it=o.camera,Ct=h(ct,"智能构图");Ct.add(it,"radius",2,18,.5).name("威胁评估半径 (m)"),Ct.add(it,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Ct.add(it,"saturation",.5,8,.1).name("威胁归一化饱和"),Ct.add(it,"pushIn",0,.5,.01).name("无威胁推进比例"),Ct.add(it,"maxPullback",0,1,.02).name("最大拉远比例"),Ct.add(it,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Ct.add(it,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Ct.add(it,"framingBias",0,1,.05).name("威胁质心平移系数"),Ct.add(it,"attackBoost",0,2,.05).name("挥砍中额外加权"),Ct.add(it.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Ct.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const K=h(ct,"缩放");return K.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),K.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),K.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),K.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),K.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),K.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),K.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),K.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(ft=>ft.close()),l.forEach(ft=>ft.close()),s.close(),{gui:s,refreshWeapon:()=>et.updateDisplay()}}function O0(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function B0(n,t){return n.find(e=>e.id===t)??null}function Dh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function H0({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return O0(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[_,v]of l)v.classList.toggle("is-active",_===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):x&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(x=>x.index===g)??null:B0(n,g);return p?(Pm(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function y(){Au(t)}if(s){s.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),s.appendChild(g);for(const v of[...n].sort((R,w)=>R.index-w.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=v.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",v.color),R.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const w=document.createElement("span");w.className="lab-idx",w.textContent=String(v.index);const b=document.createElement("span");b.className="lab-name",b.textContent=v.name,R.append(w,b),R.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),m(v.id)}),s.appendChild(R),l.set(v.id,R)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),y()}),x.appendChild(_),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),a()}),x.appendChild(v)}s.appendChild(x)}return window.addEventListener("keydown",g=>{var p,x;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const _=Dh(n,((p=d())==null?void 0:p.id)??o,-1);_&&m(_.id)}else if(g.key==="]"){const _=Dh(n,((x=d())==null?void 0:x.id)??o,1);_&&m(_.id)}else g.key==="\\"&&y()}),u(),{goto:m,current:d,tick:u,recall:y,element:s}}const Tr=Math.PI*2,jn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},G0=45,V0=50;function X0(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function as(n,t,e){const i=X0(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function W0(n,t){return Math.atan2(n,-t)*180/Math.PI}function kh(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Gs(n){return(n%360+360)%360}const Y0={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function $0(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?as(s.moveX,s.moveZ,e):null,f=c>.15?as(l.x,l.z,e):null,d=as(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?as(s.aimX,s.aimZ,e):null,m=n.targeting,y=m.hasTarget?as(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?kh(h,f):null,p=h!==null?kh(h,d):null,x=g!==null&&g>G0&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?W0(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:x}}function Ih(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>V0&&(n.inLen>=.35||n.speed>=.4)}const Fh="harness.dirDebug";function Z0(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Fh)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(_){if(l=_,!t)try{window.localStorage.setItem(Fh,_?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=Y0,m=0,y="",g=8;function p(_){if(!r)return;const v=d,R=d,w=v/2,b=R/2,E=Math.min(v,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,R),r.beginPath(),r.arc(w,b,E,0,Tr),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":jn.ring,r.stroke(),r.strokeStyle=jn.grid,r.beginPath(),r.moveTo(w-E,b),r.lineTo(w+E,b),r.moveTo(w,b-E),r.lineTo(w,b+E),r.stroke();for(let F=0;F<8;F++){const D=F*Math.PI/4,z=w+Math.sin(D)*(E-3),L=b-Math.cos(D)*(E-3),k=w+Math.sin(D)*E,H=b-Math.cos(D)*E;r.beginPath(),r.moveTo(z,L),r.lineTo(k,H),r.stroke()}const S=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;S>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=jn.dead,r.beginPath(),r.arc(w,b,E*S,0,Tr),r.stroke(),r.restore());const M=(F,D,z,L,k=!1,H=1)=>{const O=F*Math.PI/180,I=Math.sin(O),X=-Math.cos(O),mt=E*Math.max(.14,Math.min(1,D)),ot=w+I*E*.14,dt=b+X*E*.14,et=w+I*mt,q=b+X*mt;if(r.save(),r.globalAlpha=H,r.strokeStyle=z,r.fillStyle=z,r.lineWidth=L,r.lineCap="round",k&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ot,dt),r.lineTo(et,q),r.stroke(),!k&&mt>E*.3){const pt=-X,j=I,Mt=5.2;r.beginPath(),r.moveTo(et+I*1.5,q+X*1.5),r.lineTo(et-I*Mt+pt*Mt*.72,q-X*Mt+j*Mt*.72),r.lineTo(et-I*Mt-pt*Mt*.72,q-X*Mt-j*Mt*.72),r.closePath(),r.fill()}r.restore()},P=(F,D)=>{const z=F*Math.PI/180,L=Math.sin(z),k=-Math.cos(z),H=-k,O=L,I=E+1.5,X=I+6.5;r.save(),r.fillStyle=D,r.strokeStyle=D,r.lineWidth=1,r.beginPath(),r.moveTo(w+L*X,b+k*X),r.lineTo(w+L*I+H*4,b+k*I+O*4),r.lineTo(w+L*I-H*4,b+k*I-O*4),r.closePath(),r.fill(),r.restore()};_.lockDeg!==null&&M(_.lockDeg,1,jn.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&M(_.rawDeg,_.rawLen,jn.raw,1,!0,.9),_.aimDeg!==null&&M(_.aimDeg,1,jn.aim,1.6,!0,.95),M(_.faceDeg,1,jn.face,1.1,!0,.55),_.moveDeg!==null&&M(_.moveDeg,_.speed/Math.max(1,g),jn.move,5.5,!1,.8),_.inDeg!==null&&M(_.inDeg,_.inLen,jn.input,2.2),P(_.faceDeg,jn.face),r.beginPath(),r.arc(w,b,2.2,0,Tr),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(_,v){const R=E=>E===null?"-":String(Math.round(Gs(E)));o.in.textContent=`入 ${R(_.inDeg)}`,o.mv.textContent=`移 ${R(_.moveDeg)}`,o.fc.textContent=`面 ${R(_.faceDeg)}`;const w=E=>E===null?"-":`${Math.round(E)}°`,b=[`Δ入→移 ${w(_.gapMove)}`,`Δ入→面 ${w(_.gapFace)}`];_.speed>.05&&b.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&b.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&b.push("拖拽瞄准"),o.gap.textContent=b.join("  "),e.classList.toggle("is-warn",_.warnMove||Ih(_,v))}return{update(_,v,R){if(!l)return;g=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const w=$0(_,v,R,g);u=w;const b=_.combat.phase!=="idle";p(w);const E=performance.now(),S=`${w.inDeg}|${w.moveDeg}|${w.faceDeg}|${w.lockId}|${w.aimDeg}|${w.warnMove}|${w.speed.toFixed(1)}`;(E-m>90||S!==y)&&(m=E,y=S,x(w,b),e.dataset.in=w.inDeg===null?"":Gs(w.inDeg).toFixed(1),e.dataset.mv=w.moveDeg===null?"":Gs(w.moveDeg).toFixed(1),e.dataset.fc=Gs(w.faceDeg).toFixed(1),e.dataset.warn=w.warnMove||Ih(w,b)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const q0=6,j0=480,Uh=240,zh=92,K0=18;function J0(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function Q0(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function tg(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function eg(n={}){const t=Math.max(1,n.windowS??q0),e=Math.max(60,n.capacity??j0),i=Math.max(1,n.speedCap??K0),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Uh*u),l.height=Math.round(zh*u);const m=Z0({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function g(E){y=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(!y)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&g(!y)}));const p=[];let x=0,_=null,v=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function w(E){const S=E-t;let M=0;for(;M<p.length&&p[M].t<S;)M++;return p.slice(M)}function b(E,S){if(!d)return;const M=Uh,P=zh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,P);const F=4,D=4,z=M-F-D,L=9,k=46,H=62,O=22,I=S-t,X=j=>F+Math.max(0,Math.min(1,(j-I)/t))*z;for(let j=0;j<E.length;j++){if(!E[j].busy)continue;const Mt=X(E[j].t),Ht=j+1<E.length?X(E[j+1].t):Mt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Mt,L,Math.max(2,Ht-Mt),k)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const j of[L,L+k/2,L+k])d.moveTo(F,j),d.lineTo(M-D,j);d.moveTo(F,H+O/2),d.lineTo(M-D,H+O/2),d.stroke();const ot=Math.max(1,...E.map(j=>j.speed),...E.map(j=>j.drive))*1.15,dt=j=>L+k-j/ot*k;if(E.length>1){d.beginPath(),d.moveTo(X(E[0].t),dt(E[0].speed));for(let j=1;j<E.length;j++)d.lineTo(X(E[j].t),dt(E[j].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(X(E[E.length-1].t),L+k),d.lineTo(X(E[0].t),L+k),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(X(E[0].t),dt(E[0].drive));for(let j=1;j<E.length;j++)d.lineTo(X(E[j].t),dt(E[j].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let et=.02;for(const j of E)et=Math.max(et,Math.abs(j.dv));et*=1.1;const q=H+O/2,pt=O/2;for(const j of E){const Mt=Math.min(pt,Math.abs(j.dv)/et*pt);d.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(X(j.t)-.7,j.dv>=0?q-Mt:q,1.4,Math.max(.5,Mt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ot.toFixed(1),F+2,L+8),d.fillText("v",F+2,L+k-2),d.fillText("Δv",F+2,H+9),d.textAlign="right",d.fillText("0",M-D-2,L+k-2),d.textAlign="left"}return{dirDebug:m,update(E,S,M){const P=performance.now()/1e3,F=v<0?1/60:Math.max(1e-4,Math.min(.25,P-v));v=P;const D=E.character,z={x:D.position.x,z:D.position.z},L=Math.hypot(D.velocity.x,D.velocity.z),{speed:k,raw:H}=_?Q0(_,z,F,i):{speed:0,raw:0},O=J0(x,k,F,P);O.drive=L,O.raw=H,O.busy=tg(E),_=z,x=k,p.push(O),p.length>e&&p.shift();const I=w(P);let X=0;for(const mt of I)X=Math.max(X,mt.speed);if(R={speed:k,drive:L,raw:H,dv:O.dv,accel:O.accel,peak:X,samples:I.length,windowS:t,busy:O.busy},m.update(E,S,M),y){b(I,P);const mt=O.dv>=0?"+":"";c.textContent=`v ${k.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${X.toFixed(2)} · Δv ${mt}${O.dv.toFixed(3)} · ${I.length} 帧`}},setEnabled:g,toggle(){return g(!y),y},enabled:()=>y,last:()=>({...R}),samples:()=>w(performance.now()/1e3).map(E=>({...E}))}}const ng=["剑盾","双剑","大剑","法杖","弓"],ig={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function ag(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=ht=>ht.toFixed(2),m=ht=>(ht*180/Math.PI).toFixed(0),y=ng[na.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,R=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",w=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),b=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),E=Math.abs(w)+Math.abs(b)+1e-6,S=Math.round(Math.abs(b)/E*100),M=`strafe ${S}%${w<-.05?" back":""}`,P=t.camera,F=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,D=o?u(o.attackBlend):"-",z=o==null?void 0:o.attackWeights,L=z?`gw ${u(z.gaitScale)}  lw ${u(z.attackLegWeight)}  spd ${u(z.driveSpeed)}`:"-",k=z?`${u(z.gaitScale)}/${u(z.attackLegWeight)}`:"-",H=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",O=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",I=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",X=o==null?void 0:o.hurt,mt=X?`hurt ${t.playerHurt.type}  部位h${u(X.hitHeight)}  脉冲p${u(X.pulse)}  上身${u(X.upperShift)}  重心${u(X.comShift)}  后坐${u(X.pelvisBack)}  屈膝${u(X.knee)}`:"-",ot=X?`${u(X.hitHeight)}/${u(X.pulse)}/${u(X.knee)}`:"-",dt=o==null?void 0:o.ik,et=dt?`${dt.active?"on":"off"} w${u(dt.weight)} e${u(dt.maxError)}`:"-",q=t.playerLink,pt=`link ${q.kind||"-"}  ${q.phase}  prog ${u(q.progress)}  win ${u(q.linkWindow)}s  cd ${u(q.cooldown)}s  hits ${q.hitIds.length}  travel ${u(q.travelled)}/${u(q.travel)}m  id ${q.id}`,j=`${q.phase}/${q.kind||"-"}/w${u(q.linkWindow)}`,Mt=a.lastGesture,Ht=Mt?`${Mt.button} ${Mt.kind} ${Mt.heldMs.toFixed(0)}ms d${Mt.distance.toFixed(0)}px ${Mt.angleDeg.toFixed(0)}° taps${Mt.taps}`:"-",Nt=t.dummies.map(ht=>`${ht.id}:${ig[ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${q.phase}${q.kind?`/${q.kind}`:""} w${u(q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${S}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${D}  gw/lw ${k}  land ${O}  ik ${et}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ot}`,`dummies ${Nt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${I}  lk ${j}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Ht}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${D}   ${L}   land ${H}`,mt,`ik ${et}  clamped ${dt?dt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${R}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,pt,`camera ${F}  ${I}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Nt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Ht}`].join(`
`)}}}const Vs=["lab","hud","motion","debug"],Nh={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Oh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function sg(n){var l;const t=Object.fromEntries(Vs.map(c=>[c,document.getElementById(Oh[c].toggle)])),e=Object.fromEntries(Vs.map(c=>[c,document.getElementById(Oh[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of Vs){const u=a===d,m=t[d],y=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${Nh[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${Nh[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Vs)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pl="170",og=0,Bh=1,rg=2,Fu=1,Uu=2,ui=3,Di=0,bn=1,Be=2,Ci=0,Ua=1,Ei=2,Hh=3,Gh=4,cg=5,Ki=100,lg=101,hg=102,dg=103,ug=104,fg=200,pg=201,mg=202,gg=203,Ec=204,Tc=205,xg=206,vg=207,_g=208,yg=209,Mg=210,bg=211,Sg=212,wg=213,Eg=214,Ac=0,Rc=1,Pc=2,Ha=3,Cc=4,Lc=5,Dc=6,kc=7,Cl=0,Tg=1,Ag=2,Li=0,Rg=1,Pg=2,Cg=3,Lg=4,Dg=5,kg=6,Ig=7,zu=300,Ga=301,Va=302,Ic=303,Fc=304,Ko=306,Uc=1e3,Qi=1001,zc=1002,Gn=1003,Fg=1004,Xs=1005,Qn=1006,Ar=1007,ta=1008,xi=1009,Nu=1010,Ou=1011,Es=1012,Ll=1013,ia=1014,pi=1015,ks=1016,Dl=1017,kl=1018,Xa=1020,Bu=35902,Hu=1021,Gu=1022,Hn=1023,Vu=1024,Xu=1025,za=1026,Wa=1027,Wu=1028,Il=1029,Yu=1030,Fl=1031,Ul=1033,wo=33776,Eo=33777,To=33778,Ao=33779,Nc=35840,Oc=35841,Bc=35842,Hc=35843,Gc=36196,Vc=37492,Xc=37496,Wc=37808,Yc=37809,$c=37810,Zc=37811,qc=37812,jc=37813,Kc=37814,Jc=37815,Qc=37816,tl=37817,el=37818,nl=37819,il=37820,al=37821,Ro=36492,sl=36494,ol=36495,$u=36283,rl=36284,cl=36285,ll=36286,Ug=3200,zg=3201,Zu=0,Ng=1,Ti="",vn="srgb",$a="srgb-linear",Jo="linear",Le="srgb",fa=7680,Vh=519,Og=512,Bg=513,Hg=514,qu=515,Gg=516,Vg=517,Xg=518,Wg=519,hl=35044,Xh=35048,Wh="300 es",mi=2e3,Ho=2001;class Za{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yh=1234567;const Na=Math.PI/180,Ts=180/Math.PI;function ei(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[t&255]+un[t>>8&255]+"-"+un[t>>16&15|64]+un[t>>24&255]+"-"+un[e&63|128]+un[e>>8&255]+"-"+un[e>>16&255]+un[e>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function rn(n,t,e){return Math.max(t,Math.min(e,n))}function zl(n,t){return(n%t+t)%t}function Yg(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function $g(n,t,e){return n!==t?(e-n)/(t-n):0}function gs(n,t,e){return(1-e)*n+e*t}function Zg(n,t,e,i){return gs(n,t,1-Math.exp(-e*i))}function qg(n,t=1){return t-Math.abs(zl(n,t*2)-t)}function jg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Kg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Jg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Qg(n,t){return n+Math.random()*(t-n)}function tx(n){return n*(.5-Math.random())}function ex(n){n!==void 0&&(Yh=n);let t=Yh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function nx(n){return n*Na}function ix(n){return n*Ts}function ax(n){return(n&n-1)===0&&n!==0}function sx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ox(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function rx(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Bn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ae(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const $h={DEG2RAD:Na,RAD2DEG:Ts,generateUUID:ei,clamp:rn,euclideanModulo:zl,mapLinear:Yg,inverseLerp:$g,lerp:gs,damp:Zg,pingpong:qg,smoothstep:jg,smootherstep:Kg,randInt:Jg,randFloat:Qg,randFloatSpread:tx,seededRandom:ex,degToRad:nx,radToDeg:ix,isPowerOfTwo:ax,ceilPowerOfTwo:sx,floorPowerOfTwo:ox,setQuaternionFromProperEuler:rx,normalize:Ae,denormalize:Bn};class Yt{constructor(t=0,e=0){Yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(rn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class fe{constructor(t,e,i,a,s,o,r,l,c){fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],y=a[0],g=a[3],p=a[6],x=a[1],_=a[4],v=a[7],R=a[2],w=a[5],b=a[8];return s[0]=o*y+r*x+l*R,s[3]=o*g+r*_+l*w,s[6]=o*p+r*v+l*b,s[1]=c*y+h*x+f*R,s[4]=c*g+h*_+f*w,s[7]=c*p+h*v+f*b,s[2]=d*y+u*x+m*R,s[5]=d*g+u*_+m*w,s[8]=d*p+u*v+m*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,m=e*f+i*d+a*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/m;return t[0]=f*y,t[1]=(a*c-h*i)*y,t[2]=(r*i-a*o)*y,t[3]=d*y,t[4]=(h*e-a*l)*y,t[5]=(a*s-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Rr.makeScale(t,e)),this}rotate(t){return this.premultiply(Rr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Rr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Rr=new fe;function ju(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Go(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function cx(){const n=Go("canvas");return n.style.display="block",n}const Zh={};function fs(n){n in Zh||(Zh[n]=!0,console.warn(n))}function lx(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function hx(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function dx(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const _e={enabled:!0,workingColorSpace:$a,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Le&&(n.r=gi(n.r),n.g=gi(n.g),n.b=gi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Le&&(n.r=Oa(n.r),n.g=Oa(n.g),n.b=Oa(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ti?Jo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function gi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Oa(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const qh=[.64,.33,.3,.6,.15,.06],jh=[.2126,.7152,.0722],Kh=[.3127,.329],Jh=new fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qh=new fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);_e.define({[$a]:{primaries:qh,whitePoint:Kh,transfer:Jo,toXYZ:Jh,fromXYZ:Qh,luminanceCoefficients:jh,workingColorSpaceConfig:{unpackColorSpace:vn},outputColorSpaceConfig:{drawingBufferColorSpace:vn}},[vn]:{primaries:qh,whitePoint:Kh,transfer:Le,toXYZ:Jh,fromXYZ:Qh,luminanceCoefficients:jh,outputColorSpaceConfig:{drawingBufferColorSpace:vn}}});let pa;class ux{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{pa===void 0&&(pa=Go("canvas")),pa.width=t.width,pa.height=t.height;const i=pa.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=pa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Go("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=gi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(gi(e[i]/255)*255):e[i]=gi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let fx=0;class Ku{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:fx++}),this.uuid=ei(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Pr(a[o].image)):s.push(Pr(a[o]))}else s=Pr(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Pr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ux.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let px=0;class yn extends Za{constructor(t=yn.DEFAULT_IMAGE,e=yn.DEFAULT_MAPPING,i=Qi,a=Qi,s=Qn,o=ta,r=Hn,l=xi,c=yn.DEFAULT_ANISOTROPY,h=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:px++}),this.uuid=ei(),this.name="",this.source=new Ku(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==zu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Uc:t.x=t.x-Math.floor(t.x);break;case Qi:t.x=t.x<0?0:1;break;case zc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Uc:t.y=t.y-Math.floor(t.y);break;case Qi:t.y=t.y<0?0:1;break;case zc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=zu;yn.DEFAULT_ANISOTROPY=1;class We{constructor(t=0,e=0,i=0,a=1){We.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,v=(u+1)/2,R=(p+1)/2,w=(h+d)/4,b=(f+y)/4,E=(m+g)/4;return _>v&&_>R?_<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(_),a=w/i,s=b/i):v>R?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=w/a,s=E/a):R<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(R),i=b/s,a=E/s),this.set(i,a,s,e),this}let x=Math.sqrt((g-m)*(g-m)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(f-y)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class mx extends Za{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new We(0,0,t,e),this.scissorTest=!1,this.viewport=new We(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new yn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ku(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class aa extends mx{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ju extends yn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class gx extends yn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Is{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],m=s[o+2],y=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*y,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const R=Math.sqrt(_),w=Math.atan2(R,p*x);g=Math.sin(g*w)/R,r=Math.sin(r*w)/R}const v=r*x;if(l=l*g+d*v,c=c*g+u*v,h=h*g+m*v,f=f*g+y*v,g===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],m=s[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(rn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(td.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(td.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Cr.copy(this).projectOnVector(t),this.sub(Cr)}reflect(t){return this.sub(Cr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(rn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Cr=new G,td=new Is;class Fs{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,zn):zn.fromBufferAttribute(s,o),zn.applyMatrix4(t.matrixWorld),this.expandByPoint(zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ws.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ws.copy(i.boundingBox)),Ws.applyMatrix4(t.matrixWorld),this.union(Ws)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,zn),zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ss),Ys.subVectors(this.max,ss),ma.subVectors(t.a,ss),ga.subVectors(t.b,ss),xa.subVectors(t.c,ss),_i.subVectors(ga,ma),yi.subVectors(xa,ga),Oi.subVectors(ma,xa);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-Oi.z,Oi.y,_i.z,0,-_i.x,yi.z,0,-yi.x,Oi.z,0,-Oi.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-Oi.y,Oi.x,0];return!Lr(e,ma,ga,xa,Ys)||(e=[1,0,0,0,1,0,0,0,1],!Lr(e,ma,ga,xa,Ys))?!1:($s.crossVectors(_i,yi),e=[$s.x,$s.y,$s.z],Lr(e,ma,ga,xa,Ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const oi=[new G,new G,new G,new G,new G,new G,new G,new G],zn=new G,Ws=new Fs,ma=new G,ga=new G,xa=new G,_i=new G,yi=new G,Oi=new G,ss=new G,Ys=new G,$s=new G,Bi=new G;function Lr(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Bi.fromArray(n,s);const r=a.x*Math.abs(Bi.x)+a.y*Math.abs(Bi.y)+a.z*Math.abs(Bi.z),l=t.dot(Bi),c=e.dot(Bi),h=i.dot(Bi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const xx=new Fs,os=new G,Dr=new G;class Qo{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):xx.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;os.subVectors(t,this.center);const e=os.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(os,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Dr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(os.copy(t.center).add(Dr)),this.expandByPoint(os.copy(t.center).sub(Dr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ri=new G,kr=new G,Zs=new G,Mi=new G,Ir=new G,qs=new G,Fr=new G;class Nl{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ri.copy(this.origin).addScaledVector(this.direction,e),ri.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){kr.copy(t).add(e).multiplyScalar(.5),Zs.copy(e).sub(t).normalize(),Mi.copy(this.origin).sub(kr);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Zs),r=Mi.dot(this.direction),l=-Mi.dot(Zs),c=Mi.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=s*h,f>=0)if(d>=-m)if(d<=m){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(kr).addScaledVector(Zs,d),u}intersectSphere(t,e){ri.subVectors(t.center,this.origin);const i=ri.dot(this.direction),a=ri.dot(ri)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,ri)!==null}intersectTriangle(t,e,i,a,s){Ir.subVectors(e,t),qs.subVectors(i,t),Fr.crossVectors(Ir,qs);let o=this.direction.dot(Fr),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Mi.subVectors(this.origin,t);const l=r*this.direction.dot(qs.crossVectors(Mi,qs));if(l<0)return null;const c=r*this.direction.dot(Ir.cross(Mi));if(c<0||l+c>o)return null;const h=-r*Mi.dot(Fr);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ie{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g){Ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,y,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ie().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/va.setFromMatrixColumn(t,0).length(),s=1/va.setFromMatrixColumn(t,1).length(),o=1/va.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d+y*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,y=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(vx,t,_x)}lookAt(t,e,i){const a=this.elements;return wn.subVectors(t,e),wn.lengthSq()===0&&(wn.z=1),wn.normalize(),bi.crossVectors(i,wn),bi.lengthSq()===0&&(Math.abs(i.z)===1?wn.x+=1e-4:wn.z+=1e-4,wn.normalize(),bi.crossVectors(i,wn)),bi.normalize(),js.crossVectors(wn,bi),a[0]=bi.x,a[4]=js.x,a[8]=wn.x,a[1]=bi.y,a[5]=js.y,a[9]=wn.y,a[2]=bi.z,a[6]=js.z,a[10]=wn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],y=i[6],g=i[10],p=i[14],x=i[3],_=i[7],v=i[11],R=i[15],w=a[0],b=a[4],E=a[8],S=a[12],M=a[1],P=a[5],F=a[9],D=a[13],z=a[2],L=a[6],k=a[10],H=a[14],O=a[3],I=a[7],X=a[11],mt=a[15];return s[0]=o*w+r*M+l*z+c*O,s[4]=o*b+r*P+l*L+c*I,s[8]=o*E+r*F+l*k+c*X,s[12]=o*S+r*D+l*H+c*mt,s[1]=h*w+f*M+d*z+u*O,s[5]=h*b+f*P+d*L+u*I,s[9]=h*E+f*F+d*k+u*X,s[13]=h*S+f*D+d*H+u*mt,s[2]=m*w+y*M+g*z+p*O,s[6]=m*b+y*P+g*L+p*I,s[10]=m*E+y*F+g*k+p*X,s[14]=m*S+y*D+g*H+p*mt,s[3]=x*w+_*M+v*z+R*O,s[7]=x*b+_*P+v*L+R*I,s[11]=x*E+_*F+v*k+R*X,s[15]=x*S+_*D+v*H+R*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],y=t[7],g=t[11],p=t[15];return m*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+y*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+g*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],y=t[13],g=t[14],p=t[15],x=f*g*c-y*d*c+y*l*u-r*g*u-f*l*p+r*d*p,_=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,v=h*y*c-m*f*c+m*r*u-o*y*u-h*r*p+o*f*p,R=m*f*l-h*y*l-m*r*d+o*y*d+h*r*g-o*f*g,w=e*x+i*_+a*v+s*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/w;return t[0]=x*b,t[1]=(y*d*s-f*g*s-y*a*u+i*g*u+f*a*p-i*d*p)*b,t[2]=(r*g*s-y*l*s+y*a*c-i*g*c-r*a*p+i*l*p)*b,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*b,t[4]=_*b,t[5]=(h*g*s-m*d*s+m*a*u-e*g*u-h*a*p+e*d*p)*b,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*b,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*b,t[8]=v*b,t[9]=(m*f*s-h*y*s-m*i*u+e*y*u+h*i*p-e*f*p)*b,t[10]=(o*y*s-m*r*s+m*i*c-e*y*c-o*i*p+e*r*p)*b,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*b,t[12]=R*b,t[13]=(h*y*a-m*f*a+m*i*d-e*y*d-h*i*g+e*f*g)*b,t[14]=(m*r*a-o*y*a-m*i*l+e*y*l+o*i*g-e*r*g)*b,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*b,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,m=s*f,y=o*h,g=o*f,p=r*f,x=l*c,_=l*h,v=l*f,R=i.x,w=i.y,b=i.z;return a[0]=(1-(y+p))*R,a[1]=(u+v)*R,a[2]=(m-_)*R,a[3]=0,a[4]=(u-v)*w,a[5]=(1-(d+p))*w,a[6]=(g+x)*w,a[7]=0,a[8]=(m+_)*b,a[9]=(g-x)*b,a[10]=(1-(d+y))*b,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=va.set(a[0],a[1],a[2]).length();const o=va.set(a[4],a[5],a[6]).length(),r=va.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Nn.copy(this);const c=1/s,h=1/o,f=1/r;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=h,Nn.elements[5]*=h,Nn.elements[6]*=h,Nn.elements[8]*=f,Nn.elements[9]*=f,Nn.elements[10]*=f,e.setFromRotationMatrix(Nn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=mi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,m;if(r===mi)u=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===Ho)u=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=mi){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let m,y;if(r===mi)m=(o+s)*f,y=-2*f;else if(r===Ho)m=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const va=new G,Nn=new Ie,vx=new G(0,0,0),_x=new G(1,1,1),bi=new G,js=new G,wn=new G,ed=new Ie,nd=new Is;class ni{constructor(t=0,e=0,i=0,a=ni.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(rn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(rn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-rn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(rn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-rn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ed.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ed,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return nd.setFromEuler(this),this.setFromQuaternion(nd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ni.DEFAULT_ORDER="XYZ";class Ol{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let yx=0;const id=new G,_a=new Is,ci=new Ie,Ks=new G,rs=new G,Mx=new G,bx=new Is,ad=new G(1,0,0),sd=new G(0,1,0),od=new G(0,0,1),rd={type:"added"},Sx={type:"removed"},ya={type:"childadded",child:null},Ur={type:"childremoved",child:null};class Ve extends Za{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yx++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ve.DEFAULT_UP.clone();const t=new G,e=new ni,i=new Is,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ie},normalMatrix:{value:new fe}}),this.matrix=new Ie,this.matrixWorld=new Ie,this.matrixAutoUpdate=Ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _a.setFromAxisAngle(t,e),this.quaternion.multiply(_a),this}rotateOnWorldAxis(t,e){return _a.setFromAxisAngle(t,e),this.quaternion.premultiply(_a),this}rotateX(t){return this.rotateOnAxis(ad,t)}rotateY(t){return this.rotateOnAxis(sd,t)}rotateZ(t){return this.rotateOnAxis(od,t)}translateOnAxis(t,e){return id.copy(t).applyQuaternion(this.quaternion),this.position.add(id.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ad,t)}translateY(t){return this.translateOnAxis(sd,t)}translateZ(t){return this.translateOnAxis(od,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ks.copy(t):Ks.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(rs,Ks,this.up):ci.lookAt(Ks,rs,this.up),this.quaternion.setFromRotationMatrix(ci),a&&(ci.extractRotation(a.matrixWorld),_a.setFromRotationMatrix(ci),this.quaternion.premultiply(_a.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(rd),ya.child=t,this.dispatchEvent(ya),ya.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Sx),Ur.child=t,this.dispatchEvent(Ur),Ur.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ci.multiply(t.parent.matrixWorld)),t.applyMatrix4(ci),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(rd),ya.child=t,this.dispatchEvent(ya),ya.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,t,Mx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,bx,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ve.DEFAULT_UP=new G(0,1,0);Ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const On=new G,li=new G,zr=new G,hi=new G,Ma=new G,ba=new G,cd=new G,Nr=new G,Or=new G,Br=new G,Hr=new We,Gr=new We,Vr=new We;class Rn{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),On.subVectors(t,e),a.cross(On);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){On.subVectors(a,e),li.subVectors(i,e),zr.subVectors(t,e);const o=On.dot(On),r=On.dot(li),l=On.dot(zr),c=li.dot(li),h=li.dot(zr),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-u-m,m,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,hi.x),l.addScaledVector(o,hi.y),l.addScaledVector(r,hi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Hr.setScalar(0),Gr.setScalar(0),Vr.setScalar(0),Hr.fromBufferAttribute(t,e),Gr.fromBufferAttribute(t,i),Vr.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Hr,s.x),o.addScaledVector(Gr,s.y),o.addScaledVector(Vr,s.z),o}static isFrontFacing(t,e,i,a){return On.subVectors(i,e),li.subVectors(t,e),On.cross(li).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return On.subVectors(this.c,this.b),li.subVectors(this.a,this.b),On.cross(li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Rn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ma.subVectors(a,i),ba.subVectors(s,i),Nr.subVectors(t,i);const l=Ma.dot(Nr),c=ba.dot(Nr);if(l<=0&&c<=0)return e.copy(i);Or.subVectors(t,a);const h=Ma.dot(Or),f=ba.dot(Or);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ma,o);Br.subVectors(t,s);const u=Ma.dot(Br),m=ba.dot(Br);if(m>=0&&u<=m)return e.copy(s);const y=u*c-l*m;if(y<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(ba,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return cd.subVectors(s,a),r=(f-h)/(f-h+(u-m)),e.copy(a).addScaledVector(cd,r);const p=1/(g+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(Ma,o).addScaledVector(ba,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Js={h:0,s:0,l:0};function Xr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ie{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=vn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,_e.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=_e.workingColorSpace){return this.r=t,this.g=e,this.b=i,_e.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=_e.workingColorSpace){if(t=zl(t,1),e=rn(e,0,1),i=rn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Xr(o,s,t+1/3),this.g=Xr(o,s,t),this.b=Xr(o,s,t-1/3)}return _e.toWorkingColorSpace(this,a),this}setStyle(t,e=vn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=vn){const i=Qu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gi(t.r),this.g=gi(t.g),this.b=gi(t.b),this}copyLinearToSRGB(t){return this.r=Oa(t.r),this.g=Oa(t.g),this.b=Oa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=vn){return _e.fromWorkingColorSpace(fn.copy(this),t),Math.round(rn(fn.r*255,0,255))*65536+Math.round(rn(fn.g*255,0,255))*256+Math.round(rn(fn.b*255,0,255))}getHexString(t=vn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=_e.workingColorSpace){_e.fromWorkingColorSpace(fn.copy(this),e);const i=fn.r,a=fn.g,s=fn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=_e.workingColorSpace){return _e.fromWorkingColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=vn){_e.fromWorkingColorSpace(fn.copy(this),t);const e=fn.r,i=fn.g,a=fn.b;return t!==vn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Si),this.setHSL(Si.h+t,Si.s+e,Si.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Si),t.getHSL(Js);const i=gs(Si.h,Js.h,e),a=gs(Si.s,Js.s,e),s=gs(Si.l,Js.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const fn=new ie;ie.NAMES=Qu;let wx=0;class oa extends Za{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wx++}),this.uuid=ei(),this.name="",this.blending=Ua,this.side=Di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ec,this.blendDst=Tc,this.blendEquation=Ki,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=Ha,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fa,this.stencilZFail=fa,this.stencilZPass=fa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ua&&(i.blending=this.blending),this.side!==Di&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ec&&(i.blendSrc=this.blendSrc),this.blendDst!==Tc&&(i.blendDst=this.blendDst),this.blendEquation!==Ki&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ha&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class tn extends oa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const je=new G,Qs=new Yt;class cn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=hl,this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Qs.fromBufferAttribute(this,e),Qs.applyMatrix3(t),this.setXY(e,Qs.x,Qs.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyMatrix3(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyMatrix4(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyNormalMatrix(t),this.setXYZ(e,je.x,je.y,je.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.transformDirection(t),this.setXYZ(e,je.x,je.y,je.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Bn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ae(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),a=Ae(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),a=Ae(a,this.array),s=Ae(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==hl&&(t.usage=this.usage),t}}class tf extends cn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class ef extends cn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Te extends cn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Ex=0;const Pn=new Ie,Wr=new Ve,Sa=new G,En=new Fs,cs=new Fs,an=new G;class Je extends Za{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ex++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ju(t)?ef:tf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new fe().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Pn.makeRotationFromQuaternion(t),this.applyMatrix4(Pn),this}rotateX(t){return Pn.makeRotationX(t),this.applyMatrix4(Pn),this}rotateY(t){return Pn.makeRotationY(t),this.applyMatrix4(Pn),this}rotateZ(t){return Pn.makeRotationZ(t),this.applyMatrix4(Pn),this}translate(t,e,i){return Pn.makeTranslation(t,e,i),this.applyMatrix4(Pn),this}scale(t,e,i){return Pn.makeScale(t,e,i),this.applyMatrix4(Pn),this}lookAt(t){return Wr.lookAt(t),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Sa).negate(),this.translate(Sa.x,Sa.y,Sa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Te(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];En.setFromBufferAttribute(s),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(En.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];cs.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(En.min,cs.min),En.expandByPoint(an),an.addVectors(En.max,cs.max),En.expandByPoint(an)):(En.expandByPoint(cs.min),En.expandByPoint(cs.max))}En.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)an.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(an));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)an.fromBufferAttribute(r,c),l&&(Sa.fromBufferAttribute(t,c),an.add(Sa)),a=Math.max(a,i.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new cn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new G,l[E]=new G;const c=new G,h=new G,f=new G,d=new Yt,u=new Yt,m=new Yt,y=new G,g=new G;function p(E,S,M){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,S),f.fromBufferAttribute(i,M),d.fromBufferAttribute(s,E),u.fromBufferAttribute(s,S),m.fromBufferAttribute(s,M),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const P=1/(u.x*m.y-m.x*u.y);isFinite(P)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(P),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(P),r[E].add(y),r[S].add(y),r[M].add(y),l[E].add(g),l[S].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let E=0,S=x.length;E<S;++E){const M=x[E],P=M.start,F=M.count;for(let D=P,z=P+F;D<z;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const _=new G,v=new G,R=new G,w=new G;function b(E){R.fromBufferAttribute(a,E),w.copy(R);const S=r[E];_.copy(S),_.sub(R.multiplyScalar(R.dot(S))).normalize(),v.crossVectors(w,S);const P=v.dot(l[E])<0?-1:1;o.setXYZW(E,_.x,_.y,_.z,P)}for(let E=0,S=x.length;E<S;++E){const M=x[E],P=M.start,F=M.count;for(let D=P,z=P+F;D<z;D+=3)b(t.getX(D+0)),b(t.getX(D+1)),b(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new cn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new G,s=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),y=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,y),o.fromBufferAttribute(e,g),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)an.fromBufferAttribute(t,e),an.normalize(),t.setXYZ(e,an.x,an.y,an.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let y=0,g=l.length;y<g;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new cn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ld=new Ie,Hi=new Nl,to=new Qo,hd=new G,eo=new G,no=new G,io=new G,Yr=new G,ao=new G,dd=new G,so=new G;class ge extends Ve{constructor(t=new Je,e=new tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){ao.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(Yr.fromBufferAttribute(f,t),o?ao.addScaledVector(Yr,h):ao.addScaledVector(Yr.sub(e),h))}e.add(ao)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),to.copy(i.boundingSphere),to.applyMatrix4(s),Hi.copy(t.ray).recast(t.near),!(to.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(to,hd)===null||Hi.origin.distanceToSquared(hd)>(t.far-t.near)**2))&&(ld.copy(s).invert(),Hi.copy(t.ray).applyMatrix4(ld),!(i.boundingBox!==null&&Hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Hi)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,R=_;v<R;v+=3){const w=r.getX(v),b=r.getX(v+1),E=r.getX(v+2);a=oo(this,p,t,i,c,h,f,w,b,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const x=r.getX(g),_=r.getX(g+1),v=r.getX(g+2);a=oo(this,o,t,i,c,h,f,x,_,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,y=d.length;m<y;m++){const g=d[m],p=o[g.materialIndex],x=Math.max(g.start,u.start),_=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=x,R=_;v<R;v+=3){const w=v,b=v+1,E=v+2;a=oo(this,p,t,i,c,h,f,w,b,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let g=m,p=y;g<p;g+=3){const x=g,_=g+1,v=g+2;a=oo(this,o,t,i,c,h,f,x,_,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function Tx(n,t,e,i,a,s,o,r){let l;if(t.side===bn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Di,r),l===null)return null;so.copy(r),so.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(so);return c<e.near||c>e.far?null:{distance:c,point:so.clone(),object:n}}function oo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,eo),n.getVertexPosition(l,no),n.getVertexPosition(c,io);const h=Tx(n,t,e,i,eo,no,io,dd);if(h){const f=new G;Rn.getBarycoord(dd,eo,no,io,f),a&&(h.uv=Rn.getInterpolatedAttribute(a,r,l,c,f,new Yt)),s&&(h.uv1=Rn.getInterpolatedAttribute(s,r,l,c,f,new Yt)),o&&(h.normal=Rn.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Rn.getNormal(eo,no,io,d.normal),h.face=d,h.barycoord=f}return h}class Vn extends Je{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Te(c,3)),this.setAttribute("normal",new Te(h,3)),this.setAttribute("uv",new Te(f,2));function m(y,g,p,x,_,v,R,w,b,E,S){const M=v/b,P=R/E,F=v/2,D=R/2,z=w/2,L=b+1,k=E+1;let H=0,O=0;const I=new G;for(let X=0;X<k;X++){const mt=X*P-D;for(let ot=0;ot<L;ot++){const dt=ot*M-F;I[y]=dt*x,I[g]=mt*_,I[p]=z,c.push(I.x,I.y,I.z),I[y]=0,I[g]=0,I[p]=w>0?1:-1,h.push(I.x,I.y,I.z),f.push(ot/b),f.push(1-X/E),H+=1}}for(let X=0;X<E;X++)for(let mt=0;mt<b;mt++){const ot=d+mt+L*X,dt=d+mt+L*(X+1),et=d+(mt+1)+L*(X+1),q=d+(mt+1)+L*X;l.push(ot,dt,q),l.push(dt,et,q),O+=6}r.addGroup(u,O,S),u+=O,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ya(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function xn(n){const t={};for(let e=0;e<n.length;e++){const i=Ya(n[e]);for(const a in i)t[a]=i[a]}return t}function Ax(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function nf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:_e.workingColorSpace}const Rx={clone:Ya,merge:xn};var Px=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Cx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends oa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Px,this.fragmentShader=Cx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ya(t.uniforms),this.uniformsGroups=Ax(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class af extends Ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ie,this.projectionMatrix=new Ie,this.projectionMatrixInverse=new Ie,this.coordinateSystem=mi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const wi=new G,ud=new Yt,fd=new Yt;class Ln extends af{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ts*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Na*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ts*2*Math.atan(Math.tan(Na*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(wi.x,wi.y).multiplyScalar(-t/wi.z),wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(wi.x,wi.y).multiplyScalar(-t/wi.z)}getViewSize(t,e){return this.getViewBounds(t,ud,fd),e.subVectors(fd,ud)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Na*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const wa=-90,Ea=1;class Lx extends Ve{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Ln(wa,Ea,t,e);a.layers=this.layers,this.add(a);const s=new Ln(wa,Ea,t,e);s.layers=this.layers,this.add(s);const o=new Ln(wa,Ea,t,e);o.layers=this.layers,this.add(o);const r=new Ln(wa,Ea,t,e);r.layers=this.layers,this.add(r);const l=new Ln(wa,Ea,t,e);l.layers=this.layers,this.add(l);const c=new Ln(wa,Ea,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===mi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ho)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class sf extends yn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ga,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Dx extends aa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new sf(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Qn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Vn(5,5,5),s=new ki({name:"CubemapFromEquirect",uniforms:Ya(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:bn,blending:Ci});s.uniforms.tEquirect.value=e;const o=new ge(a,s),r=e.minFilter;return e.minFilter===ta&&(e.minFilter=Qn),new Lx(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const $r=new G,kx=new G,Ix=new fe;class Zi{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=$r.subVectors(i,e).cross(kx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta($r),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Ix.getNormalMatrix(t),a=this.coplanarPoint($r).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gi=new Qo,ro=new G;class Bl{constructor(t=new Zi,e=new Zi,i=new Zi,a=new Zi,s=new Zi,o=new Zi){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=mi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],m=a[9],y=a[10],g=a[11],p=a[12],x=a[13],_=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-u,v-p).normalize(),i[1].setComponents(l+s,d+c,g+u,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+x).normalize(),i[3].setComponents(l-o,d-h,g-m,v-x).normalize(),i[4].setComponents(l-r,d-f,g-y,v-_).normalize(),e===mi)i[5].setComponents(l+r,d+f,g+y,v+_).normalize();else if(e===Ho)i[5].setComponents(r,f,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Gi)}intersectsSprite(t){return Gi.center.set(0,0,0),Gi.radius=.7071067811865476,Gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Gi)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(ro.x=a.normal.x>0?t.max.x:t.min.x,ro.y=a.normal.y>0?t.max.y:t.min.y,ro.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(ro)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function of(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Fx(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],y=f[u];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Cn extends Je{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],y=[],g=[];for(let p=0;p<h;p++){const x=p*d-o;for(let _=0;_<c;_++){const v=_*f-s;m.push(v,-x,0),y.push(0,0,1),g.push(_/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<r;x++){const _=x+c*p,v=x+c*(p+1),R=x+1+c*(p+1),w=x+1+c*p;u.push(_,v,w),u.push(v,R,w)}this.setIndex(u),this.setAttribute("position",new Te(m,3)),this.setAttribute("normal",new Te(y,3)),this.setAttribute("uv",new Te(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Ux=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zx=`#ifdef USE_ALPHAHASH
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
#endif`,Nx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ox=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gx=`#ifdef USE_AOMAP
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
#endif`,Vx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xx=`#ifdef USE_BATCHING
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
#endif`,Wx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$x=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qx=`#ifdef USE_IRIDESCENCE
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
#endif`,jx=`#ifdef USE_BUMPMAP
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
#endif`,Kx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Jx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ev=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,iv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,av=`#if defined( USE_COLOR_ALPHA )
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
#endif`,sv=`#define PI 3.141592653589793
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
} // validated`,ov=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rv=`vec3 transformedNormal = objectNormal;
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
#endif`,cv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,lv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uv="gl_FragColor = linearToOutputTexel( gl_FragColor );",fv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pv=`#ifdef USE_ENVMAP
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
#endif`,mv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,gv=`#ifdef USE_ENVMAP
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
#endif`,xv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vv=`#ifdef USE_ENVMAP
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
#endif`,_v=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sv=`#ifdef USE_GRADIENTMAP
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
}`,wv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ev=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Tv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Av=`uniform bool receiveShadow;
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
#endif`,Rv=`#ifdef USE_ENVMAP
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
#endif`,Pv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Cv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kv=`PhysicalMaterial material;
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
#endif`,Iv=`struct PhysicalMaterial {
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
}`,Fv=`
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
#endif`,Uv=`#if defined( RE_IndirectDiffuse )
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
#endif`,zv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ov=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wv=`#if defined( USE_POINTS_UV )
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
#endif`,Yv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$v=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,qv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kv=`#ifdef USE_MORPHTARGETS
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
#endif`,Jv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,t_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,e_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,n_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,a_=`#ifdef USE_NORMALMAP
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
#endif`,s_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,o_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,r_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,l_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,h_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,u_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,f_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,p_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,m_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,g_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,v_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,__=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,y_=`float getShadowMask() {
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
}`,M_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,b_=`#ifdef USE_SKINNING
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
#endif`,S_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,w_=`#ifdef USE_SKINNING
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
#endif`,E_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,T_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,A_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,R_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,P_=`#ifdef USE_TRANSMISSION
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
#endif`,C_=`#ifdef USE_TRANSMISSION
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
#endif`,L_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,k_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const F_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,U_=`uniform sampler2D t2D;
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
}`,z_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,O_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H_=`#include <common>
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
}`,G_=`#if DEPTH_PACKING == 3200
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
}`,V_=`#define DISTANCE
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
}`,X_=`#define DISTANCE
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
}`,W_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$_=`uniform float scale;
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
}`,Z_=`uniform vec3 diffuse;
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
}`,q_=`#include <common>
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
}`,j_=`uniform vec3 diffuse;
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
}`,K_=`#define LAMBERT
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
}`,J_=`#define LAMBERT
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
}`,Q_=`#define MATCAP
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
}`,ty=`#define MATCAP
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
}`,ey=`#define NORMAL
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
}`,ny=`#define NORMAL
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
}`,iy=`#define PHONG
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
}`,ay=`#define PHONG
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
}`,sy=`#define STANDARD
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
}`,oy=`#define STANDARD
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
}`,ry=`#define TOON
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
}`,cy=`#define TOON
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
}`,ly=`uniform float size;
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
}`,hy=`uniform vec3 diffuse;
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
}`,dy=`#include <common>
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
}`,uy=`uniform vec3 color;
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
}`,fy=`uniform float rotation;
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
}`,py=`uniform vec3 diffuse;
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
}`,pe={alphahash_fragment:Ux,alphahash_pars_fragment:zx,alphamap_fragment:Nx,alphamap_pars_fragment:Ox,alphatest_fragment:Bx,alphatest_pars_fragment:Hx,aomap_fragment:Gx,aomap_pars_fragment:Vx,batching_pars_vertex:Xx,batching_vertex:Wx,begin_vertex:Yx,beginnormal_vertex:$x,bsdfs:Zx,iridescence_fragment:qx,bumpmap_pars_fragment:jx,clipping_planes_fragment:Kx,clipping_planes_pars_fragment:Jx,clipping_planes_pars_vertex:Qx,clipping_planes_vertex:tv,color_fragment:ev,color_pars_fragment:nv,color_pars_vertex:iv,color_vertex:av,common:sv,cube_uv_reflection_fragment:ov,defaultnormal_vertex:rv,displacementmap_pars_vertex:cv,displacementmap_vertex:lv,emissivemap_fragment:hv,emissivemap_pars_fragment:dv,colorspace_fragment:uv,colorspace_pars_fragment:fv,envmap_fragment:pv,envmap_common_pars_fragment:mv,envmap_pars_fragment:gv,envmap_pars_vertex:xv,envmap_physical_pars_fragment:Rv,envmap_vertex:vv,fog_vertex:_v,fog_pars_vertex:yv,fog_fragment:Mv,fog_pars_fragment:bv,gradientmap_pars_fragment:Sv,lightmap_pars_fragment:wv,lights_lambert_fragment:Ev,lights_lambert_pars_fragment:Tv,lights_pars_begin:Av,lights_toon_fragment:Pv,lights_toon_pars_fragment:Cv,lights_phong_fragment:Lv,lights_phong_pars_fragment:Dv,lights_physical_fragment:kv,lights_physical_pars_fragment:Iv,lights_fragment_begin:Fv,lights_fragment_maps:Uv,lights_fragment_end:zv,logdepthbuf_fragment:Nv,logdepthbuf_pars_fragment:Ov,logdepthbuf_pars_vertex:Bv,logdepthbuf_vertex:Hv,map_fragment:Gv,map_pars_fragment:Vv,map_particle_fragment:Xv,map_particle_pars_fragment:Wv,metalnessmap_fragment:Yv,metalnessmap_pars_fragment:$v,morphinstance_vertex:Zv,morphcolor_vertex:qv,morphnormal_vertex:jv,morphtarget_pars_vertex:Kv,morphtarget_vertex:Jv,normal_fragment_begin:Qv,normal_fragment_maps:t_,normal_pars_fragment:e_,normal_pars_vertex:n_,normal_vertex:i_,normalmap_pars_fragment:a_,clearcoat_normal_fragment_begin:s_,clearcoat_normal_fragment_maps:o_,clearcoat_pars_fragment:r_,iridescence_pars_fragment:c_,opaque_fragment:l_,packing:h_,premultiplied_alpha_fragment:d_,project_vertex:u_,dithering_fragment:f_,dithering_pars_fragment:p_,roughnessmap_fragment:m_,roughnessmap_pars_fragment:g_,shadowmap_pars_fragment:x_,shadowmap_pars_vertex:v_,shadowmap_vertex:__,shadowmask_pars_fragment:y_,skinbase_vertex:M_,skinning_pars_vertex:b_,skinning_vertex:S_,skinnormal_vertex:w_,specularmap_fragment:E_,specularmap_pars_fragment:T_,tonemapping_fragment:A_,tonemapping_pars_fragment:R_,transmission_fragment:P_,transmission_pars_fragment:C_,uv_pars_fragment:L_,uv_pars_vertex:D_,uv_vertex:k_,worldpos_vertex:I_,background_vert:F_,background_frag:U_,backgroundCube_vert:z_,backgroundCube_frag:N_,cube_vert:O_,cube_frag:B_,depth_vert:H_,depth_frag:G_,distanceRGBA_vert:V_,distanceRGBA_frag:X_,equirect_vert:W_,equirect_frag:Y_,linedashed_vert:$_,linedashed_frag:Z_,meshbasic_vert:q_,meshbasic_frag:j_,meshlambert_vert:K_,meshlambert_frag:J_,meshmatcap_vert:Q_,meshmatcap_frag:ty,meshnormal_vert:ey,meshnormal_frag:ny,meshphong_vert:iy,meshphong_frag:ay,meshphysical_vert:sy,meshphysical_frag:oy,meshtoon_vert:ry,meshtoon_frag:cy,points_vert:ly,points_frag:hy,shadow_vert:dy,shadow_frag:uy,sprite_vert:fy,sprite_frag:py},zt={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new fe},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new fe}},envmap:{envMap:{value:null},envMapRotation:{value:new fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new fe},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0},uvTransform:{value:new fe}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new fe},alphaMap:{value:null},alphaMapTransform:{value:new fe},alphaTest:{value:0}}},Jn={basic:{uniforms:xn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.fog]),vertexShader:pe.meshbasic_vert,fragmentShader:pe.meshbasic_frag},lambert:{uniforms:xn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new ie(0)}}]),vertexShader:pe.meshlambert_vert,fragmentShader:pe.meshlambert_frag},phong:{uniforms:xn([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:pe.meshphong_vert,fragmentShader:pe.meshphong_frag},standard:{uniforms:xn([zt.common,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.roughnessmap,zt.metalnessmap,zt.fog,zt.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag},toon:{uniforms:xn([zt.common,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.gradientmap,zt.fog,zt.lights,{emissive:{value:new ie(0)}}]),vertexShader:pe.meshtoon_vert,fragmentShader:pe.meshtoon_frag},matcap:{uniforms:xn([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,{matcap:{value:null}}]),vertexShader:pe.meshmatcap_vert,fragmentShader:pe.meshmatcap_frag},points:{uniforms:xn([zt.points,zt.fog]),vertexShader:pe.points_vert,fragmentShader:pe.points_frag},dashed:{uniforms:xn([zt.common,zt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:pe.linedashed_vert,fragmentShader:pe.linedashed_frag},depth:{uniforms:xn([zt.common,zt.displacementmap]),vertexShader:pe.depth_vert,fragmentShader:pe.depth_frag},normal:{uniforms:xn([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,{opacity:{value:1}}]),vertexShader:pe.meshnormal_vert,fragmentShader:pe.meshnormal_frag},sprite:{uniforms:xn([zt.sprite,zt.fog]),vertexShader:pe.sprite_vert,fragmentShader:pe.sprite_frag},background:{uniforms:{uvTransform:{value:new fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:pe.background_vert,fragmentShader:pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new fe}},vertexShader:pe.backgroundCube_vert,fragmentShader:pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:pe.cube_vert,fragmentShader:pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:pe.equirect_vert,fragmentShader:pe.equirect_frag},distanceRGBA:{uniforms:xn([zt.common,zt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:pe.distanceRGBA_vert,fragmentShader:pe.distanceRGBA_frag},shadow:{uniforms:xn([zt.lights,zt.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:pe.shadow_vert,fragmentShader:pe.shadow_frag}};Jn.physical={uniforms:xn([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new fe},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new fe},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new fe},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new fe},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new fe},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new fe}}]),vertexShader:pe.meshphysical_vert,fragmentShader:pe.meshphysical_frag};const co={r:0,b:0,g:0},Vi=new ni,my=new Ie;function gy(n,t,e,i,a,s,o){const r=new ie(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function m(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function y(x){let _=!1;const v=m(x);v===null?p(r,l):v&&v.isColor&&(p(v,1),_=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(x,_){const v=m(_);v&&(v.isCubeTexture||v.mapping===Ko)?(h===void 0&&(h=new ge(new Vn(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:Ya(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),Vi.copy(_.backgroundRotation),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(my.makeRotationFromEuler(Vi)),h.material.toneMapped=_e.getTransfer(v.colorSpace)!==Le,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ge(new Cn(2,2),new ki({name:"BackgroundMaterial",uniforms:Ya(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=_e.getTransfer(v.colorSpace)!==Le,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,_){x.getRGB(co,nf(n)),i.buffers.color.setClear(co.r,co.g,co.b,_,o)}return{getClearColor:function(){return r},setClearColor:function(x,_=1){r.set(x),l=_,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(r,l)},render:y,addToRenderList:g}}function xy(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,P,F,D,z){let L=!1;const k=f(D,F,P);s!==k&&(s=k,c(s.object)),L=u(M,D,F,z),L&&m(M,D,F,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(M,P,F,D),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,P,F){const D=F.wireframe===!0;let z=i[M.id];z===void 0&&(z={},i[M.id]=z);let L=z[P.id];L===void 0&&(L={},z[P.id]=L);let k=L[D];return k===void 0&&(k=d(l()),L[D]=k),k}function d(M){const P=[],F=[],D=[];for(let z=0;z<e;z++)P[z]=0,F[z]=0,D[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:D,object:M,attributes:{},index:null}}function u(M,P,F,D){const z=s.attributes,L=P.attributes;let k=0;const H=F.getAttributes();for(const O in H)if(H[O].location>=0){const X=z[O];let mt=L[O];if(mt===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),X===void 0||X.attribute!==mt||mt&&X.data!==mt.data)return!0;k++}return s.attributesNum!==k||s.index!==D}function m(M,P,F,D){const z={},L=P.attributes;let k=0;const H=F.getAttributes();for(const O in H)if(H[O].location>=0){let X=L[O];X===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(X=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(X=M.instanceColor));const mt={};mt.attribute=X,X&&X.data&&(mt.data=X.data),z[O]=mt,k++}s.attributes=z,s.attributesNum=k,s.index=D}function y(){const M=s.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const F=s.newAttributes,D=s.enabledAttributes,z=s.attributeDivisors;F[M]=1,D[M]===0&&(n.enableVertexAttribArray(M),D[M]=1),z[M]!==P&&(n.vertexAttribDivisor(M,P),z[M]=P)}function x(){const M=s.newAttributes,P=s.enabledAttributes;for(let F=0,D=P.length;F<D;F++)P[F]!==M[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function _(M,P,F,D,z,L,k){k===!0?n.vertexAttribIPointer(M,P,F,z,L):n.vertexAttribPointer(M,P,F,D,z,L)}function v(M,P,F,D){y();const z=D.attributes,L=F.getAttributes(),k=P.defaultAttributeValues;for(const H in L){const O=L[H];if(O.location>=0){let I=z[H];if(I===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(I=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(I=M.instanceColor)),I!==void 0){const X=I.normalized,mt=I.itemSize,ot=t.get(I);if(ot===void 0)continue;const dt=ot.buffer,et=ot.type,q=ot.bytesPerElement,pt=et===n.INT||et===n.UNSIGNED_INT||I.gpuType===Ll;if(I.isInterleavedBufferAttribute){const j=I.data,Mt=j.stride,Ht=I.offset;if(j.isInstancedInterleavedBuffer){for(let Nt=0;Nt<O.locationSize;Nt++)p(O.location+Nt,j.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Nt=0;Nt<O.locationSize;Nt++)g(O.location+Nt);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Nt=0;Nt<O.locationSize;Nt++)_(O.location+Nt,mt/O.locationSize,et,X,Mt*q,(Ht+mt/O.locationSize*Nt)*q,pt)}else{if(I.isInstancedBufferAttribute){for(let j=0;j<O.locationSize;j++)p(O.location+j,I.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=I.meshPerAttribute*I.count)}else for(let j=0;j<O.locationSize;j++)g(O.location+j);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let j=0;j<O.locationSize;j++)_(O.location+j,mt/O.locationSize,et,X,mt*q,mt/O.locationSize*j*q,pt)}}else if(k!==void 0){const X=k[H];if(X!==void 0)switch(X.length){case 2:n.vertexAttrib2fv(O.location,X);break;case 3:n.vertexAttrib3fv(O.location,X);break;case 4:n.vertexAttrib4fv(O.location,X);break;default:n.vertexAttrib1fv(O.location,X)}}}}x()}function R(){E();for(const M in i){const P=i[M];for(const F in P){const D=P[F];for(const z in D)h(D[z].object),delete D[z];delete P[F]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const F in P){const D=P[F];for(const z in D)h(D[z].object),delete D[z];delete P[F]}delete i[M.id]}function b(M){for(const P in i){const F=i[P];if(F[M.id]===void 0)continue;const D=F[M.id];for(const z in D)h(D[z].object),delete D[z];delete F[M.id]}}function E(){S(),o=!0,s!==a&&(s=a,c(s.object))}function S(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:b,initAttributes:y,enableAttribute:g,disableUnusedAttributes:x}}function vy(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let y=0;y<f;y++)m+=h[y]*d[y];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function _y(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(b){return!(b!==Hn&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(b){const E=b===ks&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==xi&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==pi&&!E)}function l(b){if(b==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=m>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:R,maxSamples:w}}function yy(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Zi,r=new fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,y=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const x=s?0:i,_=x*4;let v=p.clippingState||null;l.value=v,v=h(m,d,_,u);for(let R=0;R!==_;++R)v[R]=e[R];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const y=f!==null?f.length:0;let g=null;if(y!==0){if(g=l.value,m!==!0||g===null){const p=u+y*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,v=u;_!==y;++_,v+=4)o.copy(f[_]).applyMatrix4(x,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,g}}function My(n){let t=new WeakMap;function e(o,r){return r===Ic?o.mapping=Ga:r===Fc&&(o.mapping=Va),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Ic||r===Fc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Dx(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class rf extends af{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ka=4,pd=[.125,.215,.35,.446,.526,.582],Ji=20,Zr=new rf,md=new ie;let qr=null,jr=0,Kr=0,Jr=!1;const qi=(1+Math.sqrt(5))/2,Ta=1/qi,gd=[new G(-qi,Ta,0),new G(qi,Ta,0),new G(-Ta,0,qi),new G(Ta,0,qi),new G(0,qi,-Ta),new G(0,qi,Ta),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class xd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){qr=this._renderer.getRenderTarget(),jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_d(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(qr,jr,Kr),this._renderer.xr.enabled=Jr,t.scissorTest=!1,lo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ga||t.mapping===Va?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),qr=this._renderer.getRenderTarget(),jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Jr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:ks,format:Hn,colorSpace:$a,depthBuffer:!1},a=vd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vd(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=by(s)),this._blurMaterial=Sy(s,t,e)}return a}_compileMaterial(t){const e=new ge(this._lodPlanes[0],t);this._renderer.compile(e,Zr)}_sceneToCubeUV(t,e,i,a){const r=new Ln(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(md),h.toneMapping=Li,h.autoClear=!1;const u=new tn({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1}),m=new ge(new Vn,u);let y=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,y=!0):(u.color.copy(md),y=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):x===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const _=this._cubeSize;lo(a,x*_,p>2?_:0,_,_),h.setRenderTarget(a),y&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Ga||t.mapping===Va;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=yd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_d());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new ge(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;lo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Zr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=gd[(a-s-1)%gd.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ge(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*Ji-1),y=s/m,g=isFinite(s)?1+Math.floor(h*y):Ji;g>Ji&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ji}`);const p=[];let x=0;for(let b=0;b<Ji;++b){const E=b/y,S=Math.exp(-E*E/2);p.push(S),b===0?x+=S:b<g&&(x+=2*S)}for(let b=0;b<p.length;b++)p[b]=p[b]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-i;const v=this._sizeLods[a],R=3*v*(a>_-ka?a-_+ka:0),w=4*(this._cubeSize-v);lo(e,R,w,3*v,2*v),l.setRenderTarget(e),l.render(f,Zr)}}function by(n){const t=[],e=[],i=[];let a=n;const s=n-ka+1+pd.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-ka?l=pd[o-n+ka-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,y=3,g=2,p=1,x=new Float32Array(y*m*u),_=new Float32Array(g*m*u),v=new Float32Array(p*m*u);for(let w=0;w<u;w++){const b=w%3*2/3-1,E=w>2?0:-1,S=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];x.set(S,y*m*w),_.set(d,g*m*w);const M=[w,w,w,w,w,w];v.set(M,p*m*w)}const R=new Je;R.setAttribute("position",new cn(x,y)),R.setAttribute("uv",new cn(_,g)),R.setAttribute("faceIndex",new cn(v,p)),t.push(R),a>ka&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function vd(n,t,e){const i=new aa(n,t,e);return i.texture.mapping=Ko,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function lo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function Sy(n,t,e){const i=new Float32Array(Ji),a=new G(0,1,0);return new ki({name:"SphericalGaussianBlur",defines:{n:Ji,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function _d(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function yd(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ci,depthTest:!1,depthWrite:!1})}function Hl(){return`

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
	`}function wy(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Ic||l===Fc,h=l===Ga||l===Va;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new xd(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new xd(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Ey(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&fs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function Ty(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const y=d.morphAttributes[m];for(let g=0,p=y.length;g<p;g++)t.remove(y[g])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const y=u[m];for(let g=0,p=y.length;g<p;g++)t.update(y[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let y=0;if(u!==null){const x=u.array;y=u.version;for(let _=0,v=x.length;_<v;_+=3){const R=x[_+0],w=x[_+1],b=x[_+2];d.push(R,w,w,b,b,R)}}else if(m!==void 0){const x=m.array;y=m.version;for(let _=0,v=x.length/3-1;_<v;_+=3){const R=_+0,w=_+1,b=_+2;d.push(R,w,w,b,b,R)}}else return;const g=new(ju(d)?ef:tf)(d,1);g.version=y;const p=s.get(f);p&&t.remove(p),s.set(f,g)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function Ay(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,s,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,y){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,y,0,m);let p=0;for(let x=0;x<m;x++)p+=u[x]*y[x];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Ry(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function Py(n,t,e){const i=new WeakMap,a=new We;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),y===!0&&(v=2),g===!0&&(v=3);let R=r.attributes.position.count*v,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const b=new Float32Array(R*w*4*f),E=new Ju(b,R,w,f);E.type=pi,E.needsUpdate=!0;const S=v*4;for(let P=0;P<f;P++){const F=p[P],D=x[P],z=_[P],L=R*w*4*P;for(let k=0;k<F.count;k++){const H=k*S;m===!0&&(a.fromBufferAttribute(F,k),b[L+H+0]=a.x,b[L+H+1]=a.y,b[L+H+2]=a.z,b[L+H+3]=0),y===!0&&(a.fromBufferAttribute(D,k),b[L+H+4]=a.x,b[L+H+5]=a.y,b[L+H+6]=a.z,b[L+H+7]=0),g===!0&&(a.fromBufferAttribute(z,k),b[L+H+8]=a.x,b[L+H+9]=a.y,b[L+H+10]=a.z,b[L+H+11]=z.itemSize===4?a.w:1)}}d={count:f,texture:E,size:new Yt(R,w)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const y=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function Cy(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class cf extends yn{constructor(t,e,i,a,s,o,r,l,c,h=za){if(h!==za&&h!==Wa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===za&&(i=ia),i===void 0&&h===Wa&&(i=Xa),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Gn,this.minFilter=l!==void 0?l:Gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const lf=new yn,Md=new cf(1,1),hf=new Ju,df=new gx,uf=new sf,bd=[],Sd=[],wd=new Float32Array(16),Ed=new Float32Array(9),Td=new Float32Array(4);function qa(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=bd[a];if(s===void 0&&(s=new Float32Array(a),bd[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function en(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function nn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function tr(n,t){let e=Sd[t];e===void 0&&(e=new Int32Array(t),Sd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Ly(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Dy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2fv(this.addr,t),nn(e,t)}}function ky(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(en(e,t))return;n.uniform3fv(this.addr,t),nn(e,t)}}function Iy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4fv(this.addr,t),nn(e,t)}}function Fy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;Td.set(i),n.uniformMatrix2fv(this.addr,!1,Td),nn(e,i)}}function Uy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;Ed.set(i),n.uniformMatrix3fv(this.addr,!1,Ed),nn(e,i)}}function zy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;wd.set(i),n.uniformMatrix4fv(this.addr,!1,wd),nn(e,i)}}function Ny(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Oy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2iv(this.addr,t),nn(e,t)}}function By(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(en(e,t))return;n.uniform3iv(this.addr,t),nn(e,t)}}function Hy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4iv(this.addr,t),nn(e,t)}}function Gy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Vy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2uiv(this.addr,t),nn(e,t)}}function Xy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(en(e,t))return;n.uniform3uiv(this.addr,t),nn(e,t)}}function Wy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4uiv(this.addr,t),nn(e,t)}}function Yy(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Md.compareFunction=qu,s=Md):s=lf,e.setTexture2D(t||s,a)}function $y(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||df,a)}function Zy(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||uf,a)}function qy(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||hf,a)}function jy(n){switch(n){case 5126:return Ly;case 35664:return Dy;case 35665:return ky;case 35666:return Iy;case 35674:return Fy;case 35675:return Uy;case 35676:return zy;case 5124:case 35670:return Ny;case 35667:case 35671:return Oy;case 35668:case 35672:return By;case 35669:case 35673:return Hy;case 5125:return Gy;case 36294:return Vy;case 36295:return Xy;case 36296:return Wy;case 35678:case 36198:case 36298:case 36306:case 35682:return Yy;case 35679:case 36299:case 36307:return $y;case 35680:case 36300:case 36308:case 36293:return Zy;case 36289:case 36303:case 36311:case 36292:return qy}}function Ky(n,t){n.uniform1fv(this.addr,t)}function Jy(n,t){const e=qa(t,this.size,2);n.uniform2fv(this.addr,e)}function Qy(n,t){const e=qa(t,this.size,3);n.uniform3fv(this.addr,e)}function tM(n,t){const e=qa(t,this.size,4);n.uniform4fv(this.addr,e)}function eM(n,t){const e=qa(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function nM(n,t){const e=qa(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function iM(n,t){const e=qa(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function aM(n,t){n.uniform1iv(this.addr,t)}function sM(n,t){n.uniform2iv(this.addr,t)}function oM(n,t){n.uniform3iv(this.addr,t)}function rM(n,t){n.uniform4iv(this.addr,t)}function cM(n,t){n.uniform1uiv(this.addr,t)}function lM(n,t){n.uniform2uiv(this.addr,t)}function hM(n,t){n.uniform3uiv(this.addr,t)}function dM(n,t){n.uniform4uiv(this.addr,t)}function uM(n,t,e){const i=this.cache,a=t.length,s=tr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||lf,s[o])}function fM(n,t,e){const i=this.cache,a=t.length,s=tr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||df,s[o])}function pM(n,t,e){const i=this.cache,a=t.length,s=tr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||uf,s[o])}function mM(n,t,e){const i=this.cache,a=t.length,s=tr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||hf,s[o])}function gM(n){switch(n){case 5126:return Ky;case 35664:return Jy;case 35665:return Qy;case 35666:return tM;case 35674:return eM;case 35675:return nM;case 35676:return iM;case 5124:case 35670:return aM;case 35667:case 35671:return sM;case 35668:case 35672:return oM;case 35669:case 35673:return rM;case 5125:return cM;case 36294:return lM;case 36295:return hM;case 36296:return dM;case 35678:case 36198:case 36298:case 36306:case 35682:return uM;case 35679:case 36299:case 36307:return fM;case 35680:case 36300:case 36308:case 36293:return pM;case 36289:case 36303:case 36311:case 36292:return mM}}class xM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=jy(e.type)}}class vM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=gM(e.type)}}class _M{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Qr=/(\w+)(\])?(\[|\.)?/g;function Ad(n,t){n.seq.push(t),n.map[t.id]=t}function yM(n,t,e){const i=n.name,a=i.length;for(Qr.lastIndex=0;;){const s=Qr.exec(i),o=Qr.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Ad(e,c===void 0?new xM(r,n,t):new vM(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new _M(r),Ad(e,f)),e=f}}}class Po{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);yM(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Rd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const MM=37297;let bM=0;function SM(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Pd=new fe;function wM(n){_e._getMatrix(Pd,_e.workingColorSpace,n);const t=`mat3( ${Pd.elements.map(e=>e.toFixed(4))} )`;switch(_e.getTransfer(n)){case Jo:return[t,"LinearTransferOETF"];case Le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Cd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+SM(n.getShaderSource(t),o)}else return a}function EM(n,t){const e=wM(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function TM(n,t){let e;switch(t){case Rg:e="Linear";break;case Pg:e="Reinhard";break;case Cg:e="Cineon";break;case Lg:e="ACESFilmic";break;case kg:e="AgX";break;case Ig:e="Neutral";break;case Dg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ho=new G;function AM(){_e.getLuminanceCoefficients(ho);const n=ho.x.toFixed(4),t=ho.y.toFixed(4),e=ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function RM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ps).join(`
`)}function PM(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function CM(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function ps(n){return n!==""}function Ld(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Dd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const LM=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(n){return n.replace(LM,kM)}const DM=new Map;function kM(n,t){let e=pe[t];if(e===void 0){const i=DM.get(t);if(i!==void 0)e=pe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const IM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kd(n){return n.replace(IM,FM)}function FM(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Id(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function UM(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Fu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Uu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ui&&(t="SHADOWMAP_TYPE_VSM"),t}function zM(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ga:case Va:t="ENVMAP_TYPE_CUBE";break;case Ko:t="ENVMAP_TYPE_CUBE_UV";break}return t}function NM(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Va:t="ENVMAP_MODE_REFRACTION";break}return t}function OM(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Cl:t="ENVMAP_BLENDING_MULTIPLY";break;case Tg:t="ENVMAP_BLENDING_MIX";break;case Ag:t="ENVMAP_BLENDING_ADD";break}return t}function BM(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function HM(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=UM(e),c=zM(e),h=NM(e),f=OM(e),d=BM(e),u=RM(e),m=PM(s),y=a.createProgram();let g,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ps).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(ps).join(`
`),p.length>0&&(p+=`
`)):(g=[Id(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ps).join(`
`),p=[Id(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Li?"#define TONE_MAPPING":"",e.toneMapping!==Li?pe.tonemapping_pars_fragment:"",e.toneMapping!==Li?TM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",pe.colorspace_pars_fragment,EM("linearToOutputTexel",e.outputColorSpace),AM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ps).join(`
`)),o=dl(o),o=Ld(o,e),o=Dd(o,e),r=dl(r),r=Ld(r,e),r=Dd(r,e),o=kd(o),r=kd(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Wh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=x+g+o,v=x+p+r,R=Rd(a,a.VERTEX_SHADER,_),w=Rd(a,a.FRAGMENT_SHADER,v);a.attachShader(y,R),a.attachShader(y,w),e.index0AttributeName!==void 0?a.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function b(P){if(n.debug.checkShaderErrors){const F=a.getProgramInfoLog(y).trim(),D=a.getShaderInfoLog(R).trim(),z=a.getShaderInfoLog(w).trim();let L=!0,k=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,y,R,w);else{const H=Cd(a,R,"vertex"),O=Cd(a,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+H+`
`+O)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(D===""||z==="")&&(k=!1);k&&(P.diagnostics={runnable:L,programLog:F,vertexShader:{log:D,prefix:g},fragmentShader:{log:z,prefix:p}})}a.deleteShader(R),a.deleteShader(w),E=new Po(a,y),S=CM(a,y)}let E;this.getUniforms=function(){return E===void 0&&b(this),E};let S;this.getAttributes=function(){return S===void 0&&b(this),S};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(y,MM)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=bM++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=w,this}let GM=0;class VM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new XM(t),e.set(t,i)),i}}class XM{constructor(t){this.id=GM++,this.code=t,this.usedTimes=0}}function WM(n,t,e,i,a,s,o){const r=new Ol,l=new VM,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(S){return c.add(S),S===0?"uv":`uv${S}`}function g(S,M,P,F,D){const z=F.fog,L=D.geometry,k=S.isMeshStandardMaterial?F.environment:null,H=(S.isMeshStandardMaterial?e:t).get(S.envMap||k),O=H&&H.mapping===Ko?H.image.height:null,I=m[S.type];S.precision!==null&&(u=a.getMaxPrecision(S.precision),u!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",u,"instead."));const X=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,mt=X!==void 0?X.length:0;let ot=0;L.morphAttributes.position!==void 0&&(ot=1),L.morphAttributes.normal!==void 0&&(ot=2),L.morphAttributes.color!==void 0&&(ot=3);let dt,et,q,pt;if(I){const ae=Jn[I];dt=ae.vertexShader,et=ae.fragmentShader}else dt=S.vertexShader,et=S.fragmentShader,l.update(S),q=l.getVertexShaderID(S),pt=l.getFragmentShaderID(S);const j=n.getRenderTarget(),Mt=n.state.buffers.depth.getReversed(),Ht=D.isInstancedMesh===!0,Nt=D.isBatchedMesh===!0,jt=!!S.map,ht=!!S.matcap,kt=!!H,V=!!S.aoMap,ue=!!S.lightMap,$t=!!S.bumpMap,Vt=!!S.normalMap,It=!!S.displacementMap,Et=!!S.emissiveMap,At=!!S.metalnessMap,C=!!S.roughnessMap,T=S.anisotropy>0,$=S.clearcoat>0,ct=S.dispersion>0,lt=S.iridescence>0,it=S.sheen>0,Ct=S.transmission>0,K=T&&!!S.anisotropyMap,ft=$&&!!S.clearcoatMap,Ft=$&&!!S.clearcoatNormalMap,nt=$&&!!S.clearcoatRoughnessMap,_t=lt&&!!S.iridescenceMap,B=lt&&!!S.iridescenceThicknessMap,st=it&&!!S.sheenColorMap,ut=it&&!!S.sheenRoughnessMap,Gt=!!S.specularMap,Zt=!!S.specularColorMap,Ut=!!S.specularIntensityMap,N=Ct&&!!S.transmissionMap,yt=Ct&&!!S.thicknessMap,J=!!S.gradientMap,rt=!!S.alphaMap,St=S.alphaTest>0,wt=!!S.alphaHash,Kt=!!S.extensions;let re=Li;S.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(re=n.toneMapping);const ce={shaderID:I,shaderType:S.type,shaderName:S.name,vertexShader:dt,fragmentShader:et,defines:S.defines,customVertexShaderID:q,customFragmentShaderID:pt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:u,batching:Nt,batchingColor:Nt&&D._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&D.instanceColor!==null,instancingMorph:Ht&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:$a,alphaToCoverage:!!S.alphaToCoverage,map:jt,matcap:ht,envMap:kt,envMapMode:kt&&H.mapping,envMapCubeUVHeight:O,aoMap:V,lightMap:ue,bumpMap:$t,normalMap:Vt,displacementMap:d&&It,emissiveMap:Et,normalMapObjectSpace:Vt&&S.normalMapType===Ng,normalMapTangentSpace:Vt&&S.normalMapType===Zu,metalnessMap:At,roughnessMap:C,anisotropy:T,anisotropyMap:K,clearcoat:$,clearcoatMap:ft,clearcoatNormalMap:Ft,clearcoatRoughnessMap:nt,dispersion:ct,iridescence:lt,iridescenceMap:_t,iridescenceThicknessMap:B,sheen:it,sheenColorMap:st,sheenRoughnessMap:ut,specularMap:Gt,specularColorMap:Zt,specularIntensityMap:Ut,transmission:Ct,transmissionMap:N,thicknessMap:yt,gradientMap:J,opaque:S.transparent===!1&&S.blending===Ua&&S.alphaToCoverage===!1,alphaMap:rt,alphaTest:St,alphaHash:wt,combine:S.combine,mapUv:jt&&y(S.map.channel),aoMapUv:V&&y(S.aoMap.channel),lightMapUv:ue&&y(S.lightMap.channel),bumpMapUv:$t&&y(S.bumpMap.channel),normalMapUv:Vt&&y(S.normalMap.channel),displacementMapUv:It&&y(S.displacementMap.channel),emissiveMapUv:Et&&y(S.emissiveMap.channel),metalnessMapUv:At&&y(S.metalnessMap.channel),roughnessMapUv:C&&y(S.roughnessMap.channel),anisotropyMapUv:K&&y(S.anisotropyMap.channel),clearcoatMapUv:ft&&y(S.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&y(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&y(S.clearcoatRoughnessMap.channel),iridescenceMapUv:_t&&y(S.iridescenceMap.channel),iridescenceThicknessMapUv:B&&y(S.iridescenceThicknessMap.channel),sheenColorMapUv:st&&y(S.sheenColorMap.channel),sheenRoughnessMapUv:ut&&y(S.sheenRoughnessMap.channel),specularMapUv:Gt&&y(S.specularMap.channel),specularColorMapUv:Zt&&y(S.specularColorMap.channel),specularIntensityMapUv:Ut&&y(S.specularIntensityMap.channel),transmissionMapUv:N&&y(S.transmissionMap.channel),thicknessMapUv:yt&&y(S.thicknessMap.channel),alphaMapUv:rt&&y(S.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Vt||T),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!L.attributes.uv&&(jt||rt),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Mt,skinning:D.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ot,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:re,decodeVideoTexture:jt&&S.map.isVideoTexture===!0&&_e.getTransfer(S.map.colorSpace)===Le,decodeVideoTextureEmissive:Et&&S.emissiveMap.isVideoTexture===!0&&_e.getTransfer(S.emissiveMap.colorSpace)===Le,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Be,flipSided:S.side===bn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Kt&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&S.extensions.multiDraw===!0||Nt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function p(S){const M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)M.push(P),M.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(x(M,S),_(M,S),M.push(n.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function x(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function _(S,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),S.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),S.push(r.mask)}function v(S){const M=m[S.type];let P;if(M){const F=Jn[M];P=Rx.clone(F.uniforms)}else P=S.uniforms;return P}function R(S,M){let P;for(let F=0,D=h.length;F<D;F++){const z=h[F];if(z.cacheKey===M){P=z,++P.usedTimes;break}}return P===void 0&&(P=new HM(n,M,S,s),h.push(P)),P}function w(S){if(--S.usedTimes===0){const M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function b(S){l.remove(S)}function E(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:R,releaseProgram:w,releaseShaderCache:b,programs:h,dispose:E}}function YM(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function $M(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Fd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ud(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,m,y,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:y,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=y,p.group=g),t++,p}function r(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,m,y,g){const p=o(f,d,u,m,y,g);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||$M),i.length>1&&i.sort(d||Fd),a.length>1&&a.sort(d||Fd)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function ZM(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Ud,n.set(i,[o])):a>=s.length?(o=new Ud,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function qM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ie};break;case"SpotLight":e={position:new G,direction:new G,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ie,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":e={color:new ie,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function jM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let KM=0;function JM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function QM(n){const t=new qM,e=jM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const a=new G,s=new Ie,o=new Ie;function r(c){let h=0,f=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let u=0,m=0,y=0,g=0,p=0,x=0,_=0,v=0,R=0,w=0,b=0;c.sort(JM);for(let S=0,M=c.length;S<M;S++){const P=c[S],F=P.color,D=P.intensity,z=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*D,f+=F.g*D,d+=F.b*D;else if(P.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(P.sh.coefficients[k],D);b++}else if(P.isDirectionalLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,O=e.get(P);O.shadowIntensity=H.intensity,O.shadowBias=H.bias,O.shadowNormalBias=H.normalBias,O.shadowRadius=H.radius,O.shadowMapSize=H.mapSize,i.directionalShadow[u]=O,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=P.shadow.matrix,x++}i.directional[u]=k,u++}else if(P.isSpotLight){const k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(F).multiplyScalar(D),k.distance=z,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,i.spot[y]=k;const H=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,H.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[y]=H.matrix,P.castShadow){const O=e.get(P);O.shadowIntensity=H.intensity,O.shadowBias=H.bias,O.shadowNormalBias=H.normalBias,O.shadowRadius=H.radius,O.shadowMapSize=H.mapSize,i.spotShadow[y]=O,i.spotShadowMap[y]=L,v++}y++}else if(P.isRectAreaLight){const k=t.get(P);k.color.copy(F).multiplyScalar(D),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=k,g++}else if(P.isPointLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const H=P.shadow,O=e.get(P);O.shadowIntensity=H.intensity,O.shadowBias=H.bias,O.shadowNormalBias=H.normalBias,O.shadowRadius=H.radius,O.shadowMapSize=H.mapSize,O.shadowCameraNear=H.camera.near,O.shadowCameraFar=H.camera.far,i.pointShadow[m]=O,i.pointShadowMap[m]=L,i.pointShadowMatrix[m]=P.shadow.matrix,_++}i.point[m]=k,m++}else if(P.isHemisphereLight){const k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(D),k.groundColor.copy(P.groundColor).multiplyScalar(D),i.hemi[p]=k,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=zt.LTC_FLOAT_1,i.rectAreaLTC2=zt.LTC_FLOAT_2):(i.rectAreaLTC1=zt.LTC_HALF_1,i.rectAreaLTC2=zt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const E=i.hash;(E.directionalLength!==u||E.pointLength!==m||E.spotLength!==y||E.rectAreaLength!==g||E.hemiLength!==p||E.numDirectionalShadows!==x||E.numPointShadows!==_||E.numSpotShadows!==v||E.numSpotMaps!==R||E.numLightProbes!==b)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=v+R-w,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=b,E.directionalLength=u,E.pointLength=m,E.spotLength=y,E.rectAreaLength=g,E.hemiLength=p,E.numDirectionalShadows=x,E.numPointShadows=_,E.numSpotShadows=v,E.numSpotMaps=R,E.numLightProbes=b,i.version=KM++)}function l(c,h){let f=0,d=0,u=0,m=0,y=0;const g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const _=c[p];if(_.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(_.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(_.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(_.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(_.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const v=i.hemi[y];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(g),y++}}}return{setup:r,setupView:l,state:i}}function zd(n){const t=new QM(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function tb(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new zd(n),t.set(a,[r])):s>=o.length?(r=new zd(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class eb extends oa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Ug,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class nb extends oa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ib=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ab=`uniform sampler2D shadow_pass;
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
}`;function sb(n,t,e){let i=new Bl;const a=new Yt,s=new Yt,o=new We,r=new eb({depthPacking:zg}),l=new nb,c={},h=e.maxTextureSize,f={[Di]:bn,[bn]:Di,[Be]:Be},d=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:ib,fragmentShader:ab}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new Je;m.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ge(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fu;let p=this.type;this.render=function(w,b,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const S=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Ci),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const D=p!==ui&&this.type===ui,z=p===ui&&this.type!==ui;for(let L=0,k=w.length;L<k;L++){const H=w[L],O=H.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;a.copy(O.mapSize);const I=O.getFrameExtents();if(a.multiply(I),s.copy(O.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/I.x),a.x=s.x*I.x,O.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/I.y),a.y=s.y*I.y,O.mapSize.y=s.y)),O.map===null||D===!0||z===!0){const mt=this.type!==ui?{minFilter:Gn,magFilter:Gn}:{};O.map!==null&&O.map.dispose(),O.map=new aa(a.x,a.y,mt),O.map.texture.name=H.name+".shadowMap",O.camera.updateProjectionMatrix()}n.setRenderTarget(O.map),n.clear();const X=O.getViewportCount();for(let mt=0;mt<X;mt++){const ot=O.getViewport(mt);o.set(s.x*ot.x,s.y*ot.y,s.x*ot.z,s.y*ot.w),F.viewport(o),O.updateMatrices(H,mt),i=O.getFrustum(),v(b,E,O.camera,H,this.type)}O.isPointLightShadow!==!0&&this.type===ui&&x(O,E),O.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(S,M,P)};function x(w,b){const E=t.update(y);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,u.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new aa(a.x,a.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(b,null,E,d,y,null),u.uniforms.shadow_pass.value=w.mapPass.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(b,null,E,u,y,null)}function _(w,b,E,S){let M=null;const P=E.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)M=P;else if(M=E.isPointLight===!0?l:r,n.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const F=M.uuid,D=b.uuid;let z=c[F];z===void 0&&(z={},c[F]=z);let L=z[D];L===void 0&&(L=M.clone(),z[D]=L,b.addEventListener("dispose",R)),M=L}if(M.visible=b.visible,M.wireframe=b.wireframe,S===ui?M.side=b.shadowSide!==null?b.shadowSide:b.side:M.side=b.shadowSide!==null?b.shadowSide:f[b.side],M.alphaMap=b.alphaMap,M.alphaTest=b.alphaTest,M.map=b.map,M.clipShadows=b.clipShadows,M.clippingPlanes=b.clippingPlanes,M.clipIntersection=b.clipIntersection,M.displacementMap=b.displacementMap,M.displacementScale=b.displacementScale,M.displacementBias=b.displacementBias,M.wireframeLinewidth=b.wireframeLinewidth,M.linewidth=b.linewidth,E.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=E}return M}function v(w,b,E,S,M){if(w.visible===!1)return;if(w.layers.test(b.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===ui)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,w.matrixWorld);const D=t.update(w),z=w.material;if(Array.isArray(z)){const L=D.groups;for(let k=0,H=L.length;k<H;k++){const O=L[k],I=z[O.materialIndex];if(I&&I.visible){const X=_(w,I,S,M);w.onBeforeShadow(n,w,b,E,D,X,O),n.renderBufferDirect(E,null,D,X,w,O),w.onAfterShadow(n,w,b,E,D,X,O)}}}else if(z.visible){const L=_(w,z,S,M);w.onBeforeShadow(n,w,b,E,D,L,null),n.renderBufferDirect(E,null,D,L,w,null),w.onAfterShadow(n,w,b,E,D,L,null)}}const F=w.children;for(let D=0,z=F.length;D<z;D++)v(F[D],b,E,S,M)}function R(w){w.target.removeEventListener("dispose",R);for(const E in c){const S=c[E],M=w.target.uuid;M in S&&(S[M].dispose(),delete S[M])}}}const ob={[Ac]:Rc,[Pc]:Dc,[Cc]:kc,[Ha]:Lc,[Rc]:Ac,[Dc]:Pc,[kc]:Cc,[Lc]:Ha};function rb(n,t){function e(){let N=!1;const yt=new We;let J=null;const rt=new We(0,0,0,0);return{setMask:function(St){J!==St&&!N&&(n.colorMask(St,St,St,St),J=St)},setLocked:function(St){N=St},setClear:function(St,wt,Kt,re,ce){ce===!0&&(St*=re,wt*=re,Kt*=re),yt.set(St,wt,Kt,re),rt.equals(yt)===!1&&(n.clearColor(St,wt,Kt,re),rt.copy(yt))},reset:function(){N=!1,J=null,rt.set(-1,0,0,0)}}}function i(){let N=!1,yt=!1,J=null,rt=null,St=null;return{setReversed:function(wt){if(yt!==wt){const Kt=t.get("EXT_clip_control");yt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const re=St;St=null,this.setClear(re)}yt=wt},getReversed:function(){return yt},setTest:function(wt){wt?j(n.DEPTH_TEST):Mt(n.DEPTH_TEST)},setMask:function(wt){J!==wt&&!N&&(n.depthMask(wt),J=wt)},setFunc:function(wt){if(yt&&(wt=ob[wt]),rt!==wt){switch(wt){case Ac:n.depthFunc(n.NEVER);break;case Rc:n.depthFunc(n.ALWAYS);break;case Pc:n.depthFunc(n.LESS);break;case Ha:n.depthFunc(n.LEQUAL);break;case Cc:n.depthFunc(n.EQUAL);break;case Lc:n.depthFunc(n.GEQUAL);break;case Dc:n.depthFunc(n.GREATER);break;case kc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=wt}},setLocked:function(wt){N=wt},setClear:function(wt){St!==wt&&(yt&&(wt=1-wt),n.clearDepth(wt),St=wt)},reset:function(){N=!1,J=null,rt=null,St=null,yt=!1}}}function a(){let N=!1,yt=null,J=null,rt=null,St=null,wt=null,Kt=null,re=null,ce=null;return{setTest:function(ae){N||(ae?j(n.STENCIL_TEST):Mt(n.STENCIL_TEST))},setMask:function(ae){yt!==ae&&!N&&(n.stencilMask(ae),yt=ae)},setFunc:function(ae,we,xe){(J!==ae||rt!==we||St!==xe)&&(n.stencilFunc(ae,we,xe),J=ae,rt=we,St=xe)},setOp:function(ae,we,xe){(wt!==ae||Kt!==we||re!==xe)&&(n.stencilOp(ae,we,xe),wt=ae,Kt=we,re=xe)},setLocked:function(ae){N=ae},setClear:function(ae){ce!==ae&&(n.clearStencil(ae),ce=ae)},reset:function(){N=!1,yt=null,J=null,rt=null,St=null,wt=null,Kt=null,re=null,ce=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,x=null,_=null,v=null,R=null,w=null,b=new ie(0,0,0),E=0,S=!1,M=null,P=null,F=null,D=null,z=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,H=0;const O=n.getParameter(n.VERSION);O.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(O)[1]),k=H>=1):O.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),k=H>=2);let I=null,X={};const mt=n.getParameter(n.SCISSOR_BOX),ot=n.getParameter(n.VIEWPORT),dt=new We().fromArray(mt),et=new We().fromArray(ot);function q(N,yt,J,rt){const St=new Uint8Array(4),wt=n.createTexture();n.bindTexture(N,wt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<J;Kt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(yt,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(yt+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return wt}const pt={};pt[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),j(n.DEPTH_TEST),o.setFunc(Ha),$t(!1),Vt(Bh),j(n.CULL_FACE),V(Ci);function j(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function Mt(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function Ht(N,yt){return f[N]!==yt?(n.bindFramebuffer(N,yt),f[N]=yt,N===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=yt),N===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=yt),!0):!1}function Nt(N,yt){let J=u,rt=!1;if(N){J=d.get(yt),J===void 0&&(J=[],d.set(yt,J));const St=N.textures;if(J.length!==St.length||J[0]!==n.COLOR_ATTACHMENT0){for(let wt=0,Kt=St.length;wt<Kt;wt++)J[wt]=n.COLOR_ATTACHMENT0+wt;J.length=St.length,rt=!0}}else J[0]!==n.BACK&&(J[0]=n.BACK,rt=!0);rt&&n.drawBuffers(J)}function jt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const ht={[Ki]:n.FUNC_ADD,[lg]:n.FUNC_SUBTRACT,[hg]:n.FUNC_REVERSE_SUBTRACT};ht[dg]=n.MIN,ht[ug]=n.MAX;const kt={[fg]:n.ZERO,[pg]:n.ONE,[mg]:n.SRC_COLOR,[Ec]:n.SRC_ALPHA,[Mg]:n.SRC_ALPHA_SATURATE,[_g]:n.DST_COLOR,[xg]:n.DST_ALPHA,[gg]:n.ONE_MINUS_SRC_COLOR,[Tc]:n.ONE_MINUS_SRC_ALPHA,[yg]:n.ONE_MINUS_DST_COLOR,[vg]:n.ONE_MINUS_DST_ALPHA,[bg]:n.CONSTANT_COLOR,[Sg]:n.ONE_MINUS_CONSTANT_COLOR,[wg]:n.CONSTANT_ALPHA,[Eg]:n.ONE_MINUS_CONSTANT_ALPHA};function V(N,yt,J,rt,St,wt,Kt,re,ce,ae){if(N===Ci){y===!0&&(Mt(n.BLEND),y=!1);return}if(y===!1&&(j(n.BLEND),y=!0),N!==cg){if(N!==g||ae!==S){if((p!==Ki||v!==Ki)&&(n.blendEquation(n.FUNC_ADD),p=Ki,v=Ki),ae)switch(N){case Ua:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.ONE,n.ONE);break;case Hh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Gh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Ua:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ei:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Hh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Gh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,_=null,R=null,w=null,b.set(0,0,0),E=0,g=N,S=ae}return}St=St||yt,wt=wt||J,Kt=Kt||rt,(yt!==p||St!==v)&&(n.blendEquationSeparate(ht[yt],ht[St]),p=yt,v=St),(J!==x||rt!==_||wt!==R||Kt!==w)&&(n.blendFuncSeparate(kt[J],kt[rt],kt[wt],kt[Kt]),x=J,_=rt,R=wt,w=Kt),(re.equals(b)===!1||ce!==E)&&(n.blendColor(re.r,re.g,re.b,ce),b.copy(re),E=ce),g=N,S=!1}function ue(N,yt){N.side===Be?Mt(n.CULL_FACE):j(n.CULL_FACE);let J=N.side===bn;yt&&(J=!J),$t(J),N.blending===Ua&&N.transparent===!1?V(Ci):V(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const rt=N.stencilWrite;r.setTest(rt),rt&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Et(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):Mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function $t(N){M!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),M=N)}function Vt(N){N!==og?(j(n.CULL_FACE),N!==P&&(N===Bh?n.cullFace(n.BACK):N===rg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Mt(n.CULL_FACE),P=N}function It(N){N!==F&&(k&&n.lineWidth(N),F=N)}function Et(N,yt,J){N?(j(n.POLYGON_OFFSET_FILL),(D!==yt||z!==J)&&(n.polygonOffset(yt,J),D=yt,z=J)):Mt(n.POLYGON_OFFSET_FILL)}function At(N){N?j(n.SCISSOR_TEST):Mt(n.SCISSOR_TEST)}function C(N){N===void 0&&(N=n.TEXTURE0+L-1),I!==N&&(n.activeTexture(N),I=N)}function T(N,yt,J){J===void 0&&(I===null?J=n.TEXTURE0+L-1:J=I);let rt=X[J];rt===void 0&&(rt={type:void 0,texture:void 0},X[J]=rt),(rt.type!==N||rt.texture!==yt)&&(I!==J&&(n.activeTexture(J),I=J),n.bindTexture(N,yt||pt[N]),rt.type=N,rt.texture=yt)}function $(){const N=X[I];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ct(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function lt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ct(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ft(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function st(N){dt.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),dt.copy(N))}function ut(N){et.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),et.copy(N))}function Gt(N,yt){let J=c.get(yt);J===void 0&&(J=new WeakMap,c.set(yt,J));let rt=J.get(N);rt===void 0&&(rt=n.getUniformBlockIndex(yt,N.name),J.set(N,rt))}function Zt(N,yt){const rt=c.get(yt).get(N);l.get(yt)!==rt&&(n.uniformBlockBinding(yt,rt,N.__bindingPointIndex),l.set(yt,rt))}function Ut(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},I=null,X={},f={},d=new WeakMap,u=[],m=null,y=!1,g=null,p=null,x=null,_=null,v=null,R=null,w=null,b=new ie(0,0,0),E=0,S=!1,M=null,P=null,F=null,D=null,z=null,dt.set(0,0,n.canvas.width,n.canvas.height),et.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:j,disable:Mt,bindFramebuffer:Ht,drawBuffers:Nt,useProgram:jt,setBlending:V,setMaterial:ue,setFlipSided:$t,setCullFace:Vt,setLineWidth:It,setPolygonOffset:Et,setScissorTest:At,activeTexture:C,bindTexture:T,unbindTexture:$,compressedTexImage2D:ct,compressedTexImage3D:lt,texImage2D:_t,texImage3D:B,updateUBOMapping:Gt,uniformBlockBinding:Zt,texStorage2D:Ft,texStorage3D:nt,texSubImage2D:it,texSubImage3D:Ct,compressedTexSubImage2D:K,compressedTexSubImage3D:ft,scissor:st,viewport:ut,reset:Ut}}function Nd(n,t,e,i){const a=cb(i);switch(e){case Hu:return n*t;case Vu:return n*t;case Xu:return n*t*2;case Wu:return n*t/a.components*a.byteLength;case Il:return n*t/a.components*a.byteLength;case Yu:return n*t*2/a.components*a.byteLength;case Fl:return n*t*2/a.components*a.byteLength;case Gu:return n*t*3/a.components*a.byteLength;case Hn:return n*t*4/a.components*a.byteLength;case Ul:return n*t*4/a.components*a.byteLength;case wo:case Eo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case To:case Ao:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Oc:case Hc:return Math.max(n,16)*Math.max(t,8)/4;case Nc:case Bc:return Math.max(n,8)*Math.max(t,8)/2;case Gc:case Vc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Xc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Wc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case $c:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case jc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Kc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case tl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case el:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case nl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case il:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case al:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ro:case sl:case ol:return Math.ceil(n/4)*Math.ceil(t/4)*16;case $u:case rl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case cl:case ll:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cb(n){switch(n){case xi:case Nu:return{byteLength:1,components:1};case Es:case Ou:case ks:return{byteLength:2,components:1};case Dl:case kl:return{byteLength:2,components:4};case ia:case Ll:case pi:return{byteLength:4,components:1};case Bu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function lb(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Yt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,T){return u?new OffscreenCanvas(C,T):Go("canvas")}function y(C,T,$){let ct=1;const lt=At(C);if((lt.width>$||lt.height>$)&&(ct=$/Math.max(lt.width,lt.height)),ct<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const it=Math.floor(ct*lt.width),Ct=Math.floor(ct*lt.height);f===void 0&&(f=m(it,Ct));const K=T?m(it,Ct):f;return K.width=it,K.height=Ct,K.getContext("2d").drawImage(C,0,0,it,Ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+it+"x"+Ct+")."),K}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(C,T,$,ct,lt=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let it=T;if(T===n.RED&&($===n.FLOAT&&(it=n.R32F),$===n.HALF_FLOAT&&(it=n.R16F),$===n.UNSIGNED_BYTE&&(it=n.R8)),T===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(it=n.R8UI),$===n.UNSIGNED_SHORT&&(it=n.R16UI),$===n.UNSIGNED_INT&&(it=n.R32UI),$===n.BYTE&&(it=n.R8I),$===n.SHORT&&(it=n.R16I),$===n.INT&&(it=n.R32I)),T===n.RG&&($===n.FLOAT&&(it=n.RG32F),$===n.HALF_FLOAT&&(it=n.RG16F),$===n.UNSIGNED_BYTE&&(it=n.RG8)),T===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(it=n.RG8UI),$===n.UNSIGNED_SHORT&&(it=n.RG16UI),$===n.UNSIGNED_INT&&(it=n.RG32UI),$===n.BYTE&&(it=n.RG8I),$===n.SHORT&&(it=n.RG16I),$===n.INT&&(it=n.RG32I)),T===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(it=n.RGB8UI),$===n.UNSIGNED_SHORT&&(it=n.RGB16UI),$===n.UNSIGNED_INT&&(it=n.RGB32UI),$===n.BYTE&&(it=n.RGB8I),$===n.SHORT&&(it=n.RGB16I),$===n.INT&&(it=n.RGB32I)),T===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(it=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(it=n.RGBA16UI),$===n.UNSIGNED_INT&&(it=n.RGBA32UI),$===n.BYTE&&(it=n.RGBA8I),$===n.SHORT&&(it=n.RGBA16I),$===n.INT&&(it=n.RGBA32I)),T===n.RGB&&$===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),T===n.RGBA){const Ct=lt?Jo:_e.getTransfer(ct);$===n.FLOAT&&(it=n.RGBA32F),$===n.HALF_FLOAT&&(it=n.RGBA16F),$===n.UNSIGNED_BYTE&&(it=Ct===Le?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function v(C,T){let $;return C?T===null||T===ia||T===Xa?$=n.DEPTH24_STENCIL8:T===pi?$=n.DEPTH32F_STENCIL8:T===Es&&($=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ia||T===Xa?$=n.DEPTH_COMPONENT24:T===pi?$=n.DEPTH_COMPONENT32F:T===Es&&($=n.DEPTH_COMPONENT16),$}function R(C,T){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Gn&&C.minFilter!==Qn?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function w(C){const T=C.target;T.removeEventListener("dispose",w),E(T),T.isVideoTexture&&h.delete(T)}function b(C){const T=C.target;T.removeEventListener("dispose",b),M(T)}function E(C){const T=i.get(C);if(T.__webglInit===void 0)return;const $=C.source,ct=d.get($);if(ct){const lt=ct[T.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&S(C),Object.keys(ct).length===0&&d.delete($)}i.remove(C)}function S(C){const T=i.get(C);n.deleteTexture(T.__webglTexture);const $=C.source,ct=d.get($);delete ct[T.__cacheKey],o.memory.textures--}function M(C){const T=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let ct=0;ct<6;ct++){if(Array.isArray(T.__webglFramebuffer[ct]))for(let lt=0;lt<T.__webglFramebuffer[ct].length;lt++)n.deleteFramebuffer(T.__webglFramebuffer[ct][lt]);else n.deleteFramebuffer(T.__webglFramebuffer[ct]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ct])}else{if(Array.isArray(T.__webglFramebuffer))for(let ct=0;ct<T.__webglFramebuffer.length;ct++)n.deleteFramebuffer(T.__webglFramebuffer[ct]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ct=0;ct<T.__webglColorRenderbuffer.length;ct++)T.__webglColorRenderbuffer[ct]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ct]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const $=C.textures;for(let ct=0,lt=$.length;ct<lt;ct++){const it=i.get($[ct]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),o.memory.textures--),i.remove($[ct])}i.remove(C)}let P=0;function F(){P=0}function D(){const C=P;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),P+=1,C}function z(C){const T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function L(C,T){const $=i.get(C);if(C.isVideoTexture&&It(C),C.isRenderTargetTexture===!1&&C.version>0&&$.__version!==C.version){const ct=C.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et($,C,T);return}}e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+T)}function k(C,T){const $=i.get(C);if(C.version>0&&$.__version!==C.version){et($,C,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+T)}function H(C,T){const $=i.get(C);if(C.version>0&&$.__version!==C.version){et($,C,T);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+T)}function O(C,T){const $=i.get(C);if(C.version>0&&$.__version!==C.version){q($,C,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+T)}const I={[Uc]:n.REPEAT,[Qi]:n.CLAMP_TO_EDGE,[zc]:n.MIRRORED_REPEAT},X={[Gn]:n.NEAREST,[Fg]:n.NEAREST_MIPMAP_NEAREST,[Xs]:n.NEAREST_MIPMAP_LINEAR,[Qn]:n.LINEAR,[Ar]:n.LINEAR_MIPMAP_NEAREST,[ta]:n.LINEAR_MIPMAP_LINEAR},mt={[Og]:n.NEVER,[Wg]:n.ALWAYS,[Bg]:n.LESS,[qu]:n.LEQUAL,[Hg]:n.EQUAL,[Xg]:n.GEQUAL,[Gg]:n.GREATER,[Vg]:n.NOTEQUAL};function ot(C,T){if(T.type===pi&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Qn||T.magFilter===Ar||T.magFilter===Xs||T.magFilter===ta||T.minFilter===Qn||T.minFilter===Ar||T.minFilter===Xs||T.minFilter===ta)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,I[T.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,I[T.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,I[T.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,X[T.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,X[T.minFilter]),T.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,mt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Gn||T.minFilter!==Xs&&T.minFilter!==ta||T.type===pi&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function dt(C,T){let $=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",w));const ct=T.source;let lt=d.get(ct);lt===void 0&&(lt={},d.set(ct,lt));const it=z(T);if(it!==C.__cacheKey){lt[it]===void 0&&(lt[it]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,$=!0),lt[it].usedTimes++;const Ct=lt[C.__cacheKey];Ct!==void 0&&(lt[C.__cacheKey].usedTimes--,Ct.usedTimes===0&&S(T)),C.__cacheKey=it,C.__webglTexture=lt[it].texture}return $}function et(C,T,$){let ct=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ct=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ct=n.TEXTURE_3D);const lt=dt(C,T),it=T.source;e.bindTexture(ct,C.__webglTexture,n.TEXTURE0+$);const Ct=i.get(it);if(it.version!==Ct.__version||lt===!0){e.activeTexture(n.TEXTURE0+$);const K=_e.getPrimaries(_e.workingColorSpace),ft=T.colorSpace===Ti?null:_e.getPrimaries(T.colorSpace),Ft=T.colorSpace===Ti||K===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let nt=y(T.image,!1,a.maxTextureSize);nt=Et(T,nt);const _t=s.convert(T.format,T.colorSpace),B=s.convert(T.type);let st=_(T.internalFormat,_t,B,T.colorSpace,T.isVideoTexture);ot(ct,T);let ut;const Gt=T.mipmaps,Zt=T.isVideoTexture!==!0,Ut=Ct.__version===void 0||lt===!0,N=it.dataReady,yt=R(T,nt);if(T.isDepthTexture)st=v(T.format===Wa,T.type),Ut&&(Zt?e.texStorage2D(n.TEXTURE_2D,1,st,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,st,nt.width,nt.height,0,_t,B,null));else if(T.isDataTexture)if(Gt.length>0){Zt&&Ut&&e.texStorage2D(n.TEXTURE_2D,yt,st,Gt[0].width,Gt[0].height);for(let J=0,rt=Gt.length;J<rt;J++)ut=Gt[J],Zt?N&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,_t,B,ut.data):e.texImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,_t,B,ut.data);T.generateMipmaps=!1}else Zt?(Ut&&e.texStorage2D(n.TEXTURE_2D,yt,st,nt.width,nt.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,_t,B,nt.data)):e.texImage2D(n.TEXTURE_2D,0,st,nt.width,nt.height,0,_t,B,nt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Zt&&Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,st,Gt[0].width,Gt[0].height,nt.depth);for(let J=0,rt=Gt.length;J<rt;J++)if(ut=Gt[J],T.format!==Hn)if(_t!==null)if(Zt){if(N)if(T.layerUpdates.size>0){const St=Nd(ut.width,ut.height,T.format,T.type);for(const wt of T.layerUpdates){const Kt=ut.data.subarray(wt*St/ut.data.BYTES_PER_ELEMENT,(wt+1)*St/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,wt,ut.width,ut.height,1,_t,Kt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,nt.depth,_t,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,J,st,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Zt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,J,0,0,0,ut.width,ut.height,nt.depth,_t,B,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,J,st,ut.width,ut.height,nt.depth,0,_t,B,ut.data)}else{Zt&&Ut&&e.texStorage2D(n.TEXTURE_2D,yt,st,Gt[0].width,Gt[0].height);for(let J=0,rt=Gt.length;J<rt;J++)ut=Gt[J],T.format!==Hn?_t!==null?Zt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,_t,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?N&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,ut.width,ut.height,_t,B,ut.data):e.texImage2D(n.TEXTURE_2D,J,st,ut.width,ut.height,0,_t,B,ut.data)}else if(T.isDataArrayTexture)if(Zt){if(Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,yt,st,nt.width,nt.height,nt.depth),N)if(T.layerUpdates.size>0){const J=Nd(nt.width,nt.height,T.format,T.type);for(const rt of T.layerUpdates){const St=nt.data.subarray(rt*J/nt.data.BYTES_PER_ELEMENT,(rt+1)*J/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,nt.width,nt.height,1,_t,B,St)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,_t,B,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,st,nt.width,nt.height,nt.depth,0,_t,B,nt.data);else if(T.isData3DTexture)Zt?(Ut&&e.texStorage3D(n.TEXTURE_3D,yt,st,nt.width,nt.height,nt.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,_t,B,nt.data)):e.texImage3D(n.TEXTURE_3D,0,st,nt.width,nt.height,nt.depth,0,_t,B,nt.data);else if(T.isFramebufferTexture){if(Ut)if(Zt)e.texStorage2D(n.TEXTURE_2D,yt,st,nt.width,nt.height);else{let J=nt.width,rt=nt.height;for(let St=0;St<yt;St++)e.texImage2D(n.TEXTURE_2D,St,st,J,rt,0,_t,B,null),J>>=1,rt>>=1}}else if(Gt.length>0){if(Zt&&Ut){const J=At(Gt[0]);e.texStorage2D(n.TEXTURE_2D,yt,st,J.width,J.height)}for(let J=0,rt=Gt.length;J<rt;J++)ut=Gt[J],Zt?N&&e.texSubImage2D(n.TEXTURE_2D,J,0,0,_t,B,ut):e.texImage2D(n.TEXTURE_2D,J,st,_t,B,ut);T.generateMipmaps=!1}else if(Zt){if(Ut){const J=At(nt);e.texStorage2D(n.TEXTURE_2D,yt,st,J.width,J.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,_t,B,nt)}else e.texImage2D(n.TEXTURE_2D,0,st,_t,B,nt);g(T)&&p(ct),Ct.__version=it.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function q(C,T,$){if(T.image.length!==6)return;const ct=dt(C,T),lt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+$);const it=i.get(lt);if(lt.version!==it.__version||ct===!0){e.activeTexture(n.TEXTURE0+$);const Ct=_e.getPrimaries(_e.workingColorSpace),K=T.colorSpace===Ti?null:_e.getPrimaries(T.colorSpace),ft=T.colorSpace===Ti||Ct===K?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const Ft=T.isCompressedTexture||T.image[0].isCompressedTexture,nt=T.image[0]&&T.image[0].isDataTexture,_t=[];for(let rt=0;rt<6;rt++)!Ft&&!nt?_t[rt]=y(T.image[rt],!0,a.maxCubemapSize):_t[rt]=nt?T.image[rt].image:T.image[rt],_t[rt]=Et(T,_t[rt]);const B=_t[0],st=s.convert(T.format,T.colorSpace),ut=s.convert(T.type),Gt=_(T.internalFormat,st,ut,T.colorSpace),Zt=T.isVideoTexture!==!0,Ut=it.__version===void 0||ct===!0,N=lt.dataReady;let yt=R(T,B);ot(n.TEXTURE_CUBE_MAP,T);let J;if(Ft){Zt&&Ut&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Gt,B.width,B.height);for(let rt=0;rt<6;rt++){J=_t[rt].mipmaps;for(let St=0;St<J.length;St++){const wt=J[St];T.format!==Hn?st!==null?Zt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,wt.width,wt.height,st,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,Gt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Zt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,wt.width,wt.height,st,ut,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,Gt,wt.width,wt.height,0,st,ut,wt.data)}}}else{if(J=T.mipmaps,Zt&&Ut){J.length>0&&yt++;const rt=At(_t[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,Gt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(nt){Zt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,_t[rt].width,_t[rt].height,st,ut,_t[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Gt,_t[rt].width,_t[rt].height,0,st,ut,_t[rt].data);for(let St=0;St<J.length;St++){const Kt=J[St].image[rt].image;Zt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,Kt.width,Kt.height,st,ut,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,Gt,Kt.width,Kt.height,0,st,ut,Kt.data)}}else{Zt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,st,ut,_t[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Gt,st,ut,_t[rt]);for(let St=0;St<J.length;St++){const wt=J[St];Zt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,st,ut,wt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,Gt,st,ut,wt.image[rt])}}}g(T)&&p(n.TEXTURE_CUBE_MAP),it.__version=lt.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function pt(C,T,$,ct,lt,it){const Ct=s.convert($.format,$.colorSpace),K=s.convert($.type),ft=_($.internalFormat,Ct,K,$.colorSpace),Ft=i.get(T),nt=i.get($);if(nt.__renderTarget=T,!Ft.__hasExternalTextures){const _t=Math.max(1,T.width>>it),B=Math.max(1,T.height>>it);lt===n.TEXTURE_3D||lt===n.TEXTURE_2D_ARRAY?e.texImage3D(lt,it,ft,_t,B,T.depth,0,Ct,K,null):e.texImage2D(lt,it,ft,_t,B,0,Ct,K,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ct,lt,nt.__webglTexture,0,$t(T)):(lt===n.TEXTURE_2D||lt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ct,lt,nt.__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(C,T,$){if(n.bindRenderbuffer(n.RENDERBUFFER,C),T.depthBuffer){const ct=T.depthTexture,lt=ct&&ct.isDepthTexture?ct.type:null,it=v(T.stencilBuffer,lt),Ct=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=$t(T);Vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K,it,T.width,T.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,K,it,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,it,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ct,n.RENDERBUFFER,C)}else{const ct=T.textures;for(let lt=0;lt<ct.length;lt++){const it=ct[lt],Ct=s.convert(it.format,it.colorSpace),K=s.convert(it.type),ft=_(it.internalFormat,Ct,K,it.colorSpace),Ft=$t(T);$&&Vt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,ft,T.width,T.height):Vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ft,ft,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ft,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Mt(C,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ct=i.get(T.depthTexture);ct.__renderTarget=T,(!ct.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const lt=ct.__webglTexture,it=$t(T);if(T.depthTexture.format===za)Vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0);else if(T.depthTexture.format===Wa)Vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Ht(C){const T=i.get(C),$=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){const ct=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ct){const lt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ct.removeEventListener("dispose",lt)};ct.addEventListener("dispose",lt),T.__depthDisposeCallback=lt}T.__boundDepthTexture=ct}if(C.depthTexture&&!T.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");Mt(T.__webglFramebuffer,C)}else if($){T.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ct]),T.__webglDepthbuffer[ct]===void 0)T.__webglDepthbuffer[ct]=n.createRenderbuffer(),j(T.__webglDepthbuffer[ct],C,!1);else{const lt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=T.__webglDepthbuffer[ct];n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,it)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),j(T.__webglDepthbuffer,C,!1);else{const ct=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,lt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Nt(C,T,$){const ct=i.get(C);T!==void 0&&pt(ct.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&Ht(C)}function jt(C){const T=C.texture,$=i.get(C),ct=i.get(T);C.addEventListener("dispose",b);const lt=C.textures,it=C.isWebGLCubeRenderTarget===!0,Ct=lt.length>1;if(Ct||(ct.__webglTexture===void 0&&(ct.__webglTexture=n.createTexture()),ct.__version=T.version,o.memory.textures++),it){$.__webglFramebuffer=[];for(let K=0;K<6;K++)if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer[K]=[];for(let ft=0;ft<T.mipmaps.length;ft++)$.__webglFramebuffer[K][ft]=n.createFramebuffer()}else $.__webglFramebuffer[K]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer=[];for(let K=0;K<T.mipmaps.length;K++)$.__webglFramebuffer[K]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(Ct)for(let K=0,ft=lt.length;K<ft;K++){const Ft=i.get(lt[K]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Vt(C)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let K=0;K<lt.length;K++){const ft=lt[K];$.__webglColorRenderbuffer[K]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[K]);const Ft=s.convert(ft.format,ft.colorSpace),nt=s.convert(ft.type),_t=_(ft.internalFormat,Ft,nt,ft.colorSpace,C.isXRRenderTarget===!0),B=$t(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,_t,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+K,n.RENDERBUFFER,$.__webglColorRenderbuffer[K])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),j($.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,ct.__webglTexture),ot(n.TEXTURE_CUBE_MAP,T);for(let K=0;K<6;K++)if(T.mipmaps&&T.mipmaps.length>0)for(let ft=0;ft<T.mipmaps.length;ft++)pt($.__webglFramebuffer[K][ft],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,ft);else pt($.__webglFramebuffer[K],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);g(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ct){for(let K=0,ft=lt.length;K<ft;K++){const Ft=lt[K],nt=i.get(Ft);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),ot(n.TEXTURE_2D,Ft),pt($.__webglFramebuffer,C,Ft,n.COLOR_ATTACHMENT0+K,n.TEXTURE_2D,0),g(Ft)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let K=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(K,ct.__webglTexture),ot(K,T),T.mipmaps&&T.mipmaps.length>0)for(let ft=0;ft<T.mipmaps.length;ft++)pt($.__webglFramebuffer[ft],C,T,n.COLOR_ATTACHMENT0,K,ft);else pt($.__webglFramebuffer,C,T,n.COLOR_ATTACHMENT0,K,0);g(T)&&p(K),e.unbindTexture()}C.depthBuffer&&Ht(C)}function ht(C){const T=C.textures;for(let $=0,ct=T.length;$<ct;$++){const lt=T[$];if(g(lt)){const it=x(C),Ct=i.get(lt).__webglTexture;e.bindTexture(it,Ct),p(it),e.unbindTexture()}}}const kt=[],V=[];function ue(C){if(C.samples>0){if(Vt(C)===!1){const T=C.textures,$=C.width,ct=C.height;let lt=n.COLOR_BUFFER_BIT;const it=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ct=i.get(C),K=T.length>1;if(K)for(let ft=0;ft<T.length;ft++)e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ct.__webglFramebuffer);for(let ft=0;ft<T.length;ft++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(lt|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(lt|=n.STENCIL_BUFFER_BIT)),K){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ct.__webglColorRenderbuffer[ft]);const Ft=i.get(T[ft]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ft,0)}n.blitFramebuffer(0,0,$,ct,0,0,$,ct,lt,n.NEAREST),l===!0&&(kt.length=0,V.length=0,kt.push(n.COLOR_ATTACHMENT0+ft),C.depthBuffer&&C.resolveDepthBuffer===!1&&(kt.push(it),V.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,V)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,kt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),K)for(let ft=0;ft<T.length;ft++){e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,Ct.__webglColorRenderbuffer[ft]);const Ft=i.get(T[ft]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,Ft,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ct.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const T=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function $t(C){return Math.min(a.maxSamples,C.samples)}function Vt(C){const T=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function It(C){const T=o.render.frame;h.get(C)!==T&&(h.set(C,T),C.update())}function Et(C,T){const $=C.colorSpace,ct=C.format,lt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||$!==$a&&$!==Ti&&(_e.getTransfer($)===Le?(ct!==Hn||lt!==xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),T}function At(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=F,this.setTexture2D=L,this.setTexture2DArray=k,this.setTexture3D=H,this.setTextureCube=O,this.rebindTextures=Nt,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Vt}function hb(n,t){function e(i,a=Ti){let s;const o=_e.getTransfer(a);if(i===xi)return n.UNSIGNED_BYTE;if(i===Dl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===kl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Bu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Nu)return n.BYTE;if(i===Ou)return n.SHORT;if(i===Es)return n.UNSIGNED_SHORT;if(i===Ll)return n.INT;if(i===ia)return n.UNSIGNED_INT;if(i===pi)return n.FLOAT;if(i===ks)return n.HALF_FLOAT;if(i===Hu)return n.ALPHA;if(i===Gu)return n.RGB;if(i===Hn)return n.RGBA;if(i===Vu)return n.LUMINANCE;if(i===Xu)return n.LUMINANCE_ALPHA;if(i===za)return n.DEPTH_COMPONENT;if(i===Wa)return n.DEPTH_STENCIL;if(i===Wu)return n.RED;if(i===Il)return n.RED_INTEGER;if(i===Yu)return n.RG;if(i===Fl)return n.RG_INTEGER;if(i===Ul)return n.RGBA_INTEGER;if(i===wo||i===Eo||i===To||i===Ao)if(o===Le)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===wo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Eo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===To)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ao)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===wo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Eo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===To)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ao)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nc||i===Oc||i===Bc||i===Hc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Nc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Oc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Bc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Gc||i===Vc||i===Xc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Gc||i===Vc)return o===Le?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Xc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Wc||i===Yc||i===$c||i===Zc||i===qc||i===jc||i===Kc||i===Jc||i===Qc||i===tl||i===el||i===nl||i===il||i===al)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Wc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Yc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$c)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===jc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Kc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qc)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===tl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===el)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nl)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===il)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===al)return o===Le?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ro||i===sl||i===ol)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Ro)return o===Le?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ol)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===$u||i===rl||i===cl||i===ll)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ro)return s.COMPRESSED_RED_RGTC1_EXT;if(i===rl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ll)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xa?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class db extends Ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class De extends Ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ub={type:"move"};class tc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new De,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new De,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new De,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const g=e.getJointPose(y,i),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(ub)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new De;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const fb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,pb=`
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

}`;class mb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new yn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ki({vertexShader:fb,fragmentShader:pb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ge(new Cn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gb extends Za{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const y=new mb,g=e.getContextAttributes();let p=null,x=null;const _=[],v=[],R=new Yt;let w=null;const b=new Ln;b.viewport=new We;const E=new Ln;E.viewport=new We;const S=[b,E],M=new db;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let q=_[et];return q===void 0&&(q=new tc,_[et]=q),q.getTargetRaySpace()},this.getControllerGrip=function(et){let q=_[et];return q===void 0&&(q=new tc,_[et]=q),q.getGripSpace()},this.getHand=function(et){let q=_[et];return q===void 0&&(q=new tc,_[et]=q),q.getHandSpace()};function D(et){const q=v.indexOf(et.inputSource);if(q===-1)return;const pt=_[q];pt!==void 0&&(pt.update(et.inputSource,et.frame,c||o),pt.dispatchEvent({type:et.type,data:et.inputSource}))}function z(){a.removeEventListener("select",D),a.removeEventListener("selectstart",D),a.removeEventListener("selectend",D),a.removeEventListener("squeeze",D),a.removeEventListener("squeezestart",D),a.removeEventListener("squeezeend",D),a.removeEventListener("end",z),a.removeEventListener("inputsourceschange",L);for(let et=0;et<_.length;et++){const q=v[et];q!==null&&(v[et]=null,_[et].disconnect(q))}P=null,F=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,x=null,dt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){s=et,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){r=et,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(et){c=et},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(et){if(a=et,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",D),a.addEventListener("selectstart",D),a.addEventListener("selectend",D),a.addEventListener("squeeze",D),a.addEventListener("squeezestart",D),a.addEventListener("squeezeend",D),a.addEventListener("end",z),a.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(R),a.renderState.layers===void 0){const q={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,q),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new aa(u.framebufferWidth,u.framebufferHeight,{format:Hn,type:xi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let q=null,pt=null,j=null;g.depth&&(j=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,q=g.stencil?Wa:za,pt=g.stencil?Xa:ia);const Mt={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(Mt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new aa(d.textureWidth,d.textureHeight,{format:Hn,type:xi,depthTexture:new cf(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),dt.setContext(a),dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function L(et){for(let q=0;q<et.removed.length;q++){const pt=et.removed[q],j=v.indexOf(pt);j>=0&&(v[j]=null,_[j].disconnect(pt))}for(let q=0;q<et.added.length;q++){const pt=et.added[q];let j=v.indexOf(pt);if(j===-1){for(let Ht=0;Ht<_.length;Ht++)if(Ht>=v.length){v.push(pt),j=Ht;break}else if(v[Ht]===null){v[Ht]=pt,j=Ht;break}if(j===-1)break}const Mt=_[j];Mt&&Mt.connect(pt)}}const k=new G,H=new G;function O(et,q,pt){k.setFromMatrixPosition(q.matrixWorld),H.setFromMatrixPosition(pt.matrixWorld);const j=k.distanceTo(H),Mt=q.projectionMatrix.elements,Ht=pt.projectionMatrix.elements,Nt=Mt[14]/(Mt[10]-1),jt=Mt[14]/(Mt[10]+1),ht=(Mt[9]+1)/Mt[5],kt=(Mt[9]-1)/Mt[5],V=(Mt[8]-1)/Mt[0],ue=(Ht[8]+1)/Ht[0],$t=Nt*V,Vt=Nt*ue,It=j/(-V+ue),Et=It*-V;if(q.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Et),et.translateZ(It),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),Mt[10]===-1)et.projectionMatrix.copy(q.projectionMatrix),et.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const At=Nt+It,C=jt+It,T=$t-Et,$=Vt+(j-Et),ct=ht*jt/C*At,lt=kt*jt/C*At;et.projectionMatrix.makePerspective(T,$,ct,lt,At,C),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function I(et,q){q===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(q.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(a===null)return;let q=et.near,pt=et.far;y.texture!==null&&(y.depthNear>0&&(q=y.depthNear),y.depthFar>0&&(pt=y.depthFar)),M.near=E.near=b.near=q,M.far=E.far=b.far=pt,(P!==M.near||F!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,F=M.far),b.layers.mask=et.layers.mask|2,E.layers.mask=et.layers.mask|4,M.layers.mask=b.layers.mask|E.layers.mask;const j=et.parent,Mt=M.cameras;I(M,j);for(let Ht=0;Ht<Mt.length;Ht++)I(Mt[Ht],j);Mt.length===2?O(M,b,E):M.projectionMatrix.copy(b.projectionMatrix),X(et,M,j)};function X(et,q,pt){pt===null?et.matrix.copy(q.matrixWorld):(et.matrix.copy(pt.matrixWorld),et.matrix.invert(),et.matrix.multiply(q.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(q.projectionMatrix),et.projectionMatrixInverse.copy(q.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=Ts*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(et){l=et,d!==null&&(d.fixedFoveation=et),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=et)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let mt=null;function ot(et,q){if(h=q.getViewerPose(c||o),m=q,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let j=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,j=!0);for(let Ht=0;Ht<pt.length;Ht++){const Nt=pt[Ht];let jt=null;if(u!==null)jt=u.getViewport(Nt);else{const kt=f.getViewSubImage(d,Nt);jt=kt.viewport,Ht===0&&(t.setRenderTargetTextures(x,kt.colorTexture,d.ignoreDepthValues?void 0:kt.depthStencilTexture),t.setRenderTarget(x))}let ht=S[Ht];ht===void 0&&(ht=new Ln,ht.layers.enable(Ht),ht.viewport=new We,S[Ht]=ht),ht.matrix.fromArray(Nt.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(Nt.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(jt.x,jt.y,jt.width,jt.height),Ht===0&&(M.matrix.copy(ht.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),j===!0&&M.cameras.push(ht)}const Mt=a.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")){const Ht=f.getDepthInformation(pt[0]);Ht&&Ht.isValid&&Ht.texture&&y.init(t,Ht,a.renderState)}}for(let pt=0;pt<_.length;pt++){const j=v[pt],Mt=_[pt];j!==null&&Mt!==void 0&&Mt.update(j,q,c||o)}mt&&mt(et,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),m=null}const dt=new of;dt.setAnimationLoop(ot),this.setAnimationLoop=function(et){mt=et},this.dispose=function(){}}}const Xi=new ni,xb=new Ie;function vb(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,nf(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,x,_,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),f(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),y(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,x,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===bn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===bn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const x=t.get(p),_=x.envMap,v=x.envMapRotation;_&&(g.envMap.value=_,Xi.copy(v),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),g.envMapRotation.value.setFromMatrix4(xb.makeRotationFromEuler(Xi)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=_*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===bn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){const x=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function _b(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){const v=_.program;i.uniformBlockBinding(x,v)}function c(x,_){let v=a[x.id];v===void 0&&(m(x),v=h(x),a[x.id]=v,x.addEventListener("dispose",g));const R=_.program;i.updateUBOMapping(x,R);const w=t.render.frame;s[x.id]!==w&&(d(x),s[x.id]=w)}function h(x){const _=f();x.__bindingPointIndex=_;const v=n.createBuffer(),R=x.__size,w=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,R,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=a[x.id],v=x.uniforms,R=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let w=0,b=v.length;w<b;w++){const E=Array.isArray(v[w])?v[w]:[v[w]];for(let S=0,M=E.length;S<M;S++){const P=E[S];if(u(P,w,S,R)===!0){const F=P.__offset,D=Array.isArray(P.value)?P.value:[P.value];let z=0;for(let L=0;L<D.length;L++){const k=D[L],H=y(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,F+z,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,z),z+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,v,R){const w=x.value,b=_+"_"+v;if(R[b]===void 0)return typeof w=="number"||typeof w=="boolean"?R[b]=w:R[b]=w.clone(),!0;{const E=R[b];if(typeof w=="number"||typeof w=="boolean"){if(E!==w)return R[b]=w,!0}else if(E.equals(w)===!1)return E.copy(w),!0}return!1}function m(x){const _=x.uniforms;let v=0;const R=16;for(let b=0,E=_.length;b<E;b++){const S=Array.isArray(_[b])?_[b]:[_[b]];for(let M=0,P=S.length;M<P;M++){const F=S[M],D=Array.isArray(F.value)?F.value:[F.value];for(let z=0,L=D.length;z<L;z++){const k=D[z],H=y(k),O=v%R,I=O%H.boundary,X=O+I;v+=I,X!==0&&R-X<H.storage&&(v+=R-X),F.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=H.storage}}}const w=v%R;return w>0&&(v+=R-w),x.__size=v,x.__cache={},this}function y(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function g(x){const _=x.target;_.removeEventListener("dispose",g);const v=o.indexOf(_.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[_.id]),delete a[_.id],delete s[_.id]}function p(){for(const x in a)n.deleteBuffer(a[x]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class yb{constructor(t={}){const{canvas:e=cx(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),y=new Int32Array(4);let g=null,p=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=vn,this.toneMapping=Li,this.toneMappingExposure=1;const v=this;let R=!1,w=0,b=0,E=null,S=-1,M=null;const P=new We,F=new We;let D=null;const z=new ie(0);let L=0,k=e.width,H=e.height,O=1,I=null,X=null;const mt=new We(0,0,k,H),ot=new We(0,0,k,H);let dt=!1;const et=new Bl;let q=!1,pt=!1;const j=new Ie,Mt=new Ie,Ht=new G,Nt=new We,jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function kt(){return E===null?O:1}let V=i;function ue(A,W){return e.getContext(A,W)}try{const A={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pl}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",wt,!1),V===null){const W="webgl2";if(V=ue(W,A),V===null)throw ue(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let $t,Vt,It,Et,At,C,T,$,ct,lt,it,Ct,K,ft,Ft,nt,_t,B,st,ut,Gt,Zt,Ut,N;function yt(){$t=new Ey(V),$t.init(),Zt=new hb(V,$t),Vt=new _y(V,$t,t,Zt),It=new rb(V,$t),Vt.reverseDepthBuffer&&d&&It.buffers.depth.setReversed(!0),Et=new Ry(V),At=new YM,C=new lb(V,$t,It,At,Vt,Zt,Et),T=new My(v),$=new wy(v),ct=new Fx(V),Ut=new xy(V,ct),lt=new Ty(V,ct,Et,Ut),it=new Cy(V,lt,ct,Et),st=new Py(V,Vt,C),nt=new yy(At),Ct=new WM(v,T,$,$t,Vt,Ut,nt),K=new vb(v,At),ft=new ZM,Ft=new tb($t),B=new gy(v,T,$,It,it,u,l),_t=new sb(v,it,Vt),N=new _b(V,Et,Vt,It),ut=new vy(V,$t,Et),Gt=new Ay(V,$t,Et),Et.programs=Ct.programs,v.capabilities=Vt,v.extensions=$t,v.properties=At,v.renderLists=ft,v.shadowMap=_t,v.state=It,v.info=Et}yt();const J=new gb(v,V);this.xr=J,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const A=$t.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=$t.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(A){A!==void 0&&(O=A,this.setSize(k,H,!1))},this.getSize=function(A){return A.set(k,H)},this.setSize=function(A,W,tt=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=A,H=W,e.width=Math.floor(A*O),e.height=Math.floor(W*O),tt===!0&&(e.style.width=A+"px",e.style.height=W+"px"),this.setViewport(0,0,A,W)},this.getDrawingBufferSize=function(A){return A.set(k*O,H*O).floor()},this.setDrawingBufferSize=function(A,W,tt){k=A,H=W,O=tt,e.width=Math.floor(A*tt),e.height=Math.floor(W*tt),this.setViewport(0,0,A,W)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(mt)},this.setViewport=function(A,W,tt,Q){A.isVector4?mt.set(A.x,A.y,A.z,A.w):mt.set(A,W,tt,Q),It.viewport(P.copy(mt).multiplyScalar(O).round())},this.getScissor=function(A){return A.copy(ot)},this.setScissor=function(A,W,tt,Q){A.isVector4?ot.set(A.x,A.y,A.z,A.w):ot.set(A,W,tt,Q),It.scissor(F.copy(ot).multiplyScalar(O).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(A){It.setScissorTest(dt=A)},this.setOpaqueSort=function(A){I=A},this.setTransparentSort=function(A){X=A},this.getClearColor=function(A){return A.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(A=!0,W=!0,tt=!0){let Q=0;if(A){let Y=!1;if(E!==null){const bt=E.texture.format;Y=bt===Ul||bt===Fl||bt===Il}if(Y){const bt=E.texture.type,Pt=bt===xi||bt===ia||bt===Es||bt===Xa||bt===Dl||bt===kl,qt=B.getClearColor(),Xt=B.getClearAlpha(),Ot=qt.r,Wt=qt.g,Dt=qt.b;Pt?(m[0]=Ot,m[1]=Wt,m[2]=Dt,m[3]=Xt,V.clearBufferuiv(V.COLOR,0,m)):(y[0]=Ot,y[1]=Wt,y[2]=Dt,y[3]=Xt,V.clearBufferiv(V.COLOR,0,y))}else Q|=V.COLOR_BUFFER_BIT}W&&(Q|=V.DEPTH_BUFFER_BIT),tt&&(Q|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",wt,!1),ft.dispose(),Ft.dispose(),At.dispose(),T.dispose(),$.dispose(),it.dispose(),Ut.dispose(),N.dispose(),Ct.dispose(),J.dispose(),J.removeEventListener("sessionstart",Ye),J.removeEventListener("sessionend",Qe),ye.stop()};function rt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=Et.autoReset,W=_t.enabled,tt=_t.autoUpdate,Q=_t.needsUpdate,Y=_t.type;yt(),Et.autoReset=A,_t.enabled=W,_t.autoUpdate=tt,_t.needsUpdate=Q,_t.type=Y}function wt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Kt(A){const W=A.target;W.removeEventListener("dispose",Kt),re(W)}function re(A){ce(A),At.remove(A)}function ce(A){const W=At.get(A).programs;W!==void 0&&(W.forEach(function(tt){Ct.releaseProgram(tt)}),A.isShaderMaterial&&Ct.releaseShaderCache(A))}this.renderBufferDirect=function(A,W,tt,Q,Y,bt){W===null&&(W=jt);const Pt=Y.isMesh&&Y.matrixWorld.determinant()<0,qt=se(A,W,tt,Q,Y);It.setMaterial(Q,Pt);let Xt=tt.index,Ot=1;if(Q.wireframe===!0){if(Xt=lt.getWireframeAttribute(tt),Xt===void 0)return;Ot=2}const Wt=tt.drawRange,Dt=tt.attributes.position;let oe=Wt.start*Ot,vt=(Wt.start+Wt.count)*Ot;bt!==null&&(oe=Math.max(oe,bt.start*Ot),vt=Math.min(vt,(bt.start+bt.count)*Ot)),Xt!==null?(oe=Math.max(oe,0),vt=Math.min(vt,Xt.count)):Dt!=null&&(oe=Math.max(oe,0),vt=Math.min(vt,Dt.count));const xt=vt-oe;if(xt<0||xt===1/0)return;Ut.setup(Y,Q,qt,tt,Xt);let Qt,he=ut;if(Xt!==null&&(Qt=ct.get(Xt),he=Gt,he.setIndex(Qt)),Y.isMesh)Q.wireframe===!0?(It.setLineWidth(Q.wireframeLinewidth*kt()),he.setMode(V.LINES)):he.setMode(V.TRIANGLES);else if(Y.isLine){let Bt=Q.linewidth;Bt===void 0&&(Bt=1),It.setLineWidth(Bt*kt()),Y.isLineSegments?he.setMode(V.LINES):Y.isLineLoop?he.setMode(V.LINE_LOOP):he.setMode(V.LINE_STRIP)}else Y.isPoints?he.setMode(V.POINTS):Y.isSprite&&he.setMode(V.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)he.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if($t.get("WEBGL_multi_draw"))he.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Bt=Y._multiDrawStarts,qe=Y._multiDrawCounts,de=Y._multiDrawCount,Ue=Xt?ct.get(Xt).bytesPerElement:1,Xn=At.get(Q).currentProgram.getUniforms();for(let ze=0;ze<de;ze++)Xn.setValue(V,"_gl_DrawID",ze),he.render(Bt[ze]/Ue,qe[ze])}else if(Y.isInstancedMesh)he.renderInstances(oe,xt,Y.count);else if(tt.isInstancedBufferGeometry){const Bt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,qe=Math.min(tt.instanceCount,Bt);he.renderInstances(oe,xt,qe)}else he.render(oe,xt)};function ae(A,W,tt){A.transparent===!0&&A.side===Be&&A.forceSinglePass===!1?(A.side=bn,A.needsUpdate=!0,te(A,W,tt),A.side=Di,A.needsUpdate=!0,te(A,W,tt),A.side=Be):te(A,W,tt)}this.compile=function(A,W,tt=null){tt===null&&(tt=A),p=Ft.get(tt),p.init(W),_.push(p),tt.traverseVisible(function(Y){Y.isLight&&Y.layers.test(W.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),A!==tt&&A.traverseVisible(function(Y){Y.isLight&&Y.layers.test(W.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights();const Q=new Set;return A.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const bt=Y.material;if(bt)if(Array.isArray(bt))for(let Pt=0;Pt<bt.length;Pt++){const qt=bt[Pt];ae(qt,tt,Y),Q.add(qt)}else ae(bt,tt,Y),Q.add(bt)}),_.pop(),p=null,Q},this.compileAsync=function(A,W,tt=null){const Q=this.compile(A,W,tt);return new Promise(Y=>{function bt(){if(Q.forEach(function(Pt){At.get(Pt).currentProgram.isReady()&&Q.delete(Pt)}),Q.size===0){Y(A);return}setTimeout(bt,10)}$t.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let we=null;function xe(A){we&&we(A)}function Ye(){ye.stop()}function Qe(){ye.start()}const ye=new of;ye.setAnimationLoop(xe),typeof self<"u"&&ye.setContext(self),this.setAnimationLoop=function(A){we=A,J.setAnimationLoop(A),A===null?ye.stop():ye.start()},J.addEventListener("sessionstart",Ye),J.addEventListener("sessionend",Qe),this.render=function(A,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(W),W=J.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,W,E),p=Ft.get(A,_.length),p.init(W),_.push(p),Mt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),et.setFromProjectionMatrix(Mt),pt=this.localClippingEnabled,q=nt.init(this.clippingPlanes,pt),g=ft.get(A,x.length),g.init(),x.push(g),J.enabled===!0&&J.isPresenting===!0){const bt=v.xr.getDepthSensingMesh();bt!==null&&ke(bt,W,-1/0,v.sortObjects)}ke(A,W,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(I,X),ht=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,ht&&B.addToRenderList(g,A),this.info.render.frame++,q===!0&&nt.beginShadows();const tt=p.state.shadowsArray;_t.render(tt,A,W),q===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,Y=g.transmissive;if(p.setupLights(),W.isArrayCamera){const bt=W.cameras;if(Y.length>0)for(let Pt=0,qt=bt.length;Pt<qt;Pt++){const Xt=bt[Pt];Z(Q,Y,A,Xt)}ht&&B.render(A);for(let Pt=0,qt=bt.length;Pt<qt;Pt++){const Xt=bt[Pt];Fe(g,A,Xt,Xt.viewport)}}else Y.length>0&&Z(Q,Y,A,W),ht&&B.render(A),Fe(g,A,W);E!==null&&(C.updateMultisampleRenderTarget(E),C.updateRenderTargetMipmap(E)),A.isScene===!0&&A.onAfterRender(v,A,W),Ut.resetDefaultState(),S=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],q===!0&&nt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function ke(A,W,tt,Q){if(A.visible===!1)return;if(A.layers.test(W.layers)){if(A.isGroup)tt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(W);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||et.intersectsSprite(A)){Q&&Nt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Mt);const Pt=it.update(A),qt=A.material;qt.visible&&g.push(A,Pt,qt,tt,Nt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||et.intersectsObject(A))){const Pt=it.update(A),qt=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Nt.copy(A.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Nt.copy(Pt.boundingSphere.center)),Nt.applyMatrix4(A.matrixWorld).applyMatrix4(Mt)),Array.isArray(qt)){const Xt=Pt.groups;for(let Ot=0,Wt=Xt.length;Ot<Wt;Ot++){const Dt=Xt[Ot],oe=qt[Dt.materialIndex];oe&&oe.visible&&g.push(A,Pt,oe,tt,Nt.z,Dt)}}else qt.visible&&g.push(A,Pt,qt,tt,Nt.z,null)}}const bt=A.children;for(let Pt=0,qt=bt.length;Pt<qt;Pt++)ke(bt[Pt],W,tt,Q)}function Fe(A,W,tt,Q){const Y=A.opaque,bt=A.transmissive,Pt=A.transparent;p.setupLightsView(tt),q===!0&&nt.setGlobalState(v.clippingPlanes,tt),Q&&It.viewport(P.copy(Q)),Y.length>0&&Rt(Y,W,tt),bt.length>0&&Rt(bt,W,tt),Pt.length>0&&Rt(Pt,W,tt),It.buffers.depth.setTest(!0),It.buffers.depth.setMask(!0),It.buffers.color.setMask(!0),It.setPolygonOffset(!1)}function Z(A,W,tt,Q){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new aa(1,1,{generateMipmaps:!0,type:$t.has("EXT_color_buffer_half_float")||$t.has("EXT_color_buffer_float")?ks:xi,minFilter:ta,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:_e.workingColorSpace}));const bt=p.state.transmissionRenderTarget[Q.id],Pt=Q.viewport||P;bt.setSize(Pt.z,Pt.w);const qt=v.getRenderTarget();v.setRenderTarget(bt),v.getClearColor(z),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),ht&&B.render(tt);const Xt=v.toneMapping;v.toneMapping=Li;const Ot=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),q===!0&&nt.setGlobalState(v.clippingPlanes,Q),Rt(A,tt,Q),C.updateMultisampleRenderTarget(bt),C.updateRenderTargetMipmap(bt),$t.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let Dt=0,oe=W.length;Dt<oe;Dt++){const vt=W[Dt],xt=vt.object,Qt=vt.geometry,he=vt.material,Bt=vt.group;if(he.side===Be&&xt.layers.test(Q.layers)){const qe=he.side;he.side=bn,he.needsUpdate=!0,Tt(xt,tt,Q,Qt,he,Bt),he.side=qe,he.needsUpdate=!0,Wt=!0}}Wt===!0&&(C.updateMultisampleRenderTarget(bt),C.updateRenderTargetMipmap(bt))}v.setRenderTarget(qt),v.setClearColor(z,L),Ot!==void 0&&(Q.viewport=Ot),v.toneMapping=Xt}function Rt(A,W,tt){const Q=W.isScene===!0?W.overrideMaterial:null;for(let Y=0,bt=A.length;Y<bt;Y++){const Pt=A[Y],qt=Pt.object,Xt=Pt.geometry,Ot=Q===null?Pt.material:Q,Wt=Pt.group;qt.layers.test(tt.layers)&&Tt(qt,W,tt,Xt,Ot,Wt)}}function Tt(A,W,tt,Q,Y,bt){A.onBeforeRender(v,W,tt,Q,Y,bt),A.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Y.onBeforeRender(v,W,tt,Q,A,bt),Y.transparent===!0&&Y.side===Be&&Y.forceSinglePass===!1?(Y.side=bn,Y.needsUpdate=!0,v.renderBufferDirect(tt,W,Q,Y,A,bt),Y.side=Di,Y.needsUpdate=!0,v.renderBufferDirect(tt,W,Q,Y,A,bt),Y.side=Be):v.renderBufferDirect(tt,W,Q,Y,A,bt),A.onAfterRender(v,W,tt,Q,Y,bt)}function te(A,W,tt){W.isScene!==!0&&(W=jt);const Q=At.get(A),Y=p.state.lights,bt=p.state.shadowsArray,Pt=Y.state.version,qt=Ct.getParameters(A,Y.state,bt,W,tt),Xt=Ct.getProgramCacheKey(qt);let Ot=Q.programs;Q.environment=A.isMeshStandardMaterial?W.environment:null,Q.fog=W.fog,Q.envMap=(A.isMeshStandardMaterial?$:T).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?W.environmentRotation:A.envMapRotation,Ot===void 0&&(A.addEventListener("dispose",Kt),Ot=new Map,Q.programs=Ot);let Wt=Ot.get(Xt);if(Wt!==void 0){if(Q.currentProgram===Wt&&Q.lightsStateVersion===Pt)return le(A,qt),Wt}else qt.uniforms=Ct.getUniforms(A),A.onBeforeCompile(qt,v),Wt=Ct.acquireProgram(qt,Xt),Ot.set(Xt,Wt),Q.uniforms=qt.uniforms;const Dt=Q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Dt.clippingPlanes=nt.uniform),le(A,qt),Q.needsLights=Ze(A),Q.lightsStateVersion=Pt,Q.needsLights&&(Dt.ambientLightColor.value=Y.state.ambient,Dt.lightProbe.value=Y.state.probe,Dt.directionalLights.value=Y.state.directional,Dt.directionalLightShadows.value=Y.state.directionalShadow,Dt.spotLights.value=Y.state.spot,Dt.spotLightShadows.value=Y.state.spotShadow,Dt.rectAreaLights.value=Y.state.rectArea,Dt.ltc_1.value=Y.state.rectAreaLTC1,Dt.ltc_2.value=Y.state.rectAreaLTC2,Dt.pointLights.value=Y.state.point,Dt.pointLightShadows.value=Y.state.pointShadow,Dt.hemisphereLights.value=Y.state.hemi,Dt.directionalShadowMap.value=Y.state.directionalShadowMap,Dt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Dt.spotShadowMap.value=Y.state.spotShadowMap,Dt.spotLightMatrix.value=Y.state.spotLightMatrix,Dt.spotLightMap.value=Y.state.spotLightMap,Dt.pointShadowMap.value=Y.state.pointShadowMap,Dt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Q.currentProgram=Wt,Q.uniformsList=null,Wt}function Jt(A){if(A.uniformsList===null){const W=A.currentProgram.getUniforms();A.uniformsList=Po.seqWithValue(W.seq,A.uniforms)}return A.uniformsList}function le(A,W){const tt=At.get(A);tt.outputColorSpace=W.outputColorSpace,tt.batching=W.batching,tt.batchingColor=W.batchingColor,tt.instancing=W.instancing,tt.instancingColor=W.instancingColor,tt.instancingMorph=W.instancingMorph,tt.skinning=W.skinning,tt.morphTargets=W.morphTargets,tt.morphNormals=W.morphNormals,tt.morphColors=W.morphColors,tt.morphTargetsCount=W.morphTargetsCount,tt.numClippingPlanes=W.numClippingPlanes,tt.numIntersection=W.numClipIntersection,tt.vertexAlphas=W.vertexAlphas,tt.vertexTangents=W.vertexTangents,tt.toneMapping=W.toneMapping}function se(A,W,tt,Q,Y){W.isScene!==!0&&(W=jt),C.resetTextureUnits();const bt=W.fog,Pt=Q.isMeshStandardMaterial?W.environment:null,qt=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:$a,Xt=(Q.isMeshStandardMaterial?$:T).get(Q.envMap||Pt),Ot=Q.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Wt=!!tt.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Dt=!!tt.morphAttributes.position,oe=!!tt.morphAttributes.normal,vt=!!tt.morphAttributes.color;let xt=Li;Q.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(xt=v.toneMapping);const Qt=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,he=Qt!==void 0?Qt.length:0,Bt=At.get(Q),qe=p.state.lights;if(q===!0&&(pt===!0||A!==M)){const mn=A===M&&Q.id===S;nt.setState(Q,A,mn)}let de=!1;Q.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==qe.state.version||Bt.outputColorSpace!==qt||Y.isBatchedMesh&&Bt.batching===!1||!Y.isBatchedMesh&&Bt.batching===!0||Y.isBatchedMesh&&Bt.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Bt.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Bt.instancing===!1||!Y.isInstancedMesh&&Bt.instancing===!0||Y.isSkinnedMesh&&Bt.skinning===!1||!Y.isSkinnedMesh&&Bt.skinning===!0||Y.isInstancedMesh&&Bt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Bt.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Bt.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Bt.instancingMorph===!1&&Y.morphTexture!==null||Bt.envMap!==Xt||Q.fog===!0&&Bt.fog!==bt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==nt.numPlanes||Bt.numIntersection!==nt.numIntersection)||Bt.vertexAlphas!==Ot||Bt.vertexTangents!==Wt||Bt.morphTargets!==Dt||Bt.morphNormals!==oe||Bt.morphColors!==vt||Bt.toneMapping!==xt||Bt.morphTargetsCount!==he)&&(de=!0):(de=!0,Bt.__version=Q.version);let Ue=Bt.currentProgram;de===!0&&(Ue=te(Q,W,Y));let Xn=!1,ze=!1,Wn=!1;const Ee=Ue.getUniforms(),pn=Bt.uniforms;if(It.useProgram(Ue.program)&&(Xn=!0,ze=!0,Wn=!0),Q.id!==S&&(S=Q.id,ze=!0),Xn||M!==A){It.buffers.depth.getReversed()?(j.copy(A.projectionMatrix),hx(j),dx(j),Ee.setValue(V,"projectionMatrix",j)):Ee.setValue(V,"projectionMatrix",A.projectionMatrix),Ee.setValue(V,"viewMatrix",A.matrixWorldInverse);const Yn=Ee.map.cameraPosition;Yn!==void 0&&Yn.setValue(V,Ht.setFromMatrixPosition(A.matrixWorld)),Vt.logarithmicDepthBuffer&&Ee.setValue(V,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ee.setValue(V,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,ze=!0,Wn=!0)}if(Y.isSkinnedMesh){Ee.setOptional(V,Y,"bindMatrix"),Ee.setOptional(V,Y,"bindMatrixInverse");const mn=Y.skeleton;mn&&(mn.boneTexture===null&&mn.computeBoneTexture(),Ee.setValue(V,"boneTexture",mn.boneTexture,C))}Y.isBatchedMesh&&(Ee.setOptional(V,Y,"batchingTexture"),Ee.setValue(V,"batchingTexture",Y._matricesTexture,C),Ee.setOptional(V,Y,"batchingIdTexture"),Ee.setValue(V,"batchingIdTexture",Y._indirectTexture,C),Ee.setOptional(V,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Ee.setValue(V,"batchingColorTexture",Y._colorsTexture,C));const ai=tt.morphAttributes;if((ai.position!==void 0||ai.normal!==void 0||ai.color!==void 0)&&st.update(Y,tt,Ue),(ze||Bt.receiveShadow!==Y.receiveShadow)&&(Bt.receiveShadow=Y.receiveShadow,Ee.setValue(V,"receiveShadow",Y.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(pn.envMap.value=Xt,pn.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&W.environment!==null&&(pn.envMapIntensity.value=W.environmentIntensity),ze&&(Ee.setValue(V,"toneMappingExposure",v.toneMappingExposure),Bt.needsLights&&ln(pn,Wn),bt&&Q.fog===!0&&K.refreshFogUniforms(pn,bt),K.refreshMaterialUniforms(pn,Q,O,H,p.state.transmissionRenderTarget[A.id]),Po.upload(V,Jt(Bt),pn,C)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Po.upload(V,Jt(Bt),pn,C),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ee.setValue(V,"center",Y.center),Ee.setValue(V,"modelViewMatrix",Y.modelViewMatrix),Ee.setValue(V,"normalMatrix",Y.normalMatrix),Ee.setValue(V,"modelMatrix",Y.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const mn=Q.uniformsGroups;for(let Yn=0,In=mn.length;Yn<In;Yn++){const ja=mn[Yn];N.update(ja,Ue),N.bind(ja,Ue)}}return Ue}function ln(A,W){A.ambientLightColor.needsUpdate=W,A.lightProbe.needsUpdate=W,A.directionalLights.needsUpdate=W,A.directionalLightShadows.needsUpdate=W,A.pointLights.needsUpdate=W,A.pointLightShadows.needsUpdate=W,A.spotLights.needsUpdate=W,A.spotLightShadows.needsUpdate=W,A.rectAreaLights.needsUpdate=W,A.hemisphereLights.needsUpdate=W}function Ze(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(A,W,tt){At.get(A.texture).__webglTexture=W,At.get(A.depthTexture).__webglTexture=tt;const Q=At.get(A);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=tt===void 0,Q.__autoAllocateDepthBuffer||$t.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,W){const tt=At.get(A);tt.__webglFramebuffer=W,tt.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(A,W=0,tt=0){E=A,w=W,b=tt;let Q=!0,Y=null,bt=!1,Pt=!1;if(A){const Xt=At.get(A);if(Xt.__useDefaultFramebuffer!==void 0)It.bindFramebuffer(V.FRAMEBUFFER,null),Q=!1;else if(Xt.__webglFramebuffer===void 0)C.setupRenderTarget(A);else if(Xt.__hasExternalTextures)C.rebindTextures(A,At.get(A.texture).__webglTexture,At.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Dt=A.depthTexture;if(Xt.__boundDepthTexture!==Dt){if(Dt!==null&&At.has(Dt)&&(A.width!==Dt.image.width||A.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(A)}}const Ot=A.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(Pt=!0);const Wt=At.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Wt[W])?Y=Wt[W][tt]:Y=Wt[W],bt=!0):A.samples>0&&C.useMultisampledRTT(A)===!1?Y=At.get(A).__webglMultisampledFramebuffer:Array.isArray(Wt)?Y=Wt[tt]:Y=Wt,P.copy(A.viewport),F.copy(A.scissor),D=A.scissorTest}else P.copy(mt).multiplyScalar(O).floor(),F.copy(ot).multiplyScalar(O).floor(),D=dt;if(It.bindFramebuffer(V.FRAMEBUFFER,Y)&&Q&&It.drawBuffers(A,Y),It.viewport(P),It.scissor(F),It.setScissorTest(D),bt){const Xt=At.get(A.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+W,Xt.__webglTexture,tt)}else if(Pt){const Xt=At.get(A.texture),Ot=W||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Xt.__webglTexture,tt||0,Ot)}S=-1},this.readRenderTargetPixels=function(A,W,tt,Q,Y,bt,Pt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let qt=At.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(qt=qt[Pt]),qt){It.bindFramebuffer(V.FRAMEBUFFER,qt);try{const Xt=A.texture,Ot=Xt.format,Wt=Xt.type;if(!Vt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=A.width-Q&&tt>=0&&tt<=A.height-Y&&V.readPixels(W,tt,Q,Y,Zt.convert(Ot),Zt.convert(Wt),bt)}finally{const Xt=E!==null?At.get(E).__webglFramebuffer:null;It.bindFramebuffer(V.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(A,W,tt,Q,Y,bt,Pt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let qt=At.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(qt=qt[Pt]),qt){const Xt=A.texture,Ot=Xt.format,Wt=Xt.type;if(!Vt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=A.width-Q&&tt>=0&&tt<=A.height-Y){It.bindFramebuffer(V.FRAMEBUFFER,qt);const Dt=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Dt),V.bufferData(V.PIXEL_PACK_BUFFER,bt.byteLength,V.STREAM_READ),V.readPixels(W,tt,Q,Y,Zt.convert(Ot),Zt.convert(Wt),0);const oe=E!==null?At.get(E).__webglFramebuffer:null;It.bindFramebuffer(V.FRAMEBUFFER,oe);const vt=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await lx(V,vt,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Dt),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,bt),V.deleteBuffer(Dt),V.deleteSync(vt),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,W=null,tt=0){A.isTexture!==!0&&(fs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1]);const Q=Math.pow(2,-tt),Y=Math.floor(A.image.width*Q),bt=Math.floor(A.image.height*Q),Pt=W!==null?W.x:0,qt=W!==null?W.y:0;C.setTexture2D(A,0),V.copyTexSubImage2D(V.TEXTURE_2D,tt,0,0,Pt,qt,Y,bt),It.unbindTexture()},this.copyTextureToTexture=function(A,W,tt=null,Q=null,Y=0){A.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,A=arguments[1],W=arguments[2],Y=arguments[3]||0,tt=null);let bt,Pt,qt,Xt,Ot,Wt,Dt,oe,vt;const xt=A.isCompressedTexture?A.mipmaps[Y]:A.image;tt!==null?(bt=tt.max.x-tt.min.x,Pt=tt.max.y-tt.min.y,qt=tt.isBox3?tt.max.z-tt.min.z:1,Xt=tt.min.x,Ot=tt.min.y,Wt=tt.isBox3?tt.min.z:0):(bt=xt.width,Pt=xt.height,qt=xt.depth||1,Xt=0,Ot=0,Wt=0),Q!==null?(Dt=Q.x,oe=Q.y,vt=Q.z):(Dt=0,oe=0,vt=0);const Qt=Zt.convert(W.format),he=Zt.convert(W.type);let Bt;W.isData3DTexture?(C.setTexture3D(W,0),Bt=V.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(C.setTexture2DArray(W,0),Bt=V.TEXTURE_2D_ARRAY):(C.setTexture2D(W,0),Bt=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,W.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,W.unpackAlignment);const qe=V.getParameter(V.UNPACK_ROW_LENGTH),de=V.getParameter(V.UNPACK_IMAGE_HEIGHT),Ue=V.getParameter(V.UNPACK_SKIP_PIXELS),Xn=V.getParameter(V.UNPACK_SKIP_ROWS),ze=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,xt.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,xt.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Xt),V.pixelStorei(V.UNPACK_SKIP_ROWS,Ot),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Wt);const Wn=A.isDataArrayTexture||A.isData3DTexture,Ee=W.isDataArrayTexture||W.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const pn=At.get(A),ai=At.get(W),mn=At.get(pn.__renderTarget),Yn=At.get(ai.__renderTarget);It.bindFramebuffer(V.READ_FRAMEBUFFER,mn.__webglFramebuffer),It.bindFramebuffer(V.DRAW_FRAMEBUFFER,Yn.__webglFramebuffer);for(let In=0;In<qt;In++)Wn&&V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,At.get(A).__webglTexture,Y,Wt+In),A.isDepthTexture?(Ee&&V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,At.get(W).__webglTexture,Y,vt+In),V.blitFramebuffer(Xt,Ot,bt,Pt,Dt,oe,bt,Pt,V.DEPTH_BUFFER_BIT,V.NEAREST)):Ee?V.copyTexSubImage3D(Bt,Y,Dt,oe,vt+In,Xt,Ot,bt,Pt):V.copyTexSubImage2D(Bt,Y,Dt,oe,vt+In,Xt,Ot,bt,Pt);It.bindFramebuffer(V.READ_FRAMEBUFFER,null),It.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else Ee?A.isDataTexture||A.isData3DTexture?V.texSubImage3D(Bt,Y,Dt,oe,vt,bt,Pt,qt,Qt,he,xt.data):W.isCompressedArrayTexture?V.compressedTexSubImage3D(Bt,Y,Dt,oe,vt,bt,Pt,qt,Qt,xt.data):V.texSubImage3D(Bt,Y,Dt,oe,vt,bt,Pt,qt,Qt,he,xt):A.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,Y,Dt,oe,bt,Pt,Qt,he,xt.data):A.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,Y,Dt,oe,xt.width,xt.height,Qt,xt.data):V.texSubImage2D(V.TEXTURE_2D,Y,Dt,oe,bt,Pt,Qt,he,xt);V.pixelStorei(V.UNPACK_ROW_LENGTH,qe),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,de),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Ue),V.pixelStorei(V.UNPACK_SKIP_ROWS,Xn),V.pixelStorei(V.UNPACK_SKIP_IMAGES,ze),Y===0&&W.generateMipmaps&&V.generateMipmap(Bt),It.unbindTexture()},this.copyTextureToTexture3D=function(A,W,tt=null,Q=null,Y=0){return A.isTexture!==!0&&(fs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),tt=arguments[0]||null,Q=arguments[1]||null,A=arguments[2],W=arguments[3],Y=arguments[4]||0),fs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,W,tt,Q,Y)},this.initRenderTarget=function(A){At.get(A).__webglFramebuffer===void 0&&C.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),It.unbindTexture()},this.resetState=function(){w=0,b=0,E=null,It.reset(),Ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=_e._getDrawingBufferColorSpace(t),e.unpackColorSpace=_e._getUnpackColorSpace()}}class Mb extends Ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ni,this.environmentIntensity=1,this.environmentRotation=new ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class bb{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=hl,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const gn=new G;class Vo{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)gn.fromBufferAttribute(this,e),gn.applyMatrix4(t),this.setXYZ(e,gn.x,gn.y,gn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)gn.fromBufferAttribute(this,e),gn.applyNormalMatrix(t),this.setXYZ(e,gn.x,gn.y,gn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)gn.fromBufferAttribute(this,e),gn.transformDirection(t),this.setXYZ(e,gn.x,gn.y,gn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Bn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ae(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Bn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Bn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Bn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Bn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),a=Ae(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),a=Ae(a,this.array),s=Ae(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new cn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Vo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ul extends oa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Aa;const ls=new G,Ra=new G,Pa=new G,Ca=new Yt,hs=new Yt,ff=new Ie,uo=new G,ds=new G,fo=new G,Od=new Yt,ec=new Yt,Bd=new Yt;class Hd extends Ve{constructor(t=new ul){if(super(),this.isSprite=!0,this.type="Sprite",Aa===void 0){Aa=new Je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new bb(e,5);Aa.setIndex([0,1,2,0,2,3]),Aa.setAttribute("position",new Vo(i,3,0,!1)),Aa.setAttribute("uv",new Vo(i,2,3,!1))}this.geometry=Aa,this.material=t,this.center=new Yt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ra.setFromMatrixScale(this.matrixWorld),ff.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Pa.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ra.multiplyScalar(-Pa.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;po(uo.set(-.5,-.5,0),Pa,o,Ra,a,s),po(ds.set(.5,-.5,0),Pa,o,Ra,a,s),po(fo.set(.5,.5,0),Pa,o,Ra,a,s),Od.set(0,0),ec.set(1,0),Bd.set(1,1);let r=t.ray.intersectTriangle(uo,ds,fo,!1,ls);if(r===null&&(po(ds.set(-.5,.5,0),Pa,o,Ra,a,s),ec.set(0,1),r=t.ray.intersectTriangle(uo,fo,ds,!1,ls),r===null))return;const l=t.ray.origin.distanceTo(ls);l<t.near||l>t.far||e.push({distance:l,point:ls.clone(),uv:Rn.getInterpolation(ls,uo,ds,fo,Od,ec,Bd,new Yt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function po(n,t,e,i,a,s){Ca.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(hs.x=s*Ca.x-a*Ca.y,hs.y=a*Ca.x+s*Ca.y):hs.copy(Ca),n.copy(t),n.x+=hs.x,n.y+=hs.y,n.applyMatrix4(ff)}class Gl extends oa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Xo=new G,Wo=new G,Gd=new Ie,us=new Nl,mo=new Qo,nc=new G,Vd=new G;class Sb extends Ve{constructor(t=new Je,e=new Gl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Xo.fromBufferAttribute(e,a-1),Wo.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Xo.distanceTo(Wo);t.setAttribute("lineDistance",new Te(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mo.copy(i.boundingSphere),mo.applyMatrix4(a),mo.radius+=s,t.ray.intersectsSphere(mo)===!1)return;Gd.copy(a).invert(),us.copy(t.ray).applyMatrix4(Gd);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=h.getX(y),x=h.getX(y+1),_=go(this,t,us,l,p,x);_&&e.push(_)}if(this.isLineLoop){const y=h.getX(m-1),g=h.getX(u),p=go(this,t,us,l,y,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let y=u,g=m-1;y<g;y+=c){const p=go(this,t,us,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=go(this,t,us,l,m-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function go(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Xo.fromBufferAttribute(o,a),Wo.fromBufferAttribute(o,s),e.distanceSqToSegment(Xo,Wo,nc,Vd)>i)return;nc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(nc);if(!(l<t.near||l>t.far))return{distance:l,point:Vd.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Xd=new G,Wd=new G;class pf extends Sb{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Xd.fromBufferAttribute(e,a),Wd.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Xd.distanceTo(Wd);t.setAttribute("lineDistance",new Te(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fl extends yn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ii{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Yt:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,l=new Ie;for(let u=0;u<=t;u++){const m=u/t;a[u]=this.getTangentAt(m,new G)}s[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(rn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(rn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],u*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Vl extends ii{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Yt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class wb extends Vl{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Xl(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const xo=new G,ic=new Xl,ac=new Xl,sc=new Xl;class Eb extends ii{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(xo.subVectors(a[0],a[1]).add(a[0]),c=xo);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(xo.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=xo),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),ic.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,y,g),ac.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,y,g),sc.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(ic.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),ac.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),sc.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(ic.calc(l),ac.calc(l),sc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Yd(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function Tb(n,t){const e=1-n;return e*e*t}function Ab(n,t){return 2*(1-n)*n*t}function Rb(n,t){return n*n*t}function xs(n,t,e,i){return Tb(n,t)+Ab(n,e)+Rb(n,i)}function Pb(n,t){const e=1-n;return e*e*e*t}function Cb(n,t){const e=1-n;return 3*e*e*n*t}function Lb(n,t){return 3*(1-n)*n*n*t}function Db(n,t){return n*n*n*t}function vs(n,t,e,i,a){return Pb(n,t)+Cb(n,e)+Lb(n,i)+Db(n,a)}class mf extends ii{constructor(t=new Yt,e=new Yt,i=new Yt,a=new Yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(vs(t,a.x,s.x,o.x,r.x),vs(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kb extends ii{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(vs(t,a.x,s.x,o.x,r.x),vs(t,a.y,s.y,o.y,r.y),vs(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class gf extends ii{constructor(t=new Yt,e=new Yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Yt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ib extends ii{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xf extends ii{constructor(t=new Yt,e=new Yt,i=new Yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(xs(t,a.x,s.x,o.x),xs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fb extends ii{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(xs(t,a.x,s.x,o.x),xs(t,a.y,s.y,o.y),xs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vf extends ii{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Yt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(Yd(r,l.x,c.x,h.x,f.x),Yd(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Yt().fromArray(a))}return this}}var $d=Object.freeze({__proto__:null,ArcCurve:wb,CatmullRomCurve3:Eb,CubicBezierCurve:mf,CubicBezierCurve3:kb,EllipseCurve:Vl,LineCurve:gf,LineCurve3:Ib,QuadraticBezierCurve:xf,QuadraticBezierCurve3:Fb,SplineCurve:vf});class Ub extends ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $d[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new $d[a.type]().fromJSON(a))}return this}}class Zd extends Ub{constructor(t){super(),this.type="Path",this.currentPoint=new Yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new gf(this.currentPoint.clone(),new Yt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new xf(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new mf(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a),new Yt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new vf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Vl(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Wl extends Je{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new G,h=new Yt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Te(o,3)),this.setAttribute("normal",new Te(r,3)),this.setAttribute("uv",new Te(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class As extends Je{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let m=0;const y=[],g=i/2;let p=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Te(f,3)),this.setAttribute("normal",new Te(d,3)),this.setAttribute("uv",new Te(u,2));function x(){const v=new G,R=new G;let w=0;const b=(e-t)/i;for(let E=0;E<=s;E++){const S=[],M=E/s,P=M*(e-t)+t;for(let F=0;F<=a;F++){const D=F/a,z=D*l+r,L=Math.sin(z),k=Math.cos(z);R.x=P*L,R.y=-M*i+g,R.z=P*k,f.push(R.x,R.y,R.z),v.set(L,b,k).normalize(),d.push(v.x,v.y,v.z),u.push(D,1-M),S.push(m++)}y.push(S)}for(let E=0;E<a;E++)for(let S=0;S<s;S++){const M=y[S][E],P=y[S+1][E],F=y[S+1][E+1],D=y[S][E+1];(t>0||S!==0)&&(h.push(M,P,D),w+=3),(e>0||S!==s-1)&&(h.push(P,F,D),w+=3)}c.addGroup(p,w,0),p+=w}function _(v){const R=m,w=new Yt,b=new G;let E=0;const S=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=a;F++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),m++;const P=m;for(let F=0;F<=a;F++){const z=F/a*l+r,L=Math.cos(z),k=Math.sin(z);b.x=S*k,b.y=g*M,b.z=S*L,f.push(b.x,b.y,b.z),d.push(0,M,0),w.x=L*.5+.5,w.y=k*.5*M+.5,u.push(w.x,w.y),m++}for(let F=0;F<a;F++){const D=R+F,z=P+F;v===!0?h.push(z,z+1,D):h.push(z+1,z,D),E+=3}c.addGroup(p,E,v===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new As(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yl extends As{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Yl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $l extends Je{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Te(s,3)),this.setAttribute("normal",new Te(s.slice(),3)),this.setAttribute("uv",new Te(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const _=new G,v=new G,R=new G;for(let w=0;w<e.length;w+=3)u(e[w+0],_),u(e[w+1],v),u(e[w+2],R),l(_,v,R,x)}function l(x,_,v,R){const w=R+1,b=[];for(let E=0;E<=w;E++){b[E]=[];const S=x.clone().lerp(v,E/w),M=_.clone().lerp(v,E/w),P=w-E;for(let F=0;F<=P;F++)F===0&&E===w?b[E][F]=S:b[E][F]=S.clone().lerp(M,F/P)}for(let E=0;E<w;E++)for(let S=0;S<2*(w-E)-1;S++){const M=Math.floor(S/2);S%2===0?(d(b[E][M+1]),d(b[E+1][M]),d(b[E][M])):(d(b[E][M+1]),d(b[E+1][M+1]),d(b[E+1][M]))}}function c(x){const _=new G;for(let v=0;v<s.length;v+=3)_.x=s[v+0],_.y=s[v+1],_.z=s[v+2],_.normalize().multiplyScalar(x),s[v+0]=_.x,s[v+1]=_.y,s[v+2]=_.z}function h(){const x=new G;for(let _=0;_<s.length;_+=3){x.x=s[_+0],x.y=s[_+1],x.z=s[_+2];const v=g(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(v,1-R)}m(),f()}function f(){for(let x=0;x<o.length;x+=6){const _=o[x+0],v=o[x+2],R=o[x+4],w=Math.max(_,v,R),b=Math.min(_,v,R);w>.9&&b<.1&&(_<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){s.push(x.x,x.y,x.z)}function u(x,_){const v=x*3;_.x=t[v+0],_.y=t[v+1],_.z=t[v+2]}function m(){const x=new G,_=new G,v=new G,R=new G,w=new Yt,b=new Yt,E=new Yt;for(let S=0,M=0;S<s.length;S+=9,M+=6){x.set(s[S+0],s[S+1],s[S+2]),_.set(s[S+3],s[S+4],s[S+5]),v.set(s[S+6],s[S+7],s[S+8]),w.set(o[M+0],o[M+1]),b.set(o[M+2],o[M+3]),E.set(o[M+4],o[M+5]),R.copy(x).add(_).add(v).divideScalar(3);const P=g(R);y(w,M+0,x,P),y(b,M+2,_,P),y(E,M+4,v,P)}}function y(x,_,v,R){R<0&&x.x===1&&(o[_]=x.x-1),v.x===0&&v.z===0&&(o[_]=R/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $l(t.vertices,t.indices,t.radius,t.details)}}const vo=new G,_o=new G,oc=new G,yo=new Rn;class zb extends Je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Na*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:y,b:g,c:p}=yo;if(y.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),yo.getNormal(oc),f[0]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,f[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,v=f[x],R=f[_],w=yo[h[x]],b=yo[h[_]],E=`${v}_${R}`,S=`${R}_${v}`;S in d&&d[S]?(oc.dot(d[S].normal)<=s&&(u.push(w.x,w.y,w.z),u.push(b.x,b.y,b.z)),d[S]=null):E in d||(d[E]={index0:c[x],index1:c[_],normal:oc.clone()})}}for(const m in d)if(d[m]){const{index0:y,index1:g}=d[m];vo.fromBufferAttribute(r,y),_o.fromBufferAttribute(r,g),u.push(vo.x,vo.y,vo.z),u.push(_o.x,_o.y,_o.z)}this.setAttribute("position",new Te(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class _f extends Zd{constructor(t){super(t),this.uuid=ei(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Zd().fromJSON(a))}return this}}const Nb={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=yf(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=Vb(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Rs(s,o,e,r,l,u,0),o}};function yf(n,t,e,i,a){let s,o;if(a===tS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=qd(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=qd(s,n[s],n[s+1],o);return o&&er(o,o.next)&&(Cs(o),o=o.next),o}function sa(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(er(e,e.next)||Ge(e.prev,e,e.next)===0)){if(Cs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Rs(n,t,e,i,a,s,o){if(!n)return;!o&&s&&Zb(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?Bb(n,i,a,s):Ob(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Cs(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=Hb(sa(n),t,e),Rs(n,t,e,i,a,s,2)):o===2&&Gb(n,t,e,i,a,s):Rs(sa(n),t,e,i,a,s,1);break}}}function Ob(n){const t=n.prev,e=n,i=n.next;if(Ge(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&Ia(a,r,s,l,o,c,m.x,m.y)&&Ge(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Bb(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ge(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=pl(u,m,t,e,i),x=pl(y,g,t,e,i);let _=n.prevZ,v=n.nextZ;for(;_&&_.z>=p&&v&&v.z<=x;){if(_.x>=u&&_.x<=y&&_.y>=m&&_.y<=g&&_!==a&&_!==o&&Ia(r,h,l,f,c,d,_.x,_.y)&&Ge(_.prev,_,_.next)>=0||(_=_.prevZ,v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&Ia(r,h,l,f,c,d,v.x,v.y)&&Ge(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=y&&_.y>=m&&_.y<=g&&_!==a&&_!==o&&Ia(r,h,l,f,c,d,_.x,_.y)&&Ge(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=y&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&Ia(r,h,l,f,c,d,v.x,v.y)&&Ge(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Hb(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!er(a,s)&&Mf(a,i,i.next,s)&&Ps(a,s)&&Ps(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Cs(i),Cs(i.next),i=n=s),i=i.next}while(i!==n);return sa(i)}function Gb(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&Kb(o,r)){let l=bf(o,r);o=sa(o,o.next),l=sa(l,l.next),Rs(o,t,e,i,a,s,0),Rs(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function Vb(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=yf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(jb(c));for(a.sort(Xb),s=0;s<a.length;s++)e=Wb(a[s],e);return e}function Xb(n,t){return n.x-t.x}function Wb(n,t){const e=Yb(n,t);if(!e)return t;const i=bf(e,n);return sa(i,i.next),sa(e,e.next)}function Yb(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Ia(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Ps(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&$b(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function $b(n,t){return Ge(n.prev,n,t.prev)<0&&Ge(t.next,n,n.next)<0}function Zb(n,t,e,i){let a=n;do a.z===0&&(a.z=pl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,qb(a)}function qb(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function pl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function jb(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ia(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function Kb(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!Jb(n,t)&&(Ps(n,t)&&Ps(t,n)&&Qb(n,t)&&(Ge(n.prev,n,t.prev)||Ge(n,t.prev,t))||er(n,t)&&Ge(n.prev,n,n.next)>0&&Ge(t.prev,t,t.next)>0)}function Ge(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function er(n,t){return n.x===t.x&&n.y===t.y}function Mf(n,t,e,i){const a=bo(Ge(n,t,e)),s=bo(Ge(n,t,i)),o=bo(Ge(e,i,n)),r=bo(Ge(e,i,t));return!!(a!==s&&o!==r||a===0&&Mo(n,e,t)||s===0&&Mo(n,i,t)||o===0&&Mo(e,n,i)||r===0&&Mo(e,t,i))}function Mo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function bo(n){return n>0?1:n<0?-1:0}function Jb(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Mf(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Ps(n,t){return Ge(n.prev,n,n.next)<0?Ge(n,t,n.next)>=0&&Ge(n,n.prev,t)>=0:Ge(n,t,n.prev)<0||Ge(n,n.next,t)<0}function Qb(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function bf(n,t){const e=new ml(n.i,n.x,n.y),i=new ml(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function qd(n,t,e,i){const a=new ml(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Cs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ml(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function tS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class _s{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return _s.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];jd(t),Kd(i,t);let o=t.length;e.forEach(jd);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,Kd(i,e[l]);const r=Nb.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function jd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Kd(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Zl extends $l{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Zl(t.radius,t.detail)}}class Ls extends Je{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new G,m=new Yt;for(let y=0;y<=a;y++){for(let g=0;g<=i;g++){const p=s+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let y=0;y<a;y++){const g=y*(i+1);for(let p=0;p<i;p++){const x=p+g,_=x,v=x+i+1,R=x+i+2,w=x+1;r.push(_,v,w),r.push(v,R,w)}}this.setIndex(r),this.setAttribute("position",new Te(l,3)),this.setAttribute("normal",new Te(c,3)),this.setAttribute("uv",new Te(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ls(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ql extends Je{constructor(t=new _f([new Yt(0,.5),new Yt(-.5,-.5),new Yt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Te(a,3)),this.setAttribute("normal",new Te(s,3)),this.setAttribute("uv",new Te(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;_s.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const x=m[g];_s.isClockWise(x)===!0&&(m[g]=x.reverse())}const y=_s.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const x=m[g];u=u.concat(x)}for(let g=0,p=u.length;g<p;g++){const x=u[g];a.push(x.x,x.y,0),s.push(0,0,1),o.push(x.x,x.y)}for(let g=0,p=y.length;g<p;g++){const x=y[g],_=x[0]+f,v=x[1]+f,R=x[2]+f;i.push(_,v,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return eS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new ql(i,t.curveSegments)}}function eS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class nr extends Je{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let m=0;m<=a;m++){const y=m/a*s,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(y),f.y=(t+e*Math.cos(g))*Math.sin(y),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=a;m++){const y=(a+1)*u+m-1,g=(a+1)*(u-1)+m-1,p=(a+1)*(u-1)+m,x=(a+1)*u+m;o.push(y,g,x),o.push(g,p,x)}this.setIndex(o),this.setAttribute("position",new Te(r,3)),this.setAttribute("normal",new Te(l,3)),this.setAttribute("uv",new Te(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ds extends oa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zu,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Sf extends Ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class nS extends Sf{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ie(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const rc=new Ie,Jd=new G,Qd=new G;class iS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bl,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new We(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jd),Qd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qd),e.updateMatrixWorld(),rc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(rc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class aS extends iS{constructor(){super(new rf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sS extends Sf{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.target=new Ve,this.shadow=new aS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const tu=new Ie;class oS{constructor(t,e,i=0,a=1/0){this.ray=new Nl(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Ol,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tu),this}intersectObject(t,e=!0,i=[]){return gl(t,this,i,e),i.sort(eu),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)gl(t[a],this,i,e);return i.sort(eu),i}}function eu(n,t){return n.distance-t.distance}function gl(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)gl(s[o],t,e,!0)}}class rS extends pf{constructor(t=10,e=10,i=4473924,a=8947848){i=new ie(i),a=new ie(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const y=d===s?i:a;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new Je;h.setAttribute("position",new Te(l,3)),h.setAttribute("color",new Te(c,3));const f=new Gl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pl);const cS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function lS(n,t,e,i){const a=new Ln(n.fov,i,.1,200),s=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(u),Math.sin(u),Math.cos(m)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:a,update(u,m,y,g,p=cS){const x=m+.6;if(!l)s.set(u,x,y),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*g);s.x+=(u-s.x)*R,s.y+=(x-s.y)*R,s.z+=(y-s.z)*R}const _=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(p.distanceScale-h.distanceScale)*_,h.offsetX+=(p.offsetX-h.offsetX)*_,h.offsetZ+=(p.offsetZ-h.offsetZ)*_,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*_;const v=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*v,d(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},snap(u,m,y){s.set(u,m+.6,y),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),d(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(u){a.aspect=u,a.updateProjectionMatrix()},getGroundBasis(){const u=new G().setFromMatrixColumn(a.matrixWorld,0),m=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),y=Math.hypot(u.x,u.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:u.x/y,rightZ:u.z/y,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const ea=Math.PI*2,Dn=1e-6;function Sn(n,t,e){return n<t?t:n>e?e:n}function wf(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function hS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Ef(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=hS(n);return i===1?a:e+(a-e)*i}function nu(n){return(1-Math.sin(n))/2}function jl(n,t,e){const i=Math.PI/180,a=Sn(Number.isFinite(t)?t:100,0,180),s=Sn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Sn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Kl(n,t){if(!n.grounded||n.speed<Dn)return wf();const e=n.speed/Math.max(n.moveSpeed,Dn),i=Math.max(n.legLength,Dn),a=n.stride>Dn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Dn,h=jl(n.localForward/Math.max(n.speed,Dn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,y=a,g=z=>Math.asin(Sn(z,-o,o)/i);function p(z,L){const k=Ef(z,t.plantLock),H=nu(z),O=u*d*y*k,I=-g(O),X=L*m>0?1:-1,mt=1+X*t.crossStep*.45,ot=m*X*t.crossStep*y*.4*H,dt=m*f*y*t.sideWeight*mt*k+ot*f,et=g(dt),q=t.kneeLift*H*s*(.55+.25*d+(X>0?.2*f:0));return{pitchX:I,rollZ:et,kneeX:q}}const x=(n.phase%ea+ea)%ea,_=p(x,-1),v=p((x+Math.PI)%ea,1),R=Math.cos(x),w=nu(x),b=-t.comSway*s*R*(.6*d+.8*f)-m*t.comSway*s*f*.45,E=t.comBob*w*s,S=m*t.hipLean*s*f*R*.6,M=m*t.hipLean*s*f*(.45+.25*R),P=t.armSwing*s*R*(d*u+.3*f),F=P,D=-P;return{legL:_,legR:v,pelvisX:b,pelvisY:E,pelvisRoll:S,sideLean:M,armL:F,armR:D,strafe:f,backward:u<0?d:0}}function Tf(n){const t=(n%ea+ea)%ea,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Af(n,t,e){const i=Sn(e.progress,0,1);if(i>=1||n.speed<Dn)return wf();const a=i*i*(3-2*i),s=1-a;return Kl({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Rf(n,t,e,i){const a=Sn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Sn(o*a,-1,1)*(e*Math.PI/180)}function Pf(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Sn(i,0,1),c=l*l;return e*c+r*(1-c)}function Cf(n,t,e,i,a){const s=Math.max(e,Dn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Dn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Dn&&n<=o&&c,resume:!d}}function Lf(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Sn(n*Sn(t,0,2),-i,i)}function Df(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function kf(n,t,e){const i=Sn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function dS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Sn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function If(n,t,e,i,a){const s=Sn(n,0,1),o=Sn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>Dn?e/h:1,d=h>Dn?i/h:0,u=Ef(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function _n(n){return n<0?0:n>1?1:n}const Co=Math.PI*2;function uS(n){return((n+Math.PI)%Co+Co)%Co-Math.PI}function fS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function pS(n,t,e,i,a,s=n.phase){const o=_n(i);if(o<=0)return n;const r=_n(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=_n(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,y=m*m*(3-2*m),g=r<=.5?y:1-y,p={speed:c,phase:s+Co*l/2*g,localForward:c*f,localRight:c*(1-f)*h},x=uS(p.phase-n.phase),_=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*_,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function mS(n,t,e){const i=fS(),a=_n(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function Ff(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function iu(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Ff(s,a)}function gS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function xS(n,t,e){const i=_n(n);return{gaitScale:1-i*(1-_n(t)),attackLegWeight:_n(e)*i}}function vS(n,t){const e=_n(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function _S(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return _n(t.minScale+(1-t.minScale)*e)}function yS(){return Uf()}function Uf(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function MS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function bS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?_n(t.forceHitHeight):n.type==="light"?_n(t.hitHeight.light):n.type==="heavy"?_n(t.hitHeight.heavy):n.type==="knock"?_n(t.hitHeight.knock):0}function SS(n,t,e){const i=_n(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function zf(n,t,e){const i=Uf(),a=MS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=_n(1-n.timer/n.duration),o=Ff(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=bS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*s);return i.upperPitch=a*y*f,i.upperRoll=-a*y*d*.7,i.drop=(a>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=a*o,m=SS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function Nf(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Wi=1e-6;function ys(n,t,e){return n<t?t:n>e?e:n}function Of(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Wi||s<=Wi||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+Wi,c=Math.hypot(n.x,n.y,n.z);if(c<=Wi)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=ys(u,l,r),y=u>r+Wi||u<l-Wi,g=Math.atan2(-d,Math.max(f,Wi)),p=ys((a*a+m*m-s*s)/(2*a*m),-1,1),x=ys((s*s+m*m-a*a)/(2*s*m),-1,1),_=Math.acos(p),v=Math.acos(x),R=i>=0?1:-1;return{rootPitch:g-R*_,rootRoll:h,jointPitch:R*(_+v),clamped:y,reach:c/r}}function Bf(n,t,e,i){const a=ys(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=ys((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Hf(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Jl={active:!1,weight:0,clamped:0,maxError:0};function Gf(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Jl};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const m=a[u],y=i.worldToLocal(l[u].clone()),g={x:y.x-m.root.position.x,y:y.y-m.root.position.y,z:y.z-m.root.position.z},p=Of(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const x=Bf({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=x.rootPitch,m.root.rotation.z=x.rootRoll,m.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const m=a[u].tip.getWorldPosition(new G);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Tn(n,t,e){return n<t?t:n>e?e:n}function wS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new De,d=new De;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new De;u.name="lower";const m=new De;m.name="upper",d.add(u),d.add(m);const y=[],g=(K,ft,Ft,nt)=>{const _t=new Ds({color:nt}),B=new ge(new Vn(K,ft,Ft),_t);return B.castShadow=!0,B.receiveShadow=!0,y.push(_t),B},p=n.headSize,x=n.legLength,_=n.armLength,v=n.limbThickness,R=n.bodyHeight,w=n.bodyWidth,b=g(w,R,.28,e);b.position.y=R/2,m.add(b);const E=new De;E.name="headPivot",E.rotation.order="YXZ",E.position.y=R,m.add(E);const S=g(p,p,p,e);S.position.y=p/2,E.add(S);for(const K of[-1,1]){const ft=g(.06,.07,.02,t.shoe);ft.position.set(K*.09,p/2+.03,p/2+.011),E.add(ft)}const M=(K,ft)=>{const Ft=ft?_:x,nt=new De;nt.name=ft?K<0?"shoulderL":"shoulderR":K<0?"hipL":"hipR",ft||(nt.rotation.order="ZYX"),nt.position.set(K*(ft?w/2+v/2:w/2-v/2),ft?R-.04:0,0),(ft?m:u).add(nt);const _t=g(v,Ft/2,v,t.limb);_t.position.y=-Ft/4,nt.add(_t);const B=new De;B.name=ft?"elbow":"knee",B.position.y=-Ft/2,nt.add(B);const st=g(v,Ft/2,v,t.limb);if(st.position.y=-Ft/4,B.add(st),!ft){const ut=g(v*1.15,.07,v*1.7,t.shoe);ut.position.set(0,-Ft/2+.035,.045),B.add(ut);const Gt=new Ve;return Gt.name="footTip",Gt.position.y=-Ft/2,B.add(Gt),{root:nt,joint:B,tip:Gt}}return{root:nt,joint:B}},P=M(-1,!1),F=M(1,!1),D=M(-1,!0),z=M(1,!0),L=[P,F].map(K=>({root:K.root,joint:K.joint,tip:K.tip,upperLen:x/2,lowerLen:x/2,bend:1})),k=new tn({color:a.attackArcColor,transparent:!0,opacity:0,side:Be,depthWrite:!1}),H=new ge(new nr(.62,.042,6,20,Math.PI*1.1),k);H.position.set(0,.78-x,.56),m.add(H);const O=new ie(e),I=new ie(r.flashColor),X=new ie;let mt=null,ot=0,dt=0,et=0,q=0,pt=0,j=0,Mt=0,Ht={...Jl},Nt=-1,jt=0,ht=0,kt=0,V=0,ue=0,$t=0,Vt=0,It=1,Et=0,At=0,C="none",T=0,$=!1,ct=-1,lt=!1,it=0,Ct=0;return{group:f,boneAtWorld(K,ft,Ft){const nt=[{node:m,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],_t=new G,B=new G,st=new G(K,ft,Ft),ut=new G;let Gt=null,Zt=Number.POSITIVE_INFINITY;for(const Ut of nt){Ut.node.updateWorldMatrix(!0,!1),_t.set(Ut.ax,Ut.ay,Ut.az),B.set(Ut.bx,Ut.by,Ut.bz),Ut.node.localToWorld(_t),Ut.node.localToWorld(B);const N=B.x-_t.x,yt=B.y-_t.y,J=B.z-_t.z,rt=N*N+yt*yt+J*J;let St=rt>1e-8?((st.x-_t.x)*N+(st.y-_t.y)*yt+(st.z-_t.z)*J)/rt:0;St=Math.max(0,Math.min(1,St));const wt=_t.x+N*St,Kt=_t.y+yt*St,re=_t.z+J*St,ce=(st.x-wt)**2+(st.y-Kt)**2+(st.z-re)**2;ce<Zt&&(Zt=ce,Gt=Ut.node,ut.set(wt,Kt,re))}return Gt?{node:Gt,point:ut.clone()}:null},update(K,ft){f.position.set(K.position.x,K.position.y,K.position.z),f.rotation.y=K.bodyYaw,E.rotation.y=(K.headYaw-K.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,K.mode!==mt&&(mt=K.mode,ot=1),ot=Math.max(0,ot-ft*2.2);const Ft=K.hurt,nt=zf(Ft,K.bodyYaw,r),_t=nt.flash;X.copy(I).multiplyScalar(_t);for(const Ot of y)Ot.emissive.copy(O).multiplyScalar(ot*.5),_t>0&&Ot.emissive.add(X);d.position.set(0,x,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const B=Math.hypot(K.velocity.x,K.velocity.z),st=Tn(o.knockGaitScale??0,0,1),ut=K.hurt.knockX*st,Gt=K.hurt.knockZ*st,Zt=st>0&&Math.hypot(K.hurt.knockX,K.hurt.knockZ)>.001,Ut=K.velocity.x+ut,N=K.velocity.z+Gt,yt=Math.hypot(Ut,N),J=Math.cos(K.bodyYaw),rt=-Math.sin(K.bodyYaw),St=B>1e-6?Tn((K.velocity.x*J+K.velocity.z*rt)/B,-1,1):0,wt=B>1e-6?Tn((K.velocity.x*Math.sin(K.bodyYaw)+K.velocity.z*Math.cos(K.bodyYaw))/B,-1,1):1,Kt=jl(wt,o.backStrafeStartDeg,o.backStrafeFullDeg);C==="settled"&&lt&&it>Ct*1.02+1e-4&&(C="none");let re=1;C==="blend"?(re=kf($?ct:T,o.stopYawBlendMode,$),$||(T=Math.min(1,T+ft/Math.max(.01,o.stopYawAfterSec)),(T>=1||o.stopYawBlendMode==="inStop"||lt)&&(C="settled",re=0))):C==="settled"&&(re=Tn(B/Math.max(1e-6,o.stopEnterRatio*s),0,1));const ce=Rf(St,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ae=Pf(wt,St,ce,Kt)*re;Et+=(ae-Et)*(1-Math.exp(-12*Math.max(0,ft))),u.rotation.y=Et;const we=K.bodyYaw+Et,xe=Math.sin(we),Ye=Math.cos(we),Qe=Math.cos(we),ye=-Math.sin(we),ke=Ut*xe+N*Ye,Fe=Ut*Qe+N*ye,Z=Math.max(0,o.stopBlendSec||0),Rt=Z>0&&!Zt,Tt=Cf(B,At,s,o.stopEnterRatio,o.stopExitRatio);if(!Rt||Tt.resume)Nt=-1;else if(Nt<0&&Tt.enter){Nt=0,jt=K.gaitPhase,ht=Tf(K.gaitPhase),kt=B,V=Math.max(K.stride,1e-6),ue=ke,$t=Fe;const Ot=1/Math.max(1e-6,B);Vt=K.velocity.x*Ot,It=K.velocity.z*Ot}const te=At;At=B;const Jt=Rt&&Nt>=0;Jt&&(Nt=Math.min(1,Nt+ft/Z)),Jt&&C!=="blend"&&(C="blend",T=0),$=Jt&&Nt<1,ct=Nt,lt=Tt.resume,it=B,Ct=te;const le=Jt?{phase:jt,speed:kt,moveSpeed:s,localForward:ue,localRight:$t,legLength:n.legLength,stride:V,grounded:!0}:{phase:K.gaitPhase,speed:yt,moveSpeed:s,localForward:ke,localRight:Fe,legLength:n.legLength,stride:K.stride,grounded:!0},se=Jt?Af(le,o,{progress:Nt,phase0:jt,phaseEnd:ht}):Kl(le,o);let ln=0,Ze=0,A=0,W=0;if(Jt){const Ot=Df(K.bodyYaw,Vt,It),Wt=If(Nt,jt,Ot.forward,Ot.right,o);Wt.leadLeft?(se.legL.pitchX-=Wt.leadPitch,se.legL.kneeX+=Wt.leadKnee,se.legR.pitchX+=Wt.trailPitch):(se.legR.pitchX-=Wt.leadPitch,se.legR.kneeX+=Wt.leadKnee,se.legL.pitchX+=Wt.trailPitch),Ze=Wt.bodyShift*Wt.fwdN,ln=Wt.bodyShift*Wt.rightN,A=Wt.bodyDip,W=Wt.chestPitch}P.root.rotation.x=se.legL.pitchX,F.root.rotation.x=se.legR.pitchX,P.root.rotation.z=se.legL.rollZ,F.root.rotation.z=se.legR.rollZ,P.joint.rotation.x=se.legL.kneeX,F.joint.rotation.x=se.legR.kneeX,D.root.rotation.x=se.armL,z.root.rotation.x=se.armR,D.joint.rotation.x=-.18,z.joint.rotation.x=-.18,d.position.x=se.pelvisX,d.position.y=x+se.pelvisY,d.position.z=0,d.rotation.z=se.pelvisRoll,m.rotation.z=se.sideLean*(nt.intensity>0?.4:1);const tt=Hf(d,u),Q=Jt&&h.enabled?{...h,weight:1}:h,Y=Q.enabled&&Q.weight>0?Tn(Q.weight,0,1):0;if(d.position.x+=ln,d.position.z+=Ze,d.position.y-=A,u.position.y+=A,Y<=0&&(u.position.x-=ln,u.position.z-=Ze),l){const Ot=Math.max(.004166666666666667,Math.min(ft,.1)),Wt=Math.sin(K.bodyYaw),Dt=Math.cos(K.bodyYaw),oe=Tn((K.velocity.x-dt)/Ot,-60,60),vt=Tn((K.velocity.z-et)/Ot,-60,60),xt=oe*Wt+vt*Dt,Qt=He(K.bodyYaw-q)/Ot,he=l.maxForwardDeg*Math.PI/180,Bt=l.maxSideDeg*Math.PI/180,qe=1-Math.exp(-Math.max(0,l.smoothing)*Ot);pt+=(Tn(xt*l.accelGain,-he,he)-pt)*qe,j+=(Tn(-Qt*B*l.turnGain,-Bt,Bt)-j)*qe;const de=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;Mt+=(Tn(B/Math.max(s,1e-6),0,1)-Mt)*(1-Math.exp(-Math.max(0,de)*Ot));const Ue=Nf({leanForward:pt,leanSide:j,speedRatio:Mt},l);m.rotation.x+=pt+W,m.rotation.z+=j,d.rotation.x+=Ue.pelvisPitch,d.rotation.z+=Ue.pelvisRoll,d.position.x+=Ue.pelvisX,d.position.z+=Ue.pelvisZ,d.position.y-=Ue.crouch,u.position.y+=Ue.crouch*(1-Y)}dt=K.velocity.x,et=K.velocity.z,q=K.bodyYaw,m.rotation.x+=nt.upperPitch,m.rotation.z+=nt.upperRoll,m.rotation.y+=nt.upperYaw;const bt=Tn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Pt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Tn(nt.upperShiftX*bt,-Pt,Pt),m.position.z+=Tn(nt.upperShiftZ*bt,-Pt,Pt),d.position.x+=nt.comX,d.position.z+=nt.comZ-nt.pelvisBack,d.position.y-=nt.drop;const qt=nt.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=nt.pelvisBack*(1-qt),u.position.y+=nt.drop*(1-qt),P.joint.rotation.x+=nt.knee,F.joint.rotation.x+=nt.knee,P.root.rotation.x-=nt.hip,F.root.rotation.x-=nt.hip,D.root.rotation.x+=nt.arm,z.root.rotation.x+=nt.arm*.8,K.attackPhase!=="idle"&&nt.intensity===0){const Ot=K.attackProgress,Wt=Ot<.34?-1:Ot<.68?-1+(Ot-.34)/.34*2:Math.max(0,1-(Ot-.68)/.32),Dt=Math.max(0,-Wt),oe=Math.max(0,Wt);z.root.rotation.x=-1.7*Dt+1.25*oe,z.joint.rotation.x=-(.25+Dt*.45),m.rotation.y=-.28*Wt,k.opacity=K.attackPhase==="active"?.85:0,K.attackPhase==="active"&&(H.rotation.z=-1.1+Ot*3)}else k.opacity=0;const Xt=Lf(Et,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Xt,E.rotation.y=(K.headYaw-K.bodyYaw-Xt+Math.PI*3)%(Math.PI*2)-Math.PI,Ht=Gf({root:f,pelvis:d,lower:u,limbs:L,base:tt,cfg:Q,grounded:!0,attacking:K.attackPhase!=="idle"})},ik(){return Ht},dispose(){f.traverse(K=>{if(K instanceof ge){K.geometry.dispose();const ft=K.material;Array.isArray(ft)?ft.forEach(Ft=>Ft.dispose()):ft.dispose()}})}}}const Yi=.012,$i=.016;function ES(n,t){const e=t.lab,i=new De;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,_,v,R=Yi){const w=l(new tn({color:_,transparent:!0,opacity:v,depthWrite:!1,side:Be,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),b=new ge(x,w);return b.rotation.x=-Math.PI/2,b.position.y=R,b.renderOrder=2,b}function f(x,_){return c(new Ls(Math.max(x,.001),_,72))}function d(x,_,v,R=$i){const b=document.createElement("canvas"),E=b.getContext("2d");if(!E)return new ge;const S='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=S,b.width=$h.ceilPowerOfTwo(Math.ceil(E.measureText(x).width)+32),b.height=$h.ceilPowerOfTwo(96*1.4);const M=b.getContext("2d");if(!M)return new ge;M.font=S,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(x,b.width/2,b.height/2);const P=new fl(b);P.colorSpace=vn,s.push(P);const F=b.width/b.height,D=c(new Cn(_*F,_)),z=l(new tn({map:P,transparent:!0,depthWrite:!1,side:Be,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new ge(D,z);return L.rotation.x=-Math.PI/2,L.position.y=R,L.renderOrder=3,L}function u(x,_,v,R,w,b){const E=v-_,S=c(new Cn(E,R)),M=h(S,w,b,Yi);M.position.set(E/2+_,Yi,0);const P=new De;return P.add(M),P.rotation.y=x-Math.PI/2,P}function m(x,_,v,R,w){const b=new _f;b.moveTo(0,_*.5),b.lineTo(-v*.5,_*.5-v*.9),b.lineTo(-v*.18,_*.5-v*.9),b.lineTo(-v*.18,-_*.5),b.lineTo(v*.18,-_*.5),b.lineTo(v*.18,_*.5-v*.9),b.lineTo(v*.5,_*.5-v*.9),b.closePath();const E=c(new ql(b)),S=h(E,R,w,Yi+.002),M=new De;return M.add(S),M.rotation.y=x+Math.PI,M}function y(x){var E;const _=new De,v=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),w=((E=v.geometry.parameters)==null?void 0:E.width)??3;_.add(v);const b=h(c(new Cn(w*.98,.08)),x.color,.7,$i);return b.position.set(0,$i,t.lab.labelTextHeight*.66),_.add(b),_.position.set(x.labelX,0,x.labelZ),_}const g=new De;for(const x of n??[]){const _=new De;if(_.position.set(x.x,0,x.z),x.shape==="square"){const v=x.radius,R=h(c(new Cn(v*2,v*2)),x.color,e.padOpacity*.09);_.add(R);const w=.07,b=[[0,v,v*2+w,w],[0,-v,v*2+w,w],[-v,0,w,v*2+w],[v,0,w,v*2+w]];for(const[E,S,M,P]of b){const F=h(c(new Cn(M,P)),x.color,e.padOpacity);F.position.x=E,F.position.z=S,_.add(F)}}else _.add(h(c(new Wl(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let v=0;v<4;v++){const R=v*Math.PI/4,w=v%2===0;for(const b of[0,Math.PI])_.add(u(R+b,x.radius*.12,x.radius*.94,w?.09:.055,x.color,w?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const v=x.spawnZ-x.z,R=-x.radius+.5,w=v-R,b=h(c(new Cn(.06,w)),x.color,.36);b.position.set(0,Yi,(v+R)/2),_.add(b);let E=0;for(let M=v;M>=R-.01;M-=1,E++){const P=E%5===0,F=h(c(new Cn(P?2.4:1.3,P?.1:.07)),x.color,P?.72:.42);F.position.set(0,Yi,M),_.add(F);const D=d(String(E),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");D.position.set(1.6,$i,M),_.add(D)}const S=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of S){const F=v-M,D=h(c(new Cn(1.9,.09)),"#ffffff",.5);D.position.set(-1.5,Yi,F),_.add(D);const z=d(P,.42,"rgba(220, 236, 250, 0.86)");z.position.set(-3,$i,F),_.add(z)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const v=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[w,b,E]of R){const M=Math.sin(w),P=Math.cos(w),F=m(w,1.7,.34,E,.75);F.position.set(M*1.7*.5,0,v+P*1.7*.5),_.add(F);const D=d(b,.44,E);D.position.set(M*(1.7+.7),$i,v+P*(1.7+.7)),_.add(D)}}if(g.add(_),e.showLabels){const v=y(x);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,v,R]of x){const w=d(R,.4,"rgba(190, 224, 248, 0.8)");w.position.set(p.x+_*(p.radius+.7),$i,p.z+v*(p.radius+.7)),i.add(w),a.push(w)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of a)_.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of s)x.dispose();i.clear()}}}const Ql=64,Vf=[0,.24,.76,1],TS=[0,1,1,0],Xf=[0,.12,.28,.5,.72,.88,1],AS=[0,.16,.5,1,.5,.16,0];function au(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function th(n,t,e,i,a=Ql,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Xf:Vf,c=s==="glow"?AS:TS,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/a,x=(p-.5)*e,_=au(p,i)*au(1-p,i),v=Math.sin(x),R=Math.cos(x);for(let w=0;w<h;w++){const b=o+(r-o)*l[w],E=g*h+w;d[E*3]=v*b,d[E*3+1]=0,d[E*3+2]=R*b;const S=_*c[w];u[E*4]=1,u[E*4+1]=1,u[E*4+2]=1,u[E*4+3]=S}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const x=g*h+p,_=x+h;m.push(x,_,x+1,x+1,_,_+1)}const y=new Je;return y.setAttribute("position",new cn(d,3)),y.setAttribute("color",new cn(u,4)),y.setIndex(m),y.computeBoundingSphere(),y}function cc(n){const t=new tn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Be,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=th(n.radius,n.thickness*f,h,n.edgeFade,Ql,n.profile??"band");if(e.set(d,m),e.size>64){for(const[y,g]of e)if(y!==d&&g!==i){g.dispose(),e.delete(y);break}}return m};i=a(n.arcRad,1);const s=new ge(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function su(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function RS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function PS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function CS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const m=u/e,y=t+(1-t)*m,g=c*a+u;s[g*3]=f*y,s[g*3+1]=0,s[g*3+2]=d*y;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new Je;return l.setAttribute("position",new cn(s,3)),l.setAttribute("color",new cn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function ou(n){const t=n.segments??Ql,e=n.profile??"band",a=((e==="glow"?Xf.length:Vf.length)-1)*6,s=th(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Be,vertexColors:!0,toneMapped:!1}),r=new ge(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),y=Math.round(m*t),g=m>.001?Math.max(1,y)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function ru(n){const t=new De,e=CS(48),i=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Be,vertexColors:!0,toneMapped:!1}),a=new ge(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=th(1-s*.5,s,Math.PI*2,0,64,"band"),r=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Be,vertexColors:!0,toneMapped:!1}),l=new ge(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(m*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function cu(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function LS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function DS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function kS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function IS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function FS(n,t,e){return n?t:e}function Wf(n){return{x:0,y:0,z:1}}function US(n){return Math.asin(Wf().y)}function zS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const xl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},NS=1e-6;function An(n,t,e){return n<t?t:n>e?e:n}function lc(n,t){const e=Math.max(.2,n);return An(Math.pow(e,-t),.5,2)}function OS(n,t){if(!t.enabled)return{...xl};const e=An(n.swing,-1,1),i=An(n.charge,0,1),a=An(n.impact,0,1),s=An(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=An(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-An(t.impactSquash,0,.6)*a;u*=m;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*s:1)*(1-An(t.impactSquash,0,.6)*a*.6),x=An(t.torsoGain,0,1),_=1+(u-1)*x;return u=An(u,.6,1.6),{arm:u,leg:An(p,.6,1.4),torso:An(_,.7,1.4),girthArm:lc(u,t.volumeExp),girthLeg:lc(p,t.volumeExp),girthTorso:lc(_,t.volumeExp)}}function BS(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function HS(n,t,e){const i=n*Math.exp(-Math.max(NS,e)*Math.max(0,t));return i<.001?0:An(i,0,1)}const lu=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Ms(n,t,e){return n<t?t:n>e?e:n}function Ne(n,t,e){return n+(t-n)*e}function GS(n){return n?typeof n=="string"?{clip:n}:n:null}function VS(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0}}function XS(n,t){const e=n%3*2,i=lu[e],a=lu[e+1];return{...VS(),bodyYaw:Ne(i.yaw,a.yaw,t),bodyPitch:Ne(i.pitch,a.pitch,t),bodyRoll:Ne(i.roll,a.roll,t),pelvisX:Ne(i.px,a.px,t),pelvisZ:Ne(i.pz,a.pz,t),armPitch:Ne(i.ap,a.ap,t),armYaw:Ne(i.ay,a.ay,t),armRoll:Ne(i.ar,a.ar,t),elbow:Ne(i.el,a.el,t),bladePitch:Ne(i.blade,a.blade,t)}}function WS(n,t,e,i,a=0){var w,b,E;const s=((w=i.combo)==null?void 0:w[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=GS(s[r]),c=l?((b=i.clips)==null?void 0:b[l.clip])??null:null,h=Ms(((E=i.weaponScale)==null?void 0:E[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,m=Ms((e+1)/2,0,1),y=c&&c.keys.length>0?Ym(c,m):XS(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",x={yaw:y.bodyYaw*u,rootYaw:y.rootYaw*u,spinYaw:$m(c,Ms(a,0,1)),pitch:y.bodyPitch*u,roll:y.bodyRoll*u,pelvisZ:y.pelvisZ*u,pelvisX:y.pelvisX*u,armR:null,armL:null,bladePitch:y.bladePitch,bladePitchOff:c&&ns(c,"bladePitchOff")?y.bladePitchOff:null,lead:g,kind:p,strike:m},_={pitch:y.armPitch*d,yaw:y.armYaw*d,roll:y.armRoll*d,elbow:y.elbow*d},v=c?ns(c,"armLPitch")||ns(c,"armLYaw")||ns(c,"armLRoll")||ns(c,"elbowL"):!1,R=v?{pitch:y.armLPitch*d,yaw:y.armLYaw*d,roll:y.armLRoll*d,elbow:y.elbowL*d}:{pitch:_.pitch+(n==="greatsword"?.08:.1),yaw:_.yaw*.8,roll:n==="greatsword"?.4:-_.roll*.6,elbow:_.elbow};return g==="L"?(x.armL=_,x.armR=n==="greatsword"?null:R):(x.armR=_,(n==="greatsword"||n==="dual-swords"||v)&&(x.armL=R)),x}function YS(n,t,e){const i=Ms(e,0,1),a=(s,o)=>s?o?{pitch:Ne(s.pitch,o.pitch,i),yaw:Ne(s.yaw,o.yaw,i),roll:Ne(s.roll,o.roll,i),elbow:Ne(s.elbow,o.elbow,i)}:null:o;return{yaw:Ne(n.yaw,t.yaw,i),rootYaw:Ne(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ne(n.pitch,t.pitch,i),roll:Ne(n.roll,t.roll,i),pelvisZ:Ne(n.pelvisZ,t.pelvisZ,i),pelvisX:Ne(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ne(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ne(n.bladePitchOff,t.bladePitchOff,i),lead:t.lead,kind:t.kind,strike:Ne(n.strike,t.strike,i)}}function $S(n){const t=Ms(n,0,1);return t*t*(3-2*t)}function Me(n,t,e){return n<t?t:n>e?e:n}const di=1e-6;function Oe(n,t,e,i){const a=new ge(new Vn(n,t,e),new Ds({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ke(){return new De}function Lo(n,t,e){const i=Ke(),a=Oe(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Oe(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Oe(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Oe(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Oe(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function ZS(n){const t=Lo(.72,.15,n),e=Oe(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function qS(n){const t=Ke(),e=Oe(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Oe(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function jS(n){const t=Ke(),e=Oe(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Oe(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ie(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function KS(n){const t=Ke();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Oe(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Oe(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function JS(n){const t=Ke(),e=Oe(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Oe(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function QS(n,t,e,i,a,s,o,r,l,c,h,f){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},m=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},y=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},g=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},p=Ke(),x=Ke();x.name="pelvis",x.position.y=n.legLength,p.add(x);const _=Ke();_.name="lower";const v=Ke();v.name="upper",x.add(_),x.add(v);const R=n.headSize,w=n.legLength,b=n.armLength,E=n.limbThickness,S=n.bodyHeight,M=n.bodyWidth,P=Oe(M,S,.28,t.body);P.position.y=S/2,v.add(P);const F=Ke();F.name="headPivot",F.rotation.order="YXZ",F.position.y=i.headPivotHeight,v.add(F);const D=Oe(R,R,R,t.head);D.position.y=R/2,F.add(D);const z=new Ds({color:"#1b2733"});for(const U of[-1,1]){const at=new ge(new Vn(.06,.07,.02),z);at.position.set(U*.09,R/2+.03,R/2+.011),F.add(at)}const L=U=>{const at=Ke();at.name=U<0?"hipL":"hipR",at.rotation.order="ZYX",at.position.set(U*(M/2-E/2),0,0),_.add(at);const gt=Oe(E,w/2,E,t.limb);gt.position.y=-w/4,at.add(gt);const Lt=Ke();Lt.name="knee",Lt.position.y=-w/2,at.add(Lt);const ee=Oe(E,w/2,E,t.limb);ee.position.y=-w/4,Lt.add(ee);const ne=Oe(E*1.15,.07,E*1.7,t.shoe);ne.position.set(0,-w/2+.035,.045),Lt.add(ne);const ve=new Ve;ve.name="footTip",ve.position.y=-w/2,Lt.add(ve);const Re=Ke();return{root:at,joint:Lt,hand:Re,wrist:Re,tip:ve,upperMesh:gt,lowerMesh:ee,segLen:w/2}},k=U=>{const at=Ke();at.name=U<0?"shoulderL":"shoulderR",at.rotation.order="ZYX",at.position.set(U*(M/2+E/2),S-.04,0),v.add(at);const gt=Oe(E,b/2,E,t.limb);gt.position.y=-b/4,at.add(gt);const Lt=Ke();Lt.name="elbow",Lt.position.y=-b/2,at.add(Lt);const ee=Oe(E,b/2,E,t.limb);ee.position.y=-b/4,Lt.add(ee);const ne=Ke();ne.name=U<0?"handL":"handR",ne.position.y=-b/2,Lt.add(ne);const ve=Oe(E*1.1,.09,E*1.1,t.head);ve.position.y=.045,ne.add(ve);const Re=Ke();return Re.name=U<0?"wristL":"wristR",ne.add(Re),{root:at,joint:Lt,hand:ne,wrist:Re,upperMesh:gt,lowerMesh:ee,segLen:b/2}},H=L(-1),O=L(1),I=k(-1),X=k(1),mt=[H,O].map(U=>({root:U.root,joint:U.joint,tip:U.tip,upperLen:w/2,lowerLen:w/2,bend:1})),ot=Ke(),dt=Ke();ot.name="mountR",dt.name="mountL",X.wrist.add(ot),I.wrist.add(dt);const et=jS(t),q=KS(t),pt=JS(t),j={"sword-shield":{right:Lo(.42,.075,t),left:qS(t)},"dual-swords":{right:Lo(.42,.075,t),left:Lo(.42,.075,t)},greatsword:{right:ZS(t),left:Oe(.12,.2,.12,t.wood)},staff:{right:et.g,left:Ke(),orb:et.orb},bow:{right:pt,left:q.g,arrow:pt,drawString:q.drawString}};for(const U of Object.keys(j))ot.add(j[U].right),dt.add(j[U].left),j[U].right.visible=!1,j[U].left.visible=!1;function Mt(U,at,gt){const Lt=new Ve;Lt.name="bladeBase",Lt.position.y=at,U.add(Lt);const ee=new Ve;ee.name="bladeTip",ee.position.y=gt,U.add(ee)}Mt(j["sword-shield"].right,.44,.55),Mt(j["dual-swords"].right,.44,.55),Mt(j["dual-swords"].left,.44,.55),Mt(j.greatsword.right,.74,.88),Mt(j.staff.right,.78,.92);let Ht=null,Nt=0,jt=0,ht=0,kt=0,V=0,ue=0,$t=yS(),Vt={...Jl},It=0,Et=0,At=0,C=-1,T=0,$=0,ct=0,lt=0,it=0,Ct=0,K=0,ft=1,Ft=0,nt=0,_t=0,B=!1,st=0,ut=0,Gt=0,Zt=0,Ut="none",N=0,yt=1,J=!1,rt=-1,St=!1,wt=0,Kt=0,re=0,ce={...xl},ae=0,we=0,xe={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Ye=NaN,Qe=0,ye=0,ke=0,Fe=NaN,Z=NaN,Rt=-1,Tt=null,te=null,Jt=0,le=1,se={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},ln=null,Ze=null,A="R",W=0,tt=0,Q=0,Y=1,bt={speed:0,phase:0},Pt={lp:0,lr:0,rp:0,rr:0},qt=0,Xt=0,Ot=!0,Wt=0,Dt="none",oe=0,vt=0,xt=0,Qt=.3,he=0;function Bt(U){const at=Math.PI/180,gt=s;let Lt=0,ee=0,ne=0,ve=0;U==="sword-shield"?(Lt=gt.swordPitchDeg*at,ee=-gt.swordYawDeg*at,ne=gt.shieldPitchDeg*at):U==="dual-swords"?(Lt=gt.swordPitchDeg*at,ee=-gt.swordYawDeg*at,ne=gt.swordPitchDeg*at,ve=gt.swordYawDeg*at):U==="greatsword"?(Lt=gt.greatswordPitchDeg*at,ee=-gt.greatswordYawDeg*at,ne=gt.greatswordPitchDeg*at,ve=gt.greatswordYawDeg*at):U==="staff"?Lt=gt.staffPitchDeg*at:ne=gt.bowPitchDeg*at,ot.rotation.set(Lt,0,ee),dt.rotation.set(ne,0,ve),ot.position.x=U==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function qe(U){if(U!==Ht){Ht=U;for(const at of Object.keys(j))j[at].right.visible=at===U,j[at].left.visible=at===U;Bt(U),q.drawString.position.z=-.06,pt.position.z=0,et.orb.scale.setScalar(1),v.rotation.y=0}}qe("sword-shield");const de=[];p.traverse(U=>{U instanceof ge&&U.material instanceof Ds&&de.push(U.material)});const Ue=new ie(r.flashColor);function Xn(U,at){const gt=zf(U,at,r);$t=gt,v.rotation.x+=gt.upperPitch,v.rotation.z+=gt.upperRoll,v.rotation.y+=gt.upperYaw;const Lt=Me(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ee=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;v.position.x+=Me(gt.upperShiftX*Lt,-ee,ee),v.position.z+=Me(gt.upperShiftZ*Lt,-ee,ee),x.position.x+=gt.comX,x.position.z+=gt.comZ-gt.pelvisBack,x.position.y-=gt.drop;const ne=gt.legacy?0:Me(r.lowerScale,0,1);_.position.z+=gt.pelvisBack*(1-ne),_.position.y+=gt.drop*(1-ne),H.joint.rotation.x+=gt.knee,O.joint.rotation.x+=gt.knee,H.root.rotation.x-=gt.hip,O.root.rotation.x-=gt.hip,I.root.rotation.x+=gt.arm,X.root.rotation.x+=gt.arm*.8;for(const ve of de)ve.emissive.copy(Ue).multiplyScalar(gt.flash)}function ze(U){return U<.22?-1:U<.5?-1+(U-.22)/.28*2:U<.58?1:Math.max(0,1-(U-.58)/.42)}function Wn(U){for(const at of[I,X])at.upperMesh.scale.set(U.girthArm,U.arm,U.girthArm),at.upperMesh.position.y=-at.segLen/2*U.arm,at.joint.position.y=-at.segLen*U.arm,at.lowerMesh.scale.set(U.girthArm,U.arm,U.girthArm),at.lowerMesh.position.y=-at.segLen/2*U.arm,at.hand.position.y=-at.segLen*U.arm;for(const at of[H,O])at.upperMesh.scale.set(U.girthLeg,U.leg,U.girthLeg),at.upperMesh.position.y=-at.segLen/2*U.leg,at.joint.position.y=-at.segLen*U.leg,at.lowerMesh.scale.set(U.girthLeg,U.leg,U.girthLeg),at.lowerMesh.position.y=-at.segLen/2*U.leg,at.tip.position.y=-at.segLen*U.leg;P.scale.set(U.girthTorso,U.torso,U.girthTorso),P.position.y=S/2*U.torso}function Ee(U,at){const gt=s.twoHandGripY??-.16,Lt=Math.max(1,s.twoHandMaxStretch??1.25),ee=b*Lt*.99,ne=I.root.position.x,ve=I.root.position.y,Re=I.root.position.z,Pe=ra=>{const or=ot.localToWorld(new G(0,ra,0)),ca=v.worldToLocal(or),hn={x:ca.x-ne,y:ca.y-ve,z:ca.z-Re};return{t:hn,dist:Math.hypot(hn.x,hn.y,hn.z)}};let Xe=gt,be=Pe(Xe);if(!Number.isFinite(be.dist)||be.dist<=di)return;for(let ra=0;ra<18&&be.dist>ee;ra++)if(Xe*=.78,be=Pe(Xe),!Number.isFinite(be.dist)||be.dist<=di)return;Number.isFinite(Ye)||(Ye=Xe);const $e=Math.max(0,s.twoHandSlideRate??9);Ye+=(Xe-Ye)*(1-Math.exp(-$e*at));const on=Pe(Ye),$n=on.t,Zn=on.dist,si=Zn/Math.max(di,b),Ii=Me(si,1,Lt),Ka=Math.max(1,s.twoHandGripStart??1.02),ir=Math.max(Ka+.001,Lt),ar=Me(s.twoHandMinGrip??1,0,1),Ja=Me((si-Ka)/(ir-Ka),0,1),Us=1-Ja*Ja*(3-2*Ja)*(1-ar),vi=b/2*Ii,sr=Of($n,vi,vi,-1),Fi=Bf({rootPitch:I.root.rotation.x,rootRoll:I.root.rotation.z,jointPitch:I.joint.rotation.x},sr,Me(U*Us,0,1),Math.PI);I.root.rotation.x=Fi.rootPitch,I.root.rotation.z=Fi.rootRoll,I.joint.rotation.x=Math.min(Fi.jointPitch,-.06);const Ui=1/Math.sqrt(Ii);I.upperMesh.scale.set(Ui,Ii,Ui),I.upperMesh.position.y=-vi/2,I.joint.position.y=-vi,I.lowerMesh.scale.set(Ui,Ii,Ui),I.lowerMesh.position.y=-vi/2,I.hand.position.y=-vi,xe={active:!0,dist:Zn,gy:Ye,pitch:Fi.rootPitch,joint:I.joint.rotation.x,grip:Us}}function pn(U,at){if(!u.enabled){Qe=0,ye=0,X.wrist.rotation.set(0,0,0),Fe=X.root.rotation.x,Z=v.rotation.y;return}const gt=X.root.rotation.x,Lt=v.rotation.y;if(at!==Rt){Rt=at,Fe=gt,Z=Lt,X.wrist.rotation.set(Qe,0,ye);return}if(!Number.isFinite(Fe)||U<=1e-5){Fe=gt,Z=Lt,X.wrist.rotation.set(Qe,0,ye);return}const ee=(gt-Fe)/U,ne=He(Lt-Z)/U;Fe=gt,Z=Lt;const ve=Math.max(0,u.maxAngle),Re=Math.max(0,u.maxTwist),Pe=.15+.85*Me(tt,0,1),be=-Me(ke,0,1.4)*Math.max(0,u.runDrag),$e=Me(-ee*u.lag*Pe+be,-ve,ve),on=Me(ne*u.twistLag*Pe,-Re,Re),$n=1-Math.exp(-Math.max(0,u.rate)*U);Qe+=($e-Qe)*$n,ye+=(on-ye)*$n,X.wrist.rotation.set(Qe,0,ye)}function ai(U){const at=Math.PI/180;return U==="greatsword"?s.greatswordPitchDeg*at:U==="staff"?s.staffPitchDeg*at:U==="bow"?s.bowPitchDeg*at:s.swordPitchDeg*at}function mn(U){const at=Math.PI/180;return U==="sword-shield"?s.shieldPitchDeg*at:U==="greatsword"?s.greatswordPitchDeg*at:U==="bow"?s.bowPitchDeg*at:s.swordPitchDeg*at}function Yn(U,at){const gt=U.weapon;if(gt==="staff"||gt==="bow")return;const Lt=A==="R",ee=Lt?X:I,ne=Lt?ot:dt,ve=Lt?I:X,Re=Lt?dt:ot,Pe=gt==="greatsword"&&Lt?ue:0,Xe=ln;if(Xe===null)ne.rotation.x=ai(gt)+Pe;else{const $e=at+ee.root.rotation.x+ee.joint.rotation.x;ne.rotation.x=Math.PI/2-Xe-$e}const be=Ze;if(be===null)Re.rotation.x=mn(gt);else{const $e=gt==="sword-shield"?mn(gt):Math.PI/2,on=at+ve.root.rotation.x+ve.joint.rotation.x;Re.rotation.x=$e-be-on}}function In(U){ln=U.bladePitch,Ze=U.bladePitchOff,A=U.lead,W=U.rootYaw+U.spinYaw,p.rotation.y=W,v.rotation.y+=U.yaw,v.rotation.x+=U.pitch,v.rotation.z+=U.roll,x.position.z+=U.pelvisZ,x.position.x+=U.pelvisX,U.armR&&(X.root.rotation.x=U.armR.pitch,X.root.rotation.y=U.armR.yaw,X.root.rotation.z=U.armR.roll,X.joint.rotation.x=U.armR.elbow),U.armL&&(I.root.rotation.x=U.armL.pitch,I.root.rotation.y=U.armL.yaw,I.root.rotation.z=U.armL.roll,I.joint.rotation.x=U.armL.elbow)}function ja(U,at){const gt=WS(U.weapon,U.comboIndex,ze(U.attackProgress),g,U.attackProgress);U.comboIndex!==Jt&&(te=Tt,le=0,Jt=U.comboIndex);const Lt=Math.max(.008,g.segBlend);le=Math.min(1,le+at/Lt);const ee=te&&le<1?YS(te,gt,$S(le)):gt;return Tt=ee,ee}function Yf(U,at){const gt=M/2+E/2,Lt=S-.04;if(!g.enabled){I.root.position.set(-gt,Lt,0),X.root.position.set(gt,Lt,0),se={lx:-gt,ly:Lt,lz:0,rx:gt,ry:Lt,rz:0};return}const ee=Math.max(0,g.shoulderLift),ne=Math.max(0,g.shoulderPush),ve=U&&at==="greatsword"?Math.max(0,g.shoulderIn):0,Re=si=>ee*Me((-si-.5)/1.45,0,1),Pe=si=>ne*Me((-si-.2)/1.9,0,1),Xe=-gt+ve,be=Lt+Re(I.root.rotation.x),$e=Pe(I.root.rotation.x),on=gt-ve,$n=Lt+Re(X.root.rotation.x),Zn=Pe(X.root.rotation.x);I.root.position.set(Xe,be,$e),X.root.position.set(on,$n,Zn),se={lx:Xe,ly:be,lz:$e,rx:on,ry:$n,rz:Zn}}function $f(U){if(U.phase==="idle"||U.charging)return;const at=U.attackProgress,gt=ze(at),Lt=Math.max(0,gt),ee=U.comboIndex%2===0?1:-1,ne=l.stride,ve=Number.isFinite(ne.stepReach)?ne.stepReach:.17,Re=Number.isFinite(ne.stepSideReach)?ne.stepSideReach:.14,Pe=Number.isFinite(ne.stepDipReach)?ne.stepDipReach:.05,Xe=U.weapon==="greatsword"?Me(Number.isFinite(ne.heavyScale)?ne.heavyScale:1,0,1):1;x.position.z+=ve*Lt*Xe,x.position.x+=ee*Re*Lt*Xe,x.position.y-=Pe*Math.sin(Math.PI*at)*Xe}function Zf(U,at){if(q.drawString.position.z=-.06,pt.position.z=0,et.orb.scale.setScalar(1),v.rotation.y=0,U.charging&&U.weapon==="bow"){const ne=U.charge;I.root.rotation.x=-1.25,I.joint.rotation.x=-.15,X.root.rotation.x=.35+ne*.3,X.joint.rotation.x=-1.15,q.drawString.position.z=-.06-ne*.22,pt.position.z=-ne*.3,v.rotation.y=-.22;return}if(U.phase==="idle"){te=null,Tt=null,Jt=0,le=1,ln=null,Ze=null,Ye=NaN,U.weapon==="greatsword"&&(ot.position.x=-Math.max(0,s.twoHandInsetX??0));return}const gt=ze(U.attackProgress),Lt=Math.max(0,-gt),ee=Math.max(0,gt);if(U.weapon==="bow")I.root.rotation.x=-1.2,I.joint.rotation.x=-.15,X.root.rotation.x=.9-ee*.8,X.joint.rotation.x=-.3;else if(U.weapon==="greatsword")if(g.enabled)In(ja(U,at));else{const ne=-1.6*Lt+1.25*ee,ve=Me(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);X.root.rotation.x=ne,X.joint.rotation.x=-(.25+Lt*.4),I.root.rotation.x=ne+.06,I.joint.rotation.x=-(.32+Lt*.4),I.root.rotation.z=.42,X.root.rotation.z=0;const Re=-Math.sin(X.root.rotation.x);X.root.rotation.y=-.72*Math.tanh(Re*4),v.rotation.y=-.2*gt*ve}else if(g.enabled)In(ja(U,at));else{const ne=U.comboIndex;if(ne===1)X.root.rotation.x=-1.7*Lt+1.1*ee,X.joint.rotation.x=-(.2+Lt*.5),I.root.rotation.x=.1,v.rotation.y=-.18*gt;else if(ne===2)I.root.rotation.x=-1.5*Lt+1*ee,I.joint.rotation.x=-(.2+Lt*.5),X.root.rotation.x=.2,v.rotation.y=.45*-gt;else{const ve=-1.9*Lt+1.2*ee;I.root.rotation.x=ve,X.root.rotation.x=ve,I.joint.rotation.x=-(.15+Lt*.4),X.joint.rotation.x=-(.15+Lt*.4),v.rotation.y=-.3*gt}}if(U.weapon==="greatsword"){const ne=Me((-X.root.rotation.x-1.3)/1.2,0,1);ot.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-ne)}$f(U)}function qf(U,at){U&&(X.root.rotation.x=-1.05,X.joint.rotation.x=-.35,I.root.rotation.x=-.45,I.joint.rotation.x=-.2,v.rotation.y=-.12,et.orb.scale.setScalar(1.25+.12*Math.sin(at*2)))}function jf(U){if(!U||U.phase==="idle")return;const at=U.progress,gt=at<.3?-.35+at/.3*1.35:at<.7?1:Math.max(0,1-(at-.7)/.3),Lt=Math.PI/180;v.rotation.x+=m.leanDeg*Lt*gt,I.root.rotation.x-=m.shieldPitchDeg*Lt*gt,I.joint.rotation.x-=.22*gt,X.root.rotation.x-=.3*gt,x.position.z+=m.pelvisReach*Math.max(0,gt)}return{group:p,update(U,at,gt,Lt,ee=!1,ne,ve,Re){qe(at.weapon),p.rotation.y=0,W=0,v.rotation.x=0,v.rotation.z=0,x.position.x=0,x.position.y=w,x.position.z=0,x.rotation.z=0,x.rotation.x=0,v.position.x=0,v.position.y=0,v.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Pe=Math.max(1/240,Math.min(Lt,.1)),Xe=ne===void 0?qt+=Lt:ne;Xt=Xe;const be=l.landing;be.enabled?Ot&&!U.grounded?(Dt="jump",oe=Xe,vt=be.anticipationDuration,xt=Math.max(0,be.jumpAnticipation),Qt=.32):!Ot&&U.grounded&&(Dt="land",oe=Xe,vt=be.duration,xt=_S(Wt,be),Qt=be.compressRatio,he=Wt):(Dt="none",xt=0),Xe<oe&&(Dt="none",xt=0),Ot=U.grounded,Wt=U.velocity.y;const $e=iu(Xe,oe,vt,xt,Qt),on=at.phase!=="idle",$n=(Re==null?void 0:Re.phase)==="active";tt=gS(tt,on,Pe,l.attack.blendRate);const Zn=xS(tt,l.attack.gaitWeight,l.attack.lowerBodyWeight);Q=Zn.attackLegWeight,Y=Zn.gaitScale;const si=Math.sin(U.bodyYaw),Ii=Math.cos(U.bodyYaw),Ka=(U.velocity.x-Nt)/Pe,ir=(U.velocity.z-jt)/Pe,ar=Me(Ka,-60,60),Ja=Me(ir,-60,60),Us=ar*si+Ja*Ii,vi=He(U.bodyYaw-ht)/Pe,sr=Math.hypot(U.velocity.x,U.velocity.z),Fi=o.maxForwardDeg*Math.PI/180,Ui=o.maxSideDeg*Math.PI/180,ra=Me(Us*o.accelGain,-Fi,Fi),or=Me(-vi*sr*o.turnGain,-Ui,Ui),ca=1-Math.exp(-o.smoothing*Pe);kt+=(ra-kt)*ca,V+=(or-V)*ca,Nt=U.velocity.x,jt=U.velocity.z,ht=U.bodyYaw;const hn=Math.hypot(U.velocity.x,U.velocity.z),rr=Me(a.knockGaitScale??0,0,1),Kf=gt.knockX*rr,Jf=gt.knockZ*rr,Qf=rr>0&&Math.hypot(gt.knockX,gt.knockZ)>.001,cr=U.velocity.x+Kf,lr=U.velocity.z+Jf,eh=Math.hypot(cr,lr);Zt=eh;const tp=Math.cos(U.bodyYaw),ep=-Math.sin(U.bodyYaw),np=U.velocity.x*tp+U.velocity.z*ep,nh=hn>di?Me(np/hn,-1,1):0,ih=hn>di?Me((U.velocity.x*si+U.velocity.z*Ii)/hn,-1,1):1,ip=jl(ih,a.backStrafeStartDeg,a.backStrafeFullDeg);Ut==="settled"&&St&&wt>Kt*1.02+1e-4&&(Ut="none");let Qa=1;Ut==="blend"?(Qa=kf(J?rt:N,a.stopYawBlendMode,J),J||(N=Math.min(1,N+Pe/Math.max(.01,a.stopYawAfterSec)),(N>=1||a.stopYawBlendMode==="inStop"||St)&&(Ut="settled",Qa=0))):Ut==="settled"&&(Qa=Me(hn/Math.max(di,a.stopEnterRatio*e),0,1)),yt=Qa;const ap=Rf(nh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),sp=Pf(ih,nh,ap,ip)*Qa;Et+=(sp-Et)*(1-Math.exp(-i.hipYawSmoothing*Pe));const ts=U.bodyYaw+Et;At=ts;const op=Math.sin(ts),rp=Math.cos(ts),cp=Math.cos(ts),lp=-Math.sin(ts),zs={speed:eh,phase:U.gaitPhase,localForward:cr*op+lr*rp,localRight:cr*cp+lr*lp,stride:U.stride};on&&!B&&(_t=U.gaitPhase),B=on;const la=tt>0?pS(zs,at.attackProgress,at.comboIndex,tt,l.stride,_t):zs;bt=la;const ah=Math.max(0,a.stopBlendSec||0),sh=ah>0&&!on&&!Qf&&U.grounded,hr=Cf(hn,Ft,e,a.stopEnterRatio,a.stopExitRatio);if(!sh||hr.resume)C=-1;else if(C<0&&hr.enter){C=0,T=U.gaitPhase,$=Tf(U.gaitPhase),ct=hn,lt=Math.max(U.stride,di),it=zs.localForward,Ct=zs.localRight;const Ce=1/Math.max(di,hn);K=U.velocity.x*Ce,ft=U.velocity.z*Ce}const hp=Ft;Ft=hn;const zi=sh&&C>=0;zi&&(C=Math.min(1,C+Pe/ah)),zi&&Ut!=="blend"&&(Ut="blend",N=0),J=zi&&C<1,rt=C,St=hr.resume,wt=hn,Kt=hp;const oh=zi?{phase:T,speed:ct,moveSpeed:e,localForward:it,localRight:Ct,legLength:n.legLength,stride:lt,grounded:!0}:{phase:la.phase,speed:la.speed,moveSpeed:e,localForward:la.localForward,localRight:la.localRight,legLength:n.legLength,stride:la.stride??0,grounded:U.grounded},dp=zi?Af(oh,a,{progress:C,phase0:T,phaseEnd:$}):Kl(oh,a),Se=vS(dp,Zn.gaitScale);if(re=0,$n&&Re){const Ce=dS(Re.progress,Re.dir,a),me=Zn.gaitScale;Se.legL.pitchX+=Ce.legL.pitchX*me,Se.legL.rollZ+=Ce.legL.rollZ*me,Se.legL.kneeX+=Ce.legL.kneeX*me,Se.legR.pitchX+=Ce.legR.pitchX*me,Se.legR.rollZ+=Ce.legR.rollZ*me,Se.legR.kneeX+=Ce.legR.kneeX*me,Se.pelvisY+=Ce.pelvisY*me,re=Ce.env}let dr=0,ur=0,fr=0,rh=0;if(zi){const Ce=Df(U.bodyYaw,K,ft),me=If(C,T,Ce.forward,Ce.right,a);me.leadLeft?(Se.legL.pitchX-=me.leadPitch,Se.legL.kneeX+=me.leadKnee,Se.legR.pitchX+=me.trailPitch):(Se.legR.pitchX-=me.leadPitch,Se.legR.kneeX+=me.leadKnee,Se.legL.pitchX+=me.trailPitch),ur=me.bodyShift*me.fwdN,dr=me.bodyShift*me.rightN,fr=me.bodyDip,rh=me.chestPitch,st=me.leadPitch,ut=me.bodyShift,Gt=me.bodyDip}else st=0,ut=0,Gt=0;Pt={lp:Se.legL.pitchX,lr:Se.legL.rollZ,rp:Se.legR.pitchX,rr:Se.legR.rollZ},U.grounded?(H.root.rotation.x=Se.legL.pitchX,O.root.rotation.x=Se.legR.pitchX,H.root.rotation.z=Se.legL.rollZ,O.root.rotation.z=Se.legR.rollZ,H.joint.rotation.x=Se.legL.kneeX,O.joint.rotation.x=Se.legR.kneeX,I.root.rotation.x=Se.armL,X.root.rotation.x=Se.armR,I.joint.rotation.x=-(.18+Se.armL*.2),X.joint.rotation.x=-(.18+Se.armR*.2),I.root.rotation.z=0,X.root.rotation.z=0,I.root.rotation.y=0,X.root.rotation.y=0,x.position.x=Se.pelvisX,x.position.y=w+Se.pelvisY,x.position.z=0,x.rotation.z=Se.pelvisRoll):(H.root.rotation.x=-.55,O.root.rotation.x=-.25,H.joint.rotation.x=.75,O.joint.rotation.x=.55,I.root.rotation.x=-.9,X.root.rotation.x=-.7,I.joint.rotation.x=-.6,X.joint.rotation.x=-.6,H.root.rotation.z=0,O.root.rotation.z=0);const up=Hf(x,_),es=$n?{...d,weight:0}:zi&&d.enabled?{...d,weight:1}:d,ch=es.enabled&&U.grounded&&es.weight>0?Me(es.weight,0,1)*(on?Me(es.attackScale,0,1):1):0;x.position.x+=dr,x.position.z+=ur,x.position.y-=fr,_.position.y+=fr,ch<=0&&(_.position.x-=dr,_.position.z-=ur);const pr=hn/Math.max(e,di);ke=pr;const fp=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,pp=1-Math.exp(-Math.max(0,fp)*Pe);It+=(Me(pr,0,1)-It)*pp;const ha=Nf({leanForward:kt,leanSide:V,speedRatio:It},o);x.rotation.x+=ha.pelvisPitch,x.rotation.z+=ha.pelvisRoll,x.position.x+=ha.pelvisX,x.position.z+=ha.pelvisZ,x.position.y-=ha.crouch,_.position.y+=ha.crouch*(1-Me(ch,0,1)),Zf(at,Pe),qf(ee,U.gaitPhase),jf(ve);const mp=at.weapon==="greatsword",lh=Math.hypot(U.velocity.x,U.velocity.z),gp=mp&&at.phase==="idle"&&lh>.5?Math.min(1.15,lh/Math.max(e,.001)*.9):0;ue+=(gp-ue)*(1-Math.exp(-6*Pe));const xp=v.rotation.x;at.weapon==="bow"&&(q.g.rotation.x=-(I.root.rotation.x+I.joint.rotation.x),pt.rotation.x=-(X.root.rotation.x+X.joint.rotation.x));const vp=v.rotation.y;Xn(gt,U.bodyYaw);const hh=gt.type==="none"?1:.4;if(v.rotation.x+=kt*hh+rh,v.rotation.z+=(V+Se.sideLean)*hh,$e>0&&(H.root.rotation.x-=be.hipPitch*$e,O.root.rotation.x-=be.hipPitch*$e,H.joint.rotation.x+=be.kneeBend*$e,O.joint.rotation.x+=be.kneeBend*$e,x.position.y-=be.crouchDepth*$e,_.position.y+=be.crouchDepth*(1-be.lowerScale)*$e,v.rotation.x+=be.upperPitch*$e,I.root.rotation.x-=be.armTuck*$e,X.root.rotation.x-=be.armTuck*$e),Q>0&&U.grounded){const Ce=mS(at.attackProgress,at.comboIndex,l.stride),me=Q;H.root.rotation.x+=Ce.legL.pitchX*me,O.root.rotation.x+=Ce.legR.pitchX*me,H.root.rotation.z+=Ce.legL.rollZ*me,O.root.rotation.z+=Ce.legR.rollZ*me,H.joint.rotation.x+=Ce.legL.kneeX*me,O.joint.rotation.x+=Ce.legR.kneeX*me,x.position.x+=Ce.pelvisX*me,x.position.y+=Ce.pelvisY*me,x.rotation.z+=Ce.pelvisRoll*me}if(Yf(on,at.weapon),y.enabled){const Ce=at.phase!=="idle"&&!at.charging,me=Ce?ze(at.attackProgress):0;Ce&&we>.55&&me<we-1e-4&&(ae=1),we=me,ae=HS(ae,Pe,y.impactDecay);const yp=OS({swing:me,charge:at.charging?at.charge:0,impact:ae,speedRatio:pr,grounded:U.grounded},y);ce=BS(ce,yp,Pe,y.smoothing)}else ce={...xl};Wn(ce),_.rotation.y=Et,nt=Lf(Et,a.chestYawScale,a.chestYawMaxDeg),v.rotation.y+=nt;const _p=vp;F.rotation.y=He(U.headYaw-U.bodyYaw-_p-nt),F.rotation.x=-Me(U.headPitch??0,-.7,.7),v.rotation.x+=-Me(U.bodyPitch??0,-.4,.4),pn(Lt,at.comboIndex),Yn(at,xp),at.weapon==="greatsword"&&at.phase!=="idle"&&!at.charging&&(p.updateWorldMatrix(!0,!0),Ee(Me(Math.max(.65,tt),0,1),Pe)),Vt=Gf({root:p,pelvis:x,lower:_,limbs:mt,base:up,cfg:es,grounded:U.grounded,attacking:on})},lean(){return{forward:kt,side:V}},landing(){const U=iu(Xt,oe,vt,xt,Qt),at=vt>0?Math.max(0,vt-Math.max(0,Xt-oe)):0;return{pulse:U,remaining:at,kind:U>0?Dt:"none",impactVy:he}},hurt(){return $t},ik(){return Vt},stretch(){return{...ce,impact:ae}},gripDebug(){return{...xe}},weaponDebug(){return{wristPitch:Qe,wristTwist:ye}},swingDebug(){const U=Tt;return{seg:Jt,kind:(U==null?void 0:U.kind)??"right-left",yaw:(U==null?void 0:U.yaw)??0,rootYaw:(U==null?void 0:U.rootYaw)??0,spinYaw:(U==null?void 0:U.spinYaw)??0,rootTurn:W,pitch:(U==null?void 0:U.pitch)??0,roll:(U==null?void 0:U.roll)??0,strike:(U==null?void 0:U.strike)??0,shoulderL:{x:se.lx,y:se.ly,z:se.lz},shoulderR:{x:se.rx,y:se.ry,z:se.rz}}},attackBlend(){return tt},attackWeights(){return{gaitScale:Y,attackLegWeight:Q,driveSpeed:bt.speed,stridePhase:bt.phase}},hipYaw(){return Et},gaitDebug(){return{stopT:C,hipYaw:Et,chestYaw:nt,speed:Ft,gaitSpeed:Zt,stopStep:st,stopShift:ut,stopDip:Gt,stopYawFade:yt,turnStep:re,legLPitch:Pt.lp,legLRoll:Pt.lr,legRPitch:Pt.rp,legRRoll:Pt.rr}},gaitYaw(){return At},arrowDirection(){pt.updateWorldMatrix(!0,!1);const U=pt.matrixWorld.elements,at=U[8],gt=U[9],Lt=U[10],ee=Math.hypot(at,gt,Lt)||1;return{x:at/ee,y:gt/ee,z:Lt/ee}},weaponBlade(){if(!Ht)return null;const U=j[Ht].right,at=U.getObjectByName("bladeBase"),gt=U.getObjectByName("bladeTip");if(!at||!gt)return null;at.updateWorldMatrix(!0,!1),gt.updateWorldMatrix(!0,!1);const Lt=at.getWorldPosition(new G),ee=gt.getWorldPosition(new G);return{base:{x:Lt.x,y:Lt.y,z:Lt.z},tip:{x:ee.x,y:ee.y,z:ee.z}}},bladesWorld(){const U=at=>{if(!at)return null;const gt=at.getObjectByName("bladeBase"),Lt=at.getObjectByName("bladeTip");if(!gt||!Lt)return null;gt.updateWorldMatrix(!0,!1),Lt.updateWorldMatrix(!0,!1);const ee=gt.getWorldPosition(new G),ne=Lt.getWorldPosition(new G);return{base:{x:ee.x,y:ee.y,z:ee.z},tip:{x:ne.x,y:ne.y,z:ne.z}}};return Ht?{right:U(j[Ht].right),left:U(j[Ht].left)}:{right:null,left:null}},dispose(){p.traverse(U=>{if(U instanceof ge){U.geometry.dispose();const at=U.material;Array.isArray(at)?at.forEach(gt=>gt.dispose()):at.dispose()}})}}}function t1(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Je,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new cn(i,3),o=new cn(a,3);s.setUsage(Xh),o.setUsage(Xh),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const _=x*2,v=_+1,R=_+2,w=_+3;r.push(_,v,R,v,w,R)}e.setIndex(r),e.setDrawRange(0,0);const l=new tn({vertexColors:!0,transparent:!0,opacity:1,blending:Ei,depthWrite:!1,side:Be}),c=new ge(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ie(n.color);let f=[],d=null,u=0,m=0,y=!1,g=!1;function p(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const _=Math.max(.001,n.life);for(let v=0;v<x;v++){const R=f[v],w=Math.max(0,1-R.age/_),b=w*w,E=Math.min(1,R.speed/Math.max(.001,n.minSpeed*2)),S=n.intensity*b*(.55+.45*E),M=.18+.82*w,P=v*6;i[P]=R.tx+(R.bx-R.tx)*M,i[P+1]=R.ty+(R.by-R.ty)*M,i[P+2]=R.tz+(R.bz-R.tz)*M,i[P+3]=R.tx,i[P+4]=R.ty,i[P+5]=R.tz;const F=h.r*S,D=h.g*S,z=h.b*S,L=F*.22,k=D*.22,H=z*.22;a[P]=L,a[P+1]=k,a[P+2]=H;const O=1+n.tipBoost;a[P+3]=Math.min(1,F*O),a[P+4]=Math.min(1,D*O),a[P+5]=Math.min(1,z*O)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,_,v){if(!n.enabled){c.visible=!1;return}const R=Math.max(0,x);for(const w of f)w.age+=R;for(;f.length>0&&f[0].age>n.life;)f.shift();if(_){const w=d?Math.hypot(_.tip.x-d.x,_.tip.y-d.y,_.tip.z-d.z)/Math.max(1e-4,R):0,b=f[f.length-1],E=b?Math.hypot(_.tip.x-b.tx,_.tip.y-b.ty,_.tip.z-b.tz):1/0;if(v&&E>=n.minStep)for(f.push({bx:_.base.x,by:_.base.y,bz:_.base.z,tx:_.tip.x,ty:_.tip.y,tz:_.tip.z,age:0,speed:w});f.length>t;)f.shift();d={x:_.tip.x,y:_.tip.y,z:_.tip.z},u=w,m=E,y=!0}else d=null,y=!1,u=0,m=0;g=v,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:y,active:g}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function e1(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function n1(n,t,e,i){const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new yb({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Uu,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new Mb;r.background=new ie("#12161d"),r.add(new nS(11061486,2764600,1.15));const l=new sS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new De;for(const Z of t.boxes){const Rt=Z.maxX-Z.minX,Tt=Z.maxY-Z.minY,te=Z.maxZ-Z.minZ;let Jt=e1(Z.kind,e);Z.kind==="step"&&(Jt=new ie(Jt).offsetHSL(0,0,Z.maxY*.09).getStyle());const le=new Ds({color:Jt,transparent:!0,opacity:1}),se=new ge(new Vn(Rt,Tt,te),le);se.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),se.castShadow=Z.kind!=="ground",se.receiveShadow=!0,se.add(new pf(new zb(se.geometry),new Gl({color:10467020,transparent:!0,opacity:.32}))),f.add(se),h.push(le)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new rS(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=ES(i,e);r.add(m.group);const y=QS(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist),g=t1(e.weaponTrail);r.add(g.object);const p=new De,x=.9,_=new De;_.position.y=x,y.group.position.y=-x,_.add(y.group),p.add(_),r.add(p);const v=t.dummies.map((Z,Rt)=>{const Tt=e.dummies.colors,te=Tt[Rt%Tt.length]??"#cccccc",Jt=wS(e.voxel,e.colors,te,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Jt.group.traverse(le=>{le.userData.dummyId=Z.id}),r.add(Jt.group),Jt}),R=v.map(Z=>Z.group),w=new oS,b=e.groundRing,E=e.voxel.bodyWidth,S=su(E,b.playerRadiusFactor),M=su(E,b.dummyRadiusFactor),P=E*b.thicknessFactor,F=b.arcDeg*Math.PI/180;let D=0;const z=cc({radius:S,thickness:P,arcRad:F,edgeFade:b.edgeFade,color:b.playerColor,opacity:b.playerOpacity,y:.028,renderOrder:6});z.mesh.name="player-ground-ring",r.add(z.mesh);const L=t.dummies.map(Z=>{const Rt=cc({radius:M,thickness:P,arcRad:F,edgeFade:b.edgeFade,color:b.neutralColor,opacity:b.opacity,y:.022,renderOrder:5});return Rt.mesh.name=`dummy-ground-ring-${Z.id}`,r.add(Rt.mesh),Rt}),k=t.dummies.map(Z=>{const Rt=cc({radius:M*b.haloRadiusFactor,thickness:P*b.haloThicknessFactor,arcRad:F,edgeFade:b.edgeFade,color:b.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Rt.mesh.name=`dummy-ground-halo-${Z.id}`,r.add(Rt.mesh),Rt}),H=t.dummies.map(()=>0),O=t.dummies.map(()=>0),I=ou({radius:S*b.meterRadiusFactor,thickness:P*b.meterThicknessFactor,arcRad:F,edgeFade:.06,color:b.meterColorCharge,y:.03,renderOrder:8});I.mesh.name="player-ground-meter",r.add(I.mesh);const X=t.dummies.map(Z=>{const Rt=ou({radius:M*b.warnRadiusFactor,thickness:P*b.warnThicknessFactor,arcRad:F,edgeFade:.02,color:b.warnColor,y:.031,renderOrder:9});return Rt.mesh.name=`dummy-ground-warn-${Z.id}`,r.add(Rt.mesh),Rt}),mt=ru({color:b.playerColor,y:.042,renderOrder:3});mt.group.name="player-landing-preview",r.add(mt.group);const ot=new ie,dt=new ie(b.playerColor),et=new ie(b.neutralColor),q=new ie(b.lowThreatColor),pt=new ie(b.highThreatColor),j=new ie(b.meterColorCharge),Mt=new ie(b.meterColorChannel),Ht=new ie(b.meterColorCooldown),Nt=new ie(b.warnColor),jt=new De;r.add(jt);const ht=e.projectiles;function kt(){const Rt=document.createElement("canvas");Rt.width=64,Rt.height=64;const Tt=Rt.getContext("2d");if(Tt){const Jt=Tt.createRadialGradient(32,32,0,32,32,32);Jt.addColorStop(0,"rgba(255,255,255,1)"),Jt.addColorStop(.28,"rgba(255,255,255,0.72)"),Jt.addColorStop(.62,"rgba(255,255,255,0.22)"),Jt.addColorStop(1,"rgba(255,255,255,0)"),Tt.fillStyle=Jt,Tt.fillRect(0,0,64,64)}const te=new fl(Rt);return te.colorSpace=vn,te}function V(){const Tt=document.createElement("canvas");Tt.width=2,Tt.height=64;const te=Tt.getContext("2d");if(te){const le=te.createLinearGradient(0,0,0,64);le.addColorStop(0,"rgba(255,255,255,0)"),le.addColorStop(.55,"rgba(255,255,255,0.35)"),le.addColorStop(1,"rgba(255,255,255,0.95)"),te.fillStyle=le,te.fillRect(0,0,2,64)}const Jt=new fl(Tt);return Jt.colorSpace=vn,Jt}const ue=kt(),$t=V(),Vt=new tn({color:12577023,transparent:!0,opacity:0,side:Be,depthWrite:!1}),It=new tn({color:14217983,transparent:!0,opacity:0,side:Be,depthWrite:!1,blending:Ei}),Et=new De;Et.position.set(0,.95,.72),jt.add(Et);const At=new De;At.rotation.x=US(e.camera.pitchDeg),Et.add(At);const C=new nr(.78,ht.slashThickness,6,28,Math.PI*1.15),T=new De,$=new ge(C,Vt),ct=new ge(C,It);ct.scale.setScalar(1.09),ct.renderOrder=4,T.add($,ct),At.add(T);const lt=new Vn(ht.arrowWidth,ht.arrowWidth,ht.arrowLength),it=new Yl(ht.arrowHeadSize*.42,ht.arrowHeadSize,4);it.rotateX(Math.PI/2);const Ct=new Vn(ht.arrowWidth*2.6,ht.arrowWidth*.4,.1),K=new As(ht.arrowWidth*.45,ht.arrowWidth*1.3,ht.trailLength,6,1,!0);K.rotateX(-Math.PI/2),K.translate(0,0,-ht.trailLength/2);const ft=Array.from({length:10},()=>{const Z=new De,Rt=new tn({color:ht.arrowColor,transparent:!0}),Tt=new tn({color:ht.arrowHeadColor,transparent:!0}),te=new ul({map:ue,color:ht.arrowColor,transparent:!0,opacity:.85,blending:Ei,depthWrite:!1}),Jt=new tn({color:ht.arrowTrailColor,map:$t,transparent:!0,opacity:0,blending:Ei,depthWrite:!1,side:Be}),le=new ge(lt,Rt),se=new ge(it,Tt);se.position.z=ht.arrowLength/2+ht.arrowHeadSize*.42;const ln=new ge(Ct,Tt),Ze=new ge(Ct,Tt);ln.position.z=-ht.arrowLength/2+.08,Ze.position.z=ln.position.z,Ze.rotation.z=Math.PI/2;const A=new Hd(te);A.scale.setScalar(ht.arrowGlowSize),A.renderOrder=6;const W=new ge(K,Jt);return W.renderOrder=5,Z.add(le,se,ln,Ze,A,W),Z.visible=!1,r.add(Z),{group:Z,shaftMat:Rt,tipMat:Tt,glowMat:te,trailMat:Jt,glow:A,trail:W,arrowId:0,bone:null}}),Ft=new Zl(1,0),nt=new G(ht.boltShapeX,ht.boltShapeY,ht.boltShapeZ),_t=new tn({color:ht.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),B=new ul({map:ue,color:ht.boltGlowColor,transparent:!0,opacity:.45,blending:Ei,depthWrite:!1}),st=new tn({color:ht.boltGlowColor,map:$t,transparent:!0,opacity:ht.trailOpacity,blending:Ei,depthWrite:!1,side:Be}),ut=new As(.5,.03,ht.boltTrailScale,6,1,!0);ut.rotateX(-Math.PI/2),ut.translate(0,0,-ht.boltTrailScale/2);const Gt=Array.from({length:24},()=>{const Z=new De,Rt=new ge(Ft,_t);Rt.scale.copy(nt);const Tt=new Hd(B);Tt.scale.setScalar(ht.boltGlowScale),Tt.renderOrder=6;const te=new ge(ut,st);return te.renderOrder=5,Z.add(Rt,Tt,te),Z.visible=!1,r.add(Z),{group:Z,core:Rt}}),Zt=Array.from({length:6},()=>{const Z=ru({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Z.group.visible=!1,r.add(Z.group),Z}),Ut=e.dash,N=new Ls(Ut.ringRadius-.06,Ut.ringRadius,28),yt=Array.from({length:6},()=>{const Z=new tn({color:16777215,transparent:!0,opacity:0,side:Be,depthWrite:!1}),Rt=new ge(N,Z);return Rt.rotation.x=-Math.PI/2,Rt.visible=!1,r.add(Rt),{mesh:Rt,mat:Z,life:0,base:1}});function J(Z,Rt,Tt,te,Jt){const le=yt.find(se=>se.life<=0)??yt[0];le.mat.color.set(te),le.mesh.position.set(Z,Tt+.04,Rt),le.base=Jt,le.mesh.scale.setScalar(Jt*.6),le.mesh.visible=!0,le.mat.opacity=.9,le.life=Ut.fxDuration}const rt=e.links,St=new Ls(rt.ringRadius-.07,rt.ringRadius,28),wt=Array.from({length:5},()=>{const Z=new tn({color:rt.chargeColor,transparent:!0,opacity:0,side:Be,depthWrite:!1}),Rt=new ge(St,Z);return Rt.rotation.x=-Math.PI/2,Rt.visible=!1,r.add(Rt),{mesh:Rt,mat:Z,life:0,base:1}});function Kt(Z,Rt,Tt,te){const Jt=wt.find(le=>le.life<=0)??wt[0];Jt.mesh.position.set(Z,Tt+.05,Rt),Jt.base=te,Jt.mesh.scale.setScalar(te*.55),Jt.mesh.visible=!0,Jt.mat.opacity=.85,Jt.life=rt.fxDuration}let re=t.playerLink.id,ce=t.playerLink.hitIds.length,ae=t.dash.id,we="none";const xe=lS(e.camera,e.smartCamera,e.zoom,a/s),Ye=t.character.position;xe.update(Ye.x,Ye.y,Ye.z,1,t.camera);function Qe(Z,Rt){if(R.length===0)return 0;const Tt=o.domElement.getBoundingClientRect(),te=new Yt((Z-Tt.left)/Tt.width*2-1,-((Rt-Tt.top)/Tt.height)*2+1);w.setFromCamera(te,xe.camera);const Jt=w.intersectObjects(R,!0);for(const le of Jt){const se=le.object.userData.dummyId;if(se&&se>0)return se}return 0}function ye(Z,Rt,Tt){const te=o.domElement.getBoundingClientRect(),Jt=new G(Z,Rt,Tt).project(xe.camera);return{x:te.left+(Jt.x*.5+.5)*te.width,y:te.top+(-Jt.y*.5+.5)*te.height}}let ke=0,Fe=0;return{gaitDebug(){return y.gaitDebug()},trailDebug(){return g.debug()},stretchDebug(){const Z=y.stretch();return{arm:Z.arm,leg:Z.leg,torso:Z.torso,impact:Z.impact}},swingDebug(){return y.swingDebug()},bladeWorld(){return y.weaponBlade()},bladesWorld(){return y.bladesWorld()},projectPoint(Z,Rt,Tt){return ye(Z,Rt,Tt)},weaponDebug(){return y.weaponDebug()},gripDebug(){return y.gripDebug()},render(Z,Rt){const Tt=Z.character,te=Z.combat;e.hitstop.enabled&&Z.hitCount>ke&&Fe<=0&&(Fe=Math.max(0,e.hitstop.duration)),ke=Z.hitCount;const Jt=Fe>0;Jt&&(Fe-=Rt),p.position.set(Tt.position.x,Tt.position.y,Tt.position.z),p.rotation.y=Tt.bodyYaw;const le=Z.dash.phase==="active"&&Z.dash.kind==="roll",se=le&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;if(_.rotation.x=le?se*Math.PI*2:0,_.position.y=x-(le?.2*Math.sin(Math.PI*se):0),Jt||y.update(Tt,te,Z.playerHurt,Rt,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace),g.update(Jt?0:Rt,Jt?null:y.weaponBlade(),!Jt&&(te.phase==="active"||Z.playerLink.phase==="active"||le&&Z.dash.duration>0)),!Jt)for(let vt=0;vt<v.length;vt++)Z.dummies[vt]&&v[vt].update(Z.dummies[vt],Rt);const ln=xe.camera.position,Ze=Math.atan2(ln.x-Tt.position.x,ln.z-Tt.position.z),A=Z.config.gaze.hurtHoldSec,W=Z.time-Z.playerHurt.lastAt,tt=A>0&&W>=0&&W<A?1-W/A:0,Q=RS(Z.gaze.active,Z.gaze.threat,tt,Z.time,b);PS(ot,dt,q,pt,Q.level),D=FS(Tt.grounded,Tt.position.y,D),z.mesh.position.set(Tt.position.x,D+.028,Tt.position.z),z.update(Q.arcRad,Q.opacity,Q.scale,ot,Ze);const Y=Z.config.abilities.arcane,bt=Math.max(1,Math.floor(Y.waves)),Pt=Math.max(1e-4,Y.waveInterval),qt=DS({charging:te.charging,charge:te.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:Pt,channelProgress:Z.abilities.channeling?(Z.abilities.waveIndex+(1-Math.min(1,Math.max(0,Z.abilities.fireTimer/Pt))))/bt:0,arcaneCooldown:Z.abilities.cooldown,arcaneCooldownMax:Y.cooldown,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});I.mesh.position.set(Tt.position.x,Tt.position.y+.03,Tt.position.z),I.set(qt.ratio,qt.source==="none"?0:b.meterOpacity,qt.source==="charge"?j:qt.source==="channel"?Mt:Ht,Ze);const Xt=Z.playerLink,Ot=Xt.weapon?Z.config.links.moves[Xt.weapon]:void 0,Wt=kS(Xt.phase,Tt.position.x,Tt.position.z,Xt.facing,Xt.travel,(Ot==null?void 0:Ot.hit.radius)??.9);mt.set(Wt.x,Wt.z,.042,Wt.radius,Wt.active?b.landingOpacity:0,Z.time);for(let vt=0;vt<L.length;vt++){const xt=Z.dummies[vt],Qt=L[vt],he=k[vt],Bt=X[vt];if(!xt){Qt.mesh.visible=!1,he.mesh.visible=!1,Bt.mesh.visible=!1;continue}const qe=Z.targeting.hasTarget&&Z.targeting.targetId===xt.id;if(Om(Z,xt)){const ai=Bm(Z,xt);ot.copy(q).lerp(pt,ai)}else ot.copy(et);const de=LS(xt.attackPhase,xt.attackPhaseTimer,Z.config.dummies.attackWindup);de.active?(ot.lerp(Nt,.5*de.urgency),Bt.mesh.position.set(xt.position.x,xt.position.y+.031,xt.position.z),Bt.set(de.ratio,b.warnOpacity*(.65+.35*de.urgency),Nt,Ze)):Bt.set(0,0,Nt,Ze);const Ue=qe?1:0,Xn=Ue>H[vt]?b.haloFadeInSec:b.haloFadeOutSec;H[vt]=cu(H[vt],Ue,Rt,Xn);const ze=H[vt],Wn=1+.02*ze*Math.sin(Z.time*2.2+xt.id),Ee=b.arcDeg+(b.selectedArcDeg-b.arcDeg)*ze;Qt.mesh.position.set(xt.position.x,xt.position.y+.022,xt.position.z),Qt.update(Ee*Math.PI/180,b.opacity+(b.selectedOpacity-b.opacity)*ze,1+(b.selectedScale-1)*ze*Wn,ot,Ze,1+(b.selectedThicknessScale-1)*ze),O[vt]=cu(O[vt],Ue,Rt,Ue>O[vt]?b.haloFadeInSec:b.haloFadeOutSec);const pn=O[vt];he.mesh.position.set(xt.position.x,xt.position.y+.019,xt.position.z),he.update(Ee*Math.PI/180,b.haloOpacity*pn*(.88+.12*Math.sin(Z.time*2.2+xt.id)),b.selectedScale*(.94+.06*pn)*Wn,ot,Ze)}if(jt.position.set(Tt.position.x,Tt.position.y,Tt.position.z),jt.rotation.y=te.phase!=="idle"?te.attackFacing:Tt.bodyYaw,Z.dash.id!==ae){ae=Z.dash.id;const vt=Z.dash;we=vt.kind,vt.kind==="blink"?(J(vt.fromX,vt.fromZ,Tt.position.y,Ut.blinkColor,.9),J(vt.toX,vt.toZ,Tt.position.y,Ut.blinkColor,1.35)):J(vt.fromX,vt.fromZ,Tt.position.y,Ut.rollColor,1.1)}for(const vt of yt){if(vt.life<=0)continue;vt.life-=Rt;const xt=Math.max(0,vt.life/Ut.fxDuration);vt.mat.opacity=.9*xt,vt.mesh.scale.setScalar(vt.base*(.6+(1-xt)*1.2)),vt.life<=0&&(vt.mesh.visible=!1)}const Dt=Z.playerLink;Dt.id!==re&&(re=Dt.id,ce=Dt.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1)),Dt.hitIds.length>ce?(ce=Dt.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1.35)):Dt.hitIds.length<ce&&(ce=Dt.hitIds.length);for(const vt of wt){if(vt.life<=0)continue;vt.life-=Rt;const xt=Math.max(0,vt.life/Math.max(rt.fxDuration,1e-6));vt.mat.opacity=.85*xt,vt.mesh.scale.setScalar(vt.base*(.55+(1-xt)*1.1)),vt.life<=0&&(vt.mesh.visible=!1)}const oe=ht.slashEnabled&&te.phase==="active"&&te.comboIndex>=3;Vt.opacity=oe?.7:0,It.opacity=oe?ht.slashGlowOpacity:0,oe&&(T.rotation.z=-1.2+te.attackProgress*3.2,T.scale.setScalar(.9+te.comboIndex*.13));for(let vt=0;vt<Gt.length;vt++){const xt=Z.abilities.projectiles[vt],Qt=Gt[vt];Qt.group.visible=!!xt,xt&&(Qt.group.position.set(xt.x,xt.y,xt.z),Qt.group.scale.setScalar(xt.radius),Qt.group.rotation.set(0,Math.atan2(xt.dirX,xt.dirZ),0))}for(let vt=0;vt<Zt.length;vt++){const xt=Z.abilities.rings[vt],Qt=Zt[vt];if(!xt){Qt.group.visible=!1;continue}const he=Math.max(0,Math.min(1,xt.life/Math.max(xt.duration,1e-6))),Bt=IS(Math.max(0,xt.duration-xt.life),b.areaExpandSec);Qt.set(xt.x,xt.z,.045,xt.radius*Bt.scale,b.areaOpacity*(.35+.65*he)*Bt.alpha,Z.time)}for(let vt=0;vt<ft.length;vt++){const xt=Z.arrows[vt],Qt=ft[vt];if(!xt){Qt.group.visible=!1,Qt.bone&&(r.attach(Qt.group),Qt.bone=null),Qt.arrowId=0;continue}const he=xt.stuck&&xt.stuckDummy>=0;if(Qt.arrowId!==xt.id){if(Qt.bone&&(r.attach(Qt.group),Qt.bone=null),Qt.arrowId=xt.id,Qt.group.position.set(xt.x,xt.y,xt.z),Qt.group.rotation.set(xt.pitch,xt.yaw,0,"YXZ"),he){const qe=v[xt.stuckDummy],de=qe?qe.boneAtWorld(xt.x,xt.y,xt.z):null;de&&(de.node.attach(Qt.group),Qt.bone=de.node)}}else Qt.bone||(Qt.group.position.set(xt.x,xt.y,xt.z),Qt.group.rotation.set(xt.pitch,xt.yaw,0,"YXZ"));Qt.group.visible=!0;const Bt=xt.stuck?Math.min(1,xt.rest/.6):1;Qt.shaftMat.opacity=Bt,Qt.tipMat.opacity=Bt,Qt.glowMat.opacity=(xt.stuck?.28:.85)*Bt,Qt.trailMat.opacity=xt.stuck?0:ht.trailOpacity*Bt,Qt.trail.visible=!xt.stuck}xe.update(Tt.position.x,Tt.position.y,Tt.position.z,Rt,Z.camera),o.render(r,xe.camera)},resize(){const Z=Math.max(1,n.clientWidth),Rt=Math.max(1,n.clientHeight);o.setSize(Z,Rt,!1),xe.resize(Z/Rt)},getGroundBasis(){return xe.getGroundBasis()},setCollidersVisible(Z){for(const Rt of h)Rt.opacity=Z?.3:1,Rt.wireframe=Z,Rt.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setLabVisible(Z){m.setVisible(Z)},setLabLabelsVisible(Z){m.setLabelsVisible(Z)},snapCamera(Z,Rt,Tt){xe.snap(Z,Rt,Tt)},setZoom(Z){xe.setZoom(Z)},pickDummy:Qe,projectToScreen:ye,diagnostics(){const Z=Wf(e.camera.pitchDeg),Rt=zS(Z,jt.rotation.y);return{lean:y.lean(),slashNormal:Rt,arrowForward:y.arrowDirection(),gait:{hipYaw:y.hipYaw(),gaitYaw:y.gaitYaw()},attackBlend:y.attackBlend(),attackWeights:y.attackWeights(),landing:y.landing(),hurt:y.hurt(),ik:y.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:_.rotation.x,activeRings:yt.filter(Tt=>Tt.life>0).length,lastKind:we},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...xe.smart()}}},dispose(){y.dispose(),m.dispose();for(const Z of v)Z.dispose();z.dispose();for(const Z of L)Z.dispose();for(const Z of k)Z.dispose();I.dispose(),g.dispose();for(const Z of X)Z.dispose();mt.dispose(),C.dispose(),Vt.dispose(),It.dispose(),Ft.dispose(),_t.dispose(),B.dispose(),st.dispose(),ut.dispose();for(const Z of Zt)Z.dispose();lt.dispose(),it.dispose(),Ct.dispose(),K.dispose();for(const Z of ft)Z.shaftMat.dispose(),Z.tipMat.dispose(),Z.glowMat.dispose(),Z.trailMat.dispose();ue.dispose(),$t.dispose();for(const Z of yt)Z.mat.dispose();N.dispose();for(const Z of wt)Z.mat.dispose();St.dispose(),f.traverse(Z=>{Z instanceof ge&&Z.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function i1(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function a1(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function s1(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function y(){const x=n.status();a.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function g(x){d=x,e.hidden=!x,x?y():s.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const x=n.summary();i1(x).then(_=>{_?(p("已复制 ✓"),s.hidden=!0):(s.value=x,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);a1(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&y()},isOpen:()=>d,close:()=>g(!1)}}const o1={intents:{...hu},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function r1(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Gm(E0,Hs),i=n1(n,e,dn,Hs.stations),a=Zm(e),s=ag(t),o=sg(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.48 · 11-08 03:22 · 诊断");const l=D=>String(D).padStart(2,"0"),c=new Date,h=y0({meta:{version:"v0.9.48",buildTime:"11-08 03:22",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=s1(h,r),d=eg({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid,showLab:dn.lab.enabled,showLabLabels:dn.lab.showLabels};let m=1,y=!1;const g=l0({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let x=e.combat.weapon;function _(D){if(D===x)return;x=D;const z=na.indexOf(D)+1;for(const L of p)L.classList.toggle("is-active",Number(L.dataset.weapon)===z);b.refreshWeapon()}let v=o1,R=0;const w=()=>{m=1,i.setZoom(1)},b=N0(e,dn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...hu,resetPressed:!0})},resetZoom:w,onToggleColliders:D=>i.setCollidersVisible(D),onToggleGrid:D=>i.setGridVisible(D),onToggleLab:D=>i.setLabVisible(D),onToggleLabLabels:D=>i.setLabLabelsVisible(D)}),E=H0({stations:Hs.stations??[],world:e,view:i,onResetZoom:w});o.register({motion:d,debug:b.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:dn,debug:u,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(D,z,L)=>i.projectPoint(D,z,L),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var D;return Object.keys(((D=dn.animation.swing)==null?void 0:D.clips)??{})},preview:D=>{const z=e.combat,L={...z};z.weapon=D.weapon,z.phase="active",z.comboIndex=Math.max(1,Math.min(3,Math.floor(D.comboIndex))),z.attackProgress=Math.max(0,Math.min(1,D.progress)),z.attackFacing=e.character.bodyYaw;const k=Math.max(1,Math.min(30,Math.floor(D.warm??12)));y=!0;for(let H=0;H<k;H++)i.render(e,1/60);return Object.assign(z,L),{...i.swingDebug(),blade:i.bladeWorld()}},face:D=>{e.character.bodyYaw=D},zoom:D=>{m=Rh(D,1,dn.zoom.min,dn.zoom.max),i.setZoom(m)},release:()=>{y=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Hs.stations??[],goto:D=>E.goto(D),current:()=>E.current(),recall:()=>E.recall()}};let S=performance.now(),M=60,P=0;function F(D){const z=Math.min((D-S)/1e3,.1);S=D,z>0&&(M=M*.9+1/z*.1);const L=g.sample();L.intents.resetPressed&&(m=1),m=Rh(m,L.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(m);let k=L.intents.dummyClickId;if(L.tap){const I=i.pickDummy(L.tap.x,L.tap.y);I>0&&(k=I)}k>0&&(R=k),v={...L,intents:{...L.intents,dummyClickId:R}};const H=a.frame(z,v.intents,u.timeScale,u.paused,()=>{const I=e.events;for(let X=0;X<I.length;X++)h.event(I[X],e.time)});H>0&&(R=0),h.sample(e,v,z*1e3,H);for(const I of v.gestures)h.gesture(I);D-P>250&&(P=D,f.tick()),_(e.combat.weapon),y||i.render(e,z),E.tick(),d.update(e,v,i.getGroundBasis());const O=i.diagnostics();s.update(e,M,H,v,u,{attackBlend:O.attackBlend,attackWeights:O.attackWeights,landing:O.landing,hurt:O.hurt,ik:O.ik,zoom:O.camera.zoom},o.hudCompact()),requestAnimationFrame(F)}requestAnimationFrame(F)}r1();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Fi=["sword-shield","dual-swords","greatsword","staff","bow"],Uo=["wander","follow","keep-distance","attack","idle"],kd={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},io=1e-6;function Zs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>io?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>io?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Bf(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>io){const s=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/s,z:t.aimZ/s}}const e=Math.hypot(t.moveX,t.moveZ);if(e>io)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Mn=1e-6,Pr=Math.PI/180,Nc=-1e9;function Id(){return{type:"none",lastAt:Nc,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Dr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ul(n,t,e,i,s){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=s,n.knockX=0,n.knockZ=0}function Oc(n,t,e){const i=e.duration>0?e.duration:Bc(n,e.type);if(t.kind==="player"){const a=n.playerHurt;if(Ul(a,e.type,i,e.dirX,e.dirZ),a.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Mn){const o=e.knockback*n.config.hits.knockbackDecay;a.knockX=e.dirX*o,a.knockZ=e.dirZ*o}Dr(n,"player-hurt",e.sourceId??0,n.character.position);return}const s=n.dummies[t.index];if(s){if(Ul(s.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Mn){const a=e.knockback*n.config.hits.knockbackDecay;s.hurt.knockX=e.dirX*a,s.hurt.knockZ=e.dirZ*a}n.hitCount+=1,Dr(n,"hit",s.id,s.position)}}function vo(n,t,e){Oc(n,{kind:"dummy",index:t},e)}function Hf(n,t){const e=[n.playerHurt];for(const s of n.dummies)e.push(s.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const s of e)s.timer>0&&(s.timer=Math.max(0,s.timer-t),s.timer===0&&(s.type="none",s.knockX=0,s.knockZ=0)),(s.knockX!==0||s.knockZ!==0)&&(s.knockX*=i,s.knockZ*=i,Math.abs(s.knockX)<1e-4&&(s.knockX=0),Math.abs(s.knockZ)<1e-4&&(s.knockZ=0))}function Bc(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Gf(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const s=e.reach[t.weapon]??0,a=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Pr),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>s+l)continue;const m=u>Mn?f/u:o,v=u>Mn?d/u:r;if(u>Mn&&(f*o+d*r)/u<a)continue;let g="light";t.weapon==="greatsword"?g="knock":t.comboIndex>=3&&(g="heavy");const p=e.knockback[t.weapon]??0;let _=u;p>0&&(_=Math.max(u+p,c));const x=Math.max(0,_-u);vo(n,n.dummies.indexOf(h),{type:g,duration:Bc(n,g),dirX:m,dirZ:v,knockback:x})}}function Vf(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const s=i.weapon===""?void 0:e.moves[i.weapon];if(!s||!s.enabled||!n.modules.hits||!n.modules.dummies)return;const a=s.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(a.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),v=Math.cos(i.facing),g=Math.cos(zl(a.arcDeg,0,180)*Pr),p=n.config.dummies.radius;for(let _=0;_<n.dummies.length;_++){const x=n.dummies[_];if(i.hitIds.indexOf(x.id)>=0)continue;const y=u>Mn?zl(((x.position.x-r)*f+(x.position.z-l)*d)/u,0,1):0,R=r+f*y,E=l+d*y,S=Math.hypot(x.position.x-R,x.position.z-E);let T=!1;if(a.shape==="circle")T=S<=a.radius+p;else if(a.shape==="capsule")T=S<=Math.max(a.radius,a.width)+p;else{const F=x.position.x-c,D=x.position.z-h,C=Math.hypot(F,D),U=C>Mn?(F*m+D*v)/C>=g:!0;T=C<=a.radius+p&&U||S<=a.width+p}if(!T)continue;const b=x.position.x-r,M=x.position.z-l,P=Math.hypot(b,M);if(P>Mn&&(b*m+M*v)/P<Math.cos(Math.max(a.arcDeg,90)*Pr))continue;const I=P>Mn?b/P:m,k=P>Mn?M/P:v;Oc(n,{kind:"dummy",index:_},{type:a.type,duration:a.duration,dirX:I,dirZ:k,knockback:a.knockback}),i.hitIds.push(x.id),Dr(n,"link-hit",x.id,x.position)}}function Xf(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const s=n.dummies[i.value-1];if(!s)continue;const a=e.x-s.position.x,o=e.z-s.position.z,r=Math.hypot(a,o);if(r>t.dummyReach)continue;const l=r>Mn?a/r:0,c=r>Mn?o/r:1;Oc(n,{kind:"player"},{type:"light",duration:Bc(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:s.id})}}function Wf(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Gf(n),Vf(n,t),Xf(n)}function zl(n,t,e){return n<t?t:n>e?e:n}const Fd=Math.PI/180,Hc=1e-6;function $f(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function so(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Ud(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Hc?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function zd(n,t,e){const i=n.character,s=Math.hypot(i.velocity.x,i.velocity.z),a=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&s<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Hc)&&a<=Math.max(0,e.inputDeadZone)&&!o}function Yf(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Zf(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!zd(n,t,e))return!1;const i=Ud(n,t,e.lookRange);if(i===null)return!1;const s=Ie(i-n.character.bodyYaw);return Math.abs(s)>Nd(n,e)}function Nd(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Fd}function qf(n,t,e){const i=n.turnInPlace,s=n.config.turnInPlace;if(!s.enabled||!n.modules.turnInPlace||!zd(n,e,s)){so(n);return}const a=Ud(n,e,s.lookRange);if(a===null){so(n);return}const o=n.character,r=Ie(a-o.bodyYaw),l=Math.abs(r),c=Nd(n,s),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Hc;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,s.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,s.settleDeg)*Fd);i.targetYaw=Ie(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(s.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ie(i.targetYaw-i.fromYaw);o.bodyYaw=Ie(i.fromYaw+d*Yf(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const di=1e-6;function Ie(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ha(n,t,e,i){const s=Ie(t-n);return n+s*(1-Math.exp(-Math.max(e,di)*i))}function da(n,t,e,i,s){const o=Ie(t-n)*(1-Math.exp(-Math.max(e,di)*s)),r=Math.max(i,0)*s;return r<=di?n:n+cs(o,-r,r)}function Nl(n,t,e,i,s){const a=(t-n)*(1-Math.exp(-Math.max(e,di)*s)),o=Math.max(i,0)*s;return o<=di?n+a:n+cs(a,-o,o)}function cs(n,t,e){return n<t?t:n>e?e:n}function Ol(n,t,e,i){const s=Ie(t-n),a=Math.abs(s);return a<=i||a<=e?t:Ie(n+Math.sign(s)*Math.max(e,0))}function jf(n,t,e){const i=n.character,s=n.config.orientation,a=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=a.phase!=="idle"||a.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>di,d=a.charging&&a.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(a.phase!=="idle")i.facing=a.attackFacing;else if(r)i.facing=Zs(n,e);else if(c)i.facing=da(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Zs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(s.facingDeadZone,di)){const M=Math.atan2(e.moveX,e.moveZ),P=s.facingTurnRate*Math.PI/180*t,I=s.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Ol(i.facing,M,P,I);else if(h>=s.facingMinMagnitude&&Math.abs(Ie(M-i.facing))>s.facingDeadbandDeg*Math.PI/180){const F=ha(i.facing,M,s.facingSmoothRate,t);i.facing=Ol(i.facing,F,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Zf(n,e)||(c?i.bodyYaw=da(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=ha(i.bodyYaw,m,s.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ie(p-i.bodyYaw))>M&&(p=i.moveYaw)}const _=o||f||g,x=s.maxHeadTurnDeg*Math.PI/180;let y;if(_){const M=c?n.config.gaze.headTurnRate:s.headTurnRate;y=c?da(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):ha(i.headYaw,p,M,t)}else{const M=Ie(i.headYaw-i.bodyYaw),P=Ie(p-i.bodyYaw),I=Math.abs(P)<Math.abs(M)-1e-9,k=I?n.config.gaze.headReturnRate:s.headTurnRate,F=I?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,D=Number.isFinite(F)?da(M,P,k,F,t):ha(M,P,k,t);y=i.bodyYaw+D}const R=Ie(y-i.bodyYaw);R>x?y=i.bodyYaw+x:R<-x&&(y=i.bodyYaw-x),i.headYaw=y;const E=n.config.gaze;let S=0;if(c)S=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*cs(E.eyeHeightRatio,0,1),I=M.position.y+n.config.dummies.height*cs(E.aimHeightRatio,0,1),k=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);S=Math.atan2(I-P,Math.max(di,k))}}const T=Math.max(0,E.maxHeadPitchDeg)*Math.PI/180;S=cs(S,-T,T);const b=_?E.headPitchRate:Math.min(E.headPitchRate,E.headReturnRate);i.headPitch=Nl(i.headPitch,S,b,Math.max(0,E.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Nl(i.bodyPitch,i.headPitch*cs(E.bodyPitchScale,0,1),E.bodyPitchRate,Math.max(0,E.maxHeadPitchDeg)*Math.PI/180,t)}const Od=1e-6,_o=Math.PI/180;function yo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Kf(n,t,e){const i=n.character.position,s=Math.max(0,e.homingConeDeg)*_o,a=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>a||Math.abs(Ie(Math.atan2(c,h)-t))>s||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Jf(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Qf(n,t){const e=n.abilities,i=n.character.position,s=Math.max(1,Math.floor(t.perWave)),a=t.spreadDeg*_o,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Kf(n,e.channelYaw,t);for(let c=0;c<s;c++){const h=(c-(s-1)*.5)*a,f=e.channelYaw+h,d=(c-(s-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Jf(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}yo(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function tp(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const s=[];for(const a of i.pending){if(a.delay-=t,a.delay>0){s.push(a);continue}const o={id:++i.nextId,x:a.x,y:a.y,z:a.z,dirX:Math.sin(a.yaw),dirZ:Math.cos(a.yaw),speed:a.speed,life:e.life,radius:e.radius,targetIndex:a.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*_o,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:a.wave};i.projectiles.push(o),i.volleyId+=1,yo(n,"projectile-fire",i.volleyId,o)}i.pending=s}function Bl(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,yo(n,"channel-end",0,n.character.position))}function ep(n,t,e,i,s,a){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=a==="skill2"?e.skill2Pressed:e.attackHeld,h=s&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){Bl(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),yo(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Zs(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Od),Qf(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Bl(n,i);break}}function np(n,t,e){const i=Math.max(0,e.homingConeDeg)*_o,s=Math.max(0,e.homingRange),a=Math.atan2(t.dirX,t.dirZ);let o=-1,r=s+Od;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Ie(Math.atan2(h,f)-a))>i||(o=l,r=d)}return o}function ip(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=np(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Ie(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),v=f+m;r.dirX=Math.sin(v),r.dirZ=Math.cos(v)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(!(f*f+d*d>u*u)){vo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const sp={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params;ep(n,t,e,a,s,i.cfg.slot),tp(n,t,a),ip(n,t,a)}},zo=1e-6;function Bd(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ap(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Bd(n,"ring-place",i.id,e)}function op(n,t,e){const i=n.abilities,s=n.config.dummies.radius,a=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,zo),a)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+s;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),v=m>zo?f/m:0,g=m>zo?d/m:1;vo(n,c,{type:"heavy",duration:e.stun,dirX:v,dirZ:g,knockback:e.knockback})}Bd(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const rp={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:s}){const a=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;s&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&ap(n,a),op(n,t,a)}},cp={channelVolley:sp,groundRing:rp};function lp(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const s=i.paramsRef,a=s?e[s]:void 0;if(!a||typeof a!="object")throw new Error(`[skills] ${i.id}: paramsRef "${s??""}" 在 core.abilities 中不存在`);return{cfg:i,params:a}})}function hp(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const s=cp[i.cfg.kind];if(!s)continue;const a=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;s.update({world:n,dt:t,intents:e,skill:i,onWeapon:a})}}function dp(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Hd(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function up(n,t,e){hp(n,t,e)}function No(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Hl=1e-6;function Gl(n,t,e){return n<t?t:n>e?e:n}function Gd(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Vd(n){const t=n.camera,e=Gd();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function fp(n){const t=n.camera,e=n.config.camera,i=n.character.position;let s=0,a=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Gl((e.radius-d)/Math.max(Hl,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),s+=m,a+=c.position.x*m,o+=c.position.z*m,r+=1}const l=s<=0?0:Gl(s/(s+Math.max(Hl,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,s<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=a/s,h=o/s;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function pp(n){const t=[],e=n.ground.size;t.push(Gi("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Gi(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const s=i.openingWidth/2,a=i.wallThickness;t.push(Gi(`${i.id}-left`,"wall",i.x-s-i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Gi(`${i.id}-right`,"wall",i.x+s+i.wallSpan/2,i.z,i.wallSpan,a,0,i.wallHeight)),t.push(Gi(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,a,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Gi(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Gi(n,t,e,i,s,a,o,r){return{id:n,kind:t,minX:e-s/2,maxX:e+s/2,minY:o,maxY:r,minZ:i-a/2,maxZ:i+a/2}}const qn=1e-6;function ao(n,t,e){return n<t?t:n>e?e:n}function qs(n,t,e,i,s,a,o){const r=s*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+a+qn||c.maxY<i-o-qn||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Gc(n,t,e,i,s){let a=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+s+qn||l.minY>=o-qn)continue;const c=ao(t.x,l.minX,l.maxX),h=ao(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(a=!0,u>qn*qn){const m=Math.sqrt(u),v=(e-m)/m;t.x+=f*v,t.z+=d*v}else{const m=t.x-l.minX,v=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,_=Math.min(m,v,g,p);_===m?t.x=l.minX-e:_===v?t.x=l.maxX+e:_===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return a}function Vc(n,t,e,i,s){const a=t.y+i;for(const o of n){if(o.maxY<=t.y+s+qn||o.minY>=a-qn)continue;const r=ao(t.x,o.minX,o.maxX),l=ao(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-qn)return!0}return!1}const li=1e-6,xs=Math.PI/180;function Xc(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Lr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xd(n){n.arrows.length=0}function mp(n,t,e,i,s,a,o,r,l,c,h){const f=i-n,d=a-e,u=f*f+d*d;let m=0;u>li&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const v=n+f*m,g=e+d*m,p=v-o,_=g-r;if(p*p+_*_>h*h)return-1;const x=t+(s-t)*m;return x<l-.1||x>l+c?-1:m}function gp(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=li)return-1;const s=n.character.position,a=Math.max(0,e.homingConeDeg)*xs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+li;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-s.x,d=h.position.z-s.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Xc(Math.atan2(f,d)-t))>a||u<c&&(l=h.id,c=u)}}return l}function xp(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const s=n.character.position,a=Math.atan2(i.position.x-s.x,i.position.z-s.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*xs;return t+us(Xc(a-t),-o,o)}function vp(n,t,e,i,s,a){const o=n.config.combat.bow.trajectory,r={vy:a*Math.sin(Math.max(0,o.launchPitchDeg)*xs),horizontal:0};if(r.horizontal=a*Math.cos(Math.max(0,o.launchPitchDeg)*xs),s<=0)return r;const l=n.dummies.find(v=>v.id===s);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(li,a),f=l.position.y+n.config.dummies.height*us(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=us(u,-a*.45,a*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,a*a-m*m))}}function _p(n,t,e){const i=n.config.combat.bow.trajectory,s=Math.max(0,Math.min(1,t)),a=i.speedMin+(i.speedMax-i.speedMin)*s,o=n.character.position,r=gp(n,e),l=xp(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=vp(n,f,u,d,r,a),v={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*xs};return n.arrows.push(v),Lr(n,"arrow-shot",s,v),v}function us(n,t,e){return n<t?t:n>e?e:n}function yp(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,s=n.config.dummies.radius,a=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const y=n.dummies[c.stuckDummy];if(y){const R=Math.cos(y.bodyYaw),E=Math.sin(y.bodyYaw);c.x=y.position.x+c.offX*R+c.offZ*E,c.y=y.position.y+c.offY,c.z=y.position.z-c.offX*E+c.offZ*R,c.yaw=y.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const y=n.dummies.find(R=>R.id===c.targetId);if(!y)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>li){const E=Math.atan2(y.position.x-c.x,y.position.z-c.z),S=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=S+us(Xc(E-S),-T,T);c.vx=Math.sin(b)*R,c.vz=Math.cos(b)*R;const M=Math.hypot(y.position.x-c.x,y.position.z-c.z);if(M>.3){const P=M/R,k=(y.position.y+a*us(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,F=Math.max(0,i.verticalTurnRate)*t;c.vy+=us(k-c.vy,-F,F)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,v=d+c.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const R=n.dummies[y],E=mp(h,f,d,u,m,v,R.position.x,R.position.z,R.position.y,a,s+i.radius);E>=0&&E<p&&(p=E,g=y)}if(g>=0){const y=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(v-d)*p,c.stuck=!0,c.stuckDummy=g;const R=Math.cos(y.bodyYaw),E=Math.sin(y.bodyYaw),S=c.x-y.position.x,T=c.z-y.position.z;c.offX=S*R-T*E,c.offZ=S*E+T*R,c.offY=c.y-y.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-y.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);vo(n,g,{type:"light",duration:.22,dirX:M>li?c.vx/M:0,dirZ:M>li?c.vz/M:1,knockback:.14}),Lr(n,"arrow-land",y.id,c),l.push(c);continue}const _=qs(n.boxes,u,v,m+.4,.04,0,6),x=Number.isFinite(_)?_:0;if(m<=x+.02&&c.vy<0){c.x=u,c.y=x+Math.max(0,i.groundStickLift),c.z=v,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const y=Math.atan2(-c.vy,Math.max(li,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*xs),c.rest=Math.max(.2,i.stickSec),Lr(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=v,l.push(c)}n.arrows=l}const kr=1e-6,Mp=Math.PI/180;function Ir(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wc(n,t,e){return n<t?t:n>e?e:n}function Mo(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Fr(n){const t=n.id,e=n.windowId;Object.assign(n,Mo()),n.id=t,n.windowId=e}function Sp(n){Fr(n)}function Wd(n){Fr(n.playerLink);for(const t of n.dummies)Fr(t.link)}function bp(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Ur(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const s=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;s<=0||(i.linkWindow=Math.max(i.linkWindow,s),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function oo(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Mo()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Ep(n,t){const e=n.config.links.search,i=n.character.position,s=Wc(e.maxAngleDeg,0,180)*Mp;let a=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<kr||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Ie(d-t))>s||f<r&&(r=f,a=l.id,o=d)}return{id:a,yaw:o,dist:a>0?r:0}}function wp(n,t,e,i){const s=n.config.links,a=n.playerLink,o=n.character.position,r=Zs(n,t),l=Ep(n,r),c=l.id>0?l.yaw:r,h=l.id>0?Wc(l.dist-s.search.stopDistance,0,e.distance):s.noTargetFallback?e.distance:0;a.phase="windup",a.linkWindow=0,a.source="none",a.usedWindowId=a.windowId,a.cooldown=s.sharedCooldown,a.kind=e.kind,a.weapon=i,a.id+=1,a.timer=0,a.progress=0,a.facing=c,a.targetId=l.id,a.targetDist=l.dist,a.travel=h,a.travelled=0,a.fromX=o.x,a.fromZ=o.z,a.pulseTimer=0,a.hitIds=[],a.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,s.sharedCooldown),Ir(n,"link-start",a.id)}function Tp(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){oo(n);return}if(e.weapon!==n.combat.weapon){oo(n);return}e.timer+=t;const s=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let a=0;for(;e.phase!=="idle"&&a++<8;){const l=s(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ir(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ir(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Wc(r/o,0,1):1,e.phase==="active"&&i.active>kr){const l=Math.max(0,e.travel-e.travelled),c=Math.max(kr,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Ap(n,t,e){const i=n.config.links,s=n.playerLink,a=n.character.position;if(s.consumedAttack=!1,s.phase==="active"&&(s.travelled+=Math.hypot(a.x-s.fromX,a.z-s.fromZ)),s.fromX=a.x,s.fromZ=a.z,!i.enabled||!n.modules.links){s.phase!=="idle"&&oo(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&s.phase==="idle"&&s.usedWindowId!==s.windowId&&i.windows.sprint>0&&(s.linkWindow=Math.max(s.linkWindow,i.windows.sprint),s.source="sprint"),s.phase==="idle"&&s.prevSprinting&&!r&&Ur(n,"sprint"),s.prevSprinting=r,Tp(n,t);const l=i.moves[o.weapon];e.attackPressed&&s.phase==="idle"&&s.linkWindow>0&&s.usedWindowId!==s.windowId&&s.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&wp(n,e,l,o.weapon)}const zr=1e-6;function hi(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function $d(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function So(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.timings=$d()}function Rp(n){return{weapon:Fi[Math.max(0,n-1)]??Fi[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,timings:$d()}}function Cp(n,t){return Zs(n,t)}function Pp(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,s=Math.max(0,t*e.maxLungeScale),a=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+a,s)}function Yd(n,t,e,i){const s=n.combat;s.phase="windup",s.phaseTimer=0,s.comboIndex=i,s.queued=!1,s.charging=!1,s.charge=0,s.attackFacing=Cp(n,t),s.attackProgress=0,s.timings=e,s.attackId+=1,hi(n,"attack-start",i)}function Zd(n){return Math.max(0,n.config.combat.settle)}function Nr(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Yd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Zd(n),lunge:Pp(n,i.lunge[e-1]??0)},e)}function Vl(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Yd(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Zd(n),lunge:i.lunge},0),_p(n,e,n.combat.attackFacing),hi(n,"charge-release",e);const s=n.config.combat.bow;s.recoilSpeed>0&&(n.kick.x-=Math.sin(n.combat.attackFacing)*s.recoilSpeed,n.kick.z-=Math.cos(n.combat.attackFacing)*s.recoilSpeed)}function Dp(n,t,e){const i=n.combat;if(i.phase==="idle")return;const s=i.timings;i.phaseTimer+=t;let a=0;for(;i.phase!=="idle"&&a++<8;){const l=i.phase==="windup"?s.windup:i.phase==="active"?s.active:i.phase==="recovery"?s.recovery:s.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",hi(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",hi(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Nr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>zr&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Nr(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=s.windup+s.active+s.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=s.windup+i.phaseTimer:i.phase==="recovery"?r=s.windup+s.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function Lp(n,t,e){const i=n.combat,s=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Fi.length){const l=Fi[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,So(n),oo(n),hi(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,hi(n,"combo-reset",0))),Dp(n,t,e);const a=s.weapons[i.weapon],o=n.dash.phase==="active";if(a.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||s.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<a.comboCount?i.comboIndex+1:1;Nr(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,hi(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(s.bow.maxChargeTime,zr)),s.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Vl(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=s.bow.minChargeToFire?Vl(n,e,l):hi(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.timings.active>zr)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,s.lungeCurve),f=v=>c*(1-Math.pow(1-Math.min(1,Math.max(0,v/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let m=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);m=Math.min(m,Math.max(0,s.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*m,n.impulse.z=Math.cos(i.attackFacing)*m}}const Or=1e-6;function Oo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function kp(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function qd(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Xl(n,t,e){return n<t?t:n>e?e:n}function Ip(n,t,e){const i=n.config.dash,a=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=a.x,f=a.z;for(;c<l-Or;){const d=Math.min(l,c+r),u=a.x+t*d,m=a.z+e*d,v=Xl(u,o.minX,o.maxX),g=Xl(m,o.minZ,o.maxZ),p={x:v,y:a.y,z:g};if(Vc(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=v,f=g,c=d,v!==u||g!==m))break}return{x:h,z:f}}function Fp(n,t,e){const i=n.dash,s=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Ur(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Oo(n,"dash-ready",0)}const a=n.combat,o=a.weapon==="bow"&&(a.charging||a.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(a.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(a.charging=!1,a.charge=0,a.phase!=="idle"&&So(n));const l=Bf(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?s.blinkCooldown:s.rollCooldown,f){const d=Ip(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",s.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Ur(n,"blink"),Oo(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Or,s.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*s.rollDistance,i.toZ=i.fromZ+h*s.rollDistance,Oo(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Or,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const $e=1e-6,Br=Math.PI*2,Up=7,zp=18;function Np(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Wl(n,t,e,i){return n+Np(t-n)*(1-Math.exp(-Math.max(e,$e)*i))}function $c(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Op(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},s=n.initialModes[e]??"idle";t.push({id:e+1,mode:s,initialMode:s,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Id(),link:Mo()})}return t}function Bp(n){const t=Uo.indexOf(n);return Uo[(t+1)%Uo.length]}function jd(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],s=t.spawn[e]??{x:i.homeX,z:i.homeZ},a=t.initialModes[e]??i.initialMode;i.mode=a,i.initialMode=a,i.homeX=s.x,i.homeZ=s.z,i.position.x=s.x,i.position.y=0,i.position.z=s.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=s.x,i.targetZ=s.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Sp(i.link)}n.dummyAttackCount=0}function Hp(n,t,e){const i=No(n)*Br,s=Math.sqrt(No(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*s,t.targetZ=t.homeZ+Math.sin(i)*s,t.wanderTimer=e.wanderInterval*(.6+No(n)*.8)}function Gp(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Vp(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let s=0;for(;t.attackPhase!=="idle"&&s++<4;){const r=Math.max(Gp(t,i),$e);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",$c(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const a=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||a<=0?0:Math.min(1,o/a)}function Xp(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,s=i.x-t.position.x,a=i.z-t.position.z,o=Math.hypot(s,a),r=o>$e?s/o:0,l=o>$e?a/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&Hp(n,t,e);const v=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(v,g);p>$e&&(c=v/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>$e&&(f=Math.atan2(c,h)):o>$e&&(f=Math.atan2(r,l)),e.leashRadius>$e&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,m=Math.hypot(d,u);if(m>e.leashRadius){const v=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-u/m;c=c*(1-v)+g*v,h=h*(1-v)+p*v;const _=Math.hypot(c,h);_>$e&&(c/=_,h/=_)}}return{x:c,z:h,facing:f}}function Wp(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+$e&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,$c(n,"dummy-attack",e))}Vp(n,e,t,i);const s=Xp(n,e,i),a=n.config.worldBounds;(s.x>0&&e.position.x>=a.maxX-$e||s.x<0&&e.position.x<=a.minX+$e)&&(s.x=0),(s.z>0&&e.position.z>=a.maxZ-$e||s.z<0&&e.position.z<=a.minZ+$e)&&(s.z=0);const o=1-Math.exp(-Math.max(i.acceleration,$e)*t);e.velocity.x+=(s.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(s.z*i.moveSpeed-e.velocity.z)*o,e.facing=s.facing,e.bodyYaw=Wl(e.bodyYaw,e.facing,Up,t),e.headYaw=Wl(e.headYaw,e.facing,zp,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Gc(n.boxes,e.position,i.radius,i.height,c))if(Vc(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,_=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(_)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=qs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+$e&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const m=Math.hypot(e.velocity.x,e.velocity.z),v=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,$e)),g=Math.max(n.config.strideLength*(1+v*n.config.strideSpeedGain),$e);e.stride=g,e.gaitPhase=(e.gaitPhase+u/g*Br)%Br}function $p(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const s=n.dummies[e.dummyClickId-1];s.mode=Bp(s.mode),s.targetX=s.position.x,s.targetZ=s.position.z,s.wanderTimer=0,s.attackCooldown=0,s.attackPhase="idle",s.attackPhaseTimer=0,s.attackProgress=0,$c(n,"dummy-mode",s)}for(const s of n.dummies)Wp(n,t,s,i)}const bn=1e-6,$l=Math.PI*2;function Yl(n,t){return Math.sqrt(n*n+t*t)}function ua(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Yp(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,n.kick.x=0,n.kick.z=0,So(n)}function Zp(n,t,e){const i=n.character,s=n.config,a=qs(n.boxes,t,e,s.characterHeight,s.characterRadius,s.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=a>Number.NEGATIVE_INFINITY?a:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=s.strideLength,i.distance=0,i.coyoteTime=s.coyoteTime,i.jumpBuffer=0,n.kick.x=0,n.kick.z=0,So(n),Wd(n),qd(n),Hd(n),Xd(n),so(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Nc,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function qp(n,t,e){const i=n.config,s=n.character,a=s.position,o=s.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Yl(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&a.x>=h.maxX-bn||r<0&&a.x<=h.minX+bn)&&(r=0),(l>0&&a.z>=h.maxZ-bn||l<0&&a.z<=h.minZ+bn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;s.sprinting=!m&&e.sprintHeld&&c>bn;const v=i.combat.weapons[n.combat.weapon];let g=v?v.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(s.sprinting?i.sprintMultiplier:1)*g;{const k=m?i.skillDecel:c>bn?i.acceleration:i.friction,F=1-Math.exp(-k*t);o.x+=(r*p-o.x)*F,o.z+=(l*p-o.z)*F}e.jumpPressed?s.jumpBuffer=i.jumpBufferTime:s.jumpBuffer=Math.max(0,s.jumpBuffer-t),s.coyoteTime=s.grounded?i.coyoteTime:Math.max(0,s.coyoteTime-t),s.jumpBuffer>0&&s.coyoteTime>0&&(o.y=i.jumpSpeed,s.grounded=!1,s.coyoteTime=0,s.jumpBuffer=0,ua(n,"jumped",i.jumpSpeed)),n.events.some(k=>k.type==="blink"&&k.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0,n.kick.x=0,n.kick.z=0);const x=a.x,y=a.z;if(a.x+=(o.x+n.impulse.x+n.kick.x+n.playerHurt.knockX)*t,a.z+=(o.z+n.impulse.z+n.kick.z+n.playerHurt.knockZ)*t,n.kick.x!==0||n.kick.z!==0){const k=Math.exp(-Math.max(0,i.combat.bow.recoilDecay)*t);n.kick.x*=k,n.kick.z*=k,Math.abs(n.kick.x)<1e-4&&(n.kick.x=0),Math.abs(n.kick.z)<1e-4&&(n.kick.z=0)}if(Gc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight)){if(Vc(n.boxes,a,i.characterRadius,i.characterHeight,i.stepHeight))a.x=x,a.z=y,o.x=0,o.z=0;else{const k=a.x-x,F=a.z-y;Math.abs(k)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(F)<Math.abs(o.z*t)*.5&&(o.z=0)}ua(n,"blocked",1)}a.x<h.minX?(a.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):a.x>h.maxX&&(a.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),a.z<h.minZ?(a.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):a.z>h.maxZ&&(a.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const E=qs(n.boxes,a.x,a.z,a.y,i.characterRadius,i.stepHeight,i.fallTolerance);s.grounded&&E>a.y+bn&&E-a.y<=i.stepHeight+bn&&(a.y=E,o.y=0,ua(n,"stepUp",E));const S=a.y;o.y-=i.gravity*t,a.y+=o.y*t;const T=qs(n.boxes,a.x,a.z,S,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&a.y<=T&&o.y<=0?(a.y=T,o.y=0,s.grounded||ua(n,"landed",T),s.grounded=!0):s.grounded=!1;const b=Yl(a.x-x,a.z-y);s.distance+=b;const M=b/Math.max(t,bn),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,bn)),I=Math.max(i.strideLength*(1+P*i.strideSpeedGain),bn);s.stride=I,s.gaitPhase=(s.gaitPhase+b/I*$l)%$l}const Hr=1e-6,Zl=2.399963229728653;function Ci(n,t,e){return n<t?t:n>e?e:n}function ql(n,t,e,i,s,a,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,v;f<Hr?(u=r,m=l,v=d):(u=c/f,m=h/f,v=d-f);const g=v+o;n.x-=u*g*s,n.z-=m*g*s,t.x+=u*g*a,t.z+=m*g*a}function jp(n){const t=n.config.separation,e=n.dummies,i=n.character.position,s=n.config.characterRadius,a=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*Zl;ql(e[f].position,e[d].position,a,a,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*Zl;ql(i,e[f].position,s,a,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Gc(n.boxes,h.position,a,n.config.dummies.height,l),h.position.x=Ci(h.position.x,c.minX,c.maxX),h.position.z=Ci(h.position.z,c.minZ,c.maxZ)}function Kp(n,t,e,i,s,a,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=Ci(r.minScale,0,1);if(l<Hr||c<=0||h>=1)return 1;const f=s+o,d=Ci(r.approachDot,0,.99);let u=0;for(const m of a){const v=m.position.x-n,g=m.position.z-t,p=Math.hypot(v,g);if(p>=f+c)continue;if(p<Hr){u=1;continue}const _=(e*v+i*g)/(l*p);if(_<=d)continue;const x=Ci(1-(p-f)/c,0,1),y=Ci((_-d)/(1-d),0,1);u=Math.max(u,x*y)}return 1-(1-h)*Ci(u,0,1)}function Jp(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Kp(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const jl=1e-6,Qp=Math.PI/180;function tm(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function em(n,t,e){return n<t?t:n>e?e:n}function nm(n,t,e){const i=n.config.targeting,s=n.targeting,a=n.character.position;let o=n.character.facing;Math.hypot(e.moveX,e.moveZ)>jl&&(o=Math.atan2(e.moveX,e.moveZ));const l=em(i.maxAngleDeg,0,180)*Qp;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-a.x,v=u.position.z-a.z,g=Math.hypot(m,v);if(g<jl||g>i.range)continue;const p=Math.atan2(m,v),_=Math.abs(Ie(p-o));if(_>l)continue;const x=g-i.frontBias*Math.cos(_);x<c&&(c=x,h=u.id,f=p,d=g)}s.targetId=h,s.targetYaw=f,s.targetDist=d,s.hasTarget=h>0}const Un=1e-6;function ls(n,t,e){return n<t?t:n>e?e:n}function Kl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function im(n,t,e){const i=n.config.gaze,s=n.gaze;if(!i.enabled||!n.modules.gaze){s.active=!1,s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}const a=n.character.position,o=(k,F)=>{const D=k.position.x-a.x,C=k.position.z-a.z,U=Math.hypot(D,C);if(U<Un||U>F)return 0;const B=ls((F-U)/Math.max(Un,F-i.nearDistance),0,1);let W=B*(i.modeWeight[k.mode]??.5);return k.attackPhase==="active"&&(W+=i.attackBoost*B),W},r=[];let l=0,c=!1,h=!1,f=!1;for(const k of n.dummies){const F=o(k,i.threatRange),D=k.position.x-a.x,C=k.position.z-a.z,U=Math.hypot(D,C);F>0&&(r.push({id:k.id,x:k.position.x,z:k.position.z,dx:D,dz:C,yaw:Math.atan2(D,C),w:F}),l+=F,U<=i.approachDist&&(i.modeWeight[k.mode]??.5)>=i.hostileModeWeight&&(f=!0)),U>Un&&U<=i.recoveryDist&&(c=!0),(k.attackPhase==="windup"||k.attackPhase==="active")&&U<=i.threatRange&&(h=!0)}const d=l<=0?0:ls(l/(l+Math.max(Un,i.saturation)),0,1),u=r.length>0,m=s.active,v=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>Un&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(s.active=v||p,!s.active){s.mainId=0,s.mainYaw=0,s.mainPitch=0,s.centroidYaw=0,s.threatCount=0,s.threat=0;return}if(r.length===0)return;r.sort((k,F)=>F.w-k.w);const _=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),R=i.behindAngleDeg*Math.PI/180,E=n.character.bodyYaw;let S=0,T=0,b=0;for(const k of _){const F=Math.abs(Kl(k.yaw-y))/Math.PI;let D=k.w/(1+Math.max(i.spreadFalloff,0)*F*F);k!==x&&i.behindFalloff<1&&Math.abs(Kl(k.yaw-E))>R&&(D*=Math.max(i.behindFalloff,0)),S+=k.x*D,T+=k.z*D,b+=D}s.mainId=x.id,s.mainYaw=y;const M=n.dummies.find(k=>k.id===x.id),P=(M?M.position.y:0)+n.config.dummies.height*ls(i.aimHeightRatio,0,1),I=a.y+n.config.characterHeight*ls(i.eyeHeightRatio,0,1);s.mainPitch=Math.atan2(P-I,Math.max(Un,Math.hypot(x.dx,x.dz))),s.centroidYaw=b>Un?Math.atan2(S/b-a.x,T/b-a.z):y,s.threatCount=r.length,s.threat=d}function sm(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function am(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,s=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(s<Un||s>e.threatRange)return 0;const a=Math.max(Un,e.threatRange-e.nearDistance),o=ls((e.threatRange-s)/a,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Un,e.modeWeight.attack??1.5);return ls(r/l,0,1)}function om(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function rm(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:pp(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Rp(1),playerLink:Mo(),arrows:[],arrowSeq:0,abilities:dp(),skills:lp(n),impulse:{x:0,z:0},kick:{x:0,z:0},targeting:tm(),turnInPlace:$f(),playerHurt:Id(),hitCount:0,dash:{...kp(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Gd(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:om(),dummies:Op(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function cm(n){Yp(n),jd(n),Wd(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Nc,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Hd(n),Xd(n),qd(n),Vd(n),so(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Jl(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){cm(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?nm(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Ap(n,t,e),n.modules.combat&&Lp(n,t,e),n.modules.dash&&Fp(n,t,e),n.modules.movement&&qp(n,t,e),n.modules.gaze&&im(n,t,e),n.modules.orientation&&jf(n,t,e),qf(n,t,e),n.modules.dummies&&$p(n,t,e),Hf(n,t),bp(n,t),n.modules.abilities&&up(n,t,e),n.modules.combat&&yp(n,t),n.modules.dummies&&(Wf(n,t),n.modules.separation&&(jp(n),Jp(n))),n.modules.camera?fp(n):Vd(n),n}function lm(n){let t=0;return{frame(e,i,s,a,o){if(a||s<=0)return t=0,0;t+=Math.min(e,.1)*s;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Jl(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Jl(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Kd={slopPx:12,longPressMs:450,doubleTapMs:280};function hm(n,t,e=Kd.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,s=n.dy/n.distance,a=t.rightX*i+t.forwardX*-s,o=t.rightZ*i+t.forwardZ*-s,r=Math.hypot(a,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:a/r,worldZ:o/r}}function xi(n,t,e,i,s,a){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:s,taps:a,worldX:0,worldZ:0}}function dm(n=Kd){const t=new Map,e=new Map,i=s=>t.get(s);return{begin(s,a,o,r,l){if(t.has(a))return null;for(const c of t.values())if(c.button===s)return null;return t.set(a,{button:s,pointerId:a,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),xi(s,"press",0,0,0,1)},move(s,a,o,r){const l=i(s);if(!l)return null;l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,xi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(s,a,o,r){const l=i(s);if(!l)return null;t.delete(s),l.x=a,l.y=o;const c=a-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return xi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(a-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),xi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:a,y:o}),xi(l.button,"tap",c,h,f,1))},cancel(s,a){const o=i(s);return o?(t.delete(s),xi(o.button,"cancel",o.x-o.startX,o.y-o.startY,a-o.startedAt,1)):null},poll(s){for(const a of t.values())if(!(a.longFired||a.dragging)&&s-a.startedAt>=n.longPressMs)return a.longFired=!0,xi(a.button,"longPress",a.x-a.startX,a.y-a.startY,s-a.startedAt,1);return null},isHeld(s){for(const a of t.values())if(a.button===s)return!0;return!1},reset(){t.clear(),e.clear()}}}const Bo=.001,um=18;function Gr(n,t,e){return n<t?t:n>e?e:n}function Vr(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function fm(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function pm(n,t,e,i,s=um){const a=fm(t);if(!a)return{state:Vr(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y),r=s,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Bo)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Bo?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Bo)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Gr(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function mm(n,t,e,i){const s=Math.min(e,i),a=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Gr(r,s,a):Gr(n,s,a)}function gm(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function xm(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ho=["jump","sprint","reset","attack","skill2"],vm=8,_m=16,Go=10,Ql=14,th=140,ym=18,Mm=16,Sm=400,bm=1.0001;function Za(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Em(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Za(e)}function wm(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:s}=n,a=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,v=null,g=-1,p=0,_=0,x=0,y=0,R=!1,E=0,S=1,T=0,b=null,M=0,P=0,I=!1,k=null,F=null,D=0,C=0,U=0,B=0,W=!1,et=!0,gt=-1;const ht=dm({slopPx:Ql,longPressMs:450,doubleTapMs:350});let ut=[],j=null;const J=new Set;function xt(O){O&&ut.push(O)}const tt=new Map;let At=Vr(),Ut=!1,vt=1;function Yt(){const O=Array.from(tt.values()),ct=s(),pt=pm(At,O,ct.pinchGain,ct.maxStepRatio,ym);if(At=pt.state,Ut=pt.pinching,pt.scale!==1&&(vt*=pt.scale),pt.started||pt.armedNow)b=null,I=!0,k=null;else if(pt.ended&&o===null&&O.length===1){const zt=O[0];o=zt.id,r=zt.x,l=zt.y,c=0,h=0,f=zt.x,d=zt.y,R=!1,E=0,S=1,T=0,performance.now(),b=null,I=!0,k=null}}const _t={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Wt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let G=0,le=0;const Ot={},kt=new Set,bt=[];function wt(){for(const O of Ho)Ot[O]!==void 0&&(Ot[O]=void 0),Y(O);ht.reset(),J.clear(),tt.clear(),At=Vr(),Ut=!1,o=null,c=0,h=0,f=0,d=0,R=!1,E=0,S=1,T=0,p=0,_=0,x=0,y=0,v=null,g=-1,b=null,I=!1,k=null,F=null,gt=-1,U=0,B=0,W=!1,et=!0}const Ft=()=>{document.hidden&&wt()},L=O=>{if(O.clientX===0&&O.clientY===0){m++;return}if(Za(O.target)||Em(O.clientX,O.clientY)){J.add(O.pointerId);return}if(J.delete(O.pointerId),tt.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!Ut){v=null,g=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,f=O.clientX,d=O.clientY,performance.now();const ct=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);R=ct,E=0,S=1,T=0,p=ct?O.screenX:0,_=ct?O.screenY:0,x=p,y=_,b=O.pointerId,M=O.clientX,P=O.clientY,I=!1}Yt()},w=O=>{if(O.pointerId===F&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(D!==0||C!==0)||(et?(U=O.clientX-D,B=O.clientY-C):(D=O.clientX,C=O.clientY,et=!0,U=0,B=0))),xt(ht.move(O.pointerId,O.clientX,O.clientY,performance.now())),!J.has(O.pointerId)&&tt.has(O.pointerId)&&(tt.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),Yt()),J.has(O.pointerId)||O.pointerId!==o)return;const ct=performance.now();if(v===O.pointerId&&ct-g<150){m++;return}const pt=O.clientX,zt=O.clientY;if(pt===0&&zt===0&&(r!==0||l!==0)){m++;return}const Bt=pt-f,z=zt-d,Mt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),K=Mt?O.screenX:0,lt=Mt?O.screenY:0,Et=Mt&&(K!==0||lt!==0),St=K-x,Zt=lt-y;if(R&&Et){const Ae=Math.hypot(St,Zt),Ee=Math.hypot(Bt,z);if(Ae>3){if(E=0,T<30&&Ee>6&&St*Bt+Zt*z>.7*Ae*Ee){const Le=Ae/Ee;Le>.2&&Le<5&&(S+=(Le-S)*.3,T++)}}else Ee>12&&(E++,E>=2&&(R=!1))}const ne=Math.hypot(Bt,z);if(!R){const Ae=u<0?Number.POSITIVE_INFINITY:ct-u,Ee=Et?Math.hypot(St,Zt):1/0;ne>28&&(Ae<200||Ee<ne*.4)&&(r+=Bt,l+=z,m++)}f=pt,d=zt,x=K,y=lt,O.pointerId===b&&Math.hypot(O.clientX-M,O.clientY-P)>vm&&(I=!0);let se,te;R&&Et?(se=(K-p)/S,te=(lt-_)/S):(se=pt-r,te=zt-l);const ge=Math.hypot(se,te),pe=a();ge>pe&&(se*=pe/ge,te*=pe/ge);const Ye=Math.hypot(c,h),Ze=Math.hypot(se,te);if(Ye>10&&Ze>10){const Ae=Math.abs(Math.atan2(c*te-h*se,c*se+h*te)),Ee=Math.max(Ye,Ze)*Ae,Le=Math.max(Math.hypot(Bt,z),Math.hypot(St,Zt)/Math.max(.2,S));if(Ae>.6&&Le<Math.max(6,Ee*.5)){m++;return}}c=se,h=te};function Y(O){if(!_t[O])return;_t[O]=!1,O==="attack"&&(Wt.attackReleased=!0);const ct=document.getElementById(`btn-${O}`);ct==null||ct.classList.remove("is-down")}function rt(){o!==null&&(v=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,E=0,S=1,T=0,p=0,_=0,x=0,y=0)}const dt=O=>{const ct=tt.delete(O.pointerId),pt=J.delete(O.pointerId);ct&&Yt(),O.pointerId===F&&(F=null,W?gt=performance.now():(U=0,B=0,gt=-1)),xt(ht.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Vt of Ho)Ot[Vt]===O.pointerId&&(Ot[Vt]=void 0,Y(Vt));const zt=!ct&&!pt&&tt.size<=1&&o!==null;(O.pointerId===o||tt.size===0||zt)&&rt(),!pt&&O.pointerId===b&&(!I&&!Za(O.target)&&(k={x:O.clientX,y:O.clientY}),b=null)};for(const O of Ho){const ct=document.getElementById(`btn-${O}`);if(!ct)continue;const pt=O==="attack"||O==="skill2",zt=z=>{if(z.preventDefault(),Ot[O]===void 0){Ot[O]=z.pointerId,_t[O]=!0,O==="jump"&&(Wt.jump=!0),O==="reset"&&(Wt.reset=!0),O==="sprint"&&(Wt.sprintPressed=!0),O==="attack"&&(Wt.attackPressed=!0),O==="skill2"&&(Wt.skill2=!0),ct.classList.add("is-down"),xt(ht.begin(O,z.pointerId,z.clientX,z.clientY,performance.now()));try{ct.setPointerCapture(z.pointerId)}catch{}pt&&(F=z.pointerId,D=z.clientX,C=z.clientY,et=!(z.clientX===0&&z.clientY===0),U=0,B=0,W=!1,gt=-1)}},Vt=z=>{Ot[O]===z.pointerId&&(Ot[O]=void 0,Y(O),xt(ht.end(z.pointerId,z.clientX,z.clientY,performance.now())))},Bt=z=>{Ot[O]===z.pointerId&&(Ot[O]=void 0,Y(O),xt(ht.cancel(z.pointerId,performance.now())))};ct.addEventListener("pointerdown",zt),ct.addEventListener("pointerup",Vt),ct.addEventListener("pointercancel",Bt),bt.push(()=>{ct.removeEventListener("pointerdown",zt),ct.removeEventListener("pointerup",Vt),ct.removeEventListener("pointercancel",Bt)})}const at=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of at){const ct=pt=>{pt.preventDefault(),G=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",ct),bt.push(()=>O.removeEventListener("pointerdown",ct))}const Lt=O=>{const ct=O.key.toLowerCase();if((ct===" "||ct.startsWith("arrow"))&&O.preventDefault(),kt.has(ct))return;kt.add(ct),ct===" "&&(Wt.jump=!0),ct==="r"&&(Wt.reset=!0),ct==="shift"&&(Wt.sprintPressed=!0),ct==="j"&&(Wt.attackPressed=!0),ct==="k"&&(Wt.skill2=!0),ct>="1"&&ct<="5"&&(G=Number(ct)),ct>="6"&&ct<="9"&&(le=Number(ct)-5);const pt=Math.max(bm,s().keyStep||1.12);(ct==="="||ct==="+")&&(vt*=pt),(ct==="-"||ct==="_")&&(vt/=pt)},Z=O=>{const ct=O.key.toLowerCase();kt.has(ct)&&(kt.delete(ct),ct==="j"&&(Wt.attackReleased=!0))},mt=O=>{if(Za(O.target))return;O.preventDefault();const ct=O.deltaMode===1?O.deltaY*Mm:O.deltaMode===2?O.deltaY*Sm:O.deltaY;vt*=gm(ct,s().wheelStep)},Kt=O=>{O.preventDefault()},ot=()=>{u=performance.now()};window.addEventListener("resize",ot),window.addEventListener("orientationchange",ot);const yt=typeof window<"u"?window.visualViewport:null;return yt&&(yt.addEventListener("resize",ot),yt.addEventListener("scroll",ot)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",w),window.addEventListener("pointerup",dt),window.addEventListener("pointercancel",dt),window.addEventListener("blur",wt),document.addEventListener("visibilitychange",Ft),window.addEventListener("keydown",Lt),window.addEventListener("keyup",Z),window.addEventListener("wheel",mt,{passive:!1}),window.addEventListener("gesturestart",Kt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:a(),badMoves:m,screenOk:R,originSX:p,originSY:_,screenX:x,screenY:y,scale:S}},peekAim(){const O=performance.now(),ct=Math.hypot(U,B),pt=F!==null||gt>=0&&O-gt<th;if(!(pt&&W&&ct>=Go))return{active:!1,holding:pt,x:0,z:0,dx:U,dy:B};const Vt=i(),Bt=U/ct,z=B/ct,Mt=Vt.rightX*Bt+Vt.forwardX*-z,K=Vt.rightZ*Bt+Vt.forwardZ*-z,lt=Math.hypot(Mt,K)||1;return{active:!0,holding:pt,x:Mt/lt,z:K/lt,dx:U,dy:B}},sample(){var q;const O=a();let ct=o!==null?Math.max(-1,Math.min(1,c/O)):0,pt=o!==null?Math.max(-1,Math.min(1,h/O)):0,zt=0,Vt=0;(kt.has("a")||kt.has("arrowleft"))&&(zt-=1),(kt.has("d")||kt.has("arrowright"))&&(zt+=1),(kt.has("w")||kt.has("arrowup"))&&(Vt-=1),(kt.has("s")||kt.has("arrowdown"))&&(Vt+=1),ct+=zt,pt+=Vt;let Bt=Math.hypot(ct,pt);Bt>1&&(ct/=Bt,pt/=Bt,Bt=1);const z=ct,Mt=pt;Bt<e&&(ct=0,pt=0);const K=i();let lt=K.rightX*ct+K.forwardX*-pt,Et=K.rightZ*ct+K.forwardZ*-pt;const St=Math.hypot(lt,Et);St>1&&(lt/=St,Et/=St);const Zt=performance.now();xt(ht.poll(Zt));const ne=Math.hypot(U,B);F!==null&&(ne>=_m?W=!0:ne<Go&&(W=!1));const se=F!==null||gt>=0&&Zt-gt<th,te=se&&W&&ne>=Go;let ge=0,pe=0;if(te){const Dt=U/ne,Ct=B/ne,Jt=K.rightX*Dt+K.forwardX*-Ct,jt=K.rightZ*Dt+K.forwardZ*-Ct,ae=Math.hypot(Jt,jt)||1;ge=Jt/ae,pe=jt/ae}!se&&F===null&&(U=0,B=0,gt=-1,W=!1);const Ye=k;k=null;const Ze=vt;vt=1;const Ae={moveX:lt,moveZ:Et,jumpPressed:Wt.jump,sprintHeld:_t.sprint||kt.has("shift"),sprintPressed:Wt.sprintPressed,resetPressed:Wt.reset,attackPressed:Wt.attackPressed,attackHeld:_t.attack||kt.has("j"),attackReleased:Wt.attackReleased,skill2Pressed:Wt.skill2,weaponSlot:G,dummyClickId:le,aimX:ge,aimZ:pe,aimActive:te};Wt.jump=!1,Wt.reset=!1,Wt.sprintPressed=!1,Wt.attackPressed=!1,Wt.attackReleased=!1,Wt.skill2=!1,G=0,le=0;const Ee=ut.map(Dt=>hm(Dt,K,Ql));ut=[],Ee.length>0&&(j=Ee[Ee.length-1]);const Le=o!==null?"pointer":kt.size>0?"keyboard":"idle";return{intents:Ae,stickX:ct,stickY:pt,stickRawX:z,stickRawY:Mt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:R,stickOriginSX:p,stickOriginSY:_,stickScreenX:x,stickScreenY:y,stickScale:S,stickVpTop:((q=xm())==null?void 0:q.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:U,aimDY:B,source:Le,tap:Ye,zoomScale:Ze,gestures:Ee,lastGesture:j}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",dt),window.removeEventListener("pointercancel",dt),window.removeEventListener("blur",wt),document.removeEventListener("visibilitychange",Ft),window.removeEventListener("keydown",Lt),window.removeEventListener("keyup",Z),window.removeEventListener("wheel",mt),window.removeEventListener("resize",ot),window.removeEventListener("orientationchange",ot),yt&&(yt.removeEventListener("resize",ot),yt.removeEventListener("scroll",ot)),window.removeEventListener("gesturestart",Kt),ht.reset();for(const O of bt)O()}}}const ro=1,co=2,lo=4,Jd=8,ho=16,Gs=32,Qd=64,tu=128,Tm=[[ro,"atk"],[co,"dash"],[lo,"link"],[Jd,"air"],[ho,"hurt"],[Gs,"aim"],[Qd,"spr"],[tu,"chan"]];function Vi(n){if(n===0)return"-";const t=Tm.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Am=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Rm=0,Cm=15,Vo=19,Pm=21,Dm=22,Lm=23,km=24,In={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},rn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,En=n=>Math.round(n*180/Math.PI*10)/10,Xo=Math.PI*2;function Ps(n){let t=n%Xo;return t>Math.PI&&(t-=Xo),t<-Math.PI&&(t+=Xo),t}function Im(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=ro),n.dash.phase!=="idle"&&(e|=co),n.playerLink.phase!=="idle"&&(e|=lo),n.character.grounded||(e|=Jd),n.playerHurt.type!=="none"&&(e|=ho),t.intents.aimActive&&(e|=Gs),n.character.sprinting&&(e|=Qd),n.abilities.channeling&&(e|=tu),e}function Fm(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Um(n){const t={sampleHz:n.sampleHz??In.sampleHz,sampleCapacity:n.sampleCapacity??In.sampleCapacity,eventCapacity:n.eventCapacity??In.eventCapacity,anomalyCapacity:n.anomalyCapacity??In.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??In.dirJumpDeg,aimDropDeg:n.aimDropDeg??In.aimDropDeg,freezeMs:n.freezeMs??In.freezeMs,freezeSpeed:n.freezeSpeed??In.freezeSpeed,stickLostMs:n.stickLostMs??In.stickLostMs,spikeMs:n.spikeMs??In.spikeMs},e=n.meta,i=[],s=[],a=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,v=-1,g=-1,p=0,_=-1e9,x=-1,y={},R=null,E=0,S=0,T=0,b=0;function M(D,C){const U=1/t.sampleHz,B=D[Rm];B-c<U-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(D),c=B)}function P(D,C,U,B,W,et){const gt=y[D]??-1e9;if(C-gt<1.2)return;if(y[D]=C,D==="frameSpike"){let ut=0;for(const j of a)j.kind==="frameSpike"&&ut++;if(ut>=6)return}a.length>=t.anomalyCapacity&&a.shift();let ht=i.slice(-7);et&&(ht.length===0||ht[ht.length-1]!==et)&&(ht=[...ht.slice(-6),et]),a.push({kind:D,t:rn(C),tick:U,ms:Math.round(B),detail:W,ctx:ht}),D==="dirJump"?o.dirJumps++:D==="aimDrop"?o.aimDrops++:D==="moveFreeze"?o.freezes++:D==="stickLost"?o.stickLosts++:D==="stickJump"?o.stickJumps++:D==="stickBad"?o.stickBads++:D==="stickDrift"&&o.stickDrifts++}function I(D,C,U,B){s.length>=t.eventCapacity&&s.shift(),s.push({t:rn(U),tick:B,k:D,d:C})}function k(D){switch(D.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":_=D.tick;break}}function F(){const D=o,C=D.wallMs/1e3,U=D.gestures,B=ht=>Object.entries(U).filter(([ut])=>ut.endsWith(`.${ht}`)).reduce((ut,[,j])=>ut+j,0),W=[];if(W.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),W.push(`运行 ${C.toFixed(1)}s / ${D.frames} 帧 · ${D.fps.toFixed(1)}fps · 最大 ${D.dtMax.toFixed(0)}ms · 尖峰 ${D.spikes} · 步 ${D.steps}`),W.push(`摇杆活跃 ${C>0?Math.round(D.stickActiveMs/1e3/C*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),W.push(`攻击 ${D.attacks}(中${D.hits}) · 受击 ${D.hurts} · 派生 ${D.links}(中${D.linkHits}) · 翻滚 ${D.rolls} 闪现 ${D.blinks} · 跳 ${D.jumps} · 复位 ${D.resets}`),W.push(`法杖 引导${D.channels} 飞弹${D.bolts} 电环${D.rings} · 弓蓄力${D.bowCharges} · 当前武器 ${u||"-"}`),W.push(`异常 ${D.dirJumps+D.aimDrops+D.freezes+D.stickLosts+D.stickJumps+D.stickBads+D.stickDrifts}（dir ${D.dirJumps} / aim ${D.aimDrops} / freeze ${D.freezes} / stick ${D.stickLosts} / stickJump ${D.stickJumps} / 坏指针 ${D.stickBads} / 坐标漂移 ${D.stickDrifts}） · 掉帧尖峰 ${D.spikes}`+(D.inTurns>0?` · 输入转向 ${D.inTurns} 次（最大 ${D.inTurnMax.toFixed(0)}°）`:"")),a.length>0)for(const ht of a.slice(-6)){W.push(`· ${ht.kind} @t${ht.t.toFixed(2)} tick${ht.tick} ${ht.ms>0?`${ht.ms}ms `:""}${ht.detail}`);const ut=ht.ctx.map(J=>String(J[Cm])).join(" "),j=ht.ctx.map(J=>J[Vo]===""||J[Vo]==null?".":String(J[Vo])).join(" ");if(W.push(`  yaw ${ut}`),W.push(`  in  ${j}`),ht.kind==="stickJump"||ht.kind==="stickBad"||ht.kind==="stickLost"){const J=ht.ctx.map(tt=>`${tt[Pm]},${tt[Dm]}`).join(" "),xt=ht.ctx.map(tt=>`${tt[Lm]},${tt[km]}`).join(" ");W.push(`  o   ${J}`),W.push(`  p   ${xt}`)}}if(s.length>0){W.push("最近事件：");for(const ht of s.slice(-12))W.push(`  ${ht.t.toFixed(2)} ${ht.k} ${ht.d}`.trimEnd())}const et=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",gt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return W.push(`摇杆坐标源 ${et}${gt}`),W.push(`UA ${e.ua}`),W.join(`
`)}return{sample(D,C,U,B=0){o.frames++,C.stickHeld&&(C.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=U,U>o.dtMax&&(o.dtMax=U),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=D.time;const W=D.time;if(l<0&&(l=W),T=W,b=D.tick,!r)return;const et=D.character,gt=Math.hypot(C.stickX,C.stickY),ht=Math.hypot(et.velocity.x,et.velocity.z);u=D.combat.weapon;const ut=Im(D,C),j=et.facing,xt=Math.hypot(C.intents.moveX,C.intents.moveZ)>.05?Math.atan2(C.intents.moveX,C.intents.moveZ):null;gt>.2&&(o.stickActiveMs+=U);const tt=[rn(W),D.tick,Math.round(U*10)/10,rn(C.stickX),rn(C.stickY),rn(C.stickRawX),rn(C.stickRawY),C.stickHeld?1:0,C.source.slice(0,8),rn(C.intents.moveX),rn(C.intents.moveZ),rn(et.position.x),rn(et.position.z),rn(et.velocity.x),rn(et.velocity.z),En(j),En(et.bodyYaw),ut,rn(et.stride),xt===null?"":En(xt),C.stickId===null?"":C.stickId,Math.round(C.stickOriginX),Math.round(C.stickOriginY),Math.round(C.stickPxX),Math.round(C.stickPxY),C.stickBad,Math.round(C.stickVpTop),Math.round(C.stickOriginSX),Math.round(C.stickOriginSY),Math.round(C.stickScreenX),Math.round(C.stickScreenY),C.stickScreenOk?1:0,Math.round(C.stickScale*100)/100];M(tt);const At=W*1e3<x;if(U>t.spikeMs&&!At&&W-l>.6&&(o.spikes++,P("frameSpike",W,D.tick,U,`dt ${U.toFixed(0)}ms fl=${Vi(ut)}`,tt)),h!==null&&!At){const wt=Math.abs(En(Ps(j-h))),Ft=Math.abs(En(Ps(et.moveYaw-f))),L=(d|ut)&(ro|co|lo|ho)|ut&Gs,w=xt===null?null:Math.abs(En(Ps(j-xt))),Y=xt===null||h===null?null:Math.abs(En(Ps(h-xt))),rt=w!==null&&Y!==null&&w<Y-.5,dt=(d&Gs)!==0&&(ut&Gs)===0&&xt===null,at=w!==null&&(w<=12||rt);wt>t.aimDropDeg&&dt?P("aimDrop",W,D.tick,0,`${wt.toFixed(0)}° @aim→none stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Vi(ut)}`,tt):wt>t.dirJumpDeg&&L===0&&!dt&&(at?(o.inTurns++,wt>o.inTurnMax&&(o.inTurnMax=wt)):P("dirJump",W,D.tick,0,`${wt.toFixed(0)}° res${w===null?" 无输入":`${w.toFixed(0)}°`} yaw ${En(h)}→${En(j)} in ${xt===null?".":En(xt)}° mvΔ${Ft.toFixed(0)}° aim(${C.aimDX.toFixed(0)},${C.aimDY.toFixed(0)}) fl=${Vi(d)}→${Vi(ut)}`,tt))}const Ut=(ut&(ro|co|lo|ho))!==0,vt=D.tick-_<30;gt>.35&&ht<t.freezeSpeed&&!Ut&&!vt?(m<0&&(m=W),W-m>=t.freezeMs/1e3&&W>=v&&(P("moveFreeze",W,D.tick,(W-m)*1e3,`stick(${C.stickX.toFixed(2)},${C.stickY.toFixed(2)}) v${ht.toFixed(2)} ${C.source} fl=${Vi(ut)}`,tt),v=W+1.5,m=-1)):m=-1,C.stickHeld?(gt>p&&(p=gt),p>.35&&gt<.06?(g<0&&(g=W),W-g>=t.stickLostMs/1e3&&(P("stickLost",W,D.tick,(W-g)*1e3,`raw(${C.stickRawX.toFixed(2)},${C.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Vi(ut)}`,tt),g=-1,p=0)):g=-1):(p=0,g=-1);const Yt=C.stickScale>.2&&C.stickScale<5?C.stickScale:1,_t=C.stickScreenOk,Wt=_t?C.stickScreenX/Yt:C.stickPxX,G=_t?C.stickScreenY/Yt:C.stickPxY,le=_t?C.stickOriginSX/Yt:C.stickOriginX,Ot=_t?C.stickOriginSY/Yt:C.stickOriginY,kt=Wt-le,bt=G-Ot;if(C.stickHeld&&C.stickId!==null){const wt=R;if(wt&&wt.held&&wt.id===C.stickId){const Ft=Math.hypot(wt.dx,wt.dy),L=Math.hypot(kt,bt),w=Math.max(Ft,L),Y=Math.hypot(Wt-wt.cx,G-wt.cy),rt=Math.abs(En(Ps(Math.atan2(bt,kt)-Math.atan2(wt.dy,wt.dx)))),dt=w*rt*Math.PI/180,at=Math.hypot(le-wt.ox,Ot-wt.oy);if(w>18&&rt>35&&Y<Math.max(5,dt*.35)&&P("stickJump",W,D.tick,0,`Δ${rt.toFixed(0)}° 手指只动${Y.toFixed(0)}px(弧长应${dt.toFixed(0)}px) o(${Math.round(wt.ox)},${Math.round(wt.oy)})→(${Math.round(le)},${Math.round(Ot)}) 原点位移${at.toFixed(0)}px p(${Math.round(Wt)},${Math.round(G)}) raw(${Math.round(kt)},${Math.round(bt)}) id${C.stickId} ${_t?"src=屏幕":"src=client"}`,tt),_t&&wt.screenOk){const Lt=Math.hypot(C.stickPxX-wt.x,C.stickPxY-wt.y),Z=Math.hypot((C.stickScreenX-wt.sx)/Yt,(C.stickScreenY-wt.sy)/Yt);E+=Lt-Z,Math.abs(E)>20&&(P("stickDrift",W,D.tick,0,`client 相对屏幕漂移 ${E>0?"+":""}${E.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) screen(${Math.round(C.stickScreenX)},${Math.round(C.stickScreenY)})`,tt),E=0)}}R={id:C.stickId,ox:le,oy:Ot,cx:Wt,cy:G,x:C.stickPxX,y:C.stickPxY,sx:C.stickScreenX,sy:C.stickScreenY,dx:kt,dy:bt,held:!0,screenOk:_t}}else R=null,E=0;if(C.stickBad>S){const wt=C.stickBad-S;P("stickBad",W,D.tick,0,`拦截 ${wt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${C.stickBad}）o(${Math.round(C.stickOriginX)},${Math.round(C.stickOriginY)}) p(${Math.round(C.stickPxX)},${Math.round(C.stickPxY)}) id${C.stickId??"-"}`,tt)}S=C.stickBad,h=j,f=et.moveYaw,d=ut},event(D,C){const U=Fm(D);k(D),r&&(D.type==="dash-ready"||D.type==="combo-reset"||D.type==="stepUp"||I(D.type,U,C,D.tick))},gesture(D){const C=`${D.button}.${D.kind}`;o.gestures[C]=(o.gestures[C]??0)+1,r&&(D.kind==="longPress"||D.kind==="doubleTap"||D.kind==="drag"||D.kind==="cancel")&&I(`g:${D.kind}`,`${D.button} ${D.heldMs.toFixed(0)}ms d${D.distance.toFixed(0)}px ${D.angleDeg.toFixed(0)}°`,T,b)},suspend(D){x=T*1e3+D,m=-1,g=-1},setEnabled(D){r=D,D||(h=null,R=null,m=-1,g=-1)},clear(){i.length=0,s.length=0,a.length=0,y={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,E=0,R=null,S=0;for(const D of Object.keys(o.gestures))delete o.gestures[D]},status(){const D=o.simS,C=a.some(U=>D-U.t<8&&(U.kind==="dirJump"||U.kind==="aimDrop"||U.kind==="moveFreeze"||U.kind==="stickLost"||U.kind==="stickJump"||U.kind==="stickBad"||U.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:s.length,anomalies:a.length,alert:C,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Am,samples:i.slice(),events:s.slice(),anomalies:a.slice()}},summary:F}}const zm={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,recoilSpeed:1,recoilDecay:9,release:{windup:.04,active:.12,recovery:.26,lunge:.12},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Nm={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Om={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:22,minStep:.02,life:.2,minSpeed:5.5,color:"#a8d8ff",intensity:.5,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},Bm={core:zm,scene:Nm,view:Om};function Yc(n){return JSON.parse(JSON.stringify(n))}const Zc=Bm,Hm=Yc(Zc.core),fa=Yc(Zc.scene),hn=Yc(Zc.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class On{constructor(t,e,i,s,a="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),On.nextNameID=On.nextNameID||0,this.$name.id=`lil-gui-name-${++On.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Gm extends On{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Xr(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Vm={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Xr,toHexString:Xr},js={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Xm={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=js.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(s)}},Wm={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=js.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const s=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(s)}},$m=[Vm,js,Xm,Wm];function Ym(n){return $m.find(t=>t.match(n))}class Zm extends On{constructor(t,e,i,s){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Ym(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const a=Xr(this.$text.value);a&&this._setValueFromHexString(a)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Wo extends On{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class qm extends On{constructor(t,e,i,s,a,o){super(t,e,i,"number"),this._initInput(),this.min(s),this.max(a);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let _=parseFloat(this.$input.value);isNaN(_)||(this._stepExplicit&&(_=this._snap(_)),this.setValue(this._clamp(_)))},i=_=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+_),this.$input.value=this.getValue())},s=_=>{_.key==="Enter"&&this.$input.blur(),_.code==="ArrowUp"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_))),_.code==="ArrowDown"&&(_.preventDefault(),i(this._step*this._arrowKeyMultiplier(_)*-1))},a=_=>{this._inputFocused&&(_.preventDefault(),i(this._step*this._normalizeMouseWheel(_)))};let o=!1,r,l,c,h,f;const d=5,u=_=>{r=_.clientX,l=c=_.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",v)},m=_=>{if(o){const x=_.clientX-r,y=_.clientY-l;Math.abs(y)>d?(_.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&v()}if(!o){const x=_.clientY-c;f-=x*this._step*this._arrowKeyMultiplier(_),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=_.clientY},v=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",v)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",a,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,_,x,y,R)=>(p-_)/(x-_)*(R-y)+y,e=p=>{const _=this.$slider.getBoundingClientRect();let x=t(p,_.left,_.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",a)},s=p=>{e(p.clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",a)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const _=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(_)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let v;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(v),v=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class jm extends On{constructor(t,e,i,s){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Km extends On{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Jm=`.lil-gui {
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
}`;function Qm(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let eh=!1;class uo{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:s,title:a="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!eh&&r&&(Qm(Jm),eh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=o}add(t,e,i,s,a){if(Object(i)===i)return new jm(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new qm(this,t,e,i,s,a);case"boolean":return new Gm(this,t,e);case"string":return new Km(this,t,e);case"function":return new Wo(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Zm(this,t,e,i)}addFolder(t){const e=new uo({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Wo||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Wo)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=a=>{a.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function t0(n,t,e,i){const s=document.getElementById("debug-panel"),a=s?new uo({title:"实验台 · 调试面板",autoPlace:!1,container:s}):new uo({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=Lt=>{const Z=a.addFolder(Lt);return l.push(Z),Z},h=(Lt,Z)=>{const mt=Lt.addFolder(Z);return r.push(mt),mt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const v=h(u,"摇杆 / 输入");v.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),v.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const _=o.separation,x=h(u,"角色间分离 / 挤压阻力");x.add(_,"iterations",1,8,1).name("迭代次数"),x.add(_,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(_.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(_.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(_.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=o.dummies,R=h(u,"假人 AI");R.add(y,"moveSpeed",.5,8,.1).name("移动速度"),R.add(y,"wanderRadius",.5,8,.1).name("游走半径"),R.add(y,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(y,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(y,"keepDistance",1,10,.1).name("保持距离"),R.add(y,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(y,"attackRange",.5,5,.1).name("攻击距离"),R.add(y,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(y,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const E=c("步态 / 停步"),S=h(E,"程序化步态");S.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),S.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),S.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),S.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),S.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),S.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),S.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),S.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),S.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),S.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),S.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),S.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),S.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),S.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),S.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),S.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(E,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(E,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(E,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(E,"足部 IK"),I=t.ik;P.add(I,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(I,"weight",0,1,.01).name("钉地权重"),P.add(I,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(I,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const k=h(E,"惯性倾斜 / 盆骨"),F=t.lean;k.add(F,"accelGain",0,.1,.002).name("前后加速度增益"),k.add(F,"turnGain",0,.2,.005).name("绕圈侧倾增益"),k.add(F,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),k.add(F,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),k.add(F,"smoothing",1,30,1).name("倾斜平滑速率"),k.add(F,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),k.add(F,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),k.add(F,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),k.add(F,"crouchSmoothing",1,30,1).name("下沉平滑速率");const D=o.orientation,C=h(E,"朝向 / 下盘带转");C.add(D,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),C.add(D,"headTurnRate",.5,40,.5).name("头部转向速率"),C.add(D,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),C.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),C.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),C.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const U=o.gaze,B=h(E,"接敌注视 / 俯仰 (v9s.18)");B.add(U,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),B.add(U,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),B.add(U,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),B.add(U,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),B.add(U,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),B.add(U,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),B.add(U,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),B.add(U,"headPitchRate",.5,20,.5).name("头部俯仰速率"),B.add(U,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),B.add(U,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),B.add(U,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const W=h(E,"原地转身 / 停步偏差 (v9s)"),et=o.turnInPlace;W.add(et,"enabled").name("启用原地转身 (关=纯插值)"),W.add(et,"triggerDeg",20,180,5).name("触发夹角 (°)"),W.add(et,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),W.add(et,"settleDeg",0,60,1).name("转身保留余角 (°)"),W.add(et,"durationSec",.1,1.5,.02).name("转身时长 (s)"),W.add(et,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),W.add(et,"inputDeadZone",0,.5,.01).name("起步输入死区"),W.add(et,"armSec",0,.5,.01).name("触发防抖 (s)"),W.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),W.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),W.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),W.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),W.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),W.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const gt=c("战斗 / 受击"),ht=o.combat,ut=h(gt,"连击 / 武器"),j=ut.add(n.combat,"weapon",Fi).name("当前武器");ut.add(ht,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ut.add(ht,"settle",0,.8,.01).name("段间停顿 (s)"),ut.add(ht,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ut.add(ht,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ut.add(ht,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ut.add(ht,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ut.add(ht,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ut.add(ht,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ut.add(ht,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ut.add(ht,"autoCombo").name("按住自动连击"),ut.add(ht.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ut.add(ht.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ut.add(ht.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),ut.add(ht.bow,"recoilSpeed",0,5,.1).name("射击后坐力 (m/s)"),ut.add(ht.bow,"recoilDecay",1,30,.5).name("后坐力衰减 (1/s)");const J=h(gt,"夸张化 (v9s.22)"),xt=t.animation.stretch;J.add(xt,"enabled").name("四肢伸缩 开"),J.add(xt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),J.add(xt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),J.add(xt,"impactSquash",0,.5,.01).name("命中挤压量"),J.add(xt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),J.add(xt,"torsoGain",0,1,.05).name("躯干跟随比例"),J.add(xt,"volumeExp",0,1.5,.05).name("体积补偿指数");const tt=t.weaponTrail;J.add(tt,"enabled").name("挥击刀光 开"),J.add(tt,"life",.04,.4,.01).name("刀光残留 (s)"),J.add(tt,"intensity",0,1.5,.05).name("刀光亮度"),J.add(tt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),J.add(t.hitstop,"enabled").name("命中定格 开"),J.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const At=t.weaponMount;J.add(At,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),J.add(At,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),J.add(At,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),ut.add(ht.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ut.add(ht.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ut.add(ht.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ut.add(ht.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ut.add(ht.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ut.add(ht.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ut.add(ht.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ut.add(ht.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ut.add(ht.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ut.add(ht.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Ut=o.abilities;ut.add(Ut.arcane,"perWave",1,8,1).name("每波飞弹数"),ut.add(Ut.arcane,"waves",1,12,1).name("每次引导波数"),ut.add(Ut.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ut.add(Ut.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ut.add(Ut.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ut.add(Ut.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ut.add(Ut.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ut.add(Ut.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ut.add(Ut.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ut.add(Ut.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ut.add(Ut.arcane,"speed",3,24,.5).name("飞弹速度"),ut.add(Ut.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ut.add(Ut.ring,"radius",.5,5,.1).name("电环半径"),ut.add(Ut.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ut.add(Ut.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const vt=h(gt,"攻击动作 / 跨步 / 落地");vt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),vt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),vt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const Yt=t.animation.stride;vt.add(Yt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),vt.add(Yt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),vt.add(Yt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),vt.add(Yt,"cycles",1,3,1).name("每段跨步周期数"),vt.add(Yt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),vt.add(Yt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),vt.add(Yt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),vt.add(Yt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),vt.add(Yt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),vt.add(Yt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),vt.add(Yt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),vt.add(Yt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),vt.add(Yt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),vt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),vt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),vt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),vt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),vt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),vt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),vt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),vt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),vt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),vt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),vt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),vt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const _t=h(gt,"武器握持");_t.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),_t.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),_t.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),_t.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const Wt=o.hits,G=h(gt,"命中 / 受击 / 击退");G.add(Wt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),G.add(Wt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),G.add(Wt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),G.add(Wt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),G.add(Wt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),G.add(Wt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),G.add(Wt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),G.add(Wt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const le=o.targeting,Ot=h(gt,"目标辅助");Ot.add(le,"targetAssist").name("启用目标辅助"),Ot.add(le,"range",1,14,.5).name("锁定范围 (m)"),Ot.add(le,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ot.add(le,"frontBias",0,4,.1).name("朝向加权"),Ot.add(le,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ot.add(le,"maxLungeScale",1,3,.1).name("前冲最大放大");const kt=h(gt,"受击分层"),bt=t.hurt;kt.add(bt,"enabled").name("启用分层受击 (关=旧版对照)"),kt.add(bt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),kt.add(bt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),kt.add(bt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),kt.add(bt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),kt.add(bt,"upperShiftScale",0,1,.01).name("上身位移缩放"),kt.add(bt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),kt.add(bt.hitHeight,"light",0,1,.01).name("轻击命中部位"),kt.add(bt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),kt.add(bt.hitHeight,"knock",0,1,.01).name("击退命中部位"),kt.add(bt,"leanLight",0,1.5,.01).name("轻击力度"),kt.add(bt,"leanHeavy",0,1.5,.01).name("重击力度"),kt.add(bt,"leanKnock",0,1.5,.01).name("击退力度"),kt.add(bt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:bt.abdomen},{name:"打肩 (shoulder)",p:bt.shoulder}].map(({name:Lt,p:Z})=>{const mt=h(kt,Lt);return mt.add(Z,"upperPitch",0,2,.01).name("上身前后倾斜"),mt.add(Z,"upperRoll",0,2,.01).name("上身侧倾"),mt.add(Z,"upperYaw",0,1.5,.01).name("肩部扭转"),mt.add(Z,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),mt.add(Z,"shift",0,.8,.01).name("身体反应位移"),mt.add(Z,"drop",0,.4,.01).name("整体下沉"),mt.add(Z,"back",0,.4,.01).name("屁股向后"),mt.add(Z,"knee",0,1.6,.01).name("屈膝"),mt.add(Z,"hip",0,1,.01).name("髋前倾"),mt.add(Z,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),mt});const wt=h(gt,"派生招"),Ft=o.links;wt.add(Ft,"enabled").name("总开关 (false=旧连击)"),wt.add(Ft.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),wt.add(Ft.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),wt.add(Ft.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),wt.add(Ft,"sharedCooldown",0,3,.05).name("共享 CD (s)"),wt.add(Ft,"triggerWhileSprinting").name("长跑中可直接触发"),wt.add(Ft.search,"range",1,14,.1).name("索敌距离 (m)"),wt.add(Ft.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),wt.add(Ft.search,"stopDistance",0,3,.05).name("停住距离 (m)");const L=Ft.moves["sword-shield"];L&&(wt.add(L,"enabled").name("剑盾盾击"),wt.add(L,"distance",0,8,.1).name("冲锋极限 (m)"),wt.add(L,"windup",0,.5,.01).name("前摇 (s)"),wt.add(L,"active",0,.8,.01).name("冲锋 / 命中 (s)"),wt.add(L,"recovery",0,.8,.01).name("收势 (s)"),wt.add(L.hit,"radius",0,4,.05).name("命中半径 (m)"),wt.add(L.hit,"width",0,2,.05).name("扫掠半径 (m)"),wt.add(L.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),wt.add(L.hit,"duration",0,1.5,.01).name("僵直 (s)")),wt.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const w=c("相机"),Y=h(w,"基础");Y.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Y.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Y.add(t.camera,"distance",6,35,.5).name("距离"),Y.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Y.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,dt=h(w,"智能构图");dt.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),dt.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),dt.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),dt.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),dt.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),dt.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),dt.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),dt.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),dt.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),dt.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),dt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const at=h(w,"缩放");return at.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),at.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),at.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),at.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),at.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),at.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),at.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),at.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(Lt=>Lt.close()),l.forEach(Lt=>Lt.close()),a.close(),{gui:a,refreshWeapon:()=>j.updateDisplay()}}function e0(n,t,e){let i=null,s=Number.POSITIVE_INFINITY;for(const a of n){const o=Math.hypot(t-a.x,e-a.z);o<=a.radius&&o<s&&(i=a,s=o)}return i}function n0(n,t){return n.find(e=>e.id===t)??null}function nh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),s=i.findIndex(r=>r.id===t),a=e<0?-1:1,o=s<0?a>0?0:i.length-1:(s+a+i.length)%i.length;return i[o]??null}function i0({stations:n,world:t,view:e,container:i,onResetZoom:s}){const a=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return e0(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const _=o!==null;o=p;for(const[x,y]of l)y.classList.toggle("is-active",x===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):_&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(_=>_.index===g)??null:n0(n,g);return p?(Zp(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function v(){jd(t)}if(a){a.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),a.appendChild(g);for(const y of[...n].sort((R,E)=>R.index-E.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=y.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",y.color),R.setAttribute("aria-label",`传送到工位 ${y.index}：${y.name}`);const E=document.createElement("span");E.className="lab-idx",E.textContent=String(y.index);const S=document.createElement("span");S.className="lab-name",S.textContent=y.name,R.append(E,S),R.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(y.id)}),a.appendChild(R),l.set(y.id,R)}r=document.createElement("div"),r.className="lab-hint",a.appendChild(r);const _=document.createElement("div");_.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),v()}),_.appendChild(x),s){const y=document.createElement("button");y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="镜头归位",y.setAttribute("aria-label","把镜头缩放恢复到默认"),y.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),s()}),_.appendChild(y)}a.appendChild(_)}return window.addEventListener("keydown",g=>{var p,_;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const x=nh(n,((p=d())==null?void 0:p.id)??o,-1);x&&m(x.id)}else if(g.key==="]"){const x=nh(n,((_=d())==null?void 0:_.id)??o,1);x&&m(x.id)}else g.key==="\\"&&v()}),u(),{goto:m,current:d,tick:u,recall:v,element:a}}const $o=Math.PI*2,Fn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},s0=45,a0=50;function o0(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Ds(n,t,e){const i=o0(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function r0(n,t){return Math.atan2(n,-t)*180/Math.PI}function ih(n,t){return Math.abs(((n-t)%360+540)%360-180)}function pa(n){return(n%360+360)%360}const c0={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function l0(n,t,e,i=8){const s=n.character,a=t.intents,o=Math.hypot(a.moveX,a.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=s.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Ds(a.moveX,a.moveZ,e):null,f=c>.15?Ds(l.x,l.z,e):null,d=Ds(Math.sin(s.facing),Math.cos(s.facing),e),u=a.aimActive&&Math.hypot(a.aimX,a.aimZ)>1e-6?Ds(a.aimX,a.aimZ,e):null,m=n.targeting,v=m.hasTarget?Ds(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?ih(h,f):null,p=h!==null?ih(h,d):null,_=g!==null&&g>s0&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?r0(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:v,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:_}}function sh(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>a0&&(n.inLen>=.35||n.speed>=.4)}const ah="harness.dirDebug";function h0(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const s=e.querySelector("#dirdbg-canvas"),a=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=s.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(ah)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),a&&(a.textContent=l?"方向 ⌄":"方向 ▸",a.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(ah,x?"1":"0")}catch{}c()}a==null||a.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;s.width=Math.round(d*f),s.height=Math.round(d*f);let u=c0,m=0,v="",g=8;function p(x){if(!r)return;const y=d,R=d,E=y/2,S=R/2,T=Math.min(y,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,y,R),r.beginPath(),r.arc(E,S,T,0,$o),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":Fn.ring,r.stroke(),r.strokeStyle=Fn.grid,r.beginPath(),r.moveTo(E-T,S),r.lineTo(E+T,S),r.moveTo(E,S-T),r.lineTo(E,S+T),r.stroke();for(let I=0;I<8;I++){const k=I*Math.PI/4,F=E+Math.sin(k)*(T-3),D=S-Math.cos(k)*(T-3),C=E+Math.sin(k)*T,U=S-Math.cos(k)*T;r.beginPath(),r.moveTo(F,D),r.lineTo(C,U),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Fn.dead,r.beginPath(),r.arc(E,S,T*b,0,$o),r.stroke(),r.restore());const M=(I,k,F,D,C=!1,U=1)=>{const B=I*Math.PI/180,W=Math.sin(B),et=-Math.cos(B),gt=T*Math.max(.14,Math.min(1,k)),ht=E+W*T*.14,ut=S+et*T*.14,j=E+W*gt,J=S+et*gt;if(r.save(),r.globalAlpha=U,r.strokeStyle=F,r.fillStyle=F,r.lineWidth=D,r.lineCap="round",C&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ht,ut),r.lineTo(j,J),r.stroke(),!C&&gt>T*.3){const xt=-et,tt=W,At=5.2;r.beginPath(),r.moveTo(j+W*1.5,J+et*1.5),r.lineTo(j-W*At+xt*At*.72,J-et*At+tt*At*.72),r.lineTo(j-W*At-xt*At*.72,J-et*At-tt*At*.72),r.closePath(),r.fill()}r.restore()},P=(I,k)=>{const F=I*Math.PI/180,D=Math.sin(F),C=-Math.cos(F),U=-C,B=D,W=T+1.5,et=W+6.5;r.save(),r.fillStyle=k,r.strokeStyle=k,r.lineWidth=1,r.beginPath(),r.moveTo(E+D*et,S+C*et),r.lineTo(E+D*W+U*4,S+C*W+B*4),r.lineTo(E+D*W-U*4,S+C*W-B*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,Fn.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,Fn.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,Fn.aim,1.6,!0,.95),M(x.faceDeg,1,Fn.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),Fn.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,Fn.input,2.2),P(x.faceDeg,Fn.face),r.beginPath(),r.arc(E,S,2.2,0,$o),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function _(x,y){const R=T=>T===null?"-":String(Math.round(pa(T)));o.in.textContent=`入 ${R(x.inDeg)}`,o.mv.textContent=`移 ${R(x.moveDeg)}`,o.fc.textContent=`面 ${R(x.faceDeg)}`;const E=T=>T===null?"-":`${Math.round(T)}°`,S=[`Δ入→移 ${E(x.gapMove)}`,`Δ入→面 ${E(x.gapFace)}`];x.speed>.05&&S.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&S.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&S.push("拖拽瞄准"),o.gap.textContent=S.join("  "),e.classList.toggle("is-warn",x.warnMove||sh(x,y))}return{update(x,y,R){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const E=l0(x,y,R,g);u=E;const S=x.combat.phase!=="idle";p(E);const T=performance.now(),b=`${E.inDeg}|${E.moveDeg}|${E.faceDeg}|${E.lockId}|${E.aimDeg}|${E.warnMove}|${E.speed.toFixed(1)}`;(T-m>90||b!==v)&&(m=T,v=b,_(E,S),e.dataset.in=E.inDeg===null?"":pa(E.inDeg).toFixed(1),e.dataset.mv=E.moveDeg===null?"":pa(E.moveDeg).toFixed(1),e.dataset.fc=pa(E.faceDeg).toFixed(1),e.dataset.warn=E.warnMove||sh(E,S)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const d0=6,u0=480,oh=240,rh=92,f0=18;function p0(n,t,e,i){const s=t-n;return{t:i,speed:t,drive:t,raw:t,dv:s,accel:e>1e-4?s/e:0,busy:!1}}function m0(n,t,e,i){const a=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:a,speed:Math.min(a,Math.max(1,i))}}function g0(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function x0(n={}){const t=Math.max(1,n.windowS??d0),e=Math.max(60,n.capacity??u0),i=Math.max(1,n.speedCap??f0),s=!!(n.container&&n.toggle),a=n.container??document.createElement("div");a.id="motiondbg",n.container||(a.setAttribute("data-ui-region",""),document.body.appendChild(a));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");a.innerHTML=s?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??a.querySelector("#motiondbg-toggle"),l=a.querySelector("#motiondbg-graph"),c=a.querySelector("#motiondbg-read"),h=a.querySelector("#motiondbg-window"),f=a.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(oh*u),l.height=Math.round(rh*u);const m=h0({deadZone:n.deadZone,container:f,embedded:!0});let v=!1;function g(T){v=T,a.classList.toggle("is-off",!T),!s&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),s||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!v)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!v)}));const p=[];let _=0,x=null,y=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function E(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function S(T,b){if(!d)return;const M=oh,P=rh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,P);const I=4,k=4,F=M-I-k,D=9,C=46,U=62,B=22,W=b-t,et=tt=>I+Math.max(0,Math.min(1,(tt-W)/t))*F;for(let tt=0;tt<T.length;tt++){if(!T[tt].busy)continue;const At=et(T[tt].t),Ut=tt+1<T.length?et(T[tt+1].t):At+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(At,D,Math.max(2,Ut-At),C)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const tt of[D,D+C/2,D+C])d.moveTo(I,tt),d.lineTo(M-k,tt);d.moveTo(I,U+B/2),d.lineTo(M-k,U+B/2),d.stroke();const ht=Math.max(1,...T.map(tt=>tt.speed),...T.map(tt=>tt.drive))*1.15,ut=tt=>D+C-tt/ht*C;if(T.length>1){d.beginPath(),d.moveTo(et(T[0].t),ut(T[0].speed));for(let tt=1;tt<T.length;tt++)d.lineTo(et(T[tt].t),ut(T[tt].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(et(T[T.length-1].t),D+C),d.lineTo(et(T[0].t),D+C),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(et(T[0].t),ut(T[0].drive));for(let tt=1;tt<T.length;tt++)d.lineTo(et(T[tt].t),ut(T[tt].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let j=.02;for(const tt of T)j=Math.max(j,Math.abs(tt.dv));j*=1.1;const J=U+B/2,xt=B/2;for(const tt of T){const At=Math.min(xt,Math.abs(tt.dv)/j*xt);d.fillStyle=tt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(et(tt.t)-.7,tt.dv>=0?J-At:J,1.4,Math.max(.5,At))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ht.toFixed(1),I+2,D+8),d.fillText("v",I+2,D+C-2),d.fillText("Δv",I+2,U+9),d.textAlign="right",d.fillText("0",M-k-2,D+C-2),d.textAlign="left"}return{dirDebug:m,update(T,b,M){const P=performance.now()/1e3,I=y<0?1/60:Math.max(1e-4,Math.min(.25,P-y));y=P;const k=T.character,F={x:k.position.x,z:k.position.z},D=Math.hypot(k.velocity.x,k.velocity.z),{speed:C,raw:U}=x?m0(x,F,I,i):{speed:0,raw:0},B=p0(_,C,I,P);B.drive=D,B.raw=U,B.busy=g0(T),x=F,_=C,p.push(B),p.length>e&&p.shift();const W=E(P);let et=0;for(const gt of W)et=Math.max(et,gt.speed);if(R={speed:C,drive:D,raw:U,dv:B.dv,accel:B.accel,peak:et,samples:W.length,windowS:t,busy:B.busy},m.update(T,b,M),v){S(W,P);const gt=B.dv>=0?"+":"";c.textContent=`v ${C.toFixed(2)} · 驱 ${D.toFixed(2)} · 峰 ${et.toFixed(2)} · Δv ${gt}${B.dv.toFixed(3)} · ${W.length} 帧`}},setEnabled:g,toggle(){return g(!v),v},enabled:()=>v,last:()=>({...R}),samples:()=>E(performance.now()/1e3).map(T=>({...T}))}}const v0=["剑盾","双剑","大剑","法杖","弓"],_0={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function y0(n){return{update(t,e,i,s,a,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=_t=>_t.toFixed(2),m=_t=>(_t*180/Math.PI).toFixed(0),v=v0[Fi.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),_=t.dash,x=_.phase==="active"&&_.duration>0?(1-_.timer/_.duration)*100:0,y=_.phase==="active"?`${_.kind}@${x.toFixed(0)}%`:`${_.kind} cd${u(_.cooldown)}`,R=s.intents.aimActive?`(${u(s.intents.aimX)},${u(s.intents.aimZ)})`:"-",E=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),S=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(E)+Math.abs(S)+1e-6,b=Math.round(Math.abs(S)/T*100),M=`strafe ${b}%${E<-.05?" back":""}`,P=t.camera,I=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,k=o?u(o.attackBlend):"-",F=o==null?void 0:o.attackWeights,D=F?`gw ${u(F.gaitScale)}  lw ${u(F.attackLegWeight)}  spd ${u(F.driveSpeed)}`:"-",C=F?`${u(F.gaitScale)}/${u(F.attackLegWeight)}`:"-",U=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",W=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",et=o==null?void 0:o.hurt,gt=et?`hurt ${t.playerHurt.type}  部位h${u(et.hitHeight)}  脉冲p${u(et.pulse)}  上身${u(et.upperShift)}  重心${u(et.comShift)}  后坐${u(et.pelvisBack)}  屈膝${u(et.knee)}`:"-",ht=et?`${u(et.hitHeight)}/${u(et.pulse)}/${u(et.knee)}`:"-",ut=o==null?void 0:o.ik,j=ut?`${ut.active?"on":"off"} w${u(ut.weight)} e${u(ut.maxError)}`:"-",J=t.playerLink,xt=`link ${J.kind||"-"}  ${J.phase}  prog ${u(J.progress)}  win ${u(J.linkWindow)}s  cd ${u(J.cooldown)}s  hits ${J.hitIds.length}  travel ${u(J.travelled)}/${u(J.travel)}m  id ${J.id}`,tt=`${J.phase}/${J.kind||"-"}/w${u(J.linkWindow)}`,At=s.lastGesture,Ut=At?`${At.button} ${At.kind} ${At.heldMs.toFixed(0)}ms d${At.distance.toFixed(0)}px ${At.angleDeg.toFixed(0)}° taps${At.taps}`:"-",vt=t.dummies.map(_t=>`${_t.id}:${_0[_t.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${v} ${f.phase} · lk ${J.phase}${J.kind?`/${J.kind}`:""} w${u(J.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${u(s.stickX)},${u(s.stickY)}) ${s.source}  str${u(l.stride)}`,`weapon ${v}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${y}  ab ${k}  gw/lw ${C}  land ${B}  ik ${j}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ht}`,`dummies ${vt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${W}  lk ${tt}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(a.timeScale)}${a.paused?" [P]":""}  g ${Ut}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${k}   ${D}   land ${U}`,gt,`ik ${j}  clamped ${ut?ut.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(s.intents.moveX)}, ${u(s.intents.moveZ)})  stick (${u(s.stickX)}, ${u(s.stickY)})  ${s.source}  aim ${R}`,`weapon ${v}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${_.kind}  phase ${_.phase}  prog ${x.toFixed(0)}%  cd ${u(_.cooldown)}s  id ${_.id}  from (${u(_.fromX)},${u(_.fromZ)}) → to (${u(_.toX)},${u(_.toZ)})`,xt,`camera ${I}  ${W}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${vt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(a.timeScale)}${a.paused?" [PAUSED]":""}   gesture ${Ut}`].join(`
`)}}}const ma=["lab","hud","motion","debug"],ch={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},lh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function M0(n){var l;const t=Object.fromEntries(ma.map(c=>[c,document.getElementById(lh[c].toggle)])),e=Object.fromEntries(ma.map(c=>[c,document.getElementById(lh[c].panel)]));let i={},s=null;function a(){var c,h,f;for(const d of ma){const u=s===d,m=t[d],v=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${ch[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${ch[d].full}`)),v&&v.classList.toggle("is-open",u)}n.classList.toggle("is-compact",s!=="hud"),(c=i.motion)==null||c.setEnabled(s==="motion"),s==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){s=s===c?null:c,a()}function r(){s!==null&&(s=null,a())}for(const c of ma)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),a(),{hudCompact:()=>s!=="hud",register(c){i=c,a()},toggle:o,closeAll:r,isOpen:c=>s===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qc="170",S0=0,hh=1,b0=2,eu=1,nu=2,Zn=3,pi=0,cn=1,Ce=2,ui=0,fs=1,ri=2,dh=3,uh=4,E0=5,Pi=100,w0=101,T0=102,A0=103,R0=104,C0=200,P0=201,D0=202,L0=203,Wr=204,$r=205,k0=206,I0=207,F0=208,U0=209,z0=210,N0=211,O0=212,B0=213,H0=214,Yr=0,Zr=1,qr=2,vs=3,jr=4,Kr=5,Jr=6,Qr=7,jc=0,G0=1,V0=2,fi=0,X0=1,W0=2,$0=3,Y0=4,Z0=5,q0=6,j0=7,iu=300,_s=301,ys=302,tc=303,ec=304,bo=306,nc=1e3,Li=1001,ic=1002,Pn=1003,K0=1004,ga=1005,Nn=1006,Yo=1007,ki=1008,Qn=1009,su=1010,au=1011,Ks=1012,Kc=1013,Ui=1014,jn=1015,aa=1016,Jc=1017,Qc=1018,Ms=1020,ou=35902,ru=1021,cu=1022,Cn=1023,lu=1024,hu=1025,ps=1026,Ss=1027,du=1028,tl=1029,uu=1030,el=1031,nl=1033,qa=33776,ja=33777,Ka=33778,Ja=33779,sc=35840,ac=35841,oc=35842,rc=35843,cc=36196,lc=37492,hc=37496,dc=37808,uc=37809,fc=37810,pc=37811,mc=37812,gc=37813,xc=37814,vc=37815,_c=37816,yc=37817,Mc=37818,Sc=37819,bc=37820,Ec=37821,Qa=36492,wc=36494,Tc=36495,fu=36283,Ac=36284,Rc=36285,Cc=36286,J0=3200,Q0=3201,pu=0,tg=1,ci="",nn="srgb",Es="srgb-linear",Eo="linear",Se="srgb",Xi=7680,fh=519,eg=512,ng=513,ig=514,mu=515,sg=516,ag=517,og=518,rg=519,Pc=35044,ph=35048,mh="300 es",Kn=2e3,fo=2001;class ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let gh=1234567;const ms=Math.PI/180,Js=180/Math.PI;function Bn(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[i&255]+Je[i>>8&255]+Je[i>>16&255]+Je[i>>24&255]).toLowerCase()}function qe(n,t,e){return Math.max(t,Math.min(e,n))}function il(n,t){return(n%t+t)%t}function cg(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function lg(n,t,e){return n!==t?(e-n)/(t-n):0}function Vs(n,t,e){return(1-e)*n+e*t}function hg(n,t,e,i){return Vs(n,t,1-Math.exp(-e*i))}function dg(n,t=1){return t-Math.abs(il(n,t*2)-t)}function ug(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function fg(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function pg(n,t){return n+Math.floor(Math.random()*(t-n+1))}function mg(n,t){return n+Math.random()*(t-n)}function gg(n){return n*(.5-Math.random())}function xg(n){n!==void 0&&(gh=n);let t=gh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function vg(n){return n*ms}function _g(n){return n*Js}function yg(n){return(n&n-1)===0&&n!==0}function Mg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Sg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function bg(n,t,e,i,s){const a=Math.cos,o=Math.sin,r=a(e/2),l=o(e/2),c=a((t+i)/2),h=o((t+i)/2),f=a((t-i)/2),d=o((t-i)/2),u=a((i-t)/2),m=o((i-t)/2);switch(s){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function _e(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const xh={DEG2RAD:ms,RAD2DEG:Js,generateUUID:Bn,clamp:qe,euclideanModulo:il,mapLinear:cg,inverseLerp:lg,lerp:Vs,damp:hg,pingpong:dg,smoothstep:ug,smootherstep:fg,randInt:pg,randFloat:mg,randFloatSpread:gg,seededRandom:xg,degToRad:vg,radToDeg:_g,isPowerOfTwo:yg,ceilPowerOfTwo:Mg,floorPowerOfTwo:Sg,setQuaternionFromProperEuler:bg,normalize:_e,denormalize:Rn};class Gt{constructor(t=0,e=0){Gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*i-o*s+t.x,this.y=a*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class re{constructor(t,e,i,s,a,o,r,l,c){re.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c)}set(t,e,i,s,a,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],v=s[0],g=s[3],p=s[6],_=s[1],x=s[4],y=s[7],R=s[2],E=s[5],S=s[8];return a[0]=o*v+r*_+l*R,a[3]=o*g+r*x+l*E,a[6]=o*p+r*y+l*S,a[1]=c*v+h*_+f*R,a[4]=c*g+h*x+f*E,a[7]=c*p+h*y+f*S,a[2]=d*v+u*_+m*R,a[5]=d*g+u*x+m*E,a[8]=d*p+u*y+m*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*a*h+i*r*l+s*a*c-s*o*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*a,u=c*a-o*l,m=e*f+i*d+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return t[0]=f*v,t[1]=(s*c-h*i)*v,t[2]=(r*i-s*o)*v,t[3]=d*v,t[4]=(h*e-s*l)*v,t[5]=(s*a-r*e)*v,t[6]=u*v,t[7]=(i*l-c*e)*v,t[8]=(o*e-i*a)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,a,o,r){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-s*c,s*l,-s*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Zo.makeScale(t,e)),this}rotate(t){return this.premultiply(Zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zo=new re;function gu(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function po(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Eg(){const n=po("canvas");return n.style.display="block",n}const vh={};function Bs(n){n in vh||(vh[n]=!0,console.warn(n))}function wg(n,t,e){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:i()}}setTimeout(a,e)})}function Tg(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Ag(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const me={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Se&&(n.r=Jn(n.r),n.g=Jn(n.g),n.b=Jn(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Se&&(n.r=gs(n.r),n.g=gs(n.g),n.b=gs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ci?Eo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Jn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function gs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const _h=[.64,.33,.3,.6,.15,.06],yh=[.2126,.7152,.0722],Mh=[.3127,.329],Sh=new re().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bh=new re().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);me.define({[Es]:{primaries:_h,whitePoint:Mh,transfer:Eo,toXYZ:Sh,fromXYZ:bh,luminanceCoefficients:yh,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:_h,whitePoint:Mh,transfer:Se,toXYZ:Sh,fromXYZ:bh,luminanceCoefficients:yh,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}});let Wi;class Rg{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Wi===void 0&&(Wi=po("canvas")),Wi.width=t.width,Wi.height=t.height;const i=Wi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Wi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=po("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=Jn(a[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Jn(e[i]/255)*255):e[i]=Jn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Cg=0;class xu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cg++}),this.uuid=Bn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(qo(s[o].image)):a.push(qo(s[o]))}else a=qo(s);i.url=a}return e||(t.images[this.uuid]=i),i}}function qo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Rg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Pg=0;class an extends ws{constructor(t=an.DEFAULT_IMAGE,e=an.DEFAULT_MAPPING,i=Li,s=Li,a=Nn,o=ki,r=Cn,l=Qn,c=an.DEFAULT_ANISOTROPY,h=ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pg++}),this.uuid=Bn(),this.name="",this.source=new xu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new re,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==iu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case nc:t.x=t.x-Math.floor(t.x);break;case Li:t.x=t.x<0?0:1;break;case ic:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case nc:t.y=t.y-Math.floor(t.y);break;case Li:t.y=t.y<0?0:1;break;case ic:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=iu;an.DEFAULT_ANISOTROPY=1;class Fe{constructor(t=0,e=0,i=0,s=1){Fe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,a;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(u+1)/2,R=(p+1)/2,E=(h+d)/4,S=(f+v)/4,T=(m+g)/4;return x>y&&x>R?x<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(x),s=E/i,a=S/i):y>R?y<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),i=E/s,a=T/s):R<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),i=S/a,s=T/a),this.set(i,s,a,e),this}let _=Math.sqrt((g-m)*(g-m)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(f-v)/_,this.z=(d-h)/_,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Dg extends ws{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Fe(0,0,t,e),this.scissorTest=!1,this.viewport=new Fe(0,0,t,e);const s={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new an(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=a.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new xu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends Dg{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class vu extends an{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lg extends an{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class oa{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,a,o,r){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3];const d=a[o+0],u=a[o+1],m=a[o+2],v=a[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=v;return}if(f!==v||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const R=Math.sqrt(x),E=Math.atan2(R,p*_);g=Math.sin(g*E)/R,r=Math.sin(r*E)/R}const y=r*_;if(l=l*g+d*y,c=c*g+u*y,h=h*g+m*y,f=f*g+v*y,g===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,a,o){const r=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=a[o],d=a[o+1],u=a[o+2],m=a[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(s/2),f=r(a/2),d=l(i/2),u=l(s/2),m=l(a/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],a=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(a-c)*u,this._z=(o-s)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(a+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(a-c)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-s)/u,this._x=(a+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qe(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,a=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+s*c-a*l,this._y=s*h+o*l+a*r-i*c,this._z=a*h+o*c+i*l-s*r,this._w=o*h-i*r-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+i*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=s,this._z=a,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*s+e*this._y,this._z=u*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=a*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(t=0,e=0,i=0){H.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Eh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Eh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6]*s,this.y=a[1]*e+a[4]*i+a[7]*s,this.z=a[2]*e+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*i+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*i+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*i+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,a=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*s-r*i),h=2*(r*e-a*s),f=2*(a*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-a*f,this.z=s+l*f+a*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s,this.y=a[1]*e+a[5]*i+a[9]*s,this.z=a[2]*e+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,a=t.z,o=e.x,r=e.y,l=e.z;return this.x=s*l-a*r,this.y=a*o-i*l,this.z=i*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return jo.copy(this).projectOnVector(t),this.sub(jo)}reflect(t){return this.sub(jo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(qe(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const jo=new H,Eh=new oa;class ra{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const a=i.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,wn):wn.fromBufferAttribute(a,o),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),xa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),xa.copy(i.boundingBox)),xa.applyMatrix4(t.matrixWorld),this.union(xa)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ls),va.subVectors(this.max,Ls),$i.subVectors(t.a,Ls),Yi.subVectors(t.b,Ls),Zi.subVectors(t.c,Ls),ti.subVectors(Yi,$i),ei.subVectors(Zi,Yi),vi.subVectors($i,Zi);let e=[0,-ti.z,ti.y,0,-ei.z,ei.y,0,-vi.z,vi.y,ti.z,0,-ti.x,ei.z,0,-ei.x,vi.z,0,-vi.x,-ti.y,ti.x,0,-ei.y,ei.x,0,-vi.y,vi.x,0];return!Ko(e,$i,Yi,Zi,va)||(e=[1,0,0,0,1,0,0,0,1],!Ko(e,$i,Yi,Zi,va))?!1:(_a.crossVectors(ti,ei),e=[_a.x,_a.y,_a.z],Ko(e,$i,Yi,Zi,va))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vn=[new H,new H,new H,new H,new H,new H,new H,new H],wn=new H,xa=new ra,$i=new H,Yi=new H,Zi=new H,ti=new H,ei=new H,vi=new H,Ls=new H,va=new H,_a=new H,_i=new H;function Ko(n,t,e,i,s){for(let a=0,o=n.length-3;a<=o;a+=3){_i.fromArray(n,a);const r=s.x*Math.abs(_i.x)+s.y*Math.abs(_i.y)+s.z*Math.abs(_i.z),l=t.dot(_i),c=e.dot(_i),h=i.dot(_i);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const kg=new ra,ks=new H,Jo=new H;class wo{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):kg.setFromPoints(t).getCenter(i);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ks.subVectors(t,this.center);const e=ks.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ks,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Jo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ks.copy(t.center).add(Jo)),this.expandByPoint(ks.copy(t.center).sub(Jo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Xn=new H,Qo=new H,ya=new H,ni=new H,tr=new H,Ma=new H,er=new H;class sl{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Xn.copy(this.origin).addScaledVector(this.direction,e),Xn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Qo.copy(t).add(e).multiplyScalar(.5),ya.copy(e).sub(t).normalize(),ni.copy(this.origin).sub(Qo);const a=t.distanceTo(e)*.5,o=-this.direction.dot(ya),r=ni.dot(this.direction),l=-ni.dot(ya),c=ni.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=a*h,f>=0)if(d>=-m)if(d<=m){const v=1/h;f*=v,d*=v,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*a+r)),d=f>0?-a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-a,-l),a),u=d*(d+2*l)+c):(f=Math.max(0,-(o*a+r)),d=f>0?a:Math.min(Math.max(-a,-l),a),u=-f*f+d*(d+2*l)+c);else d=o>0?-a:a,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Qo).addScaledVector(ya,d),u}intersectSphere(t,e){Xn.subVectors(t.center,this.origin);const i=Xn.dot(this.direction),s=Xn.dot(Xn)-i*i,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,a,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||a>s||((a>i||isNaN(i))&&(i=a),(o<s||isNaN(s))&&(s=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>s)||((r>i||i!==i)&&(i=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Xn)!==null}intersectTriangle(t,e,i,s,a){tr.subVectors(e,t),Ma.subVectors(i,t),er.crossVectors(tr,Ma);let o=this.direction.dot(er),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ni.subVectors(this.origin,t);const l=r*this.direction.dot(Ma.crossVectors(ni,Ma));if(l<0)return null;const c=r*this.direction.dot(tr.cross(ni));if(c<0||l+c>o)return null;const h=-r*ni.dot(er);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Te{constructor(t,e,i,s,a,o,r,l,c,h,f,d,u,m,v,g){Te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,a,o,r,l,c,h,f,d,u,m,v,g)}set(t,e,i,s,a,o,r,l,c,h,f,d,u,m,v,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/qi.setFromMatrixColumn(t,0).length(),a=1/qi.setFromMatrixColumn(t,1).length(),o=1/qi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*a,e[5]=i[5]*a,e[6]=i[6]*a,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,a=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,v=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-v*c,e[9]=-r*l,e[2]=v-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,v=c*f;e[0]=d+v*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=v+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,v=c*f;e[0]=d-v*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=v-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,v=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+v,e[1]=l*f,e[5]=v*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,v=r*c;e[0]=l*h,e[4]=v-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-v*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,v=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+v,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=v*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ig,t,Fg)}lookAt(t,e,i){const s=this.elements;return dn.subVectors(t,e),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),ii.crossVectors(i,dn),ii.lengthSq()===0&&(Math.abs(i.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),ii.crossVectors(i,dn)),ii.normalize(),Sa.crossVectors(dn,ii),s[0]=ii.x,s[4]=Sa.x,s[8]=dn.x,s[1]=ii.y,s[5]=Sa.y,s[9]=dn.y,s[2]=ii.z,s[6]=Sa.z,s[10]=dn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,a=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],v=i[6],g=i[10],p=i[14],_=i[3],x=i[7],y=i[11],R=i[15],E=s[0],S=s[4],T=s[8],b=s[12],M=s[1],P=s[5],I=s[9],k=s[13],F=s[2],D=s[6],C=s[10],U=s[14],B=s[3],W=s[7],et=s[11],gt=s[15];return a[0]=o*E+r*M+l*F+c*B,a[4]=o*S+r*P+l*D+c*W,a[8]=o*T+r*I+l*C+c*et,a[12]=o*b+r*k+l*U+c*gt,a[1]=h*E+f*M+d*F+u*B,a[5]=h*S+f*P+d*D+u*W,a[9]=h*T+f*I+d*C+u*et,a[13]=h*b+f*k+d*U+u*gt,a[2]=m*E+v*M+g*F+p*B,a[6]=m*S+v*P+g*D+p*W,a[10]=m*T+v*I+g*C+p*et,a[14]=m*b+v*k+g*U+p*gt,a[3]=_*E+x*M+y*F+R*B,a[7]=_*S+x*P+y*D+R*W,a[11]=_*T+x*I+y*C+R*et,a[15]=_*b+x*k+y*U+R*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],a=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+a*l*f-s*c*f-a*r*d+i*c*d+s*r*u-i*l*u)+v*(+e*l*u-e*c*d+a*o*d-s*o*u+s*c*h-a*l*h)+g*(+e*c*f-e*r*u-a*o*f+i*o*u+a*r*h-i*c*h)+p*(-s*r*h-e*l*f+e*r*d+s*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],v=t[13],g=t[14],p=t[15],_=f*g*c-v*d*c+v*l*u-r*g*u-f*l*p+r*d*p,x=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,y=h*v*c-m*f*c+m*r*u-o*v*u-h*r*p+o*f*p,R=m*f*l-h*v*l-m*r*d+o*v*d+h*r*g-o*f*g,E=e*_+i*x+s*y+a*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/E;return t[0]=_*S,t[1]=(v*d*a-f*g*a-v*s*u+i*g*u+f*s*p-i*d*p)*S,t[2]=(r*g*a-v*l*a+v*s*c-i*g*c-r*s*p+i*l*p)*S,t[3]=(f*l*a-r*d*a-f*s*c+i*d*c+r*s*u-i*l*u)*S,t[4]=x*S,t[5]=(h*g*a-m*d*a+m*s*u-e*g*u-h*s*p+e*d*p)*S,t[6]=(m*l*a-o*g*a-m*s*c+e*g*c+o*s*p-e*l*p)*S,t[7]=(o*d*a-h*l*a+h*s*c-e*d*c-o*s*u+e*l*u)*S,t[8]=y*S,t[9]=(m*f*a-h*v*a-m*i*u+e*v*u+h*i*p-e*f*p)*S,t[10]=(o*v*a-m*r*a+m*i*c-e*v*c-o*i*p+e*r*p)*S,t[11]=(h*r*a-o*f*a-h*i*c+e*f*c+o*i*u-e*r*u)*S,t[12]=R*S,t[13]=(h*v*s-m*f*s+m*i*d-e*v*d-h*i*g+e*f*g)*S,t[14]=(m*r*s-o*v*s-m*i*l+e*v*l+o*i*g-e*r*g)*S,t[15]=(o*f*s-h*r*s+h*i*l-e*f*l-o*i*d+e*r*d)*S,this}scale(t){const e=this.elements,i=t.x,s=t.y,a=t.z;return e[0]*=i,e[4]*=s,e[8]*=a,e[1]*=i,e[5]*=s,e[9]*=a,e[2]*=i,e[6]*=s,e[10]*=a,e[3]*=i,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),a=1-i,o=t.x,r=t.y,l=t.z,c=a*o,h=a*r;return this.set(c*o+i,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+i,h*l-s*o,0,c*l-s*r,h*l+s*o,a*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,a,o){return this.set(1,i,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,a=e._x,o=e._y,r=e._z,l=e._w,c=a+a,h=o+o,f=r+r,d=a*c,u=a*h,m=a*f,v=o*h,g=o*f,p=r*f,_=l*c,x=l*h,y=l*f,R=i.x,E=i.y,S=i.z;return s[0]=(1-(v+p))*R,s[1]=(u+y)*R,s[2]=(m-x)*R,s[3]=0,s[4]=(u-y)*E,s[5]=(1-(d+p))*E,s[6]=(g+_)*E,s[7]=0,s[8]=(m+x)*S,s[9]=(g-_)*S,s[10]=(1-(d+v))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let a=qi.set(s[0],s[1],s[2]).length();const o=qi.set(s[4],s[5],s[6]).length(),r=qi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Tn.copy(this);const c=1/a,h=1/o,f=1/r;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=f,Tn.elements[9]*=f,Tn.elements[10]*=f,e.setFromRotationMatrix(Tn),i.x=a,i.y=o,i.z=r,this}makePerspective(t,e,i,s,a,o,r=Kn){const l=this.elements,c=2*a/(e-t),h=2*a/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let u,m;if(r===Kn)u=-(o+a)/(o-a),m=-2*o*a/(o-a);else if(r===fo)u=-o/(o-a),m=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,a,o,r=Kn){const l=this.elements,c=1/(e-t),h=1/(i-s),f=1/(o-a),d=(e+t)*c,u=(i+s)*h;let m,v;if(r===Kn)m=(o+a)*f,v=-2*f;else if(r===fo)m=a*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const qi=new H,Tn=new Te,Ig=new H(0,0,0),Fg=new H(1,1,1),ii=new H,Sa=new H,dn=new H,wh=new Te,Th=new oa;class Hn{constructor(t=0,e=0,i=0,s=Hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(qe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-qe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return wh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wh,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Th.setFromEuler(this),this.setFromQuaternion(Th,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Hn.DEFAULT_ORDER="XYZ";class al{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ug=0;const Ah=new H,ji=new oa,Wn=new Te,ba=new H,Is=new H,zg=new H,Ng=new oa,Rh=new H(1,0,0),Ch=new H(0,1,0),Ph=new H(0,0,1),Dh={type:"added"},Og={type:"removed"},Ki={type:"childadded",child:null},nr={type:"childremoved",child:null};class De extends ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new H,e=new Hn,i=new oa,s=new H(1,1,1);function a(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(a),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Te},normalMatrix:{value:new re}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.multiply(ji),this}rotateOnWorldAxis(t,e){return ji.setFromAxisAngle(t,e),this.quaternion.premultiply(ji),this}rotateX(t){return this.rotateOnAxis(Rh,t)}rotateY(t){return this.rotateOnAxis(Ch,t)}rotateZ(t){return this.rotateOnAxis(Ph,t)}translateOnAxis(t,e){return Ah.copy(t).applyQuaternion(this.quaternion),this.position.add(Ah.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Rh,t)}translateY(t){return this.translateOnAxis(Ch,t)}translateZ(t){return this.translateOnAxis(Ph,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ba.copy(t):ba.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(Is,ba,this.up):Wn.lookAt(ba,Is,this.up),this.quaternion.setFromRotationMatrix(Wn),s&&(Wn.extractRotation(s.matrixWorld),ji.setFromRotationMatrix(Wn),this.quaternion.premultiply(ji.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dh),Ki.child=t,this.dispatchEvent(Ki),Ki.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Og),nr.child=t,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dh),Ki.child=t,this.dispatchEvent(Ki),Ki.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,t,zg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Is,Ng,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];a(t.shapes,f)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(a(t.materials,this.material[l]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(a(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}De.DEFAULT_UP=new H(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const An=new H,$n=new H,ir=new H,Yn=new H,Ji=new H,Qi=new H,Lh=new H,sr=new H,ar=new H,or=new H,rr=new Fe,cr=new Fe,lr=new Fe;class mn{constructor(t=new H,e=new H,i=new H){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),An.subVectors(t,e),s.cross(An);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,i,s,a){An.subVectors(s,e),$n.subVectors(i,e),ir.subVectors(t,e);const o=An.dot(An),r=An.dot($n),l=An.dot(ir),c=$n.dot($n),h=$n.dot(ir),f=o*c-r*r;if(f===0)return a.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return a.set(1-u-m,m,u)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(t,e,i,s,a,o,r,l){return this.getBarycoord(t,e,i,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Yn.x),l.addScaledVector(o,Yn.y),l.addScaledVector(r,Yn.z),l)}static getInterpolatedAttribute(t,e,i,s,a,o){return rr.setScalar(0),cr.setScalar(0),lr.setScalar(0),rr.fromBufferAttribute(t,e),cr.fromBufferAttribute(t,i),lr.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(rr,a.x),o.addScaledVector(cr,a.y),o.addScaledVector(lr,a.z),o}static isFrontFacing(t,e,i,s){return An.subVectors(i,e),$n.subVectors(t,e),An.cross($n).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return An.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),An.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,a){return mn.getInterpolation(t,this.a,this.b,this.c,e,i,s,a)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,a=this.c;let o,r;Ji.subVectors(s,i),Qi.subVectors(a,i),sr.subVectors(t,i);const l=Ji.dot(sr),c=Qi.dot(sr);if(l<=0&&c<=0)return e.copy(i);ar.subVectors(t,s);const h=Ji.dot(ar),f=Qi.dot(ar);if(h>=0&&f<=h)return e.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ji,o);or.subVectors(t,a);const u=Ji.dot(or),m=Qi.dot(or);if(m>=0&&u<=m)return e.copy(a);const v=u*c-l*m;if(v<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(Qi,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return Lh.subVectors(a,s),r=(f-h)/(f-h+(u-m)),e.copy(s).addScaledVector(Lh,r);const p=1/(g+v+d);return o=v*p,r=d*p,e.copy(i).addScaledVector(Ji,o).addScaledVector(Qi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const _u={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Ea={h:0,s:0,l:0};function hr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=i,me.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=me.workingColorSpace){if(t=il(t,1),e=qe(e,0,1),i=qe(i,0,1),e===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+e):i+e-i*e,o=2*i-a;this.r=hr(o,a,t+1/3),this.g=hr(o,a,t),this.b=hr(o,a,t-1/3)}return me.toWorkingColorSpace(this,s),this}setStyle(t,e=nn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const i=_u[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Jn(t.r),this.g=Jn(t.g),this.b=Jn(t.b),this}copyLinearToSRGB(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return me.fromWorkingColorSpace(Qe.copy(this),t),Math.round(qe(Qe.r*255,0,255))*65536+Math.round(qe(Qe.g*255,0,255))*256+Math.round(qe(Qe.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.fromWorkingColorSpace(Qe.copy(this),e);const i=Qe.r,s=Qe.g,a=Qe.b,o=Math.max(i,s,a),r=Math.min(i,s,a);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(s-a)/f+(s<a?6:0);break;case s:l=(a-i)/f+2;break;case a:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.fromWorkingColorSpace(Qe.copy(this),e),t.r=Qe.r,t.g=Qe.g,t.b=Qe.b,t}getStyle(t=nn){me.fromWorkingColorSpace(Qe.copy(this),t);const e=Qe.r,i=Qe.g,s=Qe.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(si),this.setHSL(si.h+t,si.s+e,si.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(si),t.getHSL(Ea);const i=Vs(si.h,Ea.h,e),s=Vs(si.s,Ea.s,e),a=Vs(si.l,Ea.l,e);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*i+a[6]*s,this.g=a[1]*e+a[4]*i+a[7]*s,this.b=a[2]*e+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Qe=new ee;ee.NAMES=_u;let Bg=0;class Oi extends ws{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bg++}),this.uuid=Bn(),this.name="",this.blending=fs,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wr,this.blendDst=$r,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(i.blending=this.blending),this.side!==pi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Wr&&(i.blendSrc=this.blendSrc),this.blendDst!==$r&&(i.blendDst=this.blendDst),this.blendEquation!==Pi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const o=[];for(const r in a){const l=a[r];delete l.metadata,o.push(l)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(i.textures=a),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=e[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class He extends Oi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.combine=jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ue=new H,wa=new Gt;class je{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Pc,this.updateRanges=[],this.gpuType=jn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)wa.fromBufferAttribute(this,e),wa.applyMatrix3(t),this.setXY(e,wa.x,wa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Rn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Rn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Rn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Rn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Rn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array),a=_e(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Pc&&(t.usage=this.usage),t}}class yu extends je{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Mu extends je{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class ve extends je{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Hg=0;const xn=new Te,dr=new De,ts=new H,un=new ra,Fs=new ra,We=new H;class ze extends ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Hg++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gu(t)?Mu:yu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new re().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return xn.makeRotationFromQuaternion(t),this.applyMatrix4(xn),this}rotateX(t){return xn.makeRotationX(t),this.applyMatrix4(xn),this}rotateY(t){return xn.makeRotationY(t),this.applyMatrix4(xn),this}rotateZ(t){return xn.makeRotationZ(t),this.applyMatrix4(xn),this}translate(t,e,i){return xn.makeTranslation(t,e,i),this.applyMatrix4(xn),this}scale(t,e,i){return xn.makeScale(t,e,i),this.applyMatrix4(xn),this}lookAt(t){return dr.lookAt(t),dr.updateMatrix(),this.applyMatrix4(dr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ts).negate(),this.translate(ts.x,ts.y,ts.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,a=t.length;s<a;s++){const o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ve(i,3))}else{for(let i=0,s=e.count;i<s;i++){const a=t[i];e.setXYZ(i,a.x,a.y,a.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ra);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const a=e[i];un.setFromBufferAttribute(a),this.morphTargetsRelative?(We.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(We),We.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(We)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){const i=this.boundingSphere.center;if(un.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];Fs.setFromBufferAttribute(r),this.morphTargetsRelative?(We.addVectors(un.min,Fs.min),un.expandByPoint(We),We.addVectors(un.max,Fs.max),un.expandByPoint(We)):(un.expandByPoint(Fs.min),un.expandByPoint(Fs.max))}un.getCenter(i);let s=0;for(let a=0,o=t.count;a<o;a++)We.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(We));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)We.fromBufferAttribute(r,c),l&&(ts.fromBufferAttribute(t,c),We.add(ts)),s=Math.max(s,i.distanceToSquared(We))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,a=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new H,l[T]=new H;const c=new H,h=new H,f=new H,d=new Gt,u=new Gt,m=new Gt,v=new H,g=new H;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,M),d.fromBufferAttribute(a,T),u.fromBufferAttribute(a,b),m.fromBufferAttribute(a,M),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const P=1/(u.x*m.y-m.x*u.y);isFinite(P)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(P),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(P),r[T].add(v),r[b].add(v),r[M].add(v),l[T].add(g),l[b].add(g),l[M].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let T=0,b=_.length;T<b;++T){const M=_[T],P=M.start,I=M.count;for(let k=P,F=P+I;k<F;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const x=new H,y=new H,R=new H,E=new H;function S(T){R.fromBufferAttribute(s,T),E.copy(R);const b=r[T];x.copy(b),x.sub(R.multiplyScalar(R.dot(b))).normalize(),y.crossVectors(E,b);const P=y.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,P)}for(let T=0,b=_.length;T<b;++T){const M=_[T],P=M.start,I=M.count;for(let k=P,F=P+I;k<F;k+=3)S(t.getX(k+0)),S(t.getX(k+1)),S(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new je(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new H,a=new H,o=new H,r=new H,l=new H,c=new H,h=new H,f=new H;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,m),a.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),f.subVectors(s,a),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)We.fromBufferAttribute(t,e),We.normalize(),t.setXYZ(e,We.x,We.y,We.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let v=0,g=l.length;v<g;v++){r.isInterleavedBufferAttribute?u=l[v]*r.data.stride+r.offset:u=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new je(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ze,i=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,i);e.setAttribute(r,c)}const a=this.morphAttributes;for(const r in a){const l=[],c=a[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],f=a[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const kh=new Te,yi=new sl,Ta=new wo,Ih=new H,Aa=new H,Ra=new H,Ca=new H,ur=new H,Pa=new H,Fh=new H,Da=new H;class fe extends De{constructor(t=new ze,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){Pa.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=r[l],f=a[l];h!==0&&(ur.fromBufferAttribute(f,t),o?Pa.addScaledVector(ur,h):Pa.addScaledVector(ur.sub(e),h))}e.add(Pa)}return e}raycast(t,e){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ta.copy(i.boundingSphere),Ta.applyMatrix4(a),yi.copy(t.ray).recast(t.near),!(Ta.containsPoint(yi.origin)===!1&&(yi.intersectSphere(Ta,Ih)===null||yi.origin.distanceToSquared(Ih)>(t.far-t.near)**2))&&(kh.copy(a).invert(),yi.copy(t.ray).applyMatrix4(kh),!(i.boundingBox!==null&&yi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,yi)))}_computeIntersections(t,e,i){let s;const a=this.geometry,o=this.material,r=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,d=a.groups,u=a.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=o[g.materialIndex],_=Math.max(g.start,u.start),x=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let y=_,R=x;y<R;y+=3){const E=r.getX(y),S=r.getX(y+1),T=r.getX(y+2);s=La(this,p,t,i,c,h,f,E,S,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(r.count,u.start+u.count);for(let g=m,p=v;g<p;g+=3){const _=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);s=La(this,o,t,i,c,h,f,_,x,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=o[g.materialIndex],_=Math.max(g.start,u.start),x=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let y=_,R=x;y<R;y+=3){const E=y,S=y+1,T=y+2;s=La(this,p,t,i,c,h,f,E,S,T),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=m,p=v;g<p;g+=3){const _=g,x=g+1,y=g+2;s=La(this,o,t,i,c,h,f,_,x,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function Gg(n,t,e,i,s,a,o,r){let l;if(t.side===cn?l=i.intersectTriangle(o,a,s,!0,r):l=i.intersectTriangle(s,a,o,t.side===pi,r),l===null)return null;Da.copy(r),Da.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Da);return c<e.near||c>e.far?null:{distance:c,point:Da.clone(),object:n}}function La(n,t,e,i,s,a,o,r,l,c){n.getVertexPosition(r,Aa),n.getVertexPosition(l,Ra),n.getVertexPosition(c,Ca);const h=Gg(n,t,e,i,Aa,Ra,Ca,Fh);if(h){const f=new H;mn.getBarycoord(Fh,Aa,Ra,Ca,f),s&&(h.uv=mn.getInterpolatedAttribute(s,r,l,c,f,new Gt)),a&&(h.uv1=mn.getInterpolatedAttribute(a,r,l,c,f,new Gt)),o&&(h.normal=mn.getInterpolatedAttribute(o,r,l,c,f,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new H,materialIndex:0};mn.getNormal(Aa,Ra,Ca,d.normal),h.face=d,h.barycoord=f}return h}class Dn extends ze{constructor(t=1,e=1,i=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,a,0),m("z","y","x",1,-1,i,e,-t,o,a,1),m("x","z","y",1,1,t,i,e,s,o,2),m("x","z","y",1,-1,t,i,-e,s,o,3),m("x","y","z",1,-1,t,e,i,s,a,4),m("x","y","z",-1,-1,t,e,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new ve(c,3)),this.setAttribute("normal",new ve(h,3)),this.setAttribute("uv",new ve(f,2));function m(v,g,p,_,x,y,R,E,S,T,b){const M=y/S,P=R/T,I=y/2,k=R/2,F=E/2,D=S+1,C=T+1;let U=0,B=0;const W=new H;for(let et=0;et<C;et++){const gt=et*P-k;for(let ht=0;ht<D;ht++){const ut=ht*M-I;W[v]=ut*_,W[g]=gt*x,W[p]=F,c.push(W.x,W.y,W.z),W[v]=0,W[g]=0,W[p]=E>0?1:-1,h.push(W.x,W.y,W.z),f.push(ht/S),f.push(1-et/T),U+=1}}for(let et=0;et<T;et++)for(let gt=0;gt<S;gt++){const ht=d+gt+D*et,ut=d+gt+D*(et+1),j=d+(gt+1)+D*(et+1),J=d+(gt+1)+D*et;l.push(ht,ut,J),l.push(ut,j,J),B+=6}r.addGroup(u,B,b),u+=B,d+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function en(n){const t={};for(let e=0;e<n.length;e++){const i=bs(n[e]);for(const s in i)t[s]=i[s]}return t}function Vg(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Su(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const Xg={clone:bs,merge:en};var Wg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$g=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mi extends Oi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wg,this.fragmentShader=$g,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bs(t.uniforms),this.uniformsGroups=Vg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class bu extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=Kn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ai=new H,Uh=new Gt,zh=new Gt;class _n extends bu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Js*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ms*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Js*2*Math.atan(Math.tan(ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ai.x,ai.y).multiplyScalar(-t/ai.z),ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ai.x,ai.y).multiplyScalar(-t/ai.z)}getViewSize(t,e){return this.getViewBounds(t,Uh,zh),e.subVectors(zh,Uh)}setViewOffset(t,e,i,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ms*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const es=-90,ns=1;class Yg extends De{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new _n(es,ns,t,e);s.layers=this.layers,this.add(s);const a=new _n(es,ns,t,e);a.layers=this.layers,this.add(a);const o=new _n(es,ns,t,e);o.layers=this.layers,this.add(o);const r=new _n(es,ns,t,e);r.layers=this.layers,this.add(r);const l=new _n(es,ns,t,e);l.layers=this.layers,this.add(l);const c=new _n(es,ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,a,o,r,l]=e;for(const c of e)this.remove(c);if(t===Kn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===fo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,a),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Eu extends an{constructor(t,e,i,s,a,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:_s,super(t,e,i,s,a,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Zg extends zi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Eu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Nn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Dn(5,5,5),a=new mi({name:"CubemapFromEquirect",uniforms:bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:cn,blending:ui});a.uniforms.tEquirect.value=e;const o=new fe(s,a),r=e.minFilter;return e.minFilter===ki&&(e.minFilter=Nn),new Yg(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(a)}}const fr=new H,qg=new H,jg=new re;class Ai{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=fr.subVectors(i,e).cross(qg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(fr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||jg.getNormalMatrix(t),s=this.coplanarPoint(fr).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mi=new wo,ka=new H;class ol{constructor(t=new Ai,e=new Ai,i=new Ai,s=new Ai,a=new Ai,o=new Ai){this.planes=[t,e,i,s,a,o]}set(t,e,i,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Kn){const i=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],l=s[3],c=s[4],h=s[5],f=s[6],d=s[7],u=s[8],m=s[9],v=s[10],g=s[11],p=s[12],_=s[13],x=s[14],y=s[15];if(i[0].setComponents(l-a,d-c,g-u,y-p).normalize(),i[1].setComponents(l+a,d+c,g+u,y+p).normalize(),i[2].setComponents(l+o,d+h,g+m,y+_).normalize(),i[3].setComponents(l-o,d-h,g-m,y-_).normalize(),i[4].setComponents(l-r,d-f,g-v,y-x).normalize(),e===Kn)i[5].setComponents(l+r,d+f,g+v,y+x).normalize();else if(e===fo)i[5].setComponents(r,f,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Mi)}intersectsSprite(t){return Mi.center.set(0,0,0),Mi.radius=.7071067811865476,Mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Mi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ka.x=s.normal.x>0?t.max.x:t.min.x,ka.y=s.normal.y>0?t.max.y:t.min.y,ka.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ka)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wu(){let n=null,t=!1,e=null,i=null;function s(a,o){e(a,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){n=a}}}function Kg(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],v=f[u];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const v=f[u];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function a(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:s,remove:a,update:o}}class vn extends ze{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(i),l=Math.floor(s),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const _=p*d-o;for(let x=0;x<c;x++){const y=x*f-a;m.push(y,-_,0),v.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<r;_++){const x=_+c*p,y=_+c*(p+1),R=_+1+c*(p+1),E=_+1+c*p;u.push(x,y,E),u.push(y,R,E)}this.setIndex(u),this.setAttribute("position",new ve(m,3)),this.setAttribute("normal",new ve(v,3)),this.setAttribute("uv",new ve(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Jg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qg=`#ifdef USE_ALPHAHASH
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
#endif`,tx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ex=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ix=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sx=`#ifdef USE_AOMAP
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
#endif`,ax=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ox=`#ifdef USE_BATCHING
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
#endif`,rx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,cx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dx=`#ifdef USE_IRIDESCENCE
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
#endif`,ux=`#ifdef USE_BUMPMAP
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
#endif`,fx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,px=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xx=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_x=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Mx=`#define PI 3.141592653589793
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
} // validated`,Sx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bx=`vec3 transformedNormal = objectNormal;
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
#endif`,Ex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ax=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Px=`#ifdef USE_ENVMAP
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
#endif`,Dx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Lx=`#ifdef USE_ENVMAP
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
#endif`,kx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ix=`#ifdef USE_ENVMAP
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
#endif`,Fx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ux=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Nx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ox=`#ifdef USE_GRADIENTMAP
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
}`,Bx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vx=`uniform bool receiveShadow;
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
#endif`,Xx=`#ifdef USE_ENVMAP
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
#endif`,Wx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$x=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qx=`PhysicalMaterial material;
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
#endif`,jx=`struct PhysicalMaterial {
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
}`,Kx=`
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
#endif`,Jx=`#if defined( RE_IndirectDiffuse )
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
#endif`,Qx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ev=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,av=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ov=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,rv=`#if defined( USE_POINTS_UV )
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
#endif`,cv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,uv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fv=`#ifdef USE_MORPHTARGETS
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
#endif`,pv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,gv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,xv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_v=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yv=`#ifdef USE_NORMALMAP
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
#endif`,Mv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ev=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Av=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Iv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Uv=`float getShadowMask() {
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
}`,zv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Nv=`#ifdef USE_SKINNING
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
#endif`,Ov=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Bv=`#ifdef USE_SKINNING
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
#endif`,Hv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Vv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wv=`#ifdef USE_TRANSMISSION
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
#endif`,$v=`#ifdef USE_TRANSMISSION
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
#endif`,Yv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,qv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jv=`uniform sampler2D t2D;
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
}`,Qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,e_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i_=`#include <common>
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
}`,s_=`#if DEPTH_PACKING == 3200
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
}`,a_=`#define DISTANCE
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
}`,o_=`#define DISTANCE
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
}`,r_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,c_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l_=`uniform float scale;
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
}`,h_=`uniform vec3 diffuse;
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
}`,d_=`#include <common>
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
}`,u_=`uniform vec3 diffuse;
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
}`,f_=`#define LAMBERT
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
}`,p_=`#define LAMBERT
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
}`,m_=`#define MATCAP
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
}`,g_=`#define MATCAP
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
}`,x_=`#define NORMAL
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
}`,v_=`#define NORMAL
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
}`,__=`#define PHONG
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
}`,y_=`#define PHONG
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
}`,M_=`#define STANDARD
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
}`,S_=`#define STANDARD
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
}`,b_=`#define TOON
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
}`,E_=`#define TOON
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
}`,w_=`uniform float size;
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
}`,T_=`uniform vec3 diffuse;
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
}`,A_=`#include <common>
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
}`,R_=`uniform vec3 color;
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
}`,C_=`uniform float rotation;
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
}`,P_=`uniform vec3 diffuse;
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
}`,ce={alphahash_fragment:Jg,alphahash_pars_fragment:Qg,alphamap_fragment:tx,alphamap_pars_fragment:ex,alphatest_fragment:nx,alphatest_pars_fragment:ix,aomap_fragment:sx,aomap_pars_fragment:ax,batching_pars_vertex:ox,batching_vertex:rx,begin_vertex:cx,beginnormal_vertex:lx,bsdfs:hx,iridescence_fragment:dx,bumpmap_pars_fragment:ux,clipping_planes_fragment:fx,clipping_planes_pars_fragment:px,clipping_planes_pars_vertex:mx,clipping_planes_vertex:gx,color_fragment:xx,color_pars_fragment:vx,color_pars_vertex:_x,color_vertex:yx,common:Mx,cube_uv_reflection_fragment:Sx,defaultnormal_vertex:bx,displacementmap_pars_vertex:Ex,displacementmap_vertex:wx,emissivemap_fragment:Tx,emissivemap_pars_fragment:Ax,colorspace_fragment:Rx,colorspace_pars_fragment:Cx,envmap_fragment:Px,envmap_common_pars_fragment:Dx,envmap_pars_fragment:Lx,envmap_pars_vertex:kx,envmap_physical_pars_fragment:Xx,envmap_vertex:Ix,fog_vertex:Fx,fog_pars_vertex:Ux,fog_fragment:zx,fog_pars_fragment:Nx,gradientmap_pars_fragment:Ox,lightmap_pars_fragment:Bx,lights_lambert_fragment:Hx,lights_lambert_pars_fragment:Gx,lights_pars_begin:Vx,lights_toon_fragment:Wx,lights_toon_pars_fragment:$x,lights_phong_fragment:Yx,lights_phong_pars_fragment:Zx,lights_physical_fragment:qx,lights_physical_pars_fragment:jx,lights_fragment_begin:Kx,lights_fragment_maps:Jx,lights_fragment_end:Qx,logdepthbuf_fragment:tv,logdepthbuf_pars_fragment:ev,logdepthbuf_pars_vertex:nv,logdepthbuf_vertex:iv,map_fragment:sv,map_pars_fragment:av,map_particle_fragment:ov,map_particle_pars_fragment:rv,metalnessmap_fragment:cv,metalnessmap_pars_fragment:lv,morphinstance_vertex:hv,morphcolor_vertex:dv,morphnormal_vertex:uv,morphtarget_pars_vertex:fv,morphtarget_vertex:pv,normal_fragment_begin:mv,normal_fragment_maps:gv,normal_pars_fragment:xv,normal_pars_vertex:vv,normal_vertex:_v,normalmap_pars_fragment:yv,clearcoat_normal_fragment_begin:Mv,clearcoat_normal_fragment_maps:Sv,clearcoat_pars_fragment:bv,iridescence_pars_fragment:Ev,opaque_fragment:wv,packing:Tv,premultiplied_alpha_fragment:Av,project_vertex:Rv,dithering_fragment:Cv,dithering_pars_fragment:Pv,roughnessmap_fragment:Dv,roughnessmap_pars_fragment:Lv,shadowmap_pars_fragment:kv,shadowmap_pars_vertex:Iv,shadowmap_vertex:Fv,shadowmask_pars_fragment:Uv,skinbase_vertex:zv,skinning_pars_vertex:Nv,skinning_vertex:Ov,skinnormal_vertex:Bv,specularmap_fragment:Hv,specularmap_pars_fragment:Gv,tonemapping_fragment:Vv,tonemapping_pars_fragment:Xv,transmission_fragment:Wv,transmission_pars_fragment:$v,uv_pars_fragment:Yv,uv_pars_vertex:Zv,uv_vertex:qv,worldpos_vertex:jv,background_vert:Kv,background_frag:Jv,backgroundCube_vert:Qv,backgroundCube_frag:t_,cube_vert:e_,cube_frag:n_,depth_vert:i_,depth_frag:s_,distanceRGBA_vert:a_,distanceRGBA_frag:o_,equirect_vert:r_,equirect_frag:c_,linedashed_vert:l_,linedashed_frag:h_,meshbasic_vert:d_,meshbasic_frag:u_,meshlambert_vert:f_,meshlambert_frag:p_,meshmatcap_vert:m_,meshmatcap_frag:g_,meshnormal_vert:x_,meshnormal_frag:v_,meshphong_vert:__,meshphong_frag:y_,meshphysical_vert:M_,meshphysical_frag:S_,meshtoon_vert:b_,meshtoon_frag:E_,points_vert:w_,points_frag:T_,shadow_vert:A_,shadow_frag:R_,sprite_vert:C_,sprite_frag:P_},Nt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new re}},envmap:{envMap:{value:null},envMapRotation:{value:new re},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new re}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new re}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new re},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new re},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new re},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new re}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new re}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new re}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0},uvTransform:{value:new re}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}}},zn={basic:{uniforms:en([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.fog]),vertexShader:ce.meshbasic_vert,fragmentShader:ce.meshbasic_frag},lambert:{uniforms:en([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)}}]),vertexShader:ce.meshlambert_vert,fragmentShader:ce.meshlambert_frag},phong:{uniforms:en([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:ce.meshphong_vert,fragmentShader:ce.meshphong_frag},standard:{uniforms:en([Nt.common,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.roughnessmap,Nt.metalnessmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag},toon:{uniforms:en([Nt.common,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.gradientmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)}}]),vertexShader:ce.meshtoon_vert,fragmentShader:ce.meshtoon_frag},matcap:{uniforms:en([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,{matcap:{value:null}}]),vertexShader:ce.meshmatcap_vert,fragmentShader:ce.meshmatcap_frag},points:{uniforms:en([Nt.points,Nt.fog]),vertexShader:ce.points_vert,fragmentShader:ce.points_frag},dashed:{uniforms:en([Nt.common,Nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ce.linedashed_vert,fragmentShader:ce.linedashed_frag},depth:{uniforms:en([Nt.common,Nt.displacementmap]),vertexShader:ce.depth_vert,fragmentShader:ce.depth_frag},normal:{uniforms:en([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,{opacity:{value:1}}]),vertexShader:ce.meshnormal_vert,fragmentShader:ce.meshnormal_frag},sprite:{uniforms:en([Nt.sprite,Nt.fog]),vertexShader:ce.sprite_vert,fragmentShader:ce.sprite_frag},background:{uniforms:{uvTransform:{value:new re},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ce.background_vert,fragmentShader:ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new re}},vertexShader:ce.backgroundCube_vert,fragmentShader:ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ce.cube_vert,fragmentShader:ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ce.equirect_vert,fragmentShader:ce.equirect_frag},distanceRGBA:{uniforms:en([Nt.common,Nt.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ce.distanceRGBA_vert,fragmentShader:ce.distanceRGBA_frag},shadow:{uniforms:en([Nt.lights,Nt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:ce.shadow_vert,fragmentShader:ce.shadow_frag}};zn.physical={uniforms:en([zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new re},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new re},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new re},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new re},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new re},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new re},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new re},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new re},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new re},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new re},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new re},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new re}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag};const Ia={r:0,b:0,g:0},Si=new Hn,D_=new Te;function L_(n,t,e,i,s,a,o){const r=new ee(0);let l=a===!0?0:1,c,h,f=null,d=0,u=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?e:t).get(x)),x}function v(_){let x=!1;const y=m(_);y===null?p(r,l):y&&y.isColor&&(p(y,1),x=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(_,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===bo)?(h===void 0&&(h=new fe(new Dn(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:bs(zn.backgroundCube.uniforms),vertexShader:zn.backgroundCube.vertexShader,fragmentShader:zn.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,E,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Si.copy(x.backgroundRotation),Si.x*=-1,Si.y*=-1,Si.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Si.y*=-1,Si.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(D_.makeRotationFromEuler(Si)),h.material.toneMapped=me.getTransfer(y.colorSpace)!==Se,(f!==y||d!==y.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new fe(new vn(2,2),new mi({name:"BackgroundMaterial",uniforms:bs(zn.background.uniforms),vertexShader:zn.background.vertexShader,fragmentShader:zn.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=me.getTransfer(y.colorSpace)!==Se,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||d!==y.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=y,d=y.version,u=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function p(_,x){_.getRGB(Ia,Su(n)),i.buffers.color.setClear(Ia.r,Ia.g,Ia.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(_,x=1){r.set(_),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,p(r,l)},render:v,addToRenderList:g}}function k_(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let a=s,o=!1;function r(M,P,I,k,F){let D=!1;const C=f(k,I,P);a!==C&&(a=C,c(a.object)),D=u(M,k,I,F),D&&m(M,k,I,F),F!==null&&t.update(F,n.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,y(M,P,I,k),F!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,P,I){const k=I.wireframe===!0;let F=i[M.id];F===void 0&&(F={},i[M.id]=F);let D=F[P.id];D===void 0&&(D={},F[P.id]=D);let C=D[k];return C===void 0&&(C=d(l()),D[k]=C),C}function d(M){const P=[],I=[],k=[];for(let F=0;F<e;F++)P[F]=0,I[F]=0,k[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:I,attributeDivisors:k,object:M,attributes:{},index:null}}function u(M,P,I,k){const F=a.attributes,D=P.attributes;let C=0;const U=I.getAttributes();for(const B in U)if(U[B].location>=0){const et=F[B];let gt=D[B];if(gt===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(gt=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(gt=M.instanceColor)),et===void 0||et.attribute!==gt||gt&&et.data!==gt.data)return!0;C++}return a.attributesNum!==C||a.index!==k}function m(M,P,I,k){const F={},D=P.attributes;let C=0;const U=I.getAttributes();for(const B in U)if(U[B].location>=0){let et=D[B];et===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const gt={};gt.attribute=et,et&&et.data&&(gt.data=et.data),F[B]=gt,C++}a.attributes=F,a.attributesNum=C,a.index=k}function v(){const M=a.newAttributes;for(let P=0,I=M.length;P<I;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){const I=a.newAttributes,k=a.enabledAttributes,F=a.attributeDivisors;I[M]=1,k[M]===0&&(n.enableVertexAttribArray(M),k[M]=1),F[M]!==P&&(n.vertexAttribDivisor(M,P),F[M]=P)}function _(){const M=a.newAttributes,P=a.enabledAttributes;for(let I=0,k=P.length;I<k;I++)P[I]!==M[I]&&(n.disableVertexAttribArray(I),P[I]=0)}function x(M,P,I,k,F,D,C){C===!0?n.vertexAttribIPointer(M,P,I,F,D):n.vertexAttribPointer(M,P,I,k,F,D)}function y(M,P,I,k){v();const F=k.attributes,D=I.getAttributes(),C=P.defaultAttributeValues;for(const U in D){const B=D[U];if(B.location>=0){let W=F[U];if(W===void 0&&(U==="instanceMatrix"&&M.instanceMatrix&&(W=M.instanceMatrix),U==="instanceColor"&&M.instanceColor&&(W=M.instanceColor)),W!==void 0){const et=W.normalized,gt=W.itemSize,ht=t.get(W);if(ht===void 0)continue;const ut=ht.buffer,j=ht.type,J=ht.bytesPerElement,xt=j===n.INT||j===n.UNSIGNED_INT||W.gpuType===Kc;if(W.isInterleavedBufferAttribute){const tt=W.data,At=tt.stride,Ut=W.offset;if(tt.isInstancedInterleavedBuffer){for(let vt=0;vt<B.locationSize;vt++)p(B.location+vt,tt.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let vt=0;vt<B.locationSize;vt++)g(B.location+vt);n.bindBuffer(n.ARRAY_BUFFER,ut);for(let vt=0;vt<B.locationSize;vt++)x(B.location+vt,gt/B.locationSize,j,et,At*J,(Ut+gt/B.locationSize*vt)*J,xt)}else{if(W.isInstancedBufferAttribute){for(let tt=0;tt<B.locationSize;tt++)p(B.location+tt,W.meshPerAttribute);M.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let tt=0;tt<B.locationSize;tt++)g(B.location+tt);n.bindBuffer(n.ARRAY_BUFFER,ut);for(let tt=0;tt<B.locationSize;tt++)x(B.location+tt,gt/B.locationSize,j,et,gt*J,gt/B.locationSize*tt*J,xt)}}else if(C!==void 0){const et=C[U];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(B.location,et);break;case 3:n.vertexAttrib3fv(B.location,et);break;case 4:n.vertexAttrib4fv(B.location,et);break;default:n.vertexAttrib1fv(B.location,et)}}}}_()}function R(){T();for(const M in i){const P=i[M];for(const I in P){const k=P[I];for(const F in k)h(k[F].object),delete k[F];delete P[I]}delete i[M]}}function E(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const I in P){const k=P[I];for(const F in k)h(k[F].object),delete k[F];delete P[I]}delete i[M.id]}function S(M){for(const P in i){const I=i[P];if(I[M.id]===void 0)continue;const k=I[M.id];for(const F in k)h(k[F].object),delete k[F];delete I[M.id]}}function T(){b(),o=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:E,releaseStatesOfProgram:S,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function I_(n,t,e){let i;function s(c){i=c}function a(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let v=0;v<f;v++)m+=h[v]*d[v];e.update(m,i,1)}}this.setMode=s,this.render=a,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function F_(n,t,e,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const S=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==Cn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(S){const T=S===aa&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==Qn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==jn&&!T)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=m>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:R,maxSamples:E}}function U_(n){const t=this;let e=null,i=0,s=!1,a=!1;const o=new Ai,r=new re,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!s||m===null||m.length===0||a&&!g)a?h(null):c();else{const _=a?0:i,x=_*4;let y=p.clippingState||null;l.value=y,y=h(m,d,x,u);for(let R=0;R!==x;++R)y[R]=e[R];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=u+v*4,_=d.matrixWorldInverse;r.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=u;x!==v;++x,y+=4)o.copy(f[x]).applyMatrix4(_,r),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function z_(n){let t=new WeakMap;function e(o,r){return r===tc?o.mapping=_s:r===ec&&(o.mapping=ys),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===tc||r===ec)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Zg(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}class Tu extends bu{constructor(t=-1,e=1,i=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-t,o=i+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const hs=4,Nh=[.125,.215,.35,.446,.526,.582],Di=20,pr=new Tu,Oh=new ee;let mr=null,gr=0,xr=0,vr=!1;const Ri=(1+Math.sqrt(5))/2,is=1/Ri,Bh=[new H(-Ri,is,0),new H(Ri,is,0),new H(-is,0,Ri),new H(is,0,Ri),new H(0,Ri,-is),new H(0,Ri,is),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class Hh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),xr=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mr,gr,xr),this._renderer.xr.enabled=vr,t.scissorTest=!1,Fa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_s||t.mapping===ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mr=this._renderer.getRenderTarget(),gr=this._renderer.getActiveCubeFace(),xr=this._renderer.getActiveMipmapLevel(),vr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Nn,minFilter:Nn,generateMipmaps:!1,type:aa,format:Cn,colorSpace:Es,depthBuffer:!1},s=Gh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gh(t,e,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=N_(a)),this._blurMaterial=O_(a,t,e)}return s}_compileMaterial(t){const e=new fe(this._lodPlanes[0],t);this._renderer.compile(e,pr)}_sceneToCubeUV(t,e,i,s){const r=new _n(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Oh),h.toneMapping=fi,h.autoClear=!1;const u=new He({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1}),m=new fe(new Dn,u);let v=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,v=!0):(u.color.copy(Oh),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):_===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Fa(s,_*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===_s||t.mapping===ys;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vh());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const l=this._cubeSize;Fa(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,pr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),r=Bh[(s-a-1)%Bh.length];this._blur(t,a-1,a,o,r)}e.autoClear=i}_blur(t,e,i,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",a),this._halfBlur(o,t,i,i,s,"longitudinal",a)}_halfBlur(t,e,i,s,a,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new fe(this._lodPlanes[s],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*Di-1),v=a/m,g=isFinite(a)?1+Math.floor(h*v):Di;g>Di&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Di}`);const p=[];let _=0;for(let S=0;S<Di;++S){const T=S/v,b=Math.exp(-T*T/2);p.push(b),S===0?_+=b:S<g&&(_+=2*b)}for(let S=0;S<p.length;S++)p[S]=p[S]/_;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const y=this._sizeLods[s],R=3*y*(s>x-hs?s-x+hs:0),E=4*(this._cubeSize-y);Fa(e,R,E,3*y,2*y),l.setRenderTarget(e),l.render(f,pr)}}function N_(n){const t=[],e=[],i=[];let s=n;const a=n-hs+1+Nh.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let l=1/r;o>n-hs?l=Nh[o-n+hs-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*u),x=new Float32Array(g*m*u),y=new Float32Array(p*m*u);for(let E=0;E<u;E++){const S=E%3*2/3-1,T=E>2?0:-1,b=[S,T,0,S+2/3,T,0,S+2/3,T+1,0,S,T,0,S+2/3,T+1,0,S,T+1,0];_.set(b,v*m*E),x.set(d,g*m*E);const M=[E,E,E,E,E,E];y.set(M,p*m*E)}const R=new ze;R.setAttribute("position",new je(_,v)),R.setAttribute("uv",new je(x,g)),R.setAttribute("faceIndex",new je(y,p)),t.push(R),s>hs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Gh(n,t,e){const i=new zi(n,t,e);return i.texture.mapping=bo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fa(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function O_(n,t,e){const i=new Float32Array(Di),s=new H(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:rl(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Vh(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rl(),fragmentShader:`

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
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Xh(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function rl(){return`

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
	`}function B_(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===tc||l===ec,h=l===_s||l===ys;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Hh(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new Hh(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",a),f.texture):null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function a(r){const l=r.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function H_(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Bs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function G_(n,t,e,i){const s={},a=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}d.removeEventListener("dispose",o),delete s[d.id];const u=a.get(d);u&&(t.remove(u),a.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const v=u[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let v=0;if(u!==null){const _=u.array;v=u.version;for(let x=0,y=_.length;x<y;x+=3){const R=_[x+0],E=_[x+1],S=_[x+2];d.push(R,E,E,S,S,R)}}else if(m!==void 0){const _=m.array;v=m.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const R=x+0,E=x+1,S=x+2;d.push(R,E,E,S,S,R)}}else return;const g=new(gu(d)?Mu:yu)(d,1);g.version=v;const p=a.get(f);p&&t.remove(p),a.set(f,g)}function h(f){const d=a.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return a.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function V_(n,t,e){let i;function s(d){i=d}let a,o;function r(d){a=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,a,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,a,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,v){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,a,d,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=u[_]*v[_];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function X_(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(a/3);break;case n.LINES:e.lines+=r*(a/2);break;case n.LINE_STRIP:e.lines+=r*(a-1);break;case n.LINE_LOOP:e.lines+=r*a;break;case n.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function W_(n,t,e){const i=new WeakMap,s=new Fe;function a(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],_=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),v===!0&&(y=2),g===!0&&(y=3);let R=r.attributes.position.count*y,E=1;R>t.maxTextureSize&&(E=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const S=new Float32Array(R*E*4*f),T=new vu(S,R,E,f);T.type=jn,T.needsUpdate=!0;const b=y*4;for(let P=0;P<f;P++){const I=p[P],k=_[P],F=x[P],D=R*E*4*P;for(let C=0;C<I.count;C++){const U=C*b;m===!0&&(s.fromBufferAttribute(I,C),S[D+U+0]=s.x,S[D+U+1]=s.y,S[D+U+2]=s.z,S[D+U+3]=0),v===!0&&(s.fromBufferAttribute(k,C),S[D+U+4]=s.x,S[D+U+5]=s.y,S[D+U+6]=s.z,S[D+U+7]=0),g===!0&&(s.fromBufferAttribute(F,C),S[D+U+8]=s.x,S[D+U+9]=s.y,S[D+U+10]=s.z,S[D+U+11]=F.itemSize===4?s.w:1)}}d={count:f,texture:T,size:new Gt(R,E)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const v=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:a}}function $_(n,t,e,i){let s=new WeakMap;function a(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function o(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}class Au extends an{constructor(t,e,i,s,a,o,r,l,c,h=ps){if(h!==ps&&h!==Ss)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ps&&(i=Ui),i===void 0&&h===Ss&&(i=Ms),super(null,s,a,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Pn,this.minFilter=l!==void 0?l:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ru=new an,Wh=new Au(1,1),Cu=new vu,Pu=new Lg,Du=new Eu,$h=[],Yh=[],Zh=new Float32Array(16),qh=new Float32Array(9),jh=new Float32Array(4);function Ts(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let a=$h[s];if(a===void 0&&(a=new Float32Array(s),$h[s]=a),t!==0){i.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(a,r)}return a}function Ge(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ve(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function To(n,t){let e=Yh[t];e===void 0&&(e=new Int32Array(t),Yh[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Y_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Z_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2fv(this.addr,t),Ve(e,t)}}function q_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ge(e,t))return;n.uniform3fv(this.addr,t),Ve(e,t)}}function j_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4fv(this.addr,t),Ve(e,t)}}function K_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;jh.set(i),n.uniformMatrix2fv(this.addr,!1,jh),Ve(e,i)}}function J_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;qh.set(i),n.uniformMatrix3fv(this.addr,!1,qh),Ve(e,i)}}function Q_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ge(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(Ge(e,i))return;Zh.set(i),n.uniformMatrix4fv(this.addr,!1,Zh),Ve(e,i)}}function ty(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ey(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2iv(this.addr,t),Ve(e,t)}}function ny(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;n.uniform3iv(this.addr,t),Ve(e,t)}}function iy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4iv(this.addr,t),Ve(e,t)}}function sy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function ay(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ge(e,t))return;n.uniform2uiv(this.addr,t),Ve(e,t)}}function oy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ge(e,t))return;n.uniform3uiv(this.addr,t),Ve(e,t)}}function ry(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ge(e,t))return;n.uniform4uiv(this.addr,t),Ve(e,t)}}function cy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Wh.compareFunction=mu,a=Wh):a=Ru,e.setTexture2D(t||a,s)}function ly(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Pu,s)}function hy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Du,s)}function dy(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Cu,s)}function uy(n){switch(n){case 5126:return Y_;case 35664:return Z_;case 35665:return q_;case 35666:return j_;case 35674:return K_;case 35675:return J_;case 35676:return Q_;case 5124:case 35670:return ty;case 35667:case 35671:return ey;case 35668:case 35672:return ny;case 35669:case 35673:return iy;case 5125:return sy;case 36294:return ay;case 36295:return oy;case 36296:return ry;case 35678:case 36198:case 36298:case 36306:case 35682:return cy;case 35679:case 36299:case 36307:return ly;case 35680:case 36300:case 36308:case 36293:return hy;case 36289:case 36303:case 36311:case 36292:return dy}}function fy(n,t){n.uniform1fv(this.addr,t)}function py(n,t){const e=Ts(t,this.size,2);n.uniform2fv(this.addr,e)}function my(n,t){const e=Ts(t,this.size,3);n.uniform3fv(this.addr,e)}function gy(n,t){const e=Ts(t,this.size,4);n.uniform4fv(this.addr,e)}function xy(n,t){const e=Ts(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function vy(n,t){const e=Ts(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function _y(n,t){const e=Ts(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function yy(n,t){n.uniform1iv(this.addr,t)}function My(n,t){n.uniform2iv(this.addr,t)}function Sy(n,t){n.uniform3iv(this.addr,t)}function by(n,t){n.uniform4iv(this.addr,t)}function Ey(n,t){n.uniform1uiv(this.addr,t)}function wy(n,t){n.uniform2uiv(this.addr,t)}function Ty(n,t){n.uniform3uiv(this.addr,t)}function Ay(n,t){n.uniform4uiv(this.addr,t)}function Ry(n,t,e){const i=this.cache,s=t.length,a=To(e,s);Ge(i,a)||(n.uniform1iv(this.addr,a),Ve(i,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ru,a[o])}function Cy(n,t,e){const i=this.cache,s=t.length,a=To(e,s);Ge(i,a)||(n.uniform1iv(this.addr,a),Ve(i,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Pu,a[o])}function Py(n,t,e){const i=this.cache,s=t.length,a=To(e,s);Ge(i,a)||(n.uniform1iv(this.addr,a),Ve(i,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Du,a[o])}function Dy(n,t,e){const i=this.cache,s=t.length,a=To(e,s);Ge(i,a)||(n.uniform1iv(this.addr,a),Ve(i,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Cu,a[o])}function Ly(n){switch(n){case 5126:return fy;case 35664:return py;case 35665:return my;case 35666:return gy;case 35674:return xy;case 35675:return vy;case 35676:return _y;case 5124:case 35670:return yy;case 35667:case 35671:return My;case 35668:case 35672:return Sy;case 35669:case 35673:return by;case 5125:return Ey;case 36294:return wy;case 36295:return Ty;case 36296:return Ay;case 35678:case 36198:case 36298:case 36306:case 35682:return Ry;case 35679:case 36299:case 36307:return Cy;case 35680:case 36300:case 36308:case 36293:return Py;case 36289:case 36303:case 36311:case 36292:return Dy}}class ky{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=uy(e.type)}}class Iy{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ly(e.type)}}class Fy{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],i)}}}const _r=/(\w+)(\])?(\[|\.)?/g;function Kh(n,t){n.seq.push(t),n.map[t.id]=t}function Uy(n,t,e){const i=n.name,s=i.length;for(_r.lastIndex=0;;){const a=_r.exec(i),o=_r.lastIndex;let r=a[1];const l=a[2]==="]",c=a[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===s){Kh(e,c===void 0?new ky(r,n,t):new Iy(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new Fy(r),Kh(e,f)),e=f}}}class to{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);Uy(a,o,this)}}setValue(t,e,i,s){const a=this.map[e];a!==void 0&&a.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&i.push(o)}return i}}function Jh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const zy=37297;let Ny=0;function Oy(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Qh=new re;function By(n){me._getMatrix(Qh,me.workingColorSpace,n);const t=`mat3( ${Qh.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(n)){case Eo:return[t,"LinearTransferOETF"];case Se:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function td(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Oy(n.getShaderSource(t),o)}else return s}function Hy(n,t){const e=By(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Gy(n,t){let e;switch(t){case X0:e="Linear";break;case W0:e="Reinhard";break;case $0:e="Cineon";break;case Y0:e="ACESFilmic";break;case q0:e="AgX";break;case j0:e="Neutral";break;case Z0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ua=new H;function Vy(){me.getLuminanceCoefficients(Ua);const n=Ua.x.toFixed(4),t=Ua.y.toFixed(4),e=Ua.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hs).join(`
`)}function Wy(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function $y(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(t,s),o=a.name;let r=1;a.type===n.FLOAT_MAT2&&(r=2),a.type===n.FLOAT_MAT3&&(r=3),a.type===n.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Hs(n){return n!==""}function ed(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function nd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Yy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dc(n){return n.replace(Yy,qy)}const Zy=new Map;function qy(n,t){let e=ce[t];if(e===void 0){const i=Zy.get(t);if(i!==void 0)e=ce[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Dc(e)}const jy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function id(n){return n.replace(jy,Ky)}function Ky(n,t,e,i){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function sd(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Jy(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===eu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===nu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Qy(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case _s:case ys:t="ENVMAP_TYPE_CUBE";break;case bo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function tM(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ys:t="ENVMAP_MODE_REFRACTION";break}return t}function eM(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case jc:t="ENVMAP_BLENDING_MULTIPLY";break;case G0:t="ENVMAP_BLENDING_MIX";break;case V0:t="ENVMAP_BLENDING_ADD";break}return t}function nM(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function iM(n,t,e,i){const s=n.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=Jy(e),c=Qy(e),h=tM(e),f=eM(e),d=nM(e),u=Xy(e),m=Wy(a),v=s.createProgram();let g,p,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Hs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Hs).join(`
`),p.length>0&&(p+=`
`)):(g=[sd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hs).join(`
`),p=[sd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fi?"#define TONE_MAPPING":"",e.toneMapping!==fi?ce.tonemapping_pars_fragment:"",e.toneMapping!==fi?Gy("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ce.colorspace_pars_fragment,Hy("linearToOutputTexel",e.outputColorSpace),Vy(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Hs).join(`
`)),o=Dc(o),o=ed(o,e),o=nd(o,e),r=Dc(r),r=ed(r,e),r=nd(r,e),o=id(o),r=id(r),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=_+g+o,y=_+p+r,R=Jh(s,s.VERTEX_SHADER,x),E=Jh(s,s.FRAGMENT_SHADER,y);s.attachShader(v,R),s.attachShader(v,E),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function S(P){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(v).trim(),k=s.getShaderInfoLog(R).trim(),F=s.getShaderInfoLog(E).trim();let D=!0,C=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,R,E);else{const U=td(s,R,"vertex"),B=td(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+I+`
`+U+`
`+B)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(k===""||F==="")&&(C=!1);C&&(P.diagnostics={runnable:D,programLog:I,vertexShader:{log:k,prefix:g},fragmentShader:{log:F,prefix:p}})}s.deleteShader(R),s.deleteShader(E),T=new to(s,v),b=$y(s,v)}let T;this.getUniforms=function(){return T===void 0&&S(this),T};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,zy)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ny++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=E,this}let sM=0;class aM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new oM(t),e.set(t,i)),i}}class oM{constructor(t){this.id=sM++,this.code=t,this.usedTimes=0}}function rM(n,t,e,i,s,a,o){const r=new al,l=new aM,c=new Set,h=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let u=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,P,I,k){const F=I.fog,D=k.geometry,C=b.isMeshStandardMaterial?I.environment:null,U=(b.isMeshStandardMaterial?e:t).get(b.envMap||C),B=U&&U.mapping===bo?U.image.height:null,W=m[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const et=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,gt=et!==void 0?et.length:0;let ht=0;D.morphAttributes.position!==void 0&&(ht=1),D.morphAttributes.normal!==void 0&&(ht=2),D.morphAttributes.color!==void 0&&(ht=3);let ut,j,J,xt;if(W){const te=zn[W];ut=te.vertexShader,j=te.fragmentShader}else ut=b.vertexShader,j=b.fragmentShader,l.update(b),J=l.getVertexShaderID(b),xt=l.getFragmentShaderID(b);const tt=n.getRenderTarget(),At=n.state.buffers.depth.getReversed(),Ut=k.isInstancedMesh===!0,vt=k.isBatchedMesh===!0,Yt=!!b.map,_t=!!b.matcap,Wt=!!U,G=!!b.aoMap,le=!!b.lightMap,Ot=!!b.bumpMap,kt=!!b.normalMap,bt=!!b.displacementMap,wt=!!b.emissiveMap,Ft=!!b.metalnessMap,L=!!b.roughnessMap,w=b.anisotropy>0,Y=b.clearcoat>0,rt=b.dispersion>0,dt=b.iridescence>0,at=b.sheen>0,Lt=b.transmission>0,Z=w&&!!b.anisotropyMap,mt=Y&&!!b.clearcoatMap,Kt=Y&&!!b.clearcoatNormalMap,ot=Y&&!!b.clearcoatRoughnessMap,yt=dt&&!!b.iridescenceMap,O=dt&&!!b.iridescenceThicknessMap,ct=at&&!!b.sheenColorMap,pt=at&&!!b.sheenRoughnessMap,zt=!!b.specularMap,Vt=!!b.specularColorMap,Bt=!!b.specularIntensityMap,z=Lt&&!!b.transmissionMap,Mt=Lt&&!!b.thicknessMap,K=!!b.gradientMap,lt=!!b.alphaMap,Et=b.alphaTest>0,St=!!b.alphaHash,Zt=!!b.extensions;let ne=fi;b.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(ne=n.toneMapping);const se={shaderID:W,shaderType:b.type,shaderName:b.name,vertexShader:ut,fragmentShader:j,defines:b.defines,customVertexShaderID:J,customFragmentShaderID:xt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:vt,batchingColor:vt&&k._colorsTexture!==null,instancing:Ut,instancingColor:Ut&&k.instanceColor!==null,instancingMorph:Ut&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:tt===null?n.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Es,alphaToCoverage:!!b.alphaToCoverage,map:Yt,matcap:_t,envMap:Wt,envMapMode:Wt&&U.mapping,envMapCubeUVHeight:B,aoMap:G,lightMap:le,bumpMap:Ot,normalMap:kt,displacementMap:d&&bt,emissiveMap:wt,normalMapObjectSpace:kt&&b.normalMapType===tg,normalMapTangentSpace:kt&&b.normalMapType===pu,metalnessMap:Ft,roughnessMap:L,anisotropy:w,anisotropyMap:Z,clearcoat:Y,clearcoatMap:mt,clearcoatNormalMap:Kt,clearcoatRoughnessMap:ot,dispersion:rt,iridescence:dt,iridescenceMap:yt,iridescenceThicknessMap:O,sheen:at,sheenColorMap:ct,sheenRoughnessMap:pt,specularMap:zt,specularColorMap:Vt,specularIntensityMap:Bt,transmission:Lt,transmissionMap:z,thicknessMap:Mt,gradientMap:K,opaque:b.transparent===!1&&b.blending===fs&&b.alphaToCoverage===!1,alphaMap:lt,alphaTest:Et,alphaHash:St,combine:b.combine,mapUv:Yt&&v(b.map.channel),aoMapUv:G&&v(b.aoMap.channel),lightMapUv:le&&v(b.lightMap.channel),bumpMapUv:Ot&&v(b.bumpMap.channel),normalMapUv:kt&&v(b.normalMap.channel),displacementMapUv:bt&&v(b.displacementMap.channel),emissiveMapUv:wt&&v(b.emissiveMap.channel),metalnessMapUv:Ft&&v(b.metalnessMap.channel),roughnessMapUv:L&&v(b.roughnessMap.channel),anisotropyMapUv:Z&&v(b.anisotropyMap.channel),clearcoatMapUv:mt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Kt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:O&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:pt&&v(b.sheenRoughnessMap.channel),specularMapUv:zt&&v(b.specularMap.channel),specularColorMapUv:Vt&&v(b.specularColorMap.channel),specularIntensityMapUv:Bt&&v(b.specularIntensityMap.channel),transmissionMapUv:z&&v(b.transmissionMap.channel),thicknessMapUv:Mt&&v(b.thicknessMap.channel),alphaMapUv:lt&&v(b.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(kt||w),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!D.attributes.uv&&(Yt||lt),fog:!!F,useFog:b.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:At,skinning:k.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:ht,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ne,decodeVideoTexture:Yt&&b.map.isVideoTexture===!0&&me.getTransfer(b.map.colorSpace)===Se,decodeVideoTextureEmissive:wt&&b.emissiveMap.isVideoTexture===!0&&me.getTransfer(b.emissiveMap.colorSpace)===Se,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ce,flipSided:b.side===cn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Zt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Zt&&b.extensions.multiDraw===!0||vt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return se.vertexUv1s=c.has(1),se.vertexUv2s=c.has(2),se.vertexUv3s=c.has(3),c.clear(),se}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(_(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function y(b){const M=m[b.type];let P;if(M){const I=zn[M];P=Xg.clone(I.uniforms)}else P=b.uniforms;return P}function R(b,M){let P;for(let I=0,k=h.length;I<k;I++){const F=h[I];if(F.cacheKey===M){P=F,++P.usedTimes;break}}return P===void 0&&(P=new iM(n,M,b,a),h.push(P)),P}function E(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function S(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:R,releaseProgram:E,releaseShaderCache:S,programs:h,dispose:T}}function cM(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function s(o,r,l){n.get(o)[r]=l}function a(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:a}}function lM(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function ad(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function od(){const n=[];let t=0;const e=[],i=[],s=[];function a(){t=0,e.length=0,i.length=0,s.length=0}function o(f,d,u,m,v,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:v,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=v,p.group=g),t++,p}function r(f,d,u,m,v,g){const p=o(f,d,u,m,v,g);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):e.push(p)}function l(f,d,u,m,v,g){const p=o(f,d,u,m,v,g);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||lM),i.length>1&&i.sort(d||ad),s.length>1&&s.sort(d||ad)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:s,init:a,push:r,unshift:l,finish:h,sort:c}}function hM(){let n=new WeakMap;function t(i,s){const a=n.get(i);let o;return a===void 0?(o=new od,n.set(i,[o])):s>=a.length?(o=new od,a.push(o)):o=a[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function dM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new H,color:new ee};break;case"SpotLight":e={position:new H,direction:new H,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new H,halfWidth:new H,halfHeight:new H};break}return n[t.id]=e,e}}}function uM(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let fM=0;function pM(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function mM(n){const t=new dM,e=uM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const s=new H,a=new Te,o=new Te;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,m=0,v=0,g=0,p=0,_=0,x=0,y=0,R=0,E=0,S=0;c.sort(pM);for(let b=0,M=c.length;b<M;b++){const P=c[b],I=P.color,k=P.intensity,F=P.distance,D=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=I.r*k,f+=I.g*k,d+=I.b*k;else if(P.isLightProbe){for(let C=0;C<9;C++)i.probe[C].addScaledVector(P.sh.coefficients[C],k);S++}else if(P.isDirectionalLight){const C=t.get(P);if(C.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const U=P.shadow,B=e.get(P);B.shadowIntensity=U.intensity,B.shadowBias=U.bias,B.shadowNormalBias=U.normalBias,B.shadowRadius=U.radius,B.shadowMapSize=U.mapSize,i.directionalShadow[u]=B,i.directionalShadowMap[u]=D,i.directionalShadowMatrix[u]=P.shadow.matrix,_++}i.directional[u]=C,u++}else if(P.isSpotLight){const C=t.get(P);C.position.setFromMatrixPosition(P.matrixWorld),C.color.copy(I).multiplyScalar(k),C.distance=F,C.coneCos=Math.cos(P.angle),C.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),C.decay=P.decay,i.spot[v]=C;const U=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,U.updateMatrices(P),P.castShadow&&E++),i.spotLightMatrix[v]=U.matrix,P.castShadow){const B=e.get(P);B.shadowIntensity=U.intensity,B.shadowBias=U.bias,B.shadowNormalBias=U.normalBias,B.shadowRadius=U.radius,B.shadowMapSize=U.mapSize,i.spotShadow[v]=B,i.spotShadowMap[v]=D,y++}v++}else if(P.isRectAreaLight){const C=t.get(P);C.color.copy(I).multiplyScalar(k),C.halfWidth.set(P.width*.5,0,0),C.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=C,g++}else if(P.isPointLight){const C=t.get(P);if(C.color.copy(P.color).multiplyScalar(P.intensity),C.distance=P.distance,C.decay=P.decay,P.castShadow){const U=P.shadow,B=e.get(P);B.shadowIntensity=U.intensity,B.shadowBias=U.bias,B.shadowNormalBias=U.normalBias,B.shadowRadius=U.radius,B.shadowMapSize=U.mapSize,B.shadowCameraNear=U.camera.near,B.shadowCameraFar=U.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=D,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=C,m++}else if(P.isHemisphereLight){const C=t.get(P);C.skyColor.copy(P.color).multiplyScalar(k),C.groundColor.copy(P.groundColor).multiplyScalar(k),i.hemi[p]=C,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Nt.LTC_FLOAT_1,i.rectAreaLTC2=Nt.LTC_FLOAT_2):(i.rectAreaLTC1=Nt.LTC_HALF_1,i.rectAreaLTC2=Nt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==v||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==_||T.numPointShadows!==x||T.numSpotShadows!==y||T.numSpotMaps!==R||T.numLightProbes!==S)&&(i.directional.length=u,i.spot.length=v,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+R-E,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=S,T.directionalLength=u,T.pointLength=m,T.spotLength=v,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=_,T.numPointShadows=x,T.numSpotShadows=y,T.numSpotMaps=R,T.numLightProbes=S,i.version=fM++)}function l(c,h){let f=0,d=0,u=0,m=0,v=0;const g=h.matrixWorldInverse;for(let p=0,_=c.length;p<_;p++){const x=c[p];if(x.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(x.isSpotLight){const y=i.spot[u];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),a.copy(x.matrixWorld),a.premultiply(g),o.extractRotation(a),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:r,setupView:l,state:i}}function rd(n){const t=new mM(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function a(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:r,setupLightsView:l,pushLight:a,pushShadow:o}}function gM(n){let t=new WeakMap;function e(s,a=0){const o=t.get(s);let r;return o===void 0?(r=new rd(n),t.set(s,[r])):a>=o.length?(r=new rd(n),o.push(r)):r=o[a],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class xM extends Oi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=J0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class vM extends Oi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const _M=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yM=`uniform sampler2D shadow_pass;
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
}`;function MM(n,t,e){let i=new ol;const s=new Gt,a=new Gt,o=new Fe,r=new xM({depthPacking:Q0}),l=new vM,c={},h=e.maxTextureSize,f={[pi]:cn,[cn]:pi,[Ce]:Ce},d=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:_M,fragmentShader:yM}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new ze;m.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new fe(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eu;let p=this.type;this.render=function(E,S,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),I=n.state;I.setBlending(ui),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=p!==Zn&&this.type===Zn,F=p===Zn&&this.type!==Zn;for(let D=0,C=E.length;D<C;D++){const U=E[D],B=U.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const W=B.getFrameExtents();if(s.multiply(W),a.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/W.x),s.x=a.x*W.x,B.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/W.y),s.y=a.y*W.y,B.mapSize.y=a.y)),B.map===null||k===!0||F===!0){const gt=this.type!==Zn?{minFilter:Pn,magFilter:Pn}:{};B.map!==null&&B.map.dispose(),B.map=new zi(s.x,s.y,gt),B.map.texture.name=U.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const et=B.getViewportCount();for(let gt=0;gt<et;gt++){const ht=B.getViewport(gt);o.set(a.x*ht.x,a.y*ht.y,a.x*ht.z,a.y*ht.w),I.viewport(o),B.updateMatrices(U,gt),i=B.getFrustum(),y(S,T,B.camera,U,this.type)}B.isPointLightShadow!==!0&&this.type===Zn&&_(B,T),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,P)};function _(E,S){const T=t.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new zi(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(S,null,T,d,v,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(S,null,T,u,v,null)}function x(E,S,T,b){let M=null;const P=T.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)M=P;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const I=M.uuid,k=S.uuid;let F=c[I];F===void 0&&(F={},c[I]=F);let D=F[k];D===void 0&&(D=M.clone(),F[k]=D,S.addEventListener("dispose",R)),M=D}if(M.visible=S.visible,M.wireframe=S.wireframe,b===Zn?M.side=S.shadowSide!==null?S.shadowSide:S.side:M.side=S.shadowSide!==null?S.shadowSide:f[S.side],M.alphaMap=S.alphaMap,M.alphaTest=S.alphaTest,M.map=S.map,M.clipShadows=S.clipShadows,M.clippingPlanes=S.clippingPlanes,M.clipIntersection=S.clipIntersection,M.displacementMap=S.displacementMap,M.displacementScale=S.displacementScale,M.displacementBias=S.displacementBias,M.wireframeLinewidth=S.wireframeLinewidth,M.linewidth=S.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=n.properties.get(M);I.light=T}return M}function y(E,S,T,b,M){if(E.visible===!1)return;if(E.layers.test(S.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===Zn)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,E.matrixWorld);const k=t.update(E),F=E.material;if(Array.isArray(F)){const D=k.groups;for(let C=0,U=D.length;C<U;C++){const B=D[C],W=F[B.materialIndex];if(W&&W.visible){const et=x(E,W,b,M);E.onBeforeShadow(n,E,S,T,k,et,B),n.renderBufferDirect(T,null,k,et,E,B),E.onAfterShadow(n,E,S,T,k,et,B)}}}else if(F.visible){const D=x(E,F,b,M);E.onBeforeShadow(n,E,S,T,k,D,null),n.renderBufferDirect(T,null,k,D,E,null),E.onAfterShadow(n,E,S,T,k,D,null)}}const I=E.children;for(let k=0,F=I.length;k<F;k++)y(I[k],S,T,b,M)}function R(E){E.target.removeEventListener("dispose",R);for(const T in c){const b=c[T],M=E.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const SM={[Yr]:Zr,[qr]:Jr,[jr]:Qr,[vs]:Kr,[Zr]:Yr,[Jr]:qr,[Qr]:jr,[Kr]:vs};function bM(n,t){function e(){let z=!1;const Mt=new Fe;let K=null;const lt=new Fe(0,0,0,0);return{setMask:function(Et){K!==Et&&!z&&(n.colorMask(Et,Et,Et,Et),K=Et)},setLocked:function(Et){z=Et},setClear:function(Et,St,Zt,ne,se){se===!0&&(Et*=ne,St*=ne,Zt*=ne),Mt.set(Et,St,Zt,ne),lt.equals(Mt)===!1&&(n.clearColor(Et,St,Zt,ne),lt.copy(Mt))},reset:function(){z=!1,K=null,lt.set(-1,0,0,0)}}}function i(){let z=!1,Mt=!1,K=null,lt=null,Et=null;return{setReversed:function(St){if(Mt!==St){const Zt=t.get("EXT_clip_control");Mt?Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.ZERO_TO_ONE_EXT):Zt.clipControlEXT(Zt.LOWER_LEFT_EXT,Zt.NEGATIVE_ONE_TO_ONE_EXT);const ne=Et;Et=null,this.setClear(ne)}Mt=St},getReversed:function(){return Mt},setTest:function(St){St?tt(n.DEPTH_TEST):At(n.DEPTH_TEST)},setMask:function(St){K!==St&&!z&&(n.depthMask(St),K=St)},setFunc:function(St){if(Mt&&(St=SM[St]),lt!==St){switch(St){case Yr:n.depthFunc(n.NEVER);break;case Zr:n.depthFunc(n.ALWAYS);break;case qr:n.depthFunc(n.LESS);break;case vs:n.depthFunc(n.LEQUAL);break;case jr:n.depthFunc(n.EQUAL);break;case Kr:n.depthFunc(n.GEQUAL);break;case Jr:n.depthFunc(n.GREATER);break;case Qr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=St}},setLocked:function(St){z=St},setClear:function(St){Et!==St&&(Mt&&(St=1-St),n.clearDepth(St),Et=St)},reset:function(){z=!1,K=null,lt=null,Et=null,Mt=!1}}}function s(){let z=!1,Mt=null,K=null,lt=null,Et=null,St=null,Zt=null,ne=null,se=null;return{setTest:function(te){z||(te?tt(n.STENCIL_TEST):At(n.STENCIL_TEST))},setMask:function(te){Mt!==te&&!z&&(n.stencilMask(te),Mt=te)},setFunc:function(te,ge,pe){(K!==te||lt!==ge||Et!==pe)&&(n.stencilFunc(te,ge,pe),K=te,lt=ge,Et=pe)},setOp:function(te,ge,pe){(St!==te||Zt!==ge||ne!==pe)&&(n.stencilOp(te,ge,pe),St=te,Zt=ge,ne=pe)},setLocked:function(te){z=te},setClear:function(te){se!==te&&(n.clearStencil(te),se=te)},reset:function(){z=!1,Mt=null,K=null,lt=null,Et=null,St=null,Zt=null,ne=null,se=null}}}const a=new e,o=new i,r=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,R=null,E=null,S=new ee(0,0,0),T=0,b=!1,M=null,P=null,I=null,k=null,F=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let C=!1,U=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(B)[1]),C=U>=1):B.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),C=U>=2);let W=null,et={};const gt=n.getParameter(n.SCISSOR_BOX),ht=n.getParameter(n.VIEWPORT),ut=new Fe().fromArray(gt),j=new Fe().fromArray(ht);function J(z,Mt,K,lt){const Et=new Uint8Array(4),St=n.createTexture();n.bindTexture(z,St),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Zt=0;Zt<K;Zt++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(Mt,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,Et):n.texImage2D(Mt+Zt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Et);return St}const xt={};xt[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),xt[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),xt[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),xt[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),r.setClear(0),tt(n.DEPTH_TEST),o.setFunc(vs),Ot(!1),kt(hh),tt(n.CULL_FACE),G(ui);function tt(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function At(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function Ut(z,Mt){return f[z]!==Mt?(n.bindFramebuffer(z,Mt),f[z]=Mt,z===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Mt),z===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Mt),!0):!1}function vt(z,Mt){let K=u,lt=!1;if(z){K=d.get(Mt),K===void 0&&(K=[],d.set(Mt,K));const Et=z.textures;if(K.length!==Et.length||K[0]!==n.COLOR_ATTACHMENT0){for(let St=0,Zt=Et.length;St<Zt;St++)K[St]=n.COLOR_ATTACHMENT0+St;K.length=Et.length,lt=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,lt=!0);lt&&n.drawBuffers(K)}function Yt(z){return m!==z?(n.useProgram(z),m=z,!0):!1}const _t={[Pi]:n.FUNC_ADD,[w0]:n.FUNC_SUBTRACT,[T0]:n.FUNC_REVERSE_SUBTRACT};_t[A0]=n.MIN,_t[R0]=n.MAX;const Wt={[C0]:n.ZERO,[P0]:n.ONE,[D0]:n.SRC_COLOR,[Wr]:n.SRC_ALPHA,[z0]:n.SRC_ALPHA_SATURATE,[F0]:n.DST_COLOR,[k0]:n.DST_ALPHA,[L0]:n.ONE_MINUS_SRC_COLOR,[$r]:n.ONE_MINUS_SRC_ALPHA,[U0]:n.ONE_MINUS_DST_COLOR,[I0]:n.ONE_MINUS_DST_ALPHA,[N0]:n.CONSTANT_COLOR,[O0]:n.ONE_MINUS_CONSTANT_COLOR,[B0]:n.CONSTANT_ALPHA,[H0]:n.ONE_MINUS_CONSTANT_ALPHA};function G(z,Mt,K,lt,Et,St,Zt,ne,se,te){if(z===ui){v===!0&&(At(n.BLEND),v=!1);return}if(v===!1&&(tt(n.BLEND),v=!0),z!==E0){if(z!==g||te!==b){if((p!==Pi||y!==Pi)&&(n.blendEquation(n.FUNC_ADD),p=Pi,y=Pi),te)switch(z){case fs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFunc(n.ONE,n.ONE);break;case dh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case uh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case fs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case dh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case uh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}_=null,x=null,R=null,E=null,S.set(0,0,0),T=0,g=z,b=te}return}Et=Et||Mt,St=St||K,Zt=Zt||lt,(Mt!==p||Et!==y)&&(n.blendEquationSeparate(_t[Mt],_t[Et]),p=Mt,y=Et),(K!==_||lt!==x||St!==R||Zt!==E)&&(n.blendFuncSeparate(Wt[K],Wt[lt],Wt[St],Wt[Zt]),_=K,x=lt,R=St,E=Zt),(ne.equals(S)===!1||se!==T)&&(n.blendColor(ne.r,ne.g,ne.b,se),S.copy(ne),T=se),g=z,b=!1}function le(z,Mt){z.side===Ce?At(n.CULL_FACE):tt(n.CULL_FACE);let K=z.side===cn;Mt&&(K=!K),Ot(K),z.blending===fs&&z.transparent===!1?G(ui):G(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),a.setMask(z.colorWrite);const lt=z.stencilWrite;r.setTest(lt),lt&&(r.setMask(z.stencilWriteMask),r.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),r.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),wt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?tt(n.SAMPLE_ALPHA_TO_COVERAGE):At(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ot(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function kt(z){z!==S0?(tt(n.CULL_FACE),z!==P&&(z===hh?n.cullFace(n.BACK):z===b0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):At(n.CULL_FACE),P=z}function bt(z){z!==I&&(C&&n.lineWidth(z),I=z)}function wt(z,Mt,K){z?(tt(n.POLYGON_OFFSET_FILL),(k!==Mt||F!==K)&&(n.polygonOffset(Mt,K),k=Mt,F=K)):At(n.POLYGON_OFFSET_FILL)}function Ft(z){z?tt(n.SCISSOR_TEST):At(n.SCISSOR_TEST)}function L(z){z===void 0&&(z=n.TEXTURE0+D-1),W!==z&&(n.activeTexture(z),W=z)}function w(z,Mt,K){K===void 0&&(W===null?K=n.TEXTURE0+D-1:K=W);let lt=et[K];lt===void 0&&(lt={type:void 0,texture:void 0},et[K]=lt),(lt.type!==z||lt.texture!==Mt)&&(W!==K&&(n.activeTexture(K),W=K),n.bindTexture(z,Mt||xt[z]),lt.type=z,lt.texture=Mt)}function Y(){const z=et[W];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function rt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function dt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function at(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Lt(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Z(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function mt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Kt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ot(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function yt(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ct(z){ut.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),ut.copy(z))}function pt(z){j.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),j.copy(z))}function zt(z,Mt){let K=c.get(Mt);K===void 0&&(K=new WeakMap,c.set(Mt,K));let lt=K.get(z);lt===void 0&&(lt=n.getUniformBlockIndex(Mt,z.name),K.set(z,lt))}function Vt(z,Mt){const lt=c.get(Mt).get(z);l.get(Mt)!==lt&&(n.uniformBlockBinding(Mt,lt,z.__bindingPointIndex),l.set(Mt,lt))}function Bt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},W=null,et={},f={},d=new WeakMap,u=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,R=null,E=null,S=new ee(0,0,0),T=0,b=!1,M=null,P=null,I=null,k=null,F=null,ut.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),a.reset(),o.reset(),r.reset()}return{buffers:{color:a,depth:o,stencil:r},enable:tt,disable:At,bindFramebuffer:Ut,drawBuffers:vt,useProgram:Yt,setBlending:G,setMaterial:le,setFlipSided:Ot,setCullFace:kt,setLineWidth:bt,setPolygonOffset:wt,setScissorTest:Ft,activeTexture:L,bindTexture:w,unbindTexture:Y,compressedTexImage2D:rt,compressedTexImage3D:dt,texImage2D:yt,texImage3D:O,updateUBOMapping:zt,uniformBlockBinding:Vt,texStorage2D:Kt,texStorage3D:ot,texSubImage2D:at,texSubImage3D:Lt,compressedTexSubImage2D:Z,compressedTexSubImage3D:mt,scissor:ct,viewport:pt,reset:Bt}}function cd(n,t,e,i){const s=EM(i);switch(e){case ru:return n*t;case lu:return n*t;case hu:return n*t*2;case du:return n*t/s.components*s.byteLength;case tl:return n*t/s.components*s.byteLength;case uu:return n*t*2/s.components*s.byteLength;case el:return n*t*2/s.components*s.byteLength;case cu:return n*t*3/s.components*s.byteLength;case Cn:return n*t*4/s.components*s.byteLength;case nl:return n*t*4/s.components*s.byteLength;case qa:case ja:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ka:case Ja:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ac:case rc:return Math.max(n,16)*Math.max(t,8)/4;case sc:case oc:return Math.max(n,8)*Math.max(t,8)/2;case cc:case lc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case hc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case dc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case uc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case fc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case pc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case mc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case gc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case xc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case vc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case _c:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case yc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Mc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Sc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case bc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ec:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Qa:case wc:case Tc:return Math.ceil(n/4)*Math.ceil(t/4)*16;case fu:case Ac:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Rc:case Cc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function EM(n){switch(n){case Qn:case su:return{byteLength:1,components:1};case Ks:case au:case aa:return{byteLength:2,components:1};case Jc:case Qc:return{byteLength:2,components:4};case Ui:case Kc:case jn:return{byteLength:4,components:1};case ou:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function wM(n,t,e,i,s,a,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Gt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,w){return u?new OffscreenCanvas(L,w):po("canvas")}function v(L,w,Y){let rt=1;const dt=Ft(L);if((dt.width>Y||dt.height>Y)&&(rt=Y/Math.max(dt.width,dt.height)),rt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const at=Math.floor(rt*dt.width),Lt=Math.floor(rt*dt.height);f===void 0&&(f=m(at,Lt));const Z=w?m(at,Lt):f;return Z.width=at,Z.height=Lt,Z.getContext("2d").drawImage(L,0,0,at,Lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+at+"x"+Lt+")."),Z}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function _(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(L,w,Y,rt,dt=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let at=w;if(w===n.RED&&(Y===n.FLOAT&&(at=n.R32F),Y===n.HALF_FLOAT&&(at=n.R16F),Y===n.UNSIGNED_BYTE&&(at=n.R8)),w===n.RED_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.R8UI),Y===n.UNSIGNED_SHORT&&(at=n.R16UI),Y===n.UNSIGNED_INT&&(at=n.R32UI),Y===n.BYTE&&(at=n.R8I),Y===n.SHORT&&(at=n.R16I),Y===n.INT&&(at=n.R32I)),w===n.RG&&(Y===n.FLOAT&&(at=n.RG32F),Y===n.HALF_FLOAT&&(at=n.RG16F),Y===n.UNSIGNED_BYTE&&(at=n.RG8)),w===n.RG_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RG8UI),Y===n.UNSIGNED_SHORT&&(at=n.RG16UI),Y===n.UNSIGNED_INT&&(at=n.RG32UI),Y===n.BYTE&&(at=n.RG8I),Y===n.SHORT&&(at=n.RG16I),Y===n.INT&&(at=n.RG32I)),w===n.RGB_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGB8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGB16UI),Y===n.UNSIGNED_INT&&(at=n.RGB32UI),Y===n.BYTE&&(at=n.RGB8I),Y===n.SHORT&&(at=n.RGB16I),Y===n.INT&&(at=n.RGB32I)),w===n.RGBA_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),Y===n.UNSIGNED_INT&&(at=n.RGBA32UI),Y===n.BYTE&&(at=n.RGBA8I),Y===n.SHORT&&(at=n.RGBA16I),Y===n.INT&&(at=n.RGBA32I)),w===n.RGB&&Y===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),w===n.RGBA){const Lt=dt?Eo:me.getTransfer(rt);Y===n.FLOAT&&(at=n.RGBA32F),Y===n.HALF_FLOAT&&(at=n.RGBA16F),Y===n.UNSIGNED_BYTE&&(at=Lt===Se?n.SRGB8_ALPHA8:n.RGBA8),Y===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),Y===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function y(L,w){let Y;return L?w===null||w===Ui||w===Ms?Y=n.DEPTH24_STENCIL8:w===jn?Y=n.DEPTH32F_STENCIL8:w===Ks&&(Y=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ui||w===Ms?Y=n.DEPTH_COMPONENT24:w===jn?Y=n.DEPTH_COMPONENT32F:w===Ks&&(Y=n.DEPTH_COMPONENT16),Y}function R(L,w){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==Pn&&L.minFilter!==Nn?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function E(L){const w=L.target;w.removeEventListener("dispose",E),T(w),w.isVideoTexture&&h.delete(w)}function S(L){const w=L.target;w.removeEventListener("dispose",S),M(w)}function T(L){const w=i.get(L);if(w.__webglInit===void 0)return;const Y=L.source,rt=d.get(Y);if(rt){const dt=rt[w.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&b(L),Object.keys(rt).length===0&&d.delete(Y)}i.remove(L)}function b(L){const w=i.get(L);n.deleteTexture(w.__webglTexture);const Y=L.source,rt=d.get(Y);delete rt[w.__cacheKey],o.memory.textures--}function M(L){const w=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(w.__webglFramebuffer[rt]))for(let dt=0;dt<w.__webglFramebuffer[rt].length;dt++)n.deleteFramebuffer(w.__webglFramebuffer[rt][dt]);else n.deleteFramebuffer(w.__webglFramebuffer[rt]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[rt])}else{if(Array.isArray(w.__webglFramebuffer))for(let rt=0;rt<w.__webglFramebuffer.length;rt++)n.deleteFramebuffer(w.__webglFramebuffer[rt]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let rt=0;rt<w.__webglColorRenderbuffer.length;rt++)w.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[rt]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const Y=L.textures;for(let rt=0,dt=Y.length;rt<dt;rt++){const at=i.get(Y[rt]);at.__webglTexture&&(n.deleteTexture(at.__webglTexture),o.memory.textures--),i.remove(Y[rt])}i.remove(L)}let P=0;function I(){P=0}function k(){const L=P;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),P+=1,L}function F(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function D(L,w){const Y=i.get(L);if(L.isVideoTexture&&bt(L),L.isRenderTargetTexture===!1&&L.version>0&&Y.__version!==L.version){const rt=L.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(Y,L,w);return}}e.bindTexture(n.TEXTURE_2D,Y.__webglTexture,n.TEXTURE0+w)}function C(L,w){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){j(Y,L,w);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Y.__webglTexture,n.TEXTURE0+w)}function U(L,w){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){j(Y,L,w);return}e.bindTexture(n.TEXTURE_3D,Y.__webglTexture,n.TEXTURE0+w)}function B(L,w){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){J(Y,L,w);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture,n.TEXTURE0+w)}const W={[nc]:n.REPEAT,[Li]:n.CLAMP_TO_EDGE,[ic]:n.MIRRORED_REPEAT},et={[Pn]:n.NEAREST,[K0]:n.NEAREST_MIPMAP_NEAREST,[ga]:n.NEAREST_MIPMAP_LINEAR,[Nn]:n.LINEAR,[Yo]:n.LINEAR_MIPMAP_NEAREST,[ki]:n.LINEAR_MIPMAP_LINEAR},gt={[eg]:n.NEVER,[rg]:n.ALWAYS,[ng]:n.LESS,[mu]:n.LEQUAL,[ig]:n.EQUAL,[og]:n.GEQUAL,[sg]:n.GREATER,[ag]:n.NOTEQUAL};function ht(L,w){if(w.type===jn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Nn||w.magFilter===Yo||w.magFilter===ga||w.magFilter===ki||w.minFilter===Nn||w.minFilter===Yo||w.minFilter===ga||w.minFilter===ki)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,W[w.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,W[w.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,W[w.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,et[w.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,et[w.minFilter]),w.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,gt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Pn||w.minFilter!==ga&&w.minFilter!==ki||w.type===jn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function ut(L,w){let Y=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",E));const rt=w.source;let dt=d.get(rt);dt===void 0&&(dt={},d.set(rt,dt));const at=F(w);if(at!==L.__cacheKey){dt[at]===void 0&&(dt[at]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),dt[at].usedTimes++;const Lt=dt[L.__cacheKey];Lt!==void 0&&(dt[L.__cacheKey].usedTimes--,Lt.usedTimes===0&&b(w)),L.__cacheKey=at,L.__webglTexture=dt[at].texture}return Y}function j(L,w,Y){let rt=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(rt=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(rt=n.TEXTURE_3D);const dt=ut(L,w),at=w.source;e.bindTexture(rt,L.__webglTexture,n.TEXTURE0+Y);const Lt=i.get(at);if(at.version!==Lt.__version||dt===!0){e.activeTexture(n.TEXTURE0+Y);const Z=me.getPrimaries(me.workingColorSpace),mt=w.colorSpace===ci?null:me.getPrimaries(w.colorSpace),Kt=w.colorSpace===ci||Z===mt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Kt);let ot=v(w.image,!1,s.maxTextureSize);ot=wt(w,ot);const yt=a.convert(w.format,w.colorSpace),O=a.convert(w.type);let ct=x(w.internalFormat,yt,O,w.colorSpace,w.isVideoTexture);ht(rt,w);let pt;const zt=w.mipmaps,Vt=w.isVideoTexture!==!0,Bt=Lt.__version===void 0||dt===!0,z=at.dataReady,Mt=R(w,ot);if(w.isDepthTexture)ct=y(w.format===Ss,w.type),Bt&&(Vt?e.texStorage2D(n.TEXTURE_2D,1,ct,ot.width,ot.height):e.texImage2D(n.TEXTURE_2D,0,ct,ot.width,ot.height,0,yt,O,null));else if(w.isDataTexture)if(zt.length>0){Vt&&Bt&&e.texStorage2D(n.TEXTURE_2D,Mt,ct,zt[0].width,zt[0].height);for(let K=0,lt=zt.length;K<lt;K++)pt=zt[K],Vt?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,pt.width,pt.height,yt,O,pt.data):e.texImage2D(n.TEXTURE_2D,K,ct,pt.width,pt.height,0,yt,O,pt.data);w.generateMipmaps=!1}else Vt?(Bt&&e.texStorage2D(n.TEXTURE_2D,Mt,ct,ot.width,ot.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ot.width,ot.height,yt,O,ot.data)):e.texImage2D(n.TEXTURE_2D,0,ct,ot.width,ot.height,0,yt,O,ot.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Vt&&Bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Mt,ct,zt[0].width,zt[0].height,ot.depth);for(let K=0,lt=zt.length;K<lt;K++)if(pt=zt[K],w.format!==Cn)if(yt!==null)if(Vt){if(z)if(w.layerUpdates.size>0){const Et=cd(pt.width,pt.height,w.format,w.type);for(const St of w.layerUpdates){const Zt=pt.data.subarray(St*Et/pt.data.BYTES_PER_ELEMENT,(St+1)*Et/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,St,pt.width,pt.height,1,yt,Zt)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,pt.width,pt.height,ot.depth,yt,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,ct,pt.width,pt.height,ot.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,pt.width,pt.height,ot.depth,yt,O,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,ct,pt.width,pt.height,ot.depth,0,yt,O,pt.data)}else{Vt&&Bt&&e.texStorage2D(n.TEXTURE_2D,Mt,ct,zt[0].width,zt[0].height);for(let K=0,lt=zt.length;K<lt;K++)pt=zt[K],w.format!==Cn?yt!==null?Vt?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,pt.width,pt.height,yt,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,K,ct,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,pt.width,pt.height,yt,O,pt.data):e.texImage2D(n.TEXTURE_2D,K,ct,pt.width,pt.height,0,yt,O,pt.data)}else if(w.isDataArrayTexture)if(Vt){if(Bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Mt,ct,ot.width,ot.height,ot.depth),z)if(w.layerUpdates.size>0){const K=cd(ot.width,ot.height,w.format,w.type);for(const lt of w.layerUpdates){const Et=ot.data.subarray(lt*K/ot.data.BYTES_PER_ELEMENT,(lt+1)*K/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,ot.width,ot.height,1,yt,O,Et)}w.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,yt,O,ot.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,ot.width,ot.height,ot.depth,0,yt,O,ot.data);else if(w.isData3DTexture)Vt?(Bt&&e.texStorage3D(n.TEXTURE_3D,Mt,ct,ot.width,ot.height,ot.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,yt,O,ot.data)):e.texImage3D(n.TEXTURE_3D,0,ct,ot.width,ot.height,ot.depth,0,yt,O,ot.data);else if(w.isFramebufferTexture){if(Bt)if(Vt)e.texStorage2D(n.TEXTURE_2D,Mt,ct,ot.width,ot.height);else{let K=ot.width,lt=ot.height;for(let Et=0;Et<Mt;Et++)e.texImage2D(n.TEXTURE_2D,Et,ct,K,lt,0,yt,O,null),K>>=1,lt>>=1}}else if(zt.length>0){if(Vt&&Bt){const K=Ft(zt[0]);e.texStorage2D(n.TEXTURE_2D,Mt,ct,K.width,K.height)}for(let K=0,lt=zt.length;K<lt;K++)pt=zt[K],Vt?z&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,yt,O,pt):e.texImage2D(n.TEXTURE_2D,K,ct,yt,O,pt);w.generateMipmaps=!1}else if(Vt){if(Bt){const K=Ft(ot);e.texStorage2D(n.TEXTURE_2D,Mt,ct,K.width,K.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,yt,O,ot)}else e.texImage2D(n.TEXTURE_2D,0,ct,yt,O,ot);g(w)&&p(rt),Lt.__version=at.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function J(L,w,Y){if(w.image.length!==6)return;const rt=ut(L,w),dt=w.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+Y);const at=i.get(dt);if(dt.version!==at.__version||rt===!0){e.activeTexture(n.TEXTURE0+Y);const Lt=me.getPrimaries(me.workingColorSpace),Z=w.colorSpace===ci?null:me.getPrimaries(w.colorSpace),mt=w.colorSpace===ci||Lt===Z?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);const Kt=w.isCompressedTexture||w.image[0].isCompressedTexture,ot=w.image[0]&&w.image[0].isDataTexture,yt=[];for(let lt=0;lt<6;lt++)!Kt&&!ot?yt[lt]=v(w.image[lt],!0,s.maxCubemapSize):yt[lt]=ot?w.image[lt].image:w.image[lt],yt[lt]=wt(w,yt[lt]);const O=yt[0],ct=a.convert(w.format,w.colorSpace),pt=a.convert(w.type),zt=x(w.internalFormat,ct,pt,w.colorSpace),Vt=w.isVideoTexture!==!0,Bt=at.__version===void 0||rt===!0,z=dt.dataReady;let Mt=R(w,O);ht(n.TEXTURE_CUBE_MAP,w);let K;if(Kt){Vt&&Bt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Mt,zt,O.width,O.height);for(let lt=0;lt<6;lt++){K=yt[lt].mipmaps;for(let Et=0;Et<K.length;Et++){const St=K[Et];w.format!==Cn?ct!==null?Vt?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et,0,0,St.width,St.height,ct,St.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et,zt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et,0,0,St.width,St.height,ct,pt,St.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et,zt,St.width,St.height,0,ct,pt,St.data)}}}else{if(K=w.mipmaps,Vt&&Bt){K.length>0&&Mt++;const lt=Ft(yt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Mt,zt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(ot){Vt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,yt[lt].width,yt[lt].height,ct,pt,yt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,zt,yt[lt].width,yt[lt].height,0,ct,pt,yt[lt].data);for(let Et=0;Et<K.length;Et++){const Zt=K[Et].image[lt].image;Vt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et+1,0,0,Zt.width,Zt.height,ct,pt,Zt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et+1,zt,Zt.width,Zt.height,0,ct,pt,Zt.data)}}else{Vt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,ct,pt,yt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,zt,ct,pt,yt[lt]);for(let Et=0;Et<K.length;Et++){const St=K[Et];Vt?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et+1,0,0,ct,pt,St.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Et+1,zt,ct,pt,St.image[lt])}}}g(w)&&p(n.TEXTURE_CUBE_MAP),at.__version=dt.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function xt(L,w,Y,rt,dt,at){const Lt=a.convert(Y.format,Y.colorSpace),Z=a.convert(Y.type),mt=x(Y.internalFormat,Lt,Z,Y.colorSpace),Kt=i.get(w),ot=i.get(Y);if(ot.__renderTarget=w,!Kt.__hasExternalTextures){const yt=Math.max(1,w.width>>at),O=Math.max(1,w.height>>at);dt===n.TEXTURE_3D||dt===n.TEXTURE_2D_ARRAY?e.texImage3D(dt,at,mt,yt,O,w.depth,0,Lt,Z,null):e.texImage2D(dt,at,mt,yt,O,0,Lt,Z,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),kt(w)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,rt,dt,ot.__webglTexture,0,Ot(w)):(dt===n.TEXTURE_2D||dt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,rt,dt,ot.__webglTexture,at),e.bindFramebuffer(n.FRAMEBUFFER,null)}function tt(L,w,Y){if(n.bindRenderbuffer(n.RENDERBUFFER,L),w.depthBuffer){const rt=w.depthTexture,dt=rt&&rt.isDepthTexture?rt.type:null,at=y(w.stencilBuffer,dt),Lt=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=Ot(w);kt(w)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Z,at,w.width,w.height):Y?n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,at,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,at,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Lt,n.RENDERBUFFER,L)}else{const rt=w.textures;for(let dt=0;dt<rt.length;dt++){const at=rt[dt],Lt=a.convert(at.format,at.colorSpace),Z=a.convert(at.type),mt=x(at.internalFormat,Lt,Z,at.colorSpace),Kt=Ot(w);Y&&kt(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Kt,mt,w.width,w.height):kt(w)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Kt,mt,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,mt,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function At(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const rt=i.get(w.depthTexture);rt.__renderTarget=w,(!rt.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),D(w.depthTexture,0);const dt=rt.__webglTexture,at=Ot(w);if(w.depthTexture.format===ps)kt(w)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0);else if(w.depthTexture.format===Ss)kt(w)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function Ut(L){const w=i.get(L),Y=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const rt=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),rt){const dt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,rt.removeEventListener("dispose",dt)};rt.addEventListener("dispose",dt),w.__depthDisposeCallback=dt}w.__boundDepthTexture=rt}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");At(w.__webglFramebuffer,L)}else if(Y){w.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[rt]),w.__webglDepthbuffer[rt]===void 0)w.__webglDepthbuffer[rt]=n.createRenderbuffer(),tt(w.__webglDepthbuffer[rt],L,!1);else{const dt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=w.__webglDepthbuffer[rt];n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,dt,n.RENDERBUFFER,at)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),tt(w.__webglDepthbuffer,L,!1);else{const rt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,dt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function vt(L,w,Y){const rt=i.get(L);w!==void 0&&xt(rt.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Y!==void 0&&Ut(L)}function Yt(L){const w=L.texture,Y=i.get(L),rt=i.get(w);L.addEventListener("dispose",S);const dt=L.textures,at=L.isWebGLCubeRenderTarget===!0,Lt=dt.length>1;if(Lt||(rt.__webglTexture===void 0&&(rt.__webglTexture=n.createTexture()),rt.__version=w.version,o.memory.textures++),at){Y.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(w.mipmaps&&w.mipmaps.length>0){Y.__webglFramebuffer[Z]=[];for(let mt=0;mt<w.mipmaps.length;mt++)Y.__webglFramebuffer[Z][mt]=n.createFramebuffer()}else Y.__webglFramebuffer[Z]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Z=0;Z<w.mipmaps.length;Z++)Y.__webglFramebuffer[Z]=n.createFramebuffer()}else Y.__webglFramebuffer=n.createFramebuffer();if(Lt)for(let Z=0,mt=dt.length;Z<mt;Z++){const Kt=i.get(dt[Z]);Kt.__webglTexture===void 0&&(Kt.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&kt(L)===!1){Y.__webglMultisampledFramebuffer=n.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Z=0;Z<dt.length;Z++){const mt=dt[Z];Y.__webglColorRenderbuffer[Z]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Y.__webglColorRenderbuffer[Z]);const Kt=a.convert(mt.format,mt.colorSpace),ot=a.convert(mt.type),yt=x(mt.internalFormat,Kt,ot,mt.colorSpace,L.isXRRenderTarget===!0),O=Ot(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,yt,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Z,n.RENDERBUFFER,Y.__webglColorRenderbuffer[Z])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(Y.__webglDepthRenderbuffer=n.createRenderbuffer(),tt(Y.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,rt.__webglTexture),ht(n.TEXTURE_CUBE_MAP,w);for(let Z=0;Z<6;Z++)if(w.mipmaps&&w.mipmaps.length>0)for(let mt=0;mt<w.mipmaps.length;mt++)xt(Y.__webglFramebuffer[Z][mt],L,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,mt);else xt(Y.__webglFramebuffer[Z],L,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(w)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Lt){for(let Z=0,mt=dt.length;Z<mt;Z++){const Kt=dt[Z],ot=i.get(Kt);e.bindTexture(n.TEXTURE_2D,ot.__webglTexture),ht(n.TEXTURE_2D,Kt),xt(Y.__webglFramebuffer,L,Kt,n.COLOR_ATTACHMENT0+Z,n.TEXTURE_2D,0),g(Kt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Z=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Z=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Z,rt.__webglTexture),ht(Z,w),w.mipmaps&&w.mipmaps.length>0)for(let mt=0;mt<w.mipmaps.length;mt++)xt(Y.__webglFramebuffer[mt],L,w,n.COLOR_ATTACHMENT0,Z,mt);else xt(Y.__webglFramebuffer,L,w,n.COLOR_ATTACHMENT0,Z,0);g(w)&&p(Z),e.unbindTexture()}L.depthBuffer&&Ut(L)}function _t(L){const w=L.textures;for(let Y=0,rt=w.length;Y<rt;Y++){const dt=w[Y];if(g(dt)){const at=_(L),Lt=i.get(dt).__webglTexture;e.bindTexture(at,Lt),p(at),e.unbindTexture()}}}const Wt=[],G=[];function le(L){if(L.samples>0){if(kt(L)===!1){const w=L.textures,Y=L.width,rt=L.height;let dt=n.COLOR_BUFFER_BIT;const at=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Lt=i.get(L),Z=w.length>1;if(Z)for(let mt=0;mt<w.length;mt++)e.bindFramebuffer(n.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+mt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+mt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let mt=0;mt<w.length;mt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(dt|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(dt|=n.STENCIL_BUFFER_BIT)),Z){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Lt.__webglColorRenderbuffer[mt]);const Kt=i.get(w[mt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Kt,0)}n.blitFramebuffer(0,0,Y,rt,0,0,Y,rt,dt,n.NEAREST),l===!0&&(Wt.length=0,G.length=0,Wt.push(n.COLOR_ATTACHMENT0+mt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Wt.push(at),G.push(at),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,G)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Wt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Z)for(let mt=0;mt<w.length;mt++){e.bindFramebuffer(n.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+mt,n.RENDERBUFFER,Lt.__webglColorRenderbuffer[mt]);const Kt=i.get(w[mt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Lt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+mt,n.TEXTURE_2D,Kt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const w=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function Ot(L){return Math.min(s.maxSamples,L.samples)}function kt(L){const w=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function bt(L){const w=o.render.frame;h.get(L)!==w&&(h.set(L,w),L.update())}function wt(L,w){const Y=L.colorSpace,rt=L.format,dt=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Y!==Es&&Y!==ci&&(me.getTransfer(Y)===Se?(rt!==Cn||dt!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),w}function Ft(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=I,this.setTexture2D=D,this.setTexture2DArray=C,this.setTexture3D=U,this.setTextureCube=B,this.rebindTextures=vt,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=le,this.setupDepthRenderbuffer=Ut,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=kt}function TM(n,t){function e(i,s=ci){let a;const o=me.getTransfer(s);if(i===Qn)return n.UNSIGNED_BYTE;if(i===Jc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Qc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ou)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===su)return n.BYTE;if(i===au)return n.SHORT;if(i===Ks)return n.UNSIGNED_SHORT;if(i===Kc)return n.INT;if(i===Ui)return n.UNSIGNED_INT;if(i===jn)return n.FLOAT;if(i===aa)return n.HALF_FLOAT;if(i===ru)return n.ALPHA;if(i===cu)return n.RGB;if(i===Cn)return n.RGBA;if(i===lu)return n.LUMINANCE;if(i===hu)return n.LUMINANCE_ALPHA;if(i===ps)return n.DEPTH_COMPONENT;if(i===Ss)return n.DEPTH_STENCIL;if(i===du)return n.RED;if(i===tl)return n.RED_INTEGER;if(i===uu)return n.RG;if(i===el)return n.RG_INTEGER;if(i===nl)return n.RGBA_INTEGER;if(i===qa||i===ja||i===Ka||i===Ja)if(o===Se)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===qa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ja)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ka)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ja)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===qa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ja)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ka)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ja)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sc||i===ac||i===oc||i===rc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===sc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ac)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===oc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===rc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cc||i===lc||i===hc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===cc||i===lc)return o===Se?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===hc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===dc||i===uc||i===fc||i===pc||i===mc||i===gc||i===xc||i===vc||i===_c||i===yc||i===Mc||i===Sc||i===bc||i===Ec)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===dc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===uc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===fc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===xc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_c)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===yc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Mc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===bc)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ec)return o===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Qa||i===wc||i===Tc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Qa)return o===Se?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fu||i===Ac||i===Rc||i===Cc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Qa)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Ac)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Rc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Cc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class AM extends _n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class be extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const RM={type:"move"};class yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new be,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new be,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new be,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,a=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const g=e.getJointPose(v,i),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(RM)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new be;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const CM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,PM=`
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

}`;class DM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const s=new an,a=t.properties.get(s);a.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new mi({vertexShader:CM,fragmentShader:PM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new vn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class LM extends ws{constructor(t,e){super();const i=this;let s=null,a=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const v=new DM,g=e.getContextAttributes();let p=null,_=null;const x=[],y=[],R=new Gt;let E=null;const S=new _n;S.viewport=new Fe;const T=new _n;T.viewport=new Fe;const b=[S,T],M=new AM;let P=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let J=x[j];return J===void 0&&(J=new yr,x[j]=J),J.getTargetRaySpace()},this.getControllerGrip=function(j){let J=x[j];return J===void 0&&(J=new yr,x[j]=J),J.getGripSpace()},this.getHand=function(j){let J=x[j];return J===void 0&&(J=new yr,x[j]=J),J.getHandSpace()};function k(j){const J=y.indexOf(j.inputSource);if(J===-1)return;const xt=x[J];xt!==void 0&&(xt.update(j.inputSource,j.frame,c||o),xt.dispatchEvent({type:j.type,data:j.inputSource}))}function F(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",D);for(let j=0;j<x.length;j++){const J=y[j];J!==null&&(y[j]=null,x[j].disconnect(J))}P=null,I=null,v.reset(),t.setRenderTarget(p),u=null,d=null,f=null,s=null,_=null,ut.stop(),i.isPresenting=!1,t.setPixelRatio(E),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){a=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){r=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",F),s.addEventListener("inputsourceschange",D),g.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(R),s.renderState.layers===void 0){const J={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),_=new zi(u.framebufferWidth,u.framebufferHeight,{format:Cn,type:Qn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let J=null,xt=null,tt=null;g.depth&&(tt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=g.stencil?Ss:ps,xt=g.stencil?Ms:Ui);const At={colorFormat:e.RGBA8,depthFormat:tt,scaleFactor:a};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(At),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new zi(d.textureWidth,d.textureHeight,{format:Cn,type:Qn,depthTexture:new Au(d.textureWidth,d.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(r),ut.setContext(s),ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function D(j){for(let J=0;J<j.removed.length;J++){const xt=j.removed[J],tt=y.indexOf(xt);tt>=0&&(y[tt]=null,x[tt].disconnect(xt))}for(let J=0;J<j.added.length;J++){const xt=j.added[J];let tt=y.indexOf(xt);if(tt===-1){for(let Ut=0;Ut<x.length;Ut++)if(Ut>=y.length){y.push(xt),tt=Ut;break}else if(y[Ut]===null){y[Ut]=xt,tt=Ut;break}if(tt===-1)break}const At=x[tt];At&&At.connect(xt)}}const C=new H,U=new H;function B(j,J,xt){C.setFromMatrixPosition(J.matrixWorld),U.setFromMatrixPosition(xt.matrixWorld);const tt=C.distanceTo(U),At=J.projectionMatrix.elements,Ut=xt.projectionMatrix.elements,vt=At[14]/(At[10]-1),Yt=At[14]/(At[10]+1),_t=(At[9]+1)/At[5],Wt=(At[9]-1)/At[5],G=(At[8]-1)/At[0],le=(Ut[8]+1)/Ut[0],Ot=vt*G,kt=vt*le,bt=tt/(-G+le),wt=bt*-G;if(J.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(wt),j.translateZ(bt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),At[10]===-1)j.projectionMatrix.copy(J.projectionMatrix),j.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Ft=vt+bt,L=Yt+bt,w=Ot-wt,Y=kt+(tt-wt),rt=_t*Yt/L*Ft,dt=Wt*Yt/L*Ft;j.projectionMatrix.makePerspective(w,Y,rt,dt,Ft,L),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function W(j,J){J===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(J.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let J=j.near,xt=j.far;v.texture!==null&&(v.depthNear>0&&(J=v.depthNear),v.depthFar>0&&(xt=v.depthFar)),M.near=T.near=S.near=J,M.far=T.far=S.far=xt,(P!==M.near||I!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,I=M.far),S.layers.mask=j.layers.mask|2,T.layers.mask=j.layers.mask|4,M.layers.mask=S.layers.mask|T.layers.mask;const tt=j.parent,At=M.cameras;W(M,tt);for(let Ut=0;Ut<At.length;Ut++)W(At[Ut],tt);At.length===2?B(M,S,T):M.projectionMatrix.copy(S.projectionMatrix),et(j,M,tt)};function et(j,J,xt){xt===null?j.matrix.copy(J.matrixWorld):(j.matrix.copy(xt.matrixWorld),j.matrix.invert(),j.matrix.multiply(J.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(J.projectionMatrix),j.projectionMatrixInverse.copy(J.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Js*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let gt=null;function ht(j,J){if(h=J.getViewerPose(c||o),m=J,h!==null){const xt=h.views;u!==null&&(t.setRenderTargetFramebuffer(_,u.framebuffer),t.setRenderTarget(_));let tt=!1;xt.length!==M.cameras.length&&(M.cameras.length=0,tt=!0);for(let Ut=0;Ut<xt.length;Ut++){const vt=xt[Ut];let Yt=null;if(u!==null)Yt=u.getViewport(vt);else{const Wt=f.getViewSubImage(d,vt);Yt=Wt.viewport,Ut===0&&(t.setRenderTargetTextures(_,Wt.colorTexture,d.ignoreDepthValues?void 0:Wt.depthStencilTexture),t.setRenderTarget(_))}let _t=b[Ut];_t===void 0&&(_t=new _n,_t.layers.enable(Ut),_t.viewport=new Fe,b[Ut]=_t),_t.matrix.fromArray(vt.transform.matrix),_t.matrix.decompose(_t.position,_t.quaternion,_t.scale),_t.projectionMatrix.fromArray(vt.projectionMatrix),_t.projectionMatrixInverse.copy(_t.projectionMatrix).invert(),_t.viewport.set(Yt.x,Yt.y,Yt.width,Yt.height),Ut===0&&(M.matrix.copy(_t.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),tt===!0&&M.cameras.push(_t)}const At=s.enabledFeatures;if(At&&At.includes("depth-sensing")){const Ut=f.getDepthInformation(xt[0]);Ut&&Ut.isValid&&Ut.texture&&v.init(t,Ut,s.renderState)}}for(let xt=0;xt<x.length;xt++){const tt=y[xt],At=x[xt];tt!==null&&At!==void 0&&At.update(tt,J,c||o)}gt&&gt(j,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),m=null}const ut=new wu;ut.setAnimationLoop(ht),this.setAnimationLoop=function(j){gt=j},this.dispose=function(){}}}const bi=new Hn,kM=new Te;function IM(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Su(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(g,p):p.isMeshToonMaterial?(a(g,p),f(g,p)):p.isMeshPhongMaterial?(a(g,p),h(g,p)):p.isMeshStandardMaterial?(a(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,y)):p.isMeshMatcapMaterial?(a(g,p),m(g,p)):p.isMeshDepthMaterial?a(g,p):p.isMeshDistanceMaterial?(a(g,p),v(g,p)):p.isMeshNormalMaterial?a(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,_,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===cn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===cn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const _=t.get(p),x=_.envMap,y=_.envMapRotation;x&&(g.envMap.value=x,bi.copy(y),bi.x*=-1,bi.y*=-1,bi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(bi.y*=-1,bi.z*=-1),g.envMapRotation.value.setFromMatrix4(kM.makeRotationFromEuler(bi)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===cn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const _=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function FM(n,t,e,i){let s={},a={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,x){const y=x.program;i.uniformBlockBinding(_,y)}function c(_,x){let y=s[_.id];y===void 0&&(m(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",g));const R=x.program;i.updateUBOMapping(_,R);const E=t.render.frame;a[_.id]!==E&&(d(_),a[_.id]=E)}function h(_){const x=f();_.__bindingPointIndex=x;const y=n.createBuffer(),R=_.__size,E=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,R,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function f(){for(let _=0;_<r;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=s[_.id],y=_.uniforms,R=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,S=y.length;E<S;E++){const T=Array.isArray(y[E])?y[E]:[y[E]];for(let b=0,M=T.length;b<M;b++){const P=T[b];if(u(P,E,b,R)===!0){const I=P.__offset,k=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let D=0;D<k.length;D++){const C=k[D],U=v(C);typeof C=="number"||typeof C=="boolean"?(P.__data[0]=C,n.bufferSubData(n.UNIFORM_BUFFER,I+F,P.__data)):C.isMatrix3?(P.__data[0]=C.elements[0],P.__data[1]=C.elements[1],P.__data[2]=C.elements[2],P.__data[3]=0,P.__data[4]=C.elements[3],P.__data[5]=C.elements[4],P.__data[6]=C.elements[5],P.__data[7]=0,P.__data[8]=C.elements[6],P.__data[9]=C.elements[7],P.__data[10]=C.elements[8],P.__data[11]=0):(C.toArray(P.__data,F),F+=U.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(_,x,y,R){const E=_.value,S=x+"_"+y;if(R[S]===void 0)return typeof E=="number"||typeof E=="boolean"?R[S]=E:R[S]=E.clone(),!0;{const T=R[S];if(typeof E=="number"||typeof E=="boolean"){if(T!==E)return R[S]=E,!0}else if(T.equals(E)===!1)return T.copy(E),!0}return!1}function m(_){const x=_.uniforms;let y=0;const R=16;for(let S=0,T=x.length;S<T;S++){const b=Array.isArray(x[S])?x[S]:[x[S]];for(let M=0,P=b.length;M<P;M++){const I=b[M],k=Array.isArray(I.value)?I.value:[I.value];for(let F=0,D=k.length;F<D;F++){const C=k[F],U=v(C),B=y%R,W=B%U.boundary,et=B+W;y+=W,et!==0&&R-et<U.storage&&(y+=R-et),I.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=U.storage}}}const E=y%R;return E>0&&(y+=R-E),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){const x=_.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete a[x.id]}function p(){for(const _ in s)n.deleteBuffer(s[_]);o=[],s={},a={}}return{bind:l,update:c,dispose:p}}class UM{constructor(t={}){const{canvas:e=Eg(),context:i=null,depth:s=!0,stencil:a=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const _=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=fi,this.toneMappingExposure=1;const y=this;let R=!1,E=0,S=0,T=null,b=-1,M=null;const P=new Fe,I=new Fe;let k=null;const F=new ee(0);let D=0,C=e.width,U=e.height,B=1,W=null,et=null;const gt=new Fe(0,0,C,U),ht=new Fe(0,0,C,U);let ut=!1;const j=new ol;let J=!1,xt=!1;const tt=new Te,At=new Te,Ut=new H,vt=new Fe,Yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Wt(){return T===null?B:1}let G=i;function le(A,V){return e.getContext(A,V)}try{const A={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${qc}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",Et,!1),e.addEventListener("webglcontextcreationerror",St,!1),G===null){const V="webgl2";if(G=le(V,A),G===null)throw le(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Ot,kt,bt,wt,Ft,L,w,Y,rt,dt,at,Lt,Z,mt,Kt,ot,yt,O,ct,pt,zt,Vt,Bt,z;function Mt(){Ot=new H_(G),Ot.init(),Vt=new TM(G,Ot),kt=new F_(G,Ot,t,Vt),bt=new bM(G,Ot),kt.reverseDepthBuffer&&d&&bt.buffers.depth.setReversed(!0),wt=new X_(G),Ft=new cM,L=new wM(G,Ot,bt,Ft,kt,Vt,wt),w=new z_(y),Y=new B_(y),rt=new Kg(G),Bt=new k_(G,rt),dt=new G_(G,rt,wt,Bt),at=new $_(G,dt,rt,wt),ct=new W_(G,kt,L),ot=new U_(Ft),Lt=new rM(y,w,Y,Ot,kt,Bt,ot),Z=new IM(y,Ft),mt=new hM,Kt=new gM(Ot),O=new L_(y,w,Y,bt,at,u,l),yt=new MM(y,at,kt),z=new FM(G,wt,kt,bt),pt=new I_(G,Ot,wt),zt=new V_(G,Ot,wt),wt.programs=Lt.programs,y.capabilities=kt,y.extensions=Ot,y.properties=Ft,y.renderLists=mt,y.shadowMap=yt,y.state=bt,y.info=wt}Mt();const K=new LM(y,G);this.xr=K,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=Ot.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Ot.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(A){A!==void 0&&(B=A,this.setSize(C,U,!1))},this.getSize=function(A){return A.set(C,U)},this.setSize=function(A,V,nt=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=A,U=V,e.width=Math.floor(A*B),e.height=Math.floor(V*B),nt===!0&&(e.style.width=A+"px",e.style.height=V+"px"),this.setViewport(0,0,A,V)},this.getDrawingBufferSize=function(A){return A.set(C*B,U*B).floor()},this.setDrawingBufferSize=function(A,V,nt){C=A,U=V,B=nt,e.width=Math.floor(A*nt),e.height=Math.floor(V*nt),this.setViewport(0,0,A,V)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(gt)},this.setViewport=function(A,V,nt,Q){A.isVector4?gt.set(A.x,A.y,A.z,A.w):gt.set(A,V,nt,Q),bt.viewport(P.copy(gt).multiplyScalar(B).round())},this.getScissor=function(A){return A.copy(ht)},this.setScissor=function(A,V,nt,Q){A.isVector4?ht.set(A.x,A.y,A.z,A.w):ht.set(A,V,nt,Q),bt.scissor(I.copy(ht).multiplyScalar(B).round())},this.getScissorTest=function(){return ut},this.setScissorTest=function(A){bt.setScissorTest(ut=A)},this.setOpaqueSort=function(A){W=A},this.setTransparentSort=function(A){et=A},this.getClearColor=function(A){return A.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(A=!0,V=!0,nt=!0){let Q=0;if(A){let $=!1;if(T!==null){const Tt=T.texture.format;$=Tt===nl||Tt===el||Tt===tl}if($){const Tt=T.texture.type,It=Tt===Qn||Tt===Ui||Tt===Ks||Tt===Ms||Tt===Jc||Tt===Qc,$t=O.getClearColor(),Xt=O.getClearAlpha(),Ht=$t.r,N=$t.g,X=$t.b;It?(m[0]=Ht,m[1]=N,m[2]=X,m[3]=Xt,G.clearBufferuiv(G.COLOR,0,m)):(v[0]=Ht,v[1]=N,v[2]=X,v[3]=Xt,G.clearBufferiv(G.COLOR,0,v))}else Q|=G.COLOR_BUFFER_BIT}V&&(Q|=G.DEPTH_BUFFER_BIT),nt&&(Q|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",Et,!1),e.removeEventListener("webglcontextcreationerror",St,!1),mt.dispose(),Kt.dispose(),Ft.dispose(),w.dispose(),Y.dispose(),at.dispose(),Bt.dispose(),z.dispose(),Lt.dispose(),K.dispose(),K.removeEventListener("sessionstart",Ye),K.removeEventListener("sessionend",Ze),Ae.stop()};function lt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Et(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=wt.autoReset,V=yt.enabled,nt=yt.autoUpdate,Q=yt.needsUpdate,$=yt.type;Mt(),wt.autoReset=A,yt.enabled=V,yt.autoUpdate=nt,yt.needsUpdate=Q,yt.type=$}function St(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Zt(A){const V=A.target;V.removeEventListener("dispose",Zt),ne(V)}function ne(A){se(A),Ft.remove(A)}function se(A){const V=Ft.get(A).programs;V!==void 0&&(V.forEach(function(nt){Lt.releaseProgram(nt)}),A.isShaderMaterial&&Lt.releaseShaderCache(A))}this.renderBufferDirect=function(A,V,nt,Q,$,Tt){V===null&&(V=Yt);const It=$.isMesh&&$.matrixWorld.determinant()<0,$t=oe(A,V,nt,Q,$);bt.setMaterial(Q,It);let Xt=nt.index,Ht=1;if(Q.wireframe===!0){if(Xt=dt.getWireframeAttribute(nt),Xt===void 0)return;Ht=2}const N=nt.drawRange,X=nt.attributes.position;let ft=N.start*Ht,it=(N.start+N.count)*Ht;Tt!==null&&(ft=Math.max(ft,Tt.start*Ht),it=Math.min(it,(Tt.start+Tt.count)*Ht)),Xt!==null?(ft=Math.max(ft,0),it=Math.min(it,Xt.count)):X!=null&&(ft=Math.max(ft,0),it=Math.min(it,X.count));const st=it-ft;if(st<0||st===1/0)return;Bt.setup($,Q,$t,nt,Xt);let Rt,qt=pt;if(Xt!==null&&(Rt=rt.get(Xt),qt=zt,qt.setIndex(Rt)),$.isMesh)Q.wireframe===!0?(bt.setLineWidth(Q.wireframeLinewidth*Wt()),qt.setMode(G.LINES)):qt.setMode(G.TRIANGLES);else if($.isLine){let Pt=Q.linewidth;Pt===void 0&&(Pt=1),bt.setLineWidth(Pt*Wt()),$.isLineSegments?qt.setMode(G.LINES):$.isLineLoop?qt.setMode(G.LINE_LOOP):qt.setMode(G.LINE_STRIP)}else $.isPoints?qt.setMode(G.POINTS):$.isSprite&&qt.setMode(G.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)qt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(Ot.get("WEBGL_multi_draw"))qt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Pt=$._multiDrawStarts,he=$._multiDrawCounts,Qt=$._multiDrawCount,ie=Xt?rt.get(Xt).bytesPerElement:1,we=Ft.get(Q).currentProgram.getUniforms();for(let ye=0;ye<Qt;ye++)we.setValue(G,"_gl_DrawID",ye),qt.render(Pt[ye]/ie,he[ye])}else if($.isInstancedMesh)qt.renderInstances(ft,st,$.count);else if(nt.isInstancedBufferGeometry){const Pt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,he=Math.min(nt.instanceCount,Pt);qt.renderInstances(ft,st,he)}else qt.render(ft,st)};function te(A,V,nt){A.transparent===!0&&A.side===Ce&&A.forceSinglePass===!1?(A.side=cn,A.needsUpdate=!0,Jt(A,V,nt),A.side=pi,A.needsUpdate=!0,Jt(A,V,nt),A.side=Ce):Jt(A,V,nt)}this.compile=function(A,V,nt=null){nt===null&&(nt=A),p=Kt.get(nt),p.init(V),x.push(p),nt.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),A!==nt&&A.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const Q=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Tt=$.material;if(Tt)if(Array.isArray(Tt))for(let It=0;It<Tt.length;It++){const $t=Tt[It];te($t,nt,$),Q.add($t)}else te(Tt,nt,$),Q.add(Tt)}),x.pop(),p=null,Q},this.compileAsync=function(A,V,nt=null){const Q=this.compile(A,V,nt);return new Promise($=>{function Tt(){if(Q.forEach(function(It){Ft.get(It).currentProgram.isReady()&&Q.delete(It)}),Q.size===0){$(A);return}setTimeout(Tt,10)}Ot.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let ge=null;function pe(A){ge&&ge(A)}function Ye(){Ae.stop()}function Ze(){Ae.start()}const Ae=new wu;Ae.setAnimationLoop(pe),typeof self<"u"&&Ae.setContext(self),this.setAnimationLoop=function(A){ge=A,K.setAnimationLoop(A),A===null?Ae.stop():Ae.start()},K.addEventListener("sessionstart",Ye),K.addEventListener("sessionend",Ze),this.render=function(A,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(V),V=K.getCamera()),A.isScene===!0&&A.onBeforeRender(y,A,V,T),p=Kt.get(A,x.length),p.init(V),x.push(p),At.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),j.setFromProjectionMatrix(At),xt=this.localClippingEnabled,J=ot.init(this.clippingPlanes,xt),g=mt.get(A,_.length),g.init(),_.push(g),K.enabled===!0&&K.isPresenting===!0){const Tt=y.xr.getDepthSensingMesh();Tt!==null&&Ee(Tt,V,-1/0,y.sortObjects)}Ee(A,V,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(W,et),_t=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,_t&&O.addToRenderList(g,A),this.info.render.frame++,J===!0&&ot.beginShadows();const nt=p.state.shadowsArray;yt.render(nt,A,V),J===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=g.opaque,$=g.transmissive;if(p.setupLights(),V.isArrayCamera){const Tt=V.cameras;if($.length>0)for(let It=0,$t=Tt.length;It<$t;It++){const Xt=Tt[It];q(Q,$,A,Xt)}_t&&O.render(A);for(let It=0,$t=Tt.length;It<$t;It++){const Xt=Tt[It];Le(g,A,Xt,Xt.viewport)}}else $.length>0&&q(Q,$,A,V),_t&&O.render(A),Le(g,A,V);T!==null&&(L.updateMultisampleRenderTarget(T),L.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(y,A,V),Bt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],J===!0&&ot.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Ee(A,V,nt,Q){if(A.visible===!1)return;if(A.layers.test(V.layers)){if(A.isGroup)nt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(V);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||j.intersectsSprite(A)){Q&&vt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(At);const It=at.update(A),$t=A.material;$t.visible&&g.push(A,It,$t,nt,vt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||j.intersectsObject(A))){const It=at.update(A),$t=A.material;if(Q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),vt.copy(A.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),vt.copy(It.boundingSphere.center)),vt.applyMatrix4(A.matrixWorld).applyMatrix4(At)),Array.isArray($t)){const Xt=It.groups;for(let Ht=0,N=Xt.length;Ht<N;Ht++){const X=Xt[Ht],ft=$t[X.materialIndex];ft&&ft.visible&&g.push(A,It,ft,nt,vt.z,X)}}else $t.visible&&g.push(A,It,$t,nt,vt.z,null)}}const Tt=A.children;for(let It=0,$t=Tt.length;It<$t;It++)Ee(Tt[It],V,nt,Q)}function Le(A,V,nt,Q){const $=A.opaque,Tt=A.transmissive,It=A.transparent;p.setupLightsView(nt),J===!0&&ot.setGlobalState(y.clippingPlanes,nt),Q&&bt.viewport(P.copy(Q)),$.length>0&&Dt($,V,nt),Tt.length>0&&Dt(Tt,V,nt),It.length>0&&Dt(It,V,nt),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function q(A,V,nt,Q){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new zi(1,1,{generateMipmaps:!0,type:Ot.has("EXT_color_buffer_half_float")||Ot.has("EXT_color_buffer_float")?aa:Qn,minFilter:ki,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const Tt=p.state.transmissionRenderTarget[Q.id],It=Q.viewport||P;Tt.setSize(It.z,It.w);const $t=y.getRenderTarget();y.setRenderTarget(Tt),y.getClearColor(F),D=y.getClearAlpha(),D<1&&y.setClearColor(16777215,.5),y.clear(),_t&&O.render(nt);const Xt=y.toneMapping;y.toneMapping=fi;const Ht=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),J===!0&&ot.setGlobalState(y.clippingPlanes,Q),Dt(A,nt,Q),L.updateMultisampleRenderTarget(Tt),L.updateRenderTargetMipmap(Tt),Ot.has("WEBGL_multisampled_render_to_texture")===!1){let N=!1;for(let X=0,ft=V.length;X<ft;X++){const it=V[X],st=it.object,Rt=it.geometry,qt=it.material,Pt=it.group;if(qt.side===Ce&&st.layers.test(Q.layers)){const he=qt.side;qt.side=cn,qt.needsUpdate=!0,Ct(st,nt,Q,Rt,qt,Pt),qt.side=he,qt.needsUpdate=!0,N=!0}}N===!0&&(L.updateMultisampleRenderTarget(Tt),L.updateRenderTargetMipmap(Tt))}y.setRenderTarget($t),y.setClearColor(F,D),Ht!==void 0&&(Q.viewport=Ht),y.toneMapping=Xt}function Dt(A,V,nt){const Q=V.isScene===!0?V.overrideMaterial:null;for(let $=0,Tt=A.length;$<Tt;$++){const It=A[$],$t=It.object,Xt=It.geometry,Ht=Q===null?It.material:Q,N=It.group;$t.layers.test(nt.layers)&&Ct($t,V,nt,Xt,Ht,N)}}function Ct(A,V,nt,Q,$,Tt){A.onBeforeRender(y,V,nt,Q,$,Tt),A.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(y,V,nt,Q,A,Tt),$.transparent===!0&&$.side===Ce&&$.forceSinglePass===!1?($.side=cn,$.needsUpdate=!0,y.renderBufferDirect(nt,V,Q,$,A,Tt),$.side=pi,$.needsUpdate=!0,y.renderBufferDirect(nt,V,Q,$,A,Tt),$.side=Ce):y.renderBufferDirect(nt,V,Q,$,A,Tt),A.onAfterRender(y,V,nt,Q,$,Tt)}function Jt(A,V,nt){V.isScene!==!0&&(V=Yt);const Q=Ft.get(A),$=p.state.lights,Tt=p.state.shadowsArray,It=$.state.version,$t=Lt.getParameters(A,$.state,Tt,V,nt),Xt=Lt.getProgramCacheKey($t);let Ht=Q.programs;Q.environment=A.isMeshStandardMaterial?V.environment:null,Q.fog=V.fog,Q.envMap=(A.isMeshStandardMaterial?Y:w).get(A.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&A.envMap===null?V.environmentRotation:A.envMapRotation,Ht===void 0&&(A.addEventListener("dispose",Zt),Ht=new Map,Q.programs=Ht);let N=Ht.get(Xt);if(N!==void 0){if(Q.currentProgram===N&&Q.lightsStateVersion===It)return ae(A,$t),N}else $t.uniforms=Lt.getUniforms(A),A.onBeforeCompile($t,y),N=Lt.acquireProgram($t,Xt),Ht.set(Xt,N),Q.uniforms=$t.uniforms;const X=Q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(X.clippingPlanes=ot.uniform),ae(A,$t),Q.needsLights=Ne(A),Q.lightsStateVersion=It,Q.needsLights&&(X.ambientLightColor.value=$.state.ambient,X.lightProbe.value=$.state.probe,X.directionalLights.value=$.state.directional,X.directionalLightShadows.value=$.state.directionalShadow,X.spotLights.value=$.state.spot,X.spotLightShadows.value=$.state.spotShadow,X.rectAreaLights.value=$.state.rectArea,X.ltc_1.value=$.state.rectAreaLTC1,X.ltc_2.value=$.state.rectAreaLTC2,X.pointLights.value=$.state.point,X.pointLightShadows.value=$.state.pointShadow,X.hemisphereLights.value=$.state.hemi,X.directionalShadowMap.value=$.state.directionalShadowMap,X.directionalShadowMatrix.value=$.state.directionalShadowMatrix,X.spotShadowMap.value=$.state.spotShadowMap,X.spotLightMatrix.value=$.state.spotLightMatrix,X.spotLightMap.value=$.state.spotLightMap,X.pointShadowMap.value=$.state.pointShadowMap,X.pointShadowMatrix.value=$.state.pointShadowMatrix),Q.currentProgram=N,Q.uniformsList=null,N}function jt(A){if(A.uniformsList===null){const V=A.currentProgram.getUniforms();A.uniformsList=to.seqWithValue(V.seq,A.uniforms)}return A.uniformsList}function ae(A,V){const nt=Ft.get(A);nt.outputColorSpace=V.outputColorSpace,nt.batching=V.batching,nt.batchingColor=V.batchingColor,nt.instancing=V.instancing,nt.instancingColor=V.instancingColor,nt.instancingMorph=V.instancingMorph,nt.skinning=V.skinning,nt.morphTargets=V.morphTargets,nt.morphNormals=V.morphNormals,nt.morphColors=V.morphColors,nt.morphTargetsCount=V.morphTargetsCount,nt.numClippingPlanes=V.numClippingPlanes,nt.numIntersection=V.numClipIntersection,nt.vertexAlphas=V.vertexAlphas,nt.vertexTangents=V.vertexTangents,nt.toneMapping=V.toneMapping}function oe(A,V,nt,Q,$){V.isScene!==!0&&(V=Yt),L.resetTextureUnits();const Tt=V.fog,It=Q.isMeshStandardMaterial?V.environment:null,$t=T===null?y.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Es,Xt=(Q.isMeshStandardMaterial?Y:w).get(Q.envMap||It),Ht=Q.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,N=!!nt.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),X=!!nt.morphAttributes.position,ft=!!nt.morphAttributes.normal,it=!!nt.morphAttributes.color;let st=fi;Q.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(st=y.toneMapping);const Rt=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,qt=Rt!==void 0?Rt.length:0,Pt=Ft.get(Q),he=p.state.lights;if(J===!0&&(xt===!0||A!==M)){const Xe=A===M&&Q.id===b;ot.setState(Q,A,Xe)}let Qt=!1;Q.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==he.state.version||Pt.outputColorSpace!==$t||$.isBatchedMesh&&Pt.batching===!1||!$.isBatchedMesh&&Pt.batching===!0||$.isBatchedMesh&&Pt.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Pt.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Pt.instancing===!1||!$.isInstancedMesh&&Pt.instancing===!0||$.isSkinnedMesh&&Pt.skinning===!1||!$.isSkinnedMesh&&Pt.skinning===!0||$.isInstancedMesh&&Pt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Pt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Pt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Pt.instancingMorph===!1&&$.morphTexture!==null||Pt.envMap!==Xt||Q.fog===!0&&Pt.fog!==Tt||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==ot.numPlanes||Pt.numIntersection!==ot.numIntersection)||Pt.vertexAlphas!==Ht||Pt.vertexTangents!==N||Pt.morphTargets!==X||Pt.morphNormals!==ft||Pt.morphColors!==it||Pt.toneMapping!==st||Pt.morphTargetsCount!==qt)&&(Qt=!0):(Qt=!0,Pt.__version=Q.version);let ie=Pt.currentProgram;Qt===!0&&(ie=Jt(Q,V,$));let we=!1,ye=!1,Ke=!1;const ue=ie.getUniforms(),Oe=Pt.uniforms;if(bt.useProgram(ie.program)&&(we=!0,ye=!0,Ke=!0),Q.id!==b&&(b=Q.id,ye=!0),we||M!==A){bt.buffers.depth.getReversed()?(tt.copy(A.projectionMatrix),Tg(tt),Ag(tt),ue.setValue(G,"projectionMatrix",tt)):ue.setValue(G,"projectionMatrix",A.projectionMatrix),ue.setValue(G,"viewMatrix",A.matrixWorldInverse);const Ln=ue.map.cameraPosition;Ln!==void 0&&Ln.setValue(G,Ut.setFromMatrixPosition(A.matrixWorld)),kt.logarithmicDepthBuffer&&ue.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&ue.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,ye=!0,Ke=!0)}if($.isSkinnedMesh){ue.setOptional(G,$,"bindMatrix"),ue.setOptional(G,$,"bindMatrixInverse");const Xe=$.skeleton;Xe&&(Xe.boneTexture===null&&Xe.computeBoneTexture(),ue.setValue(G,"boneTexture",Xe.boneTexture,L))}$.isBatchedMesh&&(ue.setOptional(G,$,"batchingTexture"),ue.setValue(G,"batchingTexture",$._matricesTexture,L),ue.setOptional(G,$,"batchingIdTexture"),ue.setValue(G,"batchingIdTexture",$._indirectTexture,L),ue.setOptional(G,$,"batchingColorTexture"),$._colorsTexture!==null&&ue.setValue(G,"batchingColorTexture",$._colorsTexture,L));const gn=nt.morphAttributes;if((gn.position!==void 0||gn.normal!==void 0||gn.color!==void 0)&&ct.update($,nt,ie),(ye||Pt.receiveShadow!==$.receiveShadow)&&(Pt.receiveShadow=$.receiveShadow,ue.setValue(G,"receiveShadow",$.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(Oe.envMap.value=Xt,Oe.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&V.environment!==null&&(Oe.envMapIntensity.value=V.environmentIntensity),ye&&(ue.setValue(G,"toneMappingExposure",y.toneMappingExposure),Pt.needsLights&&on(Oe,Ke),Tt&&Q.fog===!0&&Z.refreshFogUniforms(Oe,Tt),Z.refreshMaterialUniforms(Oe,Q,B,U,p.state.transmissionRenderTarget[A.id]),to.upload(G,jt(Pt),Oe,L)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(to.upload(G,jt(Pt),Oe,L),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&ue.setValue(G,"center",$.center),ue.setValue(G,"modelViewMatrix",$.modelViewMatrix),ue.setValue(G,"normalMatrix",$.normalMatrix),ue.setValue(G,"modelMatrix",$.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const Xe=Q.uniformsGroups;for(let Ln=0,kn=Xe.length;Ln<kn;Ln++){const ca=Xe[Ln];z.update(ca,ie),z.bind(ca,ie)}}return ie}function on(A,V){A.ambientLightColor.needsUpdate=V,A.lightProbe.needsUpdate=V,A.directionalLights.needsUpdate=V,A.directionalLightShadows.needsUpdate=V,A.pointLights.needsUpdate=V,A.pointLightShadows.needsUpdate=V,A.spotLights.needsUpdate=V,A.spotLightShadows.needsUpdate=V,A.rectAreaLights.needsUpdate=V,A.hemisphereLights.needsUpdate=V}function Ne(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,V,nt){Ft.get(A.texture).__webglTexture=V,Ft.get(A.depthTexture).__webglTexture=nt;const Q=Ft.get(A);Q.__hasExternalTextures=!0,Q.__autoAllocateDepthBuffer=nt===void 0,Q.__autoAllocateDepthBuffer||Ot.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,V){const nt=Ft.get(A);nt.__webglFramebuffer=V,nt.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(A,V=0,nt=0){T=A,E=V,S=nt;let Q=!0,$=null,Tt=!1,It=!1;if(A){const Xt=Ft.get(A);if(Xt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(G.FRAMEBUFFER,null),Q=!1;else if(Xt.__webglFramebuffer===void 0)L.setupRenderTarget(A);else if(Xt.__hasExternalTextures)L.rebindTextures(A,Ft.get(A.texture).__webglTexture,Ft.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const X=A.depthTexture;if(Xt.__boundDepthTexture!==X){if(X!==null&&Ft.has(X)&&(A.width!==X.image.width||A.height!==X.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(A)}}const Ht=A.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(It=!0);const N=Ft.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(N[V])?$=N[V][nt]:$=N[V],Tt=!0):A.samples>0&&L.useMultisampledRTT(A)===!1?$=Ft.get(A).__webglMultisampledFramebuffer:Array.isArray(N)?$=N[nt]:$=N,P.copy(A.viewport),I.copy(A.scissor),k=A.scissorTest}else P.copy(gt).multiplyScalar(B).floor(),I.copy(ht).multiplyScalar(B).floor(),k=ut;if(bt.bindFramebuffer(G.FRAMEBUFFER,$)&&Q&&bt.drawBuffers(A,$),bt.viewport(P),bt.scissor(I),bt.setScissorTest(k),Tt){const Xt=Ft.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+V,Xt.__webglTexture,nt)}else if(It){const Xt=Ft.get(A.texture),Ht=V||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Xt.__webglTexture,nt||0,Ht)}b=-1},this.readRenderTargetPixels=function(A,V,nt,Q,$,Tt,It){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $t=Ft.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&It!==void 0&&($t=$t[It]),$t){bt.bindFramebuffer(G.FRAMEBUFFER,$t);try{const Xt=A.texture,Ht=Xt.format,N=Xt.type;if(!kt.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!kt.textureTypeReadable(N)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=A.width-Q&&nt>=0&&nt<=A.height-$&&G.readPixels(V,nt,Q,$,Vt.convert(Ht),Vt.convert(N),Tt)}finally{const Xt=T!==null?Ft.get(T).__webglFramebuffer:null;bt.bindFramebuffer(G.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(A,V,nt,Q,$,Tt,It){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let $t=Ft.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&It!==void 0&&($t=$t[It]),$t){const Xt=A.texture,Ht=Xt.format,N=Xt.type;if(!kt.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!kt.textureTypeReadable(N))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=A.width-Q&&nt>=0&&nt<=A.height-$){bt.bindFramebuffer(G.FRAMEBUFFER,$t);const X=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,X),G.bufferData(G.PIXEL_PACK_BUFFER,Tt.byteLength,G.STREAM_READ),G.readPixels(V,nt,Q,$,Vt.convert(Ht),Vt.convert(N),0);const ft=T!==null?Ft.get(T).__webglFramebuffer:null;bt.bindFramebuffer(G.FRAMEBUFFER,ft);const it=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await wg(G,it,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,X),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Tt),G.deleteBuffer(X),G.deleteSync(it),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,V=null,nt=0){A.isTexture!==!0&&(Bs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,A=arguments[1]);const Q=Math.pow(2,-nt),$=Math.floor(A.image.width*Q),Tt=Math.floor(A.image.height*Q),It=V!==null?V.x:0,$t=V!==null?V.y:0;L.setTexture2D(A,0),G.copyTexSubImage2D(G.TEXTURE_2D,nt,0,0,It,$t,$,Tt),bt.unbindTexture()},this.copyTextureToTexture=function(A,V,nt=null,Q=null,$=0){A.isTexture!==!0&&(Bs("WebGLRenderer: copyTextureToTexture function signature has changed."),Q=arguments[0]||null,A=arguments[1],V=arguments[2],$=arguments[3]||0,nt=null);let Tt,It,$t,Xt,Ht,N,X,ft,it;const st=A.isCompressedTexture?A.mipmaps[$]:A.image;nt!==null?(Tt=nt.max.x-nt.min.x,It=nt.max.y-nt.min.y,$t=nt.isBox3?nt.max.z-nt.min.z:1,Xt=nt.min.x,Ht=nt.min.y,N=nt.isBox3?nt.min.z:0):(Tt=st.width,It=st.height,$t=st.depth||1,Xt=0,Ht=0,N=0),Q!==null?(X=Q.x,ft=Q.y,it=Q.z):(X=0,ft=0,it=0);const Rt=Vt.convert(V.format),qt=Vt.convert(V.type);let Pt;V.isData3DTexture?(L.setTexture3D(V,0),Pt=G.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(L.setTexture2DArray(V,0),Pt=G.TEXTURE_2D_ARRAY):(L.setTexture2D(V,0),Pt=G.TEXTURE_2D),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,V.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,V.unpackAlignment);const he=G.getParameter(G.UNPACK_ROW_LENGTH),Qt=G.getParameter(G.UNPACK_IMAGE_HEIGHT),ie=G.getParameter(G.UNPACK_SKIP_PIXELS),we=G.getParameter(G.UNPACK_SKIP_ROWS),ye=G.getParameter(G.UNPACK_SKIP_IMAGES);G.pixelStorei(G.UNPACK_ROW_LENGTH,st.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,st.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Xt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Ht),G.pixelStorei(G.UNPACK_SKIP_IMAGES,N);const Ke=A.isDataArrayTexture||A.isData3DTexture,ue=V.isDataArrayTexture||V.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const Oe=Ft.get(A),gn=Ft.get(V),Xe=Ft.get(Oe.__renderTarget),Ln=Ft.get(gn.__renderTarget);bt.bindFramebuffer(G.READ_FRAMEBUFFER,Xe.__webglFramebuffer),bt.bindFramebuffer(G.DRAW_FRAMEBUFFER,Ln.__webglFramebuffer);for(let kn=0;kn<$t;kn++)Ke&&G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ft.get(A).__webglTexture,$,N+kn),A.isDepthTexture?(ue&&G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ft.get(V).__webglTexture,$,it+kn),G.blitFramebuffer(Xt,Ht,Tt,It,X,ft,Tt,It,G.DEPTH_BUFFER_BIT,G.NEAREST)):ue?G.copyTexSubImage3D(Pt,$,X,ft,it+kn,Xt,Ht,Tt,It):G.copyTexSubImage2D(Pt,$,X,ft,it+kn,Xt,Ht,Tt,It);bt.bindFramebuffer(G.READ_FRAMEBUFFER,null),bt.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else ue?A.isDataTexture||A.isData3DTexture?G.texSubImage3D(Pt,$,X,ft,it,Tt,It,$t,Rt,qt,st.data):V.isCompressedArrayTexture?G.compressedTexSubImage3D(Pt,$,X,ft,it,Tt,It,$t,Rt,st.data):G.texSubImage3D(Pt,$,X,ft,it,Tt,It,$t,Rt,qt,st):A.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,$,X,ft,Tt,It,Rt,qt,st.data):A.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,$,X,ft,st.width,st.height,Rt,st.data):G.texSubImage2D(G.TEXTURE_2D,$,X,ft,Tt,It,Rt,qt,st);G.pixelStorei(G.UNPACK_ROW_LENGTH,he),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Qt),G.pixelStorei(G.UNPACK_SKIP_PIXELS,ie),G.pixelStorei(G.UNPACK_SKIP_ROWS,we),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ye),$===0&&V.generateMipmaps&&G.generateMipmap(Pt),bt.unbindTexture()},this.copyTextureToTexture3D=function(A,V,nt=null,Q=null,$=0){return A.isTexture!==!0&&(Bs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),nt=arguments[0]||null,Q=arguments[1]||null,A=arguments[2],V=arguments[3],$=arguments[4]||0),Bs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,V,nt,Q,$)},this.initRenderTarget=function(A){Ft.get(A).__webglFramebuffer===void 0&&L.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?L.setTextureCube(A,0):A.isData3DTexture?L.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?L.setTexture2DArray(A,0):L.setTexture2D(A,0),bt.unbindTexture()},this.resetState=function(){E=0,S=0,T=null,bt.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}class zM extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Hn,this.environmentIntensity=1,this.environmentRotation=new Hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class NM{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Pc,this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=e.array[i+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const tn=new H;class mo{constructor(t,e,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix4(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyNormalMatrix(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.transformDirection(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Rn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Rn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Rn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Rn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Rn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,e,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),s=_e(s,this.array),a=_e(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return new je(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new mo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)e.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Lc extends Oi{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ss;const Us=new H,as=new H,os=new H,rs=new Gt,zs=new Gt,Lu=new Te,za=new H,Ns=new H,Na=new H,ld=new Gt,Mr=new Gt,hd=new Gt;class dd extends De{constructor(t=new Lc){if(super(),this.isSprite=!0,this.type="Sprite",ss===void 0){ss=new ze;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new NM(e,5);ss.setIndex([0,1,2,0,2,3]),ss.setAttribute("position",new mo(i,3,0,!1)),ss.setAttribute("uv",new mo(i,2,3,!1))}this.geometry=ss,this.material=t,this.center=new Gt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),as.setFromMatrixScale(this.matrixWorld),Lu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),os.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&as.multiplyScalar(-os.z);const i=this.material.rotation;let s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));const o=this.center;Oa(za.set(-.5,-.5,0),os,o,as,s,a),Oa(Ns.set(.5,-.5,0),os,o,as,s,a),Oa(Na.set(.5,.5,0),os,o,as,s,a),ld.set(0,0),Mr.set(1,0),hd.set(1,1);let r=t.ray.intersectTriangle(za,Ns,Na,!1,Us);if(r===null&&(Oa(Ns.set(-.5,.5,0),os,o,as,s,a),Mr.set(0,1),r=t.ray.intersectTriangle(za,Na,Ns,!1,Us),r===null))return;const l=t.ray.origin.distanceTo(Us);l<t.near||l>t.far||e.push({distance:l,point:Us.clone(),uv:mn.getInterpolation(Us,za,Ns,Na,ld,Mr,hd,new Gt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Oa(n,t,e,i,s,a){rs.subVectors(n,e).addScalar(.5).multiply(i),s!==void 0?(zs.x=a*rs.x-s*rs.y,zs.y=s*rs.x+a*rs.y):zs.copy(rs),n.copy(t),n.x+=zs.x,n.y+=zs.y,n.applyMatrix4(Lu)}class cl extends Oi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const go=new H,xo=new H,ud=new Te,Os=new sl,Ba=new wo,Sr=new H,fd=new H;class OM extends De{constructor(t=new ze,e=new cl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,a=e.count;s<a;s++)go.fromBufferAttribute(e,s-1),xo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=go.distanceTo(xo);t.setAttribute("lineDistance",new ve(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ba.copy(i.boundingSphere),Ba.applyMatrix4(s),Ba.radius+=a,t.ray.intersectsSphere(Ba)===!1)return;ud.copy(s).invert(),Os.copy(t.ray).applyMatrix4(ud);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=u,g=m-1;v<g;v+=c){const p=h.getX(v),_=h.getX(v+1),x=Ha(this,t,Os,l,p,_);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(u),p=Ha(this,t,Os,l,v,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=u,g=m-1;v<g;v+=c){const p=Ha(this,t,Os,l,v,v+1);p&&e.push(p)}if(this.isLineLoop){const v=Ha(this,t,Os,l,m-1,u);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}function Ha(n,t,e,i,s,a){const o=n.geometry.attributes.position;if(go.fromBufferAttribute(o,s),xo.fromBufferAttribute(o,a),e.distanceSqToSegment(go,xo,Sr,fd)>i)return;Sr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Sr);if(!(l<t.near||l>t.far))return{distance:l,point:fd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}const pd=new H,md=new H;class ku extends OM{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,a=e.count;s<a;s+=2)pd.fromBufferAttribute(e,s),md.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+pd.distanceTo(md);t.setAttribute("lineDistance",new ve(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kc extends an{constructor(t,e,i,s,a,o,r,l,c){super(t,e,i,s,a,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),a+=i.distanceTo(s),e.push(a),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const a=i.length;let o;e?o=e:o=t*i[a-1];let r=0,l=a-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=i[s]-o,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(a-1);const h=i[s],d=i[s+1]-h,u=(o-h)/d;return(s+u)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),l=e||(o.isVector2?new Gt:new H);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new H,s=[],a=[],o=[],r=new H,l=new Te;for(let u=0;u<=t;u++){const m=u/t;s[u]=this.getTangentAt(m,new H)}a[0]=new H,o[0]=new H;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let u=1;u<=t;u++){if(a[u]=a[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(s[u-1],s[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(qe(s[u-1].dot(s[u]),-1,1));a[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(s[u],a[u])}if(e===!0){let u=Math.acos(qe(a[0].dot(a[t]),-1,1));u/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(u=-u);for(let m=1;m<=t;m++)a[m].applyMatrix4(l.makeRotationAxis(s[m],u*m)),o[m].crossVectors(s[m],a[m])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ll extends Gn{constructor(t=0,e=0,i=1,s=1,a=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Gt){const i=e,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class BM extends ll{constructor(t,e,i,s,a,o){super(t,e,i,i,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function hl(){let n=0,t=0,e=0,i=0;function s(a,o,r,l){n=a,t=r,e=-3*a+3*o-2*r-l,i=2*a-2*o+r+l}return{initCatmullRom:function(a,o,r,l,c){s(o,r,c*(r-a),c*(l-o))},initNonuniformCatmullRom:function(a,o,r,l,c,h,f){let d=(o-a)/c-(r-a)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,s(o,r,d,u)},calc:function(a){const o=a*a,r=o*a;return n+t*a+e*o+i*r}}}const Ga=new H,br=new hl,Er=new hl,wr=new hl;class HM extends Gn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new H){const i=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:l===0&&r===a-1&&(r=a-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%a]:(Ga.subVectors(s[0],s[1]).add(s[0]),c=Ga);const f=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(Ga.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Ga),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),v=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),br.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,v,g),Er.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,v,g),wr.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(br.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Er.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),wr.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(br.calc(l),Er.calc(l),wr.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new H().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function gd(n,t,e,i,s){const a=(i-t)*.5,o=(s-e)*.5,r=n*n,l=n*r;return(2*e-2*i+a+o)*l+(-3*e+3*i-2*a-o)*r+a*n+e}function GM(n,t){const e=1-n;return e*e*t}function VM(n,t){return 2*(1-n)*n*t}function XM(n,t){return n*n*t}function Xs(n,t,e,i){return GM(n,t)+VM(n,e)+XM(n,i)}function WM(n,t){const e=1-n;return e*e*e*t}function $M(n,t){const e=1-n;return 3*e*e*n*t}function YM(n,t){return 3*(1-n)*n*n*t}function ZM(n,t){return n*n*n*t}function Ws(n,t,e,i,s){return WM(n,t)+$M(n,e)+YM(n,i)+ZM(n,s)}class Iu extends Gn{constructor(t=new Gt,e=new Gt,i=new Gt,s=new Gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Gt){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ws(t,s.x,a.x,o.x,r.x),Ws(t,s.y,a.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class qM extends Gn{constructor(t=new H,e=new H,i=new H,s=new H){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new H){const i=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return i.set(Ws(t,s.x,a.x,o.x,r.x),Ws(t,s.y,a.y,o.y,r.y),Ws(t,s.z,a.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fu extends Gn{constructor(t=new Gt,e=new Gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Gt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jM extends Gn{constructor(t=new H,e=new H){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new H){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new H){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uu extends Gn{constructor(t=new Gt,e=new Gt,i=new Gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Gt){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Xs(t,s.x,a.x,o.x),Xs(t,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class KM extends Gn{constructor(t=new H,e=new H,i=new H){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new H){const i=e,s=this.v0,a=this.v1,o=this.v2;return i.set(Xs(t,s.x,a.x,o.x),Xs(t,s.y,a.y,o.y),Xs(t,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class zu extends Gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Gt){const i=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return i.set(gd(r,l.x,c.x,h.x,f.x),gd(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Gt().fromArray(s))}return this}}var xd=Object.freeze({__proto__:null,ArcCurve:BM,CatmullRomCurve3:HM,CubicBezierCurve:Iu,CubicBezierCurve3:qM,EllipseCurve:ll,LineCurve:Fu,LineCurve3:jM,QuadraticBezierCurve:Uu,QuadraticBezierCurve3:KM,SplineCurve:zu});class JM extends Gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new xd[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const o=s[a]-i,r=this.curves[a],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new xd[s.type]().fromJSON(s))}return this}}class vd extends JM{constructor(t){super(),this.type="Path",this.currentPoint=new Gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Fu(this.currentPoint.clone(),new Gt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const a=new Uu(this.currentPoint.clone(),new Gt(t,e),new Gt(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,a,o){const r=new Iu(this.currentPoint.clone(),new Gt(t,e),new Gt(i,s),new Gt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new zu(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,a,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,s,a,o),this}absarc(t,e,i,s,a,o){return this.absellipse(t,e,i,i,s,a,o),this}ellipse(t,e,i,s,a,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,a,o,r,l),this}absellipse(t,e,i,s,a,o,r,l){const c=new ll(t,e,i,s,a,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class dl extends ze{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],l=[],c=new H,h=new Gt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*s;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)a.push(f,f+1,0);this.setIndex(a),this.setAttribute("position",new ve(o,3)),this.setAttribute("normal",new ve(r,3)),this.setAttribute("uv",new ve(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qs extends ze{constructor(t=1,e=1,i=1,s=32,a=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],f=[],d=[],u=[];let m=0;const v=[],g=i/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ve(f,3)),this.setAttribute("normal",new ve(d,3)),this.setAttribute("uv",new ve(u,2));function _(){const y=new H,R=new H;let E=0;const S=(e-t)/i;for(let T=0;T<=a;T++){const b=[],M=T/a,P=M*(e-t)+t;for(let I=0;I<=s;I++){const k=I/s,F=k*l+r,D=Math.sin(F),C=Math.cos(F);R.x=P*D,R.y=-M*i+g,R.z=P*C,f.push(R.x,R.y,R.z),y.set(D,S,C).normalize(),d.push(y.x,y.y,y.z),u.push(k,1-M),b.push(m++)}v.push(b)}for(let T=0;T<s;T++)for(let b=0;b<a;b++){const M=v[b][T],P=v[b+1][T],I=v[b+1][T+1],k=v[b][T+1];(t>0||b!==0)&&(h.push(M,P,k),E+=3),(e>0||b!==a-1)&&(h.push(P,I,k),E+=3)}c.addGroup(p,E,0),p+=E}function x(y){const R=m,E=new Gt,S=new H;let T=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),m++;const P=m;for(let I=0;I<=s;I++){const F=I/s*l+r,D=Math.cos(F),C=Math.sin(F);S.x=b*C,S.y=g*M,S.z=b*D,f.push(S.x,S.y,S.z),d.push(0,M,0),E.x=D*.5+.5,E.y=C*.5*M+.5,u.push(E.x,E.y),m++}for(let I=0;I<s;I++){const k=R+I,F=P+I;y===!0?h.push(F,F+1,k):h.push(F+1,F,k),T+=3}c.addGroup(p,T,y===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ul extends Qs{constructor(t=1,e=1,i=32,s=1,a=!1,o=0,r=Math.PI*2){super(0,t,e,i,s,a,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(t){return new ul(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fl extends ze{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const a=[],o=[];r(s),c(i),h(),this.setAttribute("position",new ve(a,3)),this.setAttribute("normal",new ve(a.slice(),3)),this.setAttribute("uv",new ve(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(_){const x=new H,y=new H,R=new H;for(let E=0;E<e.length;E+=3)u(e[E+0],x),u(e[E+1],y),u(e[E+2],R),l(x,y,R,_)}function l(_,x,y,R){const E=R+1,S=[];for(let T=0;T<=E;T++){S[T]=[];const b=_.clone().lerp(y,T/E),M=x.clone().lerp(y,T/E),P=E-T;for(let I=0;I<=P;I++)I===0&&T===E?S[T][I]=b:S[T][I]=b.clone().lerp(M,I/P)}for(let T=0;T<E;T++)for(let b=0;b<2*(E-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(S[T][M+1]),d(S[T+1][M]),d(S[T][M])):(d(S[T][M+1]),d(S[T+1][M+1]),d(S[T+1][M]))}}function c(_){const x=new H;for(let y=0;y<a.length;y+=3)x.x=a[y+0],x.y=a[y+1],x.z=a[y+2],x.normalize().multiplyScalar(_),a[y+0]=x.x,a[y+1]=x.y,a[y+2]=x.z}function h(){const _=new H;for(let x=0;x<a.length;x+=3){_.x=a[x+0],_.y=a[x+1],_.z=a[x+2];const y=g(_)/2/Math.PI+.5,R=p(_)/Math.PI+.5;o.push(y,1-R)}m(),f()}function f(){for(let _=0;_<o.length;_+=6){const x=o[_+0],y=o[_+2],R=o[_+4],E=Math.max(x,y,R),S=Math.min(x,y,R);E>.9&&S<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),R<.2&&(o[_+4]+=1))}}function d(_){a.push(_.x,_.y,_.z)}function u(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const _=new H,x=new H,y=new H,R=new H,E=new Gt,S=new Gt,T=new Gt;for(let b=0,M=0;b<a.length;b+=9,M+=6){_.set(a[b+0],a[b+1],a[b+2]),x.set(a[b+3],a[b+4],a[b+5]),y.set(a[b+6],a[b+7],a[b+8]),E.set(o[M+0],o[M+1]),S.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),R.copy(_).add(x).add(y).divideScalar(3);const P=g(R);v(E,M+0,_,P),v(S,M+2,x,P),v(T,M+4,y,P)}}function v(_,x,y,R){R<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=R/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fl(t.vertices,t.indices,t.radius,t.details)}}const Va=new H,Xa=new H,Tr=new H,Wa=new mn;class QM extends ze{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(ms*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:v,b:g,c:p}=Wa;if(v.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),Wa.getNormal(Tr),f[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let _=0;_<3;_++){const x=(_+1)%3,y=f[_],R=f[x],E=Wa[h[_]],S=Wa[h[x]],T=`${y}_${R}`,b=`${R}_${y}`;b in d&&d[b]?(Tr.dot(d[b].normal)<=a&&(u.push(E.x,E.y,E.z),u.push(S.x,S.y,S.z)),d[b]=null):T in d||(d[T]={index0:c[_],index1:c[x],normal:Tr.clone()})}}for(const m in d)if(d[m]){const{index0:v,index1:g}=d[m];Va.fromBufferAttribute(r,v),Xa.fromBufferAttribute(r,g),u.push(Va.x,Va.y,Va.z),u.push(Xa.x,Xa.y,Xa.z)}this.setAttribute("position",new ve(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Nu extends vd{constructor(t){super(t),this.uuid=Bn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new vd().fromJSON(s))}return this}}const tS={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let a=Ou(n,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,l,c,h,f,d,u;if(i&&(a=aS(n,t,a,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<s;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return ta(a,o,e,r,l,u,0),o}};function Ou(n,t,e,i,s){let a,o;if(s===gS(n,t,e,i)>0)for(a=t;a<e;a+=i)o=_d(a,n[a],n[a+1],o);else for(a=e-i;a>=t;a-=i)o=_d(a,n[a],n[a+1],o);return o&&Ao(o,o.next)&&(na(o),o=o.next),o}function Ni(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ao(e,e.next)||Pe(e.prev,e,e.next)===0)){if(na(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ta(n,t,e,i,s,a,o){if(!n)return;!o&&a&&hS(n,i,s,a);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,a?nS(n,i,s,a):eS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),na(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=iS(Ni(n),t,e),ta(n,t,e,i,s,a,2)):o===2&&sS(n,t,e,i,s,a):ta(Ni(n),t,e,i,s,a,1);break}}}function eS(n){const t=n.prev,e=n,i=n.next;if(Pe(t,e,i)>=0)return!1;const s=t.x,a=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=s<a?s<o?s:o:a<o?a:o,f=r<l?r<c?r:c:l<c?l:c,d=s>a?s>o?s:o:a>o?a:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&ds(s,r,a,l,o,c,m.x,m.y)&&Pe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function nS(n,t,e,i){const s=n.prev,a=n,o=n.next;if(Pe(s,a,o)>=0)return!1;const r=s.x,l=a.x,c=o.x,h=s.y,f=a.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,v=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=Ic(u,m,t,e,i),_=Ic(v,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=u&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&ds(r,h,l,f,c,d,x.x,x.y)&&Pe(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&ds(r,h,l,f,c,d,y.x,y.y)&&Pe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=u&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&ds(r,h,l,f,c,d,x.x,x.y)&&Pe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=u&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&ds(r,h,l,f,c,d,y.x,y.y)&&Pe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function iS(n,t,e){let i=n;do{const s=i.prev,a=i.next.next;!Ao(s,a)&&Bu(s,i,i.next,a)&&ea(s,a)&&ea(a,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(a.i/e|0),na(i),na(i.next),i=n=a),i=i.next}while(i!==n);return Ni(i)}function sS(n,t,e,i,s,a){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&fS(o,r)){let l=Hu(o,r);o=Ni(o,o.next),l=Ni(l,l.next),ta(o,t,e,i,s,a,0),ta(l,t,e,i,s,a,0);return}r=r.next}o=o.next}while(o!==n)}function aS(n,t,e,i){const s=[];let a,o,r,l,c;for(a=0,o=t.length;a<o;a++)r=t[a]*i,l=a<o-1?t[a+1]*i:n.length,c=Ou(n,r,l,i,!1),c===c.next&&(c.steiner=!0),s.push(uS(c));for(s.sort(oS),a=0;a<s.length;a++)e=rS(s[a],e);return e}function oS(n,t){return n.x-t.x}function rS(n,t){const e=cS(n,t);if(!e)return t;const i=Hu(e,n);return Ni(i,i.next),Ni(e,e.next)}function cS(n,t){let e=t,i=-1/0,s;const a=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>i&&(i=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,f;e=s;do a>=e.x&&e.x>=l&&a!==e.x&&ds(o<c?a:i,o,l,c,o<c?i:a,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(a-e.x),ea(e,n)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&lS(s,e)))&&(s=e,h=f)),e=e.next;while(e!==r);return s}function lS(n,t){return Pe(n.prev,n,t.prev)<0&&Pe(t.next,n,n.next)<0}function hS(n,t,e,i){let s=n;do s.z===0&&(s.z=Ic(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,dS(s)}function dS(n){let t,e,i,s,a,o,r,l,c=1;do{for(e=n,n=null,a=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;e=i}a.nextZ=null,c*=2}while(o>1);return n}function Ic(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function uS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ds(n,t,e,i,s,a,o,r){return(s-o)*(t-r)>=(n-o)*(a-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(i-r)}function fS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!pS(n,t)&&(ea(n,t)&&ea(t,n)&&mS(n,t)&&(Pe(n.prev,n,t.prev)||Pe(n,t.prev,t))||Ao(n,t)&&Pe(n.prev,n,n.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ao(n,t){return n.x===t.x&&n.y===t.y}function Bu(n,t,e,i){const s=Ya(Pe(n,t,e)),a=Ya(Pe(n,t,i)),o=Ya(Pe(e,i,n)),r=Ya(Pe(e,i,t));return!!(s!==a&&o!==r||s===0&&$a(n,e,t)||a===0&&$a(n,i,t)||o===0&&$a(e,n,i)||r===0&&$a(e,t,i))}function $a(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ya(n){return n>0?1:n<0?-1:0}function pS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Bu(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function ea(n,t){return Pe(n.prev,n,n.next)<0?Pe(n,t,n.next)>=0&&Pe(n,n.prev,t)>=0:Pe(n,t,n.prev)<0||Pe(n,n.next,t)<0}function mS(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,a=(n.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Hu(n,t){const e=new Fc(n.i,n.x,n.y),i=new Fc(t.i,t.x,t.y),s=n.next,a=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,a.next=i,i.prev=a,i}function _d(n,t,e,i){const s=new Fc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function na(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Fc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function gS(n,t,e,i){let s=0;for(let a=t,o=e-i;a<e;a+=i)s+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return s}class $s{static area(t){const e=t.length;let i=0;for(let s=e-1,a=0;a<e;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return $s.area(t)<0}static triangulateShape(t,e){const i=[],s=[],a=[];yd(t),Md(i,t);let o=t.length;e.forEach(yd);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Md(i,e[l]);const r=tS.triangulate(i,s);for(let l=0;l<r.length;l+=3)a.push(r.slice(l,l+3));return a}}function yd(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Md(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class pl extends fl{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new pl(t.radius,t.detail)}}class ia extends ze{constructor(t=.5,e=1,i=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:a,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/s,u=new H,m=new Gt;for(let v=0;v<=s;v++){for(let g=0;g<=i;g++){const p=a+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let v=0;v<s;v++){const g=v*(i+1);for(let p=0;p<i;p++){const _=p+g,x=_,y=_+i+1,R=_+i+2,E=_+1;r.push(x,y,E),r.push(y,R,E)}}this.setIndex(r),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(c,3)),this.setAttribute("uv",new ve(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ia(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ml extends ze{constructor(t=new Nu([new Gt(0,.5),new Gt(-.5,-.5),new Gt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],a=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new ve(s,3)),this.setAttribute("normal",new ve(a,3)),this.setAttribute("uv",new ve(o,2));function c(h){const f=s.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;$s.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const _=m[g];$s.isClockWise(_)===!0&&(m[g]=_.reverse())}const v=$s.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const _=m[g];u=u.concat(_)}for(let g=0,p=u.length;g<p;g++){const _=u[g];s.push(_.x,_.y,0),a.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){const _=v[g],x=_[0]+f,y=_[1]+f,R=_[2]+f;i.push(x,y,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return xS(e,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}return new ml(i,t.curveSegments)}}function xS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class Ro extends ze{constructor(t=1,e=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const o=[],r=[],l=[],c=[],h=new H,f=new H,d=new H;for(let u=0;u<=i;u++)for(let m=0;m<=s;m++){const v=m/s*a,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(v),f.y=(t+e*Math.cos(g))*Math.sin(v),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=s;m++){const v=(s+1)*u+m-1,g=(s+1)*(u-1)+m-1,p=(s+1)*(u-1)+m,_=(s+1)*u+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new ve(r,3)),this.setAttribute("normal",new ve(l,3)),this.setAttribute("uv",new ve(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ro(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class sa extends Oi{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=pu,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.combine=jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Gu extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class vS extends Gu{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ar=new Te,Sd=new H,bd=new H;class _S{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.map=null,this.mapPass=null,this.matrix=new Te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ol,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new Fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Sd.setFromMatrixPosition(t.matrixWorld),e.position.copy(Sd),bd.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bd),e.updateMatrixWorld(),Ar.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ar),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ar)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class yS extends _S{constructor(){super(new Tu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class MS extends Gu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new yS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Ed=new Te;class SS{constructor(t,e,i=0,s=1/0){this.ray=new sl(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ed.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ed),this}intersectObject(t,e=!0,i=[]){return Uc(t,this,i,e),i.sort(wd),i}intersectObjects(t,e=!0,i=[]){for(let s=0,a=t.length;s<a;s++)Uc(t[s],this,i,e);return i.sort(wd),i}}function wd(n,t){return n.distance-t.distance}function Uc(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let o=0,r=a.length;o<r;o++)Uc(a[o],t,e,!0)}}class bS extends ku{constructor(t=10,e=10,i=4473924,s=8947848){i=new ee(i),s=new ee(s);const a=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const v=d===a?i:s;v.toArray(c,u),u+=3,v.toArray(c,u),u+=3,v.toArray(c,u),u+=3,v.toArray(c,u),u+=3}const h=new ze;h.setAttribute("position",new ve(l,3)),h.setAttribute("color",new ve(c,3));const f=new cl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qc);const ES={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function wS(n,t,e,i){const s=new _n(n.fov,i,.1,200),a=new H,o=new H,r=new H;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1;function d(){const u=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(u),Math.sin(u),Math.cos(m)*Math.cos(u)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return d(),{camera:s,update(u,m,v,g,p=ES){const _=m+.6;if(!l)a.set(u,_,v),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*g);a.x+=(u-a.x)*R,a.y+=(_-a.y)*R,a.z+=(v-a.z)*R}const x=1-Math.exp(-Math.max(t.smoothing,.001)*g);h.distanceScale+=(p.distanceScale-h.distanceScale)*x,h.offsetX+=(p.offsetX-h.offsetX)*x,h.offsetZ+=(p.offsetZ-h.offsetZ)*x,h.pitchDelta+=(p.pitchDelta-h.pitchDelta)*x;const y=1-Math.exp(-Math.max(e.smoothing,.001)*g);h.zoom+=(f-h.zoom)*y,d(),(s.fov!==c||s.fov!==n.fov)&&(s.fov=n.fov,c=n.fov,s.updateProjectionMatrix()),o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},snap(u,m,v){a.set(u,m+.6,v),l=!0,o.set(a.x+h.offsetX,a.y,a.z+h.offsetZ),d(),s.position.copy(o).add(r),s.lookAt(o),s.updateMatrixWorld()},resize(u){s.aspect=u,s.updateProjectionMatrix()},getGroundBasis(){const u=new H().setFromMatrixColumn(s.matrixWorld,0),m=new H().setFromMatrixColumn(s.matrixWorld,2).negate(),v=Math.hypot(u.x,u.z)||1,g=Math.hypot(m.x,m.z)||1;return{rightX:u.x/v,rightZ:u.z/v,forwardX:m.x/g,forwardZ:m.z/g}},setZoom(u){f=Number.isFinite(u)&&u>0?u:1},smart(){return{...h}}}}const Ii=Math.PI*2,yn=1e-6;function ln(n,t,e){return n<t?t:n>e?e:n}function Vu(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function TS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Xu(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const s=TS(n);return i===1?s:e+(s-e)*i}function Td(n){return(1-Math.sin(n))/2}function gl(n,t,e){const i=Math.PI/180,s=ln(Number.isFinite(t)?t:100,0,180),a=ln(Number.isFinite(e)?e:132,0,180);if(a<=s)return n>=Math.cos(s*i)?1:0;const o=Math.cos(s*i),r=Math.cos(a*i);if(n>=o)return 1;const l=ln((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function xl(n,t){if(!n.grounded||n.speed<yn)return Vu();const e=n.speed/Math.max(n.moveSpeed,yn),i=Math.max(n.legLength,yn),s=n.stride>yn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,a=Math.min(t.maxAmp,s/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+yn,h=gl(n.localForward/Math.max(n.speed,yn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,v=s,g=F=>Math.asin(ln(F,-o,o)/i);function p(F,D){const C=Xu(F,t.plantLock),U=Td(F),B=u*d*v*C,W=-g(B),et=D*m>0?1:-1,gt=1+et*t.crossStep*.45,ht=m*et*t.crossStep*v*.4*U,ut=m*f*v*t.sideWeight*gt*C+ht*f,j=g(ut),J=t.kneeLift*U*a*(.55+.25*d+(et>0?.2*f:0));return{pitchX:W,rollZ:j,kneeX:J}}const _=(n.phase%Ii+Ii)%Ii,x=p(_,-1),y=p((_+Math.PI)%Ii,1),R=Math.cos(_),E=Td(_),S=-t.comSway*a*R*(.6*d+.8*f)-m*t.comSway*a*f*.45,T=t.comBob*E*a,b=m*t.hipLean*a*f*R*.6,M=m*t.hipLean*a*f*(.45+.25*R),P=t.armSwing*a*R*(d*u+.3*f),I=P,k=-P;return{legL:x,legR:y,pelvisX:S,pelvisY:T,pelvisRoll:b,sideLean:M,armL:I,armR:k,strafe:f,backward:u<0?d:0}}function Wu(n){const t=(n%Ii+Ii)%Ii,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function $u(n,t,e){const i=ln(e.progress,0,1);if(i>=1||n.speed<yn)return Vu();const s=i*i*(3-2*i),a=1-s;return xl({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*s,speed:n.speed*a,stride:n.stride*a},t)}function Yu(n,t,e,i){const s=ln(n,-1,1),a=Math.abs(s),o=Math.min(1,t*(1+Math.max(0,i)*a*a));return ln(o*s,-1,1)*(e*Math.PI/180)}function Zu(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const a=Math.atan2(t,n)*180/Math.PI;if(Math.abs(a)<=90)return e;const r=(a-Math.sign(a)*180)*Math.PI/180,l=ln(i,0,1),c=l*l;return e*c+r*(1-c)}function qu(n,t,e,i,s){const a=Math.max(e,yn),o=Math.max(0,i)*a,r=Math.max(0,s)*a,l=t>yn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>yn&&n<=o&&c,resume:!d}}function ju(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return ln(n*ln(t,0,2),-i,i)}function Ku(n,t,e){const i=Math.sin(n),s=Math.cos(n),a=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*s,right:t*a+e*o}}function Ju(n,t,e){const i=ln(n,0,1),s=i*i*(3-2*i);return e?t==="inStop"?1-s:1:t==="afterStop"?1-s:0}function AS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const s=ln(n,0,1),a=Math.sin(Math.PI*s),o=a*a;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Qu(n,t,e,i,s){const a=ln(n,0,1),o=ln(s.stopPeakRatio,.05,.95),r=a<=o?a/o:(a-o)/(1-o),l=r*r*(3-2*r),c=a<=o?l:1-l,h=Math.hypot(e,i),f=h>yn?e/h:1,d=h>yn?i/h:0,u=Xu(t,1)>0;return{leadPitch:Math.max(0,s.stopStepPitch)*c,trailPitch:Math.max(0,s.stopTrailPitch)*c,leadKnee:Math.max(0,s.stopStepKnee)*c,bodyShift:Math.max(0,s.stopBodyShift)*c,bodyDip:Math.max(0,s.stopBodyDip)*c,chestPitch:Math.max(0,s.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function sn(n){return n<0?0:n>1?1:n}const eo=Math.PI*2;function RS(n){return((n+Math.PI)%eo+eo)%eo-Math.PI}function CS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function PS(n,t,e,i,s,a=n.phase){const o=sn(i);if(o<=0)return n;const r=sn(t),l=Math.max(1,Math.round(s.cycles)),c=Math.max(0,s.strideSpeed),h=e%2===0?1:-1,f=sn(s.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,s.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,v=m*m*(3-2*m),g=r<=.5?v:1-v,p={speed:c,phase:a+eo*l/2*g,localForward:c*f,localRight:c*(1-f)*h},_=RS(p.phase-n.phase),x=o*o*(3-2*o),y=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+_*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:y+(u-y)*o*o}}function DS(n,t,e){const i=CS(),s=sn(n),a=Math.sin(Math.PI*s)**2;if(a<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*a,h=e.stepKnee*a,f=e.stepSide*a;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*a*o,i.pelvisY=-e.stepDip*a,i.pelvisRoll=f*.25*o,i}function tf(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Ad(n,t,e,i,s){if(e<=0||i<=0)return 0;const a=(n-t)/e;return a<0||a>=1?0:i*tf(a,s)}function LS(n,t,e,i){const s=t?1:0,a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(s-n)*a;return t&&o>.999?1:!t&&o<.001?0:o}function kS(n,t,e){const i=sn(n);return{gaitScale:1-i*(1-sn(t)),attackLegWeight:sn(e)*i}}function IS(n,t){const e=sn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function FS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return sn(t.minScale+(1-t.minScale)*e)}function US(){return ef()}function ef(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function zS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function NS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?sn(t.forceHitHeight):n.type==="light"?sn(t.hitHeight.light):n.type==="heavy"?sn(t.hitHeight.heavy):n.type==="knock"?sn(t.hitHeight.knock):0}function OS(n,t,e){const i=sn(e),s=(a,o)=>a+(o-a)*i;return{upperPitch:s(n.upperPitch,t.upperPitch),upperRoll:s(n.upperRoll,t.upperRoll),upperYaw:s(n.upperYaw,t.upperYaw),fold:s(n.fold,t.fold),shift:s(n.shift,t.shift),drop:s(n.drop,t.drop),back:s(n.back,t.back),knee:s(n.knee,t.knee),hip:s(n.hip,t.hip),arm:s(n.arm,t.arm)}}function nf(n,t,e){const i=ef(),s=zS(n,e);if(i.intensity=s,s<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const a=sn(1-n.timer/n.duration),o=tf(a,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=NS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const v=Math.sin(Math.PI*a);return i.upperPitch=s*v*f,i.upperRoll=-s*v*d*.7,i.drop=(s>.5?.09:.04)*v,i.flash=e.flashStrength*v,i.active=v>0,i}const u=s*o,m=OS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function sf(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),s=Number.isFinite(n.leanForward)?n.leanForward:0,a=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:s*e,pelvisRoll:a*e,pelvisX:-a*i,pelvisZ:s*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ei=1e-6;function Ys(n,t,e){return n<t?t:n>e?e:n}function af(n,t,e,i=1){const s=t,a=e;if(!Number.isFinite(s)||!Number.isFinite(a)||s<=Ei||a<=Ei||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=s+a,l=Math.abs(s-a)+Ei,c=Math.hypot(n.x,n.y,n.z);if(c<=Ei)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=Ys(u,l,r),v=u>r+Ei||u<l-Ei,g=Math.atan2(-d,Math.max(f,Ei)),p=Ys((s*s+m*m-a*a)/(2*s*m),-1,1),_=Ys((a*a+m*m-s*s)/(2*a*m),-1,1),x=Math.acos(p),y=Math.acos(_),R=i>=0?1:-1;return{rootPitch:g-R*x,rootRoll:h,jointPitch:R*(x+y),clamped:v,reach:c/r}}function of(n,t,e,i){const s=Ys(e,0,1),a=Math.max(0,i),o=(r,l)=>{const c=Ys((l-r)*s,-a,a);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function rf(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const vl={active:!1,weight:0,clamped:0,maxError:0};function cf(n){const{root:t,pelvis:e,lower:i,limbs:s,base:a,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||s.length===0)return{...vl};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(a.pelvisPos),e.rotation.x=a.pelvisRotX,e.rotation.z=a.pelvisRotZ,i.position.copy(a.lowerPos),i.rotation.z=a.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=s.map(u=>u.tip.getWorldPosition(new H));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<s.length;u++){const m=s[u],v=i.worldToLocal(l[u].clone()),g={x:v.x-m.root.position.x,y:v.y-m.root.position.y,z:v.z-m.root.position.z},p=af(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const _=of({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=_.rootPitch,m.root.rotation.z=_.rootRoll,m.joint.rotation.x=_.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<s.length;u++){const m=s[u].tip.getWorldPosition(new H);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function fn(n,t,e){return n<t?t:n>e?e:n}function BS(n,t,e,i,s,a,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new be,d=new be;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new be;u.name="lower";const m=new be;m.name="upper",d.add(u),d.add(m);const v=[],g=(Z,mt,Kt,ot)=>{const yt=new sa({color:ot}),O=new fe(new Dn(Z,mt,Kt),yt);return O.castShadow=!0,O.receiveShadow=!0,v.push(yt),O},p=n.headSize,_=n.legLength,x=n.armLength,y=n.limbThickness,R=n.bodyHeight,E=n.bodyWidth,S=g(E,R,.28,e);S.position.y=R/2,m.add(S);const T=new be;T.name="headPivot",T.rotation.order="YXZ",T.position.y=R,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const Z of[-1,1]){const mt=g(.06,.07,.02,t.shoe);mt.position.set(Z*.09,p/2+.03,p/2+.011),T.add(mt)}const M=(Z,mt)=>{const Kt=mt?x:_,ot=new be;ot.name=mt?Z<0?"shoulderL":"shoulderR":Z<0?"hipL":"hipR",mt||(ot.rotation.order="ZYX"),ot.position.set(Z*(mt?E/2+y/2:E/2-y/2),mt?R-.04:0,0),(mt?m:u).add(ot);const yt=g(y,Kt/2,y,t.limb);yt.position.y=-Kt/4,ot.add(yt);const O=new be;O.name=mt?"elbow":"knee",O.position.y=-Kt/2,ot.add(O);const ct=g(y,Kt/2,y,t.limb);if(ct.position.y=-Kt/4,O.add(ct),!mt){const pt=g(y*1.15,.07,y*1.7,t.shoe);pt.position.set(0,-Kt/2+.035,.045),O.add(pt);const zt=new De;return zt.name="footTip",zt.position.y=-Kt/2,O.add(zt),{root:ot,joint:O,tip:zt}}return{root:ot,joint:O}},P=M(-1,!1),I=M(1,!1),k=M(-1,!0),F=M(1,!0),D=[P,I].map(Z=>({root:Z.root,joint:Z.joint,tip:Z.tip,upperLen:_/2,lowerLen:_/2,bend:1})),C=new He({color:s.attackArcColor,transparent:!0,opacity:0,side:Ce,depthWrite:!1}),U=new fe(new Ro(.62,.042,6,20,Math.PI*1.1),C);U.position.set(0,.78-_,.56),m.add(U);const B=new ee(e),W=new ee(r.flashColor),et=new ee;let gt=null,ht=0,ut=0,j=0,J=0,xt=0,tt=0,At=0,Ut={...vl},vt=-1,Yt=0,_t=0,Wt=0,G=0,le=0,Ot=0,kt=0,bt=1,wt=0,Ft=0,L="none",w=0,Y=!1,rt=-1,dt=!1,at=0,Lt=0;return{group:f,boneAtWorld(Z,mt,Kt){const ot=[{node:m,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0}],yt=new H,O=new H,ct=new H(Z,mt,Kt),pt=new H;let zt=null,Vt=Number.POSITIVE_INFINITY;for(const Bt of ot){Bt.node.updateWorldMatrix(!0,!1),yt.set(Bt.ax,Bt.ay,Bt.az),O.set(Bt.bx,Bt.by,Bt.bz),Bt.node.localToWorld(yt),Bt.node.localToWorld(O);const z=O.x-yt.x,Mt=O.y-yt.y,K=O.z-yt.z,lt=z*z+Mt*Mt+K*K;let Et=lt>1e-8?((ct.x-yt.x)*z+(ct.y-yt.y)*Mt+(ct.z-yt.z)*K)/lt:0;Et=Math.max(0,Math.min(1,Et));const St=yt.x+z*Et,Zt=yt.y+Mt*Et,ne=yt.z+K*Et,se=(ct.x-St)**2+(ct.y-Zt)**2+(ct.z-ne)**2;se<Vt&&(Vt=se,zt=Bt.node,pt.set(St,Zt,ne))}return zt?{node:zt,point:pt.clone()}:null},update(Z,mt){f.position.set(Z.position.x,Z.position.y,Z.position.z),f.rotation.y=Z.bodyYaw,T.rotation.y=(Z.headYaw-Z.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,Z.mode!==gt&&(gt=Z.mode,ht=1),ht=Math.max(0,ht-mt*2.2);const Kt=Z.hurt,ot=nf(Kt,Z.bodyYaw,r),yt=ot.flash;et.copy(W).multiplyScalar(yt);for(const Ht of v)Ht.emissive.copy(B).multiplyScalar(ht*.5),yt>0&&Ht.emissive.add(et);d.position.set(0,_,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(Z.velocity.x,Z.velocity.z),ct=fn(o.knockGaitScale??0,0,1),pt=Z.hurt.knockX*ct,zt=Z.hurt.knockZ*ct,Vt=ct>0&&Math.hypot(Z.hurt.knockX,Z.hurt.knockZ)>.001,Bt=Z.velocity.x+pt,z=Z.velocity.z+zt,Mt=Math.hypot(Bt,z),K=Math.cos(Z.bodyYaw),lt=-Math.sin(Z.bodyYaw),Et=O>1e-6?fn((Z.velocity.x*K+Z.velocity.z*lt)/O,-1,1):0,St=O>1e-6?fn((Z.velocity.x*Math.sin(Z.bodyYaw)+Z.velocity.z*Math.cos(Z.bodyYaw))/O,-1,1):1,Zt=gl(St,o.backStrafeStartDeg,o.backStrafeFullDeg);L==="settled"&&dt&&at>Lt*1.02+1e-4&&(L="none");let ne=1;L==="blend"?(ne=Ju(Y?rt:w,o.stopYawBlendMode,Y),Y||(w=Math.min(1,w+mt/Math.max(.01,o.stopYawAfterSec)),(w>=1||o.stopYawBlendMode==="inStop"||dt)&&(L="settled",ne=0))):L==="settled"&&(ne=fn(O/Math.max(1e-6,o.stopEnterRatio*a),0,1));const se=Yu(Et,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),te=Zu(St,Et,se,Zt)*ne;wt+=(te-wt)*(1-Math.exp(-12*Math.max(0,mt))),u.rotation.y=wt;const ge=Z.bodyYaw+wt,pe=Math.sin(ge),Ye=Math.cos(ge),Ze=Math.cos(ge),Ae=-Math.sin(ge),Ee=Bt*pe+z*Ye,Le=Bt*Ze+z*Ae,q=Math.max(0,o.stopBlendSec||0),Dt=q>0&&!Vt,Ct=qu(O,Ft,a,o.stopEnterRatio,o.stopExitRatio);if(!Dt||Ct.resume)vt=-1;else if(vt<0&&Ct.enter){vt=0,Yt=Z.gaitPhase,_t=Wu(Z.gaitPhase),Wt=O,G=Math.max(Z.stride,1e-6),le=Ee,Ot=Le;const Ht=1/Math.max(1e-6,O);kt=Z.velocity.x*Ht,bt=Z.velocity.z*Ht}const Jt=Ft;Ft=O;const jt=Dt&&vt>=0;jt&&(vt=Math.min(1,vt+mt/q)),jt&&L!=="blend"&&(L="blend",w=0),Y=jt&&vt<1,rt=vt,dt=Ct.resume,at=O,Lt=Jt;const ae=jt?{phase:Yt,speed:Wt,moveSpeed:a,localForward:le,localRight:Ot,legLength:n.legLength,stride:G,grounded:!0}:{phase:Z.gaitPhase,speed:Mt,moveSpeed:a,localForward:Ee,localRight:Le,legLength:n.legLength,stride:Z.stride,grounded:!0},oe=jt?$u(ae,o,{progress:vt,phase0:Yt,phaseEnd:_t}):xl(ae,o);let on=0,Ne=0,A=0,V=0;if(jt){const Ht=Ku(Z.bodyYaw,kt,bt),N=Qu(vt,Yt,Ht.forward,Ht.right,o);N.leadLeft?(oe.legL.pitchX-=N.leadPitch,oe.legL.kneeX+=N.leadKnee,oe.legR.pitchX+=N.trailPitch):(oe.legR.pitchX-=N.leadPitch,oe.legR.kneeX+=N.leadKnee,oe.legL.pitchX+=N.trailPitch),Ne=N.bodyShift*N.fwdN,on=N.bodyShift*N.rightN,A=N.bodyDip,V=N.chestPitch}P.root.rotation.x=oe.legL.pitchX,I.root.rotation.x=oe.legR.pitchX,P.root.rotation.z=oe.legL.rollZ,I.root.rotation.z=oe.legR.rollZ,P.joint.rotation.x=oe.legL.kneeX,I.joint.rotation.x=oe.legR.kneeX,k.root.rotation.x=oe.armL,F.root.rotation.x=oe.armR,k.joint.rotation.x=-.18,F.joint.rotation.x=-.18,d.position.x=oe.pelvisX,d.position.y=_+oe.pelvisY,d.position.z=0,d.rotation.z=oe.pelvisRoll,m.rotation.z=oe.sideLean*(ot.intensity>0?.4:1);const nt=rf(d,u),Q=jt&&h.enabled?{...h,weight:1}:h,$=Q.enabled&&Q.weight>0?fn(Q.weight,0,1):0;if(d.position.x+=on,d.position.z+=Ne,d.position.y-=A,u.position.y+=A,$<=0&&(u.position.x-=on,u.position.z-=Ne),l){const Ht=Math.max(.004166666666666667,Math.min(mt,.1)),N=Math.sin(Z.bodyYaw),X=Math.cos(Z.bodyYaw),ft=fn((Z.velocity.x-ut)/Ht,-60,60),it=fn((Z.velocity.z-j)/Ht,-60,60),st=ft*N+it*X,Rt=Ie(Z.bodyYaw-J)/Ht,qt=l.maxForwardDeg*Math.PI/180,Pt=l.maxSideDeg*Math.PI/180,he=1-Math.exp(-Math.max(0,l.smoothing)*Ht);xt+=(fn(st*l.accelGain,-qt,qt)-xt)*he,tt+=(fn(-Rt*O*l.turnGain,-Pt,Pt)-tt)*he;const Qt=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;At+=(fn(O/Math.max(a,1e-6),0,1)-At)*(1-Math.exp(-Math.max(0,Qt)*Ht));const ie=sf({leanForward:xt,leanSide:tt,speedRatio:At},l);m.rotation.x+=xt+V,m.rotation.z+=tt,d.rotation.x+=ie.pelvisPitch,d.rotation.z+=ie.pelvisRoll,d.position.x+=ie.pelvisX,d.position.z+=ie.pelvisZ,d.position.y-=ie.crouch,u.position.y+=ie.crouch*(1-$)}ut=Z.velocity.x,j=Z.velocity.z,J=Z.bodyYaw,m.rotation.x+=ot.upperPitch,m.rotation.z+=ot.upperRoll,m.rotation.y+=ot.upperYaw;const Tt=fn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),It=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=fn(ot.upperShiftX*Tt,-It,It),m.position.z+=fn(ot.upperShiftZ*Tt,-It,It),d.position.x+=ot.comX,d.position.z+=ot.comZ-ot.pelvisBack,d.position.y-=ot.drop;const $t=ot.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=ot.pelvisBack*(1-$t),u.position.y+=ot.drop*(1-$t),P.joint.rotation.x+=ot.knee,I.joint.rotation.x+=ot.knee,P.root.rotation.x-=ot.hip,I.root.rotation.x-=ot.hip,k.root.rotation.x+=ot.arm,F.root.rotation.x+=ot.arm*.8,Z.attackPhase!=="idle"&&ot.intensity===0){const Ht=Z.attackProgress,N=Ht<.34?-1:Ht<.68?-1+(Ht-.34)/.34*2:Math.max(0,1-(Ht-.68)/.32),X=Math.max(0,-N),ft=Math.max(0,N);F.root.rotation.x=-1.7*X+1.25*ft,F.joint.rotation.x=-(.25+X*.45),m.rotation.y=-.28*N,C.opacity=Z.attackPhase==="active"?.85:0,Z.attackPhase==="active"&&(U.rotation.z=-1.1+Ht*3)}else C.opacity=0;const Xt=ju(wt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Xt,T.rotation.y=(Z.headYaw-Z.bodyYaw-Xt+Math.PI*3)%(Math.PI*2)-Math.PI,Ut=cf({root:f,pelvis:d,lower:u,limbs:D,base:nt,cfg:Q,grounded:!0,attacking:Z.attackPhase!=="idle"})},ik(){return Ut},dispose(){f.traverse(Z=>{if(Z instanceof fe){Z.geometry.dispose();const mt=Z.material;Array.isArray(mt)?mt.forEach(Kt=>Kt.dispose()):mt.dispose()}})}}}const wi=.012,Ti=.016;function HS(n,t){const e=t.lab,i=new be;i.name="test-lab";const s=[],a=[],o=[],r=[];function l(_){return o.push(_),_}function c(_){return r.push(_),_}function h(_,x,y,R=wi){const E=l(new He({color:x,transparent:!0,opacity:y,depthWrite:!1,side:Ce,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),S=new fe(_,E);return S.rotation.x=-Math.PI/2,S.position.y=R,S.renderOrder=2,S}function f(_,x){return c(new ia(Math.max(_,.001),x,72))}function d(_,x,y,R=Ti){const S=document.createElement("canvas"),T=S.getContext("2d");if(!T)return new fe;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,S.width=xh.ceilPowerOfTwo(Math.ceil(T.measureText(_).width)+32),S.height=xh.ceilPowerOfTwo(96*1.4);const M=S.getContext("2d");if(!M)return new fe;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=y,M.fillText(_,S.width/2,S.height/2);const P=new kc(S);P.colorSpace=nn,a.push(P);const I=S.width/S.height,k=c(new vn(x*I,x)),F=l(new He({map:P,transparent:!0,depthWrite:!1,side:Ce,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),D=new fe(k,F);return D.rotation.x=-Math.PI/2,D.position.y=R,D.renderOrder=3,D}function u(_,x,y,R,E,S){const T=y-x,b=c(new vn(T,R)),M=h(b,E,S,wi);M.position.set(T/2+x,wi,0);const P=new be;return P.add(M),P.rotation.y=_-Math.PI/2,P}function m(_,x,y,R,E){const S=new Nu;S.moveTo(0,x*.5),S.lineTo(-y*.5,x*.5-y*.9),S.lineTo(-y*.18,x*.5-y*.9),S.lineTo(-y*.18,-x*.5),S.lineTo(y*.18,-x*.5),S.lineTo(y*.18,x*.5-y*.9),S.lineTo(y*.5,x*.5-y*.9),S.closePath();const T=c(new ml(S)),b=h(T,R,E,wi+.002),M=new be;return M.add(b),M.rotation.y=_+Math.PI,M}function v(_){var T;const x=new be,y=d(`${_.index} · ${_.name}`,t.lab.labelTextHeight,"#eaf4ff"),E=((T=y.geometry.parameters)==null?void 0:T.width)??3;x.add(y);const S=h(c(new vn(E*.98,.08)),_.color,.7,Ti);return S.position.set(0,Ti,t.lab.labelTextHeight*.66),x.add(S),x.position.set(_.labelX,0,_.labelZ),x}const g=new be;for(const _ of n??[]){const x=new be;if(x.position.set(_.x,0,_.z),_.shape==="square"){const y=_.radius,R=h(c(new vn(y*2,y*2)),_.color,e.padOpacity*.09);x.add(R);const E=.07,S=[[0,y,y*2+E,E],[0,-y,y*2+E,E],[-y,0,E,y*2+E],[y,0,E,y*2+E]];for(const[T,b,M,P]of S){const I=h(c(new vn(M,P)),_.color,e.padOpacity);I.position.x=T,I.position.z=b,x.add(I)}}else x.add(h(c(new dl(_.radius,72)),_.color,e.padOpacity*.075)),x.add(h(f(_.radius-.075,_.radius),_.color,e.padOpacity));if(_.id==="hub"){for(let y=0;y<4;y++){const R=y*Math.PI/4,E=y%2===0;for(const S of[0,Math.PI])x.add(u(R+S,_.radius*.12,_.radius*.94,E?.09:.055,_.color,E?.5:.32))}x.add(h(f(.5,.56),_.color,.4))}else if(_.id==="dash"){const y=_.spawnZ-_.z,R=-_.radius+.5,E=y-R,S=h(c(new vn(.06,E)),_.color,.36);S.position.set(0,wi,(y+R)/2),x.add(S);let T=0;for(let M=y;M>=R-.01;M-=1,T++){const P=T%5===0,I=h(c(new vn(P?2.4:1.3,P?.1:.07)),_.color,P?.72:.42);I.position.set(0,wi,M),x.add(I);const k=d(String(T),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");k.position.set(1.6,Ti,M),x.add(k)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of b){const I=y-M,k=h(c(new vn(1.9,.09)),"#ffffff",.5);k.position.set(-1.5,wi,I),x.add(k);const F=d(P,.42,"rgba(220, 236, 250, 0.86)");F.position.set(-3,Ti,I),x.add(F)}}else if(_.id==="gait"){x.add(h(f(1.44,1.5),_.color,.5)),x.add(h(f(1.14,1.2),_.color,.22));const y=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[E,S,T]of R){const M=Math.sin(E),P=Math.cos(E),I=m(E,1.7,.34,T,.75);I.position.set(M*1.7*.5,0,y+P*1.7*.5),x.add(I);const k=d(S,.44,T);k.position.set(M*(1.7+.7),Ti,y+P*(1.7+.7)),x.add(k)}}if(g.add(x),e.showLabels){const y=v(_);s.push(y),g.add(y)}}i.add(g);const p=n==null?void 0:n.find(_=>_.id==="hub");if(p&&e.showLabels){const _=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,y,R]of _){const E=d(R,.4,"rgba(190, 224, 248, 0.8)");E.position.set(p.x+x*(p.radius+.7),Ti,p.z+y*(p.radius+.7)),i.add(E),s.push(E)}}return i.visible=e.enabled,{group:i,setVisible(_){i.visible=_},setLabelsVisible(_){for(const x of s)x.visible=_},dispose(){for(const _ of r)_.dispose();for(const _ of o)_.dispose();for(const _ of a)_.dispose();i.clear()}}}const _l=64,lf=[0,.24,.76,1],GS=[0,1,1,0],hf=[0,.12,.28,.5,.72,.88,1],VS=[0,.16,.5,1,.5,.16,0];function Rd(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function yl(n,t,e,i,s=_l,a="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=a==="glow"?hf:lf,c=a==="glow"?VS:GS,h=l.length,f=s+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/s,_=(p-.5)*e,x=Rd(p,i)*Rd(1-p,i),y=Math.sin(_),R=Math.cos(_);for(let E=0;E<h;E++){const S=o+(r-o)*l[E],T=g*h+E;d[T*3]=y*S,d[T*3+1]=0,d[T*3+2]=R*S;const b=x*c[E];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<s;g++)for(let p=0;p<h-1;p++){const _=g*h+p,x=_+h;m.push(_,x,_+1,_+1,x,x+1)}const v=new ze;return v.setAttribute("position",new je(d,3)),v.setAttribute("color",new je(u,4)),v.setIndex(m),v.computeBoundingSphere(),v}function Rr(n){const t=new He({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ce,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const s=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=yl(n.radius,n.thickness*f,h,n.edgeFade,_l,n.profile??"band");if(e.set(d,m),e.size>64){for(const[v,g]of e)if(v!==d&&g!==i){g.dispose(),e.delete(v);break}}return m};i=s(n.arcRad,1);const a=new fe(i,t);a.position.y=n.y,a.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:a,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=s(l,m),a.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),a.scale.set(h,1,h),a.rotation.y=d,a.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Cd(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function XS(n,t,e,i,s){const a=s.arcDeg*Math.PI/180,o=s.playerOpacity;if(!n)return{arcRad:a,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=s.selectedArcDeg*Math.PI/180,h=a+(c-a)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function WS(n,t,e,i,s){const a=Math.min(1,Math.max(0,s));return a<=.001?n.copy(t):a<.5?n.copy(t).lerp(e,a*2):n.copy(e).lerp(i,(a-.5)*2)}function $S(n=64,t=.06,e=5){const i=n+1,s=e+1,a=new Float32Array(i*s*3),o=new Float32Array(i*s*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<s;u++){const m=u/e,v=t+(1-t)*m,g=c*s+u;a[g*3]=f*v,a[g*3+1]=0,a[g*3+2]=d*v;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*s+h,d=f+s;r.push(f,d,f+1,f+1,d,d+1)}const l=new ze;return l.setAttribute("position",new je(a,3)),l.setAttribute("color",new je(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Pd(n){const t=n.segments??_l,e=n.profile??"band",s=((e==="glow"?hf.length:lf.length)-1)*6,a=yl(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ce,vertexColors:!0,toneMapped:!1}),r=new fe(a,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,a.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),v=Math.round(m*t),g=m>.001?Math.max(1,v)*s:0;g!==a.drawRange.count&&a.setDrawRange(0,g),l=v,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){a.dispose(),o.dispose()}}}function Dd(n){const t=new be,e=$S(48),i=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ce,vertexColors:!0,toneMapped:!1}),s=new fe(e,i);s.renderOrder=n.renderOrder??2,t.add(s);const a=Math.max(.01,n.edgeWidthRatio??.045),o=yl(1-a*.5,a,Math.PI*2,0,64,"band"),r=new He({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ce,vertexColors:!0,toneMapped:!1}),l=new fe(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const v=Math.min(1,Math.max(0,u));t.position.set(c,f,h),s.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=v*.26,r.opacity=v*(.72+.18*Math.sin(m*7)),t.visible=v>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Ld(n,t,e,i){if(i<=1e-4||e<=0)return t;const s=1-Math.exp(-e/i);return n+(t-n)*s}function YS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),s=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:s,urgency:.35+.65*s}}function ZS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function qS(n,t,e,i,s,a){return n!=="windup"||s<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*s,z:e+Math.cos(i)*s,radius:Math.max(.3,a)}}function jS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function KS(n,t,e){return n?t:e}function df(n){return{x:0,y:0,z:1}}function JS(n){return Math.asin(df().y)}function QS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const zc={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},tb=1e-6;function pn(n,t,e){return n<t?t:n>e?e:n}function Cr(n,t){const e=Math.max(.2,n);return pn(Math.pow(e,-t),.5,2)}function eb(n,t){if(!t.enabled)return{...zc};const e=pn(n.swing,-1,1),i=pn(n.charge,0,1),s=pn(n.impact,0,1),a=pn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=pn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-pn(t.impactSquash,0,.6)*s;u*=m;const v=Math.max(1,t.runLeg),p=(n.grounded?1+(v-1)*a:1)*(1-pn(t.impactSquash,0,.6)*s*.6),_=pn(t.torsoGain,0,1),x=1+(u-1)*_;return u=pn(u,.6,1.6),{arm:u,leg:pn(p,.6,1.4),torso:pn(x,.7,1.4),girthArm:Cr(u,t.volumeExp),girthLeg:Cr(p,t.volumeExp),girthTorso:Cr(x,t.volumeExp)}}function nb(n,t,e,i){const s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),a=(o,r)=>o+(r-o)*s;return{arm:a(n.arm,t.arm),leg:a(n.leg,t.leg),torso:a(n.torso,t.torso),girthArm:a(n.girthArm,t.girthArm),girthLeg:a(n.girthLeg,t.girthLeg),girthTorso:a(n.girthTorso,t.girthTorso)}}function ib(n,t,e){const i=n*Math.exp(-Math.max(tb,e)*Math.max(0,t));return i<.001?0:pn(i,0,1)}function ke(n,t,e){return n<t?t:n>e?e:n}const oi=1e-6;function Re(n,t,e,i){const s=new fe(new Dn(n,t,e),new sa({color:i}));return s.castShadow=!0,s.receiveShadow=!0,s}function Be(){return new be}function no(n,t,e){const i=Be(),s=Re(t*.7,.12,t*.7,e.wood);s.position.y=.06,i.add(s);const a=Re(t*2.4,.045,t*.8,e.metal);a.position.y=.13,i.add(a);const o=Re(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Re(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Re(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function sb(n){const t=no(.72,.15,n),e=Re(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function ab(n){const t=Be(),e=Re(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Re(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function ob(n){const t=Be(),e=Re(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Re(.15,.15,.15,n.glow);i.position.y=.92;const s=i.material;return s.emissive=new ee(n.glow),s.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function rb(n){const t=Be();for(let i=0;i<5;i++){const s=(i-2)*.15,a=Re(.055,.16,.05,n.wood);a.position.set(.16-Math.abs(s)*.46,s,0),t.add(a)}const e=Re(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function cb(n){const t=Be(),e=Re(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Re(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function lb(n,t,e,i,s,a,o,r,l,c,h){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},d=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},u=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},m=Be(),v=Be();v.name="pelvis",v.position.y=n.legLength,m.add(v);const g=Be();g.name="lower";const p=Be();p.name="upper",v.add(g),v.add(p);const _=n.headSize,x=n.legLength,y=n.armLength,R=n.limbThickness,E=n.bodyHeight,S=n.bodyWidth,T=Re(S,E,.28,t.body);T.position.y=E/2,p.add(T);const b=Be();b.name="headPivot",b.rotation.order="YXZ",b.position.y=i.headPivotHeight,p.add(b);const M=Re(_,_,_,t.head);M.position.y=_/2,b.add(M);const P=new sa({color:"#1b2733"});for(const N of[-1,1]){const X=new fe(new Dn(.06,.07,.02),P);X.position.set(N*.09,_/2+.03,_/2+.011),b.add(X)}const I=N=>{const X=Be();X.name=N<0?"hipL":"hipR",X.rotation.order="ZYX",X.position.set(N*(S/2-R/2),0,0),g.add(X);const ft=Re(R,x/2,R,t.limb);ft.position.y=-x/4,X.add(ft);const it=Be();it.name="knee",it.position.y=-x/2,X.add(it);const st=Re(R,x/2,R,t.limb);st.position.y=-x/4,it.add(st);const Rt=Re(R*1.15,.07,R*1.7,t.shoe);Rt.position.set(0,-x/2+.035,.045),it.add(Rt);const qt=new De;return qt.name="footTip",qt.position.y=-x/2,it.add(qt),{root:X,joint:it,hand:Be(),tip:qt,upperMesh:ft,lowerMesh:st,segLen:x/2}},k=N=>{const X=Be();X.name=N<0?"shoulderL":"shoulderR",X.rotation.order="ZYX",X.position.set(N*(S/2+R/2),E-.04,0),p.add(X);const ft=Re(R,y/2,R,t.limb);ft.position.y=-y/4,X.add(ft);const it=Be();it.name="elbow",it.position.y=-y/2,X.add(it);const st=Re(R,y/2,R,t.limb);st.position.y=-y/4,it.add(st);const Rt=Be();Rt.name=N<0?"handL":"handR",Rt.position.y=-y/2,it.add(Rt);const qt=Re(R*1.1,.09,R*1.1,t.head);return qt.position.y=.045,Rt.add(qt),{root:X,joint:it,hand:Rt,upperMesh:ft,lowerMesh:st,segLen:y/2}},F=I(-1),D=I(1),C=k(-1),U=k(1),B=[F,D].map(N=>({root:N.root,joint:N.joint,tip:N.tip,upperLen:x/2,lowerLen:x/2,bend:1})),W=Be(),et=Be();W.name="mountR",et.name="mountL",U.hand.add(W),C.hand.add(et);const gt=ob(t),ht=rb(t),ut=cb(t),j={"sword-shield":{right:no(.42,.075,t),left:ab(t)},"dual-swords":{right:no(.42,.075,t),left:no(.42,.075,t)},greatsword:{right:sb(t),left:Re(.12,.2,.12,t.wood)},staff:{right:gt.g,left:Be(),orb:gt.orb},bow:{right:ut,left:ht.g,arrow:ut,drawString:ht.drawString}};for(const N of Object.keys(j))W.add(j[N].right),et.add(j[N].left),j[N].right.visible=!1,j[N].left.visible=!1;function J(N,X,ft){const it=new De;it.name="bladeBase",it.position.y=X,N.add(it);const st=new De;st.name="bladeTip",st.position.y=ft,N.add(st)}J(j["sword-shield"].right,.4,.55),J(j["dual-swords"].right,.4,.55),J(j["dual-swords"].left,.4,.55),J(j.greatsword.right,.64,.85),J(j.staff.right,.7,.92);let xt=null,tt=0,At=0,Ut=0,vt=0,Yt=0,_t=0,Wt=US(),G={...vl},le=0,Ot=0,kt=0,bt=-1,wt=0,Ft=0,L=0,w=0,Y=0,rt=0,dt=0,at=1,Lt=0,Z=0,mt=0,Kt=!1,ot=0,yt=0,O=0,ct=0,pt="none",zt=0,Vt=1,Bt=!1,z=-1,Mt=!1,K=0,lt=0,Et=0,St={...zc},Zt=0,ne=0,se={active:!1,dist:0,gy:0,pitch:0,joint:0},te=0,ge=0,pe=1,Ye={speed:0,phase:0},Ze={lp:0,lr:0,rp:0,rr:0},Ae=0,Ee=0,Le=!0,q=0,Dt="none",Ct=0,Jt=0,jt=0,ae=.3,oe=0;function on(N){const X=Math.PI/180,ft=a;let it=0,st=0,Rt=0,qt=0;N==="sword-shield"?(it=ft.swordPitchDeg*X,st=-ft.swordYawDeg*X,Rt=ft.shieldPitchDeg*X):N==="dual-swords"?(it=ft.swordPitchDeg*X,st=-ft.swordYawDeg*X,Rt=ft.swordPitchDeg*X,qt=ft.swordYawDeg*X):N==="greatsword"?(it=ft.greatswordPitchDeg*X,st=-ft.greatswordYawDeg*X,Rt=ft.greatswordPitchDeg*X,qt=ft.greatswordYawDeg*X):N==="staff"?it=ft.staffPitchDeg*X:Rt=ft.bowPitchDeg*X,W.rotation.set(it,0,st),et.rotation.set(Rt,0,qt),W.position.x=N==="greatsword"?-Math.max(0,a.twoHandInsetX??0):0}function Ne(N){if(N!==xt){xt=N;for(const X of Object.keys(j))j[X].right.visible=X===N,j[X].left.visible=X===N;on(N),ht.drawString.position.z=-.06,ut.position.z=0,gt.orb.scale.setScalar(1),p.rotation.y=0}}Ne("sword-shield");const A=[];m.traverse(N=>{N instanceof fe&&N.material instanceof sa&&A.push(N.material)});const V=new ee(r.flashColor);function nt(N,X){const ft=nf(N,X,r);Wt=ft,p.rotation.x+=ft.upperPitch,p.rotation.z+=ft.upperRoll,p.rotation.y+=ft.upperYaw;const it=ke(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),st=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;p.position.x+=ke(ft.upperShiftX*it,-st,st),p.position.z+=ke(ft.upperShiftZ*it,-st,st),v.position.x+=ft.comX,v.position.z+=ft.comZ-ft.pelvisBack,v.position.y-=ft.drop;const Rt=ft.legacy?0:ke(r.lowerScale,0,1);g.position.z+=ft.pelvisBack*(1-Rt),g.position.y+=ft.drop*(1-Rt),F.joint.rotation.x+=ft.knee,D.joint.rotation.x+=ft.knee,F.root.rotation.x-=ft.hip,D.root.rotation.x-=ft.hip,C.root.rotation.x+=ft.arm,U.root.rotation.x+=ft.arm*.8;for(const qt of A)qt.emissive.copy(V).multiplyScalar(ft.flash)}function Q(N){return N<.3?-1:N<.62?-1+(N-.3)/.32*2:Math.max(0,1-(N-.62)/.38)}function $(N){for(const X of[C,U])X.upperMesh.scale.set(N.girthArm,N.arm,N.girthArm),X.upperMesh.position.y=-X.segLen/2*N.arm,X.joint.position.y=-X.segLen*N.arm,X.lowerMesh.scale.set(N.girthArm,N.arm,N.girthArm),X.lowerMesh.position.y=-X.segLen/2*N.arm,X.hand.position.y=-X.segLen*N.arm;for(const X of[F,D])X.upperMesh.scale.set(N.girthLeg,N.leg,N.girthLeg),X.upperMesh.position.y=-X.segLen/2*N.leg,X.joint.position.y=-X.segLen*N.leg,X.lowerMesh.scale.set(N.girthLeg,N.leg,N.girthLeg),X.lowerMesh.position.y=-X.segLen/2*N.leg,X.tip.position.y=-X.segLen*N.leg;T.scale.set(N.girthTorso,N.torso,N.girthTorso),T.position.y=E/2*N.torso}function Tt(N){const X=a.twoHandGripY??-.16,ft=Math.max(1,a.twoHandMaxStretch??1.25),it=y*ft*.99,st=C.root.position.x,Rt=C.root.position.y,qt=C.root.position.z;let Pt={x:0,y:0,z:0},he=1/0,Qt=X;for(let Oe=0;Oe<5;Oe++){const gn=W.localToWorld(new H(0,Qt,0)),Xe=p.worldToLocal(gn.clone());if(Pt={x:Xe.x-st,y:Xe.y-Rt,z:Xe.z-qt},he=Math.hypot(Pt.x,Pt.y,Pt.z),!Number.isFinite(he)||he<=oi)return;if(he<=it)break;Qt*=.45}const ie=ke(he/Math.max(oi,y),1,ft),we=y/2*ie,ye=af(Pt,we,we,-1),Ke=of({rootPitch:C.root.rotation.x,rootRoll:C.root.rotation.z,jointPitch:C.joint.rotation.x},ye,N,.55);C.root.rotation.x=Ke.rootPitch,C.root.rotation.z=Ke.rootRoll,C.joint.rotation.x=Math.min(Ke.jointPitch,-.06);const ue=1/Math.sqrt(ie);C.upperMesh.scale.set(ue,ie,ue),C.upperMesh.position.y=-we/2,C.joint.position.y=-we,C.lowerMesh.scale.set(ue,ie,ue),C.lowerMesh.position.y=-we/2,C.hand.position.y=-we,se={active:!0,dist:he,gy:Qt,pitch:Ke.rootPitch,joint:C.joint.rotation.x}}function It(N){if(N.phase==="idle"||N.charging)return;const X=N.attackProgress,ft=Q(X),it=Math.max(0,ft),st=N.comboIndex%2===0?1:-1,Rt=l.stride,qt=Number.isFinite(Rt.stepReach)?Rt.stepReach:.17,Pt=Number.isFinite(Rt.stepSideReach)?Rt.stepSideReach:.14,he=Number.isFinite(Rt.stepDipReach)?Rt.stepDipReach:.05,Qt=N.weapon==="greatsword"?ke(Number.isFinite(Rt.heavyScale)?Rt.heavyScale:1,0,1):1;v.position.z+=qt*it*Qt,v.position.x+=st*Pt*it*Qt,v.position.y-=he*Math.sin(Math.PI*X)*Qt}function $t(N){if(ht.drawString.position.z=-.06,ut.position.z=0,gt.orb.scale.setScalar(1),p.rotation.y=0,N.charging&&N.weapon==="bow"){const st=N.charge;C.root.rotation.x=-1.25,C.joint.rotation.x=-.15,U.root.rotation.x=.35+st*.3,U.joint.rotation.x=-1.15,ht.drawString.position.z=-.06-st*.22,ut.position.z=-st*.3,p.rotation.y=-.22;return}if(N.phase==="idle")return;const X=Q(N.attackProgress),ft=Math.max(0,-X),it=Math.max(0,X);if(N.weapon==="bow")C.root.rotation.x=-1.2,C.joint.rotation.x=-.15,U.root.rotation.x=.9-it*.8,U.joint.rotation.x=-.3;else if(N.weapon==="greatsword"){const st=-1.6*ft+1.25*it,Rt=ke(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);U.root.rotation.x=st,U.joint.rotation.x=-(.25+ft*.4),C.root.rotation.x=st+.06,C.joint.rotation.x=-(.32+ft*.4),C.root.rotation.z=.42,U.root.rotation.z=0;const qt=-Math.sin(U.root.rotation.x);U.root.rotation.y=-.72*Math.tanh(qt*4),p.rotation.y=-.2*X*Rt}else{const st=N.comboIndex;if(st===1)U.root.rotation.x=-1.7*ft+1.1*it,U.joint.rotation.x=-(.2+ft*.5),C.root.rotation.x=.1,p.rotation.y=-.18*X;else if(st===2)C.root.rotation.x=-1.5*ft+1*it,C.joint.rotation.x=-(.2+ft*.5),U.root.rotation.x=.2,p.rotation.y=.45*-X;else{const Rt=-1.9*ft+1.2*it;C.root.rotation.x=Rt,U.root.rotation.x=Rt,C.joint.rotation.x=-(.15+ft*.4),U.joint.rotation.x=-(.15+ft*.4),p.rotation.y=-.3*X}}It(N)}function Xt(N,X){N&&(U.root.rotation.x=-1.05,U.joint.rotation.x=-.35,C.root.rotation.x=-.45,C.joint.rotation.x=-.2,p.rotation.y=-.12,gt.orb.scale.setScalar(1.25+.12*Math.sin(X*2)))}function Ht(N){if(!N||N.phase==="idle")return;const X=N.progress,ft=X<.3?-.35+X/.3*1.35:X<.7?1:Math.max(0,1-(X-.7)/.3),it=Math.PI/180;p.rotation.x+=d.leanDeg*it*ft,C.root.rotation.x-=d.shieldPitchDeg*it*ft,C.joint.rotation.x-=.22*ft,U.root.rotation.x-=.3*ft,v.position.z+=d.pelvisReach*Math.max(0,ft)}return{group:m,update(N,X,ft,it,st=!1,Rt,qt,Pt){Ne(X.weapon),p.rotation.x=0,p.rotation.z=0,v.position.x=0,v.position.y=x,v.position.z=0,v.rotation.z=0,v.rotation.x=0,p.position.x=0,p.position.y=0,p.position.z=0,g.position.x=0,g.position.y=0,g.position.z=0,g.rotation.z=0;const he=Math.max(1/240,Math.min(it,.1)),Qt=Rt===void 0?Ae+=it:Rt;Ee=Qt;const ie=l.landing;ie.enabled?Le&&!N.grounded?(Dt="jump",Ct=Qt,Jt=ie.anticipationDuration,jt=Math.max(0,ie.jumpAnticipation),ae=.32):!Le&&N.grounded&&(Dt="land",Ct=Qt,Jt=ie.duration,jt=FS(q,ie),ae=ie.compressRatio,oe=q):(Dt="none",jt=0),Qt<Ct&&(Dt="none",jt=0),Le=N.grounded,q=N.velocity.y;const we=Ad(Qt,Ct,Jt,jt,ae),ye=X.phase!=="idle",Ke=(Pt==null?void 0:Pt.phase)==="active";te=LS(te,ye,he,l.attack.blendRate);const ue=kS(te,l.attack.gaitWeight,l.attack.lowerBodyWeight);ge=ue.attackLegWeight,pe=ue.gaitScale;const Oe=Math.sin(N.bodyYaw),gn=Math.cos(N.bodyYaw),Xe=(N.velocity.x-tt)/he,Ln=(N.velocity.z-At)/he,kn=ke(Xe,-60,60),ca=ke(Ln,-60,60),uf=kn*Oe+ca*gn,ff=Ie(N.bodyYaw-Ut)/he,pf=Math.hypot(N.velocity.x,N.velocity.z),Ml=o.maxForwardDeg*Math.PI/180,Sl=o.maxSideDeg*Math.PI/180,mf=ke(uf*o.accelGain,-Ml,Ml),gf=ke(-ff*pf*o.turnGain,-Sl,Sl),bl=1-Math.exp(-o.smoothing*he);vt+=(mf-vt)*bl,Yt+=(gf-Yt)*bl,tt=N.velocity.x,At=N.velocity.z,Ut=N.bodyYaw;const Sn=Math.hypot(N.velocity.x,N.velocity.z),Co=ke(s.knockGaitScale??0,0,1),xf=ft.knockX*Co,vf=ft.knockZ*Co,_f=Co>0&&Math.hypot(ft.knockX,ft.knockZ)>.001,Po=N.velocity.x+xf,Do=N.velocity.z+vf,El=Math.hypot(Po,Do);ct=El;const yf=Math.cos(N.bodyYaw),Mf=-Math.sin(N.bodyYaw),Sf=N.velocity.x*yf+N.velocity.z*Mf,wl=Sn>oi?ke(Sf/Sn,-1,1):0,Tl=Sn>oi?ke((N.velocity.x*Oe+N.velocity.z*gn)/Sn,-1,1):1,bf=gl(Tl,s.backStrafeStartDeg,s.backStrafeFullDeg);pt==="settled"&&Mt&&K>lt*1.02+1e-4&&(pt="none");let As=1;pt==="blend"?(As=Ju(Bt?z:zt,s.stopYawBlendMode,Bt),Bt||(zt=Math.min(1,zt+he/Math.max(.01,s.stopYawAfterSec)),(zt>=1||s.stopYawBlendMode==="inStop"||Mt)&&(pt="settled",As=0))):pt==="settled"&&(As=ke(Sn/Math.max(oi,s.stopEnterRatio*e),0,1)),Vt=As;const Ef=Yu(wl,i.legYawScale,i.hipYawMaxDeg,s.strafeHipBoost),wf=Zu(Tl,wl,Ef,bf)*As;Ot+=(wf-Ot)*(1-Math.exp(-i.hipYawSmoothing*he));const Rs=N.bodyYaw+Ot;kt=Rs;const Tf=Math.sin(Rs),Af=Math.cos(Rs),Rf=Math.cos(Rs),Cf=-Math.sin(Rs),la={speed:El,phase:N.gaitPhase,localForward:Po*Tf+Do*Af,localRight:Po*Rf+Do*Cf,stride:N.stride};ye&&!Kt&&(mt=N.gaitPhase),Kt=ye;const Bi=te>0?PS(la,X.attackProgress,X.comboIndex,te,l.stride,mt):la;Ye=Bi;const Al=Math.max(0,s.stopBlendSec||0),Rl=Al>0&&!ye&&!_f&&N.grounded,Lo=qu(Sn,Lt,e,s.stopEnterRatio,s.stopExitRatio);if(!Rl||Lo.resume)bt=-1;else if(bt<0&&Lo.enter){bt=0,wt=N.gaitPhase,Ft=Wu(N.gaitPhase),L=Sn,w=Math.max(N.stride,oi),Y=la.localForward,rt=la.localRight;const Me=1/Math.max(oi,Sn);dt=N.velocity.x*Me,at=N.velocity.z*Me}const Pf=Lt;Lt=Sn;const gi=Rl&&bt>=0;gi&&(bt=Math.min(1,bt+he/Al)),gi&&pt!=="blend"&&(pt="blend",zt=0),Bt=gi&&bt<1,z=bt,Mt=Lo.resume,K=Sn,lt=Pf;const Cl=gi?{phase:wt,speed:L,moveSpeed:e,localForward:Y,localRight:rt,legLength:n.legLength,stride:w,grounded:!0}:{phase:Bi.phase,speed:Bi.speed,moveSpeed:e,localForward:Bi.localForward,localRight:Bi.localRight,legLength:n.legLength,stride:Bi.stride??0,grounded:N.grounded},Df=gi?$u(Cl,s,{progress:bt,phase0:wt,phaseEnd:Ft}):xl(Cl,s),xe=IS(Df,ue.gaitScale);if(Et=0,Ke&&Pt){const Me=AS(Pt.progress,Pt.dir,s),de=ue.gaitScale;xe.legL.pitchX+=Me.legL.pitchX*de,xe.legL.rollZ+=Me.legL.rollZ*de,xe.legL.kneeX+=Me.legL.kneeX*de,xe.legR.pitchX+=Me.legR.pitchX*de,xe.legR.rollZ+=Me.legR.rollZ*de,xe.legR.kneeX+=Me.legR.kneeX*de,xe.pelvisY+=Me.pelvisY*de,Et=Me.env}let ko=0,Io=0,Fo=0,Pl=0;if(gi){const Me=Ku(N.bodyYaw,dt,at),de=Qu(bt,wt,Me.forward,Me.right,s);de.leadLeft?(xe.legL.pitchX-=de.leadPitch,xe.legL.kneeX+=de.leadKnee,xe.legR.pitchX+=de.trailPitch):(xe.legR.pitchX-=de.leadPitch,xe.legR.kneeX+=de.leadKnee,xe.legL.pitchX+=de.trailPitch),Io=de.bodyShift*de.fwdN,ko=de.bodyShift*de.rightN,Fo=de.bodyDip,Pl=de.chestPitch,ot=de.leadPitch,yt=de.bodyShift,O=de.bodyDip}else ot=0,yt=0,O=0;Ze={lp:xe.legL.pitchX,lr:xe.legL.rollZ,rp:xe.legR.pitchX,rr:xe.legR.rollZ},N.grounded?(F.root.rotation.x=xe.legL.pitchX,D.root.rotation.x=xe.legR.pitchX,F.root.rotation.z=xe.legL.rollZ,D.root.rotation.z=xe.legR.rollZ,F.joint.rotation.x=xe.legL.kneeX,D.joint.rotation.x=xe.legR.kneeX,C.root.rotation.x=xe.armL,U.root.rotation.x=xe.armR,C.joint.rotation.x=-(.18+xe.armL*.2),U.joint.rotation.x=-(.18+xe.armR*.2),C.root.rotation.z=0,U.root.rotation.z=0,C.root.rotation.y=0,U.root.rotation.y=0,v.position.x=xe.pelvisX,v.position.y=x+xe.pelvisY,v.position.z=0,v.rotation.z=xe.pelvisRoll):(F.root.rotation.x=-.55,D.root.rotation.x=-.25,F.joint.rotation.x=.75,D.joint.rotation.x=.55,C.root.rotation.x=-.9,U.root.rotation.x=-.7,C.joint.rotation.x=-.6,U.joint.rotation.x=-.6,F.root.rotation.z=0,D.root.rotation.z=0);const Lf=rf(v,g),Cs=Ke?{...f,weight:0}:gi&&f.enabled?{...f,weight:1}:f,Dl=Cs.enabled&&N.grounded&&Cs.weight>0?ke(Cs.weight,0,1)*(ye?ke(Cs.attackScale,0,1):1):0;v.position.x+=ko,v.position.z+=Io,v.position.y-=Fo,g.position.y+=Fo,Dl<=0&&(g.position.x-=ko,g.position.z-=Io);const Ll=Sn/Math.max(e,oi),kf=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,If=1-Math.exp(-Math.max(0,kf)*he);le+=(ke(Ll,0,1)-le)*If;const Hi=sf({leanForward:vt,leanSide:Yt,speedRatio:le},o);v.rotation.x+=Hi.pelvisPitch,v.rotation.z+=Hi.pelvisRoll,v.position.x+=Hi.pelvisX,v.position.z+=Hi.pelvisZ,v.position.y-=Hi.crouch,g.position.y+=Hi.crouch*(1-ke(Dl,0,1)),$t(X),Xt(st,N.gaitPhase),Ht(qt);const Ff=a.greatswordPitchDeg*Math.PI/180,kl=X.weapon==="greatsword",Il=Math.hypot(N.velocity.x,N.velocity.z),Uf=kl&&X.phase==="idle"&&Il>.5?Math.min(1.15,Il/Math.max(e,.001)*.9):0;_t+=(Uf-_t)*(1-Math.exp(-6*he)),kl&&(W.rotation.x=Ff+_t),X.weapon==="bow"&&(ht.g.rotation.x=-(C.root.rotation.x+C.joint.rotation.x),ut.rotation.x=-(U.root.rotation.x+U.joint.rotation.x));const zf=p.rotation.y;nt(ft,N.bodyYaw);const Fl=ft.type==="none"?1:.4;if(p.rotation.x+=vt*Fl+Pl,p.rotation.z+=(Yt+xe.sideLean)*Fl,we>0&&(F.root.rotation.x-=ie.hipPitch*we,D.root.rotation.x-=ie.hipPitch*we,F.joint.rotation.x+=ie.kneeBend*we,D.joint.rotation.x+=ie.kneeBend*we,v.position.y-=ie.crouchDepth*we,g.position.y+=ie.crouchDepth*(1-ie.lowerScale)*we,p.rotation.x+=ie.upperPitch*we,C.root.rotation.x-=ie.armTuck*we,U.root.rotation.x-=ie.armTuck*we),ge>0&&N.grounded){const Me=DS(X.attackProgress,X.comboIndex,l.stride),de=ge;F.root.rotation.x+=Me.legL.pitchX*de,D.root.rotation.x+=Me.legR.pitchX*de,F.root.rotation.z+=Me.legL.rollZ*de,D.root.rotation.z+=Me.legR.rollZ*de,F.joint.rotation.x+=Me.legL.kneeX*de,D.joint.rotation.x+=Me.legR.kneeX*de,v.position.x+=Me.pelvisX*de,v.position.y+=Me.pelvisY*de,v.rotation.z+=Me.pelvisRoll*de}if(u.enabled){const Me=X.phase!=="idle"&&!X.charging,de=Me?Q(X.attackProgress):0;Me&&ne>.55&&de<ne-1e-4&&(Zt=1),ne=de,Zt=ib(Zt,he,u.impactDecay);const Of=eb({swing:de,charge:X.charging?X.charge:0,impact:Zt,speedRatio:Ll,grounded:N.grounded},u);St=nb(St,Of,he,u.smoothing)}else St={...zc};$(St),g.rotation.y=Ot,Z=ju(Ot,s.chestYawScale,s.chestYawMaxDeg),p.rotation.y+=Z;const Nf=zf;b.rotation.y=Ie(N.headYaw-N.bodyYaw-Nf-Z),b.rotation.x=-ke(N.headPitch??0,-.7,.7),p.rotation.x+=-ke(N.bodyPitch??0,-.4,.4),X.weapon==="greatsword"&&X.phase!=="idle"&&!X.charging&&(m.updateWorldMatrix(!0,!0),Tt(ke(te,0,1))),G=cf({root:m,pelvis:v,lower:g,limbs:B,base:Lf,cfg:Cs,grounded:N.grounded,attacking:ye})},lean(){return{forward:vt,side:Yt}},landing(){const N=Ad(Ee,Ct,Jt,jt,ae),X=Jt>0?Math.max(0,Jt-Math.max(0,Ee-Ct)):0;return{pulse:N,remaining:X,kind:N>0?Dt:"none",impactVy:oe}},hurt(){return Wt},ik(){return G},stretch(){return{...St,impact:Zt}},gripDebug(){return{...se}},attackBlend(){return te},attackWeights(){return{gaitScale:pe,attackLegWeight:ge,driveSpeed:Ye.speed,stridePhase:Ye.phase}},hipYaw(){return Ot},gaitDebug(){return{stopT:bt,hipYaw:Ot,chestYaw:Z,speed:Lt,gaitSpeed:ct,stopStep:ot,stopShift:yt,stopDip:O,stopYawFade:Vt,turnStep:Et,legLPitch:Ze.lp,legLRoll:Ze.lr,legRPitch:Ze.rp,legRRoll:Ze.rr}},gaitYaw(){return kt},arrowDirection(){ut.updateWorldMatrix(!0,!1);const N=ut.matrixWorld.elements,X=N[8],ft=N[9],it=N[10],st=Math.hypot(X,ft,it)||1;return{x:X/st,y:ft/st,z:it/st}},weaponBlade(){if(!xt)return null;const N=j[xt].right,X=N.getObjectByName("bladeBase"),ft=N.getObjectByName("bladeTip");if(!X||!ft)return null;X.updateWorldMatrix(!0,!1),ft.updateWorldMatrix(!0,!1);const it=X.getWorldPosition(new H),st=ft.getWorldPosition(new H);return{base:{x:it.x,y:it.y,z:it.z},tip:{x:st.x,y:st.y,z:st.z}}},dispose(){m.traverse(N=>{if(N instanceof fe){N.geometry.dispose();const X=N.material;Array.isArray(X)?X.forEach(ft=>ft.dispose()):X.dispose()}})}}}function hb(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new ze,i=new Float32Array(t*2*3),s=new Float32Array(t*2*3),a=new je(i,3),o=new je(s,3);a.setUsage(ph),o.setUsage(ph),e.setAttribute("position",a),e.setAttribute("color",o);const r=[];for(let _=0;_<t-1;_++){const x=_*2,y=x+1,R=x+2,E=x+3;r.push(x,y,R,y,E,R)}e.setIndex(r),e.setDrawRange(0,0);const l=new He({vertexColors:!0,transparent:!0,opacity:1,blending:ri,depthWrite:!1,side:Ce}),c=new fe(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ee(n.color);let f=[],d=null,u=0,m=0,v=!1,g=!1;function p(){const _=f.length;if(_<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const x=Math.max(.001,n.life);for(let y=0;y<_;y++){const R=f[y],E=Math.max(0,1-R.age/x),S=E*E,T=Math.min(1,R.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*S*(.55+.45*T),M=y*6;i[M]=R.bx,i[M+1]=R.by,i[M+2]=R.bz,i[M+3]=R.tx,i[M+4]=R.ty,i[M+5]=R.tz;const P=h.r*b,I=h.g*b,k=h.b*b,F=P*.22,D=I*.22,C=k*.22;s[M]=F,s[M+1]=D,s[M+2]=C;const U=1+n.tipBoost;s[M+3]=Math.min(1,P*U),s[M+4]=Math.min(1,I*U),s[M+5]=Math.min(1,k*U)}a.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(_-1)*6),c.visible=!0}return{object:c,update(_,x,y){if(!n.enabled){c.visible=!1;return}const R=Math.max(0,_);for(const E of f)E.age+=R;for(;f.length>0&&f[0].age>n.life;)f.shift();if(x){const E=d?Math.hypot(x.tip.x-d.x,x.tip.y-d.y,x.tip.z-d.z)/Math.max(1e-4,R):0,S=f[f.length-1],T=S?Math.hypot(x.tip.x-S.tx,x.tip.y-S.ty,x.tip.z-S.tz):1/0;if(y&&T>=n.minStep)for(f.push({bx:x.base.x,by:x.base.y,bz:x.base.z,tx:x.tip.x,ty:x.tip.y,tz:x.tip.z,age:0,speed:E});f.length>t;)f.shift();d={x:x.tip.x,y:x.tip.y,z:x.tip.z},u=E,m=T,v=!0}else d=null,v=!1,u=0,m=0;g=y,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:v,active:g}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function db(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function ub(n,t,e,i){const s=Math.max(1,n.clientWidth),a=Math.max(1,n.clientHeight),o=new UM({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=nu,o.setSize(s,a,!1),n.appendChild(o.domElement);const r=new zM;r.background=new ee("#12161d"),r.add(new vS(11061486,2764600,1.15));const l=new MS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new be;for(const q of t.boxes){const Dt=q.maxX-q.minX,Ct=q.maxY-q.minY,Jt=q.maxZ-q.minZ;let jt=db(q.kind,e);q.kind==="step"&&(jt=new ee(jt).offsetHSL(0,0,q.maxY*.09).getStyle());const ae=new sa({color:jt,transparent:!0,opacity:1}),oe=new fe(new Dn(Dt,Ct,Jt),ae);oe.position.set((q.minX+q.maxX)/2,(q.minY+q.maxY)/2,(q.minZ+q.maxZ)/2),oe.castShadow=q.kind!=="ground",oe.receiveShadow=!0,oe.add(new ku(new QM(oe.geometry),new cl({color:10467020,transparent:!0,opacity:.32}))),f.add(oe),h.push(ae)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new bS(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=HS(i,e);r.add(m.group);const v=lb(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links),g=hb(e.weaponTrail);r.add(g.object);const p=new be,_=.9,x=new be;x.position.y=_,v.group.position.y=-_,x.add(v.group),p.add(x),r.add(p);const y=t.dummies.map((q,Dt)=>{const Ct=e.dummies.colors,Jt=Ct[Dt%Ct.length]??"#cccccc",jt=BS(e.voxel,e.colors,Jt,q.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return jt.group.traverse(ae=>{ae.userData.dummyId=q.id}),r.add(jt.group),jt}),R=y.map(q=>q.group),E=new SS,S=e.groundRing,T=e.voxel.bodyWidth,b=Cd(T,S.playerRadiusFactor),M=Cd(T,S.dummyRadiusFactor),P=T*S.thicknessFactor,I=S.arcDeg*Math.PI/180;let k=0;const F=Rr({radius:b,thickness:P,arcRad:I,edgeFade:S.edgeFade,color:S.playerColor,opacity:S.playerOpacity,y:.028,renderOrder:6});F.mesh.name="player-ground-ring",r.add(F.mesh);const D=t.dummies.map(q=>{const Dt=Rr({radius:M,thickness:P,arcRad:I,edgeFade:S.edgeFade,color:S.neutralColor,opacity:S.opacity,y:.022,renderOrder:5});return Dt.mesh.name=`dummy-ground-ring-${q.id}`,r.add(Dt.mesh),Dt}),C=t.dummies.map(q=>{const Dt=Rr({radius:M*S.haloRadiusFactor,thickness:P*S.haloThicknessFactor,arcRad:I,edgeFade:S.edgeFade,color:S.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Dt.mesh.name=`dummy-ground-halo-${q.id}`,r.add(Dt.mesh),Dt}),U=t.dummies.map(()=>0),B=t.dummies.map(()=>0),W=Pd({radius:b*S.meterRadiusFactor,thickness:P*S.meterThicknessFactor,arcRad:I,edgeFade:.06,color:S.meterColorCharge,y:.03,renderOrder:8});W.mesh.name="player-ground-meter",r.add(W.mesh);const et=t.dummies.map(q=>{const Dt=Pd({radius:M*S.warnRadiusFactor,thickness:P*S.warnThicknessFactor,arcRad:I,edgeFade:.02,color:S.warnColor,y:.031,renderOrder:9});return Dt.mesh.name=`dummy-ground-warn-${q.id}`,r.add(Dt.mesh),Dt}),gt=Dd({color:S.playerColor,y:.042,renderOrder:3});gt.group.name="player-landing-preview",r.add(gt.group);const ht=new ee,ut=new ee(S.playerColor),j=new ee(S.neutralColor),J=new ee(S.lowThreatColor),xt=new ee(S.highThreatColor),tt=new ee(S.meterColorCharge),At=new ee(S.meterColorChannel),Ut=new ee(S.meterColorCooldown),vt=new ee(S.warnColor),Yt=new be;r.add(Yt);const _t=e.projectiles;function Wt(){const Dt=document.createElement("canvas");Dt.width=64,Dt.height=64;const Ct=Dt.getContext("2d");if(Ct){const jt=Ct.createRadialGradient(32,32,0,32,32,32);jt.addColorStop(0,"rgba(255,255,255,1)"),jt.addColorStop(.28,"rgba(255,255,255,0.72)"),jt.addColorStop(.62,"rgba(255,255,255,0.22)"),jt.addColorStop(1,"rgba(255,255,255,0)"),Ct.fillStyle=jt,Ct.fillRect(0,0,64,64)}const Jt=new kc(Dt);return Jt.colorSpace=nn,Jt}function G(){const Ct=document.createElement("canvas");Ct.width=2,Ct.height=64;const Jt=Ct.getContext("2d");if(Jt){const ae=Jt.createLinearGradient(0,0,0,64);ae.addColorStop(0,"rgba(255,255,255,0)"),ae.addColorStop(.55,"rgba(255,255,255,0.35)"),ae.addColorStop(1,"rgba(255,255,255,0.95)"),Jt.fillStyle=ae,Jt.fillRect(0,0,2,64)}const jt=new kc(Ct);return jt.colorSpace=nn,jt}const le=Wt(),Ot=G(),kt=new He({color:12577023,transparent:!0,opacity:0,side:Ce,depthWrite:!1}),bt=new He({color:14217983,transparent:!0,opacity:0,side:Ce,depthWrite:!1,blending:ri}),wt=new be;wt.position.set(0,.95,.72),Yt.add(wt);const Ft=new be;Ft.rotation.x=JS(e.camera.pitchDeg),wt.add(Ft);const L=new Ro(.78,_t.slashThickness,6,28,Math.PI*1.15),w=new be,Y=new fe(L,kt),rt=new fe(L,bt);rt.scale.setScalar(1.09),rt.renderOrder=4,w.add(Y,rt),Ft.add(w);const dt=new Dn(_t.arrowWidth,_t.arrowWidth,_t.arrowLength),at=new ul(_t.arrowHeadSize*.42,_t.arrowHeadSize,4);at.rotateX(Math.PI/2);const Lt=new Dn(_t.arrowWidth*2.6,_t.arrowWidth*.4,.1),Z=new Qs(_t.arrowWidth*.45,_t.arrowWidth*1.3,_t.trailLength,6,1,!0);Z.rotateX(-Math.PI/2),Z.translate(0,0,-_t.trailLength/2);const mt=Array.from({length:10},()=>{const q=new be,Dt=new He({color:_t.arrowColor,transparent:!0}),Ct=new He({color:_t.arrowHeadColor,transparent:!0}),Jt=new Lc({map:le,color:_t.arrowColor,transparent:!0,opacity:.85,blending:ri,depthWrite:!1}),jt=new He({color:_t.arrowTrailColor,map:Ot,transparent:!0,opacity:0,blending:ri,depthWrite:!1,side:Ce}),ae=new fe(dt,Dt),oe=new fe(at,Ct);oe.position.z=_t.arrowLength/2+_t.arrowHeadSize*.42;const on=new fe(Lt,Ct),Ne=new fe(Lt,Ct);on.position.z=-_t.arrowLength/2+.08,Ne.position.z=on.position.z,Ne.rotation.z=Math.PI/2;const A=new dd(Jt);A.scale.setScalar(_t.arrowGlowSize),A.renderOrder=6;const V=new fe(Z,jt);return V.renderOrder=5,q.add(ae,oe,on,Ne,A,V),q.visible=!1,r.add(q),{group:q,shaftMat:Dt,tipMat:Ct,glowMat:Jt,trailMat:jt,glow:A,trail:V,arrowId:0,bone:null}}),Kt=new pl(1,0),ot=new H(_t.boltShapeX,_t.boltShapeY,_t.boltShapeZ),yt=new He({color:_t.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),O=new Lc({map:le,color:_t.boltGlowColor,transparent:!0,opacity:.45,blending:ri,depthWrite:!1}),ct=new He({color:_t.boltGlowColor,map:Ot,transparent:!0,opacity:_t.trailOpacity,blending:ri,depthWrite:!1,side:Ce}),pt=new Qs(.5,.03,_t.boltTrailScale,6,1,!0);pt.rotateX(-Math.PI/2),pt.translate(0,0,-_t.boltTrailScale/2);const zt=Array.from({length:24},()=>{const q=new be,Dt=new fe(Kt,yt);Dt.scale.copy(ot);const Ct=new dd(O);Ct.scale.setScalar(_t.boltGlowScale),Ct.renderOrder=6;const Jt=new fe(pt,ct);return Jt.renderOrder=5,q.add(Dt,Ct,Jt),q.visible=!1,r.add(q),{group:q,core:Dt}}),Vt=Array.from({length:6},()=>{const q=Dd({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return q.group.visible=!1,r.add(q.group),q}),Bt=e.dash,z=new ia(Bt.ringRadius-.06,Bt.ringRadius,28),Mt=Array.from({length:6},()=>{const q=new He({color:16777215,transparent:!0,opacity:0,side:Ce,depthWrite:!1}),Dt=new fe(z,q);return Dt.rotation.x=-Math.PI/2,Dt.visible=!1,r.add(Dt),{mesh:Dt,mat:q,life:0,base:1}});function K(q,Dt,Ct,Jt,jt){const ae=Mt.find(oe=>oe.life<=0)??Mt[0];ae.mat.color.set(Jt),ae.mesh.position.set(q,Ct+.04,Dt),ae.base=jt,ae.mesh.scale.setScalar(jt*.6),ae.mesh.visible=!0,ae.mat.opacity=.9,ae.life=Bt.fxDuration}const lt=e.links,Et=new ia(lt.ringRadius-.07,lt.ringRadius,28),St=Array.from({length:5},()=>{const q=new He({color:lt.chargeColor,transparent:!0,opacity:0,side:Ce,depthWrite:!1}),Dt=new fe(Et,q);return Dt.rotation.x=-Math.PI/2,Dt.visible=!1,r.add(Dt),{mesh:Dt,mat:q,life:0,base:1}});function Zt(q,Dt,Ct,Jt){const jt=St.find(ae=>ae.life<=0)??St[0];jt.mesh.position.set(q,Ct+.05,Dt),jt.base=Jt,jt.mesh.scale.setScalar(Jt*.55),jt.mesh.visible=!0,jt.mat.opacity=.85,jt.life=lt.fxDuration}let ne=t.playerLink.id,se=t.playerLink.hitIds.length,te=t.dash.id,ge="none";const pe=wS(e.camera,e.smartCamera,e.zoom,s/a),Ye=t.character.position;pe.update(Ye.x,Ye.y,Ye.z,1,t.camera);function Ze(q,Dt){if(R.length===0)return 0;const Ct=o.domElement.getBoundingClientRect(),Jt=new Gt((q-Ct.left)/Ct.width*2-1,-((Dt-Ct.top)/Ct.height)*2+1);E.setFromCamera(Jt,pe.camera);const jt=E.intersectObjects(R,!0);for(const ae of jt){const oe=ae.object.userData.dummyId;if(oe&&oe>0)return oe}return 0}function Ae(q,Dt,Ct){const Jt=o.domElement.getBoundingClientRect(),jt=new H(q,Dt,Ct).project(pe.camera);return{x:Jt.left+(jt.x*.5+.5)*Jt.width,y:Jt.top+(-jt.y*.5+.5)*Jt.height}}let Ee=0,Le=0;return{gaitDebug(){return v.gaitDebug()},trailDebug(){return g.debug()},stretchDebug(){const q=v.stretch();return{arm:q.arm,leg:q.leg,torso:q.torso,impact:q.impact}},render(q,Dt){const Ct=q.character,Jt=q.combat;e.hitstop.enabled&&q.hitCount>Ee&&Le<=0&&(Le=Math.max(0,e.hitstop.duration)),Ee=q.hitCount;const jt=Le>0;jt&&(Le-=Dt),p.position.set(Ct.position.x,Ct.position.y,Ct.position.z),p.rotation.y=Ct.bodyYaw;const ae=q.dash.phase==="active"&&q.dash.kind==="roll",oe=ae&&q.dash.duration>0?Math.min(1,1-q.dash.timer/q.dash.duration):0;if(x.rotation.x=ae?oe*Math.PI*2:0,x.position.y=_-(ae?.2*Math.sin(Math.PI*oe):0),jt||v.update(Ct,Jt,q.playerHurt,Dt,q.abilities.channeling,q.time,q.playerLink,q.turnInPlace),g.update(jt?0:Dt,jt?null:v.weaponBlade(),!jt&&(Jt.phase==="active"||Jt.phase==="windup"||q.playerLink.phase==="active"||ae&&q.dash.duration>0)),!jt)for(let it=0;it<y.length;it++)q.dummies[it]&&y[it].update(q.dummies[it],Dt);const on=pe.camera.position,Ne=Math.atan2(on.x-Ct.position.x,on.z-Ct.position.z),A=q.config.gaze.hurtHoldSec,V=q.time-q.playerHurt.lastAt,nt=A>0&&V>=0&&V<A?1-V/A:0,Q=XS(q.gaze.active,q.gaze.threat,nt,q.time,S);WS(ht,ut,J,xt,Q.level),k=KS(Ct.grounded,Ct.position.y,k),F.mesh.position.set(Ct.position.x,k+.028,Ct.position.z),F.update(Q.arcRad,Q.opacity,Q.scale,ht,Ne);const $=q.config.abilities.arcane,Tt=Math.max(1,Math.floor($.waves)),It=Math.max(1e-4,$.waveInterval),$t=ZS({charging:Jt.charging,charge:Jt.charge,channeling:q.abilities.channeling,fireTimer:q.abilities.fireTimer,fireInterval:It,channelProgress:q.abilities.channeling?(q.abilities.waveIndex+(1-Math.min(1,Math.max(0,q.abilities.fireTimer/It))))/Tt:0,arcaneCooldown:q.abilities.cooldown,arcaneCooldownMax:$.cooldown,dashCooldown:q.dash.cooldown,dashCooldownMax:q.dash.kind==="blink"?q.config.dash.blinkCooldown:q.config.dash.rollCooldown});W.mesh.position.set(Ct.position.x,Ct.position.y+.03,Ct.position.z),W.set($t.ratio,$t.source==="none"?0:S.meterOpacity,$t.source==="charge"?tt:$t.source==="channel"?At:Ut,Ne);const Xt=q.playerLink,Ht=Xt.weapon?q.config.links.moves[Xt.weapon]:void 0,N=qS(Xt.phase,Ct.position.x,Ct.position.z,Xt.facing,Xt.travel,(Ht==null?void 0:Ht.hit.radius)??.9);gt.set(N.x,N.z,.042,N.radius,N.active?S.landingOpacity:0,q.time);for(let it=0;it<D.length;it++){const st=q.dummies[it],Rt=D[it],qt=C[it],Pt=et[it];if(!st){Rt.mesh.visible=!1,qt.mesh.visible=!1,Pt.mesh.visible=!1;continue}const he=q.targeting.hasTarget&&q.targeting.targetId===st.id;if(sm(q,st)){const gn=am(q,st);ht.copy(J).lerp(xt,gn)}else ht.copy(j);const Qt=YS(st.attackPhase,st.attackPhaseTimer,q.config.dummies.attackWindup);Qt.active?(ht.lerp(vt,.5*Qt.urgency),Pt.mesh.position.set(st.position.x,st.position.y+.031,st.position.z),Pt.set(Qt.ratio,S.warnOpacity*(.65+.35*Qt.urgency),vt,Ne)):Pt.set(0,0,vt,Ne);const ie=he?1:0,we=ie>U[it]?S.haloFadeInSec:S.haloFadeOutSec;U[it]=Ld(U[it],ie,Dt,we);const ye=U[it],Ke=1+.02*ye*Math.sin(q.time*2.2+st.id),ue=S.arcDeg+(S.selectedArcDeg-S.arcDeg)*ye;Rt.mesh.position.set(st.position.x,st.position.y+.022,st.position.z),Rt.update(ue*Math.PI/180,S.opacity+(S.selectedOpacity-S.opacity)*ye,1+(S.selectedScale-1)*ye*Ke,ht,Ne,1+(S.selectedThicknessScale-1)*ye),B[it]=Ld(B[it],ie,Dt,ie>B[it]?S.haloFadeInSec:S.haloFadeOutSec);const Oe=B[it];qt.mesh.position.set(st.position.x,st.position.y+.019,st.position.z),qt.update(ue*Math.PI/180,S.haloOpacity*Oe*(.88+.12*Math.sin(q.time*2.2+st.id)),S.selectedScale*(.94+.06*Oe)*Ke,ht,Ne)}if(Yt.position.set(Ct.position.x,Ct.position.y,Ct.position.z),Yt.rotation.y=Jt.phase!=="idle"?Jt.attackFacing:Ct.bodyYaw,q.dash.id!==te){te=q.dash.id;const it=q.dash;ge=it.kind,it.kind==="blink"?(K(it.fromX,it.fromZ,Ct.position.y,Bt.blinkColor,.9),K(it.toX,it.toZ,Ct.position.y,Bt.blinkColor,1.35)):K(it.fromX,it.fromZ,Ct.position.y,Bt.rollColor,1.1)}for(const it of Mt){if(it.life<=0)continue;it.life-=Dt;const st=Math.max(0,it.life/Bt.fxDuration);it.mat.opacity=.9*st,it.mesh.scale.setScalar(it.base*(.6+(1-st)*1.2)),it.life<=0&&(it.mesh.visible=!1)}const X=q.playerLink;X.id!==ne&&(ne=X.id,se=X.hitIds.length,Zt(Ct.position.x,Ct.position.z,Ct.position.y,1)),X.hitIds.length>se?(se=X.hitIds.length,Zt(Ct.position.x,Ct.position.z,Ct.position.y,1.35)):X.hitIds.length<se&&(se=X.hitIds.length);for(const it of St){if(it.life<=0)continue;it.life-=Dt;const st=Math.max(0,it.life/Math.max(lt.fxDuration,1e-6));it.mat.opacity=.85*st,it.mesh.scale.setScalar(it.base*(.55+(1-st)*1.1)),it.life<=0&&(it.mesh.visible=!1)}const ft=Jt.phase==="active"&&Jt.comboIndex>=3;kt.opacity=ft?.7:0,bt.opacity=ft?_t.slashGlowOpacity:0,ft&&(w.rotation.z=-1.2+Jt.attackProgress*3.2,w.scale.setScalar(.9+Jt.comboIndex*.13));for(let it=0;it<zt.length;it++){const st=q.abilities.projectiles[it],Rt=zt[it];Rt.group.visible=!!st,st&&(Rt.group.position.set(st.x,st.y,st.z),Rt.group.scale.setScalar(st.radius),Rt.group.rotation.set(0,Math.atan2(st.dirX,st.dirZ),0))}for(let it=0;it<Vt.length;it++){const st=q.abilities.rings[it],Rt=Vt[it];if(!st){Rt.group.visible=!1;continue}const qt=Math.max(0,Math.min(1,st.life/Math.max(st.duration,1e-6))),Pt=jS(Math.max(0,st.duration-st.life),S.areaExpandSec);Rt.set(st.x,st.z,.045,st.radius*Pt.scale,S.areaOpacity*(.35+.65*qt)*Pt.alpha,q.time)}for(let it=0;it<mt.length;it++){const st=q.arrows[it],Rt=mt[it];if(!st){Rt.group.visible=!1,Rt.bone&&(r.attach(Rt.group),Rt.bone=null),Rt.arrowId=0;continue}const qt=st.stuck&&st.stuckDummy>=0;if(Rt.arrowId!==st.id){if(Rt.bone&&(r.attach(Rt.group),Rt.bone=null),Rt.arrowId=st.id,Rt.group.position.set(st.x,st.y,st.z),Rt.group.rotation.set(st.pitch,st.yaw,0,"YXZ"),qt){const he=y[st.stuckDummy],Qt=he?he.boneAtWorld(st.x,st.y,st.z):null;Qt&&(Qt.node.attach(Rt.group),Rt.bone=Qt.node)}}else Rt.bone||(Rt.group.position.set(st.x,st.y,st.z),Rt.group.rotation.set(st.pitch,st.yaw,0,"YXZ"));Rt.group.visible=!0;const Pt=st.stuck?Math.min(1,st.rest/.6):1;Rt.shaftMat.opacity=Pt,Rt.tipMat.opacity=Pt,Rt.glowMat.opacity=(st.stuck?.28:.85)*Pt,Rt.trailMat.opacity=st.stuck?0:_t.trailOpacity*Pt,Rt.trail.visible=!st.stuck}pe.update(Ct.position.x,Ct.position.y,Ct.position.z,Dt,q.camera),o.render(r,pe.camera)},resize(){const q=Math.max(1,n.clientWidth),Dt=Math.max(1,n.clientHeight);o.setSize(q,Dt,!1),pe.resize(q/Dt)},getGroundBasis(){return pe.getGroundBasis()},setCollidersVisible(q){for(const Dt of h)Dt.opacity=q?.3:1,Dt.wireframe=q,Dt.needsUpdate=!0},setGridVisible(q){u.visible=q},setLabVisible(q){m.setVisible(q)},setLabLabelsVisible(q){m.setLabelsVisible(q)},snapCamera(q,Dt,Ct){pe.snap(q,Dt,Ct)},setZoom(q){pe.setZoom(q)},pickDummy:Ze,projectToScreen:Ae,diagnostics(){const q=df(e.camera.pitchDeg),Dt=QS(q,Yt.rotation.y);return{lean:v.lean(),slashNormal:Dt,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:x.rotation.x,activeRings:Mt.filter(Ct=>Ct.life>0).length,lastKind:ge},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...pe.smart()}}},dispose(){v.dispose(),m.dispose();for(const q of y)q.dispose();F.dispose();for(const q of D)q.dispose();for(const q of C)q.dispose();W.dispose(),g.dispose();for(const q of et)q.dispose();gt.dispose(),L.dispose(),kt.dispose(),bt.dispose(),Kt.dispose(),yt.dispose(),O.dispose(),ct.dispose(),pt.dispose();for(const q of Vt)q.dispose();dt.dispose(),at.dispose(),Lt.dispose(),Z.dispose();for(const q of mt)q.shaftMat.dispose(),q.tipMat.dispose(),q.glowMat.dispose(),q.trailMat.dispose();le.dispose(),Ot.dispose();for(const q of Mt)q.mat.dispose();z.dispose();for(const q of St)q.mat.dispose();Et.dispose(),f.traverse(q=>{q instanceof fe&&q.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function fb(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function pb(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=n,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function mb(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=_=>e.querySelector(`#${_}`),s=i("diag-status"),a=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function v(){const _=n.status();s.textContent=_.enabled?`已记录 ${_.durationS.toFixed(1)}s · ${_.frames} 帧 · 事件 ${_.events} · 异常 ${_.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=_.enabled?"暂停记录":"继续记录"}function g(_){d=_,e.hidden=!_,_?v():a.hidden=!0}function p(_){o.textContent=_,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",_=>{_.preventDefault(),_.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const _=n.summary();fb(_).then(x=>{x?(p("已复制 ✓"),a.hidden=!0):(a.value=_,a.hidden=!1,a.focus(),a.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const _=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);pb(`harness-${_.meta.version}-${x}.json`,JSON.stringify(_)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),a.hidden=!0,v(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),v()}),{tick(){const _=n.status();t==null||t.classList.toggle("is-alert",_.alert),d&&v()},isOpen:()=>d,close:()=>g(!1)}}const gb={intents:{...kd},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function xb(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=rm(Hm,fa),i=ub(n,e,hn,fa.stations),s=lm(e),a=y0(t),o=M0(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.43 · 11-07 22:04 · 诊断");const l=I=>String(I).padStart(2,"0"),c=new Date,h=Um({meta:{version:"v0.9.43",buildTime:"11-07 22:04",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=mb(h,r),d=x0({deadZone:()=>hn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid,showLab:hn.lab.enabled,showLabLabels:hn.lab.showLabels};let m=1;const v=wm({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>hn.zoom}),g=Array.from(document.querySelectorAll(".wp[data-weapon]"));let p=e.combat.weapon;function _(I){if(I===p)return;p=I;const k=Fi.indexOf(I)+1;for(const F of g)F.classList.toggle("is-active",Number(F.dataset.weapon)===k);E.refreshWeapon()}let x=gb,y=0;const R=()=>{m=1,i.setZoom(1)},E=t0(e,hn,u,{singleStep:()=>s.singleStep(x.intents),reset:()=>{m=1,s.singleStep({...kd,resetPressed:!0})},resetZoom:R,onToggleColliders:I=>i.setCollidersVisible(I),onToggleGrid:I=>i.setGridVisible(I),onToggleLab:I=>i.setLabVisible(I),onToggleLabLabels:I=>i.setLabLabelsVisible(I)}),S=i0({stations:fa.stations??[],world:e,view:i,onResetZoom:R});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:s,input:v,viewConfig:hn,debug:u,getUserZoom:()=>m,getGestures:()=>x.gestures,getLastGesture:()=>x.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),lab:{stations:fa.stations??[],goto:I=>S.goto(I),current:()=>S.current(),recall:()=>S.recall()}};let T=performance.now(),b=60,M=0;function P(I){const k=Math.min((I-T)/1e3,.1);T=I,k>0&&(b=b*.9+1/k*.1);const F=v.sample();F.intents.resetPressed&&(m=1),m=mm(m,F.zoomScale,hn.zoom.min,hn.zoom.max),i.setZoom(m);let D=F.intents.dummyClickId;if(F.tap){const B=i.pickDummy(F.tap.x,F.tap.y);B>0&&(D=B)}D>0&&(y=D),x={...F,intents:{...F.intents,dummyClickId:y}};const C=s.frame(k,x.intents,u.timeScale,u.paused,()=>{const B=e.events;for(let W=0;W<B.length;W++)h.event(B[W],e.time)});C>0&&(y=0),h.sample(e,x,k*1e3,C);for(const B of x.gestures)h.gesture(B);I-M>250&&(M=I,f.tick()),_(e.combat.weapon),i.render(e,k),S.tick(),d.update(e,x,i.getGroundBasis());const U=i.diagnostics();a.update(e,b,C,x,u,{attackBlend:U.attackBlend,attackWeights:U.attackWeights,landing:U.landing,hurt:U.hurt,ik:U.ik,zoom:U.camera.zoom},o.hudCompact()),requestAnimationFrame(P)}requestAnimationFrame(P)}xb();

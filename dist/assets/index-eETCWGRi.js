(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const aa=["sword-shield","dual-swords","greatsword","staff","bow"],Mr=["wander","follow","keep-distance","attack","idle"],Mu={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Oo=1e-6;function As(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Oo?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Oo?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Np(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Oo){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Oo)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Nn=1e-6,gc=Math.PI/180,Sl=-1e9;function bu(){return{type:"none",lastAt:Sl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Po(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Mh(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function wl(n,t,e){const i=e.duration>0?e.duration:El(n,e.type);if(t.kind==="player"){const r=n.playerHurt;if(Mh(r,e.type,i,e.dirX,e.dirZ),r.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Nn){const l=e.knockback*n.config.hits.knockbackDecay;r.knockX=e.dirX*l,r.knockZ=e.dirZ*l}Po(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Mh(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Nn){const r=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*r,a.hurt.knockZ=e.dirZ*r}n.hitCount+=1,Po(n,"hit",a.id,a.position);const s=n.config.hits.hitstop,o=s&&e.type!=="none"?s[e.type]??0:0;o>0&&n.combat.hitstop<o&&(n.combat.hitstop=o,Po(n,"hitstop",o,a.position))}function Qo(n,t,e){wl(n,{kind:"dummy",index:t},e)}function Op(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function El(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Bp(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=e.reach[t.weapon]??0,s=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*gc),o=Math.sin(t.attackFacing),r=Math.cos(t.attackFacing),l=n.config.dummies.radius,c=n.config.targeting.idealRange;for(const h of n.dummies){const f=h.position.x-i.x,d=h.position.z-i.z,u=Math.hypot(f,d);if(u>a+l)continue;const g=u>Nn?f/u:o,_=u>Nn?d/u:r;if(u>Nn&&(f*o+d*r)/u<s)continue;let m="light";t.weapon==="greatsword"?m="knock":t.comboIndex>=3&&(m="heavy");const p=e.knockback[t.weapon]??0;let x=u;p>0&&(x=Math.max(u+p,c));const y=Math.max(0,x-u);Qo(n,n.dummies.indexOf(h),{type:m,duration:El(n,m),dirX:g,dirZ:_,knockback:y})}}function Hp(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,g=Math.sin(i.facing),_=Math.cos(i.facing),m=Math.cos(bh(s.arcDeg,0,180)*gc),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const y=n.dummies[x];if(i.hitIds.indexOf(y.id)>=0)continue;const v=u>Nn?bh(((y.position.x-r)*f+(y.position.z-l)*d)/u,0,1):0,R=r+f*v,S=l+d*v,b=Math.hypot(y.position.x-R,y.position.z-S);let E=!1;if(s.shape==="circle")E=b<=s.radius+p;else if(s.shape==="capsule")E=b<=Math.max(s.radius,s.width)+p;else{const U=y.position.x-c,L=y.position.z-h,k=Math.hypot(U,L),H=k>Nn?(U*g+L*_)/k>=m:!0;E=k<=s.radius+p&&H||b<=s.width+p}if(!E)continue;const w=y.position.x-r,M=y.position.z-l,P=Math.hypot(w,M);if(P>Nn&&(w*g+M*_)/P<Math.cos(Math.max(s.arcDeg,90)*gc))continue;const F=P>Nn?w/P:g,D=P>Nn?M/P:_;wl(n,{kind:"dummy",index:x},{type:s.type,duration:s.duration,dirX:F,dirZ:D,knockback:s.knockback}),i.hitIds.push(y.id),Po(n,"link-hit",y.id,y.position)}}function Gp(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>Nn?s/r:0,c=r>Nn?o/r:1;wl(n,{kind:"player"},{type:"light",duration:El(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function Vp(n,t){if(!n.modules.hits)return;n.events.some(i=>i.type==="attack-active")&&Bp(n),Hp(n,t),Gp(n)}function bh(n,t,e){return n<t?t:n>e?e:n}const Su=Math.PI/180,Tl=1e-6;function Xp(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Bo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function wu(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Tl?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Eu(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Tl)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Wp(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Yp(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Eu(n,t,e))return!1;const i=wu(n,t,e.lookRange);if(i===null)return!1;const a=Ge(i-n.character.bodyYaw);return Math.abs(a)>Tu(n,e)}function Tu(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Su}function $p(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Eu(n,e,a)){Bo(n);return}const s=wu(n,e,a.lookRange);if(s===null){Bo(n);return}const o=n.character,r=Ge(s-o.bodyYaw),l=Math.abs(r),c=Tu(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Tl;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*Su);i.targetYaw=Ge(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Ge(i.targetYaw-i.fromYaw);o.bodyYaw=Ge(i.fromYaw+d*Wp(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Li=1e-6;function Ge(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Xs(n,t,e,i){const a=Ge(t-n);return n+a*(1-Math.exp(-Math.max(e,Li)*i))}function Ws(n,t,e,i,a){const o=Ge(t-n)*(1-Math.exp(-Math.max(e,Li)*a)),r=Math.max(i,0)*a;return r<=Li?n:n+za(o,-r,r)}function Sh(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Li)*a)),o=Math.max(i,0)*a;return o<=Li?n+s:n+za(s,-o,o)}function za(n,t,e){return n<t?t:n>e?e:n}function wh(n,t,e,i){const a=Ge(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ge(n+Math.sign(a)*Math.max(e,0))}function Zp(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Li,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=As(n,e);else if(c)i.facing=Ws(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=As(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Li)){const M=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,F=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=wh(i.facing,M,P,F);else if(h>=a.facingMinMagnitude&&Math.abs(Ge(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=Xs(i.facing,M,a.facingSmoothRate,t);i.facing=wh(i.facing,U,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Yp(n,e)||(c?i.bodyYaw=Ws(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Xs(i.bodyYaw,g,a.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ge(p-i.bodyYaw))>M&&(p=i.moveYaw)}const x=o||f||m,y=a.maxHeadTurnDeg*Math.PI/180;let v;if(x){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?Ws(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Xs(i.headYaw,p,M,t)}else{const M=Ge(i.headYaw-i.bodyYaw),P=Ge(p-i.bodyYaw),F=Math.abs(P)<Math.abs(M)-1e-9,D=F?n.config.gaze.headReturnRate:a.headTurnRate,U=F?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(U)?Ws(M,P,D,U,t):Xs(M,P,D,t);v=i.bodyYaw+L}const R=Ge(v-i.bodyYaw);R>y?v=i.bodyYaw+y:R<-y&&(v=i.bodyYaw-y),i.headYaw=v;const S=n.config.gaze;let b=0;if(c)b=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const P=i.position.y+n.config.characterHeight*za(S.eyeHeightRatio,0,1),F=M.position.y+n.config.dummies.height*za(S.aimHeightRatio,0,1),D=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);b=Math.atan2(F-P,Math.max(Li,D))}}const E=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;b=za(b,-E,E);const w=x?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Sh(i.headPitch,b,w,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Sh(i.bodyPitch,i.headPitch*za(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Au=1e-6,tr=Math.PI/180;function er(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qp(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*tr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(Ge(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function jp(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Kp(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*tr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=qp(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),g=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+g*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(jp(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}er(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Jp(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*tr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,er(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Eh(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,er(n,"channel-end",0,n.character.position))}function Qp(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){Eh(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),er(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=As(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Au),Kp(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Eh(n,i);break}}function tm(n,t,e){const i=Math.max(0,e.homingConeDeg)*tr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Au;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Ge(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function em(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=tm(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Ge(h-f),u=r.turnRate*t,g=Math.max(-u,Math.min(u,d)),_=f+g;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){Qo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const nm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Qp(n,t,e,s,a,i.cfg.slot),Jp(n,t,s),em(n,t,s)}},br=1e-6;function Ru(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function im(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Ru(n,"ring-place",i.id,e)}function am(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,br),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),_=g>br?f/g:0,m=g>br?d/g:1;Qo(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:m,knockback:e.knockback})}Ru(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const sm={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&im(n,s),am(n,t,s)}},om={channelVolley:nm,groundRing:sm};function rm(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function cm(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=om[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function lm(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Pu(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function hm(n,t,e){cm(n,t,e)}function Sr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Th=1e-6;function Ah(n,t,e){return n<t?t:n>e?e:n}function Cu(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Lu(n){const t=n.camera,e=Cu();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function dm(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Ah((e.radius-d)/Math.max(Th,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*u),a+=g,s+=c.position.x*g,o+=c.position.z*g,r+=1}const l=a<=0?0:Ah(a/(a+Math.max(Th,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function um(n){const t=[],e=n.ground.size;t.push(ma("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(ma(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(ma(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ma(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ma(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(ma(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function ma(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const pi=1e-6;function Ho(n,t,e){return n<t?t:n>e?e:n}function Rs(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+pi||c.maxY<i-o-pi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Al(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+pi||l.minY>=o-pi)continue;const c=Ho(t.x,l.minX,l.maxX),h=Ho(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>pi*pi){const g=Math.sqrt(u),_=(e-g)/g;t.x+=f*_,t.z+=d*_}else{const g=t.x-l.minX,_=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,x=Math.min(g,_,m,p);x===g?t.x=l.minX-e:x===_?t.x=l.maxX+e:x===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function Rl(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+pi||o.minY>=s-pi)continue;const r=Ho(t.x,o.minX,o.maxX),l=Ho(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-pi)return!0}return!1}const Pi=1e-6,Xa=Math.PI/180;function Pl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function xc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Du(n){n.arrows.length=0}function fm(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let g=0;u>Pi&&(g=((o-n)*f+(r-e)*d)/u,g=Math.max(0,Math.min(1,g)));const _=n+f*g,m=e+d*g,p=_-o,x=m-r;if(p*p+x*x>h*h)return-1;const y=t+(a-t)*g;return y<l-.1||y>l+c?-1:g}function pm(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Pi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Xa,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Pi;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Pl(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function mm(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Xa;return t+Oa(Pl(s-t),-o,o)}function gm(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Xa),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Xa),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Pi,s),f=l.position.y+n.config.dummies.height*Oa(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,g=Oa(u,-s*.45,s*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,s*s-g*g))}}function xm(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=pm(n,e),l=mm(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,g=gm(n,f,u,d,r,s),_={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Xa};return n.arrows.push(_),xc(n,"arrow-shot",a,_),_}function Oa(n,t,e){return n<t?t:n>e?e:n}function vm(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const R=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*R+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*R,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(R=>R.id===c.targetId);if(!v)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>Pi){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),b=Math.atan2(c.vx,c.vz),E=c.turnRate*t,w=b+Oa(Pl(S-b),-E,E);c.vx=Math.sin(w)*R,c.vz=Math.cos(w)*R;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const P=M/R,D=(v.position.y+s*Oa(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,U=Math.max(0,i.verticalTurnRate)*t;c.vy+=Oa(D-c.vy,-U,U)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,g=f+c.vy*t,_=d+c.vz*t;let m=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const R=n.dummies[v],S=fm(h,f,d,u,g,_,R.position.x,R.position.z,R.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,m=v)}if(m>=0){const v=n.dummies[m];c.x=h+(u-h)*p,c.y=f+(g-f)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=m;const R=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),b=c.x-v.position.x,E=c.z-v.position.z;c.offX=b*R-E*S,c.offZ=b*S+E*R,c.offY=c.y-v.position.y;const w=Math.atan2(c.vx,c.vz);c.localYaw=w-v.bodyYaw,c.yaw=w,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);Qo(n,m,{type:"light",duration:.22,dirX:M>Pi?c.vx/M:0,dirZ:M>Pi?c.vz/M:1,knockback:.14}),xc(n,"arrow-land",v.id,c),l.push(c);continue}const x=Rs(n.boxes,u,_,g+.4,.04,0,6),y=Number.isFinite(x)?x:0;if(g<=y+.02&&c.vy<0){c.x=u,c.y=y+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Pi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*Xa),c.rest=Math.max(.2,i.stickSec),xc(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=g,c.z=_,l.push(c)}n.arrows=l}const vc=1e-6,_m=Math.PI/180;function _c(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Cl(n,t,e){return n<t?t:n>e?e:n}function nr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function yc(n){const t=n.id,e=n.windowId;Object.assign(n,nr()),n.id=t,n.windowId=e}function ym(n){yc(n)}function ku(n){yc(n.playerLink);for(const t of n.dummies)yc(t.link)}function Mm(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Mc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Go(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,nr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function bm(n,t){const e=n.config.links.search,i=n.character.position,a=Cl(e.maxAngleDeg,0,180)*_m;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<vc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Ge(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function Sm(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=As(n,t),l=bm(n,r),c=l.id>0?l.yaw:r,h=l.id>0?Cl(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),_c(n,"link-start",s.id)}function wm(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Go(n);return}if(e.weapon!==n.combat.weapon){Go(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,_c(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,_c(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Cl(r/o,0,1):1,e.phase==="active"&&i.active>vc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(vc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Em(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Go(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Mc(n,"sprint"),a.prevSprinting=r,wm(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&Sm(n,e,l,o.weapon)}const bc=1e-6;function Ci(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Iu(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function ir(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.timings=Iu()}function Tm(n){return{weapon:aa[Math.max(0,n-1)]??aa[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,timings:Iu()}}function Am(n,t){return As(n,t)}function Rm(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function zu(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=Am(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,Ci(n,"attack-start",i)}function Fu(n){return Math.max(0,n.config.combat.settle)}function Sc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];zu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Fu(n),lunge:Rm(n,i.lunge[e-1]??0)},e)}function Rh(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,zu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Fu(n),lunge:i.lunge},0),xm(n,e,n.combat.attackFacing),Ci(n,"charge-release",e)}function Pm(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;if(i.hitstop>0)return;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",Ci(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Ci(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Sc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>bc&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Sc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1)}function Cm(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=aa.length){const l=aa[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,ir(n),Go(n),Ci(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ci(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),Pm(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Sc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ci(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,bc)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Rh(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?Rh(n,e,l):Ci(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>bc)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=_=>c*(1-Math.pow(1-Math.min(1,Math.max(0,_/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let g=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);g=Math.min(g,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*g,n.impulse.z=Math.cos(i.attackFacing)*g}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const wc=1e-6;function wr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Lm(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Uu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Ph(n,t,e){return n<t?t:n>e?e:n}function Dm(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-wc;){const d=Math.min(l,c+r),u=s.x+t*d,g=s.z+e*d,_=Ph(u,o.minX,o.maxX),m=Ph(g,o.minZ,o.maxZ),p={x:_,y:s.y,z:m};if(Rl(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,f=m,c=d,_!==u||m!==g))break}return{x:h,z:f}}function km(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Mc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&wr(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&ir(n));const l=Np(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=Dm(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Mc(n,"blink"),wr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(wc,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,wr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(wc,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const on=1e-6,Ec=Math.PI*2,Im=7,zm=18;function Fm(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ch(n,t,e,i){return n+Fm(t-n)*(1-Math.exp(-Math.max(e,on)*i))}function Ll(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function Um(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:bu(),link:nr()})}return t}function Nm(n){const t=Mr.indexOf(n);return Mr[(t+1)%Mr.length]}function Nu(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,ym(i.link)}n.dummyAttackCount=0}function Om(n,t,e){const i=Sr(n)*Ec,a=Math.sqrt(Sr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Sr(n)*.8)}function Bm(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Hm(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(Bm(t,i),on);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Ll(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function Gm(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>on?a/o:0,l=o>on?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&Om(n,t,e);const _=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(_,m);p>on&&(c=_/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>on&&(f=Math.atan2(c,h)):o>on&&(f=Math.atan2(r,l)),e.leashRadius>on&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const _=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;c=c*(1-_)+m*_,h=h*(1-_)+p*_;const x=Math.hypot(c,h);x>on&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Vm(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+on&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Ll(n,"dummy-attack",e))}Hm(n,e,t,i);const a=Gm(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-on||a.x<0&&e.position.x<=s.minX+on)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-on||a.z<0&&e.position.z<=s.minZ+on)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,on)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Ch(e.bodyYaw,e.facing,Im,t),e.headYaw=Ch(e.headYaw,e.facing,zm,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Al(n.boxes,e.position,i.radius,i.height,c))if(Rl(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,x=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Rs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+on&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const g=Math.hypot(e.velocity.x,e.velocity.z),_=Math.min(n.config.strideSpeedCap,g/Math.max(n.config.moveSpeed,on)),m=Math.max(n.config.strideLength*(1+_*n.config.strideSpeedGain),on);e.stride=m,e.gaitPhase=(e.gaitPhase+u/m*Ec)%Ec}function Xm(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Nm(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,Ll(n,"dummy-mode",a)}for(const a of n.dummies)Vm(n,t,a,i)}const On=1e-6,Lh=Math.PI*2;function Dh(n,t){return Math.sqrt(n*n+t*t)}function Ys(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wm(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,ir(n)}function Ym(n,t,e){const i=n.character,a=n.config,s=Rs(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,ir(n),ku(n),Uu(n),Pu(n),Du(n),Bo(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Sl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function $m(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Dh(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-On||r<0&&s.x<=h.minX+On)&&(r=0),(l>0&&s.z>=h.maxZ-On||l<0&&s.z<=h.minZ+On)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",g=f||u||d;a.sprinting=!g&&e.sprintHeld&&c>On;const _=i.combat.weapons[n.combat.weapon];let m=_?_.moveMultiplier:1;u||d?m=0:f?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*m;{const D=g?i.skillDecel:c>On?i.acceleration:i.friction,U=1-Math.exp(-D*t);o.x+=(r*p-o.x)*U,o.z+=(l*p-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Ys(n,"jumped",i.jumpSpeed)),n.events.some(D=>D.type==="blink"&&D.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const y=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Al(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Rl(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=y,s.z=v,o.x=0,o.z=0;else{const D=s.x-y,U=s.z-v;Math.abs(D)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}Ys(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Rs(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+On&&S-s.y<=i.stepHeight+On&&(s.y=S,o.y=0,Ys(n,"stepUp",S));const b=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=Rs(n.boxes,s.x,s.z,b,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||Ys(n,"landed",E),a.grounded=!0):a.grounded=!1;const w=Dh(s.x-y,s.z-v);a.distance+=w;const M=w/Math.max(t,On),P=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,On)),F=Math.max(i.strideLength*(1+P*i.strideSpeedGain),On);a.stride=F,a.gaitPhase=(a.gaitPhase+w/F*Lh)%Lh}const Tc=1e-6,kh=2.399963229728653;function Ji(n,t,e){return n<t?t:n>e?e:n}function Ih(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,g,_;f<Tc?(u=r,g=l,_=d):(u=c/f,g=h/f,_=d-f);const m=_+o;n.x-=u*m*a,n.z-=g*m*a,t.x+=u*m*s,t.z+=g*m*s}function Zm(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*kh;Ih(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*kh;Ih(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Al(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=Ji(h.position.x,c.minX,c.maxX),h.position.z=Ji(h.position.z,c.minZ,c.maxZ)}function qm(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=Ji(r.minScale,0,1);if(l<Tc||c<=0||h>=1)return 1;const f=a+o,d=Ji(r.approachDot,0,.99);let u=0;for(const g of s){const _=g.position.x-n,m=g.position.z-t,p=Math.hypot(_,m);if(p>=f+c)continue;if(p<Tc){u=1;continue}const x=(e*_+i*m)/(l*p);if(x<=d)continue;const y=Ji(1-(p-f)/c,0,1),v=Ji((x-d)/(1-d),0,1);u=Math.max(u,y*v)}return 1-(1-h)*Ji(u,0,1)}function jm(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=qm(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Er=1e-6,Km=Math.PI/180;function Jm(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Qm(n,t,e){return n<t?t:n>e?e:n}function t0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Er?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Er&&(o=Math.atan2(e.moveX,e.moveZ));const l=Qm(i.maxAngleDeg,0,180)*Km;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-s.x,_=u.position.z-s.z,m=Math.hypot(g,_);if(m<Er||m>i.range)continue;const p=Math.atan2(g,_),x=Math.abs(Ge(p-o));if(x>l)continue;const y=m-i.frontBias*Math.cos(x);y<c&&(c=y,h=u.id,f=p,d=m)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const Qn=1e-6;function Fa(n,t,e){return n<t?t:n>e?e:n}function zh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function e0(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(D,U)=>{const L=D.position.x-s.x,k=D.position.z-s.z,H=Math.hypot(L,k);if(H<Qn||H>U)return 0;const N=Fa((U-H)/Math.max(Qn,U-i.nearDistance),0,1);let z=N*(i.modeWeight[D.mode]??.5);return D.attackPhase==="active"&&(z+=i.attackBoost*N),z},r=[];let l=0,c=!1,h=!1,f=!1;for(const D of n.dummies){const U=o(D,i.threatRange),L=D.position.x-s.x,k=D.position.z-s.z,H=Math.hypot(L,k);U>0&&(r.push({id:D.id,x:D.position.x,z:D.position.z,dx:L,dz:k,yaw:Math.atan2(L,k),w:U}),l+=U,H<=i.approachDist&&(i.modeWeight[D.mode]??.5)>=i.hostileModeWeight&&(f=!0)),H>Qn&&H<=i.recoveryDist&&(c=!0),(D.attackPhase==="windup"||D.attackPhase==="active")&&H<=i.threatRange&&(h=!0)}const d=l<=0?0:Fa(l/(l+Math.max(Qn,i.saturation)),0,1),u=r.length>0,g=a.active,_=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>Qn&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((D,U)=>U.w-D.w);const x=r.slice(0,Math.max(1,i.maxThreats)),y=r[0],v=Math.atan2(y.dx,y.dz),R=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let b=0,E=0,w=0;for(const D of x){const U=Math.abs(zh(D.yaw-v))/Math.PI;let L=D.w/(1+Math.max(i.spreadFalloff,0)*U*U);D!==y&&i.behindFalloff<1&&Math.abs(zh(D.yaw-S))>R&&(L*=Math.max(i.behindFalloff,0)),b+=D.x*L,E+=D.z*L,w+=L}a.mainId=y.id,a.mainYaw=v;const M=n.dummies.find(D=>D.id===y.id),P=(M?M.position.y:0)+n.config.dummies.height*Fa(i.aimHeightRatio,0,1),F=s.y+n.config.characterHeight*Fa(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-F,Math.max(Qn,Math.hypot(y.dx,y.dz))),a.centroidYaw=w>Qn?Math.atan2(b/w-s.x,E/w-s.z):v,a.threatCount=r.length,a.threat=d}function n0(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function i0(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<Qn||a>e.threatRange)return 0;const s=Math.max(Qn,e.threatRange-e.nearDistance),o=Fa((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(Qn,e.modeWeight.attack??1.5);return Fa(r/l,0,1)}function a0(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function s0(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:um(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Tm(1),playerLink:nr(),arrows:[],arrowSeq:0,abilities:lm(),skills:rm(n),impulse:{x:0,z:0},targeting:Jm(),turnInPlace:Xp(),playerHurt:bu(),hitCount:0,dash:{...Lm(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Cu(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:a0(),dummies:Um(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function o0(n){Wm(n),Nu(n),ku(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Sl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Pu(n),Du(n),Uu(n),Lu(n),Bo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Fh(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){o0(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?t0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Em(n,t,e),n.modules.combat&&Cm(n,t,e),n.modules.dash&&km(n,t,e),n.modules.movement&&$m(n,t,e),n.modules.gaze&&e0(n,t,e),n.modules.orientation&&Zp(n,t,e),$p(n,t,e),n.modules.dummies&&Xm(n,t,e),Op(n,t),Mm(n,t),n.modules.abilities&&hm(n,t,e),n.modules.combat&&vm(n,t),n.modules.dummies&&(Vp(n,t),n.modules.separation&&(Zm(n),jm(n))),n.modules.camera?dm(n):Lu(n),n}const Ou=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Uh=1e-9;function r0(n,t,e){return n<t?t:n>e?e:n}function Bu(n){return r0(Number.isFinite(n)?n:0,0,1)}function Hu(n,t){const e=Bu(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function c0(){const n={};for(const t of Ou)n[t]=0;return n}function l0(n,t){const e=c0(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Bu(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Uh;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Uh?(a-o.t)/l:0,h=Hu(o.ease??"linear",c);for(const f of Ou){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function h0(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Hu(i,t/a);return e.turns*Math.PI*2*s}function Oi(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function d0(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Fh(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Fh(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const Gu={slopPx:12,longPressMs:450,doubleTapMs:280};function u0(n,t,e=Gu.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Bi(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function f0(n=Gu){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Bi(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Bi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Bi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Bi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),Bi(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Bi(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Bi(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Tr=.001,p0=18;function Ac(n,t,e){return n<t?t:n>e?e:n}function Rc(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function m0(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function g0(n,t,e,i,a=p0){const s=m0(t);if(!s)return{state:Rc(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Tr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<Tr?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Tr)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Ac(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Nh(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Ac(r,a,s):Ac(n,a,s)}function x0(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function v0(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Ar=["jump","sprint","reset","attack","skill2"],_0=8,y0=16,Rr=10,Oh=14,Bh=140,M0=18,b0=16,S0=400,w0=1.0001;function Co(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function E0(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Co(e)}function T0(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,g=0,_=null,m=-1,p=0,x=0,y=0,v=0,R=!1,S=0,b=1,E=0,w=null,M=0,P=0,F=!1,D=null,U=null,L=0,k=0,H=0,N=0,z=!1,V=!0,mt=-1;const ot=f0({slopPx:Oh,longPressMs:450,doubleTapMs:350});let dt=[],tt=null;const q=new Set;function pt(B){B&&dt.push(B)}const Q=new Map;let Mt=Rc(),Ct=!1,zt=1;function Zt(){const B=Array.from(Q.values()),st=a(),ut=g0(Mt,B,st.pinchGain,st.maxStepRatio,M0);if(Mt=ut.state,Ct=ut.pinching,ut.scale!==1&&(zt*=ut.scale),ut.started||ut.armedNow)w=null,F=!0,D=null;else if(ut.ended&&o===null&&B.length===1){const Vt=B[0];o=Vt.id,r=Vt.x,l=Vt.y,c=0,h=0,f=Vt.x,d=Vt.y,R=!1,S=0,b=1,E=0,performance.now(),w=null,F=!0,D=null}}const ht={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Ht={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let X=0,le=0;const Wt={},Gt=new Set,Nt=[];function At(){for(const B of Ar)Wt[B]!==void 0&&(Wt[B]=void 0),W(B);ot.reset(),q.clear(),Q.clear(),Mt=Rc(),Ct=!1,o=null,c=0,h=0,f=0,d=0,R=!1,S=0,b=1,E=0,p=0,x=0,y=0,v=0,_=null,m=-1,w=null,F=!1,D=null,U=null,mt=-1,H=0,N=0,z=!1,V=!0}const Rt=()=>{document.hidden&&At()},C=B=>{if(B.clientX===0&&B.clientY===0){g++;return}if(Co(B.target)||E0(B.clientX,B.clientY)){q.add(B.pointerId);return}if(q.delete(B.pointerId),Q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),o===null&&!Ct){_=null,m=-1,o=B.pointerId,r=B.clientX,l=B.clientY,c=0,h=0,f=B.clientX,d=B.clientY,performance.now();const st=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY)&&(B.screenX!==0||B.screenY!==0);R=st,S=0,b=1,E=0,p=st?B.screenX:0,x=st?B.screenY:0,y=p,v=x,w=B.pointerId,M=B.clientX,P=B.clientY,F=!1}Zt()},T=B=>{if(B.pointerId===U&&(B.pointerType==="mouse"&&B.buttons===0||B.clientX===0&&B.clientY===0&&(L!==0||k!==0)||(V?(H=B.clientX-L,N=B.clientY-k):(L=B.clientX,k=B.clientY,V=!0,H=0,N=0))),pt(ot.move(B.pointerId,B.clientX,B.clientY,performance.now())),!q.has(B.pointerId)&&Q.has(B.pointerId)&&(Q.set(B.pointerId,{id:B.pointerId,x:B.clientX,y:B.clientY}),Zt()),q.has(B.pointerId)||B.pointerId!==o)return;const st=performance.now();if(_===B.pointerId&&st-m<150){g++;return}const ut=B.clientX,Vt=B.clientY;if(ut===0&&Vt===0&&(r!==0||l!==0)){g++;return}const Yt=ut-f,O=Vt-d,gt=Number.isFinite(B.screenX)&&Number.isFinite(B.screenY),K=gt?B.screenX:0,rt=gt?B.screenY:0,St=gt&&(K!==0||rt!==0),Et=K-y,Kt=rt-v;if(R&&St){const Se=Math.hypot(Et,Kt),Ee=Math.hypot(Yt,O);if(Se>3){if(S=0,E<30&&Ee>6&&Et*Yt+Kt*O>.7*Se*Ee){const Z=Se/Ee;Z>.2&&Z<5&&(b+=(Z-b)*.3,E++)}}else Ee>12&&(S++,S>=2&&(R=!1))}const re=Math.hypot(Yt,O);if(!R){const Se=u<0?Number.POSITIVE_INFINITY:st-u,Ee=St?Math.hypot(Et,Kt):1/0;re>28&&(Se<200||Ee<re*.4)&&(r+=Yt,l+=O,g++)}f=ut,d=Vt,y=K,v=rt,B.pointerId===w&&Math.hypot(B.clientX-M,B.clientY-P)>_0&&(F=!0);let de,ae;R&&St?(de=(K-p)/b,ae=(rt-x)/b):(de=ut-r,ae=Vt-l);const be=Math.hypot(de,ae),ge=s();be>ge&&(de*=ge/be,ae*=ge/be);const rn=Math.hypot(c,h),bn=Math.hypot(de,ae);if(rn>10&&bn>10){const Se=Math.abs(Math.atan2(c*ae-h*de,c*de+h*ae)),Ee=Math.max(rn,bn)*Se,Z=Math.max(Math.hypot(Yt,O),Math.hypot(Et,Kt)/Math.max(.2,b));if(Se>.6&&Z<Math.max(6,Ee*.5)){g++;return}}c=de,h=ae};function W(B){if(!ht[B])return;ht[B]=!1,B==="attack"&&(Ht.attackReleased=!0);const st=document.getElementById(`btn-${B}`);st==null||st.classList.remove("is-down")}function ct(){o!==null&&(_=o,m=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,S=0,b=1,E=0,p=0,x=0,y=0,v=0)}const lt=B=>{const st=Q.delete(B.pointerId),ut=q.delete(B.pointerId);st&&Zt(),B.pointerId===U&&(U=null,z?mt=performance.now():(H=0,N=0,mt=-1)),pt(ot.end(B.pointerId,B.clientX,B.clientY,performance.now()));for(const qt of Ar)Wt[qt]===B.pointerId&&(Wt[qt]=void 0,W(qt));const Vt=!st&&!ut&&Q.size<=1&&o!==null;(B.pointerId===o||Q.size===0||Vt)&&ct(),!ut&&B.pointerId===w&&(!F&&!Co(B.target)&&(D={x:B.clientX,y:B.clientY}),w=null)};for(const B of Ar){const st=document.getElementById(`btn-${B}`);if(!st)continue;const ut=B==="attack"||B==="skill2",Vt=O=>{if(O.preventDefault(),Wt[B]===void 0){Wt[B]=O.pointerId,ht[B]=!0,B==="jump"&&(Ht.jump=!0),B==="reset"&&(Ht.reset=!0),B==="sprint"&&(Ht.sprintPressed=!0),B==="attack"&&(Ht.attackPressed=!0),B==="skill2"&&(Ht.skill2=!0),st.classList.add("is-down"),pt(ot.begin(B,O.pointerId,O.clientX,O.clientY,performance.now()));try{st.setPointerCapture(O.pointerId)}catch{}ut&&(U=O.pointerId,L=O.clientX,k=O.clientY,V=!(O.clientX===0&&O.clientY===0),H=0,N=0,z=!1,mt=-1)}},qt=O=>{Wt[B]===O.pointerId&&(Wt[B]=void 0,W(B),pt(ot.end(O.pointerId,O.clientX,O.clientY,performance.now())))},Yt=O=>{Wt[B]===O.pointerId&&(Wt[B]=void 0,W(B),pt(ot.cancel(O.pointerId,performance.now())))};st.addEventListener("pointerdown",Vt),st.addEventListener("pointerup",qt),st.addEventListener("pointercancel",Yt),Nt.push(()=>{st.removeEventListener("pointerdown",Vt),st.removeEventListener("pointerup",qt),st.removeEventListener("pointercancel",Yt)})}const at=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const B of at){const st=ut=>{ut.preventDefault(),X=Number(B.dataset.weapon)||0};B.addEventListener("pointerdown",st),Nt.push(()=>B.removeEventListener("pointerdown",st))}const Pt=B=>{const st=B.key.toLowerCase();if((st===" "||st.startsWith("arrow"))&&B.preventDefault(),Gt.has(st))return;Gt.add(st),st===" "&&(Ht.jump=!0),st==="r"&&(Ht.reset=!0),st==="shift"&&(Ht.sprintPressed=!0),st==="j"&&(Ht.attackPressed=!0),st==="k"&&(Ht.skill2=!0),st>="1"&&st<="5"&&(X=Number(st)),st>="6"&&st<="9"&&(le=Number(st)-5);const ut=Math.max(w0,a().keyStep||1.12);(st==="="||st==="+")&&(zt*=ut),(st==="-"||st==="_")&&(zt/=ut)},j=B=>{const st=B.key.toLowerCase();Gt.has(st)&&(Gt.delete(st),st==="j"&&(Ht.attackReleased=!0))},ft=B=>{if(Co(B.target))return;B.preventDefault();const st=B.deltaMode===1?B.deltaY*b0:B.deltaMode===2?B.deltaY*S0:B.deltaY;zt*=x0(st,a().wheelStep)},Bt=B=>{B.preventDefault()},nt=()=>{u=performance.now()};window.addEventListener("resize",nt),window.addEventListener("orientationchange",nt);const yt=typeof window<"u"?window.visualViewport:null;return yt&&(yt.addEventListener("resize",nt),yt.addEventListener("scroll",nt)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",T),window.addEventListener("pointerup",lt),window.addEventListener("pointercancel",lt),window.addEventListener("blur",At),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",Pt),window.addEventListener("keyup",j),window.addEventListener("wheel",ft,{passive:!1}),window.addEventListener("gesturestart",Bt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:g,screenOk:R,originSX:p,originSY:x,screenX:y,screenY:v,scale:b}},peekAim(){const B=performance.now(),st=Math.hypot(H,N),ut=U!==null||mt>=0&&B-mt<Bh;if(!(ut&&z&&st>=Rr))return{active:!1,holding:ut,x:0,z:0,dx:H,dy:N};const qt=i(),Yt=H/st,O=N/st,gt=qt.rightX*Yt+qt.forwardX*-O,K=qt.rightZ*Yt+qt.forwardZ*-O,rt=Math.hypot(gt,K)||1;return{active:!0,holding:ut,x:gt/rt,z:K/rt,dx:H,dy:N}},sample(){var Dt;const B=s();let st=o!==null?Math.max(-1,Math.min(1,c/B)):0,ut=o!==null?Math.max(-1,Math.min(1,h/B)):0,Vt=0,qt=0;(Gt.has("a")||Gt.has("arrowleft"))&&(Vt-=1),(Gt.has("d")||Gt.has("arrowright"))&&(Vt+=1),(Gt.has("w")||Gt.has("arrowup"))&&(qt-=1),(Gt.has("s")||Gt.has("arrowdown"))&&(qt+=1),st+=Vt,ut+=qt;let Yt=Math.hypot(st,ut);Yt>1&&(st/=Yt,ut/=Yt,Yt=1);const O=st,gt=ut;Yt<e&&(st=0,ut=0);const K=i();let rt=K.rightX*st+K.forwardX*-ut,St=K.rightZ*st+K.forwardZ*-ut;const Et=Math.hypot(rt,St);Et>1&&(rt/=Et,St/=Et);const Kt=performance.now();pt(ot.poll(Kt));const re=Math.hypot(H,N);U!==null&&(re>=y0?z=!0:re<Rr&&(z=!1));const de=U!==null||mt>=0&&Kt-mt<Bh,ae=de&&z&&re>=Rr;let be=0,ge=0;if(ae){const Tt=H/re,Qt=N/re,ie=K.rightX*Tt+K.forwardX*-Qt,se=K.rightZ*Tt+K.forwardZ*-Qt,xe=Math.hypot(ie,se)||1;be=ie/xe,ge=se/xe}!de&&U===null&&(H=0,N=0,mt=-1,z=!1);const rn=D;D=null;const bn=zt;zt=1;const Se={moveX:rt,moveZ:St,jumpPressed:Ht.jump,sprintHeld:ht.sprint||Gt.has("shift"),sprintPressed:Ht.sprintPressed,resetPressed:Ht.reset,attackPressed:Ht.attackPressed,attackHeld:ht.attack||Gt.has("j"),attackReleased:Ht.attackReleased,skill2Pressed:Ht.skill2,weaponSlot:X,dummyClickId:le,aimX:be,aimZ:ge,aimActive:ae};Ht.jump=!1,Ht.reset=!1,Ht.sprintPressed=!1,Ht.attackPressed=!1,Ht.attackReleased=!1,Ht.skill2=!1,X=0,le=0;const Ee=dt.map(Tt=>u0(Tt,K,Oh));dt=[],Ee.length>0&&(tt=Ee[Ee.length-1]);const Z=o!==null?"pointer":Gt.size>0?"keyboard":"idle";return{intents:Se,stickX:st,stickY:ut,stickRawX:O,stickRawY:gt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:R,stickOriginSX:p,stickOriginSY:x,stickScreenX:y,stickScreenY:v,stickScale:b,stickVpTop:((Dt=v0())==null?void 0:Dt.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:H,aimDY:N,source:Z,tap:rn,zoomScale:bn,gestures:Ee,lastGesture:tt}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",lt),window.removeEventListener("pointercancel",lt),window.removeEventListener("blur",At),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",Pt),window.removeEventListener("keyup",j),window.removeEventListener("wheel",ft),window.removeEventListener("resize",nt),window.removeEventListener("orientationchange",nt),yt&&(yt.removeEventListener("resize",nt),yt.removeEventListener("scroll",nt)),window.removeEventListener("gesturestart",Bt),ot.reset();for(const B of Nt)B()}}}const Vo=1,Xo=2,Wo=4,Vu=8,Yo=16,ys=32,Xu=64,Wu=128,A0=[[Vo,"atk"],[Xo,"dash"],[Wo,"link"],[Vu,"air"],[Yo,"hurt"],[ys,"aim"],[Xu,"spr"],[Wu,"chan"]];function ga(n){if(n===0)return"-";const t=A0.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const R0=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],P0=0,C0=15,Pr=19,L0=21,D0=22,k0=23,I0=24,Kn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Sn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Bn=n=>Math.round(n*180/Math.PI*10)/10,Cr=Math.PI*2;function cs(n){let t=n%Cr;return t>Math.PI&&(t-=Cr),t<-Math.PI&&(t+=Cr),t}function z0(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Vo),n.dash.phase!=="idle"&&(e|=Xo),n.playerLink.phase!=="idle"&&(e|=Wo),n.character.grounded||(e|=Vu),n.playerHurt.type!=="none"&&(e|=Yo),t.intents.aimActive&&(e|=ys),n.character.sprinting&&(e|=Xu),n.abilities.channeling&&(e|=Wu),e}function F0(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function U0(n){const t={sampleHz:n.sampleHz??Kn.sampleHz,sampleCapacity:n.sampleCapacity??Kn.sampleCapacity,eventCapacity:n.eventCapacity??Kn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Kn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Kn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Kn.aimDropDeg,freezeMs:n.freezeMs??Kn.freezeMs,freezeSpeed:n.freezeSpeed??Kn.freezeSpeed,stickLostMs:n.stickLostMs??Kn.stickLostMs,spikeMs:n.spikeMs??Kn.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",g=-1,_=-1,m=-1,p=0,x=-1e9,y=-1,v={},R=null,S=0,b=0,E=0,w=0;function M(L,k){const H=1/t.sampleHz,N=L[P0];N-c<H-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=N)}function P(L,k,H,N,z,V){const mt=v[L]??-1e9;if(k-mt<1.2)return;if(v[L]=k,L==="frameSpike"){let dt=0;for(const tt of s)tt.kind==="frameSpike"&&dt++;if(dt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ot=i.slice(-7);V&&(ot.length===0||ot[ot.length-1]!==V)&&(ot=[...ot.slice(-6),V]),s.push({kind:L,t:Sn(k),tick:H,ms:Math.round(N),detail:z,ctx:ot}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function F(L,k,H,N){a.length>=t.eventCapacity&&a.shift(),a.push({t:Sn(H),tick:N,k:L,d:k})}function D(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=L.tick;break}}function U(){const L=o,k=L.wallMs/1e3,H=L.gestures,N=ot=>Object.entries(H).filter(([dt])=>dt.endsWith(`.${ot}`)).reduce((dt,[,tt])=>dt+tt,0),z=[];if(z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),z.push(`运行 ${k.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),z.push(`摇杆活跃 ${k>0?Math.round(L.stickActiveMs/1e3/k*100):0}% · 手势 按下 ${N("press")}（单击 ${N("tap")} / 双击 ${N("doubleTap")} / 拖拽 ${N("drag")} / 长按 ${N("longPress")} / 打断 ${N("cancel")} / 拖放 ${N("release")}）`),z.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),z.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),z.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ot of s.slice(-6)){z.push(`· ${ot.kind} @t${ot.t.toFixed(2)} tick${ot.tick} ${ot.ms>0?`${ot.ms}ms `:""}${ot.detail}`);const dt=ot.ctx.map(q=>String(q[C0])).join(" "),tt=ot.ctx.map(q=>q[Pr]===""||q[Pr]==null?".":String(q[Pr])).join(" ");if(z.push(`  yaw ${dt}`),z.push(`  in  ${tt}`),ot.kind==="stickJump"||ot.kind==="stickBad"||ot.kind==="stickLost"){const q=ot.ctx.map(Q=>`${Q[L0]},${Q[D0]}`).join(" "),pt=ot.ctx.map(Q=>`${Q[k0]},${Q[I0]}`).join(" ");z.push(`  o   ${q}`),z.push(`  p   ${pt}`)}}if(a.length>0){z.push("最近事件：");for(const ot of a.slice(-12))z.push(`  ${ot.t.toFixed(2)} ${ot.k} ${ot.d}`.trimEnd())}const V=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return z.push(`摇杆坐标源 ${V}${mt}`),z.push(`UA ${e.ua}`),z.join(`
`)}return{sample(L,k,H,N=0){o.frames++,k.stickHeld&&(k.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=N,o.wallMs+=H,H>o.dtMax&&(o.dtMax=H),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const z=L.time;if(l<0&&(l=z),E=z,w=L.tick,!r)return;const V=L.character,mt=Math.hypot(k.stickX,k.stickY),ot=Math.hypot(V.velocity.x,V.velocity.z);u=L.combat.weapon;const dt=z0(L,k),tt=V.facing,pt=Math.hypot(k.intents.moveX,k.intents.moveZ)>.05?Math.atan2(k.intents.moveX,k.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=H);const Q=[Sn(z),L.tick,Math.round(H*10)/10,Sn(k.stickX),Sn(k.stickY),Sn(k.stickRawX),Sn(k.stickRawY),k.stickHeld?1:0,k.source.slice(0,8),Sn(k.intents.moveX),Sn(k.intents.moveZ),Sn(V.position.x),Sn(V.position.z),Sn(V.velocity.x),Sn(V.velocity.z),Bn(tt),Bn(V.bodyYaw),dt,Sn(V.stride),pt===null?"":Bn(pt),k.stickId===null?"":k.stickId,Math.round(k.stickOriginX),Math.round(k.stickOriginY),Math.round(k.stickPxX),Math.round(k.stickPxY),k.stickBad,Math.round(k.stickVpTop),Math.round(k.stickOriginSX),Math.round(k.stickOriginSY),Math.round(k.stickScreenX),Math.round(k.stickScreenY),k.stickScreenOk?1:0,Math.round(k.stickScale*100)/100];M(Q);const Mt=z*1e3<y;if(H>t.spikeMs&&!Mt&&z-l>.6&&(o.spikes++,P("frameSpike",z,L.tick,H,`dt ${H.toFixed(0)}ms fl=${ga(dt)}`,Q)),h!==null&&!Mt){const At=Math.abs(Bn(cs(tt-h))),Rt=Math.abs(Bn(cs(V.moveYaw-f))),C=(d|dt)&(Vo|Xo|Wo|Yo)|dt&ys,T=pt===null?null:Math.abs(Bn(cs(tt-pt))),W=pt===null||h===null?null:Math.abs(Bn(cs(h-pt))),ct=T!==null&&W!==null&&T<W-.5,lt=(d&ys)!==0&&(dt&ys)===0&&pt===null,at=T!==null&&(T<=12||ct);At>t.aimDropDeg&&lt?P("aimDrop",z,L.tick,0,`${At.toFixed(0)}° @aim→none stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${ga(dt)}`,Q):At>t.dirJumpDeg&&C===0&&!lt&&(at?(o.inTurns++,At>o.inTurnMax&&(o.inTurnMax=At)):P("dirJump",z,L.tick,0,`${At.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${Bn(h)}→${Bn(tt)} in ${pt===null?".":Bn(pt)}° mvΔ${Rt.toFixed(0)}° aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${ga(d)}→${ga(dt)}`,Q))}const Ct=(dt&(Vo|Xo|Wo|Yo))!==0,zt=L.tick-x<30;mt>.35&&ot<t.freezeSpeed&&!Ct&&!zt?(g<0&&(g=z),z-g>=t.freezeMs/1e3&&z>=_&&(P("moveFreeze",z,L.tick,(z-g)*1e3,`stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) v${ot.toFixed(2)} ${k.source} fl=${ga(dt)}`,Q),_=z+1.5,g=-1)):g=-1,k.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(m<0&&(m=z),z-m>=t.stickLostMs/1e3&&(P("stickLost",z,L.tick,(z-m)*1e3,`raw(${k.stickRawX.toFixed(2)},${k.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${ga(dt)}`,Q),m=-1,p=0)):m=-1):(p=0,m=-1);const Zt=k.stickScale>.2&&k.stickScale<5?k.stickScale:1,ht=k.stickScreenOk,Ht=ht?k.stickScreenX/Zt:k.stickPxX,X=ht?k.stickScreenY/Zt:k.stickPxY,le=ht?k.stickOriginSX/Zt:k.stickOriginX,Wt=ht?k.stickOriginSY/Zt:k.stickOriginY,Gt=Ht-le,Nt=X-Wt;if(k.stickHeld&&k.stickId!==null){const At=R;if(At&&At.held&&At.id===k.stickId){const Rt=Math.hypot(At.dx,At.dy),C=Math.hypot(Gt,Nt),T=Math.max(Rt,C),W=Math.hypot(Ht-At.cx,X-At.cy),ct=Math.abs(Bn(cs(Math.atan2(Nt,Gt)-Math.atan2(At.dy,At.dx)))),lt=T*ct*Math.PI/180,at=Math.hypot(le-At.ox,Wt-At.oy);if(T>18&&ct>35&&W<Math.max(5,lt*.35)&&P("stickJump",z,L.tick,0,`Δ${ct.toFixed(0)}° 手指只动${W.toFixed(0)}px(弧长应${lt.toFixed(0)}px) o(${Math.round(At.ox)},${Math.round(At.oy)})→(${Math.round(le)},${Math.round(Wt)}) 原点位移${at.toFixed(0)}px p(${Math.round(Ht)},${Math.round(X)}) raw(${Math.round(Gt)},${Math.round(Nt)}) id${k.stickId} ${ht?"src=屏幕":"src=client"}`,Q),ht&&At.screenOk){const Pt=Math.hypot(k.stickPxX-At.x,k.stickPxY-At.y),j=Math.hypot((k.stickScreenX-At.sx)/Zt,(k.stickScreenY-At.sy)/Zt);S+=Pt-j,Math.abs(S)>20&&(P("stickDrift",z,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) screen(${Math.round(k.stickScreenX)},${Math.round(k.stickScreenY)})`,Q),S=0)}}R={id:k.stickId,ox:le,oy:Wt,cx:Ht,cy:X,x:k.stickPxX,y:k.stickPxY,sx:k.stickScreenX,sy:k.stickScreenY,dx:Gt,dy:Nt,held:!0,screenOk:ht}}else R=null,S=0;if(k.stickBad>b){const At=k.stickBad-b;P("stickBad",z,L.tick,0,`拦截 ${At} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${k.stickBad}）o(${Math.round(k.stickOriginX)},${Math.round(k.stickOriginY)}) p(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) id${k.stickId??"-"}`,Q)}b=k.stickBad,h=tt,f=V.moveYaw,d=dt},event(L,k){const H=F0(L);D(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||F(L.type,H,k,L.tick))},gesture(L){const k=`${L.button}.${L.kind}`;o.gestures[k]=(o.gestures[k]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&F(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,E,w)},suspend(L){y=E*1e3+L,g=-1,m=-1},setEnabled(L){r=L,L||(h=null,R=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,R=null,b=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,k=s.some(H=>L-H.t<8&&(H.kind==="dirJump"||H.kind==="aimDrop"||H.kind==="moveFreeze"||H.kind==="stickLost"||H.kind==="stickJump"||H.kind==="stickBad"||H.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:k,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:R0,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const N0={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1}},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},O0={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},B0={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:8,minStep:.04,life:.09,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},H0={core:N0,scene:O0,view:B0};function Dl(n){return JSON.parse(JSON.stringify(n))}const kl=H0,G0=Dl(kl.core),$s=Dl(kl.scene),dn=Dl(kl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ni{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),ni.nextNameID=ni.nextNameID||0,this.$name.id=`lil-gui-name-${++ni.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class V0 extends ni{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Pc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const X0={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Pc,toHexString:Pc},Ps={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},W0={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ps.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Ps.toHexString(a)}},Y0={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ps.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Ps.toHexString(a)}},$0=[X0,Ps,W0,Y0];function Z0(n){return $0.find(t=>t.match(n))}class q0 extends ni{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Z0(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Pc(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Lr extends ni{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class j0 extends ni{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},a=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},s=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",_)},g=x=>{if(o){const y=x.clientX-r,v=x.clientY-l;Math.abs(v)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>d&&_()}if(!o){const y=x.clientY-c;f-=y*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",_)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,y,v,R)=>(p-x)/(y-x)*(R-v)+v,e=p=>{const x=this.$slider.getBoundingClientRect();let y=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,y=p.touches[0].clientY-l;Math.abs(x)>Math.abs(y)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let _;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const y=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class K0 extends ni{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class J0 extends ni{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Q0=`.lil-gui {
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
}`;function tg(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Hh=!1;class $o{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Hh&&r&&(tg(Q0),Hh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new K0(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new j0(this,t,e,i,a,s);case"boolean":return new V0(this,t,e);case"string":return new J0(this,t,e);case"function":return new Lr(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new q0(this,t,e,i)}addFolder(t){const e=new $o({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Lr||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Lr)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function eg(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new $o({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new $o({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=ft=>{const Bt=s.addFolder(ft);return l.push(Bt),Bt},h=(ft,Bt)=>{const nt=ft.addFolder(Bt);return r.push(nt),nt},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),g=h(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,y=h(u,"角色间分离 / 挤压阻力");y.add(x,"iterations",1,8,1).name("迭代次数"),y.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),y.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),y.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),y.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,R=h(u,"假人 AI");R.add(v,"moveSpeed",.5,8,.1).name("移动速度"),R.add(v,"wanderRadius",.5,8,.1).name("游走半径"),R.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(v,"keepDistance",1,10,.1).name("保持距离"),R.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(v,"attackRange",.5,5,.1).name("攻击距离"),R.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),b=h(S,"程序化步态");b.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),b.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),b.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),b.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),b.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),b.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),b.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),b.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),b.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),b.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),b.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),b.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),b.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),b.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),b.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),b.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const E=h(S,"停步收相 / 胸朝向");E.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),E.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),E.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),E.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),E.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const w=h(S,"停步惯性");w.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),w.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),w.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),w.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),w.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),w.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),w.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(S,"足部 IK"),F=t.ik;P.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(F,"weight",0,1,.01).name("钉地权重"),P.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const D=h(S,"惯性倾斜 / 盆骨"),U=t.lean;D.add(U,"accelGain",0,.1,.002).name("前后加速度增益"),D.add(U,"turnGain",0,.2,.005).name("绕圈侧倾增益"),D.add(U,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),D.add(U,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),D.add(U,"smoothing",1,30,1).name("倾斜平滑速率"),D.add(U,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),D.add(U,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),D.add(U,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),D.add(U,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,k=h(S,"朝向 / 下盘带转");k.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const H=o.gaze,N=h(S,"接敌注视 / 俯仰 (v9s.18)");N.add(H,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),N.add(H,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),N.add(H,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),N.add(H,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),N.add(H,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),N.add(H,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),N.add(H,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),N.add(H,"headPitchRate",.5,20,.5).name("头部俯仰速率"),N.add(H,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),N.add(H,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),N.add(H,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const z=h(S,"原地转身 / 停步偏差 (v9s)"),V=o.turnInPlace;z.add(V,"enabled").name("启用原地转身 (关=纯插值)"),z.add(V,"triggerDeg",20,180,5).name("触发夹角 (°)"),z.add(V,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),z.add(V,"settleDeg",0,60,1).name("转身保留余角 (°)"),z.add(V,"durationSec",.1,1.5,.02).name("转身时长 (s)"),z.add(V,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),z.add(V,"inputDeadZone",0,.5,.01).name("起步输入死区"),z.add(V,"armSec",0,.5,.01).name("触发防抖 (s)"),z.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),z.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),z.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),z.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),z.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),z.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),ot=o.combat,dt=h(mt,"连击 / 武器"),tt=dt.add(n.combat,"weapon",aa).name("当前武器");dt.add(ot,"comboWindow",.1,2,.05).name("连击窗口 (s)"),dt.add(ot,"settle",0,.8,.01).name("段间停顿 (s)"),dt.add(ot,"attackMoveScale",0,1,.01).name("攻击时移动比例"),dt.add(ot,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),dt.add(ot,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),dt.add(ot,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),dt.add(ot,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),dt.add(ot,"cancelWindow",0,1,.01).name("取消窗口 (s)"),dt.add(ot,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),dt.add(ot,"autoCombo").name("按住自动连击"),dt.add(ot.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),dt.add(ot.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),dt.add(ot.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const q=h(mt,"夸张化 (v9s.22)"),pt=t.animation.stretch;q.add(pt,"enabled").name("四肢伸缩 开"),q.add(pt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),q.add(pt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),q.add(pt,"impactSquash",0,.5,.01).name("命中挤压量"),q.add(pt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),q.add(pt,"torsoGain",0,1,.05).name("躯干跟随比例"),q.add(pt,"volumeExp",0,1.5,.05).name("体积补偿指数");const Q=t.animation.swing;q.add(Q,"enabled").name("挥击身体幅度 开"),q.add(Q,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),q.add(Q,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),q.add(Q,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),q.add(Q,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),q.add(Q,"segBlend",0,.35,.01).name("段间姿态过渡 (s)"),q.add(Q.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const Mt=t.weaponTrail;q.add(Mt,"enabled").name("挥击刀光 开"),q.add(Mt,"life",.04,.4,.01).name("刀光残留 (s)"),q.add(Mt,"intensity",0,1.5,.05).name("刀光亮度"),q.add(Mt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),q.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),q.add(t.hitstop,"enabled").name("命中定格 开"),q.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const Ct=t.weaponWrist;q.add(Ct,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),q.add(Ct,"lag",0,.08,.002).name("臂速 → 腕滞后"),q.add(Ct,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),q.add(Ct,"rate",4,50,1).name("腕部跟随速率 (1/s)"),q.add(Ct,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),q.add(Ct,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const zt=t.weaponMount;q.add(zt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),q.add(zt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),q.add(zt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),q.add(zt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),q.add(zt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),q.add(zt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),dt.add(ot.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),dt.add(ot.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),dt.add(ot.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),dt.add(ot.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),dt.add(ot.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),dt.add(ot.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),dt.add(ot.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),dt.add(ot.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),dt.add(ot.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),dt.add(ot.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Zt=o.abilities;dt.add(Zt.arcane,"perWave",1,8,1).name("每波飞弹数"),dt.add(Zt.arcane,"waves",1,12,1).name("每次引导波数"),dt.add(Zt.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),dt.add(Zt.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),dt.add(Zt.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),dt.add(Zt.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),dt.add(Zt.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),dt.add(Zt.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),dt.add(Zt.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),dt.add(Zt.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),dt.add(Zt.arcane,"speed",3,24,.5).name("飞弹速度"),dt.add(Zt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),dt.add(Zt.ring,"radius",.5,5,.1).name("电环半径"),dt.add(Zt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),dt.add(Zt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ht=h(mt,"攻击动作 / 跨步 / 落地");ht.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),ht.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),ht.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const Ht=t.animation.stride;ht.add(Ht,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),ht.add(Ht,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),ht.add(Ht,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),ht.add(Ht,"cycles",1,3,1).name("每段跨步周期数"),ht.add(Ht,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),ht.add(Ht,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),ht.add(Ht,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),ht.add(Ht,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),ht.add(Ht,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),ht.add(Ht,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),ht.add(Ht,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),ht.add(Ht,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),ht.add(Ht,"heavyScale",0,1,.01).name("大剑重击收敛系数"),ht.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),ht.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),ht.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),ht.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),ht.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),ht.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),ht.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),ht.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),ht.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),ht.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),ht.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),ht.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const X=h(mt,"武器握持");X.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),X.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),X.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),X.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const le=o.hits,Wt=h(mt,"命中 / 受击 / 击退");Wt.add(le,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Wt.add(le,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Wt.add(le,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Wt.add(le,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Wt.add(le.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Wt.add(le.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Wt.add(le,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Wt.add(le,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Gt=o.targeting,Nt=h(mt,"目标辅助");Nt.add(Gt,"targetAssist").name("启用目标辅助"),Nt.add(Gt,"range",1,14,.5).name("锁定范围 (m)"),Nt.add(Gt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Nt.add(Gt,"frontBias",0,4,.1).name("朝向加权"),Nt.add(Gt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Nt.add(Gt,"maxLungeScale",1,3,.1).name("前冲最大放大");const At=h(mt,"受击分层"),Rt=t.hurt;At.add(Rt,"enabled").name("启用分层受击 (关=旧版对照)"),At.add(Rt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),At.add(Rt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),At.add(Rt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),At.add(Rt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),At.add(Rt,"upperShiftScale",0,1,.01).name("上身位移缩放"),At.add(Rt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),At.add(Rt.hitHeight,"light",0,1,.01).name("轻击命中部位"),At.add(Rt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),At.add(Rt.hitHeight,"knock",0,1,.01).name("击退命中部位"),At.add(Rt,"leanLight",0,1.5,.01).name("轻击力度"),At.add(Rt,"leanHeavy",0,1.5,.01).name("重击力度"),At.add(Rt,"leanKnock",0,1.5,.01).name("击退力度"),At.add(Rt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Rt.abdomen},{name:"打肩 (shoulder)",p:Rt.shoulder}].map(({name:ft,p:Bt})=>{const nt=h(At,ft);return nt.add(Bt,"upperPitch",0,2,.01).name("上身前后倾斜"),nt.add(Bt,"upperRoll",0,2,.01).name("上身侧倾"),nt.add(Bt,"upperYaw",0,1.5,.01).name("肩部扭转"),nt.add(Bt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),nt.add(Bt,"shift",0,.8,.01).name("身体反应位移"),nt.add(Bt,"drop",0,.4,.01).name("整体下沉"),nt.add(Bt,"back",0,.4,.01).name("屁股向后"),nt.add(Bt,"knee",0,1.6,.01).name("屈膝"),nt.add(Bt,"hip",0,1,.01).name("髋前倾"),nt.add(Bt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),nt});const C=h(mt,"派生招"),T=o.links;C.add(T,"enabled").name("总开关 (false=旧连击)"),C.add(T.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),C.add(T.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),C.add(T.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),C.add(T,"sharedCooldown",0,3,.05).name("共享 CD (s)"),C.add(T,"triggerWhileSprinting").name("长跑中可直接触发"),C.add(T.search,"range",1,14,.1).name("索敌距离 (m)"),C.add(T.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),C.add(T.search,"stopDistance",0,3,.05).name("停住距离 (m)");const W=T.moves["sword-shield"];W&&(C.add(W,"enabled").name("剑盾盾击"),C.add(W,"distance",0,8,.1).name("冲锋极限 (m)"),C.add(W,"windup",0,.5,.01).name("前摇 (s)"),C.add(W,"active",0,.8,.01).name("冲锋 / 命中 (s)"),C.add(W,"recovery",0,.8,.01).name("收势 (s)"),C.add(W.hit,"radius",0,4,.05).name("命中半径 (m)"),C.add(W.hit,"width",0,2,.05).name("扫掠半径 (m)"),C.add(W.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),C.add(W.hit,"duration",0,1.5,.01).name("僵直 (s)")),C.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const ct=c("相机"),lt=h(ct,"基础");lt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),lt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),lt.add(t.camera,"distance",6,35,.5).name("距离"),lt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),lt.add(t.camera,"fov",25,90,1).name("FOV");const at=o.camera,Pt=h(ct,"智能构图");Pt.add(at,"radius",2,18,.5).name("威胁评估半径 (m)"),Pt.add(at,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Pt.add(at,"saturation",.5,8,.1).name("威胁归一化饱和"),Pt.add(at,"pushIn",0,.5,.01).name("无威胁推进比例"),Pt.add(at,"maxPullback",0,1,.02).name("最大拉远比例"),Pt.add(at,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Pt.add(at,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Pt.add(at,"framingBias",0,1,.05).name("威胁质心平移系数"),Pt.add(at,"attackBoost",0,2,.05).name("挥砍中额外加权"),Pt.add(at.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Pt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const j=h(ct,"缩放");return j.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),j.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),j.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),j.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),j.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),j.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),j.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),j.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(ft=>ft.close()),l.forEach(ft=>ft.close()),s.close(),{gui:s,refreshWeapon:()=>tt.updateDisplay()}}function ng(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function ig(n,t){return n.find(e=>e.id===t)??null}function Gh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function ag({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return ng(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[y,v]of l)v.classList.toggle("is-active",y===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):x&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(x=>x.index===m)??null:ig(n,m);return p?(Ym(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function _(){Nu(t)}if(s){s.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),s.appendChild(m);for(const v of[...n].sort((R,S)=>R.index-S.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=v.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",v.color),R.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const b=document.createElement("span");b.className="lab-name",b.textContent=v.name,R.append(S,b),R.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(v.id)}),s.appendChild(R),l.set(v.id,R)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const y=document.createElement("button");if(y.type="button",y.className="lab-btn",y.dataset.uiButton="",y.textContent="召回假人",y.setAttribute("aria-label","召回全部假人回到各自工位"),y.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),x.appendChild(y),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),a()}),x.appendChild(v)}s.appendChild(x)}return window.addEventListener("keydown",m=>{var p,x;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const y=Gh(n,((p=d())==null?void 0:p.id)??o,-1);y&&g(y.id)}else if(m.key==="]"){const y=Gh(n,((x=d())==null?void 0:x.id)??o,1);y&&g(y.id)}else m.key==="\\"&&_()}),u(),{goto:g,current:d,tick:u,recall:_,element:s}}const Dr=Math.PI*2,Jn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},sg=45,og=50;function rg(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function ls(n,t,e){const i=rg(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function cg(n,t){return Math.atan2(n,-t)*180/Math.PI}function Vh(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Zs(n){return(n%360+360)%360}const lg={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function hg(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?ls(s.moveX,s.moveZ,e):null,f=c>.15?ls(l.x,l.z,e):null,d=ls(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?ls(s.aimX,s.aimZ,e):null,g=n.targeting,_=g.hasTarget?ls(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?Vh(h,f):null,p=h!==null?Vh(h,d):null,x=m!==null&&m>sg&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?cg(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:_,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function Xh(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>og&&(n.inLen>=.35||n.speed>=.4)}const Wh="harness.dirDebug";function dg(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Wh)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(y){if(l=y,!t)try{window.localStorage.setItem(Wh,y?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",y=>{y.preventDefault(),y.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",y=>{y.key.toLowerCase()==="v"&&!y.metaKey&&!y.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=lg,g=0,_="",m=8;function p(y){if(!r)return;const v=d,R=d,S=v/2,b=R/2,E=Math.min(v,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,R),r.beginPath(),r.arc(S,b,E,0,Dr),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=y.warnMove?"rgba(251, 191, 36, 0.85)":Jn.ring,r.stroke(),r.strokeStyle=Jn.grid,r.beginPath(),r.moveTo(S-E,b),r.lineTo(S+E,b),r.moveTo(S,b-E),r.lineTo(S,b+E),r.stroke();for(let F=0;F<8;F++){const D=F*Math.PI/4,U=S+Math.sin(D)*(E-3),L=b-Math.cos(D)*(E-3),k=S+Math.sin(D)*E,H=b-Math.cos(D)*E;r.beginPath(),r.moveTo(U,L),r.lineTo(k,H),r.stroke()}const w=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;w>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Jn.dead,r.beginPath(),r.arc(S,b,E*w,0,Dr),r.stroke(),r.restore());const M=(F,D,U,L,k=!1,H=1)=>{const N=F*Math.PI/180,z=Math.sin(N),V=-Math.cos(N),mt=E*Math.max(.14,Math.min(1,D)),ot=S+z*E*.14,dt=b+V*E*.14,tt=S+z*mt,q=b+V*mt;if(r.save(),r.globalAlpha=H,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=L,r.lineCap="round",k&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ot,dt),r.lineTo(tt,q),r.stroke(),!k&&mt>E*.3){const pt=-V,Q=z,Mt=5.2;r.beginPath(),r.moveTo(tt+z*1.5,q+V*1.5),r.lineTo(tt-z*Mt+pt*Mt*.72,q-V*Mt+Q*Mt*.72),r.lineTo(tt-z*Mt-pt*Mt*.72,q-V*Mt-Q*Mt*.72),r.closePath(),r.fill()}r.restore()},P=(F,D)=>{const U=F*Math.PI/180,L=Math.sin(U),k=-Math.cos(U),H=-k,N=L,z=E+1.5,V=z+6.5;r.save(),r.fillStyle=D,r.strokeStyle=D,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*V,b+k*V),r.lineTo(S+L*z+H*4,b+k*z+N*4),r.lineTo(S+L*z-H*4,b+k*z-N*4),r.closePath(),r.fill(),r.restore()};y.lockDeg!==null&&M(y.lockDeg,1,Jn.lock,1,!0,.7),y.rawDeg!==null&&y.stickHeld&&M(y.rawDeg,y.rawLen,Jn.raw,1,!0,.9),y.aimDeg!==null&&M(y.aimDeg,1,Jn.aim,1.6,!0,.95),M(y.faceDeg,1,Jn.face,1.1,!0,.55),y.moveDeg!==null&&M(y.moveDeg,y.speed/Math.max(1,m),Jn.move,5.5,!1,.8),y.inDeg!==null&&M(y.inDeg,y.inLen,Jn.input,2.2),P(y.faceDeg,Jn.face),r.beginPath(),r.arc(S,b,2.2,0,Dr),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(y,v){const R=E=>E===null?"-":String(Math.round(Zs(E)));o.in.textContent=`入 ${R(y.inDeg)}`,o.mv.textContent=`移 ${R(y.moveDeg)}`,o.fc.textContent=`面 ${R(y.faceDeg)}`;const S=E=>E===null?"-":`${Math.round(E)}°`,b=[`Δ入→移 ${S(y.gapMove)}`,`Δ入→面 ${S(y.gapFace)}`];y.speed>.05&&b.push(`v${y.speed.toFixed(1)}`),y.lockDeg!==null&&b.push(`锁#${y.lockId} ${y.lockDist.toFixed(1)}m`),y.aimDeg!==null&&b.push("拖拽瞄准"),o.gap.textContent=b.join("  "),e.classList.toggle("is-warn",y.warnMove||Xh(y,v))}return{update(y,v,R){if(!l)return;m=Math.max(1,y.config.moveSpeed*Math.max(1,y.config.sprintMultiplier));const S=hg(y,v,R,m);u=S;const b=y.combat.phase!=="idle";p(S);const E=performance.now(),w=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(E-g>90||w!==_)&&(g=E,_=w,x(S,b),e.dataset.in=S.inDeg===null?"":Zs(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Zs(S.moveDeg).toFixed(1),e.dataset.fc=Zs(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Xh(S,b)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const ug=6,fg=480,Yh=240,$h=92,pg=18;function mg(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function gg(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function xg(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function vg(n={}){const t=Math.max(1,n.windowS??ug),e=Math.max(60,n.capacity??fg),i=Math.max(1,n.speedCap??pg),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Yh*u),l.height=Math.round($h*u);const g=dg({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function m(E){_=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),m(!_)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&m(!_)}));const p=[];let x=0,y=null,v=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(E){const w=E-t;let M=0;for(;M<p.length&&p[M].t<w;)M++;return p.slice(M)}function b(E,w){if(!d)return;const M=Yh,P=$h;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,P);const F=4,D=4,U=M-F-D,L=9,k=46,H=62,N=22,z=w-t,V=Q=>F+Math.max(0,Math.min(1,(Q-z)/t))*U;for(let Q=0;Q<E.length;Q++){if(!E[Q].busy)continue;const Mt=V(E[Q].t),Ct=Q+1<E.length?V(E[Q+1].t):Mt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Mt,L,Math.max(2,Ct-Mt),k)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const Q of[L,L+k/2,L+k])d.moveTo(F,Q),d.lineTo(M-D,Q);d.moveTo(F,H+N/2),d.lineTo(M-D,H+N/2),d.stroke();const ot=Math.max(1,...E.map(Q=>Q.speed),...E.map(Q=>Q.drive))*1.15,dt=Q=>L+k-Q/ot*k;if(E.length>1){d.beginPath(),d.moveTo(V(E[0].t),dt(E[0].speed));for(let Q=1;Q<E.length;Q++)d.lineTo(V(E[Q].t),dt(E[Q].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(V(E[E.length-1].t),L+k),d.lineTo(V(E[0].t),L+k),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(V(E[0].t),dt(E[0].drive));for(let Q=1;Q<E.length;Q++)d.lineTo(V(E[Q].t),dt(E[Q].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let tt=.02;for(const Q of E)tt=Math.max(tt,Math.abs(Q.dv));tt*=1.1;const q=H+N/2,pt=N/2;for(const Q of E){const Mt=Math.min(pt,Math.abs(Q.dv)/tt*pt);d.fillStyle=Q.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(V(Q.t)-.7,Q.dv>=0?q-Mt:q,1.4,Math.max(.5,Mt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ot.toFixed(1),F+2,L+8),d.fillText("v",F+2,L+k-2),d.fillText("Δv",F+2,H+9),d.textAlign="right",d.fillText("0",M-D-2,L+k-2),d.textAlign="left"}return{dirDebug:g,update(E,w,M){const P=performance.now()/1e3,F=v<0?1/60:Math.max(1e-4,Math.min(.25,P-v));v=P;const D=E.character,U={x:D.position.x,z:D.position.z},L=Math.hypot(D.velocity.x,D.velocity.z),{speed:k,raw:H}=y?gg(y,U,F,i):{speed:0,raw:0},N=mg(x,k,F,P);N.drive=L,N.raw=H,N.busy=xg(E),y=U,x=k,p.push(N),p.length>e&&p.shift();const z=S(P);let V=0;for(const mt of z)V=Math.max(V,mt.speed);if(R={speed:k,drive:L,raw:H,dv:N.dv,accel:N.accel,peak:V,samples:z.length,windowS:t,busy:N.busy},g.update(E,w,M),_){b(z,P);const mt=N.dv>=0?"+":"";c.textContent=`v ${k.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${V.toFixed(2)} · Δv ${mt}${N.dv.toFixed(3)} · ${z.length} 帧`}},setEnabled:m,toggle(){return m(!_),_},enabled:()=>_,last:()=>({...R}),samples:()=>S(performance.now()/1e3).map(E=>({...E}))}}const _g=["剑盾","双剑","大剑","法杖","弓"],yg={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Mg(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=ht=>ht.toFixed(2),g=ht=>(ht*180/Math.PI).toFixed(0),_=_g[aa.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,y=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${y.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,R=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),b=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),E=Math.abs(S)+Math.abs(b)+1e-6,w=Math.round(Math.abs(b)/E*100),M=`strafe ${w}%${S<-.05?" back":""}`,P=t.camera,F=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,D=o?u(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,L=U?`gw ${u(U.gaitScale)}  lw ${u(U.attackLegWeight)}  spd ${u(U.driveSpeed)}`:"-",k=U?`${u(U.gaitScale)}/${u(U.attackLegWeight)}`:"-",H=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",N=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",z=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",V=o==null?void 0:o.hurt,mt=V?`hurt ${t.playerHurt.type}  部位h${u(V.hitHeight)}  脉冲p${u(V.pulse)}  上身${u(V.upperShift)}  重心${u(V.comShift)}  后坐${u(V.pelvisBack)}  屈膝${u(V.knee)}`:"-",ot=V?`${u(V.hitHeight)}/${u(V.pulse)}/${u(V.knee)}`:"-",dt=o==null?void 0:o.ik,tt=dt?`${dt.active?"on":"off"} w${u(dt.weight)} e${u(dt.maxError)}`:"-",q=t.playerLink,pt=`link ${q.kind||"-"}  ${q.phase}  prog ${u(q.progress)}  win ${u(q.linkWindow)}s  cd ${u(q.cooldown)}s  hits ${q.hitIds.length}  travel ${u(q.travelled)}/${u(q.travel)}m  id ${q.id}`,Q=`${q.phase}/${q.kind||"-"}/w${u(q.linkWindow)}`,Mt=a.lastGesture,Ct=Mt?`${Mt.button} ${Mt.kind} ${Mt.heldMs.toFixed(0)}ms d${Mt.distance.toFixed(0)}px ${Mt.angleDeg.toFixed(0)}° taps${Mt.taps}`:"-",zt=t.dummies.map(ht=>`${ht.id}:${yg[ht.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${q.phase}${q.kind?`/${q.kind}`:""} w${u(q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${w}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${D}  gw/lw ${k}  land ${N}  ik ${tt}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ot}`,`dummies ${zt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${z}  lk ${Q}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Ct}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${D}   ${L}   land ${H}`,mt,`ik ${tt}  clamped ${dt?dt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${R}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${y.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,pt,`camera ${F}  ${z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${zt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Ct}`].join(`
`)}}}const qs=["lab","hud","motion","debug"],Zh={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},qh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function bg(n){var l;const t=Object.fromEntries(qs.map(c=>[c,document.getElementById(qh[c].toggle)])),e=Object.fromEntries(qs.map(c=>[c,document.getElementById(qh[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of qs){const u=a===d,g=t[d],_=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${Zh[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${Zh[d].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of qs)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Il="170",Sg=0,jh=1,wg=2,Yu=1,$u=2,fi=3,Ii=0,wn=1,He=2,Di=0,Ba=1,Ai=2,Kh=3,Jh=4,Eg=5,Qi=100,Tg=101,Ag=102,Rg=103,Pg=104,Cg=200,Lg=201,Dg=202,kg=203,Cc=204,Lc=205,Ig=206,zg=207,Fg=208,Ug=209,Ng=210,Og=211,Bg=212,Hg=213,Gg=214,Dc=0,kc=1,Ic=2,Wa=3,zc=4,Fc=5,Uc=6,Nc=7,zl=0,Vg=1,Xg=2,ki=0,Wg=1,Yg=2,$g=3,Zg=4,qg=5,jg=6,Kg=7,Zu=300,Ya=301,$a=302,Oc=303,Bc=304,ar=306,Hc=1e3,ea=1001,Gc=1002,Yn=1003,Jg=1004,js=1005,ei=1006,kr=1007,na=1008,vi=1009,qu=1010,ju=1011,Cs=1012,Fl=1013,sa=1014,mi=1015,Ns=1016,Ul=1017,Nl=1018,Za=1020,Ku=35902,Ju=1021,Qu=1022,Wn=1023,tf=1024,ef=1025,Ha=1026,qa=1027,nf=1028,Ol=1029,af=1030,Bl=1031,Hl=1033,Lo=33776,Do=33777,ko=33778,Io=33779,Vc=35840,Xc=35841,Wc=35842,Yc=35843,$c=36196,Zc=37492,qc=37496,jc=37808,Kc=37809,Jc=37810,Qc=37811,tl=37812,el=37813,nl=37814,il=37815,al=37816,sl=37817,ol=37818,rl=37819,cl=37820,ll=37821,zo=36492,hl=36494,dl=36495,sf=36283,ul=36284,fl=36285,pl=36286,Qg=3200,tx=3201,of=0,ex=1,Ri="",_n="srgb",Ka="srgb-linear",sr="linear",ke="srgb",xa=7680,Qh=519,nx=512,ix=513,ax=514,rf=515,sx=516,ox=517,rx=518,cx=519,ml=35044,td=35048,ed="300 es",gi=2e3,Zo=2001;class Ja{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let nd=1234567;const Ga=Math.PI/180,Ls=180/Math.PI;function ii(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]+"-"+un[t&255]+un[t>>8&255]+"-"+un[t>>16&15|64]+un[t>>24&255]+"-"+un[e&63|128]+un[e>>8&255]+"-"+un[e>>16&255]+un[e>>24&255]+un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]).toLowerCase()}function cn(n,t,e){return Math.max(t,Math.min(e,n))}function Gl(n,t){return(n%t+t)%t}function lx(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function hx(n,t,e){return n!==t?(e-n)/(t-n):0}function Ms(n,t,e){return(1-e)*n+e*t}function dx(n,t,e,i){return Ms(n,t,1-Math.exp(-e*i))}function ux(n,t=1){return t-Math.abs(Gl(n,t*2)-t)}function fx(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function px(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function mx(n,t){return n+Math.floor(Math.random()*(t-n+1))}function gx(n,t){return n+Math.random()*(t-n)}function xx(n){return n*(.5-Math.random())}function vx(n){n!==void 0&&(nd=n);let t=nd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _x(n){return n*Ga}function yx(n){return n*Ls}function Mx(n){return(n&n-1)===0&&n!==0}function bx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Sx(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function wx(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),g=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Xn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ce(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const id={DEG2RAD:Ga,RAD2DEG:Ls,generateUUID:ii,clamp:cn,euclideanModulo:Gl,mapLinear:lx,inverseLerp:hx,lerp:Ms,damp:dx,pingpong:ux,smoothstep:fx,smootherstep:px,randInt:mx,randFloat:gx,randFloatSpread:xx,seededRandom:vx,degToRad:_x,radToDeg:yx,isPowerOfTwo:Mx,ceilPowerOfTwo:bx,floorPowerOfTwo:Sx,setQuaternionFromProperEuler:wx,normalize:Ce,denormalize:Xn};class $t{constructor(t=0,e=0){$t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(cn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ue{constructor(t,e,i,a,s,o,r,l,c){ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],_=a[0],m=a[3],p=a[6],x=a[1],y=a[4],v=a[7],R=a[2],S=a[5],b=a[8];return s[0]=o*_+r*x+l*R,s[3]=o*m+r*y+l*S,s[6]=o*p+r*v+l*b,s[1]=c*_+h*x+f*R,s[4]=c*m+h*y+f*S,s[7]=c*p+h*v+f*b,s[2]=d*_+u*x+g*R,s[5]=d*m+u*y+g*S,s[8]=d*p+u*v+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,g=e*f+i*d+a*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=u*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Ir.makeScale(t,e)),this}rotate(t){return this.premultiply(Ir.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ir.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ir=new ue;function cf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function qo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ex(){const n=qo("canvas");return n.style.display="block",n}const ad={};function vs(n){n in ad||(ad[n]=!0,console.warn(n))}function Tx(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Ax(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Rx(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Me={enabled:!0,workingColorSpace:Ka,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ke&&(n.r=xi(n.r),n.g=xi(n.g),n.b=xi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ke&&(n.r=Va(n.r),n.g=Va(n.g),n.b=Va(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ri?sr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function xi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Va(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const sd=[.64,.33,.3,.6,.15,.06],od=[.2126,.7152,.0722],rd=[.3127,.329],cd=new ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ld=new ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Me.define({[Ka]:{primaries:sd,whitePoint:rd,transfer:sr,toXYZ:cd,fromXYZ:ld,luminanceCoefficients:od,workingColorSpaceConfig:{unpackColorSpace:_n},outputColorSpaceConfig:{drawingBufferColorSpace:_n}},[_n]:{primaries:sd,whitePoint:rd,transfer:ke,toXYZ:cd,fromXYZ:ld,luminanceCoefficients:od,outputColorSpaceConfig:{drawingBufferColorSpace:_n}}});let va;class Px{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{va===void 0&&(va=qo("canvas")),va.width=t.width,va.height=t.height;const i=va.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=va}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=qo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=xi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(xi(e[i]/255)*255):e[i]=xi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Cx=0;class lf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cx++}),this.uuid=ii(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(zr(a[o].image)):s.push(zr(a[o]))}else s=zr(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function zr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Px.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Lx=0;class Mn extends Ja{constructor(t=Mn.DEFAULT_IMAGE,e=Mn.DEFAULT_MAPPING,i=ea,a=ea,s=ei,o=na,r=Wn,l=vi,c=Mn.DEFAULT_ANISOTROPY,h=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Lx++}),this.uuid=ii(),this.name="",this.source=new lf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Zu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Hc:t.x=t.x-Math.floor(t.x);break;case ea:t.x=t.x<0?0:1;break;case Gc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Hc:t.y=t.y-Math.floor(t.y);break;case ea:t.y=t.y<0?0:1;break;case Gc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Mn.DEFAULT_IMAGE=null;Mn.DEFAULT_MAPPING=Zu;Mn.DEFAULT_ANISOTROPY=1;class Ye{constructor(t=0,e=0,i=0,a=1){Ye.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(c+1)/2,v=(u+1)/2,R=(p+1)/2,S=(h+d)/4,b=(f+_)/4,E=(g+m)/4;return y>v&&y>R?y<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(y),a=S/i,s=b/i):v>R?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=E/a):R<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(R),i=b/s,a=E/s),this.set(i,a,s,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-_)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Dx extends Ja{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ye(0,0,t,e),this.scissorTest=!1,this.viewport=new Ye(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Mn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new lf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oa extends Dx{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class hf extends Mn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Yn,this.minFilter=Yn,this.wrapR=ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class kx extends Mn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Yn,this.minFilter=Yn,this.wrapR=ea,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Os{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],g=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(f!==_||l!==d||c!==u||h!==g){let m=1-r;const p=l*d+c*u+h*g+f*_,x=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){const R=Math.sqrt(y),S=Math.atan2(R,p*x);m=Math.sin(m*S)/R,r=Math.sin(r*S)/R}const v=r*x;if(l=l*m+d*v,c=c*m+u*v,h=h*m+g*v,f=f*m+_*v,m===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],g=s[o+3];return t[e]=r*g+h*f+l*u-c*d,t[e+1]=l*g+h*d+c*f-r*u,t[e+2]=c*g+h*u+r*d-l*f,t[e+3]=h*g-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"YZX":this._x=d*h*f+c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f-d*u*g;break;case"XZY":this._x=d*h*f-c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(cn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Fr.copy(this).projectOnVector(t),this.sub(Fr)}reflect(t){return this.sub(Fr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(cn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fr=new G,hd=new Os;class Bs{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Hn):Hn.fromBufferAttribute(s,o),Hn.applyMatrix4(t.matrixWorld),this.expandByPoint(Hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ks.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ks.copy(i.boundingBox)),Ks.applyMatrix4(t.matrixWorld),this.union(Ks)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Hn),Hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hs),Js.subVectors(this.max,hs),_a.subVectors(t.a,hs),ya.subVectors(t.b,hs),Ma.subVectors(t.c,hs),Mi.subVectors(ya,_a),bi.subVectors(Ma,ya),Hi.subVectors(_a,Ma);let e=[0,-Mi.z,Mi.y,0,-bi.z,bi.y,0,-Hi.z,Hi.y,Mi.z,0,-Mi.x,bi.z,0,-bi.x,Hi.z,0,-Hi.x,-Mi.y,Mi.x,0,-bi.y,bi.x,0,-Hi.y,Hi.x,0];return!Ur(e,_a,ya,Ma,Js)||(e=[1,0,0,0,1,0,0,0,1],!Ur(e,_a,ya,Ma,Js))?!1:(Qs.crossVectors(Mi,bi),e=[Qs.x,Qs.y,Qs.z],Ur(e,_a,ya,Ma,Js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ri),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ri=[new G,new G,new G,new G,new G,new G,new G,new G],Hn=new G,Ks=new Bs,_a=new G,ya=new G,Ma=new G,Mi=new G,bi=new G,Hi=new G,hs=new G,Js=new G,Qs=new G,Gi=new G;function Ur(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){Gi.fromArray(n,s);const r=a.x*Math.abs(Gi.x)+a.y*Math.abs(Gi.y)+a.z*Math.abs(Gi.z),l=t.dot(Gi),c=e.dot(Gi),h=i.dot(Gi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Ix=new Bs,ds=new G,Nr=new G;class or{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Ix.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ds.subVectors(t,this.center);const e=ds.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(ds,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ds.copy(t.center).add(Nr)),this.expandByPoint(ds.copy(t.center).sub(Nr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ci=new G,Or=new G,to=new G,Si=new G,Br=new G,eo=new G,Hr=new G;class Vl{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ci)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=ci.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ci.copy(this.origin).addScaledVector(this.direction,e),ci.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Or.copy(t).add(e).multiplyScalar(.5),to.copy(e).sub(t).normalize(),Si.copy(this.origin).sub(Or);const s=t.distanceTo(e)*.5,o=-this.direction.dot(to),r=Si.dot(this.direction),l=-Si.dot(to),c=Si.lengthSq(),h=Math.abs(1-o*o);let f,d,u,g;if(h>0)if(f=o*l-r,d=o*r-l,g=s*h,f>=0)if(d>=-g)if(d<=g){const _=1/h;f*=_,d*=_,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(Or).addScaledVector(to,d),u}intersectSphere(t,e){ci.subVectors(t.center,this.origin);const i=ci.dot(this.direction),a=ci.dot(ci)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,ci)!==null}intersectTriangle(t,e,i,a,s){Br.subVectors(e,t),eo.subVectors(i,t),Hr.crossVectors(Br,eo);let o=this.direction.dot(Hr),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Si.subVectors(this.origin,t);const l=r*this.direction.dot(eo.crossVectors(Si,eo));if(l<0)return null;const c=r*this.direction.dot(Br.cross(Si));if(c<0||l+c>o)return null;const h=-r*Si.dot(Hr);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ne{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,g,_,m){Ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,_,m)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ne().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ba.setFromMatrixColumn(t,0).length(),s=1/ba.setFromMatrixColumn(t,1).length(),o=1/ba.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,g=r*h,_=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+g*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=g+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,g=c*h,_=c*f;e[0]=d+_*r,e[4]=g*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-g,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,g=c*h,_=c*f;e[0]=d-_*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,g=r*h,_=r*f;e[0]=l*h,e[4]=g*c-u,e[8]=d*c+_,e[1]=l*f,e[5]=_*c+d,e[9]=u*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=_-d*f,e[8]=g*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+g,e[10]=d-_*f}else if(t.order==="XZY"){const d=o*l,u=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+_,e[5]=o*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*h,e[10]=_*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zx,t,Fx)}lookAt(t,e,i){const a=this.elements;return An.subVectors(t,e),An.lengthSq()===0&&(An.z=1),An.normalize(),wi.crossVectors(i,An),wi.lengthSq()===0&&(Math.abs(i.z)===1?An.x+=1e-4:An.z+=1e-4,An.normalize(),wi.crossVectors(i,An)),wi.normalize(),no.crossVectors(An,wi),a[0]=wi.x,a[4]=no.x,a[8]=An.x,a[1]=wi.y,a[5]=no.y,a[9]=An.y,a[2]=wi.z,a[6]=no.z,a[10]=An.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],_=i[6],m=i[10],p=i[14],x=i[3],y=i[7],v=i[11],R=i[15],S=a[0],b=a[4],E=a[8],w=a[12],M=a[1],P=a[5],F=a[9],D=a[13],U=a[2],L=a[6],k=a[10],H=a[14],N=a[3],z=a[7],V=a[11],mt=a[15];return s[0]=o*S+r*M+l*U+c*N,s[4]=o*b+r*P+l*L+c*z,s[8]=o*E+r*F+l*k+c*V,s[12]=o*w+r*D+l*H+c*mt,s[1]=h*S+f*M+d*U+u*N,s[5]=h*b+f*P+d*L+u*z,s[9]=h*E+f*F+d*k+u*V,s[13]=h*w+f*D+d*H+u*mt,s[2]=g*S+_*M+m*U+p*N,s[6]=g*b+_*P+m*L+p*z,s[10]=g*E+_*F+m*k+p*V,s[14]=g*w+_*D+m*H+p*mt,s[3]=x*S+y*M+v*U+R*N,s[7]=x*b+y*P+v*L+R*z,s[11]=x*E+y*F+v*k+R*V,s[15]=x*w+y*D+v*H+R*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+_*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+m*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],x=f*m*c-_*d*c+_*l*u-r*m*u-f*l*p+r*d*p,y=g*d*c-h*m*c-g*l*u+o*m*u+h*l*p-o*d*p,v=h*_*c-g*f*c+g*r*u-o*_*u-h*r*p+o*f*p,R=g*f*l-h*_*l-g*r*d+o*_*d+h*r*m-o*f*m,S=e*x+i*y+a*v+s*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/S;return t[0]=x*b,t[1]=(_*d*s-f*m*s-_*a*u+i*m*u+f*a*p-i*d*p)*b,t[2]=(r*m*s-_*l*s+_*a*c-i*m*c-r*a*p+i*l*p)*b,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*b,t[4]=y*b,t[5]=(h*m*s-g*d*s+g*a*u-e*m*u-h*a*p+e*d*p)*b,t[6]=(g*l*s-o*m*s-g*a*c+e*m*c+o*a*p-e*l*p)*b,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*b,t[8]=v*b,t[9]=(g*f*s-h*_*s-g*i*u+e*_*u+h*i*p-e*f*p)*b,t[10]=(o*_*s-g*r*s+g*i*c-e*_*c-o*i*p+e*r*p)*b,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*b,t[12]=R*b,t[13]=(h*_*a-g*f*a+g*i*d-e*_*d-h*i*m+e*f*m)*b,t[14]=(g*r*a-o*_*a-g*i*l+e*_*l+o*i*m-e*r*m)*b,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*b,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,g=s*f,_=o*h,m=o*f,p=r*f,x=l*c,y=l*h,v=l*f,R=i.x,S=i.y,b=i.z;return a[0]=(1-(_+p))*R,a[1]=(u+v)*R,a[2]=(g-y)*R,a[3]=0,a[4]=(u-v)*S,a[5]=(1-(d+p))*S,a[6]=(m+x)*S,a[7]=0,a[8]=(g+y)*b,a[9]=(m-x)*b,a[10]=(1-(d+_))*b,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ba.set(a[0],a[1],a[2]).length();const o=ba.set(a[4],a[5],a[6]).length(),r=ba.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Gn.copy(this);const c=1/s,h=1/o,f=1/r;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=h,Gn.elements[5]*=h,Gn.elements[6]*=h,Gn.elements[8]*=f,Gn.elements[9]*=f,Gn.elements[10]*=f,e.setFromRotationMatrix(Gn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=gi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,g;if(r===gi)u=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Zo)u=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=gi){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let g,_;if(r===gi)g=(o+s)*f,_=-2*f;else if(r===Zo)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ba=new G,Gn=new Ne,zx=new G(0,0,0),Fx=new G(1,1,1),wi=new G,no=new G,An=new G,dd=new Ne,ud=new Os;class ai{constructor(t=0,e=0,i=0,a=ai.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(cn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-cn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(cn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-cn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(cn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-cn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return dd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(dd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ud.setFromEuler(this),this.setFromQuaternion(ud,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ai.DEFAULT_ORDER="XYZ";class Xl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ux=0;const fd=new G,Sa=new Os,li=new Ne,io=new G,us=new G,Nx=new G,Ox=new Os,pd=new G(1,0,0),md=new G(0,1,0),gd=new G(0,0,1),xd={type:"added"},Bx={type:"removed"},wa={type:"childadded",child:null},Gr={type:"childremoved",child:null};class Xe extends Ja{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ux++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xe.DEFAULT_UP.clone();const t=new G,e=new ai,i=new Os,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ne},normalMatrix:{value:new ue}}),this.matrix=new Ne,this.matrixWorld=new Ne,this.matrixAutoUpdate=Xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Sa.setFromAxisAngle(t,e),this.quaternion.multiply(Sa),this}rotateOnWorldAxis(t,e){return Sa.setFromAxisAngle(t,e),this.quaternion.premultiply(Sa),this}rotateX(t){return this.rotateOnAxis(pd,t)}rotateY(t){return this.rotateOnAxis(md,t)}rotateZ(t){return this.rotateOnAxis(gd,t)}translateOnAxis(t,e){return fd.copy(t).applyQuaternion(this.quaternion),this.position.add(fd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(pd,t)}translateY(t){return this.translateOnAxis(md,t)}translateZ(t){return this.translateOnAxis(gd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?io.copy(t):io.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(us,io,this.up):li.lookAt(io,us,this.up),this.quaternion.setFromRotationMatrix(li),a&&(li.extractRotation(a.matrixWorld),Sa.setFromRotationMatrix(li),this.quaternion.premultiply(Sa.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xd),wa.child=t,this.dispatchEvent(wa),wa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Bx),Gr.child=t,this.dispatchEvent(Gr),Gr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),li.multiply(t.parent.matrixWorld)),t.applyMatrix4(li),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xd),wa.child=t,this.dispatchEvent(wa),wa.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,t,Nx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,Ox,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Xe.DEFAULT_UP=new G(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vn=new G,hi=new G,Vr=new G,di=new G,Ea=new G,Ta=new G,vd=new G,Xr=new G,Wr=new G,Yr=new G,$r=new Ye,Zr=new Ye,qr=new Ye;class Ln{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),Vn.subVectors(t,e),a.cross(Vn);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){Vn.subVectors(a,e),hi.subVectors(i,e),Vr.subVectors(t,e);const o=Vn.dot(Vn),r=Vn.dot(hi),l=Vn.dot(Vr),c=hi.dot(hi),h=hi.dot(Vr),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,g=(o*h-r*l)*d;return s.set(1-u-g,g,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,di.x),l.addScaledVector(o,di.y),l.addScaledVector(r,di.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return $r.setScalar(0),Zr.setScalar(0),qr.setScalar(0),$r.fromBufferAttribute(t,e),Zr.fromBufferAttribute(t,i),qr.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector($r,s.x),o.addScaledVector(Zr,s.y),o.addScaledVector(qr,s.z),o}static isFrontFacing(t,e,i,a){return Vn.subVectors(i,e),hi.subVectors(t,e),Vn.cross(hi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Vn.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),Vn.cross(hi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ln.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ln.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Ln.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Ln.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ln.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ea.subVectors(a,i),Ta.subVectors(s,i),Xr.subVectors(t,i);const l=Ea.dot(Xr),c=Ta.dot(Xr);if(l<=0&&c<=0)return e.copy(i);Wr.subVectors(t,a);const h=Ea.dot(Wr),f=Ta.dot(Wr);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ea,o);Yr.subVectors(t,s);const u=Ea.dot(Yr),g=Ta.dot(Yr);if(g>=0&&u<=g)return e.copy(s);const _=u*c-l*g;if(_<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(Ta,r);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return vd.subVectors(s,a),r=(f-h)/(f-h+(u-g)),e.copy(a).addScaledVector(vd,r);const p=1/(m+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(Ea,o).addScaledVector(Ta,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const df={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},ao={h:0,s:0,l:0};function jr(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ne{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=_n){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Me.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Me.workingColorSpace){return this.r=t,this.g=e,this.b=i,Me.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Me.workingColorSpace){if(t=Gl(t,1),e=cn(e,0,1),i=cn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=jr(o,s,t+1/3),this.g=jr(o,s,t),this.b=jr(o,s,t-1/3)}return Me.toWorkingColorSpace(this,a),this}setStyle(t,e=_n){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=_n){const i=df[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=xi(t.r),this.g=xi(t.g),this.b=xi(t.b),this}copyLinearToSRGB(t){return this.r=Va(t.r),this.g=Va(t.g),this.b=Va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=_n){return Me.fromWorkingColorSpace(fn.copy(this),t),Math.round(cn(fn.r*255,0,255))*65536+Math.round(cn(fn.g*255,0,255))*256+Math.round(cn(fn.b*255,0,255))}getHexString(t=_n){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Me.workingColorSpace){Me.fromWorkingColorSpace(fn.copy(this),e);const i=fn.r,a=fn.g,s=fn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Me.workingColorSpace){return Me.fromWorkingColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=_n){Me.fromWorkingColorSpace(fn.copy(this),t);const e=fn.r,i=fn.g,a=fn.b;return t!==_n?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Ei),this.setHSL(Ei.h+t,Ei.s+e,Ei.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ei),t.getHSL(ao);const i=Ms(Ei.h,ao.h,e),a=Ms(Ei.s,ao.s,e),s=Ms(Ei.l,ao.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const fn=new ne;ne.NAMES=df;let Hx=0;class ca extends Ja{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=ii(),this.name="",this.blending=Ba,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Cc,this.blendDst=Lc,this.blendEquation=Qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=Wa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xa,this.stencilZFail=xa,this.stencilZPass=xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ba&&(i.blending=this.blending),this.side!==Ii&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Cc&&(i.blendSrc=this.blendSrc),this.blendDst!==Lc&&(i.blendDst=this.blendDst),this.blendEquation!==Qi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Wa&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Qh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==xa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==xa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class tn extends ca{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.combine=zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const je=new G,so=new $t;class ln{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=ml,this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)so.fromBufferAttribute(this,e),so.applyMatrix3(t),this.setXY(e,so.x,so.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyMatrix3(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyMatrix4(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyNormalMatrix(t),this.setXYZ(e,je.x,je.y,je.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.transformDirection(t),this.setXYZ(e,je.x,je.y,je.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Xn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ce(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array),s=Ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ml&&(t.usage=this.usage),t}}class uf extends ln{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class ff extends ln{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Pe extends ln{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Gx=0;const In=new Ne,Kr=new Xe,Aa=new G,Rn=new Bs,fs=new Bs,sn=new G;class Ke extends Ja{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gx++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cf(t)?ff:uf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ue().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return In.makeRotationFromQuaternion(t),this.applyMatrix4(In),this}rotateX(t){return In.makeRotationX(t),this.applyMatrix4(In),this}rotateY(t){return In.makeRotationY(t),this.applyMatrix4(In),this}rotateZ(t){return In.makeRotationZ(t),this.applyMatrix4(In),this}translate(t,e,i){return In.makeTranslation(t,e,i),this.applyMatrix4(In),this}scale(t,e,i){return In.makeScale(t,e,i),this.applyMatrix4(In),this}lookAt(t){return Kr.lookAt(t),Kr.updateMatrix(),this.applyMatrix4(Kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Aa).negate(),this.translate(Aa.x,Aa.y,Aa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pe(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Bs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Rn.setFromBufferAttribute(s),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,Rn.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,Rn.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(Rn.min),this.boundingBox.expandByPoint(Rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new or);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(Rn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];fs.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(Rn.min,fs.min),Rn.expandByPoint(sn),sn.addVectors(Rn.max,fs.max),Rn.expandByPoint(sn)):(Rn.expandByPoint(fs.min),Rn.expandByPoint(fs.max))}Rn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)sn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(sn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)sn.fromBufferAttribute(r,c),l&&(Aa.fromBufferAttribute(t,c),sn.add(Aa)),a=Math.max(a,i.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ln(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new G,l[E]=new G;const c=new G,h=new G,f=new G,d=new $t,u=new $t,g=new $t,_=new G,m=new G;function p(E,w,M){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,M),d.fromBufferAttribute(s,E),u.fromBufferAttribute(s,w),g.fromBufferAttribute(s,M),h.sub(c),f.sub(c),u.sub(d),g.sub(d);const P=1/(u.x*g.y-g.x*u.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(P),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(P),r[E].add(_),r[w].add(_),r[M].add(_),l[E].add(m),l[w].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let E=0,w=x.length;E<w;++E){const M=x[E],P=M.start,F=M.count;for(let D=P,U=P+F;D<U;D+=3)p(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const y=new G,v=new G,R=new G,S=new G;function b(E){R.fromBufferAttribute(a,E),S.copy(R);const w=r[E];y.copy(w),y.sub(R.multiplyScalar(R.dot(w))).normalize(),v.crossVectors(S,w);const P=v.dot(l[E])<0?-1:1;o.setXYZW(E,y.x,y.y,y.z,P)}for(let E=0,w=x.length;E<w;++E){const M=x[E],P=M.start,F=M.count;for(let D=P,U=P+F;D<U;D+=3)b(t.getX(D+0)),b(t.getX(D+1)),b(t.getX(D+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ln(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new G,s=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)sn.fromBufferAttribute(t,e),sn.normalize(),t.setXYZ(e,sn.x,sn.y,sn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,g=0;for(let _=0,m=l.length;_<m;_++){r.isInterleavedBufferAttribute?u=l[_]*r.data.stride+r.offset:u=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[u++]}return new ln(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ke,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _d=new Ne,Vi=new Vl,oo=new or,yd=new G,ro=new G,co=new G,lo=new G,Jr=new G,ho=new G,Md=new G,uo=new G;class me extends Xe{constructor(t=new Ke,e=new tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){ho.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(Jr.fromBufferAttribute(f,t),o?ho.addScaledVector(Jr,h):ho.addScaledVector(Jr.sub(e),h))}e.add(ho)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),oo.copy(i.boundingSphere),oo.applyMatrix4(s),Vi.copy(t.ray).recast(t.near),!(oo.containsPoint(Vi.origin)===!1&&(Vi.intersectSphere(oo,yd)===null||Vi.origin.distanceToSquared(yd)>(t.far-t.near)**2))&&(_d.copy(s).invert(),Vi.copy(t.ray).applyMatrix4(_d),!(i.boundingBox!==null&&Vi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Vi)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),y=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,R=y;v<R;v+=3){const S=r.getX(v),b=r.getX(v+1),E=r.getX(v+2);a=fo(this,p,t,i,c,h,f,S,b,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=r.getX(m),y=r.getX(m+1),v=r.getX(m+2);a=fo(this,o,t,i,c,h,f,x,y,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),y=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,R=y;v<R;v+=3){const S=v,b=v+1,E=v+2;a=fo(this,p,t,i,c,h,f,S,b,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){const x=m,y=m+1,v=m+2;a=fo(this,o,t,i,c,h,f,x,y,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function Vx(n,t,e,i,a,s,o,r){let l;if(t.side===wn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Ii,r),l===null)return null;uo.copy(r),uo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(uo);return c<e.near||c>e.far?null:{distance:c,point:uo.clone(),object:n}}function fo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,ro),n.getVertexPosition(l,co),n.getVertexPosition(c,lo);const h=Vx(n,t,e,i,ro,co,lo,Md);if(h){const f=new G;Ln.getBarycoord(Md,ro,co,lo,f),a&&(h.uv=Ln.getInterpolatedAttribute(a,r,l,c,f,new $t)),s&&(h.uv1=Ln.getInterpolatedAttribute(s,r,l,c,f,new $t)),o&&(h.normal=Ln.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Ln.getNormal(ro,co,lo,d.normal),h.face=d,h.barycoord=f}return h}class $n extends Ke{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(f,2));function g(_,m,p,x,y,v,R,S,b,E,w){const M=v/b,P=R/E,F=v/2,D=R/2,U=S/2,L=b+1,k=E+1;let H=0,N=0;const z=new G;for(let V=0;V<k;V++){const mt=V*P-D;for(let ot=0;ot<L;ot++){const dt=ot*M-F;z[_]=dt*x,z[m]=mt*y,z[p]=U,c.push(z.x,z.y,z.z),z[_]=0,z[m]=0,z[p]=S>0?1:-1,h.push(z.x,z.y,z.z),f.push(ot/b),f.push(1-V/E),H+=1}}for(let V=0;V<E;V++)for(let mt=0;mt<b;mt++){const ot=d+mt+L*V,dt=d+mt+L*(V+1),tt=d+(mt+1)+L*(V+1),q=d+(mt+1)+L*V;l.push(ot,dt,q),l.push(dt,tt,q),N+=6}r.addGroup(u,N,w),u+=N,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ja(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function vn(n){const t={};for(let e=0;e<n.length;e++){const i=ja(n[e]);for(const a in i)t[a]=i[a]}return t}function Xx(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function pf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Me.workingColorSpace}const Wx={clone:ja,merge:vn};var Yx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$x=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zi extends ca{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yx,this.fragmentShader=$x,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ja(t.uniforms),this.uniformsGroups=Xx(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class mf extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ne,this.projectionMatrix=new Ne,this.projectionMatrixInverse=new Ne,this.coordinateSystem=gi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ti=new G,bd=new $t,Sd=new $t;class Fn extends mf{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ls*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ga*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ls*2*Math.atan(Math.tan(Ga*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z)}getViewSize(t,e){return this.getViewBounds(t,bd,Sd),e.subVectors(Sd,bd)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ga*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ra=-90,Pa=1;class Zx extends Xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Fn(Ra,Pa,t,e);a.layers=this.layers,this.add(a);const s=new Fn(Ra,Pa,t,e);s.layers=this.layers,this.add(s);const o=new Fn(Ra,Pa,t,e);o.layers=this.layers,this.add(o);const r=new Fn(Ra,Pa,t,e);r.layers=this.layers,this.add(r);const l=new Fn(Ra,Pa,t,e);l.layers=this.layers,this.add(l);const c=new Fn(Ra,Pa,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===gi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Zo)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class gf extends Mn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ya,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class qx extends oa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new gf(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ei}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new $n(5,5,5),s=new zi({name:"CubemapFromEquirect",uniforms:ja(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:wn,blending:Di});s.uniforms.tEquirect.value=e;const o=new me(a,s),r=e.minFilter;return e.minFilter===na&&(e.minFilter=ei),new Zx(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Qr=new G,jx=new G,Kx=new ue;class ji{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Qr.subVectors(i,e).cross(jx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Qr),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Kx.getNormalMatrix(t),a=this.coplanarPoint(Qr).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xi=new or,po=new G;class Wl{constructor(t=new ji,e=new ji,i=new ji,a=new ji,s=new ji,o=new ji){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=gi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],g=a[9],_=a[10],m=a[11],p=a[12],x=a[13],y=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,m-u,v-p).normalize(),i[1].setComponents(l+s,d+c,m+u,v+p).normalize(),i[2].setComponents(l+o,d+h,m+g,v+x).normalize(),i[3].setComponents(l-o,d-h,m-g,v-x).normalize(),i[4].setComponents(l-r,d-f,m-_,v-y).normalize(),e===gi)i[5].setComponents(l+r,d+f,m+_,v+y).normalize();else if(e===Zo)i[5].setComponents(r,f,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Xi)}intersectsSprite(t){return Xi.center.set(0,0,0),Xi.radius=.7071067811865476,Xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Xi)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(po.x=a.normal.x>0?t.max.x:t.min.x,po.y=a.normal.y>0?t.max.y:t.min.y,po.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(po)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function xf(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Jx(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],_=f[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const _=f[u];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class zn extends Ke{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let y=0;y<c;y++){const v=y*f-s;g.push(v,-x,0),_.push(0,0,1),m.push(y/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<r;x++){const y=x+c*p,v=x+c*(p+1),R=x+1+c*(p+1),S=x+1+c*p;u.push(y,v,S),u.push(v,R,S)}this.setIndex(u),this.setAttribute("position",new Pe(g,3)),this.setAttribute("normal",new Pe(_,3)),this.setAttribute("uv",new Pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Qx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tv=`#ifdef USE_ALPHAHASH
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
#endif`,ev=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,iv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,av=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sv=`#ifdef USE_AOMAP
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
#endif`,ov=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rv=`#ifdef USE_BATCHING
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
#endif`,cv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,uv=`#ifdef USE_IRIDESCENCE
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
#endif`,fv=`#ifdef USE_BUMPMAP
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
#endif`,pv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_v=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Mv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,bv=`#define PI 3.141592653589793
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
} // validated`,Sv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,wv=`vec3 transformedNormal = objectNormal;
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
#endif`,Ev=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Av=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lv=`#ifdef USE_ENVMAP
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
#endif`,Dv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kv=`#ifdef USE_ENVMAP
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
#endif`,Iv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zv=`#ifdef USE_ENVMAP
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
#endif`,Fv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Uv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Nv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ov=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bv=`#ifdef USE_GRADIENTMAP
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
}`,Hv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xv=`uniform bool receiveShadow;
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
#endif`,Wv=`#ifdef USE_ENVMAP
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
#endif`,Yv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$v=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jv=`PhysicalMaterial material;
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
#endif`,Kv=`struct PhysicalMaterial {
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
}`,Jv=`
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
#endif`,Qv=`#if defined( RE_IndirectDiffuse )
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
#endif`,t_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,n_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,a_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,s_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,o_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,c_=`#if defined( USE_POINTS_UV )
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
#endif`,l_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,d_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,u_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,f_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p_=`#ifdef USE_MORPHTARGETS
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
#endif`,m_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,x_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,v_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,__=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,M_=`#ifdef USE_NORMALMAP
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
#endif`,b_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,S_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,w_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,E_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,T_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,A_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,R_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,P_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,C_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,L_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,D_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,k_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,I_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,z_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,U_=`float getShadowMask() {
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
}`,N_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,O_=`#ifdef USE_SKINNING
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
#endif`,B_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,H_=`#ifdef USE_SKINNING
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
#endif`,G_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,X_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Y_=`#ifdef USE_TRANSMISSION
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
#endif`,$_=`#ifdef USE_TRANSMISSION
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
#endif`,Z_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,j_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const J_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Q_=`uniform sampler2D t2D;
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
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ey=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ny=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ay=`#include <common>
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
}`,sy=`#if DEPTH_PACKING == 3200
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
}`,oy=`#define DISTANCE
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
}`,ry=`#define DISTANCE
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
}`,cy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ly=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hy=`uniform float scale;
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
}`,dy=`uniform vec3 diffuse;
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
}`,uy=`#include <common>
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
}`,fy=`uniform vec3 diffuse;
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
}`,py=`#define LAMBERT
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
}`,my=`#define LAMBERT
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
}`,gy=`#define MATCAP
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
}`,xy=`#define MATCAP
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
}`,vy=`#define NORMAL
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
}`,_y=`#define NORMAL
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
}`,yy=`#define PHONG
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
}`,My=`#define PHONG
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
}`,by=`#define STANDARD
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
}`,Sy=`#define STANDARD
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
}`,wy=`#define TOON
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
}`,Ey=`#define TOON
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
}`,Ty=`uniform float size;
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
}`,Ay=`uniform vec3 diffuse;
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
}`,Ry=`#include <common>
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
}`,Py=`uniform vec3 color;
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
}`,Cy=`uniform float rotation;
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
}`,Ly=`uniform vec3 diffuse;
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
}`,fe={alphahash_fragment:Qx,alphahash_pars_fragment:tv,alphamap_fragment:ev,alphamap_pars_fragment:nv,alphatest_fragment:iv,alphatest_pars_fragment:av,aomap_fragment:sv,aomap_pars_fragment:ov,batching_pars_vertex:rv,batching_vertex:cv,begin_vertex:lv,beginnormal_vertex:hv,bsdfs:dv,iridescence_fragment:uv,bumpmap_pars_fragment:fv,clipping_planes_fragment:pv,clipping_planes_pars_fragment:mv,clipping_planes_pars_vertex:gv,clipping_planes_vertex:xv,color_fragment:vv,color_pars_fragment:_v,color_pars_vertex:yv,color_vertex:Mv,common:bv,cube_uv_reflection_fragment:Sv,defaultnormal_vertex:wv,displacementmap_pars_vertex:Ev,displacementmap_vertex:Tv,emissivemap_fragment:Av,emissivemap_pars_fragment:Rv,colorspace_fragment:Pv,colorspace_pars_fragment:Cv,envmap_fragment:Lv,envmap_common_pars_fragment:Dv,envmap_pars_fragment:kv,envmap_pars_vertex:Iv,envmap_physical_pars_fragment:Wv,envmap_vertex:zv,fog_vertex:Fv,fog_pars_vertex:Uv,fog_fragment:Nv,fog_pars_fragment:Ov,gradientmap_pars_fragment:Bv,lightmap_pars_fragment:Hv,lights_lambert_fragment:Gv,lights_lambert_pars_fragment:Vv,lights_pars_begin:Xv,lights_toon_fragment:Yv,lights_toon_pars_fragment:$v,lights_phong_fragment:Zv,lights_phong_pars_fragment:qv,lights_physical_fragment:jv,lights_physical_pars_fragment:Kv,lights_fragment_begin:Jv,lights_fragment_maps:Qv,lights_fragment_end:t_,logdepthbuf_fragment:e_,logdepthbuf_pars_fragment:n_,logdepthbuf_pars_vertex:i_,logdepthbuf_vertex:a_,map_fragment:s_,map_pars_fragment:o_,map_particle_fragment:r_,map_particle_pars_fragment:c_,metalnessmap_fragment:l_,metalnessmap_pars_fragment:h_,morphinstance_vertex:d_,morphcolor_vertex:u_,morphnormal_vertex:f_,morphtarget_pars_vertex:p_,morphtarget_vertex:m_,normal_fragment_begin:g_,normal_fragment_maps:x_,normal_pars_fragment:v_,normal_pars_vertex:__,normal_vertex:y_,normalmap_pars_fragment:M_,clearcoat_normal_fragment_begin:b_,clearcoat_normal_fragment_maps:S_,clearcoat_pars_fragment:w_,iridescence_pars_fragment:E_,opaque_fragment:T_,packing:A_,premultiplied_alpha_fragment:R_,project_vertex:P_,dithering_fragment:C_,dithering_pars_fragment:L_,roughnessmap_fragment:D_,roughnessmap_pars_fragment:k_,shadowmap_pars_fragment:I_,shadowmap_pars_vertex:z_,shadowmap_vertex:F_,shadowmask_pars_fragment:U_,skinbase_vertex:N_,skinning_pars_vertex:O_,skinning_vertex:B_,skinnormal_vertex:H_,specularmap_fragment:G_,specularmap_pars_fragment:V_,tonemapping_fragment:X_,tonemapping_pars_fragment:W_,transmission_fragment:Y_,transmission_pars_fragment:$_,uv_pars_fragment:Z_,uv_pars_vertex:q_,uv_vertex:j_,worldpos_vertex:K_,background_vert:J_,background_frag:Q_,backgroundCube_vert:ty,backgroundCube_frag:ey,cube_vert:ny,cube_frag:iy,depth_vert:ay,depth_frag:sy,distanceRGBA_vert:oy,distanceRGBA_frag:ry,equirect_vert:cy,equirect_frag:ly,linedashed_vert:hy,linedashed_frag:dy,meshbasic_vert:uy,meshbasic_frag:fy,meshlambert_vert:py,meshlambert_frag:my,meshmatcap_vert:gy,meshmatcap_frag:xy,meshnormal_vert:vy,meshnormal_frag:_y,meshphong_vert:yy,meshphong_frag:My,meshphysical_vert:by,meshphysical_frag:Sy,meshtoon_vert:wy,meshtoon_frag:Ey,points_vert:Ty,points_frag:Ay,shadow_vert:Ry,shadow_frag:Py,sprite_vert:Cy,sprite_frag:Ly},Ot={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ue},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ue}},envmap:{envMap:{value:null},envMapRotation:{value:new ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ue},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0},uvTransform:{value:new ue}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ue},alphaMap:{value:null},alphaMapTransform:{value:new ue},alphaTest:{value:0}}},ti={basic:{uniforms:vn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.fog]),vertexShader:fe.meshbasic_vert,fragmentShader:fe.meshbasic_frag},lambert:{uniforms:vn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,Ot.lights,{emissive:{value:new ne(0)}}]),vertexShader:fe.meshlambert_vert,fragmentShader:fe.meshlambert_frag},phong:{uniforms:vn([Ot.common,Ot.specularmap,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,Ot.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30}}]),vertexShader:fe.meshphong_vert,fragmentShader:fe.meshphong_frag},standard:{uniforms:vn([Ot.common,Ot.envmap,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.roughnessmap,Ot.metalnessmap,Ot.fog,Ot.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:fe.meshphysical_vert,fragmentShader:fe.meshphysical_frag},toon:{uniforms:vn([Ot.common,Ot.aomap,Ot.lightmap,Ot.emissivemap,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.gradientmap,Ot.fog,Ot.lights,{emissive:{value:new ne(0)}}]),vertexShader:fe.meshtoon_vert,fragmentShader:fe.meshtoon_frag},matcap:{uniforms:vn([Ot.common,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,Ot.fog,{matcap:{value:null}}]),vertexShader:fe.meshmatcap_vert,fragmentShader:fe.meshmatcap_frag},points:{uniforms:vn([Ot.points,Ot.fog]),vertexShader:fe.points_vert,fragmentShader:fe.points_frag},dashed:{uniforms:vn([Ot.common,Ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:fe.linedashed_vert,fragmentShader:fe.linedashed_frag},depth:{uniforms:vn([Ot.common,Ot.displacementmap]),vertexShader:fe.depth_vert,fragmentShader:fe.depth_frag},normal:{uniforms:vn([Ot.common,Ot.bumpmap,Ot.normalmap,Ot.displacementmap,{opacity:{value:1}}]),vertexShader:fe.meshnormal_vert,fragmentShader:fe.meshnormal_frag},sprite:{uniforms:vn([Ot.sprite,Ot.fog]),vertexShader:fe.sprite_vert,fragmentShader:fe.sprite_frag},background:{uniforms:{uvTransform:{value:new ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:fe.background_vert,fragmentShader:fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ue}},vertexShader:fe.backgroundCube_vert,fragmentShader:fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:fe.cube_vert,fragmentShader:fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:fe.equirect_vert,fragmentShader:fe.equirect_frag},distanceRGBA:{uniforms:vn([Ot.common,Ot.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:fe.distanceRGBA_vert,fragmentShader:fe.distanceRGBA_frag},shadow:{uniforms:vn([Ot.lights,Ot.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:fe.shadow_vert,fragmentShader:fe.shadow_frag}};ti.physical={uniforms:vn([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ue},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ue},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ue},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ue},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ue},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ue}}]),vertexShader:fe.meshphysical_vert,fragmentShader:fe.meshphysical_frag};const mo={r:0,b:0,g:0},Wi=new ai,Dy=new Ne;function ky(n,t,e,i,a,s,o){const r=new ne(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function _(x){let y=!1;const v=g(x);v===null?p(r,l):v&&v.isColor&&(p(v,1),y=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,y){const v=g(y);v&&(v.isCubeTexture||v.mapping===ar)?(h===void 0&&(h=new me(new $n(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:ja(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),Wi.copy(y.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dy.makeRotationFromEuler(Wi)),h.material.toneMapped=Me.getTransfer(v.colorSpace)!==ke,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new me(new zn(2,2),new zi({name:"BackgroundMaterial",uniforms:ja(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Me.getTransfer(v.colorSpace)!==ke,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,y){x.getRGB(mo,pf(n)),i.buffers.color.setClear(mo.r,mo.g,mo.b,y,o)}return{getClearColor:function(){return r},setClearColor:function(x,y=1){r.set(x),l=y,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(r,l)},render:_,addToRenderList:m}}function Iy(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,P,F,D,U){let L=!1;const k=f(D,F,P);s!==k&&(s=k,c(s.object)),L=u(M,D,F,U),L&&g(M,D,F,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(M,P,F,D),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,P,F){const D=F.wireframe===!0;let U=i[M.id];U===void 0&&(U={},i[M.id]=U);let L=U[P.id];L===void 0&&(L={},U[P.id]=L);let k=L[D];return k===void 0&&(k=d(l()),L[D]=k),k}function d(M){const P=[],F=[],D=[];for(let U=0;U<e;U++)P[U]=0,F[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:D,object:M,attributes:{},index:null}}function u(M,P,F,D){const U=s.attributes,L=P.attributes;let k=0;const H=F.getAttributes();for(const N in H)if(H[N].location>=0){const V=U[N];let mt=L[N];if(mt===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),V===void 0||V.attribute!==mt||mt&&V.data!==mt.data)return!0;k++}return s.attributesNum!==k||s.index!==D}function g(M,P,F,D){const U={},L=P.attributes;let k=0;const H=F.getAttributes();for(const N in H)if(H[N].location>=0){let V=L[N];V===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(V=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(V=M.instanceColor));const mt={};mt.attribute=V,V&&V.data&&(mt.data=V.data),U[N]=mt,k++}s.attributes=U,s.attributesNum=k,s.index=D}function _(){const M=s.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function m(M){p(M,0)}function p(M,P){const F=s.newAttributes,D=s.enabledAttributes,U=s.attributeDivisors;F[M]=1,D[M]===0&&(n.enableVertexAttribArray(M),D[M]=1),U[M]!==P&&(n.vertexAttribDivisor(M,P),U[M]=P)}function x(){const M=s.newAttributes,P=s.enabledAttributes;for(let F=0,D=P.length;F<D;F++)P[F]!==M[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function y(M,P,F,D,U,L,k){k===!0?n.vertexAttribIPointer(M,P,F,U,L):n.vertexAttribPointer(M,P,F,D,U,L)}function v(M,P,F,D){_();const U=D.attributes,L=F.getAttributes(),k=P.defaultAttributeValues;for(const H in L){const N=L[H];if(N.location>=0){let z=U[H];if(z===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(z=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(z=M.instanceColor)),z!==void 0){const V=z.normalized,mt=z.itemSize,ot=t.get(z);if(ot===void 0)continue;const dt=ot.buffer,tt=ot.type,q=ot.bytesPerElement,pt=tt===n.INT||tt===n.UNSIGNED_INT||z.gpuType===Fl;if(z.isInterleavedBufferAttribute){const Q=z.data,Mt=Q.stride,Ct=z.offset;if(Q.isInstancedInterleavedBuffer){for(let zt=0;zt<N.locationSize;zt++)p(N.location+zt,Q.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let zt=0;zt<N.locationSize;zt++)m(N.location+zt);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let zt=0;zt<N.locationSize;zt++)y(N.location+zt,mt/N.locationSize,tt,V,Mt*q,(Ct+mt/N.locationSize*zt)*q,pt)}else{if(z.isInstancedBufferAttribute){for(let Q=0;Q<N.locationSize;Q++)p(N.location+Q,z.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let Q=0;Q<N.locationSize;Q++)m(N.location+Q);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Q=0;Q<N.locationSize;Q++)y(N.location+Q,mt/N.locationSize,tt,V,mt*q,mt/N.locationSize*Q*q,pt)}}else if(k!==void 0){const V=k[H];if(V!==void 0)switch(V.length){case 2:n.vertexAttrib2fv(N.location,V);break;case 3:n.vertexAttrib3fv(N.location,V);break;case 4:n.vertexAttrib4fv(N.location,V);break;default:n.vertexAttrib1fv(N.location,V)}}}}x()}function R(){E();for(const M in i){const P=i[M];for(const F in P){const D=P[F];for(const U in D)h(D[U].object),delete D[U];delete P[F]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const F in P){const D=P[F];for(const U in D)h(D[U].object),delete D[U];delete P[F]}delete i[M.id]}function b(M){for(const P in i){const F=i[P];if(F[M.id]===void 0)continue;const D=F[M.id];for(const U in D)h(D[U].object),delete D[U];delete F[M.id]}}function E(){w(),o=!0,s!==a&&(s=a,c(s.object))}function w(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:w,dispose:R,releaseStatesOfGeometry:S,releaseStatesOfProgram:b,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function zy(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_]*d[_];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function Fy(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(b){return!(b!==Wn&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(b){const E=b===Ns&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==vi&&i.convert(b)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==mi&&!E)}function l(b){if(b==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:R,maxSamples:S}}function Uy(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new ji,r=new ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!a||g===null||g.length===0||s&&!m)s?h(null):c();else{const x=s?0:i,y=x*4;let v=p.clippingState||null;l.value=v,v=h(g,d,y,u);for(let R=0;R!==y;++R)v[R]=e[R];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=u+_*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=u;y!==_;++y,v+=4)o.copy(f[y]).applyMatrix4(x,r),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Ny(n){let t=new WeakMap;function e(o,r){return r===Oc?o.mapping=Ya:r===Bc&&(o.mapping=$a),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Oc||r===Bc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new qx(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class vf extends mf{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ua=4,wd=[.125,.215,.35,.446,.526,.582],ta=20,tc=new vf,Ed=new ne;let ec=null,nc=0,ic=0,ac=!1;const Ki=(1+Math.sqrt(5))/2,Ca=1/Ki,Td=[new G(-Ki,Ca,0),new G(Ki,Ca,0),new G(-Ca,0,Ki),new G(Ca,0,Ki),new G(0,Ki,-Ca),new G(0,Ki,Ca),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class Ad{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ec,nc,ic),this._renderer.xr.enabled=ac,t.scissorTest=!1,go(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ya||t.mapping===$a?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ec=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:Ns,format:Wn,colorSpace:Ka,depthBuffer:!1},a=Rd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rd(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Oy(s)),this._blurMaterial=By(s,t,e)}return a}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,tc)}_sceneToCubeUV(t,e,i,a){const r=new Fn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Ed),h.toneMapping=ki,h.autoClear=!1;const u=new tn({name:"PMREM.Background",side:wn,depthWrite:!1,depthTest:!1}),g=new me(new $n,u);let _=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,_=!0):(u.color.copy(Ed),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):x===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const y=this._cubeSize;go(a,x*y,p>2?y:0,y,y),h.setRenderTarget(a),_&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Ya||t.mapping===$a;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pd());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;go(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,tc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Td[(a-s-1)%Td.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new me(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*ta-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):ta;m>ta&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ta}`);const p=[];let x=0;for(let b=0;b<ta;++b){const E=b/_,w=Math.exp(-E*E/2);p.push(w),b===0?x+=w:b<m&&(x+=2*w)}for(let b=0;b<p.length;b++)p[b]=p[b]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;const v=this._sizeLods[a],R=3*v*(a>y-Ua?a-y+Ua:0),S=4*(this._cubeSize-v);go(e,R,S,3*v,2*v),l.setRenderTarget(e),l.render(f,tc)}}function Oy(n){const t=[],e=[],i=[];let a=n;const s=n-Ua+1+wd.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-Ua?l=wd[o-n+Ua-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,_=3,m=2,p=1,x=new Float32Array(_*g*u),y=new Float32Array(m*g*u),v=new Float32Array(p*g*u);for(let S=0;S<u;S++){const b=S%3*2/3-1,E=S>2?0:-1,w=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];x.set(w,_*g*S),y.set(d,m*g*S);const M=[S,S,S,S,S,S];v.set(M,p*g*S)}const R=new Ke;R.setAttribute("position",new ln(x,_)),R.setAttribute("uv",new ln(y,m)),R.setAttribute("faceIndex",new ln(v,p)),t.push(R),a>Ua&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Rd(n,t,e){const i=new oa(n,t,e);return i.texture.mapping=ar,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function go(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function By(n,t,e){const i=new Float32Array(ta),a=new G(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:ta,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Yl(),fragmentShader:`

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
		`,blending:Di,depthTest:!1,depthWrite:!1})}function Pd(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yl(),fragmentShader:`

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
		`,blending:Di,depthTest:!1,depthWrite:!1})}function Cd(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Di,depthTest:!1,depthWrite:!1})}function Yl(){return`

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
	`}function Hy(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Oc||l===Bc,h=l===Ya||l===$a;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Ad(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new Ad(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Gy(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&vs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function Vy(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const _=u[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,g=f.attributes.position;let _=0;if(u!==null){const x=u.array;_=u.version;for(let y=0,v=x.length;y<v;y+=3){const R=x[y+0],S=x[y+1],b=x[y+2];d.push(R,S,S,b,b,R)}}else if(g!==void 0){const x=g.array;_=g.version;for(let y=0,v=x.length/3-1;y<v;y+=3){const R=y+0,S=y+1,b=y+2;d.push(R,S,S,b,b,R)}}else return;const m=new(cf(d)?ff:uf)(d,1);m.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function Xy(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,s,d*o,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*_[x];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function Wy(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function Yy(n,t,e){const i=new WeakMap,a=new Ye;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],y=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let R=r.attributes.position.count*v,S=1;R>t.maxTextureSize&&(S=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const b=new Float32Array(R*S*4*f),E=new hf(b,R,S,f);E.type=mi,E.needsUpdate=!0;const w=v*4;for(let P=0;P<f;P++){const F=p[P],D=x[P],U=y[P],L=R*S*4*P;for(let k=0;k<F.count;k++){const H=k*w;g===!0&&(a.fromBufferAttribute(F,k),b[L+H+0]=a.x,b[L+H+1]=a.y,b[L+H+2]=a.z,b[L+H+3]=0),_===!0&&(a.fromBufferAttribute(D,k),b[L+H+4]=a.x,b[L+H+5]=a.y,b[L+H+6]=a.z,b[L+H+7]=0),m===!0&&(a.fromBufferAttribute(U,k),b[L+H+8]=a.x,b[L+H+9]=a.y,b[L+H+10]=a.z,b[L+H+11]=U.itemSize===4?a.w:1)}}d={count:f,texture:E,size:new $t(R,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function $y(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class _f extends Mn{constructor(t,e,i,a,s,o,r,l,c,h=Ha){if(h!==Ha&&h!==qa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ha&&(i=sa),i===void 0&&h===qa&&(i=Za),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Yn,this.minFilter=l!==void 0?l:Yn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const yf=new Mn,Ld=new _f(1,1),Mf=new hf,bf=new kx,Sf=new gf,Dd=[],kd=[],Id=new Float32Array(16),zd=new Float32Array(9),Fd=new Float32Array(4);function Qa(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Dd[a];if(s===void 0&&(s=new Float32Array(a),Dd[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function en(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function nn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function rr(n,t){let e=kd[t];e===void 0&&(e=new Int32Array(t),kd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Zy(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function qy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2fv(this.addr,t),nn(e,t)}}function jy(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(en(e,t))return;n.uniform3fv(this.addr,t),nn(e,t)}}function Ky(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4fv(this.addr,t),nn(e,t)}}function Jy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;Fd.set(i),n.uniformMatrix2fv(this.addr,!1,Fd),nn(e,i)}}function Qy(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;zd.set(i),n.uniformMatrix3fv(this.addr,!1,zd),nn(e,i)}}function tM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(en(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),nn(e,t)}else{if(en(e,i))return;Id.set(i),n.uniformMatrix4fv(this.addr,!1,Id),nn(e,i)}}function eM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function nM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2iv(this.addr,t),nn(e,t)}}function iM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(en(e,t))return;n.uniform3iv(this.addr,t),nn(e,t)}}function aM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4iv(this.addr,t),nn(e,t)}}function sM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function oM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(en(e,t))return;n.uniform2uiv(this.addr,t),nn(e,t)}}function rM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(en(e,t))return;n.uniform3uiv(this.addr,t),nn(e,t)}}function cM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(en(e,t))return;n.uniform4uiv(this.addr,t),nn(e,t)}}function lM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Ld.compareFunction=rf,s=Ld):s=yf,e.setTexture2D(t||s,a)}function hM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||bf,a)}function dM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Sf,a)}function uM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Mf,a)}function fM(n){switch(n){case 5126:return Zy;case 35664:return qy;case 35665:return jy;case 35666:return Ky;case 35674:return Jy;case 35675:return Qy;case 35676:return tM;case 5124:case 35670:return eM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return aM;case 5125:return sM;case 36294:return oM;case 36295:return rM;case 36296:return cM;case 35678:case 36198:case 36298:case 36306:case 35682:return lM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return dM;case 36289:case 36303:case 36311:case 36292:return uM}}function pM(n,t){n.uniform1fv(this.addr,t)}function mM(n,t){const e=Qa(t,this.size,2);n.uniform2fv(this.addr,e)}function gM(n,t){const e=Qa(t,this.size,3);n.uniform3fv(this.addr,e)}function xM(n,t){const e=Qa(t,this.size,4);n.uniform4fv(this.addr,e)}function vM(n,t){const e=Qa(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function _M(n,t){const e=Qa(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function yM(n,t){const e=Qa(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function MM(n,t){n.uniform1iv(this.addr,t)}function bM(n,t){n.uniform2iv(this.addr,t)}function SM(n,t){n.uniform3iv(this.addr,t)}function wM(n,t){n.uniform4iv(this.addr,t)}function EM(n,t){n.uniform1uiv(this.addr,t)}function TM(n,t){n.uniform2uiv(this.addr,t)}function AM(n,t){n.uniform3uiv(this.addr,t)}function RM(n,t){n.uniform4uiv(this.addr,t)}function PM(n,t,e){const i=this.cache,a=t.length,s=rr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||yf,s[o])}function CM(n,t,e){const i=this.cache,a=t.length,s=rr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||bf,s[o])}function LM(n,t,e){const i=this.cache,a=t.length,s=rr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Sf,s[o])}function DM(n,t,e){const i=this.cache,a=t.length,s=rr(e,a);en(i,s)||(n.uniform1iv(this.addr,s),nn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Mf,s[o])}function kM(n){switch(n){case 5126:return pM;case 35664:return mM;case 35665:return gM;case 35666:return xM;case 35674:return vM;case 35675:return _M;case 35676:return yM;case 5124:case 35670:return MM;case 35667:case 35671:return bM;case 35668:case 35672:return SM;case 35669:case 35673:return wM;case 5125:return EM;case 36294:return TM;case 36295:return AM;case 36296:return RM;case 35678:case 36198:case 36298:case 36306:case 35682:return PM;case 35679:case 36299:case 36307:return CM;case 35680:case 36300:case 36308:case 36293:return LM;case 36289:case 36303:case 36311:case 36292:return DM}}class IM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=fM(e.type)}}class zM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=kM(e.type)}}class FM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const sc=/(\w+)(\])?(\[|\.)?/g;function Ud(n,t){n.seq.push(t),n.map[t.id]=t}function UM(n,t,e){const i=n.name,a=i.length;for(sc.lastIndex=0;;){const s=sc.exec(i),o=sc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Ud(e,c===void 0?new IM(r,n,t):new zM(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new FM(r),Ud(e,f)),e=f}}}class Fo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);UM(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Nd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const NM=37297;let OM=0;function BM(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Od=new ue;function HM(n){Me._getMatrix(Od,Me.workingColorSpace,n);const t=`mat3( ${Od.elements.map(e=>e.toFixed(4))} )`;switch(Me.getTransfer(n)){case sr:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Bd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+BM(n.getShaderSource(t),o)}else return a}function GM(n,t){const e=HM(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function VM(n,t){let e;switch(t){case Wg:e="Linear";break;case Yg:e="Reinhard";break;case $g:e="Cineon";break;case Zg:e="ACESFilmic";break;case jg:e="AgX";break;case Kg:e="Neutral";break;case qg:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const xo=new G;function XM(){Me.getLuminanceCoefficients(xo);const n=xo.x.toFixed(4),t=xo.y.toFixed(4),e=xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function WM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_s).join(`
`)}function YM(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function $M(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function _s(n){return n!==""}function Hd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ZM=/^[ \t]*#include +<([\w\d./]+)>/gm;function gl(n){return n.replace(ZM,jM)}const qM=new Map;function jM(n,t){let e=fe[t];if(e===void 0){const i=qM.get(t);if(i!==void 0)e=fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return gl(e)}const KM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vd(n){return n.replace(KM,JM)}function JM(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Xd(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function QM(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Yu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===$u?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===fi&&(t="SHADOWMAP_TYPE_VSM"),t}function tb(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ya:case $a:t="ENVMAP_TYPE_CUBE";break;case ar:t="ENVMAP_TYPE_CUBE_UV";break}return t}function eb(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case $a:t="ENVMAP_MODE_REFRACTION";break}return t}function nb(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case zl:t="ENVMAP_BLENDING_MULTIPLY";break;case Vg:t="ENVMAP_BLENDING_MIX";break;case Xg:t="ENVMAP_BLENDING_ADD";break}return t}function ib(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function ab(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=QM(e),c=tb(e),h=eb(e),f=nb(e),d=ib(e),u=WM(e),g=YM(s),_=a.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_s).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(_s).join(`
`),p.length>0&&(p+=`
`)):(m=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_s).join(`
`),p=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ki?"#define TONE_MAPPING":"",e.toneMapping!==ki?fe.tonemapping_pars_fragment:"",e.toneMapping!==ki?VM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",fe.colorspace_pars_fragment,GM("linearToOutputTexel",e.outputColorSpace),XM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_s).join(`
`)),o=gl(o),o=Hd(o,e),o=Gd(o,e),r=gl(r),r=Hd(r,e),r=Gd(r,e),o=Vd(o),r=Vd(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ed?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ed?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=x+m+o,v=x+p+r,R=Nd(a,a.VERTEX_SHADER,y),S=Nd(a,a.FRAGMENT_SHADER,v);a.attachShader(_,R),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function b(P){if(n.debug.checkShaderErrors){const F=a.getProgramInfoLog(_).trim(),D=a.getShaderInfoLog(R).trim(),U=a.getShaderInfoLog(S).trim();let L=!0,k=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,R,S);else{const H=Bd(a,R,"vertex"),N=Bd(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+H+`
`+N)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(D===""||U==="")&&(k=!1);k&&(P.diagnostics={runnable:L,programLog:F,vertexShader:{log:D,prefix:m},fragmentShader:{log:U,prefix:p}})}a.deleteShader(R),a.deleteShader(S),E=new Fo(a,_),w=$M(a,_)}let E;this.getUniforms=function(){return E===void 0&&b(this),E};let w;this.getAttributes=function(){return w===void 0&&b(this),w};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,NM)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=OM++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=S,this}let sb=0;class ob{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new rb(t),e.set(t,i)),i}}class rb{constructor(t){this.id=sb++,this.code=t,this.usedTimes=0}}function cb(n,t,e,i,a,s,o){const r=new Xl,l=new ob,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,M,P,F,D){const U=F.fog,L=D.geometry,k=w.isMeshStandardMaterial?F.environment:null,H=(w.isMeshStandardMaterial?e:t).get(w.envMap||k),N=H&&H.mapping===ar?H.image.height:null,z=g[w.type];w.precision!==null&&(u=a.getMaxPrecision(w.precision),u!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",u,"instead."));const V=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,mt=V!==void 0?V.length:0;let ot=0;L.morphAttributes.position!==void 0&&(ot=1),L.morphAttributes.normal!==void 0&&(ot=2),L.morphAttributes.color!==void 0&&(ot=3);let dt,tt,q,pt;if(z){const ae=ti[z];dt=ae.vertexShader,tt=ae.fragmentShader}else dt=w.vertexShader,tt=w.fragmentShader,l.update(w),q=l.getVertexShaderID(w),pt=l.getFragmentShaderID(w);const Q=n.getRenderTarget(),Mt=n.state.buffers.depth.getReversed(),Ct=D.isInstancedMesh===!0,zt=D.isBatchedMesh===!0,Zt=!!w.map,ht=!!w.matcap,Ht=!!H,X=!!w.aoMap,le=!!w.lightMap,Wt=!!w.bumpMap,Gt=!!w.normalMap,Nt=!!w.displacementMap,At=!!w.emissiveMap,Rt=!!w.metalnessMap,C=!!w.roughnessMap,T=w.anisotropy>0,W=w.clearcoat>0,ct=w.dispersion>0,lt=w.iridescence>0,at=w.sheen>0,Pt=w.transmission>0,j=T&&!!w.anisotropyMap,ft=W&&!!w.clearcoatMap,Bt=W&&!!w.clearcoatNormalMap,nt=W&&!!w.clearcoatRoughnessMap,yt=lt&&!!w.iridescenceMap,B=lt&&!!w.iridescenceThicknessMap,st=at&&!!w.sheenColorMap,ut=at&&!!w.sheenRoughnessMap,Vt=!!w.specularMap,qt=!!w.specularColorMap,Yt=!!w.specularIntensityMap,O=Pt&&!!w.transmissionMap,gt=Pt&&!!w.thicknessMap,K=!!w.gradientMap,rt=!!w.alphaMap,St=w.alphaTest>0,Et=!!w.alphaHash,Kt=!!w.extensions;let re=ki;w.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(re=n.toneMapping);const de={shaderID:z,shaderType:w.type,shaderName:w.name,vertexShader:dt,fragmentShader:tt,defines:w.defines,customVertexShaderID:q,customFragmentShaderID:pt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:u,batching:zt,batchingColor:zt&&D._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&D.instanceColor!==null,instancingMorph:Ct&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ka,alphaToCoverage:!!w.alphaToCoverage,map:Zt,matcap:ht,envMap:Ht,envMapMode:Ht&&H.mapping,envMapCubeUVHeight:N,aoMap:X,lightMap:le,bumpMap:Wt,normalMap:Gt,displacementMap:d&&Nt,emissiveMap:At,normalMapObjectSpace:Gt&&w.normalMapType===ex,normalMapTangentSpace:Gt&&w.normalMapType===of,metalnessMap:Rt,roughnessMap:C,anisotropy:T,anisotropyMap:j,clearcoat:W,clearcoatMap:ft,clearcoatNormalMap:Bt,clearcoatRoughnessMap:nt,dispersion:ct,iridescence:lt,iridescenceMap:yt,iridescenceThicknessMap:B,sheen:at,sheenColorMap:st,sheenRoughnessMap:ut,specularMap:Vt,specularColorMap:qt,specularIntensityMap:Yt,transmission:Pt,transmissionMap:O,thicknessMap:gt,gradientMap:K,opaque:w.transparent===!1&&w.blending===Ba&&w.alphaToCoverage===!1,alphaMap:rt,alphaTest:St,alphaHash:Et,combine:w.combine,mapUv:Zt&&_(w.map.channel),aoMapUv:X&&_(w.aoMap.channel),lightMapUv:le&&_(w.lightMap.channel),bumpMapUv:Wt&&_(w.bumpMap.channel),normalMapUv:Gt&&_(w.normalMap.channel),displacementMapUv:Nt&&_(w.displacementMap.channel),emissiveMapUv:At&&_(w.emissiveMap.channel),metalnessMapUv:Rt&&_(w.metalnessMap.channel),roughnessMapUv:C&&_(w.roughnessMap.channel),anisotropyMapUv:j&&_(w.anisotropyMap.channel),clearcoatMapUv:ft&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:Bt&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:yt&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:B&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:st&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:ut&&_(w.sheenRoughnessMap.channel),specularMapUv:Vt&&_(w.specularMap.channel),specularColorMapUv:qt&&_(w.specularColorMap.channel),specularIntensityMapUv:Yt&&_(w.specularIntensityMap.channel),transmissionMapUv:O&&_(w.transmissionMap.channel),thicknessMapUv:gt&&_(w.thicknessMap.channel),alphaMapUv:rt&&_(w.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Gt||T),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!L.attributes.uv&&(Zt||rt),fog:!!U,useFog:w.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Mt,skinning:D.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ot,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:re,decodeVideoTexture:Zt&&w.map.isVideoTexture===!0&&Me.getTransfer(w.map.colorSpace)===ke,decodeVideoTextureEmissive:At&&w.emissiveMap.isVideoTexture===!0&&Me.getTransfer(w.emissiveMap.colorSpace)===ke,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===He,flipSided:w.side===wn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Kt&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&w.extensions.multiDraw===!0||zt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return de.vertexUv1s=c.has(1),de.vertexUv2s=c.has(2),de.vertexUv3s=c.has(3),c.clear(),de}function p(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)M.push(P),M.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(x(M,w),y(M,w),M.push(n.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function x(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function y(w,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),w.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),w.push(r.mask)}function v(w){const M=g[w.type];let P;if(M){const F=ti[M];P=Wx.clone(F.uniforms)}else P=w.uniforms;return P}function R(w,M){let P;for(let F=0,D=h.length;F<D;F++){const U=h[F];if(U.cacheKey===M){P=U,++P.usedTimes;break}}return P===void 0&&(P=new ab(n,M,w,s),h.push(P)),P}function S(w){if(--w.usedTimes===0){const M=h.indexOf(w);h[M]=h[h.length-1],h.pop(),w.destroy()}}function b(w){l.remove(w)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:R,releaseProgram:S,releaseShaderCache:b,programs:h,dispose:E}}function lb(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function hb(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Wd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Yd(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,g,_,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function r(f,d,u,g,_,m){const p=o(f,d,u,g,_,m);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,g,_,m){const p=o(f,d,u,g,_,m);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||hb),i.length>1&&i.sort(d||Wd),a.length>1&&a.sort(d||Wd)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function db(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Yd,n.set(i,[o])):a>=s.length?(o=new Yd,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function ub(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ne};break;case"SpotLight":e={position:new G,direction:new G,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ne,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":e={color:new ne,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function fb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let pb=0;function mb(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function gb(n){const t=new ub,e=fb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const a=new G,s=new Ne,o=new Ne;function r(c){let h=0,f=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,x=0,y=0,v=0,R=0,S=0,b=0;c.sort(mb);for(let w=0,M=c.length;w<M;w++){const P=c[w],F=P.color,D=P.intensity,U=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*D,f+=F.g*D,d+=F.b*D;else if(P.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(P.sh.coefficients[k],D);b++}else if(P.isDirectionalLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,N=e.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,i.directionalShadow[u]=N,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=P.shadow.matrix,x++}i.directional[u]=k,u++}else if(P.isSpotLight){const k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(F).multiplyScalar(D),k.distance=U,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,i.spot[_]=k;const H=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,H.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=H.matrix,P.castShadow){const N=e.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,i.spotShadow[_]=N,i.spotShadowMap[_]=L,v++}_++}else if(P.isRectAreaLight){const k=t.get(P);k.color.copy(F).multiplyScalar(D),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=k,m++}else if(P.isPointLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const H=P.shadow,N=e.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,N.shadowCameraNear=H.camera.near,N.shadowCameraFar=H.camera.far,i.pointShadow[g]=N,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=P.shadow.matrix,y++}i.point[g]=k,g++}else if(P.isHemisphereLight){const k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(D),k.groundColor.copy(P.groundColor).multiplyScalar(D),i.hemi[p]=k,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ot.LTC_FLOAT_1,i.rectAreaLTC2=Ot.LTC_FLOAT_2):(i.rectAreaLTC1=Ot.LTC_HALF_1,i.rectAreaLTC2=Ot.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const E=i.hash;(E.directionalLength!==u||E.pointLength!==g||E.spotLength!==_||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==x||E.numPointShadows!==y||E.numSpotShadows!==v||E.numSpotMaps!==R||E.numLightProbes!==b)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+R-S,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=b,E.directionalLength=u,E.pointLength=g,E.spotLength=_,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=x,E.numPointShadows=y,E.numSpotShadows=v,E.numSpotMaps=R,E.numLightProbes=b,i.version=pb++)}function l(c,h){let f=0,d=0,u=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const y=c[p];if(y.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(y.matrixWorld),a.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),f++}else if(y.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(y.matrixWorld),a.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),u++}else if(y.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(y.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:r,setupView:l,state:i}}function $d(n){const t=new gb(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function xb(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new $d(n),t.set(a,[r])):s>=o.length?(r=new $d(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class vb extends ca{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Qg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _b extends ca{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const yb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mb=`uniform sampler2D shadow_pass;
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
}`;function bb(n,t,e){let i=new Wl;const a=new $t,s=new $t,o=new Ye,r=new vb({depthPacking:tx}),l=new _b,c={},h=e.maxTextureSize,f={[Ii]:wn,[wn]:Ii,[He]:He},d=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:yb,fragmentShader:Mb}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new Ke;g.setAttribute("position",new ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new me(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yu;let p=this.type;this.render=function(S,b,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Di),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const D=p!==fi&&this.type===fi,U=p===fi&&this.type!==fi;for(let L=0,k=S.length;L<k;L++){const H=S[L],N=H.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;a.copy(N.mapSize);const z=N.getFrameExtents();if(a.multiply(z),s.copy(N.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/z.x),a.x=s.x*z.x,N.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/z.y),a.y=s.y*z.y,N.mapSize.y=s.y)),N.map===null||D===!0||U===!0){const mt=this.type!==fi?{minFilter:Yn,magFilter:Yn}:{};N.map!==null&&N.map.dispose(),N.map=new oa(a.x,a.y,mt),N.map.texture.name=H.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const V=N.getViewportCount();for(let mt=0;mt<V;mt++){const ot=N.getViewport(mt);o.set(s.x*ot.x,s.y*ot.y,s.x*ot.z,s.y*ot.w),F.viewport(o),N.updateMatrices(H,mt),i=N.getFrustum(),v(b,E,N.camera,H,this.type)}N.isPointLightShadow!==!0&&this.type===fi&&x(N,E),N.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,M,P)};function x(S,b){const E=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new oa(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(b,null,E,d,_,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(b,null,E,u,_,null)}function y(S,b,E,w){let M=null;const P=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)M=P;else if(M=E.isPointLight===!0?l:r,n.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const F=M.uuid,D=b.uuid;let U=c[F];U===void 0&&(U={},c[F]=U);let L=U[D];L===void 0&&(L=M.clone(),U[D]=L,b.addEventListener("dispose",R)),M=L}if(M.visible=b.visible,M.wireframe=b.wireframe,w===fi?M.side=b.shadowSide!==null?b.shadowSide:b.side:M.side=b.shadowSide!==null?b.shadowSide:f[b.side],M.alphaMap=b.alphaMap,M.alphaTest=b.alphaTest,M.map=b.map,M.clipShadows=b.clipShadows,M.clippingPlanes=b.clippingPlanes,M.clipIntersection=b.clipIntersection,M.displacementMap=b.displacementMap,M.displacementScale=b.displacementScale,M.displacementBias=b.displacementBias,M.wireframeLinewidth=b.wireframeLinewidth,M.linewidth=b.linewidth,E.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=E}return M}function v(S,b,E,w,M){if(S.visible===!1)return;if(S.layers.test(b.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===fi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const D=t.update(S),U=S.material;if(Array.isArray(U)){const L=D.groups;for(let k=0,H=L.length;k<H;k++){const N=L[k],z=U[N.materialIndex];if(z&&z.visible){const V=y(S,z,w,M);S.onBeforeShadow(n,S,b,E,D,V,N),n.renderBufferDirect(E,null,D,V,S,N),S.onAfterShadow(n,S,b,E,D,V,N)}}}else if(U.visible){const L=y(S,U,w,M);S.onBeforeShadow(n,S,b,E,D,L,null),n.renderBufferDirect(E,null,D,L,S,null),S.onAfterShadow(n,S,b,E,D,L,null)}}const F=S.children;for(let D=0,U=F.length;D<U;D++)v(F[D],b,E,w,M)}function R(S){S.target.removeEventListener("dispose",R);for(const E in c){const w=c[E],M=S.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const Sb={[Dc]:kc,[Ic]:Uc,[zc]:Nc,[Wa]:Fc,[kc]:Dc,[Uc]:Ic,[Nc]:zc,[Fc]:Wa};function wb(n,t){function e(){let O=!1;const gt=new Ye;let K=null;const rt=new Ye(0,0,0,0);return{setMask:function(St){K!==St&&!O&&(n.colorMask(St,St,St,St),K=St)},setLocked:function(St){O=St},setClear:function(St,Et,Kt,re,de){de===!0&&(St*=re,Et*=re,Kt*=re),gt.set(St,Et,Kt,re),rt.equals(gt)===!1&&(n.clearColor(St,Et,Kt,re),rt.copy(gt))},reset:function(){O=!1,K=null,rt.set(-1,0,0,0)}}}function i(){let O=!1,gt=!1,K=null,rt=null,St=null;return{setReversed:function(Et){if(gt!==Et){const Kt=t.get("EXT_clip_control");gt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const re=St;St=null,this.setClear(re)}gt=Et},getReversed:function(){return gt},setTest:function(Et){Et?Q(n.DEPTH_TEST):Mt(n.DEPTH_TEST)},setMask:function(Et){K!==Et&&!O&&(n.depthMask(Et),K=Et)},setFunc:function(Et){if(gt&&(Et=Sb[Et]),rt!==Et){switch(Et){case Dc:n.depthFunc(n.NEVER);break;case kc:n.depthFunc(n.ALWAYS);break;case Ic:n.depthFunc(n.LESS);break;case Wa:n.depthFunc(n.LEQUAL);break;case zc:n.depthFunc(n.EQUAL);break;case Fc:n.depthFunc(n.GEQUAL);break;case Uc:n.depthFunc(n.GREATER);break;case Nc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=Et}},setLocked:function(Et){O=Et},setClear:function(Et){St!==Et&&(gt&&(Et=1-Et),n.clearDepth(Et),St=Et)},reset:function(){O=!1,K=null,rt=null,St=null,gt=!1}}}function a(){let O=!1,gt=null,K=null,rt=null,St=null,Et=null,Kt=null,re=null,de=null;return{setTest:function(ae){O||(ae?Q(n.STENCIL_TEST):Mt(n.STENCIL_TEST))},setMask:function(ae){gt!==ae&&!O&&(n.stencilMask(ae),gt=ae)},setFunc:function(ae,be,ge){(K!==ae||rt!==be||St!==ge)&&(n.stencilFunc(ae,be,ge),K=ae,rt=be,St=ge)},setOp:function(ae,be,ge){(Et!==ae||Kt!==be||re!==ge)&&(n.stencilOp(ae,be,ge),Et=ae,Kt=be,re=ge)},setLocked:function(ae){O=ae},setClear:function(ae){de!==ae&&(n.clearStencil(ae),de=ae)},reset:function(){O=!1,gt=null,K=null,rt=null,St=null,Et=null,Kt=null,re=null,de=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,y=null,v=null,R=null,S=null,b=new ne(0,0,0),E=0,w=!1,M=null,P=null,F=null,D=null,U=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,H=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(N)[1]),k=H>=1):N.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),k=H>=2);let z=null,V={};const mt=n.getParameter(n.SCISSOR_BOX),ot=n.getParameter(n.VIEWPORT),dt=new Ye().fromArray(mt),tt=new Ye().fromArray(ot);function q(O,gt,K,rt){const St=new Uint8Array(4),Et=n.createTexture();n.bindTexture(O,Et),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<K;Kt++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(gt,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(gt+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return Et}const pt={};pt[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),Q(n.DEPTH_TEST),o.setFunc(Wa),Wt(!1),Gt(jh),Q(n.CULL_FACE),X(Di);function Q(O){h[O]!==!0&&(n.enable(O),h[O]=!0)}function Mt(O){h[O]!==!1&&(n.disable(O),h[O]=!1)}function Ct(O,gt){return f[O]!==gt?(n.bindFramebuffer(O,gt),f[O]=gt,O===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=gt),O===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=gt),!0):!1}function zt(O,gt){let K=u,rt=!1;if(O){K=d.get(gt),K===void 0&&(K=[],d.set(gt,K));const St=O.textures;if(K.length!==St.length||K[0]!==n.COLOR_ATTACHMENT0){for(let Et=0,Kt=St.length;Et<Kt;Et++)K[Et]=n.COLOR_ATTACHMENT0+Et;K.length=St.length,rt=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,rt=!0);rt&&n.drawBuffers(K)}function Zt(O){return g!==O?(n.useProgram(O),g=O,!0):!1}const ht={[Qi]:n.FUNC_ADD,[Tg]:n.FUNC_SUBTRACT,[Ag]:n.FUNC_REVERSE_SUBTRACT};ht[Rg]=n.MIN,ht[Pg]=n.MAX;const Ht={[Cg]:n.ZERO,[Lg]:n.ONE,[Dg]:n.SRC_COLOR,[Cc]:n.SRC_ALPHA,[Ng]:n.SRC_ALPHA_SATURATE,[Fg]:n.DST_COLOR,[Ig]:n.DST_ALPHA,[kg]:n.ONE_MINUS_SRC_COLOR,[Lc]:n.ONE_MINUS_SRC_ALPHA,[Ug]:n.ONE_MINUS_DST_COLOR,[zg]:n.ONE_MINUS_DST_ALPHA,[Og]:n.CONSTANT_COLOR,[Bg]:n.ONE_MINUS_CONSTANT_COLOR,[Hg]:n.CONSTANT_ALPHA,[Gg]:n.ONE_MINUS_CONSTANT_ALPHA};function X(O,gt,K,rt,St,Et,Kt,re,de,ae){if(O===Di){_===!0&&(Mt(n.BLEND),_=!1);return}if(_===!1&&(Q(n.BLEND),_=!0),O!==Eg){if(O!==m||ae!==w){if((p!==Qi||v!==Qi)&&(n.blendEquation(n.FUNC_ADD),p=Qi,v=Qi),ae)switch(O){case Ba:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ai:n.blendFunc(n.ONE,n.ONE);break;case Kh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Ba:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ai:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Kh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}x=null,y=null,R=null,S=null,b.set(0,0,0),E=0,m=O,w=ae}return}St=St||gt,Et=Et||K,Kt=Kt||rt,(gt!==p||St!==v)&&(n.blendEquationSeparate(ht[gt],ht[St]),p=gt,v=St),(K!==x||rt!==y||Et!==R||Kt!==S)&&(n.blendFuncSeparate(Ht[K],Ht[rt],Ht[Et],Ht[Kt]),x=K,y=rt,R=Et,S=Kt),(re.equals(b)===!1||de!==E)&&(n.blendColor(re.r,re.g,re.b,de),b.copy(re),E=de),m=O,w=!1}function le(O,gt){O.side===He?Mt(n.CULL_FACE):Q(n.CULL_FACE);let K=O.side===wn;gt&&(K=!K),Wt(K),O.blending===Ba&&O.transparent===!1?X(Di):X(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),s.setMask(O.colorWrite);const rt=O.stencilWrite;r.setTest(rt),rt&&(r.setMask(O.stencilWriteMask),r.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),r.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),At(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):Mt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(O){M!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),M=O)}function Gt(O){O!==Sg?(Q(n.CULL_FACE),O!==P&&(O===jh?n.cullFace(n.BACK):O===wg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Mt(n.CULL_FACE),P=O}function Nt(O){O!==F&&(k&&n.lineWidth(O),F=O)}function At(O,gt,K){O?(Q(n.POLYGON_OFFSET_FILL),(D!==gt||U!==K)&&(n.polygonOffset(gt,K),D=gt,U=K)):Mt(n.POLYGON_OFFSET_FILL)}function Rt(O){O?Q(n.SCISSOR_TEST):Mt(n.SCISSOR_TEST)}function C(O){O===void 0&&(O=n.TEXTURE0+L-1),z!==O&&(n.activeTexture(O),z=O)}function T(O,gt,K){K===void 0&&(z===null?K=n.TEXTURE0+L-1:K=z);let rt=V[K];rt===void 0&&(rt={type:void 0,texture:void 0},V[K]=rt),(rt.type!==O||rt.texture!==gt)&&(z!==K&&(n.activeTexture(K),z=K),n.bindTexture(O,gt||pt[O]),rt.type=O,rt.texture=gt)}function W(){const O=V[z];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ct(){try{n.compressedTexImage2D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function lt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function at(){try{n.texSubImage2D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pt(){try{n.texSubImage3D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function j(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ft(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Bt(){try{n.texStorage2D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function nt(){try{n.texStorage3D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function yt(){try{n.texImage2D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function B(){try{n.texImage3D.apply(n,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function st(O){dt.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),dt.copy(O))}function ut(O){tt.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),tt.copy(O))}function Vt(O,gt){let K=c.get(gt);K===void 0&&(K=new WeakMap,c.set(gt,K));let rt=K.get(O);rt===void 0&&(rt=n.getUniformBlockIndex(gt,O.name),K.set(O,rt))}function qt(O,gt){const rt=c.get(gt).get(O);l.get(gt)!==rt&&(n.uniformBlockBinding(gt,rt,O.__bindingPointIndex),l.set(gt,rt))}function Yt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},z=null,V={},f={},d=new WeakMap,u=[],g=null,_=!1,m=null,p=null,x=null,y=null,v=null,R=null,S=null,b=new ne(0,0,0),E=0,w=!1,M=null,P=null,F=null,D=null,U=null,dt.set(0,0,n.canvas.width,n.canvas.height),tt.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:Q,disable:Mt,bindFramebuffer:Ct,drawBuffers:zt,useProgram:Zt,setBlending:X,setMaterial:le,setFlipSided:Wt,setCullFace:Gt,setLineWidth:Nt,setPolygonOffset:At,setScissorTest:Rt,activeTexture:C,bindTexture:T,unbindTexture:W,compressedTexImage2D:ct,compressedTexImage3D:lt,texImage2D:yt,texImage3D:B,updateUBOMapping:Vt,uniformBlockBinding:qt,texStorage2D:Bt,texStorage3D:nt,texSubImage2D:at,texSubImage3D:Pt,compressedTexSubImage2D:j,compressedTexSubImage3D:ft,scissor:st,viewport:ut,reset:Yt}}function Zd(n,t,e,i){const a=Eb(i);switch(e){case Ju:return n*t;case tf:return n*t;case ef:return n*t*2;case nf:return n*t/a.components*a.byteLength;case Ol:return n*t/a.components*a.byteLength;case af:return n*t*2/a.components*a.byteLength;case Bl:return n*t*2/a.components*a.byteLength;case Qu:return n*t*3/a.components*a.byteLength;case Wn:return n*t*4/a.components*a.byteLength;case Hl:return n*t*4/a.components*a.byteLength;case Lo:case Do:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ko:case Io:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Xc:case Yc:return Math.max(n,16)*Math.max(t,8)/4;case Vc:case Wc:return Math.max(n,8)*Math.max(t,8)/2;case $c:case Zc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case qc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case jc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Kc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Jc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Qc:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case tl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case el:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case nl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case il:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case al:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case sl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case ol:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case rl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case cl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ll:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case zo:case hl:case dl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case sf:case ul:return Math.ceil(n/4)*Math.ceil(t/4)*8;case fl:case pl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Eb(n){switch(n){case vi:case qu:return{byteLength:1,components:1};case Cs:case ju:case Ns:return{byteLength:2,components:1};case Ul:case Nl:return{byteLength:2,components:4};case sa:case Fl:case mi:return{byteLength:4,components:1};case Ku:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Tb(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $t,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,T){return u?new OffscreenCanvas(C,T):qo("canvas")}function _(C,T,W){let ct=1;const lt=Rt(C);if((lt.width>W||lt.height>W)&&(ct=W/Math.max(lt.width,lt.height)),ct<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const at=Math.floor(ct*lt.width),Pt=Math.floor(ct*lt.height);f===void 0&&(f=g(at,Pt));const j=T?g(at,Pt):f;return j.width=at,j.height=Pt,j.getContext("2d").drawImage(C,0,0,at,Pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+at+"x"+Pt+")."),j}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(C,T,W,ct,lt=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let at=T;if(T===n.RED&&(W===n.FLOAT&&(at=n.R32F),W===n.HALF_FLOAT&&(at=n.R16F),W===n.UNSIGNED_BYTE&&(at=n.R8)),T===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.R8UI),W===n.UNSIGNED_SHORT&&(at=n.R16UI),W===n.UNSIGNED_INT&&(at=n.R32UI),W===n.BYTE&&(at=n.R8I),W===n.SHORT&&(at=n.R16I),W===n.INT&&(at=n.R32I)),T===n.RG&&(W===n.FLOAT&&(at=n.RG32F),W===n.HALF_FLOAT&&(at=n.RG16F),W===n.UNSIGNED_BYTE&&(at=n.RG8)),T===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RG8UI),W===n.UNSIGNED_SHORT&&(at=n.RG16UI),W===n.UNSIGNED_INT&&(at=n.RG32UI),W===n.BYTE&&(at=n.RG8I),W===n.SHORT&&(at=n.RG16I),W===n.INT&&(at=n.RG32I)),T===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGB8UI),W===n.UNSIGNED_SHORT&&(at=n.RGB16UI),W===n.UNSIGNED_INT&&(at=n.RGB32UI),W===n.BYTE&&(at=n.RGB8I),W===n.SHORT&&(at=n.RGB16I),W===n.INT&&(at=n.RGB32I)),T===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),W===n.UNSIGNED_INT&&(at=n.RGBA32UI),W===n.BYTE&&(at=n.RGBA8I),W===n.SHORT&&(at=n.RGBA16I),W===n.INT&&(at=n.RGBA32I)),T===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),T===n.RGBA){const Pt=lt?sr:Me.getTransfer(ct);W===n.FLOAT&&(at=n.RGBA32F),W===n.HALF_FLOAT&&(at=n.RGBA16F),W===n.UNSIGNED_BYTE&&(at=Pt===ke?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function v(C,T){let W;return C?T===null||T===sa||T===Za?W=n.DEPTH24_STENCIL8:T===mi?W=n.DEPTH32F_STENCIL8:T===Cs&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===sa||T===Za?W=n.DEPTH_COMPONENT24:T===mi?W=n.DEPTH_COMPONENT32F:T===Cs&&(W=n.DEPTH_COMPONENT16),W}function R(C,T){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Yn&&C.minFilter!==ei?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function S(C){const T=C.target;T.removeEventListener("dispose",S),E(T),T.isVideoTexture&&h.delete(T)}function b(C){const T=C.target;T.removeEventListener("dispose",b),M(T)}function E(C){const T=i.get(C);if(T.__webglInit===void 0)return;const W=C.source,ct=d.get(W);if(ct){const lt=ct[T.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&w(C),Object.keys(ct).length===0&&d.delete(W)}i.remove(C)}function w(C){const T=i.get(C);n.deleteTexture(T.__webglTexture);const W=C.source,ct=d.get(W);delete ct[T.__cacheKey],o.memory.textures--}function M(C){const T=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let ct=0;ct<6;ct++){if(Array.isArray(T.__webglFramebuffer[ct]))for(let lt=0;lt<T.__webglFramebuffer[ct].length;lt++)n.deleteFramebuffer(T.__webglFramebuffer[ct][lt]);else n.deleteFramebuffer(T.__webglFramebuffer[ct]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[ct])}else{if(Array.isArray(T.__webglFramebuffer))for(let ct=0;ct<T.__webglFramebuffer.length;ct++)n.deleteFramebuffer(T.__webglFramebuffer[ct]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ct=0;ct<T.__webglColorRenderbuffer.length;ct++)T.__webglColorRenderbuffer[ct]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[ct]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const W=C.textures;for(let ct=0,lt=W.length;ct<lt;ct++){const at=i.get(W[ct]);at.__webglTexture&&(n.deleteTexture(at.__webglTexture),o.memory.textures--),i.remove(W[ct])}i.remove(C)}let P=0;function F(){P=0}function D(){const C=P;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),P+=1,C}function U(C){const T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function L(C,T){const W=i.get(C);if(C.isVideoTexture&&Nt(C),C.isRenderTargetTexture===!1&&C.version>0&&W.__version!==C.version){const ct=C.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{tt(W,C,T);return}}e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+T)}function k(C,T){const W=i.get(C);if(C.version>0&&W.__version!==C.version){tt(W,C,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+T)}function H(C,T){const W=i.get(C);if(C.version>0&&W.__version!==C.version){tt(W,C,T);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+T)}function N(C,T){const W=i.get(C);if(C.version>0&&W.__version!==C.version){q(W,C,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+T)}const z={[Hc]:n.REPEAT,[ea]:n.CLAMP_TO_EDGE,[Gc]:n.MIRRORED_REPEAT},V={[Yn]:n.NEAREST,[Jg]:n.NEAREST_MIPMAP_NEAREST,[js]:n.NEAREST_MIPMAP_LINEAR,[ei]:n.LINEAR,[kr]:n.LINEAR_MIPMAP_NEAREST,[na]:n.LINEAR_MIPMAP_LINEAR},mt={[nx]:n.NEVER,[cx]:n.ALWAYS,[ix]:n.LESS,[rf]:n.LEQUAL,[ax]:n.EQUAL,[rx]:n.GEQUAL,[sx]:n.GREATER,[ox]:n.NOTEQUAL};function ot(C,T){if(T.type===mi&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===ei||T.magFilter===kr||T.magFilter===js||T.magFilter===na||T.minFilter===ei||T.minFilter===kr||T.minFilter===js||T.minFilter===na)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,z[T.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,z[T.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,z[T.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,V[T.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,V[T.minFilter]),T.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,mt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Yn||T.minFilter!==js&&T.minFilter!==na||T.type===mi&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function dt(C,T){let W=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",S));const ct=T.source;let lt=d.get(ct);lt===void 0&&(lt={},d.set(ct,lt));const at=U(T);if(at!==C.__cacheKey){lt[at]===void 0&&(lt[at]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,W=!0),lt[at].usedTimes++;const Pt=lt[C.__cacheKey];Pt!==void 0&&(lt[C.__cacheKey].usedTimes--,Pt.usedTimes===0&&w(T)),C.__cacheKey=at,C.__webglTexture=lt[at].texture}return W}function tt(C,T,W){let ct=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ct=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ct=n.TEXTURE_3D);const lt=dt(C,T),at=T.source;e.bindTexture(ct,C.__webglTexture,n.TEXTURE0+W);const Pt=i.get(at);if(at.version!==Pt.__version||lt===!0){e.activeTexture(n.TEXTURE0+W);const j=Me.getPrimaries(Me.workingColorSpace),ft=T.colorSpace===Ri?null:Me.getPrimaries(T.colorSpace),Bt=T.colorSpace===Ri||j===ft?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let nt=_(T.image,!1,a.maxTextureSize);nt=At(T,nt);const yt=s.convert(T.format,T.colorSpace),B=s.convert(T.type);let st=y(T.internalFormat,yt,B,T.colorSpace,T.isVideoTexture);ot(ct,T);let ut;const Vt=T.mipmaps,qt=T.isVideoTexture!==!0,Yt=Pt.__version===void 0||lt===!0,O=at.dataReady,gt=R(T,nt);if(T.isDepthTexture)st=v(T.format===qa,T.type),Yt&&(qt?e.texStorage2D(n.TEXTURE_2D,1,st,nt.width,nt.height):e.texImage2D(n.TEXTURE_2D,0,st,nt.width,nt.height,0,yt,B,null));else if(T.isDataTexture)if(Vt.length>0){qt&&Yt&&e.texStorage2D(n.TEXTURE_2D,gt,st,Vt[0].width,Vt[0].height);for(let K=0,rt=Vt.length;K<rt;K++)ut=Vt[K],qt?O&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,yt,B,ut.data):e.texImage2D(n.TEXTURE_2D,K,st,ut.width,ut.height,0,yt,B,ut.data);T.generateMipmaps=!1}else qt?(Yt&&e.texStorage2D(n.TEXTURE_2D,gt,st,nt.width,nt.height),O&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,nt.width,nt.height,yt,B,nt.data)):e.texImage2D(n.TEXTURE_2D,0,st,nt.width,nt.height,0,yt,B,nt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){qt&&Yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,st,Vt[0].width,Vt[0].height,nt.depth);for(let K=0,rt=Vt.length;K<rt;K++)if(ut=Vt[K],T.format!==Wn)if(yt!==null)if(qt){if(O)if(T.layerUpdates.size>0){const St=Zd(ut.width,ut.height,T.format,T.type);for(const Et of T.layerUpdates){const Kt=ut.data.subarray(Et*St/ut.data.BYTES_PER_ELEMENT,(Et+1)*St/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,Et,ut.width,ut.height,1,yt,Kt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ut.width,ut.height,nt.depth,yt,ut.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,st,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?O&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,ut.width,ut.height,nt.depth,yt,B,ut.data):e.texImage3D(n.TEXTURE_2D_ARRAY,K,st,ut.width,ut.height,nt.depth,0,yt,B,ut.data)}else{qt&&Yt&&e.texStorage2D(n.TEXTURE_2D,gt,st,Vt[0].width,Vt[0].height);for(let K=0,rt=Vt.length;K<rt;K++)ut=Vt[K],T.format!==Wn?yt!==null?qt?O&&e.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,yt,ut.data):e.compressedTexImage2D(n.TEXTURE_2D,K,st,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?O&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,ut.width,ut.height,yt,B,ut.data):e.texImage2D(n.TEXTURE_2D,K,st,ut.width,ut.height,0,yt,B,ut.data)}else if(T.isDataArrayTexture)if(qt){if(Yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,st,nt.width,nt.height,nt.depth),O)if(T.layerUpdates.size>0){const K=Zd(nt.width,nt.height,T.format,T.type);for(const rt of T.layerUpdates){const St=nt.data.subarray(rt*K/nt.data.BYTES_PER_ELEMENT,(rt+1)*K/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,nt.width,nt.height,1,yt,B,St)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,yt,B,nt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,st,nt.width,nt.height,nt.depth,0,yt,B,nt.data);else if(T.isData3DTexture)qt?(Yt&&e.texStorage3D(n.TEXTURE_3D,gt,st,nt.width,nt.height,nt.depth),O&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,yt,B,nt.data)):e.texImage3D(n.TEXTURE_3D,0,st,nt.width,nt.height,nt.depth,0,yt,B,nt.data);else if(T.isFramebufferTexture){if(Yt)if(qt)e.texStorage2D(n.TEXTURE_2D,gt,st,nt.width,nt.height);else{let K=nt.width,rt=nt.height;for(let St=0;St<gt;St++)e.texImage2D(n.TEXTURE_2D,St,st,K,rt,0,yt,B,null),K>>=1,rt>>=1}}else if(Vt.length>0){if(qt&&Yt){const K=Rt(Vt[0]);e.texStorage2D(n.TEXTURE_2D,gt,st,K.width,K.height)}for(let K=0,rt=Vt.length;K<rt;K++)ut=Vt[K],qt?O&&e.texSubImage2D(n.TEXTURE_2D,K,0,0,yt,B,ut):e.texImage2D(n.TEXTURE_2D,K,st,yt,B,ut);T.generateMipmaps=!1}else if(qt){if(Yt){const K=Rt(nt);e.texStorage2D(n.TEXTURE_2D,gt,st,K.width,K.height)}O&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,yt,B,nt)}else e.texImage2D(n.TEXTURE_2D,0,st,yt,B,nt);m(T)&&p(ct),Pt.__version=at.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function q(C,T,W){if(T.image.length!==6)return;const ct=dt(C,T),lt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+W);const at=i.get(lt);if(lt.version!==at.__version||ct===!0){e.activeTexture(n.TEXTURE0+W);const Pt=Me.getPrimaries(Me.workingColorSpace),j=T.colorSpace===Ri?null:Me.getPrimaries(T.colorSpace),ft=T.colorSpace===Ri||Pt===j?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const Bt=T.isCompressedTexture||T.image[0].isCompressedTexture,nt=T.image[0]&&T.image[0].isDataTexture,yt=[];for(let rt=0;rt<6;rt++)!Bt&&!nt?yt[rt]=_(T.image[rt],!0,a.maxCubemapSize):yt[rt]=nt?T.image[rt].image:T.image[rt],yt[rt]=At(T,yt[rt]);const B=yt[0],st=s.convert(T.format,T.colorSpace),ut=s.convert(T.type),Vt=y(T.internalFormat,st,ut,T.colorSpace),qt=T.isVideoTexture!==!0,Yt=at.__version===void 0||ct===!0,O=lt.dataReady;let gt=R(T,B);ot(n.TEXTURE_CUBE_MAP,T);let K;if(Bt){qt&&Yt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Vt,B.width,B.height);for(let rt=0;rt<6;rt++){K=yt[rt].mipmaps;for(let St=0;St<K.length;St++){const Et=K[St];T.format!==Wn?st!==null?qt?O&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,Et.width,Et.height,st,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,Vt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?O&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,0,0,Et.width,Et.height,st,ut,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St,Vt,Et.width,Et.height,0,st,ut,Et.data)}}}else{if(K=T.mipmaps,qt&&Yt){K.length>0&&gt++;const rt=Rt(yt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Vt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(nt){qt?O&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,yt[rt].width,yt[rt].height,st,ut,yt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Vt,yt[rt].width,yt[rt].height,0,st,ut,yt[rt].data);for(let St=0;St<K.length;St++){const Kt=K[St].image[rt].image;qt?O&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,Kt.width,Kt.height,st,ut,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,Vt,Kt.width,Kt.height,0,st,ut,Kt.data)}}else{qt?O&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,st,ut,yt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Vt,st,ut,yt[rt]);for(let St=0;St<K.length;St++){const Et=K[St];qt?O&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,0,0,st,ut,Et.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,St+1,Vt,st,ut,Et.image[rt])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),at.__version=lt.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function pt(C,T,W,ct,lt,at){const Pt=s.convert(W.format,W.colorSpace),j=s.convert(W.type),ft=y(W.internalFormat,Pt,j,W.colorSpace),Bt=i.get(T),nt=i.get(W);if(nt.__renderTarget=T,!Bt.__hasExternalTextures){const yt=Math.max(1,T.width>>at),B=Math.max(1,T.height>>at);lt===n.TEXTURE_3D||lt===n.TEXTURE_2D_ARRAY?e.texImage3D(lt,at,ft,yt,B,T.depth,0,Pt,j,null):e.texImage2D(lt,at,ft,yt,B,0,Pt,j,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Gt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ct,lt,nt.__webglTexture,0,Wt(T)):(lt===n.TEXTURE_2D||lt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ct,lt,nt.__webglTexture,at),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Q(C,T,W){if(n.bindRenderbuffer(n.RENDERBUFFER,C),T.depthBuffer){const ct=T.depthTexture,lt=ct&&ct.isDepthTexture?ct.type:null,at=v(T.stencilBuffer,lt),Pt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=Wt(T);Gt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,j,at,T.width,T.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,j,at,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,at,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pt,n.RENDERBUFFER,C)}else{const ct=T.textures;for(let lt=0;lt<ct.length;lt++){const at=ct[lt],Pt=s.convert(at.format,at.colorSpace),j=s.convert(at.type),ft=y(at.internalFormat,Pt,j,at.colorSpace),Bt=Wt(T);W&&Gt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,ft,T.width,T.height):Gt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,ft,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ft,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Mt(C,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ct=i.get(T.depthTexture);ct.__renderTarget=T,(!ct.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const lt=ct.__webglTexture,at=Wt(T);if(T.depthTexture.format===Ha)Gt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,lt,0);else if(T.depthTexture.format===qa)Gt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Ct(C){const T=i.get(C),W=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){const ct=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ct){const lt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ct.removeEventListener("dispose",lt)};ct.addEventListener("dispose",lt),T.__depthDisposeCallback=lt}T.__boundDepthTexture=ct}if(C.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");Mt(T.__webglFramebuffer,C)}else if(W){T.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[ct]),T.__webglDepthbuffer[ct]===void 0)T.__webglDepthbuffer[ct]=n.createRenderbuffer(),Q(T.__webglDepthbuffer[ct],C,!1);else{const lt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=T.__webglDepthbuffer[ct];n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,at)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Q(T.__webglDepthbuffer,C,!1);else{const ct=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ct,n.RENDERBUFFER,lt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function zt(C,T,W){const ct=i.get(C);T!==void 0&&pt(ct.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&Ct(C)}function Zt(C){const T=C.texture,W=i.get(C),ct=i.get(T);C.addEventListener("dispose",b);const lt=C.textures,at=C.isWebGLCubeRenderTarget===!0,Pt=lt.length>1;if(Pt||(ct.__webglTexture===void 0&&(ct.__webglTexture=n.createTexture()),ct.__version=T.version,o.memory.textures++),at){W.__webglFramebuffer=[];for(let j=0;j<6;j++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[j]=[];for(let ft=0;ft<T.mipmaps.length;ft++)W.__webglFramebuffer[j][ft]=n.createFramebuffer()}else W.__webglFramebuffer[j]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let j=0;j<T.mipmaps.length;j++)W.__webglFramebuffer[j]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(Pt)for(let j=0,ft=lt.length;j<ft;j++){const Bt=i.get(lt[j]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Gt(C)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let j=0;j<lt.length;j++){const ft=lt[j];W.__webglColorRenderbuffer[j]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[j]);const Bt=s.convert(ft.format,ft.colorSpace),nt=s.convert(ft.type),yt=y(ft.internalFormat,Bt,nt,ft.colorSpace,C.isXRRenderTarget===!0),B=Wt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,B,yt,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,W.__webglColorRenderbuffer[j])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),Q(W.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,ct.__webglTexture),ot(n.TEXTURE_CUBE_MAP,T);for(let j=0;j<6;j++)if(T.mipmaps&&T.mipmaps.length>0)for(let ft=0;ft<T.mipmaps.length;ft++)pt(W.__webglFramebuffer[j][ft],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ft);else pt(W.__webglFramebuffer[j],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Pt){for(let j=0,ft=lt.length;j<ft;j++){const Bt=lt[j],nt=i.get(Bt);e.bindTexture(n.TEXTURE_2D,nt.__webglTexture),ot(n.TEXTURE_2D,Bt),pt(W.__webglFramebuffer,C,Bt,n.COLOR_ATTACHMENT0+j,n.TEXTURE_2D,0),m(Bt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let j=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(j,ct.__webglTexture),ot(j,T),T.mipmaps&&T.mipmaps.length>0)for(let ft=0;ft<T.mipmaps.length;ft++)pt(W.__webglFramebuffer[ft],C,T,n.COLOR_ATTACHMENT0,j,ft);else pt(W.__webglFramebuffer,C,T,n.COLOR_ATTACHMENT0,j,0);m(T)&&p(j),e.unbindTexture()}C.depthBuffer&&Ct(C)}function ht(C){const T=C.textures;for(let W=0,ct=T.length;W<ct;W++){const lt=T[W];if(m(lt)){const at=x(C),Pt=i.get(lt).__webglTexture;e.bindTexture(at,Pt),p(at),e.unbindTexture()}}}const Ht=[],X=[];function le(C){if(C.samples>0){if(Gt(C)===!1){const T=C.textures,W=C.width,ct=C.height;let lt=n.COLOR_BUFFER_BIT;const at=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pt=i.get(C),j=T.length>1;if(j)for(let ft=0;ft<T.length;ft++)e.bindFramebuffer(n.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Pt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer);for(let ft=0;ft<T.length;ft++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(lt|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(lt|=n.STENCIL_BUFFER_BIT)),j){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pt.__webglColorRenderbuffer[ft]);const Bt=i.get(T[ft]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Bt,0)}n.blitFramebuffer(0,0,W,ct,0,0,W,ct,lt,n.NEAREST),l===!0&&(Ht.length=0,X.length=0,Ht.push(n.COLOR_ATTACHMENT0+ft),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ht.push(at),X.push(at),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,X)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ht))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),j)for(let ft=0;ft<T.length;ft++){e.bindFramebuffer(n.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.RENDERBUFFER,Pt.__webglColorRenderbuffer[ft]);const Bt=i.get(T[ft]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Pt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ft,n.TEXTURE_2D,Bt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const T=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Wt(C){return Math.min(a.maxSamples,C.samples)}function Gt(C){const T=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Nt(C){const T=o.render.frame;h.get(C)!==T&&(h.set(C,T),C.update())}function At(C,T){const W=C.colorSpace,ct=C.format,lt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||W!==Ka&&W!==Ri&&(Me.getTransfer(W)===ke?(ct!==Wn||lt!==vi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}function Rt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=F,this.setTexture2D=L,this.setTexture2DArray=k,this.setTexture3D=H,this.setTextureCube=N,this.rebindTextures=zt,this.setupRenderTarget=Zt,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=le,this.setupDepthRenderbuffer=Ct,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Gt}function Ab(n,t){function e(i,a=Ri){let s;const o=Me.getTransfer(a);if(i===vi)return n.UNSIGNED_BYTE;if(i===Ul)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Nl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ku)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===qu)return n.BYTE;if(i===ju)return n.SHORT;if(i===Cs)return n.UNSIGNED_SHORT;if(i===Fl)return n.INT;if(i===sa)return n.UNSIGNED_INT;if(i===mi)return n.FLOAT;if(i===Ns)return n.HALF_FLOAT;if(i===Ju)return n.ALPHA;if(i===Qu)return n.RGB;if(i===Wn)return n.RGBA;if(i===tf)return n.LUMINANCE;if(i===ef)return n.LUMINANCE_ALPHA;if(i===Ha)return n.DEPTH_COMPONENT;if(i===qa)return n.DEPTH_STENCIL;if(i===nf)return n.RED;if(i===Ol)return n.RED_INTEGER;if(i===af)return n.RG;if(i===Bl)return n.RG_INTEGER;if(i===Hl)return n.RGBA_INTEGER;if(i===Lo||i===Do||i===ko||i===Io)if(o===ke)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Lo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Do)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ko)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Io)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Lo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Do)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ko)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Io)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Vc||i===Xc||i===Wc||i===Yc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Vc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Xc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Wc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Yc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===$c||i===Zc||i===qc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===$c||i===Zc)return o===ke?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===qc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===jc||i===Kc||i===Jc||i===Qc||i===tl||i===el||i===nl||i===il||i===al||i===sl||i===ol||i===rl||i===cl||i===ll)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===jc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Kc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Jc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Qc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===tl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===el)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===nl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===il)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===al)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===sl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ol)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===rl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===cl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ll)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===zo||i===hl||i===dl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===zo)return o===ke?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===hl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===dl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sf||i===ul||i===fl||i===pl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===zo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ul)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===fl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===pl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Za?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Rb extends Fn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ie extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Pb={type:"move"};class oc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&d>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Pb)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ie;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Cb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Lb=`
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

}`;class Db{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Mn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new zi({vertexShader:Cb,fragmentShader:Lb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new zn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class kb extends Ja{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,g=null;const _=new Db,m=e.getContextAttributes();let p=null,x=null;const y=[],v=[],R=new $t;let S=null;const b=new Fn;b.viewport=new Ye;const E=new Fn;E.viewport=new Ye;const w=[b,E],M=new Rb;let P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(tt){let q=y[tt];return q===void 0&&(q=new oc,y[tt]=q),q.getTargetRaySpace()},this.getControllerGrip=function(tt){let q=y[tt];return q===void 0&&(q=new oc,y[tt]=q),q.getGripSpace()},this.getHand=function(tt){let q=y[tt];return q===void 0&&(q=new oc,y[tt]=q),q.getHandSpace()};function D(tt){const q=v.indexOf(tt.inputSource);if(q===-1)return;const pt=y[q];pt!==void 0&&(pt.update(tt.inputSource,tt.frame,c||o),pt.dispatchEvent({type:tt.type,data:tt.inputSource}))}function U(){a.removeEventListener("select",D),a.removeEventListener("selectstart",D),a.removeEventListener("selectend",D),a.removeEventListener("squeeze",D),a.removeEventListener("squeezestart",D),a.removeEventListener("squeezeend",D),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",L);for(let tt=0;tt<y.length;tt++){const q=v[tt];q!==null&&(v[tt]=null,y[tt].disconnect(q))}P=null,F=null,_.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,x=null,dt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(tt){s=tt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(tt){r=tt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(tt){c=tt},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(tt){if(a=tt,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",D),a.addEventListener("selectstart",D),a.addEventListener("selectend",D),a.addEventListener("squeeze",D),a.addEventListener("squeezestart",D),a.addEventListener("squeezeend",D),a.addEventListener("end",U),a.addEventListener("inputsourceschange",L),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(R),a.renderState.layers===void 0){const q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,q),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new oa(u.framebufferWidth,u.framebufferHeight,{format:Wn,type:vi,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let q=null,pt=null,Q=null;m.depth&&(Q=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,q=m.stencil?qa:Ha,pt=m.stencil?Za:sa);const Mt={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(Mt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new oa(d.textureWidth,d.textureHeight,{format:Wn,type:vi,depthTexture:new _f(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),dt.setContext(a),dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function L(tt){for(let q=0;q<tt.removed.length;q++){const pt=tt.removed[q],Q=v.indexOf(pt);Q>=0&&(v[Q]=null,y[Q].disconnect(pt))}for(let q=0;q<tt.added.length;q++){const pt=tt.added[q];let Q=v.indexOf(pt);if(Q===-1){for(let Ct=0;Ct<y.length;Ct++)if(Ct>=v.length){v.push(pt),Q=Ct;break}else if(v[Ct]===null){v[Ct]=pt,Q=Ct;break}if(Q===-1)break}const Mt=y[Q];Mt&&Mt.connect(pt)}}const k=new G,H=new G;function N(tt,q,pt){k.setFromMatrixPosition(q.matrixWorld),H.setFromMatrixPosition(pt.matrixWorld);const Q=k.distanceTo(H),Mt=q.projectionMatrix.elements,Ct=pt.projectionMatrix.elements,zt=Mt[14]/(Mt[10]-1),Zt=Mt[14]/(Mt[10]+1),ht=(Mt[9]+1)/Mt[5],Ht=(Mt[9]-1)/Mt[5],X=(Mt[8]-1)/Mt[0],le=(Ct[8]+1)/Ct[0],Wt=zt*X,Gt=zt*le,Nt=Q/(-X+le),At=Nt*-X;if(q.matrixWorld.decompose(tt.position,tt.quaternion,tt.scale),tt.translateX(At),tt.translateZ(Nt),tt.matrixWorld.compose(tt.position,tt.quaternion,tt.scale),tt.matrixWorldInverse.copy(tt.matrixWorld).invert(),Mt[10]===-1)tt.projectionMatrix.copy(q.projectionMatrix),tt.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const Rt=zt+Nt,C=Zt+Nt,T=Wt-At,W=Gt+(Q-At),ct=ht*Zt/C*Rt,lt=Ht*Zt/C*Rt;tt.projectionMatrix.makePerspective(T,W,ct,lt,Rt,C),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert()}}function z(tt,q){q===null?tt.matrixWorld.copy(tt.matrix):tt.matrixWorld.multiplyMatrices(q.matrixWorld,tt.matrix),tt.matrixWorldInverse.copy(tt.matrixWorld).invert()}this.updateCamera=function(tt){if(a===null)return;let q=tt.near,pt=tt.far;_.texture!==null&&(_.depthNear>0&&(q=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),M.near=E.near=b.near=q,M.far=E.far=b.far=pt,(P!==M.near||F!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,F=M.far),b.layers.mask=tt.layers.mask|2,E.layers.mask=tt.layers.mask|4,M.layers.mask=b.layers.mask|E.layers.mask;const Q=tt.parent,Mt=M.cameras;z(M,Q);for(let Ct=0;Ct<Mt.length;Ct++)z(Mt[Ct],Q);Mt.length===2?N(M,b,E):M.projectionMatrix.copy(b.projectionMatrix),V(tt,M,Q)};function V(tt,q,pt){pt===null?tt.matrix.copy(q.matrixWorld):(tt.matrix.copy(pt.matrixWorld),tt.matrix.invert(),tt.matrix.multiply(q.matrixWorld)),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.updateMatrixWorld(!0),tt.projectionMatrix.copy(q.projectionMatrix),tt.projectionMatrixInverse.copy(q.projectionMatrixInverse),tt.isPerspectiveCamera&&(tt.fov=Ls*2*Math.atan(1/tt.projectionMatrix.elements[5]),tt.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(tt){l=tt,d!==null&&(d.fixedFoveation=tt),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=tt)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let mt=null;function ot(tt,q){if(h=q.getViewerPose(c||o),g=q,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let Q=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,Q=!0);for(let Ct=0;Ct<pt.length;Ct++){const zt=pt[Ct];let Zt=null;if(u!==null)Zt=u.getViewport(zt);else{const Ht=f.getViewSubImage(d,zt);Zt=Ht.viewport,Ct===0&&(t.setRenderTargetTextures(x,Ht.colorTexture,d.ignoreDepthValues?void 0:Ht.depthStencilTexture),t.setRenderTarget(x))}let ht=w[Ct];ht===void 0&&(ht=new Fn,ht.layers.enable(Ct),ht.viewport=new Ye,w[Ct]=ht),ht.matrix.fromArray(zt.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(zt.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),Ct===0&&(M.matrix.copy(ht.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Q===!0&&M.cameras.push(ht)}const Mt=a.enabledFeatures;if(Mt&&Mt.includes("depth-sensing")){const Ct=f.getDepthInformation(pt[0]);Ct&&Ct.isValid&&Ct.texture&&_.init(t,Ct,a.renderState)}}for(let pt=0;pt<y.length;pt++){const Q=v[pt],Mt=y[pt];Q!==null&&Mt!==void 0&&Mt.update(Q,q,c||o)}mt&&mt(tt,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),g=null}const dt=new xf;dt.setAnimationLoop(ot),this.setAnimationLoop=function(tt){mt=tt},this.dispose=function(){}}}const Yi=new ai,Ib=new Ne;function zb(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,pf(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,x,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,x,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===wn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===wn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),y=x.envMap,v=x.envMapRotation;y&&(m.envMap.value=y,Yi.copy(v),Yi.x*=-1,Yi.y*=-1,Yi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Yi.y*=-1,Yi.z*=-1),m.envMapRotation.value.setFromMatrix4(Ib.makeRotationFromEuler(Yi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===wn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function Fb(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const v=y.program;i.uniformBlockBinding(x,v)}function c(x,y){let v=a[x.id];v===void 0&&(g(x),v=h(x),a[x.id]=v,x.addEventListener("dispose",m));const R=y.program;i.updateUBOMapping(x,R);const S=t.render.frame;s[x.id]!==S&&(d(x),s[x.id]=S)}function h(x){const y=f();x.__bindingPointIndex=y;const v=n.createBuffer(),R=x.__size,S=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,R,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const y=a[x.id],v=x.uniforms,R=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let S=0,b=v.length;S<b;S++){const E=Array.isArray(v[S])?v[S]:[v[S]];for(let w=0,M=E.length;w<M;w++){const P=E[w];if(u(P,S,w,R)===!0){const F=P.__offset,D=Array.isArray(P.value)?P.value:[P.value];let U=0;for(let L=0;L<D.length;L++){const k=D[L],H=_(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,F+U,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,U),U+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,y,v,R){const S=x.value,b=y+"_"+v;if(R[b]===void 0)return typeof S=="number"||typeof S=="boolean"?R[b]=S:R[b]=S.clone(),!0;{const E=R[b];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return R[b]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function g(x){const y=x.uniforms;let v=0;const R=16;for(let b=0,E=y.length;b<E;b++){const w=Array.isArray(y[b])?y[b]:[y[b]];for(let M=0,P=w.length;M<P;M++){const F=w[M],D=Array.isArray(F.value)?F.value:[F.value];for(let U=0,L=D.length;U<L;U++){const k=D[U],H=_(k),N=v%R,z=N%H.boundary,V=N+z;v+=z,V!==0&&R-V<H.storage&&(v+=R-V),F.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=H.storage}}}const S=v%R;return S>0&&(v+=R-S),x.__size=v,x.__cache={},this}function _(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function m(x){const y=x.target;y.removeEventListener("dispose",m);const v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[y.id]),delete a[y.id],delete s[y.id]}function p(){for(const x in a)n.deleteBuffer(a[x]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class Ub{constructor(t={}){const{canvas:e=Ex(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const x=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=_n,this.toneMapping=ki,this.toneMappingExposure=1;const v=this;let R=!1,S=0,b=0,E=null,w=-1,M=null;const P=new Ye,F=new Ye;let D=null;const U=new ne(0);let L=0,k=e.width,H=e.height,N=1,z=null,V=null;const mt=new Ye(0,0,k,H),ot=new Ye(0,0,k,H);let dt=!1;const tt=new Wl;let q=!1,pt=!1;const Q=new Ne,Mt=new Ne,Ct=new G,zt=new Ye,Zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ht=!1;function Ht(){return E===null?N:1}let X=i;function le(A,Y){return e.getContext(A,Y)}try{const A={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Il}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",Et,!1),X===null){const Y="webgl2";if(X=le(Y,A),X===null)throw le(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Wt,Gt,Nt,At,Rt,C,T,W,ct,lt,at,Pt,j,ft,Bt,nt,yt,B,st,ut,Vt,qt,Yt,O;function gt(){Wt=new Gy(X),Wt.init(),qt=new Ab(X,Wt),Gt=new Fy(X,Wt,t,qt),Nt=new wb(X,Wt),Gt.reverseDepthBuffer&&d&&Nt.buffers.depth.setReversed(!0),At=new Wy(X),Rt=new lb,C=new Tb(X,Wt,Nt,Rt,Gt,qt,At),T=new Ny(v),W=new Hy(v),ct=new Jx(X),Yt=new Iy(X,ct),lt=new Vy(X,ct,At,Yt),at=new $y(X,lt,ct,At),st=new Yy(X,Gt,C),nt=new Uy(Rt),Pt=new cb(v,T,W,Wt,Gt,Yt,nt),j=new zb(v,Rt),ft=new db,Bt=new xb(Wt),B=new ky(v,T,W,Nt,at,u,l),yt=new bb(v,at,Gt),O=new Fb(X,At,Gt,Nt),ut=new zy(X,Wt,At),Vt=new Xy(X,Wt,At),At.programs=Pt.programs,v.capabilities=Gt,v.extensions=Wt,v.properties=Rt,v.renderLists=ft,v.shadowMap=yt,v.state=Nt,v.info=At}gt();const K=new kb(v,X);this.xr=K,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const A=Wt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Wt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(A){A!==void 0&&(N=A,this.setSize(k,H,!1))},this.getSize=function(A){return A.set(k,H)},this.setSize=function(A,Y,it=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=A,H=Y,e.width=Math.floor(A*N),e.height=Math.floor(Y*N),it===!0&&(e.style.width=A+"px",e.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(k*N,H*N).floor()},this.setDrawingBufferSize=function(A,Y,it){k=A,H=Y,N=it,e.width=Math.floor(A*it),e.height=Math.floor(Y*it),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(mt)},this.setViewport=function(A,Y,it,et){A.isVector4?mt.set(A.x,A.y,A.z,A.w):mt.set(A,Y,it,et),Nt.viewport(P.copy(mt).multiplyScalar(N).round())},this.getScissor=function(A){return A.copy(ot)},this.setScissor=function(A,Y,it,et){A.isVector4?ot.set(A.x,A.y,A.z,A.w):ot.set(A,Y,it,et),Nt.scissor(F.copy(ot).multiplyScalar(N).round())},this.getScissorTest=function(){return dt},this.setScissorTest=function(A){Nt.setScissorTest(dt=A)},this.setOpaqueSort=function(A){z=A},this.setTransparentSort=function(A){V=A},this.getClearColor=function(A){return A.copy(B.getClearColor())},this.setClearColor=function(){B.setClearColor.apply(B,arguments)},this.getClearAlpha=function(){return B.getClearAlpha()},this.setClearAlpha=function(){B.setClearAlpha.apply(B,arguments)},this.clear=function(A=!0,Y=!0,it=!0){let et=0;if(A){let $=!1;if(E!==null){const wt=E.texture.format;$=wt===Hl||wt===Bl||wt===Ol}if($){const wt=E.texture.type,Lt=wt===vi||wt===sa||wt===Cs||wt===Za||wt===Ul||wt===Nl,jt=B.getClearColor(),Xt=B.getClearAlpha(),It=jt.r,kt=jt.g,Ft=jt.b;Lt?(g[0]=It,g[1]=kt,g[2]=Ft,g[3]=Xt,X.clearBufferuiv(X.COLOR,0,g)):(_[0]=It,_[1]=kt,_[2]=Ft,_[3]=Xt,X.clearBufferiv(X.COLOR,0,_))}else et|=X.COLOR_BUFFER_BIT}Y&&(et|=X.DEPTH_BUFFER_BIT),it&&(et|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),ft.dispose(),Bt.dispose(),Rt.dispose(),T.dispose(),W.dispose(),at.dispose(),Yt.dispose(),O.dispose(),Pt.dispose(),K.dispose(),K.removeEventListener("sessionstart",rn),K.removeEventListener("sessionend",bn),Se.stop()};function rt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=At.autoReset,Y=yt.enabled,it=yt.autoUpdate,et=yt.needsUpdate,$=yt.type;gt(),At.autoReset=A,yt.enabled=Y,yt.autoUpdate=it,yt.needsUpdate=et,yt.type=$}function Et(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Kt(A){const Y=A.target;Y.removeEventListener("dispose",Kt),re(Y)}function re(A){de(A),Rt.remove(A)}function de(A){const Y=Rt.get(A).programs;Y!==void 0&&(Y.forEach(function(it){Pt.releaseProgram(it)}),A.isShaderMaterial&&Pt.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,it,et,$,wt){Y===null&&(Y=Zt);const Lt=$.isMesh&&$.matrixWorld.determinant()<0,jt=we(A,Y,it,et,$);Nt.setMaterial(et,Lt);let Xt=it.index,It=1;if(et.wireframe===!0){if(Xt=lt.getWireframeAttribute(it),Xt===void 0)return;It=2}const kt=it.drawRange,Ft=it.attributes.position;let he=kt.start*It,bt=(kt.start+kt.count)*It;wt!==null&&(he=Math.max(he,wt.start*It),bt=Math.min(bt,(wt.start+wt.count)*It)),Xt!==null?(he=Math.max(he,0),bt=Math.min(bt,Xt.count)):Ft!=null&&(he=Math.max(he,0),bt=Math.min(bt,Ft.count));const _t=bt-he;if(_t<0||_t===1/0)return;Yt.setup($,et,jt,it,Xt);let te,ce=ut;if(Xt!==null&&(te=ct.get(Xt),ce=Vt,ce.setIndex(te)),$.isMesh)et.wireframe===!0?(Nt.setLineWidth(et.wireframeLinewidth*Ht()),ce.setMode(X.LINES)):ce.setMode(X.TRIANGLES);else if($.isLine){let Ut=et.linewidth;Ut===void 0&&(Ut=1),Nt.setLineWidth(Ut*Ht()),$.isLineSegments?ce.setMode(X.LINES):$.isLineLoop?ce.setMode(X.LINE_LOOP):ce.setMode(X.LINE_STRIP)}else $.isPoints?ce.setMode(X.POINTS):$.isSprite&&ce.setMode(X.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)ce.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))ce.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Ut=$._multiDrawStarts,$e=$._multiDrawCounts,oe=$._multiDrawCount,Re=Xt?ct.get(Xt).bytesPerElement:1,pn=Rt.get(et).currentProgram.getUniforms();for(let Ue=0;Ue<oe;Ue++)pn.setValue(X,"_gl_DrawID",Ue),ce.render(Ut[Ue]/Re,$e[Ue])}else if($.isInstancedMesh)ce.renderInstances(he,_t,$.count);else if(it.isInstancedBufferGeometry){const Ut=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,$e=Math.min(it.instanceCount,Ut);ce.renderInstances(he,_t,$e)}else ce.render(he,_t)};function ae(A,Y,it){A.transparent===!0&&A.side===He&&A.forceSinglePass===!1?(A.side=wn,A.needsUpdate=!0,ie(A,Y,it),A.side=Ii,A.needsUpdate=!0,ie(A,Y,it),A.side=He):ie(A,Y,it)}this.compile=function(A,Y,it=null){it===null&&(it=A),p=Bt.get(it),p.init(Y),y.push(p),it.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),A!==it&&A.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const et=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const wt=$.material;if(wt)if(Array.isArray(wt))for(let Lt=0;Lt<wt.length;Lt++){const jt=wt[Lt];ae(jt,it,$),et.add(jt)}else ae(wt,it,$),et.add(wt)}),y.pop(),p=null,et},this.compileAsync=function(A,Y,it=null){const et=this.compile(A,Y,it);return new Promise($=>{function wt(){if(et.forEach(function(Lt){Rt.get(Lt).currentProgram.isReady()&&et.delete(Lt)}),et.size===0){$(A);return}setTimeout(wt,10)}Wt.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let be=null;function ge(A){be&&be(A)}function rn(){Se.stop()}function bn(){Se.start()}const Se=new xf;Se.setAnimationLoop(ge),typeof self<"u"&&Se.setContext(self),this.setAnimationLoop=function(A){be=A,K.setAnimationLoop(A),A===null?Se.stop():Se.start()},K.addEventListener("sessionstart",rn),K.addEventListener("sessionend",bn),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(Y),Y=K.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,Y,E),p=Bt.get(A,y.length),p.init(Y),y.push(p),Mt.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),tt.setFromProjectionMatrix(Mt),pt=this.localClippingEnabled,q=nt.init(this.clippingPlanes,pt),m=ft.get(A,x.length),m.init(),x.push(m),K.enabled===!0&&K.isPresenting===!0){const wt=v.xr.getDepthSensingMesh();wt!==null&&Ee(wt,Y,-1/0,v.sortObjects)}Ee(A,Y,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(z,V),ht=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,ht&&B.addToRenderList(m,A),this.info.render.frame++,q===!0&&nt.beginShadows();const it=p.state.shadowsArray;yt.render(it,A,Y),q===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,$=m.transmissive;if(p.setupLights(),Y.isArrayCamera){const wt=Y.cameras;if($.length>0)for(let Lt=0,jt=wt.length;Lt<jt;Lt++){const Xt=wt[Lt];Dt(et,$,A,Xt)}ht&&B.render(A);for(let Lt=0,jt=wt.length;Lt<jt;Lt++){const Xt=wt[Lt];Z(m,A,Xt,Xt.viewport)}}else $.length>0&&Dt(et,$,A,Y),ht&&B.render(A),Z(m,A,Y);E!==null&&(C.updateMultisampleRenderTarget(E),C.updateRenderTargetMipmap(E)),A.isScene===!0&&A.onAfterRender(v,A,Y),Yt.resetDefaultState(),w=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],q===!0&&nt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Ee(A,Y,it,et){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)it=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||tt.intersectsSprite(A)){et&&zt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Mt);const Lt=at.update(A),jt=A.material;jt.visible&&m.push(A,Lt,jt,it,zt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||tt.intersectsObject(A))){const Lt=at.update(A),jt=A.material;if(et&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),zt.copy(A.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),zt.copy(Lt.boundingSphere.center)),zt.applyMatrix4(A.matrixWorld).applyMatrix4(Mt)),Array.isArray(jt)){const Xt=Lt.groups;for(let It=0,kt=Xt.length;It<kt;It++){const Ft=Xt[It],he=jt[Ft.materialIndex];he&&he.visible&&m.push(A,Lt,he,it,zt.z,Ft)}}else jt.visible&&m.push(A,Lt,jt,it,zt.z,null)}}const wt=A.children;for(let Lt=0,jt=wt.length;Lt<jt;Lt++)Ee(wt[Lt],Y,it,et)}function Z(A,Y,it,et){const $=A.opaque,wt=A.transmissive,Lt=A.transparent;p.setupLightsView(it),q===!0&&nt.setGlobalState(v.clippingPlanes,it),et&&Nt.viewport(P.copy(et)),$.length>0&&Tt($,Y,it),wt.length>0&&Tt(wt,Y,it),Lt.length>0&&Tt(Lt,Y,it),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function Dt(A,Y,it,et){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new oa(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float")?Ns:vi,minFilter:na,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Me.workingColorSpace}));const wt=p.state.transmissionRenderTarget[et.id],Lt=et.viewport||P;wt.setSize(Lt.z,Lt.w);const jt=v.getRenderTarget();v.setRenderTarget(wt),v.getClearColor(U),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),ht&&B.render(it);const Xt=v.toneMapping;v.toneMapping=ki;const It=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),q===!0&&nt.setGlobalState(v.clippingPlanes,et),Tt(A,it,et),C.updateMultisampleRenderTarget(wt),C.updateRenderTargetMipmap(wt),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let Ft=0,he=Y.length;Ft<he;Ft++){const bt=Y[Ft],_t=bt.object,te=bt.geometry,ce=bt.material,Ut=bt.group;if(ce.side===He&&_t.layers.test(et.layers)){const $e=ce.side;ce.side=wn,ce.needsUpdate=!0,Qt(_t,it,et,te,ce,Ut),ce.side=$e,ce.needsUpdate=!0,kt=!0}}kt===!0&&(C.updateMultisampleRenderTarget(wt),C.updateRenderTargetMipmap(wt))}v.setRenderTarget(jt),v.setClearColor(U,L),It!==void 0&&(et.viewport=It),v.toneMapping=Xt}function Tt(A,Y,it){const et=Y.isScene===!0?Y.overrideMaterial:null;for(let $=0,wt=A.length;$<wt;$++){const Lt=A[$],jt=Lt.object,Xt=Lt.geometry,It=et===null?Lt.material:et,kt=Lt.group;jt.layers.test(it.layers)&&Qt(jt,Y,it,Xt,It,kt)}}function Qt(A,Y,it,et,$,wt){A.onBeforeRender(v,Y,it,et,$,wt),A.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(v,Y,it,et,A,wt),$.transparent===!0&&$.side===He&&$.forceSinglePass===!1?($.side=wn,$.needsUpdate=!0,v.renderBufferDirect(it,Y,et,$,A,wt),$.side=Ii,$.needsUpdate=!0,v.renderBufferDirect(it,Y,et,$,A,wt),$.side=He):v.renderBufferDirect(it,Y,et,$,A,wt),A.onAfterRender(v,Y,it,et,$,wt)}function ie(A,Y,it){Y.isScene!==!0&&(Y=Zt);const et=Rt.get(A),$=p.state.lights,wt=p.state.shadowsArray,Lt=$.state.version,jt=Pt.getParameters(A,$.state,wt,Y,it),Xt=Pt.getProgramCacheKey(jt);let It=et.programs;et.environment=A.isMeshStandardMaterial?Y.environment:null,et.fog=Y.fog,et.envMap=(A.isMeshStandardMaterial?W:T).get(A.envMap||et.environment),et.envMapRotation=et.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,It===void 0&&(A.addEventListener("dispose",Kt),It=new Map,et.programs=It);let kt=It.get(Xt);if(kt!==void 0){if(et.currentProgram===kt&&et.lightsStateVersion===Lt)return xe(A,jt),kt}else jt.uniforms=Pt.getUniforms(A),A.onBeforeCompile(jt,v),kt=Pt.acquireProgram(jt,Xt),It.set(Xt,kt),et.uniforms=jt.uniforms;const Ft=et.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ft.clippingPlanes=nt.uniform),xe(A,jt),et.needsLights=qe(A),et.lightsStateVersion=Lt,et.needsLights&&(Ft.ambientLightColor.value=$.state.ambient,Ft.lightProbe.value=$.state.probe,Ft.directionalLights.value=$.state.directional,Ft.directionalLightShadows.value=$.state.directionalShadow,Ft.spotLights.value=$.state.spot,Ft.spotLightShadows.value=$.state.spotShadow,Ft.rectAreaLights.value=$.state.rectArea,Ft.ltc_1.value=$.state.rectAreaLTC1,Ft.ltc_2.value=$.state.rectAreaLTC2,Ft.pointLights.value=$.state.point,Ft.pointLightShadows.value=$.state.pointShadow,Ft.hemisphereLights.value=$.state.hemi,Ft.directionalShadowMap.value=$.state.directionalShadowMap,Ft.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Ft.spotShadowMap.value=$.state.spotShadowMap,Ft.spotLightMatrix.value=$.state.spotLightMatrix,Ft.spotLightMap.value=$.state.spotLightMap,Ft.pointShadowMap.value=$.state.pointShadowMap,Ft.pointShadowMatrix.value=$.state.pointShadowMatrix),et.currentProgram=kt,et.uniformsList=null,kt}function se(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=Fo.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function xe(A,Y){const it=Rt.get(A);it.outputColorSpace=Y.outputColorSpace,it.batching=Y.batching,it.batchingColor=Y.batchingColor,it.instancing=Y.instancing,it.instancingColor=Y.instancingColor,it.instancingMorph=Y.instancingMorph,it.skinning=Y.skinning,it.morphTargets=Y.morphTargets,it.morphNormals=Y.morphNormals,it.morphColors=Y.morphColors,it.morphTargetsCount=Y.morphTargetsCount,it.numClippingPlanes=Y.numClippingPlanes,it.numIntersection=Y.numClipIntersection,it.vertexAlphas=Y.vertexAlphas,it.vertexTangents=Y.vertexTangents,it.toneMapping=Y.toneMapping}function we(A,Y,it,et,$){Y.isScene!==!0&&(Y=Zt),C.resetTextureUnits();const wt=Y.fog,Lt=et.isMeshStandardMaterial?Y.environment:null,jt=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ka,Xt=(et.isMeshStandardMaterial?W:T).get(et.envMap||Lt),It=et.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,kt=!!it.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Ft=!!it.morphAttributes.position,he=!!it.morphAttributes.normal,bt=!!it.morphAttributes.color;let _t=ki;et.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(_t=v.toneMapping);const te=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,ce=te!==void 0?te.length:0,Ut=Rt.get(et),$e=p.state.lights;if(q===!0&&(pt===!0||A!==M)){const gn=A===M&&et.id===w;nt.setState(et,A,gn)}let oe=!1;et.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==$e.state.version||Ut.outputColorSpace!==jt||$.isBatchedMesh&&Ut.batching===!1||!$.isBatchedMesh&&Ut.batching===!0||$.isBatchedMesh&&Ut.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Ut.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Ut.instancing===!1||!$.isInstancedMesh&&Ut.instancing===!0||$.isSkinnedMesh&&Ut.skinning===!1||!$.isSkinnedMesh&&Ut.skinning===!0||$.isInstancedMesh&&Ut.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Ut.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Ut.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Ut.instancingMorph===!1&&$.morphTexture!==null||Ut.envMap!==Xt||et.fog===!0&&Ut.fog!==wt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==nt.numPlanes||Ut.numIntersection!==nt.numIntersection)||Ut.vertexAlphas!==It||Ut.vertexTangents!==kt||Ut.morphTargets!==Ft||Ut.morphNormals!==he||Ut.morphColors!==bt||Ut.toneMapping!==_t||Ut.morphTargetsCount!==ce)&&(oe=!0):(oe=!0,Ut.__version=et.version);let Re=Ut.currentProgram;oe===!0&&(Re=ie(et,Y,$));let pn=!1,Ue=!1,Tn=!1;const Te=Re.getUniforms(),mn=Ut.uniforms;if(Nt.useProgram(Re.program)&&(pn=!0,Ue=!0,Tn=!0),et.id!==w&&(w=et.id,Ue=!0),pn||M!==A){Nt.buffers.depth.getReversed()?(Q.copy(A.projectionMatrix),Ax(Q),Rx(Q),Te.setValue(X,"projectionMatrix",Q)):Te.setValue(X,"projectionMatrix",A.projectionMatrix),Te.setValue(X,"viewMatrix",A.matrixWorldInverse);const qn=Te.map.cameraPosition;qn!==void 0&&qn.setValue(X,Ct.setFromMatrixPosition(A.matrixWorld)),Gt.logarithmicDepthBuffer&&Te.setValue(X,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&Te.setValue(X,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,Ue=!0,Tn=!0)}if($.isSkinnedMesh){Te.setOptional(X,$,"bindMatrix"),Te.setOptional(X,$,"bindMatrixInverse");const gn=$.skeleton;gn&&(gn.boneTexture===null&&gn.computeBoneTexture(),Te.setValue(X,"boneTexture",gn.boneTexture,C))}$.isBatchedMesh&&(Te.setOptional(X,$,"batchingTexture"),Te.setValue(X,"batchingTexture",$._matricesTexture,C),Te.setOptional(X,$,"batchingIdTexture"),Te.setValue(X,"batchingIdTexture",$._indirectTexture,C),Te.setOptional(X,$,"batchingColorTexture"),$._colorsTexture!==null&&Te.setValue(X,"batchingColorTexture",$._colorsTexture,C));const Zn=it.morphAttributes;if((Zn.position!==void 0||Zn.normal!==void 0||Zn.color!==void 0)&&st.update($,it,Re),(Ue||Ut.receiveShadow!==$.receiveShadow)&&(Ut.receiveShadow=$.receiveShadow,Te.setValue(X,"receiveShadow",$.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(mn.envMap.value=Xt,mn.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&Y.environment!==null&&(mn.envMapIntensity.value=Y.environmentIntensity),Ue&&(Te.setValue(X,"toneMappingExposure",v.toneMappingExposure),Ut.needsLights&&Je(mn,Tn),wt&&et.fog===!0&&j.refreshFogUniforms(mn,wt),j.refreshMaterialUniforms(mn,et,N,H,p.state.transmissionRenderTarget[A.id]),Fo.upload(X,se(Ut),mn,C)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Fo.upload(X,se(Ut),mn,C),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&Te.setValue(X,"center",$.center),Te.setValue(X,"modelViewMatrix",$.modelViewMatrix),Te.setValue(X,"normalMatrix",$.normalMatrix),Te.setValue(X,"modelMatrix",$.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const gn=et.uniformsGroups;for(let qn=0,jn=gn.length;qn<jn;qn++){const Fi=gn[qn];O.update(Fi,Re),O.bind(Fi,Re)}}return Re}function Je(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function qe(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(A,Y,it){Rt.get(A.texture).__webglTexture=Y,Rt.get(A.depthTexture).__webglTexture=it;const et=Rt.get(A);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=it===void 0,et.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,Y){const it=Rt.get(A);it.__webglFramebuffer=Y,it.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(A,Y=0,it=0){E=A,S=Y,b=it;let et=!0,$=null,wt=!1,Lt=!1;if(A){const Xt=Rt.get(A);if(Xt.__useDefaultFramebuffer!==void 0)Nt.bindFramebuffer(X.FRAMEBUFFER,null),et=!1;else if(Xt.__webglFramebuffer===void 0)C.setupRenderTarget(A);else if(Xt.__hasExternalTextures)C.rebindTextures(A,Rt.get(A.texture).__webglTexture,Rt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ft=A.depthTexture;if(Xt.__boundDepthTexture!==Ft){if(Ft!==null&&Rt.has(Ft)&&(A.width!==Ft.image.width||A.height!==Ft.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(A)}}const It=A.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(Lt=!0);const kt=Rt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(kt[Y])?$=kt[Y][it]:$=kt[Y],wt=!0):A.samples>0&&C.useMultisampledRTT(A)===!1?$=Rt.get(A).__webglMultisampledFramebuffer:Array.isArray(kt)?$=kt[it]:$=kt,P.copy(A.viewport),F.copy(A.scissor),D=A.scissorTest}else P.copy(mt).multiplyScalar(N).floor(),F.copy(ot).multiplyScalar(N).floor(),D=dt;if(Nt.bindFramebuffer(X.FRAMEBUFFER,$)&&et&&Nt.drawBuffers(A,$),Nt.viewport(P),Nt.scissor(F),Nt.setScissorTest(D),wt){const Xt=Rt.get(A.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Xt.__webglTexture,it)}else if(Lt){const Xt=Rt.get(A.texture),It=Y||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,Xt.__webglTexture,it||0,It)}w=-1},this.readRenderTargetPixels=function(A,Y,it,et,$,wt,Lt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let jt=Rt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(jt=jt[Lt]),jt){Nt.bindFramebuffer(X.FRAMEBUFFER,jt);try{const Xt=A.texture,It=Xt.format,kt=Xt.type;if(!Gt.textureFormatReadable(It)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Gt.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-et&&it>=0&&it<=A.height-$&&X.readPixels(Y,it,et,$,qt.convert(It),qt.convert(kt),wt)}finally{const Xt=E!==null?Rt.get(E).__webglFramebuffer:null;Nt.bindFramebuffer(X.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(A,Y,it,et,$,wt,Lt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let jt=Rt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Lt!==void 0&&(jt=jt[Lt]),jt){const Xt=A.texture,It=Xt.format,kt=Xt.type;if(!Gt.textureFormatReadable(It))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Gt.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=A.width-et&&it>=0&&it<=A.height-$){Nt.bindFramebuffer(X.FRAMEBUFFER,jt);const Ft=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,Ft),X.bufferData(X.PIXEL_PACK_BUFFER,wt.byteLength,X.STREAM_READ),X.readPixels(Y,it,et,$,qt.convert(It),qt.convert(kt),0);const he=E!==null?Rt.get(E).__webglFramebuffer:null;Nt.bindFramebuffer(X.FRAMEBUFFER,he);const bt=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await Tx(X,bt,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,Ft),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,wt),X.deleteBuffer(Ft),X.deleteSync(bt),wt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,Y=null,it=0){A.isTexture!==!0&&(vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1]);const et=Math.pow(2,-it),$=Math.floor(A.image.width*et),wt=Math.floor(A.image.height*et),Lt=Y!==null?Y.x:0,jt=Y!==null?Y.y:0;C.setTexture2D(A,0),X.copyTexSubImage2D(X.TEXTURE_2D,it,0,0,Lt,jt,$,wt),Nt.unbindTexture()},this.copyTextureToTexture=function(A,Y,it=null,et=null,$=0){A.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,A=arguments[1],Y=arguments[2],$=arguments[3]||0,it=null);let wt,Lt,jt,Xt,It,kt,Ft,he,bt;const _t=A.isCompressedTexture?A.mipmaps[$]:A.image;it!==null?(wt=it.max.x-it.min.x,Lt=it.max.y-it.min.y,jt=it.isBox3?it.max.z-it.min.z:1,Xt=it.min.x,It=it.min.y,kt=it.isBox3?it.min.z:0):(wt=_t.width,Lt=_t.height,jt=_t.depth||1,Xt=0,It=0,kt=0),et!==null?(Ft=et.x,he=et.y,bt=et.z):(Ft=0,he=0,bt=0);const te=qt.convert(Y.format),ce=qt.convert(Y.type);let Ut;Y.isData3DTexture?(C.setTexture3D(Y,0),Ut=X.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(C.setTexture2DArray(Y,0),Ut=X.TEXTURE_2D_ARRAY):(C.setTexture2D(Y,0),Ut=X.TEXTURE_2D),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,Y.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,Y.unpackAlignment);const $e=X.getParameter(X.UNPACK_ROW_LENGTH),oe=X.getParameter(X.UNPACK_IMAGE_HEIGHT),Re=X.getParameter(X.UNPACK_SKIP_PIXELS),pn=X.getParameter(X.UNPACK_SKIP_ROWS),Ue=X.getParameter(X.UNPACK_SKIP_IMAGES);X.pixelStorei(X.UNPACK_ROW_LENGTH,_t.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,_t.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,Xt),X.pixelStorei(X.UNPACK_SKIP_ROWS,It),X.pixelStorei(X.UNPACK_SKIP_IMAGES,kt);const Tn=A.isDataArrayTexture||A.isData3DTexture,Te=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const mn=Rt.get(A),Zn=Rt.get(Y),gn=Rt.get(mn.__renderTarget),qn=Rt.get(Zn.__renderTarget);Nt.bindFramebuffer(X.READ_FRAMEBUFFER,gn.__webglFramebuffer),Nt.bindFramebuffer(X.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let jn=0;jn<jt;jn++)Tn&&X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Rt.get(A).__webglTexture,$,kt+jn),A.isDepthTexture?(Te&&X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,Rt.get(Y).__webglTexture,$,bt+jn),X.blitFramebuffer(Xt,It,wt,Lt,Ft,he,wt,Lt,X.DEPTH_BUFFER_BIT,X.NEAREST)):Te?X.copyTexSubImage3D(Ut,$,Ft,he,bt+jn,Xt,It,wt,Lt):X.copyTexSubImage2D(Ut,$,Ft,he,bt+jn,Xt,It,wt,Lt);Nt.bindFramebuffer(X.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else Te?A.isDataTexture||A.isData3DTexture?X.texSubImage3D(Ut,$,Ft,he,bt,wt,Lt,jt,te,ce,_t.data):Y.isCompressedArrayTexture?X.compressedTexSubImage3D(Ut,$,Ft,he,bt,wt,Lt,jt,te,_t.data):X.texSubImage3D(Ut,$,Ft,he,bt,wt,Lt,jt,te,ce,_t):A.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,$,Ft,he,wt,Lt,te,ce,_t.data):A.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,$,Ft,he,_t.width,_t.height,te,_t.data):X.texSubImage2D(X.TEXTURE_2D,$,Ft,he,wt,Lt,te,ce,_t);X.pixelStorei(X.UNPACK_ROW_LENGTH,$e),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,oe),X.pixelStorei(X.UNPACK_SKIP_PIXELS,Re),X.pixelStorei(X.UNPACK_SKIP_ROWS,pn),X.pixelStorei(X.UNPACK_SKIP_IMAGES,Ue),$===0&&Y.generateMipmaps&&X.generateMipmap(Ut),Nt.unbindTexture()},this.copyTextureToTexture3D=function(A,Y,it=null,et=null,$=0){return A.isTexture!==!0&&(vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),it=arguments[0]||null,et=arguments[1]||null,A=arguments[2],Y=arguments[3],$=arguments[4]||0),vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,Y,it,et,$)},this.initRenderTarget=function(A){Rt.get(A).__webglFramebuffer===void 0&&C.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),Nt.unbindTexture()},this.resetState=function(){S=0,b=0,E=null,Nt.reset(),Yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Me._getDrawingBufferColorSpace(t),e.unpackColorSpace=Me._getUnpackColorSpace()}}class Nb extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ai,this.environmentIntensity=1,this.environmentRotation=new ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ob{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ml,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const xn=new G;class jo{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)xn.fromBufferAttribute(this,e),xn.applyMatrix4(t),this.setXYZ(e,xn.x,xn.y,xn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)xn.fromBufferAttribute(this,e),xn.applyNormalMatrix(t),this.setXYZ(e,xn.x,xn.y,xn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)xn.fromBufferAttribute(this,e),xn.transformDirection(t),this.setXYZ(e,xn.x,xn.y,xn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Xn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ce(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Xn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Xn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Xn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Xn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array),s=Ce(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new ln(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new jo(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class xl extends ca{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let La;const ps=new G,Da=new G,ka=new G,Ia=new $t,ms=new $t,wf=new Ne,vo=new G,gs=new G,_o=new G,qd=new $t,rc=new $t,jd=new $t;class Kd extends Xe{constructor(t=new xl){if(super(),this.isSprite=!0,this.type="Sprite",La===void 0){La=new Ke;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Ob(e,5);La.setIndex([0,1,2,0,2,3]),La.setAttribute("position",new jo(i,3,0,!1)),La.setAttribute("uv",new jo(i,2,3,!1))}this.geometry=La,this.material=t,this.center=new $t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Da.setFromMatrixScale(this.matrixWorld),wf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ka.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Da.multiplyScalar(-ka.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;yo(vo.set(-.5,-.5,0),ka,o,Da,a,s),yo(gs.set(.5,-.5,0),ka,o,Da,a,s),yo(_o.set(.5,.5,0),ka,o,Da,a,s),qd.set(0,0),rc.set(1,0),jd.set(1,1);let r=t.ray.intersectTriangle(vo,gs,_o,!1,ps);if(r===null&&(yo(gs.set(-.5,.5,0),ka,o,Da,a,s),rc.set(0,1),r=t.ray.intersectTriangle(vo,_o,gs,!1,ps),r===null))return;const l=t.ray.origin.distanceTo(ps);l<t.near||l>t.far||e.push({distance:l,point:ps.clone(),uv:Ln.getInterpolation(ps,vo,gs,_o,qd,rc,jd,new $t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function yo(n,t,e,i,a,s){Ia.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(ms.x=s*Ia.x-a*Ia.y,ms.y=a*Ia.x+s*Ia.y):ms.copy(Ia),n.copy(t),n.x+=ms.x,n.y+=ms.y,n.applyMatrix4(wf)}class $l extends ca{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ko=new G,Jo=new G,Jd=new Ne,xs=new Vl,Mo=new or,cc=new G,Qd=new G;class Bb extends Xe{constructor(t=new Ke,e=new $l){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Ko.fromBufferAttribute(e,a-1),Jo.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Ko.distanceTo(Jo);t.setAttribute("lineDistance",new Pe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Mo.copy(i.boundingSphere),Mo.applyMatrix4(a),Mo.radius+=s,t.ray.intersectsSphere(Mo)===!1)return;Jd.copy(a).invert(),xs.copy(t.ray).applyMatrix4(Jd);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=c){const p=h.getX(_),x=h.getX(_+1),y=bo(this,t,xs,l,p,x);y&&e.push(y)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(u),p=bo(this,t,xs,l,_,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=c){const p=bo(this,t,xs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=bo(this,t,xs,l,g-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function bo(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Ko.fromBufferAttribute(o,a),Jo.fromBufferAttribute(o,s),e.distanceSqToSegment(Ko,Jo,cc,Qd)>i)return;cc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(cc);if(!(l<t.near||l>t.far))return{distance:l,point:Qd.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const tu=new G,eu=new G;class Ef extends Bb{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)tu.fromBufferAttribute(e,a),eu.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+tu.distanceTo(eu);t.setAttribute("lineDistance",new Pe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class vl extends Mn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class si{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new $t:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,l=new Ne;for(let u=0;u<=t;u++){const g=u/t;a[u]=this.getTangentAt(g,new G)}s[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(cn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,g))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(cn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(a[g],u*g)),o[g].crossVectors(a[g],s[g])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Zl extends si{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new $t){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Hb extends Zl{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ql(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const So=new G,lc=new ql,hc=new ql,dc=new ql;class Gb extends si{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(So.subVectors(a[0],a[1]).add(a[0]),c=So);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(So.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=So),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),u),_=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),lc.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,g,_,m),hc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,g,_,m),dc.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(lc.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),hc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),dc.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(lc.calc(l),hc.calc(l),dc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function nu(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function Vb(n,t){const e=1-n;return e*e*t}function Xb(n,t){return 2*(1-n)*n*t}function Wb(n,t){return n*n*t}function bs(n,t,e,i){return Vb(n,t)+Xb(n,e)+Wb(n,i)}function Yb(n,t){const e=1-n;return e*e*e*t}function $b(n,t){const e=1-n;return 3*e*e*n*t}function Zb(n,t){return 3*(1-n)*n*n*t}function qb(n,t){return n*n*n*t}function Ss(n,t,e,i,a){return Yb(n,t)+$b(n,e)+Zb(n,i)+qb(n,a)}class Tf extends si{constructor(t=new $t,e=new $t,i=new $t,a=new $t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ss(t,a.x,s.x,o.x,r.x),Ss(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class jb extends si{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ss(t,a.x,s.x,o.x,r.x),Ss(t,a.y,s.y,o.y,r.y),Ss(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Af extends si{constructor(t=new $t,e=new $t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new $t){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new $t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kb extends si{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rf extends si{constructor(t=new $t,e=new $t,i=new $t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(bs(t,a.x,s.x,o.x),bs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jb extends si{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(bs(t,a.x,s.x,o.x),bs(t,a.y,s.y,o.y),bs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pf extends si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new $t){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(nu(r,l.x,c.x,h.x,f.x),nu(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new $t().fromArray(a))}return this}}var iu=Object.freeze({__proto__:null,ArcCurve:Hb,CatmullRomCurve3:Gb,CubicBezierCurve:Tf,CubicBezierCurve3:jb,EllipseCurve:Zl,LineCurve:Af,LineCurve3:Kb,QuadraticBezierCurve:Rf,QuadraticBezierCurve3:Jb,SplineCurve:Pf});class Qb extends si{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new iu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new iu[a.type]().fromJSON(a))}return this}}class au extends Qb{constructor(t){super(),this.type="Path",this.currentPoint=new $t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Af(this.currentPoint.clone(),new $t(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Rf(this.currentPoint.clone(),new $t(t,e),new $t(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Tf(this.currentPoint.clone(),new $t(t,e),new $t(i,a),new $t(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Pf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Zl(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class jl extends Ke{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new G,h=new $t;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Pe(o,3)),this.setAttribute("normal",new Pe(r,3)),this.setAttribute("uv",new Pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ds extends Ke{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let g=0;const _=[],m=i/2;let p=0;x(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Pe(f,3)),this.setAttribute("normal",new Pe(d,3)),this.setAttribute("uv",new Pe(u,2));function x(){const v=new G,R=new G;let S=0;const b=(e-t)/i;for(let E=0;E<=s;E++){const w=[],M=E/s,P=M*(e-t)+t;for(let F=0;F<=a;F++){const D=F/a,U=D*l+r,L=Math.sin(U),k=Math.cos(U);R.x=P*L,R.y=-M*i+m,R.z=P*k,f.push(R.x,R.y,R.z),v.set(L,b,k).normalize(),d.push(v.x,v.y,v.z),u.push(D,1-M),w.push(g++)}_.push(w)}for(let E=0;E<a;E++)for(let w=0;w<s;w++){const M=_[w][E],P=_[w+1][E],F=_[w+1][E+1],D=_[w][E+1];(t>0||w!==0)&&(h.push(M,P,D),S+=3),(e>0||w!==s-1)&&(h.push(P,F,D),S+=3)}c.addGroup(p,S,0),p+=S}function y(v){const R=g,S=new $t,b=new G;let E=0;const w=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=a;F++)f.push(0,m*M,0),d.push(0,M,0),u.push(.5,.5),g++;const P=g;for(let F=0;F<=a;F++){const U=F/a*l+r,L=Math.cos(U),k=Math.sin(U);b.x=w*k,b.y=m*M,b.z=w*L,f.push(b.x,b.y,b.z),d.push(0,M,0),S.x=L*.5+.5,S.y=k*.5*M+.5,u.push(S.x,S.y),g++}for(let F=0;F<a;F++){const D=R+F,U=P+F;v===!0?h.push(U,U+1,D):h.push(U+1,U,D),E+=3}c.addGroup(p,E,v===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ds(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Kl extends Ds{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Kl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Jl extends Ke{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Pe(s,3)),this.setAttribute("normal",new Pe(s.slice(),3)),this.setAttribute("uv",new Pe(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const y=new G,v=new G,R=new G;for(let S=0;S<e.length;S+=3)u(e[S+0],y),u(e[S+1],v),u(e[S+2],R),l(y,v,R,x)}function l(x,y,v,R){const S=R+1,b=[];for(let E=0;E<=S;E++){b[E]=[];const w=x.clone().lerp(v,E/S),M=y.clone().lerp(v,E/S),P=S-E;for(let F=0;F<=P;F++)F===0&&E===S?b[E][F]=w:b[E][F]=w.clone().lerp(M,F/P)}for(let E=0;E<S;E++)for(let w=0;w<2*(S-E)-1;w++){const M=Math.floor(w/2);w%2===0?(d(b[E][M+1]),d(b[E+1][M]),d(b[E][M])):(d(b[E][M+1]),d(b[E+1][M+1]),d(b[E+1][M]))}}function c(x){const y=new G;for(let v=0;v<s.length;v+=3)y.x=s[v+0],y.y=s[v+1],y.z=s[v+2],y.normalize().multiplyScalar(x),s[v+0]=y.x,s[v+1]=y.y,s[v+2]=y.z}function h(){const x=new G;for(let y=0;y<s.length;y+=3){x.x=s[y+0],x.y=s[y+1],x.z=s[y+2];const v=m(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(v,1-R)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const y=o[x+0],v=o[x+2],R=o[x+4],S=Math.max(y,v,R),b=Math.min(y,v,R);S>.9&&b<.1&&(y<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){s.push(x.x,x.y,x.z)}function u(x,y){const v=x*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function g(){const x=new G,y=new G,v=new G,R=new G,S=new $t,b=new $t,E=new $t;for(let w=0,M=0;w<s.length;w+=9,M+=6){x.set(s[w+0],s[w+1],s[w+2]),y.set(s[w+3],s[w+4],s[w+5]),v.set(s[w+6],s[w+7],s[w+8]),S.set(o[M+0],o[M+1]),b.set(o[M+2],o[M+3]),E.set(o[M+4],o[M+5]),R.copy(x).add(y).add(v).divideScalar(3);const P=m(R);_(S,M+0,x,P),_(b,M+2,y,P),_(E,M+4,v,P)}}function _(x,y,v,R){R<0&&x.x===1&&(o[y]=x.x-1),v.x===0&&v.z===0&&(o[y]=R/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jl(t.vertices,t.indices,t.radius,t.details)}}const wo=new G,Eo=new G,uc=new G,To=new Ln;class tS extends Ke{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Ga*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=To;if(_.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),To.getNormal(uc),f[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,f[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const y=(x+1)%3,v=f[x],R=f[y],S=To[h[x]],b=To[h[y]],E=`${v}_${R}`,w=`${R}_${v}`;w in d&&d[w]?(uc.dot(d[w].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(b.x,b.y,b.z)),d[w]=null):E in d||(d[E]={index0:c[x],index1:c[y],normal:uc.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];wo.fromBufferAttribute(r,_),Eo.fromBufferAttribute(r,m),u.push(wo.x,wo.y,wo.z),u.push(Eo.x,Eo.y,Eo.z)}this.setAttribute("position",new Pe(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Cf extends au{constructor(t){super(t),this.uuid=ii(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new au().fromJSON(a))}return this}}const eS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Lf(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=oS(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<a;g+=e)f=n[g],d=n[g+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return ks(s,o,e,r,l,u,0),o}};function Lf(n,t,e,i,a){let s,o;if(a===xS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=su(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=su(s,n[s],n[s+1],o);return o&&cr(o,o.next)&&(zs(o),o=o.next),o}function ra(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(cr(e,e.next)||Ve(e.prev,e,e.next)===0)){if(zs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ks(n,t,e,i,a,s,o){if(!n)return;!o&&s&&dS(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?iS(n,i,a,s):nS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),zs(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=aS(ra(n),t,e),ks(n,t,e,i,a,s,2)):o===2&&sS(n,t,e,i,a,s):ks(ra(n),t,e,i,a,s,1);break}}}function nS(n){const t=n.prev,e=n,i=n.next;if(Ve(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&Na(a,r,s,l,o,c,g.x,g.y)&&Ve(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function iS(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ve(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,g=h<f?h<d?h:d:f<d?f:d,_=r>l?r>c?r:c:l>c?l:c,m=h>f?h>d?h:d:f>d?f:d,p=_l(u,g,t,e,i),x=_l(_,m,t,e,i);let y=n.prevZ,v=n.nextZ;for(;y&&y.z>=p&&v&&v.z<=x;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==a&&y!==o&&Na(r,h,l,f,c,d,y.x,y.y)&&Ve(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=u&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&Na(r,h,l,f,c,d,v.x,v.y)&&Ve(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=p;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==a&&y!==o&&Na(r,h,l,f,c,d,y.x,y.y)&&Ve(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=_&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&Na(r,h,l,f,c,d,v.x,v.y)&&Ve(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function aS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!cr(a,s)&&Df(a,i,i.next,s)&&Is(a,s)&&Is(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),zs(i),zs(i.next),i=n=s),i=i.next}while(i!==n);return ra(i)}function sS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&pS(o,r)){let l=kf(o,r);o=ra(o,o.next),l=ra(l,l.next),ks(o,t,e,i,a,s,0),ks(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function oS(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Lf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(fS(c));for(a.sort(rS),s=0;s<a.length;s++)e=cS(a[s],e);return e}function rS(n,t){return n.x-t.x}function cS(n,t){const e=lS(n,t);if(!e)return t;const i=kf(e,n);return ra(i,i.next),ra(e,e.next)}function lS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Na(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Is(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&hS(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function hS(n,t){return Ve(n.prev,n,t.prev)<0&&Ve(t.next,n,n.next)<0}function dS(n,t,e,i){let a=n;do a.z===0&&(a.z=_l(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,uS(a)}function uS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function _l(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function fS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Na(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function pS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!mS(n,t)&&(Is(n,t)&&Is(t,n)&&gS(n,t)&&(Ve(n.prev,n,t.prev)||Ve(n,t.prev,t))||cr(n,t)&&Ve(n.prev,n,n.next)>0&&Ve(t.prev,t,t.next)>0)}function Ve(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function cr(n,t){return n.x===t.x&&n.y===t.y}function Df(n,t,e,i){const a=Ro(Ve(n,t,e)),s=Ro(Ve(n,t,i)),o=Ro(Ve(e,i,n)),r=Ro(Ve(e,i,t));return!!(a!==s&&o!==r||a===0&&Ao(n,e,t)||s===0&&Ao(n,i,t)||o===0&&Ao(e,n,i)||r===0&&Ao(e,t,i))}function Ao(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ro(n){return n>0?1:n<0?-1:0}function mS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Df(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Is(n,t){return Ve(n.prev,n,n.next)<0?Ve(n,t,n.next)>=0&&Ve(n,n.prev,t)>=0:Ve(n,t,n.prev)<0||Ve(n,n.next,t)<0}function gS(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function kf(n,t){const e=new yl(n.i,n.x,n.y),i=new yl(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function su(n,t,e,i){const a=new yl(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function zs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function yl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function xS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class ws{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return ws.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];ou(t),ru(i,t);let o=t.length;e.forEach(ou);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,ru(i,e[l]);const r=eS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function ou(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function ru(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Ql extends Jl{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ql(t.radius,t.detail)}}class Fs extends Ke{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new G,g=new $t;for(let _=0;_<=a;_++){for(let m=0;m<=i;m++){const p=s+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let _=0;_<a;_++){const m=_*(i+1);for(let p=0;p<i;p++){const x=p+m,y=x,v=x+i+1,R=x+i+2,S=x+1;r.push(y,v,S),r.push(v,R,S)}}this.setIndex(r),this.setAttribute("position",new Pe(l,3)),this.setAttribute("normal",new Pe(c,3)),this.setAttribute("uv",new Pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class th extends Ke{constructor(t=new Cf([new $t(0,.5),new $t(-.5,-.5),new $t(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Pe(a,3)),this.setAttribute("normal",new Pe(s,3)),this.setAttribute("uv",new Pe(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;ws.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const x=g[m];ws.isClockWise(x)===!0&&(g[m]=x.reverse())}const _=ws.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const x=g[m];u=u.concat(x)}for(let m=0,p=u.length;m<p;m++){const x=u[m];a.push(x.x,x.y,0),s.push(0,0,1),o.push(x.x,x.y)}for(let m=0,p=_.length;m<p;m++){const x=_[m],y=x[0]+f,v=x[1]+f,R=x[2]+f;i.push(y,v,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return vS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new th(i,t.curveSegments)}}function vS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class lr extends Ke{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let g=0;g<=a;g++){const _=g/a*s,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(_),f.y=(t+e*Math.cos(m))*Math.sin(_),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=a;g++){const _=(a+1)*u+g-1,m=(a+1)*(u-1)+g-1,p=(a+1)*(u-1)+g,x=(a+1)*u+g;o.push(_,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Pe(r,3)),this.setAttribute("normal",new Pe(l,3)),this.setAttribute("uv",new Pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Us extends ca{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=of,this.normalScale=new $t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.combine=zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class If extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ne(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class _S extends If{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ne(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const fc=new Ne,cu=new G,lu=new G;class yS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $t(512,512),this.map=null,this.mapPass=null,this.matrix=new Ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wl,this._frameExtents=new $t(1,1),this._viewportCount=1,this._viewports=[new Ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;cu.setFromMatrixPosition(t.matrixWorld),e.position.copy(cu),lu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lu),e.updateMatrixWorld(),fc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(fc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class MS extends yS{constructor(){super(new vf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bS extends If{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new MS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const hu=new Ne;class SS{constructor(t,e,i=0,a=1/0){this.ray=new Vl(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Xl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return hu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hu),this}intersectObject(t,e=!0,i=[]){return Ml(t,this,i,e),i.sort(du),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Ml(t[a],this,i,e);return i.sort(du),i}}function du(n,t){return n.distance-t.distance}function Ml(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Ml(s[o],t,e,!0)}}class wS extends Ef{constructor(t=10,e=10,i=4473924,a=8947848){i=new ne(i),a=new ne(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const _=d===s?i:a;_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3}const h=new Ke;h.setAttribute("position",new Pe(l,3)),h.setAttribute("color",new Pe(c,3));const f=new $l({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Il}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Il);const ES={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function TS(n,t,e,i){const a=new Fn(n.fov,i,.1,200),s=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0;function g(){const _=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(_),Math.sin(_),Math.cos(m)*Math.cos(_)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return g(),{camera:a,update(_,m,p,x,y=ES){const v=m+.6;if(!l)s.set(_,v,p),l=!0;else{const b=1-Math.exp(-Math.max(n.smoothing,.001)*x);s.x+=(_-s.x)*b,s.y+=(v-s.y)*b,s.z+=(p-s.z)*b}const R=1-Math.exp(-Math.max(t.smoothing,.001)*x);h.distanceScale+=(y.distanceScale-h.distanceScale)*R,h.offsetX+=(y.offsetX-h.offsetX)*R,h.offsetZ+=(y.offsetZ-h.offsetZ)*R,h.pitchDelta+=(y.pitchDelta-h.pitchDelta)*R;const S=1-Math.exp(-Math.max(e.smoothing,.001)*x);if(h.zoom+=(f-h.zoom)*S,g(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=x*52;const b=d*.055;a.position.x+=Math.sin(u*1.7)*b,a.position.y+=Math.sin(u*2.3+1.1)*b*.75,a.position.z+=Math.sin(u*1.3+2.4)*b*.5,d*=Math.exp(-9*x)}else d=0;a.updateMatrixWorld()},snap(_,m,p){s.set(_,m+.6,p),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),g(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(_){a.aspect=_,a.updateProjectionMatrix()},getGroundBasis(){const _=new G().setFromMatrixColumn(a.matrixWorld,0),m=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),p=Math.hypot(_.x,_.z)||1,x=Math.hypot(m.x,m.z)||1;return{rightX:_.x/p,rightZ:_.z/p,forwardX:m.x/x,forwardZ:m.z/x}},addShake(_){!Number.isFinite(_)||_<=0||(d=Math.min(1,d+_))},setZoom(_){f=Number.isFinite(_)&&_>0?_:1},smart(){return{...h}}}}const ia=Math.PI*2,Un=1e-6;function En(n,t,e){return n<t?t:n>e?e:n}function zf(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function AS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Ff(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=AS(n);return i===1?a:e+(a-e)*i}function uu(n){return(1-Math.sin(n))/2}function eh(n,t,e){const i=Math.PI/180,a=En(Number.isFinite(t)?t:100,0,180),s=En(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=En((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function nh(n,t){if(!n.grounded||n.speed<Un)return zf();const e=n.speed/Math.max(n.moveSpeed,Un),i=Math.max(n.legLength,Un),a=n.stride>Un?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Un,h=eh(n.localForward/Math.max(n.speed,Un),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,_=a,m=U=>Math.asin(En(U,-o,o)/i);function p(U,L){const k=Ff(U,t.plantLock),H=uu(U),N=u*d*_*k,z=-m(N),V=L*g>0?1:-1,mt=1+V*t.crossStep*.45,ot=g*V*t.crossStep*_*.4*H,dt=g*f*_*t.sideWeight*mt*k+ot*f,tt=m(dt),q=t.kneeLift*H*s*(.55+.25*d+(V>0?.2*f:0));return{pitchX:z,rollZ:tt,kneeX:q}}const x=(n.phase%ia+ia)%ia,y=p(x,-1),v=p((x+Math.PI)%ia,1),R=Math.cos(x),S=uu(x),b=-t.comSway*s*R*(.6*d+.8*f)-g*t.comSway*s*f*.45,E=t.comBob*S*s,w=g*t.hipLean*s*f*R*.6,M=g*t.hipLean*s*f*(.45+.25*R),P=t.armSwing*s*R*(d*u+.3*f),F=P,D=-P;return{legL:y,legR:v,pelvisX:b,pelvisY:E,pelvisRoll:w,sideLean:M,armL:F,armR:D,strafe:f,backward:u<0?d:0}}function Uf(n){const t=(n%ia+ia)%ia,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Nf(n,t,e){const i=En(e.progress,0,1);if(i>=1||n.speed<Un)return zf();const a=i*i*(3-2*i),s=1-a;return nh({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Of(n,t,e,i){const a=En(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return En(o*a,-1,1)*(e*Math.PI/180)}function Bf(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=En(i,0,1),c=l*l;return e*c+r*(1-c)}function Hf(n,t,e,i,a){const s=Math.max(e,Un),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Un?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Un&&n<=o&&c,resume:!d}}function Gf(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return En(n*En(t,0,2),-i,i)}function Vf(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Xf(n,t,e){const i=En(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function RS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=En(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Wf(n,t,e,i,a){const s=En(n,0,1),o=En(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>Un?e/h:1,d=h>Un?i/h:0,u=Ff(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function yn(n){return n<0?0:n>1?1:n}const Uo=Math.PI*2;function PS(n){return((n+Math.PI)%Uo+Uo)%Uo-Math.PI}function CS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function LS(n,t,e,i,a,s=n.phase){const o=yn(i);if(o<=0)return n;const r=yn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=yn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,g=r<=.5?r*2:(r-.5)*2,_=g*g*(3-2*g),m=r<=.5?_:1-_,p={speed:c,phase:s+Uo*l/2*m,localForward:c*f,localRight:c*(1-f)*h},x=PS(p.phase-n.phase),y=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*y,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function DS(n,t,e){const i=CS(),a=yn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function Yf(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function fu(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Yf(s,a)}function kS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function IS(n,t,e){const i=yn(n);return{gaitScale:1-i*(1-yn(t)),attackLegWeight:yn(e)*i}}function zS(n,t){const e=yn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function FS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return yn(t.minScale+(1-t.minScale)*e)}function US(){return $f()}function $f(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function NS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function OS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?yn(t.forceHitHeight):n.type==="light"?yn(t.hitHeight.light):n.type==="heavy"?yn(t.hitHeight.heavy):n.type==="knock"?yn(t.hitHeight.knock):0}function BS(n,t,e){const i=yn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function Zf(n,t,e){const i=$f(),a=NS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=yn(1-n.timer/n.duration),o=Yf(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=OS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*f,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=a*o,g=BS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function qf(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const $i=1e-6;function Es(n,t,e){return n<t?t:n>e?e:n}function jf(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=$i||s<=$i||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+$i,c=Math.hypot(n.x,n.y,n.z);if(c<=$i)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=Es(u,l,r),_=u>r+$i||u<l-$i,m=Math.atan2(-d,Math.max(f,$i)),p=Es((a*a+g*g-s*s)/(2*a*g),-1,1),x=Es((s*s+g*g-a*a)/(2*s*g),-1,1),y=Math.acos(p),v=Math.acos(x),R=i>=0?1:-1;return{rootPitch:m-R*y,rootRoll:h,jointPitch:R*(y+v),clamped:_,reach:c/r}}function Kf(n,t,e,i){const a=Es(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Es((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Jf(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const ih={active:!1,weight:0,clamped:0,maxError:0};function Qf(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...ih};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const g=a[u],_=i.worldToLocal(l[u].clone()),m={x:_.x-g.root.position.x,y:_.y-g.root.position.y,z:_.z-g.root.position.z},p=jf(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=Kf({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const g=a[u].tip.getWorldPosition(new G);d=Math.max(d,g.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Pn(n,t,e){return n<t?t:n>e?e:n}function HS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ie,d=new Ie;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ie;u.name="lower";const g=new Ie;g.name="upper",d.add(u),d.add(g);const _=[],m=(j,ft,Bt,nt)=>{const yt=new Us({color:nt}),B=new me(new $n(j,ft,Bt),yt);return B.castShadow=!0,B.receiveShadow=!0,_.push(yt),B},p=n.headSize,x=n.legLength,y=n.armLength,v=n.limbThickness,R=n.bodyHeight,S=n.bodyWidth,b=m(S,R,.28,e);b.position.y=R/2,g.add(b);const E=new Ie;E.name="headPivot",E.rotation.order="YXZ",E.position.y=R,g.add(E);const w=m(p,p,p,e);w.position.y=p/2,E.add(w);for(const j of[-1,1]){const ft=m(.06,.07,.02,t.shoe);ft.position.set(j*.09,p/2+.03,p/2+.011),E.add(ft)}const M=(j,ft)=>{const Bt=ft?y:x,nt=new Ie;nt.name=ft?j<0?"shoulderL":"shoulderR":j<0?"hipL":"hipR",ft||(nt.rotation.order="ZYX"),nt.position.set(j*(ft?S/2+v/2:S/2-v/2),ft?R-.04:0,0),(ft?g:u).add(nt);const yt=m(v,Bt/2,v,t.limb);yt.position.y=-Bt/4,nt.add(yt);const B=new Ie;B.name=ft?"elbow":"knee",B.position.y=-Bt/2,nt.add(B);const st=m(v,Bt/2,v,t.limb);if(st.position.y=-Bt/4,B.add(st),!ft){const ut=m(v*1.15,.07,v*1.7,t.shoe);ut.position.set(0,-Bt/2+.035,.045),B.add(ut);const Vt=new Xe;return Vt.name="footTip",Vt.position.y=-Bt/2,B.add(Vt),{root:nt,joint:B,tip:Vt}}return{root:nt,joint:B}},P=M(-1,!1),F=M(1,!1),D=M(-1,!0),U=M(1,!0),L=[P,F].map(j=>({root:j.root,joint:j.joint,tip:j.tip,upperLen:x/2,lowerLen:x/2,bend:1})),k=new tn({color:a.attackArcColor,transparent:!0,opacity:0,side:He,depthWrite:!1}),H=new me(new lr(.62,.042,6,20,Math.PI*1.1),k);H.position.set(0,.78-x,.56),g.add(H);const N=new ne(e),z=new ne(r.flashColor),V=new ne;let mt=null,ot=0,dt=0,tt=0,q=0,pt=0,Q=0,Mt=0,Ct={...ih},zt=-1,Zt=0,ht=0,Ht=0,X=0,le=0,Wt=0,Gt=0,Nt=1,At=0,Rt=0,C="none",T=0,W=!1,ct=-1,lt=!1,at=0,Pt=0;return{group:f,boneAtWorld(j,ft,Bt){const nt=[{node:g,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],yt=new G,B=new G,st=new G(j,ft,Bt),ut=new G;let Vt=null,qt=Number.POSITIVE_INFINITY;for(const Yt of nt){Yt.node.updateWorldMatrix(!0,!1),yt.set(Yt.ax,Yt.ay,Yt.az),B.set(Yt.bx,Yt.by,Yt.bz),Yt.node.localToWorld(yt),Yt.node.localToWorld(B);const O=B.x-yt.x,gt=B.y-yt.y,K=B.z-yt.z,rt=O*O+gt*gt+K*K;let St=rt>1e-8?((st.x-yt.x)*O+(st.y-yt.y)*gt+(st.z-yt.z)*K)/rt:0;St=Math.max(0,Math.min(1,St));const Et=yt.x+O*St,Kt=yt.y+gt*St,re=yt.z+K*St,de=(st.x-Et)**2+(st.y-Kt)**2+(st.z-re)**2;de<qt&&(qt=de,Vt=Yt.node,ut.set(Et,Kt,re))}return Vt?{node:Vt,point:ut.clone()}:null},update(j,ft){f.position.set(j.position.x,j.position.y,j.position.z),f.rotation.y=j.bodyYaw,E.rotation.y=(j.headYaw-j.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,j.mode!==mt&&(mt=j.mode,ot=1),ot=Math.max(0,ot-ft*2.2);const Bt=j.hurt,nt=Zf(Bt,j.bodyYaw,r),yt=nt.flash;V.copy(z).multiplyScalar(yt);for(const It of _)It.emissive.copy(N).multiplyScalar(ot*.5),yt>0&&It.emissive.add(V);d.position.set(0,x,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const B=Math.hypot(j.velocity.x,j.velocity.z),st=Pn(o.knockGaitScale??0,0,1),ut=j.hurt.knockX*st,Vt=j.hurt.knockZ*st,qt=st>0&&Math.hypot(j.hurt.knockX,j.hurt.knockZ)>.001,Yt=j.velocity.x+ut,O=j.velocity.z+Vt,gt=Math.hypot(Yt,O),K=Math.cos(j.bodyYaw),rt=-Math.sin(j.bodyYaw),St=B>1e-6?Pn((j.velocity.x*K+j.velocity.z*rt)/B,-1,1):0,Et=B>1e-6?Pn((j.velocity.x*Math.sin(j.bodyYaw)+j.velocity.z*Math.cos(j.bodyYaw))/B,-1,1):1,Kt=eh(Et,o.backStrafeStartDeg,o.backStrafeFullDeg);C==="settled"&&lt&&at>Pt*1.02+1e-4&&(C="none");let re=1;C==="blend"?(re=Xf(W?ct:T,o.stopYawBlendMode,W),W||(T=Math.min(1,T+ft/Math.max(.01,o.stopYawAfterSec)),(T>=1||o.stopYawBlendMode==="inStop"||lt)&&(C="settled",re=0))):C==="settled"&&(re=Pn(B/Math.max(1e-6,o.stopEnterRatio*s),0,1));const de=Of(St,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ae=Bf(Et,St,de,Kt)*re;At+=(ae-At)*(1-Math.exp(-12*Math.max(0,ft))),u.rotation.y=At;const be=j.bodyYaw+At,ge=Math.sin(be),rn=Math.cos(be),bn=Math.cos(be),Se=-Math.sin(be),Ee=Yt*ge+O*rn,Z=Yt*bn+O*Se,Dt=Math.max(0,o.stopBlendSec||0),Tt=Dt>0&&!qt,Qt=Hf(B,Rt,s,o.stopEnterRatio,o.stopExitRatio);if(!Tt||Qt.resume)zt=-1;else if(zt<0&&Qt.enter){zt=0,Zt=j.gaitPhase,ht=Uf(j.gaitPhase),Ht=B,X=Math.max(j.stride,1e-6),le=Ee,Wt=Z;const It=1/Math.max(1e-6,B);Gt=j.velocity.x*It,Nt=j.velocity.z*It}const ie=Rt;Rt=B;const se=Tt&&zt>=0;se&&(zt=Math.min(1,zt+ft/Dt)),se&&C!=="blend"&&(C="blend",T=0),W=se&&zt<1,ct=zt,lt=Qt.resume,at=B,Pt=ie;const xe=se?{phase:Zt,speed:Ht,moveSpeed:s,localForward:le,localRight:Wt,legLength:n.legLength,stride:X,grounded:!0}:{phase:j.gaitPhase,speed:gt,moveSpeed:s,localForward:Ee,localRight:Z,legLength:n.legLength,stride:j.stride,grounded:!0},we=se?Nf(xe,o,{progress:zt,phase0:Zt,phaseEnd:ht}):nh(xe,o);let Je=0,qe=0,A=0,Y=0;if(se){const It=Vf(j.bodyYaw,Gt,Nt),kt=Wf(zt,Zt,It.forward,It.right,o);kt.leadLeft?(we.legL.pitchX-=kt.leadPitch,we.legL.kneeX+=kt.leadKnee,we.legR.pitchX+=kt.trailPitch):(we.legR.pitchX-=kt.leadPitch,we.legR.kneeX+=kt.leadKnee,we.legL.pitchX+=kt.trailPitch),qe=kt.bodyShift*kt.fwdN,Je=kt.bodyShift*kt.rightN,A=kt.bodyDip,Y=kt.chestPitch}P.root.rotation.x=we.legL.pitchX,F.root.rotation.x=we.legR.pitchX,P.root.rotation.z=we.legL.rollZ,F.root.rotation.z=we.legR.rollZ,P.joint.rotation.x=we.legL.kneeX,F.joint.rotation.x=we.legR.kneeX,D.root.rotation.x=we.armL,U.root.rotation.x=we.armR,D.joint.rotation.x=-.18,U.joint.rotation.x=-.18,d.position.x=we.pelvisX,d.position.y=x+we.pelvisY,d.position.z=0,d.rotation.z=we.pelvisRoll,g.rotation.z=we.sideLean*(nt.intensity>0?.4:1);const it=Jf(d,u),et=se&&h.enabled?{...h,weight:1}:h,$=et.enabled&&et.weight>0?Pn(et.weight,0,1):0;if(d.position.x+=Je,d.position.z+=qe,d.position.y-=A,u.position.y+=A,$<=0&&(u.position.x-=Je,u.position.z-=qe),l){const It=Math.max(.004166666666666667,Math.min(ft,.1)),kt=Math.sin(j.bodyYaw),Ft=Math.cos(j.bodyYaw),he=Pn((j.velocity.x-dt)/It,-60,60),bt=Pn((j.velocity.z-tt)/It,-60,60),_t=he*kt+bt*Ft,te=Ge(j.bodyYaw-q)/It,ce=l.maxForwardDeg*Math.PI/180,Ut=l.maxSideDeg*Math.PI/180,$e=1-Math.exp(-Math.max(0,l.smoothing)*It);pt+=(Pn(_t*l.accelGain,-ce,ce)-pt)*$e,Q+=(Pn(-te*B*l.turnGain,-Ut,Ut)-Q)*$e;const oe=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;Mt+=(Pn(B/Math.max(s,1e-6),0,1)-Mt)*(1-Math.exp(-Math.max(0,oe)*It));const Re=qf({leanForward:pt,leanSide:Q,speedRatio:Mt},l);g.rotation.x+=pt+Y,g.rotation.z+=Q,d.rotation.x+=Re.pelvisPitch,d.rotation.z+=Re.pelvisRoll,d.position.x+=Re.pelvisX,d.position.z+=Re.pelvisZ,d.position.y-=Re.crouch,u.position.y+=Re.crouch*(1-$)}dt=j.velocity.x,tt=j.velocity.z,q=j.bodyYaw,g.rotation.x+=nt.upperPitch,g.rotation.z+=nt.upperRoll,g.rotation.y+=nt.upperYaw;const wt=Pn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Lt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Pn(nt.upperShiftX*wt,-Lt,Lt),g.position.z+=Pn(nt.upperShiftZ*wt,-Lt,Lt),d.position.x+=nt.comX,d.position.z+=nt.comZ-nt.pelvisBack,d.position.y-=nt.drop;const jt=nt.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=nt.pelvisBack*(1-jt),u.position.y+=nt.drop*(1-jt),P.joint.rotation.x+=nt.knee,F.joint.rotation.x+=nt.knee,P.root.rotation.x-=nt.hip,F.root.rotation.x-=nt.hip,D.root.rotation.x+=nt.arm,U.root.rotation.x+=nt.arm*.8,j.attackPhase!=="idle"&&nt.intensity===0){const It=j.attackProgress,kt=It<.34?-1:It<.68?-1+(It-.34)/.34*2:Math.max(0,1-(It-.68)/.32),Ft=Math.max(0,-kt),he=Math.max(0,kt);U.root.rotation.x=-1.7*Ft+1.25*he,U.joint.rotation.x=-(.25+Ft*.45),g.rotation.y=-.28*kt,k.opacity=j.attackPhase==="active"?.85:0,j.attackPhase==="active"&&(H.rotation.z=-1.1+It*3)}else k.opacity=0;const Xt=Gf(At,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=Xt,E.rotation.y=(j.headYaw-j.bodyYaw-Xt+Math.PI*3)%(Math.PI*2)-Math.PI,Ct=Qf({root:f,pelvis:d,lower:u,limbs:L,base:it,cfg:et,grounded:!0,attacking:j.attackPhase!=="idle"})},ik(){return Ct},dispose(){f.traverse(j=>{if(j instanceof me){j.geometry.dispose();const ft=j.material;Array.isArray(ft)?ft.forEach(Bt=>Bt.dispose()):ft.dispose()}})}}}const Zi=.012,qi=.016;function GS(n,t){const e=t.lab,i=new Ie;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,y,v,R=Zi){const S=l(new tn({color:y,transparent:!0,opacity:v,depthWrite:!1,side:He,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),b=new me(x,S);return b.rotation.x=-Math.PI/2,b.position.y=R,b.renderOrder=2,b}function f(x,y){return c(new Fs(Math.max(x,.001),y,72))}function d(x,y,v,R=qi){const b=document.createElement("canvas"),E=b.getContext("2d");if(!E)return new me;const w='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=w,b.width=id.ceilPowerOfTwo(Math.ceil(E.measureText(x).width)+32),b.height=id.ceilPowerOfTwo(96*1.4);const M=b.getContext("2d");if(!M)return new me;M.font=w,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(x,b.width/2,b.height/2);const P=new vl(b);P.colorSpace=_n,s.push(P);const F=b.width/b.height,D=c(new zn(y*F,y)),U=l(new tn({map:P,transparent:!0,depthWrite:!1,side:He,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new me(D,U);return L.rotation.x=-Math.PI/2,L.position.y=R,L.renderOrder=3,L}function u(x,y,v,R,S,b){const E=v-y,w=c(new zn(E,R)),M=h(w,S,b,Zi);M.position.set(E/2+y,Zi,0);const P=new Ie;return P.add(M),P.rotation.y=x-Math.PI/2,P}function g(x,y,v,R,S){const b=new Cf;b.moveTo(0,y*.5),b.lineTo(-v*.5,y*.5-v*.9),b.lineTo(-v*.18,y*.5-v*.9),b.lineTo(-v*.18,-y*.5),b.lineTo(v*.18,-y*.5),b.lineTo(v*.18,y*.5-v*.9),b.lineTo(v*.5,y*.5-v*.9),b.closePath();const E=c(new th(b)),w=h(E,R,S,Zi+.002),M=new Ie;return M.add(w),M.rotation.y=x+Math.PI,M}function _(x){var E;const y=new Ie,v=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((E=v.geometry.parameters)==null?void 0:E.width)??3;y.add(v);const b=h(c(new zn(S*.98,.08)),x.color,.7,qi);return b.position.set(0,qi,t.lab.labelTextHeight*.66),y.add(b),y.position.set(x.labelX,0,x.labelZ),y}const m=new Ie;for(const x of n??[]){const y=new Ie;if(y.position.set(x.x,0,x.z),x.shape==="square"){const v=x.radius,R=h(c(new zn(v*2,v*2)),x.color,e.padOpacity*.09);y.add(R);const S=.07,b=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[E,w,M,P]of b){const F=h(c(new zn(M,P)),x.color,e.padOpacity);F.position.x=E,F.position.z=w,y.add(F)}}else y.add(h(c(new jl(x.radius,72)),x.color,e.padOpacity*.075)),y.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let v=0;v<4;v++){const R=v*Math.PI/4,S=v%2===0;for(const b of[0,Math.PI])y.add(u(R+b,x.radius*.12,x.radius*.94,S?.09:.055,x.color,S?.5:.32))}y.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const v=x.spawnZ-x.z,R=-x.radius+.5,S=v-R,b=h(c(new zn(.06,S)),x.color,.36);b.position.set(0,Zi,(v+R)/2),y.add(b);let E=0;for(let M=v;M>=R-.01;M-=1,E++){const P=E%5===0,F=h(c(new zn(P?2.4:1.3,P?.1:.07)),x.color,P?.72:.42);F.position.set(0,Zi,M),y.add(F);const D=d(String(E),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");D.position.set(1.6,qi,M),y.add(D)}const w=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,P]of w){const F=v-M,D=h(c(new zn(1.9,.09)),"#ffffff",.5);D.position.set(-1.5,Zi,F),y.add(D);const U=d(P,.42,"rgba(220, 236, 250, 0.86)");U.position.set(-3,qi,F),y.add(U)}}else if(x.id==="gait"){y.add(h(f(1.44,1.5),x.color,.5)),y.add(h(f(1.14,1.2),x.color,.22));const v=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,b,E]of R){const M=Math.sin(S),P=Math.cos(S),F=g(S,1.7,.34,E,.75);F.position.set(M*1.7*.5,0,v+P*1.7*.5),y.add(F);const D=d(b,.44,E);D.position.set(M*(1.7+.7),qi,v+P*(1.7+.7)),y.add(D)}}if(m.add(y),e.showLabels){const v=_(x);a.push(v),m.add(v)}}i.add(m);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[y,v,R]of x){const S=d(R,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+y*(p.radius+.7),qi,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const y of a)y.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of s)x.dispose();i.clear()}}}const ah=64,tp=[0,.24,.76,1],VS=[0,1,1,0],ep=[0,.12,.28,.5,.72,.88,1],XS=[0,.16,.5,1,.5,.16,0];function pu(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function sh(n,t,e,i,a=ah,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?ep:tp,c=s==="glow"?XS:VS,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/a,x=(p-.5)*e,y=pu(p,i)*pu(1-p,i),v=Math.sin(x),R=Math.cos(x);for(let S=0;S<h;S++){const b=o+(r-o)*l[S],E=m*h+S;d[E*3]=v*b,d[E*3+1]=0,d[E*3+2]=R*b;const w=y*c[S];u[E*4]=1,u[E*4+1]=1,u[E*4+2]=1,u[E*4+3]=w}}for(let m=0;m<a;m++)for(let p=0;p<h-1;p++){const x=m*h+p,y=x+h;g.push(x,y,x+1,x+1,y,y+1)}const _=new Ke;return _.setAttribute("position",new ln(d,3)),_.setAttribute("color",new ln(u,4)),_.setIndex(g),_.computeBoundingSphere(),_}function pc(n){const t=new tn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:He,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=sh(n.radius,n.thickness*f,h,n.edgeFade,ah,n.profile??"band");if(e.set(d,g),e.size>64){for(const[_,m]of e)if(_!==d&&m!==i){m.dispose(),e.delete(_);break}}return g};i=a(n.arcRad,1);const s=new me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=a(l,g),s.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function mu(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function WS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:g,level:r}}function YS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function $S(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const g=u/e,_=t+(1-t)*g,m=c*a+u;s[m*3]=f*_,s[m*3+1]=0,s[m*3+2]=d*_;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new Ke;return l.setAttribute("position",new ln(s,3)),l.setAttribute("color",new ln(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function gu(n){const t=n.segments??ah,e=n.profile??"band",a=((e==="glow"?ep.length:tp.length)-1)*6,s=sh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:He,vertexColors:!0,toneMapped:!1}),r=new me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const g=Math.min(1,Math.max(0,c)),_=Math.round(g*t),m=g>.001?Math.max(1,_)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),l=_,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function xu(n){const t=new Ie,e=$S(48),i=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:He,vertexColors:!0,toneMapped:!1}),a=new me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=sh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new tn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:He,vertexColors:!0,toneMapped:!1}),l=new me(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,g){const _=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(g*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function vu(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function ZS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function qS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function jS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function KS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function JS(n,t,e){return n?t:e}function np(n){return{x:0,y:0,z:1}}function QS(n){return Math.asin(np().y)}function t1(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const bl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},e1=1e-6;function Cn(n,t,e){return n<t?t:n>e?e:n}function mc(n,t){const e=Math.max(.2,n);return Cn(Math.pow(e,-t),.5,2)}function n1(n,t){if(!t.enabled)return{...bl};const e=Cn(n.swing,-1,1),i=Cn(n.charge,0,1),a=Cn(n.impact,0,1),s=Cn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Cn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const g=1-Cn(t.impactSquash,0,.6)*a;u*=g;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Cn(t.impactSquash,0,.6)*a*.6),x=Cn(t.torsoGain,0,1),y=1+(u-1)*x;return u=Cn(u,.6,1.6),{arm:u,leg:Cn(p,.6,1.4),torso:Cn(y,.7,1.4),girthArm:mc(u,t.volumeExp),girthLeg:mc(p,t.volumeExp),girthTorso:mc(y,t.volumeExp)}}function i1(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function a1(n,t,e){const i=n*Math.exp(-Math.max(e1,e)*Math.max(0,t));return i<.001?0:Cn(i,0,1)}const _u=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Ts(n,t,e){return n<t?t:n>e?e:n}function Fe(n,t,e){return n+(t-n)*e}function s1(n){return n?typeof n=="string"?{clip:n}:n:null}function o1(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function r1(n,t){const e=n%3*2,i=_u[e],a=_u[e+1];return{...o1(),bodyYaw:Fe(i.yaw,a.yaw,t),bodyPitch:Fe(i.pitch,a.pitch,t),bodyRoll:Fe(i.roll,a.roll,t),pelvisX:Fe(i.px,a.px,t),pelvisZ:Fe(i.pz,a.pz,t),armPitch:Fe(i.ap,a.ap,t),armYaw:Fe(i.ay,a.ay,t),armRoll:Fe(i.ar,a.ar,t),elbow:Fe(i.el,a.el,t),bladePitch:Fe(i.blade,a.blade,t)}}function c1(n,t,e,i,a=0){var w,M,P;const s=((w=i.combo)==null?void 0:w[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=s1(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=Ts(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,g=Ts((e+1)/2,0,1),_=c&&c.keys.length>0?l0(c,g):r1(r,g),m=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",x=n==="dual-swords",y=c&&Oi(c,"bladeTwistOff")?_.bladeTwistOff:x?_.bladeTwist:0,v=c&&Oi(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,R={yaw:_.bodyYaw*u,rootYaw:_.rootYaw*u,spinYaw:h0(c,Ts(a,0,1)),pitch:_.bodyPitch*u,roll:_.bodyRoll*u,pelvisZ:_.pelvisZ*u,pelvisX:_.pelvisX*u,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&Oi(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:y,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:m,kind:p,strike:g},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},b=c?Oi(c,"armLPitch")||Oi(c,"armLYaw")||Oi(c,"armLRoll")||Oi(c,"elbowL"):!1,E=b?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return m==="L"?(R.armL=S,R.armR=n==="greatsword"?null:E):(R.armR=S,(n==="greatsword"||n==="dual-swords"||b)&&(R.armL=E)),R}function l1(n,t,e){const i=Ts(e,0,1),a=(s,o)=>s?o?{pitch:Fe(s.pitch,o.pitch,i),yaw:Fe(s.yaw,o.yaw,i),roll:Fe(s.roll,o.roll,i),elbow:Fe(s.elbow,o.elbow,i)}:null:o;return{yaw:Fe(n.yaw,t.yaw,i),rootYaw:Fe(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Fe(n.pitch,t.pitch,i),roll:Fe(n.roll,t.roll,i),pelvisZ:Fe(n.pelvisZ,t.pelvisZ,i),pelvisX:Fe(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Fe(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Fe(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Fe(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Fe(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Fe(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Fe(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Fe(n.strike,t.strike,i)}}function yu(n){const t=Ts(n,0,1);return t*t*(3-2*t)}function ve(n,t,e){return n<t?t:n>e?e:n}const ui=1e-6;function Be(n,t,e,i){const a=new me(new $n(n,t,e),new Us({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function We(){return new Ie}function No(n,t,e){const i=We(),a=Be(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Be(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Be(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Be(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Be(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function h1(n){const t=No(.72,.15,n),e=Be(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function d1(n){const t=We(),e=Be(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Be(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function u1(n){const t=We(),e=Be(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Be(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ne(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function f1(n){const t=We();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Be(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Be(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function p1(n){const t=We(),e=Be(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Be(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function m1(n,t,e,i,a,s,o,r,l,c,h,f){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},g=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},_=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},m=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},p=We(),x=We();x.name="pelvis",x.position.y=n.legLength,p.add(x);const y=We();y.name="lower";const v=We();v.name="upper",x.add(y),x.add(v);const R=n.headSize,S=n.legLength,b=n.armLength,E=n.limbThickness,w=n.bodyHeight,M=n.bodyWidth,P=Be(M,w,.28,t.body);P.position.y=w/2,v.add(P);const F=We();F.name="headPivot",F.rotation.order="YXZ",F.position.y=i.headPivotHeight,v.add(F);const D=Be(R,R,R,t.head);D.position.y=R/2,F.add(D);const U=new Us({color:"#1b2733"});for(const I of[-1,1]){const J=new me(new $n(.06,.07,.02),U);J.position.set(I*.09,R/2+.03,R/2+.011),F.add(J)}const L=I=>{const J=We();J.name=I<0?"hipL":"hipR",J.rotation.order="ZYX",J.position.set(I*(M/2-E/2),0,0),y.add(J);const xt=Be(E,S/2,E,t.limb);xt.position.y=-S/4,J.add(xt);const vt=We();vt.name="knee",vt.position.y=-S/2,J.add(vt);const ee=Be(E,S/2,E,t.limb);ee.position.y=-S/4,vt.add(ee);const Jt=Be(E*1.15,.07,E*1.7,t.shoe);Jt.position.set(0,-S/2+.035,.045),vt.add(Jt);const _e=new Xe;_e.name="footTip",_e.position.y=-S/2,vt.add(_e);const Le=We();return{root:J,joint:vt,hand:Le,wrist:Le,tip:_e,upperMesh:xt,lowerMesh:ee,segLen:S/2}},k=I=>{const J=We();J.name=I<0?"shoulderL":"shoulderR",J.rotation.order="YXZ",J.position.set(I*(M/2+E/2),w-.04,0),v.add(J);const xt=Be(E,b/2,E,t.limb);xt.position.y=-b/4,J.add(xt);const vt=We();vt.name="elbow",vt.position.y=-b/2,J.add(vt);const ee=Be(E,b/2,E,t.limb);ee.position.y=-b/4,vt.add(ee);const Jt=We();Jt.name=I<0?"handL":"handR",Jt.position.y=-b/2,vt.add(Jt);const _e=Be(E*1.1,.09,E*1.1,t.head);_e.position.y=.045,Jt.add(_e);const Le=We();return Le.name=I<0?"wristL":"wristR",Jt.add(Le),{root:J,joint:vt,hand:Jt,wrist:Le,upperMesh:xt,lowerMesh:ee,segLen:b/2}},H=L(-1),N=L(1),z=k(-1),V=k(1),mt=[H,N].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:S/2,lowerLen:S/2,bend:1})),ot=We(),dt=We();ot.name="mountR",dt.name="mountL";const tt=We(),q=We();tt.name="gripR",q.name="gripL",V.wrist.add(ot),z.wrist.add(dt),ot.add(tt),dt.add(q);const pt=u1(t),Q=f1(t),Mt=p1(t),Ct={"sword-shield":{right:No(.42,.075,t),left:d1(t)},"dual-swords":{right:No(.42,.075,t),left:No(.42,.075,t)},greatsword:{right:h1(t),left:Be(.12,.2,.12,t.wood)},staff:{right:pt.g,left:We(),orb:pt.orb},bow:{right:Mt,left:Q.g,arrow:Mt,drawString:Q.drawString}};for(const I of Object.keys(Ct))tt.add(Ct[I].right),q.add(Ct[I].left),Ct[I].right.visible=!1,Ct[I].left.visible=!1;function zt(I,J,xt){const vt=new Xe;vt.name="bladeBase",vt.position.y=J,I.add(vt);const ee=new Xe;ee.name="bladeTip",ee.position.y=xt,I.add(ee)}zt(Ct["sword-shield"].right,.44,.55),zt(Ct["dual-swords"].right,.44,.55),zt(Ct["dual-swords"].left,.44,.55),zt(Ct.greatsword.right,.74,.88),zt(Ct.staff.right,.78,.92);let Zt=null,ht=0,Ht=0,X=0,le=0,Wt=0,Gt=0,Nt=US(),At={...ih},Rt=0,C=0,T=0,W=-1,ct=0,lt=0,at=0,Pt=0,j=0,ft=0,Bt=0,nt=1,yt=0,B=0,st=0,ut=!1,Vt=0,qt=0,Yt=0,O=0,gt="none",K=0,rt=1,St=!1,Et=-1,Kt=!1,re=0,de=0,ae=0,be={...bl},ge=0,rn=0,bn={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},Se=NaN,Ee=0,Z=0,Dt=0,Tt=NaN,Qt=NaN,ie=-1,se=null,xe=null,we=0,Je=1,qe=null,A={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Y=null,it=null,et=null,$=null,wt=null,Lt=null,jt="R",Xt=0,It=0,kt=0,Ft=0,he=1,bt={speed:0,phase:0},_t={lp:0,lr:0,rp:0,rr:0},te=0,ce=0,Ut=!0,$e=0,oe="none",Re=0,pn=0,Ue=0,Tn=.3,Te=0;function mn(I){const J=Math.PI/180,xt=s;let vt=0,ee=0,Jt=0,_e=0;I==="sword-shield"?(vt=xt.swordPitchDeg*J,ee=-xt.swordYawDeg*J,Jt=xt.shieldPitchDeg*J):I==="dual-swords"?(vt=xt.swordPitchDeg*J,ee=-xt.swordYawDeg*J,Jt=xt.swordPitchDeg*J,_e=xt.swordYawDeg*J):I==="greatsword"?(vt=xt.greatswordPitchDeg*J,ee=-xt.greatswordYawDeg*J,Jt=xt.greatswordPitchDeg*J,_e=xt.greatswordYawDeg*J):I==="staff"?vt=xt.staffPitchDeg*J:Jt=xt.bowPitchDeg*J,ot.rotation.set(vt,0,ee),dt.rotation.set(Jt,0,_e),ot.position.x=I==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Zn(I){if(I!==Zt){Zt=I;for(const J of Object.keys(Ct))Ct[J].right.visible=J===I,Ct[J].left.visible=J===I;mn(I),Q.drawString.position.z=-.06,Mt.position.z=0,pt.orb.scale.setScalar(1),v.rotation.y=0}}Zn("sword-shield");const gn=[];p.traverse(I=>{I instanceof me&&I.material instanceof Us&&gn.push(I.material)});const qn=new ne(r.flashColor);function jn(I,J){const xt=Zf(I,J,r);Nt=xt,v.rotation.x+=xt.upperPitch,v.rotation.z+=xt.upperRoll,v.rotation.y+=xt.upperYaw;const vt=ve(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ee=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;v.position.x+=ve(xt.upperShiftX*vt,-ee,ee),v.position.z+=ve(xt.upperShiftZ*vt,-ee,ee),x.position.x+=xt.comX,x.position.z+=xt.comZ-xt.pelvisBack,x.position.y-=xt.drop;const Jt=xt.legacy?0:ve(r.lowerScale,0,1);y.position.z+=xt.pelvisBack*(1-Jt),y.position.y+=xt.drop*(1-Jt),H.joint.rotation.x+=xt.knee,N.joint.rotation.x+=xt.knee,H.root.rotation.x-=xt.hip,N.root.rotation.x-=xt.hip,z.root.rotation.x+=xt.arm,V.root.rotation.x+=xt.arm*.8;for(const _e of gn)_e.emissive.copy(qn).multiplyScalar(xt.flash)}function Fi(I){return I<.22?-1:I<.42?-1+(I-.22)/.2*2:I<.5?1:Math.max(0,1-(I-.5)/.5)}function ip(I){for(const J of[z,V])J.upperMesh.scale.set(I.girthArm,I.arm,I.girthArm),J.upperMesh.position.y=-J.segLen/2*I.arm,J.joint.position.y=-J.segLen*I.arm,J.lowerMesh.scale.set(I.girthArm,I.arm,I.girthArm),J.lowerMesh.position.y=-J.segLen/2*I.arm,J.hand.position.y=-J.segLen*I.arm;for(const J of[H,N])J.upperMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),J.upperMesh.position.y=-J.segLen/2*I.leg,J.joint.position.y=-J.segLen*I.leg,J.lowerMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),J.lowerMesh.position.y=-J.segLen/2*I.leg,J.tip.position.y=-J.segLen*I.leg;P.scale.set(I.girthTorso,I.torso,I.girthTorso),P.position.y=w/2*I.torso}function ap(I,J){const xt=s.twoHandGripY??-.16,vt=Math.max(1,s.twoHandMaxStretch??1.25),ee=b*vt*.99,Jt=z.root.position.x,_e=z.root.position.y,Le=z.root.position.z,De=z.root.rotation.y,Qe=Math.cos(De),ze=Math.sin(De),Oe=hn=>{const is=ot.localToWorld(new G(0,hn,0)),as=v.worldToLocal(is),Gs=as.x-Jt,pr=as.y-_e,ua=as.z-Le,yi={x:Gs*Qe-ua*ze,y:pr,z:Gs*ze+ua*Qe};return{t:yi,dist:Math.hypot(yi.x,yi.y,yi.z)}};let Ze=xt,an=Oe(Ze);if(!Number.isFinite(an.dist)||an.dist<=ui)return;for(let hn=0;hn<18&&an.dist>ee;hn++)if(Ze*=.78,an=Oe(Ze),!Number.isFinite(an.dist)||an.dist<=ui)return;Number.isFinite(Se)||(Se=Ze);const Dn=Math.max(0,s.twoHandSlideRate??9);Se+=(Ze-Se)*(1-Math.exp(-Dn*J));const kn=Oe(Se),_i=kn.t,la=kn.dist,Hs=la/Math.max(ui,b),ha=ve(Hs,1,vt),ts=Math.max(1,s.twoHandGripStart??1.02),dr=Math.max(ts+.001,vt),ur=ve(s.twoHandMinGrip??1,0,1),es=ve((Hs-ts)/(dr-ts),0,1),ns=1-es*es*(3-2*es)*(1-ur),oi=b/2*ha,fr=jf(_i,oi,oi,-1),da=Kf({rootPitch:z.root.rotation.x,rootRoll:z.root.rotation.z,jointPitch:z.joint.rotation.x},fr,ve(I*ns,0,1),Math.PI);z.root.rotation.x=da.rootPitch,z.root.rotation.z=da.rootRoll,z.joint.rotation.x=Math.min(da.jointPitch,-.06);const Ui=1/Math.sqrt(ha);z.upperMesh.scale.set(Ui,ha,Ui),z.upperMesh.position.y=-oi/2,z.joint.position.y=-oi,z.lowerMesh.scale.set(Ui,ha,Ui),z.lowerMesh.position.y=-oi/2,z.hand.position.y=-oi,bn={active:!0,dist:la,gy:Se,pitch:da.rootPitch,joint:z.joint.rotation.x,grip:ns}}function sp(I,J){if(!u.enabled){Ee=0,Z=0,V.wrist.rotation.set(0,0,0),Tt=V.root.rotation.x,Qt=v.rotation.y;return}const xt=V.root.rotation.x,vt=v.rotation.y;if(J!==ie){ie=J,Tt=xt,Qt=vt,V.wrist.rotation.set(Ee,0,Z);return}if(!Number.isFinite(Tt)||I<=1e-5){Tt=xt,Qt=vt,V.wrist.rotation.set(Ee,0,Z);return}const ee=(xt-Tt)/I,Jt=Ge(vt-Qt)/I;Tt=xt,Qt=vt;const _e=Math.max(0,u.maxAngle),Le=Math.max(0,u.maxTwist),De=.15+.85*ve(It,0,1),ze=-ve(Dt,0,1.4)*Math.max(0,u.runDrag),Oe=ve(-ee*u.lag*De+ze,-_e,_e),Ze=ve(Jt*u.twistLag*De,-Le,Le),an=1-Math.exp(-Math.max(0,u.rate)*I);Ee+=(Oe-Ee)*an,Z+=(Ze-Z)*an,V.wrist.rotation.set(Ee,0,Z)}function op(I){const J=Math.PI/180;return I==="greatsword"?s.greatswordPitchDeg*J:I==="staff"?s.staffPitchDeg*J:I==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function oh(I){const J=Math.PI/180;return I==="sword-shield"?s.shieldPitchDeg*J:I==="greatsword"?s.greatswordPitchDeg*J:I==="bow"?s.bowPitchDeg*J:s.swordPitchDeg*J}function rp(I){const J=Math.PI/180;return I==="sword-shield"||I==="dual-swords"?(s.swordCantDeg??0)*J:I==="greatsword"?(s.greatswordCantDeg??0)*J:0}function cp(I,J){const xt=I.weapon;if(xt==="staff"||xt==="bow")return;const vt=jt==="R",ee=vt?V:z,Jt=vt?ot:dt,_e=vt?z:V,Le=vt?dt:ot,De=xt==="greatsword"&&vt?Gt:0,Qe=Y;if(Qe===null)Jt.rotation.x=op(xt)+De;else{const _i=J+ee.root.rotation.x+ee.joint.rotation.x;Jt.rotation.x=Math.PI/2-Qe-_i}const ze=it;if(ze===null)Le.rotation.x=oh(xt);else{const _i=xt==="sword-shield"?oh(xt):Math.PI/2,la=J+_e.root.rotation.x+_e.joint.rotation.x;Le.rotation.x=_i-ze-la}const Oe=rp(xt),Ze=wt??0,an=Lt??0,Dn=et??0,kn=$??0;vt?(tt.rotation.z=-Oe+Ze,tt.rotation.y=Dn,q.rotation.z=Oe+an,q.rotation.y=kn):(q.rotation.z=Oe+Ze,q.rotation.y=Dn,tt.rotation.z=-Oe+an,tt.rotation.y=kn)}function rh(I){Y=I.bladePitch,it=I.bladePitchOff,et=I.bladeTwist,$=I.bladeTwistOff,wt=I.bladeYaw,Lt=I.bladeYawOff,jt=I.lead,Xt=I.rootYaw+I.spinYaw,p.rotation.y=Xt,v.rotation.y+=I.yaw,v.rotation.x+=I.pitch,v.rotation.z+=I.roll,x.position.z+=I.pelvisZ,x.position.x+=I.pelvisX,I.armR&&(V.root.rotation.x=I.armR.pitch,V.root.rotation.y=I.armR.yaw,V.root.rotation.z=I.armR.roll,V.joint.rotation.x=I.armR.elbow),I.armL&&(z.root.rotation.x=I.armL.pitch,z.root.rotation.y=I.armL.yaw,z.root.rotation.z=I.armL.roll,z.joint.rotation.x=I.armL.elbow)}function ch(I,J){const xt=qe??Fi(I.attackProgress),vt=c1(I.weapon,I.comboIndex,xt,m,I.attackProgress);I.comboIndex!==we&&(xe=se,Je=0,we=I.comboIndex);const ee=Math.max(.008,m.segBlend);Je=Math.min(1,Je+J/ee);const Jt=xe&&Je<1?l1(xe,vt,yu(Je)):vt;return se=Jt,Jt}function lp(I,J){const xt=M/2+E/2,vt=w-.04;if(!m.enabled){z.root.position.set(-xt,vt,0),V.root.position.set(xt,vt,0),A={lx:-xt,ly:vt,lz:0,rx:xt,ry:vt,rz:0};return}const ee=Math.max(0,m.shoulderLift),Jt=Math.max(0,m.shoulderPush),_e=I&&J==="greatsword"?Math.max(0,m.shoulderIn):0,Le=kn=>ee*ve((-kn-.5)/1.45,0,1),De=kn=>Jt*ve((-kn-.2)/1.9,0,1),Qe=-xt+_e,ze=vt+Le(z.root.rotation.x),Oe=De(z.root.rotation.x),Ze=xt-_e,an=vt+Le(V.root.rotation.x),Dn=De(V.root.rotation.x);z.root.position.set(Qe,ze,Oe),V.root.position.set(Ze,an,Dn),A={lx:Qe,ly:ze,lz:Oe,rx:Ze,ry:an,rz:Dn}}function hp(I){if(I.phase==="idle"||I.charging)return;const J=I.attackProgress,xt=Fi(J),vt=Math.max(0,xt),ee=I.comboIndex%2===0?1:-1,Jt=l.stride,_e=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,Le=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,De=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,Qe=I.weapon==="greatsword"?ve(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;x.position.z+=_e*vt*Qe,x.position.x+=ee*Le*vt*Qe,x.position.y-=De*Math.sin(Math.PI*J)*Qe}let lh=null;function dp(){lh={upperX:v.rotation.x,upperY:v.rotation.y,upperZ:v.rotation.z,upperPX:v.position.x,upperPZ:v.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:z.root.rotation.x,lry:z.root.rotation.y,lrz:z.root.rotation.z,lj:z.joint.rotation.x,rrx:V.root.rotation.x,rry:V.root.rotation.y,rrz:V.root.rotation.z,rj:V.joint.rotation.x,rootY:p.rotation.y}}function up(I){const J=lh;if(!J)return;const xt=yu(ve(I,0,1));if(xt>=1)return;const vt=(ee,Jt)=>ee+(Jt-ee)*xt;v.rotation.x=vt(J.upperX,v.rotation.x),v.rotation.y=vt(J.upperY,v.rotation.y),v.rotation.z=vt(J.upperZ,v.rotation.z),v.position.x=vt(J.upperPX,v.position.x),v.position.z=vt(J.upperPZ,v.position.z),x.position.x=vt(J.pelvisX,x.position.x),x.position.y=vt(J.pelvisY,x.position.y),x.position.z=vt(J.pelvisZ,x.position.z),x.rotation.x=vt(J.pelvisRX,x.rotation.x),x.rotation.z=vt(J.pelvisRZ,x.rotation.z),z.root.rotation.x=vt(J.lrx,z.root.rotation.x),z.root.rotation.y=vt(J.lry,z.root.rotation.y),z.root.rotation.z=vt(J.lrz,z.root.rotation.z),z.joint.rotation.x=vt(J.lj,z.joint.rotation.x),V.root.rotation.x=vt(J.rrx,V.root.rotation.x),V.root.rotation.y=vt(J.rry,V.root.rotation.y),V.root.rotation.z=vt(J.rrz,V.root.rotation.z),V.joint.rotation.x=vt(J.rj,V.joint.rotation.x),p.rotation.y=vt(J.rootY,p.rotation.y),Xt=p.rotation.y}function fp(I,J){if(Q.drawString.position.z=-.06,Mt.position.z=0,pt.orb.scale.setScalar(1),v.rotation.y=0,I.charging&&I.weapon==="bow"){const Jt=I.charge;z.root.rotation.x=-1.25,z.joint.rotation.x=-.15,V.root.rotation.x=.35+Jt*.3,V.joint.rotation.x=-1.15,Q.drawString.position.z=-.06-Jt*.22,Mt.position.z=-Jt*.3,v.rotation.y=-.22;return}if(I.phase==="idle"&&kt<=.001){xe=null,se=null,we=0,Je=1,Y=null,it=null,et=null,$=null,wt=null,Lt=null,Se=NaN,I.weapon==="greatsword"&&(ot.position.x=-Math.max(0,s.twoHandInsetX??0));return}const xt=Fi(I.attackProgress),vt=Math.max(0,-xt),ee=Math.max(0,xt);if(I.weapon==="bow")z.root.rotation.x=-1.2,z.joint.rotation.x=-.15,V.root.rotation.x=.9-ee*.8,V.joint.rotation.x=-.3;else if(I.weapon==="greatsword")if(m.enabled)rh(ch(I,J));else{const Jt=-1.6*vt+1.25*ee,_e=ve(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);V.root.rotation.x=Jt,V.joint.rotation.x=-(.25+vt*.4),z.root.rotation.x=Jt+.06,z.joint.rotation.x=-(.32+vt*.4),z.root.rotation.z=.42,V.root.rotation.z=0;const Le=-Math.sin(V.root.rotation.x);V.root.rotation.y=-.72*Math.tanh(Le*4),v.rotation.y=-.2*xt*_e}else if(m.enabled)rh(ch(I,J));else{const Jt=I.comboIndex;if(Jt===1)V.root.rotation.x=-1.7*vt+1.1*ee,V.joint.rotation.x=-(.2+vt*.5),z.root.rotation.x=.1,v.rotation.y=-.18*xt;else if(Jt===2)z.root.rotation.x=-1.5*vt+1*ee,z.joint.rotation.x=-(.2+vt*.5),V.root.rotation.x=.2,v.rotation.y=.45*-xt;else{const _e=-1.9*vt+1.2*ee;z.root.rotation.x=_e,V.root.rotation.x=_e,z.joint.rotation.x=-(.15+vt*.4),V.joint.rotation.x=-(.15+vt*.4),v.rotation.y=-.3*xt}}if(I.weapon==="greatsword"){const Jt=ve((-V.root.rotation.x-1.3)/1.2,0,1);ot.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}hp(I)}function pp(I,J){I&&(V.root.rotation.x=-1.05,V.joint.rotation.x=-.35,z.root.rotation.x=-.45,z.joint.rotation.x=-.2,v.rotation.y=-.12,pt.orb.scale.setScalar(1.25+.12*Math.sin(J*2)))}function mp(I){if(!I||I.phase==="idle")return;const J=I.progress,xt=J<.3?-.35+J/.3*1.35:J<.7?1:Math.max(0,1-(J-.7)/.3),vt=Math.PI/180;v.rotation.x+=g.leanDeg*vt*xt,z.root.rotation.x-=g.shieldPitchDeg*vt*xt,z.joint.rotation.x-=.22*xt,V.root.rotation.x-=.3*xt,x.position.z+=g.pelvisReach*Math.max(0,xt)}function hr(I){if(!I)return null;const J=I.getObjectByName("bladeBase"),xt=I.getObjectByName("bladeTip");if(!J||!xt)return null;I.updateWorldMatrix(!0,!1);const vt=J.getWorldPosition(new G),ee=xt.getWorldPosition(new G),Jt=new G().setFromMatrixColumn(I.matrixWorld,0).normalize();return{base:{x:vt.x,y:vt.y,z:vt.z},tip:{x:ee.x,y:ee.y,z:ee.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:p,update(I,J,xt,vt,ee=!1,Jt,_e,Le){Zn(J.weapon),p.rotation.y=0,Xt=0,v.rotation.x=0,v.rotation.z=0,x.position.x=0,x.position.y=S,x.position.z=0,x.rotation.z=0,x.rotation.x=0,v.position.x=0,v.position.y=0,v.position.z=0,y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const De=Math.max(1/240,Math.min(vt,.1)),Qe=Jt===void 0?te+=vt:Jt;ce=Qe;const ze=l.landing;ze.enabled?Ut&&!I.grounded?(oe="jump",Re=Qe,pn=ze.anticipationDuration,Ue=Math.max(0,ze.jumpAnticipation),Tn=.32):!Ut&&I.grounded&&(oe="land",Re=Qe,pn=ze.duration,Ue=FS($e,ze),Tn=ze.compressRatio,Te=$e):(oe="none",Ue=0),Qe<Re&&(oe="none",Ue=0),Ut=I.grounded,$e=I.velocity.y;const Oe=fu(Qe,Re,pn,Ue,Tn),Ze=J.phase!=="idle",an=(Le==null?void 0:Le.phase)==="active";It=kS(It,Ze,De,l.attack.blendRate);const Dn=IS(It,l.attack.gaitWeight,l.attack.lowerBodyWeight);Ft=Dn.attackLegWeight,he=Dn.gaitScale;const kn=Math.sin(I.bodyYaw),_i=Math.cos(I.bodyYaw),la=(I.velocity.x-ht)/De,Hs=(I.velocity.z-Ht)/De,ha=ve(la,-60,60),ts=ve(Hs,-60,60),dr=ha*kn+ts*_i,ur=Ge(I.bodyYaw-X)/De,es=Math.hypot(I.velocity.x,I.velocity.z),ns=o.maxForwardDeg*Math.PI/180,oi=o.maxSideDeg*Math.PI/180,fr=ve(dr*o.accelGain,-ns,ns),da=ve(-ur*es*o.turnGain,-oi,oi),Ui=1-Math.exp(-o.smoothing*De);le+=(fr-le)*Ui,Wt+=(da-Wt)*Ui,ht=I.velocity.x,Ht=I.velocity.z,X=I.bodyYaw;const hn=Math.hypot(I.velocity.x,I.velocity.z),is=ve(a.knockGaitScale??0,0,1),as=xt.knockX*is,Gs=xt.knockZ*is,pr=is>0&&Math.hypot(xt.knockX,xt.knockZ)>.001,ua=I.velocity.x+as,yi=I.velocity.z+Gs,hh=Math.hypot(ua,yi);O=hh;const gp=Math.cos(I.bodyYaw),xp=-Math.sin(I.bodyYaw),vp=I.velocity.x*gp+I.velocity.z*xp,dh=hn>ui?ve(vp/hn,-1,1):0,uh=hn>ui?ve((I.velocity.x*kn+I.velocity.z*_i)/hn,-1,1):1,_p=eh(uh,a.backStrafeStartDeg,a.backStrafeFullDeg);gt==="settled"&&Kt&&re>de*1.02+1e-4&&(gt="none");let ss=1;gt==="blend"?(ss=Xf(St?Et:K,a.stopYawBlendMode,St),St||(K=Math.min(1,K+De/Math.max(.01,a.stopYawAfterSec)),(K>=1||a.stopYawBlendMode==="inStop"||Kt)&&(gt="settled",ss=0))):gt==="settled"&&(ss=ve(hn/Math.max(ui,a.stopEnterRatio*e),0,1)),rt=ss;const yp=Of(dh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Mp=Bf(uh,dh,yp,_p)*ss;C+=(Mp-C)*(1-Math.exp(-i.hipYawSmoothing*De));const os=I.bodyYaw+C;T=os;const bp=Math.sin(os),Sp=Math.cos(os),wp=Math.cos(os),Ep=-Math.sin(os),Vs={speed:hh,phase:I.gaitPhase,localForward:ua*bp+yi*Sp,localRight:ua*wp+yi*Ep,stride:I.stride};Ze&&!ut&&(st=I.gaitPhase),ut=Ze;const fa=It>0?LS(Vs,J.attackProgress,J.comboIndex,It,l.stride,st):Vs;bt=fa;const fh=Math.max(0,a.stopBlendSec||0),ph=fh>0&&!Ze&&!pr&&I.grounded,mr=Hf(hn,yt,e,a.stopEnterRatio,a.stopExitRatio);if(!ph||mr.resume)W=-1;else if(W<0&&mr.enter){W=0,ct=I.gaitPhase,lt=Uf(I.gaitPhase),at=hn,Pt=Math.max(I.stride,ui),j=Vs.localForward,ft=Vs.localRight;const ye=1/Math.max(ui,hn);Bt=I.velocity.x*ye,nt=I.velocity.z*ye}const Tp=yt;yt=hn;const Ni=ph&&W>=0;Ni&&(W=Math.min(1,W+De/fh)),Ni&&gt!=="blend"&&(gt="blend",K=0),St=Ni&&W<1,Et=W,Kt=mr.resume,re=hn,de=Tp;const mh=Ni?{phase:ct,speed:at,moveSpeed:e,localForward:j,localRight:ft,legLength:n.legLength,stride:Pt,grounded:!0}:{phase:fa.phase,speed:fa.speed,moveSpeed:e,localForward:fa.localForward,localRight:fa.localRight,legLength:n.legLength,stride:fa.stride??0,grounded:I.grounded},Ap=Ni?Nf(mh,a,{progress:W,phase0:ct,phaseEnd:lt}):nh(mh,a),Ae=zS(Ap,Dn.gaitScale);if(ae=0,an&&Le){const ye=RS(Le.progress,Le.dir,a),pe=Dn.gaitScale;Ae.legL.pitchX+=ye.legL.pitchX*pe,Ae.legL.rollZ+=ye.legL.rollZ*pe,Ae.legL.kneeX+=ye.legL.kneeX*pe,Ae.legR.pitchX+=ye.legR.pitchX*pe,Ae.legR.rollZ+=ye.legR.rollZ*pe,Ae.legR.kneeX+=ye.legR.kneeX*pe,Ae.pelvisY+=ye.pelvisY*pe,ae=ye.env}let gr=0,xr=0,vr=0,gh=0;if(Ni){const ye=Vf(I.bodyYaw,Bt,nt),pe=Wf(W,ct,ye.forward,ye.right,a);pe.leadLeft?(Ae.legL.pitchX-=pe.leadPitch,Ae.legL.kneeX+=pe.leadKnee,Ae.legR.pitchX+=pe.trailPitch):(Ae.legR.pitchX-=pe.leadPitch,Ae.legR.kneeX+=pe.leadKnee,Ae.legL.pitchX+=pe.trailPitch),xr=pe.bodyShift*pe.fwdN,gr=pe.bodyShift*pe.rightN,vr=pe.bodyDip,gh=pe.chestPitch,Vt=pe.leadPitch,qt=pe.bodyShift,Yt=pe.bodyDip}else Vt=0,qt=0,Yt=0;_t={lp:Ae.legL.pitchX,lr:Ae.legL.rollZ,rp:Ae.legR.pitchX,rr:Ae.legR.rollZ},I.grounded?(H.root.rotation.x=Ae.legL.pitchX,N.root.rotation.x=Ae.legR.pitchX,H.root.rotation.z=Ae.legL.rollZ,N.root.rotation.z=Ae.legR.rollZ,H.joint.rotation.x=Ae.legL.kneeX,N.joint.rotation.x=Ae.legR.kneeX,z.root.rotation.x=Ae.armL,V.root.rotation.x=Ae.armR,z.joint.rotation.x=-(.18+Ae.armL*.2),V.joint.rotation.x=-(.18+Ae.armR*.2),z.root.rotation.z=0,V.root.rotation.z=0,z.root.rotation.y=0,V.root.rotation.y=0,x.position.x=Ae.pelvisX,x.position.y=S+Ae.pelvisY,x.position.z=0,x.rotation.z=Ae.pelvisRoll):(H.root.rotation.x=-.55,N.root.rotation.x=-.25,H.joint.rotation.x=.75,N.joint.rotation.x=.55,z.root.rotation.x=-.9,V.root.rotation.x=-.7,z.joint.rotation.x=-.6,V.joint.rotation.x=-.6,H.root.rotation.z=0,N.root.rotation.z=0);const Rp=Jf(x,y),rs=an?{...d,weight:0}:Ni&&d.enabled?{...d,weight:1}:d,xh=rs.enabled&&I.grounded&&rs.weight>0?ve(rs.weight,0,1)*(Ze?ve(rs.attackScale,0,1):1):0;x.position.x+=gr,x.position.z+=xr,x.position.y-=vr,y.position.y+=vr,xh<=0&&(y.position.x-=gr,y.position.z-=xr);const _r=hn/Math.max(e,ui);Dt=_r;const Pp=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Cp=1-Math.exp(-Math.max(0,Pp)*De);Rt+=(ve(_r,0,1)-Rt)*Cp;const pa=qf({leanForward:le,leanSide:Wt,speedRatio:Rt},o);x.rotation.x+=pa.pelvisPitch,x.rotation.z+=pa.pelvisRoll,x.position.x+=pa.pelvisX,x.position.z+=pa.pelvisZ,x.position.y-=pa.crouch,y.position.y+=pa.crouch*(1-ve(xh,0,1));const vh=J.phase!=="idle"||J.charging&&J.weapon==="bow",yr=vh?1:0,Lp=Math.max(.001,yr>kt?m.poseIn??.1:m.poseOut??.16);if(kt!==yr){const ye=De/Lp;kt=ve(kt+(yr>kt?ye:-ye),0,1)}(kt>0||vh)&&dp(),fp(J,De),kt>0&&kt<1&&up(kt),pp(ee,I.gaitPhase),mp(_e);const Dp=J.weapon==="greatsword",_h=Math.hypot(I.velocity.x,I.velocity.z),kp=Dp&&J.phase==="idle"&&_h>.5?Math.min(1.15,_h/Math.max(e,.001)*.9):0;Gt+=(kp-Gt)*(1-Math.exp(-6*De));const Ip=v.rotation.x;J.weapon==="bow"&&(Q.g.rotation.x=-(z.root.rotation.x+z.joint.rotation.x),Mt.rotation.x=-(V.root.rotation.x+V.joint.rotation.x));const zp=v.rotation.y;jn(xt,I.bodyYaw);const yh=xt.type==="none"?1:.4;if(v.rotation.x+=le*yh+gh,v.rotation.z+=(Wt+Ae.sideLean)*yh,Oe>0&&(H.root.rotation.x-=ze.hipPitch*Oe,N.root.rotation.x-=ze.hipPitch*Oe,H.joint.rotation.x+=ze.kneeBend*Oe,N.joint.rotation.x+=ze.kneeBend*Oe,x.position.y-=ze.crouchDepth*Oe,y.position.y+=ze.crouchDepth*(1-ze.lowerScale)*Oe,v.rotation.x+=ze.upperPitch*Oe,z.root.rotation.x-=ze.armTuck*Oe,V.root.rotation.x-=ze.armTuck*Oe),Ft>0&&I.grounded){const ye=DS(J.attackProgress,J.comboIndex,l.stride),pe=Ft;H.root.rotation.x+=ye.legL.pitchX*pe,N.root.rotation.x+=ye.legR.pitchX*pe,H.root.rotation.z+=ye.legL.rollZ*pe,N.root.rotation.z+=ye.legR.rollZ*pe,H.joint.rotation.x+=ye.legL.kneeX*pe,N.joint.rotation.x+=ye.legR.kneeX*pe,x.position.x+=ye.pelvisX*pe,x.position.y+=ye.pelvisY*pe,x.rotation.z+=ye.pelvisRoll*pe}if(lp(Ze,J.weapon),_.enabled){const ye=J.phase!=="idle"&&!J.charging,pe=ye?Fi(J.attackProgress):0;ye&&rn>.55&&pe<rn-1e-4&&(ge=1),rn=pe,ge=a1(ge,De,_.impactDecay);const Up=n1({swing:pe,charge:J.charging?J.charge:0,impact:ge,speedRatio:_r,grounded:I.grounded},_);be=i1(be,Up,De,_.smoothing)}else be={...bl};ip(be),y.rotation.y=C,B=Gf(C,a.chestYawScale,a.chestYawMaxDeg),v.rotation.y+=B;const Fp=zp;if(F.rotation.y=Ge(I.headYaw-I.bodyYaw-Fp-B),F.rotation.x=-ve(I.headPitch??0,-.7,.7),v.rotation.x+=-ve(I.bodyPitch??0,-.4,.4),sp(vt,J.comboIndex),cp(J,Ip),J.weapon==="greatsword"&&!J.charging&&(J.phase!=="idle"||kt>0)){p.updateWorldMatrix(!0,!0);const ye=J.phase==="idle"?Math.max(kt,It):1;ap(ve(ye,0,1),De)}At=Qf({root:p,pelvis:x,lower:y,limbs:mt,base:Rp,cfg:rs,grounded:I.grounded,attacking:Ze})},lean(){return{forward:le,side:Wt}},landing(){const I=fu(ce,Re,pn,Ue,Tn),J=pn>0?Math.max(0,pn-Math.max(0,ce-Re)):0;return{pulse:I,remaining:J,kind:I>0?oe:"none",impactVy:Te}},hurt(){return Nt},ik(){return At},stretch(){return{...be,impact:ge}},gripDebug(){return{...bn}},weaponDebug(){return{wristPitch:Ee,wristTwist:Z}},setClipT(I){qe=I===null||!Number.isFinite(I)?null:Math.max(0,Math.min(1,I))},swingDebug(){const I=se;return{seg:we,kind:(I==null?void 0:I.kind)??"right-left",lead:(I==null?void 0:I.lead)??"R",yaw:(I==null?void 0:I.yaw)??0,rootYaw:(I==null?void 0:I.rootYaw)??0,spinYaw:(I==null?void 0:I.spinYaw)??0,rootTurn:Xt,pitch:(I==null?void 0:I.pitch)??0,roll:(I==null?void 0:I.roll)??0,strike:(I==null?void 0:I.strike)??0,bladeTwist:(I==null?void 0:I.bladeTwist)??0,bladeTwistOff:(I==null?void 0:I.bladeTwistOff)??0,bladeYaw:(I==null?void 0:I.bladeYaw)??0,bladeYawOff:(I==null?void 0:I.bladeYawOff)??0,shoulderL:{x:A.lx,y:A.ly,z:A.lz},shoulderR:{x:A.rx,y:A.ry,z:A.rz}}},attackBlend(){return It},attackWeights(){return{gaitScale:he,attackLegWeight:Ft,driveSpeed:bt.speed,stridePhase:bt.phase}},hipYaw(){return C},gaitDebug(){return{stopT:W,hipYaw:C,chestYaw:B,speed:yt,gaitSpeed:O,stopStep:Vt,stopShift:qt,stopDip:Yt,stopYawFade:rt,turnStep:ae,legLPitch:_t.lp,legLRoll:_t.lr,legRPitch:_t.rp,legRRoll:_t.rr}},gaitYaw(){return T},arrowDirection(){Mt.updateWorldMatrix(!0,!1);const I=Mt.matrixWorld.elements,J=I[8],xt=I[9],vt=I[10],ee=Math.hypot(J,xt,vt)||1;return{x:J/ee,y:xt/ee,z:vt/ee}},weaponBlade(){return Zt?hr(Ct[Zt].right):null},bladesWorld(){return Zt?{right:hr(Ct[Zt].right),left:hr(Ct[Zt].left)}:{right:null,left:null}},dispose(){p.traverse(I=>{if(I instanceof me){I.geometry.dispose();const J=I.material;Array.isArray(J)?J.forEach(xt=>xt.dispose()):J.dispose()}})}}}function g1(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Ke,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new ln(i,3),o=new ln(a,3);s.setUsage(td),o.setUsage(td),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,v=y+1,R=y+2,S=y+3;r.push(y,v,R,v,S,R)}e.setIndex(r),e.setDrawRange(0,0);const l=new tn({vertexColors:!0,transparent:!0,opacity:1,blending:Ai,depthWrite:!1,side:He}),c=new me(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ne(n.color);let f=[],d=null,u=0,g=0,_=!1,m=!1;function p(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let v=0;v<x;v++){const R=f[v],S=Math.max(0,1-R.age/y),b=S*S,E=Math.min(1,R.speed/Math.max(.001,n.minSpeed*2)),w=n.intensity*b*(.55+.45*E),M=.18+.82*S,P=v*6;i[P]=R.tx+(R.bx-R.tx)*M,i[P+1]=R.ty+(R.by-R.ty)*M,i[P+2]=R.tz+(R.bz-R.tz)*M,i[P+3]=R.tx,i[P+4]=R.ty,i[P+5]=R.tz;const F=h.r*w,D=h.g*w,U=h.b*w,L=F*.22,k=D*.22,H=U*.22;a[P]=L,a[P+1]=k,a[P+2]=H;const N=1+n.tipBoost;a[P+3]=Math.min(1,F*N),a[P+4]=Math.min(1,D*N),a[P+5]=Math.min(1,U*N)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,y,v){if(!n.enabled){c.visible=!1;return}const R=Math.max(0,x);for(const S of f)S.age+=R;for(;f.length>0&&f[0].age>n.life;)f.shift();if(y){const S=d?Math.hypot(y.tip.x-d.x,y.tip.y-d.y,y.tip.z-d.z)/Math.max(1e-4,R):0,b=f[f.length-1],E=b?Math.hypot(y.tip.x-b.tx,y.tip.y-b.ty,y.tip.z-b.tz):1/0;if(v&&E>=n.minStep)for(f.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:S});f.length>t;)f.shift();d={x:y.tip.x,y:y.tip.y,z:y.tip.z},u=S,g=E,_=!0}else d=null,_=!1,u=0,g=0;m=v,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:g,hasBlade:_,active:m}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function x1(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function v1(n,t,e,i){const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new Ub({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=$u,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new Nb;r.background=new ne("#12161d"),r.add(new _S(11061486,2764600,1.15));const l=new bS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Ie;for(const Z of t.boxes){const Dt=Z.maxX-Z.minX,Tt=Z.maxY-Z.minY,Qt=Z.maxZ-Z.minZ;let ie=x1(Z.kind,e);Z.kind==="step"&&(ie=new ne(ie).offsetHSL(0,0,Z.maxY*.09).getStyle());const se=new Us({color:ie,transparent:!0,opacity:1}),xe=new me(new $n(Dt,Tt,Qt),se);xe.position.set((Z.minX+Z.maxX)/2,(Z.minY+Z.maxY)/2,(Z.minZ+Z.maxZ)/2),xe.castShadow=Z.kind!=="ground",xe.receiveShadow=!0,xe.add(new Ef(new tS(xe.geometry),new $l({color:10467020,transparent:!0,opacity:.32}))),f.add(xe),h.push(se)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new wS(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const g=GS(i,e);r.add(g.group);const _=m1(e.voxel,e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist),m=g1(e.weaponTrail);r.add(m.object);const p=new Ie,x=.9,y=new Ie;y.position.y=x,_.group.position.y=-x,y.add(_.group),p.add(y),r.add(p);const v=t.dummies.map((Z,Dt)=>{const Tt=e.dummies.colors,Qt=Tt[Dt%Tt.length]??"#cccccc",ie=HS(e.voxel,e.colors,Qt,Z.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return ie.group.traverse(se=>{se.userData.dummyId=Z.id}),r.add(ie.group),ie}),R=v.map(Z=>Z.group),S=new SS,b=e.groundRing,E=e.voxel.bodyWidth,w=mu(E,b.playerRadiusFactor),M=mu(E,b.dummyRadiusFactor),P=E*b.thicknessFactor,F=b.arcDeg*Math.PI/180;let D=0;const U=pc({radius:w,thickness:P,arcRad:F,edgeFade:b.edgeFade,color:b.playerColor,opacity:b.playerOpacity,y:.028,renderOrder:6});U.mesh.name="player-ground-ring",r.add(U.mesh);const L=t.dummies.map(Z=>{const Dt=pc({radius:M,thickness:P,arcRad:F,edgeFade:b.edgeFade,color:b.neutralColor,opacity:b.opacity,y:.022,renderOrder:5});return Dt.mesh.name=`dummy-ground-ring-${Z.id}`,r.add(Dt.mesh),Dt}),k=t.dummies.map(Z=>{const Dt=pc({radius:M*b.haloRadiusFactor,thickness:P*b.haloThicknessFactor,arcRad:F,edgeFade:b.edgeFade,color:b.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Dt.mesh.name=`dummy-ground-halo-${Z.id}`,r.add(Dt.mesh),Dt}),H=t.dummies.map(()=>0),N=t.dummies.map(()=>0),z=gu({radius:w*b.meterRadiusFactor,thickness:P*b.meterThicknessFactor,arcRad:F,edgeFade:.06,color:b.meterColorCharge,y:.03,renderOrder:8});z.mesh.name="player-ground-meter",r.add(z.mesh);const V=t.dummies.map(Z=>{const Dt=gu({radius:M*b.warnRadiusFactor,thickness:P*b.warnThicknessFactor,arcRad:F,edgeFade:.02,color:b.warnColor,y:.031,renderOrder:9});return Dt.mesh.name=`dummy-ground-warn-${Z.id}`,r.add(Dt.mesh),Dt}),mt=xu({color:b.playerColor,y:.042,renderOrder:3});mt.group.name="player-landing-preview",r.add(mt.group);const ot=new ne,dt=new ne(b.playerColor),tt=new ne(b.neutralColor),q=new ne(b.lowThreatColor),pt=new ne(b.highThreatColor),Q=new ne(b.meterColorCharge),Mt=new ne(b.meterColorChannel),Ct=new ne(b.meterColorCooldown),zt=new ne(b.warnColor),Zt=new Ie;r.add(Zt);const ht=e.projectiles;function Ht(){const Dt=document.createElement("canvas");Dt.width=64,Dt.height=64;const Tt=Dt.getContext("2d");if(Tt){const ie=Tt.createRadialGradient(32,32,0,32,32,32);ie.addColorStop(0,"rgba(255,255,255,1)"),ie.addColorStop(.28,"rgba(255,255,255,0.72)"),ie.addColorStop(.62,"rgba(255,255,255,0.22)"),ie.addColorStop(1,"rgba(255,255,255,0)"),Tt.fillStyle=ie,Tt.fillRect(0,0,64,64)}const Qt=new vl(Dt);return Qt.colorSpace=_n,Qt}function X(){const Tt=document.createElement("canvas");Tt.width=2,Tt.height=64;const Qt=Tt.getContext("2d");if(Qt){const se=Qt.createLinearGradient(0,0,0,64);se.addColorStop(0,"rgba(255,255,255,0)"),se.addColorStop(.55,"rgba(255,255,255,0.35)"),se.addColorStop(1,"rgba(255,255,255,0.95)"),Qt.fillStyle=se,Qt.fillRect(0,0,2,64)}const ie=new vl(Tt);return ie.colorSpace=_n,ie}const le=Ht(),Wt=X(),Gt=new tn({color:12577023,transparent:!0,opacity:0,side:He,depthWrite:!1}),Nt=new tn({color:14217983,transparent:!0,opacity:0,side:He,depthWrite:!1,blending:Ai}),At=new Ie;At.position.set(0,.95,.72),Zt.add(At);const Rt=new Ie;Rt.rotation.x=QS(e.camera.pitchDeg),At.add(Rt);const C=new lr(.78,ht.slashThickness,6,28,Math.PI*1.15),T=new Ie,W=new me(C,Gt),ct=new me(C,Nt);ct.scale.setScalar(1.09),ct.renderOrder=4,T.add(W,ct),Rt.add(T);const lt=new $n(ht.arrowWidth,ht.arrowWidth,ht.arrowLength),at=new Kl(ht.arrowHeadSize*.42,ht.arrowHeadSize,4);at.rotateX(Math.PI/2);const Pt=new $n(ht.arrowWidth*2.6,ht.arrowWidth*.4,.1),j=new Ds(ht.arrowWidth*.45,ht.arrowWidth*1.3,ht.trailLength,6,1,!0);j.rotateX(-Math.PI/2),j.translate(0,0,-ht.trailLength/2);const ft=Array.from({length:10},()=>{const Z=new Ie,Dt=new tn({color:ht.arrowColor,transparent:!0}),Tt=new tn({color:ht.arrowHeadColor,transparent:!0}),Qt=new xl({map:le,color:ht.arrowColor,transparent:!0,opacity:.85,blending:Ai,depthWrite:!1}),ie=new tn({color:ht.arrowTrailColor,map:Wt,transparent:!0,opacity:0,blending:Ai,depthWrite:!1,side:He}),se=new me(lt,Dt),xe=new me(at,Tt);xe.position.z=ht.arrowLength/2+ht.arrowHeadSize*.42;const we=new me(Pt,Tt),Je=new me(Pt,Tt);we.position.z=-ht.arrowLength/2+.08,Je.position.z=we.position.z,Je.rotation.z=Math.PI/2;const qe=new Kd(Qt);qe.scale.setScalar(ht.arrowGlowSize),qe.renderOrder=6;const A=new me(j,ie);return A.renderOrder=5,Z.add(se,xe,we,Je,qe,A),Z.visible=!1,r.add(Z),{group:Z,shaftMat:Dt,tipMat:Tt,glowMat:Qt,trailMat:ie,glow:qe,trail:A,arrowId:0,bone:null}}),Bt=new Ql(1,0),nt=new G(ht.boltShapeX,ht.boltShapeY,ht.boltShapeZ),yt=new tn({color:ht.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),B=new xl({map:le,color:ht.boltGlowColor,transparent:!0,opacity:.45,blending:Ai,depthWrite:!1}),st=new tn({color:ht.boltGlowColor,map:Wt,transparent:!0,opacity:ht.trailOpacity,blending:Ai,depthWrite:!1,side:He}),ut=new Ds(.5,.03,ht.boltTrailScale,6,1,!0);ut.rotateX(-Math.PI/2),ut.translate(0,0,-ht.boltTrailScale/2);const Vt=Array.from({length:24},()=>{const Z=new Ie,Dt=new me(Bt,yt);Dt.scale.copy(nt);const Tt=new Kd(B);Tt.scale.setScalar(ht.boltGlowScale),Tt.renderOrder=6;const Qt=new me(ut,st);return Qt.renderOrder=5,Z.add(Dt,Tt,Qt),Z.visible=!1,r.add(Z),{group:Z,core:Dt}}),qt=Array.from({length:6},()=>{const Z=xu({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return Z.group.visible=!1,r.add(Z.group),Z}),Yt=e.dash,O=new Fs(Yt.ringRadius-.06,Yt.ringRadius,28),gt=Array.from({length:6},()=>{const Z=new tn({color:16777215,transparent:!0,opacity:0,side:He,depthWrite:!1}),Dt=new me(O,Z);return Dt.rotation.x=-Math.PI/2,Dt.visible=!1,r.add(Dt),{mesh:Dt,mat:Z,life:0,base:1}});function K(Z,Dt,Tt,Qt,ie){const se=gt.find(xe=>xe.life<=0)??gt[0];se.mat.color.set(Qt),se.mesh.position.set(Z,Tt+.04,Dt),se.base=ie,se.mesh.scale.setScalar(ie*.6),se.mesh.visible=!0,se.mat.opacity=.9,se.life=Yt.fxDuration}const rt=e.links,St=new Fs(rt.ringRadius-.07,rt.ringRadius,28),Et=Array.from({length:5},()=>{const Z=new tn({color:rt.chargeColor,transparent:!0,opacity:0,side:He,depthWrite:!1}),Dt=new me(St,Z);return Dt.rotation.x=-Math.PI/2,Dt.visible=!1,r.add(Dt),{mesh:Dt,mat:Z,life:0,base:1}});function Kt(Z,Dt,Tt,Qt){const ie=Et.find(se=>se.life<=0)??Et[0];ie.mesh.position.set(Z,Tt+.05,Dt),ie.base=Qt,ie.mesh.scale.setScalar(Qt*.55),ie.mesh.visible=!0,ie.mat.opacity=.85,ie.life=rt.fxDuration}let re=t.playerLink.id,de=t.playerLink.hitIds.length,ae=t.dash.id,be="none";const ge=TS(e.camera,e.smartCamera,e.zoom,a/s),rn=t.character.position;ge.update(rn.x,rn.y,rn.z,1,t.camera);function bn(Z,Dt){if(R.length===0)return 0;const Tt=o.domElement.getBoundingClientRect(),Qt=new $t((Z-Tt.left)/Tt.width*2-1,-((Dt-Tt.top)/Tt.height)*2+1);S.setFromCamera(Qt,ge.camera);const ie=S.intersectObjects(R,!0);for(const se of ie){const xe=se.object.userData.dummyId;if(xe&&xe>0)return xe}return 0}function Se(Z,Dt,Tt){const Qt=o.domElement.getBoundingClientRect(),ie=new G(Z,Dt,Tt).project(ge.camera);return{x:Qt.left+(ie.x*.5+.5)*Qt.width,y:Qt.top+(-ie.y*.5+.5)*Qt.height}}let Ee=!1;return{gaitDebug(){return _.gaitDebug()},trailDebug(){return m.debug()},stretchDebug(){const Z=_.stretch();return{arm:Z.arm,leg:Z.leg,torso:Z.torso,impact:Z.impact}},swingDebug(){return _.swingDebug()},bladeWorld(){return _.weaponBlade()},bladesWorld(){return _.bladesWorld()},projectPoint(Z,Dt,Tt){return Se(Z,Dt,Tt)},setClipT(Z){_.setClipT(Z)},weaponDebug(){return _.weaponDebug()},gripDebug(){return _.gripDebug()},render(Z,Dt){const Tt=Z.character,Qt=Z.combat,ie=e.hitstop.enabled&&Z.combat.hitstop>0,se=ie;ie&&!Ee&&ge.addShake(Z.combat.weapon==="greatsword"?.85:.5),Ee=ie,p.position.set(Tt.position.x,Tt.position.y,Tt.position.z),p.rotation.y=Tt.bodyYaw;const xe=Z.dash.phase==="active"&&Z.dash.kind==="roll",we=xe&&Z.dash.duration>0?Math.min(1,1-Z.dash.timer/Z.dash.duration):0;if(y.rotation.x=xe?we*Math.PI*2:0,y.position.y=x-(xe?.2*Math.sin(Math.PI*we):0),se||_.update(Tt,Qt,Z.playerHurt,Dt,Z.abilities.channeling,Z.time,Z.playerLink,Z.turnInPlace),m.update(se?0:Dt,se?null:_.weaponBlade(),!se&&(Qt.phase==="active"||Z.playerLink.phase==="active"||xe&&Z.dash.duration>0)),!se)for(let bt=0;bt<v.length;bt++)Z.dummies[bt]&&v[bt].update(Z.dummies[bt],Dt);const Je=ge.camera.position,qe=Math.atan2(Je.x-Tt.position.x,Je.z-Tt.position.z),A=Z.config.gaze.hurtHoldSec,Y=Z.time-Z.playerHurt.lastAt,it=A>0&&Y>=0&&Y<A?1-Y/A:0,et=WS(Z.gaze.active,Z.gaze.threat,it,Z.time,b);YS(ot,dt,q,pt,et.level),D=JS(Tt.grounded,Tt.position.y,D),U.mesh.position.set(Tt.position.x,D+.028,Tt.position.z),U.update(et.arcRad,et.opacity,et.scale,ot,qe);const $=Z.config.abilities.arcane,wt=Math.max(1,Math.floor($.waves)),Lt=Math.max(1e-4,$.waveInterval),jt=qS({charging:Qt.charging,charge:Qt.charge,channeling:Z.abilities.channeling,fireTimer:Z.abilities.fireTimer,fireInterval:Lt,channelProgress:Z.abilities.channeling?(Z.abilities.waveIndex+(1-Math.min(1,Math.max(0,Z.abilities.fireTimer/Lt))))/wt:0,arcaneCooldown:Z.abilities.cooldown,arcaneCooldownMax:$.cooldown,dashCooldown:Z.dash.cooldown,dashCooldownMax:Z.dash.kind==="blink"?Z.config.dash.blinkCooldown:Z.config.dash.rollCooldown});z.mesh.position.set(Tt.position.x,Tt.position.y+.03,Tt.position.z),z.set(jt.ratio,jt.source==="none"?0:b.meterOpacity,jt.source==="charge"?Q:jt.source==="channel"?Mt:Ct,qe);const Xt=Z.playerLink,It=Xt.weapon?Z.config.links.moves[Xt.weapon]:void 0,kt=jS(Xt.phase,Tt.position.x,Tt.position.z,Xt.facing,Xt.travel,(It==null?void 0:It.hit.radius)??.9);mt.set(kt.x,kt.z,.042,kt.radius,kt.active?b.landingOpacity:0,Z.time);for(let bt=0;bt<L.length;bt++){const _t=Z.dummies[bt],te=L[bt],ce=k[bt],Ut=V[bt];if(!_t){te.mesh.visible=!1,ce.mesh.visible=!1,Ut.mesh.visible=!1;continue}const $e=Z.targeting.hasTarget&&Z.targeting.targetId===_t.id;if(n0(Z,_t)){const Zn=i0(Z,_t);ot.copy(q).lerp(pt,Zn)}else ot.copy(tt);const oe=ZS(_t.attackPhase,_t.attackPhaseTimer,Z.config.dummies.attackWindup);oe.active?(ot.lerp(zt,.5*oe.urgency),Ut.mesh.position.set(_t.position.x,_t.position.y+.031,_t.position.z),Ut.set(oe.ratio,b.warnOpacity*(.65+.35*oe.urgency),zt,qe)):Ut.set(0,0,zt,qe);const Re=$e?1:0,pn=Re>H[bt]?b.haloFadeInSec:b.haloFadeOutSec;H[bt]=vu(H[bt],Re,Dt,pn);const Ue=H[bt],Tn=1+.02*Ue*Math.sin(Z.time*2.2+_t.id),Te=b.arcDeg+(b.selectedArcDeg-b.arcDeg)*Ue;te.mesh.position.set(_t.position.x,_t.position.y+.022,_t.position.z),te.update(Te*Math.PI/180,b.opacity+(b.selectedOpacity-b.opacity)*Ue,1+(b.selectedScale-1)*Ue*Tn,ot,qe,1+(b.selectedThicknessScale-1)*Ue),N[bt]=vu(N[bt],Re,Dt,Re>N[bt]?b.haloFadeInSec:b.haloFadeOutSec);const mn=N[bt];ce.mesh.position.set(_t.position.x,_t.position.y+.019,_t.position.z),ce.update(Te*Math.PI/180,b.haloOpacity*mn*(.88+.12*Math.sin(Z.time*2.2+_t.id)),b.selectedScale*(.94+.06*mn)*Tn,ot,qe)}if(Zt.position.set(Tt.position.x,Tt.position.y,Tt.position.z),Zt.rotation.y=Qt.phase!=="idle"?Qt.attackFacing:Tt.bodyYaw,Z.dash.id!==ae){ae=Z.dash.id;const bt=Z.dash;be=bt.kind,bt.kind==="blink"?(K(bt.fromX,bt.fromZ,Tt.position.y,Yt.blinkColor,.9),K(bt.toX,bt.toZ,Tt.position.y,Yt.blinkColor,1.35)):K(bt.fromX,bt.fromZ,Tt.position.y,Yt.rollColor,1.1)}for(const bt of gt){if(bt.life<=0)continue;bt.life-=Dt;const _t=Math.max(0,bt.life/Yt.fxDuration);bt.mat.opacity=.9*_t,bt.mesh.scale.setScalar(bt.base*(.6+(1-_t)*1.2)),bt.life<=0&&(bt.mesh.visible=!1)}const Ft=Z.playerLink;Ft.id!==re&&(re=Ft.id,de=Ft.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1)),Ft.hitIds.length>de?(de=Ft.hitIds.length,Kt(Tt.position.x,Tt.position.z,Tt.position.y,1.35)):Ft.hitIds.length<de&&(de=Ft.hitIds.length);for(const bt of Et){if(bt.life<=0)continue;bt.life-=Dt;const _t=Math.max(0,bt.life/Math.max(rt.fxDuration,1e-6));bt.mat.opacity=.85*_t,bt.mesh.scale.setScalar(bt.base*(.55+(1-_t)*1.1)),bt.life<=0&&(bt.mesh.visible=!1)}const he=ht.slashEnabled&&Qt.phase==="active"&&Qt.comboIndex>=3;Gt.opacity=he?.7:0,Nt.opacity=he?ht.slashGlowOpacity:0,he&&(T.rotation.z=-1.2+Qt.attackProgress*3.2,T.scale.setScalar(.9+Qt.comboIndex*.13));for(let bt=0;bt<Vt.length;bt++){const _t=Z.abilities.projectiles[bt],te=Vt[bt];te.group.visible=!!_t,_t&&(te.group.position.set(_t.x,_t.y,_t.z),te.group.scale.setScalar(_t.radius),te.group.rotation.set(0,Math.atan2(_t.dirX,_t.dirZ),0))}for(let bt=0;bt<qt.length;bt++){const _t=Z.abilities.rings[bt],te=qt[bt];if(!_t){te.group.visible=!1;continue}const ce=Math.max(0,Math.min(1,_t.life/Math.max(_t.duration,1e-6))),Ut=KS(Math.max(0,_t.duration-_t.life),b.areaExpandSec);te.set(_t.x,_t.z,.045,_t.radius*Ut.scale,b.areaOpacity*(.35+.65*ce)*Ut.alpha,Z.time)}for(let bt=0;bt<ft.length;bt++){const _t=Z.arrows[bt],te=ft[bt];if(!_t){te.group.visible=!1,te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=0;continue}const ce=_t.stuck&&_t.stuckDummy>=0;if(te.arrowId!==_t.id){if(te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=_t.id,te.group.position.set(_t.x,_t.y,_t.z),te.group.rotation.set(_t.pitch,_t.yaw,0,"YXZ"),ce){const $e=v[_t.stuckDummy],oe=$e?$e.boneAtWorld(_t.x,_t.y,_t.z):null;oe&&(oe.node.attach(te.group),te.bone=oe.node)}}else te.bone||(te.group.position.set(_t.x,_t.y,_t.z),te.group.rotation.set(_t.pitch,_t.yaw,0,"YXZ"));te.group.visible=!0;const Ut=_t.stuck?Math.min(1,_t.rest/.6):1;te.shaftMat.opacity=Ut,te.tipMat.opacity=Ut,te.glowMat.opacity=(_t.stuck?.28:.85)*Ut,te.trailMat.opacity=_t.stuck?0:ht.trailOpacity*Ut,te.trail.visible=!_t.stuck}ge.update(Tt.position.x,Tt.position.y,Tt.position.z,Dt,Z.camera),o.render(r,ge.camera)},resize(){const Z=Math.max(1,n.clientWidth),Dt=Math.max(1,n.clientHeight);o.setSize(Z,Dt,!1),ge.resize(Z/Dt)},getGroundBasis(){return ge.getGroundBasis()},setCollidersVisible(Z){for(const Dt of h)Dt.opacity=Z?.3:1,Dt.wireframe=Z,Dt.needsUpdate=!0},setGridVisible(Z){u.visible=Z},setLabVisible(Z){g.setVisible(Z)},setLabLabelsVisible(Z){g.setLabelsVisible(Z)},snapCamera(Z,Dt,Tt){ge.snap(Z,Dt,Tt)},setZoom(Z){ge.setZoom(Z)},pickDummy:bn,projectToScreen:Se,diagnostics(){const Z=np(e.camera.pitchDeg),Dt=t1(Z,Zt.rotation.y);return{lean:_.lean(),slashNormal:Dt,arrowForward:_.arrowDirection(),gait:{hipYaw:_.hipYaw(),gaitYaw:_.gaitYaw()},attackBlend:_.attackBlend(),attackWeights:_.attackWeights(),landing:_.landing(),hurt:_.hurt(),ik:_.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:y.rotation.x,activeRings:gt.filter(Tt=>Tt.life>0).length,lastKind:be},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ge.smart()}}},dispose(){_.dispose(),g.dispose();for(const Z of v)Z.dispose();U.dispose();for(const Z of L)Z.dispose();for(const Z of k)Z.dispose();z.dispose(),m.dispose();for(const Z of V)Z.dispose();mt.dispose(),C.dispose(),Gt.dispose(),Nt.dispose(),Bt.dispose(),yt.dispose(),B.dispose(),st.dispose(),ut.dispose();for(const Z of qt)Z.dispose();lt.dispose(),at.dispose(),Pt.dispose(),j.dispose();for(const Z of ft)Z.shaftMat.dispose(),Z.tipMat.dispose(),Z.glowMat.dispose(),Z.trailMat.dispose();le.dispose(),Wt.dispose();for(const Z of gt)Z.mat.dispose();O.dispose();for(const Z of Et)Z.mat.dispose();St.dispose(),f.traverse(Z=>{Z instanceof me&&Z.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function _1(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function y1(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function M1(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function _(){const x=n.status();a.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){d=x,e.hidden=!x,x?_():s.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();_1(x).then(y=>{y?(p("已复制 ✓"),s.hidden=!0):(s.value=x,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),y=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);y1(`harness-${x.meta.version}-${y}.json`,JSON.stringify(x)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&_()},isOpen:()=>d,close:()=>m(!1)}}const b1={intents:{...Mu},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function S1(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=s0(G0,$s),i=v1(n,e,dn,$s.stations),a=d0(e),s=Mg(t),o=bg(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.49 · 11-08 06:19 · 诊断");const l=D=>String(D).padStart(2,"0"),c=new Date,h=U0({meta:{version:"v0.9.49",buildTime:"11-08 06:19",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=M1(h,r),d=vg({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid,showLab:dn.lab.enabled,showLabLabels:dn.lab.showLabels};let g=1,_=!1;const m=T0({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let x=e.combat.weapon;function y(D){if(D===x)return;x=D;const U=aa.indexOf(D)+1;for(const L of p)L.classList.toggle("is-active",Number(L.dataset.weapon)===U);b.refreshWeapon()}let v=b1,R=0;const S=()=>{g=1,i.setZoom(1)},b=eg(e,dn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{g=1,a.singleStep({...Mu,resetPressed:!0})},resetZoom:S,onToggleColliders:D=>i.setCollidersVisible(D),onToggleGrid:D=>i.setGridVisible(D),onToggleLab:D=>i.setLabVisible(D),onToggleLabLabels:D=>i.setLabLabelsVisible(D)}),E=ag({stations:$s.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:b.gui}),window.addEventListener("resize",()=>i.resize()),window.__harness={world:e,view:i,clock:a,input:m,viewConfig:dn,debug:u,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(D,U,L)=>i.projectPoint(D,U,L),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var D;return Object.keys(((D=dn.animation.swing)==null?void 0:D.clips)??{})},preview:D=>{const U=e.combat,L={...U};U.weapon=D.weapon,U.phase="active",U.comboIndex=Math.max(1,Math.min(3,Math.floor(D.comboIndex))),U.attackProgress=Math.max(0,Math.min(1,D.progress)),U.attackFacing=e.character.bodyYaw,i.setClipT(typeof D.t=="number"?D.t:null);const k=Math.max(1,Math.min(30,Math.floor(D.warm??12)));_=!0;for(let H=0;H<k;H++)i.render(e,1/60);return i.setClipT(null),Object.assign(U,L),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:D=>{e.character.bodyYaw=D},zoom:D=>{g=Nh(D,1,dn.zoom.min,dn.zoom.max),i.setZoom(g)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:$s.stations??[],goto:D=>E.goto(D),current:()=>E.current(),recall:()=>E.recall()}};let w=performance.now(),M=60,P=0;function F(D){const U=Math.min((D-w)/1e3,.1);w=D,U>0&&(M=M*.9+1/U*.1);const L=m.sample();L.intents.resetPressed&&(g=1),g=Nh(g,L.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(g);let k=L.intents.dummyClickId;if(L.tap){const z=i.pickDummy(L.tap.x,L.tap.y);z>0&&(k=z)}k>0&&(R=k),v={...L,intents:{...L.intents,dummyClickId:R}};const H=a.frame(U,v.intents,u.timeScale,u.paused,()=>{const z=e.events;for(let V=0;V<z.length;V++)h.event(z[V],e.time)});H>0&&(R=0),h.sample(e,v,U*1e3,H);for(const z of v.gestures)h.gesture(z);D-P>250&&(P=D,f.tick()),y(e.combat.weapon),_||i.render(e,U),E.tick(),d.update(e,v,i.getGroundBasis());const N=i.diagnostics();s.update(e,M,H,v,u,{attackBlend:N.attackBlend,attackWeights:N.attackWeights,landing:N.landing,hurt:N.hurt,ik:N.ik,zoom:N.camera.zoom},o.hudCompact()),requestAnimationFrame(F)}requestAnimationFrame(F)}S1();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const la=["sword-shield","dual-swords","greatsword","staff","bow"],Pr=["wander","follow","keep-distance","attack","idle"],Iu={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},$o=1e-6;function Ls(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>$o?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>$o?Math.atan2(t.moveX,t.moveZ):n.character.facing}function tm(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>$o){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>$o)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Sn=1e-6,wc=Math.PI/180,Cl=-1e9;function Fu(){return{type:"none",lastAt:Cl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function zo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Dh(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Ll(n,t,e){const i=e.duration>0?e.duration:Dl(n,e.type);if(t.kind==="player"){const r=n.playerHurt;if(Dh(r,e.type,i,e.dirX,e.dirZ),r.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Sn){const l=e.knockback*n.config.hits.knockbackDecay;r.knockX=e.dirX*l,r.knockZ=e.dirZ*l}zo(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Dh(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Sn){const r=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*r,a.hurt.knockZ=e.dirZ*r}n.hitCount+=1,zo(n,"hit",a.id,a.position);const s=n.config.hits.hitstop,o=s&&e.type!=="none"?s[e.type]??0:0;o>0&&n.combat.hitstop<o&&(n.combat.hitstop=o,zo(n,"hitstop",o,a.position))}function rr(n,t,e){Ll(n,{kind:"dummy",index:t},e)}function em(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Dl(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function nm(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>Sn?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-Sn||c>r+Sn)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*wc),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),g=n.config.dummies.radius,y=n.config.targeting.idealRange;for(const m of n.dummies){if(t.hitIds.indexOf(m.id)>=0)continue;const p=m.position.x-i.x,v=m.position.z-i.z,_=Math.hypot(p,v);if(_>h+g)continue;const x=_>Sn?p/_:d,R=_>Sn?v/_:u;if(_>Sn&&(p*d+v*u)/_<f)continue;let S="light";t.weapon==="greatsword"?S="knock":t.comboIndex>=3&&(S="heavy");const w=e.knockback[t.weapon]??0;let E=_;w>0&&(E=Math.max(_+w,y));const M=Math.max(0,E-_);rr(n,n.dummies.indexOf(m),{type:S,duration:Dl(n,S),dirX:x,dirZ:R,knockback:M}),t.hitIds.push(m.id)}}function im(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,g=Math.sin(i.facing),y=Math.cos(i.facing),m=Math.cos(kh(s.arcDeg,0,180)*wc),p=n.config.dummies.radius;for(let v=0;v<n.dummies.length;v++){const _=n.dummies[v];if(i.hitIds.indexOf(_.id)>=0)continue;const x=u>Sn?kh(((_.position.x-r)*f+(_.position.z-l)*d)/u,0,1):0,R=r+f*x,S=l+d*x,w=Math.hypot(_.position.x-R,_.position.z-S);let E=!1;if(s.shape==="circle")E=w<=s.radius+p;else if(s.shape==="capsule")E=w<=Math.max(s.radius,s.width)+p;else{const B=_.position.x-c,L=_.position.z-h,D=Math.hypot(B,L),V=D>Sn?(B*g+L*y)/D>=m:!0;E=D<=s.radius+p&&V||w<=s.width+p}if(!E)continue;const M=_.position.x-r,b=_.position.z-l,P=Math.hypot(M,b);if(P>Sn&&(M*g+b*y)/P<Math.cos(Math.max(s.arcDeg,90)*wc))continue;const z=P>Sn?M/P:g,I=P>Sn?b/P:y;Ll(n,{kind:"dummy",index:v},{type:s.type,duration:s.duration,dirX:z,dirZ:I,knockback:s.knockback}),i.hitIds.push(_.id),zo(n,"link-hit",_.id,_.position)}}function am(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>Sn?s/r:0,c=r>Sn?o/r:1;Ll(n,{kind:"player"},{type:"light",duration:Dl(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function sm(n,t){n.modules.hits&&(n.combat.phase==="active"&&nm(n),im(n,t),am(n))}function kh(n,t,e){return n<t?t:n>e?e:n}const zu=Math.PI/180,kl=1e-6;function om(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Zo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Uu(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>kl?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Nu(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,kl)&&s<=Math.max(0,e.inputDeadZone)&&!o}function rm(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function cm(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Nu(n,t,e))return!1;const i=Uu(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>Ou(n,e)}function Ou(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*zu}function lm(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Nu(n,e,a)){Zo(n);return}const s=Uu(n,e,a.lookRange);if(s===null){Zo(n);return}const o=n.character,r=He(s-o.bodyYaw),l=Math.abs(r),c=Ou(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>kl;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*zu);i.targetYaw=He(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+d*rm(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ui=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ks(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,Ui)*i))}function Js(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,Ui)*a)),r=Math.max(i,0)*a;return r<=Ui?n:n+Va(o,-r,r)}function Ih(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Ui)*a)),o=Math.max(i,0)*a;return o<=Ui?n+s:n+Va(s,-o,o)}function Va(n,t,e){return n<t?t:n>e?e:n}function Fh(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function hm(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ui,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Ls(n,e);else if(c)i.facing=Js(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Ls(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Ui)){const b=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,z=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Fh(i.facing,b,P,z);else if(h>=a.facingMinMagnitude&&Math.abs(He(b-i.facing))>a.facingDeadbandDeg*Math.PI/180){const B=Ks(i.facing,b,a.facingSmoothRate,t);i.facing=Fh(i.facing,B,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||cm(n,e)||(c?i.bodyYaw=Js(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Ks(i.bodyYaw,g,a.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const b=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(p-i.bodyYaw))>b&&(p=i.moveYaw)}const v=o||f||m,_=a.maxHeadTurnDeg*Math.PI/180;let x;if(v){const b=c?n.config.gaze.headTurnRate:a.headTurnRate;x=c?Js(i.headYaw,p,b,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Ks(i.headYaw,p,b,t)}else{const b=He(i.headYaw-i.bodyYaw),P=He(p-i.bodyYaw),z=Math.abs(P)<Math.abs(b)-1e-9,I=z?n.config.gaze.headReturnRate:a.headTurnRate,B=z?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(B)?Js(b,P,I,B,t):Ks(b,P,I,t);x=i.bodyYaw+L}const R=He(x-i.bodyYaw);R>_?x=i.bodyYaw+_:R<-_&&(x=i.bodyYaw-_),i.headYaw=x;const S=n.config.gaze;let w=0;if(c)w=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const b=n.dummies[n.targeting.targetId-1];if(b){const P=i.position.y+n.config.characterHeight*Va(S.eyeHeightRatio,0,1),z=b.position.y+n.config.dummies.height*Va(S.aimHeightRatio,0,1),I=Math.hypot(b.position.x-i.position.x,b.position.z-i.position.z);w=Math.atan2(z-P,Math.max(Ui,I))}}const E=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;w=Va(w,-E,E);const M=v?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Ih(i.headPitch,w,M,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Ih(i.bodyPitch,i.headPitch*Va(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Bu=1e-6,cr=Math.PI/180;function lr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function dm(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*cr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(He(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function um(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function fm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*cr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=dm(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),g=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+g*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(um(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}lr(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function pm(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*cr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,lr(n,"projectile-fire",i.volleyId,o)}i.pending=a}function zh(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,lr(n,"channel-end",0,n.character.position))}function mm(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){zh(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),lr(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Ls(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Bu),fm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){zh(n,i);break}}function gm(n,t,e){const i=Math.max(0,e.homingConeDeg)*cr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Bu;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(He(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function xm(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=gm(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=He(h-f),u=r.turnRate*t,g=Math.max(-u,Math.min(u,d)),y=f+g;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){rr(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const vm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;mm(n,t,e,s,a,i.cfg.slot),pm(n,t,s),xm(n,t,s)}},Cr=1e-6;function Hu(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function _m(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Hu(n,"ring-place",i.id,e)}function ym(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Cr),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),y=g>Cr?f/g:0,m=g>Cr?d/g:1;rr(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:m,knockback:e.knockback})}Hu(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Mm={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&_m(n,s),ym(n,t,s)}},bm={channelVolley:vm,groundRing:Mm};function Sm(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function wm(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=bm[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Em(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Gu(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Tm(n,t,e){wm(n,t,e)}function Lr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Uh=1e-6;function Nh(n,t,e){return n<t?t:n>e?e:n}function Vu(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Xu(n){const t=n.camera,e=Vu();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Am(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Nh((e.radius-d)/Math.max(Uh,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*u),a+=g,s+=c.position.x*g,o+=c.position.z*g,r+=1}const l=a<=0?0:Nh(a/(a+Math.max(Uh,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function Rm(n){const t=[],e=n.ground.size;t.push(Sa("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Sa(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Sa(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Sa(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Sa(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Sa(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Sa(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const _i=1e-6;function qo(n,t,e){return n<t?t:n>e?e:n}function Ds(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+_i||c.maxY<i-o-_i||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Il(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+_i||l.minY>=o-_i)continue;const c=qo(t.x,l.minX,l.maxX),h=qo(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>_i*_i){const g=Math.sqrt(u),y=(e-g)/g;t.x+=f*y,t.z+=d*y}else{const g=t.x-l.minX,y=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,v=Math.min(g,y,m,p);v===g?t.x=l.minX-e:v===y?t.x=l.maxX+e:v===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function Fl(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+_i||o.minY>=s-_i)continue;const r=qo(t.x,o.minX,o.maxX),l=qo(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-_i)return!0}return!1}const Fi=1e-6,Qa=Math.PI/180;function zl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ec(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wu(n){n.arrows.length=0}function Pm(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let g=0;u>Fi&&(g=((o-n)*f+(r-e)*d)/u,g=Math.max(0,Math.min(1,g)));const y=n+f*g,m=e+d*g,p=y-o,v=m-r;if(p*p+v*v>h*h)return-1;const _=t+(a-t)*g;return _<l-.1||_>l+c?-1:g}function Cm(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Fi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Qa,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Fi;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(zl(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function Lm(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Qa;return t+$a(zl(s-t),-o,o)}function Dm(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Qa),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Qa),a<=0)return r;const l=n.dummies.find(y=>y.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Fi,s),f=l.position.y+n.config.dummies.height*$a(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,g=$a(u,-s*.45,s*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,s*s-g*g))}}function km(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Cm(n,e),l=Lm(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,g=Dm(n,f,u,d,r,s),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Qa};return n.arrows.push(y),Ec(n,"arrow-shot",a,y),y}function $a(n,t,e){return n<t?t:n>e?e:n}function Im(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const x=n.dummies[c.stuckDummy];if(x){const R=Math.cos(x.bodyYaw),S=Math.sin(x.bodyYaw);c.x=x.position.x+c.offX*R+c.offZ*S,c.y=x.position.y+c.offY,c.z=x.position.z-c.offX*S+c.offZ*R,c.yaw=x.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const x=n.dummies.find(R=>R.id===c.targetId);if(!x)c.targetId=0;else{const R=Math.hypot(c.vx,c.vz);if(R>Fi){const S=Math.atan2(x.position.x-c.x,x.position.z-c.z),w=Math.atan2(c.vx,c.vz),E=c.turnRate*t,M=w+$a(zl(S-w),-E,E);c.vx=Math.sin(M)*R,c.vz=Math.cos(M)*R;const b=Math.hypot(x.position.x-c.x,x.position.z-c.z);if(b>.3){const P=b/R,I=(x.position.y+s*$a(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,B=Math.max(0,i.verticalTurnRate)*t;c.vy+=$a(I-c.vy,-B,B)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,g=f+c.vy*t,y=d+c.vz*t;let m=-1,p=2;if(o)for(let x=0;x<n.dummies.length;x++){const R=n.dummies[x],S=Pm(h,f,d,u,g,y,R.position.x,R.position.z,R.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,m=x)}if(m>=0){const x=n.dummies[m];c.x=h+(u-h)*p,c.y=f+(g-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=m;const R=Math.cos(x.bodyYaw),S=Math.sin(x.bodyYaw),w=c.x-x.position.x,E=c.z-x.position.z;c.offX=w*R-E*S,c.offZ=w*S+E*R,c.offY=c.y-x.position.y;const M=Math.atan2(c.vx,c.vz);c.localYaw=M-x.bodyYaw,c.yaw=M,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const b=Math.hypot(c.vx,c.vz);rr(n,m,{type:"light",duration:.22,dirX:b>Fi?c.vx/b:0,dirZ:b>Fi?c.vz/b:1,knockback:.14}),Ec(n,"arrow-land",x.id,c),l.push(c);continue}const v=Ds(n.boxes,u,y,g+.4,.04,0,6),_=Number.isFinite(v)?v:0;if(g<=_+.02&&c.vy<0){c.x=u,c.y=_+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const x=Math.atan2(-c.vy,Math.max(Fi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(x,Math.max(0,i.stickMinPitchDeg)*Qa),c.rest=Math.max(.2,i.stickSec),Ec(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=g,c.z=y,l.push(c)}n.arrows=l}const Tc=1e-6,Fm=Math.PI/180;function Ac(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ul(n,t,e){return n<t?t:n>e?e:n}function hr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Rc(n){const t=n.id,e=n.windowId;Object.assign(n,hr()),n.id=t,n.windowId=e}function zm(n){Rc(n)}function Yu(n){Rc(n.playerLink);for(const t of n.dummies)Rc(t.link)}function Um(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Pc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function jo(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,hr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Nm(n,t){const e=n.config.links.search,i=n.character.position,a=Ul(e.maxAngleDeg,0,180)*Fm;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<Tc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(He(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function Om(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Ls(n,t),l=Nm(n,r),c=l.id>0?l.yaw:r,h=l.id>0?Ul(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Ac(n,"link-start",s.id)}function Bm(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){jo(n);return}if(e.weapon!==n.combat.weapon){jo(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Ac(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Ac(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Ul(r/o,0,1):1,e.phase==="active"&&i.active>Tc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Tc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Hm(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&jo(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Pc(n,"sprint"),a.prevSprinting=r,Bm(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&Om(n,e,l,o.weapon)}const Uo={windup:0,active:1,recovery:2},Oh=1e-9;function $u(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function Gm(n){return n==="windup"||n==="active"||n==="recovery"}function Vm(n,t){return Uo[n]+$u(t)}function Xm(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!Gm(s.at))continue;const o=$u(s.u??0),r=Uo[s.at]+o;r>i+Oh&&r<=e+Oh&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Uo[s.at]+s.u-(Uo[o.at]+o.u)),a}const ks=1e-6;function zi(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Wm(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Zu(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function dr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.timings=Zu()}function Ym(n){return{weapon:la[Math.max(0,n-1)]??la[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],timings:Zu()}}function $m(n,t){return Ls(n,t)}function Zm(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function qu(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=$m(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.notifyCursor=-1,a.hitIds.length=0,zi(n,"attack-start",i)}function ju(n){return Math.max(0,n.config.combat.settle)}function Cc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];qu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:ju(n),lunge:Zm(n,i.lunge[e-1]??0)},e)}function Bh(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,qu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:ju(n),lunge:i.lunge},0),km(n,e,n.combat.attackFacing),zi(n,"charge-release",e)}function qm(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;if(i.hitstop>0)return;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",zi(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",zi(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Cc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>ks&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Cc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1),jm(n)}function jm(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>ks?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Vm(t.phase,a);if(s<=t.notifyCursor+ks)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of Xm(o,t.notifyCursor,s))Wm(n,r.name,r.value);t.notifyCursor=s}function Km(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=la.length){const l=la[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,dr(n),jo(n),zi(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,zi(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),qm(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Cc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,zi(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,ks)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Bh(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?Bh(n,e,l):zi(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>ks)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=y=>c*(1-Math.pow(1-Math.min(1,Math.max(0,y/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let g=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);g=Math.min(g,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*g,n.impulse.z=Math.cos(i.attackFacing)*g}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const Lc=1e-6;function Dr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Jm(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Ku(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Hh(n,t,e){return n<t?t:n>e?e:n}function Qm(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Lc;){const d=Math.min(l,c+r),u=s.x+t*d,g=s.z+e*d,y=Hh(u,o.minX,o.maxX),m=Hh(g,o.minZ,o.maxZ),p={x:y,y:s.y,z:m};if(Fl(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=m,c=d,y!==u||m!==g))break}return{x:h,z:f}}function t0(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Pc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Dr(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&dr(n));const l=tm(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=Qm(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Pc(n,"blink"),Dr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Lc,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Dr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Lc,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const on=1e-6,Dc=Math.PI*2,e0=7,n0=18;function i0(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Gh(n,t,e,i){return n+i0(t-n)*(1-Math.exp(-Math.max(e,on)*i))}function Nl(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function a0(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Fu(),link:hr()})}return t}function s0(n){const t=Pr.indexOf(n);return Pr[(t+1)%Pr.length]}function Ju(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,zm(i.link)}n.dummyAttackCount=0}function o0(n,t,e){const i=Lr(n)*Dc,a=Math.sqrt(Lr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Lr(n)*.8)}function r0(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function c0(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(r0(t,i),on);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Nl(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function l0(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>on?a/o:0,l=o>on?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&o0(n,t,e);const y=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(y,m);p>on&&(c=y/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>on&&(f=Math.atan2(c,h)):o>on&&(f=Math.atan2(r,l)),e.leashRadius>on&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const y=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;c=c*(1-y)+m*y,h=h*(1-y)+p*y;const v=Math.hypot(c,h);v>on&&(c/=v,h/=v)}}return{x:c,z:h,facing:f}}function h0(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+on&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Nl(n,"dummy-attack",e))}c0(n,e,t,i);const a=l0(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-on||a.x<0&&e.position.x<=s.minX+on)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-on||a.z<0&&e.position.z<=s.minZ+on)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,on)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Gh(e.bodyYaw,e.facing,e0,t),e.headYaw=Gh(e.headYaw,e.facing,n0,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Il(n.boxes,e.position,i.radius,i.height,c))if(Fl(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,v=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(v)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Ds(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+on&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const g=Math.hypot(e.velocity.x,e.velocity.z),y=Math.min(n.config.strideSpeedCap,g/Math.max(n.config.moveSpeed,on)),m=Math.max(n.config.strideLength*(1+y*n.config.strideSpeedGain),on);e.stride=m,e.gaitPhase=(e.gaitPhase+u/m*Dc)%Dc}function d0(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=s0(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,Nl(n,"dummy-mode",a)}for(const a of n.dummies)h0(n,t,a,i)}const Wn=1e-6,Vh=Math.PI*2;function Xh(n,t){return Math.sqrt(n*n+t*t)}function Qs(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function u0(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,dr(n)}function f0(n,t,e){const i=n.character,a=n.config,s=Ds(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,dr(n),Yu(n),Ku(n),Gu(n),Wu(n),Zo(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Cl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function p0(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Xh(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-Wn||r<0&&s.x<=h.minX+Wn)&&(r=0),(l>0&&s.z>=h.maxZ-Wn||l<0&&s.z<=h.minZ+Wn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",g=f||u||d;a.sprinting=!g&&e.sprintHeld&&c>Wn;const y=i.combat.weapons[n.combat.weapon];let m=y?y.moveMultiplier:1;u||d?m=0:f?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*m;{const I=g?i.skillDecel:c>Wn?i.acceleration:i.friction,B=1-Math.exp(-I*t);o.x+=(r*p-o.x)*B,o.z+=(l*p-o.z)*B}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Qs(n,"jumped",i.jumpSpeed)),n.events.some(I=>I.type==="blink"&&I.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const _=s.x,x=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Il(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Fl(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=_,s.z=x,o.x=0,o.z=0;else{const I=s.x-_,B=s.z-x;Math.abs(I)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(B)<Math.abs(o.z*t)*.5&&(o.z=0)}Qs(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Ds(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+Wn&&S-s.y<=i.stepHeight+Wn&&(s.y=S,o.y=0,Qs(n,"stepUp",S));const w=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=Ds(n.boxes,s.x,s.z,w,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||Qs(n,"landed",E),a.grounded=!0):a.grounded=!1;const M=Xh(s.x-_,s.z-x);a.distance+=M;const b=M/Math.max(t,Wn),P=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Wn)),z=Math.max(i.strideLength*(1+P*i.strideSpeedGain),Wn);a.stride=z,a.gaitPhase=(a.gaitPhase+M/z*Vh)%Vh}const kc=1e-6,Wh=2.399963229728653;function ia(n,t,e){return n<t?t:n>e?e:n}function Yh(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,g,y;f<kc?(u=r,g=l,y=d):(u=c/f,g=h/f,y=d-f);const m=y+o;n.x-=u*m*a,n.z-=g*m*a,t.x+=u*m*s,t.z+=g*m*s}function m0(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*Wh;Yh(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*Wh;Yh(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Il(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=ia(h.position.x,c.minX,c.maxX),h.position.z=ia(h.position.z,c.minZ,c.maxZ)}function g0(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=ia(r.minScale,0,1);if(l<kc||c<=0||h>=1)return 1;const f=a+o,d=ia(r.approachDot,0,.99);let u=0;for(const g of s){const y=g.position.x-n,m=g.position.z-t,p=Math.hypot(y,m);if(p>=f+c)continue;if(p<kc){u=1;continue}const v=(e*y+i*m)/(l*p);if(v<=d)continue;const _=ia(1-(p-f)/c,0,1),x=ia((v-d)/(1-d),0,1);u=Math.max(u,_*x)}return 1-(1-h)*ia(u,0,1)}function x0(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=g0(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const kr=1e-6,v0=Math.PI/180;function _0(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function y0(n,t,e){return n<t?t:n>e?e:n}function M0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>kr?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>kr&&(o=Math.atan2(e.moveX,e.moveZ));const l=y0(i.maxAngleDeg,0,180)*v0;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-s.x,y=u.position.z-s.z,m=Math.hypot(g,y);if(m<kr||m>i.range)continue;const p=Math.atan2(g,y),v=Math.abs(He(p-o));if(v>l)continue;const _=m-i.frontBias*Math.cos(v);_<c&&(c=_,h=u.id,f=p,d=m)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const ai=1e-6;function Xa(n,t,e){return n<t?t:n>e?e:n}function $h(n){return Math.atan2(Math.sin(n),Math.cos(n))}function b0(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(I,B)=>{const L=I.position.x-s.x,D=I.position.z-s.z,V=Math.hypot(L,D);if(V<ai||V>B)return 0;const O=Xa((B-V)/Math.max(ai,B-i.nearDistance),0,1);let F=O*(i.modeWeight[I.mode]??.5);return I.attackPhase==="active"&&(F+=i.attackBoost*O),F},r=[];let l=0,c=!1,h=!1,f=!1;for(const I of n.dummies){const B=o(I,i.threatRange),L=I.position.x-s.x,D=I.position.z-s.z,V=Math.hypot(L,D);B>0&&(r.push({id:I.id,x:I.position.x,z:I.position.z,dx:L,dz:D,yaw:Math.atan2(L,D),w:B}),l+=B,V<=i.approachDist&&(i.modeWeight[I.mode]??.5)>=i.hostileModeWeight&&(f=!0)),V>ai&&V<=i.recoveryDist&&(c=!0),(I.attackPhase==="windup"||I.attackPhase==="active")&&V<=i.threatRange&&(h=!0)}const d=l<=0?0:Xa(l/(l+Math.max(ai,i.saturation)),0,1),u=r.length>0,g=a.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>ai&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(a.active=y||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((I,B)=>B.w-I.w);const v=r.slice(0,Math.max(1,i.maxThreats)),_=r[0],x=Math.atan2(_.dx,_.dz),R=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let w=0,E=0,M=0;for(const I of v){const B=Math.abs($h(I.yaw-x))/Math.PI;let L=I.w/(1+Math.max(i.spreadFalloff,0)*B*B);I!==_&&i.behindFalloff<1&&Math.abs($h(I.yaw-S))>R&&(L*=Math.max(i.behindFalloff,0)),w+=I.x*L,E+=I.z*L,M+=L}a.mainId=_.id,a.mainYaw=x;const b=n.dummies.find(I=>I.id===_.id),P=(b?b.position.y:0)+n.config.dummies.height*Xa(i.aimHeightRatio,0,1),z=s.y+n.config.characterHeight*Xa(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-z,Math.max(ai,Math.hypot(_.dx,_.dz))),a.centroidYaw=M>ai?Math.atan2(w/M-s.x,E/M-s.z):x,a.threatCount=r.length,a.threat=d}function S0(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function w0(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<ai||a>e.threatRange)return 0;const s=Math.max(ai,e.threatRange-e.nearDistance),o=Xa((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(ai,e.modeWeight.attack??1.5);return Xa(r/l,0,1)}function E0(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function T0(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:Rm(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Ym(1),playerLink:hr(),arrows:[],arrowSeq:0,abilities:Em(),skills:Sm(n),impulse:{x:0,z:0},targeting:_0(),turnInPlace:om(),playerHurt:Fu(),hitCount:0,dash:{...Jm(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Vu(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:E0(),dummies:a0(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function A0(n){u0(n),Ju(n),Yu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Cl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Gu(n),Wu(n),Ku(n),Xu(n),Zo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Zh(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){A0(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?M0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Hm(n,t,e),n.modules.combat&&Km(n,t,e),n.modules.dash&&t0(n,t,e),n.modules.movement&&p0(n,t,e),n.modules.gaze&&b0(n,t,e),n.modules.orientation&&hm(n,t,e),lm(n,t,e),n.modules.dummies&&d0(n,t,e),em(n,t),Um(n,t),n.modules.abilities&&Tm(n,t,e),n.modules.combat&&Im(n,t),n.modules.dummies&&(sm(n,t),n.modules.separation&&(m0(n),x0(n))),n.modules.camera?Am(n):Xu(n),n}const Qu=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],qh=1e-9;function R0(n,t,e){return n<t?t:n>e?e:n}function tf(n){return R0(Number.isFinite(n)?n:0,0,1)}function ef(n,t){const e=tf(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function P0(){const n={};for(const t of Qu)n[t]=0;return n}function C0(n,t){const e=P0(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=tf(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+qh;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>qh?(a-o.t)/l:0,h=ef(o.ease??"linear",c);for(const f of Qu){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function L0(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=ef(i,t/a);return e.turns*Math.PI*2*s}function Xi(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function D0(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Zh(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Zh(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const nf={slopPx:12,longPressMs:450,doubleTapMs:280};function k0(n,t,e=nf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Wi(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function I0(n=nf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Wi(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Wi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Wi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Wi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),Wi(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Wi(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Wi(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Ir=.001,F0=18;function Ic(n,t,e){return n<t?t:n>e?e:n}function Fc(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function z0(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function U0(n,t,e,i,a=F0){const s=z0(t);if(!s)return{state:Fc(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Ir)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<Ir?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Ir)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Ic(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function jh(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Ic(r,a,s):Ic(n,a,s)}function N0(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function O0(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Fr=["jump","sprint","reset","attack","skill2"],B0=8,H0=16,zr=10,Kh=14,Jh=140,G0=18,V0=16,X0=400,W0=1.0001;function No(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Y0(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&No(e)}function $0(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,g=0,y=null,m=-1,p=0,v=0,_=0,x=0,R=!1,S=0,w=1,E=0,M=null,b=0,P=0,z=!1,I=null,B=null,L=0,D=0,V=0,O=0,F=!1,X=!0,nt=-1;const at=I0({slopPx:Kh,longPressMs:450,doubleTapMs:350});let ot=[],Q=null;const q=new Set;function gt(H){H&&ot.push(H)}const J=new Map;let yt=Fc(),Dt=!1,zt=1;function $t(){const H=Array.from(J.values()),lt=a(),pt=U0(yt,H,lt.pinchGain,lt.maxStepRatio,G0);if(yt=pt.state,Dt=pt.pinching,pt.scale!==1&&(zt*=pt.scale),pt.started||pt.armedNow)M=null,z=!0,I=null;else if(pt.ended&&o===null&&H.length===1){const Gt=H[0];o=Gt.id,r=Gt.x,l=Gt.y,c=0,h=0,f=Gt.x,d=Gt.y,R=!1,S=0,w=1,E=0,performance.now(),M=null,z=!0,I=null}}const Tt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},kt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let N=0,fe=0;const vt={},Ht=new Set,Ut=[];function Lt(){for(const H of Fr)vt[H]!==void 0&&(vt[H]=void 0),Z(H);at.reset(),q.clear(),J.clear(),yt=Fc(),Dt=!1,o=null,c=0,h=0,f=0,d=0,R=!1,S=0,w=1,E=0,p=0,v=0,_=0,x=0,y=null,m=-1,M=null,z=!1,I=null,B=null,nt=-1,V=0,O=0,F=!1,X=!0}const Ct=()=>{document.hidden&&Lt()},C=H=>{if(H.clientX===0&&H.clientY===0){g++;return}if(No(H.target)||Y0(H.clientX,H.clientY)){q.add(H.pointerId);return}if(q.delete(H.pointerId),J.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),o===null&&!Dt){y=null,m=-1,o=H.pointerId,r=H.clientX,l=H.clientY,c=0,h=0,f=H.clientX,d=H.clientY,performance.now();const lt=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY)&&(H.screenX!==0||H.screenY!==0);R=lt,S=0,w=1,E=0,p=lt?H.screenX:0,v=lt?H.screenY:0,_=p,x=v,M=H.pointerId,b=H.clientX,P=H.clientY,z=!1}$t()},T=H=>{if(H.pointerId===B&&(H.pointerType==="mouse"&&H.buttons===0||H.clientX===0&&H.clientY===0&&(L!==0||D!==0)||(X?(V=H.clientX-L,O=H.clientY-D):(L=H.clientX,D=H.clientY,X=!0,V=0,O=0))),gt(at.move(H.pointerId,H.clientX,H.clientY,performance.now())),!q.has(H.pointerId)&&J.has(H.pointerId)&&(J.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),$t()),q.has(H.pointerId)||H.pointerId!==o)return;const lt=performance.now();if(y===H.pointerId&&lt-m<150){g++;return}const pt=H.clientX,Gt=H.clientY;if(pt===0&&Gt===0&&(r!==0||l!==0)){g++;return}const Zt=pt-f,U=Gt-d,Mt=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY),it=Mt?H.screenX:0,ht=Mt?H.screenY:0,wt=Mt&&(it!==0||ht!==0),Et=it-_,Kt=ht-x;if(R&&wt){const Te=Math.hypot(Et,Kt),De=Math.hypot(Zt,U);if(Te>3){if(S=0,E<30&&De>6&&Et*Zt+Kt*U>.7*Te*De){const Ye=Te/De;Ye>.2&&Ye<5&&(w+=(Ye-w)*.3,E++)}}else De>12&&(S++,S>=2&&(R=!1))}const ie=Math.hypot(Zt,U);if(!R){const Te=u<0?Number.POSITIVE_INFINITY:lt-u,De=wt?Math.hypot(Et,Kt):1/0;ie>28&&(Te<200||De<ie*.4)&&(r+=Zt,l+=U,g++)}f=pt,d=Gt,_=it,x=ht,H.pointerId===M&&Math.hypot(H.clientX-b,H.clientY-P)>B0&&(z=!0);let pe,ne;R&&wt?(pe=(it-p)/w,ne=(ht-v)/w):(pe=pt-r,ne=Gt-l);const Me=Math.hypot(pe,ne),Be=s();Me>Be&&(pe*=Be/Me,ne*=Be/Me);const fn=Math.hypot(c,h),ze=Math.hypot(pe,ne);if(fn>10&&ze>10){const Te=Math.abs(Math.atan2(c*ne-h*pe,c*pe+h*ne)),De=Math.max(fn,ze)*Te,Ye=Math.max(Math.hypot(Zt,U),Math.hypot(Et,Kt)/Math.max(.2,w));if(Te>.6&&Ye<Math.max(6,De*.5)){g++;return}}c=pe,h=ne};function Z(H){if(!Tt[H])return;Tt[H]=!1,H==="attack"&&(kt.attackReleased=!0);const lt=document.getElementById(`btn-${H}`);lt==null||lt.classList.remove("is-down")}function dt(){o!==null&&(y=o,m=performance.now(),o=null,c=0,h=0,f=0,d=0,R=!1,S=0,w=1,E=0,p=0,v=0,_=0,x=0)}const ut=H=>{const lt=J.delete(H.pointerId),pt=q.delete(H.pointerId);lt&&$t(),H.pointerId===B&&(B=null,F?nt=performance.now():(V=0,O=0,nt=-1)),gt(at.end(H.pointerId,H.clientX,H.clientY,performance.now()));for(const Vt of Fr)vt[Vt]===H.pointerId&&(vt[Vt]=void 0,Z(Vt));const Gt=!lt&&!pt&&J.size<=1&&o!==null;(H.pointerId===o||J.size===0||Gt)&&dt(),!pt&&H.pointerId===M&&(!z&&!No(H.target)&&(I={x:H.clientX,y:H.clientY}),M=null)};for(const H of Fr){const lt=document.getElementById(`btn-${H}`);if(!lt)continue;const pt=H==="attack"||H==="skill2",Gt=U=>{if(U.preventDefault(),vt[H]===void 0){vt[H]=U.pointerId,Tt[H]=!0,H==="jump"&&(kt.jump=!0),H==="reset"&&(kt.reset=!0),H==="sprint"&&(kt.sprintPressed=!0),H==="attack"&&(kt.attackPressed=!0),H==="skill2"&&(kt.skill2=!0),lt.classList.add("is-down"),gt(at.begin(H,U.pointerId,U.clientX,U.clientY,performance.now()));try{lt.setPointerCapture(U.pointerId)}catch{}pt&&(B=U.pointerId,L=U.clientX,D=U.clientY,X=!(U.clientX===0&&U.clientY===0),V=0,O=0,F=!1,nt=-1)}},Vt=U=>{vt[H]===U.pointerId&&(vt[H]=void 0,Z(H),gt(at.end(U.pointerId,U.clientX,U.clientY,performance.now())))},Zt=U=>{vt[H]===U.pointerId&&(vt[H]=void 0,Z(H),gt(at.cancel(U.pointerId,performance.now())))};lt.addEventListener("pointerdown",Gt),lt.addEventListener("pointerup",Vt),lt.addEventListener("pointercancel",Zt),Ut.push(()=>{lt.removeEventListener("pointerdown",Gt),lt.removeEventListener("pointerup",Vt),lt.removeEventListener("pointercancel",Zt)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const H of rt){const lt=pt=>{pt.preventDefault(),N=Number(H.dataset.weapon)||0};H.addEventListener("pointerdown",lt),Ut.push(()=>H.removeEventListener("pointerdown",lt))}const It=H=>{const lt=H.key.toLowerCase();if((lt===" "||lt.startsWith("arrow"))&&H.preventDefault(),Ht.has(lt))return;Ht.add(lt),lt===" "&&(kt.jump=!0),lt==="r"&&(kt.reset=!0),lt==="shift"&&(kt.sprintPressed=!0),lt==="j"&&(kt.attackPressed=!0),lt==="k"&&(kt.skill2=!0),lt>="1"&&lt<="5"&&(N=Number(lt)),lt>="6"&&lt<="9"&&(fe=Number(lt)-5);const pt=Math.max(W0,a().keyStep||1.12);(lt==="="||lt==="+")&&(zt*=pt),(lt==="-"||lt==="_")&&(zt/=pt)},K=H=>{const lt=H.key.toLowerCase();Ht.has(lt)&&(Ht.delete(lt),lt==="j"&&(kt.attackReleased=!0))},xt=H=>{if(No(H.target))return;H.preventDefault();const lt=H.deltaMode===1?H.deltaY*V0:H.deltaMode===2?H.deltaY*X0:H.deltaY;zt*=N0(lt,a().wheelStep)},Ft=H=>{H.preventDefault()},st=()=>{u=performance.now()};window.addEventListener("resize",st),window.addEventListener("orientationchange",st);const St=typeof window<"u"?window.visualViewport:null;return St&&(St.addEventListener("resize",st),St.addEventListener("scroll",st)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",T),window.addEventListener("pointerup",ut),window.addEventListener("pointercancel",ut),window.addEventListener("blur",Lt),document.addEventListener("visibilitychange",Ct),window.addEventListener("keydown",It),window.addEventListener("keyup",K),window.addEventListener("wheel",xt,{passive:!1}),window.addEventListener("gesturestart",Ft),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:g,screenOk:R,originSX:p,originSY:v,screenX:_,screenY:x,scale:w}},peekAim(){const H=performance.now(),lt=Math.hypot(V,O),pt=B!==null||nt>=0&&H-nt<Jh;if(!(pt&&F&&lt>=zr))return{active:!1,holding:pt,x:0,z:0,dx:V,dy:O};const Vt=i(),Zt=V/lt,U=O/lt,Mt=Vt.rightX*Zt+Vt.forwardX*-U,it=Vt.rightZ*Zt+Vt.forwardZ*-U,ht=Math.hypot(Mt,it)||1;return{active:!0,holding:pt,x:Mt/ht,z:it/ht,dx:V,dy:O}},sample(){var pn;const H=s();let lt=o!==null?Math.max(-1,Math.min(1,c/H)):0,pt=o!==null?Math.max(-1,Math.min(1,h/H)):0,Gt=0,Vt=0;(Ht.has("a")||Ht.has("arrowleft"))&&(Gt-=1),(Ht.has("d")||Ht.has("arrowright"))&&(Gt+=1),(Ht.has("w")||Ht.has("arrowup"))&&(Vt-=1),(Ht.has("s")||Ht.has("arrowdown"))&&(Vt+=1),lt+=Gt,pt+=Vt;let Zt=Math.hypot(lt,pt);Zt>1&&(lt/=Zt,pt/=Zt,Zt=1);const U=lt,Mt=pt;Zt<e&&(lt=0,pt=0);const it=i();let ht=it.rightX*lt+it.forwardX*-pt,wt=it.rightZ*lt+it.forwardZ*-pt;const Et=Math.hypot(ht,wt);Et>1&&(ht/=Et,wt/=Et);const Kt=performance.now();gt(at.poll(Kt));const ie=Math.hypot(V,O);B!==null&&(ie>=H0?F=!0:ie<zr&&(F=!1));const pe=B!==null||nt>=0&&Kt-nt<Jh,ne=pe&&F&&ie>=zr;let Me=0,Be=0;if(ne){const nn=V/ie,W=O/ie,Rt=it.rightX*nn+it.forwardX*-W,bt=it.rightZ*nn+it.forwardZ*-W,Qt=Math.hypot(Rt,bt)||1;Me=Rt/Qt,Be=bt/Qt}!pe&&B===null&&(V=0,O=0,nt=-1,F=!1);const fn=I;I=null;const ze=zt;zt=1;const Te={moveX:ht,moveZ:wt,jumpPressed:kt.jump,sprintHeld:Tt.sprint||Ht.has("shift"),sprintPressed:kt.sprintPressed,resetPressed:kt.reset,attackPressed:kt.attackPressed,attackHeld:Tt.attack||Ht.has("j"),attackReleased:kt.attackReleased,skill2Pressed:kt.skill2,weaponSlot:N,dummyClickId:fe,aimX:Me,aimZ:Be,aimActive:ne};kt.jump=!1,kt.reset=!1,kt.sprintPressed=!1,kt.attackPressed=!1,kt.attackReleased=!1,kt.skill2=!1,N=0,fe=0;const De=ot.map(nn=>k0(nn,it,Kh));ot=[],De.length>0&&(Q=De[De.length-1]);const Ye=o!==null?"pointer":Ht.size>0?"keyboard":"idle";return{intents:Te,stickX:lt,stickY:pt,stickRawX:U,stickRawY:Mt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:R,stickOriginSX:p,stickOriginSY:v,stickScreenX:_,stickScreenY:x,stickScale:w,stickVpTop:((pn=O0())==null?void 0:pn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:V,aimDY:O,source:Ye,tap:fn,zoomScale:ze,gestures:De,lastGesture:Q}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",ut),window.removeEventListener("pointercancel",ut),window.removeEventListener("blur",Lt),document.removeEventListener("visibilitychange",Ct),window.removeEventListener("keydown",It),window.removeEventListener("keyup",K),window.removeEventListener("wheel",xt),window.removeEventListener("resize",st),window.removeEventListener("orientationchange",st),St&&(St.removeEventListener("resize",st),St.removeEventListener("scroll",st)),window.removeEventListener("gesturestart",Ft),at.reset();for(const H of Ut)H()}}}const Ko=1,Jo=2,Qo=4,af=8,tr=16,Es=32,sf=64,of=128,Z0=[[Ko,"atk"],[Jo,"dash"],[Qo,"link"],[af,"air"],[tr,"hurt"],[Es,"aim"],[sf,"spr"],[of,"chan"]];function wa(n){if(n===0)return"-";const t=Z0.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const q0=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],j0=0,K0=15,Ur=19,J0=21,Q0=22,tg=23,eg=24,ni={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Rn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Yn=n=>Math.round(n*180/Math.PI*10)/10,Nr=Math.PI*2;function fs(n){let t=n%Nr;return t>Math.PI&&(t-=Nr),t<-Math.PI&&(t+=Nr),t}function ng(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Ko),n.dash.phase!=="idle"&&(e|=Jo),n.playerLink.phase!=="idle"&&(e|=Qo),n.character.grounded||(e|=af),n.playerHurt.type!=="none"&&(e|=tr),t.intents.aimActive&&(e|=Es),n.character.sprinting&&(e|=sf),n.abilities.channeling&&(e|=of),e}function ig(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function ag(n){const t={sampleHz:n.sampleHz??ni.sampleHz,sampleCapacity:n.sampleCapacity??ni.sampleCapacity,eventCapacity:n.eventCapacity??ni.eventCapacity,anomalyCapacity:n.anomalyCapacity??ni.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??ni.dirJumpDeg,aimDropDeg:n.aimDropDeg??ni.aimDropDeg,freezeMs:n.freezeMs??ni.freezeMs,freezeSpeed:n.freezeSpeed??ni.freezeSpeed,stickLostMs:n.stickLostMs??ni.stickLostMs,spikeMs:n.spikeMs??ni.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",g=-1,y=-1,m=-1,p=0,v=-1e9,_=-1,x={},R=null,S=0,w=0,E=0,M=0;function b(L,D){const V=1/t.sampleHz,O=L[j0];O-c<V-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=O)}function P(L,D,V,O,F,X){const nt=x[L]??-1e9;if(D-nt<1.2)return;if(x[L]=D,L==="frameSpike"){let ot=0;for(const Q of s)Q.kind==="frameSpike"&&ot++;if(ot>=6)return}s.length>=t.anomalyCapacity&&s.shift();let at=i.slice(-7);X&&(at.length===0||at[at.length-1]!==X)&&(at=[...at.slice(-6),X]),s.push({kind:L,t:Rn(D),tick:V,ms:Math.round(O),detail:F,ctx:at}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function z(L,D,V,O){a.length>=t.eventCapacity&&a.shift(),a.push({t:Rn(V),tick:O,k:L,d:D})}function I(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":v=L.tick;break}}function B(){const L=o,D=L.wallMs/1e3,V=L.gestures,O=at=>Object.entries(V).filter(([ot])=>ot.endsWith(`.${at}`)).reduce((ot,[,Q])=>ot+Q,0),F=[];if(F.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),F.push(`运行 ${D.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),F.push(`摇杆活跃 ${D>0?Math.round(L.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${O("press")}（单击 ${O("tap")} / 双击 ${O("doubleTap")} / 拖拽 ${O("drag")} / 长按 ${O("longPress")} / 打断 ${O("cancel")} / 拖放 ${O("release")}）`),F.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),F.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),F.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const at of s.slice(-6)){F.push(`· ${at.kind} @t${at.t.toFixed(2)} tick${at.tick} ${at.ms>0?`${at.ms}ms `:""}${at.detail}`);const ot=at.ctx.map(q=>String(q[K0])).join(" "),Q=at.ctx.map(q=>q[Ur]===""||q[Ur]==null?".":String(q[Ur])).join(" ");if(F.push(`  yaw ${ot}`),F.push(`  in  ${Q}`),at.kind==="stickJump"||at.kind==="stickBad"||at.kind==="stickLost"){const q=at.ctx.map(J=>`${J[J0]},${J[Q0]}`).join(" "),gt=at.ctx.map(J=>`${J[tg]},${J[eg]}`).join(" ");F.push(`  o   ${q}`),F.push(`  p   ${gt}`)}}if(a.length>0){F.push("最近事件：");for(const at of a.slice(-12))F.push(`  ${at.t.toFixed(2)} ${at.k} ${at.d}`.trimEnd())}const X=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",nt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return F.push(`摇杆坐标源 ${X}${nt}`),F.push(`UA ${e.ua}`),F.join(`
`)}return{sample(L,D,V,O=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=O,o.wallMs+=V,V>o.dtMax&&(o.dtMax=V),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const F=L.time;if(l<0&&(l=F),E=F,M=L.tick,!r)return;const X=L.character,nt=Math.hypot(D.stickX,D.stickY),at=Math.hypot(X.velocity.x,X.velocity.z);u=L.combat.weapon;const ot=ng(L,D),Q=X.facing,gt=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;nt>.2&&(o.stickActiveMs+=V);const J=[Rn(F),L.tick,Math.round(V*10)/10,Rn(D.stickX),Rn(D.stickY),Rn(D.stickRawX),Rn(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Rn(D.intents.moveX),Rn(D.intents.moveZ),Rn(X.position.x),Rn(X.position.z),Rn(X.velocity.x),Rn(X.velocity.z),Yn(Q),Yn(X.bodyYaw),ot,Rn(X.stride),gt===null?"":Yn(gt),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];b(J);const yt=F*1e3<_;if(V>t.spikeMs&&!yt&&F-l>.6&&(o.spikes++,P("frameSpike",F,L.tick,V,`dt ${V.toFixed(0)}ms fl=${wa(ot)}`,J)),h!==null&&!yt){const Lt=Math.abs(Yn(fs(Q-h))),Ct=Math.abs(Yn(fs(X.moveYaw-f))),C=(d|ot)&(Ko|Jo|Qo|tr)|ot&Es,T=gt===null?null:Math.abs(Yn(fs(Q-gt))),Z=gt===null||h===null?null:Math.abs(Yn(fs(h-gt))),dt=T!==null&&Z!==null&&T<Z-.5,ut=(d&Es)!==0&&(ot&Es)===0&&gt===null,rt=T!==null&&(T<=12||dt);Lt>t.aimDropDeg&&ut?P("aimDrop",F,L.tick,0,`${Lt.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${wa(ot)}`,J):Lt>t.dirJumpDeg&&C===0&&!ut&&(rt?(o.inTurns++,Lt>o.inTurnMax&&(o.inTurnMax=Lt)):P("dirJump",F,L.tick,0,`${Lt.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${Yn(h)}→${Yn(Q)} in ${gt===null?".":Yn(gt)}° mvΔ${Ct.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${wa(d)}→${wa(ot)}`,J))}const Dt=(ot&(Ko|Jo|Qo|tr))!==0,zt=L.tick-v<30;nt>.35&&at<t.freezeSpeed&&!Dt&&!zt?(g<0&&(g=F),F-g>=t.freezeMs/1e3&&F>=y&&(P("moveFreeze",F,L.tick,(F-g)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${at.toFixed(2)} ${D.source} fl=${wa(ot)}`,J),y=F+1.5,g=-1)):g=-1,D.stickHeld?(nt>p&&(p=nt),p>.35&&nt<.06?(m<0&&(m=F),F-m>=t.stickLostMs/1e3&&(P("stickLost",F,L.tick,(F-m)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${wa(ot)}`,J),m=-1,p=0)):m=-1):(p=0,m=-1);const $t=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,Tt=D.stickScreenOk,kt=Tt?D.stickScreenX/$t:D.stickPxX,N=Tt?D.stickScreenY/$t:D.stickPxY,fe=Tt?D.stickOriginSX/$t:D.stickOriginX,vt=Tt?D.stickOriginSY/$t:D.stickOriginY,Ht=kt-fe,Ut=N-vt;if(D.stickHeld&&D.stickId!==null){const Lt=R;if(Lt&&Lt.held&&Lt.id===D.stickId){const Ct=Math.hypot(Lt.dx,Lt.dy),C=Math.hypot(Ht,Ut),T=Math.max(Ct,C),Z=Math.hypot(kt-Lt.cx,N-Lt.cy),dt=Math.abs(Yn(fs(Math.atan2(Ut,Ht)-Math.atan2(Lt.dy,Lt.dx)))),ut=T*dt*Math.PI/180,rt=Math.hypot(fe-Lt.ox,vt-Lt.oy);if(T>18&&dt>35&&Z<Math.max(5,ut*.35)&&P("stickJump",F,L.tick,0,`Δ${dt.toFixed(0)}° 手指只动${Z.toFixed(0)}px(弧长应${ut.toFixed(0)}px) o(${Math.round(Lt.ox)},${Math.round(Lt.oy)})→(${Math.round(fe)},${Math.round(vt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(kt)},${Math.round(N)}) raw(${Math.round(Ht)},${Math.round(Ut)}) id${D.stickId} ${Tt?"src=屏幕":"src=client"}`,J),Tt&&Lt.screenOk){const It=Math.hypot(D.stickPxX-Lt.x,D.stickPxY-Lt.y),K=Math.hypot((D.stickScreenX-Lt.sx)/$t,(D.stickScreenY-Lt.sy)/$t);S+=It-K,Math.abs(S)>20&&(P("stickDrift",F,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,J),S=0)}}R={id:D.stickId,ox:fe,oy:vt,cx:kt,cy:N,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Ht,dy:Ut,held:!0,screenOk:Tt}}else R=null,S=0;if(D.stickBad>w){const Lt=D.stickBad-w;P("stickBad",F,L.tick,0,`拦截 ${Lt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,J)}w=D.stickBad,h=Q,f=X.moveYaw,d=ot},event(L,D){const V=ig(L);I(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||z(L.type,V,D,L.tick))},gesture(L){const D=`${L.button}.${L.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&z(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,E,M)},suspend(L){_=E*1e3+L,g=-1,m=-1},setEnabled(L){r=L,L||(h=null,R=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,x={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,R=null,w=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,D=s.some(V=>L-V.t<8&&(V.kind==="dirJump"||V.kind==="aimDrop"||V.kind==="moveFreeze"||V.kind==="stickLost"||V.kind==="stickJump"||V.kind==="stickBad"||V.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:q0,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:B}}const sg={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}]},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}]},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}]},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1}},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},og={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},rg={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},cg={core:sg,scene:og,view:rg};function Ol(n){return JSON.parse(JSON.stringify(n))}const Bl=cg,lg=Ol(Bl.core),to=Ol(Bl.scene),cn=Ol(Bl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ri{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),ri.nextNameID=ri.nextNameID||0,this.$name.id=`lil-gui-name-${++ri.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class hg extends ri{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function zc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const dg={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:zc,toHexString:zc},Is={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},ug={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Is.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Is.toHexString(a)}},fg={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Is.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Is.toHexString(a)}},pg=[dg,Is,ug,fg];function mg(n){return pg.find(t=>t.match(n))}class gg extends ri{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=mg(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=zc(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Or extends ri{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class xg extends ri{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let v=parseFloat(this.$input.value);isNaN(v)||(this._stepExplicit&&(v=this._snap(v)),this.setValue(this._clamp(v)))},i=v=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+v),this.$input.value=this.getValue())},a=v=>{v.key==="Enter"&&this.$input.blur(),v.code==="ArrowUp"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v))),v.code==="ArrowDown"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v)*-1))},s=v=>{this._inputFocused&&(v.preventDefault(),i(this._step*this._normalizeMouseWheel(v)))};let o=!1,r,l,c,h,f;const d=5,u=v=>{r=v.clientX,l=c=v.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=v=>{if(o){const _=v.clientX-r,x=v.clientY-l;Math.abs(x)>d?(v.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&y()}if(!o){const _=v.clientY-c;f-=_*this._step*this._arrowKeyMultiplier(v),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=v.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,v,_,x,R)=>(p-v)/(_-v)*(R-x)+x,e=p=>{const v=this.$slider.getBoundingClientRect();let _=t(p,v.left,v.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const v=p.touches[0].clientX-r,_=p.touches[0].clientY-l;Math.abs(v)>Math.abs(_)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class vg extends ri{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class _g extends ri{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const yg=`.lil-gui {
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
}`;function Mg(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Qh=!1;class er{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Qh&&r&&(Mg(yg),Qh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new vg(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new xg(this,t,e,i,a,s);case"boolean":return new hg(this,t,e);case"string":return new _g(this,t,e);case"function":return new Or(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new gg(this,t,e,i)}addFolder(t){const e=new er({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Or||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Or)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function bg(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new er({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new er({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=xt=>{const Ft=s.addFolder(xt);return l.push(Ft),Ft},h=(xt,Ft)=>{const st=xt.addFolder(Ft);return r.push(st),st},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),g=h(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const v=o.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(v,"iterations",1,8,1).name("迭代次数"),_.add(v,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(v.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(v.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(v.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const x=o.dummies,R=h(u,"假人 AI");R.add(x,"moveSpeed",.5,8,.1).name("移动速度"),R.add(x,"wanderRadius",.5,8,.1).name("游走半径"),R.add(x,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),R.add(x,"followStopDistance",.3,5,.1).name("跟随停距"),R.add(x,"keepDistance",1,10,.1).name("保持距离"),R.add(x,"keepDeadZone",.1,2,.05).name("保持死区"),R.add(x,"attackRange",.5,5,.1).name("攻击距离"),R.add(x,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),R.add(x,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),w=h(S,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const E=h(S,"停步收相 / 胸朝向");E.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),E.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),E.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),E.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),E.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const M=h(S,"停步惯性");M.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),M.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),M.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),M.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),M.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),M.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),M.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(S,"足部 IK"),z=t.ik;P.add(z,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(z,"weight",0,1,.01).name("钉地权重"),P.add(z,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(z,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const I=h(S,"惯性倾斜 / 盆骨"),B=t.lean;I.add(B,"accelGain",0,.1,.002).name("前后加速度增益"),I.add(B,"turnGain",0,.2,.005).name("绕圈侧倾增益"),I.add(B,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),I.add(B,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),I.add(B,"smoothing",1,30,1).name("倾斜平滑速率"),I.add(B,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),I.add(B,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),I.add(B,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),I.add(B,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,D=h(S,"朝向 / 下盘带转");D.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),D.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),D.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),D.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),D.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),D.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const V=o.gaze,O=h(S,"接敌注视 / 俯仰 (v9s.18)");O.add(V,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),O.add(V,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),O.add(V,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),O.add(V,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),O.add(V,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),O.add(V,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),O.add(V,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),O.add(V,"headPitchRate",.5,20,.5).name("头部俯仰速率"),O.add(V,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),O.add(V,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),O.add(V,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const F=h(S,"原地转身 / 停步偏差 (v9s)"),X=o.turnInPlace;F.add(X,"enabled").name("启用原地转身 (关=纯插值)"),F.add(X,"triggerDeg",20,180,5).name("触发夹角 (°)"),F.add(X,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),F.add(X,"settleDeg",0,60,1).name("转身保留余角 (°)"),F.add(X,"durationSec",.1,1.5,.02).name("转身时长 (s)"),F.add(X,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),F.add(X,"inputDeadZone",0,.5,.01).name("起步输入死区"),F.add(X,"armSec",0,.5,.01).name("触发防抖 (s)"),F.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),F.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),F.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),F.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),F.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),F.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const nt=c("战斗 / 受击"),at=o.combat,ot=h(nt,"连击 / 武器"),Q=ot.add(n.combat,"weapon",la).name("当前武器");ot.add(at,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ot.add(at,"settle",0,.8,.01).name("段间停顿 (s)"),ot.add(at,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ot.add(at,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ot.add(at,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ot.add(at,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ot.add(at,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ot.add(at,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ot.add(at,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ot.add(at,"autoCombo").name("按住自动连击"),ot.add(at.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ot.add(at.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ot.add(at.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const q=h(nt,"夸张化 (v9s.22)"),gt=t.animation.stretch;q.add(gt,"enabled").name("四肢伸缩 开"),q.add(gt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),q.add(gt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),q.add(gt,"impactSquash",0,.5,.01).name("命中挤压量"),q.add(gt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),q.add(gt,"torsoGain",0,1,.05).name("躯干跟随比例"),q.add(gt,"volumeExp",0,1.5,.05).name("体积补偿指数");const J=t.animation.swing;q.add(J,"enabled").name("挥击身体幅度 开"),q.add(J,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),q.add(J,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),q.add(J,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),q.add(J,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),q.add(J,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),q.add(J,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),q.add(J,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),q.add(J.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const yt=t.weaponTrail;q.add(yt,"enabled").name("挥击刀光 开"),q.add(yt,"life",.04,.4,.01).name("刀光残留 (s)"),q.add(yt,"intensity",0,1.5,.05).name("刀光亮度"),q.add(yt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),q.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),q.add(t.hitstop,"enabled").name("命中定格 开"),q.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const Dt=t.weaponWrist;q.add(Dt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),q.add(Dt,"lag",0,.08,.002).name("臂速 → 腕滞后"),q.add(Dt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),q.add(Dt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),q.add(Dt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),q.add(Dt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const zt=t.weaponMount;q.add(zt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),q.add(zt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),q.add(zt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),q.add(zt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),q.add(zt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),q.add(zt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),ot.add(at.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ot.add(at.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ot.add(at.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ot.add(at.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ot.add(at.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ot.add(at.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ot.add(at.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ot.add(at.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ot.add(at.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ot.add(at.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const $t=o.abilities;ot.add($t.arcane,"perWave",1,8,1).name("每波飞弹数"),ot.add($t.arcane,"waves",1,12,1).name("每次引导波数"),ot.add($t.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ot.add($t.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ot.add($t.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ot.add($t.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ot.add($t.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ot.add($t.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ot.add($t.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ot.add($t.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ot.add($t.arcane,"speed",3,24,.5).name("飞弹速度"),ot.add($t.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ot.add($t.ring,"radius",.5,5,.1).name("电环半径"),ot.add($t.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ot.add($t.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Tt=h(nt,"攻击动作 / 跨步 / 落地");Tt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Tt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Tt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const kt=t.animation.stride;Tt.add(kt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Tt.add(kt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Tt.add(kt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Tt.add(kt,"cycles",1,3,1).name("每段跨步周期数"),Tt.add(kt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Tt.add(kt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Tt.add(kt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Tt.add(kt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Tt.add(kt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Tt.add(kt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Tt.add(kt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Tt.add(kt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Tt.add(kt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Tt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Tt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Tt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Tt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Tt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Tt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Tt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Tt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Tt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Tt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Tt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Tt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const N=h(nt,"武器握持");N.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),N.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),N.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),N.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const fe=o.hits,vt=h(nt,"命中 / 受击 / 击退");vt.add(fe,"arcDeg",10,120,5).name("命中扇区半角 (°)"),vt.add(fe,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),vt.add(fe,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),vt.add(fe,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),vt.add(fe.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),vt.add(fe.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),vt.add(fe,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),vt.add(fe,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Ht=o.targeting,Ut=h(nt,"目标辅助");Ut.add(Ht,"targetAssist").name("启用目标辅助"),Ut.add(Ht,"range",1,14,.5).name("锁定范围 (m)"),Ut.add(Ht,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ut.add(Ht,"frontBias",0,4,.1).name("朝向加权"),Ut.add(Ht,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ut.add(Ht,"maxLungeScale",1,3,.1).name("前冲最大放大");const Lt=h(nt,"受击分层"),Ct=t.hurt;Lt.add(Ct,"enabled").name("启用分层受击 (关=旧版对照)"),Lt.add(Ct,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Lt.add(Ct,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Lt.add(Ct,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Lt.add(Ct,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Lt.add(Ct,"upperShiftScale",0,1,.01).name("上身位移缩放"),Lt.add(Ct,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Lt.add(Ct.hitHeight,"light",0,1,.01).name("轻击命中部位"),Lt.add(Ct.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Lt.add(Ct.hitHeight,"knock",0,1,.01).name("击退命中部位"),Lt.add(Ct,"leanLight",0,1.5,.01).name("轻击力度"),Lt.add(Ct,"leanHeavy",0,1.5,.01).name("重击力度"),Lt.add(Ct,"leanKnock",0,1.5,.01).name("击退力度"),Lt.add(Ct,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Ct.abdomen},{name:"打肩 (shoulder)",p:Ct.shoulder}].map(({name:xt,p:Ft})=>{const st=h(Lt,xt);return st.add(Ft,"upperPitch",0,2,.01).name("上身前后倾斜"),st.add(Ft,"upperRoll",0,2,.01).name("上身侧倾"),st.add(Ft,"upperYaw",0,1.5,.01).name("肩部扭转"),st.add(Ft,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),st.add(Ft,"shift",0,.8,.01).name("身体反应位移"),st.add(Ft,"drop",0,.4,.01).name("整体下沉"),st.add(Ft,"back",0,.4,.01).name("屁股向后"),st.add(Ft,"knee",0,1.6,.01).name("屈膝"),st.add(Ft,"hip",0,1,.01).name("髋前倾"),st.add(Ft,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),st});const C=h(nt,"派生招"),T=o.links;C.add(T,"enabled").name("总开关 (false=旧连击)"),C.add(T.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),C.add(T.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),C.add(T.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),C.add(T,"sharedCooldown",0,3,.05).name("共享 CD (s)"),C.add(T,"triggerWhileSprinting").name("长跑中可直接触发"),C.add(T.search,"range",1,14,.1).name("索敌距离 (m)"),C.add(T.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),C.add(T.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Z=T.moves["sword-shield"];Z&&(C.add(Z,"enabled").name("剑盾盾击"),C.add(Z,"distance",0,8,.1).name("冲锋极限 (m)"),C.add(Z,"windup",0,.5,.01).name("前摇 (s)"),C.add(Z,"active",0,.8,.01).name("冲锋 / 命中 (s)"),C.add(Z,"recovery",0,.8,.01).name("收势 (s)"),C.add(Z.hit,"radius",0,4,.05).name("命中半径 (m)"),C.add(Z.hit,"width",0,2,.05).name("扫掠半径 (m)"),C.add(Z.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),C.add(Z.hit,"duration",0,1.5,.01).name("僵直 (s)")),C.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const dt=c("相机"),ut=h(dt,"基础");ut.add(t.camera,"pitchDeg",20,80,1).name("俯角"),ut.add(t.camera,"yawDeg",-180,180,1).name("方位角"),ut.add(t.camera,"distance",6,35,.5).name("距离"),ut.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),ut.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,It=h(dt,"智能构图");It.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),It.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),It.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),It.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),It.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),It.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),It.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),It.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),It.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),It.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),It.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const K=h(dt,"缩放");return K.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),K.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),K.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),K.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),K.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),K.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),K.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),K.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(xt=>xt.close()),l.forEach(xt=>xt.close()),s.close(),{gui:s,refreshWeapon:()=>Q.updateDisplay()}}function Sg(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function wg(n,t){return n.find(e=>e.id===t)??null}function td(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function Eg({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return Sg(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const v=o!==null;o=p;for(const[_,x]of l)x.classList.toggle("is-active",_===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):v&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(v=>v.index===m)??null:wg(n,m);return p?(f0(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function y(){Ju(t)}if(s){s.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),s.appendChild(m);for(const x of[...n].sort((R,S)=>R.index-S.index)){const R=document.createElement("button");R.type="button",R.className="lab-row",R.dataset.station=x.id,R.dataset.uiButton="",R.style.setProperty("--lab-color",x.color),R.setAttribute("aria-label",`传送到工位 ${x.index}：${x.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(x.index);const w=document.createElement("span");w.className="lab-name",w.textContent=x.name,R.append(S,w),R.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(x.id)}),s.appendChild(R),l.set(x.id,R)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const v=document.createElement("div");v.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),y()}),v.appendChild(_),a){const x=document.createElement("button");x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="镜头归位",x.setAttribute("aria-label","把镜头缩放恢复到默认"),x.addEventListener("pointerdown",R=>{R.preventDefault(),R.stopPropagation(),a()}),v.appendChild(x)}s.appendChild(v)}return window.addEventListener("keydown",m=>{var p,v;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const _=td(n,((p=d())==null?void 0:p.id)??o,-1);_&&g(_.id)}else if(m.key==="]"){const _=td(n,((v=d())==null?void 0:v.id)??o,1);_&&g(_.id)}else m.key==="\\"&&y()}),u(),{goto:g,current:d,tick:u,recall:y,element:s}}const Br=Math.PI*2,ii={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},Tg=45,Ag=50;function Rg(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function ps(n,t,e){const i=Rg(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function Pg(n,t){return Math.atan2(n,-t)*180/Math.PI}function ed(n,t){return Math.abs(((n-t)%360+540)%360-180)}function eo(n){return(n%360+360)%360}const Cg={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function Lg(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?ps(s.moveX,s.moveZ,e):null,f=c>.15?ps(l.x,l.z,e):null,d=ps(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?ps(s.aimX,s.aimZ,e):null,g=n.targeting,y=g.hasTarget?ps(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?ed(h,f):null,p=h!==null?ed(h,d):null,v=m!==null&&m>Tg&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?Pg(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:v}}function nd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>Ag&&(n.inLen>=.35||n.speed>=.4)}const id="harness.dirDebug";function Dg(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(id)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(_){if(l=_,!t)try{window.localStorage.setItem(id,_?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=Cg,g=0,y="",m=8;function p(_){if(!r)return;const x=d,R=d,S=x/2,w=R/2,E=Math.min(x,R)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,x,R),r.beginPath(),r.arc(S,w,E,0,Br),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":ii.ring,r.stroke(),r.strokeStyle=ii.grid,r.beginPath(),r.moveTo(S-E,w),r.lineTo(S+E,w),r.moveTo(S,w-E),r.lineTo(S,w+E),r.stroke();for(let z=0;z<8;z++){const I=z*Math.PI/4,B=S+Math.sin(I)*(E-3),L=w-Math.cos(I)*(E-3),D=S+Math.sin(I)*E,V=w-Math.cos(I)*E;r.beginPath(),r.moveTo(B,L),r.lineTo(D,V),r.stroke()}const M=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;M>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=ii.dead,r.beginPath(),r.arc(S,w,E*M,0,Br),r.stroke(),r.restore());const b=(z,I,B,L,D=!1,V=1)=>{const O=z*Math.PI/180,F=Math.sin(O),X=-Math.cos(O),nt=E*Math.max(.14,Math.min(1,I)),at=S+F*E*.14,ot=w+X*E*.14,Q=S+F*nt,q=w+X*nt;if(r.save(),r.globalAlpha=V,r.strokeStyle=B,r.fillStyle=B,r.lineWidth=L,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(at,ot),r.lineTo(Q,q),r.stroke(),!D&&nt>E*.3){const gt=-X,J=F,yt=5.2;r.beginPath(),r.moveTo(Q+F*1.5,q+X*1.5),r.lineTo(Q-F*yt+gt*yt*.72,q-X*yt+J*yt*.72),r.lineTo(Q-F*yt-gt*yt*.72,q-X*yt-J*yt*.72),r.closePath(),r.fill()}r.restore()},P=(z,I)=>{const B=z*Math.PI/180,L=Math.sin(B),D=-Math.cos(B),V=-D,O=L,F=E+1.5,X=F+6.5;r.save(),r.fillStyle=I,r.strokeStyle=I,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*X,w+D*X),r.lineTo(S+L*F+V*4,w+D*F+O*4),r.lineTo(S+L*F-V*4,w+D*F-O*4),r.closePath(),r.fill(),r.restore()};_.lockDeg!==null&&b(_.lockDeg,1,ii.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&b(_.rawDeg,_.rawLen,ii.raw,1,!0,.9),_.aimDeg!==null&&b(_.aimDeg,1,ii.aim,1.6,!0,.95),b(_.faceDeg,1,ii.face,1.1,!0,.55),_.moveDeg!==null&&b(_.moveDeg,_.speed/Math.max(1,m),ii.move,5.5,!1,.8),_.inDeg!==null&&b(_.inDeg,_.inLen,ii.input,2.2),P(_.faceDeg,ii.face),r.beginPath(),r.arc(S,w,2.2,0,Br),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function v(_,x){const R=E=>E===null?"-":String(Math.round(eo(E)));o.in.textContent=`入 ${R(_.inDeg)}`,o.mv.textContent=`移 ${R(_.moveDeg)}`,o.fc.textContent=`面 ${R(_.faceDeg)}`;const S=E=>E===null?"-":`${Math.round(E)}°`,w=[`Δ入→移 ${S(_.gapMove)}`,`Δ入→面 ${S(_.gapFace)}`];_.speed>.05&&w.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&w.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&w.push("拖拽瞄准"),o.gap.textContent=w.join("  "),e.classList.toggle("is-warn",_.warnMove||nd(_,x))}return{update(_,x,R){if(!l)return;m=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const S=Lg(_,x,R,m);u=S;const w=_.combat.phase!=="idle";p(S);const E=performance.now(),M=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(E-g>90||M!==y)&&(g=E,y=M,v(S,w),e.dataset.in=S.inDeg===null?"":eo(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":eo(S.moveDeg).toFixed(1),e.dataset.fc=eo(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||nd(S,w)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const kg=6,Ig=480,ad=240,sd=92,Fg=18;function zg(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function Ug(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function Ng(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Og(n={}){const t=Math.max(1,n.windowS??kg),e=Math.max(60,n.capacity??Ig),i=Math.max(1,n.speedCap??Fg),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(ad*u),l.height=Math.round(sd*u);const g=Dg({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function m(E){y=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),m(!y)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&m(!y)}));const p=[];let v=0,_=null,x=-1,R={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(E){const M=E-t;let b=0;for(;b<p.length&&p[b].t<M;)b++;return p.slice(b)}function w(E,M){if(!d)return;const b=ad,P=sd;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,b,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,b,P);const z=4,I=4,B=b-z-I,L=9,D=46,V=62,O=22,F=M-t,X=J=>z+Math.max(0,Math.min(1,(J-F)/t))*B;for(let J=0;J<E.length;J++){if(!E[J].busy)continue;const yt=X(E[J].t),Dt=J+1<E.length?X(E[J+1].t):yt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(yt,L,Math.max(2,Dt-yt),D)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const J of[L,L+D/2,L+D])d.moveTo(z,J),d.lineTo(b-I,J);d.moveTo(z,V+O/2),d.lineTo(b-I,V+O/2),d.stroke();const at=Math.max(1,...E.map(J=>J.speed),...E.map(J=>J.drive))*1.15,ot=J=>L+D-J/at*D;if(E.length>1){d.beginPath(),d.moveTo(X(E[0].t),ot(E[0].speed));for(let J=1;J<E.length;J++)d.lineTo(X(E[J].t),ot(E[J].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(X(E[E.length-1].t),L+D),d.lineTo(X(E[0].t),L+D),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(X(E[0].t),ot(E[0].drive));for(let J=1;J<E.length;J++)d.lineTo(X(E[J].t),ot(E[J].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let Q=.02;for(const J of E)Q=Math.max(Q,Math.abs(J.dv));Q*=1.1;const q=V+O/2,gt=O/2;for(const J of E){const yt=Math.min(gt,Math.abs(J.dv)/Q*gt);d.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(X(J.t)-.7,J.dv>=0?q-yt:q,1.4,Math.max(.5,yt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(at.toFixed(1),z+2,L+8),d.fillText("v",z+2,L+D-2),d.fillText("Δv",z+2,V+9),d.textAlign="right",d.fillText("0",b-I-2,L+D-2),d.textAlign="left"}return{dirDebug:g,update(E,M,b){const P=performance.now()/1e3,z=x<0?1/60:Math.max(1e-4,Math.min(.25,P-x));x=P;const I=E.character,B={x:I.position.x,z:I.position.z},L=Math.hypot(I.velocity.x,I.velocity.z),{speed:D,raw:V}=_?Ug(_,B,z,i):{speed:0,raw:0},O=zg(v,D,z,P);O.drive=L,O.raw=V,O.busy=Ng(E),_=B,v=D,p.push(O),p.length>e&&p.shift();const F=S(P);let X=0;for(const nt of F)X=Math.max(X,nt.speed);if(R={speed:D,drive:L,raw:V,dv:O.dv,accel:O.accel,peak:X,samples:F.length,windowS:t,busy:O.busy},g.update(E,M,b),y){w(F,P);const nt=O.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${X.toFixed(2)} · Δv ${nt}${O.dv.toFixed(3)} · ${F.length} 帧`}},setEnabled:m,toggle(){return m(!y),y},enabled:()=>y,last:()=>({...R}),samples:()=>S(performance.now()/1e3).map(E=>({...E}))}}const Bg=["剑盾","双剑","大剑","法杖","弓"],Hg={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Gg(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=Tt=>Tt.toFixed(2),g=Tt=>(Tt*180/Math.PI).toFixed(0),y=Bg[la.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),v=t.dash,_=v.phase==="active"&&v.duration>0?(1-v.timer/v.duration)*100:0,x=v.phase==="active"?`${v.kind}@${_.toFixed(0)}%`:`${v.kind} cd${u(v.cooldown)}`,R=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),w=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),E=Math.abs(S)+Math.abs(w)+1e-6,M=Math.round(Math.abs(w)/E*100),b=`strafe ${M}%${S<-.05?" back":""}`,P=t.camera,z=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,I=o?u(o.attackBlend):"-",B=o==null?void 0:o.attackWeights,L=B?`gw ${u(B.gaitScale)}  lw ${u(B.attackLegWeight)}  spd ${u(B.driveSpeed)}`:"-",D=B?`${u(B.gaitScale)}/${u(B.attackLegWeight)}`:"-",V=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",O=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",F=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",X=o==null?void 0:o.hurt,nt=X?`hurt ${t.playerHurt.type}  部位h${u(X.hitHeight)}  脉冲p${u(X.pulse)}  上身${u(X.upperShift)}  重心${u(X.comShift)}  后坐${u(X.pelvisBack)}  屈膝${u(X.knee)}`:"-",at=X?`${u(X.hitHeight)}/${u(X.pulse)}/${u(X.knee)}`:"-",ot=o==null?void 0:o.ik,Q=ot?`${ot.active?"on":"off"} w${u(ot.weight)} e${u(ot.maxError)}`:"-",q=t.playerLink,gt=`link ${q.kind||"-"}  ${q.phase}  prog ${u(q.progress)}  win ${u(q.linkWindow)}s  cd ${u(q.cooldown)}s  hits ${q.hitIds.length}  travel ${u(q.travelled)}/${u(q.travel)}m  id ${q.id}`,J=`${q.phase}/${q.kind||"-"}/w${u(q.linkWindow)}`,yt=a.lastGesture,Dt=yt?`${yt.button} ${yt.kind} ${yt.heldMs.toFixed(0)}ms d${yt.distance.toFixed(0)}px ${yt.angleDeg.toFixed(0)}° taps${yt.taps}`:"-",zt=t.dummies.map(Tt=>`${Tt.id}:${Hg[Tt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${q.phase}${q.kind?`/${q.kind}`:""} w${u(q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${M}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${x}  ab ${I}  gw/lw ${D}  land ${O}  ik ${Q}`,`aim ${R}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${at}`,`dummies ${zt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${F}  lk ${J}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Dt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${I}   ${L}   land ${V}`,nt,`ik ${Q}  clamped ${ot?ot.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${b}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${R}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${v.kind}  phase ${v.phase}  prog ${_.toFixed(0)}%  cd ${u(v.cooldown)}s  id ${v.id}  from (${u(v.fromX)},${u(v.fromZ)}) → to (${u(v.toX)},${u(v.toZ)})`,gt,`camera ${z}  ${F}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${zt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Dt}`].join(`
`)}}}const no=["lab","hud","motion","debug"],od={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},rd={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Vg(n){var l;const t=Object.fromEntries(no.map(c=>[c,document.getElementById(rd[c].toggle)])),e=Object.fromEntries(no.map(c=>[c,document.getElementById(rd[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of no){const u=a===d,g=t[d],y=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${od[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${od[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of no)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hl="170",Xg=0,cd=1,Wg=2,rf=1,cf=2,vi=3,Bi=0,Pn=1,Ve=2,Ni=0,Za=1,ki=2,ld=3,hd=4,Yg=5,aa=100,$g=101,Zg=102,qg=103,jg=104,Kg=200,Jg=201,Qg=202,tx=203,Uc=204,Nc=205,ex=206,nx=207,ix=208,ax=209,sx=210,ox=211,rx=212,cx=213,lx=214,Oc=0,Bc=1,Hc=2,ts=3,Gc=4,Vc=5,Xc=6,Wc=7,Gl=0,hx=1,dx=2,Oi=0,ux=1,fx=2,px=3,mx=4,gx=5,xx=6,vx=7,lf=300,es=301,ns=302,Yc=303,$c=304,ur=306,Zc=1e3,oa=1001,qc=1002,Jn=1003,_x=1004,io=1005,oi=1006,Hr=1007,ra=1008,Si=1009,hf=1010,df=1011,Fs=1012,Vl=1013,ha=1014,yi=1015,Vs=1016,Xl=1017,Wl=1018,is=1020,uf=35902,ff=1021,pf=1022,Kn=1023,mf=1024,gf=1025,qa=1026,as=1027,xf=1028,Yl=1029,vf=1030,$l=1031,Zl=1033,Oo=33776,Bo=33777,Ho=33778,Go=33779,jc=35840,Kc=35841,Jc=35842,Qc=35843,tl=36196,el=37492,nl=37496,il=37808,al=37809,sl=37810,ol=37811,rl=37812,cl=37813,ll=37814,hl=37815,dl=37816,ul=37817,fl=37818,pl=37819,ml=37820,gl=37821,Vo=36492,xl=36494,vl=36495,_f=36283,_l=36284,yl=36285,Ml=36286,yx=3200,Mx=3201,yf=0,bx=1,Ii="",bn="srgb",os="srgb-linear",fr="linear",ke="srgb",Ea=7680,dd=519,Sx=512,wx=513,Ex=514,Mf=515,Tx=516,Ax=517,Rx=518,Px=519,bl=35044,ud=35048,fd="300 es",Mi=2e3,nr=2001;class rs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pd=1234567;const ja=Math.PI/180,zs=180/Math.PI;function ci(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]+"-"+dn[t&255]+dn[t>>8&255]+"-"+dn[t>>16&15|64]+dn[t>>24&255]+"-"+dn[e&63|128]+dn[e>>8&255]+"-"+dn[e>>16&255]+dn[e>>24&255]+dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]).toLowerCase()}function ln(n,t,e){return Math.max(t,Math.min(e,n))}function ql(n,t){return(n%t+t)%t}function Cx(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function Lx(n,t,e){return n!==t?(e-n)/(t-n):0}function Ts(n,t,e){return(1-e)*n+e*t}function Dx(n,t,e,i){return Ts(n,t,1-Math.exp(-e*i))}function kx(n,t=1){return t-Math.abs(ql(n,t*2)-t)}function Ix(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Fx(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function zx(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Ux(n,t){return n+Math.random()*(t-n)}function Nx(n){return n*(.5-Math.random())}function Ox(n){n!==void 0&&(pd=n);let t=pd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Bx(n){return n*ja}function Hx(n){return n*zs}function Gx(n){return(n&n-1)===0&&n!==0}function Vx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Xx(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Wx(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),g=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function jn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Le(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const md={DEG2RAD:ja,RAD2DEG:zs,generateUUID:ci,clamp:ln,euclideanModulo:ql,mapLinear:Cx,inverseLerp:Lx,lerp:Ts,damp:Dx,pingpong:kx,smoothstep:Ix,smootherstep:Fx,randInt:zx,randFloat:Ux,randFloatSpread:Nx,seededRandom:Ox,degToRad:Bx,radToDeg:Hx,isPowerOfTwo:Gx,ceilPowerOfTwo:Vx,floorPowerOfTwo:Xx,setQuaternionFromProperEuler:Wx,normalize:Le,denormalize:jn};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ln(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class de{constructor(t,e,i,a,s,o,r,l,c){de.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],y=a[0],m=a[3],p=a[6],v=a[1],_=a[4],x=a[7],R=a[2],S=a[5],w=a[8];return s[0]=o*y+r*v+l*R,s[3]=o*m+r*_+l*S,s[6]=o*p+r*x+l*w,s[1]=c*y+h*v+f*R,s[4]=c*m+h*_+f*S,s[7]=c*p+h*x+f*w,s[2]=d*y+u*v+g*R,s[5]=d*m+u*_+g*S,s[8]=d*p+u*x+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,g=e*f+i*d+a*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=f*y,t[1]=(a*c-h*i)*y,t[2]=(r*i-a*o)*y,t[3]=d*y,t[4]=(h*e-a*l)*y,t[5]=(a*s-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Gr.makeScale(t,e)),this}rotate(t){return this.premultiply(Gr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Gr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Gr=new de;function bf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function ir(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yx(){const n=ir("canvas");return n.style.display="block",n}const gd={};function Ss(n){n in gd||(gd[n]=!0,console.warn(n))}function $x(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Zx(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function qx(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const ye={enabled:!0,workingColorSpace:os,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ke&&(n.r=bi(n.r),n.g=bi(n.g),n.b=bi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ke&&(n.r=Ka(n.r),n.g=Ka(n.g),n.b=Ka(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ii?fr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function bi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ka(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const xd=[.64,.33,.3,.6,.15,.06],vd=[.2126,.7152,.0722],_d=[.3127,.329],yd=new de().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Md=new de().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ye.define({[os]:{primaries:xd,whitePoint:_d,transfer:fr,toXYZ:yd,fromXYZ:Md,luminanceCoefficients:vd,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:xd,whitePoint:_d,transfer:ke,toXYZ:yd,fromXYZ:Md,luminanceCoefficients:vd,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}});let Ta;class jx{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ta===void 0&&(Ta=ir("canvas")),Ta.width=t.width,Ta.height=t.height;const i=Ta.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ta}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ir("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=bi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(bi(e[i]/255)*255):e[i]=bi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Kx=0;class Sf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kx++}),this.uuid=ci(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Vr(a[o].image)):s.push(Vr(a[o]))}else s=Vr(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Vr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?jx.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jx=0;class En extends rs{constructor(t=En.DEFAULT_IMAGE,e=En.DEFAULT_MAPPING,i=oa,a=oa,s=oi,o=ra,r=Kn,l=Si,c=En.DEFAULT_ANISOTROPY,h=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jx++}),this.uuid=ci(),this.name="",this.source=new Sf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new de,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Zc:t.x=t.x-Math.floor(t.x);break;case oa:t.x=t.x<0?0:1;break;case qc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Zc:t.y=t.y-Math.floor(t.y);break;case oa:t.y=t.y<0?0:1;break;case qc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}En.DEFAULT_IMAGE=null;En.DEFAULT_MAPPING=lf;En.DEFAULT_ANISOTROPY=1;class je{constructor(t=0,e=0,i=0,a=1){je.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,x=(u+1)/2,R=(p+1)/2,S=(h+d)/4,w=(f+y)/4,E=(g+m)/4;return _>x&&_>R?_<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(_),a=S/i,s=w/i):x>R?x<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(x),i=S/a,s=E/a):R<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(R),i=w/s,a=E/s),this.set(i,a,s,e),this}let v=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(f-y)/v,this.z=(d-h)/v,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qx extends rs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new je(0,0,t,e),this.scissorTest=!1,this.viewport=new je(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:oi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new En(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Sf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class da extends Qx{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class wf extends En{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=oa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class tv extends En{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Jn,this.minFilter=Jn,this.wrapR=oa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xs{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],g=s[o+2],y=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==g){let m=1-r;const p=l*d+c*u+h*g+f*y,v=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const R=Math.sqrt(_),S=Math.atan2(R,p*v);m=Math.sin(m*S)/R,r=Math.sin(r*S)/R}const x=r*v;if(l=l*m+d*x,c=c*m+u*x,h=h*m+g*x,f=f*m+y*x,m===1-r){const R=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=R,c*=R,h*=R,f*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],g=s[o+3];return t[e]=r*g+h*f+l*u-c*d,t[e+1]=l*g+h*d+c*f-r*u,t[e+2]=c*g+h*u+r*d-l*f,t[e+3]=h*g-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"YZX":this._x=d*h*f+c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f-d*u*g;break;case"XZY":this._x=d*h*f-c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ln(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Xr.copy(this).projectOnVector(t),this.sub(Xr)}reflect(t){return this.sub(Xr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ln(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xr=new G,bd=new Xs;class Ws{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint($n.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint($n.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=$n.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,$n):$n.fromBufferAttribute(s,o),$n.applyMatrix4(t.matrixWorld),this.expandByPoint($n);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ao.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ao.copy(i.boundingBox)),ao.applyMatrix4(t.matrixWorld),this.union(ao)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,$n),$n.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ms),so.subVectors(this.max,ms),Aa.subVectors(t.a,ms),Ra.subVectors(t.b,ms),Pa.subVectors(t.c,ms),Ai.subVectors(Ra,Aa),Ri.subVectors(Pa,Ra),Yi.subVectors(Aa,Pa);let e=[0,-Ai.z,Ai.y,0,-Ri.z,Ri.y,0,-Yi.z,Yi.y,Ai.z,0,-Ai.x,Ri.z,0,-Ri.x,Yi.z,0,-Yi.x,-Ai.y,Ai.x,0,-Ri.y,Ri.x,0,-Yi.y,Yi.x,0];return!Wr(e,Aa,Ra,Pa,so)||(e=[1,0,0,0,1,0,0,0,1],!Wr(e,Aa,Ra,Pa,so))?!1:(oo.crossVectors(Ai,Ri),e=[oo.x,oo.y,oo.z],Wr(e,Aa,Ra,Pa,so))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,$n).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize($n).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ui),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const ui=[new G,new G,new G,new G,new G,new G,new G,new G],$n=new G,ao=new Ws,Aa=new G,Ra=new G,Pa=new G,Ai=new G,Ri=new G,Yi=new G,ms=new G,so=new G,oo=new G,$i=new G;function Wr(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){$i.fromArray(n,s);const r=a.x*Math.abs($i.x)+a.y*Math.abs($i.y)+a.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),h=i.dot($i);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const ev=new Ws,gs=new G,Yr=new G;class pr{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):ev.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);const e=gs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(gs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(Yr)),this.expandByPoint(gs.copy(t.center).sub(Yr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const fi=new G,$r=new G,ro=new G,Pi=new G,Zr=new G,co=new G,qr=new G;class jl{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fi.copy(this.origin).addScaledVector(this.direction,e),fi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){$r.copy(t).add(e).multiplyScalar(.5),ro.copy(e).sub(t).normalize(),Pi.copy(this.origin).sub($r);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ro),r=Pi.dot(this.direction),l=-Pi.dot(ro),c=Pi.lengthSq(),h=Math.abs(1-o*o);let f,d,u,g;if(h>0)if(f=o*l-r,d=o*r-l,g=s*h,f>=0)if(d>=-g)if(d<=g){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy($r).addScaledVector(ro,d),u}intersectSphere(t,e){fi.subVectors(t.center,this.origin);const i=fi.dot(this.direction),a=fi.dot(fi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,fi)!==null}intersectTriangle(t,e,i,a,s){Zr.subVectors(e,t),co.subVectors(i,t),qr.crossVectors(Zr,co);let o=this.direction.dot(qr),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Pi.subVectors(this.origin,t);const l=r*this.direction.dot(co.crossVectors(Pi,co));if(l<0)return null;const c=r*this.direction.dot(Zr.cross(Pi));if(c<0||l+c>o)return null;const h=-r*Pi.dot(qr);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oe{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m){Oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Ca.setFromMatrixColumn(t,0).length(),s=1/Ca.setFromMatrixColumn(t,1).length(),o=1/Ca.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+g*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=g+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d+y*r,e[4]=g*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-g,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=g*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=g*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+g,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(nv,t,iv)}lookAt(t,e,i){const a=this.elements;return kn.subVectors(t,e),kn.lengthSq()===0&&(kn.z=1),kn.normalize(),Ci.crossVectors(i,kn),Ci.lengthSq()===0&&(Math.abs(i.z)===1?kn.x+=1e-4:kn.z+=1e-4,kn.normalize(),Ci.crossVectors(i,kn)),Ci.normalize(),lo.crossVectors(kn,Ci),a[0]=Ci.x,a[4]=lo.x,a[8]=kn.x,a[1]=Ci.y,a[5]=lo.y,a[9]=kn.y,a[2]=Ci.z,a[6]=lo.z,a[10]=kn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],y=i[6],m=i[10],p=i[14],v=i[3],_=i[7],x=i[11],R=i[15],S=a[0],w=a[4],E=a[8],M=a[12],b=a[1],P=a[5],z=a[9],I=a[13],B=a[2],L=a[6],D=a[10],V=a[14],O=a[3],F=a[7],X=a[11],nt=a[15];return s[0]=o*S+r*b+l*B+c*O,s[4]=o*w+r*P+l*L+c*F,s[8]=o*E+r*z+l*D+c*X,s[12]=o*M+r*I+l*V+c*nt,s[1]=h*S+f*b+d*B+u*O,s[5]=h*w+f*P+d*L+u*F,s[9]=h*E+f*z+d*D+u*X,s[13]=h*M+f*I+d*V+u*nt,s[2]=g*S+y*b+m*B+p*O,s[6]=g*w+y*P+m*L+p*F,s[10]=g*E+y*z+m*D+p*X,s[14]=g*M+y*I+m*V+p*nt,s[3]=v*S+_*b+x*B+R*O,s[7]=v*w+_*P+x*L+R*F,s[11]=v*E+_*z+x*D+R*X,s[15]=v*M+_*I+x*V+R*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+y*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+m*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],y=t[13],m=t[14],p=t[15],v=f*m*c-y*d*c+y*l*u-r*m*u-f*l*p+r*d*p,_=g*d*c-h*m*c-g*l*u+o*m*u+h*l*p-o*d*p,x=h*y*c-g*f*c+g*r*u-o*y*u-h*r*p+o*f*p,R=g*f*l-h*y*l-g*r*d+o*y*d+h*r*m-o*f*m,S=e*v+i*_+a*x+s*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/S;return t[0]=v*w,t[1]=(y*d*s-f*m*s-y*a*u+i*m*u+f*a*p-i*d*p)*w,t[2]=(r*m*s-y*l*s+y*a*c-i*m*c-r*a*p+i*l*p)*w,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*w,t[4]=_*w,t[5]=(h*m*s-g*d*s+g*a*u-e*m*u-h*a*p+e*d*p)*w,t[6]=(g*l*s-o*m*s-g*a*c+e*m*c+o*a*p-e*l*p)*w,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*w,t[8]=x*w,t[9]=(g*f*s-h*y*s-g*i*u+e*y*u+h*i*p-e*f*p)*w,t[10]=(o*y*s-g*r*s+g*i*c-e*y*c-o*i*p+e*r*p)*w,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*w,t[12]=R*w,t[13]=(h*y*a-g*f*a+g*i*d-e*y*d-h*i*m+e*f*m)*w,t[14]=(g*r*a-o*y*a-g*i*l+e*y*l+o*i*m-e*r*m)*w,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*w,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,g=s*f,y=o*h,m=o*f,p=r*f,v=l*c,_=l*h,x=l*f,R=i.x,S=i.y,w=i.z;return a[0]=(1-(y+p))*R,a[1]=(u+x)*R,a[2]=(g-_)*R,a[3]=0,a[4]=(u-x)*S,a[5]=(1-(d+p))*S,a[6]=(m+v)*S,a[7]=0,a[8]=(g+_)*w,a[9]=(m-v)*w,a[10]=(1-(d+y))*w,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Ca.set(a[0],a[1],a[2]).length();const o=Ca.set(a[4],a[5],a[6]).length(),r=Ca.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Zn.copy(this);const c=1/s,h=1/o,f=1/r;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=h,Zn.elements[5]*=h,Zn.elements[6]*=h,Zn.elements[8]*=f,Zn.elements[9]*=f,Zn.elements[10]*=f,e.setFromRotationMatrix(Zn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Mi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,g;if(r===Mi)u=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===nr)u=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Mi){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let g,y;if(r===Mi)g=(o+s)*f,y=-2*f;else if(r===nr)g=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ca=new G,Zn=new Oe,nv=new G(0,0,0),iv=new G(1,1,1),Ci=new G,lo=new G,kn=new G,Sd=new Oe,wd=new Xs;class li{constructor(t=0,e=0,i=0,a=li.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(ln(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ln(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(ln(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ln(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ln(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-ln(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Sd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Sd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wd.setFromEuler(this),this.setFromQuaternion(wd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}li.DEFAULT_ORDER="XYZ";class Kl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let av=0;const Ed=new G,La=new Xs,pi=new Oe,ho=new G,xs=new G,sv=new G,ov=new Xs,Td=new G(1,0,0),Ad=new G(0,1,0),Rd=new G(0,0,1),Pd={type:"added"},rv={type:"removed"},Da={type:"childadded",child:null},jr={type:"childremoved",child:null};class We extends rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:av++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=We.DEFAULT_UP.clone();const t=new G,e=new li,i=new Xs,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Oe},normalMatrix:{value:new de}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=We.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return La.setFromAxisAngle(t,e),this.quaternion.multiply(La),this}rotateOnWorldAxis(t,e){return La.setFromAxisAngle(t,e),this.quaternion.premultiply(La),this}rotateX(t){return this.rotateOnAxis(Td,t)}rotateY(t){return this.rotateOnAxis(Ad,t)}rotateZ(t){return this.rotateOnAxis(Rd,t)}translateOnAxis(t,e){return Ed.copy(t).applyQuaternion(this.quaternion),this.position.add(Ed.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Td,t)}translateY(t){return this.translateOnAxis(Ad,t)}translateZ(t){return this.translateOnAxis(Rd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ho.copy(t):ho.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),xs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(xs,ho,this.up):pi.lookAt(ho,xs,this.up),this.quaternion.setFromRotationMatrix(pi),a&&(pi.extractRotation(a.matrixWorld),La.setFromRotationMatrix(pi),this.quaternion.premultiply(La.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Pd),Da.child=t,this.dispatchEvent(Da),Da.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(rv),jr.child=t,this.dispatchEvent(jr),jr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),pi.multiply(t.parent.matrixWorld)),t.applyMatrix4(pi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Pd),Da.child=t,this.dispatchEvent(Da),Da.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,t,sv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(xs,ov,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}We.DEFAULT_UP=new G(0,1,0);We.DEFAULT_MATRIX_AUTO_UPDATE=!0;We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qn=new G,mi=new G,Kr=new G,gi=new G,ka=new G,Ia=new G,Cd=new G,Jr=new G,Qr=new G,tc=new G,ec=new je,nc=new je,ic=new je;class Un{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),qn.subVectors(t,e),a.cross(qn);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){qn.subVectors(a,e),mi.subVectors(i,e),Kr.subVectors(t,e);const o=qn.dot(qn),r=qn.dot(mi),l=qn.dot(Kr),c=mi.dot(mi),h=mi.dot(Kr),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,g=(o*h-r*l)*d;return s.set(1-u-g,g,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,gi.x),l.addScaledVector(o,gi.y),l.addScaledVector(r,gi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return ec.setScalar(0),nc.setScalar(0),ic.setScalar(0),ec.fromBufferAttribute(t,e),nc.fromBufferAttribute(t,i),ic.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(ec,s.x),o.addScaledVector(nc,s.y),o.addScaledVector(ic,s.z),o}static isFrontFacing(t,e,i,a){return qn.subVectors(i,e),mi.subVectors(t,e),qn.cross(mi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return qn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),qn.cross(mi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Un.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;ka.subVectors(a,i),Ia.subVectors(s,i),Jr.subVectors(t,i);const l=ka.dot(Jr),c=Ia.dot(Jr);if(l<=0&&c<=0)return e.copy(i);Qr.subVectors(t,a);const h=ka.dot(Qr),f=Ia.dot(Qr);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(ka,o);tc.subVectors(t,s);const u=ka.dot(tc),g=Ia.dot(tc);if(g>=0&&u<=g)return e.copy(s);const y=u*c-l*g;if(y<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(Ia,r);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return Cd.subVectors(s,a),r=(f-h)/(f-h+(u-g)),e.copy(a).addScaledVector(Cd,r);const p=1/(m+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(ka,o).addScaledVector(Ia,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ef={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},uo={h:0,s:0,l:0};function ac(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=bn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ye.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=ye.workingColorSpace){return this.r=t,this.g=e,this.b=i,ye.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=ye.workingColorSpace){if(t=ql(t,1),e=ln(e,0,1),i=ln(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=ac(o,s,t+1/3),this.g=ac(o,s,t),this.b=ac(o,s,t-1/3)}return ye.toWorkingColorSpace(this,a),this}setStyle(t,e=bn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=bn){const i=Ef[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=bi(t.r),this.g=bi(t.g),this.b=bi(t.b),this}copyLinearToSRGB(t){return this.r=Ka(t.r),this.g=Ka(t.g),this.b=Ka(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=bn){return ye.fromWorkingColorSpace(un.copy(this),t),Math.round(ln(un.r*255,0,255))*65536+Math.round(ln(un.g*255,0,255))*256+Math.round(ln(un.b*255,0,255))}getHexString(t=bn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ye.workingColorSpace){ye.fromWorkingColorSpace(un.copy(this),e);const i=un.r,a=un.g,s=un.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ye.workingColorSpace){return ye.fromWorkingColorSpace(un.copy(this),e),t.r=un.r,t.g=un.g,t.b=un.b,t}getStyle(t=bn){ye.fromWorkingColorSpace(un.copy(this),t);const e=un.r,i=un.g,a=un.b;return t!==bn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Li),this.setHSL(Li.h+t,Li.s+e,Li.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Li),t.getHSL(uo);const i=Ts(Li.h,uo.h,e),a=Ts(Li.s,uo.s,e),s=Ts(Li.l,uo.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const un=new ee;ee.NAMES=Ef;let cv=0;class fa extends rs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cv++}),this.uuid=ci(),this.name="",this.blending=Za,this.side=Bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uc,this.blendDst=Nc,this.blendEquation=aa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ea,this.stencilZFail=Ea,this.stencilZPass=Ea,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Za&&(i.blending=this.blending),this.side!==Bi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Uc&&(i.blendSrc=this.blendSrc),this.blendDst!==Nc&&(i.blendDst=this.blendDst),this.blendEquation!==aa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ts&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ea&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ea&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ea&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qe extends fa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ke=new G,fo=new Wt;class hn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=bl,this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)fo.fromBufferAttribute(this,e),fo.applyMatrix3(t),this.setXY(e,fo.x,fo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix3(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=jn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Le(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=jn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=jn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=jn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=jn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array),a=Le(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array),a=Le(a,this.array),s=Le(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==bl&&(t.usage=this.usage),t}}class Tf extends hn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Af extends hn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ee extends hn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let lv=0;const On=new Oe,sc=new We,Fa=new G,In=new Ws,vs=new Ws,sn=new G;class Je extends rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lv++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bf(t)?Af:Tf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new de().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return On.makeRotationFromQuaternion(t),this.applyMatrix4(On),this}rotateX(t){return On.makeRotationX(t),this.applyMatrix4(On),this}rotateY(t){return On.makeRotationY(t),this.applyMatrix4(On),this}rotateZ(t){return On.makeRotationZ(t),this.applyMatrix4(On),this}translate(t,e,i){return On.makeTranslation(t,e,i),this.applyMatrix4(On),this}scale(t,e,i){return On.makeScale(t,e,i),this.applyMatrix4(On),this}lookAt(t){return sc.lookAt(t),sc.updateMatrix(),this.applyMatrix4(sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fa).negate(),this.translate(Fa.x,Fa.y,Fa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ee(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ws);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];In.setFromBufferAttribute(s),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(In.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];vs.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(In.min,vs.min),In.expandByPoint(sn),sn.addVectors(In.max,vs.max),In.expandByPoint(sn)):(In.expandByPoint(vs.min),In.expandByPoint(vs.max))}In.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)sn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(sn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)sn.fromBufferAttribute(r,c),l&&(Fa.fromBufferAttribute(t,c),sn.add(Fa)),a=Math.max(a,i.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new G,l[E]=new G;const c=new G,h=new G,f=new G,d=new Wt,u=new Wt,g=new Wt,y=new G,m=new G;function p(E,M,b){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,M),f.fromBufferAttribute(i,b),d.fromBufferAttribute(s,E),u.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),h.sub(c),f.sub(c),u.sub(d),g.sub(d);const P=1/(u.x*g.y-g.x*u.y);isFinite(P)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(P),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(P),r[E].add(y),r[M].add(y),r[b].add(y),l[E].add(m),l[M].add(m),l[b].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let E=0,M=v.length;E<M;++E){const b=v[E],P=b.start,z=b.count;for(let I=P,B=P+z;I<B;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const _=new G,x=new G,R=new G,S=new G;function w(E){R.fromBufferAttribute(a,E),S.copy(R);const M=r[E];_.copy(M),_.sub(R.multiplyScalar(R.dot(M))).normalize(),x.crossVectors(S,M);const P=x.dot(l[E])<0?-1:1;o.setXYZW(E,_.x,_.y,_.z,P)}for(let E=0,M=v.length;E<M;++E){const b=v[E],P=b.start,z=b.count;for(let I=P,B=P+z;I<B;I+=3)w(t.getX(I+0)),w(t.getX(I+1)),w(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new hn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new G,s=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)sn.fromBufferAttribute(t,e),sn.normalize(),t.setXYZ(e,sn.x,sn.y,sn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,g=0;for(let y=0,m=l.length;y<m;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[g++]=c[u++]}return new hn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ld=new Oe,Zi=new jl,po=new pr,Dd=new G,mo=new G,go=new G,xo=new G,oc=new G,vo=new G,kd=new G,_o=new G;class me extends We{constructor(t=new Je,e=new Qe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){vo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(oc.fromBufferAttribute(f,t),o?vo.addScaledVector(oc,h):vo.addScaledVector(oc.sub(e),h))}e.add(vo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),po.copy(i.boundingSphere),po.applyMatrix4(s),Zi.copy(t.ray).recast(t.near),!(po.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(po,Dd)===null||Zi.origin.distanceToSquared(Dd)>(t.far-t.near)**2))&&(Ld.copy(s).invert(),Zi.copy(t.ray).applyMatrix4(Ld),!(i.boundingBox!==null&&Zi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Zi)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],v=Math.max(m.start,u.start),_=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let x=v,R=_;x<R;x+=3){const S=r.getX(x),w=r.getX(x+1),E=r.getX(x+2);a=yo(this,p,t,i,c,h,f,S,w,E),a&&(a.faceIndex=Math.floor(x/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const v=r.getX(m),_=r.getX(m+1),x=r.getX(m+2);a=yo(this,o,t,i,c,h,f,v,_,x),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],v=Math.max(m.start,u.start),_=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let x=v,R=_;x<R;x+=3){const S=x,w=x+1,E=x+2;a=yo(this,p,t,i,c,h,f,S,w,E),a&&(a.faceIndex=Math.floor(x/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const v=m,_=m+1,x=m+2;a=yo(this,o,t,i,c,h,f,v,_,x),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function hv(n,t,e,i,a,s,o,r){let l;if(t.side===Pn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Bi,r),l===null)return null;_o.copy(r),_o.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(_o);return c<e.near||c>e.far?null:{distance:c,point:_o.clone(),object:n}}function yo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,mo),n.getVertexPosition(l,go),n.getVertexPosition(c,xo);const h=hv(n,t,e,i,mo,go,xo,kd);if(h){const f=new G;Un.getBarycoord(kd,mo,go,xo,f),a&&(h.uv=Un.getInterpolatedAttribute(a,r,l,c,f,new Wt)),s&&(h.uv1=Un.getInterpolatedAttribute(s,r,l,c,f,new Wt)),o&&(h.normal=Un.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Un.getNormal(mo,go,xo,d.normal),h.face=d,h.barycoord=f}return h}class Qn extends Je{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Ee(c,3)),this.setAttribute("normal",new Ee(h,3)),this.setAttribute("uv",new Ee(f,2));function g(y,m,p,v,_,x,R,S,w,E,M){const b=x/w,P=R/E,z=x/2,I=R/2,B=S/2,L=w+1,D=E+1;let V=0,O=0;const F=new G;for(let X=0;X<D;X++){const nt=X*P-I;for(let at=0;at<L;at++){const ot=at*b-z;F[y]=ot*v,F[m]=nt*_,F[p]=B,c.push(F.x,F.y,F.z),F[y]=0,F[m]=0,F[p]=S>0?1:-1,h.push(F.x,F.y,F.z),f.push(at/w),f.push(1-X/E),V+=1}}for(let X=0;X<E;X++)for(let nt=0;nt<w;nt++){const at=d+nt+L*X,ot=d+nt+L*(X+1),Q=d+(nt+1)+L*(X+1),q=d+(nt+1)+L*X;l.push(at,ot,q),l.push(ot,Q,q),O+=6}r.addGroup(u,O,M),u+=O,d+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ss(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Mn(n){const t={};for(let e=0;e<n.length;e++){const i=ss(n[e]);for(const a in i)t[a]=i[a]}return t}function dv(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Rf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ye.workingColorSpace}const uv={clone:ss,merge:Mn};var fv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hi extends fa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fv,this.fragmentShader=pv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ss(t.uniforms),this.uniformsGroups=dv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Pf extends We{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=Mi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Di=new G,Id=new Wt,Fd=new Wt;class Hn extends Pf{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ja*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(ja*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Di.x,Di.y).multiplyScalar(-t/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Di.x,Di.y).multiplyScalar(-t/Di.z)}getViewSize(t,e){return this.getViewBounds(t,Id,Fd),e.subVectors(Fd,Id)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ja*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const za=-90,Ua=1;class mv extends We{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Hn(za,Ua,t,e);a.layers=this.layers,this.add(a);const s=new Hn(za,Ua,t,e);s.layers=this.layers,this.add(s);const o=new Hn(za,Ua,t,e);o.layers=this.layers,this.add(o);const r=new Hn(za,Ua,t,e);r.layers=this.layers,this.add(r);const l=new Hn(za,Ua,t,e);l.layers=this.layers,this.add(l);const c=new Hn(za,Ua,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===Mi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===nr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Cf extends En{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:es,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gv extends da{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Cf(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:oi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Qn(5,5,5),s=new Hi({name:"CubemapFromEquirect",uniforms:ss(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Pn,blending:Ni});s.uniforms.tEquirect.value=e;const o=new me(a,s),r=e.minFilter;return e.minFilter===ra&&(e.minFilter=oi),new mv(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const rc=new G,xv=new G,vv=new de;class ea{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=rc.subVectors(i,e).cross(xv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(rc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||vv.getNormalMatrix(t),a=this.coplanarPoint(rc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new pr,Mo=new G;class Jl{constructor(t=new ea,e=new ea,i=new ea,a=new ea,s=new ea,o=new ea){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Mi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],g=a[9],y=a[10],m=a[11],p=a[12],v=a[13],_=a[14],x=a[15];if(i[0].setComponents(l-s,d-c,m-u,x-p).normalize(),i[1].setComponents(l+s,d+c,m+u,x+p).normalize(),i[2].setComponents(l+o,d+h,m+g,x+v).normalize(),i[3].setComponents(l-o,d-h,m-g,x-v).normalize(),i[4].setComponents(l-r,d-f,m-y,x-_).normalize(),e===Mi)i[5].setComponents(l+r,d+f,m+y,x+_).normalize();else if(e===nr)i[5].setComponents(r,f,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){return qi.center.set(0,0,0),qi.radius=.7071067811865476,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Mo.x=a.normal.x>0?t.max.x:t.min.x,Mo.y=a.normal.y>0?t.max.y:t.min.y,Mo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Mo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Lf(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function _v(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],y=f[u];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Bn extends Je{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const v=p*d-o;for(let _=0;_<c;_++){const x=_*f-s;g.push(x,-v,0),y.push(0,0,1),m.push(_/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<r;v++){const _=v+c*p,x=v+c*(p+1),R=v+1+c*(p+1),S=v+1+c*p;u.push(_,x,S),u.push(x,R,S)}this.setIndex(u),this.setAttribute("position",new Ee(g,3)),this.setAttribute("normal",new Ee(y,3)),this.setAttribute("uv",new Ee(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bn(t.width,t.height,t.widthSegments,t.heightSegments)}}var yv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mv=`#ifdef USE_ALPHAHASH
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
#endif`,bv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ev=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tv=`#ifdef USE_AOMAP
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
#endif`,Av=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rv=`#ifdef USE_BATCHING
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
#endif`,Pv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Lv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,kv=`#ifdef USE_IRIDESCENCE
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
#endif`,Iv=`#ifdef USE_BUMPMAP
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
#endif`,Fv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,zv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ov=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Vv=`#define PI 3.141592653589793
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
} // validated`,Xv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wv=`vec3 transformedNormal = objectNormal;
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
#endif`,Yv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$v=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jv=`#ifdef USE_ENVMAP
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
#endif`,Qv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,t_=`#ifdef USE_ENVMAP
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
#endif`,e_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,n_=`#ifdef USE_ENVMAP
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
#endif`,i_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,s_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,o_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,r_=`#ifdef USE_GRADIENTMAP
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
}`,c_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,l_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,h_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,d_=`uniform bool receiveShadow;
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
#endif`,u_=`#ifdef USE_ENVMAP
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
#endif`,f_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,p_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,m_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,g_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x_=`PhysicalMaterial material;
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
#endif`,v_=`struct PhysicalMaterial {
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
}`,__=`
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
#endif`,y_=`#if defined( RE_IndirectDiffuse )
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
#endif`,M_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,b_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,S_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,w_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,E_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,T_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,A_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,R_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,P_=`#if defined( USE_POINTS_UV )
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
#endif`,C_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,L_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,D_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,I_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,F_=`#ifdef USE_MORPHTARGETS
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
#endif`,z_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,N_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,O_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,H_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,G_=`#ifdef USE_NORMALMAP
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
#endif`,V_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,X_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,W_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Y_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Z_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,q_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,j_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,K_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,J_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Q_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ty=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ey=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ny=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,iy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ay=`float getShadowMask() {
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
}`,sy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oy=`#ifdef USE_SKINNING
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
#endif`,ry=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cy=`#ifdef USE_SKINNING
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
#endif`,ly=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fy=`#ifdef USE_TRANSMISSION
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
#endif`,py=`#ifdef USE_TRANSMISSION
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
#endif`,my=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _y=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yy=`uniform sampler2D t2D;
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
}`,My=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,by=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Sy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ey=`#include <common>
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
}`,Ty=`#if DEPTH_PACKING == 3200
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
}`,Ay=`#define DISTANCE
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
}`,Ry=`#define DISTANCE
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
}`,Py=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ly=`uniform float scale;
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
}`,Dy=`uniform vec3 diffuse;
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
}`,ky=`#include <common>
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
}`,Iy=`uniform vec3 diffuse;
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
}`,Fy=`#define LAMBERT
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
}`,zy=`#define LAMBERT
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
}`,Uy=`#define MATCAP
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
}`,Ny=`#define MATCAP
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
}`,Oy=`#define NORMAL
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
}`,By=`#define NORMAL
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
}`,Hy=`#define PHONG
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
}`,Gy=`#define PHONG
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
}`,Vy=`#define STANDARD
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
}`,Xy=`#define STANDARD
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
}`,Wy=`#define TOON
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
}`,Yy=`#define TOON
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
}`,$y=`uniform float size;
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
}`,Zy=`uniform vec3 diffuse;
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
}`,qy=`#include <common>
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
}`,jy=`uniform vec3 color;
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
}`,Ky=`uniform float rotation;
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
}`,Jy=`uniform vec3 diffuse;
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
}`,ue={alphahash_fragment:yv,alphahash_pars_fragment:Mv,alphamap_fragment:bv,alphamap_pars_fragment:Sv,alphatest_fragment:wv,alphatest_pars_fragment:Ev,aomap_fragment:Tv,aomap_pars_fragment:Av,batching_pars_vertex:Rv,batching_vertex:Pv,begin_vertex:Cv,beginnormal_vertex:Lv,bsdfs:Dv,iridescence_fragment:kv,bumpmap_pars_fragment:Iv,clipping_planes_fragment:Fv,clipping_planes_pars_fragment:zv,clipping_planes_pars_vertex:Uv,clipping_planes_vertex:Nv,color_fragment:Ov,color_pars_fragment:Bv,color_pars_vertex:Hv,color_vertex:Gv,common:Vv,cube_uv_reflection_fragment:Xv,defaultnormal_vertex:Wv,displacementmap_pars_vertex:Yv,displacementmap_vertex:$v,emissivemap_fragment:Zv,emissivemap_pars_fragment:qv,colorspace_fragment:jv,colorspace_pars_fragment:Kv,envmap_fragment:Jv,envmap_common_pars_fragment:Qv,envmap_pars_fragment:t_,envmap_pars_vertex:e_,envmap_physical_pars_fragment:u_,envmap_vertex:n_,fog_vertex:i_,fog_pars_vertex:a_,fog_fragment:s_,fog_pars_fragment:o_,gradientmap_pars_fragment:r_,lightmap_pars_fragment:c_,lights_lambert_fragment:l_,lights_lambert_pars_fragment:h_,lights_pars_begin:d_,lights_toon_fragment:f_,lights_toon_pars_fragment:p_,lights_phong_fragment:m_,lights_phong_pars_fragment:g_,lights_physical_fragment:x_,lights_physical_pars_fragment:v_,lights_fragment_begin:__,lights_fragment_maps:y_,lights_fragment_end:M_,logdepthbuf_fragment:b_,logdepthbuf_pars_fragment:S_,logdepthbuf_pars_vertex:w_,logdepthbuf_vertex:E_,map_fragment:T_,map_pars_fragment:A_,map_particle_fragment:R_,map_particle_pars_fragment:P_,metalnessmap_fragment:C_,metalnessmap_pars_fragment:L_,morphinstance_vertex:D_,morphcolor_vertex:k_,morphnormal_vertex:I_,morphtarget_pars_vertex:F_,morphtarget_vertex:z_,normal_fragment_begin:U_,normal_fragment_maps:N_,normal_pars_fragment:O_,normal_pars_vertex:B_,normal_vertex:H_,normalmap_pars_fragment:G_,clearcoat_normal_fragment_begin:V_,clearcoat_normal_fragment_maps:X_,clearcoat_pars_fragment:W_,iridescence_pars_fragment:Y_,opaque_fragment:$_,packing:Z_,premultiplied_alpha_fragment:q_,project_vertex:j_,dithering_fragment:K_,dithering_pars_fragment:J_,roughnessmap_fragment:Q_,roughnessmap_pars_fragment:ty,shadowmap_pars_fragment:ey,shadowmap_pars_vertex:ny,shadowmap_vertex:iy,shadowmask_pars_fragment:ay,skinbase_vertex:sy,skinning_pars_vertex:oy,skinning_vertex:ry,skinnormal_vertex:cy,specularmap_fragment:ly,specularmap_pars_fragment:hy,tonemapping_fragment:dy,tonemapping_pars_fragment:uy,transmission_fragment:fy,transmission_pars_fragment:py,uv_pars_fragment:my,uv_pars_vertex:gy,uv_vertex:xy,worldpos_vertex:vy,background_vert:_y,background_frag:yy,backgroundCube_vert:My,backgroundCube_frag:by,cube_vert:Sy,cube_frag:wy,depth_vert:Ey,depth_frag:Ty,distanceRGBA_vert:Ay,distanceRGBA_frag:Ry,equirect_vert:Py,equirect_frag:Cy,linedashed_vert:Ly,linedashed_frag:Dy,meshbasic_vert:ky,meshbasic_frag:Iy,meshlambert_vert:Fy,meshlambert_frag:zy,meshmatcap_vert:Uy,meshmatcap_frag:Ny,meshnormal_vert:Oy,meshnormal_frag:By,meshphong_vert:Hy,meshphong_frag:Gy,meshphysical_vert:Vy,meshphysical_frag:Xy,meshtoon_vert:Wy,meshtoon_frag:Yy,points_vert:$y,points_frag:Zy,shadow_vert:qy,shadow_frag:jy,sprite_vert:Ky,sprite_frag:Jy},Nt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new de}},envmap:{envMap:{value:null},envMapRotation:{value:new de},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new de}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new de}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new de},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new de},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new de},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new de}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new de}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new de}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0},uvTransform:{value:new de}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new de},alphaMap:{value:null},alphaMapTransform:{value:new de},alphaTest:{value:0}}},si={basic:{uniforms:Mn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.fog]),vertexShader:ue.meshbasic_vert,fragmentShader:ue.meshbasic_frag},lambert:{uniforms:Mn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)}}]),vertexShader:ue.meshlambert_vert,fragmentShader:ue.meshlambert_frag},phong:{uniforms:Mn([Nt.common,Nt.specularmap,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:ue.meshphong_vert,fragmentShader:ue.meshphong_frag},standard:{uniforms:Mn([Nt.common,Nt.envmap,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.roughnessmap,Nt.metalnessmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag},toon:{uniforms:Mn([Nt.common,Nt.aomap,Nt.lightmap,Nt.emissivemap,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.gradientmap,Nt.fog,Nt.lights,{emissive:{value:new ee(0)}}]),vertexShader:ue.meshtoon_vert,fragmentShader:ue.meshtoon_frag},matcap:{uniforms:Mn([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,Nt.fog,{matcap:{value:null}}]),vertexShader:ue.meshmatcap_vert,fragmentShader:ue.meshmatcap_frag},points:{uniforms:Mn([Nt.points,Nt.fog]),vertexShader:ue.points_vert,fragmentShader:ue.points_frag},dashed:{uniforms:Mn([Nt.common,Nt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ue.linedashed_vert,fragmentShader:ue.linedashed_frag},depth:{uniforms:Mn([Nt.common,Nt.displacementmap]),vertexShader:ue.depth_vert,fragmentShader:ue.depth_frag},normal:{uniforms:Mn([Nt.common,Nt.bumpmap,Nt.normalmap,Nt.displacementmap,{opacity:{value:1}}]),vertexShader:ue.meshnormal_vert,fragmentShader:ue.meshnormal_frag},sprite:{uniforms:Mn([Nt.sprite,Nt.fog]),vertexShader:ue.sprite_vert,fragmentShader:ue.sprite_frag},background:{uniforms:{uvTransform:{value:new de},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ue.background_vert,fragmentShader:ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new de}},vertexShader:ue.backgroundCube_vert,fragmentShader:ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ue.cube_vert,fragmentShader:ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ue.equirect_vert,fragmentShader:ue.equirect_frag},distanceRGBA:{uniforms:Mn([Nt.common,Nt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ue.distanceRGBA_vert,fragmentShader:ue.distanceRGBA_frag},shadow:{uniforms:Mn([Nt.lights,Nt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:ue.shadow_vert,fragmentShader:ue.shadow_frag}};si.physical={uniforms:Mn([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new de},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new de},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new de},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new de},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new de},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new de},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new de},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new de},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new de},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new de},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new de},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new de}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag};const bo={r:0,b:0,g:0},ji=new li,Qy=new Oe;function tM(n,t,e,i,a,s,o){const r=new ee(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function g(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?e:t).get(_)),_}function y(v){let _=!1;const x=g(v);x===null?p(r,l):x&&x.isColor&&(p(x,1),_=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(v,_){const x=g(_);x&&(x.isCubeTexture||x.mapping===ur)?(h===void 0&&(h=new me(new Qn(1,1,1),new Hi({name:"BackgroundCubeMaterial",uniforms:ss(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),ji.copy(_.backgroundRotation),ji.x*=-1,ji.y*=-1,ji.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Qy.makeRotationFromEuler(ji)),h.material.toneMapped=ye.getTransfer(x.colorSpace)!==ke,(f!==x||d!==x.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=x,d=x.version,u=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new me(new Bn(2,2),new Hi({name:"BackgroundMaterial",uniforms:ss(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:Bi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ye.getTransfer(x.colorSpace)!==ke,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||d!==x.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=x,d=x.version,u=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,_){v.getRGB(bo,Rf(n)),i.buffers.color.setClear(bo.r,bo.g,bo.b,_,o)}return{getClearColor:function(){return r},setClearColor:function(v,_=1){r.set(v),l=_,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(r,l)},render:y,addToRenderList:m}}function eM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(b,P,z,I,B){let L=!1;const D=f(I,z,P);s!==D&&(s=D,c(s.object)),L=u(b,I,z,B),L&&g(b,I,z,B),B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,x(b,P,z,I),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function f(b,P,z){const I=z.wireframe===!0;let B=i[b.id];B===void 0&&(B={},i[b.id]=B);let L=B[P.id];L===void 0&&(L={},B[P.id]=L);let D=L[I];return D===void 0&&(D=d(l()),L[I]=D),D}function d(b){const P=[],z=[],I=[];for(let B=0;B<e;B++)P[B]=0,z[B]=0,I[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:z,attributeDivisors:I,object:b,attributes:{},index:null}}function u(b,P,z,I){const B=s.attributes,L=P.attributes;let D=0;const V=z.getAttributes();for(const O in V)if(V[O].location>=0){const X=B[O];let nt=L[O];if(nt===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(nt=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(nt=b.instanceColor)),X===void 0||X.attribute!==nt||nt&&X.data!==nt.data)return!0;D++}return s.attributesNum!==D||s.index!==I}function g(b,P,z,I){const B={},L=P.attributes;let D=0;const V=z.getAttributes();for(const O in V)if(V[O].location>=0){let X=L[O];X===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(X=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(X=b.instanceColor));const nt={};nt.attribute=X,X&&X.data&&(nt.data=X.data),B[O]=nt,D++}s.attributes=B,s.attributesNum=D,s.index=I}function y(){const b=s.newAttributes;for(let P=0,z=b.length;P<z;P++)b[P]=0}function m(b){p(b,0)}function p(b,P){const z=s.newAttributes,I=s.enabledAttributes,B=s.attributeDivisors;z[b]=1,I[b]===0&&(n.enableVertexAttribArray(b),I[b]=1),B[b]!==P&&(n.vertexAttribDivisor(b,P),B[b]=P)}function v(){const b=s.newAttributes,P=s.enabledAttributes;for(let z=0,I=P.length;z<I;z++)P[z]!==b[z]&&(n.disableVertexAttribArray(z),P[z]=0)}function _(b,P,z,I,B,L,D){D===!0?n.vertexAttribIPointer(b,P,z,B,L):n.vertexAttribPointer(b,P,z,I,B,L)}function x(b,P,z,I){y();const B=I.attributes,L=z.getAttributes(),D=P.defaultAttributeValues;for(const V in L){const O=L[V];if(O.location>=0){let F=B[V];if(F===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(F=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(F=b.instanceColor)),F!==void 0){const X=F.normalized,nt=F.itemSize,at=t.get(F);if(at===void 0)continue;const ot=at.buffer,Q=at.type,q=at.bytesPerElement,gt=Q===n.INT||Q===n.UNSIGNED_INT||F.gpuType===Vl;if(F.isInterleavedBufferAttribute){const J=F.data,yt=J.stride,Dt=F.offset;if(J.isInstancedInterleavedBuffer){for(let zt=0;zt<O.locationSize;zt++)p(O.location+zt,J.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let zt=0;zt<O.locationSize;zt++)m(O.location+zt);n.bindBuffer(n.ARRAY_BUFFER,ot);for(let zt=0;zt<O.locationSize;zt++)_(O.location+zt,nt/O.locationSize,Q,X,yt*q,(Dt+nt/O.locationSize*zt)*q,gt)}else{if(F.isInstancedBufferAttribute){for(let J=0;J<O.locationSize;J++)p(O.location+J,F.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let J=0;J<O.locationSize;J++)m(O.location+J);n.bindBuffer(n.ARRAY_BUFFER,ot);for(let J=0;J<O.locationSize;J++)_(O.location+J,nt/O.locationSize,Q,X,nt*q,nt/O.locationSize*J*q,gt)}}else if(D!==void 0){const X=D[V];if(X!==void 0)switch(X.length){case 2:n.vertexAttrib2fv(O.location,X);break;case 3:n.vertexAttrib3fv(O.location,X);break;case 4:n.vertexAttrib4fv(O.location,X);break;default:n.vertexAttrib1fv(O.location,X)}}}}v()}function R(){E();for(const b in i){const P=i[b];for(const z in P){const I=P[z];for(const B in I)h(I[B].object),delete I[B];delete P[z]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const z in P){const I=P[z];for(const B in I)h(I[B].object),delete I[B];delete P[z]}delete i[b.id]}function w(b){for(const P in i){const z=i[P];if(z[b.id]===void 0)continue;const I=z[b.id];for(const B in I)h(I[B].object),delete I[B];delete z[b.id]}}function E(){M(),o=!0,s!==a&&(s=a,c(s.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:S,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:m,disableUnusedAttributes:v}}function nM(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let g=0;for(let y=0;y<f;y++)g+=h[y]*d[y];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function iM(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(w){return!(w!==Kn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(w){const E=w===Vs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Si&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==yi&&!E)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:R,maxSamples:S}}function aM(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new ea,r=new de,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!a||g===null||g.length===0||s&&!m)s?h(null):c();else{const v=s?0:i,_=v*4;let x=p.clippingState||null;l.value=x,x=h(g,d,_,u);for(let R=0;R!==_;++R)x[R]=e[R];p.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const y=f!==null?f.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=u+y*4,v=d.matrixWorldInverse;r.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,x=u;_!==y;++_,x+=4)o.copy(f[_]).applyMatrix4(v,r),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function sM(n){let t=new WeakMap;function e(o,r){return r===Yc?o.mapping=es:r===$c&&(o.mapping=ns),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Yc||r===$c)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gv(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Df extends Pf{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Wa=4,zd=[.125,.215,.35,.446,.526,.582],sa=20,cc=new Df,Ud=new ee;let lc=null,hc=0,dc=0,uc=!1;const na=(1+Math.sqrt(5))/2,Na=1/na,Nd=[new G(-na,Na,0),new G(na,Na,0),new G(-Na,0,na),new G(Na,0,na),new G(0,na,-Na),new G(0,na,Na),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class Od{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){lc=this._renderer.getRenderTarget(),hc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(lc,hc,dc),this._renderer.xr.enabled=uc,t.scissorTest=!1,So(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===es||t.mapping===ns?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),lc=this._renderer.getRenderTarget(),hc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:oi,minFilter:oi,generateMipmaps:!1,type:Vs,format:Kn,colorSpace:os,depthBuffer:!1},a=Bd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bd(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=oM(s)),this._blurMaterial=rM(s,t,e)}return a}_compileMaterial(t){const e=new me(this._lodPlanes[0],t);this._renderer.compile(e,cc)}_sceneToCubeUV(t,e,i,a){const r=new Hn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Ud),h.toneMapping=Oi,h.autoClear=!1;const u=new Qe({name:"PMREM.Background",side:Pn,depthWrite:!1,depthTest:!1}),g=new me(new Qn,u);let y=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,y=!0):(u.color.copy(Ud),y=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):v===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const _=this._cubeSize;So(a,v*_,p>2?_:0,_,_),h.setRenderTarget(a),y&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===es||t.mapping===ns;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hd());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new me(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;So(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,cc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Nd[(a-s-1)%Nd.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new me(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*sa-1),y=s/g,m=isFinite(s)?1+Math.floor(h*y):sa;m>sa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${sa}`);const p=[];let v=0;for(let w=0;w<sa;++w){const E=w/y,M=Math.exp(-E*E/2);p.push(M),w===0?v+=M:w<m&&(v+=2*M)}for(let w=0;w<p.length;w++)p[w]=p[w]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;const x=this._sizeLods[a],R=3*x*(a>_-Wa?a-_+Wa:0),S=4*(this._cubeSize-x);So(e,R,S,3*x,2*x),l.setRenderTarget(e),l.render(f,cc)}}function oM(n){const t=[],e=[],i=[];let a=n;const s=n-Wa+1+zd.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-Wa?l=zd[o-n+Wa-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,y=3,m=2,p=1,v=new Float32Array(y*g*u),_=new Float32Array(m*g*u),x=new Float32Array(p*g*u);for(let S=0;S<u;S++){const w=S%3*2/3-1,E=S>2?0:-1,M=[w,E,0,w+2/3,E,0,w+2/3,E+1,0,w,E,0,w+2/3,E+1,0,w,E+1,0];v.set(M,y*g*S),_.set(d,m*g*S);const b=[S,S,S,S,S,S];x.set(b,p*g*S)}const R=new Je;R.setAttribute("position",new hn(v,y)),R.setAttribute("uv",new hn(_,m)),R.setAttribute("faceIndex",new hn(x,p)),t.push(R),a>Wa&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Bd(n,t,e){const i=new da(n,t,e);return i.texture.mapping=ur,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function So(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function rM(n,t,e){const i=new Float32Array(sa),a=new G(0,1,0);return new Hi({name:"SphericalGaussianBlur",defines:{n:sa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Ql(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Hd(){return new Hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ql(),fragmentShader:`

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
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Gd(){return new Hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ni,depthTest:!1,depthWrite:!1})}function Ql(){return`

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
	`}function cM(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Yc||l===$c,h=l===es||l===ns;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Od(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new Od(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function lM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Ss("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function hM(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const y=d.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const y=u[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,g=f.attributes.position;let y=0;if(u!==null){const v=u.array;y=u.version;for(let _=0,x=v.length;_<x;_+=3){const R=v[_+0],S=v[_+1],w=v[_+2];d.push(R,S,S,w,w,R)}}else if(g!==void 0){const v=g.array;y=g.version;for(let _=0,x=v.length/3-1;_<x;_+=3){const R=_+0,S=_+1,w=_+2;d.push(R,S,S,w,w,R)}}else return;const m=new(bf(d)?Af:Tf)(d,1);m.version=y;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function dM(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,s,d*o,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,y,0,g);let p=0;for(let v=0;v<g;v++)p+=u[v]*y[v];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function uM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function fM(n,t,e){const i=new WeakMap,a=new je;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let b=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var u=b;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],v=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let x=0;g===!0&&(x=1),y===!0&&(x=2),m===!0&&(x=3);let R=r.attributes.position.count*x,S=1;R>t.maxTextureSize&&(S=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const w=new Float32Array(R*S*4*f),E=new wf(w,R,S,f);E.type=yi,E.needsUpdate=!0;const M=x*4;for(let P=0;P<f;P++){const z=p[P],I=v[P],B=_[P],L=R*S*4*P;for(let D=0;D<z.count;D++){const V=D*M;g===!0&&(a.fromBufferAttribute(z,D),w[L+V+0]=a.x,w[L+V+1]=a.y,w[L+V+2]=a.z,w[L+V+3]=0),y===!0&&(a.fromBufferAttribute(I,D),w[L+V+4]=a.x,w[L+V+5]=a.y,w[L+V+6]=a.z,w[L+V+7]=0),m===!0&&(a.fromBufferAttribute(B,D),w[L+V+8]=a.x,w[L+V+9]=a.y,w[L+V+10]=a.z,w[L+V+11]=B.itemSize===4?a.w:1)}}d={count:f,texture:E,size:new Wt(R,S)},i.set(r,d),r.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function pM(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class kf extends En{constructor(t,e,i,a,s,o,r,l,c,h=qa){if(h!==qa&&h!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===qa&&(i=ha),i===void 0&&h===as&&(i=is),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Jn,this.minFilter=l!==void 0?l:Jn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const If=new En,Vd=new kf(1,1),Ff=new wf,zf=new tv,Uf=new Cf,Xd=[],Wd=[],Yd=new Float32Array(16),$d=new Float32Array(9),Zd=new Float32Array(4);function cs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Xd[a];if(s===void 0&&(s=new Float32Array(a),Xd[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function tn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function en(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function mr(n,t){let e=Wd[t];e===void 0&&(e=new Int32Array(t),Wd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function mM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function gM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2fv(this.addr,t),en(e,t)}}function xM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(tn(e,t))return;n.uniform3fv(this.addr,t),en(e,t)}}function vM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4fv(this.addr,t),en(e,t)}}function _M(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;Zd.set(i),n.uniformMatrix2fv(this.addr,!1,Zd),en(e,i)}}function yM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;$d.set(i),n.uniformMatrix3fv(this.addr,!1,$d),en(e,i)}}function MM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(tn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),en(e,t)}else{if(tn(e,i))return;Yd.set(i),n.uniformMatrix4fv(this.addr,!1,Yd),en(e,i)}}function bM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function SM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2iv(this.addr,t),en(e,t)}}function wM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;n.uniform3iv(this.addr,t),en(e,t)}}function EM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4iv(this.addr,t),en(e,t)}}function TM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function AM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(tn(e,t))return;n.uniform2uiv(this.addr,t),en(e,t)}}function RM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(tn(e,t))return;n.uniform3uiv(this.addr,t),en(e,t)}}function PM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(tn(e,t))return;n.uniform4uiv(this.addr,t),en(e,t)}}function CM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Vd.compareFunction=Mf,s=Vd):s=If,e.setTexture2D(t||s,a)}function LM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||zf,a)}function DM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Uf,a)}function kM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Ff,a)}function IM(n){switch(n){case 5126:return mM;case 35664:return gM;case 35665:return xM;case 35666:return vM;case 35674:return _M;case 35675:return yM;case 35676:return MM;case 5124:case 35670:return bM;case 35667:case 35671:return SM;case 35668:case 35672:return wM;case 35669:case 35673:return EM;case 5125:return TM;case 36294:return AM;case 36295:return RM;case 36296:return PM;case 35678:case 36198:case 36298:case 36306:case 35682:return CM;case 35679:case 36299:case 36307:return LM;case 35680:case 36300:case 36308:case 36293:return DM;case 36289:case 36303:case 36311:case 36292:return kM}}function FM(n,t){n.uniform1fv(this.addr,t)}function zM(n,t){const e=cs(t,this.size,2);n.uniform2fv(this.addr,e)}function UM(n,t){const e=cs(t,this.size,3);n.uniform3fv(this.addr,e)}function NM(n,t){const e=cs(t,this.size,4);n.uniform4fv(this.addr,e)}function OM(n,t){const e=cs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function BM(n,t){const e=cs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function HM(n,t){const e=cs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function GM(n,t){n.uniform1iv(this.addr,t)}function VM(n,t){n.uniform2iv(this.addr,t)}function XM(n,t){n.uniform3iv(this.addr,t)}function WM(n,t){n.uniform4iv(this.addr,t)}function YM(n,t){n.uniform1uiv(this.addr,t)}function $M(n,t){n.uniform2uiv(this.addr,t)}function ZM(n,t){n.uniform3uiv(this.addr,t)}function qM(n,t){n.uniform4uiv(this.addr,t)}function jM(n,t,e){const i=this.cache,a=t.length,s=mr(e,a);tn(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||If,s[o])}function KM(n,t,e){const i=this.cache,a=t.length,s=mr(e,a);tn(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||zf,s[o])}function JM(n,t,e){const i=this.cache,a=t.length,s=mr(e,a);tn(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Uf,s[o])}function QM(n,t,e){const i=this.cache,a=t.length,s=mr(e,a);tn(i,s)||(n.uniform1iv(this.addr,s),en(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Ff,s[o])}function tb(n){switch(n){case 5126:return FM;case 35664:return zM;case 35665:return UM;case 35666:return NM;case 35674:return OM;case 35675:return BM;case 35676:return HM;case 5124:case 35670:return GM;case 35667:case 35671:return VM;case 35668:case 35672:return XM;case 35669:case 35673:return WM;case 5125:return YM;case 36294:return $M;case 36295:return ZM;case 36296:return qM;case 35678:case 36198:case 36298:case 36306:case 35682:return jM;case 35679:case 36299:case 36307:return KM;case 35680:case 36300:case 36308:case 36293:return JM;case 36289:case 36303:case 36311:case 36292:return QM}}class eb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=IM(e.type)}}class nb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tb(e.type)}}class ib{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const fc=/(\w+)(\])?(\[|\.)?/g;function qd(n,t){n.seq.push(t),n.map[t.id]=t}function ab(n,t,e){const i=n.name,a=i.length;for(fc.lastIndex=0;;){const s=fc.exec(i),o=fc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){qd(e,c===void 0?new eb(r,n,t):new nb(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new ib(r),qd(e,f)),e=f}}}class Xo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);ab(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function jd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const sb=37297;let ob=0;function rb(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Kd=new de;function cb(n){ye._getMatrix(Kd,ye.workingColorSpace,n);const t=`mat3( ${Kd.elements.map(e=>e.toFixed(4))} )`;switch(ye.getTransfer(n)){case fr:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Jd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+rb(n.getShaderSource(t),o)}else return a}function lb(n,t){const e=cb(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hb(n,t){let e;switch(t){case ux:e="Linear";break;case fx:e="Reinhard";break;case px:e="Cineon";break;case mx:e="ACESFilmic";break;case xx:e="AgX";break;case vx:e="Neutral";break;case gx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const wo=new G;function db(){ye.getLuminanceCoefficients(wo);const n=wo.x.toFixed(4),t=wo.y.toFixed(4),e=wo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ub(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ws).join(`
`)}function fb(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function pb(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function ws(n){return n!==""}function Qd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function tu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sl(n){return n.replace(mb,xb)}const gb=new Map;function xb(n,t){let e=ue[t];if(e===void 0){const i=gb.get(t);if(i!==void 0)e=ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Sl(e)}const vb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function eu(n){return n.replace(vb,_b)}function _b(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function nu(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function yb(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===rf?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===cf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===vi&&(t="SHADOWMAP_TYPE_VSM"),t}function Mb(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case es:case ns:t="ENVMAP_TYPE_CUBE";break;case ur:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bb(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ns:t="ENVMAP_MODE_REFRACTION";break}return t}function Sb(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Gl:t="ENVMAP_BLENDING_MULTIPLY";break;case hx:t="ENVMAP_BLENDING_MIX";break;case dx:t="ENVMAP_BLENDING_ADD";break}return t}function wb(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Eb(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=yb(e),c=Mb(e),h=bb(e),f=Sb(e),d=wb(e),u=ub(e),g=fb(s),y=a.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ws).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ws).join(`
`),p.length>0&&(p+=`
`)):(m=[nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ws).join(`
`),p=[nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Oi?"#define TONE_MAPPING":"",e.toneMapping!==Oi?ue.tonemapping_pars_fragment:"",e.toneMapping!==Oi?hb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ue.colorspace_pars_fragment,lb("linearToOutputTexel",e.outputColorSpace),db(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ws).join(`
`)),o=Sl(o),o=Qd(o,e),o=tu(o,e),r=Sl(r),r=Qd(r,e),r=tu(r,e),o=eu(o),r=eu(r),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===fd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=v+m+o,x=v+p+r,R=jd(a,a.VERTEX_SHADER,_),S=jd(a,a.FRAGMENT_SHADER,x);a.attachShader(y,R),a.attachShader(y,S),e.index0AttributeName!==void 0?a.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function w(P){if(n.debug.checkShaderErrors){const z=a.getProgramInfoLog(y).trim(),I=a.getShaderInfoLog(R).trim(),B=a.getShaderInfoLog(S).trim();let L=!0,D=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,y,R,S);else{const V=Jd(a,R,"vertex"),O=Jd(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+V+`
`+O)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||B==="")&&(D=!1);D&&(P.diagnostics={runnable:L,programLog:z,vertexShader:{log:I,prefix:m},fragmentShader:{log:B,prefix:p}})}a.deleteShader(R),a.deleteShader(S),E=new Xo(a,y),M=pb(a,y)}let E;this.getUniforms=function(){return E===void 0&&w(this),E};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=a.getProgramParameter(y,sb)),b},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ob++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=S,this}let Tb=0;class Ab{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Rb(t),e.set(t,i)),i}}class Rb{constructor(t){this.id=Tb++,this.code=t,this.usedTimes=0}}function Pb(n,t,e,i,a,s,o){const r=new Kl,l=new Ab,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,b,P,z,I){const B=z.fog,L=I.geometry,D=M.isMeshStandardMaterial?z.environment:null,V=(M.isMeshStandardMaterial?e:t).get(M.envMap||D),O=V&&V.mapping===ur?V.image.height:null,F=g[M.type];M.precision!==null&&(u=a.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const X=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,nt=X!==void 0?X.length:0;let at=0;L.morphAttributes.position!==void 0&&(at=1),L.morphAttributes.normal!==void 0&&(at=2),L.morphAttributes.color!==void 0&&(at=3);let ot,Q,q,gt;if(F){const ne=si[F];ot=ne.vertexShader,Q=ne.fragmentShader}else ot=M.vertexShader,Q=M.fragmentShader,l.update(M),q=l.getVertexShaderID(M),gt=l.getFragmentShaderID(M);const J=n.getRenderTarget(),yt=n.state.buffers.depth.getReversed(),Dt=I.isInstancedMesh===!0,zt=I.isBatchedMesh===!0,$t=!!M.map,Tt=!!M.matcap,kt=!!V,N=!!M.aoMap,fe=!!M.lightMap,vt=!!M.bumpMap,Ht=!!M.normalMap,Ut=!!M.displacementMap,Lt=!!M.emissiveMap,Ct=!!M.metalnessMap,C=!!M.roughnessMap,T=M.anisotropy>0,Z=M.clearcoat>0,dt=M.dispersion>0,ut=M.iridescence>0,rt=M.sheen>0,It=M.transmission>0,K=T&&!!M.anisotropyMap,xt=Z&&!!M.clearcoatMap,Ft=Z&&!!M.clearcoatNormalMap,st=Z&&!!M.clearcoatRoughnessMap,St=ut&&!!M.iridescenceMap,H=ut&&!!M.iridescenceThicknessMap,lt=rt&&!!M.sheenColorMap,pt=rt&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Vt=!!M.specularColorMap,Zt=!!M.specularIntensityMap,U=It&&!!M.transmissionMap,Mt=It&&!!M.thicknessMap,it=!!M.gradientMap,ht=!!M.alphaMap,wt=M.alphaTest>0,Et=!!M.alphaHash,Kt=!!M.extensions;let ie=Oi;M.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(ie=n.toneMapping);const pe={shaderID:F,shaderType:M.type,shaderName:M.name,vertexShader:ot,fragmentShader:Q,defines:M.defines,customVertexShaderID:q,customFragmentShaderID:gt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:zt,batchingColor:zt&&I._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&I.instanceColor!==null,instancingMorph:Dt&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:os,alphaToCoverage:!!M.alphaToCoverage,map:$t,matcap:Tt,envMap:kt,envMapMode:kt&&V.mapping,envMapCubeUVHeight:O,aoMap:N,lightMap:fe,bumpMap:vt,normalMap:Ht,displacementMap:d&&Ut,emissiveMap:Lt,normalMapObjectSpace:Ht&&M.normalMapType===bx,normalMapTangentSpace:Ht&&M.normalMapType===yf,metalnessMap:Ct,roughnessMap:C,anisotropy:T,anisotropyMap:K,clearcoat:Z,clearcoatMap:xt,clearcoatNormalMap:Ft,clearcoatRoughnessMap:st,dispersion:dt,iridescence:ut,iridescenceMap:St,iridescenceThicknessMap:H,sheen:rt,sheenColorMap:lt,sheenRoughnessMap:pt,specularMap:Gt,specularColorMap:Vt,specularIntensityMap:Zt,transmission:It,transmissionMap:U,thicknessMap:Mt,gradientMap:it,opaque:M.transparent===!1&&M.blending===Za&&M.alphaToCoverage===!1,alphaMap:ht,alphaTest:wt,alphaHash:Et,combine:M.combine,mapUv:$t&&y(M.map.channel),aoMapUv:N&&y(M.aoMap.channel),lightMapUv:fe&&y(M.lightMap.channel),bumpMapUv:vt&&y(M.bumpMap.channel),normalMapUv:Ht&&y(M.normalMap.channel),displacementMapUv:Ut&&y(M.displacementMap.channel),emissiveMapUv:Lt&&y(M.emissiveMap.channel),metalnessMapUv:Ct&&y(M.metalnessMap.channel),roughnessMapUv:C&&y(M.roughnessMap.channel),anisotropyMapUv:K&&y(M.anisotropyMap.channel),clearcoatMapUv:xt&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:St&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:H&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:pt&&y(M.sheenRoughnessMap.channel),specularMapUv:Gt&&y(M.specularMap.channel),specularColorMapUv:Vt&&y(M.specularColorMap.channel),specularIntensityMapUv:Zt&&y(M.specularIntensityMap.channel),transmissionMapUv:U&&y(M.transmissionMap.channel),thicknessMapUv:Mt&&y(M.thicknessMap.channel),alphaMapUv:ht&&y(M.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Ht||T),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&($t||ht),fog:!!B,useFog:M.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:yt,skinning:I.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:at,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ie,decodeVideoTexture:$t&&M.map.isVideoTexture===!0&&ye.getTransfer(M.map.colorSpace)===ke,decodeVideoTextureEmissive:Lt&&M.emissiveMap.isVideoTexture===!0&&ye.getTransfer(M.emissiveMap.colorSpace)===ke,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ve,flipSided:M.side===Pn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Kt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&M.extensions.multiDraw===!0||zt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(v(b,M),_(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function v(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function _(M,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),M.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reverseDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),M.push(r.mask)}function x(M){const b=g[M.type];let P;if(b){const z=si[b];P=uv.clone(z.uniforms)}else P=M.uniforms;return P}function R(M,b){let P;for(let z=0,I=h.length;z<I;z++){const B=h[z];if(B.cacheKey===b){P=B,++P.usedTimes;break}}return P===void 0&&(P=new Eb(n,b,M,s),h.push(P)),P}function S(M){if(--M.usedTimes===0){const b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function w(M){l.remove(M)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:R,releaseProgram:S,releaseShaderCache:w,programs:h,dispose:E}}function Cb(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function Lb(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function iu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function au(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,g,y,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:y,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=y,p.group=m),t++,p}function r(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||Lb),i.length>1&&i.sort(d||iu),a.length>1&&a.sort(d||iu)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function Db(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new au,n.set(i,[o])):a>=s.length?(o=new au,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function kb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ee};break;case"SpotLight":e={position:new G,direction:new G,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function Ib(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Fb=0;function zb(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Ub(n){const t=new kb,e=Ib(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const a=new G,s=new Oe,o=new Oe;function r(c){let h=0,f=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let u=0,g=0,y=0,m=0,p=0,v=0,_=0,x=0,R=0,S=0,w=0;c.sort(zb);for(let M=0,b=c.length;M<b;M++){const P=c[M],z=P.color,I=P.intensity,B=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=z.r*I,f+=z.g*I,d+=z.b*I;else if(P.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(P.sh.coefficients[D],I);w++}else if(P.isDirectionalLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,O=e.get(P);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,i.directionalShadow[u]=O,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=P.shadow.matrix,v++}i.directional[u]=D,u++}else if(P.isSpotLight){const D=t.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(z).multiplyScalar(I),D.distance=B,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,i.spot[y]=D;const V=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,V.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[y]=V.matrix,P.castShadow){const O=e.get(P);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,i.spotShadow[y]=O,i.spotShadowMap[y]=L,x++}y++}else if(P.isRectAreaLight){const D=t.get(P);D.color.copy(z).multiplyScalar(I),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=D,m++}else if(P.isPointLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),D.distance=P.distance,D.decay=P.decay,P.castShadow){const V=P.shadow,O=e.get(P);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,O.shadowCameraNear=V.camera.near,O.shadowCameraFar=V.camera.far,i.pointShadow[g]=O,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=P.shadow.matrix,_++}i.point[g]=D,g++}else if(P.isHemisphereLight){const D=t.get(P);D.skyColor.copy(P.color).multiplyScalar(I),D.groundColor.copy(P.groundColor).multiplyScalar(I),i.hemi[p]=D,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Nt.LTC_FLOAT_1,i.rectAreaLTC2=Nt.LTC_FLOAT_2):(i.rectAreaLTC1=Nt.LTC_HALF_1,i.rectAreaLTC2=Nt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const E=i.hash;(E.directionalLength!==u||E.pointLength!==g||E.spotLength!==y||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==v||E.numPointShadows!==_||E.numSpotShadows!==x||E.numSpotMaps!==R||E.numLightProbes!==w)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+R-S,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=w,E.directionalLength=u,E.pointLength=g,E.spotLength=y,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=v,E.numPointShadows=_,E.numSpotShadows=x,E.numSpotMaps=R,E.numLightProbes=w,i.version=Fb++)}function l(c,h){let f=0,d=0,u=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const _=c[p];if(_.isDirectionalLight){const x=i.directional[f];x.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(a),x.direction.transformDirection(m),f++}else if(_.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(a),x.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(_.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const x=i.hemi[y];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),y++}}}return{setup:r,setupView:l,state:i}}function su(n){const t=new Ub(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function Nb(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new su(n),t.set(a,[r])):s>=o.length?(r=new su(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class Ob extends fa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=yx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Bb extends fa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Hb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gb=`uniform sampler2D shadow_pass;
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
}`;function Vb(n,t,e){let i=new Jl;const a=new Wt,s=new Wt,o=new je,r=new Ob({depthPacking:Mx}),l=new Bb,c={},h=e.maxTextureSize,f={[Bi]:Pn,[Pn]:Bi,[Ve]:Ve},d=new Hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:Hb,fragmentShader:Gb}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new Je;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new me(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rf;let p=this.type;this.render=function(S,w,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),z=n.state;z.setBlending(Ni),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=p!==vi&&this.type===vi,B=p===vi&&this.type!==vi;for(let L=0,D=S.length;L<D;L++){const V=S[L],O=V.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;a.copy(O.mapSize);const F=O.getFrameExtents();if(a.multiply(F),s.copy(O.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/F.x),a.x=s.x*F.x,O.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/F.y),a.y=s.y*F.y,O.mapSize.y=s.y)),O.map===null||I===!0||B===!0){const nt=this.type!==vi?{minFilter:Jn,magFilter:Jn}:{};O.map!==null&&O.map.dispose(),O.map=new da(a.x,a.y,nt),O.map.texture.name=V.name+".shadowMap",O.camera.updateProjectionMatrix()}n.setRenderTarget(O.map),n.clear();const X=O.getViewportCount();for(let nt=0;nt<X;nt++){const at=O.getViewport(nt);o.set(s.x*at.x,s.y*at.y,s.x*at.z,s.y*at.w),z.viewport(o),O.updateMatrices(V,nt),i=O.getFrustum(),x(w,E,O.camera,V,this.type)}O.isPointLightShadow!==!0&&this.type===vi&&v(O,E),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,b,P)};function v(S,w){const E=t.update(y);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new da(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(w,null,E,d,y,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(w,null,E,u,y,null)}function _(S,w,E,M){let b=null;const P=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)b=P;else if(b=E.isPointLight===!0?l:r,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const z=b.uuid,I=w.uuid;let B=c[z];B===void 0&&(B={},c[z]=B);let L=B[I];L===void 0&&(L=b.clone(),B[I]=L,w.addEventListener("dispose",R)),b=L}if(b.visible=w.visible,b.wireframe=w.wireframe,M===vi?b.side=w.shadowSide!==null?w.shadowSide:w.side:b.side=w.shadowSide!==null?w.shadowSide:f[w.side],b.alphaMap=w.alphaMap,b.alphaTest=w.alphaTest,b.map=w.map,b.clipShadows=w.clipShadows,b.clippingPlanes=w.clippingPlanes,b.clipIntersection=w.clipIntersection,b.displacementMap=w.displacementMap,b.displacementScale=w.displacementScale,b.displacementBias=w.displacementBias,b.wireframeLinewidth=w.wireframeLinewidth,b.linewidth=w.linewidth,E.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const z=n.properties.get(b);z.light=E}return b}function x(S,w,E,M,b){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===vi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const I=t.update(S),B=S.material;if(Array.isArray(B)){const L=I.groups;for(let D=0,V=L.length;D<V;D++){const O=L[D],F=B[O.materialIndex];if(F&&F.visible){const X=_(S,F,M,b);S.onBeforeShadow(n,S,w,E,I,X,O),n.renderBufferDirect(E,null,I,X,S,O),S.onAfterShadow(n,S,w,E,I,X,O)}}}else if(B.visible){const L=_(S,B,M,b);S.onBeforeShadow(n,S,w,E,I,L,null),n.renderBufferDirect(E,null,I,L,S,null),S.onAfterShadow(n,S,w,E,I,L,null)}}const z=S.children;for(let I=0,B=z.length;I<B;I++)x(z[I],w,E,M,b)}function R(S){S.target.removeEventListener("dispose",R);for(const E in c){const M=c[E],b=S.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const Xb={[Oc]:Bc,[Hc]:Xc,[Gc]:Wc,[ts]:Vc,[Bc]:Oc,[Xc]:Hc,[Wc]:Gc,[Vc]:ts};function Wb(n,t){function e(){let U=!1;const Mt=new je;let it=null;const ht=new je(0,0,0,0);return{setMask:function(wt){it!==wt&&!U&&(n.colorMask(wt,wt,wt,wt),it=wt)},setLocked:function(wt){U=wt},setClear:function(wt,Et,Kt,ie,pe){pe===!0&&(wt*=ie,Et*=ie,Kt*=ie),Mt.set(wt,Et,Kt,ie),ht.equals(Mt)===!1&&(n.clearColor(wt,Et,Kt,ie),ht.copy(Mt))},reset:function(){U=!1,it=null,ht.set(-1,0,0,0)}}}function i(){let U=!1,Mt=!1,it=null,ht=null,wt=null;return{setReversed:function(Et){if(Mt!==Et){const Kt=t.get("EXT_clip_control");Mt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const ie=wt;wt=null,this.setClear(ie)}Mt=Et},getReversed:function(){return Mt},setTest:function(Et){Et?J(n.DEPTH_TEST):yt(n.DEPTH_TEST)},setMask:function(Et){it!==Et&&!U&&(n.depthMask(Et),it=Et)},setFunc:function(Et){if(Mt&&(Et=Xb[Et]),ht!==Et){switch(Et){case Oc:n.depthFunc(n.NEVER);break;case Bc:n.depthFunc(n.ALWAYS);break;case Hc:n.depthFunc(n.LESS);break;case ts:n.depthFunc(n.LEQUAL);break;case Gc:n.depthFunc(n.EQUAL);break;case Vc:n.depthFunc(n.GEQUAL);break;case Xc:n.depthFunc(n.GREATER);break;case Wc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ht=Et}},setLocked:function(Et){U=Et},setClear:function(Et){wt!==Et&&(Mt&&(Et=1-Et),n.clearDepth(Et),wt=Et)},reset:function(){U=!1,it=null,ht=null,wt=null,Mt=!1}}}function a(){let U=!1,Mt=null,it=null,ht=null,wt=null,Et=null,Kt=null,ie=null,pe=null;return{setTest:function(ne){U||(ne?J(n.STENCIL_TEST):yt(n.STENCIL_TEST))},setMask:function(ne){Mt!==ne&&!U&&(n.stencilMask(ne),Mt=ne)},setFunc:function(ne,Me,Be){(it!==ne||ht!==Me||wt!==Be)&&(n.stencilFunc(ne,Me,Be),it=ne,ht=Me,wt=Be)},setOp:function(ne,Me,Be){(Et!==ne||Kt!==Me||ie!==Be)&&(n.stencilOp(ne,Me,Be),Et=ne,Kt=Me,ie=Be)},setLocked:function(ne){U=ne},setClear:function(ne){pe!==ne&&(n.clearStencil(ne),pe=ne)},reset:function(){U=!1,Mt=null,it=null,ht=null,wt=null,Et=null,Kt=null,ie=null,pe=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,v=null,_=null,x=null,R=null,S=null,w=new ee(0,0,0),E=0,M=!1,b=null,P=null,z=null,I=null,B=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,V=0;const O=n.getParameter(n.VERSION);O.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(O)[1]),D=V>=1):O.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),D=V>=2);let F=null,X={};const nt=n.getParameter(n.SCISSOR_BOX),at=n.getParameter(n.VIEWPORT),ot=new je().fromArray(nt),Q=new je().fromArray(at);function q(U,Mt,it,ht){const wt=new Uint8Array(4),Et=n.createTexture();n.bindTexture(U,Et),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<it;Kt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(Mt,0,n.RGBA,1,1,ht,0,n.RGBA,n.UNSIGNED_BYTE,wt):n.texImage2D(Mt+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,wt);return Et}const gt={};gt[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),gt[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),gt[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),J(n.DEPTH_TEST),o.setFunc(ts),vt(!1),Ht(cd),J(n.CULL_FACE),N(Ni);function J(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function yt(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function Dt(U,Mt){return f[U]!==Mt?(n.bindFramebuffer(U,Mt),f[U]=Mt,U===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Mt),U===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Mt),!0):!1}function zt(U,Mt){let it=u,ht=!1;if(U){it=d.get(Mt),it===void 0&&(it=[],d.set(Mt,it));const wt=U.textures;if(it.length!==wt.length||it[0]!==n.COLOR_ATTACHMENT0){for(let Et=0,Kt=wt.length;Et<Kt;Et++)it[Et]=n.COLOR_ATTACHMENT0+Et;it.length=wt.length,ht=!0}}else it[0]!==n.BACK&&(it[0]=n.BACK,ht=!0);ht&&n.drawBuffers(it)}function $t(U){return g!==U?(n.useProgram(U),g=U,!0):!1}const Tt={[aa]:n.FUNC_ADD,[$g]:n.FUNC_SUBTRACT,[Zg]:n.FUNC_REVERSE_SUBTRACT};Tt[qg]=n.MIN,Tt[jg]=n.MAX;const kt={[Kg]:n.ZERO,[Jg]:n.ONE,[Qg]:n.SRC_COLOR,[Uc]:n.SRC_ALPHA,[sx]:n.SRC_ALPHA_SATURATE,[ix]:n.DST_COLOR,[ex]:n.DST_ALPHA,[tx]:n.ONE_MINUS_SRC_COLOR,[Nc]:n.ONE_MINUS_SRC_ALPHA,[ax]:n.ONE_MINUS_DST_COLOR,[nx]:n.ONE_MINUS_DST_ALPHA,[ox]:n.CONSTANT_COLOR,[rx]:n.ONE_MINUS_CONSTANT_COLOR,[cx]:n.CONSTANT_ALPHA,[lx]:n.ONE_MINUS_CONSTANT_ALPHA};function N(U,Mt,it,ht,wt,Et,Kt,ie,pe,ne){if(U===Ni){y===!0&&(yt(n.BLEND),y=!1);return}if(y===!1&&(J(n.BLEND),y=!0),U!==Yg){if(U!==m||ne!==M){if((p!==aa||x!==aa)&&(n.blendEquation(n.FUNC_ADD),p=aa,x=aa),ne)switch(U){case Za:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.ONE,n.ONE);break;case ld:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case hd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Za:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ld:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case hd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}v=null,_=null,R=null,S=null,w.set(0,0,0),E=0,m=U,M=ne}return}wt=wt||Mt,Et=Et||it,Kt=Kt||ht,(Mt!==p||wt!==x)&&(n.blendEquationSeparate(Tt[Mt],Tt[wt]),p=Mt,x=wt),(it!==v||ht!==_||Et!==R||Kt!==S)&&(n.blendFuncSeparate(kt[it],kt[ht],kt[Et],kt[Kt]),v=it,_=ht,R=Et,S=Kt),(ie.equals(w)===!1||pe!==E)&&(n.blendColor(ie.r,ie.g,ie.b,pe),w.copy(ie),E=pe),m=U,M=!1}function fe(U,Mt){U.side===Ve?yt(n.CULL_FACE):J(n.CULL_FACE);let it=U.side===Pn;Mt&&(it=!it),vt(it),U.blending===Za&&U.transparent===!1?N(Ni):N(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ht=U.stencilWrite;r.setTest(ht),ht&&(r.setMask(U.stencilWriteMask),r.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),r.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Lt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):yt(n.SAMPLE_ALPHA_TO_COVERAGE)}function vt(U){b!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),b=U)}function Ht(U){U!==Xg?(J(n.CULL_FACE),U!==P&&(U===cd?n.cullFace(n.BACK):U===Wg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):yt(n.CULL_FACE),P=U}function Ut(U){U!==z&&(D&&n.lineWidth(U),z=U)}function Lt(U,Mt,it){U?(J(n.POLYGON_OFFSET_FILL),(I!==Mt||B!==it)&&(n.polygonOffset(Mt,it),I=Mt,B=it)):yt(n.POLYGON_OFFSET_FILL)}function Ct(U){U?J(n.SCISSOR_TEST):yt(n.SCISSOR_TEST)}function C(U){U===void 0&&(U=n.TEXTURE0+L-1),F!==U&&(n.activeTexture(U),F=U)}function T(U,Mt,it){it===void 0&&(F===null?it=n.TEXTURE0+L-1:it=F);let ht=X[it];ht===void 0&&(ht={type:void 0,texture:void 0},X[it]=ht),(ht.type!==U||ht.texture!==Mt)&&(F!==it&&(n.activeTexture(it),F=it),n.bindTexture(U,Mt||gt[U]),ht.type=U,ht.texture=Mt)}function Z(){const U=X[F];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function dt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ut(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function It(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function xt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ft(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function H(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(U){ot.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),ot.copy(U))}function pt(U){Q.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),Q.copy(U))}function Gt(U,Mt){let it=c.get(Mt);it===void 0&&(it=new WeakMap,c.set(Mt,it));let ht=it.get(U);ht===void 0&&(ht=n.getUniformBlockIndex(Mt,U.name),it.set(U,ht))}function Vt(U,Mt){const ht=c.get(Mt).get(U);l.get(Mt)!==ht&&(n.uniformBlockBinding(Mt,ht,U.__bindingPointIndex),l.set(Mt,ht))}function Zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},F=null,X={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,v=null,_=null,x=null,R=null,S=null,w=new ee(0,0,0),E=0,M=!1,b=null,P=null,z=null,I=null,B=null,ot.set(0,0,n.canvas.width,n.canvas.height),Q.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:J,disable:yt,bindFramebuffer:Dt,drawBuffers:zt,useProgram:$t,setBlending:N,setMaterial:fe,setFlipSided:vt,setCullFace:Ht,setLineWidth:Ut,setPolygonOffset:Lt,setScissorTest:Ct,activeTexture:C,bindTexture:T,unbindTexture:Z,compressedTexImage2D:dt,compressedTexImage3D:ut,texImage2D:St,texImage3D:H,updateUBOMapping:Gt,uniformBlockBinding:Vt,texStorage2D:Ft,texStorage3D:st,texSubImage2D:rt,texSubImage3D:It,compressedTexSubImage2D:K,compressedTexSubImage3D:xt,scissor:lt,viewport:pt,reset:Zt}}function ou(n,t,e,i){const a=Yb(i);switch(e){case ff:return n*t;case mf:return n*t;case gf:return n*t*2;case xf:return n*t/a.components*a.byteLength;case Yl:return n*t/a.components*a.byteLength;case vf:return n*t*2/a.components*a.byteLength;case $l:return n*t*2/a.components*a.byteLength;case pf:return n*t*3/a.components*a.byteLength;case Kn:return n*t*4/a.components*a.byteLength;case Zl:return n*t*4/a.components*a.byteLength;case Oo:case Bo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ho:case Go:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Kc:case Qc:return Math.max(n,16)*Math.max(t,8)/4;case jc:case Jc:return Math.max(n,8)*Math.max(t,8)/2;case tl:case el:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case nl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case il:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case al:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case sl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case ol:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case rl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case cl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case ll:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case hl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case dl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case ul:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case fl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case pl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case ml:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case gl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Vo:case xl:case vl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case _f:case _l:return Math.ceil(n/4)*Math.ceil(t/4)*8;case yl:case Ml:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Yb(n){switch(n){case Si:case hf:return{byteLength:1,components:1};case Fs:case df:case Vs:return{byteLength:2,components:1};case Xl:case Wl:return{byteLength:2,components:4};case ha:case Vl:case yi:return{byteLength:4,components:1};case uf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function $b(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,T){return u?new OffscreenCanvas(C,T):ir("canvas")}function y(C,T,Z){let dt=1;const ut=Ct(C);if((ut.width>Z||ut.height>Z)&&(dt=Z/Math.max(ut.width,ut.height)),dt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const rt=Math.floor(dt*ut.width),It=Math.floor(dt*ut.height);f===void 0&&(f=g(rt,It));const K=T?g(rt,It):f;return K.width=rt,K.height=It,K.getContext("2d").drawImage(C,0,0,rt,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ut.width+"x"+ut.height+") to ("+rt+"x"+It+")."),K}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ut.width+"x"+ut.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(C,T,Z,dt,ut=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let rt=T;if(T===n.RED&&(Z===n.FLOAT&&(rt=n.R32F),Z===n.HALF_FLOAT&&(rt=n.R16F),Z===n.UNSIGNED_BYTE&&(rt=n.R8)),T===n.RED_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.R8UI),Z===n.UNSIGNED_SHORT&&(rt=n.R16UI),Z===n.UNSIGNED_INT&&(rt=n.R32UI),Z===n.BYTE&&(rt=n.R8I),Z===n.SHORT&&(rt=n.R16I),Z===n.INT&&(rt=n.R32I)),T===n.RG&&(Z===n.FLOAT&&(rt=n.RG32F),Z===n.HALF_FLOAT&&(rt=n.RG16F),Z===n.UNSIGNED_BYTE&&(rt=n.RG8)),T===n.RG_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RG8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RG16UI),Z===n.UNSIGNED_INT&&(rt=n.RG32UI),Z===n.BYTE&&(rt=n.RG8I),Z===n.SHORT&&(rt=n.RG16I),Z===n.INT&&(rt=n.RG32I)),T===n.RGB_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),Z===n.UNSIGNED_INT&&(rt=n.RGB32UI),Z===n.BYTE&&(rt=n.RGB8I),Z===n.SHORT&&(rt=n.RGB16I),Z===n.INT&&(rt=n.RGB32I)),T===n.RGBA_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),Z===n.UNSIGNED_INT&&(rt=n.RGBA32UI),Z===n.BYTE&&(rt=n.RGBA8I),Z===n.SHORT&&(rt=n.RGBA16I),Z===n.INT&&(rt=n.RGBA32I)),T===n.RGB&&Z===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),T===n.RGBA){const It=ut?fr:ye.getTransfer(dt);Z===n.FLOAT&&(rt=n.RGBA32F),Z===n.HALF_FLOAT&&(rt=n.RGBA16F),Z===n.UNSIGNED_BYTE&&(rt=It===ke?n.SRGB8_ALPHA8:n.RGBA8),Z===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),Z===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function x(C,T){let Z;return C?T===null||T===ha||T===is?Z=n.DEPTH24_STENCIL8:T===yi?Z=n.DEPTH32F_STENCIL8:T===Fs&&(Z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ha||T===is?Z=n.DEPTH_COMPONENT24:T===yi?Z=n.DEPTH_COMPONENT32F:T===Fs&&(Z=n.DEPTH_COMPONENT16),Z}function R(C,T){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Jn&&C.minFilter!==oi?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function S(C){const T=C.target;T.removeEventListener("dispose",S),E(T),T.isVideoTexture&&h.delete(T)}function w(C){const T=C.target;T.removeEventListener("dispose",w),b(T)}function E(C){const T=i.get(C);if(T.__webglInit===void 0)return;const Z=C.source,dt=d.get(Z);if(dt){const ut=dt[T.__cacheKey];ut.usedTimes--,ut.usedTimes===0&&M(C),Object.keys(dt).length===0&&d.delete(Z)}i.remove(C)}function M(C){const T=i.get(C);n.deleteTexture(T.__webglTexture);const Z=C.source,dt=d.get(Z);delete dt[T.__cacheKey],o.memory.textures--}function b(C){const T=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let dt=0;dt<6;dt++){if(Array.isArray(T.__webglFramebuffer[dt]))for(let ut=0;ut<T.__webglFramebuffer[dt].length;ut++)n.deleteFramebuffer(T.__webglFramebuffer[dt][ut]);else n.deleteFramebuffer(T.__webglFramebuffer[dt]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[dt])}else{if(Array.isArray(T.__webglFramebuffer))for(let dt=0;dt<T.__webglFramebuffer.length;dt++)n.deleteFramebuffer(T.__webglFramebuffer[dt]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let dt=0;dt<T.__webglColorRenderbuffer.length;dt++)T.__webglColorRenderbuffer[dt]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[dt]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=C.textures;for(let dt=0,ut=Z.length;dt<ut;dt++){const rt=i.get(Z[dt]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove(Z[dt])}i.remove(C)}let P=0;function z(){P=0}function I(){const C=P;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),P+=1,C}function B(C){const T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function L(C,T){const Z=i.get(C);if(C.isVideoTexture&&Ut(C),C.isRenderTargetTexture===!1&&C.version>0&&Z.__version!==C.version){const dt=C.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(Z,C,T);return}}e.bindTexture(n.TEXTURE_2D,Z.__webglTexture,n.TEXTURE0+T)}function D(C,T){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){Q(Z,C,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Z.__webglTexture,n.TEXTURE0+T)}function V(C,T){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){Q(Z,C,T);return}e.bindTexture(n.TEXTURE_3D,Z.__webglTexture,n.TEXTURE0+T)}function O(C,T){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){q(Z,C,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture,n.TEXTURE0+T)}const F={[Zc]:n.REPEAT,[oa]:n.CLAMP_TO_EDGE,[qc]:n.MIRRORED_REPEAT},X={[Jn]:n.NEAREST,[_x]:n.NEAREST_MIPMAP_NEAREST,[io]:n.NEAREST_MIPMAP_LINEAR,[oi]:n.LINEAR,[Hr]:n.LINEAR_MIPMAP_NEAREST,[ra]:n.LINEAR_MIPMAP_LINEAR},nt={[Sx]:n.NEVER,[Px]:n.ALWAYS,[wx]:n.LESS,[Mf]:n.LEQUAL,[Ex]:n.EQUAL,[Rx]:n.GEQUAL,[Tx]:n.GREATER,[Ax]:n.NOTEQUAL};function at(C,T){if(T.type===yi&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===oi||T.magFilter===Hr||T.magFilter===io||T.magFilter===ra||T.minFilter===oi||T.minFilter===Hr||T.minFilter===io||T.minFilter===ra)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,F[T.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,F[T.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,F[T.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,X[T.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,X[T.minFilter]),T.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,nt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Jn||T.minFilter!==io&&T.minFilter!==ra||T.type===yi&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function ot(C,T){let Z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",S));const dt=T.source;let ut=d.get(dt);ut===void 0&&(ut={},d.set(dt,ut));const rt=B(T);if(rt!==C.__cacheKey){ut[rt]===void 0&&(ut[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),ut[rt].usedTimes++;const It=ut[C.__cacheKey];It!==void 0&&(ut[C.__cacheKey].usedTimes--,It.usedTimes===0&&M(T)),C.__cacheKey=rt,C.__webglTexture=ut[rt].texture}return Z}function Q(C,T,Z){let dt=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(dt=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(dt=n.TEXTURE_3D);const ut=ot(C,T),rt=T.source;e.bindTexture(dt,C.__webglTexture,n.TEXTURE0+Z);const It=i.get(rt);if(rt.version!==It.__version||ut===!0){e.activeTexture(n.TEXTURE0+Z);const K=ye.getPrimaries(ye.workingColorSpace),xt=T.colorSpace===Ii?null:ye.getPrimaries(T.colorSpace),Ft=T.colorSpace===Ii||K===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let st=y(T.image,!1,a.maxTextureSize);st=Lt(T,st);const St=s.convert(T.format,T.colorSpace),H=s.convert(T.type);let lt=_(T.internalFormat,St,H,T.colorSpace,T.isVideoTexture);at(dt,T);let pt;const Gt=T.mipmaps,Vt=T.isVideoTexture!==!0,Zt=It.__version===void 0||ut===!0,U=rt.dataReady,Mt=R(T,st);if(T.isDepthTexture)lt=x(T.format===as,T.type),Zt&&(Vt?e.texStorage2D(n.TEXTURE_2D,1,lt,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,lt,st.width,st.height,0,St,H,null));else if(T.isDataTexture)if(Gt.length>0){Vt&&Zt&&e.texStorage2D(n.TEXTURE_2D,Mt,lt,Gt[0].width,Gt[0].height);for(let it=0,ht=Gt.length;it<ht;it++)pt=Gt[it],Vt?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,pt.width,pt.height,St,H,pt.data):e.texImage2D(n.TEXTURE_2D,it,lt,pt.width,pt.height,0,St,H,pt.data);T.generateMipmaps=!1}else Vt?(Zt&&e.texStorage2D(n.TEXTURE_2D,Mt,lt,st.width,st.height),U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,st.width,st.height,St,H,st.data)):e.texImage2D(n.TEXTURE_2D,0,lt,st.width,st.height,0,St,H,st.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Vt&&Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Mt,lt,Gt[0].width,Gt[0].height,st.depth);for(let it=0,ht=Gt.length;it<ht;it++)if(pt=Gt[it],T.format!==Kn)if(St!==null)if(Vt){if(U)if(T.layerUpdates.size>0){const wt=ou(pt.width,pt.height,T.format,T.type);for(const Et of T.layerUpdates){const Kt=pt.data.subarray(Et*wt/pt.data.BYTES_PER_ELEMENT,(Et+1)*wt/pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,Et,pt.width,pt.height,1,St,Kt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,pt.width,pt.height,st.depth,St,pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,it,lt,pt.width,pt.height,st.depth,0,pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?U&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,pt.width,pt.height,st.depth,St,H,pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,it,lt,pt.width,pt.height,st.depth,0,St,H,pt.data)}else{Vt&&Zt&&e.texStorage2D(n.TEXTURE_2D,Mt,lt,Gt[0].width,Gt[0].height);for(let it=0,ht=Gt.length;it<ht;it++)pt=Gt[it],T.format!==Kn?St!==null?Vt?U&&e.compressedTexSubImage2D(n.TEXTURE_2D,it,0,0,pt.width,pt.height,St,pt.data):e.compressedTexImage2D(n.TEXTURE_2D,it,lt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,pt.width,pt.height,St,H,pt.data):e.texImage2D(n.TEXTURE_2D,it,lt,pt.width,pt.height,0,St,H,pt.data)}else if(T.isDataArrayTexture)if(Vt){if(Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Mt,lt,st.width,st.height,st.depth),U)if(T.layerUpdates.size>0){const it=ou(st.width,st.height,T.format,T.type);for(const ht of T.layerUpdates){const wt=st.data.subarray(ht*it/st.data.BYTES_PER_ELEMENT,(ht+1)*it/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ht,st.width,st.height,1,St,H,wt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,St,H,st.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,lt,st.width,st.height,st.depth,0,St,H,st.data);else if(T.isData3DTexture)Vt?(Zt&&e.texStorage3D(n.TEXTURE_3D,Mt,lt,st.width,st.height,st.depth),U&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,St,H,st.data)):e.texImage3D(n.TEXTURE_3D,0,lt,st.width,st.height,st.depth,0,St,H,st.data);else if(T.isFramebufferTexture){if(Zt)if(Vt)e.texStorage2D(n.TEXTURE_2D,Mt,lt,st.width,st.height);else{let it=st.width,ht=st.height;for(let wt=0;wt<Mt;wt++)e.texImage2D(n.TEXTURE_2D,wt,lt,it,ht,0,St,H,null),it>>=1,ht>>=1}}else if(Gt.length>0){if(Vt&&Zt){const it=Ct(Gt[0]);e.texStorage2D(n.TEXTURE_2D,Mt,lt,it.width,it.height)}for(let it=0,ht=Gt.length;it<ht;it++)pt=Gt[it],Vt?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,St,H,pt):e.texImage2D(n.TEXTURE_2D,it,lt,St,H,pt);T.generateMipmaps=!1}else if(Vt){if(Zt){const it=Ct(st);e.texStorage2D(n.TEXTURE_2D,Mt,lt,it.width,it.height)}U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,St,H,st)}else e.texImage2D(n.TEXTURE_2D,0,lt,St,H,st);m(T)&&p(dt),It.__version=rt.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function q(C,T,Z){if(T.image.length!==6)return;const dt=ot(C,T),ut=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+Z);const rt=i.get(ut);if(ut.version!==rt.__version||dt===!0){e.activeTexture(n.TEXTURE0+Z);const It=ye.getPrimaries(ye.workingColorSpace),K=T.colorSpace===Ii?null:ye.getPrimaries(T.colorSpace),xt=T.colorSpace===Ii||It===K?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const Ft=T.isCompressedTexture||T.image[0].isCompressedTexture,st=T.image[0]&&T.image[0].isDataTexture,St=[];for(let ht=0;ht<6;ht++)!Ft&&!st?St[ht]=y(T.image[ht],!0,a.maxCubemapSize):St[ht]=st?T.image[ht].image:T.image[ht],St[ht]=Lt(T,St[ht]);const H=St[0],lt=s.convert(T.format,T.colorSpace),pt=s.convert(T.type),Gt=_(T.internalFormat,lt,pt,T.colorSpace),Vt=T.isVideoTexture!==!0,Zt=rt.__version===void 0||dt===!0,U=ut.dataReady;let Mt=R(T,H);at(n.TEXTURE_CUBE_MAP,T);let it;if(Ft){Vt&&Zt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Mt,Gt,H.width,H.height);for(let ht=0;ht<6;ht++){it=St[ht].mipmaps;for(let wt=0;wt<it.length;wt++){const Et=it[wt];T.format!==Kn?lt!==null?Vt?U&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt,0,0,Et.width,Et.height,lt,Et.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt,Gt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt,0,0,Et.width,Et.height,lt,pt,Et.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt,Gt,Et.width,Et.height,0,lt,pt,Et.data)}}}else{if(it=T.mipmaps,Vt&&Zt){it.length>0&&Mt++;const ht=Ct(St[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Mt,Gt,ht.width,ht.height)}for(let ht=0;ht<6;ht++)if(st){Vt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,St[ht].width,St[ht].height,lt,pt,St[ht].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Gt,St[ht].width,St[ht].height,0,lt,pt,St[ht].data);for(let wt=0;wt<it.length;wt++){const Kt=it[wt].image[ht].image;Vt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt+1,0,0,Kt.width,Kt.height,lt,pt,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt+1,Gt,Kt.width,Kt.height,0,lt,pt,Kt.data)}}else{Vt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,lt,pt,St[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Gt,lt,pt,St[ht]);for(let wt=0;wt<it.length;wt++){const Et=it[wt];Vt?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt+1,0,0,lt,pt,Et.image[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,wt+1,Gt,lt,pt,Et.image[ht])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),rt.__version=ut.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function gt(C,T,Z,dt,ut,rt){const It=s.convert(Z.format,Z.colorSpace),K=s.convert(Z.type),xt=_(Z.internalFormat,It,K,Z.colorSpace),Ft=i.get(T),st=i.get(Z);if(st.__renderTarget=T,!Ft.__hasExternalTextures){const St=Math.max(1,T.width>>rt),H=Math.max(1,T.height>>rt);ut===n.TEXTURE_3D||ut===n.TEXTURE_2D_ARRAY?e.texImage3D(ut,rt,xt,St,H,T.depth,0,It,K,null):e.texImage2D(ut,rt,xt,St,H,0,It,K,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,ut,st.__webglTexture,0,vt(T)):(ut===n.TEXTURE_2D||ut>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ut<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,dt,ut,st.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(C,T,Z){if(n.bindRenderbuffer(n.RENDERBUFFER,C),T.depthBuffer){const dt=T.depthTexture,ut=dt&&dt.isDepthTexture?dt.type:null,rt=x(T.stencilBuffer,ut),It=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=vt(T);Ht(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,K,rt,T.width,T.height):Z?n.renderbufferStorageMultisample(n.RENDERBUFFER,K,rt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,rt,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,It,n.RENDERBUFFER,C)}else{const dt=T.textures;for(let ut=0;ut<dt.length;ut++){const rt=dt[ut],It=s.convert(rt.format,rt.colorSpace),K=s.convert(rt.type),xt=_(rt.internalFormat,It,K,rt.colorSpace),Ft=vt(T);Z&&Ht(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,xt,T.width,T.height):Ht(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ft,xt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,xt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function yt(C,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const dt=i.get(T.depthTexture);dt.__renderTarget=T,(!dt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const ut=dt.__webglTexture,rt=vt(T);if(T.depthTexture.format===qa)Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0);else if(T.depthTexture.format===as)Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function Dt(C){const T=i.get(C),Z=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){const dt=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),dt){const ut=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,dt.removeEventListener("dispose",ut)};dt.addEventListener("dispose",ut),T.__depthDisposeCallback=ut}T.__boundDepthTexture=dt}if(C.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");yt(T.__webglFramebuffer,C)}else if(Z){T.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[dt]),T.__webglDepthbuffer[dt]===void 0)T.__webglDepthbuffer[dt]=n.createRenderbuffer(),J(T.__webglDepthbuffer[dt],C,!1);else{const ut=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=T.__webglDepthbuffer[dt];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),J(T.__webglDepthbuffer,C,!1);else{const dt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ut=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ut),n.framebufferRenderbuffer(n.FRAMEBUFFER,dt,n.RENDERBUFFER,ut)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function zt(C,T,Z){const dt=i.get(C);T!==void 0&&gt(dt.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Z!==void 0&&Dt(C)}function $t(C){const T=C.texture,Z=i.get(C),dt=i.get(T);C.addEventListener("dispose",w);const ut=C.textures,rt=C.isWebGLCubeRenderTarget===!0,It=ut.length>1;if(It||(dt.__webglTexture===void 0&&(dt.__webglTexture=n.createTexture()),dt.__version=T.version,o.memory.textures++),rt){Z.__webglFramebuffer=[];for(let K=0;K<6;K++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[K]=[];for(let xt=0;xt<T.mipmaps.length;xt++)Z.__webglFramebuffer[K][xt]=n.createFramebuffer()}else Z.__webglFramebuffer[K]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let K=0;K<T.mipmaps.length;K++)Z.__webglFramebuffer[K]=n.createFramebuffer()}else Z.__webglFramebuffer=n.createFramebuffer();if(It)for(let K=0,xt=ut.length;K<xt;K++){const Ft=i.get(ut[K]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Ht(C)===!1){Z.__webglMultisampledFramebuffer=n.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let K=0;K<ut.length;K++){const xt=ut[K];Z.__webglColorRenderbuffer[K]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Z.__webglColorRenderbuffer[K]);const Ft=s.convert(xt.format,xt.colorSpace),st=s.convert(xt.type),St=_(xt.internalFormat,Ft,st,xt.colorSpace,C.isXRRenderTarget===!0),H=vt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,H,St,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+K,n.RENDERBUFFER,Z.__webglColorRenderbuffer[K])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(Z.__webglDepthRenderbuffer=n.createRenderbuffer(),J(Z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,dt.__webglTexture),at(n.TEXTURE_CUBE_MAP,T);for(let K=0;K<6;K++)if(T.mipmaps&&T.mipmaps.length>0)for(let xt=0;xt<T.mipmaps.length;xt++)gt(Z.__webglFramebuffer[K][xt],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt);else gt(Z.__webglFramebuffer[K],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let K=0,xt=ut.length;K<xt;K++){const Ft=ut[K],st=i.get(Ft);e.bindTexture(n.TEXTURE_2D,st.__webglTexture),at(n.TEXTURE_2D,Ft),gt(Z.__webglFramebuffer,C,Ft,n.COLOR_ATTACHMENT0+K,n.TEXTURE_2D,0),m(Ft)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let K=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(K,dt.__webglTexture),at(K,T),T.mipmaps&&T.mipmaps.length>0)for(let xt=0;xt<T.mipmaps.length;xt++)gt(Z.__webglFramebuffer[xt],C,T,n.COLOR_ATTACHMENT0,K,xt);else gt(Z.__webglFramebuffer,C,T,n.COLOR_ATTACHMENT0,K,0);m(T)&&p(K),e.unbindTexture()}C.depthBuffer&&Dt(C)}function Tt(C){const T=C.textures;for(let Z=0,dt=T.length;Z<dt;Z++){const ut=T[Z];if(m(ut)){const rt=v(C),It=i.get(ut).__webglTexture;e.bindTexture(rt,It),p(rt),e.unbindTexture()}}}const kt=[],N=[];function fe(C){if(C.samples>0){if(Ht(C)===!1){const T=C.textures,Z=C.width,dt=C.height;let ut=n.COLOR_BUFFER_BIT;const rt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,It=i.get(C),K=T.length>1;if(K)for(let xt=0;xt<T.length;xt++)e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let xt=0;xt<T.length;xt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ut|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ut|=n.STENCIL_BUFFER_BIT)),K){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,It.__webglColorRenderbuffer[xt]);const Ft=i.get(T[xt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ft,0)}n.blitFramebuffer(0,0,Z,dt,0,0,Z,dt,ut,n.NEAREST),l===!0&&(kt.length=0,N.length=0,kt.push(n.COLOR_ATTACHMENT0+xt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(kt.push(rt),N.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,N)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,kt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),K)for(let xt=0;xt<T.length;xt++){e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,It.__webglColorRenderbuffer[xt]);const Ft=i.get(T[xt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,Ft,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const T=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function vt(C){return Math.min(a.maxSamples,C.samples)}function Ht(C){const T=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ut(C){const T=o.render.frame;h.get(C)!==T&&(h.set(C,T),C.update())}function Lt(C,T){const Z=C.colorSpace,dt=C.format,ut=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||Z!==os&&Z!==Ii&&(ye.getTransfer(Z)===ke?(dt!==Kn||ut!==Si)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function Ct(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=L,this.setTexture2DArray=D,this.setTexture3D=V,this.setTextureCube=O,this.rebindTextures=zt,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=fe,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=Ht}function Zb(n,t){function e(i,a=Ii){let s;const o=ye.getTransfer(a);if(i===Si)return n.UNSIGNED_BYTE;if(i===Xl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Wl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===uf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===hf)return n.BYTE;if(i===df)return n.SHORT;if(i===Fs)return n.UNSIGNED_SHORT;if(i===Vl)return n.INT;if(i===ha)return n.UNSIGNED_INT;if(i===yi)return n.FLOAT;if(i===Vs)return n.HALF_FLOAT;if(i===ff)return n.ALPHA;if(i===pf)return n.RGB;if(i===Kn)return n.RGBA;if(i===mf)return n.LUMINANCE;if(i===gf)return n.LUMINANCE_ALPHA;if(i===qa)return n.DEPTH_COMPONENT;if(i===as)return n.DEPTH_STENCIL;if(i===xf)return n.RED;if(i===Yl)return n.RED_INTEGER;if(i===vf)return n.RG;if(i===$l)return n.RG_INTEGER;if(i===Zl)return n.RGBA_INTEGER;if(i===Oo||i===Bo||i===Ho||i===Go)if(o===ke)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Oo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Bo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ho)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Oo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Bo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ho)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Go)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===jc||i===Kc||i===Jc||i===Qc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===jc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Kc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Jc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Qc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===tl||i===el||i===nl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===tl||i===el)return o===ke?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===nl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===il||i===al||i===sl||i===ol||i===rl||i===cl||i===ll||i===hl||i===dl||i===ul||i===fl||i===pl||i===ml||i===gl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===il)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===al)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===sl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ol)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===rl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===cl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ll)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===hl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===dl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ul)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===fl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===pl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ml)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===gl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vo||i===xl||i===vl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Vo)return o===ke?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===xl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===vl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===_f||i===_l||i===yl||i===Ml)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Vo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===_l)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ml)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===is?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class qb extends Hn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ie extends We{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jb={type:"move"};class pc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,i),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&d>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(jb)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ie;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Kb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jb=`
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

}`;class Qb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new En,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Hi({vertexShader:Kb,fragmentShader:Jb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new me(new Bn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class t1 extends rs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,g=null;const y=new Qb,m=e.getContextAttributes();let p=null,v=null;const _=[],x=[],R=new Wt;let S=null;const w=new Hn;w.viewport=new je;const E=new Hn;E.viewport=new je;const M=[w,E],b=new qb;let P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let q=_[Q];return q===void 0&&(q=new pc,_[Q]=q),q.getTargetRaySpace()},this.getControllerGrip=function(Q){let q=_[Q];return q===void 0&&(q=new pc,_[Q]=q),q.getGripSpace()},this.getHand=function(Q){let q=_[Q];return q===void 0&&(q=new pc,_[Q]=q),q.getHandSpace()};function I(Q){const q=x.indexOf(Q.inputSource);if(q===-1)return;const gt=_[q];gt!==void 0&&(gt.update(Q.inputSource,Q.frame,c||o),gt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function B(){a.removeEventListener("select",I),a.removeEventListener("selectstart",I),a.removeEventListener("selectend",I),a.removeEventListener("squeeze",I),a.removeEventListener("squeezestart",I),a.removeEventListener("squeezeend",I),a.removeEventListener("end",B),a.removeEventListener("inputsourceschange",L);for(let Q=0;Q<_.length;Q++){const q=x[Q];q!==null&&(x[Q]=null,_[Q].disconnect(q))}P=null,z=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,v=null,ot.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){r=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(Q){if(a=Q,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",I),a.addEventListener("selectstart",I),a.addEventListener("selectend",I),a.addEventListener("squeeze",I),a.addEventListener("squeezestart",I),a.addEventListener("squeezeend",I),a.addEventListener("end",B),a.addEventListener("inputsourceschange",L),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(R),a.renderState.layers===void 0){const q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,q),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new da(u.framebufferWidth,u.framebufferHeight,{format:Kn,type:Si,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let q=null,gt=null,J=null;m.depth&&(J=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,q=m.stencil?as:qa,gt=m.stencil?is:ha);const yt={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(yt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new da(d.textureWidth,d.textureHeight,{format:Kn,type:Si,depthTexture:new kf(d.textureWidth,d.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),ot.setContext(a),ot.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function L(Q){for(let q=0;q<Q.removed.length;q++){const gt=Q.removed[q],J=x.indexOf(gt);J>=0&&(x[J]=null,_[J].disconnect(gt))}for(let q=0;q<Q.added.length;q++){const gt=Q.added[q];let J=x.indexOf(gt);if(J===-1){for(let Dt=0;Dt<_.length;Dt++)if(Dt>=x.length){x.push(gt),J=Dt;break}else if(x[Dt]===null){x[Dt]=gt,J=Dt;break}if(J===-1)break}const yt=_[J];yt&&yt.connect(gt)}}const D=new G,V=new G;function O(Q,q,gt){D.setFromMatrixPosition(q.matrixWorld),V.setFromMatrixPosition(gt.matrixWorld);const J=D.distanceTo(V),yt=q.projectionMatrix.elements,Dt=gt.projectionMatrix.elements,zt=yt[14]/(yt[10]-1),$t=yt[14]/(yt[10]+1),Tt=(yt[9]+1)/yt[5],kt=(yt[9]-1)/yt[5],N=(yt[8]-1)/yt[0],fe=(Dt[8]+1)/Dt[0],vt=zt*N,Ht=zt*fe,Ut=J/(-N+fe),Lt=Ut*-N;if(q.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Lt),Q.translateZ(Ut),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),yt[10]===-1)Q.projectionMatrix.copy(q.projectionMatrix),Q.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const Ct=zt+Ut,C=$t+Ut,T=vt-Lt,Z=Ht+(J-Lt),dt=Tt*$t/C*Ct,ut=kt*$t/C*Ct;Q.projectionMatrix.makePerspective(T,Z,dt,ut,Ct,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function F(Q,q){q===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(q.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(a===null)return;let q=Q.near,gt=Q.far;y.texture!==null&&(y.depthNear>0&&(q=y.depthNear),y.depthFar>0&&(gt=y.depthFar)),b.near=E.near=w.near=q,b.far=E.far=w.far=gt,(P!==b.near||z!==b.far)&&(a.updateRenderState({depthNear:b.near,depthFar:b.far}),P=b.near,z=b.far),w.layers.mask=Q.layers.mask|2,E.layers.mask=Q.layers.mask|4,b.layers.mask=w.layers.mask|E.layers.mask;const J=Q.parent,yt=b.cameras;F(b,J);for(let Dt=0;Dt<yt.length;Dt++)F(yt[Dt],J);yt.length===2?O(b,w,E):b.projectionMatrix.copy(w.projectionMatrix),X(Q,b,J)};function X(Q,q,gt){gt===null?Q.matrix.copy(q.matrixWorld):(Q.matrix.copy(gt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(q.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(q.projectionMatrix),Q.projectionMatrixInverse.copy(q.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=zs*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(b)};let nt=null;function at(Q,q){if(h=q.getViewerPose(c||o),g=q,h!==null){const gt=h.views;u!==null&&(t.setRenderTargetFramebuffer(v,u.framebuffer),t.setRenderTarget(v));let J=!1;gt.length!==b.cameras.length&&(b.cameras.length=0,J=!0);for(let Dt=0;Dt<gt.length;Dt++){const zt=gt[Dt];let $t=null;if(u!==null)$t=u.getViewport(zt);else{const kt=f.getViewSubImage(d,zt);$t=kt.viewport,Dt===0&&(t.setRenderTargetTextures(v,kt.colorTexture,d.ignoreDepthValues?void 0:kt.depthStencilTexture),t.setRenderTarget(v))}let Tt=M[Dt];Tt===void 0&&(Tt=new Hn,Tt.layers.enable(Dt),Tt.viewport=new je,M[Dt]=Tt),Tt.matrix.fromArray(zt.transform.matrix),Tt.matrix.decompose(Tt.position,Tt.quaternion,Tt.scale),Tt.projectionMatrix.fromArray(zt.projectionMatrix),Tt.projectionMatrixInverse.copy(Tt.projectionMatrix).invert(),Tt.viewport.set($t.x,$t.y,$t.width,$t.height),Dt===0&&(b.matrix.copy(Tt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),J===!0&&b.cameras.push(Tt)}const yt=a.enabledFeatures;if(yt&&yt.includes("depth-sensing")){const Dt=f.getDepthInformation(gt[0]);Dt&&Dt.isValid&&Dt.texture&&y.init(t,Dt,a.renderState)}}for(let gt=0;gt<_.length;gt++){const J=x[gt],yt=_[gt];J!==null&&yt!==void 0&&yt.update(J,q,c||o)}nt&&nt(Q,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),g=null}const ot=new Lf;ot.setAnimationLoop(at),this.setAnimationLoop=function(Q){nt=Q},this.dispose=function(){}}}const Ki=new li,e1=new Oe;function n1(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Rf(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,v,_,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),y(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,v,_):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Pn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Pn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),_=v.envMap,x=v.envMapRotation;_&&(m.envMap.value=_,Ki.copy(x),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),m.envMapRotation.value.setFromMatrix4(e1.makeRotationFromEuler(Ki)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=_*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Pn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function i1(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,_){const x=_.program;i.uniformBlockBinding(v,x)}function c(v,_){let x=a[v.id];x===void 0&&(g(v),x=h(v),a[v.id]=x,v.addEventListener("dispose",m));const R=_.program;i.updateUBOMapping(v,R);const S=t.render.frame;s[v.id]!==S&&(d(v),s[v.id]=S)}function h(v){const _=f();v.__bindingPointIndex=_;const x=n.createBuffer(),R=v.__size,S=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,R,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function f(){for(let v=0;v<r;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const _=a[v.id],x=v.uniforms,R=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let S=0,w=x.length;S<w;S++){const E=Array.isArray(x[S])?x[S]:[x[S]];for(let M=0,b=E.length;M<b;M++){const P=E[M];if(u(P,S,M,R)===!0){const z=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let B=0;for(let L=0;L<I.length;L++){const D=I[L],V=y(D);typeof D=="number"||typeof D=="boolean"?(P.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,z+B,P.__data)):D.isMatrix3?(P.__data[0]=D.elements[0],P.__data[1]=D.elements[1],P.__data[2]=D.elements[2],P.__data[3]=0,P.__data[4]=D.elements[3],P.__data[5]=D.elements[4],P.__data[6]=D.elements[5],P.__data[7]=0,P.__data[8]=D.elements[6],P.__data[9]=D.elements[7],P.__data[10]=D.elements[8],P.__data[11]=0):(D.toArray(P.__data,B),B+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(v,_,x,R){const S=v.value,w=_+"_"+x;if(R[w]===void 0)return typeof S=="number"||typeof S=="boolean"?R[w]=S:R[w]=S.clone(),!0;{const E=R[w];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return R[w]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function g(v){const _=v.uniforms;let x=0;const R=16;for(let w=0,E=_.length;w<E;w++){const M=Array.isArray(_[w])?_[w]:[_[w]];for(let b=0,P=M.length;b<P;b++){const z=M[b],I=Array.isArray(z.value)?z.value:[z.value];for(let B=0,L=I.length;B<L;B++){const D=I[B],V=y(D),O=x%R,F=O%V.boundary,X=O+F;x+=F,X!==0&&R-X<V.storage&&(x+=R-X),z.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=V.storage}}}const S=x%R;return S>0&&(x+=R-S),v.__size=x,v.__cache={},this}function y(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function m(v){const _=v.target;_.removeEventListener("dispose",m);const x=o.indexOf(_.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(a[_.id]),delete a[_.id],delete s[_.id]}function p(){for(const v in a)n.deleteBuffer(a[v]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class a1{constructor(t={}){const{canvas:e=Yx(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const v=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bn,this.toneMapping=Oi,this.toneMappingExposure=1;const x=this;let R=!1,S=0,w=0,E=null,M=-1,b=null;const P=new je,z=new je;let I=null;const B=new ee(0);let L=0,D=e.width,V=e.height,O=1,F=null,X=null;const nt=new je(0,0,D,V),at=new je(0,0,D,V);let ot=!1;const Q=new Jl;let q=!1,gt=!1;const J=new Oe,yt=new Oe,Dt=new G,zt=new je,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Tt=!1;function kt(){return E===null?O:1}let N=i;function fe(A,Y){return e.getContext(A,Y)}try{const A={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Hl}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",Et,!1),N===null){const Y="webgl2";if(N=fe(Y,A),N===null)throw fe(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let vt,Ht,Ut,Lt,Ct,C,T,Z,dt,ut,rt,It,K,xt,Ft,st,St,H,lt,pt,Gt,Vt,Zt,U;function Mt(){vt=new lM(N),vt.init(),Vt=new Zb(N,vt),Ht=new iM(N,vt,t,Vt),Ut=new Wb(N,vt),Ht.reverseDepthBuffer&&d&&Ut.buffers.depth.setReversed(!0),Lt=new uM(N),Ct=new Cb,C=new $b(N,vt,Ut,Ct,Ht,Vt,Lt),T=new sM(x),Z=new cM(x),dt=new _v(N),Zt=new eM(N,dt),ut=new hM(N,dt,Lt,Zt),rt=new pM(N,ut,dt,Lt),lt=new fM(N,Ht,C),st=new aM(Ct),It=new Pb(x,T,Z,vt,Ht,Zt,st),K=new n1(x,Ct),xt=new Db,Ft=new Nb(vt),H=new tM(x,T,Z,Ut,rt,u,l),St=new Vb(x,rt,Ht),U=new i1(N,Lt,Ht,Ut),pt=new nM(N,vt,Lt),Gt=new dM(N,vt,Lt),Lt.programs=It.programs,x.capabilities=Ht,x.extensions=vt,x.properties=Ct,x.renderLists=xt,x.shadowMap=St,x.state=Ut,x.info=Lt}Mt();const it=new t1(x,N);this.xr=it,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=vt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=vt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(A){A!==void 0&&(O=A,this.setSize(D,V,!1))},this.getSize=function(A){return A.set(D,V)},this.setSize=function(A,Y,tt=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=A,V=Y,e.width=Math.floor(A*O),e.height=Math.floor(Y*O),tt===!0&&(e.style.width=A+"px",e.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(D*O,V*O).floor()},this.setDrawingBufferSize=function(A,Y,tt){D=A,V=Y,O=tt,e.width=Math.floor(A*tt),e.height=Math.floor(Y*tt),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(P)},this.getViewport=function(A){return A.copy(nt)},this.setViewport=function(A,Y,tt,et){A.isVector4?nt.set(A.x,A.y,A.z,A.w):nt.set(A,Y,tt,et),Ut.viewport(P.copy(nt).multiplyScalar(O).round())},this.getScissor=function(A){return A.copy(at)},this.setScissor=function(A,Y,tt,et){A.isVector4?at.set(A.x,A.y,A.z,A.w):at.set(A,Y,tt,et),Ut.scissor(z.copy(at).multiplyScalar(O).round())},this.getScissorTest=function(){return ot},this.setScissorTest=function(A){Ut.setScissorTest(ot=A)},this.setOpaqueSort=function(A){F=A},this.setTransparentSort=function(A){X=A},this.getClearColor=function(A){return A.copy(H.getClearColor())},this.setClearColor=function(){H.setClearColor.apply(H,arguments)},this.getClearAlpha=function(){return H.getClearAlpha()},this.setClearAlpha=function(){H.setClearAlpha.apply(H,arguments)},this.clear=function(A=!0,Y=!0,tt=!0){let et=0;if(A){let $=!1;if(E!==null){const At=E.texture.format;$=At===Zl||At===$l||At===Yl}if($){const At=E.texture.type,Pt=At===Si||At===ha||At===Fs||At===is||At===Xl||At===Wl,Yt=H.getClearColor(),qt=H.getClearAlpha(),Ot=Yt.r,Xt=Yt.g,Bt=Yt.b;Pt?(g[0]=Ot,g[1]=Xt,g[2]=Bt,g[3]=qt,N.clearBufferuiv(N.COLOR,0,g)):(y[0]=Ot,y[1]=Xt,y[2]=Bt,y[3]=qt,N.clearBufferiv(N.COLOR,0,y))}else et|=N.COLOR_BUFFER_BIT}Y&&(et|=N.DEPTH_BUFFER_BIT),tt&&(et|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",Et,!1),xt.dispose(),Ft.dispose(),Ct.dispose(),T.dispose(),Z.dispose(),rt.dispose(),Zt.dispose(),U.dispose(),It.dispose(),it.dispose(),it.removeEventListener("sessionstart",fn),it.removeEventListener("sessionend",ze),Te.stop()};function ht(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const A=Lt.autoReset,Y=St.enabled,tt=St.autoUpdate,et=St.needsUpdate,$=St.type;Mt(),Lt.autoReset=A,St.enabled=Y,St.autoUpdate=tt,St.needsUpdate=et,St.type=$}function Et(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Kt(A){const Y=A.target;Y.removeEventListener("dispose",Kt),ie(Y)}function ie(A){pe(A),Ct.remove(A)}function pe(A){const Y=Ct.get(A).programs;Y!==void 0&&(Y.forEach(function(tt){It.releaseProgram(tt)}),A.isShaderMaterial&&It.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,tt,et,$,At){Y===null&&(Y=$t);const Pt=$.isMesh&&$.matrixWorld.determinant()<0,Yt=jt(A,Y,tt,et,$);Ut.setMaterial(et,Pt);let qt=tt.index,Ot=1;if(et.wireframe===!0){if(qt=ut.getWireframeAttribute(tt),qt===void 0)return;Ot=2}const Xt=tt.drawRange,Bt=tt.attributes.position;let re=Xt.start*Ot,xe=(Xt.start+Xt.count)*Ot;At!==null&&(re=Math.max(re,At.start*Ot),xe=Math.min(xe,(At.start+At.count)*Ot)),qt!==null?(re=Math.max(re,0),xe=Math.min(xe,qt.count)):Bt!=null&&(re=Math.max(re,0),xe=Math.min(xe,Bt.count));const he=xe-re;if(he<0||he===1/0)return;Zt.setup($,et,Yt,tt,qt);let Re,ft=pt;if(qt!==null&&(Re=dt.get(qt),ft=Gt,ft.setIndex(Re)),$.isMesh)et.wireframe===!0?(Ut.setLineWidth(et.wireframeLinewidth*kt()),ft.setMode(N.LINES)):ft.setMode(N.TRIANGLES);else if($.isLine){let ct=et.linewidth;ct===void 0&&(ct=1),Ut.setLineWidth(ct*kt()),$.isLineSegments?ft.setMode(N.LINES):$.isLineLoop?ft.setMode(N.LINE_LOOP):ft.setMode(N.LINE_STRIP)}else $.isPoints?ft.setMode(N.POINTS):$.isSprite&&ft.setMode(N.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)ft.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(vt.get("WEBGL_multi_draw"))ft.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const ct=$._multiDrawStarts,te=$._multiDrawCounts,se=$._multiDrawCount,ge=qt?dt.get(qt).bytesPerElement:1,Ln=Ct.get(et).currentProgram.getUniforms();for(let Ue=0;Ue<se;Ue++)Ln.setValue(N,"_gl_DrawID",Ue),ft.render(ct[Ue]/ge,te[Ue])}else if($.isInstancedMesh)ft.renderInstances(re,he,$.count);else if(tt.isInstancedBufferGeometry){const ct=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,te=Math.min(tt.instanceCount,ct);ft.renderInstances(re,he,te)}else ft.render(re,he)};function ne(A,Y,tt){A.transparent===!0&&A.side===Ve&&A.forceSinglePass===!1?(A.side=Pn,A.needsUpdate=!0,Rt(A,Y,tt),A.side=Bi,A.needsUpdate=!0,Rt(A,Y,tt),A.side=Ve):Rt(A,Y,tt)}this.compile=function(A,Y,tt=null){tt===null&&(tt=A),p=Ft.get(tt),p.init(Y),_.push(p),tt.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),A!==tt&&A.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const et=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const At=$.material;if(At)if(Array.isArray(At))for(let Pt=0;Pt<At.length;Pt++){const Yt=At[Pt];ne(Yt,tt,$),et.add(Yt)}else ne(At,tt,$),et.add(At)}),_.pop(),p=null,et},this.compileAsync=function(A,Y,tt=null){const et=this.compile(A,Y,tt);return new Promise($=>{function At(){if(et.forEach(function(Pt){Ct.get(Pt).currentProgram.isReady()&&et.delete(Pt)}),et.size===0){$(A);return}setTimeout(At,10)}vt.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let Me=null;function Be(A){Me&&Me(A)}function fn(){Te.stop()}function ze(){Te.start()}const Te=new Lf;Te.setAnimationLoop(Be),typeof self<"u"&&Te.setContext(self),this.setAnimationLoop=function(A){Me=A,it.setAnimationLoop(A),A===null?Te.stop():Te.start()},it.addEventListener("sessionstart",fn),it.addEventListener("sessionend",ze),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(Y),Y=it.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,Y,E),p=Ft.get(A,_.length),p.init(Y),_.push(p),yt.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Q.setFromProjectionMatrix(yt),gt=this.localClippingEnabled,q=st.init(this.clippingPlanes,gt),m=xt.get(A,v.length),m.init(),v.push(m),it.enabled===!0&&it.isPresenting===!0){const At=x.xr.getDepthSensingMesh();At!==null&&De(At,Y,-1/0,x.sortObjects)}De(A,Y,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(F,X),Tt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,Tt&&H.addToRenderList(m,A),this.info.render.frame++,q===!0&&st.beginShadows();const tt=p.state.shadowsArray;St.render(tt,A,Y),q===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,$=m.transmissive;if(p.setupLights(),Y.isArrayCamera){const At=Y.cameras;if($.length>0)for(let Pt=0,Yt=At.length;Pt<Yt;Pt++){const qt=At[Pt];pn(et,$,A,qt)}Tt&&H.render(A);for(let Pt=0,Yt=At.length;Pt<Yt;Pt++){const qt=At[Pt];Ye(m,A,qt,qt.viewport)}}else $.length>0&&pn(et,$,A,Y),Tt&&H.render(A),Ye(m,A,Y);E!==null&&(C.updateMultisampleRenderTarget(E),C.updateRenderTargetMipmap(E)),A.isScene===!0&&A.onAfterRender(x,A,Y),Zt.resetDefaultState(),M=-1,b=null,_.pop(),_.length>0?(p=_[_.length-1],q===!0&&st.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function De(A,Y,tt,et){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)tt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Q.intersectsSprite(A)){et&&zt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(yt);const Pt=rt.update(A),Yt=A.material;Yt.visible&&m.push(A,Pt,Yt,tt,zt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Q.intersectsObject(A))){const Pt=rt.update(A),Yt=A.material;if(et&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),zt.copy(A.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),zt.copy(Pt.boundingSphere.center)),zt.applyMatrix4(A.matrixWorld).applyMatrix4(yt)),Array.isArray(Yt)){const qt=Pt.groups;for(let Ot=0,Xt=qt.length;Ot<Xt;Ot++){const Bt=qt[Ot],re=Yt[Bt.materialIndex];re&&re.visible&&m.push(A,Pt,re,tt,zt.z,Bt)}}else Yt.visible&&m.push(A,Pt,Yt,tt,zt.z,null)}}const At=A.children;for(let Pt=0,Yt=At.length;Pt<Yt;Pt++)De(At[Pt],Y,tt,et)}function Ye(A,Y,tt,et){const $=A.opaque,At=A.transmissive,Pt=A.transparent;p.setupLightsView(tt),q===!0&&st.setGlobalState(x.clippingPlanes,tt),et&&Ut.viewport(P.copy(et)),$.length>0&&nn($,Y,tt),At.length>0&&nn(At,Y,tt),Pt.length>0&&nn(Pt,Y,tt),Ut.buffers.depth.setTest(!0),Ut.buffers.depth.setMask(!0),Ut.buffers.color.setMask(!0),Ut.setPolygonOffset(!1)}function pn(A,Y,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new da(1,1,{generateMipmaps:!0,type:vt.has("EXT_color_buffer_half_float")||vt.has("EXT_color_buffer_float")?Vs:Si,minFilter:ra,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ye.workingColorSpace}));const At=p.state.transmissionRenderTarget[et.id],Pt=et.viewport||P;At.setSize(Pt.z,Pt.w);const Yt=x.getRenderTarget();x.setRenderTarget(At),x.getClearColor(B),L=x.getClearAlpha(),L<1&&x.setClearColor(16777215,.5),x.clear(),Tt&&H.render(tt);const qt=x.toneMapping;x.toneMapping=Oi;const Ot=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),q===!0&&st.setGlobalState(x.clippingPlanes,et),nn(A,tt,et),C.updateMultisampleRenderTarget(At),C.updateRenderTargetMipmap(At),vt.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let Bt=0,re=Y.length;Bt<re;Bt++){const xe=Y[Bt],he=xe.object,Re=xe.geometry,ft=xe.material,ct=xe.group;if(ft.side===Ve&&he.layers.test(et.layers)){const te=ft.side;ft.side=Pn,ft.needsUpdate=!0,W(he,tt,et,Re,ft,ct),ft.side=te,ft.needsUpdate=!0,Xt=!0}}Xt===!0&&(C.updateMultisampleRenderTarget(At),C.updateRenderTargetMipmap(At))}x.setRenderTarget(Yt),x.setClearColor(B,L),Ot!==void 0&&(et.viewport=Ot),x.toneMapping=qt}function nn(A,Y,tt){const et=Y.isScene===!0?Y.overrideMaterial:null;for(let $=0,At=A.length;$<At;$++){const Pt=A[$],Yt=Pt.object,qt=Pt.geometry,Ot=et===null?Pt.material:et,Xt=Pt.group;Yt.layers.test(tt.layers)&&W(Yt,Y,tt,qt,Ot,Xt)}}function W(A,Y,tt,et,$,At){A.onBeforeRender(x,Y,tt,et,$,At),A.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(x,Y,tt,et,A,At),$.transparent===!0&&$.side===Ve&&$.forceSinglePass===!1?($.side=Pn,$.needsUpdate=!0,x.renderBufferDirect(tt,Y,et,$,A,At),$.side=Bi,$.needsUpdate=!0,x.renderBufferDirect(tt,Y,et,$,A,At),$.side=Ve):x.renderBufferDirect(tt,Y,et,$,A,At),A.onAfterRender(x,Y,tt,et,$,At)}function Rt(A,Y,tt){Y.isScene!==!0&&(Y=$t);const et=Ct.get(A),$=p.state.lights,At=p.state.shadowsArray,Pt=$.state.version,Yt=It.getParameters(A,$.state,At,Y,tt),qt=It.getProgramCacheKey(Yt);let Ot=et.programs;et.environment=A.isMeshStandardMaterial?Y.environment:null,et.fog=Y.fog,et.envMap=(A.isMeshStandardMaterial?Z:T).get(A.envMap||et.environment),et.envMapRotation=et.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,Ot===void 0&&(A.addEventListener("dispose",Kt),Ot=new Map,et.programs=Ot);let Xt=Ot.get(qt);if(Xt!==void 0){if(et.currentProgram===Xt&&et.lightsStateVersion===Pt)return Qt(A,Yt),Xt}else Yt.uniforms=It.getUniforms(A),A.onBeforeCompile(Yt,x),Xt=It.acquireProgram(Yt,qt),Ot.set(qt,Xt),et.uniforms=Yt.uniforms;const Bt=et.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Bt.clippingPlanes=st.uniform),Qt(A,Yt),et.needsLights=Ae(A),et.lightsStateVersion=Pt,et.needsLights&&(Bt.ambientLightColor.value=$.state.ambient,Bt.lightProbe.value=$.state.probe,Bt.directionalLights.value=$.state.directional,Bt.directionalLightShadows.value=$.state.directionalShadow,Bt.spotLights.value=$.state.spot,Bt.spotLightShadows.value=$.state.spotShadow,Bt.rectAreaLights.value=$.state.rectArea,Bt.ltc_1.value=$.state.rectAreaLTC1,Bt.ltc_2.value=$.state.rectAreaLTC2,Bt.pointLights.value=$.state.point,Bt.pointLightShadows.value=$.state.pointShadow,Bt.hemisphereLights.value=$.state.hemi,Bt.directionalShadowMap.value=$.state.directionalShadowMap,Bt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Bt.spotShadowMap.value=$.state.spotShadowMap,Bt.spotLightMatrix.value=$.state.spotLightMatrix,Bt.spotLightMap.value=$.state.spotLightMap,Bt.pointShadowMap.value=$.state.pointShadowMap,Bt.pointShadowMatrix.value=$.state.pointShadowMatrix),et.currentProgram=Xt,et.uniformsList=null,Xt}function bt(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=Xo.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function Qt(A,Y){const tt=Ct.get(A);tt.outputColorSpace=Y.outputColorSpace,tt.batching=Y.batching,tt.batchingColor=Y.batchingColor,tt.instancing=Y.instancing,tt.instancingColor=Y.instancingColor,tt.instancingMorph=Y.instancingMorph,tt.skinning=Y.skinning,tt.morphTargets=Y.morphTargets,tt.morphNormals=Y.morphNormals,tt.morphColors=Y.morphColors,tt.morphTargetsCount=Y.morphTargetsCount,tt.numClippingPlanes=Y.numClippingPlanes,tt.numIntersection=Y.numClipIntersection,tt.vertexAlphas=Y.vertexAlphas,tt.vertexTangents=Y.vertexTangents,tt.toneMapping=Y.toneMapping}function jt(A,Y,tt,et,$){Y.isScene!==!0&&(Y=$t),C.resetTextureUnits();const At=Y.fog,Pt=et.isMeshStandardMaterial?Y.environment:null,Yt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:os,qt=(et.isMeshStandardMaterial?Z:T).get(et.envMap||Pt),Ot=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Xt=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Bt=!!tt.morphAttributes.position,re=!!tt.morphAttributes.normal,xe=!!tt.morphAttributes.color;let he=Oi;et.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(he=x.toneMapping);const Re=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,ft=Re!==void 0?Re.length:0,ct=Ct.get(et),te=p.state.lights;if(q===!0&&(gt===!0||A!==b)){const Ze=A===b&&et.id===M;st.setState(et,A,Ze)}let se=!1;et.version===ct.__version?(ct.needsLights&&ct.lightsStateVersion!==te.state.version||ct.outputColorSpace!==Yt||$.isBatchedMesh&&ct.batching===!1||!$.isBatchedMesh&&ct.batching===!0||$.isBatchedMesh&&ct.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&ct.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&ct.instancing===!1||!$.isInstancedMesh&&ct.instancing===!0||$.isSkinnedMesh&&ct.skinning===!1||!$.isSkinnedMesh&&ct.skinning===!0||$.isInstancedMesh&&ct.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&ct.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&ct.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&ct.instancingMorph===!1&&$.morphTexture!==null||ct.envMap!==qt||et.fog===!0&&ct.fog!==At||ct.numClippingPlanes!==void 0&&(ct.numClippingPlanes!==st.numPlanes||ct.numIntersection!==st.numIntersection)||ct.vertexAlphas!==Ot||ct.vertexTangents!==Xt||ct.morphTargets!==Bt||ct.morphNormals!==re||ct.morphColors!==xe||ct.toneMapping!==he||ct.morphTargetsCount!==ft)&&(se=!0):(se=!0,ct.__version=et.version);let ge=ct.currentProgram;se===!0&&(ge=Rt(et,Y,$));let Ln=!1,Ue=!1,Tn=!1;const be=ge.getUniforms(),$e=ct.uniforms;if(Ut.useProgram(ge.program)&&(Ln=!0,Ue=!0,Tn=!0),et.id!==M&&(M=et.id,Ue=!0),Ln||b!==A){Ut.buffers.depth.getReversed()?(J.copy(A.projectionMatrix),Zx(J),qx(J),be.setValue(N,"projectionMatrix",J)):be.setValue(N,"projectionMatrix",A.projectionMatrix),be.setValue(N,"viewMatrix",A.matrixWorldInverse);const an=be.map.cameraPosition;an!==void 0&&an.setValue(N,Dt.setFromMatrixPosition(A.matrixWorld)),Ht.logarithmicDepthBuffer&&be.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&be.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),b!==A&&(b=A,Ue=!0,Tn=!0)}if($.isSkinnedMesh){be.setOptional(N,$,"bindMatrix"),be.setOptional(N,$,"bindMatrixInverse");const Ze=$.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),be.setValue(N,"boneTexture",Ze.boneTexture,C))}$.isBatchedMesh&&(be.setOptional(N,$,"batchingTexture"),be.setValue(N,"batchingTexture",$._matricesTexture,C),be.setOptional(N,$,"batchingIdTexture"),be.setValue(N,"batchingIdTexture",$._indirectTexture,C),be.setOptional(N,$,"batchingColorTexture"),$._colorsTexture!==null&&be.setValue(N,"batchingColorTexture",$._colorsTexture,C));const mn=tt.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&lt.update($,tt,ge),(Ue||ct.receiveShadow!==$.receiveShadow)&&(ct.receiveShadow=$.receiveShadow,be.setValue(N,"receiveShadow",$.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&($e.envMap.value=qt,$e.flipEnvMap.value=qt.isCubeTexture&&qt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&Y.environment!==null&&($e.envMapIntensity.value=Y.environmentIntensity),Ue&&(be.setValue(N,"toneMappingExposure",x.toneMappingExposure),ct.needsLights&&le($e,Tn),At&&et.fog===!0&&K.refreshFogUniforms($e,At),K.refreshMaterialUniforms($e,et,O,V,p.state.transmissionRenderTarget[A.id]),Xo.upload(N,bt(ct),$e,C)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Xo.upload(N,bt(ct),$e,C),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&be.setValue(N,"center",$.center),be.setValue(N,"modelViewMatrix",$.modelViewMatrix),be.setValue(N,"normalMatrix",$.normalMatrix),be.setValue(N,"modelMatrix",$.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const Ze=et.uniformsGroups;for(let an=0,gn=Ze.length;an<gn;an++){const ls=Ze[an];U.update(ls,ge),U.bind(ls,ge)}}return ge}function le(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function Ae(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(A,Y,tt){Ct.get(A.texture).__webglTexture=Y,Ct.get(A.depthTexture).__webglTexture=tt;const et=Ct.get(A);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=tt===void 0,et.__autoAllocateDepthBuffer||vt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,Y){const tt=Ct.get(A);tt.__webglFramebuffer=Y,tt.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(A,Y=0,tt=0){E=A,S=Y,w=tt;let et=!0,$=null,At=!1,Pt=!1;if(A){const qt=Ct.get(A);if(qt.__useDefaultFramebuffer!==void 0)Ut.bindFramebuffer(N.FRAMEBUFFER,null),et=!1;else if(qt.__webglFramebuffer===void 0)C.setupRenderTarget(A);else if(qt.__hasExternalTextures)C.rebindTextures(A,Ct.get(A.texture).__webglTexture,Ct.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Bt=A.depthTexture;if(qt.__boundDepthTexture!==Bt){if(Bt!==null&&Ct.has(Bt)&&(A.width!==Bt.image.width||A.height!==Bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(A)}}const Ot=A.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(Pt=!0);const Xt=Ct.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Xt[Y])?$=Xt[Y][tt]:$=Xt[Y],At=!0):A.samples>0&&C.useMultisampledRTT(A)===!1?$=Ct.get(A).__webglMultisampledFramebuffer:Array.isArray(Xt)?$=Xt[tt]:$=Xt,P.copy(A.viewport),z.copy(A.scissor),I=A.scissorTest}else P.copy(nt).multiplyScalar(O).floor(),z.copy(at).multiplyScalar(O).floor(),I=ot;if(Ut.bindFramebuffer(N.FRAMEBUFFER,$)&&et&&Ut.drawBuffers(A,$),Ut.viewport(P),Ut.scissor(z),Ut.setScissorTest(I),At){const qt=Ct.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+Y,qt.__webglTexture,tt)}else if(Pt){const qt=Ct.get(A.texture),Ot=Y||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,qt.__webglTexture,tt||0,Ot)}M=-1},this.readRenderTargetPixels=function(A,Y,tt,et,$,At,Pt){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=Ct.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Yt=Yt[Pt]),Yt){Ut.bindFramebuffer(N.FRAMEBUFFER,Yt);try{const qt=A.texture,Ot=qt.format,Xt=qt.type;if(!Ht.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-et&&tt>=0&&tt<=A.height-$&&N.readPixels(Y,tt,et,$,Vt.convert(Ot),Vt.convert(Xt),At)}finally{const qt=E!==null?Ct.get(E).__webglFramebuffer:null;Ut.bindFramebuffer(N.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(A,Y,tt,et,$,At,Pt){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=Ct.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Pt!==void 0&&(Yt=Yt[Pt]),Yt){const qt=A.texture,Ot=qt.format,Xt=qt.type;if(!Ht.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=A.width-et&&tt>=0&&tt<=A.height-$){Ut.bindFramebuffer(N.FRAMEBUFFER,Yt);const Bt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Bt),N.bufferData(N.PIXEL_PACK_BUFFER,At.byteLength,N.STREAM_READ),N.readPixels(Y,tt,et,$,Vt.convert(Ot),Vt.convert(Xt),0);const re=E!==null?Ct.get(E).__webglFramebuffer:null;Ut.bindFramebuffer(N.FRAMEBUFFER,re);const xe=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await $x(N,xe,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Bt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,At),N.deleteBuffer(Bt),N.deleteSync(xe),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,Y=null,tt=0){A.isTexture!==!0&&(Ss("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,A=arguments[1]);const et=Math.pow(2,-tt),$=Math.floor(A.image.width*et),At=Math.floor(A.image.height*et),Pt=Y!==null?Y.x:0,Yt=Y!==null?Y.y:0;C.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,tt,0,0,Pt,Yt,$,At),Ut.unbindTexture()},this.copyTextureToTexture=function(A,Y,tt=null,et=null,$=0){A.isTexture!==!0&&(Ss("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,A=arguments[1],Y=arguments[2],$=arguments[3]||0,tt=null);let At,Pt,Yt,qt,Ot,Xt,Bt,re,xe;const he=A.isCompressedTexture?A.mipmaps[$]:A.image;tt!==null?(At=tt.max.x-tt.min.x,Pt=tt.max.y-tt.min.y,Yt=tt.isBox3?tt.max.z-tt.min.z:1,qt=tt.min.x,Ot=tt.min.y,Xt=tt.isBox3?tt.min.z:0):(At=he.width,Pt=he.height,Yt=he.depth||1,qt=0,Ot=0,Xt=0),et!==null?(Bt=et.x,re=et.y,xe=et.z):(Bt=0,re=0,xe=0);const Re=Vt.convert(Y.format),ft=Vt.convert(Y.type);let ct;Y.isData3DTexture?(C.setTexture3D(Y,0),ct=N.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(C.setTexture2DArray(Y,0),ct=N.TEXTURE_2D_ARRAY):(C.setTexture2D(Y,0),ct=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,Y.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,Y.unpackAlignment);const te=N.getParameter(N.UNPACK_ROW_LENGTH),se=N.getParameter(N.UNPACK_IMAGE_HEIGHT),ge=N.getParameter(N.UNPACK_SKIP_PIXELS),Ln=N.getParameter(N.UNPACK_SKIP_ROWS),Ue=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,he.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,he.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,qt),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ot),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Xt);const Tn=A.isDataArrayTexture||A.isData3DTexture,be=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isRenderTargetTexture||A.isDepthTexture){const $e=Ct.get(A),mn=Ct.get(Y),Ze=Ct.get($e.__renderTarget),an=Ct.get(mn.__renderTarget);Ut.bindFramebuffer(N.READ_FRAMEBUFFER,Ze.__webglFramebuffer),Ut.bindFramebuffer(N.DRAW_FRAMEBUFFER,an.__webglFramebuffer);for(let gn=0;gn<Yt;gn++)Tn&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ct.get(A).__webglTexture,$,Xt+gn),A.isDepthTexture?(be&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ct.get(Y).__webglTexture,$,xe+gn),N.blitFramebuffer(qt,Ot,At,Pt,Bt,re,At,Pt,N.DEPTH_BUFFER_BIT,N.NEAREST)):be?N.copyTexSubImage3D(ct,$,Bt,re,xe+gn,qt,Ot,At,Pt):N.copyTexSubImage2D(ct,$,Bt,re,xe+gn,qt,Ot,At,Pt);Ut.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ut.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else be?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(ct,$,Bt,re,xe,At,Pt,Yt,Re,ft,he.data):Y.isCompressedArrayTexture?N.compressedTexSubImage3D(ct,$,Bt,re,xe,At,Pt,Yt,Re,he.data):N.texSubImage3D(ct,$,Bt,re,xe,At,Pt,Yt,Re,ft,he):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,$,Bt,re,At,Pt,Re,ft,he.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,$,Bt,re,he.width,he.height,Re,he.data):N.texSubImage2D(N.TEXTURE_2D,$,Bt,re,At,Pt,Re,ft,he);N.pixelStorei(N.UNPACK_ROW_LENGTH,te),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,se),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ge),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ln),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ue),$===0&&Y.generateMipmaps&&N.generateMipmap(ct),Ut.unbindTexture()},this.copyTextureToTexture3D=function(A,Y,tt=null,et=null,$=0){return A.isTexture!==!0&&(Ss("WebGLRenderer: copyTextureToTexture3D function signature has changed."),tt=arguments[0]||null,et=arguments[1]||null,A=arguments[2],Y=arguments[3],$=arguments[4]||0),Ss('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,Y,tt,et,$)},this.initRenderTarget=function(A){Ct.get(A).__webglFramebuffer===void 0&&C.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?C.setTextureCube(A,0):A.isData3DTexture?C.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?C.setTexture2DArray(A,0):C.setTexture2D(A,0),Ut.unbindTexture()},this.resetState=function(){S=0,w=0,E=null,Ut.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=ye._getDrawingBufferColorSpace(t),e.unpackColorSpace=ye._getUnpackColorSpace()}}class s1 extends We{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class o1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=bl,this.updateRanges=[],this.version=0,this.uuid=ci()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const yn=new G;class ar{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)yn.fromBufferAttribute(this,e),yn.applyMatrix4(t),this.setXYZ(e,yn.x,yn.y,yn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)yn.fromBufferAttribute(this,e),yn.applyNormalMatrix(t),this.setXYZ(e,yn.x,yn.y,yn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)yn.fromBufferAttribute(this,e),yn.transformDirection(t),this.setXYZ(e,yn.x,yn.y,yn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=jn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Le(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Le(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Le(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Le(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Le(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=jn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=jn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=jn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=jn(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array),a=Le(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Le(e,this.array),i=Le(i,this.array),a=Le(a,this.array),s=Le(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new hn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ar(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class wl extends fa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Oa;const _s=new G,Ba=new G,Ha=new G,Ga=new Wt,ys=new Wt,Nf=new Oe,Eo=new G,Ms=new G,To=new G,ru=new Wt,mc=new Wt,cu=new Wt;class lu extends We{constructor(t=new wl){if(super(),this.isSprite=!0,this.type="Sprite",Oa===void 0){Oa=new Je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new o1(e,5);Oa.setIndex([0,1,2,0,2,3]),Oa.setAttribute("position",new ar(i,3,0,!1)),Oa.setAttribute("uv",new ar(i,2,3,!1))}this.geometry=Oa,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ba.setFromMatrixScale(this.matrixWorld),Nf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ha.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ba.multiplyScalar(-Ha.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ao(Eo.set(-.5,-.5,0),Ha,o,Ba,a,s),Ao(Ms.set(.5,-.5,0),Ha,o,Ba,a,s),Ao(To.set(.5,.5,0),Ha,o,Ba,a,s),ru.set(0,0),mc.set(1,0),cu.set(1,1);let r=t.ray.intersectTriangle(Eo,Ms,To,!1,_s);if(r===null&&(Ao(Ms.set(-.5,.5,0),Ha,o,Ba,a,s),mc.set(0,1),r=t.ray.intersectTriangle(Eo,To,Ms,!1,_s),r===null))return;const l=t.ray.origin.distanceTo(_s);l<t.near||l>t.far||e.push({distance:l,point:_s.clone(),uv:Un.getInterpolation(_s,Eo,Ms,To,ru,mc,cu,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ao(n,t,e,i,a,s){Ga.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(ys.x=s*Ga.x-a*Ga.y,ys.y=a*Ga.x+s*Ga.y):ys.copy(Ga),n.copy(t),n.x+=ys.x,n.y+=ys.y,n.applyMatrix4(Nf)}class th extends fa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const sr=new G,or=new G,hu=new Oe,bs=new jl,Ro=new pr,gc=new G,du=new G;class r1 extends We{constructor(t=new Je,e=new th){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)sr.fromBufferAttribute(e,a-1),or.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=sr.distanceTo(or);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ro.copy(i.boundingSphere),Ro.applyMatrix4(a),Ro.radius+=s,t.ray.intersectsSphere(Ro)===!1)return;hu.copy(a).invert(),bs.copy(t.ray).applyMatrix4(hu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=h.getX(y),v=h.getX(y+1),_=Po(this,t,bs,l,p,v);_&&e.push(_)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(u),p=Po(this,t,bs,l,y,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=Po(this,t,bs,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=Po(this,t,bs,l,g-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Po(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(sr.fromBufferAttribute(o,a),or.fromBufferAttribute(o,s),e.distanceSqToSegment(sr,or,gc,du)>i)return;gc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(gc);if(!(l<t.near||l>t.far))return{distance:l,point:du.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const uu=new G,fu=new G;class Of extends r1{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)uu.fromBufferAttribute(e,a),fu.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+uu.distanceTo(fu);t.setAttribute("lineDistance",new Ee(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class El extends En{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class hi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Wt:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,l=new Oe;for(let u=0;u<=t;u++){const g=u/t;a[u]=this.getTangentAt(g,new G)}s[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(ln(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,g))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(ln(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(a[g],u*g)),o[g].crossVectors(a[g],s[g])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class eh extends hi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class c1 extends eh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function nh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Co=new G,xc=new nh,vc=new nh,_c=new nh;class l1 extends hi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(Co.subVectors(a[0],a[1]).add(a[0]),c=Co);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Co.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Co),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),xc.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,g,y,m),vc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,g,y,m),_c.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(xc.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),vc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),_c.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(xc.calc(l),vc.calc(l),_c.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function pu(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function h1(n,t){const e=1-n;return e*e*t}function d1(n,t){return 2*(1-n)*n*t}function u1(n,t){return n*n*t}function As(n,t,e,i){return h1(n,t)+d1(n,e)+u1(n,i)}function f1(n,t){const e=1-n;return e*e*e*t}function p1(n,t){const e=1-n;return 3*e*e*n*t}function m1(n,t){return 3*(1-n)*n*n*t}function g1(n,t){return n*n*n*t}function Rs(n,t,e,i,a){return f1(n,t)+p1(n,e)+m1(n,i)+g1(n,a)}class Bf extends hi{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Rs(t,a.x,s.x,o.x,r.x),Rs(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class x1 extends hi{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Rs(t,a.x,s.x,o.x,r.x),Rs(t,a.y,s.y,o.y,r.y),Rs(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Hf extends hi{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v1 extends hi{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gf extends hi{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(As(t,a.x,s.x,o.x),As(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _1 extends hi{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(As(t,a.x,s.x,o.x),As(t,a.y,s.y,o.y),As(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Vf extends hi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(pu(r,l.x,c.x,h.x,f.x),pu(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var mu=Object.freeze({__proto__:null,ArcCurve:c1,CatmullRomCurve3:l1,CubicBezierCurve:Bf,CubicBezierCurve3:x1,EllipseCurve:eh,LineCurve:Hf,LineCurve3:v1,QuadraticBezierCurve:Gf,QuadraticBezierCurve3:_1,SplineCurve:Vf});class y1 extends hi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new mu[a.type]().fromJSON(a))}return this}}class gu extends y1{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Hf(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Gf(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Bf(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Vf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new eh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ih extends Je{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new G,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Ee(o,3)),this.setAttribute("normal",new Ee(r,3)),this.setAttribute("uv",new Ee(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ih(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Us extends Je{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let g=0;const y=[],m=i/2;let p=0;v(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Ee(f,3)),this.setAttribute("normal",new Ee(d,3)),this.setAttribute("uv",new Ee(u,2));function v(){const x=new G,R=new G;let S=0;const w=(e-t)/i;for(let E=0;E<=s;E++){const M=[],b=E/s,P=b*(e-t)+t;for(let z=0;z<=a;z++){const I=z/a,B=I*l+r,L=Math.sin(B),D=Math.cos(B);R.x=P*L,R.y=-b*i+m,R.z=P*D,f.push(R.x,R.y,R.z),x.set(L,w,D).normalize(),d.push(x.x,x.y,x.z),u.push(I,1-b),M.push(g++)}y.push(M)}for(let E=0;E<a;E++)for(let M=0;M<s;M++){const b=y[M][E],P=y[M+1][E],z=y[M+1][E+1],I=y[M][E+1];(t>0||M!==0)&&(h.push(b,P,I),S+=3),(e>0||M!==s-1)&&(h.push(P,z,I),S+=3)}c.addGroup(p,S,0),p+=S}function _(x){const R=g,S=new Wt,w=new G;let E=0;const M=x===!0?t:e,b=x===!0?1:-1;for(let z=1;z<=a;z++)f.push(0,m*b,0),d.push(0,b,0),u.push(.5,.5),g++;const P=g;for(let z=0;z<=a;z++){const B=z/a*l+r,L=Math.cos(B),D=Math.sin(B);w.x=M*D,w.y=m*b,w.z=M*L,f.push(w.x,w.y,w.z),d.push(0,b,0),S.x=L*.5+.5,S.y=D*.5*b+.5,u.push(S.x,S.y),g++}for(let z=0;z<a;z++){const I=R+z,B=P+z;x===!0?h.push(B,B+1,I):h.push(B+1,B,I),E+=3}c.addGroup(p,E,x===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Us(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ah extends Us{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new ah(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class sh extends Je{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Ee(s,3)),this.setAttribute("normal",new Ee(s.slice(),3)),this.setAttribute("uv",new Ee(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const _=new G,x=new G,R=new G;for(let S=0;S<e.length;S+=3)u(e[S+0],_),u(e[S+1],x),u(e[S+2],R),l(_,x,R,v)}function l(v,_,x,R){const S=R+1,w=[];for(let E=0;E<=S;E++){w[E]=[];const M=v.clone().lerp(x,E/S),b=_.clone().lerp(x,E/S),P=S-E;for(let z=0;z<=P;z++)z===0&&E===S?w[E][z]=M:w[E][z]=M.clone().lerp(b,z/P)}for(let E=0;E<S;E++)for(let M=0;M<2*(S-E)-1;M++){const b=Math.floor(M/2);M%2===0?(d(w[E][b+1]),d(w[E+1][b]),d(w[E][b])):(d(w[E][b+1]),d(w[E+1][b+1]),d(w[E+1][b]))}}function c(v){const _=new G;for(let x=0;x<s.length;x+=3)_.x=s[x+0],_.y=s[x+1],_.z=s[x+2],_.normalize().multiplyScalar(v),s[x+0]=_.x,s[x+1]=_.y,s[x+2]=_.z}function h(){const v=new G;for(let _=0;_<s.length;_+=3){v.x=s[_+0],v.y=s[_+1],v.z=s[_+2];const x=m(v)/2/Math.PI+.5,R=p(v)/Math.PI+.5;o.push(x,1-R)}g(),f()}function f(){for(let v=0;v<o.length;v+=6){const _=o[v+0],x=o[v+2],R=o[v+4],S=Math.max(_,x,R),w=Math.min(_,x,R);S>.9&&w<.1&&(_<.2&&(o[v+0]+=1),x<.2&&(o[v+2]+=1),R<.2&&(o[v+4]+=1))}}function d(v){s.push(v.x,v.y,v.z)}function u(v,_){const x=v*3;_.x=t[x+0],_.y=t[x+1],_.z=t[x+2]}function g(){const v=new G,_=new G,x=new G,R=new G,S=new Wt,w=new Wt,E=new Wt;for(let M=0,b=0;M<s.length;M+=9,b+=6){v.set(s[M+0],s[M+1],s[M+2]),_.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),S.set(o[b+0],o[b+1]),w.set(o[b+2],o[b+3]),E.set(o[b+4],o[b+5]),R.copy(v).add(_).add(x).divideScalar(3);const P=m(R);y(S,b+0,v,P),y(w,b+2,_,P),y(E,b+4,x,P)}}function y(v,_,x,R){R<0&&v.x===1&&(o[_]=v.x-1),x.x===0&&x.z===0&&(o[_]=R/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sh(t.vertices,t.indices,t.radius,t.details)}}const Lo=new G,Do=new G,yc=new G,ko=new Un;class M1 extends Je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(ja*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:y,b:m,c:p}=ko;if(y.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),ko.getNormal(yc),f[0]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,f[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let v=0;v<3;v++){const _=(v+1)%3,x=f[v],R=f[_],S=ko[h[v]],w=ko[h[_]],E=`${x}_${R}`,M=`${R}_${x}`;M in d&&d[M]?(yc.dot(d[M].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(w.x,w.y,w.z)),d[M]=null):E in d||(d[E]={index0:c[v],index1:c[_],normal:yc.clone()})}}for(const g in d)if(d[g]){const{index0:y,index1:m}=d[g];Lo.fromBufferAttribute(r,y),Do.fromBufferAttribute(r,m),u.push(Lo.x,Lo.y,Lo.z),u.push(Do.x,Do.y,Do.z)}this.setAttribute("position",new Ee(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Xf extends gu{constructor(t){super(t),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new gu().fromJSON(a))}return this}}const b1={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Wf(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=A1(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<a;g+=e)f=n[g],d=n[g+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Ns(s,o,e,r,l,u,0),o}};function Wf(n,t,e,i,a){let s,o;if(a===N1(n,t,e,i)>0)for(s=t;s<e;s+=i)o=xu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=xu(s,n[s],n[s+1],o);return o&&gr(o,o.next)&&(Bs(o),o=o.next),o}function ua(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(gr(e,e.next)||Xe(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ns(n,t,e,i,a,s,o){if(!n)return;!o&&s&&D1(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?w1(n,i,a,s):S1(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Bs(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=E1(ua(n),t,e),Ns(n,t,e,i,a,s,2)):o===2&&T1(n,t,e,i,a,s):Ns(ua(n),t,e,i,a,s,1);break}}}function S1(n){const t=n.prev,e=n,i=n.next;if(Xe(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&Ya(a,r,s,l,o,c,g.x,g.y)&&Xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function w1(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Xe(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,g=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,m=h>f?h>d?h:d:f>d?f:d,p=Tl(u,g,t,e,i),v=Tl(y,m,t,e,i);let _=n.prevZ,x=n.nextZ;for(;_&&_.z>=p&&x&&x.z<=v;){if(_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==a&&_!==o&&Ya(r,h,l,f,c,d,_.x,_.y)&&Xe(_.prev,_,_.next)>=0||(_=_.prevZ,x.x>=u&&x.x<=y&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&Ya(r,h,l,f,c,d,x.x,x.y)&&Xe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==a&&_!==o&&Ya(r,h,l,f,c,d,_.x,_.y)&&Xe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;x&&x.z<=v;){if(x.x>=u&&x.x<=y&&x.y>=g&&x.y<=m&&x!==a&&x!==o&&Ya(r,h,l,f,c,d,x.x,x.y)&&Xe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function E1(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!gr(a,s)&&Yf(a,i,i.next,s)&&Os(a,s)&&Os(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Bs(i),Bs(i.next),i=n=s),i=i.next}while(i!==n);return ua(i)}function T1(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&F1(o,r)){let l=$f(o,r);o=ua(o,o.next),l=ua(l,l.next),Ns(o,t,e,i,a,s,0),Ns(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function A1(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=Wf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(I1(c));for(a.sort(R1),s=0;s<a.length;s++)e=P1(a[s],e);return e}function R1(n,t){return n.x-t.x}function P1(n,t){const e=C1(n,t);if(!e)return t;const i=$f(e,n);return ua(i,i.next),ua(e,e.next)}function C1(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Ya(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Os(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&L1(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function L1(n,t){return Xe(n.prev,n,t.prev)<0&&Xe(t.next,n,n.next)<0}function D1(n,t,e,i){let a=n;do a.z===0&&(a.z=Tl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,k1(a)}function k1(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Tl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function I1(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Ya(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function F1(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!z1(n,t)&&(Os(n,t)&&Os(t,n)&&U1(n,t)&&(Xe(n.prev,n,t.prev)||Xe(n,t.prev,t))||gr(n,t)&&Xe(n.prev,n,n.next)>0&&Xe(t.prev,t,t.next)>0)}function Xe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function gr(n,t){return n.x===t.x&&n.y===t.y}function Yf(n,t,e,i){const a=Fo(Xe(n,t,e)),s=Fo(Xe(n,t,i)),o=Fo(Xe(e,i,n)),r=Fo(Xe(e,i,t));return!!(a!==s&&o!==r||a===0&&Io(n,e,t)||s===0&&Io(n,i,t)||o===0&&Io(e,n,i)||r===0&&Io(e,t,i))}function Io(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Fo(n){return n>0?1:n<0?-1:0}function z1(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Yf(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Os(n,t){return Xe(n.prev,n,n.next)<0?Xe(n,t,n.next)>=0&&Xe(n,n.prev,t)>=0:Xe(n,t,n.prev)<0||Xe(n,n.next,t)<0}function U1(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function $f(n,t){const e=new Al(n.i,n.x,n.y),i=new Al(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function xu(n,t,e,i){const a=new Al(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Bs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Al(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function N1(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Ps{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Ps.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];vu(t),_u(i,t);let o=t.length;e.forEach(vu);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,_u(i,e[l]);const r=b1.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function vu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function _u(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class oh extends sh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new oh(t.radius,t.detail)}}class Hs extends Je{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new G,g=new Wt;for(let y=0;y<=a;y++){for(let m=0;m<=i;m++){const p=s+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let y=0;y<a;y++){const m=y*(i+1);for(let p=0;p<i;p++){const v=p+m,_=v,x=v+i+1,R=v+i+2,S=v+1;r.push(_,x,S),r.push(x,R,S)}}this.setIndex(r),this.setAttribute("position",new Ee(l,3)),this.setAttribute("normal",new Ee(c,3)),this.setAttribute("uv",new Ee(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class rh extends Je{constructor(t=new Xf([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Ee(a,3)),this.setAttribute("normal",new Ee(s,3)),this.setAttribute("uv",new Ee(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;Ps.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const v=g[m];Ps.isClockWise(v)===!0&&(g[m]=v.reverse())}const y=Ps.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const v=g[m];u=u.concat(v)}for(let m=0,p=u.length;m<p;m++){const v=u[m];a.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let m=0,p=y.length;m<p;m++){const v=y[m],_=v[0]+f,x=v[1]+f,R=v[2]+f;i.push(_,x,R),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return O1(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new rh(i,t.curveSegments)}}function O1(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class xr extends Je{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let g=0;g<=a;g++){const y=g/a*s,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(y),f.y=(t+e*Math.cos(m))*Math.sin(y),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=a;g++){const y=(a+1)*u+g-1,m=(a+1)*(u-1)+g-1,p=(a+1)*(u-1)+g,v=(a+1)*u+g;o.push(y,m,v),o.push(m,p,v)}this.setIndex(o),this.setAttribute("position",new Ee(r,3)),this.setAttribute("normal",new Ee(l,3)),this.setAttribute("uv",new Ee(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Gs extends fa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yf,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Zf extends We{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class B1 extends Zf{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Mc=new Oe,yu=new G,Mu=new G;class H1{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jl,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;yu.setFromMatrixPosition(t.matrixWorld),e.position.copy(yu),Mu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Mu),e.updateMatrixWorld(),Mc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Mc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class G1 extends H1{constructor(){super(new Df(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class V1 extends Zf{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.target=new We,this.shadow=new G1}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const bu=new Oe;class X1{constructor(t,e,i=0,a=1/0){this.ray=new jl(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Kl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return bu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bu),this}intersectObject(t,e=!0,i=[]){return Rl(t,this,i,e),i.sort(Su),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Rl(t[a],this,i,e);return i.sort(Su),i}}function Su(n,t){return n.distance-t.distance}function Rl(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Rl(s[o],t,e,!0)}}class W1 extends Of{constructor(t=10,e=10,i=4473924,a=8947848){i=new ee(i),a=new ee(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const y=d===s?i:a;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new Je;h.setAttribute("position",new Ee(l,3)),h.setAttribute("color",new Ee(c,3));const f=new th({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hl);const Y1={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function $1(n,t,e,i){const a=new Hn(n.fov,i,.1,200),s=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0;function g(){const y=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(y),Math.sin(y),Math.cos(m)*Math.cos(y)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return g(),{camera:a,update(y,m,p,v,_=Y1){const x=m+.6;if(!l)s.set(y,x,p),l=!0;else{const w=1-Math.exp(-Math.max(n.smoothing,.001)*v);s.x+=(y-s.x)*w,s.y+=(x-s.y)*w,s.z+=(p-s.z)*w}const R=1-Math.exp(-Math.max(t.smoothing,.001)*v);h.distanceScale+=(_.distanceScale-h.distanceScale)*R,h.offsetX+=(_.offsetX-h.offsetX)*R,h.offsetZ+=(_.offsetZ-h.offsetZ)*R,h.pitchDelta+=(_.pitchDelta-h.pitchDelta)*R;const S=1-Math.exp(-Math.max(e.smoothing,.001)*v);if(h.zoom+=(f-h.zoom)*S,g(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=v*52;const w=d*.055;a.position.x+=Math.sin(u*1.7)*w,a.position.y+=Math.sin(u*2.3+1.1)*w*.75,a.position.z+=Math.sin(u*1.3+2.4)*w*.5,d*=Math.exp(-9*v)}else d=0;a.updateMatrixWorld()},snap(y,m,p){s.set(y,m+.6,p),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),g(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(y){a.aspect=y,a.updateProjectionMatrix()},getGroundBasis(){const y=new G().setFromMatrixColumn(a.matrixWorld,0),m=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),p=Math.hypot(y.x,y.z)||1,v=Math.hypot(m.x,m.z)||1;return{rightX:y.x/p,rightZ:y.z/p,forwardX:m.x/v,forwardZ:m.z/v}},addShake(y){!Number.isFinite(y)||y<=0||(d=Math.min(1,d+y))},shakeLevel(){return d},setZoom(y){f=Number.isFinite(y)&&y>0?y:1},smart(){return{...h}}}}const ca=Math.PI*2,Gn=1e-6;function Cn(n,t,e){return n<t?t:n>e?e:n}function qf(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function Z1(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function jf(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=Z1(n);return i===1?a:e+(a-e)*i}function wu(n){return(1-Math.sin(n))/2}function ch(n,t,e){const i=Math.PI/180,a=Cn(Number.isFinite(t)?t:100,0,180),s=Cn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Cn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function lh(n,t){if(!n.grounded||n.speed<Gn)return qf();const e=n.speed/Math.max(n.moveSpeed,Gn),i=Math.max(n.legLength,Gn),a=n.stride>Gn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Gn,h=ch(n.localForward/Math.max(n.speed,Gn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,y=a,m=B=>Math.asin(Cn(B,-o,o)/i);function p(B,L){const D=jf(B,t.plantLock),V=wu(B),O=u*d*y*D,F=-m(O),X=L*g>0?1:-1,nt=1+X*t.crossStep*.45,at=g*X*t.crossStep*y*.4*V,ot=g*f*y*t.sideWeight*nt*D+at*f,Q=m(ot),q=t.kneeLift*V*s*(.55+.25*d+(X>0?.2*f:0));return{pitchX:F,rollZ:Q,kneeX:q}}const v=(n.phase%ca+ca)%ca,_=p(v,-1),x=p((v+Math.PI)%ca,1),R=Math.cos(v),S=wu(v),w=-t.comSway*s*R*(.6*d+.8*f)-g*t.comSway*s*f*.45,E=t.comBob*S*s,M=g*t.hipLean*s*f*R*.6,b=g*t.hipLean*s*f*(.45+.25*R),P=t.armSwing*s*R*(d*u+.3*f),z=P,I=-P;return{legL:_,legR:x,pelvisX:w,pelvisY:E,pelvisRoll:M,sideLean:b,armL:z,armR:I,strafe:f,backward:u<0?d:0}}function Kf(n){const t=(n%ca+ca)%ca,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Jf(n,t,e){const i=Cn(e.progress,0,1);if(i>=1||n.speed<Gn)return qf();const a=i*i*(3-2*i),s=1-a;return lh({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Qf(n,t,e,i){const a=Cn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Cn(o*a,-1,1)*(e*Math.PI/180)}function tp(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Cn(i,0,1),c=l*l;return e*c+r*(1-c)}function ep(n,t,e,i,a){const s=Math.max(e,Gn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Gn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Gn&&n<=o&&c,resume:!d}}function np(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Cn(n*Cn(t,0,2),-i,i)}function ip(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function ap(n,t,e){const i=Cn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function q1(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Cn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function sp(n,t,e,i,a){const s=Cn(n,0,1),o=Cn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>Gn?e/h:1,d=h>Gn?i/h:0,u=jf(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function wn(n){return n<0?0:n>1?1:n}const Wo=Math.PI*2;function j1(n){return((n+Math.PI)%Wo+Wo)%Wo-Math.PI}function K1(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function J1(n,t,e,i,a,s=n.phase){const o=wn(i);if(o<=0)return n;const r=wn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=wn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,g=r<=.5?r*2:(r-.5)*2,y=g*g*(3-2*g),m=r<=.5?y:1-y,p={speed:c,phase:s+Wo*l/2*m,localForward:c*f,localRight:c*(1-f)*h},v=j1(p.phase-n.phase),_=o*o*(3-2*o),x=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+v*_,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:x+(u-x)*o*o}}function Q1(n,t,e){const i=K1(),a=wn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function op(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Eu(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*op(s,a)}function tS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function eS(n,t,e){const i=wn(n);return{gaitScale:1-i*(1-wn(t)),attackLegWeight:wn(e)*i}}function nS(n,t){const e=wn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function iS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return wn(t.minScale+(1-t.minScale)*e)}function aS(){return rp()}function rp(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function sS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function oS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?wn(t.forceHitHeight):n.type==="light"?wn(t.hitHeight.light):n.type==="heavy"?wn(t.hitHeight.heavy):n.type==="knock"?wn(t.hitHeight.knock):0}function rS(n,t,e){const i=wn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function cp(n,t,e){const i=rp(),a=sS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=wn(1-n.timer/n.duration),o=op(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=oS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*s);return i.upperPitch=a*y*f,i.upperRoll=-a*y*d*.7,i.drop=(a>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=a*o,g=rS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function lp(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ji=1e-6;function Cs(n,t,e){return n<t?t:n>e?e:n}function hp(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Ji||s<=Ji||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+Ji,c=Math.hypot(n.x,n.y,n.z);if(c<=Ji)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=Cs(u,l,r),y=u>r+Ji||u<l-Ji,m=Math.atan2(-d,Math.max(f,Ji)),p=Cs((a*a+g*g-s*s)/(2*a*g),-1,1),v=Cs((s*s+g*g-a*a)/(2*s*g),-1,1),_=Math.acos(p),x=Math.acos(v),R=i>=0?1:-1;return{rootPitch:m-R*_,rootRoll:h,jointPitch:R*(_+x),clamped:y,reach:c/r}}function dp(n,t,e,i){const a=Cs(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Cs((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function up(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const hh={active:!1,weight:0,clamped:0,maxError:0};function fp(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...hh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const g=a[u],y=i.worldToLocal(l[u].clone()),m={x:y.x-g.root.position.x,y:y.y-g.root.position.y,z:y.z-g.root.position.z},p=hp(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const v=dp({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=v.rootPitch,g.root.rotation.z=v.rootRoll,g.joint.rotation.x=v.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const g=a[u].tip.getWorldPosition(new G);d=Math.max(d,g.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Fn(n,t,e){return n<t?t:n>e?e:n}function cS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ie,d=new Ie;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ie;u.name="lower";const g=new Ie;g.name="upper",d.add(u),d.add(g);const y=[],m=(K,xt,Ft,st)=>{const St=new Gs({color:st}),H=new me(new Qn(K,xt,Ft),St);return H.castShadow=!0,H.receiveShadow=!0,y.push(St),H},p=n.headSize,v=n.legLength,_=n.armLength,x=n.limbThickness,R=n.bodyHeight,S=n.bodyWidth,w=m(S,R,.28,e);w.position.y=R/2,g.add(w);const E=new Ie;E.name="headPivot",E.rotation.order="YXZ",E.position.y=R,g.add(E);const M=m(p,p,p,e);M.position.y=p/2,E.add(M);for(const K of[-1,1]){const xt=m(.06,.07,.02,t.shoe);xt.position.set(K*.09,p/2+.03,p/2+.011),E.add(xt)}const b=(K,xt)=>{const Ft=xt?_:v,st=new Ie;st.name=xt?K<0?"shoulderL":"shoulderR":K<0?"hipL":"hipR",xt||(st.rotation.order="ZYX"),st.position.set(K*(xt?S/2+x/2:S/2-x/2),xt?R-.04:0,0),(xt?g:u).add(st);const St=m(x,Ft/2,x,t.limb);St.position.y=-Ft/4,st.add(St);const H=new Ie;H.name=xt?"elbow":"knee",H.position.y=-Ft/2,st.add(H);const lt=m(x,Ft/2,x,t.limb);if(lt.position.y=-Ft/4,H.add(lt),!xt){const pt=m(x*1.15,.07,x*1.7,t.shoe);pt.position.set(0,-Ft/2+.035,.045),H.add(pt);const Gt=new We;return Gt.name="footTip",Gt.position.y=-Ft/2,H.add(Gt),{root:st,joint:H,tip:Gt}}return{root:st,joint:H}},P=b(-1,!1),z=b(1,!1),I=b(-1,!0),B=b(1,!0),L=[P,z].map(K=>({root:K.root,joint:K.joint,tip:K.tip,upperLen:v/2,lowerLen:v/2,bend:1})),D=new Qe({color:a.attackArcColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),V=new me(new xr(.62,.042,6,20,Math.PI*1.1),D);V.position.set(0,.78-v,.56),g.add(V);const O=new ee(e),F=new ee(r.flashColor),X=new ee;let nt=null,at=0,ot=0,Q=0,q=0,gt=0,J=0,yt=0,Dt={...hh},zt=-1,$t=0,Tt=0,kt=0,N=0,fe=0,vt=0,Ht=0,Ut=1,Lt=0,Ct=0,C="none",T=0,Z=!1,dt=-1,ut=!1,rt=0,It=0;return{group:f,boneAtWorld(K,xt,Ft){const st=[{node:g,ax:0,ay:.05,az:0,bx:0,by:R,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:B.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:B.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0}],St=new G,H=new G,lt=new G(K,xt,Ft),pt=new G;let Gt=null,Vt=Number.POSITIVE_INFINITY;for(const Zt of st){Zt.node.updateWorldMatrix(!0,!1),St.set(Zt.ax,Zt.ay,Zt.az),H.set(Zt.bx,Zt.by,Zt.bz),Zt.node.localToWorld(St),Zt.node.localToWorld(H);const U=H.x-St.x,Mt=H.y-St.y,it=H.z-St.z,ht=U*U+Mt*Mt+it*it;let wt=ht>1e-8?((lt.x-St.x)*U+(lt.y-St.y)*Mt+(lt.z-St.z)*it)/ht:0;wt=Math.max(0,Math.min(1,wt));const Et=St.x+U*wt,Kt=St.y+Mt*wt,ie=St.z+it*wt,pe=(lt.x-Et)**2+(lt.y-Kt)**2+(lt.z-ie)**2;pe<Vt&&(Vt=pe,Gt=Zt.node,pt.set(Et,Kt,ie))}return Gt?{node:Gt,point:pt.clone()}:null},update(K,xt){f.position.set(K.position.x,K.position.y,K.position.z),f.rotation.y=K.bodyYaw,E.rotation.y=(K.headYaw-K.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,K.mode!==nt&&(nt=K.mode,at=1),at=Math.max(0,at-xt*2.2);const Ft=K.hurt,st=cp(Ft,K.bodyYaw,r),St=st.flash;X.copy(F).multiplyScalar(St);for(const Ot of y)Ot.emissive.copy(O).multiplyScalar(at*.5),St>0&&Ot.emissive.add(X);d.position.set(0,v,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const H=Math.hypot(K.velocity.x,K.velocity.z),lt=Fn(o.knockGaitScale??0,0,1),pt=K.hurt.knockX*lt,Gt=K.hurt.knockZ*lt,Vt=lt>0&&Math.hypot(K.hurt.knockX,K.hurt.knockZ)>.001,Zt=K.velocity.x+pt,U=K.velocity.z+Gt,Mt=Math.hypot(Zt,U),it=Math.cos(K.bodyYaw),ht=-Math.sin(K.bodyYaw),wt=H>1e-6?Fn((K.velocity.x*it+K.velocity.z*ht)/H,-1,1):0,Et=H>1e-6?Fn((K.velocity.x*Math.sin(K.bodyYaw)+K.velocity.z*Math.cos(K.bodyYaw))/H,-1,1):1,Kt=ch(Et,o.backStrafeStartDeg,o.backStrafeFullDeg);C==="settled"&&ut&&rt>It*1.02+1e-4&&(C="none");let ie=1;C==="blend"?(ie=ap(Z?dt:T,o.stopYawBlendMode,Z),Z||(T=Math.min(1,T+xt/Math.max(.01,o.stopYawAfterSec)),(T>=1||o.stopYawBlendMode==="inStop"||ut)&&(C="settled",ie=0))):C==="settled"&&(ie=Fn(H/Math.max(1e-6,o.stopEnterRatio*s),0,1));const pe=Qf(wt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ne=tp(Et,wt,pe,Kt)*ie;Lt+=(ne-Lt)*(1-Math.exp(-12*Math.max(0,xt))),u.rotation.y=Lt;const Me=K.bodyYaw+Lt,Be=Math.sin(Me),fn=Math.cos(Me),ze=Math.cos(Me),Te=-Math.sin(Me),De=Zt*Be+U*fn,Ye=Zt*ze+U*Te,pn=Math.max(0,o.stopBlendSec||0),nn=pn>0&&!Vt,W=ep(H,Ct,s,o.stopEnterRatio,o.stopExitRatio);if(!nn||W.resume)zt=-1;else if(zt<0&&W.enter){zt=0,$t=K.gaitPhase,Tt=Kf(K.gaitPhase),kt=H,N=Math.max(K.stride,1e-6),fe=De,vt=Ye;const Ot=1/Math.max(1e-6,H);Ht=K.velocity.x*Ot,Ut=K.velocity.z*Ot}const Rt=Ct;Ct=H;const bt=nn&&zt>=0;bt&&(zt=Math.min(1,zt+xt/pn)),bt&&C!=="blend"&&(C="blend",T=0),Z=bt&&zt<1,dt=zt,ut=W.resume,rt=H,It=Rt;const Qt=bt?{phase:$t,speed:kt,moveSpeed:s,localForward:fe,localRight:vt,legLength:n.legLength,stride:N,grounded:!0}:{phase:K.gaitPhase,speed:Mt,moveSpeed:s,localForward:De,localRight:Ye,legLength:n.legLength,stride:K.stride,grounded:!0},jt=bt?Jf(Qt,o,{progress:zt,phase0:$t,phaseEnd:Tt}):lh(Qt,o);let le=0,Ae=0,A=0,Y=0;if(bt){const Ot=ip(K.bodyYaw,Ht,Ut),Xt=sp(zt,$t,Ot.forward,Ot.right,o);Xt.leadLeft?(jt.legL.pitchX-=Xt.leadPitch,jt.legL.kneeX+=Xt.leadKnee,jt.legR.pitchX+=Xt.trailPitch):(jt.legR.pitchX-=Xt.leadPitch,jt.legR.kneeX+=Xt.leadKnee,jt.legL.pitchX+=Xt.trailPitch),Ae=Xt.bodyShift*Xt.fwdN,le=Xt.bodyShift*Xt.rightN,A=Xt.bodyDip,Y=Xt.chestPitch}P.root.rotation.x=jt.legL.pitchX,z.root.rotation.x=jt.legR.pitchX,P.root.rotation.z=jt.legL.rollZ,z.root.rotation.z=jt.legR.rollZ,P.joint.rotation.x=jt.legL.kneeX,z.joint.rotation.x=jt.legR.kneeX,I.root.rotation.x=jt.armL,B.root.rotation.x=jt.armR,I.joint.rotation.x=-.18,B.joint.rotation.x=-.18,d.position.x=jt.pelvisX,d.position.y=v+jt.pelvisY,d.position.z=0,d.rotation.z=jt.pelvisRoll,g.rotation.z=jt.sideLean*(st.intensity>0?.4:1);const tt=up(d,u),et=bt&&h.enabled?{...h,weight:1}:h,$=et.enabled&&et.weight>0?Fn(et.weight,0,1):0;if(d.position.x+=le,d.position.z+=Ae,d.position.y-=A,u.position.y+=A,$<=0&&(u.position.x-=le,u.position.z-=Ae),l){const Ot=Math.max(.004166666666666667,Math.min(xt,.1)),Xt=Math.sin(K.bodyYaw),Bt=Math.cos(K.bodyYaw),re=Fn((K.velocity.x-ot)/Ot,-60,60),xe=Fn((K.velocity.z-Q)/Ot,-60,60),he=re*Xt+xe*Bt,Re=He(K.bodyYaw-q)/Ot,ft=l.maxForwardDeg*Math.PI/180,ct=l.maxSideDeg*Math.PI/180,te=1-Math.exp(-Math.max(0,l.smoothing)*Ot);gt+=(Fn(he*l.accelGain,-ft,ft)-gt)*te,J+=(Fn(-Re*H*l.turnGain,-ct,ct)-J)*te;const se=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;yt+=(Fn(H/Math.max(s,1e-6),0,1)-yt)*(1-Math.exp(-Math.max(0,se)*Ot));const ge=lp({leanForward:gt,leanSide:J,speedRatio:yt},l);g.rotation.x+=gt+Y,g.rotation.z+=J,d.rotation.x+=ge.pelvisPitch,d.rotation.z+=ge.pelvisRoll,d.position.x+=ge.pelvisX,d.position.z+=ge.pelvisZ,d.position.y-=ge.crouch,u.position.y+=ge.crouch*(1-$)}ot=K.velocity.x,Q=K.velocity.z,q=K.bodyYaw,g.rotation.x+=st.upperPitch,g.rotation.z+=st.upperRoll,g.rotation.y+=st.upperYaw;const At=Fn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Pt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Fn(st.upperShiftX*At,-Pt,Pt),g.position.z+=Fn(st.upperShiftZ*At,-Pt,Pt),d.position.x+=st.comX,d.position.z+=st.comZ-st.pelvisBack,d.position.y-=st.drop;const Yt=st.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=st.pelvisBack*(1-Yt),u.position.y+=st.drop*(1-Yt),P.joint.rotation.x+=st.knee,z.joint.rotation.x+=st.knee,P.root.rotation.x-=st.hip,z.root.rotation.x-=st.hip,I.root.rotation.x+=st.arm,B.root.rotation.x+=st.arm*.8,K.attackPhase!=="idle"&&st.intensity===0){const Ot=K.attackProgress,Xt=Ot<.34?-1:Ot<.68?-1+(Ot-.34)/.34*2:Math.max(0,1-(Ot-.68)/.32),Bt=Math.max(0,-Xt),re=Math.max(0,Xt);B.root.rotation.x=-1.7*Bt+1.25*re,B.joint.rotation.x=-(.25+Bt*.45),g.rotation.y=-.28*Xt,D.opacity=K.attackPhase==="active"?.85:0,K.attackPhase==="active"&&(V.rotation.z=-1.1+Ot*3)}else D.opacity=0;const qt=np(Lt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=qt,E.rotation.y=(K.headYaw-K.bodyYaw-qt+Math.PI*3)%(Math.PI*2)-Math.PI,Dt=fp({root:f,pelvis:d,lower:u,limbs:L,base:tt,cfg:et,grounded:!0,attacking:K.attackPhase!=="idle"})},ik(){return Dt},dispose(){f.traverse(K=>{if(K instanceof me){K.geometry.dispose();const xt=K.material;Array.isArray(xt)?xt.forEach(Ft=>Ft.dispose()):xt.dispose()}})}}}const Qi=.012,ta=.016;function lS(n,t){const e=t.lab,i=new Ie;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(v){return o.push(v),v}function c(v){return r.push(v),v}function h(v,_,x,R=Qi){const S=l(new Qe({color:_,transparent:!0,opacity:x,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),w=new me(v,S);return w.rotation.x=-Math.PI/2,w.position.y=R,w.renderOrder=2,w}function f(v,_){return c(new Hs(Math.max(v,.001),_,72))}function d(v,_,x,R=ta){const w=document.createElement("canvas"),E=w.getContext("2d");if(!E)return new me;const M='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=M,w.width=md.ceilPowerOfTwo(Math.ceil(E.measureText(v).width)+32),w.height=md.ceilPowerOfTwo(96*1.4);const b=w.getContext("2d");if(!b)return new me;b.font=M,b.textAlign="center",b.textBaseline="middle",b.fillStyle=x,b.fillText(v,w.width/2,w.height/2);const P=new El(w);P.colorSpace=bn,s.push(P);const z=w.width/w.height,I=c(new Bn(_*z,_)),B=l(new Qe({map:P,transparent:!0,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new me(I,B);return L.rotation.x=-Math.PI/2,L.position.y=R,L.renderOrder=3,L}function u(v,_,x,R,S,w){const E=x-_,M=c(new Bn(E,R)),b=h(M,S,w,Qi);b.position.set(E/2+_,Qi,0);const P=new Ie;return P.add(b),P.rotation.y=v-Math.PI/2,P}function g(v,_,x,R,S){const w=new Xf;w.moveTo(0,_*.5),w.lineTo(-x*.5,_*.5-x*.9),w.lineTo(-x*.18,_*.5-x*.9),w.lineTo(-x*.18,-_*.5),w.lineTo(x*.18,-_*.5),w.lineTo(x*.18,_*.5-x*.9),w.lineTo(x*.5,_*.5-x*.9),w.closePath();const E=c(new rh(w)),M=h(E,R,S,Qi+.002),b=new Ie;return b.add(M),b.rotation.y=v+Math.PI,b}function y(v){var E;const _=new Ie,x=d(`${v.index} · ${v.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((E=x.geometry.parameters)==null?void 0:E.width)??3;_.add(x);const w=h(c(new Bn(S*.98,.08)),v.color,.7,ta);return w.position.set(0,ta,t.lab.labelTextHeight*.66),_.add(w),_.position.set(v.labelX,0,v.labelZ),_}const m=new Ie;for(const v of n??[]){const _=new Ie;if(_.position.set(v.x,0,v.z),v.shape==="square"){const x=v.radius,R=h(c(new Bn(x*2,x*2)),v.color,e.padOpacity*.09);_.add(R);const S=.07,w=[[0,x,x*2+S,S],[0,-x,x*2+S,S],[-x,0,S,x*2+S],[x,0,S,x*2+S]];for(const[E,M,b,P]of w){const z=h(c(new Bn(b,P)),v.color,e.padOpacity);z.position.x=E,z.position.z=M,_.add(z)}}else _.add(h(c(new ih(v.radius,72)),v.color,e.padOpacity*.075)),_.add(h(f(v.radius-.075,v.radius),v.color,e.padOpacity));if(v.id==="hub"){for(let x=0;x<4;x++){const R=x*Math.PI/4,S=x%2===0;for(const w of[0,Math.PI])_.add(u(R+w,v.radius*.12,v.radius*.94,S?.09:.055,v.color,S?.5:.32))}_.add(h(f(.5,.56),v.color,.4))}else if(v.id==="dash"){const x=v.spawnZ-v.z,R=-v.radius+.5,S=x-R,w=h(c(new Bn(.06,S)),v.color,.36);w.position.set(0,Qi,(x+R)/2),_.add(w);let E=0;for(let b=x;b>=R-.01;b-=1,E++){const P=E%5===0,z=h(c(new Bn(P?2.4:1.3,P?.1:.07)),v.color,P?.72:.42);z.position.set(0,Qi,b),_.add(z);const I=d(String(E),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");I.position.set(1.6,ta,b),_.add(I)}const M=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[b,P]of M){const z=x-b,I=h(c(new Bn(1.9,.09)),"#ffffff",.5);I.position.set(-1.5,Qi,z),_.add(I);const B=d(P,.42,"rgba(220, 236, 250, 0.86)");B.position.set(-3,ta,z),_.add(B)}}else if(v.id==="gait"){_.add(h(f(1.44,1.5),v.color,.5)),_.add(h(f(1.14,1.2),v.color,.22));const x=1.55,R=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,w,E]of R){const b=Math.sin(S),P=Math.cos(S),z=g(S,1.7,.34,E,.75);z.position.set(b*1.7*.5,0,x+P*1.7*.5),_.add(z);const I=d(w,.44,E);I.position.set(b*(1.7+.7),ta,x+P*(1.7+.7)),_.add(I)}}if(m.add(_),e.showLabels){const x=y(v);a.push(x),m.add(x)}}i.add(m);const p=n==null?void 0:n.find(v=>v.id==="hub");if(p&&e.showLabels){const v=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,x,R]of v){const S=d(R,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+_*(p.radius+.7),ta,p.z+x*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(v){i.visible=v},setLabelsVisible(v){for(const _ of a)_.visible=v},dispose(){for(const v of r)v.dispose();for(const v of o)v.dispose();for(const v of s)v.dispose();i.clear()}}}const dh=64,pp=[0,.24,.76,1],hS=[0,1,1,0],mp=[0,.12,.28,.5,.72,.88,1],dS=[0,.16,.5,1,.5,.16,0];function Tu(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function uh(n,t,e,i,a=dh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?mp:pp,c=s==="glow"?dS:hS,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/a,v=(p-.5)*e,_=Tu(p,i)*Tu(1-p,i),x=Math.sin(v),R=Math.cos(v);for(let S=0;S<h;S++){const w=o+(r-o)*l[S],E=m*h+S;d[E*3]=x*w,d[E*3+1]=0,d[E*3+2]=R*w;const M=_*c[S];u[E*4]=1,u[E*4+1]=1,u[E*4+2]=1,u[E*4+3]=M}}for(let m=0;m<a;m++)for(let p=0;p<h-1;p++){const v=m*h+p,_=v+h;g.push(v,_,v+1,v+1,_,_+1)}const y=new Je;return y.setAttribute("position",new hn(d,3)),y.setAttribute("color",new hn(u,4)),y.setIndex(g),y.computeBoundingSphere(),y}function bc(n){const t=new Qe({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=uh(n.radius,n.thickness*f,h,n.edgeFade,dh,n.profile??"band");if(e.set(d,g),e.size>64){for(const[y,m]of e)if(y!==d&&m!==i){m.dispose(),e.delete(y);break}}return g};i=a(n.arcRad,1);const s=new me(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=a(l,g),s.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Au(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function uS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:g,level:r}}function fS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function pS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const g=u/e,y=t+(1-t)*g,m=c*a+u;s[m*3]=f*y,s[m*3+1]=0,s[m*3+2]=d*y;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new Je;return l.setAttribute("position",new hn(s,3)),l.setAttribute("color",new hn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Ru(n){const t=n.segments??dh,e=n.profile??"band",a=((e==="glow"?mp.length:pp.length)-1)*6,s=uh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),r=new me(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const g=Math.min(1,Math.max(0,c)),y=Math.round(g*t),m=g>.001?Math.max(1,y)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function Pu(n){const t=new Ie,e=pS(48),i=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),a=new me(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=uh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new Qe({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),l=new me(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,g){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(g*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Cu(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function mS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function gS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function xS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function vS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function _S(n,t,e){return n?t:e}function gp(n){return{x:0,y:0,z:1}}function yS(n){return Math.asin(gp().y)}function MS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const Pl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},bS=1e-6;function zn(n,t,e){return n<t?t:n>e?e:n}function Sc(n,t){const e=Math.max(.2,n);return zn(Math.pow(e,-t),.5,2)}function SS(n,t){if(!t.enabled)return{...Pl};const e=zn(n.swing,-1,1),i=zn(n.charge,0,1),a=zn(n.impact,0,1),s=zn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=zn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const g=1-zn(t.impactSquash,0,.6)*a;u*=g;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*s:1)*(1-zn(t.impactSquash,0,.6)*a*.6),v=zn(t.torsoGain,0,1),_=1+(u-1)*v;return u=zn(u,.6,1.6),{arm:u,leg:zn(p,.6,1.4),torso:zn(_,.7,1.4),girthArm:Sc(u,t.volumeExp),girthLeg:Sc(p,t.volumeExp),girthTorso:Sc(_,t.volumeExp)}}function wS(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function ES(n,t,e){const i=n*Math.exp(-Math.max(bS,e)*Math.max(0,t));return i<.001?0:zn(i,0,1)}const Lu=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function Ja(n,t,e){return n<t?t:n>e?e:n}function Fe(n,t,e){return n+(t-n)*e}function TS(n){return n?typeof n=="string"?{clip:n}:n:null}function AS(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function RS(n,t){const e=n%3*2,i=Lu[e],a=Lu[e+1];return{...AS(),bodyYaw:Fe(i.yaw,a.yaw,t),bodyPitch:Fe(i.pitch,a.pitch,t),bodyRoll:Fe(i.roll,a.roll,t),pelvisX:Fe(i.px,a.px,t),pelvisZ:Fe(i.pz,a.pz,t),armPitch:Fe(i.ap,a.ap,t),armYaw:Fe(i.ay,a.ay,t),armRoll:Fe(i.ar,a.ar,t),elbow:Fe(i.el,a.el,t),bladePitch:Fe(i.blade,a.blade,t)}}function PS(n,t,e,i,a=0){var M,b,P;const s=((M=i.combo)==null?void 0:M[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=TS(s[r]),c=l?((b=i.clips)==null?void 0:b[l.clip])??null:null,h=Ja(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,g=Ja((e+1)/2,0,1),y=c&&c.keys.length>0?C0(c,g):RS(r,g),m=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",v=n==="dual-swords",_=c&&Xi(c,"bladeTwistOff")?y.bladeTwistOff:v?y.bladeTwist:0,x=c&&Xi(c,"bladeYawOff")?y.bladeYawOff:-y.bladeYaw,R={yaw:y.bodyYaw*u,rootYaw:y.rootYaw*u,spinYaw:L0(c,Ja(a,0,1)),pitch:y.bodyPitch*u,roll:y.bodyRoll*u,pelvisZ:y.pelvisZ*u,pelvisX:y.pelvisX*u,armR:null,armL:null,bladePitch:y.bladePitch,bladePitchOff:c&&Xi(c,"bladePitchOff")?y.bladePitchOff:null,bladeTwist:y.bladeTwist,bladeTwistOff:_,bladeYaw:y.bladeYaw,bladeYawOff:x,lead:m,kind:p,strike:g,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:y.armPitch*d,yaw:y.armYaw*d,roll:y.armRoll*d,elbow:y.elbow*d},w=c?Xi(c,"armLPitch")||Xi(c,"armLYaw")||Xi(c,"armLRoll")||Xi(c,"elbowL"):!1,E=w?{pitch:y.armLPitch*d,yaw:y.armLYaw*d,roll:y.armLRoll*d,elbow:y.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return m==="L"?(R.armL=S,R.armR=n==="greatsword"?null:E):(R.armR=S,(n==="greatsword"||n==="dual-swords"||w)&&(R.armL=E)),R}function CS(n,t,e){const i=Ja(e,0,1),a=(s,o)=>s?o?{pitch:Fe(s.pitch,o.pitch,i),yaw:Fe(s.yaw,o.yaw,i),roll:Fe(s.roll,o.roll,i),elbow:Fe(s.elbow,o.elbow,i)}:null:o;return{yaw:Fe(n.yaw,t.yaw,i),rootYaw:Fe(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Fe(n.pitch,t.pitch,i),roll:Fe(n.roll,t.roll,i),pelvisZ:Fe(n.pelvisZ,t.pelvisZ,i),pelvisX:Fe(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Fe(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Fe(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Fe(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Fe(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Fe(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Fe(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Fe(n.strike,t.strike,i),blend:t.blend??null}}function LS(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Du(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function DS(n,t){const e=(a,s)=>Math.abs(LS(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=Du(n.armR,t.armR),i+=Du(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function kS(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=Ja(DS(n,t)/l,0,1);return o+(r-o)*c}function ku(n){const t=Ja(n,0,1);return t*t*(3-2*t)}function ve(n,t,e){return n<t?t:n>e?e:n}const xi=1e-6;function Ge(n,t,e,i){const a=new me(new Qn(n,t,e),new Gs({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function qe(){return new Ie}function Yo(n,t,e){const i=qe(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function IS(n){const t=Yo(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function FS(n){const t=qe(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function zS(n){const t=qe(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ee(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function US(n){const t=qe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function NS(n){const t=qe(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function OS(n,t,e,i,a,s,o,r,l,c,h,f){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},g=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},y=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},m=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},p=qe(),v=qe();v.name="pelvis",v.position.y=n.legLength,p.add(v);const _=qe();_.name="lower";const x=qe();x.name="upper",v.add(_),v.add(x);const R=n.headSize,S=n.legLength,w=n.armLength,E=n.limbThickness,M=n.bodyHeight,b=n.bodyWidth,P=Ge(b,M,.28,t.body);P.position.y=M/2,x.add(P);const z=qe();z.name="headPivot",z.rotation.order="YXZ",z.position.y=Math.min(i.headPivotHeight,M),x.add(z);const I=Ge(R,R,R,t.head);I.position.y=R/2,z.add(I);const B=new Gs({color:"#1b2733"});for(const k of[-1,1]){const j=new me(new Qn(.06,.07,.02),B);j.position.set(k*.09,R/2+.03,R/2+.011),z.add(j)}const L=k=>{const j=qe();j.name=k<0?"hipL":"hipR",j.rotation.order="ZYX",j.position.set(k*(b/2-E/2),0,0),_.add(j);const mt=Ge(E,S/2,E,t.limb);mt.position.y=-S/4,j.add(mt);const _t=qe();_t.name="knee",_t.position.y=-S/2,j.add(_t);const ae=Ge(E,S/2,E,t.limb);ae.position.y=-S/4,_t.add(ae);const Jt=Ge(E*1.15,.07,E*1.7,t.shoe);Jt.position.set(0,-S/2+.035,.045),_t.add(Jt);const _e=new We;_e.name="footTip",_e.position.y=-S/2,_t.add(_e);const Se=qe();return{root:j,joint:_t,hand:Se,wrist:Se,tip:_e,upperMesh:mt,lowerMesh:ae,segLen:S/2}},D=k=>{const j=qe();j.name=k<0?"shoulderL":"shoulderR",j.rotation.order="YXZ",j.position.set(k*(b/2+E/2),M-.04,0),x.add(j);const mt=Ge(E,w/2,E,t.limb);mt.position.y=-w/4,j.add(mt);const _t=qe();_t.name="elbow",_t.position.y=-w/2,j.add(_t);const ae=Ge(E,w/2,E,t.limb);ae.position.y=-w/4,_t.add(ae);const Jt=qe();Jt.name=k<0?"handL":"handR",Jt.position.y=-w/2,_t.add(Jt);const _e=Ge(E*1.1,.09,E*1.1,t.head);_e.position.y=.045,Jt.add(_e);const Se=qe();return Se.name=k<0?"wristL":"wristR",Jt.add(Se),{root:j,joint:_t,hand:Jt,wrist:Se,upperMesh:mt,lowerMesh:ae,segLen:w/2}},V=L(-1),O=L(1),F=D(-1),X=D(1),nt=[V,O].map(k=>({root:k.root,joint:k.joint,tip:k.tip,upperLen:S/2,lowerLen:S/2,bend:1})),at=qe(),ot=qe();at.name="mountR",ot.name="mountL";const Q=qe(),q=qe();Q.name="gripR",q.name="gripL",X.wrist.add(at),F.wrist.add(ot),at.add(Q),ot.add(q);const gt=zS(t),J=US(t),yt=NS(t),Dt={"sword-shield":{right:Yo(.42,.075,t),left:FS(t)},"dual-swords":{right:Yo(.42,.075,t),left:Yo(.42,.075,t)},greatsword:{right:IS(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:gt.g,left:qe(),orb:gt.orb},bow:{right:yt,left:J.g,arrow:yt,drawString:J.drawString}};for(const k of Object.keys(Dt))Q.add(Dt[k].right),q.add(Dt[k].left),Dt[k].right.visible=!1,Dt[k].left.visible=!1;function zt(k,j,mt){const _t=new We;_t.name="bladeBase",_t.position.y=j,k.add(_t);const ae=new We;ae.name="bladeTip",ae.position.y=mt,k.add(ae)}zt(Dt["sword-shield"].right,.44,.55),zt(Dt["dual-swords"].right,.44,.55),zt(Dt["dual-swords"].left,.44,.55),zt(Dt.greatsword.right,.74,.88),zt(Dt.staff.right,.78,.92);let $t=null,Tt=null,kt=1,N=0,fe=0,vt=null,Ht=0,Ut=0,Lt=0,Ct=0,C=0,T=0,Z=aS(),dt={...hh},ut=0,rt=0,It=0,K=-1,xt=0,Ft=0,st=0,St=0,H=0,lt=0,pt=0,Gt=1,Vt=0,Zt=0,U=0,Mt=!1,it=0,ht=0,wt=0,Et=0,Kt="none",ie=0,pe=1,ne=!1,Me=-1,Be=!1,fn=0,ze=0,Te=0,De={...Pl},Ye=0,pn=0,nn={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},W=NaN,Rt=0,bt=0,Qt=0,jt=NaN,le=NaN,Ae=-1,A=null,Y=null,tt=0,et=1,$=.1,At=null,Pt={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Yt=null,qt=null,Ot=null,Xt=null,Bt=null,re=null,xe="R",he=0,Re=0,ft=0,ct=0,te=1,se={speed:0,phase:0},ge={lp:0,lr:0,rp:0,rr:0},Ln=0,Ue=0,Tn=!0,be=0,$e="none",mn=0,Ze=0,an=0,gn=.3,ls=0;function xp(k){const j=Math.PI/180,mt=s;let _t=0,ae=0,Jt=0,_e=0;k==="sword-shield"?(_t=mt.swordPitchDeg*j,Jt=mt.shieldPitchDeg*j):k==="dual-swords"?(_t=mt.swordPitchDeg*j,Jt=mt.swordPitchDeg*j):k==="greatsword"?(_t=mt.greatswordPitchDeg*j,Jt=mt.greatswordPitchDeg*j):k==="staff"?_t=mt.staffPitchDeg*j:Jt=mt.bowPitchDeg*j,at.rotation.set(_t,0,ae),ot.rotation.set(Jt,0,_e),at.position.x=k==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function fh(k){if(k!==$t){$t=k;for(const j of Object.keys(Dt))Dt[j].right.visible=j===k,Dt[j].left.visible=j===k;xp(k),J.drawString.position.z=-.06,yt.position.z=0,gt.orb.scale.setScalar(1),x.rotation.y=0}}fh("sword-shield");const ph=[];p.traverse(k=>{k instanceof me&&k.material instanceof Gs&&ph.push(k.material)});const vp=new ee(r.flashColor);function _p(k,j){const mt=cp(k,j,r);Z=mt,x.rotation.x+=mt.upperPitch,x.rotation.z+=mt.upperRoll,x.rotation.y+=mt.upperYaw;const _t=ve(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ae=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;x.position.x+=ve(mt.upperShiftX*_t,-ae,ae),x.position.z+=ve(mt.upperShiftZ*_t,-ae,ae),v.position.x+=mt.comX,v.position.z+=mt.comZ-mt.pelvisBack,v.position.y-=mt.drop;const Jt=mt.legacy?0:ve(r.lowerScale,0,1);_.position.z+=mt.pelvisBack*(1-Jt),_.position.y+=mt.drop*(1-Jt),V.joint.rotation.x+=mt.knee,O.joint.rotation.x+=mt.knee,V.root.rotation.x-=mt.hip,O.root.rotation.x-=mt.hip,F.root.rotation.x+=mt.arm,X.root.rotation.x+=mt.arm*.8;for(const _e of ph)_e.emissive.copy(vp).multiplyScalar(mt.flash)}function Ys(k){return k<.22?-1:k<.42?-1+(k-.22)/.2*2:k<.5?1:Math.max(0,1-(k-.5)/.5)}function yp(k){for(const j of[F,X])j.upperMesh.scale.set(k.girthArm,k.arm,k.girthArm),j.upperMesh.position.y=-j.segLen/2*k.arm,j.joint.position.y=-j.segLen*k.arm,j.lowerMesh.scale.set(k.girthArm,k.arm,k.girthArm),j.lowerMesh.position.y=-j.segLen/2*k.arm,j.hand.position.y=-j.segLen*k.arm;for(const j of[V,O])j.upperMesh.scale.set(k.girthLeg,k.leg,k.girthLeg),j.upperMesh.position.y=-j.segLen/2*k.leg,j.joint.position.y=-j.segLen*k.leg,j.lowerMesh.scale.set(k.girthLeg,k.leg,k.girthLeg),j.lowerMesh.position.y=-j.segLen/2*k.leg,j.tip.position.y=-j.segLen*k.leg;P.scale.set(k.girthTorso,k.torso,k.girthTorso),P.position.y=M/2*k.torso}function Mp(k,j){const mt=s.twoHandGripY??-.16,_t=Math.max(1,s.twoHandMaxStretch??1.25),ae=w*_t*.99,Jt=F.root.position.x,_e=F.root.position.y,Se=F.root.position.z,Pe=F.root.rotation.y,xn=Math.cos(Pe),Dn=Math.sin(Pe),rn=va=>{const Zs=at.localToWorld(new G(0,va,0)),_n=x.worldToLocal(Zs),_a=_n.x-Jt,yr=_n.y-_e,qs=_n.z-Se,ya={x:_a*xn-qs*Dn,y:yr,z:_a*Dn+qs*xn};return{t:ya,dist:Math.hypot(ya.x,ya.y,ya.z)}};let we=mt,Ne=rn(we);if(!Number.isFinite(Ne.dist)||Ne.dist<=xi)return;for(let va=0;va<18&&Ne.dist>ae;va++)if(we*=.78,Ne=rn(we),!Number.isFinite(Ne.dist)||Ne.dist<=xi)return;Number.isFinite(W)||(W=we);const vn=Math.max(0,s.twoHandSlideRate??9);W+=(we-W)*(1-Math.exp(-vn*j));const Vn=rn(W),Xn=Vn.t,wi=Vn.dist,ti=wi/Math.max(xi,w),di=ve(ti,1,_t),Ei=Math.max(1,s.twoHandGripStart??1.02),pa=Math.max(Ei+.001,_t),ma=ve(s.twoHandMinGrip??1,0,1),Ti=ve((ti-Ei)/(pa-Ei),0,1),ga=1-Ti*Ti*(3-2*Ti)*(1-ma),ei=w/2*di,$s=hp(Xn,ei,ei,-1),Gi=dp({rootPitch:F.root.rotation.x,rootRoll:F.root.rotation.z,jointPitch:F.joint.rotation.x},$s,ve(k*ga,0,1),Math.PI);F.root.rotation.x=Gi.rootPitch,F.root.rotation.z=Gi.rootRoll,F.joint.rotation.x=Math.min(Gi.jointPitch,-.06);const xa=1/Math.sqrt(di);F.upperMesh.scale.set(xa,di,xa),F.upperMesh.position.y=-ei/2,F.joint.position.y=-ei,F.lowerMesh.scale.set(xa,di,xa),F.lowerMesh.position.y=-ei/2,F.hand.position.y=-ei,nn={active:!0,dist:wi,gy:W,pitch:Gi.rootPitch,joint:F.joint.rotation.x,grip:ga}}function bp(k,j){if(!u.enabled){Rt=0,bt=0,X.wrist.rotation.set(0,0,0),jt=X.root.rotation.x,le=x.rotation.y;return}const mt=X.root.rotation.x,_t=x.rotation.y;if(j!==Ae){Ae=j,jt=mt,le=_t,X.wrist.rotation.set(Rt,0,bt);return}if(!Number.isFinite(jt)||k<=1e-5){jt=mt,le=_t,X.wrist.rotation.set(Rt,0,bt);return}const ae=(mt-jt)/k,Jt=He(_t-le)/k;jt=mt,le=_t;const _e=Math.max(0,u.maxAngle),Se=Math.max(0,u.maxTwist),Pe=.15+.85*ve(Re,0,1),Dn=-ve(Qt,0,1.4)*Math.max(0,u.runDrag),rn=ve(-ae*u.lag*Pe+Dn,-_e,_e),we=ve(Jt*u.twistLag*Pe,-Se,Se),Ne=1-Math.exp(-Math.max(0,u.rate)*k);Rt+=(rn-Rt)*Ne,bt+=(we-bt)*Ne,X.wrist.rotation.set(Rt,0,bt)}function Sp(k){const j=Math.PI/180;return k==="greatsword"?s.greatswordPitchDeg*j:k==="staff"?s.staffPitchDeg*j:k==="bow"?s.bowPitchDeg*j:s.swordPitchDeg*j}function vr(k){const j=Math.PI/180;return k==="sword-shield"?s.shieldPitchDeg*j:k==="greatsword"?s.greatswordPitchDeg*j:k==="bow"?s.bowPitchDeg*j:s.swordPitchDeg*j}function wp(k){const j=Math.PI/180;return k==="sword-shield"||k==="dual-swords"?(s.swordCantDeg??0)*j:k==="greatsword"?(s.greatswordCantDeg??0)*j:0}function Ep(k,j){const mt=k.weapon;if(mt==="staff"||mt==="bow")return;const _t=xe==="R",ae=_t?X:F,Jt=_t?at:ot,_e=_t?F:X,Se=_t?ot:at,Pe=mt==="greatsword"&&_t?T:0,xn=mt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,Dn=Math.PI/180,rn=-xn*Dn,we=xn*Dn,Ne=(Ti,ga)=>{const ei=Math.max(0,Math.PI/2-Math.abs(ga));return Math.sign(Ti)*Math.min(Math.abs(Ti),ei)},vn=(Yt??Sp(mt)+N)+Pe,Vn=j+ae.root.rotation.x+ae.joint.rotation.x;Jt.rotation.set(Math.PI/2-vn-Vn,0,Ne(_t?rn:we,vn));const Xn=qt??(mt==="sword-shield"?null:vr(mt)+fe),wi=j+_e.root.rotation.x+_e.joint.rotation.x;mt==="sword-shield"?Se.rotation.x=Xn===null?vr(mt):vr(mt)-Xn-wi:Se.rotation.set(Math.PI/2-(Xn??0)-wi,0,Ne(_t?we:rn,Xn??0));const ti=wp(mt),di=Bt??0,Ei=re??0,pa=Ot??0,ma=Xt??0;_t?(Q.rotation.z=-ti+di,Q.rotation.y=pa,q.rotation.z=ti+Ei,q.rotation.y=ma):(q.rotation.z=ti+di,q.rotation.y=pa,Q.rotation.z=-ti+Ei,Q.rotation.y=ma)}function mh(k){Yt=k.bladePitch,qt=k.bladePitchOff,Ot=k.bladeTwist,Xt=k.bladeTwistOff,Bt=k.bladeYaw,re=k.bladeYawOff,xe=k.lead,he=k.rootYaw+k.spinYaw,p.rotation.y=he,x.rotation.y+=k.yaw,x.rotation.x+=k.pitch,x.rotation.z+=k.roll,v.position.z+=k.pelvisZ,v.position.x+=k.pelvisX,k.armR&&(X.root.rotation.x=k.armR.pitch,X.root.rotation.y=k.armR.yaw,X.root.rotation.z=k.armR.roll,X.joint.rotation.x=k.armR.elbow),k.armL&&(F.root.rotation.x=k.armL.pitch,F.root.rotation.y=k.armL.yaw,F.root.rotation.z=k.armL.roll,F.joint.rotation.x=k.armL.elbow)}function gh(k,j){const mt=At??Ys(k.attackProgress),_t=PS(k.weapon,k.comboIndex,mt,m,k.attackProgress);if(k.comboIndex!==tt){Y=A,et=0,tt=k.comboIndex;const _e=k.timings.windup+k.timings.active+k.timings.recovery,Se=Math.max(m.segBlendMin??.03,_e*.22);$=kS(Y,_t,m,_t.blend??null,Se)}const ae=Math.max(.008,$);et=Math.min(1,et+j/ae);const Jt=Y&&et<1?CS(Y,_t,ku(et)):_t;return A=Jt,Jt}function Tp(k,j){const mt=b/2+E/2,_t=M-.04;if(!m.enabled){F.root.position.set(-mt,_t,0),X.root.position.set(mt,_t,0),Pt={lx:-mt,ly:_t,lz:0,rx:mt,ry:_t,rz:0};return}const ae=Math.max(0,m.shoulderLift),Jt=Math.max(0,m.shoulderPush),_e=k&&j==="greatsword"?Math.max(0,m.shoulderIn):0,Se=Vn=>ae*ve((-Vn-.5)/1.45,0,1),Pe=Vn=>Jt*ve((-Vn-.2)/1.9,0,1),xn=-mt+_e,Dn=_t+Se(F.root.rotation.x),rn=Pe(F.root.rotation.x),we=mt-_e,Ne=_t+Se(X.root.rotation.x),vn=Pe(X.root.rotation.x);F.root.position.set(xn,Dn,rn),X.root.position.set(we,Ne,vn),Pt={lx:xn,ly:Dn,lz:rn,rx:we,ry:Ne,rz:vn}}function Ap(k){if(k.phase==="idle"||k.charging)return;const j=k.attackProgress,mt=Ys(j),_t=Math.max(0,mt),ae=k.comboIndex%2===0?1:-1,Jt=l.stride,_e=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,Se=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,Pe=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,xn=k.weapon==="greatsword"?ve(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;v.position.z+=_e*_t*xn,v.position.x+=ae*Se*_t*xn,v.position.y-=Pe*Math.sin(Math.PI*j)*xn}let xh=null;function Rp(){xh={upperX:x.rotation.x,upperY:x.rotation.y,upperZ:x.rotation.z,upperPX:x.position.x,upperPZ:x.position.z,pelvisX:v.position.x,pelvisY:v.position.y,pelvisZ:v.position.z,pelvisRX:v.rotation.x,pelvisRZ:v.rotation.z,lrx:F.root.rotation.x,lry:F.root.rotation.y,lrz:F.root.rotation.z,lj:F.joint.rotation.x,rrx:X.root.rotation.x,rry:X.root.rotation.y,rrz:X.root.rotation.z,rj:X.joint.rotation.x,rootY:p.rotation.y}}function Pp(k){const j=xh;if(!j)return;const mt=ku(ve(k,0,1));if(mt>=1)return;const _t=(ae,Jt)=>ae+(Jt-ae)*mt;x.rotation.x=_t(j.upperX,x.rotation.x),x.rotation.y=_t(j.upperY,x.rotation.y),x.rotation.z=_t(j.upperZ,x.rotation.z),x.position.x=_t(j.upperPX,x.position.x),x.position.z=_t(j.upperPZ,x.position.z),v.position.x=_t(j.pelvisX,v.position.x),v.position.y=_t(j.pelvisY,v.position.y),v.position.z=_t(j.pelvisZ,v.position.z),v.rotation.x=_t(j.pelvisRX,v.rotation.x),v.rotation.z=_t(j.pelvisRZ,v.rotation.z),F.root.rotation.x=_t(j.lrx,F.root.rotation.x),F.root.rotation.y=_t(j.lry,F.root.rotation.y),F.root.rotation.z=_t(j.lrz,F.root.rotation.z),F.joint.rotation.x=_t(j.lj,F.joint.rotation.x),X.root.rotation.x=_t(j.rrx,X.root.rotation.x),X.root.rotation.y=_t(j.rry,X.root.rotation.y),X.root.rotation.z=_t(j.rrz,X.root.rotation.z),X.joint.rotation.x=_t(j.rj,X.joint.rotation.x),p.rotation.y=j.rootY+He(p.rotation.y-j.rootY)*mt,he=p.rotation.y}function Cp(k,j){if(J.drawString.position.z=-.06,yt.position.z=0,gt.orb.scale.setScalar(1),x.rotation.y=0,k.charging&&k.weapon==="bow"){const Jt=k.charge;F.root.rotation.x=-1.25,F.joint.rotation.x=-.15,X.root.rotation.x=.35+Jt*.3,X.joint.rotation.x=-1.15,J.drawString.position.z=-.06-Jt*.22,yt.position.z=-Jt*.3,x.rotation.y=-.22;return}if(k.phase==="idle"&&ft<=.001){Y=null,A=null,tt=0,et=1,$=Math.max(.008,m.segBlend),Yt=null,qt=null,Ot=null,Xt=null,Bt=null,re=null,W=NaN,k.weapon==="greatsword"&&(at.position.x=-Math.max(0,s.twoHandInsetX??0));return}const mt=Ys(k.attackProgress),_t=Math.max(0,-mt),ae=Math.max(0,mt);if(k.weapon==="bow")F.root.rotation.x=-1.2,F.joint.rotation.x=-.15,X.root.rotation.x=.9-ae*.8,X.joint.rotation.x=-.3;else if(k.weapon==="greatsword")if(m.enabled)mh(gh(k,j));else{const Jt=-1.6*_t+1.25*ae,_e=ve(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);X.root.rotation.x=Jt,X.joint.rotation.x=-(.25+_t*.4),F.root.rotation.x=Jt+.06,F.joint.rotation.x=-(.32+_t*.4),F.root.rotation.z=.42,X.root.rotation.z=0;const Se=-Math.sin(X.root.rotation.x);X.root.rotation.y=-.72*Math.tanh(Se*4),x.rotation.y=-.2*mt*_e}else if(m.enabled)mh(gh(k,j));else{const Jt=k.comboIndex;if(Jt===1)X.root.rotation.x=-1.7*_t+1.1*ae,X.joint.rotation.x=-(.2+_t*.5),F.root.rotation.x=.1,x.rotation.y=-.18*mt;else if(Jt===2)F.root.rotation.x=-1.5*_t+1*ae,F.joint.rotation.x=-(.2+_t*.5),X.root.rotation.x=.2,x.rotation.y=.45*-mt;else{const _e=-1.9*_t+1.2*ae;F.root.rotation.x=_e,X.root.rotation.x=_e,F.joint.rotation.x=-(.15+_t*.4),X.joint.rotation.x=-(.15+_t*.4),x.rotation.y=-.3*mt}}if(k.weapon==="greatsword"){const Jt=ve((-X.root.rotation.x-1.3)/1.2,0,1);at.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}Ap(k)}function Lp(k,j){k&&(X.root.rotation.x=-1.05,X.joint.rotation.x=-.35,F.root.rotation.x=-.45,F.joint.rotation.x=-.2,x.rotation.y=-.12,gt.orb.scale.setScalar(1.25+.12*Math.sin(j*2)))}function Dp(k){if(!k||k.phase==="idle")return;const j=k.progress,mt=j<.3?-.35+j/.3*1.35:j<.7?1:Math.max(0,1-(j-.7)/.3),_t=Math.PI/180;x.rotation.x+=g.leanDeg*_t*mt,F.root.rotation.x-=g.shieldPitchDeg*_t*mt,F.joint.rotation.x-=.22*mt,X.root.rotation.x-=.3*mt,v.position.z+=g.pelvisReach*Math.max(0,mt)}function _r(k){if(!k)return null;const j=k.getObjectByName("bladeBase"),mt=k.getObjectByName("bladeTip");if(!j||!mt)return null;k.updateWorldMatrix(!0,!1);const _t=j.getWorldPosition(new G),ae=mt.getWorldPosition(new G),Jt=new G().setFromMatrixColumn(k.matrixWorld,0).normalize();return{base:{x:_t.x,y:_t.y,z:_t.z},tip:{x:ae.x,y:ae.y,z:ae.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:p,update(k,j,mt,_t,ae=!1,Jt,_e,Se){var Ph;fh(j.weapon),p.rotation.y=0,he=0,x.rotation.x=0,x.rotation.z=0,v.position.x=0,v.position.y=S,v.position.z=0,v.rotation.z=0,v.rotation.x=0,x.position.x=0,x.position.y=0,x.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const Pe=Math.max(1/240,Math.min(_t,.1));vt=((Ph=l.stance)==null?void 0:Ph[j.weapon])??null,Tt!==j.weapon&&(Tt=j.weapon,kt=vt?0:1);const xn=Math.max(.01,(vt==null?void 0:vt.blend)??.22);kt=Math.min(1,kt+Pe/xn);const Dn=vt?kt:0;N=((vt==null?void 0:vt.bladePitchDeg)??0)*Math.PI/180*Dn,fe=((vt==null?void 0:vt.bladePitchOffDeg)??0)*Math.PI/180*Dn;const rn=Jt===void 0?Ln+=_t:Jt;Ue=rn;const we=l.landing;we.enabled?Tn&&!k.grounded?($e="jump",mn=rn,Ze=we.anticipationDuration,an=Math.max(0,we.jumpAnticipation),gn=.32):!Tn&&k.grounded&&($e="land",mn=rn,Ze=we.duration,an=iS(be,we),gn=we.compressRatio,ls=be):($e="none",an=0),rn<mn&&($e="none",an=0),Tn=k.grounded,be=k.velocity.y;const Ne=Eu(rn,mn,Ze,an,gn),vn=j.phase!=="idle",Vn=(Se==null?void 0:Se.phase)==="active";Re=tS(Re,vn,Pe,l.attack.blendRate);const Xn=eS(Re,l.attack.gaitWeight,l.attack.lowerBodyWeight);ct=Xn.attackLegWeight,te=Xn.gaitScale;const wi=Math.sin(k.bodyYaw),ti=Math.cos(k.bodyYaw),di=(k.velocity.x-Ht)/Pe,Ei=(k.velocity.z-Ut)/Pe,pa=ve(di,-60,60),ma=ve(Ei,-60,60),Ti=pa*wi+ma*ti,ga=He(k.bodyYaw-Lt)/Pe,ei=Math.hypot(k.velocity.x,k.velocity.z),$s=o.maxForwardDeg*Math.PI/180,Gi=o.maxSideDeg*Math.PI/180,xa=ve(Ti*o.accelGain,-$s,$s),va=ve(-ga*ei*o.turnGain,-Gi,Gi),Zs=1-Math.exp(-o.smoothing*Pe);Ct+=(xa-Ct)*Zs,C+=(va-C)*Zs,Ht=k.velocity.x,Ut=k.velocity.z,Lt=k.bodyYaw;const _n=Math.hypot(k.velocity.x,k.velocity.z),_a=ve(a.knockGaitScale??0,0,1),yr=mt.knockX*_a,qs=mt.knockZ*_a,ya=_a>0&&Math.hypot(mt.knockX,mt.knockZ)>.001,Mr=k.velocity.x+yr,br=k.velocity.z+qs,vh=Math.hypot(Mr,br);Et=vh;const kp=Math.cos(k.bodyYaw),Ip=-Math.sin(k.bodyYaw),Fp=k.velocity.x*kp+k.velocity.z*Ip,_h=_n>xi?ve(Fp/_n,-1,1):0,yh=_n>xi?ve((k.velocity.x*wi+k.velocity.z*ti)/_n,-1,1):1,zp=ch(yh,a.backStrafeStartDeg,a.backStrafeFullDeg);Kt==="settled"&&Be&&fn>ze*1.02+1e-4&&(Kt="none");let hs=1;Kt==="blend"?(hs=ap(ne?Me:ie,a.stopYawBlendMode,ne),ne||(ie=Math.min(1,ie+Pe/Math.max(.01,a.stopYawAfterSec)),(ie>=1||a.stopYawBlendMode==="inStop"||Be)&&(Kt="settled",hs=0))):Kt==="settled"&&(hs=ve(_n/Math.max(xi,a.stopEnterRatio*e),0,1)),pe=hs;const Up=Qf(_h,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Np=tp(yh,_h,Up,zp)*hs;rt+=(Np-rt)*(1-Math.exp(-i.hipYawSmoothing*Pe));const ds=k.bodyYaw+rt;It=ds;const Op=Math.sin(ds),Bp=Math.cos(ds),Hp=Math.cos(ds),Gp=-Math.sin(ds),js={speed:vh,phase:k.gaitPhase,localForward:Mr*Op+br*Bp,localRight:Mr*Hp+br*Gp,stride:k.stride};vn&&!Mt&&(U=k.gaitPhase),Mt=vn;const Ma=Re>0?J1(js,j.attackProgress,j.comboIndex,Re,l.stride,U):js;se=Ma;const Mh=Math.max(0,a.stopBlendSec||0),bh=Mh>0&&!vn&&!ya&&k.grounded,Sr=ep(_n,Vt,e,a.stopEnterRatio,a.stopExitRatio);if(!bh||Sr.resume)K=-1;else if(K<0&&Sr.enter){K=0,xt=k.gaitPhase,Ft=Kf(k.gaitPhase),st=_n,St=Math.max(k.stride,xi),H=js.localForward,lt=js.localRight;const oe=1/Math.max(xi,_n);pt=k.velocity.x*oe,Gt=k.velocity.z*oe}const Vp=Vt;Vt=_n;const Vi=bh&&K>=0;Vi&&(K=Math.min(1,K+Pe/Mh)),Vi&&Kt!=="blend"&&(Kt="blend",ie=0),ne=Vi&&K<1,Me=K,Be=Sr.resume,fn=_n,ze=Vp;const Sh=Vi?{phase:xt,speed:st,moveSpeed:e,localForward:H,localRight:lt,legLength:n.legLength,stride:St,grounded:!0}:{phase:Ma.phase,speed:Ma.speed,moveSpeed:e,localForward:Ma.localForward,localRight:Ma.localRight,legLength:n.legLength,stride:Ma.stride??0,grounded:k.grounded},Xp=Vi?Jf(Sh,a,{progress:K,phase0:xt,phaseEnd:Ft}):lh(Sh,a),Ce=nS(Xp,Xn.gaitScale);if(Te=0,Vn&&Se){const oe=q1(Se.progress,Se.dir,a),ce=Xn.gaitScale;Ce.legL.pitchX+=oe.legL.pitchX*ce,Ce.legL.rollZ+=oe.legL.rollZ*ce,Ce.legL.kneeX+=oe.legL.kneeX*ce,Ce.legR.pitchX+=oe.legR.pitchX*ce,Ce.legR.rollZ+=oe.legR.rollZ*ce,Ce.legR.kneeX+=oe.legR.kneeX*ce,Ce.pelvisY+=oe.pelvisY*ce,Te=oe.env}let wr=0,Er=0,Tr=0,wh=0;if(Vi){const oe=ip(k.bodyYaw,pt,Gt),ce=sp(K,xt,oe.forward,oe.right,a);ce.leadLeft?(Ce.legL.pitchX-=ce.leadPitch,Ce.legL.kneeX+=ce.leadKnee,Ce.legR.pitchX+=ce.trailPitch):(Ce.legR.pitchX-=ce.leadPitch,Ce.legR.kneeX+=ce.leadKnee,Ce.legL.pitchX+=ce.trailPitch),Er=ce.bodyShift*ce.fwdN,wr=ce.bodyShift*ce.rightN,Tr=ce.bodyDip,wh=ce.chestPitch,it=ce.leadPitch,ht=ce.bodyShift,wt=ce.bodyDip}else it=0,ht=0,wt=0;if(ge={lp:Ce.legL.pitchX,lr:Ce.legL.rollZ,rp:Ce.legR.pitchX,rr:Ce.legR.rollZ},!k.grounded)V.root.rotation.x=-.55,O.root.rotation.x=-.25,V.joint.rotation.x=.75,O.joint.rotation.x=.55,F.root.rotation.x=-.9,X.root.rotation.x=-.7,F.joint.rotation.x=-.6,X.joint.rotation.x=-.6,V.root.rotation.z=0,O.root.rotation.z=0;else{V.root.rotation.x=Ce.legL.pitchX,O.root.rotation.x=Ce.legR.pitchX,V.root.rotation.z=Ce.legL.rollZ,O.root.rotation.z=Ce.legR.rollZ,V.joint.rotation.x=Ce.legL.kneeX,O.joint.rotation.x=Ce.legR.kneeX;const oe=vt?kt:0,ce=1+(((vt==null?void 0:vt.armSwing)??1)-1)*oe,An=vt==null?void 0:vt.armR,Nn=vt==null?void 0:vt.armL,Ch=Ce.armL*ce+((Nn==null?void 0:Nn.pitch)??0)*oe,Lh=Ce.armR*ce+((An==null?void 0:An.pitch)??0)*oe;F.root.rotation.x=Ch,X.root.rotation.x=Lh,F.joint.rotation.x=-(.18+Ch*.2)+((Nn==null?void 0:Nn.elbow)??0)*oe,X.joint.rotation.x=-(.18+Lh*.2)+((An==null?void 0:An.elbow)??0)*oe,F.root.rotation.z=((Nn==null?void 0:Nn.roll)??0)*oe,X.root.rotation.z=((An==null?void 0:An.roll)??0)*oe,F.root.rotation.y=((Nn==null?void 0:Nn.yaw)??0)*oe,X.root.rotation.y=((An==null?void 0:An.yaw)??0)*oe,v.position.x=Ce.pelvisX,v.position.y=S+Ce.pelvisY,v.position.z=0,v.rotation.z=Ce.pelvisRoll}const Wp=up(v,_),us=Vn?{...d,weight:0}:Vi&&d.enabled?{...d,weight:1}:d,Eh=us.enabled&&k.grounded&&us.weight>0?ve(us.weight,0,1)*(vn?ve(us.attackScale,0,1):1):0;v.position.x+=wr,v.position.z+=Er,v.position.y-=Tr,_.position.y+=Tr,Eh<=0&&(_.position.x-=wr,_.position.z-=Er);const Ar=_n/Math.max(e,xi);Qt=Ar;const Yp=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,$p=1-Math.exp(-Math.max(0,Yp)*Pe);ut+=(ve(Ar,0,1)-ut)*$p;const ba=lp({leanForward:Ct,leanSide:C,speedRatio:ut},o);v.rotation.x+=ba.pelvisPitch,v.rotation.z+=ba.pelvisRoll,v.position.x+=ba.pelvisX,v.position.z+=ba.pelvisZ,v.position.y-=ba.crouch,_.position.y+=ba.crouch*(1-ve(Eh,0,1));const Th=j.phase!=="idle"||j.charging&&j.weapon==="bow",Rr=Th?1:0,Zp=Math.max(.001,Rr>ft?m.poseIn??.1:m.poseOut??.16);if(ft!==Rr){const oe=Pe/Zp;ft=ve(ft+(Rr>ft?oe:-oe),0,1)}if((ft>0||Th)&&Rp(),Cp(j,Pe),ft>0&&ft<1&&Pp(ft),vt){const oe=(1-ft)*kt;x.rotation.y+=(vt.torsoYaw??0)*oe,x.rotation.x+=(vt.torsoPitch??0)*oe}Lp(ae,k.gaitPhase),Dp(_e);const qp=j.weapon==="greatsword",Ah=Math.hypot(k.velocity.x,k.velocity.z),jp=qp&&j.phase==="idle"&&Ah>.5?Math.min(1.15,Ah/Math.max(e,.001)*.9):0;T+=(jp-T)*(1-Math.exp(-6*Pe));const Kp=x.rotation.x;j.weapon==="bow"&&(J.g.rotation.x=-(F.root.rotation.x+F.joint.rotation.x),yt.rotation.x=-(X.root.rotation.x+X.joint.rotation.x));const Jp=x.rotation.y;_p(mt,k.bodyYaw);const Rh=mt.type==="none"?1:.4;if(x.rotation.x+=Ct*Rh+wh,x.rotation.z+=(C+Ce.sideLean)*Rh,Ne>0&&(V.root.rotation.x-=we.hipPitch*Ne,O.root.rotation.x-=we.hipPitch*Ne,V.joint.rotation.x+=we.kneeBend*Ne,O.joint.rotation.x+=we.kneeBend*Ne,v.position.y-=we.crouchDepth*Ne,_.position.y+=we.crouchDepth*(1-we.lowerScale)*Ne,x.rotation.x+=we.upperPitch*Ne,F.root.rotation.x-=we.armTuck*Ne,X.root.rotation.x-=we.armTuck*Ne),ct>0&&k.grounded){const oe=Q1(j.attackProgress,j.comboIndex,l.stride),ce=ct;V.root.rotation.x+=oe.legL.pitchX*ce,O.root.rotation.x+=oe.legR.pitchX*ce,V.root.rotation.z+=oe.legL.rollZ*ce,O.root.rotation.z+=oe.legR.rollZ*ce,V.joint.rotation.x+=oe.legL.kneeX*ce,O.joint.rotation.x+=oe.legR.kneeX*ce,v.position.x+=oe.pelvisX*ce,v.position.y+=oe.pelvisY*ce,v.rotation.z+=oe.pelvisRoll*ce}if(Tp(vn,j.weapon),y.enabled){const oe=j.phase!=="idle"&&!j.charging,ce=oe?Ys(j.attackProgress):0;oe&&pn>.55&&ce<pn-1e-4&&(Ye=1),pn=ce,Ye=ES(Ye,Pe,y.impactDecay);const An=SS({swing:ce,charge:j.charging?j.charge:0,impact:Ye,speedRatio:Ar,grounded:k.grounded},y);De=wS(De,An,Pe,y.smoothing)}else De={...Pl};yp(De),_.rotation.y=rt,Zt=np(rt,a.chestYawScale,a.chestYawMaxDeg),x.rotation.y+=Zt;const Qp=Jp;if(z.rotation.y=He(k.headYaw-k.bodyYaw-Qp-Zt),z.rotation.x=-ve(k.headPitch??0,-.7,.7),x.rotation.x+=-ve(k.bodyPitch??0,-.4,.4),bp(_t,j.comboIndex),Ep(j,Kp),j.weapon==="greatsword"&&!j.charging&&(j.phase!=="idle"||ft>0)){p.updateWorldMatrix(!0,!0);const oe=j.phase==="idle"?Math.max(ft,Re):1;Mp(ve(oe,0,1),Pe)}dt=fp({root:p,pelvis:v,lower:_,limbs:nt,base:Wp,cfg:us,grounded:k.grounded,attacking:vn})},lean(){return{forward:Ct,side:C}},landing(){const k=Eu(Ue,mn,Ze,an,gn),j=Ze>0?Math.max(0,Ze-Math.max(0,Ue-mn)):0;return{pulse:k,remaining:j,kind:k>0?$e:"none",impactVy:ls}},hurt(){return Z},ik(){return dt},stretch(){return{...De,impact:Ye}},gripDebug(){return{...nn}},weaponDebug(){return{wristPitch:Rt,wristTwist:bt}},setClipT(k){At=k===null||!Number.isFinite(k)?null:Math.max(0,Math.min(1,k))},stanceDebug(){const k=vt==null?void 0:vt.armR,j=vt==null?void 0:vt.armL,mt=vt?kt:0;return{weapon:$t??"sword-shield",weight:mt,armL:{pitch:((j==null?void 0:j.pitch)??0)*mt,yaw:((j==null?void 0:j.yaw)??0)*mt,roll:((j==null?void 0:j.roll)??0)*mt,elbow:((j==null?void 0:j.elbow)??0)*mt},armR:{pitch:((k==null?void 0:k.pitch)??0)*mt,yaw:((k==null?void 0:k.yaw)??0)*mt,roll:((k==null?void 0:k.roll)??0)*mt,elbow:((k==null?void 0:k.elbow)??0)*mt},torsoYaw:((vt==null?void 0:vt.torsoYaw)??0)*mt,torsoPitch:((vt==null?void 0:vt.torsoPitch)??0)*mt,bladePitchDeg:N*180/Math.PI,bladePitchOffDeg:fe*180/Math.PI,armSwing:(vt==null?void 0:vt.armSwing)??1}},swingDebug(){const k=A;return{seg:tt,kind:(k==null?void 0:k.kind)??"right-left",lead:(k==null?void 0:k.lead)??"R",yaw:(k==null?void 0:k.yaw)??0,rootYaw:(k==null?void 0:k.rootYaw)??0,spinYaw:(k==null?void 0:k.spinYaw)??0,rootTurn:he,pitch:(k==null?void 0:k.pitch)??0,roll:(k==null?void 0:k.roll)??0,strike:(k==null?void 0:k.strike)??0,bladeTwist:(k==null?void 0:k.bladeTwist)??0,bladeTwistOff:(k==null?void 0:k.bladeTwistOff)??0,bladeYaw:(k==null?void 0:k.bladeYaw)??0,bladeYawOff:(k==null?void 0:k.bladeYawOff)??0,shoulderL:{x:Pt.lx,y:Pt.ly,z:Pt.lz},shoulderR:{x:Pt.rx,y:Pt.ry,z:Pt.rz}}},attackBlend(){return Re},attackWeights(){return{gaitScale:te,attackLegWeight:ct,driveSpeed:se.speed,stridePhase:se.phase}},hipYaw(){return rt},gaitDebug(){return{stopT:K,hipYaw:rt,chestYaw:Zt,speed:Vt,gaitSpeed:Et,stopStep:it,stopShift:ht,stopDip:wt,stopYawFade:pe,turnStep:Te,legLPitch:ge.lp,legLRoll:ge.lr,legRPitch:ge.rp,legRRoll:ge.rr}},gaitYaw(){return It},arrowDirection(){yt.updateWorldMatrix(!0,!1);const k=yt.matrixWorld.elements,j=k[8],mt=k[9],_t=k[10],ae=Math.hypot(j,mt,_t)||1;return{x:j/ae,y:mt/ae,z:_t/ae}},weaponBlade(){return $t?_r(Dt[$t].right):null},bladesWorld(){return $t?{right:_r(Dt[$t].right),left:_r(Dt[$t].left)}:{right:null,left:null}},dispose(){p.traverse(k=>{if(k instanceof me){k.geometry.dispose();const j=k.material;Array.isArray(j)?j.forEach(mt=>mt.dispose()):j.dispose()}})}}}function BS(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Je,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new hn(i,3),o=new hn(a,3);s.setUsage(ud),o.setUsage(ud),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let _=0;_<t-1;_++){const x=_*2,R=x+1,S=x+2,w=x+3;r.push(x,R,S,R,w,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new Qe({vertexColors:!0,transparent:!0,opacity:1,blending:ki,depthWrite:!1,side:Ve}),c=new me(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ee(n.color);let f=[],d=null,u=0,g=0,y=!1,m=!1,p=0;function v(){const _=f.length;if(_<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const x=Math.max(.001,n.life);for(let R=0;R<_;R++){const S=f[R],w=Math.max(0,1-S.age/x),E=w*w,M=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*E*(.55+.45*M)*(1+p),P=.18+.82*w,z=R*6;i[z]=S.tx+(S.bx-S.tx)*P,i[z+1]=S.ty+(S.by-S.ty)*P,i[z+2]=S.tz+(S.bz-S.tz)*P,i[z+3]=S.tx,i[z+4]=S.ty,i[z+5]=S.tz;const I=h.r*b,B=h.g*b,L=h.b*b,D=I*.22,V=B*.22,O=L*.22;a[z]=D,a[z+1]=V,a[z+2]=O;const F=1+n.tipBoost;a[z+3]=Math.min(1,I*F),a[z+4]=Math.min(1,B*F),a[z+5]=Math.min(1,L*F)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(_-1)*6),c.visible=!0}return{object:c,update(_,x,R){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,_);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const w of f)w.age+=S;for(;f.length>0&&f[0].age>n.life;)f.shift();if(x){const w=d?Math.hypot(x.tip.x-d.x,x.tip.y-d.y,x.tip.z-d.z)/Math.max(1e-4,S):0,E=f[f.length-1],M=E?Math.hypot(x.tip.x-E.tx,x.tip.y-E.ty,x.tip.z-E.tz):1/0;if(R&&M>=n.minStep)for(f.push({bx:x.base.x,by:x.base.y,bz:x.base.z,tx:x.tip.x,ty:x.tip.y,tz:x.tip.z,age:0,speed:w});f.length>t;)f.shift();d={x:x.tip.x,y:x.tip.y,z:x.tip.z},u=w,g=M,y=!0}else d=null,y=!1,u=0,g=0;m=R,v()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:g,hasBlade:y,active:m,pulse:p}},pulse(_){!Number.isFinite(_)||_<=0||(p=Math.min(1.5,p+_))},reset(){f=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function HS(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function GS(n,t,e,i){var nn;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new a1({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=cf,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new s1;r.background=new ee("#12161d"),r.add(new B1(11061486,2764600,1.15));const l=new V1(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Ie;for(const W of t.boxes){const Rt=W.maxX-W.minX,bt=W.maxY-W.minY,Qt=W.maxZ-W.minZ;let jt=HS(W.kind,e);W.kind==="step"&&(jt=new ee(jt).offsetHSL(0,0,W.maxY*.09).getStyle());const le=new Gs({color:jt,transparent:!0,opacity:1}),Ae=new me(new Qn(Rt,bt,Qt),le);Ae.position.set((W.minX+W.maxX)/2,(W.minY+W.maxY)/2,(W.minZ+W.maxZ)/2),Ae.castShadow=W.kind!=="ground",Ae.receiveShadow=!0,Ae.add(new Of(new M1(Ae.geometry),new th({color:10467020,transparent:!0,opacity:.32}))),f.add(Ae),h.push(le)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new W1(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const g=lS(i,e);r.add(g.group);const y=W=>OS((W==null?void 0:W.voxel)??e.voxel,W!=null&&W.colors?{...e.colors,...W.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist);let m="standard",p=y((nn=e.bodyTypes)==null?void 0:nn[m]);const v=BS(e.weaponTrail);r.add(v.object);const _=new Ie,x=.9,R=new Ie;R.position.y=x,p.group.position.y=-x,R.add(p.group),_.add(R),r.add(_);const S=t.dummies.map((W,Rt)=>{const bt=e.dummies.colors,Qt=bt[Rt%bt.length]??"#cccccc",jt=cS(e.voxel,e.colors,Qt,W.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return jt.group.traverse(le=>{le.userData.dummyId=W.id}),r.add(jt.group),jt}),w=S.map(W=>W.group),E=new X1,M=e.groundRing,b=e.voxel.bodyWidth,P=Au(b,M.playerRadiusFactor),z=Au(b,M.dummyRadiusFactor),I=b*M.thicknessFactor,B=M.arcDeg*Math.PI/180;let L=0;const D=bc({radius:P,thickness:I,arcRad:B,edgeFade:M.edgeFade,color:M.playerColor,opacity:M.playerOpacity,y:.028,renderOrder:6});D.mesh.name="player-ground-ring",r.add(D.mesh);const V=t.dummies.map(W=>{const Rt=bc({radius:z,thickness:I,arcRad:B,edgeFade:M.edgeFade,color:M.neutralColor,opacity:M.opacity,y:.022,renderOrder:5});return Rt.mesh.name=`dummy-ground-ring-${W.id}`,r.add(Rt.mesh),Rt}),O=t.dummies.map(W=>{const Rt=bc({radius:z*M.haloRadiusFactor,thickness:I*M.haloThicknessFactor,arcRad:B,edgeFade:M.edgeFade,color:M.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return Rt.mesh.name=`dummy-ground-halo-${W.id}`,r.add(Rt.mesh),Rt}),F=t.dummies.map(()=>0),X=t.dummies.map(()=>0),nt=Ru({radius:P*M.meterRadiusFactor,thickness:I*M.meterThicknessFactor,arcRad:B,edgeFade:.06,color:M.meterColorCharge,y:.03,renderOrder:8});nt.mesh.name="player-ground-meter",r.add(nt.mesh);const at=t.dummies.map(W=>{const Rt=Ru({radius:z*M.warnRadiusFactor,thickness:I*M.warnThicknessFactor,arcRad:B,edgeFade:.02,color:M.warnColor,y:.031,renderOrder:9});return Rt.mesh.name=`dummy-ground-warn-${W.id}`,r.add(Rt.mesh),Rt}),ot=Pu({color:M.playerColor,y:.042,renderOrder:3});ot.group.name="player-landing-preview",r.add(ot.group);const Q=new ee,q=new ee(M.playerColor),gt=new ee(M.neutralColor),J=new ee(M.lowThreatColor),yt=new ee(M.highThreatColor),Dt=new ee(M.meterColorCharge),zt=new ee(M.meterColorChannel),$t=new ee(M.meterColorCooldown),Tt=new ee(M.warnColor),kt=new Ie;r.add(kt);const N=e.projectiles;function fe(){const Rt=document.createElement("canvas");Rt.width=64,Rt.height=64;const bt=Rt.getContext("2d");if(bt){const jt=bt.createRadialGradient(32,32,0,32,32,32);jt.addColorStop(0,"rgba(255,255,255,1)"),jt.addColorStop(.28,"rgba(255,255,255,0.72)"),jt.addColorStop(.62,"rgba(255,255,255,0.22)"),jt.addColorStop(1,"rgba(255,255,255,0)"),bt.fillStyle=jt,bt.fillRect(0,0,64,64)}const Qt=new El(Rt);return Qt.colorSpace=bn,Qt}function vt(){const bt=document.createElement("canvas");bt.width=2,bt.height=64;const Qt=bt.getContext("2d");if(Qt){const le=Qt.createLinearGradient(0,0,0,64);le.addColorStop(0,"rgba(255,255,255,0)"),le.addColorStop(.55,"rgba(255,255,255,0.35)"),le.addColorStop(1,"rgba(255,255,255,0.95)"),Qt.fillStyle=le,Qt.fillRect(0,0,2,64)}const jt=new El(bt);return jt.colorSpace=bn,jt}const Ht=fe(),Ut=vt(),Lt=new Qe({color:12577023,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),Ct=new Qe({color:14217983,transparent:!0,opacity:0,side:Ve,depthWrite:!1,blending:ki}),C=new Ie;C.position.set(0,.95,.72),kt.add(C);const T=new Ie;T.rotation.x=yS(e.camera.pitchDeg),C.add(T);const Z=new xr(.78,N.slashThickness,6,28,Math.PI*1.15),dt=new Ie,ut=new me(Z,Lt),rt=new me(Z,Ct);rt.scale.setScalar(1.09),rt.renderOrder=4,dt.add(ut,rt),T.add(dt);const It=new Qn(N.arrowWidth,N.arrowWidth,N.arrowLength),K=new ah(N.arrowHeadSize*.42,N.arrowHeadSize,4);K.rotateX(Math.PI/2);const xt=new Qn(N.arrowWidth*2.6,N.arrowWidth*.4,.1),Ft=new Us(N.arrowWidth*.45,N.arrowWidth*1.3,N.trailLength,6,1,!0);Ft.rotateX(-Math.PI/2),Ft.translate(0,0,-N.trailLength/2);const st=Array.from({length:10},()=>{const W=new Ie,Rt=new Qe({color:N.arrowColor,transparent:!0}),bt=new Qe({color:N.arrowHeadColor,transparent:!0}),Qt=new wl({map:Ht,color:N.arrowColor,transparent:!0,opacity:.85,blending:ki,depthWrite:!1}),jt=new Qe({color:N.arrowTrailColor,map:Ut,transparent:!0,opacity:0,blending:ki,depthWrite:!1,side:Ve}),le=new me(It,Rt),Ae=new me(K,bt);Ae.position.z=N.arrowLength/2+N.arrowHeadSize*.42;const A=new me(xt,bt),Y=new me(xt,bt);A.position.z=-N.arrowLength/2+.08,Y.position.z=A.position.z,Y.rotation.z=Math.PI/2;const tt=new lu(Qt);tt.scale.setScalar(N.arrowGlowSize),tt.renderOrder=6;const et=new me(Ft,jt);return et.renderOrder=5,W.add(le,Ae,A,Y,tt,et),W.visible=!1,r.add(W),{group:W,shaftMat:Rt,tipMat:bt,glowMat:Qt,trailMat:jt,glow:tt,trail:et,arrowId:0,bone:null}}),St=new oh(1,0),H=new G(N.boltShapeX,N.boltShapeY,N.boltShapeZ),lt=new Qe({color:N.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),pt=new wl({map:Ht,color:N.boltGlowColor,transparent:!0,opacity:.45,blending:ki,depthWrite:!1}),Gt=new Qe({color:N.boltGlowColor,map:Ut,transparent:!0,opacity:N.trailOpacity,blending:ki,depthWrite:!1,side:Ve}),Vt=new Us(.5,.03,N.boltTrailScale,6,1,!0);Vt.rotateX(-Math.PI/2),Vt.translate(0,0,-N.boltTrailScale/2);const Zt=Array.from({length:24},()=>{const W=new Ie,Rt=new me(St,lt);Rt.scale.copy(H);const bt=new lu(pt);bt.scale.setScalar(N.boltGlowScale),bt.renderOrder=6;const Qt=new me(Vt,Gt);return Qt.renderOrder=5,W.add(Rt,bt,Qt),W.visible=!1,r.add(W),{group:W,core:Rt}}),U=Array.from({length:6},()=>{const W=Pu({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return W.group.visible=!1,r.add(W.group),W}),Mt=e.dash,it=new Hs(Mt.ringRadius-.06,Mt.ringRadius,28),ht=Array.from({length:6},()=>{const W=new Qe({color:16777215,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),Rt=new me(it,W);return Rt.rotation.x=-Math.PI/2,Rt.visible=!1,r.add(Rt),{mesh:Rt,mat:W,life:0,base:1}});function wt(W,Rt,bt,Qt,jt){const le=ht.find(Ae=>Ae.life<=0)??ht[0];le.mat.color.set(Qt),le.mesh.position.set(W,bt+.04,Rt),le.base=jt,le.mesh.scale.setScalar(jt*.6),le.mesh.visible=!0,le.mat.opacity=.9,le.life=Mt.fxDuration}const Et=e.links,Kt=new Hs(Et.ringRadius-.07,Et.ringRadius,28),ie=Array.from({length:5},()=>{const W=new Qe({color:Et.chargeColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),Rt=new me(Kt,W);return Rt.rotation.x=-Math.PI/2,Rt.visible=!1,r.add(Rt),{mesh:Rt,mat:W,life:0,base:1}});function pe(W,Rt,bt,Qt){const jt=ie.find(le=>le.life<=0)??ie[0];jt.mesh.position.set(W,bt+.05,Rt),jt.base=Qt,jt.mesh.scale.setScalar(Qt*.55),jt.mesh.visible=!0,jt.mat.opacity=.85,jt.life=Et.fxDuration}let ne=t.playerLink.id,Me=t.playerLink.hitIds.length,Be=t.dash.id,fn="none";const ze=$1(e.camera,e.smartCamera,e.zoom,a/s),Te=t.character.position;ze.update(Te.x,Te.y,Te.z,1,t.camera);function De(W,Rt){if(w.length===0)return 0;const bt=o.domElement.getBoundingClientRect(),Qt=new Wt((W-bt.left)/bt.width*2-1,-((Rt-bt.top)/bt.height)*2+1);E.setFromCamera(Qt,ze.camera);const jt=E.intersectObjects(w,!0);for(const le of jt){const Ae=le.object.userData.dummyId;if(Ae&&Ae>0)return Ae}return 0}function Ye(W,Rt,bt){const Qt=o.domElement.getBoundingClientRect(),jt=new G(W,Rt,bt).project(ze.camera);return{x:Qt.left+(jt.x*.5+.5)*Qt.width,y:Qt.top+(-jt.y*.5+.5)*Qt.height}}let pn=!1;return{gaitDebug(){return p.gaitDebug()},trailDebug(){return v.debug()},stretchDebug(){const W=p.stretch();return{arm:W.arm,leg:W.leg,torso:W.torso,impact:W.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},projectPoint(W,Rt,bt){return Ye(W,Rt,bt)},setClipT(W){p.setClipT(W)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(W,Rt){const bt=W.character,Qt=W.combat,jt=e.hitstop.enabled&&W.combat.hitstop>0,le=jt;jt&&!pn&&ze.addShake(W.combat.weapon==="greatsword"?.85:.5),pn=jt;for(let ft=0;ft<W.events.length;ft++){const ct=W.events[ft];if(ct.type!=="notify")continue;const te=Number.isFinite(ct.value)?ct.value:0;if(ct.name==="blade-air"){const se=Math.max(0,Math.min(1,te));v.pulse((Qt.weapon==="greatsword"?.9:.55)*(.4+.6*se))}}_.position.set(bt.position.x,bt.position.y,bt.position.z),_.rotation.y=bt.bodyYaw;const Ae=W.dash.phase==="active"&&W.dash.kind==="roll",A=Ae&&W.dash.duration>0?Math.min(1,1-W.dash.timer/W.dash.duration):0;if(R.rotation.x=Ae?A*Math.PI*2:0,R.position.y=x-(Ae?.2*Math.sin(Math.PI*A):0),le||p.update(bt,Qt,W.playerHurt,Rt,W.abilities.channeling,W.time,W.playerLink,W.turnInPlace),v.update(le?0:Rt,le?null:p.weaponBlade(),!le&&(Qt.phase==="active"||W.playerLink.phase==="active"||Ae&&W.dash.duration>0)),!le)for(let ft=0;ft<S.length;ft++)W.dummies[ft]&&S[ft].update(W.dummies[ft],Rt);const Y=ze.camera.position,tt=Math.atan2(Y.x-bt.position.x,Y.z-bt.position.z),et=W.config.gaze.hurtHoldSec,$=W.time-W.playerHurt.lastAt,At=et>0&&$>=0&&$<et?1-$/et:0,Pt=uS(W.gaze.active,W.gaze.threat,At,W.time,M);fS(Q,q,J,yt,Pt.level),L=_S(bt.grounded,bt.position.y,L),D.mesh.position.set(bt.position.x,L+.028,bt.position.z),D.update(Pt.arcRad,Pt.opacity,Pt.scale,Q,tt);const Yt=W.config.abilities.arcane,qt=Math.max(1,Math.floor(Yt.waves)),Ot=Math.max(1e-4,Yt.waveInterval),Xt=gS({charging:Qt.charging,charge:Qt.charge,channeling:W.abilities.channeling,fireTimer:W.abilities.fireTimer,fireInterval:Ot,channelProgress:W.abilities.channeling?(W.abilities.waveIndex+(1-Math.min(1,Math.max(0,W.abilities.fireTimer/Ot))))/qt:0,arcaneCooldown:W.abilities.cooldown,arcaneCooldownMax:Yt.cooldown,dashCooldown:W.dash.cooldown,dashCooldownMax:W.dash.kind==="blink"?W.config.dash.blinkCooldown:W.config.dash.rollCooldown});nt.mesh.position.set(bt.position.x,bt.position.y+.03,bt.position.z),nt.set(Xt.ratio,Xt.source==="none"?0:M.meterOpacity,Xt.source==="charge"?Dt:Xt.source==="channel"?zt:$t,tt);const Bt=W.playerLink,re=Bt.weapon?W.config.links.moves[Bt.weapon]:void 0,xe=xS(Bt.phase,bt.position.x,bt.position.z,Bt.facing,Bt.travel,(re==null?void 0:re.hit.radius)??.9);ot.set(xe.x,xe.z,.042,xe.radius,xe.active?M.landingOpacity:0,W.time);for(let ft=0;ft<V.length;ft++){const ct=W.dummies[ft],te=V[ft],se=O[ft],ge=at[ft];if(!ct){te.mesh.visible=!1,se.mesh.visible=!1,ge.mesh.visible=!1;continue}const Ln=W.targeting.hasTarget&&W.targeting.targetId===ct.id;if(S0(W,ct)){const gn=w0(W,ct);Q.copy(J).lerp(yt,gn)}else Q.copy(gt);const Ue=mS(ct.attackPhase,ct.attackPhaseTimer,W.config.dummies.attackWindup);Ue.active?(Q.lerp(Tt,.5*Ue.urgency),ge.mesh.position.set(ct.position.x,ct.position.y+.031,ct.position.z),ge.set(Ue.ratio,M.warnOpacity*(.65+.35*Ue.urgency),Tt,tt)):ge.set(0,0,Tt,tt);const Tn=Ln?1:0,be=Tn>F[ft]?M.haloFadeInSec:M.haloFadeOutSec;F[ft]=Cu(F[ft],Tn,Rt,be);const $e=F[ft],mn=1+.02*$e*Math.sin(W.time*2.2+ct.id),Ze=M.arcDeg+(M.selectedArcDeg-M.arcDeg)*$e;te.mesh.position.set(ct.position.x,ct.position.y+.022,ct.position.z),te.update(Ze*Math.PI/180,M.opacity+(M.selectedOpacity-M.opacity)*$e,1+(M.selectedScale-1)*$e*mn,Q,tt,1+(M.selectedThicknessScale-1)*$e),X[ft]=Cu(X[ft],Tn,Rt,Tn>X[ft]?M.haloFadeInSec:M.haloFadeOutSec);const an=X[ft];se.mesh.position.set(ct.position.x,ct.position.y+.019,ct.position.z),se.update(Ze*Math.PI/180,M.haloOpacity*an*(.88+.12*Math.sin(W.time*2.2+ct.id)),M.selectedScale*(.94+.06*an)*mn,Q,tt)}if(kt.position.set(bt.position.x,bt.position.y,bt.position.z),kt.rotation.y=Qt.phase!=="idle"?Qt.attackFacing:bt.bodyYaw,W.dash.id!==Be){Be=W.dash.id;const ft=W.dash;fn=ft.kind,ft.kind==="blink"?(wt(ft.fromX,ft.fromZ,bt.position.y,Mt.blinkColor,.9),wt(ft.toX,ft.toZ,bt.position.y,Mt.blinkColor,1.35)):wt(ft.fromX,ft.fromZ,bt.position.y,Mt.rollColor,1.1)}for(const ft of ht){if(ft.life<=0)continue;ft.life-=Rt;const ct=Math.max(0,ft.life/Mt.fxDuration);ft.mat.opacity=.9*ct,ft.mesh.scale.setScalar(ft.base*(.6+(1-ct)*1.2)),ft.life<=0&&(ft.mesh.visible=!1)}const he=W.playerLink;he.id!==ne&&(ne=he.id,Me=he.hitIds.length,pe(bt.position.x,bt.position.z,bt.position.y,1)),he.hitIds.length>Me?(Me=he.hitIds.length,pe(bt.position.x,bt.position.z,bt.position.y,1.35)):he.hitIds.length<Me&&(Me=he.hitIds.length);for(const ft of ie){if(ft.life<=0)continue;ft.life-=Rt;const ct=Math.max(0,ft.life/Math.max(Et.fxDuration,1e-6));ft.mat.opacity=.85*ct,ft.mesh.scale.setScalar(ft.base*(.55+(1-ct)*1.1)),ft.life<=0&&(ft.mesh.visible=!1)}const Re=N.slashEnabled&&Qt.phase==="active"&&Qt.comboIndex>=3;Lt.opacity=Re?.7:0,Ct.opacity=Re?N.slashGlowOpacity:0,Re&&(dt.rotation.z=-1.2+Qt.attackProgress*3.2,dt.scale.setScalar(.9+Qt.comboIndex*.13));for(let ft=0;ft<Zt.length;ft++){const ct=W.abilities.projectiles[ft],te=Zt[ft];te.group.visible=!!ct,ct&&(te.group.position.set(ct.x,ct.y,ct.z),te.group.scale.setScalar(ct.radius),te.group.rotation.set(0,Math.atan2(ct.dirX,ct.dirZ),0))}for(let ft=0;ft<U.length;ft++){const ct=W.abilities.rings[ft],te=U[ft];if(!ct){te.group.visible=!1;continue}const se=Math.max(0,Math.min(1,ct.life/Math.max(ct.duration,1e-6))),ge=vS(Math.max(0,ct.duration-ct.life),M.areaExpandSec);te.set(ct.x,ct.z,.045,ct.radius*ge.scale,M.areaOpacity*(.35+.65*se)*ge.alpha,W.time)}for(let ft=0;ft<st.length;ft++){const ct=W.arrows[ft],te=st[ft];if(!ct){te.group.visible=!1,te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=0;continue}const se=ct.stuck&&ct.stuckDummy>=0;if(te.arrowId!==ct.id){if(te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=ct.id,te.group.position.set(ct.x,ct.y,ct.z),te.group.rotation.set(ct.pitch,ct.yaw,0,"YXZ"),se){const Ln=S[ct.stuckDummy],Ue=Ln?Ln.boneAtWorld(ct.x,ct.y,ct.z):null;Ue&&(Ue.node.attach(te.group),te.bone=Ue.node)}}else te.bone||(te.group.position.set(ct.x,ct.y,ct.z),te.group.rotation.set(ct.pitch,ct.yaw,0,"YXZ"));te.group.visible=!0;const ge=ct.stuck?Math.min(1,ct.rest/.6):1;te.shaftMat.opacity=ge,te.tipMat.opacity=ge,te.glowMat.opacity=(ct.stuck?.28:.85)*ge,te.trailMat.opacity=ct.stuck?0:N.trailOpacity*ge,te.trail.visible=!ct.stuck}ze.update(bt.position.x,bt.position.y,bt.position.z,Rt,W.camera),o.render(r,ze.camera)},resize(){const W=Math.max(1,n.clientWidth),Rt=Math.max(1,n.clientHeight);o.setSize(W,Rt,!1),ze.resize(W/Rt)},getGroundBasis(){return ze.getGroundBasis()},setCollidersVisible(W){for(const Rt of h)Rt.opacity=W?.3:1,Rt.wireframe=W,Rt.needsUpdate=!0},setGridVisible(W){u.visible=W},setLabVisible(W){g.setVisible(W)},setLabLabelsVisible(W){g.setLabelsVisible(W)},snapCamera(W,Rt,bt){ze.snap(W,Rt,bt)},setZoom(W){ze.setZoom(W)},setBodyType(W){var bt;const Rt=(bt=e.bodyTypes)==null?void 0:bt[W];return!Rt||W===m||(R.remove(p.group),p.dispose(),p=y(Rt),p.group.position.y=-x,R.add(p.group),v.reset(),m=W,t.config.characterHeight=Rt.height,Rt.radius!==void 0&&(t.config.characterRadius=Rt.radius)),m},bodyTypes(){return{id:m,ids:Object.keys(e.bodyTypes??{})}},pickDummy:De,projectToScreen:Ye,diagnostics(){const W=gp(e.camera.pitchDeg),Rt=MS(W,kt.rotation.y);return{lean:p.lean(),slashNormal:Rt,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:R.rotation.x,activeRings:ht.filter(bt=>bt.life>0).length,lastKind:fn},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ze.smart(),shake:ze.shakeLevel()}}},dispose(){p.dispose(),g.dispose();for(const W of S)W.dispose();D.dispose();for(const W of V)W.dispose();for(const W of O)W.dispose();nt.dispose(),v.dispose();for(const W of at)W.dispose();ot.dispose(),Z.dispose(),Lt.dispose(),Ct.dispose(),St.dispose(),lt.dispose(),pt.dispose(),Gt.dispose(),Vt.dispose();for(const W of U)W.dispose();It.dispose(),K.dispose(),xt.dispose(),Ft.dispose();for(const W of st)W.shaftMat.dispose(),W.tipMat.dispose(),W.glowMat.dispose(),W.trailMat.dispose();Ht.dispose(),Ut.dispose();for(const W of ht)W.mat.dispose();it.dispose();for(const W of ie)W.mat.dispose();Kt.dispose(),f.traverse(W=>{W instanceof me&&W.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function VS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function XS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function WS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=v=>e.querySelector(`#${v}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function y(){const v=n.status();a.textContent=v.enabled?`已记录 ${v.durationS.toFixed(1)}s · ${v.frames} 帧 · 事件 ${v.events} · 异常 ${v.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=v.enabled?"暂停记录":"继续记录"}function m(v){d=v,e.hidden=!v,v?y():s.hidden=!0}function p(v){o.textContent=v,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const v=n.summary();VS(v).then(_=>{_?(p("已复制 ✓"),s.hidden=!0):(s.value=v,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const v=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);XS(`harness-${v.meta.version}-${_}.json`,JSON.stringify(v)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const v=n.status();t==null||t.classList.toggle("is-alert",v.alert),d&&y()},isOpen:()=>d,close:()=>m(!1)}}const YS={intents:{...Iu},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function $S(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=T0(lg,to),i=GS(n,e,cn,to.stations),a=D0(e),s=Gg(t),o=Vg(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.52 · 11-08 11:58 · 诊断");const l=nt=>String(nt).padStart(2,"0"),c=new Date,h=ag({meta:{version:"v0.9.52",buildTime:"11-08 11:58",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=WS(h,r),d=Og({deadZone:()=>cn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:cn.showColliders,showGrid:cn.showGrid,showLab:cn.lab.enabled,showLabLabels:cn.lab.showLabels};let g=1,y=!1;const m=$0({maxRadiusPx:()=>cn.joystick.maxRadiusPx,deadZone:cn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>cn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let v=e.combat.weapon;function _(nt){if(nt===v)return;v=nt;const at=la.indexOf(nt)+1;for(const ot of p)ot.classList.toggle("is-active",Number(ot.dataset.weapon)===at);w.refreshWeapon()}let x=YS,R=0;const S=()=>{g=1,i.setZoom(1)},w=bg(e,cn,u,{singleStep:()=>a.singleStep(x.intents),reset:()=>{g=1,a.singleStep({...Iu,resetPressed:!0})},resetZoom:S,onToggleColliders:nt=>i.setCollidersVisible(nt),onToggleGrid:nt=>i.setGridVisible(nt),onToggleLab:nt=>i.setLabVisible(nt),onToggleLabLabels:nt=>i.setLabLabelsVisible(nt)}),E=Eg({stations:to.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:w.gui}),window.addEventListener("resize",()=>i.resize());const M=i.bodyTypes().ids,b=document.getElementById("body-toggle"),P=nt=>{var at,ot;return((ot=(at=cn.bodyTypes)==null?void 0:at[nt])==null?void 0:ot.name)??nt},z=()=>{if(!b)return;const nt=i.bodyTypes().id;b.textContent=`体型 ${P(nt)}`,b.setAttribute("aria-label",`切换体型（当前：${P(nt)}，快捷键 B）`)},I=document.createElement("div");I.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(I);let B=0;const L=nt=>{I.textContent=nt,I.style.opacity="1",window.clearTimeout(B),B=window.setTimeout(()=>{I.style.opacity="0"},1600)},D=()=>{if(M.length<2){L("只有一个体型预设");return}const nt=i.bodyTypes().id,at=Math.max(0,M.indexOf(nt)),ot=i.setBodyType(M[(at+1)%M.length]);z(),L(`体型：${P(ot)}（B / 顶部胶囊切换）`)};z(),b==null||b.addEventListener("click",D),window.addEventListener("keydown",nt=>{nt.repeat||nt.code!=="KeyB"||D()}),window.__harness={world:e,view:i,clock:a,input:m,viewConfig:cn,debug:u,getUserZoom:()=>g,getGestures:()=>x.gestures,getLastGesture:()=>x.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(nt,at,ot)=>i.projectPoint(nt,at,ot),setBodyType:nt=>{const at=i.setBodyType(nt);return z(),at},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var nt;return Object.keys(((nt=cn.animation.swing)==null?void 0:nt.clips)??{})},preview:nt=>{const at=e.combat,ot={...at};at.weapon=nt.weapon,at.phase="active",at.comboIndex=Math.max(1,Math.min(3,Math.floor(nt.comboIndex))),at.attackProgress=Math.max(0,Math.min(1,nt.progress)),at.attackFacing=e.character.bodyYaw,i.setClipT(typeof nt.t=="number"?nt.t:null);const Q=Math.max(1,Math.min(30,Math.floor(nt.warm??12)));y=!0;for(let q=0;q<Q;q++)i.render(e,1/60);return i.setClipT(null),Object.assign(at,ot),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:nt=>{e.character.bodyYaw=nt},zoom:nt=>{g=jh(nt,1,cn.zoom.min,cn.zoom.max),i.setZoom(g)},release:()=>{y=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:to.stations??[],goto:nt=>E.goto(nt),current:()=>E.current(),recall:()=>E.recall()}};let V=performance.now(),O=60,F=0;function X(nt){const at=Math.min((nt-V)/1e3,.1);V=nt,at>0&&(O=O*.9+1/at*.1);const ot=m.sample();ot.intents.resetPressed&&(g=1),g=jh(g,ot.zoomScale,cn.zoom.min,cn.zoom.max),i.setZoom(g);let Q=ot.intents.dummyClickId;if(ot.tap){const J=i.pickDummy(ot.tap.x,ot.tap.y);J>0&&(Q=J)}Q>0&&(R=Q),x={...ot,intents:{...ot.intents,dummyClickId:R}};const q=a.frame(at,x.intents,u.timeScale,u.paused,()=>{const J=e.events;for(let yt=0;yt<J.length;yt++)h.event(J[yt],e.time)});q>0&&(R=0),h.sample(e,x,at*1e3,q);for(const J of x.gestures)h.gesture(J);nt-F>250&&(F=nt,f.tick()),_(e.combat.weapon),y||i.render(e,at),E.tick(),d.update(e,x,i.getGroundBasis());const gt=i.diagnostics();s.update(e,O,q,x,u,{attackBlend:gt.attackBlend,attackWeights:gt.attackWeights,landing:gt.landing,hurt:gt.hurt,ik:gt.ik,zoom:gt.camera.zoom},o.hudCompact()),requestAnimationFrame(X)}requestAnimationFrame(X)}$S();

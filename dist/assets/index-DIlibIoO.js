(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const la=["sword-shield","dual-swords","greatsword","staff","bow"],Er=["wander","follow","keep-distance","attack","idle"],Eu={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},Xo=1e-6;function Ps(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Xo?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>Xo?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Vp(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Xo){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>Xo)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Mn=1e-6,yc=Math.PI/180,Tl=-1e9;function Tu(){return{type:"none",lastAt:Tl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function ko(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Sh(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Al(n,t,e){const i=e.duration>0?e.duration:Rl(n,e.type);if(t.kind==="player"){const r=n.playerHurt;if(Sh(r,e.type,i,e.dirX,e.dirZ),r.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Mn){const l=e.knockback*n.config.hits.knockbackDecay;r.knockX=e.dirX*l,r.knockZ=e.dirZ*l}ko(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Sh(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Mn){const r=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*r,a.hurt.knockZ=e.dirZ*r}n.hitCount+=1,ko(n,"hit",a.id,a.position);const s=n.config.hits.hitstop,o=s&&e.type!=="none"?s[e.type]??0:0;o>0&&n.combat.hitstop<o&&(n.combat.hitstop=o,ko(n,"hitstop",o,a.position))}function ar(n,t,e){Al(n,{kind:"dummy",index:t},e)}function Xp(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Rl(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Wp(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>Mn?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-Mn||c>r+Mn)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*yc),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),g=n.config.dummies.radius,y=n.config.targeting.idealRange;for(const m of n.dummies){if(t.hitIds.indexOf(m.id)>=0)continue;const p=m.position.x-i.x,x=m.position.z-i.z,_=Math.hypot(p,x);if(_>h+g)continue;const v=_>Mn?p/_:d,A=_>Mn?x/_:u;if(_>Mn&&(p*d+x*u)/_<f)continue;let S="light";t.weapon==="greatsword"?S="knock":t.comboIndex>=3&&(S="heavy");const w=e.knockback[t.weapon]??0;let E=_;w>0&&(E=Math.max(_+w,y));const M=Math.max(0,E-_);ar(n,n.dummies.indexOf(m),{type:S,duration:Rl(n,S),dirX:v,dirZ:A,knockback:M}),t.hitIds.push(m.id)}}function Yp(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,g=Math.sin(i.facing),y=Math.cos(i.facing),m=Math.cos(wh(s.arcDeg,0,180)*yc),p=n.config.dummies.radius;for(let x=0;x<n.dummies.length;x++){const _=n.dummies[x];if(i.hitIds.indexOf(_.id)>=0)continue;const v=u>Mn?wh(((_.position.x-r)*f+(_.position.z-l)*d)/u,0,1):0,A=r+f*v,S=l+d*v,w=Math.hypot(_.position.x-A,_.position.z-S);let E=!1;if(s.shape==="circle")E=w<=s.radius+p;else if(s.shape==="capsule")E=w<=Math.max(s.radius,s.width)+p;else{const G=_.position.x-c,L=_.position.z-h,D=Math.hypot(G,L),X=D>Mn?(G*g+L*y)/D>=m:!0;E=D<=s.radius+p&&X||w<=s.width+p}if(!E)continue;const M=_.position.x-r,b=_.position.z-l,P=Math.hypot(M,b);if(P>Mn&&(M*g+b*y)/P<Math.cos(Math.max(s.arcDeg,90)*yc))continue;const U=P>Mn?M/P:g,z=P>Mn?b/P:y;Al(n,{kind:"dummy",index:x},{type:s.type,duration:s.duration,dirX:U,dirZ:z,knockback:s.knockback}),i.hitIds.push(_.id),ko(n,"link-hit",_.id,_.position)}}function $p(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>Mn?s/r:0,c=r>Mn?o/r:1;Al(n,{kind:"player"},{type:"light",duration:Rl(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function Zp(n,t){n.modules.hits&&(n.combat.phase==="active"&&Wp(n),Yp(n,t),$p(n))}function wh(n,t,e){return n<t?t:n>e?e:n}const Au=Math.PI/180,Pl=1e-6;function qp(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Wo(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Ru(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Pl?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Pu(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Pl)&&s<=Math.max(0,e.inputDeadZone)&&!o}function jp(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Kp(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Pu(n,t,e))return!1;const i=Ru(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>Cu(n,e)}function Cu(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Au}function Jp(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Pu(n,e,a)){Wo(n);return}const s=Ru(n,e,a.lookRange);if(s===null){Wo(n);return}const o=n.character,r=He(s-o.bodyYaw),l=Math.abs(r),c=Cu(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Pl;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*Au);i.targetYaw=He(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+d*jp(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Fi=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Zs(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,Fi)*i))}function qs(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,Fi)*a)),r=Math.max(i,0)*a;return r<=Fi?n:n+Ba(o,-r,r)}function Eh(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Fi)*a)),o=Math.max(i,0)*a;return o<=Fi?n+s:n+Ba(s,-o,o)}function Ba(n,t,e){return n<t?t:n>e?e:n}function Th(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function Qp(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Fi,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Ps(n,e);else if(c)i.facing=qs(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Ps(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Fi)){const b=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,U=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=Th(i.facing,b,P,U);else if(h>=a.facingMinMagnitude&&Math.abs(He(b-i.facing))>a.facingDeadbandDeg*Math.PI/180){const G=Zs(i.facing,b,a.facingSmoothRate,t);i.facing=Th(i.facing,G,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const g=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Kp(n,e)||(c?i.bodyYaw=qs(i.bodyYaw,g,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Zs(i.bodyYaw,g,a.bodyTurnRate,t));const m=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):m&&(p=n.targeting.targetYaw),!o){const b=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(p-i.bodyYaw))>b&&(p=i.moveYaw)}const x=o||f||m,_=a.maxHeadTurnDeg*Math.PI/180;let v;if(x){const b=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?qs(i.headYaw,p,b,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Zs(i.headYaw,p,b,t)}else{const b=He(i.headYaw-i.bodyYaw),P=He(p-i.bodyYaw),U=Math.abs(P)<Math.abs(b)-1e-9,z=U?n.config.gaze.headReturnRate:a.headTurnRate,G=U?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(G)?qs(b,P,z,G,t):Zs(b,P,z,t);v=i.bodyYaw+L}const A=He(v-i.bodyYaw);A>_?v=i.bodyYaw+_:A<-_&&(v=i.bodyYaw-_),i.headYaw=v;const S=n.config.gaze;let w=0;if(c)w=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const b=n.dummies[n.targeting.targetId-1];if(b){const P=i.position.y+n.config.characterHeight*Ba(S.eyeHeightRatio,0,1),U=b.position.y+n.config.dummies.height*Ba(S.aimHeightRatio,0,1),z=Math.hypot(b.position.x-i.position.x,b.position.z-i.position.z);w=Math.atan2(U-P,Math.max(Fi,z))}}const E=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;w=Ba(w,-E,E);const M=x?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Eh(i.headPitch,w,M,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Eh(i.bodyPitch,i.headPitch*Ba(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Lu=1e-6,sr=Math.PI/180;function or(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function tm(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*sr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(He(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function em(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function nm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*sr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=tm(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),g=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+g*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(em(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}or(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function im(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*sr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,or(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Ah(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,or(n,"channel-end",0,n.character.position))}function am(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){Ah(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),or(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Ps(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Lu),nm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Ah(n,i);break}}function sm(n,t,e){const i=Math.max(0,e.homingConeDeg)*sr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Lu;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(He(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function om(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=sm(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=He(h-f),u=r.turnRate*t,g=Math.max(-u,Math.min(u,d)),y=f+g;r.dirX=Math.sin(y),r.dirZ=Math.cos(y)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){ar(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const rm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;am(n,t,e,s,a,i.cfg.slot),im(n,t,s),om(n,t,s)}},Tr=1e-6;function Du(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function cm(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Du(n,"ring-place",i.id,e)}function lm(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Tr),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const g=Math.hypot(f,d),y=g>Tr?f/g:0,m=g>Tr?d/g:1;ar(n,c,{type:"heavy",duration:e.stun,dirX:y,dirZ:m,knockback:e.knockback})}Du(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const hm={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&cm(n,s),lm(n,t,s)}},dm={channelVolley:rm,groundRing:hm};function um(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function fm(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=dm[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function pm(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function ku(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function mm(n,t,e){fm(n,t,e)}function Ar(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Rh=1e-6;function Ph(n,t,e){return n<t?t:n>e?e:n}function Iu(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function Fu(n){const t=n.camera,e=Iu();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function gm(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=Ph((e.radius-d)/Math.max(Rh,e.radius-e.nearDistance),0,1);let g=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(g+=e.attackBoost*u),a+=g,s+=c.position.x*g,o+=c.position.z*g,r+=1}const l=a<=0?0:Ph(a/(a+Math.max(Rh,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function xm(n){const t=[],e=n.ground.size;t.push(ya("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(ya(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(ya(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ya(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ya(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(ya(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function ya(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const xi=1e-6;function Yo(n,t,e){return n<t?t:n>e?e:n}function Cs(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+xi||c.maxY<i-o-xi||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function Cl(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+xi||l.minY>=o-xi)continue;const c=Yo(t.x,l.minX,l.maxX),h=Yo(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>xi*xi){const g=Math.sqrt(u),y=(e-g)/g;t.x+=f*y,t.z+=d*y}else{const g=t.x-l.minX,y=l.maxX-t.x,m=t.z-l.minZ,p=l.maxZ-t.z,x=Math.min(g,y,m,p);x===g?t.x=l.minX-e:x===y?t.x=l.maxX+e:x===m?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function Ll(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+xi||o.minY>=s-xi)continue;const r=Yo(t.x,o.minX,o.maxX),l=Yo(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-xi)return!0}return!1}const ki=1e-6,ja=Math.PI/180;function Dl(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Mc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function zu(n){n.arrows.length=0}function vm(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let g=0;u>ki&&(g=((o-n)*f+(r-e)*d)/u,g=Math.max(0,Math.min(1,g)));const y=n+f*g,m=e+d*g,p=y-o,x=m-r;if(p*p+x*x>h*h)return-1;const _=t+(a-t)*g;return _<l-.1||_>l+c?-1:g}function _m(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=ki)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*ja,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+ki;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(Dl(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function ym(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ja;return t+Xa(Dl(s-t),-o,o)}function Mm(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*ja),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*ja),a<=0)return r;const l=n.dummies.find(y=>y.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(ki,s),f=l.position.y+n.config.dummies.height*Xa(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,g=Xa(u,-s*.45,s*.92);return{vy:g,horizontal:Math.sqrt(Math.max(0,s*s-g*g))}}function bm(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=_m(n,e),l=ym(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,g=Mm(n,f,u,d,r,s),y={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*g.horizontal,vy:g.vy,vz:h*g.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ja};return n.arrows.push(y),Mc(n,"arrow-shot",a,y),y}function Xa(n,t,e){return n<t?t:n>e?e:n}function Sm(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const A=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*A+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*A,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(A=>A.id===c.targetId);if(!v)c.targetId=0;else{const A=Math.hypot(c.vx,c.vz);if(A>ki){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),w=Math.atan2(c.vx,c.vz),E=c.turnRate*t,M=w+Xa(Dl(S-w),-E,E);c.vx=Math.sin(M)*A,c.vz=Math.cos(M)*A;const b=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(b>.3){const P=b/A,z=(v.position.y+s*Xa(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,G=Math.max(0,i.verticalTurnRate)*t;c.vy+=Xa(z-c.vy,-G,G)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,g=f+c.vy*t,y=d+c.vz*t;let m=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const A=n.dummies[v],S=vm(h,f,d,u,g,y,A.position.x,A.position.z,A.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,m=v)}if(m>=0){const v=n.dummies[m];c.x=h+(u-h)*p,c.y=f+(g-f)*p,c.z=d+(y-d)*p,c.stuck=!0,c.stuckDummy=m;const A=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),w=c.x-v.position.x,E=c.z-v.position.z;c.offX=w*A-E*S,c.offZ=w*S+E*A,c.offY=c.y-v.position.y;const M=Math.atan2(c.vx,c.vz);c.localYaw=M-v.bodyYaw,c.yaw=M,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const b=Math.hypot(c.vx,c.vz);ar(n,m,{type:"light",duration:.22,dirX:b>ki?c.vx/b:0,dirZ:b>ki?c.vz/b:1,knockback:.14}),Mc(n,"arrow-land",v.id,c),l.push(c);continue}const x=Cs(n.boxes,u,y,g+.4,.04,0,6),_=Number.isFinite(x)?x:0;if(g<=_+.02&&c.vy<0){c.x=u,c.y=_+Math.max(0,i.groundStickLift),c.z=y,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(ki,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*ja),c.rest=Math.max(.2,i.stickSec),Mc(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=g,c.z=y,l.push(c)}n.arrows=l}const bc=1e-6,wm=Math.PI/180;function Sc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function kl(n,t,e){return n<t?t:n>e?e:n}function rr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function wc(n){const t=n.id,e=n.windowId;Object.assign(n,rr()),n.id=t,n.windowId=e}function Em(n){wc(n)}function Uu(n){wc(n.playerLink);for(const t of n.dummies)wc(t.link)}function Tm(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Ec(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function $o(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,rr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Am(n,t){const e=n.config.links.search,i=n.character.position,a=kl(e.maxAngleDeg,0,180)*wm;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<bc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(He(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function Rm(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Ps(n,t),l=Am(n,r),c=l.id>0?l.yaw:r,h=l.id>0?kl(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Sc(n,"link-start",s.id)}function Pm(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){$o(n);return}if(e.weapon!==n.combat.weapon){$o(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Sc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Sc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?kl(r/o,0,1):1,e.phase==="active"&&i.active>bc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(bc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function Cm(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&$o(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Ec(n,"sprint"),a.prevSprinting=r,Pm(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&Rm(n,e,l,o.weapon)}const Io={windup:0,active:1,recovery:2},Ch=1e-9;function Nu(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function Lm(n){return n==="windup"||n==="active"||n==="recovery"}function Dm(n,t){return Io[n]+Nu(t)}function km(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!Lm(s.at))continue;const o=Nu(s.u??0),r=Io[s.at]+o;r>i+Ch&&r<=e+Ch&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Io[s.at]+s.u-(Io[o.at]+o.u)),a}const Ls=1e-6;function Ii(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Im(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Ou(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function cr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.timings=Ou()}function Fm(n){return{weapon:la[Math.max(0,n-1)]??la[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],timings:Ou()}}function zm(n,t){return Ps(n,t)}function Um(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Bu(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=zm(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.notifyCursor=-1,a.hitIds.length=0,Ii(n,"attack-start",i)}function Hu(n){return Math.max(0,n.config.combat.settle)}function Tc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Bu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Hu(n),lunge:Um(n,i.lunge[e-1]??0)},e)}function Lh(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Bu(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Hu(n),lunge:i.lunge},0),bm(n,e,n.combat.attackFacing),Ii(n,"charge-release",e)}function Nm(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;if(i.hitstop>0)return;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",Ii(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",Ii(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Tc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>Ls&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Tc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1),Om(n)}function Om(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Ls?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Dm(t.phase,a);if(s<=t.notifyCursor+Ls)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of km(o,t.notifyCursor,s))Im(n,r.name,r.value);t.notifyCursor=s}function Bm(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=la.length){const l=la[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,cr(n),$o(n),Ii(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,Ii(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),Nm(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Tc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,Ii(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Ls)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Lh(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?Lh(n,e,l):Ii(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Ls)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=y=>c*(1-Math.pow(1-Math.min(1,Math.max(0,y/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let g=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);g=Math.min(g,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*g,n.impulse.z=Math.cos(i.attackFacing)*g}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const Ac=1e-6;function Rr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hm(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Gu(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Dh(n,t,e){return n<t?t:n>e?e:n}function Gm(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Ac;){const d=Math.min(l,c+r),u=s.x+t*d,g=s.z+e*d,y=Dh(u,o.minX,o.maxX),m=Dh(g,o.minZ,o.maxZ),p={x:y,y:s.y,z:m};if(Ll(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=y,f=m,c=d,y!==u||m!==g))break}return{x:h,z:f}}function Vm(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Ec(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Rr(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&cr(n));const l=Vp(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=Gm(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Ec(n,"blink"),Rr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Ac,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Rr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Ac,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const ln=1e-6,Rc=Math.PI*2,Xm=7,Wm=18;function Ym(n){return Math.atan2(Math.sin(n),Math.cos(n))}function kh(n,t,e,i){return n+Ym(t-n)*(1-Math.exp(-Math.max(e,ln)*i))}function Il(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function $m(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:Tu(),link:rr()})}return t}function Zm(n){const t=Er.indexOf(n);return Er[(t+1)%Er.length]}function Vu(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Em(i.link)}n.dummyAttackCount=0}function qm(n,t,e){const i=Ar(n)*Rc,a=Math.sqrt(Ar(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Ar(n)*.8)}function jm(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function Km(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(jm(t,i),ln);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",Il(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function Jm(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>ln?a/o:0,l=o>ln?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,g=Math.hypot(d,u);(t.wanderTimer<=0||g<.3)&&qm(n,t,e);const y=t.targetX-t.position.x,m=t.targetZ-t.position.z,p=Math.hypot(y,m);p>ln&&(c=y/p,h=m/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>ln&&(f=Math.atan2(c,h)):o>ln&&(f=Math.atan2(r,l)),e.leashRadius>ln&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,g=Math.hypot(d,u);if(g>e.leashRadius){const y=Math.min(1,(g-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),m=-d/g,p=-u/g;c=c*(1-y)+m*y,h=h*(1-y)+p*y;const x=Math.hypot(c,h);x>ln&&(c/=x,h/=x)}}return{x:c,z:h,facing:f}}function Qm(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+ln&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,Il(n,"dummy-attack",e))}Km(n,e,t,i);const a=Jm(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-ln||a.x<0&&e.position.x<=s.minX+ln)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-ln||a.z<0&&e.position.z<=s.minZ+ln)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,ln)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=kh(e.bodyYaw,e.facing,Xm,t),e.headYaw=kh(e.headYaw,e.facing,Wm,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(Cl(n.boxes,e.position,i.radius,i.height,c))if(Ll(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,x=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Cs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+ln&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const g=Math.hypot(e.velocity.x,e.velocity.z),y=Math.min(n.config.strideSpeedCap,g/Math.max(n.config.moveSpeed,ln)),m=Math.max(n.config.strideLength*(1+y*n.config.strideSpeedGain),ln);e.stride=m,e.gaitPhase=(e.gaitPhase+u/m*Rc)%Rc}function t0(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Zm(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,Il(n,"dummy-mode",a)}for(const a of n.dummies)Qm(n,t,a,i)}const Gn=1e-6,Ih=Math.PI*2;function Fh(n,t){return Math.sqrt(n*n+t*t)}function js(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function e0(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,cr(n)}function n0(n,t,e){const i=n.character,a=n.config,s=Cs(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,cr(n),Uu(n),Gu(n),ku(n),zu(n),Wo(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Tl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function i0(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Fh(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-Gn||r<0&&s.x<=h.minX+Gn)&&(r=0),(l>0&&s.z>=h.maxZ-Gn||l<0&&s.z<=h.minZ+Gn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",g=f||u||d;a.sprinting=!g&&e.sprintHeld&&c>Gn;const y=i.combat.weapons[n.combat.weapon];let m=y?y.moveMultiplier:1;u||d?m=0:f?m*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?m*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(m*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*m;{const z=g?i.skillDecel:c>Gn?i.acceleration:i.friction,G=1-Math.exp(-z*t);o.x+=(r*p-o.x)*G,o.z+=(l*p-o.z)*G}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,js(n,"jumped",i.jumpSpeed)),n.events.some(z=>z.type==="blink"&&z.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const _=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Cl(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Ll(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=_,s.z=v,o.x=0,o.z=0;else{const z=s.x-_,G=s.z-v;Math.abs(z)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(G)<Math.abs(o.z*t)*.5&&(o.z=0)}js(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Cs(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+Gn&&S-s.y<=i.stepHeight+Gn&&(s.y=S,o.y=0,js(n,"stepUp",S));const w=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=Cs(n.boxes,s.x,s.z,w,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||js(n,"landed",E),a.grounded=!0):a.grounded=!1;const M=Fh(s.x-_,s.z-v);a.distance+=M;const b=M/Math.max(t,Gn),P=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Gn)),U=Math.max(i.strideLength*(1+P*i.strideSpeedGain),Gn);a.stride=U,a.gaitPhase=(a.gaitPhase+M/U*Ih)%Ih}const Pc=1e-6,zh=2.399963229728653;function ia(n,t,e){return n<t?t:n>e?e:n}function Uh(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,g,y;f<Pc?(u=r,g=l,y=d):(u=c/f,g=h/f,y=d-f);const m=y+o;n.x-=u*m*a,n.z-=g*m*a,t.x+=u*m*s,t.z+=g*m*s}function a0(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*zh;Uh(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*zh;Uh(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)Cl(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=ia(h.position.x,c.minX,c.maxX),h.position.z=ia(h.position.z,c.minZ,c.maxZ)}function s0(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=ia(r.minScale,0,1);if(l<Pc||c<=0||h>=1)return 1;const f=a+o,d=ia(r.approachDot,0,.99);let u=0;for(const g of s){const y=g.position.x-n,m=g.position.z-t,p=Math.hypot(y,m);if(p>=f+c)continue;if(p<Pc){u=1;continue}const x=(e*y+i*m)/(l*p);if(x<=d)continue;const _=ia(1-(p-f)/c,0,1),v=ia((x-d)/(1-d),0,1);u=Math.max(u,_*v)}return 1-(1-h)*ia(u,0,1)}function o0(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=s0(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Pr=1e-6,r0=Math.PI/180;function c0(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function l0(n,t,e){return n<t?t:n>e?e:n}function h0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Pr?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Pr&&(o=Math.atan2(e.moveX,e.moveZ));const l=l0(i.maxAngleDeg,0,180)*r0;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const g=u.position.x-s.x,y=u.position.z-s.z,m=Math.hypot(g,y);if(m<Pr||m>i.range)continue;const p=Math.atan2(g,y),x=Math.abs(He(p-o));if(x>l)continue;const _=m-i.frontBias*Math.cos(x);_<c&&(c=_,h=u.id,f=p,d=m)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const ti=1e-6;function Ha(n,t,e){return n<t?t:n>e?e:n}function Nh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function d0(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(z,G)=>{const L=z.position.x-s.x,D=z.position.z-s.z,X=Math.hypot(L,D);if(X<ti||X>G)return 0;const k=Ha((G-X)/Math.max(ti,G-i.nearDistance),0,1);let F=k*(i.modeWeight[z.mode]??.5);return z.attackPhase==="active"&&(F+=i.attackBoost*k),F},r=[];let l=0,c=!1,h=!1,f=!1;for(const z of n.dummies){const G=o(z,i.threatRange),L=z.position.x-s.x,D=z.position.z-s.z,X=Math.hypot(L,D);G>0&&(r.push({id:z.id,x:z.position.x,z:z.position.z,dx:L,dz:D,yaw:Math.atan2(L,D),w:G}),l+=G,X<=i.approachDist&&(i.modeWeight[z.mode]??.5)>=i.hostileModeWeight&&(f=!0)),X>ti&&X<=i.recoveryDist&&(c=!0),(z.attackPhase==="windup"||z.attackPhase==="active")&&X<=i.threatRange&&(h=!0)}const d=l<=0?0:Ha(l/(l+Math.max(ti,i.saturation)),0,1),u=r.length>0,g=a.active,y=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),m=i.hurtHoldSec>ti&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=g&&(c||m);if(a.active=y||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((z,G)=>G.w-z.w);const x=r.slice(0,Math.max(1,i.maxThreats)),_=r[0],v=Math.atan2(_.dx,_.dz),A=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let w=0,E=0,M=0;for(const z of x){const G=Math.abs(Nh(z.yaw-v))/Math.PI;let L=z.w/(1+Math.max(i.spreadFalloff,0)*G*G);z!==_&&i.behindFalloff<1&&Math.abs(Nh(z.yaw-S))>A&&(L*=Math.max(i.behindFalloff,0)),w+=z.x*L,E+=z.z*L,M+=L}a.mainId=_.id,a.mainYaw=v;const b=n.dummies.find(z=>z.id===_.id),P=(b?b.position.y:0)+n.config.dummies.height*Ha(i.aimHeightRatio,0,1),U=s.y+n.config.characterHeight*Ha(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-U,Math.max(ti,Math.hypot(_.dx,_.dz))),a.centroidYaw=M>ti?Math.atan2(w/M-s.x,E/M-s.z):v,a.threatCount=r.length,a.threat=d}function u0(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function f0(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<ti||a>e.threatRange)return 0;const s=Math.max(ti,e.threatRange-e.nearDistance),o=Ha((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(ti,e.modeWeight.attack??1.5);return Ha(r/l,0,1)}function p0(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function m0(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:xm(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Fm(1),playerLink:rr(),arrows:[],arrowSeq:0,abilities:pm(),skills:um(n),impulse:{x:0,z:0},targeting:c0(),turnInPlace:qp(),playerHurt:Tu(),hitCount:0,dash:{...Hm(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Iu(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:p0(),dummies:$m(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function g0(n){e0(n),Vu(n),Uu(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Tl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,ku(n),zu(n),Gu(n),Fu(n),Wo(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function Oh(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){g0(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?h0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Cm(n,t,e),n.modules.combat&&Bm(n,t,e),n.modules.dash&&Vm(n,t,e),n.modules.movement&&i0(n,t,e),n.modules.gaze&&d0(n,t,e),n.modules.orientation&&Qp(n,t,e),Jp(n,t,e),n.modules.dummies&&t0(n,t,e),Xp(n,t),Tm(n,t),n.modules.abilities&&mm(n,t,e),n.modules.combat&&Sm(n,t),n.modules.dummies&&(Zp(n,t),n.modules.separation&&(a0(n),o0(n))),n.modules.camera?gm(n):Fu(n),n}const Xu=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Bh=1e-9;function x0(n,t,e){return n<t?t:n>e?e:n}function Wu(n){return x0(Number.isFinite(n)?n:0,0,1)}function Yu(n,t){const e=Wu(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function v0(){const n={};for(const t of Xu)n[t]=0;return n}function _0(n,t){const e=v0(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Wu(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Bh;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Bh?(a-o.t)/l:0,h=Yu(o.ease??"linear",c);for(const f of Xu){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function y0(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Yu(i,t/a);return e.turns*Math.PI*2*s}function Xi(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function M0(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Oh(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Oh(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t}}}const $u={slopPx:12,longPressMs:450,doubleTapMs:280};function b0(n,t,e=$u.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function Wi(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function S0(n=$u){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),Wi(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,Wi(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return Wi(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),Wi(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),Wi(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),Wi(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,Wi(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Cr=.001,w0=18;function Cc(n,t,e){return n<t?t:n>e?e:n}function Lc(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function E0(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function T0(n,t,e,i,a=w0){const s=E0(t);if(!s)return{state:Lc(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<Cr)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const g=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:g},scale:1,started:!0,ended:!1,armedNow:!1,pinching:g}}if(!n.armed)return n.armDist<Cr?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Cr)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Cc(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Hh(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Cc(r,a,s):Cc(n,a,s)}function A0(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function R0(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Lr=["jump","sprint","reset","attack","skill2"],P0=8,C0=16,Dr=10,Gh=14,Vh=140,L0=18,D0=16,k0=400,I0=1.0001;function Fo(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function F0(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Fo(e)}function z0(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,g=0,y=null,m=-1,p=0,x=0,_=0,v=0,A=!1,S=0,w=1,E=0,M=null,b=0,P=0,U=!1,z=null,G=null,L=0,D=0,X=0,k=0,F=!1,B=!0,ut=-1;const ot=S0({slopPx:Gh,longPressMs:450,doubleTapMs:350});let ht=[],j=null;const q=new Set;function mt(H){H&&ht.push(H)}const K=new Map;let yt=Lc(),Lt=!1,Ut=1;function $t(){const H=Array.from(K.values()),rt=a(),ft=T0(yt,H,rt.pinchGain,rt.maxStepRatio,L0);if(yt=ft.state,Lt=ft.pinching,ft.scale!==1&&(Ut*=ft.scale),ft.started||ft.armedNow)M=null,U=!0,z=null;else if(ft.ended&&o===null&&H.length===1){const Gt=H[0];o=Gt.id,r=Gt.x,l=Gt.y,c=0,h=0,f=Gt.x,d=Gt.y,A=!1,S=0,w=1,E=0,performance.now(),M=null,U=!0,z=null}}const Tt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},It={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let O=0,ce=0;const Wt={},Ht=new Set,Nt=[];function Rt(){for(const H of Lr)Wt[H]!==void 0&&(Wt[H]=void 0),Y(H);ot.reset(),q.clear(),K.clear(),yt=Lc(),Lt=!1,o=null,c=0,h=0,f=0,d=0,A=!1,S=0,w=1,E=0,p=0,x=0,_=0,v=0,y=null,m=-1,M=null,U=!1,z=null,G=null,ut=-1,X=0,k=0,F=!1,B=!0}const Pt=()=>{document.hidden&&Rt()},C=H=>{if(H.clientX===0&&H.clientY===0){g++;return}if(Fo(H.target)||F0(H.clientX,H.clientY)){q.add(H.pointerId);return}if(q.delete(H.pointerId),K.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),o===null&&!Lt){y=null,m=-1,o=H.pointerId,r=H.clientX,l=H.clientY,c=0,h=0,f=H.clientX,d=H.clientY,performance.now();const rt=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY)&&(H.screenX!==0||H.screenY!==0);A=rt,S=0,w=1,E=0,p=rt?H.screenX:0,x=rt?H.screenY:0,_=p,v=x,M=H.pointerId,b=H.clientX,P=H.clientY,U=!1}$t()},T=H=>{if(H.pointerId===G&&(H.pointerType==="mouse"&&H.buttons===0||H.clientX===0&&H.clientY===0&&(L!==0||D!==0)||(B?(X=H.clientX-L,k=H.clientY-D):(L=H.clientX,D=H.clientY,B=!0,X=0,k=0))),mt(ot.move(H.pointerId,H.clientX,H.clientY,performance.now())),!q.has(H.pointerId)&&K.has(H.pointerId)&&(K.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),$t()),q.has(H.pointerId)||H.pointerId!==o)return;const rt=performance.now();if(y===H.pointerId&&rt-m<150){g++;return}const ft=H.clientX,Gt=H.clientY;if(ft===0&&Gt===0&&(r!==0||l!==0)){g++;return}const Zt=ft-f,N=Gt-d,gt=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY),Q=gt?H.screenX:0,ct=gt?H.screenY:0,bt=gt&&(Q!==0||ct!==0),wt=Q-_,Kt=ct-v;if(A&&bt){const _e=Math.hypot(wt,Kt),Ee=Math.hypot(Zt,N);if(_e>3){if(S=0,E<30&&Ee>6&&wt*Zt+Kt*N>.7*_e*Ee){const Be=_e/Ee;Be>.2&&Be<5&&(w+=(Be-w)*.3,E++)}}else Ee>12&&(S++,S>=2&&(A=!1))}const ae=Math.hypot(Zt,N);if(!A){const _e=u<0?Number.POSITIVE_INFINITY:rt-u,Ee=bt?Math.hypot(wt,Kt):1/0;ae>28&&(_e<200||Ee<ae*.4)&&(r+=Zt,l+=N,g++)}f=ft,d=Gt,_=Q,v=ct,H.pointerId===M&&Math.hypot(H.clientX-b,H.clientY-P)>P0&&(U=!0);let de,ne;A&&bt?(de=(Q-p)/w,ne=(ct-x)/w):(de=ft-r,ne=Gt-l);const xe=Math.hypot(de,ne),Fe=s();xe>Fe&&(de*=Fe/xe,ne*=Fe/xe);const pn=Math.hypot(c,h),Le=Math.hypot(de,ne);if(pn>10&&Le>10){const _e=Math.abs(Math.atan2(c*ne-h*de,c*de+h*ne)),Ee=Math.max(pn,Le)*_e,Be=Math.max(Math.hypot(Zt,N),Math.hypot(wt,Kt)/Math.max(.2,w));if(_e>.6&&Be<Math.max(6,Ee*.5)){g++;return}}c=de,h=ne};function Y(H){if(!Tt[H])return;Tt[H]=!1,H==="attack"&&(It.attackReleased=!0);const rt=document.getElementById(`btn-${H}`);rt==null||rt.classList.remove("is-down")}function lt(){o!==null&&(y=o,m=performance.now(),o=null,c=0,h=0,f=0,d=0,A=!1,S=0,w=1,E=0,p=0,x=0,_=0,v=0)}const dt=H=>{const rt=K.delete(H.pointerId),ft=q.delete(H.pointerId);rt&&$t(),H.pointerId===G&&(G=null,F?ut=performance.now():(X=0,k=0,ut=-1)),mt(ot.end(H.pointerId,H.clientX,H.clientY,performance.now()));for(const Vt of Lr)Wt[Vt]===H.pointerId&&(Wt[Vt]=void 0,Y(Vt));const Gt=!rt&&!ft&&K.size<=1&&o!==null;(H.pointerId===o||K.size===0||Gt)&&lt(),!ft&&H.pointerId===M&&(!U&&!Fo(H.target)&&(z={x:H.clientX,y:H.clientY}),M=null)};for(const H of Lr){const rt=document.getElementById(`btn-${H}`);if(!rt)continue;const ft=H==="attack"||H==="skill2",Gt=N=>{if(N.preventDefault(),Wt[H]===void 0){Wt[H]=N.pointerId,Tt[H]=!0,H==="jump"&&(It.jump=!0),H==="reset"&&(It.reset=!0),H==="sprint"&&(It.sprintPressed=!0),H==="attack"&&(It.attackPressed=!0),H==="skill2"&&(It.skill2=!0),rt.classList.add("is-down"),mt(ot.begin(H,N.pointerId,N.clientX,N.clientY,performance.now()));try{rt.setPointerCapture(N.pointerId)}catch{}ft&&(G=N.pointerId,L=N.clientX,D=N.clientY,B=!(N.clientX===0&&N.clientY===0),X=0,k=0,F=!1,ut=-1)}},Vt=N=>{Wt[H]===N.pointerId&&(Wt[H]=void 0,Y(H),mt(ot.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Zt=N=>{Wt[H]===N.pointerId&&(Wt[H]=void 0,Y(H),mt(ot.cancel(N.pointerId,performance.now())))};rt.addEventListener("pointerdown",Gt),rt.addEventListener("pointerup",Vt),rt.addEventListener("pointercancel",Zt),Nt.push(()=>{rt.removeEventListener("pointerdown",Gt),rt.removeEventListener("pointerup",Vt),rt.removeEventListener("pointercancel",Zt)})}const at=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const H of at){const rt=ft=>{ft.preventDefault(),O=Number(H.dataset.weapon)||0};H.addEventListener("pointerdown",rt),Nt.push(()=>H.removeEventListener("pointerdown",rt))}const Dt=H=>{const rt=H.key.toLowerCase();if((rt===" "||rt.startsWith("arrow"))&&H.preventDefault(),Ht.has(rt))return;Ht.add(rt),rt===" "&&(It.jump=!0),rt==="r"&&(It.reset=!0),rt==="shift"&&(It.sprintPressed=!0),rt==="j"&&(It.attackPressed=!0),rt==="k"&&(It.skill2=!0),rt>="1"&&rt<="5"&&(O=Number(rt)),rt>="6"&&rt<="9"&&(ce=Number(rt)-5);const ft=Math.max(I0,a().keyStep||1.12);(rt==="="||rt==="+")&&(Ut*=ft),(rt==="-"||rt==="_")&&(Ut/=ft)},J=H=>{const rt=H.key.toLowerCase();Ht.has(rt)&&(Ht.delete(rt),rt==="j"&&(It.attackReleased=!0))},pt=H=>{if(Fo(H.target))return;H.preventDefault();const rt=H.deltaMode===1?H.deltaY*D0:H.deltaMode===2?H.deltaY*k0:H.deltaY;Ut*=A0(rt,a().wheelStep)},Ft=H=>{H.preventDefault()},it=()=>{u=performance.now()};window.addEventListener("resize",it),window.addEventListener("orientationchange",it);const Mt=typeof window<"u"?window.visualViewport:null;return Mt&&(Mt.addEventListener("resize",it),Mt.addEventListener("scroll",it)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",T),window.addEventListener("pointerup",dt),window.addEventListener("pointercancel",dt),window.addEventListener("blur",Rt),document.addEventListener("visibilitychange",Pt),window.addEventListener("keydown",Dt),window.addEventListener("keyup",J),window.addEventListener("wheel",pt,{passive:!1}),window.addEventListener("gesturestart",Ft),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:g,screenOk:A,originSX:p,originSY:x,screenX:_,screenY:v,scale:w}},peekAim(){const H=performance.now(),rt=Math.hypot(X,k),ft=G!==null||ut>=0&&H-ut<Vh;if(!(ft&&F&&rt>=Dr))return{active:!1,holding:ft,x:0,z:0,dx:X,dy:k};const Vt=i(),Zt=X/rt,N=k/rt,gt=Vt.rightX*Zt+Vt.forwardX*-N,Q=Vt.rightZ*Zt+Vt.forwardZ*-N,ct=Math.hypot(gt,Q)||1;return{active:!0,holding:ft,x:gt/ct,z:Q/ct,dx:X,dy:k}},sample(){var wn;const H=s();let rt=o!==null?Math.max(-1,Math.min(1,c/H)):0,ft=o!==null?Math.max(-1,Math.min(1,h/H)):0,Gt=0,Vt=0;(Ht.has("a")||Ht.has("arrowleft"))&&(Gt-=1),(Ht.has("d")||Ht.has("arrowright"))&&(Gt+=1),(Ht.has("w")||Ht.has("arrowup"))&&(Vt-=1),(Ht.has("s")||Ht.has("arrowdown"))&&(Vt+=1),rt+=Gt,ft+=Vt;let Zt=Math.hypot(rt,ft);Zt>1&&(rt/=Zt,ft/=Zt,Zt=1);const N=rt,gt=ft;Zt<e&&(rt=0,ft=0);const Q=i();let ct=Q.rightX*rt+Q.forwardX*-ft,bt=Q.rightZ*rt+Q.forwardZ*-ft;const wt=Math.hypot(ct,bt);wt>1&&(ct/=wt,bt/=wt);const Kt=performance.now();mt(ot.poll(Kt));const ae=Math.hypot(X,k);G!==null&&(ae>=C0?F=!0:ae<Dr&&(F=!1));const de=G!==null||ut>=0&&Kt-ut<Vh,ne=de&&F&&ae>=Dr;let xe=0,Fe=0;if(ne){const Ye=X/ae,$=k/ae,At=Q.rightX*Ye+Q.forwardX*-$,St=Q.rightZ*Ye+Q.forwardZ*-$,Qt=Math.hypot(At,St)||1;xe=At/Qt,Fe=St/Qt}!de&&G===null&&(X=0,k=0,ut=-1,F=!1);const pn=z;z=null;const Le=Ut;Ut=1;const _e={moveX:ct,moveZ:bt,jumpPressed:It.jump,sprintHeld:Tt.sprint||Ht.has("shift"),sprintPressed:It.sprintPressed,resetPressed:It.reset,attackPressed:It.attackPressed,attackHeld:Tt.attack||Ht.has("j"),attackReleased:It.attackReleased,skill2Pressed:It.skill2,weaponSlot:O,dummyClickId:ce,aimX:xe,aimZ:Fe,aimActive:ne};It.jump=!1,It.reset=!1,It.sprintPressed=!1,It.attackPressed=!1,It.attackReleased=!1,It.skill2=!1,O=0,ce=0;const Ee=ht.map(Ye=>b0(Ye,Q,Gh));ht=[],Ee.length>0&&(j=Ee[Ee.length-1]);const Be=o!==null?"pointer":Ht.size>0?"keyboard":"idle";return{intents:_e,stickX:rt,stickY:ft,stickRawX:N,stickRawY:gt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:g,stickScreenOk:A,stickOriginSX:p,stickOriginSY:x,stickScreenX:_,stickScreenY:v,stickScale:w,stickVpTop:((wn=R0())==null?void 0:wn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:X,aimDY:k,source:Be,tap:pn,zoomScale:Le,gestures:Ee,lastGesture:j}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",dt),window.removeEventListener("pointercancel",dt),window.removeEventListener("blur",Rt),document.removeEventListener("visibilitychange",Pt),window.removeEventListener("keydown",Dt),window.removeEventListener("keyup",J),window.removeEventListener("wheel",pt),window.removeEventListener("resize",it),window.removeEventListener("orientationchange",it),Mt&&(Mt.removeEventListener("resize",it),Mt.removeEventListener("scroll",it)),window.removeEventListener("gesturestart",Ft),ot.reset();for(const H of Nt)H()}}}const Zo=1,qo=2,jo=4,Zu=8,Ko=16,Ss=32,qu=64,ju=128,U0=[[Zo,"atk"],[qo,"dash"],[jo,"link"],[Zu,"air"],[Ko,"hurt"],[Ss,"aim"],[qu,"spr"],[ju,"chan"]];function Ma(n){if(n===0)return"-";const t=U0.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const N0=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],O0=0,B0=15,kr=19,H0=21,G0=22,V0=23,X0=24,Jn={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},Tn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Vn=n=>Math.round(n*180/Math.PI*10)/10,Ir=Math.PI*2;function ds(n){let t=n%Ir;return t>Math.PI&&(t-=Ir),t<-Math.PI&&(t+=Ir),t}function W0(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Zo),n.dash.phase!=="idle"&&(e|=qo),n.playerLink.phase!=="idle"&&(e|=jo),n.character.grounded||(e|=Zu),n.playerHurt.type!=="none"&&(e|=Ko),t.intents.aimActive&&(e|=Ss),n.character.sprinting&&(e|=qu),n.abilities.channeling&&(e|=ju),e}function Y0(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function $0(n){const t={sampleHz:n.sampleHz??Jn.sampleHz,sampleCapacity:n.sampleCapacity??Jn.sampleCapacity,eventCapacity:n.eventCapacity??Jn.eventCapacity,anomalyCapacity:n.anomalyCapacity??Jn.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??Jn.dirJumpDeg,aimDropDeg:n.aimDropDeg??Jn.aimDropDeg,freezeMs:n.freezeMs??Jn.freezeMs,freezeSpeed:n.freezeSpeed??Jn.freezeSpeed,stickLostMs:n.stickLostMs??Jn.stickLostMs,spikeMs:n.spikeMs??Jn.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",g=-1,y=-1,m=-1,p=0,x=-1e9,_=-1,v={},A=null,S=0,w=0,E=0,M=0;function b(L,D){const X=1/t.sampleHz,k=L[O0];k-c<X-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=k)}function P(L,D,X,k,F,B){const ut=v[L]??-1e9;if(D-ut<1.2)return;if(v[L]=D,L==="frameSpike"){let ht=0;for(const j of s)j.kind==="frameSpike"&&ht++;if(ht>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ot=i.slice(-7);B&&(ot.length===0||ot[ot.length-1]!==B)&&(ot=[...ot.slice(-6),B]),s.push({kind:L,t:Tn(D),tick:X,ms:Math.round(k),detail:F,ctx:ot}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function U(L,D,X,k){a.length>=t.eventCapacity&&a.shift(),a.push({t:Tn(X),tick:k,k:L,d:D})}function z(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":x=L.tick;break}}function G(){const L=o,D=L.wallMs/1e3,X=L.gestures,k=ot=>Object.entries(X).filter(([ht])=>ht.endsWith(`.${ot}`)).reduce((ht,[,j])=>ht+j,0),F=[];if(F.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),F.push(`运行 ${D.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),F.push(`摇杆活跃 ${D>0?Math.round(L.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${k("press")}（单击 ${k("tap")} / 双击 ${k("doubleTap")} / 拖拽 ${k("drag")} / 长按 ${k("longPress")} / 打断 ${k("cancel")} / 拖放 ${k("release")}）`),F.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),F.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${u||"-"}`),F.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ot of s.slice(-6)){F.push(`· ${ot.kind} @t${ot.t.toFixed(2)} tick${ot.tick} ${ot.ms>0?`${ot.ms}ms `:""}${ot.detail}`);const ht=ot.ctx.map(q=>String(q[B0])).join(" "),j=ot.ctx.map(q=>q[kr]===""||q[kr]==null?".":String(q[kr])).join(" ");if(F.push(`  yaw ${ht}`),F.push(`  in  ${j}`),ot.kind==="stickJump"||ot.kind==="stickBad"||ot.kind==="stickLost"){const q=ot.ctx.map(K=>`${K[H0]},${K[G0]}`).join(" "),mt=ot.ctx.map(K=>`${K[V0]},${K[X0]}`).join(" ");F.push(`  o   ${q}`),F.push(`  p   ${mt}`)}}if(a.length>0){F.push("最近事件：");for(const ot of a.slice(-12))F.push(`  ${ot.t.toFixed(2)} ${ot.k} ${ot.d}`.trimEnd())}const B=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ut=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return F.push(`摇杆坐标源 ${B}${ut}`),F.push(`UA ${e.ua}`),F.join(`
`)}return{sample(L,D,X,k=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=k,o.wallMs+=X,X>o.dtMax&&(o.dtMax=X),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const F=L.time;if(l<0&&(l=F),E=F,M=L.tick,!r)return;const B=L.character,ut=Math.hypot(D.stickX,D.stickY),ot=Math.hypot(B.velocity.x,B.velocity.z);u=L.combat.weapon;const ht=W0(L,D),j=B.facing,mt=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;ut>.2&&(o.stickActiveMs+=X);const K=[Tn(F),L.tick,Math.round(X*10)/10,Tn(D.stickX),Tn(D.stickY),Tn(D.stickRawX),Tn(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),Tn(D.intents.moveX),Tn(D.intents.moveZ),Tn(B.position.x),Tn(B.position.z),Tn(B.velocity.x),Tn(B.velocity.z),Vn(j),Vn(B.bodyYaw),ht,Tn(B.stride),mt===null?"":Vn(mt),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];b(K);const yt=F*1e3<_;if(X>t.spikeMs&&!yt&&F-l>.6&&(o.spikes++,P("frameSpike",F,L.tick,X,`dt ${X.toFixed(0)}ms fl=${Ma(ht)}`,K)),h!==null&&!yt){const Rt=Math.abs(Vn(ds(j-h))),Pt=Math.abs(Vn(ds(B.moveYaw-f))),C=(d|ht)&(Zo|qo|jo|Ko)|ht&Ss,T=mt===null?null:Math.abs(Vn(ds(j-mt))),Y=mt===null||h===null?null:Math.abs(Vn(ds(h-mt))),lt=T!==null&&Y!==null&&T<Y-.5,dt=(d&Ss)!==0&&(ht&Ss)===0&&mt===null,at=T!==null&&(T<=12||lt);Rt>t.aimDropDeg&&dt?P("aimDrop",F,L.tick,0,`${Rt.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Ma(ht)}`,K):Rt>t.dirJumpDeg&&C===0&&!dt&&(at?(o.inTurns++,Rt>o.inTurnMax&&(o.inTurnMax=Rt)):P("dirJump",F,L.tick,0,`${Rt.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${Vn(h)}→${Vn(j)} in ${mt===null?".":Vn(mt)}° mvΔ${Pt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Ma(d)}→${Ma(ht)}`,K))}const Lt=(ht&(Zo|qo|jo|Ko))!==0,Ut=L.tick-x<30;ut>.35&&ot<t.freezeSpeed&&!Lt&&!Ut?(g<0&&(g=F),F-g>=t.freezeMs/1e3&&F>=y&&(P("moveFreeze",F,L.tick,(F-g)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${ot.toFixed(2)} ${D.source} fl=${Ma(ht)}`,K),y=F+1.5,g=-1)):g=-1,D.stickHeld?(ut>p&&(p=ut),p>.35&&ut<.06?(m<0&&(m=F),F-m>=t.stickLostMs/1e3&&(P("stickLost",F,L.tick,(F-m)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ma(ht)}`,K),m=-1,p=0)):m=-1):(p=0,m=-1);const $t=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,Tt=D.stickScreenOk,It=Tt?D.stickScreenX/$t:D.stickPxX,O=Tt?D.stickScreenY/$t:D.stickPxY,ce=Tt?D.stickOriginSX/$t:D.stickOriginX,Wt=Tt?D.stickOriginSY/$t:D.stickOriginY,Ht=It-ce,Nt=O-Wt;if(D.stickHeld&&D.stickId!==null){const Rt=A;if(Rt&&Rt.held&&Rt.id===D.stickId){const Pt=Math.hypot(Rt.dx,Rt.dy),C=Math.hypot(Ht,Nt),T=Math.max(Pt,C),Y=Math.hypot(It-Rt.cx,O-Rt.cy),lt=Math.abs(Vn(ds(Math.atan2(Nt,Ht)-Math.atan2(Rt.dy,Rt.dx)))),dt=T*lt*Math.PI/180,at=Math.hypot(ce-Rt.ox,Wt-Rt.oy);if(T>18&&lt>35&&Y<Math.max(5,dt*.35)&&P("stickJump",F,L.tick,0,`Δ${lt.toFixed(0)}° 手指只动${Y.toFixed(0)}px(弧长应${dt.toFixed(0)}px) o(${Math.round(Rt.ox)},${Math.round(Rt.oy)})→(${Math.round(ce)},${Math.round(Wt)}) 原点位移${at.toFixed(0)}px p(${Math.round(It)},${Math.round(O)}) raw(${Math.round(Ht)},${Math.round(Nt)}) id${D.stickId} ${Tt?"src=屏幕":"src=client"}`,K),Tt&&Rt.screenOk){const Dt=Math.hypot(D.stickPxX-Rt.x,D.stickPxY-Rt.y),J=Math.hypot((D.stickScreenX-Rt.sx)/$t,(D.stickScreenY-Rt.sy)/$t);S+=Dt-J,Math.abs(S)>20&&(P("stickDrift",F,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,K),S=0)}}A={id:D.stickId,ox:ce,oy:Wt,cx:It,cy:O,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:Ht,dy:Nt,held:!0,screenOk:Tt}}else A=null,S=0;if(D.stickBad>w){const Rt=D.stickBad-w;P("stickBad",F,L.tick,0,`拦截 ${Rt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,K)}w=D.stickBad,h=j,f=B.moveYaw,d=ht},event(L,D){const X=Y0(L);z(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||U(L.type,X,D,L.tick))},gesture(L){const D=`${L.button}.${L.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&U(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,E,M)},suspend(L){_=E*1e3+L,g=-1,m=-1},setEnabled(L){r=L,L||(h=null,A=null,g=-1,m=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,g=-1,m=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,A=null,w=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,D=s.some(X=>L-X.t<8&&(X.kind==="dirJump"||X.kind==="aimDrop"||X.kind==="moveFreeze"||X.kind==="stickLost"||X.kind==="stickJump"||X.kind==="stickBad"||X.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:N0,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:G}}const Z0={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}]},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}]},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}]},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1}},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},q0={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},j0={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"}},K0={core:Z0,scene:q0,view:j0};function Fl(n){return JSON.parse(JSON.stringify(n))}const zl=K0,J0=Fl(zl.core),Ks=Fl(zl.scene),dn=Fl(zl.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ii{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),ii.nextNameID=ii.nextNameID||0,this.$name.id=`lil-gui-name-${++ii.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Q0 extends ii{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Dc(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const tg={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Dc,toHexString:Dc},Ds={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},eg={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Ds.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Ds.toHexString(a)}},ng={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Ds.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Ds.toHexString(a)}},ig=[tg,Ds,eg,ng];function ag(n){return ig.find(t=>t.match(n))}class sg extends ii{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ag(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Dc(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Fr extends ii{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class og extends ii{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},i=x=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+x),this.$input.value=this.getValue())},a=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),i(this._step*this._arrowKeyMultiplier(x)*-1))},s=x=>{this._inputFocused&&(x.preventDefault(),i(this._step*this._normalizeMouseWheel(x)))};let o=!1,r,l,c,h,f;const d=5,u=x=>{r=x.clientX,l=c=x.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",g),window.addEventListener("mouseup",y)},g=x=>{if(o){const _=x.clientX-r,v=x.clientY-l;Math.abs(v)>d?(x.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>d&&y()}if(!o){const _=x.clientY-c;f-=_*this._step*this._arrowKeyMultiplier(x),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=x.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",y)},m=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",m),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,x,_,v,A)=>(p-x)/(_-x)*(A-v)+v,e=p=>{const x=this.$slider.getBoundingClientRect();let _=t(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(_)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const x=p.touches[0].clientX-r,_=p.touches[0].clientY-l;Math.abs(x)>Math.abs(_)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),g=400;let y;const m=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const _=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(u,g)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",m,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class rg extends ii{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class cg extends ii{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const lg=`.lil-gui {
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
}`;function hg(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Xh=!1;class Jo{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Xh&&r&&(hg(lg),Xh=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new rg(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new og(this,t,e,i,a,s);case"boolean":return new Q0(this,t,e);case"string":return new cg(this,t,e);case"function":return new Fr(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new sg(this,t,e,i)}addFolder(t){const e=new Jo({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Fr||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Fr)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function dg(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Jo({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Jo({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=pt=>{const Ft=s.addFolder(pt);return l.push(Ft),Ft},h=(pt,Ft)=>{const it=pt.addFolder(Ft);return r.push(it),it},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),g=h(u,"基础移动参数");g.add(o,"moveSpeed",1,10,.1).name("移动速度"),g.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),g.add(o,"acceleration",1,40,.5).name("加速度"),g.add(o,"friction",1,40,.5).name("摩擦"),g.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),g.add(o,"gravity",5,60,.5).name("重力"),g.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),g.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),g.add(o,"characterRadius",.1,.8,.01).name("角色半径"),g.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),g.add(o,"strideLength",.3,3,.05).name("基础步幅"),g.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),g.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const y=h(u,"摇杆 / 输入");y.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),y.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const m=o.dash,p=h(u,"冲刺 / 闪避");p.add(m,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(m,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(m,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(m,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(m,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(m,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(m,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const x=o.separation,_=h(u,"角色间分离 / 挤压阻力");_.add(x,"iterations",1,8,1).name("迭代次数"),_.add(x,"slop",0,.05,.002).name("额外分离量 (m)"),_.add(x.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),_.add(x.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),_.add(x.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,A=h(u,"假人 AI");A.add(v,"moveSpeed",.5,8,.1).name("移动速度"),A.add(v,"wanderRadius",.5,8,.1).name("游走半径"),A.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),A.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),A.add(v,"keepDistance",1,10,.1).name("保持距离"),A.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),A.add(v,"attackRange",.5,5,.1).name("攻击距离"),A.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),A.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),w=h(S,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const E=h(S,"停步收相 / 胸朝向");E.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),E.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),E.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),E.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),E.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const M=h(S,"停步惯性");M.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),M.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),M.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),M.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),M.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),M.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),M.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(S,"足部 IK"),U=t.ik;P.add(U,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(U,"weight",0,1,.01).name("钉地权重"),P.add(U,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(U,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const z=h(S,"惯性倾斜 / 盆骨"),G=t.lean;z.add(G,"accelGain",0,.1,.002).name("前后加速度增益"),z.add(G,"turnGain",0,.2,.005).name("绕圈侧倾增益"),z.add(G,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),z.add(G,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),z.add(G,"smoothing",1,30,1).name("倾斜平滑速率"),z.add(G,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),z.add(G,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),z.add(G,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),z.add(G,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,D=h(S,"朝向 / 下盘带转");D.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),D.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),D.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),D.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),D.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),D.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const X=o.gaze,k=h(S,"接敌注视 / 俯仰 (v9s.18)");k.add(X,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(X,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(X,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(X,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(X,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(X,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(X,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(X,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(X,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(X,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(X,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const F=h(S,"原地转身 / 停步偏差 (v9s)"),B=o.turnInPlace;F.add(B,"enabled").name("启用原地转身 (关=纯插值)"),F.add(B,"triggerDeg",20,180,5).name("触发夹角 (°)"),F.add(B,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),F.add(B,"settleDeg",0,60,1).name("转身保留余角 (°)"),F.add(B,"durationSec",.1,1.5,.02).name("转身时长 (s)"),F.add(B,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),F.add(B,"inputDeadZone",0,.5,.01).name("起步输入死区"),F.add(B,"armSec",0,.5,.01).name("触发防抖 (s)"),F.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),F.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),F.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),F.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),F.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),F.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const ut=c("战斗 / 受击"),ot=o.combat,ht=h(ut,"连击 / 武器"),j=ht.add(n.combat,"weapon",la).name("当前武器");ht.add(ot,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ht.add(ot,"settle",0,.8,.01).name("段间停顿 (s)"),ht.add(ot,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ht.add(ot,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ht.add(ot,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ht.add(ot,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ht.add(ot,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ht.add(ot,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ht.add(ot,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ht.add(ot,"autoCombo").name("按住自动连击"),ht.add(ot.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ht.add(ot.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ht.add(ot.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const q=h(ut,"夸张化 (v9s.22)"),mt=t.animation.stretch;q.add(mt,"enabled").name("四肢伸缩 开"),q.add(mt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),q.add(mt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),q.add(mt,"impactSquash",0,.5,.01).name("命中挤压量"),q.add(mt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),q.add(mt,"torsoGain",0,1,.05).name("躯干跟随比例"),q.add(mt,"volumeExp",0,1.5,.05).name("体积补偿指数");const K=t.animation.swing;q.add(K,"enabled").name("挥击身体幅度 开"),q.add(K,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),q.add(K,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),q.add(K,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),q.add(K,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),q.add(K,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),q.add(K,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),q.add(K,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),q.add(K.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const yt=t.weaponTrail;q.add(yt,"enabled").name("挥击刀光 开"),q.add(yt,"life",.04,.4,.01).name("刀光残留 (s)"),q.add(yt,"intensity",0,1.5,.05).name("刀光亮度"),q.add(yt,"minStep",.005,.1,.005).name("采样最小位移 (m)"),q.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),q.add(t.hitstop,"enabled").name("命中定格 开"),q.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const Lt=t.weaponWrist;q.add(Lt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),q.add(Lt,"lag",0,.08,.002).name("臂速 → 腕滞后"),q.add(Lt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),q.add(Lt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),q.add(Lt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),q.add(Lt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const Ut=t.weaponMount;q.add(Ut,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),q.add(Ut,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),q.add(Ut,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),q.add(Ut,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),q.add(Ut,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),q.add(Ut,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),ht.add(ot.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ht.add(ot.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ht.add(ot.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ht.add(ot.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ht.add(ot.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ht.add(ot.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ht.add(ot.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ht.add(ot.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ht.add(ot.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ht.add(ot.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const $t=o.abilities;ht.add($t.arcane,"perWave",1,8,1).name("每波飞弹数"),ht.add($t.arcane,"waves",1,12,1).name("每次引导波数"),ht.add($t.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ht.add($t.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ht.add($t.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ht.add($t.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ht.add($t.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ht.add($t.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ht.add($t.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ht.add($t.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ht.add($t.arcane,"speed",3,24,.5).name("飞弹速度"),ht.add($t.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ht.add($t.ring,"radius",.5,5,.1).name("电环半径"),ht.add($t.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ht.add($t.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Tt=h(ut,"攻击动作 / 跨步 / 落地");Tt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Tt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Tt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const It=t.animation.stride;Tt.add(It,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Tt.add(It,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Tt.add(It,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Tt.add(It,"cycles",1,3,1).name("每段跨步周期数"),Tt.add(It,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Tt.add(It,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Tt.add(It,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Tt.add(It,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Tt.add(It,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Tt.add(It,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Tt.add(It,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Tt.add(It,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Tt.add(It,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Tt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Tt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Tt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Tt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Tt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Tt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Tt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Tt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Tt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Tt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Tt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Tt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const O=h(ut,"武器握持");O.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),O.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),O.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),O.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const ce=o.hits,Wt=h(ut,"命中 / 受击 / 击退");Wt.add(ce,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Wt.add(ce,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Wt.add(ce,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Wt.add(ce,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Wt.add(ce.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Wt.add(ce.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Wt.add(ce,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Wt.add(ce,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Ht=o.targeting,Nt=h(ut,"目标辅助");Nt.add(Ht,"targetAssist").name("启用目标辅助"),Nt.add(Ht,"range",1,14,.5).name("锁定范围 (m)"),Nt.add(Ht,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Nt.add(Ht,"frontBias",0,4,.1).name("朝向加权"),Nt.add(Ht,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Nt.add(Ht,"maxLungeScale",1,3,.1).name("前冲最大放大");const Rt=h(ut,"受击分层"),Pt=t.hurt;Rt.add(Pt,"enabled").name("启用分层受击 (关=旧版对照)"),Rt.add(Pt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Rt.add(Pt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Rt.add(Pt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Rt.add(Pt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Rt.add(Pt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Rt.add(Pt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Rt.add(Pt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Rt.add(Pt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Rt.add(Pt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Rt.add(Pt,"leanLight",0,1.5,.01).name("轻击力度"),Rt.add(Pt,"leanHeavy",0,1.5,.01).name("重击力度"),Rt.add(Pt,"leanKnock",0,1.5,.01).name("击退力度"),Rt.add(Pt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Pt.abdomen},{name:"打肩 (shoulder)",p:Pt.shoulder}].map(({name:pt,p:Ft})=>{const it=h(Rt,pt);return it.add(Ft,"upperPitch",0,2,.01).name("上身前后倾斜"),it.add(Ft,"upperRoll",0,2,.01).name("上身侧倾"),it.add(Ft,"upperYaw",0,1.5,.01).name("肩部扭转"),it.add(Ft,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),it.add(Ft,"shift",0,.8,.01).name("身体反应位移"),it.add(Ft,"drop",0,.4,.01).name("整体下沉"),it.add(Ft,"back",0,.4,.01).name("屁股向后"),it.add(Ft,"knee",0,1.6,.01).name("屈膝"),it.add(Ft,"hip",0,1,.01).name("髋前倾"),it.add(Ft,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),it});const C=h(ut,"派生招"),T=o.links;C.add(T,"enabled").name("总开关 (false=旧连击)"),C.add(T.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),C.add(T.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),C.add(T.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),C.add(T,"sharedCooldown",0,3,.05).name("共享 CD (s)"),C.add(T,"triggerWhileSprinting").name("长跑中可直接触发"),C.add(T.search,"range",1,14,.1).name("索敌距离 (m)"),C.add(T.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),C.add(T.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Y=T.moves["sword-shield"];Y&&(C.add(Y,"enabled").name("剑盾盾击"),C.add(Y,"distance",0,8,.1).name("冲锋极限 (m)"),C.add(Y,"windup",0,.5,.01).name("前摇 (s)"),C.add(Y,"active",0,.8,.01).name("冲锋 / 命中 (s)"),C.add(Y,"recovery",0,.8,.01).name("收势 (s)"),C.add(Y.hit,"radius",0,4,.05).name("命中半径 (m)"),C.add(Y.hit,"width",0,2,.05).name("扫掠半径 (m)"),C.add(Y.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),C.add(Y.hit,"duration",0,1.5,.01).name("僵直 (s)")),C.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const lt=c("相机"),dt=h(lt,"基础");dt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),dt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),dt.add(t.camera,"distance",6,35,.5).name("距离"),dt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),dt.add(t.camera,"fov",25,90,1).name("FOV");const at=o.camera,Dt=h(lt,"智能构图");Dt.add(at,"radius",2,18,.5).name("威胁评估半径 (m)"),Dt.add(at,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Dt.add(at,"saturation",.5,8,.1).name("威胁归一化饱和"),Dt.add(at,"pushIn",0,.5,.01).name("无威胁推进比例"),Dt.add(at,"maxPullback",0,1,.02).name("最大拉远比例"),Dt.add(at,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Dt.add(at,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Dt.add(at,"framingBias",0,1,.05).name("威胁质心平移系数"),Dt.add(at,"attackBoost",0,2,.05).name("挥砍中额外加权"),Dt.add(at.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Dt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const J=h(lt,"缩放");return J.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),J.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),J.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),J.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),J.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),J.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),J.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),J.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(pt=>pt.close()),l.forEach(pt=>pt.close()),s.close(),{gui:s,refreshWeapon:()=>j.updateDisplay()}}function ug(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function fg(n,t){return n.find(e=>e.id===t)??null}function Wh(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function pg({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(m){c.textContent=`${m.index} · ${m.name} — ${m.hint}`,c.style.borderColor=m.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return ug(n,t.character.position.x,t.character.position.z)}function u(){const m=d(),p=(m==null?void 0:m.id)??null;if(p===o)return;const x=o!==null;o=p;for(const[_,v]of l)v.classList.toggle("is-active",_===p);r&&(r.textContent=m?`${m.index} · ${m.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=m?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),m?f(m):x&&c.classList.remove("is-on")}function g(m){const p=typeof m=="number"?n.find(x=>x.index===m)??null:fg(n,m);return p?(n0(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function y(){Vu(t)}if(s){s.textContent="";const m=document.createElement("div");m.className="lab-head",m.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",m.appendChild(p),s.appendChild(m);for(const v of[...n].sort((A,S)=>A.index-S.index)){const A=document.createElement("button");A.type="button",A.className="lab-row",A.dataset.station=v.id,A.dataset.uiButton="",A.style.setProperty("--lab-color",v.color),A.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const w=document.createElement("span");w.className="lab-name",w.textContent=v.name,A.append(S,w),A.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(v.id)}),s.appendChild(A),l.set(v.id,A)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const x=document.createElement("div");x.className="lab-foot";const _=document.createElement("button");if(_.type="button",_.className="lab-btn",_.dataset.uiButton="",_.textContent="召回假人",_.setAttribute("aria-label","召回全部假人回到各自工位"),_.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),y()}),x.appendChild(_),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),a()}),x.appendChild(v)}s.appendChild(x)}return window.addEventListener("keydown",m=>{var p,x;if(!(m.metaKey||m.ctrlKey||m.altKey))if(m.key==="["){const _=Wh(n,((p=d())==null?void 0:p.id)??o,-1);_&&g(_.id)}else if(m.key==="]"){const _=Wh(n,((x=d())==null?void 0:x.id)??o,1);_&&g(_.id)}else m.key==="\\"&&y()}),u(),{goto:g,current:d,tick:u,recall:y,element:s}}const zr=Math.PI*2,Qn={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},mg=45,gg=50;function xg(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function us(n,t,e){const i=xg(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function vg(n,t){return Math.atan2(n,-t)*180/Math.PI}function Yh(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Js(n){return(n%360+360)%360}const _g={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function yg(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?us(s.moveX,s.moveZ,e):null,f=c>.15?us(l.x,l.z,e):null,d=us(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?us(s.aimX,s.aimZ,e):null,g=n.targeting,y=g.hasTarget?us(Math.sin(g.targetYaw),Math.cos(g.targetYaw),e):null,m=h!==null&&f!==null?Yh(h,f):null,p=h!==null?Yh(h,d):null,x=m!==null&&m>mg&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?vg(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:y,lockId:g.targetId,lockDist:g.targetDist,aimDeg:u,gapMove:m,gapFace:p,warnMove:x}}function $h(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>gg&&(n.inLen>=.35||n.speed>=.4)}const Zh="harness.dirDebug";function Mg(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Zh)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(_){if(l=_,!t)try{window.localStorage.setItem(Zh,_?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",_=>{_.preventDefault(),_.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",_=>{_.key.toLowerCase()==="v"&&!_.metaKey&&!_.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=_g,g=0,y="",m=8;function p(_){if(!r)return;const v=d,A=d,S=v/2,w=A/2,E=Math.min(v,A)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,A),r.beginPath(),r.arc(S,w,E,0,zr),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=_.warnMove?"rgba(251, 191, 36, 0.85)":Qn.ring,r.stroke(),r.strokeStyle=Qn.grid,r.beginPath(),r.moveTo(S-E,w),r.lineTo(S+E,w),r.moveTo(S,w-E),r.lineTo(S,w+E),r.stroke();for(let U=0;U<8;U++){const z=U*Math.PI/4,G=S+Math.sin(z)*(E-3),L=w-Math.cos(z)*(E-3),D=S+Math.sin(z)*E,X=w-Math.cos(z)*E;r.beginPath(),r.moveTo(G,L),r.lineTo(D,X),r.stroke()}const M=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;M>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=Qn.dead,r.beginPath(),r.arc(S,w,E*M,0,zr),r.stroke(),r.restore());const b=(U,z,G,L,D=!1,X=1)=>{const k=U*Math.PI/180,F=Math.sin(k),B=-Math.cos(k),ut=E*Math.max(.14,Math.min(1,z)),ot=S+F*E*.14,ht=w+B*E*.14,j=S+F*ut,q=w+B*ut;if(r.save(),r.globalAlpha=X,r.strokeStyle=G,r.fillStyle=G,r.lineWidth=L,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ot,ht),r.lineTo(j,q),r.stroke(),!D&&ut>E*.3){const mt=-B,K=F,yt=5.2;r.beginPath(),r.moveTo(j+F*1.5,q+B*1.5),r.lineTo(j-F*yt+mt*yt*.72,q-B*yt+K*yt*.72),r.lineTo(j-F*yt-mt*yt*.72,q-B*yt-K*yt*.72),r.closePath(),r.fill()}r.restore()},P=(U,z)=>{const G=U*Math.PI/180,L=Math.sin(G),D=-Math.cos(G),X=-D,k=L,F=E+1.5,B=F+6.5;r.save(),r.fillStyle=z,r.strokeStyle=z,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*B,w+D*B),r.lineTo(S+L*F+X*4,w+D*F+k*4),r.lineTo(S+L*F-X*4,w+D*F-k*4),r.closePath(),r.fill(),r.restore()};_.lockDeg!==null&&b(_.lockDeg,1,Qn.lock,1,!0,.7),_.rawDeg!==null&&_.stickHeld&&b(_.rawDeg,_.rawLen,Qn.raw,1,!0,.9),_.aimDeg!==null&&b(_.aimDeg,1,Qn.aim,1.6,!0,.95),b(_.faceDeg,1,Qn.face,1.1,!0,.55),_.moveDeg!==null&&b(_.moveDeg,_.speed/Math.max(1,m),Qn.move,5.5,!1,.8),_.inDeg!==null&&b(_.inDeg,_.inLen,Qn.input,2.2),P(_.faceDeg,Qn.face),r.beginPath(),r.arc(S,w,2.2,0,zr),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function x(_,v){const A=E=>E===null?"-":String(Math.round(Js(E)));o.in.textContent=`入 ${A(_.inDeg)}`,o.mv.textContent=`移 ${A(_.moveDeg)}`,o.fc.textContent=`面 ${A(_.faceDeg)}`;const S=E=>E===null?"-":`${Math.round(E)}°`,w=[`Δ入→移 ${S(_.gapMove)}`,`Δ入→面 ${S(_.gapFace)}`];_.speed>.05&&w.push(`v${_.speed.toFixed(1)}`),_.lockDeg!==null&&w.push(`锁#${_.lockId} ${_.lockDist.toFixed(1)}m`),_.aimDeg!==null&&w.push("拖拽瞄准"),o.gap.textContent=w.join("  "),e.classList.toggle("is-warn",_.warnMove||$h(_,v))}return{update(_,v,A){if(!l)return;m=Math.max(1,_.config.moveSpeed*Math.max(1,_.config.sprintMultiplier));const S=yg(_,v,A,m);u=S;const w=_.combat.phase!=="idle";p(S);const E=performance.now(),M=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(E-g>90||M!==y)&&(g=E,y=M,x(S,w),e.dataset.in=S.inDeg===null?"":Js(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Js(S.moveDeg).toFixed(1),e.dataset.fc=Js(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||$h(S,w)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const bg=6,Sg=480,qh=240,jh=92,wg=18;function Eg(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function Tg(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function Ag(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Rg(n={}){const t=Math.max(1,n.windowS??bg),e=Math.max(60,n.capacity??Sg),i=Math.max(1,n.speedCap??wg),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(qh*u),l.height=Math.round(jh*u);const g=Mg({deadZone:n.deadZone,container:f,embedded:!0});let y=!1;function m(E){y=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}m(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),m(!y)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&m(!y)}));const p=[];let x=0,_=null,v=-1,A={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(E){const M=E-t;let b=0;for(;b<p.length&&p[b].t<M;)b++;return p.slice(b)}function w(E,M){if(!d)return;const b=qh,P=jh;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,b,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,b,P);const U=4,z=4,G=b-U-z,L=9,D=46,X=62,k=22,F=M-t,B=K=>U+Math.max(0,Math.min(1,(K-F)/t))*G;for(let K=0;K<E.length;K++){if(!E[K].busy)continue;const yt=B(E[K].t),Lt=K+1<E.length?B(E[K+1].t):yt+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(yt,L,Math.max(2,Lt-yt),D)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const K of[L,L+D/2,L+D])d.moveTo(U,K),d.lineTo(b-z,K);d.moveTo(U,X+k/2),d.lineTo(b-z,X+k/2),d.stroke();const ot=Math.max(1,...E.map(K=>K.speed),...E.map(K=>K.drive))*1.15,ht=K=>L+D-K/ot*D;if(E.length>1){d.beginPath(),d.moveTo(B(E[0].t),ht(E[0].speed));for(let K=1;K<E.length;K++)d.lineTo(B(E[K].t),ht(E[K].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(B(E[E.length-1].t),L+D),d.lineTo(B(E[0].t),L+D),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(B(E[0].t),ht(E[0].drive));for(let K=1;K<E.length;K++)d.lineTo(B(E[K].t),ht(E[K].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let j=.02;for(const K of E)j=Math.max(j,Math.abs(K.dv));j*=1.1;const q=X+k/2,mt=k/2;for(const K of E){const yt=Math.min(mt,Math.abs(K.dv)/j*mt);d.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(B(K.t)-.7,K.dv>=0?q-yt:q,1.4,Math.max(.5,yt))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ot.toFixed(1),U+2,L+8),d.fillText("v",U+2,L+D-2),d.fillText("Δv",U+2,X+9),d.textAlign="right",d.fillText("0",b-z-2,L+D-2),d.textAlign="left"}return{dirDebug:g,update(E,M,b){const P=performance.now()/1e3,U=v<0?1/60:Math.max(1e-4,Math.min(.25,P-v));v=P;const z=E.character,G={x:z.position.x,z:z.position.z},L=Math.hypot(z.velocity.x,z.velocity.z),{speed:D,raw:X}=_?Tg(_,G,U,i):{speed:0,raw:0},k=Eg(x,D,U,P);k.drive=L,k.raw=X,k.busy=Ag(E),_=G,x=D,p.push(k),p.length>e&&p.shift();const F=S(P);let B=0;for(const ut of F)B=Math.max(B,ut.speed);if(A={speed:D,drive:L,raw:X,dv:k.dv,accel:k.accel,peak:B,samples:F.length,windowS:t,busy:k.busy},g.update(E,M,b),y){w(F,P);const ut=k.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${B.toFixed(2)} · Δv ${ut}${k.dv.toFixed(3)} · ${F.length} 帧`}},setEnabled:m,toggle(){return m(!y),y},enabled:()=>y,last:()=>({...A}),samples:()=>S(performance.now()/1e3).map(E=>({...E}))}}const Pg=["剑盾","双剑","大剑","法杖","弓"],Cg={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function Lg(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=Tt=>Tt.toFixed(2),g=Tt=>(Tt*180/Math.PI).toFixed(0),y=Pg[la.indexOf(f.weapon)]??f.weapon,m=Math.round(f.charge*10),p="|".repeat(m)+".".repeat(10-m),x=t.dash,_=x.phase==="active"&&x.duration>0?(1-x.timer/x.duration)*100:0,v=x.phase==="active"?`${x.kind}@${_.toFixed(0)}%`:`${x.kind} cd${u(x.cooldown)}`,A=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),w=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),E=Math.abs(S)+Math.abs(w)+1e-6,M=Math.round(Math.abs(w)/E*100),b=`strafe ${M}%${S<-.05?" back":""}`,P=t.camera,U=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,z=o?u(o.attackBlend):"-",G=o==null?void 0:o.attackWeights,L=G?`gw ${u(G.gaitScale)}  lw ${u(G.attackLegWeight)}  spd ${u(G.driveSpeed)}`:"-",D=G?`${u(G.gaitScale)}/${u(G.attackLegWeight)}`:"-",X=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",k=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",F=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",B=o==null?void 0:o.hurt,ut=B?`hurt ${t.playerHurt.type}  部位h${u(B.hitHeight)}  脉冲p${u(B.pulse)}  上身${u(B.upperShift)}  重心${u(B.comShift)}  后坐${u(B.pelvisBack)}  屈膝${u(B.knee)}`:"-",ot=B?`${u(B.hitHeight)}/${u(B.pulse)}/${u(B.knee)}`:"-",ht=o==null?void 0:o.ik,j=ht?`${ht.active?"on":"off"} w${u(ht.weight)} e${u(ht.maxError)}`:"-",q=t.playerLink,mt=`link ${q.kind||"-"}  ${q.phase}  prog ${u(q.progress)}  win ${u(q.linkWindow)}s  cd ${u(q.cooldown)}s  hits ${q.hitIds.length}  travel ${u(q.travelled)}/${u(q.travel)}m  id ${q.id}`,K=`${q.phase}/${q.kind||"-"}/w${u(q.linkWindow)}`,yt=a.lastGesture,Lt=yt?`${yt.button} ${yt.kind} ${yt.heldMs.toFixed(0)}ms d${yt.distance.toFixed(0)}px ${yt.angleDeg.toFixed(0)}° taps${yt.taps}`:"-",Ut=t.dummies.map(Tt=>`${Tt.id}:${Cg[Tt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${y} ${f.phase} · lk ${q.phase}${q.kind?`/${q.kind}`:""} w${u(q.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  st${M}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${y}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${z}  gw/lw ${D}  land ${k}  ik ${j}`,`aim ${A}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ot}`,`dummies ${Ut}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${F}  lk ${K}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${Lt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${g(l.facing)}deg   atkBlend ${z}   ${L}   land ${X}`,ut,`ik ${j}  clamped ${ht?ht.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${g(l.facing)}  body ${g(l.bodyYaw)}  head ${g(l.headYaw)}  move ${g(l.moveYaw)}  (head-body ${g(l.headYaw-l.bodyYaw)})  ${b}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${A}`,`weapon ${y}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${x.kind}  phase ${x.phase}  prog ${_.toFixed(0)}%  cd ${u(x.cooldown)}s  id ${x.id}  from (${u(x.fromX)},${u(x.fromZ)}) → to (${u(x.toX)},${u(x.toZ)})`,mt,`camera ${U}  ${F}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${g(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${Ut}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${Lt}`].join(`
`)}}}const Qs=["lab","hud","motion","debug"],Kh={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Jh={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Dg(n){var l;const t=Object.fromEntries(Qs.map(c=>[c,document.getElementById(Jh[c].toggle)])),e=Object.fromEntries(Qs.map(c=>[c,document.getElementById(Jh[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of Qs){const u=a===d,g=t[d],y=e[d];g&&(g.setAttribute("aria-expanded",String(u)),g.textContent=`${Kh[d].short} ${u?"▾":"▸"}`,g.setAttribute("aria-label",`${u?"收起":"展开"}${Kh[d].full}`)),y&&y.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Qs)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ul="170",kg=0,Qh=1,Ig=2,Ku=1,Ju=2,gi=3,Ni=0,An=1,Ve=2,zi=0,Wa=1,Li=2,td=3,ed=4,Fg=5,aa=100,zg=101,Ug=102,Ng=103,Og=104,Bg=200,Hg=201,Gg=202,Vg=203,kc=204,Ic=205,Xg=206,Wg=207,Yg=208,$g=209,Zg=210,qg=211,jg=212,Kg=213,Jg=214,Fc=0,zc=1,Uc=2,Ka=3,Nc=4,Oc=5,Bc=6,Hc=7,Nl=0,Qg=1,tx=2,Ui=0,ex=1,nx=2,ix=3,ax=4,sx=5,ox=6,rx=7,Qu=300,Ja=301,Qa=302,Gc=303,Vc=304,lr=306,Xc=1e3,oa=1001,Wc=1002,qn=1003,cx=1004,to=1005,ni=1006,Ur=1007,ra=1008,Mi=1009,tf=1010,ef=1011,ks=1012,Ol=1013,ha=1014,vi=1015,Hs=1016,Bl=1017,Hl=1018,ts=1020,nf=35902,af=1021,sf=1022,Zn=1023,of=1024,rf=1025,Ya=1026,es=1027,cf=1028,Gl=1029,lf=1030,Vl=1031,Xl=1033,zo=33776,Uo=33777,No=33778,Oo=33779,Yc=35840,$c=35841,Zc=35842,qc=35843,jc=36196,Kc=37492,Jc=37496,Qc=37808,tl=37809,el=37810,nl=37811,il=37812,al=37813,sl=37814,ol=37815,rl=37816,cl=37817,ll=37818,hl=37819,dl=37820,ul=37821,Bo=36492,fl=36494,pl=36495,hf=36283,ml=36284,gl=36285,xl=36286,lx=3200,hx=3201,df=0,dx=1,Di="",yn="srgb",is="srgb-linear",hr="linear",ke="srgb",ba=7680,nd=519,ux=512,fx=513,px=514,uf=515,mx=516,gx=517,xx=518,vx=519,vl=35044,id=35048,ad="300 es",_i=2e3,Qo=2001;class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let sd=1234567;const $a=Math.PI/180,Is=180/Math.PI;function ai(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(gn[n&255]+gn[n>>8&255]+gn[n>>16&255]+gn[n>>24&255]+"-"+gn[t&255]+gn[t>>8&255]+"-"+gn[t>>16&15|64]+gn[t>>24&255]+"-"+gn[e&63|128]+gn[e>>8&255]+"-"+gn[e>>16&255]+gn[e>>24&255]+gn[i&255]+gn[i>>8&255]+gn[i>>16&255]+gn[i>>24&255]).toLowerCase()}function un(n,t,e){return Math.max(t,Math.min(e,n))}function Wl(n,t){return(n%t+t)%t}function _x(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function yx(n,t,e){return n!==t?(e-n)/(t-n):0}function ws(n,t,e){return(1-e)*n+e*t}function Mx(n,t,e,i){return ws(n,t,1-Math.exp(-e*i))}function bx(n,t=1){return t-Math.abs(Wl(n,t*2)-t)}function Sx(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function wx(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Ex(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Tx(n,t){return n+Math.random()*(t-n)}function Ax(n){return n*(.5-Math.random())}function Rx(n){n!==void 0&&(sd=n);let t=sd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Px(n){return n*$a}function Cx(n){return n*Is}function Lx(n){return(n&n-1)===0&&n!==0}function Dx(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function kx(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ix(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),g=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*g,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*g,r*c);break;case"ZYZ":n.set(l*g,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function $n(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ce(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const od={DEG2RAD:$a,RAD2DEG:Is,generateUUID:ai,clamp:un,euclideanModulo:Wl,mapLinear:_x,inverseLerp:yx,lerp:ws,damp:Mx,pingpong:bx,smoothstep:Sx,smootherstep:wx,randInt:Ex,randFloat:Tx,randFloatSpread:Ax,seededRandom:Rx,degToRad:Px,radToDeg:Cx,isPowerOfTwo:Lx,ceilPowerOfTwo:Dx,floorPowerOfTwo:kx,setQuaternionFromProperEuler:Ix,normalize:Ce,denormalize:$n};class Xt{constructor(t=0,e=0){Xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(un(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class le{constructor(t,e,i,a,s,o,r,l,c){le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],g=i[8],y=a[0],m=a[3],p=a[6],x=a[1],_=a[4],v=a[7],A=a[2],S=a[5],w=a[8];return s[0]=o*y+r*x+l*A,s[3]=o*m+r*_+l*S,s[6]=o*p+r*v+l*w,s[1]=c*y+h*x+f*A,s[4]=c*m+h*_+f*S,s[7]=c*p+h*v+f*w,s[2]=d*y+u*x+g*A,s[5]=d*m+u*_+g*S,s[8]=d*p+u*v+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,g=e*f+i*d+a*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=f*y,t[1]=(a*c-h*i)*y,t[2]=(r*i-a*o)*y,t[3]=d*y,t[4]=(h*e-a*l)*y,t[5]=(a*s-r*e)*y,t[6]=u*y,t[7]=(i*l-c*e)*y,t[8]=(o*e-i*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Nr.makeScale(t,e)),this}rotate(t){return this.premultiply(Nr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Nr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Nr=new le;function ff(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function tr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Fx(){const n=tr("canvas");return n.style.display="block",n}const rd={};function Ms(n){n in rd||(rd[n]=!0,console.warn(n))}function zx(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Ux(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Nx(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const be={enabled:!0,workingColorSpace:is,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ke&&(n.r=yi(n.r),n.g=yi(n.g),n.b=yi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ke&&(n.r=Za(n.r),n.g=Za(n.g),n.b=Za(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Di?hr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Za(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const cd=[.64,.33,.3,.6,.15,.06],ld=[.2126,.7152,.0722],hd=[.3127,.329],dd=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ud=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);be.define({[is]:{primaries:cd,whitePoint:hd,transfer:hr,toXYZ:dd,fromXYZ:ud,luminanceCoefficients:ld,workingColorSpaceConfig:{unpackColorSpace:yn},outputColorSpaceConfig:{drawingBufferColorSpace:yn}},[yn]:{primaries:cd,whitePoint:hd,transfer:ke,toXYZ:dd,fromXYZ:ud,luminanceCoefficients:ld,outputColorSpaceConfig:{drawingBufferColorSpace:yn}}});let Sa;class Ox{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Sa===void 0&&(Sa=tr("canvas")),Sa.width=t.width,Sa.height=t.height;const i=Sa.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Sa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=tr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=yi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(yi(e[i]/255)*255):e[i]=yi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Bx=0;class pf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bx++}),this.uuid=ai(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Or(a[o].image)):s.push(Or(a[o]))}else s=Or(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Or(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ox.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Hx=0;class Sn extends as{constructor(t=Sn.DEFAULT_IMAGE,e=Sn.DEFAULT_MAPPING,i=oa,a=oa,s=ni,o=ra,r=Zn,l=Mi,c=Sn.DEFAULT_ANISOTROPY,h=Di){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=ai(),this.name="",this.source=new pf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Qu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xc:t.x=t.x-Math.floor(t.x);break;case oa:t.x=t.x<0?0:1;break;case Wc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xc:t.y=t.y-Math.floor(t.y);break;case oa:t.y=t.y<0?0:1;break;case Wc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Sn.DEFAULT_IMAGE=null;Sn.DEFAULT_MAPPING=Qu;Sn.DEFAULT_ANISOTROPY=1;class qe{constructor(t=0,e=0,i=0,a=1){qe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,v=(u+1)/2,A=(p+1)/2,S=(h+d)/4,w=(f+y)/4,E=(g+m)/4;return _>v&&_>A?_<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(_),a=S/i,s=w/i):v>A?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=E/a):A<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(A),i=w/s,a=E/s),this.set(i,a,s,e),this}let x=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(f-y)/x,this.z=(d-h)/x,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Gx extends as{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new qe(0,0,t,e),this.scissorTest=!1,this.viewport=new qe(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Sn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new pf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class da extends Gx{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class mf extends Sn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=qn,this.minFilter=qn,this.wrapR=oa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vx extends Sn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=qn,this.minFilter=qn,this.wrapR=oa,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gs{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],g=s[o+2],y=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=g,t[e+3]=y;return}if(f!==y||l!==d||c!==u||h!==g){let m=1-r;const p=l*d+c*u+h*g+f*y,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const A=Math.sqrt(_),S=Math.atan2(A,p*x);m=Math.sin(m*S)/A,r=Math.sin(r*S)/A}const v=r*x;if(l=l*m+d*v,c=c*m+u*v,h=h*m+g*v,f=f*m+y*v,m===1-r){const A=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=A,c*=A,h*=A,f*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],g=s[o+3];return t[e]=r*g+h*f+l*u-c*d,t[e+1]=l*g+h*d+c*f-r*u,t[e+2]=c*g+h*u+r*d-l*f,t[e+3]=h*g-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),g=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"YXZ":this._x=d*h*f+c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"ZXY":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f-d*u*g;break;case"ZYX":this._x=d*h*f-c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f+d*u*g;break;case"YZX":this._x=d*h*f+c*u*g,this._y=c*u*f+d*h*g,this._z=c*h*g-d*u*f,this._w=c*h*f-d*u*g;break;case"XZY":this._x=d*h*f-c*u*g,this._y=c*u*f-d*h*g,this._z=c*h*g+d*u*f,this._w=c*h*f+d*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(un(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,i=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(fd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(fd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Br.copy(this).projectOnVector(t),this.sub(Br)}reflect(t){return this.sub(Br.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(un(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Br=new V,fd=new Gs;class Vs{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Xn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Xn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Xn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,Xn):Xn.fromBufferAttribute(s,o),Xn.applyMatrix4(t.matrixWorld),this.expandByPoint(Xn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),eo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),eo.copy(i.boundingBox)),eo.applyMatrix4(t.matrixWorld),this.union(eo)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Xn),Xn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(fs),no.subVectors(this.max,fs),wa.subVectors(t.a,fs),Ea.subVectors(t.b,fs),Ta.subVectors(t.c,fs),Ei.subVectors(Ea,wa),Ti.subVectors(Ta,Ea),Yi.subVectors(wa,Ta);let e=[0,-Ei.z,Ei.y,0,-Ti.z,Ti.y,0,-Yi.z,Yi.y,Ei.z,0,-Ei.x,Ti.z,0,-Ti.x,Yi.z,0,-Yi.x,-Ei.y,Ei.x,0,-Ti.y,Ti.x,0,-Yi.y,Yi.x,0];return!Hr(e,wa,Ea,Ta,no)||(e=[1,0,0,0,1,0,0,0,1],!Hr(e,wa,Ea,Ta,no))?!1:(io.crossVectors(Ei,Ti),e=[io.x,io.y,io.z],Hr(e,wa,Ea,Ta,no))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Xn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Xn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hi=[new V,new V,new V,new V,new V,new V,new V,new V],Xn=new V,eo=new Vs,wa=new V,Ea=new V,Ta=new V,Ei=new V,Ti=new V,Yi=new V,fs=new V,no=new V,io=new V,$i=new V;function Hr(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){$i.fromArray(n,s);const r=a.x*Math.abs($i.x)+a.y*Math.abs($i.y)+a.z*Math.abs($i.z),l=t.dot($i),c=e.dot($i),h=i.dot($i);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Xx=new Vs,ps=new V,Gr=new V;class dr{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Xx.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ps.subVectors(t,this.center);const e=ps.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(ps,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Gr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ps.copy(t.center).add(Gr)),this.expandByPoint(ps.copy(t.center).sub(Gr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const di=new V,Vr=new V,ao=new V,Ai=new V,Xr=new V,so=new V,Wr=new V;class Yl{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,di)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=di.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(di.copy(this.origin).addScaledVector(this.direction,e),di.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Vr.copy(t).add(e).multiplyScalar(.5),ao.copy(e).sub(t).normalize(),Ai.copy(this.origin).sub(Vr);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ao),r=Ai.dot(this.direction),l=-Ai.dot(ao),c=Ai.lengthSq(),h=Math.abs(1-o*o);let f,d,u,g;if(h>0)if(f=o*l-r,d=o*r-l,g=s*h,f>=0)if(d>=-g)if(d<=g){const y=1/h;f*=y,d*=y,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(Vr).addScaledVector(ao,d),u}intersectSphere(t,e){di.subVectors(t.center,this.origin);const i=di.dot(this.direction),a=di.dot(di)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,di)!==null}intersectTriangle(t,e,i,a,s){Xr.subVectors(e,t),so.subVectors(i,t),Wr.crossVectors(Xr,so);let o=this.direction.dot(Wr),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Ai.subVectors(this.origin,t);const l=r*this.direction.dot(so.crossVectors(Ai,so));if(l<0)return null;const c=r*this.direction.dot(Xr.cross(Ai));if(c<0||l+c>o)return null;const h=-r*Ai.dot(Wr);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oe{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m){Oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,g,y,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Aa.setFromMatrixColumn(t,0).length(),s=1/Aa.setFromMatrixColumn(t,1).length(),o=1/Aa.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+g*c,e[5]=d-y*c,e[9]=-r*l,e[2]=y-d*c,e[6]=g+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d+y*r,e[4]=g*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-g,e[6]=y+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,g=c*h,y=c*f;e[0]=d-y*r,e[4]=-o*f,e[8]=g+u*r,e[1]=u+g*r,e[5]=o*h,e[9]=y-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,g=r*h,y=r*f;e[0]=l*h,e[4]=g*c-u,e[8]=d*c+y,e[1]=l*f,e[5]=y*c+d,e[9]=u*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=y-d*f,e[8]=g*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+g,e[10]=d-y*f}else if(t.order==="XZY"){const d=o*l,u=o*c,g=r*l,y=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+y,e[5]=o*h,e[9]=u*f-g,e[2]=g*f-u,e[6]=r*h,e[10]=y*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wx,t,Yx)}lookAt(t,e,i){const a=this.elements;return Pn.subVectors(t,e),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Ri.crossVectors(i,Pn),Ri.lengthSq()===0&&(Math.abs(i.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Ri.crossVectors(i,Pn)),Ri.normalize(),oo.crossVectors(Pn,Ri),a[0]=Ri.x,a[4]=oo.x,a[8]=Pn.x,a[1]=Ri.y,a[5]=oo.y,a[9]=Pn.y,a[2]=Ri.z,a[6]=oo.z,a[10]=Pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],g=i[2],y=i[6],m=i[10],p=i[14],x=i[3],_=i[7],v=i[11],A=i[15],S=a[0],w=a[4],E=a[8],M=a[12],b=a[1],P=a[5],U=a[9],z=a[13],G=a[2],L=a[6],D=a[10],X=a[14],k=a[3],F=a[7],B=a[11],ut=a[15];return s[0]=o*S+r*b+l*G+c*k,s[4]=o*w+r*P+l*L+c*F,s[8]=o*E+r*U+l*D+c*B,s[12]=o*M+r*z+l*X+c*ut,s[1]=h*S+f*b+d*G+u*k,s[5]=h*w+f*P+d*L+u*F,s[9]=h*E+f*U+d*D+u*B,s[13]=h*M+f*z+d*X+u*ut,s[2]=g*S+y*b+m*G+p*k,s[6]=g*w+y*P+m*L+p*F,s[10]=g*E+y*U+m*D+p*B,s[14]=g*M+y*z+m*X+p*ut,s[3]=x*S+_*b+v*G+A*k,s[7]=x*w+_*P+v*L+A*F,s[11]=x*E+_*U+v*D+A*B,s[15]=x*M+_*z+v*X+A*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],g=t[3],y=t[7],m=t[11],p=t[15];return g*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+y*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+m*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],g=t[12],y=t[13],m=t[14],p=t[15],x=f*m*c-y*d*c+y*l*u-r*m*u-f*l*p+r*d*p,_=g*d*c-h*m*c-g*l*u+o*m*u+h*l*p-o*d*p,v=h*y*c-g*f*c+g*r*u-o*y*u-h*r*p+o*f*p,A=g*f*l-h*y*l-g*r*d+o*y*d+h*r*m-o*f*m,S=e*x+i*_+a*v+s*A;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/S;return t[0]=x*w,t[1]=(y*d*s-f*m*s-y*a*u+i*m*u+f*a*p-i*d*p)*w,t[2]=(r*m*s-y*l*s+y*a*c-i*m*c-r*a*p+i*l*p)*w,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*w,t[4]=_*w,t[5]=(h*m*s-g*d*s+g*a*u-e*m*u-h*a*p+e*d*p)*w,t[6]=(g*l*s-o*m*s-g*a*c+e*m*c+o*a*p-e*l*p)*w,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*w,t[8]=v*w,t[9]=(g*f*s-h*y*s-g*i*u+e*y*u+h*i*p-e*f*p)*w,t[10]=(o*y*s-g*r*s+g*i*c-e*y*c-o*i*p+e*r*p)*w,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*w,t[12]=A*w,t[13]=(h*y*a-g*f*a+g*i*d-e*y*d-h*i*m+e*f*m)*w,t[14]=(g*r*a-o*y*a-g*i*l+e*y*l+o*i*m-e*r*m)*w,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*w,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,g=s*f,y=o*h,m=o*f,p=r*f,x=l*c,_=l*h,v=l*f,A=i.x,S=i.y,w=i.z;return a[0]=(1-(y+p))*A,a[1]=(u+v)*A,a[2]=(g-_)*A,a[3]=0,a[4]=(u-v)*S,a[5]=(1-(d+p))*S,a[6]=(m+x)*S,a[7]=0,a[8]=(g+_)*w,a[9]=(m-x)*w,a[10]=(1-(d+y))*w,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Aa.set(a[0],a[1],a[2]).length();const o=Aa.set(a[4],a[5],a[6]).length(),r=Aa.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],Wn.copy(this);const c=1/s,h=1/o,f=1/r;return Wn.elements[0]*=c,Wn.elements[1]*=c,Wn.elements[2]*=c,Wn.elements[4]*=h,Wn.elements[5]*=h,Wn.elements[6]*=h,Wn.elements[8]*=f,Wn.elements[9]*=f,Wn.elements[10]*=f,e.setFromRotationMatrix(Wn),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=_i){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,g;if(r===_i)u=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(r===Qo)u=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=_i){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let g,y;if(r===_i)g=(o+s)*f,y=-2*f;else if(r===Qo)g=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=y,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Aa=new V,Wn=new Oe,Wx=new V(0,0,0),Yx=new V(1,1,1),Ri=new V,oo=new V,Pn=new V,pd=new Oe,md=new Gs;class si{constructor(t=0,e=0,i=0,a=si.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(un(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-un(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(un(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-un(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(un(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-un(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return pd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(pd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return md.setFromEuler(this),this.setFromQuaternion(md,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class $l{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $x=0;const gd=new V,Ra=new Gs,ui=new Oe,ro=new V,ms=new V,Zx=new V,qx=new Gs,xd=new V(1,0,0),vd=new V(0,1,0),_d=new V(0,0,1),yd={type:"added"},jx={type:"removed"},Pa={type:"childadded",child:null},Yr={type:"childremoved",child:null};class We extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$x++}),this.uuid=ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=We.DEFAULT_UP.clone();const t=new V,e=new si,i=new Gs,a=new V(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Oe},normalMatrix:{value:new le}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=We.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $l,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ra.setFromAxisAngle(t,e),this.quaternion.multiply(Ra),this}rotateOnWorldAxis(t,e){return Ra.setFromAxisAngle(t,e),this.quaternion.premultiply(Ra),this}rotateX(t){return this.rotateOnAxis(xd,t)}rotateY(t){return this.rotateOnAxis(vd,t)}rotateZ(t){return this.rotateOnAxis(_d,t)}translateOnAxis(t,e){return gd.copy(t).applyQuaternion(this.quaternion),this.position.add(gd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(xd,t)}translateY(t){return this.translateOnAxis(vd,t)}translateZ(t){return this.translateOnAxis(_d,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ro.copy(t):ro.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(ms,ro,this.up):ui.lookAt(ro,ms,this.up),this.quaternion.setFromRotationMatrix(ui),a&&(ui.extractRotation(a.matrixWorld),Ra.setFromRotationMatrix(ui),this.quaternion.premultiply(Ra.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yd),Pa.child=t,this.dispatchEvent(Pa),Pa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jx),Yr.child=t,this.dispatchEvent(Yr),Yr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ui.multiply(t.parent.matrixWorld)),t.applyMatrix4(ui),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yd),Pa.child=t,this.dispatchEvent(Pa),Pa.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,t,Zx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,qx,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),g=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}We.DEFAULT_UP=new V(0,1,0);We.DEFAULT_MATRIX_AUTO_UPDATE=!0;We.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Yn=new V,fi=new V,$r=new V,pi=new V,Ca=new V,La=new V,Md=new V,Zr=new V,qr=new V,jr=new V,Kr=new qe,Jr=new qe,Qr=new qe;class kn{constructor(t=new V,e=new V,i=new V){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),Yn.subVectors(t,e),a.cross(Yn);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){Yn.subVectors(a,e),fi.subVectors(i,e),$r.subVectors(t,e);const o=Yn.dot(Yn),r=Yn.dot(fi),l=Yn.dot($r),c=fi.dot(fi),h=fi.dot($r),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,g=(o*h-r*l)*d;return s.set(1-u-g,g,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(o,pi.y),l.addScaledVector(r,pi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Kr.setScalar(0),Jr.setScalar(0),Qr.setScalar(0),Kr.fromBufferAttribute(t,e),Jr.fromBufferAttribute(t,i),Qr.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Kr,s.x),o.addScaledVector(Jr,s.y),o.addScaledVector(Qr,s.z),o}static isFrontFacing(t,e,i,a){return Yn.subVectors(i,e),fi.subVectors(t,e),Yn.cross(fi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Yn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Yn.cross(fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return kn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return kn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return kn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return kn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return kn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ca.subVectors(a,i),La.subVectors(s,i),Zr.subVectors(t,i);const l=Ca.dot(Zr),c=La.dot(Zr);if(l<=0&&c<=0)return e.copy(i);qr.subVectors(t,a);const h=Ca.dot(qr),f=La.dot(qr);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Ca,o);jr.subVectors(t,s);const u=Ca.dot(jr),g=La.dot(jr);if(g>=0&&u<=g)return e.copy(s);const y=u*c-l*g;if(y<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(i).addScaledVector(La,r);const m=h*g-u*f;if(m<=0&&f-h>=0&&u-g>=0)return Md.subVectors(s,a),r=(f-h)/(f-h+(u-g)),e.copy(a).addScaledVector(Md,r);const p=1/(m+y+d);return o=y*p,r=d*p,e.copy(i).addScaledVector(Ca,o).addScaledVector(La,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const gf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},co={h:0,s:0,l:0};function tc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=yn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,be.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=be.workingColorSpace){return this.r=t,this.g=e,this.b=i,be.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=be.workingColorSpace){if(t=Wl(t,1),e=un(e,0,1),i=un(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=tc(o,s,t+1/3),this.g=tc(o,s,t),this.b=tc(o,s,t-1/3)}return be.toWorkingColorSpace(this,a),this}setStyle(t,e=yn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=yn){const i=gf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=yi(t.r),this.g=yi(t.g),this.b=yi(t.b),this}copyLinearToSRGB(t){return this.r=Za(t.r),this.g=Za(t.g),this.b=Za(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=yn){return be.fromWorkingColorSpace(xn.copy(this),t),Math.round(un(xn.r*255,0,255))*65536+Math.round(un(xn.g*255,0,255))*256+Math.round(un(xn.b*255,0,255))}getHexString(t=yn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=be.workingColorSpace){be.fromWorkingColorSpace(xn.copy(this),e);const i=xn.r,a=xn.g,s=xn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=be.workingColorSpace){return be.fromWorkingColorSpace(xn.copy(this),e),t.r=xn.r,t.g=xn.g,t.b=xn.b,t}getStyle(t=yn){be.fromWorkingColorSpace(xn.copy(this),t);const e=xn.r,i=xn.g,a=xn.b;return t!==yn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Pi),this.setHSL(Pi.h+t,Pi.s+e,Pi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Pi),t.getHSL(co);const i=ws(Pi.h,co.h,e),a=ws(Pi.s,co.s,e),s=ws(Pi.l,co.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xn=new ee;ee.NAMES=gf;let Kx=0;class fa extends as{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kx++}),this.uuid=ai(),this.name="",this.blending=Wa,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kc,this.blendDst=Ic,this.blendEquation=aa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Ka,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ba,this.stencilZFail=ba,this.stencilZPass=ba,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wa&&(i.blending=this.blending),this.side!==Ni&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==kc&&(i.blendSrc=this.blendSrc),this.blendDst!==Ic&&(i.blendDst=this.blendDst),this.blendEquation!==aa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ka&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ba&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ba&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ba&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class en extends fa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ke=new V,lo=new Xt;class fn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=vl,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)lo.fromBufferAttribute(this,e),lo.applyMatrix3(t),this.setXY(e,lo.x,lo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix3(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=$n(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ce(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=$n(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=$n(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=$n(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=$n(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ce(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array),s=Ce(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==vl&&(t.usage=this.usage),t}}class xf extends fn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class vf extends fn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Re extends fn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Jx=0;const zn=new Oe,ec=new We,Da=new V,Cn=new Vs,gs=new Vs,cn=new V;class Je extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jx++}),this.uuid=ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ff(t)?vf:xf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new le().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return zn.makeRotationFromQuaternion(t),this.applyMatrix4(zn),this}rotateX(t){return zn.makeRotationX(t),this.applyMatrix4(zn),this}rotateY(t){return zn.makeRotationY(t),this.applyMatrix4(zn),this}rotateZ(t){return zn.makeRotationZ(t),this.applyMatrix4(zn),this}translate(t,e,i){return zn.makeTranslation(t,e,i),this.applyMatrix4(zn),this}scale(t,e,i){return zn.makeScale(t,e,i),this.applyMatrix4(zn),this}lookAt(t){return ec.lookAt(t),ec.updateMatrix(),this.applyMatrix4(ec.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Da).negate(),this.translate(Da.x,Da.y,Da.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Re(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Cn.setFromBufferAttribute(s),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,Cn.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,Cn.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(Cn.min),this.boundingBox.expandByPoint(Cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const i=this.boundingSphere.center;if(Cn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];gs.setFromBufferAttribute(r),this.morphTargetsRelative?(cn.addVectors(Cn.min,gs.min),Cn.expandByPoint(cn),cn.addVectors(Cn.max,gs.max),Cn.expandByPoint(cn)):(Cn.expandByPoint(gs.min),Cn.expandByPoint(gs.max))}Cn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)cn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(cn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)cn.fromBufferAttribute(r,c),l&&(Da.fromBufferAttribute(t,c),cn.add(Da)),a=Math.max(a,i.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new V,l[E]=new V;const c=new V,h=new V,f=new V,d=new Xt,u=new Xt,g=new Xt,y=new V,m=new V;function p(E,M,b){c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,M),f.fromBufferAttribute(i,b),d.fromBufferAttribute(s,E),u.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),h.sub(c),f.sub(c),u.sub(d),g.sub(d);const P=1/(u.x*g.y-g.x*u.y);isFinite(P)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(f,-u.y).multiplyScalar(P),m.copy(f).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(P),r[E].add(y),r[M].add(y),r[b].add(y),l[E].add(m),l[M].add(m),l[b].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let E=0,M=x.length;E<M;++E){const b=x[E],P=b.start,U=b.count;for(let z=P,G=P+U;z<G;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const _=new V,v=new V,A=new V,S=new V;function w(E){A.fromBufferAttribute(a,E),S.copy(A);const M=r[E];_.copy(M),_.sub(A.multiplyScalar(A.dot(M))).normalize(),v.crossVectors(S,M);const P=v.dot(l[E])<0?-1:1;o.setXYZW(E,_.x,_.y,_.z,P)}for(let E=0,M=x.length;E<M;++E){const b=x[E],P=b.start,U=b.count;for(let z=P,G=P+U;z<G;z+=3)w(t.getX(z+0)),w(t.getX(z+1)),w(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new V,s=new V,o=new V,r=new V,l=new V,c=new V,h=new V,f=new V;if(t)for(let d=0,u=t.count;d<u;d+=3){const g=t.getX(d+0),y=t.getX(d+1),m=t.getX(d+2);a.fromBufferAttribute(e,g),s.fromBufferAttribute(e,y),o.fromBufferAttribute(e,m),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,g),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),r.add(h),l.add(h),c.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)cn.fromBufferAttribute(t,e),cn.normalize(),t.setXYZ(e,cn.x,cn.y,cn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,g=0;for(let y=0,m=l.length;y<m;y++){r.isInterleavedBufferAttribute?u=l[y]*r.data.stride+r.offset:u=l[y]*h;for(let p=0;p<h;p++)d[g++]=c[u++]}return new fn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Je,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bd=new Oe,Zi=new Yl,ho=new dr,Sd=new V,uo=new V,fo=new V,po=new V,nc=new V,mo=new V,wd=new V,go=new V;class pe extends We{constructor(t=new Je,e=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){mo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(nc.fromBufferAttribute(f,t),o?mo.addScaledVector(nc,h):mo.addScaledVector(nc.sub(e),h))}e.add(mo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ho.copy(i.boundingSphere),ho.applyMatrix4(s),Zi.copy(t.ray).recast(t.near),!(ho.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(ho,Sd)===null||Zi.origin.distanceToSquared(Sd)>(t.far-t.near)**2))&&(bd.copy(s).invert(),Zi.copy(t.ray).applyMatrix4(bd),!(i.boundingBox!==null&&Zi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Zi)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(r.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,A=_;v<A;v+=3){const S=r.getX(v),w=r.getX(v+1),E=r.getX(v+2);a=xo(this,p,t,i,c,h,f,S,w,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),y=Math.min(r.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const x=r.getX(m),_=r.getX(m+1),v=r.getX(m+2);a=xo(this,o,t,i,c,h,f,x,_,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=d.length;g<y;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,u.start),_=Math.min(l.count,Math.min(m.start+m.count,u.start+u.count));for(let v=x,A=_;v<A;v+=3){const S=v,w=v+1,E=v+2;a=xo(this,p,t,i,c,h,f,S,w,E),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=m.materialIndex,e.push(a))}}else{const g=Math.max(0,u.start),y=Math.min(l.count,u.start+u.count);for(let m=g,p=y;m<p;m+=3){const x=m,_=m+1,v=m+2;a=xo(this,o,t,i,c,h,f,x,_,v),a&&(a.faceIndex=Math.floor(m/3),e.push(a))}}}}function Qx(n,t,e,i,a,s,o,r){let l;if(t.side===An?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Ni,r),l===null)return null;go.copy(r),go.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(go);return c<e.near||c>e.far?null:{distance:c,point:go.clone(),object:n}}function xo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,uo),n.getVertexPosition(l,fo),n.getVertexPosition(c,po);const h=Qx(n,t,e,i,uo,fo,po,wd);if(h){const f=new V;kn.getBarycoord(wd,uo,fo,po,f),a&&(h.uv=kn.getInterpolatedAttribute(a,r,l,c,f,new Xt)),s&&(h.uv1=kn.getInterpolatedAttribute(s,r,l,c,f,new Xt)),o&&(h.normal=kn.getInterpolatedAttribute(o,r,l,c,f,new V),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new V,materialIndex:0};kn.getNormal(uo,fo,po,d.normal),h.face=d,h.barycoord=f}return h}class jn extends Je{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;g("z","y","x",-1,-1,i,e,t,o,s,0),g("z","y","x",1,-1,i,e,-t,o,s,1),g("x","z","y",1,1,t,i,e,a,o,2),g("x","z","y",1,-1,t,i,-e,a,o,3),g("x","y","z",1,-1,t,e,i,a,s,4),g("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(h,3)),this.setAttribute("uv",new Re(f,2));function g(y,m,p,x,_,v,A,S,w,E,M){const b=v/w,P=A/E,U=v/2,z=A/2,G=S/2,L=w+1,D=E+1;let X=0,k=0;const F=new V;for(let B=0;B<D;B++){const ut=B*P-z;for(let ot=0;ot<L;ot++){const ht=ot*b-U;F[y]=ht*x,F[m]=ut*_,F[p]=G,c.push(F.x,F.y,F.z),F[y]=0,F[m]=0,F[p]=S>0?1:-1,h.push(F.x,F.y,F.z),f.push(ot/w),f.push(1-B/E),X+=1}}for(let B=0;B<E;B++)for(let ut=0;ut<w;ut++){const ot=d+ut+L*B,ht=d+ut+L*(B+1),j=d+(ut+1)+L*(B+1),q=d+(ut+1)+L*B;l.push(ot,ht,q),l.push(ht,j,q),k+=6}r.addGroup(u,k,M),u+=k,d+=X}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ns(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function _n(n){const t={};for(let e=0;e<n.length;e++){const i=ns(n[e]);for(const a in i)t[a]=i[a]}return t}function tv(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function _f(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:be.workingColorSpace}const ev={clone:ns,merge:_n};var nv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,iv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Oi extends fa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nv,this.fragmentShader=iv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ns(t.uniforms),this.uniformsGroups=tv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class yf extends We{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=_i}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ci=new V,Ed=new Xt,Td=new Xt;class Nn extends yf{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Is*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan($a*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Is*2*Math.atan(Math.tan($a*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ci.x,Ci.y).multiplyScalar(-t/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ci.x,Ci.y).multiplyScalar(-t/Ci.z)}getViewSize(t,e){return this.getViewBounds(t,Ed,Td),e.subVectors(Td,Ed)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan($a*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ka=-90,Ia=1;class av extends We{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Nn(ka,Ia,t,e);a.layers=this.layers,this.add(a);const s=new Nn(ka,Ia,t,e);s.layers=this.layers,this.add(s);const o=new Nn(ka,Ia,t,e);o.layers=this.layers,this.add(o);const r=new Nn(ka,Ia,t,e);r.layers=this.layers,this.add(r);const l=new Nn(ka,Ia,t,e);l.layers=this.layers,this.add(l);const c=new Nn(ka,Ia,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===_i)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qo)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=y,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Mf extends Sn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ja,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class sv extends da{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Mf(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ni}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new jn(5,5,5),s=new Oi({name:"CubemapFromEquirect",uniforms:ns(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:An,blending:zi});s.uniforms.tEquirect.value=e;const o=new pe(a,s),r=e.minFilter;return e.minFilter===ra&&(e.minFilter=ni),new av(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const ic=new V,ov=new V,rv=new le;class ea{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=ic.subVectors(i,e).cross(ov.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ic),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||rv.getNormalMatrix(t),a=this.coplanarPoint(ic).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qi=new dr,vo=new V;class Zl{constructor(t=new ea,e=new ea,i=new ea,a=new ea,s=new ea,o=new ea){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=_i){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],g=a[9],y=a[10],m=a[11],p=a[12],x=a[13],_=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,m-u,v-p).normalize(),i[1].setComponents(l+s,d+c,m+u,v+p).normalize(),i[2].setComponents(l+o,d+h,m+g,v+x).normalize(),i[3].setComponents(l-o,d-h,m-g,v-x).normalize(),i[4].setComponents(l-r,d-f,m-y,v-_).normalize(),e===_i)i[5].setComponents(l+r,d+f,m+y,v+_).normalize();else if(e===Qo)i[5].setComponents(r,f,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(t){return qi.center.set(0,0,0),qi.radius=.7071067811865476,qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(vo.x=a.normal.x>0?t.max.x:t.min.x,vo.y=a.normal.y>0?t.max.y:t.min.y,vo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(vo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function bf(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function cv(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,g)=>u.start-g.start);let d=0;for(let u=1;u<f.length;u++){const g=f[d],y=f[u];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++d,f[d]=y)}f.length=d+1;for(let u=0,g=f.length;u<g;u++){const y=f[u];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Un extends Je{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],g=[],y=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let _=0;_<c;_++){const v=_*f-s;g.push(v,-x,0),y.push(0,0,1),m.push(_/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<r;x++){const _=x+c*p,v=x+c*(p+1),A=x+1+c*(p+1),S=x+1+c*p;u.push(_,v,S),u.push(v,A,S)}this.setIndex(u),this.setAttribute("position",new Re(g,3)),this.setAttribute("normal",new Re(y,3)),this.setAttribute("uv",new Re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Un(t.width,t.height,t.widthSegments,t.heightSegments)}}var lv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hv=`#ifdef USE_ALPHAHASH
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
#endif`,dv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mv=`#ifdef USE_AOMAP
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
#endif`,gv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xv=`#ifdef USE_BATCHING
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
#endif`,vv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_v=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bv=`#ifdef USE_IRIDESCENCE
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
#endif`,Sv=`#ifdef USE_BUMPMAP
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
#endif`,wv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ev=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Av=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Cv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Lv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Dv=`#define PI 3.141592653589793
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
} // validated`,kv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Iv=`vec3 transformedNormal = objectNormal;
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
#endif`,Fv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Uv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ov="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hv=`#ifdef USE_ENVMAP
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
#endif`,Gv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vv=`#ifdef USE_ENVMAP
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
#endif`,Xv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wv=`#ifdef USE_ENVMAP
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
#endif`,Yv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$v=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jv=`#ifdef USE_GRADIENTMAP
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
}`,Kv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,t_=`uniform bool receiveShadow;
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
#endif`,e_=`#ifdef USE_ENVMAP
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
#endif`,n_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,i_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,a_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,s_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,o_=`PhysicalMaterial material;
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
#endif`,r_=`struct PhysicalMaterial {
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
}`,c_=`
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
#endif`,l_=`#if defined( RE_IndirectDiffuse )
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
#endif`,h_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,d_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,u_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,f_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,m_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,g_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,x_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,v_=`#if defined( USE_POINTS_UV )
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
#endif`,__=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,y_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,M_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,b_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,S_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w_=`#ifdef USE_MORPHTARGETS
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
#endif`,E_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,T_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,A_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,R_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,C_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,L_=`#ifdef USE_NORMALMAP
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
#endif`,D_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,k_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,F_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,z_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,U_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,N_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,O_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,B_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,G_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,V_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,X_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,W_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Y_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,$_=`float getShadowMask() {
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
}`,Z_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,q_=`#ifdef USE_SKINNING
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
#endif`,j_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,K_=`#ifdef USE_SKINNING
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
#endif`,J_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Q_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ty=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ey=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ny=`#ifdef USE_TRANSMISSION
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
#endif`,iy=`#ifdef USE_TRANSMISSION
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
#endif`,ay=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ry=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ly=`uniform sampler2D t2D;
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
}`,hy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,uy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,py=`#include <common>
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
}`,my=`#if DEPTH_PACKING == 3200
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
}`,gy=`#define DISTANCE
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
}`,xy=`#define DISTANCE
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
}`,vy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_y=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yy=`uniform float scale;
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
}`,My=`uniform vec3 diffuse;
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
}`,by=`#include <common>
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
}`,Sy=`uniform vec3 diffuse;
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
}`,wy=`#define LAMBERT
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
}`,Ey=`#define LAMBERT
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
}`,Ty=`#define MATCAP
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
}`,Ay=`#define MATCAP
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
}`,Ry=`#define NORMAL
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
}`,Py=`#define NORMAL
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
}`,Cy=`#define PHONG
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
}`,Ly=`#define PHONG
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
}`,Dy=`#define STANDARD
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
}`,ky=`#define STANDARD
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
}`,Iy=`#define TOON
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
}`,Fy=`#define TOON
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
}`,zy=`uniform float size;
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
}`,Uy=`uniform vec3 diffuse;
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
}`,Ny=`#include <common>
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
}`,Oy=`uniform vec3 color;
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
}`,By=`uniform float rotation;
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
}`,Hy=`uniform vec3 diffuse;
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
}`,he={alphahash_fragment:lv,alphahash_pars_fragment:hv,alphamap_fragment:dv,alphamap_pars_fragment:uv,alphatest_fragment:fv,alphatest_pars_fragment:pv,aomap_fragment:mv,aomap_pars_fragment:gv,batching_pars_vertex:xv,batching_vertex:vv,begin_vertex:_v,beginnormal_vertex:yv,bsdfs:Mv,iridescence_fragment:bv,bumpmap_pars_fragment:Sv,clipping_planes_fragment:wv,clipping_planes_pars_fragment:Ev,clipping_planes_pars_vertex:Tv,clipping_planes_vertex:Av,color_fragment:Rv,color_pars_fragment:Pv,color_pars_vertex:Cv,color_vertex:Lv,common:Dv,cube_uv_reflection_fragment:kv,defaultnormal_vertex:Iv,displacementmap_pars_vertex:Fv,displacementmap_vertex:zv,emissivemap_fragment:Uv,emissivemap_pars_fragment:Nv,colorspace_fragment:Ov,colorspace_pars_fragment:Bv,envmap_fragment:Hv,envmap_common_pars_fragment:Gv,envmap_pars_fragment:Vv,envmap_pars_vertex:Xv,envmap_physical_pars_fragment:e_,envmap_vertex:Wv,fog_vertex:Yv,fog_pars_vertex:$v,fog_fragment:Zv,fog_pars_fragment:qv,gradientmap_pars_fragment:jv,lightmap_pars_fragment:Kv,lights_lambert_fragment:Jv,lights_lambert_pars_fragment:Qv,lights_pars_begin:t_,lights_toon_fragment:n_,lights_toon_pars_fragment:i_,lights_phong_fragment:a_,lights_phong_pars_fragment:s_,lights_physical_fragment:o_,lights_physical_pars_fragment:r_,lights_fragment_begin:c_,lights_fragment_maps:l_,lights_fragment_end:h_,logdepthbuf_fragment:d_,logdepthbuf_pars_fragment:u_,logdepthbuf_pars_vertex:f_,logdepthbuf_vertex:p_,map_fragment:m_,map_pars_fragment:g_,map_particle_fragment:x_,map_particle_pars_fragment:v_,metalnessmap_fragment:__,metalnessmap_pars_fragment:y_,morphinstance_vertex:M_,morphcolor_vertex:b_,morphnormal_vertex:S_,morphtarget_pars_vertex:w_,morphtarget_vertex:E_,normal_fragment_begin:T_,normal_fragment_maps:A_,normal_pars_fragment:R_,normal_pars_vertex:P_,normal_vertex:C_,normalmap_pars_fragment:L_,clearcoat_normal_fragment_begin:D_,clearcoat_normal_fragment_maps:k_,clearcoat_pars_fragment:I_,iridescence_pars_fragment:F_,opaque_fragment:z_,packing:U_,premultiplied_alpha_fragment:N_,project_vertex:O_,dithering_fragment:B_,dithering_pars_fragment:H_,roughnessmap_fragment:G_,roughnessmap_pars_fragment:V_,shadowmap_pars_fragment:X_,shadowmap_pars_vertex:W_,shadowmap_vertex:Y_,shadowmask_pars_fragment:$_,skinbase_vertex:Z_,skinning_pars_vertex:q_,skinning_vertex:j_,skinnormal_vertex:K_,specularmap_fragment:J_,specularmap_pars_fragment:Q_,tonemapping_fragment:ty,tonemapping_pars_fragment:ey,transmission_fragment:ny,transmission_pars_fragment:iy,uv_pars_fragment:ay,uv_pars_vertex:sy,uv_vertex:oy,worldpos_vertex:ry,background_vert:cy,background_frag:ly,backgroundCube_vert:hy,backgroundCube_frag:dy,cube_vert:uy,cube_frag:fy,depth_vert:py,depth_frag:my,distanceRGBA_vert:gy,distanceRGBA_frag:xy,equirect_vert:vy,equirect_frag:_y,linedashed_vert:yy,linedashed_frag:My,meshbasic_vert:by,meshbasic_frag:Sy,meshlambert_vert:wy,meshlambert_frag:Ey,meshmatcap_vert:Ty,meshmatcap_frag:Ay,meshnormal_vert:Ry,meshnormal_frag:Py,meshphong_vert:Cy,meshphong_frag:Ly,meshphysical_vert:Dy,meshphysical_frag:ky,meshtoon_vert:Iy,meshtoon_frag:Fy,points_vert:zy,points_frag:Uy,shadow_vert:Ny,shadow_frag:Oy,sprite_vert:By,sprite_frag:Hy},Bt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},ei={basic:{uniforms:_n([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:_n([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new ee(0)}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:_n([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:_n([Bt.common,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.roughnessmap,Bt.metalnessmap,Bt.fog,Bt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:_n([Bt.common,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.gradientmap,Bt.fog,Bt.lights,{emissive:{value:new ee(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:_n([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:_n([Bt.points,Bt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:_n([Bt.common,Bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:_n([Bt.common,Bt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:_n([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:_n([Bt.sprite,Bt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distanceRGBA:{uniforms:_n([Bt.common,Bt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distanceRGBA_vert,fragmentShader:he.distanceRGBA_frag},shadow:{uniforms:_n([Bt.lights,Bt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};ei.physical={uniforms:_n([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};const _o={r:0,b:0,g:0},ji=new si,Gy=new Oe;function Vy(n,t,e,i,a,s,o){const r=new ee(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function y(x){let _=!1;const v=g(x);v===null?p(r,l):v&&v.isColor&&(p(v,1),_=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,_){const v=g(_);v&&(v.isCubeTexture||v.mapping===lr)?(h===void 0&&(h=new pe(new jn(1,1,1),new Oi({name:"BackgroundCubeMaterial",uniforms:ns(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),ji.copy(_.backgroundRotation),ji.x*=-1,ji.y*=-1,ji.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gy.makeRotationFromEuler(ji)),h.material.toneMapped=be.getTransfer(v.colorSpace)!==ke,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new pe(new Un(2,2),new Oi({name:"BackgroundMaterial",uniforms:ns(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=be.getTransfer(v.colorSpace)!==ke,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,_){x.getRGB(_o,_f(n)),i.buffers.color.setClear(_o.r,_o.g,_o.b,_,o)}return{getClearColor:function(){return r},setClearColor:function(x,_=1){r.set(x),l=_,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(r,l)},render:y,addToRenderList:m}}function Xy(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(b,P,U,z,G){let L=!1;const D=f(z,U,P);s!==D&&(s=D,c(s.object)),L=u(b,z,U,G),L&&g(b,z,U,G),G!==null&&t.update(G,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(b,P,U,z),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function f(b,P,U){const z=U.wireframe===!0;let G=i[b.id];G===void 0&&(G={},i[b.id]=G);let L=G[P.id];L===void 0&&(L={},G[P.id]=L);let D=L[z];return D===void 0&&(D=d(l()),L[z]=D),D}function d(b){const P=[],U=[],z=[];for(let G=0;G<e;G++)P[G]=0,U[G]=0,z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:U,attributeDivisors:z,object:b,attributes:{},index:null}}function u(b,P,U,z){const G=s.attributes,L=P.attributes;let D=0;const X=U.getAttributes();for(const k in X)if(X[k].location>=0){const B=G[k];let ut=L[k];if(ut===void 0&&(k==="instanceMatrix"&&b.instanceMatrix&&(ut=b.instanceMatrix),k==="instanceColor"&&b.instanceColor&&(ut=b.instanceColor)),B===void 0||B.attribute!==ut||ut&&B.data!==ut.data)return!0;D++}return s.attributesNum!==D||s.index!==z}function g(b,P,U,z){const G={},L=P.attributes;let D=0;const X=U.getAttributes();for(const k in X)if(X[k].location>=0){let B=L[k];B===void 0&&(k==="instanceMatrix"&&b.instanceMatrix&&(B=b.instanceMatrix),k==="instanceColor"&&b.instanceColor&&(B=b.instanceColor));const ut={};ut.attribute=B,B&&B.data&&(ut.data=B.data),G[k]=ut,D++}s.attributes=G,s.attributesNum=D,s.index=z}function y(){const b=s.newAttributes;for(let P=0,U=b.length;P<U;P++)b[P]=0}function m(b){p(b,0)}function p(b,P){const U=s.newAttributes,z=s.enabledAttributes,G=s.attributeDivisors;U[b]=1,z[b]===0&&(n.enableVertexAttribArray(b),z[b]=1),G[b]!==P&&(n.vertexAttribDivisor(b,P),G[b]=P)}function x(){const b=s.newAttributes,P=s.enabledAttributes;for(let U=0,z=P.length;U<z;U++)P[U]!==b[U]&&(n.disableVertexAttribArray(U),P[U]=0)}function _(b,P,U,z,G,L,D){D===!0?n.vertexAttribIPointer(b,P,U,G,L):n.vertexAttribPointer(b,P,U,z,G,L)}function v(b,P,U,z){y();const G=z.attributes,L=U.getAttributes(),D=P.defaultAttributeValues;for(const X in L){const k=L[X];if(k.location>=0){let F=G[X];if(F===void 0&&(X==="instanceMatrix"&&b.instanceMatrix&&(F=b.instanceMatrix),X==="instanceColor"&&b.instanceColor&&(F=b.instanceColor)),F!==void 0){const B=F.normalized,ut=F.itemSize,ot=t.get(F);if(ot===void 0)continue;const ht=ot.buffer,j=ot.type,q=ot.bytesPerElement,mt=j===n.INT||j===n.UNSIGNED_INT||F.gpuType===Ol;if(F.isInterleavedBufferAttribute){const K=F.data,yt=K.stride,Lt=F.offset;if(K.isInstancedInterleavedBuffer){for(let Ut=0;Ut<k.locationSize;Ut++)p(k.location+Ut,K.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Ut=0;Ut<k.locationSize;Ut++)m(k.location+Ut);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let Ut=0;Ut<k.locationSize;Ut++)_(k.location+Ut,ut/k.locationSize,j,B,yt*q,(Lt+ut/k.locationSize*Ut)*q,mt)}else{if(F.isInstancedBufferAttribute){for(let K=0;K<k.locationSize;K++)p(k.location+K,F.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let K=0;K<k.locationSize;K++)m(k.location+K);n.bindBuffer(n.ARRAY_BUFFER,ht);for(let K=0;K<k.locationSize;K++)_(k.location+K,ut/k.locationSize,j,B,ut*q,ut/k.locationSize*K*q,mt)}}else if(D!==void 0){const B=D[X];if(B!==void 0)switch(B.length){case 2:n.vertexAttrib2fv(k.location,B);break;case 3:n.vertexAttrib3fv(k.location,B);break;case 4:n.vertexAttrib4fv(k.location,B);break;default:n.vertexAttrib1fv(k.location,B)}}}}x()}function A(){E();for(const b in i){const P=i[b];for(const U in P){const z=P[U];for(const G in z)h(z[G].object),delete z[G];delete P[U]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const U in P){const z=P[U];for(const G in z)h(z[G].object),delete z[G];delete P[U]}delete i[b.id]}function w(b){for(const P in i){const U=i[P];if(U[b.id]===void 0)continue;const z=U[b.id];for(const G in z)h(z[G].object),delete z[G];delete U[b.id]}}function E(){M(),o=!0,s!==a&&(s=a,c(s.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:S,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:m,disableUnusedAttributes:x}}function Wy(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let g=0;g<f;g++)u+=h[g];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let g=0;for(let y=0;y<f;y++)g+=h[y]*d[y];e.update(g,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function Yy(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(w){return!(w!==Zn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(w){const E=w===Hs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Mi&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==vi&&!E)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:A,maxSamples:S}}function $y(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new ea,r=new le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,p=n.get(f);if(!a||g===null||g.length===0||s&&!m)s?h(null):c();else{const x=s?0:i,_=x*4;let v=p.clippingState||null;l.value=v,v=h(g,d,_,u);for(let A=0;A!==_;++A)v[A]=e[A];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,g){const y=f!==null?f.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const p=u+y*4,x=d.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,v=u;_!==y;++_,v+=4)o.copy(f[_]).applyMatrix4(x,r),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function Zy(n){let t=new WeakMap;function e(o,r){return r===Gc?o.mapping=Ja:r===Vc&&(o.mapping=Qa),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Gc||r===Vc)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new sv(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Sf extends yf{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ga=4,Ad=[.125,.215,.35,.446,.526,.582],sa=20,ac=new Sf,Rd=new ee;let sc=null,oc=0,rc=0,cc=!1;const na=(1+Math.sqrt(5))/2,Fa=1/na,Pd=[new V(-na,Fa,0),new V(na,Fa,0),new V(-Fa,0,na),new V(Fa,0,na),new V(0,na,-Fa),new V(0,na,Fa),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Cd{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){sc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),rc=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(sc,oc,rc),this._renderer.xr.enabled=cc,t.scissorTest=!1,yo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ja||t.mapping===Qa?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),sc=this._renderer.getRenderTarget(),oc=this._renderer.getActiveCubeFace(),rc=this._renderer.getActiveMipmapLevel(),cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:Hs,format:Zn,colorSpace:is,depthBuffer:!1},a=Ld(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ld(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qy(s)),this._blurMaterial=jy(s,t,e)}return a}_compileMaterial(t){const e=new pe(this._lodPlanes[0],t);this._renderer.compile(e,ac)}_sceneToCubeUV(t,e,i,a){const r=new Nn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Rd),h.toneMapping=Ui,h.autoClear=!1;const u=new en({name:"PMREM.Background",side:An,depthWrite:!1,depthTest:!1}),g=new pe(new jn,u);let y=!1;const m=t.background;m?m.isColor&&(u.color.copy(m),t.background=null,y=!0):(u.color.copy(Rd),y=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):x===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const _=this._cubeSize;yo(a,x*_,p>2?_:0,_,_),h.setRenderTarget(a),y&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Ja||t.mapping===Qa;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=kd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dd());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new pe(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;yo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,ac)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Pd[(a-s-1)%Pd.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new pe(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*sa-1),y=s/g,m=isFinite(s)?1+Math.floor(h*y):sa;m>sa&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${sa}`);const p=[];let x=0;for(let w=0;w<sa;++w){const E=w/y,M=Math.exp(-E*E/2);p.push(M),w===0?x+=M:w<m&&(x+=2*M)}for(let w=0;w<p.length;w++)p[w]=p[w]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-i;const v=this._sizeLods[a],A=3*v*(a>_-Ga?a-_+Ga:0),S=4*(this._cubeSize-v);yo(e,A,S,3*v,2*v),l.setRenderTarget(e),l.render(f,ac)}}function qy(n){const t=[],e=[],i=[];let a=n;const s=n-Ga+1+Ad.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-Ga?l=Ad[o-n+Ga-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,g=6,y=3,m=2,p=1,x=new Float32Array(y*g*u),_=new Float32Array(m*g*u),v=new Float32Array(p*g*u);for(let S=0;S<u;S++){const w=S%3*2/3-1,E=S>2?0:-1,M=[w,E,0,w+2/3,E,0,w+2/3,E+1,0,w,E,0,w+2/3,E+1,0,w,E+1,0];x.set(M,y*g*S),_.set(d,m*g*S);const b=[S,S,S,S,S,S];v.set(b,p*g*S)}const A=new Je;A.setAttribute("position",new fn(x,y)),A.setAttribute("uv",new fn(_,m)),A.setAttribute("faceIndex",new fn(v,p)),t.push(A),a>Ga&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ld(n,t,e){const i=new da(n,t,e);return i.texture.mapping=lr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function yo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function jy(n,t,e){const i=new Float32Array(sa),a=new V(0,1,0);return new Oi({name:"SphericalGaussianBlur",defines:{n:sa,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ql(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Dd(){return new Oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ql(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function kd(){return new Oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function ql(){return`

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
	`}function Ky(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Gc||l===Vc,h=l===Ja||l===Qa;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new Cd(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new Cd(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Jy(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Ms("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function Qy(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const y=d.morphAttributes[g];for(let m=0,p=y.length;m<p;m++)t.remove(y[m])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)t.update(d[g],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const g in u){const y=u[g];for(let m=0,p=y.length;m<p;m++)t.update(y[m],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,g=f.attributes.position;let y=0;if(u!==null){const x=u.array;y=u.version;for(let _=0,v=x.length;_<v;_+=3){const A=x[_+0],S=x[_+1],w=x[_+2];d.push(A,S,S,w,w,A)}}else if(g!==void 0){const x=g.array;y=g.version;for(let _=0,v=x.length/3-1;_<v;_+=3){const A=_+0,S=_+1,w=_+2;d.push(A,S,S,w,w,A)}}else return;const m=new(ff(d)?vf:xf)(d,1);m.version=y;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function tM(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,g){g!==0&&(n.drawElementsInstanced(i,u,s,d*o,g),e.update(u,i,g))}function h(d,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,i,1)}function f(d,u,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],y[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,y,0,g);let p=0;for(let x=0;x<g;x++)p+=u[x]*y[x];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function eM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function nM(n,t,e){const i=new WeakMap,a=new qe;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let b=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var u=b;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,y=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],x=r.morphAttributes.normal||[],_=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),y===!0&&(v=2),m===!0&&(v=3);let A=r.attributes.position.count*v,S=1;A>t.maxTextureSize&&(S=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const w=new Float32Array(A*S*4*f),E=new mf(w,A,S,f);E.type=vi,E.needsUpdate=!0;const M=v*4;for(let P=0;P<f;P++){const U=p[P],z=x[P],G=_[P],L=A*S*4*P;for(let D=0;D<U.count;D++){const X=D*M;g===!0&&(a.fromBufferAttribute(U,D),w[L+X+0]=a.x,w[L+X+1]=a.y,w[L+X+2]=a.z,w[L+X+3]=0),y===!0&&(a.fromBufferAttribute(z,D),w[L+X+4]=a.x,w[L+X+5]=a.y,w[L+X+6]=a.z,w[L+X+7]=0),m===!0&&(a.fromBufferAttribute(G,D),w[L+X+8]=a.x,w[L+X+9]=a.y,w[L+X+10]=a.z,w[L+X+11]=G.itemSize===4?a.w:1)}}d={count:f,texture:E,size:new Xt(A,S)},i.set(r,d),r.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=r.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function iM(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class wf extends Sn{constructor(t,e,i,a,s,o,r,l,c,h=Ya){if(h!==Ya&&h!==es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ya&&(i=ha),i===void 0&&h===es&&(i=ts),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:qn,this.minFilter=l!==void 0?l:qn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ef=new Sn,Id=new wf(1,1),Tf=new mf,Af=new Vx,Rf=new Mf,Fd=[],zd=[],Ud=new Float32Array(16),Nd=new Float32Array(9),Od=new Float32Array(4);function ss(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Fd[a];if(s===void 0&&(s=new Float32Array(a),Fd[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function nn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function an(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ur(n,t){let e=zd[t];e===void 0&&(e=new Int32Array(t),zd[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function aM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function sM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2fv(this.addr,t),an(e,t)}}function oM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(nn(e,t))return;n.uniform3fv(this.addr,t),an(e,t)}}function rM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4fv(this.addr,t),an(e,t)}}function cM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),an(e,t)}else{if(nn(e,i))return;Od.set(i),n.uniformMatrix2fv(this.addr,!1,Od),an(e,i)}}function lM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),an(e,t)}else{if(nn(e,i))return;Nd.set(i),n.uniformMatrix3fv(this.addr,!1,Nd),an(e,i)}}function hM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(nn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),an(e,t)}else{if(nn(e,i))return;Ud.set(i),n.uniformMatrix4fv(this.addr,!1,Ud),an(e,i)}}function dM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function uM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2iv(this.addr,t),an(e,t)}}function fM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;n.uniform3iv(this.addr,t),an(e,t)}}function pM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4iv(this.addr,t),an(e,t)}}function mM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function gM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;n.uniform2uiv(this.addr,t),an(e,t)}}function xM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;n.uniform3uiv(this.addr,t),an(e,t)}}function vM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;n.uniform4uiv(this.addr,t),an(e,t)}}function _M(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Id.compareFunction=uf,s=Id):s=Ef,e.setTexture2D(t||s,a)}function yM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Af,a)}function MM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||Rf,a)}function bM(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Tf,a)}function SM(n){switch(n){case 5126:return aM;case 35664:return sM;case 35665:return oM;case 35666:return rM;case 35674:return cM;case 35675:return lM;case 35676:return hM;case 5124:case 35670:return dM;case 35667:case 35671:return uM;case 35668:case 35672:return fM;case 35669:case 35673:return pM;case 5125:return mM;case 36294:return gM;case 36295:return xM;case 36296:return vM;case 35678:case 36198:case 36298:case 36306:case 35682:return _M;case 35679:case 36299:case 36307:return yM;case 35680:case 36300:case 36308:case 36293:return MM;case 36289:case 36303:case 36311:case 36292:return bM}}function wM(n,t){n.uniform1fv(this.addr,t)}function EM(n,t){const e=ss(t,this.size,2);n.uniform2fv(this.addr,e)}function TM(n,t){const e=ss(t,this.size,3);n.uniform3fv(this.addr,e)}function AM(n,t){const e=ss(t,this.size,4);n.uniform4fv(this.addr,e)}function RM(n,t){const e=ss(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function PM(n,t){const e=ss(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function CM(n,t){const e=ss(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function LM(n,t){n.uniform1iv(this.addr,t)}function DM(n,t){n.uniform2iv(this.addr,t)}function kM(n,t){n.uniform3iv(this.addr,t)}function IM(n,t){n.uniform4iv(this.addr,t)}function FM(n,t){n.uniform1uiv(this.addr,t)}function zM(n,t){n.uniform2uiv(this.addr,t)}function UM(n,t){n.uniform3uiv(this.addr,t)}function NM(n,t){n.uniform4uiv(this.addr,t)}function OM(n,t,e){const i=this.cache,a=t.length,s=ur(e,a);nn(i,s)||(n.uniform1iv(this.addr,s),an(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Ef,s[o])}function BM(n,t,e){const i=this.cache,a=t.length,s=ur(e,a);nn(i,s)||(n.uniform1iv(this.addr,s),an(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Af,s[o])}function HM(n,t,e){const i=this.cache,a=t.length,s=ur(e,a);nn(i,s)||(n.uniform1iv(this.addr,s),an(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||Rf,s[o])}function GM(n,t,e){const i=this.cache,a=t.length,s=ur(e,a);nn(i,s)||(n.uniform1iv(this.addr,s),an(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Tf,s[o])}function VM(n){switch(n){case 5126:return wM;case 35664:return EM;case 35665:return TM;case 35666:return AM;case 35674:return RM;case 35675:return PM;case 35676:return CM;case 5124:case 35670:return LM;case 35667:case 35671:return DM;case 35668:case 35672:return kM;case 35669:case 35673:return IM;case 5125:return FM;case 36294:return zM;case 36295:return UM;case 36296:return NM;case 35678:case 36198:case 36298:case 36306:case 35682:return OM;case 35679:case 36299:case 36307:return BM;case 35680:case 36300:case 36308:case 36293:return HM;case 36289:case 36303:case 36311:case 36292:return GM}}class XM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=SM(e.type)}}class WM{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=VM(e.type)}}class YM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const lc=/(\w+)(\])?(\[|\.)?/g;function Bd(n,t){n.seq.push(t),n.map[t.id]=t}function $M(n,t,e){const i=n.name,a=i.length;for(lc.lastIndex=0;;){const s=lc.exec(i),o=lc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Bd(e,c===void 0?new XM(r,n,t):new WM(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new YM(r),Bd(e,f)),e=f}}}class Ho{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);$M(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Hd(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const ZM=37297;let qM=0;function jM(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Gd=new le;function KM(n){be._getMatrix(Gd,be.workingColorSpace,n);const t=`mat3( ${Gd.elements.map(e=>e.toFixed(4))} )`;switch(be.getTransfer(n)){case hr:return[t,"LinearTransferOETF"];case ke:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Vd(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+jM(n.getShaderSource(t),o)}else return a}function JM(n,t){const e=KM(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function QM(n,t){let e;switch(t){case ex:e="Linear";break;case nx:e="Reinhard";break;case ix:e="Cineon";break;case ax:e="ACESFilmic";break;case ox:e="AgX";break;case rx:e="Neutral";break;case sx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Mo=new V;function tb(){be.getLuminanceCoefficients(Mo);const n=Mo.x.toFixed(4),t=Mo.y.toFixed(4),e=Mo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bs).join(`
`)}function nb(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function ib(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function bs(n){return n!==""}function Xd(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Wd(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ab=/^[ \t]*#include +<([\w\d./]+)>/gm;function _l(n){return n.replace(ab,ob)}const sb=new Map;function ob(n,t){let e=he[t];if(e===void 0){const i=sb.get(t);if(i!==void 0)e=he[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return _l(e)}const rb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yd(n){return n.replace(rb,cb)}function cb(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function $d(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function lb(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ku?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ju?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===gi&&(t="SHADOWMAP_TYPE_VSM"),t}function hb(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ja:case Qa:t="ENVMAP_TYPE_CUBE";break;case lr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function db(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Qa:t="ENVMAP_MODE_REFRACTION";break}return t}function ub(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Nl:t="ENVMAP_BLENDING_MULTIPLY";break;case Qg:t="ENVMAP_BLENDING_MIX";break;case tx:t="ENVMAP_BLENDING_ADD";break}return t}function fb(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function pb(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=lb(e),c=hb(e),h=db(e),f=ub(e),d=fb(e),u=eb(e),g=nb(s),y=a.createProgram();let m,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),p.length>0&&(p+=`
`)):(m=[$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),p=[$d(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ui?"#define TONE_MAPPING":"",e.toneMapping!==Ui?he.tonemapping_pars_fragment:"",e.toneMapping!==Ui?QM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,JM("linearToOutputTexel",e.outputColorSpace),tb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),o=_l(o),o=Xd(o,e),o=Wd(o,e),r=_l(r),r=Xd(r,e),r=Wd(r,e),o=Yd(o),r=Yd(r),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ad?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ad?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=x+m+o,v=x+p+r,A=Hd(a,a.VERTEX_SHADER,_),S=Hd(a,a.FRAGMENT_SHADER,v);a.attachShader(y,A),a.attachShader(y,S),e.index0AttributeName!==void 0?a.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function w(P){if(n.debug.checkShaderErrors){const U=a.getProgramInfoLog(y).trim(),z=a.getShaderInfoLog(A).trim(),G=a.getShaderInfoLog(S).trim();let L=!0,D=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,y,A,S);else{const X=Vd(a,A,"vertex"),k=Vd(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+U+`
`+X+`
`+k)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(z===""||G==="")&&(D=!1);D&&(P.diagnostics={runnable:L,programLog:U,vertexShader:{log:z,prefix:m},fragmentShader:{log:G,prefix:p}})}a.deleteShader(A),a.deleteShader(S),E=new Ho(a,y),M=ib(a,y)}let E;this.getUniforms=function(){return E===void 0&&w(this),E};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=a.getProgramParameter(y,ZM)),b},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=qM++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=A,this.fragmentShader=S,this}let mb=0;class gb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new xb(t),e.set(t,i)),i}}class xb{constructor(t){this.id=mb++,this.code=t,this.usedTimes=0}}function vb(n,t,e,i,a,s,o){const r=new $l,l=new gb,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,b,P,U,z){const G=U.fog,L=z.geometry,D=M.isMeshStandardMaterial?U.environment:null,X=(M.isMeshStandardMaterial?e:t).get(M.envMap||D),k=X&&X.mapping===lr?X.image.height:null,F=g[M.type];M.precision!==null&&(u=a.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const B=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,ut=B!==void 0?B.length:0;let ot=0;L.morphAttributes.position!==void 0&&(ot=1),L.morphAttributes.normal!==void 0&&(ot=2),L.morphAttributes.color!==void 0&&(ot=3);let ht,j,q,mt;if(F){const ne=ei[F];ht=ne.vertexShader,j=ne.fragmentShader}else ht=M.vertexShader,j=M.fragmentShader,l.update(M),q=l.getVertexShaderID(M),mt=l.getFragmentShaderID(M);const K=n.getRenderTarget(),yt=n.state.buffers.depth.getReversed(),Lt=z.isInstancedMesh===!0,Ut=z.isBatchedMesh===!0,$t=!!M.map,Tt=!!M.matcap,It=!!X,O=!!M.aoMap,ce=!!M.lightMap,Wt=!!M.bumpMap,Ht=!!M.normalMap,Nt=!!M.displacementMap,Rt=!!M.emissiveMap,Pt=!!M.metalnessMap,C=!!M.roughnessMap,T=M.anisotropy>0,Y=M.clearcoat>0,lt=M.dispersion>0,dt=M.iridescence>0,at=M.sheen>0,Dt=M.transmission>0,J=T&&!!M.anisotropyMap,pt=Y&&!!M.clearcoatMap,Ft=Y&&!!M.clearcoatNormalMap,it=Y&&!!M.clearcoatRoughnessMap,Mt=dt&&!!M.iridescenceMap,H=dt&&!!M.iridescenceThicknessMap,rt=at&&!!M.sheenColorMap,ft=at&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Vt=!!M.specularColorMap,Zt=!!M.specularIntensityMap,N=Dt&&!!M.transmissionMap,gt=Dt&&!!M.thicknessMap,Q=!!M.gradientMap,ct=!!M.alphaMap,bt=M.alphaTest>0,wt=!!M.alphaHash,Kt=!!M.extensions;let ae=Ui;M.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(ae=n.toneMapping);const de={shaderID:F,shaderType:M.type,shaderName:M.name,vertexShader:ht,fragmentShader:j,defines:M.defines,customVertexShaderID:q,customFragmentShaderID:mt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:Ut,batchingColor:Ut&&z._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&z.instanceColor!==null,instancingMorph:Lt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:is,alphaToCoverage:!!M.alphaToCoverage,map:$t,matcap:Tt,envMap:It,envMapMode:It&&X.mapping,envMapCubeUVHeight:k,aoMap:O,lightMap:ce,bumpMap:Wt,normalMap:Ht,displacementMap:d&&Nt,emissiveMap:Rt,normalMapObjectSpace:Ht&&M.normalMapType===dx,normalMapTangentSpace:Ht&&M.normalMapType===df,metalnessMap:Pt,roughnessMap:C,anisotropy:T,anisotropyMap:J,clearcoat:Y,clearcoatMap:pt,clearcoatNormalMap:Ft,clearcoatRoughnessMap:it,dispersion:lt,iridescence:dt,iridescenceMap:Mt,iridescenceThicknessMap:H,sheen:at,sheenColorMap:rt,sheenRoughnessMap:ft,specularMap:Gt,specularColorMap:Vt,specularIntensityMap:Zt,transmission:Dt,transmissionMap:N,thicknessMap:gt,gradientMap:Q,opaque:M.transparent===!1&&M.blending===Wa&&M.alphaToCoverage===!1,alphaMap:ct,alphaTest:bt,alphaHash:wt,combine:M.combine,mapUv:$t&&y(M.map.channel),aoMapUv:O&&y(M.aoMap.channel),lightMapUv:ce&&y(M.lightMap.channel),bumpMapUv:Wt&&y(M.bumpMap.channel),normalMapUv:Ht&&y(M.normalMap.channel),displacementMapUv:Nt&&y(M.displacementMap.channel),emissiveMapUv:Rt&&y(M.emissiveMap.channel),metalnessMapUv:Pt&&y(M.metalnessMap.channel),roughnessMapUv:C&&y(M.roughnessMap.channel),anisotropyMapUv:J&&y(M.anisotropyMap.channel),clearcoatMapUv:pt&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:H&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:rt&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:ft&&y(M.sheenRoughnessMap.channel),specularMapUv:Gt&&y(M.specularMap.channel),specularColorMapUv:Vt&&y(M.specularColorMap.channel),specularIntensityMapUv:Zt&&y(M.specularIntensityMap.channel),transmissionMapUv:N&&y(M.transmissionMap.channel),thicknessMapUv:gt&&y(M.thicknessMap.channel),alphaMapUv:ct&&y(M.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Ht||T),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!L.attributes.uv&&($t||ct),fog:!!G,useFog:M.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:yt,skinning:z.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:ot,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ae,decodeVideoTexture:$t&&M.map.isVideoTexture===!0&&be.getTransfer(M.map.colorSpace)===ke,decodeVideoTextureEmissive:Rt&&M.emissiveMap.isVideoTexture===!0&&be.getTransfer(M.emissiveMap.colorSpace)===ke,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ve,flipSided:M.side===An,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Kt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&M.extensions.multiDraw===!0||Ut)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return de.vertexUv1s=c.has(1),de.vertexUv2s=c.has(2),de.vertexUv3s=c.has(3),c.clear(),de}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(x(b,M),_(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function x(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function _(M,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),M.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reverseDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),M.push(r.mask)}function v(M){const b=g[M.type];let P;if(b){const U=ei[b];P=ev.clone(U.uniforms)}else P=M.uniforms;return P}function A(M,b){let P;for(let U=0,z=h.length;U<z;U++){const G=h[U];if(G.cacheKey===b){P=G,++P.usedTimes;break}}return P===void 0&&(P=new pb(n,b,M,s),h.push(P)),P}function S(M){if(--M.usedTimes===0){const b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function w(M){l.remove(M)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:A,releaseProgram:S,releaseShaderCache:w,programs:h,dispose:E}}function _b(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function yb(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Zd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function qd(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,g,y,m){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:g,renderOrder:f.renderOrder,z:y,group:m},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=y,p.group=m),t++,p}function r(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,g,y,m){const p=o(f,d,u,g,y,m);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||yb),i.length>1&&i.sort(d||Zd),a.length>1&&a.sort(d||Zd)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function Mb(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new qd,n.set(i,[o])):a>=s.length?(o=new qd,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function bb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new ee};break;case"SpotLight":e={position:new V,direction:new V,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new V,halfWidth:new V,halfHeight:new V};break}return n[t.id]=e,e}}}function Sb(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let wb=0;function Eb(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Tb(n){const t=new bb,e=Sb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const a=new V,s=new Oe,o=new Oe;function r(c){let h=0,f=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let u=0,g=0,y=0,m=0,p=0,x=0,_=0,v=0,A=0,S=0,w=0;c.sort(Eb);for(let M=0,b=c.length;M<b;M++){const P=c[M],U=P.color,z=P.intensity,G=P.distance,L=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=U.r*z,f+=U.g*z,d+=U.b*z;else if(P.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(P.sh.coefficients[D],z);w++}else if(P.isDirectionalLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,k=e.get(P);k.shadowIntensity=X.intensity,k.shadowBias=X.bias,k.shadowNormalBias=X.normalBias,k.shadowRadius=X.radius,k.shadowMapSize=X.mapSize,i.directionalShadow[u]=k,i.directionalShadowMap[u]=L,i.directionalShadowMatrix[u]=P.shadow.matrix,x++}i.directional[u]=D,u++}else if(P.isSpotLight){const D=t.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(U).multiplyScalar(z),D.distance=G,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,i.spot[y]=D;const X=P.shadow;if(P.map&&(i.spotLightMap[A]=P.map,A++,X.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[y]=X.matrix,P.castShadow){const k=e.get(P);k.shadowIntensity=X.intensity,k.shadowBias=X.bias,k.shadowNormalBias=X.normalBias,k.shadowRadius=X.radius,k.shadowMapSize=X.mapSize,i.spotShadow[y]=k,i.spotShadowMap[y]=L,v++}y++}else if(P.isRectAreaLight){const D=t.get(P);D.color.copy(U).multiplyScalar(z),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=D,m++}else if(P.isPointLight){const D=t.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity),D.distance=P.distance,D.decay=P.decay,P.castShadow){const X=P.shadow,k=e.get(P);k.shadowIntensity=X.intensity,k.shadowBias=X.bias,k.shadowNormalBias=X.normalBias,k.shadowRadius=X.radius,k.shadowMapSize=X.mapSize,k.shadowCameraNear=X.camera.near,k.shadowCameraFar=X.camera.far,i.pointShadow[g]=k,i.pointShadowMap[g]=L,i.pointShadowMatrix[g]=P.shadow.matrix,_++}i.point[g]=D,g++}else if(P.isHemisphereLight){const D=t.get(P);D.skyColor.copy(P.color).multiplyScalar(z),D.groundColor.copy(P.groundColor).multiplyScalar(z),i.hemi[p]=D,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Bt.LTC_FLOAT_1,i.rectAreaLTC2=Bt.LTC_FLOAT_2):(i.rectAreaLTC1=Bt.LTC_HALF_1,i.rectAreaLTC2=Bt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const E=i.hash;(E.directionalLength!==u||E.pointLength!==g||E.spotLength!==y||E.rectAreaLength!==m||E.hemiLength!==p||E.numDirectionalShadows!==x||E.numPointShadows!==_||E.numSpotShadows!==v||E.numSpotMaps!==A||E.numLightProbes!==w)&&(i.directional.length=u,i.spot.length=y,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=v+A-S,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=w,E.directionalLength=u,E.pointLength=g,E.spotLength=y,E.rectAreaLength=m,E.hemiLength=p,E.numDirectionalShadows=x,E.numPointShadows=_,E.numSpotShadows=v,E.numSpotMaps=A,E.numLightProbes=w,i.version=wb++)}function l(c,h){let f=0,d=0,u=0,g=0,y=0;const m=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){const _=c[p];if(_.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),f++}else if(_.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),a.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(m),u++}else if(_.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(_.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const v=i.hemi[y];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:r,setupView:l,state:i}}function jd(n){const t=new Tb(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function Ab(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new jd(n),t.set(a,[r])):s>=o.length?(r=new jd(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class Rb extends fa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=lx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Pb extends fa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Cb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lb=`uniform sampler2D shadow_pass;
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
}`;function Db(n,t,e){let i=new Zl;const a=new Xt,s=new Xt,o=new qe,r=new Rb({depthPacking:hx}),l=new Pb,c={},h=e.maxTextureSize,f={[Ni]:An,[An]:Ni,[Ve]:Ve},d=new Oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:Cb,fragmentShader:Lb}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const g=new Je;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new pe(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ku;let p=this.type;this.render=function(S,w,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),U=n.state;U.setBlending(zi),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const z=p!==gi&&this.type===gi,G=p===gi&&this.type!==gi;for(let L=0,D=S.length;L<D;L++){const X=S[L],k=X.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;a.copy(k.mapSize);const F=k.getFrameExtents();if(a.multiply(F),s.copy(k.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/F.x),a.x=s.x*F.x,k.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/F.y),a.y=s.y*F.y,k.mapSize.y=s.y)),k.map===null||z===!0||G===!0){const ut=this.type!==gi?{minFilter:qn,magFilter:qn}:{};k.map!==null&&k.map.dispose(),k.map=new da(a.x,a.y,ut),k.map.texture.name=X.name+".shadowMap",k.camera.updateProjectionMatrix()}n.setRenderTarget(k.map),n.clear();const B=k.getViewportCount();for(let ut=0;ut<B;ut++){const ot=k.getViewport(ut);o.set(s.x*ot.x,s.y*ot.y,s.x*ot.z,s.y*ot.w),U.viewport(o),k.updateMatrices(X,ut),i=k.getFrustum(),v(w,E,k.camera,X,this.type)}k.isPointLightShadow!==!0&&this.type===gi&&x(k,E),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,b,P)};function x(S,w){const E=t.update(y);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new da(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(w,null,E,d,y,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(w,null,E,u,y,null)}function _(S,w,E,M){let b=null;const P=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)b=P;else if(b=E.isPointLight===!0?l:r,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const U=b.uuid,z=w.uuid;let G=c[U];G===void 0&&(G={},c[U]=G);let L=G[z];L===void 0&&(L=b.clone(),G[z]=L,w.addEventListener("dispose",A)),b=L}if(b.visible=w.visible,b.wireframe=w.wireframe,M===gi?b.side=w.shadowSide!==null?w.shadowSide:w.side:b.side=w.shadowSide!==null?w.shadowSide:f[w.side],b.alphaMap=w.alphaMap,b.alphaTest=w.alphaTest,b.map=w.map,b.clipShadows=w.clipShadows,b.clippingPlanes=w.clippingPlanes,b.clipIntersection=w.clipIntersection,b.displacementMap=w.displacementMap,b.displacementScale=w.displacementScale,b.displacementBias=w.displacementBias,b.wireframeLinewidth=w.wireframeLinewidth,b.linewidth=w.linewidth,E.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const U=n.properties.get(b);U.light=E}return b}function v(S,w,E,M,b){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===gi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const z=t.update(S),G=S.material;if(Array.isArray(G)){const L=z.groups;for(let D=0,X=L.length;D<X;D++){const k=L[D],F=G[k.materialIndex];if(F&&F.visible){const B=_(S,F,M,b);S.onBeforeShadow(n,S,w,E,z,B,k),n.renderBufferDirect(E,null,z,B,S,k),S.onAfterShadow(n,S,w,E,z,B,k)}}}else if(G.visible){const L=_(S,G,M,b);S.onBeforeShadow(n,S,w,E,z,L,null),n.renderBufferDirect(E,null,z,L,S,null),S.onAfterShadow(n,S,w,E,z,L,null)}}const U=S.children;for(let z=0,G=U.length;z<G;z++)v(U[z],w,E,M,b)}function A(S){S.target.removeEventListener("dispose",A);for(const E in c){const M=c[E],b=S.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const kb={[Fc]:zc,[Uc]:Bc,[Nc]:Hc,[Ka]:Oc,[zc]:Fc,[Bc]:Uc,[Hc]:Nc,[Oc]:Ka};function Ib(n,t){function e(){let N=!1;const gt=new qe;let Q=null;const ct=new qe(0,0,0,0);return{setMask:function(bt){Q!==bt&&!N&&(n.colorMask(bt,bt,bt,bt),Q=bt)},setLocked:function(bt){N=bt},setClear:function(bt,wt,Kt,ae,de){de===!0&&(bt*=ae,wt*=ae,Kt*=ae),gt.set(bt,wt,Kt,ae),ct.equals(gt)===!1&&(n.clearColor(bt,wt,Kt,ae),ct.copy(gt))},reset:function(){N=!1,Q=null,ct.set(-1,0,0,0)}}}function i(){let N=!1,gt=!1,Q=null,ct=null,bt=null;return{setReversed:function(wt){if(gt!==wt){const Kt=t.get("EXT_clip_control");gt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const ae=bt;bt=null,this.setClear(ae)}gt=wt},getReversed:function(){return gt},setTest:function(wt){wt?K(n.DEPTH_TEST):yt(n.DEPTH_TEST)},setMask:function(wt){Q!==wt&&!N&&(n.depthMask(wt),Q=wt)},setFunc:function(wt){if(gt&&(wt=kb[wt]),ct!==wt){switch(wt){case Fc:n.depthFunc(n.NEVER);break;case zc:n.depthFunc(n.ALWAYS);break;case Uc:n.depthFunc(n.LESS);break;case Ka:n.depthFunc(n.LEQUAL);break;case Nc:n.depthFunc(n.EQUAL);break;case Oc:n.depthFunc(n.GEQUAL);break;case Bc:n.depthFunc(n.GREATER);break;case Hc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ct=wt}},setLocked:function(wt){N=wt},setClear:function(wt){bt!==wt&&(gt&&(wt=1-wt),n.clearDepth(wt),bt=wt)},reset:function(){N=!1,Q=null,ct=null,bt=null,gt=!1}}}function a(){let N=!1,gt=null,Q=null,ct=null,bt=null,wt=null,Kt=null,ae=null,de=null;return{setTest:function(ne){N||(ne?K(n.STENCIL_TEST):yt(n.STENCIL_TEST))},setMask:function(ne){gt!==ne&&!N&&(n.stencilMask(ne),gt=ne)},setFunc:function(ne,xe,Fe){(Q!==ne||ct!==xe||bt!==Fe)&&(n.stencilFunc(ne,xe,Fe),Q=ne,ct=xe,bt=Fe)},setOp:function(ne,xe,Fe){(wt!==ne||Kt!==xe||ae!==Fe)&&(n.stencilOp(ne,xe,Fe),wt=ne,Kt=xe,ae=Fe)},setLocked:function(ne){N=ne},setClear:function(ne){de!==ne&&(n.clearStencil(ne),de=ne)},reset:function(){N=!1,gt=null,Q=null,ct=null,bt=null,wt=null,Kt=null,ae=null,de=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,x=null,_=null,v=null,A=null,S=null,w=new ee(0,0,0),E=0,M=!1,b=null,P=null,U=null,z=null,G=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,X=0;const k=n.getParameter(n.VERSION);k.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(k)[1]),D=X>=1):k.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),D=X>=2);let F=null,B={};const ut=n.getParameter(n.SCISSOR_BOX),ot=n.getParameter(n.VIEWPORT),ht=new qe().fromArray(ut),j=new qe().fromArray(ot);function q(N,gt,Q,ct){const bt=new Uint8Array(4),wt=n.createTexture();n.bindTexture(N,wt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<Q;Kt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(gt,0,n.RGBA,1,1,ct,0,n.RGBA,n.UNSIGNED_BYTE,bt):n.texImage2D(gt+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,bt);return wt}const mt={};mt[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),mt[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),mt[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),K(n.DEPTH_TEST),o.setFunc(Ka),Wt(!1),Ht(Qh),K(n.CULL_FACE),O(zi);function K(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function yt(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function Lt(N,gt){return f[N]!==gt?(n.bindFramebuffer(N,gt),f[N]=gt,N===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=gt),N===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=gt),!0):!1}function Ut(N,gt){let Q=u,ct=!1;if(N){Q=d.get(gt),Q===void 0&&(Q=[],d.set(gt,Q));const bt=N.textures;if(Q.length!==bt.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let wt=0,Kt=bt.length;wt<Kt;wt++)Q[wt]=n.COLOR_ATTACHMENT0+wt;Q.length=bt.length,ct=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,ct=!0);ct&&n.drawBuffers(Q)}function $t(N){return g!==N?(n.useProgram(N),g=N,!0):!1}const Tt={[aa]:n.FUNC_ADD,[zg]:n.FUNC_SUBTRACT,[Ug]:n.FUNC_REVERSE_SUBTRACT};Tt[Ng]=n.MIN,Tt[Og]=n.MAX;const It={[Bg]:n.ZERO,[Hg]:n.ONE,[Gg]:n.SRC_COLOR,[kc]:n.SRC_ALPHA,[Zg]:n.SRC_ALPHA_SATURATE,[Yg]:n.DST_COLOR,[Xg]:n.DST_ALPHA,[Vg]:n.ONE_MINUS_SRC_COLOR,[Ic]:n.ONE_MINUS_SRC_ALPHA,[$g]:n.ONE_MINUS_DST_COLOR,[Wg]:n.ONE_MINUS_DST_ALPHA,[qg]:n.CONSTANT_COLOR,[jg]:n.ONE_MINUS_CONSTANT_COLOR,[Kg]:n.CONSTANT_ALPHA,[Jg]:n.ONE_MINUS_CONSTANT_ALPHA};function O(N,gt,Q,ct,bt,wt,Kt,ae,de,ne){if(N===zi){y===!0&&(yt(n.BLEND),y=!1);return}if(y===!1&&(K(n.BLEND),y=!0),N!==Fg){if(N!==m||ne!==M){if((p!==aa||v!==aa)&&(n.blendEquation(n.FUNC_ADD),p=aa,v=aa),ne)switch(N){case Wa:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Li:n.blendFunc(n.ONE,n.ONE);break;case td:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ed:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Wa:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Li:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case td:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ed:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,_=null,A=null,S=null,w.set(0,0,0),E=0,m=N,M=ne}return}bt=bt||gt,wt=wt||Q,Kt=Kt||ct,(gt!==p||bt!==v)&&(n.blendEquationSeparate(Tt[gt],Tt[bt]),p=gt,v=bt),(Q!==x||ct!==_||wt!==A||Kt!==S)&&(n.blendFuncSeparate(It[Q],It[ct],It[wt],It[Kt]),x=Q,_=ct,A=wt,S=Kt),(ae.equals(w)===!1||de!==E)&&(n.blendColor(ae.r,ae.g,ae.b,de),w.copy(ae),E=de),m=N,M=!1}function ce(N,gt){N.side===Ve?yt(n.CULL_FACE):K(n.CULL_FACE);let Q=N.side===An;gt&&(Q=!Q),Wt(Q),N.blending===Wa&&N.transparent===!1?O(zi):O(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const ct=N.stencilWrite;r.setTest(ct),ct&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Rt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):yt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function Ht(N){N!==kg?(K(n.CULL_FACE),N!==P&&(N===Qh?n.cullFace(n.BACK):N===Ig?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):yt(n.CULL_FACE),P=N}function Nt(N){N!==U&&(D&&n.lineWidth(N),U=N)}function Rt(N,gt,Q){N?(K(n.POLYGON_OFFSET_FILL),(z!==gt||G!==Q)&&(n.polygonOffset(gt,Q),z=gt,G=Q)):yt(n.POLYGON_OFFSET_FILL)}function Pt(N){N?K(n.SCISSOR_TEST):yt(n.SCISSOR_TEST)}function C(N){N===void 0&&(N=n.TEXTURE0+L-1),F!==N&&(n.activeTexture(N),F=N)}function T(N,gt,Q){Q===void 0&&(F===null?Q=n.TEXTURE0+L-1:Q=F);let ct=B[Q];ct===void 0&&(ct={type:void 0,texture:void 0},B[Q]=ct),(ct.type!==N||ct.texture!==gt)&&(F!==Q&&(n.activeTexture(Q),F=Q),n.bindTexture(N,gt||mt[N]),ct.type=N,ct.texture=gt)}function Y(){const N=B[F];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function lt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function dt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Mt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function H(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(N){ht.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ht.copy(N))}function ft(N){j.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),j.copy(N))}function Gt(N,gt){let Q=c.get(gt);Q===void 0&&(Q=new WeakMap,c.set(gt,Q));let ct=Q.get(N);ct===void 0&&(ct=n.getUniformBlockIndex(gt,N.name),Q.set(N,ct))}function Vt(N,gt){const ct=c.get(gt).get(N);l.get(gt)!==ct&&(n.uniformBlockBinding(gt,ct,N.__bindingPointIndex),l.set(gt,ct))}function Zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},F=null,B={},f={},d=new WeakMap,u=[],g=null,y=!1,m=null,p=null,x=null,_=null,v=null,A=null,S=null,w=new ee(0,0,0),E=0,M=!1,b=null,P=null,U=null,z=null,G=null,ht.set(0,0,n.canvas.width,n.canvas.height),j.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:K,disable:yt,bindFramebuffer:Lt,drawBuffers:Ut,useProgram:$t,setBlending:O,setMaterial:ce,setFlipSided:Wt,setCullFace:Ht,setLineWidth:Nt,setPolygonOffset:Rt,setScissorTest:Pt,activeTexture:C,bindTexture:T,unbindTexture:Y,compressedTexImage2D:lt,compressedTexImage3D:dt,texImage2D:Mt,texImage3D:H,updateUBOMapping:Gt,uniformBlockBinding:Vt,texStorage2D:Ft,texStorage3D:it,texSubImage2D:at,texSubImage3D:Dt,compressedTexSubImage2D:J,compressedTexSubImage3D:pt,scissor:rt,viewport:ft,reset:Zt}}function Kd(n,t,e,i){const a=Fb(i);switch(e){case af:return n*t;case of:return n*t;case rf:return n*t*2;case cf:return n*t/a.components*a.byteLength;case Gl:return n*t/a.components*a.byteLength;case lf:return n*t*2/a.components*a.byteLength;case Vl:return n*t*2/a.components*a.byteLength;case sf:return n*t*3/a.components*a.byteLength;case Zn:return n*t*4/a.components*a.byteLength;case Xl:return n*t*4/a.components*a.byteLength;case zo:case Uo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case No:case Oo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case $c:case qc:return Math.max(n,16)*Math.max(t,8)/4;case Yc:case Zc:return Math.max(n,8)*Math.max(t,8)/2;case jc:case Kc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Jc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Qc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case tl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case el:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case nl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case il:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case al:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case sl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case ol:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case rl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case cl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case ll:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case hl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case dl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ul:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Bo:case fl:case pl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case hf:case ml:return Math.ceil(n/4)*Math.ceil(t/4)*8;case gl:case xl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fb(n){switch(n){case Mi:case tf:return{byteLength:1,components:1};case ks:case ef:case Hs:return{byteLength:2,components:1};case Bl:case Hl:return{byteLength:2,components:4};case ha:case Ol:case vi:return{byteLength:4,components:1};case nf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function zb(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Xt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,T){return u?new OffscreenCanvas(C,T):tr("canvas")}function y(C,T,Y){let lt=1;const dt=Pt(C);if((dt.width>Y||dt.height>Y)&&(lt=Y/Math.max(dt.width,dt.height)),lt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const at=Math.floor(lt*dt.width),Dt=Math.floor(lt*dt.height);f===void 0&&(f=g(at,Dt));const J=T?g(at,Dt):f;return J.width=at,J.height=Dt,J.getContext("2d").drawImage(C,0,0,at,Dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+dt.width+"x"+dt.height+") to ("+at+"x"+Dt+")."),J}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+dt.width+"x"+dt.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function x(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(C,T,Y,lt,dt=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let at=T;if(T===n.RED&&(Y===n.FLOAT&&(at=n.R32F),Y===n.HALF_FLOAT&&(at=n.R16F),Y===n.UNSIGNED_BYTE&&(at=n.R8)),T===n.RED_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.R8UI),Y===n.UNSIGNED_SHORT&&(at=n.R16UI),Y===n.UNSIGNED_INT&&(at=n.R32UI),Y===n.BYTE&&(at=n.R8I),Y===n.SHORT&&(at=n.R16I),Y===n.INT&&(at=n.R32I)),T===n.RG&&(Y===n.FLOAT&&(at=n.RG32F),Y===n.HALF_FLOAT&&(at=n.RG16F),Y===n.UNSIGNED_BYTE&&(at=n.RG8)),T===n.RG_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RG8UI),Y===n.UNSIGNED_SHORT&&(at=n.RG16UI),Y===n.UNSIGNED_INT&&(at=n.RG32UI),Y===n.BYTE&&(at=n.RG8I),Y===n.SHORT&&(at=n.RG16I),Y===n.INT&&(at=n.RG32I)),T===n.RGB_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGB8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGB16UI),Y===n.UNSIGNED_INT&&(at=n.RGB32UI),Y===n.BYTE&&(at=n.RGB8I),Y===n.SHORT&&(at=n.RGB16I),Y===n.INT&&(at=n.RGB32I)),T===n.RGBA_INTEGER&&(Y===n.UNSIGNED_BYTE&&(at=n.RGBA8UI),Y===n.UNSIGNED_SHORT&&(at=n.RGBA16UI),Y===n.UNSIGNED_INT&&(at=n.RGBA32UI),Y===n.BYTE&&(at=n.RGBA8I),Y===n.SHORT&&(at=n.RGBA16I),Y===n.INT&&(at=n.RGBA32I)),T===n.RGB&&Y===n.UNSIGNED_INT_5_9_9_9_REV&&(at=n.RGB9_E5),T===n.RGBA){const Dt=dt?hr:be.getTransfer(lt);Y===n.FLOAT&&(at=n.RGBA32F),Y===n.HALF_FLOAT&&(at=n.RGBA16F),Y===n.UNSIGNED_BYTE&&(at=Dt===ke?n.SRGB8_ALPHA8:n.RGBA8),Y===n.UNSIGNED_SHORT_4_4_4_4&&(at=n.RGBA4),Y===n.UNSIGNED_SHORT_5_5_5_1&&(at=n.RGB5_A1)}return(at===n.R16F||at===n.R32F||at===n.RG16F||at===n.RG32F||at===n.RGBA16F||at===n.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function v(C,T){let Y;return C?T===null||T===ha||T===ts?Y=n.DEPTH24_STENCIL8:T===vi?Y=n.DEPTH32F_STENCIL8:T===ks&&(Y=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ha||T===ts?Y=n.DEPTH_COMPONENT24:T===vi?Y=n.DEPTH_COMPONENT32F:T===ks&&(Y=n.DEPTH_COMPONENT16),Y}function A(C,T){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==qn&&C.minFilter!==ni?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function S(C){const T=C.target;T.removeEventListener("dispose",S),E(T),T.isVideoTexture&&h.delete(T)}function w(C){const T=C.target;T.removeEventListener("dispose",w),b(T)}function E(C){const T=i.get(C);if(T.__webglInit===void 0)return;const Y=C.source,lt=d.get(Y);if(lt){const dt=lt[T.__cacheKey];dt.usedTimes--,dt.usedTimes===0&&M(C),Object.keys(lt).length===0&&d.delete(Y)}i.remove(C)}function M(C){const T=i.get(C);n.deleteTexture(T.__webglTexture);const Y=C.source,lt=d.get(Y);delete lt[T.__cacheKey],o.memory.textures--}function b(C){const T=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(T.__webglFramebuffer[lt]))for(let dt=0;dt<T.__webglFramebuffer[lt].length;dt++)n.deleteFramebuffer(T.__webglFramebuffer[lt][dt]);else n.deleteFramebuffer(T.__webglFramebuffer[lt]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[lt])}else{if(Array.isArray(T.__webglFramebuffer))for(let lt=0;lt<T.__webglFramebuffer.length;lt++)n.deleteFramebuffer(T.__webglFramebuffer[lt]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let lt=0;lt<T.__webglColorRenderbuffer.length;lt++)T.__webglColorRenderbuffer[lt]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[lt]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Y=C.textures;for(let lt=0,dt=Y.length;lt<dt;lt++){const at=i.get(Y[lt]);at.__webglTexture&&(n.deleteTexture(at.__webglTexture),o.memory.textures--),i.remove(Y[lt])}i.remove(C)}let P=0;function U(){P=0}function z(){const C=P;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),P+=1,C}function G(C){const T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function L(C,T){const Y=i.get(C);if(C.isVideoTexture&&Nt(C),C.isRenderTargetTexture===!1&&C.version>0&&Y.__version!==C.version){const lt=C.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(Y,C,T);return}}e.bindTexture(n.TEXTURE_2D,Y.__webglTexture,n.TEXTURE0+T)}function D(C,T){const Y=i.get(C);if(C.version>0&&Y.__version!==C.version){j(Y,C,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Y.__webglTexture,n.TEXTURE0+T)}function X(C,T){const Y=i.get(C);if(C.version>0&&Y.__version!==C.version){j(Y,C,T);return}e.bindTexture(n.TEXTURE_3D,Y.__webglTexture,n.TEXTURE0+T)}function k(C,T){const Y=i.get(C);if(C.version>0&&Y.__version!==C.version){q(Y,C,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture,n.TEXTURE0+T)}const F={[Xc]:n.REPEAT,[oa]:n.CLAMP_TO_EDGE,[Wc]:n.MIRRORED_REPEAT},B={[qn]:n.NEAREST,[cx]:n.NEAREST_MIPMAP_NEAREST,[to]:n.NEAREST_MIPMAP_LINEAR,[ni]:n.LINEAR,[Ur]:n.LINEAR_MIPMAP_NEAREST,[ra]:n.LINEAR_MIPMAP_LINEAR},ut={[ux]:n.NEVER,[vx]:n.ALWAYS,[fx]:n.LESS,[uf]:n.LEQUAL,[px]:n.EQUAL,[xx]:n.GEQUAL,[mx]:n.GREATER,[gx]:n.NOTEQUAL};function ot(C,T){if(T.type===vi&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===ni||T.magFilter===Ur||T.magFilter===to||T.magFilter===ra||T.minFilter===ni||T.minFilter===Ur||T.minFilter===to||T.minFilter===ra)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,F[T.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,F[T.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,F[T.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,B[T.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,B[T.minFilter]),T.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ut[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===qn||T.minFilter!==to&&T.minFilter!==ra||T.type===vi&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function ht(C,T){let Y=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",S));const lt=T.source;let dt=d.get(lt);dt===void 0&&(dt={},d.set(lt,dt));const at=G(T);if(at!==C.__cacheKey){dt[at]===void 0&&(dt[at]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),dt[at].usedTimes++;const Dt=dt[C.__cacheKey];Dt!==void 0&&(dt[C.__cacheKey].usedTimes--,Dt.usedTimes===0&&M(T)),C.__cacheKey=at,C.__webglTexture=dt[at].texture}return Y}function j(C,T,Y){let lt=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(lt=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(lt=n.TEXTURE_3D);const dt=ht(C,T),at=T.source;e.bindTexture(lt,C.__webglTexture,n.TEXTURE0+Y);const Dt=i.get(at);if(at.version!==Dt.__version||dt===!0){e.activeTexture(n.TEXTURE0+Y);const J=be.getPrimaries(be.workingColorSpace),pt=T.colorSpace===Di?null:be.getPrimaries(T.colorSpace),Ft=T.colorSpace===Di||J===pt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let it=y(T.image,!1,a.maxTextureSize);it=Rt(T,it);const Mt=s.convert(T.format,T.colorSpace),H=s.convert(T.type);let rt=_(T.internalFormat,Mt,H,T.colorSpace,T.isVideoTexture);ot(lt,T);let ft;const Gt=T.mipmaps,Vt=T.isVideoTexture!==!0,Zt=Dt.__version===void 0||dt===!0,N=at.dataReady,gt=A(T,it);if(T.isDepthTexture)rt=v(T.format===es,T.type),Zt&&(Vt?e.texStorage2D(n.TEXTURE_2D,1,rt,it.width,it.height):e.texImage2D(n.TEXTURE_2D,0,rt,it.width,it.height,0,Mt,H,null));else if(T.isDataTexture)if(Gt.length>0){Vt&&Zt&&e.texStorage2D(n.TEXTURE_2D,gt,rt,Gt[0].width,Gt[0].height);for(let Q=0,ct=Gt.length;Q<ct;Q++)ft=Gt[Q],Vt?N&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ft.width,ft.height,Mt,H,ft.data):e.texImage2D(n.TEXTURE_2D,Q,rt,ft.width,ft.height,0,Mt,H,ft.data);T.generateMipmaps=!1}else Vt?(Zt&&e.texStorage2D(n.TEXTURE_2D,gt,rt,it.width,it.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,it.width,it.height,Mt,H,it.data)):e.texImage2D(n.TEXTURE_2D,0,rt,it.width,it.height,0,Mt,H,it.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Vt&&Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,rt,Gt[0].width,Gt[0].height,it.depth);for(let Q=0,ct=Gt.length;Q<ct;Q++)if(ft=Gt[Q],T.format!==Zn)if(Mt!==null)if(Vt){if(N)if(T.layerUpdates.size>0){const bt=Kd(ft.width,ft.height,T.format,T.type);for(const wt of T.layerUpdates){const Kt=ft.data.subarray(wt*bt/ft.data.BYTES_PER_ELEMENT,(wt+1)*bt/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,wt,ft.width,ft.height,1,Mt,Kt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ft.width,ft.height,it.depth,Mt,ft.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,rt,ft.width,ft.height,it.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ft.width,ft.height,it.depth,Mt,H,ft.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Q,rt,ft.width,ft.height,it.depth,0,Mt,H,ft.data)}else{Vt&&Zt&&e.texStorage2D(n.TEXTURE_2D,gt,rt,Gt[0].width,Gt[0].height);for(let Q=0,ct=Gt.length;Q<ct;Q++)ft=Gt[Q],T.format!==Zn?Mt!==null?Vt?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ft.width,ft.height,Mt,ft.data):e.compressedTexImage2D(n.TEXTURE_2D,Q,rt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ft.width,ft.height,Mt,H,ft.data):e.texImage2D(n.TEXTURE_2D,Q,rt,ft.width,ft.height,0,Mt,H,ft.data)}else if(T.isDataArrayTexture)if(Vt){if(Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,gt,rt,it.width,it.height,it.depth),N)if(T.layerUpdates.size>0){const Q=Kd(it.width,it.height,T.format,T.type);for(const ct of T.layerUpdates){const bt=it.data.subarray(ct*Q/it.data.BYTES_PER_ELEMENT,(ct+1)*Q/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ct,it.width,it.height,1,Mt,H,bt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,Mt,H,it.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,rt,it.width,it.height,it.depth,0,Mt,H,it.data);else if(T.isData3DTexture)Vt?(Zt&&e.texStorage3D(n.TEXTURE_3D,gt,rt,it.width,it.height,it.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,Mt,H,it.data)):e.texImage3D(n.TEXTURE_3D,0,rt,it.width,it.height,it.depth,0,Mt,H,it.data);else if(T.isFramebufferTexture){if(Zt)if(Vt)e.texStorage2D(n.TEXTURE_2D,gt,rt,it.width,it.height);else{let Q=it.width,ct=it.height;for(let bt=0;bt<gt;bt++)e.texImage2D(n.TEXTURE_2D,bt,rt,Q,ct,0,Mt,H,null),Q>>=1,ct>>=1}}else if(Gt.length>0){if(Vt&&Zt){const Q=Pt(Gt[0]);e.texStorage2D(n.TEXTURE_2D,gt,rt,Q.width,Q.height)}for(let Q=0,ct=Gt.length;Q<ct;Q++)ft=Gt[Q],Vt?N&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,Mt,H,ft):e.texImage2D(n.TEXTURE_2D,Q,rt,Mt,H,ft);T.generateMipmaps=!1}else if(Vt){if(Zt){const Q=Pt(it);e.texStorage2D(n.TEXTURE_2D,gt,rt,Q.width,Q.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,H,it)}else e.texImage2D(n.TEXTURE_2D,0,rt,Mt,H,it);m(T)&&p(lt),Dt.__version=at.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function q(C,T,Y){if(T.image.length!==6)return;const lt=ht(C,T),dt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+Y);const at=i.get(dt);if(dt.version!==at.__version||lt===!0){e.activeTexture(n.TEXTURE0+Y);const Dt=be.getPrimaries(be.workingColorSpace),J=T.colorSpace===Di?null:be.getPrimaries(T.colorSpace),pt=T.colorSpace===Di||Dt===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const Ft=T.isCompressedTexture||T.image[0].isCompressedTexture,it=T.image[0]&&T.image[0].isDataTexture,Mt=[];for(let ct=0;ct<6;ct++)!Ft&&!it?Mt[ct]=y(T.image[ct],!0,a.maxCubemapSize):Mt[ct]=it?T.image[ct].image:T.image[ct],Mt[ct]=Rt(T,Mt[ct]);const H=Mt[0],rt=s.convert(T.format,T.colorSpace),ft=s.convert(T.type),Gt=_(T.internalFormat,rt,ft,T.colorSpace),Vt=T.isVideoTexture!==!0,Zt=at.__version===void 0||lt===!0,N=dt.dataReady;let gt=A(T,H);ot(n.TEXTURE_CUBE_MAP,T);let Q;if(Ft){Vt&&Zt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Gt,H.width,H.height);for(let ct=0;ct<6;ct++){Q=Mt[ct].mipmaps;for(let bt=0;bt<Q.length;bt++){const wt=Q[bt];T.format!==Zn?rt!==null?Vt?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt,0,0,wt.width,wt.height,rt,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt,Gt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt,0,0,wt.width,wt.height,rt,ft,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt,Gt,wt.width,wt.height,0,rt,ft,wt.data)}}}else{if(Q=T.mipmaps,Vt&&Zt){Q.length>0&&gt++;const ct=Pt(Mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,gt,Gt,ct.width,ct.height)}for(let ct=0;ct<6;ct++)if(it){Vt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,Mt[ct].width,Mt[ct].height,rt,ft,Mt[ct].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Gt,Mt[ct].width,Mt[ct].height,0,rt,ft,Mt[ct].data);for(let bt=0;bt<Q.length;bt++){const Kt=Q[bt].image[ct].image;Vt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt+1,0,0,Kt.width,Kt.height,rt,ft,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt+1,Gt,Kt.width,Kt.height,0,rt,ft,Kt.data)}}else{Vt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,rt,ft,Mt[ct]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Gt,rt,ft,Mt[ct]);for(let bt=0;bt<Q.length;bt++){const wt=Q[bt];Vt?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt+1,0,0,rt,ft,wt.image[ct]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,bt+1,Gt,rt,ft,wt.image[ct])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),at.__version=dt.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function mt(C,T,Y,lt,dt,at){const Dt=s.convert(Y.format,Y.colorSpace),J=s.convert(Y.type),pt=_(Y.internalFormat,Dt,J,Y.colorSpace),Ft=i.get(T),it=i.get(Y);if(it.__renderTarget=T,!Ft.__hasExternalTextures){const Mt=Math.max(1,T.width>>at),H=Math.max(1,T.height>>at);dt===n.TEXTURE_3D||dt===n.TEXTURE_2D_ARRAY?e.texImage3D(dt,at,pt,Mt,H,T.depth,0,Dt,J,null):e.texImage2D(dt,at,pt,Mt,H,0,Dt,J,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,lt,dt,it.__webglTexture,0,Wt(T)):(dt===n.TEXTURE_2D||dt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&dt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,lt,dt,it.__webglTexture,at),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(C,T,Y){if(n.bindRenderbuffer(n.RENDERBUFFER,C),T.depthBuffer){const lt=T.depthTexture,dt=lt&&lt.isDepthTexture?lt.type:null,at=v(T.stencilBuffer,dt),Dt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=Wt(T);Ht(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,J,at,T.width,T.height):Y?n.renderbufferStorageMultisample(n.RENDERBUFFER,J,at,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,at,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Dt,n.RENDERBUFFER,C)}else{const lt=T.textures;for(let dt=0;dt<lt.length;dt++){const at=lt[dt],Dt=s.convert(at.format,at.colorSpace),J=s.convert(at.type),pt=_(at.internalFormat,Dt,J,at.colorSpace),Ft=Wt(T);Y&&Ht(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,pt,T.width,T.height):Ht(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ft,pt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,pt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function yt(C,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const lt=i.get(T.depthTexture);lt.__renderTarget=T,(!lt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),L(T.depthTexture,0);const dt=lt.__webglTexture,at=Wt(T);if(T.depthTexture.format===Ya)Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0);else if(T.depthTexture.format===es)Ht(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function Lt(C){const T=i.get(C),Y=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){const lt=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),lt){const dt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,lt.removeEventListener("dispose",dt)};lt.addEventListener("dispose",dt),T.__depthDisposeCallback=dt}T.__boundDepthTexture=lt}if(C.depthTexture&&!T.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");yt(T.__webglFramebuffer,C)}else if(Y){T.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[lt]),T.__webglDepthbuffer[lt]===void 0)T.__webglDepthbuffer[lt]=n.createRenderbuffer(),K(T.__webglDepthbuffer[lt],C,!1);else{const dt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,at=T.__webglDepthbuffer[lt];n.bindRenderbuffer(n.RENDERBUFFER,at),n.framebufferRenderbuffer(n.FRAMEBUFFER,dt,n.RENDERBUFFER,at)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),K(T.__webglDepthbuffer,C,!1);else{const lt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,dt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,dt),n.framebufferRenderbuffer(n.FRAMEBUFFER,lt,n.RENDERBUFFER,dt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(C,T,Y){const lt=i.get(C);T!==void 0&&mt(lt.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Y!==void 0&&Lt(C)}function $t(C){const T=C.texture,Y=i.get(C),lt=i.get(T);C.addEventListener("dispose",w);const dt=C.textures,at=C.isWebGLCubeRenderTarget===!0,Dt=dt.length>1;if(Dt||(lt.__webglTexture===void 0&&(lt.__webglTexture=n.createTexture()),lt.__version=T.version,o.memory.textures++),at){Y.__webglFramebuffer=[];for(let J=0;J<6;J++)if(T.mipmaps&&T.mipmaps.length>0){Y.__webglFramebuffer[J]=[];for(let pt=0;pt<T.mipmaps.length;pt++)Y.__webglFramebuffer[J][pt]=n.createFramebuffer()}else Y.__webglFramebuffer[J]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Y.__webglFramebuffer=[];for(let J=0;J<T.mipmaps.length;J++)Y.__webglFramebuffer[J]=n.createFramebuffer()}else Y.__webglFramebuffer=n.createFramebuffer();if(Dt)for(let J=0,pt=dt.length;J<pt;J++){const Ft=i.get(dt[J]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Ht(C)===!1){Y.__webglMultisampledFramebuffer=n.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let J=0;J<dt.length;J++){const pt=dt[J];Y.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Y.__webglColorRenderbuffer[J]);const Ft=s.convert(pt.format,pt.colorSpace),it=s.convert(pt.type),Mt=_(pt.internalFormat,Ft,it,pt.colorSpace,C.isXRRenderTarget===!0),H=Wt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,H,Mt,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,Y.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(Y.__webglDepthRenderbuffer=n.createRenderbuffer(),K(Y.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,lt.__webglTexture),ot(n.TEXTURE_CUBE_MAP,T);for(let J=0;J<6;J++)if(T.mipmaps&&T.mipmaps.length>0)for(let pt=0;pt<T.mipmaps.length;pt++)mt(Y.__webglFramebuffer[J][pt],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,pt);else mt(Y.__webglFramebuffer[J],C,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Dt){for(let J=0,pt=dt.length;J<pt;J++){const Ft=dt[J],it=i.get(Ft);e.bindTexture(n.TEXTURE_2D,it.__webglTexture),ot(n.TEXTURE_2D,Ft),mt(Y.__webglFramebuffer,C,Ft,n.COLOR_ATTACHMENT0+J,n.TEXTURE_2D,0),m(Ft)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let J=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(J,lt.__webglTexture),ot(J,T),T.mipmaps&&T.mipmaps.length>0)for(let pt=0;pt<T.mipmaps.length;pt++)mt(Y.__webglFramebuffer[pt],C,T,n.COLOR_ATTACHMENT0,J,pt);else mt(Y.__webglFramebuffer,C,T,n.COLOR_ATTACHMENT0,J,0);m(T)&&p(J),e.unbindTexture()}C.depthBuffer&&Lt(C)}function Tt(C){const T=C.textures;for(let Y=0,lt=T.length;Y<lt;Y++){const dt=T[Y];if(m(dt)){const at=x(C),Dt=i.get(dt).__webglTexture;e.bindTexture(at,Dt),p(at),e.unbindTexture()}}}const It=[],O=[];function ce(C){if(C.samples>0){if(Ht(C)===!1){const T=C.textures,Y=C.width,lt=C.height;let dt=n.COLOR_BUFFER_BIT;const at=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Dt=i.get(C),J=T.length>1;if(J)for(let pt=0;pt<T.length;pt++)e.bindFramebuffer(n.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Dt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Dt.__webglFramebuffer);for(let pt=0;pt<T.length;pt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(dt|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(dt|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Dt.__webglColorRenderbuffer[pt]);const Ft=i.get(T[pt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ft,0)}n.blitFramebuffer(0,0,Y,lt,0,0,Y,lt,dt,n.NEAREST),l===!0&&(It.length=0,O.length=0,It.push(n.COLOR_ATTACHMENT0+pt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(It.push(at),O.push(at),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,O)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,It))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let pt=0;pt<T.length;pt++){e.bindFramebuffer(n.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.RENDERBUFFER,Dt.__webglColorRenderbuffer[pt]);const Ft=i.get(T[pt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Dt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pt,n.TEXTURE_2D,Ft,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const T=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Wt(C){return Math.min(a.maxSamples,C.samples)}function Ht(C){const T=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Nt(C){const T=o.render.frame;h.get(C)!==T&&(h.set(C,T),C.update())}function Rt(C,T){const Y=C.colorSpace,lt=C.format,dt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||Y!==is&&Y!==Di&&(be.getTransfer(Y)===ke?(lt!==Zn||dt!==Mi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),T}function Pt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=U,this.setTexture2D=L,this.setTexture2DArray=D,this.setTexture3D=X,this.setTextureCube=k,this.rebindTextures=Ut,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=ce,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=Ht}function Ub(n,t){function e(i,a=Di){let s;const o=be.getTransfer(a);if(i===Mi)return n.UNSIGNED_BYTE;if(i===Bl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Hl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===nf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===tf)return n.BYTE;if(i===ef)return n.SHORT;if(i===ks)return n.UNSIGNED_SHORT;if(i===Ol)return n.INT;if(i===ha)return n.UNSIGNED_INT;if(i===vi)return n.FLOAT;if(i===Hs)return n.HALF_FLOAT;if(i===af)return n.ALPHA;if(i===sf)return n.RGB;if(i===Zn)return n.RGBA;if(i===of)return n.LUMINANCE;if(i===rf)return n.LUMINANCE_ALPHA;if(i===Ya)return n.DEPTH_COMPONENT;if(i===es)return n.DEPTH_STENCIL;if(i===cf)return n.RED;if(i===Gl)return n.RED_INTEGER;if(i===lf)return n.RG;if(i===Vl)return n.RG_INTEGER;if(i===Xl)return n.RGBA_INTEGER;if(i===zo||i===Uo||i===No||i===Oo)if(o===ke)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===zo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Uo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===No)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Oo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===zo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Uo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===No)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Oo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Yc||i===$c||i===Zc||i===qc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Yc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===$c)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Zc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===qc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===jc||i===Kc||i===Jc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===jc||i===Kc)return o===ke?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Jc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Qc||i===tl||i===el||i===nl||i===il||i===al||i===sl||i===ol||i===rl||i===cl||i===ll||i===hl||i===dl||i===ul)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Qc)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===tl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===el)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===nl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===il)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===al)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===sl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ol)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===rl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ll)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===hl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dl)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ul)return o===ke?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Bo||i===fl||i===pl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Bo)return o===ke?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===fl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===pl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===hf||i===ml||i===gl||i===xl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Bo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ml)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===gl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===xl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ts?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class Nb extends Nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ie extends We{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ob={type:"move"};class hc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ie,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ie,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ie,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,i),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,g=.005;c.inputState.pinching&&d>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Ob)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ie;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Bb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hb=`
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

}`;class Gb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Sn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Oi({vertexShader:Bb,fragmentShader:Hb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new Un(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Vb extends as{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,g=null;const y=new Gb,m=e.getContextAttributes();let p=null,x=null;const _=[],v=[],A=new Xt;let S=null;const w=new Nn;w.viewport=new qe;const E=new Nn;E.viewport=new qe;const M=[w,E],b=new Nb;let P=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let q=_[j];return q===void 0&&(q=new hc,_[j]=q),q.getTargetRaySpace()},this.getControllerGrip=function(j){let q=_[j];return q===void 0&&(q=new hc,_[j]=q),q.getGripSpace()},this.getHand=function(j){let q=_[j];return q===void 0&&(q=new hc,_[j]=q),q.getHandSpace()};function z(j){const q=v.indexOf(j.inputSource);if(q===-1)return;const mt=_[q];mt!==void 0&&(mt.update(j.inputSource,j.frame,c||o),mt.dispatchEvent({type:j.type,data:j.inputSource}))}function G(){a.removeEventListener("select",z),a.removeEventListener("selectstart",z),a.removeEventListener("selectend",z),a.removeEventListener("squeeze",z),a.removeEventListener("squeezestart",z),a.removeEventListener("squeezeend",z),a.removeEventListener("end",G),a.removeEventListener("inputsourceschange",L);for(let j=0;j<_.length;j++){const q=v[j];q!==null&&(v[j]=null,_[j].disconnect(q))}P=null,U=null,y.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,x=null,ht.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){r=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(j){if(a=j,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",z),a.addEventListener("selectstart",z),a.addEventListener("selectend",z),a.addEventListener("squeeze",z),a.addEventListener("squeezestart",z),a.addEventListener("squeezeend",z),a.addEventListener("end",G),a.addEventListener("inputsourceschange",L),m.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(A),a.renderState.layers===void 0){const q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,q),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),x=new da(u.framebufferWidth,u.framebufferHeight,{format:Zn,type:Mi,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let q=null,mt=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,q=m.stencil?es:Ya,mt=m.stencil?ts:ha);const yt={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(yt),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new da(d.textureWidth,d.textureHeight,{format:Zn,type:Mi,depthTexture:new wf(d.textureWidth,d.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),ht.setContext(a),ht.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function L(j){for(let q=0;q<j.removed.length;q++){const mt=j.removed[q],K=v.indexOf(mt);K>=0&&(v[K]=null,_[K].disconnect(mt))}for(let q=0;q<j.added.length;q++){const mt=j.added[q];let K=v.indexOf(mt);if(K===-1){for(let Lt=0;Lt<_.length;Lt++)if(Lt>=v.length){v.push(mt),K=Lt;break}else if(v[Lt]===null){v[Lt]=mt,K=Lt;break}if(K===-1)break}const yt=_[K];yt&&yt.connect(mt)}}const D=new V,X=new V;function k(j,q,mt){D.setFromMatrixPosition(q.matrixWorld),X.setFromMatrixPosition(mt.matrixWorld);const K=D.distanceTo(X),yt=q.projectionMatrix.elements,Lt=mt.projectionMatrix.elements,Ut=yt[14]/(yt[10]-1),$t=yt[14]/(yt[10]+1),Tt=(yt[9]+1)/yt[5],It=(yt[9]-1)/yt[5],O=(yt[8]-1)/yt[0],ce=(Lt[8]+1)/Lt[0],Wt=Ut*O,Ht=Ut*ce,Nt=K/(-O+ce),Rt=Nt*-O;if(q.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Rt),j.translateZ(Nt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),yt[10]===-1)j.projectionMatrix.copy(q.projectionMatrix),j.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{const Pt=Ut+Nt,C=$t+Nt,T=Wt-Rt,Y=Ht+(K-Rt),lt=Tt*$t/C*Pt,dt=It*$t/C*Pt;j.projectionMatrix.makePerspective(T,Y,lt,dt,Pt,C),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function F(j,q){q===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(q.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(a===null)return;let q=j.near,mt=j.far;y.texture!==null&&(y.depthNear>0&&(q=y.depthNear),y.depthFar>0&&(mt=y.depthFar)),b.near=E.near=w.near=q,b.far=E.far=w.far=mt,(P!==b.near||U!==b.far)&&(a.updateRenderState({depthNear:b.near,depthFar:b.far}),P=b.near,U=b.far),w.layers.mask=j.layers.mask|2,E.layers.mask=j.layers.mask|4,b.layers.mask=w.layers.mask|E.layers.mask;const K=j.parent,yt=b.cameras;F(b,K);for(let Lt=0;Lt<yt.length;Lt++)F(yt[Lt],K);yt.length===2?k(b,w,E):b.projectionMatrix.copy(w.projectionMatrix),B(j,b,K)};function B(j,q,mt){mt===null?j.matrix.copy(q.matrixWorld):(j.matrix.copy(mt.matrixWorld),j.matrix.invert(),j.matrix.multiply(q.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(q.projectionMatrix),j.projectionMatrixInverse.copy(q.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Is*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=j)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(b)};let ut=null;function ot(j,q){if(h=q.getViewerPose(c||o),g=q,h!==null){const mt=h.views;u!==null&&(t.setRenderTargetFramebuffer(x,u.framebuffer),t.setRenderTarget(x));let K=!1;mt.length!==b.cameras.length&&(b.cameras.length=0,K=!0);for(let Lt=0;Lt<mt.length;Lt++){const Ut=mt[Lt];let $t=null;if(u!==null)$t=u.getViewport(Ut);else{const It=f.getViewSubImage(d,Ut);$t=It.viewport,Lt===0&&(t.setRenderTargetTextures(x,It.colorTexture,d.ignoreDepthValues?void 0:It.depthStencilTexture),t.setRenderTarget(x))}let Tt=M[Lt];Tt===void 0&&(Tt=new Nn,Tt.layers.enable(Lt),Tt.viewport=new qe,M[Lt]=Tt),Tt.matrix.fromArray(Ut.transform.matrix),Tt.matrix.decompose(Tt.position,Tt.quaternion,Tt.scale),Tt.projectionMatrix.fromArray(Ut.projectionMatrix),Tt.projectionMatrixInverse.copy(Tt.projectionMatrix).invert(),Tt.viewport.set($t.x,$t.y,$t.width,$t.height),Lt===0&&(b.matrix.copy(Tt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),K===!0&&b.cameras.push(Tt)}const yt=a.enabledFeatures;if(yt&&yt.includes("depth-sensing")){const Lt=f.getDepthInformation(mt[0]);Lt&&Lt.isValid&&Lt.texture&&y.init(t,Lt,a.renderState)}}for(let mt=0;mt<_.length;mt++){const K=v[mt],yt=_[mt];K!==null&&yt!==void 0&&yt.update(K,q,c||o)}ut&&ut(j,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),g=null}const ht=new bf;ht.setAnimationLoop(ot),this.setAnimationLoop=function(j){ut=j},this.dispose=function(){}}}const Ki=new si,Xb=new Oe;function Wb(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,_f(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function a(m,p,x,_,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&u(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),y(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,x,_):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===An&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===An&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p),_=x.envMap,v=x.envMapRotation;_&&(m.envMap.value=_,Ki.copy(v),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),m.envMapRotation.value.setFromMatrix4(Xb.makeRotationFromEuler(Ki)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,x,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=_*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===An&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function Yb(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){const v=_.program;i.uniformBlockBinding(x,v)}function c(x,_){let v=a[x.id];v===void 0&&(g(x),v=h(x),a[x.id]=v,x.addEventListener("dispose",m));const A=_.program;i.updateUBOMapping(x,A);const S=t.render.frame;s[x.id]!==S&&(d(x),s[x.id]=S)}function h(x){const _=f();x.__bindingPointIndex=_;const v=n.createBuffer(),A=x.__size,S=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,A,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,v),v}function f(){for(let x=0;x<r;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=a[x.id],v=x.uniforms,A=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let S=0,w=v.length;S<w;S++){const E=Array.isArray(v[S])?v[S]:[v[S]];for(let M=0,b=E.length;M<b;M++){const P=E[M];if(u(P,S,M,A)===!0){const U=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let G=0;for(let L=0;L<z.length;L++){const D=z[L],X=y(D);typeof D=="number"||typeof D=="boolean"?(P.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,U+G,P.__data)):D.isMatrix3?(P.__data[0]=D.elements[0],P.__data[1]=D.elements[1],P.__data[2]=D.elements[2],P.__data[3]=0,P.__data[4]=D.elements[3],P.__data[5]=D.elements[4],P.__data[6]=D.elements[5],P.__data[7]=0,P.__data[8]=D.elements[6],P.__data[9]=D.elements[7],P.__data[10]=D.elements[8],P.__data[11]=0):(D.toArray(P.__data,G),G+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(x,_,v,A){const S=x.value,w=_+"_"+v;if(A[w]===void 0)return typeof S=="number"||typeof S=="boolean"?A[w]=S:A[w]=S.clone(),!0;{const E=A[w];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return A[w]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function g(x){const _=x.uniforms;let v=0;const A=16;for(let w=0,E=_.length;w<E;w++){const M=Array.isArray(_[w])?_[w]:[_[w]];for(let b=0,P=M.length;b<P;b++){const U=M[b],z=Array.isArray(U.value)?U.value:[U.value];for(let G=0,L=z.length;G<L;G++){const D=z[G],X=y(D),k=v%A,F=k%X.boundary,B=k+F;v+=F,B!==0&&A-B<X.storage&&(v+=A-B),U.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=X.storage}}}const S=v%A;return S>0&&(v+=A-S),x.__size=v,x.__cache={},this}function y(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){const _=x.target;_.removeEventListener("dispose",m);const v=o.indexOf(_.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[_.id]),delete a[_.id],delete s[_.id]}function p(){for(const x in a)n.deleteBuffer(a[x]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class $b{constructor(t={}){const{canvas:e=Fx(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const g=new Uint32Array(4),y=new Int32Array(4);let m=null,p=null;const x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=yn,this.toneMapping=Ui,this.toneMappingExposure=1;const v=this;let A=!1,S=0,w=0,E=null,M=-1,b=null;const P=new qe,U=new qe;let z=null;const G=new ee(0);let L=0,D=e.width,X=e.height,k=1,F=null,B=null;const ut=new qe(0,0,D,X),ot=new qe(0,0,D,X);let ht=!1;const j=new Zl;let q=!1,mt=!1;const K=new Oe,yt=new Oe,Lt=new V,Ut=new qe,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Tt=!1;function It(){return E===null?k:1}let O=i;function ce(R,W){return e.getContext(R,W)}try{const R={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ul}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",wt,!1),O===null){const W="webgl2";if(O=ce(W,R),O===null)throw ce(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Wt,Ht,Nt,Rt,Pt,C,T,Y,lt,dt,at,Dt,J,pt,Ft,it,Mt,H,rt,ft,Gt,Vt,Zt,N;function gt(){Wt=new Jy(O),Wt.init(),Vt=new Ub(O,Wt),Ht=new Yy(O,Wt,t,Vt),Nt=new Ib(O,Wt),Ht.reverseDepthBuffer&&d&&Nt.buffers.depth.setReversed(!0),Rt=new eM(O),Pt=new _b,C=new zb(O,Wt,Nt,Pt,Ht,Vt,Rt),T=new Zy(v),Y=new Ky(v),lt=new cv(O),Zt=new Xy(O,lt),dt=new Qy(O,lt,Rt,Zt),at=new iM(O,dt,lt,Rt),rt=new nM(O,Ht,C),it=new $y(Pt),Dt=new vb(v,T,Y,Wt,Ht,Zt,it),J=new Wb(v,Pt),pt=new Mb,Ft=new Ab(Wt),H=new Vy(v,T,Y,Nt,at,u,l),Mt=new Db(v,at,Ht),N=new Yb(O,Rt,Ht,Nt),ft=new Wy(O,Wt,Rt),Gt=new tM(O,Wt,Rt),Rt.programs=Dt.programs,v.capabilities=Ht,v.extensions=Wt,v.properties=Pt,v.renderLists=pt,v.shadowMap=Mt,v.state=Nt,v.info=Rt}gt();const Q=new Vb(v,O);this.xr=Q,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const R=Wt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Wt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(R){R!==void 0&&(k=R,this.setSize(D,X,!1))},this.getSize=function(R){return R.set(D,X)},this.setSize=function(R,W,tt=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=R,X=W,e.width=Math.floor(R*k),e.height=Math.floor(W*k),tt===!0&&(e.style.width=R+"px",e.style.height=W+"px"),this.setViewport(0,0,R,W)},this.getDrawingBufferSize=function(R){return R.set(D*k,X*k).floor()},this.setDrawingBufferSize=function(R,W,tt){D=R,X=W,k=tt,e.width=Math.floor(R*tt),e.height=Math.floor(W*tt),this.setViewport(0,0,R,W)},this.getCurrentViewport=function(R){return R.copy(P)},this.getViewport=function(R){return R.copy(ut)},this.setViewport=function(R,W,tt,et){R.isVector4?ut.set(R.x,R.y,R.z,R.w):ut.set(R,W,tt,et),Nt.viewport(P.copy(ut).multiplyScalar(k).round())},this.getScissor=function(R){return R.copy(ot)},this.setScissor=function(R,W,tt,et){R.isVector4?ot.set(R.x,R.y,R.z,R.w):ot.set(R,W,tt,et),Nt.scissor(U.copy(ot).multiplyScalar(k).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(R){Nt.setScissorTest(ht=R)},this.setOpaqueSort=function(R){F=R},this.setTransparentSort=function(R){B=R},this.getClearColor=function(R){return R.copy(H.getClearColor())},this.setClearColor=function(){H.setClearColor.apply(H,arguments)},this.getClearAlpha=function(){return H.getClearAlpha()},this.setClearAlpha=function(){H.setClearAlpha.apply(H,arguments)},this.clear=function(R=!0,W=!0,tt=!0){let et=0;if(R){let Z=!1;if(E!==null){const Et=E.texture.format;Z=Et===Xl||Et===Vl||Et===Gl}if(Z){const Et=E.texture.type,Ct=Et===Mi||Et===ha||Et===ks||Et===ts||Et===Bl||Et===Hl,Yt=H.getClearColor(),qt=H.getClearAlpha(),Ot=Yt.r,zt=Yt.g,kt=Yt.b;Ct?(g[0]=Ot,g[1]=zt,g[2]=kt,g[3]=qt,O.clearBufferuiv(O.COLOR,0,g)):(y[0]=Ot,y[1]=zt,y[2]=kt,y[3]=qt,O.clearBufferiv(O.COLOR,0,y))}else et|=O.COLOR_BUFFER_BIT}W&&(et|=O.DEPTH_BUFFER_BIT),tt&&(et|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",wt,!1),pt.dispose(),Ft.dispose(),Pt.dispose(),T.dispose(),Y.dispose(),at.dispose(),Zt.dispose(),N.dispose(),Dt.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",pn),Q.removeEventListener("sessionend",Le),_e.stop()};function ct(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const R=Rt.autoReset,W=Mt.enabled,tt=Mt.autoUpdate,et=Mt.needsUpdate,Z=Mt.type;gt(),Rt.autoReset=R,Mt.enabled=W,Mt.autoUpdate=tt,Mt.needsUpdate=et,Mt.type=Z}function wt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Kt(R){const W=R.target;W.removeEventListener("dispose",Kt),ae(W)}function ae(R){de(R),Pt.remove(R)}function de(R){const W=Pt.get(R).programs;W!==void 0&&(W.forEach(function(tt){Dt.releaseProgram(tt)}),R.isShaderMaterial&&Dt.releaseShaderCache(R))}this.renderBufferDirect=function(R,W,tt,et,Z,Et){W===null&&(W=$t);const Ct=Z.isMesh&&Z.matrixWorld.determinant()<0,Yt=jt(R,W,tt,et,Z);Nt.setMaterial(et,Ct);let qt=tt.index,Ot=1;if(et.wireframe===!0){if(qt=dt.getWireframeAttribute(tt),qt===void 0)return;Ot=2}const zt=tt.drawRange,kt=tt.attributes.position;let se=zt.start*Ot,ge=(zt.start+zt.count)*Ot;Et!==null&&(se=Math.max(se,Et.start*Ot),ge=Math.min(ge,(Et.start+Et.count)*Ot)),qt!==null?(se=Math.max(se,0),ge=Math.min(ge,qt.count)):kt!=null&&(se=Math.max(se,0),ge=Math.min(ge,kt.count));const ue=ge-se;if(ue<0||ue===1/0)return;Zt.setup(Z,et,Yt,tt,qt);let Ne,vt=ft;if(qt!==null&&(Ne=lt.get(qt),vt=Gt,vt.setIndex(Ne)),Z.isMesh)et.wireframe===!0?(Nt.setLineWidth(et.wireframeLinewidth*It()),vt.setMode(O.LINES)):vt.setMode(O.TRIANGLES);else if(Z.isLine){let st=et.linewidth;st===void 0&&(st=1),Nt.setLineWidth(st*It()),Z.isLineSegments?vt.setMode(O.LINES):Z.isLineLoop?vt.setMode(O.LINE_LOOP):vt.setMode(O.LINE_STRIP)}else Z.isPoints?vt.setMode(O.POINTS):Z.isSprite&&vt.setMode(O.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)vt.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))vt.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const st=Z._multiDrawStarts,te=Z._multiDrawCounts,oe=Z._multiDrawCount,me=qt?lt.get(qt).bytesPerElement:1,sn=Pt.get(et).currentProgram.getUniforms();for(let Pe=0;Pe<oe;Pe++)sn.setValue(O,"_gl_DrawID",Pe),vt.render(st[Pe]/me,te[Pe])}else if(Z.isInstancedMesh)vt.renderInstances(se,ue,Z.count);else if(tt.isInstancedBufferGeometry){const st=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,te=Math.min(tt.instanceCount,st);vt.renderInstances(se,ue,te)}else vt.render(se,ue)};function ne(R,W,tt){R.transparent===!0&&R.side===Ve&&R.forceSinglePass===!1?(R.side=An,R.needsUpdate=!0,At(R,W,tt),R.side=Ni,R.needsUpdate=!0,At(R,W,tt),R.side=Ve):At(R,W,tt)}this.compile=function(R,W,tt=null){tt===null&&(tt=R),p=Ft.get(tt),p.init(W),_.push(p),tt.traverseVisible(function(Z){Z.isLight&&Z.layers.test(W.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),R!==tt&&R.traverseVisible(function(Z){Z.isLight&&Z.layers.test(W.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),p.setupLights();const et=new Set;return R.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const Et=Z.material;if(Et)if(Array.isArray(Et))for(let Ct=0;Ct<Et.length;Ct++){const Yt=Et[Ct];ne(Yt,tt,Z),et.add(Yt)}else ne(Et,tt,Z),et.add(Et)}),_.pop(),p=null,et},this.compileAsync=function(R,W,tt=null){const et=this.compile(R,W,tt);return new Promise(Z=>{function Et(){if(et.forEach(function(Ct){Pt.get(Ct).currentProgram.isReady()&&et.delete(Ct)}),et.size===0){Z(R);return}setTimeout(Et,10)}Wt.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let xe=null;function Fe(R){xe&&xe(R)}function pn(){_e.stop()}function Le(){_e.start()}const _e=new bf;_e.setAnimationLoop(Fe),typeof self<"u"&&_e.setContext(self),this.setAnimationLoop=function(R){xe=R,Q.setAnimationLoop(R),R===null?_e.stop():_e.start()},Q.addEventListener("sessionstart",pn),Q.addEventListener("sessionend",Le),this.render=function(R,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(W),W=Q.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,W,E),p=Ft.get(R,_.length),p.init(W),_.push(p),yt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),j.setFromProjectionMatrix(yt),mt=this.localClippingEnabled,q=it.init(this.clippingPlanes,mt),m=pt.get(R,x.length),m.init(),x.push(m),Q.enabled===!0&&Q.isPresenting===!0){const Et=v.xr.getDepthSensingMesh();Et!==null&&Ee(Et,W,-1/0,v.sortObjects)}Ee(R,W,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(F,B),Tt=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,Tt&&H.addToRenderList(m,R),this.info.render.frame++,q===!0&&it.beginShadows();const tt=p.state.shadowsArray;Mt.render(tt,R,W),q===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,Z=m.transmissive;if(p.setupLights(),W.isArrayCamera){const Et=W.cameras;if(Z.length>0)for(let Ct=0,Yt=Et.length;Ct<Yt;Ct++){const qt=Et[Ct];wn(et,Z,R,qt)}Tt&&H.render(R);for(let Ct=0,Yt=Et.length;Ct<Yt;Ct++){const qt=Et[Ct];Be(m,R,qt,qt.viewport)}}else Z.length>0&&wn(et,Z,R,W),Tt&&H.render(R),Be(m,R,W);E!==null&&(C.updateMultisampleRenderTarget(E),C.updateRenderTargetMipmap(E)),R.isScene===!0&&R.onAfterRender(v,R,W),Zt.resetDefaultState(),M=-1,b=null,_.pop(),_.length>0?(p=_[_.length-1],q===!0&&it.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Ee(R,W,tt,et){if(R.visible===!1)return;if(R.layers.test(W.layers)){if(R.isGroup)tt=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(W);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||j.intersectsSprite(R)){et&&Ut.setFromMatrixPosition(R.matrixWorld).applyMatrix4(yt);const Ct=at.update(R),Yt=R.material;Yt.visible&&m.push(R,Ct,Yt,tt,Ut.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||j.intersectsObject(R))){const Ct=at.update(R),Yt=R.material;if(et&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ut.copy(R.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Ut.copy(Ct.boundingSphere.center)),Ut.applyMatrix4(R.matrixWorld).applyMatrix4(yt)),Array.isArray(Yt)){const qt=Ct.groups;for(let Ot=0,zt=qt.length;Ot<zt;Ot++){const kt=qt[Ot],se=Yt[kt.materialIndex];se&&se.visible&&m.push(R,Ct,se,tt,Ut.z,kt)}}else Yt.visible&&m.push(R,Ct,Yt,tt,Ut.z,null)}}const Et=R.children;for(let Ct=0,Yt=Et.length;Ct<Yt;Ct++)Ee(Et[Ct],W,tt,et)}function Be(R,W,tt,et){const Z=R.opaque,Et=R.transmissive,Ct=R.transparent;p.setupLightsView(tt),q===!0&&it.setGlobalState(v.clippingPlanes,tt),et&&Nt.viewport(P.copy(et)),Z.length>0&&Ye(Z,W,tt),Et.length>0&&Ye(Et,W,tt),Ct.length>0&&Ye(Ct,W,tt),Nt.buffers.depth.setTest(!0),Nt.buffers.depth.setMask(!0),Nt.buffers.color.setMask(!0),Nt.setPolygonOffset(!1)}function wn(R,W,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new da(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float")?Hs:Mi,minFilter:ra,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:be.workingColorSpace}));const Et=p.state.transmissionRenderTarget[et.id],Ct=et.viewport||P;Et.setSize(Ct.z,Ct.w);const Yt=v.getRenderTarget();v.setRenderTarget(Et),v.getClearColor(G),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),Tt&&H.render(tt);const qt=v.toneMapping;v.toneMapping=Ui;const Ot=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),q===!0&&it.setGlobalState(v.clippingPlanes,et),Ye(R,tt,et),C.updateMultisampleRenderTarget(Et),C.updateRenderTargetMipmap(Et),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let kt=0,se=W.length;kt<se;kt++){const ge=W[kt],ue=ge.object,Ne=ge.geometry,vt=ge.material,st=ge.group;if(vt.side===Ve&&ue.layers.test(et.layers)){const te=vt.side;vt.side=An,vt.needsUpdate=!0,$(ue,tt,et,Ne,vt,st),vt.side=te,vt.needsUpdate=!0,zt=!0}}zt===!0&&(C.updateMultisampleRenderTarget(Et),C.updateRenderTargetMipmap(Et))}v.setRenderTarget(Yt),v.setClearColor(G,L),Ot!==void 0&&(et.viewport=Ot),v.toneMapping=qt}function Ye(R,W,tt){const et=W.isScene===!0?W.overrideMaterial:null;for(let Z=0,Et=R.length;Z<Et;Z++){const Ct=R[Z],Yt=Ct.object,qt=Ct.geometry,Ot=et===null?Ct.material:et,zt=Ct.group;Yt.layers.test(tt.layers)&&$(Yt,W,tt,qt,Ot,zt)}}function $(R,W,tt,et,Z,Et){R.onBeforeRender(v,W,tt,et,Z,Et),R.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Z.onBeforeRender(v,W,tt,et,R,Et),Z.transparent===!0&&Z.side===Ve&&Z.forceSinglePass===!1?(Z.side=An,Z.needsUpdate=!0,v.renderBufferDirect(tt,W,et,Z,R,Et),Z.side=Ni,Z.needsUpdate=!0,v.renderBufferDirect(tt,W,et,Z,R,Et),Z.side=Ve):v.renderBufferDirect(tt,W,et,Z,R,Et),R.onAfterRender(v,W,tt,et,Z,Et)}function At(R,W,tt){W.isScene!==!0&&(W=$t);const et=Pt.get(R),Z=p.state.lights,Et=p.state.shadowsArray,Ct=Z.state.version,Yt=Dt.getParameters(R,Z.state,Et,W,tt),qt=Dt.getProgramCacheKey(Yt);let Ot=et.programs;et.environment=R.isMeshStandardMaterial?W.environment:null,et.fog=W.fog,et.envMap=(R.isMeshStandardMaterial?Y:T).get(R.envMap||et.environment),et.envMapRotation=et.environment!==null&&R.envMap===null?W.environmentRotation:R.envMapRotation,Ot===void 0&&(R.addEventListener("dispose",Kt),Ot=new Map,et.programs=Ot);let zt=Ot.get(qt);if(zt!==void 0){if(et.currentProgram===zt&&et.lightsStateVersion===Ct)return Qt(R,Yt),zt}else Yt.uniforms=Dt.getUniforms(R),R.onBeforeCompile(Yt,v),zt=Dt.acquireProgram(Yt,qt),Ot.set(qt,zt),et.uniforms=Yt.uniforms;const kt=et.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(kt.clippingPlanes=it.uniform),Qt(R,Yt),et.needsLights=Te(R),et.lightsStateVersion=Ct,et.needsLights&&(kt.ambientLightColor.value=Z.state.ambient,kt.lightProbe.value=Z.state.probe,kt.directionalLights.value=Z.state.directional,kt.directionalLightShadows.value=Z.state.directionalShadow,kt.spotLights.value=Z.state.spot,kt.spotLightShadows.value=Z.state.spotShadow,kt.rectAreaLights.value=Z.state.rectArea,kt.ltc_1.value=Z.state.rectAreaLTC1,kt.ltc_2.value=Z.state.rectAreaLTC2,kt.pointLights.value=Z.state.point,kt.pointLightShadows.value=Z.state.pointShadow,kt.hemisphereLights.value=Z.state.hemi,kt.directionalShadowMap.value=Z.state.directionalShadowMap,kt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,kt.spotShadowMap.value=Z.state.spotShadowMap,kt.spotLightMatrix.value=Z.state.spotLightMatrix,kt.spotLightMap.value=Z.state.spotLightMap,kt.pointShadowMap.value=Z.state.pointShadowMap,kt.pointShadowMatrix.value=Z.state.pointShadowMatrix),et.currentProgram=zt,et.uniformsList=null,zt}function St(R){if(R.uniformsList===null){const W=R.currentProgram.getUniforms();R.uniformsList=Ho.seqWithValue(W.seq,R.uniforms)}return R.uniformsList}function Qt(R,W){const tt=Pt.get(R);tt.outputColorSpace=W.outputColorSpace,tt.batching=W.batching,tt.batchingColor=W.batchingColor,tt.instancing=W.instancing,tt.instancingColor=W.instancingColor,tt.instancingMorph=W.instancingMorph,tt.skinning=W.skinning,tt.morphTargets=W.morphTargets,tt.morphNormals=W.morphNormals,tt.morphColors=W.morphColors,tt.morphTargetsCount=W.morphTargetsCount,tt.numClippingPlanes=W.numClippingPlanes,tt.numIntersection=W.numClipIntersection,tt.vertexAlphas=W.vertexAlphas,tt.vertexTangents=W.vertexTangents,tt.toneMapping=W.toneMapping}function jt(R,W,tt,et,Z){W.isScene!==!0&&(W=$t),C.resetTextureUnits();const Et=W.fog,Ct=et.isMeshStandardMaterial?W.environment:null,Yt=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:is,qt=(et.isMeshStandardMaterial?Y:T).get(et.envMap||Ct),Ot=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,zt=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),kt=!!tt.morphAttributes.position,se=!!tt.morphAttributes.normal,ge=!!tt.morphAttributes.color;let ue=Ui;et.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(ue=v.toneMapping);const Ne=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,vt=Ne!==void 0?Ne.length:0,st=Pt.get(et),te=p.state.lights;if(q===!0&&(mt===!0||R!==b)){const on=R===b&&et.id===M;it.setState(et,R,on)}let oe=!1;et.version===st.__version?(st.needsLights&&st.lightsStateVersion!==te.state.version||st.outputColorSpace!==Yt||Z.isBatchedMesh&&st.batching===!1||!Z.isBatchedMesh&&st.batching===!0||Z.isBatchedMesh&&st.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&st.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&st.instancing===!1||!Z.isInstancedMesh&&st.instancing===!0||Z.isSkinnedMesh&&st.skinning===!1||!Z.isSkinnedMesh&&st.skinning===!0||Z.isInstancedMesh&&st.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&st.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&st.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&st.instancingMorph===!1&&Z.morphTexture!==null||st.envMap!==qt||et.fog===!0&&st.fog!==Et||st.numClippingPlanes!==void 0&&(st.numClippingPlanes!==it.numPlanes||st.numIntersection!==it.numIntersection)||st.vertexAlphas!==Ot||st.vertexTangents!==zt||st.morphTargets!==kt||st.morphNormals!==se||st.morphColors!==ge||st.toneMapping!==ue||st.morphTargetsCount!==vt)&&(oe=!0):(oe=!0,st.__version=et.version);let me=st.currentProgram;oe===!0&&(me=At(et,W,Z));let sn=!1,Pe=!1,hn=!1;const Se=me.getUniforms(),Qe=st.uniforms;if(Nt.useProgram(me.program)&&(sn=!0,Pe=!0,hn=!0),et.id!==M&&(M=et.id,Pe=!0),sn||b!==R){Nt.buffers.depth.getReversed()?(K.copy(R.projectionMatrix),Ux(K),Nx(K),Se.setValue(O,"projectionMatrix",K)):Se.setValue(O,"projectionMatrix",R.projectionMatrix),Se.setValue(O,"viewMatrix",R.matrixWorldInverse);const En=Se.map.cameraPosition;En!==void 0&&En.setValue(O,Lt.setFromMatrixPosition(R.matrixWorld)),Ht.logarithmicDepthBuffer&&Se.setValue(O,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&Se.setValue(O,"isOrthographic",R.isOrthographicCamera===!0),b!==R&&(b=R,Pe=!0,hn=!0)}if(Z.isSkinnedMesh){Se.setOptional(O,Z,"bindMatrix"),Se.setOptional(O,Z,"bindMatrixInverse");const on=Z.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),Se.setValue(O,"boneTexture",on.boneTexture,C))}Z.isBatchedMesh&&(Se.setOptional(O,Z,"batchingTexture"),Se.setValue(O,"batchingTexture",Z._matricesTexture,C),Se.setOptional(O,Z,"batchingIdTexture"),Se.setValue(O,"batchingIdTexture",Z._indirectTexture,C),Se.setOptional(O,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Se.setValue(O,"batchingColorTexture",Z._colorsTexture,C));const Kn=tt.morphAttributes;if((Kn.position!==void 0||Kn.normal!==void 0||Kn.color!==void 0)&&rt.update(Z,tt,me),(Pe||st.receiveShadow!==Z.receiveShadow)&&(st.receiveShadow=Z.receiveShadow,Se.setValue(O,"receiveShadow",Z.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(Qe.envMap.value=qt,Qe.flipEnvMap.value=qt.isCubeTexture&&qt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&W.environment!==null&&(Qe.envMapIntensity.value=W.environmentIntensity),Pe&&(Se.setValue(O,"toneMappingExposure",v.toneMappingExposure),st.needsLights&&re(Qe,hn),Et&&et.fog===!0&&J.refreshFogUniforms(Qe,Et),J.refreshMaterialUniforms(Qe,et,k,X,p.state.transmissionRenderTarget[R.id]),Ho.upload(O,St(st),Qe,C)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Ho.upload(O,St(st),Qe,C),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&Se.setValue(O,"center",Z.center),Se.setValue(O,"modelViewMatrix",Z.modelViewMatrix),Se.setValue(O,"normalMatrix",Z.normalMatrix),Se.setValue(O,"modelMatrix",Z.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const on=et.uniformsGroups;for(let En=0,In=on.length;En<In;En++){const Xs=on[En];N.update(Xs,me),N.bind(Xs,me)}}return me}function re(R,W){R.ambientLightColor.needsUpdate=W,R.lightProbe.needsUpdate=W,R.directionalLights.needsUpdate=W,R.directionalLightShadows.needsUpdate=W,R.pointLights.needsUpdate=W,R.pointLightShadows.needsUpdate=W,R.spotLights.needsUpdate=W,R.spotLightShadows.needsUpdate=W,R.rectAreaLights.needsUpdate=W,R.hemisphereLights.needsUpdate=W}function Te(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(R,W,tt){Pt.get(R.texture).__webglTexture=W,Pt.get(R.depthTexture).__webglTexture=tt;const et=Pt.get(R);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=tt===void 0,et.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,W){const tt=Pt.get(R);tt.__webglFramebuffer=W,tt.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(R,W=0,tt=0){E=R,S=W,w=tt;let et=!0,Z=null,Et=!1,Ct=!1;if(R){const qt=Pt.get(R);if(qt.__useDefaultFramebuffer!==void 0)Nt.bindFramebuffer(O.FRAMEBUFFER,null),et=!1;else if(qt.__webglFramebuffer===void 0)C.setupRenderTarget(R);else if(qt.__hasExternalTextures)C.rebindTextures(R,Pt.get(R.texture).__webglTexture,Pt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const kt=R.depthTexture;if(qt.__boundDepthTexture!==kt){if(kt!==null&&Pt.has(kt)&&(R.width!==kt.image.width||R.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(R)}}const Ot=R.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(Ct=!0);const zt=Pt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(zt[W])?Z=zt[W][tt]:Z=zt[W],Et=!0):R.samples>0&&C.useMultisampledRTT(R)===!1?Z=Pt.get(R).__webglMultisampledFramebuffer:Array.isArray(zt)?Z=zt[tt]:Z=zt,P.copy(R.viewport),U.copy(R.scissor),z=R.scissorTest}else P.copy(ut).multiplyScalar(k).floor(),U.copy(ot).multiplyScalar(k).floor(),z=ht;if(Nt.bindFramebuffer(O.FRAMEBUFFER,Z)&&et&&Nt.drawBuffers(R,Z),Nt.viewport(P),Nt.scissor(U),Nt.setScissorTest(z),Et){const qt=Pt.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+W,qt.__webglTexture,tt)}else if(Ct){const qt=Pt.get(R.texture),Ot=W||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,qt.__webglTexture,tt||0,Ot)}M=-1},this.readRenderTargetPixels=function(R,W,tt,et,Z,Et,Ct){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Yt=Yt[Ct]),Yt){Nt.bindFramebuffer(O.FRAMEBUFFER,Yt);try{const qt=R.texture,Ot=qt.format,zt=qt.type;if(!Ht.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=R.width-et&&tt>=0&&tt<=R.height-Z&&O.readPixels(W,tt,et,Z,Vt.convert(Ot),Vt.convert(zt),Et)}finally{const qt=E!==null?Pt.get(E).__webglFramebuffer:null;Nt.bindFramebuffer(O.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(R,W,tt,et,Z,Et,Ct){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Yt=Yt[Ct]),Yt){const qt=R.texture,Ot=qt.format,zt=qt.type;if(!Ht.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(W>=0&&W<=R.width-et&&tt>=0&&tt<=R.height-Z){Nt.bindFramebuffer(O.FRAMEBUFFER,Yt);const kt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,kt),O.bufferData(O.PIXEL_PACK_BUFFER,Et.byteLength,O.STREAM_READ),O.readPixels(W,tt,et,Z,Vt.convert(Ot),Vt.convert(zt),0);const se=E!==null?Pt.get(E).__webglFramebuffer:null;Nt.bindFramebuffer(O.FRAMEBUFFER,se);const ge=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await zx(O,ge,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,kt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Et),O.deleteBuffer(kt),O.deleteSync(ge),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,W=null,tt=0){R.isTexture!==!0&&(Ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),W=arguments[0]||null,R=arguments[1]);const et=Math.pow(2,-tt),Z=Math.floor(R.image.width*et),Et=Math.floor(R.image.height*et),Ct=W!==null?W.x:0,Yt=W!==null?W.y:0;C.setTexture2D(R,0),O.copyTexSubImage2D(O.TEXTURE_2D,tt,0,0,Ct,Yt,Z,Et),Nt.unbindTexture()},this.copyTextureToTexture=function(R,W,tt=null,et=null,Z=0){R.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,R=arguments[1],W=arguments[2],Z=arguments[3]||0,tt=null);let Et,Ct,Yt,qt,Ot,zt,kt,se,ge;const ue=R.isCompressedTexture?R.mipmaps[Z]:R.image;tt!==null?(Et=tt.max.x-tt.min.x,Ct=tt.max.y-tt.min.y,Yt=tt.isBox3?tt.max.z-tt.min.z:1,qt=tt.min.x,Ot=tt.min.y,zt=tt.isBox3?tt.min.z:0):(Et=ue.width,Ct=ue.height,Yt=ue.depth||1,qt=0,Ot=0,zt=0),et!==null?(kt=et.x,se=et.y,ge=et.z):(kt=0,se=0,ge=0);const Ne=Vt.convert(W.format),vt=Vt.convert(W.type);let st;W.isData3DTexture?(C.setTexture3D(W,0),st=O.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(C.setTexture2DArray(W,0),st=O.TEXTURE_2D_ARRAY):(C.setTexture2D(W,0),st=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,W.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,W.unpackAlignment);const te=O.getParameter(O.UNPACK_ROW_LENGTH),oe=O.getParameter(O.UNPACK_IMAGE_HEIGHT),me=O.getParameter(O.UNPACK_SKIP_PIXELS),sn=O.getParameter(O.UNPACK_SKIP_ROWS),Pe=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,ue.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ue.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,qt),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ot),O.pixelStorei(O.UNPACK_SKIP_IMAGES,zt);const hn=R.isDataArrayTexture||R.isData3DTexture,Se=W.isDataArrayTexture||W.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Qe=Pt.get(R),Kn=Pt.get(W),on=Pt.get(Qe.__renderTarget),En=Pt.get(Kn.__renderTarget);Nt.bindFramebuffer(O.READ_FRAMEBUFFER,on.__webglFramebuffer),Nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,En.__webglFramebuffer);for(let In=0;In<Yt;In++)hn&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pt.get(R).__webglTexture,Z,zt+In),R.isDepthTexture?(Se&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pt.get(W).__webglTexture,Z,ge+In),O.blitFramebuffer(qt,Ot,Et,Ct,kt,se,Et,Ct,O.DEPTH_BUFFER_BIT,O.NEAREST)):Se?O.copyTexSubImage3D(st,Z,kt,se,ge+In,qt,Ot,Et,Ct):O.copyTexSubImage2D(st,Z,kt,se,ge+In,qt,Ot,Et,Ct);Nt.bindFramebuffer(O.READ_FRAMEBUFFER,null),Nt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Se?R.isDataTexture||R.isData3DTexture?O.texSubImage3D(st,Z,kt,se,ge,Et,Ct,Yt,Ne,vt,ue.data):W.isCompressedArrayTexture?O.compressedTexSubImage3D(st,Z,kt,se,ge,Et,Ct,Yt,Ne,ue.data):O.texSubImage3D(st,Z,kt,se,ge,Et,Ct,Yt,Ne,vt,ue):R.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Z,kt,se,Et,Ct,Ne,vt,ue.data):R.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Z,kt,se,ue.width,ue.height,Ne,ue.data):O.texSubImage2D(O.TEXTURE_2D,Z,kt,se,Et,Ct,Ne,vt,ue);O.pixelStorei(O.UNPACK_ROW_LENGTH,te),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,oe),O.pixelStorei(O.UNPACK_SKIP_PIXELS,me),O.pixelStorei(O.UNPACK_SKIP_ROWS,sn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Pe),Z===0&&W.generateMipmaps&&O.generateMipmap(st),Nt.unbindTexture()},this.copyTextureToTexture3D=function(R,W,tt=null,et=null,Z=0){return R.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),tt=arguments[0]||null,et=arguments[1]||null,R=arguments[2],W=arguments[3],Z=arguments[4]||0),Ms('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,W,tt,et,Z)},this.initRenderTarget=function(R){Pt.get(R).__webglFramebuffer===void 0&&C.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?C.setTextureCube(R,0):R.isData3DTexture?C.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?C.setTexture2DArray(R,0):C.setTexture2D(R,0),Nt.unbindTexture()},this.resetState=function(){S=0,w=0,E=null,Nt.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=be._getDrawingBufferColorSpace(t),e.unpackColorSpace=be._getUnpackColorSpace()}}class Zb extends We{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class qb{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=vl,this.updateRanges=[],this.version=0,this.uuid=ai()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const vn=new V;class er{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)vn.fromBufferAttribute(this,e),vn.applyMatrix4(t),this.setXYZ(e,vn.x,vn.y,vn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)vn.fromBufferAttribute(this,e),vn.applyNormalMatrix(t),this.setXYZ(e,vn.x,vn.y,vn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)vn.fromBufferAttribute(this,e),vn.transformDirection(t),this.setXYZ(e,vn.x,vn.y,vn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=$n(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ce(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ce(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=$n(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=$n(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=$n(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=$n(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ce(e,this.array),i=Ce(i,this.array),a=Ce(a,this.array),s=Ce(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new fn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new er(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class yl extends fa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let za;const xs=new V,Ua=new V,Na=new V,Oa=new Xt,vs=new Xt,Pf=new Oe,bo=new V,_s=new V,So=new V,Jd=new Xt,dc=new Xt,Qd=new Xt;class tu extends We{constructor(t=new yl){if(super(),this.isSprite=!0,this.type="Sprite",za===void 0){za=new Je;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new qb(e,5);za.setIndex([0,1,2,0,2,3]),za.setAttribute("position",new er(i,3,0,!1)),za.setAttribute("uv",new er(i,2,3,!1))}this.geometry=za,this.material=t,this.center=new Xt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ua.setFromMatrixScale(this.matrixWorld),Pf.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Na.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ua.multiplyScalar(-Na.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;wo(bo.set(-.5,-.5,0),Na,o,Ua,a,s),wo(_s.set(.5,-.5,0),Na,o,Ua,a,s),wo(So.set(.5,.5,0),Na,o,Ua,a,s),Jd.set(0,0),dc.set(1,0),Qd.set(1,1);let r=t.ray.intersectTriangle(bo,_s,So,!1,xs);if(r===null&&(wo(_s.set(-.5,.5,0),Na,o,Ua,a,s),dc.set(0,1),r=t.ray.intersectTriangle(bo,So,_s,!1,xs),r===null))return;const l=t.ray.origin.distanceTo(xs);l<t.near||l>t.far||e.push({distance:l,point:xs.clone(),uv:kn.getInterpolation(xs,bo,_s,So,Jd,dc,Qd,new Xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function wo(n,t,e,i,a,s){Oa.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(vs.x=s*Oa.x-a*Oa.y,vs.y=a*Oa.x+s*Oa.y):vs.copy(Oa),n.copy(t),n.x+=vs.x,n.y+=vs.y,n.applyMatrix4(Pf)}class jl extends fa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const nr=new V,ir=new V,eu=new Oe,ys=new Yl,Eo=new dr,uc=new V,nu=new V;class jb extends We{constructor(t=new Je,e=new jl){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)nr.fromBufferAttribute(e,a-1),ir.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=nr.distanceTo(ir);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Eo.copy(i.boundingSphere),Eo.applyMatrix4(a),Eo.radius+=s,t.ray.intersectsSphere(Eo)===!1)return;eu.copy(a).invert(),ys.copy(t.ray).applyMatrix4(eu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=h.getX(y),x=h.getX(y+1),_=To(this,t,ys,l,p,x);_&&e.push(_)}if(this.isLineLoop){const y=h.getX(g-1),m=h.getX(u),p=To(this,t,ys,l,y,m);p&&e.push(p)}}else{const u=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let y=u,m=g-1;y<m;y+=c){const p=To(this,t,ys,l,y,y+1);p&&e.push(p)}if(this.isLineLoop){const y=To(this,t,ys,l,g-1,u);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function To(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(nr.fromBufferAttribute(o,a),ir.fromBufferAttribute(o,s),e.distanceSqToSegment(nr,ir,uc,nu)>i)return;uc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(uc);if(!(l<t.near||l>t.far))return{distance:l,point:nu.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const iu=new V,au=new V;class Cf extends jb{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)iu.fromBufferAttribute(e,a),au.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+iu.distanceTo(au);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ml extends Sn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class oi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Xt:new V);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new V,a=[],s=[],o=[],r=new V,l=new Oe;for(let u=0;u<=t;u++){const g=u/t;a[u]=this.getTangentAt(g,new V)}s[0]=new V,o[0]=new V;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(un(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,g))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(un(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(a[g],u*g)),o[g].crossVectors(a[g],s[g])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Kl extends oi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Xt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Kb extends Kl{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Jl(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Ao=new V,fc=new Jl,pc=new Jl,mc=new Jl;class Jb extends oi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new V){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(Ao.subVectors(a[0],a[1]).add(a[0]),c=Ao);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Ao.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Ao),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),u),y=Math.pow(f.distanceToSquared(d),u),m=Math.pow(d.distanceToSquared(h),u);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),fc.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,g,y,m),pc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,g,y,m),mc.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,g,y,m)}else this.curveType==="catmullrom"&&(fc.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),pc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),mc.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(fc.calc(l),pc.calc(l),mc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new V().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function su(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function Qb(n,t){const e=1-n;return e*e*t}function t1(n,t){return 2*(1-n)*n*t}function e1(n,t){return n*n*t}function Es(n,t,e,i){return Qb(n,t)+t1(n,e)+e1(n,i)}function n1(n,t){const e=1-n;return e*e*e*t}function i1(n,t){const e=1-n;return 3*e*e*n*t}function a1(n,t){return 3*(1-n)*n*n*t}function s1(n,t){return n*n*n*t}function Ts(n,t,e,i,a){return n1(n,t)+i1(n,e)+a1(n,i)+s1(n,a)}class Lf extends oi{constructor(t=new Xt,e=new Xt,i=new Xt,a=new Xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Xt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ts(t,a.x,s.x,o.x,r.x),Ts(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class o1 extends oi{constructor(t=new V,e=new V,i=new V,a=new V){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new V){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ts(t,a.x,s.x,o.x,r.x),Ts(t,a.y,s.y,o.y,r.y),Ts(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Df extends oi{constructor(t=new Xt,e=new Xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Xt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class r1 extends oi{constructor(t=new V,e=new V){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new V){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new V){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kf extends oi{constructor(t=new Xt,e=new Xt,i=new Xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Xt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Es(t,a.x,s.x,o.x),Es(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class c1 extends oi{constructor(t=new V,e=new V,i=new V){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new V){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Es(t,a.x,s.x,o.x),Es(t,a.y,s.y,o.y),Es(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class If extends oi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Xt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(su(r,l.x,c.x,h.x,f.x),su(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Xt().fromArray(a))}return this}}var ou=Object.freeze({__proto__:null,ArcCurve:Kb,CatmullRomCurve3:Jb,CubicBezierCurve:Lf,CubicBezierCurve3:o1,EllipseCurve:Kl,LineCurve:Df,LineCurve3:r1,QuadraticBezierCurve:kf,QuadraticBezierCurve3:c1,SplineCurve:If});class l1 extends oi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ou[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new ou[a.type]().fromJSON(a))}return this}}class ru extends l1{constructor(t){super(),this.type="Path",this.currentPoint=new Xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Df(this.currentPoint.clone(),new Xt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new kf(this.currentPoint.clone(),new Xt(t,e),new Xt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Lf(this.currentPoint.clone(),new Xt(t,e),new Xt(i,a),new Xt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new If(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Kl(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ql extends Je{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new V,h=new Xt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Re(o,3)),this.setAttribute("normal",new Re(r,3)),this.setAttribute("uv",new Re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ql(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Fs extends Je{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let g=0;const y=[],m=i/2;let p=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Re(f,3)),this.setAttribute("normal",new Re(d,3)),this.setAttribute("uv",new Re(u,2));function x(){const v=new V,A=new V;let S=0;const w=(e-t)/i;for(let E=0;E<=s;E++){const M=[],b=E/s,P=b*(e-t)+t;for(let U=0;U<=a;U++){const z=U/a,G=z*l+r,L=Math.sin(G),D=Math.cos(G);A.x=P*L,A.y=-b*i+m,A.z=P*D,f.push(A.x,A.y,A.z),v.set(L,w,D).normalize(),d.push(v.x,v.y,v.z),u.push(z,1-b),M.push(g++)}y.push(M)}for(let E=0;E<a;E++)for(let M=0;M<s;M++){const b=y[M][E],P=y[M+1][E],U=y[M+1][E+1],z=y[M][E+1];(t>0||M!==0)&&(h.push(b,P,z),S+=3),(e>0||M!==s-1)&&(h.push(P,U,z),S+=3)}c.addGroup(p,S,0),p+=S}function _(v){const A=g,S=new Xt,w=new V;let E=0;const M=v===!0?t:e,b=v===!0?1:-1;for(let U=1;U<=a;U++)f.push(0,m*b,0),d.push(0,b,0),u.push(.5,.5),g++;const P=g;for(let U=0;U<=a;U++){const G=U/a*l+r,L=Math.cos(G),D=Math.sin(G);w.x=M*D,w.y=m*b,w.z=M*L,f.push(w.x,w.y,w.z),d.push(0,b,0),S.x=L*.5+.5,S.y=D*.5*b+.5,u.push(S.x,S.y),g++}for(let U=0;U<a;U++){const z=A+U,G=P+U;v===!0?h.push(G,G+1,z):h.push(G+1,G,z),E+=3}c.addGroup(p,E,v===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class th extends Fs{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new th(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class eh extends Je{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Re(s,3)),this.setAttribute("normal",new Re(s.slice(),3)),this.setAttribute("uv",new Re(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(x){const _=new V,v=new V,A=new V;for(let S=0;S<e.length;S+=3)u(e[S+0],_),u(e[S+1],v),u(e[S+2],A),l(_,v,A,x)}function l(x,_,v,A){const S=A+1,w=[];for(let E=0;E<=S;E++){w[E]=[];const M=x.clone().lerp(v,E/S),b=_.clone().lerp(v,E/S),P=S-E;for(let U=0;U<=P;U++)U===0&&E===S?w[E][U]=M:w[E][U]=M.clone().lerp(b,U/P)}for(let E=0;E<S;E++)for(let M=0;M<2*(S-E)-1;M++){const b=Math.floor(M/2);M%2===0?(d(w[E][b+1]),d(w[E+1][b]),d(w[E][b])):(d(w[E][b+1]),d(w[E+1][b+1]),d(w[E+1][b]))}}function c(x){const _=new V;for(let v=0;v<s.length;v+=3)_.x=s[v+0],_.y=s[v+1],_.z=s[v+2],_.normalize().multiplyScalar(x),s[v+0]=_.x,s[v+1]=_.y,s[v+2]=_.z}function h(){const x=new V;for(let _=0;_<s.length;_+=3){x.x=s[_+0],x.y=s[_+1],x.z=s[_+2];const v=m(x)/2/Math.PI+.5,A=p(x)/Math.PI+.5;o.push(v,1-A)}g(),f()}function f(){for(let x=0;x<o.length;x+=6){const _=o[x+0],v=o[x+2],A=o[x+4],S=Math.max(_,v,A),w=Math.min(_,v,A);S>.9&&w<.1&&(_<.2&&(o[x+0]+=1),v<.2&&(o[x+2]+=1),A<.2&&(o[x+4]+=1))}}function d(x){s.push(x.x,x.y,x.z)}function u(x,_){const v=x*3;_.x=t[v+0],_.y=t[v+1],_.z=t[v+2]}function g(){const x=new V,_=new V,v=new V,A=new V,S=new Xt,w=new Xt,E=new Xt;for(let M=0,b=0;M<s.length;M+=9,b+=6){x.set(s[M+0],s[M+1],s[M+2]),_.set(s[M+3],s[M+4],s[M+5]),v.set(s[M+6],s[M+7],s[M+8]),S.set(o[b+0],o[b+1]),w.set(o[b+2],o[b+3]),E.set(o[b+4],o[b+5]),A.copy(x).add(_).add(v).divideScalar(3);const P=m(A);y(S,b+0,x,P),y(w,b+2,_,P),y(E,b+4,v,P)}}function y(x,_,v,A){A<0&&x.x===1&&(o[_]=x.x-1),v.x===0&&v.z===0&&(o[_]=A/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new eh(t.vertices,t.indices,t.radius,t.details)}}const Ro=new V,Po=new V,gc=new V,Co=new kn;class h1 extends Je{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos($a*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:y,b:m,c:p}=Co;if(y.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),Co.getNormal(gc),f[0]=`${Math.round(y.x*a)},${Math.round(y.y*a)},${Math.round(y.z*a)}`,f[1]=`${Math.round(m.x*a)},${Math.round(m.y*a)},${Math.round(m.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){const _=(x+1)%3,v=f[x],A=f[_],S=Co[h[x]],w=Co[h[_]],E=`${v}_${A}`,M=`${A}_${v}`;M in d&&d[M]?(gc.dot(d[M].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(w.x,w.y,w.z)),d[M]=null):E in d||(d[E]={index0:c[x],index1:c[_],normal:gc.clone()})}}for(const g in d)if(d[g]){const{index0:y,index1:m}=d[g];Ro.fromBufferAttribute(r,y),Po.fromBufferAttribute(r,m),u.push(Ro.x,Ro.y,Ro.z),u.push(Po.x,Po.y,Po.z)}this.setAttribute("position",new Re(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Ff extends ru{constructor(t){super(t),this.uuid=ai(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new ru().fromJSON(a))}return this}}const d1={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=zf(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=g1(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let g=e;g<a;g+=e)f=n[g],d=n[g+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return zs(s,o,e,r,l,u,0),o}};function zf(n,t,e,i,a){let s,o;if(a===A1(n,t,e,i)>0)for(s=t;s<e;s+=i)o=cu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=cu(s,n[s],n[s+1],o);return o&&fr(o,o.next)&&(Ns(o),o=o.next),o}function ua(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(fr(e,e.next)||Xe(e.prev,e,e.next)===0)){if(Ns(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function zs(n,t,e,i,a,s,o){if(!n)return;!o&&s&&M1(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?f1(n,i,a,s):u1(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Ns(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=p1(ua(n),t,e),zs(n,t,e,i,a,s,2)):o===2&&m1(n,t,e,i,a,s):zs(ua(n),t,e,i,a,s,1);break}}}function u1(n){const t=n.prev,e=n,i=n.next;if(Xe(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=u&&Va(a,r,s,l,o,c,g.x,g.y)&&Xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function f1(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Xe(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,g=h<f?h<d?h:d:f<d?f:d,y=r>l?r>c?r:c:l>c?l:c,m=h>f?h>d?h:d:f>d?f:d,p=bl(u,g,t,e,i),x=bl(y,m,t,e,i);let _=n.prevZ,v=n.nextZ;for(;_&&_.z>=p&&v&&v.z<=x;){if(_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==a&&_!==o&&Va(r,h,l,f,c,d,_.x,_.y)&&Xe(_.prev,_,_.next)>=0||(_=_.prevZ,v.x>=u&&v.x<=y&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&Va(r,h,l,f,c,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;_&&_.z>=p;){if(_.x>=u&&_.x<=y&&_.y>=g&&_.y<=m&&_!==a&&_!==o&&Va(r,h,l,f,c,d,_.x,_.y)&&Xe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;v&&v.z<=x;){if(v.x>=u&&v.x<=y&&v.y>=g&&v.y<=m&&v!==a&&v!==o&&Va(r,h,l,f,c,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function p1(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!fr(a,s)&&Uf(a,i,i.next,s)&&Us(a,s)&&Us(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Ns(i),Ns(i.next),i=n=s),i=i.next}while(i!==n);return ua(i)}function m1(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&w1(o,r)){let l=Nf(o,r);o=ua(o,o.next),l=ua(l,l.next),zs(o,t,e,i,a,s,0),zs(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function g1(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=zf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(S1(c));for(a.sort(x1),s=0;s<a.length;s++)e=v1(a[s],e);return e}function x1(n,t){return n.x-t.x}function v1(n,t){const e=_1(n,t);if(!e)return t;const i=Nf(e,n);return ua(i,i.next),ua(e,e.next)}function _1(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&Va(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Us(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&y1(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function y1(n,t){return Xe(n.prev,n,t.prev)<0&&Xe(t.next,n,n.next)<0}function M1(n,t,e,i){let a=n;do a.z===0&&(a.z=bl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,b1(a)}function b1(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function bl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function S1(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Va(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function w1(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!E1(n,t)&&(Us(n,t)&&Us(t,n)&&T1(n,t)&&(Xe(n.prev,n,t.prev)||Xe(n,t.prev,t))||fr(n,t)&&Xe(n.prev,n,n.next)>0&&Xe(t.prev,t,t.next)>0)}function Xe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function fr(n,t){return n.x===t.x&&n.y===t.y}function Uf(n,t,e,i){const a=Do(Xe(n,t,e)),s=Do(Xe(n,t,i)),o=Do(Xe(e,i,n)),r=Do(Xe(e,i,t));return!!(a!==s&&o!==r||a===0&&Lo(n,e,t)||s===0&&Lo(n,i,t)||o===0&&Lo(e,n,i)||r===0&&Lo(e,t,i))}function Lo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Do(n){return n>0?1:n<0?-1:0}function E1(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Uf(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Us(n,t){return Xe(n.prev,n,n.next)<0?Xe(n,t,n.next)>=0&&Xe(n,n.prev,t)>=0:Xe(n,t,n.prev)<0||Xe(n,n.next,t)<0}function T1(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Nf(n,t){const e=new Sl(n.i,n.x,n.y),i=new Sl(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function cu(n,t,e,i){const a=new Sl(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Ns(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Sl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function A1(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class As{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return As.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];lu(t),hu(i,t);let o=t.length;e.forEach(lu);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,hu(i,e[l]);const r=d1.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function lu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function hu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class nh extends eh{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new nh(t.radius,t.detail)}}class Os extends Je{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new V,g=new Xt;for(let y=0;y<=a;y++){for(let m=0;m<=i;m++){const p=s+m/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),g.x=(u.x/e+1)/2,g.y=(u.y/e+1)/2,h.push(g.x,g.y)}f+=d}for(let y=0;y<a;y++){const m=y*(i+1);for(let p=0;p<i;p++){const x=p+m,_=x,v=x+i+1,A=x+i+2,S=x+1;r.push(_,v,S),r.push(v,A,S)}}this.setIndex(r),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Os(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ih extends Je{constructor(t=new Ff([new Xt(0,.5),new Xt(-.5,-.5),new Xt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Re(a,3)),this.setAttribute("normal",new Re(s,3)),this.setAttribute("uv",new Re(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const g=d.holes;As.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){const x=g[m];As.isClockWise(x)===!0&&(g[m]=x.reverse())}const y=As.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){const x=g[m];u=u.concat(x)}for(let m=0,p=u.length;m<p;m++){const x=u[m];a.push(x.x,x.y,0),s.push(0,0,1),o.push(x.x,x.y)}for(let m=0,p=y.length;m<p;m++){const x=y[m],_=x[0]+f,v=x[1]+f,A=x[2]+f;i.push(_,v,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return R1(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new ih(i,t.curveSegments)}}function R1(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class pr extends Je{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new V,f=new V,d=new V;for(let u=0;u<=i;u++)for(let g=0;g<=a;g++){const y=g/a*s,m=u/i*Math.PI*2;f.x=(t+e*Math.cos(m))*Math.cos(y),f.y=(t+e*Math.cos(m))*Math.sin(y),f.z=e*Math.sin(m),r.push(f.x,f.y,f.z),h.x=t*Math.cos(y),h.y=t*Math.sin(y),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=a;g++){const y=(a+1)*u+g-1,m=(a+1)*(u-1)+g-1,p=(a+1)*(u-1)+g,x=(a+1)*u+g;o.push(y,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new Re(r,3)),this.setAttribute("normal",new Re(l,3)),this.setAttribute("uv",new Re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Bs extends fa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=df,this.normalScale=new Xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Of extends We{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class P1 extends Of{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const xc=new Oe,du=new V,uu=new V;class C1{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zl,this._frameExtents=new Xt(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;du.setFromMatrixPosition(t.matrixWorld),e.position.copy(du),uu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(uu),e.updateMatrixWorld(),xc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(xc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class L1 extends C1{constructor(){super(new Sf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class D1 extends Of{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(We.DEFAULT_UP),this.updateMatrix(),this.target=new We,this.shadow=new L1}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const fu=new Oe;class k1{constructor(t,e,i=0,a=1/0){this.ray=new Yl(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new $l,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return fu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fu),this}intersectObject(t,e=!0,i=[]){return wl(t,this,i,e),i.sort(pu),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)wl(t[a],this,i,e);return i.sort(pu),i}}function pu(n,t){return n.distance-t.distance}function wl(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)wl(s[o],t,e,!0)}}class I1 extends Cf{constructor(t=10,e=10,i=4473924,a=8947848){i=new ee(i),a=new ee(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,g=-r;d<=e;d++,g+=o){l.push(-r,0,g,r,0,g),l.push(g,0,-r,g,0,r);const y=d===s?i:a;y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3,y.toArray(c,u),u+=3}const h=new Je;h.setAttribute("position",new Re(l,3)),h.setAttribute("color",new Re(c,3));const f=new jl({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ul}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ul);const F1={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function z1(n,t,e,i){const a=new Nn(n.fov,i,.1,200),s=new V,o=new V,r=new V;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0;function g(){const y=(n.pitchDeg+h.pitchDelta)*Math.PI/180,m=n.yawDeg*Math.PI/180;r.set(Math.sin(m)*Math.cos(y),Math.sin(y),Math.cos(m)*Math.cos(y)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return g(),{camera:a,update(y,m,p,x,_=F1){const v=m+.6;if(!l)s.set(y,v,p),l=!0;else{const w=1-Math.exp(-Math.max(n.smoothing,.001)*x);s.x+=(y-s.x)*w,s.y+=(v-s.y)*w,s.z+=(p-s.z)*w}const A=1-Math.exp(-Math.max(t.smoothing,.001)*x);h.distanceScale+=(_.distanceScale-h.distanceScale)*A,h.offsetX+=(_.offsetX-h.offsetX)*A,h.offsetZ+=(_.offsetZ-h.offsetZ)*A,h.pitchDelta+=(_.pitchDelta-h.pitchDelta)*A;const S=1-Math.exp(-Math.max(e.smoothing,.001)*x);if(h.zoom+=(f-h.zoom)*S,g(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=x*52;const w=d*.055;a.position.x+=Math.sin(u*1.7)*w,a.position.y+=Math.sin(u*2.3+1.1)*w*.75,a.position.z+=Math.sin(u*1.3+2.4)*w*.5,d*=Math.exp(-9*x)}else d=0;a.updateMatrixWorld()},snap(y,m,p){s.set(y,m+.6,p),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),g(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(y){a.aspect=y,a.updateProjectionMatrix()},getGroundBasis(){const y=new V().setFromMatrixColumn(a.matrixWorld,0),m=new V().setFromMatrixColumn(a.matrixWorld,2).negate(),p=Math.hypot(y.x,y.z)||1,x=Math.hypot(m.x,m.z)||1;return{rightX:y.x/p,rightZ:y.z/p,forwardX:m.x/x,forwardZ:m.z/x}},addShake(y){!Number.isFinite(y)||y<=0||(d=Math.min(1,d+y))},shakeLevel(){return d},setZoom(y){f=Number.isFinite(y)&&y>0?y:1},smart(){return{...h}}}}const ca=Math.PI*2,On=1e-6;function Rn(n,t,e){return n<t?t:n>e?e:n}function Bf(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function U1(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Hf(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=U1(n);return i===1?a:e+(a-e)*i}function mu(n){return(1-Math.sin(n))/2}function ah(n,t,e){const i=Math.PI/180,a=Rn(Number.isFinite(t)?t:100,0,180),s=Rn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Rn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function sh(n,t){if(!n.grounded||n.speed<On)return Bf();const e=n.speed/Math.max(n.moveSpeed,On),i=Math.max(n.legLength,On),a=n.stride>On?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+On,h=ah(n.localForward/Math.max(n.speed,On),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,g=n.localRight>=0?1:-1,y=a,m=G=>Math.asin(Rn(G,-o,o)/i);function p(G,L){const D=Hf(G,t.plantLock),X=mu(G),k=u*d*y*D,F=-m(k),B=L*g>0?1:-1,ut=1+B*t.crossStep*.45,ot=g*B*t.crossStep*y*.4*X,ht=g*f*y*t.sideWeight*ut*D+ot*f,j=m(ht),q=t.kneeLift*X*s*(.55+.25*d+(B>0?.2*f:0));return{pitchX:F,rollZ:j,kneeX:q}}const x=(n.phase%ca+ca)%ca,_=p(x,-1),v=p((x+Math.PI)%ca,1),A=Math.cos(x),S=mu(x),w=-t.comSway*s*A*(.6*d+.8*f)-g*t.comSway*s*f*.45,E=t.comBob*S*s,M=g*t.hipLean*s*f*A*.6,b=g*t.hipLean*s*f*(.45+.25*A),P=t.armSwing*s*A*(d*u+.3*f),U=P,z=-P;return{legL:_,legR:v,pelvisX:w,pelvisY:E,pelvisRoll:M,sideLean:b,armL:U,armR:z,strafe:f,backward:u<0?d:0}}function Gf(n){const t=(n%ca+ca)%ca,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Vf(n,t,e){const i=Rn(e.progress,0,1);if(i>=1||n.speed<On)return Bf();const a=i*i*(3-2*i),s=1-a;return sh({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Xf(n,t,e,i){const a=Rn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Rn(o*a,-1,1)*(e*Math.PI/180)}function Wf(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Rn(i,0,1),c=l*l;return e*c+r*(1-c)}function Yf(n,t,e,i,a){const s=Math.max(e,On),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>On?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>On&&n<=o&&c,resume:!d}}function $f(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Rn(n*Rn(t,0,2),-i,i)}function Zf(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function qf(n,t,e){const i=Rn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function N1(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Rn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function jf(n,t,e,i,a){const s=Rn(n,0,1),o=Rn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>On?e/h:1,d=h>On?i/h:0,u=Hf(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function bn(n){return n<0?0:n>1?1:n}const Go=Math.PI*2;function O1(n){return((n+Math.PI)%Go+Go)%Go-Math.PI}function B1(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function H1(n,t,e,i,a,s=n.phase){const o=bn(i);if(o<=0)return n;const r=bn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=bn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,g=r<=.5?r*2:(r-.5)*2,y=g*g*(3-2*g),m=r<=.5?y:1-y,p={speed:c,phase:s+Go*l/2*m,localForward:c*f,localRight:c*(1-f)*h},x=O1(p.phase-n.phase),_=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+x*_,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function G1(n,t,e){const i=B1(),a=bn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function Kf(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function gu(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Kf(s,a)}function V1(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function X1(n,t,e){const i=bn(n);return{gaitScale:1-i*(1-bn(t)),attackLegWeight:bn(e)*i}}function W1(n,t){const e=bn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function Y1(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return bn(t.minScale+(1-t.minScale)*e)}function $1(){return Jf()}function Jf(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function Z1(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function q1(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?bn(t.forceHitHeight):n.type==="light"?bn(t.hitHeight.light):n.type==="heavy"?bn(t.hitHeight.heavy):n.type==="knock"?bn(t.hitHeight.knock):0}function j1(n,t,e){const i=bn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function Qf(n,t,e){const i=Jf(),a=Z1(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=bn(1-n.timer/n.duration),o=Kf(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=q1(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const y=Math.sin(Math.PI*s);return i.upperPitch=a*y*f,i.upperRoll=-a*y*d*.7,i.drop=(a>.5?.09:.04)*y,i.flash=e.flashStrength*y,i.active=y>0,i}const u=a*o,g=j1(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(g.upperPitch*f+g.fold),i.upperRoll=-u*g.upperRoll*d,i.upperYaw=u*g.upperYaw*d,i.upperShift=u*g.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*g.back,i.drop=u*g.drop,i.knee=u*g.knee,i.hip=u*g.hip,i.arm=u*g.arm,i.flash=e.flashStrength*o,i}function tp(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Ji=1e-6;function Rs(n,t,e){return n<t?t:n>e?e:n}function ep(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Ji||s<=Ji||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+Ji,c=Math.hypot(n.x,n.y,n.z);if(c<=Ji)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),g=Rs(u,l,r),y=u>r+Ji||u<l-Ji,m=Math.atan2(-d,Math.max(f,Ji)),p=Rs((a*a+g*g-s*s)/(2*a*g),-1,1),x=Rs((s*s+g*g-a*a)/(2*s*g),-1,1),_=Math.acos(p),v=Math.acos(x),A=i>=0?1:-1;return{rootPitch:m-A*_,rootRoll:h,jointPitch:A*(_+v),clamped:y,reach:c/r}}function np(n,t,e,i){const a=Rs(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Rs((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function ip(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const oh={active:!1,weight:0,clamped:0,maxError:0};function ap(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...oh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new V));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const g=a[u],y=i.worldToLocal(l[u].clone()),m={x:y.x-g.root.position.x,y:y.y-g.root.position.y,z:y.z-g.root.position.z},p=ep(m,g.upperLen,g.lowerLen,g.bend);p.clamped&&(f+=1);const x=np({rootPitch:g.root.rotation.x,rootRoll:g.root.rotation.z,jointPitch:g.joint.rotation.x},p,c,h);g.root.rotation.x=x.rootPitch,g.root.rotation.z=x.rootRoll,g.joint.rotation.x=x.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const g=a[u].tip.getWorldPosition(new V);d=Math.max(d,g.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Ln(n,t,e){return n<t?t:n>e?e:n}function K1(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ie,d=new Ie;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ie;u.name="lower";const g=new Ie;g.name="upper",d.add(u),d.add(g);const y=[],m=(J,pt,Ft,it)=>{const Mt=new Bs({color:it}),H=new pe(new jn(J,pt,Ft),Mt);return H.castShadow=!0,H.receiveShadow=!0,y.push(Mt),H},p=n.headSize,x=n.legLength,_=n.armLength,v=n.limbThickness,A=n.bodyHeight,S=n.bodyWidth,w=m(S,A,.28,e);w.position.y=A/2,g.add(w);const E=new Ie;E.name="headPivot",E.rotation.order="YXZ",E.position.y=A,g.add(E);const M=m(p,p,p,e);M.position.y=p/2,E.add(M);for(const J of[-1,1]){const pt=m(.06,.07,.02,t.shoe);pt.position.set(J*.09,p/2+.03,p/2+.011),E.add(pt)}const b=(J,pt)=>{const Ft=pt?_:x,it=new Ie;it.name=pt?J<0?"shoulderL":"shoulderR":J<0?"hipL":"hipR",pt||(it.rotation.order="ZYX"),it.position.set(J*(pt?S/2+v/2:S/2-v/2),pt?A-.04:0,0),(pt?g:u).add(it);const Mt=m(v,Ft/2,v,t.limb);Mt.position.y=-Ft/4,it.add(Mt);const H=new Ie;H.name=pt?"elbow":"knee",H.position.y=-Ft/2,it.add(H);const rt=m(v,Ft/2,v,t.limb);if(rt.position.y=-Ft/4,H.add(rt),!pt){const ft=m(v*1.15,.07,v*1.7,t.shoe);ft.position.set(0,-Ft/2+.035,.045),H.add(ft);const Gt=new We;return Gt.name="footTip",Gt.position.y=-Ft/2,H.add(Gt),{root:it,joint:H,tip:Gt}}return{root:it,joint:H}},P=b(-1,!1),U=b(1,!1),z=b(-1,!0),G=b(1,!0),L=[P,U].map(J=>({root:J.root,joint:J.joint,tip:J.tip,upperLen:x/2,lowerLen:x/2,bend:1})),D=new en({color:a.attackArcColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),X=new pe(new pr(.62,.042,6,20,Math.PI*1.1),D);X.position.set(0,.78-x,.56),g.add(X);const k=new ee(e),F=new ee(r.flashColor),B=new ee;let ut=null,ot=0,ht=0,j=0,q=0,mt=0,K=0,yt=0,Lt={...oh},Ut=-1,$t=0,Tt=0,It=0,O=0,ce=0,Wt=0,Ht=0,Nt=1,Rt=0,Pt=0,C="none",T=0,Y=!1,lt=-1,dt=!1,at=0,Dt=0;return{group:f,boneAtWorld(J,pt,Ft){const it=[{node:g,ax:0,ay:.05,az:0,bx:0,by:A,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:G.root,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:G.joint,ax:0,ay:0,az:0,bx:0,by:-_/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0}],Mt=new V,H=new V,rt=new V(J,pt,Ft),ft=new V;let Gt=null,Vt=Number.POSITIVE_INFINITY;for(const Zt of it){Zt.node.updateWorldMatrix(!0,!1),Mt.set(Zt.ax,Zt.ay,Zt.az),H.set(Zt.bx,Zt.by,Zt.bz),Zt.node.localToWorld(Mt),Zt.node.localToWorld(H);const N=H.x-Mt.x,gt=H.y-Mt.y,Q=H.z-Mt.z,ct=N*N+gt*gt+Q*Q;let bt=ct>1e-8?((rt.x-Mt.x)*N+(rt.y-Mt.y)*gt+(rt.z-Mt.z)*Q)/ct:0;bt=Math.max(0,Math.min(1,bt));const wt=Mt.x+N*bt,Kt=Mt.y+gt*bt,ae=Mt.z+Q*bt,de=(rt.x-wt)**2+(rt.y-Kt)**2+(rt.z-ae)**2;de<Vt&&(Vt=de,Gt=Zt.node,ft.set(wt,Kt,ae))}return Gt?{node:Gt,point:ft.clone()}:null},update(J,pt){f.position.set(J.position.x,J.position.y,J.position.z),f.rotation.y=J.bodyYaw,E.rotation.y=(J.headYaw-J.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,J.mode!==ut&&(ut=J.mode,ot=1),ot=Math.max(0,ot-pt*2.2);const Ft=J.hurt,it=Qf(Ft,J.bodyYaw,r),Mt=it.flash;B.copy(F).multiplyScalar(Mt);for(const Ot of y)Ot.emissive.copy(k).multiplyScalar(ot*.5),Mt>0&&Ot.emissive.add(B);d.position.set(0,x,0),d.rotation.set(0,0,0),g.position.set(0,0,0),g.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const H=Math.hypot(J.velocity.x,J.velocity.z),rt=Ln(o.knockGaitScale??0,0,1),ft=J.hurt.knockX*rt,Gt=J.hurt.knockZ*rt,Vt=rt>0&&Math.hypot(J.hurt.knockX,J.hurt.knockZ)>.001,Zt=J.velocity.x+ft,N=J.velocity.z+Gt,gt=Math.hypot(Zt,N),Q=Math.cos(J.bodyYaw),ct=-Math.sin(J.bodyYaw),bt=H>1e-6?Ln((J.velocity.x*Q+J.velocity.z*ct)/H,-1,1):0,wt=H>1e-6?Ln((J.velocity.x*Math.sin(J.bodyYaw)+J.velocity.z*Math.cos(J.bodyYaw))/H,-1,1):1,Kt=ah(wt,o.backStrafeStartDeg,o.backStrafeFullDeg);C==="settled"&&dt&&at>Dt*1.02+1e-4&&(C="none");let ae=1;C==="blend"?(ae=qf(Y?lt:T,o.stopYawBlendMode,Y),Y||(T=Math.min(1,T+pt/Math.max(.01,o.stopYawAfterSec)),(T>=1||o.stopYawBlendMode==="inStop"||dt)&&(C="settled",ae=0))):C==="settled"&&(ae=Ln(H/Math.max(1e-6,o.stopEnterRatio*s),0,1));const de=Xf(bt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ne=Wf(wt,bt,de,Kt)*ae;Rt+=(ne-Rt)*(1-Math.exp(-12*Math.max(0,pt))),u.rotation.y=Rt;const xe=J.bodyYaw+Rt,Fe=Math.sin(xe),pn=Math.cos(xe),Le=Math.cos(xe),_e=-Math.sin(xe),Ee=Zt*Fe+N*pn,Be=Zt*Le+N*_e,wn=Math.max(0,o.stopBlendSec||0),Ye=wn>0&&!Vt,$=Yf(H,Pt,s,o.stopEnterRatio,o.stopExitRatio);if(!Ye||$.resume)Ut=-1;else if(Ut<0&&$.enter){Ut=0,$t=J.gaitPhase,Tt=Gf(J.gaitPhase),It=H,O=Math.max(J.stride,1e-6),ce=Ee,Wt=Be;const Ot=1/Math.max(1e-6,H);Ht=J.velocity.x*Ot,Nt=J.velocity.z*Ot}const At=Pt;Pt=H;const St=Ye&&Ut>=0;St&&(Ut=Math.min(1,Ut+pt/wn)),St&&C!=="blend"&&(C="blend",T=0),Y=St&&Ut<1,lt=Ut,dt=$.resume,at=H,Dt=At;const Qt=St?{phase:$t,speed:It,moveSpeed:s,localForward:ce,localRight:Wt,legLength:n.legLength,stride:O,grounded:!0}:{phase:J.gaitPhase,speed:gt,moveSpeed:s,localForward:Ee,localRight:Be,legLength:n.legLength,stride:J.stride,grounded:!0},jt=St?Vf(Qt,o,{progress:Ut,phase0:$t,phaseEnd:Tt}):sh(Qt,o);let re=0,Te=0,R=0,W=0;if(St){const Ot=Zf(J.bodyYaw,Ht,Nt),zt=jf(Ut,$t,Ot.forward,Ot.right,o);zt.leadLeft?(jt.legL.pitchX-=zt.leadPitch,jt.legL.kneeX+=zt.leadKnee,jt.legR.pitchX+=zt.trailPitch):(jt.legR.pitchX-=zt.leadPitch,jt.legR.kneeX+=zt.leadKnee,jt.legL.pitchX+=zt.trailPitch),Te=zt.bodyShift*zt.fwdN,re=zt.bodyShift*zt.rightN,R=zt.bodyDip,W=zt.chestPitch}P.root.rotation.x=jt.legL.pitchX,U.root.rotation.x=jt.legR.pitchX,P.root.rotation.z=jt.legL.rollZ,U.root.rotation.z=jt.legR.rollZ,P.joint.rotation.x=jt.legL.kneeX,U.joint.rotation.x=jt.legR.kneeX,z.root.rotation.x=jt.armL,G.root.rotation.x=jt.armR,z.joint.rotation.x=-.18,G.joint.rotation.x=-.18,d.position.x=jt.pelvisX,d.position.y=x+jt.pelvisY,d.position.z=0,d.rotation.z=jt.pelvisRoll,g.rotation.z=jt.sideLean*(it.intensity>0?.4:1);const tt=ip(d,u),et=St&&h.enabled?{...h,weight:1}:h,Z=et.enabled&&et.weight>0?Ln(et.weight,0,1):0;if(d.position.x+=re,d.position.z+=Te,d.position.y-=R,u.position.y+=R,Z<=0&&(u.position.x-=re,u.position.z-=Te),l){const Ot=Math.max(.004166666666666667,Math.min(pt,.1)),zt=Math.sin(J.bodyYaw),kt=Math.cos(J.bodyYaw),se=Ln((J.velocity.x-ht)/Ot,-60,60),ge=Ln((J.velocity.z-j)/Ot,-60,60),ue=se*zt+ge*kt,Ne=He(J.bodyYaw-q)/Ot,vt=l.maxForwardDeg*Math.PI/180,st=l.maxSideDeg*Math.PI/180,te=1-Math.exp(-Math.max(0,l.smoothing)*Ot);mt+=(Ln(ue*l.accelGain,-vt,vt)-mt)*te,K+=(Ln(-Ne*H*l.turnGain,-st,st)-K)*te;const oe=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;yt+=(Ln(H/Math.max(s,1e-6),0,1)-yt)*(1-Math.exp(-Math.max(0,oe)*Ot));const me=tp({leanForward:mt,leanSide:K,speedRatio:yt},l);g.rotation.x+=mt+W,g.rotation.z+=K,d.rotation.x+=me.pelvisPitch,d.rotation.z+=me.pelvisRoll,d.position.x+=me.pelvisX,d.position.z+=me.pelvisZ,d.position.y-=me.crouch,u.position.y+=me.crouch*(1-Z)}ht=J.velocity.x,j=J.velocity.z,q=J.bodyYaw,g.rotation.x+=it.upperPitch,g.rotation.z+=it.upperRoll,g.rotation.y+=it.upperYaw;const Et=Ln(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Ct=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;g.position.x+=Ln(it.upperShiftX*Et,-Ct,Ct),g.position.z+=Ln(it.upperShiftZ*Et,-Ct,Ct),d.position.x+=it.comX,d.position.z+=it.comZ-it.pelvisBack,d.position.y-=it.drop;const Yt=it.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=it.pelvisBack*(1-Yt),u.position.y+=it.drop*(1-Yt),P.joint.rotation.x+=it.knee,U.joint.rotation.x+=it.knee,P.root.rotation.x-=it.hip,U.root.rotation.x-=it.hip,z.root.rotation.x+=it.arm,G.root.rotation.x+=it.arm*.8,J.attackPhase!=="idle"&&it.intensity===0){const Ot=J.attackProgress,zt=Ot<.34?-1:Ot<.68?-1+(Ot-.34)/.34*2:Math.max(0,1-(Ot-.68)/.32),kt=Math.max(0,-zt),se=Math.max(0,zt);G.root.rotation.x=-1.7*kt+1.25*se,G.joint.rotation.x=-(.25+kt*.45),g.rotation.y=-.28*zt,D.opacity=J.attackPhase==="active"?.85:0,J.attackPhase==="active"&&(X.rotation.z=-1.1+Ot*3)}else D.opacity=0;const qt=$f(Rt,o.chestYawScale,o.chestYawMaxDeg);g.rotation.y+=qt,E.rotation.y=(J.headYaw-J.bodyYaw-qt+Math.PI*3)%(Math.PI*2)-Math.PI,Lt=ap({root:f,pelvis:d,lower:u,limbs:L,base:tt,cfg:et,grounded:!0,attacking:J.attackPhase!=="idle"})},ik(){return Lt},dispose(){f.traverse(J=>{if(J instanceof pe){J.geometry.dispose();const pt=J.material;Array.isArray(pt)?pt.forEach(Ft=>Ft.dispose()):pt.dispose()}})}}}const Qi=.012,ta=.016;function J1(n,t){const e=t.lab,i=new Ie;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(x){return o.push(x),x}function c(x){return r.push(x),x}function h(x,_,v,A=Qi){const S=l(new en({color:_,transparent:!0,opacity:v,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),w=new pe(x,S);return w.rotation.x=-Math.PI/2,w.position.y=A,w.renderOrder=2,w}function f(x,_){return c(new Os(Math.max(x,.001),_,72))}function d(x,_,v,A=ta){const w=document.createElement("canvas"),E=w.getContext("2d");if(!E)return new pe;const M='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=M,w.width=od.ceilPowerOfTwo(Math.ceil(E.measureText(x).width)+32),w.height=od.ceilPowerOfTwo(96*1.4);const b=w.getContext("2d");if(!b)return new pe;b.font=M,b.textAlign="center",b.textBaseline="middle",b.fillStyle=v,b.fillText(x,w.width/2,w.height/2);const P=new Ml(w);P.colorSpace=yn,s.push(P);const U=w.width/w.height,z=c(new Un(_*U,_)),G=l(new en({map:P,transparent:!0,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new pe(z,G);return L.rotation.x=-Math.PI/2,L.position.y=A,L.renderOrder=3,L}function u(x,_,v,A,S,w){const E=v-_,M=c(new Un(E,A)),b=h(M,S,w,Qi);b.position.set(E/2+_,Qi,0);const P=new Ie;return P.add(b),P.rotation.y=x-Math.PI/2,P}function g(x,_,v,A,S){const w=new Ff;w.moveTo(0,_*.5),w.lineTo(-v*.5,_*.5-v*.9),w.lineTo(-v*.18,_*.5-v*.9),w.lineTo(-v*.18,-_*.5),w.lineTo(v*.18,-_*.5),w.lineTo(v*.18,_*.5-v*.9),w.lineTo(v*.5,_*.5-v*.9),w.closePath();const E=c(new ih(w)),M=h(E,A,S,Qi+.002),b=new Ie;return b.add(M),b.rotation.y=x+Math.PI,b}function y(x){var E;const _=new Ie,v=d(`${x.index} · ${x.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((E=v.geometry.parameters)==null?void 0:E.width)??3;_.add(v);const w=h(c(new Un(S*.98,.08)),x.color,.7,ta);return w.position.set(0,ta,t.lab.labelTextHeight*.66),_.add(w),_.position.set(x.labelX,0,x.labelZ),_}const m=new Ie;for(const x of n??[]){const _=new Ie;if(_.position.set(x.x,0,x.z),x.shape==="square"){const v=x.radius,A=h(c(new Un(v*2,v*2)),x.color,e.padOpacity*.09);_.add(A);const S=.07,w=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[E,M,b,P]of w){const U=h(c(new Un(b,P)),x.color,e.padOpacity);U.position.x=E,U.position.z=M,_.add(U)}}else _.add(h(c(new Ql(x.radius,72)),x.color,e.padOpacity*.075)),_.add(h(f(x.radius-.075,x.radius),x.color,e.padOpacity));if(x.id==="hub"){for(let v=0;v<4;v++){const A=v*Math.PI/4,S=v%2===0;for(const w of[0,Math.PI])_.add(u(A+w,x.radius*.12,x.radius*.94,S?.09:.055,x.color,S?.5:.32))}_.add(h(f(.5,.56),x.color,.4))}else if(x.id==="dash"){const v=x.spawnZ-x.z,A=-x.radius+.5,S=v-A,w=h(c(new Un(.06,S)),x.color,.36);w.position.set(0,Qi,(v+A)/2),_.add(w);let E=0;for(let b=v;b>=A-.01;b-=1,E++){const P=E%5===0,U=h(c(new Un(P?2.4:1.3,P?.1:.07)),x.color,P?.72:.42);U.position.set(0,Qi,b),_.add(U);const z=d(String(E),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");z.position.set(1.6,ta,b),_.add(z)}const M=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[b,P]of M){const U=v-b,z=h(c(new Un(1.9,.09)),"#ffffff",.5);z.position.set(-1.5,Qi,U),_.add(z);const G=d(P,.42,"rgba(220, 236, 250, 0.86)");G.position.set(-3,ta,U),_.add(G)}}else if(x.id==="gait"){_.add(h(f(1.44,1.5),x.color,.5)),_.add(h(f(1.14,1.2),x.color,.22));const v=1.55,A=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,w,E]of A){const b=Math.sin(S),P=Math.cos(S),U=g(S,1.7,.34,E,.75);U.position.set(b*1.7*.5,0,v+P*1.7*.5),_.add(U);const z=d(w,.44,E);z.position.set(b*(1.7+.7),ta,v+P*(1.7+.7)),_.add(z)}}if(m.add(_),e.showLabels){const v=y(x);a.push(v),m.add(v)}}i.add(m);const p=n==null?void 0:n.find(x=>x.id==="hub");if(p&&e.showLabels){const x=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[_,v,A]of x){const S=d(A,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+_*(p.radius+.7),ta,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(x){i.visible=x},setLabelsVisible(x){for(const _ of a)_.visible=x},dispose(){for(const x of r)x.dispose();for(const x of o)x.dispose();for(const x of s)x.dispose();i.clear()}}}const rh=64,sp=[0,.24,.76,1],Q1=[0,1,1,0],op=[0,.12,.28,.5,.72,.88,1],tS=[0,.16,.5,1,.5,.16,0];function xu(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function ch(n,t,e,i,a=rh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?op:sp,c=s==="glow"?tS:Q1,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),g=[];for(let m=0;m<f;m++){const p=m/a,x=(p-.5)*e,_=xu(p,i)*xu(1-p,i),v=Math.sin(x),A=Math.cos(x);for(let S=0;S<h;S++){const w=o+(r-o)*l[S],E=m*h+S;d[E*3]=v*w,d[E*3+1]=0,d[E*3+2]=A*w;const M=_*c[S];u[E*4]=1,u[E*4+1]=1,u[E*4+2]=1,u[E*4+3]=M}}for(let m=0;m<a;m++)for(let p=0;p<h-1;p++){const x=m*h+p,_=x+h;g.push(x,_,x+1,x+1,_,_+1)}const y=new Je;return y.setAttribute("position",new fn(d,3)),y.setAttribute("color",new fn(u,4)),y.setIndex(g),y.computeBoundingSphere(),y}function vc(n){const t=new en({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const g=ch(n.radius,n.thickness*f,h,n.edgeFade,rh,n.profile??"band");if(e.set(d,g),e.size>64){for(const[y,m]of e)if(y!==d&&m!==i){m.dispose(),e.delete(y);break}}return g};i=a(n.arcRad,1);const s=new pe(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const g=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(g-r)>.01)&&(i=a(l,g),s.geometry=i,o=l,r=g),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function vu(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function eS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),g=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:g,level:r}}function nS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function iS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const g=u/e,y=t+(1-t)*g,m=c*a+u;s[m*3]=f*y,s[m*3+1]=0,s[m*3+2]=d*y;const p=Math.pow(1-g,1.8)*.9+(u===0?.1:0);o[m*4]=1,o[m*4+1]=1,o[m*4+2]=1,o[m*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new Je;return l.setAttribute("position",new fn(s,3)),l.setAttribute("color",new fn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function _u(n){const t=n.segments??rh,e=n.profile??"band",a=((e==="glow"?op.length:sp.length)-1)*6,s=ch(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),r=new pe(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const g=Math.min(1,Math.max(0,c)),y=Math.round(g*t),m=g>.001?Math.max(1,y)*a:0;m!==s.drawRange.count&&s.setDrawRange(0,m),l=y,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&g>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function yu(n){const t=new Ie,e=iS(48),i=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),a=new pe(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=ch(1-s*.5,s,Math.PI*2,0,64,"band"),r=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),l=new pe(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,g){const y=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=y*.26,r.opacity=y*(.72+.18*Math.sin(g*7)),t.visible=y>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function Mu(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function aS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function sS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function oS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function rS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function cS(n,t,e){return n?t:e}function rp(n){return{x:0,y:0,z:1}}function lS(n){return Math.asin(rp().y)}function hS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const El={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},dS=1e-6;function Dn(n,t,e){return n<t?t:n>e?e:n}function _c(n,t){const e=Math.max(.2,n);return Dn(Math.pow(e,-t),.5,2)}function uS(n,t){if(!t.enabled)return{...El};const e=Dn(n.swing,-1,1),i=Dn(n.charge,0,1),a=Dn(n.impact,0,1),s=Dn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Dn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const g=1-Dn(t.impactSquash,0,.6)*a;u*=g;const y=Math.max(1,t.runLeg),p=(n.grounded?1+(y-1)*s:1)*(1-Dn(t.impactSquash,0,.6)*a*.6),x=Dn(t.torsoGain,0,1),_=1+(u-1)*x;return u=Dn(u,.6,1.6),{arm:u,leg:Dn(p,.6,1.4),torso:Dn(_,.7,1.4),girthArm:_c(u,t.volumeExp),girthLeg:_c(p,t.volumeExp),girthTorso:_c(_,t.volumeExp)}}function fS(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function pS(n,t,e){const i=n*Math.exp(-Math.max(dS,e)*Math.max(0,t));return i<.001?0:Dn(i,0,1)}const bu=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function qa(n,t,e){return n<t?t:n>e?e:n}function Ue(n,t,e){return n+(t-n)*e}function mS(n){return n?typeof n=="string"?{clip:n}:n:null}function gS(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function xS(n,t){const e=n%3*2,i=bu[e],a=bu[e+1];return{...gS(),bodyYaw:Ue(i.yaw,a.yaw,t),bodyPitch:Ue(i.pitch,a.pitch,t),bodyRoll:Ue(i.roll,a.roll,t),pelvisX:Ue(i.px,a.px,t),pelvisZ:Ue(i.pz,a.pz,t),armPitch:Ue(i.ap,a.ap,t),armYaw:Ue(i.ay,a.ay,t),armRoll:Ue(i.ar,a.ar,t),elbow:Ue(i.el,a.el,t),bladePitch:Ue(i.blade,a.blade,t)}}function vS(n,t,e,i,a=0){var M,b,P;const s=((M=i.combo)==null?void 0:M[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=mS(s[r]),c=l?((b=i.clips)==null?void 0:b[l.clip])??null:null,h=qa(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,g=qa((e+1)/2,0,1),y=c&&c.keys.length>0?_0(c,g):xS(r,g),m=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",x=n==="dual-swords",_=c&&Xi(c,"bladeTwistOff")?y.bladeTwistOff:x?y.bladeTwist:0,v=c&&Xi(c,"bladeYawOff")?y.bladeYawOff:-y.bladeYaw,A={yaw:y.bodyYaw*u,rootYaw:y.rootYaw*u,spinYaw:y0(c,qa(a,0,1)),pitch:y.bodyPitch*u,roll:y.bodyRoll*u,pelvisZ:y.pelvisZ*u,pelvisX:y.pelvisX*u,armR:null,armL:null,bladePitch:y.bladePitch,bladePitchOff:c&&Xi(c,"bladePitchOff")?y.bladePitchOff:null,bladeTwist:y.bladeTwist,bladeTwistOff:_,bladeYaw:y.bladeYaw,bladeYawOff:v,lead:m,kind:p,strike:g,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:y.armPitch*d,yaw:y.armYaw*d,roll:y.armRoll*d,elbow:y.elbow*d},w=c?Xi(c,"armLPitch")||Xi(c,"armLYaw")||Xi(c,"armLRoll")||Xi(c,"elbowL"):!1,E=w?{pitch:y.armLPitch*d,yaw:y.armLYaw*d,roll:y.armLRoll*d,elbow:y.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return m==="L"?(A.armL=S,A.armR=n==="greatsword"?null:E):(A.armR=S,(n==="greatsword"||n==="dual-swords"||w)&&(A.armL=E)),A}function _S(n,t,e){const i=qa(e,0,1),a=(s,o)=>s?o?{pitch:Ue(s.pitch,o.pitch,i),yaw:Ue(s.yaw,o.yaw,i),roll:Ue(s.roll,o.roll,i),elbow:Ue(s.elbow,o.elbow,i)}:null:o;return{yaw:Ue(n.yaw,t.yaw,i),rootYaw:Ue(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ue(n.pitch,t.pitch,i),roll:Ue(n.roll,t.roll,i),pelvisZ:Ue(n.pelvisZ,t.pelvisZ,i),pelvisX:Ue(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ue(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ue(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ue(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ue(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ue(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ue(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ue(n.strike,t.strike,i),blend:t.blend??null}}function yS(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Su(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function MS(n,t){const e=(a,s)=>Math.abs(yS(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=Su(n.armR,t.armR),i+=Su(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function bS(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=qa(MS(n,t)/l,0,1);return o+(r-o)*c}function wu(n){const t=qa(n,0,1);return t*t*(3-2*t)}function ve(n,t,e){return n<t?t:n>e?e:n}const mi=1e-6;function Ge(n,t,e,i){const a=new pe(new jn(n,t,e),new Bs({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ze(){return new Ie}function Vo(n,t,e){const i=Ze(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function SS(n){const t=Vo(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function wS(n){const t=Ze(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function ES(n){const t=Ze(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ee(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function TS(n){const t=Ze();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function AS(n){const t=Ze(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function RS(n,t,e,i,a,s,o,r,l,c,h,f){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},g=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},y=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},m=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},p=Ze(),x=Ze();x.name="pelvis",x.position.y=n.legLength,p.add(x);const _=Ze();_.name="lower";const v=Ze();v.name="upper",x.add(_),x.add(v);const A=n.headSize,S=n.legLength,w=n.armLength,E=n.limbThickness,M=n.bodyHeight,b=n.bodyWidth,P=Ge(b,M,.28,t.body);P.position.y=M/2,v.add(P);const U=Ze();U.name="headPivot",U.rotation.order="YXZ",U.position.y=Math.min(i.headPivotHeight,M),v.add(U);const z=Ge(A,A,A,t.head);z.position.y=A/2,U.add(z);const G=new Bs({color:"#1b2733"});for(const I of[-1,1]){const nt=new pe(new jn(.06,.07,.02),G);nt.position.set(I*.09,A/2+.03,A/2+.011),U.add(nt)}const L=I=>{const nt=Ze();nt.name=I<0?"hipL":"hipR",nt.rotation.order="ZYX",nt.position.set(I*(b/2-E/2),0,0),_.add(nt);const _t=Ge(E,S/2,E,t.limb);_t.position.y=-S/4,nt.add(_t);const xt=Ze();xt.name="knee",xt.position.y=-S/2,nt.add(xt);const ie=Ge(E,S/2,E,t.limb);ie.position.y=-S/4,xt.add(ie);const Jt=Ge(E*1.15,.07,E*1.7,t.shoe);Jt.position.set(0,-S/2+.035,.045),xt.add(Jt);const ye=new We;ye.name="footTip",ye.position.y=-S/2,xt.add(ye);const Ae=Ze();return{root:nt,joint:xt,hand:Ae,wrist:Ae,tip:ye,upperMesh:_t,lowerMesh:ie,segLen:S/2}},D=I=>{const nt=Ze();nt.name=I<0?"shoulderL":"shoulderR",nt.rotation.order="YXZ",nt.position.set(I*(b/2+E/2),M-.04,0),v.add(nt);const _t=Ge(E,w/2,E,t.limb);_t.position.y=-w/4,nt.add(_t);const xt=Ze();xt.name="elbow",xt.position.y=-w/2,nt.add(xt);const ie=Ge(E,w/2,E,t.limb);ie.position.y=-w/4,xt.add(ie);const Jt=Ze();Jt.name=I<0?"handL":"handR",Jt.position.y=-w/2,xt.add(Jt);const ye=Ge(E*1.1,.09,E*1.1,t.head);ye.position.y=.045,Jt.add(ye);const Ae=Ze();return Ae.name=I<0?"wristL":"wristR",Jt.add(Ae),{root:nt,joint:xt,hand:Jt,wrist:Ae,upperMesh:_t,lowerMesh:ie,segLen:w/2}},X=L(-1),k=L(1),F=D(-1),B=D(1),ut=[X,k].map(I=>({root:I.root,joint:I.joint,tip:I.tip,upperLen:S/2,lowerLen:S/2,bend:1})),ot=Ze(),ht=Ze();ot.name="mountR",ht.name="mountL";const j=Ze(),q=Ze();j.name="gripR",q.name="gripL",B.wrist.add(ot),F.wrist.add(ht),ot.add(j),ht.add(q);const mt=ES(t),K=TS(t),yt=AS(t),Lt={"sword-shield":{right:Vo(.42,.075,t),left:wS(t)},"dual-swords":{right:Vo(.42,.075,t),left:Vo(.42,.075,t)},greatsword:{right:SS(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:mt.g,left:Ze(),orb:mt.orb},bow:{right:yt,left:K.g,arrow:yt,drawString:K.drawString}};for(const I of Object.keys(Lt))j.add(Lt[I].right),q.add(Lt[I].left),Lt[I].right.visible=!1,Lt[I].left.visible=!1;function Ut(I,nt,_t){const xt=new We;xt.name="bladeBase",xt.position.y=nt,I.add(xt);const ie=new We;ie.name="bladeTip",ie.position.y=_t,I.add(ie)}Ut(Lt["sword-shield"].right,.44,.55),Ut(Lt["dual-swords"].right,.44,.55),Ut(Lt["dual-swords"].left,.44,.55),Ut(Lt.greatsword.right,.74,.88),Ut(Lt.staff.right,.78,.92);let $t=null,Tt=0,It=0,O=0,ce=0,Wt=0,Ht=0,Nt=$1(),Rt={...oh},Pt=0,C=0,T=0,Y=-1,lt=0,dt=0,at=0,Dt=0,J=0,pt=0,Ft=0,it=1,Mt=0,H=0,rt=0,ft=!1,Gt=0,Vt=0,Zt=0,N=0,gt="none",Q=0,ct=1,bt=!1,wt=-1,Kt=!1,ae=0,de=0,ne=0,xe={...El},Fe=0,pn=0,Le={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},_e=NaN,Ee=0,Be=0,wn=0,Ye=NaN,$=NaN,At=-1,St=null,Qt=null,jt=0,re=1,Te=.1,R=null,W={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},tt=null,et=null,Z=null,Et=null,Ct=null,Yt=null,qt="R",Ot=0,zt=0,kt=0,se=0,ge=1,ue={speed:0,phase:0},Ne={lp:0,lr:0,rp:0,rr:0},vt=0,st=0,te=!0,oe=0,me="none",sn=0,Pe=0,hn=0,Se=.3,Qe=0;function Kn(I){const nt=Math.PI/180,_t=s;let xt=0,ie=0,Jt=0,ye=0;I==="sword-shield"?(xt=_t.swordPitchDeg*nt,Jt=_t.shieldPitchDeg*nt):I==="dual-swords"?(xt=_t.swordPitchDeg*nt,Jt=_t.swordPitchDeg*nt):I==="greatsword"?(xt=_t.greatswordPitchDeg*nt,Jt=_t.greatswordPitchDeg*nt):I==="staff"?xt=_t.staffPitchDeg*nt:Jt=_t.bowPitchDeg*nt,ot.rotation.set(xt,0,ie),ht.rotation.set(Jt,0,ye),ot.position.x=I==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function on(I){if(I!==$t){$t=I;for(const nt of Object.keys(Lt))Lt[nt].right.visible=nt===I,Lt[nt].left.visible=nt===I;Kn(I),K.drawString.position.z=-.06,yt.position.z=0,mt.orb.scale.setScalar(1),v.rotation.y=0}}on("sword-shield");const En=[];p.traverse(I=>{I instanceof pe&&I.material instanceof Bs&&En.push(I.material)});const In=new ee(r.flashColor);function Xs(I,nt){const _t=Qf(I,nt,r);Nt=_t,v.rotation.x+=_t.upperPitch,v.rotation.z+=_t.upperRoll,v.rotation.y+=_t.upperYaw;const xt=ve(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),ie=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;v.position.x+=ve(_t.upperShiftX*xt,-ie,ie),v.position.z+=ve(_t.upperShiftZ*xt,-ie,ie),x.position.x+=_t.comX,x.position.z+=_t.comZ-_t.pelvisBack,x.position.y-=_t.drop;const Jt=_t.legacy?0:ve(r.lowerScale,0,1);_.position.z+=_t.pelvisBack*(1-Jt),_.position.y+=_t.drop*(1-Jt),X.joint.rotation.x+=_t.knee,k.joint.rotation.x+=_t.knee,X.root.rotation.x-=_t.hip,k.root.rotation.x-=_t.hip,F.root.rotation.x+=_t.arm,B.root.rotation.x+=_t.arm*.8;for(const ye of En)ye.emissive.copy(In).multiplyScalar(_t.flash)}function Ws(I){return I<.22?-1:I<.42?-1+(I-.22)/.2*2:I<.5?1:Math.max(0,1-(I-.5)/.5)}function cp(I){for(const nt of[F,B])nt.upperMesh.scale.set(I.girthArm,I.arm,I.girthArm),nt.upperMesh.position.y=-nt.segLen/2*I.arm,nt.joint.position.y=-nt.segLen*I.arm,nt.lowerMesh.scale.set(I.girthArm,I.arm,I.girthArm),nt.lowerMesh.position.y=-nt.segLen/2*I.arm,nt.hand.position.y=-nt.segLen*I.arm;for(const nt of[X,k])nt.upperMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),nt.upperMesh.position.y=-nt.segLen/2*I.leg,nt.joint.position.y=-nt.segLen*I.leg,nt.lowerMesh.scale.set(I.girthLeg,I.leg,I.girthLeg),nt.lowerMesh.position.y=-nt.segLen/2*I.leg,nt.tip.position.y=-nt.segLen*I.leg;P.scale.set(I.girthTorso,I.torso,I.girthTorso),P.position.y=M/2*I.torso}function lp(I,nt){const _t=s.twoHandGripY??-.16,xt=Math.max(1,s.twoHandMaxStretch??1.25),ie=w*xt*.99,Jt=F.root.position.x,ye=F.root.position.y,Ae=F.root.position.z,De=F.root.rotation.y,tn=Math.cos(De),ze=Math.sin(De),$e=mn=>{const os=ot.localToWorld(new V(0,mn,0)),rs=v.worldToLocal(os),Ys=rs.x-Jt,vr=rs.y-ye,xa=rs.z-Ae,wi={x:Ys*tn-xa*ze,y:vr,z:Ys*ze+xa*tn};return{t:wi,dist:Math.hypot(wi.x,wi.y,wi.z)}};let je=_t,rn=$e(je);if(!Number.isFinite(rn.dist)||rn.dist<=mi)return;for(let mn=0;mn<18&&rn.dist>ie;mn++)if(je*=.78,rn=$e(je),!Number.isFinite(rn.dist)||rn.dist<=mi)return;Number.isFinite(_e)||(_e=je);const Fn=Math.max(0,s.twoHandSlideRate??9);_e+=(je-_e)*(1-Math.exp(-Fn*nt));const Bn=$e(_e),ri=Bn.t,Bi=Bn.dist,ci=Bi/Math.max(mi,w),li=ve(ci,1,xt),bi=Math.max(1,s.twoHandGripStart??1.02),pa=Math.max(bi+.001,xt),ma=ve(s.twoHandMinGrip??1,0,1),Si=ve((ci-bi)/(pa-bi),0,1),Hi=1-Si*Si*(3-2*Si)*(1-ma),Hn=w/2*li,xr=ep(ri,Hn,Hn,-1),ga=np({rootPitch:F.root.rotation.x,rootRoll:F.root.rotation.z,jointPitch:F.joint.rotation.x},xr,ve(I*Hi,0,1),Math.PI);F.root.rotation.x=ga.rootPitch,F.root.rotation.z=ga.rootRoll,F.joint.rotation.x=Math.min(ga.jointPitch,-.06);const Gi=1/Math.sqrt(li);F.upperMesh.scale.set(Gi,li,Gi),F.upperMesh.position.y=-Hn/2,F.joint.position.y=-Hn,F.lowerMesh.scale.set(Gi,li,Gi),F.lowerMesh.position.y=-Hn/2,F.hand.position.y=-Hn,Le={active:!0,dist:Bi,gy:_e,pitch:ga.rootPitch,joint:F.joint.rotation.x,grip:Hi}}function hp(I,nt){if(!u.enabled){Ee=0,Be=0,B.wrist.rotation.set(0,0,0),Ye=B.root.rotation.x,$=v.rotation.y;return}const _t=B.root.rotation.x,xt=v.rotation.y;if(nt!==At){At=nt,Ye=_t,$=xt,B.wrist.rotation.set(Ee,0,Be);return}if(!Number.isFinite(Ye)||I<=1e-5){Ye=_t,$=xt,B.wrist.rotation.set(Ee,0,Be);return}const ie=(_t-Ye)/I,Jt=He(xt-$)/I;Ye=_t,$=xt;const ye=Math.max(0,u.maxAngle),Ae=Math.max(0,u.maxTwist),De=.15+.85*ve(zt,0,1),ze=-ve(wn,0,1.4)*Math.max(0,u.runDrag),$e=ve(-ie*u.lag*De+ze,-ye,ye),je=ve(Jt*u.twistLag*De,-Ae,Ae),rn=1-Math.exp(-Math.max(0,u.rate)*I);Ee+=($e-Ee)*rn,Be+=(je-Be)*rn,B.wrist.rotation.set(Ee,0,Be)}function dp(I){const nt=Math.PI/180;return I==="greatsword"?s.greatswordPitchDeg*nt:I==="staff"?s.staffPitchDeg*nt:I==="bow"?s.bowPitchDeg*nt:s.swordPitchDeg*nt}function mr(I){const nt=Math.PI/180;return I==="sword-shield"?s.shieldPitchDeg*nt:I==="greatsword"?s.greatswordPitchDeg*nt:I==="bow"?s.bowPitchDeg*nt:s.swordPitchDeg*nt}function up(I){const nt=Math.PI/180;return I==="sword-shield"||I==="dual-swords"?(s.swordCantDeg??0)*nt:I==="greatsword"?(s.greatswordCantDeg??0)*nt:0}function fp(I,nt){const _t=I.weapon;if(_t==="staff"||_t==="bow")return;const xt=qt==="R",ie=xt?B:F,Jt=xt?ot:ht,ye=xt?F:B,Ae=xt?ht:ot,De=_t==="greatsword"&&xt?Ht:0,tn=_t==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,ze=Math.PI/180,$e=-tn*ze,je=tn*ze,rn=(Si,Hi)=>{const Hn=Math.max(0,Math.PI/2-Math.abs(Hi));return Math.sign(Si)*Math.min(Math.abs(Si),Hn)},Fn=(tt??dp(_t))+De,Bn=nt+ie.root.rotation.x+ie.joint.rotation.x;Jt.rotation.set(Math.PI/2-Fn-Bn,0,rn(xt?$e:je,Fn));const ri=et??(_t==="sword-shield"?null:mr(_t)),Bi=nt+ye.root.rotation.x+ye.joint.rotation.x;_t==="sword-shield"?Ae.rotation.x=ri===null?mr(_t):mr(_t)-ri-Bi:Ae.rotation.set(Math.PI/2-(ri??0)-Bi,0,rn(xt?je:$e,ri??0));const ci=up(_t),li=Ct??0,bi=Yt??0,pa=Z??0,ma=Et??0;xt?(j.rotation.z=-ci+li,j.rotation.y=pa,q.rotation.z=ci+bi,q.rotation.y=ma):(q.rotation.z=ci+li,q.rotation.y=pa,j.rotation.z=-ci+bi,j.rotation.y=ma)}function lh(I){tt=I.bladePitch,et=I.bladePitchOff,Z=I.bladeTwist,Et=I.bladeTwistOff,Ct=I.bladeYaw,Yt=I.bladeYawOff,qt=I.lead,Ot=I.rootYaw+I.spinYaw,p.rotation.y=Ot,v.rotation.y+=I.yaw,v.rotation.x+=I.pitch,v.rotation.z+=I.roll,x.position.z+=I.pelvisZ,x.position.x+=I.pelvisX,I.armR&&(B.root.rotation.x=I.armR.pitch,B.root.rotation.y=I.armR.yaw,B.root.rotation.z=I.armR.roll,B.joint.rotation.x=I.armR.elbow),I.armL&&(F.root.rotation.x=I.armL.pitch,F.root.rotation.y=I.armL.yaw,F.root.rotation.z=I.armL.roll,F.joint.rotation.x=I.armL.elbow)}function hh(I,nt){const _t=R??Ws(I.attackProgress),xt=vS(I.weapon,I.comboIndex,_t,m,I.attackProgress);if(I.comboIndex!==jt){Qt=St,re=0,jt=I.comboIndex;const ye=I.timings.windup+I.timings.active+I.timings.recovery,Ae=Math.max(m.segBlendMin??.03,ye*.22);Te=bS(Qt,xt,m,xt.blend??null,Ae)}const ie=Math.max(.008,Te);re=Math.min(1,re+nt/ie);const Jt=Qt&&re<1?_S(Qt,xt,wu(re)):xt;return St=Jt,Jt}function pp(I,nt){const _t=b/2+E/2,xt=M-.04;if(!m.enabled){F.root.position.set(-_t,xt,0),B.root.position.set(_t,xt,0),W={lx:-_t,ly:xt,lz:0,rx:_t,ry:xt,rz:0};return}const ie=Math.max(0,m.shoulderLift),Jt=Math.max(0,m.shoulderPush),ye=I&&nt==="greatsword"?Math.max(0,m.shoulderIn):0,Ae=Bn=>ie*ve((-Bn-.5)/1.45,0,1),De=Bn=>Jt*ve((-Bn-.2)/1.9,0,1),tn=-_t+ye,ze=xt+Ae(F.root.rotation.x),$e=De(F.root.rotation.x),je=_t-ye,rn=xt+Ae(B.root.rotation.x),Fn=De(B.root.rotation.x);F.root.position.set(tn,ze,$e),B.root.position.set(je,rn,Fn),W={lx:tn,ly:ze,lz:$e,rx:je,ry:rn,rz:Fn}}function mp(I){if(I.phase==="idle"||I.charging)return;const nt=I.attackProgress,_t=Ws(nt),xt=Math.max(0,_t),ie=I.comboIndex%2===0?1:-1,Jt=l.stride,ye=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,Ae=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,De=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,tn=I.weapon==="greatsword"?ve(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;x.position.z+=ye*xt*tn,x.position.x+=ie*Ae*xt*tn,x.position.y-=De*Math.sin(Math.PI*nt)*tn}let dh=null;function gp(){dh={upperX:v.rotation.x,upperY:v.rotation.y,upperZ:v.rotation.z,upperPX:v.position.x,upperPZ:v.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:F.root.rotation.x,lry:F.root.rotation.y,lrz:F.root.rotation.z,lj:F.joint.rotation.x,rrx:B.root.rotation.x,rry:B.root.rotation.y,rrz:B.root.rotation.z,rj:B.joint.rotation.x,rootY:p.rotation.y}}function xp(I){const nt=dh;if(!nt)return;const _t=wu(ve(I,0,1));if(_t>=1)return;const xt=(ie,Jt)=>ie+(Jt-ie)*_t;v.rotation.x=xt(nt.upperX,v.rotation.x),v.rotation.y=xt(nt.upperY,v.rotation.y),v.rotation.z=xt(nt.upperZ,v.rotation.z),v.position.x=xt(nt.upperPX,v.position.x),v.position.z=xt(nt.upperPZ,v.position.z),x.position.x=xt(nt.pelvisX,x.position.x),x.position.y=xt(nt.pelvisY,x.position.y),x.position.z=xt(nt.pelvisZ,x.position.z),x.rotation.x=xt(nt.pelvisRX,x.rotation.x),x.rotation.z=xt(nt.pelvisRZ,x.rotation.z),F.root.rotation.x=xt(nt.lrx,F.root.rotation.x),F.root.rotation.y=xt(nt.lry,F.root.rotation.y),F.root.rotation.z=xt(nt.lrz,F.root.rotation.z),F.joint.rotation.x=xt(nt.lj,F.joint.rotation.x),B.root.rotation.x=xt(nt.rrx,B.root.rotation.x),B.root.rotation.y=xt(nt.rry,B.root.rotation.y),B.root.rotation.z=xt(nt.rrz,B.root.rotation.z),B.joint.rotation.x=xt(nt.rj,B.joint.rotation.x),p.rotation.y=nt.rootY+He(p.rotation.y-nt.rootY)*_t,Ot=p.rotation.y}function vp(I,nt){if(K.drawString.position.z=-.06,yt.position.z=0,mt.orb.scale.setScalar(1),v.rotation.y=0,I.charging&&I.weapon==="bow"){const Jt=I.charge;F.root.rotation.x=-1.25,F.joint.rotation.x=-.15,B.root.rotation.x=.35+Jt*.3,B.joint.rotation.x=-1.15,K.drawString.position.z=-.06-Jt*.22,yt.position.z=-Jt*.3,v.rotation.y=-.22;return}if(I.phase==="idle"&&kt<=.001){Qt=null,St=null,jt=0,re=1,Te=Math.max(.008,m.segBlend),tt=null,et=null,Z=null,Et=null,Ct=null,Yt=null,_e=NaN,I.weapon==="greatsword"&&(ot.position.x=-Math.max(0,s.twoHandInsetX??0));return}const _t=Ws(I.attackProgress),xt=Math.max(0,-_t),ie=Math.max(0,_t);if(I.weapon==="bow")F.root.rotation.x=-1.2,F.joint.rotation.x=-.15,B.root.rotation.x=.9-ie*.8,B.joint.rotation.x=-.3;else if(I.weapon==="greatsword")if(m.enabled)lh(hh(I,nt));else{const Jt=-1.6*xt+1.25*ie,ye=ve(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);B.root.rotation.x=Jt,B.joint.rotation.x=-(.25+xt*.4),F.root.rotation.x=Jt+.06,F.joint.rotation.x=-(.32+xt*.4),F.root.rotation.z=.42,B.root.rotation.z=0;const Ae=-Math.sin(B.root.rotation.x);B.root.rotation.y=-.72*Math.tanh(Ae*4),v.rotation.y=-.2*_t*ye}else if(m.enabled)lh(hh(I,nt));else{const Jt=I.comboIndex;if(Jt===1)B.root.rotation.x=-1.7*xt+1.1*ie,B.joint.rotation.x=-(.2+xt*.5),F.root.rotation.x=.1,v.rotation.y=-.18*_t;else if(Jt===2)F.root.rotation.x=-1.5*xt+1*ie,F.joint.rotation.x=-(.2+xt*.5),B.root.rotation.x=.2,v.rotation.y=.45*-_t;else{const ye=-1.9*xt+1.2*ie;F.root.rotation.x=ye,B.root.rotation.x=ye,F.joint.rotation.x=-(.15+xt*.4),B.joint.rotation.x=-(.15+xt*.4),v.rotation.y=-.3*_t}}if(I.weapon==="greatsword"){const Jt=ve((-B.root.rotation.x-1.3)/1.2,0,1);ot.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}mp(I)}function _p(I,nt){I&&(B.root.rotation.x=-1.05,B.joint.rotation.x=-.35,F.root.rotation.x=-.45,F.joint.rotation.x=-.2,v.rotation.y=-.12,mt.orb.scale.setScalar(1.25+.12*Math.sin(nt*2)))}function yp(I){if(!I||I.phase==="idle")return;const nt=I.progress,_t=nt<.3?-.35+nt/.3*1.35:nt<.7?1:Math.max(0,1-(nt-.7)/.3),xt=Math.PI/180;v.rotation.x+=g.leanDeg*xt*_t,F.root.rotation.x-=g.shieldPitchDeg*xt*_t,F.joint.rotation.x-=.22*_t,B.root.rotation.x-=.3*_t,x.position.z+=g.pelvisReach*Math.max(0,_t)}function gr(I){if(!I)return null;const nt=I.getObjectByName("bladeBase"),_t=I.getObjectByName("bladeTip");if(!nt||!_t)return null;I.updateWorldMatrix(!0,!1);const xt=nt.getWorldPosition(new V),ie=_t.getWorldPosition(new V),Jt=new V().setFromMatrixColumn(I.matrixWorld,0).normalize();return{base:{x:xt.x,y:xt.y,z:xt.z},tip:{x:ie.x,y:ie.y,z:ie.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:p,update(I,nt,_t,xt,ie=!1,Jt,ye,Ae){on(nt.weapon),p.rotation.y=0,Ot=0,v.rotation.x=0,v.rotation.z=0,x.position.x=0,x.position.y=S,x.position.z=0,x.rotation.z=0,x.rotation.x=0,v.position.x=0,v.position.y=0,v.position.z=0,_.position.x=0,_.position.y=0,_.position.z=0,_.rotation.z=0;const De=Math.max(1/240,Math.min(xt,.1)),tn=Jt===void 0?vt+=xt:Jt;st=tn;const ze=l.landing;ze.enabled?te&&!I.grounded?(me="jump",sn=tn,Pe=ze.anticipationDuration,hn=Math.max(0,ze.jumpAnticipation),Se=.32):!te&&I.grounded&&(me="land",sn=tn,Pe=ze.duration,hn=Y1(oe,ze),Se=ze.compressRatio,Qe=oe):(me="none",hn=0),tn<sn&&(me="none",hn=0),te=I.grounded,oe=I.velocity.y;const $e=gu(tn,sn,Pe,hn,Se),je=nt.phase!=="idle",rn=(Ae==null?void 0:Ae.phase)==="active";zt=V1(zt,je,De,l.attack.blendRate);const Fn=X1(zt,l.attack.gaitWeight,l.attack.lowerBodyWeight);se=Fn.attackLegWeight,ge=Fn.gaitScale;const Bn=Math.sin(I.bodyYaw),ri=Math.cos(I.bodyYaw),Bi=(I.velocity.x-Tt)/De,ci=(I.velocity.z-It)/De,li=ve(Bi,-60,60),bi=ve(ci,-60,60),pa=li*Bn+bi*ri,ma=He(I.bodyYaw-O)/De,Si=Math.hypot(I.velocity.x,I.velocity.z),Hi=o.maxForwardDeg*Math.PI/180,Hn=o.maxSideDeg*Math.PI/180,xr=ve(pa*o.accelGain,-Hi,Hi),ga=ve(-ma*Si*o.turnGain,-Hn,Hn),Gi=1-Math.exp(-o.smoothing*De);ce+=(xr-ce)*Gi,Wt+=(ga-Wt)*Gi,Tt=I.velocity.x,It=I.velocity.z,O=I.bodyYaw;const mn=Math.hypot(I.velocity.x,I.velocity.z),os=ve(a.knockGaitScale??0,0,1),rs=_t.knockX*os,Ys=_t.knockZ*os,vr=os>0&&Math.hypot(_t.knockX,_t.knockZ)>.001,xa=I.velocity.x+rs,wi=I.velocity.z+Ys,uh=Math.hypot(xa,wi);N=uh;const Mp=Math.cos(I.bodyYaw),bp=-Math.sin(I.bodyYaw),Sp=I.velocity.x*Mp+I.velocity.z*bp,fh=mn>mi?ve(Sp/mn,-1,1):0,ph=mn>mi?ve((I.velocity.x*Bn+I.velocity.z*ri)/mn,-1,1):1,wp=ah(ph,a.backStrafeStartDeg,a.backStrafeFullDeg);gt==="settled"&&Kt&&ae>de*1.02+1e-4&&(gt="none");let cs=1;gt==="blend"?(cs=qf(bt?wt:Q,a.stopYawBlendMode,bt),bt||(Q=Math.min(1,Q+De/Math.max(.01,a.stopYawAfterSec)),(Q>=1||a.stopYawBlendMode==="inStop"||Kt)&&(gt="settled",cs=0))):gt==="settled"&&(cs=ve(mn/Math.max(mi,a.stopEnterRatio*e),0,1)),ct=cs;const Ep=Xf(fh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Tp=Wf(ph,fh,Ep,wp)*cs;C+=(Tp-C)*(1-Math.exp(-i.hipYawSmoothing*De));const ls=I.bodyYaw+C;T=ls;const Ap=Math.sin(ls),Rp=Math.cos(ls),Pp=Math.cos(ls),Cp=-Math.sin(ls),$s={speed:uh,phase:I.gaitPhase,localForward:xa*Ap+wi*Rp,localRight:xa*Pp+wi*Cp,stride:I.stride};je&&!ft&&(rt=I.gaitPhase),ft=je;const va=zt>0?H1($s,nt.attackProgress,nt.comboIndex,zt,l.stride,rt):$s;ue=va;const mh=Math.max(0,a.stopBlendSec||0),gh=mh>0&&!je&&!vr&&I.grounded,_r=Yf(mn,Mt,e,a.stopEnterRatio,a.stopExitRatio);if(!gh||_r.resume)Y=-1;else if(Y<0&&_r.enter){Y=0,lt=I.gaitPhase,dt=Gf(I.gaitPhase),at=mn,Dt=Math.max(I.stride,mi),J=$s.localForward,pt=$s.localRight;const Me=1/Math.max(mi,mn);Ft=I.velocity.x*Me,it=I.velocity.z*Me}const Lp=Mt;Mt=mn;const Vi=gh&&Y>=0;Vi&&(Y=Math.min(1,Y+De/mh)),Vi&&gt!=="blend"&&(gt="blend",Q=0),bt=Vi&&Y<1,wt=Y,Kt=_r.resume,ae=mn,de=Lp;const xh=Vi?{phase:lt,speed:at,moveSpeed:e,localForward:J,localRight:pt,legLength:n.legLength,stride:Dt,grounded:!0}:{phase:va.phase,speed:va.speed,moveSpeed:e,localForward:va.localForward,localRight:va.localRight,legLength:n.legLength,stride:va.stride??0,grounded:I.grounded},Dp=Vi?Vf(xh,a,{progress:Y,phase0:lt,phaseEnd:dt}):sh(xh,a),we=W1(Dp,Fn.gaitScale);if(ne=0,rn&&Ae){const Me=N1(Ae.progress,Ae.dir,a),fe=Fn.gaitScale;we.legL.pitchX+=Me.legL.pitchX*fe,we.legL.rollZ+=Me.legL.rollZ*fe,we.legL.kneeX+=Me.legL.kneeX*fe,we.legR.pitchX+=Me.legR.pitchX*fe,we.legR.rollZ+=Me.legR.rollZ*fe,we.legR.kneeX+=Me.legR.kneeX*fe,we.pelvisY+=Me.pelvisY*fe,ne=Me.env}let yr=0,Mr=0,br=0,vh=0;if(Vi){const Me=Zf(I.bodyYaw,Ft,it),fe=jf(Y,lt,Me.forward,Me.right,a);fe.leadLeft?(we.legL.pitchX-=fe.leadPitch,we.legL.kneeX+=fe.leadKnee,we.legR.pitchX+=fe.trailPitch):(we.legR.pitchX-=fe.leadPitch,we.legR.kneeX+=fe.leadKnee,we.legL.pitchX+=fe.trailPitch),Mr=fe.bodyShift*fe.fwdN,yr=fe.bodyShift*fe.rightN,br=fe.bodyDip,vh=fe.chestPitch,Gt=fe.leadPitch,Vt=fe.bodyShift,Zt=fe.bodyDip}else Gt=0,Vt=0,Zt=0;Ne={lp:we.legL.pitchX,lr:we.legL.rollZ,rp:we.legR.pitchX,rr:we.legR.rollZ},I.grounded?(X.root.rotation.x=we.legL.pitchX,k.root.rotation.x=we.legR.pitchX,X.root.rotation.z=we.legL.rollZ,k.root.rotation.z=we.legR.rollZ,X.joint.rotation.x=we.legL.kneeX,k.joint.rotation.x=we.legR.kneeX,F.root.rotation.x=we.armL,B.root.rotation.x=we.armR,F.joint.rotation.x=-(.18+we.armL*.2),B.joint.rotation.x=-(.18+we.armR*.2),F.root.rotation.z=0,B.root.rotation.z=0,F.root.rotation.y=0,B.root.rotation.y=0,x.position.x=we.pelvisX,x.position.y=S+we.pelvisY,x.position.z=0,x.rotation.z=we.pelvisRoll):(X.root.rotation.x=-.55,k.root.rotation.x=-.25,X.joint.rotation.x=.75,k.joint.rotation.x=.55,F.root.rotation.x=-.9,B.root.rotation.x=-.7,F.joint.rotation.x=-.6,B.joint.rotation.x=-.6,X.root.rotation.z=0,k.root.rotation.z=0);const kp=ip(x,_),hs=rn?{...d,weight:0}:Vi&&d.enabled?{...d,weight:1}:d,_h=hs.enabled&&I.grounded&&hs.weight>0?ve(hs.weight,0,1)*(je?ve(hs.attackScale,0,1):1):0;x.position.x+=yr,x.position.z+=Mr,x.position.y-=br,_.position.y+=br,_h<=0&&(_.position.x-=yr,_.position.z-=Mr);const Sr=mn/Math.max(e,mi);wn=Sr;const Ip=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,Fp=1-Math.exp(-Math.max(0,Ip)*De);Pt+=(ve(Sr,0,1)-Pt)*Fp;const _a=tp({leanForward:ce,leanSide:Wt,speedRatio:Pt},o);x.rotation.x+=_a.pelvisPitch,x.rotation.z+=_a.pelvisRoll,x.position.x+=_a.pelvisX,x.position.z+=_a.pelvisZ,x.position.y-=_a.crouch,_.position.y+=_a.crouch*(1-ve(_h,0,1));const yh=nt.phase!=="idle"||nt.charging&&nt.weapon==="bow",wr=yh?1:0,zp=Math.max(.001,wr>kt?m.poseIn??.1:m.poseOut??.16);if(kt!==wr){const Me=De/zp;kt=ve(kt+(wr>kt?Me:-Me),0,1)}(kt>0||yh)&&gp(),vp(nt,De),kt>0&&kt<1&&xp(kt),_p(ie,I.gaitPhase),yp(ye);const Up=nt.weapon==="greatsword",Mh=Math.hypot(I.velocity.x,I.velocity.z),Np=Up&&nt.phase==="idle"&&Mh>.5?Math.min(1.15,Mh/Math.max(e,.001)*.9):0;Ht+=(Np-Ht)*(1-Math.exp(-6*De));const Op=v.rotation.x;nt.weapon==="bow"&&(K.g.rotation.x=-(F.root.rotation.x+F.joint.rotation.x),yt.rotation.x=-(B.root.rotation.x+B.joint.rotation.x));const Bp=v.rotation.y;Xs(_t,I.bodyYaw);const bh=_t.type==="none"?1:.4;if(v.rotation.x+=ce*bh+vh,v.rotation.z+=(Wt+we.sideLean)*bh,$e>0&&(X.root.rotation.x-=ze.hipPitch*$e,k.root.rotation.x-=ze.hipPitch*$e,X.joint.rotation.x+=ze.kneeBend*$e,k.joint.rotation.x+=ze.kneeBend*$e,x.position.y-=ze.crouchDepth*$e,_.position.y+=ze.crouchDepth*(1-ze.lowerScale)*$e,v.rotation.x+=ze.upperPitch*$e,F.root.rotation.x-=ze.armTuck*$e,B.root.rotation.x-=ze.armTuck*$e),se>0&&I.grounded){const Me=G1(nt.attackProgress,nt.comboIndex,l.stride),fe=se;X.root.rotation.x+=Me.legL.pitchX*fe,k.root.rotation.x+=Me.legR.pitchX*fe,X.root.rotation.z+=Me.legL.rollZ*fe,k.root.rotation.z+=Me.legR.rollZ*fe,X.joint.rotation.x+=Me.legL.kneeX*fe,k.joint.rotation.x+=Me.legR.kneeX*fe,x.position.x+=Me.pelvisX*fe,x.position.y+=Me.pelvisY*fe,x.rotation.z+=Me.pelvisRoll*fe}if(pp(je,nt.weapon),y.enabled){const Me=nt.phase!=="idle"&&!nt.charging,fe=Me?Ws(nt.attackProgress):0;Me&&pn>.55&&fe<pn-1e-4&&(Fe=1),pn=fe,Fe=pS(Fe,De,y.impactDecay);const Gp=uS({swing:fe,charge:nt.charging?nt.charge:0,impact:Fe,speedRatio:Sr,grounded:I.grounded},y);xe=fS(xe,Gp,De,y.smoothing)}else xe={...El};cp(xe),_.rotation.y=C,H=$f(C,a.chestYawScale,a.chestYawMaxDeg),v.rotation.y+=H;const Hp=Bp;if(U.rotation.y=He(I.headYaw-I.bodyYaw-Hp-H),U.rotation.x=-ve(I.headPitch??0,-.7,.7),v.rotation.x+=-ve(I.bodyPitch??0,-.4,.4),hp(xt,nt.comboIndex),fp(nt,Op),nt.weapon==="greatsword"&&!nt.charging&&(nt.phase!=="idle"||kt>0)){p.updateWorldMatrix(!0,!0);const Me=nt.phase==="idle"?Math.max(kt,zt):1;lp(ve(Me,0,1),De)}Rt=ap({root:p,pelvis:x,lower:_,limbs:ut,base:kp,cfg:hs,grounded:I.grounded,attacking:je})},lean(){return{forward:ce,side:Wt}},landing(){const I=gu(st,sn,Pe,hn,Se),nt=Pe>0?Math.max(0,Pe-Math.max(0,st-sn)):0;return{pulse:I,remaining:nt,kind:I>0?me:"none",impactVy:Qe}},hurt(){return Nt},ik(){return Rt},stretch(){return{...xe,impact:Fe}},gripDebug(){return{...Le}},weaponDebug(){return{wristPitch:Ee,wristTwist:Be}},setClipT(I){R=I===null||!Number.isFinite(I)?null:Math.max(0,Math.min(1,I))},swingDebug(){const I=St;return{seg:jt,kind:(I==null?void 0:I.kind)??"right-left",lead:(I==null?void 0:I.lead)??"R",yaw:(I==null?void 0:I.yaw)??0,rootYaw:(I==null?void 0:I.rootYaw)??0,spinYaw:(I==null?void 0:I.spinYaw)??0,rootTurn:Ot,pitch:(I==null?void 0:I.pitch)??0,roll:(I==null?void 0:I.roll)??0,strike:(I==null?void 0:I.strike)??0,bladeTwist:(I==null?void 0:I.bladeTwist)??0,bladeTwistOff:(I==null?void 0:I.bladeTwistOff)??0,bladeYaw:(I==null?void 0:I.bladeYaw)??0,bladeYawOff:(I==null?void 0:I.bladeYawOff)??0,shoulderL:{x:W.lx,y:W.ly,z:W.lz},shoulderR:{x:W.rx,y:W.ry,z:W.rz}}},attackBlend(){return zt},attackWeights(){return{gaitScale:ge,attackLegWeight:se,driveSpeed:ue.speed,stridePhase:ue.phase}},hipYaw(){return C},gaitDebug(){return{stopT:Y,hipYaw:C,chestYaw:H,speed:Mt,gaitSpeed:N,stopStep:Gt,stopShift:Vt,stopDip:Zt,stopYawFade:ct,turnStep:ne,legLPitch:Ne.lp,legLRoll:Ne.lr,legRPitch:Ne.rp,legRRoll:Ne.rr}},gaitYaw(){return T},arrowDirection(){yt.updateWorldMatrix(!0,!1);const I=yt.matrixWorld.elements,nt=I[8],_t=I[9],xt=I[10],ie=Math.hypot(nt,_t,xt)||1;return{x:nt/ie,y:_t/ie,z:xt/ie}},weaponBlade(){return $t?gr(Lt[$t].right):null},bladesWorld(){return $t?{right:gr(Lt[$t].right),left:gr(Lt[$t].left)}:{right:null,left:null}},dispose(){p.traverse(I=>{if(I instanceof pe){I.geometry.dispose();const nt=I.material;Array.isArray(nt)?nt.forEach(_t=>_t.dispose()):nt.dispose()}})}}}function PS(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new Je,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new fn(i,3),o=new fn(a,3);s.setUsage(id),o.setUsage(id),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const _=x*2,v=_+1,A=_+2,S=_+3;r.push(_,v,A,v,S,A)}e.setIndex(r),e.setDrawRange(0,0);const l=new en({vertexColors:!0,transparent:!0,opacity:1,blending:Li,depthWrite:!1,side:Ve}),c=new pe(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ee(n.color);let f=[],d=null,u=0,g=0,y=!1,m=!1;function p(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const _=Math.max(.001,n.life);for(let v=0;v<x;v++){const A=f[v],S=Math.max(0,1-A.age/_),w=S*S,E=Math.min(1,A.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*w*(.55+.45*E),b=.18+.82*S,P=v*6;i[P]=A.tx+(A.bx-A.tx)*b,i[P+1]=A.ty+(A.by-A.ty)*b,i[P+2]=A.tz+(A.bz-A.tz)*b,i[P+3]=A.tx,i[P+4]=A.ty,i[P+5]=A.tz;const U=h.r*M,z=h.g*M,G=h.b*M,L=U*.22,D=z*.22,X=G*.22;a[P]=L,a[P+1]=D,a[P+2]=X;const k=1+n.tipBoost;a[P+3]=Math.min(1,U*k),a[P+4]=Math.min(1,z*k),a[P+5]=Math.min(1,G*k)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,_,v){if(!n.enabled){c.visible=!1;return}const A=Math.max(0,x);for(const S of f)S.age+=A;for(;f.length>0&&f[0].age>n.life;)f.shift();if(_){const S=d?Math.hypot(_.tip.x-d.x,_.tip.y-d.y,_.tip.z-d.z)/Math.max(1e-4,A):0,w=f[f.length-1],E=w?Math.hypot(_.tip.x-w.tx,_.tip.y-w.ty,_.tip.z-w.tz):1/0;if(v&&E>=n.minStep)for(f.push({bx:_.base.x,by:_.base.y,bz:_.base.z,tx:_.tip.x,ty:_.tip.y,tz:_.tip.z,age:0,speed:S});f.length>t;)f.shift();d={x:_.tip.x,y:_.tip.y,z:_.tip.z},u=S,g=E,y=!0}else d=null,y=!1,u=0,g=0;m=v,p()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:g,hasBlade:y,active:m}},reset(){f=[],d=null,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function CS(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function LS(n,t,e,i){var Ye;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new $b({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Ju,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new Zb;r.background=new ee("#12161d"),r.add(new P1(11061486,2764600,1.15));const l=new D1(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Ie;for(const $ of t.boxes){const At=$.maxX-$.minX,St=$.maxY-$.minY,Qt=$.maxZ-$.minZ;let jt=CS($.kind,e);$.kind==="step"&&(jt=new ee(jt).offsetHSL(0,0,$.maxY*.09).getStyle());const re=new Bs({color:jt,transparent:!0,opacity:1}),Te=new pe(new jn(At,St,Qt),re);Te.position.set(($.minX+$.maxX)/2,($.minY+$.maxY)/2,($.minZ+$.maxZ)/2),Te.castShadow=$.kind!=="ground",Te.receiveShadow=!0,Te.add(new Cf(new h1(Te.geometry),new jl({color:10467020,transparent:!0,opacity:.32}))),f.add(Te),h.push(re)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new I1(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const g=J1(i,e);r.add(g.group);const y=$=>RS(($==null?void 0:$.voxel)??e.voxel,$!=null&&$.colors?{...e.colors,...$.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist);let m="standard",p=y((Ye=e.bodyTypes)==null?void 0:Ye[m]);const x=PS(e.weaponTrail);r.add(x.object);const _=new Ie,v=.9,A=new Ie;A.position.y=v,p.group.position.y=-v,A.add(p.group),_.add(A),r.add(_);const S=t.dummies.map(($,At)=>{const St=e.dummies.colors,Qt=St[At%St.length]??"#cccccc",jt=K1(e.voxel,e.colors,Qt,$.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return jt.group.traverse(re=>{re.userData.dummyId=$.id}),r.add(jt.group),jt}),w=S.map($=>$.group),E=new k1,M=e.groundRing,b=e.voxel.bodyWidth,P=vu(b,M.playerRadiusFactor),U=vu(b,M.dummyRadiusFactor),z=b*M.thicknessFactor,G=M.arcDeg*Math.PI/180;let L=0;const D=vc({radius:P,thickness:z,arcRad:G,edgeFade:M.edgeFade,color:M.playerColor,opacity:M.playerOpacity,y:.028,renderOrder:6});D.mesh.name="player-ground-ring",r.add(D.mesh);const X=t.dummies.map($=>{const At=vc({radius:U,thickness:z,arcRad:G,edgeFade:M.edgeFade,color:M.neutralColor,opacity:M.opacity,y:.022,renderOrder:5});return At.mesh.name=`dummy-ground-ring-${$.id}`,r.add(At.mesh),At}),k=t.dummies.map($=>{const At=vc({radius:U*M.haloRadiusFactor,thickness:z*M.haloThicknessFactor,arcRad:G,edgeFade:M.edgeFade,color:M.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return At.mesh.name=`dummy-ground-halo-${$.id}`,r.add(At.mesh),At}),F=t.dummies.map(()=>0),B=t.dummies.map(()=>0),ut=_u({radius:P*M.meterRadiusFactor,thickness:z*M.meterThicknessFactor,arcRad:G,edgeFade:.06,color:M.meterColorCharge,y:.03,renderOrder:8});ut.mesh.name="player-ground-meter",r.add(ut.mesh);const ot=t.dummies.map($=>{const At=_u({radius:U*M.warnRadiusFactor,thickness:z*M.warnThicknessFactor,arcRad:G,edgeFade:.02,color:M.warnColor,y:.031,renderOrder:9});return At.mesh.name=`dummy-ground-warn-${$.id}`,r.add(At.mesh),At}),ht=yu({color:M.playerColor,y:.042,renderOrder:3});ht.group.name="player-landing-preview",r.add(ht.group);const j=new ee,q=new ee(M.playerColor),mt=new ee(M.neutralColor),K=new ee(M.lowThreatColor),yt=new ee(M.highThreatColor),Lt=new ee(M.meterColorCharge),Ut=new ee(M.meterColorChannel),$t=new ee(M.meterColorCooldown),Tt=new ee(M.warnColor),It=new Ie;r.add(It);const O=e.projectiles;function ce(){const At=document.createElement("canvas");At.width=64,At.height=64;const St=At.getContext("2d");if(St){const jt=St.createRadialGradient(32,32,0,32,32,32);jt.addColorStop(0,"rgba(255,255,255,1)"),jt.addColorStop(.28,"rgba(255,255,255,0.72)"),jt.addColorStop(.62,"rgba(255,255,255,0.22)"),jt.addColorStop(1,"rgba(255,255,255,0)"),St.fillStyle=jt,St.fillRect(0,0,64,64)}const Qt=new Ml(At);return Qt.colorSpace=yn,Qt}function Wt(){const St=document.createElement("canvas");St.width=2,St.height=64;const Qt=St.getContext("2d");if(Qt){const re=Qt.createLinearGradient(0,0,0,64);re.addColorStop(0,"rgba(255,255,255,0)"),re.addColorStop(.55,"rgba(255,255,255,0.35)"),re.addColorStop(1,"rgba(255,255,255,0.95)"),Qt.fillStyle=re,Qt.fillRect(0,0,2,64)}const jt=new Ml(St);return jt.colorSpace=yn,jt}const Ht=ce(),Nt=Wt(),Rt=new en({color:12577023,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),Pt=new en({color:14217983,transparent:!0,opacity:0,side:Ve,depthWrite:!1,blending:Li}),C=new Ie;C.position.set(0,.95,.72),It.add(C);const T=new Ie;T.rotation.x=lS(e.camera.pitchDeg),C.add(T);const Y=new pr(.78,O.slashThickness,6,28,Math.PI*1.15),lt=new Ie,dt=new pe(Y,Rt),at=new pe(Y,Pt);at.scale.setScalar(1.09),at.renderOrder=4,lt.add(dt,at),T.add(lt);const Dt=new jn(O.arrowWidth,O.arrowWidth,O.arrowLength),J=new th(O.arrowHeadSize*.42,O.arrowHeadSize,4);J.rotateX(Math.PI/2);const pt=new jn(O.arrowWidth*2.6,O.arrowWidth*.4,.1),Ft=new Fs(O.arrowWidth*.45,O.arrowWidth*1.3,O.trailLength,6,1,!0);Ft.rotateX(-Math.PI/2),Ft.translate(0,0,-O.trailLength/2);const it=Array.from({length:10},()=>{const $=new Ie,At=new en({color:O.arrowColor,transparent:!0}),St=new en({color:O.arrowHeadColor,transparent:!0}),Qt=new yl({map:Ht,color:O.arrowColor,transparent:!0,opacity:.85,blending:Li,depthWrite:!1}),jt=new en({color:O.arrowTrailColor,map:Nt,transparent:!0,opacity:0,blending:Li,depthWrite:!1,side:Ve}),re=new pe(Dt,At),Te=new pe(J,St);Te.position.z=O.arrowLength/2+O.arrowHeadSize*.42;const R=new pe(pt,St),W=new pe(pt,St);R.position.z=-O.arrowLength/2+.08,W.position.z=R.position.z,W.rotation.z=Math.PI/2;const tt=new tu(Qt);tt.scale.setScalar(O.arrowGlowSize),tt.renderOrder=6;const et=new pe(Ft,jt);return et.renderOrder=5,$.add(re,Te,R,W,tt,et),$.visible=!1,r.add($),{group:$,shaftMat:At,tipMat:St,glowMat:Qt,trailMat:jt,glow:tt,trail:et,arrowId:0,bone:null}}),Mt=new nh(1,0),H=new V(O.boltShapeX,O.boltShapeY,O.boltShapeZ),rt=new en({color:O.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),ft=new yl({map:Ht,color:O.boltGlowColor,transparent:!0,opacity:.45,blending:Li,depthWrite:!1}),Gt=new en({color:O.boltGlowColor,map:Nt,transparent:!0,opacity:O.trailOpacity,blending:Li,depthWrite:!1,side:Ve}),Vt=new Fs(.5,.03,O.boltTrailScale,6,1,!0);Vt.rotateX(-Math.PI/2),Vt.translate(0,0,-O.boltTrailScale/2);const Zt=Array.from({length:24},()=>{const $=new Ie,At=new pe(Mt,rt);At.scale.copy(H);const St=new tu(ft);St.scale.setScalar(O.boltGlowScale),St.renderOrder=6;const Qt=new pe(Vt,Gt);return Qt.renderOrder=5,$.add(At,St,Qt),$.visible=!1,r.add($),{group:$,core:At}}),N=Array.from({length:6},()=>{const $=yu({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return $.group.visible=!1,r.add($.group),$}),gt=e.dash,Q=new Os(gt.ringRadius-.06,gt.ringRadius,28),ct=Array.from({length:6},()=>{const $=new en({color:16777215,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),At=new pe(Q,$);return At.rotation.x=-Math.PI/2,At.visible=!1,r.add(At),{mesh:At,mat:$,life:0,base:1}});function bt($,At,St,Qt,jt){const re=ct.find(Te=>Te.life<=0)??ct[0];re.mat.color.set(Qt),re.mesh.position.set($,St+.04,At),re.base=jt,re.mesh.scale.setScalar(jt*.6),re.mesh.visible=!0,re.mat.opacity=.9,re.life=gt.fxDuration}const wt=e.links,Kt=new Os(wt.ringRadius-.07,wt.ringRadius,28),ae=Array.from({length:5},()=>{const $=new en({color:wt.chargeColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),At=new pe(Kt,$);return At.rotation.x=-Math.PI/2,At.visible=!1,r.add(At),{mesh:At,mat:$,life:0,base:1}});function de($,At,St,Qt){const jt=ae.find(re=>re.life<=0)??ae[0];jt.mesh.position.set($,St+.05,At),jt.base=Qt,jt.mesh.scale.setScalar(Qt*.55),jt.mesh.visible=!0,jt.mat.opacity=.85,jt.life=wt.fxDuration}let ne=t.playerLink.id,xe=t.playerLink.hitIds.length,Fe=t.dash.id,pn="none";const Le=z1(e.camera,e.smartCamera,e.zoom,a/s),_e=t.character.position;Le.update(_e.x,_e.y,_e.z,1,t.camera);function Ee($,At){if(w.length===0)return 0;const St=o.domElement.getBoundingClientRect(),Qt=new Xt(($-St.left)/St.width*2-1,-((At-St.top)/St.height)*2+1);E.setFromCamera(Qt,Le.camera);const jt=E.intersectObjects(w,!0);for(const re of jt){const Te=re.object.userData.dummyId;if(Te&&Te>0)return Te}return 0}function Be($,At,St){const Qt=o.domElement.getBoundingClientRect(),jt=new V($,At,St).project(Le.camera);return{x:Qt.left+(jt.x*.5+.5)*Qt.width,y:Qt.top+(-jt.y*.5+.5)*Qt.height}}let wn=!1;return{gaitDebug(){return p.gaitDebug()},trailDebug(){return x.debug()},stretchDebug(){const $=p.stretch();return{arm:$.arm,leg:$.leg,torso:$.torso,impact:$.impact}},swingDebug(){return p.swingDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},projectPoint($,At,St){return Be($,At,St)},setClipT($){p.setClipT($)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render($,At){const St=$.character,Qt=$.combat,jt=e.hitstop.enabled&&$.combat.hitstop>0,re=jt;jt&&!wn&&Le.addShake($.combat.weapon==="greatsword"?.85:.5),wn=jt;for(let vt=0;vt<$.events.length;vt++){const st=$.events[vt];if(st.type!=="notify")continue;const te=Number.isFinite(st.value)?st.value:0;st.name==="blade-air"?Le.addShake((.06+.16*Math.max(0,Math.min(1,te)))*(Qt.weapon==="greatsword"?1.5:1)):st.name==="foot-step"&&Le.addShake(.03*Math.max(0,Math.min(1,te)))}_.position.set(St.position.x,St.position.y,St.position.z),_.rotation.y=St.bodyYaw;const Te=$.dash.phase==="active"&&$.dash.kind==="roll",R=Te&&$.dash.duration>0?Math.min(1,1-$.dash.timer/$.dash.duration):0;if(A.rotation.x=Te?R*Math.PI*2:0,A.position.y=v-(Te?.2*Math.sin(Math.PI*R):0),re||p.update(St,Qt,$.playerHurt,At,$.abilities.channeling,$.time,$.playerLink,$.turnInPlace),x.update(re?0:At,re?null:p.weaponBlade(),!re&&(Qt.phase==="active"||$.playerLink.phase==="active"||Te&&$.dash.duration>0)),!re)for(let vt=0;vt<S.length;vt++)$.dummies[vt]&&S[vt].update($.dummies[vt],At);const W=Le.camera.position,tt=Math.atan2(W.x-St.position.x,W.z-St.position.z),et=$.config.gaze.hurtHoldSec,Z=$.time-$.playerHurt.lastAt,Et=et>0&&Z>=0&&Z<et?1-Z/et:0,Ct=eS($.gaze.active,$.gaze.threat,Et,$.time,M);nS(j,q,K,yt,Ct.level),L=cS(St.grounded,St.position.y,L),D.mesh.position.set(St.position.x,L+.028,St.position.z),D.update(Ct.arcRad,Ct.opacity,Ct.scale,j,tt);const Yt=$.config.abilities.arcane,qt=Math.max(1,Math.floor(Yt.waves)),Ot=Math.max(1e-4,Yt.waveInterval),zt=sS({charging:Qt.charging,charge:Qt.charge,channeling:$.abilities.channeling,fireTimer:$.abilities.fireTimer,fireInterval:Ot,channelProgress:$.abilities.channeling?($.abilities.waveIndex+(1-Math.min(1,Math.max(0,$.abilities.fireTimer/Ot))))/qt:0,arcaneCooldown:$.abilities.cooldown,arcaneCooldownMax:Yt.cooldown,dashCooldown:$.dash.cooldown,dashCooldownMax:$.dash.kind==="blink"?$.config.dash.blinkCooldown:$.config.dash.rollCooldown});ut.mesh.position.set(St.position.x,St.position.y+.03,St.position.z),ut.set(zt.ratio,zt.source==="none"?0:M.meterOpacity,zt.source==="charge"?Lt:zt.source==="channel"?Ut:$t,tt);const kt=$.playerLink,se=kt.weapon?$.config.links.moves[kt.weapon]:void 0,ge=oS(kt.phase,St.position.x,St.position.z,kt.facing,kt.travel,(se==null?void 0:se.hit.radius)??.9);ht.set(ge.x,ge.z,.042,ge.radius,ge.active?M.landingOpacity:0,$.time);for(let vt=0;vt<X.length;vt++){const st=$.dummies[vt],te=X[vt],oe=k[vt],me=ot[vt];if(!st){te.mesh.visible=!1,oe.mesh.visible=!1,me.mesh.visible=!1;continue}const sn=$.targeting.hasTarget&&$.targeting.targetId===st.id;if(u0($,st)){const In=f0($,st);j.copy(K).lerp(yt,In)}else j.copy(mt);const Pe=aS(st.attackPhase,st.attackPhaseTimer,$.config.dummies.attackWindup);Pe.active?(j.lerp(Tt,.5*Pe.urgency),me.mesh.position.set(st.position.x,st.position.y+.031,st.position.z),me.set(Pe.ratio,M.warnOpacity*(.65+.35*Pe.urgency),Tt,tt)):me.set(0,0,Tt,tt);const hn=sn?1:0,Se=hn>F[vt]?M.haloFadeInSec:M.haloFadeOutSec;F[vt]=Mu(F[vt],hn,At,Se);const Qe=F[vt],Kn=1+.02*Qe*Math.sin($.time*2.2+st.id),on=M.arcDeg+(M.selectedArcDeg-M.arcDeg)*Qe;te.mesh.position.set(st.position.x,st.position.y+.022,st.position.z),te.update(on*Math.PI/180,M.opacity+(M.selectedOpacity-M.opacity)*Qe,1+(M.selectedScale-1)*Qe*Kn,j,tt,1+(M.selectedThicknessScale-1)*Qe),B[vt]=Mu(B[vt],hn,At,hn>B[vt]?M.haloFadeInSec:M.haloFadeOutSec);const En=B[vt];oe.mesh.position.set(st.position.x,st.position.y+.019,st.position.z),oe.update(on*Math.PI/180,M.haloOpacity*En*(.88+.12*Math.sin($.time*2.2+st.id)),M.selectedScale*(.94+.06*En)*Kn,j,tt)}if(It.position.set(St.position.x,St.position.y,St.position.z),It.rotation.y=Qt.phase!=="idle"?Qt.attackFacing:St.bodyYaw,$.dash.id!==Fe){Fe=$.dash.id;const vt=$.dash;pn=vt.kind,vt.kind==="blink"?(bt(vt.fromX,vt.fromZ,St.position.y,gt.blinkColor,.9),bt(vt.toX,vt.toZ,St.position.y,gt.blinkColor,1.35)):bt(vt.fromX,vt.fromZ,St.position.y,gt.rollColor,1.1)}for(const vt of ct){if(vt.life<=0)continue;vt.life-=At;const st=Math.max(0,vt.life/gt.fxDuration);vt.mat.opacity=.9*st,vt.mesh.scale.setScalar(vt.base*(.6+(1-st)*1.2)),vt.life<=0&&(vt.mesh.visible=!1)}const ue=$.playerLink;ue.id!==ne&&(ne=ue.id,xe=ue.hitIds.length,de(St.position.x,St.position.z,St.position.y,1)),ue.hitIds.length>xe?(xe=ue.hitIds.length,de(St.position.x,St.position.z,St.position.y,1.35)):ue.hitIds.length<xe&&(xe=ue.hitIds.length);for(const vt of ae){if(vt.life<=0)continue;vt.life-=At;const st=Math.max(0,vt.life/Math.max(wt.fxDuration,1e-6));vt.mat.opacity=.85*st,vt.mesh.scale.setScalar(vt.base*(.55+(1-st)*1.1)),vt.life<=0&&(vt.mesh.visible=!1)}const Ne=O.slashEnabled&&Qt.phase==="active"&&Qt.comboIndex>=3;Rt.opacity=Ne?.7:0,Pt.opacity=Ne?O.slashGlowOpacity:0,Ne&&(lt.rotation.z=-1.2+Qt.attackProgress*3.2,lt.scale.setScalar(.9+Qt.comboIndex*.13));for(let vt=0;vt<Zt.length;vt++){const st=$.abilities.projectiles[vt],te=Zt[vt];te.group.visible=!!st,st&&(te.group.position.set(st.x,st.y,st.z),te.group.scale.setScalar(st.radius),te.group.rotation.set(0,Math.atan2(st.dirX,st.dirZ),0))}for(let vt=0;vt<N.length;vt++){const st=$.abilities.rings[vt],te=N[vt];if(!st){te.group.visible=!1;continue}const oe=Math.max(0,Math.min(1,st.life/Math.max(st.duration,1e-6))),me=rS(Math.max(0,st.duration-st.life),M.areaExpandSec);te.set(st.x,st.z,.045,st.radius*me.scale,M.areaOpacity*(.35+.65*oe)*me.alpha,$.time)}for(let vt=0;vt<it.length;vt++){const st=$.arrows[vt],te=it[vt];if(!st){te.group.visible=!1,te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=0;continue}const oe=st.stuck&&st.stuckDummy>=0;if(te.arrowId!==st.id){if(te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=st.id,te.group.position.set(st.x,st.y,st.z),te.group.rotation.set(st.pitch,st.yaw,0,"YXZ"),oe){const sn=S[st.stuckDummy],Pe=sn?sn.boneAtWorld(st.x,st.y,st.z):null;Pe&&(Pe.node.attach(te.group),te.bone=Pe.node)}}else te.bone||(te.group.position.set(st.x,st.y,st.z),te.group.rotation.set(st.pitch,st.yaw,0,"YXZ"));te.group.visible=!0;const me=st.stuck?Math.min(1,st.rest/.6):1;te.shaftMat.opacity=me,te.tipMat.opacity=me,te.glowMat.opacity=(st.stuck?.28:.85)*me,te.trailMat.opacity=st.stuck?0:O.trailOpacity*me,te.trail.visible=!st.stuck}Le.update(St.position.x,St.position.y,St.position.z,At,$.camera),o.render(r,Le.camera)},resize(){const $=Math.max(1,n.clientWidth),At=Math.max(1,n.clientHeight);o.setSize($,At,!1),Le.resize($/At)},getGroundBasis(){return Le.getGroundBasis()},setCollidersVisible($){for(const At of h)At.opacity=$?.3:1,At.wireframe=$,At.needsUpdate=!0},setGridVisible($){u.visible=$},setLabVisible($){g.setVisible($)},setLabLabelsVisible($){g.setLabelsVisible($)},snapCamera($,At,St){Le.snap($,At,St)},setZoom($){Le.setZoom($)},setBodyType($){var St;const At=(St=e.bodyTypes)==null?void 0:St[$];return!At||$===m||(A.remove(p.group),p.dispose(),p=y(At),p.group.position.y=-v,A.add(p.group),m=$,t.config.characterHeight=At.height,At.radius!==void 0&&(t.config.characterRadius=At.radius)),m},bodyTypes(){return{id:m,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Ee,projectToScreen:Be,diagnostics(){const $=rp(e.camera.pitchDeg),At=hS($,It.rotation.y);return{lean:p.lean(),slashNormal:At,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:A.rotation.x,activeRings:ct.filter(St=>St.life>0).length,lastKind:pn},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Le.smart(),shake:Le.shakeLevel()}}},dispose(){p.dispose(),g.dispose();for(const $ of S)$.dispose();D.dispose();for(const $ of X)$.dispose();for(const $ of k)$.dispose();ut.dispose(),x.dispose();for(const $ of ot)$.dispose();ht.dispose(),Y.dispose(),Rt.dispose(),Pt.dispose(),Mt.dispose(),rt.dispose(),ft.dispose(),Gt.dispose(),Vt.dispose();for(const $ of N)$.dispose();Dt.dispose(),J.dispose(),pt.dispose(),Ft.dispose();for(const $ of it)$.shaftMat.dispose(),$.tipMat.dispose(),$.glowMat.dispose(),$.trailMat.dispose();Ht.dispose(),Nt.dispose();for(const $ of ct)$.mat.dispose();Q.dispose();for(const $ of ae)$.mat.dispose();Kt.dispose(),f.traverse($=>{$ instanceof pe&&$.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function DS(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function kS(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function IS(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=x=>e.querySelector(`#${x}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,g=0;function y(){const x=n.status();a.textContent=x.enabled?`已记录 ${x.durationS.toFixed(1)}s · ${x.frames} 帧 · 事件 ${x.events} · 异常 ${x.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=x.enabled?"暂停记录":"继续记录"}function m(x){d=x,e.hidden=!x,x?y():s.hidden=!0}function p(x){o.textContent=x,window.clearTimeout(g),g=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),m(!d)}),h.addEventListener("click",()=>m(!1)),f.addEventListener("click",()=>m(!1)),o.addEventListener("click",()=>{const x=n.summary();DS(x).then(_=>{_?(p("已复制 ✓"),s.hidden=!0):(s.value=x,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const x=n.dump(),_=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);kS(`harness-${x.meta.version}-${_}.json`,JSON.stringify(x)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,y(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),y()}),{tick(){const x=n.status();t==null||t.classList.toggle("is-alert",x.alert),d&&y()},isOpen:()=>d,close:()=>m(!1)}}const FS={intents:{...Eu},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function zS(){const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=m0(J0,Ks),i=LS(n,e,dn,Ks.stations),a=M0(e),s=Lg(t),o=Dg(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.51 · 11-08 11:27 · 诊断");const l=k=>String(k).padStart(2,"0"),c=new Date,h=$0({meta:{version:"v0.9.51",buildTime:"11-08 11:27",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=IS(h,r),d=Rg({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid,showLab:dn.lab.enabled,showLabLabels:dn.lab.showLabels};let g=1,y=!1;const m=z0({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let x=e.combat.weapon;function _(k){if(k===x)return;x=k;const F=la.indexOf(k)+1;for(const B of p)B.classList.toggle("is-active",Number(B.dataset.weapon)===F);w.refreshWeapon()}let v=FS,A=0;const S=()=>{g=1,i.setZoom(1)},w=dg(e,dn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{g=1,a.singleStep({...Eu,resetPressed:!0})},resetZoom:S,onToggleColliders:k=>i.setCollidersVisible(k),onToggleGrid:k=>i.setGridVisible(k),onToggleLab:k=>i.setLabVisible(k),onToggleLabLabels:k=>i.setLabLabelsVisible(k)}),E=pg({stations:Ks.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:w.gui}),window.addEventListener("resize",()=>i.resize());const M=i.bodyTypes().ids;let b=0;const P=document.createElement("div");P.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(P);let U=0;const z=k=>{P.textContent=k,P.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{P.style.opacity="0"},1600)};window.addEventListener("keydown",k=>{var ut;if(k.repeat||k.code!=="KeyB"||M.length<2)return;b=(b+1)%M.length;const F=i.setBodyType(M[b]),B=(ut=dn.bodyTypes)==null?void 0:ut[F];z(`体型：${(B==null?void 0:B.name)??F}（B 切换）`)}),window.__harness={world:e,view:i,clock:a,input:m,viewConfig:dn,debug:u,getUserZoom:()=>g,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(k,F,B)=>i.projectPoint(k,F,B),setBodyType:k=>i.setBodyType(k),bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var k;return Object.keys(((k=dn.animation.swing)==null?void 0:k.clips)??{})},preview:k=>{const F=e.combat,B={...F};F.weapon=k.weapon,F.phase="active",F.comboIndex=Math.max(1,Math.min(3,Math.floor(k.comboIndex))),F.attackProgress=Math.max(0,Math.min(1,k.progress)),F.attackFacing=e.character.bodyYaw,i.setClipT(typeof k.t=="number"?k.t:null);const ut=Math.max(1,Math.min(30,Math.floor(k.warm??12)));y=!0;for(let ot=0;ot<ut;ot++)i.render(e,1/60);return i.setClipT(null),Object.assign(F,B),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:k=>{e.character.bodyYaw=k},zoom:k=>{g=Hh(k,1,dn.zoom.min,dn.zoom.max),i.setZoom(g)},release:()=>{y=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:Ks.stations??[],goto:k=>E.goto(k),current:()=>E.current(),recall:()=>E.recall()}};let G=performance.now(),L=60,D=0;function X(k){const F=Math.min((k-G)/1e3,.1);G=k,F>0&&(L=L*.9+1/F*.1);const B=m.sample();B.intents.resetPressed&&(g=1),g=Hh(g,B.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(g);let ut=B.intents.dummyClickId;if(B.tap){const j=i.pickDummy(B.tap.x,B.tap.y);j>0&&(ut=j)}ut>0&&(A=ut),v={...B,intents:{...B.intents,dummyClickId:A}};const ot=a.frame(F,v.intents,u.timeScale,u.paused,()=>{const j=e.events;for(let q=0;q<j.length;q++)h.event(j[q],e.time)});ot>0&&(A=0),h.sample(e,v,F*1e3,ot);for(const j of v.gestures)h.gesture(j);k-D>250&&(D=k,f.tick()),_(e.combat.weapon),y||i.render(e,F),E.tick(),d.update(e,v,i.getGroundBasis());const ht=i.diagnostics();s.update(e,L,ot,v,u,{attackBlend:ht.attackBlend,attackWeights:ht.attackWeights,landing:ht.landing,hurt:ht.hurt,ik:ht.ik,zoom:ht.camera.zoom},o.hudCompact()),requestAnimationFrame(X)}requestAnimationFrame(X)}zS();

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ya=["sword-shield","dual-swords","greatsword","staff","bow"],jr=["wander","follow","keep-distance","attack","idle"],of={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},rr=1e-6;function Xs(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>rr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>rr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Am(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>rr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>rr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Cn=1e-6,Wc=Math.PI/180,Kl=-1e9;function rf(){return{type:"none",lastAt:Kl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function jo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function nd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Jl(n,t,e){var l;const i=e.duration>0?e.duration:Ql(n,e.type);if(t.kind==="player"){const c=n.playerHurt;if(nd(c,e.type,i,e.dirX,e.dirZ),c.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Cn){const h=e.knockback*n.config.hits.knockbackDecay;c.knockX=e.dirX*h,c.knockZ=e.dirZ*h}jo(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(nd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Cn){const c=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*c,a.hurt.knockZ=e.dirZ*c}n.hitCount+=1,jo(n,"hit",a.id,a.position);const s=n.config.hits.hitstop,o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1,r=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;r>0&&n.combat.hitstop<r&&(n.combat.hitstop=r,jo(n,"hitstop",r,a.position))}function br(n,t,e){Jl(n,{kind:"dummy",index:t},e)}function Rm(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Ql(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Pm(n){const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>Cn?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-Cn||c>r+Cn)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Wc),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange;for(const g of n.dummies){if(t.hitIds.indexOf(g.id)>=0)continue;const p=g.position.x-i.x,y=g.position.z-i.z,x=Math.hypot(p,y);if(x>h+m)continue;const v=x>Cn?p/x:d,w=x>Cn?y/x:u;if(x>Cn&&(p*d+y*u)/x<f)continue;let S="light";t.weapon==="greatsword"?S="knock":t.comboIndex>=3&&(S="heavy");const E=e.knockback[t.weapon]??0;let T=x;E>0&&(T=Math.max(x+E,_));const M=Math.max(0,T-x);br(n,n.dummies.indexOf(g),{type:S,duration:Ql(n,S),dirX:v,dirZ:w,knockback:M}),t.hitIds.push(g.id)}}function Cm(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(id(s.arcDeg,0,180)*Wc),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=u>Cn?id(((x.position.x-r)*f+(x.position.z-l)*d)/u,0,1):0,w=r+f*v,S=l+d*v,E=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=E<=s.radius+p;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+p;else{const N=x.position.x-c,D=x.position.z-h,k=Math.hypot(N,D),V=k>Cn?(N*m+D*_)/k>=g:!0;T=k<=s.radius+p&&V||E<=s.width+p}if(!T)continue;const M=x.position.x-r,b=x.position.z-l,P=Math.hypot(M,b);if(P>Cn&&(M*m+b*_)/P<Math.cos(Math.max(s.arcDeg,90)*Wc))continue;const z=P>Cn?M/P:m,I=P>Cn?b/P:_;Jl(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:z,dirZ:I,knockback:s.knockback}),i.hitIds.push(x.id),jo(n,"link-hit",x.id,x.position)}}function Lm(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>Cn?s/r:0,c=r>Cn?o/r:1;Jl(n,{kind:"player"},{type:"light",duration:Ql(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function Dm(n,t){n.modules.hits&&(n.combat.phase==="active"&&Pm(n),Cm(n,t),Lm(n))}function id(n,t,e){return n<t?t:n>e?e:n}const cf=Math.PI/180,th=1e-6;function km(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function cr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function lf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>th?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function hf(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,th)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Im(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function zm(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!hf(n,t,e))return!1;const i=lf(n,t,e.lookRange);if(i===null)return!1;const a=Xe(i-n.character.bodyYaw);return Math.abs(a)>df(n,e)}function df(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*cf}function Fm(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!hf(n,e,a)){cr(n);return}const s=lf(n,e,a.lookRange);if(s===null){cr(n);return}const o=n.character,r=Xe(s-o.bodyYaw),l=Math.abs(r),c=df(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>th;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*cf);i.targetYaw=Xe(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Xe(i.targetYaw-i.fromYaw);o.bodyYaw=Xe(i.fromYaw+d*Im(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Zi=1e-6;function Xe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function uo(n,t,e,i){const a=Xe(t-n);return n+a*(1-Math.exp(-Math.max(e,Zi)*i))}function fo(n,t,e,i,a){const o=Xe(t-n)*(1-Math.exp(-Math.max(e,Zi)*a)),r=Math.max(i,0)*a;return r<=Zi?n:n+Qa(o,-r,r)}function ad(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Zi)*a)),o=Math.max(i,0)*a;return o<=Zi?n+s:n+Qa(s,-o,o)}function Qa(n,t,e){return n<t?t:n>e?e:n}function sd(n,t,e,i){const a=Xe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Xe(n+Math.sign(a)*Math.max(e,0))}function Um(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Zi,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=Xs(n,e);else if(c)i.facing=fo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=Xs(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Zi)){const b=Math.atan2(e.moveX,e.moveZ),P=a.facingTurnRate*Math.PI/180*t,z=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=sd(i.facing,b,P,z);else if(h>=a.facingMinMagnitude&&Math.abs(Xe(b-i.facing))>a.facingDeadbandDeg*Math.PI/180){const N=uo(i.facing,b,a.facingSmoothRate,t);i.facing=sd(i.facing,N,P,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||zm(n,e)||(c?i.bodyYaw=fo(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=uo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const b=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Xe(p-i.bodyYaw))>b&&(p=i.moveYaw)}const y=o||f||g,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const b=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?fo(i.headYaw,p,b,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):uo(i.headYaw,p,b,t)}else{const b=Xe(i.headYaw-i.bodyYaw),P=Xe(p-i.bodyYaw),z=Math.abs(P)<Math.abs(b)-1e-9,I=z?n.config.gaze.headReturnRate:a.headTurnRate,N=z?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,D=Number.isFinite(N)?fo(b,P,I,N,t):uo(b,P,I,t);v=i.bodyYaw+D}const w=Xe(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const b=n.dummies[n.targeting.targetId-1];if(b){const P=i.position.y+n.config.characterHeight*Qa(S.eyeHeightRatio,0,1),z=b.position.y+n.config.dummies.height*Qa(S.aimHeightRatio,0,1),I=Math.hypot(b.position.x-i.position.x,b.position.z-i.position.z);E=Math.atan2(z-P,Math.max(Zi,I))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=Qa(E,-T,T);const M=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=ad(i.headPitch,E,M,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=ad(i.bodyPitch,i.headPitch*Qa(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const uf=1e-6,Sr=Math.PI/180;function wr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Nm(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*Sr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(Xe(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Om(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Bm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*Sr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Nm(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Om(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}wr(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Hm(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Sr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,wr(n,"projectile-fire",i.volleyId,o)}i.pending=a}function od(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,wr(n,"channel-end",0,n.character.position))}function Gm(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){od(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),wr(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=Xs(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,uf),Bm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){od(n,i);break}}function Vm(n,t,e){const i=Math.max(0,e.homingConeDeg)*Sr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+uf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Xe(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function Xm(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Vm(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Xe(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),_=f+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){br(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Wm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Gm(n,t,e,s,a,i.cfg.slot),Hm(n,t,s),Xm(n,t,s)}},Kr=1e-6;function ff(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Ym(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),ff(n,"ring-place",i.id,e)}function $m(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Kr),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),_=m>Kr?f/m:0,g=m>Kr?d/m:1;br(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}ff(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Zm={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&Ym(n,s),$m(n,t,s)}},qm={channelVolley:Wm,groundRing:Zm};function jm(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function Km(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=qm[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Jm(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function pf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function Qm(n,t,e){Km(n,t,e)}function Jr(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const rd=1e-6;function cd(n,t,e){return n<t?t:n>e?e:n}function mf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function gf(n){const t=n.camera,e=mf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function t0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=cd((e.radius-d)/Math.max(rd,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:cd(a/(a+Math.max(rd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function e0(n){const t=[],e=n.ground.size;t.push(ka("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(ka(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(ka(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ka(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ka(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(ka(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function ka(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Ci=1e-6;function lr(n,t,e){return n<t?t:n>e?e:n}function Ws(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Ci||c.maxY<i-o-Ci||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function eh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Ci||l.minY>=o-Ci)continue;const c=lr(t.x,l.minX,l.maxX),h=lr(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>Ci*Ci){const m=Math.sqrt(u),_=(e-m)/m;t.x+=f*_,t.z+=d*_}else{const m=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(m,_,g,p);y===m?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function nh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ci||o.minY>=s-Ci)continue;const r=lr(t.x,o.minX,o.maxX),l=lr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Ci)return!0}return!1}const Yi=1e-6,ls=Math.PI/180;function ih(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Yc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function xf(n){n.arrows.length=0}function n0(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let m=0;u>Yi&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const _=n+f*m,g=e+d*m,p=_-o,y=g-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function i0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Yi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*ls,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Yi;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(ih(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function a0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ls;return t+is(ih(s-t),-o,o)}function s0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*ls),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*ls),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Yi,s),f=l.position.y+n.config.dummies.height*is(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=is(u,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function o0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=i0(n,e),l=a0(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=s0(n,f,u,d,r,s),_={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ls};return n.arrows.push(_),Yc(n,"arrow-shot",a,_),_}function is(n,t,e){return n<t?t:n>e?e:n}function r0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>Yi){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),E=Math.atan2(c.vx,c.vz),T=c.turnRate*t,M=E+is(ih(S-E),-T,T);c.vx=Math.sin(M)*w,c.vz=Math.cos(M)*w;const b=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(b>.3){const P=b/w,I=(v.position.y+s*is(i.aimHeightRatio,0,1)-c.y+.5*r*P*P)/P,N=Math.max(0,i.verticalTurnRate)*t;c.vy+=is(I-c.vy,-N,N)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,_=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=n0(h,f,d,u,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),E=c.x-v.position.x,T=c.z-v.position.z;c.offX=E*w-T*S,c.offZ=E*S+T*w,c.offY=c.y-v.position.y;const M=Math.atan2(c.vx,c.vz);c.localYaw=M-v.bodyYaw,c.yaw=M,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const b=Math.hypot(c.vx,c.vz);br(n,g,{type:"light",duration:.22,dirX:b>Yi?c.vx/b:0,dirZ:b>Yi?c.vz/b:1,knockback:.14}),Yc(n,"arrow-land",v.id,c),l.push(c);continue}const y=Ws(n.boxes,u,_,m+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(m<=x+.02&&c.vy<0){c.x=u,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Yi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*ls),c.rest=Math.max(.2,i.stickSec),Yc(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=_,l.push(c)}n.arrows=l}const $c=1e-6,c0=Math.PI/180;function Zc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ah(n,t,e){return n<t?t:n>e?e:n}function Er(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function qc(n){const t=n.id,e=n.windowId;Object.assign(n,Er()),n.id=t,n.windowId=e}function l0(n){qc(n)}function vf(n){qc(n.playerLink);for(const t of n.dummies)qc(t.link)}function h0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function jc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function hr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Er()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function d0(n,t){const e=n.config.links.search,i=n.character.position,a=ah(e.maxAngleDeg,0,180)*c0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<$c||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Xe(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function u0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=Xs(n,t),l=d0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?ah(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Zc(n,"link-start",s.id)}function f0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){hr(n);return}if(e.weapon!==n.combat.weapon){hr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Zc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Zc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?ah(r/o,0,1):1,e.phase==="active"&&i.active>$c){const l=Math.max(0,e.travel-e.travelled),c=Math.max($c,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function p0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&hr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&jc(n,"sprint"),a.prevSprinting=r,f0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&u0(n,e,l,o.weapon)}const Ko={windup:0,active:1,recovery:2},ld=1e-9;function yf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function m0(n){return n==="windup"||n==="active"||n==="recovery"}function g0(n,t){return Ko[n]+yf(t)}function x0(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!m0(s.at))continue;const o=yf(s.u??0),r=Ko[s.at]+o;r>i+ld&&r<=e+ld&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Ko[s.at]+s.u-(Ko[o.at]+o.u)),a}const Ys=1e-6;function $i(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function v0(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function _f(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Tr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.timings=_f()}function y0(n){return{weapon:ya[Math.max(0,n-1)]??ya[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],timings:_f()}}function _0(n,t){return Xs(n,t)}function M0(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Mf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=_0(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.notifyCursor=-1,a.hitIds.length=0,$i(n,"attack-start",i)}function bf(n){return Math.max(0,n.config.combat.settle)}function Kc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Mf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:bf(n),lunge:M0(n,i.lunge[e-1]??0)},e)}function hd(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Mf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:bf(n),lunge:i.lunge},0),o0(n,e,n.combat.attackFacing),$i(n,"charge-release",e)}function b0(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;if(i.hitstop>0)return;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",$i(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",$i(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Kc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>Ys&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Kc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1),S0(n)}function S0(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>Ys?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:g0(t.phase,a);if(s<=t.notifyCursor+Ys)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of x0(o,t.notifyCursor,s))v0(n,r.name,r.value);t.notifyCursor=s}function w0(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ya.length){const l=ya[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Tr(n),hr(n),$i(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,$i(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),b0(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Kc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,$i(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,Ys)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,hd(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?hd(n,e,l):$i(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>Ys)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=_=>c*(1-Math.pow(1-Math.min(1,Math.max(0,_/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let m=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);m=Math.min(m,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*m,n.impulse.z=Math.cos(i.attackFacing)*m}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const Jc=1e-6;function Qr(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function E0(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Sf(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function dd(n,t,e){return n<t?t:n>e?e:n}function T0(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Jc;){const d=Math.min(l,c+r),u=s.x+t*d,m=s.z+e*d,_=dd(u,o.minX,o.maxX),g=dd(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(nh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,f=g,c=d,_!==u||g!==m))break}return{x:h,z:f}}function A0(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,jc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&Qr(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Tr(n));const l=Am(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=T0(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),jc(n,"blink"),Qr(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Jc,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,Qr(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Jc,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const fn=1e-6,Qc=Math.PI*2,R0=7,P0=18;function C0(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ud(n,t,e,i){return n+C0(t-n)*(1-Math.exp(-Math.max(e,fn)*i))}function sh(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function L0(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:rf(),link:Er()})}return t}function D0(n){const t=jr.indexOf(n);return jr[(t+1)%jr.length]}function wf(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,l0(i.link)}n.dummyAttackCount=0}function k0(n,t,e){const i=Jr(n)*Qc,a=Math.sqrt(Jr(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Jr(n)*.8)}function I0(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function z0(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(I0(t,i),fn);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",sh(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function F0(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>fn?a/o:0,l=o>fn?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&k0(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>fn&&(c=_/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>fn&&(f=Math.atan2(c,h)):o>fn&&(f=Math.atan2(r,l)),e.leashRadius>fn&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,m=Math.hypot(d,u);if(m>e.leashRadius){const _=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-u/m;c=c*(1-_)+g*_,h=h*(1-_)+p*_;const y=Math.hypot(c,h);y>fn&&(c/=y,h/=y)}}return{x:c,z:h,facing:f}}function U0(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+fn&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,sh(n,"dummy-attack",e))}z0(n,e,t,i);const a=F0(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-fn||a.x<0&&e.position.x<=s.minX+fn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-fn||a.z<0&&e.position.z<=s.minZ+fn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,fn)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=ud(e.bodyYaw,e.facing,R0,t),e.headYaw=ud(e.headYaw,e.facing,P0,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(eh(n.boxes,e.position,i.radius,i.height,c))if(nh(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,y=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(y)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Ws(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+fn&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const m=Math.hypot(e.velocity.x,e.velocity.z),_=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,fn)),g=Math.max(n.config.strideLength*(1+_*n.config.strideSpeedGain),fn);e.stride=g,e.gaitPhase=(e.gaitPhase+u/g*Qc)%Qc}function N0(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=D0(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,sh(n,"dummy-mode",a)}for(const a of n.dummies)U0(n,t,a,i)}const Jn=1e-6,fd=Math.PI*2;function pd(n,t){return Math.sqrt(n*n+t*t)}function po(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function O0(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Tr(n)}function B0(n,t,e){const i=n.character,a=n.config,s=Ws(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Tr(n),vf(n),Sf(n),pf(n),xf(n),cr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Kl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function H0(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=pd(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-Jn||r<0&&s.x<=h.minX+Jn)&&(r=0),(l>0&&s.z>=h.maxZ-Jn||l<0&&s.z<=h.minZ+Jn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;a.sprinting=!m&&e.sprintHeld&&c>Jn;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const I=m?i.skillDecel:c>Jn?i.acceleration:i.friction,N=1-Math.exp(-I*t);o.x+=(r*p-o.x)*N,o.z+=(l*p-o.z)*N}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,po(n,"jumped",i.jumpSpeed)),n.events.some(I=>I.type==="blink"&&I.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,eh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(nh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const I=s.x-x,N=s.z-v;Math.abs(I)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(N)<Math.abs(o.z*t)*.5&&(o.z=0)}po(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Ws(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+Jn&&S-s.y<=i.stepHeight+Jn&&(s.y=S,o.y=0,po(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=Ws(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||po(n,"landed",T),a.grounded=!0):a.grounded=!1;const M=pd(s.x-x,s.z-v);a.distance+=M;const b=M/Math.max(t,Jn),P=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,Jn)),z=Math.max(i.strideLength*(1+P*i.strideSpeedGain),Jn);a.stride=z,a.gaitPhase=(a.gaitPhase+M/z*fd)%fd}const tl=1e-6,md=2.399963229728653;function fa(n,t,e){return n<t?t:n>e?e:n}function gd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,_;f<tl?(u=r,m=l,_=d):(u=c/f,m=h/f,_=d-f);const g=_+o;n.x-=u*g*a,n.z-=m*g*a,t.x+=u*g*s,t.z+=m*g*s}function G0(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*md;gd(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*md;gd(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)eh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=fa(h.position.x,c.minX,c.maxX),h.position.z=fa(h.position.z,c.minZ,c.maxZ)}function V0(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=fa(r.minScale,0,1);if(l<tl||c<=0||h>=1)return 1;const f=a+o,d=fa(r.approachDot,0,.99);let u=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=f+c)continue;if(p<tl){u=1;continue}const y=(e*_+i*g)/(l*p);if(y<=d)continue;const x=fa(1-(p-f)/c,0,1),v=fa((y-d)/(1-d),0,1);u=Math.max(u,x*v)}return 1-(1-h)*fa(u,0,1)}function X0(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=V0(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const tc=1e-6,W0=Math.PI/180;function Y0(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function $0(n,t,e){return n<t?t:n>e?e:n}function Z0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>tc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>tc&&(o=Math.atan2(e.moveX,e.moveZ));const l=$0(i.maxAngleDeg,0,180)*W0;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-s.x,_=u.position.z-s.z,g=Math.hypot(m,_);if(g<tc||g>i.range)continue;const p=Math.atan2(m,_),y=Math.abs(Xe(p-o));if(y>l)continue;const x=g-i.frontBias*Math.cos(y);x<c&&(c=x,h=u.id,f=p,d=g)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const pi=1e-6;function ts(n,t,e){return n<t?t:n>e?e:n}function xd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function q0(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(I,N)=>{const D=I.position.x-s.x,k=I.position.z-s.z,V=Math.hypot(D,k);if(V<pi||V>N)return 0;const B=ts((N-V)/Math.max(pi,N-i.nearDistance),0,1);let $=B*(i.modeWeight[I.mode]??.5);return I.attackPhase==="active"&&($+=i.attackBoost*B),$},r=[];let l=0,c=!1,h=!1,f=!1;for(const I of n.dummies){const N=o(I,i.threatRange),D=I.position.x-s.x,k=I.position.z-s.z,V=Math.hypot(D,k);N>0&&(r.push({id:I.id,x:I.position.x,z:I.position.z,dx:D,dz:k,yaw:Math.atan2(D,k),w:N}),l+=N,V<=i.approachDist&&(i.modeWeight[I.mode]??.5)>=i.hostileModeWeight&&(f=!0)),V>pi&&V<=i.recoveryDist&&(c=!0),(I.attackPhase==="windup"||I.attackPhase==="active")&&V<=i.threatRange&&(h=!0)}const d=l<=0?0:ts(l/(l+Math.max(pi,i.saturation)),0,1),u=r.length>0,m=a.active,_=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>pi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((I,N)=>N.w-I.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,T=0,M=0;for(const I of y){const N=Math.abs(xd(I.yaw-v))/Math.PI;let D=I.w/(1+Math.max(i.spreadFalloff,0)*N*N);I!==x&&i.behindFalloff<1&&Math.abs(xd(I.yaw-S))>w&&(D*=Math.max(i.behindFalloff,0)),E+=I.x*D,T+=I.z*D,M+=D}a.mainId=x.id,a.mainYaw=v;const b=n.dummies.find(I=>I.id===x.id),P=(b?b.position.y:0)+n.config.dummies.height*ts(i.aimHeightRatio,0,1),z=s.y+n.config.characterHeight*ts(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(P-z,Math.max(pi,Math.hypot(x.dx,x.dz))),a.centroidYaw=M>pi?Math.atan2(E/M-s.x,T/M-s.z):v,a.threatCount=r.length,a.threat=d}function j0(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function K0(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<pi||a>e.threatRange)return 0;const s=Math.max(pi,e.threatRange-e.nearDistance),o=ts((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(pi,e.modeWeight.attack??1.5);return ts(r/l,0,1)}function J0(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Q0(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:e0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:y0(1),playerLink:Er(),arrows:[],arrowSeq:0,abilities:Jm(),skills:jm(n),impulse:{x:0,z:0},targeting:Y0(),turnInPlace:km(),playerHurt:rf(),hitCount:0,dash:{...E0(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...mf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:J0(),dummies:L0(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function tg(n){O0(n),wf(n),vf(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Kl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,pf(n),xf(n),Sf(n),gf(n),cr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function vd(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){tg(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Z0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),p0(n,t,e),n.modules.combat&&w0(n,t,e),n.modules.dash&&A0(n,t,e),n.modules.movement&&H0(n,t,e),n.modules.gaze&&q0(n,t,e),n.modules.orientation&&Um(n,t,e),Fm(n,t,e),n.modules.dummies&&N0(n,t,e),Rm(n,t),h0(n,t),n.modules.abilities&&Qm(n,t,e),n.modules.combat&&r0(n,t),n.modules.dummies&&(Dm(n,t),n.modules.separation&&(G0(n),X0(n))),n.modules.camera?t0(n):gf(n),n}const Ef=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],yd=1e-9;function eg(n,t,e){return n<t?t:n>e?e:n}function Tf(n){return eg(Number.isFinite(n)?n:0,0,1)}function Af(n,t){const e=Tf(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function ng(){const n={};for(const t of Ef)n[t]=0;return n}function ig(n,t){const e=ng(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Tf(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+yd;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>yd?(a-o.t)/l:0,h=Af(o.ease??"linear",c);for(const f of Ef){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function ag(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Af(i,t/a);return e.turns*Math.PI*2*s}function ta(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function sg(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};vd(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){vd(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function bi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function sn(n,t,e){return n+(t-n)*e}function og(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function _d(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:og(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress}))}}function rg(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function cg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:sn(n.ch.x,t.ch.x,i),y:sn(n.ch.y,t.ch.y,i),z:sn(n.ch.z,t.ch.z,i)},facing:bi(n.ch.facing,t.ch.facing,i),moveYaw:bi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:bi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:bi(n.ch.headYaw,t.ch.headYaw,i),headPitch:sn(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:sn(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:bi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:sn(n.ch.stride,t.ch.stride,i)},s={attackProgress:sn(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:sn(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:sn(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,sn(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:sn(n.hurt.timer,t.hurt.timer,i),knockX:sn(n.hurt.knockX,t.hurt.knockX,i),knockZ:sn(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:sn(h.x,l.x,i),y:sn(h.y,l.y,i),z:sn(h.z,l.z,i)},facing:bi(h.facing,l.facing,i),bodyYaw:bi(h.bodyYaw,l.bodyYaw,i),headYaw:bi(h.headYaw,l.headYaw,i),gaitPhase:bi(h.gaitPhase,l.gaitPhase,i),stride:sn(h.stride,l.stride,i),attackProgress:sn(h.attackProgress,l.attackProgress,i)}:null});return{time:sn(n.time,t.time,i),character:a,combat:s,playerHurt:o,dummies:r}}function lg(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dummies:e}}const Rf={slopPx:12,longPressMs:450,doubleTapMs:280};function hg(n,t,e=Rf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ea(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function dg(n=Rf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ea(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,ea(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return ea(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),ea(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),ea(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ea(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ea(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const ec=.001,ug=18;function el(n,t,e){return n<t?t:n>e?e:n}function nl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function fg(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function pg(n,t,e,i,a=ug){const s=fg(t);if(!s)return{state:nl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<ec)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<ec?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<ec)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:el(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Md(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?el(r,a,s):el(n,a,s)}function mg(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function gg(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const nc=["jump","sprint","reset","attack","skill2"],xg=8,vg=16,ic=10,bd=14,Sd=140,yg=18,_g=16,Mg=400,bg=1.0001;function Jo(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Sg(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Jo(e)}function wg(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,_=null,g=-1,p=0,y=0,x=0,v=0,w=!1,S=0,E=1,T=0,M=null,b=0,P=0,z=!1,I=null,N=null,D=0,k=0,V=0,B=0,$=!1,at=!0,mt=-1;const ft=dg({slopPx:bd,longPressMs:450,doubleTapMs:350});let pt=[],et=null;const K=new Set;function gt(O){O&&pt.push(O)}const j=new Map;let H=nl(),ot=!1,wt=1;function Ot(){const O=Array.from(j.values()),lt=a(),xt=pg(H,O,lt.pinchGain,lt.maxStepRatio,yg);if(H=xt.state,ot=xt.pinching,xt.scale!==1&&(wt*=xt.scale),xt.started||xt.armedNow)M=null,z=!0,I=null;else if(xt.ended&&o===null&&O.length===1){const Xt=O[0];o=Xt.id,r=Xt.x,l=Xt.y,c=0,h=0,f=Xt.x,d=Xt.y,w=!1,S=0,E=1,T=0,performance.now(),M=null,z=!0,I=null}}const Mt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Lt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let F=0,le=0;const Wt={},Nt=new Set,Ct=[];function Dt(){for(const O of nc)Wt[O]!==void 0&&(Wt[O]=void 0),Z(O);ft.reset(),K.clear(),j.clear(),H=nl(),ot=!1,o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0,_=null,g=-1,M=null,z=!1,I=null,N=null,mt=-1,V=0,B=0,$=!1,at=!0}const Tt=()=>{document.hidden&&Dt()},C=O=>{if(O.clientX===0&&O.clientY===0){m++;return}if(Jo(O.target)||Sg(O.clientX,O.clientY)){K.add(O.pointerId);return}if(K.delete(O.pointerId),j.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!ot){_=null,g=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,f=O.clientX,d=O.clientY,performance.now();const lt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);w=lt,S=0,E=1,T=0,p=lt?O.screenX:0,y=lt?O.screenY:0,x=p,v=y,M=O.pointerId,b=O.clientX,P=O.clientY,z=!1}Ot()},A=O=>{if(O.pointerId===N&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(D!==0||k!==0)||(at?(V=O.clientX-D,B=O.clientY-k):(D=O.clientX,k=O.clientY,at=!0,V=0,B=0))),gt(ft.move(O.pointerId,O.clientX,O.clientY,performance.now())),!K.has(O.pointerId)&&j.has(O.pointerId)&&(j.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),Ot()),K.has(O.pointerId)||O.pointerId!==o)return;const lt=performance.now();if(_===O.pointerId&&lt-g<150){m++;return}const xt=O.clientX,Xt=O.clientY;if(xt===0&&Xt===0&&(r!==0||l!==0)){m++;return}const Zt=xt-f,U=Xt-d,bt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),it=bt?O.screenX:0,ht=bt?O.screenY:0,Rt=bt&&(it!==0||ht!==0),At=it-x,Qt=ht-v;if(w&&Rt){const ze=Math.hypot(At,Qt),Re=Math.hypot(Zt,U);if(ze>3){if(S=0,T<30&&Re>6&&At*Zt+Qt*U>.7*ze*Re){const qe=ze/Re;qe>.2&&qe<5&&(E+=(qe-E)*.3,T++)}}else Re>12&&(S++,S>=2&&(w=!1))}const se=Math.hypot(Zt,U);if(!w){const ze=u<0?Number.POSITIVE_INFINITY:lt-u,Re=Rt?Math.hypot(At,Qt):1/0;se>28&&(ze<200||Re<se*.4)&&(r+=Zt,l+=U,m++)}f=xt,d=Xt,x=it,v=ht,O.pointerId===M&&Math.hypot(O.clientX-b,O.clientY-P)>xg&&(z=!0);let ue,oe;w&&Rt?(ue=(it-p)/E,oe=(ht-y)/E):(ue=xt-r,oe=Xt-l);const Ee=Math.hypot(ue,oe),Be=s();Ee>Be&&(ue*=Be/Ee,oe*=Be/Ee);const gn=Math.hypot(c,h),Ae=Math.hypot(ue,oe);if(gn>10&&Ae>10){const ze=Math.abs(Math.atan2(c*oe-h*ue,c*ue+h*oe)),Re=Math.max(gn,Ae)*ze,qe=Math.max(Math.hypot(Zt,U),Math.hypot(At,Qt)/Math.max(.2,E));if(ze>.6&&qe<Math.max(6,Re*.5)){m++;return}}c=ue,h=oe};function Z(O){if(!Mt[O])return;Mt[O]=!1,O==="attack"&&(Lt.attackReleased=!0);const lt=document.getElementById(`btn-${O}`);lt==null||lt.classList.remove("is-down")}function dt(){o!==null&&(_=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0)}const Q=O=>{const lt=j.delete(O.pointerId),xt=K.delete(O.pointerId);lt&&Ot(),O.pointerId===N&&(N=null,$?mt=performance.now():(V=0,B=0,mt=-1)),gt(ft.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ut of nc)Wt[Ut]===O.pointerId&&(Wt[Ut]=void 0,Z(Ut));const Xt=!lt&&!xt&&j.size<=1&&o!==null;(O.pointerId===o||j.size===0||Xt)&&dt(),!xt&&O.pointerId===M&&(!z&&!Jo(O.target)&&(I={x:O.clientX,y:O.clientY}),M=null)};for(const O of nc){const lt=document.getElementById(`btn-${O}`);if(!lt)continue;const xt=O==="attack"||O==="skill2",Xt=U=>{if(U.preventDefault(),Wt[O]===void 0){Wt[O]=U.pointerId,Mt[O]=!0,O==="jump"&&(Lt.jump=!0),O==="reset"&&(Lt.reset=!0),O==="sprint"&&(Lt.sprintPressed=!0),O==="attack"&&(Lt.attackPressed=!0),O==="skill2"&&(Lt.skill2=!0),lt.classList.add("is-down"),gt(ft.begin(O,U.pointerId,U.clientX,U.clientY,performance.now()));try{lt.setPointerCapture(U.pointerId)}catch{}xt&&(N=U.pointerId,D=U.clientX,k=U.clientY,at=!(U.clientX===0&&U.clientY===0),V=0,B=0,$=!1,mt=-1)}},Ut=U=>{Wt[O]===U.pointerId&&(Wt[O]=void 0,Z(O),gt(ft.end(U.pointerId,U.clientX,U.clientY,performance.now())))},Zt=U=>{Wt[O]===U.pointerId&&(Wt[O]=void 0,Z(O),gt(ft.cancel(U.pointerId,performance.now())))};lt.addEventListener("pointerdown",Xt),lt.addEventListener("pointerup",Ut),lt.addEventListener("pointercancel",Zt),Ct.push(()=>{lt.removeEventListener("pointerdown",Xt),lt.removeEventListener("pointerup",Ut),lt.removeEventListener("pointercancel",Zt)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of rt){const lt=xt=>{xt.preventDefault(),F=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",lt),Ct.push(()=>O.removeEventListener("pointerdown",lt))}const zt=O=>{const lt=O.key.toLowerCase();if((lt===" "||lt.startsWith("arrow"))&&O.preventDefault(),Nt.has(lt))return;Nt.add(lt),lt===" "&&(Lt.jump=!0),lt==="r"&&(Lt.reset=!0),lt==="shift"&&(Lt.sprintPressed=!0),lt==="j"&&(Lt.attackPressed=!0),lt==="k"&&(Lt.skill2=!0),lt>="1"&&lt<="5"&&(F=Number(lt)),lt>="6"&&lt<="9"&&(le=Number(lt)-5);const xt=Math.max(bg,a().keyStep||1.12);(lt==="="||lt==="+")&&(wt*=xt),(lt==="-"||lt==="_")&&(wt/=xt)},nt=O=>{const lt=O.key.toLowerCase();Nt.has(lt)&&(Nt.delete(lt),lt==="j"&&(Lt.attackReleased=!0))},vt=O=>{if(Jo(O.target))return;O.preventDefault();const lt=O.deltaMode===1?O.deltaY*_g:O.deltaMode===2?O.deltaY*Mg:O.deltaY;wt*=mg(lt,a().wheelStep)},Ft=O=>{O.preventDefault()},st=()=>{u=performance.now()};window.addEventListener("resize",st),window.addEventListener("orientationchange",st);const St=typeof window<"u"?window.visualViewport:null;return St&&(St.addEventListener("resize",st),St.addEventListener("scroll",st)),window.addEventListener("pointerdown",C),window.addEventListener("pointermove",A),window.addEventListener("pointerup",Q),window.addEventListener("pointercancel",Q),window.addEventListener("blur",Dt),document.addEventListener("visibilitychange",Tt),window.addEventListener("keydown",zt),window.addEventListener("keyup",nt),window.addEventListener("wheel",vt,{passive:!1}),window.addEventListener("gesturestart",Ft),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:E}},peekAim(){const O=performance.now(),lt=Math.hypot(V,B),xt=N!==null||mt>=0&&O-mt<Sd;if(!(xt&&$&&lt>=ic))return{active:!1,holding:xt,x:0,z:0,dx:V,dy:B};const Ut=i(),Zt=V/lt,U=B/lt,bt=Ut.rightX*Zt+Ut.forwardX*-U,it=Ut.rightZ*Zt+Ut.forwardZ*-U,ht=Math.hypot(bt,it)||1;return{active:!0,holding:xt,x:bt/ht,z:it/ht,dx:V,dy:B}},sample(){var Dn;const O=s();let lt=o!==null?Math.max(-1,Math.min(1,c/O)):0,xt=o!==null?Math.max(-1,Math.min(1,h/O)):0,Xt=0,Ut=0;(Nt.has("a")||Nt.has("arrowleft"))&&(Xt-=1),(Nt.has("d")||Nt.has("arrowright"))&&(Xt+=1),(Nt.has("w")||Nt.has("arrowup"))&&(Ut-=1),(Nt.has("s")||Nt.has("arrowdown"))&&(Ut+=1),lt+=Xt,xt+=Ut;let Zt=Math.hypot(lt,xt);Zt>1&&(lt/=Zt,xt/=Zt,Zt=1);const U=lt,bt=xt;Zt<e&&(lt=0,xt=0);const it=i();let ht=it.rightX*lt+it.forwardX*-xt,Rt=it.rightZ*lt+it.forwardZ*-xt;const At=Math.hypot(ht,Rt);At>1&&(ht/=At,Rt/=At);const Qt=performance.now();gt(ft.poll(Qt));const se=Math.hypot(V,B);N!==null&&(se>=vg?$=!0:se<ic&&($=!1));const ue=N!==null||mt>=0&&Qt-mt<Sd,oe=ue&&$&&se>=ic;let Ee=0,Be=0;if(oe){const tn=V/se,X=B/se,kt=it.rightX*tn+it.forwardX*-X,Et=it.rightZ*tn+it.forwardZ*-X,ne=Math.hypot(kt,Et)||1;Ee=kt/ne,Be=Et/ne}!ue&&N===null&&(V=0,B=0,mt=-1,$=!1);const gn=I;I=null;const Ae=wt;wt=1;const ze={moveX:ht,moveZ:Rt,jumpPressed:Lt.jump,sprintHeld:Mt.sprint||Nt.has("shift"),sprintPressed:Lt.sprintPressed,resetPressed:Lt.reset,attackPressed:Lt.attackPressed,attackHeld:Mt.attack||Nt.has("j"),attackReleased:Lt.attackReleased,skill2Pressed:Lt.skill2,weaponSlot:F,dummyClickId:le,aimX:Ee,aimZ:Be,aimActive:oe};Lt.jump=!1,Lt.reset=!1,Lt.sprintPressed=!1,Lt.attackPressed=!1,Lt.attackReleased=!1,Lt.skill2=!1,F=0,le=0;const Re=pt.map(tn=>hg(tn,it,bd));pt=[],Re.length>0&&(et=Re[Re.length-1]);const qe=o!==null?"pointer":Nt.size>0?"keyboard":"idle";return{intents:ze,stickX:lt,stickY:xt,stickRawX:U,stickRawY:bt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:E,stickVpTop:((Dn=gg())==null?void 0:Dn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:V,aimDY:B,source:qe,tap:gn,zoomScale:Ae,gestures:Re,lastGesture:et}},dispose(){window.removeEventListener("pointerdown",C),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",Q),window.removeEventListener("pointercancel",Q),window.removeEventListener("blur",Dt),document.removeEventListener("visibilitychange",Tt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",nt),window.removeEventListener("wheel",vt),window.removeEventListener("resize",st),window.removeEventListener("orientationchange",st),St&&(St.removeEventListener("resize",st),St.removeEventListener("scroll",st)),window.removeEventListener("gesturestart",Ft),ft.reset();for(const O of Ct)O()}}}const dr=1,ur=2,fr=4,Pf=8,pr=16,Ns=32,Cf=64,Lf=128,Eg=[[dr,"atk"],[ur,"dash"],[fr,"link"],[Pf,"air"],[pr,"hurt"],[Ns,"aim"],[Cf,"spr"],[Lf,"chan"]];function Ia(n){if(n===0)return"-";const t=Eg.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Tg=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Ag=0,Rg=15,ac=19,Pg=21,Cg=22,Lg=23,Dg=24,ui={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},kn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,Qn=n=>Math.round(n*180/Math.PI*10)/10,sc=Math.PI*2;function Es(n){let t=n%sc;return t>Math.PI&&(t-=sc),t<-Math.PI&&(t+=sc),t}function kg(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=dr),n.dash.phase!=="idle"&&(e|=ur),n.playerLink.phase!=="idle"&&(e|=fr),n.character.grounded||(e|=Pf),n.playerHurt.type!=="none"&&(e|=pr),t.intents.aimActive&&(e|=Ns),n.character.sprinting&&(e|=Cf),n.abilities.channeling&&(e|=Lf),e}function Ig(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function zg(n){const t={sampleHz:n.sampleHz??ui.sampleHz,sampleCapacity:n.sampleCapacity??ui.sampleCapacity,eventCapacity:n.eventCapacity??ui.eventCapacity,anomalyCapacity:n.anomalyCapacity??ui.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??ui.dirJumpDeg,aimDropDeg:n.aimDropDeg??ui.aimDropDeg,freezeMs:n.freezeMs??ui.freezeMs,freezeSpeed:n.freezeSpeed??ui.freezeSpeed,stickLostMs:n.stickLostMs??ui.stickLostMs,spikeMs:n.spikeMs??ui.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,_=-1,g=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,E=0,T=0,M=0;function b(D,k){const V=1/t.sampleHz,B=D[Ag];B-c<V-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(D),c=B)}function P(D,k,V,B,$,at){const mt=v[D]??-1e9;if(k-mt<1.2)return;if(v[D]=k,D==="frameSpike"){let pt=0;for(const et of s)et.kind==="frameSpike"&&pt++;if(pt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let ft=i.slice(-7);at&&(ft.length===0||ft[ft.length-1]!==at)&&(ft=[...ft.slice(-6),at]),s.push({kind:D,t:kn(k),tick:V,ms:Math.round(B),detail:$,ctx:ft}),D==="dirJump"?o.dirJumps++:D==="aimDrop"?o.aimDrops++:D==="moveFreeze"?o.freezes++:D==="stickLost"?o.stickLosts++:D==="stickJump"?o.stickJumps++:D==="stickBad"?o.stickBads++:D==="stickDrift"&&o.stickDrifts++}function z(D,k,V,B){a.length>=t.eventCapacity&&a.shift(),a.push({t:kn(V),tick:B,k:D,d:k})}function I(D){switch(D.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=D.tick;break}}function N(){const D=o,k=D.wallMs/1e3,V=D.gestures,B=ft=>Object.entries(V).filter(([pt])=>pt.endsWith(`.${ft}`)).reduce((pt,[,et])=>pt+et,0),$=[];if($.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),$.push(`运行 ${k.toFixed(1)}s / ${D.frames} 帧 · ${D.fps.toFixed(1)}fps · 最大 ${D.dtMax.toFixed(0)}ms · 尖峰 ${D.spikes} · 步 ${D.steps}`),$.push(`摇杆活跃 ${k>0?Math.round(D.stickActiveMs/1e3/k*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),$.push(`攻击 ${D.attacks}(中${D.hits}) · 受击 ${D.hurts} · 派生 ${D.links}(中${D.linkHits}) · 翻滚 ${D.rolls} 闪现 ${D.blinks} · 跳 ${D.jumps} · 复位 ${D.resets}`),$.push(`法杖 引导${D.channels} 飞弹${D.bolts} 电环${D.rings} · 弓蓄力${D.bowCharges} · 当前武器 ${u||"-"}`),$.push(`异常 ${D.dirJumps+D.aimDrops+D.freezes+D.stickLosts+D.stickJumps+D.stickBads+D.stickDrifts}（dir ${D.dirJumps} / aim ${D.aimDrops} / freeze ${D.freezes} / stick ${D.stickLosts} / stickJump ${D.stickJumps} / 坏指针 ${D.stickBads} / 坐标漂移 ${D.stickDrifts}） · 掉帧尖峰 ${D.spikes}`+(D.inTurns>0?` · 输入转向 ${D.inTurns} 次（最大 ${D.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const ft of s.slice(-6)){$.push(`· ${ft.kind} @t${ft.t.toFixed(2)} tick${ft.tick} ${ft.ms>0?`${ft.ms}ms `:""}${ft.detail}`);const pt=ft.ctx.map(K=>String(K[Rg])).join(" "),et=ft.ctx.map(K=>K[ac]===""||K[ac]==null?".":String(K[ac])).join(" ");if($.push(`  yaw ${pt}`),$.push(`  in  ${et}`),ft.kind==="stickJump"||ft.kind==="stickBad"||ft.kind==="stickLost"){const K=ft.ctx.map(j=>`${j[Pg]},${j[Cg]}`).join(" "),gt=ft.ctx.map(j=>`${j[Lg]},${j[Dg]}`).join(" ");$.push(`  o   ${K}`),$.push(`  p   ${gt}`)}}if(a.length>0){$.push("最近事件：");for(const ft of a.slice(-12))$.push(`  ${ft.t.toFixed(2)} ${ft.k} ${ft.d}`.trimEnd())}const at=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return $.push(`摇杆坐标源 ${at}${mt}`),$.push(`UA ${e.ua}`),$.join(`
`)}return{sample(D,k,V,B=0){o.frames++,k.stickHeld&&(k.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=V,V>o.dtMax&&(o.dtMax=V),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=D.time;const $=D.time;if(l<0&&(l=$),T=$,M=D.tick,!r)return;const at=D.character,mt=Math.hypot(k.stickX,k.stickY),ft=Math.hypot(at.velocity.x,at.velocity.z);u=D.combat.weapon;const pt=kg(D,k),et=at.facing,gt=Math.hypot(k.intents.moveX,k.intents.moveZ)>.05?Math.atan2(k.intents.moveX,k.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=V);const j=[kn($),D.tick,Math.round(V*10)/10,kn(k.stickX),kn(k.stickY),kn(k.stickRawX),kn(k.stickRawY),k.stickHeld?1:0,k.source.slice(0,8),kn(k.intents.moveX),kn(k.intents.moveZ),kn(at.position.x),kn(at.position.z),kn(at.velocity.x),kn(at.velocity.z),Qn(et),Qn(at.bodyYaw),pt,kn(at.stride),gt===null?"":Qn(gt),k.stickId===null?"":k.stickId,Math.round(k.stickOriginX),Math.round(k.stickOriginY),Math.round(k.stickPxX),Math.round(k.stickPxY),k.stickBad,Math.round(k.stickVpTop),Math.round(k.stickOriginSX),Math.round(k.stickOriginSY),Math.round(k.stickScreenX),Math.round(k.stickScreenY),k.stickScreenOk?1:0,Math.round(k.stickScale*100)/100];b(j);const H=$*1e3<x;if(V>t.spikeMs&&!H&&$-l>.6&&(o.spikes++,P("frameSpike",$,D.tick,V,`dt ${V.toFixed(0)}ms fl=${Ia(pt)}`,j)),h!==null&&!H){const Dt=Math.abs(Qn(Es(et-h))),Tt=Math.abs(Qn(Es(at.moveYaw-f))),C=(d|pt)&(dr|ur|fr|pr)|pt&Ns,A=gt===null?null:Math.abs(Qn(Es(et-gt))),Z=gt===null||h===null?null:Math.abs(Qn(Es(h-gt))),dt=A!==null&&Z!==null&&A<Z-.5,Q=(d&Ns)!==0&&(pt&Ns)===0&&gt===null,rt=A!==null&&(A<=12||dt);Dt>t.aimDropDeg&&Q?P("aimDrop",$,D.tick,0,`${Dt.toFixed(0)}° @aim→none stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Ia(pt)}`,j):Dt>t.dirJumpDeg&&C===0&&!Q&&(rt?(o.inTurns++,Dt>o.inTurnMax&&(o.inTurnMax=Dt)):P("dirJump",$,D.tick,0,`${Dt.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${Qn(h)}→${Qn(et)} in ${gt===null?".":Qn(gt)}° mvΔ${Tt.toFixed(0)}° aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Ia(d)}→${Ia(pt)}`,j))}const ot=(pt&(dr|ur|fr|pr))!==0,wt=D.tick-y<30;mt>.35&&ft<t.freezeSpeed&&!ot&&!wt?(m<0&&(m=$),$-m>=t.freezeMs/1e3&&$>=_&&(P("moveFreeze",$,D.tick,($-m)*1e3,`stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) v${ft.toFixed(2)} ${k.source} fl=${Ia(pt)}`,j),_=$+1.5,m=-1)):m=-1,k.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=$),$-g>=t.stickLostMs/1e3&&(P("stickLost",$,D.tick,($-g)*1e3,`raw(${k.stickRawX.toFixed(2)},${k.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ia(pt)}`,j),g=-1,p=0)):g=-1):(p=0,g=-1);const Ot=k.stickScale>.2&&k.stickScale<5?k.stickScale:1,Mt=k.stickScreenOk,Lt=Mt?k.stickScreenX/Ot:k.stickPxX,F=Mt?k.stickScreenY/Ot:k.stickPxY,le=Mt?k.stickOriginSX/Ot:k.stickOriginX,Wt=Mt?k.stickOriginSY/Ot:k.stickOriginY,Nt=Lt-le,Ct=F-Wt;if(k.stickHeld&&k.stickId!==null){const Dt=w;if(Dt&&Dt.held&&Dt.id===k.stickId){const Tt=Math.hypot(Dt.dx,Dt.dy),C=Math.hypot(Nt,Ct),A=Math.max(Tt,C),Z=Math.hypot(Lt-Dt.cx,F-Dt.cy),dt=Math.abs(Qn(Es(Math.atan2(Ct,Nt)-Math.atan2(Dt.dy,Dt.dx)))),Q=A*dt*Math.PI/180,rt=Math.hypot(le-Dt.ox,Wt-Dt.oy);if(A>18&&dt>35&&Z<Math.max(5,Q*.35)&&P("stickJump",$,D.tick,0,`Δ${dt.toFixed(0)}° 手指只动${Z.toFixed(0)}px(弧长应${Q.toFixed(0)}px) o(${Math.round(Dt.ox)},${Math.round(Dt.oy)})→(${Math.round(le)},${Math.round(Wt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(Lt)},${Math.round(F)}) raw(${Math.round(Nt)},${Math.round(Ct)}) id${k.stickId} ${Mt?"src=屏幕":"src=client"}`,j),Mt&&Dt.screenOk){const zt=Math.hypot(k.stickPxX-Dt.x,k.stickPxY-Dt.y),nt=Math.hypot((k.stickScreenX-Dt.sx)/Ot,(k.stickScreenY-Dt.sy)/Ot);S+=zt-nt,Math.abs(S)>20&&(P("stickDrift",$,D.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) screen(${Math.round(k.stickScreenX)},${Math.round(k.stickScreenY)})`,j),S=0)}}w={id:k.stickId,ox:le,oy:Wt,cx:Lt,cy:F,x:k.stickPxX,y:k.stickPxY,sx:k.stickScreenX,sy:k.stickScreenY,dx:Nt,dy:Ct,held:!0,screenOk:Mt}}else w=null,S=0;if(k.stickBad>E){const Dt=k.stickBad-E;P("stickBad",$,D.tick,0,`拦截 ${Dt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${k.stickBad}）o(${Math.round(k.stickOriginX)},${Math.round(k.stickOriginY)}) p(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) id${k.stickId??"-"}`,j)}E=k.stickBad,h=et,f=at.moveYaw,d=pt},event(D,k){const V=Ig(D);I(D),r&&(D.type==="dash-ready"||D.type==="combo-reset"||D.type==="stepUp"||z(D.type,V,k,D.tick))},gesture(D){const k=`${D.button}.${D.kind}`;o.gestures[k]=(o.gestures[k]??0)+1,r&&(D.kind==="longPress"||D.kind==="doubleTap"||D.kind==="drag"||D.kind==="cancel")&&z(`g:${D.kind}`,`${D.button} ${D.heldMs.toFixed(0)}ms d${D.distance.toFixed(0)}px ${D.angleDeg.toFixed(0)}°`,T,M)},suspend(D){x=T*1e3+D,m=-1,g=-1},setEnabled(D){r=D,D||(h=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const D of Object.keys(o.gestures))delete o.gestures[D]},status(){const D=o.simS,k=s.some(V=>D-V.t<8&&(V.kind==="dirJump"||V.kind==="aimDrop"||V.kind==="moveFreeze"||V.kind==="stickLost"||V.kind==="stickJump"||V.kind==="stickBad"||V.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:k,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Tg,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:N}}const Fg={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}]},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}]},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}]},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9}},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Ug={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Ng={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0}},Og={core:Fg,scene:Ug,view:Ng};function oh(n){return JSON.parse(JSON.stringify(n))}const rh=Og,Bg=oh(rh.core),mo=oh(rh.scene),dn=oh(rh.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class xi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),xi.nextNameID=xi.nextNameID||0,this.$name.id=`lil-gui-name-${++xi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Hg extends xi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function il(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Gg={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:il,toHexString:il},$s={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Vg={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=$s.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return $s.toHexString(a)}},Xg={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=$s.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return $s.toHexString(a)}},Wg=[Gg,$s,Vg,Xg];function Yg(n){return Wg.find(t=>t.match(n))}class $g extends xi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Yg(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=il(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class oc extends xi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Zg extends xi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,f;const d=5,u=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;f-=x*this._step*this._arrowKeyMultiplier(y),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class qg extends xi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class jg extends xi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Kg=`.lil-gui {
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
}`;function Jg(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let wd=!1;class mr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!wd&&r&&(Jg(Kg),wd=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new qg(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Zg(this,t,e,i,a,s);case"boolean":return new Hg(this,t,e);case"string":return new jg(this,t,e);case"function":return new oc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new $g(this,t,e,i)}addFolder(t){const e=new mr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof oc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof oc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function Qg(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new mr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new mr({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=vt=>{const Ft=s.addFolder(vt);return l.push(Ft),Ft},h=(vt,Ft)=>{const st=vt.addFolder(Ft);return r.push(st),st},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(u,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,w=h(u,"假人 AI");w.add(v,"moveSpeed",.5,8,.1).name("移动速度"),w.add(v,"wanderRadius",.5,8,.1).name("游走半径"),w.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),w.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),w.add(v,"keepDistance",1,10,.1).name("保持距离"),w.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),w.add(v,"attackRange",.5,5,.1).name("攻击距离"),w.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),w.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),E=h(S,"程序化步态");E.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),E.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),E.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),E.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),E.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),E.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),E.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),E.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),E.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),E.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),E.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),E.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),E.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),E.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),E.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),E.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(S,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const M=h(S,"停步惯性");M.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),M.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),M.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),M.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),M.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),M.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),M.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const P=h(S,"足部 IK"),z=t.ik;P.add(z,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),P.add(z,"weight",0,1,.01).name("钉地权重"),P.add(z,"attackScale",0,1,.01).name("攻击时权重倍率"),P.add(z,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const I=h(S,"惯性倾斜 / 盆骨"),N=t.lean;I.add(N,"accelGain",0,.1,.002).name("前后加速度增益"),I.add(N,"turnGain",0,.2,.005).name("绕圈侧倾增益"),I.add(N,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),I.add(N,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),I.add(N,"smoothing",1,30,1).name("倾斜平滑速率"),I.add(N,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),I.add(N,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),I.add(N,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),I.add(N,"crouchSmoothing",1,30,1).name("下沉平滑速率");const D=o.orientation,k=h(S,"朝向 / 下盘带转");k.add(D,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(D,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(D,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const V=o.gaze,B=h(S,"接敌注视 / 俯仰 (v9s.18)");B.add(V,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),B.add(V,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),B.add(V,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),B.add(V,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),B.add(V,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),B.add(V,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),B.add(V,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),B.add(V,"headPitchRate",.5,20,.5).name("头部俯仰速率"),B.add(V,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),B.add(V,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),B.add(V,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const $=h(S,"原地转身 / 停步偏差 (v9s)"),at=o.turnInPlace;$.add(at,"enabled").name("启用原地转身 (关=纯插值)"),$.add(at,"triggerDeg",20,180,5).name("触发夹角 (°)"),$.add(at,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),$.add(at,"settleDeg",0,60,1).name("转身保留余角 (°)"),$.add(at,"durationSec",.1,1.5,.02).name("转身时长 (s)"),$.add(at,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),$.add(at,"inputDeadZone",0,.5,.01).name("起步输入死区"),$.add(at,"armSec",0,.5,.01).name("触发防抖 (s)"),$.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),$.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),$.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),$.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),$.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),$.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),ft=o.combat,pt=h(mt,"连击 / 武器"),et=pt.add(n.combat,"weapon",ya).name("当前武器");pt.add(ft,"comboWindow",.1,2,.05).name("连击窗口 (s)"),pt.add(ft,"settle",0,.8,.01).name("段间停顿 (s)"),pt.add(ft,"attackMoveScale",0,1,.01).name("攻击时移动比例"),pt.add(ft,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),pt.add(ft,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),pt.add(ft,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),pt.add(ft,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),pt.add(ft,"cancelWindow",0,1,.01).name("取消窗口 (s)"),pt.add(ft,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),pt.add(ft,"autoCombo").name("按住自动连击"),pt.add(ft.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),pt.add(ft.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),pt.add(ft.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const K=h(mt,"夸张化 (v9s.22)"),gt=t.animation.stretch;K.add(gt,"enabled").name("四肢伸缩 开"),K.add(gt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),K.add(gt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),K.add(gt,"impactSquash",0,.5,.01).name("命中挤压量"),K.add(gt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),K.add(gt,"torsoGain",0,1,.05).name("躯干跟随比例"),K.add(gt,"volumeExp",0,1.5,.05).name("体积补偿指数");const j=t.animation.swing;K.add(j,"enabled").name("挥击身体幅度 开"),K.add(j,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),K.add(j,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),K.add(j,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),K.add(j,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),K.add(j,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),K.add(j,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),K.add(j,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),K.add(j.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const H=t.weaponTrail;K.add(H,"enabled").name("挥击刀光 开"),K.add(H,"life",.04,.4,.01).name("刀光残留 (s)"),K.add(H,"intensity",0,1.5,.05).name("刀光亮度"),K.add(H,"minStep",.005,.1,.005).name("采样最小位移 (m)"),K.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),K.add(t.hitstop,"enabled").name("命中定格 开"),K.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const ot=t.weaponWrist;K.add(ot,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),K.add(ot,"lag",0,.08,.002).name("臂速 → 腕滞后"),K.add(ot,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),K.add(ot,"rate",4,50,1).name("腕部跟随速率 (1/s)"),K.add(ot,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),K.add(ot,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const wt=t.weaponMount;K.add(wt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),K.add(wt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),K.add(wt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),K.add(wt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),K.add(wt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),K.add(wt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),pt.add(ft.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),pt.add(ft.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),pt.add(ft.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),pt.add(ft.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),pt.add(ft.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),pt.add(ft.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),pt.add(ft.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),pt.add(ft.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),pt.add(ft.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),pt.add(ft.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Ot=o.abilities;pt.add(Ot.arcane,"perWave",1,8,1).name("每波飞弹数"),pt.add(Ot.arcane,"waves",1,12,1).name("每次引导波数"),pt.add(Ot.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),pt.add(Ot.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),pt.add(Ot.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),pt.add(Ot.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),pt.add(Ot.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),pt.add(Ot.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),pt.add(Ot.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),pt.add(Ot.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),pt.add(Ot.arcane,"speed",3,24,.5).name("飞弹速度"),pt.add(Ot.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),pt.add(Ot.ring,"radius",.5,5,.1).name("电环半径"),pt.add(Ot.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),pt.add(Ot.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const Mt=h(mt,"攻击动作 / 跨步 / 落地");Mt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),Mt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),Mt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const Lt=t.animation.stride;Mt.add(Lt,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),Mt.add(Lt,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),Mt.add(Lt,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),Mt.add(Lt,"cycles",1,3,1).name("每段跨步周期数"),Mt.add(Lt,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),Mt.add(Lt,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),Mt.add(Lt,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),Mt.add(Lt,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),Mt.add(Lt,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),Mt.add(Lt,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),Mt.add(Lt,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),Mt.add(Lt,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),Mt.add(Lt,"heavyScale",0,1,.01).name("大剑重击收敛系数"),Mt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),Mt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),Mt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),Mt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),Mt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),Mt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),Mt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),Mt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),Mt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),Mt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),Mt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),Mt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const F=h(mt,"武器握持");F.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),F.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),F.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),F.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const le=o.hits,Wt=h(mt,"命中 / 受击 / 击退");Wt.add(le,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Wt.add(le,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Wt.add(le,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Wt.add(le,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Wt.add(le.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Wt.add(le.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Wt.add(le,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Wt.add(le,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Nt=o.targeting,Ct=h(mt,"目标辅助");Ct.add(Nt,"targetAssist").name("启用目标辅助"),Ct.add(Nt,"range",1,14,.5).name("锁定范围 (m)"),Ct.add(Nt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ct.add(Nt,"frontBias",0,4,.1).name("朝向加权"),Ct.add(Nt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ct.add(Nt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Dt=h(mt,"受击分层"),Tt=t.hurt;Dt.add(Tt,"enabled").name("启用分层受击 (关=旧版对照)"),Dt.add(Tt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Dt.add(Tt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Dt.add(Tt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Dt.add(Tt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Dt.add(Tt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Dt.add(Tt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Dt.add(Tt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Dt.add(Tt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Dt.add(Tt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Dt.add(Tt,"leanLight",0,1.5,.01).name("轻击力度"),Dt.add(Tt,"leanHeavy",0,1.5,.01).name("重击力度"),Dt.add(Tt,"leanKnock",0,1.5,.01).name("击退力度"),Dt.add(Tt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Tt.abdomen},{name:"打肩 (shoulder)",p:Tt.shoulder}].map(({name:vt,p:Ft})=>{const st=h(Dt,vt);return st.add(Ft,"upperPitch",0,2,.01).name("上身前后倾斜"),st.add(Ft,"upperRoll",0,2,.01).name("上身侧倾"),st.add(Ft,"upperYaw",0,1.5,.01).name("肩部扭转"),st.add(Ft,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),st.add(Ft,"shift",0,.8,.01).name("身体反应位移"),st.add(Ft,"drop",0,.4,.01).name("整体下沉"),st.add(Ft,"back",0,.4,.01).name("屁股向后"),st.add(Ft,"knee",0,1.6,.01).name("屈膝"),st.add(Ft,"hip",0,1,.01).name("髋前倾"),st.add(Ft,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),st});const C=h(mt,"派生招"),A=o.links;C.add(A,"enabled").name("总开关 (false=旧连击)"),C.add(A.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),C.add(A.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),C.add(A.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),C.add(A,"sharedCooldown",0,3,.05).name("共享 CD (s)"),C.add(A,"triggerWhileSprinting").name("长跑中可直接触发"),C.add(A.search,"range",1,14,.1).name("索敌距离 (m)"),C.add(A.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),C.add(A.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Z=A.moves["sword-shield"];Z&&(C.add(Z,"enabled").name("剑盾盾击"),C.add(Z,"distance",0,8,.1).name("冲锋极限 (m)"),C.add(Z,"windup",0,.5,.01).name("前摇 (s)"),C.add(Z,"active",0,.8,.01).name("冲锋 / 命中 (s)"),C.add(Z,"recovery",0,.8,.01).name("收势 (s)"),C.add(Z.hit,"radius",0,4,.05).name("命中半径 (m)"),C.add(Z.hit,"width",0,2,.05).name("扫掠半径 (m)"),C.add(Z.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),C.add(Z.hit,"duration",0,1.5,.01).name("僵直 (s)")),C.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const dt=c("相机"),Q=h(dt,"基础");Q.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Q.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Q.add(t.camera,"distance",6,35,.5).name("距离"),Q.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Q.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,zt=h(dt,"智能构图");zt.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),zt.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),zt.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),zt.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),zt.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),zt.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),zt.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),zt.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),zt.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),zt.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),zt.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const nt=h(dt,"缩放");return nt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),nt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),nt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),nt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),nt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),nt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),nt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),nt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(vt=>vt.close()),l.forEach(vt=>vt.close()),s.close(),{gui:s,refreshWeapon:()=>et.updateDisplay()}}function tx(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function ex(n,t){return n.find(e=>e.id===t)??null}function Ed(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function nx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return tx(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):y&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(y=>y.index===g)??null:ex(n,g);return p?(B0(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function _(){wf(t)}if(s){s.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),s.appendChild(g);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const E=document.createElement("span");E.className="lab-name",E.textContent=v.name,w.append(S,E),w.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",g=>{var p,y;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const x=Ed(n,((p=d())==null?void 0:p.id)??o,-1);x&&m(x.id)}else if(g.key==="]"){const x=Ed(n,((y=d())==null?void 0:y.id)??o,1);x&&m(x.id)}else g.key==="\\"&&_()}),u(),{goto:m,current:d,tick:u,recall:_,element:s}}const rc=Math.PI*2,fi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},ix=45,ax=50;function sx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Ts(n,t,e){const i=sx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function ox(n,t){return Math.atan2(n,-t)*180/Math.PI}function Td(n,t){return Math.abs(((n-t)%360+540)%360-180)}function go(n){return(n%360+360)%360}const rx={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function cx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Ts(s.moveX,s.moveZ,e):null,f=c>.15?Ts(l.x,l.z,e):null,d=Ts(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Ts(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?Ts(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?Td(h,f):null,p=h!==null?Td(h,d):null,y=g!==null&&g>ix&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?ox(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:y}}function Ad(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>ax&&(n.inLen>=.35||n.speed>=.4)}const Rd="harness.dirDebug";function lx(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Rd)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Rd,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=rx,m=0,_="",g=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,E=w/2,T=Math.min(v,w)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,E,T,0,rc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":fi.ring,r.stroke(),r.strokeStyle=fi.grid,r.beginPath(),r.moveTo(S-T,E),r.lineTo(S+T,E),r.moveTo(S,E-T),r.lineTo(S,E+T),r.stroke();for(let z=0;z<8;z++){const I=z*Math.PI/4,N=S+Math.sin(I)*(T-3),D=E-Math.cos(I)*(T-3),k=S+Math.sin(I)*T,V=E-Math.cos(I)*T;r.beginPath(),r.moveTo(N,D),r.lineTo(k,V),r.stroke()}const M=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;M>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=fi.dead,r.beginPath(),r.arc(S,E,T*M,0,rc),r.stroke(),r.restore());const b=(z,I,N,D,k=!1,V=1)=>{const B=z*Math.PI/180,$=Math.sin(B),at=-Math.cos(B),mt=T*Math.max(.14,Math.min(1,I)),ft=S+$*T*.14,pt=E+at*T*.14,et=S+$*mt,K=E+at*mt;if(r.save(),r.globalAlpha=V,r.strokeStyle=N,r.fillStyle=N,r.lineWidth=D,r.lineCap="round",k&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(ft,pt),r.lineTo(et,K),r.stroke(),!k&&mt>T*.3){const gt=-at,j=$,H=5.2;r.beginPath(),r.moveTo(et+$*1.5,K+at*1.5),r.lineTo(et-$*H+gt*H*.72,K-at*H+j*H*.72),r.lineTo(et-$*H-gt*H*.72,K-at*H-j*H*.72),r.closePath(),r.fill()}r.restore()},P=(z,I)=>{const N=z*Math.PI/180,D=Math.sin(N),k=-Math.cos(N),V=-k,B=D,$=T+1.5,at=$+6.5;r.save(),r.fillStyle=I,r.strokeStyle=I,r.lineWidth=1,r.beginPath(),r.moveTo(S+D*at,E+k*at),r.lineTo(S+D*$+V*4,E+k*$+B*4),r.lineTo(S+D*$-V*4,E+k*$-B*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&b(x.lockDeg,1,fi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&b(x.rawDeg,x.rawLen,fi.raw,1,!0,.9),x.aimDeg!==null&&b(x.aimDeg,1,fi.aim,1.6,!0,.95),b(x.faceDeg,1,fi.face,1.1,!0,.55),x.moveDeg!==null&&b(x.moveDeg,x.speed/Math.max(1,g),fi.move,5.5,!1,.8),x.inDeg!==null&&b(x.inDeg,x.inLen,fi.input,2.2),P(x.faceDeg,fi.face),r.beginPath(),r.arc(S,E,2.2,0,rc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=T=>T===null?"-":String(Math.round(go(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Ad(x,v))}return{update(x,v,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=cx(x,v,w,g);u=S;const E=x.combat.phase!=="idle";p(S);const T=performance.now(),M=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-m>90||M!==_)&&(m=T,_=M,y(S,E),e.dataset.in=S.inDeg===null?"":go(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":go(S.moveDeg).toFixed(1),e.dataset.fc=go(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Ad(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const hx=6,dx=480,Pd=240,Cd=92,ux=18;function fx(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function px(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function mx(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function gx(n={}){const t=Math.max(1,n.windowS??hx),e=Math.max(60,n.capacity??dx),i=Math.max(1,n.speedCap??ux),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Pd*u),l.height=Math.round(Cd*u);const m=lx({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function g(T){_=T,s.classList.toggle("is-off",!T),!a&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!_)}));const p=[];let y=0,x=null,v=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(T){const M=T-t;let b=0;for(;b<p.length&&p[b].t<M;)b++;return p.slice(b)}function E(T,M){if(!d)return;const b=Pd,P=Cd;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,b,P),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,b,P);const z=4,I=4,N=b-z-I,D=9,k=46,V=62,B=22,$=M-t,at=j=>z+Math.max(0,Math.min(1,(j-$)/t))*N;for(let j=0;j<T.length;j++){if(!T[j].busy)continue;const H=at(T[j].t),ot=j+1<T.length?at(T[j+1].t):H+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(H,D,Math.max(2,ot-H),k)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const j of[D,D+k/2,D+k])d.moveTo(z,j),d.lineTo(b-I,j);d.moveTo(z,V+B/2),d.lineTo(b-I,V+B/2),d.stroke();const ft=Math.max(1,...T.map(j=>j.speed),...T.map(j=>j.drive))*1.15,pt=j=>D+k-j/ft*k;if(T.length>1){d.beginPath(),d.moveTo(at(T[0].t),pt(T[0].speed));for(let j=1;j<T.length;j++)d.lineTo(at(T[j].t),pt(T[j].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(at(T[T.length-1].t),D+k),d.lineTo(at(T[0].t),D+k),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(at(T[0].t),pt(T[0].drive));for(let j=1;j<T.length;j++)d.lineTo(at(T[j].t),pt(T[j].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let et=.02;for(const j of T)et=Math.max(et,Math.abs(j.dv));et*=1.1;const K=V+B/2,gt=B/2;for(const j of T){const H=Math.min(gt,Math.abs(j.dv)/et*gt);d.fillStyle=j.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(at(j.t)-.7,j.dv>=0?K-H:K,1.4,Math.max(.5,H))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(ft.toFixed(1),z+2,D+8),d.fillText("v",z+2,D+k-2),d.fillText("Δv",z+2,V+9),d.textAlign="right",d.fillText("0",b-I-2,D+k-2),d.textAlign="left"}return{dirDebug:m,update(T,M,b){const P=performance.now()/1e3,z=v<0?1/60:Math.max(1e-4,Math.min(.25,P-v));v=P;const I=T.character,N={x:I.position.x,z:I.position.z},D=Math.hypot(I.velocity.x,I.velocity.z),{speed:k,raw:V}=x?px(x,N,z,i):{speed:0,raw:0},B=fx(y,k,z,P);B.drive=D,B.raw=V,B.busy=mx(T),x=N,y=k,p.push(B),p.length>e&&p.shift();const $=S(P);let at=0;for(const mt of $)at=Math.max(at,mt.speed);if(w={speed:k,drive:D,raw:V,dv:B.dv,accel:B.accel,peak:at,samples:$.length,windowS:t,busy:B.busy},m.update(T,M,b),_){E($,P);const mt=B.dv>=0?"+":"";c.textContent=`v ${k.toFixed(2)} · 驱 ${D.toFixed(2)} · 峰 ${at.toFixed(2)} · Δv ${mt}${B.dv.toFixed(3)} · ${$.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(T=>({...T}))}}const xx=["剑盾","双剑","大剑","法杖","弓"],vx={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function yx(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=Mt=>Mt.toFixed(2),m=Mt=>(Mt*180/Math.PI).toFixed(0),_=xx[ya.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${u(y.cooldown)}`,w=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(E)+1e-6,M=Math.round(Math.abs(E)/T*100),b=`strafe ${M}%${S<-.05?" back":""}`,P=t.camera,z=`threat ${(P.threat*100).toFixed(0)}%  dist×${u(P.distanceScale)}  off (${u(P.offsetX)},${u(P.offsetZ)})  pitch +${u(P.pitchDelta)}°  n=${P.threatCount}`,I=o?u(o.attackBlend):"-",N=o==null?void 0:o.attackWeights,D=N?`gw ${u(N.gaitScale)}  lw ${u(N.attackLegWeight)}  spd ${u(N.driveSpeed)}`:"-",k=N?`${u(N.gaitScale)}/${u(N.attackLegWeight)}`:"-",V=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",$=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",at=o==null?void 0:o.hurt,mt=at?`hurt ${t.playerHurt.type}  部位h${u(at.hitHeight)}  脉冲p${u(at.pulse)}  上身${u(at.upperShift)}  重心${u(at.comShift)}  后坐${u(at.pelvisBack)}  屈膝${u(at.knee)}`:"-",ft=at?`${u(at.hitHeight)}/${u(at.pulse)}/${u(at.knee)}`:"-",pt=o==null?void 0:o.ik,et=pt?`${pt.active?"on":"off"} w${u(pt.weight)} e${u(pt.maxError)}`:"-",K=t.playerLink,gt=`link ${K.kind||"-"}  ${K.phase}  prog ${u(K.progress)}  win ${u(K.linkWindow)}s  cd ${u(K.cooldown)}s  hits ${K.hitIds.length}  travel ${u(K.travelled)}/${u(K.travel)}m  id ${K.id}`,j=`${K.phase}/${K.kind||"-"}/w${u(K.linkWindow)}`,H=a.lastGesture,ot=H?`${H.button} ${H.kind} ${H.heldMs.toFixed(0)}ms d${H.distance.toFixed(0)}px ${H.angleDeg.toFixed(0)}° taps${H.taps}`:"-",wt=t.dummies.map(Mt=>`${Mt.id}:${vx[Mt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${K.phase}${K.kind?`/${K.kind}`:""} w${u(K.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${M}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${I}  gw/lw ${k}  land ${B}  ik ${et}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${ft}`,`dummies ${wt}  atkCount ${t.dummyAttackCount}  cam ${(P.threat*100).toFixed(0)}% ×${u(P.distanceScale)}  ${$}  lk ${j}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${ot}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${I}   ${D}   land ${V}`,mt,`ik ${et}  clamped ${pt?pt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${b}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${u(y.cooldown)}s  id ${y.id}  from (${u(y.fromX)},${u(y.fromZ)}) → to (${u(y.toX)},${u(y.toZ)})`,gt,`camera ${z}  ${$}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${wt}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${ot}`].join(`
`)}}}const xo=["lab","hud","motion","debug"],Ld={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Dd={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function _x(n){var l;const t=Object.fromEntries(xo.map(c=>[c,document.getElementById(Dd[c].toggle)])),e=Object.fromEntries(xo.map(c=>[c,document.getElementById(Dd[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of xo){const u=a===d,m=t[d],_=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${Ld[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${Ld[d].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of xo)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ch="170",Mx=0,kd=1,bx=2,Df=1,kf=2,Pi=3,Ki=0,In=1,Ye=2,qi=0,as=1,Xi=2,Id=3,zd=4,Sx=5,pa=100,wx=101,Ex=102,Tx=103,Ax=104,Rx=200,Px=201,Cx=202,Lx=203,al=204,sl=205,Dx=206,kx=207,Ix=208,zx=209,Fx=210,Ux=211,Nx=212,Ox=213,Bx=214,ol=0,rl=1,cl=2,hs=3,ll=4,hl=5,dl=6,ul=7,lh=0,Hx=1,Gx=2,ji=0,Vx=1,Xx=2,Wx=3,Yx=4,$x=5,Zx=6,qx=7,If=300,ds=301,us=302,fl=303,pl=304,Ar=306,ml=1e3,ga=1001,gl=1002,si=1003,jx=1004,vo=1005,gi=1006,cc=1007,xa=1008,Ii=1009,zf=1010,Ff=1011,Zs=1012,hh=1013,_a=1014,Li=1015,no=1016,dh=1017,uh=1018,fs=1020,Uf=35902,Nf=1021,Of=1022,ai=1023,Bf=1024,Hf=1025,ss=1026,ps=1027,Gf=1028,fh=1029,Vf=1030,ph=1031,mh=1033,Qo=33776,tr=33777,er=33778,nr=33779,xl=35840,vl=35841,yl=35842,_l=35843,Ml=36196,bl=37492,Sl=37496,wl=37808,El=37809,Tl=37810,Al=37811,Rl=37812,Pl=37813,Cl=37814,Ll=37815,Dl=37816,kl=37817,Il=37818,zl=37819,Fl=37820,Ul=37821,ir=36492,Nl=36494,Ol=36495,Xf=36283,Bl=36284,Hl=36285,Gl=36286,Kx=3200,Jx=3201,Wf=0,Qx=1,Wi="",Pn="srgb",gs="srgb-linear",Rr="linear",Fe="srgb",za=7680,Fd=519,tv=512,ev=513,nv=514,Yf=515,iv=516,av=517,sv=518,ov=519,Vl=35044,Ud=35048,Nd="300 es",Di=2e3,gr=2001;class xs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const yn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Od=1234567;const os=Math.PI/180,qs=180/Math.PI;function vi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(yn[n&255]+yn[n>>8&255]+yn[n>>16&255]+yn[n>>24&255]+"-"+yn[t&255]+yn[t>>8&255]+"-"+yn[t>>16&15|64]+yn[t>>24&255]+"-"+yn[e&63|128]+yn[e>>8&255]+"-"+yn[e>>16&255]+yn[e>>24&255]+yn[i&255]+yn[i>>8&255]+yn[i>>16&255]+yn[i>>24&255]).toLowerCase()}function pn(n,t,e){return Math.max(t,Math.min(e,n))}function gh(n,t){return(n%t+t)%t}function rv(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function cv(n,t,e){return n!==t?(e-n)/(t-n):0}function Os(n,t,e){return(1-e)*n+e*t}function lv(n,t,e,i){return Os(n,t,1-Math.exp(-e*i))}function hv(n,t=1){return t-Math.abs(gh(n,t*2)-t)}function dv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function uv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function fv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function pv(n,t){return n+Math.random()*(t-n)}function mv(n){return n*(.5-Math.random())}function gv(n){n!==void 0&&(Od=n);let t=Od+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xv(n){return n*os}function vv(n){return n*qs}function yv(n){return(n&n-1)===0&&n!==0}function _v(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Mv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function bv(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function ii(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ie(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Bd={DEG2RAD:os,RAD2DEG:qs,generateUUID:vi,clamp:pn,euclideanModulo:gh,mapLinear:rv,inverseLerp:cv,lerp:Os,damp:lv,pingpong:hv,smoothstep:dv,smootherstep:uv,randInt:fv,randFloat:pv,randFloatSpread:mv,seededRandom:gv,degToRad:xv,radToDeg:vv,isPowerOfTwo:yv,ceilPowerOfTwo:_v,floorPowerOfTwo:Mv,setQuaternionFromProperEuler:bv,normalize:Ie,denormalize:ii};class $t{constructor(t=0,e=0){$t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pe{constructor(t,e,i,a,s,o,r,l,c){pe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],_=a[0],g=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*v+l*E,s[1]=c*_+h*y+f*w,s[4]=c*g+h*x+f*S,s[7]=c*p+h*v+f*E,s[2]=d*_+u*y+m*w,s[5]=d*g+u*x+m*S,s[8]=d*p+u*v+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,m=e*f+i*d+a*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=f*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=u*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(lc.makeScale(t,e)),this}rotate(t){return this.premultiply(lc.makeRotation(-t)),this}translate(t,e){return this.premultiply(lc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const lc=new pe;function $f(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function xr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Sv(){const n=xr("canvas");return n.style.display="block",n}const Hd={};function zs(n){n in Hd||(Hd[n]=!0,console.warn(n))}function wv(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Ev(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Tv(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const we={enabled:!0,workingColorSpace:gs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Fe&&(n.r=ki(n.r),n.g=ki(n.g),n.b=ki(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Fe&&(n.r=rs(n.r),n.g=rs(n.g),n.b=rs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Wi?Rr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ki(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function rs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Gd=[.64,.33,.3,.6,.15,.06],Vd=[.2126,.7152,.0722],Xd=[.3127,.329],Wd=new pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yd=new pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);we.define({[gs]:{primaries:Gd,whitePoint:Xd,transfer:Rr,toXYZ:Wd,fromXYZ:Yd,luminanceCoefficients:Vd,workingColorSpaceConfig:{unpackColorSpace:Pn},outputColorSpaceConfig:{drawingBufferColorSpace:Pn}},[Pn]:{primaries:Gd,whitePoint:Xd,transfer:Fe,toXYZ:Wd,fromXYZ:Yd,luminanceCoefficients:Vd,outputColorSpaceConfig:{drawingBufferColorSpace:Pn}}});let Fa;class Av{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Fa===void 0&&(Fa=xr("canvas")),Fa.width=t.width,Fa.height=t.height;const i=Fa.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Fa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=xr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=ki(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ki(e[i]/255)*255):e[i]=ki(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Rv=0;class Zf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Rv++}),this.uuid=vi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(hc(a[o].image)):s.push(hc(a[o]))}else s=hc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function hc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Av.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Pv=0;class Ln extends xs{constructor(t=Ln.DEFAULT_IMAGE,e=Ln.DEFAULT_MAPPING,i=ga,a=ga,s=gi,o=xa,r=ai,l=Ii,c=Ln.DEFAULT_ANISOTROPY,h=Wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pv++}),this.uuid=vi(),this.name="",this.source=new Zf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new $t(0,0),this.repeat=new $t(1,1),this.center=new $t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==If)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ml:t.x=t.x-Math.floor(t.x);break;case ga:t.x=t.x<0?0:1;break;case gl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ml:t.y=t.y-Math.floor(t.y);break;case ga:t.y=t.y<0?0:1;break;case gl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=If;Ln.DEFAULT_ANISOTROPY=1;class Je{constructor(t=0,e=0,i=0,a=1){Je.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(u+1)/2,w=(p+1)/2,S=(h+d)/4,E=(f+_)/4,T=(m+g)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=T/s),this.set(i,a,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(f-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cv extends xs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Je(0,0,t,e),this.scissorTest=!1,this.viewport=new Je(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Ln(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ma extends Cv{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class qf extends Ln{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=si,this.minFilter=si,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lv extends Ln{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=si,this.minFilter=si,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class io{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=_;return}if(f!==_||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*g+d*v,c=c*g+u*v,h=h*g+m*v,f=f*g+_*v,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],m=s[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(pn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion($d.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion($d.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return dc.copy(this).projectOnVector(t),this.sub(dc)}reflect(t){return this.sub(dc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const dc=new G,$d=new io;class ao{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ti.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ti.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ti.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ti):ti.fromBufferAttribute(s,o),ti.applyMatrix4(t.matrixWorld),this.expandByPoint(ti);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),yo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),yo.copy(i.boundingBox)),yo.applyMatrix4(t.matrixWorld),this.union(yo)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ti),ti.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(As),_o.subVectors(this.max,As),Ua.subVectors(t.a,As),Na.subVectors(t.b,As),Oa.subVectors(t.c,As),Ni.subVectors(Na,Ua),Oi.subVectors(Oa,Na),na.subVectors(Ua,Oa);let e=[0,-Ni.z,Ni.y,0,-Oi.z,Oi.y,0,-na.z,na.y,Ni.z,0,-Ni.x,Oi.z,0,-Oi.x,na.z,0,-na.x,-Ni.y,Ni.x,0,-Oi.y,Oi.x,0,-na.y,na.x,0];return!uc(e,Ua,Na,Oa,_o)||(e=[1,0,0,0,1,0,0,0,1],!uc(e,Ua,Na,Oa,_o))?!1:(Mo.crossVectors(Ni,Oi),e=[Mo.x,Mo.y,Mo.z],uc(e,Ua,Na,Oa,_o))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ti).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ti).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Si),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Si=[new G,new G,new G,new G,new G,new G,new G,new G],ti=new G,yo=new ao,Ua=new G,Na=new G,Oa=new G,Ni=new G,Oi=new G,na=new G,As=new G,_o=new G,Mo=new G,ia=new G;function uc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ia.fromArray(n,s);const r=a.x*Math.abs(ia.x)+a.y*Math.abs(ia.y)+a.z*Math.abs(ia.z),l=t.dot(ia),c=e.dot(ia),h=i.dot(ia);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Dv=new ao,Rs=new G,fc=new G;class Pr{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Dv.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rs.subVectors(t,this.center);const e=Rs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Rs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rs.copy(t.center).add(fc)),this.expandByPoint(Rs.copy(t.center).sub(fc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wi=new G,pc=new G,bo=new G,Bi=new G,mc=new G,So=new G,gc=new G;class xh{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=wi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wi.copy(this.origin).addScaledVector(this.direction,e),wi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){pc.copy(t).add(e).multiplyScalar(.5),bo.copy(e).sub(t).normalize(),Bi.copy(this.origin).sub(pc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(bo),r=Bi.dot(this.direction),l=-Bi.dot(bo),c=Bi.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=s*h,f>=0)if(d>=-m)if(d<=m){const _=1/h;f*=_,d*=_,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(pc).addScaledVector(bo,d),u}intersectSphere(t,e){wi.subVectors(t.center,this.origin);const i=wi.dot(this.direction),a=wi.dot(wi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,wi)!==null}intersectTriangle(t,e,i,a,s){mc.subVectors(e,t),So.subVectors(i,t),gc.crossVectors(mc,So);let o=this.direction.dot(gc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Bi.subVectors(this.origin,t);const l=r*this.direction.dot(So.crossVectors(Bi,So));if(l<0)return null;const c=r*this.direction.dot(mc.cross(Bi));if(c<0||l+c>o)return null;const h=-r*Bi.dot(gc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oe{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g){Oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Ba.setFromMatrixColumn(t,0).length(),s=1/Ba.setFromMatrixColumn(t,1).length(),o=1/Ba.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,_=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,_=c*f;e[0]=d+_*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,_=c*f;e[0]=d-_*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,_=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+_,e[1]=l*f,e[5]=_*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=_-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-_*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+_,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=_*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(kv,t,Iv)}lookAt(t,e,i){const a=this.elements;return Bn.subVectors(t,e),Bn.lengthSq()===0&&(Bn.z=1),Bn.normalize(),Hi.crossVectors(i,Bn),Hi.lengthSq()===0&&(Math.abs(i.z)===1?Bn.x+=1e-4:Bn.z+=1e-4,Bn.normalize(),Hi.crossVectors(i,Bn)),Hi.normalize(),wo.crossVectors(Bn,Hi),a[0]=Hi.x,a[4]=wo.x,a[8]=Bn.x,a[1]=Hi.y,a[5]=wo.y,a[9]=Bn.y,a[2]=Hi.z,a[6]=wo.z,a[10]=Bn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],_=i[6],g=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],E=a[4],T=a[8],M=a[12],b=a[1],P=a[5],z=a[9],I=a[13],N=a[2],D=a[6],k=a[10],V=a[14],B=a[3],$=a[7],at=a[11],mt=a[15];return s[0]=o*S+r*b+l*N+c*B,s[4]=o*E+r*P+l*D+c*$,s[8]=o*T+r*z+l*k+c*at,s[12]=o*M+r*I+l*V+c*mt,s[1]=h*S+f*b+d*N+u*B,s[5]=h*E+f*P+d*D+u*$,s[9]=h*T+f*z+d*k+u*at,s[13]=h*M+f*I+d*V+u*mt,s[2]=m*S+_*b+g*N+p*B,s[6]=m*E+_*P+g*D+p*$,s[10]=m*T+_*z+g*k+p*at,s[14]=m*M+_*I+g*V+p*mt,s[3]=y*S+x*b+v*N+w*B,s[7]=y*E+x*P+v*D+w*$,s[11]=y*T+x*z+v*k+w*at,s[15]=y*M+x*I+v*V+w*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+_*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+g*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],_=t[13],g=t[14],p=t[15],y=f*g*c-_*d*c+_*l*u-r*g*u-f*l*p+r*d*p,x=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,v=h*_*c-m*f*c+m*r*u-o*_*u-h*r*p+o*f*p,w=m*f*l-h*_*l-m*r*d+o*_*d+h*r*g-o*f*g,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=y*E,t[1]=(_*d*s-f*g*s-_*a*u+i*g*u+f*a*p-i*d*p)*E,t[2]=(r*g*s-_*l*s+_*a*c-i*g*c-r*a*p+i*l*p)*E,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*E,t[4]=x*E,t[5]=(h*g*s-m*d*s+m*a*u-e*g*u-h*a*p+e*d*p)*E,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*E,t[8]=v*E,t[9]=(m*f*s-h*_*s-m*i*u+e*_*u+h*i*p-e*f*p)*E,t[10]=(o*_*s-m*r*s+m*i*c-e*_*c-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*E,t[12]=w*E,t[13]=(h*_*a-m*f*a+m*i*d-e*_*d-h*i*g+e*f*g)*E,t[14]=(m*r*a-o*_*a-m*i*l+e*_*l+o*i*g-e*r*g)*E,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,m=s*f,_=o*h,g=o*f,p=r*f,y=l*c,x=l*h,v=l*f,w=i.x,S=i.y,E=i.z;return a[0]=(1-(_+p))*w,a[1]=(u+v)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(u-v)*S,a[5]=(1-(d+p))*S,a[6]=(g+y)*S,a[7]=0,a[8]=(m+x)*E,a[9]=(g-y)*E,a[10]=(1-(d+_))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Ba.set(a[0],a[1],a[2]).length();const o=Ba.set(a[4],a[5],a[6]).length(),r=Ba.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ei.copy(this);const c=1/s,h=1/o,f=1/r;return ei.elements[0]*=c,ei.elements[1]*=c,ei.elements[2]*=c,ei.elements[4]*=h,ei.elements[5]*=h,ei.elements[6]*=h,ei.elements[8]*=f,ei.elements[9]*=f,ei.elements[10]*=f,e.setFromRotationMatrix(ei),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Di){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,m;if(r===Di)u=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===gr)u=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Di){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let m,_;if(r===Di)m=(o+s)*f,_=-2*f;else if(r===gr)m=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ba=new G,ei=new Oe,kv=new G(0,0,0),Iv=new G(1,1,1),Hi=new G,wo=new G,Bn=new G,Zd=new Oe,qd=new io;class yi{constructor(t=0,e=0,i=0,a=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(pn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-pn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(pn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-pn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Zd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Zd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return qd.setFromEuler(this),this.setFromQuaternion(qd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class vh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let zv=0;const jd=new G,Ha=new io,Ei=new Oe,Eo=new G,Ps=new G,Fv=new G,Uv=new io,Kd=new G(1,0,0),Jd=new G(0,1,0),Qd=new G(0,0,1),tu={type:"added"},Nv={type:"removed"},Ga={type:"childadded",child:null},xc={type:"childremoved",child:null};class Ze extends xs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zv++}),this.uuid=vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const t=new G,e=new yi,i=new io,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Oe},normalMatrix:{value:new pe}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ha.setFromAxisAngle(t,e),this.quaternion.multiply(Ha),this}rotateOnWorldAxis(t,e){return Ha.setFromAxisAngle(t,e),this.quaternion.premultiply(Ha),this}rotateX(t){return this.rotateOnAxis(Kd,t)}rotateY(t){return this.rotateOnAxis(Jd,t)}rotateZ(t){return this.rotateOnAxis(Qd,t)}translateOnAxis(t,e){return jd.copy(t).applyQuaternion(this.quaternion),this.position.add(jd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Kd,t)}translateY(t){return this.translateOnAxis(Jd,t)}translateZ(t){return this.translateOnAxis(Qd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Eo.copy(t):Eo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Ps,Eo,this.up):Ei.lookAt(Eo,Ps,this.up),this.quaternion.setFromRotationMatrix(Ei),a&&(Ei.extractRotation(a.matrixWorld),Ha.setFromRotationMatrix(Ei),this.quaternion.premultiply(Ha.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(tu),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nv),xc.child=t,this.dispatchEvent(xc),xc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ei.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ei),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(tu),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,t,Fv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,Uv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ze.DEFAULT_UP=new G(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ni=new G,Ti=new G,vc=new G,Ai=new G,Va=new G,Xa=new G,eu=new G,yc=new G,_c=new G,Mc=new G,bc=new Je,Sc=new Je,wc=new Je;class Xn{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),ni.subVectors(t,e),a.cross(ni);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){ni.subVectors(a,e),Ti.subVectors(i,e),vc.subVectors(t,e);const o=ni.dot(ni),r=ni.dot(Ti),l=ni.dot(vc),c=Ti.dot(Ti),h=Ti.dot(vc),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-u-m,m,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(r,Ai.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return bc.setScalar(0),Sc.setScalar(0),wc.setScalar(0),bc.fromBufferAttribute(t,e),Sc.fromBufferAttribute(t,i),wc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(bc,s.x),o.addScaledVector(Sc,s.y),o.addScaledVector(wc,s.z),o}static isFrontFacing(t,e,i,a){return ni.subVectors(i,e),Ti.subVectors(t,e),ni.cross(Ti).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ni.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),ni.cross(Ti).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Xn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Xn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Xn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Xn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Xn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Va.subVectors(a,i),Xa.subVectors(s,i),yc.subVectors(t,i);const l=Va.dot(yc),c=Xa.dot(yc);if(l<=0&&c<=0)return e.copy(i);_c.subVectors(t,a);const h=Va.dot(_c),f=Xa.dot(_c);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Va,o);Mc.subVectors(t,s);const u=Va.dot(Mc),m=Xa.dot(Mc);if(m>=0&&u<=m)return e.copy(s);const _=u*c-l*m;if(_<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(Xa,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return eu.subVectors(s,a),r=(f-h)/(f-h+(u-m)),e.copy(a).addScaledVector(eu,r);const p=1/(g+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(Va,o).addScaledVector(Xa,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},To={h:0,s:0,l:0};function Ec(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ie{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,we.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=we.workingColorSpace){return this.r=t,this.g=e,this.b=i,we.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=we.workingColorSpace){if(t=gh(t,1),e=pn(e,0,1),i=pn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Ec(o,s,t+1/3),this.g=Ec(o,s,t),this.b=Ec(o,s,t-1/3)}return we.toWorkingColorSpace(this,a),this}setStyle(t,e=Pn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pn){const i=jf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}copyLinearToSRGB(t){return this.r=rs(t.r),this.g=rs(t.g),this.b=rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pn){return we.fromWorkingColorSpace(_n.copy(this),t),Math.round(pn(_n.r*255,0,255))*65536+Math.round(pn(_n.g*255,0,255))*256+Math.round(pn(_n.b*255,0,255))}getHexString(t=Pn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=we.workingColorSpace){we.fromWorkingColorSpace(_n.copy(this),e);const i=_n.r,a=_n.g,s=_n.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=we.workingColorSpace){return we.fromWorkingColorSpace(_n.copy(this),e),t.r=_n.r,t.g=_n.g,t.b=_n.b,t}getStyle(t=Pn){we.fromWorkingColorSpace(_n.copy(this),t);const e=_n.r,i=_n.g,a=_n.b;return t!==Pn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Gi),this.setHSL(Gi.h+t,Gi.s+e,Gi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Gi),t.getHSL(To);const i=Os(Gi.h,To.h,e),a=Os(Gi.s,To.s,e),s=Os(Gi.l,To.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _n=new ie;ie.NAMES=jf;let Ov=0;class Sa extends xs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=vi(),this.name="",this.blending=as,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=al,this.blendDst=sl,this.blendEquation=pa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=za,this.stencilZFail=za,this.stencilZPass=za,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(i.blending=this.blending),this.side!==Ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==al&&(i.blendSrc=this.blendSrc),this.blendDst!==sl&&(i.blendDst=this.blendDst),this.blendEquation!==pa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==hs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==za&&(i.stencilFail=this.stencilFail),this.stencilZFail!==za&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==za&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class on extends Sa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const en=new G,Ao=new $t;class mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Vl,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Ao.fromBufferAttribute(this,e),Ao.applyMatrix3(t),this.setXY(e,Ao.x,Ao.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix3(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ii(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ii(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ii(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ii(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ii(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vl&&(t.usage=this.usage),t}}class Kf extends mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Jf extends mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ce extends mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Bv=0;const Wn=new Oe,Tc=new Ze,Wa=new G,Hn=new ao,Cs=new ao,un=new G;class nn extends xs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bv++}),this.uuid=vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new($f(t)?Jf:Kf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new pe().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Wn.makeRotationFromQuaternion(t),this.applyMatrix4(Wn),this}rotateX(t){return Wn.makeRotationX(t),this.applyMatrix4(Wn),this}rotateY(t){return Wn.makeRotationY(t),this.applyMatrix4(Wn),this}rotateZ(t){return Wn.makeRotationZ(t),this.applyMatrix4(Wn),this}translate(t,e,i){return Wn.makeTranslation(t,e,i),this.applyMatrix4(Wn),this}scale(t,e,i){return Wn.makeScale(t,e,i),this.applyMatrix4(Wn),this}lookAt(t){return Tc.lookAt(t),Tc.updateMatrix(),this.applyMatrix4(Tc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wa).negate(),this.translate(Wa.x,Wa.y,Wa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ce(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ao);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Hn.setFromBufferAttribute(s),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Hn.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Hn.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Hn.min),this.boundingBox.expandByPoint(Hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(Hn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Cs.setFromBufferAttribute(r),this.morphTargetsRelative?(un.addVectors(Hn.min,Cs.min),Hn.expandByPoint(un),un.addVectors(Hn.max,Cs.max),Hn.expandByPoint(un)):(Hn.expandByPoint(Cs.min),Hn.expandByPoint(Cs.max))}Hn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)un.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(un));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)un.fromBufferAttribute(r,c),l&&(Wa.fromBufferAttribute(t,c),un.add(Wa)),a=Math.max(a,i.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new G,l[T]=new G;const c=new G,h=new G,f=new G,d=new $t,u=new $t,m=new $t,_=new G,g=new G;function p(T,M,b){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),f.fromBufferAttribute(i,b),d.fromBufferAttribute(s,T),u.fromBufferAttribute(s,M),m.fromBufferAttribute(s,b),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const P=1/(u.x*m.y-m.x*u.y);isFinite(P)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(P),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(P),r[T].add(_),r[M].add(_),r[b].add(_),l[T].add(g),l[M].add(g),l[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let T=0,M=y.length;T<M;++T){const b=y[T],P=b.start,z=b.count;for(let I=P,N=P+z;I<N;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const x=new G,v=new G,w=new G,S=new G;function E(T){w.fromBufferAttribute(a,T),S.copy(w);const M=r[T];x.copy(M),x.sub(w.multiplyScalar(w.dot(M))).normalize(),v.crossVectors(S,M);const P=v.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,P)}for(let T=0,M=y.length;T<M;++T){const b=y[T],P=b.start,z=b.count;for(let I=P,N=P+z;I<N;I+=3)E(t.getX(I+0)),E(t.getX(I+1)),E(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new G,s=new G,o=new G,r=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)un.fromBufferAttribute(t,e),un.normalize(),t.setXYZ(e,un.x,un.y,un.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?u=l[_]*r.data.stride+r.offset:u=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new mn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new nn,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const nu=new Oe,aa=new xh,Ro=new Pr,iu=new G,Po=new G,Co=new G,Lo=new G,Ac=new G,Do=new G,au=new G,ko=new G;class ye extends Ze{constructor(t=new nn,e=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Do.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(Ac.fromBufferAttribute(f,t),o?Do.addScaledVector(Ac,h):Do.addScaledVector(Ac.sub(e),h))}e.add(Do)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ro.copy(i.boundingSphere),Ro.applyMatrix4(s),aa.copy(t.ray).recast(t.near),!(Ro.containsPoint(aa.origin)===!1&&(aa.intersectSphere(Ro,iu)===null||aa.origin.distanceToSquared(iu)>(t.far-t.near)**2))&&(nu.copy(s).invert(),aa.copy(t.ray).applyMatrix4(nu),!(i.boundingBox!==null&&aa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,aa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),E=r.getX(v+1),T=r.getX(v+2);a=Io(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let g=m,p=_;g<p;g+=3){const y=r.getX(g),x=r.getX(g+1),v=r.getX(g+2);a=Io(this,o,t,i,c,h,f,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=y,w=x;v<w;v+=3){const S=v,E=v+1,T=v+2;a=Io(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let g=m,p=_;g<p;g+=3){const y=g,x=g+1,v=g+2;a=Io(this,o,t,i,c,h,f,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function Hv(n,t,e,i,a,s,o,r){let l;if(t.side===In?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Ki,r),l===null)return null;ko.copy(r),ko.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(ko);return c<e.near||c>e.far?null:{distance:c,point:ko.clone(),object:n}}function Io(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Po),n.getVertexPosition(l,Co),n.getVertexPosition(c,Lo);const h=Hv(n,t,e,i,Po,Co,Lo,au);if(h){const f=new G;Xn.getBarycoord(au,Po,Co,Lo,f),a&&(h.uv=Xn.getInterpolatedAttribute(a,r,l,c,f,new $t)),s&&(h.uv1=Xn.getInterpolatedAttribute(s,r,l,c,f,new $t)),o&&(h.normal=Xn.getInterpolatedAttribute(o,r,l,c,f,new G),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new G,materialIndex:0};Xn.getNormal(Po,Co,Lo,d.normal),h.face=d,h.barycoord=f}return h}class oi extends nn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Ce(c,3)),this.setAttribute("normal",new Ce(h,3)),this.setAttribute("uv",new Ce(f,2));function m(_,g,p,y,x,v,w,S,E,T,M){const b=v/E,P=w/T,z=v/2,I=w/2,N=S/2,D=E+1,k=T+1;let V=0,B=0;const $=new G;for(let at=0;at<k;at++){const mt=at*P-I;for(let ft=0;ft<D;ft++){const pt=ft*b-z;$[_]=pt*y,$[g]=mt*x,$[p]=N,c.push($.x,$.y,$.z),$[_]=0,$[g]=0,$[p]=S>0?1:-1,h.push($.x,$.y,$.z),f.push(ft/E),f.push(1-at/T),V+=1}}for(let at=0;at<T;at++)for(let mt=0;mt<E;mt++){const ft=d+mt+D*at,pt=d+mt+D*(at+1),et=d+(mt+1)+D*(at+1),K=d+(mt+1)+D*at;l.push(ft,pt,K),l.push(pt,et,K),B+=6}r.addGroup(u,B,M),u+=B,d+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oi(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ms(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Rn(n){const t={};for(let e=0;e<n.length;e++){const i=ms(n[e]);for(const a in i)t[a]=i[a]}return t}function Gv(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Qf(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:we.workingColorSpace}const Vv={clone:ms,merge:Rn};var Xv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ji extends Sa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xv,this.fragmentShader=Wv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ms(t.uniforms),this.uniformsGroups=Gv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class tp extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=Di}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vi=new G,su=new $t,ou=new $t;class $n extends tp{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(os*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qs*2*Math.atan(Math.tan(os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z),Vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z)}getViewSize(t,e){return this.getViewBounds(t,su,ou),e.subVectors(ou,su)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(os*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ya=-90,$a=1;class Yv extends Ze{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new $n(Ya,$a,t,e);a.layers=this.layers,this.add(a);const s=new $n(Ya,$a,t,e);s.layers=this.layers,this.add(s);const o=new $n(Ya,$a,t,e);o.layers=this.layers,this.add(o);const r=new $n(Ya,$a,t,e);r.layers=this.layers,this.add(r);const l=new $n(Ya,$a,t,e);l.layers=this.layers,this.add(l);const c=new $n(Ya,$a,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===Di)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===gr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class ep extends Ln{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ds,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class $v extends Ma{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new ep(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new oi(5,5,5),s=new Ji({name:"CubemapFromEquirect",uniforms:ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:In,blending:qi});s.uniforms.tEquirect.value=e;const o=new ye(a,s),r=e.minFilter;return e.minFilter===xa&&(e.minFilter=gi),new Yv(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Rc=new G,Zv=new G,qv=new pe;class da{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Rc.subVectors(i,e).cross(Zv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Rc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||qv.getNormalMatrix(t),a=this.coplanarPoint(Rc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const sa=new Pr,zo=new G;class yh{constructor(t=new da,e=new da,i=new da,a=new da,s=new da,o=new da){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Di){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],m=a[9],_=a[10],g=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-u,v-p).normalize(),i[1].setComponents(l+s,d+c,g+u,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+y).normalize(),i[3].setComponents(l-o,d-h,g-m,v-y).normalize(),i[4].setComponents(l-r,d-f,g-_,v-x).normalize(),e===Di)i[5].setComponents(l+r,d+f,g+_,v+x).normalize();else if(e===gr)i[5].setComponents(r,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),sa.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),sa.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(sa)}intersectsSprite(t){return sa.center.set(0,0,0),sa.radius=.7071067811865476,sa.applyMatrix4(t.matrixWorld),this.intersectsSphere(sa)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(zo.x=a.normal.x>0?t.max.x:t.min.x,zo.y=a.normal.y>0?t.max.y:t.min.y,zo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(zo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function np(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function jv(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],_=f[u];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const _=f[u];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Yn extends nn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*f-s;m.push(v,-y,0),_.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;u.push(x,v,S),u.push(v,w,S)}this.setIndex(u),this.setAttribute("position",new Ce(m,3)),this.setAttribute("normal",new Ce(_,3)),this.setAttribute("uv",new Ce(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Kv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Jv=`#ifdef USE_ALPHAHASH
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
#endif`,Qv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ty=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ey=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ny=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,iy=`#ifdef USE_AOMAP
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
#endif`,ay=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sy=`#ifdef USE_BATCHING
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
#endif`,oy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ry=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ly=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hy=`#ifdef USE_IRIDESCENCE
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
#endif`,dy=`#ifdef USE_BUMPMAP
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
#endif`,uy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,fy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,py=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,my=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,_y=`#define PI 3.141592653589793
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
} // validated`,My=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,by=`vec3 transformedNormal = objectNormal;
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
#endif`,Sy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ey=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ty=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ay="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ry=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Py=`#ifdef USE_ENVMAP
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
#endif`,Cy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ly=`#ifdef USE_ENVMAP
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
#endif`,Dy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ky=`#ifdef USE_ENVMAP
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
#endif`,Iy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Uy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ny=`#ifdef USE_GRADIENTMAP
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
}`,Oy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,By=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gy=`uniform bool receiveShadow;
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
#endif`,Vy=`#ifdef USE_ENVMAP
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
#endif`,Xy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$y=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zy=`PhysicalMaterial material;
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
#endif`,qy=`struct PhysicalMaterial {
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
}`,jy=`
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
#endif`,Ky=`#if defined( RE_IndirectDiffuse )
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
#endif`,Jy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,t_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,i_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,a_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,s_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,o_=`#if defined( USE_POINTS_UV )
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
#endif`,r_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,c_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,l_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,h_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,d_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,u_=`#ifdef USE_MORPHTARGETS
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
#endif`,f_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,m_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,g_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,v_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,y_=`#ifdef USE_NORMALMAP
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
#endif`,__=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,b_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,S_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,w_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,T_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,A_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,R_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,P_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,C_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,L_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,D_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,k_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,I_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,z_=`float getShadowMask() {
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
}`,F_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,U_=`#ifdef USE_SKINNING
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
#endif`,N_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,O_=`#ifdef USE_SKINNING
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
#endif`,B_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,H_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,G_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,V_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,X_=`#ifdef USE_TRANSMISSION
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
#endif`,W_=`#ifdef USE_TRANSMISSION
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
#endif`,Y_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const j_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,K_=`uniform sampler2D t2D;
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
}`,J_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,tM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nM=`#include <common>
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
}`,iM=`#if DEPTH_PACKING == 3200
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
}`,aM=`#define DISTANCE
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
}`,sM=`#define DISTANCE
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
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cM=`uniform float scale;
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
}`,lM=`uniform vec3 diffuse;
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
}`,hM=`#include <common>
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
}`,dM=`uniform vec3 diffuse;
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
}`,uM=`#define LAMBERT
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
}`,fM=`#define LAMBERT
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
}`,pM=`#define MATCAP
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
}`,mM=`#define MATCAP
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
}`,gM=`#define NORMAL
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
}`,xM=`#define NORMAL
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
}`,vM=`#define PHONG
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
}`,yM=`#define PHONG
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
}`,_M=`#define STANDARD
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
}`,MM=`#define STANDARD
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
}`,bM=`#define TOON
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
}`,SM=`#define TOON
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
}`,wM=`uniform float size;
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
}`,EM=`uniform vec3 diffuse;
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
}`,TM=`#include <common>
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
}`,AM=`uniform vec3 color;
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
}`,RM=`uniform float rotation;
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
}`,PM=`uniform vec3 diffuse;
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
}`,me={alphahash_fragment:Kv,alphahash_pars_fragment:Jv,alphamap_fragment:Qv,alphamap_pars_fragment:ty,alphatest_fragment:ey,alphatest_pars_fragment:ny,aomap_fragment:iy,aomap_pars_fragment:ay,batching_pars_vertex:sy,batching_vertex:oy,begin_vertex:ry,beginnormal_vertex:cy,bsdfs:ly,iridescence_fragment:hy,bumpmap_pars_fragment:dy,clipping_planes_fragment:uy,clipping_planes_pars_fragment:fy,clipping_planes_pars_vertex:py,clipping_planes_vertex:my,color_fragment:gy,color_pars_fragment:xy,color_pars_vertex:vy,color_vertex:yy,common:_y,cube_uv_reflection_fragment:My,defaultnormal_vertex:by,displacementmap_pars_vertex:Sy,displacementmap_vertex:wy,emissivemap_fragment:Ey,emissivemap_pars_fragment:Ty,colorspace_fragment:Ay,colorspace_pars_fragment:Ry,envmap_fragment:Py,envmap_common_pars_fragment:Cy,envmap_pars_fragment:Ly,envmap_pars_vertex:Dy,envmap_physical_pars_fragment:Vy,envmap_vertex:ky,fog_vertex:Iy,fog_pars_vertex:zy,fog_fragment:Fy,fog_pars_fragment:Uy,gradientmap_pars_fragment:Ny,lightmap_pars_fragment:Oy,lights_lambert_fragment:By,lights_lambert_pars_fragment:Hy,lights_pars_begin:Gy,lights_toon_fragment:Xy,lights_toon_pars_fragment:Wy,lights_phong_fragment:Yy,lights_phong_pars_fragment:$y,lights_physical_fragment:Zy,lights_physical_pars_fragment:qy,lights_fragment_begin:jy,lights_fragment_maps:Ky,lights_fragment_end:Jy,logdepthbuf_fragment:Qy,logdepthbuf_pars_fragment:t_,logdepthbuf_pars_vertex:e_,logdepthbuf_vertex:n_,map_fragment:i_,map_pars_fragment:a_,map_particle_fragment:s_,map_particle_pars_fragment:o_,metalnessmap_fragment:r_,metalnessmap_pars_fragment:c_,morphinstance_vertex:l_,morphcolor_vertex:h_,morphnormal_vertex:d_,morphtarget_pars_vertex:u_,morphtarget_vertex:f_,normal_fragment_begin:p_,normal_fragment_maps:m_,normal_pars_fragment:g_,normal_pars_vertex:x_,normal_vertex:v_,normalmap_pars_fragment:y_,clearcoat_normal_fragment_begin:__,clearcoat_normal_fragment_maps:M_,clearcoat_pars_fragment:b_,iridescence_pars_fragment:S_,opaque_fragment:w_,packing:E_,premultiplied_alpha_fragment:T_,project_vertex:A_,dithering_fragment:R_,dithering_pars_fragment:P_,roughnessmap_fragment:C_,roughnessmap_pars_fragment:L_,shadowmap_pars_fragment:D_,shadowmap_pars_vertex:k_,shadowmap_vertex:I_,shadowmask_pars_fragment:z_,skinbase_vertex:F_,skinning_pars_vertex:U_,skinning_vertex:N_,skinnormal_vertex:O_,specularmap_fragment:B_,specularmap_pars_fragment:H_,tonemapping_fragment:G_,tonemapping_pars_fragment:V_,transmission_fragment:X_,transmission_pars_fragment:W_,uv_pars_fragment:Y_,uv_pars_vertex:$_,uv_vertex:Z_,worldpos_vertex:q_,background_vert:j_,background_frag:K_,backgroundCube_vert:J_,backgroundCube_frag:Q_,cube_vert:tM,cube_frag:eM,depth_vert:nM,depth_frag:iM,distanceRGBA_vert:aM,distanceRGBA_frag:sM,equirect_vert:oM,equirect_frag:rM,linedashed_vert:cM,linedashed_frag:lM,meshbasic_vert:hM,meshbasic_frag:dM,meshlambert_vert:uM,meshlambert_frag:fM,meshmatcap_vert:pM,meshmatcap_frag:mM,meshnormal_vert:gM,meshnormal_frag:xM,meshphong_vert:vM,meshphong_frag:yM,meshphysical_vert:_M,meshphysical_frag:MM,meshtoon_vert:bM,meshtoon_frag:SM,points_vert:wM,points_frag:EM,shadow_vert:TM,shadow_frag:AM,sprite_vert:RM,sprite_frag:PM},Bt={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pe}},envmap:{envMap:{value:null},envMapRotation:{value:new pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pe},normalScale:{value:new $t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0},uvTransform:{value:new pe}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new $t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pe},alphaMap:{value:null},alphaMapTransform:{value:new pe},alphaTest:{value:0}}},mi={basic:{uniforms:Rn([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.fog]),vertexShader:me.meshbasic_vert,fragmentShader:me.meshbasic_frag},lambert:{uniforms:Rn([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new ie(0)}}]),vertexShader:me.meshlambert_vert,fragmentShader:me.meshlambert_frag},phong:{uniforms:Rn([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:me.meshphong_vert,fragmentShader:me.meshphong_frag},standard:{uniforms:Rn([Bt.common,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.roughnessmap,Bt.metalnessmap,Bt.fog,Bt.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:me.meshphysical_vert,fragmentShader:me.meshphysical_frag},toon:{uniforms:Rn([Bt.common,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.gradientmap,Bt.fog,Bt.lights,{emissive:{value:new ie(0)}}]),vertexShader:me.meshtoon_vert,fragmentShader:me.meshtoon_frag},matcap:{uniforms:Rn([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,{matcap:{value:null}}]),vertexShader:me.meshmatcap_vert,fragmentShader:me.meshmatcap_frag},points:{uniforms:Rn([Bt.points,Bt.fog]),vertexShader:me.points_vert,fragmentShader:me.points_frag},dashed:{uniforms:Rn([Bt.common,Bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:me.linedashed_vert,fragmentShader:me.linedashed_frag},depth:{uniforms:Rn([Bt.common,Bt.displacementmap]),vertexShader:me.depth_vert,fragmentShader:me.depth_frag},normal:{uniforms:Rn([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,{opacity:{value:1}}]),vertexShader:me.meshnormal_vert,fragmentShader:me.meshnormal_frag},sprite:{uniforms:Rn([Bt.sprite,Bt.fog]),vertexShader:me.sprite_vert,fragmentShader:me.sprite_frag},background:{uniforms:{uvTransform:{value:new pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:me.background_vert,fragmentShader:me.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pe}},vertexShader:me.backgroundCube_vert,fragmentShader:me.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:me.cube_vert,fragmentShader:me.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:me.equirect_vert,fragmentShader:me.equirect_frag},distanceRGBA:{uniforms:Rn([Bt.common,Bt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:me.distanceRGBA_vert,fragmentShader:me.distanceRGBA_frag},shadow:{uniforms:Rn([Bt.lights,Bt.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:me.shadow_vert,fragmentShader:me.shadow_frag}};mi.physical={uniforms:Rn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pe},clearcoatNormalScale:{value:new $t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pe},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pe},transmissionSamplerSize:{value:new $t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pe},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pe},anisotropyVector:{value:new $t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pe}}]),vertexShader:me.meshphysical_vert,fragmentShader:me.meshphysical_frag};const Fo={r:0,b:0,g:0},oa=new yi,CM=new Oe;function LM(n,t,e,i,a,s,o){const r=new ie(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=m(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===Ar)?(h===void 0&&(h=new ye(new oi(1,1,1),new Ji({name:"BackgroundCubeMaterial",uniforms:ms(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),oa.copy(x.backgroundRotation),oa.x*=-1,oa.y*=-1,oa.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(oa.y*=-1,oa.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(CM.makeRotationFromEuler(oa)),h.material.toneMapped=we.getTransfer(v.colorSpace)!==Fe,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new ye(new Yn(2,2),new Ji({name:"BackgroundMaterial",uniforms:ms(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=we.getTransfer(v.colorSpace)!==Fe,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(Fo,Qf(n)),i.buffers.color.setClear(Fo.r,Fo.g,Fo.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:g}}function DM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(b,P,z,I,N){let D=!1;const k=f(I,z,P);s!==k&&(s=k,c(s.object)),D=u(b,I,z,N),D&&m(b,I,z,N),N!==null&&t.update(N,n.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,v(b,P,z,I),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function f(b,P,z){const I=z.wireframe===!0;let N=i[b.id];N===void 0&&(N={},i[b.id]=N);let D=N[P.id];D===void 0&&(D={},N[P.id]=D);let k=D[I];return k===void 0&&(k=d(l()),D[I]=k),k}function d(b){const P=[],z=[],I=[];for(let N=0;N<e;N++)P[N]=0,z[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:z,attributeDivisors:I,object:b,attributes:{},index:null}}function u(b,P,z,I){const N=s.attributes,D=P.attributes;let k=0;const V=z.getAttributes();for(const B in V)if(V[B].location>=0){const at=N[B];let mt=D[B];if(mt===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(mt=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(mt=b.instanceColor)),at===void 0||at.attribute!==mt||mt&&at.data!==mt.data)return!0;k++}return s.attributesNum!==k||s.index!==I}function m(b,P,z,I){const N={},D=P.attributes;let k=0;const V=z.getAttributes();for(const B in V)if(V[B].location>=0){let at=D[B];at===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(at=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(at=b.instanceColor));const mt={};mt.attribute=at,at&&at.data&&(mt.data=at.data),N[B]=mt,k++}s.attributes=N,s.attributesNum=k,s.index=I}function _(){const b=s.newAttributes;for(let P=0,z=b.length;P<z;P++)b[P]=0}function g(b){p(b,0)}function p(b,P){const z=s.newAttributes,I=s.enabledAttributes,N=s.attributeDivisors;z[b]=1,I[b]===0&&(n.enableVertexAttribArray(b),I[b]=1),N[b]!==P&&(n.vertexAttribDivisor(b,P),N[b]=P)}function y(){const b=s.newAttributes,P=s.enabledAttributes;for(let z=0,I=P.length;z<I;z++)P[z]!==b[z]&&(n.disableVertexAttribArray(z),P[z]=0)}function x(b,P,z,I,N,D,k){k===!0?n.vertexAttribIPointer(b,P,z,N,D):n.vertexAttribPointer(b,P,z,I,N,D)}function v(b,P,z,I){_();const N=I.attributes,D=z.getAttributes(),k=P.defaultAttributeValues;for(const V in D){const B=D[V];if(B.location>=0){let $=N[V];if($===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&($=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&($=b.instanceColor)),$!==void 0){const at=$.normalized,mt=$.itemSize,ft=t.get($);if(ft===void 0)continue;const pt=ft.buffer,et=ft.type,K=ft.bytesPerElement,gt=et===n.INT||et===n.UNSIGNED_INT||$.gpuType===hh;if($.isInterleavedBufferAttribute){const j=$.data,H=j.stride,ot=$.offset;if(j.isInstancedInterleavedBuffer){for(let wt=0;wt<B.locationSize;wt++)p(B.location+wt,j.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let wt=0;wt<B.locationSize;wt++)g(B.location+wt);n.bindBuffer(n.ARRAY_BUFFER,pt);for(let wt=0;wt<B.locationSize;wt++)x(B.location+wt,mt/B.locationSize,et,at,H*K,(ot+mt/B.locationSize*wt)*K,gt)}else{if($.isInstancedBufferAttribute){for(let j=0;j<B.locationSize;j++)p(B.location+j,$.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let j=0;j<B.locationSize;j++)g(B.location+j);n.bindBuffer(n.ARRAY_BUFFER,pt);for(let j=0;j<B.locationSize;j++)x(B.location+j,mt/B.locationSize,et,at,mt*K,mt/B.locationSize*j*K,gt)}}else if(k!==void 0){const at=k[V];if(at!==void 0)switch(at.length){case 2:n.vertexAttrib2fv(B.location,at);break;case 3:n.vertexAttrib3fv(B.location,at);break;case 4:n.vertexAttrib4fv(B.location,at);break;default:n.vertexAttrib1fv(B.location,at)}}}}y()}function w(){T();for(const b in i){const P=i[b];for(const z in P){const I=P[z];for(const N in I)h(I[N].object),delete I[N];delete P[z]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const z in P){const I=P[z];for(const N in I)h(I[N].object),delete I[N];delete P[z]}delete i[b.id]}function E(b){for(const P in i){const z=i[P];if(z[b.id]===void 0)continue;const I=z[b.id];for(const N in I)h(I[N].object),delete I[N];delete z[b.id]}}function T(){M(),o=!0,s!==a&&(s=a,c(s.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function kM(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_]*d[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function IM(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==ai&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===no&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Ii&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Li&&!T)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function zM(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new da,r=new pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(m,d,x,u);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=u+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=u;x!==_;++x,v+=4)o.copy(f[x]).applyMatrix4(y,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function FM(n){let t=new WeakMap;function e(o,r){return r===fl?o.mapping=ds:r===pl&&(o.mapping=us),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===fl||r===pl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new $v(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class ip extends tp{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const es=4,ru=[.125,.215,.35,.446,.526,.582],ma=20,Pc=new ip,cu=new ie;let Cc=null,Lc=0,Dc=0,kc=!1;const ua=(1+Math.sqrt(5))/2,Za=1/ua,lu=[new G(-ua,Za,0),new G(ua,Za,0),new G(-Za,0,ua),new G(Za,0,ua),new G(0,ua,-Za),new G(0,ua,Za),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class hu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Cc=this._renderer.getRenderTarget(),Lc=this._renderer.getActiveCubeFace(),Dc=this._renderer.getActiveMipmapLevel(),kc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Cc,Lc,Dc),this._renderer.xr.enabled=kc,t.scissorTest=!1,Uo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ds||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Cc=this._renderer.getRenderTarget(),Lc=this._renderer.getActiveCubeFace(),Dc=this._renderer.getActiveMipmapLevel(),kc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:gi,minFilter:gi,generateMipmaps:!1,type:no,format:ai,colorSpace:gs,depthBuffer:!1},a=du(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=du(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=UM(s)),this._blurMaterial=NM(s,t,e)}return a}_compileMaterial(t){const e=new ye(this._lodPlanes[0],t);this._renderer.compile(e,Pc)}_sceneToCubeUV(t,e,i,a){const r=new $n(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(cu),h.toneMapping=ji,h.autoClear=!1;const u=new on({name:"PMREM.Background",side:In,depthWrite:!1,depthTest:!1}),m=new ye(new oi,u);let _=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,_=!0):(u.color.copy(cu),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Uo(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===ds||t.mapping===us;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=fu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=uu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new ye(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;Uo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Pc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=lu[(a-s-1)%lu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ye(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*ma-1),_=s/m,g=isFinite(s)?1+Math.floor(h*_):ma;g>ma&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ma}`);const p=[];let y=0;for(let E=0;E<ma;++E){const T=E/_,M=Math.exp(-T*T/2);p.push(M),E===0?y+=M:E<g&&(y+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-es?a-x+es:0),S=4*(this._cubeSize-v);Uo(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(f,Pc)}}function UM(n){const t=[],e=[],i=[];let a=n;const s=n-es+1+ru.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-es?l=ru[o-n+es-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*u),x=new Float32Array(g*m*u),v=new Float32Array(p*m*u);for(let S=0;S<u;S++){const E=S%3*2/3-1,T=S>2?0:-1,M=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];y.set(M,_*m*S),x.set(d,g*m*S);const b=[S,S,S,S,S,S];v.set(b,p*m*S)}const w=new nn;w.setAttribute("position",new mn(y,_)),w.setAttribute("uv",new mn(x,g)),w.setAttribute("faceIndex",new mn(v,p)),t.push(w),a>es&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function du(n,t,e){const i=new Ma(n,t,e);return i.texture.mapping=Ar,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Uo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function NM(n,t,e){const i=new Float32Array(ma),a=new G(0,1,0);return new Ji({name:"SphericalGaussianBlur",defines:{n:ma,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:_h(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function uu(){return new Ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_h(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function fu(){return new Ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qi,depthTest:!1,depthWrite:!1})}function _h(){return`

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
	`}function OM(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===fl||l===pl,h=l===ds||l===us;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new hu(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new hu(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function BM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&zs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function HM(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const _=u[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let _=0;if(u!==null){const y=u.array;_=u.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],E=y[x+2];d.push(w,S,S,E,E,w)}}else if(m!==void 0){const y=m.array;_=m.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const g=new($f(d)?Jf:Kf)(d,1);g.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,g)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function GM(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,s,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,_,0,m);let p=0;for(let y=0;y<m;y++)p+=u[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function VM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function XM(n,t,e){const i=new WeakMap,a=new Je;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let b=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var u=b;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*f),T=new qf(E,w,S,f);T.type=Li,T.needsUpdate=!0;const M=v*4;for(let P=0;P<f;P++){const z=p[P],I=y[P],N=x[P],D=w*S*4*P;for(let k=0;k<z.count;k++){const V=k*M;m===!0&&(a.fromBufferAttribute(z,k),E[D+V+0]=a.x,E[D+V+1]=a.y,E[D+V+2]=a.z,E[D+V+3]=0),_===!0&&(a.fromBufferAttribute(I,k),E[D+V+4]=a.x,E[D+V+5]=a.y,E[D+V+6]=a.z,E[D+V+7]=0),g===!0&&(a.fromBufferAttribute(N,k),E[D+V+8]=a.x,E[D+V+9]=a.y,E[D+V+10]=a.z,E[D+V+11]=N.itemSize===4?a.w:1)}}d={count:f,texture:T,size:new $t(w,S)},i.set(r,d),r.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function WM(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class ap extends Ln{constructor(t,e,i,a,s,o,r,l,c,h=ss){if(h!==ss&&h!==ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ss&&(i=_a),i===void 0&&h===ps&&(i=fs),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:si,this.minFilter=l!==void 0?l:si,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const sp=new Ln,pu=new ap(1,1),op=new qf,rp=new Lv,cp=new ep,mu=[],gu=[],xu=new Float32Array(16),vu=new Float32Array(9),yu=new Float32Array(4);function vs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=mu[a];if(s===void 0&&(s=new Float32Array(a),mu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function rn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function cn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Cr(n,t){let e=gu[t];e===void 0&&(e=new Int32Array(t),gu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function YM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function $M(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2fv(this.addr,t),cn(e,t)}}function ZM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;n.uniform3fv(this.addr,t),cn(e,t)}}function qM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4fv(this.addr,t),cn(e,t)}}function jM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;yu.set(i),n.uniformMatrix2fv(this.addr,!1,yu),cn(e,i)}}function KM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;vu.set(i),n.uniformMatrix3fv(this.addr,!1,vu),cn(e,i)}}function JM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;xu.set(i),n.uniformMatrix4fv(this.addr,!1,xu),cn(e,i)}}function QM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function tb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2iv(this.addr,t),cn(e,t)}}function eb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3iv(this.addr,t),cn(e,t)}}function nb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4iv(this.addr,t),cn(e,t)}}function ib(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function ab(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2uiv(this.addr,t),cn(e,t)}}function sb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3uiv(this.addr,t),cn(e,t)}}function ob(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4uiv(this.addr,t),cn(e,t)}}function rb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(pu.compareFunction=Yf,s=pu):s=sp,e.setTexture2D(t||s,a)}function cb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||rp,a)}function lb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||cp,a)}function hb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||op,a)}function db(n){switch(n){case 5126:return YM;case 35664:return $M;case 35665:return ZM;case 35666:return qM;case 35674:return jM;case 35675:return KM;case 35676:return JM;case 5124:case 35670:return QM;case 35667:case 35671:return tb;case 35668:case 35672:return eb;case 35669:case 35673:return nb;case 5125:return ib;case 36294:return ab;case 36295:return sb;case 36296:return ob;case 35678:case 36198:case 36298:case 36306:case 35682:return rb;case 35679:case 36299:case 36307:return cb;case 35680:case 36300:case 36308:case 36293:return lb;case 36289:case 36303:case 36311:case 36292:return hb}}function ub(n,t){n.uniform1fv(this.addr,t)}function fb(n,t){const e=vs(t,this.size,2);n.uniform2fv(this.addr,e)}function pb(n,t){const e=vs(t,this.size,3);n.uniform3fv(this.addr,e)}function mb(n,t){const e=vs(t,this.size,4);n.uniform4fv(this.addr,e)}function gb(n,t){const e=vs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function xb(n,t){const e=vs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function vb(n,t){const e=vs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function yb(n,t){n.uniform1iv(this.addr,t)}function _b(n,t){n.uniform2iv(this.addr,t)}function Mb(n,t){n.uniform3iv(this.addr,t)}function bb(n,t){n.uniform4iv(this.addr,t)}function Sb(n,t){n.uniform1uiv(this.addr,t)}function wb(n,t){n.uniform2uiv(this.addr,t)}function Eb(n,t){n.uniform3uiv(this.addr,t)}function Tb(n,t){n.uniform4uiv(this.addr,t)}function Ab(n,t,e){const i=this.cache,a=t.length,s=Cr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||sp,s[o])}function Rb(n,t,e){const i=this.cache,a=t.length,s=Cr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||rp,s[o])}function Pb(n,t,e){const i=this.cache,a=t.length,s=Cr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||cp,s[o])}function Cb(n,t,e){const i=this.cache,a=t.length,s=Cr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||op,s[o])}function Lb(n){switch(n){case 5126:return ub;case 35664:return fb;case 35665:return pb;case 35666:return mb;case 35674:return gb;case 35675:return xb;case 35676:return vb;case 5124:case 35670:return yb;case 35667:case 35671:return _b;case 35668:case 35672:return Mb;case 35669:case 35673:return bb;case 5125:return Sb;case 36294:return wb;case 36295:return Eb;case 36296:return Tb;case 35678:case 36198:case 36298:case 36306:case 35682:return Ab;case 35679:case 36299:case 36307:return Rb;case 35680:case 36300:case 36308:case 36293:return Pb;case 36289:case 36303:case 36311:case 36292:return Cb}}class Db{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=db(e.type)}}class kb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Lb(e.type)}}class Ib{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Ic=/(\w+)(\])?(\[|\.)?/g;function _u(n,t){n.seq.push(t),n.map[t.id]=t}function zb(n,t,e){const i=n.name,a=i.length;for(Ic.lastIndex=0;;){const s=Ic.exec(i),o=Ic.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){_u(e,c===void 0?new Db(r,n,t):new kb(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new Ib(r),_u(e,f)),e=f}}}class ar{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);zb(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Mu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Fb=37297;let Ub=0;function Nb(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const bu=new pe;function Ob(n){we._getMatrix(bu,we.workingColorSpace,n);const t=`mat3( ${bu.elements.map(e=>e.toFixed(4))} )`;switch(we.getTransfer(n)){case Rr:return[t,"LinearTransferOETF"];case Fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Su(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+Nb(n.getShaderSource(t),o)}else return a}function Bb(n,t){const e=Ob(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Hb(n,t){let e;switch(t){case Vx:e="Linear";break;case Xx:e="Reinhard";break;case Wx:e="Cineon";break;case Yx:e="ACESFilmic";break;case Zx:e="AgX";break;case qx:e="Neutral";break;case $x:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const No=new G;function Gb(){we.getLuminanceCoefficients(No);const n=No.x.toFixed(4),t=No.y.toFixed(4),e=No.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function Xb(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Wb(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Fs(n){return n!==""}function wu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Yb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xl(n){return n.replace(Yb,Zb)}const $b=new Map;function Zb(n,t){let e=me[t];if(e===void 0){const i=$b.get(t);if(i!==void 0)e=me[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Xl(e)}const qb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tu(n){return n.replace(qb,jb)}function jb(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Au(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Kb(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Df?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===kf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Pi&&(t="SHADOWMAP_TYPE_VSM"),t}function Jb(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ds:case us:t="ENVMAP_TYPE_CUBE";break;case Ar:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Qb(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case us:t="ENVMAP_MODE_REFRACTION";break}return t}function t1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case lh:t="ENVMAP_BLENDING_MULTIPLY";break;case Hx:t="ENVMAP_BLENDING_MIX";break;case Gx:t="ENVMAP_BLENDING_ADD";break}return t}function e1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function n1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=Kb(e),c=Jb(e),h=Qb(e),f=t1(e),d=e1(e),u=Vb(e),m=Xb(s),_=a.createProgram();let g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Fs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Fs).join(`
`),p.length>0&&(p+=`
`)):(g=[Au(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),p=[Au(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ji?"#define TONE_MAPPING":"",e.toneMapping!==ji?me.tonemapping_pars_fragment:"",e.toneMapping!==ji?Hb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",me.colorspace_pars_fragment,Bb("linearToOutputTexel",e.outputColorSpace),Gb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fs).join(`
`)),o=Xl(o),o=wu(o,e),o=Eu(o,e),r=Xl(r),r=wu(r,e),r=Eu(r,e),o=Tu(o),r=Tu(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Nd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+g+o,v=y+p+r,w=Mu(a,a.VERTEX_SHADER,x),S=Mu(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function E(P){if(n.debug.checkShaderErrors){const z=a.getProgramInfoLog(_).trim(),I=a.getShaderInfoLog(w).trim(),N=a.getShaderInfoLog(S).trim();let D=!0,k=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(D=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const V=Su(a,w,"vertex"),B=Su(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+V+`
`+B)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||N==="")&&(k=!1);k&&(P.diagnostics={runnable:D,programLog:z,vertexShader:{log:I,prefix:g},fragmentShader:{log:N,prefix:p}})}a.deleteShader(w),a.deleteShader(S),T=new ar(a,_),M=Wb(a,_)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let M;this.getAttributes=function(){return M===void 0&&E(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=a.getProgramParameter(_,Fb)),b},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ub++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let i1=0;class a1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new s1(t),e.set(t,i)),i}}class s1{constructor(t){this.id=i1++,this.code=t,this.usedTimes=0}}function o1(n,t,e,i,a,s,o){const r=new vh,l=new a1,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,b,P,z,I){const N=z.fog,D=I.geometry,k=M.isMeshStandardMaterial?z.environment:null,V=(M.isMeshStandardMaterial?e:t).get(M.envMap||k),B=V&&V.mapping===Ar?V.image.height:null,$=m[M.type];M.precision!==null&&(u=a.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const at=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,mt=at!==void 0?at.length:0;let ft=0;D.morphAttributes.position!==void 0&&(ft=1),D.morphAttributes.normal!==void 0&&(ft=2),D.morphAttributes.color!==void 0&&(ft=3);let pt,et,K,gt;if($){const oe=mi[$];pt=oe.vertexShader,et=oe.fragmentShader}else pt=M.vertexShader,et=M.fragmentShader,l.update(M),K=l.getVertexShaderID(M),gt=l.getFragmentShaderID(M);const j=n.getRenderTarget(),H=n.state.buffers.depth.getReversed(),ot=I.isInstancedMesh===!0,wt=I.isBatchedMesh===!0,Ot=!!M.map,Mt=!!M.matcap,Lt=!!V,F=!!M.aoMap,le=!!M.lightMap,Wt=!!M.bumpMap,Nt=!!M.normalMap,Ct=!!M.displacementMap,Dt=!!M.emissiveMap,Tt=!!M.metalnessMap,C=!!M.roughnessMap,A=M.anisotropy>0,Z=M.clearcoat>0,dt=M.dispersion>0,Q=M.iridescence>0,rt=M.sheen>0,zt=M.transmission>0,nt=A&&!!M.anisotropyMap,vt=Z&&!!M.clearcoatMap,Ft=Z&&!!M.clearcoatNormalMap,st=Z&&!!M.clearcoatRoughnessMap,St=Q&&!!M.iridescenceMap,O=Q&&!!M.iridescenceThicknessMap,lt=rt&&!!M.sheenColorMap,xt=rt&&!!M.sheenRoughnessMap,Xt=!!M.specularMap,Ut=!!M.specularColorMap,Zt=!!M.specularIntensityMap,U=zt&&!!M.transmissionMap,bt=zt&&!!M.thicknessMap,it=!!M.gradientMap,ht=!!M.alphaMap,Rt=M.alphaTest>0,At=!!M.alphaHash,Qt=!!M.extensions;let se=ji;M.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(se=n.toneMapping);const ue={shaderID:$,shaderType:M.type,shaderName:M.name,vertexShader:pt,fragmentShader:et,defines:M.defines,customVertexShaderID:K,customFragmentShaderID:gt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:wt,batchingColor:wt&&I._colorsTexture!==null,instancing:ot,instancingColor:ot&&I.instanceColor!==null,instancingMorph:ot&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:gs,alphaToCoverage:!!M.alphaToCoverage,map:Ot,matcap:Mt,envMap:Lt,envMapMode:Lt&&V.mapping,envMapCubeUVHeight:B,aoMap:F,lightMap:le,bumpMap:Wt,normalMap:Nt,displacementMap:d&&Ct,emissiveMap:Dt,normalMapObjectSpace:Nt&&M.normalMapType===Qx,normalMapTangentSpace:Nt&&M.normalMapType===Wf,metalnessMap:Tt,roughnessMap:C,anisotropy:A,anisotropyMap:nt,clearcoat:Z,clearcoatMap:vt,clearcoatNormalMap:Ft,clearcoatRoughnessMap:st,dispersion:dt,iridescence:Q,iridescenceMap:St,iridescenceThicknessMap:O,sheen:rt,sheenColorMap:lt,sheenRoughnessMap:xt,specularMap:Xt,specularColorMap:Ut,specularIntensityMap:Zt,transmission:zt,transmissionMap:U,thicknessMap:bt,gradientMap:it,opaque:M.transparent===!1&&M.blending===as&&M.alphaToCoverage===!1,alphaMap:ht,alphaTest:Rt,alphaHash:At,combine:M.combine,mapUv:Ot&&_(M.map.channel),aoMapUv:F&&_(M.aoMap.channel),lightMapUv:le&&_(M.lightMap.channel),bumpMapUv:Wt&&_(M.bumpMap.channel),normalMapUv:Nt&&_(M.normalMap.channel),displacementMapUv:Ct&&_(M.displacementMap.channel),emissiveMapUv:Dt&&_(M.emissiveMap.channel),metalnessMapUv:Tt&&_(M.metalnessMap.channel),roughnessMapUv:C&&_(M.roughnessMap.channel),anisotropyMapUv:nt&&_(M.anisotropyMap.channel),clearcoatMapUv:vt&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:st&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:St&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:O&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:lt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(M.sheenRoughnessMap.channel),specularMapUv:Xt&&_(M.specularMap.channel),specularColorMapUv:Ut&&_(M.specularColorMap.channel),specularIntensityMapUv:Zt&&_(M.specularIntensityMap.channel),transmissionMapUv:U&&_(M.transmissionMap.channel),thicknessMapUv:bt&&_(M.thicknessMap.channel),alphaMapUv:ht&&_(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Nt||A),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(Ot||ht),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:H,skinning:I.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:ft,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:se,decodeVideoTexture:Ot&&M.map.isVideoTexture===!0&&we.getTransfer(M.map.colorSpace)===Fe,decodeVideoTextureEmissive:Dt&&M.emissiveMap.isVideoTexture===!0&&we.getTransfer(M.emissiveMap.colorSpace)===Fe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ye,flipSided:M.side===In,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Qt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&M.extensions.multiDraw===!0||wt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ue.vertexUv1s=c.has(1),ue.vertexUv2s=c.has(2),ue.vertexUv3s=c.has(3),c.clear(),ue}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(y(b,M),x(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function x(M,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),M.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reverseDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),M.push(r.mask)}function v(M){const b=m[M.type];let P;if(b){const z=mi[b];P=Vv.clone(z.uniforms)}else P=M.uniforms;return P}function w(M,b){let P;for(let z=0,I=h.length;z<I;z++){const N=h[z];if(N.cacheKey===b){P=N,++P.usedTimes;break}}return P===void 0&&(P=new n1(n,b,M,s),h.push(P)),P}function S(M){if(--M.usedTimes===0){const b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function E(M){l.remove(M)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function r1(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function c1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Ru(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Pu(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,m,_,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=_,p.group=g),t++,p}function r(f,d,u,m,_,g){const p=o(f,d,u,m,_,g);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,m,_,g){const p=o(f,d,u,m,_,g);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||c1),i.length>1&&i.sort(d||Ru),a.length>1&&a.sort(d||Ru)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function l1(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Pu,n.set(i,[o])):a>=s.length?(o=new Pu,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function h1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ie};break;case"SpotLight":e={position:new G,direction:new G,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ie,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":e={color:new ie,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function d1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $t,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let u1=0;function f1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function p1(n){const t=new h1,e=d1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new G);const a=new G,s=new Oe,o=new Oe;function r(c){let h=0,f=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let u=0,m=0,_=0,g=0,p=0,y=0,x=0,v=0,w=0,S=0,E=0;c.sort(f1);for(let M=0,b=c.length;M<b;M++){const P=c[M],z=P.color,I=P.intensity,N=P.distance,D=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=z.r*I,f+=z.g*I,d+=z.b*I;else if(P.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(P.sh.coefficients[k],I);E++}else if(P.isDirectionalLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,B=e.get(P);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.directionalShadow[u]=B,i.directionalShadowMap[u]=D,i.directionalShadowMatrix[u]=P.shadow.matrix,y++}i.directional[u]=k,u++}else if(P.isSpotLight){const k=t.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(z).multiplyScalar(I),k.distance=N,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,i.spot[_]=k;const V=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,V.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=V.matrix,P.castShadow){const B=e.get(P);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=D,v++}_++}else if(P.isRectAreaLight){const k=t.get(P);k.color.copy(z).multiplyScalar(I),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=k,g++}else if(P.isPointLight){const k=t.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const V=P.shadow,B=e.get(P);B.shadowIntensity=V.intensity,B.shadowBias=V.bias,B.shadowNormalBias=V.normalBias,B.shadowRadius=V.radius,B.shadowMapSize=V.mapSize,B.shadowCameraNear=V.camera.near,B.shadowCameraFar=V.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=D,i.pointShadowMatrix[m]=P.shadow.matrix,x++}i.point[m]=k,m++}else if(P.isHemisphereLight){const k=t.get(P);k.skyColor.copy(P.color).multiplyScalar(I),k.groundColor.copy(P.groundColor).multiplyScalar(I),i.hemi[p]=k,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Bt.LTC_FLOAT_1,i.rectAreaLTC2=Bt.LTC_FLOAT_2):(i.rectAreaLTC1=Bt.LTC_HALF_1,i.rectAreaLTC2=Bt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==_||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==y||T.numPointShadows!==x||T.numSpotShadows!==v||T.numSpotMaps!==w||T.numLightProbes!==E)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.directionalLength=u,T.pointLength=m,T.spotLength=_,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=y,T.numPointShadows=x,T.numSpotShadows=v,T.numSpotMaps=w,T.numLightProbes=E,i.version=u1++)}function l(c,h){let f=0,d=0,u=0,m=0,_=0;const g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(x.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function Cu(n){const t=new p1(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function m1(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Cu(n),t.set(a,[r])):s>=o.length?(r=new Cu(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class g1 extends Sa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Kx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class x1 extends Sa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const v1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,y1=`uniform sampler2D shadow_pass;
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
}`;function _1(n,t,e){let i=new yh;const a=new $t,s=new $t,o=new Je,r=new g1({depthPacking:Jx}),l=new x1,c={},h=e.maxTextureSize,f={[Ki]:In,[In]:Ki,[Ye]:Ye},d=new Ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $t},radius:{value:4}},vertexShader:v1,fragmentShader:y1}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new nn;m.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ye(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Df;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),z=n.state;z.setBlending(qi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=p!==Pi&&this.type===Pi,N=p===Pi&&this.type!==Pi;for(let D=0,k=S.length;D<k;D++){const V=S[D],B=V.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const $=B.getFrameExtents();if(a.multiply($),s.copy(B.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/$.x),a.x=s.x*$.x,B.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/$.y),a.y=s.y*$.y,B.mapSize.y=s.y)),B.map===null||I===!0||N===!0){const mt=this.type!==Pi?{minFilter:si,magFilter:si}:{};B.map!==null&&B.map.dispose(),B.map=new Ma(a.x,a.y,mt),B.map.texture.name=V.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const at=B.getViewportCount();for(let mt=0;mt<at;mt++){const ft=B.getViewport(mt);o.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),z.viewport(o),B.updateMatrices(V,mt),i=B.getFrustum(),v(E,T,B.camera,V,this.type)}B.isPointLightShadow!==!0&&this.type===Pi&&y(B,T),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(M,b,P)};function y(S,E){const T=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ma(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,T,d,_,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,T,u,_,null)}function x(S,E,T,M){let b=null;const P=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)b=P;else if(b=T.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const z=b.uuid,I=E.uuid;let N=c[z];N===void 0&&(N={},c[z]=N);let D=N[I];D===void 0&&(D=b.clone(),N[I]=D,E.addEventListener("dispose",w)),b=D}if(b.visible=E.visible,b.wireframe=E.wireframe,M===Pi?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:f[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,T.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const z=n.properties.get(b);z.light=T}return b}function v(S,E,T,M,b){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===Pi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const I=t.update(S),N=S.material;if(Array.isArray(N)){const D=I.groups;for(let k=0,V=D.length;k<V;k++){const B=D[k],$=N[B.materialIndex];if($&&$.visible){const at=x(S,$,M,b);S.onBeforeShadow(n,S,E,T,I,at,B),n.renderBufferDirect(T,null,I,at,S,B),S.onAfterShadow(n,S,E,T,I,at,B)}}}else if(N.visible){const D=x(S,N,M,b);S.onBeforeShadow(n,S,E,T,I,D,null),n.renderBufferDirect(T,null,I,D,S,null),S.onAfterShadow(n,S,E,T,I,D,null)}}const z=S.children;for(let I=0,N=z.length;I<N;I++)v(z[I],E,T,M,b)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const M=c[T],b=S.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const M1={[ol]:rl,[cl]:dl,[ll]:ul,[hs]:hl,[rl]:ol,[dl]:cl,[ul]:ll,[hl]:hs};function b1(n,t){function e(){let U=!1;const bt=new Je;let it=null;const ht=new Je(0,0,0,0);return{setMask:function(Rt){it!==Rt&&!U&&(n.colorMask(Rt,Rt,Rt,Rt),it=Rt)},setLocked:function(Rt){U=Rt},setClear:function(Rt,At,Qt,se,ue){ue===!0&&(Rt*=se,At*=se,Qt*=se),bt.set(Rt,At,Qt,se),ht.equals(bt)===!1&&(n.clearColor(Rt,At,Qt,se),ht.copy(bt))},reset:function(){U=!1,it=null,ht.set(-1,0,0,0)}}}function i(){let U=!1,bt=!1,it=null,ht=null,Rt=null;return{setReversed:function(At){if(bt!==At){const Qt=t.get("EXT_clip_control");bt?Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.ZERO_TO_ONE_EXT):Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.NEGATIVE_ONE_TO_ONE_EXT);const se=Rt;Rt=null,this.setClear(se)}bt=At},getReversed:function(){return bt},setTest:function(At){At?j(n.DEPTH_TEST):H(n.DEPTH_TEST)},setMask:function(At){it!==At&&!U&&(n.depthMask(At),it=At)},setFunc:function(At){if(bt&&(At=M1[At]),ht!==At){switch(At){case ol:n.depthFunc(n.NEVER);break;case rl:n.depthFunc(n.ALWAYS);break;case cl:n.depthFunc(n.LESS);break;case hs:n.depthFunc(n.LEQUAL);break;case ll:n.depthFunc(n.EQUAL);break;case hl:n.depthFunc(n.GEQUAL);break;case dl:n.depthFunc(n.GREATER);break;case ul:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ht=At}},setLocked:function(At){U=At},setClear:function(At){Rt!==At&&(bt&&(At=1-At),n.clearDepth(At),Rt=At)},reset:function(){U=!1,it=null,ht=null,Rt=null,bt=!1}}}function a(){let U=!1,bt=null,it=null,ht=null,Rt=null,At=null,Qt=null,se=null,ue=null;return{setTest:function(oe){U||(oe?j(n.STENCIL_TEST):H(n.STENCIL_TEST))},setMask:function(oe){bt!==oe&&!U&&(n.stencilMask(oe),bt=oe)},setFunc:function(oe,Ee,Be){(it!==oe||ht!==Ee||Rt!==Be)&&(n.stencilFunc(oe,Ee,Be),it=oe,ht=Ee,Rt=Be)},setOp:function(oe,Ee,Be){(At!==oe||Qt!==Ee||se!==Be)&&(n.stencilOp(oe,Ee,Be),At=oe,Qt=Ee,se=Be)},setLocked:function(oe){U=oe},setClear:function(oe){ue!==oe&&(n.clearStencil(oe),ue=oe)},reset:function(){U=!1,bt=null,it=null,ht=null,Rt=null,At=null,Qt=null,se=null,ue=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new ie(0,0,0),T=0,M=!1,b=null,P=null,z=null,I=null,N=null;const D=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,V=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(B)[1]),k=V>=1):B.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),k=V>=2);let $=null,at={};const mt=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),pt=new Je().fromArray(mt),et=new Je().fromArray(ft);function K(U,bt,it,ht){const Rt=new Uint8Array(4),At=n.createTexture();n.bindTexture(U,At),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Qt=0;Qt<it;Qt++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,ht,0,n.RGBA,n.UNSIGNED_BYTE,Rt):n.texImage2D(bt+Qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Rt);return At}const gt={};gt[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),gt[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),gt[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),j(n.DEPTH_TEST),o.setFunc(hs),Wt(!1),Nt(kd),j(n.CULL_FACE),F(qi);function j(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function H(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function ot(U,bt){return f[U]!==bt?(n.bindFramebuffer(U,bt),f[U]=bt,U===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=bt),U===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function wt(U,bt){let it=u,ht=!1;if(U){it=d.get(bt),it===void 0&&(it=[],d.set(bt,it));const Rt=U.textures;if(it.length!==Rt.length||it[0]!==n.COLOR_ATTACHMENT0){for(let At=0,Qt=Rt.length;At<Qt;At++)it[At]=n.COLOR_ATTACHMENT0+At;it.length=Rt.length,ht=!0}}else it[0]!==n.BACK&&(it[0]=n.BACK,ht=!0);ht&&n.drawBuffers(it)}function Ot(U){return m!==U?(n.useProgram(U),m=U,!0):!1}const Mt={[pa]:n.FUNC_ADD,[wx]:n.FUNC_SUBTRACT,[Ex]:n.FUNC_REVERSE_SUBTRACT};Mt[Tx]=n.MIN,Mt[Ax]=n.MAX;const Lt={[Rx]:n.ZERO,[Px]:n.ONE,[Cx]:n.SRC_COLOR,[al]:n.SRC_ALPHA,[Fx]:n.SRC_ALPHA_SATURATE,[Ix]:n.DST_COLOR,[Dx]:n.DST_ALPHA,[Lx]:n.ONE_MINUS_SRC_COLOR,[sl]:n.ONE_MINUS_SRC_ALPHA,[zx]:n.ONE_MINUS_DST_COLOR,[kx]:n.ONE_MINUS_DST_ALPHA,[Ux]:n.CONSTANT_COLOR,[Nx]:n.ONE_MINUS_CONSTANT_COLOR,[Ox]:n.CONSTANT_ALPHA,[Bx]:n.ONE_MINUS_CONSTANT_ALPHA};function F(U,bt,it,ht,Rt,At,Qt,se,ue,oe){if(U===qi){_===!0&&(H(n.BLEND),_=!1);return}if(_===!1&&(j(n.BLEND),_=!0),U!==Sx){if(U!==g||oe!==M){if((p!==pa||v!==pa)&&(n.blendEquation(n.FUNC_ADD),p=pa,v=pa),oe)switch(U){case as:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.ONE,n.ONE);break;case Id:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case as:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Id:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,x=null,w=null,S=null,E.set(0,0,0),T=0,g=U,M=oe}return}Rt=Rt||bt,At=At||it,Qt=Qt||ht,(bt!==p||Rt!==v)&&(n.blendEquationSeparate(Mt[bt],Mt[Rt]),p=bt,v=Rt),(it!==y||ht!==x||At!==w||Qt!==S)&&(n.blendFuncSeparate(Lt[it],Lt[ht],Lt[At],Lt[Qt]),y=it,x=ht,w=At,S=Qt),(se.equals(E)===!1||ue!==T)&&(n.blendColor(se.r,se.g,se.b,ue),E.copy(se),T=ue),g=U,M=!1}function le(U,bt){U.side===Ye?H(n.CULL_FACE):j(n.CULL_FACE);let it=U.side===In;bt&&(it=!it),Wt(it),U.blending===as&&U.transparent===!1?F(qi):F(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ht=U.stencilWrite;r.setTest(ht),ht&&(r.setMask(U.stencilWriteMask),r.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),r.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Dt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):H(n.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(U){b!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),b=U)}function Nt(U){U!==Mx?(j(n.CULL_FACE),U!==P&&(U===kd?n.cullFace(n.BACK):U===bx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):H(n.CULL_FACE),P=U}function Ct(U){U!==z&&(k&&n.lineWidth(U),z=U)}function Dt(U,bt,it){U?(j(n.POLYGON_OFFSET_FILL),(I!==bt||N!==it)&&(n.polygonOffset(bt,it),I=bt,N=it)):H(n.POLYGON_OFFSET_FILL)}function Tt(U){U?j(n.SCISSOR_TEST):H(n.SCISSOR_TEST)}function C(U){U===void 0&&(U=n.TEXTURE0+D-1),$!==U&&(n.activeTexture(U),$=U)}function A(U,bt,it){it===void 0&&($===null?it=n.TEXTURE0+D-1:it=$);let ht=at[it];ht===void 0&&(ht={type:void 0,texture:void 0},at[it]=ht),(ht.type!==U||ht.texture!==bt)&&($!==it&&(n.activeTexture(it),$=it),n.bindTexture(U,bt||gt[U]),ht.type=U,ht.texture=bt)}function Z(){const U=at[$];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function dt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function nt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ft(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(U){pt.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),pt.copy(U))}function xt(U){et.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),et.copy(U))}function Xt(U,bt){let it=c.get(bt);it===void 0&&(it=new WeakMap,c.set(bt,it));let ht=it.get(U);ht===void 0&&(ht=n.getUniformBlockIndex(bt,U.name),it.set(U,ht))}function Ut(U,bt){const ht=c.get(bt).get(U);l.get(bt)!==ht&&(n.uniformBlockBinding(bt,ht,U.__bindingPointIndex),l.set(bt,ht))}function Zt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},$=null,at={},f={},d=new WeakMap,u=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new ie(0,0,0),T=0,M=!1,b=null,P=null,z=null,I=null,N=null,pt.set(0,0,n.canvas.width,n.canvas.height),et.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:j,disable:H,bindFramebuffer:ot,drawBuffers:wt,useProgram:Ot,setBlending:F,setMaterial:le,setFlipSided:Wt,setCullFace:Nt,setLineWidth:Ct,setPolygonOffset:Dt,setScissorTest:Tt,activeTexture:C,bindTexture:A,unbindTexture:Z,compressedTexImage2D:dt,compressedTexImage3D:Q,texImage2D:St,texImage3D:O,updateUBOMapping:Xt,uniformBlockBinding:Ut,texStorage2D:Ft,texStorage3D:st,texSubImage2D:rt,texSubImage3D:zt,compressedTexSubImage2D:nt,compressedTexSubImage3D:vt,scissor:lt,viewport:xt,reset:Zt}}function Lu(n,t,e,i){const a=S1(i);switch(e){case Nf:return n*t;case Bf:return n*t;case Hf:return n*t*2;case Gf:return n*t/a.components*a.byteLength;case fh:return n*t/a.components*a.byteLength;case Vf:return n*t*2/a.components*a.byteLength;case ph:return n*t*2/a.components*a.byteLength;case Of:return n*t*3/a.components*a.byteLength;case ai:return n*t*4/a.components*a.byteLength;case mh:return n*t*4/a.components*a.byteLength;case Qo:case tr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case er:case nr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case vl:case _l:return Math.max(n,16)*Math.max(t,8)/4;case xl:case yl:return Math.max(n,8)*Math.max(t,8)/2;case Ml:case bl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Sl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case El:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Al:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Pl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Dl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case kl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Il:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case zl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Fl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case ir:case Nl:case Ol:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Xf:case Bl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Hl:case Gl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function S1(n){switch(n){case Ii:case zf:return{byteLength:1,components:1};case Zs:case Ff:case no:return{byteLength:2,components:1};case dh:case uh:return{byteLength:2,components:4};case _a:case hh:case Li:return{byteLength:4,components:1};case Uf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function w1(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $t,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,A){return u?new OffscreenCanvas(C,A):xr("canvas")}function _(C,A,Z){let dt=1;const Q=Tt(C);if((Q.width>Z||Q.height>Z)&&(dt=Z/Math.max(Q.width,Q.height)),dt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const rt=Math.floor(dt*Q.width),zt=Math.floor(dt*Q.height);f===void 0&&(f=m(rt,zt));const nt=A?m(rt,zt):f;return nt.width=rt,nt.height=zt,nt.getContext("2d").drawImage(C,0,0,rt,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+rt+"x"+zt+")."),nt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(C,A,Z,dt,Q=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let rt=A;if(A===n.RED&&(Z===n.FLOAT&&(rt=n.R32F),Z===n.HALF_FLOAT&&(rt=n.R16F),Z===n.UNSIGNED_BYTE&&(rt=n.R8)),A===n.RED_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.R8UI),Z===n.UNSIGNED_SHORT&&(rt=n.R16UI),Z===n.UNSIGNED_INT&&(rt=n.R32UI),Z===n.BYTE&&(rt=n.R8I),Z===n.SHORT&&(rt=n.R16I),Z===n.INT&&(rt=n.R32I)),A===n.RG&&(Z===n.FLOAT&&(rt=n.RG32F),Z===n.HALF_FLOAT&&(rt=n.RG16F),Z===n.UNSIGNED_BYTE&&(rt=n.RG8)),A===n.RG_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RG8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RG16UI),Z===n.UNSIGNED_INT&&(rt=n.RG32UI),Z===n.BYTE&&(rt=n.RG8I),Z===n.SHORT&&(rt=n.RG16I),Z===n.INT&&(rt=n.RG32I)),A===n.RGB_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),Z===n.UNSIGNED_INT&&(rt=n.RGB32UI),Z===n.BYTE&&(rt=n.RGB8I),Z===n.SHORT&&(rt=n.RGB16I),Z===n.INT&&(rt=n.RGB32I)),A===n.RGBA_INTEGER&&(Z===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),Z===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),Z===n.UNSIGNED_INT&&(rt=n.RGBA32UI),Z===n.BYTE&&(rt=n.RGBA8I),Z===n.SHORT&&(rt=n.RGBA16I),Z===n.INT&&(rt=n.RGBA32I)),A===n.RGB&&Z===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),A===n.RGBA){const zt=Q?Rr:we.getTransfer(dt);Z===n.FLOAT&&(rt=n.RGBA32F),Z===n.HALF_FLOAT&&(rt=n.RGBA16F),Z===n.UNSIGNED_BYTE&&(rt=zt===Fe?n.SRGB8_ALPHA8:n.RGBA8),Z===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),Z===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function v(C,A){let Z;return C?A===null||A===_a||A===fs?Z=n.DEPTH24_STENCIL8:A===Li?Z=n.DEPTH32F_STENCIL8:A===Zs&&(Z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===_a||A===fs?Z=n.DEPTH_COMPONENT24:A===Li?Z=n.DEPTH_COMPONENT32F:A===Zs&&(Z=n.DEPTH_COMPONENT16),Z}function w(C,A){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==si&&C.minFilter!==gi?Math.log2(Math.max(A.width,A.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?A.mipmaps.length:1}function S(C){const A=C.target;A.removeEventListener("dispose",S),T(A),A.isVideoTexture&&h.delete(A)}function E(C){const A=C.target;A.removeEventListener("dispose",E),b(A)}function T(C){const A=i.get(C);if(A.__webglInit===void 0)return;const Z=C.source,dt=d.get(Z);if(dt){const Q=dt[A.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(C),Object.keys(dt).length===0&&d.delete(Z)}i.remove(C)}function M(C){const A=i.get(C);n.deleteTexture(A.__webglTexture);const Z=C.source,dt=d.get(Z);delete dt[A.__cacheKey],o.memory.textures--}function b(C){const A=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let dt=0;dt<6;dt++){if(Array.isArray(A.__webglFramebuffer[dt]))for(let Q=0;Q<A.__webglFramebuffer[dt].length;Q++)n.deleteFramebuffer(A.__webglFramebuffer[dt][Q]);else n.deleteFramebuffer(A.__webglFramebuffer[dt]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[dt])}else{if(Array.isArray(A.__webglFramebuffer))for(let dt=0;dt<A.__webglFramebuffer.length;dt++)n.deleteFramebuffer(A.__webglFramebuffer[dt]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let dt=0;dt<A.__webglColorRenderbuffer.length;dt++)A.__webglColorRenderbuffer[dt]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[dt]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const Z=C.textures;for(let dt=0,Q=Z.length;dt<Q;dt++){const rt=i.get(Z[dt]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove(Z[dt])}i.remove(C)}let P=0;function z(){P=0}function I(){const C=P;return C>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+a.maxTextures),P+=1,C}function N(C){const A=[];return A.push(C.wrapS),A.push(C.wrapT),A.push(C.wrapR||0),A.push(C.magFilter),A.push(C.minFilter),A.push(C.anisotropy),A.push(C.internalFormat),A.push(C.format),A.push(C.type),A.push(C.generateMipmaps),A.push(C.premultiplyAlpha),A.push(C.flipY),A.push(C.unpackAlignment),A.push(C.colorSpace),A.join()}function D(C,A){const Z=i.get(C);if(C.isVideoTexture&&Ct(C),C.isRenderTargetTexture===!1&&C.version>0&&Z.__version!==C.version){const dt=C.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et(Z,C,A);return}}e.bindTexture(n.TEXTURE_2D,Z.__webglTexture,n.TEXTURE0+A)}function k(C,A){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){et(Z,C,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Z.__webglTexture,n.TEXTURE0+A)}function V(C,A){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){et(Z,C,A);return}e.bindTexture(n.TEXTURE_3D,Z.__webglTexture,n.TEXTURE0+A)}function B(C,A){const Z=i.get(C);if(C.version>0&&Z.__version!==C.version){K(Z,C,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture,n.TEXTURE0+A)}const $={[ml]:n.REPEAT,[ga]:n.CLAMP_TO_EDGE,[gl]:n.MIRRORED_REPEAT},at={[si]:n.NEAREST,[jx]:n.NEAREST_MIPMAP_NEAREST,[vo]:n.NEAREST_MIPMAP_LINEAR,[gi]:n.LINEAR,[cc]:n.LINEAR_MIPMAP_NEAREST,[xa]:n.LINEAR_MIPMAP_LINEAR},mt={[tv]:n.NEVER,[ov]:n.ALWAYS,[ev]:n.LESS,[Yf]:n.LEQUAL,[nv]:n.EQUAL,[sv]:n.GEQUAL,[iv]:n.GREATER,[av]:n.NOTEQUAL};function ft(C,A){if(A.type===Li&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===gi||A.magFilter===cc||A.magFilter===vo||A.magFilter===xa||A.minFilter===gi||A.minFilter===cc||A.minFilter===vo||A.minFilter===xa)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,$[A.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,$[A.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,$[A.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,at[A.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,at[A.minFilter]),A.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===si||A.minFilter!==vo&&A.minFilter!==xa||A.type===Li&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");n.texParameterf(C,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function pt(C,A){let Z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,A.addEventListener("dispose",S));const dt=A.source;let Q=d.get(dt);Q===void 0&&(Q={},d.set(dt,Q));const rt=N(A);if(rt!==C.__cacheKey){Q[rt]===void 0&&(Q[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),Q[rt].usedTimes++;const zt=Q[C.__cacheKey];zt!==void 0&&(Q[C.__cacheKey].usedTimes--,zt.usedTimes===0&&M(A)),C.__cacheKey=rt,C.__webglTexture=Q[rt].texture}return Z}function et(C,A,Z){let dt=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(dt=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(dt=n.TEXTURE_3D);const Q=pt(C,A),rt=A.source;e.bindTexture(dt,C.__webglTexture,n.TEXTURE0+Z);const zt=i.get(rt);if(rt.version!==zt.__version||Q===!0){e.activeTexture(n.TEXTURE0+Z);const nt=we.getPrimaries(we.workingColorSpace),vt=A.colorSpace===Wi?null:we.getPrimaries(A.colorSpace),Ft=A.colorSpace===Wi||nt===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let st=_(A.image,!1,a.maxTextureSize);st=Dt(A,st);const St=s.convert(A.format,A.colorSpace),O=s.convert(A.type);let lt=x(A.internalFormat,St,O,A.colorSpace,A.isVideoTexture);ft(dt,A);let xt;const Xt=A.mipmaps,Ut=A.isVideoTexture!==!0,Zt=zt.__version===void 0||Q===!0,U=rt.dataReady,bt=w(A,st);if(A.isDepthTexture)lt=v(A.format===ps,A.type),Zt&&(Ut?e.texStorage2D(n.TEXTURE_2D,1,lt,st.width,st.height):e.texImage2D(n.TEXTURE_2D,0,lt,st.width,st.height,0,St,O,null));else if(A.isDataTexture)if(Xt.length>0){Ut&&Zt&&e.texStorage2D(n.TEXTURE_2D,bt,lt,Xt[0].width,Xt[0].height);for(let it=0,ht=Xt.length;it<ht;it++)xt=Xt[it],Ut?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,xt.width,xt.height,St,O,xt.data):e.texImage2D(n.TEXTURE_2D,it,lt,xt.width,xt.height,0,St,O,xt.data);A.generateMipmaps=!1}else Ut?(Zt&&e.texStorage2D(n.TEXTURE_2D,bt,lt,st.width,st.height),U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,st.width,st.height,St,O,st.data)):e.texImage2D(n.TEXTURE_2D,0,lt,st.width,st.height,0,St,O,st.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ut&&Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,lt,Xt[0].width,Xt[0].height,st.depth);for(let it=0,ht=Xt.length;it<ht;it++)if(xt=Xt[it],A.format!==ai)if(St!==null)if(Ut){if(U)if(A.layerUpdates.size>0){const Rt=Lu(xt.width,xt.height,A.format,A.type);for(const At of A.layerUpdates){const Qt=xt.data.subarray(At*Rt/xt.data.BYTES_PER_ELEMENT,(At+1)*Rt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,At,xt.width,xt.height,1,St,Qt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,xt.width,xt.height,st.depth,St,xt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,it,lt,xt.width,xt.height,st.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?U&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,xt.width,xt.height,st.depth,St,O,xt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,it,lt,xt.width,xt.height,st.depth,0,St,O,xt.data)}else{Ut&&Zt&&e.texStorage2D(n.TEXTURE_2D,bt,lt,Xt[0].width,Xt[0].height);for(let it=0,ht=Xt.length;it<ht;it++)xt=Xt[it],A.format!==ai?St!==null?Ut?U&&e.compressedTexSubImage2D(n.TEXTURE_2D,it,0,0,xt.width,xt.height,St,xt.data):e.compressedTexImage2D(n.TEXTURE_2D,it,lt,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,xt.width,xt.height,St,O,xt.data):e.texImage2D(n.TEXTURE_2D,it,lt,xt.width,xt.height,0,St,O,xt.data)}else if(A.isDataArrayTexture)if(Ut){if(Zt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,bt,lt,st.width,st.height,st.depth),U)if(A.layerUpdates.size>0){const it=Lu(st.width,st.height,A.format,A.type);for(const ht of A.layerUpdates){const Rt=st.data.subarray(ht*it/st.data.BYTES_PER_ELEMENT,(ht+1)*it/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ht,st.width,st.height,1,St,O,Rt)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,St,O,st.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,lt,st.width,st.height,st.depth,0,St,O,st.data);else if(A.isData3DTexture)Ut?(Zt&&e.texStorage3D(n.TEXTURE_3D,bt,lt,st.width,st.height,st.depth),U&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,St,O,st.data)):e.texImage3D(n.TEXTURE_3D,0,lt,st.width,st.height,st.depth,0,St,O,st.data);else if(A.isFramebufferTexture){if(Zt)if(Ut)e.texStorage2D(n.TEXTURE_2D,bt,lt,st.width,st.height);else{let it=st.width,ht=st.height;for(let Rt=0;Rt<bt;Rt++)e.texImage2D(n.TEXTURE_2D,Rt,lt,it,ht,0,St,O,null),it>>=1,ht>>=1}}else if(Xt.length>0){if(Ut&&Zt){const it=Tt(Xt[0]);e.texStorage2D(n.TEXTURE_2D,bt,lt,it.width,it.height)}for(let it=0,ht=Xt.length;it<ht;it++)xt=Xt[it],Ut?U&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,St,O,xt):e.texImage2D(n.TEXTURE_2D,it,lt,St,O,xt);A.generateMipmaps=!1}else if(Ut){if(Zt){const it=Tt(st);e.texStorage2D(n.TEXTURE_2D,bt,lt,it.width,it.height)}U&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,St,O,st)}else e.texImage2D(n.TEXTURE_2D,0,lt,St,O,st);g(A)&&p(dt),zt.__version=rt.version,A.onUpdate&&A.onUpdate(A)}C.__version=A.version}function K(C,A,Z){if(A.image.length!==6)return;const dt=pt(C,A),Q=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+Z);const rt=i.get(Q);if(Q.version!==rt.__version||dt===!0){e.activeTexture(n.TEXTURE0+Z);const zt=we.getPrimaries(we.workingColorSpace),nt=A.colorSpace===Wi?null:we.getPrimaries(A.colorSpace),vt=A.colorSpace===Wi||zt===nt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Ft=A.isCompressedTexture||A.image[0].isCompressedTexture,st=A.image[0]&&A.image[0].isDataTexture,St=[];for(let ht=0;ht<6;ht++)!Ft&&!st?St[ht]=_(A.image[ht],!0,a.maxCubemapSize):St[ht]=st?A.image[ht].image:A.image[ht],St[ht]=Dt(A,St[ht]);const O=St[0],lt=s.convert(A.format,A.colorSpace),xt=s.convert(A.type),Xt=x(A.internalFormat,lt,xt,A.colorSpace),Ut=A.isVideoTexture!==!0,Zt=rt.__version===void 0||dt===!0,U=Q.dataReady;let bt=w(A,O);ft(n.TEXTURE_CUBE_MAP,A);let it;if(Ft){Ut&&Zt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Xt,O.width,O.height);for(let ht=0;ht<6;ht++){it=St[ht].mipmaps;for(let Rt=0;Rt<it.length;Rt++){const At=it[Rt];A.format!==ai?lt!==null?Ut?U&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt,0,0,At.width,At.height,lt,At.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt,Xt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ut?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt,0,0,At.width,At.height,lt,xt,At.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt,Xt,At.width,At.height,0,lt,xt,At.data)}}}else{if(it=A.mipmaps,Ut&&Zt){it.length>0&&bt++;const ht=Tt(St[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,bt,Xt,ht.width,ht.height)}for(let ht=0;ht<6;ht++)if(st){Ut?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,St[ht].width,St[ht].height,lt,xt,St[ht].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Xt,St[ht].width,St[ht].height,0,lt,xt,St[ht].data);for(let Rt=0;Rt<it.length;Rt++){const Qt=it[Rt].image[ht].image;Ut?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt+1,0,0,Qt.width,Qt.height,lt,xt,Qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt+1,Xt,Qt.width,Qt.height,0,lt,xt,Qt.data)}}else{Ut?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,lt,xt,St[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,Xt,lt,xt,St[ht]);for(let Rt=0;Rt<it.length;Rt++){const At=it[Rt];Ut?U&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt+1,0,0,lt,xt,At.image[ht]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Rt+1,Xt,lt,xt,At.image[ht])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),rt.__version=Q.version,A.onUpdate&&A.onUpdate(A)}C.__version=A.version}function gt(C,A,Z,dt,Q,rt){const zt=s.convert(Z.format,Z.colorSpace),nt=s.convert(Z.type),vt=x(Z.internalFormat,zt,nt,Z.colorSpace),Ft=i.get(A),st=i.get(Z);if(st.__renderTarget=A,!Ft.__hasExternalTextures){const St=Math.max(1,A.width>>rt),O=Math.max(1,A.height>>rt);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?e.texImage3D(Q,rt,vt,St,O,A.depth,0,zt,nt,null):e.texImage2D(Q,rt,vt,St,O,0,zt,nt,null)}e.bindFramebuffer(n.FRAMEBUFFER,C),Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,Q,st.__webglTexture,0,Wt(A)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,dt,Q,st.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function j(C,A,Z){if(n.bindRenderbuffer(n.RENDERBUFFER,C),A.depthBuffer){const dt=A.depthTexture,Q=dt&&dt.isDepthTexture?dt.type:null,rt=v(A.stencilBuffer,Q),zt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=Wt(A);Nt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,nt,rt,A.width,A.height):Z?n.renderbufferStorageMultisample(n.RENDERBUFFER,nt,rt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,rt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,C)}else{const dt=A.textures;for(let Q=0;Q<dt.length;Q++){const rt=dt[Q],zt=s.convert(rt.format,rt.colorSpace),nt=s.convert(rt.type),vt=x(rt.internalFormat,zt,nt,rt.colorSpace),Ft=Wt(A);Z&&Nt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,vt,A.width,A.height):Nt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ft,vt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,vt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function H(C,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,C),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const dt=i.get(A.depthTexture);dt.__renderTarget=A,(!dt.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),D(A.depthTexture,0);const Q=dt.__webglTexture,rt=Wt(A);if(A.depthTexture.format===ss)Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(A.depthTexture.format===ps)Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function ot(C){const A=i.get(C),Z=C.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==C.depthTexture){const dt=C.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),dt){const Q=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,dt.removeEventListener("dispose",Q)};dt.addEventListener("dispose",Q),A.__depthDisposeCallback=Q}A.__boundDepthTexture=dt}if(C.depthTexture&&!A.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");H(A.__webglFramebuffer,C)}else if(Z){A.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[dt]),A.__webglDepthbuffer[dt]===void 0)A.__webglDepthbuffer[dt]=n.createRenderbuffer(),j(A.__webglDepthbuffer[dt],C,!1);else{const Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=A.__webglDepthbuffer[dt];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),j(A.__webglDepthbuffer,C,!1);else{const dt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,dt,n.RENDERBUFFER,Q)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function wt(C,A,Z){const dt=i.get(C);A!==void 0&&gt(dt.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Z!==void 0&&ot(C)}function Ot(C){const A=C.texture,Z=i.get(C),dt=i.get(A);C.addEventListener("dispose",E);const Q=C.textures,rt=C.isWebGLCubeRenderTarget===!0,zt=Q.length>1;if(zt||(dt.__webglTexture===void 0&&(dt.__webglTexture=n.createTexture()),dt.__version=A.version,o.memory.textures++),rt){Z.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(A.mipmaps&&A.mipmaps.length>0){Z.__webglFramebuffer[nt]=[];for(let vt=0;vt<A.mipmaps.length;vt++)Z.__webglFramebuffer[nt][vt]=n.createFramebuffer()}else Z.__webglFramebuffer[nt]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){Z.__webglFramebuffer=[];for(let nt=0;nt<A.mipmaps.length;nt++)Z.__webglFramebuffer[nt]=n.createFramebuffer()}else Z.__webglFramebuffer=n.createFramebuffer();if(zt)for(let nt=0,vt=Q.length;nt<vt;nt++){const Ft=i.get(Q[nt]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&Nt(C)===!1){Z.__webglMultisampledFramebuffer=n.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let nt=0;nt<Q.length;nt++){const vt=Q[nt];Z.__webglColorRenderbuffer[nt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Z.__webglColorRenderbuffer[nt]);const Ft=s.convert(vt.format,vt.colorSpace),st=s.convert(vt.type),St=x(vt.internalFormat,Ft,st,vt.colorSpace,C.isXRRenderTarget===!0),O=Wt(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,St,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+nt,n.RENDERBUFFER,Z.__webglColorRenderbuffer[nt])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(Z.__webglDepthRenderbuffer=n.createRenderbuffer(),j(Z.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,dt.__webglTexture),ft(n.TEXTURE_CUBE_MAP,A);for(let nt=0;nt<6;nt++)if(A.mipmaps&&A.mipmaps.length>0)for(let vt=0;vt<A.mipmaps.length;vt++)gt(Z.__webglFramebuffer[nt][vt],C,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,vt);else gt(Z.__webglFramebuffer[nt],C,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let nt=0,vt=Q.length;nt<vt;nt++){const Ft=Q[nt],st=i.get(Ft);e.bindTexture(n.TEXTURE_2D,st.__webglTexture),ft(n.TEXTURE_2D,Ft),gt(Z.__webglFramebuffer,C,Ft,n.COLOR_ATTACHMENT0+nt,n.TEXTURE_2D,0),g(Ft)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let nt=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(nt=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(nt,dt.__webglTexture),ft(nt,A),A.mipmaps&&A.mipmaps.length>0)for(let vt=0;vt<A.mipmaps.length;vt++)gt(Z.__webglFramebuffer[vt],C,A,n.COLOR_ATTACHMENT0,nt,vt);else gt(Z.__webglFramebuffer,C,A,n.COLOR_ATTACHMENT0,nt,0);g(A)&&p(nt),e.unbindTexture()}C.depthBuffer&&ot(C)}function Mt(C){const A=C.textures;for(let Z=0,dt=A.length;Z<dt;Z++){const Q=A[Z];if(g(Q)){const rt=y(C),zt=i.get(Q).__webglTexture;e.bindTexture(rt,zt),p(rt),e.unbindTexture()}}}const Lt=[],F=[];function le(C){if(C.samples>0){if(Nt(C)===!1){const A=C.textures,Z=C.width,dt=C.height;let Q=n.COLOR_BUFFER_BIT;const rt=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(C),nt=A.length>1;if(nt)for(let vt=0;vt<A.length;vt++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let vt=0;vt<A.length;vt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),nt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[vt]);const Ft=i.get(A[vt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ft,0)}n.blitFramebuffer(0,0,Z,dt,0,0,Z,dt,Q,n.NEAREST),l===!0&&(Lt.length=0,F.length=0,Lt.push(n.COLOR_ATTACHMENT0+vt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Lt.push(rt),F.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,F)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Lt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),nt)for(let vt=0;vt<A.length;vt++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,zt.__webglColorRenderbuffer[vt]);const Ft=i.get(A[vt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,Ft,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const A=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Wt(C){return Math.min(a.maxSamples,C.samples)}function Nt(C){const A=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ct(C){const A=o.render.frame;h.get(C)!==A&&(h.set(C,A),C.update())}function Dt(C,A){const Z=C.colorSpace,dt=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||Z!==gs&&Z!==Wi&&(we.getTransfer(Z)===Fe?(dt!==ai||Q!==Ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),A}function Tt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=D,this.setTexture2DArray=k,this.setTexture3D=V,this.setTextureCube=B,this.rebindTextures=wt,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=le,this.setupDepthRenderbuffer=ot,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=Nt}function E1(n,t){function e(i,a=Wi){let s;const o=we.getTransfer(a);if(i===Ii)return n.UNSIGNED_BYTE;if(i===dh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===uh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Uf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zf)return n.BYTE;if(i===Ff)return n.SHORT;if(i===Zs)return n.UNSIGNED_SHORT;if(i===hh)return n.INT;if(i===_a)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===no)return n.HALF_FLOAT;if(i===Nf)return n.ALPHA;if(i===Of)return n.RGB;if(i===ai)return n.RGBA;if(i===Bf)return n.LUMINANCE;if(i===Hf)return n.LUMINANCE_ALPHA;if(i===ss)return n.DEPTH_COMPONENT;if(i===ps)return n.DEPTH_STENCIL;if(i===Gf)return n.RED;if(i===fh)return n.RED_INTEGER;if(i===Vf)return n.RG;if(i===ph)return n.RG_INTEGER;if(i===mh)return n.RGBA_INTEGER;if(i===Qo||i===tr||i===er||i===nr)if(o===Fe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Qo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===tr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===er)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===nr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Qo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===tr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===er)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===nr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xl||i===vl||i===yl||i===_l)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===xl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===yl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_l)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ml||i===bl||i===Sl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ml||i===bl)return o===Fe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Sl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===wl||i===El||i===Tl||i===Al||i===Rl||i===Pl||i===Cl||i===Ll||i===Dl||i===kl||i===Il||i===zl||i===Fl||i===Ul)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===wl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===El)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Tl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Al)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Rl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Pl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Cl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ll)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===kl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Il)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===zl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Fl)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ul)return o===Fe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ir||i===Nl||i===Ol)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===ir)return o===Fe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Nl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ol)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Xf||i===Bl||i===Hl||i===Gl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===ir)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Bl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Hl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Gl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===fs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class T1 extends $n{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ue extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const A1={type:"move"};class zc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(A1)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ue;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const R1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,P1=`
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

}`;class C1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Ln,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ji({vertexShader:R1,fragmentShader:P1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ye(new Yn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class L1 extends xs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const _=new C1,g=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new $t;let S=null;const E=new $n;E.viewport=new Je;const T=new $n;T.viewport=new Je;const M=[E,T],b=new T1;let P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let K=x[et];return K===void 0&&(K=new zc,x[et]=K),K.getTargetRaySpace()},this.getControllerGrip=function(et){let K=x[et];return K===void 0&&(K=new zc,x[et]=K),K.getGripSpace()},this.getHand=function(et){let K=x[et];return K===void 0&&(K=new zc,x[et]=K),K.getHandSpace()};function I(et){const K=v.indexOf(et.inputSource);if(K===-1)return;const gt=x[K];gt!==void 0&&(gt.update(et.inputSource,et.frame,c||o),gt.dispatchEvent({type:et.type,data:et.inputSource}))}function N(){a.removeEventListener("select",I),a.removeEventListener("selectstart",I),a.removeEventListener("selectend",I),a.removeEventListener("squeeze",I),a.removeEventListener("squeezestart",I),a.removeEventListener("squeezeend",I),a.removeEventListener("end",N),a.removeEventListener("inputsourceschange",D);for(let et=0;et<x.length;et++){const K=v[et];K!==null&&(v[et]=null,x[et].disconnect(K))}P=null,z=null,_.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,y=null,pt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){s=et,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){r=et,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(et){c=et},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(et){if(a=et,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",I),a.addEventListener("selectstart",I),a.addEventListener("selectend",I),a.addEventListener("squeeze",I),a.addEventListener("squeezestart",I),a.addEventListener("squeezeend",I),a.addEventListener("end",N),a.addEventListener("inputsourceschange",D),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const K={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,K),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new Ma(u.framebufferWidth,u.framebufferHeight,{format:ai,type:Ii,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let K=null,gt=null,j=null;g.depth&&(j=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=g.stencil?ps:ss,gt=g.stencil?fs:_a);const H={colorFormat:e.RGBA8,depthFormat:j,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(H),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ma(d.textureWidth,d.textureHeight,{format:ai,type:Ii,depthTexture:new ap(d.textureWidth,d.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),pt.setContext(a),pt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function D(et){for(let K=0;K<et.removed.length;K++){const gt=et.removed[K],j=v.indexOf(gt);j>=0&&(v[j]=null,x[j].disconnect(gt))}for(let K=0;K<et.added.length;K++){const gt=et.added[K];let j=v.indexOf(gt);if(j===-1){for(let ot=0;ot<x.length;ot++)if(ot>=v.length){v.push(gt),j=ot;break}else if(v[ot]===null){v[ot]=gt,j=ot;break}if(j===-1)break}const H=x[j];H&&H.connect(gt)}}const k=new G,V=new G;function B(et,K,gt){k.setFromMatrixPosition(K.matrixWorld),V.setFromMatrixPosition(gt.matrixWorld);const j=k.distanceTo(V),H=K.projectionMatrix.elements,ot=gt.projectionMatrix.elements,wt=H[14]/(H[10]-1),Ot=H[14]/(H[10]+1),Mt=(H[9]+1)/H[5],Lt=(H[9]-1)/H[5],F=(H[8]-1)/H[0],le=(ot[8]+1)/ot[0],Wt=wt*F,Nt=wt*le,Ct=j/(-F+le),Dt=Ct*-F;if(K.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Dt),et.translateZ(Ct),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),H[10]===-1)et.projectionMatrix.copy(K.projectionMatrix),et.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const Tt=wt+Ct,C=Ot+Ct,A=Wt-Dt,Z=Nt+(j-Dt),dt=Mt*Ot/C*Tt,Q=Lt*Ot/C*Tt;et.projectionMatrix.makePerspective(A,Z,dt,Q,Tt,C),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function $(et,K){K===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(K.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(a===null)return;let K=et.near,gt=et.far;_.texture!==null&&(_.depthNear>0&&(K=_.depthNear),_.depthFar>0&&(gt=_.depthFar)),b.near=T.near=E.near=K,b.far=T.far=E.far=gt,(P!==b.near||z!==b.far)&&(a.updateRenderState({depthNear:b.near,depthFar:b.far}),P=b.near,z=b.far),E.layers.mask=et.layers.mask|2,T.layers.mask=et.layers.mask|4,b.layers.mask=E.layers.mask|T.layers.mask;const j=et.parent,H=b.cameras;$(b,j);for(let ot=0;ot<H.length;ot++)$(H[ot],j);H.length===2?B(b,E,T):b.projectionMatrix.copy(E.projectionMatrix),at(et,b,j)};function at(et,K,gt){gt===null?et.matrix.copy(K.matrixWorld):(et.matrix.copy(gt.matrixWorld),et.matrix.invert(),et.matrix.multiply(K.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(K.projectionMatrix),et.projectionMatrixInverse.copy(K.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=qs*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(et){l=et,d!==null&&(d.fixedFoveation=et),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=et)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let mt=null;function ft(et,K){if(h=K.getViewerPose(c||o),m=K,h!==null){const gt=h.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let j=!1;gt.length!==b.cameras.length&&(b.cameras.length=0,j=!0);for(let ot=0;ot<gt.length;ot++){const wt=gt[ot];let Ot=null;if(u!==null)Ot=u.getViewport(wt);else{const Lt=f.getViewSubImage(d,wt);Ot=Lt.viewport,ot===0&&(t.setRenderTargetTextures(y,Lt.colorTexture,d.ignoreDepthValues?void 0:Lt.depthStencilTexture),t.setRenderTarget(y))}let Mt=M[ot];Mt===void 0&&(Mt=new $n,Mt.layers.enable(ot),Mt.viewport=new Je,M[ot]=Mt),Mt.matrix.fromArray(wt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(wt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),ot===0&&(b.matrix.copy(Mt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),j===!0&&b.cameras.push(Mt)}const H=a.enabledFeatures;if(H&&H.includes("depth-sensing")){const ot=f.getDepthInformation(gt[0]);ot&&ot.isValid&&ot.texture&&_.init(t,ot,a.renderState)}}for(let gt=0;gt<x.length;gt++){const j=v[gt],H=x[gt];j!==null&&H!==void 0&&H.update(j,K,c||o)}mt&&mt(et,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),m=null}const pt=new np;pt.setAnimationLoop(ft),this.setAnimationLoop=function(et){mt=et},this.dispose=function(){}}}const ra=new yi,D1=new Oe;function k1(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Qf(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),f(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,y,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===In&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===In&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(g.envMap.value=x,ra.copy(v),ra.x*=-1,ra.y*=-1,ra.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ra.y*=-1,ra.z*=-1),g.envMapRotation.value.setFromMatrix4(D1.makeRotationFromEuler(ra)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===In&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function I1(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(m(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=f();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function f(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=v.length;S<E;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let M=0,b=T.length;M<b;M++){const P=T[M];if(u(P,S,M,w)===!0){const z=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let N=0;for(let D=0;D<I.length;D++){const k=I[D],V=_(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,z+N,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,N),N+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,x,v,w){const S=y.value,E=x+"_"+v;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const T=w[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(y){const x=y.uniforms;let v=0;const w=16;for(let E=0,T=x.length;E<T;E++){const M=Array.isArray(x[E])?x[E]:[x[E]];for(let b=0,P=M.length;b<P;b++){const z=M[b],I=Array.isArray(z.value)?z.value:[z.value];for(let N=0,D=I.length;N<D;N++){const k=I[N],V=_(k),B=v%w,$=B%V.boundary,at=B+$;v+=$,at!==0&&w-at<V.storage&&(v+=w-at),z.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=V.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class z1{constructor(t={}){const{canvas:e=Sv(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pn,this.toneMapping=ji,this.toneMappingExposure=1;const v=this;let w=!1,S=0,E=0,T=null,M=-1,b=null;const P=new Je,z=new Je;let I=null;const N=new ie(0);let D=0,k=e.width,V=e.height,B=1,$=null,at=null;const mt=new Je(0,0,k,V),ft=new Je(0,0,k,V);let pt=!1;const et=new yh;let K=!1,gt=!1;const j=new Oe,H=new Oe,ot=new G,wt=new Je,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Mt=!1;function Lt(){return T===null?B:1}let F=i;function le(R,Y){return e.getContext(R,Y)}try{const R={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ch}`),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",Rt,!1),e.addEventListener("webglcontextcreationerror",At,!1),F===null){const Y="webgl2";if(F=le(Y,R),F===null)throw le(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Wt,Nt,Ct,Dt,Tt,C,A,Z,dt,Q,rt,zt,nt,vt,Ft,st,St,O,lt,xt,Xt,Ut,Zt,U;function bt(){Wt=new BM(F),Wt.init(),Ut=new E1(F,Wt),Nt=new IM(F,Wt,t,Ut),Ct=new b1(F,Wt),Nt.reverseDepthBuffer&&d&&Ct.buffers.depth.setReversed(!0),Dt=new VM(F),Tt=new r1,C=new w1(F,Wt,Ct,Tt,Nt,Ut,Dt),A=new FM(v),Z=new OM(v),dt=new jv(F),Zt=new DM(F,dt),Q=new HM(F,dt,Dt,Zt),rt=new WM(F,Q,dt,Dt),lt=new XM(F,Nt,C),st=new zM(Tt),zt=new o1(v,A,Z,Wt,Nt,Zt,st),nt=new k1(v,Tt),vt=new l1,Ft=new m1(Wt),O=new LM(v,A,Z,Ct,rt,u,l),St=new _1(v,rt,Nt),U=new I1(F,Dt,Nt,Ct),xt=new kM(F,Wt,Dt),Xt=new GM(F,Wt,Dt),Dt.programs=zt.programs,v.capabilities=Nt,v.extensions=Wt,v.properties=Tt,v.renderLists=vt,v.shadowMap=St,v.state=Ct,v.info=Dt}bt();const it=new L1(v,F);this.xr=it,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const R=Wt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Wt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(R){R!==void 0&&(B=R,this.setSize(k,V,!1))},this.getSize=function(R){return R.set(k,V)},this.setSize=function(R,Y,J=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=R,V=Y,e.width=Math.floor(R*B),e.height=Math.floor(Y*B),J===!0&&(e.style.width=R+"px",e.style.height=Y+"px"),this.setViewport(0,0,R,Y)},this.getDrawingBufferSize=function(R){return R.set(k*B,V*B).floor()},this.setDrawingBufferSize=function(R,Y,J){k=R,V=Y,B=J,e.width=Math.floor(R*J),e.height=Math.floor(Y*J),this.setViewport(0,0,R,Y)},this.getCurrentViewport=function(R){return R.copy(P)},this.getViewport=function(R){return R.copy(mt)},this.setViewport=function(R,Y,J,tt){R.isVector4?mt.set(R.x,R.y,R.z,R.w):mt.set(R,Y,J,tt),Ct.viewport(P.copy(mt).multiplyScalar(B).round())},this.getScissor=function(R){return R.copy(ft)},this.setScissor=function(R,Y,J,tt){R.isVector4?ft.set(R.x,R.y,R.z,R.w):ft.set(R,Y,J,tt),Ct.scissor(z.copy(ft).multiplyScalar(B).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(R){Ct.setScissorTest(pt=R)},this.setOpaqueSort=function(R){$=R},this.setTransparentSort=function(R){at=R},this.getClearColor=function(R){return R.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(R=!0,Y=!0,J=!0){let tt=0;if(R){let W=!1;if(T!==null){const Pt=T.texture.format;W=Pt===mh||Pt===ph||Pt===fh}if(W){const Pt=T.texture.type,It=Pt===Ii||Pt===_a||Pt===Zs||Pt===fs||Pt===dh||Pt===uh,Yt=O.getClearColor(),qt=O.getClearAlpha(),Ht=Yt.r,Vt=Yt.g,Gt=Yt.b;It?(m[0]=Ht,m[1]=Vt,m[2]=Gt,m[3]=qt,F.clearBufferuiv(F.COLOR,0,m)):(_[0]=Ht,_[1]=Vt,_[2]=Gt,_[3]=qt,F.clearBufferiv(F.COLOR,0,_))}else tt|=F.COLOR_BUFFER_BIT}Y&&(tt|=F.DEPTH_BUFFER_BIT),J&&(tt|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(tt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",Rt,!1),e.removeEventListener("webglcontextcreationerror",At,!1),vt.dispose(),Ft.dispose(),Tt.dispose(),A.dispose(),Z.dispose(),rt.dispose(),Zt.dispose(),U.dispose(),zt.dispose(),it.dispose(),it.removeEventListener("sessionstart",gn),it.removeEventListener("sessionend",Ae),ze.stop()};function ht(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Rt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const R=Dt.autoReset,Y=St.enabled,J=St.autoUpdate,tt=St.needsUpdate,W=St.type;bt(),Dt.autoReset=R,St.enabled=Y,St.autoUpdate=J,St.needsUpdate=tt,St.type=W}function At(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Qt(R){const Y=R.target;Y.removeEventListener("dispose",Qt),se(Y)}function se(R){ue(R),Tt.remove(R)}function ue(R){const Y=Tt.get(R).programs;Y!==void 0&&(Y.forEach(function(J){zt.releaseProgram(J)}),R.isShaderMaterial&&zt.releaseShaderCache(R))}this.renderBufferDirect=function(R,Y,J,tt,W,Pt){Y===null&&(Y=Ot);const It=W.isMesh&&W.matrixWorld.determinant()<0,Yt=Kt(R,Y,J,tt,W);Ct.setMaterial(tt,It);let qt=J.index,Ht=1;if(tt.wireframe===!0){if(qt=Q.getWireframeAttribute(J),qt===void 0)return;Ht=2}const Vt=J.drawRange,Gt=J.attributes.position;let re=Vt.start*Ht,_e=(Vt.start+Vt.count)*Ht;Pt!==null&&(re=Math.max(re,Pt.start*Ht),_e=Math.min(_e,(Pt.start+Pt.count)*Ht)),qt!==null?(re=Math.max(re,0),_e=Math.min(_e,qt.count)):Gt!=null&&(re=Math.max(re,0),_e=Math.min(_e,Gt.count));const xe=_e-re;if(xe<0||xe===1/0)return;Zt.setup(W,tt,Yt,J,qt);let Le,_t=xt;if(qt!==null&&(Le=dt.get(qt),_t=Xt,_t.setIndex(Le)),W.isMesh)tt.wireframe===!0?(Ct.setLineWidth(tt.wireframeLinewidth*Lt()),_t.setMode(F.LINES)):_t.setMode(F.TRIANGLES);else if(W.isLine){let ct=tt.linewidth;ct===void 0&&(ct=1),Ct.setLineWidth(ct*Lt()),W.isLineSegments?_t.setMode(F.LINES):W.isLineLoop?_t.setMode(F.LINE_LOOP):_t.setMode(F.LINE_STRIP)}else W.isPoints?_t.setMode(F.POINTS):W.isSprite&&_t.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)_t.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(Wt.get("WEBGL_multi_draw"))_t.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const ct=W._multiDrawStarts,te=W._multiDrawCounts,ae=W._multiDrawCount,ve=qt?dt.get(qt).bytesPerElement:1,bn=Tt.get(tt).currentProgram.getUniforms();for(let He=0;He<ae;He++)bn.setValue(F,"_gl_DrawID",He),_t.render(ct[He]/ve,te[He])}else if(W.isInstancedMesh)_t.renderInstances(re,xe,W.count);else if(J.isInstancedBufferGeometry){const ct=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,te=Math.min(J.instanceCount,ct);_t.renderInstances(re,xe,te)}else _t.render(re,xe)};function oe(R,Y,J){R.transparent===!0&&R.side===Ye&&R.forceSinglePass===!1?(R.side=In,R.needsUpdate=!0,kt(R,Y,J),R.side=Ki,R.needsUpdate=!0,kt(R,Y,J),R.side=Ye):kt(R,Y,J)}this.compile=function(R,Y,J=null){J===null&&(J=R),p=Ft.get(J),p.init(Y),x.push(p),J.traverseVisible(function(W){W.isLight&&W.layers.test(Y.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),R!==J&&R.traverseVisible(function(W){W.isLight&&W.layers.test(Y.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const tt=new Set;return R.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const Pt=W.material;if(Pt)if(Array.isArray(Pt))for(let It=0;It<Pt.length;It++){const Yt=Pt[It];oe(Yt,J,W),tt.add(Yt)}else oe(Pt,J,W),tt.add(Pt)}),x.pop(),p=null,tt},this.compileAsync=function(R,Y,J=null){const tt=this.compile(R,Y,J);return new Promise(W=>{function Pt(){if(tt.forEach(function(It){Tt.get(It).currentProgram.isReady()&&tt.delete(It)}),tt.size===0){W(R);return}setTimeout(Pt,10)}Wt.get("KHR_parallel_shader_compile")!==null?Pt():setTimeout(Pt,10)})};let Ee=null;function Be(R){Ee&&Ee(R)}function gn(){ze.stop()}function Ae(){ze.start()}const ze=new np;ze.setAnimationLoop(Be),typeof self<"u"&&ze.setContext(self),this.setAnimationLoop=function(R){Ee=R,it.setAnimationLoop(R),R===null?ze.stop():ze.start()},it.addEventListener("sessionstart",gn),it.addEventListener("sessionend",Ae),this.render=function(R,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(Y),Y=it.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,Y,T),p=Ft.get(R,x.length),p.init(Y),x.push(p),H.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),et.setFromProjectionMatrix(H),gt=this.localClippingEnabled,K=st.init(this.clippingPlanes,gt),g=vt.get(R,y.length),g.init(),y.push(g),it.enabled===!0&&it.isPresenting===!0){const Pt=v.xr.getDepthSensingMesh();Pt!==null&&Re(Pt,Y,-1/0,v.sortObjects)}Re(R,Y,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort($,at),Mt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,Mt&&O.addToRenderList(g,R),this.info.render.frame++,K===!0&&st.beginShadows();const J=p.state.shadowsArray;St.render(J,R,Y),K===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const tt=g.opaque,W=g.transmissive;if(p.setupLights(),Y.isArrayCamera){const Pt=Y.cameras;if(W.length>0)for(let It=0,Yt=Pt.length;It<Yt;It++){const qt=Pt[It];Dn(tt,W,R,qt)}Mt&&O.render(R);for(let It=0,Yt=Pt.length;It<Yt;It++){const qt=Pt[It];qe(g,R,qt,qt.viewport)}}else W.length>0&&Dn(tt,W,R,Y),Mt&&O.render(R),qe(g,R,Y);T!==null&&(C.updateMultisampleRenderTarget(T),C.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(v,R,Y),Zt.resetDefaultState(),M=-1,b=null,x.pop(),x.length>0?(p=x[x.length-1],K===!0&&st.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function Re(R,Y,J,tt){if(R.visible===!1)return;if(R.layers.test(Y.layers)){if(R.isGroup)J=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(Y);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||et.intersectsSprite(R)){tt&&wt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(H);const It=rt.update(R),Yt=R.material;Yt.visible&&g.push(R,It,Yt,J,wt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||et.intersectsObject(R))){const It=rt.update(R),Yt=R.material;if(tt&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),wt.copy(R.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),wt.copy(It.boundingSphere.center)),wt.applyMatrix4(R.matrixWorld).applyMatrix4(H)),Array.isArray(Yt)){const qt=It.groups;for(let Ht=0,Vt=qt.length;Ht<Vt;Ht++){const Gt=qt[Ht],re=Yt[Gt.materialIndex];re&&re.visible&&g.push(R,It,re,J,wt.z,Gt)}}else Yt.visible&&g.push(R,It,Yt,J,wt.z,null)}}const Pt=R.children;for(let It=0,Yt=Pt.length;It<Yt;It++)Re(Pt[It],Y,J,tt)}function qe(R,Y,J,tt){const W=R.opaque,Pt=R.transmissive,It=R.transparent;p.setupLightsView(J),K===!0&&st.setGlobalState(v.clippingPlanes,J),tt&&Ct.viewport(P.copy(tt)),W.length>0&&tn(W,Y,J),Pt.length>0&&tn(Pt,Y,J),It.length>0&&tn(It,Y,J),Ct.buffers.depth.setTest(!0),Ct.buffers.depth.setMask(!0),Ct.buffers.color.setMask(!0),Ct.setPolygonOffset(!1)}function Dn(R,Y,J,tt){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[tt.id]===void 0&&(p.state.transmissionRenderTarget[tt.id]=new Ma(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")||Wt.has("EXT_color_buffer_float")?no:Ii,minFilter:xa,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:we.workingColorSpace}));const Pt=p.state.transmissionRenderTarget[tt.id],It=tt.viewport||P;Pt.setSize(It.z,It.w);const Yt=v.getRenderTarget();v.setRenderTarget(Pt),v.getClearColor(N),D=v.getClearAlpha(),D<1&&v.setClearColor(16777215,.5),v.clear(),Mt&&O.render(J);const qt=v.toneMapping;v.toneMapping=ji;const Ht=tt.viewport;if(tt.viewport!==void 0&&(tt.viewport=void 0),p.setupLightsView(tt),K===!0&&st.setGlobalState(v.clippingPlanes,tt),tn(R,J,tt),C.updateMultisampleRenderTarget(Pt),C.updateRenderTargetMipmap(Pt),Wt.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let Gt=0,re=Y.length;Gt<re;Gt++){const _e=Y[Gt],xe=_e.object,Le=_e.geometry,_t=_e.material,ct=_e.group;if(_t.side===Ye&&xe.layers.test(tt.layers)){const te=_t.side;_t.side=In,_t.needsUpdate=!0,X(xe,J,tt,Le,_t,ct),_t.side=te,_t.needsUpdate=!0,Vt=!0}}Vt===!0&&(C.updateMultisampleRenderTarget(Pt),C.updateRenderTargetMipmap(Pt))}v.setRenderTarget(Yt),v.setClearColor(N,D),Ht!==void 0&&(tt.viewport=Ht),v.toneMapping=qt}function tn(R,Y,J){const tt=Y.isScene===!0?Y.overrideMaterial:null;for(let W=0,Pt=R.length;W<Pt;W++){const It=R[W],Yt=It.object,qt=It.geometry,Ht=tt===null?It.material:tt,Vt=It.group;Yt.layers.test(J.layers)&&X(Yt,Y,J,qt,Ht,Vt)}}function X(R,Y,J,tt,W,Pt){R.onBeforeRender(v,Y,J,tt,W,Pt),R.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(v,Y,J,tt,R,Pt),W.transparent===!0&&W.side===Ye&&W.forceSinglePass===!1?(W.side=In,W.needsUpdate=!0,v.renderBufferDirect(J,Y,tt,W,R,Pt),W.side=Ki,W.needsUpdate=!0,v.renderBufferDirect(J,Y,tt,W,R,Pt),W.side=Ye):v.renderBufferDirect(J,Y,tt,W,R,Pt),R.onAfterRender(v,Y,J,tt,W,Pt)}function kt(R,Y,J){Y.isScene!==!0&&(Y=Ot);const tt=Tt.get(R),W=p.state.lights,Pt=p.state.shadowsArray,It=W.state.version,Yt=zt.getParameters(R,W.state,Pt,Y,J),qt=zt.getProgramCacheKey(Yt);let Ht=tt.programs;tt.environment=R.isMeshStandardMaterial?Y.environment:null,tt.fog=Y.fog,tt.envMap=(R.isMeshStandardMaterial?Z:A).get(R.envMap||tt.environment),tt.envMapRotation=tt.environment!==null&&R.envMap===null?Y.environmentRotation:R.envMapRotation,Ht===void 0&&(R.addEventListener("dispose",Qt),Ht=new Map,tt.programs=Ht);let Vt=Ht.get(qt);if(Vt!==void 0){if(tt.currentProgram===Vt&&tt.lightsStateVersion===It)return ne(R,Yt),Vt}else Yt.uniforms=zt.getUniforms(R),R.onBeforeCompile(Yt,v),Vt=zt.acquireProgram(Yt,qt),Ht.set(qt,Vt),tt.uniforms=Yt.uniforms;const Gt=tt.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Gt.clippingPlanes=st.uniform),ne(R,Yt),tt.needsLights=Te(R),tt.lightsStateVersion=It,tt.needsLights&&(Gt.ambientLightColor.value=W.state.ambient,Gt.lightProbe.value=W.state.probe,Gt.directionalLights.value=W.state.directional,Gt.directionalLightShadows.value=W.state.directionalShadow,Gt.spotLights.value=W.state.spot,Gt.spotLightShadows.value=W.state.spotShadow,Gt.rectAreaLights.value=W.state.rectArea,Gt.ltc_1.value=W.state.rectAreaLTC1,Gt.ltc_2.value=W.state.rectAreaLTC2,Gt.pointLights.value=W.state.point,Gt.pointLightShadows.value=W.state.pointShadow,Gt.hemisphereLights.value=W.state.hemi,Gt.directionalShadowMap.value=W.state.directionalShadowMap,Gt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Gt.spotShadowMap.value=W.state.spotShadowMap,Gt.spotLightMatrix.value=W.state.spotLightMatrix,Gt.spotLightMap.value=W.state.spotLightMap,Gt.pointShadowMap.value=W.state.pointShadowMap,Gt.pointShadowMatrix.value=W.state.pointShadowMatrix),tt.currentProgram=Vt,tt.uniformsList=null,Vt}function Et(R){if(R.uniformsList===null){const Y=R.currentProgram.getUniforms();R.uniformsList=ar.seqWithValue(Y.seq,R.uniforms)}return R.uniformsList}function ne(R,Y){const J=Tt.get(R);J.outputColorSpace=Y.outputColorSpace,J.batching=Y.batching,J.batchingColor=Y.batchingColor,J.instancing=Y.instancing,J.instancingColor=Y.instancingColor,J.instancingMorph=Y.instancingMorph,J.skinning=Y.skinning,J.morphTargets=Y.morphTargets,J.morphNormals=Y.morphNormals,J.morphColors=Y.morphColors,J.morphTargetsCount=Y.morphTargetsCount,J.numClippingPlanes=Y.numClippingPlanes,J.numIntersection=Y.numClipIntersection,J.vertexAlphas=Y.vertexAlphas,J.vertexTangents=Y.vertexTangents,J.toneMapping=Y.toneMapping}function Kt(R,Y,J,tt,W){Y.isScene!==!0&&(Y=Ot),C.resetTextureUnits();const Pt=Y.fog,It=tt.isMeshStandardMaterial?Y.environment:null,Yt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:gs,qt=(tt.isMeshStandardMaterial?Z:A).get(tt.envMap||It),Ht=tt.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Vt=!!J.attributes.tangent&&(!!tt.normalMap||tt.anisotropy>0),Gt=!!J.morphAttributes.position,re=!!J.morphAttributes.normal,_e=!!J.morphAttributes.color;let xe=ji;tt.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(xe=v.toneMapping);const Le=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,_t=Le!==void 0?Le.length:0,ct=Tt.get(tt),te=p.state.lights;if(K===!0&&(gt===!0||R!==b)){const ln=R===b&&tt.id===M;st.setState(tt,R,ln)}let ae=!1;tt.version===ct.__version?(ct.needsLights&&ct.lightsStateVersion!==te.state.version||ct.outputColorSpace!==Yt||W.isBatchedMesh&&ct.batching===!1||!W.isBatchedMesh&&ct.batching===!0||W.isBatchedMesh&&ct.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&ct.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&ct.instancing===!1||!W.isInstancedMesh&&ct.instancing===!0||W.isSkinnedMesh&&ct.skinning===!1||!W.isSkinnedMesh&&ct.skinning===!0||W.isInstancedMesh&&ct.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ct.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ct.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ct.instancingMorph===!1&&W.morphTexture!==null||ct.envMap!==qt||tt.fog===!0&&ct.fog!==Pt||ct.numClippingPlanes!==void 0&&(ct.numClippingPlanes!==st.numPlanes||ct.numIntersection!==st.numIntersection)||ct.vertexAlphas!==Ht||ct.vertexTangents!==Vt||ct.morphTargets!==Gt||ct.morphNormals!==re||ct.morphColors!==_e||ct.toneMapping!==xe||ct.morphTargetsCount!==_t)&&(ae=!0):(ae=!0,ct.__version=tt.version);let ve=ct.currentProgram;ae===!0&&(ve=kt(tt,Y,W));let bn=!1,He=!1,xn=!1;const be=ve.getUniforms(),Pe=ct.uniforms;if(Ct.useProgram(ve.program)&&(bn=!0,He=!0,xn=!0),tt.id!==M&&(M=tt.id,He=!0),bn||b!==R){Ct.buffers.depth.getReversed()?(j.copy(R.projectionMatrix),Ev(j),Tv(j),be.setValue(F,"projectionMatrix",j)):be.setValue(F,"projectionMatrix",R.projectionMatrix),be.setValue(F,"viewMatrix",R.matrixWorldInverse);const je=be.map.cameraPosition;je!==void 0&&je.setValue(F,ot.setFromMatrixPosition(R.matrixWorld)),Nt.logarithmicDepthBuffer&&be.setValue(F,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(tt.isMeshPhongMaterial||tt.isMeshToonMaterial||tt.isMeshLambertMaterial||tt.isMeshBasicMaterial||tt.isMeshStandardMaterial||tt.isShaderMaterial)&&be.setValue(F,"isOrthographic",R.isOrthographicCamera===!0),b!==R&&(b=R,He=!0,xn=!0)}if(W.isSkinnedMesh){be.setOptional(F,W,"bindMatrix"),be.setOptional(F,W,"bindMatrixInverse");const ln=W.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),be.setValue(F,"boneTexture",ln.boneTexture,C))}W.isBatchedMesh&&(be.setOptional(F,W,"batchingTexture"),be.setValue(F,"batchingTexture",W._matricesTexture,C),be.setOptional(F,W,"batchingIdTexture"),be.setValue(F,"batchingIdTexture",W._indirectTexture,C),be.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&be.setValue(F,"batchingColorTexture",W._colorsTexture,C));const Fn=J.morphAttributes;if((Fn.position!==void 0||Fn.normal!==void 0||Fn.color!==void 0)&&lt.update(W,J,ve),(He||ct.receiveShadow!==W.receiveShadow)&&(ct.receiveShadow=W.receiveShadow,be.setValue(F,"receiveShadow",W.receiveShadow)),tt.isMeshGouraudMaterial&&tt.envMap!==null&&(Pe.envMap.value=qt,Pe.flipEnvMap.value=qt.isCubeTexture&&qt.isRenderTargetTexture===!1?-1:1),tt.isMeshStandardMaterial&&tt.envMap===null&&Y.environment!==null&&(Pe.envMapIntensity.value=Y.environmentIntensity),He&&(be.setValue(F,"toneMappingExposure",v.toneMappingExposure),ct.needsLights&&fe(Pe,xn),Pt&&tt.fog===!0&&nt.refreshFogUniforms(Pe,Pt),nt.refreshMaterialUniforms(Pe,tt,B,V,p.state.transmissionRenderTarget[R.id]),ar.upload(F,Et(ct),Pe,C)),tt.isShaderMaterial&&tt.uniformsNeedUpdate===!0&&(ar.upload(F,Et(ct),Pe,C),tt.uniformsNeedUpdate=!1),tt.isSpriteMaterial&&be.setValue(F,"center",W.center),be.setValue(F,"modelViewMatrix",W.modelViewMatrix),be.setValue(F,"normalMatrix",W.normalMatrix),be.setValue(F,"modelMatrix",W.matrixWorld),tt.isShaderMaterial||tt.isRawShaderMaterial){const ln=tt.uniformsGroups;for(let je=0,Sn=ln.length;je<Sn;je++){const ri=ln[je];U.update(ri,ve),U.bind(ri,ve)}}return ve}function fe(R,Y){R.ambientLightColor.needsUpdate=Y,R.lightProbe.needsUpdate=Y,R.directionalLights.needsUpdate=Y,R.directionalLightShadows.needsUpdate=Y,R.pointLights.needsUpdate=Y,R.pointLightShadows.needsUpdate=Y,R.spotLights.needsUpdate=Y,R.spotLightShadows.needsUpdate=Y,R.rectAreaLights.needsUpdate=Y,R.hemisphereLights.needsUpdate=Y}function Te(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,Y,J){Tt.get(R.texture).__webglTexture=Y,Tt.get(R.depthTexture).__webglTexture=J;const tt=Tt.get(R);tt.__hasExternalTextures=!0,tt.__autoAllocateDepthBuffer=J===void 0,tt.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),tt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,Y){const J=Tt.get(R);J.__webglFramebuffer=Y,J.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(R,Y=0,J=0){T=R,S=Y,E=J;let tt=!0,W=null,Pt=!1,It=!1;if(R){const qt=Tt.get(R);if(qt.__useDefaultFramebuffer!==void 0)Ct.bindFramebuffer(F.FRAMEBUFFER,null),tt=!1;else if(qt.__webglFramebuffer===void 0)C.setupRenderTarget(R);else if(qt.__hasExternalTextures)C.rebindTextures(R,Tt.get(R.texture).__webglTexture,Tt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Gt=R.depthTexture;if(qt.__boundDepthTexture!==Gt){if(Gt!==null&&Tt.has(Gt)&&(R.width!==Gt.image.width||R.height!==Gt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(R)}}const Ht=R.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(It=!0);const Vt=Tt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Vt[Y])?W=Vt[Y][J]:W=Vt[Y],Pt=!0):R.samples>0&&C.useMultisampledRTT(R)===!1?W=Tt.get(R).__webglMultisampledFramebuffer:Array.isArray(Vt)?W=Vt[J]:W=Vt,P.copy(R.viewport),z.copy(R.scissor),I=R.scissorTest}else P.copy(mt).multiplyScalar(B).floor(),z.copy(ft).multiplyScalar(B).floor(),I=pt;if(Ct.bindFramebuffer(F.FRAMEBUFFER,W)&&tt&&Ct.drawBuffers(R,W),Ct.viewport(P),Ct.scissor(z),Ct.setScissorTest(I),Pt){const qt=Tt.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+Y,qt.__webglTexture,J)}else if(It){const qt=Tt.get(R.texture),Ht=Y||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,qt.__webglTexture,J||0,Ht)}M=-1},this.readRenderTargetPixels=function(R,Y,J,tt,W,Pt,It){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Yt=Tt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&It!==void 0&&(Yt=Yt[It]),Yt){Ct.bindFramebuffer(F.FRAMEBUFFER,Yt);try{const qt=R.texture,Ht=qt.format,Vt=qt.type;if(!Nt.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=R.width-tt&&J>=0&&J<=R.height-W&&F.readPixels(Y,J,tt,W,Ut.convert(Ht),Ut.convert(Vt),Pt)}finally{const qt=T!==null?Tt.get(T).__webglFramebuffer:null;Ct.bindFramebuffer(F.FRAMEBUFFER,qt)}}},this.readRenderTargetPixelsAsync=async function(R,Y,J,tt,W,Pt,It){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Yt=Tt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&It!==void 0&&(Yt=Yt[It]),Yt){const qt=R.texture,Ht=qt.format,Vt=qt.type;if(!Nt.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=R.width-tt&&J>=0&&J<=R.height-W){Ct.bindFramebuffer(F.FRAMEBUFFER,Yt);const Gt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Gt),F.bufferData(F.PIXEL_PACK_BUFFER,Pt.byteLength,F.STREAM_READ),F.readPixels(Y,J,tt,W,Ut.convert(Ht),Ut.convert(Vt),0);const re=T!==null?Tt.get(T).__webglFramebuffer:null;Ct.bindFramebuffer(F.FRAMEBUFFER,re);const _e=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await wv(F,_e,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Gt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Pt),F.deleteBuffer(Gt),F.deleteSync(_e),Pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,Y=null,J=0){R.isTexture!==!0&&(zs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,R=arguments[1]);const tt=Math.pow(2,-J),W=Math.floor(R.image.width*tt),Pt=Math.floor(R.image.height*tt),It=Y!==null?Y.x:0,Yt=Y!==null?Y.y:0;C.setTexture2D(R,0),F.copyTexSubImage2D(F.TEXTURE_2D,J,0,0,It,Yt,W,Pt),Ct.unbindTexture()},this.copyTextureToTexture=function(R,Y,J=null,tt=null,W=0){R.isTexture!==!0&&(zs("WebGLRenderer: copyTextureToTexture function signature has changed."),tt=arguments[0]||null,R=arguments[1],Y=arguments[2],W=arguments[3]||0,J=null);let Pt,It,Yt,qt,Ht,Vt,Gt,re,_e;const xe=R.isCompressedTexture?R.mipmaps[W]:R.image;J!==null?(Pt=J.max.x-J.min.x,It=J.max.y-J.min.y,Yt=J.isBox3?J.max.z-J.min.z:1,qt=J.min.x,Ht=J.min.y,Vt=J.isBox3?J.min.z:0):(Pt=xe.width,It=xe.height,Yt=xe.depth||1,qt=0,Ht=0,Vt=0),tt!==null?(Gt=tt.x,re=tt.y,_e=tt.z):(Gt=0,re=0,_e=0);const Le=Ut.convert(Y.format),_t=Ut.convert(Y.type);let ct;Y.isData3DTexture?(C.setTexture3D(Y,0),ct=F.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(C.setTexture2DArray(Y,0),ct=F.TEXTURE_2D_ARRAY):(C.setTexture2D(Y,0),ct=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,Y.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,Y.unpackAlignment);const te=F.getParameter(F.UNPACK_ROW_LENGTH),ae=F.getParameter(F.UNPACK_IMAGE_HEIGHT),ve=F.getParameter(F.UNPACK_SKIP_PIXELS),bn=F.getParameter(F.UNPACK_SKIP_ROWS),He=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,xe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,xe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,qt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ht),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Vt);const xn=R.isDataArrayTexture||R.isData3DTexture,be=Y.isDataArrayTexture||Y.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Pe=Tt.get(R),Fn=Tt.get(Y),ln=Tt.get(Pe.__renderTarget),je=Tt.get(Fn.__renderTarget);Ct.bindFramebuffer(F.READ_FRAMEBUFFER,ln.__webglFramebuffer),Ct.bindFramebuffer(F.DRAW_FRAMEBUFFER,je.__webglFramebuffer);for(let Sn=0;Sn<Yt;Sn++)xn&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tt.get(R).__webglTexture,W,Vt+Sn),R.isDepthTexture?(be&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tt.get(Y).__webglTexture,W,_e+Sn),F.blitFramebuffer(qt,Ht,Pt,It,Gt,re,Pt,It,F.DEPTH_BUFFER_BIT,F.NEAREST)):be?F.copyTexSubImage3D(ct,W,Gt,re,_e+Sn,qt,Ht,Pt,It):F.copyTexSubImage2D(ct,W,Gt,re,_e+Sn,qt,Ht,Pt,It);Ct.bindFramebuffer(F.READ_FRAMEBUFFER,null),Ct.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else be?R.isDataTexture||R.isData3DTexture?F.texSubImage3D(ct,W,Gt,re,_e,Pt,It,Yt,Le,_t,xe.data):Y.isCompressedArrayTexture?F.compressedTexSubImage3D(ct,W,Gt,re,_e,Pt,It,Yt,Le,xe.data):F.texSubImage3D(ct,W,Gt,re,_e,Pt,It,Yt,Le,_t,xe):R.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,W,Gt,re,Pt,It,Le,_t,xe.data):R.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,W,Gt,re,xe.width,xe.height,Le,xe.data):F.texSubImage2D(F.TEXTURE_2D,W,Gt,re,Pt,It,Le,_t,xe);F.pixelStorei(F.UNPACK_ROW_LENGTH,te),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ae),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ve),F.pixelStorei(F.UNPACK_SKIP_ROWS,bn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,He),W===0&&Y.generateMipmaps&&F.generateMipmap(ct),Ct.unbindTexture()},this.copyTextureToTexture3D=function(R,Y,J=null,tt=null,W=0){return R.isTexture!==!0&&(zs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),J=arguments[0]||null,tt=arguments[1]||null,R=arguments[2],Y=arguments[3],W=arguments[4]||0),zs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,Y,J,tt,W)},this.initRenderTarget=function(R){Tt.get(R).__webglFramebuffer===void 0&&C.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?C.setTextureCube(R,0):R.isData3DTexture?C.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?C.setTexture2DArray(R,0):C.setTexture2D(R,0),Ct.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,Ct.reset(),Zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=we._getDrawingBufferColorSpace(t),e.unpackColorSpace=we._getUnpackColorSpace()}}class F1 extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class U1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Vl,this.updateRanges=[],this.version=0,this.uuid=vi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const An=new G;class vr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)An.fromBufferAttribute(this,e),An.applyMatrix4(t),this.setXYZ(e,An.x,An.y,An.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)An.fromBufferAttribute(this,e),An.applyNormalMatrix(t),this.setXYZ(e,An.x,An.y,An.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)An.fromBufferAttribute(this,e),An.transformDirection(t),this.setXYZ(e,An.x,An.y,An.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=ii(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ie(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ii(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ii(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ii(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ii(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ie(e,this.array),i=Ie(i,this.array),a=Ie(a,this.array),s=Ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new vr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Wl extends Sa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let qa;const Ls=new G,ja=new G,Ka=new G,Ja=new $t,Ds=new $t,lp=new Oe,Oo=new G,ks=new G,Bo=new G,Du=new $t,Fc=new $t,ku=new $t;class Iu extends Ze{constructor(t=new Wl){if(super(),this.isSprite=!0,this.type="Sprite",qa===void 0){qa=new nn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new U1(e,5);qa.setIndex([0,1,2,0,2,3]),qa.setAttribute("position",new vr(i,3,0,!1)),qa.setAttribute("uv",new vr(i,2,3,!1))}this.geometry=qa,this.material=t,this.center=new $t(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ja.setFromMatrixScale(this.matrixWorld),lp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ka.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ja.multiplyScalar(-Ka.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Ho(Oo.set(-.5,-.5,0),Ka,o,ja,a,s),Ho(ks.set(.5,-.5,0),Ka,o,ja,a,s),Ho(Bo.set(.5,.5,0),Ka,o,ja,a,s),Du.set(0,0),Fc.set(1,0),ku.set(1,1);let r=t.ray.intersectTriangle(Oo,ks,Bo,!1,Ls);if(r===null&&(Ho(ks.set(-.5,.5,0),Ka,o,ja,a,s),Fc.set(0,1),r=t.ray.intersectTriangle(Oo,Bo,ks,!1,Ls),r===null))return;const l=t.ray.origin.distanceTo(Ls);l<t.near||l>t.far||e.push({distance:l,point:Ls.clone(),uv:Xn.getInterpolation(Ls,Oo,ks,Bo,Du,Fc,ku,new $t),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ho(n,t,e,i,a,s){Ja.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Ds.x=s*Ja.x-a*Ja.y,Ds.y=a*Ja.x+s*Ja.y):Ds.copy(Ja),n.copy(t),n.x+=Ds.x,n.y+=Ds.y,n.applyMatrix4(lp)}class Mh extends Sa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const yr=new G,_r=new G,zu=new Oe,Is=new xh,Go=new Pr,Uc=new G,Fu=new G;class N1 extends Ze{constructor(t=new nn,e=new Mh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)yr.fromBufferAttribute(e,a-1),_r.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=yr.distanceTo(_r);t.setAttribute("lineDistance",new Ce(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Go.copy(i.boundingSphere),Go.applyMatrix4(a),Go.radius+=s,t.ray.intersectsSphere(Go)===!1)return;zu.copy(a).invert(),Is.copy(t.ray).applyMatrix4(zu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=u,g=m-1;_<g;_+=c){const p=h.getX(_),y=h.getX(_+1),x=Vo(this,t,Is,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(u),p=Vo(this,t,Is,l,_,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=u,g=m-1;_<g;_+=c){const p=Vo(this,t,Is,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Vo(this,t,Is,l,m-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Vo(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(yr.fromBufferAttribute(o,a),_r.fromBufferAttribute(o,s),e.distanceSqToSegment(yr,_r,Uc,Fu)>i)return;Uc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Uc);if(!(l<t.near||l>t.far))return{distance:l,point:Fu.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Uu=new G,Nu=new G;class hp extends N1{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Uu.fromBufferAttribute(e,a),Nu.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Uu.distanceTo(Nu);t.setAttribute("lineDistance",new Ce(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yl extends Ln{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _i{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new $t:new G);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,l=new Oe;for(let u=0;u<=t;u++){const m=u/t;a[u]=this.getTangentAt(m,new G)}s[0]=new G,o[0]=new G;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(pn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(pn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],u*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class bh extends _i{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new $t){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class O1 extends bh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Sh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const Xo=new G,Nc=new Sh,Oc=new Sh,Bc=new Sh;class B1 extends _i{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(Xo.subVectors(a[0],a[1]).add(a[0]),c=Xo);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(Xo.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=Xo),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),_=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Nc.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,_,g),Oc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,_,g),Bc.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(Nc.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Oc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),Bc.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(Nc.calc(l),Oc.calc(l),Bc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ou(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function H1(n,t){const e=1-n;return e*e*t}function G1(n,t){return 2*(1-n)*n*t}function V1(n,t){return n*n*t}function Bs(n,t,e,i){return H1(n,t)+G1(n,e)+V1(n,i)}function X1(n,t){const e=1-n;return e*e*e*t}function W1(n,t){const e=1-n;return 3*e*e*n*t}function Y1(n,t){return 3*(1-n)*n*n*t}function $1(n,t){return n*n*n*t}function Hs(n,t,e,i,a){return X1(n,t)+W1(n,e)+Y1(n,i)+$1(n,a)}class dp extends _i{constructor(t=new $t,e=new $t,i=new $t,a=new $t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Hs(t,a.x,s.x,o.x,r.x),Hs(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Z1 extends _i{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Hs(t,a.x,s.x,o.x,r.x),Hs(t,a.y,s.y,o.y,r.y),Hs(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class up extends _i{constructor(t=new $t,e=new $t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new $t){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new $t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class q1 extends _i{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fp extends _i{constructor(t=new $t,e=new $t,i=new $t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new $t){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Bs(t,a.x,s.x,o.x),Bs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class j1 extends _i{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Bs(t,a.x,s.x,o.x),Bs(t,a.y,s.y,o.y),Bs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class pp extends _i{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new $t){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(Ou(r,l.x,c.x,h.x,f.x),Ou(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new $t().fromArray(a))}return this}}var Bu=Object.freeze({__proto__:null,ArcCurve:O1,CatmullRomCurve3:B1,CubicBezierCurve:dp,CubicBezierCurve3:Z1,EllipseCurve:bh,LineCurve:up,LineCurve3:q1,QuadraticBezierCurve:fp,QuadraticBezierCurve3:j1,SplineCurve:pp});class K1 extends _i{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new Bu[a.type]().fromJSON(a))}return this}}class Hu extends K1{constructor(t){super(),this.type="Path",this.currentPoint=new $t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new up(this.currentPoint.clone(),new $t(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new fp(this.currentPoint.clone(),new $t(t,e),new $t(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new dp(this.currentPoint.clone(),new $t(t,e),new $t(i,a),new $t(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new pp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new bh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class wh extends nn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new G,h=new $t;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Ce(o,3)),this.setAttribute("normal",new Ce(r,3)),this.setAttribute("uv",new Ce(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class js extends nn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let m=0;const _=[],g=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Ce(f,3)),this.setAttribute("normal",new Ce(d,3)),this.setAttribute("uv",new Ce(u,2));function y(){const v=new G,w=new G;let S=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const M=[],b=T/s,P=b*(e-t)+t;for(let z=0;z<=a;z++){const I=z/a,N=I*l+r,D=Math.sin(N),k=Math.cos(N);w.x=P*D,w.y=-b*i+g,w.z=P*k,f.push(w.x,w.y,w.z),v.set(D,E,k).normalize(),d.push(v.x,v.y,v.z),u.push(I,1-b),M.push(m++)}_.push(M)}for(let T=0;T<a;T++)for(let M=0;M<s;M++){const b=_[M][T],P=_[M+1][T],z=_[M+1][T+1],I=_[M][T+1];(t>0||M!==0)&&(h.push(b,P,I),S+=3),(e>0||M!==s-1)&&(h.push(P,z,I),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=m,S=new $t,E=new G;let T=0;const M=v===!0?t:e,b=v===!0?1:-1;for(let z=1;z<=a;z++)f.push(0,g*b,0),d.push(0,b,0),u.push(.5,.5),m++;const P=m;for(let z=0;z<=a;z++){const N=z/a*l+r,D=Math.cos(N),k=Math.sin(N);E.x=M*k,E.y=g*b,E.z=M*D,f.push(E.x,E.y,E.z),d.push(0,b,0),S.x=D*.5+.5,S.y=k*.5*b+.5,u.push(S.x,S.y),m++}for(let z=0;z<a;z++){const I=w+z,N=P+z;v===!0?h.push(N,N+1,I):h.push(N+1,N,I),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new js(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Eh extends js{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Eh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Th extends nn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Ce(s,3)),this.setAttribute("normal",new Ce(s.slice(),3)),this.setAttribute("uv",new Ce(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new G,v=new G,w=new G;for(let S=0;S<e.length;S+=3)u(e[S+0],x),u(e[S+1],v),u(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const M=y.clone().lerp(v,T/S),b=x.clone().lerp(v,T/S),P=S-T;for(let z=0;z<=P;z++)z===0&&T===S?E[T][z]=M:E[T][z]=M.clone().lerp(b,z/P)}for(let T=0;T<S;T++)for(let M=0;M<2*(S-T)-1;M++){const b=Math.floor(M/2);M%2===0?(d(E[T][b+1]),d(E[T+1][b]),d(E[T][b])):(d(E[T][b+1]),d(E[T+1][b+1]),d(E[T+1][b]))}}function c(y){const x=new G;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new G;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=g(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}m(),f()}function f(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),E=Math.min(x,v,w);S>.9&&E<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function u(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function m(){const y=new G,x=new G,v=new G,w=new G,S=new $t,E=new $t,T=new $t;for(let M=0,b=0;M<s.length;M+=9,b+=6){y.set(s[M+0],s[M+1],s[M+2]),x.set(s[M+3],s[M+4],s[M+5]),v.set(s[M+6],s[M+7],s[M+8]),S.set(o[b+0],o[b+1]),E.set(o[b+2],o[b+3]),T.set(o[b+4],o[b+5]),w.copy(y).add(x).add(v).divideScalar(3);const P=g(w);_(S,b+0,y,P),_(E,b+2,x,P),_(T,b+4,v,P)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Th(t.vertices,t.indices,t.radius,t.details)}}const Wo=new G,Yo=new G,Hc=new G,$o=new Xn;class J1 extends nn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(os*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:_,b:g,c:p}=$o;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),$o.getNormal(Hc),f[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,f[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=f[y],w=f[x],S=$o[h[y]],E=$o[h[x]],T=`${v}_${w}`,M=`${w}_${v}`;M in d&&d[M]?(Hc.dot(d[M].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(E.x,E.y,E.z)),d[M]=null):T in d||(d[T]={index0:c[y],index1:c[x],normal:Hc.clone()})}}for(const m in d)if(d[m]){const{index0:_,index1:g}=d[m];Wo.fromBufferAttribute(r,_),Yo.fromBufferAttribute(r,g),u.push(Wo.x,Wo.y,Wo.z),u.push(Yo.x,Yo.y,Yo.z)}this.setAttribute("position",new Ce(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class mp extends Hu{constructor(t){super(t),this.uuid=vi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Hu().fromJSON(a))}return this}}const Q1={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=gp(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=aS(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return Ks(s,o,e,r,l,u,0),o}};function gp(n,t,e,i,a){let s,o;if(a===mS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Gu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Gu(s,n[s],n[s+1],o);return o&&Lr(o,o.next)&&(Qs(o),o=o.next),o}function ba(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Lr(e,e.next)||$e(e.prev,e,e.next)===0)){if(Qs(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ks(n,t,e,i,a,s,o){if(!n)return;!o&&s&&lS(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?eS(n,i,a,s):tS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),Qs(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=nS(ba(n),t,e),Ks(n,t,e,i,a,s,2)):o===2&&iS(n,t,e,i,a,s):Ks(ba(n),t,e,i,a,s,1);break}}}function tS(n){const t=n.prev,e=n,i=n.next;if($e(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&ns(a,r,s,l,o,c,m.x,m.y)&&$e(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function eS(n,t,e,i){const a=n.prev,s=n,o=n.next;if($e(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,_=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=$l(u,m,t,e,i),y=$l(_,g,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=u&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ns(r,h,l,f,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&ns(r,h,l,f,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=u&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ns(r,h,l,f,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&ns(r,h,l,f,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function nS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Lr(a,s)&&xp(a,i,i.next,s)&&Js(a,s)&&Js(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Qs(i),Qs(i.next),i=n=s),i=i.next}while(i!==n);return ba(i)}function iS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&uS(o,r)){let l=vp(o,r);o=ba(o,o.next),l=ba(l,l.next),Ks(o,t,e,i,a,s,0),Ks(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function aS(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=gp(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(dS(c));for(a.sort(sS),s=0;s<a.length;s++)e=oS(a[s],e);return e}function sS(n,t){return n.x-t.x}function oS(n,t){const e=rS(n,t);if(!e)return t;const i=vp(e,n);return ba(i,i.next),ba(e,e.next)}function rS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&ns(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),Js(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&cS(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function cS(n,t){return $e(n.prev,n,t.prev)<0&&$e(t.next,n,n.next)<0}function lS(n,t,e,i){let a=n;do a.z===0&&(a.z=$l(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,hS(a)}function hS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function $l(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function dS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ns(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function uS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!fS(n,t)&&(Js(n,t)&&Js(t,n)&&pS(n,t)&&($e(n.prev,n,t.prev)||$e(n,t.prev,t))||Lr(n,t)&&$e(n.prev,n,n.next)>0&&$e(t.prev,t,t.next)>0)}function $e(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Lr(n,t){return n.x===t.x&&n.y===t.y}function xp(n,t,e,i){const a=qo($e(n,t,e)),s=qo($e(n,t,i)),o=qo($e(e,i,n)),r=qo($e(e,i,t));return!!(a!==s&&o!==r||a===0&&Zo(n,e,t)||s===0&&Zo(n,i,t)||o===0&&Zo(e,n,i)||r===0&&Zo(e,t,i))}function Zo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function qo(n){return n>0?1:n<0?-1:0}function fS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&xp(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Js(n,t){return $e(n.prev,n,n.next)<0?$e(n,t,n.next)>=0&&$e(n,n.prev,t)>=0:$e(n,t,n.prev)<0||$e(n,n.next,t)<0}function pS(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function vp(n,t){const e=new Zl(n.i,n.x,n.y),i=new Zl(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Gu(n,t,e,i){const a=new Zl(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Qs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Zl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function mS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Gs{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Gs.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Vu(t),Xu(i,t);let o=t.length;e.forEach(Vu);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,Xu(i,e[l]);const r=Q1.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function Vu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Xu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Ah extends Th{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ah(t.radius,t.detail)}}class to extends nn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new G,m=new $t;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const y=p+g,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new Ce(l,3)),this.setAttribute("normal",new Ce(c,3)),this.setAttribute("uv",new Ce(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new to(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Rh extends nn{constructor(t=new mp([new $t(0,.5),new $t(-.5,-.5),new $t(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Ce(a,3)),this.setAttribute("normal",new Ce(s,3)),this.setAttribute("uv",new Ce(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;Gs.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const y=m[g];Gs.isClockWise(y)===!0&&(m[g]=y.reverse())}const _=Gs.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const y=m[g];u=u.concat(y)}for(let g=0,p=u.length;g<p;g++){const y=u[g];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=_.length;g<p;g++){const y=_[g],x=y[0]+f,v=y[1]+f,w=y[2]+f;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return gS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Rh(i,t.curveSegments)}}function gS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Dr extends nn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new G,f=new G,d=new G;for(let u=0;u<=i;u++)for(let m=0;m<=a;m++){const _=m/a*s,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=a;m++){const _=(a+1)*u+m-1,g=(a+1)*(u-1)+m-1,p=(a+1)*(u-1)+m,y=(a+1)*u+m;o.push(_,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Ce(r,3)),this.setAttribute("normal",new Ce(l,3)),this.setAttribute("uv",new Ce(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class eo extends Sa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wf,this.normalScale=new $t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class yp extends Ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class xS extends yp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ie(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Gc=new Oe,Wu=new G,Yu=new G;class vS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $t(512,512),this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yh,this._frameExtents=new $t(1,1),this._viewportCount=1,this._viewports=[new Je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Wu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Wu),Yu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Yu),e.updateMatrixWorld(),Gc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Gc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class yS extends vS{constructor(){super(new ip(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _S extends yp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.target=new Ze,this.shadow=new yS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const $u=new Oe;class MS{constructor(t,e,i=0,a=1/0){this.ray=new xh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new vh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return $u.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($u),this}intersectObject(t,e=!0,i=[]){return ql(t,this,i,e),i.sort(Zu),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)ql(t[a],this,i,e);return i.sort(Zu),i}}function Zu(n,t){return n.distance-t.distance}function ql(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)ql(s[o],t,e,!0)}}class bS extends hp{constructor(t=10,e=10,i=4473924,a=8947848){i=new ie(i),a=new ie(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const _=d===s?i:a;_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3}const h=new nn;h.setAttribute("position",new Ce(l,3)),h.setAttribute("color",new Ce(c,3));const f=new Mh({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ch}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ch);const SS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function wS(n,t,e,i){const a=new $n(n.fov,i,.1,200),s=new G,o=new G,r=new G;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0,m=0,_=0,g=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,E=SS){const T=v+.6;if(!l)s.set(x,T,w),l=!0;else{const P=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*P,s.y+=(T-s.y)*P,s.z+=(w-s.z)*P}const M=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*M,h.offsetX+=(E.offsetX-h.offsetX)*M,h.offsetZ+=(E.offsetZ-h.offsetZ)*M,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*M;const b=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(f-h.zoom)*b,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=S*52;const P=d*.055;a.position.x+=Math.sin(u*1.7)*P,a.position.y+=Math.sin(u*2.3+1.1)*P*.75,a.position.z+=Math.sin(u*1.3+2.4)*P*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new G().setFromMatrixColumn(a.matrixWorld,0),v=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(m=x/S*w,_=v/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){f=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const va=Math.PI*2,Zn=1e-6;function zn(n,t,e){return n<t?t:n>e?e:n}function _p(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function ES(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Mp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=ES(n);return i===1?a:e+(a-e)*i}function qu(n){return(1-Math.sin(n))/2}function Ph(n,t,e){const i=Math.PI/180,a=zn(Number.isFinite(t)?t:100,0,180),s=zn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=zn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Mr(n,t){if(!n.grounded||n.speed<Zn)return _p();const e=n.speed/Math.max(n.moveSpeed,Zn),i=Math.max(n.legLength,Zn),a=n.stride>Zn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Zn,h=Ph(n.localForward/Math.max(n.speed,Zn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,_=a,g=N=>Math.asin(zn(N,-o,o)/i);function p(N,D){const k=Mp(N,t.plantLock),V=qu(N),B=u*d*_*k,$=-g(B),at=D*m>0?1:-1,mt=1+at*t.crossStep*.45,ft=m*at*t.crossStep*_*.4*V,pt=m*f*_*t.sideWeight*mt*k+ft*f,et=g(pt),K=t.kneeLift*V*s*(.55+.25*d+(at>0?.2*f:0));return{pitchX:$,rollZ:et,kneeX:K}}const y=(n.phase%va+va)%va,x=p(y,-1),v=p((y+Math.PI)%va,1),w=Math.cos(y),S=qu(y),E=-t.comSway*s*w*(.6*d+.8*f)-m*t.comSway*s*f*.45,T=t.comBob*S*s,M=m*t.hipLean*s*f*w*.6,b=m*t.hipLean*s*f*(.45+.25*w),P=t.armSwing*s*w*(d*u+.3*f),z=P,I=-P;return{legL:x,legR:v,pelvisX:E,pelvisY:T,pelvisRoll:M,sideLean:b,armL:z,armR:I,strafe:f,backward:u<0?d:0}}function bp(n){const t=(n%va+va)%va,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Sp(n,t,e){const i=zn(e.progress,0,1);if(i>=1||n.speed<Zn)return _p();const a=i*i*(3-2*i),s=1-a;return Mr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function wp(n,t,e,i){const a=zn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return zn(o*a,-1,1)*(e*Math.PI/180)}function Ep(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=zn(i,0,1),c=l*l;return e*c+r*(1-c)}function Tp(n,t,e,i,a){const s=Math.max(e,Zn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Zn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>Zn&&n<=o&&c,resume:!d}}function Ap(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return zn(n*zn(t,0,2),-i,i)}function Rp(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Pp(n,t,e){const i=zn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function TS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=zn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Cp(n,t,e,i,a){const s=zn(n,0,1),o=zn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>Zn?e/h:1,d=h>Zn?i/h:0,u=Mp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function Mn(n){return n<0?0:n>1?1:n}const sr=Math.PI*2;function AS(n){return((n+Math.PI)%sr+sr)%sr-Math.PI}function RS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function PS(n,t,e,i,a,s=n.phase){const o=Mn(i);if(o<=0)return n;const r=Mn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=Mn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,_=m*m*(3-2*m),g=r<=.5?_:1-_,p={speed:c,phase:s+sr*l/2*g,localForward:c*f,localRight:c*(1-f)*h},y=AS(p.phase-n.phase),x=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+y*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function CS(n,t,e){const i=RS(),a=Mn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function Lp(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function ju(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Lp(s,a)}function LS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function DS(n,t,e){const i=Mn(n);return{gaitScale:1-i*(1-Mn(t)),attackLegWeight:Mn(e)*i}}function kS(n,t,e){const i=Mn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function IS(n,t){const e=Mn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function zS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Mn(t.minScale+(1-t.minScale)*e)}function FS(){return Dp()}function Dp(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function US(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function NS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Mn(t.forceHitHeight):n.type==="light"?Mn(t.hitHeight.light):n.type==="heavy"?Mn(t.hitHeight.heavy):n.type==="knock"?Mn(t.hitHeight.knock):0}function OS(n,t,e){const i=Mn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function kp(n,t,e){const i=Dp(),a=US(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Mn(1-n.timer/n.duration),o=Lp(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=NS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*f,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=a*o,m=OS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function Ip(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ca=1e-6;function Vs(n,t,e){return n<t?t:n>e?e:n}function zp(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ca||s<=ca||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+ca,c=Math.hypot(n.x,n.y,n.z);if(c<=ca)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=Vs(u,l,r),_=u>r+ca||u<l-ca,g=Math.atan2(-d,Math.max(f,ca)),p=Vs((a*a+m*m-s*s)/(2*a*m),-1,1),y=Vs((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function Fp(n,t,e,i){const a=Vs(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Vs((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Up(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Ch={active:!1,weight:0,clamped:0,maxError:0};function Np(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Ch};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const m=a[u],_=i.worldToLocal(l[u].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=zp(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const y=Fp({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=y.rootPitch,m.root.rotation.z=y.rootRoll,m.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const m=a[u].tip.getWorldPosition(new G);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Gn(n,t,e){return n<t?t:n>e?e:n}function BS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new Ue,d=new Ue;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new Ue;u.name="lower";const m=new Ue;m.name="upper",d.add(u),d.add(m);const _=[],g=(nt,vt,Ft,st)=>{const St=new eo({color:st}),O=new ye(new oi(nt,vt,Ft),St);return O.castShadow=!0,O.receiveShadow=!0,_.push(St),O},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,m.add(E);const T=new Ue;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,m.add(T);const M=g(p,p,p,e);M.position.y=p/2,T.add(M);for(const nt of[-1,1]){const vt=g(.06,.07,.02,t.shoe);vt.position.set(nt*.09,p/2+.03,p/2+.011),T.add(vt)}const b=(nt,vt)=>{const Ft=vt?x:y,st=new Ue;st.name=vt?nt<0?"shoulderL":"shoulderR":nt<0?"hipL":"hipR",vt||(st.rotation.order="ZYX"),st.position.set(nt*(vt?S/2+v/2:S/2-v/2),vt?w-.04:0,0),(vt?m:u).add(st);const St=g(v,Ft/2,v,t.limb);St.position.y=-Ft/4,st.add(St);const O=new Ue;O.name=vt?"elbow":"knee",O.position.y=-Ft/2,st.add(O);const lt=g(v,Ft/2,v,t.limb);if(lt.position.y=-Ft/4,O.add(lt),!vt){const xt=g(v*1.15,.07,v*1.7,t.shoe);xt.position.set(0,-Ft/2+.035,.045),O.add(xt);const Xt=new Ze;return Xt.name="footTip",Xt.position.y=-Ft/2,O.add(Xt),{root:st,joint:O,tip:Xt}}return{root:st,joint:O}},P=b(-1,!1),z=b(1,!1),I=b(-1,!0),N=b(1,!0),D=[P,z].map(nt=>({root:nt.root,joint:nt.joint,tip:nt.tip,upperLen:y/2,lowerLen:y/2,bend:1})),k=new on({color:a.attackArcColor,transparent:!0,opacity:0,side:Ye,depthWrite:!1}),V=new ye(new Dr(.62,.042,6,20,Math.PI*1.1),k);V.position.set(0,.78-y,.56),m.add(V);const B=new ie(e),$=new ie(r.flashColor),at=new ie;let mt=null,ft=0,pt=0,et=0,K=0,gt=0,j=0,H=0,ot={...Ch},wt=-1,Ot=0,Mt=0,Lt=0,F=0,le=0,Wt=0,Nt=0,Ct=1,Dt=0,Tt=0,C="none",A=0,Z=!1,dt=-1,Q=!1,rt=0,zt=0;return{group:f,boneAtWorld(nt,vt,Ft){const st=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:N.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:P.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:P.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],St=new G,O=new G,lt=new G(nt,vt,Ft),xt=new G;let Xt=null,Ut=Number.POSITIVE_INFINITY;for(const Zt of st){Zt.node.updateWorldMatrix(!0,!1),St.set(Zt.ax,Zt.ay,Zt.az),O.set(Zt.bx,Zt.by,Zt.bz),Zt.node.localToWorld(St),Zt.node.localToWorld(O);const U=O.x-St.x,bt=O.y-St.y,it=O.z-St.z,ht=U*U+bt*bt+it*it;let Rt=ht>1e-8?((lt.x-St.x)*U+(lt.y-St.y)*bt+(lt.z-St.z)*it)/ht:0;Rt=Math.max(0,Math.min(1,Rt));const At=St.x+U*Rt,Qt=St.y+bt*Rt,se=St.z+it*Rt,ue=(lt.x-At)**2+(lt.y-Qt)**2+(lt.z-se)**2;ue<Ut&&(Ut=ue,Xt=Zt.node,xt.set(At,Qt,se))}return Xt?{node:Xt,point:xt.clone()}:null},update(nt,vt){f.position.set(nt.position.x,nt.position.y,nt.position.z),f.rotation.y=nt.bodyYaw,T.rotation.y=(nt.headYaw-nt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,nt.mode!==mt&&(mt=nt.mode,ft=1),ft=Math.max(0,ft-vt*2.2);const Ft=nt.hurt,st=kp(Ft,nt.bodyYaw,r),St=st.flash;at.copy($).multiplyScalar(St);for(const Ht of _)Ht.emissive.copy(B).multiplyScalar(ft*.5),St>0&&Ht.emissive.add(at);d.position.set(0,y,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(nt.velocity.x,nt.velocity.z),lt=Gn(o.knockGaitScale??0,0,1),xt=nt.hurt.knockX*lt,Xt=nt.hurt.knockZ*lt,Ut=lt>0&&Math.hypot(nt.hurt.knockX,nt.hurt.knockZ)>.001,Zt=nt.velocity.x+xt,U=nt.velocity.z+Xt,bt=Math.hypot(Zt,U),it=Math.cos(nt.bodyYaw),ht=-Math.sin(nt.bodyYaw),Rt=O>1e-6?Gn((nt.velocity.x*it+nt.velocity.z*ht)/O,-1,1):0,At=O>1e-6?Gn((nt.velocity.x*Math.sin(nt.bodyYaw)+nt.velocity.z*Math.cos(nt.bodyYaw))/O,-1,1):1,Qt=Ph(At,o.backStrafeStartDeg,o.backStrafeFullDeg);C==="settled"&&Q&&rt>zt*1.02+1e-4&&(C="none");let se=1;C==="blend"?(se=Pp(Z?dt:A,o.stopYawBlendMode,Z),Z||(A=Math.min(1,A+vt/Math.max(.01,o.stopYawAfterSec)),(A>=1||o.stopYawBlendMode==="inStop"||Q)&&(C="settled",se=0))):C==="settled"&&(se=Gn(O/Math.max(1e-6,o.stopEnterRatio*s),0,1));const ue=wp(Rt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),oe=Ep(At,Rt,ue,Qt)*se;Dt+=(oe-Dt)*(1-Math.exp(-12*Math.max(0,vt))),u.rotation.y=Dt;const Ee=nt.bodyYaw+Dt,Be=Math.sin(Ee),gn=Math.cos(Ee),Ae=Math.cos(Ee),ze=-Math.sin(Ee),Re=Zt*Be+U*gn,qe=Zt*Ae+U*ze,Dn=Math.max(0,o.stopBlendSec||0),tn=Dn>0&&!Ut,X=Tp(O,Tt,s,o.stopEnterRatio,o.stopExitRatio);if(!tn||X.resume)wt=-1;else if(wt<0&&X.enter){wt=0,Ot=nt.gaitPhase,Mt=bp(nt.gaitPhase),Lt=O,F=Math.max(nt.stride,1e-6),le=Re,Wt=qe;const Ht=1/Math.max(1e-6,O);Nt=nt.velocity.x*Ht,Ct=nt.velocity.z*Ht}const kt=Tt;Tt=O;const Et=tn&&wt>=0;Et&&(wt=Math.min(1,wt+vt/Dn)),Et&&C!=="blend"&&(C="blend",A=0),Z=Et&&wt<1,dt=wt,Q=X.resume,rt=O,zt=kt;const ne=Et?{phase:Ot,speed:Lt,moveSpeed:s,localForward:le,localRight:Wt,legLength:n.legLength,stride:F,grounded:!0}:{phase:nt.gaitPhase,speed:bt,moveSpeed:s,localForward:Re,localRight:qe,legLength:n.legLength,stride:nt.stride,grounded:!0},Kt=Et?Sp(ne,o,{progress:wt,phase0:Ot,phaseEnd:Mt}):Mr(ne,o);let fe=0,Te=0,R=0,Y=0;if(Et){const Ht=Rp(nt.bodyYaw,Nt,Ct),Vt=Cp(wt,Ot,Ht.forward,Ht.right,o);Vt.leadLeft?(Kt.legL.pitchX-=Vt.leadPitch,Kt.legL.kneeX+=Vt.leadKnee,Kt.legR.pitchX+=Vt.trailPitch):(Kt.legR.pitchX-=Vt.leadPitch,Kt.legR.kneeX+=Vt.leadKnee,Kt.legL.pitchX+=Vt.trailPitch),Te=Vt.bodyShift*Vt.fwdN,fe=Vt.bodyShift*Vt.rightN,R=Vt.bodyDip,Y=Vt.chestPitch}P.root.rotation.x=Kt.legL.pitchX,z.root.rotation.x=Kt.legR.pitchX,P.root.rotation.z=Kt.legL.rollZ,z.root.rotation.z=Kt.legR.rollZ,P.joint.rotation.x=Kt.legL.kneeX,z.joint.rotation.x=Kt.legR.kneeX,I.root.rotation.x=Kt.armL,N.root.rotation.x=Kt.armR,I.joint.rotation.x=-.18,N.joint.rotation.x=-.18,d.position.x=Kt.pelvisX,d.position.y=y+Kt.pelvisY,d.position.z=0,d.rotation.z=Kt.pelvisRoll,m.rotation.z=Kt.sideLean*(st.intensity>0?.4:1);const J=Up(d,u),tt=Et&&h.enabled?{...h,weight:1}:h,W=tt.enabled&&tt.weight>0?Gn(tt.weight,0,1):0;if(d.position.x+=fe,d.position.z+=Te,d.position.y-=R,u.position.y+=R,W<=0&&(u.position.x-=fe,u.position.z-=Te),l){const Ht=Math.max(.004166666666666667,Math.min(vt,.1)),Vt=Math.sin(nt.bodyYaw),Gt=Math.cos(nt.bodyYaw),re=Gn((nt.velocity.x-pt)/Ht,-60,60),_e=Gn((nt.velocity.z-et)/Ht,-60,60),xe=re*Vt+_e*Gt,Le=Xe(nt.bodyYaw-K)/Ht,_t=l.maxForwardDeg*Math.PI/180,ct=l.maxSideDeg*Math.PI/180,te=1-Math.exp(-Math.max(0,l.smoothing)*Ht);gt+=(Gn(xe*l.accelGain,-_t,_t)-gt)*te,j+=(Gn(-Le*O*l.turnGain,-ct,ct)-j)*te;const ae=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;H+=(Gn(O/Math.max(s,1e-6),0,1)-H)*(1-Math.exp(-Math.max(0,ae)*Ht));const ve=Ip({leanForward:gt,leanSide:j,speedRatio:H},l);m.rotation.x+=gt+Y,m.rotation.z+=j,d.rotation.x+=ve.pelvisPitch,d.rotation.z+=ve.pelvisRoll,d.position.x+=ve.pelvisX,d.position.z+=ve.pelvisZ,d.position.y-=ve.crouch,u.position.y+=ve.crouch*(1-W)}pt=nt.velocity.x,et=nt.velocity.z,K=nt.bodyYaw,m.rotation.x+=st.upperPitch,m.rotation.z+=st.upperRoll,m.rotation.y+=st.upperYaw;const Pt=Gn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),It=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Gn(st.upperShiftX*Pt,-It,It),m.position.z+=Gn(st.upperShiftZ*Pt,-It,It),d.position.x+=st.comX,d.position.z+=st.comZ-st.pelvisBack,d.position.y-=st.drop;const Yt=st.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=st.pelvisBack*(1-Yt),u.position.y+=st.drop*(1-Yt),P.joint.rotation.x+=st.knee,z.joint.rotation.x+=st.knee,P.root.rotation.x-=st.hip,z.root.rotation.x-=st.hip,I.root.rotation.x+=st.arm,N.root.rotation.x+=st.arm*.8,nt.attackPhase!=="idle"&&st.intensity===0){const Ht=nt.attackProgress,Vt=Ht<.34?-1:Ht<.68?-1+(Ht-.34)/.34*2:Math.max(0,1-(Ht-.68)/.32),Gt=Math.max(0,-Vt),re=Math.max(0,Vt);N.root.rotation.x=-1.7*Gt+1.25*re,N.joint.rotation.x=-(.25+Gt*.45),m.rotation.y=-.28*Vt,k.opacity=nt.attackPhase==="active"?.85:0,nt.attackPhase==="active"&&(V.rotation.z=-1.1+Ht*3)}else k.opacity=0;const qt=Ap(Dt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=qt,T.rotation.y=(nt.headYaw-nt.bodyYaw-qt+Math.PI*3)%(Math.PI*2)-Math.PI,ot=Np({root:f,pelvis:d,lower:u,limbs:D,base:J,cfg:tt,grounded:!0,attacking:nt.attackPhase!=="idle"})},ik(){return ot},dispose(){f.traverse(nt=>{if(nt instanceof ye){nt.geometry.dispose();const vt=nt.material;Array.isArray(vt)?vt.forEach(Ft=>Ft.dispose()):vt.dispose()}})}}}const la=.012,ha=.016;function HS(n,t){const e=t.lab,i=new Ue;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=la){const S=l(new on({color:x,transparent:!0,opacity:v,depthWrite:!1,side:Ye,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new ye(y,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function f(y,x){return c(new to(Math.max(y,.001),x,72))}function d(y,x,v,w=ha){const E=document.createElement("canvas"),T=E.getContext("2d");if(!T)return new ye;const M='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=M,E.width=Bd.ceilPowerOfTwo(Math.ceil(T.measureText(y).width)+32),E.height=Bd.ceilPowerOfTwo(96*1.4);const b=E.getContext("2d");if(!b)return new ye;b.font=M,b.textAlign="center",b.textBaseline="middle",b.fillStyle=v,b.fillText(y,E.width/2,E.height/2);const P=new Yl(E);P.colorSpace=Pn,s.push(P);const z=E.width/E.height,I=c(new Yn(x*z,x)),N=l(new on({map:P,transparent:!0,depthWrite:!1,side:Ye,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),D=new ye(I,N);return D.rotation.x=-Math.PI/2,D.position.y=w,D.renderOrder=3,D}function u(y,x,v,w,S,E){const T=v-x,M=c(new Yn(T,w)),b=h(M,S,E,la);b.position.set(T/2+x,la,0);const P=new Ue;return P.add(b),P.rotation.y=y-Math.PI/2,P}function m(y,x,v,w,S){const E=new mp;E.moveTo(0,x*.5),E.lineTo(-v*.5,x*.5-v*.9),E.lineTo(-v*.18,x*.5-v*.9),E.lineTo(-v*.18,-x*.5),E.lineTo(v*.18,-x*.5),E.lineTo(v*.18,x*.5-v*.9),E.lineTo(v*.5,x*.5-v*.9),E.closePath();const T=c(new Rh(E)),M=h(T,w,S,la+.002),b=new Ue;return b.add(M),b.rotation.y=y+Math.PI,b}function _(y){var T;const x=new Ue,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;x.add(v);const E=h(c(new Yn(S*.98,.08)),y.color,.7,ha);return E.position.set(0,ha,t.lab.labelTextHeight*.66),x.add(E),x.position.set(y.labelX,0,y.labelZ),x}const g=new Ue;for(const y of n??[]){const x=new Ue;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new Yn(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,M,b,P]of E){const z=h(c(new Yn(b,P)),y.color,e.padOpacity);z.position.x=T,z.position.z=M,x.add(z)}}else x.add(h(c(new wh(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(f(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const E of[0,Math.PI])x.add(u(w+E,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(f(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,E=h(c(new Yn(.06,S)),y.color,.36);E.position.set(0,la,(v+w)/2),x.add(E);let T=0;for(let b=v;b>=w-.01;b-=1,T++){const P=T%5===0,z=h(c(new Yn(P?2.4:1.3,P?.1:.07)),y.color,P?.72:.42);z.position.set(0,la,b),x.add(z);const I=d(String(T),.52,P?"#eaf4ff":"rgba(200,225,245,0.8)");I.position.set(1.6,ha,b),x.add(I)}const M=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[b,P]of M){const z=v-b,I=h(c(new Yn(1.9,.09)),"#ffffff",.5);I.position.set(-1.5,la,z),x.add(I);const N=d(P,.42,"rgba(220, 236, 250, 0.86)");N.position.set(-3,ha,z),x.add(N)}}else if(y.id==="gait"){x.add(h(f(1.44,1.5),y.color,.5)),x.add(h(f(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,T]of w){const b=Math.sin(S),P=Math.cos(S),z=m(S,1.7,.34,T,.75);z.position.set(b*1.7*.5,0,v+P*1.7*.5),x.add(z);const I=d(E,.44,T);I.position.set(b*(1.7+.7),ha,v+P*(1.7+.7)),x.add(I)}}if(g.add(x),e.showLabels){const v=_(y);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),ha,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const Lh=64,Op=[0,.24,.76,1],GS=[0,1,1,0],Bp=[0,.12,.28,.5,.72,.88,1],VS=[0,.16,.5,1,.5,.16,0];function Ku(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Dh(n,t,e,i,a=Lh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Bp:Op,c=s==="glow"?VS:GS,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/a,y=(p-.5)*e,x=Ku(p,i)*Ku(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*E,d[T*3+1]=0,d[T*3+2]=w*E;const M=x*c[S];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=M}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const y=g*h+p,x=y+h;m.push(y,x,y+1,y+1,x,x+1)}const _=new nn;return _.setAttribute("position",new mn(d,3)),_.setAttribute("color",new mn(u,4)),_.setIndex(m),_.computeBoundingSphere(),_}function Vc(n){const t=new on({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ye,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=Dh(n.radius,n.thickness*f,h,n.edgeFade,Lh,n.profile??"band");if(e.set(d,m),e.size>64){for(const[_,g]of e)if(_!==d&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new ye(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Ju(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function XS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function WS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function YS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const m=u/e,_=t+(1-t)*m,g=c*a+u;s[g*3]=f*_,s[g*3+1]=0,s[g*3+2]=d*_;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new nn;return l.setAttribute("position",new mn(s,3)),l.setAttribute("color",new mn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Qu(n){const t=n.segments??Lh,e=n.profile??"band",a=((e==="glow"?Bp.length:Op.length)-1)*6,s=Dh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ye,vertexColors:!0,toneMapped:!1}),r=new ye(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=_,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function tf(n){const t=new Ue,e=YS(48),i=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ye,vertexColors:!0,toneMapped:!1}),a=new ye(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Dh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ye,vertexColors:!0,toneMapped:!1}),l=new ye(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const _=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function ef(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function $S(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function ZS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function qS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function jS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function KS(n,t,e){return n?t:e}function Hp(n){return{x:0,y:0,z:1}}function JS(n){return Math.asin(Hp().y)}function QS(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const tw=9.81;function Us(n,t,e){return n<t?t:n>e?e:n}function ew(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:tw,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const M of n){const b=Number.isFinite(M.mass)&&M.mass>0?M.mass:0;!Number.isFinite(M.x)||!Number.isFinite(M.y)||!Number.isFinite(M.z)||(r+=b,l+=M.x*b,c+=M.y*b,h+=M.z*b)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const f=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),u=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:u,centerZ:m,halfX:f,halfZ:d};const g=Us((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-u)/f,w=Math.abs(x-m)/d,S=Us(1-Math.max(v,w),0,1),E=Math.max(0,Math.abs(y-u)-f),T=Math.max(0,Math.abs(x-m)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:u,centerZ:m,halfX:f,halfZ:d,marginX:Us(1-v,-1,1),marginZ:Us(1-w,-1,1),score:S,leanDeg:Math.atan2(y-u,x-m)*180/Math.PI,side:v>.98?y>u?1:-1:0,overX:E,overZ:T,grounded:!0}}function nw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function iw(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Us(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const jl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},aw=1e-6;function Vn(n,t,e){return n<t?t:n>e?e:n}function Xc(n,t){const e=Math.max(.2,n);return Vn(Math.pow(e,-t),.5,2)}function sw(n,t){if(!t.enabled)return{...jl};const e=Vn(n.swing,-1,1),i=Vn(n.charge,0,1),a=Vn(n.impact,0,1),s=Vn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Vn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-Vn(t.impactSquash,0,.6)*a;u*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Vn(t.impactSquash,0,.6)*a*.6),y=Vn(t.torsoGain,0,1),x=1+(u-1)*y;return u=Vn(u,.6,1.6),{arm:u,leg:Vn(p,.6,1.4),torso:Vn(x,.7,1.4),girthArm:Xc(u,t.volumeExp),girthLeg:Xc(p,t.volumeExp),girthTorso:Xc(x,t.volumeExp)}}function ow(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function rw(n,t,e){const i=n*Math.exp(-Math.max(aw,e)*Math.max(0,t));return i<.001?0:Vn(i,0,1)}const nf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function cs(n,t,e){return n<t?t:n>e?e:n}function Ne(n,t,e){return n+(t-n)*e}function cw(n){return n?typeof n=="string"?{clip:n}:n:null}function lw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function hw(n,t){const e=n%3*2,i=nf[e],a=nf[e+1];return{...lw(),bodyYaw:Ne(i.yaw,a.yaw,t),bodyPitch:Ne(i.pitch,a.pitch,t),bodyRoll:Ne(i.roll,a.roll,t),pelvisX:Ne(i.px,a.px,t),pelvisZ:Ne(i.pz,a.pz,t),armPitch:Ne(i.ap,a.ap,t),armYaw:Ne(i.ay,a.ay,t),armRoll:Ne(i.ar,a.ar,t),elbow:Ne(i.el,a.el,t),bladePitch:Ne(i.blade,a.blade,t)}}function dw(n,t,e,i,a=0){var M,b,P;const s=((M=i.combo)==null?void 0:M[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=cw(s[r]),c=l?((b=i.clips)==null?void 0:b[l.clip])??null:null,h=cs(((P=i.weaponScale)==null?void 0:P[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,m=cs((e+1)/2,0,1),_=c&&c.keys.length>0?ig(c,m):hw(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&ta(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&ta(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*u,rootYaw:_.rootYaw*u,spinYaw:ag(c,cs(a,0,1)),pitch:_.bodyPitch*u,roll:_.bodyRoll*u,pelvisZ:_.pelvisZ*u,pelvisX:_.pelvisX*u,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&ta(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},E=c?ta(c,"armLPitch")||ta(c,"armLYaw")||ta(c,"armLRoll")||ta(c,"elbowL"):!1,T=E?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=T)),w}function uw(n,t,e){const i=cs(e,0,1),a=(s,o)=>s?o?{pitch:Ne(s.pitch,o.pitch,i),yaw:Ne(s.yaw,o.yaw,i),roll:Ne(s.roll,o.roll,i),elbow:Ne(s.elbow,o.elbow,i)}:null:o;return{yaw:Ne(n.yaw,t.yaw,i),rootYaw:Ne(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ne(n.pitch,t.pitch,i),roll:Ne(n.roll,t.roll,i),pelvisZ:Ne(n.pelvisZ,t.pelvisZ,i),pelvisX:Ne(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ne(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ne(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ne(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ne(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ne(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ne(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ne(n.strike,t.strike,i),blend:t.blend??null}}function fw(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function af(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function pw(n,t){const e=(a,s)=>Math.abs(fw(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=af(n.armR,t.armR),i+=af(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function mw(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=cs(pw(n,t)/l,0,1);return o+(r-o)*c}function sf(n){const t=cs(n,0,1);return t*t*(3-2*t)}function de(n,t,e){return n<t?t:n>e?e:n}const Ri=1e-6;function Ge(n,t,e,i){const a=new ye(new oi(n,t,e),new eo({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function We(){return new Ue}function or(n,t,e){const i=We(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function gw(n){const t=or(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function xw(n){const t=We(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function vw(n){const t=We(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ie(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function yw(n){const t=We();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function _w(n){const t=We(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function Mw(n,t,e,i,a,s,o,r,l,c,h,f,d){const u=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=We(),x=We();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=We();v.name="lower";const w=We();w.name="upper",x.add(v),x.add(w);const S=n.headSize,E=n.legLength,T=n.armLength,M=n.limbThickness,b=n.bodyHeight,P=n.bodyWidth,z=l.spine,I=!!(z!=null&&z.enabled),N=I?de(z.chestPivot??.42,.15,.85)*b:0,D=We();D.name="chest",D.position.y=N,w.add(D);const k=I?D:w;let V,B=null,$=b,at=0;I?($=Math.max(.05,N),at=Math.max(.05,b-N),V=Ge(P,$,.28,t.body),V.name="torsoLower",V.position.y=$/2,w.add(V),B=Ge(P+.008,at,.288,t.body),B.name="torsoUpper",B.position.y=at/2,D.add(B)):(V=Ge(P,b,.28,t.body),V.name="torso",V.position.y=b/2,w.add(V));const mt=We();mt.name="headPivot",mt.rotation.order="YXZ",mt.position.y=Math.min(i.headPivotHeight,b)-N,k.add(mt);const ft=Ge(S,S,S,t.head);ft.position.y=S/2,mt.add(ft);const pt=new eo({color:"#1b2733"});for(const L of[-1,1]){const q=new ye(new oi(.06,.07,.02),pt);q.position.set(L*.09,S/2+.03,S/2+.011),mt.add(q)}const et=L=>{const q=We();q.name=L<0?"hipL":"hipR",q.rotation.order="ZYX",q.position.set(L*(P/2-M/2),0,0),v.add(q);const ut=Ge(M,E/2,M,t.limb);ut.position.y=-E/4,q.add(ut);const yt=We();yt.name="knee",yt.position.y=-E/2,q.add(yt);const Jt=Ge(M,E/2,M,t.limb);Jt.position.y=-E/4,yt.add(Jt);const jt=Ge(M*1.15,.07,M*1.7,t.shoe);jt.position.set(0,-E/2+.035,.045),yt.add(jt);const ce=new Ze;ce.name="footTip",ce.position.y=-E/2,yt.add(ce);const Me=We();return{root:q,joint:yt,hand:Me,wrist:Me,tip:ce,upperMesh:ut,lowerMesh:Jt,segLen:E/2}},K=L=>{const q=We();q.name=L<0?"shoulderL":"shoulderR",q.rotation.order="YXZ",q.position.set(L*(P/2+M/2),b-.04-N,0),k.add(q);const ut=Ge(M,T/2,M,t.limb);ut.position.y=-T/4,q.add(ut);const yt=We();yt.name="elbow",yt.position.y=-T/2,q.add(yt);const Jt=Ge(M,T/2,M,t.limb);Jt.position.y=-T/4,yt.add(Jt);const jt=We();jt.name=L<0?"handL":"handR",jt.position.y=-T/2,yt.add(jt);const ce=Ge(M*1.1,.09,M*1.1,t.head);ce.position.y=.045,jt.add(ce);const Me=We();return Me.name=L<0?"wristL":"wristR",jt.add(Me),{root:q,joint:yt,hand:jt,wrist:Me,upperMesh:ut,lowerMesh:Jt,segLen:T/2}},gt=et(-1),j=et(1),H=K(-1),ot=K(1),wt=[gt,j].map(L=>({root:L.root,joint:L.joint,tip:L.tip,upperLen:E/2,lowerLen:E/2,bend:1})),Ot=We(),Mt=We();Ot.name="mountR",Mt.name="mountL";const Lt=We(),F=We();Lt.name="gripR",F.name="gripL",ot.wrist.add(Ot),H.wrist.add(Mt),Ot.add(Lt),Mt.add(F);const le=vw(t),Wt=yw(t),Nt=_w(t),Ct={"sword-shield":{right:or(.42,.075,t),left:xw(t)},"dual-swords":{right:or(.42,.075,t),left:or(.42,.075,t)},greatsword:{right:gw(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:le.g,left:We(),orb:le.orb},bow:{right:Nt,left:Wt.g,arrow:Nt,drawString:Wt.drawString}};for(const L of Object.keys(Ct))Lt.add(Ct[L].right),F.add(Ct[L].left),Ct[L].right.visible=!1,Ct[L].left.visible=!1;function Dt(L,q,ut){const yt=new Ze;yt.name="bladeBase",yt.position.y=q,L.add(yt);const Jt=new Ze;Jt.name="bladeTip",Jt.position.y=ut,L.add(Jt)}Dt(Ct["sword-shield"].right,.44,.55),Dt(Ct["dual-swords"].right,.44,.55),Dt(Ct["dual-swords"].left,.44,.55),Dt(Ct.greatsword.right,.74,.88),Dt(Ct.staff.right,.78,.92);let Tt=null,C=null,A=1,Z=0,dt=0,Q=null,rt=0,zt=0,nt=0,vt=0,Ft=0,st=0,St=FS(),O={...Ch},lt=0,xt=0,Xt=0,Ut=-1,Zt=0,U=0,bt=0,it=0,ht=0,Rt=0,At=0,Qt=1,se=0,ue=0,oe=0,Ee=!1,Be=0,gn=0,Ae=0,ze=0,Re="none",qe=0,Dn=1,tn=!1,X=-1,kt=!1,Et=0,ne=0,Kt=0,fe={...jl},Te=0,R=0,Y={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},J=NaN,tt=0,W=0,Pt=0,It=NaN,Yt=NaN,qt=-1,Ht=null,Vt=null,Gt=0,re=1,_e=.1,xe=null,Le={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},_t=null,ct=null,te=null,ae=null,ve=null,bn=null,He="R",xn=0,be=0,Pe=0,Fn=0,ln=1,je=0,Sn=null,ri=0,kh=0,kr=NaN,Ih=NaN,Ir={speed:0,phase:0},ys={lp:0,lr:0,rp:0,rr:0},Gp=0,zr=0,Fr=!0,Ur=0,_s="none",wa=0,Ea=0,Ta=0,so=.3,zh=0;function Vp(L){const q=Math.PI/180,ut=s;let yt=0,Jt=0,jt=0,ce=0;L==="sword-shield"?(yt=ut.swordPitchDeg*q,jt=ut.shieldPitchDeg*q):L==="dual-swords"?(yt=ut.swordPitchDeg*q,jt=ut.swordPitchDeg*q):L==="greatsword"?(yt=ut.greatswordPitchDeg*q,jt=ut.greatswordPitchDeg*q):L==="staff"?yt=ut.staffPitchDeg*q:jt=ut.bowPitchDeg*q,Ot.rotation.set(yt,0,Jt),Mt.rotation.set(jt,0,ce),Ot.position.x=L==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Fh(L){if(L!==Tt){Tt=L;for(const q of Object.keys(Ct))Ct[q].right.visible=q===L,Ct[q].left.visible=q===L;Vp(L),Wt.drawString.position.z=-.06,Nt.position.z=0,le.orb.scale.setScalar(1),w.rotation.y=0}}Fh("sword-shield");const Uh=[];y.traverse(L=>{L instanceof ye&&L.material instanceof eo&&Uh.push(L.material)});const Xp=new ie(r.flashColor);function Wp(L,q){const ut=kp(L,q,r);St=ut,w.rotation.x+=ut.upperPitch,w.rotation.z+=ut.upperRoll,w.rotation.y+=ut.upperYaw;const yt=de(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=de(ut.upperShiftX*yt,-Jt,Jt),w.position.z+=de(ut.upperShiftZ*yt,-Jt,Jt),x.position.x+=ut.comX,x.position.z+=ut.comZ-ut.pelvisBack,x.position.y-=ut.drop;const jt=ut.legacy?0:de(r.lowerScale,0,1);v.position.z+=ut.pelvisBack*(1-jt),v.position.y+=ut.drop*(1-jt),gt.joint.rotation.x+=ut.knee,j.joint.rotation.x+=ut.knee,gt.root.rotation.x-=ut.hip,j.root.rotation.x-=ut.hip,H.root.rotation.x+=ut.arm,ot.root.rotation.x+=ut.arm*.8;for(const ce of Uh)ce.emissive.copy(Xp).multiplyScalar(ut.flash)}function oo(L){return L<.22?-1:L<.42?-1+(L-.22)/.2*2:L<.5?1:Math.max(0,1-(L-.5)/.5)}function Yp(L){for(const q of[H,ot])q.upperMesh.scale.set(L.girthArm,L.arm,L.girthArm),q.upperMesh.position.y=-q.segLen/2*L.arm,q.joint.position.y=-q.segLen*L.arm,q.lowerMesh.scale.set(L.girthArm,L.arm,L.girthArm),q.lowerMesh.position.y=-q.segLen/2*L.arm,q.hand.position.y=-q.segLen*L.arm;for(const q of[gt,j])q.upperMesh.scale.set(L.girthLeg,L.leg,L.girthLeg),q.upperMesh.position.y=-q.segLen/2*L.leg,q.joint.position.y=-q.segLen*L.leg,q.lowerMesh.scale.set(L.girthLeg,L.leg,L.girthLeg),q.lowerMesh.position.y=-q.segLen/2*L.leg,q.tip.position.y=-q.segLen*L.leg;V.scale.set(L.girthTorso,L.torso,L.girthTorso),V.position.y=$/2*L.torso,B&&(B.scale.set(L.girthTorso,L.torso,L.girthTorso),B.position.y=at/2*L.torso,D.position.y=$*L.torso)}function $p(L,q){const ut=s.twoHandGripY??-.16,yt=Math.max(1,s.twoHandMaxStretch??1.25),Jt=T*yt*.99,jt=H.root.position.x,ce=H.root.position.y,Me=H.root.position.z,ge=H.root.rotation.y,Ve=Math.cos(ge),hn=Math.sin(ge),Ke=Ui=>{const Ra=Ot.localToWorld(new G(0,Ui,0)),En=(I?D:w).worldToLocal(Ra),Pa=En.x-jt,Br=En.y-ce,lo=En.z-Me,Ca={x:Pa*Ve-lo*hn,y:Br,z:Pa*hn+lo*Ve};return{t:Ca,dist:Math.hypot(Ca.x,Ca.y,Ca.z)}};let Se=ut,De=Ke(Se);if(!Number.isFinite(De.dist)||De.dist<=Ri)return;for(let Ui=0;Ui<18&&De.dist>Jt;Ui++)if(Se*=.78,De=Ke(Se),!Number.isFinite(De.dist)||De.dist<=Ri)return;Number.isFinite(J)||(J=Se);const an=Math.max(0,s.twoHandSlideRate??9);J+=(Se-J)*(1-Math.exp(-an*q));const wn=Ke(J),Qe=wn.t,qn=wn.dist,Un=qn/Math.max(Ri,T),jn=de(Un,1,yt),ci=Math.max(1,s.twoHandGripStart??1.02),zi=Math.max(ci+.001,yt),Fi=de(s.twoHandMinGrip??1,0,1),Nn=de((Un-ci)/(zi-ci),0,1),li=1-Nn*Nn*(3-2*Nn)*(1-Fi),On=T/2*jn,Aa=zp(Qe,On,On,-1),Mi=Fp({rootPitch:H.root.rotation.x,rootRoll:H.root.rotation.z,jointPitch:H.joint.rotation.x},Aa,de(L*li,0,1),Math.PI);H.root.rotation.x=Mi.rootPitch,H.root.rotation.z=Mi.rootRoll,H.joint.rotation.x=Math.min(Mi.jointPitch,-.06);const Kn=1/Math.sqrt(jn);H.upperMesh.scale.set(Kn,jn,Kn),H.upperMesh.position.y=-On/2,H.joint.position.y=-On,H.lowerMesh.scale.set(Kn,jn,Kn),H.lowerMesh.position.y=-On/2,H.hand.position.y=-On,Y={active:!0,dist:qn,gy:J,pitch:Mi.rootPitch,joint:H.joint.rotation.x,grip:li}}function Zp(L,q){if(!m.enabled){tt=0,W=0,ot.wrist.rotation.set(0,0,0),It=ot.root.rotation.x,Yt=Gh();return}const ut=ot.root.rotation.x,yt=Gh();if(q!==qt){qt=q,It=ut,Yt=yt,ot.wrist.rotation.set(tt,0,W);return}if(!Number.isFinite(It)||L<=1e-5){It=ut,Yt=yt,ot.wrist.rotation.set(tt,0,W);return}const Jt=(ut-It)/L,jt=Xe(yt-Yt)/L;It=ut,Yt=yt;const ce=Math.max(0,m.maxAngle),Me=Math.max(0,m.maxTwist),ge=.15+.85*de(be,0,1),hn=-de(Pt,0,1.4)*Math.max(0,m.runDrag),Ke=de(-Jt*m.lag*ge+hn,-ce,ce),Se=de(jt*m.twistLag*ge,-Me,Me),De=1-Math.exp(-Math.max(0,m.rate)*L);tt+=(Ke-tt)*De,W+=(Se-W)*De,ot.wrist.rotation.set(tt,0,W)}function qp(L){const q=Math.PI/180;return L==="greatsword"?s.greatswordPitchDeg*q:L==="staff"?s.staffPitchDeg*q:L==="bow"?s.bowPitchDeg*q:s.swordPitchDeg*q}function Nr(L){const q=Math.PI/180;return L==="sword-shield"?s.shieldPitchDeg*q:L==="greatsword"?s.greatswordPitchDeg*q:L==="bow"?s.bowPitchDeg*q:s.swordPitchDeg*q}function jp(L){const q=Math.PI/180;return L==="sword-shield"||L==="dual-swords"?(s.swordCantDeg??0)*q:L==="greatsword"?(s.greatswordCantDeg??0)*q:0}function Kp(L,q){const ut=L.weapon;if(ut==="staff"||ut==="bow")return;const yt=He==="R",Jt=yt?ot:H,jt=yt?Ot:Mt,ce=yt?H:ot,Me=yt?Mt:Ot,ge=ut==="greatsword"&&yt?st:0,Ve=ut==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,hn=Math.PI/180,Ke=-Ve*hn,Se=Ve*hn,De=(Nn,li)=>{const On=Math.max(0,Math.PI/2-Math.abs(li));return Math.sign(Nn)*Math.min(Math.abs(Nn),On)},an=(_t??qp(ut)+Z)+ge,wn=q+Jt.root.rotation.x+Jt.joint.rotation.x;jt.rotation.set(Math.PI/2-an-wn,0,De(yt?Ke:Se,an));const Qe=ct??(ut==="sword-shield"?null:Nr(ut)+dt),qn=q+ce.root.rotation.x+ce.joint.rotation.x;ut==="sword-shield"?Me.rotation.x=Qe===null?Nr(ut):Nr(ut)-Qe-qn:Me.rotation.set(Math.PI/2-(Qe??0)-qn,0,De(yt?Se:Ke,Qe??0));const Un=jp(ut),jn=ve??0,ci=bn??0,zi=te??0,Fi=ae??0;yt?(Lt.rotation.z=-Un+jn,Lt.rotation.y=zi,F.rotation.z=Un+ci,F.rotation.y=Fi):(F.rotation.z=Un+jn,F.rotation.y=zi,Lt.rotation.z=-Un+ci,Lt.rotation.y=Fi)}function Nh(L){_t=L.bladePitch,ct=L.bladePitchOff,te=L.bladeTwist,ae=L.bladeTwistOff,ve=L.bladeYaw,bn=L.bladeYawOff,He=L.lead,xn=L.rootYaw+L.spinYaw,y.rotation.y=xn,w.rotation.y+=L.yaw,w.rotation.x+=L.pitch,w.rotation.z+=L.roll,x.position.z+=L.pelvisZ,x.position.x+=L.pelvisX,L.armR&&(ot.root.rotation.x=L.armR.pitch,ot.root.rotation.y=L.armR.yaw,ot.root.rotation.z=L.armR.roll,ot.joint.rotation.x=L.armR.elbow),L.armL&&(H.root.rotation.x=L.armL.pitch,H.root.rotation.y=L.armL.yaw,H.root.rotation.z=L.armL.roll,H.joint.rotation.x=L.armL.elbow)}function Oh(L,q){const ut=xe??oo(L.attackProgress),yt=dw(L.weapon,L.comboIndex,ut,p,L.attackProgress);if(L.comboIndex!==Gt){Vt=Ht,re=0,Gt=L.comboIndex;const ce=L.timings.windup+L.timings.active+L.timings.recovery,Me=Math.max(p.segBlendMin??.03,ce*.22);_e=mw(Vt,yt,p,yt.blend??null,Me)}const Jt=Math.max(.008,_e);re=Math.min(1,re+q/Jt);const jt=Vt&&re<1?uw(Vt,yt,sf(re)):yt;return Ht=jt,jt}function Jp(L,q){const ut=P/2+M/2,yt=b-.04-N;if(!p.enabled){H.root.position.set(-ut,yt,0),ot.root.position.set(ut,yt,0),Le={lx:-ut,ly:yt,lz:0,rx:ut,ry:yt,rz:0};return}const Jt=Math.max(0,p.shoulderLift),jt=Math.max(0,p.shoulderPush),ce=L&&q==="greatsword"?Math.max(0,p.shoulderIn):0,Me=wn=>Jt*de((-wn-.5)/1.45,0,1),ge=wn=>jt*de((-wn-.2)/1.9,0,1),Ve=-ut+ce,hn=yt+Me(H.root.rotation.x),Ke=ge(H.root.rotation.x),Se=ut-ce,De=yt+Me(ot.root.rotation.x),an=ge(ot.root.rotation.x);H.root.position.set(Ve,hn,Ke),ot.root.position.set(Se,De,an),Le={lx:Ve,ly:hn,lz:Ke,rx:Se,ry:De,rz:an}}function Qp(L){if(L.phase==="idle"||L.charging)return;const q=L.attackProgress,ut=oo(q),yt=Math.max(0,ut),Jt=L.comboIndex%2===0?1:-1,jt=l.stride,ce=Number.isFinite(jt.stepReach)?jt.stepReach:.17,Me=Number.isFinite(jt.stepSideReach)?jt.stepSideReach:.14,ge=Number.isFinite(jt.stepDipReach)?jt.stepDipReach:.05,Ve=L.weapon==="greatsword"?de(Number.isFinite(jt.heavyScale)?jt.heavyScale:1,0,1):1;x.position.z+=ce*yt*Ve,x.position.x+=Jt*Me*yt*Ve,x.position.y-=ge*Math.sin(Math.PI*q)*Ve}let Bh=null;function tm(){Bh={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:H.root.rotation.x,lry:H.root.rotation.y,lrz:H.root.rotation.z,lj:H.joint.rotation.x,rrx:ot.root.rotation.x,rry:ot.root.rotation.y,rrz:ot.root.rotation.z,rj:ot.joint.rotation.x,rootY:y.rotation.y}}function em(L){const q=Bh;if(!q)return;const ut=sf(de(L,0,1));if(ut>=1)return;const yt=(Jt,jt)=>Jt+(jt-Jt)*ut;w.rotation.x=yt(q.upperX,w.rotation.x),w.rotation.y=yt(q.upperY,w.rotation.y),w.rotation.z=yt(q.upperZ,w.rotation.z),w.position.x=yt(q.upperPX,w.position.x),w.position.z=yt(q.upperPZ,w.position.z),x.position.x=yt(q.pelvisX,x.position.x),x.position.y=yt(q.pelvisY,x.position.y),x.position.z=yt(q.pelvisZ,x.position.z),x.rotation.x=yt(q.pelvisRX,x.rotation.x),x.rotation.z=yt(q.pelvisRZ,x.rotation.z),H.root.rotation.x=yt(q.lrx,H.root.rotation.x),H.root.rotation.y=yt(q.lry,H.root.rotation.y),H.root.rotation.z=yt(q.lrz,H.root.rotation.z),H.joint.rotation.x=yt(q.lj,H.joint.rotation.x),ot.root.rotation.x=yt(q.rrx,ot.root.rotation.x),ot.root.rotation.y=yt(q.rry,ot.root.rotation.y),ot.root.rotation.z=yt(q.rrz,ot.root.rotation.z),ot.joint.rotation.x=yt(q.rj,ot.joint.rotation.x),y.rotation.y=q.rootY+Xe(y.rotation.y-q.rootY)*ut,xn=y.rotation.y}let Ms=null,Or=0,Hh=0;function nm(){if(!I)return;const L=z,q=Math.max(0,L.waist??1),ut=Math.max(0,L.chest??0),yt=q+ut,Jt=yt>1e-6?q/yt:1,jt=yt>1e-6?ut/yt:0,ce=w.rotation.x,Me=w.rotation.y,ge=w.rotation.z;w.rotation.set(ce*Jt,Me*Jt,ge*Jt),D.rotation.set(ce*jt,Me*jt,ge*jt);const Ve=de(L.neck??0,0,1);Ve>0&&(mt.rotation.x-=ce*Ve),Ms={x:ce,y:Me,z:ge}}function ro(){return{yaw:w.rotation.y+(I?D.rotation.y:0),pitch:w.rotation.x+(I?D.rotation.x:0),lean:w.rotation.z+(I?D.rotation.z:0)}}function Gh(){return ro().yaw}function im(L,q){if(!(d!=null&&d.enabled)){Sn=null,ri=0;return}y.updateWorldMatrix(!0,!0);const ut=new G,yt=[],Jt=(Kn,Ui,Ra=0)=>{Kn.getWorldPosition(ut),yt.push({x:ut.x,y:ut.y+Ra,z:ut.z,mass:Ui})},jt=n.headSize;Jt(mt,.08,jt/2),Jt(V,.14),Jt(B??D,.24),Jt(x,.12),Jt(H.hand,.05),Jt(ot.hand,.05),Jt(gt.joint,.15),Jt(j.joint,.15);const ce=Tt?co(Ct[Tt].right):null;ce&&yt.push({x:(ce.base.x+ce.tip.x)/2,y:(ce.base.y+ce.tip.y)/2,z:(ce.base.z+ce.tip.z)/2,mass:Tt==="greatsword"?.09:.04});const Me=Math.max(.05,n.limbThickness*1.15/2+.015),ge=Math.max(.06,n.limbThickness*1.7/2+.02);let Ve=1/0,hn=-1/0,Ke=1/0,Se=-1/0,De=0;for(const Kn of[gt,j])Kn.tip.getWorldPosition(ut),ut.y<=.13&&(De+=1),Ve=Math.min(Ve,ut.x-Me),hn=Math.max(hn,ut.x+Me),Ke=Math.min(Ke,ut.z-ge),Se=Math.max(Se,ut.z+ge);(!Number.isFinite(Ve)||De===0)&&(Ve=hn=Ke=Se=0);let an=0,wn=0;Number.isFinite(kr)&&q>1e-5&&(an=de((L.position.x-kr)/q,-20,20),wn=de((L.position.z-Ih)/q,-20,20)),kr=L.position.x,Ih=L.position.z;const Qe=ew(yt,{minX:Ve,maxX:hn,minZ:Ke,maxZ:Se},an,wn,d);if(Sn=Qe,!d.autoCounter){ri=0;return}const qn=Math.cos(L.bodyYaw),Un=-Math.sin(L.bodyYaw),jn=Qe.xcomX-Qe.centerX,ci=Qe.xcomZ-Qe.centerZ,zi=jn*qn+ci*Un,Fi=an*qn+wn*Un,Nn=Qe.grounded?nw(zi,Fi,d.predLead??0):0;Hh=Nn;const li=Math.abs(Nn)-.45*Qe.halfX;kh=li;let On=0;li>.002&&Qe.grounded&&(On=-Math.sign(Nn)*Math.min(Math.max(.005,d.maxShift??.045),(li+.002)*1.1666666666666667));const Aa=Math.abs(Nn)/Math.max(1e-4,Qe.halfX),Mi=Math.max(.1,iw(d.counterRate,Aa,d.counterBoost??0));ri+=(On-ri)*(1-Math.exp(-Mi*q))}function am(L,q){if(Wt.drawString.position.z=-.06,Nt.position.z=0,le.orb.scale.setScalar(1),w.rotation.y=0,L.charging&&L.weapon==="bow"){const jt=L.charge;H.root.rotation.x=-1.25,H.joint.rotation.x=-.15,ot.root.rotation.x=.35+jt*.3,ot.joint.rotation.x=-1.15,Wt.drawString.position.z=-.06-jt*.22,Nt.position.z=-jt*.3,w.rotation.y=-.22;return}if(L.phase==="idle"&&Pe<=.001){Vt=null,Ht=null,Gt=0,re=1,_e=Math.max(.008,p.segBlend),_t=null,ct=null,te=null,ae=null,ve=null,bn=null,J=NaN,L.weapon==="greatsword"&&(Ot.position.x=-Math.max(0,s.twoHandInsetX??0));return}const ut=oo(L.attackProgress),yt=Math.max(0,-ut),Jt=Math.max(0,ut);if(L.weapon==="bow")H.root.rotation.x=-1.2,H.joint.rotation.x=-.15,ot.root.rotation.x=.9-Jt*.8,ot.joint.rotation.x=-.3;else if(L.weapon==="greatsword")if(p.enabled)Nh(Oh(L,q));else{const jt=-1.6*yt+1.25*Jt,ce=de(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);ot.root.rotation.x=jt,ot.joint.rotation.x=-(.25+yt*.4),H.root.rotation.x=jt+.06,H.joint.rotation.x=-(.32+yt*.4),H.root.rotation.z=.42,ot.root.rotation.z=0;const Me=-Math.sin(ot.root.rotation.x);ot.root.rotation.y=-.72*Math.tanh(Me*4),w.rotation.y=-.2*ut*ce}else if(p.enabled)Nh(Oh(L,q));else{const jt=L.comboIndex;if(jt===1)ot.root.rotation.x=-1.7*yt+1.1*Jt,ot.joint.rotation.x=-(.2+yt*.5),H.root.rotation.x=.1,w.rotation.y=-.18*ut;else if(jt===2)H.root.rotation.x=-1.5*yt+1*Jt,H.joint.rotation.x=-(.2+yt*.5),ot.root.rotation.x=.2,w.rotation.y=.45*-ut;else{const ce=-1.9*yt+1.2*Jt;H.root.rotation.x=ce,ot.root.rotation.x=ce,H.joint.rotation.x=-(.15+yt*.4),ot.joint.rotation.x=-(.15+yt*.4),w.rotation.y=-.3*ut}}if(L.weapon==="greatsword"){const jt=de((-ot.root.rotation.x-1.3)/1.2,0,1);Ot.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-jt)}Qp(L)}function sm(L,q){L&&(ot.root.rotation.x=-1.05,ot.joint.rotation.x=-.35,H.root.rotation.x=-.45,H.joint.rotation.x=-.2,w.rotation.y=-.12,le.orb.scale.setScalar(1.25+.12*Math.sin(q*2)))}function om(L){if(!L||L.phase==="idle")return;const q=L.progress,ut=q<.3?-.35+q/.3*1.35:q<.7?1:Math.max(0,1-(q-.7)/.3),yt=Math.PI/180;w.rotation.x+=_.leanDeg*yt*ut,H.root.rotation.x-=_.shieldPitchDeg*yt*ut,H.joint.rotation.x-=.22*ut,ot.root.rotation.x-=.3*ut,x.position.z+=_.pelvisReach*Math.max(0,ut)}function co(L){if(!L)return null;const q=L.getObjectByName("bladeBase"),ut=L.getObjectByName("bladeTip");if(!q||!ut)return null;L.updateWorldMatrix(!0,!1);const yt=q.getWorldPosition(new G),Jt=ut.getWorldPosition(new G),jt=new G().setFromMatrixColumn(L.matrixWorld,0).normalize();return{base:{x:yt.x,y:yt.y,z:yt.z},tip:{x:Jt.x,y:Jt.y,z:Jt.z},normal:{x:jt.x,y:jt.y,z:jt.z}}}return{group:y,update(L,q,ut,yt,Jt=!1,jt,ce,Me){var td;Fh(q.weapon),y.rotation.y=0,xn=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,D.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ge=Math.max(1/240,Math.min(yt,.1));Q=((td=l.stance)==null?void 0:td[q.weapon])??null,C!==q.weapon&&(C=q.weapon,A=Q?0:1);const Ve=Math.max(.01,(Q==null?void 0:Q.blend)??.22);A=Math.min(1,A+ge/Ve);const hn=Q?A:0;Z=((Q==null?void 0:Q.bladePitchDeg)??0)*Math.PI/180*hn,dt=((Q==null?void 0:Q.bladePitchOffDeg)??0)*Math.PI/180*hn;const Ke=jt===void 0?Gp+=yt:jt;zr=Ke;const Se=l.landing;Se.enabled?Fr&&!L.grounded?(_s="jump",wa=Ke,Ea=Se.anticipationDuration,Ta=Math.max(0,Se.jumpAnticipation),so=.32):!Fr&&L.grounded&&(_s="land",wa=Ke,Ea=Se.duration,Ta=zS(Ur,Se),so=Se.compressRatio,zh=Ur):(_s="none",Ta=0),Ke<wa&&(_s="none",Ta=0),Fr=L.grounded,Ur=L.velocity.y;const De=ju(Ke,wa,Ea,Ta,so),an=q.phase!=="idle",wn=(Me==null?void 0:Me.phase)==="active";be=LS(be,an,ge,l.attack.blendRate);const Qe=DS(be,l.attack.gaitWeight,l.attack.lowerBodyWeight);Fn=Qe.attackLegWeight,ln=Qe.gaitScale;const qn=Math.sin(L.bodyYaw),Un=Math.cos(L.bodyYaw),jn=(L.velocity.x-rt)/ge,ci=(L.velocity.z-zt)/ge,zi=de(jn,-60,60),Fi=de(ci,-60,60),Nn=zi*qn+Fi*Un,li=Xe(L.bodyYaw-nt)/ge,On=Math.hypot(L.velocity.x,L.velocity.z),Aa=o.maxForwardDeg*Math.PI/180,Mi=o.maxSideDeg*Math.PI/180,Kn=de(Nn*o.accelGain,-Aa,Aa),Ui=de(-li*On*o.turnGain,-Mi,Mi),Ra=1-Math.exp(-o.smoothing*ge);vt+=(Kn-vt)*Ra,Ft+=(Ui-Ft)*Ra,rt=L.velocity.x,zt=L.velocity.z,nt=L.bodyYaw;const En=Math.hypot(L.velocity.x,L.velocity.z),Pa=de(a.knockGaitScale??0,0,1),Br=ut.knockX*Pa,lo=ut.knockZ*Pa,Ca=Pa>0&&Math.hypot(ut.knockX,ut.knockZ)>.001,Hr=L.velocity.x+Br,Gr=L.velocity.z+lo,Vh=Math.hypot(Hr,Gr);ze=Vh;const rm=Math.cos(L.bodyYaw),cm=-Math.sin(L.bodyYaw),lm=L.velocity.x*rm+L.velocity.z*cm,Xh=En>Ri?de(lm/En,-1,1):0,Wh=En>Ri?de((L.velocity.x*qn+L.velocity.z*Un)/En,-1,1):1,hm=Ph(Wh,a.backStrafeStartDeg,a.backStrafeFullDeg);Re==="settled"&&kt&&Et>ne*1.02+1e-4&&(Re="none");let bs=1;Re==="blend"?(bs=Pp(tn?X:qe,a.stopYawBlendMode,tn),tn||(qe=Math.min(1,qe+ge/Math.max(.01,a.stopYawAfterSec)),(qe>=1||a.stopYawBlendMode==="inStop"||kt)&&(Re="settled",bs=0))):Re==="settled"&&(bs=de(En/Math.max(Ri,a.stopEnterRatio*e),0,1)),Dn=bs;const dm=wp(Xh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),um=Ep(Wh,Xh,dm,hm)*bs;xt+=(um-xt)*(1-Math.exp(-i.hipYawSmoothing*ge));const Ss=L.bodyYaw+xt;Xt=Ss;const fm=Math.sin(Ss),pm=Math.cos(Ss),mm=Math.cos(Ss),gm=-Math.sin(Ss),hi={speed:Vh,phase:L.gaitPhase,localForward:Hr*fm+Gr*pm,localRight:Hr*mm+Gr*gm,stride:L.stride};an&&!Ee&&(oe=L.gaitPhase),Ee=an;const La=be>0?PS(hi,q.attackProgress,q.comboIndex,be,l.stride,oe):hi;Ir=La;const Yh=Math.max(0,a.stopBlendSec||0),$h=Yh>0&&!an&&!Ca&&L.grounded,Vr=Tp(En,se,e,a.stopEnterRatio,a.stopExitRatio);if(!$h||Vr.resume)Ut=-1;else if(Ut<0&&Vr.enter){Ut=0,Zt=L.gaitPhase,U=bp(L.gaitPhase),bt=En,it=Math.max(L.stride,Ri),ht=hi.localForward,Rt=hi.localRight;const ee=1/Math.max(Ri,En);At=L.velocity.x*ee,Qt=L.velocity.z*ee}const xm=se;se=En;const di=$h&&Ut>=0;di&&(Ut=Math.min(1,Ut+ge/Yh)),di&&Re!=="blend"&&(Re="blend",qe=0),tn=di&&Ut<1,X=Ut,kt=Vr.resume,Et=En,ne=xm;const Zh=di?{phase:Zt,speed:bt,moveSpeed:e,localForward:ht,localRight:Rt,legLength:n.legLength,stride:it,grounded:!0}:{phase:La.phase,speed:La.speed,moveSpeed:e,localForward:La.localForward,localRight:La.localRight,legLength:n.legLength,stride:La.stride??0,grounded:L.grounded};let Xr=di?Sp(Zh,a,{progress:Ut,phase0:Zt,phaseEnd:U}):Mr(Zh,a);const Qi=l.attack.moveTakeover;if(Qi&&!di){const ee=q.phase==="windup"?Qi.windup:q.phase==="recovery"?Qi.recovery:q.phase==="settle"?Qi.settle:0,he=Math.max(.05,Qi.full-Qi.speed),vn=de((hi.speed-Qi.speed)/he,0,1),Tn=de(ee,0,1)*vn,ho=Tn>je?10:6;je=de(je+(Tn-je)*(1-Math.exp(-ho*ge)),0,1)}else di?je=0:je=de(je*Math.exp(-8*ge),0,1);if(je>.001&&!di){const ee=Mr({phase:hi.phase,speed:hi.speed,moveSpeed:e,localForward:hi.localForward,localRight:hi.localRight,legLength:n.legLength,stride:hi.stride??0,grounded:L.grounded},a);Xr=kS(Xr,ee,je)}const ke=IS(Xr,Qe.gaitScale);if(Kt=0,wn&&Me){const ee=TS(Me.progress,Me.dir,a),he=Qe.gaitScale;ke.legL.pitchX+=ee.legL.pitchX*he,ke.legL.rollZ+=ee.legL.rollZ*he,ke.legL.kneeX+=ee.legL.kneeX*he,ke.legR.pitchX+=ee.legR.pitchX*he,ke.legR.rollZ+=ee.legR.rollZ*he,ke.legR.kneeX+=ee.legR.kneeX*he,ke.pelvisY+=ee.pelvisY*he,Kt=ee.env}let Wr=0,Yr=0,$r=0,qh=0;if(di){const ee=Rp(L.bodyYaw,At,Qt),he=Cp(Ut,Zt,ee.forward,ee.right,a);he.leadLeft?(ke.legL.pitchX-=he.leadPitch,ke.legL.kneeX+=he.leadKnee,ke.legR.pitchX+=he.trailPitch):(ke.legR.pitchX-=he.leadPitch,ke.legR.kneeX+=he.leadKnee,ke.legL.pitchX+=he.trailPitch),Yr=he.bodyShift*he.fwdN,Wr=he.bodyShift*he.rightN,$r=he.bodyDip,qh=he.chestPitch,Be=he.leadPitch,gn=he.bodyShift,Ae=he.bodyDip}else Be=0,gn=0,Ae=0;if(ys={lp:ke.legL.pitchX,lr:ke.legL.rollZ,rp:ke.legR.pitchX,rr:ke.legR.rollZ},!L.grounded)gt.root.rotation.x=-.55,j.root.rotation.x=-.25,gt.joint.rotation.x=.75,j.joint.rotation.x=.55,H.root.rotation.x=-.9,ot.root.rotation.x=-.7,H.joint.rotation.x=-.6,ot.joint.rotation.x=-.6,gt.root.rotation.z=0,j.root.rotation.z=0;else{gt.root.rotation.x=ke.legL.pitchX,j.root.rotation.x=ke.legR.pitchX,gt.root.rotation.z=ke.legL.rollZ,j.root.rotation.z=ke.legR.rollZ,gt.joint.rotation.x=ke.legL.kneeX,j.joint.rotation.x=ke.legR.kneeX;const ee=Q?A:0,he=1+(((Q==null?void 0:Q.armSwing)??1)-1)*ee,vn=Q==null?void 0:Q.armR,Tn=Q==null?void 0:Q.armL,ho=ke.armL*he+((Tn==null?void 0:Tn.pitch)??0)*ee,ed=ke.armR*he+((vn==null?void 0:vn.pitch)??0)*ee;H.root.rotation.x=ho,ot.root.rotation.x=ed,H.joint.rotation.x=-(.18+ho*.2)+((Tn==null?void 0:Tn.elbow)??0)*ee,ot.joint.rotation.x=-(.18+ed*.2)+((vn==null?void 0:vn.elbow)??0)*ee,H.root.rotation.z=((Tn==null?void 0:Tn.roll)??0)*ee,ot.root.rotation.z=((vn==null?void 0:vn.roll)??0)*ee,H.root.rotation.y=((Tn==null?void 0:Tn.yaw)??0)*ee,ot.root.rotation.y=((vn==null?void 0:vn.yaw)??0)*ee,x.position.x=ke.pelvisX,x.position.y=E+ke.pelvisY,x.position.z=0,x.rotation.z=ke.pelvisRoll}const vm=Up(x,v),ws=wn?{...u,weight:0}:di&&u.enabled?{...u,weight:1}:u,jh=ws.enabled&&L.grounded&&ws.weight>0?de(ws.weight,0,1)*(an?de(ws.attackScale,0,1):1):0;x.position.x+=Wr,x.position.z+=Yr,x.position.y-=$r,v.position.y+=$r,jh<=0&&(v.position.x-=Wr,v.position.z-=Yr);const Zr=En/Math.max(e,Ri);Pt=Zr;const ym=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,_m=1-Math.exp(-Math.max(0,ym)*ge);lt+=(de(Zr,0,1)-lt)*_m;const Da=Ip({leanForward:vt,leanSide:Ft,speedRatio:lt},o);x.rotation.x+=Da.pelvisPitch,x.rotation.z+=Da.pelvisRoll,x.position.x+=Da.pelvisX,x.position.z+=Da.pelvisZ,x.position.y-=Da.crouch,v.position.y+=Da.crouch*(1-de(jh,0,1));const Kh=q.phase!=="idle"||q.charging&&q.weapon==="bow",qr=Kh?1:0,Mm=Math.max(.001,qr>Pe?p.poseIn??.1:p.poseOut??.16);if(Pe!==qr){const ee=ge/Mm;Pe=de(Pe+(qr>Pe?ee:-ee),0,1)}if((Pe>0||Kh)&&tm(),am(q,ge),Pe>0&&Pe<1&&em(Pe),Q){const ee=(1-Pe)*A;w.rotation.y+=(Q.torsoYaw??0)*ee,w.rotation.x+=(Q.torsoPitch??0)*ee}sm(Jt,L.gaitPhase),om(ce);const bm=q.weapon==="greatsword",Jh=Math.hypot(L.velocity.x,L.velocity.z),Sm=bm&&q.phase==="idle"&&Jh>.5?Math.min(1.15,Jh/Math.max(e,.001)*.9):0;st+=(Sm-st)*(1-Math.exp(-6*ge));const wm=w.rotation.x;q.weapon==="bow"&&(Wt.g.rotation.x=-(H.root.rotation.x+H.joint.rotation.x),Nt.rotation.x=-(ot.root.rotation.x+ot.joint.rotation.x));const Em=w.rotation.y;Wp(ut,L.bodyYaw);const Qh=ut.type==="none"?1:.4;if(w.rotation.x+=vt*Qh+qh,w.rotation.z+=(Ft+ke.sideLean)*Qh,De>0&&(gt.root.rotation.x-=Se.hipPitch*De,j.root.rotation.x-=Se.hipPitch*De,gt.joint.rotation.x+=Se.kneeBend*De,j.joint.rotation.x+=Se.kneeBend*De,x.position.y-=Se.crouchDepth*De,v.position.y+=Se.crouchDepth*(1-Se.lowerScale)*De,w.rotation.x+=Se.upperPitch*De,H.root.rotation.x-=Se.armTuck*De,ot.root.rotation.x-=Se.armTuck*De),Fn>0&&L.grounded){const ee=CS(q.attackProgress,q.comboIndex,l.stride),he=Fn;gt.root.rotation.x+=ee.legL.pitchX*he,j.root.rotation.x+=ee.legR.pitchX*he,gt.root.rotation.z+=ee.legL.rollZ*he,j.root.rotation.z+=ee.legR.rollZ*he,gt.joint.rotation.x+=ee.legL.kneeX*he,j.joint.rotation.x+=ee.legR.kneeX*he,x.position.x+=ee.pelvisX*he,x.position.y+=ee.pelvisY*he,x.rotation.z+=ee.pelvisRoll*he}if(Jp(an,q.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(ri)>1e-4&&(x.position.x+=ri),g.enabled){const ee=q.phase!=="idle"&&!q.charging,he=ee?oo(q.attackProgress):0;ee&&R>.55&&he<R-1e-4&&(Te=1),R=he,Te=rw(Te,ge,g.impactDecay);const vn=sw({swing:he,charge:q.charging?q.charge:0,impact:Te,speedRatio:Zr,grounded:L.grounded},g);fe=ow(fe,vn,ge,g.smoothing)}else fe={...jl};Yp(fe),v.rotation.y=xt,ue=Ap(xt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=ue;const Tm=Em;if(mt.rotation.y=Xe(L.headYaw-L.bodyYaw-Tm-ue),mt.rotation.x=-de(L.headPitch??0,-.7,.7),w.rotation.x+=-de(L.bodyPitch??0,-.4,.4),nm(),Zp(yt,q.comboIndex),Kp(q,wm),q.weapon==="greatsword"&&!q.charging&&(q.phase!=="idle"||Pe>0)){y.updateWorldMatrix(!0,!0);const ee=q.phase==="idle"?Math.max(Pe,be):1;$p(de(ee,0,1),ge)}if(O=Np({root:y,pelvis:x,lower:v,limbs:wt,base:vm,cfg:ws,grounded:L.grounded,attacking:an}),im(L,ge),I&&Ms){const ee=ro();Or=Math.max(Math.abs(ee.pitch-Ms.x),Math.abs(ee.yaw-Ms.y),Math.abs(ee.lean-Ms.z))}else Or=0},lean(){return{forward:vt,side:Ft}},landing(){const L=ju(zr,wa,Ea,Ta,so),q=Ea>0?Math.max(0,Ea-Math.max(0,zr-wa)):0;return{pulse:L,remaining:q,kind:L>0?_s:"none",impactVy:zh}},hurt(){return St},ik(){return O},stretch(){return{...fe,impact:Te}},gripDebug(){return{...Y}},weaponDebug(){return{wristPitch:tt,wristTwist:W}},setClipT(L){xe=L===null||!Number.isFinite(L)?null:Math.max(0,Math.min(1,L))},stanceDebug(){const L=Q==null?void 0:Q.armR,q=Q==null?void 0:Q.armL,ut=Q?A:0;return{weapon:Tt??"sword-shield",weight:ut,armL:{pitch:((q==null?void 0:q.pitch)??0)*ut,yaw:((q==null?void 0:q.yaw)??0)*ut,roll:((q==null?void 0:q.roll)??0)*ut,elbow:((q==null?void 0:q.elbow)??0)*ut},armR:{pitch:((L==null?void 0:L.pitch)??0)*ut,yaw:((L==null?void 0:L.yaw)??0)*ut,roll:((L==null?void 0:L.roll)??0)*ut,elbow:((L==null?void 0:L.elbow)??0)*ut},torsoYaw:((Q==null?void 0:Q.torsoYaw)??0)*ut,torsoPitch:((Q==null?void 0:Q.torsoPitch)??0)*ut,bladePitchDeg:Z*180/Math.PI,bladePitchOffDeg:dt*180/Math.PI,armSwing:(Q==null?void 0:Q.armSwing)??1}},swingDebug(){const L=Ht;return{seg:Gt,kind:(L==null?void 0:L.kind)??"right-left",lead:(L==null?void 0:L.lead)??"R",yaw:(L==null?void 0:L.yaw)??0,rootYaw:(L==null?void 0:L.rootYaw)??0,spinYaw:(L==null?void 0:L.spinYaw)??0,rootTurn:xn,pitch:(L==null?void 0:L.pitch)??0,roll:(L==null?void 0:L.roll)??0,strike:(L==null?void 0:L.strike)??0,bladeTwist:(L==null?void 0:L.bladeTwist)??0,bladeTwistOff:(L==null?void 0:L.bladeTwistOff)??0,bladeYaw:(L==null?void 0:L.bladeYaw)??0,bladeYawOff:(L==null?void 0:L.bladeYawOff)??0,shoulderL:{x:Le.lx,y:Le.ly,z:Le.lz},shoulderR:{x:Le.rx,y:Le.ry,z:Le.rz}}},attackBlend(){return be},attackWeights(){return{gaitScale:ln,attackLegWeight:Fn,driveSpeed:Ir.speed,stridePhase:Ir.phase}},hipYaw(){return xt},torsoTotal(){return ro()},spineDebug(){if(!I)return null;const L=ro();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:D.rotation.y,totalYaw:L.yaw,totalPitch:L.pitch,totalLean:L.lean,neckPitch:mt.rotation.x,leak:Or}},balanceDebug(){return Sn?{...Sn,shift:ri,latDeficit:kh,lateralFf:Hh}:null},gaitDebug(){return{stopT:Ut,hipYaw:xt,chestYaw:ue,speed:se,gaitSpeed:ze,stopStep:Be,stopShift:gn,stopDip:Ae,stopYawFade:Dn,turnStep:Kt,legTakeover:je,legLPitch:ys.lp,legLRoll:ys.lr,legRPitch:ys.rp,legRRoll:ys.rr}},gaitYaw(){return Xt},arrowDirection(){Nt.updateWorldMatrix(!0,!1);const L=Nt.matrixWorld.elements,q=L[8],ut=L[9],yt=L[10],Jt=Math.hypot(q,ut,yt)||1;return{x:q/Jt,y:ut/Jt,z:yt/Jt}},weaponBlade(){return Tt?co(Ct[Tt].right):null},bladesWorld(){return Tt?{right:co(Ct[Tt].right),left:co(Ct[Tt].left)}:{right:null,left:null}},dispose(){y.traverse(L=>{if(L instanceof ye){L.geometry.dispose();const q=L.material;Array.isArray(q)?q.forEach(ut=>ut.dispose()):q.dispose()}})}}}function bw(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new nn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new mn(i,3),o=new mn(a,3);s.setUsage(Ud),o.setUsage(Ud),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,E=v+3;r.push(v,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new on({vertexColors:!0,transparent:!0,opacity:1,blending:Xi,depthWrite:!1,side:Ye}),c=new ye(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ie(n.color);let f=[],d=null,u=0,m=0,_=!1,g=!1,p=0;function y(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=f[w],E=Math.max(0,1-S.age/v),T=E*E,M=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*T*(.55+.45*M)*(1+p),P=.18+.82*E,z=w*6;i[z]=S.tx+(S.bx-S.tx)*P,i[z+1]=S.ty+(S.by-S.ty)*P,i[z+2]=S.tz+(S.bz-S.tz)*P,i[z+3]=S.tx,i[z+4]=S.ty,i[z+5]=S.tz;const I=h.r*b,N=h.g*b,D=h.b*b,k=I*.22,V=N*.22,B=D*.22;a[z]=k,a[z+1]=V,a[z+2]=B;const $=1+n.tipBoost;a[z+3]=Math.min(1,I*$),a[z+4]=Math.min(1,N*$),a[z+5]=Math.min(1,D*$)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of f)E.age+=S;for(;f.length>0&&f[0].age>n.life;)f.shift();if(v){const E=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,T=f[f.length-1],M=T?Math.hypot(v.tip.x-T.tx,v.tip.y-T.ty,v.tip.z-T.tz):1/0;if(w&&M>=n.minStep)for(f.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:E});f.length>t;)f.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},u=E,m=M,_=!0}else d=null,_=!1,u=0,m=0;g=w,y()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){f=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function Sw(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function ww(n,t,e,i){var tn;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new z1({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=kf,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new F1;r.background=new ie("#12161d"),r.add(new xS(11061486,2764600,1.15));const l=new _S(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new Ue;for(const X of t.boxes){const kt=X.maxX-X.minX,Et=X.maxY-X.minY,ne=X.maxZ-X.minZ;let Kt=Sw(X.kind,e);X.kind==="step"&&(Kt=new ie(Kt).offsetHSL(0,0,X.maxY*.09).getStyle());const fe=new eo({color:Kt,transparent:!0,opacity:1}),Te=new ye(new oi(kt,Et,ne),fe);Te.position.set((X.minX+X.maxX)/2,(X.minY+X.maxY)/2,(X.minZ+X.maxZ)/2),Te.castShadow=X.kind!=="ground",Te.receiveShadow=!0,Te.add(new hp(new J1(Te.geometry),new Mh({color:10467020,transparent:!0,opacity:.32}))),f.add(Te),h.push(fe)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new bS(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=HS(i,e);r.add(m.group);const _=X=>Mw((X==null?void 0:X.voxel)??e.voxel,X!=null&&X.colors?{...e.colors,...X.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let g="standard",p=_((tn=e.bodyTypes)==null?void 0:tn[g]);const y=bw(e.weaponTrail);r.add(y.object);const x=new Ue,v=.9,w=new Ue;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=t.dummies.map((X,kt)=>{const Et=e.dummies.colors,ne=Et[kt%Et.length]??"#cccccc",Kt=BS(e.voxel,e.colors,ne,X.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return Kt.group.traverse(fe=>{fe.userData.dummyId=X.id}),r.add(Kt.group),Kt}),E=S.map(X=>X.group),T=new MS,M=e.groundRing,b=e.voxel.bodyWidth,P=Ju(b,M.playerRadiusFactor),z=Ju(b,M.dummyRadiusFactor),I=b*M.thicknessFactor,N=M.arcDeg*Math.PI/180;let D=0;const k=Vc({radius:P,thickness:I,arcRad:N,edgeFade:M.edgeFade,color:M.playerColor,opacity:M.playerOpacity,y:.028,renderOrder:6});k.mesh.name="player-ground-ring",r.add(k.mesh);const V=t.dummies.map(X=>{const kt=Vc({radius:z,thickness:I,arcRad:N,edgeFade:M.edgeFade,color:M.neutralColor,opacity:M.opacity,y:.022,renderOrder:5});return kt.mesh.name=`dummy-ground-ring-${X.id}`,r.add(kt.mesh),kt}),B=t.dummies.map(X=>{const kt=Vc({radius:z*M.haloRadiusFactor,thickness:I*M.haloThicknessFactor,arcRad:N,edgeFade:M.edgeFade,color:M.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return kt.mesh.name=`dummy-ground-halo-${X.id}`,r.add(kt.mesh),kt}),$=t.dummies.map(()=>0),at=t.dummies.map(()=>0),mt=Qu({radius:P*M.meterRadiusFactor,thickness:I*M.meterThicknessFactor,arcRad:N,edgeFade:.06,color:M.meterColorCharge,y:.03,renderOrder:8});mt.mesh.name="player-ground-meter",r.add(mt.mesh);const ft=t.dummies.map(X=>{const kt=Qu({radius:z*M.warnRadiusFactor,thickness:I*M.warnThicknessFactor,arcRad:N,edgeFade:.02,color:M.warnColor,y:.031,renderOrder:9});return kt.mesh.name=`dummy-ground-warn-${X.id}`,r.add(kt.mesh),kt}),pt=tf({color:M.playerColor,y:.042,renderOrder:3});pt.group.name="player-landing-preview",r.add(pt.group);const et=new ie,K=new ie(M.playerColor),gt=new ie(M.neutralColor),j=new ie(M.lowThreatColor),H=new ie(M.highThreatColor),ot=new ie(M.meterColorCharge),wt=new ie(M.meterColorChannel),Ot=new ie(M.meterColorCooldown),Mt=new ie(M.warnColor),Lt=new Ue;r.add(Lt);const F=e.projectiles;function le(){const kt=document.createElement("canvas");kt.width=64,kt.height=64;const Et=kt.getContext("2d");if(Et){const Kt=Et.createRadialGradient(32,32,0,32,32,32);Kt.addColorStop(0,"rgba(255,255,255,1)"),Kt.addColorStop(.28,"rgba(255,255,255,0.72)"),Kt.addColorStop(.62,"rgba(255,255,255,0.22)"),Kt.addColorStop(1,"rgba(255,255,255,0)"),Et.fillStyle=Kt,Et.fillRect(0,0,64,64)}const ne=new Yl(kt);return ne.colorSpace=Pn,ne}function Wt(){const Et=document.createElement("canvas");Et.width=2,Et.height=64;const ne=Et.getContext("2d");if(ne){const fe=ne.createLinearGradient(0,0,0,64);fe.addColorStop(0,"rgba(255,255,255,0)"),fe.addColorStop(.55,"rgba(255,255,255,0.35)"),fe.addColorStop(1,"rgba(255,255,255,0.95)"),ne.fillStyle=fe,ne.fillRect(0,0,2,64)}const Kt=new Yl(Et);return Kt.colorSpace=Pn,Kt}const Nt=le(),Ct=Wt(),Dt=new on({color:12577023,transparent:!0,opacity:0,side:Ye,depthWrite:!1}),Tt=new on({color:14217983,transparent:!0,opacity:0,side:Ye,depthWrite:!1,blending:Xi}),C=new Ue;C.position.set(0,.95,.72),Lt.add(C);const A=new Ue;A.rotation.x=JS(e.camera.pitchDeg),C.add(A);const Z=new Dr(.78,F.slashThickness,6,28,Math.PI*1.15),dt=new Ue,Q=new ye(Z,Dt),rt=new ye(Z,Tt);rt.scale.setScalar(1.09),rt.renderOrder=4,dt.add(Q,rt),A.add(dt);const zt=new oi(F.arrowWidth,F.arrowWidth,F.arrowLength),nt=new Eh(F.arrowHeadSize*.42,F.arrowHeadSize,4);nt.rotateX(Math.PI/2);const vt=new oi(F.arrowWidth*2.6,F.arrowWidth*.4,.1),Ft=new js(F.arrowWidth*.45,F.arrowWidth*1.3,F.trailLength,6,1,!0);Ft.rotateX(-Math.PI/2),Ft.translate(0,0,-F.trailLength/2);const st=Array.from({length:10},()=>{const X=new Ue,kt=new on({color:F.arrowColor,transparent:!0}),Et=new on({color:F.arrowHeadColor,transparent:!0}),ne=new Wl({map:Nt,color:F.arrowColor,transparent:!0,opacity:.85,blending:Xi,depthWrite:!1}),Kt=new on({color:F.arrowTrailColor,map:Ct,transparent:!0,opacity:0,blending:Xi,depthWrite:!1,side:Ye}),fe=new ye(zt,kt),Te=new ye(nt,Et);Te.position.z=F.arrowLength/2+F.arrowHeadSize*.42;const R=new ye(vt,Et),Y=new ye(vt,Et);R.position.z=-F.arrowLength/2+.08,Y.position.z=R.position.z,Y.rotation.z=Math.PI/2;const J=new Iu(ne);J.scale.setScalar(F.arrowGlowSize),J.renderOrder=6;const tt=new ye(Ft,Kt);return tt.renderOrder=5,X.add(fe,Te,R,Y,J,tt),X.visible=!1,r.add(X),{group:X,shaftMat:kt,tipMat:Et,glowMat:ne,trailMat:Kt,glow:J,trail:tt,arrowId:0,bone:null}}),St=new Ah(1,0),O=new G(F.boltShapeX,F.boltShapeY,F.boltShapeZ),lt=new on({color:F.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),xt=new Wl({map:Nt,color:F.boltGlowColor,transparent:!0,opacity:.45,blending:Xi,depthWrite:!1}),Xt=new on({color:F.boltGlowColor,map:Ct,transparent:!0,opacity:F.trailOpacity,blending:Xi,depthWrite:!1,side:Ye}),Ut=new js(.5,.03,F.boltTrailScale,6,1,!0);Ut.rotateX(-Math.PI/2),Ut.translate(0,0,-F.boltTrailScale/2);const Zt=Array.from({length:24},()=>{const X=new Ue,kt=new ye(St,lt);kt.scale.copy(O);const Et=new Iu(xt);Et.scale.setScalar(F.boltGlowScale),Et.renderOrder=6;const ne=new ye(Ut,Xt);return ne.renderOrder=5,X.add(kt,Et,ne),X.visible=!1,r.add(X),{group:X,core:kt}}),U=Array.from({length:6},()=>{const X=tf({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return X.group.visible=!1,r.add(X.group),X}),bt=e.dash,it=new to(bt.ringRadius-.06,bt.ringRadius,28),ht=Array.from({length:6},()=>{const X=new on({color:16777215,transparent:!0,opacity:0,side:Ye,depthWrite:!1}),kt=new ye(it,X);return kt.rotation.x=-Math.PI/2,kt.visible=!1,r.add(kt),{mesh:kt,mat:X,life:0,base:1}});function Rt(X,kt,Et,ne,Kt){const fe=ht.find(Te=>Te.life<=0)??ht[0];fe.mat.color.set(ne),fe.mesh.position.set(X,Et+.04,kt),fe.base=Kt,fe.mesh.scale.setScalar(Kt*.6),fe.mesh.visible=!0,fe.mat.opacity=.9,fe.life=bt.fxDuration}const At=e.links,Qt=new to(At.ringRadius-.07,At.ringRadius,28),se=Array.from({length:5},()=>{const X=new on({color:At.chargeColor,transparent:!0,opacity:0,side:Ye,depthWrite:!1}),kt=new ye(Qt,X);return kt.rotation.x=-Math.PI/2,kt.visible=!1,r.add(kt),{mesh:kt,mat:X,life:0,base:1}});function ue(X,kt,Et,ne){const Kt=se.find(fe=>fe.life<=0)??se[0];Kt.mesh.position.set(X,Et+.05,kt),Kt.base=ne,Kt.mesh.scale.setScalar(ne*.55),Kt.mesh.visible=!0,Kt.mat.opacity=.85,Kt.life=At.fxDuration}let oe=t.playerLink.id,Ee=t.playerLink.hitIds.length,Be=t.dash.id,gn="none";const Ae=wS(e.camera,e.smartCamera,e.zoom,a/s),ze=t.character.position;Ae.update(ze.x,ze.y,ze.z,1,t.camera);function Re(X,kt){if(E.length===0)return 0;const Et=o.domElement.getBoundingClientRect(),ne=new $t((X-Et.left)/Et.width*2-1,-((kt-Et.top)/Et.height)*2+1);T.setFromCamera(ne,Ae.camera);const Kt=T.intersectObjects(E,!0);for(const fe of Kt){const Te=fe.object.userData.dummyId;if(Te&&Te>0)return Te}return 0}function qe(X,kt,Et){const ne=o.domElement.getBoundingClientRect(),Kt=new G(X,kt,Et).project(Ae.camera);return{x:ne.left+(Kt.x*.5+.5)*ne.width,y:ne.top+(-Kt.y*.5+.5)*ne.height}}let Dn=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const X=p.stretch();return{arm:X.arm,leg:X.leg,torso:X.torso,impact:X.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(X,kt,Et){return qe(X,kt,Et)},setClipT(X){p.setClipT(X)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(X,kt){const Et=X.character,ne=X.combat,Kt=e.hitstop.enabled&&X.combat.hitstop>0,fe=Kt;if(Kt&&!Dn){const _t=Math.max(0,X.combat.hitstop),ct=Math.max(0,Math.min(1,_t/.1));Ae.addShake(.34+ct*.48);let te=null;for(let ae=0;ae<X.events.length;ae++){const ve=X.events[ae];if(ve.type==="hit"){te=ve;break}}te&&Ae.addKick(te.x-Et.position.x,te.z-Et.position.z,.03+ct*.05)}Dn=Kt;for(let _t=0;_t<X.events.length;_t++){const ct=X.events[_t];if(ct.type!=="notify")continue;const te=Number.isFinite(ct.value)?ct.value:0;if(ct.name==="blade-air"){const ae=Math.max(0,Math.min(1,te));y.pulse((ne.weapon==="greatsword"?.9:.55)*(.4+.6*ae))}}x.position.set(Et.position.x,Et.position.y,Et.position.z),x.rotation.y=Et.bodyYaw;const Te=X.dash.phase==="active"&&X.dash.kind==="roll",R=Te&&X.dash.duration>0?Math.min(1,1-X.dash.timer/X.dash.duration):0;if(w.rotation.x=Te?R*Math.PI*2:0,w.position.y=v-(Te?.2*Math.sin(Math.PI*R):0),fe||p.update(Et,ne,X.playerHurt,kt,X.abilities.channeling,X.time,X.playerLink,X.turnInPlace),y.update(fe?0:kt,fe?null:p.weaponBlade(),!fe&&(ne.phase==="active"||X.playerLink.phase==="active"||Te&&X.dash.duration>0)),!fe)for(let _t=0;_t<S.length;_t++)X.dummies[_t]&&S[_t].update(X.dummies[_t],kt);const Y=Ae.camera.position,J=Math.atan2(Y.x-Et.position.x,Y.z-Et.position.z),tt=X.config.gaze.hurtHoldSec,W=X.time-X.playerHurt.lastAt,Pt=tt>0&&W>=0&&W<tt?1-W/tt:0,It=XS(X.gaze.active,X.gaze.threat,Pt,X.time,M);WS(et,K,j,H,It.level),D=KS(Et.grounded,Et.position.y,D),k.mesh.position.set(Et.position.x,D+.028,Et.position.z),k.update(It.arcRad,It.opacity,It.scale,et,J);const Yt=X.config.abilities.arcane,qt=Math.max(1,Math.floor(Yt.waves)),Ht=Math.max(1e-4,Yt.waveInterval),Vt=ZS({charging:ne.charging,charge:ne.charge,channeling:X.abilities.channeling,fireTimer:X.abilities.fireTimer,fireInterval:Ht,channelProgress:X.abilities.channeling?(X.abilities.waveIndex+(1-Math.min(1,Math.max(0,X.abilities.fireTimer/Ht))))/qt:0,arcaneCooldown:X.abilities.cooldown,arcaneCooldownMax:Yt.cooldown,dashCooldown:X.dash.cooldown,dashCooldownMax:X.dash.kind==="blink"?X.config.dash.blinkCooldown:X.config.dash.rollCooldown});mt.mesh.position.set(Et.position.x,Et.position.y+.03,Et.position.z),mt.set(Vt.ratio,Vt.source==="none"?0:M.meterOpacity,Vt.source==="charge"?ot:Vt.source==="channel"?wt:Ot,J);const Gt=X.playerLink,re=Gt.weapon?X.config.links.moves[Gt.weapon]:void 0,_e=qS(Gt.phase,Et.position.x,Et.position.z,Gt.facing,Gt.travel,(re==null?void 0:re.hit.radius)??.9);pt.set(_e.x,_e.z,.042,_e.radius,_e.active?M.landingOpacity:0,X.time);for(let _t=0;_t<V.length;_t++){const ct=X.dummies[_t],te=V[_t],ae=B[_t],ve=ft[_t];if(!ct){te.mesh.visible=!1,ae.mesh.visible=!1,ve.mesh.visible=!1;continue}const bn=X.targeting.hasTarget&&X.targeting.targetId===ct.id;if(j0(X,ct)){const Sn=K0(X,ct);et.copy(j).lerp(H,Sn)}else et.copy(gt);const He=$S(ct.attackPhase,ct.attackPhaseTimer,X.config.dummies.attackWindup);He.active?(et.lerp(Mt,.5*He.urgency),ve.mesh.position.set(ct.position.x,ct.position.y+.031,ct.position.z),ve.set(He.ratio,M.warnOpacity*(.65+.35*He.urgency),Mt,J)):ve.set(0,0,Mt,J);const xn=bn?1:0,be=xn>$[_t]?M.haloFadeInSec:M.haloFadeOutSec;$[_t]=ef($[_t],xn,kt,be);const Pe=$[_t],Fn=1+.02*Pe*Math.sin(X.time*2.2+ct.id),ln=M.arcDeg+(M.selectedArcDeg-M.arcDeg)*Pe;te.mesh.position.set(ct.position.x,ct.position.y+.022,ct.position.z),te.update(ln*Math.PI/180,M.opacity+(M.selectedOpacity-M.opacity)*Pe,1+(M.selectedScale-1)*Pe*Fn,et,J,1+(M.selectedThicknessScale-1)*Pe),at[_t]=ef(at[_t],xn,kt,xn>at[_t]?M.haloFadeInSec:M.haloFadeOutSec);const je=at[_t];ae.mesh.position.set(ct.position.x,ct.position.y+.019,ct.position.z),ae.update(ln*Math.PI/180,M.haloOpacity*je*(.88+.12*Math.sin(X.time*2.2+ct.id)),M.selectedScale*(.94+.06*je)*Fn,et,J)}if(Lt.position.set(Et.position.x,Et.position.y,Et.position.z),Lt.rotation.y=ne.phase!=="idle"?ne.attackFacing:Et.bodyYaw,X.dash.id!==Be){Be=X.dash.id;const _t=X.dash;gn=_t.kind,_t.kind==="blink"?(Rt(_t.fromX,_t.fromZ,Et.position.y,bt.blinkColor,.9),Rt(_t.toX,_t.toZ,Et.position.y,bt.blinkColor,1.35)):Rt(_t.fromX,_t.fromZ,Et.position.y,bt.rollColor,1.1)}for(const _t of ht){if(_t.life<=0)continue;_t.life-=kt;const ct=Math.max(0,_t.life/bt.fxDuration);_t.mat.opacity=.9*ct,_t.mesh.scale.setScalar(_t.base*(.6+(1-ct)*1.2)),_t.life<=0&&(_t.mesh.visible=!1)}const xe=X.playerLink;xe.id!==oe&&(oe=xe.id,Ee=xe.hitIds.length,ue(Et.position.x,Et.position.z,Et.position.y,1)),xe.hitIds.length>Ee?(Ee=xe.hitIds.length,ue(Et.position.x,Et.position.z,Et.position.y,1.35)):xe.hitIds.length<Ee&&(Ee=xe.hitIds.length);for(const _t of se){if(_t.life<=0)continue;_t.life-=kt;const ct=Math.max(0,_t.life/Math.max(At.fxDuration,1e-6));_t.mat.opacity=.85*ct,_t.mesh.scale.setScalar(_t.base*(.55+(1-ct)*1.1)),_t.life<=0&&(_t.mesh.visible=!1)}const Le=F.slashEnabled&&ne.phase==="active"&&ne.comboIndex>=3;Dt.opacity=Le?.7:0,Tt.opacity=Le?F.slashGlowOpacity:0,Le&&(dt.rotation.z=-1.2+ne.attackProgress*3.2,dt.scale.setScalar(.9+ne.comboIndex*.13));for(let _t=0;_t<Zt.length;_t++){const ct=X.abilities.projectiles[_t],te=Zt[_t];te.group.visible=!!ct,ct&&(te.group.position.set(ct.x,ct.y,ct.z),te.group.scale.setScalar(ct.radius),te.group.rotation.set(0,Math.atan2(ct.dirX,ct.dirZ),0))}for(let _t=0;_t<U.length;_t++){const ct=X.abilities.rings[_t],te=U[_t];if(!ct){te.group.visible=!1;continue}const ae=Math.max(0,Math.min(1,ct.life/Math.max(ct.duration,1e-6))),ve=jS(Math.max(0,ct.duration-ct.life),M.areaExpandSec);te.set(ct.x,ct.z,.045,ct.radius*ve.scale,M.areaOpacity*(.35+.65*ae)*ve.alpha,X.time)}for(let _t=0;_t<st.length;_t++){const ct=X.arrows[_t],te=st[_t];if(!ct){te.group.visible=!1,te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=0;continue}const ae=ct.stuck&&ct.stuckDummy>=0;if(te.arrowId!==ct.id){if(te.bone&&(r.attach(te.group),te.bone=null),te.arrowId=ct.id,te.group.position.set(ct.x,ct.y,ct.z),te.group.rotation.set(ct.pitch,ct.yaw,0,"YXZ"),ae){const bn=S[ct.stuckDummy],He=bn?bn.boneAtWorld(ct.x,ct.y,ct.z):null;He&&(He.node.attach(te.group),te.bone=He.node)}}else te.bone||(te.group.position.set(ct.x,ct.y,ct.z),te.group.rotation.set(ct.pitch,ct.yaw,0,"YXZ"));te.group.visible=!0;const ve=ct.stuck?Math.min(1,ct.rest/.6):1;te.shaftMat.opacity=ve,te.tipMat.opacity=ve,te.glowMat.opacity=(ct.stuck?.28:.85)*ve,te.trailMat.opacity=ct.stuck?0:F.trailOpacity*ve,te.trail.visible=!ct.stuck}Ae.update(Et.position.x,Et.position.y,Et.position.z,kt,X.camera),o.render(r,Ae.camera)},resize(){const X=Math.max(1,n.clientWidth),kt=Math.max(1,n.clientHeight);o.setSize(X,kt,!1),Ae.resize(X/kt)},getGroundBasis(){return Ae.getGroundBasis()},setCollidersVisible(X){for(const kt of h)kt.opacity=X?.3:1,kt.wireframe=X,kt.needsUpdate=!0},setGridVisible(X){u.visible=X},setLabVisible(X){m.setVisible(X)},setLabLabelsVisible(X){m.setLabelsVisible(X)},snapCamera(X,kt,Et){Ae.snap(X,kt,Et)},setZoom(X){Ae.setZoom(X)},setBodyType(X){var Et;const kt=(Et=e.bodyTypes)==null?void 0:Et[X];return!kt||X===g||(w.remove(p.group),p.dispose(),p=_(kt),p.group.position.y=-v,w.add(p.group),y.reset(),g=X,t.config.characterHeight=kt.height,kt.radius!==void 0&&(t.config.characterRadius=kt.radius)),g},bodyTypes(){return{id:g,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Re,projectToScreen:qe,diagnostics(){const X=Hp(e.camera.pitchDeg),kt=QS(X,Lt.rotation.y);return{lean:p.lean(),slashNormal:kt,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:ht.filter(Et=>Et.life>0).length,lastKind:gn},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...Ae.smart(),shake:Ae.shakeLevel(),kick:Ae.kickLevel(),kickCount:Ae.kickCount()}}},dispose(){p.dispose(),m.dispose();for(const X of S)X.dispose();k.dispose();for(const X of V)X.dispose();for(const X of B)X.dispose();mt.dispose(),y.dispose();for(const X of ft)X.dispose();pt.dispose(),Z.dispose(),Dt.dispose(),Tt.dispose(),St.dispose(),lt.dispose(),xt.dispose(),Xt.dispose(),Ut.dispose();for(const X of U)X.dispose();zt.dispose(),nt.dispose(),vt.dispose(),Ft.dispose();for(const X of st)X.shaftMat.dispose(),X.tipMat.dispose(),X.glowMat.dispose(),X.trailMat.dispose();Nt.dispose(),Ct.dispose();for(const X of ht)X.mat.dispose();it.dispose();for(const X of se)X.mat.dispose();Qt.dispose(),f.traverse(X=>{X instanceof ye&&X.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Ew(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Tw(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Aw(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function g(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const y=n.summary();Ew(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Tw(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>g(!1)}}const Rw={intents:{...of},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Pw(){var j;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Q0(Bg,mo),i=ww(n,e,dn,mo.stations),a=sg(e),s=yx(t),o=_x(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.54 · 11-08 14:41 · 诊断");const l=H=>String(H).padStart(2,"0"),c=new Date,h=zg({meta:{version:"v0.9.54",buildTime:"11-08 14:41",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Aw(h,r),d=gx({deadZone:()=>dn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:dn.showColliders,showGrid:dn.showGrid,showLab:dn.lab.enabled,showLabLabels:dn.lab.showLabels};let m=1,_=!1;const g=wg({maxRadiusPx:()=>dn.joystick.maxRadiusPx,deadZone:dn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>dn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(H){if(H===y)return;y=H;const ot=ya.indexOf(H)+1;for(const wt of p)wt.classList.toggle("is-active",Number(wt.dataset.weapon)===ot);E.refreshWeapon()}let v=Rw,w=0;const S=()=>{m=1,i.setZoom(1)},E=Qg(e,dn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...of,resetPressed:!0})},resetZoom:S,onToggleColliders:H=>i.setCollidersVisible(H),onToggleGrid:H=>i.setGridVisible(H),onToggleLab:H=>i.setLabVisible(H),onToggleLabLabels:H=>i.setLabLabelsVisible(H)}),T=nx({stations:mo.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const M=i.bodyTypes().ids,b=document.getElementById("body-toggle"),P=H=>{var ot,wt;return((wt=(ot=dn.bodyTypes)==null?void 0:ot[H])==null?void 0:wt.name)??H},z=()=>{if(!b)return;const H=i.bodyTypes().id;b.textContent=`体型 ${P(H)}`,b.setAttribute("aria-label",`切换体型（当前：${P(H)}，快捷键 B）`)},I=document.createElement("div");I.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(I);let N=0;const D=H=>{I.textContent=H,I.style.opacity="1",window.clearTimeout(N),N=window.setTimeout(()=>{I.style.opacity="0"},1600)},k=()=>{if(M.length<2){D("只有一个体型预设");return}const H=i.bodyTypes().id,ot=Math.max(0,M.indexOf(H)),wt=i.setBodyType(M[(ot+1)%M.length]);z(),D(`体型：${P(wt)}（B / 顶部胶囊切换）`)};z(),b==null||b.addEventListener("click",k),window.addEventListener("keydown",H=>{H.repeat||H.code!=="KeyB"||k()}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:dn,debug:u,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:pt,applied:et,enabled:at}),renderPose:()=>i.renderPose(),setRenderInterp:H=>(at=!!H,at),trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(H,ot,wt)=>i.projectPoint(H,ot,wt),setBodyType:H=>{const ot=i.setBodyType(H);return z(),ot},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var H;return Object.keys(((H=dn.animation.swing)==null?void 0:H.clips)??{})},preview:H=>{const ot=e.combat,wt={...ot};ot.weapon=H.weapon,ot.phase="active",ot.comboIndex=Math.max(1,Math.min(3,Math.floor(H.comboIndex))),ot.attackProgress=Math.max(0,Math.min(1,H.progress)),ot.attackFacing=e.character.bodyYaw,i.setClipT(typeof H.t=="number"?H.t:null);const Ot=Math.max(1,Math.min(30,Math.floor(H.warm??12)));_=!0;for(let Mt=0;Mt<Ot;Mt++)i.render(e,1/60);return i.setClipT(null),Object.assign(ot,wt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:H=>{e.character.bodyYaw=H},zoom:H=>{m=Md(H,1,dn.zoom.min,dn.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:mo.stations??[],goto:H=>T.goto(H),current:()=>T.current(),recall:()=>T.recall()}};let V=performance.now(),B=60,$=0,at=((j=dn.renderInterp)==null?void 0:j.enabled)??!0,mt=_d(e),ft=null,pt=1,et=!1;function K(H){const ot=at&&!u.paused&&u.timeScale>0;if(et=!1,!ot||!ft||!rg(ft,mt))return pt=1,e;const wt=a.alpha;return pt=wt,wt>=.999?e:(et=!0,lg(e,cg(ft,mt,wt)))}function gt(H){const ot=Math.min((H-V)/1e3,.1);V=H,ot>0&&(B=B*.9+1/ot*.1);const wt=g.sample();wt.intents.resetPressed&&(m=1),m=Md(m,wt.zoomScale,dn.zoom.min,dn.zoom.max),i.setZoom(m);let Ot=wt.intents.dummyClickId;if(wt.tap){const F=i.pickDummy(wt.tap.x,wt.tap.y);F>0&&(Ot=F)}Ot>0&&(w=Ot),v={...wt,intents:{...wt.intents,dummyClickId:w}};const Mt=a.frame(ot,v.intents,u.timeScale,u.paused,()=>{const F=e.events;for(let le=0;le<F.length;le++)h.event(F[le],e.time);ft=mt,mt=_d(e)});Mt>0&&(w=0),h.sample(e,v,ot*1e3,Mt);for(const F of v.gestures)h.gesture(F);H-$>250&&($=H,f.tick()),x(e.combat.weapon),_||i.render(K(),ot),T.tick(),d.update(e,v,i.getGroundBasis());const Lt=i.diagnostics();s.update(e,B,Mt,v,u,{attackBlend:Lt.attackBlend,attackWeights:Lt.attackWeights,landing:Lt.landing,hurt:Lt.hurt,ik:Lt.ik,zoom:Lt.camera.zoom},o.hudCompact()),requestAnimationFrame(gt)}requestAnimationFrame(gt)}Pw();

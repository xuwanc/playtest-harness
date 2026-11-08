(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ya=["sword-shield","dual-swords","greatsword","staff","bow"],Jr=["wander","follow","keep-distance","attack","idle"],cf={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},hr=1e-6;function $s(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>hr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>hr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Pm(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>hr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>hr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ln=1e-6,Bs=Math.PI/180,Jl=-1e9;function lf(){return{type:"none",lastAt:Jl,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Qo(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function nd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function Ql(n,t,e){var l;const i=e.duration>0?e.duration:th(n,e.type);if(t.kind==="player"){const c=n.playerHurt;if(nd(c,e.type,i,e.dirX,e.dirZ),c.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ln){const h=e.knockback*n.config.hits.knockbackDecay;c.knockX=e.dirX*h,c.knockZ=e.dirZ*h}Qo(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(nd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ln){const c=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*c,a.hurt.knockZ=e.dirZ*c}n.hitCount+=1,Qo(n,"hit",a.id,a.position);const s=n.config.hits.hitstop,o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1,r=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;r>0&&n.combat.hitstop<r&&(n.combat.hitstop=r,Qo(n,"hitstop",r,a.position))}function Er(n,t,e){Ql(n,{kind:"dummy",index:t},e)}function Cm(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function th(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function id(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Lm(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Dm(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>Ln?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-Ln||c>r+Ln)return;const h=e.reach[t.weapon]??0,f=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Bs),d=Math.sin(t.attackFacing),u=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),y=(g==null?void 0:g.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const T=id(p.pts,0),b=id(p.pts,c);x=Math.min(T,b)-y,v=Math.max(T,b)+y,w=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,M=T.position.z-i.z,R=Math.hypot(b,M);if(R>h+m)continue;const z=R>Ln?b/R:d,I=R>Ln?M/R:u;if(R>Ln&&(b*d+M*u)/R<f)continue;if(w){const N=Lm(Math.atan2(b,M)/Bs-t.attackFacing/Bs);if(N<x||N>v)continue}let U="light";t.weapon==="greatsword"?U="knock":t.comboIndex>=3&&(U="heavy");const C=e.knockback[t.weapon]??0;let k=R;C>0&&(k=Math.max(R+C,_));const G=Math.max(0,k-R);Er(n,n.dummies.indexOf(T),{type:U,duration:th(n,U),dirX:z,dirZ:I,knockback:G}),t.hitIds.push(T.id)}}function km(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,f=c-r,d=h-l,u=f*f+d*d,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(ad(s.arcDeg,0,180)*Bs),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=u>Ln?ad(((x.position.x-r)*f+(x.position.z-l)*d)/u,0,1):0,w=r+f*v,S=l+d*v,E=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=E<=s.radius+p;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+p;else{const U=x.position.x-c,C=x.position.z-h,k=Math.hypot(U,C),G=k>Ln?(U*m+C*_)/k>=g:!0;T=k<=s.radius+p&&G||E<=s.width+p}if(!T)continue;const b=x.position.x-r,M=x.position.z-l,R=Math.hypot(b,M);if(R>Ln&&(b*m+M*_)/R<Math.cos(Math.max(s.arcDeg,90)*Bs))continue;const z=R>Ln?b/R:m,I=R>Ln?M/R:_;Ql(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:z,dirZ:I,knockback:s.knockback}),i.hitIds.push(x.id),Qo(n,"link-hit",x.id,x.position)}}function Im(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>Ln?s/r:0,c=r>Ln?o/r:1;Ql(n,{kind:"player"},{type:"light",duration:th(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function zm(n,t){n.modules.hits&&(n.combat.phase==="active"&&Dm(n),km(n,t),Im(n))}function ad(n,t,e){return n<t?t:n>e?e:n}const hf=Math.PI/180,eh=1e-6;function Fm(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function dr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function df(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>eh?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function uf(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,eh)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Um(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Nm(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!uf(n,t,e))return!1;const i=df(n,t,e.lookRange);if(i===null)return!1;const a=Xe(i-n.character.bodyYaw);return Math.abs(a)>ff(n,e)}function ff(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*hf}function Om(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!uf(n,e,a)){dr(n);return}const s=df(n,e,a.lookRange);if(s===null){dr(n);return}const o=n.character,r=Xe(s-o.bodyYaw),l=Math.abs(r),c=ff(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>eh;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const f=Math.min(l,Math.max(0,a.settleDeg)*hf);i.targetYaw=Xe(o.bodyYaw+i.dir*(l-f)),i.progress=0}if(i.phase==="active"){const f=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/f);const d=Xe(i.targetYaw-i.fromYaw);o.bodyYaw=Xe(i.fromYaw+d*Um(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Zi=1e-6;function Xe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function mo(n,t,e,i){const a=Xe(t-n);return n+a*(1-Math.exp(-Math.max(e,Zi)*i))}function go(n,t,e,i,a){const o=Xe(t-n)*(1-Math.exp(-Math.max(e,Zi)*a)),r=Math.max(i,0)*a;return r<=Zi?n:n+Qa(o,-r,r)}function sd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Zi)*a)),o=Math.max(i,0)*a;return o<=Zi?n+s:n+Qa(s,-o,o)}function Qa(n,t,e){return n<t?t:n>e?e:n}function od(n,t,e,i){const a=Xe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Xe(n+Math.sign(a)*Math.max(e,0))}function Bm(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),f=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Zi,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=$s(n,e);else if(c)i.facing=go(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(f)i.facing=$s(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,Zi)){const M=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,z=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=od(i.facing,M,R,z);else if(h>=a.facingMinMagnitude&&Math.abs(Xe(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const U=mo(i.facing,M,a.facingSmoothRate,t);i.facing=od(i.facing,U,R,0)}}const u=i.velocity;Math.hypot(u.x,u.z)>.15&&(i.moveYaw=Math.atan2(u.x,u.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Nm(n,e)||(c?i.bodyYaw=go(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=mo(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:f?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Xe(p-i.bodyYaw))>M&&(p=i.moveYaw)}const y=o||f||g,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?go(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):mo(i.headYaw,p,M,t)}else{const M=Xe(i.headYaw-i.bodyYaw),R=Xe(p-i.bodyYaw),z=Math.abs(R)<Math.abs(M)-1e-9,I=z?n.config.gaze.headReturnRate:a.headTurnRate,U=z?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(U)?go(M,R,I,U,t):mo(M,R,I,t);v=i.bodyYaw+C}const w=Xe(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const R=i.position.y+n.config.characterHeight*Qa(S.eyeHeightRatio,0,1),z=M.position.y+n.config.dummies.height*Qa(S.aimHeightRatio,0,1),I=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(z-R,Math.max(Zi,I))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=Qa(E,-T,T);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=sd(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=sd(i.bodyPitch,i.headPitch*Qa(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const pf=1e-6,Tr=Math.PI/180;function Ar(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hm(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*Tr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);f<.001||f>s||Math.abs(Xe(Math.atan2(c,h)-t))>a||o.push({i:r,d:f})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Gm(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Vm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*Tr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Hm(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,f=e.channelYaw+h,d=(c-(a-1)*.5)*o,u=Math.sin(f),m=Math.cos(f);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+u*.5+Math.cos(f)*d,y:i.y+1,z:i.z+m*.5-Math.sin(f)*d,yaw:f,speed:t.speed*(1+(Gm(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Ar(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Xm(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Tr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Ar(n,"projectile-fire",i.volleyId,o)}i.pending=a}function rd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Ar(n,"channel-end",0,n.character.position))}function Wm(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){rd(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Ar(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=$s(n,e),o.fireTimer-=t;let f=0;for(;o.fireTimer<=0&&f++<8;)if(o.fireTimer+=Math.max(i.waveInterval,pf),Vm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){rd(n,i);break}}function Ym(n,t,e){const i=Math.max(0,e.homingConeDeg)*Tr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+pf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,f=c.position.z-t.z,d=Math.hypot(h,f);d<.001||d>r||Math.abs(Xe(Math.atan2(h,f)-s))>i||(o=l,r=d)}return o}function $m(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=Ym(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),f=Math.atan2(r.dirX,r.dirZ),d=Xe(h-f),u=r.turnRate*t,m=Math.max(-u,Math.min(u,d)),_=f+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(!(f*f+d*d>u*u)){Er(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const Zm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Wm(n,t,e,s,a,i.cfg.slot),Xm(n,t,s),$m(n,t,s)}},Qr=1e-6;function mf(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qm(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),mf(n,"ring-place",i.id,e)}function jm(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Qr),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],f=h.position.x-r.x,d=h.position.z-r.z,u=r.radius+a;if(f*f+d*d>u*u)continue;const m=Math.hypot(f,d),_=m>Qr?f/m:0,g=m>Qr?d/m:1;Er(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}mf(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Km={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&qm(n,s),jm(n,t,s)}},Jm={channelVolley:Zm,groundRing:Km};function Qm(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function t0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Jm[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function e0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function gf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function n0(n,t,e){t0(n,t,e)}function tc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const cd=1e-6;function ld(n,t,e){return n<t?t:n>e?e:n}function xf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function vf(n){const t=n.camera,e=xf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function i0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,f=c.position.z-i.z,d=Math.hypot(h,f);if(d>e.radius)continue;const u=ld((e.radius-d)/Math.max(cd,e.radius-e.nearDistance),0,1);let m=u*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*u),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:ld(a/(a+Math.max(cd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let f=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const u=Math.hypot(f,d);u>e.maxOffset&&(f=f/u*e.maxOffset,d=d/u*e.maxOffset),t.offsetX=f,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function a0(n){const t=[],e=n.ground.size;t.push(ka("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(ka(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(ka(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ka(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(ka(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(ka(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function ka(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Ci=1e-6;function ur(n,t,e){return n<t?t:n>e?e:n}function Zs(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Ci||c.maxY<i-o-Ci||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function nh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Ci||l.minY>=o-Ci)continue;const c=ur(t.x,l.minX,l.maxX),h=ur(t.z,l.minZ,l.maxZ),f=t.x-c,d=t.z-h,u=f*f+d*d;if(!(u>=e*e))if(s=!0,u>Ci*Ci){const m=Math.sqrt(u),_=(e-m)/m;t.x+=f*_,t.z+=d*_}else{const m=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(m,_,g,p);y===m?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function ih(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ci||o.minY>=s-Ci)continue;const r=ur(t.x,o.minX,o.maxX),l=ur(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-Ci)return!0}return!1}const Yi=1e-6,ls=Math.PI/180;function ah(n){return Math.atan2(Math.sin(n),Math.cos(n))}function $c(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function yf(n){n.arrows.length=0}function s0(n,t,e,i,a,s,o,r,l,c,h){const f=i-n,d=s-e,u=f*f+d*d;let m=0;u>Yi&&(m=((o-n)*f+(r-e)*d)/u,m=Math.max(0,Math.min(1,m)));const _=n+f*m,g=e+d*m,p=_-o,y=g-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function o0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Yi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*ls,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Yi;for(const h of n.dummies){if(!n.modules.dummies)break;const f=h.position.x-a.x,d=h.position.z-a.z,u=Math.hypot(f,d);if(!(u<.001||u>i)){if(h.id===r)return h.id;Math.abs(ah(Math.atan2(f,d)-t))>s||u<c&&(l=h.id,c=u)}}return l}function r0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ls;return t+is(ah(s-t),-o,o)}function c0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*ls),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*ls),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Yi,s),f=l.position.y+n.config.dummies.height*is(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),u=(f-e+.5*d*h*h)/h,m=is(u,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function l0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=o0(n,e),l=r0(n,e,r),c=Math.sin(l),h=Math.cos(l),f=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,u=o.y+.95,m=c0(n,f,u,d,r,s),_={id:++n.arrowSeq,x:f,y:u,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ls};return n.arrows.push(_),$c(n,"arrow-shot",a,_),_}function is(n,t,e){return n<t?t:n>e?e:n}function h0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,f=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>Yi){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),E=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=E+is(ah(S-E),-T,T);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const R=M/w,I=(v.position.y+s*is(i.aimHeightRatio,0,1)-c.y+.5*r*R*R)/R,U=Math.max(0,i.verticalTurnRate)*t;c.vy+=is(I-c.vy,-U,U)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const u=h+c.vx*t,m=f+c.vy*t,_=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=s0(h,f,d,u,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(u-h)*p,c.y=f+(m-f)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),E=c.x-v.position.x,T=c.z-v.position.z;c.offX=E*w-T*S,c.offZ=E*S+T*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);Er(n,g,{type:"light",duration:.22,dirX:M>Yi?c.vx/M:0,dirZ:M>Yi?c.vz/M:1,knockback:.14}),$c(n,"arrow-land",v.id,c),l.push(c);continue}const y=Zs(n.boxes,u,_,m+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(m<=x+.02&&c.vy<0){c.x=u,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Yi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*ls),c.rest=Math.max(.2,i.stickSec),$c(n,"arrow-land",-1,c),l.push(c);continue}c.x=u,c.y=m,c.z=_,l.push(c)}n.arrows=l}const Zc=1e-6,d0=Math.PI/180;function qc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function sh(n,t,e){return n<t?t:n>e?e:n}function Rr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function jc(n){const t=n.id,e=n.windowId;Object.assign(n,Rr()),n.id=t,n.windowId=e}function u0(n){jc(n)}function _f(n){jc(n.playerLink);for(const t of n.dummies)jc(t.link)}function f0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Kc(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function fr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Rr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function p0(n,t){const e=n.config.links.search,i=n.character.position,a=sh(e.maxAngleDeg,0,180)*d0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,f=Math.hypot(c,h);if(f<Zc||f>e.range)continue;const d=Math.atan2(c,h);Math.abs(Xe(d-t))>a||f<r&&(r=f,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function m0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=$s(n,t),l=p0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?sh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),qc(n,"link-start",s.id)}function g0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){fr(n);return}if(e.weapon!==n.combat.weapon){fr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,qc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,qc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?sh(r/o,0,1):1,e.phase==="active"&&i.active>Zc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Zc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function x0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&fr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Kc(n,"sprint"),a.prevSprinting=r,g0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&m0(n,e,l,o.weapon)}const tr={windup:0,active:1,recovery:2},hd=1e-9;function Mf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function v0(n){return n==="windup"||n==="active"||n==="recovery"}function y0(n,t){return tr[n]+Mf(t)}function _0(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!v0(s.at))continue;const o=Mf(s.u??0),r=tr[s.at]+o;r>i+hd&&r<=e+hd&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>tr[s.at]+s.u-(tr[o.at]+o.u)),a}const qs=1e-6;function $i(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function M0(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function bf(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Pr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.timings=bf()}function b0(n){return{weapon:ya[Math.max(0,n-1)]??ya[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],timings:bf()}}function S0(n,t){return $s(n,t)}function w0(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Sf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=S0(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.notifyCursor=-1,a.hitIds.length=0,$i(n,"attack-start",i)}function wf(n){return Math.max(0,n.config.combat.settle)}function Jc(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Sf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:wf(n),lunge:w0(n,i.lunge[e-1]??0)},e)}function dd(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Sf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:wf(n),lunge:i.lunge},0),l0(n,e,n.combat.attackFacing),$i(n,"charge-release",e)}function E0(n,t,e){const i=n.combat;if(i.phase==="idle")return;const a=i.timings;if(i.hitstop>0)return;i.phaseTimer+=t;let s=0;for(;i.phase!=="idle"&&s++<8;){const l=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<l)break;if(i.phaseTimer-=l,i.phase==="windup")i.phase="active",$i(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",$i(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Jc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const l=i.timings.recovery;if(l>qs&&i.phaseTimer>=l*n.config.combat.cancelWindow){i.queued=!1;const c=n.config.combat.weapons[i.weapon];c.comboCount>0&&Jc(n,e,i.comboIndex<c.comboCount?i.comboIndex+1:1)}}const o=a.windup+a.active+a.recovery;let r=0;i.phase==="windup"?r=i.phaseTimer:i.phase==="active"?r=a.windup+i.phaseTimer:i.phase==="recovery"?r=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(r=o),i.phase!=="idle"&&(i.attackProgress=o>0?Math.min(1,r/o):1),T0(n)}function T0(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>qs?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:y0(t.phase,a);if(s<=t.notifyCursor+qs)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of _0(o,t.notifyCursor,s))M0(n,r.name,r.value);t.notifyCursor=s}function A0(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ya.length){const l=ya[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Pr(n),fr(n),$i(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,$i(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),E0(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Jc(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,$i(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,qs)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,dd(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?dd(n,e,l):$i(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>qs)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),f=_=>c*(1-Math.pow(1-Math.min(1,Math.max(0,_/l)),h+1)),d=Math.min(l,Math.max(0,i.phaseTimer)),u=Math.min(l,Math.max(0,i.phaseTimer-t));let m=Math.max(0,f(d)-f(u))/Math.max(t,1e-4);m=Math.min(m,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*m,n.impulse.z=Math.cos(i.attackFacing)*m}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const Qc=1e-6;function ec(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function R0(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Ef(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function ud(n,t,e){return n<t?t:n>e?e:n}function P0(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,f=s.z;for(;c<l-Qc;){const d=Math.min(l,c+r),u=s.x+t*d,m=s.z+e*d,_=ud(u,o.minX,o.maxX),g=ud(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(ih(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,f=g,c=d,_!==u||g!==m))break}return{x:h,z:f}}function C0(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Kc(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&ec(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Pr(n));const l=Pm(n,e),c=l.x,h=l.z,f=n.combat.weapon==="staff";if(i.kind=f?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=f?a.blinkCooldown:a.rollCooldown,f){const d=P0(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Kc(n,"blink"),ec(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Qc,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,ec(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(Qc,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const un=1e-6,tl=Math.PI*2,L0=7,D0=18;function k0(n){return Math.atan2(Math.sin(n),Math.cos(n))}function fd(n,t,e,i){return n+k0(t-n)*(1-Math.exp(-Math.max(e,un)*i))}function oh(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function I0(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:lf(),link:Rr()})}return t}function z0(n){const t=Jr.indexOf(n);return Jr[(t+1)%Jr.length]}function Tf(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,u0(i.link)}n.dummyAttackCount=0}function F0(n,t,e){const i=tc(n)*tl,a=Math.sqrt(tc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+tc(n)*.8)}function U0(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function N0(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(U0(t,i),un);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",oh(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function O0(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>un?a/o:0,l=o>un?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,u=t.targetZ-t.position.z,m=Math.hypot(d,u);(t.wanderTimer<=0||m<.3)&&F0(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>un&&(c=_/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let f=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>un&&(f=Math.atan2(c,h)):o>un&&(f=Math.atan2(r,l)),e.leashRadius>un&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,u=t.position.z-t.homeZ,m=Math.hypot(d,u);if(m>e.leashRadius){const _=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-u/m;c=c*(1-_)+g*_,h=h*(1-_)+p*_;const y=Math.hypot(c,h);y>un&&(c/=y,h/=y)}}return{x:c,z:h,facing:f}}function B0(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+un&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,oh(n,"dummy-attack",e))}N0(n,e,t,i);const a=O0(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-un||a.x<0&&e.position.x<=s.minX+un)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-un||a.z<0&&e.position.z<=s.minZ+un)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,un)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=fd(e.bodyYaw,e.facing,L0,t),e.headYaw=fd(e.headYaw,e.facing,D0,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(nh(n.boxes,e.position,i.radius,i.height,c))if(ih(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,y=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(y)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const f=n.config.worldBounds;e.position.x<f.minX?(e.position.x=f.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>f.maxX&&(e.position.x=f.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<f.minZ?(e.position.z=f.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>f.maxZ&&(e.position.z=f.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=Zs(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+un&&(e.position.y=d);const u=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=u;const m=Math.hypot(e.velocity.x,e.velocity.z),_=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,un)),g=Math.max(n.config.strideLength*(1+_*n.config.strideSpeedGain),un);e.stride=g,e.gaitPhase=(e.gaitPhase+u/g*tl)%tl}function H0(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=z0(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,oh(n,"dummy-mode",a)}for(const a of n.dummies)B0(n,t,a,i)}const Qn=1e-6,pd=Math.PI*2;function md(n,t){return Math.sqrt(n*n+t*t)}function xo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function G0(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Pr(n)}function V0(n,t,e){const i=n.character,a=n.config,s=Zs(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Pr(n),_f(n),Ef(n),gf(n),yf(n),dr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Jl,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function X0(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=md(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-Qn||r<0&&s.x<=h.minX+Qn)&&(r=0),(l>0&&s.z>=h.maxZ-Qn||l<0&&s.z<=h.minZ+Qn)&&(l=0);const f=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",u=n.dash.phase==="active",m=f||u||d;a.sprinting=!m&&e.sprintHeld&&c>Qn;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;u||d?g=0:f?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const I=m?i.skillDecel:c>Qn?i.acceleration:i.friction,U=1-Math.exp(-I*t);o.x+=(r*p-o.x)*U,o.z+=(l*p-o.z)*U}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,xo(n,"jumped",i.jumpSpeed)),n.events.some(I=>I.type==="blink"&&I.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,nh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(ih(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const I=s.x-x,U=s.z-v;Math.abs(I)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(U)<Math.abs(o.z*t)*.5&&(o.z=0)}xo(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Zs(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+Qn&&S-s.y<=i.stepHeight+Qn&&(s.y=S,o.y=0,xo(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=Zs(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||xo(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=md(s.x-x,s.z-v);a.distance+=b;const M=b/Math.max(t,Qn),R=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,Qn)),z=Math.max(i.strideLength*(1+R*i.strideSpeedGain),Qn);a.stride=z,a.gaitPhase=(a.gaitPhase+b/z*pd)%pd}const el=1e-6,gd=2.399963229728653;function fa(n,t,e){return n<t?t:n>e?e:n}function xd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,f=Math.hypot(c,h),d=e+i;if(f>=d)return;let u,m,_;f<el?(u=r,m=l,_=d):(u=c/f,m=h/f,_=d-f);const g=_+o;n.x-=u*g*a,n.z-=m*g*a,t.x+=u*g*s,t.z+=m*g*s}function W0(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let f=0;f<e.length;f++)for(let d=f+1;d<e.length;d++){const u=(f*3+d)*gd;xd(e[f].position,e[d].position,s,s,.5,.5,r,Math.cos(u),Math.sin(u))}for(let f=0;f<e.length;f++){const d=(f+1)*gd;xd(i,e[f].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)nh(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=fa(h.position.x,c.minX,c.maxX),h.position.z=fa(h.position.z,c.minZ,c.maxZ)}function Y0(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=fa(r.minScale,0,1);if(l<el||c<=0||h>=1)return 1;const f=a+o,d=fa(r.approachDot,0,.99);let u=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=f+c)continue;if(p<el){u=1;continue}const y=(e*_+i*g)/(l*p);if(y<=d)continue;const x=fa(1-(p-f)/c,0,1),v=fa((y-d)/(1-d),0,1);u=Math.max(u,x*v)}return 1-(1-h)*fa(u,0,1)}function $0(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Y0(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const nc=1e-6,Z0=Math.PI/180;function q0(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function j0(n,t,e){return n<t?t:n>e?e:n}function K0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>nc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>nc&&(o=Math.atan2(e.moveX,e.moveZ));const l=j0(i.maxAngleDeg,0,180)*Z0;let c=Number.POSITIVE_INFINITY,h=0,f=0,d=0;for(const u of n.dummies){const m=u.position.x-s.x,_=u.position.z-s.z,g=Math.hypot(m,_);if(g<nc||g>i.range)continue;const p=Math.atan2(m,_),y=Math.abs(Xe(p-o));if(y>l)continue;const x=g-i.frontBias*Math.cos(y);x<c&&(c=x,h=u.id,f=p,d=g)}a.targetId=h,a.targetYaw=f,a.targetDist=d,a.hasTarget=h>0}const pi=1e-6;function ts(n,t,e){return n<t?t:n>e?e:n}function vd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function J0(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(I,U)=>{const C=I.position.x-s.x,k=I.position.z-s.z,G=Math.hypot(C,k);if(G<pi||G>U)return 0;const N=ts((U-G)/Math.max(pi,U-i.nearDistance),0,1);let Z=N*(i.modeWeight[I.mode]??.5);return I.attackPhase==="active"&&(Z+=i.attackBoost*N),Z},r=[];let l=0,c=!1,h=!1,f=!1;for(const I of n.dummies){const U=o(I,i.threatRange),C=I.position.x-s.x,k=I.position.z-s.z,G=Math.hypot(C,k);U>0&&(r.push({id:I.id,x:I.position.x,z:I.position.z,dx:C,dz:k,yaw:Math.atan2(C,k),w:U}),l+=U,G<=i.approachDist&&(i.modeWeight[I.mode]??.5)>=i.hostileModeWeight&&(f=!0)),G>pi&&G<=i.recoveryDist&&(c=!0),(I.attackPhase==="windup"||I.attackPhase==="active")&&G<=i.threatRange&&(h=!0)}const d=l<=0?0:ts(l/(l+Math.max(pi,i.saturation)),0,1),u=r.length>0,m=a.active,_=u&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&f),g=i.hurtHoldSec>pi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((I,U)=>U.w-I.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,T=0,b=0;for(const I of y){const U=Math.abs(vd(I.yaw-v))/Math.PI;let C=I.w/(1+Math.max(i.spreadFalloff,0)*U*U);I!==x&&i.behindFalloff<1&&Math.abs(vd(I.yaw-S))>w&&(C*=Math.max(i.behindFalloff,0)),E+=I.x*C,T+=I.z*C,b+=C}a.mainId=x.id,a.mainYaw=v;const M=n.dummies.find(I=>I.id===x.id),R=(M?M.position.y:0)+n.config.dummies.height*ts(i.aimHeightRatio,0,1),z=s.y+n.config.characterHeight*ts(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(R-z,Math.max(pi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>pi?Math.atan2(E/b-s.x,T/b-s.z):v,a.threatCount=r.length,a.threat=d}function Q0(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function tg(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<pi||a>e.threatRange)return 0;const s=Math.max(pi,e.threatRange-e.nearDistance),o=ts((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(pi,e.modeWeight.attack??1.5);return ts(r/l,0,1)}function eg(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function ng(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:a0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:b0(1),playerLink:Rr(),arrows:[],arrowSeq:0,abilities:e0(),skills:Qm(n),impulse:{x:0,z:0},targeting:q0(),turnInPlace:Fm(),playerHurt:lf(),hitCount:0,dash:{...R0(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...xf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:eg(),dummies:I0(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function ig(n){G0(n),Tf(n),_f(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Jl,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,gf(n),yf(n),Ef(n),vf(n),dr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function yd(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){ig(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?K0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),x0(n,t,e),n.modules.combat&&A0(n,t,e),n.modules.dash&&C0(n,t,e),n.modules.movement&&X0(n,t,e),n.modules.gaze&&J0(n,t,e),n.modules.orientation&&Bm(n,t,e),Om(n,t,e),n.modules.dummies&&H0(n,t,e),Cm(n,t),f0(n,t),n.modules.abilities&&n0(n,t,e),n.modules.combat&&h0(n,t),n.modules.dummies&&(zm(n,t),n.modules.separation&&(W0(n),$0(n))),n.modules.camera?i0(n):vf(n),n}const Af=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],_d=1e-9;function ag(n,t,e){return n<t?t:n>e?e:n}function Rf(n){return ag(Number.isFinite(n)?n:0,0,1)}function Pf(n,t){const e=Rf(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function sg(){const n={};for(const t of Af)n[t]=0;return n}function og(n,t){const e=sg(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Rf(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+_d;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>_d?(a-o.t)/l:0,h=Pf(o.ease??"linear",c);for(const f of Af){const d=o.pose[f]??r.pose[f]??0,u=r.pose[f]??o.pose[f]??0;e[f]=d+(u-d)*h}return e}function rg(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Pf(i,t/a);return e.turns*Math.PI*2*s}function ta(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function cg(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};yd(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){yd(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function bi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function ke(n,t,e){return n+(t-n)*e}function lg(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Md(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:lg(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function hg(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function dg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:ke(n.ch.x,t.ch.x,i),y:ke(n.ch.y,t.ch.y,i),z:ke(n.ch.z,t.ch.z,i)},facing:bi(n.ch.facing,t.ch.facing,i),moveYaw:bi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:bi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:bi(n.ch.headYaw,t.ch.headYaw,i),headPitch:ke(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:ke(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:bi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:ke(n.ch.stride,t.ch.stride,i),velocity:{x:ke(n.ch.vx,t.ch.vx,i),y:ke(n.ch.vy,t.ch.vy,i),z:ke(n.ch.vz,t.ch.vz,i)}},s={attackProgress:ke(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:ke(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:ke(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,ke(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:ke(n.hurt.timer,t.hurt.timer,i),knockX:ke(n.hurt.knockX,t.hurt.knockX,i),knockZ:ke(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:ke(h.x,l.x,i),y:ke(h.y,l.y,i),z:ke(h.z,l.z,i)},facing:bi(h.facing,l.facing,i),bodyYaw:bi(h.bodyYaw,l.bodyYaw,i),headYaw:bi(h.headYaw,l.headYaw,i),gaitPhase:bi(h.gaitPhase,l.gaitPhase,i),stride:ke(h.stride,l.stride,i),attackProgress:ke(h.attackProgress,l.attackProgress,i),velocity:{x:ke(h.vx,l.vx,i),y:ke(h.vy,l.vy,i),z:ke(h.vz,l.vz,i)}}:null});return{time:ke(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:ke(n.dash.timer,t.dash.timer,i)},turn:{progress:ke(n.turn.progress,t.turn.progress,i)},link:{progress:ke(n.link.progress,t.link.progress,i)},dummies:r}}function ug(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Cf={slopPx:12,longPressMs:450,doubleTapMs:280};function fg(n,t,e=Cf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ea(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function pg(n=Cf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ea(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,ea(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,f=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return ea(l.button,"release",c,h,f,1);const u=e.get(l.button);return u!==void 0&&r-u.at<=n.doubleTapMs&&Math.hypot(s-u.x,o-u.y)<=n.slopPx*2?(e.delete(l.button),ea(l.button,"doubleTap",c,h,f,2)):(e.set(l.button,{at:r,x:s,y:o}),ea(l.button,"tap",c,h,f,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ea(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ea(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const ic=.001,mg=18;function nl(n,t,e){return n<t?t:n>e?e:n}function il(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function gg(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function xg(n,t,e,i,a=mg){const s=gg(t);if(!s)return{state:il(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<ic)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<ic?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<ic)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const f=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),u=Number.isFinite(f)&&f>0?Math.pow(f,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:nl(Number.isFinite(u)?u:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function bd(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?nl(r,a,s):nl(n,a,s)}function vg(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function yg(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const ac=["jump","sprint","reset","attack","skill2"],_g=8,Mg=16,sc=10,Sd=14,wd=140,bg=18,Sg=16,wg=400,Eg=1.0001;function er(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Tg(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&er(e)}function Ag(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,f=0,d=0,u=-1,m=0,_=null,g=-1,p=0,y=0,x=0,v=0,w=!1,S=0,E=1,T=0,b=null,M=0,R=0,z=!1,I=null,U=null,C=0,k=0,G=0,N=0,Z=!1,st=!0,mt=-1;const dt=pg({slopPx:Sd,longPressMs:450,doubleTapMs:350});let ft=[],at=null;const j=new Set;function pt(O){O&&ft.push(O)}const K=new Map;let Q=il(),q=!1,St=1;function At(){const O=Array.from(K.values()),ct=a(),gt=xg(Q,O,ct.pinchGain,ct.maxStepRatio,bg);if(Q=gt.state,q=gt.pinching,gt.scale!==1&&(St*=gt.scale),gt.started||gt.armedNow)b=null,z=!0,I=null;else if(gt.ended&&o===null&&O.length===1){const Vt=O[0];o=Vt.id,r=Vt.x,l=Vt.y,c=0,h=0,f=Vt.x,d=Vt.y,w=!1,S=0,E=1,T=0,performance.now(),b=null,z=!0,I=null}}const bt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},Ft={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let H=0,ee=0;const yt={},Bt=new Set,kt=[];function Dt(){for(const O of ac)yt[O]!==void 0&&(yt[O]=void 0),Y(O);dt.reset(),j.clear(),K.clear(),Q=il(),q=!1,o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0,_=null,g=-1,b=null,z=!1,I=null,U=null,mt=-1,G=0,N=0,Z=!1,st=!0}const Rt=()=>{document.hidden&&Dt()},L=O=>{if(O.clientX===0&&O.clientY===0){m++;return}if(er(O.target)||Tg(O.clientX,O.clientY)){j.add(O.pointerId);return}if(j.delete(O.pointerId),K.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),o===null&&!q){_=null,g=-1,o=O.pointerId,r=O.clientX,l=O.clientY,c=0,h=0,f=O.clientX,d=O.clientY,performance.now();const ct=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY)&&(O.screenX!==0||O.screenY!==0);w=ct,S=0,E=1,T=0,p=ct?O.screenX:0,y=ct?O.screenY:0,x=p,v=y,b=O.pointerId,M=O.clientX,R=O.clientY,z=!1}At()},A=O=>{if(O.pointerId===U&&(O.pointerType==="mouse"&&O.buttons===0||O.clientX===0&&O.clientY===0&&(C!==0||k!==0)||(st?(G=O.clientX-C,N=O.clientY-k):(C=O.clientX,k=O.clientY,st=!0,G=0,N=0))),pt(dt.move(O.pointerId,O.clientX,O.clientY,performance.now())),!j.has(O.pointerId)&&K.has(O.pointerId)&&(K.set(O.pointerId,{id:O.pointerId,x:O.clientX,y:O.clientY}),At()),j.has(O.pointerId)||O.pointerId!==o)return;const ct=performance.now();if(_===O.pointerId&&ct-g<150){m++;return}const gt=O.clientX,Vt=O.clientY;if(gt===0&&Vt===0&&(r!==0||l!==0)){m++;return}const qt=gt-f,F=Vt-d,Pt=Number.isFinite(O.screenX)&&Number.isFinite(O.screenY),it=Pt?O.screenX:0,lt=Pt?O.screenY:0,Lt=Pt&&(it!==0||lt!==0),Ct=it-x,Qt=lt-v;if(w&&Lt){const Fe=Math.hypot(Ct,Qt),he=Math.hypot(qt,F);if(Fe>3){if(S=0,T<30&&he>6&&Ct*qt+Qt*F>.7*Fe*he){const We=Fe/he;We>.2&&We<5&&(E+=(We-E)*.3,T++)}}else he>12&&(S++,S>=2&&(w=!1))}const oe=Math.hypot(qt,F);if(!w){const Fe=u<0?Number.POSITIVE_INFINITY:ct-u,he=Lt?Math.hypot(Ct,Qt):1/0;oe>28&&(Fe<200||he<oe*.4)&&(r+=qt,l+=F,m++)}f=gt,d=Vt,x=it,v=lt,O.pointerId===b&&Math.hypot(O.clientX-M,O.clientY-R)>_g&&(z=!0);let pe,se;w&&Lt?(pe=(it-p)/E,se=(lt-y)/E):(pe=gt-r,se=Vt-l);const Pe=Math.hypot(pe,se),Be=s();Pe>Be&&(pe*=Be/Pe,se*=Be/Pe);const nn=Math.hypot(c,h),gn=Math.hypot(pe,se);if(nn>10&&gn>10){const Fe=Math.abs(Math.atan2(c*se-h*pe,c*pe+h*se)),he=Math.max(nn,gn)*Fe,We=Math.max(Math.hypot(qt,F),Math.hypot(Ct,Qt)/Math.max(.2,E));if(Fe>.6&&We<Math.max(6,he*.5)){m++;return}}c=pe,h=se};function Y(O){if(!bt[O])return;bt[O]=!1,O==="attack"&&(Ft.attackReleased=!0);const ct=document.getElementById(`btn-${O}`);ct==null||ct.classList.remove("is-down")}function ht(){o!==null&&(_=o,g=performance.now(),o=null,c=0,h=0,f=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0)}const J=O=>{const ct=K.delete(O.pointerId),gt=j.delete(O.pointerId);ct&&At(),O.pointerId===U&&(U=null,Z?mt=performance.now():(G=0,N=0,mt=-1)),pt(dt.end(O.pointerId,O.clientX,O.clientY,performance.now()));for(const Ot of ac)yt[Ot]===O.pointerId&&(yt[Ot]=void 0,Y(Ot));const Vt=!ct&&!gt&&K.size<=1&&o!==null;(O.pointerId===o||K.size===0||Vt)&&ht(),!gt&&O.pointerId===b&&(!z&&!er(O.target)&&(I={x:O.clientX,y:O.clientY}),b=null)};for(const O of ac){const ct=document.getElementById(`btn-${O}`);if(!ct)continue;const gt=O==="attack"||O==="skill2",Vt=F=>{if(F.preventDefault(),yt[O]===void 0){yt[O]=F.pointerId,bt[O]=!0,O==="jump"&&(Ft.jump=!0),O==="reset"&&(Ft.reset=!0),O==="sprint"&&(Ft.sprintPressed=!0),O==="attack"&&(Ft.attackPressed=!0),O==="skill2"&&(Ft.skill2=!0),ct.classList.add("is-down"),pt(dt.begin(O,F.pointerId,F.clientX,F.clientY,performance.now()));try{ct.setPointerCapture(F.pointerId)}catch{}gt&&(U=F.pointerId,C=F.clientX,k=F.clientY,st=!(F.clientX===0&&F.clientY===0),G=0,N=0,Z=!1,mt=-1)}},Ot=F=>{yt[O]===F.pointerId&&(yt[O]=void 0,Y(O),pt(dt.end(F.pointerId,F.clientX,F.clientY,performance.now())))},qt=F=>{yt[O]===F.pointerId&&(yt[O]=void 0,Y(O),pt(dt.cancel(F.pointerId,performance.now())))};ct.addEventListener("pointerdown",Vt),ct.addEventListener("pointerup",Ot),ct.addEventListener("pointercancel",qt),kt.push(()=>{ct.removeEventListener("pointerdown",Vt),ct.removeEventListener("pointerup",Ot),ct.removeEventListener("pointercancel",qt)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const O of rt){const ct=gt=>{gt.preventDefault(),H=Number(O.dataset.weapon)||0};O.addEventListener("pointerdown",ct),kt.push(()=>O.removeEventListener("pointerdown",ct))}const Ut=O=>{const ct=O.key.toLowerCase();if((ct===" "||ct.startsWith("arrow"))&&O.preventDefault(),Bt.has(ct))return;Bt.add(ct),ct===" "&&(Ft.jump=!0),ct==="r"&&(Ft.reset=!0),ct==="shift"&&(Ft.sprintPressed=!0),ct==="j"&&(Ft.attackPressed=!0),ct==="k"&&(Ft.skill2=!0),ct>="1"&&ct<="5"&&(H=Number(ct)),ct>="6"&&ct<="9"&&(ee=Number(ct)-5);const gt=Math.max(Eg,a().keyStep||1.12);(ct==="="||ct==="+")&&(St*=gt),(ct==="-"||ct==="_")&&(St/=gt)},tt=O=>{const ct=O.key.toLowerCase();Bt.has(ct)&&(Bt.delete(ct),ct==="j"&&(Ft.attackReleased=!0))},vt=O=>{if(er(O.target))return;O.preventDefault();const ct=O.deltaMode===1?O.deltaY*Sg:O.deltaMode===2?O.deltaY*wg:O.deltaY;St*=vg(ct,a().wheelStep)},Nt=O=>{O.preventDefault()},ot=()=>{u=performance.now()};window.addEventListener("resize",ot),window.addEventListener("orientationchange",ot);const wt=typeof window<"u"?window.visualViewport:null;return wt&&(wt.addEventListener("resize",ot),wt.addEventListener("scroll",ot)),window.addEventListener("pointerdown",L),window.addEventListener("pointermove",A),window.addEventListener("pointerup",J),window.addEventListener("pointercancel",J),window.addEventListener("blur",Dt),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",Ut),window.addEventListener("keyup",tt),window.addEventListener("wheel",vt,{passive:!1}),window.addEventListener("gesturestart",Nt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:f,y:d,dx:f-r,dy:d-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:E}},peekAim(){const O=performance.now(),ct=Math.hypot(G,N),gt=U!==null||mt>=0&&O-mt<wd;if(!(gt&&Z&&ct>=sc))return{active:!1,holding:gt,x:0,z:0,dx:G,dy:N};const Ot=i(),qt=G/ct,F=N/ct,Pt=Ot.rightX*qt+Ot.forwardX*-F,it=Ot.rightZ*qt+Ot.forwardZ*-F,lt=Math.hypot(Pt,it)||1;return{active:!0,holding:gt,x:Pt/lt,z:it/lt,dx:G,dy:N}},sample(){var Fn;const O=s();let ct=o!==null?Math.max(-1,Math.min(1,c/O)):0,gt=o!==null?Math.max(-1,Math.min(1,h/O)):0,Vt=0,Ot=0;(Bt.has("a")||Bt.has("arrowleft"))&&(Vt-=1),(Bt.has("d")||Bt.has("arrowright"))&&(Vt+=1),(Bt.has("w")||Bt.has("arrowup"))&&(Ot-=1),(Bt.has("s")||Bt.has("arrowdown"))&&(Ot+=1),ct+=Vt,gt+=Ot;let qt=Math.hypot(ct,gt);qt>1&&(ct/=qt,gt/=qt,qt=1);const F=ct,Pt=gt;qt<e&&(ct=0,gt=0);const it=i();let lt=it.rightX*ct+it.forwardX*-gt,Lt=it.rightZ*ct+it.forwardZ*-gt;const Ct=Math.hypot(lt,Lt);Ct>1&&(lt/=Ct,Lt/=Ct);const Qt=performance.now();pt(dt.poll(Qt));const oe=Math.hypot(G,N);U!==null&&(oe>=Mg?Z=!0:oe<sc&&(Z=!1));const pe=U!==null||mt>=0&&Qt-mt<wd,se=pe&&Z&&oe>=sc;let Pe=0,Be=0;if(se){const Qe=G/oe,Sn=N/oe,xn=it.rightX*Qe+it.forwardX*-Sn,X=it.rightZ*Qe+it.forwardZ*-Sn,It=Math.hypot(xn,X)||1;Pe=xn/It,Be=X/It}!pe&&U===null&&(G=0,N=0,mt=-1,Z=!1);const nn=I;I=null;const gn=St;St=1;const Fe={moveX:lt,moveZ:Lt,jumpPressed:Ft.jump,sprintHeld:bt.sprint||Bt.has("shift"),sprintPressed:Ft.sprintPressed,resetPressed:Ft.reset,attackPressed:Ft.attackPressed,attackHeld:bt.attack||Bt.has("j"),attackReleased:Ft.attackReleased,skill2Pressed:Ft.skill2,weaponSlot:H,dummyClickId:ee,aimX:Pe,aimZ:Be,aimActive:se};Ft.jump=!1,Ft.reset=!1,Ft.sprintPressed=!1,Ft.attackPressed=!1,Ft.attackReleased=!1,Ft.skill2=!1,H=0,ee=0;const he=ft.map(Qe=>fg(Qe,it,Sd));ft=[],he.length>0&&(at=he[he.length-1]);const We=o!==null?"pointer":Bt.size>0?"keyboard":"idle";return{intents:Fe,stickX:ct,stickY:gt,stickRawX:F,stickRawY:Pt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:f,stickPxY:d,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:E,stickVpTop:((Fn=yg())==null?void 0:Fn.top)??0,stickVpAge:u<0?-1:Math.round(performance.now()-u),aimDX:G,aimDY:N,source:We,tap:nn,zoomScale:gn,gestures:he,lastGesture:at}},dispose(){window.removeEventListener("pointerdown",L),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",J),window.removeEventListener("pointercancel",J),window.removeEventListener("blur",Dt),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",Ut),window.removeEventListener("keyup",tt),window.removeEventListener("wheel",vt),window.removeEventListener("resize",ot),window.removeEventListener("orientationchange",ot),wt&&(wt.removeEventListener("resize",ot),wt.removeEventListener("scroll",ot)),window.removeEventListener("gesturestart",Nt),dt.reset();for(const O of kt)O()}}}const pr=1,mr=2,gr=4,Lf=8,xr=16,Hs=32,Df=64,kf=128,Rg=[[pr,"atk"],[mr,"dash"],[gr,"link"],[Lf,"air"],[xr,"hurt"],[Hs,"aim"],[Df,"spr"],[kf,"chan"]];function Ia(n){if(n===0)return"-";const t=Rg.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Pg=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Cg=0,Lg=15,oc=19,Dg=21,kg=22,Ig=23,zg=24,ui={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},kn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ti=n=>Math.round(n*180/Math.PI*10)/10,rc=Math.PI*2;function As(n){let t=n%rc;return t>Math.PI&&(t-=rc),t<-Math.PI&&(t+=rc),t}function Fg(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=pr),n.dash.phase!=="idle"&&(e|=mr),n.playerLink.phase!=="idle"&&(e|=gr),n.character.grounded||(e|=Lf),n.playerHurt.type!=="none"&&(e|=xr),t.intents.aimActive&&(e|=Hs),n.character.sprinting&&(e|=Df),n.abilities.channeling&&(e|=kf),e}function Ug(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Ng(n){const t={sampleHz:n.sampleHz??ui.sampleHz,sampleCapacity:n.sampleCapacity??ui.sampleCapacity,eventCapacity:n.eventCapacity??ui.eventCapacity,anomalyCapacity:n.anomalyCapacity??ui.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??ui.dirJumpDeg,aimDropDeg:n.aimDropDeg??ui.aimDropDeg,freezeMs:n.freezeMs??ui.freezeMs,freezeSpeed:n.freezeSpeed??ui.freezeSpeed,stickLostMs:n.stickLostMs??ui.stickLostMs,spikeMs:n.spikeMs??ui.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,f=0,d=0,u="",m=-1,_=-1,g=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,E=0,T=0,b=0;function M(C,k){const G=1/t.sampleHz,N=C[Cg];N-c<G-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),c=N)}function R(C,k,G,N,Z,st){const mt=v[C]??-1e9;if(k-mt<1.2)return;if(v[C]=k,C==="frameSpike"){let ft=0;for(const at of s)at.kind==="frameSpike"&&ft++;if(ft>=6)return}s.length>=t.anomalyCapacity&&s.shift();let dt=i.slice(-7);st&&(dt.length===0||dt[dt.length-1]!==st)&&(dt=[...dt.slice(-6),st]),s.push({kind:C,t:kn(k),tick:G,ms:Math.round(N),detail:Z,ctx:dt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function z(C,k,G,N){a.length>=t.eventCapacity&&a.shift(),a.push({t:kn(G),tick:N,k:C,d:k})}function I(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=C.tick;break}}function U(){const C=o,k=C.wallMs/1e3,G=C.gestures,N=dt=>Object.entries(G).filter(([ft])=>ft.endsWith(`.${dt}`)).reduce((ft,[,at])=>ft+at,0),Z=[];if(Z.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),Z.push(`运行 ${k.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),Z.push(`摇杆活跃 ${k>0?Math.round(C.stickActiveMs/1e3/k*100):0}% · 手势 按下 ${N("press")}（单击 ${N("tap")} / 双击 ${N("doubleTap")} / 拖拽 ${N("drag")} / 长按 ${N("longPress")} / 打断 ${N("cancel")} / 拖放 ${N("release")}）`),Z.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),Z.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${u||"-"}`),Z.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const dt of s.slice(-6)){Z.push(`· ${dt.kind} @t${dt.t.toFixed(2)} tick${dt.tick} ${dt.ms>0?`${dt.ms}ms `:""}${dt.detail}`);const ft=dt.ctx.map(j=>String(j[Lg])).join(" "),at=dt.ctx.map(j=>j[oc]===""||j[oc]==null?".":String(j[oc])).join(" ");if(Z.push(`  yaw ${ft}`),Z.push(`  in  ${at}`),dt.kind==="stickJump"||dt.kind==="stickBad"||dt.kind==="stickLost"){const j=dt.ctx.map(K=>`${K[Dg]},${K[kg]}`).join(" "),pt=dt.ctx.map(K=>`${K[Ig]},${K[zg]}`).join(" ");Z.push(`  o   ${j}`),Z.push(`  p   ${pt}`)}}if(a.length>0){Z.push("最近事件：");for(const dt of a.slice(-12))Z.push(`  ${dt.t.toFixed(2)} ${dt.k} ${dt.d}`.trimEnd())}const st=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",mt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return Z.push(`摇杆坐标源 ${st}${mt}`),Z.push(`UA ${e.ua}`),Z.join(`
`)}return{sample(C,k,G,N=0){o.frames++,k.stickHeld&&(k.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=N,o.wallMs+=G,G>o.dtMax&&(o.dtMax=G),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const Z=C.time;if(l<0&&(l=Z),T=Z,b=C.tick,!r)return;const st=C.character,mt=Math.hypot(k.stickX,k.stickY),dt=Math.hypot(st.velocity.x,st.velocity.z);u=C.combat.weapon;const ft=Fg(C,k),at=st.facing,pt=Math.hypot(k.intents.moveX,k.intents.moveZ)>.05?Math.atan2(k.intents.moveX,k.intents.moveZ):null;mt>.2&&(o.stickActiveMs+=G);const K=[kn(Z),C.tick,Math.round(G*10)/10,kn(k.stickX),kn(k.stickY),kn(k.stickRawX),kn(k.stickRawY),k.stickHeld?1:0,k.source.slice(0,8),kn(k.intents.moveX),kn(k.intents.moveZ),kn(st.position.x),kn(st.position.z),kn(st.velocity.x),kn(st.velocity.z),ti(at),ti(st.bodyYaw),ft,kn(st.stride),pt===null?"":ti(pt),k.stickId===null?"":k.stickId,Math.round(k.stickOriginX),Math.round(k.stickOriginY),Math.round(k.stickPxX),Math.round(k.stickPxY),k.stickBad,Math.round(k.stickVpTop),Math.round(k.stickOriginSX),Math.round(k.stickOriginSY),Math.round(k.stickScreenX),Math.round(k.stickScreenY),k.stickScreenOk?1:0,Math.round(k.stickScale*100)/100];M(K);const Q=Z*1e3<x;if(G>t.spikeMs&&!Q&&Z-l>.6&&(o.spikes++,R("frameSpike",Z,C.tick,G,`dt ${G.toFixed(0)}ms fl=${Ia(ft)}`,K)),h!==null&&!Q){const Dt=Math.abs(ti(As(at-h))),Rt=Math.abs(ti(As(st.moveYaw-f))),L=(d|ft)&(pr|mr|gr|xr)|ft&Hs,A=pt===null?null:Math.abs(ti(As(at-pt))),Y=pt===null||h===null?null:Math.abs(ti(As(h-pt))),ht=A!==null&&Y!==null&&A<Y-.5,J=(d&Hs)!==0&&(ft&Hs)===0&&pt===null,rt=A!==null&&(A<=12||ht);Dt>t.aimDropDeg&&J?R("aimDrop",Z,C.tick,0,`${Dt.toFixed(0)}° @aim→none stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Ia(ft)}`,K):Dt>t.dirJumpDeg&&L===0&&!J&&(rt?(o.inTurns++,Dt>o.inTurnMax&&(o.inTurnMax=Dt)):R("dirJump",Z,C.tick,0,`${Dt.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${ti(h)}→${ti(at)} in ${pt===null?".":ti(pt)}° mvΔ${Rt.toFixed(0)}° aim(${k.aimDX.toFixed(0)},${k.aimDY.toFixed(0)}) fl=${Ia(d)}→${Ia(ft)}`,K))}const q=(ft&(pr|mr|gr|xr))!==0,St=C.tick-y<30;mt>.35&&dt<t.freezeSpeed&&!q&&!St?(m<0&&(m=Z),Z-m>=t.freezeMs/1e3&&Z>=_&&(R("moveFreeze",Z,C.tick,(Z-m)*1e3,`stick(${k.stickX.toFixed(2)},${k.stickY.toFixed(2)}) v${dt.toFixed(2)} ${k.source} fl=${Ia(ft)}`,K),_=Z+1.5,m=-1)):m=-1,k.stickHeld?(mt>p&&(p=mt),p>.35&&mt<.06?(g<0&&(g=Z),Z-g>=t.stickLostMs/1e3&&(R("stickLost",Z,C.tick,(Z-g)*1e3,`raw(${k.stickRawX.toFixed(2)},${k.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ia(ft)}`,K),g=-1,p=0)):g=-1):(p=0,g=-1);const At=k.stickScale>.2&&k.stickScale<5?k.stickScale:1,bt=k.stickScreenOk,Ft=bt?k.stickScreenX/At:k.stickPxX,H=bt?k.stickScreenY/At:k.stickPxY,ee=bt?k.stickOriginSX/At:k.stickOriginX,yt=bt?k.stickOriginSY/At:k.stickOriginY,Bt=Ft-ee,kt=H-yt;if(k.stickHeld&&k.stickId!==null){const Dt=w;if(Dt&&Dt.held&&Dt.id===k.stickId){const Rt=Math.hypot(Dt.dx,Dt.dy),L=Math.hypot(Bt,kt),A=Math.max(Rt,L),Y=Math.hypot(Ft-Dt.cx,H-Dt.cy),ht=Math.abs(ti(As(Math.atan2(kt,Bt)-Math.atan2(Dt.dy,Dt.dx)))),J=A*ht*Math.PI/180,rt=Math.hypot(ee-Dt.ox,yt-Dt.oy);if(A>18&&ht>35&&Y<Math.max(5,J*.35)&&R("stickJump",Z,C.tick,0,`Δ${ht.toFixed(0)}° 手指只动${Y.toFixed(0)}px(弧长应${J.toFixed(0)}px) o(${Math.round(Dt.ox)},${Math.round(Dt.oy)})→(${Math.round(ee)},${Math.round(yt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(Ft)},${Math.round(H)}) raw(${Math.round(Bt)},${Math.round(kt)}) id${k.stickId} ${bt?"src=屏幕":"src=client"}`,K),bt&&Dt.screenOk){const Ut=Math.hypot(k.stickPxX-Dt.x,k.stickPxY-Dt.y),tt=Math.hypot((k.stickScreenX-Dt.sx)/At,(k.stickScreenY-Dt.sy)/At);S+=Ut-tt,Math.abs(S)>20&&(R("stickDrift",Z,C.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) screen(${Math.round(k.stickScreenX)},${Math.round(k.stickScreenY)})`,K),S=0)}}w={id:k.stickId,ox:ee,oy:yt,cx:Ft,cy:H,x:k.stickPxX,y:k.stickPxY,sx:k.stickScreenX,sy:k.stickScreenY,dx:Bt,dy:kt,held:!0,screenOk:bt}}else w=null,S=0;if(k.stickBad>E){const Dt=k.stickBad-E;R("stickBad",Z,C.tick,0,`拦截 ${Dt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${k.stickBad}）o(${Math.round(k.stickOriginX)},${Math.round(k.stickOriginY)}) p(${Math.round(k.stickPxX)},${Math.round(k.stickPxY)}) id${k.stickId??"-"}`,K)}E=k.stickBad,h=at,f=st.moveYaw,d=ft},event(C,k){const G=Ug(C);I(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||z(C.type,G,k,C.tick))},gesture(C){const k=`${C.button}.${C.kind}`;o.gestures[k]=(o.gestures[k]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&z(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,T,b)},suspend(C){x=T*1e3+C,m=-1,g=-1},setEnabled(C){r=C,C||(h=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,k=s.some(G=>C-G.t<8&&(G.kind==="dirJump"||G.kind==="aimDrop"||G.kind==="moveFreeze"||G.kind==="stickLost"||G.kind==="stickJump"||G.kind==="stickBad"||G.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:k,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Pg,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:U}}const Og={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9}},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Bg={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Hg={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35}},Gg={core:Og,scene:Bg,view:Hg};function rh(n){return JSON.parse(JSON.stringify(n))}const ch=Gg,Vg=rh(ch.core),vo=rh(ch.scene),hn=rh(ch.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class xi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),xi.nextNameID=xi.nextNameID||0,this.$name.id=`lil-gui-name-${++xi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Xg extends xi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function al(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Wg={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:al,toHexString:al},js={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Yg={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=js.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(a)}},$g={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=js.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return js.toHexString(a)}},Zg=[Wg,js,Yg,$g];function qg(n){return Zg.find(t=>t.match(n))}class jg extends xi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=qg(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=al(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class cc extends xi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Kg extends xi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,f;const d=5,u=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;f-=x*this._step*this._arrowKeyMultiplier(y),h+f>this._max?f=this._max-h:h+f<this._min&&(f=this._min-h),this._snapClampSetValue(h+f)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",u),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",d))},f=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",d)},u=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(u,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Jg extends xi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Qg extends xi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const tx=`.lil-gui {
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
}`;function ex(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Ed=!1;class vr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Ed&&r&&(ex(tx),Ed=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Jg(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Kg(this,t,e,i,a,s);case"boolean":return new Xg(this,t,e);case"string":return new Qg(this,t,e);case"function":return new cc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new jg(this,t,e,i)}addFolder(t){const e=new vr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof cc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof cc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function nx(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new vr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new vr({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=vt=>{const Nt=s.addFolder(vt);return l.push(Nt),Nt},h=(vt,Nt)=>{const ot=vt.addFolder(Nt);return r.push(ot),ot},f=c("模拟 / 显示");f.add(e,"timeScale",0,3,.05).name("时间缩放"),f.add(e,"paused").name("暂停"),f.add({step:i.singleStep},"step").name("单步 (1 tick)"),f.add({reset:i.reset},"reset").name("复位全部"),f.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),f.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),f.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),f.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(f,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const u=c("移动 / 输入"),m=h(u,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(u,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(u,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(u,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,w=h(u,"假人 AI");w.add(v,"moveSpeed",.5,8,.1).name("移动速度"),w.add(v,"wanderRadius",.5,8,.1).name("游走半径"),w.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),w.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),w.add(v,"keepDistance",1,10,.1).name("保持距离"),w.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),w.add(v,"attackRange",.5,5,.1).name("攻击距离"),w.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),w.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),E=h(S,"程序化步态");E.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),E.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),E.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),E.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),E.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),E.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),E.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),E.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),E.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),E.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),E.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),E.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),E.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),E.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),E.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),E.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(S,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(S,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const R=h(S,"足部 IK"),z=t.ik;R.add(z,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),R.add(z,"weight",0,1,.01).name("钉地权重"),R.add(z,"attackScale",0,1,.01).name("攻击时权重倍率"),R.add(z,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const I=h(S,"惯性倾斜 / 盆骨"),U=t.lean;I.add(U,"accelGain",0,.1,.002).name("前后加速度增益"),I.add(U,"turnGain",0,.2,.005).name("绕圈侧倾增益"),I.add(U,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),I.add(U,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),I.add(U,"smoothing",1,30,1).name("倾斜平滑速率"),I.add(U,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),I.add(U,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),I.add(U,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),I.add(U,"crouchSmoothing",1,30,1).name("下沉平滑速率");const C=o.orientation,k=h(S,"朝向 / 下盘带转");k.add(C,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(C,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(C,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const G=o.gaze,N=h(S,"接敌注视 / 俯仰 (v9s.18)");N.add(G,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),N.add(G,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),N.add(G,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),N.add(G,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),N.add(G,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),N.add(G,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),N.add(G,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),N.add(G,"headPitchRate",.5,20,.5).name("头部俯仰速率"),N.add(G,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),N.add(G,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),N.add(G,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const Z=h(S,"原地转身 / 停步偏差 (v9s)"),st=o.turnInPlace;Z.add(st,"enabled").name("启用原地转身 (关=纯插值)"),Z.add(st,"triggerDeg",20,180,5).name("触发夹角 (°)"),Z.add(st,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),Z.add(st,"settleDeg",0,60,1).name("转身保留余角 (°)"),Z.add(st,"durationSec",.1,1.5,.02).name("转身时长 (s)"),Z.add(st,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),Z.add(st,"inputDeadZone",0,.5,.01).name("起步输入死区"),Z.add(st,"armSec",0,.5,.01).name("触发防抖 (s)"),Z.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),Z.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),Z.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),Z.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),Z.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),Z.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const mt=c("战斗 / 受击"),dt=o.combat,ft=h(mt,"连击 / 武器"),at=ft.add(n.combat,"weapon",ya).name("当前武器");ft.add(dt,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ft.add(dt,"settle",0,.8,.01).name("段间停顿 (s)"),ft.add(dt,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ft.add(dt,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ft.add(dt,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ft.add(dt,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ft.add(dt,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ft.add(dt,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ft.add(dt,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ft.add(dt,"autoCombo").name("按住自动连击"),ft.add(dt.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ft.add(dt.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ft.add(dt.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const j=h(mt,"夸张化 (v9s.22)"),pt=t.animation.stretch;j.add(pt,"enabled").name("四肢伸缩 开"),j.add(pt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),j.add(pt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),j.add(pt,"impactSquash",0,.5,.01).name("命中挤压量"),j.add(pt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),j.add(pt,"torsoGain",0,1,.05).name("躯干跟随比例"),j.add(pt,"volumeExp",0,1.5,.05).name("体积补偿指数");const K=t.animation.swing;j.add(K,"enabled").name("挥击身体幅度 开"),j.add(K,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),j.add(K,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),j.add(K,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),j.add(K,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),j.add(K,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),j.add(K,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),j.add(K,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),j.add(K.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const Q=t.weaponTrail;j.add(Q,"enabled").name("挥击刀光 开"),j.add(Q,"life",.04,.4,.01).name("刀光残留 (s)"),j.add(Q,"intensity",0,1.5,.05).name("刀光亮度"),j.add(Q,"minStep",.005,.1,.005).name("采样最小位移 (m)"),j.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),j.add(t.hitstop,"enabled").name("命中定格 开"),j.add(t.hitstop,"duration",0,.2,.005).name("定格时长 (s)");const q=t.weaponWrist;j.add(q,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),j.add(q,"lag",0,.08,.002).name("臂速 → 腕滞后"),j.add(q,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),j.add(q,"rate",4,50,1).name("腕部跟随速率 (1/s)"),j.add(q,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),j.add(q,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const St=t.weaponMount;j.add(St,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),j.add(St,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),j.add(St,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),j.add(St,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),j.add(St,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),j.add(St,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),ft.add(dt.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ft.add(dt.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ft.add(dt.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ft.add(dt.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ft.add(dt.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ft.add(dt.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ft.add(dt.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ft.add(dt.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ft.add(dt.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ft.add(dt.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const At=o.abilities;ft.add(At.arcane,"perWave",1,8,1).name("每波飞弹数"),ft.add(At.arcane,"waves",1,12,1).name("每次引导波数"),ft.add(At.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ft.add(At.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ft.add(At.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ft.add(At.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ft.add(At.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ft.add(At.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ft.add(At.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ft.add(At.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ft.add(At.arcane,"speed",3,24,.5).name("飞弹速度"),ft.add(At.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ft.add(At.ring,"radius",.5,5,.1).name("电环半径"),ft.add(At.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ft.add(At.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const bt=h(mt,"攻击动作 / 跨步 / 落地");bt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),bt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),bt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const Ft=t.animation.stride;bt.add(Ft,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),bt.add(Ft,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),bt.add(Ft,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),bt.add(Ft,"cycles",1,3,1).name("每段跨步周期数"),bt.add(Ft,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),bt.add(Ft,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),bt.add(Ft,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),bt.add(Ft,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),bt.add(Ft,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),bt.add(Ft,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),bt.add(Ft,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),bt.add(Ft,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),bt.add(Ft,"heavyScale",0,1,.01).name("大剑重击收敛系数"),bt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),bt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),bt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),bt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),bt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),bt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),bt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),bt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),bt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),bt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),bt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),bt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const H=h(mt,"武器握持");H.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),H.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),H.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),H.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const ee=o.hits,yt=h(mt,"命中 / 受击 / 击退");yt.add(ee,"arcDeg",10,120,5).name("命中扇区半角 (°)"),yt.add(ee,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),yt.add(ee,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),yt.add(ee,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),yt.add(ee.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),yt.add(ee.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),yt.add(ee,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),yt.add(ee,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Bt=o.targeting,kt=h(mt,"目标辅助");kt.add(Bt,"targetAssist").name("启用目标辅助"),kt.add(Bt,"range",1,14,.5).name("锁定范围 (m)"),kt.add(Bt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),kt.add(Bt,"frontBias",0,4,.1).name("朝向加权"),kt.add(Bt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),kt.add(Bt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Dt=h(mt,"受击分层"),Rt=t.hurt;Dt.add(Rt,"enabled").name("启用分层受击 (关=旧版对照)"),Dt.add(Rt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Dt.add(Rt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Dt.add(Rt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Dt.add(Rt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Dt.add(Rt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Dt.add(Rt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Dt.add(Rt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Dt.add(Rt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Dt.add(Rt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Dt.add(Rt,"leanLight",0,1.5,.01).name("轻击力度"),Dt.add(Rt,"leanHeavy",0,1.5,.01).name("重击力度"),Dt.add(Rt,"leanKnock",0,1.5,.01).name("击退力度"),Dt.add(Rt,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:Rt.abdomen},{name:"打肩 (shoulder)",p:Rt.shoulder}].map(({name:vt,p:Nt})=>{const ot=h(Dt,vt);return ot.add(Nt,"upperPitch",0,2,.01).name("上身前后倾斜"),ot.add(Nt,"upperRoll",0,2,.01).name("上身侧倾"),ot.add(Nt,"upperYaw",0,1.5,.01).name("肩部扭转"),ot.add(Nt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),ot.add(Nt,"shift",0,.8,.01).name("身体反应位移"),ot.add(Nt,"drop",0,.4,.01).name("整体下沉"),ot.add(Nt,"back",0,.4,.01).name("屁股向后"),ot.add(Nt,"knee",0,1.6,.01).name("屈膝"),ot.add(Nt,"hip",0,1,.01).name("髋前倾"),ot.add(Nt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),ot});const L=h(mt,"派生招"),A=o.links;L.add(A,"enabled").name("总开关 (false=旧连击)"),L.add(A.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),L.add(A.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),L.add(A.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),L.add(A,"sharedCooldown",0,3,.05).name("共享 CD (s)"),L.add(A,"triggerWhileSprinting").name("长跑中可直接触发"),L.add(A.search,"range",1,14,.1).name("索敌距离 (m)"),L.add(A.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),L.add(A.search,"stopDistance",0,3,.05).name("停住距离 (m)");const Y=A.moves["sword-shield"];Y&&(L.add(Y,"enabled").name("剑盾盾击"),L.add(Y,"distance",0,8,.1).name("冲锋极限 (m)"),L.add(Y,"windup",0,.5,.01).name("前摇 (s)"),L.add(Y,"active",0,.8,.01).name("冲锋 / 命中 (s)"),L.add(Y,"recovery",0,.8,.01).name("收势 (s)"),L.add(Y.hit,"radius",0,4,.05).name("命中半径 (m)"),L.add(Y.hit,"width",0,2,.05).name("扫掠半径 (m)"),L.add(Y.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),L.add(Y.hit,"duration",0,1.5,.01).name("僵直 (s)")),L.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const ht=c("相机"),J=h(ht,"基础");J.add(t.camera,"pitchDeg",20,80,1).name("俯角"),J.add(t.camera,"yawDeg",-180,180,1).name("方位角"),J.add(t.camera,"distance",6,35,.5).name("距离"),J.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),J.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,Ut=h(ht,"智能构图");Ut.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),Ut.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Ut.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),Ut.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),Ut.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),Ut.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Ut.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Ut.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),Ut.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),Ut.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Ut.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const tt=h(ht,"缩放");return tt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),tt.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),tt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),tt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),tt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),tt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),tt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),tt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(vt=>vt.close()),l.forEach(vt=>vt.close()),s.close(),{gui:s,refreshWeapon:()=>at.updateDisplay()}}function ix(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function ax(n,t){return n.find(e=>e.id===t)??null}function Td(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function sx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function f(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return ix(n,t.character.position.x,t.character.position.z)}function u(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?f(g):y&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(y=>y.index===g)??null:ax(n,g);return p?(V0(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),u(),!0):!1}function _(){Tf(t)}if(s){s.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),s.appendChild(g);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const E=document.createElement("span");E.className="lab-name",E.textContent=v.name,w.append(S,E),w.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",g=>{var p,y;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const x=Td(n,((p=d())==null?void 0:p.id)??o,-1);x&&m(x.id)}else if(g.key==="]"){const x=Td(n,((y=d())==null?void 0:y.id)??o,1);x&&m(x.id)}else g.key==="\\"&&_()}),u(),{goto:m,current:d,tick:u,recall:_,element:s}}const lc=Math.PI*2,fi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},ox=45,rx=50;function cx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Rs(n,t,e){const i=cx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function lx(n,t){return Math.atan2(n,-t)*180/Math.PI}function Ad(n,t){return Math.abs(((n-t)%360+540)%360-180)}function yo(n){return(n%360+360)%360}const hx={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function dx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Rs(s.moveX,s.moveZ,e):null,f=c>.15?Rs(l.x,l.z,e):null,d=Rs(Math.sin(a.facing),Math.cos(a.facing),e),u=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Rs(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?Rs(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&f!==null?Ad(h,f):null,p=h!==null?Ad(h,d):null,y=g!==null&&g>ox&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?lx(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:f,speed:c,faceDeg:d,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:u,gapMove:g,gapFace:p,warnMove:y}}function Rd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>rx&&(n.inLen>=.35||n.speed>=.4)}const Pd="harness.dirDebug";function ux(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Pd)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Pd,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const f=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*f),a.height=Math.round(d*f);let u=hx,m=0,_="",g=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,E=w/2,T=Math.min(v,w)/2-13;r.setTransform(f,0,0,f,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,E,T,0,lc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":fi.ring,r.stroke(),r.strokeStyle=fi.grid,r.beginPath(),r.moveTo(S-T,E),r.lineTo(S+T,E),r.moveTo(S,E-T),r.lineTo(S,E+T),r.stroke();for(let z=0;z<8;z++){const I=z*Math.PI/4,U=S+Math.sin(I)*(T-3),C=E-Math.cos(I)*(T-3),k=S+Math.sin(I)*T,G=E-Math.cos(I)*T;r.beginPath(),r.moveTo(U,C),r.lineTo(k,G),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=fi.dead,r.beginPath(),r.arc(S,E,T*b,0,lc),r.stroke(),r.restore());const M=(z,I,U,C,k=!1,G=1)=>{const N=z*Math.PI/180,Z=Math.sin(N),st=-Math.cos(N),mt=T*Math.max(.14,Math.min(1,I)),dt=S+Z*T*.14,ft=E+st*T*.14,at=S+Z*mt,j=E+st*mt;if(r.save(),r.globalAlpha=G,r.strokeStyle=U,r.fillStyle=U,r.lineWidth=C,r.lineCap="round",k&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(dt,ft),r.lineTo(at,j),r.stroke(),!k&&mt>T*.3){const pt=-st,K=Z,Q=5.2;r.beginPath(),r.moveTo(at+Z*1.5,j+st*1.5),r.lineTo(at-Z*Q+pt*Q*.72,j-st*Q+K*Q*.72),r.lineTo(at-Z*Q-pt*Q*.72,j-st*Q-K*Q*.72),r.closePath(),r.fill()}r.restore()},R=(z,I)=>{const U=z*Math.PI/180,C=Math.sin(U),k=-Math.cos(U),G=-k,N=C,Z=T+1.5,st=Z+6.5;r.save(),r.fillStyle=I,r.strokeStyle=I,r.lineWidth=1,r.beginPath(),r.moveTo(S+C*st,E+k*st),r.lineTo(S+C*Z+G*4,E+k*Z+N*4),r.lineTo(S+C*Z-G*4,E+k*Z-N*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,fi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,fi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,fi.aim,1.6,!0,.95),M(x.faceDeg,1,fi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),fi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,fi.input,2.2),R(x.faceDeg,fi.face),r.beginPath(),r.arc(S,E,2.2,0,lc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=T=>T===null?"-":String(Math.round(yo(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Rd(x,v))}return{update(x,v,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=dx(x,v,w,g);u=S;const E=x.combat.phase!=="idle";p(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-m>90||b!==_)&&(m=T,_=b,y(S,E),e.dataset.in=S.inDeg===null?"":yo(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":yo(S.moveDeg).toFixed(1),e.dataset.fc=yo(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Rd(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>u}}const fx=6,px=480,Cd=240,Ld=92,mx=18;function gx(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function xx(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function vx(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function yx(n={}){const t=Math.max(1,n.windowS??fx),e=Math.max(60,n.capacity??px),i=Math.max(1,n.speedCap??mx),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),f=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),u=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Cd*u),l.height=Math.round(Ld*u);const m=ux({deadZone:n.deadZone,container:f,embedded:!0});let _=!1;function g(T){_=T,s.classList.toggle("is-off",!T),!a&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!_)}));const p=[];let y=0,x=null,v=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function E(T,b){if(!d)return;const M=Cd,R=Ld;d.setTransform(u,0,0,u,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const z=4,I=4,U=M-z-I,C=9,k=46,G=62,N=22,Z=b-t,st=K=>z+Math.max(0,Math.min(1,(K-Z)/t))*U;for(let K=0;K<T.length;K++){if(!T[K].busy)continue;const Q=st(T[K].t),q=K+1<T.length?st(T[K+1].t):Q+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(Q,C,Math.max(2,q-Q),k)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const K of[C,C+k/2,C+k])d.moveTo(z,K),d.lineTo(M-I,K);d.moveTo(z,G+N/2),d.lineTo(M-I,G+N/2),d.stroke();const dt=Math.max(1,...T.map(K=>K.speed),...T.map(K=>K.drive))*1.15,ft=K=>C+k-K/dt*k;if(T.length>1){d.beginPath(),d.moveTo(st(T[0].t),ft(T[0].speed));for(let K=1;K<T.length;K++)d.lineTo(st(T[K].t),ft(T[K].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(st(T[T.length-1].t),C+k),d.lineTo(st(T[0].t),C+k),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(st(T[0].t),ft(T[0].drive));for(let K=1;K<T.length;K++)d.lineTo(st(T[K].t),ft(T[K].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let at=.02;for(const K of T)at=Math.max(at,Math.abs(K.dv));at*=1.1;const j=G+N/2,pt=N/2;for(const K of T){const Q=Math.min(pt,Math.abs(K.dv)/at*pt);d.fillStyle=K.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(st(K.t)-.7,K.dv>=0?j-Q:j,1.4,Math.max(.5,Q))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(dt.toFixed(1),z+2,C+8),d.fillText("v",z+2,C+k-2),d.fillText("Δv",z+2,G+9),d.textAlign="right",d.fillText("0",M-I-2,C+k-2),d.textAlign="left"}return{dirDebug:m,update(T,b,M){const R=performance.now()/1e3,z=v<0?1/60:Math.max(1e-4,Math.min(.25,R-v));v=R;const I=T.character,U={x:I.position.x,z:I.position.z},C=Math.hypot(I.velocity.x,I.velocity.z),{speed:k,raw:G}=x?xx(x,U,z,i):{speed:0,raw:0},N=gx(y,k,z,R);N.drive=C,N.raw=G,N.busy=vx(T),x=U,y=k,p.push(N),p.length>e&&p.shift();const Z=S(R);let st=0;for(const mt of Z)st=Math.max(st,mt.speed);if(w={speed:k,drive:C,raw:G,dv:N.dv,accel:N.accel,peak:st,samples:Z.length,windowS:t,busy:N.busy},m.update(T,b,M),_){E(Z,R);const mt=N.dv>=0?"+":"";c.textContent=`v ${k.toFixed(2)} · 驱 ${C.toFixed(2)} · 峰 ${st.toFixed(2)} · Δv ${mt}${N.dv.toFixed(3)} · ${Z.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(T=>({...T}))}}const _x=["剑盾","双剑","大剑","法杖","弓"],Mx={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function bx(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,f=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,u=bt=>bt.toFixed(2),m=bt=>(bt*180/Math.PI).toFixed(0),_=_x[ya.indexOf(f.weapon)]??f.weapon,g=Math.round(f.charge*10),p="|".repeat(g)+".".repeat(10-g),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${u(y.cooldown)}`,w=a.intents.aimActive?`(${u(a.intents.aimX)},${u(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/T*100),M=`strafe ${b}%${S<-.05?" back":""}`,R=t.camera,z=`threat ${(R.threat*100).toFixed(0)}%  dist×${u(R.distanceScale)}  off (${u(R.offsetX)},${u(R.offsetZ)})  pitch +${u(R.pitchDelta)}°  n=${R.threatCount}`,I=o?u(o.attackBlend):"-",U=o==null?void 0:o.attackWeights,C=U?`gw ${u(U.gaitScale)}  lw ${u(U.attackLegWeight)}  spd ${u(U.driveSpeed)}`:"-",k=U?`${u(U.gaitScale)}/${u(U.attackLegWeight)}`:"-",G=o?`${o.landing.kind} ${u(o.landing.pulse)} t${u(o.landing.remaining)} vy${u(o.landing.impactVy)}`:"-",N=o?`${o.landing.kind}/${u(o.landing.pulse)}`:"-",Z=(o==null?void 0:o.zoom)!==void 0?`zoom ×${u(o.zoom)}`:"-",st=o==null?void 0:o.hurt,mt=st?`hurt ${t.playerHurt.type}  部位h${u(st.hitHeight)}  脉冲p${u(st.pulse)}  上身${u(st.upperShift)}  重心${u(st.comShift)}  后坐${u(st.pelvisBack)}  屈膝${u(st.knee)}`:"-",dt=st?`${u(st.hitHeight)}/${u(st.pulse)}/${u(st.knee)}`:"-",ft=o==null?void 0:o.ik,at=ft?`${ft.active?"on":"off"} w${u(ft.weight)} e${u(ft.maxError)}`:"-",j=t.playerLink,pt=`link ${j.kind||"-"}  ${j.phase}  prog ${u(j.progress)}  win ${u(j.linkWindow)}s  cd ${u(j.cooldown)}s  hits ${j.hitIds.length}  travel ${u(j.travelled)}/${u(j.travel)}m  id ${j.id}`,K=`${j.phase}/${j.kind||"-"}/w${u(j.linkWindow)}`,Q=a.lastGesture,q=Q?`${Q.button} ${Q.kind} ${Q.heldMs.toFixed(0)}ms d${Q.distance.toFixed(0)}px ${Q.angleDeg.toFixed(0)}° taps${Q.taps}`:"-",St=t.dummies.map(bt=>`${bt.id}:${Mx[bt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${f.phase} · lk ${j.phase}${j.kind?`/${j.kind}`:""} w${u(j.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${u(c.x)},${u(c.y)},${u(c.z)})  vel (${u(h.x)},${u(h.y)},${u(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${u(a.stickX)},${u(a.stickY)}) ${a.source}  str${u(l.stride)}`,`weapon ${_}  ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}  dash ${v}  ab ${I}  gw/lw ${k}  land ${N}  ik ${at}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${dt}`,`dummies ${St}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${u(R.distanceScale)}  ${Z}  lk ${K}`,`event ${d?`${d.type} ${u(d.value)}`:"-"}  scale ${u(s.timeScale)}${s.paused?" [P]":""}  g ${q}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${u(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${u(c.x)}, ${u(c.y)}, ${u(c.z)})`,`vel  (${u(h.x)}, ${u(h.y)}, ${u(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${I}   ${C}   land ${G}`,mt,`ik ${at}  clamped ${ft?ft.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${u(a.intents.moveX)}, ${u(a.intents.moveZ)})  stick (${u(a.stickX)}, ${u(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${f.phase}  combo ${f.comboIndex}/3  atk ${u(f.attackProgress)}${f.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${u(y.cooldown)}s  id ${y.id}  from (${u(y.fromX)},${u(y.fromZ)}) → to (${u(y.toX)},${u(y.toZ)})`,pt,`camera ${z}  ${Z}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${u(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(f.charge*100).toFixed(0)}%  charging ${f.charging?"Y":"N"}`,`dummies ${St}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${u(t.impulse.x)}, ${u(t.impulse.z)})`,`event ${d?`${d.type} ${u(d.value)}`:"-"}   scale ${u(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${q}`].join(`
`)}}}const _o=["lab","hud","motion","debug"],Dd={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},kd={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Sx(n){var l;const t=Object.fromEntries(_o.map(c=>[c,document.getElementById(kd[c].toggle)])),e=Object.fromEntries(_o.map(c=>[c,document.getElementById(kd[c].panel)]));let i={},a=null;function s(){var c,h,f;for(const d of _o){const u=a===d,m=t[d],_=e[d];m&&(m.setAttribute("aria-expanded",String(u)),m.textContent=`${Dd[d].short} ${u?"▾":"▸"}`,m.setAttribute("aria-label",`${u?"收起":"展开"}${Dd[d].full}`)),_&&_.classList.toggle("is-open",u)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(f=i.debug)==null||f.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of _o)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lh="170",wx=0,Id=1,Ex=2,If=1,zf=2,Pi=3,Ki=0,In=1,$e=2,qi=0,as=1,Xi=2,zd=3,Fd=4,Tx=5,pa=100,Ax=101,Rx=102,Px=103,Cx=104,Lx=200,Dx=201,kx=202,Ix=203,sl=204,ol=205,zx=206,Fx=207,Ux=208,Nx=209,Ox=210,Bx=211,Hx=212,Gx=213,Vx=214,rl=0,cl=1,ll=2,hs=3,hl=4,dl=5,ul=6,fl=7,hh=0,Xx=1,Wx=2,ji=0,Yx=1,$x=2,Zx=3,qx=4,jx=5,Kx=6,Jx=7,Ff=300,ds=301,us=302,pl=303,ml=304,Cr=306,gl=1e3,ga=1001,xl=1002,oi=1003,Qx=1004,Mo=1005,gi=1006,hc=1007,xa=1008,Ii=1009,Uf=1010,Nf=1011,Ks=1012,dh=1013,_a=1014,Li=1015,so=1016,uh=1017,fh=1018,fs=1020,Of=35902,Bf=1021,Hf=1022,si=1023,Gf=1024,Vf=1025,ss=1026,ps=1027,Xf=1028,ph=1029,Wf=1030,mh=1031,gh=1033,nr=33776,ir=33777,ar=33778,sr=33779,vl=35840,yl=35841,_l=35842,Ml=35843,bl=36196,Sl=37492,wl=37496,El=37808,Tl=37809,Al=37810,Rl=37811,Pl=37812,Cl=37813,Ll=37814,Dl=37815,kl=37816,Il=37817,zl=37818,Fl=37819,Ul=37820,Nl=37821,or=36492,Ol=36494,Bl=36495,Yf=36283,Hl=36284,Gl=36285,Vl=36286,tv=3200,ev=3201,$f=0,nv=1,Wi="",Cn="srgb",gs="srgb-linear",Lr="linear",Ie="srgb",za=7680,Ud=519,iv=512,av=513,sv=514,Zf=515,ov=516,rv=517,cv=518,lv=519,Xl=35044,Nd=35048,Od="300 es",Di=2e3,yr=2001;class xs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const _n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Bd=1234567;const os=Math.PI/180,Js=180/Math.PI;function vi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_n[n&255]+_n[n>>8&255]+_n[n>>16&255]+_n[n>>24&255]+"-"+_n[t&255]+_n[t>>8&255]+"-"+_n[t>>16&15|64]+_n[t>>24&255]+"-"+_n[e&63|128]+_n[e>>8&255]+"-"+_n[e>>16&255]+_n[e>>24&255]+_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]).toLowerCase()}function pn(n,t,e){return Math.max(t,Math.min(e,n))}function xh(n,t){return(n%t+t)%t}function hv(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function dv(n,t,e){return n!==t?(e-n)/(t-n):0}function Gs(n,t,e){return(1-e)*n+e*t}function uv(n,t,e,i){return Gs(n,t,1-Math.exp(-e*i))}function fv(n,t=1){return t-Math.abs(xh(n,t*2)-t)}function pv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function mv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function gv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function xv(n,t){return n+Math.random()*(t-n)}function vv(n){return n*(.5-Math.random())}function yv(n){n!==void 0&&(Bd=n);let t=Bd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _v(n){return n*os}function Mv(n){return n*Js}function bv(n){return(n&n-1)===0&&n!==0}function Sv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function wv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ev(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),f=s((t-i)/2),d=o((t-i)/2),u=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*f,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*f,r*c);break;case"ZXZ":n.set(l*f,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*u,r*c);break;case"YXY":n.set(l*u,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*u,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function ai(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function De(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Hd={DEG2RAD:os,RAD2DEG:Js,generateUUID:vi,clamp:pn,euclideanModulo:xh,mapLinear:hv,inverseLerp:dv,lerp:Gs,damp:uv,pingpong:fv,smoothstep:pv,smootherstep:mv,randInt:gv,randFloat:xv,randFloatSpread:vv,seededRandom:yv,degToRad:_v,radToDeg:Mv,isPowerOfTwo:bv,ceilPowerOfTwo:Sv,floorPowerOfTwo:wv,setQuaternionFromProperEuler:Ev,normalize:De,denormalize:ai};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class me{constructor(t,e,i,a,s,o,r,l,c){me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],_=a[0],g=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*v+l*E,s[1]=c*_+h*y+f*w,s[4]=c*g+h*x+f*S,s[7]=c*p+h*v+f*E,s[2]=d*_+u*y+m*w,s[5]=d*g+u*x+m*S,s[8]=d*p+u*v+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*o-r*c,d=r*l-h*s,u=c*s-o*l,m=e*f+i*d+a*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=f*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=u*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(dc.makeScale(t,e)),this}rotate(t){return this.premultiply(dc.makeRotation(-t)),this}translate(t,e){return this.premultiply(dc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const dc=new me;function qf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function _r(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Tv(){const n=_r("canvas");return n.style.display="block",n}const Gd={};function Us(n){n in Gd||(Gd[n]=!0,console.warn(n))}function Av(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Rv(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Pv(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ee={enabled:!0,workingColorSpace:gs,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Ie&&(n.r=ki(n.r),n.g=ki(n.g),n.b=ki(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Ie&&(n.r=rs(n.r),n.g=rs(n.g),n.b=rs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Wi?Lr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function ki(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function rs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Vd=[.64,.33,.3,.6,.15,.06],Xd=[.2126,.7152,.0722],Wd=[.3127,.329],Yd=new me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$d=new me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ee.define({[gs]:{primaries:Vd,whitePoint:Wd,transfer:Lr,toXYZ:Yd,fromXYZ:$d,luminanceCoefficients:Xd,workingColorSpaceConfig:{unpackColorSpace:Cn},outputColorSpaceConfig:{drawingBufferColorSpace:Cn}},[Cn]:{primaries:Vd,whitePoint:Wd,transfer:Ie,toXYZ:Yd,fromXYZ:$d,luminanceCoefficients:Xd,outputColorSpaceConfig:{drawingBufferColorSpace:Cn}}});let Fa;class Cv{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Fa===void 0&&(Fa=_r("canvas")),Fa.width=t.width,Fa.height=t.height;const i=Fa.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Fa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_r("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=ki(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ki(e[i]/255)*255):e[i]=ki(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Lv=0;class jf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lv++}),this.uuid=vi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(uc(a[o].image)):s.push(uc(a[o]))}else s=uc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function uc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Cv.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Dv=0;class Dn extends xs{constructor(t=Dn.DEFAULT_IMAGE,e=Dn.DEFAULT_MAPPING,i=ga,a=ga,s=gi,o=xa,r=si,l=Ii,c=Dn.DEFAULT_ANISOTROPY,h=Wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dv++}),this.uuid=vi(),this.name="",this.source=new jf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ff)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case gl:t.x=t.x-Math.floor(t.x);break;case ga:t.x=t.x<0?0:1;break;case xl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case gl:t.y=t.y-Math.floor(t.y);break;case ga:t.y=t.y<0?0:1;break;case xl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Dn.DEFAULT_IMAGE=null;Dn.DEFAULT_MAPPING=Ff;Dn.DEFAULT_ANISOTROPY=1;class Ke{constructor(t=0,e=0,i=0,a=1){Ke.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(u+1)/2,w=(p+1)/2,S=(h+d)/4,E=(f+_)/4,T=(m+g)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=T/s),this.set(i,a,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(f-_)*(f-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(f-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kv extends xs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ke(0,0,t,e),this.scissorTest=!1,this.viewport=new Ke(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Dn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new jf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ma extends kv{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Kf extends Dn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Iv extends Dn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=oi,this.minFilter=oi,this.wrapR=ga,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class oo{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],f=i[a+3];const d=s[o+0],u=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=d,t[e+1]=u,t[e+2]=m,t[e+3]=_;return}if(f!==_||l!==d||c!==u||h!==m){let g=1-r;const p=l*d+c*u+h*m+f*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*g+d*v,c=c*g+u*v,h=h*g+m*v,f=f*g+_*v,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],f=s[o],d=s[o+1],u=s[o+2],m=s[o+3];return t[e]=r*m+h*f+l*u-c*d,t[e+1]=l*m+h*d+c*f-r*u,t[e+2]=c*m+h*u+r*d-l*f,t[e+3]=h*m-r*f-l*d-c*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),f=r(s/2),d=l(i/2),u=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=i+r+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(o-a)*u}else if(i>r&&i>f){const u=2*Math.sqrt(1+i-r-f);this._w=(h-l)/u,this._x=.25*u,this._y=(a+o)/u,this._z=(s+c)/u}else if(r>f){const u=2*Math.sqrt(1+r-i-f);this._w=(s-c)/u,this._x=(a+o)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-r);this._w=(o-a)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(pn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const u=1-e;return this._w=u*o+e*this._w,this._x=u*i+e*this._x,this._y=u*a+e*this._y,this._z=u*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=i*f+this._x*d,this._y=a*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(t=0,e=0,i=0){B.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),f=2*(s*i-o*e);return this.x=e+l*c+o*f-r*h,this.y=i+l*h+r*c-s*f,this.z=a+l*f+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return fc.copy(this).projectOnVector(t),this.sub(fc)}reflect(t){return this.sub(fc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(pn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fc=new B,Zd=new oo;class ro{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ei.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ei.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ei.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ei):ei.fromBufferAttribute(s,o),ei.applyMatrix4(t.matrixWorld),this.expandByPoint(ei);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),bo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),bo.copy(i.boundingBox)),bo.applyMatrix4(t.matrixWorld),this.union(bo)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ei),ei.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ps),So.subVectors(this.max,Ps),Ua.subVectors(t.a,Ps),Na.subVectors(t.b,Ps),Oa.subVectors(t.c,Ps),Ni.subVectors(Na,Ua),Oi.subVectors(Oa,Na),na.subVectors(Ua,Oa);let e=[0,-Ni.z,Ni.y,0,-Oi.z,Oi.y,0,-na.z,na.y,Ni.z,0,-Ni.x,Oi.z,0,-Oi.x,na.z,0,-na.x,-Ni.y,Ni.x,0,-Oi.y,Oi.x,0,-na.y,na.x,0];return!pc(e,Ua,Na,Oa,So)||(e=[1,0,0,0,1,0,0,0,1],!pc(e,Ua,Na,Oa,So))?!1:(wo.crossVectors(Ni,Oi),e=[wo.x,wo.y,wo.z],pc(e,Ua,Na,Oa,So))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ei).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ei).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Si),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Si=[new B,new B,new B,new B,new B,new B,new B,new B],ei=new B,bo=new ro,Ua=new B,Na=new B,Oa=new B,Ni=new B,Oi=new B,na=new B,Ps=new B,So=new B,wo=new B,ia=new B;function pc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ia.fromArray(n,s);const r=a.x*Math.abs(ia.x)+a.y*Math.abs(ia.y)+a.z*Math.abs(ia.z),l=t.dot(ia),c=e.dot(ia),h=i.dot(ia);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const zv=new ro,Cs=new B,mc=new B;class Dr{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):zv.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cs.subVectors(t,this.center);const e=Cs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Cs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(mc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cs.copy(t.center).add(mc)),this.expandByPoint(Cs.copy(t.center).sub(mc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wi=new B,gc=new B,Eo=new B,Bi=new B,xc=new B,To=new B,vc=new B;class vh{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=wi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wi.copy(this.origin).addScaledVector(this.direction,e),wi.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){gc.copy(t).add(e).multiplyScalar(.5),Eo.copy(e).sub(t).normalize(),Bi.copy(this.origin).sub(gc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Eo),r=Bi.dot(this.direction),l=-Bi.dot(Eo),c=Bi.lengthSq(),h=Math.abs(1-o*o);let f,d,u,m;if(h>0)if(f=o*l-r,d=o*r-l,m=s*h,f>=0)if(d>=-m)if(d<=m){const _=1/h;f*=_,d*=_,u=f*(f+o*d+2*r)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-o*s+r)),d=f>0?-s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-s,-l),s),u=d*(d+2*l)+c):(f=Math.max(0,-(o*s+r)),d=f>0?s:Math.min(Math.max(-s,-l),s),u=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+r)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(gc).addScaledVector(Eo,d),u}intersectSphere(t,e){wi.subVectors(t.center,this.origin);const i=wi.dot(this.direction),a=wi.dot(wi)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),f>=0?(r=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(r=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,wi)!==null}intersectTriangle(t,e,i,a,s){xc.subVectors(e,t),To.subVectors(i,t),vc.crossVectors(xc,To);let o=this.direction.dot(vc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Bi.subVectors(this.origin,t);const l=r*this.direction.dot(To.crossVectors(Bi,To));if(l<0)return null;const c=r*this.direction.dot(xc.cross(Bi));if(c<0||l+c>o)return null;const h=-r*Bi.dot(vc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oe{constructor(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g){Oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g)}set(t,e,i,a,s,o,r,l,c,h,f,d,u,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Ba.setFromMatrixColumn(t,0).length(),s=1/Ba.setFromMatrixColumn(t,1).length(),o=1/Ba.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const d=o*h,u=o*f,m=r*h,_=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=u+m*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=m+u*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,u=l*f,m=c*h,_=c*f;e[0]=d+_*r,e[4]=m*r-u,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-r,e[2]=u*r-m,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,u=l*f,m=c*h,_=c*f;e[0]=d-_*r,e[4]=-o*f,e[8]=m+u*r,e[1]=u+m*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,u=o*f,m=r*h,_=r*f;e[0]=l*h,e[4]=m*c-u,e[8]=d*c+_,e[1]=l*f,e[5]=_*c+d,e[9]=u*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,u=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=_-d*f,e[8]=m*f+u,e[1]=f,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=u*f+m,e[10]=d-_*f}else if(t.order==="XZY"){const d=o*l,u=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+_,e[5]=o*h,e[9]=u*f-m,e[2]=m*f-u,e[6]=r*h,e[10]=_*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fv,t,Uv)}lookAt(t,e,i){const a=this.elements;return Hn.subVectors(t,e),Hn.lengthSq()===0&&(Hn.z=1),Hn.normalize(),Hi.crossVectors(i,Hn),Hi.lengthSq()===0&&(Math.abs(i.z)===1?Hn.x+=1e-4:Hn.z+=1e-4,Hn.normalize(),Hi.crossVectors(i,Hn)),Hi.normalize(),Ao.crossVectors(Hn,Hi),a[0]=Hi.x,a[4]=Ao.x,a[8]=Hn.x,a[1]=Hi.y,a[5]=Ao.y,a[9]=Hn.y,a[2]=Hi.z,a[6]=Ao.z,a[10]=Hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],_=i[6],g=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],E=a[4],T=a[8],b=a[12],M=a[1],R=a[5],z=a[9],I=a[13],U=a[2],C=a[6],k=a[10],G=a[14],N=a[3],Z=a[7],st=a[11],mt=a[15];return s[0]=o*S+r*M+l*U+c*N,s[4]=o*E+r*R+l*C+c*Z,s[8]=o*T+r*z+l*k+c*st,s[12]=o*b+r*I+l*G+c*mt,s[1]=h*S+f*M+d*U+u*N,s[5]=h*E+f*R+d*C+u*Z,s[9]=h*T+f*z+d*k+u*st,s[13]=h*b+f*I+d*G+u*mt,s[2]=m*S+_*M+g*U+p*N,s[6]=m*E+_*R+g*C+p*Z,s[10]=m*T+_*z+g*k+p*st,s[14]=m*b+_*I+g*G+p*mt,s[3]=y*S+x*M+v*U+w*N,s[7]=y*E+x*R+v*C+w*Z,s[11]=y*T+x*z+v*k+w*st,s[15]=y*b+x*I+v*G+w*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],u=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*l*f-a*c*f-s*r*d+i*c*d+a*r*u-i*l*u)+_*(+e*l*u-e*c*d+s*o*d-a*o*u+a*c*h-s*l*h)+g*(+e*c*f-e*r*u-s*o*f+i*o*u+s*r*h-i*c*h)+p*(-a*r*h-e*l*f+e*r*d+a*o*f-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],_=t[13],g=t[14],p=t[15],y=f*g*c-_*d*c+_*l*u-r*g*u-f*l*p+r*d*p,x=m*d*c-h*g*c-m*l*u+o*g*u+h*l*p-o*d*p,v=h*_*c-m*f*c+m*r*u-o*_*u-h*r*p+o*f*p,w=m*f*l-h*_*l-m*r*d+o*_*d+h*r*g-o*f*g,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=y*E,t[1]=(_*d*s-f*g*s-_*a*u+i*g*u+f*a*p-i*d*p)*E,t[2]=(r*g*s-_*l*s+_*a*c-i*g*c-r*a*p+i*l*p)*E,t[3]=(f*l*s-r*d*s-f*a*c+i*d*c+r*a*u-i*l*u)*E,t[4]=x*E,t[5]=(h*g*s-m*d*s+m*a*u-e*g*u-h*a*p+e*d*p)*E,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*u+e*l*u)*E,t[8]=v*E,t[9]=(m*f*s-h*_*s-m*i*u+e*_*u+h*i*p-e*f*p)*E,t[10]=(o*_*s-m*r*s+m*i*c-e*_*c-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*f*s-h*i*c+e*f*c+o*i*u-e*r*u)*E,t[12]=w*E,t[13]=(h*_*a-m*f*a+m*i*d-e*_*d-h*i*g+e*f*g)*E,t[14]=(m*r*a-o*_*a-m*i*l+e*_*l+o*i*g-e*r*g)*E,t[15]=(o*f*a-h*r*a+h*i*l-e*f*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,f=r+r,d=s*c,u=s*h,m=s*f,_=o*h,g=o*f,p=r*f,y=l*c,x=l*h,v=l*f,w=i.x,S=i.y,E=i.z;return a[0]=(1-(_+p))*w,a[1]=(u+v)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(u-v)*S,a[5]=(1-(d+p))*S,a[6]=(g+y)*S,a[7]=0,a[8]=(m+x)*E,a[9]=(g-y)*E,a[10]=(1-(d+_))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Ba.set(a[0],a[1],a[2]).length();const o=Ba.set(a[4],a[5],a[6]).length(),r=Ba.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ni.copy(this);const c=1/s,h=1/o,f=1/r;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=h,ni.elements[5]*=h,ni.elements[6]*=h,ni.elements[8]*=f,ni.elements[9]*=f,ni.elements[10]*=f,e.setFromRotationMatrix(ni),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Di){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),f=(e+t)/(e-t),d=(i+a)/(i-a);let u,m;if(r===Di)u=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===yr)u=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=u,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Di){const l=this.elements,c=1/(e-t),h=1/(i-a),f=1/(o-s),d=(e+t)*c,u=(i+a)*h;let m,_;if(r===Di)m=(o+s)*f,_=-2*f;else if(r===yr)m=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-u,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ba=new B,ni=new Oe,Fv=new B(0,0,0),Uv=new B(1,1,1),Hi=new B,Ao=new B,Hn=new B,qd=new Oe,jd=new oo;class yi{constructor(t=0,e=0,i=0,a=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],f=a[2],d=a[6],u=a[10];switch(e){case"XYZ":this._y=Math.asin(pn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-pn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(pn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(r,u));break;case"XZY":this._z=Math.asin(-pn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return qd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(qd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return jd.setFromEuler(this),this.setFromQuaternion(jd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class yh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Nv=0;const Kd=new B,Ha=new oo,Ei=new Oe,Ro=new B,Ls=new B,Ov=new B,Bv=new oo,Jd=new B(1,0,0),Qd=new B(0,1,0),tu=new B(0,0,1),eu={type:"added"},Hv={type:"removed"},Ga={type:"childadded",child:null},yc={type:"childremoved",child:null};class qe extends xs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nv++}),this.uuid=vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=qe.DEFAULT_UP.clone();const t=new B,e=new yi,i=new oo,a=new B(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Oe},normalMatrix:{value:new me}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=qe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ha.setFromAxisAngle(t,e),this.quaternion.multiply(Ha),this}rotateOnWorldAxis(t,e){return Ha.setFromAxisAngle(t,e),this.quaternion.premultiply(Ha),this}rotateX(t){return this.rotateOnAxis(Jd,t)}rotateY(t){return this.rotateOnAxis(Qd,t)}rotateZ(t){return this.rotateOnAxis(tu,t)}translateOnAxis(t,e){return Kd.copy(t).applyQuaternion(this.quaternion),this.position.add(Kd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Jd,t)}translateY(t){return this.translateOnAxis(Qd,t)}translateZ(t){return this.translateOnAxis(tu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Ro.copy(t):Ro.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Ls,Ro,this.up):Ei.lookAt(Ro,Ls,this.up),this.quaternion.setFromRotationMatrix(Ei),a&&(Ei.extractRotation(a.matrixWorld),Ha.setFromRotationMatrix(Ei),this.quaternion.premultiply(Ha.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(eu),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Hv),yc.child=t,this.dispatchEvent(yc),yc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ei.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ei),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(eu),Ga.child=t,this.dispatchEvent(Ga),Ga.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,t,Ov),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,Bv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),u=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}qe.DEFAULT_UP=new B(0,1,0);qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new B,Ti=new B,_c=new B,Ai=new B,Va=new B,Xa=new B,nu=new B,Mc=new B,bc=new B,Sc=new B,wc=new Ke,Ec=new Ke,Tc=new Ke;class Wn{constructor(t=new B,e=new B,i=new B){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),ii.subVectors(t,e),a.cross(ii);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){ii.subVectors(a,e),Ti.subVectors(i,e),_c.subVectors(t,e);const o=ii.dot(ii),r=ii.dot(Ti),l=ii.dot(_c),c=Ti.dot(Ti),h=Ti.dot(_c),f=o*c-r*r;if(f===0)return s.set(0,0,0),null;const d=1/f,u=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-u-m,m,u)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(r,Ai.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return wc.setScalar(0),Ec.setScalar(0),Tc.setScalar(0),wc.fromBufferAttribute(t,e),Ec.fromBufferAttribute(t,i),Tc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(wc,s.x),o.addScaledVector(Ec,s.y),o.addScaledVector(Tc,s.z),o}static isFrontFacing(t,e,i,a){return ii.subVectors(i,e),Ti.subVectors(t,e),ii.cross(Ti).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ii.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),ii.cross(Ti).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Wn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Va.subVectors(a,i),Xa.subVectors(s,i),Mc.subVectors(t,i);const l=Va.dot(Mc),c=Xa.dot(Mc);if(l<=0&&c<=0)return e.copy(i);bc.subVectors(t,a);const h=Va.dot(bc),f=Xa.dot(bc);if(h>=0&&f<=h)return e.copy(a);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(Va,o);Sc.subVectors(t,s);const u=Va.dot(Sc),m=Xa.dot(Sc);if(m>=0&&u<=m)return e.copy(s);const _=u*c-l*m;if(_<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(Xa,r);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return nu.subVectors(s,a),r=(f-h)/(f-h+(u-m)),e.copy(a).addScaledVector(nu,r);const p=1/(g+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(Va,o).addScaledVector(Xa,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},Po={h:0,s:0,l:0};function Ac(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ae{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Cn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ee.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Ee.workingColorSpace){return this.r=t,this.g=e,this.b=i,Ee.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Ee.workingColorSpace){if(t=xh(t,1),e=pn(e,0,1),i=pn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Ac(o,s,t+1/3),this.g=Ac(o,s,t),this.b=Ac(o,s,t-1/3)}return Ee.toWorkingColorSpace(this,a),this}setStyle(t,e=Cn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Cn){const i=Jf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}copyLinearToSRGB(t){return this.r=rs(t.r),this.g=rs(t.g),this.b=rs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Cn){return Ee.fromWorkingColorSpace(Mn.copy(this),t),Math.round(pn(Mn.r*255,0,255))*65536+Math.round(pn(Mn.g*255,0,255))*256+Math.round(pn(Mn.b*255,0,255))}getHexString(t=Cn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ee.workingColorSpace){Ee.fromWorkingColorSpace(Mn.copy(this),e);const i=Mn.r,a=Mn.g,s=Mn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const f=o-r;switch(c=h<=.5?f/(o+r):f/(2-o-r),o){case i:l=(a-s)/f+(a<s?6:0);break;case a:l=(s-i)/f+2;break;case s:l=(i-a)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Ee.workingColorSpace){return Ee.fromWorkingColorSpace(Mn.copy(this),e),t.r=Mn.r,t.g=Mn.g,t.b=Mn.b,t}getStyle(t=Cn){Ee.fromWorkingColorSpace(Mn.copy(this),t);const e=Mn.r,i=Mn.g,a=Mn.b;return t!==Cn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Gi),this.setHSL(Gi.h+t,Gi.s+e,Gi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Gi),t.getHSL(Po);const i=Gs(Gi.h,Po.h,e),a=Gs(Gi.s,Po.s,e),s=Gs(Gi.l,Po.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mn=new ae;ae.NAMES=Jf;let Gv=0;class Sa extends xs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gv++}),this.uuid=vi(),this.name="",this.blending=as,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sl,this.blendDst=ol,this.blendEquation=pa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ud,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=za,this.stencilZFail=za,this.stencilZPass=za,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(i.blending=this.blending),this.side!==Ki&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sl&&(i.blendSrc=this.blendSrc),this.blendDst!==ol&&(i.blendDst=this.blendDst),this.blendEquation!==pa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==hs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ud&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==za&&(i.stencilFail=this.stencilFail),this.stencilZFail!==za&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==za&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class on extends Sa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const tn=new B,Co=new Wt;class mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Xl,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Co.fromBufferAttribute(this,e),Co.applyMatrix3(t),this.setXY(e,Co.x,Co.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix3(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix4(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyNormalMatrix(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.transformDirection(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ai(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=De(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ai(e,this.array)),e}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ai(e,this.array)),e}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ai(e,this.array)),e}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ai(e,this.array)),e}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array),s=De(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Xl&&(t.usage=this.usage),t}}class Qf extends mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class tp extends mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Re extends mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Vv=0;const Yn=new Oe,Rc=new qe,Wa=new B,Gn=new ro,Ds=new ro,dn=new B;class en extends xs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vv++}),this.uuid=vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(qf(t)?tp:Qf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Yn.makeRotationFromQuaternion(t),this.applyMatrix4(Yn),this}rotateX(t){return Yn.makeRotationX(t),this.applyMatrix4(Yn),this}rotateY(t){return Yn.makeRotationY(t),this.applyMatrix4(Yn),this}rotateZ(t){return Yn.makeRotationZ(t),this.applyMatrix4(Yn),this}translate(t,e,i){return Yn.makeTranslation(t,e,i),this.applyMatrix4(Yn),this}scale(t,e,i){return Yn.makeScale(t,e,i),this.applyMatrix4(Yn),this}lookAt(t){return Rc.lookAt(t),Rc.updateMatrix(),this.applyMatrix4(Rc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wa).negate(),this.translate(Wa.x,Wa.y,Wa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Re(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ro);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Gn.setFromBufferAttribute(s),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Dr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){const i=this.boundingSphere.center;if(Gn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Ds.setFromBufferAttribute(r),this.morphTargetsRelative?(dn.addVectors(Gn.min,Ds.min),Gn.expandByPoint(dn),dn.addVectors(Gn.max,Ds.max),Gn.expandByPoint(dn)):(Gn.expandByPoint(Ds.min),Gn.expandByPoint(Ds.max))}Gn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)dn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(dn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)dn.fromBufferAttribute(r,c),l&&(Wa.fromBufferAttribute(t,c),dn.add(Wa)),a=Math.max(a,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new B,l[T]=new B;const c=new B,h=new B,f=new B,d=new Wt,u=new Wt,m=new Wt,_=new B,g=new B;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),f.fromBufferAttribute(i,M),d.fromBufferAttribute(s,T),u.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),h.sub(c),f.sub(c),u.sub(d),m.sub(d);const R=1/(u.x*m.y-m.x*u.y);isFinite(R)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(f,-u.y).multiplyScalar(R),g.copy(f).multiplyScalar(u.x).addScaledVector(h,-m.x).multiplyScalar(R),r[T].add(_),r[b].add(_),r[M].add(_),l[T].add(g),l[b].add(g),l[M].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let T=0,b=y.length;T<b;++T){const M=y[T],R=M.start,z=M.count;for(let I=R,U=R+z;I<U;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const x=new B,v=new B,w=new B,S=new B;function E(T){w.fromBufferAttribute(a,T),S.copy(w);const b=r[T];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const R=v.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,R)}for(let T=0,b=y.length;T<b;++T){const M=y[T],R=M.start,z=M.count;for(let I=R,U=R+z;I<U;I+=3)E(t.getX(I+0)),E(t.getX(I+1)),E(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const a=new B,s=new B,o=new B,r=new B,l=new B,c=new B,h=new B,f=new B;if(t)for(let d=0,u=t.count;d<u;d+=3){const m=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=e.count;d<u;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),f.subVectors(a,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)dn.fromBufferAttribute(t,e),dn.normalize(),t.setXYZ(e,dn.x,dn.y,dn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?u=l[_]*r.data.stride+r.offset:u=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new mn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new en,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=t(d,i);l.push(u)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const iu=new Oe,aa=new vh,Lo=new Dr,au=new B,Do=new B,ko=new B,Io=new B,Pc=new B,zo=new B,su=new B,Fo=new B;class _e extends qe{constructor(t=new en,e=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){zo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],f=s[l];h!==0&&(Pc.fromBufferAttribute(f,t),o?zo.addScaledVector(Pc,h):zo.addScaledVector(Pc.sub(e),h))}e.add(zo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Lo.copy(i.boundingSphere),Lo.applyMatrix4(s),aa.copy(t.ray).recast(t.near),!(Lo.containsPoint(aa.origin)===!1&&(aa.intersectSphere(Lo,au)===null||aa.origin.distanceToSquared(au)>(t.far-t.near)**2))&&(iu.copy(s).invert(),aa.copy(t.ray).applyMatrix4(iu),!(i.boundingBox!==null&&aa.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,aa)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,u=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(r.count,Math.min(g.start+g.count,u.start+u.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),E=r.getX(v+1),T=r.getX(v+2);a=Uo(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),_=Math.min(r.count,u.start+u.count);for(let g=m,p=_;g<p;g+=3){const y=r.getX(g),x=r.getX(g+1),v=r.getX(g+2);a=Uo(this,o,t,i,c,h,f,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,u.start),x=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let v=y,w=x;v<w;v+=3){const S=v,E=v+1,T=v+2;a=Uo(this,p,t,i,c,h,f,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let g=m,p=_;g<p;g+=3){const y=g,x=g+1,v=g+2;a=Uo(this,o,t,i,c,h,f,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function Xv(n,t,e,i,a,s,o,r){let l;if(t.side===In?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Ki,r),l===null)return null;Fo.copy(r),Fo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Fo);return c<e.near||c>e.far?null:{distance:c,point:Fo.clone(),object:n}}function Uo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Do),n.getVertexPosition(l,ko),n.getVertexPosition(c,Io);const h=Xv(n,t,e,i,Do,ko,Io,su);if(h){const f=new B;Wn.getBarycoord(su,Do,ko,Io,f),a&&(h.uv=Wn.getInterpolatedAttribute(a,r,l,c,f,new Wt)),s&&(h.uv1=Wn.getInterpolatedAttribute(s,r,l,c,f,new Wt)),o&&(h.normal=Wn.getInterpolatedAttribute(o,r,l,c,f,new B),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new B,materialIndex:0};Wn.getNormal(Do,ko,Io,d.normal),h.face=d,h.barycoord=f}return h}class ri extends en{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Re(c,3)),this.setAttribute("normal",new Re(h,3)),this.setAttribute("uv",new Re(f,2));function m(_,g,p,y,x,v,w,S,E,T,b){const M=v/E,R=w/T,z=v/2,I=w/2,U=S/2,C=E+1,k=T+1;let G=0,N=0;const Z=new B;for(let st=0;st<k;st++){const mt=st*R-I;for(let dt=0;dt<C;dt++){const ft=dt*M-z;Z[_]=ft*y,Z[g]=mt*x,Z[p]=U,c.push(Z.x,Z.y,Z.z),Z[_]=0,Z[g]=0,Z[p]=S>0?1:-1,h.push(Z.x,Z.y,Z.z),f.push(dt/E),f.push(1-st/T),G+=1}}for(let st=0;st<T;st++)for(let mt=0;mt<E;mt++){const dt=d+mt+C*st,ft=d+mt+C*(st+1),at=d+(mt+1)+C*(st+1),j=d+(mt+1)+C*st;l.push(dt,ft,j),l.push(ft,at,j),N+=6}r.addGroup(u,N,b),u+=N,d+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ri(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ms(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Pn(n){const t={};for(let e=0;e<n.length;e++){const i=ms(n[e]);for(const a in i)t[a]=i[a]}return t}function Wv(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function ep(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ee.workingColorSpace}const Yv={clone:ms,merge:Pn};var $v=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ji extends Sa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$v,this.fragmentShader=Zv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ms(t.uniforms),this.uniformsGroups=Wv(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class np extends qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=Di}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vi=new B,ou=new Wt,ru=new Wt;class Zn extends np{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Js*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(os*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Js*2*Math.atan(Math.tan(os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z),Vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z)}getViewSize(t,e){return this.getViewBounds(t,ou,ru),e.subVectors(ru,ou)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(os*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ya=-90,$a=1;class qv extends qe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Zn(Ya,$a,t,e);a.layers=this.layers,this.add(a);const s=new Zn(Ya,$a,t,e);s.layers=this.layers,this.add(s);const o=new Zn(Ya,$a,t,e);o.layers=this.layers,this.add(o);const r=new Zn(Ya,$a,t,e);r.layers=this.layers,this.add(r);const l=new Zn(Ya,$a,t,e);l.layers=this.layers,this.add(l);const c=new Zn(Ya,$a,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===Di)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===yr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,f=t.getRenderTarget(),d=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(f,d,u),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class ip extends Dn{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ds,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class jv extends Ma{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new ip(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new ri(5,5,5),s=new Ji({name:"CubemapFromEquirect",uniforms:ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:In,blending:qi});s.uniforms.tEquirect.value=e;const o=new _e(a,s),r=e.minFilter;return e.minFilter===xa&&(e.minFilter=gi),new qv(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Cc=new B,Kv=new B,Jv=new me;class da{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Cc.subVectors(i,e).cross(Kv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Cc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Jv.getNormalMatrix(t),a=this.coplanarPoint(Cc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const sa=new Dr,No=new B;class _h{constructor(t=new da,e=new da,i=new da,a=new da,s=new da,o=new da){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Di){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],f=a[6],d=a[7],u=a[8],m=a[9],_=a[10],g=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-u,v-p).normalize(),i[1].setComponents(l+s,d+c,g+u,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+y).normalize(),i[3].setComponents(l-o,d-h,g-m,v-y).normalize(),i[4].setComponents(l-r,d-f,g-_,v-x).normalize(),e===Di)i[5].setComponents(l+r,d+f,g+_,v+x).normalize();else if(e===yr)i[5].setComponents(r,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),sa.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),sa.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(sa)}intersectsSprite(t){return sa.center.set(0,0,0),sa.radius=.7071067811865476,sa.applyMatrix4(t.matrixWorld),this.intersectsSphere(sa)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(No.x=a.normal.x>0?t.max.x:t.min.x,No.y=a.normal.y>0?t.max.y:t.min.y,No.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(No)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ap(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Qv(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:f}}function i(r,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,r),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],_=f[u];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,f[d]=_)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const _=f[u];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class $n extends en{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,f=t/r,d=e/l,u=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*f-s;m.push(v,-y,0),_.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;u.push(x,v,S),u.push(v,w,S)}this.setIndex(u),this.setAttribute("position",new Re(m,3)),this.setAttribute("normal",new Re(_,3)),this.setAttribute("uv",new Re(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.widthSegments,t.heightSegments)}}var ty=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ey=`#ifdef USE_ALPHAHASH
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
#endif`,ny=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,iy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ay=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oy=`#ifdef USE_AOMAP
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
#endif`,ry=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cy=`#ifdef USE_BATCHING
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
#endif`,ly=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uy=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fy=`#ifdef USE_IRIDESCENCE
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
#endif`,py=`#ifdef USE_BUMPMAP
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
#endif`,my=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_y=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,My=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,by=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Sy=`#define PI 3.141592653589793
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
} // validated`,wy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ey=`vec3 transformedNormal = objectNormal;
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
#endif`,Ty=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ay=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ry=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Py=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cy="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ly=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Dy=`#ifdef USE_ENVMAP
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
#endif`,ky=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Iy=`#ifdef USE_ENVMAP
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
#endif`,zy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fy=`#ifdef USE_ENVMAP
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
#endif`,Uy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ny=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Oy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,By=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hy=`#ifdef USE_GRADIENTMAP
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
}`,Gy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wy=`uniform bool receiveShadow;
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
#endif`,Yy=`#ifdef USE_ENVMAP
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
#endif`,$y=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ky=`PhysicalMaterial material;
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
#endif`,Jy=`struct PhysicalMaterial {
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
}`,Qy=`
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
#endif`,t_=`#if defined( RE_IndirectDiffuse )
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
#endif`,e_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,n_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,i_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,a_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,o_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,r_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,l_=`#if defined( USE_POINTS_UV )
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
#endif`,h_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,u_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,f_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,p_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m_=`#ifdef USE_MORPHTARGETS
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
#endif`,g_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,v_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,y_=`#ifndef FLAT_SHADED
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
#endif`,M_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,b_=`#ifdef USE_NORMALMAP
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
#endif`,S_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,w_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,E_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,T_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,A_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,R_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,P_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,C_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,L_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,D_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,k_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,I_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,z_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,U_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,N_=`float getShadowMask() {
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
}`,O_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,B_=`#ifdef USE_SKINNING
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
#endif`,H_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G_=`#ifdef USE_SKINNING
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
#endif`,V_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,X_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,W_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$_=`#ifdef USE_TRANSMISSION
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
#endif`,Z_=`#ifdef USE_TRANSMISSION
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
#endif`,q_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,j_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Q_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tM=`uniform sampler2D t2D;
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
}`,eM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,iM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sM=`#include <common>
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
}`,oM=`#if DEPTH_PACKING == 3200
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
}`,rM=`#define DISTANCE
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
}`,cM=`#define DISTANCE
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
}`,lM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dM=`uniform float scale;
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
}`,uM=`uniform vec3 diffuse;
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
}`,fM=`#include <common>
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
}`,pM=`uniform vec3 diffuse;
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
}`,mM=`#define LAMBERT
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
}`,gM=`#define LAMBERT
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
}`,xM=`#define MATCAP
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
}`,vM=`#define MATCAP
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
}`,yM=`#define NORMAL
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
}`,_M=`#define NORMAL
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
}`,MM=`#define PHONG
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
}`,bM=`#define PHONG
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
}`,SM=`#define STANDARD
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
}`,wM=`#define STANDARD
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
}`,EM=`#define TOON
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
}`,TM=`#define TOON
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
}`,AM=`uniform float size;
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
}`,RM=`uniform vec3 diffuse;
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
}`,PM=`#include <common>
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
}`,CM=`uniform vec3 color;
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
}`,LM=`uniform float rotation;
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
}`,DM=`uniform vec3 diffuse;
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
}`,ge={alphahash_fragment:ty,alphahash_pars_fragment:ey,alphamap_fragment:ny,alphamap_pars_fragment:iy,alphatest_fragment:ay,alphatest_pars_fragment:sy,aomap_fragment:oy,aomap_pars_fragment:ry,batching_pars_vertex:cy,batching_vertex:ly,begin_vertex:hy,beginnormal_vertex:dy,bsdfs:uy,iridescence_fragment:fy,bumpmap_pars_fragment:py,clipping_planes_fragment:my,clipping_planes_pars_fragment:gy,clipping_planes_pars_vertex:xy,clipping_planes_vertex:vy,color_fragment:yy,color_pars_fragment:_y,color_pars_vertex:My,color_vertex:by,common:Sy,cube_uv_reflection_fragment:wy,defaultnormal_vertex:Ey,displacementmap_pars_vertex:Ty,displacementmap_vertex:Ay,emissivemap_fragment:Ry,emissivemap_pars_fragment:Py,colorspace_fragment:Cy,colorspace_pars_fragment:Ly,envmap_fragment:Dy,envmap_common_pars_fragment:ky,envmap_pars_fragment:Iy,envmap_pars_vertex:zy,envmap_physical_pars_fragment:Yy,envmap_vertex:Fy,fog_vertex:Uy,fog_pars_vertex:Ny,fog_fragment:Oy,fog_pars_fragment:By,gradientmap_pars_fragment:Hy,lightmap_pars_fragment:Gy,lights_lambert_fragment:Vy,lights_lambert_pars_fragment:Xy,lights_pars_begin:Wy,lights_toon_fragment:$y,lights_toon_pars_fragment:Zy,lights_phong_fragment:qy,lights_phong_pars_fragment:jy,lights_physical_fragment:Ky,lights_physical_pars_fragment:Jy,lights_fragment_begin:Qy,lights_fragment_maps:t_,lights_fragment_end:e_,logdepthbuf_fragment:n_,logdepthbuf_pars_fragment:i_,logdepthbuf_pars_vertex:a_,logdepthbuf_vertex:s_,map_fragment:o_,map_pars_fragment:r_,map_particle_fragment:c_,map_particle_pars_fragment:l_,metalnessmap_fragment:h_,metalnessmap_pars_fragment:d_,morphinstance_vertex:u_,morphcolor_vertex:f_,morphnormal_vertex:p_,morphtarget_pars_vertex:m_,morphtarget_vertex:g_,normal_fragment_begin:x_,normal_fragment_maps:v_,normal_pars_fragment:y_,normal_pars_vertex:__,normal_vertex:M_,normalmap_pars_fragment:b_,clearcoat_normal_fragment_begin:S_,clearcoat_normal_fragment_maps:w_,clearcoat_pars_fragment:E_,iridescence_pars_fragment:T_,opaque_fragment:A_,packing:R_,premultiplied_alpha_fragment:P_,project_vertex:C_,dithering_fragment:L_,dithering_pars_fragment:D_,roughnessmap_fragment:k_,roughnessmap_pars_fragment:I_,shadowmap_pars_fragment:z_,shadowmap_pars_vertex:F_,shadowmap_vertex:U_,shadowmask_pars_fragment:N_,skinbase_vertex:O_,skinning_pars_vertex:B_,skinning_vertex:H_,skinnormal_vertex:G_,specularmap_fragment:V_,specularmap_pars_fragment:X_,tonemapping_fragment:W_,tonemapping_pars_fragment:Y_,transmission_fragment:$_,transmission_pars_fragment:Z_,uv_pars_fragment:q_,uv_pars_vertex:j_,uv_vertex:K_,worldpos_vertex:J_,background_vert:Q_,background_frag:tM,backgroundCube_vert:eM,backgroundCube_frag:nM,cube_vert:iM,cube_frag:aM,depth_vert:sM,depth_frag:oM,distanceRGBA_vert:rM,distanceRGBA_frag:cM,equirect_vert:lM,equirect_frag:hM,linedashed_vert:dM,linedashed_frag:uM,meshbasic_vert:fM,meshbasic_frag:pM,meshlambert_vert:mM,meshlambert_frag:gM,meshmatcap_vert:xM,meshmatcap_frag:vM,meshnormal_vert:yM,meshnormal_frag:_M,meshphong_vert:MM,meshphong_frag:bM,meshphysical_vert:SM,meshphysical_frag:wM,meshtoon_vert:EM,meshtoon_frag:TM,points_vert:AM,points_frag:RM,shadow_vert:PM,shadow_frag:CM,sprite_vert:LM,sprite_frag:DM},Gt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new me}},envmap:{envMap:{value:null},envMapRotation:{value:new me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new me},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0},uvTransform:{value:new me}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}}},mi={basic:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.fog]),vertexShader:ge.meshbasic_vert,fragmentShader:ge.meshbasic_frag},lambert:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new ae(0)}}]),vertexShader:ge.meshlambert_vert,fragmentShader:ge.meshlambert_frag},phong:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:ge.meshphong_vert,fragmentShader:ge.meshphong_frag},standard:{uniforms:Pn([Gt.common,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.roughnessmap,Gt.metalnessmap,Gt.fog,Gt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag},toon:{uniforms:Pn([Gt.common,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.gradientmap,Gt.fog,Gt.lights,{emissive:{value:new ae(0)}}]),vertexShader:ge.meshtoon_vert,fragmentShader:ge.meshtoon_frag},matcap:{uniforms:Pn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,{matcap:{value:null}}]),vertexShader:ge.meshmatcap_vert,fragmentShader:ge.meshmatcap_frag},points:{uniforms:Pn([Gt.points,Gt.fog]),vertexShader:ge.points_vert,fragmentShader:ge.points_frag},dashed:{uniforms:Pn([Gt.common,Gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ge.linedashed_vert,fragmentShader:ge.linedashed_frag},depth:{uniforms:Pn([Gt.common,Gt.displacementmap]),vertexShader:ge.depth_vert,fragmentShader:ge.depth_frag},normal:{uniforms:Pn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,{opacity:{value:1}}]),vertexShader:ge.meshnormal_vert,fragmentShader:ge.meshnormal_frag},sprite:{uniforms:Pn([Gt.sprite,Gt.fog]),vertexShader:ge.sprite_vert,fragmentShader:ge.sprite_frag},background:{uniforms:{uvTransform:{value:new me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ge.background_vert,fragmentShader:ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new me}},vertexShader:ge.backgroundCube_vert,fragmentShader:ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ge.cube_vert,fragmentShader:ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ge.equirect_vert,fragmentShader:ge.equirect_frag},distanceRGBA:{uniforms:Pn([Gt.common,Gt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ge.distanceRGBA_vert,fragmentShader:ge.distanceRGBA_frag},shadow:{uniforms:Pn([Gt.lights,Gt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:ge.shadow_vert,fragmentShader:ge.shadow_frag}};mi.physical={uniforms:Pn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new me},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new me},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new me},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new me},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new me},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new me}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag};const Oo={r:0,b:0,g:0},oa=new yi,kM=new Oe;function IM(n,t,e,i,a,s,o){const r=new ae(0);let l=s===!0?0:1,c,h,f=null,d=0,u=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=m(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===Cr)?(h===void 0&&(h=new _e(new ri(1,1,1),new Ji({name:"BackgroundCubeMaterial",uniforms:ms(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),oa.copy(x.backgroundRotation),oa.x*=-1,oa.y*=-1,oa.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(oa.y*=-1,oa.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(kM.makeRotationFromEuler(oa)),h.material.toneMapped=Ee.getTransfer(v.colorSpace)!==Ie,(f!==v||d!==v.version||u!==n.toneMapping)&&(h.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new _e(new $n(2,2),new Ji({name:"BackgroundMaterial",uniforms:ms(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Ee.getTransfer(v.colorSpace)!==Ie,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||d!==v.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=v,d=v.version,u=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(Oo,ep(n)),i.buffers.color.setClear(Oo.r,Oo.g,Oo.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:g}}function zM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,R,z,I,U){let C=!1;const k=f(I,z,R);s!==k&&(s=k,c(s.object)),C=u(M,I,z,U),C&&m(M,I,z,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,v(M,R,z,I),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function f(M,R,z){const I=z.wireframe===!0;let U=i[M.id];U===void 0&&(U={},i[M.id]=U);let C=U[R.id];C===void 0&&(C={},U[R.id]=C);let k=C[I];return k===void 0&&(k=d(l()),C[I]=k),k}function d(M){const R=[],z=[],I=[];for(let U=0;U<e;U++)R[U]=0,z[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:z,attributeDivisors:I,object:M,attributes:{},index:null}}function u(M,R,z,I){const U=s.attributes,C=R.attributes;let k=0;const G=z.getAttributes();for(const N in G)if(G[N].location>=0){const st=U[N];let mt=C[N];if(mt===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),st===void 0||st.attribute!==mt||mt&&st.data!==mt.data)return!0;k++}return s.attributesNum!==k||s.index!==I}function m(M,R,z,I){const U={},C=R.attributes;let k=0;const G=z.getAttributes();for(const N in G)if(G[N].location>=0){let st=C[N];st===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(st=M.instanceColor));const mt={};mt.attribute=st,st&&st.data&&(mt.data=st.data),U[N]=mt,k++}s.attributes=U,s.attributesNum=k,s.index=I}function _(){const M=s.newAttributes;for(let R=0,z=M.length;R<z;R++)M[R]=0}function g(M){p(M,0)}function p(M,R){const z=s.newAttributes,I=s.enabledAttributes,U=s.attributeDivisors;z[M]=1,I[M]===0&&(n.enableVertexAttribArray(M),I[M]=1),U[M]!==R&&(n.vertexAttribDivisor(M,R),U[M]=R)}function y(){const M=s.newAttributes,R=s.enabledAttributes;for(let z=0,I=R.length;z<I;z++)R[z]!==M[z]&&(n.disableVertexAttribArray(z),R[z]=0)}function x(M,R,z,I,U,C,k){k===!0?n.vertexAttribIPointer(M,R,z,U,C):n.vertexAttribPointer(M,R,z,I,U,C)}function v(M,R,z,I){_();const U=I.attributes,C=z.getAttributes(),k=R.defaultAttributeValues;for(const G in C){const N=C[G];if(N.location>=0){let Z=U[G];if(Z===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor)),Z!==void 0){const st=Z.normalized,mt=Z.itemSize,dt=t.get(Z);if(dt===void 0)continue;const ft=dt.buffer,at=dt.type,j=dt.bytesPerElement,pt=at===n.INT||at===n.UNSIGNED_INT||Z.gpuType===dh;if(Z.isInterleavedBufferAttribute){const K=Z.data,Q=K.stride,q=Z.offset;if(K.isInstancedInterleavedBuffer){for(let St=0;St<N.locationSize;St++)p(N.location+St,K.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let St=0;St<N.locationSize;St++)g(N.location+St);n.bindBuffer(n.ARRAY_BUFFER,ft);for(let St=0;St<N.locationSize;St++)x(N.location+St,mt/N.locationSize,at,st,Q*j,(q+mt/N.locationSize*St)*j,pt)}else{if(Z.isInstancedBufferAttribute){for(let K=0;K<N.locationSize;K++)p(N.location+K,Z.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let K=0;K<N.locationSize;K++)g(N.location+K);n.bindBuffer(n.ARRAY_BUFFER,ft);for(let K=0;K<N.locationSize;K++)x(N.location+K,mt/N.locationSize,at,st,mt*j,mt/N.locationSize*K*j,pt)}}else if(k!==void 0){const st=k[G];if(st!==void 0)switch(st.length){case 2:n.vertexAttrib2fv(N.location,st);break;case 3:n.vertexAttrib3fv(N.location,st);break;case 4:n.vertexAttrib4fv(N.location,st);break;default:n.vertexAttrib1fv(N.location,st)}}}}y()}function w(){T();for(const M in i){const R=i[M];for(const z in R){const I=R[z];for(const U in I)h(I[U].object),delete I[U];delete R[z]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const z in R){const I=R[z];for(const U in I)h(I[U].object),delete I[U];delete R[z]}delete i[M.id]}function E(M){for(const R in i){const z=i[R];if(z[M.id]===void 0)continue;const I=z[M.id];for(const U in I)h(I[U].object),delete I[U];delete z[M.id]}}function T(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function FM(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,f){f!==0&&(n.drawArraysInstanced(i,c,h,f),e.update(h,i,f))}function r(c,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,f);let u=0;for(let m=0;m<f;m++)u+=h[m];e.update(u,i,1)}function l(c,h,f,d){if(f===0)return;const u=t.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,f);let m=0;for(let _=0;_<f;_++)m+=h[_]*d[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function UM(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==si&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===so&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Ii&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Li&&!T)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function NM(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new da,r=new me,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||a;return a=d,i=f.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(m,d,x,u);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,d,u,m){const _=f!==null?f.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=u+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=u;x!==_;++x,v+=4)o.copy(f[x]).applyMatrix4(y,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function OM(n){let t=new WeakMap;function e(o,r){return r===pl?o.mapping=ds:r===ml&&(o.mapping=us),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===pl||r===ml)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new jv(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class sp extends np{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const es=4,cu=[.125,.215,.35,.446,.526,.582],ma=20,Lc=new sp,lu=new ae;let Dc=null,kc=0,Ic=0,zc=!1;const ua=(1+Math.sqrt(5))/2,Za=1/ua,hu=[new B(-ua,Za,0),new B(ua,Za,0),new B(-Za,0,ua),new B(Za,0,ua),new B(0,ua,-Za),new B(0,ua,Za),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)];class du{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Dc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Ic=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Dc,kc,Ic),this._renderer.xr.enabled=zc,t.scissorTest=!1,Bo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ds||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Dc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Ic=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:gi,minFilter:gi,generateMipmaps:!1,type:so,format:si,colorSpace:gs,depthBuffer:!1},a=uu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BM(s)),this._blurMaterial=HM(s,t,e)}return a}_compileMaterial(t){const e=new _e(this._lodPlanes[0],t);this._renderer.compile(e,Lc)}_sceneToCubeUV(t,e,i,a){const r=new Zn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(lu),h.toneMapping=ji,h.autoClear=!1;const u=new on({name:"PMREM.Background",side:In,depthWrite:!1,depthTest:!1}),m=new _e(new ri,u);let _=!1;const g=t.background;g?g.isColor&&(u.color.copy(g),t.background=null,_=!0):(u.color.copy(lu),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Bo(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===ds||t.mapping===us;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=pu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new _e(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;Bo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Lc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=hu[(a-s-1)%hu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new _e(this._lodPlanes[a],c),d=c.uniforms,u=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*ma-1),_=s/m,g=isFinite(s)?1+Math.floor(h*_):ma;g>ma&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ma}`);const p=[];let y=0;for(let E=0;E<ma;++E){const T=E/_,b=Math.exp(-T*T/2);p.push(b),E===0?y+=b:E<g&&(y+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-es?a-x+es:0),S=4*(this._cubeSize-v);Bo(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(f,Lc)}}function BM(n){const t=[],e=[],i=[];let a=n;const s=n-es+1+cu.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-es?l=cu[o-n+es-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],u=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*u),x=new Float32Array(g*m*u),v=new Float32Array(p*m*u);for(let S=0;S<u;S++){const E=S%3*2/3-1,T=S>2?0:-1,b=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];y.set(b,_*m*S),x.set(d,g*m*S);const M=[S,S,S,S,S,S];v.set(M,p*m*S)}const w=new en;w.setAttribute("position",new mn(y,_)),w.setAttribute("uv",new mn(x,g)),w.setAttribute("faceIndex",new mn(v,p)),t.push(w),a>es&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function uu(n,t,e){const i=new Ma(n,t,e);return i.texture.mapping=Cr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Bo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function HM(n,t,e){const i=new Float32Array(ma),a=new B(0,1,0);return new Ji({name:"SphericalGaussianBlur",defines:{n:ma,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Mh(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function fu(){return new Ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mh(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function pu(){return new Ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qi,depthTest:!1,depthWrite:!1})}function Mh(){return`

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
	`}function GM(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===pl||l===ml,h=l===ds||l===us;if(c||h){let f=t.get(r);const d=f!==void 0?f.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new du(n)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),f.texture;if(f!==void 0)return f.texture;{const u=r.image;return c&&u&&u.height>0||h&&u&&a(u)?(e===null&&(e=new du(n)),f=c?e.fromEquirectangular(r):e.fromCubemap(r),f.texture.pmremVersion=r.pmremVersion,t.set(r,f),r.addEventListener("dispose",s),f.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function VM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Us("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function XM(n,t,e,i){const a={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete a[d.id];const u=s.get(d);u&&(t.remove(u),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(f,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const u=f.morphAttributes;for(const m in u){const _=u[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(f){const d=[],u=f.index,m=f.attributes.position;let _=0;if(u!==null){const y=u.array;_=u.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],E=y[x+2];d.push(w,S,S,E,E,w)}}else if(m!==void 0){const y=m.array;_=m.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const g=new(qf(d)?tp:Qf)(d,1);g.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,g)}function h(f){const d=s.get(f);if(d){const u=f.index;u!==null&&d.version<u.version&&c(f)}else c(f);return s.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function WM(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,u){n.drawElements(i,u,s,d*o),e.update(u,i,1)}function c(d,u,m){m!==0&&(n.drawElementsInstanced(i,u,s,d*o,m),e.update(u,i,m))}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=u[p];e.update(g,i,1)}function f(d,u,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,u[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,u,0,s,d,0,_,0,m);let p=0;for(let y=0;y<m;y++)p+=u[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function YM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function $M(n,t,e){const i=new WeakMap,a=new Ke;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==f){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var u=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*f),T=new Kf(E,w,S,f);T.type=Li,T.needsUpdate=!0;const b=v*4;for(let R=0;R<f;R++){const z=p[R],I=y[R],U=x[R],C=w*S*4*R;for(let k=0;k<z.count;k++){const G=k*b;m===!0&&(a.fromBufferAttribute(z,k),E[C+G+0]=a.x,E[C+G+1]=a.y,E[C+G+2]=a.z,E[C+G+3]=0),_===!0&&(a.fromBufferAttribute(I,k),E[C+G+4]=a.x,E[C+G+5]=a.y,E[C+G+6]=a.z,E[C+G+7]=0),g===!0&&(a.fromBufferAttribute(U,k),E[C+G+8]=a.x,E[C+G+9]=a.y,E[C+G+10]=a.z,E[C+G+11]=U.itemSize===4?a.w:1)}}d={count:f,texture:T,size:new Wt(w,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function ZM(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=t.get(l,h);if(a.get(f)!==c&&(t.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return f}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class op extends Dn{constructor(t,e,i,a,s,o,r,l,c,h=ss){if(h!==ss&&h!==ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ss&&(i=_a),i===void 0&&h===ps&&(i=fs),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:oi,this.minFilter=l!==void 0?l:oi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const rp=new Dn,mu=new op(1,1),cp=new Kf,lp=new Iv,hp=new ip,gu=[],xu=[],vu=new Float32Array(16),yu=new Float32Array(9),_u=new Float32Array(4);function vs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=gu[a];if(s===void 0&&(s=new Float32Array(a),gu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function rn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function cn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function kr(n,t){let e=xu[t];e===void 0&&(e=new Int32Array(t),xu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function qM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function jM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2fv(this.addr,t),cn(e,t)}}function KM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;n.uniform3fv(this.addr,t),cn(e,t)}}function JM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4fv(this.addr,t),cn(e,t)}}function QM(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;_u.set(i),n.uniformMatrix2fv(this.addr,!1,_u),cn(e,i)}}function tb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;yu.set(i),n.uniformMatrix3fv(this.addr,!1,yu),cn(e,i)}}function eb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;vu.set(i),n.uniformMatrix4fv(this.addr,!1,vu),cn(e,i)}}function nb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ib(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2iv(this.addr,t),cn(e,t)}}function ab(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3iv(this.addr,t),cn(e,t)}}function sb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4iv(this.addr,t),cn(e,t)}}function ob(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function rb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2uiv(this.addr,t),cn(e,t)}}function cb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3uiv(this.addr,t),cn(e,t)}}function lb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4uiv(this.addr,t),cn(e,t)}}function hb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(mu.compareFunction=Zf,s=mu):s=rp,e.setTexture2D(t||s,a)}function db(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||lp,a)}function ub(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||hp,a)}function fb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||cp,a)}function pb(n){switch(n){case 5126:return qM;case 35664:return jM;case 35665:return KM;case 35666:return JM;case 35674:return QM;case 35675:return tb;case 35676:return eb;case 5124:case 35670:return nb;case 35667:case 35671:return ib;case 35668:case 35672:return ab;case 35669:case 35673:return sb;case 5125:return ob;case 36294:return rb;case 36295:return cb;case 36296:return lb;case 35678:case 36198:case 36298:case 36306:case 35682:return hb;case 35679:case 36299:case 36307:return db;case 35680:case 36300:case 36308:case 36293:return ub;case 36289:case 36303:case 36311:case 36292:return fb}}function mb(n,t){n.uniform1fv(this.addr,t)}function gb(n,t){const e=vs(t,this.size,2);n.uniform2fv(this.addr,e)}function xb(n,t){const e=vs(t,this.size,3);n.uniform3fv(this.addr,e)}function vb(n,t){const e=vs(t,this.size,4);n.uniform4fv(this.addr,e)}function yb(n,t){const e=vs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function _b(n,t){const e=vs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Mb(n,t){const e=vs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function bb(n,t){n.uniform1iv(this.addr,t)}function Sb(n,t){n.uniform2iv(this.addr,t)}function wb(n,t){n.uniform3iv(this.addr,t)}function Eb(n,t){n.uniform4iv(this.addr,t)}function Tb(n,t){n.uniform1uiv(this.addr,t)}function Ab(n,t){n.uniform2uiv(this.addr,t)}function Rb(n,t){n.uniform3uiv(this.addr,t)}function Pb(n,t){n.uniform4uiv(this.addr,t)}function Cb(n,t,e){const i=this.cache,a=t.length,s=kr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||rp,s[o])}function Lb(n,t,e){const i=this.cache,a=t.length,s=kr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||lp,s[o])}function Db(n,t,e){const i=this.cache,a=t.length,s=kr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||hp,s[o])}function kb(n,t,e){const i=this.cache,a=t.length,s=kr(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||cp,s[o])}function Ib(n){switch(n){case 5126:return mb;case 35664:return gb;case 35665:return xb;case 35666:return vb;case 35674:return yb;case 35675:return _b;case 35676:return Mb;case 5124:case 35670:return bb;case 35667:case 35671:return Sb;case 35668:case 35672:return wb;case 35669:case 35673:return Eb;case 5125:return Tb;case 36294:return Ab;case 36295:return Rb;case 36296:return Pb;case 35678:case 36198:case 36298:case 36306:case 35682:return Cb;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Db;case 36289:case 36303:case 36311:case 36292:return kb}}class zb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=pb(e.type)}}class Fb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ib(e.type)}}class Ub{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Fc=/(\w+)(\])?(\[|\.)?/g;function Mu(n,t){n.seq.push(t),n.map[t.id]=t}function Nb(n,t,e){const i=n.name,a=i.length;for(Fc.lastIndex=0;;){const s=Fc.exec(i),o=Fc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Mu(e,c===void 0?new zb(r,n,t):new Fb(r,n,t));break}else{let f=e.map[r];f===void 0&&(f=new Ub(r),Mu(e,f)),e=f}}}class rr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);Nb(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function bu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Ob=37297;let Bb=0;function Hb(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const Su=new me;function Gb(n){Ee._getMatrix(Su,Ee.workingColorSpace,n);const t=`mat3( ${Su.elements.map(e=>e.toFixed(4))} )`;switch(Ee.getTransfer(n)){case Lr:return[t,"LinearTransferOETF"];case Ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function wu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+Hb(n.getShaderSource(t),o)}else return a}function Vb(n,t){const e=Gb(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Xb(n,t){let e;switch(t){case Yx:e="Linear";break;case $x:e="Reinhard";break;case Zx:e="Cineon";break;case qx:e="ACESFilmic";break;case Kx:e="AgX";break;case Jx:e="Neutral";break;case jx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ho=new B;function Wb(){Ee.getLuminanceCoefficients(Ho);const n=Ho.x.toFixed(4),t=Ho.y.toFixed(4),e=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ns).join(`
`)}function $b(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Zb(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Ns(n){return n!==""}function Eu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Tu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const qb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wl(n){return n.replace(qb,Kb)}const jb=new Map;function Kb(n,t){let e=ge[t];if(e===void 0){const i=jb.get(t);if(i!==void 0)e=ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Wl(e)}const Jb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Au(n){return n.replace(Jb,Qb)}function Qb(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Ru(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function t1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===If?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===zf?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Pi&&(t="SHADOWMAP_TYPE_VSM"),t}function e1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ds:case us:t="ENVMAP_TYPE_CUBE";break;case Cr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function n1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case us:t="ENVMAP_MODE_REFRACTION";break}return t}function i1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hh:t="ENVMAP_BLENDING_MULTIPLY";break;case Xx:t="ENVMAP_BLENDING_MIX";break;case Wx:t="ENVMAP_BLENDING_ADD";break}return t}function a1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function s1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=t1(e),c=e1(e),h=n1(e),f=i1(e),d=a1(e),u=Yb(e),m=$b(s),_=a.createProgram();let g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ns).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Ns).join(`
`),p.length>0&&(p+=`
`)):(g=[Ru(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ns).join(`
`),p=[Ru(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ji?"#define TONE_MAPPING":"",e.toneMapping!==ji?ge.tonemapping_pars_fragment:"",e.toneMapping!==ji?Xb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ge.colorspace_pars_fragment,Vb("linearToOutputTexel",e.outputColorSpace),Wb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ns).join(`
`)),o=Wl(o),o=Eu(o,e),o=Tu(o,e),r=Wl(r),r=Eu(r,e),r=Tu(r,e),o=Au(o),r=Au(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Od?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Od?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+g+o,v=y+p+r,w=bu(a,a.VERTEX_SHADER,x),S=bu(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function E(R){if(n.debug.checkShaderErrors){const z=a.getProgramInfoLog(_).trim(),I=a.getShaderInfoLog(w).trim(),U=a.getShaderInfoLog(S).trim();let C=!0,k=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const G=wu(a,w,"vertex"),N=wu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+z+`
`+G+`
`+N)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||U==="")&&(k=!1);k&&(R.diagnostics={runnable:C,programLog:z,vertexShader:{log:I,prefix:g},fragmentShader:{log:U,prefix:p}})}a.deleteShader(w),a.deleteShader(S),T=new rr(a,_),b=Zb(a,_)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,Ob)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bb++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let o1=0;class r1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new c1(t),e.set(t,i)),i}}class c1{constructor(t){this.id=o1++,this.code=t,this.usedTimes=0}}function l1(n,t,e,i,a,s,o){const r=new yh,l=new r1,c=new Set,h=[],f=a.logarithmicDepthBuffer,d=a.vertexTextures;let u=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,R,z,I){const U=z.fog,C=I.geometry,k=b.isMeshStandardMaterial?z.environment:null,G=(b.isMeshStandardMaterial?e:t).get(b.envMap||k),N=G&&G.mapping===Cr?G.image.height:null,Z=m[b.type];b.precision!==null&&(u=a.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));const st=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,mt=st!==void 0?st.length:0;let dt=0;C.morphAttributes.position!==void 0&&(dt=1),C.morphAttributes.normal!==void 0&&(dt=2),C.morphAttributes.color!==void 0&&(dt=3);let ft,at,j,pt;if(Z){const se=mi[Z];ft=se.vertexShader,at=se.fragmentShader}else ft=b.vertexShader,at=b.fragmentShader,l.update(b),j=l.getVertexShaderID(b),pt=l.getFragmentShaderID(b);const K=n.getRenderTarget(),Q=n.state.buffers.depth.getReversed(),q=I.isInstancedMesh===!0,St=I.isBatchedMesh===!0,At=!!b.map,bt=!!b.matcap,Ft=!!G,H=!!b.aoMap,ee=!!b.lightMap,yt=!!b.bumpMap,Bt=!!b.normalMap,kt=!!b.displacementMap,Dt=!!b.emissiveMap,Rt=!!b.metalnessMap,L=!!b.roughnessMap,A=b.anisotropy>0,Y=b.clearcoat>0,ht=b.dispersion>0,J=b.iridescence>0,rt=b.sheen>0,Ut=b.transmission>0,tt=A&&!!b.anisotropyMap,vt=Y&&!!b.clearcoatMap,Nt=Y&&!!b.clearcoatNormalMap,ot=Y&&!!b.clearcoatRoughnessMap,wt=J&&!!b.iridescenceMap,O=J&&!!b.iridescenceThicknessMap,ct=rt&&!!b.sheenColorMap,gt=rt&&!!b.sheenRoughnessMap,Vt=!!b.specularMap,Ot=!!b.specularColorMap,qt=!!b.specularIntensityMap,F=Ut&&!!b.transmissionMap,Pt=Ut&&!!b.thicknessMap,it=!!b.gradientMap,lt=!!b.alphaMap,Lt=b.alphaTest>0,Ct=!!b.alphaHash,Qt=!!b.extensions;let oe=ji;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(oe=n.toneMapping);const pe={shaderID:Z,shaderType:b.type,shaderName:b.name,vertexShader:ft,fragmentShader:at,defines:b.defines,customVertexShaderID:j,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:St,batchingColor:St&&I._colorsTexture!==null,instancing:q,instancingColor:q&&I.instanceColor!==null,instancingMorph:q&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?n.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:gs,alphaToCoverage:!!b.alphaToCoverage,map:At,matcap:bt,envMap:Ft,envMapMode:Ft&&G.mapping,envMapCubeUVHeight:N,aoMap:H,lightMap:ee,bumpMap:yt,normalMap:Bt,displacementMap:d&&kt,emissiveMap:Dt,normalMapObjectSpace:Bt&&b.normalMapType===nv,normalMapTangentSpace:Bt&&b.normalMapType===$f,metalnessMap:Rt,roughnessMap:L,anisotropy:A,anisotropyMap:tt,clearcoat:Y,clearcoatMap:vt,clearcoatNormalMap:Nt,clearcoatRoughnessMap:ot,dispersion:ht,iridescence:J,iridescenceMap:wt,iridescenceThicknessMap:O,sheen:rt,sheenColorMap:ct,sheenRoughnessMap:gt,specularMap:Vt,specularColorMap:Ot,specularIntensityMap:qt,transmission:Ut,transmissionMap:F,thicknessMap:Pt,gradientMap:it,opaque:b.transparent===!1&&b.blending===as&&b.alphaToCoverage===!1,alphaMap:lt,alphaTest:Lt,alphaHash:Ct,combine:b.combine,mapUv:At&&_(b.map.channel),aoMapUv:H&&_(b.aoMap.channel),lightMapUv:ee&&_(b.lightMap.channel),bumpMapUv:yt&&_(b.bumpMap.channel),normalMapUv:Bt&&_(b.normalMap.channel),displacementMapUv:kt&&_(b.displacementMap.channel),emissiveMapUv:Dt&&_(b.emissiveMap.channel),metalnessMapUv:Rt&&_(b.metalnessMap.channel),roughnessMapUv:L&&_(b.roughnessMap.channel),anisotropyMapUv:tt&&_(b.anisotropyMap.channel),clearcoatMapUv:vt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:O&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:gt&&_(b.sheenRoughnessMap.channel),specularMapUv:Vt&&_(b.specularMap.channel),specularColorMapUv:Ot&&_(b.specularColorMap.channel),specularIntensityMapUv:qt&&_(b.specularIntensityMap.channel),transmissionMapUv:F&&_(b.transmissionMap.channel),thicknessMapUv:Pt&&_(b.thicknessMap.channel),alphaMapUv:lt&&_(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Bt||A),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!C.attributes.uv&&(At||lt),fog:!!U,useFog:b.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Q,skinning:I.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:dt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:At&&b.map.isVideoTexture===!0&&Ee.getTransfer(b.map.colorSpace)===Ie,decodeVideoTextureEmissive:Dt&&b.emissiveMap.isVideoTexture===!0&&Ee.getTransfer(b.emissiveMap.colorSpace)===Ie,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===$e,flipSided:b.side===In,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Qt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&b.extensions.multiDraw===!0||St)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(y(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function y(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=m[b.type];let R;if(M){const z=mi[M];R=Yv.clone(z.uniforms)}else R=b.uniforms;return R}function w(b,M){let R;for(let z=0,I=h.length;z<I;z++){const U=h[z];if(U.cacheKey===M){R=U,++R.usedTimes;break}}return R===void 0&&(R=new s1(n,M,b,s),h.push(R)),R}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function E(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function h1(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function d1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Pu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Cu(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(f,d,u,m,_,g){let p=n[t];return p===void 0?(p={id:f.id,object:f,geometry:d,material:u,groupOrder:m,renderOrder:f.renderOrder,z:_,group:g},n[t]=p):(p.id=f.id,p.object=f,p.geometry=d,p.material=u,p.groupOrder=m,p.renderOrder=f.renderOrder,p.z=_,p.group=g),t++,p}function r(f,d,u,m,_,g){const p=o(f,d,u,m,_,g);u.transmission>0?i.push(p):u.transparent===!0?a.push(p):e.push(p)}function l(f,d,u,m,_,g){const p=o(f,d,u,m,_,g);u.transmission>0?i.unshift(p):u.transparent===!0?a.unshift(p):e.unshift(p)}function c(f,d){e.length>1&&e.sort(f||d1),i.length>1&&i.sort(d||Pu),a.length>1&&a.sort(d||Pu)}function h(){for(let f=t,d=n.length;f<d;f++){const u=n[f];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function u1(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Cu,n.set(i,[o])):a>=s.length?(o=new Cu,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function f1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new ae};break;case"SpotLight":e={position:new B,direction:new B,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new B,halfWidth:new B,halfHeight:new B};break}return n[t.id]=e,e}}}function p1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let m1=0;function g1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function x1(n){const t=new f1,e=p1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);const a=new B,s=new Oe,o=new Oe;function r(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let u=0,m=0,_=0,g=0,p=0,y=0,x=0,v=0,w=0,S=0,E=0;c.sort(g1);for(let b=0,M=c.length;b<M;b++){const R=c[b],z=R.color,I=R.intensity,U=R.distance,C=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=z.r*I,f+=z.g*I,d+=z.b*I;else if(R.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(R.sh.coefficients[k],I);E++}else if(R.isDirectionalLight){const k=t.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const G=R.shadow,N=e.get(R);N.shadowIntensity=G.intensity,N.shadowBias=G.bias,N.shadowNormalBias=G.normalBias,N.shadowRadius=G.radius,N.shadowMapSize=G.mapSize,i.directionalShadow[u]=N,i.directionalShadowMap[u]=C,i.directionalShadowMatrix[u]=R.shadow.matrix,y++}i.directional[u]=k,u++}else if(R.isSpotLight){const k=t.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(z).multiplyScalar(I),k.distance=U,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,i.spot[_]=k;const G=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,G.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=G.matrix,R.castShadow){const N=e.get(R);N.shadowIntensity=G.intensity,N.shadowBias=G.bias,N.shadowNormalBias=G.normalBias,N.shadowRadius=G.radius,N.shadowMapSize=G.mapSize,i.spotShadow[_]=N,i.spotShadowMap[_]=C,v++}_++}else if(R.isRectAreaLight){const k=t.get(R);k.color.copy(z).multiplyScalar(I),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=k,g++}else if(R.isPointLight){const k=t.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){const G=R.shadow,N=e.get(R);N.shadowIntensity=G.intensity,N.shadowBias=G.bias,N.shadowNormalBias=G.normalBias,N.shadowRadius=G.radius,N.shadowMapSize=G.mapSize,N.shadowCameraNear=G.camera.near,N.shadowCameraFar=G.camera.far,i.pointShadow[m]=N,i.pointShadowMap[m]=C,i.pointShadowMatrix[m]=R.shadow.matrix,x++}i.point[m]=k,m++}else if(R.isHemisphereLight){const k=t.get(R);k.skyColor.copy(R.color).multiplyScalar(I),k.groundColor.copy(R.groundColor).multiplyScalar(I),i.hemi[p]=k,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Gt.LTC_FLOAT_1,i.rectAreaLTC2=Gt.LTC_FLOAT_2):(i.rectAreaLTC1=Gt.LTC_HALF_1,i.rectAreaLTC2=Gt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==u||T.pointLength!==m||T.spotLength!==_||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==y||T.numPointShadows!==x||T.numSpotShadows!==v||T.numSpotMaps!==w||T.numLightProbes!==E)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.directionalLength=u,T.pointLength=m,T.spotLength=_,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=y,T.numPointShadows=x,T.numSpotShadows=v,T.numSpotMaps=w,T.numLightProbes=E,i.version=m1++)}function l(c,h){let f=0,d=0,u=0,m=0,_=0;const g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(x.isSpotLight){const v=i.spot[u];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function Lu(n){const t=new x1(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function v1(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Lu(n),t.set(a,[r])):s>=o.length?(r=new Lu(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class y1 extends Sa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=tv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _1 extends Sa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const M1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b1=`uniform sampler2D shadow_pass;
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
}`;function S1(n,t,e){let i=new _h;const a=new Wt,s=new Wt,o=new Ke,r=new y1({depthPacking:ev}),l=new _1,c={},h=e.maxTextureSize,f={[Ki]:In,[In]:Ki,[$e]:$e},d=new Ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:M1,fragmentShader:b1}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new en;m.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new _e(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=If;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),z=n.state;z.setBlending(qi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=p!==Pi&&this.type===Pi,U=p===Pi&&this.type!==Pi;for(let C=0,k=S.length;C<k;C++){const G=S[C],N=G.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;a.copy(N.mapSize);const Z=N.getFrameExtents();if(a.multiply(Z),s.copy(N.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/Z.x),a.x=s.x*Z.x,N.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/Z.y),a.y=s.y*Z.y,N.mapSize.y=s.y)),N.map===null||I===!0||U===!0){const mt=this.type!==Pi?{minFilter:oi,magFilter:oi}:{};N.map!==null&&N.map.dispose(),N.map=new Ma(a.x,a.y,mt),N.map.texture.name=G.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const st=N.getViewportCount();for(let mt=0;mt<st;mt++){const dt=N.getViewport(mt);o.set(s.x*dt.x,s.y*dt.y,s.x*dt.z,s.y*dt.w),z.viewport(o),N.updateMatrices(G,mt),i=N.getFrustum(),v(E,T,N.camera,G,this.type)}N.isPointLightShadow!==!0&&this.type===Pi&&y(N,T),N.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,R)};function y(S,E){const T=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,u.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ma(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,T,d,_,null),u.uniforms.shadow_pass.value=S.mapPass.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,T,u,_,null)}function x(S,E,T,b){let M=null;const R=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const z=M.uuid,I=E.uuid;let U=c[z];U===void 0&&(U={},c[z]=U);let C=U[I];C===void 0&&(C=M.clone(),U[I]=C,E.addEventListener("dispose",w)),M=C}if(M.visible=E.visible,M.wireframe=E.wireframe,b===Pi?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:f[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=n.properties.get(M);z.light=T}return M}function v(S,E,T,b,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Pi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const I=t.update(S),U=S.material;if(Array.isArray(U)){const C=I.groups;for(let k=0,G=C.length;k<G;k++){const N=C[k],Z=U[N.materialIndex];if(Z&&Z.visible){const st=x(S,Z,b,M);S.onBeforeShadow(n,S,E,T,I,st,N),n.renderBufferDirect(T,null,I,st,S,N),S.onAfterShadow(n,S,E,T,I,st,N)}}}else if(U.visible){const C=x(S,U,b,M);S.onBeforeShadow(n,S,E,T,I,C,null),n.renderBufferDirect(T,null,I,C,S,null),S.onAfterShadow(n,S,E,T,I,C,null)}}const z=S.children;for(let I=0,U=z.length;I<U;I++)v(z[I],E,T,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const b=c[T],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const w1={[rl]:cl,[ll]:ul,[hl]:fl,[hs]:dl,[cl]:rl,[ul]:ll,[fl]:hl,[dl]:hs};function E1(n,t){function e(){let F=!1;const Pt=new Ke;let it=null;const lt=new Ke(0,0,0,0);return{setMask:function(Lt){it!==Lt&&!F&&(n.colorMask(Lt,Lt,Lt,Lt),it=Lt)},setLocked:function(Lt){F=Lt},setClear:function(Lt,Ct,Qt,oe,pe){pe===!0&&(Lt*=oe,Ct*=oe,Qt*=oe),Pt.set(Lt,Ct,Qt,oe),lt.equals(Pt)===!1&&(n.clearColor(Lt,Ct,Qt,oe),lt.copy(Pt))},reset:function(){F=!1,it=null,lt.set(-1,0,0,0)}}}function i(){let F=!1,Pt=!1,it=null,lt=null,Lt=null;return{setReversed:function(Ct){if(Pt!==Ct){const Qt=t.get("EXT_clip_control");Pt?Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.ZERO_TO_ONE_EXT):Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.NEGATIVE_ONE_TO_ONE_EXT);const oe=Lt;Lt=null,this.setClear(oe)}Pt=Ct},getReversed:function(){return Pt},setTest:function(Ct){Ct?K(n.DEPTH_TEST):Q(n.DEPTH_TEST)},setMask:function(Ct){it!==Ct&&!F&&(n.depthMask(Ct),it=Ct)},setFunc:function(Ct){if(Pt&&(Ct=w1[Ct]),lt!==Ct){switch(Ct){case rl:n.depthFunc(n.NEVER);break;case cl:n.depthFunc(n.ALWAYS);break;case ll:n.depthFunc(n.LESS);break;case hs:n.depthFunc(n.LEQUAL);break;case hl:n.depthFunc(n.EQUAL);break;case dl:n.depthFunc(n.GEQUAL);break;case ul:n.depthFunc(n.GREATER);break;case fl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=Ct}},setLocked:function(Ct){F=Ct},setClear:function(Ct){Lt!==Ct&&(Pt&&(Ct=1-Ct),n.clearDepth(Ct),Lt=Ct)},reset:function(){F=!1,it=null,lt=null,Lt=null,Pt=!1}}}function a(){let F=!1,Pt=null,it=null,lt=null,Lt=null,Ct=null,Qt=null,oe=null,pe=null;return{setTest:function(se){F||(se?K(n.STENCIL_TEST):Q(n.STENCIL_TEST))},setMask:function(se){Pt!==se&&!F&&(n.stencilMask(se),Pt=se)},setFunc:function(se,Pe,Be){(it!==se||lt!==Pe||Lt!==Be)&&(n.stencilFunc(se,Pe,Be),it=se,lt=Pe,Lt=Be)},setOp:function(se,Pe,Be){(Ct!==se||Qt!==Pe||oe!==Be)&&(n.stencilOp(se,Pe,Be),Ct=se,Qt=Pe,oe=Be)},setLocked:function(se){F=se},setClear:function(se){pe!==se&&(n.clearStencil(se),pe=se)},reset:function(){F=!1,Pt=null,it=null,lt=null,Lt=null,Ct=null,Qt=null,oe=null,pe=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},f={},d=new WeakMap,u=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new ae(0,0,0),T=0,b=!1,M=null,R=null,z=null,I=null,U=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,G=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(N)[1]),k=G>=1):N.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),k=G>=2);let Z=null,st={};const mt=n.getParameter(n.SCISSOR_BOX),dt=n.getParameter(n.VIEWPORT),ft=new Ke().fromArray(mt),at=new Ke().fromArray(dt);function j(F,Pt,it,lt){const Lt=new Uint8Array(4),Ct=n.createTexture();n.bindTexture(F,Ct),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Qt=0;Qt<it;Qt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(Pt,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,Lt):n.texImage2D(Pt+Qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Lt);return Ct}const pt={};pt[n.TEXTURE_2D]=j(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=j(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=j(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=j(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),K(n.DEPTH_TEST),o.setFunc(hs),yt(!1),Bt(Id),K(n.CULL_FACE),H(qi);function K(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function Q(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function q(F,Pt){return f[F]!==Pt?(n.bindFramebuffer(F,Pt),f[F]=Pt,F===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=Pt),F===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=Pt),!0):!1}function St(F,Pt){let it=u,lt=!1;if(F){it=d.get(Pt),it===void 0&&(it=[],d.set(Pt,it));const Lt=F.textures;if(it.length!==Lt.length||it[0]!==n.COLOR_ATTACHMENT0){for(let Ct=0,Qt=Lt.length;Ct<Qt;Ct++)it[Ct]=n.COLOR_ATTACHMENT0+Ct;it.length=Lt.length,lt=!0}}else it[0]!==n.BACK&&(it[0]=n.BACK,lt=!0);lt&&n.drawBuffers(it)}function At(F){return m!==F?(n.useProgram(F),m=F,!0):!1}const bt={[pa]:n.FUNC_ADD,[Ax]:n.FUNC_SUBTRACT,[Rx]:n.FUNC_REVERSE_SUBTRACT};bt[Px]=n.MIN,bt[Cx]=n.MAX;const Ft={[Lx]:n.ZERO,[Dx]:n.ONE,[kx]:n.SRC_COLOR,[sl]:n.SRC_ALPHA,[Ox]:n.SRC_ALPHA_SATURATE,[Ux]:n.DST_COLOR,[zx]:n.DST_ALPHA,[Ix]:n.ONE_MINUS_SRC_COLOR,[ol]:n.ONE_MINUS_SRC_ALPHA,[Nx]:n.ONE_MINUS_DST_COLOR,[Fx]:n.ONE_MINUS_DST_ALPHA,[Bx]:n.CONSTANT_COLOR,[Hx]:n.ONE_MINUS_CONSTANT_COLOR,[Gx]:n.CONSTANT_ALPHA,[Vx]:n.ONE_MINUS_CONSTANT_ALPHA};function H(F,Pt,it,lt,Lt,Ct,Qt,oe,pe,se){if(F===qi){_===!0&&(Q(n.BLEND),_=!1);return}if(_===!1&&(K(n.BLEND),_=!0),F!==Tx){if(F!==g||se!==b){if((p!==pa||v!==pa)&&(n.blendEquation(n.FUNC_ADD),p=pa,v=pa),se)switch(F){case as:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.ONE,n.ONE);break;case zd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Fd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case as:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case zd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Fd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}y=null,x=null,w=null,S=null,E.set(0,0,0),T=0,g=F,b=se}return}Lt=Lt||Pt,Ct=Ct||it,Qt=Qt||lt,(Pt!==p||Lt!==v)&&(n.blendEquationSeparate(bt[Pt],bt[Lt]),p=Pt,v=Lt),(it!==y||lt!==x||Ct!==w||Qt!==S)&&(n.blendFuncSeparate(Ft[it],Ft[lt],Ft[Ct],Ft[Qt]),y=it,x=lt,w=Ct,S=Qt),(oe.equals(E)===!1||pe!==T)&&(n.blendColor(oe.r,oe.g,oe.b,pe),E.copy(oe),T=pe),g=F,b=!1}function ee(F,Pt){F.side===$e?Q(n.CULL_FACE):K(n.CULL_FACE);let it=F.side===In;Pt&&(it=!it),yt(it),F.blending===as&&F.transparent===!1?H(qi):H(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),s.setMask(F.colorWrite);const lt=F.stencilWrite;r.setTest(lt),lt&&(r.setMask(F.stencilWriteMask),r.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),r.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Dt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?K(n.SAMPLE_ALPHA_TO_COVERAGE):Q(n.SAMPLE_ALPHA_TO_COVERAGE)}function yt(F){M!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),M=F)}function Bt(F){F!==wx?(K(n.CULL_FACE),F!==R&&(F===Id?n.cullFace(n.BACK):F===Ex?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Q(n.CULL_FACE),R=F}function kt(F){F!==z&&(k&&n.lineWidth(F),z=F)}function Dt(F,Pt,it){F?(K(n.POLYGON_OFFSET_FILL),(I!==Pt||U!==it)&&(n.polygonOffset(Pt,it),I=Pt,U=it)):Q(n.POLYGON_OFFSET_FILL)}function Rt(F){F?K(n.SCISSOR_TEST):Q(n.SCISSOR_TEST)}function L(F){F===void 0&&(F=n.TEXTURE0+C-1),Z!==F&&(n.activeTexture(F),Z=F)}function A(F,Pt,it){it===void 0&&(Z===null?it=n.TEXTURE0+C-1:it=Z);let lt=st[it];lt===void 0&&(lt={type:void 0,texture:void 0},st[it]=lt),(lt.type!==F||lt.texture!==Pt)&&(Z!==it&&(n.activeTexture(it),Z=it),n.bindTexture(F,Pt||pt[F]),lt.type=F,lt.texture=Pt)}function Y(){const F=st[Z];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ht(){try{n.compressedTexImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ut(){try{n.texSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function tt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function vt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Nt(){try{n.texStorage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ot(){try{n.texStorage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function wt(){try{n.texImage2D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function O(){try{n.texImage3D.apply(n,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ct(F){ft.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),ft.copy(F))}function gt(F){at.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),at.copy(F))}function Vt(F,Pt){let it=c.get(Pt);it===void 0&&(it=new WeakMap,c.set(Pt,it));let lt=it.get(F);lt===void 0&&(lt=n.getUniformBlockIndex(Pt,F.name),it.set(F,lt))}function Ot(F,Pt){const lt=c.get(Pt).get(F);l.get(Pt)!==lt&&(n.uniformBlockBinding(Pt,lt,F.__bindingPointIndex),l.set(Pt,lt))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},Z=null,st={},f={},d=new WeakMap,u=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new ae(0,0,0),T=0,b=!1,M=null,R=null,z=null,I=null,U=null,ft.set(0,0,n.canvas.width,n.canvas.height),at.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:K,disable:Q,bindFramebuffer:q,drawBuffers:St,useProgram:At,setBlending:H,setMaterial:ee,setFlipSided:yt,setCullFace:Bt,setLineWidth:kt,setPolygonOffset:Dt,setScissorTest:Rt,activeTexture:L,bindTexture:A,unbindTexture:Y,compressedTexImage2D:ht,compressedTexImage3D:J,texImage2D:wt,texImage3D:O,updateUBOMapping:Vt,uniformBlockBinding:Ot,texStorage2D:Nt,texStorage3D:ot,texSubImage2D:rt,texSubImage3D:Ut,compressedTexSubImage2D:tt,compressedTexSubImage3D:vt,scissor:ct,viewport:gt,reset:qt}}function Du(n,t,e,i){const a=T1(i);switch(e){case Bf:return n*t;case Gf:return n*t;case Vf:return n*t*2;case Xf:return n*t/a.components*a.byteLength;case ph:return n*t/a.components*a.byteLength;case Wf:return n*t*2/a.components*a.byteLength;case mh:return n*t*2/a.components*a.byteLength;case Hf:return n*t*3/a.components*a.byteLength;case si:return n*t*4/a.components*a.byteLength;case gh:return n*t*4/a.components*a.byteLength;case nr:case ir:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ar:case sr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yl:case Ml:return Math.max(n,16)*Math.max(t,8)/4;case vl:case _l:return Math.max(n,8)*Math.max(t,8)/2;case bl:case Sl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case El:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Al:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Cl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case kl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Il:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case zl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Nl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case or:case Ol:case Bl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Yf:case Hl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Gl:case Vl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function T1(n){switch(n){case Ii:case Uf:return{byteLength:1,components:1};case Ks:case Nf:case so:return{byteLength:2,components:1};case uh:case fh:return{byteLength:2,components:4};case _a:case dh:case Li:return{byteLength:4,components:1};case Of:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function A1(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let f;const d=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,A){return u?new OffscreenCanvas(L,A):_r("canvas")}function _(L,A,Y){let ht=1;const J=Rt(L);if((J.width>Y||J.height>Y)&&(ht=Y/Math.max(J.width,J.height)),ht<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const rt=Math.floor(ht*J.width),Ut=Math.floor(ht*J.height);f===void 0&&(f=m(rt,Ut));const tt=A?m(rt,Ut):f;return tt.width=rt,tt.height=Ut,tt.getContext("2d").drawImage(L,0,0,rt,Ut),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+rt+"x"+Ut+")."),tt}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){n.generateMipmap(L)}function y(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(L,A,Y,ht,J=!1){if(L!==null){if(n[L]!==void 0)return n[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let rt=A;if(A===n.RED&&(Y===n.FLOAT&&(rt=n.R32F),Y===n.HALF_FLOAT&&(rt=n.R16F),Y===n.UNSIGNED_BYTE&&(rt=n.R8)),A===n.RED_INTEGER&&(Y===n.UNSIGNED_BYTE&&(rt=n.R8UI),Y===n.UNSIGNED_SHORT&&(rt=n.R16UI),Y===n.UNSIGNED_INT&&(rt=n.R32UI),Y===n.BYTE&&(rt=n.R8I),Y===n.SHORT&&(rt=n.R16I),Y===n.INT&&(rt=n.R32I)),A===n.RG&&(Y===n.FLOAT&&(rt=n.RG32F),Y===n.HALF_FLOAT&&(rt=n.RG16F),Y===n.UNSIGNED_BYTE&&(rt=n.RG8)),A===n.RG_INTEGER&&(Y===n.UNSIGNED_BYTE&&(rt=n.RG8UI),Y===n.UNSIGNED_SHORT&&(rt=n.RG16UI),Y===n.UNSIGNED_INT&&(rt=n.RG32UI),Y===n.BYTE&&(rt=n.RG8I),Y===n.SHORT&&(rt=n.RG16I),Y===n.INT&&(rt=n.RG32I)),A===n.RGB_INTEGER&&(Y===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),Y===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),Y===n.UNSIGNED_INT&&(rt=n.RGB32UI),Y===n.BYTE&&(rt=n.RGB8I),Y===n.SHORT&&(rt=n.RGB16I),Y===n.INT&&(rt=n.RGB32I)),A===n.RGBA_INTEGER&&(Y===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),Y===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),Y===n.UNSIGNED_INT&&(rt=n.RGBA32UI),Y===n.BYTE&&(rt=n.RGBA8I),Y===n.SHORT&&(rt=n.RGBA16I),Y===n.INT&&(rt=n.RGBA32I)),A===n.RGB&&Y===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),A===n.RGBA){const Ut=J?Lr:Ee.getTransfer(ht);Y===n.FLOAT&&(rt=n.RGBA32F),Y===n.HALF_FLOAT&&(rt=n.RGBA16F),Y===n.UNSIGNED_BYTE&&(rt=Ut===Ie?n.SRGB8_ALPHA8:n.RGBA8),Y===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),Y===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function v(L,A){let Y;return L?A===null||A===_a||A===fs?Y=n.DEPTH24_STENCIL8:A===Li?Y=n.DEPTH32F_STENCIL8:A===Ks&&(Y=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===_a||A===fs?Y=n.DEPTH_COMPONENT24:A===Li?Y=n.DEPTH_COMPONENT32F:A===Ks&&(Y=n.DEPTH_COMPONENT16),Y}function w(L,A){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==oi&&L.minFilter!==gi?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function S(L){const A=L.target;A.removeEventListener("dispose",S),T(A),A.isVideoTexture&&h.delete(A)}function E(L){const A=L.target;A.removeEventListener("dispose",E),M(A)}function T(L){const A=i.get(L);if(A.__webglInit===void 0)return;const Y=L.source,ht=d.get(Y);if(ht){const J=ht[A.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(L),Object.keys(ht).length===0&&d.delete(Y)}i.remove(L)}function b(L){const A=i.get(L);n.deleteTexture(A.__webglTexture);const Y=L.source,ht=d.get(Y);delete ht[A.__cacheKey],o.memory.textures--}function M(L){const A=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let ht=0;ht<6;ht++){if(Array.isArray(A.__webglFramebuffer[ht]))for(let J=0;J<A.__webglFramebuffer[ht].length;J++)n.deleteFramebuffer(A.__webglFramebuffer[ht][J]);else n.deleteFramebuffer(A.__webglFramebuffer[ht]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ht])}else{if(Array.isArray(A.__webglFramebuffer))for(let ht=0;ht<A.__webglFramebuffer.length;ht++)n.deleteFramebuffer(A.__webglFramebuffer[ht]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ht=0;ht<A.__webglColorRenderbuffer.length;ht++)A.__webglColorRenderbuffer[ht]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ht]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const Y=L.textures;for(let ht=0,J=Y.length;ht<J;ht++){const rt=i.get(Y[ht]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove(Y[ht])}i.remove(L)}let R=0;function z(){R=0}function I(){const L=R;return L>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+a.maxTextures),R+=1,L}function U(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function C(L,A){const Y=i.get(L);if(L.isVideoTexture&&kt(L),L.isRenderTargetTexture===!1&&L.version>0&&Y.__version!==L.version){const ht=L.image;if(ht===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ht.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(Y,L,A);return}}e.bindTexture(n.TEXTURE_2D,Y.__webglTexture,n.TEXTURE0+A)}function k(L,A){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){at(Y,L,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Y.__webglTexture,n.TEXTURE0+A)}function G(L,A){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){at(Y,L,A);return}e.bindTexture(n.TEXTURE_3D,Y.__webglTexture,n.TEXTURE0+A)}function N(L,A){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){j(Y,L,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture,n.TEXTURE0+A)}const Z={[gl]:n.REPEAT,[ga]:n.CLAMP_TO_EDGE,[xl]:n.MIRRORED_REPEAT},st={[oi]:n.NEAREST,[Qx]:n.NEAREST_MIPMAP_NEAREST,[Mo]:n.NEAREST_MIPMAP_LINEAR,[gi]:n.LINEAR,[hc]:n.LINEAR_MIPMAP_NEAREST,[xa]:n.LINEAR_MIPMAP_LINEAR},mt={[iv]:n.NEVER,[lv]:n.ALWAYS,[av]:n.LESS,[Zf]:n.LEQUAL,[sv]:n.EQUAL,[cv]:n.GEQUAL,[ov]:n.GREATER,[rv]:n.NOTEQUAL};function dt(L,A){if(A.type===Li&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===gi||A.magFilter===hc||A.magFilter===Mo||A.magFilter===xa||A.minFilter===gi||A.minFilter===hc||A.minFilter===Mo||A.minFilter===xa)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,Z[A.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,Z[A.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,Z[A.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,st[A.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,st[A.minFilter]),A.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,mt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===oi||A.minFilter!==Mo&&A.minFilter!==xa||A.type===Li&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const Y=t.get("EXT_texture_filter_anisotropic");n.texParameterf(L,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function ft(L,A){let Y=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",S));const ht=A.source;let J=d.get(ht);J===void 0&&(J={},d.set(ht,J));const rt=U(A);if(rt!==L.__cacheKey){J[rt]===void 0&&(J[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),J[rt].usedTimes++;const Ut=J[L.__cacheKey];Ut!==void 0&&(J[L.__cacheKey].usedTimes--,Ut.usedTimes===0&&b(A)),L.__cacheKey=rt,L.__webglTexture=J[rt].texture}return Y}function at(L,A,Y){let ht=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ht=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ht=n.TEXTURE_3D);const J=ft(L,A),rt=A.source;e.bindTexture(ht,L.__webglTexture,n.TEXTURE0+Y);const Ut=i.get(rt);if(rt.version!==Ut.__version||J===!0){e.activeTexture(n.TEXTURE0+Y);const tt=Ee.getPrimaries(Ee.workingColorSpace),vt=A.colorSpace===Wi?null:Ee.getPrimaries(A.colorSpace),Nt=A.colorSpace===Wi||tt===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let ot=_(A.image,!1,a.maxTextureSize);ot=Dt(A,ot);const wt=s.convert(A.format,A.colorSpace),O=s.convert(A.type);let ct=x(A.internalFormat,wt,O,A.colorSpace,A.isVideoTexture);dt(ht,A);let gt;const Vt=A.mipmaps,Ot=A.isVideoTexture!==!0,qt=Ut.__version===void 0||J===!0,F=rt.dataReady,Pt=w(A,ot);if(A.isDepthTexture)ct=v(A.format===ps,A.type),qt&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,ct,ot.width,ot.height):e.texImage2D(n.TEXTURE_2D,0,ct,ot.width,ot.height,0,wt,O,null));else if(A.isDataTexture)if(Vt.length>0){Ot&&qt&&e.texStorage2D(n.TEXTURE_2D,Pt,ct,Vt[0].width,Vt[0].height);for(let it=0,lt=Vt.length;it<lt;it++)gt=Vt[it],Ot?F&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,gt.width,gt.height,wt,O,gt.data):e.texImage2D(n.TEXTURE_2D,it,ct,gt.width,gt.height,0,wt,O,gt.data);A.generateMipmaps=!1}else Ot?(qt&&e.texStorage2D(n.TEXTURE_2D,Pt,ct,ot.width,ot.height),F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,ot.width,ot.height,wt,O,ot.data)):e.texImage2D(n.TEXTURE_2D,0,ct,ot.width,ot.height,0,wt,O,ot.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ot&&qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Pt,ct,Vt[0].width,Vt[0].height,ot.depth);for(let it=0,lt=Vt.length;it<lt;it++)if(gt=Vt[it],A.format!==si)if(wt!==null)if(Ot){if(F)if(A.layerUpdates.size>0){const Lt=Du(gt.width,gt.height,A.format,A.type);for(const Ct of A.layerUpdates){const Qt=gt.data.subarray(Ct*Lt/gt.data.BYTES_PER_ELEMENT,(Ct+1)*Lt/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,Ct,gt.width,gt.height,1,wt,Qt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,gt.width,gt.height,ot.depth,wt,gt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,it,ct,gt.width,gt.height,ot.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,it,0,0,0,gt.width,gt.height,ot.depth,wt,O,gt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,it,ct,gt.width,gt.height,ot.depth,0,wt,O,gt.data)}else{Ot&&qt&&e.texStorage2D(n.TEXTURE_2D,Pt,ct,Vt[0].width,Vt[0].height);for(let it=0,lt=Vt.length;it<lt;it++)gt=Vt[it],A.format!==si?wt!==null?Ot?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,it,0,0,gt.width,gt.height,wt,gt.data):e.compressedTexImage2D(n.TEXTURE_2D,it,ct,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?F&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,gt.width,gt.height,wt,O,gt.data):e.texImage2D(n.TEXTURE_2D,it,ct,gt.width,gt.height,0,wt,O,gt.data)}else if(A.isDataArrayTexture)if(Ot){if(qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Pt,ct,ot.width,ot.height,ot.depth),F)if(A.layerUpdates.size>0){const it=Du(ot.width,ot.height,A.format,A.type);for(const lt of A.layerUpdates){const Lt=ot.data.subarray(lt*it/ot.data.BYTES_PER_ELEMENT,(lt+1)*it/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,ot.width,ot.height,1,wt,O,Lt)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,wt,O,ot.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,ot.width,ot.height,ot.depth,0,wt,O,ot.data);else if(A.isData3DTexture)Ot?(qt&&e.texStorage3D(n.TEXTURE_3D,Pt,ct,ot.width,ot.height,ot.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,wt,O,ot.data)):e.texImage3D(n.TEXTURE_3D,0,ct,ot.width,ot.height,ot.depth,0,wt,O,ot.data);else if(A.isFramebufferTexture){if(qt)if(Ot)e.texStorage2D(n.TEXTURE_2D,Pt,ct,ot.width,ot.height);else{let it=ot.width,lt=ot.height;for(let Lt=0;Lt<Pt;Lt++)e.texImage2D(n.TEXTURE_2D,Lt,ct,it,lt,0,wt,O,null),it>>=1,lt>>=1}}else if(Vt.length>0){if(Ot&&qt){const it=Rt(Vt[0]);e.texStorage2D(n.TEXTURE_2D,Pt,ct,it.width,it.height)}for(let it=0,lt=Vt.length;it<lt;it++)gt=Vt[it],Ot?F&&e.texSubImage2D(n.TEXTURE_2D,it,0,0,wt,O,gt):e.texImage2D(n.TEXTURE_2D,it,ct,wt,O,gt);A.generateMipmaps=!1}else if(Ot){if(qt){const it=Rt(ot);e.texStorage2D(n.TEXTURE_2D,Pt,ct,it.width,it.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,wt,O,ot)}else e.texImage2D(n.TEXTURE_2D,0,ct,wt,O,ot);g(A)&&p(ht),Ut.__version=rt.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function j(L,A,Y){if(A.image.length!==6)return;const ht=ft(L,A),J=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+Y);const rt=i.get(J);if(J.version!==rt.__version||ht===!0){e.activeTexture(n.TEXTURE0+Y);const Ut=Ee.getPrimaries(Ee.workingColorSpace),tt=A.colorSpace===Wi?null:Ee.getPrimaries(A.colorSpace),vt=A.colorSpace===Wi||Ut===tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Nt=A.isCompressedTexture||A.image[0].isCompressedTexture,ot=A.image[0]&&A.image[0].isDataTexture,wt=[];for(let lt=0;lt<6;lt++)!Nt&&!ot?wt[lt]=_(A.image[lt],!0,a.maxCubemapSize):wt[lt]=ot?A.image[lt].image:A.image[lt],wt[lt]=Dt(A,wt[lt]);const O=wt[0],ct=s.convert(A.format,A.colorSpace),gt=s.convert(A.type),Vt=x(A.internalFormat,ct,gt,A.colorSpace),Ot=A.isVideoTexture!==!0,qt=rt.__version===void 0||ht===!0,F=J.dataReady;let Pt=w(A,O);dt(n.TEXTURE_CUBE_MAP,A);let it;if(Nt){Ot&&qt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Pt,Vt,O.width,O.height);for(let lt=0;lt<6;lt++){it=wt[lt].mipmaps;for(let Lt=0;Lt<it.length;Lt++){const Ct=it[Lt];A.format!==si?ct!==null?Ot?F&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,0,0,Ct.width,Ct.height,ct,Ct.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,Vt,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,0,0,Ct.width,Ct.height,ct,gt,Ct.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,Vt,Ct.width,Ct.height,0,ct,gt,Ct.data)}}}else{if(it=A.mipmaps,Ot&&qt){it.length>0&&Pt++;const lt=Rt(wt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Pt,Vt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(ot){Ot?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,wt[lt].width,wt[lt].height,ct,gt,wt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Vt,wt[lt].width,wt[lt].height,0,ct,gt,wt[lt].data);for(let Lt=0;Lt<it.length;Lt++){const Qt=it[Lt].image[lt].image;Ot?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,0,0,Qt.width,Qt.height,ct,gt,Qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,Vt,Qt.width,Qt.height,0,ct,gt,Qt.data)}}else{Ot?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,ct,gt,wt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Vt,ct,gt,wt[lt]);for(let Lt=0;Lt<it.length;Lt++){const Ct=it[Lt];Ot?F&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,0,0,ct,gt,Ct.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,Vt,ct,gt,Ct.image[lt])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),rt.__version=J.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function pt(L,A,Y,ht,J,rt){const Ut=s.convert(Y.format,Y.colorSpace),tt=s.convert(Y.type),vt=x(Y.internalFormat,Ut,tt,Y.colorSpace),Nt=i.get(A),ot=i.get(Y);if(ot.__renderTarget=A,!Nt.__hasExternalTextures){const wt=Math.max(1,A.width>>rt),O=Math.max(1,A.height>>rt);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?e.texImage3D(J,rt,vt,wt,O,A.depth,0,Ut,tt,null):e.texImage2D(J,rt,vt,wt,O,0,Ut,tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,L),Bt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ht,J,ot.__webglTexture,0,yt(A)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ht,J,ot.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(L,A,Y){if(n.bindRenderbuffer(n.RENDERBUFFER,L),A.depthBuffer){const ht=A.depthTexture,J=ht&&ht.isDepthTexture?ht.type:null,rt=v(A.stencilBuffer,J),Ut=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=yt(A);Bt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,tt,rt,A.width,A.height):Y?n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,rt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,rt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ut,n.RENDERBUFFER,L)}else{const ht=A.textures;for(let J=0;J<ht.length;J++){const rt=ht[J],Ut=s.convert(rt.format,rt.colorSpace),tt=s.convert(rt.type),vt=x(rt.internalFormat,Ut,tt,rt.colorSpace),Nt=yt(A);Y&&Bt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Nt,vt,A.width,A.height):Bt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Nt,vt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,vt,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Q(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ht=i.get(A.depthTexture);ht.__renderTarget=A,(!ht.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),C(A.depthTexture,0);const J=ht.__webglTexture,rt=yt(A);if(A.depthTexture.format===ss)Bt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(A.depthTexture.format===ps)Bt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function q(L){const A=i.get(L),Y=L.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==L.depthTexture){const ht=L.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ht){const J=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ht.removeEventListener("dispose",J)};ht.addEventListener("dispose",J),A.__depthDisposeCallback=J}A.__boundDepthTexture=ht}if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");Q(A.__webglFramebuffer,L)}else if(Y){A.__webglDepthbuffer=[];for(let ht=0;ht<6;ht++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ht]),A.__webglDepthbuffer[ht]===void 0)A.__webglDepthbuffer[ht]=n.createRenderbuffer(),K(A.__webglDepthbuffer[ht],L,!1);else{const J=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=A.__webglDepthbuffer[ht];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),K(A.__webglDepthbuffer,L,!1);else{const ht=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,ht,n.RENDERBUFFER,J)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function St(L,A,Y){const ht=i.get(L);A!==void 0&&pt(ht.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Y!==void 0&&q(L)}function At(L){const A=L.texture,Y=i.get(L),ht=i.get(A);L.addEventListener("dispose",E);const J=L.textures,rt=L.isWebGLCubeRenderTarget===!0,Ut=J.length>1;if(Ut||(ht.__webglTexture===void 0&&(ht.__webglTexture=n.createTexture()),ht.__version=A.version,o.memory.textures++),rt){Y.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0){Y.__webglFramebuffer[tt]=[];for(let vt=0;vt<A.mipmaps.length;vt++)Y.__webglFramebuffer[tt][vt]=n.createFramebuffer()}else Y.__webglFramebuffer[tt]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){Y.__webglFramebuffer=[];for(let tt=0;tt<A.mipmaps.length;tt++)Y.__webglFramebuffer[tt]=n.createFramebuffer()}else Y.__webglFramebuffer=n.createFramebuffer();if(Ut)for(let tt=0,vt=J.length;tt<vt;tt++){const Nt=i.get(J[tt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&Bt(L)===!1){Y.__webglMultisampledFramebuffer=n.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let tt=0;tt<J.length;tt++){const vt=J[tt];Y.__webglColorRenderbuffer[tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Y.__webglColorRenderbuffer[tt]);const Nt=s.convert(vt.format,vt.colorSpace),ot=s.convert(vt.type),wt=x(vt.internalFormat,Nt,ot,vt.colorSpace,L.isXRRenderTarget===!0),O=yt(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,O,wt,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+tt,n.RENDERBUFFER,Y.__webglColorRenderbuffer[tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(Y.__webglDepthRenderbuffer=n.createRenderbuffer(),K(Y.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,ht.__webglTexture),dt(n.TEXTURE_CUBE_MAP,A);for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0)for(let vt=0;vt<A.mipmaps.length;vt++)pt(Y.__webglFramebuffer[tt][vt],L,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,vt);else pt(Y.__webglFramebuffer[tt],L,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ut){for(let tt=0,vt=J.length;tt<vt;tt++){const Nt=J[tt],ot=i.get(Nt);e.bindTexture(n.TEXTURE_2D,ot.__webglTexture),dt(n.TEXTURE_2D,Nt),pt(Y.__webglFramebuffer,L,Nt,n.COLOR_ATTACHMENT0+tt,n.TEXTURE_2D,0),g(Nt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let tt=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(tt=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(tt,ht.__webglTexture),dt(tt,A),A.mipmaps&&A.mipmaps.length>0)for(let vt=0;vt<A.mipmaps.length;vt++)pt(Y.__webglFramebuffer[vt],L,A,n.COLOR_ATTACHMENT0,tt,vt);else pt(Y.__webglFramebuffer,L,A,n.COLOR_ATTACHMENT0,tt,0);g(A)&&p(tt),e.unbindTexture()}L.depthBuffer&&q(L)}function bt(L){const A=L.textures;for(let Y=0,ht=A.length;Y<ht;Y++){const J=A[Y];if(g(J)){const rt=y(L),Ut=i.get(J).__webglTexture;e.bindTexture(rt,Ut),p(rt),e.unbindTexture()}}}const Ft=[],H=[];function ee(L){if(L.samples>0){if(Bt(L)===!1){const A=L.textures,Y=L.width,ht=L.height;let J=n.COLOR_BUFFER_BIT;const rt=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ut=i.get(L),tt=A.length>1;if(tt)for(let vt=0;vt<A.length;vt++)e.bindFramebuffer(n.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ut.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ut.__webglFramebuffer);for(let vt=0;vt<A.length;vt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ut.__webglColorRenderbuffer[vt]);const Nt=i.get(A[vt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Nt,0)}n.blitFramebuffer(0,0,Y,ht,0,0,Y,ht,J,n.NEAREST),l===!0&&(Ft.length=0,H.length=0,Ft.push(n.COLOR_ATTACHMENT0+vt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Ft.push(rt),H.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,H)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ft))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),tt)for(let vt=0;vt<A.length;vt++){e.bindFramebuffer(n.FRAMEBUFFER,Ut.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,Ut.__webglColorRenderbuffer[vt]);const Nt=i.get(A[vt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ut.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.TEXTURE_2D,Nt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ut.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&l){const A=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function yt(L){return Math.min(a.maxSamples,L.samples)}function Bt(L){const A=i.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function kt(L){const A=o.render.frame;h.get(L)!==A&&(h.set(L,A),L.update())}function Dt(L,A){const Y=L.colorSpace,ht=L.format,J=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||Y!==gs&&Y!==Wi&&(Ee.getTransfer(Y)===Ie?(ht!==si||J!==Ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),A}function Rt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=C,this.setTexture2DArray=k,this.setTexture3D=G,this.setTextureCube=N,this.rebindTextures=St,this.setupRenderTarget=At,this.updateRenderTargetMipmap=bt,this.updateMultisampleRenderTarget=ee,this.setupDepthRenderbuffer=q,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Bt}function R1(n,t){function e(i,a=Wi){let s;const o=Ee.getTransfer(a);if(i===Ii)return n.UNSIGNED_BYTE;if(i===uh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===fh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Of)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Uf)return n.BYTE;if(i===Nf)return n.SHORT;if(i===Ks)return n.UNSIGNED_SHORT;if(i===dh)return n.INT;if(i===_a)return n.UNSIGNED_INT;if(i===Li)return n.FLOAT;if(i===so)return n.HALF_FLOAT;if(i===Bf)return n.ALPHA;if(i===Hf)return n.RGB;if(i===si)return n.RGBA;if(i===Gf)return n.LUMINANCE;if(i===Vf)return n.LUMINANCE_ALPHA;if(i===ss)return n.DEPTH_COMPONENT;if(i===ps)return n.DEPTH_STENCIL;if(i===Xf)return n.RED;if(i===ph)return n.RED_INTEGER;if(i===Wf)return n.RG;if(i===mh)return n.RG_INTEGER;if(i===gh)return n.RGBA_INTEGER;if(i===nr||i===ir||i===ar||i===sr)if(o===Ie)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===nr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ir)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ar)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===sr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===nr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ir)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ar)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===sr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vl||i===yl||i===_l||i===Ml)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===vl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===_l)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ml)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bl||i===Sl||i===wl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===bl||i===Sl)return o===Ie?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===wl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===El||i===Tl||i===Al||i===Rl||i===Pl||i===Cl||i===Ll||i===Dl||i===kl||i===Il||i===zl||i===Fl||i===Ul||i===Nl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===El)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Tl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Al)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Cl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ll)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===kl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Il)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ul)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Nl)return o===Ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===or||i===Ol||i===Bl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===or)return o===Ie?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ol)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Bl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yf||i===Hl||i===Gl||i===Vl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===or)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Hl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Gl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===fs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class P1 extends Zn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ze extends qe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const C1={type:"move"};class Uc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ze,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ze,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ze,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(C1)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ze;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const L1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,D1=`
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

}`;class k1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Dn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Ji({vertexShader:L1,fragmentShader:D1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new _e(new $n(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class I1 extends xs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const _=new k1,g=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new Wt;let S=null;const E=new Zn;E.viewport=new Ke;const T=new Zn;T.viewport=new Ke;const b=[E,T],M=new P1;let R=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(at){let j=x[at];return j===void 0&&(j=new Uc,x[at]=j),j.getTargetRaySpace()},this.getControllerGrip=function(at){let j=x[at];return j===void 0&&(j=new Uc,x[at]=j),j.getGripSpace()},this.getHand=function(at){let j=x[at];return j===void 0&&(j=new Uc,x[at]=j),j.getHandSpace()};function I(at){const j=v.indexOf(at.inputSource);if(j===-1)return;const pt=x[j];pt!==void 0&&(pt.update(at.inputSource,at.frame,c||o),pt.dispatchEvent({type:at.type,data:at.inputSource}))}function U(){a.removeEventListener("select",I),a.removeEventListener("selectstart",I),a.removeEventListener("selectend",I),a.removeEventListener("squeeze",I),a.removeEventListener("squeezestart",I),a.removeEventListener("squeezeend",I),a.removeEventListener("end",U),a.removeEventListener("inputsourceschange",C);for(let at=0;at<x.length;at++){const j=v[at];j!==null&&(v[at]=null,x[at].disconnect(j))}R=null,z=null,_.reset(),t.setRenderTarget(p),u=null,d=null,f=null,a=null,y=null,ft.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(at){s=at,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(at){r=at,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(at){c=at},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(at){if(a=at,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",I),a.addEventListener("selectstart",I),a.addEventListener("selectend",I),a.addEventListener("squeeze",I),a.addEventListener("squeezestart",I),a.addEventListener("squeezeend",I),a.addEventListener("end",U),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const j={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(a,e,j),a.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new Ma(u.framebufferWidth,u.framebufferHeight,{format:si,type:Ii,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let j=null,pt=null,K=null;g.depth&&(K=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=g.stencil?ps:ss,pt=g.stencil?fs:_a);const Q={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:s};f=new XRWebGLBinding(a,e),d=f.createProjectionLayer(Q),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ma(d.textureWidth,d.textureHeight,{format:si,type:Ii,depthTexture:new op(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),ft.setContext(a),ft.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function C(at){for(let j=0;j<at.removed.length;j++){const pt=at.removed[j],K=v.indexOf(pt);K>=0&&(v[K]=null,x[K].disconnect(pt))}for(let j=0;j<at.added.length;j++){const pt=at.added[j];let K=v.indexOf(pt);if(K===-1){for(let q=0;q<x.length;q++)if(q>=v.length){v.push(pt),K=q;break}else if(v[q]===null){v[q]=pt,K=q;break}if(K===-1)break}const Q=x[K];Q&&Q.connect(pt)}}const k=new B,G=new B;function N(at,j,pt){k.setFromMatrixPosition(j.matrixWorld),G.setFromMatrixPosition(pt.matrixWorld);const K=k.distanceTo(G),Q=j.projectionMatrix.elements,q=pt.projectionMatrix.elements,St=Q[14]/(Q[10]-1),At=Q[14]/(Q[10]+1),bt=(Q[9]+1)/Q[5],Ft=(Q[9]-1)/Q[5],H=(Q[8]-1)/Q[0],ee=(q[8]+1)/q[0],yt=St*H,Bt=St*ee,kt=K/(-H+ee),Dt=kt*-H;if(j.matrixWorld.decompose(at.position,at.quaternion,at.scale),at.translateX(Dt),at.translateZ(kt),at.matrixWorld.compose(at.position,at.quaternion,at.scale),at.matrixWorldInverse.copy(at.matrixWorld).invert(),Q[10]===-1)at.projectionMatrix.copy(j.projectionMatrix),at.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const Rt=St+kt,L=At+kt,A=yt-Dt,Y=Bt+(K-Dt),ht=bt*At/L*Rt,J=Ft*At/L*Rt;at.projectionMatrix.makePerspective(A,Y,ht,J,Rt,L),at.projectionMatrixInverse.copy(at.projectionMatrix).invert()}}function Z(at,j){j===null?at.matrixWorld.copy(at.matrix):at.matrixWorld.multiplyMatrices(j.matrixWorld,at.matrix),at.matrixWorldInverse.copy(at.matrixWorld).invert()}this.updateCamera=function(at){if(a===null)return;let j=at.near,pt=at.far;_.texture!==null&&(_.depthNear>0&&(j=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),M.near=T.near=E.near=j,M.far=T.far=E.far=pt,(R!==M.near||z!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,z=M.far),E.layers.mask=at.layers.mask|2,T.layers.mask=at.layers.mask|4,M.layers.mask=E.layers.mask|T.layers.mask;const K=at.parent,Q=M.cameras;Z(M,K);for(let q=0;q<Q.length;q++)Z(Q[q],K);Q.length===2?N(M,E,T):M.projectionMatrix.copy(E.projectionMatrix),st(at,M,K)};function st(at,j,pt){pt===null?at.matrix.copy(j.matrixWorld):(at.matrix.copy(pt.matrixWorld),at.matrix.invert(),at.matrix.multiply(j.matrixWorld)),at.matrix.decompose(at.position,at.quaternion,at.scale),at.updateMatrixWorld(!0),at.projectionMatrix.copy(j.projectionMatrix),at.projectionMatrixInverse.copy(j.projectionMatrixInverse),at.isPerspectiveCamera&&(at.fov=Js*2*Math.atan(1/at.projectionMatrix.elements[5]),at.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(at){l=at,d!==null&&(d.fixedFoveation=at),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=at)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let mt=null;function dt(at,j){if(h=j.getViewerPose(c||o),m=j,h!==null){const pt=h.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let K=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,K=!0);for(let q=0;q<pt.length;q++){const St=pt[q];let At=null;if(u!==null)At=u.getViewport(St);else{const Ft=f.getViewSubImage(d,St);At=Ft.viewport,q===0&&(t.setRenderTargetTextures(y,Ft.colorTexture,d.ignoreDepthValues?void 0:Ft.depthStencilTexture),t.setRenderTarget(y))}let bt=b[q];bt===void 0&&(bt=new Zn,bt.layers.enable(q),bt.viewport=new Ke,b[q]=bt),bt.matrix.fromArray(St.transform.matrix),bt.matrix.decompose(bt.position,bt.quaternion,bt.scale),bt.projectionMatrix.fromArray(St.projectionMatrix),bt.projectionMatrixInverse.copy(bt.projectionMatrix).invert(),bt.viewport.set(At.x,At.y,At.width,At.height),q===0&&(M.matrix.copy(bt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),K===!0&&M.cameras.push(bt)}const Q=a.enabledFeatures;if(Q&&Q.includes("depth-sensing")){const q=f.getDepthInformation(pt[0]);q&&q.isValid&&q.texture&&_.init(t,q,a.renderState)}}for(let pt=0;pt<x.length;pt++){const K=v[pt],Q=x[pt];K!==null&&Q!==void 0&&Q.update(K,j,c||o)}mt&&mt(at,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),m=null}const ft=new ap;ft.setAnimationLoop(dt),this.setAnimationLoop=function(at){mt=at},this.dispose=function(){}}}const ra=new yi,z1=new Oe;function F1(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,ep(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),f(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,y,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===In&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===In&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(g.envMap.value=x,ra.copy(v),ra.x*=-1,ra.y*=-1,ra.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ra.y*=-1,ra.z*=-1),g.envMapRotation.value.setFromMatrix4(z1.makeRotationFromEuler(ra)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===In&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function U1(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(m(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=f();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function f(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=v.length;S<E;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=T.length;b<M;b++){const R=T[b];if(u(R,S,b,w)===!0){const z=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let U=0;for(let C=0;C<I.length;C++){const k=I[C],G=_(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,z+U,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,U),U+=G.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function u(y,x,v,w){const S=y.value,E=x+"_"+v;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const T=w[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(y){const x=y.uniforms;let v=0;const w=16;for(let E=0,T=x.length;E<T;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,R=b.length;M<R;M++){const z=b[M],I=Array.isArray(z.value)?z.value:[z.value];for(let U=0,C=I.length;U<C;U++){const k=I[U],G=_(k),N=v%w,Z=N%G.boundary,st=N+Z;v+=Z,st!==0&&w-st<G.storage&&(v+=w-st),z.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=G.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class N1{constructor(t={}){const{canvas:e=Tv(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Cn,this.toneMapping=ji,this.toneMappingExposure=1;const v=this;let w=!1,S=0,E=0,T=null,b=-1,M=null;const R=new Ke,z=new Ke;let I=null;const U=new ae(0);let C=0,k=e.width,G=e.height,N=1,Z=null,st=null;const mt=new Ke(0,0,k,G),dt=new Ke(0,0,k,G);let ft=!1;const at=new _h;let j=!1,pt=!1;const K=new Oe,Q=new Oe,q=new B,St=new Ke,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function Ft(){return T===null?N:1}let H=i;function ee(P,V){return e.getContext(P,V)}try{const P={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${lh}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",Ct,!1),H===null){const V="webgl2";if(H=ee(V,P),H===null)throw ee(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let yt,Bt,kt,Dt,Rt,L,A,Y,ht,J,rt,Ut,tt,vt,Nt,ot,wt,O,ct,gt,Vt,Ot,qt,F;function Pt(){yt=new VM(H),yt.init(),Ot=new R1(H,yt),Bt=new UM(H,yt,t,Ot),kt=new E1(H,yt),Bt.reverseDepthBuffer&&d&&kt.buffers.depth.setReversed(!0),Dt=new YM(H),Rt=new h1,L=new A1(H,yt,kt,Rt,Bt,Ot,Dt),A=new OM(v),Y=new GM(v),ht=new Qv(H),qt=new zM(H,ht),J=new XM(H,ht,Dt,qt),rt=new ZM(H,J,ht,Dt),ct=new $M(H,Bt,L),ot=new NM(Rt),Ut=new l1(v,A,Y,yt,Bt,qt,ot),tt=new F1(v,Rt),vt=new u1,Nt=new v1(yt),O=new IM(v,A,Y,kt,rt,u,l),wt=new S1(v,rt,Bt),F=new U1(H,Dt,Bt,kt),gt=new FM(H,yt,Dt),Vt=new WM(H,yt,Dt),Dt.programs=Ut.programs,v.capabilities=Bt,v.extensions=yt,v.properties=Rt,v.renderLists=vt,v.shadowMap=wt,v.state=kt,v.info=Dt}Pt();const it=new I1(v,H);this.xr=it,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const P=yt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=yt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(P){P!==void 0&&(N=P,this.setSize(k,G,!1))},this.getSize=function(P){return P.set(k,G)},this.setSize=function(P,V,nt=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=P,G=V,e.width=Math.floor(P*N),e.height=Math.floor(V*N),nt===!0&&(e.style.width=P+"px",e.style.height=V+"px"),this.setViewport(0,0,P,V)},this.getDrawingBufferSize=function(P){return P.set(k*N,G*N).floor()},this.setDrawingBufferSize=function(P,V,nt){k=P,G=V,N=nt,e.width=Math.floor(P*nt),e.height=Math.floor(V*nt),this.setViewport(0,0,P,V)},this.getCurrentViewport=function(P){return P.copy(R)},this.getViewport=function(P){return P.copy(mt)},this.setViewport=function(P,V,nt,et){P.isVector4?mt.set(P.x,P.y,P.z,P.w):mt.set(P,V,nt,et),kt.viewport(R.copy(mt).multiplyScalar(N).round())},this.getScissor=function(P){return P.copy(dt)},this.setScissor=function(P,V,nt,et){P.isVector4?dt.set(P.x,P.y,P.z,P.w):dt.set(P,V,nt,et),kt.scissor(z.copy(dt).multiplyScalar(N).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(P){kt.setScissorTest(ft=P)},this.setOpaqueSort=function(P){Z=P},this.setTransparentSort=function(P){st=P},this.getClearColor=function(P){return P.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(P=!0,V=!0,nt=!0){let et=0;if(P){let W=!1;if(T!==null){const Et=T.texture.format;W=Et===gh||Et===mh||Et===ph}if(W){const Et=T.texture.type,zt=Et===Ii||Et===_a||Et===Ks||Et===fs||Et===uh||Et===fh,$t=O.getClearColor(),Zt=O.getClearAlpha(),Ht=$t.r,Yt=$t.g,Xt=$t.b;zt?(m[0]=Ht,m[1]=Yt,m[2]=Xt,m[3]=Zt,H.clearBufferuiv(H.COLOR,0,m)):(_[0]=Ht,_[1]=Yt,_[2]=Xt,_[3]=Zt,H.clearBufferiv(H.COLOR,0,_))}else et|=H.COLOR_BUFFER_BIT}V&&(et|=H.DEPTH_BUFFER_BIT),nt&&(et|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",Ct,!1),vt.dispose(),Nt.dispose(),Rt.dispose(),A.dispose(),Y.dispose(),rt.dispose(),qt.dispose(),F.dispose(),Ut.dispose(),it.dispose(),it.removeEventListener("sessionstart",nn),it.removeEventListener("sessionend",gn),Fe.stop()};function lt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=Dt.autoReset,V=wt.enabled,nt=wt.autoUpdate,et=wt.needsUpdate,W=wt.type;Pt(),Dt.autoReset=P,wt.enabled=V,wt.autoUpdate=nt,wt.needsUpdate=et,wt.type=W}function Ct(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Qt(P){const V=P.target;V.removeEventListener("dispose",Qt),oe(V)}function oe(P){pe(P),Rt.remove(P)}function pe(P){const V=Rt.get(P).programs;V!==void 0&&(V.forEach(function(nt){Ut.releaseProgram(nt)}),P.isShaderMaterial&&Ut.releaseShaderCache(P))}this.renderBufferDirect=function(P,V,nt,et,W,Et){V===null&&(V=At);const zt=W.isMesh&&W.matrixWorld.determinant()<0,$t=Mt(P,V,nt,et,W);kt.setMaterial(et,zt);let Zt=nt.index,Ht=1;if(et.wireframe===!0){if(Zt=J.getWireframeAttribute(nt),Zt===void 0)return;Ht=2}const Yt=nt.drawRange,Xt=nt.attributes.position;let ce=Yt.start*Ht,ye=(Yt.start+Yt.count)*Ht;Et!==null&&(ce=Math.max(ce,Et.start*Ht),ye=Math.min(ye,(Et.start+Et.count)*Ht)),Zt!==null?(ce=Math.max(ce,0),ye=Math.min(ye,Zt.count)):Xt!=null&&(ce=Math.max(ce,0),ye=Math.min(ye,Xt.count));const Se=ye-ce;if(Se<0||Se===1/0)return;qt.setup(W,et,$t,nt,Zt);let Te,de=gt;if(Zt!==null&&(Te=ht.get(Zt),de=Vt,de.setIndex(Te)),W.isMesh)et.wireframe===!0?(kt.setLineWidth(et.wireframeLinewidth*Ft()),de.setMode(H.LINES)):de.setMode(H.TRIANGLES);else if(W.isLine){let jt=et.linewidth;jt===void 0&&(jt=1),kt.setLineWidth(jt*Ft()),W.isLineSegments?de.setMode(H.LINES):W.isLineLoop?de.setMode(H.LINE_LOOP):de.setMode(H.LINE_STRIP)}else W.isPoints?de.setMode(H.POINTS):W.isSprite&&de.setMode(H.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)de.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(yt.get("WEBGL_multi_draw"))de.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const jt=W._multiDrawStarts,an=W._multiDrawCounts,_t=W._multiDrawCount,Tt=Zt?ht.get(Zt).bytesPerElement:1,ie=Rt.get(et).currentProgram.getUniforms();for(let Ae=0;Ae<_t;Ae++)ie.setValue(H,"_gl_DrawID",Ae),de.render(jt[Ae]/Tt,an[Ae])}else if(W.isInstancedMesh)de.renderInstances(ce,Se,W.count);else if(nt.isInstancedBufferGeometry){const jt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,an=Math.min(nt.instanceCount,jt);de.renderInstances(ce,Se,an)}else de.render(ce,Se)};function se(P,V,nt){P.transparent===!0&&P.side===$e&&P.forceSinglePass===!1?(P.side=In,P.needsUpdate=!0,xn(P,V,nt),P.side=Ki,P.needsUpdate=!0,xn(P,V,nt),P.side=$e):xn(P,V,nt)}this.compile=function(P,V,nt=null){nt===null&&(nt=P),p=Nt.get(nt),p.init(V),x.push(p),nt.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),P!==nt&&P.traverseVisible(function(W){W.isLight&&W.layers.test(V.layers)&&(p.pushLight(W),W.castShadow&&p.pushShadow(W))}),p.setupLights();const et=new Set;return P.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const Et=W.material;if(Et)if(Array.isArray(Et))for(let zt=0;zt<Et.length;zt++){const $t=Et[zt];se($t,nt,W),et.add($t)}else se(Et,nt,W),et.add(Et)}),x.pop(),p=null,et},this.compileAsync=function(P,V,nt=null){const et=this.compile(P,V,nt);return new Promise(W=>{function Et(){if(et.forEach(function(zt){Rt.get(zt).currentProgram.isReady()&&et.delete(zt)}),et.size===0){W(P);return}setTimeout(Et,10)}yt.get("KHR_parallel_shader_compile")!==null?Et():setTimeout(Et,10)})};let Pe=null;function Be(P){Pe&&Pe(P)}function nn(){Fe.stop()}function gn(){Fe.start()}const Fe=new ap;Fe.setAnimationLoop(Be),typeof self<"u"&&Fe.setContext(self),this.setAnimationLoop=function(P){Pe=P,it.setAnimationLoop(P),P===null?Fe.stop():Fe.start()},it.addEventListener("sessionstart",nn),it.addEventListener("sessionend",gn),this.render=function(P,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(V),V=it.getCamera()),P.isScene===!0&&P.onBeforeRender(v,P,V,T),p=Nt.get(P,x.length),p.init(V),x.push(p),Q.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),at.setFromProjectionMatrix(Q),pt=this.localClippingEnabled,j=ot.init(this.clippingPlanes,pt),g=vt.get(P,y.length),g.init(),y.push(g),it.enabled===!0&&it.isPresenting===!0){const Et=v.xr.getDepthSensingMesh();Et!==null&&he(Et,V,-1/0,v.sortObjects)}he(P,V,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(Z,st),bt=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,bt&&O.addToRenderList(g,P),this.info.render.frame++,j===!0&&ot.beginShadows();const nt=p.state.shadowsArray;wt.render(nt,P,V),j===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=g.opaque,W=g.transmissive;if(p.setupLights(),V.isArrayCamera){const Et=V.cameras;if(W.length>0)for(let zt=0,$t=Et.length;zt<$t;zt++){const Zt=Et[zt];Fn(et,W,P,Zt)}bt&&O.render(P);for(let zt=0,$t=Et.length;zt<$t;zt++){const Zt=Et[zt];We(g,P,Zt,Zt.viewport)}}else W.length>0&&Fn(et,W,P,V),bt&&O.render(P),We(g,P,V);T!==null&&(L.updateMultisampleRenderTarget(T),L.updateRenderTargetMipmap(T)),P.isScene===!0&&P.onAfterRender(v,P,V),qt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],j===!0&&ot.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function he(P,V,nt,et){if(P.visible===!1)return;if(P.layers.test(V.layers)){if(P.isGroup)nt=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(V);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||at.intersectsSprite(P)){et&&St.setFromMatrixPosition(P.matrixWorld).applyMatrix4(Q);const zt=rt.update(P),$t=P.material;$t.visible&&g.push(P,zt,$t,nt,St.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||at.intersectsObject(P))){const zt=rt.update(P),$t=P.material;if(et&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),St.copy(P.boundingSphere.center)):(zt.boundingSphere===null&&zt.computeBoundingSphere(),St.copy(zt.boundingSphere.center)),St.applyMatrix4(P.matrixWorld).applyMatrix4(Q)),Array.isArray($t)){const Zt=zt.groups;for(let Ht=0,Yt=Zt.length;Ht<Yt;Ht++){const Xt=Zt[Ht],ce=$t[Xt.materialIndex];ce&&ce.visible&&g.push(P,zt,ce,nt,St.z,Xt)}}else $t.visible&&g.push(P,zt,$t,nt,St.z,null)}}const Et=P.children;for(let zt=0,$t=Et.length;zt<$t;zt++)he(Et[zt],V,nt,et)}function We(P,V,nt,et){const W=P.opaque,Et=P.transmissive,zt=P.transparent;p.setupLightsView(nt),j===!0&&ot.setGlobalState(v.clippingPlanes,nt),et&&kt.viewport(R.copy(et)),W.length>0&&Qe(W,V,nt),Et.length>0&&Qe(Et,V,nt),zt.length>0&&Qe(zt,V,nt),kt.buffers.depth.setTest(!0),kt.buffers.depth.setMask(!0),kt.buffers.color.setMask(!0),kt.setPolygonOffset(!1)}function Fn(P,V,nt,et){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new Ma(1,1,{generateMipmaps:!0,type:yt.has("EXT_color_buffer_half_float")||yt.has("EXT_color_buffer_float")?so:Ii,minFilter:xa,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ee.workingColorSpace}));const Et=p.state.transmissionRenderTarget[et.id],zt=et.viewport||R;Et.setSize(zt.z,zt.w);const $t=v.getRenderTarget();v.setRenderTarget(Et),v.getClearColor(U),C=v.getClearAlpha(),C<1&&v.setClearColor(16777215,.5),v.clear(),bt&&O.render(nt);const Zt=v.toneMapping;v.toneMapping=ji;const Ht=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),j===!0&&ot.setGlobalState(v.clippingPlanes,et),Qe(P,nt,et),L.updateMultisampleRenderTarget(Et),L.updateRenderTargetMipmap(Et),yt.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let Xt=0,ce=V.length;Xt<ce;Xt++){const ye=V[Xt],Se=ye.object,Te=ye.geometry,de=ye.material,jt=ye.group;if(de.side===$e&&Se.layers.test(et.layers)){const an=de.side;de.side=In,de.needsUpdate=!0,Sn(Se,nt,et,Te,de,jt),de.side=an,de.needsUpdate=!0,Yt=!0}}Yt===!0&&(L.updateMultisampleRenderTarget(Et),L.updateRenderTargetMipmap(Et))}v.setRenderTarget($t),v.setClearColor(U,C),Ht!==void 0&&(et.viewport=Ht),v.toneMapping=Zt}function Qe(P,V,nt){const et=V.isScene===!0?V.overrideMaterial:null;for(let W=0,Et=P.length;W<Et;W++){const zt=P[W],$t=zt.object,Zt=zt.geometry,Ht=et===null?zt.material:et,Yt=zt.group;$t.layers.test(nt.layers)&&Sn($t,V,nt,Zt,Ht,Yt)}}function Sn(P,V,nt,et,W,Et){P.onBeforeRender(v,V,nt,et,W,Et),P.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),W.onBeforeRender(v,V,nt,et,P,Et),W.transparent===!0&&W.side===$e&&W.forceSinglePass===!1?(W.side=In,W.needsUpdate=!0,v.renderBufferDirect(nt,V,et,W,P,Et),W.side=Ki,W.needsUpdate=!0,v.renderBufferDirect(nt,V,et,W,P,Et),W.side=$e):v.renderBufferDirect(nt,V,et,W,P,Et),P.onAfterRender(v,V,nt,et,W,Et)}function xn(P,V,nt){V.isScene!==!0&&(V=At);const et=Rt.get(P),W=p.state.lights,Et=p.state.shadowsArray,zt=W.state.version,$t=Ut.getParameters(P,W.state,Et,V,nt),Zt=Ut.getProgramCacheKey($t);let Ht=et.programs;et.environment=P.isMeshStandardMaterial?V.environment:null,et.fog=V.fog,et.envMap=(P.isMeshStandardMaterial?Y:A).get(P.envMap||et.environment),et.envMapRotation=et.environment!==null&&P.envMap===null?V.environmentRotation:P.envMapRotation,Ht===void 0&&(P.addEventListener("dispose",Qt),Ht=new Map,et.programs=Ht);let Yt=Ht.get(Zt);if(Yt!==void 0){if(et.currentProgram===Yt&&et.lightsStateVersion===zt)return It(P,$t),Yt}else $t.uniforms=Ut.getUniforms(P),P.onBeforeCompile($t,v),Yt=Ut.acquireProgram($t,Zt),Ht.set(Zt,Yt),et.uniforms=$t.uniforms;const Xt=et.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Xt.clippingPlanes=ot.uniform),It(P,$t),et.needsLights=re(P),et.lightsStateVersion=zt,et.needsLights&&(Xt.ambientLightColor.value=W.state.ambient,Xt.lightProbe.value=W.state.probe,Xt.directionalLights.value=W.state.directional,Xt.directionalLightShadows.value=W.state.directionalShadow,Xt.spotLights.value=W.state.spot,Xt.spotLightShadows.value=W.state.spotShadow,Xt.rectAreaLights.value=W.state.rectArea,Xt.ltc_1.value=W.state.rectAreaLTC1,Xt.ltc_2.value=W.state.rectAreaLTC2,Xt.pointLights.value=W.state.point,Xt.pointLightShadows.value=W.state.pointShadow,Xt.hemisphereLights.value=W.state.hemi,Xt.directionalShadowMap.value=W.state.directionalShadowMap,Xt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Xt.spotShadowMap.value=W.state.spotShadowMap,Xt.spotLightMatrix.value=W.state.spotLightMatrix,Xt.spotLightMap.value=W.state.spotLightMap,Xt.pointShadowMap.value=W.state.pointShadowMap,Xt.pointShadowMatrix.value=W.state.pointShadowMatrix),et.currentProgram=Yt,et.uniformsList=null,Yt}function X(P){if(P.uniformsList===null){const V=P.currentProgram.getUniforms();P.uniformsList=rr.seqWithValue(V.seq,P.uniforms)}return P.uniformsList}function It(P,V){const nt=Rt.get(P);nt.outputColorSpace=V.outputColorSpace,nt.batching=V.batching,nt.batchingColor=V.batchingColor,nt.instancing=V.instancing,nt.instancingColor=V.instancingColor,nt.instancingMorph=V.instancingMorph,nt.skinning=V.skinning,nt.morphTargets=V.morphTargets,nt.morphNormals=V.morphNormals,nt.morphColors=V.morphColors,nt.morphTargetsCount=V.morphTargetsCount,nt.numClippingPlanes=V.numClippingPlanes,nt.numIntersection=V.numClipIntersection,nt.vertexAlphas=V.vertexAlphas,nt.vertexTangents=V.vertexTangents,nt.toneMapping=V.toneMapping}function Mt(P,V,nt,et,W){V.isScene!==!0&&(V=At),L.resetTextureUnits();const Et=V.fog,zt=et.isMeshStandardMaterial?V.environment:null,$t=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:gs,Zt=(et.isMeshStandardMaterial?Y:A).get(et.envMap||zt),Ht=et.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Yt=!!nt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Xt=!!nt.morphAttributes.position,ce=!!nt.morphAttributes.normal,ye=!!nt.morphAttributes.color;let Se=ji;et.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Se=v.toneMapping);const Te=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,de=Te!==void 0?Te.length:0,jt=Rt.get(et),an=p.state.lights;if(j===!0&&(pt===!0||P!==M)){const fn=P===M&&et.id===b;ot.setState(et,P,fn)}let _t=!1;et.version===jt.__version?(jt.needsLights&&jt.lightsStateVersion!==an.state.version||jt.outputColorSpace!==$t||W.isBatchedMesh&&jt.batching===!1||!W.isBatchedMesh&&jt.batching===!0||W.isBatchedMesh&&jt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&jt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&jt.instancing===!1||!W.isInstancedMesh&&jt.instancing===!0||W.isSkinnedMesh&&jt.skinning===!1||!W.isSkinnedMesh&&jt.skinning===!0||W.isInstancedMesh&&jt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&jt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&jt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&jt.instancingMorph===!1&&W.morphTexture!==null||jt.envMap!==Zt||et.fog===!0&&jt.fog!==Et||jt.numClippingPlanes!==void 0&&(jt.numClippingPlanes!==ot.numPlanes||jt.numIntersection!==ot.numIntersection)||jt.vertexAlphas!==Ht||jt.vertexTangents!==Yt||jt.morphTargets!==Xt||jt.morphNormals!==ce||jt.morphColors!==ye||jt.toneMapping!==Se||jt.morphTargetsCount!==de)&&(_t=!0):(_t=!0,jt.__version=et.version);let Tt=jt.currentProgram;_t===!0&&(Tt=xn(et,V,W));let ie=!1,Ae=!1,Ue=!1;const xe=Tt.getUniforms(),we=jt.uniforms;if(kt.useProgram(Tt.program)&&(ie=!0,Ae=!0,Ue=!0),et.id!==b&&(b=et.id,Ae=!0),ie||M!==P){kt.buffers.depth.getReversed()?(K.copy(P.projectionMatrix),Rv(K),Pv(K),xe.setValue(H,"projectionMatrix",K)):xe.setValue(H,"projectionMatrix",P.projectionMatrix),xe.setValue(H,"viewMatrix",P.matrixWorldInverse);const He=xe.map.cameraPosition;He!==void 0&&He.setValue(H,q.setFromMatrixPosition(P.matrixWorld)),Bt.logarithmicDepthBuffer&&xe.setValue(H,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&xe.setValue(H,"isOrthographic",P.isOrthographicCamera===!0),M!==P&&(M=P,Ae=!0,Ue=!0)}if(W.isSkinnedMesh){xe.setOptional(H,W,"bindMatrix"),xe.setOptional(H,W,"bindMatrixInverse");const fn=W.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),xe.setValue(H,"boneTexture",fn.boneTexture,L))}W.isBatchedMesh&&(xe.setOptional(H,W,"batchingTexture"),xe.setValue(H,"batchingTexture",W._matricesTexture,L),xe.setOptional(H,W,"batchingIdTexture"),xe.setValue(H,"batchingIdTexture",W._indirectTexture,L),xe.setOptional(H,W,"batchingColorTexture"),W._colorsTexture!==null&&xe.setValue(H,"batchingColorTexture",W._colorsTexture,L));const wn=nt.morphAttributes;if((wn.position!==void 0||wn.normal!==void 0||wn.color!==void 0)&&ct.update(W,nt,Tt),(Ae||jt.receiveShadow!==W.receiveShadow)&&(jt.receiveShadow=W.receiveShadow,xe.setValue(H,"receiveShadow",W.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(we.envMap.value=Zt,we.flipEnvMap.value=Zt.isCubeTexture&&Zt.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&V.environment!==null&&(we.envMapIntensity.value=V.environmentIntensity),Ae&&(xe.setValue(H,"toneMappingExposure",v.toneMappingExposure),jt.needsLights&&ne(we,Ue),Et&&et.fog===!0&&tt.refreshFogUniforms(we,Et),tt.refreshMaterialUniforms(we,et,N,G,p.state.transmissionRenderTarget[P.id]),rr.upload(H,X(jt),we,L)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(rr.upload(H,X(jt),we,L),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&xe.setValue(H,"center",W.center),xe.setValue(H,"modelViewMatrix",W.modelViewMatrix),xe.setValue(H,"normalMatrix",W.normalMatrix),xe.setValue(H,"modelMatrix",W.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const fn=et.uniformsGroups;for(let He=0,vn=fn.length;He<vn;He++){const Un=fn[He];F.update(Un,Tt),F.bind(Un,Tt)}}return Tt}function ne(P,V){P.ambientLightColor.needsUpdate=V,P.lightProbe.needsUpdate=V,P.directionalLights.needsUpdate=V,P.directionalLightShadows.needsUpdate=V,P.pointLights.needsUpdate=V,P.pointLightShadows.needsUpdate=V,P.spotLights.needsUpdate=V,P.spotLightShadows.needsUpdate=V,P.rectAreaLights.needsUpdate=V,P.hemisphereLights.needsUpdate=V}function re(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(P,V,nt){Rt.get(P.texture).__webglTexture=V,Rt.get(P.depthTexture).__webglTexture=nt;const et=Rt.get(P);et.__hasExternalTextures=!0,et.__autoAllocateDepthBuffer=nt===void 0,et.__autoAllocateDepthBuffer||yt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,V){const nt=Rt.get(P);nt.__webglFramebuffer=V,nt.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(P,V=0,nt=0){T=P,S=V,E=nt;let et=!0,W=null,Et=!1,zt=!1;if(P){const Zt=Rt.get(P);if(Zt.__useDefaultFramebuffer!==void 0)kt.bindFramebuffer(H.FRAMEBUFFER,null),et=!1;else if(Zt.__webglFramebuffer===void 0)L.setupRenderTarget(P);else if(Zt.__hasExternalTextures)L.rebindTextures(P,Rt.get(P.texture).__webglTexture,Rt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Xt=P.depthTexture;if(Zt.__boundDepthTexture!==Xt){if(Xt!==null&&Rt.has(Xt)&&(P.width!==Xt.image.width||P.height!==Xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(P)}}const Ht=P.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(zt=!0);const Yt=Rt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(Yt[V])?W=Yt[V][nt]:W=Yt[V],Et=!0):P.samples>0&&L.useMultisampledRTT(P)===!1?W=Rt.get(P).__webglMultisampledFramebuffer:Array.isArray(Yt)?W=Yt[nt]:W=Yt,R.copy(P.viewport),z.copy(P.scissor),I=P.scissorTest}else R.copy(mt).multiplyScalar(N).floor(),z.copy(dt).multiplyScalar(N).floor(),I=ft;if(kt.bindFramebuffer(H.FRAMEBUFFER,W)&&et&&kt.drawBuffers(P,W),kt.viewport(R),kt.scissor(z),kt.setScissorTest(I),Et){const Zt=Rt.get(P.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+V,Zt.__webglTexture,nt)}else if(zt){const Zt=Rt.get(P.texture),Ht=V||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Zt.__webglTexture,nt||0,Ht)}b=-1},this.readRenderTargetPixels=function(P,V,nt,et,W,Et,zt){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $t=Rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&zt!==void 0&&($t=$t[zt]),$t){kt.bindFramebuffer(H.FRAMEBUFFER,$t);try{const Zt=P.texture,Ht=Zt.format,Yt=Zt.type;if(!Bt.textureFormatReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Bt.textureTypeReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=P.width-et&&nt>=0&&nt<=P.height-W&&H.readPixels(V,nt,et,W,Ot.convert(Ht),Ot.convert(Yt),Et)}finally{const Zt=T!==null?Rt.get(T).__webglFramebuffer:null;kt.bindFramebuffer(H.FRAMEBUFFER,Zt)}}},this.readRenderTargetPixelsAsync=async function(P,V,nt,et,W,Et,zt){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let $t=Rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&zt!==void 0&&($t=$t[zt]),$t){const Zt=P.texture,Ht=Zt.format,Yt=Zt.type;if(!Bt.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Bt.textureTypeReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(V>=0&&V<=P.width-et&&nt>=0&&nt<=P.height-W){kt.bindFramebuffer(H.FRAMEBUFFER,$t);const Xt=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,Xt),H.bufferData(H.PIXEL_PACK_BUFFER,Et.byteLength,H.STREAM_READ),H.readPixels(V,nt,et,W,Ot.convert(Ht),Ot.convert(Yt),0);const ce=T!==null?Rt.get(T).__webglFramebuffer:null;kt.bindFramebuffer(H.FRAMEBUFFER,ce);const ye=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Av(H,ye,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,Xt),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,Et),H.deleteBuffer(Xt),H.deleteSync(ye),Et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,V=null,nt=0){P.isTexture!==!0&&(Us("WebGLRenderer: copyFramebufferToTexture function signature has changed."),V=arguments[0]||null,P=arguments[1]);const et=Math.pow(2,-nt),W=Math.floor(P.image.width*et),Et=Math.floor(P.image.height*et),zt=V!==null?V.x:0,$t=V!==null?V.y:0;L.setTexture2D(P,0),H.copyTexSubImage2D(H.TEXTURE_2D,nt,0,0,zt,$t,W,Et),kt.unbindTexture()},this.copyTextureToTexture=function(P,V,nt=null,et=null,W=0){P.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture function signature has changed."),et=arguments[0]||null,P=arguments[1],V=arguments[2],W=arguments[3]||0,nt=null);let Et,zt,$t,Zt,Ht,Yt,Xt,ce,ye;const Se=P.isCompressedTexture?P.mipmaps[W]:P.image;nt!==null?(Et=nt.max.x-nt.min.x,zt=nt.max.y-nt.min.y,$t=nt.isBox3?nt.max.z-nt.min.z:1,Zt=nt.min.x,Ht=nt.min.y,Yt=nt.isBox3?nt.min.z:0):(Et=Se.width,zt=Se.height,$t=Se.depth||1,Zt=0,Ht=0,Yt=0),et!==null?(Xt=et.x,ce=et.y,ye=et.z):(Xt=0,ce=0,ye=0);const Te=Ot.convert(V.format),de=Ot.convert(V.type);let jt;V.isData3DTexture?(L.setTexture3D(V,0),jt=H.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(L.setTexture2DArray(V,0),jt=H.TEXTURE_2D_ARRAY):(L.setTexture2D(V,0),jt=H.TEXTURE_2D),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,V.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,V.unpackAlignment);const an=H.getParameter(H.UNPACK_ROW_LENGTH),_t=H.getParameter(H.UNPACK_IMAGE_HEIGHT),Tt=H.getParameter(H.UNPACK_SKIP_PIXELS),ie=H.getParameter(H.UNPACK_SKIP_ROWS),Ae=H.getParameter(H.UNPACK_SKIP_IMAGES);H.pixelStorei(H.UNPACK_ROW_LENGTH,Se.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Se.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Zt),H.pixelStorei(H.UNPACK_SKIP_ROWS,Ht),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Yt);const Ue=P.isDataArrayTexture||P.isData3DTexture,xe=V.isDataArrayTexture||V.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const we=Rt.get(P),wn=Rt.get(V),fn=Rt.get(we.__renderTarget),He=Rt.get(wn.__renderTarget);kt.bindFramebuffer(H.READ_FRAMEBUFFER,fn.__webglFramebuffer),kt.bindFramebuffer(H.DRAW_FRAMEBUFFER,He.__webglFramebuffer);for(let vn=0;vn<$t;vn++)Ue&&H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Rt.get(P).__webglTexture,W,Yt+vn),P.isDepthTexture?(xe&&H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Rt.get(V).__webglTexture,W,ye+vn),H.blitFramebuffer(Zt,Ht,Et,zt,Xt,ce,Et,zt,H.DEPTH_BUFFER_BIT,H.NEAREST)):xe?H.copyTexSubImage3D(jt,W,Xt,ce,ye+vn,Zt,Ht,Et,zt):H.copyTexSubImage2D(jt,W,Xt,ce,ye+vn,Zt,Ht,Et,zt);kt.bindFramebuffer(H.READ_FRAMEBUFFER,null),kt.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else xe?P.isDataTexture||P.isData3DTexture?H.texSubImage3D(jt,W,Xt,ce,ye,Et,zt,$t,Te,de,Se.data):V.isCompressedArrayTexture?H.compressedTexSubImage3D(jt,W,Xt,ce,ye,Et,zt,$t,Te,Se.data):H.texSubImage3D(jt,W,Xt,ce,ye,Et,zt,$t,Te,de,Se):P.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,W,Xt,ce,Et,zt,Te,de,Se.data):P.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,W,Xt,ce,Se.width,Se.height,Te,Se.data):H.texSubImage2D(H.TEXTURE_2D,W,Xt,ce,Et,zt,Te,de,Se);H.pixelStorei(H.UNPACK_ROW_LENGTH,an),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,_t),H.pixelStorei(H.UNPACK_SKIP_PIXELS,Tt),H.pixelStorei(H.UNPACK_SKIP_ROWS,ie),H.pixelStorei(H.UNPACK_SKIP_IMAGES,Ae),W===0&&V.generateMipmaps&&H.generateMipmap(jt),kt.unbindTexture()},this.copyTextureToTexture3D=function(P,V,nt=null,et=null,W=0){return P.isTexture!==!0&&(Us("WebGLRenderer: copyTextureToTexture3D function signature has changed."),nt=arguments[0]||null,et=arguments[1]||null,P=arguments[2],V=arguments[3],W=arguments[4]||0),Us('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,V,nt,et,W)},this.initRenderTarget=function(P){Rt.get(P).__webglFramebuffer===void 0&&L.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?L.setTextureCube(P,0):P.isData3DTexture?L.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?L.setTexture2DArray(P,0):L.setTexture2D(P,0),kt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,kt.reset(),qt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ee._getUnpackColorSpace()}}class O1 extends qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class B1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Xl,this.updateRanges=[],this.version=0,this.uuid=vi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Rn=new B;class Mr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.applyMatrix4(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.applyNormalMatrix(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.transformDirection(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=ai(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=De(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=De(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=ai(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=ai(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=ai(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=ai(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=De(e,this.array),i=De(i,this.array),a=De(a,this.array),s=De(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Mr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Yl extends Sa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let qa;const ks=new B,ja=new B,Ka=new B,Ja=new Wt,Is=new Wt,dp=new Oe,Go=new B,zs=new B,Vo=new B,ku=new Wt,Nc=new Wt,Iu=new Wt;class zu extends qe{constructor(t=new Yl){if(super(),this.isSprite=!0,this.type="Sprite",qa===void 0){qa=new en;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new B1(e,5);qa.setIndex([0,1,2,0,2,3]),qa.setAttribute("position",new Mr(i,3,0,!1)),qa.setAttribute("uv",new Mr(i,2,3,!1))}this.geometry=qa,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ja.setFromMatrixScale(this.matrixWorld),dp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ka.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ja.multiplyScalar(-Ka.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Xo(Go.set(-.5,-.5,0),Ka,o,ja,a,s),Xo(zs.set(.5,-.5,0),Ka,o,ja,a,s),Xo(Vo.set(.5,.5,0),Ka,o,ja,a,s),ku.set(0,0),Nc.set(1,0),Iu.set(1,1);let r=t.ray.intersectTriangle(Go,zs,Vo,!1,ks);if(r===null&&(Xo(zs.set(-.5,.5,0),Ka,o,ja,a,s),Nc.set(0,1),r=t.ray.intersectTriangle(Go,Vo,zs,!1,ks),r===null))return;const l=t.ray.origin.distanceTo(ks);l<t.near||l>t.far||e.push({distance:l,point:ks.clone(),uv:Wn.getInterpolation(ks,Go,zs,Vo,ku,Nc,Iu,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Xo(n,t,e,i,a,s){Ja.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Is.x=s*Ja.x-a*Ja.y,Is.y=a*Ja.x+s*Ja.y):Is.copy(Ja),n.copy(t),n.x+=Is.x,n.y+=Is.y,n.applyMatrix4(dp)}class bh extends Sa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const br=new B,Sr=new B,Fu=new Oe,Fs=new vh,Wo=new Dr,Oc=new B,Uu=new B;class H1 extends qe{constructor(t=new en,e=new bh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)br.fromBufferAttribute(e,a-1),Sr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=br.distanceTo(Sr);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Wo.copy(i.boundingSphere),Wo.applyMatrix4(a),Wo.radius+=s,t.ray.intersectsSphere(Wo)===!1)return;Fu.copy(a).invert(),Fs.copy(t.ray).applyMatrix4(Fu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=u,g=m-1;_<g;_+=c){const p=h.getX(_),y=h.getX(_+1),x=Yo(this,t,Fs,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(u),p=Yo(this,t,Fs,l,_,g);p&&e.push(p)}}else{const u=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=u,g=m-1;_<g;_+=c){const p=Yo(this,t,Fs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Yo(this,t,Fs,l,m-1,u);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Yo(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(br.fromBufferAttribute(o,a),Sr.fromBufferAttribute(o,s),e.distanceSqToSegment(br,Sr,Oc,Uu)>i)return;Oc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Oc);if(!(l<t.near||l>t.far))return{distance:l,point:Uu.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Nu=new B,Ou=new B;class up extends H1{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Nu.fromBufferAttribute(e,a),Ou.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Nu.distanceTo(Ou);t.setAttribute("lineDistance",new Re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $l extends Dn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _i{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,u=(o-h)/d;return(a+u)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Wt:new B);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new B,a=[],s=[],o=[],r=new B,l=new Oe;for(let u=0;u<=t;u++){const m=u/t;a[u]=this.getTangentAt(m,new B)}s[0]=new B,o[0]=new B;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),f=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let u=1;u<=t;u++){if(s[u]=s[u-1].clone(),o[u]=o[u-1].clone(),r.crossVectors(a[u-1],a[u]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(pn(a[u-1].dot(a[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(r,m))}o[u].crossVectors(a[u],s[u])}if(e===!0){let u=Math.acos(pn(s[0].dot(s[t]),-1,1));u/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(u=-u);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],u*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Sh extends _i{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,u=c-this.aY;l=d*h-u*f+this.aX,c=d*f+u*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class G1 extends Sh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function wh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,f){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,u=(r-o)/h-(l-o)/(h+f)+(l-r)/f;d*=h,u*=h,a(o,r,d,u)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const $o=new B,Bc=new wh,Hc=new wh,Gc=new wh;class V1 extends _i{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new B){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:($o.subVectors(a[0],a[1]).add(a[0]),c=$o);const f=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:($o.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=$o),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),u),_=Math.pow(f.distanceToSquared(d),u),g=Math.pow(d.distanceToSquared(h),u);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Bc.initNonuniformCatmullRom(c.x,f.x,d.x,h.x,m,_,g),Hc.initNonuniformCatmullRom(c.y,f.y,d.y,h.y,m,_,g),Gc.initNonuniformCatmullRom(c.z,f.z,d.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(Bc.initCatmullRom(c.x,f.x,d.x,h.x,this.tension),Hc.initCatmullRom(c.y,f.y,d.y,h.y,this.tension),Gc.initCatmullRom(c.z,f.z,d.z,h.z,this.tension));return i.set(Bc.calc(l),Hc.calc(l),Gc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new B().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Bu(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function X1(n,t){const e=1-n;return e*e*t}function W1(n,t){return 2*(1-n)*n*t}function Y1(n,t){return n*n*t}function Vs(n,t,e,i){return X1(n,t)+W1(n,e)+Y1(n,i)}function $1(n,t){const e=1-n;return e*e*e*t}function Z1(n,t){const e=1-n;return 3*e*e*n*t}function q1(n,t){return 3*(1-n)*n*n*t}function j1(n,t){return n*n*n*t}function Xs(n,t,e,i,a){return $1(n,t)+Z1(n,e)+q1(n,i)+j1(n,a)}class fp extends _i{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Xs(t,a.x,s.x,o.x,r.x),Xs(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class K1 extends _i{constructor(t=new B,e=new B,i=new B,a=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new B){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Xs(t,a.x,s.x,o.x,r.x),Xs(t,a.y,s.y,o.y,r.y),Xs(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class pp extends _i{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class J1 extends _i{constructor(t=new B,e=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new B){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new B){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mp extends _i{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Vs(t,a.x,s.x,o.x),Vs(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Q1 extends _i{constructor(t=new B,e=new B,i=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new B){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(Vs(t,a.x,s.x,o.x),Vs(t,a.y,s.y,o.y),Vs(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gp extends _i{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],f=a[o>a.length-3?a.length-1:o+2];return i.set(Bu(r,l.x,c.x,h.x,f.x),Bu(r,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var Hu=Object.freeze({__proto__:null,ArcCurve:G1,CatmullRomCurve3:V1,CubicBezierCurve:fp,CubicBezierCurve3:K1,EllipseCurve:Sh,LineCurve:pp,LineCurve3:J1,QuadraticBezierCurve:mp,QuadraticBezierCurve3:Q1,SplineCurve:gp});class tS extends _i{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Hu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new Hu[a.type]().fromJSON(a))}return this}}class Gu extends tS{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new pp(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new mp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new fp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new gp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Sh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Eh extends en{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new B,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=e;f++,d+=3){const u=i+f/e*a;c.x=t*Math.cos(u),c.y=t*Math.sin(u),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Re(o,3)),this.setAttribute("normal",new Re(r,3)),this.setAttribute("uv",new Re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qs extends en{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],f=[],d=[],u=[];let m=0;const _=[],g=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Re(f,3)),this.setAttribute("normal",new Re(d,3)),this.setAttribute("uv",new Re(u,2));function y(){const v=new B,w=new B;let S=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const b=[],M=T/s,R=M*(e-t)+t;for(let z=0;z<=a;z++){const I=z/a,U=I*l+r,C=Math.sin(U),k=Math.cos(U);w.x=R*C,w.y=-M*i+g,w.z=R*k,f.push(w.x,w.y,w.z),v.set(C,E,k).normalize(),d.push(v.x,v.y,v.z),u.push(I,1-M),b.push(m++)}_.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const M=_[b][T],R=_[b+1][T],z=_[b+1][T+1],I=_[b][T+1];(t>0||b!==0)&&(h.push(M,R,I),S+=3),(e>0||b!==s-1)&&(h.push(R,z,I),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=m,S=new Wt,E=new B;let T=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let z=1;z<=a;z++)f.push(0,g*M,0),d.push(0,M,0),u.push(.5,.5),m++;const R=m;for(let z=0;z<=a;z++){const U=z/a*l+r,C=Math.cos(U),k=Math.sin(U);E.x=b*k,E.y=g*M,E.z=b*C,f.push(E.x,E.y,E.z),d.push(0,M,0),S.x=C*.5+.5,S.y=k*.5*M+.5,u.push(S.x,S.y),m++}for(let z=0;z<a;z++){const I=w+z,U=R+z;v===!0?h.push(U,U+1,I):h.push(U+1,U,I),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Th extends Qs{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Th(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ah extends en{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Re(s,3)),this.setAttribute("normal",new Re(s.slice(),3)),this.setAttribute("uv",new Re(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new B,v=new B,w=new B;for(let S=0;S<e.length;S+=3)u(e[S+0],x),u(e[S+1],v),u(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const b=y.clone().lerp(v,T/S),M=x.clone().lerp(v,T/S),R=S-T;for(let z=0;z<=R;z++)z===0&&T===S?E[T][z]=b:E[T][z]=b.clone().lerp(M,z/R)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(E[T][M+1]),d(E[T+1][M]),d(E[T][M])):(d(E[T][M+1]),d(E[T+1][M+1]),d(E[T+1][M]))}}function c(y){const x=new B;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new B;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=g(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}m(),f()}function f(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),E=Math.min(x,v,w);S>.9&&E<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function u(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function m(){const y=new B,x=new B,v=new B,w=new B,S=new Wt,E=new Wt,T=new Wt;for(let b=0,M=0;b<s.length;b+=9,M+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),w.copy(y).add(x).add(v).divideScalar(3);const R=g(w);_(S,M+0,y,R),_(E,M+2,x,R),_(T,M+4,v,R)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ah(t.vertices,t.indices,t.radius,t.details)}}const Zo=new B,qo=new B,Vc=new B,jo=new Wn;class eS extends en{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(os*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),d={},u=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:_,b:g,c:p}=jo;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),jo.getNormal(Vc),f[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,f[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,f[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=f[y],w=f[x],S=jo[h[y]],E=jo[h[x]],T=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(Vc.dot(d[b].normal)<=s&&(u.push(S.x,S.y,S.z),u.push(E.x,E.y,E.z)),d[b]=null):T in d||(d[T]={index0:c[y],index1:c[x],normal:Vc.clone()})}}for(const m in d)if(d[m]){const{index0:_,index1:g}=d[m];Zo.fromBufferAttribute(r,_),qo.fromBufferAttribute(r,g),u.push(Zo.x,Zo.y,Zo.z),u.push(qo.x,qo.y,qo.z)}this.setAttribute("position",new Re(u,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class xp extends Gu{constructor(t){super(t),this.uuid=vi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Gu().fromJSON(a))}return this}}const nS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=vp(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,f,d,u;if(i&&(s=rS(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)f=n[m],d=n[m+1],f<r&&(r=f),d<l&&(l=d),f>c&&(c=f),d>h&&(h=d);u=Math.max(c-r,h-l),u=u!==0?32767/u:0}return to(s,o,e,r,l,u,0),o}};function vp(n,t,e,i,a){let s,o;if(a===vS(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Vu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Vu(s,n[s],n[s+1],o);return o&&Ir(o,o.next)&&(no(o),o=o.next),o}function ba(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ir(e,e.next)||Ze(e.prev,e,e.next)===0)){if(no(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function to(n,t,e,i,a,s,o){if(!n)return;!o&&s&&uS(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?aS(n,i,a,s):iS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),no(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=sS(ba(n),t,e),to(n,t,e,i,a,s,2)):o===2&&oS(n,t,e,i,a,s):to(ba(n),t,e,i,a,s,1);break}}}function iS(n){const t=n.prev,e=n,i=n.next;if(Ze(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,f=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,u=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=f&&m.y<=u&&ns(a,r,s,l,o,c,m.x,m.y)&&Ze(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function aS(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ze(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,f=s.y,d=o.y,u=r<l?r<c?r:c:l<c?l:c,m=h<f?h<d?h:d:f<d?f:d,_=r>l?r>c?r:c:l>c?l:c,g=h>f?h>d?h:d:f>d?f:d,p=Zl(u,m,t,e,i),y=Zl(_,g,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=u&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ns(r,h,l,f,c,d,x.x,x.y)&&Ze(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&ns(r,h,l,f,c,d,v.x,v.y)&&Ze(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=u&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ns(r,h,l,f,c,d,x.x,x.y)&&Ze(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=u&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&ns(r,h,l,f,c,d,v.x,v.y)&&Ze(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function sS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Ir(a,s)&&yp(a,i,i.next,s)&&eo(a,s)&&eo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),no(i),no(i.next),i=n=s),i=i.next}while(i!==n);return ba(i)}function oS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&mS(o,r)){let l=_p(o,r);o=ba(o,o.next),l=ba(l,l.next),to(o,t,e,i,a,s,0),to(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function rS(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=vp(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(pS(c));for(a.sort(cS),s=0;s<a.length;s++)e=lS(a[s],e);return e}function cS(n,t){return n.x-t.x}function lS(n,t){const e=hS(n,t);if(!e)return t;const i=_p(e,n);return ba(i,i.next),ba(e,e.next)}function hS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,f;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&ns(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),eo(e,n)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&dS(a,e)))&&(a=e,h=f)),e=e.next;while(e!==r);return a}function dS(n,t){return Ze(n.prev,n,t.prev)<0&&Ze(t.next,n,n.next)<0}function uS(n,t,e,i){let a=n;do a.z===0&&(a.z=Zl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,fS(a)}function fS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Zl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function pS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ns(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function mS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!gS(n,t)&&(eo(n,t)&&eo(t,n)&&xS(n,t)&&(Ze(n.prev,n,t.prev)||Ze(n,t.prev,t))||Ir(n,t)&&Ze(n.prev,n,n.next)>0&&Ze(t.prev,t,t.next)>0)}function Ze(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ir(n,t){return n.x===t.x&&n.y===t.y}function yp(n,t,e,i){const a=Jo(Ze(n,t,e)),s=Jo(Ze(n,t,i)),o=Jo(Ze(e,i,n)),r=Jo(Ze(e,i,t));return!!(a!==s&&o!==r||a===0&&Ko(n,e,t)||s===0&&Ko(n,i,t)||o===0&&Ko(e,n,i)||r===0&&Ko(e,t,i))}function Ko(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Jo(n){return n>0?1:n<0?-1:0}function gS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&yp(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function eo(n,t){return Ze(n.prev,n,n.next)<0?Ze(n,t,n.next)>=0&&Ze(n,n.prev,t)>=0:Ze(n,t,n.prev)<0||Ze(n,n.next,t)<0}function xS(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function _p(n,t){const e=new ql(n.i,n.x,n.y),i=new ql(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Vu(n,t,e,i){const a=new ql(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function no(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ql(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function vS(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Ws{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Ws.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Xu(t),Wu(i,t);let o=t.length;e.forEach(Xu);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,Wu(i,e[l]);const r=nS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function Xu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Wu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Rh extends Ah{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Rh(t.radius,t.detail)}}class io extends en{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let f=t;const d=(e-t)/a,u=new B,m=new Wt;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;u.x=f*Math.cos(p),u.y=f*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),m.x=(u.x/e+1)/2,m.y=(u.y/e+1)/2,h.push(m.x,m.y)}f+=d}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const y=p+g,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new Re(l,3)),this.setAttribute("normal",new Re(c,3)),this.setAttribute("uv",new Re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new io(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ph extends en{constructor(t=new xp([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Re(a,3)),this.setAttribute("normal",new Re(s,3)),this.setAttribute("uv",new Re(o,2));function c(h){const f=a.length/3,d=h.extractPoints(e);let u=d.shape;const m=d.holes;Ws.isClockWise(u)===!1&&(u=u.reverse());for(let g=0,p=m.length;g<p;g++){const y=m[g];Ws.isClockWise(y)===!0&&(m[g]=y.reverse())}const _=Ws.triangulateShape(u,m);for(let g=0,p=m.length;g<p;g++){const y=m[g];u=u.concat(y)}for(let g=0,p=u.length;g<p;g++){const y=u[g];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=_.length;g<p;g++){const y=_[g],x=y[0]+f,v=y[1]+f,w=y[2]+f;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return yS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Ph(i,t.curveSegments)}}function yS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class zr extends en{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new B,f=new B,d=new B;for(let u=0;u<=i;u++)for(let m=0;m<=a;m++){const _=m/a*s,g=u/i*Math.PI*2;f.x=(t+e*Math.cos(g))*Math.cos(_),f.y=(t+e*Math.cos(g))*Math.sin(_),f.z=e*Math.sin(g),r.push(f.x,f.y,f.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(f,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(u/i)}for(let u=1;u<=i;u++)for(let m=1;m<=a;m++){const _=(a+1)*u+m-1,g=(a+1)*(u-1)+m-1,p=(a+1)*(u-1)+m,y=(a+1)*u+m;o.push(_,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Re(r,3)),this.setAttribute("normal",new Re(l,3)),this.setAttribute("uv",new Re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ao extends Sa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$f,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Mp extends qe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class _S extends Mp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Xc=new Oe,Yu=new B,$u=new B;class MS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _h,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Yu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Yu),$u.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($u),e.updateMatrixWorld(),Xc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Xc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class bS extends MS{constructor(){super(new sp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class SS extends Mp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(qe.DEFAULT_UP),this.updateMatrix(),this.target=new qe,this.shadow=new bS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Zu=new Oe;class wS{constructor(t,e,i=0,a=1/0){this.ray=new vh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new yh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Zu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zu),this}intersectObject(t,e=!0,i=[]){return jl(t,this,i,e),i.sort(qu),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)jl(t[a],this,i,e);return i.sort(qu),i}}function qu(n,t){return n.distance-t.distance}function jl(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)jl(s[o],t,e,!0)}}class ES extends up{constructor(t=10,e=10,i=4473924,a=8947848){i=new ae(i),a=new ae(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,u=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const _=d===s?i:a;_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3,_.toArray(c,u),u+=3}const h=new en;h.setAttribute("position",new Re(l,3)),h.setAttribute("color",new Re(c,3));const f=new bh({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lh);const TS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function AS(n,t,e,i){const a=new Zn(n.fov,i,.1,200),s=new B,o=new B,r=new B;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let f=1,d=0,u=0,m=0,_=0,g=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,E=TS){const T=v+.6;if(!l)s.set(x,T,w),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*R,s.y+=(T-s.y)*R,s.z+=(w-s.z)*R}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(f-h.zoom)*M,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){u+=S*52;const R=d*.055;a.position.x+=Math.sin(u*1.7)*R,a.position.y+=Math.sin(u*2.3+1.1)*R*.75,a.position.z+=Math.sin(u*1.3+2.4)*R*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new B().setFromMatrixColumn(a.matrixWorld,0),v=new B().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(m=x/S*w,_=v/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){f=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const va=Math.PI*2,qn=1e-6;function zn(n,t,e){return n<t?t:n>e?e:n}function bp(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function RS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Sp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=RS(n);return i===1?a:e+(a-e)*i}function ju(n){return(1-Math.sin(n))/2}function Ch(n,t,e){const i=Math.PI/180,a=zn(Number.isFinite(t)?t:100,0,180),s=zn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=zn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function wr(n,t){if(!n.grounded||n.speed<qn)return bp();const e=n.speed/Math.max(n.moveSpeed,qn),i=Math.max(n.legLength,qn),a=n.stride>qn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+qn,h=Ch(n.localForward/Math.max(n.speed,qn),t.backStrafeStartDeg,t.backStrafeFullDeg),f=l/c*h,d=r/c+l/c*(1-h),u=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,_=a,g=U=>Math.asin(zn(U,-o,o)/i);function p(U,C){const k=Sp(U,t.plantLock),G=ju(U),N=u*d*_*k,Z=-g(N),st=C*m>0?1:-1,mt=1+st*t.crossStep*.45,dt=m*st*t.crossStep*_*.4*G,ft=m*f*_*t.sideWeight*mt*k+dt*f,at=g(ft),j=t.kneeLift*G*s*(.55+.25*d+(st>0?.2*f:0));return{pitchX:Z,rollZ:at,kneeX:j}}const y=(n.phase%va+va)%va,x=p(y,-1),v=p((y+Math.PI)%va,1),w=Math.cos(y),S=ju(y),E=-t.comSway*s*w*(.6*d+.8*f)-m*t.comSway*s*f*.45,T=t.comBob*S*s,b=m*t.hipLean*s*f*w*.6,M=m*t.hipLean*s*f*(.45+.25*w),R=t.armSwing*s*w*(d*u+.3*f),z=R,I=-R;return{legL:x,legR:v,pelvisX:E,pelvisY:T,pelvisRoll:b,sideLean:M,armL:z,armR:I,strafe:f,backward:u<0?d:0}}function wp(n){const t=(n%va+va)%va,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Ep(n,t,e){const i=zn(e.progress,0,1);if(i>=1||n.speed<qn)return bp();const a=i*i*(3-2*i),s=1-a;return wr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Tp(n,t,e,i){const a=zn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return zn(o*a,-1,1)*(e*Math.PI/180)}function Ap(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=zn(i,0,1),c=l*l;return e*c+r*(1-c)}function Rp(n,t,e,i,a){const s=Math.max(e,qn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>qn?(t-n)/t:0,c=l>.02,h=l<-.015,f=n<=o*.15,d=!h&&n<r&&(c||f);return{enter:n>qn&&n<=o&&c,resume:!d}}function Pp(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return zn(n*zn(t,0,2),-i,i)}function Cp(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Lp(n,t,e){const i=zn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function PS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=zn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,f=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,u=r?1:-1;return{legL:{pitchX:-h*l,rollZ:u*d*l,kneeX:f*l},legR:{pitchX:-h*c,rollZ:-u*d*c,kneeX:f*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Dp(n,t,e,i,a){const s=zn(n,0,1),o=zn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),f=h>qn?e/h:1,d=h>qn?i/h:0,u=Sp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:u,fwdN:f,rightN:d,env:c}}function bn(n){return n<0?0:n>1?1:n}const cr=Math.PI*2;function CS(n){return((n+Math.PI)%cr+cr)%cr-Math.PI}function LS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function DS(n,t,e,i,a,s=n.phase){const o=bn(i);if(o<=0)return n;const r=bn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,f=bn(a.forwardBias),d=Math.max(0,n.stride??0),u=Math.max(0,a.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,_=m*m*(3-2*m),g=r<=.5?_:1-_,p={speed:c,phase:s+cr*l/2*g,localForward:c*f,localRight:c*(1-f)*h},y=CS(p.phase-n.phase),x=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+y*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(u-v)*o*o}}function kS(n,t,e){const i=LS(),a=bn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,f=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-f*o,i.legR.rollZ=f*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=f*.25*o,i}function kp(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Ku(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*kp(s,a)}function IS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function zS(n,t,e){const i=bn(n);return{gaitScale:1-i*(1-bn(t)),attackLegWeight:bn(e)*i}}function FS(n,t,e){const i=bn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function US(n,t){const e=bn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function NS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return bn(t.minScale+(1-t.minScale)*e)}function OS(){return Ip()}function Ip(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function BS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function HS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?bn(t.forceHitHeight):n.type==="light"?bn(t.hitHeight.light):n.type==="heavy"?bn(t.hitHeight.heavy):n.type==="knock"?bn(t.hitHeight.knock):0}function GS(n,t,e){const i=bn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function zp(n,t,e){const i=Ip(),a=BS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=bn(1-n.timer/n.duration),o=kp(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=HS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),f=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=f,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*f,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const u=a*o,m=GS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=u*(m.upperPitch*f+m.fold),i.upperRoll=-u*m.upperRoll*d,i.upperYaw=u*m.upperYaw*d,i.upperShift=u*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*f,i.comShift=u*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*f,i.pelvisBack=u*m.back,i.drop=u*m.drop,i.knee=u*m.knee,i.hip=u*m.hip,i.arm=u*m.arm,i.flash=e.flashStrength*o,i}function Fp(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ca=1e-6;function Ys(n,t,e){return n<t?t:n>e?e:n}function Up(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ca||s<=ca||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+ca,c=Math.hypot(n.x,n.y,n.z);if(c<=ca)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),f=Math.hypot(n.x,n.y),d=n.z,u=Math.hypot(d,f),m=Ys(u,l,r),_=u>r+ca||u<l-ca,g=Math.atan2(-d,Math.max(f,ca)),p=Ys((a*a+m*m-s*s)/(2*a*m),-1,1),y=Ys((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function Np(n,t,e,i){const a=Ys(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Ys((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Op(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Lh={active:!1,weight:0,clamped:0,maxError:0};function Bp(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Lh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(u=>u.tip.getWorldPosition(new B));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let f=0;for(let u=0;u<a.length;u++){const m=a[u],_=i.worldToLocal(l[u].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=Up(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(f+=1);const y=Np({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=y.rootPitch,m.root.rotation.z=y.rootRoll,m.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let u=0;u<a.length;u++){const m=a[u].tip.getWorldPosition(new B);d=Math.max(d,m.distanceTo(l[u]))}return{active:!0,weight:c,clamped:f,maxError:d}}function Vn(n,t,e){return n<t?t:n>e?e:n}function VS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},f=new ze,d=new ze;d.name="pelvis",d.position.y=n.legLength,f.add(d);const u=new ze;u.name="lower";const m=new ze;m.name="upper",d.add(u),d.add(m);const _=[],g=(tt,vt,Nt,ot)=>{const wt=new ao({color:ot}),O=new _e(new ri(tt,vt,Nt),wt);return O.castShadow=!0,O.receiveShadow=!0,_.push(wt),O},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,m.add(E);const T=new ze;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const tt of[-1,1]){const vt=g(.06,.07,.02,t.shoe);vt.position.set(tt*.09,p/2+.03,p/2+.011),T.add(vt)}const M=(tt,vt)=>{const Nt=vt?x:y,ot=new ze;ot.name=vt?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",vt||(ot.rotation.order="ZYX"),ot.position.set(tt*(vt?S/2+v/2:S/2-v/2),vt?w-.04:0,0),(vt?m:u).add(ot);const wt=g(v,Nt/2,v,t.limb);wt.position.y=-Nt/4,ot.add(wt);const O=new ze;O.name=vt?"elbow":"knee",O.position.y=-Nt/2,ot.add(O);const ct=g(v,Nt/2,v,t.limb);if(ct.position.y=-Nt/4,O.add(ct),!vt){const gt=g(v*1.15,.07,v*1.7,t.shoe);gt.position.set(0,-Nt/2+.035,.045),O.add(gt);const Vt=new qe;return Vt.name="footTip",Vt.position.y=-Nt/2,O.add(Vt),{root:ot,joint:O,tip:Vt}}return{root:ot,joint:O}},R=M(-1,!1),z=M(1,!1),I=M(-1,!0),U=M(1,!0),C=[R,z].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:y/2,lowerLen:y/2,bend:1})),k=new on({color:a.attackArcColor,transparent:!0,opacity:0,side:$e,depthWrite:!1}),G=new _e(new zr(.62,.042,6,20,Math.PI*1.1),k);G.position.set(0,.78-y,.56),m.add(G);const N=new ae(e),Z=new ae(r.flashColor),st=new ae;let mt=null,dt=0,ft=0,at=0,j=0,pt=0,K=0,Q=0,q={...Lh},St=-1,At=0,bt=0,Ft=0,H=0,ee=0,yt=0,Bt=0,kt=1,Dt=0,Rt=0,L="none",A=0,Y=!1,ht=-1,J=!1,rt=0,Ut=0;return{group:f,boneAtWorld(tt,vt,Nt){const ot=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:U.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],wt=new B,O=new B,ct=new B(tt,vt,Nt),gt=new B;let Vt=null,Ot=Number.POSITIVE_INFINITY;for(const qt of ot){qt.node.updateWorldMatrix(!0,!1),wt.set(qt.ax,qt.ay,qt.az),O.set(qt.bx,qt.by,qt.bz),qt.node.localToWorld(wt),qt.node.localToWorld(O);const F=O.x-wt.x,Pt=O.y-wt.y,it=O.z-wt.z,lt=F*F+Pt*Pt+it*it;let Lt=lt>1e-8?((ct.x-wt.x)*F+(ct.y-wt.y)*Pt+(ct.z-wt.z)*it)/lt:0;Lt=Math.max(0,Math.min(1,Lt));const Ct=wt.x+F*Lt,Qt=wt.y+Pt*Lt,oe=wt.z+it*Lt,pe=(ct.x-Ct)**2+(ct.y-Qt)**2+(ct.z-oe)**2;pe<Ot&&(Ot=pe,Vt=qt.node,gt.set(Ct,Qt,oe))}return Vt?{node:Vt,point:gt.clone()}:null},update(tt,vt){f.position.set(tt.position.x,tt.position.y,tt.position.z),f.rotation.y=tt.bodyYaw,T.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==mt&&(mt=tt.mode,dt=1),dt=Math.max(0,dt-vt*2.2);const Nt=tt.hurt,ot=zp(Nt,tt.bodyYaw,r),wt=ot.flash;st.copy(Z).multiplyScalar(wt);for(const Ht of _)Ht.emissive.copy(N).multiplyScalar(dt*.5),wt>0&&Ht.emissive.add(st);d.position.set(0,y,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),u.position.set(0,0,0),u.rotation.z=0;const O=Math.hypot(tt.velocity.x,tt.velocity.z),ct=Vn(o.knockGaitScale??0,0,1),gt=tt.hurt.knockX*ct,Vt=tt.hurt.knockZ*ct,Ot=ct>0&&Math.hypot(tt.hurt.knockX,tt.hurt.knockZ)>.001,qt=tt.velocity.x+gt,F=tt.velocity.z+Vt,Pt=Math.hypot(qt,F),it=Math.cos(tt.bodyYaw),lt=-Math.sin(tt.bodyYaw),Lt=O>1e-6?Vn((tt.velocity.x*it+tt.velocity.z*lt)/O,-1,1):0,Ct=O>1e-6?Vn((tt.velocity.x*Math.sin(tt.bodyYaw)+tt.velocity.z*Math.cos(tt.bodyYaw))/O,-1,1):1,Qt=Ch(Ct,o.backStrafeStartDeg,o.backStrafeFullDeg);L==="settled"&&J&&rt>Ut*1.02+1e-4&&(L="none");let oe=1;L==="blend"?(oe=Lp(Y?ht:A,o.stopYawBlendMode,Y),Y||(A=Math.min(1,A+vt/Math.max(.01,o.stopYawAfterSec)),(A>=1||o.stopYawBlendMode==="inStop"||J)&&(L="settled",oe=0))):L==="settled"&&(oe=Vn(O/Math.max(1e-6,o.stopEnterRatio*s),0,1));const pe=Tp(Lt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),se=Ap(Ct,Lt,pe,Qt)*oe;Dt+=(se-Dt)*(1-Math.exp(-12*Math.max(0,vt))),u.rotation.y=Dt;const Pe=tt.bodyYaw+Dt,Be=Math.sin(Pe),nn=Math.cos(Pe),gn=Math.cos(Pe),Fe=-Math.sin(Pe),he=qt*Be+F*nn,We=qt*gn+F*Fe,Fn=Math.max(0,o.stopBlendSec||0),Qe=Fn>0&&!Ot,Sn=Rp(O,Rt,s,o.stopEnterRatio,o.stopExitRatio);if(!Qe||Sn.resume)St=-1;else if(St<0&&Sn.enter){St=0,At=tt.gaitPhase,bt=wp(tt.gaitPhase),Ft=O,H=Math.max(tt.stride,1e-6),ee=he,yt=We;const Ht=1/Math.max(1e-6,O);Bt=tt.velocity.x*Ht,kt=tt.velocity.z*Ht}const xn=Rt;Rt=O;const X=Qe&&St>=0;X&&(St=Math.min(1,St+vt/Fn)),X&&L!=="blend"&&(L="blend",A=0),Y=X&&St<1,ht=St,J=Sn.resume,rt=O,Ut=xn;const It=X?{phase:At,speed:Ft,moveSpeed:s,localForward:ee,localRight:yt,legLength:n.legLength,stride:H,grounded:!0}:{phase:tt.gaitPhase,speed:Pt,moveSpeed:s,localForward:he,localRight:We,legLength:n.legLength,stride:tt.stride,grounded:!0},Mt=X?Ep(It,o,{progress:St,phase0:At,phaseEnd:bt}):wr(It,o);let ne=0,re=0,P=0,V=0;if(X){const Ht=Cp(tt.bodyYaw,Bt,kt),Yt=Dp(St,At,Ht.forward,Ht.right,o);Yt.leadLeft?(Mt.legL.pitchX-=Yt.leadPitch,Mt.legL.kneeX+=Yt.leadKnee,Mt.legR.pitchX+=Yt.trailPitch):(Mt.legR.pitchX-=Yt.leadPitch,Mt.legR.kneeX+=Yt.leadKnee,Mt.legL.pitchX+=Yt.trailPitch),re=Yt.bodyShift*Yt.fwdN,ne=Yt.bodyShift*Yt.rightN,P=Yt.bodyDip,V=Yt.chestPitch}R.root.rotation.x=Mt.legL.pitchX,z.root.rotation.x=Mt.legR.pitchX,R.root.rotation.z=Mt.legL.rollZ,z.root.rotation.z=Mt.legR.rollZ,R.joint.rotation.x=Mt.legL.kneeX,z.joint.rotation.x=Mt.legR.kneeX,I.root.rotation.x=Mt.armL,U.root.rotation.x=Mt.armR,I.joint.rotation.x=-.18,U.joint.rotation.x=-.18,d.position.x=Mt.pelvisX,d.position.y=y+Mt.pelvisY,d.position.z=0,d.rotation.z=Mt.pelvisRoll,m.rotation.z=Mt.sideLean*(ot.intensity>0?.4:1);const nt=Op(d,u),et=X&&h.enabled?{...h,weight:1}:h,W=et.enabled&&et.weight>0?Vn(et.weight,0,1):0;if(d.position.x+=ne,d.position.z+=re,d.position.y-=P,u.position.y+=P,W<=0&&(u.position.x-=ne,u.position.z-=re),l){const Ht=Math.max(.004166666666666667,Math.min(vt,.1)),Yt=Math.sin(tt.bodyYaw),Xt=Math.cos(tt.bodyYaw),ce=Vn((tt.velocity.x-ft)/Ht,-60,60),ye=Vn((tt.velocity.z-at)/Ht,-60,60),Se=ce*Yt+ye*Xt,Te=Xe(tt.bodyYaw-j)/Ht,de=l.maxForwardDeg*Math.PI/180,jt=l.maxSideDeg*Math.PI/180,an=1-Math.exp(-Math.max(0,l.smoothing)*Ht);pt+=(Vn(Se*l.accelGain,-de,de)-pt)*an,K+=(Vn(-Te*O*l.turnGain,-jt,jt)-K)*an;const _t=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;Q+=(Vn(O/Math.max(s,1e-6),0,1)-Q)*(1-Math.exp(-Math.max(0,_t)*Ht));const Tt=Fp({leanForward:pt,leanSide:K,speedRatio:Q},l);m.rotation.x+=pt+V,m.rotation.z+=K,d.rotation.x+=Tt.pelvisPitch,d.rotation.z+=Tt.pelvisRoll,d.position.x+=Tt.pelvisX,d.position.z+=Tt.pelvisZ,d.position.y-=Tt.crouch,u.position.y+=Tt.crouch*(1-W)}ft=tt.velocity.x,at=tt.velocity.z,j=tt.bodyYaw,m.rotation.x+=ot.upperPitch,m.rotation.z+=ot.upperRoll,m.rotation.y+=ot.upperYaw;const Et=Vn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),zt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Vn(ot.upperShiftX*Et,-zt,zt),m.position.z+=Vn(ot.upperShiftZ*Et,-zt,zt),d.position.x+=ot.comX,d.position.z+=ot.comZ-ot.pelvisBack,d.position.y-=ot.drop;const $t=ot.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(u.position.z+=ot.pelvisBack*(1-$t),u.position.y+=ot.drop*(1-$t),R.joint.rotation.x+=ot.knee,z.joint.rotation.x+=ot.knee,R.root.rotation.x-=ot.hip,z.root.rotation.x-=ot.hip,I.root.rotation.x+=ot.arm,U.root.rotation.x+=ot.arm*.8,tt.attackPhase!=="idle"&&ot.intensity===0){const Ht=tt.attackProgress,Yt=Ht<.34?-1:Ht<.68?-1+(Ht-.34)/.34*2:Math.max(0,1-(Ht-.68)/.32),Xt=Math.max(0,-Yt),ce=Math.max(0,Yt);U.root.rotation.x=-1.7*Xt+1.25*ce,U.joint.rotation.x=-(.25+Xt*.45),m.rotation.y=-.28*Yt,k.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&(G.rotation.z=-1.1+Ht*3)}else k.opacity=0;const Zt=Pp(Dt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Zt,T.rotation.y=(tt.headYaw-tt.bodyYaw-Zt+Math.PI*3)%(Math.PI*2)-Math.PI,q=Bp({root:f,pelvis:d,lower:u,limbs:C,base:nt,cfg:et,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return q},dispose(){f.traverse(tt=>{if(tt instanceof _e){tt.geometry.dispose();const vt=tt.material;Array.isArray(vt)?vt.forEach(Nt=>Nt.dispose()):vt.dispose()}})}}}const la=.012,ha=.016;function XS(n,t){const e=t.lab,i=new ze;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=la){const S=l(new on({color:x,transparent:!0,opacity:v,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new _e(y,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function f(y,x){return c(new io(Math.max(y,.001),x,72))}function d(y,x,v,w=ha){const E=document.createElement("canvas"),T=E.getContext("2d");if(!T)return new _e;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,E.width=Hd.ceilPowerOfTwo(Math.ceil(T.measureText(y).width)+32),E.height=Hd.ceilPowerOfTwo(96*1.4);const M=E.getContext("2d");if(!M)return new _e;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(y,E.width/2,E.height/2);const R=new $l(E);R.colorSpace=Cn,s.push(R);const z=E.width/E.height,I=c(new $n(x*z,x)),U=l(new on({map:R,transparent:!0,depthWrite:!1,side:$e,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),C=new _e(I,U);return C.rotation.x=-Math.PI/2,C.position.y=w,C.renderOrder=3,C}function u(y,x,v,w,S,E){const T=v-x,b=c(new $n(T,w)),M=h(b,S,E,la);M.position.set(T/2+x,la,0);const R=new ze;return R.add(M),R.rotation.y=y-Math.PI/2,R}function m(y,x,v,w,S){const E=new xp;E.moveTo(0,x*.5),E.lineTo(-v*.5,x*.5-v*.9),E.lineTo(-v*.18,x*.5-v*.9),E.lineTo(-v*.18,-x*.5),E.lineTo(v*.18,-x*.5),E.lineTo(v*.18,x*.5-v*.9),E.lineTo(v*.5,x*.5-v*.9),E.closePath();const T=c(new Ph(E)),b=h(T,w,S,la+.002),M=new ze;return M.add(b),M.rotation.y=y+Math.PI,M}function _(y){var T;const x=new ze,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;x.add(v);const E=h(c(new $n(S*.98,.08)),y.color,.7,ha);return E.position.set(0,ha,t.lab.labelTextHeight*.66),x.add(E),x.position.set(y.labelX,0,y.labelZ),x}const g=new ze;for(const y of n??[]){const x=new ze;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new $n(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,b,M,R]of E){const z=h(c(new $n(M,R)),y.color,e.padOpacity);z.position.x=T,z.position.z=b,x.add(z)}}else x.add(h(c(new Eh(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(f(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const E of[0,Math.PI])x.add(u(w+E,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(f(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,E=h(c(new $n(.06,S)),y.color,.36);E.position.set(0,la,(v+w)/2),x.add(E);let T=0;for(let M=v;M>=w-.01;M-=1,T++){const R=T%5===0,z=h(c(new $n(R?2.4:1.3,R?.1:.07)),y.color,R?.72:.42);z.position.set(0,la,M),x.add(z);const I=d(String(T),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");I.position.set(1.6,ha,M),x.add(I)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of b){const z=v-M,I=h(c(new $n(1.9,.09)),"#ffffff",.5);I.position.set(-1.5,la,z),x.add(I);const U=d(R,.42,"rgba(220, 236, 250, 0.86)");U.position.set(-3,ha,z),x.add(U)}}else if(y.id==="gait"){x.add(h(f(1.44,1.5),y.color,.5)),x.add(h(f(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,T]of w){const M=Math.sin(S),R=Math.cos(S),z=m(S,1.7,.34,T,.75);z.position.set(M*1.7*.5,0,v+R*1.7*.5),x.add(z);const I=d(E,.44,T);I.position.set(M*(1.7+.7),ha,v+R*(1.7+.7)),x.add(I)}}if(g.add(x),e.showLabels){const v=_(y);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),ha,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const Dh=64,Hp=[0,.24,.76,1],WS=[0,1,1,0],Gp=[0,.12,.28,.5,.72,.88,1],YS=[0,.16,.5,1,.5,.16,0];function Ju(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function kh(n,t,e,i,a=Dh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Gp:Hp,c=s==="glow"?YS:WS,h=l.length,f=a+1,d=new Float32Array(f*h*3),u=new Float32Array(f*h*4),m=[];for(let g=0;g<f;g++){const p=g/a,y=(p-.5)*e,x=Ju(p,i)*Ju(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*E,d[T*3+1]=0,d[T*3+2]=w*E;const b=x*c[S];u[T*4]=1,u[T*4+1]=1,u[T*4+2]=1,u[T*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const y=g*h+p,x=y+h;m.push(y,x,y+1,y+1,x,x+1)}const _=new en;return _.setAttribute("position",new mn(d,3)),_.setAttribute("color",new mn(u,4)),_.setIndex(m),_.computeBoundingSphere(),_}function Wc(n){const t=new on({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,f=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(f*20)}`,u=e.get(d);if(u)return u;const m=kh(n.radius,n.thickness*f,h,n.edgeFade,Dh,n.profile??"band");if(e.set(d,m),e.size>64){for(const[_,g]of e)if(_!==d&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new _e(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,f,d,u=1){const m=Math.max(.05,u);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(f),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Qu(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function $S(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),f=4+4*r+6*l,d=.5+.5*Math.sin(i*f),u=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:u,scale:m,level:r}}function ZS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function qS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,f=Math.sin(h),d=Math.cos(h);for(let u=0;u<a;u++){const m=u/e,_=t+(1-t)*m,g=c*a+u;s[g*3]=f*_,s[g*3+1]=0,s[g*3+2]=d*_;const p=Math.pow(1-m,1.8)*.9+(u===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const f=c*a+h,d=f+a;r.push(f,d,f+1,f+1,d,d+1)}const l=new en;return l.setAttribute("position",new mn(s,3)),l.setAttribute("color",new mn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function tf(n){const t=n.segments??Dh,e=n.profile??"band",a=((e==="glow"?Gp.length:Hp.length)-1)*6,s=kh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),r=new _e(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,f,d,u=1){const m=Math.min(1,Math.max(0,c)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=_,o.opacity=h,o.color.copy(f),r.scale.set(u,1,u),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function ef(n){const t=new ze,e=qS(48),i=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),a=new _e(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=kh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new on({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:$e,vertexColors:!0,toneMapped:!1}),l=new _e(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,f,d,u,m){const _=Math.min(1,Math.max(0,u));t.position.set(c,f,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function nf(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function jS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function KS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function JS(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function QS(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function tw(n,t,e){return n?t:e}function Vp(n){return{x:0,y:0,z:1}}function ew(n){return Math.asin(Vp().y)}function nw(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const iw=9.81;function Os(n,t,e){return n<t?t:n>e?e:n}function aw(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:iw,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,l+=b.x*M,c+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const f=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),u=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:u,centerZ:m,halfX:f,halfZ:d};const g=Os((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-u)/f,w=Math.abs(x-m)/d,S=Os(1-Math.max(v,w),0,1),E=Math.max(0,Math.abs(y-u)-f),T=Math.max(0,Math.abs(x-m)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:u,centerZ:m,halfX:f,halfZ:d,marginX:Os(1-v,-1,1),marginZ:Os(1-w,-1,1),score:S,leanDeg:Math.atan2(y-u,x-m)*180/Math.PI,side:v>.98?y>u?1:-1:0,overX:E,overZ:T,grounded:!0}}function sw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function ow(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Os(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Kl={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},rw=1e-6;function Xn(n,t,e){return n<t?t:n>e?e:n}function Yc(n,t){const e=Math.max(.2,n);return Xn(Math.pow(e,-t),.5,2)}function cw(n,t){if(!t.enabled)return{...Kl};const e=Xn(n.swing,-1,1),i=Xn(n.charge,0,1),a=Xn(n.impact,0,1),s=Xn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Xn(t.chargeArm,.6,1),f=1-(1-h)*c,d=1-(1-h)*i;let u=1;o>0?u=l:c>0?u=f:i>0&&(u=d);const m=1-Xn(t.impactSquash,0,.6)*a;u*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Xn(t.impactSquash,0,.6)*a*.6),y=Xn(t.torsoGain,0,1),x=1+(u-1)*y;return u=Xn(u,.6,1.6),{arm:u,leg:Xn(p,.6,1.4),torso:Xn(x,.7,1.4),girthArm:Yc(u,t.volumeExp),girthLeg:Yc(p,t.volumeExp),girthTorso:Yc(x,t.volumeExp)}}function lw(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function hw(n,t,e){const i=n*Math.exp(-Math.max(rw,e)*Math.max(0,t));return i<.001?0:Xn(i,0,1)}const af=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function cs(n,t,e){return n<t?t:n>e?e:n}function Ne(n,t,e){return n+(t-n)*e}function dw(n){return n?typeof n=="string"?{clip:n}:n:null}function uw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function fw(n,t){const e=n%3*2,i=af[e],a=af[e+1];return{...uw(),bodyYaw:Ne(i.yaw,a.yaw,t),bodyPitch:Ne(i.pitch,a.pitch,t),bodyRoll:Ne(i.roll,a.roll,t),pelvisX:Ne(i.px,a.px,t),pelvisZ:Ne(i.pz,a.pz,t),armPitch:Ne(i.ap,a.ap,t),armYaw:Ne(i.ay,a.ay,t),armRoll:Ne(i.ar,a.ar,t),elbow:Ne(i.el,a.el,t),bladePitch:Ne(i.blade,a.blade,t)}}function pw(n,t,e,i,a=0){var b,M,R;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=dw(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=cs(((R=i.weaponScale)==null?void 0:R[n])??1,0,2),f=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,u=d*f,m=cs((e+1)/2,0,1),_=c&&c.keys.length>0?og(c,m):fw(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&ta(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&ta(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*u,rootYaw:_.rootYaw*u,spinYaw:rg(c,cs(a,0,1)),pitch:_.bodyPitch*u,roll:_.bodyRoll*u,pelvisZ:_.pelvisZ*u,pelvisX:_.pelvisX*u,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&ta(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},E=c?ta(c,"armLPitch")||ta(c,"armLYaw")||ta(c,"armLRoll")||ta(c,"elbowL"):!1,T=E?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=T)),w}function mw(n,t,e){const i=cs(e,0,1),a=(s,o)=>s?o?{pitch:Ne(s.pitch,o.pitch,i),yaw:Ne(s.yaw,o.yaw,i),roll:Ne(s.roll,o.roll,i),elbow:Ne(s.elbow,o.elbow,i)}:null:o;return{yaw:Ne(n.yaw,t.yaw,i),rootYaw:Ne(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Ne(n.pitch,t.pitch,i),roll:Ne(n.roll,t.roll,i),pelvisZ:Ne(n.pelvisZ,t.pelvisZ,i),pelvisX:Ne(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Ne(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Ne(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Ne(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Ne(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Ne(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Ne(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Ne(n.strike,t.strike,i),blend:t.blend??null}}function gw(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function sf(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function xw(n,t){const e=(a,s)=>Math.abs(gw(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=sf(n.armR,t.armR),i+=sf(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function vw(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=cs(xw(n,t)/l,0,1);return o+(r-o)*c}function of(n){const t=cs(n,0,1);return t*t*(3-2*t)}function fe(n,t,e){return n<t?t:n>e?e:n}const Ri=1e-6;function Ge(n,t,e,i){const a=new _e(new ri(n,t,e),new ao({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ye(){return new ze}function lr(n,t,e){const i=Ye(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function yw(n){const t=lr(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function _w(n){const t=Ye(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Mw(n){const t=Ye(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ae(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function bw(n){const t=Ye();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Sw(n){const t=Ye(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function ww(n,t,e,i,a,s,o,r,l,c,h,f,d){const u=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=f??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=Ye(),x=Ye();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=Ye();v.name="lower";const w=Ye();w.name="upper",x.add(v),x.add(w);const S=n.headSize,E=n.legLength,T=n.armLength,b=n.limbThickness,M=n.bodyHeight,R=n.bodyWidth,z=l.spine,I=!!(z!=null&&z.enabled),U=I?fe(z.chestPivot??.42,.15,.85)*M:0,C=Ye();C.name="chest",C.position.y=U,w.add(C);const k=I?C:w;let G,N=null,Z=M,st=0;I?(Z=Math.max(.05,U),st=Math.max(.05,M-U),G=Ge(R,Z,.28,t.body),G.name="torsoLower",G.position.y=Z/2,w.add(G),N=Ge(R+.008,st,.288,t.body),N.name="torsoUpper",N.position.y=st/2,C.add(N)):(G=Ge(R,M,.28,t.body),G.name="torso",G.position.y=M/2,w.add(G));const mt=Ye();mt.name="headPivot",mt.rotation.order="YXZ",mt.position.y=Math.min(i.headPivotHeight,M)-U,k.add(mt);const dt=Ge(S,S,S,t.head);dt.position.y=S/2,mt.add(dt);const ft=new ao({color:"#1b2733"});for(const D of[-1,1]){const $=new _e(new ri(.06,.07,.02),ft);$.position.set(D*.09,S/2+.03,S/2+.011),mt.add($)}const at=D=>{const $=Ye();$.name=D<0?"hipL":"hipR",$.rotation.order="ZYX",$.position.set(D*(R/2-b/2),0,0),v.add($);const ut=Ge(b,E/2,b,t.limb);ut.position.y=-E/4,$.add(ut);const xt=Ye();xt.name="knee",xt.position.y=-E/2,$.add(xt);const Jt=Ge(b,E/2,b,t.limb);Jt.position.y=-E/4,xt.add(Jt);const Kt=Ge(b*1.15,.07,b*1.7,t.shoe);Kt.position.set(0,-E/2+.035,.045),xt.add(Kt);const le=new qe;le.name="footTip",le.position.y=-E/2,xt.add(le);const Me=Ye();return{root:$,joint:xt,hand:Me,wrist:Me,tip:le,upperMesh:ut,lowerMesh:Jt,segLen:E/2}},j=D=>{const $=Ye();$.name=D<0?"shoulderL":"shoulderR",$.rotation.order="YXZ",$.position.set(D*(R/2+b/2),M-.04-U,0),k.add($);const ut=Ge(b,T/2,b,t.limb);ut.position.y=-T/4,$.add(ut);const xt=Ye();xt.name="elbow",xt.position.y=-T/2,$.add(xt);const Jt=Ge(b,T/2,b,t.limb);Jt.position.y=-T/4,xt.add(Jt);const Kt=Ye();Kt.name=D<0?"handL":"handR",Kt.position.y=-T/2,xt.add(Kt);const le=Ge(b*1.1,.09,b*1.1,t.head);le.position.y=.045,Kt.add(le);const Me=Ye();return Me.name=D<0?"wristL":"wristR",Kt.add(Me),{root:$,joint:xt,hand:Kt,wrist:Me,upperMesh:ut,lowerMesh:Jt,segLen:T/2}},pt=at(-1),K=at(1),Q=j(-1),q=j(1),St=[pt,K].map(D=>({root:D.root,joint:D.joint,tip:D.tip,upperLen:E/2,lowerLen:E/2,bend:1})),At=Ye(),bt=Ye();At.name="mountR",bt.name="mountL";const Ft=Ye(),H=Ye();Ft.name="gripR",H.name="gripL",q.wrist.add(At),Q.wrist.add(bt),At.add(Ft),bt.add(H);const ee=Mw(t),yt=bw(t),Bt=Sw(t),kt={"sword-shield":{right:lr(.42,.075,t),left:_w(t)},"dual-swords":{right:lr(.42,.075,t),left:lr(.42,.075,t)},greatsword:{right:yw(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:ee.g,left:Ye(),orb:ee.orb},bow:{right:Bt,left:yt.g,arrow:Bt,drawString:yt.drawString}};for(const D of Object.keys(kt))Ft.add(kt[D].right),H.add(kt[D].left),kt[D].right.visible=!1,kt[D].left.visible=!1;function Dt(D,$,ut){const xt=new qe;xt.name="bladeBase",xt.position.y=$,D.add(xt);const Jt=new qe;Jt.name="bladeTip",Jt.position.y=ut,D.add(Jt)}Dt(kt["sword-shield"].right,.44,.55),Dt(kt["dual-swords"].right,.44,.55),Dt(kt["dual-swords"].left,.44,.55),Dt(kt.greatsword.right,.74,.88),Dt(kt.staff.right,.78,.92);let Rt=null,L=null,A=1,Y=0,ht=0,J=null,rt=0,Ut=0,tt=0,vt=0,Nt=0,ot=0,wt=OS(),O={...Lh},ct=0,gt=0,Vt=0,Ot=-1,qt=0,F=0,Pt=0,it=0,lt=0,Lt=0,Ct=0,Qt=1,oe=0,pe=0,se=0,Pe=!1,Be=0,nn=0,gn=0,Fe=0,he="none",We=0,Fn=1,Qe=!1,Sn=-1,xn=!1,X=0,It=0,Mt=0,ne={...Kl},re=0,P=0,V={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},nt=NaN,et=0,W=0,Et=0,zt=NaN,$t=NaN,Zt=-1,Ht=null,Yt=null,Xt=0,ce=1,ye=.1,Se=null,Te={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},de=null,jt=null,an=null,_t=null,Tt=null,ie=null,Ae="R",Ue=0,xe=0,we=0,wn=0,fn=1,He=0,vn=null,Un=0,ys=0,_s=NaN,Ih=NaN,Fr={speed:0,phase:0},Ms={lp:0,lr:0,rp:0,rr:0},Xp=0,Ur=0,Nr=!0,Or=0,bs="none",wa=0,Ea=0,Ta=0,co=.3,zh=0;function Wp(D){const $=Math.PI/180,ut=s;let xt=0,Jt=0,Kt=0,le=0;D==="sword-shield"?(xt=ut.swordPitchDeg*$,Kt=ut.shieldPitchDeg*$):D==="dual-swords"?(xt=ut.swordPitchDeg*$,Kt=ut.swordPitchDeg*$):D==="greatsword"?(xt=ut.greatswordPitchDeg*$,Kt=ut.greatswordPitchDeg*$):D==="staff"?xt=ut.staffPitchDeg*$:Kt=ut.bowPitchDeg*$,At.rotation.set(xt,0,Jt),bt.rotation.set(Kt,0,le),At.position.x=D==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Fh(D){if(D!==Rt){Rt=D;for(const $ of Object.keys(kt))kt[$].right.visible=$===D,kt[$].left.visible=$===D;Wp(D),yt.drawString.position.z=-.06,Bt.position.z=0,ee.orb.scale.setScalar(1),w.rotation.y=0}}Fh("sword-shield");const Uh=[];y.traverse(D=>{D instanceof _e&&D.material instanceof ao&&Uh.push(D.material)});const Yp=new ae(r.flashColor);function $p(D,$){const ut=zp(D,$,r);wt=ut,w.rotation.x+=ut.upperPitch,w.rotation.z+=ut.upperRoll,w.rotation.y+=ut.upperYaw;const xt=fe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=fe(ut.upperShiftX*xt,-Jt,Jt),w.position.z+=fe(ut.upperShiftZ*xt,-Jt,Jt),x.position.x+=ut.comX,x.position.z+=ut.comZ-ut.pelvisBack,x.position.y-=ut.drop;const Kt=ut.legacy?0:fe(r.lowerScale,0,1);v.position.z+=ut.pelvisBack*(1-Kt),v.position.y+=ut.drop*(1-Kt),pt.joint.rotation.x+=ut.knee,K.joint.rotation.x+=ut.knee,pt.root.rotation.x-=ut.hip,K.root.rotation.x-=ut.hip,Q.root.rotation.x+=ut.arm,q.root.rotation.x+=ut.arm*.8;for(const le of Uh)le.emissive.copy(Yp).multiplyScalar(ut.flash)}function lo(D){return D<.22?-1:D<.42?-1+(D-.22)/.2*2:D<.5?1:Math.max(0,1-(D-.5)/.5)}function Zp(D){for(const $ of[Q,q])$.upperMesh.scale.set(D.girthArm,D.arm,D.girthArm),$.upperMesh.position.y=-$.segLen/2*D.arm,$.joint.position.y=-$.segLen*D.arm,$.lowerMesh.scale.set(D.girthArm,D.arm,D.girthArm),$.lowerMesh.position.y=-$.segLen/2*D.arm,$.hand.position.y=-$.segLen*D.arm;for(const $ of[pt,K])$.upperMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),$.upperMesh.position.y=-$.segLen/2*D.leg,$.joint.position.y=-$.segLen*D.leg,$.lowerMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),$.lowerMesh.position.y=-$.segLen/2*D.leg,$.tip.position.y=-$.segLen*D.leg;G.scale.set(D.girthTorso,D.torso,D.girthTorso),G.position.y=Z/2*D.torso,N&&(N.scale.set(D.girthTorso,D.torso,D.girthTorso),N.position.y=st/2*D.torso,C.position.y=Z*D.torso)}function qp(D,$){const ut=s.twoHandGripY??-.16,xt=Math.max(1,s.twoHandMaxStretch??1.25),Jt=T*xt*.99,Kt=Q.root.position.x,le=Q.root.position.y,Me=Q.root.position.z,ve=Q.root.rotation.y,Ve=Math.cos(ve),ln=Math.sin(ve),je=Ui=>{const Ra=At.localToWorld(new B(0,Ui,0)),Tn=(I?C:w).worldToLocal(Ra),Pa=Tn.x-Kt,Gr=Tn.y-le,fo=Tn.z-Me,Ca={x:Pa*Ve-fo*ln,y:Gr,z:Pa*ln+fo*Ve};return{t:Ca,dist:Math.hypot(Ca.x,Ca.y,Ca.z)}};let be=ut,Ce=je(be);if(!Number.isFinite(Ce.dist)||Ce.dist<=Ri)return;for(let Ui=0;Ui<18&&Ce.dist>Jt;Ui++)if(be*=.78,Ce=je(be),!Number.isFinite(Ce.dist)||Ce.dist<=Ri)return;Number.isFinite(nt)||(nt=be);const sn=Math.max(0,s.twoHandSlideRate??9);nt+=(be-nt)*(1-Math.exp(-sn*$));const En=je(nt),Je=En.t,jn=En.dist,Nn=jn/Math.max(Ri,T),Kn=fe(Nn,1,xt),ci=Math.max(1,s.twoHandGripStart??1.02),zi=Math.max(ci+.001,xt),Fi=fe(s.twoHandMinGrip??1,0,1),On=fe((Nn-ci)/(zi-ci),0,1),li=1-On*On*(3-2*On)*(1-Fi),Bn=T/2*Kn,Aa=Up(Je,Bn,Bn,-1),Mi=Np({rootPitch:Q.root.rotation.x,rootRoll:Q.root.rotation.z,jointPitch:Q.joint.rotation.x},Aa,fe(D*li,0,1),Math.PI);Q.root.rotation.x=Mi.rootPitch,Q.root.rotation.z=Mi.rootRoll,Q.joint.rotation.x=Math.min(Mi.jointPitch,-.06);const Jn=1/Math.sqrt(Kn);Q.upperMesh.scale.set(Jn,Kn,Jn),Q.upperMesh.position.y=-Bn/2,Q.joint.position.y=-Bn,Q.lowerMesh.scale.set(Jn,Kn,Jn),Q.lowerMesh.position.y=-Bn/2,Q.hand.position.y=-Bn,V={active:!0,dist:jn,gy:nt,pitch:Mi.rootPitch,joint:Q.joint.rotation.x,grip:li}}function jp(D,$){if(!m.enabled){et=0,W=0,q.wrist.rotation.set(0,0,0),zt=q.root.rotation.x,$t=Gh();return}const ut=q.root.rotation.x,xt=Gh();if($!==Zt){Zt=$,zt=ut,$t=xt,q.wrist.rotation.set(et,0,W);return}if(!Number.isFinite(zt)||D<=1e-5){zt=ut,$t=xt,q.wrist.rotation.set(et,0,W);return}const Jt=(ut-zt)/D,Kt=Xe(xt-$t)/D;zt=ut,$t=xt;const le=Math.max(0,m.maxAngle),Me=Math.max(0,m.maxTwist),ve=.15+.85*fe(xe,0,1),ln=-fe(Et,0,1.4)*Math.max(0,m.runDrag),je=fe(-Jt*m.lag*ve+ln,-le,le),be=fe(Kt*m.twistLag*ve,-Me,Me),Ce=1-Math.exp(-Math.max(0,m.rate)*D);et+=(je-et)*Ce,W+=(be-W)*Ce,q.wrist.rotation.set(et,0,W)}function Kp(D){const $=Math.PI/180;return D==="greatsword"?s.greatswordPitchDeg*$:D==="staff"?s.staffPitchDeg*$:D==="bow"?s.bowPitchDeg*$:s.swordPitchDeg*$}function Br(D){const $=Math.PI/180;return D==="sword-shield"?s.shieldPitchDeg*$:D==="greatsword"?s.greatswordPitchDeg*$:D==="bow"?s.bowPitchDeg*$:s.swordPitchDeg*$}function Jp(D){const $=Math.PI/180;return D==="sword-shield"||D==="dual-swords"?(s.swordCantDeg??0)*$:D==="greatsword"?(s.greatswordCantDeg??0)*$:0}function Qp(D,$){const ut=D.weapon;if(ut==="staff"||ut==="bow")return;const xt=Ae==="R",Jt=xt?q:Q,Kt=xt?At:bt,le=xt?Q:q,Me=xt?bt:At,ve=ut==="greatsword"&&xt?ot:0,Ve=ut==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,ln=Math.PI/180,je=-Ve*ln,be=Ve*ln,Ce=(On,li)=>{const Bn=Math.max(0,Math.PI/2-Math.abs(li));return Math.sign(On)*Math.min(Math.abs(On),Bn)},sn=(de??Kp(ut)+Y)+ve,En=$+Jt.root.rotation.x+Jt.joint.rotation.x;Kt.rotation.set(Math.PI/2-sn-En,0,Ce(xt?je:be,sn));const Je=jt??(ut==="sword-shield"?null:Br(ut)+ht),jn=$+le.root.rotation.x+le.joint.rotation.x;ut==="sword-shield"?Me.rotation.x=Je===null?Br(ut):Br(ut)-Je-jn:Me.rotation.set(Math.PI/2-(Je??0)-jn,0,Ce(xt?be:je,Je??0));const Nn=Jp(ut),Kn=Tt??0,ci=ie??0,zi=an??0,Fi=_t??0;xt?(Ft.rotation.z=-Nn+Kn,Ft.rotation.y=zi,H.rotation.z=Nn+ci,H.rotation.y=Fi):(H.rotation.z=Nn+Kn,H.rotation.y=zi,Ft.rotation.z=-Nn+ci,Ft.rotation.y=Fi)}function Nh(D){de=D.bladePitch,jt=D.bladePitchOff,an=D.bladeTwist,_t=D.bladeTwistOff,Tt=D.bladeYaw,ie=D.bladeYawOff,Ae=D.lead,Ue=D.rootYaw+D.spinYaw,y.rotation.y=Ue,w.rotation.y+=D.yaw,w.rotation.x+=D.pitch,w.rotation.z+=D.roll,x.position.z+=D.pelvisZ,x.position.x+=D.pelvisX,D.armR&&(q.root.rotation.x=D.armR.pitch,q.root.rotation.y=D.armR.yaw,q.root.rotation.z=D.armR.roll,q.joint.rotation.x=D.armR.elbow),D.armL&&(Q.root.rotation.x=D.armL.pitch,Q.root.rotation.y=D.armL.yaw,Q.root.rotation.z=D.armL.roll,Q.joint.rotation.x=D.armL.elbow)}function Oh(D,$){const ut=Se??lo(D.attackProgress),xt=pw(D.weapon,D.comboIndex,ut,p,D.attackProgress);if(D.comboIndex!==Xt){Yt=Ht,ce=0,Xt=D.comboIndex;const le=D.timings.windup+D.timings.active+D.timings.recovery,Me=Math.max(p.segBlendMin??.03,le*.22);ye=vw(Yt,xt,p,xt.blend??null,Me)}const Jt=Math.max(.008,ye);ce=Math.min(1,ce+$/Jt);const Kt=Yt&&ce<1?mw(Yt,xt,of(ce)):xt;return Ht=Kt,Kt}function tm(D,$){const ut=R/2+b/2,xt=M-.04-U;if(!p.enabled){Q.root.position.set(-ut,xt,0),q.root.position.set(ut,xt,0),Te={lx:-ut,ly:xt,lz:0,rx:ut,ry:xt,rz:0};return}const Jt=Math.max(0,p.shoulderLift),Kt=Math.max(0,p.shoulderPush),le=D&&$==="greatsword"?Math.max(0,p.shoulderIn):0,Me=En=>Jt*fe((-En-.5)/1.45,0,1),ve=En=>Kt*fe((-En-.2)/1.9,0,1),Ve=-ut+le,ln=xt+Me(Q.root.rotation.x),je=ve(Q.root.rotation.x),be=ut-le,Ce=xt+Me(q.root.rotation.x),sn=ve(q.root.rotation.x);Q.root.position.set(Ve,ln,je),q.root.position.set(be,Ce,sn),Te={lx:Ve,ly:ln,lz:je,rx:be,ry:Ce,rz:sn}}function em(D){if(D.phase==="idle"||D.charging)return;const $=D.attackProgress,ut=lo($),xt=Math.max(0,ut),Jt=D.comboIndex%2===0?1:-1,Kt=l.stride,le=Number.isFinite(Kt.stepReach)?Kt.stepReach:.17,Me=Number.isFinite(Kt.stepSideReach)?Kt.stepSideReach:.14,ve=Number.isFinite(Kt.stepDipReach)?Kt.stepDipReach:.05,Ve=D.weapon==="greatsword"?fe(Number.isFinite(Kt.heavyScale)?Kt.heavyScale:1,0,1):1;x.position.z+=le*xt*Ve,x.position.x+=Jt*Me*xt*Ve,x.position.y-=ve*Math.sin(Math.PI*$)*Ve}let Bh=null;function nm(){Bh={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:Q.root.rotation.x,lry:Q.root.rotation.y,lrz:Q.root.rotation.z,lj:Q.joint.rotation.x,rrx:q.root.rotation.x,rry:q.root.rotation.y,rrz:q.root.rotation.z,rj:q.joint.rotation.x,rootY:y.rotation.y}}function im(D){const $=Bh;if(!$)return;const ut=of(fe(D,0,1));if(ut>=1)return;const xt=(Jt,Kt)=>Jt+(Kt-Jt)*ut;w.rotation.x=xt($.upperX,w.rotation.x),w.rotation.y=xt($.upperY,w.rotation.y),w.rotation.z=xt($.upperZ,w.rotation.z),w.position.x=xt($.upperPX,w.position.x),w.position.z=xt($.upperPZ,w.position.z),x.position.x=xt($.pelvisX,x.position.x),x.position.y=xt($.pelvisY,x.position.y),x.position.z=xt($.pelvisZ,x.position.z),x.rotation.x=xt($.pelvisRX,x.rotation.x),x.rotation.z=xt($.pelvisRZ,x.rotation.z),Q.root.rotation.x=xt($.lrx,Q.root.rotation.x),Q.root.rotation.y=xt($.lry,Q.root.rotation.y),Q.root.rotation.z=xt($.lrz,Q.root.rotation.z),Q.joint.rotation.x=xt($.lj,Q.joint.rotation.x),q.root.rotation.x=xt($.rrx,q.root.rotation.x),q.root.rotation.y=xt($.rry,q.root.rotation.y),q.root.rotation.z=xt($.rrz,q.root.rotation.z),q.joint.rotation.x=xt($.rj,q.joint.rotation.x),y.rotation.y=$.rootY+Xe(y.rotation.y-$.rootY)*ut,Ue=y.rotation.y}let Ss=null,Hr=0,Hh=0;function am(){if(!I)return;const D=z,$=Math.max(0,D.waist??1),ut=Math.max(0,D.chest??0),xt=$+ut,Jt=xt>1e-6?$/xt:1,Kt=xt>1e-6?ut/xt:0,le=w.rotation.x,Me=w.rotation.y,ve=w.rotation.z;w.rotation.set(le*Jt,Me*Jt,ve*Jt),C.rotation.set(le*Kt,Me*Kt,ve*Kt);const Ve=fe(D.neck??0,0,1);Ve>0&&(mt.rotation.x-=le*Ve),Ss={x:le,y:Me,z:ve}}function ho(){return{yaw:w.rotation.y+(I?C.rotation.y:0),pitch:w.rotation.x+(I?C.rotation.x:0),lean:w.rotation.z+(I?C.rotation.z:0)}}function Gh(){return ho().yaw}function sm(D,$){if(!(d!=null&&d.enabled)){vn=null,Un=0;return}y.updateWorldMatrix(!0,!0);const ut=new B,xt=[],Jt=(Jn,Ui,Ra=0)=>{Jn.getWorldPosition(ut),xt.push({x:ut.x,y:ut.y+Ra,z:ut.z,mass:Ui})},Kt=n.headSize;Jt(mt,.08,Kt/2),Jt(G,.14),Jt(N??C,.24),Jt(x,.12),Jt(Q.hand,.05),Jt(q.hand,.05),Jt(pt.joint,.15),Jt(K.joint,.15);const le=Rt?uo(kt[Rt].right):null;le&&xt.push({x:(le.base.x+le.tip.x)/2,y:(le.base.y+le.tip.y)/2,z:(le.base.z+le.tip.z)/2,mass:Rt==="greatsword"?.09:.04});const Me=Math.max(.05,n.limbThickness*1.15/2+.015),ve=Math.max(.06,n.limbThickness*1.7/2+.02);let Ve=1/0,ln=-1/0,je=1/0,be=-1/0,Ce=0;for(const Jn of[pt,K])Jn.tip.getWorldPosition(ut),ut.y<=.13&&(Ce+=1),Ve=Math.min(Ve,ut.x-Me),ln=Math.max(ln,ut.x+Me),je=Math.min(je,ut.z-ve),be=Math.max(be,ut.z+ve);(!Number.isFinite(Ve)||Ce===0)&&(Ve=ln=je=be=0);let sn=0,En=0;Number.isFinite(_s)&&$>1e-5&&(sn=fe((D.position.x-_s)/$,-20,20),En=fe((D.position.z-Ih)/$,-20,20)),_s=D.position.x,Ih=D.position.z;const Je=aw(xt,{minX:Ve,maxX:ln,minZ:je,maxZ:be},sn,En,d);if(vn=Je,!d.autoCounter){Un=0;return}const jn=Math.cos(D.bodyYaw),Nn=-Math.sin(D.bodyYaw),Kn=Je.xcomX-Je.centerX,ci=Je.xcomZ-Je.centerZ,zi=Kn*jn+ci*Nn,Fi=sn*jn+En*Nn,On=Je.grounded?sw(zi,Fi,d.predLead??0):0;Hh=On;const li=Math.abs(On)-.45*Je.halfX;ys=li;let Bn=0;li>.002&&Je.grounded&&(Bn=-Math.sign(On)*Math.min(Math.max(.005,d.maxShift??.045),(li+.002)*1.1666666666666667));const Aa=Math.abs(On)/Math.max(1e-4,Je.halfX),Mi=Math.max(.1,ow(d.counterRate,Aa,d.counterBoost??0));Un+=(Bn-Un)*(1-Math.exp(-Mi*$))}function om(D,$){if(yt.drawString.position.z=-.06,Bt.position.z=0,ee.orb.scale.setScalar(1),w.rotation.y=0,D.charging&&D.weapon==="bow"){const Kt=D.charge;Q.root.rotation.x=-1.25,Q.joint.rotation.x=-.15,q.root.rotation.x=.35+Kt*.3,q.joint.rotation.x=-1.15,yt.drawString.position.z=-.06-Kt*.22,Bt.position.z=-Kt*.3,w.rotation.y=-.22;return}if(D.phase==="idle"&&we<=.001){Yt=null,Ht=null,Xt=0,ce=1,ye=Math.max(.008,p.segBlend),de=null,jt=null,an=null,_t=null,Tt=null,ie=null,nt=NaN,D.weapon==="greatsword"&&(At.position.x=-Math.max(0,s.twoHandInsetX??0));return}const ut=lo(D.attackProgress),xt=Math.max(0,-ut),Jt=Math.max(0,ut);if(D.weapon==="bow")Q.root.rotation.x=-1.2,Q.joint.rotation.x=-.15,q.root.rotation.x=.9-Jt*.8,q.joint.rotation.x=-.3;else if(D.weapon==="greatsword")if(p.enabled)Nh(Oh(D,$));else{const Kt=-1.6*xt+1.25*Jt,le=fe(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);q.root.rotation.x=Kt,q.joint.rotation.x=-(.25+xt*.4),Q.root.rotation.x=Kt+.06,Q.joint.rotation.x=-(.32+xt*.4),Q.root.rotation.z=.42,q.root.rotation.z=0;const Me=-Math.sin(q.root.rotation.x);q.root.rotation.y=-.72*Math.tanh(Me*4),w.rotation.y=-.2*ut*le}else if(p.enabled)Nh(Oh(D,$));else{const Kt=D.comboIndex;if(Kt===1)q.root.rotation.x=-1.7*xt+1.1*Jt,q.joint.rotation.x=-(.2+xt*.5),Q.root.rotation.x=.1,w.rotation.y=-.18*ut;else if(Kt===2)Q.root.rotation.x=-1.5*xt+1*Jt,Q.joint.rotation.x=-(.2+xt*.5),q.root.rotation.x=.2,w.rotation.y=.45*-ut;else{const le=-1.9*xt+1.2*Jt;Q.root.rotation.x=le,q.root.rotation.x=le,Q.joint.rotation.x=-(.15+xt*.4),q.joint.rotation.x=-(.15+xt*.4),w.rotation.y=-.3*ut}}if(D.weapon==="greatsword"){const Kt=fe((-q.root.rotation.x-1.3)/1.2,0,1);At.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Kt)}em(D)}function rm(D,$){D&&(q.root.rotation.x=-1.05,q.joint.rotation.x=-.35,Q.root.rotation.x=-.45,Q.joint.rotation.x=-.2,w.rotation.y=-.12,ee.orb.scale.setScalar(1.25+.12*Math.sin($*2)))}function cm(D){if(!D||D.phase==="idle")return;const $=D.progress,ut=$<.3?-.35+$/.3*1.35:$<.7?1:Math.max(0,1-($-.7)/.3),xt=Math.PI/180;w.rotation.x+=_.leanDeg*xt*ut,Q.root.rotation.x-=_.shieldPitchDeg*xt*ut,Q.joint.rotation.x-=.22*ut,q.root.rotation.x-=.3*ut,x.position.z+=_.pelvisReach*Math.max(0,ut)}function uo(D){if(!D)return null;const $=D.getObjectByName("bladeBase"),ut=D.getObjectByName("bladeTip");if(!$||!ut)return null;D.updateWorldMatrix(!0,!1);const xt=$.getWorldPosition(new B),Jt=ut.getWorldPosition(new B),Kt=new B().setFromMatrixColumn(D.matrixWorld,0).normalize();return{base:{x:xt.x,y:xt.y,z:xt.z},tip:{x:Jt.x,y:Jt.y,z:Jt.z},normal:{x:Kt.x,y:Kt.y,z:Kt.z}}}return{group:y,update(D,$,ut,xt,Jt=!1,Kt,le,Me){var td;Fh($.weapon),y.rotation.y=0,Ue=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,C.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ve=Math.max(1/240,Math.min(xt,.1));J=((td=l.stance)==null?void 0:td[$.weapon])??null,L!==$.weapon&&(L=$.weapon,A=J?0:1);const Ve=Math.max(.01,(J==null?void 0:J.blend)??.22);A=Math.min(1,A+ve/Ve);const ln=J?A:0;Y=((J==null?void 0:J.bladePitchDeg)??0)*Math.PI/180*ln,ht=((J==null?void 0:J.bladePitchOffDeg)??0)*Math.PI/180*ln;const je=Kt===void 0?Xp+=xt:Kt;Ur=je;const be=l.landing;be.enabled?Nr&&!D.grounded?(bs="jump",wa=je,Ea=be.anticipationDuration,Ta=Math.max(0,be.jumpAnticipation),co=.32):!Nr&&D.grounded&&(bs="land",wa=je,Ea=be.duration,Ta=NS(Or,be),co=be.compressRatio,zh=Or):(bs="none",Ta=0),je<wa&&(bs="none",Ta=0),Nr=D.grounded,Or=D.velocity.y;const Ce=Ku(je,wa,Ea,Ta,co),sn=$.phase!=="idle",En=(Me==null?void 0:Me.phase)==="active";xe=IS(xe,sn,ve,l.attack.blendRate);const Je=zS(xe,l.attack.gaitWeight,l.attack.lowerBodyWeight);wn=Je.attackLegWeight,fn=Je.gaitScale;const jn=Math.sin(D.bodyYaw),Nn=Math.cos(D.bodyYaw),Kn=(D.velocity.x-rt)/ve,ci=(D.velocity.z-Ut)/ve,zi=fe(Kn,-60,60),Fi=fe(ci,-60,60),On=zi*jn+Fi*Nn,li=Xe(D.bodyYaw-tt)/ve,Bn=Math.hypot(D.velocity.x,D.velocity.z),Aa=o.maxForwardDeg*Math.PI/180,Mi=o.maxSideDeg*Math.PI/180,Jn=fe(On*o.accelGain,-Aa,Aa),Ui=fe(-li*Bn*o.turnGain,-Mi,Mi),Ra=1-Math.exp(-o.smoothing*ve);vt+=(Jn-vt)*Ra,Nt+=(Ui-Nt)*Ra,rt=D.velocity.x,Ut=D.velocity.z,tt=D.bodyYaw;const Tn=Math.hypot(D.velocity.x,D.velocity.z),Pa=fe(a.knockGaitScale??0,0,1),Gr=ut.knockX*Pa,fo=ut.knockZ*Pa,Ca=Pa>0&&Math.hypot(ut.knockX,ut.knockZ)>.001,Vr=D.velocity.x+Gr,Xr=D.velocity.z+fo,Vh=Math.hypot(Vr,Xr);Fe=Vh;const lm=Math.cos(D.bodyYaw),hm=-Math.sin(D.bodyYaw),dm=D.velocity.x*lm+D.velocity.z*hm,Xh=Tn>Ri?fe(dm/Tn,-1,1):0,Wh=Tn>Ri?fe((D.velocity.x*jn+D.velocity.z*Nn)/Tn,-1,1):1,um=Ch(Wh,a.backStrafeStartDeg,a.backStrafeFullDeg);he==="settled"&&xn&&X>It*1.02+1e-4&&(he="none");let ws=1;he==="blend"?(ws=Lp(Qe?Sn:We,a.stopYawBlendMode,Qe),Qe||(We=Math.min(1,We+ve/Math.max(.01,a.stopYawAfterSec)),(We>=1||a.stopYawBlendMode==="inStop"||xn)&&(he="settled",ws=0))):he==="settled"&&(ws=fe(Tn/Math.max(Ri,a.stopEnterRatio*e),0,1)),Fn=ws;const fm=Tp(Xh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),pm=Ap(Wh,Xh,fm,um)*ws;gt+=(pm-gt)*(1-Math.exp(-i.hipYawSmoothing*ve));const Es=D.bodyYaw+gt;Vt=Es;const mm=Math.sin(Es),gm=Math.cos(Es),xm=Math.cos(Es),vm=-Math.sin(Es),hi={speed:Vh,phase:D.gaitPhase,localForward:Vr*mm+Xr*gm,localRight:Vr*xm+Xr*vm,stride:D.stride};sn&&!Pe&&(se=D.gaitPhase),Pe=sn;const La=xe>0?DS(hi,$.attackProgress,$.comboIndex,xe,l.stride,se):hi;Fr=La;const Yh=Math.max(0,a.stopBlendSec||0),$h=Yh>0&&!sn&&!Ca&&D.grounded,Wr=Rp(Tn,oe,e,a.stopEnterRatio,a.stopExitRatio);if(!$h||Wr.resume)Ot=-1;else if(Ot<0&&Wr.enter){Ot=0,qt=D.gaitPhase,F=wp(D.gaitPhase),Pt=Tn,it=Math.max(D.stride,Ri),lt=hi.localForward,Lt=hi.localRight;const te=1/Math.max(Ri,Tn);Ct=D.velocity.x*te,Qt=D.velocity.z*te}const ym=oe;oe=Tn;const di=$h&&Ot>=0;di&&(Ot=Math.min(1,Ot+ve/Yh)),di&&he!=="blend"&&(he="blend",We=0),Qe=di&&Ot<1,Sn=Ot,xn=Wr.resume,X=Tn,It=ym;const Zh=di?{phase:qt,speed:Pt,moveSpeed:e,localForward:lt,localRight:Lt,legLength:n.legLength,stride:it,grounded:!0}:{phase:La.phase,speed:La.speed,moveSpeed:e,localForward:La.localForward,localRight:La.localRight,legLength:n.legLength,stride:La.stride??0,grounded:D.grounded};let Yr=di?Ep(Zh,a,{progress:Ot,phase0:qt,phaseEnd:F}):wr(Zh,a);const Qi=l.attack.moveTakeover;if(Qi&&!di){const te=$.phase==="windup"?Qi.windup:$.phase==="recovery"?Qi.recovery:$.phase==="settle"?Qi.settle:0,ue=Math.max(.05,Qi.full-Qi.speed),yn=fe((hi.speed-Qi.speed)/ue,0,1),An=fe(te,0,1)*yn,po=An>He?10:6;He=fe(He+(An-He)*(1-Math.exp(-po*ve)),0,1)}else di?He=0:He=fe(He*Math.exp(-8*ve),0,1);if(He>.001&&!di){const te=wr({phase:hi.phase,speed:hi.speed,moveSpeed:e,localForward:hi.localForward,localRight:hi.localRight,legLength:n.legLength,stride:hi.stride??0,grounded:D.grounded},a);Yr=FS(Yr,te,He)}const Le=US(Yr,Je.gaitScale);if(Mt=0,En&&Me){const te=PS(Me.progress,Me.dir,a),ue=Je.gaitScale;Le.legL.pitchX+=te.legL.pitchX*ue,Le.legL.rollZ+=te.legL.rollZ*ue,Le.legL.kneeX+=te.legL.kneeX*ue,Le.legR.pitchX+=te.legR.pitchX*ue,Le.legR.rollZ+=te.legR.rollZ*ue,Le.legR.kneeX+=te.legR.kneeX*ue,Le.pelvisY+=te.pelvisY*ue,Mt=te.env}let $r=0,Zr=0,qr=0,qh=0;if(di){const te=Cp(D.bodyYaw,Ct,Qt),ue=Dp(Ot,qt,te.forward,te.right,a);ue.leadLeft?(Le.legL.pitchX-=ue.leadPitch,Le.legL.kneeX+=ue.leadKnee,Le.legR.pitchX+=ue.trailPitch):(Le.legR.pitchX-=ue.leadPitch,Le.legR.kneeX+=ue.leadKnee,Le.legL.pitchX+=ue.trailPitch),Zr=ue.bodyShift*ue.fwdN,$r=ue.bodyShift*ue.rightN,qr=ue.bodyDip,qh=ue.chestPitch,Be=ue.leadPitch,nn=ue.bodyShift,gn=ue.bodyDip}else Be=0,nn=0,gn=0;if(Ms={lp:Le.legL.pitchX,lr:Le.legL.rollZ,rp:Le.legR.pitchX,rr:Le.legR.rollZ},!D.grounded)pt.root.rotation.x=-.55,K.root.rotation.x=-.25,pt.joint.rotation.x=.75,K.joint.rotation.x=.55,Q.root.rotation.x=-.9,q.root.rotation.x=-.7,Q.joint.rotation.x=-.6,q.joint.rotation.x=-.6,pt.root.rotation.z=0,K.root.rotation.z=0;else{pt.root.rotation.x=Le.legL.pitchX,K.root.rotation.x=Le.legR.pitchX,pt.root.rotation.z=Le.legL.rollZ,K.root.rotation.z=Le.legR.rollZ,pt.joint.rotation.x=Le.legL.kneeX,K.joint.rotation.x=Le.legR.kneeX;const te=J?A:0,ue=1+(((J==null?void 0:J.armSwing)??1)-1)*te,yn=J==null?void 0:J.armR,An=J==null?void 0:J.armL,po=Le.armL*ue+((An==null?void 0:An.pitch)??0)*te,ed=Le.armR*ue+((yn==null?void 0:yn.pitch)??0)*te;Q.root.rotation.x=po,q.root.rotation.x=ed,Q.joint.rotation.x=-(.18+po*.2)+((An==null?void 0:An.elbow)??0)*te,q.joint.rotation.x=-(.18+ed*.2)+((yn==null?void 0:yn.elbow)??0)*te,Q.root.rotation.z=((An==null?void 0:An.roll)??0)*te,q.root.rotation.z=((yn==null?void 0:yn.roll)??0)*te,Q.root.rotation.y=((An==null?void 0:An.yaw)??0)*te,q.root.rotation.y=((yn==null?void 0:yn.yaw)??0)*te,x.position.x=Le.pelvisX,x.position.y=E+Le.pelvisY,x.position.z=0,x.rotation.z=Le.pelvisRoll}const _m=Op(x,v),Ts=En?{...u,weight:0}:di&&u.enabled?{...u,weight:1}:u,jh=Ts.enabled&&D.grounded&&Ts.weight>0?fe(Ts.weight,0,1)*(sn?fe(Ts.attackScale,0,1):1):0;x.position.x+=$r,x.position.z+=Zr,x.position.y-=qr,v.position.y+=qr,jh<=0&&(v.position.x-=$r,v.position.z-=Zr);const jr=Tn/Math.max(e,Ri);Et=jr;const Mm=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,bm=1-Math.exp(-Math.max(0,Mm)*ve);ct+=(fe(jr,0,1)-ct)*bm;const Da=Fp({leanForward:vt,leanSide:Nt,speedRatio:ct},o);x.rotation.x+=Da.pelvisPitch,x.rotation.z+=Da.pelvisRoll,x.position.x+=Da.pelvisX,x.position.z+=Da.pelvisZ,x.position.y-=Da.crouch,v.position.y+=Da.crouch*(1-fe(jh,0,1));const Kh=$.phase!=="idle"||$.charging&&$.weapon==="bow",Kr=Kh?1:0,Sm=Math.max(.001,Kr>we?p.poseIn??.1:p.poseOut??.16);if(we!==Kr){const te=ve/Sm;we=fe(we+(Kr>we?te:-te),0,1)}if((we>0||Kh)&&nm(),om($,ve),we>0&&we<1&&im(we),J){const te=(1-we)*A;w.rotation.y+=(J.torsoYaw??0)*te,w.rotation.x+=(J.torsoPitch??0)*te}rm(Jt,D.gaitPhase),cm(le);const wm=$.weapon==="greatsword",Jh=Math.hypot(D.velocity.x,D.velocity.z),Em=wm&&$.phase==="idle"&&Jh>.5?Math.min(1.15,Jh/Math.max(e,.001)*.9):0;ot+=(Em-ot)*(1-Math.exp(-6*ve));const Tm=w.rotation.x;$.weapon==="bow"&&(yt.g.rotation.x=-(Q.root.rotation.x+Q.joint.rotation.x),Bt.rotation.x=-(q.root.rotation.x+q.joint.rotation.x));const Am=w.rotation.y;$p(ut,D.bodyYaw);const Qh=ut.type==="none"?1:.4;if(w.rotation.x+=vt*Qh+qh,w.rotation.z+=(Nt+Le.sideLean)*Qh,Ce>0&&(pt.root.rotation.x-=be.hipPitch*Ce,K.root.rotation.x-=be.hipPitch*Ce,pt.joint.rotation.x+=be.kneeBend*Ce,K.joint.rotation.x+=be.kneeBend*Ce,x.position.y-=be.crouchDepth*Ce,v.position.y+=be.crouchDepth*(1-be.lowerScale)*Ce,w.rotation.x+=be.upperPitch*Ce,Q.root.rotation.x-=be.armTuck*Ce,q.root.rotation.x-=be.armTuck*Ce),wn>0&&D.grounded){const te=kS($.attackProgress,$.comboIndex,l.stride),ue=wn;pt.root.rotation.x+=te.legL.pitchX*ue,K.root.rotation.x+=te.legR.pitchX*ue,pt.root.rotation.z+=te.legL.rollZ*ue,K.root.rotation.z+=te.legR.rollZ*ue,pt.joint.rotation.x+=te.legL.kneeX*ue,K.joint.rotation.x+=te.legR.kneeX*ue,x.position.x+=te.pelvisX*ue,x.position.y+=te.pelvisY*ue,x.rotation.z+=te.pelvisRoll*ue}if(tm(sn,$.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(Un)>1e-4&&(x.position.x+=Un),g.enabled){const te=$.phase!=="idle"&&!$.charging,ue=te?lo($.attackProgress):0;te&&P>.55&&ue<P-1e-4&&(re=1),P=ue,re=hw(re,ve,g.impactDecay);const yn=cw({swing:ue,charge:$.charging?$.charge:0,impact:re,speedRatio:jr,grounded:D.grounded},g);ne=lw(ne,yn,ve,g.smoothing)}else ne={...Kl};Zp(ne),v.rotation.y=gt,pe=Pp(gt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=pe;const Rm=Am;if(mt.rotation.y=Xe(D.headYaw-D.bodyYaw-Rm-pe),mt.rotation.x=-fe(D.headPitch??0,-.7,.7),w.rotation.x+=-fe(D.bodyPitch??0,-.4,.4),am(),jp(xt,$.comboIndex),Qp($,Tm),$.weapon==="greatsword"&&!$.charging&&($.phase!=="idle"||we>0)){y.updateWorldMatrix(!0,!0);const te=$.phase==="idle"?Math.max(we,xe):1;qp(fe(te,0,1),ve)}if(O=Bp({root:y,pelvis:x,lower:v,limbs:St,base:_m,cfg:Ts,grounded:D.grounded,attacking:sn}),sm(D,ve),I&&Ss){const te=ho();Hr=Math.max(Math.abs(te.pitch-Ss.x),Math.abs(te.yaw-Ss.y),Math.abs(te.lean-Ss.z))}else Hr=0},lean(){return{forward:vt,side:Nt}},landing(){const D=Ku(Ur,wa,Ea,Ta,co),$=Ea>0?Math.max(0,Ea-Math.max(0,Ur-wa)):0;return{pulse:D,remaining:$,kind:D>0?bs:"none",impactVy:zh}},hurt(){return wt},ik(){return O},stretch(){return{...ne,impact:re}},gripDebug(){return{...V}},weaponDebug(){return{wristPitch:et,wristTwist:W}},setClipT(D){Se=D===null||!Number.isFinite(D)?null:Math.max(0,Math.min(1,D))},stanceDebug(){const D=J==null?void 0:J.armR,$=J==null?void 0:J.armL,ut=J?A:0;return{weapon:Rt??"sword-shield",weight:ut,armL:{pitch:(($==null?void 0:$.pitch)??0)*ut,yaw:(($==null?void 0:$.yaw)??0)*ut,roll:(($==null?void 0:$.roll)??0)*ut,elbow:(($==null?void 0:$.elbow)??0)*ut},armR:{pitch:((D==null?void 0:D.pitch)??0)*ut,yaw:((D==null?void 0:D.yaw)??0)*ut,roll:((D==null?void 0:D.roll)??0)*ut,elbow:((D==null?void 0:D.elbow)??0)*ut},torsoYaw:((J==null?void 0:J.torsoYaw)??0)*ut,torsoPitch:((J==null?void 0:J.torsoPitch)??0)*ut,bladePitchDeg:Y*180/Math.PI,bladePitchOffDeg:ht*180/Math.PI,armSwing:(J==null?void 0:J.armSwing)??1}},swingDebug(){const D=Ht;return{seg:Xt,kind:(D==null?void 0:D.kind)??"right-left",lead:(D==null?void 0:D.lead)??"R",yaw:(D==null?void 0:D.yaw)??0,rootYaw:(D==null?void 0:D.rootYaw)??0,spinYaw:(D==null?void 0:D.spinYaw)??0,rootTurn:Ue,pitch:(D==null?void 0:D.pitch)??0,roll:(D==null?void 0:D.roll)??0,strike:(D==null?void 0:D.strike)??0,bladeTwist:(D==null?void 0:D.bladeTwist)??0,bladeTwistOff:(D==null?void 0:D.bladeTwistOff)??0,bladeYaw:(D==null?void 0:D.bladeYaw)??0,bladeYawOff:(D==null?void 0:D.bladeYawOff)??0,shoulderL:{x:Te.lx,y:Te.ly,z:Te.lz},shoulderR:{x:Te.rx,y:Te.ry,z:Te.rz}}},attackBlend(){return xe},attackWeights(){return{gaitScale:fn,attackLegWeight:wn,driveSpeed:Fr.speed,stridePhase:Fr.phase}},hipYaw(){return gt},torsoTotal(){return ho()},spineDebug(){if(!I)return null;const D=ho();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:C.rotation.y,totalYaw:D.yaw,totalPitch:D.pitch,totalLean:D.lean,neckPitch:mt.rotation.x,leak:Hr}},balanceDebug(){return vn?{...vn,shift:Un,latDeficit:ys,lateralFf:Hh}:null},gaitDebug(){return{stopT:Ot,hipYaw:gt,chestYaw:pe,speed:oe,gaitSpeed:Fe,stopStep:Be,stopShift:nn,stopDip:gn,stopYawFade:Fn,turnStep:Mt,legTakeover:He,legLPitch:Ms.lp,legLRoll:Ms.lr,legRPitch:Ms.rp,legRRoll:Ms.rr}},gaitYaw(){return Vt},arrowDirection(){Bt.updateWorldMatrix(!0,!1);const D=Bt.matrixWorld.elements,$=D[8],ut=D[9],xt=D[10],Jt=Math.hypot($,ut,xt)||1;return{x:$/Jt,y:ut/Jt,z:xt/Jt}},weaponBlade(){return Rt?uo(kt[Rt].right):null},bladesWorld(){return Rt?{right:uo(kt[Rt].right),left:uo(kt[Rt].left)}:{right:null,left:null}},dispose(){y.traverse(D=>{if(D instanceof _e){D.geometry.dispose();const $=D.material;Array.isArray($)?$.forEach(ut=>ut.dispose()):$.dispose()}})}}}const Ew=Math.PI/3;function rf(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Tw(){let n=0,t=!1;return{update(e,i,a,s=Ew){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=rf(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=rf(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function Aw(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new en,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new mn(i,3),o=new mn(a,3);s.setUsage(Nd),o.setUsage(Nd),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,E=v+3;r.push(v,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new on({vertexColors:!0,transparent:!0,opacity:1,blending:Xi,depthWrite:!1,side:$e}),c=new _e(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new ae(n.color);let f=[],d=null,u=0,m=0,_=!1,g=!1,p=0;function y(){const x=f.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=f[w],E=Math.max(0,1-S.age/v),T=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*T*(.55+.45*b)*(1+p),R=.18+.82*E,z=w*6;i[z]=S.tx+(S.bx-S.tx)*R,i[z+1]=S.ty+(S.by-S.ty)*R,i[z+2]=S.tz+(S.bz-S.tz)*R,i[z+3]=S.tx,i[z+4]=S.ty,i[z+5]=S.tz;const I=h.r*M,U=h.g*M,C=h.b*M,k=I*.22,G=U*.22,N=C*.22;a[z]=k,a[z+1]=G,a[z+2]=N;const Z=1+n.tipBoost;a[z+3]=Math.min(1,I*Z),a[z+4]=Math.min(1,U*Z),a[z+5]=Math.min(1,C*Z)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of f)E.age+=S;for(;f.length>0&&f[0].age>n.life;)f.shift();if(v){const E=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,T=f[f.length-1],b=T?Math.hypot(v.tip.x-T.tx,v.tip.y-T.ty,v.tip.z-T.tz):1/0;if(w&&b>=n.minStep)for(f.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:E});f.length>t;)f.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},u=E,m=b,_=!0}else d=null,_=!1,u=0,m=0;g=w,y()},debug(){return{count:f.length,visible:c.visible,speed:u,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){f=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function Rw(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Pw(n,t,e,i){var xn;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new N1({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=zf,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new O1;r.background=new ae("#12161d"),r.add(new _S(11061486,2764600,1.15));const l=new SS(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],f=new ze;for(const X of t.boxes){const It=X.maxX-X.minX,Mt=X.maxY-X.minY,ne=X.maxZ-X.minZ;let re=Rw(X.kind,e);X.kind==="step"&&(re=new ae(re).offsetHSL(0,0,X.maxY*.09).getStyle());const P=new ao({color:re,transparent:!0,opacity:1}),V=new _e(new ri(It,Mt,ne),P);V.position.set((X.minX+X.maxX)/2,(X.minY+X.maxY)/2,(X.minZ+X.maxZ)/2),V.castShadow=X.kind!=="ground",V.receiveShadow=!0,V.add(new up(new eS(V.geometry),new bh({color:10467020,transparent:!0,opacity:.32}))),f.add(V),h.push(P)}r.add(f);const d=t.gridMeta.maxX-t.gridMeta.minX,u=new ES(d,d,4873328,3358797);u.position.y=.002,u.visible=e.showGrid,r.add(u);const m=XS(i,e);r.add(m.group);const _=X=>ww((X==null?void 0:X.voxel)??e.voxel,X!=null&&X.colors?{...e.colors,...X.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let g="standard",p=_((xn=e.bodyTypes)==null?void 0:xn[g]);const y=Aw(e.weaponTrail);r.add(y.object);const x=new ze,v=.9,w=new ze;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=Tw();let E=0;const T=t.dummies.map((X,It)=>{const Mt=e.dummies.colors,ne=Mt[It%Mt.length]??"#cccccc",re=VS(e.voxel,e.colors,ne,X.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return re.group.traverse(P=>{P.userData.dummyId=X.id}),r.add(re.group),re}),b=T.map(X=>X.group),M=new wS,R=e.groundRing,z=e.voxel.bodyWidth,I=Qu(z,R.playerRadiusFactor),U=Qu(z,R.dummyRadiusFactor),C=z*R.thicknessFactor,k=R.arcDeg*Math.PI/180;let G=0;const N=Wc({radius:I,thickness:C,arcRad:k,edgeFade:R.edgeFade,color:R.playerColor,opacity:R.playerOpacity,y:.028,renderOrder:6});N.mesh.name="player-ground-ring",r.add(N.mesh);const Z=t.dummies.map(X=>{const It=Wc({radius:U,thickness:C,arcRad:k,edgeFade:R.edgeFade,color:R.neutralColor,opacity:R.opacity,y:.022,renderOrder:5});return It.mesh.name=`dummy-ground-ring-${X.id}`,r.add(It.mesh),It}),st=t.dummies.map(X=>{const It=Wc({radius:U*R.haloRadiusFactor,thickness:C*R.haloThicknessFactor,arcRad:k,edgeFade:R.edgeFade,color:R.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return It.mesh.name=`dummy-ground-halo-${X.id}`,r.add(It.mesh),It}),mt=t.dummies.map(()=>0),dt=t.dummies.map(()=>0),ft=tf({radius:I*R.meterRadiusFactor,thickness:C*R.meterThicknessFactor,arcRad:k,edgeFade:.06,color:R.meterColorCharge,y:.03,renderOrder:8});ft.mesh.name="player-ground-meter",r.add(ft.mesh);const at=t.dummies.map(X=>{const It=tf({radius:U*R.warnRadiusFactor,thickness:C*R.warnThicknessFactor,arcRad:k,edgeFade:.02,color:R.warnColor,y:.031,renderOrder:9});return It.mesh.name=`dummy-ground-warn-${X.id}`,r.add(It.mesh),It}),j=ef({color:R.playerColor,y:.042,renderOrder:3});j.group.name="player-landing-preview",r.add(j.group);const pt=new ae,K=new ae(R.playerColor),Q=new ae(R.neutralColor),q=new ae(R.lowThreatColor),St=new ae(R.highThreatColor),At=new ae(R.meterColorCharge),bt=new ae(R.meterColorChannel),Ft=new ae(R.meterColorCooldown),H=new ae(R.warnColor),ee=new ze;r.add(ee);const yt=e.projectiles;function Bt(){const It=document.createElement("canvas");It.width=64,It.height=64;const Mt=It.getContext("2d");if(Mt){const re=Mt.createRadialGradient(32,32,0,32,32,32);re.addColorStop(0,"rgba(255,255,255,1)"),re.addColorStop(.28,"rgba(255,255,255,0.72)"),re.addColorStop(.62,"rgba(255,255,255,0.22)"),re.addColorStop(1,"rgba(255,255,255,0)"),Mt.fillStyle=re,Mt.fillRect(0,0,64,64)}const ne=new $l(It);return ne.colorSpace=Cn,ne}function kt(){const Mt=document.createElement("canvas");Mt.width=2,Mt.height=64;const ne=Mt.getContext("2d");if(ne){const P=ne.createLinearGradient(0,0,0,64);P.addColorStop(0,"rgba(255,255,255,0)"),P.addColorStop(.55,"rgba(255,255,255,0.35)"),P.addColorStop(1,"rgba(255,255,255,0.95)"),ne.fillStyle=P,ne.fillRect(0,0,2,64)}const re=new $l(Mt);return re.colorSpace=Cn,re}const Dt=Bt(),Rt=kt(),L=new on({color:12577023,transparent:!0,opacity:0,side:$e,depthWrite:!1}),A=new on({color:14217983,transparent:!0,opacity:0,side:$e,depthWrite:!1,blending:Xi}),Y=new ze;Y.position.set(0,.95,.72),ee.add(Y);const ht=new ze;ht.rotation.x=ew(e.camera.pitchDeg),Y.add(ht);const J=new zr(.78,yt.slashThickness,6,28,Math.PI*1.15),rt=new ze,Ut=new _e(J,L),tt=new _e(J,A);tt.scale.setScalar(1.09),tt.renderOrder=4,rt.add(Ut,tt),ht.add(rt);const vt=new ri(yt.arrowWidth,yt.arrowWidth,yt.arrowLength),Nt=new Th(yt.arrowHeadSize*.42,yt.arrowHeadSize,4);Nt.rotateX(Math.PI/2);const ot=new ri(yt.arrowWidth*2.6,yt.arrowWidth*.4,.1),wt=new Qs(yt.arrowWidth*.45,yt.arrowWidth*1.3,yt.trailLength,6,1,!0);wt.rotateX(-Math.PI/2),wt.translate(0,0,-yt.trailLength/2);const O=Array.from({length:10},()=>{const X=new ze,It=new on({color:yt.arrowColor,transparent:!0}),Mt=new on({color:yt.arrowHeadColor,transparent:!0}),ne=new Yl({map:Dt,color:yt.arrowColor,transparent:!0,opacity:.85,blending:Xi,depthWrite:!1}),re=new on({color:yt.arrowTrailColor,map:Rt,transparent:!0,opacity:0,blending:Xi,depthWrite:!1,side:$e}),P=new _e(vt,It),V=new _e(Nt,Mt);V.position.z=yt.arrowLength/2+yt.arrowHeadSize*.42;const nt=new _e(ot,Mt),et=new _e(ot,Mt);nt.position.z=-yt.arrowLength/2+.08,et.position.z=nt.position.z,et.rotation.z=Math.PI/2;const W=new zu(ne);W.scale.setScalar(yt.arrowGlowSize),W.renderOrder=6;const Et=new _e(wt,re);return Et.renderOrder=5,X.add(P,V,nt,et,W,Et),X.visible=!1,r.add(X),{group:X,shaftMat:It,tipMat:Mt,glowMat:ne,trailMat:re,glow:W,trail:Et,arrowId:0,bone:null}}),ct=new Rh(1,0),gt=new B(yt.boltShapeX,yt.boltShapeY,yt.boltShapeZ),Vt=new on({color:yt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),Ot=new Yl({map:Dt,color:yt.boltGlowColor,transparent:!0,opacity:.45,blending:Xi,depthWrite:!1}),qt=new on({color:yt.boltGlowColor,map:Rt,transparent:!0,opacity:yt.trailOpacity,blending:Xi,depthWrite:!1,side:$e}),F=new Qs(.5,.03,yt.boltTrailScale,6,1,!0);F.rotateX(-Math.PI/2),F.translate(0,0,-yt.boltTrailScale/2);const Pt=Array.from({length:24},()=>{const X=new ze,It=new _e(ct,Vt);It.scale.copy(gt);const Mt=new zu(Ot);Mt.scale.setScalar(yt.boltGlowScale),Mt.renderOrder=6;const ne=new _e(F,qt);return ne.renderOrder=5,X.add(It,Mt,ne),X.visible=!1,r.add(X),{group:X,core:It}}),it=Array.from({length:6},()=>{const X=ef({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return X.group.visible=!1,r.add(X.group),X}),lt=e.dash,Lt=new io(lt.ringRadius-.06,lt.ringRadius,28),Ct=Array.from({length:6},()=>{const X=new on({color:16777215,transparent:!0,opacity:0,side:$e,depthWrite:!1}),It=new _e(Lt,X);return It.rotation.x=-Math.PI/2,It.visible=!1,r.add(It),{mesh:It,mat:X,life:0,base:1}});function Qt(X,It,Mt,ne,re){const P=Ct.find(V=>V.life<=0)??Ct[0];P.mat.color.set(ne),P.mesh.position.set(X,Mt+.04,It),P.base=re,P.mesh.scale.setScalar(re*.6),P.mesh.visible=!0,P.mat.opacity=.9,P.life=lt.fxDuration}const oe=e.links,pe=new io(oe.ringRadius-.07,oe.ringRadius,28),se=Array.from({length:5},()=>{const X=new on({color:oe.chargeColor,transparent:!0,opacity:0,side:$e,depthWrite:!1}),It=new _e(pe,X);return It.rotation.x=-Math.PI/2,It.visible=!1,r.add(It),{mesh:It,mat:X,life:0,base:1}});function Pe(X,It,Mt,ne){const re=se.find(P=>P.life<=0)??se[0];re.mesh.position.set(X,Mt+.05,It),re.base=ne,re.mesh.scale.setScalar(ne*.55),re.mesh.visible=!0,re.mat.opacity=.85,re.life=oe.fxDuration}let Be=t.playerLink.id,nn=t.playerLink.hitIds.length,gn=t.dash.id,Fe="none";const he=AS(e.camera,e.smartCamera,e.zoom,a/s),We=t.character.position;he.update(We.x,We.y,We.z,1,t.camera);function Fn(X,It){if(b.length===0)return 0;const Mt=o.domElement.getBoundingClientRect(),ne=new Wt((X-Mt.left)/Mt.width*2-1,-((It-Mt.top)/Mt.height)*2+1);M.setFromCamera(ne,he.camera);const re=M.intersectObjects(b,!0);for(const P of re){const V=P.object.userData.dummyId;if(V&&V>0)return V}return 0}function Qe(X,It,Mt){const ne=o.domElement.getBoundingClientRect(),re=new B(X,It,Mt).project(he.camera);return{x:ne.left+(re.x*.5+.5)*ne.width,y:ne.top+(-re.y*.5+.5)*ne.height}}let Sn=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const X=p.stretch();return{arm:X.arm,leg:X.leg,torso:X.torso,impact:X.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},yawDebug(){var X;return{target:E,shown:S.value,tauMs:((X=e.renderInterp)==null?void 0:X.yawSmoothMs)??0}},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(X,It,Mt){return Qe(X,It,Mt)},setClipT(X){p.setClipT(X)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(X,It){var an;const Mt=X.character,ne=X.combat,re=e.hitstop.enabled&&X.combat.hitstop>0,P=re;if(re&&!Sn){const _t=Math.max(0,X.combat.hitstop),Tt=Math.max(0,Math.min(1,_t/.1));he.addShake(.34+Tt*.48);let ie=null;for(let Ae=0;Ae<X.events.length;Ae++){const Ue=X.events[Ae];if(Ue.type==="hit"){ie=Ue;break}}ie&&he.addKick(ie.x-Mt.position.x,ie.z-Mt.position.z,.03+Tt*.05)}Sn=re;for(let _t=0;_t<X.events.length;_t++){const Tt=X.events[_t];if(Tt.type!=="notify")continue;const ie=Number.isFinite(Tt.value)?Tt.value:0;if(Tt.name==="blade-air"){const Ae=Math.max(0,Math.min(1,ie));y.pulse((ne.weapon==="greatsword"?.9:.55)*(.4+.6*Ae))}}x.position.set(Mt.position.x,Mt.position.y,Mt.position.z),E=Mt.bodyYaw,x.rotation.y=S.update(E,It,((an=e.renderInterp)==null?void 0:an.yawSmoothMs)??0);const V=X.dash.phase==="active"&&X.dash.kind==="roll",nt=V&&X.dash.duration>0?Math.min(1,1-X.dash.timer/X.dash.duration):0;if(w.rotation.x=V?nt*Math.PI*2:0,w.position.y=v-(V?.2*Math.sin(Math.PI*nt):0),P||p.update(Mt,ne,X.playerHurt,It,X.abilities.channeling,X.time,X.playerLink,X.turnInPlace),y.update(P?0:It,P?null:p.weaponBlade(),!P&&(ne.phase==="active"||X.playerLink.phase==="active"||V&&X.dash.duration>0)),!P)for(let _t=0;_t<T.length;_t++)X.dummies[_t]&&T[_t].update(X.dummies[_t],It);const et=he.camera.position,W=Math.atan2(et.x-Mt.position.x,et.z-Mt.position.z),Et=X.config.gaze.hurtHoldSec,zt=X.time-X.playerHurt.lastAt,$t=Et>0&&zt>=0&&zt<Et?1-zt/Et:0,Zt=$S(X.gaze.active,X.gaze.threat,$t,X.time,R);ZS(pt,K,q,St,Zt.level),G=tw(Mt.grounded,Mt.position.y,G),N.mesh.position.set(Mt.position.x,G+.028,Mt.position.z),N.update(Zt.arcRad,Zt.opacity,Zt.scale,pt,W);const Ht=X.config.abilities.arcane,Yt=Math.max(1,Math.floor(Ht.waves)),Xt=Math.max(1e-4,Ht.waveInterval),ce=KS({charging:ne.charging,charge:ne.charge,channeling:X.abilities.channeling,fireTimer:X.abilities.fireTimer,fireInterval:Xt,channelProgress:X.abilities.channeling?(X.abilities.waveIndex+(1-Math.min(1,Math.max(0,X.abilities.fireTimer/Xt))))/Yt:0,arcaneCooldown:X.abilities.cooldown,arcaneCooldownMax:Ht.cooldown,dashCooldown:X.dash.cooldown,dashCooldownMax:X.dash.kind==="blink"?X.config.dash.blinkCooldown:X.config.dash.rollCooldown});ft.mesh.position.set(Mt.position.x,Mt.position.y+.03,Mt.position.z),ft.set(ce.ratio,ce.source==="none"?0:R.meterOpacity,ce.source==="charge"?At:ce.source==="channel"?bt:Ft,W);const ye=X.playerLink,Se=ye.weapon?X.config.links.moves[ye.weapon]:void 0,Te=JS(ye.phase,Mt.position.x,Mt.position.z,ye.facing,ye.travel,(Se==null?void 0:Se.hit.radius)??.9);j.set(Te.x,Te.z,.042,Te.radius,Te.active?R.landingOpacity:0,X.time);for(let _t=0;_t<Z.length;_t++){const Tt=X.dummies[_t],ie=Z[_t],Ae=st[_t],Ue=at[_t];if(!Tt){ie.mesh.visible=!1,Ae.mesh.visible=!1,Ue.mesh.visible=!1;continue}const xe=X.targeting.hasTarget&&X.targeting.targetId===Tt.id;if(Q0(X,Tt)){const _s=tg(X,Tt);pt.copy(q).lerp(St,_s)}else pt.copy(Q);const we=jS(Tt.attackPhase,Tt.attackPhaseTimer,X.config.dummies.attackWindup);we.active?(pt.lerp(H,.5*we.urgency),Ue.mesh.position.set(Tt.position.x,Tt.position.y+.031,Tt.position.z),Ue.set(we.ratio,R.warnOpacity*(.65+.35*we.urgency),H,W)):Ue.set(0,0,H,W);const wn=xe?1:0,fn=wn>mt[_t]?R.haloFadeInSec:R.haloFadeOutSec;mt[_t]=nf(mt[_t],wn,It,fn);const He=mt[_t],vn=1+.02*He*Math.sin(X.time*2.2+Tt.id),Un=R.arcDeg+(R.selectedArcDeg-R.arcDeg)*He;ie.mesh.position.set(Tt.position.x,Tt.position.y+.022,Tt.position.z),ie.update(Un*Math.PI/180,R.opacity+(R.selectedOpacity-R.opacity)*He,1+(R.selectedScale-1)*He*vn,pt,W,1+(R.selectedThicknessScale-1)*He),dt[_t]=nf(dt[_t],wn,It,wn>dt[_t]?R.haloFadeInSec:R.haloFadeOutSec);const ys=dt[_t];Ae.mesh.position.set(Tt.position.x,Tt.position.y+.019,Tt.position.z),Ae.update(Un*Math.PI/180,R.haloOpacity*ys*(.88+.12*Math.sin(X.time*2.2+Tt.id)),R.selectedScale*(.94+.06*ys)*vn,pt,W)}if(ee.position.set(Mt.position.x,Mt.position.y,Mt.position.z),ee.rotation.y=ne.phase!=="idle"?ne.attackFacing:Mt.bodyYaw,X.dash.id!==gn){gn=X.dash.id;const _t=X.dash;Fe=_t.kind,_t.kind==="blink"?(Qt(_t.fromX,_t.fromZ,Mt.position.y,lt.blinkColor,.9),Qt(_t.toX,_t.toZ,Mt.position.y,lt.blinkColor,1.35)):Qt(_t.fromX,_t.fromZ,Mt.position.y,lt.rollColor,1.1)}for(const _t of Ct){if(_t.life<=0)continue;_t.life-=It;const Tt=Math.max(0,_t.life/lt.fxDuration);_t.mat.opacity=.9*Tt,_t.mesh.scale.setScalar(_t.base*(.6+(1-Tt)*1.2)),_t.life<=0&&(_t.mesh.visible=!1)}const de=X.playerLink;de.id!==Be&&(Be=de.id,nn=de.hitIds.length,Pe(Mt.position.x,Mt.position.z,Mt.position.y,1)),de.hitIds.length>nn?(nn=de.hitIds.length,Pe(Mt.position.x,Mt.position.z,Mt.position.y,1.35)):de.hitIds.length<nn&&(nn=de.hitIds.length);for(const _t of se){if(_t.life<=0)continue;_t.life-=It;const Tt=Math.max(0,_t.life/Math.max(oe.fxDuration,1e-6));_t.mat.opacity=.85*Tt,_t.mesh.scale.setScalar(_t.base*(.55+(1-Tt)*1.1)),_t.life<=0&&(_t.mesh.visible=!1)}const jt=yt.slashEnabled&&ne.phase==="active"&&ne.comboIndex>=3;L.opacity=jt?.7:0,A.opacity=jt?yt.slashGlowOpacity:0,jt&&(rt.rotation.z=-1.2+ne.attackProgress*3.2,rt.scale.setScalar(.9+ne.comboIndex*.13));for(let _t=0;_t<Pt.length;_t++){const Tt=X.abilities.projectiles[_t],ie=Pt[_t];ie.group.visible=!!Tt,Tt&&(ie.group.position.set(Tt.x,Tt.y,Tt.z),ie.group.scale.setScalar(Tt.radius),ie.group.rotation.set(0,Math.atan2(Tt.dirX,Tt.dirZ),0))}for(let _t=0;_t<it.length;_t++){const Tt=X.abilities.rings[_t],ie=it[_t];if(!Tt){ie.group.visible=!1;continue}const Ae=Math.max(0,Math.min(1,Tt.life/Math.max(Tt.duration,1e-6))),Ue=QS(Math.max(0,Tt.duration-Tt.life),R.areaExpandSec);ie.set(Tt.x,Tt.z,.045,Tt.radius*Ue.scale,R.areaOpacity*(.35+.65*Ae)*Ue.alpha,X.time)}for(let _t=0;_t<O.length;_t++){const Tt=X.arrows[_t],ie=O[_t];if(!Tt){ie.group.visible=!1,ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=0;continue}const Ae=Tt.stuck&&Tt.stuckDummy>=0;if(ie.arrowId!==Tt.id){if(ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=Tt.id,ie.group.position.set(Tt.x,Tt.y,Tt.z),ie.group.rotation.set(Tt.pitch,Tt.yaw,0,"YXZ"),Ae){const xe=T[Tt.stuckDummy],we=xe?xe.boneAtWorld(Tt.x,Tt.y,Tt.z):null;we&&(we.node.attach(ie.group),ie.bone=we.node)}}else ie.bone||(ie.group.position.set(Tt.x,Tt.y,Tt.z),ie.group.rotation.set(Tt.pitch,Tt.yaw,0,"YXZ"));ie.group.visible=!0;const Ue=Tt.stuck?Math.min(1,Tt.rest/.6):1;ie.shaftMat.opacity=Ue,ie.tipMat.opacity=Ue,ie.glowMat.opacity=(Tt.stuck?.28:.85)*Ue,ie.trailMat.opacity=Tt.stuck?0:yt.trailOpacity*Ue,ie.trail.visible=!Tt.stuck}he.update(Mt.position.x,Mt.position.y,Mt.position.z,It,X.camera),o.render(r,he.camera)},resize(){const X=Math.max(1,n.clientWidth),It=Math.max(1,n.clientHeight);o.setSize(X,It,!1),he.resize(X/It)},getGroundBasis(){return he.getGroundBasis()},setCollidersVisible(X){for(const It of h)It.opacity=X?.3:1,It.wireframe=X,It.needsUpdate=!0},setGridVisible(X){u.visible=X},setLabVisible(X){m.setVisible(X)},setLabLabelsVisible(X){m.setLabelsVisible(X)},snapCamera(X,It,Mt){he.snap(X,It,Mt)},setZoom(X){he.setZoom(X)},setBodyType(X){var Mt;const It=(Mt=e.bodyTypes)==null?void 0:Mt[X];return!It||X===g||(w.remove(p.group),p.dispose(),p=_(It),p.group.position.y=-v,w.add(p.group),y.reset(),g=X,t.config.characterHeight=It.height,It.radius!==void 0&&(t.config.characterRadius=It.radius)),g},bodyTypes(){return{id:g,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Fn,projectToScreen:Qe,diagnostics(){const X=Vp(e.camera.pitchDeg),It=nw(X,ee.rotation.y);return{lean:p.lean(),slashNormal:It,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:Ct.filter(Mt=>Mt.life>0).length,lastKind:Fe},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...he.smart(),shake:he.shakeLevel(),kick:he.kickLevel(),kickCount:he.kickCount()}}},dispose(){p.dispose(),m.dispose();for(const X of T)X.dispose();N.dispose();for(const X of Z)X.dispose();for(const X of st)X.dispose();ft.dispose(),y.dispose();for(const X of at)X.dispose();j.dispose(),J.dispose(),L.dispose(),A.dispose(),ct.dispose(),Vt.dispose(),Ot.dispose(),qt.dispose(),F.dispose();for(const X of it)X.dispose();vt.dispose(),Nt.dispose(),ot.dispose(),wt.dispose();for(const X of O)X.shaftMat.dispose(),X.tipMat.dispose(),X.glowMat.dispose(),X.trailMat.dispose();Dt.dispose(),Rt.dispose();for(const X of Ct)X.mat.dispose();Lt.dispose();for(const X of se)X.mat.dispose();pe.dispose(),f.traverse(X=>{X instanceof _e&&X.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Cw(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function Lw(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Dw(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),f=i("diag-mask");let d=!1,u=!0,m=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function g(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),f.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const y=n.summary();Cw(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);Lw(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{u=!u,n.setEnabled(u),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>g(!1)}}const kw={intents:{...cf},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Iw(){var Q;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=ng(Vg,vo),i=Pw(n,e,hn,vo.stations),a=cg(e),s=bx(t),o=Sx(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.56 · 11-08 16:03 · 诊断");const l=q=>String(q).padStart(2,"0"),c=new Date,h=Ng({meta:{version:"v0.9.56",buildTime:"11-08 16:03",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),f=Dw(h,r),d=yx({deadZone:()=>hn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const u={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid,showLab:hn.lab.enabled,showLabLabels:hn.lab.showLabels};let m=1,_=!1;const g=Ag({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>hn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(q){if(q===y)return;y=q;const St=ya.indexOf(q)+1;for(const At of p)At.classList.toggle("is-active",Number(At.dataset.weapon)===St);E.refreshWeapon()}let v=kw,w=0;const S=()=>{m=1,i.setZoom(1)},E=nx(e,hn,u,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...cf,resetPressed:!0})},resetZoom:S,onToggleColliders:q=>i.setCollidersVisible(q),onToggleGrid:q=>i.setGridVisible(q),onToggleLab:q=>i.setLabVisible(q),onToggleLabLabels:q=>i.setLabLabelsVisible(q)}),T=sx({stations:vo.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),R=q=>{var St,At;return((At=(St=hn.bodyTypes)==null?void 0:St[q])==null?void 0:At.name)??q},z=()=>{if(!M)return;const q=i.bodyTypes().id;M.textContent=`体型 ${R(q)}`,M.setAttribute("aria-label",`切换体型（当前：${R(q)}，快捷键 B）`)},I=document.createElement("div");I.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(I);let U=0;const C=q=>{I.textContent=q,I.style.opacity="1",window.clearTimeout(U),U=window.setTimeout(()=>{I.style.opacity="0"},1600)},k=()=>{if(b.length<2){C("只有一个体型预设");return}const q=i.bodyTypes().id,St=Math.max(0,b.indexOf(q)),At=i.setBodyType(b[(St+1)%b.length]);z(),C(`体型：${R(At)}（B / 顶部胶囊切换）`)};z(),M==null||M.addEventListener("click",k),window.addEventListener("keydown",q=>{q.repeat||q.code!=="KeyB"||k()}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:hn,debug:u,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:ft,applied:at,enabled:st,skip:j}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),setRenderInterp:q=>(st=!!q,st),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(q,St,At)=>i.projectPoint(q,St,At),setBodyType:q=>{const St=i.setBodyType(q);return z(),St},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var q;return Object.keys(((q=hn.animation.swing)==null?void 0:q.clips)??{})},preview:q=>{const St=e.combat,At={...St};St.weapon=q.weapon,St.phase="active",St.comboIndex=Math.max(1,Math.min(3,Math.floor(q.comboIndex))),St.attackProgress=Math.max(0,Math.min(1,q.progress)),St.attackFacing=e.character.bodyYaw,i.setClipT(typeof q.t=="number"?q.t:null);const bt=Math.max(1,Math.min(30,Math.floor(q.warm??12)));_=!0;for(let Ft=0;Ft<bt;Ft++)i.render(e,1/60);return i.setClipT(null),Object.assign(St,At),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:q=>{e.character.bodyYaw=q},zoom:q=>{m=bd(q,1,hn.zoom.min,hn.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:vo.stations??[],goto:q=>T.goto(q),current:()=>T.current(),recall:()=>T.recall()}};let G=performance.now(),N=60,Z=0,st=((Q=hn.renderInterp)==null?void 0:Q.enabled)??!0,mt=Md(e),dt=null,ft=1,at=!1,j="";function pt(q){const St=st&&!u.paused&&u.timeScale>0;if(at=!1,j="",!St)return j="off",ft=1,e;if(!dt)return j="noprev",ft=1,e;if(!hg(dt,mt))return j="key",ft=1,e;const At=a.alpha;return ft=At,At>=.999?(j="alpha",e):(at=!0,ug(e,dg(dt,mt,At)))}function K(q){const St=Math.min((q-G)/1e3,.1);G=q,St>0&&(N=N*.9+1/St*.1);const At=g.sample();At.intents.resetPressed&&(m=1),m=bd(m,At.zoomScale,hn.zoom.min,hn.zoom.max),i.setZoom(m);let bt=At.intents.dummyClickId;if(At.tap){const ee=i.pickDummy(At.tap.x,At.tap.y);ee>0&&(bt=ee)}bt>0&&(w=bt),v={...At,intents:{...At.intents,dummyClickId:w}};const Ft=a.frame(St,v.intents,u.timeScale,u.paused,()=>{const ee=e.events;for(let yt=0;yt<ee.length;yt++)h.event(ee[yt],e.time);dt=mt,mt=Md(e)});Ft>0&&(w=0),h.sample(e,v,St*1e3,Ft);for(const ee of v.gestures)h.gesture(ee);q-Z>250&&(Z=q,f.tick()),x(e.combat.weapon),_||i.render(pt(),St),T.tick(),d.update(e,v,i.getGroundBasis());const H=i.diagnostics();s.update(e,N,Ft,v,u,{attackBlend:H.attackBlend,attackWeights:H.attackWeights,landing:H.landing,hurt:H.hurt,ik:H.ik,zoom:H.camera.zoom},o.hudCompact()),requestAnimationFrame(K)}requestAnimationFrame(K)}Iw();

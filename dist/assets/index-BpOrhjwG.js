(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const Sa=["sword-shield","dual-swords","greatsword","staff","bow"],ec=["wander","follow","keep-distance","attack","idle"],lf={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},xr=1e-6;function to(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>xr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Pm(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>xr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>xr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const on=1e-6,Ys=Math.PI/180,eh=-1e9;function hf(){return{type:"none",lastAt:eh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function $s(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function id(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function nh(n,t,e){var c,h;const i=e.duration>0?e.duration:Dr(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(id(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>on){const d=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*d,u.knockZ=e.dirZ*d}$s(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(id(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>on){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,$s(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(h=n.config.hits.hitstopWarp)!=null&&h.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,$s(n,"hitstop",l,a.position))}function uo(n,t,e){nh(n,{kind:"dummy",index:t},e)}function Cm(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Dr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function ad(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Lm(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function Dm(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>on?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-on||c>r+on)return;const h=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Ys),d=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),y=(g==null?void 0:g.tolDeg)??10;let x=0,v=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const T=ad(p.pts,0),b=ad(p.pts,c);x=Math.min(T,b)-y,v=Math.max(T,b)+y,w=!0}}for(const T of n.dummies){if(t.hitIds.indexOf(T.id)>=0)continue;const b=T.position.x-i.x,M=T.position.z-i.z,R=Math.hypot(b,M);if(R>h+m)continue;const F=R>on?b/R:d,z=R>on?M/R:f;if(R>on&&(b*d+M*f)/R<u)continue;if(w){const G=Lm(Math.atan2(b,M)/Ys-t.attackFacing/Ys);if(G<x||G>v)continue}let H="light";t.weapon==="greatsword"?H="knock":t.comboIndex>=3&&(H="heavy");const L=e.knockback[t.weapon]??0;let I=R;L>0&&(I=Math.max(R+L,_));const Y=Math.max(0,I-R);uo(n,n.dummies.indexOf(T),{type:H,duration:Dr(n,H),dirX:F,dirZ:z,knockback:Y}),t.hitIds.push(T.id)}}function km(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>on?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-on)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),h=n.config.dummies.radius,u=Math.max(0,i.radius),d=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const y=n.dummies[p];if(d&&t.hitIds.indexOf(y.id)>=0)continue;const x=y.position.x-r.x,v=y.position.z-r.z,w=Math.hypot(x,v);if(w>u+h)continue;const S=w>on?x/w:l,E=w>on?v/w:c,T=m>0?Math.max(w+m,_):w,b=Math.max(0,T-w);uo(n,p,{type:f,duration:Dr(n,f),dirX:S,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(y.id)}$s(n,"ground-slam",u,{x:r.x+l*Math.min(u*.25,.5),y:r.y,z:r.z+c*Math.min(u*.25,.5)})}function Im(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,h=o.z,u=c-r,d=h-l,f=u*u+d*d,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(sd(s.arcDeg,0,180)*Ys),p=n.config.dummies.radius;for(let y=0;y<n.dummies.length;y++){const x=n.dummies[y];if(i.hitIds.indexOf(x.id)>=0)continue;const v=f>on?sd(((x.position.x-r)*u+(x.position.z-l)*d)/f,0,1):0,w=r+u*v,S=l+d*v,E=Math.hypot(x.position.x-w,x.position.z-S);let T=!1;if(s.shape==="circle")T=E<=s.radius+p;else if(s.shape==="capsule")T=E<=Math.max(s.radius,s.width)+p;else{const H=x.position.x-c,L=x.position.z-h,I=Math.hypot(H,L),Y=I>on?(H*m+L*_)/I>=g:!0;T=I<=s.radius+p&&Y||E<=s.width+p}if(!T)continue;const b=x.position.x-r,M=x.position.z-l,R=Math.hypot(b,M);if(R>on&&(b*m+M*_)/R<Math.cos(Math.max(s.arcDeg,90)*Ys))continue;const F=R>on?b/R:m,z=R>on?M/R:_;nh(n,{kind:"dummy",index:y},{type:s.type,duration:s.duration,dirX:F,dirZ:z,knockback:s.knockback}),i.hitIds.push(x.id),$s(n,"link-hit",x.id,x.position)}}function zm(n){const t=n.config.hits,e=n.character.position;for(const i of n.events){if(i.type!=="dummy-hit")continue;const a=n.dummies[i.value-1];if(!a)continue;const s=e.x-a.position.x,o=e.z-a.position.z,r=Math.hypot(s,o);if(r>t.dummyReach)continue;const l=r>on?s/r:0,c=r>on?o/r:1;nh(n,{kind:"player"},{type:"light",duration:Dr(n,"light"),dirX:l,dirZ:c,knockback:t.dummyKnockback,sourceId:a.id})}}function Fm(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Dm(n),km(n)),Im(n,t),zm(n))}function sd(n,t,e){return n<t?t:n>e?e:n}const df=Math.PI/180,ih=1e-6;function Um(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function vr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function uf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>ih?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function ff(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,ih)&&s<=Math.max(0,e.inputDeadZone)&&!o}function Nm(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function Om(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!ff(n,t,e))return!1;const i=uf(n,t,e.lookRange);if(i===null)return!1;const a=Xe(i-n.character.bodyYaw);return Math.abs(a)>pf(n,e)}function pf(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*df}function Bm(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!ff(n,e,a)){vr(n);return}const s=uf(n,e,a.lookRange);if(s===null){vr(n);return}const o=n.character,r=Xe(s-o.bodyYaw),l=Math.abs(r),c=pf(n,a),h=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>ih;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(l,Math.max(0,a.settleDeg)*df);i.targetYaw=Xe(o.bodyYaw+i.dir*(l-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const d=Xe(i.targetYaw-i.fromYaw);o.bodyYaw=Xe(i.fromYaw+d*Nm(i.progress)),h||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const ji=1e-6;function Xe(n){return Math.atan2(Math.sin(n),Math.cos(n))}function So(n,t,e,i){const a=Xe(t-n);return n+a*(1-Math.exp(-Math.max(e,ji)*i))}function wo(n,t,e,i,a){const o=Xe(t-n)*(1-Math.exp(-Math.max(e,ji)*a)),r=Math.max(i,0)*a;return r<=ji?n:n+ss(o,-r,r)}function od(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,ji)*a)),o=Math.max(i,0)*a;return o<=ji?n+s:n+ss(s,-o,o)}function ss(n,t,e){return n<t?t:n>e?e:n}function rd(n,t,e,i){const a=Xe(t-n),s=Math.abs(a);return s<=i||s<=e?t:Xe(n+Math.sign(a)*Math.max(e,0))}function Hm(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,h=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>ji,d=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=to(n,e);else if(c)i.facing=wo(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=to(n,e);else if(d)i.facing=n.targeting.targetYaw;else if(h>Math.max(a.facingDeadZone,ji)){const M=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,F=a.facingSnapDeg*Math.PI/180;if(h>=.35)i.facing=rd(i.facing,M,R,F);else if(h>=a.facingMinMagnitude&&Math.abs(Xe(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const H=So(i.facing,M,a.facingSmoothRate,t);i.facing=rd(i.facing,H,R,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||Om(n,e)||(c?i.bodyYaw=wo(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=So(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Xe(p-i.bodyYaw))>M&&(p=i.moveYaw)}const y=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let v;if(y){const M=c?n.config.gaze.headTurnRate:a.headTurnRate;v=c?wo(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):So(i.headYaw,p,M,t)}else{const M=Xe(i.headYaw-i.bodyYaw),R=Xe(p-i.bodyYaw),F=Math.abs(R)<Math.abs(M)-1e-9,z=F?n.config.gaze.headReturnRate:a.headTurnRate,H=F?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(H)?wo(M,R,z,H,t):So(M,R,z,t);v=i.bodyYaw+L}const w=Xe(v-i.bodyYaw);w>x?v=i.bodyYaw+x:w<-x&&(v=i.bodyYaw-x),i.headYaw=v;const S=n.config.gaze;let E=0;if(c)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const R=i.position.y+n.config.characterHeight*ss(S.eyeHeightRatio,0,1),F=M.position.y+n.config.dummies.height*ss(S.aimHeightRatio,0,1),z=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(F-R,Math.max(ji,z))}}const T=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=ss(E,-T,T);const b=y?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=od(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=od(i.bodyPitch,i.headPitch*ss(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const mf=1e-6,kr=Math.PI/180;function Ir(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Gm(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*kr,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);u<.001||u>s||Math.abs(Xe(Math.atan2(c,h)-t))>a||o.push({i:r,d:u})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function Vm(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function Xm(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*kr,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=Gm(n,e.channelYaw,t);for(let c=0;c<a;c++){const h=(c-(a-1)*.5)*s,u=e.channelYaw+h,d=(c-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*d,y:i.y+1,z:i.z+m*.5-Math.sin(u)*d,yaw:u,speed:t.speed*(1+(Vm(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Ir(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function Wm(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*kr,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Ir(n,"projectile-fire",i.volleyId,o)}i.pending=a}function cd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Ir(n,"channel-end",0,n.character.position))}function Ym(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,h=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!h&&(o.needsRelease=!1),o.channeling){if(!h){cd(n,i);return}}else{if(!(h&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Ir(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=to(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,mf),Xm(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){cd(n,i);break}}function $m(n,t,e){const i=Math.max(0,e.homingConeDeg)*kr,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+mf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],h=c.position.x-t.x,u=c.position.z-t.z,d=Math.hypot(h,u);d<.001||d>r||Math.abs(Xe(Math.atan2(h,u)-s))>i||(o=l,r=d)}return o}function Zm(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=$m(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const h=Math.atan2(c.position.x-r.x,c.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),d=Xe(h-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,d)),_=u+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(!(u*u+d*d>f*f)){uo(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const qm={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;Ym(n,t,e,s,a,i.cfg.slot),Wm(n,t,s),Zm(n,t,s)}},nc=1e-6;function gf(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function jm(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),gf(n,"ring-place",i.id,e)}function Km(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,nc),s)for(let c=0;c<n.dummies.length;c++){const h=n.dummies[c],u=h.position.x-r.x,d=h.position.z-r.z,f=r.radius+a;if(u*u+d*d>f*f)continue;const m=Math.hypot(u,d),_=m>nc?u/m:0,g=m>nc?d/m:1;uo(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}gf(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const Jm={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&jm(n,s),Km(n,t,s)}},Qm={channelVolley:qm,groundRing:Jm};function t0(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function e0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=Qm[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function n0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function xf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function i0(n,t,e){e0(n,t,e)}function ic(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const ld=1e-6;function hd(n,t,e){return n<t?t:n>e?e:n}function vf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function yf(n){const t=n.camera,e=vf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function a0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const h=c.position.x-i.x,u=c.position.z-i.z,d=Math.hypot(h,u);if(d>e.radius)continue;const f=hd((e.radius-d)/Math.max(ld,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:hd(a/(a+Math.max(ld,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,h=o/a;t.centroidX=c,t.centroidZ=h;let u=(c-i.x)*e.framingBias*l,d=(h-i.z)*e.framingBias*l;const f=Math.hypot(u,d);f>e.maxOffset&&(u=u/f*e.maxOffset,d=d/f*e.maxOffset),t.offsetX=u,t.offsetZ=d}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function s0(n){const t=[],e=n.ground.size;t.push(Oa("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Oa(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Oa(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Oa(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Oa(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Oa(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Oa(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const ki=1e-6;function yr(n,t,e){return n<t?t:n>e?e:n}function eo(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+ki||c.maxY<i-o-ki||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function ah(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+ki||l.minY>=o-ki)continue;const c=yr(t.x,l.minX,l.maxX),h=yr(t.z,l.minZ,l.maxZ),u=t.x-c,d=t.z-h,f=u*u+d*d;if(!(f>=e*e))if(s=!0,f>ki*ki){const m=Math.sqrt(f),_=(e-m)/m;t.x+=u*_,t.z+=d*_}else{const m=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,y=Math.min(m,_,g,p);y===m?t.x=l.minX-e:y===_?t.x=l.maxX+e:y===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function sh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+ki||o.minY>=s-ki)continue;const r=yr(t.x,o.minX,o.maxX),l=yr(t.z,o.minZ,o.maxZ),c=t.x-r,h=t.z-l;if(c*c+h*h<e*e-ki)return!0}return!1}const Zi=1e-6,gs=Math.PI/180;function oh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function jc(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function _f(n){n.arrows.length=0}function o0(n,t,e,i,a,s,o,r,l,c,h){const u=i-n,d=s-e,f=u*u+d*d;let m=0;f>Zi&&(m=((o-n)*u+(r-e)*d)/f,m=Math.max(0,Math.min(1,m)));const _=n+u*m,g=e+d*m,p=_-o,y=g-r;if(p*p+y*y>h*h)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function r0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=Zi)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*gs,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+Zi;for(const h of n.dummies){if(!n.modules.dummies)break;const u=h.position.x-a.x,d=h.position.z-a.z,f=Math.hypot(u,d);if(!(f<.001||f>i)){if(h.id===r)return h.id;Math.abs(oh(Math.atan2(u,d)-t))>s||f<c&&(l=h.id,c=f)}}return l}function c0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*gs;return t+ls(oh(s-t),-o,o)}function l0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*gs),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*gs),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const h=c/Math.max(Zi,s),u=l.position.y+n.config.dummies.height*ls(o.aimHeightRatio,0,1),d=Math.max(0,o.gravity),f=(u-e+.5*d*h*h)/h,m=ls(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function h0(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=r0(n,e),l=c0(n,e,r),c=Math.sin(l),h=Math.cos(l),u=o.x+Math.sin(e)*.55,d=o.z+Math.cos(e)*.55,f=o.y+.95,m=l0(n,u,f,d,r,s),_={id:++n.arrowSeq,x:u,y:f,z:d,vx:c*m.horizontal,vy:m.vy,vz:h*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*gs};return n.arrows.push(_),jc(n,"arrow-shot",a,_),_}function ls(n,t,e){return n<t?t:n>e?e:n}function d0(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const v=n.dummies[c.stuckDummy];if(v){const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw);c.x=v.position.x+c.offX*w+c.offZ*S,c.y=v.position.y+c.offY,c.z=v.position.z-c.offX*S+c.offZ*w,c.yaw=v.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const h=c.x,u=c.y,d=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const v=n.dummies.find(w=>w.id===c.targetId);if(!v)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>Zi){const S=Math.atan2(v.position.x-c.x,v.position.z-c.z),E=Math.atan2(c.vx,c.vz),T=c.turnRate*t,b=E+ls(oh(S-E),-T,T);c.vx=Math.sin(b)*w,c.vz=Math.cos(b)*w;const M=Math.hypot(v.position.x-c.x,v.position.z-c.z);if(M>.3){const R=M/w,z=(v.position.y+s*ls(i.aimHeightRatio,0,1)-c.y+.5*r*R*R)/R,H=Math.max(0,i.verticalTurnRate)*t;c.vy+=ls(z-c.vy,-H,H)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const f=h+c.vx*t,m=u+c.vy*t,_=d+c.vz*t;let g=-1,p=2;if(o)for(let v=0;v<n.dummies.length;v++){const w=n.dummies[v],S=o0(h,u,d,f,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=v)}if(g>=0){const v=n.dummies[g];c.x=h+(f-h)*p,c.y=u+(m-u)*p,c.z=d+(_-d)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(v.bodyYaw),S=Math.sin(v.bodyYaw),E=c.x-v.position.x,T=c.z-v.position.z;c.offX=E*w-T*S,c.offZ=E*S+T*w,c.offY=c.y-v.position.y;const b=Math.atan2(c.vx,c.vz);c.localYaw=b-v.bodyYaw,c.yaw=b,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const M=Math.hypot(c.vx,c.vz);uo(n,g,{type:"light",duration:.22,dirX:M>Zi?c.vx/M:0,dirZ:M>Zi?c.vz/M:1,knockback:.14}),jc(n,"arrow-land",v.id,c),l.push(c);continue}const y=eo(n.boxes,f,_,m+.4,.04,0,6),x=Number.isFinite(y)?y:0;if(m<=x+.02&&c.vy<0){c.x=f,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const v=Math.atan2(-c.vy,Math.max(Zi,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(v,Math.max(0,i.stickMinPitchDeg)*gs),c.rest=Math.max(.2,i.stickSec),jc(n,"arrow-land",-1,c),l.push(c);continue}c.x=f,c.y=m,c.z=_,l.push(c)}n.arrows=l}const Kc=1e-6,u0=Math.PI/180;function Jc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function rh(n,t,e){return n<t?t:n>e?e:n}function zr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Qc(n){const t=n.id,e=n.windowId;Object.assign(n,zr()),n.id=t,n.windowId=e}function f0(n){Qc(n)}function Mf(n){Qc(n.playerLink);for(const t of n.dummies)Qc(t.link)}function p0(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function tl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function _r(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,zr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function m0(n,t){const e=n.config.links.search,i=n.character.position,a=rh(e.maxAngleDeg,0,180)*u0;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,h=l.position.z-i.z,u=Math.hypot(c,h);if(u<Kc||u>e.range)continue;const d=Math.atan2(c,h);Math.abs(Xe(d-t))>a||u<r&&(r=u,s=l.id,o=d)}return{id:s,yaw:o,dist:s>0?r:0}}function g0(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=to(n,t),l=m0(n,r),c=l.id>0?l.yaw:r,h=l.id>0?rh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=h,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),Jc(n,"link-start",s.id)}function x0(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){_r(n);return}if(e.weapon!==n.combat.weapon){_r(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,Jc(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,Jc(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?rh(r/o,0,1):1,e.phase==="active"&&i.active>Kc){const l=Math.max(0,e.travel-e.travelled),c=Math.max(Kc,i.active-e.timer),h=l/c;n.impulse.x=Math.sin(e.facing)*h,n.impulse.z=Math.cos(e.facing)*h}}function v0(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&_r(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&tl(n,"sprint"),a.prevSprinting=r,x0(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&g0(n,e,l,o.weapon)}const rr={windup:0,active:1,recovery:2},dd=1e-9;function bf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function y0(n){return n==="windup"||n==="active"||n==="recovery"}function _0(n,t){return rr[n]+bf(t)}function M0(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!y0(s.at))continue;const o=bf(s.u??0),r=rr[s.at]+o;r>i+dd&&r<=e+dd&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>rr[s.at]+s.u-(rr[o.at]+o.u)),a}const no=1e-6;function qi(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function b0(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Sf(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Fr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Sf()}function S0(n){return{weapon:Sa[Math.max(0,n-1)]??Sa[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Sf()}}function w0(n,t){return to(n,t)}function E0(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function wf(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=w0(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,qi(n,"attack-start",i)}function Ef(n){return Math.max(0,n.config.combat.settle)}function el(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];wf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ef(n),lunge:E0(n,i.lunge[e-1]??0)},e)}function ud(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,wf(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ef(n),lunge:i.lunge},0),h0(n,e,n.combat.attackFacing),qi(n,"charge-release",e)}function T0(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function A0(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=T0(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const h=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<h)break;if(i.phaseTimer-=h,i.phase==="windup")i.phase="active",qi(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,qi(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&el(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const h=i.timings.recovery;if(h>no&&i.phaseTimer>=h*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&el(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),R0(n)}function R0(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>no?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:_0(t.phase,a);if(s<=t.notifyCursor+no)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of M0(o,t.notifyCursor,s))b0(n,r.name,r.value);t.notifyCursor=s}function P0(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=Sa.length){const l=Sa[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Fr(n),_r(n),qi(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,qi(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),A0(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const h=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;el(n,e,h)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,qi(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,no)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,ud(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?ud(n,e,l):qi(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>no)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),h=Math.max(.2,a.lungeCurve),u=g=>c*(1-Math.pow(1-Math.min(1,Math.max(0,g/l)),h+1)),d=t*i.warp,f=Math.min(l,Math.max(0,i.phaseTimer)),m=Math.min(l,Math.max(0,i.phaseTimer-d));let _=Math.max(0,u(f)-u(m))/Math.max(d,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const nl=1e-6;function ac(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function C0(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Tf(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function fd(n,t,e){return n<t?t:n>e?e:n}function L0(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,h=s.x,u=s.z;for(;c<l-nl;){const d=Math.min(l,c+r),f=s.x+t*d,m=s.z+e*d,_=fd(f,o.minX,o.maxX),g=fd(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(sh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(h=_,u=g,c=d,_!==f||g!==m))break}return{x:h,z:u}}function D0(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,tl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&ac(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Fr(n));const l=Pm(n,e),c=l.x,h=l.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=c,i.dirZ=h,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const d=L0(n,c,h);n.character.position.x=d.x,n.character.position.z=d.z,i.toX=d.x,i.toZ=d.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),tl(n,"blink"),ac(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(nl,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+h*a.rollDistance,ac(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(nl,i.timer),c=n.character.position.x,h=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-h)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const un=1e-6,il=Math.PI*2,k0=7,I0=18;function z0(n){return Math.atan2(Math.sin(n),Math.cos(n))}function pd(n,t,e,i){return n+z0(t-n)*(1-Math.exp(-Math.max(e,un)*i))}function ch(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function F0(n){const t=[];for(let e=0;e<n.count;e++){const i=n.spawn[e]??{x:0,z:0},a=n.initialModes[e]??"idle";t.push({id:e+1,mode:a,initialMode:a,homeX:i.x,homeZ:i.z,position:{x:i.x,y:0,z:i.z},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:i.x,targetZ:i.z,wanderTimer:0,attackCooldown:0,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,hurt:hf(),link:zr()})}return t}function U0(n){const t=ec.indexOf(n);return ec[(t+1)%ec.length]}function Af(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0;const o=i.hurt;o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,f0(i.link)}n.dummyAttackCount=0}function N0(n,t,e){const i=ic(n)*il,a=Math.sqrt(ic(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+ic(n)*.8)}function O0(n,t){return n.attackPhase==="windup"?t.attackWindup:n.attackPhase==="active"?t.attackActive:n.attackPhase==="recovery"?t.attackRecovery:0}function B0(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0;return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const r=Math.max(O0(t,i),un);if(t.attackPhaseTimer<r)break;t.attackPhaseTimer-=r,t.attackPhase==="windup"?(t.attackPhase="active",ch(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0)}const s=i.attackWindup+i.attackActive+i.attackRecovery;let o=0;t.attackPhase==="windup"?o=t.attackPhaseTimer:t.attackPhase==="active"?o=i.attackWindup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(o=i.attackWindup+i.attackActive+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||s<=0?0:Math.min(1,o/s)}function H0(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>un?a/o:0,l=o>un?s/o:0;let c=0,h=0;if(t.mode==="wander"){const d=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(d,f);(t.wanderTimer<=0||m<.3)&&N0(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>un&&(c=_/p,h=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,h=l);else if(t.mode==="keep-distance"){const d=o-e.keepDistance;d>e.keepDeadZone?(c=r,h=l):d<-e.keepDeadZone?(c=-r,h=-l):(c=-l*e.keepStrafe,h=r*e.keepStrafe)}else t.mode==="attack"&&o>e.attackRange&&t.attackPhase==="idle"&&(c=r,h=l);let u=t.facing;if(t.mode==="wander"?Math.hypot(c,h)>un&&(u=Math.atan2(c,h)):o>un&&(u=Math.atan2(r,l)),e.leashRadius>un&&t.mode!=="wander"&&t.mode!=="idle"){const d=t.position.x-t.homeX,f=t.position.z-t.homeZ,m=Math.hypot(d,f);if(m>e.leashRadius){const _=Math.min(1,(m-e.leashRadius)/Math.max(e.leashRadius*.5,.5)),g=-d/m,p=-f/m;c=c*(1-_)+g*_,h=h*(1-_)+p*_;const y=Math.hypot(c,h);y>un&&(c/=y,h/=y)}}return{x:c,z:h,facing:u}}function G0(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.mode==="attack"&&e.attackPhase==="idle"&&e.attackCooldown<=0&&e.hurt.timer<=0){const p=n.character.position;Math.hypot(p.x-e.position.x,p.z-e.position.z)<=i.attackRange+un&&(e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=i.attackInterval,n.dummyAttackCount+=1,ch(n,"dummy-attack",e))}B0(n,e,t,i);const a=H0(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-un||a.x<0&&e.position.x<=s.minX+un)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-un||a.z<0&&e.position.z<=s.minZ+un)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,un)*t);e.velocity.x+=(a.x*i.moveSpeed-e.velocity.x)*o,e.velocity.z+=(a.z*i.moveSpeed-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=pd(e.bodyYaw,e.facing,k0,t),e.headYaw=pd(e.headYaw,e.facing,I0,t);const r=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const c=n.config.stepHeight;if(ah(n.boxes,e.position,i.radius,i.height,c))if(sh(n.boxes,e.position,i.radius,i.height,c))e.position.x=r,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const p=e.position.x-r,y=e.position.z-l;Math.abs(p)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(y)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const u=n.config.worldBounds;e.position.x<u.minX?(e.position.x=u.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>u.maxX&&(e.position.x=u.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<u.minZ?(e.position.z=u.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>u.maxZ&&(e.position.z=u.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const d=eo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,c,Number.POSITIVE_INFINITY);d>Number.NEGATIVE_INFINITY&&d<=e.position.y+c+un&&(e.position.y=d);const f=Math.hypot(e.position.x-r,e.position.z-l);e.distance+=f;const m=Math.hypot(e.velocity.x,e.velocity.z),_=Math.min(n.config.strideSpeedCap,m/Math.max(n.config.moveSpeed,un)),g=Math.max(n.config.strideLength*(1+_*n.config.strideSpeedGain),un);e.stride=g,e.gaitPhase=(e.gaitPhase+f/g*il)%il}function V0(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=U0(a.mode),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,ch(n,"dummy-mode",a)}for(const a of n.dummies)G0(n,t,a,i)}const ei=1e-6,md=Math.PI*2;function gd(n,t){return Math.sqrt(n*n+t*t)}function Eo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function X0(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Fr(n)}function W0(n,t,e){const i=n.character,a=n.config,s=eo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Fr(n),Mf(n),Tf(n),xf(n),_f(n),vr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=eh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Y0(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=gd(r,l);c>1&&(r/=c,l/=c);const h=i.worldBounds;(r>0&&s.x>=h.maxX-ei||r<0&&s.x<=h.minX+ei)&&(r=0),(l>0&&s.z>=h.maxZ-ei||l<0&&s.z<=h.minZ+ei)&&(l=0);const u=n.combat.phase!=="idle",d=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||d;a.sprinting=!m&&e.sprintHeld&&c>ei;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;f||d?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const z=m?i.skillDecel:c>ei?i.acceleration:i.friction,H=1-Math.exp(-z*t);o.x+=(r*p-o.x)*H,o.z+=(l*p-o.z)*H}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Eo(n,"jumped",i.jumpSpeed)),n.events.some(z=>z.type==="blink"&&z.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,v=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,ah(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(sh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=v,o.x=0,o.z=0;else{const z=s.x-x,H=s.z-v;Math.abs(z)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(H)<Math.abs(o.z*t)*.5&&(o.z=0)}Eo(n,"blocked",1)}s.x<h.minX?(s.x=h.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>h.maxX&&(s.x=h.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<h.minZ?(s.z=h.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>h.maxZ&&(s.z=h.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=eo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+ei&&S-s.y<=i.stepHeight+ei&&(s.y=S,o.y=0,Eo(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const T=eo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);T>Number.NEGATIVE_INFINITY&&s.y<=T&&o.y<=0?(s.y=T,o.y=0,a.grounded||Eo(n,"landed",T),a.grounded=!0):a.grounded=!1;const b=gd(s.x-x,s.z-v);a.distance+=b;const M=b/Math.max(t,ei),R=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,ei)),F=Math.max(i.strideLength*(1+R*i.strideSpeedGain),ei);a.stride=F,a.gaitPhase=(a.gaitPhase+b/F*md)%md}const al=1e-6,xd=2.399963229728653;function xa(n,t,e){return n<t?t:n>e?e:n}function vd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,h=t.z-n.z,u=Math.hypot(c,h),d=e+i;if(u>=d)return;let f,m,_;u<al?(f=r,m=l,_=d):(f=c/u,m=h/u,_=d-u);const g=_+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function $0(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let h=0;h<o;h++){for(let u=0;u<e.length;u++)for(let d=u+1;d<e.length;d++){const f=(u*3+d)*xd;vd(e[u].position,e[d].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const d=(u+1)*xd;vd(i,e[u].position,a,s,0,1,r,Math.cos(d),Math.sin(d))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const h of e)ah(n.boxes,h.position,s,n.config.dummies.height,l),h.position.x=xa(h.position.x,c.minX,c.maxX),h.position.z=xa(h.position.z,c.minZ,c.maxZ)}function Z0(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),h=xa(r.minScale,0,1);if(l<al||c<=0||h>=1)return 1;const u=a+o,d=xa(r.approachDot,0,.99);let f=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=u+c)continue;if(p<al){f=1;continue}const y=(e*_+i*g)/(l*p);if(y<=d)continue;const x=xa(1-(p-u)/c,0,1),v=xa((y-d)/(1-d),0,1);f=Math.max(f,x*v)}return 1-(1-h)*xa(f,0,1)}function q0(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Z0(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const sc=1e-6,j0=Math.PI/180;function K0(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function J0(n,t,e){return n<t?t:n>e?e:n}function Q0(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>sc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>sc&&(o=Math.atan2(e.moveX,e.moveZ));const l=J0(i.maxAngleDeg,0,180)*j0;let c=Number.POSITIVE_INFINITY,h=0,u=0,d=0;for(const f of n.dummies){const m=f.position.x-s.x,_=f.position.z-s.z,g=Math.hypot(m,_);if(g<sc||g>i.range)continue;const p=Math.atan2(m,_),y=Math.abs(Xe(p-o));if(y>l)continue;const x=g-i.frontBias*Math.cos(y);x<c&&(c=x,h=f.id,u=p,d=g)}a.targetId=h,a.targetYaw=u,a.targetDist=d,a.hasTarget=h>0}const gi=1e-6;function os(n,t,e){return n<t?t:n>e?e:n}function yd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function tg(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(z,H)=>{const L=z.position.x-s.x,I=z.position.z-s.z,Y=Math.hypot(L,I);if(Y<gi||Y>H)return 0;const G=os((H-Y)/Math.max(gi,H-i.nearDistance),0,1);let q=G*(i.modeWeight[z.mode]??.5);return z.attackPhase==="active"&&(q+=i.attackBoost*G),q},r=[];let l=0,c=!1,h=!1,u=!1;for(const z of n.dummies){const H=o(z,i.threatRange),L=z.position.x-s.x,I=z.position.z-s.z,Y=Math.hypot(L,I);H>0&&(r.push({id:z.id,x:z.position.x,z:z.position.z,dx:L,dz:I,yaw:Math.atan2(L,I),w:H}),l+=H,Y<=i.approachDist&&(i.modeWeight[z.mode]??.5)>=i.hostileModeWeight&&(u=!0)),Y>gi&&Y<=i.recoveryDist&&(c=!0),(z.attackPhase==="windup"||z.attackPhase==="active")&&Y<=i.threatRange&&(h=!0)}const d=l<=0?0:os(l/(l+Math.max(gi,i.saturation)),0,1),f=r.length>0,m=a.active,_=f&&(e.aimActive&&d>=i.enterThreshold||i.reactToAttack&&h&&d>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>gi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((z,H)=>H.w-z.w);const y=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],v=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,T=0,b=0;for(const z of y){const H=Math.abs(yd(z.yaw-v))/Math.PI;let L=z.w/(1+Math.max(i.spreadFalloff,0)*H*H);z!==x&&i.behindFalloff<1&&Math.abs(yd(z.yaw-S))>w&&(L*=Math.max(i.behindFalloff,0)),E+=z.x*L,T+=z.z*L,b+=L}a.mainId=x.id,a.mainYaw=v;const M=n.dummies.find(z=>z.id===x.id),R=(M?M.position.y:0)+n.config.dummies.height*os(i.aimHeightRatio,0,1),F=s.y+n.config.characterHeight*os(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(R-F,Math.max(gi,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>gi?Math.atan2(E/b-s.x,T/b-s.z):v,a.threatCount=r.length,a.threat=d}function eg(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function ng(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<gi||a>e.threatRange)return 0;const s=Math.max(gi,e.threatRange-e.nearDistance),o=os((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(gi,e.modeWeight.attack??1.5);return os(r/l,0,1)}function ig(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function ag(n,t){return{tick:0,time:0,rngState:2654435769,config:n,boxes:s0(t),gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:S0(1),playerLink:zr(),arrows:[],arrowSeq:0,abilities:n0(),skills:t0(n),impulse:{x:0,z:0},targeting:K0(),turnInPlace:Um(),playerHurt:hf(),hitCount:0,dash:{...C0(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...vf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:ig(),dummies:F0(n.dummies),dummyAttackCount:0,events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0}}}function sg(n){X0(n),Af(n),Mf(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=eh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,xf(n),_f(n),Tf(n),yf(n),vr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,n.events.length=0}function _d(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){sg(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Q0(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),v0(n,t,e),n.modules.combat&&P0(n,t,e),n.modules.dash&&D0(n,t,e),n.modules.movement&&Y0(n,t,e),n.modules.gaze&&tg(n,t,e),n.modules.orientation&&Hm(n,t,e),Bm(n,t,e),n.modules.dummies&&V0(n,t,e),Cm(n,t),p0(n,t),n.modules.abilities&&i0(n,t,e),n.modules.combat&&d0(n,t),n.modules.dummies&&(Fm(n,t),n.modules.separation&&($0(n),q0(n))),n.modules.camera?a0(n):yf(n),n}const Rf=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Md=1e-9;function og(n,t,e){return n<t?t:n>e?e:n}function Pf(n){return og(Number.isFinite(n)?n:0,0,1)}function Cf(n,t){const e=Pf(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function rg(){const n={};for(const t of Rf)n[t]=0;return n}function cg(n,t){const e=rg(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Pf(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Md;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Md?(a-o.t)/l:0,h=Cf(o.ease??"linear",c);for(const u of Rf){const d=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=d+(f-d)*h}return e}function lg(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Cf(i,t/a);return e.turns*Math.PI*2*s}function aa(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function hg(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const h=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};_d(n,r,h),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){_d(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function wi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Pe(n,t,e){return n+(t-n)*e}function dg(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function bd(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:dg(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function ug(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function fg(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Pe(n.ch.x,t.ch.x,i),y:Pe(n.ch.y,t.ch.y,i),z:Pe(n.ch.z,t.ch.z,i)},facing:wi(n.ch.facing,t.ch.facing,i),moveYaw:wi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:wi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:wi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Pe(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Pe(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:wi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Pe(n.ch.stride,t.ch.stride,i),velocity:{x:Pe(n.ch.vx,t.ch.vx,i),y:Pe(n.ch.vy,t.ch.vy,i),z:Pe(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Pe(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Pe(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Pe(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Pe(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Pe(n.hurt.timer,t.hurt.timer,i),knockX:Pe(n.hurt.knockX,t.hurt.knockX,i),knockZ:Pe(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const h=n.dm[c];return h?{position:{x:Pe(h.x,l.x,i),y:Pe(h.y,l.y,i),z:Pe(h.z,l.z,i)},facing:wi(h.facing,l.facing,i),bodyYaw:wi(h.bodyYaw,l.bodyYaw,i),headYaw:wi(h.headYaw,l.headYaw,i),gaitPhase:wi(h.gaitPhase,l.gaitPhase,i),stride:Pe(h.stride,l.stride,i),attackProgress:Pe(h.attackProgress,l.attackProgress,i),velocity:{x:Pe(h.vx,l.vx,i),y:Pe(h.vy,l.vy,i),z:Pe(h.vz,l.vz,i)}}:null});return{time:Pe(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Pe(n.dash.timer,t.dash.timer,i)},turn:{progress:Pe(n.turn.progress,t.turn.progress,i)},link:{progress:Pe(n.link.progress,t.link.progress,i)},dummies:r}}function pg(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Lf={slopPx:12,longPressMs:450,doubleTapMs:280};function mg(n,t,e=Lf.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function sa(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function gg(n=Lf){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),sa(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY;return!l.dragging&&Math.hypot(c,h)>=n.slopPx?(l.dragging=!0,sa(l.button,"drag",c,h,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,h=o-l.startY,u=r-l.startedAt,d=Math.hypot(c,h);if(l.dragging||l.longFired||d>=n.slopPx)return sa(l.button,"release",c,h,u,1);const f=e.get(l.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(l.button),sa(l.button,"doubleTap",c,h,u,2)):(e.set(l.button,{at:r,x:s,y:o}),sa(l.button,"tap",c,h,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),sa(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,sa(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const oc=.001,xg=18;function sl(n,t,e){return n<t?t:n>e?e:n}function ol(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function vg(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function yg(n,t,e,i,a=xg){const s=vg(t);if(!s)return{state:ol(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,h=l;if(!Number.isFinite(o)||o<oc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<oc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<oc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,d=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,d):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:sl(Number.isFinite(f)?f:1,c,h),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Sd(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?sl(r,a,s):sl(n,a,s)}function _g(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Mg(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const rc=["jump","sprint","reset","attack","skill2"],bg=8,Sg=16,cc=10,wd=14,Ed=140,wg=18,Eg=16,Tg=400,Ag=1.0001;function cr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Rg(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&cr(e)}function Pg(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,h=0,u=0,d=0,f=-1,m=0,_=null,g=-1,p=0,y=0,x=0,v=0,w=!1,S=0,E=1,T=0,b=null,M=0,R=0,F=!1,z=null,H=null,L=0,I=0,Y=0,G=0,q=!1,st=!0,gt=-1;const dt=gg({slopPx:wd,longPressMs:450,doubleTapMs:350});let ft=[],it=null;const j=new Set;function pt(X){X&&ft.push(X)}const J=new Map;let et=ol(),K=!1,St=1;function kt(){const X=Array.from(J.values()),ct=a(),xt=yg(et,X,ct.pinchGain,ct.maxStepRatio,wg);if(et=xt.state,K=xt.pinching,xt.scale!==1&&(St*=xt.scale),xt.started||xt.armedNow)b=null,F=!0,z=null;else if(xt.ended&&o===null&&X.length===1){const Vt=X[0];o=Vt.id,r=Vt.x,l=Vt.y,c=0,h=0,u=Vt.x,d=Vt.y,w=!1,S=0,E=1,T=0,performance.now(),b=null,F=!0,z=null}}const Lt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},bt={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let V=0,ne=0;const Mt={},Nt=new Set,Dt=[];function It(){for(const X of rc)Mt[X]!==void 0&&(Mt[X]=void 0),$(X);dt.reset(),j.clear(),J.clear(),et=ol(),K=!1,o=null,c=0,h=0,u=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0,_=null,g=-1,b=null,F=!1,z=null,H=null,gt=-1,Y=0,G=0,q=!1,st=!0}const Rt=()=>{document.hidden&&It()},k=X=>{if(X.clientX===0&&X.clientY===0){m++;return}if(cr(X.target)||Rg(X.clientX,X.clientY)){j.add(X.pointerId);return}if(j.delete(X.pointerId),J.set(X.pointerId,{id:X.pointerId,x:X.clientX,y:X.clientY}),o===null&&!K){_=null,g=-1,o=X.pointerId,r=X.clientX,l=X.clientY,c=0,h=0,u=X.clientX,d=X.clientY,performance.now();const ct=Number.isFinite(X.screenX)&&Number.isFinite(X.screenY)&&(X.screenX!==0||X.screenY!==0);w=ct,S=0,E=1,T=0,p=ct?X.screenX:0,y=ct?X.screenY:0,x=p,v=y,b=X.pointerId,M=X.clientX,R=X.clientY,F=!1}kt()},A=X=>{if(X.pointerId===H&&(X.pointerType==="mouse"&&X.buttons===0||X.clientX===0&&X.clientY===0&&(L!==0||I!==0)||(st?(Y=X.clientX-L,G=X.clientY-I):(L=X.clientX,I=X.clientY,st=!0,Y=0,G=0))),pt(dt.move(X.pointerId,X.clientX,X.clientY,performance.now())),!j.has(X.pointerId)&&J.has(X.pointerId)&&(J.set(X.pointerId,{id:X.pointerId,x:X.clientX,y:X.clientY}),kt()),j.has(X.pointerId)||X.pointerId!==o)return;const ct=performance.now();if(_===X.pointerId&&ct-g<150){m++;return}const xt=X.clientX,Vt=X.clientY;if(xt===0&&Vt===0&&(r!==0||l!==0)){m++;return}const Yt=xt-u,B=Vt-d,Et=Number.isFinite(X.screenX)&&Number.isFinite(X.screenY),nt=Et?X.screenX:0,lt=Et?X.screenY:0,Pt=Et&&(nt!==0||lt!==0),Tt=nt-x,Kt=lt-v;if(w&&Pt){const De=Math.hypot(Tt,Kt),Me=Math.hypot(Yt,B);if(De>3){if(S=0,T<30&&Me>6&&Tt*Yt+Kt*B>.7*De*Me){const qe=De/Me;qe>.2&&qe<5&&(E+=(qe-E)*.3,T++)}}else Me>12&&(S++,S>=2&&(w=!1))}const ee=Math.hypot(Yt,B);if(!w){const De=f<0?Number.POSITIVE_INFINITY:ct-f,Me=Pt?Math.hypot(Tt,Kt):1/0;ee>28&&(De<200||Me<ee*.4)&&(r+=Yt,l+=B,m++)}u=xt,d=Vt,x=nt,v=lt,X.pointerId===b&&Math.hypot(X.clientX-M,X.clientY-R)>bg&&(F=!0);let ce,te;w&&Pt?(ce=(nt-p)/E,te=(lt-y)/E):(ce=xt-r,te=Vt-l);const we=Math.hypot(ce,te),be=s();we>be&&(ce*=be/we,te*=be/we);const _n=Math.hypot(c,h),an=Math.hypot(ce,te);if(_n>10&&an>10){const De=Math.abs(Math.atan2(c*te-h*ce,c*ce+h*te)),Me=Math.max(_n,an)*De,qe=Math.max(Math.hypot(Yt,B),Math.hypot(Tt,Kt)/Math.max(.2,E));if(De>.6&&qe<Math.max(6,Me*.5)){m++;return}}c=ce,h=te};function $(X){if(!Lt[X])return;Lt[X]=!1,X==="attack"&&(bt.attackReleased=!0);const ct=document.getElementById(`btn-${X}`);ct==null||ct.classList.remove("is-down")}function ot(){o!==null&&(_=o,g=performance.now(),o=null,c=0,h=0,u=0,d=0,w=!1,S=0,E=1,T=0,p=0,y=0,x=0,v=0)}const tt=X=>{const ct=J.delete(X.pointerId),xt=j.delete(X.pointerId);ct&&kt(),X.pointerId===H&&(H=null,q?gt=performance.now():(Y=0,G=0,gt=-1)),pt(dt.end(X.pointerId,X.clientX,X.clientY,performance.now()));for(const Bt of rc)Mt[Bt]===X.pointerId&&(Mt[Bt]=void 0,$(Bt));const Vt=!ct&&!xt&&J.size<=1&&o!==null;(X.pointerId===o||J.size===0||Vt)&&ot(),!xt&&X.pointerId===b&&(!F&&!cr(X.target)&&(z={x:X.clientX,y:X.clientY}),b=null)};for(const X of rc){const ct=document.getElementById(`btn-${X}`);if(!ct)continue;const xt=X==="attack"||X==="skill2",Vt=B=>{if(B.preventDefault(),Mt[X]===void 0){Mt[X]=B.pointerId,Lt[X]=!0,X==="jump"&&(bt.jump=!0),X==="reset"&&(bt.reset=!0),X==="sprint"&&(bt.sprintPressed=!0),X==="attack"&&(bt.attackPressed=!0),X==="skill2"&&(bt.skill2=!0),ct.classList.add("is-down"),pt(dt.begin(X,B.pointerId,B.clientX,B.clientY,performance.now()));try{ct.setPointerCapture(B.pointerId)}catch{}xt&&(H=B.pointerId,L=B.clientX,I=B.clientY,st=!(B.clientX===0&&B.clientY===0),Y=0,G=0,q=!1,gt=-1)}},Bt=B=>{Mt[X]===B.pointerId&&(Mt[X]=void 0,$(X),pt(dt.end(B.pointerId,B.clientX,B.clientY,performance.now())))},Yt=B=>{Mt[X]===B.pointerId&&(Mt[X]=void 0,$(X),pt(dt.cancel(B.pointerId,performance.now())))};ct.addEventListener("pointerdown",Vt),ct.addEventListener("pointerup",Bt),ct.addEventListener("pointercancel",Yt),Dt.push(()=>{ct.removeEventListener("pointerdown",Vt),ct.removeEventListener("pointerup",Bt),ct.removeEventListener("pointercancel",Yt)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const X of rt){const ct=xt=>{xt.preventDefault(),V=Number(X.dataset.weapon)||0};X.addEventListener("pointerdown",ct),Dt.push(()=>X.removeEventListener("pointerdown",ct))}const zt=X=>{const ct=X.key.toLowerCase();if((ct===" "||ct.startsWith("arrow"))&&X.preventDefault(),Nt.has(ct))return;Nt.add(ct),ct===" "&&(bt.jump=!0),ct==="r"&&(bt.reset=!0),ct==="shift"&&(bt.sprintPressed=!0),ct==="j"&&(bt.attackPressed=!0),ct==="k"&&(bt.skill2=!0),ct>="1"&&ct<="5"&&(V=Number(ct)),ct>="6"&&ct<="9"&&(ne=Number(ct)-5);const xt=Math.max(Ag,a().keyStep||1.12);(ct==="="||ct==="+")&&(St*=xt),(ct==="-"||ct==="_")&&(St/=xt)},Q=X=>{const ct=X.key.toLowerCase();Nt.has(ct)&&(Nt.delete(ct),ct==="j"&&(bt.attackReleased=!0))},_t=X=>{if(cr(X.target))return;X.preventDefault();const ct=X.deltaMode===1?X.deltaY*Eg:X.deltaMode===2?X.deltaY*Tg:X.deltaY;St*=_g(ct,a().wheelStep)},Ft=X=>{X.preventDefault()},at=()=>{f=performance.now()};window.addEventListener("resize",at),window.addEventListener("orientationchange",at);const vt=typeof window<"u"?window.visualViewport:null;return vt&&(vt.addEventListener("resize",at),vt.addEventListener("scroll",at)),window.addEventListener("pointerdown",k),window.addEventListener("pointermove",A),window.addEventListener("pointerup",tt),window.addEventListener("pointercancel",tt),window.addEventListener("blur",It),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",zt),window.addEventListener("keyup",Q),window.addEventListener("wheel",_t,{passive:!1}),window.addEventListener("gesturestart",Ft),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:u,y:d,dx:u-r,dy:d-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:y,screenX:x,screenY:v,scale:E}},peekAim(){const X=performance.now(),ct=Math.hypot(Y,G),xt=H!==null||gt>=0&&X-gt<Ed;if(!(xt&&q&&ct>=cc))return{active:!1,holding:xt,x:0,z:0,dx:Y,dy:G};const Bt=i(),Yt=Y/ct,B=G/ct,Et=Bt.rightX*Yt+Bt.forwardX*-B,nt=Bt.rightZ*Yt+Bt.forwardZ*-B,lt=Math.hypot(Et,nt)||1;return{active:!0,holding:xt,x:Et/lt,z:nt/lt,dx:Y,dy:G}},sample(){var Dn;const X=s();let ct=o!==null?Math.max(-1,Math.min(1,c/X)):0,xt=o!==null?Math.max(-1,Math.min(1,h/X)):0,Vt=0,Bt=0;(Nt.has("a")||Nt.has("arrowleft"))&&(Vt-=1),(Nt.has("d")||Nt.has("arrowright"))&&(Vt+=1),(Nt.has("w")||Nt.has("arrowup"))&&(Bt-=1),(Nt.has("s")||Nt.has("arrowdown"))&&(Bt+=1),ct+=Vt,xt+=Bt;let Yt=Math.hypot(ct,xt);Yt>1&&(ct/=Yt,xt/=Yt,Yt=1);const B=ct,Et=xt;Yt<e&&(ct=0,xt=0);const nt=i();let lt=nt.rightX*ct+nt.forwardX*-xt,Pt=nt.rightZ*ct+nt.forwardZ*-xt;const Tt=Math.hypot(lt,Pt);Tt>1&&(lt/=Tt,Pt/=Tt);const Kt=performance.now();pt(dt.poll(Kt));const ee=Math.hypot(Y,G);H!==null&&(ee>=Sg?q=!0:ee<cc&&(q=!1));const ce=H!==null||gt>=0&&Kt-gt<Ed,te=ce&&q&&ee>=cc;let we=0,be=0;if(te){const We=Y/ee,Mn=G/ee,mn=nt.rightX*We+nt.forwardX*-Mn,ve=nt.rightZ*We+nt.forwardZ*-Mn,bn=Math.hypot(mn,ve)||1;we=mn/bn,be=ve/bn}!ce&&H===null&&(Y=0,G=0,gt=-1,q=!1);const _n=z;z=null;const an=St;St=1;const De={moveX:lt,moveZ:Pt,jumpPressed:bt.jump,sprintHeld:Lt.sprint||Nt.has("shift"),sprintPressed:bt.sprintPressed,resetPressed:bt.reset,attackPressed:bt.attackPressed,attackHeld:Lt.attack||Nt.has("j"),attackReleased:bt.attackReleased,skill2Pressed:bt.skill2,weaponSlot:V,dummyClickId:ne,aimX:we,aimZ:be,aimActive:te};bt.jump=!1,bt.reset=!1,bt.sprintPressed=!1,bt.attackPressed=!1,bt.attackReleased=!1,bt.skill2=!1,V=0,ne=0;const Me=ft.map(We=>mg(We,nt,wd));ft=[],Me.length>0&&(it=Me[Me.length-1]);const qe=o!==null?"pointer":Nt.size>0?"keyboard":"idle";return{intents:De,stickX:ct,stickY:xt,stickRawX:B,stickRawY:Et,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:u,stickPxY:d,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:y,stickScreenX:x,stickScreenY:v,stickScale:E,stickVpTop:((Dn=Mg())==null?void 0:Dn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:Y,aimDY:G,source:qe,tap:_n,zoomScale:an,gestures:Me,lastGesture:it}},dispose(){window.removeEventListener("pointerdown",k),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",tt),window.removeEventListener("pointercancel",tt),window.removeEventListener("blur",It),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",zt),window.removeEventListener("keyup",Q),window.removeEventListener("wheel",_t),window.removeEventListener("resize",at),window.removeEventListener("orientationchange",at),vt&&(vt.removeEventListener("resize",at),vt.removeEventListener("scroll",at)),window.removeEventListener("gesturestart",Ft),dt.reset();for(const X of Dt)X()}}}const Mr=1,br=2,Sr=4,Df=8,wr=16,Zs=32,kf=64,If=128,Cg=[[Mr,"atk"],[br,"dash"],[Sr,"link"],[Df,"air"],[wr,"hurt"],[Zs,"aim"],[kf,"spr"],[If,"chan"]];function Ba(n){if(n===0)return"-";const t=Cg.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Lg=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Dg=0,kg=15,lc=19,Ig=21,zg=22,Fg=23,Ug=24,pi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},zn=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ni=n=>Math.round(n*180/Math.PI*10)/10,hc=Math.PI*2;function ks(n){let t=n%hc;return t>Math.PI&&(t-=hc),t<-Math.PI&&(t+=hc),t}function Ng(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Mr),n.dash.phase!=="idle"&&(e|=br),n.playerLink.phase!=="idle"&&(e|=Sr),n.character.grounded||(e|=Df),n.playerHurt.type!=="none"&&(e|=wr),t.intents.aimActive&&(e|=Zs),n.character.sprinting&&(e|=kf),n.abilities.channeling&&(e|=If),e}function Og(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Bg(n){const t={sampleHz:n.sampleHz??pi.sampleHz,sampleCapacity:n.sampleCapacity??pi.sampleCapacity,eventCapacity:n.eventCapacity??pi.eventCapacity,anomalyCapacity:n.anomalyCapacity??pi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??pi.dirJumpDeg,aimDropDeg:n.aimDropDeg??pi.aimDropDeg,freezeMs:n.freezeMs??pi.freezeMs,freezeSpeed:n.freezeSpeed??pi.freezeSpeed,stickLostMs:n.stickLostMs??pi.stickLostMs,spikeMs:n.spikeMs??pi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,h=null,u=0,d=0,f="",m=-1,_=-1,g=-1,p=0,y=-1e9,x=-1,v={},w=null,S=0,E=0,T=0,b=0;function M(L,I){const Y=1/t.sampleHz,G=L[Dg];G-c<Y-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=G)}function R(L,I,Y,G,q,st){const gt=v[L]??-1e9;if(I-gt<1.2)return;if(v[L]=I,L==="frameSpike"){let ft=0;for(const it of s)it.kind==="frameSpike"&&ft++;if(ft>=6)return}s.length>=t.anomalyCapacity&&s.shift();let dt=i.slice(-7);st&&(dt.length===0||dt[dt.length-1]!==st)&&(dt=[...dt.slice(-6),st]),s.push({kind:L,t:zn(I),tick:Y,ms:Math.round(G),detail:q,ctx:dt}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function F(L,I,Y,G){a.length>=t.eventCapacity&&a.shift(),a.push({t:zn(Y),tick:G,k:L,d:I})}function z(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":y=L.tick;break}}function H(){const L=o,I=L.wallMs/1e3,Y=L.gestures,G=dt=>Object.entries(Y).filter(([ft])=>ft.endsWith(`.${dt}`)).reduce((ft,[,it])=>ft+it,0),q=[];if(q.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),q.push(`运行 ${I.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),q.push(`摇杆活跃 ${I>0?Math.round(L.stickActiveMs/1e3/I*100):0}% · 手势 按下 ${G("press")}（单击 ${G("tap")} / 双击 ${G("doubleTap")} / 拖拽 ${G("drag")} / 长按 ${G("longPress")} / 打断 ${G("cancel")} / 拖放 ${G("release")}）`),q.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),q.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${f||"-"}`),q.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const dt of s.slice(-6)){q.push(`· ${dt.kind} @t${dt.t.toFixed(2)} tick${dt.tick} ${dt.ms>0?`${dt.ms}ms `:""}${dt.detail}`);const ft=dt.ctx.map(j=>String(j[kg])).join(" "),it=dt.ctx.map(j=>j[lc]===""||j[lc]==null?".":String(j[lc])).join(" ");if(q.push(`  yaw ${ft}`),q.push(`  in  ${it}`),dt.kind==="stickJump"||dt.kind==="stickBad"||dt.kind==="stickLost"){const j=dt.ctx.map(J=>`${J[Ig]},${J[zg]}`).join(" "),pt=dt.ctx.map(J=>`${J[Fg]},${J[Ug]}`).join(" ");q.push(`  o   ${j}`),q.push(`  p   ${pt}`)}}if(a.length>0){q.push("最近事件：");for(const dt of a.slice(-12))q.push(`  ${dt.t.toFixed(2)} ${dt.k} ${dt.d}`.trimEnd())}const st=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",gt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return q.push(`摇杆坐标源 ${st}${gt}`),q.push(`UA ${e.ua}`),q.join(`
`)}return{sample(L,I,Y,G=0){o.frames++,I.stickHeld&&(I.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=G,o.wallMs+=Y,Y>o.dtMax&&(o.dtMax=Y),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const q=L.time;if(l<0&&(l=q),T=q,b=L.tick,!r)return;const st=L.character,gt=Math.hypot(I.stickX,I.stickY),dt=Math.hypot(st.velocity.x,st.velocity.z);f=L.combat.weapon;const ft=Ng(L,I),it=st.facing,pt=Math.hypot(I.intents.moveX,I.intents.moveZ)>.05?Math.atan2(I.intents.moveX,I.intents.moveZ):null;gt>.2&&(o.stickActiveMs+=Y);const J=[zn(q),L.tick,Math.round(Y*10)/10,zn(I.stickX),zn(I.stickY),zn(I.stickRawX),zn(I.stickRawY),I.stickHeld?1:0,I.source.slice(0,8),zn(I.intents.moveX),zn(I.intents.moveZ),zn(st.position.x),zn(st.position.z),zn(st.velocity.x),zn(st.velocity.z),ni(it),ni(st.bodyYaw),ft,zn(st.stride),pt===null?"":ni(pt),I.stickId===null?"":I.stickId,Math.round(I.stickOriginX),Math.round(I.stickOriginY),Math.round(I.stickPxX),Math.round(I.stickPxY),I.stickBad,Math.round(I.stickVpTop),Math.round(I.stickOriginSX),Math.round(I.stickOriginSY),Math.round(I.stickScreenX),Math.round(I.stickScreenY),I.stickScreenOk?1:0,Math.round(I.stickScale*100)/100];M(J);const et=q*1e3<x;if(Y>t.spikeMs&&!et&&q-l>.6&&(o.spikes++,R("frameSpike",q,L.tick,Y,`dt ${Y.toFixed(0)}ms fl=${Ba(ft)}`,J)),h!==null&&!et){const It=Math.abs(ni(ks(it-h))),Rt=Math.abs(ni(ks(st.moveYaw-u))),k=(d|ft)&(Mr|br|Sr|wr)|ft&Zs,A=pt===null?null:Math.abs(ni(ks(it-pt))),$=pt===null||h===null?null:Math.abs(ni(ks(h-pt))),ot=A!==null&&$!==null&&A<$-.5,tt=(d&Zs)!==0&&(ft&Zs)===0&&pt===null,rt=A!==null&&(A<=12||ot);It>t.aimDropDeg&&tt?R("aimDrop",q,L.tick,0,`${It.toFixed(0)}° @aim→none stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Ba(ft)}`,J):It>t.dirJumpDeg&&k===0&&!tt&&(rt?(o.inTurns++,It>o.inTurnMax&&(o.inTurnMax=It)):R("dirJump",q,L.tick,0,`${It.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${ni(h)}→${ni(it)} in ${pt===null?".":ni(pt)}° mvΔ${Rt.toFixed(0)}° aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Ba(d)}→${Ba(ft)}`,J))}const K=(ft&(Mr|br|Sr|wr))!==0,St=L.tick-y<30;gt>.35&&dt<t.freezeSpeed&&!K&&!St?(m<0&&(m=q),q-m>=t.freezeMs/1e3&&q>=_&&(R("moveFreeze",q,L.tick,(q-m)*1e3,`stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) v${dt.toFixed(2)} ${I.source} fl=${Ba(ft)}`,J),_=q+1.5,m=-1)):m=-1,I.stickHeld?(gt>p&&(p=gt),p>.35&&gt<.06?(g<0&&(g=q),q-g>=t.stickLostMs/1e3&&(R("stickLost",q,L.tick,(q-g)*1e3,`raw(${I.stickRawX.toFixed(2)},${I.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ba(ft)}`,J),g=-1,p=0)):g=-1):(p=0,g=-1);const kt=I.stickScale>.2&&I.stickScale<5?I.stickScale:1,Lt=I.stickScreenOk,bt=Lt?I.stickScreenX/kt:I.stickPxX,V=Lt?I.stickScreenY/kt:I.stickPxY,ne=Lt?I.stickOriginSX/kt:I.stickOriginX,Mt=Lt?I.stickOriginSY/kt:I.stickOriginY,Nt=bt-ne,Dt=V-Mt;if(I.stickHeld&&I.stickId!==null){const It=w;if(It&&It.held&&It.id===I.stickId){const Rt=Math.hypot(It.dx,It.dy),k=Math.hypot(Nt,Dt),A=Math.max(Rt,k),$=Math.hypot(bt-It.cx,V-It.cy),ot=Math.abs(ni(ks(Math.atan2(Dt,Nt)-Math.atan2(It.dy,It.dx)))),tt=A*ot*Math.PI/180,rt=Math.hypot(ne-It.ox,Mt-It.oy);if(A>18&&ot>35&&$<Math.max(5,tt*.35)&&R("stickJump",q,L.tick,0,`Δ${ot.toFixed(0)}° 手指只动${$.toFixed(0)}px(弧长应${tt.toFixed(0)}px) o(${Math.round(It.ox)},${Math.round(It.oy)})→(${Math.round(ne)},${Math.round(Mt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(bt)},${Math.round(V)}) raw(${Math.round(Nt)},${Math.round(Dt)}) id${I.stickId} ${Lt?"src=屏幕":"src=client"}`,J),Lt&&It.screenOk){const zt=Math.hypot(I.stickPxX-It.x,I.stickPxY-It.y),Q=Math.hypot((I.stickScreenX-It.sx)/kt,(I.stickScreenY-It.sy)/kt);S+=zt-Q,Math.abs(S)>20&&(R("stickDrift",q,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) screen(${Math.round(I.stickScreenX)},${Math.round(I.stickScreenY)})`,J),S=0)}}w={id:I.stickId,ox:ne,oy:Mt,cx:bt,cy:V,x:I.stickPxX,y:I.stickPxY,sx:I.stickScreenX,sy:I.stickScreenY,dx:Nt,dy:Dt,held:!0,screenOk:Lt}}else w=null,S=0;if(I.stickBad>E){const It=I.stickBad-E;R("stickBad",q,L.tick,0,`拦截 ${It} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${I.stickBad}）o(${Math.round(I.stickOriginX)},${Math.round(I.stickOriginY)}) p(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) id${I.stickId??"-"}`,J)}E=I.stickBad,h=it,u=st.moveYaw,d=ft},event(L,I){const Y=Og(L);z(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||F(L.type,Y,I,L.tick))},gesture(L){const I=`${L.button}.${L.kind}`;o.gestures[I]=(o.gestures[I]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&F(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,T,b)},suspend(L){x=T*1e3+L,m=-1,g=-1},setEnabled(L){r=L,L||(h=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,v={},c=-1e9,h=null,d=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,I=s.some(Y=>L-Y.t<8&&(Y.kind==="dirJump"||Y.kind==="aimDrop"||Y.kind==="moveFreeze"||Y.kind==="stickLost"||Y.kind==="stickJump"||Y.kind==="stickBad"||Y.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:I,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Lg,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:H}}const Hg={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!0,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4}},Gg={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},stations:[{id:"hub",index:1,name:"中央 8 向",hint:"推杆走 8 个方向 · 松手看停步收相 / 转身踏步",shape:"circle",x:0,z:0,radius:3.6,spawnX:0,spawnZ:0,labelX:0,labelZ:-3.1,color:"#8fe7ff"},{id:"rings",index:2,name:"环状态色阶",hint:"同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",shape:"circle",x:-9.5,z:-8.2,radius:3.4,spawnX:-9.5,spawnZ:-5.2,labelX:-9.5,labelZ:-10.9,color:"#ffc85a"},{id:"windup",index:3,name:"起手预警",hint:"走进 1.6m：脚下红弧填满 = 命中帧",shape:"circle",x:0,z:-10,radius:3.2,spawnX:0,spawnZ:-7,labelX:0,labelZ:-12.6,color:"#ff5a4a"},{id:"terrain",index:4,name:"地形 / 门洞",hint:"宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",shape:"square",x:8.9,z:-7.4,radius:5.2,spawnX:8.9,spawnZ:-2.8,labelX:8.9,labelZ:-11.9,color:"#7fb8d8"},{id:"meter",index:5,name:"进度弧",hint:"弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",shape:"circle",x:-9.5,z:8.6,radius:3.2,spawnX:-9.5,spawnZ:11.4,labelX:-9.5,labelZ:9.9,color:"#b48cff"},{id:"dash",index:6,name:"冲刺标尺",hint:"沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",shape:"square",x:9.8,z:8.2,radius:5.2,spawnX:9.8,spawnZ:12.8,labelX:7,labelZ:4.2,color:"#bfe8ff"},{id:"gait",index:7,name:"侧后方步态",hint:"面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",shape:"circle",x:-9.5,z:0,radius:3.2,spawnX:-9.5,spawnZ:2.6,labelX:-9.5,labelZ:-2.5,color:"#6fc9a0"}]},Vg={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e"},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95}},Xg={core:Hg,scene:Gg,view:Vg};function lh(n){return JSON.parse(JSON.stringify(n))}const hh=Xg,Wg=lh(hh.core),To=lh(hh.scene),hn=lh(hh.view);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class yi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),yi.nextNameID=yi.nextNameID||0,this.$name.id=`lil-gui-name-${++yi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Yg extends yi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function rl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const $g={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:rl,toHexString:rl},io={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Zg={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=io.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return io.toHexString(a)}},qg={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=io.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return io.toHexString(a)}},jg=[$g,io,Zg,qg];function Kg(n){return jg.find(t=>t.match(n))}class Jg extends yi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Kg(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=rl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class dc extends yi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Qg extends yi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let y=parseFloat(this.$input.value);isNaN(y)||(this._stepExplicit&&(y=this._snap(y)),this.setValue(this._clamp(y)))},i=y=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+y),this.$input.value=this.getValue())},a=y=>{y.key==="Enter"&&this.$input.blur(),y.code==="ArrowUp"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y))),y.code==="ArrowDown"&&(y.preventDefault(),i(this._step*this._arrowKeyMultiplier(y)*-1))},s=y=>{this._inputFocused&&(y.preventDefault(),i(this._step*this._normalizeMouseWheel(y)))};let o=!1,r,l,c,h,u;const d=5,f=y=>{r=y.clientX,l=c=y.clientY,o=!0,h=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=y=>{if(o){const x=y.clientX-r,v=y.clientY-l;Math.abs(v)>d?(y.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>d&&_()}if(!o){const x=y.clientY-c;u-=x*this._step*this._arrowKeyMultiplier(y),h+u>this._max?u=this._max-h:h+u<this._min&&(u=this._min-h),this._snapClampSetValue(h+u)}c=y.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,y,x,v,w)=>(p-y)/(x-y)*(w-v)+v,e=p=>{const y=this.$slider.getBoundingClientRect();let x=t(p,y.left,y.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},h=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",d))},u=p=>{if(o){const y=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(y)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d))}else p.preventDefault(),e(p.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",d)},f=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class tx extends yi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class ex extends yi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const nx=`.lil-gui {
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
}`;function ix(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let Td=!1;class Er{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Td&&r&&(ix(nx),Td=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new tx(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Qg(this,t,e,i,a,s);case"boolean":return new Yg(this,t,e);case"string":return new ex(this,t,e);case"function":return new dc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new Jg(this,t,e,i)}addFolder(t){const e=new Er({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof dc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof dc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function ax(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Er({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Er({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=Ft=>{const at=s.addFolder(Ft);return l.push(at),at},h=(Ft,at)=>{const vt=Ft.addFolder(at);return r.push(vt),vt},u=c("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const d=h(u,"模块开关");d.add(n.modules,"movement").name("movement"),d.add(n.modules,"combat").name("combat"),d.add(n.modules,"links").name("links"),d.add(n.modules,"orientation").name("orientation"),d.add(n.modules,"turnInPlace").name("turnInPlace"),d.add(n.modules,"targeting").name("targeting"),d.add(n.modules,"hits").name("hits"),d.add(n.modules,"separation").name("separation"),d.add(n.modules,"dash").name("dash"),d.add(n.modules,"camera").name("camera"),d.add(n.modules,"dummies").name("dummies"),d.add(n.modules,"abilities").name("abilities");const f=c("移动 / 输入"),m=h(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=h(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=h(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const y=o.separation,x=h(f,"角色间分离 / 挤压阻力");x.add(y,"iterations",1,8,1).name("迭代次数"),x.add(y,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(y.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(y.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(y.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const v=o.dummies,w=h(f,"假人 AI");w.add(v,"moveSpeed",.5,8,.1).name("移动速度"),w.add(v,"wanderRadius",.5,8,.1).name("游走半径"),w.add(v,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),w.add(v,"followStopDistance",.3,5,.1).name("跟随停距"),w.add(v,"keepDistance",1,10,.1).name("保持距离"),w.add(v,"keepDeadZone",.1,2,.05).name("保持死区"),w.add(v,"attackRange",.5,5,.1).name("攻击距离"),w.add(v,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),w.add(v,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const S=c("步态 / 停步"),E=h(S,"程序化步态");E.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),E.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),E.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),E.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),E.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),E.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),E.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),E.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),E.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),E.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),E.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),E.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),E.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),E.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),E.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),E.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)");const T=h(S,"停步收相 / 胸朝向");T.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),T.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),T.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),T.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),T.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const b=h(S,"停步惯性");b.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),b.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),b.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),b.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),b.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),b.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),b.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),h(S,"击退步态").add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const R=h(S,"足部 IK"),F=t.ik;R.add(F,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),R.add(F,"weight",0,1,.01).name("钉地权重"),R.add(F,"attackScale",0,1,.01).name("攻击时权重倍率"),R.add(F,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const z=h(S,"惯性倾斜 / 盆骨"),H=t.lean;z.add(H,"accelGain",0,.1,.002).name("前后加速度增益"),z.add(H,"turnGain",0,.2,.005).name("绕圈侧倾增益"),z.add(H,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),z.add(H,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),z.add(H,"smoothing",1,30,1).name("倾斜平滑速率"),z.add(H,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),z.add(H,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),z.add(H,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),z.add(H,"crouchSmoothing",1,30,1).name("下沉平滑速率");const L=o.orientation,I=h(S,"朝向 / 下盘带转");I.add(L,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),I.add(L,"headTurnRate",.5,40,.5).name("头部转向速率"),I.add(L,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),I.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),I.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),I.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const Y=o.gaze,G=h(S,"接敌注视 / 俯仰 (v9s.18)");G.add(Y,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),G.add(Y,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),G.add(Y,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),G.add(Y,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),G.add(Y,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),G.add(Y,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),G.add(Y,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),G.add(Y,"headPitchRate",.5,20,.5).name("头部俯仰速率"),G.add(Y,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),G.add(Y,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),G.add(Y,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const q=h(S,"原地转身 / 停步偏差 (v9s)"),st=o.turnInPlace;q.add(st,"enabled").name("启用原地转身 (关=纯插值)"),q.add(st,"triggerDeg",20,180,5).name("触发夹角 (°)"),q.add(st,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),q.add(st,"settleDeg",0,60,1).name("转身保留余角 (°)"),q.add(st,"durationSec",.1,1.5,.02).name("转身时长 (s)"),q.add(st,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),q.add(st,"inputDeadZone",0,.5,.01).name("起步输入死区"),q.add(st,"armSec",0,.5,.01).name("触发防抖 (s)"),q.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("偏差消化窗口"),q.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),q.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),q.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),q.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),q.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const gt=c("战斗 / 受击"),dt=o.combat,ft=h(gt,"连击 / 武器"),it=ft.add(n.combat,"weapon",Sa).name("当前武器");ft.add(dt,"comboWindow",.1,2,.05).name("连击窗口 (s)"),ft.add(dt,"settle",0,.8,.01).name("段间停顿 (s)"),ft.add(dt,"attackMoveScale",0,1,.01).name("攻击时移动比例"),ft.add(dt,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),ft.add(dt,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),ft.add(dt,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),ft.add(dt,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),ft.add(dt,"cancelWindow",0,1,.01).name("取消窗口 (s)"),ft.add(dt,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),ft.add(dt,"autoCombo").name("按住自动连击"),ft.add(dt.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),ft.add(dt.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),ft.add(dt.bow,"autoFire").name("蓄满自动放箭 (按住连射)");const j=h(gt,"夸张化 (v9s.22)"),pt=t.animation.stretch;j.add(pt,"enabled").name("四肢伸缩 开"),j.add(pt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),j.add(pt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),j.add(pt,"impactSquash",0,.5,.01).name("命中挤压量"),j.add(pt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),j.add(pt,"torsoGain",0,1,.05).name("躯干跟随比例"),j.add(pt,"volumeExp",0,1.5,.05).name("体积补偿指数");const J=t.animation.swing;j.add(J,"enabled").name("挥击身体幅度 开"),j.add(J,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),j.add(J,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),j.add(J,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),j.add(J,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),j.add(J,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),j.add(J,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),j.add(J,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),j.add(J.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const et=t.weaponTrail;j.add(et,"enabled").name("挥击刀光 开"),j.add(et,"life",.04,.4,.01).name("刀光残留 (s)"),j.add(et,"intensity",0,1.5,.05).name("刀光亮度"),j.add(et,"minStep",.005,.1,.005).name("采样最小位移 (m)"),j.add(t.projectiles,"slashEnabled").name("旧斩击弧 开（已被刀光替代）"),j.add(t.hitstop,"enabled").name("命中闪光 / 震动 开");const K=o.hits.hitstopWarp;if(K){const Ft=j.addFolder("卡肉节奏（接触瓦片）");Ft.add(K,"enabled").name("瓦片开（关=硬冻结）"),Ft.add(K,"holdRate",0,.4,.01).name("保持期速率"),Ft.add(K,"release",.005,.2,.005).name("释放时长 (s)"),Ft.add(K,"payback",1,2.5,.05).name("偿还倍率"),Ft.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),Ft.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),Ft.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const St=t.weaponWrist;j.add(St,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),j.add(St,"lag",0,.08,.002).name("臂速 → 腕滞后"),j.add(St,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),j.add(St,"rate",4,50,1).name("腕部跟随速率 (1/s)"),j.add(St,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),j.add(St,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const kt=t.weaponMount;j.add(kt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),j.add(kt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),j.add(kt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),j.add(kt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),j.add(kt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),j.add(kt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),ft.add(dt.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),ft.add(dt.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),ft.add(dt.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),ft.add(dt.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),ft.add(dt.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),ft.add(dt.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度"),ft.add(dt.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),ft.add(dt.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),ft.add(dt.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),ft.add(dt.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率");const Lt=o.abilities;ft.add(Lt.arcane,"perWave",1,8,1).name("每波飞弹数"),ft.add(Lt.arcane,"waves",1,12,1).name("每次引导波数"),ft.add(Lt.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),ft.add(Lt.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),ft.add(Lt.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),ft.add(Lt.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),ft.add(Lt.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),ft.add(Lt.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),ft.add(Lt.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),ft.add(Lt.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),ft.add(Lt.arcane,"speed",3,24,.5).name("飞弹速度"),ft.add(Lt.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),ft.add(Lt.ring,"radius",.5,5,.1).name("电环半径"),ft.add(Lt.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),ft.add(Lt.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const bt=h(gt,"攻击动作 / 跨步 / 落地");bt.add(t.animation.attack,"gaitWeight",0,1,.01).name("攻击时步态权重 gw"),bt.add(t.animation.attack,"lowerBodyWeight",0,1,.01).name("挥击跨步权重 lw"),bt.add(t.animation.attack,"blendRate",1,40,1).name("进出攻击平滑速率");const V=t.animation.stride;bt.add(V,"strideSpeed",0,8,.1).name("攻击等效步速 (m/s)"),bt.add(V,"strideScale",0,2.5,.05).name("攻击步幅系数 (0=旧)"),bt.add(V,"forwardBias",0,1,.01).name("前冲 / 侧跨占比"),bt.add(V,"cycles",1,3,1).name("每段跨步周期数"),bt.add(V,"stepPitch",0,1.5,.02).name("跨步腿前后摆 (rad)"),bt.add(V,"stepKnee",0,1.5,.02).name("跨步抬膝 (rad)"),bt.add(V,"stepSide",0,1,.02).name("跨步侧摆 (rad)"),bt.add(V,"stepDip",0,.3,.005).name("跨步重心下沉 (m)"),bt.add(V,"stepSway",0,.2,.005).name("跨步骨盆侧移 (m)"),bt.add(V,"stepReach",0,.3,.005).name("跨步骨盆前移 (m)"),bt.add(V,"stepSideReach",0,.25,.005).name("跨步骨盆侧移 (m)"),bt.add(V,"stepDipReach",0,.15,.005).name("跨步骨盆下沉 (m)"),bt.add(V,"heavyScale",0,1,.01).name("大剑重击收敛系数"),bt.add(t.animation.landing,"enabled").name("启用跳跃/落地缓冲"),bt.add(t.animation.landing,"duration",.05,1,.01).name("落地缓冲时长 (s)"),bt.add(t.animation.landing,"compressRatio",.05,.9,.01).name("下压段占比"),bt.add(t.animation.landing,"crouchDepth",0,.4,.005).name("重心下沉 (m)"),bt.add(t.animation.landing,"kneeBend",0,1.5,.02).name("屈膝 (rad)"),bt.add(t.animation.landing,"hipPitch",0,1,.02).name("髋前倾补偿 (rad)"),bt.add(t.animation.landing,"upperPitch",0,.6,.01).name("上半身前倾 (rad)"),bt.add(t.animation.landing,"armTuck",0,.8,.02).name("手臂收拢 (rad)"),bt.add(t.animation.landing,"impactSpeed",1,20,.5).name("冲击速度饱和 (m/s)"),bt.add(t.animation.landing,"minScale",0,1,.01).name("最小缓冲强度"),bt.add(t.animation.landing,"jumpAnticipation",0,1,.01).name("起跳预备下蹲"),bt.add(t.animation.landing,"anticipationDuration",.03,.5,.01).name("起跳预备时长 (s)");const ne=h(gt,"武器握持");ne.add(t.weaponMount,"swordPitchDeg",0,90,1).name("剑前倾角"),ne.add(t.weaponMount,"swordYawDeg",0,45,1).name("剑外张角"),ne.add(t.weaponMount,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),ne.add(t.weaponMount,"staffPitchDeg",0,60,1).name("法杖前倾角");const Mt=o.hits,Nt=h(gt,"命中 / 受击 / 击退");Nt.add(Mt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),Nt.add(Mt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),Nt.add(Mt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),Nt.add(Mt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),Nt.add(Mt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),Nt.add(Mt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),Nt.add(Mt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),Nt.add(Mt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const Dt=o.targeting,It=h(gt,"目标辅助");It.add(Dt,"targetAssist").name("启用目标辅助"),It.add(Dt,"range",1,14,.5).name("锁定范围 (m)"),It.add(Dt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),It.add(Dt,"frontBias",0,4,.1).name("朝向加权"),It.add(Dt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),It.add(Dt,"maxLungeScale",1,3,.1).name("前冲最大放大");const Rt=h(gt,"受击分层"),k=t.hurt;Rt.add(k,"enabled").name("启用分层受击 (关=旧版对照)"),Rt.add(k,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Rt.add(k,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Rt.add(k,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Rt.add(k,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Rt.add(k,"upperShiftScale",0,1,.01).name("上身位移缩放"),Rt.add(k,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Rt.add(k.hitHeight,"light",0,1,.01).name("轻击命中部位"),Rt.add(k.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Rt.add(k.hitHeight,"knock",0,1,.01).name("击退命中部位"),Rt.add(k,"leanLight",0,1.5,.01).name("轻击力度"),Rt.add(k,"leanHeavy",0,1.5,.01).name("重击力度"),Rt.add(k,"leanKnock",0,1.5,.01).name("击退力度"),Rt.add(k,"flashStrength",0,2,.05).name("受击闪光强度"),[{name:"打腹 (abdomen)",p:k.abdomen},{name:"打肩 (shoulder)",p:k.shoulder}].map(({name:Ft,p:at})=>{const vt=h(Rt,Ft);return vt.add(at,"upperPitch",0,2,.01).name("上身前后倾斜"),vt.add(at,"upperRoll",0,2,.01).name("上身侧倾"),vt.add(at,"upperYaw",0,1.5,.01).name("肩部扭转"),vt.add(at,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),vt.add(at,"shift",0,.8,.01).name("身体反应位移"),vt.add(at,"drop",0,.4,.01).name("整体下沉"),vt.add(at,"back",0,.4,.01).name("屁股向后"),vt.add(at,"knee",0,1.6,.01).name("屈膝"),vt.add(at,"hip",0,1,.01).name("髋前倾"),vt.add(at,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)"),vt});const A=h(gt,"派生招"),$=o.links;A.add($,"enabled").name("总开关 (false=旧连击)"),A.add($.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),A.add($.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),A.add($.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),A.add($,"sharedCooldown",0,3,.05).name("共享 CD (s)"),A.add($,"triggerWhileSprinting").name("长跑中可直接触发"),A.add($.search,"range",1,14,.1).name("索敌距离 (m)"),A.add($.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),A.add($.search,"stopDistance",0,3,.05).name("停住距离 (m)");const ot=$.moves["sword-shield"];ot&&(A.add(ot,"enabled").name("剑盾盾击"),A.add(ot,"distance",0,8,.1).name("冲锋极限 (m)"),A.add(ot,"windup",0,.5,.01).name("前摇 (s)"),A.add(ot,"active",0,.8,.01).name("冲锋 / 命中 (s)"),A.add(ot,"recovery",0,.8,.01).name("收势 (s)"),A.add(ot.hit,"radius",0,4,.05).name("命中半径 (m)"),A.add(ot.hit,"width",0,2,.05).name("扫掠半径 (m)"),A.add(ot.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),A.add(ot.hit,"duration",0,1.5,.01).name("僵直 (s)")),A.add(o.hits,"noDamageToPlayer").name("测试限制: 玩家不被击退");const tt=c("相机"),rt=h(tt,"基础");rt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),rt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),rt.add(t.camera,"distance",6,35,.5).name("距离"),rt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),rt.add(t.camera,"fov",25,90,1).name("FOV");const zt=o.camera,Q=h(tt,"智能构图");Q.add(zt,"radius",2,18,.5).name("威胁评估半径 (m)"),Q.add(zt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Q.add(zt,"saturation",.5,8,.1).name("威胁归一化饱和"),Q.add(zt,"pushIn",0,.5,.01).name("无威胁推进比例"),Q.add(zt,"maxPullback",0,1,.02).name("最大拉远比例"),Q.add(zt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Q.add(zt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Q.add(zt,"framingBias",0,1,.05).name("威胁质心平移系数"),Q.add(zt,"attackBoost",0,2,.05).name("挥砍中额外加权"),Q.add(zt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Q.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const _t=h(tt,"缩放");return _t.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),_t.add(t.zoom,"max",1,4,.05).name("最大倍率 (拉远上限)"),_t.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),_t.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),_t.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),_t.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),_t.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),_t.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(Ft=>Ft.close()),l.forEach(Ft=>Ft.close()),s.close(),{gui:s,refreshWeapon:()=>it.updateDisplay()}}function sx(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function ox(n,t){return n.find(e=>e.id===t)??null}function Ad(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function rx({stations:n,world:t,view:e,container:i,onResetZoom:a}){const s=i??document.getElementById("lab-panel");let o=null,r=null;const l=new Map,c=document.createElement("div");c.id="lab-toast",c.setAttribute("aria-live","polite"),document.body.appendChild(c);let h=0;function u(g){c.textContent=`${g.index} · ${g.name} — ${g.hint}`,c.style.borderColor=g.color,c.classList.add("is-on"),window.clearTimeout(h),h=window.setTimeout(()=>c.classList.remove("is-on"),5e3)}function d(){return sx(n,t.character.position.x,t.character.position.z)}function f(){const g=d(),p=(g==null?void 0:g.id)??null;if(p===o)return;const y=o!==null;o=p;for(const[x,v]of l)v.classList.toggle("is-active",x===p);r&&(r.textContent=g?`${g.index} · ${g.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",r.style.color=g?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),g?u(g):y&&c.classList.remove("is-on")}function m(g){const p=typeof g=="number"?n.find(y=>y.index===g)??null:ox(n,g);return p?(W0(t,p.spawnX,p.spawnZ),t.camera.centroidX=p.spawnX,t.camera.centroidZ=p.spawnZ,e.snapCamera(p.spawnX,t.character.position.y,p.spawnZ),f(),!0):!1}function _(){Af(t)}if(s){s.textContent="";const g=document.createElement("div");g.className="lab-head",g.textContent="测试工位";const p=document.createElement("span");p.className="lab-tip",p.textContent="[ / ] 切换",g.appendChild(p),s.appendChild(g);for(const v of[...n].sort((w,S)=>w.index-S.index)){const w=document.createElement("button");w.type="button",w.className="lab-row",w.dataset.station=v.id,w.dataset.uiButton="",w.style.setProperty("--lab-color",v.color),w.setAttribute("aria-label",`传送到工位 ${v.index}：${v.name}`);const S=document.createElement("span");S.className="lab-idx",S.textContent=String(v.index);const E=document.createElement("span");E.className="lab-name",E.textContent=v.name,w.append(S,E),w.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),m(v.id)}),s.appendChild(w),l.set(v.id,w)}r=document.createElement("div"),r.className="lab-hint",s.appendChild(r);const y=document.createElement("div");y.className="lab-foot";const x=document.createElement("button");if(x.type="button",x.className="lab-btn",x.dataset.uiButton="",x.textContent="召回假人",x.setAttribute("aria-label","召回全部假人回到各自工位"),x.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),_()}),y.appendChild(x),a){const v=document.createElement("button");v.type="button",v.className="lab-btn",v.dataset.uiButton="",v.textContent="镜头归位",v.setAttribute("aria-label","把镜头缩放恢复到默认"),v.addEventListener("pointerdown",w=>{w.preventDefault(),w.stopPropagation(),a()}),y.appendChild(v)}s.appendChild(y)}return window.addEventListener("keydown",g=>{var p,y;if(!(g.metaKey||g.ctrlKey||g.altKey))if(g.key==="["){const x=Ad(n,((p=d())==null?void 0:p.id)??o,-1);x&&m(x.id)}else if(g.key==="]"){const x=Ad(n,((y=d())==null?void 0:y.id)??o,1);x&&m(x.id)}else g.key==="\\"&&_()}),f(),{goto:m,current:d,tick:f,recall:_,element:s}}const uc=Math.PI*2,mi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},cx=45,lx=50;function hx(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Is(n,t,e){const i=hx(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function dx(n,t){return Math.atan2(n,-t)*180/Math.PI}function Rd(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Ao(n){return(n%360+360)%360}const ux={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function fx(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),h=o>.001?Is(s.moveX,s.moveZ,e):null,u=c>.15?Is(l.x,l.z,e):null,d=Is(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Is(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?Is(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=h!==null&&u!==null?Rd(h,u):null,p=h!==null?Rd(h,d):null,y=g!==null&&g>cx&&o>=.35&&c>=.4;return{inDeg:h,inLen:Math.min(1,o),rawDeg:r>.02?dx(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:c,faceDeg:d,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:y}}function Pd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>lx&&(n.inLen>=.35||n.speed>=.4)}const Cd="harness.dirDebug";function px(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(Cd)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function h(x){if(l=x,!t)try{window.localStorage.setItem(Cd,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),h(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&h(!l)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),d=118;a.width=Math.round(d*u),a.height=Math.round(d*u);let f=ux,m=0,_="",g=8;function p(x){if(!r)return;const v=d,w=d,S=v/2,E=w/2,T=Math.min(v,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,v,w),r.beginPath(),r.arc(S,E,T,0,uc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":mi.ring,r.stroke(),r.strokeStyle=mi.grid,r.beginPath(),r.moveTo(S-T,E),r.lineTo(S+T,E),r.moveTo(S,E-T),r.lineTo(S,E+T),r.stroke();for(let F=0;F<8;F++){const z=F*Math.PI/4,H=S+Math.sin(z)*(T-3),L=E-Math.cos(z)*(T-3),I=S+Math.sin(z)*T,Y=E-Math.cos(z)*T;r.beginPath(),r.moveTo(H,L),r.lineTo(I,Y),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=mi.dead,r.beginPath(),r.arc(S,E,T*b,0,uc),r.stroke(),r.restore());const M=(F,z,H,L,I=!1,Y=1)=>{const G=F*Math.PI/180,q=Math.sin(G),st=-Math.cos(G),gt=T*Math.max(.14,Math.min(1,z)),dt=S+q*T*.14,ft=E+st*T*.14,it=S+q*gt,j=E+st*gt;if(r.save(),r.globalAlpha=Y,r.strokeStyle=H,r.fillStyle=H,r.lineWidth=L,r.lineCap="round",I&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(dt,ft),r.lineTo(it,j),r.stroke(),!I&&gt>T*.3){const pt=-st,J=q,et=5.2;r.beginPath(),r.moveTo(it+q*1.5,j+st*1.5),r.lineTo(it-q*et+pt*et*.72,j-st*et+J*et*.72),r.lineTo(it-q*et-pt*et*.72,j-st*et-J*et*.72),r.closePath(),r.fill()}r.restore()},R=(F,z)=>{const H=F*Math.PI/180,L=Math.sin(H),I=-Math.cos(H),Y=-I,G=L,q=T+1.5,st=q+6.5;r.save(),r.fillStyle=z,r.strokeStyle=z,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*st,E+I*st),r.lineTo(S+L*q+Y*4,E+I*q+G*4),r.lineTo(S+L*q-Y*4,E+I*q-G*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,mi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,mi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,mi.aim,1.6,!0,.95),M(x.faceDeg,1,mi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),mi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,mi.input,2.2),R(x.faceDeg,mi.face),r.beginPath(),r.arc(S,E,2.2,0,uc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function y(x,v){const w=T=>T===null?"-":String(Math.round(Ao(T)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=T=>T===null?"-":`${Math.round(T)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||Pd(x,v))}return{update(x,v,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=fx(x,v,w,g);f=S;const E=x.combat.phase!=="idle";p(S);const T=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(T-m>90||b!==_)&&(m=T,_=b,y(S,E),e.dataset.in=S.inDeg===null?"":Ao(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Ao(S.moveDeg).toFixed(1),e.dataset.fc=Ao(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Pd(S,E)?"1":"0")},setEnabled:h,toggle(){return h(!l),l},enabled:()=>l,last:()=>f}}const mx=6,gx=480,Ld=240,Dd=92,xx=18;function vx(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function yx(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function _x(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function Mx(n={}){const t=Math.max(1,n.windowS??mx),e=Math.max(60,n.capacity??gx),i=Math.max(1,n.speedCap??xx),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),h=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");h.textContent=`${t.toFixed(1)}s`;const d=l.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(Ld*f),l.height=Math.round(Dd*f);const m=px({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function g(T){_=T,s.classList.toggle("is-off",!T),!a&&r&&(r.textContent=T?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(T)),r.setAttribute("aria-label",T?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",T=>{T.preventDefault(),T.stopPropagation(),g(!_)}),window.addEventListener("keydown",T=>{T.key.toLowerCase()==="v"&&!T.metaKey&&!T.ctrlKey&&g(!_)}));const p=[];let y=0,x=null,v=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(T){const b=T-t;let M=0;for(;M<p.length&&p[M].t<b;)M++;return p.slice(M)}function E(T,b){if(!d)return;const M=Ld,R=Dd;d.setTransform(f,0,0,f,0,0),d.clearRect(0,0,M,R),d.fillStyle="rgba(8, 12, 17, 0.55)",d.fillRect(0,0,M,R);const F=4,z=4,H=M-F-z,L=9,I=46,Y=62,G=22,q=b-t,st=J=>F+Math.max(0,Math.min(1,(J-q)/t))*H;for(let J=0;J<T.length;J++){if(!T[J].busy)continue;const et=st(T[J].t),K=J+1<T.length?st(T[J+1].t):et+2;d.fillStyle="rgba(251, 146, 60, 0.13)",d.fillRect(et,L,Math.max(2,K-et),I)}d.strokeStyle="rgba(150, 190, 220, 0.14)",d.lineWidth=1,d.beginPath();for(const J of[L,L+I/2,L+I])d.moveTo(F,J),d.lineTo(M-z,J);d.moveTo(F,Y+G/2),d.lineTo(M-z,Y+G/2),d.stroke();const dt=Math.max(1,...T.map(J=>J.speed),...T.map(J=>J.drive))*1.15,ft=J=>L+I-J/dt*I;if(T.length>1){d.beginPath(),d.moveTo(st(T[0].t),ft(T[0].speed));for(let J=1;J<T.length;J++)d.lineTo(st(T[J].t),ft(T[J].speed));d.strokeStyle="#38bdf8",d.lineWidth=1.8,d.lineJoin="round",d.stroke(),d.lineTo(st(T[T.length-1].t),L+I),d.lineTo(st(T[0].t),L+I),d.closePath(),d.fillStyle="rgba(56, 189, 248, 0.14)",d.fill(),d.beginPath(),d.moveTo(st(T[0].t),ft(T[0].drive));for(let J=1;J<T.length;J++)d.lineTo(st(T[J].t),ft(T[J].drive));d.setLineDash([3,3]),d.strokeStyle="rgba(190, 205, 220, 0.6)",d.lineWidth=1.2,d.stroke(),d.setLineDash([])}let it=.02;for(const J of T)it=Math.max(it,Math.abs(J.dv));it*=1.1;const j=Y+G/2,pt=G/2;for(const J of T){const et=Math.min(pt,Math.abs(J.dv)/it*pt);d.fillStyle=J.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",d.fillRect(st(J.t)-.7,J.dv>=0?j-et:j,1.4,Math.max(.5,et))}d.font="9px ui-monospace, monospace",d.fillStyle="rgba(190, 214, 234, 0.55)",d.textAlign="left",d.fillText(dt.toFixed(1),F+2,L+8),d.fillText("v",F+2,L+I-2),d.fillText("Δv",F+2,Y+9),d.textAlign="right",d.fillText("0",M-z-2,L+I-2),d.textAlign="left"}return{dirDebug:m,update(T,b,M){const R=performance.now()/1e3,F=v<0?1/60:Math.max(1e-4,Math.min(.25,R-v));v=R;const z=T.character,H={x:z.position.x,z:z.position.z},L=Math.hypot(z.velocity.x,z.velocity.z),{speed:I,raw:Y}=x?yx(x,H,F,i):{speed:0,raw:0},G=vx(y,I,F,R);G.drive=L,G.raw=Y,G.busy=_x(T),x=H,y=I,p.push(G),p.length>e&&p.shift();const q=S(R);let st=0;for(const gt of q)st=Math.max(st,gt.speed);if(w={speed:I,drive:L,raw:Y,dv:G.dv,accel:G.accel,peak:st,samples:q.length,windowS:t,busy:G.busy},m.update(T,b,M),_){E(q,R);const gt=G.dv>=0?"+":"";c.textContent=`v ${I.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${st.toFixed(2)} · Δv ${gt}${G.dv.toFixed(3)} · ${q.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(T=>({...T}))}}const bx=["剑盾","双剑","大剑","法杖","弓"],Sx={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击"};function wx(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,h=l.velocity,u=t.combat,d=t.events.length>0?t.events[t.events.length-1]:null,f=Lt=>Lt.toFixed(2),m=Lt=>(Lt*180/Math.PI).toFixed(0),_=bx[Sa.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),y=t.dash,x=y.phase==="active"&&y.duration>0?(1-y.timer/y.duration)*100:0,v=y.phase==="active"?`${y.kind}@${x.toFixed(0)}%`:`${y.kind} cd${f(y.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=h.x*Math.sin(l.bodyYaw)+h.z*Math.cos(l.bodyYaw),E=h.x*Math.cos(l.bodyYaw)-h.z*Math.sin(l.bodyYaw),T=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/T*100),M=`strafe ${b}%${S<-.05?" back":""}`,R=t.camera,F=`threat ${(R.threat*100).toFixed(0)}%  dist×${f(R.distanceScale)}  off (${f(R.offsetX)},${f(R.offsetZ)})  pitch +${f(R.pitchDelta)}°  n=${R.threatCount}`,z=o?f(o.attackBlend):"-",H=o==null?void 0:o.attackWeights,L=H?`gw ${f(H.gaitScale)}  lw ${f(H.attackLegWeight)}  spd ${f(H.driveSpeed)}`:"-",I=H?`${f(H.gaitScale)}/${f(H.attackLegWeight)}`:"-",Y=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",G=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",q=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",st=o==null?void 0:o.hurt,gt=st?`hurt ${t.playerHurt.type}  部位h${f(st.hitHeight)}  脉冲p${f(st.pulse)}  上身${f(st.upperShift)}  重心${f(st.comShift)}  后坐${f(st.pelvisBack)}  屈膝${f(st.knee)}`:"-",dt=st?`${f(st.hitHeight)}/${f(st.pulse)}/${f(st.knee)}`:"-",ft=o==null?void 0:o.ik,it=ft?`${ft.active?"on":"off"} w${f(ft.weight)} e${f(ft.maxError)}`:"-",j=t.playerLink,pt=`link ${j.kind||"-"}  ${j.phase}  prog ${f(j.progress)}  win ${f(j.linkWindow)}s  cd ${f(j.cooldown)}s  hits ${j.hitIds.length}  travel ${f(j.travelled)}/${f(j.travel)}m  id ${j.id}`,J=`${j.phase}/${j.kind||"-"}/w${f(j.linkWindow)}`,et=a.lastGesture,K=et?`${et.button} ${et.kind} ${et.heldMs.toFixed(0)}ms d${et.distance.toFixed(0)}px ${et.angleDeg.toFixed(0)}° taps${et.taps}`:"-",St=t.dummies.map(Lt=>`${Lt.id}:${Sx[Lt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${j.phase}${j.kind?`/${j.kind}`:""} w${f(j.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(c.x)},${f(c.y)},${f(c.z)})  vel (${f(h.x)},${f(h.y)},${f(h.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(l.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${v}  ab ${z}  gw/lw ${I}  land ${G}  ik ${it}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${dt}`,`dummies ${St}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${f(R.distanceScale)}  ${q}  lk ${J}`,`event ${d?`${d.type} ${f(d.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${K}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(c.x)}, ${f(c.y)}, ${f(c.z)})`,`vel  (${f(h.x)}, ${f(h.y)}, ${f(h.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${z}   ${L}   land ${Y}`,gt,`ik ${it}  clamped ${ft?ft.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${y.kind}  phase ${y.phase}  prog ${x.toFixed(0)}%  cd ${f(y.cooldown)}s  id ${y.id}  from (${f(y.fromX)},${f(y.fromZ)}) → to (${f(y.toX)},${f(y.toZ)})`,pt,`camera ${F}  ${q}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${St}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${d?`${d.type} ${f(d.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${K}`].join(`
`)}}}const Ro=["lab","hud","motion","debug"],kd={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Id={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function Ex(n){var l;const t=Object.fromEntries(Ro.map(c=>[c,document.getElementById(Id[c].toggle)])),e=Object.fromEntries(Ro.map(c=>[c,document.getElementById(Id[c].panel)]));let i={},a=null;function s(){var c,h,u;for(const d of Ro){const f=a===d,m=t[d],_=e[d];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${kd[d].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${kd[d].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(h=i.debug)==null||h.open():(u=i.debug)==null||u.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Ro)(l=t[c])==null||l.addEventListener("pointerdown",h=>{h.preventDefault(),h.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dh="170",Tx=0,zd=1,Ax=2,zf=1,Ff=2,Li=3,Qi=0,Fn=1,Ve=2,Ki=0,hs=1,Di=2,Fd=3,Ud=4,Rx=5,va=100,Px=101,Cx=102,Lx=103,Dx=104,kx=200,Ix=201,zx=202,Fx=203,cl=204,ll=205,Ux=206,Nx=207,Ox=208,Bx=209,Hx=210,Gx=211,Vx=212,Xx=213,Wx=214,hl=0,dl=1,ul=2,xs=3,fl=4,pl=5,ml=6,gl=7,uh=0,Yx=1,$x=2,Ji=0,Zx=1,qx=2,jx=3,Kx=4,Jx=5,Qx=6,tv=7,Uf=300,vs=301,ys=302,xl=303,vl=304,Ur=306,yl=1e3,_a=1001,_l=1002,ci=1003,ev=1004,Po=1005,vi=1006,fc=1007,Ma=1008,Ui=1009,Nf=1010,Of=1011,ao=1012,fh=1013,wa=1014,Ii=1015,fo=1016,ph=1017,mh=1018,_s=1020,Bf=35902,Hf=1021,Gf=1022,ri=1023,Vf=1024,Xf=1025,ds=1026,Ms=1027,Wf=1028,gh=1029,Yf=1030,xh=1031,vh=1033,lr=33776,hr=33777,dr=33778,ur=33779,Ml=35840,bl=35841,Sl=35842,wl=35843,El=36196,Tl=37492,Al=37496,Rl=37808,Pl=37809,Cl=37810,Ll=37811,Dl=37812,kl=37813,Il=37814,zl=37815,Fl=37816,Ul=37817,Nl=37818,Ol=37819,Bl=37820,Hl=37821,fr=36492,Gl=36494,Vl=36495,$f=36283,Xl=36284,Wl=36285,Yl=36286,nv=3200,iv=3201,Zf=0,av=1,$i="",Cn="srgb",Ss="srgb-linear",Nr="linear",Ce="srgb",Ha=7680,Nd=519,sv=512,ov=513,rv=514,qf=515,cv=516,lv=517,hv=518,dv=519,$l=35044,Od=35048,Bd="300 es",zi=2e3,Tr=2001;class ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Hd=1234567;const us=Math.PI/180,so=180/Math.PI;function _i(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]+"-"+xn[t&255]+xn[t>>8&255]+"-"+xn[t>>16&15|64]+xn[t>>24&255]+"-"+xn[e&63|128]+xn[e>>8&255]+"-"+xn[e>>16&255]+xn[e>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function fn(n,t,e){return Math.max(t,Math.min(e,n))}function yh(n,t){return(n%t+t)%t}function uv(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function fv(n,t,e){return n!==t?(e-n)/(t-n):0}function qs(n,t,e){return(1-e)*n+e*t}function pv(n,t,e,i){return qs(n,t,1-Math.exp(-e*i))}function mv(n,t=1){return t-Math.abs(yh(n,t*2)-t)}function gv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function xv(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function vv(n,t){return n+Math.floor(Math.random()*(t-n+1))}function yv(n,t){return n+Math.random()*(t-n)}function _v(n){return n*(.5-Math.random())}function Mv(n){n!==void 0&&(Hd=n);let t=Hd+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function bv(n){return n*us}function Sv(n){return n*so}function wv(n){return(n&n-1)===0&&n!==0}function Ev(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Tv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Av(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),h=o((t+i)/2),u=s((t-i)/2),d=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*h,l*u,l*d,r*c);break;case"YZY":n.set(l*d,r*h,l*u,r*c);break;case"ZXZ":n.set(l*u,l*d,r*h,r*c);break;case"XZX":n.set(r*h,l*m,l*f,r*c);break;case"YXY":n.set(l*f,r*h,l*m,r*c);break;case"ZYZ":n.set(l*m,l*f,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function oi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Re(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Gd={DEG2RAD:us,RAD2DEG:so,generateUUID:_i,clamp:fn,euclideanModulo:yh,mapLinear:uv,inverseLerp:fv,lerp:qs,damp:pv,pingpong:mv,smoothstep:gv,smootherstep:xv,randInt:vv,randFloat:yv,randFloatSpread:_v,seededRandom:Mv,degToRad:bv,radToDeg:Sv,isPowerOfTwo:wv,ceilPowerOfTwo:Ev,floorPowerOfTwo:Tv,setQuaternionFromProperEuler:Av,normalize:Re,denormalize:oi};class Wt{constructor(t=0,e=0){Wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(fn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class le{constructor(t,e,i,a,s,o,r,l,c){le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=a,h[2]=r,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],_=a[0],g=a[3],p=a[6],y=a[1],x=a[4],v=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*_+r*y+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*v+l*E,s[1]=c*_+h*y+u*w,s[4]=c*g+h*x+u*S,s[7]=c*p+h*v+u*E,s[2]=d*_+f*y+m*w,s[5]=d*g+f*x+m*S,s[8]=d*p+f*v+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-i*s*h+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*o-r*c,d=r*l-h*s,f=c*s-o*l,m=e*u+i*d+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=u*_,t[1]=(a*c-h*i)*_,t[2]=(r*i-a*o)*_,t[3]=d*_,t[4]=(h*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(pc.makeScale(t,e)),this}rotate(t){return this.premultiply(pc.makeRotation(-t)),this}translate(t,e){return this.premultiply(pc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const pc=new le;function jf(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ar(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Rv(){const n=Ar("canvas");return n.style.display="block",n}const Vd={};function Vs(n){n in Vd||(Vd[n]=!0,console.warn(n))}function Pv(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function Cv(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Lv(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const _e={enabled:!0,workingColorSpace:Ss,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Ce&&(n.r=Fi(n.r),n.g=Fi(n.g),n.b=Fi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Ce&&(n.r=fs(n.r),n.g=fs(n.g),n.b=fs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===$i?Nr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Fi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function fs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Xd=[.64,.33,.3,.6,.15,.06],Wd=[.2126,.7152,.0722],Yd=[.3127,.329],$d=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zd=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);_e.define({[Ss]:{primaries:Xd,whitePoint:Yd,transfer:Nr,toXYZ:$d,fromXYZ:Zd,luminanceCoefficients:Wd,workingColorSpaceConfig:{unpackColorSpace:Cn},outputColorSpaceConfig:{drawingBufferColorSpace:Cn}},[Cn]:{primaries:Xd,whitePoint:Yd,transfer:Ce,toXYZ:$d,fromXYZ:Zd,luminanceCoefficients:Wd,outputColorSpaceConfig:{drawingBufferColorSpace:Cn}}});let Ga;class Dv{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ga===void 0&&(Ga=Ar("canvas")),Ga.width=t.width,Ga.height=t.height;const i=Ga.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Ga}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ar("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Fi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Fi(e[i]/255)*255):e[i]=Fi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let kv=0;class Kf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kv++}),this.uuid=_i(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(mc(a[o].image)):s.push(mc(a[o]))}else s=mc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function mc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Dv.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Iv=0;class Ln extends ws{constructor(t=Ln.DEFAULT_IMAGE,e=Ln.DEFAULT_MAPPING,i=_a,a=_a,s=vi,o=Ma,r=ri,l=Ui,c=Ln.DEFAULT_ANISOTROPY,h=$i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Iv++}),this.uuid=_i(),this.name="",this.source=new Kf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case yl:t.x=t.x-Math.floor(t.x);break;case _a:t.x=t.x<0?0:1;break;case _l:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case yl:t.y=t.y-Math.floor(t.y);break;case _a:t.y=t.y<0?0:1;break;case _l:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=Uf;Ln.DEFAULT_ANISOTROPY=1;class Ke{constructor(t=0,e=0,i=0,a=1){Ke.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,S=(h+d)/4,E=(u+_)/4,T=(m+g)/4;return x>v&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):v>w?v<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(v),i=S/a,s=T/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=T/s),this.set(i,a,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zv extends ws{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ke(0,0,t,e),this.scissorTest=!1,this.viewport=new Ke(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Ln(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Kf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ea extends zv{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Jf extends Ln{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ci,this.minFilter=ci,this.wrapR=_a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Fv extends Ln{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=ci,this.minFilter=ci,this.wrapR=_a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class po{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],h=i[a+2],u=i[a+3];const d=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==m){let g=1-r;const p=l*d+c*f+h*m+u*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*y);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const v=r*y;if(l=l*g+d*v,c=c*g+f*v,h=h*g+m*v,u=u*g+_*v,g===1-r){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],h=i[a+3],u=s[o],d=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-r*f,t[e+2]=c*m+h*f+r*d-l*u,t[e+3]=h*m-r*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(a/2),u=r(s/2),d=l(i/2),f=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-l)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-c)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(fn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*r+a*c-s*l,this._y=a*h+o*l+s*r-i*c,this._z=s*h+o*c+i*l-a*r,this._w=o*h-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=i*u+this._x*d,this._y=a*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,i=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qd.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qd.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),h=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+l*c+o*u-r*h,this.y=i+l*h+r*c-s*u,this.z=a+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return gc.copy(this).projectOnVector(t),this.sub(gc)}reflect(t){return this.sub(gc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(fn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gc=new W,qd=new po;class mo{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ii):ii.fromBufferAttribute(s,o),ii.applyMatrix4(t.matrixWorld),this.expandByPoint(ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Co.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Co.copy(i.boundingBox)),Co.applyMatrix4(t.matrixWorld),this.union(Co)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ii),ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(zs),Lo.subVectors(this.max,zs),Va.subVectors(t.a,zs),Xa.subVectors(t.b,zs),Wa.subVectors(t.c,zs),Hi.subVectors(Xa,Va),Gi.subVectors(Wa,Xa),oa.subVectors(Va,Wa);let e=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-oa.z,oa.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,oa.z,0,-oa.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-oa.y,oa.x,0];return!xc(e,Va,Xa,Wa,Lo)||(e=[1,0,0,0,1,0,0,0,1],!xc(e,Va,Xa,Wa,Lo))?!1:(Do.crossVectors(Hi,Gi),e=[Do.x,Do.y,Do.z],xc(e,Va,Xa,Wa,Lo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ei=[new W,new W,new W,new W,new W,new W,new W,new W],ii=new W,Co=new mo,Va=new W,Xa=new W,Wa=new W,Hi=new W,Gi=new W,oa=new W,zs=new W,Lo=new W,Do=new W,ra=new W;function xc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){ra.fromArray(n,s);const r=a.x*Math.abs(ra.x)+a.y*Math.abs(ra.y)+a.z*Math.abs(ra.z),l=t.dot(ra),c=e.dot(ra),h=i.dot(ra);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Uv=new mo,Fs=new W,vc=new W;class Or{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Uv.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Fs.subVectors(t,this.center);const e=Fs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Fs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Fs.copy(t.center).add(vc)),this.expandByPoint(Fs.copy(t.center).sub(vc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ti=new W,yc=new W,ko=new W,Vi=new W,_c=new W,Io=new W,Mc=new W;class _h{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ti)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ti.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ti.copy(this.origin).addScaledVector(this.direction,e),Ti.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){yc.copy(t).add(e).multiplyScalar(.5),ko.copy(e).sub(t).normalize(),Vi.copy(this.origin).sub(yc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ko),r=Vi.dot(this.direction),l=-Vi.dot(ko),c=Vi.lengthSq(),h=Math.abs(1-o*o);let u,d,f,m;if(h>0)if(u=o*l-r,d=o*r-l,m=s*h,u>=0)if(d>=-m)if(d<=m){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*r)+d*(o*u+d+2*l)+c}else d=s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*s+r)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(o*s+r)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=o>0?-s:s,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(yc).addScaledVector(ko,d),f}intersectSphere(t,e){Ti.subVectors(t.center,this.origin);const i=Ti.dot(this.direction),a=Ti.dot(Ti)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,a=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,a=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ti)!==null}intersectTriangle(t,e,i,a,s){_c.subVectors(e,t),Io.subVectors(i,t),Mc.crossVectors(_c,Io);let o=this.direction.dot(Mc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Vi.subVectors(this.origin,t);const l=r*this.direction.dot(Io.crossVectors(Vi,Io));if(l<0)return null;const c=r*this.direction.dot(_c.cross(Vi));if(c<0||l+c>o)return null;const h=-r*Vi.dot(Mc);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oe{constructor(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g){Oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g)}set(t,e,i,a,s,o,r,l,c,h,u,d,f,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Ya.setFromMatrixColumn(t,0).length(),s=1/Ya.setFromMatrixColumn(t,1).length(),o=1/Ya.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,f=o*u,m=r*h,_=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,m=c*h,_=c*u;e[0]=d+_*r,e[4]=m*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-m,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,m=c*h,_=c*u;e[0]=d-_*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,m=r*h,_=r*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=_-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Nv,t,Ov)}lookAt(t,e,i){const a=this.elements;return Hn.subVectors(t,e),Hn.lengthSq()===0&&(Hn.z=1),Hn.normalize(),Xi.crossVectors(i,Hn),Xi.lengthSq()===0&&(Math.abs(i.z)===1?Hn.x+=1e-4:Hn.z+=1e-4,Hn.normalize(),Xi.crossVectors(i,Hn)),Xi.normalize(),zo.crossVectors(Hn,Xi),a[0]=Xi.x,a[4]=zo.x,a[8]=Hn.x,a[1]=Xi.y,a[5]=zo.y,a[9]=Hn.y,a[2]=Xi.z,a[6]=zo.z,a[10]=Hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],S=a[0],E=a[4],T=a[8],b=a[12],M=a[1],R=a[5],F=a[9],z=a[13],H=a[2],L=a[6],I=a[10],Y=a[14],G=a[3],q=a[7],st=a[11],gt=a[15];return s[0]=o*S+r*M+l*H+c*G,s[4]=o*E+r*R+l*L+c*q,s[8]=o*T+r*F+l*I+c*st,s[12]=o*b+r*z+l*Y+c*gt,s[1]=h*S+u*M+d*H+f*G,s[5]=h*E+u*R+d*L+f*q,s[9]=h*T+u*F+d*I+f*st,s[13]=h*b+u*z+d*Y+f*gt,s[2]=m*S+_*M+g*H+p*G,s[6]=m*E+_*R+g*L+p*q,s[10]=m*T+_*F+g*I+p*st,s[14]=m*b+_*z+g*Y+p*gt,s[3]=y*S+x*M+v*H+w*G,s[7]=y*E+x*R+v*L+w*q,s[11]=y*T+x*F+v*I+w*st,s[15]=y*b+x*z+v*Y+w*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*l*u-a*c*u-s*r*d+i*c*d+a*r*f-i*l*f)+_*(+e*l*f-e*c*d+s*o*d-a*o*f+a*c*h-s*l*h)+g*(+e*c*u-e*r*f-s*o*u+i*o*f+s*r*h-i*c*h)+p*(-a*r*h-e*l*u+e*r*d+a*o*u-i*o*d+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],y=u*g*c-_*d*c+_*l*f-r*g*f-u*l*p+r*d*p,x=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,v=h*_*c-m*u*c+m*r*f-o*_*f-h*r*p+o*u*p,w=m*u*l-h*_*l-m*r*d+o*_*d+h*r*g-o*u*g,S=e*y+i*x+a*v+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=y*E,t[1]=(_*d*s-u*g*s-_*a*f+i*g*f+u*a*p-i*d*p)*E,t[2]=(r*g*s-_*l*s+_*a*c-i*g*c-r*a*p+i*l*p)*E,t[3]=(u*l*s-r*d*s-u*a*c+i*d*c+r*a*f-i*l*f)*E,t[4]=x*E,t[5]=(h*g*s-m*d*s+m*a*f-e*g*f-h*a*p+e*d*p)*E,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*E,t[7]=(o*d*s-h*l*s+h*a*c-e*d*c-o*a*f+e*l*f)*E,t[8]=v*E,t[9]=(m*u*s-h*_*s-m*i*f+e*_*f+h*i*p-e*u*p)*E,t[10]=(o*_*s-m*r*s+m*i*c-e*_*c-o*i*p+e*r*p)*E,t[11]=(h*r*s-o*u*s-h*i*c+e*u*c+o*i*f-e*r*f)*E,t[12]=w*E,t[13]=(h*_*a-m*u*a+m*i*d-e*_*d-h*i*g+e*u*g)*E,t[14]=(m*r*a-o*_*a-m*i*l+e*_*l+o*i*g-e*r*g)*E,t[15]=(o*u*a-h*r*a+h*i*l-e*u*l-o*i*d+e*r*d)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,h=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+i,h*l-a*o,0,c*l-a*r,h*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,h=o+o,u=r+r,d=s*c,f=s*h,m=s*u,_=o*h,g=o*u,p=r*u,y=l*c,x=l*h,v=l*u,w=i.x,S=i.y,E=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+v)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(f-v)*S,a[5]=(1-(d+p))*S,a[6]=(g+y)*S,a[7]=0,a[8]=(m+x)*E,a[9]=(g-y)*E,a[10]=(1-(d+_))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Ya.set(a[0],a[1],a[2]).length();const o=Ya.set(a[4],a[5],a[6]).length(),r=Ya.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ai.copy(this);const c=1/s,h=1/o,u=1/r;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=h,ai.elements[5]*=h,ai.elements[6]*=h,ai.elements[8]*=u,ai.elements[9]*=u,ai.elements[10]*=u,e.setFromRotationMatrix(ai),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=zi){const l=this.elements,c=2*s/(e-t),h=2*s/(i-a),u=(e+t)/(e-t),d=(i+a)/(i-a);let f,m;if(r===zi)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===Tr)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=zi){const l=this.elements,c=1/(e-t),h=1/(i-a),u=1/(o-s),d=(e+t)*c,f=(i+a)*h;let m,_;if(r===zi)m=(o+s)*u,_=-2*u;else if(r===Tr)m=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ya=new W,ai=new Oe,Nv=new W(0,0,0),Ov=new W(1,1,1),Xi=new W,zo=new W,Hn=new W,jd=new Oe,Kd=new po;class Mi{constructor(t=0,e=0,i=0,a=Mi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],h=a[9],u=a[2],d=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(fn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(fn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-fn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-fn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return jd.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jd,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Kd.setFromEuler(this),this.setFromQuaternion(Kd,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mi.DEFAULT_ORDER="XYZ";class Mh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bv=0;const Jd=new W,$a=new po,Ai=new Oe,Fo=new W,Us=new W,Hv=new W,Gv=new po,Qd=new W(1,0,0),tu=new W(0,1,0),eu=new W(0,0,1),nu={type:"added"},Vv={type:"removed"},Za={type:"childadded",child:null},bc={type:"childremoved",child:null};class Ze extends ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bv++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const t=new W,e=new Mi,i=new po,a=new W(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Oe},normalMatrix:{value:new le}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return $a.setFromAxisAngle(t,e),this.quaternion.multiply($a),this}rotateOnWorldAxis(t,e){return $a.setFromAxisAngle(t,e),this.quaternion.premultiply($a),this}rotateX(t){return this.rotateOnAxis(Qd,t)}rotateY(t){return this.rotateOnAxis(tu,t)}rotateZ(t){return this.rotateOnAxis(eu,t)}translateOnAxis(t,e){return Jd.copy(t).applyQuaternion(this.quaternion),this.position.add(Jd.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qd,t)}translateY(t){return this.translateOnAxis(tu,t)}translateZ(t){return this.translateOnAxis(eu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ai.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Fo.copy(t):Fo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ai.lookAt(Us,Fo,this.up):Ai.lookAt(Fo,Us,this.up),this.quaternion.setFromRotationMatrix(Ai),a&&(Ai.extractRotation(a.matrixWorld),$a.setFromRotationMatrix(Ai),this.quaternion.premultiply($a.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(nu),Za.child=t,this.dispatchEvent(Za),Za.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vv),bc.child=t,this.dispatchEvent(bc),bc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ai.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ai.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ai),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(nu),Za.child=t,this.dispatchEvent(Za),Za.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,Hv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,Gv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Ze.DEFAULT_UP=new W(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new W,Ri=new W,Sc=new W,Pi=new W,qa=new W,ja=new W,iu=new W,wc=new W,Ec=new W,Tc=new W,Ac=new Ke,Rc=new Ke,Pc=new Ke;class Wn{constructor(t=new W,e=new W,i=new W){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),si.subVectors(t,e),a.cross(si);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){si.subVectors(a,e),Ri.subVectors(i,e),Sc.subVectors(t,e);const o=si.dot(si),r=si.dot(Ri),l=si.dot(Sc),c=Ri.dot(Ri),h=Ri.dot(Sc),u=o*c-r*r;if(u===0)return s.set(0,0,0),null;const d=1/u,f=(c*l-r*h)*d,m=(o*h-r*l)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pi.x),l.addScaledVector(o,Pi.y),l.addScaledVector(r,Pi.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Ac.setScalar(0),Rc.setScalar(0),Pc.setScalar(0),Ac.fromBufferAttribute(t,e),Rc.fromBufferAttribute(t,i),Pc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Ac,s.x),o.addScaledVector(Rc,s.y),o.addScaledVector(Pc,s.z),o}static isFrontFacing(t,e,i,a){return si.subVectors(i,e),Ri.subVectors(t,e),si.cross(Ri).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return si.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),si.cross(Ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Wn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;qa.subVectors(a,i),ja.subVectors(s,i),wc.subVectors(t,i);const l=qa.dot(wc),c=ja.dot(wc);if(l<=0&&c<=0)return e.copy(i);Ec.subVectors(t,a);const h=qa.dot(Ec),u=ja.dot(Ec);if(h>=0&&u<=h)return e.copy(a);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(qa,o);Tc.subVectors(t,s);const f=qa.dot(Tc),m=ja.dot(Tc);if(m>=0&&f<=m)return e.copy(s);const _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(ja,r);const g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return iu.subVectors(s,a),r=(u-h)/(u-h+(f-m)),e.copy(a).addScaledVector(iu,r);const p=1/(g+_+d);return o=_*p,r=d*p,e.copy(i).addScaledVector(qa,o).addScaledVector(ja,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Qf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wi={h:0,s:0,l:0},Uo={h:0,s:0,l:0};function Cc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Cn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,_e.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=_e.workingColorSpace){return this.r=t,this.g=e,this.b=i,_e.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=_e.workingColorSpace){if(t=yh(t,1),e=fn(e,0,1),i=fn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Cc(o,s,t+1/3),this.g=Cc(o,s,t),this.b=Cc(o,s,t-1/3)}return _e.toWorkingColorSpace(this,a),this}setStyle(t,e=Cn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Cn){const i=Qf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=fs(t.r),this.g=fs(t.g),this.b=fs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Cn){return _e.fromWorkingColorSpace(vn.copy(this),t),Math.round(fn(vn.r*255,0,255))*65536+Math.round(fn(vn.g*255,0,255))*256+Math.round(fn(vn.b*255,0,255))}getHexString(t=Cn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=_e.workingColorSpace){_e.fromWorkingColorSpace(vn.copy(this),e);const i=vn.r,a=vn.g,s=vn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=h<=.5?u/(o+r):u/(2-o-r),o){case i:l=(a-s)/u+(a<s?6:0);break;case a:l=(s-i)/u+2;break;case s:l=(i-a)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=_e.workingColorSpace){return _e.fromWorkingColorSpace(vn.copy(this),e),t.r=vn.r,t.g=vn.g,t.b=vn.b,t}getStyle(t=Cn){_e.fromWorkingColorSpace(vn.copy(this),t);const e=vn.r,i=vn.g,a=vn.b;return t!==Cn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Wi),this.setHSL(Wi.h+t,Wi.s+e,Wi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Wi),t.getHSL(Uo);const i=qs(Wi.h,Uo.h,e),a=qs(Wi.s,Uo.s,e),s=qs(Wi.l,Uo.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const vn=new Qt;Qt.NAMES=Qf;let Xv=0;class Aa extends ws{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xv++}),this.uuid=_i(),this.name="",this.blending=hs,this.side=Qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=cl,this.blendDst=ll,this.blendEquation=va,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Nd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ha,this.stencilZFail=Ha,this.stencilZPass=Ha,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==hs&&(i.blending=this.blending),this.side!==Qi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==cl&&(i.blendSrc=this.blendSrc),this.blendDst!==ll&&(i.blendDst=this.blendDst),this.blendEquation!==va&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Nd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ha&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ha&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ha&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class en extends Aa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const tn=new W,No=new Wt;class pn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=$l,this.updateRanges=[],this.gpuType=Ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)No.fromBufferAttribute(this,e),No.applyMatrix3(t),this.setXY(e,No.x,No.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix3(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyMatrix4(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.applyNormalMatrix(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)tn.fromBufferAttribute(this,e),tn.transformDirection(t),this.setXYZ(e,tn.x,tn.y,tn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=oi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=oi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=oi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=oi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==$l&&(t.usage=this.usage),t}}class tp extends pn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class ep extends pn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Se extends pn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Wv=0;const $n=new Oe,Lc=new Ze,Ka=new W,Gn=new mo,Ns=new mo,dn=new W;class nn extends ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wv++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jf(t)?ep:tp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new le().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $n.makeRotationFromQuaternion(t),this.applyMatrix4($n),this}rotateX(t){return $n.makeRotationX(t),this.applyMatrix4($n),this}rotateY(t){return $n.makeRotationY(t),this.applyMatrix4($n),this}rotateZ(t){return $n.makeRotationZ(t),this.applyMatrix4($n),this}translate(t,e,i){return $n.makeTranslation(t,e,i),this.applyMatrix4($n),this}scale(t,e,i){return $n.makeScale(t,e,i),this.applyMatrix4($n),this}lookAt(t){return Lc.lookAt(t),Lc.updateMatrix(),this.applyMatrix4(Lc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ka).negate(),this.translate(Ka.x,Ka.y,Ka.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Se(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Gn.setFromBufferAttribute(s),this.morphTargetsRelative?(dn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(dn),dn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(dn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Or);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new W,1/0);return}if(t){const i=this.boundingSphere.center;if(Gn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Ns.setFromBufferAttribute(r),this.morphTargetsRelative?(dn.addVectors(Gn.min,Ns.min),Gn.expandByPoint(dn),dn.addVectors(Gn.max,Ns.max),Gn.expandByPoint(dn)):(Gn.expandByPoint(Ns.min),Gn.expandByPoint(Ns.max))}Gn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)dn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(dn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)dn.fromBufferAttribute(r,c),l&&(Ka.fromBufferAttribute(t,c),dn.add(Ka)),a=Math.max(a,i.distanceToSquared(dn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let T=0;T<i.count;T++)r[T]=new W,l[T]=new W;const c=new W,h=new W,u=new W,d=new Wt,f=new Wt,m=new Wt,_=new W,g=new W;function p(T,b,M){c.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),d.fromBufferAttribute(s,T),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),h.sub(c),u.sub(c),f.sub(d),m.sub(d);const R=1/(f.x*m.y-m.x*f.y);isFinite(R)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(R),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(R),r[T].add(_),r[b].add(_),r[M].add(_),l[T].add(g),l[b].add(g),l[M].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let T=0,b=y.length;T<b;++T){const M=y[T],R=M.start,F=M.count;for(let z=R,H=R+F;z<H;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new W,v=new W,w=new W,S=new W;function E(T){w.fromBufferAttribute(a,T),S.copy(w);const b=r[T];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),v.crossVectors(S,b);const R=v.dot(l[T])<0?-1:1;o.setXYZW(T,x.x,x.y,x.z,R)}for(let T=0,b=y.length;T<b;++T){const M=y[T],R=M.start,F=M.count;for(let z=R,H=R+F;z<H;z+=3)E(t.getX(z+0)),E(t.getX(z+1)),E(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const a=new W,s=new W,o=new W,r=new W,l=new W,c=new W,h=new W,u=new W;if(t)for(let d=0,f=t.count;d<f;d+=3){const m=t.getX(d+0),_=t.getX(d+1),g=t.getX(d+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(h),l.add(h),c.add(h),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)a.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(a,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)dn.fromBufferAttribute(t,e),dn.normalize(),t.setXYZ(e,dn.x,dn.y,dn.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,d=new c.constructor(l.length*h);let f=0,m=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new pn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new nn,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(a[l]=h,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const au=new Oe,ca=new _h,Oo=new Or,su=new W,Bo=new W,Ho=new W,Go=new W,Dc=new W,Vo=new W,ou=new W,Xo=new W;class fe extends Ze{constructor(t=new nn,e=new en){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){Vo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=r[l],u=s[l];h!==0&&(Dc.fromBufferAttribute(u,t),o?Vo.addScaledVector(Dc,h):Vo.addScaledVector(Dc.sub(e),h))}e.add(Vo)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Oo.copy(i.boundingSphere),Oo.applyMatrix4(s),ca.copy(t.ray).recast(t.near),!(Oo.containsPoint(ca.origin)===!1&&(ca.intersectSphere(Oo,su)===null||ca.origin.distanceToSquared(su)>(t.far-t.near)**2))&&(au.copy(s).invert(),ca.copy(t.ray).applyMatrix4(au),!(i.boundingBox!==null&&ca.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ca)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=r.getX(v),E=r.getX(v+1),T=r.getX(v+2);a=Wo(this,p,t,i,c,h,u,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=r.getX(g),x=r.getX(g+1),v=r.getX(g+2);a=Wo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const S=v,E=v+1,T=v+2;a=Wo(this,p,t,i,c,h,u,S,E,T),a&&(a.faceIndex=Math.floor(v/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=g,x=g+1,v=g+2;a=Wo(this,o,t,i,c,h,u,y,x,v),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function Yv(n,t,e,i,a,s,o,r){let l;if(t.side===Fn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===Qi,r),l===null)return null;Xo.copy(r),Xo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Xo);return c<e.near||c>e.far?null:{distance:c,point:Xo.clone(),object:n}}function Wo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Bo),n.getVertexPosition(l,Ho),n.getVertexPosition(c,Go);const h=Yv(n,t,e,i,Bo,Ho,Go,ou);if(h){const u=new W;Wn.getBarycoord(ou,Bo,Ho,Go,u),a&&(h.uv=Wn.getInterpolatedAttribute(a,r,l,c,u,new Wt)),s&&(h.uv1=Wn.getInterpolatedAttribute(s,r,l,c,u,new Wt)),o&&(h.normal=Wn.getInterpolatedAttribute(o,r,l,c,u,new W),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:l,c,normal:new W,materialIndex:0};Wn.getNormal(Bo,Ho,Go,d.normal),h.face=d,h.barycoord=u}return h}class li extends nn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(u,2));function m(_,g,p,y,x,v,w,S,E,T,b){const M=v/E,R=w/T,F=v/2,z=w/2,H=S/2,L=E+1,I=T+1;let Y=0,G=0;const q=new W;for(let st=0;st<I;st++){const gt=st*R-z;for(let dt=0;dt<L;dt++){const ft=dt*M-F;q[_]=ft*y,q[g]=gt*x,q[p]=H,c.push(q.x,q.y,q.z),q[_]=0,q[g]=0,q[p]=S>0?1:-1,h.push(q.x,q.y,q.z),u.push(dt/E),u.push(1-st/T),Y+=1}}for(let st=0;st<T;st++)for(let gt=0;gt<E;gt++){const dt=d+gt+L*st,ft=d+gt+L*(st+1),it=d+(gt+1)+L*(st+1),j=d+(gt+1)+L*st;l.push(dt,ft,j),l.push(ft,it,j),G+=6}r.addGroup(f,G,b),f+=G,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new li(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function bs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Pn(n){const t={};for(let e=0;e<n.length;e++){const i=bs(n[e]);for(const a in i)t[a]=i[a]}return t}function $v(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function np(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:_e.workingColorSpace}const Zv={clone:bs,merge:Pn};var qv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ta extends Aa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qv,this.fragmentShader=jv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=bs(t.uniforms),this.uniformsGroups=$v(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class ip extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=zi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yi=new W,ru=new Wt,cu=new Wt;class qn extends ip{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=so*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(us*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return so*2*Math.atan(Math.tan(us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z)}getViewSize(t,e){return this.getViewBounds(t,ru,cu),e.subVectors(cu,ru)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(us*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ja=-90,Qa=1;class Kv extends Ze{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new qn(Ja,Qa,t,e);a.layers=this.layers,this.add(a);const s=new qn(Ja,Qa,t,e);s.layers=this.layers,this.add(s);const o=new qn(Ja,Qa,t,e);o.layers=this.layers,this.add(o);const r=new qn(Ja,Qa,t,e);r.layers=this.layers,this.add(r);const l=new qn(Ja,Qa,t,e);l.layers=this.layers,this.add(l);const c=new qn(Ja,Qa,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===zi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Tr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class ap extends Ln{constructor(t,e,i,a,s,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:vs,super(t,e,i,a,s,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jv extends Ea{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new ap(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new li(5,5,5),s=new ta({name:"CubemapFromEquirect",uniforms:bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fn,blending:Ki});s.uniforms.tEquirect.value=e;const o=new fe(a,s),r=e.minFilter;return e.minFilter===Ma&&(e.minFilter=vi),new Kv(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const kc=new W,Qv=new W,ty=new le;class ma{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=kc.subVectors(i,e).cross(Qv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(kc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||ty.getNormalMatrix(t),a=this.coplanarPoint(kc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const la=new Or,Yo=new W;class bh{constructor(t=new ma,e=new ma,i=new ma,a=new ma,s=new ma,o=new ma){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=zi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],h=a[5],u=a[6],d=a[7],f=a[8],m=a[9],_=a[10],g=a[11],p=a[12],y=a[13],x=a[14],v=a[15];if(i[0].setComponents(l-s,d-c,g-f,v-p).normalize(),i[1].setComponents(l+s,d+c,g+f,v+p).normalize(),i[2].setComponents(l+o,d+h,g+m,v+y).normalize(),i[3].setComponents(l-o,d-h,g-m,v-y).normalize(),i[4].setComponents(l-r,d-u,g-_,v-x).normalize(),e===zi)i[5].setComponents(l+r,d+u,g+_,v+x).normalize();else if(e===Tr)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),la.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),la.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(la)}intersectsSprite(t){return la.center.set(0,0,0),la.radius=.7071067811865476,la.applyMatrix4(t.matrixWorld),this.intersectsSphere(la)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(Yo.x=a.normal.x>0?t.max.x:t.min.x,Yo.y=a.normal.y>0?t.max.y:t.min.y,Yo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(Yo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sp(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function ey(n){const t=new WeakMap;function e(r,l){const c=r.array,h=r.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),r.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,r),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){const m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){const _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class Zn extends nn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,h=l+1,u=t/r,d=e/l,f=[],m=[],_=[],g=[];for(let p=0;p<h;p++){const y=p*d-o;for(let x=0;x<c;x++){const v=x*u-s;m.push(v,-y,0),_.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),S=y+1+c*p;f.push(x,v,S),f.push(v,w,S)}this.setIndex(f),this.setAttribute("position",new Se(m,3)),this.setAttribute("normal",new Se(_,3)),this.setAttribute("uv",new Se(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.width,t.height,t.widthSegments,t.heightSegments)}}var ny=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iy=`#ifdef USE_ALPHAHASH
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
#endif`,ay=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,oy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ry=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cy=`#ifdef USE_AOMAP
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
#endif`,ly=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hy=`#ifdef USE_BATCHING
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
#endif`,dy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,uy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,py=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,my=`#ifdef USE_IRIDESCENCE
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
#endif`,gy=`#ifdef USE_BUMPMAP
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
#endif`,xy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_y=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,My=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,by=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Sy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ey=`#define PI 3.141592653589793
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
} // validated`,Ty=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ay=`vec3 transformedNormal = objectNormal;
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
#endif`,Ry=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Py=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ly=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ky=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Iy=`#ifdef USE_ENVMAP
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
#endif`,zy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fy=`#ifdef USE_ENVMAP
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
#endif`,Uy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ny=`#ifdef USE_ENVMAP
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
#endif`,Oy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,By=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vy=`#ifdef USE_GRADIENTMAP
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
}`,Xy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$y=`uniform bool receiveShadow;
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
#endif`,Zy=`#ifdef USE_ENVMAP
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
#endif`,qy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ky=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Jy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qy=`PhysicalMaterial material;
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
#endif`,t_=`struct PhysicalMaterial {
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
}`,e_=`
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
#endif`,n_=`#if defined( RE_IndirectDiffuse )
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
#endif`,i_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,a_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,s_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,r_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,c_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,l_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,h_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,d_=`#if defined( USE_POINTS_UV )
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
#endif`,u_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,f_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,p_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,m_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,g_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x_=`#ifdef USE_MORPHTARGETS
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
#endif`,v_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,y_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,__=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,M_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,b_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,S_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,w_=`#ifdef USE_NORMALMAP
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
#endif`,E_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,A_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,R_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,P_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,C_=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,L_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,D_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,k_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,I_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,z_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,F_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,U_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,N_=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,O_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,B_=`float getShadowMask() {
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
}`,H_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,G_=`#ifdef USE_SKINNING
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
#endif`,V_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,X_=`#ifdef USE_SKINNING
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
#endif`,W_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Y_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Z_=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,q_=`#ifdef USE_TRANSMISSION
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
#endif`,j_=`#ifdef USE_TRANSMISSION
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
#endif`,K_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Q_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nM=`uniform sampler2D t2D;
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
}`,iM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,sM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rM=`#include <common>
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
}`,cM=`#if DEPTH_PACKING == 3200
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
}`,lM=`#define DISTANCE
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
}`,hM=`#define DISTANCE
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
}`,dM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fM=`uniform float scale;
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
}`,pM=`uniform vec3 diffuse;
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
}`,mM=`#include <common>
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
}`,gM=`uniform vec3 diffuse;
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
}`,xM=`#define LAMBERT
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
}`,vM=`#define LAMBERT
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
}`,yM=`#define MATCAP
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
}`,_M=`#define MATCAP
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
}`,MM=`#define NORMAL
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
}`,bM=`#define NORMAL
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
}`,SM=`#define PHONG
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
}`,wM=`#define PHONG
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
}`,EM=`#define STANDARD
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
}`,TM=`#define STANDARD
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
}`,AM=`#define TOON
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
}`,RM=`#define TOON
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
}`,PM=`uniform float size;
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
}`,CM=`uniform vec3 diffuse;
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
}`,LM=`#include <common>
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
}`,DM=`uniform vec3 color;
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
}`,kM=`uniform float rotation;
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
}`,IM=`uniform vec3 diffuse;
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
}`,he={alphahash_fragment:ny,alphahash_pars_fragment:iy,alphamap_fragment:ay,alphamap_pars_fragment:sy,alphatest_fragment:oy,alphatest_pars_fragment:ry,aomap_fragment:cy,aomap_pars_fragment:ly,batching_pars_vertex:hy,batching_vertex:dy,begin_vertex:uy,beginnormal_vertex:fy,bsdfs:py,iridescence_fragment:my,bumpmap_pars_fragment:gy,clipping_planes_fragment:xy,clipping_planes_pars_fragment:vy,clipping_planes_pars_vertex:yy,clipping_planes_vertex:_y,color_fragment:My,color_pars_fragment:by,color_pars_vertex:Sy,color_vertex:wy,common:Ey,cube_uv_reflection_fragment:Ty,defaultnormal_vertex:Ay,displacementmap_pars_vertex:Ry,displacementmap_vertex:Py,emissivemap_fragment:Cy,emissivemap_pars_fragment:Ly,colorspace_fragment:Dy,colorspace_pars_fragment:ky,envmap_fragment:Iy,envmap_common_pars_fragment:zy,envmap_pars_fragment:Fy,envmap_pars_vertex:Uy,envmap_physical_pars_fragment:Zy,envmap_vertex:Ny,fog_vertex:Oy,fog_pars_vertex:By,fog_fragment:Hy,fog_pars_fragment:Gy,gradientmap_pars_fragment:Vy,lightmap_pars_fragment:Xy,lights_lambert_fragment:Wy,lights_lambert_pars_fragment:Yy,lights_pars_begin:$y,lights_toon_fragment:qy,lights_toon_pars_fragment:jy,lights_phong_fragment:Ky,lights_phong_pars_fragment:Jy,lights_physical_fragment:Qy,lights_physical_pars_fragment:t_,lights_fragment_begin:e_,lights_fragment_maps:n_,lights_fragment_end:i_,logdepthbuf_fragment:a_,logdepthbuf_pars_fragment:s_,logdepthbuf_pars_vertex:o_,logdepthbuf_vertex:r_,map_fragment:c_,map_pars_fragment:l_,map_particle_fragment:h_,map_particle_pars_fragment:d_,metalnessmap_fragment:u_,metalnessmap_pars_fragment:f_,morphinstance_vertex:p_,morphcolor_vertex:m_,morphnormal_vertex:g_,morphtarget_pars_vertex:x_,morphtarget_vertex:v_,normal_fragment_begin:y_,normal_fragment_maps:__,normal_pars_fragment:M_,normal_pars_vertex:b_,normal_vertex:S_,normalmap_pars_fragment:w_,clearcoat_normal_fragment_begin:E_,clearcoat_normal_fragment_maps:T_,clearcoat_pars_fragment:A_,iridescence_pars_fragment:R_,opaque_fragment:P_,packing:C_,premultiplied_alpha_fragment:L_,project_vertex:D_,dithering_fragment:k_,dithering_pars_fragment:I_,roughnessmap_fragment:z_,roughnessmap_pars_fragment:F_,shadowmap_pars_fragment:U_,shadowmap_pars_vertex:N_,shadowmap_vertex:O_,shadowmask_pars_fragment:B_,skinbase_vertex:H_,skinning_pars_vertex:G_,skinning_vertex:V_,skinnormal_vertex:X_,specularmap_fragment:W_,specularmap_pars_fragment:Y_,tonemapping_fragment:$_,tonemapping_pars_fragment:Z_,transmission_fragment:q_,transmission_pars_fragment:j_,uv_pars_fragment:K_,uv_pars_vertex:J_,uv_vertex:Q_,worldpos_vertex:tM,background_vert:eM,background_frag:nM,backgroundCube_vert:iM,backgroundCube_frag:aM,cube_vert:sM,cube_frag:oM,depth_vert:rM,depth_frag:cM,distanceRGBA_vert:lM,distanceRGBA_frag:hM,equirect_vert:dM,equirect_frag:uM,linedashed_vert:fM,linedashed_frag:pM,meshbasic_vert:mM,meshbasic_frag:gM,meshlambert_vert:xM,meshlambert_frag:vM,meshmatcap_vert:yM,meshmatcap_frag:_M,meshnormal_vert:MM,meshnormal_frag:bM,meshphong_vert:SM,meshphong_frag:wM,meshphysical_vert:EM,meshphysical_frag:TM,meshtoon_vert:AM,meshtoon_frag:RM,points_vert:PM,points_frag:CM,shadow_vert:LM,shadow_frag:DM,sprite_vert:kM,sprite_frag:IM},Gt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},xi={basic:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:Pn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:Pn([Gt.common,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.roughnessmap,Gt.metalnessmap,Gt.fog,Gt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:Pn([Gt.common,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.gradientmap,Gt.fog,Gt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:Pn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:Pn([Gt.points,Gt.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:Pn([Gt.common,Gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:Pn([Gt.common,Gt.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:Pn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:Pn([Gt.sprite,Gt.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distanceRGBA:{uniforms:Pn([Gt.common,Gt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distanceRGBA_vert,fragmentShader:he.distanceRGBA_frag},shadow:{uniforms:Pn([Gt.lights,Gt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};xi.physical={uniforms:Pn([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};const $o={r:0,b:0,g:0},ha=new Mi,zM=new Oe;function FM(n,t,e,i,a,s,o){const r=new Qt(0);let l=s===!0?0:1,c,h,u=null,d=0,f=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function _(y){let x=!1;const v=m(y);v===null?p(r,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===Ur)?(h===void 0&&(h=new fe(new li(1,1,1),new ta({name:"BackgroundCubeMaterial",uniforms:bs(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),ha.copy(x.backgroundRotation),ha.x*=-1,ha.y*=-1,ha.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(ha.y*=-1,ha.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(zM.makeRotationFromEuler(ha)),h.material.toneMapped=_e.getTransfer(v.colorSpace)!==Ce,(u!==v||d!==v.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new fe(new Zn(2,2),new ta({name:"BackgroundMaterial",uniforms:bs(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:Qi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=_e.getTransfer(v.colorSpace)!==Ce,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB($o,np(n)),i.buffers.color.setClear($o.r,$o.g,$o.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(r,l)},render:_,addToRenderList:g}}function UM(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=d(null);let s=a,o=!1;function r(M,R,F,z,H){let L=!1;const I=u(z,F,R);s!==I&&(s=I,c(s.object)),L=f(M,z,F,H),L&&m(M,z,F,H),H!==null&&t.update(H,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,v(M,R,F,z),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,R,F){const z=F.wireframe===!0;let H=i[M.id];H===void 0&&(H={},i[M.id]=H);let L=H[R.id];L===void 0&&(L={},H[R.id]=L);let I=L[z];return I===void 0&&(I=d(l()),L[z]=I),I}function d(M){const R=[],F=[],z=[];for(let H=0;H<e;H++)R[H]=0,F[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:F,attributeDivisors:z,object:M,attributes:{},index:null}}function f(M,R,F,z){const H=s.attributes,L=R.attributes;let I=0;const Y=F.getAttributes();for(const G in Y)if(Y[G].location>=0){const st=H[G];let gt=L[G];if(gt===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(gt=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(gt=M.instanceColor)),st===void 0||st.attribute!==gt||gt&&st.data!==gt.data)return!0;I++}return s.attributesNum!==I||s.index!==z}function m(M,R,F,z){const H={},L=R.attributes;let I=0;const Y=F.getAttributes();for(const G in Y)if(Y[G].location>=0){let st=L[G];st===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(st=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(st=M.instanceColor));const gt={};gt.attribute=st,st&&st.data&&(gt.data=st.data),H[G]=gt,I++}s.attributes=H,s.attributesNum=I,s.index=z}function _(){const M=s.newAttributes;for(let R=0,F=M.length;R<F;R++)M[R]=0}function g(M){p(M,0)}function p(M,R){const F=s.newAttributes,z=s.enabledAttributes,H=s.attributeDivisors;F[M]=1,z[M]===0&&(n.enableVertexAttribArray(M),z[M]=1),H[M]!==R&&(n.vertexAttribDivisor(M,R),H[M]=R)}function y(){const M=s.newAttributes,R=s.enabledAttributes;for(let F=0,z=R.length;F<z;F++)R[F]!==M[F]&&(n.disableVertexAttribArray(F),R[F]=0)}function x(M,R,F,z,H,L,I){I===!0?n.vertexAttribIPointer(M,R,F,H,L):n.vertexAttribPointer(M,R,F,z,H,L)}function v(M,R,F,z){_();const H=z.attributes,L=F.getAttributes(),I=R.defaultAttributeValues;for(const Y in L){const G=L[Y];if(G.location>=0){let q=H[Y];if(q===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(q=M.instanceColor)),q!==void 0){const st=q.normalized,gt=q.itemSize,dt=t.get(q);if(dt===void 0)continue;const ft=dt.buffer,it=dt.type,j=dt.bytesPerElement,pt=it===n.INT||it===n.UNSIGNED_INT||q.gpuType===fh;if(q.isInterleavedBufferAttribute){const J=q.data,et=J.stride,K=q.offset;if(J.isInstancedInterleavedBuffer){for(let St=0;St<G.locationSize;St++)p(G.location+St,J.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let St=0;St<G.locationSize;St++)g(G.location+St);n.bindBuffer(n.ARRAY_BUFFER,ft);for(let St=0;St<G.locationSize;St++)x(G.location+St,gt/G.locationSize,it,st,et*j,(K+gt/G.locationSize*St)*j,pt)}else{if(q.isInstancedBufferAttribute){for(let J=0;J<G.locationSize;J++)p(G.location+J,q.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let J=0;J<G.locationSize;J++)g(G.location+J);n.bindBuffer(n.ARRAY_BUFFER,ft);for(let J=0;J<G.locationSize;J++)x(G.location+J,gt/G.locationSize,it,st,gt*j,gt/G.locationSize*J*j,pt)}}else if(I!==void 0){const st=I[Y];if(st!==void 0)switch(st.length){case 2:n.vertexAttrib2fv(G.location,st);break;case 3:n.vertexAttrib3fv(G.location,st);break;case 4:n.vertexAttrib4fv(G.location,st);break;default:n.vertexAttrib1fv(G.location,st)}}}}y()}function w(){T();for(const M in i){const R=i[M];for(const F in R){const z=R[F];for(const H in z)h(z[H].object),delete z[H];delete R[F]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const F in R){const z=R[F];for(const H in z)h(z[H].object),delete z[H];delete R[F]}delete i[M.id]}function E(M){for(const R in i){const F=i[R];if(F[M.id]===void 0)continue;const z=F[M.id];for(const H in z)h(z[H].object),delete z[H];delete F[M.id]}}function T(){b(),o=!0,s!==a&&(s=a,c(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function NM(n,t,e){let i;function a(c){i=c}function s(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function r(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,i,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,h,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_]*d[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function OM(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==ri&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const T=E===fo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Ui&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ii&&!T)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:S}}function BM(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new ma,r=new le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||a;return a=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?h(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=h(m,d,x,f);for(let w=0;w!==x;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=f+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(y,r),o.normal.toArray(g,v),g[v+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function HM(n){let t=new WeakMap;function e(o,r){return r===xl?o.mapping=vs:r===vl&&(o.mapping=ys),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===xl||r===vl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Jv(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class op extends ip{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const rs=4,lu=[.125,.215,.35,.446,.526,.582],ya=20,Ic=new op,hu=new Qt;let zc=null,Fc=0,Uc=0,Nc=!1;const ga=(1+Math.sqrt(5))/2,ts=1/ga,du=[new W(-ga,ts,0),new W(ga,ts,0),new W(-ts,0,ga),new W(ts,0,ga),new W(0,ga,-ts),new W(0,ga,ts),new W(-1,1,-1),new W(1,1,-1),new W(-1,1,1),new W(1,1,1)];class uu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){zc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Uc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(zc,Fc,Uc),this._renderer.xr.enabled=Nc,t.scissorTest=!1,Zo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===vs||t.mapping===ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),zc=this._renderer.getRenderTarget(),Fc=this._renderer.getActiveCubeFace(),Uc=this._renderer.getActiveMipmapLevel(),Nc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:vi,minFilter:vi,generateMipmaps:!1,type:fo,format:ri,colorSpace:Ss,depthBuffer:!1},a=fu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=GM(s)),this._blurMaterial=VM(s,t,e)}return a}_compileMaterial(t){const e=new fe(this._lodPlanes[0],t);this._renderer.compile(e,Ic)}_sceneToCubeUV(t,e,i,a){const r=new qn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(hu),h.toneMapping=Ji,h.autoClear=!1;const f=new en({name:"PMREM.Background",side:Fn,depthWrite:!1,depthTest:!1}),m=new fe(new li,f);let _=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(hu),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Zo(a,y*x,p>2?x:0,x,x),h.setRenderTarget(a),_&&h.render(m,r),h.render(t,r)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===vs||t.mapping===ys;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;Zo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Ic)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=du[(a-s-1)%du.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new fe(this._lodPlanes[a],c),d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*ya-1),_=s/m,g=isFinite(s)?1+Math.floor(h*_):ya;g>ya&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ya}`);const p=[];let y=0;for(let E=0;E<ya;++E){const T=E/_,b=Math.exp(-T*T/2);p.push(b),E===0?y+=b:E<g&&(y+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/y;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[a],w=3*v*(a>x-rs?a-x+rs:0),S=4*(this._cubeSize-v);Zo(e,w,S,3*v,2*v),l.setRenderTarget(e),l.render(u,Ic)}}function GM(n){const t=[],e=[],i=[];let a=n;const s=n-rs+1+lu.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-rs?l=lu[o-n+rs-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*f),x=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,T=S>2?0:-1,b=[E,T,0,E+2/3,T,0,E+2/3,T+1,0,E,T,0,E+2/3,T+1,0,E,T+1,0];y.set(b,_*m*S),x.set(d,g*m*S);const M=[S,S,S,S,S,S];v.set(M,p*m*S)}const w=new nn;w.setAttribute("position",new pn(y,_)),w.setAttribute("uv",new pn(x,g)),w.setAttribute("faceIndex",new pn(v,p)),t.push(w),a>rs&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function fu(n,t,e){const i=new Ea(n,t,e);return i.texture.mapping=Ur,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function VM(n,t,e){const i=new Float32Array(ya),a=new W(0,1,0);return new ta({name:"SphericalGaussianBlur",defines:{n:ya,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function pu(){return new ta({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sh(),fragmentShader:`

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
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function mu(){return new ta({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ki,depthTest:!1,depthWrite:!1})}function Sh(){return`

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
	`}function XM(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===xl||l===vl,h=l===vs||l===ys;if(c||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new uu(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return c&&f&&f.height>0||h&&f&&a(f)?(e===null&&(e=new uu(n)),u=c?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function WM(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&Vs("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function YM(n,t,e,i){const a={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const m in d.attributes)t.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}d.removeEventListener("dispose",o),delete a[d.id];const f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return a[d.id]===!0||(d.addEventListener("dispose",o),a[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const m in d)t.update(d[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,m=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],S=y[x+1],E=y[x+2];d.push(w,S,S,E,E,w)}}else if(m!==void 0){const y=m.array;_=m.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,S=x+1,E=x+2;d.push(w,S,S,E,E,w)}}else return;const g=new(jf(d)?ep:tp)(d,1);g.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){const d=s.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function $M(n,t,e){let i;function a(d){i=d}let s,o;function r(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),e.update(f,i,1)}function c(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,d*o,m),e.update(f,i,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(d,f,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*_[y];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ZM(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function qM(n,t,e){const i=new WeakMap,a=new Ke;function s(o,r,l){const c=o.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let M=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],y=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let w=r.attributes.position.count*v,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*u),T=new Jf(E,w,S,u);T.type=Ii,T.needsUpdate=!0;const b=v*4;for(let R=0;R<u;R++){const F=p[R],z=y[R],H=x[R],L=w*S*4*R;for(let I=0;I<F.count;I++){const Y=I*b;m===!0&&(a.fromBufferAttribute(F,I),E[L+Y+0]=a.x,E[L+Y+1]=a.y,E[L+Y+2]=a.z,E[L+Y+3]=0),_===!0&&(a.fromBufferAttribute(z,I),E[L+Y+4]=a.x,E[L+Y+5]=a.y,E[L+Y+6]=a.z,E[L+Y+7]=0),g===!0&&(a.fromBufferAttribute(H,I),E[L+Y+8]=a.x,E[L+Y+9]=a.y,E[L+Y+10]=a.z,E[L+Y+11]=H.itemSize===4?a.w:1)}}d={count:u,texture:T,size:new Wt(w,S)},i.set(r,d),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function jM(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(a.get(u)!==c&&(t.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;a.get(d)!==c&&(d.update(),a.set(d,c))}return u}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class rp extends Ln{constructor(t,e,i,a,s,o,r,l,c,h=ds){if(h!==ds&&h!==Ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===ds&&(i=wa),i===void 0&&h===Ms&&(i=_s),super(null,a,s,o,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:ci,this.minFilter=l!==void 0?l:ci,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const cp=new Ln,gu=new rp(1,1),lp=new Jf,hp=new Fv,dp=new ap,xu=[],vu=[],yu=new Float32Array(16),_u=new Float32Array(9),Mu=new Float32Array(4);function Es(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=xu[a];if(s===void 0&&(s=new Float32Array(a),xu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function rn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function cn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Br(n,t){let e=vu[t];e===void 0&&(e=new Int32Array(t),vu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function KM(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function JM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2fv(this.addr,t),cn(e,t)}}function QM(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(rn(e,t))return;n.uniform3fv(this.addr,t),cn(e,t)}}function tb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4fv(this.addr,t),cn(e,t)}}function eb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;Mu.set(i),n.uniformMatrix2fv(this.addr,!1,Mu),cn(e,i)}}function nb(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;_u.set(i),n.uniformMatrix3fv(this.addr,!1,_u),cn(e,i)}}function ib(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(rn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),cn(e,t)}else{if(rn(e,i))return;yu.set(i),n.uniformMatrix4fv(this.addr,!1,yu),cn(e,i)}}function ab(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function sb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2iv(this.addr,t),cn(e,t)}}function ob(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3iv(this.addr,t),cn(e,t)}}function rb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4iv(this.addr,t),cn(e,t)}}function cb(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function lb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(rn(e,t))return;n.uniform2uiv(this.addr,t),cn(e,t)}}function hb(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(rn(e,t))return;n.uniform3uiv(this.addr,t),cn(e,t)}}function db(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(rn(e,t))return;n.uniform4uiv(this.addr,t),cn(e,t)}}function ub(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(gu.compareFunction=qf,s=gu):s=cp,e.setTexture2D(t||s,a)}function fb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||hp,a)}function pb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||dp,a)}function mb(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||lp,a)}function gb(n){switch(n){case 5126:return KM;case 35664:return JM;case 35665:return QM;case 35666:return tb;case 35674:return eb;case 35675:return nb;case 35676:return ib;case 5124:case 35670:return ab;case 35667:case 35671:return sb;case 35668:case 35672:return ob;case 35669:case 35673:return rb;case 5125:return cb;case 36294:return lb;case 36295:return hb;case 36296:return db;case 35678:case 36198:case 36298:case 36306:case 35682:return ub;case 35679:case 36299:case 36307:return fb;case 35680:case 36300:case 36308:case 36293:return pb;case 36289:case 36303:case 36311:case 36292:return mb}}function xb(n,t){n.uniform1fv(this.addr,t)}function vb(n,t){const e=Es(t,this.size,2);n.uniform2fv(this.addr,e)}function yb(n,t){const e=Es(t,this.size,3);n.uniform3fv(this.addr,e)}function _b(n,t){const e=Es(t,this.size,4);n.uniform4fv(this.addr,e)}function Mb(n,t){const e=Es(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function bb(n,t){const e=Es(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Sb(n,t){const e=Es(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function wb(n,t){n.uniform1iv(this.addr,t)}function Eb(n,t){n.uniform2iv(this.addr,t)}function Tb(n,t){n.uniform3iv(this.addr,t)}function Ab(n,t){n.uniform4iv(this.addr,t)}function Rb(n,t){n.uniform1uiv(this.addr,t)}function Pb(n,t){n.uniform2uiv(this.addr,t)}function Cb(n,t){n.uniform3uiv(this.addr,t)}function Lb(n,t){n.uniform4uiv(this.addr,t)}function Db(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||cp,s[o])}function kb(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||hp,s[o])}function Ib(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||dp,s[o])}function zb(n,t,e){const i=this.cache,a=t.length,s=Br(e,a);rn(i,s)||(n.uniform1iv(this.addr,s),cn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||lp,s[o])}function Fb(n){switch(n){case 5126:return xb;case 35664:return vb;case 35665:return yb;case 35666:return _b;case 35674:return Mb;case 35675:return bb;case 35676:return Sb;case 5124:case 35670:return wb;case 35667:case 35671:return Eb;case 35668:case 35672:return Tb;case 35669:case 35673:return Ab;case 5125:return Rb;case 36294:return Pb;case 36295:return Cb;case 36296:return Lb;case 35678:case 36198:case 36298:case 36306:case 35682:return Db;case 35679:case 36299:case 36307:return kb;case 35680:case 36300:case 36308:case 36293:return Ib;case 36289:case 36303:case 36311:case 36292:return zb}}class Ub{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=gb(e.type)}}class Nb{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fb(e.type)}}class Ob{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const Oc=/(\w+)(\])?(\[|\.)?/g;function bu(n,t){n.seq.push(t),n.map[t.id]=t}function Bb(n,t,e){const i=n.name,a=i.length;for(Oc.lastIndex=0;;){const s=Oc.exec(i),o=Oc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){bu(e,c===void 0?new Ub(r,n,t):new Nb(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new Ob(r),bu(e,u)),e=u}}}class pr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);Bb(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Su(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Hb=37297;let Gb=0;function Vb(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const wu=new le;function Xb(n){_e._getMatrix(wu,_e.workingColorSpace,n);const t=`mat3( ${wu.elements.map(e=>e.toFixed(4))} )`;switch(_e.getTransfer(n)){case Nr:return[t,"LinearTransferOETF"];case Ce:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Eu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+Vb(n.getShaderSource(t),o)}else return a}function Wb(n,t){const e=Xb(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Yb(n,t){let e;switch(t){case Zx:e="Linear";break;case qx:e="Reinhard";break;case jx:e="Cineon";break;case Kx:e="ACESFilmic";break;case Qx:e="AgX";break;case tv:e="Neutral";break;case Jx:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const qo=new W;function $b(){_e.getLuminanceCoefficients(qo);const n=qo.x.toFixed(4),t=qo.y.toFixed(4),e=qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Zb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xs).join(`
`)}function qb(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function jb(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function Xs(n){return n!==""}function Tu(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Au(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Kb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zl(n){return n.replace(Kb,Qb)}const Jb=new Map;function Qb(n,t){let e=he[t];if(e===void 0){const i=Jb.get(t);if(i!==void 0)e=he[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Zl(e)}const t1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ru(n){return n.replace(t1,e1)}function e1(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Pu(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function n1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===zf?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ff?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Li&&(t="SHADOWMAP_TYPE_VSM"),t}function i1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case vs:case ys:t="ENVMAP_TYPE_CUBE";break;case Ur:t="ENVMAP_TYPE_CUBE_UV";break}return t}function a1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ys:t="ENVMAP_MODE_REFRACTION";break}return t}function s1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case uh:t="ENVMAP_BLENDING_MULTIPLY";break;case Yx:t="ENVMAP_BLENDING_MIX";break;case $x:t="ENVMAP_BLENDING_ADD";break}return t}function o1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function r1(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=n1(e),c=i1(e),h=a1(e),u=s1(e),d=o1(e),f=Zb(e),m=qb(s),_=a.createProgram();let g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Xs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Xs).join(`
`),p.length>0&&(p+=`
`)):(g=[Pu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xs).join(`
`),p=[Pu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ji?"#define TONE_MAPPING":"",e.toneMapping!==Ji?he.tonemapping_pars_fragment:"",e.toneMapping!==Ji?Yb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",he.colorspace_pars_fragment,Wb("linearToOutputTexel",e.outputColorSpace),$b(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xs).join(`
`)),o=Zl(o),o=Tu(o,e),o=Au(o,e),r=Zl(r),r=Tu(r,e),r=Au(r,e),o=Ru(o),r=Ru(r),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Bd?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+g+o,v=y+p+r,w=Su(a,a.VERTEX_SHADER,x),S=Su(a,a.FRAGMENT_SHADER,v);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function E(R){if(n.debug.checkShaderErrors){const F=a.getProgramInfoLog(_).trim(),z=a.getShaderInfoLog(w).trim(),H=a.getShaderInfoLog(S).trim();let L=!0,I=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const Y=Eu(a,w,"vertex"),G=Eu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+Y+`
`+G)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(z===""||H==="")&&(I=!1);I&&(R.diagnostics={runnable:L,programLog:F,vertexShader:{log:z,prefix:g},fragmentShader:{log:H,prefix:p}})}a.deleteShader(w),a.deleteShader(S),T=new pr(a,_),b=jb(a,_)}let T;this.getUniforms=function(){return T===void 0&&E(this),T};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,Hb)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gb++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let c1=0;class l1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new h1(t),e.set(t,i)),i}}class h1{constructor(t){this.id=c1++,this.code=t,this.usedTimes=0}}function d1(n,t,e,i,a,s,o){const r=new Mh,l=new l1,c=new Set,h=[],u=a.logarithmicDepthBuffer,d=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,R,F,z){const H=F.fog,L=z.geometry,I=b.isMeshStandardMaterial?F.environment:null,Y=(b.isMeshStandardMaterial?e:t).get(b.envMap||I),G=Y&&Y.mapping===Ur?Y.image.height:null,q=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const st=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,gt=st!==void 0?st.length:0;let dt=0;L.morphAttributes.position!==void 0&&(dt=1),L.morphAttributes.normal!==void 0&&(dt=2),L.morphAttributes.color!==void 0&&(dt=3);let ft,it,j,pt;if(q){const te=xi[q];ft=te.vertexShader,it=te.fragmentShader}else ft=b.vertexShader,it=b.fragmentShader,l.update(b),j=l.getVertexShaderID(b),pt=l.getFragmentShaderID(b);const J=n.getRenderTarget(),et=n.state.buffers.depth.getReversed(),K=z.isInstancedMesh===!0,St=z.isBatchedMesh===!0,kt=!!b.map,Lt=!!b.matcap,bt=!!Y,V=!!b.aoMap,ne=!!b.lightMap,Mt=!!b.bumpMap,Nt=!!b.normalMap,Dt=!!b.displacementMap,It=!!b.emissiveMap,Rt=!!b.metalnessMap,k=!!b.roughnessMap,A=b.anisotropy>0,$=b.clearcoat>0,ot=b.dispersion>0,tt=b.iridescence>0,rt=b.sheen>0,zt=b.transmission>0,Q=A&&!!b.anisotropyMap,_t=$&&!!b.clearcoatMap,Ft=$&&!!b.clearcoatNormalMap,at=$&&!!b.clearcoatRoughnessMap,vt=tt&&!!b.iridescenceMap,X=tt&&!!b.iridescenceThicknessMap,ct=rt&&!!b.sheenColorMap,xt=rt&&!!b.sheenRoughnessMap,Vt=!!b.specularMap,Bt=!!b.specularColorMap,Yt=!!b.specularIntensityMap,B=zt&&!!b.transmissionMap,Et=zt&&!!b.thicknessMap,nt=!!b.gradientMap,lt=!!b.alphaMap,Pt=b.alphaTest>0,Tt=!!b.alphaHash,Kt=!!b.extensions;let ee=Ji;b.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(ee=n.toneMapping);const ce={shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:ft,fragmentShader:it,defines:b.defines,customVertexShaderID:j,customFragmentShaderID:pt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:St,batchingColor:St&&z._colorsTexture!==null,instancing:K,instancingColor:K&&z.instanceColor!==null,instancingMorph:K&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Ss,alphaToCoverage:!!b.alphaToCoverage,map:kt,matcap:Lt,envMap:bt,envMapMode:bt&&Y.mapping,envMapCubeUVHeight:G,aoMap:V,lightMap:ne,bumpMap:Mt,normalMap:Nt,displacementMap:d&&Dt,emissiveMap:It,normalMapObjectSpace:Nt&&b.normalMapType===av,normalMapTangentSpace:Nt&&b.normalMapType===Zf,metalnessMap:Rt,roughnessMap:k,anisotropy:A,anisotropyMap:Q,clearcoat:$,clearcoatMap:_t,clearcoatNormalMap:Ft,clearcoatRoughnessMap:at,dispersion:ot,iridescence:tt,iridescenceMap:vt,iridescenceThicknessMap:X,sheen:rt,sheenColorMap:ct,sheenRoughnessMap:xt,specularMap:Vt,specularColorMap:Bt,specularIntensityMap:Yt,transmission:zt,transmissionMap:B,thicknessMap:Et,gradientMap:nt,opaque:b.transparent===!1&&b.blending===hs&&b.alphaToCoverage===!1,alphaMap:lt,alphaTest:Pt,alphaHash:Tt,combine:b.combine,mapUv:kt&&_(b.map.channel),aoMapUv:V&&_(b.aoMap.channel),lightMapUv:ne&&_(b.lightMap.channel),bumpMapUv:Mt&&_(b.bumpMap.channel),normalMapUv:Nt&&_(b.normalMap.channel),displacementMapUv:Dt&&_(b.displacementMap.channel),emissiveMapUv:It&&_(b.emissiveMap.channel),metalnessMapUv:Rt&&_(b.metalnessMap.channel),roughnessMapUv:k&&_(b.roughnessMap.channel),anisotropyMapUv:Q&&_(b.anisotropyMap.channel),clearcoatMapUv:_t&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:X&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:xt&&_(b.sheenRoughnessMap.channel),specularMapUv:Vt&&_(b.specularMap.channel),specularColorMapUv:Bt&&_(b.specularColorMap.channel),specularIntensityMapUv:Yt&&_(b.specularIntensityMap.channel),transmissionMapUv:B&&_(b.transmissionMap.channel),thicknessMapUv:Et&&_(b.thicknessMap.channel),alphaMapUv:lt&&_(b.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(Nt||A),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!L.attributes.uv&&(kt||lt),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:et,skinning:z.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:dt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,decodeVideoTexture:kt&&b.map.isVideoTexture===!0&&_e.getTransfer(b.map.colorSpace)===Ce,decodeVideoTextureEmissive:It&&b.emissiveMap.isVideoTexture===!0&&_e.getTransfer(b.emissiveMap.colorSpace)===Ce,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ve,flipSided:b.side===Fn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Kt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Kt&&b.extensions.multiDraw===!0||St)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(y(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function y(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const M=m[b.type];let R;if(M){const F=xi[M];R=Zv.clone(F.uniforms)}else R=b.uniforms;return R}function w(b,M){let R;for(let F=0,z=h.length;F<z;F++){const H=h[F];if(H.cacheKey===M){R=H,++R.usedTimes;break}}return R===void 0&&(R=new r1(n,M,b,s),h.push(R)),R}function S(b){if(--b.usedTimes===0){const M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function E(b){l.remove(b)}function T(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:T}}function u1(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function f1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Cu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Lu(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,d,f,m,_,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),t++,p}function r(u,d,f,m,_,g){const p=o(u,d,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function l(u,d,f,m,_,g){const p=o(u,d,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||f1),i.length>1&&i.sort(d||Cu),a.length>1&&a.sort(d||Cu)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:h,sort:c}}function p1(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new Lu,n.set(i,[o])):a>=s.length?(o=new Lu,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function m1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Qt};break;case"SpotLight":e={position:new W,direction:new W,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new W,halfWidth:new W,halfHeight:new W};break}return n[t.id]=e,e}}}function g1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let x1=0;function v1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function y1(n){const t=new m1,e=g1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new W);const a=new W,s=new Oe,o=new Oe;function r(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,y=0,x=0,v=0,w=0,S=0,E=0;c.sort(v1);for(let b=0,M=c.length;b<M;b++){const R=c[b],F=R.color,z=R.intensity,H=R.distance,L=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(R.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(R.sh.coefficients[I],z);E++}else if(R.isDirectionalLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const Y=R.shadow,G=e.get(R);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=L,i.directionalShadowMatrix[f]=R.shadow.matrix,y++}i.directional[f]=I,f++}else if(R.isSpotLight){const I=t.get(R);I.position.setFromMatrixPosition(R.matrixWorld),I.color.copy(F).multiplyScalar(z),I.distance=H,I.coneCos=Math.cos(R.angle),I.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),I.decay=R.decay,i.spot[_]=I;const Y=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,Y.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=Y.matrix,R.castShadow){const G=e.get(R);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=L,v++}_++}else if(R.isRectAreaLight){const I=t.get(R);I.color.copy(F).multiplyScalar(z),I.halfWidth.set(R.width*.5,0,0),I.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=I,g++}else if(R.isPointLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),I.distance=R.distance,I.decay=R.decay,R.castShadow){const Y=R.shadow,G=e.get(R);G.shadowIntensity=Y.intensity,G.shadowBias=Y.bias,G.shadowNormalBias=Y.normalBias,G.shadowRadius=Y.radius,G.shadowMapSize=Y.mapSize,G.shadowCameraNear=Y.camera.near,G.shadowCameraFar=Y.camera.far,i.pointShadow[m]=G,i.pointShadowMap[m]=L,i.pointShadowMatrix[m]=R.shadow.matrix,x++}i.point[m]=I,m++}else if(R.isHemisphereLight){const I=t.get(R);I.skyColor.copy(R.color).multiplyScalar(z),I.groundColor.copy(R.groundColor).multiplyScalar(z),i.hemi[p]=I,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Gt.LTC_FLOAT_1,i.rectAreaLTC2=Gt.LTC_FLOAT_2):(i.rectAreaLTC1=Gt.LTC_HALF_1,i.rectAreaLTC2=Gt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==f||T.pointLength!==m||T.spotLength!==_||T.rectAreaLength!==g||T.hemiLength!==p||T.numDirectionalShadows!==y||T.numPointShadows!==x||T.numSpotShadows!==v||T.numSpotMaps!==w||T.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,T.directionalLength=f,T.pointLength=m,T.spotLength=_,T.rectAreaLength=g,T.hemiLength=p,T.numDirectionalShadows=y,T.numPointShadows=x,T.numSpotShadows=v,T.numSpotMaps=w,T.numLightProbes=E,i.version=x1++)}function l(c,h){let u=0,d=0,f=0,m=0,_=0;const g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),u++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(a),v.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function Du(n){const t=new y1(n),e=[],i=[];function a(h){c.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function o(h){i.push(h)}function r(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function _1(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Du(n),t.set(a,[r])):s>=o.length?(r=new Du(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class M1 extends Aa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=nv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class b1 extends Aa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const S1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,w1=`uniform sampler2D shadow_pass;
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
}`;function E1(n,t,e){let i=new bh;const a=new Wt,s=new Wt,o=new Ke,r=new M1({depthPacking:iv}),l=new b1,c={},h=e.maxTextureSize,u={[Qi]:Fn,[Fn]:Qi,[Ve]:Ve},d=new ta({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:S1,fragmentShader:w1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new nn;m.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new fe(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zf;let p=this.type;this.render=function(S,E,T){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Ki),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Li&&this.type===Li,H=p===Li&&this.type!==Li;for(let L=0,I=S.length;L<I;L++){const Y=S[L],G=Y.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;a.copy(G.mapSize);const q=G.getFrameExtents();if(a.multiply(q),s.copy(G.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(s.x=Math.floor(h/q.x),a.x=s.x*q.x,G.mapSize.x=s.x),a.y>h&&(s.y=Math.floor(h/q.y),a.y=s.y*q.y,G.mapSize.y=s.y)),G.map===null||z===!0||H===!0){const gt=this.type!==Li?{minFilter:ci,magFilter:ci}:{};G.map!==null&&G.map.dispose(),G.map=new Ea(a.x,a.y,gt),G.map.texture.name=Y.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const st=G.getViewportCount();for(let gt=0;gt<st;gt++){const dt=G.getViewport(gt);o.set(s.x*dt.x,s.y*dt.y,s.x*dt.z,s.y*dt.w),F.viewport(o),G.updateMatrices(Y,gt),i=G.getFrustum(),v(E,T,G.camera,Y,this.type)}G.isPointLightShadow!==!0&&this.type===Li&&y(G,T),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,R)};function y(S,E){const T=t.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ea(a.x,a.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,T,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,T,f,_,null)}function x(S,E,T,b){let M=null;const R=T.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=T.isPointLight===!0?l:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const F=M.uuid,z=E.uuid;let H=c[F];H===void 0&&(H={},c[F]=H);let L=H[z];L===void 0&&(L=M.clone(),H[z]=L,E.addEventListener("dispose",w)),M=L}if(M.visible=E.visible,M.wireframe=E.wireframe,b===Li?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,T.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=T}return M}function v(S,E,T,b,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Li)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,S.matrixWorld);const z=t.update(S),H=S.material;if(Array.isArray(H)){const L=z.groups;for(let I=0,Y=L.length;I<Y;I++){const G=L[I],q=H[G.materialIndex];if(q&&q.visible){const st=x(S,q,b,M);S.onBeforeShadow(n,S,E,T,z,st,G),n.renderBufferDirect(T,null,z,st,S,G),S.onAfterShadow(n,S,E,T,z,st,G)}}}else if(H.visible){const L=x(S,H,b,M);S.onBeforeShadow(n,S,E,T,z,L,null),n.renderBufferDirect(T,null,z,L,S,null),S.onAfterShadow(n,S,E,T,z,L,null)}}const F=S.children;for(let z=0,H=F.length;z<H;z++)v(F[z],E,T,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const T in c){const b=c[T],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const T1={[hl]:dl,[ul]:ml,[fl]:gl,[xs]:pl,[dl]:hl,[ml]:ul,[gl]:fl,[pl]:xs};function A1(n,t){function e(){let B=!1;const Et=new Ke;let nt=null;const lt=new Ke(0,0,0,0);return{setMask:function(Pt){nt!==Pt&&!B&&(n.colorMask(Pt,Pt,Pt,Pt),nt=Pt)},setLocked:function(Pt){B=Pt},setClear:function(Pt,Tt,Kt,ee,ce){ce===!0&&(Pt*=ee,Tt*=ee,Kt*=ee),Et.set(Pt,Tt,Kt,ee),lt.equals(Et)===!1&&(n.clearColor(Pt,Tt,Kt,ee),lt.copy(Et))},reset:function(){B=!1,nt=null,lt.set(-1,0,0,0)}}}function i(){let B=!1,Et=!1,nt=null,lt=null,Pt=null;return{setReversed:function(Tt){if(Et!==Tt){const Kt=t.get("EXT_clip_control");Et?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT);const ee=Pt;Pt=null,this.setClear(ee)}Et=Tt},getReversed:function(){return Et},setTest:function(Tt){Tt?J(n.DEPTH_TEST):et(n.DEPTH_TEST)},setMask:function(Tt){nt!==Tt&&!B&&(n.depthMask(Tt),nt=Tt)},setFunc:function(Tt){if(Et&&(Tt=T1[Tt]),lt!==Tt){switch(Tt){case hl:n.depthFunc(n.NEVER);break;case dl:n.depthFunc(n.ALWAYS);break;case ul:n.depthFunc(n.LESS);break;case xs:n.depthFunc(n.LEQUAL);break;case fl:n.depthFunc(n.EQUAL);break;case pl:n.depthFunc(n.GEQUAL);break;case ml:n.depthFunc(n.GREATER);break;case gl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=Tt}},setLocked:function(Tt){B=Tt},setClear:function(Tt){Pt!==Tt&&(Et&&(Tt=1-Tt),n.clearDepth(Tt),Pt=Tt)},reset:function(){B=!1,nt=null,lt=null,Pt=null,Et=!1}}}function a(){let B=!1,Et=null,nt=null,lt=null,Pt=null,Tt=null,Kt=null,ee=null,ce=null;return{setTest:function(te){B||(te?J(n.STENCIL_TEST):et(n.STENCIL_TEST))},setMask:function(te){Et!==te&&!B&&(n.stencilMask(te),Et=te)},setFunc:function(te,we,be){(nt!==te||lt!==we||Pt!==be)&&(n.stencilFunc(te,we,be),nt=te,lt=we,Pt=be)},setOp:function(te,we,be){(Tt!==te||Kt!==we||ee!==be)&&(n.stencilOp(te,we,be),Tt=te,Kt=we,ee=be)},setLocked:function(te){B=te},setClear:function(te){ce!==te&&(n.clearStencil(te),ce=te)},reset:function(){B=!1,Et=null,nt=null,lt=null,Pt=null,Tt=null,Kt=null,ee=null,ce=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new Qt(0,0,0),T=0,b=!1,M=null,R=null,F=null,z=null,H=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,Y=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(G)[1]),I=Y>=1):G.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),I=Y>=2);let q=null,st={};const gt=n.getParameter(n.SCISSOR_BOX),dt=n.getParameter(n.VIEWPORT),ft=new Ke().fromArray(gt),it=new Ke().fromArray(dt);function j(B,Et,nt,lt){const Pt=new Uint8Array(4),Tt=n.createTexture();n.bindTexture(B,Tt),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Kt=0;Kt<nt;Kt++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(Et,0,n.RGBA,1,1,lt,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(Et+Kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return Tt}const pt={};pt[n.TEXTURE_2D]=j(n.TEXTURE_2D,n.TEXTURE_2D,1),pt[n.TEXTURE_CUBE_MAP]=j(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pt[n.TEXTURE_2D_ARRAY]=j(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pt[n.TEXTURE_3D]=j(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),J(n.DEPTH_TEST),o.setFunc(xs),Mt(!1),Nt(zd),J(n.CULL_FACE),V(Ki);function J(B){h[B]!==!0&&(n.enable(B),h[B]=!0)}function et(B){h[B]!==!1&&(n.disable(B),h[B]=!1)}function K(B,Et){return u[B]!==Et?(n.bindFramebuffer(B,Et),u[B]=Et,B===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Et),B===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Et),!0):!1}function St(B,Et){let nt=f,lt=!1;if(B){nt=d.get(Et),nt===void 0&&(nt=[],d.set(Et,nt));const Pt=B.textures;if(nt.length!==Pt.length||nt[0]!==n.COLOR_ATTACHMENT0){for(let Tt=0,Kt=Pt.length;Tt<Kt;Tt++)nt[Tt]=n.COLOR_ATTACHMENT0+Tt;nt.length=Pt.length,lt=!0}}else nt[0]!==n.BACK&&(nt[0]=n.BACK,lt=!0);lt&&n.drawBuffers(nt)}function kt(B){return m!==B?(n.useProgram(B),m=B,!0):!1}const Lt={[va]:n.FUNC_ADD,[Px]:n.FUNC_SUBTRACT,[Cx]:n.FUNC_REVERSE_SUBTRACT};Lt[Lx]=n.MIN,Lt[Dx]=n.MAX;const bt={[kx]:n.ZERO,[Ix]:n.ONE,[zx]:n.SRC_COLOR,[cl]:n.SRC_ALPHA,[Hx]:n.SRC_ALPHA_SATURATE,[Ox]:n.DST_COLOR,[Ux]:n.DST_ALPHA,[Fx]:n.ONE_MINUS_SRC_COLOR,[ll]:n.ONE_MINUS_SRC_ALPHA,[Bx]:n.ONE_MINUS_DST_COLOR,[Nx]:n.ONE_MINUS_DST_ALPHA,[Gx]:n.CONSTANT_COLOR,[Vx]:n.ONE_MINUS_CONSTANT_COLOR,[Xx]:n.CONSTANT_ALPHA,[Wx]:n.ONE_MINUS_CONSTANT_ALPHA};function V(B,Et,nt,lt,Pt,Tt,Kt,ee,ce,te){if(B===Ki){_===!0&&(et(n.BLEND),_=!1);return}if(_===!1&&(J(n.BLEND),_=!0),B!==Rx){if(B!==g||te!==b){if((p!==va||v!==va)&&(n.blendEquation(n.FUNC_ADD),p=va,v=va),te)switch(B){case hs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.ONE,n.ONE);break;case Fd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ud:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case hs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Di:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Fd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ud:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}y=null,x=null,w=null,S=null,E.set(0,0,0),T=0,g=B,b=te}return}Pt=Pt||Et,Tt=Tt||nt,Kt=Kt||lt,(Et!==p||Pt!==v)&&(n.blendEquationSeparate(Lt[Et],Lt[Pt]),p=Et,v=Pt),(nt!==y||lt!==x||Tt!==w||Kt!==S)&&(n.blendFuncSeparate(bt[nt],bt[lt],bt[Tt],bt[Kt]),y=nt,x=lt,w=Tt,S=Kt),(ee.equals(E)===!1||ce!==T)&&(n.blendColor(ee.r,ee.g,ee.b,ce),E.copy(ee),T=ce),g=B,b=!1}function ne(B,Et){B.side===Ve?et(n.CULL_FACE):J(n.CULL_FACE);let nt=B.side===Fn;Et&&(nt=!nt),Mt(nt),B.blending===hs&&B.transparent===!1?V(Ki):V(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);const lt=B.stencilWrite;r.setTest(lt),lt&&(r.setMask(B.stencilWriteMask),r.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),r.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),It(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):et(n.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(B){M!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),M=B)}function Nt(B){B!==Tx?(J(n.CULL_FACE),B!==R&&(B===zd?n.cullFace(n.BACK):B===Ax?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):et(n.CULL_FACE),R=B}function Dt(B){B!==F&&(I&&n.lineWidth(B),F=B)}function It(B,Et,nt){B?(J(n.POLYGON_OFFSET_FILL),(z!==Et||H!==nt)&&(n.polygonOffset(Et,nt),z=Et,H=nt)):et(n.POLYGON_OFFSET_FILL)}function Rt(B){B?J(n.SCISSOR_TEST):et(n.SCISSOR_TEST)}function k(B){B===void 0&&(B=n.TEXTURE0+L-1),q!==B&&(n.activeTexture(B),q=B)}function A(B,Et,nt){nt===void 0&&(q===null?nt=n.TEXTURE0+L-1:nt=q);let lt=st[nt];lt===void 0&&(lt={type:void 0,texture:void 0},st[nt]=lt),(lt.type!==B||lt.texture!==Et)&&(q!==nt&&(n.activeTexture(nt),q=nt),n.bindTexture(B,Et||pt[B]),lt.type=B,lt.texture=Et)}function $(){const B=st[q];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ot(){try{n.compressedTexImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function tt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function zt(){try{n.texSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function _t(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ft(){try{n.texStorage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function at(){try{n.texStorage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function vt(){try{n.texImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function X(){try{n.texImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ct(B){ft.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),ft.copy(B))}function xt(B){it.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),it.copy(B))}function Vt(B,Et){let nt=c.get(Et);nt===void 0&&(nt=new WeakMap,c.set(Et,nt));let lt=nt.get(B);lt===void 0&&(lt=n.getUniformBlockIndex(Et,B.name),nt.set(B,lt))}function Bt(B,Et){const lt=c.get(Et).get(B);l.get(Et)!==lt&&(n.uniformBlockBinding(Et,lt,B.__bindingPointIndex),l.set(Et,lt))}function Yt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},q=null,st={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,S=null,E=new Qt(0,0,0),T=0,b=!1,M=null,R=null,F=null,z=null,H=null,ft.set(0,0,n.canvas.width,n.canvas.height),it.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:J,disable:et,bindFramebuffer:K,drawBuffers:St,useProgram:kt,setBlending:V,setMaterial:ne,setFlipSided:Mt,setCullFace:Nt,setLineWidth:Dt,setPolygonOffset:It,setScissorTest:Rt,activeTexture:k,bindTexture:A,unbindTexture:$,compressedTexImage2D:ot,compressedTexImage3D:tt,texImage2D:vt,texImage3D:X,updateUBOMapping:Vt,uniformBlockBinding:Bt,texStorage2D:Ft,texStorage3D:at,texSubImage2D:rt,texSubImage3D:zt,compressedTexSubImage2D:Q,compressedTexSubImage3D:_t,scissor:ct,viewport:xt,reset:Yt}}function ku(n,t,e,i){const a=R1(i);switch(e){case Hf:return n*t;case Vf:return n*t;case Xf:return n*t*2;case Wf:return n*t/a.components*a.byteLength;case gh:return n*t/a.components*a.byteLength;case Yf:return n*t*2/a.components*a.byteLength;case xh:return n*t*2/a.components*a.byteLength;case Gf:return n*t*3/a.components*a.byteLength;case ri:return n*t*4/a.components*a.byteLength;case vh:return n*t*4/a.components*a.byteLength;case lr:case hr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case dr:case ur:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case bl:case wl:return Math.max(n,16)*Math.max(t,8)/4;case Ml:case Sl:return Math.max(n,8)*Math.max(t,8)/2;case El:case Tl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Al:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Rl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Ll:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Dl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case kl:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Il:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case zl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Hl:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case fr:case Gl:case Vl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case $f:case Xl:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Wl:case Yl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function R1(n){switch(n){case Ui:case Nf:return{byteLength:1,components:1};case ao:case Of:case fo:return{byteLength:2,components:1};case ph:case mh:return{byteLength:2,components:4};case wa:case fh:case Ii:return{byteLength:4,components:1};case Bf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function P1(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(k,A){return f?new OffscreenCanvas(k,A):Ar("canvas")}function _(k,A,$){let ot=1;const tt=Rt(k);if((tt.width>$||tt.height>$)&&(ot=$/Math.max(tt.width,tt.height)),ot<1)if(typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&k instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&k instanceof ImageBitmap||typeof VideoFrame<"u"&&k instanceof VideoFrame){const rt=Math.floor(ot*tt.width),zt=Math.floor(ot*tt.height);u===void 0&&(u=m(rt,zt));const Q=A?m(rt,zt):u;return Q.width=rt,Q.height=zt,Q.getContext("2d").drawImage(k,0,0,rt,zt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+rt+"x"+zt+")."),Q}else return"data"in k&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),k;return k}function g(k){return k.generateMipmaps}function p(k){n.generateMipmap(k)}function y(k){return k.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:k.isWebGL3DRenderTarget?n.TEXTURE_3D:k.isWebGLArrayRenderTarget||k.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(k,A,$,ot,tt=!1){if(k!==null){if(n[k]!==void 0)return n[k];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+k+"'")}let rt=A;if(A===n.RED&&($===n.FLOAT&&(rt=n.R32F),$===n.HALF_FLOAT&&(rt=n.R16F),$===n.UNSIGNED_BYTE&&(rt=n.R8)),A===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(rt=n.R8UI),$===n.UNSIGNED_SHORT&&(rt=n.R16UI),$===n.UNSIGNED_INT&&(rt=n.R32UI),$===n.BYTE&&(rt=n.R8I),$===n.SHORT&&(rt=n.R16I),$===n.INT&&(rt=n.R32I)),A===n.RG&&($===n.FLOAT&&(rt=n.RG32F),$===n.HALF_FLOAT&&(rt=n.RG16F),$===n.UNSIGNED_BYTE&&(rt=n.RG8)),A===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(rt=n.RG8UI),$===n.UNSIGNED_SHORT&&(rt=n.RG16UI),$===n.UNSIGNED_INT&&(rt=n.RG32UI),$===n.BYTE&&(rt=n.RG8I),$===n.SHORT&&(rt=n.RG16I),$===n.INT&&(rt=n.RG32I)),A===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),$===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),$===n.UNSIGNED_INT&&(rt=n.RGB32UI),$===n.BYTE&&(rt=n.RGB8I),$===n.SHORT&&(rt=n.RGB16I),$===n.INT&&(rt=n.RGB32I)),A===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),$===n.UNSIGNED_INT&&(rt=n.RGBA32UI),$===n.BYTE&&(rt=n.RGBA8I),$===n.SHORT&&(rt=n.RGBA16I),$===n.INT&&(rt=n.RGBA32I)),A===n.RGB&&$===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),A===n.RGBA){const zt=tt?Nr:_e.getTransfer(ot);$===n.FLOAT&&(rt=n.RGBA32F),$===n.HALF_FLOAT&&(rt=n.RGBA16F),$===n.UNSIGNED_BYTE&&(rt=zt===Ce?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function v(k,A){let $;return k?A===null||A===wa||A===_s?$=n.DEPTH24_STENCIL8:A===Ii?$=n.DEPTH32F_STENCIL8:A===ao&&($=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===wa||A===_s?$=n.DEPTH_COMPONENT24:A===Ii?$=n.DEPTH_COMPONENT32F:A===ao&&($=n.DEPTH_COMPONENT16),$}function w(k,A){return g(k)===!0||k.isFramebufferTexture&&k.minFilter!==ci&&k.minFilter!==vi?Math.log2(Math.max(A.width,A.height))+1:k.mipmaps!==void 0&&k.mipmaps.length>0?k.mipmaps.length:k.isCompressedTexture&&Array.isArray(k.image)?A.mipmaps.length:1}function S(k){const A=k.target;A.removeEventListener("dispose",S),T(A),A.isVideoTexture&&h.delete(A)}function E(k){const A=k.target;A.removeEventListener("dispose",E),M(A)}function T(k){const A=i.get(k);if(A.__webglInit===void 0)return;const $=k.source,ot=d.get($);if(ot){const tt=ot[A.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&b(k),Object.keys(ot).length===0&&d.delete($)}i.remove(k)}function b(k){const A=i.get(k);n.deleteTexture(A.__webglTexture);const $=k.source,ot=d.get($);delete ot[A.__cacheKey],o.memory.textures--}function M(k){const A=i.get(k);if(k.depthTexture&&(k.depthTexture.dispose(),i.remove(k.depthTexture)),k.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(A.__webglFramebuffer[ot]))for(let tt=0;tt<A.__webglFramebuffer[ot].length;tt++)n.deleteFramebuffer(A.__webglFramebuffer[ot][tt]);else n.deleteFramebuffer(A.__webglFramebuffer[ot]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[ot])}else{if(Array.isArray(A.__webglFramebuffer))for(let ot=0;ot<A.__webglFramebuffer.length;ot++)n.deleteFramebuffer(A.__webglFramebuffer[ot]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ot=0;ot<A.__webglColorRenderbuffer.length;ot++)A.__webglColorRenderbuffer[ot]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[ot]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const $=k.textures;for(let ot=0,tt=$.length;ot<tt;ot++){const rt=i.get($[ot]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove($[ot])}i.remove(k)}let R=0;function F(){R=0}function z(){const k=R;return k>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+k+" texture units while this GPU supports only "+a.maxTextures),R+=1,k}function H(k){const A=[];return A.push(k.wrapS),A.push(k.wrapT),A.push(k.wrapR||0),A.push(k.magFilter),A.push(k.minFilter),A.push(k.anisotropy),A.push(k.internalFormat),A.push(k.format),A.push(k.type),A.push(k.generateMipmaps),A.push(k.premultiplyAlpha),A.push(k.flipY),A.push(k.unpackAlignment),A.push(k.colorSpace),A.join()}function L(k,A){const $=i.get(k);if(k.isVideoTexture&&Dt(k),k.isRenderTargetTexture===!1&&k.version>0&&$.__version!==k.version){const ot=k.image;if(ot===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ot.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{it($,k,A);return}}e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+A)}function I(k,A){const $=i.get(k);if(k.version>0&&$.__version!==k.version){it($,k,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+A)}function Y(k,A){const $=i.get(k);if(k.version>0&&$.__version!==k.version){it($,k,A);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+A)}function G(k,A){const $=i.get(k);if(k.version>0&&$.__version!==k.version){j($,k,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+A)}const q={[yl]:n.REPEAT,[_a]:n.CLAMP_TO_EDGE,[_l]:n.MIRRORED_REPEAT},st={[ci]:n.NEAREST,[ev]:n.NEAREST_MIPMAP_NEAREST,[Po]:n.NEAREST_MIPMAP_LINEAR,[vi]:n.LINEAR,[fc]:n.LINEAR_MIPMAP_NEAREST,[Ma]:n.LINEAR_MIPMAP_LINEAR},gt={[sv]:n.NEVER,[dv]:n.ALWAYS,[ov]:n.LESS,[qf]:n.LEQUAL,[rv]:n.EQUAL,[hv]:n.GEQUAL,[cv]:n.GREATER,[lv]:n.NOTEQUAL};function dt(k,A){if(A.type===Ii&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===vi||A.magFilter===fc||A.magFilter===Po||A.magFilter===Ma||A.minFilter===vi||A.minFilter===fc||A.minFilter===Po||A.minFilter===Ma)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(k,n.TEXTURE_WRAP_S,q[A.wrapS]),n.texParameteri(k,n.TEXTURE_WRAP_T,q[A.wrapT]),(k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY)&&n.texParameteri(k,n.TEXTURE_WRAP_R,q[A.wrapR]),n.texParameteri(k,n.TEXTURE_MAG_FILTER,st[A.magFilter]),n.texParameteri(k,n.TEXTURE_MIN_FILTER,st[A.minFilter]),A.compareFunction&&(n.texParameteri(k,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(k,n.TEXTURE_COMPARE_FUNC,gt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===ci||A.minFilter!==Po&&A.minFilter!==Ma||A.type===Ii&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");n.texParameterf(k,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function ft(k,A){let $=!1;k.__webglInit===void 0&&(k.__webglInit=!0,A.addEventListener("dispose",S));const ot=A.source;let tt=d.get(ot);tt===void 0&&(tt={},d.set(ot,tt));const rt=H(A);if(rt!==k.__cacheKey){tt[rt]===void 0&&(tt[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,$=!0),tt[rt].usedTimes++;const zt=tt[k.__cacheKey];zt!==void 0&&(tt[k.__cacheKey].usedTimes--,zt.usedTimes===0&&b(A)),k.__cacheKey=rt,k.__webglTexture=tt[rt].texture}return $}function it(k,A,$){let ot=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ot=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ot=n.TEXTURE_3D);const tt=ft(k,A),rt=A.source;e.bindTexture(ot,k.__webglTexture,n.TEXTURE0+$);const zt=i.get(rt);if(rt.version!==zt.__version||tt===!0){e.activeTexture(n.TEXTURE0+$);const Q=_e.getPrimaries(_e.workingColorSpace),_t=A.colorSpace===$i?null:_e.getPrimaries(A.colorSpace),Ft=A.colorSpace===$i||Q===_t?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let at=_(A.image,!1,a.maxTextureSize);at=It(A,at);const vt=s.convert(A.format,A.colorSpace),X=s.convert(A.type);let ct=x(A.internalFormat,vt,X,A.colorSpace,A.isVideoTexture);dt(ot,A);let xt;const Vt=A.mipmaps,Bt=A.isVideoTexture!==!0,Yt=zt.__version===void 0||tt===!0,B=rt.dataReady,Et=w(A,at);if(A.isDepthTexture)ct=v(A.format===Ms,A.type),Yt&&(Bt?e.texStorage2D(n.TEXTURE_2D,1,ct,at.width,at.height):e.texImage2D(n.TEXTURE_2D,0,ct,at.width,at.height,0,vt,X,null));else if(A.isDataTexture)if(Vt.length>0){Bt&&Yt&&e.texStorage2D(n.TEXTURE_2D,Et,ct,Vt[0].width,Vt[0].height);for(let nt=0,lt=Vt.length;nt<lt;nt++)xt=Vt[nt],Bt?B&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,vt,X,xt.data):e.texImage2D(n.TEXTURE_2D,nt,ct,xt.width,xt.height,0,vt,X,xt.data);A.generateMipmaps=!1}else Bt?(Yt&&e.texStorage2D(n.TEXTURE_2D,Et,ct,at.width,at.height),B&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at.width,at.height,vt,X,at.data)):e.texImage2D(n.TEXTURE_2D,0,ct,at.width,at.height,0,vt,X,at.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Bt&&Yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Et,ct,Vt[0].width,Vt[0].height,at.depth);for(let nt=0,lt=Vt.length;nt<lt;nt++)if(xt=Vt[nt],A.format!==ri)if(vt!==null)if(Bt){if(B)if(A.layerUpdates.size>0){const Pt=ku(xt.width,xt.height,A.format,A.type);for(const Tt of A.layerUpdates){const Kt=xt.data.subarray(Tt*Pt/xt.data.BYTES_PER_ELEMENT,(Tt+1)*Pt/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,Tt,xt.width,xt.height,1,vt,Kt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,xt.width,xt.height,at.depth,vt,xt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,nt,ct,xt.width,xt.height,at.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Bt?B&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,xt.width,xt.height,at.depth,vt,X,xt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,nt,ct,xt.width,xt.height,at.depth,0,vt,X,xt.data)}else{Bt&&Yt&&e.texStorage2D(n.TEXTURE_2D,Et,ct,Vt[0].width,Vt[0].height);for(let nt=0,lt=Vt.length;nt<lt;nt++)xt=Vt[nt],A.format!==ri?vt!==null?Bt?B&&e.compressedTexSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,vt,xt.data):e.compressedTexImage2D(n.TEXTURE_2D,nt,ct,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?B&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,xt.width,xt.height,vt,X,xt.data):e.texImage2D(n.TEXTURE_2D,nt,ct,xt.width,xt.height,0,vt,X,xt.data)}else if(A.isDataArrayTexture)if(Bt){if(Yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Et,ct,at.width,at.height,at.depth),B)if(A.layerUpdates.size>0){const nt=ku(at.width,at.height,A.format,A.type);for(const lt of A.layerUpdates){const Pt=at.data.subarray(lt*nt/at.data.BYTES_PER_ELEMENT,(lt+1)*nt/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,at.width,at.height,1,vt,X,Pt)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,vt,X,at.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ct,at.width,at.height,at.depth,0,vt,X,at.data);else if(A.isData3DTexture)Bt?(Yt&&e.texStorage3D(n.TEXTURE_3D,Et,ct,at.width,at.height,at.depth),B&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,vt,X,at.data)):e.texImage3D(n.TEXTURE_3D,0,ct,at.width,at.height,at.depth,0,vt,X,at.data);else if(A.isFramebufferTexture){if(Yt)if(Bt)e.texStorage2D(n.TEXTURE_2D,Et,ct,at.width,at.height);else{let nt=at.width,lt=at.height;for(let Pt=0;Pt<Et;Pt++)e.texImage2D(n.TEXTURE_2D,Pt,ct,nt,lt,0,vt,X,null),nt>>=1,lt>>=1}}else if(Vt.length>0){if(Bt&&Yt){const nt=Rt(Vt[0]);e.texStorage2D(n.TEXTURE_2D,Et,ct,nt.width,nt.height)}for(let nt=0,lt=Vt.length;nt<lt;nt++)xt=Vt[nt],Bt?B&&e.texSubImage2D(n.TEXTURE_2D,nt,0,0,vt,X,xt):e.texImage2D(n.TEXTURE_2D,nt,ct,vt,X,xt);A.generateMipmaps=!1}else if(Bt){if(Yt){const nt=Rt(at);e.texStorage2D(n.TEXTURE_2D,Et,ct,nt.width,nt.height)}B&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,vt,X,at)}else e.texImage2D(n.TEXTURE_2D,0,ct,vt,X,at);g(A)&&p(ot),zt.__version=rt.version,A.onUpdate&&A.onUpdate(A)}k.__version=A.version}function j(k,A,$){if(A.image.length!==6)return;const ot=ft(k,A),tt=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+$);const rt=i.get(tt);if(tt.version!==rt.__version||ot===!0){e.activeTexture(n.TEXTURE0+$);const zt=_e.getPrimaries(_e.workingColorSpace),Q=A.colorSpace===$i?null:_e.getPrimaries(A.colorSpace),_t=A.colorSpace===$i||zt===Q?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Ft=A.isCompressedTexture||A.image[0].isCompressedTexture,at=A.image[0]&&A.image[0].isDataTexture,vt=[];for(let lt=0;lt<6;lt++)!Ft&&!at?vt[lt]=_(A.image[lt],!0,a.maxCubemapSize):vt[lt]=at?A.image[lt].image:A.image[lt],vt[lt]=It(A,vt[lt]);const X=vt[0],ct=s.convert(A.format,A.colorSpace),xt=s.convert(A.type),Vt=x(A.internalFormat,ct,xt,A.colorSpace),Bt=A.isVideoTexture!==!0,Yt=rt.__version===void 0||ot===!0,B=tt.dataReady;let Et=w(A,X);dt(n.TEXTURE_CUBE_MAP,A);let nt;if(Ft){Bt&&Yt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Et,Vt,X.width,X.height);for(let lt=0;lt<6;lt++){nt=vt[lt].mipmaps;for(let Pt=0;Pt<nt.length;Pt++){const Tt=nt[Pt];A.format!==ri?ct!==null?Bt?B&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt,0,0,Tt.width,Tt.height,ct,Tt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt,Vt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?B&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt,0,0,Tt.width,Tt.height,ct,xt,Tt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt,Vt,Tt.width,Tt.height,0,ct,xt,Tt.data)}}}else{if(nt=A.mipmaps,Bt&&Yt){nt.length>0&&Et++;const lt=Rt(vt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Et,Vt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(at){Bt?B&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,vt[lt].width,vt[lt].height,ct,xt,vt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Vt,vt[lt].width,vt[lt].height,0,ct,xt,vt[lt].data);for(let Pt=0;Pt<nt.length;Pt++){const Kt=nt[Pt].image[lt].image;Bt?B&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt+1,0,0,Kt.width,Kt.height,ct,xt,Kt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt+1,Vt,Kt.width,Kt.height,0,ct,xt,Kt.data)}}else{Bt?B&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,ct,xt,vt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Vt,ct,xt,vt[lt]);for(let Pt=0;Pt<nt.length;Pt++){const Tt=nt[Pt];Bt?B&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt+1,0,0,ct,xt,Tt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Pt+1,Vt,ct,xt,Tt.image[lt])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),rt.__version=tt.version,A.onUpdate&&A.onUpdate(A)}k.__version=A.version}function pt(k,A,$,ot,tt,rt){const zt=s.convert($.format,$.colorSpace),Q=s.convert($.type),_t=x($.internalFormat,zt,Q,$.colorSpace),Ft=i.get(A),at=i.get($);if(at.__renderTarget=A,!Ft.__hasExternalTextures){const vt=Math.max(1,A.width>>rt),X=Math.max(1,A.height>>rt);tt===n.TEXTURE_3D||tt===n.TEXTURE_2D_ARRAY?e.texImage3D(tt,rt,_t,vt,X,A.depth,0,zt,Q,null):e.texImage2D(tt,rt,_t,vt,X,0,zt,Q,null)}e.bindFramebuffer(n.FRAMEBUFFER,k),Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ot,tt,at.__webglTexture,0,Mt(A)):(tt===n.TEXTURE_2D||tt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ot,tt,at.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function J(k,A,$){if(n.bindRenderbuffer(n.RENDERBUFFER,k),A.depthBuffer){const ot=A.depthTexture,tt=ot&&ot.isDepthTexture?ot.type:null,rt=v(A.stencilBuffer,tt),zt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=Mt(A);Nt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Q,rt,A.width,A.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,Q,rt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,rt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,zt,n.RENDERBUFFER,k)}else{const ot=A.textures;for(let tt=0;tt<ot.length;tt++){const rt=ot[tt],zt=s.convert(rt.format,rt.colorSpace),Q=s.convert(rt.type),_t=x(rt.internalFormat,zt,Q,rt.colorSpace),Ft=Mt(A);$&&Nt(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,_t,A.width,A.height):Nt(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ft,_t,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,_t,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function et(k,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,k),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ot=i.get(A.depthTexture);ot.__renderTarget=A,(!ot.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),L(A.depthTexture,0);const tt=ot.__webglTexture,rt=Mt(A);if(A.depthTexture.format===ds)Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0);else if(A.depthTexture.format===Ms)Nt(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function K(k){const A=i.get(k),$=k.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==k.depthTexture){const ot=k.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ot){const tt=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ot.removeEventListener("dispose",tt)};ot.addEventListener("dispose",tt),A.__depthDisposeCallback=tt}A.__boundDepthTexture=ot}if(k.depthTexture&&!A.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");et(A.__webglFramebuffer,k)}else if($){A.__webglDepthbuffer=[];for(let ot=0;ot<6;ot++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[ot]),A.__webglDepthbuffer[ot]===void 0)A.__webglDepthbuffer[ot]=n.createRenderbuffer(),J(A.__webglDepthbuffer[ot],k,!1);else{const tt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=A.__webglDepthbuffer[ot];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),J(A.__webglDepthbuffer,k,!1);else{const ot=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ot,n.RENDERBUFFER,tt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function St(k,A,$){const ot=i.get(k);A!==void 0&&pt(ot.__webglFramebuffer,k,k.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&K(k)}function kt(k){const A=k.texture,$=i.get(k),ot=i.get(A);k.addEventListener("dispose",E);const tt=k.textures,rt=k.isWebGLCubeRenderTarget===!0,zt=tt.length>1;if(zt||(ot.__webglTexture===void 0&&(ot.__webglTexture=n.createTexture()),ot.__version=A.version,o.memory.textures++),rt){$.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(A.mipmaps&&A.mipmaps.length>0){$.__webglFramebuffer[Q]=[];for(let _t=0;_t<A.mipmaps.length;_t++)$.__webglFramebuffer[Q][_t]=n.createFramebuffer()}else $.__webglFramebuffer[Q]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){$.__webglFramebuffer=[];for(let Q=0;Q<A.mipmaps.length;Q++)$.__webglFramebuffer[Q]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(zt)for(let Q=0,_t=tt.length;Q<_t;Q++){const Ft=i.get(tt[Q]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=n.createTexture(),o.memory.textures++)}if(k.samples>0&&Nt(k)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Q=0;Q<tt.length;Q++){const _t=tt[Q];$.__webglColorRenderbuffer[Q]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[Q]);const Ft=s.convert(_t.format,_t.colorSpace),at=s.convert(_t.type),vt=x(_t.internalFormat,Ft,at,_t.colorSpace,k.isXRRenderTarget===!0),X=Mt(k);n.renderbufferStorageMultisample(n.RENDERBUFFER,X,vt,k.width,k.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Q,n.RENDERBUFFER,$.__webglColorRenderbuffer[Q])}n.bindRenderbuffer(n.RENDERBUFFER,null),k.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),J($.__webglDepthRenderbuffer,k,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,ot.__webglTexture),dt(n.TEXTURE_CUBE_MAP,A);for(let Q=0;Q<6;Q++)if(A.mipmaps&&A.mipmaps.length>0)for(let _t=0;_t<A.mipmaps.length;_t++)pt($.__webglFramebuffer[Q][_t],k,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_t);else pt($.__webglFramebuffer[Q],k,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(zt){for(let Q=0,_t=tt.length;Q<_t;Q++){const Ft=tt[Q],at=i.get(Ft);e.bindTexture(n.TEXTURE_2D,at.__webglTexture),dt(n.TEXTURE_2D,Ft),pt($.__webglFramebuffer,k,Ft,n.COLOR_ATTACHMENT0+Q,n.TEXTURE_2D,0),g(Ft)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Q=n.TEXTURE_2D;if((k.isWebGL3DRenderTarget||k.isWebGLArrayRenderTarget)&&(Q=k.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Q,ot.__webglTexture),dt(Q,A),A.mipmaps&&A.mipmaps.length>0)for(let _t=0;_t<A.mipmaps.length;_t++)pt($.__webglFramebuffer[_t],k,A,n.COLOR_ATTACHMENT0,Q,_t);else pt($.__webglFramebuffer,k,A,n.COLOR_ATTACHMENT0,Q,0);g(A)&&p(Q),e.unbindTexture()}k.depthBuffer&&K(k)}function Lt(k){const A=k.textures;for(let $=0,ot=A.length;$<ot;$++){const tt=A[$];if(g(tt)){const rt=y(k),zt=i.get(tt).__webglTexture;e.bindTexture(rt,zt),p(rt),e.unbindTexture()}}}const bt=[],V=[];function ne(k){if(k.samples>0){if(Nt(k)===!1){const A=k.textures,$=k.width,ot=k.height;let tt=n.COLOR_BUFFER_BIT;const rt=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,zt=i.get(k),Q=A.length>1;if(Q)for(let _t=0;_t<A.length;_t++)e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,zt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglFramebuffer);for(let _t=0;_t<A.length;_t++){if(k.resolveDepthBuffer&&(k.depthBuffer&&(tt|=n.DEPTH_BUFFER_BIT),k.stencilBuffer&&k.resolveStencilBuffer&&(tt|=n.STENCIL_BUFFER_BIT)),Q){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,zt.__webglColorRenderbuffer[_t]);const Ft=i.get(A[_t]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ft,0)}n.blitFramebuffer(0,0,$,ot,0,0,$,ot,tt,n.NEAREST),l===!0&&(bt.length=0,V.length=0,bt.push(n.COLOR_ATTACHMENT0+_t),k.depthBuffer&&k.resolveDepthBuffer===!1&&(bt.push(rt),V.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,V)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,bt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Q)for(let _t=0;_t<A.length;_t++){e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.RENDERBUFFER,zt.__webglColorRenderbuffer[_t]);const Ft=i.get(A[_t]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,zt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_t,n.TEXTURE_2D,Ft,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,zt.__webglMultisampledFramebuffer)}else if(k.depthBuffer&&k.resolveDepthBuffer===!1&&l){const A=k.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Mt(k){return Math.min(a.maxSamples,k.samples)}function Nt(k){const A=i.get(k);return k.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Dt(k){const A=o.render.frame;h.get(k)!==A&&(h.set(k,A),k.update())}function It(k,A){const $=k.colorSpace,ot=k.format,tt=k.type;return k.isCompressedTexture===!0||k.isVideoTexture===!0||$!==Ss&&$!==$i&&(_e.getTransfer($)===Ce?(ot!==ri||tt!==Ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),A}function Rt(k){return typeof HTMLImageElement<"u"&&k instanceof HTMLImageElement?(c.width=k.naturalWidth||k.width,c.height=k.naturalHeight||k.height):typeof VideoFrame<"u"&&k instanceof VideoFrame?(c.width=k.displayWidth,c.height=k.displayHeight):(c.width=k.width,c.height=k.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=L,this.setTexture2DArray=I,this.setTexture3D=Y,this.setTextureCube=G,this.rebindTextures=St,this.setupRenderTarget=kt,this.updateRenderTargetMipmap=Lt,this.updateMultisampleRenderTarget=ne,this.setupDepthRenderbuffer=K,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Nt}function C1(n,t){function e(i,a=$i){let s;const o=_e.getTransfer(a);if(i===Ui)return n.UNSIGNED_BYTE;if(i===ph)return n.UNSIGNED_SHORT_4_4_4_4;if(i===mh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Bf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Nf)return n.BYTE;if(i===Of)return n.SHORT;if(i===ao)return n.UNSIGNED_SHORT;if(i===fh)return n.INT;if(i===wa)return n.UNSIGNED_INT;if(i===Ii)return n.FLOAT;if(i===fo)return n.HALF_FLOAT;if(i===Hf)return n.ALPHA;if(i===Gf)return n.RGB;if(i===ri)return n.RGBA;if(i===Vf)return n.LUMINANCE;if(i===Xf)return n.LUMINANCE_ALPHA;if(i===ds)return n.DEPTH_COMPONENT;if(i===Ms)return n.DEPTH_STENCIL;if(i===Wf)return n.RED;if(i===gh)return n.RED_INTEGER;if(i===Yf)return n.RG;if(i===xh)return n.RG_INTEGER;if(i===vh)return n.RGBA_INTEGER;if(i===lr||i===hr||i===dr||i===ur)if(o===Ce)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===lr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===dr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ur)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===lr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===hr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===dr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ur)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ml||i===bl||i===Sl||i===wl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ml)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===bl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===wl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===El||i===Tl||i===Al)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===El||i===Tl)return o===Ce?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Al)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Rl||i===Pl||i===Cl||i===Ll||i===Dl||i===kl||i===Il||i===zl||i===Fl||i===Ul||i===Nl||i===Ol||i===Bl||i===Hl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Rl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Pl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Cl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ll)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Dl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===kl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Il)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===zl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ul)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Nl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ol)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Bl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Hl)return o===Ce?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===fr||i===Gl||i===Vl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===fr)return o===Ce?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===$f||i===Xl||i===Wl||i===Yl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===fr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Xl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Yl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===_s?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class L1 extends qn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Le extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const D1={type:"move"};class Bc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(D1)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Le;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const k1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,I1=`
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

}`;class z1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Ln,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ta({vertexShader:k1,fragmentShader:I1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new fe(new Zn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class F1 extends ws{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null;const _=new z1,g=e.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new Wt;let S=null;const E=new qn;E.viewport=new Ke;const T=new qn;T.viewport=new Ke;const b=[E,T],M=new L1;let R=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(it){let j=x[it];return j===void 0&&(j=new Bc,x[it]=j),j.getTargetRaySpace()},this.getControllerGrip=function(it){let j=x[it];return j===void 0&&(j=new Bc,x[it]=j),j.getGripSpace()},this.getHand=function(it){let j=x[it];return j===void 0&&(j=new Bc,x[it]=j),j.getHandSpace()};function z(it){const j=v.indexOf(it.inputSource);if(j===-1)return;const pt=x[j];pt!==void 0&&(pt.update(it.inputSource,it.frame,c||o),pt.dispatchEvent({type:it.type,data:it.inputSource}))}function H(){a.removeEventListener("select",z),a.removeEventListener("selectstart",z),a.removeEventListener("selectend",z),a.removeEventListener("squeeze",z),a.removeEventListener("squeezestart",z),a.removeEventListener("squeezeend",z),a.removeEventListener("end",H),a.removeEventListener("inputsourceschange",L);for(let it=0;it<x.length;it++){const j=v[it];j!==null&&(v[it]=null,x[it].disconnect(j))}R=null,F=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,a=null,y=null,ft.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(it){s=it,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(it){r=it,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(it){c=it},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(it){if(a=it,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",z),a.addEventListener("selectstart",z),a.addEventListener("selectend",z),a.addEventListener("squeeze",z),a.addEventListener("squeezestart",z),a.addEventListener("squeezeend",z),a.addEventListener("end",H),a.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const j={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,j),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ea(f.framebufferWidth,f.framebufferHeight,{format:ri,type:Ui,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let j=null,pt=null,J=null;g.depth&&(J=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=g.stencil?Ms:ds,pt=g.stencil?_s:wa);const et={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:s};u=new XRWebGLBinding(a,e),d=u.createProjectionLayer(et),a.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ea(d.textureWidth,d.textureHeight,{format:ri,type:Ui,depthTexture:new rp(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),ft.setContext(a),ft.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function L(it){for(let j=0;j<it.removed.length;j++){const pt=it.removed[j],J=v.indexOf(pt);J>=0&&(v[J]=null,x[J].disconnect(pt))}for(let j=0;j<it.added.length;j++){const pt=it.added[j];let J=v.indexOf(pt);if(J===-1){for(let K=0;K<x.length;K++)if(K>=v.length){v.push(pt),J=K;break}else if(v[K]===null){v[K]=pt,J=K;break}if(J===-1)break}const et=x[J];et&&et.connect(pt)}}const I=new W,Y=new W;function G(it,j,pt){I.setFromMatrixPosition(j.matrixWorld),Y.setFromMatrixPosition(pt.matrixWorld);const J=I.distanceTo(Y),et=j.projectionMatrix.elements,K=pt.projectionMatrix.elements,St=et[14]/(et[10]-1),kt=et[14]/(et[10]+1),Lt=(et[9]+1)/et[5],bt=(et[9]-1)/et[5],V=(et[8]-1)/et[0],ne=(K[8]+1)/K[0],Mt=St*V,Nt=St*ne,Dt=J/(-V+ne),It=Dt*-V;if(j.matrixWorld.decompose(it.position,it.quaternion,it.scale),it.translateX(It),it.translateZ(Dt),it.matrixWorld.compose(it.position,it.quaternion,it.scale),it.matrixWorldInverse.copy(it.matrixWorld).invert(),et[10]===-1)it.projectionMatrix.copy(j.projectionMatrix),it.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const Rt=St+Dt,k=kt+Dt,A=Mt-It,$=Nt+(J-It),ot=Lt*kt/k*Rt,tt=bt*kt/k*Rt;it.projectionMatrix.makePerspective(A,$,ot,tt,Rt,k),it.projectionMatrixInverse.copy(it.projectionMatrix).invert()}}function q(it,j){j===null?it.matrixWorld.copy(it.matrix):it.matrixWorld.multiplyMatrices(j.matrixWorld,it.matrix),it.matrixWorldInverse.copy(it.matrixWorld).invert()}this.updateCamera=function(it){if(a===null)return;let j=it.near,pt=it.far;_.texture!==null&&(_.depthNear>0&&(j=_.depthNear),_.depthFar>0&&(pt=_.depthFar)),M.near=T.near=E.near=j,M.far=T.far=E.far=pt,(R!==M.near||F!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,F=M.far),E.layers.mask=it.layers.mask|2,T.layers.mask=it.layers.mask|4,M.layers.mask=E.layers.mask|T.layers.mask;const J=it.parent,et=M.cameras;q(M,J);for(let K=0;K<et.length;K++)q(et[K],J);et.length===2?G(M,E,T):M.projectionMatrix.copy(E.projectionMatrix),st(it,M,J)};function st(it,j,pt){pt===null?it.matrix.copy(j.matrixWorld):(it.matrix.copy(pt.matrixWorld),it.matrix.invert(),it.matrix.multiply(j.matrixWorld)),it.matrix.decompose(it.position,it.quaternion,it.scale),it.updateMatrixWorld(!0),it.projectionMatrix.copy(j.projectionMatrix),it.projectionMatrixInverse.copy(j.projectionMatrixInverse),it.isPerspectiveCamera&&(it.fov=so*2*Math.atan(1/it.projectionMatrix.elements[5]),it.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(it){l=it,d!==null&&(d.fixedFoveation=it),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=it)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let gt=null;function dt(it,j){if(h=j.getViewerPose(c||o),m=j,h!==null){const pt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let J=!1;pt.length!==M.cameras.length&&(M.cameras.length=0,J=!0);for(let K=0;K<pt.length;K++){const St=pt[K];let kt=null;if(f!==null)kt=f.getViewport(St);else{const bt=u.getViewSubImage(d,St);kt=bt.viewport,K===0&&(t.setRenderTargetTextures(y,bt.colorTexture,d.ignoreDepthValues?void 0:bt.depthStencilTexture),t.setRenderTarget(y))}let Lt=b[K];Lt===void 0&&(Lt=new qn,Lt.layers.enable(K),Lt.viewport=new Ke,b[K]=Lt),Lt.matrix.fromArray(St.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(St.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(kt.x,kt.y,kt.width,kt.height),K===0&&(M.matrix.copy(Lt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),J===!0&&M.cameras.push(Lt)}const et=a.enabledFeatures;if(et&&et.includes("depth-sensing")){const K=u.getDepthInformation(pt[0]);K&&K.isValid&&K.texture&&_.init(t,K,a.renderState)}}for(let pt=0;pt<x.length;pt++){const J=v[pt],et=x[pt];J!==null&&et!==void 0&&et.update(J,j,c||o)}gt&&gt(it,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),m=null}const ft=new sp;ft.setAnimationLoop(dt),this.setAnimationLoop=function(it){gt=it},this.dispose=function(){}}}const da=new Mi,U1=new Oe;function N1(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,np(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,y,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Fn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Fn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(g.envMap.value=x,da.copy(v),da.x*=-1,da.y*=-1,da.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(da.y*=-1,da.z*=-1),g.envMapRotation.value.setFromMatrix4(U1.makeRotationFromEuler(da)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Fn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function O1(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=a[y.id];v===void 0&&(m(y),v=h(y),a[y.id]=v,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const S=t.render.frame;s[y.id]!==S&&(d(y),s[y.id]=S)}function h(y){const x=u();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function u(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=a[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=v.length;S<E;S++){const T=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,M=T.length;b<M;b++){const R=T[b];if(f(R,S,b,w)===!0){const F=R.__offset,z=Array.isArray(R.value)?R.value:[R.value];let H=0;for(let L=0;L<z.length;L++){const I=z[L],Y=_(I);typeof I=="number"||typeof I=="boolean"?(R.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,F+H,R.__data)):I.isMatrix3?(R.__data[0]=I.elements[0],R.__data[1]=I.elements[1],R.__data[2]=I.elements[2],R.__data[3]=0,R.__data[4]=I.elements[3],R.__data[5]=I.elements[4],R.__data[6]=I.elements[5],R.__data[7]=0,R.__data[8]=I.elements[6],R.__data[9]=I.elements[7],R.__data[10]=I.elements[8],R.__data[11]=0):(I.toArray(R.__data,H),H+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,x,v,w){const S=y.value,E=x+"_"+v;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const T=w[E];if(typeof S=="number"||typeof S=="boolean"){if(T!==S)return w[E]=S,!0}else if(T.equals(S)===!1)return T.copy(S),!0}return!1}function m(y){const x=y.uniforms;let v=0;const w=16;for(let E=0,T=x.length;E<T;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,R=b.length;M<R;M++){const F=b[M],z=Array.isArray(F.value)?F.value:[F.value];for(let H=0,L=z.length;H<L;H++){const I=z[H],Y=_(I),G=v%w,q=G%Y.boundary,st=G+q;v+=q,st!==0&&w-st<Y.storage&&(v+=w-st),F.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=Y.storage}}}const S=v%w;return S>0&&(v+=w-S),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const y in a)n.deleteBuffer(a[y]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class B1{constructor(t={}){const{canvas:e=Rv(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Cn,this.toneMapping=Ji,this.toneMappingExposure=1;const v=this;let w=!1,S=0,E=0,T=null,b=-1,M=null;const R=new Ke,F=new Ke;let z=null;const H=new Qt(0);let L=0,I=e.width,Y=e.height,G=1,q=null,st=null;const gt=new Ke(0,0,I,Y),dt=new Ke(0,0,I,Y);let ft=!1;const it=new bh;let j=!1,pt=!1;const J=new Oe,et=new Oe,K=new W,St=new Ke,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Lt=!1;function bt(){return T===null?G:1}let V=i;function ne(C,P){return e.getContext(C,P)}try{const C={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dh}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),V===null){const P="webgl2";if(V=ne(P,C),V===null)throw ne(P)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Mt,Nt,Dt,It,Rt,k,A,$,ot,tt,rt,zt,Q,_t,Ft,at,vt,X,ct,xt,Vt,Bt,Yt,B;function Et(){Mt=new WM(V),Mt.init(),Bt=new C1(V,Mt),Nt=new OM(V,Mt,t,Bt),Dt=new A1(V,Mt),Nt.reverseDepthBuffer&&d&&Dt.buffers.depth.setReversed(!0),It=new ZM(V),Rt=new u1,k=new P1(V,Mt,Dt,Rt,Nt,Bt,It),A=new HM(v),$=new XM(v),ot=new ey(V),Yt=new UM(V,ot),tt=new YM(V,ot,It,Yt),rt=new jM(V,tt,ot,It),ct=new qM(V,Nt,k),at=new BM(Rt),zt=new d1(v,A,$,Mt,Nt,Yt,at),Q=new N1(v,Rt),_t=new p1,Ft=new _1(Mt),X=new FM(v,A,$,Dt,rt,f,l),vt=new E1(v,rt,Nt),B=new O1(V,It,Nt,Dt),xt=new NM(V,Mt,It),Vt=new $M(V,Mt,It),It.programs=zt.programs,v.capabilities=Nt,v.extensions=Mt,v.properties=Rt,v.renderLists=_t,v.shadowMap=vt,v.state=Dt,v.info=It}Et();const nt=new F1(v,V);this.xr=nt,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const C=Mt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Mt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(C){C!==void 0&&(G=C,this.setSize(I,Y,!1))},this.getSize=function(C){return C.set(I,Y)},this.setSize=function(C,P,N=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=C,Y=P,e.width=Math.floor(C*G),e.height=Math.floor(P*G),N===!0&&(e.style.width=C+"px",e.style.height=P+"px"),this.setViewport(0,0,C,P)},this.getDrawingBufferSize=function(C){return C.set(I*G,Y*G).floor()},this.setDrawingBufferSize=function(C,P,N){I=C,Y=P,G=N,e.width=Math.floor(C*N),e.height=Math.floor(P*N),this.setViewport(0,0,C,P)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(gt)},this.setViewport=function(C,P,N,U){C.isVector4?gt.set(C.x,C.y,C.z,C.w):gt.set(C,P,N,U),Dt.viewport(R.copy(gt).multiplyScalar(G).round())},this.getScissor=function(C){return C.copy(dt)},this.setScissor=function(C,P,N,U){C.isVector4?dt.set(C.x,C.y,C.z,C.w):dt.set(C,P,N,U),Dt.scissor(F.copy(dt).multiplyScalar(G).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(C){Dt.setScissorTest(ft=C)},this.setOpaqueSort=function(C){q=C},this.setTransparentSort=function(C){st=C},this.getClearColor=function(C){return C.copy(X.getClearColor())},this.setClearColor=function(){X.setClearColor.apply(X,arguments)},this.getClearAlpha=function(){return X.getClearAlpha()},this.setClearAlpha=function(){X.setClearAlpha.apply(X,arguments)},this.clear=function(C=!0,P=!0,N=!0){let U=0;if(C){let O=!1;if(T!==null){const ht=T.texture.format;O=ht===vh||ht===xh||ht===gh}if(O){const ht=T.texture.type,mt=ht===Ui||ht===wa||ht===ao||ht===_s||ht===ph||ht===mh,Ct=X.getClearColor(),Xt=X.getClearAlpha(),Ot=Ct.r,Ut=Ct.g,Ht=Ct.b;mt?(m[0]=Ot,m[1]=Ut,m[2]=Ht,m[3]=Xt,V.clearBufferuiv(V.COLOR,0,m)):(_[0]=Ot,_[1]=Ut,_[2]=Ht,_[3]=Xt,V.clearBufferiv(V.COLOR,0,_))}else U|=V.COLOR_BUFFER_BIT}P&&(U|=V.DEPTH_BUFFER_BIT),N&&(U|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(U)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),_t.dispose(),Ft.dispose(),Rt.dispose(),A.dispose(),$.dispose(),rt.dispose(),Yt.dispose(),B.dispose(),zt.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",_n),nt.removeEventListener("sessionend",an),De.stop()};function lt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Pt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const C=It.autoReset,P=vt.enabled,N=vt.autoUpdate,U=vt.needsUpdate,O=vt.type;Et(),It.autoReset=C,vt.enabled=P,vt.autoUpdate=N,vt.needsUpdate=U,vt.type=O}function Tt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Kt(C){const P=C.target;P.removeEventListener("dispose",Kt),ee(P)}function ee(C){ce(C),Rt.remove(C)}function ce(C){const P=Rt.get(C).programs;P!==void 0&&(P.forEach(function(N){zt.releaseProgram(N)}),C.isShaderMaterial&&zt.releaseShaderCache(C))}this.renderBufferDirect=function(C,P,N,U,O,ht){P===null&&(P=kt);const mt=O.isMesh&&O.matrixWorld.determinant()<0,Ct=Fe(C,P,N,U,O);Dt.setMaterial(U,mt);let Xt=N.index,Ot=1;if(U.wireframe===!0){if(Xt=tt.getWireframeAttribute(N),Xt===void 0)return;Ot=2}const Ut=N.drawRange,Ht=N.attributes.position;let ie=Ut.start*Ot,ye=(Ut.start+Ut.count)*Ot;ht!==null&&(ie=Math.max(ie,ht.start*Ot),ye=Math.min(ye,(ht.start+ht.count)*Ot)),Xt!==null?(ie=Math.max(ie,0),ye=Math.min(ye,Xt.count)):Ht!=null&&(ie=Math.max(ie,0),ye=Math.min(ye,Ht.count));const ge=ye-ie;if(ge<0||ge===1/0)return;Yt.setup(O,U,Ct,N,Xt);let Ee,de=xt;if(Xt!==null&&(Ee=ot.get(Xt),de=Vt,de.setIndex(Ee)),O.isMesh)U.wireframe===!0?(Dt.setLineWidth(U.wireframeLinewidth*bt()),de.setMode(V.LINES)):de.setMode(V.TRIANGLES);else if(O.isLine){let $t=U.linewidth;$t===void 0&&($t=1),Dt.setLineWidth($t*bt()),O.isLineSegments?de.setMode(V.LINES):O.isLineLoop?de.setMode(V.LINE_LOOP):de.setMode(V.LINE_STRIP)}else O.isPoints?de.setMode(V.POINTS):O.isSprite&&de.setMode(V.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)de.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Mt.get("WEBGL_multi_draw"))de.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const $t=O._multiDrawStarts,Je=O._multiDrawCounts,oe=O._multiDrawCount,Ue=Xt?ot.get(Xt).bytesPerElement:1,Sn=Rt.get(U).currentProgram.getUniforms();for(let He=0;He<oe;He++)Sn.setValue(V,"_gl_DrawID",He),de.render($t[He]/Ue,Je[He])}else if(O.isInstancedMesh)de.renderInstances(ie,ge,O.count);else if(N.isInstancedBufferGeometry){const $t=N._maxInstanceCount!==void 0?N._maxInstanceCount:1/0,Je=Math.min(N.instanceCount,$t);de.renderInstances(ie,ge,Je)}else de.render(ie,ge)};function te(C,P,N){C.transparent===!0&&C.side===Ve&&C.forceSinglePass===!1?(C.side=Fn,C.needsUpdate=!0,mn(C,P,N),C.side=Qi,C.needsUpdate=!0,mn(C,P,N),C.side=Ve):mn(C,P,N)}this.compile=function(C,P,N=null){N===null&&(N=C),p=Ft.get(N),p.init(P),x.push(p),N.traverseVisible(function(O){O.isLight&&O.layers.test(P.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),C!==N&&C.traverseVisible(function(O){O.isLight&&O.layers.test(P.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();const U=new Set;return C.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ht=O.material;if(ht)if(Array.isArray(ht))for(let mt=0;mt<ht.length;mt++){const Ct=ht[mt];te(Ct,N,O),U.add(Ct)}else te(ht,N,O),U.add(ht)}),x.pop(),p=null,U},this.compileAsync=function(C,P,N=null){const U=this.compile(C,P,N);return new Promise(O=>{function ht(){if(U.forEach(function(mt){Rt.get(mt).currentProgram.isReady()&&U.delete(mt)}),U.size===0){O(C);return}setTimeout(ht,10)}Mt.get("KHR_parallel_shader_compile")!==null?ht():setTimeout(ht,10)})};let we=null;function be(C){we&&we(C)}function _n(){De.stop()}function an(){De.start()}const De=new sp;De.setAnimationLoop(be),typeof self<"u"&&De.setContext(self),this.setAnimationLoop=function(C){we=C,nt.setAnimationLoop(C),C===null?De.stop():De.start()},nt.addEventListener("sessionstart",_n),nt.addEventListener("sessionend",an),this.render=function(C,P){if(P!==void 0&&P.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(P),P=nt.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,P,T),p=Ft.get(C,x.length),p.init(P),x.push(p),et.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),it.setFromProjectionMatrix(et),pt=this.localClippingEnabled,j=at.init(this.clippingPlanes,pt),g=_t.get(C,y.length),g.init(),y.push(g),nt.enabled===!0&&nt.isPresenting===!0){const ht=v.xr.getDepthSensingMesh();ht!==null&&Me(ht,P,-1/0,v.sortObjects)}Me(C,P,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(q,st),Lt=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,Lt&&X.addToRenderList(g,C),this.info.render.frame++,j===!0&&at.beginShadows();const N=p.state.shadowsArray;vt.render(N,C,P),j===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const U=g.opaque,O=g.transmissive;if(p.setupLights(),P.isArrayCamera){const ht=P.cameras;if(O.length>0)for(let mt=0,Ct=ht.length;mt<Ct;mt++){const Xt=ht[mt];Dn(U,O,C,Xt)}Lt&&X.render(C);for(let mt=0,Ct=ht.length;mt<Ct;mt++){const Xt=ht[mt];qe(g,C,Xt,Xt.viewport)}}else O.length>0&&Dn(U,O,C,P),Lt&&X.render(C),qe(g,C,P);T!==null&&(k.updateMultisampleRenderTarget(T),k.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,P),Yt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],j===!0&&at.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function Me(C,P,N,U){if(C.visible===!1)return;if(C.layers.test(P.layers)){if(C.isGroup)N=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(P);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||it.intersectsSprite(C)){U&&St.setFromMatrixPosition(C.matrixWorld).applyMatrix4(et);const mt=rt.update(C),Ct=C.material;Ct.visible&&g.push(C,mt,Ct,N,St.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||it.intersectsObject(C))){const mt=rt.update(C),Ct=C.material;if(U&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),St.copy(C.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),St.copy(mt.boundingSphere.center)),St.applyMatrix4(C.matrixWorld).applyMatrix4(et)),Array.isArray(Ct)){const Xt=mt.groups;for(let Ot=0,Ut=Xt.length;Ot<Ut;Ot++){const Ht=Xt[Ot],ie=Ct[Ht.materialIndex];ie&&ie.visible&&g.push(C,mt,ie,N,St.z,Ht)}}else Ct.visible&&g.push(C,mt,Ct,N,St.z,null)}}const ht=C.children;for(let mt=0,Ct=ht.length;mt<Ct;mt++)Me(ht[mt],P,N,U)}function qe(C,P,N,U){const O=C.opaque,ht=C.transmissive,mt=C.transparent;p.setupLightsView(N),j===!0&&at.setGlobalState(v.clippingPlanes,N),U&&Dt.viewport(R.copy(U)),O.length>0&&We(O,P,N),ht.length>0&&We(ht,P,N),mt.length>0&&We(mt,P,N),Dt.buffers.depth.setTest(!0),Dt.buffers.depth.setMask(!0),Dt.buffers.color.setMask(!0),Dt.setPolygonOffset(!1)}function Dn(C,P,N,U){if((N.isScene===!0?N.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[U.id]===void 0&&(p.state.transmissionRenderTarget[U.id]=new Ea(1,1,{generateMipmaps:!0,type:Mt.has("EXT_color_buffer_half_float")||Mt.has("EXT_color_buffer_float")?fo:Ui,minFilter:Ma,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:_e.workingColorSpace}));const ht=p.state.transmissionRenderTarget[U.id],mt=U.viewport||R;ht.setSize(mt.z,mt.w);const Ct=v.getRenderTarget();v.setRenderTarget(ht),v.getClearColor(H),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear(),Lt&&X.render(N);const Xt=v.toneMapping;v.toneMapping=Ji;const Ot=U.viewport;if(U.viewport!==void 0&&(U.viewport=void 0),p.setupLightsView(U),j===!0&&at.setGlobalState(v.clippingPlanes,U),We(C,N,U),k.updateMultisampleRenderTarget(ht),k.updateRenderTargetMipmap(ht),Mt.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let Ht=0,ie=P.length;Ht<ie;Ht++){const ye=P[Ht],ge=ye.object,Ee=ye.geometry,de=ye.material,$t=ye.group;if(de.side===Ve&&ge.layers.test(U.layers)){const Je=de.side;de.side=Fn,de.needsUpdate=!0,Mn(ge,N,U,Ee,de,$t),de.side=Je,de.needsUpdate=!0,Ut=!0}}Ut===!0&&(k.updateMultisampleRenderTarget(ht),k.updateRenderTargetMipmap(ht))}v.setRenderTarget(Ct),v.setClearColor(H,L),Ot!==void 0&&(U.viewport=Ot),v.toneMapping=Xt}function We(C,P,N){const U=P.isScene===!0?P.overrideMaterial:null;for(let O=0,ht=C.length;O<ht;O++){const mt=C[O],Ct=mt.object,Xt=mt.geometry,Ot=U===null?mt.material:U,Ut=mt.group;Ct.layers.test(N.layers)&&Mn(Ct,P,N,Xt,Ot,Ut)}}function Mn(C,P,N,U,O,ht){C.onBeforeRender(v,P,N,U,O,ht),C.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),O.onBeforeRender(v,P,N,U,C,ht),O.transparent===!0&&O.side===Ve&&O.forceSinglePass===!1?(O.side=Fn,O.needsUpdate=!0,v.renderBufferDirect(N,P,U,O,C,ht),O.side=Qi,O.needsUpdate=!0,v.renderBufferDirect(N,P,U,O,C,ht),O.side=Ve):v.renderBufferDirect(N,P,U,O,C,ht),C.onAfterRender(v,P,N,U,O,ht)}function mn(C,P,N){P.isScene!==!0&&(P=kt);const U=Rt.get(C),O=p.state.lights,ht=p.state.shadowsArray,mt=O.state.version,Ct=zt.getParameters(C,O.state,ht,P,N),Xt=zt.getProgramCacheKey(Ct);let Ot=U.programs;U.environment=C.isMeshStandardMaterial?P.environment:null,U.fog=P.fog,U.envMap=(C.isMeshStandardMaterial?$:A).get(C.envMap||U.environment),U.envMapRotation=U.environment!==null&&C.envMap===null?P.environmentRotation:C.envMapRotation,Ot===void 0&&(C.addEventListener("dispose",Kt),Ot=new Map,U.programs=Ot);let Ut=Ot.get(Xt);if(Ut!==void 0){if(U.currentProgram===Ut&&U.lightsStateVersion===mt)return bn(C,Ct),Ut}else Ct.uniforms=zt.getUniforms(C),C.onBeforeCompile(Ct,v),Ut=zt.acquireProgram(Ct,Xt),Ot.set(Xt,Ut),U.uniforms=Ct.uniforms;const Ht=U.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ht.clippingPlanes=at.uniform),bn(C,Ct),U.needsLights=In(C),U.lightsStateVersion=mt,U.needsLights&&(Ht.ambientLightColor.value=O.state.ambient,Ht.lightProbe.value=O.state.probe,Ht.directionalLights.value=O.state.directional,Ht.directionalLightShadows.value=O.state.directionalShadow,Ht.spotLights.value=O.state.spot,Ht.spotLightShadows.value=O.state.spotShadow,Ht.rectAreaLights.value=O.state.rectArea,Ht.ltc_1.value=O.state.rectAreaLTC1,Ht.ltc_2.value=O.state.rectAreaLTC2,Ht.pointLights.value=O.state.point,Ht.pointLightShadows.value=O.state.pointShadow,Ht.hemisphereLights.value=O.state.hemi,Ht.directionalShadowMap.value=O.state.directionalShadowMap,Ht.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ht.spotShadowMap.value=O.state.spotShadowMap,Ht.spotLightMatrix.value=O.state.spotLightMatrix,Ht.spotLightMap.value=O.state.spotLightMap,Ht.pointShadowMap.value=O.state.pointShadowMap,Ht.pointShadowMatrix.value=O.state.pointShadowMatrix),U.currentProgram=Ut,U.uniformsList=null,Ut}function ve(C){if(C.uniformsList===null){const P=C.currentProgram.getUniforms();C.uniformsList=pr.seqWithValue(P.seq,C.uniforms)}return C.uniformsList}function bn(C,P){const N=Rt.get(C);N.outputColorSpace=P.outputColorSpace,N.batching=P.batching,N.batchingColor=P.batchingColor,N.instancing=P.instancing,N.instancingColor=P.instancingColor,N.instancingMorph=P.instancingMorph,N.skinning=P.skinning,N.morphTargets=P.morphTargets,N.morphNormals=P.morphNormals,N.morphColors=P.morphColors,N.morphTargetsCount=P.morphTargetsCount,N.numClippingPlanes=P.numClippingPlanes,N.numIntersection=P.numClipIntersection,N.vertexAlphas=P.vertexAlphas,N.vertexTangents=P.vertexTangents,N.toneMapping=P.toneMapping}function Fe(C,P,N,U,O){P.isScene!==!0&&(P=kt),k.resetTextureUnits();const ht=P.fog,mt=U.isMeshStandardMaterial?P.environment:null,Ct=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Ss,Xt=(U.isMeshStandardMaterial?$:A).get(U.envMap||mt),Ot=U.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,Ut=!!N.attributes.tangent&&(!!U.normalMap||U.anisotropy>0),Ht=!!N.morphAttributes.position,ie=!!N.morphAttributes.normal,ye=!!N.morphAttributes.color;let ge=Ji;U.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ge=v.toneMapping);const Ee=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,de=Ee!==void 0?Ee.length:0,$t=Rt.get(U),Je=p.state.lights;if(j===!0&&(pt===!0||C!==M)){const wt=C===M&&U.id===b;at.setState(U,C,wt)}let oe=!1;U.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==Je.state.version||$t.outputColorSpace!==Ct||O.isBatchedMesh&&$t.batching===!1||!O.isBatchedMesh&&$t.batching===!0||O.isBatchedMesh&&$t.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&$t.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&$t.instancing===!1||!O.isInstancedMesh&&$t.instancing===!0||O.isSkinnedMesh&&$t.skinning===!1||!O.isSkinnedMesh&&$t.skinning===!0||O.isInstancedMesh&&$t.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&$t.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&$t.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&$t.instancingMorph===!1&&O.morphTexture!==null||$t.envMap!==Xt||U.fog===!0&&$t.fog!==ht||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==at.numPlanes||$t.numIntersection!==at.numIntersection)||$t.vertexAlphas!==Ot||$t.vertexTangents!==Ut||$t.morphTargets!==Ht||$t.morphNormals!==ie||$t.morphColors!==ye||$t.toneMapping!==ge||$t.morphTargetsCount!==de)&&(oe=!0):(oe=!0,$t.__version=U.version);let Ue=$t.currentProgram;oe===!0&&(Ue=mn(U,P,O));let Sn=!1,He=!1,wn=!1;const pe=Ue.getUniforms(),ke=$t.uniforms;if(Dt.useProgram(Ue.program)&&(Sn=!0,He=!0,wn=!0),U.id!==b&&(b=U.id,He=!0),Sn||M!==C){Dt.buffers.depth.getReversed()?(J.copy(C.projectionMatrix),Cv(J),Lv(J),pe.setValue(V,"projectionMatrix",J)):pe.setValue(V,"projectionMatrix",C.projectionMatrix),pe.setValue(V,"viewMatrix",C.matrixWorldInverse);const qt=pe.map.cameraPosition;qt!==void 0&&qt.setValue(V,K.setFromMatrixPosition(C.matrixWorld)),Nt.logarithmicDepthBuffer&&pe.setValue(V,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(U.isMeshPhongMaterial||U.isMeshToonMaterial||U.isMeshLambertMaterial||U.isMeshBasicMaterial||U.isMeshStandardMaterial||U.isShaderMaterial)&&pe.setValue(V,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,He=!0,wn=!0)}if(O.isSkinnedMesh){pe.setOptional(V,O,"bindMatrix"),pe.setOptional(V,O,"bindMatrixInverse");const wt=O.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),pe.setValue(V,"boneTexture",wt.boneTexture,k))}O.isBatchedMesh&&(pe.setOptional(V,O,"batchingTexture"),pe.setValue(V,"batchingTexture",O._matricesTexture,k),pe.setOptional(V,O,"batchingIdTexture"),pe.setValue(V,"batchingIdTexture",O._indirectTexture,k),pe.setOptional(V,O,"batchingColorTexture"),O._colorsTexture!==null&&pe.setValue(V,"batchingColorTexture",O._colorsTexture,k));const At=N.morphAttributes;if((At.position!==void 0||At.normal!==void 0||At.color!==void 0)&&ct.update(O,N,Ue),(He||$t.receiveShadow!==O.receiveShadow)&&($t.receiveShadow=O.receiveShadow,pe.setValue(V,"receiveShadow",O.receiveShadow)),U.isMeshGouraudMaterial&&U.envMap!==null&&(ke.envMap.value=Xt,ke.flipEnvMap.value=Xt.isCubeTexture&&Xt.isRenderTargetTexture===!1?-1:1),U.isMeshStandardMaterial&&U.envMap===null&&P.environment!==null&&(ke.envMapIntensity.value=P.environmentIntensity),He&&(pe.setValue(V,"toneMappingExposure",v.toneMappingExposure),$t.needsLights&&kn(ke,wn),ht&&U.fog===!0&&Q.refreshFogUniforms(ke,ht),Q.refreshMaterialUniforms(ke,U,G,Y,p.state.transmissionRenderTarget[C.id]),pr.upload(V,ve($t),ke,k)),U.isShaderMaterial&&U.uniformsNeedUpdate===!0&&(pr.upload(V,ve($t),ke,k),U.uniformsNeedUpdate=!1),U.isSpriteMaterial&&pe.setValue(V,"center",O.center),pe.setValue(V,"modelViewMatrix",O.modelViewMatrix),pe.setValue(V,"normalMatrix",O.normalMatrix),pe.setValue(V,"modelMatrix",O.matrixWorld),U.isShaderMaterial||U.isRawShaderMaterial){const wt=U.uniformsGroups;for(let qt=0,Ie=wt.length;qt<Ie;qt++){const Ne=wt[qt];B.update(Ne,Ue),B.bind(Ne,Ue)}}return Ue}function kn(C,P){C.ambientLightColor.needsUpdate=P,C.lightProbe.needsUpdate=P,C.directionalLights.needsUpdate=P,C.directionalLightShadows.needsUpdate=P,C.pointLights.needsUpdate=P,C.pointLightShadows.needsUpdate=P,C.spotLights.needsUpdate=P,C.spotLightShadows.needsUpdate=P,C.rectAreaLights.needsUpdate=P,C.hemisphereLights.needsUpdate=P}function In(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,P,N){Rt.get(C.texture).__webglTexture=P,Rt.get(C.depthTexture).__webglTexture=N;const U=Rt.get(C);U.__hasExternalTextures=!0,U.__autoAllocateDepthBuffer=N===void 0,U.__autoAllocateDepthBuffer||Mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),U.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,P){const N=Rt.get(C);N.__webglFramebuffer=P,N.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(C,P=0,N=0){T=C,S=P,E=N;let U=!0,O=null,ht=!1,mt=!1;if(C){const Xt=Rt.get(C);if(Xt.__useDefaultFramebuffer!==void 0)Dt.bindFramebuffer(V.FRAMEBUFFER,null),U=!1;else if(Xt.__webglFramebuffer===void 0)k.setupRenderTarget(C);else if(Xt.__hasExternalTextures)k.rebindTextures(C,Rt.get(C.texture).__webglTexture,Rt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ht=C.depthTexture;if(Xt.__boundDepthTexture!==Ht){if(Ht!==null&&Rt.has(Ht)&&(C.width!==Ht.image.width||C.height!==Ht.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(C)}}const Ot=C.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(mt=!0);const Ut=Rt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Ut[P])?O=Ut[P][N]:O=Ut[P],ht=!0):C.samples>0&&k.useMultisampledRTT(C)===!1?O=Rt.get(C).__webglMultisampledFramebuffer:Array.isArray(Ut)?O=Ut[N]:O=Ut,R.copy(C.viewport),F.copy(C.scissor),z=C.scissorTest}else R.copy(gt).multiplyScalar(G).floor(),F.copy(dt).multiplyScalar(G).floor(),z=ft;if(Dt.bindFramebuffer(V.FRAMEBUFFER,O)&&U&&Dt.drawBuffers(C,O),Dt.viewport(R),Dt.scissor(F),Dt.setScissorTest(z),ht){const Xt=Rt.get(C.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+P,Xt.__webglTexture,N)}else if(mt){const Xt=Rt.get(C.texture),Ot=P||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Xt.__webglTexture,N||0,Ot)}b=-1},this.readRenderTargetPixels=function(C,P,N,U,O,ht,mt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ct=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&mt!==void 0&&(Ct=Ct[mt]),Ct){Dt.bindFramebuffer(V.FRAMEBUFFER,Ct);try{const Xt=C.texture,Ot=Xt.format,Ut=Xt.type;if(!Nt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=C.width-U&&N>=0&&N<=C.height-O&&V.readPixels(P,N,U,O,Bt.convert(Ot),Bt.convert(Ut),ht)}finally{const Xt=T!==null?Rt.get(T).__webglFramebuffer:null;Dt.bindFramebuffer(V.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(C,P,N,U,O,ht,mt){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ct=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&mt!==void 0&&(Ct=Ct[mt]),Ct){const Xt=C.texture,Ot=Xt.format,Ut=Xt.type;if(!Nt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(P>=0&&P<=C.width-U&&N>=0&&N<=C.height-O){Dt.bindFramebuffer(V.FRAMEBUFFER,Ct);const Ht=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,Ht),V.bufferData(V.PIXEL_PACK_BUFFER,ht.byteLength,V.STREAM_READ),V.readPixels(P,N,U,O,Bt.convert(Ot),Bt.convert(Ut),0);const ie=T!==null?Rt.get(T).__webglFramebuffer:null;Dt.bindFramebuffer(V.FRAMEBUFFER,ie);const ye=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await Pv(V,ye,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,Ht),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,ht),V.deleteBuffer(Ht),V.deleteSync(ye),ht}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,P=null,N=0){C.isTexture!==!0&&(Vs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),P=arguments[0]||null,C=arguments[1]);const U=Math.pow(2,-N),O=Math.floor(C.image.width*U),ht=Math.floor(C.image.height*U),mt=P!==null?P.x:0,Ct=P!==null?P.y:0;k.setTexture2D(C,0),V.copyTexSubImage2D(V.TEXTURE_2D,N,0,0,mt,Ct,O,ht),Dt.unbindTexture()},this.copyTextureToTexture=function(C,P,N=null,U=null,O=0){C.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture function signature has changed."),U=arguments[0]||null,C=arguments[1],P=arguments[2],O=arguments[3]||0,N=null);let ht,mt,Ct,Xt,Ot,Ut,Ht,ie,ye;const ge=C.isCompressedTexture?C.mipmaps[O]:C.image;N!==null?(ht=N.max.x-N.min.x,mt=N.max.y-N.min.y,Ct=N.isBox3?N.max.z-N.min.z:1,Xt=N.min.x,Ot=N.min.y,Ut=N.isBox3?N.min.z:0):(ht=ge.width,mt=ge.height,Ct=ge.depth||1,Xt=0,Ot=0,Ut=0),U!==null?(Ht=U.x,ie=U.y,ye=U.z):(Ht=0,ie=0,ye=0);const Ee=Bt.convert(P.format),de=Bt.convert(P.type);let $t;P.isData3DTexture?(k.setTexture3D(P,0),$t=V.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(k.setTexture2DArray(P,0),$t=V.TEXTURE_2D_ARRAY):(k.setTexture2D(P,0),$t=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,P.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,P.unpackAlignment);const Je=V.getParameter(V.UNPACK_ROW_LENGTH),oe=V.getParameter(V.UNPACK_IMAGE_HEIGHT),Ue=V.getParameter(V.UNPACK_SKIP_PIXELS),Sn=V.getParameter(V.UNPACK_SKIP_ROWS),He=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,ge.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ge.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Xt),V.pixelStorei(V.UNPACK_SKIP_ROWS,Ot),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Ut);const wn=C.isDataArrayTexture||C.isData3DTexture,pe=P.isDataArrayTexture||P.isData3DTexture;if(C.isRenderTargetTexture||C.isDepthTexture){const ke=Rt.get(C),At=Rt.get(P),wt=Rt.get(ke.__renderTarget),qt=Rt.get(At.__renderTarget);Dt.bindFramebuffer(V.READ_FRAMEBUFFER,wt.__webglFramebuffer),Dt.bindFramebuffer(V.DRAW_FRAMEBUFFER,qt.__webglFramebuffer);for(let Ie=0;Ie<Ct;Ie++)wn&&V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Rt.get(C).__webglTexture,O,Ut+Ie),C.isDepthTexture?(pe&&V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Rt.get(P).__webglTexture,O,ye+Ie),V.blitFramebuffer(Xt,Ot,ht,mt,Ht,ie,ht,mt,V.DEPTH_BUFFER_BIT,V.NEAREST)):pe?V.copyTexSubImage3D($t,O,Ht,ie,ye+Ie,Xt,Ot,ht,mt):V.copyTexSubImage2D($t,O,Ht,ie,ye+Ie,Xt,Ot,ht,mt);Dt.bindFramebuffer(V.READ_FRAMEBUFFER,null),Dt.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else pe?C.isDataTexture||C.isData3DTexture?V.texSubImage3D($t,O,Ht,ie,ye,ht,mt,Ct,Ee,de,ge.data):P.isCompressedArrayTexture?V.compressedTexSubImage3D($t,O,Ht,ie,ye,ht,mt,Ct,Ee,ge.data):V.texSubImage3D($t,O,Ht,ie,ye,ht,mt,Ct,Ee,de,ge):C.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,O,Ht,ie,ht,mt,Ee,de,ge.data):C.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,O,Ht,ie,ge.width,ge.height,Ee,ge.data):V.texSubImage2D(V.TEXTURE_2D,O,Ht,ie,ht,mt,Ee,de,ge);V.pixelStorei(V.UNPACK_ROW_LENGTH,Je),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,oe),V.pixelStorei(V.UNPACK_SKIP_PIXELS,Ue),V.pixelStorei(V.UNPACK_SKIP_ROWS,Sn),V.pixelStorei(V.UNPACK_SKIP_IMAGES,He),O===0&&P.generateMipmaps&&V.generateMipmap($t),Dt.unbindTexture()},this.copyTextureToTexture3D=function(C,P,N=null,U=null,O=0){return C.isTexture!==!0&&(Vs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),N=arguments[0]||null,U=arguments[1]||null,C=arguments[2],P=arguments[3],O=arguments[4]||0),Vs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,P,N,U,O)},this.initRenderTarget=function(C){Rt.get(C).__webglFramebuffer===void 0&&k.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?k.setTextureCube(C,0):C.isData3DTexture?k.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?k.setTexture2DArray(C,0):k.setTexture2D(C,0),Dt.unbindTexture()},this.resetState=function(){S=0,E=0,T=null,Dt.reset(),Yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=_e._getDrawingBufferColorSpace(t),e.unpackColorSpace=_e._getUnpackColorSpace()}}class H1 extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mi,this.environmentIntensity=1,this.environmentRotation=new Mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class G1{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=$l,this.updateRanges=[],this.version=0,this.uuid=_i()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Rn=new W;class Rr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.applyMatrix4(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.applyNormalMatrix(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Rn.fromBufferAttribute(this,e),Rn.transformDirection(t),this.setXYZ(e,Rn.x,Rn.y,Rn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Re(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=oi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=oi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=oi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=oi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Re(e,this.array),i=Re(i,this.array),a=Re(a,this.array),s=Re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new pn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Rr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ql extends Aa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let es;const Os=new W,ns=new W,is=new W,as=new Wt,Bs=new Wt,up=new Oe,jo=new W,Hs=new W,Ko=new W,Iu=new Wt,Hc=new Wt,zu=new Wt;class Fu extends Ze{constructor(t=new ql){if(super(),this.isSprite=!0,this.type="Sprite",es===void 0){es=new nn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new G1(e,5);es.setIndex([0,1,2,0,2,3]),es.setAttribute("position",new Rr(i,3,0,!1)),es.setAttribute("uv",new Rr(i,2,3,!1))}this.geometry=es,this.material=t,this.center=new Wt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ns.setFromMatrixScale(this.matrixWorld),up.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),is.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ns.multiplyScalar(-is.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;Jo(jo.set(-.5,-.5,0),is,o,ns,a,s),Jo(Hs.set(.5,-.5,0),is,o,ns,a,s),Jo(Ko.set(.5,.5,0),is,o,ns,a,s),Iu.set(0,0),Hc.set(1,0),zu.set(1,1);let r=t.ray.intersectTriangle(jo,Hs,Ko,!1,Os);if(r===null&&(Jo(Hs.set(-.5,.5,0),is,o,ns,a,s),Hc.set(0,1),r=t.ray.intersectTriangle(jo,Ko,Hs,!1,Os),r===null))return;const l=t.ray.origin.distanceTo(Os);l<t.near||l>t.far||e.push({distance:l,point:Os.clone(),uv:Wn.getInterpolation(Os,jo,Hs,Ko,Iu,Hc,zu,new Wt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Jo(n,t,e,i,a,s){as.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Bs.x=s*as.x-a*as.y,Bs.y=a*as.x+s*as.y):Bs.copy(as),n.copy(t),n.x+=Bs.x,n.y+=Bs.y,n.applyMatrix4(up)}class wh extends Aa{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Pr=new W,Cr=new W,Uu=new Oe,Gs=new _h,Qo=new Or,Gc=new W,Nu=new W;class V1 extends Ze{constructor(t=new nn,e=new wh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Pr.fromBufferAttribute(e,a-1),Cr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Pr.distanceTo(Cr);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Qo.copy(i.boundingSphere),Qo.applyMatrix4(a),Qo.radius+=s,t.ray.intersectsSphere(Qo)===!1)return;Uu.copy(a).invert(),Gs.copy(t.ray).applyMatrix4(Uu);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=h.getX(_),y=h.getX(_+1),x=tr(this,t,Gs,l,p,y);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(m-1),g=h.getX(f),p=tr(this,t,Gs,l,_,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=tr(this,t,Gs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=tr(this,t,Gs,l,m-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function tr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Pr.fromBufferAttribute(o,a),Cr.fromBufferAttribute(o,s),e.distanceSqToSegment(Pr,Cr,Gc,Nu)>i)return;Gc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Gc);if(!(l<t.near||l>t.far))return{distance:l,point:Nu.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Ou=new W,Bu=new W;class fp extends V1{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)Ou.fromBufferAttribute(e,a),Bu.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+Ou.distanceTo(Bu);t.setAttribute("lineDistance",new Se(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jl extends Ln{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const h=i[a],d=i[a+1]-h,f=(o-h)/d;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Wt:new W);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new W,a=[],s=[],o=[],r=new W,l=new Oe;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new W)}s[0]=new W,o[0]=new W;let c=Number.MAX_VALUE;const h=Math.abs(a[0].x),u=Math.abs(a[0].y),d=Math.abs(a[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(fn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(fn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Eh extends bi{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Wt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class X1 extends Eh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Th(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,h,u){let d=(o-s)/c-(r-s)/(c+h)+(r-o)/h,f=(r-o)/h-(l-o)/(h+u)+(l-r)/u;d*=h,f*=h,a(o,r,d,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const er=new W,Vc=new Th,Xc=new Th,Wc=new Th;class W1 extends bi{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new W){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,h;this.closed||r>0?c=a[(r-1)%s]:(er.subVectors(a[0],a[1]).add(a[0]),c=er);const u=a[r%s],d=a[(r+1)%s];if(this.closed||r+2<s?h=a[(r+2)%s]:(er.subVectors(a[s-1],a[s-2]).add(a[s-1]),h=er),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Vc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,_,g),Xc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,_,g),Wc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(Vc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Xc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Wc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(Vc.calc(l),Xc.calc(l),Wc.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new W().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Hu(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function Y1(n,t){const e=1-n;return e*e*t}function $1(n,t){return 2*(1-n)*n*t}function Z1(n,t){return n*n*t}function js(n,t,e,i){return Y1(n,t)+$1(n,e)+Z1(n,i)}function q1(n,t){const e=1-n;return e*e*e*t}function j1(n,t){const e=1-n;return 3*e*e*n*t}function K1(n,t){return 3*(1-n)*n*n*t}function J1(n,t){return n*n*n*t}function Ks(n,t,e,i,a){return q1(n,t)+j1(n,e)+K1(n,i)+J1(n,a)}class pp extends bi{constructor(t=new Wt,e=new Wt,i=new Wt,a=new Wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ks(t,a.x,s.x,o.x,r.x),Ks(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Q1 extends bi{constructor(t=new W,e=new W,i=new W,a=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(Ks(t,a.x,s.x,o.x,r.x),Ks(t,a.y,s.y,o.y,r.y),Ks(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class mp extends bi{constructor(t=new Wt,e=new Wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Wt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tS extends bi{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gp extends bi{constructor(t=new Wt,e=new Wt,i=new Wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Wt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(js(t,a.x,s.x,o.x),js(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class eS extends bi{constructor(t=new W,e=new W,i=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new W){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(js(t,a.x,s.x,o.x),js(t,a.y,s.y,o.y),js(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xp extends bi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Wt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],h=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(Hu(r,l.x,c.x,h.x,u.x),Hu(r,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Wt().fromArray(a))}return this}}var Gu=Object.freeze({__proto__:null,ArcCurve:X1,CatmullRomCurve3:W1,CubicBezierCurve:pp,CubicBezierCurve3:Q1,EllipseCurve:Eh,LineCurve:mp,LineCurve3:tS,QuadraticBezierCurve:gp,QuadraticBezierCurve3:eS,SplineCurve:xp});class nS extends bi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Gu[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new Gu[a.type]().fromJSON(a))}return this}}class Vu extends nS{constructor(t){super(),this.type="Path",this.currentPoint=new Wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new mp(this.currentPoint.clone(),new Wt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new gp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new pp(this.currentPoint.clone(),new Wt(t,e),new Wt(i,a),new Wt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new xp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Eh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ah extends nn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new W,h=new Wt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*a;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(r,3)),this.setAttribute("uv",new Se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ah(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class oo extends nn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const h=[],u=[],d=[],f=[];let m=0;const _=[],g=i/2;let p=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Se(u,3)),this.setAttribute("normal",new Se(d,3)),this.setAttribute("uv",new Se(f,2));function y(){const v=new W,w=new W;let S=0;const E=(e-t)/i;for(let T=0;T<=s;T++){const b=[],M=T/s,R=M*(e-t)+t;for(let F=0;F<=a;F++){const z=F/a,H=z*l+r,L=Math.sin(H),I=Math.cos(H);w.x=R*L,w.y=-M*i+g,w.z=R*I,u.push(w.x,w.y,w.z),v.set(L,E,I).normalize(),d.push(v.x,v.y,v.z),f.push(z,1-M),b.push(m++)}_.push(b)}for(let T=0;T<a;T++)for(let b=0;b<s;b++){const M=_[b][T],R=_[b+1][T],F=_[b+1][T+1],z=_[b][T+1];(t>0||b!==0)&&(h.push(M,R,z),S+=3),(e>0||b!==s-1)&&(h.push(R,F,z),S+=3)}c.addGroup(p,S,0),p+=S}function x(v){const w=m,S=new Wt,E=new W;let T=0;const b=v===!0?t:e,M=v===!0?1:-1;for(let F=1;F<=a;F++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;const R=m;for(let F=0;F<=a;F++){const H=F/a*l+r,L=Math.cos(H),I=Math.sin(H);E.x=b*I,E.y=g*M,E.z=b*L,u.push(E.x,E.y,E.z),d.push(0,M,0),S.x=L*.5+.5,S.y=I*.5*M+.5,f.push(S.x,S.y),m++}for(let F=0;F<a;F++){const z=w+F,H=R+F;v===!0?h.push(H,H+1,z):h.push(H+1,H,z),T+=3}c.addGroup(p,T,v===!0?1:2),p+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oo(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rh extends oo{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Rh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ph extends nn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),h(),this.setAttribute("position",new Se(s,3)),this.setAttribute("normal",new Se(s.slice(),3)),this.setAttribute("uv",new Se(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(y){const x=new W,v=new W,w=new W;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],v),f(e[S+2],w),l(x,v,w,y)}function l(y,x,v,w){const S=w+1,E=[];for(let T=0;T<=S;T++){E[T]=[];const b=y.clone().lerp(v,T/S),M=x.clone().lerp(v,T/S),R=S-T;for(let F=0;F<=R;F++)F===0&&T===S?E[T][F]=b:E[T][F]=b.clone().lerp(M,F/R)}for(let T=0;T<S;T++)for(let b=0;b<2*(S-T)-1;b++){const M=Math.floor(b/2);b%2===0?(d(E[T][M+1]),d(E[T+1][M]),d(E[T][M])):(d(E[T][M+1]),d(E[T+1][M+1]),d(E[T+1][M]))}}function c(y){const x=new W;for(let v=0;v<s.length;v+=3)x.x=s[v+0],x.y=s[v+1],x.z=s[v+2],x.normalize().multiplyScalar(y),s[v+0]=x.x,s[v+1]=x.y,s[v+2]=x.z}function h(){const y=new W;for(let x=0;x<s.length;x+=3){y.x=s[x+0],y.y=s[x+1],y.z=s[x+2];const v=g(y)/2/Math.PI+.5,w=p(y)/Math.PI+.5;o.push(v,1-w)}m(),u()}function u(){for(let y=0;y<o.length;y+=6){const x=o[y+0],v=o[y+2],w=o[y+4],S=Math.max(x,v,w),E=Math.min(x,v,w);S>.9&&E<.1&&(x<.2&&(o[y+0]+=1),v<.2&&(o[y+2]+=1),w<.2&&(o[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,x){const v=y*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function m(){const y=new W,x=new W,v=new W,w=new W,S=new Wt,E=new Wt,T=new Wt;for(let b=0,M=0;b<s.length;b+=9,M+=6){y.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),T.set(o[M+4],o[M+5]),w.copy(y).add(x).add(v).divideScalar(3);const R=g(w);_(S,M+0,y,R),_(E,M+2,x,R),_(T,M+4,v,R)}}function _(y,x,v,w){w<0&&y.x===1&&(o[x]=y.x-1),v.x===0&&v.z===0&&(o[x]=w/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ph(t.vertices,t.indices,t.radius,t.details)}}const nr=new W,ir=new W,Yc=new W,ar=new Wn;class iS extends nn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(us*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:_,b:g,c:p}=ar;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),ar.getNormal(Yc),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const x=(y+1)%3,v=u[y],w=u[x],S=ar[h[y]],E=ar[h[x]],T=`${v}_${w}`,b=`${w}_${v}`;b in d&&d[b]?(Yc.dot(d[b].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(E.x,E.y,E.z)),d[b]=null):T in d||(d[T]={index0:c[y],index1:c[x],normal:Yc.clone()})}}for(const m in d)if(d[m]){const{index0:_,index1:g}=d[m];nr.fromBufferAttribute(r,_),ir.fromBufferAttribute(r,g),f.push(nr.x,nr.y,nr.z),f.push(ir.x,ir.y,ir.z)}this.setAttribute("position",new Se(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class vp extends Vu{constructor(t){super(t),this.uuid=_i(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Vu().fromJSON(a))}return this}}const aS={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=yp(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,h,u,d,f;if(i&&(s=lS(n,t,s,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let m=e;m<a;m+=e)u=n[m],d=n[m+1],u<r&&(r=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-r,h-l),f=f!==0?32767/f:0}return ro(s,o,e,r,l,f,0),o}};function yp(n,t,e,i,a){let s,o;if(a===_S(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Xu(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Xu(s,n[s],n[s+1],o);return o&&Hr(o,o.next)&&(lo(o),o=o.next),o}function Ta(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Hr(e,e.next)||$e(e.prev,e,e.next)===0)){if(lo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ro(n,t,e,i,a,s,o){if(!n)return;!o&&s&&pS(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?oS(n,i,a,s):sS(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),lo(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=rS(Ta(n),t,e),ro(n,t,e,i,a,s,2)):o===2&&cS(n,t,e,i,a,s):ro(Ta(n),t,e,i,a,s,1);break}}}function sS(n){const t=n.prev,e=n,i=n.next;if($e(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,h=a<s?a<o?a:o:s<o?s:o,u=r<l?r<c?r:c:l<c?l:c,d=a>s?a>o?a:o:s>o?s:o,f=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&cs(a,r,s,l,o,c,m.x,m.y)&&$e(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function oS(n,t,e,i){const a=n.prev,s=n,o=n.next;if($e(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,h=a.y,u=s.y,d=o.y,f=r<l?r<c?r:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,_=r>l?r>c?r:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=Kl(f,m,t,e,i),y=Kl(_,g,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&cs(r,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&cs(r,h,l,u,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&cs(r,h,l,u,c,d,x.x,x.y)&&$e(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==a&&v!==o&&cs(r,h,l,u,c,d,v.x,v.y)&&$e(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function rS(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Hr(a,s)&&_p(a,i,i.next,s)&&co(a,s)&&co(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),lo(i),lo(i.next),i=n=s),i=i.next}while(i!==n);return Ta(i)}function cS(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&xS(o,r)){let l=Mp(o,r);o=Ta(o,o.next),l=Ta(l,l.next),ro(o,t,e,i,a,s,0),ro(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function lS(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=yp(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(gS(c));for(a.sort(hS),s=0;s<a.length;s++)e=dS(a[s],e);return e}function hS(n,t){return n.x-t.x}function dS(n,t){const e=uS(n,t);if(!e)return t;const i=Mp(e,n);return Ta(i,i.next),Ta(e,e.next)}function uS(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>i&&(i=d,a=e.x<e.next.x?e:e.next,d===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let h=1/0,u;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&cs(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),co(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&fS(a,e)))&&(a=e,h=u)),e=e.next;while(e!==r);return a}function fS(n,t){return $e(n.prev,n,t.prev)<0&&$e(t.next,n,n.next)<0}function pS(n,t,e,i){let a=n;do a.z===0&&(a.z=Kl(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,mS(a)}function mS(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function Kl(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function gS(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function cs(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function xS(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!vS(n,t)&&(co(n,t)&&co(t,n)&&yS(n,t)&&($e(n.prev,n,t.prev)||$e(n,t.prev,t))||Hr(n,t)&&$e(n.prev,n,n.next)>0&&$e(t.prev,t,t.next)>0)}function $e(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Hr(n,t){return n.x===t.x&&n.y===t.y}function _p(n,t,e,i){const a=or($e(n,t,e)),s=or($e(n,t,i)),o=or($e(e,i,n)),r=or($e(e,i,t));return!!(a!==s&&o!==r||a===0&&sr(n,e,t)||s===0&&sr(n,i,t)||o===0&&sr(e,n,i)||r===0&&sr(e,t,i))}function sr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function or(n){return n>0?1:n<0?-1:0}function vS(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&_p(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function co(n,t){return $e(n.prev,n,n.next)<0?$e(n,t,n.next)>=0&&$e(n,n.prev,t)>=0:$e(n,t,n.prev)<0||$e(n,n.next,t)<0}function yS(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Mp(n,t){const e=new Jl(n.i,n.x,n.y),i=new Jl(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Xu(n,t,e,i){const a=new Jl(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function lo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Jl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function _S(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class Js{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return Js.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Wu(t),Yu(i,t);let o=t.length;e.forEach(Wu);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,Yu(i,e[l]);const r=aS.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function Wu(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Yu(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Ch extends Ph{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ch(t.radius,t.detail)}}class ps extends nn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],h=[];let u=t;const d=(e-t)/a,f=new W,m=new Wt;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const y=p+g,x=y,v=y+i+1,w=y+i+2,S=y+1;r.push(x,v,S),r.push(v,w,S)}}this.setIndex(r),this.setAttribute("position",new Se(l,3)),this.setAttribute("normal",new Se(c,3)),this.setAttribute("uv",new Se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Lh extends nn{constructor(t=new vp([new Wt(0,.5),new Wt(-.5,-.5),new Wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new Se(a,3)),this.setAttribute("normal",new Se(s,3)),this.setAttribute("uv",new Se(o,2));function c(h){const u=a.length/3,d=h.extractPoints(e);let f=d.shape;const m=d.holes;Js.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const y=m[g];Js.isClockWise(y)===!0&&(m[g]=y.reverse())}const _=Js.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const y=m[g];f=f.concat(y)}for(let g=0,p=f.length;g<p;g++){const y=f[g];a.push(y.x,y.y,0),s.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=_.length;g<p;g++){const y=_[g],x=y[0]+u,v=y[1]+u,w=y[2]+u;i.push(x,v,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return MS(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new Lh(i,t.curveSegments)}}function MS(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class Gr extends nn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],h=new W,u=new W,d=new W;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const _=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const _=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,y=(a+1)*f+m;o.push(_,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ho extends Aa{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zf,this.normalScale=new Wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class bp extends Ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class bS extends bp{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const $c=new Oe,$u=new W,Zu=new W;class SS{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new bh,this._frameExtents=new Wt(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;$u.setFromMatrixPosition(t.matrixWorld),e.position.copy($u),Zu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zu),e.updateMatrixWorld(),$c.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix($c),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply($c)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class wS extends SS{constructor(){super(new op(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ES extends bp{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ze.DEFAULT_UP),this.updateMatrix(),this.target=new Ze,this.shadow=new wS}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const qu=new Oe;class TS{constructor(t,e,i=0,a=1/0){this.ray=new _h(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Mh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return qu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qu),this}intersectObject(t,e=!0,i=[]){return Ql(t,this,i,e),i.sort(ju),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Ql(t[a],this,i,e);return i.sort(ju),i}}function ju(n,t){return n.distance-t.distance}function Ql(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Ql(s[o],t,e,!0)}}class AS extends fp{constructor(t=10,e=10,i=4473924,a=8947848){i=new Qt(i),a=new Qt(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let d=0,f=0,m=-r;d<=e;d++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const _=d===s?i:a;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const h=new nn;h.setAttribute("position",new Se(l,3)),h.setAttribute("color",new Se(c,3));const u=new wh({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dh);const RS={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function PS(n,t,e,i){const a=new qn(n.fov,i,.1,200),s=new W,o=new W,r=new W;let l=!1,c=n.fov;const h={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,d=0,f=0,m=0,_=0,g=0,p=0;function y(){const x=(n.pitchDeg+h.pitchDelta)*Math.PI/180,v=n.yawDeg*Math.PI/180;r.set(Math.sin(v)*Math.cos(x),Math.sin(x),Math.cos(v)*Math.cos(x)).multiplyScalar(n.distance*h.distanceScale*h.zoom)}return y(),{camera:a,update(x,v,w,S,E=RS){const T=v+.6;if(!l)s.set(x,T,w),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*R,s.y+=(T-s.y)*R,s.z+=(w-s.z)*R}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);h.distanceScale+=(E.distanceScale-h.distanceScale)*b,h.offsetX+=(E.offsetX-h.offsetX)*b,h.offsetZ+=(E.offsetZ-h.offsetZ)*b,h.pitchDelta+=(E.pitchDelta-h.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(h.zoom+=(u-h.zoom)*M,y(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),a.position.copy(o).add(r),a.lookAt(o),d>.001){f+=S*52;const R=d*.055;a.position.x+=Math.sin(f*1.7)*R,a.position.y+=Math.sin(f*2.3+1.1)*R*.75,a.position.z+=Math.sin(f*1.3+2.4)*R*.5,d*=Math.exp(-9*S)}else d=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,v,w){s.set(x,v+.6,w),l=!0,o.set(s.x+h.offsetX,s.y,s.z+h.offsetZ),y(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new W().setFromMatrixColumn(a.matrixWorld,0),v=new W().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(v.x,v.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:v.x/S,forwardZ:v.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(d=Math.min(1,d+x))},shakeLevel(){return d},addKick(x,v,w){if(!Number.isFinite(x)||!Number.isFinite(v)||!(w>0))return;const S=Math.hypot(x,v);S<1e-4||(m=x/S*w,_=v/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...h}}}}const ba=Math.PI*2,jn=1e-6;function Un(n,t,e){return n<t?t:n>e?e:n}function Sp(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function CS(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function wp(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=CS(n);return i===1?a:e+(a-e)*i}function Ku(n){return(1-Math.sin(n))/2}function Dh(n,t,e){const i=Math.PI/180,a=Un(Number.isFinite(t)?t:100,0,180),s=Un(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Un((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Lr(n,t){if(!n.grounded||n.speed<jn)return Sp();const e=n.speed/Math.max(n.moveSpeed,jn),i=Math.max(n.legLength,jn),a=n.stride>jn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+jn,h=Dh(n.localForward/Math.max(n.speed,jn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=l/c*h,d=r/c+l/c*(1-h),f=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,_=a,g=H=>Math.asin(Un(H,-o,o)/i);function p(H,L){const I=wp(H,t.plantLock),Y=Ku(H),G=f*d*_*I,q=-g(G),st=L*m>0?1:-1,gt=1+st*t.crossStep*.45,dt=m*st*t.crossStep*_*.4*Y,ft=m*u*_*t.sideWeight*gt*I+dt*u,it=g(ft),j=t.kneeLift*Y*s*(.55+.25*d+(st>0?.2*u:0));return{pitchX:q,rollZ:it,kneeX:j}}const y=(n.phase%ba+ba)%ba,x=p(y,-1),v=p((y+Math.PI)%ba,1),w=Math.cos(y),S=Ku(y),E=-t.comSway*s*w*(.6*d+.8*u)-m*t.comSway*s*u*.45,T=t.comBob*S*s,b=m*t.hipLean*s*u*w*.6,M=m*t.hipLean*s*u*(.45+.25*w),R=t.armSwing*s*w*(d*f+.3*u),F=R,z=-R;return{legL:x,legR:v,pelvisX:E,pelvisY:T,pelvisRoll:b,sideLean:M,armL:F,armR:z,strafe:u,backward:f<0?d:0}}function Ep(n){const t=(n%ba+ba)%ba,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Tp(n,t,e){const i=Un(e.progress,0,1);if(i>=1||n.speed<jn)return Sp();const a=i*i*(3-2*i),s=1-a;return Lr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Ap(n,t,e,i){const a=Un(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Un(o*a,-1,1)*(e*Math.PI/180)}function Rp(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Un(i,0,1),c=l*l;return e*c+r*(1-c)}function Pp(n,t,e,i,a){const s=Math.max(e,jn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>jn?(t-n)/t:0,c=l>.02,h=l<-.015,u=n<=o*.15,d=!h&&n<r&&(c||u);return{enter:n>jn&&n<=o&&c,resume:!d}}function Cp(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Un(n*Un(t,0,2),-i,i)}function Lp(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Dp(n,t,e){const i=Un(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function LS(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Un(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,h=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,d=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-h*l,rollZ:f*d*l,kneeX:u*l},legR:{pitchX:-h*c,rollZ:-f*d*c,kneeX:u*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function kp(n,t,e,i,a){const s=Un(n,0,1),o=Un(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,h=Math.hypot(e,i),u=h>jn?e/h:1,d=h>jn?i/h:0,f=wp(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:f,fwdN:u,rightN:d,env:c}}function yn(n){return n<0?0:n>1?1:n}const mr=Math.PI*2;function DS(n){return((n+Math.PI)%mr+mr)%mr-Math.PI}function kS(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function IS(n,t,e,i,a,s=n.phase){const o=yn(i);if(o<=0)return n;const r=yn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),h=e%2===0?1:-1,u=yn(a.forwardBias),d=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*d,m=r<=.5?r*2:(r-.5)*2,_=m*m*(3-2*m),g=r<=.5?_:1-_,p={speed:c,phase:s+mr*l/2*g,localForward:c*u,localRight:c*(1-u)*h},y=DS(p.phase-n.phase),x=o*o*(3-2*o),v=n.speed>.05?d:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+y*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:v+(f-v)*o*o}}function zS(n,t,e){const i=kS(),a=yn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,h=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?h:h*.4,i.legR.kneeX=l?h:h*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function Ip(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Ju(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Ip(s,a)}function FS(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function US(n,t,e){const i=yn(n);return{gaitScale:1-i*(1-yn(t)),attackLegWeight:yn(e)*i}}function NS(n,t,e){const i=yn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function OS(n,t){const e=yn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function BS(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return yn(t.minScale+(1-t.minScale)*e)}function HS(){return zp()}function zp(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function GS(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function VS(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?yn(t.forceHitHeight):n.type==="light"?yn(t.hitHeight.light):n.type==="heavy"?yn(t.hitHeight.heavy):n.type==="knock"?yn(t.hitHeight.knock):0}function XS(n,t,e){const i=yn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function Fp(n,t,e){const i=zp(),a=GS(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=yn(1-n.timer/n.duration),o=Ip(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=VS(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),h=-Math.sin(t),u=n.dirX*r+n.dirZ*l,d=n.dirX*c+n.dirZ*h;if(i.localFwd=u,i.localRight=d,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*d*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,m=XS(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*d,i.upperYaw=f*m.upperYaw*d,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*d,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*d,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function Up(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const ua=1e-6;function Qs(n,t,e){return n<t?t:n>e?e:n}function Np(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=ua||s<=ua||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+ua,c=Math.hypot(n.x,n.y,n.z);if(c<=ua)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const h=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),d=n.z,f=Math.hypot(d,u),m=Qs(f,l,r),_=f>r+ua||f<l-ua,g=Math.atan2(-d,Math.max(u,ua)),p=Qs((a*a+m*m-s*s)/(2*a*m),-1,1),y=Qs((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),v=Math.acos(y),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:h,jointPitch:w*(x+v),clamped:_,reach:c/r}}function Op(n,t,e,i){const a=Qs(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=Qs((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Bp(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const kh={active:!1,weight:0,clamped:0,maxError:0};function Hp(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...kh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(f=>f.tip.getWorldPosition(new W));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),h=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],_=i.worldToLocal(l[f].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=Np(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const y=Op({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,h);m.root.rotation.x=y.rootPitch,m.root.rotation.z=y.rootRoll,m.joint.rotation.x=y.jointPitch}t.updateWorldMatrix(!0,!0);let d=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new W);d=Math.max(d,m.distanceTo(l[f]))}return{active:!0,weight:c,clamped:u,maxError:d}}function Vn(n,t,e){return n<t?t:n>e?e:n}function WS(n,t,e,i,a,s,o,r,l,c){const h=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Le,d=new Le;d.name="pelvis",d.position.y=n.legLength,u.add(d);const f=new Le;f.name="lower";const m=new Le;m.name="upper",d.add(f),d.add(m);const _=[],g=(Q,_t,Ft,at)=>{const vt=new ho({color:at}),X=new fe(new li(Q,_t,Ft),vt);return X.castShadow=!0,X.receiveShadow=!0,_.push(vt),X},p=n.headSize,y=n.legLength,x=n.armLength,v=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,m.add(E);const T=new Le;T.name="headPivot",T.rotation.order="YXZ",T.position.y=w,m.add(T);const b=g(p,p,p,e);b.position.y=p/2,T.add(b);for(const Q of[-1,1]){const _t=g(.06,.07,.02,t.shoe);_t.position.set(Q*.09,p/2+.03,p/2+.011),T.add(_t)}const M=(Q,_t)=>{const Ft=_t?x:y,at=new Le;at.name=_t?Q<0?"shoulderL":"shoulderR":Q<0?"hipL":"hipR",_t||(at.rotation.order="ZYX"),at.position.set(Q*(_t?S/2+v/2:S/2-v/2),_t?w-.04:0,0),(_t?m:f).add(at);const vt=g(v,Ft/2,v,t.limb);vt.position.y=-Ft/4,at.add(vt);const X=new Le;X.name=_t?"elbow":"knee",X.position.y=-Ft/2,at.add(X);const ct=g(v,Ft/2,v,t.limb);if(ct.position.y=-Ft/4,X.add(ct),!_t){const xt=g(v*1.15,.07,v*1.7,t.shoe);xt.position.set(0,-Ft/2+.035,.045),X.add(xt);const Vt=new Ze;return Vt.name="footTip",Vt.position.y=-Ft/2,X.add(Vt),{root:at,joint:X,tip:Vt}}return{root:at,joint:X}},R=M(-1,!1),F=M(1,!1),z=M(-1,!0),H=M(1,!0),L=[R,F].map(Q=>({root:Q.root,joint:Q.joint,tip:Q.tip,upperLen:y/2,lowerLen:y/2,bend:1})),I=new en({color:a.attackArcColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),Y=new fe(new Gr(.62,.042,6,20,Math.PI*1.1),I);Y.position.set(0,.78-y,.56),m.add(Y);const G=new Qt(e),q=new Qt(r.flashColor),st=new Qt;let gt=null,dt=0,ft=0,it=0,j=0,pt=0,J=0,et=0,K={...kh},St=-1,kt=0,Lt=0,bt=0,V=0,ne=0,Mt=0,Nt=0,Dt=1,It=0,Rt=0,k="none",A=0,$=!1,ot=-1,tt=!1,rt=0,zt=0;return{group:u,boneAtWorld(Q,_t,Ft){const at=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:T,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:z.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:z.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:H.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:H.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:F.root,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0},{node:F.joint,ax:0,ay:0,az:0,bx:0,by:-y/2,bz:0}],vt=new W,X=new W,ct=new W(Q,_t,Ft),xt=new W;let Vt=null,Bt=Number.POSITIVE_INFINITY;for(const Yt of at){Yt.node.updateWorldMatrix(!0,!1),vt.set(Yt.ax,Yt.ay,Yt.az),X.set(Yt.bx,Yt.by,Yt.bz),Yt.node.localToWorld(vt),Yt.node.localToWorld(X);const B=X.x-vt.x,Et=X.y-vt.y,nt=X.z-vt.z,lt=B*B+Et*Et+nt*nt;let Pt=lt>1e-8?((ct.x-vt.x)*B+(ct.y-vt.y)*Et+(ct.z-vt.z)*nt)/lt:0;Pt=Math.max(0,Math.min(1,Pt));const Tt=vt.x+B*Pt,Kt=vt.y+Et*Pt,ee=vt.z+nt*Pt,ce=(ct.x-Tt)**2+(ct.y-Kt)**2+(ct.z-ee)**2;ce<Bt&&(Bt=ce,Vt=Yt.node,xt.set(Tt,Kt,ee))}return Vt?{node:Vt,point:xt.clone()}:null},update(Q,_t){u.position.set(Q.position.x,Q.position.y,Q.position.z),u.rotation.y=Q.bodyYaw,T.rotation.y=(Q.headYaw-Q.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,Q.mode!==gt&&(gt=Q.mode,dt=1),dt=Math.max(0,dt-_t*2.2);const Ft=Q.hurt,at=Fp(Ft,Q.bodyYaw,r),vt=at.flash;st.copy(q).multiplyScalar(vt);for(const Ot of _)Ot.emissive.copy(G).multiplyScalar(dt*.5),vt>0&&Ot.emissive.add(st);d.position.set(0,y,0),d.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const X=Math.hypot(Q.velocity.x,Q.velocity.z),ct=Vn(o.knockGaitScale??0,0,1),xt=Q.hurt.knockX*ct,Vt=Q.hurt.knockZ*ct,Bt=ct>0&&Math.hypot(Q.hurt.knockX,Q.hurt.knockZ)>.001,Yt=Q.velocity.x+xt,B=Q.velocity.z+Vt,Et=Math.hypot(Yt,B),nt=Math.cos(Q.bodyYaw),lt=-Math.sin(Q.bodyYaw),Pt=X>1e-6?Vn((Q.velocity.x*nt+Q.velocity.z*lt)/X,-1,1):0,Tt=X>1e-6?Vn((Q.velocity.x*Math.sin(Q.bodyYaw)+Q.velocity.z*Math.cos(Q.bodyYaw))/X,-1,1):1,Kt=Dh(Tt,o.backStrafeStartDeg,o.backStrafeFullDeg);k==="settled"&&tt&&rt>zt*1.02+1e-4&&(k="none");let ee=1;k==="blend"?(ee=Dp($?ot:A,o.stopYawBlendMode,$),$||(A=Math.min(1,A+_t/Math.max(.01,o.stopYawAfterSec)),(A>=1||o.stopYawBlendMode==="inStop"||tt)&&(k="settled",ee=0))):k==="settled"&&(ee=Vn(X/Math.max(1e-6,o.stopEnterRatio*s),0,1));const ce=Ap(Pt,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),te=Rp(Tt,Pt,ce,Kt)*ee;It+=(te-It)*(1-Math.exp(-12*Math.max(0,_t))),f.rotation.y=It;const we=Q.bodyYaw+It,be=Math.sin(we),_n=Math.cos(we),an=Math.cos(we),De=-Math.sin(we),Me=Yt*be+B*_n,qe=Yt*an+B*De,Dn=Math.max(0,o.stopBlendSec||0),We=Dn>0&&!Bt,Mn=Pp(X,Rt,s,o.stopEnterRatio,o.stopExitRatio);if(!We||Mn.resume)St=-1;else if(St<0&&Mn.enter){St=0,kt=Q.gaitPhase,Lt=Ep(Q.gaitPhase),bt=X,V=Math.max(Q.stride,1e-6),ne=Me,Mt=qe;const Ot=1/Math.max(1e-6,X);Nt=Q.velocity.x*Ot,Dt=Q.velocity.z*Ot}const mn=Rt;Rt=X;const ve=We&&St>=0;ve&&(St=Math.min(1,St+_t/Dn)),ve&&k!=="blend"&&(k="blend",A=0),$=ve&&St<1,ot=St,tt=Mn.resume,rt=X,zt=mn;const bn=ve?{phase:kt,speed:bt,moveSpeed:s,localForward:ne,localRight:Mt,legLength:n.legLength,stride:V,grounded:!0}:{phase:Q.gaitPhase,speed:Et,moveSpeed:s,localForward:Me,localRight:qe,legLength:n.legLength,stride:Q.stride,grounded:!0},Fe=ve?Tp(bn,o,{progress:St,phase0:kt,phaseEnd:Lt}):Lr(bn,o);let kn=0,In=0,C=0,P=0;if(ve){const Ot=Lp(Q.bodyYaw,Nt,Dt),Ut=kp(St,kt,Ot.forward,Ot.right,o);Ut.leadLeft?(Fe.legL.pitchX-=Ut.leadPitch,Fe.legL.kneeX+=Ut.leadKnee,Fe.legR.pitchX+=Ut.trailPitch):(Fe.legR.pitchX-=Ut.leadPitch,Fe.legR.kneeX+=Ut.leadKnee,Fe.legL.pitchX+=Ut.trailPitch),In=Ut.bodyShift*Ut.fwdN,kn=Ut.bodyShift*Ut.rightN,C=Ut.bodyDip,P=Ut.chestPitch}R.root.rotation.x=Fe.legL.pitchX,F.root.rotation.x=Fe.legR.pitchX,R.root.rotation.z=Fe.legL.rollZ,F.root.rotation.z=Fe.legR.rollZ,R.joint.rotation.x=Fe.legL.kneeX,F.joint.rotation.x=Fe.legR.kneeX,z.root.rotation.x=Fe.armL,H.root.rotation.x=Fe.armR,z.joint.rotation.x=-.18,H.joint.rotation.x=-.18,d.position.x=Fe.pelvisX,d.position.y=y+Fe.pelvisY,d.position.z=0,d.rotation.z=Fe.pelvisRoll,m.rotation.z=Fe.sideLean*(at.intensity>0?.4:1);const N=Bp(d,f),U=ve&&h.enabled?{...h,weight:1}:h,O=U.enabled&&U.weight>0?Vn(U.weight,0,1):0;if(d.position.x+=kn,d.position.z+=In,d.position.y-=C,f.position.y+=C,O<=0&&(f.position.x-=kn,f.position.z-=In),l){const Ot=Math.max(.004166666666666667,Math.min(_t,.1)),Ut=Math.sin(Q.bodyYaw),Ht=Math.cos(Q.bodyYaw),ie=Vn((Q.velocity.x-ft)/Ot,-60,60),ye=Vn((Q.velocity.z-it)/Ot,-60,60),ge=ie*Ut+ye*Ht,Ee=Xe(Q.bodyYaw-j)/Ot,de=l.maxForwardDeg*Math.PI/180,$t=l.maxSideDeg*Math.PI/180,Je=1-Math.exp(-Math.max(0,l.smoothing)*Ot);pt+=(Vn(ge*l.accelGain,-de,de)-pt)*Je,J+=(Vn(-Ee*X*l.turnGain,-$t,$t)-J)*Je;const oe=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;et+=(Vn(X/Math.max(s,1e-6),0,1)-et)*(1-Math.exp(-Math.max(0,oe)*Ot));const Ue=Up({leanForward:pt,leanSide:J,speedRatio:et},l);m.rotation.x+=pt+P,m.rotation.z+=J,d.rotation.x+=Ue.pelvisPitch,d.rotation.z+=Ue.pelvisRoll,d.position.x+=Ue.pelvisX,d.position.z+=Ue.pelvisZ,d.position.y-=Ue.crouch,f.position.y+=Ue.crouch*(1-O)}ft=Q.velocity.x,it=Q.velocity.z,j=Q.bodyYaw,m.rotation.x+=at.upperPitch,m.rotation.z+=at.upperRoll,m.rotation.y+=at.upperYaw;const ht=Vn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),mt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Vn(at.upperShiftX*ht,-mt,mt),m.position.z+=Vn(at.upperShiftZ*ht,-mt,mt),d.position.x+=at.comX,d.position.z+=at.comZ-at.pelvisBack,d.position.y-=at.drop;const Ct=at.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=at.pelvisBack*(1-Ct),f.position.y+=at.drop*(1-Ct),R.joint.rotation.x+=at.knee,F.joint.rotation.x+=at.knee,R.root.rotation.x-=at.hip,F.root.rotation.x-=at.hip,z.root.rotation.x+=at.arm,H.root.rotation.x+=at.arm*.8,Q.attackPhase!=="idle"&&at.intensity===0){const Ot=Q.attackProgress,Ut=Ot<.34?-1:Ot<.68?-1+(Ot-.34)/.34*2:Math.max(0,1-(Ot-.68)/.32),Ht=Math.max(0,-Ut),ie=Math.max(0,Ut);H.root.rotation.x=-1.7*Ht+1.25*ie,H.joint.rotation.x=-(.25+Ht*.45),m.rotation.y=-.28*Ut,I.opacity=Q.attackPhase==="active"?.85:0,Q.attackPhase==="active"&&(Y.rotation.z=-1.1+Ot*3)}else I.opacity=0;const Xt=Cp(It,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Xt,T.rotation.y=(Q.headYaw-Q.bodyYaw-Xt+Math.PI*3)%(Math.PI*2)-Math.PI,K=Hp({root:u,pelvis:d,lower:f,limbs:L,base:N,cfg:U,grounded:!0,attacking:Q.attackPhase!=="idle"})},ik(){return K},dispose(){u.traverse(Q=>{if(Q instanceof fe){Q.geometry.dispose();const _t=Q.material;Array.isArray(_t)?_t.forEach(Ft=>Ft.dispose()):_t.dispose()}})}}}const fa=.012,pa=.016;function YS(n,t){const e=t.lab,i=new Le;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(y){return o.push(y),y}function c(y){return r.push(y),y}function h(y,x,v,w=fa){const S=l(new en({color:x,transparent:!0,opacity:v,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new fe(y,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function u(y,x){return c(new ps(Math.max(y,.001),x,72))}function d(y,x,v,w=pa){const E=document.createElement("canvas"),T=E.getContext("2d");if(!T)return new fe;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';T.font=b,E.width=Gd.ceilPowerOfTwo(Math.ceil(T.measureText(y).width)+32),E.height=Gd.ceilPowerOfTwo(96*1.4);const M=E.getContext("2d");if(!M)return new fe;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=v,M.fillText(y,E.width/2,E.height/2);const R=new jl(E);R.colorSpace=Cn,s.push(R);const F=E.width/E.height,z=c(new Zn(x*F,x)),H=l(new en({map:R,transparent:!0,depthWrite:!1,side:Ve,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new fe(z,H);return L.rotation.x=-Math.PI/2,L.position.y=w,L.renderOrder=3,L}function f(y,x,v,w,S,E){const T=v-x,b=c(new Zn(T,w)),M=h(b,S,E,fa);M.position.set(T/2+x,fa,0);const R=new Le;return R.add(M),R.rotation.y=y-Math.PI/2,R}function m(y,x,v,w,S){const E=new vp;E.moveTo(0,x*.5),E.lineTo(-v*.5,x*.5-v*.9),E.lineTo(-v*.18,x*.5-v*.9),E.lineTo(-v*.18,-x*.5),E.lineTo(v*.18,-x*.5),E.lineTo(v*.18,x*.5-v*.9),E.lineTo(v*.5,x*.5-v*.9),E.closePath();const T=c(new Lh(E)),b=h(T,w,S,fa+.002),M=new Le;return M.add(b),M.rotation.y=y+Math.PI,M}function _(y){var T;const x=new Le,v=d(`${y.index} · ${y.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((T=v.geometry.parameters)==null?void 0:T.width)??3;x.add(v);const E=h(c(new Zn(S*.98,.08)),y.color,.7,pa);return E.position.set(0,pa,t.lab.labelTextHeight*.66),x.add(E),x.position.set(y.labelX,0,y.labelZ),x}const g=new Le;for(const y of n??[]){const x=new Le;if(x.position.set(y.x,0,y.z),y.shape==="square"){const v=y.radius,w=h(c(new Zn(v*2,v*2)),y.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,v,v*2+S,S],[0,-v,v*2+S,S],[-v,0,S,v*2+S],[v,0,S,v*2+S]];for(const[T,b,M,R]of E){const F=h(c(new Zn(M,R)),y.color,e.padOpacity);F.position.x=T,F.position.z=b,x.add(F)}}else x.add(h(c(new Ah(y.radius,72)),y.color,e.padOpacity*.075)),x.add(h(u(y.radius-.075,y.radius),y.color,e.padOpacity));if(y.id==="hub"){for(let v=0;v<4;v++){const w=v*Math.PI/4,S=v%2===0;for(const E of[0,Math.PI])x.add(f(w+E,y.radius*.12,y.radius*.94,S?.09:.055,y.color,S?.5:.32))}x.add(h(u(.5,.56),y.color,.4))}else if(y.id==="dash"){const v=y.spawnZ-y.z,w=-y.radius+.5,S=v-w,E=h(c(new Zn(.06,S)),y.color,.36);E.position.set(0,fa,(v+w)/2),x.add(E);let T=0;for(let M=v;M>=w-.01;M-=1,T++){const R=T%5===0,F=h(c(new Zn(R?2.4:1.3,R?.1:.07)),y.color,R?.72:.42);F.position.set(0,fa,M),x.add(F);const z=d(String(T),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");z.position.set(1.6,pa,M),x.add(z)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of b){const F=v-M,z=h(c(new Zn(1.9,.09)),"#ffffff",.5);z.position.set(-1.5,fa,F),x.add(z);const H=d(R,.42,"rgba(220, 236, 250, 0.86)");H.position.set(-3,pa,F),x.add(H)}}else if(y.id==="gait"){x.add(h(u(1.44,1.5),y.color,.5)),x.add(h(u(1.14,1.2),y.color,.22));const v=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,T]of w){const M=Math.sin(S),R=Math.cos(S),F=m(S,1.7,.34,T,.75);F.position.set(M*1.7*.5,0,v+R*1.7*.5),x.add(F);const z=d(E,.44,T);z.position.set(M*(1.7+.7),pa,v+R*(1.7+.7)),x.add(z)}}if(g.add(x),e.showLabels){const v=_(y);a.push(v),g.add(v)}}i.add(g);const p=n==null?void 0:n.find(y=>y.id==="hub");if(p&&e.showLabels){const y=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,v,w]of y){const S=d(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),pa,p.z+v*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(y){i.visible=y},setLabelsVisible(y){for(const x of a)x.visible=y},dispose(){for(const y of r)y.dispose();for(const y of o)y.dispose();for(const y of s)y.dispose();i.clear()}}}const Ih=64,Gp=[0,.24,.76,1],$S=[0,1,1,0],Vp=[0,.12,.28,.5,.72,.88,1],ZS=[0,.16,.5,1,.5,.16,0];function Qu(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function zh(n,t,e,i,a=Ih,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Vp:Gp,c=s==="glow"?ZS:$S,h=l.length,u=a+1,d=new Float32Array(u*h*3),f=new Float32Array(u*h*4),m=[];for(let g=0;g<u;g++){const p=g/a,y=(p-.5)*e,x=Qu(p,i)*Qu(1-p,i),v=Math.sin(y),w=Math.cos(y);for(let S=0;S<h;S++){const E=o+(r-o)*l[S],T=g*h+S;d[T*3]=v*E,d[T*3+1]=0,d[T*3+2]=w*E;const b=x*c[S];f[T*4]=1,f[T*4+1]=1,f[T*4+2]=1,f[T*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<h-1;p++){const y=g*h+p,x=y+h;m.push(y,x,y+1,y+1,x,x+1)}const _=new nn;return _.setAttribute("position",new pn(d,3)),_.setAttribute("color",new pn(f,4)),_.setIndex(m),_.computeBoundingSphere(),_}function Zc(n){const t=new en({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const h=Math.round(l*32)/32,u=Math.max(.05,Math.round(c*20)/20),d=`${Math.round(h*32)}|${Math.round(u*20)}`,f=e.get(d);if(f)return f;const m=zh(n.radius,n.thickness*u,h,n.edgeFade,Ih,n.profile??"band");if(e.set(d,m),e.size>64){for(const[_,g]of e)if(_!==d&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new fe(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,h,u,d,f=1){const m=Math.max(.05,f);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(u),s.scale.set(h,1,h),s.rotation.y=d,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function tf(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function qS(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,h=s+(c-s)*(.35+.65*r),u=4+4*r+6*l,d=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*l)*r+.04*d),m=1+.02*r+.012*d*r;return{arcRad:h,opacity:f,scale:m,level:r}}function jS(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function KS(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const h=c/n*Math.PI*2,u=Math.sin(h),d=Math.cos(h);for(let f=0;f<a;f++){const m=f/e,_=t+(1-t)*m,g=c*a+f;s[g*3]=u*_,s[g*3+1]=0,s[g*3+2]=d*_;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let h=0;h<e;h++){const u=c*a+h,d=u+a;r.push(u,d,u+1,u+1,d,d+1)}const l=new nn;return l.setAttribute("position",new pn(s,3)),l.setAttribute("color",new pn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function ef(n){const t=n.segments??Ih,e=n.profile??"band",a=((e==="glow"?Vp.length:Gp.length)-1)*6,s=zh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),r=new fe(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,h,u,d,f=1){const m=Math.min(1,Math.max(0,c)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=_,o.opacity=h,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=d,r.visible=h>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function nf(n){const t=new Le,e=KS(48),i=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),a=new fe(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=zh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new en({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Ve,vertexColors:!0,toneMapped:!1}),l=new fe(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,h,u,d,f,m){const _=Math.min(1,Math.max(0,f));t.position.set(c,u,h),a.scale.set(d,1,d),l.scale.set(d,1,d),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function af(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function JS(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function QS(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function tw(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function ew(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function nw(n,t,e){return n?t:e}function Xp(n){return{x:0,y:0,z:1}}function iw(n){return Math.asin(Xp().y)}function aw(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const sw=9.81;function Ws(n,t,e){return n<t?t:n>e?e:n}function ow(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:sw,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,h=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,l+=b.x*M,c+=b.y*M,h+=b.z*M)}if(r<=1e-6)return o;l/=r,c/=r,h/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),d=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:h,centerX:f,centerZ:m,halfX:u,halfZ:d};const g=Ws((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,y=l+(Number.isFinite(e)?e:0)*p,x=h+(Number.isFinite(i)?i:0)*p,v=Math.abs(y-f)/u,w=Math.abs(x-m)/d,S=Ws(1-Math.max(v,w),0,1),E=Math.max(0,Math.abs(y-f)-u),T=Math.max(0,Math.abs(x-m)-d);return{comX:l,comY:c,comZ:h,xcomX:y,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:d,marginX:Ws(1-v,-1,1),marginZ:Ws(1-w,-1,1),score:S,leanDeg:Math.atan2(y-f,x-m)*180/Math.PI,side:v>.98?y>f?1:-1:0,overX:E,overZ:T,grounded:!0}}function rw(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function cw(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Ws(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const th={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},lw=1e-6;function Xn(n,t,e){return n<t?t:n>e?e:n}function qc(n,t){const e=Math.max(.2,n);return Xn(Math.pow(e,-t),.5,2)}function hw(n,t){if(!t.enabled)return{...th};const e=Xn(n.swing,-1,1),i=Xn(n.charge,0,1),a=Xn(n.impact,0,1),s=Xn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),h=Xn(t.chargeArm,.6,1),u=1-(1-h)*c,d=1-(1-h)*i;let f=1;o>0?f=l:c>0?f=u:i>0&&(f=d);const m=1-Xn(t.impactSquash,0,.6)*a;f*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Xn(t.impactSquash,0,.6)*a*.6),y=Xn(t.torsoGain,0,1),x=1+(f-1)*y;return f=Xn(f,.6,1.6),{arm:f,leg:Xn(p,.6,1.4),torso:Xn(x,.7,1.4),girthArm:qc(f,t.volumeExp),girthLeg:qc(p,t.volumeExp),girthTorso:qc(x,t.volumeExp)}}function dw(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function uw(n,t,e){const i=n*Math.exp(-Math.max(lw,e)*Math.max(0,t));return i<.001?0:Xn(i,0,1)}const sf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function ms(n,t,e){return n<t?t:n>e?e:n}function ze(n,t,e){return n+(t-n)*e}function fw(n){return n?typeof n=="string"?{clip:n}:n:null}function pw(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function mw(n,t){const e=n%3*2,i=sf[e],a=sf[e+1];return{...pw(),bodyYaw:ze(i.yaw,a.yaw,t),bodyPitch:ze(i.pitch,a.pitch,t),bodyRoll:ze(i.roll,a.roll,t),pelvisX:ze(i.px,a.px,t),pelvisZ:ze(i.pz,a.pz,t),armPitch:ze(i.ap,a.ap,t),armYaw:ze(i.ay,a.ay,t),armRoll:ze(i.ar,a.ar,t),elbow:ze(i.el,a.el,t),bladePitch:ze(i.blade,a.blade,t)}}function gw(n,t,e,i,a=0){var b,M,R;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=fw(s[r]),c=l?((M=i.clips)==null?void 0:M[l.clip])??null:null,h=ms(((R=i.weaponScale)==null?void 0:R[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,d=l&&Number.isFinite(l.scale)?l.scale:h,f=d*u,m=ms((e+1)/2,0,1),_=c&&c.keys.length>0?cg(c,m):mw(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",y=n==="dual-swords",x=c&&aa(c,"bladeTwistOff")?_.bladeTwistOff:y?_.bladeTwist:0,v=c&&aa(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:lg(c,ms(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&aa(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:v,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*d,yaw:_.armYaw*d,roll:_.armRoll*d,elbow:_.elbow*d},E=c?aa(c,"armLPitch")||aa(c,"armLYaw")||aa(c,"armLRoll")||aa(c,"elbowL"):!1,T=E?{pitch:_.armLPitch*d,yaw:_.armLYaw*d,roll:_.armLRoll*d,elbow:_.elbowL*d}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:T):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=T)),w}function xw(n,t,e){const i=ms(e,0,1),a=(s,o)=>s?o?{pitch:ze(s.pitch,o.pitch,i),yaw:ze(s.yaw,o.yaw,i),roll:ze(s.roll,o.roll,i),elbow:ze(s.elbow,o.elbow,i)}:null:o;return{yaw:ze(n.yaw,t.yaw,i),rootYaw:ze(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:ze(n.pitch,t.pitch,i),roll:ze(n.roll,t.roll,i),pelvisZ:ze(n.pelvisZ,t.pelvisZ,i),pelvisX:ze(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:ze(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:ze(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:ze(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:ze(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:ze(n.bladeYaw,t.bladeYaw,i),bladeYawOff:ze(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:ze(n.strike,t.strike,i),blend:t.blend??null}}function vw(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function of(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function yw(n,t){const e=(a,s)=>Math.abs(vw(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=of(n.armR,t.armR),i+=of(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function _w(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=ms(yw(n,t)/l,0,1);return o+(r-o)*c}function rf(n){const t=ms(n,0,1);return t*t*(3-2*t)}function re(n,t,e){return n<t?t:n>e?e:n}const Ci=1e-6;function Be(n,t,e,i){const a=new fe(new li(n,t,e),new ho({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function Ye(){return new Le}function gr(n,t,e){const i=Ye(),a=Be(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Be(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Be(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Be(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Be(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function Mw(n){const t=gr(.72,.15,n),e=Be(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function bw(n){const t=Ye(),e=Be(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Be(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function Sw(n){const t=Ye(),e=Be(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Be(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new Qt(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function ww(n){const t=Ye();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Be(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Be(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function Ew(n){const t=Ye(),e=Be(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Be(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function Tw(n,t,e,i,a,s,o,r,l,c,h,u,d){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=h??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},y=Ye(),x=Ye();x.name="pelvis",x.position.y=n.legLength,y.add(x);const v=Ye();v.name="lower";const w=Ye();w.name="upper",x.add(v),x.add(w);const S=n.headSize,E=n.legLength,T=n.armLength,b=n.limbThickness,M=n.bodyHeight,R=n.bodyWidth,F=l.spine,z=!!(F!=null&&F.enabled),H=z?re(F.chestPivot??.42,.15,.85)*M:0,L=Ye();L.name="chest",L.position.y=H,w.add(L);const I=z?L:w;let Y,G=null,q=M,st=0;z?(q=Math.max(.05,H),st=Math.max(.05,M-H),Y=Be(R,q,.28,t.body),Y.name="torsoLower",Y.position.y=q/2,w.add(Y),G=Be(R+.008,st,.288,t.body),G.name="torsoUpper",G.position.y=st/2,L.add(G)):(Y=Be(R,M,.28,t.body),Y.name="torso",Y.position.y=M/2,w.add(Y));const gt=Ye();gt.name="headPivot",gt.rotation.order="YXZ",gt.position.y=Math.min(i.headPivotHeight,M)-H,I.add(gt);const dt=Be(S,S,S,t.head);dt.position.y=S/2,gt.add(dt);const ft=new ho({color:"#1b2733"});for(const D of[-1,1]){const Z=new fe(new li(.06,.07,.02),ft);Z.position.set(D*.09,S/2+.03,S/2+.011),gt.add(Z)}const it=D=>{const Z=Ye();Z.name=D<0?"hipL":"hipR",Z.rotation.order="ZYX",Z.position.set(D*(R/2-b/2),0,0),v.add(Z);const ut=Be(b,E/2,b,t.limb);ut.position.y=-E/4,Z.add(ut);const yt=Ye();yt.name="knee",yt.position.y=-E/2,Z.add(yt);const jt=Be(b,E/2,b,t.limb);jt.position.y=-E/4,yt.add(jt);const Zt=Be(b*1.15,.07,b*1.7,t.shoe);Zt.position.set(0,-E/2+.035,.045),yt.add(Zt);const ae=new Ze;ae.name="footTip",ae.position.y=-E/2,yt.add(ae);const me=Ye();return{root:Z,joint:yt,hand:me,wrist:me,tip:ae,upperMesh:ut,lowerMesh:jt,segLen:E/2}},j=D=>{const Z=Ye();Z.name=D<0?"shoulderL":"shoulderR",Z.rotation.order="YXZ",Z.position.set(D*(R/2+b/2),M-.04-H,0),I.add(Z);const ut=Be(b,T/2,b,t.limb);ut.position.y=-T/4,Z.add(ut);const yt=Ye();yt.name="elbow",yt.position.y=-T/2,Z.add(yt);const jt=Be(b,T/2,b,t.limb);jt.position.y=-T/4,yt.add(jt);const Zt=Ye();Zt.name=D<0?"handL":"handR",Zt.position.y=-T/2,yt.add(Zt);const ae=Be(b*1.1,.09,b*1.1,t.head);ae.position.y=.045,Zt.add(ae);const me=Ye();return me.name=D<0?"wristL":"wristR",Zt.add(me),{root:Z,joint:yt,hand:Zt,wrist:me,upperMesh:ut,lowerMesh:jt,segLen:T/2}},pt=it(-1),J=it(1),et=j(-1),K=j(1),St=[pt,J].map(D=>({root:D.root,joint:D.joint,tip:D.tip,upperLen:E/2,lowerLen:E/2,bend:1})),kt=Ye(),Lt=Ye();kt.name="mountR",Lt.name="mountL";const bt=Ye(),V=Ye();bt.name="gripR",V.name="gripL",K.wrist.add(kt),et.wrist.add(Lt),kt.add(bt),Lt.add(V);const ne=Sw(t),Mt=ww(t),Nt=Ew(t),Dt={"sword-shield":{right:gr(.42,.075,t),left:bw(t)},"dual-swords":{right:gr(.42,.075,t),left:gr(.42,.075,t)},greatsword:{right:Mw(t),left:Be(.12,.2,.12,t.wood)},staff:{right:ne.g,left:Ye(),orb:ne.orb},bow:{right:Nt,left:Mt.g,arrow:Nt,drawString:Mt.drawString}};for(const D of Object.keys(Dt))bt.add(Dt[D].right),V.add(Dt[D].left),Dt[D].right.visible=!1,Dt[D].left.visible=!1;function It(D,Z,ut){const yt=new Ze;yt.name="bladeBase",yt.position.y=Z,D.add(yt);const jt=new Ze;jt.name="bladeTip",jt.position.y=ut,D.add(jt)}It(Dt["sword-shield"].right,.44,.55),It(Dt["dual-swords"].right,.44,.55),It(Dt["dual-swords"].left,.44,.55),It(Dt.greatsword.right,.74,.88),It(Dt.staff.right,.78,.92);let Rt=null,k=null,A=1,$=0,ot=0,tt=null,rt=0,zt=0,Q=0,_t=0,Ft=0,at=0,vt=HS(),X={...kh},ct=0,xt=0,Vt=0,Bt=-1,Yt=0,B=0,Et=0,nt=0,lt=0,Pt=0,Tt=0,Kt=1,ee=0,ce=0,te=0,we=!1,be=0,_n=0,an=0,De=0,Me="none",qe=0,Dn=1,We=!1,Mn=-1,mn=!1,ve=0,bn=0,Fe=0,kn={...th},In=0,C=0,P={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},N=NaN,U=0,O=0,ht=0,mt=NaN,Ct=NaN,Xt=-1,Ot=null,Ut=null,Ht=0,ie=1,ye=.1,ge=null,Ee={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},de=null,$t=null,Je=null,oe=null,Ue=null,Sn=null,He="R",wn=0,pe=0,ke=0,At=0,wt=1,qt=0,Ie=null,Ne=0,ea=0,Yn=NaN,na=NaN,Ts={speed:0,phase:0},Kn={lp:0,lr:0,rp:0,rr:0},go=0,Ra=0,Pa=!0,As=0,Rs="none",Ca=0,La=0,Da=0,xo=.3,Fh=0;function Wp(D){const Z=Math.PI/180,ut=s;let yt=0,jt=0,Zt=0,ae=0;D==="sword-shield"?(yt=ut.swordPitchDeg*Z,Zt=ut.shieldPitchDeg*Z):D==="dual-swords"?(yt=ut.swordPitchDeg*Z,Zt=ut.swordPitchDeg*Z):D==="greatsword"?(yt=ut.greatswordPitchDeg*Z,Zt=ut.greatswordPitchDeg*Z):D==="staff"?yt=ut.staffPitchDeg*Z:Zt=ut.bowPitchDeg*Z,kt.rotation.set(yt,0,jt),Lt.rotation.set(Zt,0,ae),kt.position.x=D==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function Uh(D){if(D!==Rt){Rt=D;for(const Z of Object.keys(Dt))Dt[Z].right.visible=Z===D,Dt[Z].left.visible=Z===D;Wp(D),Mt.drawString.position.z=-.06,Nt.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0}}Uh("sword-shield");const Nh=[];y.traverse(D=>{D instanceof fe&&D.material instanceof ho&&Nh.push(D.material)});const Yp=new Qt(r.flashColor);function $p(D,Z){const ut=Fp(D,Z,r);vt=ut,w.rotation.x+=ut.upperPitch,w.rotation.z+=ut.upperRoll,w.rotation.y+=ut.upperYaw;const yt=re(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),jt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=re(ut.upperShiftX*yt,-jt,jt),w.position.z+=re(ut.upperShiftZ*yt,-jt,jt),x.position.x+=ut.comX,x.position.z+=ut.comZ-ut.pelvisBack,x.position.y-=ut.drop;const Zt=ut.legacy?0:re(r.lowerScale,0,1);v.position.z+=ut.pelvisBack*(1-Zt),v.position.y+=ut.drop*(1-Zt),pt.joint.rotation.x+=ut.knee,J.joint.rotation.x+=ut.knee,pt.root.rotation.x-=ut.hip,J.root.rotation.x-=ut.hip,et.root.rotation.x+=ut.arm,K.root.rotation.x+=ut.arm*.8;for(const ae of Nh)ae.emissive.copy(Yp).multiplyScalar(ut.flash)}function vo(D){return D<.22?-1:D<.42?-1+(D-.22)/.2*2:D<.5?1:Math.max(0,1-(D-.5)/.5)}function Zp(D){for(const Z of[et,K])Z.upperMesh.scale.set(D.girthArm,D.arm,D.girthArm),Z.upperMesh.position.y=-Z.segLen/2*D.arm,Z.joint.position.y=-Z.segLen*D.arm,Z.lowerMesh.scale.set(D.girthArm,D.arm,D.girthArm),Z.lowerMesh.position.y=-Z.segLen/2*D.arm,Z.hand.position.y=-Z.segLen*D.arm;for(const Z of[pt,J])Z.upperMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),Z.upperMesh.position.y=-Z.segLen/2*D.leg,Z.joint.position.y=-Z.segLen*D.leg,Z.lowerMesh.scale.set(D.girthLeg,D.leg,D.girthLeg),Z.lowerMesh.position.y=-Z.segLen/2*D.leg,Z.tip.position.y=-Z.segLen*D.leg;Y.scale.set(D.girthTorso,D.torso,D.girthTorso),Y.position.y=q/2*D.torso,G&&(G.scale.set(D.girthTorso,D.torso,D.girthTorso),G.position.y=st/2*D.torso,L.position.y=q*D.torso)}function qp(D,Z){const ut=s.twoHandGripY??-.16,yt=Math.max(1,s.twoHandMaxStretch??1.25),jt=T*yt*.99,Zt=et.root.position.x,ae=et.root.position.y,me=et.root.position.z,ue=et.root.rotation.y,Ge=Math.cos(ue),ln=Math.sin(ue),je=Bi=>{const Ia=kt.localToWorld(new W(0,Bi,0)),Tn=(z?L:w).worldToLocal(Ia),za=Tn.x-Zt,Wr=Tn.y-ae,Mo=Tn.z-me,Fa={x:za*Ge-Mo*ln,y:Wr,z:za*ln+Mo*Ge};return{t:Fa,dist:Math.hypot(Fa.x,Fa.y,Fa.z)}};let xe=ut,Te=je(xe);if(!Number.isFinite(Te.dist)||Te.dist<=Ci)return;for(let Bi=0;Bi<18&&Te.dist>jt;Bi++)if(xe*=.78,Te=je(xe),!Number.isFinite(Te.dist)||Te.dist<=Ci)return;Number.isFinite(N)||(N=xe);const sn=Math.max(0,s.twoHandSlideRate??9);N+=(xe-N)*(1-Math.exp(-sn*Z));const En=je(N),Qe=En.t,Jn=En.dist,Nn=Jn/Math.max(Ci,T),Qn=re(Nn,1,yt),hi=Math.max(1,s.twoHandGripStart??1.02),Ni=Math.max(hi+.001,yt),Oi=re(s.twoHandMinGrip??1,0,1),On=re((Nn-hi)/(Ni-hi),0,1),di=1-On*On*(3-2*On)*(1-Oi),Bn=T/2*Qn,ka=Np(Qe,Bn,Bn,-1),Si=Op({rootPitch:et.root.rotation.x,rootRoll:et.root.rotation.z,jointPitch:et.joint.rotation.x},ka,re(D*di,0,1),Math.PI);et.root.rotation.x=Si.rootPitch,et.root.rotation.z=Si.rootRoll,et.joint.rotation.x=Math.min(Si.jointPitch,-.06);const ti=1/Math.sqrt(Qn);et.upperMesh.scale.set(ti,Qn,ti),et.upperMesh.position.y=-Bn/2,et.joint.position.y=-Bn,et.lowerMesh.scale.set(ti,Qn,ti),et.lowerMesh.position.y=-Bn/2,et.hand.position.y=-Bn,P={active:!0,dist:Jn,gy:N,pitch:Si.rootPitch,joint:et.joint.rotation.x,grip:di}}function jp(D,Z){if(!m.enabled){U=0,O=0,K.wrist.rotation.set(0,0,0),mt=K.root.rotation.x,Ct=Vh();return}const ut=K.root.rotation.x,yt=Vh();if(Z!==Xt){Xt=Z,mt=ut,Ct=yt,K.wrist.rotation.set(U,0,O);return}if(!Number.isFinite(mt)||D<=1e-5){mt=ut,Ct=yt,K.wrist.rotation.set(U,0,O);return}const jt=(ut-mt)/D,Zt=Xe(yt-Ct)/D;mt=ut,Ct=yt;const ae=Math.max(0,m.maxAngle),me=Math.max(0,m.maxTwist),ue=.15+.85*re(pe,0,1),ln=-re(ht,0,1.4)*Math.max(0,m.runDrag),je=re(-jt*m.lag*ue+ln,-ae,ae),xe=re(Zt*m.twistLag*ue,-me,me),Te=1-Math.exp(-Math.max(0,m.rate)*D);U+=(je-U)*Te,O+=(xe-O)*Te,K.wrist.rotation.set(U,0,O)}function Kp(D){const Z=Math.PI/180;return D==="greatsword"?s.greatswordPitchDeg*Z:D==="staff"?s.staffPitchDeg*Z:D==="bow"?s.bowPitchDeg*Z:s.swordPitchDeg*Z}function Vr(D){const Z=Math.PI/180;return D==="sword-shield"?s.shieldPitchDeg*Z:D==="greatsword"?s.greatswordPitchDeg*Z:D==="bow"?s.bowPitchDeg*Z:s.swordPitchDeg*Z}function Jp(D){const Z=Math.PI/180;return D==="sword-shield"||D==="dual-swords"?(s.swordCantDeg??0)*Z:D==="greatsword"?(s.greatswordCantDeg??0)*Z:0}function Qp(D,Z){const ut=D.weapon;if(ut==="staff"||ut==="bow")return;const yt=He==="R",jt=yt?K:et,Zt=yt?kt:Lt,ae=yt?et:K,me=yt?Lt:kt,ue=ut==="greatsword"&&yt?at:0,Ge=ut==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,ln=Math.PI/180,je=-Ge*ln,xe=Ge*ln,Te=(On,di)=>{const Bn=Math.max(0,Math.PI/2-Math.abs(di));return Math.sign(On)*Math.min(Math.abs(On),Bn)},sn=(de??Kp(ut)+$)+ue,En=Z+jt.root.rotation.x+jt.joint.rotation.x;Zt.rotation.set(Math.PI/2-sn-En,0,Te(yt?je:xe,sn));const Qe=$t??(ut==="sword-shield"?null:Vr(ut)+ot),Jn=Z+ae.root.rotation.x+ae.joint.rotation.x;ut==="sword-shield"?me.rotation.x=Qe===null?Vr(ut):Vr(ut)-Qe-Jn:me.rotation.set(Math.PI/2-(Qe??0)-Jn,0,Te(yt?xe:je,Qe??0));const Nn=Jp(ut),Qn=Ue??0,hi=Sn??0,Ni=Je??0,Oi=oe??0;yt?(bt.rotation.z=-Nn+Qn,bt.rotation.y=Ni,V.rotation.z=Nn+hi,V.rotation.y=Oi):(V.rotation.z=Nn+Qn,V.rotation.y=Ni,bt.rotation.z=-Nn+hi,bt.rotation.y=Oi)}function Oh(D){de=D.bladePitch,$t=D.bladePitchOff,Je=D.bladeTwist,oe=D.bladeTwistOff,Ue=D.bladeYaw,Sn=D.bladeYawOff,He=D.lead,wn=D.rootYaw+D.spinYaw,y.rotation.y=wn,w.rotation.y+=D.yaw,w.rotation.x+=D.pitch,w.rotation.z+=D.roll,x.position.z+=D.pelvisZ,x.position.x+=D.pelvisX,D.armR&&(K.root.rotation.x=D.armR.pitch,K.root.rotation.y=D.armR.yaw,K.root.rotation.z=D.armR.roll,K.joint.rotation.x=D.armR.elbow),D.armL&&(et.root.rotation.x=D.armL.pitch,et.root.rotation.y=D.armL.yaw,et.root.rotation.z=D.armL.roll,et.joint.rotation.x=D.armL.elbow)}function Bh(D,Z){const ut=ge??vo(D.attackProgress),yt=gw(D.weapon,D.comboIndex,ut,p,D.attackProgress);if(D.comboIndex!==Ht){Ut=Ot,ie=0,Ht=D.comboIndex;const ae=D.timings.windup+D.timings.active+D.timings.recovery,me=Math.max(p.segBlendMin??.03,ae*.22);ye=_w(Ut,yt,p,yt.blend??null,me)}const jt=Math.max(.008,ye);ie=Math.min(1,ie+Z/jt);const Zt=Ut&&ie<1?xw(Ut,yt,rf(ie)):yt;return Ot=Zt,Zt}function tm(D,Z){const ut=R/2+b/2,yt=M-.04-H;if(!p.enabled){et.root.position.set(-ut,yt,0),K.root.position.set(ut,yt,0),Ee={lx:-ut,ly:yt,lz:0,rx:ut,ry:yt,rz:0};return}const jt=Math.max(0,p.shoulderLift),Zt=Math.max(0,p.shoulderPush),ae=D&&Z==="greatsword"?Math.max(0,p.shoulderIn):0,me=En=>jt*re((-En-.5)/1.45,0,1),ue=En=>Zt*re((-En-.2)/1.9,0,1),Ge=-ut+ae,ln=yt+me(et.root.rotation.x),je=ue(et.root.rotation.x),xe=ut-ae,Te=yt+me(K.root.rotation.x),sn=ue(K.root.rotation.x);et.root.position.set(Ge,ln,je),K.root.position.set(xe,Te,sn),Ee={lx:Ge,ly:ln,lz:je,rx:xe,ry:Te,rz:sn}}function em(D){if(D.phase==="idle"||D.charging)return;const Z=D.attackProgress,ut=vo(Z),yt=Math.max(0,ut),jt=D.comboIndex%2===0?1:-1,Zt=l.stride,ae=Number.isFinite(Zt.stepReach)?Zt.stepReach:.17,me=Number.isFinite(Zt.stepSideReach)?Zt.stepSideReach:.14,ue=Number.isFinite(Zt.stepDipReach)?Zt.stepDipReach:.05,Ge=D.weapon==="greatsword"?re(Number.isFinite(Zt.heavyScale)?Zt.heavyScale:1,0,1):1;x.position.z+=ae*yt*Ge,x.position.x+=jt*me*yt*Ge,x.position.y-=ue*Math.sin(Math.PI*Z)*Ge}let Hh=null;function nm(){Hh={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:et.root.rotation.x,lry:et.root.rotation.y,lrz:et.root.rotation.z,lj:et.joint.rotation.x,rrx:K.root.rotation.x,rry:K.root.rotation.y,rrz:K.root.rotation.z,rj:K.joint.rotation.x,rootY:y.rotation.y}}function im(D){const Z=Hh;if(!Z)return;const ut=rf(re(D,0,1));if(ut>=1)return;const yt=(jt,Zt)=>jt+(Zt-jt)*ut;w.rotation.x=yt(Z.upperX,w.rotation.x),w.rotation.y=yt(Z.upperY,w.rotation.y),w.rotation.z=yt(Z.upperZ,w.rotation.z),w.position.x=yt(Z.upperPX,w.position.x),w.position.z=yt(Z.upperPZ,w.position.z),x.position.x=yt(Z.pelvisX,x.position.x),x.position.y=yt(Z.pelvisY,x.position.y),x.position.z=yt(Z.pelvisZ,x.position.z),x.rotation.x=yt(Z.pelvisRX,x.rotation.x),x.rotation.z=yt(Z.pelvisRZ,x.rotation.z),et.root.rotation.x=yt(Z.lrx,et.root.rotation.x),et.root.rotation.y=yt(Z.lry,et.root.rotation.y),et.root.rotation.z=yt(Z.lrz,et.root.rotation.z),et.joint.rotation.x=yt(Z.lj,et.joint.rotation.x),K.root.rotation.x=yt(Z.rrx,K.root.rotation.x),K.root.rotation.y=yt(Z.rry,K.root.rotation.y),K.root.rotation.z=yt(Z.rrz,K.root.rotation.z),K.joint.rotation.x=yt(Z.rj,K.joint.rotation.x),y.rotation.y=Z.rootY+Xe(y.rotation.y-Z.rootY)*ut,wn=y.rotation.y}let Ps=null,Xr=0,Gh=0;function am(){if(!z)return;const D=F,Z=Math.max(0,D.waist??1),ut=Math.max(0,D.chest??0),yt=Z+ut,jt=yt>1e-6?Z/yt:1,Zt=yt>1e-6?ut/yt:0,ae=w.rotation.x,me=w.rotation.y,ue=w.rotation.z;w.rotation.set(ae*jt,me*jt,ue*jt),L.rotation.set(ae*Zt,me*Zt,ue*Zt);const Ge=re(D.neck??0,0,1);Ge>0&&(gt.rotation.x-=ae*Ge),Ps={x:ae,y:me,z:ue}}function yo(){return{yaw:w.rotation.y+(z?L.rotation.y:0),pitch:w.rotation.x+(z?L.rotation.x:0),lean:w.rotation.z+(z?L.rotation.z:0)}}function Vh(){return yo().yaw}function sm(D,Z){if(!(d!=null&&d.enabled)){Ie=null,Ne=0;return}y.updateWorldMatrix(!0,!0);const ut=new W,yt=[],jt=(ti,Bi,Ia=0)=>{ti.getWorldPosition(ut),yt.push({x:ut.x,y:ut.y+Ia,z:ut.z,mass:Bi})},Zt=n.headSize;jt(gt,.08,Zt/2),jt(Y,.14),jt(G??L,.24),jt(x,.12),jt(et.hand,.05),jt(K.hand,.05),jt(pt.joint,.15),jt(J.joint,.15);const ae=Rt?_o(Dt[Rt].right):null;ae&&yt.push({x:(ae.base.x+ae.tip.x)/2,y:(ae.base.y+ae.tip.y)/2,z:(ae.base.z+ae.tip.z)/2,mass:Rt==="greatsword"?.09:.04});const me=Math.max(.05,n.limbThickness*1.15/2+.015),ue=Math.max(.06,n.limbThickness*1.7/2+.02);let Ge=1/0,ln=-1/0,je=1/0,xe=-1/0,Te=0;for(const ti of[pt,J])ti.tip.getWorldPosition(ut),ut.y<=.13&&(Te+=1),Ge=Math.min(Ge,ut.x-me),ln=Math.max(ln,ut.x+me),je=Math.min(je,ut.z-ue),xe=Math.max(xe,ut.z+ue);(!Number.isFinite(Ge)||Te===0)&&(Ge=ln=je=xe=0);let sn=0,En=0;Number.isFinite(Yn)&&Z>1e-5&&(sn=re((D.position.x-Yn)/Z,-20,20),En=re((D.position.z-na)/Z,-20,20)),Yn=D.position.x,na=D.position.z;const Qe=ow(yt,{minX:Ge,maxX:ln,minZ:je,maxZ:xe},sn,En,d);if(Ie=Qe,!d.autoCounter){Ne=0;return}const Jn=Math.cos(D.bodyYaw),Nn=-Math.sin(D.bodyYaw),Qn=Qe.xcomX-Qe.centerX,hi=Qe.xcomZ-Qe.centerZ,Ni=Qn*Jn+hi*Nn,Oi=sn*Jn+En*Nn,On=Qe.grounded?rw(Ni,Oi,d.predLead??0):0;Gh=On;const di=Math.abs(On)-.45*Qe.halfX;ea=di;let Bn=0;di>.002&&Qe.grounded&&(Bn=-Math.sign(On)*Math.min(Math.max(.005,d.maxShift??.045),(di+.002)*1.1666666666666667));const ka=Math.abs(On)/Math.max(1e-4,Qe.halfX),Si=Math.max(.1,cw(d.counterRate,ka,d.counterBoost??0));Ne+=(Bn-Ne)*(1-Math.exp(-Si*Z))}function om(D,Z){if(Mt.drawString.position.z=-.06,Nt.position.z=0,ne.orb.scale.setScalar(1),w.rotation.y=0,D.charging&&D.weapon==="bow"){const Zt=D.charge;et.root.rotation.x=-1.25,et.joint.rotation.x=-.15,K.root.rotation.x=.35+Zt*.3,K.joint.rotation.x=-1.15,Mt.drawString.position.z=-.06-Zt*.22,Nt.position.z=-Zt*.3,w.rotation.y=-.22;return}if(D.phase==="idle"&&ke<=.001){Ut=null,Ot=null,Ht=0,ie=1,ye=Math.max(.008,p.segBlend),de=null,$t=null,Je=null,oe=null,Ue=null,Sn=null,N=NaN,D.weapon==="greatsword"&&(kt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const ut=vo(D.attackProgress),yt=Math.max(0,-ut),jt=Math.max(0,ut);if(D.weapon==="bow")et.root.rotation.x=-1.2,et.joint.rotation.x=-.15,K.root.rotation.x=.9-jt*.8,K.joint.rotation.x=-.3;else if(D.weapon==="greatsword")if(p.enabled)Oh(Bh(D,Z));else{const Zt=-1.6*yt+1.25*jt,ae=re(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);K.root.rotation.x=Zt,K.joint.rotation.x=-(.25+yt*.4),et.root.rotation.x=Zt+.06,et.joint.rotation.x=-(.32+yt*.4),et.root.rotation.z=.42,K.root.rotation.z=0;const me=-Math.sin(K.root.rotation.x);K.root.rotation.y=-.72*Math.tanh(me*4),w.rotation.y=-.2*ut*ae}else if(p.enabled)Oh(Bh(D,Z));else{const Zt=D.comboIndex;if(Zt===1)K.root.rotation.x=-1.7*yt+1.1*jt,K.joint.rotation.x=-(.2+yt*.5),et.root.rotation.x=.1,w.rotation.y=-.18*ut;else if(Zt===2)et.root.rotation.x=-1.5*yt+1*jt,et.joint.rotation.x=-(.2+yt*.5),K.root.rotation.x=.2,w.rotation.y=.45*-ut;else{const ae=-1.9*yt+1.2*jt;et.root.rotation.x=ae,K.root.rotation.x=ae,et.joint.rotation.x=-(.15+yt*.4),K.joint.rotation.x=-(.15+yt*.4),w.rotation.y=-.3*ut}}if(D.weapon==="greatsword"){const Zt=re((-K.root.rotation.x-1.3)/1.2,0,1);kt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Zt)}em(D)}function rm(D,Z){D&&(K.root.rotation.x=-1.05,K.joint.rotation.x=-.35,et.root.rotation.x=-.45,et.joint.rotation.x=-.2,w.rotation.y=-.12,ne.orb.scale.setScalar(1.25+.12*Math.sin(Z*2)))}function cm(D){if(!D||D.phase==="idle")return;const Z=D.progress,ut=Z<.3?-.35+Z/.3*1.35:Z<.7?1:Math.max(0,1-(Z-.7)/.3),yt=Math.PI/180;w.rotation.x+=_.leanDeg*yt*ut,et.root.rotation.x-=_.shieldPitchDeg*yt*ut,et.joint.rotation.x-=.22*ut,K.root.rotation.x-=.3*ut,x.position.z+=_.pelvisReach*Math.max(0,ut)}function _o(D){if(!D)return null;const Z=D.getObjectByName("bladeBase"),ut=D.getObjectByName("bladeTip");if(!Z||!ut)return null;D.updateWorldMatrix(!0,!1);const yt=Z.getWorldPosition(new W),jt=ut.getWorldPosition(new W),Zt=new W().setFromMatrixColumn(D.matrixWorld,0).normalize();return{base:{x:yt.x,y:yt.y,z:yt.z},tip:{x:jt.x,y:jt.y,z:jt.z},normal:{x:Zt.x,y:Zt.y,z:Zt.z}}}return{group:y,update(D,Z,ut,yt,jt=!1,Zt,ae,me){var ed;Uh(Z.weapon),y.rotation.y=0,wn=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,L.rotation.set(0,0,0),v.position.x=0,v.position.y=0,v.position.z=0,v.rotation.z=0;const ue=Math.max(1/240,Math.min(yt,.1));tt=((ed=l.stance)==null?void 0:ed[Z.weapon])??null,k!==Z.weapon&&(k=Z.weapon,A=tt?0:1);const Ge=Math.max(.01,(tt==null?void 0:tt.blend)??.22);A=Math.min(1,A+ue/Ge);const ln=tt?A:0;$=((tt==null?void 0:tt.bladePitchDeg)??0)*Math.PI/180*ln,ot=((tt==null?void 0:tt.bladePitchOffDeg)??0)*Math.PI/180*ln;const je=Zt===void 0?go+=yt:Zt;Ra=je;const xe=l.landing;xe.enabled?Pa&&!D.grounded?(Rs="jump",Ca=je,La=xe.anticipationDuration,Da=Math.max(0,xe.jumpAnticipation),xo=.32):!Pa&&D.grounded&&(Rs="land",Ca=je,La=xe.duration,Da=BS(As,xe),xo=xe.compressRatio,Fh=As):(Rs="none",Da=0),je<Ca&&(Rs="none",Da=0),Pa=D.grounded,As=D.velocity.y;const Te=Ju(je,Ca,La,Da,xo),sn=Z.phase!=="idle",En=(me==null?void 0:me.phase)==="active";pe=FS(pe,sn,ue,l.attack.blendRate);const Qe=US(pe,l.attack.gaitWeight,l.attack.lowerBodyWeight);At=Qe.attackLegWeight,wt=Qe.gaitScale;const Jn=Math.sin(D.bodyYaw),Nn=Math.cos(D.bodyYaw),Qn=(D.velocity.x-rt)/ue,hi=(D.velocity.z-zt)/ue,Ni=re(Qn,-60,60),Oi=re(hi,-60,60),On=Ni*Jn+Oi*Nn,di=Xe(D.bodyYaw-Q)/ue,Bn=Math.hypot(D.velocity.x,D.velocity.z),ka=o.maxForwardDeg*Math.PI/180,Si=o.maxSideDeg*Math.PI/180,ti=re(On*o.accelGain,-ka,ka),Bi=re(-di*Bn*o.turnGain,-Si,Si),Ia=1-Math.exp(-o.smoothing*ue);_t+=(ti-_t)*Ia,Ft+=(Bi-Ft)*Ia,rt=D.velocity.x,zt=D.velocity.z,Q=D.bodyYaw;const Tn=Math.hypot(D.velocity.x,D.velocity.z),za=re(a.knockGaitScale??0,0,1),Wr=ut.knockX*za,Mo=ut.knockZ*za,Fa=za>0&&Math.hypot(ut.knockX,ut.knockZ)>.001,Yr=D.velocity.x+Wr,$r=D.velocity.z+Mo,Xh=Math.hypot(Yr,$r);De=Xh;const lm=Math.cos(D.bodyYaw),hm=-Math.sin(D.bodyYaw),dm=D.velocity.x*lm+D.velocity.z*hm,Wh=Tn>Ci?re(dm/Tn,-1,1):0,Yh=Tn>Ci?re((D.velocity.x*Jn+D.velocity.z*Nn)/Tn,-1,1):1,um=Dh(Yh,a.backStrafeStartDeg,a.backStrafeFullDeg);Me==="settled"&&mn&&ve>bn*1.02+1e-4&&(Me="none");let Cs=1;Me==="blend"?(Cs=Dp(We?Mn:qe,a.stopYawBlendMode,We),We||(qe=Math.min(1,qe+ue/Math.max(.01,a.stopYawAfterSec)),(qe>=1||a.stopYawBlendMode==="inStop"||mn)&&(Me="settled",Cs=0))):Me==="settled"&&(Cs=re(Tn/Math.max(Ci,a.stopEnterRatio*e),0,1)),Dn=Cs;const fm=Ap(Wh,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),pm=Rp(Yh,Wh,fm,um)*Cs;xt+=(pm-xt)*(1-Math.exp(-i.hipYawSmoothing*ue));const Ls=D.bodyYaw+xt;Vt=Ls;const mm=Math.sin(Ls),gm=Math.cos(Ls),xm=Math.cos(Ls),vm=-Math.sin(Ls),ui={speed:Xh,phase:D.gaitPhase,localForward:Yr*mm+$r*gm,localRight:Yr*xm+$r*vm,stride:D.stride};sn&&!we&&(te=D.gaitPhase),we=sn;const Ua=pe>0?IS(ui,Z.attackProgress,Z.comboIndex,pe,l.stride,te):ui;Ts=Ua;const $h=Math.max(0,a.stopBlendSec||0),Zh=$h>0&&!sn&&!Fa&&D.grounded,Zr=Pp(Tn,ee,e,a.stopEnterRatio,a.stopExitRatio);if(!Zh||Zr.resume)Bt=-1;else if(Bt<0&&Zr.enter){Bt=0,Yt=D.gaitPhase,B=Ep(D.gaitPhase),Et=Tn,nt=Math.max(D.stride,Ci),lt=ui.localForward,Pt=ui.localRight;const Jt=1/Math.max(Ci,Tn);Tt=D.velocity.x*Jt,Kt=D.velocity.z*Jt}const ym=ee;ee=Tn;const fi=Zh&&Bt>=0;fi&&(Bt=Math.min(1,Bt+ue/$h)),fi&&Me!=="blend"&&(Me="blend",qe=0),We=fi&&Bt<1,Mn=Bt,mn=Zr.resume,ve=Tn,bn=ym;const qh=fi?{phase:Yt,speed:Et,moveSpeed:e,localForward:lt,localRight:Pt,legLength:n.legLength,stride:nt,grounded:!0}:{phase:Ua.phase,speed:Ua.speed,moveSpeed:e,localForward:Ua.localForward,localRight:Ua.localRight,legLength:n.legLength,stride:Ua.stride??0,grounded:D.grounded};let qr=fi?Tp(qh,a,{progress:Bt,phase0:Yt,phaseEnd:B}):Lr(qh,a);const ia=l.attack.moveTakeover;if(ia&&!fi){const Jt=Z.phase==="windup"?ia.windup:Z.phase==="recovery"?ia.recovery:Z.phase==="settle"?ia.settle:0,se=Math.max(.05,ia.full-ia.speed),gn=re((ui.speed-ia.speed)/se,0,1),An=re(Jt,0,1)*gn,bo=An>qt?10:6;qt=re(qt+(An-qt)*(1-Math.exp(-bo*ue)),0,1)}else fi?qt=0:qt=re(qt*Math.exp(-8*ue),0,1);if(qt>.001&&!fi){const Jt=Lr({phase:ui.phase,speed:ui.speed,moveSpeed:e,localForward:ui.localForward,localRight:ui.localRight,legLength:n.legLength,stride:ui.stride??0,grounded:D.grounded},a);qr=NS(qr,Jt,qt)}const Ae=OS(qr,Qe.gaitScale);if(Fe=0,En&&me){const Jt=LS(me.progress,me.dir,a),se=Qe.gaitScale;Ae.legL.pitchX+=Jt.legL.pitchX*se,Ae.legL.rollZ+=Jt.legL.rollZ*se,Ae.legL.kneeX+=Jt.legL.kneeX*se,Ae.legR.pitchX+=Jt.legR.pitchX*se,Ae.legR.rollZ+=Jt.legR.rollZ*se,Ae.legR.kneeX+=Jt.legR.kneeX*se,Ae.pelvisY+=Jt.pelvisY*se,Fe=Jt.env}let jr=0,Kr=0,Jr=0,jh=0;if(fi){const Jt=Lp(D.bodyYaw,Tt,Kt),se=kp(Bt,Yt,Jt.forward,Jt.right,a);se.leadLeft?(Ae.legL.pitchX-=se.leadPitch,Ae.legL.kneeX+=se.leadKnee,Ae.legR.pitchX+=se.trailPitch):(Ae.legR.pitchX-=se.leadPitch,Ae.legR.kneeX+=se.leadKnee,Ae.legL.pitchX+=se.trailPitch),Kr=se.bodyShift*se.fwdN,jr=se.bodyShift*se.rightN,Jr=se.bodyDip,jh=se.chestPitch,be=se.leadPitch,_n=se.bodyShift,an=se.bodyDip}else be=0,_n=0,an=0;if(Kn={lp:Ae.legL.pitchX,lr:Ae.legL.rollZ,rp:Ae.legR.pitchX,rr:Ae.legR.rollZ},!D.grounded)pt.root.rotation.x=-.55,J.root.rotation.x=-.25,pt.joint.rotation.x=.75,J.joint.rotation.x=.55,et.root.rotation.x=-.9,K.root.rotation.x=-.7,et.joint.rotation.x=-.6,K.joint.rotation.x=-.6,pt.root.rotation.z=0,J.root.rotation.z=0;else{pt.root.rotation.x=Ae.legL.pitchX,J.root.rotation.x=Ae.legR.pitchX,pt.root.rotation.z=Ae.legL.rollZ,J.root.rotation.z=Ae.legR.rollZ,pt.joint.rotation.x=Ae.legL.kneeX,J.joint.rotation.x=Ae.legR.kneeX;const Jt=tt?A:0,se=1+(((tt==null?void 0:tt.armSwing)??1)-1)*Jt,gn=tt==null?void 0:tt.armR,An=tt==null?void 0:tt.armL,bo=Ae.armL*se+((An==null?void 0:An.pitch)??0)*Jt,nd=Ae.armR*se+((gn==null?void 0:gn.pitch)??0)*Jt;et.root.rotation.x=bo,K.root.rotation.x=nd,et.joint.rotation.x=-(.18+bo*.2)+((An==null?void 0:An.elbow)??0)*Jt,K.joint.rotation.x=-(.18+nd*.2)+((gn==null?void 0:gn.elbow)??0)*Jt,et.root.rotation.z=((An==null?void 0:An.roll)??0)*Jt,K.root.rotation.z=((gn==null?void 0:gn.roll)??0)*Jt,et.root.rotation.y=((An==null?void 0:An.yaw)??0)*Jt,K.root.rotation.y=((gn==null?void 0:gn.yaw)??0)*Jt,x.position.x=Ae.pelvisX,x.position.y=E+Ae.pelvisY,x.position.z=0,x.rotation.z=Ae.pelvisRoll}const _m=Bp(x,v),Ds=En?{...f,weight:0}:fi&&f.enabled?{...f,weight:1}:f,Kh=Ds.enabled&&D.grounded&&Ds.weight>0?re(Ds.weight,0,1)*(sn?re(Ds.attackScale,0,1):1):0;x.position.x+=jr,x.position.z+=Kr,x.position.y-=Jr,v.position.y+=Jr,Kh<=0&&(v.position.x-=jr,v.position.z-=Kr);const Qr=Tn/Math.max(e,Ci);ht=Qr;const Mm=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,bm=1-Math.exp(-Math.max(0,Mm)*ue);ct+=(re(Qr,0,1)-ct)*bm;const Na=Up({leanForward:_t,leanSide:Ft,speedRatio:ct},o);x.rotation.x+=Na.pelvisPitch,x.rotation.z+=Na.pelvisRoll,x.position.x+=Na.pelvisX,x.position.z+=Na.pelvisZ,x.position.y-=Na.crouch,v.position.y+=Na.crouch*(1-re(Kh,0,1));const Jh=Z.phase!=="idle"||Z.charging&&Z.weapon==="bow",tc=Jh?1:0,Sm=Math.max(.001,tc>ke?p.poseIn??.1:p.poseOut??.16);if(ke!==tc){const Jt=ue/Sm;ke=re(ke+(tc>ke?Jt:-Jt),0,1)}if((ke>0||Jh)&&nm(),om(Z,ue),ke>0&&ke<1&&im(ke),tt){const Jt=(1-ke)*A;w.rotation.y+=(tt.torsoYaw??0)*Jt,w.rotation.x+=(tt.torsoPitch??0)*Jt}rm(jt,D.gaitPhase),cm(ae);const wm=Z.weapon==="greatsword",Qh=Math.hypot(D.velocity.x,D.velocity.z),Em=wm&&Z.phase==="idle"&&Qh>.5?Math.min(1.15,Qh/Math.max(e,.001)*.9):0;at+=(Em-at)*(1-Math.exp(-6*ue));const Tm=w.rotation.x;Z.weapon==="bow"&&(Mt.g.rotation.x=-(et.root.rotation.x+et.joint.rotation.x),Nt.rotation.x=-(K.root.rotation.x+K.joint.rotation.x));const Am=w.rotation.y;$p(ut,D.bodyYaw);const td=ut.type==="none"?1:.4;if(w.rotation.x+=_t*td+jh,w.rotation.z+=(Ft+Ae.sideLean)*td,Te>0&&(pt.root.rotation.x-=xe.hipPitch*Te,J.root.rotation.x-=xe.hipPitch*Te,pt.joint.rotation.x+=xe.kneeBend*Te,J.joint.rotation.x+=xe.kneeBend*Te,x.position.y-=xe.crouchDepth*Te,v.position.y+=xe.crouchDepth*(1-xe.lowerScale)*Te,w.rotation.x+=xe.upperPitch*Te,et.root.rotation.x-=xe.armTuck*Te,K.root.rotation.x-=xe.armTuck*Te),At>0&&D.grounded){const Jt=zS(Z.attackProgress,Z.comboIndex,l.stride),se=At;pt.root.rotation.x+=Jt.legL.pitchX*se,J.root.rotation.x+=Jt.legR.pitchX*se,pt.root.rotation.z+=Jt.legL.rollZ*se,J.root.rotation.z+=Jt.legR.rollZ*se,pt.joint.rotation.x+=Jt.legL.kneeX*se,J.joint.rotation.x+=Jt.legR.kneeX*se,x.position.x+=Jt.pelvisX*se,x.position.y+=Jt.pelvisY*se,x.rotation.z+=Jt.pelvisRoll*se}if(tm(sn,Z.weapon),d!=null&&d.enabled&&d.autoCounter&&Math.abs(Ne)>1e-4&&(x.position.x+=Ne),g.enabled){const Jt=Z.phase!=="idle"&&!Z.charging,se=Jt?vo(Z.attackProgress):0;Jt&&C>.55&&se<C-1e-4&&(In=1),C=se,In=uw(In,ue,g.impactDecay);const gn=hw({swing:se,charge:Z.charging?Z.charge:0,impact:In,speedRatio:Qr,grounded:D.grounded},g);kn=dw(kn,gn,ue,g.smoothing)}else kn={...th};Zp(kn),v.rotation.y=xt,ce=Cp(xt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=ce;const Rm=Am;if(gt.rotation.y=Xe(D.headYaw-D.bodyYaw-Rm-ce),gt.rotation.x=-re(D.headPitch??0,-.7,.7),w.rotation.x+=-re(D.bodyPitch??0,-.4,.4),am(),jp(yt,Z.comboIndex),Qp(Z,Tm),Z.weapon==="greatsword"&&!Z.charging&&(Z.phase!=="idle"||ke>0)){y.updateWorldMatrix(!0,!0);const Jt=Z.phase==="idle"?Math.max(ke,pe):1;qp(re(Jt,0,1),ue)}if(X=Hp({root:y,pelvis:x,lower:v,limbs:St,base:_m,cfg:Ds,grounded:D.grounded,attacking:sn}),sm(D,ue),z&&Ps){const Jt=yo();Xr=Math.max(Math.abs(Jt.pitch-Ps.x),Math.abs(Jt.yaw-Ps.y),Math.abs(Jt.lean-Ps.z))}else Xr=0},lean(){return{forward:_t,side:Ft}},landing(){const D=Ju(Ra,Ca,La,Da,xo),Z=La>0?Math.max(0,La-Math.max(0,Ra-Ca)):0;return{pulse:D,remaining:Z,kind:D>0?Rs:"none",impactVy:Fh}},hurt(){return vt},ik(){return X},stretch(){return{...kn,impact:In}},gripDebug(){return{...P}},weaponDebug(){return{wristPitch:U,wristTwist:O}},setClipT(D){ge=D===null||!Number.isFinite(D)?null:Math.max(0,Math.min(1,D))},stanceDebug(){const D=tt==null?void 0:tt.armR,Z=tt==null?void 0:tt.armL,ut=tt?A:0;return{weapon:Rt??"sword-shield",weight:ut,armL:{pitch:((Z==null?void 0:Z.pitch)??0)*ut,yaw:((Z==null?void 0:Z.yaw)??0)*ut,roll:((Z==null?void 0:Z.roll)??0)*ut,elbow:((Z==null?void 0:Z.elbow)??0)*ut},armR:{pitch:((D==null?void 0:D.pitch)??0)*ut,yaw:((D==null?void 0:D.yaw)??0)*ut,roll:((D==null?void 0:D.roll)??0)*ut,elbow:((D==null?void 0:D.elbow)??0)*ut},torsoYaw:((tt==null?void 0:tt.torsoYaw)??0)*ut,torsoPitch:((tt==null?void 0:tt.torsoPitch)??0)*ut,bladePitchDeg:$*180/Math.PI,bladePitchOffDeg:ot*180/Math.PI,armSwing:(tt==null?void 0:tt.armSwing)??1}},swingDebug(){const D=Ot;return{seg:Ht,kind:(D==null?void 0:D.kind)??"right-left",lead:(D==null?void 0:D.lead)??"R",yaw:(D==null?void 0:D.yaw)??0,rootYaw:(D==null?void 0:D.rootYaw)??0,spinYaw:(D==null?void 0:D.spinYaw)??0,rootTurn:wn,pitch:(D==null?void 0:D.pitch)??0,roll:(D==null?void 0:D.roll)??0,strike:(D==null?void 0:D.strike)??0,bladeTwist:(D==null?void 0:D.bladeTwist)??0,bladeTwistOff:(D==null?void 0:D.bladeTwistOff)??0,bladeYaw:(D==null?void 0:D.bladeYaw)??0,bladeYawOff:(D==null?void 0:D.bladeYawOff)??0,shoulderL:{x:Ee.lx,y:Ee.ly,z:Ee.lz},shoulderR:{x:Ee.rx,y:Ee.ry,z:Ee.rz}}},attackBlend(){return pe},attackWeights(){return{gaitScale:wt,attackLegWeight:At,driveSpeed:Ts.speed,stridePhase:Ts.phase}},hipYaw(){return xt},torsoTotal(){return yo()},spineDebug(){if(!z)return null;const D=yo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:L.rotation.y,totalYaw:D.yaw,totalPitch:D.pitch,totalLean:D.lean,neckPitch:gt.rotation.x,leak:Xr}},balanceDebug(){return Ie?{...Ie,shift:Ne,latDeficit:ea,lateralFf:Gh}:null},gaitDebug(){return{stopT:Bt,hipYaw:xt,chestYaw:ce,speed:ee,gaitSpeed:De,stopStep:be,stopShift:_n,stopDip:an,stopYawFade:Dn,turnStep:Fe,legTakeover:qt,legLPitch:Kn.lp,legLRoll:Kn.lr,legRPitch:Kn.rp,legRRoll:Kn.rr}},gaitYaw(){return Vt},arrowDirection(){Nt.updateWorldMatrix(!0,!1);const D=Nt.matrixWorld.elements,Z=D[8],ut=D[9],yt=D[10],jt=Math.hypot(Z,ut,yt)||1;return{x:Z/jt,y:ut/jt,z:yt/jt}},weaponBlade(){return Rt?_o(Dt[Rt].right):null},bladesWorld(){return Rt?{right:_o(Dt[Rt].right),left:_o(Dt[Rt].left)}:{right:null,left:null}},dispose(){y.traverse(D=>{if(D instanceof fe){D.geometry.dispose();const Z=D.material;Array.isArray(Z)?Z.forEach(ut=>ut.dispose()):Z.dispose()}})}}}const Aw=Math.PI/3;function cf(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Rw(){let n=0,t=!1;return{update(e,i,a,s=Aw){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=cf(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=cf(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function Pw(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new nn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new pn(i,3),o=new pn(a,3);s.setUsage(Od),o.setUsage(Od),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const v=x*2,w=v+1,S=v+2,E=v+3;r.push(v,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new en({vertexColors:!0,transparent:!0,opacity:1,blending:Di,depthWrite:!1,side:Ve}),c=new fe(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const h=new Qt(n.color);let u=[],d=null,f=0,m=0,_=!1,g=!1,p=0;function y(){const x=u.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const v=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],E=Math.max(0,1-S.age/v),T=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*T*(.55+.45*b)*(1+p),R=.18+.82*E,F=w*6;i[F]=S.tx+(S.bx-S.tx)*R,i[F+1]=S.ty+(S.by-S.ty)*R,i[F+2]=S.tz+(S.bz-S.tz)*R,i[F+3]=S.tx,i[F+4]=S.ty,i[F+5]=S.tz;const z=h.r*M,H=h.g*M,L=h.b*M,I=z*.22,Y=H*.22,G=L*.22;a[F]=I,a[F+1]=Y,a[F+2]=G;const q=1+n.tipBoost;a[F+3]=Math.min(1,z*q),a[F+4]=Math.min(1,H*q),a[F+5]=Math.min(1,L*q)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,v,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of u)E.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(v){const E=d?Math.hypot(v.tip.x-d.x,v.tip.y-d.y,v.tip.z-d.z)/Math.max(1e-4,S):0,T=u[u.length-1],b=T?Math.hypot(v.tip.x-T.tx,v.tip.y-T.ty,v.tip.z-T.tz):1/0;if(w&&b>=n.minStep)for(u.push({bx:v.base.x,by:v.base.y,bz:v.base.z,tx:v.tip.x,ty:v.tip.y,tz:v.tip.z,age:0,speed:E});u.length>t;)u.shift();d={x:v.tip.x,y:v.tip.y,z:v.tip.z},f=E,m=b,_=!0}else d=null,_=!1,f=0,m=0;g=w,y()},debug(){return{count:u.length,visible:c.visible,speed:f,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],d=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}function Cw(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function Lw(n,t,e,i){var C;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new B1({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Ff,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new H1;r.background=new Qt("#12161d"),r.add(new bS(11061486,2764600,1.15));const l=new ES(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const h=[],u=new Le;for(const P of t.boxes){const N=P.maxX-P.minX,U=P.maxY-P.minY,O=P.maxZ-P.minZ;let ht=Cw(P.kind,e);P.kind==="step"&&(ht=new Qt(ht).offsetHSL(0,0,P.maxY*.09).getStyle());const mt=new ho({color:ht,transparent:!0,opacity:1}),Ct=new fe(new li(N,U,O),mt);Ct.position.set((P.minX+P.maxX)/2,(P.minY+P.maxY)/2,(P.minZ+P.maxZ)/2),Ct.castShadow=P.kind!=="ground",Ct.receiveShadow=!0,Ct.add(new fp(new iS(Ct.geometry),new wh({color:10467020,transparent:!0,opacity:.32}))),u.add(Ct),h.push(mt)}r.add(u);const d=t.gridMeta.maxX-t.gridMeta.minX,f=new AS(d,d,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const m=YS(i,e);r.add(m.group);const _=P=>Tw((P==null?void 0:P.voxel)??e.voxel,P!=null&&P.colors?{...e.colors,...P.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let g="standard",p=_((C=e.bodyTypes)==null?void 0:C[g]);const y=Pw(e.weaponTrail);r.add(y.object);const x=new Le,v=.9,w=new Le;w.position.y=v,p.group.position.y=-v,w.add(p.group),x.add(w),r.add(x);const S=Rw();let E=0;const T=t.dummies.map((P,N)=>{const U=e.dummies.colors,O=U[N%U.length]??"#cccccc",ht=WS(e.voxel,e.colors,O,P.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);return ht.group.traverse(mt=>{mt.userData.dummyId=P.id}),r.add(ht.group),ht}),b=T.map(P=>P.group),M=new TS,R=e.groundRing,F=e.voxel.bodyWidth,z=tf(F,R.playerRadiusFactor),H=tf(F,R.dummyRadiusFactor),L=F*R.thicknessFactor,I=R.arcDeg*Math.PI/180;let Y=0;const G=Zc({radius:z,thickness:L,arcRad:I,edgeFade:R.edgeFade,color:R.playerColor,opacity:R.playerOpacity,y:.028,renderOrder:6});G.mesh.name="player-ground-ring",r.add(G.mesh);const q=t.dummies.map(P=>{const N=Zc({radius:H,thickness:L,arcRad:I,edgeFade:R.edgeFade,color:R.neutralColor,opacity:R.opacity,y:.022,renderOrder:5});return N.mesh.name=`dummy-ground-ring-${P.id}`,r.add(N.mesh),N}),st=t.dummies.map(P=>{const N=Zc({radius:H*R.haloRadiusFactor,thickness:L*R.haloThicknessFactor,arcRad:I,edgeFade:R.edgeFade,color:R.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:4});return N.mesh.name=`dummy-ground-halo-${P.id}`,r.add(N.mesh),N}),gt=t.dummies.map(()=>0),dt=t.dummies.map(()=>0),ft=ef({radius:z*R.meterRadiusFactor,thickness:L*R.meterThicknessFactor,arcRad:I,edgeFade:.06,color:R.meterColorCharge,y:.03,renderOrder:8});ft.mesh.name="player-ground-meter",r.add(ft.mesh);const it=t.dummies.map(P=>{const N=ef({radius:H*R.warnRadiusFactor,thickness:L*R.warnThicknessFactor,arcRad:I,edgeFade:.02,color:R.warnColor,y:.031,renderOrder:9});return N.mesh.name=`dummy-ground-warn-${P.id}`,r.add(N.mesh),N}),j=nf({color:R.playerColor,y:.042,renderOrder:3});j.group.name="player-landing-preview",r.add(j.group);const pt=new Qt,J=new Qt(R.playerColor),et=new Qt(R.neutralColor),K=new Qt(R.lowThreatColor),St=new Qt(R.highThreatColor),kt=new Qt(R.meterColorCharge),Lt=new Qt(R.meterColorChannel),bt=new Qt(R.meterColorCooldown),V=new Qt(R.warnColor),ne=new Le;r.add(ne);const Mt=e.projectiles;function Nt(){const N=document.createElement("canvas");N.width=64,N.height=64;const U=N.getContext("2d");if(U){const ht=U.createRadialGradient(32,32,0,32,32,32);ht.addColorStop(0,"rgba(255,255,255,1)"),ht.addColorStop(.28,"rgba(255,255,255,0.72)"),ht.addColorStop(.62,"rgba(255,255,255,0.22)"),ht.addColorStop(1,"rgba(255,255,255,0)"),U.fillStyle=ht,U.fillRect(0,0,64,64)}const O=new jl(N);return O.colorSpace=Cn,O}function Dt(){const U=document.createElement("canvas");U.width=2,U.height=64;const O=U.getContext("2d");if(O){const mt=O.createLinearGradient(0,0,0,64);mt.addColorStop(0,"rgba(255,255,255,0)"),mt.addColorStop(.55,"rgba(255,255,255,0.35)"),mt.addColorStop(1,"rgba(255,255,255,0.95)"),O.fillStyle=mt,O.fillRect(0,0,2,64)}const ht=new jl(U);return ht.colorSpace=Cn,ht}const It=Nt(),Rt=Dt(),k=new en({color:12577023,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),A=new en({color:14217983,transparent:!0,opacity:0,side:Ve,depthWrite:!1,blending:Di}),$=new Le;$.position.set(0,.95,.72),ne.add($);const ot=new Le;ot.rotation.x=iw(e.camera.pitchDeg),$.add(ot);const tt=new Gr(.78,Mt.slashThickness,6,28,Math.PI*1.15),rt=new Le,zt=new fe(tt,k),Q=new fe(tt,A);Q.scale.setScalar(1.09),Q.renderOrder=4,rt.add(zt,Q),ot.add(rt);const _t=new li(Mt.arrowWidth,Mt.arrowWidth,Mt.arrowLength),Ft=new Rh(Mt.arrowHeadSize*.42,Mt.arrowHeadSize,4);Ft.rotateX(Math.PI/2);const at=new li(Mt.arrowWidth*2.6,Mt.arrowWidth*.4,.1),vt=new oo(Mt.arrowWidth*.45,Mt.arrowWidth*1.3,Mt.trailLength,6,1,!0);vt.rotateX(-Math.PI/2),vt.translate(0,0,-Mt.trailLength/2);const X=Array.from({length:10},()=>{const P=new Le,N=new en({color:Mt.arrowColor,transparent:!0}),U=new en({color:Mt.arrowHeadColor,transparent:!0}),O=new ql({map:It,color:Mt.arrowColor,transparent:!0,opacity:.85,blending:Di,depthWrite:!1}),ht=new en({color:Mt.arrowTrailColor,map:Rt,transparent:!0,opacity:0,blending:Di,depthWrite:!1,side:Ve}),mt=new fe(_t,N),Ct=new fe(Ft,U);Ct.position.z=Mt.arrowLength/2+Mt.arrowHeadSize*.42;const Xt=new fe(at,U),Ot=new fe(at,U);Xt.position.z=-Mt.arrowLength/2+.08,Ot.position.z=Xt.position.z,Ot.rotation.z=Math.PI/2;const Ut=new Fu(O);Ut.scale.setScalar(Mt.arrowGlowSize),Ut.renderOrder=6;const Ht=new fe(vt,ht);return Ht.renderOrder=5,P.add(mt,Ct,Xt,Ot,Ut,Ht),P.visible=!1,r.add(P),{group:P,shaftMat:N,tipMat:U,glowMat:O,trailMat:ht,glow:Ut,trail:Ht,arrowId:0,bone:null}}),ct=new Ch(1,0),xt=new W(Mt.boltShapeX,Mt.boltShapeY,Mt.boltShapeZ),Vt=new en({color:Mt.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),Bt=new ql({map:It,color:Mt.boltGlowColor,transparent:!0,opacity:.45,blending:Di,depthWrite:!1}),Yt=new en({color:Mt.boltGlowColor,map:Rt,transparent:!0,opacity:Mt.trailOpacity,blending:Di,depthWrite:!1,side:Ve}),B=new oo(.5,.03,Mt.boltTrailScale,6,1,!0);B.rotateX(-Math.PI/2),B.translate(0,0,-Mt.boltTrailScale/2);const Et=Array.from({length:24},()=>{const P=new Le,N=new fe(ct,Vt);N.scale.copy(xt);const U=new Fu(Bt);U.scale.setScalar(Mt.boltGlowScale),U.renderOrder=6;const O=new fe(B,Yt);return O.renderOrder=5,P.add(N,U,O),P.visible=!1,r.add(P),{group:P,core:N}}),nt=Array.from({length:6},()=>{const P=nf({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:2});return P.group.visible=!1,r.add(P.group),P}),lt=e.dash,Pt=new ps(lt.ringRadius-.06,lt.ringRadius,28),Tt=Array.from({length:6},()=>{const P=new en({color:16777215,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),N=new fe(Pt,P);return N.rotation.x=-Math.PI/2,N.visible=!1,r.add(N),{mesh:N,mat:P,life:0,base:1}});function Kt(P,N,U,O,ht){const mt=Tt.find(Ct=>Ct.life<=0)??Tt[0];mt.mat.color.set(O),mt.mesh.position.set(P,U+.04,N),mt.base=ht,mt.mesh.scale.setScalar(ht*.6),mt.mesh.visible=!0,mt.mat.opacity=.9,mt.life=lt.fxDuration}const ee=e.links,ce=new ps(ee.ringRadius-.07,ee.ringRadius,28),te=Array.from({length:5},()=>{const P=new en({color:ee.chargeColor,transparent:!0,opacity:0,side:Ve,depthWrite:!1}),N=new fe(ce,P);return N.rotation.x=-Math.PI/2,N.visible=!1,r.add(N),{mesh:N,mat:P,life:0,base:1}});function we(P,N,U,O){const ht=te.find(mt=>mt.life<=0)??te[0];ht.mesh.position.set(P,U+.05,N),ht.base=O,ht.mesh.scale.setScalar(O*.55),ht.mesh.visible=!0,ht.mat.opacity=.85,ht.life=ee.fxDuration}const be=e.groundSlam,_n=new ps(.78,1,56),an=Array.from({length:4},()=>{const P=new en({color:be.color,transparent:!0,opacity:0,side:Ve,depthWrite:!1,blending:Di}),N=new fe(_n,P);return N.rotation.x=-Math.PI/2,N.visible=!1,r.add(N),{mesh:N,mat:P,life:0,base:1,delay:0}});function De(P,N,U,O,ht){const mt=an.find(Ct=>Ct.life<=0)??an[0];mt.mat.color.set(be.color),mt.mesh.position.set(P,U+.035,N),mt.base=O,mt.mesh.scale.setScalar(O*.35),mt.mesh.visible=!0,mt.mat.opacity=0,mt.life=be.duration,mt.delay=ht}let Me=t.combat.slamAttackId,qe=0,Dn=t.playerLink.id,We=t.playerLink.hitIds.length,Mn=t.dash.id,mn="none";const ve=PS(e.camera,e.smartCamera,e.zoom,a/s),bn=t.character.position;ve.update(bn.x,bn.y,bn.z,1,t.camera);function Fe(P,N){if(b.length===0)return 0;const U=o.domElement.getBoundingClientRect(),O=new Wt((P-U.left)/U.width*2-1,-((N-U.top)/U.height)*2+1);M.setFromCamera(O,ve.camera);const ht=M.intersectObjects(b,!0);for(const mt of ht){const Ct=mt.object.userData.dummyId;if(Ct&&Ct>0)return Ct}return 0}function kn(P,N,U){const O=o.domElement.getBoundingClientRect(),ht=new W(P,N,U).project(ve.camera);return{x:O.left+(ht.x*.5+.5)*O.width,y:O.top+(-ht.y*.5+.5)*O.height}}let In=!1;return{balanceDebug(){return p.balanceDebug()},spineDebug(){return p.spineDebug()},gaitDebug(){return p.gaitDebug()},trailDebug(){return y.debug()},stretchDebug(){const P=p.stretch();return{arm:P.arm,leg:P.leg,torso:P.torso,impact:P.impact}},swingDebug(){return p.swingDebug()},stanceDebug(){return p.stanceDebug()},bladeWorld(){return p.weaponBlade()},bladesWorld(){return p.bladesWorld()},slamDebug(){return{spawns:qe,lastId:Me,live:an.filter(P=>P.life>0).map(P=>({life:P.life,scale:P.mesh.scale.x,opacity:P.mat.opacity,visible:P.mesh.visible}))}},yawDebug(){var P;return{target:E,shown:S.value,tauMs:((P=e.renderInterp)==null?void 0:P.yawSmoothMs)??0}},renderPose(){return{x:x.position.x,y:x.position.y,z:x.position.z,bodyYaw:x.rotation.y}},projectPoint(P,N,U){return kn(P,N,U)},setClipT(P){p.setClipT(P)},weaponDebug(){return p.weaponDebug()},gripDebug(){return p.gripDebug()},render(P,N){var pe,ke;const U=P.character,O=P.combat,ht=e.hitstop.enabled&&P.combat.hitstop>0,mt=N*Math.max(0,Math.min(4,O.warp??1));if(ht&&!In){const At=Math.max(0,P.combat.hitstop),wt=Math.max(0,Math.min(1,At/.1));ve.addShake(.34+wt*.48);let qt=null;for(let Ie=0;Ie<P.events.length;Ie++){const Ne=P.events[Ie];if(Ne.type==="hit"){qt=Ne;break}}qt&&ve.addKick(qt.x-U.position.x,qt.z-U.position.z,.03+wt*.05)}In=ht;for(let At=0;At<P.events.length;At++){const wt=P.events[At];if(wt.type!=="notify")continue;const qt=Number.isFinite(wt.value)?wt.value:0;if(wt.name==="blade-air"){const Ie=Math.max(0,Math.min(1,qt));y.pulse((O.weapon==="greatsword"?.9:.55)*(.4+.6*Ie))}}x.position.set(U.position.x,U.position.y,U.position.z),E=U.bodyYaw,x.rotation.y=S.update(E,N,((pe=e.renderInterp)==null?void 0:pe.yawSmoothMs)??0);const Ct=P.dash.phase==="active"&&P.dash.kind==="roll",Xt=Ct&&P.dash.duration>0?Math.min(1,1-P.dash.timer/P.dash.duration):0;if(w.rotation.x=Ct?Xt*Math.PI*2:0,w.position.y=v-(Ct?.2*Math.sin(Math.PI*Xt):0),mt>0&&p.update(U,O,P.playerHurt,mt,P.abilities.channeling,P.time,P.playerLink,P.turnInPlace),y.update(mt,mt>0?p.weaponBlade():null,mt>0&&(O.phase==="active"||P.playerLink.phase==="active"||Ct&&P.dash.duration>0)),mt>0)for(let At=0;At<T.length;At++)P.dummies[At]&&T[At].update(P.dummies[At],mt);const Ot=ve.camera.position,Ut=Math.atan2(Ot.x-U.position.x,Ot.z-U.position.z),Ht=P.config.gaze.hurtHoldSec,ie=P.time-P.playerHurt.lastAt,ye=Ht>0&&ie>=0&&ie<Ht?1-ie/Ht:0,ge=qS(P.gaze.active,P.gaze.threat,ye,P.time,R);jS(pt,J,K,St,ge.level),Y=nw(U.grounded,U.position.y,Y),G.mesh.position.set(U.position.x,Y+.028,U.position.z),G.update(ge.arcRad,ge.opacity,ge.scale,pt,Ut);const Ee=P.config.abilities.arcane,de=Math.max(1,Math.floor(Ee.waves)),$t=Math.max(1e-4,Ee.waveInterval),Je=QS({charging:O.charging,charge:O.charge,channeling:P.abilities.channeling,fireTimer:P.abilities.fireTimer,fireInterval:$t,channelProgress:P.abilities.channeling?(P.abilities.waveIndex+(1-Math.min(1,Math.max(0,P.abilities.fireTimer/$t))))/de:0,arcaneCooldown:P.abilities.cooldown,arcaneCooldownMax:Ee.cooldown,dashCooldown:P.dash.cooldown,dashCooldownMax:P.dash.kind==="blink"?P.config.dash.blinkCooldown:P.config.dash.rollCooldown});ft.mesh.position.set(U.position.x,U.position.y+.03,U.position.z),ft.set(Je.ratio,Je.source==="none"?0:R.meterOpacity,Je.source==="charge"?kt:Je.source==="channel"?Lt:bt,Ut);const oe=P.playerLink,Ue=oe.weapon?P.config.links.moves[oe.weapon]:void 0,Sn=tw(oe.phase,U.position.x,U.position.z,oe.facing,oe.travel,(Ue==null?void 0:Ue.hit.radius)??.9);j.set(Sn.x,Sn.z,.042,Sn.radius,Sn.active?R.landingOpacity:0,P.time);for(let At=0;At<q.length;At++){const wt=P.dummies[At],qt=q[At],Ie=st[At],Ne=it[At];if(!wt){qt.mesh.visible=!1,Ie.mesh.visible=!1,Ne.mesh.visible=!1;continue}const ea=P.targeting.hasTarget&&P.targeting.targetId===wt.id;if(eg(P,wt)){const As=ng(P,wt);pt.copy(K).lerp(St,As)}else pt.copy(et);const Yn=JS(wt.attackPhase,wt.attackPhaseTimer,P.config.dummies.attackWindup);Yn.active?(pt.lerp(V,.5*Yn.urgency),Ne.mesh.position.set(wt.position.x,wt.position.y+.031,wt.position.z),Ne.set(Yn.ratio,R.warnOpacity*(.65+.35*Yn.urgency),V,Ut)):Ne.set(0,0,V,Ut);const na=ea?1:0,Ts=na>gt[At]?R.haloFadeInSec:R.haloFadeOutSec;gt[At]=af(gt[At],na,N,Ts);const Kn=gt[At],go=1+.02*Kn*Math.sin(P.time*2.2+wt.id),Ra=R.arcDeg+(R.selectedArcDeg-R.arcDeg)*Kn;qt.mesh.position.set(wt.position.x,wt.position.y+.022,wt.position.z),qt.update(Ra*Math.PI/180,R.opacity+(R.selectedOpacity-R.opacity)*Kn,1+(R.selectedScale-1)*Kn*go,pt,Ut,1+(R.selectedThicknessScale-1)*Kn),dt[At]=af(dt[At],na,N,na>dt[At]?R.haloFadeInSec:R.haloFadeOutSec);const Pa=dt[At];Ie.mesh.position.set(wt.position.x,wt.position.y+.019,wt.position.z),Ie.update(Ra*Math.PI/180,R.haloOpacity*Pa*(.88+.12*Math.sin(P.time*2.2+wt.id)),R.selectedScale*(.94+.06*Pa)*go,pt,Ut)}if(ne.position.set(U.position.x,U.position.y,U.position.z),ne.rotation.y=O.phase!=="idle"?O.attackFacing:U.bodyYaw,P.dash.id!==Mn){Mn=P.dash.id;const At=P.dash;mn=At.kind,At.kind==="blink"?(Kt(At.fromX,At.fromZ,U.position.y,lt.blinkColor,.9),Kt(At.toX,At.toZ,U.position.y,lt.blinkColor,1.35)):Kt(At.fromX,At.fromZ,U.position.y,lt.rollColor,1.1)}for(const At of Tt){if(At.life<=0)continue;At.life-=N;const wt=Math.max(0,At.life/lt.fxDuration);At.mat.opacity=.9*wt,At.mesh.scale.setScalar(At.base*(.6+(1-wt)*1.2)),At.life<=0&&(At.mesh.visible=!1)}if(P.combat.slamAttackId!==Me&&(Me=P.combat.slamAttackId,qe+=1,be.enabled)){const At=(ke=P.config.combat.weapons[O.weapon])==null?void 0:ke.groundSlam,wt=Math.max(.6,(At==null?void 0:At.radius)??2.2);De(U.position.x,U.position.z,U.position.y,wt,0),De(U.position.x,U.position.z,U.position.y,wt*be.outerScale,be.delay),ve.addShake(be.shake)}for(const At of an){if(At.life<=0)continue;if(At.delay>0){At.delay-=N;continue}At.life-=N;const wt=Math.max(0,At.life/Math.max(be.duration,1e-6)),qt=1-Math.pow(wt,1.8);At.mesh.scale.setScalar(At.base*(.35+.65*qt)),At.mat.opacity=.85*Math.pow(wt,1.3),At.life<=0&&(At.mesh.visible=!1)}const He=P.playerLink;He.id!==Dn&&(Dn=He.id,We=He.hitIds.length,we(U.position.x,U.position.z,U.position.y,1)),He.hitIds.length>We?(We=He.hitIds.length,we(U.position.x,U.position.z,U.position.y,1.35)):He.hitIds.length<We&&(We=He.hitIds.length);for(const At of te){if(At.life<=0)continue;At.life-=N;const wt=Math.max(0,At.life/Math.max(ee.fxDuration,1e-6));At.mat.opacity=.85*wt,At.mesh.scale.setScalar(At.base*(.55+(1-wt)*1.1)),At.life<=0&&(At.mesh.visible=!1)}const wn=Mt.slashEnabled&&O.phase==="active"&&O.comboIndex>=3;k.opacity=wn?.7:0,A.opacity=wn?Mt.slashGlowOpacity:0,wn&&(rt.rotation.z=-1.2+O.attackProgress*3.2,rt.scale.setScalar(.9+O.comboIndex*.13));for(let At=0;At<Et.length;At++){const wt=P.abilities.projectiles[At],qt=Et[At];qt.group.visible=!!wt,wt&&(qt.group.position.set(wt.x,wt.y,wt.z),qt.group.scale.setScalar(wt.radius),qt.group.rotation.set(0,Math.atan2(wt.dirX,wt.dirZ),0))}for(let At=0;At<nt.length;At++){const wt=P.abilities.rings[At],qt=nt[At];if(!wt){qt.group.visible=!1;continue}const Ie=Math.max(0,Math.min(1,wt.life/Math.max(wt.duration,1e-6))),Ne=ew(Math.max(0,wt.duration-wt.life),R.areaExpandSec);qt.set(wt.x,wt.z,.045,wt.radius*Ne.scale,R.areaOpacity*(.35+.65*Ie)*Ne.alpha,P.time)}for(let At=0;At<X.length;At++){const wt=P.arrows[At],qt=X[At];if(!wt){qt.group.visible=!1,qt.bone&&(r.attach(qt.group),qt.bone=null),qt.arrowId=0;continue}const Ie=wt.stuck&&wt.stuckDummy>=0;if(qt.arrowId!==wt.id){if(qt.bone&&(r.attach(qt.group),qt.bone=null),qt.arrowId=wt.id,qt.group.position.set(wt.x,wt.y,wt.z),qt.group.rotation.set(wt.pitch,wt.yaw,0,"YXZ"),Ie){const ea=T[wt.stuckDummy],Yn=ea?ea.boneAtWorld(wt.x,wt.y,wt.z):null;Yn&&(Yn.node.attach(qt.group),qt.bone=Yn.node)}}else qt.bone||(qt.group.position.set(wt.x,wt.y,wt.z),qt.group.rotation.set(wt.pitch,wt.yaw,0,"YXZ"));qt.group.visible=!0;const Ne=wt.stuck?Math.min(1,wt.rest/.6):1;qt.shaftMat.opacity=Ne,qt.tipMat.opacity=Ne,qt.glowMat.opacity=(wt.stuck?.28:.85)*Ne,qt.trailMat.opacity=wt.stuck?0:Mt.trailOpacity*Ne,qt.trail.visible=!wt.stuck}ve.update(U.position.x,U.position.y,U.position.z,N,P.camera),o.render(r,ve.camera)},resize(){const P=Math.max(1,n.clientWidth),N=Math.max(1,n.clientHeight);o.setSize(P,N,!1),ve.resize(P/N)},getGroundBasis(){return ve.getGroundBasis()},setCollidersVisible(P){for(const N of h)N.opacity=P?.3:1,N.wireframe=P,N.needsUpdate=!0},setGridVisible(P){f.visible=P},setLabVisible(P){m.setVisible(P)},setLabLabelsVisible(P){m.setLabelsVisible(P)},snapCamera(P,N,U){ve.snap(P,N,U)},setZoom(P){ve.setZoom(P)},setBodyType(P){var U;const N=(U=e.bodyTypes)==null?void 0:U[P];return!N||P===g||(w.remove(p.group),p.dispose(),p=_(N),p.group.position.y=-v,w.add(p.group),y.reset(),g=P,t.config.characterHeight=N.height,N.radius!==void 0&&(t.config.characterRadius=N.radius)),g},bodyTypes(){return{id:g,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Fe,projectToScreen:kn,diagnostics(){const P=Xp(e.camera.pitchDeg),N=aw(P,ne.rotation.y);return{lean:p.lean(),slashNormal:N,arrowForward:p.arrowDirection(),gait:{hipYaw:p.hipYaw(),gaitYaw:p.gaitYaw()},attackBlend:p.attackBlend(),attackWeights:p.attackWeights(),landing:p.landing(),hurt:p.hurt(),ik:p.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:w.rotation.x,activeRings:Tt.filter(U=>U.life>0).length,lastKind:mn},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ve.smart(),shake:ve.shakeLevel(),kick:ve.kickLevel(),kickCount:ve.kickCount()}}},dispose(){p.dispose(),m.dispose();for(const P of T)P.dispose();G.dispose();for(const P of q)P.dispose();for(const P of st)P.dispose();ft.dispose(),y.dispose();for(const P of it)P.dispose();j.dispose(),tt.dispose(),k.dispose(),A.dispose(),ct.dispose(),Vt.dispose(),Bt.dispose(),Yt.dispose(),B.dispose();for(const P of nt)P.dispose();_t.dispose(),Ft.dispose(),at.dispose(),vt.dispose();for(const P of X)P.shaftMat.dispose(),P.tipMat.dispose(),P.glowMat.dispose(),P.trailMat.dispose();It.dispose(),Rt.dispose();for(const P of Tt)P.mat.dispose();for(const P of an)P.mat.dispose();Pt.dispose();for(const P of te)P.mat.dispose();ce.dispose(),u.traverse(P=>{P instanceof fe&&P.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function Dw(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function kw(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function Iw(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=y=>e.querySelector(`#${y}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),h=i("diag-close"),u=i("diag-mask");let d=!1,f=!0,m=0;function _(){const y=n.status();a.textContent=y.enabled?`已记录 ${y.durationS.toFixed(1)}s · ${y.frames} 帧 · 事件 ${y.events} · 异常 ${y.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=y.enabled?"暂停记录":"继续记录"}function g(y){d=y,e.hidden=!y,y?_():s.hidden=!0}function p(y){o.textContent=y,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),g(!d)}),h.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const y=n.summary();Dw(y).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=y,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const y=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);kw(`harness-${y.meta.version}-${x}.json`,JSON.stringify(y)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const y=n.status();t==null||t.classList.toggle("is-alert",y.alert),d&&_()},isOpen:()=>d,close:()=>g(!1)}}const zw={intents:{...lf},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function Fw(){var et;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=ag(Wg,To),i=Lw(n,e,hn,To.stations),a=hg(e),s=wx(t),o=Ex(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.57 · 11-08 17:10 · 诊断");const l=K=>String(K).padStart(2,"0"),c=new Date,h=Bg({meta:{version:"v0.9.57",buildTime:"11-08 17:10",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=Iw(h,r),d=Mx({deadZone:()=>hn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&h.suspend(800)});const f={timeScale:1,paused:!1,showColliders:hn.showColliders,showGrid:hn.showGrid,showLab:hn.lab.enabled,showLabLabels:hn.lab.showLabels};let m=1,_=!1;const g=Pg({maxRadiusPx:()=>hn.joystick.maxRadiusPx,deadZone:hn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>hn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let y=e.combat.weapon;function x(K){if(K===y)return;y=K;const St=Sa.indexOf(K)+1;for(const kt of p)kt.classList.toggle("is-active",Number(kt.dataset.weapon)===St);E.refreshWeapon()}let v=zw,w=0;const S=()=>{m=1,i.setZoom(1)},E=ax(e,hn,f,{singleStep:()=>a.singleStep(v.intents),reset:()=>{m=1,a.singleStep({...lf,resetPressed:!0})},resetZoom:S,onToggleColliders:K=>i.setCollidersVisible(K),onToggleGrid:K=>i.setGridVisible(K),onToggleLab:K=>i.setLabVisible(K),onToggleLabLabels:K=>i.setLabLabelsVisible(K)}),T=rx({stations:To.stations??[],world:e,view:i,onResetZoom:S});o.register({motion:d,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),R=K=>{var St,kt;return((kt=(St=hn.bodyTypes)==null?void 0:St[K])==null?void 0:kt.name)??K},F=()=>{if(!M)return;const K=i.bodyTypes().id;M.textContent=`体型 ${R(K)}`,M.setAttribute("aria-label",`切换体型（当前：${R(K)}，快捷键 B）`)},z=document.createElement("div");z.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(z);let H=0;const L=K=>{z.textContent=K,z.style.opacity="1",window.clearTimeout(H),H=window.setTimeout(()=>{z.style.opacity="0"},1600)},I=()=>{if(b.length<2){L("只有一个体型预设");return}const K=i.bodyTypes().id,St=Math.max(0,b.indexOf(K)),kt=i.setBodyType(b[(St+1)%b.length]);F(),L(`体型：${R(kt)}（B / 顶部胶囊切换）`)};F(),M==null||M.addEventListener("click",I),window.addEventListener("keydown",K=>{K.repeat||K.code!=="KeyB"||I()}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:hn,debug:f,getUserZoom:()=>m,getGestures:()=>v.gestures,getLastGesture:()=>v.lastGesture,telemetry:h,telemetrySummary:()=>h.summary(),dirDebug:d.dirDebug,dirAngles:()=>d.dirDebug.last(),motionDebug:d,speedDebug:()=>d.last(),speedSamples:()=>d.samples(),gaitDebug:()=>i.gaitDebug(),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:ft,applied:it,enabled:st,skip:j}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),setRenderInterp:K=>(st=!!K,st),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(K,St,kt)=>i.projectPoint(K,St,kt),setBodyType:K=>{const St=i.setBodyType(K);return F(),St},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var K;return Object.keys(((K=hn.animation.swing)==null?void 0:K.clips)??{})},preview:K=>{const St=e.combat,kt={...St};St.weapon=K.weapon,St.phase="active",St.comboIndex=Math.max(1,Math.min(3,Math.floor(K.comboIndex))),St.attackProgress=Math.max(0,Math.min(1,K.progress)),St.attackFacing=e.character.bodyYaw,i.setClipT(typeof K.t=="number"?K.t:null);const Lt=Math.max(1,Math.min(30,Math.floor(K.warm??12)));_=!0;for(let bt=0;bt<Lt;bt++)i.render(e,1/60);return i.setClipT(null),Object.assign(St,kt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:K=>{e.character.bodyYaw=K},zoom:K=>{m=Sd(K,1,hn.zoom.min,hn.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),lab:{stations:To.stations??[],goto:K=>T.goto(K),current:()=>T.current(),recall:()=>T.recall()}};let Y=performance.now(),G=60,q=0,st=((et=hn.renderInterp)==null?void 0:et.enabled)??!0,gt=bd(e),dt=null,ft=1,it=!1,j="";function pt(K){const St=st&&!f.paused&&f.timeScale>0;if(it=!1,j="",!St)return j="off",ft=1,e;if(!dt)return j="noprev",ft=1,e;if(!ug(dt,gt))return j="key",ft=1,e;const kt=a.alpha;return ft=kt,kt>=.999?(j="alpha",e):(it=!0,pg(e,fg(dt,gt,kt)))}function J(K){const St=Math.min((K-Y)/1e3,.1);Y=K,St>0&&(G=G*.9+1/St*.1);const kt=g.sample();kt.intents.resetPressed&&(m=1),m=Sd(m,kt.zoomScale,hn.zoom.min,hn.zoom.max),i.setZoom(m);let Lt=kt.intents.dummyClickId;if(kt.tap){const ne=i.pickDummy(kt.tap.x,kt.tap.y);ne>0&&(Lt=ne)}Lt>0&&(w=Lt),v={...kt,intents:{...kt.intents,dummyClickId:w}};const bt=a.frame(St,v.intents,f.timeScale,f.paused,()=>{const ne=e.events;for(let Mt=0;Mt<ne.length;Mt++)h.event(ne[Mt],e.time);dt=gt,gt=bd(e)});bt>0&&(w=0),h.sample(e,v,St*1e3,bt);for(const ne of v.gestures)h.gesture(ne);K-q>250&&(q=K,u.tick()),x(e.combat.weapon),_||i.render(pt(),St),T.tick(),d.update(e,v,i.getGroundBasis());const V=i.diagnostics();s.update(e,G,bt,v,f,{attackBlend:V.attackBlend,attackWeights:V.attackWeights,landing:V.landing,hurt:V.hurt,ik:V.ik,zoom:V.camera.zoom},o.hudCompact()),requestAnimationFrame(J)}requestAnimationFrame(J)}Fw();

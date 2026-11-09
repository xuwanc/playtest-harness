(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const ca=["sword-shield","dual-swords","greatsword","staff","bow"],$0=["wander","follow","keep-distance","attack","idle"],op=["spar","wander","follow","keep-distance","attack","idle"],rp={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},zr=1e-6;function _o(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>zr?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>zr?Math.atan2(t.moveX,t.moveZ):n.character.facing}function Z0(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>zr){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>zr)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const Ze=1e-6,ia=Math.PI/180,Dh=-1e9;function cp(){return{type:"none",lastAt:Dh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function ho(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Hd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function kh(n,t,e){var l,d;const i=e.duration>0?e.duration:Qr(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(Hd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>Ze){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}ho(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Hd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>Ze){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,ho(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((l=n.config.hits.hitstopByWeapon)==null?void 0:l[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const c=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;c>0&&n.combat.hitstop<c&&(n.combat.hitstop=c,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,ho(n,"hitstop",c,a.position))}function Do(n,t,e){kh(n,{kind:"dummy",index:t},e)}function j0(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Qr(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Fr(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function lp(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function q0(n){var _,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,c=o?Math.min(1,Math.max(r,o.end)):1,l=t.timings.active,d=l>Ze?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(d<r-Ze||d>c+Ze)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*ia);const u=s==null?void 0:s.hitSweep,h=((_=u==null?void 0:u.byCombo)==null?void 0:_[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=Fr(h.pts,0),v=Fr(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,v)-f,i.sweepHi=Math.max(p,v)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-Ze&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function K0(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>Ze&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=lp(Math.atan2(a,s)/ia-n.facing/ia);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function J0(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function Q0(n){var S,E;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,c=t.timings.active,l=c>Ze?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(l<o-Ze||l>r+Ze)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*ia),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((E=g==null?void 0:g.byCombo)==null?void 0:E["1"]),v=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,w=!1;if(p){if(typeof p.stabU=="number"){if(l<p.stabU)return}else if(p.pts&&p.pts.length>=2){const A=Fr(p.pts,0),b=Fr(p.pts,l);x=Math.min(A,b)-v,y=Math.max(A,b)+v,w=!0}}for(const A of n.dummies){if(t.hitIds.indexOf(A.id)>=0)continue;const b=A.position.x-i.x,M=A.position.z-i.z,R=Math.hypot(b,M);if(R>d+m)continue;const k=R>Ze?b/R:h,L=R>Ze?M/R:f;if(R>Ze&&(b*h+M*f)/R<u)continue;if(w){const B=lp(Math.atan2(b,M)/ia-t.attackFacing/ia);if(B<x||B>y)continue}let D="light";t.weapon==="greatsword"?D="knock":t.comboIndex>=3&&(D="heavy");const C=e.knockback[t.weapon]??0;let I=R;C>0&&(I=Math.max(R+C,_));const O=Math.max(0,I-R);Do(n,n.dummies.indexOf(A),{type:D,duration:Qr(n,D),dirX:k,dirZ:L,knockback:O}),t.hitIds.push(A.id)}}function tg(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>Ze?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-Ze)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,c=Math.sin(t.attackFacing),l=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const v=n.dummies[p];if(h&&t.hitIds.indexOf(v.id)>=0)continue;const x=v.position.x-r.x,y=v.position.z-r.z,w=Math.hypot(x,y);if(w>u+d)continue;const S=w>Ze?x/w:c,E=w>Ze?y/w:l,A=m>0?Math.max(w+m,_):w,b=Math.max(0,A-w);Do(n,p,{type:f,duration:Qr(n,f),dirX:S,dirZ:E,knockback:b,holdMul:g}),t.hitIds.push(v.id)}ho(n,"ground-slam",u,{x:r.x+c*Math.min(u*.25,.5),y:r.y,z:r.z+l*Math.min(u*.25,.5)})}function eg(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,c=i.fromZ,l=o.x,d=o.z,u=l-r,h=d-c,f=u*u+h*h,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(Gd(s.arcDeg,0,180)*ia),p=n.config.dummies.radius;for(let v=0;v<n.dummies.length;v++){const x=n.dummies[v];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>Ze?Gd(((x.position.x-r)*u+(x.position.z-c)*h)/f,0,1):0,w=r+u*y,S=c+h*y,E=Math.hypot(x.position.x-w,x.position.z-S);let A=!1;if(s.shape==="circle")A=E<=s.radius+p;else if(s.shape==="capsule")A=E<=Math.max(s.radius,s.width)+p;else{const D=x.position.x-l,C=x.position.z-d,I=Math.hypot(D,C),O=I>Ze?(D*m+C*_)/I>=g:!0;A=I<=s.radius+p&&O||E<=s.width+p}if(!A)continue;const b=x.position.x-r,M=x.position.z-c,R=Math.hypot(b,M);if(R>Ze&&(b*m+M*_)/R<Math.cos(Math.max(s.arcDeg,90)*ia))continue;const k=R>Ze?b/R:m,L=R>Ze?M/R:_;kh(n,{kind:"dummy",index:v},{type:s.type,duration:s.duration,dirX:k,dirZ:L,knockback:s.knockback}),i.hitIds.push(x.id),ho(n,"link-hit",x.id,x.position)}}function ng(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,c=i.z-s.position.z,l=Math.hypot(r,c);if(l>o)continue;const d=l>Ze?r/l:0,u=l>Ze?c/l:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),_=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";kh(n,{kind:"player"},{type:_,duration:Qr(n,_),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function ig(n,t){n.modules.hits&&(n.combat.phase==="active"&&(Q0(n),tg(n)),eg(n,t),ng(n))}function Gd(n,t,e){return n<t?t:n>e?e:n}const hp=Math.PI/180,Ih=1e-6;function ag(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function Ur(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function dp(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>Ih?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function up(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,Ih)&&s<=Math.max(0,e.inputDeadZone)&&!o}function sg(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function og(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!up(n,t,e))return!1;const i=dp(n,t,e.lookRange);if(i===null)return!1;const a=He(i-n.character.bodyYaw);return Math.abs(a)>fp(n,e)}function fp(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*hp}function rg(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!up(n,e,a)){Ur(n);return}const s=dp(n,e,a.lookRange);if(s===null){Ur(n);return}const o=n.character,r=He(s-o.bodyYaw),c=Math.abs(r),l=fp(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ih;if(i.phase==="idle"&&(i.armTime=c>=l?i.armTime+t:0,c>l&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(c,Math.max(0,a.settleDeg)*hp);i.targetYaw=He(o.bodyYaw+i.dir*(c-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=He(i.targetYaw-i.fromYaw);o.bodyYaw=He(i.fromYaw+h*sg(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const aa=1e-6;function He(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ho(n,t,e,i){const a=He(t-n);return n+a*(1-Math.exp(-Math.max(e,aa)*i))}function Go(n,t,e,i,a){const o=He(t-n)*(1-Math.exp(-Math.max(e,aa)*a)),r=Math.max(i,0)*a;return r<=aa?n:n+ps(o,-r,r)}function Xd(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,aa)*a)),o=Math.max(i,0)*a;return o<=aa?n+s:n+ps(s,-o,o)}function ps(n,t,e){return n<t?t:n>e?e:n}function Vd(n,t,e,i){const a=He(t-n),s=Math.abs(a);return s<=i||s<=e?t:He(n+Math.sign(a)*Math.max(e,0))}function cg(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,c=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",l=o&&!c,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>aa,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=_o(n,e);else if(l)i.facing=Go(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=_o(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,aa)){const M=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Vd(i.facing,M,R,k);else if(d>=a.facingMinMagnitude&&Math.abs(He(M-i.facing))>a.facingDeadbandDeg*Math.PI/180){const D=Ho(i.facing,M,a.facingSmoothRate,t);i.facing=Vd(i.facing,D,R,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=l?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||og(n,e)||(l?i.bodyYaw=Go(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Ho(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=l?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const M=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(He(p-i.bodyYaw))>M&&(p=i.moveYaw)}const v=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(v){const M=l?n.config.gaze.headTurnRate:a.headTurnRate;y=l?Go(i.headYaw,p,M,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Ho(i.headYaw,p,M,t)}else{const M=He(i.headYaw-i.bodyYaw),R=He(p-i.bodyYaw),k=Math.abs(R)<Math.abs(M)-1e-9,L=k?n.config.gaze.headReturnRate:a.headTurnRate,D=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,C=Number.isFinite(D)?Go(M,R,L,D,t):Ho(M,R,L,t);y=i.bodyYaw+C}const w=He(y-i.bodyYaw);w>x?y=i.bodyYaw+x:w<-x&&(y=i.bodyYaw-x),i.headYaw=y;const S=n.config.gaze;let E=0;if(l)E=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const M=n.dummies[n.targeting.targetId-1];if(M){const R=i.position.y+n.config.characterHeight*ps(S.eyeHeightRatio,0,1),k=M.position.y+n.config.dummies.height*ps(S.aimHeightRatio,0,1),L=Math.hypot(M.position.x-i.position.x,M.position.z-i.position.z);E=Math.atan2(k-R,Math.max(aa,L))}}const A=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;E=ps(E,-A,A);const b=v?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Xd(i.headPitch,E,b,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Xd(i.bodyPitch,i.headPitch*ps(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const pp=1e-6,tc=Math.PI/180;function ec(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function lg(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*tc,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const c=n.dummies[r],l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);u<.001||u>s||Math.abs(He(Math.atan2(l,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,c)=>r.d-c.d||r.i-c.i),o.map(r=>r.i)}function hg(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function dg(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*tc,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),c=lg(n,e.channelYaw,t);for(let l=0;l<a;l++){const d=(l-(a-1)*.5)*s,u=e.channelYaw+d,h=(l-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:l*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(hg(e.waveIndex,l)*2-1)*r),targetIndex:c.length>0?c[l%c.length]:-1,wave:e.waveIndex})}ec(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function ug(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*tc,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,ec(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Wd(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,ec(n,"channel-end",0,n.character.position))}function fg(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",c=n.playerLink,l=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&l&&!r&&c.phase==="idle"&&!c.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){Wd(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),ec(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=_o(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,pp),dg(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Wd(n,i);break}}function pg(n,t,e){const i=Math.max(0,e.homingConeDeg)*tc,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+pp;for(let c=0;c<n.dummies.length;c++){const l=n.dummies[c],d=l.position.x-t.x,u=l.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(He(Math.atan2(d,u)-s))>i||(o=c,r=h)}return o}function mg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=pg(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const l=n.dummies[r.targetIndex];if(!l)r.targetIndex=-1;else{const d=Math.atan2(l.position.x-r.x,l.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=He(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),_=u+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let c=!1;if(s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){Do(n,l,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),c=!0;break}}c||o.push(r)}i.projectiles=o}const gg={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;fg(n,t,e,s,a,i.cfg.slot),ug(n,t,s),mg(n,t,s)}},Ac=1e-6;function mp(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function xg(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),mp(n,"ring-place",i.id,e)}function vg(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let c=0;for(;r.pulseTimer<=0&&c++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,Ac),s)for(let l=0;l<n.dummies.length;l++){const d=n.dummies[l],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),_=m>Ac?u/m:0,g=m>Ac?h/m:1;Do(n,l,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}mp(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const yg={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&xg(n,s),vg(n,t,s)}},_g={channelVolley:gg,groundRing:yg};function Mg(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function bg(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=_g[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function Sg(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function gp(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function wg(n,t,e){bg(n,t,e)}function Rc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Yd=1e-6;function $d(n,t,e){return n<t?t:n>e?e:n}function xp(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function vp(n){const t=n.camera,e=xp();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function Eg(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const l of n.dummies){const d=l.position.x-i.x,u=l.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=$d((e.radius-h)/Math.max(Yd,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[l.mode]??.5);l.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=l.position.x*m,o+=l.position.z*m,r+=1}const c=a<=0?0:$d(a/(a+Math.max(Yd,e.saturation)),0,1);if(t.threat=c,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const l=s/a,d=o/a;t.centroidX=l,t.centroidZ=d;let u=(l-i.x)*e.framingBias*c,h=(d-i.z)*e.framingBias*c;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-c)+e.maxPullback*c,t.pitchDelta=e.maxPitchDelta*c}function Tg(n){const t=[],e=n.ground.size;t.push($a("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push($a(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push($a(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push($a(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push($a(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push($a(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function $a(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const yp={cellSize:.5,originX:0,originZ:14,stepX:-4.5,stepZ:-4.5,columns:4,gap:.3,spawnDz:0,labelDz:-2.8,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",bounds:{minX:-13,maxX:13,minZ:-13,maxZ:14}};function xi(n){return Math.round(n*1e6)/1e6}function Ag(n,t,e){return Math.hypot(n.x-t.x,n.z-t.z)<n.r+t.r+e}const Rg=400;function Pg(n,t=yp){const e={duplicates:[],relocated:[],unplaced:[]},i=new Set,a=[];for(const h of n)if(!(!h||typeof h.id!="string"||h.id.length===0)){if(i.has(h.id)){e.duplicates.push(h.id);continue}i.add(h.id),a.push(h)}const s=[...a].sort((h,f)=>h.id<f.id?-1:h.id>f.id?1:0),o=[],r=[];for(const h of s){if(!h.anchor)continue;const f=xi(h.anchor.x),m=xi(h.anchor.z);r.push({def:h,centerX:f,centerZ:m}),o.push({x:f,z:m,r:h.radius??t.defaultRadius})}let c=0;for(const h of s)typeof h.index=="number"&&(c=Math.max(c,h.index));const l=[];let d=0;const u=(h,f,m,_,g,p)=>{const v=h.radius??t.defaultRadius,x=h.shape??t.defaultShape,y=h.color??t.defaultColor,w=h.spawn??{dx:0,dz:t.spawnDz},S=h.label??{dx:0,dz:t.labelDz},E={id:h.id,index:p,name:h.name,hint:h.hint,shape:x,x:xi(f),z:xi(m),radius:v,spawnX:xi(f+w.dx),spawnZ:xi(m+w.dz),labelX:xi(f+S.dx),labelZ:xi(m+S.dz),color:y},A=[];if(h.grass){const b=h.grass,M=b.absolute?0:Math.round(f/t.cellSize),R=b.absolute?0:Math.round(m/t.cellSize),k={minCellX:b.minCellX+M,maxCellX:b.maxCellX+M,minCellZ:b.minCellZ+R,maxCellZ:b.maxCellZ+R};b.density!==void 0&&(k.density=b.density),b.clearMarginCells!==void 0&&(k.clearMarginCells=b.clearMarginCells),A.push(k)}return{id:h.id,index:p,name:h.name,hint:h.hint,owner:h.owner??"",centerX:E.x,centerZ:E.z,placement:_,slot:g,shape:x,radius:v,color:y,station:E,grassPlots:A,testSpawn:h.testSpawn}};for(const h of r)l.push(u(h.def,h.centerX,h.centerZ,"pinned",-1,h.def.index??++c));for(const h of s){if(h.anchor)continue;const f=h.radius??t.defaultRadius;let m=-1,_=0,g=0,p=0;for(let v=d;v<Rg;v++){const x=v%t.columns,y=Math.floor(v/t.columns),w=xi(t.originX+x*t.stepX),S=xi(t.originZ+y*t.stepZ),E=t.bounds;if(E&&(w<E.minX||w>E.maxX||S<E.minZ||S>E.maxZ)){p++;continue}const A={x:w,z:S,r:f};if(o.some(b=>Ag(A,b,t.gap))){p++;continue}m=v,_=w,g=S;break}if(m<0){e.unplaced.push(h.id);continue}p>0&&e.relocated.push(h.id),o.push({x:_,z:g,r:f}),d=m+1,l.push(u(h,_,g,"auto",m,h.index??++c))}return l.sort((h,f)=>h.index-f.index),{plots:l,stations:l.map(h=>h.station),grassPlots:l.flatMap(h=>h.grassPlots),diagnostics:e}}const Ni=1e-6;function Nr(n,t,e){return n<t?t:n>e?e:n}function Mo(n,t,e,i,a,s,o){const r=a*.85;let c=Number.NEGATIVE_INFINITY;for(const l of n)l.maxY>i+s+Ni||l.maxY<i-o-Ni||t+r<l.minX||t-r>l.maxX||e+r<l.minZ||e-r>l.maxZ||l.maxY>c&&(c=l.maxY);return c}function _p(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function zh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const c of n){if(c.maxY<=t.y+a+Ni||c.minY>=o-Ni)continue;const l=Nr(t.x,c.minX,c.maxX),d=Nr(t.z,c.minZ,c.maxZ),u=t.x-l,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>Ni*Ni){const m=Math.sqrt(f),_=(e-m)/m;t.x+=u*_,t.z+=h*_}else{const m=t.x-c.minX,_=c.maxX-t.x,g=t.z-c.minZ,p=c.maxZ-t.z,v=Math.min(m,_,g,p);v===m?t.x=c.minX-e:v===_?t.x=c.maxX+e:v===g?t.z=c.minZ-e:t.z=c.maxZ+e}}return s}function Fh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ni||o.minY>=s-Ni)continue;const r=Nr(t.x,o.minX,o.maxX),c=Nr(t.z,o.minZ,o.maxZ),l=t.x-r,d=t.z-c;if(l*l+d*d<e*e-Ni)return!0}return!1}const ea=1e-6,Es=Math.PI/180;function Uh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Sl(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Mp(n){n.arrows.length=0}function Cg(n,t,e,i,a,s,o,r,c,l,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>ea&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const _=n+u*m,g=e+h*m,p=_-o,v=g-r;if(p*p+v*v>d*d)return-1;const x=t+(a-t)*m;return x<c-.1||x>c+l?-1:m}function Lg(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=ea)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*Es,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let c=-1,l=i+ea;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(Uh(Math.atan2(u,h)-t))>s||f<l&&(c=d.id,l=f)}}return c}function Dg(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*Es;return t+vs(Uh(s-t),-o,o)}function kg(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*Es),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*Es),a<=0)return r;const c=n.dummies.find(_=>_.id===a);if(!c)return r;const l=Math.hypot(c.position.x-t,c.position.z-i);if(l<.4)return r;const d=l/Math.max(ea,s),u=c.position.y+n.config.dummies.height*vs(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=vs(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function Ig(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=Lg(n,e),c=Dg(n,e,r),l=Math.sin(c),d=Math.cos(c),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=kg(n,u,f,h,r,s),_={id:++n.arrowSeq,x:u,y:f,z:h,vx:l*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*Es};return n.arrows.push(_),Sl(n,"arrow-shot",a,_),_}function vs(n,t,e){return n<t?t:n>e?e:n}function zg(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),c=[];for(const l of e){if(l.stuck){if(l.rest-=t,l.rest<=0)continue;if(l.stuckDummy>=0){const y=n.dummies[l.stuckDummy];if(y){const w=Math.cos(y.bodyYaw),S=Math.sin(y.bodyYaw);l.x=y.position.x+l.offX*w+l.offZ*S,l.y=y.position.y+l.offY,l.z=y.position.z-l.offX*S+l.offZ*w,l.yaw=y.bodyYaw+l.localYaw}}c.push(l);continue}if(l.life-=t,l.life<=0)continue;const d=l.x,u=l.y,h=l.z;if(l.homing>0&&(l.homing=Math.max(0,l.homing-t),l.targetId>0&&l.turnRate>0)){const y=n.dummies.find(w=>w.id===l.targetId);if(!y)l.targetId=0;else{const w=Math.hypot(l.vx,l.vz);if(w>ea){const S=Math.atan2(y.position.x-l.x,y.position.z-l.z),E=Math.atan2(l.vx,l.vz),A=l.turnRate*t,b=E+vs(Uh(S-E),-A,A);l.vx=Math.sin(b)*w,l.vz=Math.cos(b)*w;const M=Math.hypot(y.position.x-l.x,y.position.z-l.z);if(M>.3){const R=M/w,L=(y.position.y+s*vs(i.aimHeightRatio,0,1)-l.y+.5*r*R*R)/R,D=Math.max(0,i.verticalTurnRate)*t;l.vy+=vs(L-l.vy,-D,D)}}}}l.yaw=Math.atan2(l.vx,l.vz),l.pitch=-Math.atan2(l.vy,Math.hypot(l.vx,l.vz)),l.vy-=r*t;const f=d+l.vx*t,m=u+l.vy*t,_=h+l.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const w=n.dummies[y],S=Cg(d,u,h,f,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=y)}if(g>=0){const y=n.dummies[g];l.x=d+(f-d)*p,l.y=u+(m-u)*p,l.z=h+(_-h)*p,l.stuck=!0,l.stuckDummy=g;const w=Math.cos(y.bodyYaw),S=Math.sin(y.bodyYaw),E=l.x-y.position.x,A=l.z-y.position.z;l.offX=E*w-A*S,l.offZ=E*S+A*w,l.offY=l.y-y.position.y;const b=Math.atan2(l.vx,l.vz);l.localYaw=b-y.bodyYaw,l.yaw=b,l.pitch=Math.atan2(-l.vy,Math.hypot(l.vx,l.vz)),l.rest=Math.max(.2,i.stickSec),l.hit=!0;const M=Math.hypot(l.vx,l.vz);Do(n,g,{type:"light",duration:.22,dirX:M>ea?l.vx/M:0,dirZ:M>ea?l.vz/M:1,knockback:.14}),Sl(n,"arrow-land",y.id,l),c.push(l);continue}const v=Mo(n.boxes,f,_,m+.4,.04,0,6),x=Number.isFinite(v)?v:0;if(m<=x+.02&&l.vy<0){l.x=f,l.y=x+Math.max(0,i.groundStickLift),l.z=_,l.stuck=!0,l.stuckDummy=-1,l.yaw=Math.atan2(l.vx,l.vz);const y=Math.atan2(-l.vy,Math.max(ea,Math.hypot(l.vx,l.vz)));l.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*Es),l.rest=Math.max(.2,i.stickSec),Sl(n,"arrow-land",-1,l),c.push(l);continue}l.x=f,l.y=m,l.z=_,c.push(l)}n.arrows=c}const wl=1e-6,Fg=Math.PI/180;function El(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Nh(n,t,e){return n<t?t:n>e?e:n}function nc(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function Tl(n){const t=n.id,e=n.windowId;Object.assign(n,nc()),n.id=t,n.windowId=e}function Ug(n){Tl(n)}function bp(n){Tl(n.playerLink);for(const t of n.dummies)Tl(t.link)}function Ng(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function Al(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Or(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,nc()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function Og(n,t){const e=n.config.links.search,i=n.character.position,a=Nh(e.maxAngleDeg,0,180)*Fg;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const c of n.dummies){const l=c.position.x-i.x,d=c.position.z-i.z,u=Math.hypot(l,d);if(u<wl||u>e.range)continue;const h=Math.atan2(l,d);Math.abs(He(h-t))>a||u<r&&(r=u,s=c.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function Bg(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=_o(n,t),c=Og(n,r),l=c.id>0?c.yaw:r,d=c.id>0?Nh(c.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=l,s.targetId=c.id,s.targetDist=c.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),El(n,"link-start",s.id)}function Hg(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Or(n);return}if(e.weapon!==n.combat.weapon){Or(n);return}e.timer+=t;const a=c=>c==="windup"?i.windup:c==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const c=a(e.phase);if(e.timer<c)break;e.timer-=c,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,El(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,El(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?Nh(r/o,0,1):1,e.phase==="active"&&i.active>wl){const c=Math.max(0,e.travel-e.travelled),l=Math.max(wl,i.active-e.timer),d=c/l;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function Gg(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Or(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&Al(n,"sprint"),a.prevSprinting=r,Hg(n,t);const c=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!c&&c.enabled&&Bg(n,e,c,o.weapon)}const Er={windup:0,active:1,recovery:2},Zd=1e-9;function Sp(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function Xg(n){return n==="windup"||n==="active"||n==="recovery"}function Vg(n,t){return Er[n]+Sp(t)}function Wg(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!Xg(s.at))continue;const o=Sp(s.u??0),r=Er[s.at]+o;r>i+Zd&&r<=e+Zd&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>Er[s.at]+s.u-(Er[o.at]+o.u)),a}const bo=1e-6;function na(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Yg(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function wp(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function ic(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=wp()}function Ep(n){return{weapon:ca[Math.max(0,n-1)]??ca[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:wp()}}function $g(n,t){return _o(n,t)}function Zg(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function Tp(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=$g(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,na(n,"attack-start",i)}function Ap(n){return Math.max(0,n.config.combat.settle)}function Rl(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];Tp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ap(n),lunge:Zg(n,i.lunge[e-1]??0)},e)}function jd(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,Tp(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:Ap(n),lunge:i.lunge},0),Ig(n,e,n.combat.attackFacing),na(n,"charge-release",e)}function jg(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),c=a+(1-a)*r;if(e.warp=c,e.warpDebt+=t*(1-c),o>=1){e.warpPhase=3,e.warpTimer=0;const l=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,l)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function qg(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=jg(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",na(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,na(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Rl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>bo&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&Rl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const c=a.windup+a.active+a.recovery;let l=0;i.phase==="windup"?l=i.phaseTimer:i.phase==="active"?l=a.windup+i.phaseTimer:i.phase==="recovery"?l=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(l=c),i.phase!=="idle"&&(i.attackProgress=c>0?Math.min(1,l/c):1),Kg(n)}function Kg(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>bo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:Vg(t.phase,a);if(s<=t.notifyCursor+bo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of Wg(o,t.notifyCursor,s))Yg(n,r.name,r.value);t.notifyCursor=s}function Jg(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=ca.length){const c=ca[e.weaponSlot-1];c!==i.weapon&&(i.weapon=c,ic(n),Or(n),na(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,na(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),qg(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const c=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!c&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;Rl(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,na(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,bo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const c=i.charge;i.charge=0,jd(n,e,c)}}else if(i.charging){i.charging=!1;const c=i.charge;i.charge=0,c>=a.bow.minChargeToFire?jd(n,e,c):na(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>bo)){const c=i.timings.active,l=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>l*(1-Math.pow(1-Math.min(1,Math.max(0,g/c)),d+1)),h=t*i.warp,f=Math.min(c,Math.max(0,i.phaseTimer)),m=Math.min(c,Math.max(0,i.phaseTimer-h));let _=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const ln=1e-6,Pl=Math.PI*2,Qg=7,tx=18,Rp=1.3,Pp=.4,ex=.9,qd=.9;function Kd(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=ln||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),c=Math.min(1,Math.min(s/r,(o-s)/r));return c*c*(3-2*c)}function nx(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function ix(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Jd(n,t,e,i){return n+ix(t-n)*(1-Math.exp(-Math.max(e,ln)*i))}function Br(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function ax(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(Cl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(Cl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function Cl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:cp(),link:nc(),weapon:a,combat:a?{...Ep(ca.indexOf(a)+1),weapon:a}:null}}function sx(n,t=!1){const e=t?op:$0,i=e.indexOf(n);return e[(i+1)%e.length]}function Cp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,Ug(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function ox(n,t,e){const i=Rc(n)*Pl,a=Math.sqrt(Rc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+Rc(n)*.8)}function Oh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function Ll(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function Dl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function rx(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function cx(n,t,e){const i=Oh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function lx(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function hx(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function dx(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function ux(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,Qd(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const c=Math.max(cx(t,i,n),ln);if(t.attackPhaseTimer<c)break;t.attackPhaseTimer-=c,t.attackPhase==="windup"?(t.attackPhase="active",Br(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=hx(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=Dl(t,i)*Pp)))}const s=Oh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),Qd(n,t,i)}function Qd(n,t,e){const i=t.combat;if(!i)return;const a=Oh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function fx(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>ln?a/o:0,c=o>ln?s/o:0;let l=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&ox(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>ln&&(l=_/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(l=r,d=c);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*qd,_=Kd(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;l=r*m-c*_,d=c*m+r*_}else if(t.mode==="attack")o>Ll(n,t,e)&&t.attackPhase==="idle"&&(l=r,d=c);else if(t.mode==="spar"){const h=Ll(n,t,e),f=h*1.7;if(dx(t))o>h*Rp?(l=r,d=c):o<h*.55&&(l=-r*.6,d=-c*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)l=r,d=c;else{const _=Math.max(-1,Math.min(1,(o-f)/.5))*qd,g=Kd(n.time,t.id,e.strafePeriod,e.strafeDuty)*ex;l=r*_-c*g,d=c*_+r*g}}({x:l,z:d}=nx(l,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(l,d)>ln&&(u=Math.atan2(l,d)):o>ln&&(u=Math.atan2(r,c)),e.leashRadius>ln&&t.mode!=="wander"&&t.mode!=="idle"){const h=rx(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,_=Math.hypot(f,m);if(_>h){const g=Math.min(1,(_-h)/Math.max(h*.5,.5)),p=-f/_,v=-m/_;l=l*(1-g)+p*g,d=d*(1-g)+v*g;const x=Math.hypot(l,d);x>ln&&(l/=x,d/=x)}}return{x:l,z:d,facing:u}}function px(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const v=n.character.position,x=Math.hypot(v.x-e.position.x,v.z-e.position.z),y=Ll(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*Rp+ln?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Br(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,Dl(e,i)*Pp)));else if(e.attackCooldown<=0&&x<=y+ln){const w=lx(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=Dl(e,i),n.dummyAttackCount+=1,Br(n,"dummy-attack",e)}}ux(n,e,t,i);const a=fx(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-ln||a.x<0&&e.position.x<=s.minX+ln)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-ln||a.z<0&&e.position.z<=s.minZ+ln)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,ln)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Jd(e.bodyYaw,e.facing,Qg,t),e.headYaw=Jd(e.headYaw,e.facing,tx,t);const c=e.position.x,l=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(zh(n.boxes,e.position,i.radius,i.height,d))if(Fh(n.boxes,e.position,i.radius,i.height,d))e.position.x=c,e.position.z=l,e.velocity.x=0,e.velocity.z=0;else{const v=e.position.x-c,x=e.position.z-l;Math.abs(v)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=Mo(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+ln&&(e.position.y=f);const m=Math.hypot(e.position.x-c,e.position.z-l);e.distance+=m;const _=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,_/Math.max(n.config.moveSpeed,ln)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),ln);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*Pl)%Pl}function mx(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=sx(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Br(n,"dummy-mode",a)}for(const a of n.dummies)px(n,t,a,i)}const gx=["idle","attack","keep-distance"],xx=["sword-shield","dual-swords","greatsword"];function kl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function vx(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));kl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,c=e.modes??gx,l=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??xx,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const _=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(_)*o,p=t.centerZ+Math.sin(_)*o,v=m>=i,x=m-i,y=v?"spar":c[m%c.length],w=v?l[x%l.length]:null,S=v?d*(.25+.22*x):0,E=Cl(n.dummies.length+u.length+1,y,g,p,w,S);E.spawnedByPlot=t.id,u.push(E)}return n.dummies.push(...u),u.length}function yx(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const Il=1e-6;function Pc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function _x(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function Lp(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function tu(n,t,e){return n<t?t:n>e?e:n}function Mx(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),c=Math.max(0,i.blinkDistance);let l=0,d=s.x,u=s.z;for(;l<c-Il;){const h=Math.min(c,l+r),f=s.x+t*h,m=s.z+e*h,_=tu(f,o.minX,o.maxX),g=tu(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(Fh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,u=g,l=h,_!==f||g!==m))break}return{x:d,z:u}}function bx(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,Al(n,"roll")),i.cooldown>0){const c=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),c>0&&i.cooldown===0&&Pc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&ic(n));const c=Z0(n,e),l=c.x,d=c.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=l,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=Mx(n,l,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),Al(n,"blink"),Pc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(Il,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+l*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,Pc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const c=Math.max(Il,i.timer),l=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-l)/c,n.impulse.z=(i.toZ-d)/c}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const oi=1e-6,eu=Math.PI*2;function nu(n,t){return Math.sqrt(n*n+t*t)}function Xo(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Sx(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,ic(n)}function wx(n,t,e){const i=n.character,a=n.config,s=Mo(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,ic(n),bp(n),Lp(n),gp(n),Mp(n),Ur(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=Dh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Ex(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,c=Number.isFinite(e.moveZ)?e.moveZ:0;const l=nu(r,c);l>1&&(r/=l,c/=l);const d=i.worldBounds;(r>0&&s.x>=d.maxX-oi||r<0&&s.x<=d.minX+oi)&&(r=0),(c>0&&s.z>=d.maxZ-oi||c<0&&s.z<=d.minZ+oi)&&(c=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&l>oi;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const L=m?i.skillDecel:l>oi?i.acceleration:i.friction,D=1-Math.exp(-L*t);o.x+=(r*p-o.x)*D,o.z+=(c*p-o.z)*D}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Xo(n,"jumped",i.jumpSpeed)),n.events.some(L=>L.type==="blink"&&L.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,zh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(Fh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const L=s.x-x,D=s.z-y;Math.abs(L)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(D)<Math.abs(o.z*t)*.5&&(o.z=0)}Xo(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=Mo(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+oi&&S-s.y<=i.stepHeight+oi&&(s.y=S,o.y=0,Xo(n,"stepUp",S));const E=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const A=Mo(n.boxes,s.x,s.z,E,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);A>Number.NEGATIVE_INFINITY&&s.y<=A&&o.y<=0?(s.y=A,o.y=0,a.grounded||Xo(n,"landed",A),a.grounded=!0):a.grounded=!1;const b=nu(s.x-x,s.z-y);a.distance+=b;const M=b/Math.max(t,oi),R=Math.min(i.strideSpeedCap,M/Math.max(i.moveSpeed,oi)),k=Math.max(i.strideLength*(1+R*i.strideSpeedGain),oi);a.stride=k,a.gaitPhase=(a.gaitPhase+b/k*eu)%eu}const zl=1e-6,iu=2.399963229728653;function Ra(n,t,e){return n<t?t:n>e?e:n}function au(n,t,e,i,a,s,o,r,c){const l=t.x-n.x,d=t.z-n.z,u=Math.hypot(l,d),h=e+i;if(u>=h)return;let f,m,_;u<zl?(f=r,m=c,_=h):(f=l/u,m=d/u,_=h-u);const g=_+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Tx(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*iu;au(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*iu;au(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const c=n.config.stepHeight,l=n.config.worldBounds;for(const d of e)zh(n.boxes,d.position,s,n.config.dummies.height,c),d.position.x=Ra(d.position.x,l.minX,l.maxX),d.position.z=Ra(d.position.z,l.minZ,l.maxZ)}function Ax(n,t,e,i,a,s,o,r){const c=Math.hypot(e,i),l=Math.max(0,r.contactBand),d=Ra(r.minScale,0,1);if(c<zl||l<=0||d>=1)return 1;const u=a+o,h=Ra(r.approachDot,0,.99);let f=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=u+l)continue;if(p<zl){f=1;continue}const v=(e*_+i*g)/(c*p);if(v<=h)continue;const x=Ra(1-(p-u)/l,0,1),y=Ra((v-h)/(1-h),0,1);f=Math.max(f,x*y)}return 1-(1-d)*Ra(f,0,1)}function Rx(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=Ax(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const Cc=1e-6,Px=Math.PI/180;function Cx(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Lx(n,t,e){return n<t?t:n>e?e:n}function Dx(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>Cc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>Cc&&(o=Math.atan2(e.moveX,e.moveZ));const c=Lx(i.maxAngleDeg,0,180)*Px;let l=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,_=f.position.z-s.z,g=Math.hypot(m,_);if(g<Cc||g>i.range)continue;const p=Math.atan2(m,_),v=Math.abs(He(p-o));if(v>c)continue;const x=g-i.frontBias*Math.cos(v);x<l&&(l=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const _i=1e-6;function ms(n,t,e){return n<t?t:n>e?e:n}function su(n){return Math.atan2(Math.sin(n),Math.cos(n))}function kx(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(L,D)=>{const C=L.position.x-s.x,I=L.position.z-s.z,O=Math.hypot(C,I);if(O<_i||O>D)return 0;const B=ms((D-O)/Math.max(_i,D-i.nearDistance),0,1);let V=B*(i.modeWeight[L.mode]??.5);return L.attackPhase==="active"&&(V+=i.attackBoost*B),V},r=[];let c=0,l=!1,d=!1,u=!1;for(const L of n.dummies){const D=o(L,i.threatRange),C=L.position.x-s.x,I=L.position.z-s.z,O=Math.hypot(C,I);D>0&&(r.push({id:L.id,x:L.position.x,z:L.position.z,dx:C,dz:I,yaw:Math.atan2(C,I),w:D}),c+=D,O<=i.approachDist&&(i.modeWeight[L.mode]??.5)>=i.hostileModeWeight&&(u=!0)),O>_i&&O<=i.recoveryDist&&(l=!0),(L.attackPhase==="windup"||L.attackPhase==="active")&&O<=i.threatRange&&(d=!0)}const h=c<=0?0:ms(c/(c+Math.max(_i,i.saturation)),0,1),f=r.length>0,m=a.active,_=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>_i&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(l||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((L,D)=>D.w-L.w);const v=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let E=0,A=0,b=0;for(const L of v){const D=Math.abs(su(L.yaw-y))/Math.PI;let C=L.w/(1+Math.max(i.spreadFalloff,0)*D*D);L!==x&&i.behindFalloff<1&&Math.abs(su(L.yaw-S))>w&&(C*=Math.max(i.behindFalloff,0)),E+=L.x*C,A+=L.z*C,b+=C}a.mainId=x.id,a.mainYaw=y;const M=n.dummies.find(L=>L.id===x.id),R=(M?M.position.y:0)+n.config.dummies.height*ms(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*ms(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(R-k,Math.max(_i,Math.hypot(x.dx,x.dz))),a.centroidYaw=b>_i?Math.atan2(E/b-s.x,A/b-s.z):y,a.threatCount=r.length,a.threat=h}function Ix(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function zx(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<_i||a>e.threatRange)return 0;const s=Math.max(_i,e.threatRange-e.nearDistance),o=ms((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const c=Math.max(_i,e.modeWeight.attack??1.5);return ms(r/c,0,1)}const Ia=1e-6,Ts=Math.PI*2,So={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function Dp(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??So}function ac(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function Fx(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(Ts*n.time/i-Math.PI/2))}function Ux(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=Ts/Math.max(.1,n.wavelength),r=Ts/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function kp(n){const t=n.dirDeg*Math.PI/180,e=Ts/Math.max(.1,n.wavelength),i=Ts/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const Nx=.18,ou=.4,Ox=.6;function Bx(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*Nx,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function Hx(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Ip(n,t){return n+","+t}function Gx(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:ac((n==null?void 0:n.wind)??So)}}function Xx(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return Gx(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=Hx(a.seed),c=Math.max(1,Math.floor(s.footprintCells)),l=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),_=Math.max(m,Math.floor(f)),g=e.filter(A=>A.kind!=="ground").map(A=>({minX:A.minX-a.avoidMargin,maxX:A.maxX+a.avoidMargin,minZ:A.minZ-a.avoidMargin,maxZ:A.maxZ+a.avoidMargin})),p=[],v=[],x={},y=a.plots??[],w=(A,b)=>{const M=A+c/2,R=b+c/2;for(let k=0;k<y.length;k++){const L=y[k],D=Math.max(0,L.clearMarginCells??0);if(M>=L.minCellX-D&&M<=L.maxCellX+D&&R>=L.minCellZ-D&&R<=L.maxCellZ+D)return!0}return!1},S=(A,b,M)=>{const R=p.length;for(let k=0;k<M;k++){const L=(A+r()*c)*o,D=(b+r()*c)*o;let C=!1;for(let kt=0;kt<g.length;kt++){const Z=g[kt];if(L>=Z.minX&&L<=Z.maxX&&D>=Z.minZ&&D<=Z.maxZ){C=!0;break}}if(C)continue;const I=_p(e,L,D,3,0,.05),O=d+(u-d)*r(),B=(O-d)/Math.max(Ia,u-d),V=Math.min(1,Math.max(0,r()*.68+B*.32)),et=p.length;p.push({id:et,x:L,y:I,z:D,yaw:r()*Ts,height:O,width:o*.26,tone:V,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const ut=Ip(Math.floor(L/l),Math.floor(D/l)),mt=x[ut];mt?mt.push(et):x[ut]=[et]}p.length>R&&v.push({id:v.length,cellX:A,cellZ:b,bladeFrom:R,bladeTo:p.length})},E=()=>m+Math.floor(r()*(_-m+1));for(let A=a.minCellZ;A+c<=a.maxCellZ;A+=c)for(let b=a.minCellX;b+c<=a.maxCellX;b+=c){const M=r();w(b,A)||M>a.density||S(b,A,E())}for(let A=0;A<y.length;A++){const b=y[A],M=Math.min(1,Math.max(0,b.density??1));for(let R=b.minCellZ;R+c<=b.maxCellZ;R+=c)for(let k=b.minCellX;k+c<=b.maxCellX;k+=c)r()>M||S(k,R,E())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:v,buckets:x,cutCount:0,lastCutAt:0,wind:ac(s.wind??So)}}function zp(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),c=Math.floor((e+i)/a),l=[];for(let d=s;d<=o;d++)for(let u=r;u<=c;u++){const h=n.buckets[Ip(d,u)];if(h)for(let f=0;f<h.length;f++)l.push(h[f])}return l}function Vx(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=q0(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=zp(t,i.x,i.z,s);for(let c=0;c<r.length;c++){const l=t.blades[r[c]];if(l.cut!==0||!K0(i,l.x,l.z,a)&&!J0(i,l.x,l.z,a))continue;l.cut=e.regrow?Math.max(Ia,e.regrowSec):-1,l.cutAt=n.time;const d=l.x-i.x,u=l.z-i.z,h=Math.sqrt(d*d+u*u);l.bendX=h>Ia?d/h:i.fx,l.bendZ=h>Ia?u/h:i.fz,l.bend=Math.min(e.maxBendRad,.55),l.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function Wx(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=Dp(n.config);e.wind||(e.wind=ac(a)),Fx(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),c=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const l=n.character.position.x,d=n.character.position.z,u=(m,_)=>{const g=zp(e,m,_,c);for(let p=0;p<g.length;p++){const v=g[p],x=s[v];if(x.cut!==0)continue;const y=x.x-m,w=x.z-_,S=Math.sqrt(y*y+w*w);if(S>c)continue;const E=1-S/c,A=i.maxBendRad*E*E;if(A>x.targetBend){x.targetBend=A;const b=S>Ia?1/S:0;x.bendX=S>Ia?y*b:0,x.bendZ=S>Ia?w*b:1,x.recover=0}r[v]=1}};if(u(l,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const _=s[m];_.bend+=(_.targetBend-_.bend)*(_.targetBend>_.bend?h:f),_.bend<1e-4&&(_.bend=0),!r[m]&&_.bend===0&&(_.recover+=t),_.cut>0&&(_.cut-=t,_.cut<=0&&(_.cut=0))}Vx(n)}function Yx(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=ac(Dp(n.config));t.wind.time=e.time,t.wind.gust=e.gust}function $x(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function Zx(n,t){const e=Tg(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:Ep(1),playerLink:nc(),arrows:[],arrowSeq:0,abilities:Sg(),skills:Mg(n),impulse:{x:0,z:0},targeting:Cx(),turnInPlace:ag(),playerHurt:cp(),hitCount:0,dash:{..._x(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...xp(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:$x(),dummies:ax(n.dummies),dummyAttackCount:0,grass:Xx(n,t,e,t.grid),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0}}}function jx(n){Sx(n),Cp(n),bp(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=Dh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,gp(n),Mp(n),Lp(n),vp(n),Ur(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,Yx(n),n.events.length=0}function ru(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){jx(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Dx(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),Gg(n,t,e),n.modules.combat&&Jg(n,t,e),n.modules.dash&&bx(n,t,e),n.modules.movement&&Ex(n,t,e),n.modules.gaze&&kx(n,t,e),n.modules.orientation&&cg(n,t,e),rg(n,t,e),n.modules.dummies&&mx(n,t,e),j0(n,t),Ng(n,t),n.modules.abilities&&wg(n,t,e),n.modules.combat&&zg(n,t),n.modules.dummies&&(ig(n,t),n.modules.separation&&(Tx(n),Rx(n))),Wx(n,t),n.modules.camera?Eg(n):vp(n),n}const Fp=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],cu=1e-9;function qx(n,t,e){return n<t?t:n>e?e:n}function Up(n){return qx(Number.isFinite(n)?n:0,0,1)}function Np(n,t){const e=Up(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function Kx(){const n={};for(const t of Fp)n[t]=0;return n}function Jx(n,t){const e=Kx(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=Up(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+cu;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],c=r.t-o.t,l=c>cu?(a-o.t)/c:0,d=Np(o.ease??"linear",l);for(const u of Fp){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function Qx(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=Np(i,t/a);return e.turns*Math.PI*2*s}function ma(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function tv(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,c=n.config.maxStepsPerFrame;let l=0;for(;t>=r&&l<c;){const d=l===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};ru(n,r,d),o&&o(),t-=r,l++}return l>=c&&(t=0),l},singleStep(e){ru(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Pi(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ne(n,t,e){return n+(t-n)*e}function ev(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function lu(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:ev(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function nv(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function iv(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ne(n.ch.x,t.ch.x,i),y:Ne(n.ch.y,t.ch.y,i),z:Ne(n.ch.z,t.ch.z,i)},facing:Pi(n.ch.facing,t.ch.facing,i),moveYaw:Pi(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Pi(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Pi(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ne(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ne(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Pi(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ne(n.ch.stride,t.ch.stride,i),velocity:{x:Ne(n.ch.vx,t.ch.vx,i),y:Ne(n.ch.vy,t.ch.vy,i),z:Ne(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ne(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ne(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ne(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ne(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ne(n.hurt.timer,t.hurt.timer,i),knockX:Ne(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ne(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((c,l)=>{const d=n.dm[l];return d?{position:{x:Ne(d.x,c.x,i),y:Ne(d.y,c.y,i),z:Ne(d.z,c.z,i)},facing:Pi(d.facing,c.facing,i),bodyYaw:Pi(d.bodyYaw,c.bodyYaw,i),headYaw:Pi(d.headYaw,c.headYaw,i),gaitPhase:Pi(d.gaitPhase,c.gaitPhase,i),stride:Ne(d.stride,c.stride,i),attackProgress:Ne(d.attackProgress,c.attackProgress,i),velocity:{x:Ne(d.vx,c.vx,i),y:Ne(d.vy,c.vy,i),z:Ne(d.vz,c.vz,i)}}:null});return{time:Ne(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ne(n.dash.timer,t.dash.timer,i)},turn:{progress:Ne(n.turn.progress,t.turn.progress,i)},link:{progress:Ne(n.link.progress,t.link.progress,i)},dummies:r}}function av(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const Op={slopPx:12,longPressMs:450,doubleTapMs:280};function sv(n,t,e=Op.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ga(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function ov(n=Op){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,c){if(t.has(s))return null;for(const l of t.values())if(l.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:c,dragging:!1,longFired:!1}),ga(a,"press",0,0,0,1)},move(a,s,o,r){const c=i(a);if(!c)return null;c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY;return!c.dragging&&Math.hypot(l,d)>=n.slopPx?(c.dragging=!0,ga(c.button,"drag",l,d,r-c.startedAt,1)):null},end(a,s,o,r){const c=i(a);if(!c)return null;t.delete(a),c.x=s,c.y=o;const l=s-c.startX,d=o-c.startY,u=r-c.startedAt,h=Math.hypot(l,d);if(c.dragging||c.longFired||h>=n.slopPx)return ga(c.button,"release",l,d,u,1);const f=e.get(c.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(c.button),ga(c.button,"doubleTap",l,d,u,2)):(e.set(c.button,{at:r,x:s,y:o}),ga(c.button,"tap",l,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ga(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ga(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const Lc=.001,rv=18;function Fl(n,t,e){return n<t?t:n>e?e:n}function Ul(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function cv(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function lv(n,t,e,i,a=rv){const s=cv(t);if(!s)return{state:Ul(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,c=Math.max(1.0001,Number.isFinite(i)?i:1.25),l=1/c,d=c;if(!Number.isFinite(o)||o<Lc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<Lc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<Lc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:Fl(Number.isFinite(f)?f:1,l,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function hu(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?Fl(r,a,s):Fl(n,a,s)}function hv(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function dv(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const Dc=["jump","sprint","reset","attack","skill2"],uv=8,fv=16,kc=10,du=14,uu=140,pv=18,mv=16,gv=400,xv=1.0001;function Tr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function vv(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&Tr(e)}function yv(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,c=0,l=0,d=0,u=0,h=0,f=-1,m=0,_=null,g=-1,p=0,v=0,x=0,y=0,w=!1,S=0,E=1,A=0,b=null,M=0,R=0,k=!1,L=null,D=null,C=0,I=0,O=0,B=0,V=!1,et=!0,ut=-1;const mt=ov({slopPx:du,longPressMs:450,doubleTapMs:350});let kt=[],Z=null;const nt=new Set;function lt(X){X&&kt.push(X)}const at=new Map;let J=Ul(),ht=!1,Ot=1;function $t(){const X=Array.from(at.values()),Y=a(),ct=lv(J,X,Y.pinchGain,Y.maxStepRatio,pv);if(J=ct.state,ht=ct.pinching,ct.scale!==1&&(Ot*=ct.scale),ct.started||ct.armedNow)b=null,k=!0,L=null;else if(ct.ended&&o===null&&X.length===1){const Bt=X[0];o=Bt.id,r=Bt.x,c=Bt.y,l=0,d=0,u=Bt.x,h=Bt.y,w=!1,S=0,E=1,A=0,performance.now(),b=null,k=!0,L=null}}const dt={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},W={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let N=0,zt=0;const Tt={},St=new Set,yt=[];function gt(){for(const X of Dc)Tt[X]!==void 0&&(Tt[X]=void 0),H(X);mt.reset(),nt.clear(),at.clear(),J=Ul(),ht=!1,o=null,l=0,d=0,u=0,h=0,w=!1,S=0,E=1,A=0,p=0,v=0,x=0,y=0,_=null,g=-1,b=null,k=!1,L=null,D=null,ut=-1,O=0,B=0,V=!1,et=!0}const Lt=()=>{document.hidden&&gt()},U=X=>{if(X.clientX===0&&X.clientY===0){m++;return}if(Tr(X.target)||vv(X.clientX,X.clientY)){nt.add(X.pointerId);return}if(nt.delete(X.pointerId),at.set(X.pointerId,{id:X.pointerId,x:X.clientX,y:X.clientY}),o===null&&!ht){_=null,g=-1,o=X.pointerId,r=X.clientX,c=X.clientY,l=0,d=0,u=X.clientX,h=X.clientY,performance.now();const Y=Number.isFinite(X.screenX)&&Number.isFinite(X.screenY)&&(X.screenX!==0||X.screenY!==0);w=Y,S=0,E=1,A=0,p=Y?X.screenX:0,v=Y?X.screenY:0,x=p,y=v,b=X.pointerId,M=X.clientX,R=X.clientY,k=!1}$t()},T=X=>{if(X.pointerId===D&&(X.pointerType==="mouse"&&X.buttons===0||X.clientX===0&&X.clientY===0&&(C!==0||I!==0)||(et?(O=X.clientX-C,B=X.clientY-I):(C=X.clientX,I=X.clientY,et=!0,O=0,B=0))),lt(mt.move(X.pointerId,X.clientX,X.clientY,performance.now())),!nt.has(X.pointerId)&&at.has(X.pointerId)&&(at.set(X.pointerId,{id:X.pointerId,x:X.clientX,y:X.clientY}),$t()),nt.has(X.pointerId)||X.pointerId!==o)return;const Y=performance.now();if(_===X.pointerId&&Y-g<150){m++;return}const ct=X.clientX,Bt=X.clientY;if(ct===0&&Bt===0&&(r!==0||c!==0)){m++;return}const At=ct-u,z=Bt-h,_t=Number.isFinite(X.screenX)&&Number.isFinite(X.screenY),Q=_t?X.screenX:0,rt=_t?X.screenY:0,Ct=_t&&(Q!==0||rt!==0),wt=Q-x,jt=rt-y;if(w&&Ct){const ze=Math.hypot(wt,jt),Le=Math.hypot(At,z);if(ze>3){if(S=0,A<30&&Le>6&&wt*At+jt*z>.7*ze*Le){const xn=ze/Le;xn>.2&&xn<5&&(E+=(xn-E)*.3,A++)}}else Le>12&&(S++,S>=2&&(w=!1))}const ce=Math.hypot(At,z);if(!w){const ze=f<0?Number.POSITIVE_INFINITY:Y-f,Le=Ct?Math.hypot(wt,jt):1/0;ce>28&&(ze<200||Le<ce*.4)&&(r+=At,c+=z,m++)}u=ct,h=Bt,x=Q,y=rt,X.pointerId===b&&Math.hypot(X.clientX-M,X.clientY-R)>uv&&(k=!0);let de,ne;w&&Ct?(de=(Q-p)/E,ne=(rt-v)/E):(de=ct-r,ne=Bt-c);const Se=Math.hypot(de,ne),me=s();Se>me&&(de*=me/Se,ne*=me/Se);const an=Math.hypot(l,d),gn=Math.hypot(de,ne);if(an>10&&gn>10){const ze=Math.abs(Math.atan2(l*ne-d*de,l*de+d*ne)),Le=Math.max(an,gn)*ze,xn=Math.max(Math.hypot(At,z),Math.hypot(wt,jt)/Math.max(.2,E));if(ze>.6&&xn<Math.max(6,Le*.5)){m++;return}}l=de,d=ne};function H(X){if(!dt[X])return;dt[X]=!1,X==="attack"&&(W.attackReleased=!0);const Y=document.getElementById(`btn-${X}`);Y==null||Y.classList.remove("is-down")}function pt(){o!==null&&(_=o,g=performance.now(),o=null,l=0,d=0,u=0,h=0,w=!1,S=0,E=1,A=0,p=0,v=0,x=0,y=0)}const tt=X=>{const Y=at.delete(X.pointerId),ct=nt.delete(X.pointerId);Y&&$t(),X.pointerId===D&&(D=null,V?ut=performance.now():(O=0,B=0,ut=-1)),lt(mt.end(X.pointerId,X.clientX,X.clientY,performance.now()));for(const Ft of Dc)Tt[Ft]===X.pointerId&&(Tt[Ft]=void 0,H(Ft));const Bt=!Y&&!ct&&at.size<=1&&o!==null;(X.pointerId===o||at.size===0||Bt)&&pt(),!ct&&X.pointerId===b&&(!k&&!Tr(X.target)&&(L={x:X.clientX,y:X.clientY}),b=null)};for(const X of Dc){const Y=document.getElementById(`btn-${X}`);if(!Y)continue;const ct=X==="attack"||X==="skill2",Bt=z=>{if(z.preventDefault(),Tt[X]===void 0){Tt[X]=z.pointerId,dt[X]=!0,X==="jump"&&(W.jump=!0),X==="reset"&&(W.reset=!0),X==="sprint"&&(W.sprintPressed=!0),X==="attack"&&(W.attackPressed=!0),X==="skill2"&&(W.skill2=!0),Y.classList.add("is-down"),lt(mt.begin(X,z.pointerId,z.clientX,z.clientY,performance.now()));try{Y.setPointerCapture(z.pointerId)}catch{}ct&&(D=z.pointerId,C=z.clientX,I=z.clientY,et=!(z.clientX===0&&z.clientY===0),O=0,B=0,V=!1,ut=-1)}},Ft=z=>{Tt[X]===z.pointerId&&(Tt[X]=void 0,H(X),lt(mt.end(z.pointerId,z.clientX,z.clientY,performance.now())))},At=z=>{Tt[X]===z.pointerId&&(Tt[X]=void 0,H(X),lt(mt.cancel(z.pointerId,performance.now())))};Y.addEventListener("pointerdown",Bt),Y.addEventListener("pointerup",Ft),Y.addEventListener("pointercancel",At),yt.push(()=>{Y.removeEventListener("pointerdown",Bt),Y.removeEventListener("pointerup",Ft),Y.removeEventListener("pointercancel",At)})}const ot=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const X of ot){const Y=ct=>{ct.preventDefault(),N=Number(X.dataset.weapon)||0};X.addEventListener("pointerdown",Y),yt.push(()=>X.removeEventListener("pointerdown",Y))}const It=X=>{const Y=X.key.toLowerCase();if((Y===" "||Y.startsWith("arrow"))&&X.preventDefault(),St.has(Y))return;St.add(Y),Y===" "&&(W.jump=!0),Y==="r"&&(W.reset=!0),Y==="shift"&&(W.sprintPressed=!0),Y==="j"&&(W.attackPressed=!0),Y==="k"&&(W.skill2=!0),Y>="1"&&Y<="5"&&(N=Number(Y)),Y>="6"&&Y<="9"&&(zt=Number(Y)-5);const ct=Math.max(xv,a().keyStep||1.12);(Y==="="||Y==="+")&&(Ot*=ct),(Y==="-"||Y==="_")&&(Ot/=ct)},Et=X=>{const Y=X.key.toLowerCase();St.has(Y)&&(St.delete(Y),Y==="j"&&(W.attackReleased=!0))},bt=X=>{if(Tr(X.target))return;X.preventDefault();const Y=X.deltaMode===1?X.deltaY*mv:X.deltaMode===2?X.deltaY*gv:X.deltaY;Ot*=hv(Y,a().wheelStep)},Vt=X=>{X.preventDefault()},xt=()=>{f=performance.now()};window.addEventListener("resize",xt),window.addEventListener("orientationchange",xt);const Pt=typeof window<"u"?window.visualViewport:null;return Pt&&(Pt.addEventListener("resize",xt),Pt.addEventListener("scroll",xt)),window.addEventListener("pointerdown",U),window.addEventListener("pointermove",T),window.addEventListener("pointerup",tt),window.addEventListener("pointercancel",tt),window.addEventListener("blur",gt),document.addEventListener("visibilitychange",Lt),window.addEventListener("keydown",It),window.addEventListener("keyup",Et),window.addEventListener("wheel",bt,{passive:!1}),window.addEventListener("gesturestart",Vt),{peekStick(){return{id:o,held:o!==null,originX:r,originY:c,x:u,y:h,dx:u-r,dy:h-c,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:v,screenX:x,screenY:y,scale:E}},peekAim(){const X=performance.now(),Y=Math.hypot(O,B),ct=D!==null||ut>=0&&X-ut<uu;if(!(ct&&V&&Y>=kc))return{active:!1,holding:ct,x:0,z:0,dx:O,dy:B};const Ft=i(),At=O/Y,z=B/Y,_t=Ft.rightX*At+Ft.forwardX*-z,Q=Ft.rightZ*At+Ft.forwardZ*-z,rt=Math.hypot(_t,Q)||1;return{active:!0,holding:ct,x:_t/rt,z:Q/rt,dx:O,dy:B}},sample(){var Cn;const X=s();let Y=o!==null?Math.max(-1,Math.min(1,l/X)):0,ct=o!==null?Math.max(-1,Math.min(1,d/X)):0,Bt=0,Ft=0;(St.has("a")||St.has("arrowleft"))&&(Bt-=1),(St.has("d")||St.has("arrowright"))&&(Bt+=1),(St.has("w")||St.has("arrowup"))&&(Ft-=1),(St.has("s")||St.has("arrowdown"))&&(Ft+=1),Y+=Bt,ct+=Ft;let At=Math.hypot(Y,ct);At>1&&(Y/=At,ct/=At,At=1);const z=Y,_t=ct;At<e&&(Y=0,ct=0);const Q=i();let rt=Q.rightX*Y+Q.forwardX*-ct,Ct=Q.rightZ*Y+Q.forwardZ*-ct;const wt=Math.hypot(rt,Ct);wt>1&&(rt/=wt,Ct/=wt);const jt=performance.now();lt(mt.poll(jt));const ce=Math.hypot(O,B);D!==null&&(ce>=fv?V=!0:ce<kc&&(V=!1));const de=D!==null||ut>=0&&jt-ut<uu,ne=de&&V&&ce>=kc;let Se=0,me=0;if(ne){const rn=O/ce,$=B/ce,Dt=Q.rightX*rn+Q.forwardX*-$,Ut=Q.rightZ*rn+Q.forwardZ*-$,Jt=Math.hypot(Dt,Ut)||1;Se=Dt/Jt,me=Ut/Jt}!de&&D===null&&(O=0,B=0,ut=-1,V=!1);const an=L;L=null;const gn=Ot;Ot=1;const ze={moveX:rt,moveZ:Ct,jumpPressed:W.jump,sprintHeld:dt.sprint||St.has("shift"),sprintPressed:W.sprintPressed,resetPressed:W.reset,attackPressed:W.attackPressed,attackHeld:dt.attack||St.has("j"),attackReleased:W.attackReleased,skill2Pressed:W.skill2,weaponSlot:N,dummyClickId:zt,aimX:Se,aimZ:me,aimActive:ne};W.jump=!1,W.reset=!1,W.sprintPressed=!1,W.attackPressed=!1,W.attackReleased=!1,W.skill2=!1,N=0,zt=0;const Le=kt.map(rn=>sv(rn,Q,du));kt=[],Le.length>0&&(Z=Le[Le.length-1]);const xn=o!==null?"pointer":St.size>0?"keyboard":"idle";return{intents:ze,stickX:Y,stickY:ct,stickRawX:z,stickRawY:_t,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:c,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:v,stickScreenX:x,stickScreenY:y,stickScale:E,stickVpTop:((Cn=dv())==null?void 0:Cn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:O,aimDY:B,source:xn,tap:an,zoomScale:gn,gestures:Le,lastGesture:Z}},dispose(){window.removeEventListener("pointerdown",U),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",tt),window.removeEventListener("pointercancel",tt),window.removeEventListener("blur",gt),document.removeEventListener("visibilitychange",Lt),window.removeEventListener("keydown",It),window.removeEventListener("keyup",Et),window.removeEventListener("wheel",bt),window.removeEventListener("resize",xt),window.removeEventListener("orientationchange",xt),Pt&&(Pt.removeEventListener("resize",xt),Pt.removeEventListener("scroll",xt)),window.removeEventListener("gesturestart",Vt),mt.reset();for(const X of yt)X()}}}const Hr=1,Gr=2,Xr=4,Bp=8,Vr=16,uo=32,Hp=64,Gp=128,_v=[[Hr,"atk"],[Gr,"dash"],[Xr,"link"],[Bp,"air"],[Vr,"hurt"],[uo,"aim"],[Hp,"spr"],[Gp,"chan"]];function Za(n){if(n===0)return"-";const t=_v.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Mv=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],bv=0,Sv=15,Ic=19,wv=21,Ev=22,Tv=23,Av=24,vi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},On=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ri=n=>Math.round(n*180/Math.PI*10)/10,zc=Math.PI*2;function js(n){let t=n%zc;return t>Math.PI&&(t-=zc),t<-Math.PI&&(t+=zc),t}function Rv(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Hr),n.dash.phase!=="idle"&&(e|=Gr),n.playerLink.phase!=="idle"&&(e|=Xr),n.character.grounded||(e|=Bp),n.playerHurt.type!=="none"&&(e|=Vr),t.intents.aimActive&&(e|=uo),n.character.sprinting&&(e|=Hp),n.abilities.channeling&&(e|=Gp),e}function Pv(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function Cv(n){const t={sampleHz:n.sampleHz??vi.sampleHz,sampleCapacity:n.sampleCapacity??vi.sampleCapacity,eventCapacity:n.eventCapacity??vi.eventCapacity,anomalyCapacity:n.anomalyCapacity??vi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??vi.dirJumpDeg,aimDropDeg:n.aimDropDeg??vi.aimDropDeg,freezeMs:n.freezeMs??vi.freezeMs,freezeSpeed:n.freezeSpeed??vi.freezeSpeed,stickLostMs:n.stickLostMs??vi.stickLostMs,spikeMs:n.spikeMs??vi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,c=-1,l=-1e9,d=null,u=0,h=0,f="",m=-1,_=-1,g=-1,p=0,v=-1e9,x=-1,y={},w=null,S=0,E=0,A=0,b=0;function M(C,I){const O=1/t.sampleHz,B=C[bv];B-l<O-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(C),l=B)}function R(C,I,O,B,V,et){const ut=y[C]??-1e9;if(I-ut<1.2)return;if(y[C]=I,C==="frameSpike"){let kt=0;for(const Z of s)Z.kind==="frameSpike"&&kt++;if(kt>=6)return}s.length>=t.anomalyCapacity&&s.shift();let mt=i.slice(-7);et&&(mt.length===0||mt[mt.length-1]!==et)&&(mt=[...mt.slice(-6),et]),s.push({kind:C,t:On(I),tick:O,ms:Math.round(B),detail:V,ctx:mt}),C==="dirJump"?o.dirJumps++:C==="aimDrop"?o.aimDrops++:C==="moveFreeze"?o.freezes++:C==="stickLost"?o.stickLosts++:C==="stickJump"?o.stickJumps++:C==="stickBad"?o.stickBads++:C==="stickDrift"&&o.stickDrifts++}function k(C,I,O,B){a.length>=t.eventCapacity&&a.shift(),a.push({t:On(O),tick:B,k:C,d:I})}function L(C){switch(C.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":v=C.tick;break}}function D(){const C=o,I=C.wallMs/1e3,O=C.gestures,B=mt=>Object.entries(O).filter(([kt])=>kt.endsWith(`.${mt}`)).reduce((kt,[,Z])=>kt+Z,0),V=[];if(V.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),V.push(`运行 ${I.toFixed(1)}s / ${C.frames} 帧 · ${C.fps.toFixed(1)}fps · 最大 ${C.dtMax.toFixed(0)}ms · 尖峰 ${C.spikes} · 步 ${C.steps}`),V.push(`摇杆活跃 ${I>0?Math.round(C.stickActiveMs/1e3/I*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),V.push(`攻击 ${C.attacks}(中${C.hits}) · 受击 ${C.hurts} · 派生 ${C.links}(中${C.linkHits}) · 翻滚 ${C.rolls} 闪现 ${C.blinks} · 跳 ${C.jumps} · 复位 ${C.resets}`),V.push(`法杖 引导${C.channels} 飞弹${C.bolts} 电环${C.rings} · 弓蓄力${C.bowCharges} · 当前武器 ${f||"-"}`),V.push(`异常 ${C.dirJumps+C.aimDrops+C.freezes+C.stickLosts+C.stickJumps+C.stickBads+C.stickDrifts}（dir ${C.dirJumps} / aim ${C.aimDrops} / freeze ${C.freezes} / stick ${C.stickLosts} / stickJump ${C.stickJumps} / 坏指针 ${C.stickBads} / 坐标漂移 ${C.stickDrifts}） · 掉帧尖峰 ${C.spikes}`+(C.inTurns>0?` · 输入转向 ${C.inTurns} 次（最大 ${C.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const mt of s.slice(-6)){V.push(`· ${mt.kind} @t${mt.t.toFixed(2)} tick${mt.tick} ${mt.ms>0?`${mt.ms}ms `:""}${mt.detail}`);const kt=mt.ctx.map(nt=>String(nt[Sv])).join(" "),Z=mt.ctx.map(nt=>nt[Ic]===""||nt[Ic]==null?".":String(nt[Ic])).join(" ");if(V.push(`  yaw ${kt}`),V.push(`  in  ${Z}`),mt.kind==="stickJump"||mt.kind==="stickBad"||mt.kind==="stickLost"){const nt=mt.ctx.map(at=>`${at[wv]},${at[Ev]}`).join(" "),lt=mt.ctx.map(at=>`${at[Tv]},${at[Av]}`).join(" ");V.push(`  o   ${nt}`),V.push(`  p   ${lt}`)}}if(a.length>0){V.push("最近事件：");for(const mt of a.slice(-12))V.push(`  ${mt.t.toFixed(2)} ${mt.k} ${mt.d}`.trimEnd())}const et=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",ut=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return V.push(`摇杆坐标源 ${et}${ut}`),V.push(`UA ${e.ua}`),V.join(`
`)}return{sample(C,I,O,B=0){o.frames++,I.stickHeld&&(I.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=O,O>o.dtMax&&(o.dtMax=O),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=C.time;const V=C.time;if(c<0&&(c=V),A=V,b=C.tick,!r)return;const et=C.character,ut=Math.hypot(I.stickX,I.stickY),mt=Math.hypot(et.velocity.x,et.velocity.z);f=C.combat.weapon;const kt=Rv(C,I),Z=et.facing,lt=Math.hypot(I.intents.moveX,I.intents.moveZ)>.05?Math.atan2(I.intents.moveX,I.intents.moveZ):null;ut>.2&&(o.stickActiveMs+=O);const at=[On(V),C.tick,Math.round(O*10)/10,On(I.stickX),On(I.stickY),On(I.stickRawX),On(I.stickRawY),I.stickHeld?1:0,I.source.slice(0,8),On(I.intents.moveX),On(I.intents.moveZ),On(et.position.x),On(et.position.z),On(et.velocity.x),On(et.velocity.z),ri(Z),ri(et.bodyYaw),kt,On(et.stride),lt===null?"":ri(lt),I.stickId===null?"":I.stickId,Math.round(I.stickOriginX),Math.round(I.stickOriginY),Math.round(I.stickPxX),Math.round(I.stickPxY),I.stickBad,Math.round(I.stickVpTop),Math.round(I.stickOriginSX),Math.round(I.stickOriginSY),Math.round(I.stickScreenX),Math.round(I.stickScreenY),I.stickScreenOk?1:0,Math.round(I.stickScale*100)/100];M(at);const J=V*1e3<x;if(O>t.spikeMs&&!J&&V-c>.6&&(o.spikes++,R("frameSpike",V,C.tick,O,`dt ${O.toFixed(0)}ms fl=${Za(kt)}`,at)),d!==null&&!J){const gt=Math.abs(ri(js(Z-d))),Lt=Math.abs(ri(js(et.moveYaw-u))),U=(h|kt)&(Hr|Gr|Xr|Vr)|kt&uo,T=lt===null?null:Math.abs(ri(js(Z-lt))),H=lt===null||d===null?null:Math.abs(ri(js(d-lt))),pt=T!==null&&H!==null&&T<H-.5,tt=(h&uo)!==0&&(kt&uo)===0&&lt===null,ot=T!==null&&(T<=12||pt);gt>t.aimDropDeg&&tt?R("aimDrop",V,C.tick,0,`${gt.toFixed(0)}° @aim→none stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Za(kt)}`,at):gt>t.dirJumpDeg&&U===0&&!tt&&(ot?(o.inTurns++,gt>o.inTurnMax&&(o.inTurnMax=gt)):R("dirJump",V,C.tick,0,`${gt.toFixed(0)}° res${T===null?" 无输入":`${T.toFixed(0)}°`} yaw ${ri(d)}→${ri(Z)} in ${lt===null?".":ri(lt)}° mvΔ${Lt.toFixed(0)}° aim(${I.aimDX.toFixed(0)},${I.aimDY.toFixed(0)}) fl=${Za(h)}→${Za(kt)}`,at))}const ht=(kt&(Hr|Gr|Xr|Vr))!==0,Ot=C.tick-v<30;ut>.35&&mt<t.freezeSpeed&&!ht&&!Ot?(m<0&&(m=V),V-m>=t.freezeMs/1e3&&V>=_&&(R("moveFreeze",V,C.tick,(V-m)*1e3,`stick(${I.stickX.toFixed(2)},${I.stickY.toFixed(2)}) v${mt.toFixed(2)} ${I.source} fl=${Za(kt)}`,at),_=V+1.5,m=-1)):m=-1,I.stickHeld?(ut>p&&(p=ut),p>.35&&ut<.06?(g<0&&(g=V),V-g>=t.stickLostMs/1e3&&(R("stickLost",V,C.tick,(V-g)*1e3,`raw(${I.stickRawX.toFixed(2)},${I.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Za(kt)}`,at),g=-1,p=0)):g=-1):(p=0,g=-1);const $t=I.stickScale>.2&&I.stickScale<5?I.stickScale:1,dt=I.stickScreenOk,W=dt?I.stickScreenX/$t:I.stickPxX,N=dt?I.stickScreenY/$t:I.stickPxY,zt=dt?I.stickOriginSX/$t:I.stickOriginX,Tt=dt?I.stickOriginSY/$t:I.stickOriginY,St=W-zt,yt=N-Tt;if(I.stickHeld&&I.stickId!==null){const gt=w;if(gt&&gt.held&&gt.id===I.stickId){const Lt=Math.hypot(gt.dx,gt.dy),U=Math.hypot(St,yt),T=Math.max(Lt,U),H=Math.hypot(W-gt.cx,N-gt.cy),pt=Math.abs(ri(js(Math.atan2(yt,St)-Math.atan2(gt.dy,gt.dx)))),tt=T*pt*Math.PI/180,ot=Math.hypot(zt-gt.ox,Tt-gt.oy);if(T>18&&pt>35&&H<Math.max(5,tt*.35)&&R("stickJump",V,C.tick,0,`Δ${pt.toFixed(0)}° 手指只动${H.toFixed(0)}px(弧长应${tt.toFixed(0)}px) o(${Math.round(gt.ox)},${Math.round(gt.oy)})→(${Math.round(zt)},${Math.round(Tt)}) 原点位移${ot.toFixed(0)}px p(${Math.round(W)},${Math.round(N)}) raw(${Math.round(St)},${Math.round(yt)}) id${I.stickId} ${dt?"src=屏幕":"src=client"}`,at),dt&&gt.screenOk){const It=Math.hypot(I.stickPxX-gt.x,I.stickPxY-gt.y),Et=Math.hypot((I.stickScreenX-gt.sx)/$t,(I.stickScreenY-gt.sy)/$t);S+=It-Et,Math.abs(S)>20&&(R("stickDrift",V,C.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) screen(${Math.round(I.stickScreenX)},${Math.round(I.stickScreenY)})`,at),S=0)}}w={id:I.stickId,ox:zt,oy:Tt,cx:W,cy:N,x:I.stickPxX,y:I.stickPxY,sx:I.stickScreenX,sy:I.stickScreenY,dx:St,dy:yt,held:!0,screenOk:dt}}else w=null,S=0;if(I.stickBad>E){const gt=I.stickBad-E;R("stickBad",V,C.tick,0,`拦截 ${gt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${I.stickBad}）o(${Math.round(I.stickOriginX)},${Math.round(I.stickOriginY)}) p(${Math.round(I.stickPxX)},${Math.round(I.stickPxY)}) id${I.stickId??"-"}`,at)}E=I.stickBad,d=Z,u=et.moveYaw,h=kt},event(C,I){const O=Pv(C);L(C),r&&(C.type==="dash-ready"||C.type==="combo-reset"||C.type==="stepUp"||k(C.type,O,I,C.tick))},gesture(C){const I=`${C.button}.${C.kind}`;o.gestures[I]=(o.gestures[I]??0)+1,r&&(C.kind==="longPress"||C.kind==="doubleTap"||C.kind==="drag"||C.kind==="cancel")&&k(`g:${C.kind}`,`${C.button} ${C.heldMs.toFixed(0)}ms d${C.distance.toFixed(0)}px ${C.angleDeg.toFixed(0)}°`,A,b)},suspend(C){x=A*1e3+C,m=-1,g=-1},setEnabled(C){r=C,C||(d=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},l=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,E=0;for(const C of Object.keys(o.gestures))delete o.gestures[C]},status(){const C=o.simS,I=s.some(O=>C-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"||O.kind==="stickJump"||O.kind==="stickBad"||O.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:I,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Mv,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:D}}const Lv="dash",Dv=6,kv="冲刺标尺",Iv="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",zv="square",Fv=5.2,Uv="#bfe8ff",Nv="v9s.15 历史固定工位",Ov={x:9.8,z:8.2},Bv={dx:0,dz:4.6},Hv={dx:-2.8,dz:-4},Gv={id:Lv,index:Dv,name:kv,hint:Iv,shape:zv,radius:Fv,color:Uv,owner:Nv,anchor:Ov,spawn:Bv,label:Hv},Xv="gait",Vv=7,Wv="侧后方步态",Yv="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",$v="circle",Zv=3.2,jv="#6fc9a0",qv="v9s.15 历史固定工位",Kv={x:-9.5,z:0},Jv={dx:0,dz:2.6},Qv={dx:0,dz:-2.5},ty={id:Xv,index:Vv,name:Wv,hint:Yv,shape:$v,radius:Zv,color:jv,owner:qv,anchor:Kv,spawn:Jv,label:Qv},ey="hub",ny=1,iy="中央 8 向",ay="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",sy="circle",oy=3.6,ry="#8fe7ff",cy="v9s.15 历史固定工位",ly={x:0,z:0},hy={dx:0,dz:0},dy={dx:0,dz:-3.1},uy={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2,absolute:!0},fy={id:ey,index:ny,name:iy,hint:ay,shape:sy,radius:oy,color:ry,owner:cy,anchor:ly,spawn:hy,label:dy,grass:uy},py="meter",my=5,gy="进度弧",xy="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",vy="circle",yy=3.2,_y="#b48cff",My="v9s.15 历史固定工位",by={x:-9.5,z:8.6},Sy={dx:0,dz:2.8},wy={dx:0,dz:1.3},Ey={id:py,index:my,name:gy,hint:xy,shape:vy,radius:yy,color:_y,owner:My,anchor:by,spawn:Sy,label:wy},Ty="rings",Ay=2,Ry="环状态色阶",Py="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",Cy="circle",Ly=3.4,Dy="#ffc85a",ky="v9s.15 历史固定工位",Iy={x:-9.5,z:-8.2},zy={dx:0,dz:3},Fy={dx:0,dz:-2.7},Uy={id:Ty,index:Ay,name:Ry,hint:Py,shape:Cy,radius:Ly,color:Dy,owner:ky,anchor:Iy,spawn:zy,label:Fy},Ny="sparring-demo",Oy="陪练试验场",By="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",Hy=2,Gy="#7fd8c0",Xy="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",Vy={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},Wy={id:Ny,name:Oy,hint:By,radius:Hy,color:Gy,owner:Xy,testSpawn:Vy},Yy="terrain",$y=4,Zy="地形 / 门洞",jy="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",qy="square",Ky=5.2,Jy="#7fb8d8",Qy="v9s.15 历史固定工位",t_={x:8.9,z:-7.4},e_={dx:0,dz:4.6},n_={dx:0,dz:-4.5},i_={id:Yy,index:$y,name:Zy,hint:jy,shape:qy,radius:Ky,color:Jy,owner:Qy,anchor:t_,spawn:e_,label:n_},a_="windup",s_=3,o_="起手预警",r_="走进 1.6m：脚下红弧填满 = 命中帧",c_="circle",l_=3.2,h_="#ff5a4a",d_="v9s.15 历史固定工位",u_={x:0,z:-10},f_={dx:0,dz:3},p_={dx:0,dz:-2.6},m_={id:a_,index:s_,name:o_,hint:r_,shape:c_,radius:l_,color:h_,owner:d_,anchor:u_,spawn:f_,label:p_},g_={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},x_={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:-12,maxCellX:12,minCellZ:4,maxCellZ:24,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},v_={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132,dirFlipSec:.16,hipYawTrackRateDeg:240,hipYawBackRateDeg:150},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},y_={core:g_,scene:x_,view:v_};function Bh(n){return JSON.parse(JSON.stringify(n))}const Hh=y_,__=Object.assign({"../config/plots/dash.json":Gv,"../config/plots/gait.json":ty,"../config/plots/hub.json":fy,"../config/plots/meter.json":Ey,"../config/plots/rings.json":Uy,"../config/plots/sparring-demo.json":Wy,"../config/plots/terrain.json":i_,"../config/plots/windup.json":m_}),M_=Object.values(__).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),b_=yp,Qi=Pg(M_,b_),fu=Qi.plots,S_=Bh(Hh.core),wo=Bh(Hh.scene),vn=Bh(Hh.view);wo.stations=Qi.stations;wo.grass&&(wo.grass.plots=Qi.grassPlots);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class wi{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),wi.nextNameID=wi.nextNameID||0,this.$name.id=`lil-gui-name-${++wi.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class w_ extends wi{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Nl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const E_={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:Nl,toHexString:Nl},Eo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},T_={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=Eo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Eo.toHexString(a)}},A_={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=Eo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return Eo.toHexString(a)}},R_=[E_,Eo,T_,A_];function P_(n){return R_.find(t=>t.match(n))}class C_ extends wi{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=P_(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=Nl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Fc extends wi{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class L_ extends wi{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let v=parseFloat(this.$input.value);isNaN(v)||(this._stepExplicit&&(v=this._snap(v)),this.setValue(this._clamp(v)))},i=v=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+v),this.$input.value=this.getValue())},a=v=>{v.key==="Enter"&&this.$input.blur(),v.code==="ArrowUp"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v))),v.code==="ArrowDown"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v)*-1))},s=v=>{this._inputFocused&&(v.preventDefault(),i(this._step*this._normalizeMouseWheel(v)))};let o=!1,r,c,l,d,u;const h=5,f=v=>{r=v.clientX,c=l=v.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=v=>{if(o){const x=v.clientX-r,y=v.clientY-c;Math.abs(y)>h?(v.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&_()}if(!o){const x=v.clientY-l;u-=x*this._step*this._arrowKeyMultiplier(v),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}l=v.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,v,x,y,w)=>(p-v)/(x-v)*(w-y)+y,e=p=>{const v=this.$slider.getBoundingClientRect();let x=t(p,v.left,v.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,c;const l=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,c=p.touches[0].clientY,o=!0):l(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const v=p.touches[0].clientX-r,x=p.touches[0].clientY-c;Math.abs(v)>Math.abs(x)?l(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class D_ extends wi{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class k_ extends wi{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const I_=`.lil-gui {
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
}`;function z_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let pu=!1;class Wr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:c=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",l=>{(l.code==="Enter"||l.code==="Space")&&(l.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),c&&this.domElement.classList.add("allow-touch-styles"),!pu&&r&&(z_(I_),pu=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new D_(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new L_(this,t,e,i,a,s);case"boolean":return new w_(this,t,e);case"string":return new k_(this,t,e);case"function":return new Fc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new C_(this,t,e,i)}addFolder(t){const e=new Wr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof Fc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof Fc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function F_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Wr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Wr({title:"实验台 · 调试面板"}),o=n.config,r=[],c=[],l=bt=>{const Vt=s.addFolder(bt);return c.push(Vt),Vt},d=(bt,Vt)=>{const xt=bt.addFolder(Vt);return r.push(xt),xt},u=l("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=l("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const v=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(v,"iterations",1,8,1).name("迭代次数"),x.add(v,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(v.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(v.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(v.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=l("动作 / 步态"),w=d(y,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)"),w.add(t.gait,"dirFlipSec",0,.4,.01).name("换向融合时长 (s)"),w.add(t.gait,"hipYawTrackRateDeg",0,600,10).name("下盘目标转速上限 (°/s)"),w.add(t.gait,"hipYawBackRateDeg",0,600,10).name("└ 后退相位上限 (°/s)");const S=d(y,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const E=d(y,"足部 IK"),A=t.ik;E.add(A,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),E.add(A,"weight",0,1,.01).name("钉地权重"),E.add(A,"attackScale",0,1,.01).name("攻击时权重倍率"),E.add(A,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const b=d(y,"惯性倾斜 / 盆骨"),M=t.lean;b.add(M,"accelGain",0,.1,.002).name("前后加速度增益"),b.add(M,"turnGain",0,.2,.005).name("绕圈侧倾增益"),b.add(M,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),b.add(M,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),b.add(M,"smoothing",1,30,1).name("倾斜平滑速率"),b.add(M,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),b.add(M,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),b.add(M,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),b.add(M,"crouchSmoothing",1,30,1).name("下沉平滑速率");const R=o.orientation,k=d(y,"朝向 / 接敌注视 / 原地转身");k.add(R,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(R,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(R,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const L=o.gaze;k.add(L,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(L,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(L,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(L,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(L,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(L,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(L,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(L,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(L,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(L,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(L,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const D=o.turnInPlace;k.add(D,"enabled").name("启用原地转身 (关=纯插值)"),k.add(D,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(D,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(D,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(D,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(D,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(D,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(D,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const C=l("战斗 / 命中"),I=o.combat,O=d(C,"连击 / 武器时序"),B=O.add(n.combat,"weapon",ca).name("当前武器");O.add(I,"comboWindow",.1,2,.05).name("连击窗口 (s)"),O.add(I,"settle",0,.8,.01).name("段间停顿 (s)"),O.add(I,"attackMoveScale",0,1,.01).name("攻击时移动比例"),O.add(I,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),O.add(I,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),O.add(I,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),O.add(I,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),O.add(I,"cancelWindow",0,1,.01).name("取消窗口 (s)"),O.add(I,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),O.add(I,"autoCombo").name("按住自动连击"),O.add(I.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),O.add(I.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),O.add(I.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),O.add(I.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),O.add(I.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),O.add(I.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),O.add(I.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),O.add(I.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),O.add(I.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),O.add(I.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),O.add(I.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),O.add(I.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),O.add(I.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const V=o.abilities;O.add(V.arcane,"perWave",1,8,1).name("每波飞弹数"),O.add(V.arcane,"waves",1,12,1).name("每次引导波数"),O.add(V.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),O.add(V.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),O.add(V.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),O.add(V.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),O.add(V.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),O.add(V.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),O.add(V.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),O.add(V.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),O.add(V.arcane,"speed",3,24,.5).name("飞弹速度"),O.add(V.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),O.add(V.ring,"radius",.5,5,.1).name("电环半径"),O.add(V.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),O.add(V.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const et=o.hits.hitstopWarp;if(et){const bt=d(C,"卡肉节奏（接触瓦片）");bt.add(et,"enabled").name("瓦片开（关=硬冻结）"),bt.add(et,"holdRate",0,.4,.01).name("保持期速率"),bt.add(et,"release",.005,.2,.005).name("释放时长 (s)"),bt.add(et,"payback",1,2.5,.05).name("偿还倍率"),bt.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),bt.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),bt.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const ut=o.hits,mt=d(C,"命中 / 受击 / 击退");mt.add(ut,"arcDeg",10,120,5).name("命中扇区半角 (°)"),mt.add(ut,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),mt.add(ut,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),mt.add(ut,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),mt.add(ut.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),mt.add(ut.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),mt.add(ut,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),mt.add(ut,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const kt={get enabled(){return!ut.noDamageToPlayer},set enabled(bt){ut.noDamageToPlayer=!bt}};mt.add(kt,"enabled").name("玩家受击击退");const Z=d(C,"受击分层"),nt=t.hurt;Z.add(nt,"enabled").name("启用分层受击 (关=旧版对照)"),Z.add(nt,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),Z.add(nt,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),Z.add(nt,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),Z.add(nt,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),Z.add(nt,"upperShiftScale",0,1,.01).name("上身位移缩放"),Z.add(nt,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),Z.add(nt.hitHeight,"light",0,1,.01).name("轻击命中部位"),Z.add(nt.hitHeight,"heavy",0,1,.01).name("重击命中部位"),Z.add(nt.hitHeight,"knock",0,1,.01).name("击退命中部位"),Z.add(nt,"leanLight",0,1.5,.01).name("轻击力度"),Z.add(nt,"leanHeavy",0,1.5,.01).name("重击力度"),Z.add(nt,"leanKnock",0,1.5,.01).name("击退力度"),Z.add(nt,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:bt,p:Vt}of[{name:"打腹 (abdomen)",p:nt.abdomen},{name:"打肩 (shoulder)",p:nt.shoulder}]){const xt=d(Z,bt);xt.add(Vt,"upperPitch",0,2,.01).name("上身前后倾斜"),xt.add(Vt,"upperRoll",0,2,.01).name("上身侧倾"),xt.add(Vt,"upperYaw",0,1.5,.01).name("肩部扭转"),xt.add(Vt,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),xt.add(Vt,"shift",0,.8,.01).name("身体反应位移"),xt.add(Vt,"drop",0,.4,.01).name("整体下沉"),xt.add(Vt,"back",0,.4,.01).name("屁股向后"),xt.add(Vt,"knee",0,1.6,.01).name("屈膝"),xt.add(Vt,"hip",0,1,.01).name("髋前倾"),xt.add(Vt,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const lt=d(C,"派生招"),at=o.links;lt.add(at,"enabled").name("总开关 (false=旧连击)"),lt.add(at.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),lt.add(at.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),lt.add(at.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),lt.add(at,"sharedCooldown",0,3,.05).name("共享 CD (s)"),lt.add(at,"triggerWhileSprinting").name("长跑中可直接触发"),lt.add(at.search,"range",1,14,.1).name("索敌距离 (m)"),lt.add(at.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),lt.add(at.search,"stopDistance",0,3,.05).name("停住距离 (m)");const J=at.moves["sword-shield"];J&&(lt.add(J,"enabled").name("剑盾盾击"),lt.add(J,"distance",0,8,.1).name("冲锋极限 (m)"),lt.add(J,"windup",0,.5,.01).name("前摇 (s)"),lt.add(J,"active",0,.8,.01).name("冲锋 / 命中 (s)"),lt.add(J,"recovery",0,.8,.01).name("收势 (s)"),lt.add(J.hit,"radius",0,4,.05).name("命中半径 (m)"),lt.add(J.hit,"width",0,2,.05).name("扫掠半径 (m)"),lt.add(J.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),lt.add(J.hit,"duration",0,1.5,.01).name("僵直 (s)"));const ht=o.targeting,Ot=d(C,"目标辅助");Ot.add(ht,"targetAssist").name("启用目标辅助"),Ot.add(ht,"range",1,14,.5).name("锁定范围 (m)"),Ot.add(ht,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ot.add(ht,"frontBias",0,4,.1).name("朝向加权"),Ot.add(ht,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ot.add(ht,"maxLungeScale",1,3,.1).name("前冲最大放大");const $t=l("表现 / 特效"),dt=d($t,"挥击幅度 / 刀光"),W=t.animation.swing;dt.add(W,"enabled").name("挥击身体幅度 开"),dt.add(W,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),dt.add(W,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),dt.add(W,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),dt.add(W,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),dt.add(W,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),dt.add(W,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),dt.add(W,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),dt.add(W.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const N=t.weaponTrail;dt.add(N,"enabled").name("挥击刀光 开"),dt.add(N,"life",.04,.4,.01).name("刀光残留 (s)"),dt.add(N,"intensity",0,1.5,.05).name("刀光亮度"),dt.add(N,"minStep",.005,.1,.005).name("采样最小位移 (m)"),dt.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const zt=d($t,"夸张化 / 四肢伸缩"),Tt=t.animation.stretch;zt.add(Tt,"enabled").name("四肢伸缩 开"),zt.add(Tt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),zt.add(Tt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),zt.add(Tt,"impactSquash",0,.5,.01).name("命中挤压量"),zt.add(Tt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),zt.add(Tt,"torsoGain",0,1,.05).name("躯干跟随比例"),zt.add(Tt,"volumeExp",0,1.5,.05).name("体积补偿指数");const St=d($t,"武器握持 / 腕部"),yt=t.weaponWrist;St.add(yt,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),St.add(yt,"lag",0,.08,.002).name("臂速 → 腕滞后"),St.add(yt,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),St.add(yt,"rate",4,50,1).name("腕部跟随速率 (1/s)"),St.add(yt,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),St.add(yt,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const gt=t.weaponMount;St.add(gt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),St.add(gt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),St.add(gt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),St.add(gt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),St.add(gt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),St.add(gt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),St.add(gt,"swordPitchDeg",0,90,1).name("剑前倾角"),St.add(gt,"swordYawDeg",0,45,1).name("剑外张角"),St.add(gt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),St.add(gt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Lt=l("假人 / 混战"),U=o.dummies,T=d(Lt,"普通假人 AI");T.add(U,"moveSpeed",.5,8,.1).name("移动速度"),T.add(U,"wanderRadius",.5,8,.1).name("游走半径"),T.add(U,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),T.add(U,"followStopDistance",.3,5,.1).name("跟随停距"),T.add(U,"keepDistance",1,10,.1).name("保持距离"),T.add(U,"keepDeadZone",.1,2,.05).name("保持死区"),T.add(U,"attackRange",.5,5,.1).name("攻击距离"),T.add(U,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),T.add(U,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const H=U.fighters;if(H){const bt=d(Lt,"持械陪练（剑盾 / 双刀 / 大剑）");bt.add(H,"moveSpeed",.5,6,.1).name("移动速度"),bt.add(H,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),bt.add(H,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),bt.add(H,"knockbackScale",0,2,.05).name("击退比例"),bt.add(H,"leashRadius",0,14,.5).name("牵引半径 (m)"),bt.add(H,"comboCount",0,3,1).name("连击段数 (0=随武器)"),bt.add(H,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Vt=()=>n.dummies.find(Pt=>Pt.weapon!==null),xt={get mode(){var Pt;return((Pt=Vt())==null?void 0:Pt.mode)??"spar"},set mode(Pt){i.setFighterMode(Pt)}};bt.add(xt,"mode",op).name("陪练行为（全部）")}const pt=l("相机"),tt=d(pt,"基础");tt.add(t.camera,"pitchDeg",20,80,1).name("俯角"),tt.add(t.camera,"yawDeg",-180,180,1).name("方位角"),tt.add(t.camera,"distance",6,35,.5).name("距离"),tt.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),tt.add(t.camera,"fov",25,90,1).name("FOV");const ot=o.camera,It=d(pt,"智能构图");It.add(ot,"radius",2,18,.5).name("威胁评估半径 (m)"),It.add(ot,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),It.add(ot,"saturation",.5,8,.1).name("威胁归一化饱和"),It.add(ot,"pushIn",0,.5,.01).name("无威胁推进比例"),It.add(ot,"maxPullback",0,1,.02).name("最大拉远比例"),It.add(ot,"maxOffset",0,6,.1).name("最大构图平移 (m)"),It.add(ot,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),It.add(ot,"framingBias",0,1,.05).name("威胁质心平移系数"),It.add(ot,"attackBoost",0,2,.05).name("挥砍中额外加权"),It.add(ot.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),It.add(ot.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),It.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const Et=d(pt,"缩放");return Et.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),Et.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),Et.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),Et.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),Et.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),Et.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),Et.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),Et.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(bt=>bt.close()),c.forEach(bt=>bt.close()),s.close(),{gui:s,refreshWeapon:()=>B.updateDisplay()}}function U_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function N_(n,t){return n.find(e=>e.id===t)??null}function mu(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,c)=>r.index-c.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function O_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var A;const c=a??document.getElementById("lab-panel");let l=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(b){h.textContent=`${b.index} · ${b.name} — ${b.hint}`,h.style.borderColor=b.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function _(){return U_(n,e.character.position.x,e.character.position.z)}function g(){const b=_(),M=(b==null?void 0:b.id)??null;if(M===l)return;const R=l!==null;l=M;for(const[k,L]of u)L.classList.toggle("is-active",k===M);d&&(d.textContent=b?`${b.index} · ${b.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=b?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),b?m(b):R&&h.classList.remove("is-on")}function p(b){const M=typeof b=="number"?n.find(R=>R.index===b)??null:N_(n,b);return M?(wx(e,M.spawnX,M.spawnZ),e.camera.centroidX=M.spawnX,e.camera.centroidZ=M.spawnZ,i.snapCamera(M.spawnX,e.character.position.y,M.spawnZ),g(),!0):!1}function v(){Cp(e)}function x(b){return p(b.id),o?o(b):0}function y(){return r?r():0}function w(b){const M=typeof b=="number"?t.find(R=>R.index===b):t.find(R=>R.id===b);return M&&M.testSpawn?x(M):0}const S=t.filter(b=>b.testSpawn),E=b=>{var M,R;return(((M=b.testSpawn)==null?void 0:M.dummies)??0)+(((R=b.testSpawn)==null?void 0:R.fighters)??0)};if(c){c.textContent="";const b=document.createElement("div");b.className="lab-head",b.textContent="测试工位";const M=document.createElement("span");M.className="lab-tip",M.textContent="[ / ] 切换",b.appendChild(M),c.appendChild(b);for(const L of[...n].sort((D,C)=>D.index-C.index)){const D=document.createElement("button");D.type="button",D.className="lab-row",D.dataset.station=L.id,D.dataset.uiButton="",D.style.setProperty("--lab-color",L.color),D.setAttribute("aria-label",`传送到工位 ${L.index}：${L.name}`);const C=document.createElement("span");C.className="lab-idx",C.textContent=String(L.index);const I=document.createElement("span");I.className="lab-name",I.textContent=L.name,D.append(C,I),D.addEventListener("pointerdown",O=>{O.preventDefault(),O.stopPropagation(),p(L.id)}),c.appendChild(D),u.set(L.id,D)}if(d=document.createElement("div"),d.className="lab-hint",c.appendChild(d),S.length>0){const L=document.createElement("div");L.className="lab-head lab-subhead",L.textContent="地块测试";const D=document.createElement("span");D.className="lab-tip",D.textContent="就地生成",L.appendChild(D),c.appendChild(L);for(const C of S){const I=document.createElement("div");I.className="lab-row lab-test-row",I.dataset.plot=C.id;const O=document.createElement("span");O.className="lab-name",O.textContent=C.name;const B=document.createElement("button");B.type="button",B.className="lab-btn lab-test",B.dataset.uiButton="",B.dataset.plotTest=C.id,B.textContent=((A=C.testSpawn)==null?void 0:A.label)??`生成 ${E(C)} 人`,B.setAttribute("aria-label",`在${C.name}就地生成 ${E(C)} 个测试单位`),B.addEventListener("pointerdown",V=>{V.preventDefault(),V.stopPropagation(),x(C)}),I.append(O,B),c.appendChild(I)}}const R=document.createElement("div");R.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",L=>{L.preventDefault(),L.stopPropagation(),v()}),R.appendChild(k),S.length>0){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.dataset.clearTestUnits="",L.textContent="清除测试单位",L.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),L.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),y()}),R.appendChild(L)}if(s){const L=document.createElement("button");L.type="button",L.className="lab-btn",L.dataset.uiButton="",L.textContent="镜头归位",L.setAttribute("aria-label","把镜头缩放恢复到默认"),L.addEventListener("pointerdown",D=>{D.preventDefault(),D.stopPropagation(),s()}),R.appendChild(L)}c.appendChild(R)}return window.addEventListener("keydown",b=>{var M,R;if(!(b.metaKey||b.ctrlKey||b.altKey))if(b.key==="["){const k=mu(n,((M=_())==null?void 0:M.id)??l,-1);k&&p(k.id)}else if(b.key==="]"){const k=mu(n,((R=_())==null?void 0:R.id)??l,1);k&&p(k.id)}else b.key==="\\"&&v()}),g(),{goto:p,current:_,tick:g,recall:v,spawnAt:w,clearSpawned:y,element:c}}const Uc=Math.PI*2,yi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},B_=45,H_=50;function G_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function qs(n,t,e){const i=G_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function X_(n,t){return Math.atan2(n,-t)*180/Math.PI}function gu(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Vo(n){return(n%360+360)%360}const V_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function W_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),c=a.velocity,l=Math.hypot(c.x,c.z),d=o>.001?qs(s.moveX,s.moveZ,e):null,u=l>.15?qs(c.x,c.z,e):null,h=qs(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?qs(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?qs(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?gu(d,u):null,p=d!==null?gu(d,h):null,v=g!==null&&g>B_&&o>=.35&&l>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?X_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:l,faceDeg:h,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:v}}function xu(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>H_&&(n.inLen>=.35||n.speed>=.4)}const vu="harness.dirDebug";function Y_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let c=!0;if(!t)try{c=window.localStorage.getItem(vu)!=="0"}catch{}function l(){e.classList.toggle("is-off",!c),s&&(s.textContent=c?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(c)))}l();function d(x){if(c=x,!t)try{window.localStorage.setItem(vu,x?"1":"0")}catch{}l()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!c)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!c)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=V_,m=0,_="",g=8;function p(x){if(!r)return;const y=h,w=h,S=y/2,E=w/2,A=Math.min(y,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,w),r.beginPath(),r.arc(S,E,A,0,Uc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":yi.ring,r.stroke(),r.strokeStyle=yi.grid,r.beginPath(),r.moveTo(S-A,E),r.lineTo(S+A,E),r.moveTo(S,E-A),r.lineTo(S,E+A),r.stroke();for(let k=0;k<8;k++){const L=k*Math.PI/4,D=S+Math.sin(L)*(A-3),C=E-Math.cos(L)*(A-3),I=S+Math.sin(L)*A,O=E-Math.cos(L)*A;r.beginPath(),r.moveTo(D,C),r.lineTo(I,O),r.stroke()}const b=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;b>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=yi.dead,r.beginPath(),r.arc(S,E,A*b,0,Uc),r.stroke(),r.restore());const M=(k,L,D,C,I=!1,O=1)=>{const B=k*Math.PI/180,V=Math.sin(B),et=-Math.cos(B),ut=A*Math.max(.14,Math.min(1,L)),mt=S+V*A*.14,kt=E+et*A*.14,Z=S+V*ut,nt=E+et*ut;if(r.save(),r.globalAlpha=O,r.strokeStyle=D,r.fillStyle=D,r.lineWidth=C,r.lineCap="round",I&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(mt,kt),r.lineTo(Z,nt),r.stroke(),!I&&ut>A*.3){const lt=-et,at=V,J=5.2;r.beginPath(),r.moveTo(Z+V*1.5,nt+et*1.5),r.lineTo(Z-V*J+lt*J*.72,nt-et*J+at*J*.72),r.lineTo(Z-V*J-lt*J*.72,nt-et*J-at*J*.72),r.closePath(),r.fill()}r.restore()},R=(k,L)=>{const D=k*Math.PI/180,C=Math.sin(D),I=-Math.cos(D),O=-I,B=C,V=A+1.5,et=V+6.5;r.save(),r.fillStyle=L,r.strokeStyle=L,r.lineWidth=1,r.beginPath(),r.moveTo(S+C*et,E+I*et),r.lineTo(S+C*V+O*4,E+I*V+B*4),r.lineTo(S+C*V-O*4,E+I*V-B*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&M(x.lockDeg,1,yi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&M(x.rawDeg,x.rawLen,yi.raw,1,!0,.9),x.aimDeg!==null&&M(x.aimDeg,1,yi.aim,1.6,!0,.95),M(x.faceDeg,1,yi.face,1.1,!0,.55),x.moveDeg!==null&&M(x.moveDeg,x.speed/Math.max(1,g),yi.move,5.5,!1,.8),x.inDeg!==null&&M(x.inDeg,x.inLen,yi.input,2.2),R(x.faceDeg,yi.face),r.beginPath(),r.arc(S,E,2.2,0,Uc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function v(x,y){const w=A=>A===null?"-":String(Math.round(Vo(A)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=A=>A===null?"-":`${Math.round(A)}°`,E=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&E.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&E.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&E.push("拖拽瞄准"),o.gap.textContent=E.join("  "),e.classList.toggle("is-warn",x.warnMove||xu(x,y))}return{update(x,y,w){if(!c)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=W_(x,y,w,g);f=S;const E=x.combat.phase!=="idle";p(S);const A=performance.now(),b=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(A-m>90||b!==_)&&(m=A,_=b,v(S,E),e.dataset.in=S.inDeg===null?"":Vo(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Vo(S.moveDeg).toFixed(1),e.dataset.fc=Vo(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||xu(S,E)?"1":"0")},setEnabled:d,toggle(){return d(!c),c},enabled:()=>c,last:()=>f}}const $_=6,Z_=480,yu=240,_u=128,j_=18,q_=.05,Mu=.16,K_=.02;function bu(n,t,e){if(!e)return"air";if(t<q_)return"both";const i=Math.sin(n);return i>Mu?"L":i<-Mu?"R":"both"}function Su(n){const t=Math.PI*2;return(n%t+t)%t}function wu(n,t){const e=Math.PI*2;let i=t-n;return i-=Math.round(i/e)*e,n+i}const Eu={L:"#fbbf24",R:"#a78bfa",both:"rgba(148, 163, 184, 0.85)",air:"#38bdf8"},J_={L:"rgba(251, 191, 36, 0.13)",R:"rgba(167, 139, 250, 0.13)",both:"rgba(148, 163, 184, 0.09)",air:"rgba(56, 189, 248, 0.07)"},Q_={L:"左踩",R:"右踩",both:"双踩",air:"腾空"};function tM(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1,phase:0,stance:"both",grounded:!0,moving:!1}}function eM(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function nM(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function iM(n={}){const t=Math.max(1,n.windowS??$_),e=Math.max(60,n.capacity??Z_),i=Math.max(1,n.speedCap??j_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv / 相位</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="128"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),c=s.querySelector("#motiondbg-graph"),l=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=c.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));c.width=Math.round(yu*f),c.height=Math.round(_u*f);const m=Y_({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function g(M){_=M,s.classList.toggle("is-off",!M),!a&&r&&(r.textContent=M?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(M)),r.setAttribute("aria-label",M?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",M=>{M.preventDefault(),M.stopPropagation(),g(!_)}),window.addEventListener("keydown",M=>{M.key.toLowerCase()==="v"&&!M.metaKey&&!M.ctrlKey&&g(!_)}));const p=[];let v=0,x=null,y=0,w=!1,S=-1,E={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1,phase:0,stance:"both"};function A(M){const R=M-t;let k=0;for(;k<p.length&&p[k].t<R;)k++;return p.slice(k)}function b(M,R){if(!h)return;const k=yu,L=_u;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,k,L),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,k,L);const D=4,C=4,I=k-D-C,O=9,B=44,V=58,et=20,ut=84,mt=38,kt=R-t,Z=dt=>D+Math.max(0,Math.min(1,(dt-kt)/t))*I;for(let dt=0;dt<M.length;dt++){if(!M[dt].busy)continue;const W=Z(M[dt].t),N=dt+1<M.length?Z(M[dt+1].t):W+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(W,O,Math.max(2,N-W),B)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const dt of[O,O+B/2,O+B])h.moveTo(D,dt),h.lineTo(k-C,dt);h.moveTo(D,V+et/2),h.lineTo(k-C,V+et/2);for(const dt of[ut,ut+mt/2,ut+mt])h.moveTo(D,dt),h.lineTo(k-C,dt);h.stroke();const lt=Math.max(1,...M.map(dt=>dt.speed),...M.map(dt=>dt.drive))*1.15,at=dt=>O+B-dt/lt*B;if(M.length>1){h.beginPath(),h.moveTo(Z(M[0].t),at(M[0].speed));for(let dt=1;dt<M.length;dt++)h.lineTo(Z(M[dt].t),at(M[dt].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(Z(M[M.length-1].t),O+B),h.lineTo(Z(M[0].t),O+B),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(Z(M[0].t),at(M[0].drive));for(let dt=1;dt<M.length;dt++)h.lineTo(Z(M[dt].t),at(M[dt].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let J=.02;for(const dt of M)J=Math.max(J,Math.abs(dt.dv));J*=1.1;const ht=V+et/2,Ot=et/2;for(const dt of M){const W=Math.min(Ot,Math.abs(dt.dv)/J*Ot);h.fillStyle=dt.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(Z(dt.t)-.7,dt.dv>=0?ht-W:ht,1.4,Math.max(.5,W))}const $t=dt=>ut+mt/2-dt*(mt/2-1);for(let dt=0;dt<M.length;dt++){const W=M[dt].stance;if(W==="air")continue;const N=Z(M[dt].t),zt=dt+1<M.length?Z(M[dt+1].t):N+2;h.fillStyle=J_[W],h.fillRect(N,ut,Math.max(1,zt-N),mt)}if(M.length>1){let dt=Z(M[0].t),W=$t(Math.sin(M[0].phase));for(let zt=1;zt<M.length;zt++){const Tt=M[zt-1],St=M[zt],yt=Z(Tt.t),gt=Z(St.t),Lt=wu(Tt.phase,St.phase),U=Math.max(1,Math.min(16,Math.round((gt-yt)/2)));for(let T=1;T<=U;T++){const H=T/U,pt=Tt.phase+(Lt-Tt.phase)*H,tt=yt+(gt-yt)*H,ot=$t(Math.sin(pt)),It=T===U?St.stance:bu(pt,Tt.moving?1:0,Tt.grounded);h.beginPath(),h.moveTo(dt,W),h.lineTo(tt,ot),h.strokeStyle=Eu[It],h.lineWidth=1.7,h.lineJoin="round",h.stroke(),dt=tt,W=ot}}const N=M[M.length-1];h.beginPath(),h.arc(Z(N.t)-1.5,$t(Math.sin(N.phase)),2.1,0,Math.PI*2),h.fillStyle=Eu[N.stance],h.fill()}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(lt.toFixed(1),D+2,O+8),h.fillText("v",D+2,O+B-2),h.fillText("Δv",D+2,V+9),h.fillStyle="rgba(251, 191, 36, 0.75)",h.fillText("L",D+2,ut+8),h.fillStyle="rgba(167, 139, 250, 0.75)",h.fillText("R",D+2,ut+mt-2),h.textAlign="right",h.fillStyle="rgba(190, 214, 234, 0.55)",h.fillText("0",k-C-2,O+B-2),h.textAlign="left"}return{dirDebug:m,update(M,R,k){var Z;const L=performance.now()/1e3,D=S<0?1/60:Math.max(1e-4,Math.min(.25,L-S));S=L;const C=M.character,I={x:C.position.x,z:C.position.z},O=Math.hypot(C.velocity.x,C.velocity.z),{speed:B,raw:V}=x?eM(x,I,D,i):{speed:0,raw:0},et=tM(v,B,D,L);et.drive=O,et.raw=V,et.busy=nM(M);const ut=((Z=n.phaseSource)==null?void 0:Z.call(n))??C.gaitPhase;et.phase=ut,et.grounded=C.grounded,et.moving=w&&Math.abs(wu(y,ut)-y)>K_,y=ut,w=!0,et.stance=bu(ut,et.moving?1:0,C.grounded),x=I,v=B,p.push(et),p.length>e&&p.shift();const mt=A(L);let kt=0;for(const nt of mt)kt=Math.max(kt,nt.speed);if(E={speed:B,drive:O,raw:V,dv:et.dv,accel:et.accel,peak:kt,samples:mt.length,windowS:t,busy:et.busy,phase:Su(ut),stance:et.stance},m.update(M,R,k),_){b(mt,L);const nt=et.dv>=0?"+":"";l.textContent=`v ${B.toFixed(2)} · 驱 ${O.toFixed(2)} · 峰 ${kt.toFixed(2)} · Δv ${nt}${et.dv.toFixed(3)} · ${mt.length} 帧
φ ${Su(ut).toFixed(2)} · ${Q_[et.stance]}`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...E}),samples:()=>A(performance.now()/1e3).map(M=>({...M}))}}const aM=["剑盾","双剑","大剑","法杖","弓"],sM={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function oM(n){return{update(t,e,i,a,s,o,r=!1){const c=t.character,l=c.position,d=c.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=dt=>dt.toFixed(2),m=dt=>(dt*180/Math.PI).toFixed(0),_=aM[ca.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),v=t.dash,x=v.phase==="active"&&v.duration>0?(1-v.timer/v.duration)*100:0,y=v.phase==="active"?`${v.kind}@${x.toFixed(0)}%`:`${v.kind} cd${f(v.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=d.x*Math.sin(c.bodyYaw)+d.z*Math.cos(c.bodyYaw),E=d.x*Math.cos(c.bodyYaw)-d.z*Math.sin(c.bodyYaw),A=Math.abs(S)+Math.abs(E)+1e-6,b=Math.round(Math.abs(E)/A*100),M=`strafe ${b}%${S<-.05?" back":""}`,R=t.camera,k=`threat ${(R.threat*100).toFixed(0)}%  dist×${f(R.distanceScale)}  off (${f(R.offsetX)},${f(R.offsetZ)})  pitch +${f(R.pitchDelta)}°  n=${R.threatCount}`,L=o?f(o.attackBlend):"-",D=o==null?void 0:o.attackWeights,C=D?`gw ${f(D.gaitScale)}  lw ${f(D.attackLegWeight)}  spd ${f(D.driveSpeed)}`:"-",I=D?`${f(D.gaitScale)}/${f(D.attackLegWeight)}`:"-",O=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",V=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",et=o==null?void 0:o.hurt,ut=et?`hurt ${t.playerHurt.type}  部位h${f(et.hitHeight)}  脉冲p${f(et.pulse)}  上身${f(et.upperShift)}  重心${f(et.comShift)}  后坐${f(et.pelvisBack)}  屈膝${f(et.knee)}`:"-",mt=et?`${f(et.hitHeight)}/${f(et.pulse)}/${f(et.knee)}`:"-",kt=o==null?void 0:o.ik,Z=kt?`${kt.active?"on":"off"} w${f(kt.weight)} e${f(kt.maxError)}`:"-",nt=t.playerLink,lt=`link ${nt.kind||"-"}  ${nt.phase}  prog ${f(nt.progress)}  win ${f(nt.linkWindow)}s  cd ${f(nt.cooldown)}s  hits ${nt.hitIds.length}  travel ${f(nt.travelled)}/${f(nt.travel)}m  id ${nt.id}`,at=`${nt.phase}/${nt.kind||"-"}/w${f(nt.linkWindow)}`,J=a.lastGesture,ht=J?`${J.button} ${J.kind} ${J.heldMs.toFixed(0)}ms d${J.distance.toFixed(0)}px ${J.angleDeg.toFixed(0)}° taps${J.taps}`:"-",Ot=t.dummies.map(dt=>`${dt.id}:${sM[dt.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${nt.phase}${nt.kind?`/${nt.kind}`:""} w${f(nt.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(l.x)},${f(l.y)},${f(l.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  st${b}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(c.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${L}  gw/lw ${I}  land ${B}  ik ${Z}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${mt}`,`dummies ${Ot}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${f(R.distanceScale)}  ${V}  lk ${at}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${ht}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(l.x)}, ${f(l.y)}, ${f(l.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${c.grounded?"Y":"N"}   sprint ${c.sprinting?"Y":"N"}   facing ${m(c.facing)}deg   atkBlend ${L}   ${C}   land ${O}`,ut,`ik ${Z}  clamped ${kt?kt.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(c.facing)}  body ${m(c.bodyYaw)}  head ${m(c.headYaw)}  move ${m(c.moveYaw)}  (head-body ${m(c.headYaw-c.bodyYaw)})  ${M}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${v.kind}  phase ${v.phase}  prog ${x.toFixed(0)}%  cd ${f(v.cooldown)}s  id ${v.id}  from (${f(v.fromX)},${f(v.fromZ)}) → to (${f(v.toX)},${f(v.toZ)})`,lt,`camera ${k}  ${V}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Ot}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${ht}`].join(`
`)}}}const Wo=["lab","hud","motion","debug"],Tu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},Au={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function rM(n){var c;const t=Object.fromEntries(Wo.map(l=>[l,document.getElementById(Au[l].toggle)])),e=Object.fromEntries(Wo.map(l=>[l,document.getElementById(Au[l].panel)]));let i={},a=null;function s(){var l,d,u;for(const h of Wo){const f=a===h,m=t[h],_=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${Tu[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${Tu[h].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(l=i.motion)==null||l.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(l){a=a===l?null:l,s()}function r(){a!==null&&(a=null,s())}for(const l of Wo)(c=t[l])==null||c.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(l)});return window.addEventListener("keydown",l=>{l.key.toLowerCase()==="v"&&!l.metaKey&&!l.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(l){i=l,s()},toggle:o,closeAll:r,isOpen:l=>a===l}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Gh="170",cM=0,Ru=1,lM=2,Xp=1,Vp=2,Fi=3,la=0,Bn=1,en=2,sa=0,ys=1,Ui=2,Pu=3,Cu=4,hM=5,Pa=100,dM=101,uM=102,fM=103,pM=104,mM=200,gM=201,xM=202,vM=203,Ol=204,Bl=205,yM=206,_M=207,MM=208,bM=209,SM=210,wM=211,EM=212,TM=213,AM=214,Hl=0,Gl=1,Xl=2,As=3,Vl=4,Wl=5,Yl=6,$l=7,Xh=0,RM=1,PM=2,oa=0,CM=1,LM=2,DM=3,kM=4,IM=5,zM=6,FM=7,Wp=300,Rs=301,Ps=302,Zl=303,jl=304,sc=306,ql=1e3,La=1001,Kl=1002,jn=1003,UM=1004,Yo=1005,bi=1006,Nc=1007,Da=1008,Hi=1009,Yp=1010,$p=1011,To=1012,Vh=1013,za=1014,Si=1015,ko=1016,Wh=1017,Yh=1018,Cs=1020,Zp=35902,jp=1021,qp=1022,ui=1023,Kp=1024,Jp=1025,_s=1026,Ls=1027,$h=1028,Zh=1029,Qp=1030,jh=1031,qh=1033,Ar=33776,Rr=33777,Pr=33778,Cr=33779,Jl=35840,Ql=35841,th=35842,eh=35843,nh=36196,ih=37492,ah=37496,sh=37808,oh=37809,rh=37810,ch=37811,lh=37812,hh=37813,dh=37814,uh=37815,fh=37816,ph=37817,mh=37818,gh=37819,xh=37820,vh=37821,Lr=36492,yh=36494,_h=36495,tm=36283,Mh=36284,bh=36285,Sh=36286,NM=3200,OM=3201,em=0,BM=1,ta="",Fn="srgb",ks="srgb-linear",oc="linear",Oe="srgb",ja=7680,Lu=519,HM=512,GM=513,XM=514,nm=515,VM=516,WM=517,YM=518,$M=519,wh=35044,fo=35048,Du="300 es",Oi=2e3,Yr=2001;class Is{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const Tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ku=1234567;const Ms=Math.PI/180,Ao=180/Math.PI;function Ei(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tn[n&255]+Tn[n>>8&255]+Tn[n>>16&255]+Tn[n>>24&255]+"-"+Tn[t&255]+Tn[t>>8&255]+"-"+Tn[t>>16&15|64]+Tn[t>>24&255]+"-"+Tn[e&63|128]+Tn[e>>8&255]+"-"+Tn[e>>16&255]+Tn[e>>24&255]+Tn[i&255]+Tn[i>>8&255]+Tn[i>>16&255]+Tn[i>>24&255]).toLowerCase()}function Sn(n,t,e){return Math.max(t,Math.min(e,n))}function Kh(n,t){return(n%t+t)%t}function ZM(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function jM(n,t,e){return n!==t?(e-n)/(t-n):0}function po(n,t,e){return(1-e)*n+e*t}function qM(n,t,e,i){return po(n,t,1-Math.exp(-e*i))}function KM(n,t=1){return t-Math.abs(Kh(n,t*2)-t)}function JM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function QM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function tb(n,t){return n+Math.floor(Math.random()*(t-n+1))}function eb(n,t){return n+Math.random()*(t-n)}function nb(n){return n*(.5-Math.random())}function ib(n){n!==void 0&&(ku=n);let t=ku+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ab(n){return n*Ms}function sb(n){return n*Ao}function ob(n){return(n&n-1)===0&&n!==0}function rb(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function cb(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function lb(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),c=o(e/2),l=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,c*u,c*h,r*l);break;case"YZY":n.set(c*h,r*d,c*u,r*l);break;case"ZXZ":n.set(c*u,c*h,r*d,r*l);break;case"XZX":n.set(r*d,c*m,c*f,r*l);break;case"YXY":n.set(c*f,r*d,c*m,r*l);break;case"ZYZ":n.set(c*m,c*f,r*d,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function di(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ue(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Iu={DEG2RAD:Ms,RAD2DEG:Ao,generateUUID:Ei,clamp:Sn,euclideanModulo:Kh,mapLinear:ZM,inverseLerp:jM,lerp:po,damp:qM,pingpong:KM,smoothstep:JM,smootherstep:QM,randInt:tb,randFloat:eb,randFloatSpread:nb,seededRandom:ib,degToRad:ab,radToDeg:sb,isPowerOfTwo:ob,ceilPowerOfTwo:rb,floorPowerOfTwo:cb,setQuaternionFromProperEuler:lb,normalize:Ue,denormalize:di};class Xt{constructor(t=0,e=0){Xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Sn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class _e{constructor(t,e,i,a,s,o,r,c,l){_e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l)}set(t,e,i,a,s,o,r,c,l){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=c,d[6]=i,d[7]=o,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],c=i[6],l=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],_=a[0],g=a[3],p=a[6],v=a[1],x=a[4],y=a[7],w=a[2],S=a[5],E=a[8];return s[0]=o*_+r*v+c*w,s[3]=o*g+r*x+c*S,s[6]=o*p+r*y+c*E,s[1]=l*_+d*v+u*w,s[4]=l*g+d*x+u*S,s[7]=l*p+d*y+u*E,s[2]=h*_+f*v+m*w,s[5]=h*g+f*x+m*S,s[8]=h*p+f*y+m*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8];return e*o*d-e*r*l-i*s*d+i*r*c+a*s*l-a*o*c}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=d*o-r*l,h=r*c-d*s,f=l*s-o*c,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=u*_,t[1]=(a*l-d*i)*_,t[2]=(r*i-a*o)*_,t[3]=h*_,t[4]=(d*e-a*c)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*c-l*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*o+l*r)+o+t,-a*l,a*c,-a*(-l*o+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Oc.makeScale(t,e)),this}rotate(t){return this.premultiply(Oc.makeRotation(-t)),this}translate(t,e){return this.premultiply(Oc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Oc=new _e;function im(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function $r(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function hb(){const n=$r("canvas");return n.style.display="block",n}const zu={};function ro(n){n in zu||(zu[n]=!0,console.warn(n))}function db(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function ub(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function fb(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ce={enabled:!0,workingColorSpace:ks,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Oe&&(n.r=Bi(n.r),n.g=Bi(n.g),n.b=Bi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Oe&&(n.r=bs(n.r),n.g=bs(n.g),n.b=bs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===ta?oc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Bi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function bs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Fu=[.64,.33,.3,.6,.15,.06],Uu=[.2126,.7152,.0722],Nu=[.3127,.329],Ou=new _e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bu=new _e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ce.define({[ks]:{primaries:Fu,whitePoint:Nu,transfer:oc,toXYZ:Ou,fromXYZ:Bu,luminanceCoefficients:Uu,workingColorSpaceConfig:{unpackColorSpace:Fn},outputColorSpaceConfig:{drawingBufferColorSpace:Fn}},[Fn]:{primaries:Fu,whitePoint:Nu,transfer:Oe,toXYZ:Ou,fromXYZ:Bu,luminanceCoefficients:Uu,outputColorSpaceConfig:{drawingBufferColorSpace:Fn}}});let qa;class pb{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qa===void 0&&(qa=$r("canvas")),qa.width=t.width,qa.height=t.height;const i=qa.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=qa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=$r("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Bi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Bi(e[i]/255)*255):e[i]=Bi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let mb=0;class am{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mb++}),this.uuid=Ei(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Bc(a[o].image)):s.push(Bc(a[o]))}else s=Bc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Bc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?pb.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let gb=0;class Pn extends Is{constructor(t=Pn.DEFAULT_IMAGE,e=Pn.DEFAULT_MAPPING,i=La,a=La,s=bi,o=Da,r=ui,c=Hi,l=Pn.DEFAULT_ANISOTROPY,d=ta){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:gb++}),this.uuid=Ei(),this.name="",this.source=new am(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Xt(0,0),this.repeat=new Xt(1,1),this.center=new Xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new _e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Wp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ql:t.x=t.x-Math.floor(t.x);break;case La:t.x=t.x<0?0:1;break;case Kl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ql:t.y=t.y-Math.floor(t.y);break;case La:t.y=t.y<0?0:1;break;case Kl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=Wp;Pn.DEFAULT_ANISOTROPY=1;class nn{constructor(t=0,e=0,i=0,a=1){nn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const c=t.elements,l=c[0],d=c[4],u=c[8],h=c[1],f=c[5],m=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,w=(p+1)/2,S=(d+h)/4,E=(u+_)/4,A=(m+g)/4;return x>y&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=E/i):y>w?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=S/a,s=A/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=E/s,a=A/s),this.set(i,a,s,e),this}let v=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-_)/v,this.z=(h-d)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xb extends Is{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new nn(0,0,t,e),this.scissorTest=!1,this.viewport=new nn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Pn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new am(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fa extends xb{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class sm extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=jn,this.minFilter=jn,this.wrapR=La,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class vb extends Pn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=jn,this.minFilter=jn,this.wrapR=La,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ra{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let c=i[a+0],l=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(u!==_||c!==h||l!==f||d!==m){let g=1-r;const p=c*h+l*f+d*m+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*v);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const y=r*v;if(c=c*g+h*y,l=l*g+f*y,d=d*g+m*y,u=u*g+_*y,g===1-r){const w=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=w,l*=w,d*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],c=i[a+1],l=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+c*f-l*h,t[e+1]=c*m+d*h+l*u-r*f,t[e+2]=l*m+d*f+r*h-c*u,t[e+3]=d*m-r*u-c*h-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,c=Math.sin,l=r(i/2),d=r(a/2),u=r(s/2),h=c(i/2),f=c(a/2),m=c(s/2);switch(o){case"XYZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u+h*f*m;break;case"YZX":this._x=h*d*u+l*f*m,this._y=l*f*u+h*d*m,this._z=l*d*m-h*f*u,this._w=l*d*u-h*f*m;break;case"XZY":this._x=h*d*u-l*f*m,this._y=l*f*u-h*d*m,this._z=l*d*m+h*f*u,this._w=l*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],c=e[9],l=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-c)*f,this._y=(s-l)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-c)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-l)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(c+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+l)/f,this._y=(c+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Sn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,c=e._y,l=e._z,d=e._w;return this._x=i*d+o*r+a*l-s*c,this._y=a*d+o*c+s*r-i*l,this._z=s*d+o*l+i*c-a*r,this._w=o*d-i*r-a*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),d=Math.atan2(l,r),u=Math.sin((1-e)*d)/l,h=Math.sin(e*d)/l;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class G{constructor(t=0,e=0,i=0){G.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,c=t.w,l=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+c*l+o*u-r*d,this.y=i+c*d+r*l-s*u,this.z=a+c*u+s*d-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,c=e.z;return this.x=a*c-s*r,this.y=s*o-i*c,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Hc.copy(this).projectOnVector(t),this.sub(Hc)}reflect(t){return this.sub(Hc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Sn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hc=new G,Hu=new ra;class Oa{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ci.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ci.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ci.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ci):ci.fromBufferAttribute(s,o),ci.applyMatrix4(t.matrixWorld),this.expandByPoint(ci);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$o.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),$o.copy(i.boundingBox)),$o.applyMatrix4(t.matrixWorld),this.union($o)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ci),ci.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ks),Zo.subVectors(this.max,Ks),Ka.subVectors(t.a,Ks),Ja.subVectors(t.b,Ks),Qa.subVectors(t.c,Ks),$i.subVectors(Ja,Ka),Zi.subVectors(Qa,Ja),xa.subVectors(Ka,Qa);let e=[0,-$i.z,$i.y,0,-Zi.z,Zi.y,0,-xa.z,xa.y,$i.z,0,-$i.x,Zi.z,0,-Zi.x,xa.z,0,-xa.x,-$i.y,$i.x,0,-Zi.y,Zi.x,0,-xa.y,xa.x,0];return!Gc(e,Ka,Ja,Qa,Zo)||(e=[1,0,0,0,1,0,0,0,1],!Gc(e,Ka,Ja,Qa,Zo))?!1:(jo.crossVectors($i,Zi),e=[jo.x,jo.y,jo.z],Gc(e,Ka,Ja,Qa,Zo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ci).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ci).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ci),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ci=[new G,new G,new G,new G,new G,new G,new G,new G],ci=new G,$o=new Oa,Ka=new G,Ja=new G,Qa=new G,$i=new G,Zi=new G,xa=new G,Ks=new G,Zo=new G,jo=new G,va=new G;function Gc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){va.fromArray(n,s);const r=a.x*Math.abs(va.x)+a.y*Math.abs(va.y)+a.z*Math.abs(va.z),c=t.dot(va),l=e.dot(va),d=i.dot(va);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>r)return!1}return!0}const yb=new Oa,Js=new G,Xc=new G;class zs{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):yb.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);const e=Js.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Js,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Xc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(Xc)),this.expandByPoint(Js.copy(t.center).sub(Xc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Li=new G,Vc=new G,qo=new G,ji=new G,Wc=new G,Ko=new G,Yc=new G;class Jh{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Li.copy(this.origin).addScaledVector(this.direction,e),Li.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Vc.copy(t).add(e).multiplyScalar(.5),qo.copy(e).sub(t).normalize(),ji.copy(this.origin).sub(Vc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(qo),r=ji.dot(this.direction),c=-ji.dot(qo),l=ji.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*c-r,h=o*r-c,m=s*d,u>=0)if(h>=-m)if(h<=m){const _=1/d;u*=_,h*=_,f=u*(u+o*h+2*r)+h*(o*u+h+2*c)+l}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l):h<=m?(u=0,h=Math.min(Math.max(-s,-c),s),f=h*(h+2*c)+l):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-c),s),f=-u*u+h*(h+2*c)+l);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(Vc).addScaledVector(qo,h),f}intersectSphere(t,e){Li.subVectors(t.center,this.origin);const i=Li.dot(this.direction),a=Li.dot(Li)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,c=i+o;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return l>=0?(i=(t.min.x-h.x)*l,a=(t.max.x-h.x)*l):(i=(t.max.x-h.x)*l,a=(t.min.x-h.x)*l),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,c=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,c=(t.min.z-h.z)*u),i>c||r>a)||((r>i||i!==i)&&(i=r),(c<a||a!==a)&&(a=c),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Li)!==null}intersectTriangle(t,e,i,a,s){Wc.subVectors(e,t),Ko.subVectors(i,t),Yc.crossVectors(Wc,Ko);let o=this.direction.dot(Yc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;ji.subVectors(this.origin,t);const c=r*this.direction.dot(Ko.crossVectors(ji,Ko));if(c<0)return null;const l=r*this.direction.dot(Wc.cross(ji));if(l<0||c+l>o)return null;const d=-r*ji.dot(Yc);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class De{constructor(t,e,i,a,s,o,r,c,l,d,u,h,f,m,_,g){De.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,_,g)}set(t,e,i,a,s,o,r,c,l,d,u,h,f,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=c,p[2]=l,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new De().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/ts.setFromMatrixColumn(t,0).length(),s=1/ts.setFromMatrixColumn(t,1).length(),o=1/ts.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),c=Math.cos(a),l=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,_=r*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=f+m*l,e[5]=h-_*l,e[9]=-r*c,e[2]=_-h*l,e[6]=m+f*l,e[10]=o*c}else if(t.order==="YXZ"){const h=c*d,f=c*u,m=l*d,_=l*u;e[0]=h+_*r,e[4]=m*r-f,e[8]=o*l,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=_+h*r,e[10]=o*c}else if(t.order==="ZXY"){const h=c*d,f=c*u,m=l*d,_=l*u;e[0]=h-_*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=_-h*r,e[2]=-o*l,e[6]=r,e[10]=o*c}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,_=r*u;e[0]=c*d,e[4]=m*l-f,e[8]=h*l+_,e[1]=c*u,e[5]=_*l+h,e[9]=f*l-m,e[2]=-l,e[6]=r*c,e[10]=o*c}else if(t.order==="YZX"){const h=o*c,f=o*l,m=r*c,_=r*l;e[0]=c*d,e[4]=_-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-l*d,e[6]=f*u+m,e[10]=h-_*u}else if(t.order==="XZY"){const h=o*c,f=o*l,m=r*c,_=r*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=h*u+_,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=_*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(_b,t,Mb)}lookAt(t,e,i){const a=this.elements;return Wn.subVectors(t,e),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),qi.crossVectors(i,Wn),qi.lengthSq()===0&&(Math.abs(i.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),qi.crossVectors(i,Wn)),qi.normalize(),Jo.crossVectors(Wn,qi),a[0]=qi.x,a[4]=Jo.x,a[8]=Wn.x,a[1]=qi.y,a[5]=Jo.y,a[9]=Wn.y,a[2]=qi.z,a[6]=Jo.z,a[10]=Wn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],c=i[8],l=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],v=i[3],x=i[7],y=i[11],w=i[15],S=a[0],E=a[4],A=a[8],b=a[12],M=a[1],R=a[5],k=a[9],L=a[13],D=a[2],C=a[6],I=a[10],O=a[14],B=a[3],V=a[7],et=a[11],ut=a[15];return s[0]=o*S+r*M+c*D+l*B,s[4]=o*E+r*R+c*C+l*V,s[8]=o*A+r*k+c*I+l*et,s[12]=o*b+r*L+c*O+l*ut,s[1]=d*S+u*M+h*D+f*B,s[5]=d*E+u*R+h*C+f*V,s[9]=d*A+u*k+h*I+f*et,s[13]=d*b+u*L+h*O+f*ut,s[2]=m*S+_*M+g*D+p*B,s[6]=m*E+_*R+g*C+p*V,s[10]=m*A+_*k+g*I+p*et,s[14]=m*b+_*L+g*O+p*ut,s[3]=v*S+x*M+y*D+w*B,s[7]=v*E+x*R+y*C+w*V,s[11]=v*A+x*k+y*I+w*et,s[15]=v*b+x*L+y*O+w*ut,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],c=t[9],l=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*c*u-a*l*u-s*r*h+i*l*h+a*r*f-i*c*f)+_*(+e*c*f-e*l*h+s*o*h-a*o*f+a*l*d-s*c*d)+g*(+e*l*u-e*r*f-s*o*u+i*o*f+s*r*d-i*l*d)+p*(-a*r*d-e*c*u+e*r*h+a*o*u-i*o*h+i*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],c=t[6],l=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],v=u*g*l-_*h*l+_*c*f-r*g*f-u*c*p+r*h*p,x=m*h*l-d*g*l-m*c*f+o*g*f+d*c*p-o*h*p,y=d*_*l-m*u*l+m*r*f-o*_*f-d*r*p+o*u*p,w=m*u*c-d*_*c-m*r*h+o*_*h+d*r*g-o*u*g,S=e*v+i*x+a*y+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=v*E,t[1]=(_*h*s-u*g*s-_*a*f+i*g*f+u*a*p-i*h*p)*E,t[2]=(r*g*s-_*c*s+_*a*l-i*g*l-r*a*p+i*c*p)*E,t[3]=(u*c*s-r*h*s-u*a*l+i*h*l+r*a*f-i*c*f)*E,t[4]=x*E,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*E,t[6]=(m*c*s-o*g*s-m*a*l+e*g*l+o*a*p-e*c*p)*E,t[7]=(o*h*s-d*c*s+d*a*l-e*h*l-o*a*f+e*c*f)*E,t[8]=y*E,t[9]=(m*u*s-d*_*s-m*i*f+e*_*f+d*i*p-e*u*p)*E,t[10]=(o*_*s-m*r*s+m*i*l-e*_*l-o*i*p+e*r*p)*E,t[11]=(d*r*s-o*u*s-d*i*l+e*u*l+o*i*f-e*r*f)*E,t[12]=w*E,t[13]=(d*_*a-m*u*a+m*i*h-e*_*h-d*i*g+e*u*g)*E,t[14]=(m*r*a-o*_*a-m*i*c+e*_*c+o*i*g-e*r*g)*E,t[15]=(o*u*a-d*r*a+d*i*c-e*u*c-o*i*h+e*r*h)*E,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,c=t.z,l=s*o,d=s*r;return this.set(l*o+i,l*r-a*c,l*c+a*r,0,l*r+a*c,d*r+i,d*c-a*o,0,l*c-a*r,d*c+a*o,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,c=e._w,l=s+s,d=o+o,u=r+r,h=s*l,f=s*d,m=s*u,_=o*d,g=o*u,p=r*u,v=c*l,x=c*d,y=c*u,w=i.x,S=i.y,E=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+y)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(f-y)*S,a[5]=(1-(h+p))*S,a[6]=(g+v)*S,a[7]=0,a[8]=(m+x)*E,a[9]=(g-v)*E,a[10]=(1-(h+_))*E,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=ts.set(a[0],a[1],a[2]).length();const o=ts.set(a[4],a[5],a[6]).length(),r=ts.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],li.copy(this);const l=1/s,d=1/o,u=1/r;return li.elements[0]*=l,li.elements[1]*=l,li.elements[2]*=l,li.elements[4]*=d,li.elements[5]*=d,li.elements[6]*=d,li.elements[8]*=u,li.elements[9]*=u,li.elements[10]*=u,e.setFromRotationMatrix(li),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=Oi){const c=this.elements,l=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===Oi)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===Yr)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=Oi){const c=this.elements,l=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*l,f=(i+a)*d;let m,_;if(r===Oi)m=(o+s)*u,_=-2*u;else if(r===Yr)m=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ts=new G,li=new De,_b=new G(0,0,0),Mb=new G(1,1,1),qi=new G,Jo=new G,Wn=new G,Gu=new De,Xu=new ra;class Ti{constructor(t=0,e=0,i=0,a=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],c=a[1],l=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(Sn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Sn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Sn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Sn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Sn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-Sn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Gu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Gu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xu.setFromEuler(this),this.setFromQuaternion(Xu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class Qh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let bb=0;const Vu=new G,es=new ra,Di=new De,Qo=new G,Qs=new G,Sb=new G,wb=new ra,Wu=new G(1,0,0),Yu=new G(0,1,0),$u=new G(0,0,1),Zu={type:"added"},Eb={type:"removed"},ns={type:"childadded",child:null},$c={type:"childremoved",child:null};class Je extends Is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bb++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Je.DEFAULT_UP.clone();const t=new G,e=new Ti,i=new ra,a=new G(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new De},normalMatrix:{value:new _e}}),this.matrix=new De,this.matrixWorld=new De,this.matrixAutoUpdate=Je.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.multiply(es),this}rotateOnWorldAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.premultiply(es),this}rotateX(t){return this.rotateOnAxis(Wu,t)}rotateY(t){return this.rotateOnAxis(Yu,t)}rotateZ(t){return this.rotateOnAxis($u,t)}translateOnAxis(t,e){return Vu.copy(t).applyQuaternion(this.quaternion),this.position.add(Vu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wu,t)}translateY(t){return this.translateOnAxis(Yu,t)}translateZ(t){return this.translateOnAxis($u,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Qo.copy(t):Qo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(Qs,Qo,this.up):Di.lookAt(Qo,Qs,this.up),this.quaternion.setFromRotationMatrix(Di),a&&(Di.extractRotation(a.matrixWorld),es.setFromRotationMatrix(Di),this.quaternion.premultiply(es.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Zu),ns.child=t,this.dispatchEvent(ns),ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Eb),$c.child=t,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Di.multiply(t.parent.matrixWorld)),t.applyMatrix4(Di),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Zu),ns.child=t,this.dispatchEvent(ns),ns.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,Sb),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,wb,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];a.animations.push(s(t.animations,c))}}if(e){const r=o(t.geometries),c=o(t.materials),l=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const c=[];for(const l in r){const d=r[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}Je.DEFAULT_UP=new G(0,1,0);Je.DEFAULT_MATRIX_AUTO_UPDATE=!0;Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hi=new G,ki=new G,Zc=new G,Ii=new G,is=new G,as=new G,ju=new G,jc=new G,qc=new G,Kc=new G,Jc=new nn,Qc=new nn,tl=new nn;class Zn{constructor(t=new G,e=new G,i=new G){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),hi.subVectors(t,e),a.cross(hi);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){hi.subVectors(a,e),ki.subVectors(i,e),Zc.subVectors(t,e);const o=hi.dot(hi),r=hi.dot(ki),c=hi.dot(Zc),l=ki.dot(ki),d=ki.dot(Zc),u=o*l-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(l*c-r*d)*h,m=(o*d-r*c)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(t,e,i,a,s,o,r,c){return this.getBarycoord(t,e,i,a,Ii)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ii.x),c.addScaledVector(o,Ii.y),c.addScaledVector(r,Ii.z),c)}static getInterpolatedAttribute(t,e,i,a,s,o){return Jc.setScalar(0),Qc.setScalar(0),tl.setScalar(0),Jc.fromBufferAttribute(t,e),Qc.fromBufferAttribute(t,i),tl.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Jc,s.x),o.addScaledVector(Qc,s.y),o.addScaledVector(tl,s.z),o}static isFrontFacing(t,e,i,a){return hi.subVectors(i,e),ki.subVectors(t,e),hi.cross(ki).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hi.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),hi.cross(ki).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Zn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Zn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Zn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Zn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Zn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;is.subVectors(a,i),as.subVectors(s,i),jc.subVectors(t,i);const c=is.dot(jc),l=as.dot(jc);if(c<=0&&l<=0)return e.copy(i);qc.subVectors(t,a);const d=is.dot(qc),u=as.dot(qc);if(d>=0&&u<=d)return e.copy(a);const h=c*u-d*l;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),e.copy(i).addScaledVector(is,o);Kc.subVectors(t,s);const f=is.dot(Kc),m=as.dot(Kc);if(m>=0&&f<=m)return e.copy(s);const _=f*l-c*m;if(_<=0&&l>=0&&m<=0)return r=l/(l-m),e.copy(i).addScaledVector(as,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return ju.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(ju,r);const p=1/(g+_+h);return o=_*p,r=h*p,e.copy(i).addScaledVector(is,o).addScaledVector(as,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const om={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},tr={h:0,s:0,l:0};function el(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ee{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ce.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Ce.workingColorSpace){return this.r=t,this.g=e,this.b=i,Ce.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Ce.workingColorSpace){if(t=Kh(t,1),e=Sn(e,0,1),i=Sn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=el(o,s,t+1/3),this.g=el(o,s,t),this.b=el(o,s,t-1/3)}return Ce.toWorkingColorSpace(this,a),this}setStyle(t,e=Fn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fn){const i=om[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bi(t.r),this.g=Bi(t.g),this.b=Bi(t.b),this}copyLinearToSRGB(t){return this.r=bs(t.r),this.g=bs(t.g),this.b=bs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fn){return Ce.fromWorkingColorSpace(An.copy(this),t),Math.round(Sn(An.r*255,0,255))*65536+Math.round(Sn(An.g*255,0,255))*256+Math.round(Sn(An.b*255,0,255))}getHexString(t=Fn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ce.workingColorSpace){Ce.fromWorkingColorSpace(An.copy(this),e);const i=An.r,a=An.g,s=An.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let c,l;const d=(r+o)/2;if(r===o)c=0,l=0;else{const u=o-r;switch(l=d<=.5?u/(o+r):u/(2-o-r),o){case i:c=(a-s)/u+(a<s?6:0);break;case a:c=(s-i)/u+2;break;case s:c=(i-a)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=Ce.workingColorSpace){return Ce.fromWorkingColorSpace(An.copy(this),e),t.r=An.r,t.g=An.g,t.b=An.b,t}getStyle(t=Fn){Ce.fromWorkingColorSpace(An.copy(this),t);const e=An.r,i=An.g,a=An.b;return t!==Fn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Ki),this.setHSL(Ki.h+t,Ki.s+e,Ki.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ki),t.getHSL(tr);const i=po(Ki.h,tr.h,e),a=po(Ki.s,tr.s,e),s=po(Ki.l,tr.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const An=new ee;ee.NAMES=om;let Tb=0;class Ba extends Is{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Tb++}),this.uuid=Ei(),this.name="",this.blending=ys,this.side=la,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ol,this.blendDst=Bl,this.blendEquation=Pa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ja,this.stencilZFail=ja,this.stencilZPass=ja,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(i.blending=this.blending),this.side!==la&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ol&&(i.blendSrc=this.blendSrc),this.blendDst!==Bl&&(i.blendDst=this.blendDst),this.blendEquation!==Pa&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==As&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ja&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ja&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ja&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const c=s[r];delete c.metadata,o.push(c)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class _n extends Ba{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Xh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const cn=new G,er=new Xt;class Mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=wh,this.updateRanges=[],this.gpuType=Si,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)er.fromBufferAttribute(this,e),er.applyMatrix3(t),this.setXY(e,er.x,er.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix3(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyMatrix4(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.applyNormalMatrix(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)cn.fromBufferAttribute(this,e),cn.transformDirection(t),this.setXYZ(e,cn.x,cn.y,cn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=di(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=di(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=di(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=di(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=di(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wh&&(t.usage=this.usage),t}}class rm extends Mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class cm extends Mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Ie extends Mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Ab=0;const ti=new De,nl=new Je,ss=new G,Yn=new Oa,to=new Oa,yn=new G;class hn extends Is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ab++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(im(t)?cm:rm)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new _e().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ti.makeRotationFromQuaternion(t),this.applyMatrix4(ti),this}rotateX(t){return ti.makeRotationX(t),this.applyMatrix4(ti),this}rotateY(t){return ti.makeRotationY(t),this.applyMatrix4(ti),this}rotateZ(t){return ti.makeRotationZ(t),this.applyMatrix4(ti),this}translate(t,e,i){return ti.makeTranslation(t,e,i),this.applyMatrix4(ti),this}scale(t,e,i){return ti.makeScale(t,e,i),this.applyMatrix4(ti),this}lookAt(t){return nl.lookAt(t),nl.updateMatrix(),this.applyMatrix4(nl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ss).negate(),this.translate(ss.x,ss.y,ss.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ie(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Oa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Yn.setFromBufferAttribute(s),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){const i=this.boundingSphere.center;if(Yn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];to.setFromBufferAttribute(r),this.morphTargetsRelative?(yn.addVectors(Yn.min,to.min),Yn.expandByPoint(yn),yn.addVectors(Yn.max,to.max),Yn.expandByPoint(yn)):(Yn.expandByPoint(to.min),Yn.expandByPoint(to.max))}Yn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)yn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(yn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,d=r.count;l<d;l++)yn.fromBufferAttribute(r,l),c&&(ss.fromBufferAttribute(t,l),yn.add(ss)),a=Math.max(a,i.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],c=[];for(let A=0;A<i.count;A++)r[A]=new G,c[A]=new G;const l=new G,d=new G,u=new G,h=new Xt,f=new Xt,m=new Xt,_=new G,g=new G;function p(A,b,M){l.fromBufferAttribute(i,A),d.fromBufferAttribute(i,b),u.fromBufferAttribute(i,M),h.fromBufferAttribute(s,A),f.fromBufferAttribute(s,b),m.fromBufferAttribute(s,M),d.sub(l),u.sub(l),f.sub(h),m.sub(h);const R=1/(f.x*m.y-m.x*f.y);isFinite(R)&&(_.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(R),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(R),r[A].add(_),r[b].add(_),r[M].add(_),c[A].add(g),c[b].add(g),c[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let A=0,b=v.length;A<b;++A){const M=v[A],R=M.start,k=M.count;for(let L=R,D=R+k;L<D;L+=3)p(t.getX(L+0),t.getX(L+1),t.getX(L+2))}const x=new G,y=new G,w=new G,S=new G;function E(A){w.fromBufferAttribute(a,A),S.copy(w);const b=r[A];x.copy(b),x.sub(w.multiplyScalar(w.dot(b))).normalize(),y.crossVectors(S,b);const R=y.dot(c[A])<0?-1:1;o.setXYZW(A,x.x,x.y,x.z,R)}for(let A=0,b=v.length;A<b;++A){const M=v[A],R=M.start,k=M.count;for(let L=R,D=R+k;L<D;L+=3)E(t.getX(L+0)),E(t.getX(L+1)),E(t.getX(L+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new G,s=new G,o=new G,r=new G,c=new G,l=new G,d=new G,u=new G;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),_=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),r.add(d),c.add(d),l.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(g,l.x,l.y,l.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)yn.fromBufferAttribute(t,e),yn.normalize(),t.setXYZ(e,yn.x,yn.y,yn.z)}toNonIndexed(){function t(r,c){const l=r.array,d=r.itemSize,u=r.normalized,h=new l.constructor(c.length*d);let f=0,m=0;for(let _=0,g=c.length;_<g;_++){r.isInterleavedBufferAttribute?f=c[_]*r.data.stride+r.offset:f=c[_]*d;for(let p=0;p<d;p++)h[m++]=l[f++]}return new Mn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new hn,i=this.index.array,a=this.attributes;for(const r in a){const c=a[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let d=0,u=l.length;d<u;d++){const h=l[d],f=t(h,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,c=o.length;r<c;r++){const l=o[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const a={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,h=l.length;u<h;u++){const f=l[u];d.push(f.toJSON(t.data))}d.length>0&&(a[c]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const l in a){const d=a[l];this.setAttribute(l,d.clone(e))}const s=t.morphAttributes;for(const l in s){const d=[],u=s[l];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,d=o.length;l<d;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qu=new De,ya=new Jh,nr=new zs,Ku=new G,ir=new G,ar=new G,sr=new G,il=new G,or=new G,Ju=new G,rr=new G;class be extends Je{constructor(t=new hn,e=new _n){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){or.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const d=r[c],u=s[c];d!==0&&(il.fromBufferAttribute(u,t),o?or.addScaledVector(il,d):or.addScaledVector(il.sub(e),d))}e.add(or)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),nr.copy(i.boundingSphere),nr.applyMatrix4(s),ya.copy(t.ray).recast(t.near),!(nr.containsPoint(ya.origin)===!1&&(ya.intersectSphere(nr,Ku)===null||ya.origin.distanceToSquared(Ku)>(t.far-t.near)**2))&&(qu.copy(s).invert(),ya.copy(t.ray).applyMatrix4(qu),!(i.boundingBox!==null&&ya.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ya)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=h.length;m<_;m++){const g=h[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,w=x;y<w;y+=3){const S=r.getX(y),E=r.getX(y+1),A=r.getX(y+2);a=cr(this,p,t,i,l,d,u,S,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const v=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=cr(this,o,t,i,l,d,u,v,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,_=h.length;m<_;m++){const g=h[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),x=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,w=x;y<w;y+=3){const S=y,E=y+1,A=y+2;a=cr(this,p,t,i,l,d,u,S,E,A),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const v=g,x=g+1,y=g+2;a=cr(this,o,t,i,l,d,u,v,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function Rb(n,t,e,i,a,s,o,r){let c;if(t.side===Bn?c=i.intersectTriangle(o,s,a,!0,r):c=i.intersectTriangle(a,s,o,t.side===la,r),c===null)return null;rr.copy(r),rr.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(rr);return l<e.near||l>e.far?null:{distance:l,point:rr.clone(),object:n}}function cr(n,t,e,i,a,s,o,r,c,l){n.getVertexPosition(r,ir),n.getVertexPosition(c,ar),n.getVertexPosition(l,sr);const d=Rb(n,t,e,i,ir,ar,sr,Ju);if(d){const u=new G;Zn.getBarycoord(Ju,ir,ar,sr,u),a&&(d.uv=Zn.getInterpolatedAttribute(a,r,c,l,u,new Xt)),s&&(d.uv1=Zn.getInterpolatedAttribute(s,r,c,l,u,new Xt)),o&&(d.normal=Zn.getInterpolatedAttribute(o,r,c,l,u,new G),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:c,c:l,normal:new G,materialIndex:0};Zn.getNormal(ir,ar,sr,h.normal),d.face=h,d.barycoord=u}return d}class qn extends hn{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(c),this.setAttribute("position",new Ie(l,3)),this.setAttribute("normal",new Ie(d,3)),this.setAttribute("uv",new Ie(u,2));function m(_,g,p,v,x,y,w,S,E,A,b){const M=y/E,R=w/A,k=y/2,L=w/2,D=S/2,C=E+1,I=A+1;let O=0,B=0;const V=new G;for(let et=0;et<I;et++){const ut=et*R-L;for(let mt=0;mt<C;mt++){const kt=mt*M-k;V[_]=kt*v,V[g]=ut*x,V[p]=D,l.push(V.x,V.y,V.z),V[_]=0,V[g]=0,V[p]=S>0?1:-1,d.push(V.x,V.y,V.z),u.push(mt/E),u.push(1-et/A),O+=1}}for(let et=0;et<A;et++)for(let ut=0;ut<E;ut++){const mt=h+ut+C*et,kt=h+ut+C*(et+1),Z=h+(ut+1)+C*(et+1),nt=h+(ut+1)+C*et;c.push(mt,kt,nt),c.push(kt,Z,nt),B+=6}r.addGroup(f,B,b),f+=B,h+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ds(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function zn(n){const t={};for(let e=0;e<n.length;e++){const i=Ds(n[e]);for(const a in i)t[a]=i[a]}return t}function Pb(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function lm(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ce.workingColorSpace}const Cb={clone:Ds,merge:zn};var Lb=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Db=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ha extends Ba{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Lb,this.fragmentShader=Db,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ds(t.uniforms),this.uniformsGroups=Pb(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class hm extends Je{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new De,this.projectionMatrix=new De,this.projectionMatrixInverse=new De,this.coordinateSystem=Oi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ji=new G,Qu=new Xt,tf=new Xt;class ni extends hm{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ao*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z),Ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ji.x,Ji.y).multiplyScalar(-t/Ji.z)}getViewSize(t,e){return this.getViewBounds(t,Qu,tf),e.subVectors(tf,Qu)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ms*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*a/c,e-=o.offsetY*i/l,a*=o.width/c,i*=o.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const os=-90,rs=1;class kb extends Je{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new ni(os,rs,t,e);a.layers=this.layers,this.add(a);const s=new ni(os,rs,t,e);s.layers=this.layers,this.add(s);const o=new ni(os,rs,t,e);o.layers=this.layers,this.add(o);const r=new ni(os,rs,t,e);r.layers=this.layers,this.add(r);const c=new ni(os,rs,t,e);c.layers=this.layers,this.add(c);const l=new ni(os,rs,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,c]=e;for(const l of e)this.remove(l);if(t===Oi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Yr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,c,l,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,c),t.setRenderTarget(i,4,a),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class dm extends Pn{constructor(t,e,i,a,s,o,r,c,l,d){t=t!==void 0?t:[],e=e!==void 0?e:Rs,super(t,e,i,a,s,o,r,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ib extends Fa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new dm(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:bi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new qn(5,5,5),s=new ha({name:"CubemapFromEquirect",uniforms:Ds(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bn,blending:sa});s.uniforms.tEquirect.value=e;const o=new be(a,s),r=e.minFilter;return e.minFilter===Da&&(e.minFilter=bi),new kb(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const al=new G,zb=new G,Fb=new _e;class Ta{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=al.subVectors(i,e).cross(zb.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(al),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Fb.getNormalMatrix(t),a=this.coplanarPoint(al).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _a=new zs,lr=new G;class td{constructor(t=new Ta,e=new Ta,i=new Ta,a=new Ta,s=new Ta,o=new Ta){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Oi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],c=a[3],l=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],_=a[10],g=a[11],p=a[12],v=a[13],x=a[14],y=a[15];if(i[0].setComponents(c-s,h-l,g-f,y-p).normalize(),i[1].setComponents(c+s,h+l,g+f,y+p).normalize(),i[2].setComponents(c+o,h+d,g+m,y+v).normalize(),i[3].setComponents(c-o,h-d,g-m,y-v).normalize(),i[4].setComponents(c-r,h-u,g-_,y-x).normalize(),e===Oi)i[5].setComponents(c+r,h+u,g+_,y+x).normalize();else if(e===Yr)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_a.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),_a.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_a)}intersectsSprite(t){return _a.center.set(0,0,0),_a.radius=.7071067811865476,_a.applyMatrix4(t.matrixWorld),this.intersectsSphere(_a)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(lr.x=a.normal.x>0?t.max.x:t.min.x,lr.y=a.normal.y>0?t.max.y:t.min.y,lr.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function um(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Ub(n){const t=new WeakMap;function e(r,c){const l=r.array,d=r.usage,u=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,d),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const d=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++h,u[h]=_)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const _=u[f];n.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function o(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:a,remove:s,update:o}}class ei extends hn{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),c=Math.floor(a),l=r+1,d=c+1,u=t/r,h=e/c,f=[],m=[],_=[],g=[];for(let p=0;p<d;p++){const v=p*h-o;for(let x=0;x<l;x++){const y=x*u-s;m.push(y,-v,0),_.push(0,0,1),g.push(x/r),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<r;v++){const x=v+l*p,y=v+l*(p+1),w=v+1+l*(p+1),S=v+1+l*p;f.push(x,y,S),f.push(y,w,S)}this.setIndex(f),this.setAttribute("position",new Ie(m,3)),this.setAttribute("normal",new Ie(_,3)),this.setAttribute("uv",new Ie(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ei(t.width,t.height,t.widthSegments,t.heightSegments)}}var Nb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ob=`#ifdef USE_ALPHAHASH
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
#endif`,Bb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hb=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gb=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Xb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Vb=`#ifdef USE_AOMAP
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
#endif`,Wb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yb=`#ifdef USE_BATCHING
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
#endif`,$b=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jb=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,qb=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Kb=`#ifdef USE_IRIDESCENCE
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
#endif`,Jb=`#ifdef USE_BUMPMAP
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
#endif`,Qb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,t1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,e1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,n1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,i1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,a1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,s1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,o1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,r1=`#define PI 3.141592653589793
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
} // validated`,c1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,l1=`vec3 transformedNormal = objectNormal;
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
#endif`,h1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,d1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,u1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,f1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,p1="gl_FragColor = linearToOutputTexel( gl_FragColor );",m1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,g1=`#ifdef USE_ENVMAP
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
#endif`,x1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,v1=`#ifdef USE_ENVMAP
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
#endif`,y1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_1=`#ifdef USE_ENVMAP
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
#endif`,M1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,b1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,S1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,w1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,E1=`#ifdef USE_GRADIENTMAP
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
}`,T1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,A1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,R1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,P1=`uniform bool receiveShadow;
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
#endif`,C1=`#ifdef USE_ENVMAP
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
#endif`,L1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,D1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,k1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,I1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,z1=`PhysicalMaterial material;
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
#endif`,F1=`struct PhysicalMaterial {
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
}`,U1=`
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
#endif`,N1=`#if defined( RE_IndirectDiffuse )
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
#endif`,O1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,B1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,H1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,G1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,X1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,V1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,W1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$1=`#if defined( USE_POINTS_UV )
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
#endif`,Z1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,j1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,q1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,K1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,J1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Q1=`#ifdef USE_MORPHTARGETS
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
#endif`,tS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,nS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,iS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,oS=`#ifdef USE_NORMALMAP
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
#endif`,rS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,hS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,fS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,gS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_S=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,MS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,bS=`float getShadowMask() {
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
}`,SS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wS=`#ifdef USE_SKINNING
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
#endif`,ES=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,TS=`#ifdef USE_SKINNING
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
#endif`,AS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,RS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,PS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,CS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,LS=`#ifdef USE_TRANSMISSION
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
#endif`,DS=`#ifdef USE_TRANSMISSION
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
#endif`,kS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,IS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,FS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const US=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,NS=`uniform sampler2D t2D;
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
}`,OS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,BS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,HS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,GS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,XS=`#include <common>
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
}`,VS=`#if DEPTH_PACKING == 3200
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
}`,WS=`#define DISTANCE
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
}`,YS=`#define DISTANCE
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
}`,$S=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ZS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jS=`uniform float scale;
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
}`,qS=`uniform vec3 diffuse;
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
}`,KS=`#include <common>
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
}`,JS=`uniform vec3 diffuse;
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
}`,QS=`#define LAMBERT
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
}`,tw=`#define LAMBERT
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
}`,ew=`#define MATCAP
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
}`,nw=`#define MATCAP
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
}`,iw=`#define NORMAL
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
}`,aw=`#define NORMAL
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
}`,sw=`#define PHONG
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
}`,ow=`#define PHONG
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
}`,rw=`#define STANDARD
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
}`,cw=`#define STANDARD
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
}`,lw=`#define TOON
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
}`,hw=`#define TOON
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
}`,dw=`uniform float size;
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
}`,uw=`uniform vec3 diffuse;
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
}`,fw=`#include <common>
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
}`,pw=`uniform vec3 color;
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
}`,mw=`uniform float rotation;
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
}`,gw=`uniform vec3 diffuse;
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
}`,Me={alphahash_fragment:Nb,alphahash_pars_fragment:Ob,alphamap_fragment:Bb,alphamap_pars_fragment:Hb,alphatest_fragment:Gb,alphatest_pars_fragment:Xb,aomap_fragment:Vb,aomap_pars_fragment:Wb,batching_pars_vertex:Yb,batching_vertex:$b,begin_vertex:Zb,beginnormal_vertex:jb,bsdfs:qb,iridescence_fragment:Kb,bumpmap_pars_fragment:Jb,clipping_planes_fragment:Qb,clipping_planes_pars_fragment:t1,clipping_planes_pars_vertex:e1,clipping_planes_vertex:n1,color_fragment:i1,color_pars_fragment:a1,color_pars_vertex:s1,color_vertex:o1,common:r1,cube_uv_reflection_fragment:c1,defaultnormal_vertex:l1,displacementmap_pars_vertex:h1,displacementmap_vertex:d1,emissivemap_fragment:u1,emissivemap_pars_fragment:f1,colorspace_fragment:p1,colorspace_pars_fragment:m1,envmap_fragment:g1,envmap_common_pars_fragment:x1,envmap_pars_fragment:v1,envmap_pars_vertex:y1,envmap_physical_pars_fragment:C1,envmap_vertex:_1,fog_vertex:M1,fog_pars_vertex:b1,fog_fragment:S1,fog_pars_fragment:w1,gradientmap_pars_fragment:E1,lightmap_pars_fragment:T1,lights_lambert_fragment:A1,lights_lambert_pars_fragment:R1,lights_pars_begin:P1,lights_toon_fragment:L1,lights_toon_pars_fragment:D1,lights_phong_fragment:k1,lights_phong_pars_fragment:I1,lights_physical_fragment:z1,lights_physical_pars_fragment:F1,lights_fragment_begin:U1,lights_fragment_maps:N1,lights_fragment_end:O1,logdepthbuf_fragment:B1,logdepthbuf_pars_fragment:H1,logdepthbuf_pars_vertex:G1,logdepthbuf_vertex:X1,map_fragment:V1,map_pars_fragment:W1,map_particle_fragment:Y1,map_particle_pars_fragment:$1,metalnessmap_fragment:Z1,metalnessmap_pars_fragment:j1,morphinstance_vertex:q1,morphcolor_vertex:K1,morphnormal_vertex:J1,morphtarget_pars_vertex:Q1,morphtarget_vertex:tS,normal_fragment_begin:eS,normal_fragment_maps:nS,normal_pars_fragment:iS,normal_pars_vertex:aS,normal_vertex:sS,normalmap_pars_fragment:oS,clearcoat_normal_fragment_begin:rS,clearcoat_normal_fragment_maps:cS,clearcoat_pars_fragment:lS,iridescence_pars_fragment:hS,opaque_fragment:dS,packing:uS,premultiplied_alpha_fragment:fS,project_vertex:pS,dithering_fragment:mS,dithering_pars_fragment:gS,roughnessmap_fragment:xS,roughnessmap_pars_fragment:vS,shadowmap_pars_fragment:yS,shadowmap_pars_vertex:_S,shadowmap_vertex:MS,shadowmask_pars_fragment:bS,skinbase_vertex:SS,skinning_pars_vertex:wS,skinning_vertex:ES,skinnormal_vertex:TS,specularmap_fragment:AS,specularmap_pars_fragment:RS,tonemapping_fragment:PS,tonemapping_pars_fragment:CS,transmission_fragment:LS,transmission_pars_fragment:DS,uv_pars_fragment:kS,uv_pars_vertex:IS,uv_vertex:zS,worldpos_vertex:FS,background_vert:US,background_frag:NS,backgroundCube_vert:OS,backgroundCube_frag:BS,cube_vert:HS,cube_frag:GS,depth_vert:XS,depth_frag:VS,distanceRGBA_vert:WS,distanceRGBA_frag:YS,equirect_vert:$S,equirect_frag:ZS,linedashed_vert:jS,linedashed_frag:qS,meshbasic_vert:KS,meshbasic_frag:JS,meshlambert_vert:QS,meshlambert_frag:tw,meshmatcap_vert:ew,meshmatcap_frag:nw,meshnormal_vert:iw,meshnormal_frag:aw,meshphong_vert:sw,meshphong_frag:ow,meshphysical_vert:rw,meshphysical_frag:cw,meshtoon_vert:lw,meshtoon_frag:hw,points_vert:dw,points_frag:uw,shadow_vert:fw,shadow_frag:pw,sprite_vert:mw,sprite_frag:gw},Gt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new _e},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new _e}},envmap:{envMap:{value:null},envMapRotation:{value:new _e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new _e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new _e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new _e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new _e},normalScale:{value:new Xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new _e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new _e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new _e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new _e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0},uvTransform:{value:new _e}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new Xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new _e},alphaMap:{value:null},alphaMapTransform:{value:new _e},alphaTest:{value:0}}},Mi={basic:{uniforms:zn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.fog]),vertexShader:Me.meshbasic_vert,fragmentShader:Me.meshbasic_frag},lambert:{uniforms:zn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new ee(0)}}]),vertexShader:Me.meshlambert_vert,fragmentShader:Me.meshlambert_frag},phong:{uniforms:zn([Gt.common,Gt.specularmap,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,Gt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30}}]),vertexShader:Me.meshphong_vert,fragmentShader:Me.meshphong_frag},standard:{uniforms:zn([Gt.common,Gt.envmap,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.roughnessmap,Gt.metalnessmap,Gt.fog,Gt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag},toon:{uniforms:zn([Gt.common,Gt.aomap,Gt.lightmap,Gt.emissivemap,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.gradientmap,Gt.fog,Gt.lights,{emissive:{value:new ee(0)}}]),vertexShader:Me.meshtoon_vert,fragmentShader:Me.meshtoon_frag},matcap:{uniforms:zn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,Gt.fog,{matcap:{value:null}}]),vertexShader:Me.meshmatcap_vert,fragmentShader:Me.meshmatcap_frag},points:{uniforms:zn([Gt.points,Gt.fog]),vertexShader:Me.points_vert,fragmentShader:Me.points_frag},dashed:{uniforms:zn([Gt.common,Gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Me.linedashed_vert,fragmentShader:Me.linedashed_frag},depth:{uniforms:zn([Gt.common,Gt.displacementmap]),vertexShader:Me.depth_vert,fragmentShader:Me.depth_frag},normal:{uniforms:zn([Gt.common,Gt.bumpmap,Gt.normalmap,Gt.displacementmap,{opacity:{value:1}}]),vertexShader:Me.meshnormal_vert,fragmentShader:Me.meshnormal_frag},sprite:{uniforms:zn([Gt.sprite,Gt.fog]),vertexShader:Me.sprite_vert,fragmentShader:Me.sprite_frag},background:{uniforms:{uvTransform:{value:new _e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Me.background_vert,fragmentShader:Me.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new _e}},vertexShader:Me.backgroundCube_vert,fragmentShader:Me.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Me.cube_vert,fragmentShader:Me.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Me.equirect_vert,fragmentShader:Me.equirect_frag},distanceRGBA:{uniforms:zn([Gt.common,Gt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Me.distanceRGBA_vert,fragmentShader:Me.distanceRGBA_frag},shadow:{uniforms:zn([Gt.lights,Gt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:Me.shadow_vert,fragmentShader:Me.shadow_frag}};Mi.physical={uniforms:zn([Mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new _e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new _e},clearcoatNormalScale:{value:new Xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new _e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new _e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new _e},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new _e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new _e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new _e},transmissionSamplerSize:{value:new Xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new _e},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new _e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new _e},anisotropyVector:{value:new Xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new _e}}]),vertexShader:Me.meshphysical_vert,fragmentShader:Me.meshphysical_frag};const hr={r:0,b:0,g:0},Ma=new Ti,xw=new De;function vw(n,t,e,i,a,s,o){const r=new ee(0);let c=s===!0?0:1,l,d,u=null,h=0,f=null;function m(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?e:t).get(x)),x}function _(v){let x=!1;const y=m(v);y===null?p(r,c):y&&y.isColor&&(p(y,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===sc)?(d===void 0&&(d=new be(new qn(1,1,1),new ha({name:"BackgroundCubeMaterial",uniforms:Ds(Mi.backgroundCube.uniforms),vertexShader:Mi.backgroundCube.vertexShader,fragmentShader:Mi.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),Ma.copy(x.backgroundRotation),Ma.x*=-1,Ma.y*=-1,Ma.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ma.y*=-1,Ma.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(xw.makeRotationFromEuler(Ma)),d.material.toneMapped=Ce.getTransfer(y.colorSpace)!==Oe,(u!==y||h!==y.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new be(new ei(2,2),new ha({name:"BackgroundMaterial",uniforms:Ds(Mi.background.uniforms),vertexShader:Mi.background.vertexShader,fragmentShader:Mi.background.fragmentShader,side:la,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ce.getTransfer(y.colorSpace)!==Oe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,x){v.getRGB(hr,lm(n)),i.buffers.color.setClear(hr.r,hr.g,hr.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(v,x=1){r.set(v),c=x,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(r,c)},render:_,addToRenderList:g}}function yw(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(M,R,k,L,D){let C=!1;const I=u(L,k,R);s!==I&&(s=I,l(s.object)),C=f(M,L,k,D),C&&m(M,L,k,D),D!==null&&t.update(D,n.ELEMENT_ARRAY_BUFFER),(C||o)&&(o=!1,y(M,R,k,L),D!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function c(){return n.createVertexArray()}function l(M){return n.bindVertexArray(M)}function d(M){return n.deleteVertexArray(M)}function u(M,R,k){const L=k.wireframe===!0;let D=i[M.id];D===void 0&&(D={},i[M.id]=D);let C=D[R.id];C===void 0&&(C={},D[R.id]=C);let I=C[L];return I===void 0&&(I=h(c()),C[L]=I),I}function h(M){const R=[],k=[],L=[];for(let D=0;D<e;D++)R[D]=0,k[D]=0,L[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:k,attributeDivisors:L,object:M,attributes:{},index:null}}function f(M,R,k,L){const D=s.attributes,C=R.attributes;let I=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){const et=D[B];let ut=C[B];if(ut===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(ut=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(ut=M.instanceColor)),et===void 0||et.attribute!==ut||ut&&et.data!==ut.data)return!0;I++}return s.attributesNum!==I||s.index!==L}function m(M,R,k,L){const D={},C=R.attributes;let I=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){let et=C[B];et===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(et=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(et=M.instanceColor));const ut={};ut.attribute=et,et&&et.data&&(ut.data=et.data),D[B]=ut,I++}s.attributes=D,s.attributesNum=I,s.index=L}function _(){const M=s.newAttributes;for(let R=0,k=M.length;R<k;R++)M[R]=0}function g(M){p(M,0)}function p(M,R){const k=s.newAttributes,L=s.enabledAttributes,D=s.attributeDivisors;k[M]=1,L[M]===0&&(n.enableVertexAttribArray(M),L[M]=1),D[M]!==R&&(n.vertexAttribDivisor(M,R),D[M]=R)}function v(){const M=s.newAttributes,R=s.enabledAttributes;for(let k=0,L=R.length;k<L;k++)R[k]!==M[k]&&(n.disableVertexAttribArray(k),R[k]=0)}function x(M,R,k,L,D,C,I){I===!0?n.vertexAttribIPointer(M,R,k,D,C):n.vertexAttribPointer(M,R,k,L,D,C)}function y(M,R,k,L){_();const D=L.attributes,C=k.getAttributes(),I=R.defaultAttributeValues;for(const O in C){const B=C[O];if(B.location>=0){let V=D[O];if(V===void 0&&(O==="instanceMatrix"&&M.instanceMatrix&&(V=M.instanceMatrix),O==="instanceColor"&&M.instanceColor&&(V=M.instanceColor)),V!==void 0){const et=V.normalized,ut=V.itemSize,mt=t.get(V);if(mt===void 0)continue;const kt=mt.buffer,Z=mt.type,nt=mt.bytesPerElement,lt=Z===n.INT||Z===n.UNSIGNED_INT||V.gpuType===Vh;if(V.isInterleavedBufferAttribute){const at=V.data,J=at.stride,ht=V.offset;if(at.isInstancedInterleavedBuffer){for(let Ot=0;Ot<B.locationSize;Ot++)p(B.location+Ot,at.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Ot=0;Ot<B.locationSize;Ot++)g(B.location+Ot);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let Ot=0;Ot<B.locationSize;Ot++)x(B.location+Ot,ut/B.locationSize,Z,et,J*nt,(ht+ut/B.locationSize*Ot)*nt,lt)}else{if(V.isInstancedBufferAttribute){for(let at=0;at<B.locationSize;at++)p(B.location+at,V.meshPerAttribute);M.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let at=0;at<B.locationSize;at++)g(B.location+at);n.bindBuffer(n.ARRAY_BUFFER,kt);for(let at=0;at<B.locationSize;at++)x(B.location+at,ut/B.locationSize,Z,et,ut*nt,ut/B.locationSize*at*nt,lt)}}else if(I!==void 0){const et=I[O];if(et!==void 0)switch(et.length){case 2:n.vertexAttrib2fv(B.location,et);break;case 3:n.vertexAttrib3fv(B.location,et);break;case 4:n.vertexAttrib4fv(B.location,et);break;default:n.vertexAttrib1fv(B.location,et)}}}}v()}function w(){A();for(const M in i){const R=i[M];for(const k in R){const L=R[k];for(const D in L)d(L[D].object),delete L[D];delete R[k]}delete i[M]}}function S(M){if(i[M.id]===void 0)return;const R=i[M.id];for(const k in R){const L=R[k];for(const D in L)d(L[D].object),delete L[D];delete R[k]}delete i[M.id]}function E(M){for(const R in i){const k=i[R];if(k[M.id]===void 0)continue;const L=k[M.id];for(const D in L)d(L[D].object),delete L[D];delete k[M.id]}}function A(){b(),o=!0,s!==a&&(s=a,l(s.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:A,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function _w(n,t,e){let i;function a(l){i=l}function s(l,d){n.drawArrays(i,l,d),e.update(d,i,1)}function o(l,d,u){u!==0&&(n.drawArraysInstanced(i,l,d,u),e.update(d,i,u))}function r(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function c(l,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,d,0,h,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_]*h[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function Mw(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(E){return!(E!==ui&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(E){const A=E===ko&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Hi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Si&&!A)}function c(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:w,maxSamples:S}}function bw(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new Ta,r=new _e,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):l();else{const v=s?0:i,x=v*4;let y=p.clippingState||null;c.value=y,y=d(m,h,x,f);for(let w=0;w!==x;++w)y[w]=e[w];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const p=f+_*4,v=h.matrixWorldInverse;r.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==_;++x,y+=4)o.copy(u[x]).applyMatrix4(v,r),o.normal.toArray(g,y),g[y+3]=o.constant}c.value=g,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function Sw(n){let t=new WeakMap;function e(o,r){return r===Zl?o.mapping=Rs:r===jl&&(o.mapping=Ps),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Zl||r===jl)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Ib(c.height);return l.fromEquirectangularTexture(n,o),t.set(o,l),o.addEventListener("dispose",a),e(l.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class fm extends hm{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,c=a-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,r-=d*this.view.offsetY,c=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const gs=4,ef=[.125,.215,.35,.446,.526,.582],Ca=20,sl=new fm,nf=new ee;let ol=null,rl=0,cl=0,ll=!1;const Aa=(1+Math.sqrt(5))/2,cs=1/Aa,af=[new G(-Aa,cs,0),new G(Aa,cs,0),new G(-cs,0,Aa),new G(cs,0,Aa),new G(0,Aa,-cs),new G(0,Aa,cs),new G(-1,1,-1),new G(1,1,-1),new G(-1,1,1),new G(1,1,1)];class sf{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){ol=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),cl=this._renderer.getActiveMipmapLevel(),ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ol,rl,cl),this._renderer.xr.enabled=ll,t.scissorTest=!1,dr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Rs||t.mapping===Ps?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ol=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),cl=this._renderer.getActiveMipmapLevel(),ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:bi,minFilter:bi,generateMipmaps:!1,type:ko,format:ui,colorSpace:ks,depthBuffer:!1},a=of(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=of(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ww(s)),this._blurMaterial=Ew(s,t,e)}return a}_compileMaterial(t){const e=new be(this._lodPlanes[0],t);this._renderer.compile(e,sl)}_sceneToCubeUV(t,e,i,a){const r=new ni(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(nf),d.toneMapping=oa,d.autoClear=!1;const f=new _n({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),m=new be(new qn,f);let _=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(nf),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(r.up.set(0,c[p],0),r.lookAt(l[p],0,0)):v===1?(r.up.set(0,0,c[p]),r.lookAt(0,l[p],0)):(r.up.set(0,c[p],0),r.lookAt(0,0,l[p]));const x=this._cubeSize;dr(a,v*x,p>2?x:0,x,x),d.setRenderTarget(a),_&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===Rs||t.mapping===Ps;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=cf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rf());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new be(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;dr(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(o,sl)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=af[(a-s-1)%af.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new be(this._lodPlanes[a],l),h=l.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Ca-1),_=s/m,g=isFinite(s)?1+Math.floor(d*_):Ca;g>Ca&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ca}`);const p=[];let v=0;for(let E=0;E<Ca;++E){const A=E/_,b=Math.exp(-A*A/2);p.push(b),E===0?v+=b:E<g&&(v+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/v;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const y=this._sizeLods[a],w=3*y*(a>x-gs?a-x+gs:0),S=4*(this._cubeSize-y);dr(e,w,S,3*y,2*y),c.setRenderTarget(e),c.render(u,sl)}}function ww(n){const t=[],e=[],i=[];let a=n;const s=n-gs+1+ef.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let c=1/r;o>n-gs?c=ef[o-n+gs-1]:o===0&&(c=0),i.push(c);const l=1/(r-2),d=-l,u=1+l,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,_=3,g=2,p=1,v=new Float32Array(_*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,A=S>2?0:-1,b=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];v.set(b,_*m*S),x.set(h,g*m*S);const M=[S,S,S,S,S,S];y.set(M,p*m*S)}const w=new hn;w.setAttribute("position",new Mn(v,_)),w.setAttribute("uv",new Mn(x,g)),w.setAttribute("faceIndex",new Mn(y,p)),t.push(w),a>gs&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function of(n,t,e){const i=new Fa(n,t,e);return i.texture.mapping=sc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function dr(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function Ew(n,t,e){const i=new Float32Array(Ca),a=new G(0,1,0);return new ha({name:"SphericalGaussianBlur",defines:{n:Ca,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:ed(),fragmentShader:`

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
		`,blending:sa,depthTest:!1,depthWrite:!1})}function rf(){return new ha({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ed(),fragmentShader:`

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
		`,blending:sa,depthTest:!1,depthWrite:!1})}function cf(){return new ha({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ed(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:sa,depthTest:!1,depthWrite:!1})}function ed(){return`

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
	`}function Tw(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===Zl||c===jl,d=c===Rs||c===Ps;if(l||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new sf(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new sf(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let c=0;const l=6;for(let d=0;d<l;d++)r[d]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function Aw(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&ro("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function Rw(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const _=h.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function c(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function l(u){const h=[],f=u.index,m=u.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let x=0,y=v.length;x<y;x+=3){const w=v[x+0],S=v[x+1],E=v[x+2];h.push(w,S,S,E,E,w)}}else if(m!==void 0){const v=m.array;_=m.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const w=x+0,S=x+1,E=x+2;h.push(w,S,S,E,E,w)}}else return;const g=new(im(h)?cm:rm)(h,1);g.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&l(u)}else l(u);return s.get(u)}return{get:r,update:c,getWireframeAttribute:d}}function Pw(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)l(h[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,_,0,m);let p=0;for(let v=0;v<m;v++)p+=f[v]*_[v];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Cw(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function Lw(n,t,e){const i=new WeakMap,a=new nn;function s(o,r,c){const l=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let M=function(){A.dispose(),i.delete(r),r.removeEventListener("dispose",M)};var f=M;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],v=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),_===!0&&(y=2),g===!0&&(y=3);let w=r.attributes.position.count*y,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const E=new Float32Array(w*S*4*u),A=new sm(E,w,S,u);A.type=Si,A.needsUpdate=!0;const b=y*4;for(let R=0;R<u;R++){const k=p[R],L=v[R],D=x[R],C=w*S*4*R;for(let I=0;I<k.count;I++){const O=I*b;m===!0&&(a.fromBufferAttribute(k,I),E[C+O+0]=a.x,E[C+O+1]=a.y,E[C+O+2]=a.z,E[C+O+3]=0),_===!0&&(a.fromBufferAttribute(L,I),E[C+O+4]=a.x,E[C+O+5]=a.y,E[C+O+6]=a.z,E[C+O+7]=0),g===!0&&(a.fromBufferAttribute(D,I),E[C+O+8]=a.x,E[C+O+9]=a.y,E[C+O+10]=a.z,E[C+O+11]=D.itemSize===4?a.w:1)}}h={count:u,texture:A,size:new Xt(w,S)},i.set(r,h),r.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=r.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function Dw(n,t,e,i){let a=new WeakMap;function s(c){const l=i.render.frame,d=c.geometry,u=t.get(c,d);if(a.get(u)!==l&&(t.update(u),a.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),a.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),a.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;a.get(h)!==l&&(h.update(),a.set(h,l))}return u}function o(){a=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class pm extends Pn{constructor(t,e,i,a,s,o,r,c,l,d=_s){if(d!==_s&&d!==Ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===_s&&(i=za),i===void 0&&d===Ls&&(i=Cs),super(null,a,s,o,r,c,d,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:jn,this.minFilter=c!==void 0?c:jn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const mm=new Pn,lf=new pm(1,1),gm=new sm,xm=new vb,vm=new dm,hf=[],df=[],uf=new Float32Array(16),ff=new Float32Array(9),pf=new Float32Array(4);function Fs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=hf[a];if(s===void 0&&(s=new Float32Array(a),hf[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function pn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function mn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function rc(n,t){let e=df[t];e===void 0&&(e=new Int32Array(t),df[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function kw(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Iw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2fv(this.addr,t),mn(e,t)}}function zw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pn(e,t))return;n.uniform3fv(this.addr,t),mn(e,t)}}function Fw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4fv(this.addr,t),mn(e,t)}}function Uw(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;pf.set(i),n.uniformMatrix2fv(this.addr,!1,pf),mn(e,i)}}function Nw(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;ff.set(i),n.uniformMatrix3fv(this.addr,!1,ff),mn(e,i)}}function Ow(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(pn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,i))return;uf.set(i),n.uniformMatrix4fv(this.addr,!1,uf),mn(e,i)}}function Bw(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Hw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2iv(this.addr,t),mn(e,t)}}function Gw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;n.uniform3iv(this.addr,t),mn(e,t)}}function Xw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4iv(this.addr,t),mn(e,t)}}function Vw(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Ww(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;n.uniform2uiv(this.addr,t),mn(e,t)}}function Yw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;n.uniform3uiv(this.addr,t),mn(e,t)}}function $w(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;n.uniform4uiv(this.addr,t),mn(e,t)}}function Zw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(lf.compareFunction=nm,s=lf):s=mm,e.setTexture2D(t||s,a)}function jw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||xm,a)}function qw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||vm,a)}function Kw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||gm,a)}function Jw(n){switch(n){case 5126:return kw;case 35664:return Iw;case 35665:return zw;case 35666:return Fw;case 35674:return Uw;case 35675:return Nw;case 35676:return Ow;case 5124:case 35670:return Bw;case 35667:case 35671:return Hw;case 35668:case 35672:return Gw;case 35669:case 35673:return Xw;case 5125:return Vw;case 36294:return Ww;case 36295:return Yw;case 36296:return $w;case 35678:case 36198:case 36298:case 36306:case 35682:return Zw;case 35679:case 36299:case 36307:return jw;case 35680:case 36300:case 36308:case 36293:return qw;case 36289:case 36303:case 36311:case 36292:return Kw}}function Qw(n,t){n.uniform1fv(this.addr,t)}function tE(n,t){const e=Fs(t,this.size,2);n.uniform2fv(this.addr,e)}function eE(n,t){const e=Fs(t,this.size,3);n.uniform3fv(this.addr,e)}function nE(n,t){const e=Fs(t,this.size,4);n.uniform4fv(this.addr,e)}function iE(n,t){const e=Fs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function aE(n,t){const e=Fs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function sE(n,t){const e=Fs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function oE(n,t){n.uniform1iv(this.addr,t)}function rE(n,t){n.uniform2iv(this.addr,t)}function cE(n,t){n.uniform3iv(this.addr,t)}function lE(n,t){n.uniform4iv(this.addr,t)}function hE(n,t){n.uniform1uiv(this.addr,t)}function dE(n,t){n.uniform2uiv(this.addr,t)}function uE(n,t){n.uniform3uiv(this.addr,t)}function fE(n,t){n.uniform4uiv(this.addr,t)}function pE(n,t,e){const i=this.cache,a=t.length,s=rc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||mm,s[o])}function mE(n,t,e){const i=this.cache,a=t.length,s=rc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||xm,s[o])}function gE(n,t,e){const i=this.cache,a=t.length,s=rc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||vm,s[o])}function xE(n,t,e){const i=this.cache,a=t.length,s=rc(e,a);pn(i,s)||(n.uniform1iv(this.addr,s),mn(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||gm,s[o])}function vE(n){switch(n){case 5126:return Qw;case 35664:return tE;case 35665:return eE;case 35666:return nE;case 35674:return iE;case 35675:return aE;case 35676:return sE;case 5124:case 35670:return oE;case 35667:case 35671:return rE;case 35668:case 35672:return cE;case 35669:case 35673:return lE;case 5125:return hE;case 36294:return dE;case 36295:return uE;case 36296:return fE;case 35678:case 36198:case 36298:case 36306:case 35682:return pE;case 35679:case 36299:case 36307:return mE;case 35680:case 36300:case 36308:case 36293:return gE;case 36289:case 36303:case 36311:case 36292:return xE}}class yE{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Jw(e.type)}}class _E{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=vE(e.type)}}class ME{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const hl=/(\w+)(\])?(\[|\.)?/g;function mf(n,t){n.seq.push(t),n.map[t.id]=t}function bE(n,t,e){const i=n.name,a=i.length;for(hl.lastIndex=0;;){const s=hl.exec(i),o=hl.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&o+2===a){mf(e,l===void 0?new yE(r,n,t):new _E(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new ME(r),mf(e,u)),e=u}}}class Dr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);bE(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function gf(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const SE=37297;let wE=0;function EE(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const xf=new _e;function TE(n){Ce._getMatrix(xf,Ce.workingColorSpace,n);const t=`mat3( ${xf.elements.map(e=>e.toFixed(4))} )`;switch(Ce.getTransfer(n)){case oc:return[t,"LinearTransferOETF"];case Oe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function vf(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+EE(n.getShaderSource(t),o)}else return a}function AE(n,t){const e=TE(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function RE(n,t){let e;switch(t){case CM:e="Linear";break;case LM:e="Reinhard";break;case DM:e="Cineon";break;case kM:e="ACESFilmic";break;case zM:e="AgX";break;case FM:e="Neutral";break;case IM:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ur=new G;function PE(){Ce.getLuminanceCoefficients(ur);const n=ur.x.toFixed(4),t=ur.y.toFixed(4),e=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function CE(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(co).join(`
`)}function LE(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function DE(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function co(n){return n!==""}function yf(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function _f(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const kE=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eh(n){return n.replace(kE,zE)}const IE=new Map;function zE(n,t){let e=Me[t];if(e===void 0){const i=IE.get(t);if(i!==void 0)e=Me[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Eh(e)}const FE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mf(n){return n.replace(FE,UE)}function UE(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function bf(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function NE(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Xp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Vp?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fi&&(t="SHADOWMAP_TYPE_VSM"),t}function OE(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Rs:case Ps:t="ENVMAP_TYPE_CUBE";break;case sc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function BE(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ps:t="ENVMAP_MODE_REFRACTION";break}return t}function HE(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Xh:t="ENVMAP_BLENDING_MULTIPLY";break;case RM:t="ENVMAP_BLENDING_MIX";break;case PM:t="ENVMAP_BLENDING_ADD";break}return t}function GE(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function XE(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const c=NE(e),l=OE(e),d=BE(e),u=HE(e),h=GE(e),f=CE(e),m=LE(s),_=a.createProgram();let g,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(co).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(co).join(`
`),p.length>0&&(p+=`
`)):(g=[bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(co).join(`
`),p=[bf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==oa?"#define TONE_MAPPING":"",e.toneMapping!==oa?Me.tonemapping_pars_fragment:"",e.toneMapping!==oa?RE("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Me.colorspace_pars_fragment,AE("linearToOutputTexel",e.outputColorSpace),PE(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(co).join(`
`)),o=Eh(o),o=yf(o,e),o=_f(o,e),r=Eh(r),r=yf(r,e),r=_f(r,e),o=Mf(o),r=Mf(r),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Du?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Du?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=v+g+o,y=v+p+r,w=gf(a,a.VERTEX_SHADER,x),S=gf(a,a.FRAGMENT_SHADER,y);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function E(R){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(_).trim(),L=a.getShaderInfoLog(w).trim(),D=a.getShaderInfoLog(S).trim();let C=!0,I=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const O=vf(a,w,"vertex"),B=vf(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+k+`
`+O+`
`+B)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(L===""||D==="")&&(I=!1);I&&(R.diagnostics={runnable:C,programLog:k,vertexShader:{log:L,prefix:g},fragmentShader:{log:D,prefix:p}})}a.deleteShader(w),a.deleteShader(S),A=new Dr(a,_),b=DE(a,_)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=a.getProgramParameter(_,SE)),M},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=wE++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let VE=0;class WE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new YE(t),e.set(t,i)),i}}class YE{constructor(t){this.id=VE++,this.code=t,this.usedTimes=0}}function $E(n,t,e,i,a,s,o){const r=new Qh,c=new WE,l=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function g(b,M,R,k,L){const D=k.fog,C=L.geometry,I=b.isMeshStandardMaterial?k.environment:null,O=(b.isMeshStandardMaterial?e:t).get(b.envMap||I),B=O&&O.mapping===sc?O.image.height:null,V=m[b.type];b.precision!==null&&(f=a.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const et=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,ut=et!==void 0?et.length:0;let mt=0;C.morphAttributes.position!==void 0&&(mt=1),C.morphAttributes.normal!==void 0&&(mt=2),C.morphAttributes.color!==void 0&&(mt=3);let kt,Z,nt,lt;if(V){const ne=Mi[V];kt=ne.vertexShader,Z=ne.fragmentShader}else kt=b.vertexShader,Z=b.fragmentShader,c.update(b),nt=c.getVertexShaderID(b),lt=c.getFragmentShaderID(b);const at=n.getRenderTarget(),J=n.state.buffers.depth.getReversed(),ht=L.isInstancedMesh===!0,Ot=L.isBatchedMesh===!0,$t=!!b.map,dt=!!b.matcap,W=!!O,N=!!b.aoMap,zt=!!b.lightMap,Tt=!!b.bumpMap,St=!!b.normalMap,yt=!!b.displacementMap,gt=!!b.emissiveMap,Lt=!!b.metalnessMap,U=!!b.roughnessMap,T=b.anisotropy>0,H=b.clearcoat>0,pt=b.dispersion>0,tt=b.iridescence>0,ot=b.sheen>0,It=b.transmission>0,Et=T&&!!b.anisotropyMap,bt=H&&!!b.clearcoatMap,Vt=H&&!!b.clearcoatNormalMap,xt=H&&!!b.clearcoatRoughnessMap,Pt=tt&&!!b.iridescenceMap,X=tt&&!!b.iridescenceThicknessMap,Y=ot&&!!b.sheenColorMap,ct=ot&&!!b.sheenRoughnessMap,Bt=!!b.specularMap,Ft=!!b.specularColorMap,At=!!b.specularIntensityMap,z=It&&!!b.transmissionMap,_t=It&&!!b.thicknessMap,Q=!!b.gradientMap,rt=!!b.alphaMap,Ct=b.alphaTest>0,wt=!!b.alphaHash,jt=!!b.extensions;let ce=oa;b.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ce=n.toneMapping);const de={shaderID:V,shaderType:b.type,shaderName:b.name,vertexShader:kt,fragmentShader:Z,defines:b.defines,customVertexShaderID:nt,customFragmentShaderID:lt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Ot,batchingColor:Ot&&L._colorsTexture!==null,instancing:ht,instancingColor:ht&&L.instanceColor!==null,instancingMorph:ht&&L.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:at===null?n.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ks,alphaToCoverage:!!b.alphaToCoverage,map:$t,matcap:dt,envMap:W,envMapMode:W&&O.mapping,envMapCubeUVHeight:B,aoMap:N,lightMap:zt,bumpMap:Tt,normalMap:St,displacementMap:h&&yt,emissiveMap:gt,normalMapObjectSpace:St&&b.normalMapType===BM,normalMapTangentSpace:St&&b.normalMapType===em,metalnessMap:Lt,roughnessMap:U,anisotropy:T,anisotropyMap:Et,clearcoat:H,clearcoatMap:bt,clearcoatNormalMap:Vt,clearcoatRoughnessMap:xt,dispersion:pt,iridescence:tt,iridescenceMap:Pt,iridescenceThicknessMap:X,sheen:ot,sheenColorMap:Y,sheenRoughnessMap:ct,specularMap:Bt,specularColorMap:Ft,specularIntensityMap:At,transmission:It,transmissionMap:z,thicknessMap:_t,gradientMap:Q,opaque:b.transparent===!1&&b.blending===ys&&b.alphaToCoverage===!1,alphaMap:rt,alphaTest:Ct,alphaHash:wt,combine:b.combine,mapUv:$t&&_(b.map.channel),aoMapUv:N&&_(b.aoMap.channel),lightMapUv:zt&&_(b.lightMap.channel),bumpMapUv:Tt&&_(b.bumpMap.channel),normalMapUv:St&&_(b.normalMap.channel),displacementMapUv:yt&&_(b.displacementMap.channel),emissiveMapUv:gt&&_(b.emissiveMap.channel),metalnessMapUv:Lt&&_(b.metalnessMap.channel),roughnessMapUv:U&&_(b.roughnessMap.channel),anisotropyMapUv:Et&&_(b.anisotropyMap.channel),clearcoatMapUv:bt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Pt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:X&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Y&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ct&&_(b.sheenRoughnessMap.channel),specularMapUv:Bt&&_(b.specularMap.channel),specularColorMapUv:Ft&&_(b.specularColorMap.channel),specularIntensityMapUv:At&&_(b.specularIntensityMap.channel),transmissionMapUv:z&&_(b.transmissionMap.channel),thicknessMapUv:_t&&_(b.thicknessMap.channel),alphaMapUv:rt&&_(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(St||T),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!C.attributes.uv&&($t||rt),fog:!!D,useFog:b.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:J,skinning:L.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:ut,morphTextureStride:mt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ce,decodeVideoTexture:$t&&b.map.isVideoTexture===!0&&Ce.getTransfer(b.map.colorSpace)===Oe,decodeVideoTextureEmissive:gt&&b.emissiveMap.isVideoTexture===!0&&Ce.getTransfer(b.emissiveMap.colorSpace)===Oe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===en,flipSided:b.side===Bn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:jt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(jt&&b.extensions.multiDraw===!0||Ot)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)M.push(R),M.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(v(M,b),x(M,b),M.push(n.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function v(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){r.disableAll(),M.supportsVertexTextures&&r.enable(0),M.instancing&&r.enable(1),M.instancingColor&&r.enable(2),M.instancingMorph&&r.enable(3),M.matcap&&r.enable(4),M.envMap&&r.enable(5),M.normalMapObjectSpace&&r.enable(6),M.normalMapTangentSpace&&r.enable(7),M.clearcoat&&r.enable(8),M.iridescence&&r.enable(9),M.alphaTest&&r.enable(10),M.vertexColors&&r.enable(11),M.vertexAlphas&&r.enable(12),M.vertexUv1s&&r.enable(13),M.vertexUv2s&&r.enable(14),M.vertexUv3s&&r.enable(15),M.vertexTangents&&r.enable(16),M.anisotropy&&r.enable(17),M.alphaHash&&r.enable(18),M.batching&&r.enable(19),M.dispersion&&r.enable(20),M.batchingColor&&r.enable(21),b.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reverseDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),b.push(r.mask)}function y(b){const M=m[b.type];let R;if(M){const k=Mi[M];R=Cb.clone(k.uniforms)}else R=b.uniforms;return R}function w(b,M){let R;for(let k=0,L=d.length;k<L;k++){const D=d[k];if(D.cacheKey===M){R=D,++R.usedTimes;break}}return R===void 0&&(R=new XE(n,M,b,s),d.push(R)),R}function S(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function E(b){c.remove(b)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:w,releaseProgram:S,releaseShaderCache:E,programs:d,dispose:A}}function ZE(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,c){n.get(o)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function jE(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Sf(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function wf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,_,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),t++,p}function r(u,h,f,m,_,g){const p=o(u,h,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function c(u,h,f,m,_,g){const p=o(u,h,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function l(u,h){e.length>1&&e.sort(u||jE),i.length>1&&i.sort(h||Sf),a.length>1&&a.sort(h||Sf)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:c,finish:d,sort:l}}function qE(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new wf,n.set(i,[o])):a>=s.length?(o=new wf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function KE(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new G,color:new ee};break;case"SpotLight":e={position:new G,direction:new G,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new G,halfWidth:new G,halfHeight:new G};break}return n[t.id]=e,e}}}function JE(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let QE=0;function tT(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function eT(n){const t=new KE,e=JE(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new G);const a=new G,s=new De,o=new De;function r(l){let d=0,u=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,v=0,x=0,y=0,w=0,S=0,E=0;l.sort(tT);for(let b=0,M=l.length;b<M;b++){const R=l[b],k=R.color,L=R.intensity,D=R.distance,C=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=k.r*L,u+=k.g*L,h+=k.b*L;else if(R.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(R.sh.coefficients[I],L);E++}else if(R.isDirectionalLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const O=R.shadow,B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.directionalShadow[f]=B,i.directionalShadowMap[f]=C,i.directionalShadowMatrix[f]=R.shadow.matrix,v++}i.directional[f]=I,f++}else if(R.isSpotLight){const I=t.get(R);I.position.setFromMatrixPosition(R.matrixWorld),I.color.copy(k).multiplyScalar(L),I.distance=D,I.coneCos=Math.cos(R.angle),I.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),I.decay=R.decay,i.spot[_]=I;const O=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,O.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=O.matrix,R.castShadow){const B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=C,y++}_++}else if(R.isRectAreaLight){const I=t.get(R);I.color.copy(k).multiplyScalar(L),I.halfWidth.set(R.width*.5,0,0),I.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=I,g++}else if(R.isPointLight){const I=t.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),I.distance=R.distance,I.decay=R.decay,R.castShadow){const O=R.shadow,B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,B.shadowCameraNear=O.camera.near,B.shadowCameraFar=O.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=C,i.pointShadowMatrix[m]=R.shadow.matrix,x++}i.point[m]=I,m++}else if(R.isHemisphereLight){const I=t.get(R);I.skyColor.copy(R.color).multiplyScalar(L),I.groundColor.copy(R.groundColor).multiplyScalar(L),i.hemi[p]=I,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Gt.LTC_FLOAT_1,i.rectAreaLTC2=Gt.LTC_FLOAT_2):(i.rectAreaLTC1=Gt.LTC_HALF_1,i.rectAreaLTC2=Gt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.directionalLength!==f||A.pointLength!==m||A.spotLength!==_||A.rectAreaLength!==g||A.hemiLength!==p||A.numDirectionalShadows!==v||A.numPointShadows!==x||A.numSpotShadows!==y||A.numSpotMaps!==w||A.numLightProbes!==E)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,A.directionalLength=f,A.pointLength=m,A.spotLength=_,A.rectAreaLength=g,A.hemiLength=p,A.numDirectionalShadows=v,A.numPointShadows=x,A.numSpotShadows=y,A.numSpotMaps=w,A.numLightProbes=E,i.version=QE++)}function c(l,d){let u=0,h=0,f=0,m=0,_=0;const g=d.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),_++}}}return{setup:r,setupView:c,state:i}}function Ef(n){const t=new eT(n),e=[],i=[];function a(d){l.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:o}}function nT(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new Ef(n),t.set(a,[r])):s>=o.length?(r=new Ef(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class iT extends Ba{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=NM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class aT extends Ba{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const sT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oT=`uniform sampler2D shadow_pass;
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
}`;function rT(n,t,e){let i=new td;const a=new Xt,s=new Xt,o=new nn,r=new iT({depthPacking:OM}),c=new aT,l={},d=e.maxTextureSize,u={[la]:Bn,[Bn]:la,[en]:en},h=new ha({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Xt},radius:{value:4}},vertexShader:sT,fragmentShader:oT}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new hn;m.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new be(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xp;let p=this.type;this.render=function(S,E,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const b=n.getRenderTarget(),M=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),k=n.state;k.setBlending(sa),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const L=p!==Fi&&this.type===Fi,D=p===Fi&&this.type!==Fi;for(let C=0,I=S.length;C<I;C++){const O=S[C],B=O.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const V=B.getFrameExtents();if(a.multiply(V),s.copy(B.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/V.x),a.x=s.x*V.x,B.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/V.y),a.y=s.y*V.y,B.mapSize.y=s.y)),B.map===null||L===!0||D===!0){const ut=this.type!==Fi?{minFilter:jn,magFilter:jn}:{};B.map!==null&&B.map.dispose(),B.map=new Fa(a.x,a.y,ut),B.map.texture.name=O.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const et=B.getViewportCount();for(let ut=0;ut<et;ut++){const mt=B.getViewport(ut);o.set(s.x*mt.x,s.y*mt.y,s.x*mt.z,s.y*mt.w),k.viewport(o),B.updateMatrices(O,ut),i=B.getFrustum(),y(E,A,B.camera,O,this.type)}B.isPointLightShadow!==!0&&this.type===Fi&&v(B,A),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(b,M,R)};function v(S,E){const A=t.update(_);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Fa(a.x,a.y)),h.uniforms.shadow_pass.value=S.map.texture,h.uniforms.resolution.value=S.mapSize,h.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,A,h,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,A,f,_,null)}function x(S,E,A,b){let M=null;const R=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)M=R;else if(M=A.isPointLight===!0?c:r,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const k=M.uuid,L=E.uuid;let D=l[k];D===void 0&&(D={},l[k]=D);let C=D[L];C===void 0&&(C=M.clone(),D[L]=C,E.addEventListener("dispose",w)),M=C}if(M.visible=E.visible,M.wireframe=E.wireframe,b===Fi?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:u[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const k=n.properties.get(M);k.light=A}return M}function y(S,E,A,b,M){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Fi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const L=t.update(S),D=S.material;if(Array.isArray(D)){const C=L.groups;for(let I=0,O=C.length;I<O;I++){const B=C[I],V=D[B.materialIndex];if(V&&V.visible){const et=x(S,V,b,M);S.onBeforeShadow(n,S,E,A,L,et,B),n.renderBufferDirect(A,null,L,et,S,B),S.onAfterShadow(n,S,E,A,L,et,B)}}}else if(D.visible){const C=x(S,D,b,M);S.onBeforeShadow(n,S,E,A,L,C,null),n.renderBufferDirect(A,null,L,C,S,null),S.onAfterShadow(n,S,E,A,L,C,null)}}const k=S.children;for(let L=0,D=k.length;L<D;L++)y(k[L],E,A,b,M)}function w(S){S.target.removeEventListener("dispose",w);for(const A in l){const b=l[A],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const cT={[Hl]:Gl,[Xl]:Yl,[Vl]:$l,[As]:Wl,[Gl]:Hl,[Yl]:Xl,[$l]:Vl,[Wl]:As};function lT(n,t){function e(){let z=!1;const _t=new nn;let Q=null;const rt=new nn(0,0,0,0);return{setMask:function(Ct){Q!==Ct&&!z&&(n.colorMask(Ct,Ct,Ct,Ct),Q=Ct)},setLocked:function(Ct){z=Ct},setClear:function(Ct,wt,jt,ce,de){de===!0&&(Ct*=ce,wt*=ce,jt*=ce),_t.set(Ct,wt,jt,ce),rt.equals(_t)===!1&&(n.clearColor(Ct,wt,jt,ce),rt.copy(_t))},reset:function(){z=!1,Q=null,rt.set(-1,0,0,0)}}}function i(){let z=!1,_t=!1,Q=null,rt=null,Ct=null;return{setReversed:function(wt){if(_t!==wt){const jt=t.get("EXT_clip_control");_t?jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.ZERO_TO_ONE_EXT):jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.NEGATIVE_ONE_TO_ONE_EXT);const ce=Ct;Ct=null,this.setClear(ce)}_t=wt},getReversed:function(){return _t},setTest:function(wt){wt?at(n.DEPTH_TEST):J(n.DEPTH_TEST)},setMask:function(wt){Q!==wt&&!z&&(n.depthMask(wt),Q=wt)},setFunc:function(wt){if(_t&&(wt=cT[wt]),rt!==wt){switch(wt){case Hl:n.depthFunc(n.NEVER);break;case Gl:n.depthFunc(n.ALWAYS);break;case Xl:n.depthFunc(n.LESS);break;case As:n.depthFunc(n.LEQUAL);break;case Vl:n.depthFunc(n.EQUAL);break;case Wl:n.depthFunc(n.GEQUAL);break;case Yl:n.depthFunc(n.GREATER);break;case $l:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}rt=wt}},setLocked:function(wt){z=wt},setClear:function(wt){Ct!==wt&&(_t&&(wt=1-wt),n.clearDepth(wt),Ct=wt)},reset:function(){z=!1,Q=null,rt=null,Ct=null,_t=!1}}}function a(){let z=!1,_t=null,Q=null,rt=null,Ct=null,wt=null,jt=null,ce=null,de=null;return{setTest:function(ne){z||(ne?at(n.STENCIL_TEST):J(n.STENCIL_TEST))},setMask:function(ne){_t!==ne&&!z&&(n.stencilMask(ne),_t=ne)},setFunc:function(ne,Se,me){(Q!==ne||rt!==Se||Ct!==me)&&(n.stencilFunc(ne,Se,me),Q=ne,rt=Se,Ct=me)},setOp:function(ne,Se,me){(wt!==ne||jt!==Se||ce!==me)&&(n.stencilOp(ne,Se,me),wt=ne,jt=Se,ce=me)},setLocked:function(ne){z=ne},setClear:function(ne){de!==ne&&(n.clearStencil(ne),de=ne)},reset:function(){z=!1,_t=null,Q=null,rt=null,Ct=null,wt=null,jt=null,ce=null,de=null}}}const s=new e,o=new i,r=new a,c=new WeakMap,l=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,_=!1,g=null,p=null,v=null,x=null,y=null,w=null,S=null,E=new ee(0,0,0),A=0,b=!1,M=null,R=null,k=null,L=null,D=null;const C=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,O=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(B)[1]),I=O>=1):B.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),I=O>=2);let V=null,et={};const ut=n.getParameter(n.SCISSOR_BOX),mt=n.getParameter(n.VIEWPORT),kt=new nn().fromArray(ut),Z=new nn().fromArray(mt);function nt(z,_t,Q,rt){const Ct=new Uint8Array(4),wt=n.createTexture();n.bindTexture(z,wt),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let jt=0;jt<Q;jt++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(_t,0,n.RGBA,1,1,rt,0,n.RGBA,n.UNSIGNED_BYTE,Ct):n.texImage2D(_t+jt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ct);return wt}const lt={};lt[n.TEXTURE_2D]=nt(n.TEXTURE_2D,n.TEXTURE_2D,1),lt[n.TEXTURE_CUBE_MAP]=nt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),lt[n.TEXTURE_2D_ARRAY]=nt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),lt[n.TEXTURE_3D]=nt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),at(n.DEPTH_TEST),o.setFunc(As),Tt(!1),St(Ru),at(n.CULL_FACE),N(sa);function at(z){d[z]!==!0&&(n.enable(z),d[z]=!0)}function J(z){d[z]!==!1&&(n.disable(z),d[z]=!1)}function ht(z,_t){return u[z]!==_t?(n.bindFramebuffer(z,_t),u[z]=_t,z===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=_t),z===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=_t),!0):!1}function Ot(z,_t){let Q=f,rt=!1;if(z){Q=h.get(_t),Q===void 0&&(Q=[],h.set(_t,Q));const Ct=z.textures;if(Q.length!==Ct.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let wt=0,jt=Ct.length;wt<jt;wt++)Q[wt]=n.COLOR_ATTACHMENT0+wt;Q.length=Ct.length,rt=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,rt=!0);rt&&n.drawBuffers(Q)}function $t(z){return m!==z?(n.useProgram(z),m=z,!0):!1}const dt={[Pa]:n.FUNC_ADD,[dM]:n.FUNC_SUBTRACT,[uM]:n.FUNC_REVERSE_SUBTRACT};dt[fM]=n.MIN,dt[pM]=n.MAX;const W={[mM]:n.ZERO,[gM]:n.ONE,[xM]:n.SRC_COLOR,[Ol]:n.SRC_ALPHA,[SM]:n.SRC_ALPHA_SATURATE,[MM]:n.DST_COLOR,[yM]:n.DST_ALPHA,[vM]:n.ONE_MINUS_SRC_COLOR,[Bl]:n.ONE_MINUS_SRC_ALPHA,[bM]:n.ONE_MINUS_DST_COLOR,[_M]:n.ONE_MINUS_DST_ALPHA,[wM]:n.CONSTANT_COLOR,[EM]:n.ONE_MINUS_CONSTANT_COLOR,[TM]:n.CONSTANT_ALPHA,[AM]:n.ONE_MINUS_CONSTANT_ALPHA};function N(z,_t,Q,rt,Ct,wt,jt,ce,de,ne){if(z===sa){_===!0&&(J(n.BLEND),_=!1);return}if(_===!1&&(at(n.BLEND),_=!0),z!==hM){if(z!==g||ne!==b){if((p!==Pa||y!==Pa)&&(n.blendEquation(n.FUNC_ADD),p=Pa,y=Pa),ne)switch(z){case ys:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ui:n.blendFunc(n.ONE,n.ONE);break;case Pu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Cu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case ys:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ui:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Pu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Cu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}v=null,x=null,w=null,S=null,E.set(0,0,0),A=0,g=z,b=ne}return}Ct=Ct||_t,wt=wt||Q,jt=jt||rt,(_t!==p||Ct!==y)&&(n.blendEquationSeparate(dt[_t],dt[Ct]),p=_t,y=Ct),(Q!==v||rt!==x||wt!==w||jt!==S)&&(n.blendFuncSeparate(W[Q],W[rt],W[wt],W[jt]),v=Q,x=rt,w=wt,S=jt),(ce.equals(E)===!1||de!==A)&&(n.blendColor(ce.r,ce.g,ce.b,de),E.copy(ce),A=de),g=z,b=!1}function zt(z,_t){z.side===en?J(n.CULL_FACE):at(n.CULL_FACE);let Q=z.side===Bn;_t&&(Q=!Q),Tt(Q),z.blending===ys&&z.transparent===!1?N(sa):N(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),s.setMask(z.colorWrite);const rt=z.stencilWrite;r.setTest(rt),rt&&(r.setMask(z.stencilWriteMask),r.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),r.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),gt(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?at(n.SAMPLE_ALPHA_TO_COVERAGE):J(n.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(z){M!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),M=z)}function St(z){z!==cM?(at(n.CULL_FACE),z!==R&&(z===Ru?n.cullFace(n.BACK):z===lM?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):J(n.CULL_FACE),R=z}function yt(z){z!==k&&(I&&n.lineWidth(z),k=z)}function gt(z,_t,Q){z?(at(n.POLYGON_OFFSET_FILL),(L!==_t||D!==Q)&&(n.polygonOffset(_t,Q),L=_t,D=Q)):J(n.POLYGON_OFFSET_FILL)}function Lt(z){z?at(n.SCISSOR_TEST):J(n.SCISSOR_TEST)}function U(z){z===void 0&&(z=n.TEXTURE0+C-1),V!==z&&(n.activeTexture(z),V=z)}function T(z,_t,Q){Q===void 0&&(V===null?Q=n.TEXTURE0+C-1:Q=V);let rt=et[Q];rt===void 0&&(rt={type:void 0,texture:void 0},et[Q]=rt),(rt.type!==z||rt.texture!==_t)&&(V!==Q&&(n.activeTexture(Q),V=Q),n.bindTexture(z,_t||lt[z]),rt.type=z,rt.texture=_t)}function H(){const z=et[V];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function pt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function tt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ot(){try{n.texSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function It(){try{n.texSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Et(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function bt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Vt(){try{n.texStorage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function xt(){try{n.texStorage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Pt(){try{n.texImage2D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function X(){try{n.texImage3D.apply(n,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Y(z){kt.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),kt.copy(z))}function ct(z){Z.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),Z.copy(z))}function Bt(z,_t){let Q=l.get(_t);Q===void 0&&(Q=new WeakMap,l.set(_t,Q));let rt=Q.get(z);rt===void 0&&(rt=n.getUniformBlockIndex(_t,z.name),Q.set(z,rt))}function Ft(z,_t){const rt=l.get(_t).get(z);c.get(_t)!==rt&&(n.uniformBlockBinding(_t,rt,z.__bindingPointIndex),c.set(_t,rt))}function At(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},V=null,et={},u={},h=new WeakMap,f=[],m=null,_=!1,g=null,p=null,v=null,x=null,y=null,w=null,S=null,E=new ee(0,0,0),A=0,b=!1,M=null,R=null,k=null,L=null,D=null,kt.set(0,0,n.canvas.width,n.canvas.height),Z.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:at,disable:J,bindFramebuffer:ht,drawBuffers:Ot,useProgram:$t,setBlending:N,setMaterial:zt,setFlipSided:Tt,setCullFace:St,setLineWidth:yt,setPolygonOffset:gt,setScissorTest:Lt,activeTexture:U,bindTexture:T,unbindTexture:H,compressedTexImage2D:pt,compressedTexImage3D:tt,texImage2D:Pt,texImage3D:X,updateUBOMapping:Bt,uniformBlockBinding:Ft,texStorage2D:Vt,texStorage3D:xt,texSubImage2D:ot,texSubImage3D:It,compressedTexSubImage2D:Et,compressedTexSubImage3D:bt,scissor:Y,viewport:ct,reset:At}}function Tf(n,t,e,i){const a=hT(i);switch(e){case jp:return n*t;case Kp:return n*t;case Jp:return n*t*2;case $h:return n*t/a.components*a.byteLength;case Zh:return n*t/a.components*a.byteLength;case Qp:return n*t*2/a.components*a.byteLength;case jh:return n*t*2/a.components*a.byteLength;case qp:return n*t*3/a.components*a.byteLength;case ui:return n*t*4/a.components*a.byteLength;case qh:return n*t*4/a.components*a.byteLength;case Ar:case Rr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Pr:case Cr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ql:case eh:return Math.max(n,16)*Math.max(t,8)/4;case Jl:case th:return Math.max(n,8)*Math.max(t,8)/2;case nh:case ih:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ah:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sh:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case oh:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case rh:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case ch:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case lh:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case hh:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case dh:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case uh:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case fh:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case ph:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case mh:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case gh:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case xh:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case vh:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Lr:case yh:case _h:return Math.ceil(n/4)*Math.ceil(t/4)*16;case tm:case Mh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case bh:case Sh:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function hT(n){switch(n){case Hi:case Yp:return{byteLength:1,components:1};case To:case $p:case ko:return{byteLength:2,components:1};case Wh:case Yh:return{byteLength:2,components:4};case za:case Vh:case Si:return{byteLength:4,components:1};case Zp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function dT(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Xt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(U,T){return f?new OffscreenCanvas(U,T):$r("canvas")}function _(U,T,H){let pt=1;const tt=Lt(U);if((tt.width>H||tt.height>H)&&(pt=H/Math.max(tt.width,tt.height)),pt<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const ot=Math.floor(pt*tt.width),It=Math.floor(pt*tt.height);u===void 0&&(u=m(ot,It));const Et=T?m(ot,It):u;return Et.width=ot,Et.height=It,Et.getContext("2d").drawImage(U,0,0,ot,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+ot+"x"+It+")."),Et}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),U;return U}function g(U){return U.generateMipmaps}function p(U){n.generateMipmap(U)}function v(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(U,T,H,pt,tt=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let ot=T;if(T===n.RED&&(H===n.FLOAT&&(ot=n.R32F),H===n.HALF_FLOAT&&(ot=n.R16F),H===n.UNSIGNED_BYTE&&(ot=n.R8)),T===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(ot=n.R8UI),H===n.UNSIGNED_SHORT&&(ot=n.R16UI),H===n.UNSIGNED_INT&&(ot=n.R32UI),H===n.BYTE&&(ot=n.R8I),H===n.SHORT&&(ot=n.R16I),H===n.INT&&(ot=n.R32I)),T===n.RG&&(H===n.FLOAT&&(ot=n.RG32F),H===n.HALF_FLOAT&&(ot=n.RG16F),H===n.UNSIGNED_BYTE&&(ot=n.RG8)),T===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(ot=n.RG8UI),H===n.UNSIGNED_SHORT&&(ot=n.RG16UI),H===n.UNSIGNED_INT&&(ot=n.RG32UI),H===n.BYTE&&(ot=n.RG8I),H===n.SHORT&&(ot=n.RG16I),H===n.INT&&(ot=n.RG32I)),T===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(ot=n.RGB8UI),H===n.UNSIGNED_SHORT&&(ot=n.RGB16UI),H===n.UNSIGNED_INT&&(ot=n.RGB32UI),H===n.BYTE&&(ot=n.RGB8I),H===n.SHORT&&(ot=n.RGB16I),H===n.INT&&(ot=n.RGB32I)),T===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(ot=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(ot=n.RGBA16UI),H===n.UNSIGNED_INT&&(ot=n.RGBA32UI),H===n.BYTE&&(ot=n.RGBA8I),H===n.SHORT&&(ot=n.RGBA16I),H===n.INT&&(ot=n.RGBA32I)),T===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(ot=n.RGB9_E5),T===n.RGBA){const It=tt?oc:Ce.getTransfer(pt);H===n.FLOAT&&(ot=n.RGBA32F),H===n.HALF_FLOAT&&(ot=n.RGBA16F),H===n.UNSIGNED_BYTE&&(ot=It===Oe?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(ot=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(ot=n.RGB5_A1)}return(ot===n.R16F||ot===n.R32F||ot===n.RG16F||ot===n.RG32F||ot===n.RGBA16F||ot===n.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function y(U,T){let H;return U?T===null||T===za||T===Cs?H=n.DEPTH24_STENCIL8:T===Si?H=n.DEPTH32F_STENCIL8:T===To&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===za||T===Cs?H=n.DEPTH_COMPONENT24:T===Si?H=n.DEPTH_COMPONENT32F:T===To&&(H=n.DEPTH_COMPONENT16),H}function w(U,T){return g(U)===!0||U.isFramebufferTexture&&U.minFilter!==jn&&U.minFilter!==bi?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function S(U){const T=U.target;T.removeEventListener("dispose",S),A(T),T.isVideoTexture&&d.delete(T)}function E(U){const T=U.target;T.removeEventListener("dispose",E),M(T)}function A(U){const T=i.get(U);if(T.__webglInit===void 0)return;const H=U.source,pt=h.get(H);if(pt){const tt=pt[T.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&b(U),Object.keys(pt).length===0&&h.delete(H)}i.remove(U)}function b(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const H=U.source,pt=h.get(H);delete pt[T.__cacheKey],o.memory.textures--}function M(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let pt=0;pt<6;pt++){if(Array.isArray(T.__webglFramebuffer[pt]))for(let tt=0;tt<T.__webglFramebuffer[pt].length;tt++)n.deleteFramebuffer(T.__webglFramebuffer[pt][tt]);else n.deleteFramebuffer(T.__webglFramebuffer[pt]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[pt])}else{if(Array.isArray(T.__webglFramebuffer))for(let pt=0;pt<T.__webglFramebuffer.length;pt++)n.deleteFramebuffer(T.__webglFramebuffer[pt]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let pt=0;pt<T.__webglColorRenderbuffer.length;pt++)T.__webglColorRenderbuffer[pt]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[pt]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const H=U.textures;for(let pt=0,tt=H.length;pt<tt;pt++){const ot=i.get(H[pt]);ot.__webglTexture&&(n.deleteTexture(ot.__webglTexture),o.memory.textures--),i.remove(H[pt])}i.remove(U)}let R=0;function k(){R=0}function L(){const U=R;return U>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+a.maxTextures),R+=1,U}function D(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function C(U,T){const H=i.get(U);if(U.isVideoTexture&&yt(U),U.isRenderTargetTexture===!1&&U.version>0&&H.__version!==U.version){const pt=U.image;if(pt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(H,U,T);return}}e.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+T)}function I(U,T){const H=i.get(U);if(U.version>0&&H.__version!==U.version){Z(H,U,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+T)}function O(U,T){const H=i.get(U);if(U.version>0&&H.__version!==U.version){Z(H,U,T);return}e.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+T)}function B(U,T){const H=i.get(U);if(U.version>0&&H.__version!==U.version){nt(H,U,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+T)}const V={[ql]:n.REPEAT,[La]:n.CLAMP_TO_EDGE,[Kl]:n.MIRRORED_REPEAT},et={[jn]:n.NEAREST,[UM]:n.NEAREST_MIPMAP_NEAREST,[Yo]:n.NEAREST_MIPMAP_LINEAR,[bi]:n.LINEAR,[Nc]:n.LINEAR_MIPMAP_NEAREST,[Da]:n.LINEAR_MIPMAP_LINEAR},ut={[HM]:n.NEVER,[$M]:n.ALWAYS,[GM]:n.LESS,[nm]:n.LEQUAL,[XM]:n.EQUAL,[YM]:n.GEQUAL,[VM]:n.GREATER,[WM]:n.NOTEQUAL};function mt(U,T){if(T.type===Si&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===bi||T.magFilter===Nc||T.magFilter===Yo||T.magFilter===Da||T.minFilter===bi||T.minFilter===Nc||T.minFilter===Yo||T.minFilter===Da)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,V[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,V[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,V[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,et[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,et[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,ut[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===jn||T.minFilter!==Yo&&T.minFilter!==Da||T.type===Si&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function kt(U,T){let H=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",S));const pt=T.source;let tt=h.get(pt);tt===void 0&&(tt={},h.set(pt,tt));const ot=D(T);if(ot!==U.__cacheKey){tt[ot]===void 0&&(tt[ot]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),tt[ot].usedTimes++;const It=tt[U.__cacheKey];It!==void 0&&(tt[U.__cacheKey].usedTimes--,It.usedTimes===0&&b(T)),U.__cacheKey=ot,U.__webglTexture=tt[ot].texture}return H}function Z(U,T,H){let pt=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(pt=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(pt=n.TEXTURE_3D);const tt=kt(U,T),ot=T.source;e.bindTexture(pt,U.__webglTexture,n.TEXTURE0+H);const It=i.get(ot);if(ot.version!==It.__version||tt===!0){e.activeTexture(n.TEXTURE0+H);const Et=Ce.getPrimaries(Ce.workingColorSpace),bt=T.colorSpace===ta?null:Ce.getPrimaries(T.colorSpace),Vt=T.colorSpace===ta||Et===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let xt=_(T.image,!1,a.maxTextureSize);xt=gt(T,xt);const Pt=s.convert(T.format,T.colorSpace),X=s.convert(T.type);let Y=x(T.internalFormat,Pt,X,T.colorSpace,T.isVideoTexture);mt(pt,T);let ct;const Bt=T.mipmaps,Ft=T.isVideoTexture!==!0,At=It.__version===void 0||tt===!0,z=ot.dataReady,_t=w(T,xt);if(T.isDepthTexture)Y=y(T.format===Ls,T.type),At&&(Ft?e.texStorage2D(n.TEXTURE_2D,1,Y,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,Y,xt.width,xt.height,0,Pt,X,null));else if(T.isDataTexture)if(Bt.length>0){Ft&&At&&e.texStorage2D(n.TEXTURE_2D,_t,Y,Bt[0].width,Bt[0].height);for(let Q=0,rt=Bt.length;Q<rt;Q++)ct=Bt[Q],Ft?z&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Pt,X,ct.data):e.texImage2D(n.TEXTURE_2D,Q,Y,ct.width,ct.height,0,Pt,X,ct.data);T.generateMipmaps=!1}else Ft?(At&&e.texStorage2D(n.TEXTURE_2D,_t,Y,xt.width,xt.height),z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,xt.width,xt.height,Pt,X,xt.data)):e.texImage2D(n.TEXTURE_2D,0,Y,xt.width,xt.height,0,Pt,X,xt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Ft&&At&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,Y,Bt[0].width,Bt[0].height,xt.depth);for(let Q=0,rt=Bt.length;Q<rt;Q++)if(ct=Bt[Q],T.format!==ui)if(Pt!==null)if(Ft){if(z)if(T.layerUpdates.size>0){const Ct=Tf(ct.width,ct.height,T.format,T.type);for(const wt of T.layerUpdates){const jt=ct.data.subarray(wt*Ct/ct.data.BYTES_PER_ELEMENT,(wt+1)*Ct/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,wt,ct.width,ct.height,1,Pt,jt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,xt.depth,Pt,ct.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,Y,ct.width,ct.height,xt.depth,0,ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?z&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ct.width,ct.height,xt.depth,Pt,X,ct.data):e.texImage3D(n.TEXTURE_2D_ARRAY,Q,Y,ct.width,ct.height,xt.depth,0,Pt,X,ct.data)}else{Ft&&At&&e.texStorage2D(n.TEXTURE_2D,_t,Y,Bt[0].width,Bt[0].height);for(let Q=0,rt=Bt.length;Q<rt;Q++)ct=Bt[Q],T.format!==ui?Pt!==null?Ft?z&&e.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Pt,ct.data):e.compressedTexImage2D(n.TEXTURE_2D,Q,Y,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?z&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,ct.width,ct.height,Pt,X,ct.data):e.texImage2D(n.TEXTURE_2D,Q,Y,ct.width,ct.height,0,Pt,X,ct.data)}else if(T.isDataArrayTexture)if(Ft){if(At&&e.texStorage3D(n.TEXTURE_2D_ARRAY,_t,Y,xt.width,xt.height,xt.depth),z)if(T.layerUpdates.size>0){const Q=Tf(xt.width,xt.height,T.format,T.type);for(const rt of T.layerUpdates){const Ct=xt.data.subarray(rt*Q/xt.data.BYTES_PER_ELEMENT,(rt+1)*Q/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,rt,xt.width,xt.height,1,Pt,X,Ct)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,Pt,X,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Y,xt.width,xt.height,xt.depth,0,Pt,X,xt.data);else if(T.isData3DTexture)Ft?(At&&e.texStorage3D(n.TEXTURE_3D,_t,Y,xt.width,xt.height,xt.depth),z&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,Pt,X,xt.data)):e.texImage3D(n.TEXTURE_3D,0,Y,xt.width,xt.height,xt.depth,0,Pt,X,xt.data);else if(T.isFramebufferTexture){if(At)if(Ft)e.texStorage2D(n.TEXTURE_2D,_t,Y,xt.width,xt.height);else{let Q=xt.width,rt=xt.height;for(let Ct=0;Ct<_t;Ct++)e.texImage2D(n.TEXTURE_2D,Ct,Y,Q,rt,0,Pt,X,null),Q>>=1,rt>>=1}}else if(Bt.length>0){if(Ft&&At){const Q=Lt(Bt[0]);e.texStorage2D(n.TEXTURE_2D,_t,Y,Q.width,Q.height)}for(let Q=0,rt=Bt.length;Q<rt;Q++)ct=Bt[Q],Ft?z&&e.texSubImage2D(n.TEXTURE_2D,Q,0,0,Pt,X,ct):e.texImage2D(n.TEXTURE_2D,Q,Y,Pt,X,ct);T.generateMipmaps=!1}else if(Ft){if(At){const Q=Lt(xt);e.texStorage2D(n.TEXTURE_2D,_t,Y,Q.width,Q.height)}z&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Pt,X,xt)}else e.texImage2D(n.TEXTURE_2D,0,Y,Pt,X,xt);g(T)&&p(pt),It.__version=ot.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function nt(U,T,H){if(T.image.length!==6)return;const pt=kt(U,T),tt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+H);const ot=i.get(tt);if(tt.version!==ot.__version||pt===!0){e.activeTexture(n.TEXTURE0+H);const It=Ce.getPrimaries(Ce.workingColorSpace),Et=T.colorSpace===ta?null:Ce.getPrimaries(T.colorSpace),bt=T.colorSpace===ta||It===Et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Vt=T.isCompressedTexture||T.image[0].isCompressedTexture,xt=T.image[0]&&T.image[0].isDataTexture,Pt=[];for(let rt=0;rt<6;rt++)!Vt&&!xt?Pt[rt]=_(T.image[rt],!0,a.maxCubemapSize):Pt[rt]=xt?T.image[rt].image:T.image[rt],Pt[rt]=gt(T,Pt[rt]);const X=Pt[0],Y=s.convert(T.format,T.colorSpace),ct=s.convert(T.type),Bt=x(T.internalFormat,Y,ct,T.colorSpace),Ft=T.isVideoTexture!==!0,At=ot.__version===void 0||pt===!0,z=tt.dataReady;let _t=w(T,X);mt(n.TEXTURE_CUBE_MAP,T);let Q;if(Vt){Ft&&At&&e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Bt,X.width,X.height);for(let rt=0;rt<6;rt++){Q=Pt[rt].mipmaps;for(let Ct=0;Ct<Q.length;Ct++){const wt=Q[Ct];T.format!==ui?Y!==null?Ft?z&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct,0,0,wt.width,wt.height,Y,wt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct,Bt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct,0,0,wt.width,wt.height,Y,ct,wt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct,Bt,wt.width,wt.height,0,Y,ct,wt.data)}}}else{if(Q=T.mipmaps,Ft&&At){Q.length>0&&_t++;const rt=Lt(Pt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,_t,Bt,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(xt){Ft?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Pt[rt].width,Pt[rt].height,Y,ct,Pt[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Bt,Pt[rt].width,Pt[rt].height,0,Y,ct,Pt[rt].data);for(let Ct=0;Ct<Q.length;Ct++){const jt=Q[Ct].image[rt].image;Ft?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct+1,0,0,jt.width,jt.height,Y,ct,jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct+1,Bt,jt.width,jt.height,0,Y,ct,jt.data)}}else{Ft?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Y,ct,Pt[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Bt,Y,ct,Pt[rt]);for(let Ct=0;Ct<Q.length;Ct++){const wt=Q[Ct];Ft?z&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct+1,0,0,Y,ct,wt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Ct+1,Bt,Y,ct,wt.image[rt])}}}g(T)&&p(n.TEXTURE_CUBE_MAP),ot.__version=tt.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function lt(U,T,H,pt,tt,ot){const It=s.convert(H.format,H.colorSpace),Et=s.convert(H.type),bt=x(H.internalFormat,It,Et,H.colorSpace),Vt=i.get(T),xt=i.get(H);if(xt.__renderTarget=T,!Vt.__hasExternalTextures){const Pt=Math.max(1,T.width>>ot),X=Math.max(1,T.height>>ot);tt===n.TEXTURE_3D||tt===n.TEXTURE_2D_ARRAY?e.texImage3D(tt,ot,bt,Pt,X,T.depth,0,It,Et,null):e.texImage2D(tt,ot,bt,Pt,X,0,It,Et,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),St(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,pt,tt,xt.__webglTexture,0,Tt(T)):(tt===n.TEXTURE_2D||tt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,pt,tt,xt.__webglTexture,ot),e.bindFramebuffer(n.FRAMEBUFFER,null)}function at(U,T,H){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const pt=T.depthTexture,tt=pt&&pt.isDepthTexture?pt.type:null,ot=y(T.stencilBuffer,tt),It=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=Tt(T);St(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Et,ot,T.width,T.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,Et,ot,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ot,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,It,n.RENDERBUFFER,U)}else{const pt=T.textures;for(let tt=0;tt<pt.length;tt++){const ot=pt[tt],It=s.convert(ot.format,ot.colorSpace),Et=s.convert(ot.type),bt=x(ot.internalFormat,It,Et,ot.colorSpace),Vt=Tt(T);H&&St(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Vt,bt,T.width,T.height):St(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Vt,bt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,bt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function J(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pt=i.get(T.depthTexture);pt.__renderTarget=T,(!pt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),C(T.depthTexture,0);const tt=pt.__webglTexture,ot=Tt(T);if(T.depthTexture.format===_s)St(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0);else if(T.depthTexture.format===Ls)St(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function ht(U){const T=i.get(U),H=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const pt=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),pt){const tt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,pt.removeEventListener("dispose",tt)};pt.addEventListener("dispose",tt),T.__depthDisposeCallback=tt}T.__boundDepthTexture=pt}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");J(T.__webglFramebuffer,U)}else if(H){T.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[pt]),T.__webglDepthbuffer[pt]===void 0)T.__webglDepthbuffer[pt]=n.createRenderbuffer(),at(T.__webglDepthbuffer[pt],U,!1);else{const tt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=T.__webglDepthbuffer[pt];n.bindRenderbuffer(n.RENDERBUFFER,ot),n.framebufferRenderbuffer(n.FRAMEBUFFER,tt,n.RENDERBUFFER,ot)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),at(T.__webglDepthbuffer,U,!1);else{const pt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,tt),n.framebufferRenderbuffer(n.FRAMEBUFFER,pt,n.RENDERBUFFER,tt)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ot(U,T,H){const pt=i.get(U);T!==void 0&&lt(pt.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&ht(U)}function $t(U){const T=U.texture,H=i.get(U),pt=i.get(T);U.addEventListener("dispose",E);const tt=U.textures,ot=U.isWebGLCubeRenderTarget===!0,It=tt.length>1;if(It||(pt.__webglTexture===void 0&&(pt.__webglTexture=n.createTexture()),pt.__version=T.version,o.memory.textures++),ot){H.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer[Et]=[];for(let bt=0;bt<T.mipmaps.length;bt++)H.__webglFramebuffer[Et][bt]=n.createFramebuffer()}else H.__webglFramebuffer[Et]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer=[];for(let Et=0;Et<T.mipmaps.length;Et++)H.__webglFramebuffer[Et]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(It)for(let Et=0,bt=tt.length;Et<bt;Et++){const Vt=i.get(tt[Et]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=n.createTexture(),o.memory.textures++)}if(U.samples>0&&St(U)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Et=0;Et<tt.length;Et++){const bt=tt[Et];H.__webglColorRenderbuffer[Et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[Et]);const Vt=s.convert(bt.format,bt.colorSpace),xt=s.convert(bt.type),Pt=x(bt.internalFormat,Vt,xt,bt.colorSpace,U.isXRRenderTarget===!0),X=Tt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,X,Pt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Et,n.RENDERBUFFER,H.__webglColorRenderbuffer[Et])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),at(H.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ot){e.bindTexture(n.TEXTURE_CUBE_MAP,pt.__webglTexture),mt(n.TEXTURE_CUBE_MAP,T);for(let Et=0;Et<6;Et++)if(T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)lt(H.__webglFramebuffer[Et][bt],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,bt);else lt(H.__webglFramebuffer[Et],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);g(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let Et=0,bt=tt.length;Et<bt;Et++){const Vt=tt[Et],xt=i.get(Vt);e.bindTexture(n.TEXTURE_2D,xt.__webglTexture),mt(n.TEXTURE_2D,Vt),lt(H.__webglFramebuffer,U,Vt,n.COLOR_ATTACHMENT0+Et,n.TEXTURE_2D,0),g(Vt)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let Et=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Et=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Et,pt.__webglTexture),mt(Et,T),T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)lt(H.__webglFramebuffer[bt],U,T,n.COLOR_ATTACHMENT0,Et,bt);else lt(H.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,Et,0);g(T)&&p(Et),e.unbindTexture()}U.depthBuffer&&ht(U)}function dt(U){const T=U.textures;for(let H=0,pt=T.length;H<pt;H++){const tt=T[H];if(g(tt)){const ot=v(U),It=i.get(tt).__webglTexture;e.bindTexture(ot,It),p(ot),e.unbindTexture()}}}const W=[],N=[];function zt(U){if(U.samples>0){if(St(U)===!1){const T=U.textures,H=U.width,pt=U.height;let tt=n.COLOR_BUFFER_BIT;const ot=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,It=i.get(U),Et=T.length>1;if(Et)for(let bt=0;bt<T.length;bt++)e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let bt=0;bt<T.length;bt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(tt|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(tt|=n.STENCIL_BUFFER_BIT)),Et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,It.__webglColorRenderbuffer[bt]);const Vt=i.get(T[bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Vt,0)}n.blitFramebuffer(0,0,H,pt,0,0,H,pt,tt,n.NEAREST),c===!0&&(W.length=0,N.length=0,W.push(n.COLOR_ATTACHMENT0+bt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(W.push(ot),N.push(ot),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,N)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,W))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Et)for(let bt=0;bt<T.length;bt++){e.bindFramebuffer(n.FRAMEBUFFER,It.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.RENDERBUFFER,It.__webglColorRenderbuffer[bt]);const Vt=i.get(T[bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,It.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+bt,n.TEXTURE_2D,Vt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Tt(U){return Math.min(a.maxSamples,U.samples)}function St(U){const T=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function yt(U){const T=o.render.frame;d.get(U)!==T&&(d.set(U,T),U.update())}function gt(U,T){const H=U.colorSpace,pt=U.format,tt=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||H!==ks&&H!==ta&&(Ce.getTransfer(H)===Oe?(pt!==ui||tt!==Hi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),T}function Lt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=L,this.resetTextureUnits=k,this.setTexture2D=C,this.setTexture2DArray=I,this.setTexture3D=O,this.setTextureCube=B,this.rebindTextures=Ot,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=dt,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=ht,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=St}function uT(n,t){function e(i,a=ta){let s;const o=Ce.getTransfer(a);if(i===Hi)return n.UNSIGNED_BYTE;if(i===Wh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Yh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Zp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Yp)return n.BYTE;if(i===$p)return n.SHORT;if(i===To)return n.UNSIGNED_SHORT;if(i===Vh)return n.INT;if(i===za)return n.UNSIGNED_INT;if(i===Si)return n.FLOAT;if(i===ko)return n.HALF_FLOAT;if(i===jp)return n.ALPHA;if(i===qp)return n.RGB;if(i===ui)return n.RGBA;if(i===Kp)return n.LUMINANCE;if(i===Jp)return n.LUMINANCE_ALPHA;if(i===_s)return n.DEPTH_COMPONENT;if(i===Ls)return n.DEPTH_STENCIL;if(i===$h)return n.RED;if(i===Zh)return n.RED_INTEGER;if(i===Qp)return n.RG;if(i===jh)return n.RG_INTEGER;if(i===qh)return n.RGBA_INTEGER;if(i===Ar||i===Rr||i===Pr||i===Cr)if(o===Oe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ar)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Rr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Cr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ar)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Rr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Cr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Jl||i===Ql||i===th||i===eh)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Jl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ql)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===th)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===eh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===nh||i===ih||i===ah)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===nh||i===ih)return o===Oe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ah)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===sh||i===oh||i===rh||i===ch||i===lh||i===hh||i===dh||i===uh||i===fh||i===ph||i===mh||i===gh||i===xh||i===vh)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===sh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===rh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ch)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===lh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===hh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===dh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===uh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===fh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ph)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===mh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===gh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===xh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===vh)return o===Oe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Lr||i===yh||i===_h)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Lr)return o===Oe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===yh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===_h)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===tm||i===Mh||i===bh||i===Sh)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Lr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Mh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===bh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Sh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class fT extends ni{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ke extends Je{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pT={type:"move"};class dl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&h>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(pT)))}return r!==null&&(r.visible=a!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ke;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const mT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gT=`
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

}`;class xT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Pn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ha({vertexShader:mT,fragmentShader:gT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new be(new ei(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vT extends Is{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",c=1,l=null,d=null,u=null,h=null,f=null,m=null;const _=new xT,g=e.getContextAttributes();let p=null,v=null;const x=[],y=[],w=new Xt;let S=null;const E=new ni;E.viewport=new nn;const A=new ni;A.viewport=new nn;const b=[E,A],M=new fT;let R=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let nt=x[Z];return nt===void 0&&(nt=new dl,x[Z]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Z){let nt=x[Z];return nt===void 0&&(nt=new dl,x[Z]=nt),nt.getGripSpace()},this.getHand=function(Z){let nt=x[Z];return nt===void 0&&(nt=new dl,x[Z]=nt),nt.getHandSpace()};function L(Z){const nt=y.indexOf(Z.inputSource);if(nt===-1)return;const lt=x[nt];lt!==void 0&&(lt.update(Z.inputSource,Z.frame,l||o),lt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function D(){a.removeEventListener("select",L),a.removeEventListener("selectstart",L),a.removeEventListener("selectend",L),a.removeEventListener("squeeze",L),a.removeEventListener("squeezestart",L),a.removeEventListener("squeezeend",L),a.removeEventListener("end",D),a.removeEventListener("inputsourceschange",C);for(let Z=0;Z<x.length;Z++){const nt=y[Z];nt!==null&&(y[Z]=null,x[Z].disconnect(nt))}R=null,k=null,_.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,v=null,kt.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){r=Z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(Z){if(a=Z,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",L),a.addEventListener("selectstart",L),a.addEventListener("selectend",L),a.addEventListener("squeeze",L),a.addEventListener("squeezestart",L),a.addEventListener("squeezeend",L),a.addEventListener("end",D),a.addEventListener("inputsourceschange",C),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const nt={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,nt),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Fa(f.framebufferWidth,f.framebufferHeight,{format:ui,type:Hi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let nt=null,lt=null,at=null;g.depth&&(at=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=g.stencil?Ls:_s,lt=g.stencil?Cs:za);const J={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(J),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new Fa(h.textureWidth,h.textureHeight,{format:ui,type:Hi,depthTexture:new pm(h.textureWidth,h.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await a.requestReferenceSpace(r),kt.setContext(a),kt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function C(Z){for(let nt=0;nt<Z.removed.length;nt++){const lt=Z.removed[nt],at=y.indexOf(lt);at>=0&&(y[at]=null,x[at].disconnect(lt))}for(let nt=0;nt<Z.added.length;nt++){const lt=Z.added[nt];let at=y.indexOf(lt);if(at===-1){for(let ht=0;ht<x.length;ht++)if(ht>=y.length){y.push(lt),at=ht;break}else if(y[ht]===null){y[ht]=lt,at=ht;break}if(at===-1)break}const J=x[at];J&&J.connect(lt)}}const I=new G,O=new G;function B(Z,nt,lt){I.setFromMatrixPosition(nt.matrixWorld),O.setFromMatrixPosition(lt.matrixWorld);const at=I.distanceTo(O),J=nt.projectionMatrix.elements,ht=lt.projectionMatrix.elements,Ot=J[14]/(J[10]-1),$t=J[14]/(J[10]+1),dt=(J[9]+1)/J[5],W=(J[9]-1)/J[5],N=(J[8]-1)/J[0],zt=(ht[8]+1)/ht[0],Tt=Ot*N,St=Ot*zt,yt=at/(-N+zt),gt=yt*-N;if(nt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(gt),Z.translateZ(yt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),J[10]===-1)Z.projectionMatrix.copy(nt.projectionMatrix),Z.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const Lt=Ot+yt,U=$t+yt,T=Tt-gt,H=St+(at-gt),pt=dt*$t/U*Lt,tt=W*$t/U*Lt;Z.projectionMatrix.makePerspective(T,H,pt,tt,Lt,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function V(Z,nt){nt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(nt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(a===null)return;let nt=Z.near,lt=Z.far;_.texture!==null&&(_.depthNear>0&&(nt=_.depthNear),_.depthFar>0&&(lt=_.depthFar)),M.near=A.near=E.near=nt,M.far=A.far=E.far=lt,(R!==M.near||k!==M.far)&&(a.updateRenderState({depthNear:M.near,depthFar:M.far}),R=M.near,k=M.far),E.layers.mask=Z.layers.mask|2,A.layers.mask=Z.layers.mask|4,M.layers.mask=E.layers.mask|A.layers.mask;const at=Z.parent,J=M.cameras;V(M,at);for(let ht=0;ht<J.length;ht++)V(J[ht],at);J.length===2?B(M,E,A):M.projectionMatrix.copy(E.projectionMatrix),et(Z,M,at)};function et(Z,nt,lt){lt===null?Z.matrix.copy(nt.matrixWorld):(Z.matrix.copy(lt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(nt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(nt.projectionMatrix),Z.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ao*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(Z){c=Z,h!==null&&(h.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ut=null;function mt(Z,nt){if(d=nt.getViewerPose(l||o),m=nt,d!==null){const lt=d.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let at=!1;lt.length!==M.cameras.length&&(M.cameras.length=0,at=!0);for(let ht=0;ht<lt.length;ht++){const Ot=lt[ht];let $t=null;if(f!==null)$t=f.getViewport(Ot);else{const W=u.getViewSubImage(h,Ot);$t=W.viewport,ht===0&&(t.setRenderTargetTextures(v,W.colorTexture,h.ignoreDepthValues?void 0:W.depthStencilTexture),t.setRenderTarget(v))}let dt=b[ht];dt===void 0&&(dt=new ni,dt.layers.enable(ht),dt.viewport=new nn,b[ht]=dt),dt.matrix.fromArray(Ot.transform.matrix),dt.matrix.decompose(dt.position,dt.quaternion,dt.scale),dt.projectionMatrix.fromArray(Ot.projectionMatrix),dt.projectionMatrixInverse.copy(dt.projectionMatrix).invert(),dt.viewport.set($t.x,$t.y,$t.width,$t.height),ht===0&&(M.matrix.copy(dt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),at===!0&&M.cameras.push(dt)}const J=a.enabledFeatures;if(J&&J.includes("depth-sensing")){const ht=u.getDepthInformation(lt[0]);ht&&ht.isValid&&ht.texture&&_.init(t,ht,a.renderState)}}for(let lt=0;lt<x.length;lt++){const at=y[lt],J=x[lt];at!==null&&J!==void 0&&J.update(at,nt,l||o)}ut&&ut(Z,nt),nt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:nt}),m=null}const kt=new um;kt.setAnimationLoop(mt),this.setAnimationLoop=function(Z){ut=Z},this.dispose=function(){}}}const ba=new Ti,yT=new De;function _T(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,lm(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,v,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?c(g,p,v,x):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Bn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Bn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const v=t.get(p),x=v.envMap,y=v.envMapRotation;x&&(g.envMap.value=x,ba.copy(y),ba.x*=-1,ba.y*=-1,ba.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ba.y*=-1,ba.z*=-1),g.envMapRotation.value.setFromMatrix4(yT.makeRotationFromEuler(ba)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,v,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Bn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function MT(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,x){const y=x.program;i.uniformBlockBinding(v,y)}function l(v,x){let y=a[v.id];y===void 0&&(m(v),y=d(v),a[v.id]=y,v.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(v,w);const S=t.render.frame;s[v.id]!==S&&(h(v),s[v.id]=S)}function d(v){const x=u();v.__bindingPointIndex=x;const y=n.createBuffer(),w=v.__size,S=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let v=0;v<r;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const x=a[v.id],y=v.uniforms,w=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,E=y.length;S<E;S++){const A=Array.isArray(y[S])?y[S]:[y[S]];for(let b=0,M=A.length;b<M;b++){const R=A[b];if(f(R,S,b,w)===!0){const k=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let D=0;for(let C=0;C<L.length;C++){const I=L[C],O=_(I);typeof I=="number"||typeof I=="boolean"?(R.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,k+D,R.__data)):I.isMatrix3?(R.__data[0]=I.elements[0],R.__data[1]=I.elements[1],R.__data[2]=I.elements[2],R.__data[3]=0,R.__data[4]=I.elements[3],R.__data[5]=I.elements[4],R.__data[6]=I.elements[5],R.__data[7]=0,R.__data[8]=I.elements[6],R.__data[9]=I.elements[7],R.__data[10]=I.elements[8],R.__data[11]=0):(I.toArray(R.__data,D),D+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,x,y,w){const S=v.value,E=x+"_"+y;if(w[E]===void 0)return typeof S=="number"||typeof S=="boolean"?w[E]=S:w[E]=S.clone(),!0;{const A=w[E];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return w[E]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function m(v){const x=v.uniforms;let y=0;const w=16;for(let E=0,A=x.length;E<A;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let M=0,R=b.length;M<R;M++){const k=b[M],L=Array.isArray(k.value)?k.value:[k.value];for(let D=0,C=L.length;D<C;D++){const I=L[D],O=_(I),B=y%w,V=B%O.boundary,et=B+V;y+=V,et!==0&&w-et<O.storage&&(y+=w-et),k.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=O.storage}}}const S=y%w;return S>0&&(y+=w-S),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function g(v){const x=v.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const v in a)n.deleteBuffer(a[v]);o=[],a={},s={}}return{bind:c,update:l,dispose:p}}class bT{constructor(t={}){const{canvas:e=hb(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const v=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Fn,this.toneMapping=oa,this.toneMappingExposure=1;const y=this;let w=!1,S=0,E=0,A=null,b=-1,M=null;const R=new nn,k=new nn;let L=null;const D=new ee(0);let C=0,I=e.width,O=e.height,B=1,V=null,et=null;const ut=new nn(0,0,I,O),mt=new nn(0,0,I,O);let kt=!1;const Z=new td;let nt=!1,lt=!1;const at=new De,J=new De,ht=new G,Ot=new nn,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let dt=!1;function W(){return A===null?B:1}let N=i;function zt(P,j){return e.getContext(P,j)}try{const P={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Gh}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",wt,!1),N===null){const j="webgl2";if(N=zt(j,P),N===null)throw zt(j)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Tt,St,yt,gt,Lt,U,T,H,pt,tt,ot,It,Et,bt,Vt,xt,Pt,X,Y,ct,Bt,Ft,At,z;function _t(){Tt=new Aw(N),Tt.init(),Ft=new uT(N,Tt),St=new Mw(N,Tt,t,Ft),yt=new lT(N,Tt),St.reverseDepthBuffer&&h&&yt.buffers.depth.setReversed(!0),gt=new Cw(N),Lt=new ZE,U=new dT(N,Tt,yt,Lt,St,Ft,gt),T=new Sw(y),H=new Tw(y),pt=new Ub(N),At=new yw(N,pt),tt=new Rw(N,pt,gt,At),ot=new Dw(N,tt,pt,gt),Y=new Lw(N,St,U),xt=new bw(Lt),It=new $E(y,T,H,Tt,St,At,xt),Et=new _T(y,Lt),bt=new qE,Vt=new nT(Tt),X=new vw(y,T,H,yt,ot,f,c),Pt=new rT(y,ot,St),z=new MT(N,gt,St,yt),ct=new _w(N,Tt,gt),Bt=new Pw(N,Tt,gt),gt.programs=It.programs,y.capabilities=St,y.extensions=Tt,y.properties=Lt,y.renderLists=bt,y.shadowMap=Pt,y.state=yt,y.info=gt}_t();const Q=new vT(y,N);this.xr=Q,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const P=Tt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Tt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(P){P!==void 0&&(B=P,this.setSize(I,O,!1))},this.getSize=function(P){return P.set(I,O)},this.setSize=function(P,j,it=!0){if(Q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=P,O=j,e.width=Math.floor(P*B),e.height=Math.floor(j*B),it===!0&&(e.style.width=P+"px",e.style.height=j+"px"),this.setViewport(0,0,P,j)},this.getDrawingBufferSize=function(P){return P.set(I*B,O*B).floor()},this.setDrawingBufferSize=function(P,j,it){I=P,O=j,B=it,e.width=Math.floor(P*it),e.height=Math.floor(j*it),this.setViewport(0,0,P,j)},this.getCurrentViewport=function(P){return P.copy(R)},this.getViewport=function(P){return P.copy(ut)},this.setViewport=function(P,j,it,st){P.isVector4?ut.set(P.x,P.y,P.z,P.w):ut.set(P,j,it,st),yt.viewport(R.copy(ut).multiplyScalar(B).round())},this.getScissor=function(P){return P.copy(mt)},this.setScissor=function(P,j,it,st){P.isVector4?mt.set(P.x,P.y,P.z,P.w):mt.set(P,j,it,st),yt.scissor(k.copy(mt).multiplyScalar(B).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(P){yt.setScissorTest(kt=P)},this.setOpaqueSort=function(P){V=P},this.setTransparentSort=function(P){et=P},this.getClearColor=function(P){return P.copy(X.getClearColor())},this.setClearColor=function(){X.setClearColor.apply(X,arguments)},this.getClearAlpha=function(){return X.getClearAlpha()},this.setClearAlpha=function(){X.setClearAlpha.apply(X,arguments)},this.clear=function(P=!0,j=!0,it=!0){let st=0;if(P){let q=!1;if(A!==null){const Rt=A.texture.format;q=Rt===qh||Rt===jh||Rt===Zh}if(q){const Rt=A.texture.type,Ht=Rt===Hi||Rt===za||Rt===To||Rt===Cs||Rt===Wh||Rt===Yh,Zt=X.getClearColor(),Yt=X.getClearAlpha(),se=Zt.r,te=Zt.g,Wt=Zt.b;Ht?(m[0]=se,m[1]=te,m[2]=Wt,m[3]=Yt,N.clearBufferuiv(N.COLOR,0,m)):(_[0]=se,_[1]=te,_[2]=Wt,_[3]=Yt,N.clearBufferiv(N.COLOR,0,_))}else st|=N.COLOR_BUFFER_BIT}j&&(st|=N.DEPTH_BUFFER_BIT),it&&(st|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(st)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",wt,!1),bt.dispose(),Vt.dispose(),Lt.dispose(),T.dispose(),H.dispose(),ot.dispose(),At.dispose(),z.dispose(),It.dispose(),Q.dispose(),Q.removeEventListener("sessionstart",an),Q.removeEventListener("sessionend",gn),ze.stop()};function rt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=gt.autoReset,j=Pt.enabled,it=Pt.autoUpdate,st=Pt.needsUpdate,q=Pt.type;_t(),gt.autoReset=P,Pt.enabled=j,Pt.autoUpdate=it,Pt.needsUpdate=st,Pt.type=q}function wt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function jt(P){const j=P.target;j.removeEventListener("dispose",jt),ce(j)}function ce(P){de(P),Lt.remove(P)}function de(P){const j=Lt.get(P).programs;j!==void 0&&(j.forEach(function(it){It.releaseProgram(it)}),P.isShaderMaterial&&It.releaseShaderCache(P))}this.renderBufferDirect=function(P,j,it,st,q,Rt){j===null&&(j=$t);const Ht=q.isMesh&&q.matrixWorld.determinant()<0,Zt=le(P,j,it,st,q);yt.setMaterial(st,Ht);let Yt=it.index,se=1;if(st.wireframe===!0){if(Yt=tt.getWireframeAttribute(it),Yt===void 0)return;se=2}const te=it.drawRange,Wt=it.attributes.position;let ue=te.start*se,Qt=(te.start+te.count)*se;Rt!==null&&(ue=Math.max(ue,Rt.start*se),Qt=Math.min(Qt,(Rt.start+Rt.count)*se)),Yt!==null?(ue=Math.max(ue,0),Qt=Math.min(Qt,Yt.count)):Wt!=null&&(ue=Math.max(ue,0),Qt=Math.min(Qt,Wt.count));const ve=Qt-ue;if(ve<0||ve===1/0)return;At.setup(q,st,Zt,it,Yt);let Xe,Nt=ct;if(Yt!==null&&(Xe=pt.get(Yt),Nt=Bt,Nt.setIndex(Xe)),q.isMesh)st.wireframe===!0?(yt.setLineWidth(st.wireframeLinewidth*W()),Nt.setMode(N.LINES)):Nt.setMode(N.TRIANGLES);else if(q.isLine){let ft=st.linewidth;ft===void 0&&(ft=1),yt.setLineWidth(ft*W()),q.isLineSegments?Nt.setMode(N.LINES):q.isLineLoop?Nt.setMode(N.LINE_LOOP):Nt.setMode(N.LINE_STRIP)}else q.isPoints?Nt.setMode(N.POINTS):q.isSprite&&Nt.setMode(N.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)Nt.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(Tt.get("WEBGL_multi_draw"))Nt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const ft=q._multiDrawStarts,ie=q._multiDrawCounts,oe=q._multiDrawCount,Ee=Yt?pt.get(Yt).bytesPerElement:1,dn=Lt.get(st).currentProgram.getUniforms();for(let Ae=0;Ae<oe;Ae++)dn.setValue(N,"_gl_DrawID",Ae),Nt.render(ft[Ae]/Ee,ie[Ae])}else if(q.isInstancedMesh)Nt.renderInstances(ue,ve,q.count);else if(it.isInstancedBufferGeometry){const ft=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,ie=Math.min(it.instanceCount,ft);Nt.renderInstances(ue,ve,ie)}else Nt.render(ue,ve)};function ne(P,j,it){P.transparent===!0&&P.side===en&&P.forceSinglePass===!1?(P.side=Bn,P.needsUpdate=!0,Dt(P,j,it),P.side=la,P.needsUpdate=!0,Dt(P,j,it),P.side=en):Dt(P,j,it)}this.compile=function(P,j,it=null){it===null&&(it=P),p=Vt.get(it),p.init(j),x.push(p),it.traverseVisible(function(q){q.isLight&&q.layers.test(j.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),P!==it&&P.traverseVisible(function(q){q.isLight&&q.layers.test(j.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const st=new Set;return P.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Rt=q.material;if(Rt)if(Array.isArray(Rt))for(let Ht=0;Ht<Rt.length;Ht++){const Zt=Rt[Ht];ne(Zt,it,q),st.add(Zt)}else ne(Rt,it,q),st.add(Rt)}),x.pop(),p=null,st},this.compileAsync=function(P,j,it=null){const st=this.compile(P,j,it);return new Promise(q=>{function Rt(){if(st.forEach(function(Ht){Lt.get(Ht).currentProgram.isReady()&&st.delete(Ht)}),st.size===0){q(P);return}setTimeout(Rt,10)}Tt.get("KHR_parallel_shader_compile")!==null?Rt():setTimeout(Rt,10)})};let Se=null;function me(P){Se&&Se(P)}function an(){ze.stop()}function gn(){ze.start()}const ze=new um;ze.setAnimationLoop(me),typeof self<"u"&&ze.setContext(self),this.setAnimationLoop=function(P){Se=P,Q.setAnimationLoop(P),P===null?ze.stop():ze.start()},Q.addEventListener("sessionstart",an),Q.addEventListener("sessionend",gn),this.render=function(P,j){if(j!==void 0&&j.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),j.parent===null&&j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),Q.enabled===!0&&Q.isPresenting===!0&&(Q.cameraAutoUpdate===!0&&Q.updateCamera(j),j=Q.getCamera()),P.isScene===!0&&P.onBeforeRender(y,P,j,A),p=Vt.get(P,x.length),p.init(j),x.push(p),J.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse),Z.setFromProjectionMatrix(J),lt=this.localClippingEnabled,nt=xt.init(this.clippingPlanes,lt),g=bt.get(P,v.length),g.init(),v.push(g),Q.enabled===!0&&Q.isPresenting===!0){const Rt=y.xr.getDepthSensingMesh();Rt!==null&&Le(Rt,j,-1/0,y.sortObjects)}Le(P,j,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(V,et),dt=Q.enabled===!1||Q.isPresenting===!1||Q.hasDepthSensing()===!1,dt&&X.addToRenderList(g,P),this.info.render.frame++,nt===!0&&xt.beginShadows();const it=p.state.shadowsArray;Pt.render(it,P,j),nt===!0&&xt.endShadows(),this.info.autoReset===!0&&this.info.reset();const st=g.opaque,q=g.transmissive;if(p.setupLights(),j.isArrayCamera){const Rt=j.cameras;if(q.length>0)for(let Ht=0,Zt=Rt.length;Ht<Zt;Ht++){const Yt=Rt[Ht];Cn(st,q,P,Yt)}dt&&X.render(P);for(let Ht=0,Zt=Rt.length;Ht<Zt;Ht++){const Yt=Rt[Ht];xn(g,P,Yt,Yt.viewport)}}else q.length>0&&Cn(st,q,P,j),dt&&X.render(P),xn(g,P,j);A!==null&&(U.updateMultisampleRenderTarget(A),U.updateRenderTargetMipmap(A)),P.isScene===!0&&P.onAfterRender(y,P,j),At.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],nt===!0&&xt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Le(P,j,it,st){if(P.visible===!1)return;if(P.layers.test(j.layers)){if(P.isGroup)it=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(j);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Z.intersectsSprite(P)){st&&Ot.setFromMatrixPosition(P.matrixWorld).applyMatrix4(J);const Ht=ot.update(P),Zt=P.material;Zt.visible&&g.push(P,Ht,Zt,it,Ot.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Z.intersectsObject(P))){const Ht=ot.update(P),Zt=P.material;if(st&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Ot.copy(P.boundingSphere.center)):(Ht.boundingSphere===null&&Ht.computeBoundingSphere(),Ot.copy(Ht.boundingSphere.center)),Ot.applyMatrix4(P.matrixWorld).applyMatrix4(J)),Array.isArray(Zt)){const Yt=Ht.groups;for(let se=0,te=Yt.length;se<te;se++){const Wt=Yt[se],ue=Zt[Wt.materialIndex];ue&&ue.visible&&g.push(P,Ht,ue,it,Ot.z,Wt)}}else Zt.visible&&g.push(P,Ht,Zt,it,Ot.z,null)}}const Rt=P.children;for(let Ht=0,Zt=Rt.length;Ht<Zt;Ht++)Le(Rt[Ht],j,it,st)}function xn(P,j,it,st){const q=P.opaque,Rt=P.transmissive,Ht=P.transparent;p.setupLightsView(it),nt===!0&&xt.setGlobalState(y.clippingPlanes,it),st&&yt.viewport(R.copy(st)),q.length>0&&rn(q,j,it),Rt.length>0&&rn(Rt,j,it),Ht.length>0&&rn(Ht,j,it),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function Cn(P,j,it,st){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[st.id]===void 0&&(p.state.transmissionRenderTarget[st.id]=new Fa(1,1,{generateMipmaps:!0,type:Tt.has("EXT_color_buffer_half_float")||Tt.has("EXT_color_buffer_float")?ko:Hi,minFilter:Da,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ce.workingColorSpace}));const Rt=p.state.transmissionRenderTarget[st.id],Ht=st.viewport||R;Rt.setSize(Ht.z,Ht.w);const Zt=y.getRenderTarget();y.setRenderTarget(Rt),y.getClearColor(D),C=y.getClearAlpha(),C<1&&y.setClearColor(16777215,.5),y.clear(),dt&&X.render(it);const Yt=y.toneMapping;y.toneMapping=oa;const se=st.viewport;if(st.viewport!==void 0&&(st.viewport=void 0),p.setupLightsView(st),nt===!0&&xt.setGlobalState(y.clippingPlanes,st),rn(P,it,st),U.updateMultisampleRenderTarget(Rt),U.updateRenderTargetMipmap(Rt),Tt.has("WEBGL_multisampled_render_to_texture")===!1){let te=!1;for(let Wt=0,ue=j.length;Wt<ue;Wt++){const Qt=j[Wt],ve=Qt.object,Xe=Qt.geometry,Nt=Qt.material,ft=Qt.group;if(Nt.side===en&&ve.layers.test(st.layers)){const ie=Nt.side;Nt.side=Bn,Nt.needsUpdate=!0,$(ve,it,st,Xe,Nt,ft),Nt.side=ie,Nt.needsUpdate=!0,te=!0}}te===!0&&(U.updateMultisampleRenderTarget(Rt),U.updateRenderTargetMipmap(Rt))}y.setRenderTarget(Zt),y.setClearColor(D,C),se!==void 0&&(st.viewport=se),y.toneMapping=Yt}function rn(P,j,it){const st=j.isScene===!0?j.overrideMaterial:null;for(let q=0,Rt=P.length;q<Rt;q++){const Ht=P[q],Zt=Ht.object,Yt=Ht.geometry,se=st===null?Ht.material:st,te=Ht.group;Zt.layers.test(it.layers)&&$(Zt,j,it,Yt,se,te)}}function $(P,j,it,st,q,Rt){P.onBeforeRender(y,j,it,st,q,Rt),P.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),q.onBeforeRender(y,j,it,st,P,Rt),q.transparent===!0&&q.side===en&&q.forceSinglePass===!1?(q.side=Bn,q.needsUpdate=!0,y.renderBufferDirect(it,j,st,q,P,Rt),q.side=la,q.needsUpdate=!0,y.renderBufferDirect(it,j,st,q,P,Rt),q.side=en):y.renderBufferDirect(it,j,st,q,P,Rt),P.onAfterRender(y,j,it,st,q,Rt)}function Dt(P,j,it){j.isScene!==!0&&(j=$t);const st=Lt.get(P),q=p.state.lights,Rt=p.state.shadowsArray,Ht=q.state.version,Zt=It.getParameters(P,q.state,Rt,j,it),Yt=It.getProgramCacheKey(Zt);let se=st.programs;st.environment=P.isMeshStandardMaterial?j.environment:null,st.fog=j.fog,st.envMap=(P.isMeshStandardMaterial?H:T).get(P.envMap||st.environment),st.envMapRotation=st.environment!==null&&P.envMap===null?j.environmentRotation:P.envMapRotation,se===void 0&&(P.addEventListener("dispose",jt),se=new Map,st.programs=se);let te=se.get(Yt);if(te!==void 0){if(st.currentProgram===te&&st.lightsStateVersion===Ht)return Jt(P,Zt),te}else Zt.uniforms=It.getUniforms(P),P.onBeforeCompile(Zt,y),te=It.acquireProgram(Zt,Yt),se.set(Yt,te),st.uniforms=Zt.uniforms;const Wt=st.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Wt.clippingPlanes=xt.uniform),Jt(P,Zt),st.needsLights=ge(P),st.lightsStateVersion=Ht,st.needsLights&&(Wt.ambientLightColor.value=q.state.ambient,Wt.lightProbe.value=q.state.probe,Wt.directionalLights.value=q.state.directional,Wt.directionalLightShadows.value=q.state.directionalShadow,Wt.spotLights.value=q.state.spot,Wt.spotLightShadows.value=q.state.spotShadow,Wt.rectAreaLights.value=q.state.rectArea,Wt.ltc_1.value=q.state.rectAreaLTC1,Wt.ltc_2.value=q.state.rectAreaLTC2,Wt.pointLights.value=q.state.point,Wt.pointLightShadows.value=q.state.pointShadow,Wt.hemisphereLights.value=q.state.hemi,Wt.directionalShadowMap.value=q.state.directionalShadowMap,Wt.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Wt.spotShadowMap.value=q.state.spotShadowMap,Wt.spotLightMatrix.value=q.state.spotLightMatrix,Wt.spotLightMap.value=q.state.spotLightMap,Wt.pointShadowMap.value=q.state.pointShadowMap,Wt.pointShadowMatrix.value=q.state.pointShadowMatrix),st.currentProgram=te,st.uniformsList=null,te}function Ut(P){if(P.uniformsList===null){const j=P.currentProgram.getUniforms();P.uniformsList=Dr.seqWithValue(j.seq,P.uniforms)}return P.uniformsList}function Jt(P,j){const it=Lt.get(P);it.outputColorSpace=j.outputColorSpace,it.batching=j.batching,it.batchingColor=j.batchingColor,it.instancing=j.instancing,it.instancingColor=j.instancingColor,it.instancingMorph=j.instancingMorph,it.skinning=j.skinning,it.morphTargets=j.morphTargets,it.morphNormals=j.morphNormals,it.morphColors=j.morphColors,it.morphTargetsCount=j.morphTargetsCount,it.numClippingPlanes=j.numClippingPlanes,it.numIntersection=j.numClipIntersection,it.vertexAlphas=j.vertexAlphas,it.vertexTangents=j.vertexTangents,it.toneMapping=j.toneMapping}function le(P,j,it,st,q){j.isScene!==!0&&(j=$t),U.resetTextureUnits();const Rt=j.fog,Ht=st.isMeshStandardMaterial?j.environment:null,Zt=A===null?y.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ks,Yt=(st.isMeshStandardMaterial?H:T).get(st.envMap||Ht),se=st.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,te=!!it.attributes.tangent&&(!!st.normalMap||st.anisotropy>0),Wt=!!it.morphAttributes.position,ue=!!it.morphAttributes.normal,Qt=!!it.morphAttributes.color;let ve=oa;st.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ve=y.toneMapping);const Xe=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,Nt=Xe!==void 0?Xe.length:0,ft=Lt.get(st),ie=p.state.lights;if(nt===!0&&(lt===!0||P!==M)){const Ve=P===M&&st.id===b;xt.setState(st,P,Ve)}let oe=!1;st.version===ft.__version?(ft.needsLights&&ft.lightsStateVersion!==ie.state.version||ft.outputColorSpace!==Zt||q.isBatchedMesh&&ft.batching===!1||!q.isBatchedMesh&&ft.batching===!0||q.isBatchedMesh&&ft.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&ft.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&ft.instancing===!1||!q.isInstancedMesh&&ft.instancing===!0||q.isSkinnedMesh&&ft.skinning===!1||!q.isSkinnedMesh&&ft.skinning===!0||q.isInstancedMesh&&ft.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&ft.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&ft.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&ft.instancingMorph===!1&&q.morphTexture!==null||ft.envMap!==Yt||st.fog===!0&&ft.fog!==Rt||ft.numClippingPlanes!==void 0&&(ft.numClippingPlanes!==xt.numPlanes||ft.numIntersection!==xt.numIntersection)||ft.vertexAlphas!==se||ft.vertexTangents!==te||ft.morphTargets!==Wt||ft.morphNormals!==ue||ft.morphColors!==Qt||ft.toneMapping!==ve||ft.morphTargetsCount!==Nt)&&(oe=!0):(oe=!0,ft.__version=st.version);let Ee=ft.currentProgram;oe===!0&&(Ee=Dt(st,j,q));let dn=!1,Ae=!1,bn=!1;const Re=Ee.getUniforms(),fe=ft.uniforms;if(yt.useProgram(Ee.program)&&(dn=!0,Ae=!0,bn=!0),st.id!==b&&(b=st.id,Ae=!0),dn||M!==P){yt.buffers.depth.getReversed()?(at.copy(P.projectionMatrix),ub(at),fb(at),Re.setValue(N,"projectionMatrix",at)):Re.setValue(N,"projectionMatrix",P.projectionMatrix),Re.setValue(N,"viewMatrix",P.matrixWorldInverse);const un=Re.map.cameraPosition;un!==void 0&&un.setValue(N,ht.setFromMatrixPosition(P.matrixWorld)),St.logarithmicDepthBuffer&&Re.setValue(N,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(st.isMeshPhongMaterial||st.isMeshToonMaterial||st.isMeshLambertMaterial||st.isMeshBasicMaterial||st.isMeshStandardMaterial||st.isShaderMaterial)&&Re.setValue(N,"isOrthographic",P.isOrthographicCamera===!0),M!==P&&(M=P,Ae=!0,bn=!0)}if(q.isSkinnedMesh){Re.setOptional(N,q,"bindMatrix"),Re.setOptional(N,q,"bindMatrixInverse");const Ve=q.skeleton;Ve&&(Ve.boneTexture===null&&Ve.computeBoneTexture(),Re.setValue(N,"boneTexture",Ve.boneTexture,U))}q.isBatchedMesh&&(Re.setOptional(N,q,"batchingTexture"),Re.setValue(N,"batchingTexture",q._matricesTexture,U),Re.setOptional(N,q,"batchingIdTexture"),Re.setValue(N,"batchingIdTexture",q._indirectTexture,U),Re.setOptional(N,q,"batchingColorTexture"),q._colorsTexture!==null&&Re.setValue(N,"batchingColorTexture",q._colorsTexture,U));const Pe=it.morphAttributes;if((Pe.position!==void 0||Pe.normal!==void 0||Pe.color!==void 0)&&Y.update(q,it,Ee),(Ae||ft.receiveShadow!==q.receiveShadow)&&(ft.receiveShadow=q.receiveShadow,Re.setValue(N,"receiveShadow",q.receiveShadow)),st.isMeshGouraudMaterial&&st.envMap!==null&&(fe.envMap.value=Yt,fe.flipEnvMap.value=Yt.isCubeTexture&&Yt.isRenderTargetTexture===!1?-1:1),st.isMeshStandardMaterial&&st.envMap===null&&j.environment!==null&&(fe.envMapIntensity.value=j.environmentIntensity),Ae&&(Re.setValue(N,"toneMappingExposure",y.toneMappingExposure),ft.needsLights&&he(fe,bn),Rt&&st.fog===!0&&Et.refreshFogUniforms(fe,Rt),Et.refreshMaterialUniforms(fe,st,B,O,p.state.transmissionRenderTarget[P.id]),Dr.upload(N,Ut(ft),fe,U)),st.isShaderMaterial&&st.uniformsNeedUpdate===!0&&(Dr.upload(N,Ut(ft),fe,U),st.uniformsNeedUpdate=!1),st.isSpriteMaterial&&Re.setValue(N,"center",q.center),Re.setValue(N,"modelViewMatrix",q.modelViewMatrix),Re.setValue(N,"normalMatrix",q.normalMatrix),Re.setValue(N,"modelMatrix",q.matrixWorld),st.isShaderMaterial||st.isRawShaderMaterial){const Ve=st.uniformsGroups;for(let un=0,wn=Ve.length;un<wn;un++){const Gi=Ve[un];z.update(Gi,Ee),z.bind(Gi,Ee)}}return Ee}function he(P,j){P.ambientLightColor.needsUpdate=j,P.lightProbe.needsUpdate=j,P.directionalLights.needsUpdate=j,P.directionalLightShadows.needsUpdate=j,P.pointLights.needsUpdate=j,P.pointLightShadows.needsUpdate=j,P.spotLights.needsUpdate=j,P.spotLightShadows.needsUpdate=j,P.rectAreaLights.needsUpdate=j,P.hemisphereLights.needsUpdate=j}function ge(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(P,j,it){Lt.get(P.texture).__webglTexture=j,Lt.get(P.depthTexture).__webglTexture=it;const st=Lt.get(P);st.__hasExternalTextures=!0,st.__autoAllocateDepthBuffer=it===void 0,st.__autoAllocateDepthBuffer||Tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),st.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,j){const it=Lt.get(P);it.__webglFramebuffer=j,it.__useDefaultFramebuffer=j===void 0},this.setRenderTarget=function(P,j=0,it=0){A=P,S=j,E=it;let st=!0,q=null,Rt=!1,Ht=!1;if(P){const Yt=Lt.get(P);if(Yt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(N.FRAMEBUFFER,null),st=!1;else if(Yt.__webglFramebuffer===void 0)U.setupRenderTarget(P);else if(Yt.__hasExternalTextures)U.rebindTextures(P,Lt.get(P.texture).__webglTexture,Lt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Wt=P.depthTexture;if(Yt.__boundDepthTexture!==Wt){if(Wt!==null&&Lt.has(Wt)&&(P.width!==Wt.image.width||P.height!==Wt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(P)}}const se=P.texture;(se.isData3DTexture||se.isDataArrayTexture||se.isCompressedArrayTexture)&&(Ht=!0);const te=Lt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(te[j])?q=te[j][it]:q=te[j],Rt=!0):P.samples>0&&U.useMultisampledRTT(P)===!1?q=Lt.get(P).__webglMultisampledFramebuffer:Array.isArray(te)?q=te[it]:q=te,R.copy(P.viewport),k.copy(P.scissor),L=P.scissorTest}else R.copy(ut).multiplyScalar(B).floor(),k.copy(mt).multiplyScalar(B).floor(),L=kt;if(yt.bindFramebuffer(N.FRAMEBUFFER,q)&&st&&yt.drawBuffers(P,q),yt.viewport(R),yt.scissor(k),yt.setScissorTest(L),Rt){const Yt=Lt.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+j,Yt.__webglTexture,it)}else if(Ht){const Yt=Lt.get(P.texture),se=j||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Yt.__webglTexture,it||0,se)}b=-1},this.readRenderTargetPixels=function(P,j,it,st,q,Rt,Ht){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=Lt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ht!==void 0&&(Zt=Zt[Ht]),Zt){yt.bindFramebuffer(N.FRAMEBUFFER,Zt);try{const Yt=P.texture,se=Yt.format,te=Yt.type;if(!St.textureFormatReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!St.textureTypeReadable(te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}j>=0&&j<=P.width-st&&it>=0&&it<=P.height-q&&N.readPixels(j,it,st,q,Ft.convert(se),Ft.convert(te),Rt)}finally{const Yt=A!==null?Lt.get(A).__webglFramebuffer:null;yt.bindFramebuffer(N.FRAMEBUFFER,Yt)}}},this.readRenderTargetPixelsAsync=async function(P,j,it,st,q,Rt,Ht){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=Lt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Ht!==void 0&&(Zt=Zt[Ht]),Zt){const Yt=P.texture,se=Yt.format,te=Yt.type;if(!St.textureFormatReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!St.textureTypeReadable(te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(j>=0&&j<=P.width-st&&it>=0&&it<=P.height-q){yt.bindFramebuffer(N.FRAMEBUFFER,Zt);const Wt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Wt),N.bufferData(N.PIXEL_PACK_BUFFER,Rt.byteLength,N.STREAM_READ),N.readPixels(j,it,st,q,Ft.convert(se),Ft.convert(te),0);const ue=A!==null?Lt.get(A).__webglFramebuffer:null;yt.bindFramebuffer(N.FRAMEBUFFER,ue);const Qt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await db(N,Qt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Wt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Rt),N.deleteBuffer(Wt),N.deleteSync(Qt),Rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,j=null,it=0){P.isTexture!==!0&&(ro("WebGLRenderer: copyFramebufferToTexture function signature has changed."),j=arguments[0]||null,P=arguments[1]);const st=Math.pow(2,-it),q=Math.floor(P.image.width*st),Rt=Math.floor(P.image.height*st),Ht=j!==null?j.x:0,Zt=j!==null?j.y:0;U.setTexture2D(P,0),N.copyTexSubImage2D(N.TEXTURE_2D,it,0,0,Ht,Zt,q,Rt),yt.unbindTexture()},this.copyTextureToTexture=function(P,j,it=null,st=null,q=0){P.isTexture!==!0&&(ro("WebGLRenderer: copyTextureToTexture function signature has changed."),st=arguments[0]||null,P=arguments[1],j=arguments[2],q=arguments[3]||0,it=null);let Rt,Ht,Zt,Yt,se,te,Wt,ue,Qt;const ve=P.isCompressedTexture?P.mipmaps[q]:P.image;it!==null?(Rt=it.max.x-it.min.x,Ht=it.max.y-it.min.y,Zt=it.isBox3?it.max.z-it.min.z:1,Yt=it.min.x,se=it.min.y,te=it.isBox3?it.min.z:0):(Rt=ve.width,Ht=ve.height,Zt=ve.depth||1,Yt=0,se=0,te=0),st!==null?(Wt=st.x,ue=st.y,Qt=st.z):(Wt=0,ue=0,Qt=0);const Xe=Ft.convert(j.format),Nt=Ft.convert(j.type);let ft;j.isData3DTexture?(U.setTexture3D(j,0),ft=N.TEXTURE_3D):j.isDataArrayTexture||j.isCompressedArrayTexture?(U.setTexture2DArray(j,0),ft=N.TEXTURE_2D_ARRAY):(U.setTexture2D(j,0),ft=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,j.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,j.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,j.unpackAlignment);const ie=N.getParameter(N.UNPACK_ROW_LENGTH),oe=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ee=N.getParameter(N.UNPACK_SKIP_PIXELS),dn=N.getParameter(N.UNPACK_SKIP_ROWS),Ae=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ve.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ve.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Yt),N.pixelStorei(N.UNPACK_SKIP_ROWS,se),N.pixelStorei(N.UNPACK_SKIP_IMAGES,te);const bn=P.isDataArrayTexture||P.isData3DTexture,Re=j.isDataArrayTexture||j.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const fe=Lt.get(P),Pe=Lt.get(j),Ve=Lt.get(fe.__renderTarget),un=Lt.get(Pe.__renderTarget);yt.bindFramebuffer(N.READ_FRAMEBUFFER,Ve.__webglFramebuffer),yt.bindFramebuffer(N.DRAW_FRAMEBUFFER,un.__webglFramebuffer);for(let wn=0;wn<Zt;wn++)bn&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Lt.get(P).__webglTexture,q,te+wn),P.isDepthTexture?(Re&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Lt.get(j).__webglTexture,q,Qt+wn),N.blitFramebuffer(Yt,se,Rt,Ht,Wt,ue,Rt,Ht,N.DEPTH_BUFFER_BIT,N.NEAREST)):Re?N.copyTexSubImage3D(ft,q,Wt,ue,Qt+wn,Yt,se,Rt,Ht):N.copyTexSubImage2D(ft,q,Wt,ue,Qt+wn,Yt,se,Rt,Ht);yt.bindFramebuffer(N.READ_FRAMEBUFFER,null),yt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Re?P.isDataTexture||P.isData3DTexture?N.texSubImage3D(ft,q,Wt,ue,Qt,Rt,Ht,Zt,Xe,Nt,ve.data):j.isCompressedArrayTexture?N.compressedTexSubImage3D(ft,q,Wt,ue,Qt,Rt,Ht,Zt,Xe,ve.data):N.texSubImage3D(ft,q,Wt,ue,Qt,Rt,Ht,Zt,Xe,Nt,ve):P.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,q,Wt,ue,Rt,Ht,Xe,Nt,ve.data):P.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,q,Wt,ue,ve.width,ve.height,Xe,ve.data):N.texSubImage2D(N.TEXTURE_2D,q,Wt,ue,Rt,Ht,Xe,Nt,ve);N.pixelStorei(N.UNPACK_ROW_LENGTH,ie),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,oe),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ee),N.pixelStorei(N.UNPACK_SKIP_ROWS,dn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ae),q===0&&j.generateMipmaps&&N.generateMipmap(ft),yt.unbindTexture()},this.copyTextureToTexture3D=function(P,j,it=null,st=null,q=0){return P.isTexture!==!0&&(ro("WebGLRenderer: copyTextureToTexture3D function signature has changed."),it=arguments[0]||null,st=arguments[1]||null,P=arguments[2],j=arguments[3],q=arguments[4]||0),ro('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,j,it,st,q)},this.initRenderTarget=function(P){Lt.get(P).__webglFramebuffer===void 0&&U.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?U.setTextureCube(P,0):P.isData3DTexture?U.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?U.setTexture2DArray(P,0):U.setTexture2D(P,0),yt.unbindTexture()},this.resetState=function(){S=0,E=0,A=null,yt.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ce._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ce._getUnpackColorSpace()}}class ST extends Je{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class wT{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=wh,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ei()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const kn=new G;class Zr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.applyMatrix4(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.applyNormalMatrix(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)kn.fromBufferAttribute(this,e),kn.transformDirection(t),this.setXYZ(e,kn.x,kn.y,kn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=di(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ue(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=di(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=di(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=di(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=di(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ue(e,this.array),i=Ue(i,this.array),a=Ue(a,this.array),s=Ue(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new Mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Zr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Th extends Ba{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ls;const eo=new G,hs=new G,ds=new G,us=new Xt,no=new Xt,ym=new De,fr=new G,io=new G,pr=new G,Af=new Xt,ul=new Xt,Rf=new Xt;class Pf extends Je{constructor(t=new Th){if(super(),this.isSprite=!0,this.type="Sprite",ls===void 0){ls=new hn;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new wT(e,5);ls.setIndex([0,1,2,0,2,3]),ls.setAttribute("position",new Zr(i,3,0,!1)),ls.setAttribute("uv",new Zr(i,2,3,!1))}this.geometry=ls,this.material=t,this.center=new Xt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hs.setFromMatrixScale(this.matrixWorld),ym.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ds.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hs.multiplyScalar(-ds.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;mr(fr.set(-.5,-.5,0),ds,o,hs,a,s),mr(io.set(.5,-.5,0),ds,o,hs,a,s),mr(pr.set(.5,.5,0),ds,o,hs,a,s),Af.set(0,0),ul.set(1,0),Rf.set(1,1);let r=t.ray.intersectTriangle(fr,io,pr,!1,eo);if(r===null&&(mr(io.set(-.5,.5,0),ds,o,hs,a,s),ul.set(0,1),r=t.ray.intersectTriangle(fr,pr,io,!1,eo),r===null))return;const c=t.ray.origin.distanceTo(eo);c<t.near||c>t.far||e.push({distance:c,point:eo.clone(),uv:Zn.getInterpolation(eo,fr,io,pr,Af,ul,Rf,new Xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function mr(n,t,e,i,a,s){us.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(no.x=s*us.x-a*us.y,no.y=a*us.x+s*us.y):no.copy(us),n.copy(t),n.x+=no.x,n.y+=no.y,n.applyMatrix4(ym)}class ET extends Pn{constructor(t=null,e=1,i=1,a,s,o,r,c,l=jn,d=jn,u,h){super(null,o,r,c,l,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mo extends Mn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const fs=new De,Cf=new De,gr=[],Lf=new Oa,TT=new De,ao=new be,so=new zs;class Df extends be{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new mo(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,TT)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Oa),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,fs),Lf.copy(t.boundingBox).applyMatrix4(fs),this.boundingBox.union(Lf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new zs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,fs),so.copy(t.boundingSphere).applyMatrix4(fs),this.boundingSphere.union(so)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(ao.geometry=this.geometry,ao.material=this.material,ao.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),so.copy(this.boundingSphere),so.applyMatrix4(i),t.ray.intersectsSphere(so)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,fs),Cf.multiplyMatrices(i,fs),ao.matrixWorld=Cf,ao.raycast(t,gr);for(let o=0,r=gr.length;o<r;o++){const c=gr[o];c.instanceId=s,c.object=this,e.push(c)}gr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new mo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new ET(new Float32Array(a*this.count),a,this.count,$h,Si));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const r=this.geometry.morphTargetsRelative?1:1-o,c=a*t;s[c]=r,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class nd extends Ba{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const jr=new G,qr=new G,kf=new De,oo=new Jh,xr=new zs,fl=new G,If=new G;class AT extends Je{constructor(t=new hn,e=new nd){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)jr.fromBufferAttribute(e,a-1),qr.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=jr.distanceTo(qr);t.setAttribute("lineDistance",new Ie(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),xr.copy(i.boundingSphere),xr.applyMatrix4(a),xr.radius+=s,t.ray.intersectsSphere(xr)===!1)return;kf.copy(a).invert(),oo.copy(t.ray).applyMatrix4(kf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){const p=d.getX(_),v=d.getX(_+1),x=vr(this,t,oo,c,p,v);x&&e.push(x)}if(this.isLineLoop){const _=d.getX(m-1),g=d.getX(f),p=vr(this,t,oo,c,_,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){const p=vr(this,t,oo,c,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=vr(this,t,oo,c,m-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function vr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(jr.fromBufferAttribute(o,a),qr.fromBufferAttribute(o,s),e.distanceSqToSegment(jr,qr,fl,If)>i)return;fl.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(fl);if(!(c<t.near||c>t.far))return{distance:c,point:If.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const zf=new G,Ff=new G;class _m extends AT{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)zf.fromBufferAttribute(e,a),Ff.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+zf.distanceTo(Ff);t.setAttribute("lineDistance",new Ie(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ah extends Pn{constructor(t,e,i,a,s,o,r,c,l){super(t,e,i,a,s,o,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ai{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(a=Math.floor(r+(c-r)/2),l=i[a]-o,l<0)r=a+1;else if(l>0)c=a-1;else{c=a;break}if(a=c,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),c=e||(o.isVector2?new Xt:new G);return c.copy(r).sub(o).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new G,a=[],s=[],o=[],r=new G,c=new De;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new G)}s[0]=new G,o[0]=new G;let l=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=l&&(l=d,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),h<=l&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(Sn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(Sn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(c.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class id extends Ai{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Xt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=c-this.aX,f=l-this.aY;c=h*d-f*u+this.aX,l=h*u+f*d+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class RT extends id{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ad(){let n=0,t=0,e=0,i=0;function a(s,o,r,c){n=s,t=r,e=-3*s+3*o-2*r-c,i=2*s-2*o+r+c}return{initCatmullRom:function(s,o,r,c,l){a(o,r,l*(r-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,r,c,l,d,u){let h=(o-s)/l-(r-s)/(l+d)+(r-o)/d,f=(r-o)/d-(c-o)/(d+u)+(c-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const yr=new G,pl=new ad,ml=new ad,gl=new ad;class PT extends Ai{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new G){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),c=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,d;this.closed||r>0?l=a[(r-1)%s]:(yr.subVectors(a[0],a[1]).add(a[0]),l=yr);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(yr.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=yr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),pl.initNonuniformCatmullRom(l.x,u.x,h.x,d.x,m,_,g),ml.initNonuniformCatmullRom(l.y,u.y,h.y,d.y,m,_,g),gl.initNonuniformCatmullRom(l.z,u.z,h.z,d.z,m,_,g)}else this.curveType==="catmullrom"&&(pl.initCatmullRom(l.x,u.x,h.x,d.x,this.tension),ml.initCatmullRom(l.y,u.y,h.y,d.y,this.tension),gl.initCatmullRom(l.z,u.z,h.z,d.z,this.tension));return i.set(pl.calc(c),ml.calc(c),gl.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new G().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Uf(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+o)*c+(-3*e+3*i-2*s-o)*r+s*n+e}function CT(n,t){const e=1-n;return e*e*t}function LT(n,t){return 2*(1-n)*n*t}function DT(n,t){return n*n*t}function go(n,t,e,i){return CT(n,t)+LT(n,e)+DT(n,i)}function kT(n,t){const e=1-n;return e*e*e*t}function IT(n,t){const e=1-n;return 3*e*e*n*t}function zT(n,t){return 3*(1-n)*n*n*t}function FT(n,t){return n*n*n*t}function xo(n,t,e,i,a){return kT(n,t)+IT(n,e)+zT(n,i)+FT(n,a)}class Mm extends Ai{constructor(t=new Xt,e=new Xt,i=new Xt,a=new Xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Xt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(xo(t,a.x,s.x,o.x,r.x),xo(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class UT extends Ai{constructor(t=new G,e=new G,i=new G,a=new G){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(xo(t,a.x,s.x,o.x,r.x),xo(t,a.y,s.y,o.y,r.y),xo(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class bm extends Ai{constructor(t=new Xt,e=new Xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Xt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class NT extends Ai{constructor(t=new G,e=new G){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new G){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new G){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sm extends Ai{constructor(t=new Xt,e=new Xt,i=new Xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Xt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(go(t,a.x,s.x,o.x),go(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class OT extends Ai{constructor(t=new G,e=new G,i=new G){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new G){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(go(t,a.x,s.x,o.x),go(t,a.y,s.y,o.y),go(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wm extends Ai{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Xt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,c=a[o===0?o:o-1],l=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(Uf(r,c.x,l.x,d.x,u.x),Uf(r,c.y,l.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Xt().fromArray(a))}return this}}var Nf=Object.freeze({__proto__:null,ArcCurve:RT,CatmullRomCurve3:PT,CubicBezierCurve:Mm,CubicBezierCurve3:UT,EllipseCurve:id,LineCurve:bm,LineCurve3:NT,QuadraticBezierCurve:Sm,QuadraticBezierCurve3:OT,SplineCurve:wm});class BT extends Ai{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-o/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(r);for(let l=0;l<c.length;l++){const d=c[l];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new Nf[a.type]().fromJSON(a))}return this}}class Of extends BT{constructor(t){super(),this.type="Path",this.currentPoint=new Xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new bm(this.currentPoint.clone(),new Xt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Sm(this.currentPoint.clone(),new Xt(t,e),new Xt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new Mm(this.currentPoint.clone(),new Xt(t,e),new Xt(i,a),new Xt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new wm(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,i,a,s,o,r,c),this}absellipse(t,e,i,a,s,o,r,c){const l=new id(t,e,i,a,s,o,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class sd extends hn{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],c=[],l=new G,d=new Xt;o.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Ie(o,3)),this.setAttribute("normal",new Ie(r,3)),this.setAttribute("uv",new Ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sd(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ro extends hn{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:c};const l=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const _=[],g=i/2;let p=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new Ie(u,3)),this.setAttribute("normal",new Ie(h,3)),this.setAttribute("uv",new Ie(f,2));function v(){const y=new G,w=new G;let S=0;const E=(e-t)/i;for(let A=0;A<=s;A++){const b=[],M=A/s,R=M*(e-t)+t;for(let k=0;k<=a;k++){const L=k/a,D=L*c+r,C=Math.sin(D),I=Math.cos(D);w.x=R*C,w.y=-M*i+g,w.z=R*I,u.push(w.x,w.y,w.z),y.set(C,E,I).normalize(),h.push(y.x,y.y,y.z),f.push(L,1-M),b.push(m++)}_.push(b)}for(let A=0;A<a;A++)for(let b=0;b<s;b++){const M=_[b][A],R=_[b+1][A],k=_[b+1][A+1],L=_[b][A+1];(t>0||b!==0)&&(d.push(M,R,L),S+=3),(e>0||b!==s-1)&&(d.push(R,k,L),S+=3)}l.addGroup(p,S,0),p+=S}function x(y){const w=m,S=new Xt,E=new G;let A=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let k=1;k<=a;k++)u.push(0,g*M,0),h.push(0,M,0),f.push(.5,.5),m++;const R=m;for(let k=0;k<=a;k++){const D=k/a*c+r,C=Math.cos(D),I=Math.sin(D);E.x=b*I,E.y=g*M,E.z=b*C,u.push(E.x,E.y,E.z),h.push(0,M,0),S.x=C*.5+.5,S.y=I*.5*M+.5,f.push(S.x,S.y),m++}for(let k=0;k<a;k++){const L=w+k,D=R+k;y===!0?d.push(D,D+1,L):d.push(D+1,D,L),A+=3}l.addGroup(p,A,y===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ro(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class od extends Ro{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new od(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class rd extends hn{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),l(i),d(),this.setAttribute("position",new Ie(s,3)),this.setAttribute("normal",new Ie(s.slice(),3)),this.setAttribute("uv",new Ie(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const x=new G,y=new G,w=new G;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],y),f(e[S+2],w),c(x,y,w,v)}function c(v,x,y,w){const S=w+1,E=[];for(let A=0;A<=S;A++){E[A]=[];const b=v.clone().lerp(y,A/S),M=x.clone().lerp(y,A/S),R=S-A;for(let k=0;k<=R;k++)k===0&&A===S?E[A][k]=b:E[A][k]=b.clone().lerp(M,k/R)}for(let A=0;A<S;A++)for(let b=0;b<2*(S-A)-1;b++){const M=Math.floor(b/2);b%2===0?(h(E[A][M+1]),h(E[A+1][M]),h(E[A][M])):(h(E[A][M+1]),h(E[A+1][M+1]),h(E[A+1][M]))}}function l(v){const x=new G;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(v),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function d(){const v=new G;for(let x=0;x<s.length;x+=3){v.x=s[x+0],v.y=s[x+1],v.z=s[x+2];const y=g(v)/2/Math.PI+.5,w=p(v)/Math.PI+.5;o.push(y,1-w)}m(),u()}function u(){for(let v=0;v<o.length;v+=6){const x=o[v+0],y=o[v+2],w=o[v+4],S=Math.max(x,y,w),E=Math.min(x,y,w);S>.9&&E<.1&&(x<.2&&(o[v+0]+=1),y<.2&&(o[v+2]+=1),w<.2&&(o[v+4]+=1))}}function h(v){s.push(v.x,v.y,v.z)}function f(v,x){const y=v*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const v=new G,x=new G,y=new G,w=new G,S=new Xt,E=new Xt,A=new Xt;for(let b=0,M=0;b<s.length;b+=9,M+=6){v.set(s[b+0],s[b+1],s[b+2]),x.set(s[b+3],s[b+4],s[b+5]),y.set(s[b+6],s[b+7],s[b+8]),S.set(o[M+0],o[M+1]),E.set(o[M+2],o[M+3]),A.set(o[M+4],o[M+5]),w.copy(v).add(x).add(y).divideScalar(3);const R=g(w);_(S,M+0,v,R),_(E,M+2,x,R),_(A,M+4,y,R)}}function _(v,x,y,w){w<0&&v.x===1&&(o[x]=v.x-1),y.x===0&&y.z===0&&(o[x]=w/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rd(t.vertices,t.indices,t.radius,t.details)}}const _r=new G,Mr=new G,xl=new G,br=new Zn;class HT extends hn{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(Ms*e),o=t.getIndex(),r=t.getAttribute("position"),c=o?o.count:r.count,l=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<c;m+=3){o?(l[0]=o.getX(m),l[1]=o.getX(m+1),l[2]=o.getX(m+2)):(l[0]=m,l[1]=m+1,l[2]=m+2);const{a:_,b:g,c:p}=br;if(_.fromBufferAttribute(r,l[0]),g.fromBufferAttribute(r,l[1]),p.fromBufferAttribute(r,l[2]),br.getNormal(xl),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let v=0;v<3;v++){const x=(v+1)%3,y=u[v],w=u[x],S=br[d[v]],E=br[d[x]],A=`${y}_${w}`,b=`${w}_${y}`;b in h&&h[b]?(xl.dot(h[b].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(E.x,E.y,E.z)),h[b]=null):A in h||(h[A]={index0:l[v],index1:l[x],normal:xl.clone()})}}for(const m in h)if(h[m]){const{index0:_,index1:g}=h[m];_r.fromBufferAttribute(r,_),Mr.fromBufferAttribute(r,g),f.push(_r.x,_r.y,_r.z),f.push(Mr.x,Mr.y,Mr.z)}this.setAttribute("position",new Ie(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Em extends Of{constructor(t){super(t),this.uuid=Ei(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new Of().fromJSON(a))}return this}}const GT={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=Tm(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,c,l,d,u,h,f;if(i&&(s=$T(n,t,s,e)),n.length>80*e){r=l=n[0],c=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<c&&(c=h),u>l&&(l=u),h>d&&(d=h);f=Math.max(l-r,d-c),f=f!==0?32767/f:0}return Po(s,o,e,r,c,f,0),o}};function Tm(n,t,e,i,a){let s,o;if(a===aA(n,t,e,i)>0)for(s=t;s<e;s+=i)o=Bf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=Bf(s,n[s],n[s+1],o);return o&&cc(o,o.next)&&(Lo(o),o=o.next),o}function Ua(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(cc(e,e.next)||Ke(e.prev,e,e.next)===0)){if(Lo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Po(n,t,e,i,a,s,o){if(!n)return;!o&&s&&JT(n,i,a,s);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,s?VT(n,i,a,s):XT(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),Lo(n),n=l.next,r=l.next;continue}if(n=l,n===r){o?o===1?(n=WT(Ua(n),t,e),Po(n,t,e,i,a,s,2)):o===2&&YT(n,t,e,i,a,s):Po(Ua(n),t,e,i,a,s,1);break}}}function XT(n){const t=n.prev,e=n,i=n.next;if(Ke(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,c=e.y,l=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<c?r<l?r:l:c<l?c:l,h=a>s?a>o?a:o:s>o?s:o,f=r>c?r>l?r:l:c>l?c:l;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&xs(a,r,s,c,o,l,m.x,m.y)&&Ke(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function VT(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ke(a,s,o)>=0)return!1;const r=a.x,c=s.x,l=o.x,d=a.y,u=s.y,h=o.y,f=r<c?r<l?r:l:c<l?c:l,m=d<u?d<h?d:h:u<h?u:h,_=r>c?r>l?r:l:c>l?c:l,g=d>u?d>h?d:h:u>h?u:h,p=Rh(f,m,t,e,i),v=Rh(_,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=v;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&xs(r,d,c,u,l,h,x.x,x.y)&&Ke(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&xs(r,d,c,u,l,h,y.x,y.y)&&Ke(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&xs(r,d,c,u,l,h,x.x,x.y)&&Ke(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&xs(r,d,c,u,l,h,y.x,y.y)&&Ke(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function WT(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!cc(a,s)&&Am(a,i,i.next,s)&&Co(a,s)&&Co(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),Lo(i),Lo(i.next),i=n=s),i=i.next}while(i!==n);return Ua(i)}function YT(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&eA(o,r)){let c=Rm(o,r);o=Ua(o,o.next),c=Ua(c,c.next),Po(o,t,e,i,a,s,0),Po(c,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function $T(n,t,e,i){const a=[];let s,o,r,c,l;for(s=0,o=t.length;s<o;s++)r=t[s]*i,c=s<o-1?t[s+1]*i:n.length,l=Tm(n,r,c,i,!1),l===l.next&&(l.steiner=!0),a.push(tA(l));for(a.sort(ZT),s=0;s<a.length;s++)e=jT(a[s],e);return e}function ZT(n,t){return n.x-t.x}function jT(n,t){const e=qT(n,t);if(!e)return t;const i=Rm(e,n);return Ua(i,i.next),Ua(e,e.next)}function qT(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=c&&s!==e.x&&xs(o<l?s:i,o,c,l,o<l?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),Co(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&KT(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function KT(n,t){return Ke(n.prev,n,t.prev)<0&&Ke(t.next,n,n.next)<0}function JT(n,t,e,i){let a=n;do a.z===0&&(a.z=Rh(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,QT(a)}function QT(n){let t,e,i,a,s,o,r,c,l=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,c--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,l*=2}while(o>1);return n}function Rh(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function tA(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function xs(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function eA(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!nA(n,t)&&(Co(n,t)&&Co(t,n)&&iA(n,t)&&(Ke(n.prev,n,t.prev)||Ke(n,t.prev,t))||cc(n,t)&&Ke(n.prev,n,n.next)>0&&Ke(t.prev,t,t.next)>0)}function Ke(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function cc(n,t){return n.x===t.x&&n.y===t.y}function Am(n,t,e,i){const a=wr(Ke(n,t,e)),s=wr(Ke(n,t,i)),o=wr(Ke(e,i,n)),r=wr(Ke(e,i,t));return!!(a!==s&&o!==r||a===0&&Sr(n,e,t)||s===0&&Sr(n,i,t)||o===0&&Sr(e,n,i)||r===0&&Sr(e,t,i))}function Sr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function wr(n){return n>0?1:n<0?-1:0}function nA(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Am(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Co(n,t){return Ke(n.prev,n,n.next)<0?Ke(n,t,n.next)>=0&&Ke(n,n.prev,t)>=0:Ke(n,t,n.prev)<0||Ke(n,n.next,t)<0}function iA(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Rm(n,t){const e=new Ph(n.i,n.x,n.y),i=new Ph(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Bf(n,t,e,i){const a=new Ph(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function Lo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ph(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function aA(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class vo{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return vo.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];Hf(t),Gf(i,t);let o=t.length;e.forEach(Hf);for(let c=0;c<e.length;c++)a.push(o),o+=e[c].length,Gf(i,e[c]);const r=GT.triangulate(i,a);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function Hf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Gf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class cd extends rd{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new cd(t.radius,t.detail)}}class Ss extends hn{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],c=[],l=[],d=[];let u=t;const h=(e-t)/a,f=new G,m=new Xt;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const v=p+g,x=v,y=v+i+1,w=v+i+2,S=v+1;r.push(x,y,S),r.push(y,w,S)}}this.setIndex(r),this.setAttribute("position",new Ie(c,3)),this.setAttribute("normal",new Ie(l,3)),this.setAttribute("uv",new Ie(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ss(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ld extends hn{constructor(t=new Em([new Xt(0,.5),new Xt(-.5,-.5),new Xt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(r,c,d),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new Ie(a,3)),this.setAttribute("normal",new Ie(s,3)),this.setAttribute("uv",new Ie(o,2));function l(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;vo.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const v=m[g];vo.isClockWise(v)===!0&&(m[g]=v.reverse())}const _=vo.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const v=m[g];f=f.concat(v)}for(let g=0,p=f.length;g<p;g++){const v=f[g];a.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let g=0,p=_.length;g<p;g++){const v=_[g],x=v[0]+u,y=v[1]+u,w=v[2]+u;i.push(x,y,w),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return sA(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new ld(i,t.curveSegments)}}function sA(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class lc extends hn{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],c=[],l=[],d=new G,u=new G,h=new G;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const _=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(u,d).normalize(),c.push(h.x,h.y,h.z),l.push(m/a),l.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const _=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,v=(a+1)*f+m;o.push(_,g,v),o.push(g,p,v)}this.setIndex(o),this.setAttribute("position",new Ie(r,3)),this.setAttribute("normal",new Ie(c,3)),this.setAttribute("uv",new Ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lc(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Na extends Ba{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=em,this.normalScale=new Xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=Xh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Pm extends Je{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class oA extends Pm{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Je.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const vl=new De,Xf=new G,Vf=new G;class rA{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Xt(512,512),this.map=null,this.mapPass=null,this.matrix=new De,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new td,this._frameExtents=new Xt(1,1),this._viewportCount=1,this._viewports=[new nn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Xf.setFromMatrixPosition(t.matrixWorld),e.position.copy(Xf),Vf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vf),e.updateMatrixWorld(),vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class cA extends rA{constructor(){super(new fm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class lA extends Pm{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Je.DEFAULT_UP),this.updateMatrix(),this.target=new Je,this.shadow=new cA}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const Wf=new De;class hA{constructor(t,e,i=0,a=1/0){this.ray=new Jh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Qh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Wf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Wf),this}intersectObject(t,e=!0,i=[]){return Ch(t,this,i,e),i.sort(Yf),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)Ch(t[a],this,i,e);return i.sort(Yf),i}}function Yf(n,t){return n.distance-t.distance}function Ch(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)Ch(s[o],t,e,!0)}}class dA extends _m{constructor(t=10,e=10,i=4473924,a=8947848){i=new ee(i),a=new ee(a);const s=e/2,o=t/e,r=t/2,c=[],l=[];for(let h=0,f=0,m=-r;h<=e;h++,m+=o){c.push(-r,0,m,r,0,m),c.push(m,0,-r,m,0,r);const _=h===s?i:a;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const d=new hn;d.setAttribute("position",new Ie(c,3)),d.setAttribute("color",new Ie(l,3));const u=new nd({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gh);const uA={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function fA(n,t,e,i){const a=new ni(n.fov,i,.1,200),s=new G,o=new G,r=new G;let c=!1,l=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,_=0,g=0,p=0;function v(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return v(),{camera:a,update(x,y,w,S,E=uA){const A=y+.6;if(!c)s.set(x,A,w),c=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*R,s.y+=(A-s.y)*R,s.z+=(w-s.z)*R}const b=1-Math.exp(-Math.max(t.smoothing,.001)*S);d.distanceScale+=(E.distanceScale-d.distanceScale)*b,d.offsetX+=(E.offsetX-d.offsetX)*b,d.offsetZ+=(E.offsetZ-d.offsetZ)*b,d.pitchDelta+=(E.pitchDelta-d.pitchDelta)*b;const M=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(d.zoom+=(u-d.zoom)*M,v(),(a.fov!==l||a.fov!==n.fov)&&(a.fov=n.fov,l=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=S*52;const R=h*.055;a.position.x+=Math.sin(f*1.7)*R,a.position.y+=Math.sin(f*2.3+1.1)*R*.75,a.position.z+=Math.sin(f*1.3+2.4)*R*.5,h*=Math.exp(-9*S)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,y,w){s.set(x,y+.6,w),c=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),v(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new G().setFromMatrixColumn(a.matrixWorld,0),y=new G().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(y.x,y.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:y.x/S,forwardZ:y.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,y,w){if(!Number.isFinite(x)||!Number.isFinite(y)||!(w>0))return;const S=Math.hypot(x,y);S<1e-4||(m=x/S*w,_=y/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const ka=Math.PI*2,Un=1e-6;function Qe(n,t,e){return n<t?t:n>e?e:n}function Cm(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function pA(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function Lm(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=pA(n);return i===1?a:e+(a-e)*i}function $f(n){return(1-Math.sin(n))/2}function hd(n,t,e){const i=Math.PI/180,a=Qe(Number.isFinite(t)?t:100,0,180),s=Qe(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const c=Qe((o-n)/(o-r),0,1);return 1-c*c*(3-2*c)}function Kr(n,t,e,i){const a=t>=0?1:-1,o=2/Math.max(Un,i)*Math.max(0,e),r=Qe(n,-1,1),c=a-r;return Math.abs(c)<=o?a:r+Math.sign(c)*o}function Zf(n){const t=Qe(Number.isFinite(n)?n:1,-1,1),e=Math.abs(t);return Math.sign(t)*e*e*(3-2*e)}function mA(n,t,e,i){if(!(e>0))return t;const a=e*Math.max(0,i),s=t-n;return Math.abs(s)<=a?t:n+Math.sign(s)*a}const jf=30*Math.PI/180,gA=100*Math.PI/180,xA=.06,vA=.22;function Dm(n){return Qe((Math.abs(n)-jf)/(gA-jf),0,1)}function km(n,t,e,i=xA,a=vA){const s=Qe(n,0,1),o=Qe(t,0,1),r=o>s?Math.max(Un,i):Math.max(Un,a),c=e/r*1,l=o-s;return Math.abs(l)<=c?o:s+Math.sign(l)*c}function Im(n,t,e,i,a){if(!(e>0))return t;const s=1-Qe(a,0,1);return s<=1e-9?n:mA(n,t,s*e,i)}function Jr(n,t){if(!n.grounded||n.speed<Un)return Cm();const e=n.speed/Math.max(n.moveSpeed,Un),i=Math.max(n.legLength,Un),a=n.stride>Un?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),c=Math.abs(n.localRight),l=r+c+Un,d=hd(n.localForward/Math.max(n.speed,Un),t.backStrafeStartDeg,t.backStrafeFullDeg),u=c/l*d,h=r/l+c/l*(1-d),f=Zf(n.dirF??(n.localForward>=0?1:-1)),m=Zf(n.dirR??(n.localRight>=0?1:-1)),_=a,g=D=>Math.asin(Qe(D,-o,o)/i);function p(D,C){const I=Lm(D,t.plantLock),O=$f(D),B=f*h*_*I,V=-g(B),et=C*m>0?1:-1,ut=1+et*t.crossStep*.45,mt=m*et*t.crossStep*_*.4*O,kt=m*u*_*t.sideWeight*ut*I+mt*u,Z=g(kt),nt=t.kneeLift*O*s*(.55+.25*h+.1*u*(1+C*m));return{pitchX:V,rollZ:Z,kneeX:nt}}const v=(n.phase%ka+ka)%ka,x=p(v,-1),y=p((v+Math.PI)%ka,1),w=Math.cos(v),S=$f(v),E=-t.comSway*s*w*(.6*h+.8*u)-m*t.comSway*s*u*.45,A=t.comBob*S*s,b=m*t.hipLean*s*u*w*.6,M=m*t.hipLean*s*u*(.45+.25*w),R=t.armSwing*s*w*(h*f+.3*u),k=R,L=-R;return{legL:x,legR:y,pelvisX:E,pelvisY:A,pelvisRoll:b,sideLean:M,armL:k,armR:L,strafe:u,backward:f<0?h:0}}function zm(n){const t=(n%ka+ka)%ka,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function Fm(n,t,e){const i=Qe(e.progress,0,1);if(i>=1||n.speed<Un)return Cm();const a=i*i*(3-2*i),s=1-a;return Jr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function Um(n,t,e,i){const a=Qe(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Qe(o*a,-1,1)*(e*Math.PI/180)}function Nm(n,t=0){const e=Qe(n,0,1);return e*e+(1-e*e)*Qe(t,0,1)}function Om(n,t,e){if(!(n>0)||!(t>0))return 0;const i=Qe(e,0,1);return t+(n-t)*i}function Bm(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,c=Qe(i,0,1);return e*c+r*(1-c)}function Hm(n,t,e,i,a){const s=Math.max(e,Un),o=Math.max(0,i)*s,r=Math.max(0,a)*s,c=t>Un?(t-n)/t:0,l=c>.02,d=c<-.015,u=n<=o*.15,h=!d&&n<r&&(l||u);return{enter:n>Un&&n<=o&&l,resume:!h}}function Gm(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Qe(n*Qe(t,0,2),-i,i)}function Xm(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function Vm(n,t,e){const i=Qe(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function yA(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Qe(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,c=r?1:.35,l=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*c,rollZ:f*h*c,kneeX:u*c},legR:{pitchX:-d*l,rollZ:-f*h*l,kneeX:u*l},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function Wm(n,t,e,i,a){const s=Qe(n,0,1),o=Qe(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),c=r*r*(3-2*r),l=s<=o?c:1-c,d=Math.hypot(e,i),u=d>Un?e/d:1,h=d>Un?i/d:0,f=Lm(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*l,trailPitch:Math.max(0,a.stopTrailPitch)*l,leadKnee:Math.max(0,a.stopStepKnee)*l,bodyShift:Math.max(0,a.stopBodyShift)*l,bodyDip:Math.max(0,a.stopBodyDip)*l,chestPitch:Math.max(0,a.stopChestPitch)*l,leadLeft:f,fwdN:u,rightN:h,env:l}}function Rn(n){return n<0?0:n>1?1:n}const kr=Math.PI*2;function _A(n){return((n+Math.PI)%kr+kr)%kr-Math.PI}function MA(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function bA(n,t,e,i,a,s=n.phase){const o=Rn(i);if(o<=0)return n;const r=Rn(t),c=Math.max(1,Math.round(a.cycles)),l=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=Rn(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r*r*(3-2*r),_={speed:l,phase:s+kr*c/2*m,localForward:l*u,localRight:l*(1-u)*d},g=_A(_.phase-n.phase),p=o*o*(3-2*o),v=n.speed>.05?h:0;return{speed:n.speed+(_.speed-n.speed)*o,phase:n.phase+g*p,localForward:n.localForward+(_.localForward-n.localForward)*o,localRight:n.localRight+(_.localRight-n.localRight)*o,stride:v+(f-v)*o*o}}function SA(n,t,e){const i=MA(),a=Rn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,c=o>0,l=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-l:l*.55,i.legR.pitchX=c?-l:l*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=c?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function Ym(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function qf(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*Ym(s,a)}function wA(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function EA(n,t,e){const i=Rn(n);return{gaitScale:1-i*(1-Rn(t)),attackLegWeight:Rn(e)*i}}function TA(n,t,e){const i=Rn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function AA(n,t){const e=Rn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function RA(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return Rn(t.minScale+(1-t.minScale)*e)}function PA(){return $m()}function $m(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function CA(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function LA(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?Rn(t.forceHitHeight):n.type==="light"?Rn(t.hitHeight.light):n.type==="heavy"?Rn(t.hitHeight.heavy):n.type==="knock"?Rn(t.hitHeight.knock):0}function DA(n,t,e){const i=Rn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function Zm(n,t,e){const i=$m(),a=CA(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=Rn(1-n.timer/n.duration),o=Ym(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=LA(n,e);const r=Math.sin(t),c=Math.cos(t),l=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*c,h=n.dirX*l+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*h*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,m=DA(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function jm(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const Sa=1e-6;function yo(n,t,e){return n<t?t:n>e?e:n}function qm(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=Sa||s<=Sa||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,c=Math.abs(a-s)+Sa,l=Math.hypot(n.x,n.y,n.z);if(l<=Sa)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=yo(f,c,r),_=f>r+Sa||f<c-Sa,g=Math.atan2(-h,Math.max(u,Sa)),p=yo((a*a+m*m-s*s)/(2*a*m),-1,1),v=yo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(v),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:d,jointPitch:w*(x+y),clamped:_,reach:l/r}}function Km(n,t,e,i){const a=yo(e,0,1),s=Math.max(0,i),o=(r,c)=>{const l=yo((c-r)*a,-s,s);return r+l};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function Jm(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const dd={active:!1,weight:0,clamped:0,maxError:0};function Qm(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...dd};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const c=a.map(f=>f.tip.getWorldPosition(new G));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const l=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],_=i.worldToLocal(c[f].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=qm(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const v=Km({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,l,d);m.root.rotation.x=v.rootPitch,m.root.rotation.z=v.rootRoll,m.joint.rotation.x=v.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new G);h=Math.max(h,m.distanceTo(c[f]))}return{active:!0,weight:l,clamped:u,maxError:h}}function In(n,t,e){return n<t?t:n>e?e:n}function kA(n,t,e,i,a,s,o,r,c,l){const d=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new ke,h=new ke;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new ke;f.name="lower";const m=new ke;m.name="upper",h.add(f),h.add(m);const _=[],g=(Y,ct,Bt,Ft)=>{const At=new Na({color:Ft}),z=new be(new qn(Y,ct,Bt),At);return z.castShadow=!0,z.receiveShadow=!0,_.push(At),z},p=n.headSize,v=n.legLength,x=n.armLength,y=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,E=g(S,w,.28,e);E.position.y=w/2,m.add(E);const A=new ke;A.name="headPivot",A.rotation.order="YXZ",A.position.y=w,m.add(A);const b=g(p,p,p,e);b.position.y=p/2,A.add(b);for(const Y of[-1,1]){const ct=g(.06,.07,.02,t.shoe);ct.position.set(Y*.09,p/2+.03,p/2+.011),A.add(ct)}const M=(Y,ct)=>{const Bt=ct?x:v,Ft=new ke;Ft.name=ct?Y<0?"shoulderL":"shoulderR":Y<0?"hipL":"hipR",ct||(Ft.rotation.order="ZYX"),Ft.position.set(Y*(ct?S/2+y/2:S/2-y/2),ct?w-.04:0,0),(ct?m:f).add(Ft);const At=g(y,Bt/2,y,t.limb);At.position.y=-Bt/4,Ft.add(At);const z=new ke;z.name=ct?"elbow":"knee",z.position.y=-Bt/2,Ft.add(z);const _t=g(y,Bt/2,y,t.limb);if(_t.position.y=-Bt/4,z.add(_t),!ct){const Q=g(y*1.15,.07,y*1.7,t.shoe);Q.position.set(0,-Bt/2+.035,.045),z.add(Q);const rt=new Je;return rt.name="footTip",rt.position.y=-Bt/2,z.add(rt),{root:Ft,joint:z,tip:rt}}return{root:Ft,joint:z}},R=M(-1,!1),k=M(1,!1),L=M(-1,!0),D=M(1,!0),C=[R,k].map(Y=>({root:Y.root,joint:Y.joint,tip:Y.tip,upperLen:v/2,lowerLen:v/2,bend:1})),I=new _n({color:a.attackArcColor,transparent:!0,opacity:0,side:en,depthWrite:!1}),O=new be(new lc(.62,.042,6,20,Math.PI*1.1),I);O.position.set(0,.78-v,.56),m.add(O);const B=new ee(e),V=new ee(r.flashColor),et=new ee;let ut=null,mt=0,kt=0,Z=0,nt=0,lt=0,at=0,J=0,ht={...dd},Ot=-1,$t=0,dt=0,W=0,N=0,zt=0,Tt=0,St=0,yt=1,gt=0,Lt=0,U=0,T=0,H=-1,pt=0,tt="none",ot=0,It=!1,Et=-1,bt=!1,Vt=0,xt=0,Pt=1,X=1;return{group:u,boneAtWorld(Y,ct,Bt){const Ft=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:A,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:L.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:L.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:D.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:D.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0}],At=new G,z=new G,_t=new G(Y,ct,Bt),Q=new G;let rt=null,Ct=Number.POSITIVE_INFINITY;for(const wt of Ft){wt.node.updateWorldMatrix(!0,!1),At.set(wt.ax,wt.ay,wt.az),z.set(wt.bx,wt.by,wt.bz),wt.node.localToWorld(At),wt.node.localToWorld(z);const jt=z.x-At.x,ce=z.y-At.y,de=z.z-At.z,ne=jt*jt+ce*ce+de*de;let Se=ne>1e-8?((_t.x-At.x)*jt+(_t.y-At.y)*ce+(_t.z-At.z)*de)/ne:0;Se=Math.max(0,Math.min(1,Se));const me=At.x+jt*Se,an=At.y+ce*Se,gn=At.z+de*Se,ze=(_t.x-me)**2+(_t.y-an)**2+(_t.z-gn)**2;ze<Ct&&(Ct=ze,rt=wt.node,Q.set(me,an,gn))}return rt?{node:rt,point:Q.clone()}:null},update(Y,ct,Bt){const Ft=Bt===void 0||H<0?ct:In(Bt-H,0,.1);Bt!==void 0&&(H=Bt),u.position.set(Y.position.x,Y.position.y,Y.position.z),u.rotation.y=Y.bodyYaw,A.rotation.y=(Y.headYaw-Y.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,Y.mode!==ut&&(ut=Y.mode,mt=1),mt=Math.max(0,mt-ct*2.2);const At=Y.hurt,z=Zm(At,Y.bodyYaw,r),_t=z.flash;et.copy(V).multiplyScalar(_t);for(const fe of _)fe.emissive.copy(B).multiplyScalar(mt*.5),_t>0&&fe.emissive.add(et);h.position.set(0,v,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const Q=Math.hypot(Y.velocity.x,Y.velocity.z),rt=In(o.knockGaitScale??0,0,1),Ct=Y.hurt.knockX*rt,wt=Y.hurt.knockZ*rt,jt=rt>0&&Math.hypot(Y.hurt.knockX,Y.hurt.knockZ)>.001,ce=Y.velocity.x+Ct,de=Y.velocity.z+wt,ne=Math.hypot(ce,de),Se=Math.cos(Y.bodyYaw),me=-Math.sin(Y.bodyYaw),an=Q>1e-6?In((Y.velocity.x*Se+Y.velocity.z*me)/Q,-1,1):0,gn=Q>1e-6?In((Y.velocity.x*Math.sin(Y.bodyYaw)+Y.velocity.z*Math.cos(Y.bodyYaw))/Q,-1,1):1,ze=hd(gn,o.backStrafeStartDeg,o.backStrafeFullDeg);tt==="settled"&&bt&&Vt>xt*1.02+1e-4&&(tt="none");let Le=1;tt==="blend"?(Le=Vm(It?Et:ot,o.stopYawBlendMode,It),It||(ot=Math.min(1,ot+ct/Math.max(.01,o.stopYawAfterSec)),(ot>=1||o.stopYawBlendMode==="inStop"||bt)&&(tt="settled",Le=0))):tt==="settled"&&(Le=In(Q/Math.max(1e-6,o.stopEnterRatio*s),0,1));const xn=Um(an,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),Cn=Ft>1e-6?He(Y.bodyYaw-U)/Ft:0;U=Y.bodyYaw;const rn=(o.hipYawTrackRateDeg??0)*Math.PI/180,$=(o.hipYawBackRateDeg??0)*Math.PI/180,Dt=Ft>1e-6?Ft:ct;T=rn>0?km(T,Dm(Cn),Dt):0;const Ut=Nm(ze,T),Jt=In(Q/.5,0,1),le=Bm(gn,an,xn,Ut)*Le*Jt,he=Im(Lt,le,Om(rn,$,Ut),Dt,T);Lt=he,gt+=(he-gt)*(1-Math.exp(-12*Math.max(0,Dt))),f.rotation.y=gt;const ge=Y.bodyYaw+gt,P=Math.sin(ge),j=Math.cos(ge),it=Math.cos(ge),st=-Math.sin(ge),q=ce*P+de*j,Rt=ce*it+de*st,Ht=Math.max(0,o.stopBlendSec||0),Zt=Ht>0&&!jt,Yt=Hm(Q,pt,s,o.stopEnterRatio,o.stopExitRatio);if(!Zt||Yt.resume)Ot=-1;else if(Ot<0&&Yt.enter){Ot=0,$t=Y.gaitPhase,dt=zm(Y.gaitPhase),W=Q,N=Math.max(Y.stride,1e-6),zt=q,Tt=Rt;const fe=1/Math.max(1e-6,Q);St=Y.velocity.x*fe,yt=Y.velocity.z*fe}const se=pt;pt=Q;const te=Zt&&Ot>=0;te&&(Ot=Math.min(1,Ot+ct/Ht)),te&&tt!=="blend"&&(tt="blend",ot=0),It=te&&Ot<1,Et=Ot,bt=Yt.resume,Vt=Q,xt=se;const Wt=Math.max(0,o.dirFlipSec??0);Wt>0?(Pt=Kr(Pt,q>=0?1:-1,ct,Wt),X=Kr(X,Rt>=0?1:-1,ct,Wt)):(Pt=q>=0?1:-1,X=Rt>=0?1:-1);const ue=te?{phase:$t,speed:W,moveSpeed:s,localForward:zt,localRight:Tt,dirF:Pt,dirR:X,legLength:n.legLength,stride:N,grounded:!0}:{phase:Y.gaitPhase,speed:ne,moveSpeed:s,localForward:q,localRight:Rt,dirF:Pt,dirR:X,legLength:n.legLength,stride:Y.stride,grounded:!0},Qt=te?Fm(ue,o,{progress:Ot,phase0:$t,phaseEnd:dt}):Jr(ue,o);let ve=0,Xe=0,Nt=0,ft=0;if(te){const fe=Xm(Y.bodyYaw,St,yt),Pe=Wm(Ot,$t,fe.forward,fe.right,o);Pe.leadLeft?(Qt.legL.pitchX-=Pe.leadPitch,Qt.legL.kneeX+=Pe.leadKnee,Qt.legR.pitchX+=Pe.trailPitch):(Qt.legR.pitchX-=Pe.leadPitch,Qt.legR.kneeX+=Pe.leadKnee,Qt.legL.pitchX+=Pe.trailPitch),Xe=Pe.bodyShift*Pe.fwdN,ve=Pe.bodyShift*Pe.rightN,Nt=Pe.bodyDip,ft=Pe.chestPitch}R.root.rotation.x=Qt.legL.pitchX,k.root.rotation.x=Qt.legR.pitchX,R.root.rotation.z=Qt.legL.rollZ,k.root.rotation.z=Qt.legR.rollZ,R.joint.rotation.x=Qt.legL.kneeX,k.joint.rotation.x=Qt.legR.kneeX,L.root.rotation.x=Qt.armL,D.root.rotation.x=Qt.armR,L.joint.rotation.x=-.18,D.joint.rotation.x=-.18,h.position.x=Qt.pelvisX,h.position.y=v+Qt.pelvisY,h.position.z=0,h.rotation.z=Qt.pelvisRoll,m.rotation.z=Qt.sideLean*(z.intensity>0?.4:1);const ie=Jm(h,f),oe=te&&d.enabled?{...d,weight:1}:d,Ee=oe.enabled&&oe.weight>0?In(oe.weight,0,1):0;if(h.position.x+=ve,h.position.z+=Xe,h.position.y-=Nt,f.position.y+=Nt,Ee<=0&&(f.position.x-=ve,f.position.z-=Xe),c){const fe=Math.max(.004166666666666667,Math.min(ct,.1)),Pe=Math.sin(Y.bodyYaw),Ve=Math.cos(Y.bodyYaw),un=In((Y.velocity.x-kt)/fe,-60,60),wn=In((Y.velocity.z-Z)/fe,-60,60),Gi=un*Pe+wn*Ve,Us=He(Y.bodyYaw-nt)/fe,Ns=c.maxForwardDeg*Math.PI/180,Xi=c.maxSideDeg*Math.PI/180,ii=1-Math.exp(-Math.max(0,c.smoothing)*fe);lt+=(In(Gi*c.accelGain,-Ns,Ns)-lt)*ii,at+=(In(-Us*Q*c.turnGain,-Xi,Xi)-at)*ii;const Ln=Number.isFinite(c.crouchSmoothing)?c.crouchSmoothing:8;J+=(In(Q/Math.max(s,1e-6),0,1)-J)*(1-Math.exp(-Math.max(0,Ln)*fe));const ai=jm({leanForward:lt,leanSide:at,speedRatio:J},c);m.rotation.x+=lt+ft,m.rotation.z+=at,h.rotation.x+=ai.pelvisPitch,h.rotation.z+=ai.pelvisRoll,h.position.x+=ai.pelvisX,h.position.z+=ai.pelvisZ,h.position.y-=ai.crouch,f.position.y+=ai.crouch*(1-Ee)}kt=Y.velocity.x,Z=Y.velocity.z,nt=Y.bodyYaw,m.rotation.x+=z.upperPitch,m.rotation.z+=z.upperRoll,m.rotation.y+=z.upperYaw;const dn=In(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),Ae=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=In(z.upperShiftX*dn,-Ae,Ae),m.position.z+=In(z.upperShiftZ*dn,-Ae,Ae),h.position.x+=z.comX,h.position.z+=z.comZ-z.pelvisBack,h.position.y-=z.drop;const bn=z.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=z.pelvisBack*(1-bn),f.position.y+=z.drop*(1-bn),R.joint.rotation.x+=z.knee,k.joint.rotation.x+=z.knee,R.root.rotation.x-=z.hip,k.root.rotation.x-=z.hip,L.root.rotation.x+=z.arm,D.root.rotation.x+=z.arm*.8,Y.attackPhase!=="idle"&&z.intensity===0){const fe=Y.attackProgress,Pe=fe<.34?-1:fe<.68?-1+(fe-.34)/.34*2:Math.max(0,1-(fe-.68)/.32),Ve=Math.max(0,-Pe),un=Math.max(0,Pe);D.root.rotation.x=-1.7*Ve+1.25*un,D.joint.rotation.x=-(.25+Ve*.45),m.rotation.y=-.28*Pe,I.opacity=Y.attackPhase==="active"?.85:0,Y.attackPhase==="active"&&(O.rotation.z=-1.1+fe*3)}else I.opacity=0;const Re=Gm(gt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=Re,A.rotation.y=(Y.headYaw-Y.bodyYaw-Re+Math.PI*3)%(Math.PI*2)-Math.PI,ht=Qm({root:u,pelvis:h,lower:f,limbs:C,base:ie,cfg:oe,grounded:!0,attacking:Y.attackPhase!=="idle"})},ik(){return ht},dispose(){u.traverse(Y=>{if(Y instanceof be){Y.geometry.dispose();const ct=Y.material;Array.isArray(ct)?ct.forEach(Bt=>Bt.dispose()):ct.dispose()}})}}}const IA=9.81;function lo(n,t,e){return n<t?t:n>e?e:n}function zA(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:IA,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,c=0,l=0,d=0;for(const b of n){const M=Number.isFinite(b.mass)&&b.mass>0?b.mass:0;!Number.isFinite(b.x)||!Number.isFinite(b.y)||!Number.isFinite(b.z)||(r+=M,c+=b.x*M,l+=b.y*M,d+=b.z*M)}if(r<=1e-6)return o;c/=r,l/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:c,comY:l,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=lo((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,l)/s)*g*4,v=c+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,y=Math.abs(v-f)/u,w=Math.abs(x-m)/h,S=lo(1-Math.max(y,w),0,1),E=Math.max(0,Math.abs(v-f)-u),A=Math.max(0,Math.abs(x-m)-h);return{comX:c,comY:l,comZ:d,xcomX:v,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:lo(1-y,-1,1),marginZ:lo(1-w,-1,1),score:S,leanDeg:Math.atan2(v-f,x-m)*180/Math.PI,side:y>.98?v>f?1:-1:0,overX:E,overZ:A,grounded:!0}}function FA(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function UA(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=lo(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const Lh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},NA=1e-6;function $n(n,t,e){return n<t?t:n>e?e:n}function yl(n,t){const e=Math.max(.2,n);return $n(Math.pow(e,-t),.5,2)}function OA(n,t){if(!t.enabled)return{...Lh};const e=$n(n.swing,-1,1),i=$n(n.charge,0,1),a=$n(n.impact,0,1),s=$n(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),c=1+(Math.max(1,t.swingArm)-1)*r,l=Math.max(0,-e),d=$n(t.chargeArm,.6,1),u=1-(1-d)*l,h=1-(1-d)*i;let f=1;o>0?f=c:l>0?f=u:i>0&&(f=h);const m=1-$n(t.impactSquash,0,.6)*a;f*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-$n(t.impactSquash,0,.6)*a*.6),v=$n(t.torsoGain,0,1),x=1+(f-1)*v;return f=$n(f,.6,1.6),{arm:f,leg:$n(p,.6,1.4),torso:$n(x,.7,1.4),girthArm:yl(f,t.volumeExp),girthLeg:yl(p,t.volumeExp),girthTorso:yl(x,t.volumeExp)}}function BA(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function HA(n,t,e){const i=n*Math.exp(-Math.max(NA,e)*Math.max(0,t));return i<.001?0:$n(i,0,1)}const Kf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function ws(n,t,e){return n<t?t:n>e?e:n}function Be(n,t,e){return n+(t-n)*e}function GA(n){return n?typeof n=="string"?{clip:n}:n:null}function XA(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function VA(n,t){const e=n%3*2,i=Kf[e],a=Kf[e+1];return{...XA(),bodyYaw:Be(i.yaw,a.yaw,t),bodyPitch:Be(i.pitch,a.pitch,t),bodyRoll:Be(i.roll,a.roll,t),pelvisX:Be(i.px,a.px,t),pelvisZ:Be(i.pz,a.pz,t),armPitch:Be(i.ap,a.ap,t),armYaw:Be(i.ay,a.ay,t),armRoll:Be(i.ar,a.ar,t),elbow:Be(i.el,a.el,t),bladePitch:Be(i.blade,a.blade,t)}}function WA(n,t,e,i,a=0){var b,M,R;const s=((b=i.combo)==null?void 0:b[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,c=GA(s[r]),l=c?((M=i.clips)==null?void 0:M[c.clip])??null:null,d=ws(((R=i.weaponScale)==null?void 0:R[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=c&&Number.isFinite(c.scale)?c.scale:d,f=h*u,m=ws((e+1)/2,0,1),_=l&&l.keys.length>0?Jx(l,m):VA(r,m),g=((c==null?void 0:c.lead)??(l==null?void 0:l.lead)??"R")==="L"?"L":"R",p=(l==null?void 0:l.kind)??["right-left","left-right","overhead"][r]??"custom",v=n==="dual-swords",x=l&&ma(l,"bladeTwistOff")?_.bladeTwistOff:v?_.bladeTwist:0,y=l&&ma(l,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:Qx(l,ws(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:l&&ma(l,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:c&&Number.isFinite(c.blend)?c.blend:null},S={pitch:_.armPitch*h,yaw:_.armYaw*h,roll:_.armRoll*h,elbow:_.elbow*h},E=l?ma(l,"armLPitch")||ma(l,"armLYaw")||ma(l,"armLRoll")||ma(l,"elbowL"):!1,A=E?{pitch:_.armLPitch*h,yaw:_.armLYaw*h,roll:_.armLRoll*h,elbow:_.elbowL*h}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:A):(w.armR=S,(n==="greatsword"||n==="dual-swords"||E)&&(w.armL=A)),w}function YA(n,t,e){const i=ws(e,0,1),a=(s,o)=>s?o?{pitch:Be(s.pitch,o.pitch,i),yaw:Be(s.yaw,o.yaw,i),roll:Be(s.roll,o.roll,i),elbow:Be(s.elbow,o.elbow,i)}:null:o;return{yaw:Be(n.yaw,t.yaw,i),rootYaw:Be(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Be(n.pitch,t.pitch,i),roll:Be(n.roll,t.roll,i),pelvisZ:Be(n.pelvisZ,t.pelvisZ,i),pelvisX:Be(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Be(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Be(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Be(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Be(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Be(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Be(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Be(n.strike,t.strike,i),blend:t.blend??null}}function $A(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Jf(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function ZA(n,t){const e=(a,s)=>Math.abs($A(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=Jf(n.armR,t.armR),i+=Jf(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function jA(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),c=Math.max(.1,e.segBlendRef??6),l=ws(ZA(n,t)/c,0,1);return o+(r-o)*l}function Qf(n){const t=ws(n,0,1);return t*t*(3-2*t)}function Ge(n,t,e,i){const a=new be(new qn(n,t,e),new Na({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function qe(){return new ke}function Ir(n,t,e){const i=qe(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const c=Ge(t*.3,.09,t*.45,e.blade);return c.position.y=.13+n+.045,i.add(c),i}function qA(n){const t=Ir(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function KA(n){const t=qe(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function JA(n){const t=qe(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ee(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function QA(n){const t=qe();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function t2(n){const t=qe(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function xe(n,t,e){return n<t?t:n>e?e:n}const zi=1e-6;function t0(n,t,e,i,a,s,o,r,c,l,d,u,h){const f=l??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=c.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=c.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},v=qe(),x=qe();x.name="pelvis",x.position.y=n.legLength,v.add(x);const y=qe();y.name="lower";const w=qe();w.name="upper",x.add(y),x.add(w);const S=n.headSize,E=n.legLength,A=n.armLength,b=n.limbThickness,M=n.bodyHeight,R=n.bodyWidth,k=c.spine,L=!!(k!=null&&k.enabled),D=L?xe(k.chestPivot??.42,.15,.85)*M:0,C=qe();C.name="chest",C.position.y=D,w.add(C);const I=L?C:w;let O,B=null,V=M,et=0;L?(V=Math.max(.05,D),et=Math.max(.05,M-D),O=Ge(R,V,.28,t.body),O.name="torsoLower",O.position.y=V/2,w.add(O),B=Ge(R+.008,et,.288,t.body),B.name="torsoUpper",B.position.y=et/2,C.add(B)):(O=Ge(R,M,.28,t.body),O.name="torso",O.position.y=M/2,w.add(O));const ut=qe();ut.name="headPivot",ut.rotation.order="YXZ",ut.position.y=Math.min(i.headPivotHeight,M)-D,I.add(ut);const mt=Ge(S,S,S,t.head);mt.position.y=S/2,ut.add(mt);const kt=new Na({color:"#1b2733"});for(const F of[-1,1]){const K=new be(new qn(.06,.07,.02),kt);K.position.set(F*.09,S/2+.03,S/2+.011),ut.add(K)}const Z=F=>{const K=qe();K.name=F<0?"hipL":"hipR",K.rotation.order="ZYX",K.position.set(F*(R/2-b/2),0,0),y.add(K);const vt=Ge(b,E/2,b,t.limb);vt.position.y=-E/4,K.add(vt);const Mt=qe();Mt.name="knee",Mt.position.y=-E/2,K.add(Mt);const qt=Ge(b,E/2,b,t.limb);qt.position.y=-E/4,Mt.add(qt);const Kt=Ge(b*1.15,.07,b*1.7,t.shoe);Kt.position.set(0,-E/2+.035,.045),Mt.add(Kt);const re=new Je;re.name="footTip",re.position.y=-E/2,Mt.add(re);const we=qe();return{root:K,joint:Mt,hand:we,wrist:we,tip:re,upperMesh:vt,lowerMesh:qt,segLen:E/2}},nt=F=>{const K=qe();K.name=F<0?"shoulderL":"shoulderR",K.rotation.order="YXZ",K.position.set(F*(R/2+b/2),M-.04-D,0),I.add(K);const vt=Ge(b,A/2,b,t.limb);vt.position.y=-A/4,K.add(vt);const Mt=qe();Mt.name="elbow",Mt.position.y=-A/2,K.add(Mt);const qt=Ge(b,A/2,b,t.limb);qt.position.y=-A/4,Mt.add(qt);const Kt=qe();Kt.name=F<0?"handL":"handR",Kt.position.y=-A/2,Mt.add(Kt);const re=Ge(b*1.1,.09,b*1.1,t.head);re.position.y=.045,Kt.add(re);const we=qe();return we.name=F<0?"wristL":"wristR",Kt.add(we),{root:K,joint:Mt,hand:Kt,wrist:we,upperMesh:vt,lowerMesh:qt,segLen:A/2}},lt=Z(-1),at=Z(1),J=nt(-1),ht=nt(1),Ot=[lt,at].map(F=>({root:F.root,joint:F.joint,tip:F.tip,upperLen:E/2,lowerLen:E/2,bend:1})),$t=qe(),dt=qe();$t.name="mountR",dt.name="mountL";const W=qe(),N=qe();W.name="gripR",N.name="gripL",ht.wrist.add($t),J.wrist.add(dt),$t.add(W),dt.add(N);const zt=JA(t),Tt=QA(t),St=t2(t),yt={"sword-shield":{right:Ir(.42,.075,t),left:KA(t)},"dual-swords":{right:Ir(.42,.075,t),left:Ir(.42,.075,t)},greatsword:{right:qA(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:zt.g,left:qe(),orb:zt.orb},bow:{right:St,left:Tt.g,arrow:St,drawString:Tt.drawString}};for(const F of Object.keys(yt))W.add(yt[F].right),N.add(yt[F].left),yt[F].right.visible=!1,yt[F].left.visible=!1;function gt(F,K,vt){const Mt=new Je;Mt.name="bladeBase",Mt.position.y=K,F.add(Mt);const qt=new Je;qt.name="bladeTip",qt.position.y=vt,F.add(qt)}gt(yt["sword-shield"].right,.44,.55),gt(yt["dual-swords"].right,.44,.55),gt(yt["dual-swords"].left,.44,.55),gt(yt.greatsword.right,.74,.88),gt(yt.staff.right,.78,.92);let Lt=null,U=null,T=1,H=0,pt=0,tt=null,ot=0,It=0,Et=0,bt=0,Vt=0,xt=0,Pt=PA(),X={...dd},Y=0,ct=0,Bt=0,Ft=0,At=0,z=-1,_t=-1,Q=0,rt=0,Ct=0,wt=0,jt=0,ce=0,de=0,ne=1,Se=0,me=0,an=0,gn=0,ze=!1,Le=0,xn=-1,Cn=0,rn=0,$=0,Dt=!1,Ut=0,Jt=0,le=0,he=0,ge="none",P=0,j=1,it=!1,st=-1,q=!1,Rt=0,Ht=0,Zt=0,Yt={...Lh},se=0,te=0,Wt={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},ue=NaN,Qt=0,ve=0,Xe=0,Nt=NaN,ft=NaN,ie=-1,oe=null,Ee=null,dn=0,Ae=1,bn=.1,Re=null,fe={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Pe=null,Ve=null,un=null,wn=null,Gi=null,Us=null,Ns="R",Xi=0,ii=0,Ln=0,ai=0,pd=1,fi=0,Io=null,da=0,md=0,hc=NaN,gd=NaN,zo={speed:0,phase:0},ua=1,fa=1,Os={lp:0,lr:0,rp:0,rr:0},a0=0,dc=0,uc=!0,fc=0,Bs="none",Ha=0,Ga=0,Xa=0,Fo=.3,xd=0;function s0(F){const K=Math.PI/180,vt=s;let Mt=0,qt=0,Kt=0,re=0;F==="sword-shield"?(Mt=vt.swordPitchDeg*K,Kt=vt.shieldPitchDeg*K):F==="dual-swords"?(Mt=vt.swordPitchDeg*K,Kt=vt.swordPitchDeg*K):F==="greatsword"?(Mt=vt.greatswordPitchDeg*K,Kt=vt.greatswordPitchDeg*K):F==="staff"?Mt=vt.staffPitchDeg*K:Kt=vt.bowPitchDeg*K,$t.rotation.set(Mt,0,qt),dt.rotation.set(Kt,0,re),$t.position.x=F==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function vd(F){if(F!==Lt){Lt=F;for(const K of Object.keys(yt))yt[K].right.visible=K===F,yt[K].left.visible=K===F;s0(F),Tt.drawString.position.z=-.06,St.position.z=0,zt.orb.scale.setScalar(1),w.rotation.y=0}}vd("sword-shield");const yd=[];v.traverse(F=>{F instanceof be&&F.material instanceof Na&&yd.push(F.material)});const o0=new ee(r.flashColor);function r0(F,K){const vt=Zm(F,K,r);Pt=vt,w.rotation.x+=vt.upperPitch,w.rotation.z+=vt.upperRoll,w.rotation.y+=vt.upperYaw;const Mt=xe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),qt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=xe(vt.upperShiftX*Mt,-qt,qt),w.position.z+=xe(vt.upperShiftZ*Mt,-qt,qt),x.position.x+=vt.comX,x.position.z+=vt.comZ-vt.pelvisBack,x.position.y-=vt.drop;const Kt=vt.legacy?0:xe(r.lowerScale,0,1);y.position.z+=vt.pelvisBack*(1-Kt),y.position.y+=vt.drop*(1-Kt),lt.joint.rotation.x+=vt.knee,at.joint.rotation.x+=vt.knee,lt.root.rotation.x-=vt.hip,at.root.rotation.x-=vt.hip,J.root.rotation.x+=vt.arm,ht.root.rotation.x+=vt.arm*.8;for(const re of yd)re.emissive.copy(o0).multiplyScalar(vt.flash)}function Uo(F){return F<.22?-1:F<.42?-1+(F-.22)/.2*2:F<.5?1:Math.max(0,1-(F-.5)/.5)}function c0(F){for(const K of[J,ht])K.upperMesh.scale.set(F.girthArm,F.arm,F.girthArm),K.upperMesh.position.y=-K.segLen/2*F.arm,K.joint.position.y=-K.segLen*F.arm,K.lowerMesh.scale.set(F.girthArm,F.arm,F.girthArm),K.lowerMesh.position.y=-K.segLen/2*F.arm,K.hand.position.y=-K.segLen*F.arm;for(const K of[lt,at])K.upperMesh.scale.set(F.girthLeg,F.leg,F.girthLeg),K.upperMesh.position.y=-K.segLen/2*F.leg,K.joint.position.y=-K.segLen*F.leg,K.lowerMesh.scale.set(F.girthLeg,F.leg,F.girthLeg),K.lowerMesh.position.y=-K.segLen/2*F.leg,K.tip.position.y=-K.segLen*F.leg;O.scale.set(F.girthTorso,F.torso,F.girthTorso),O.position.y=V/2*F.torso,B&&(B.scale.set(F.girthTorso,F.torso,F.girthTorso),B.position.y=et/2*F.torso,C.position.y=V*F.torso)}function l0(F,K){const vt=s.twoHandGripY??-.16,Mt=Math.max(1,s.twoHandMaxStretch??1.25),qt=A*Mt*.99,Kt=J.root.position.x,re=J.root.position.y,we=J.root.position.z,We=J.root.rotation.y,ye=Math.cos(We),sn=Math.sin(We),je=Ri=>{const Xs=$t.localToWorld(new G(0,Ri,0)),Vs=(L?C:w).worldToLocal(Xs),Ws=Vs.x-Kt,Nn=Vs.y-re,Va=Vs.z-we,Wa={x:Ws*ye-Va*sn,y:Nn,z:Ws*sn+Va*ye};return{t:Wa,dist:Math.hypot(Wa.x,Wa.y,Wa.z)}};let Ye=vt,Te=je(Ye);if(!Number.isFinite(Te.dist)||Te.dist<=zi)return;for(let Ri=0;Ri<18&&Te.dist>qt;Ri++)if(Ye*=.78,Te=je(Ye),!Number.isFinite(Te.dist)||Te.dist<=zi)return;Number.isFinite(ue)||(ue=Ye);const tn=Math.max(0,s.twoHandSlideRate??9);ue+=(Ye-ue)*(1-Math.exp(-tn*K));const on=je(ue),fn=on.t,Hn=on.dist,Gn=Hn/Math.max(zi,A),Kn=xe(Gn,1,Mt),pi=Math.max(1,s.twoHandGripStart??1.02),Vi=Math.max(pi+.001,Mt),Wi=xe(s.twoHandMinGrip??1,0,1),Xn=xe((Gn-pi)/(Vi-pi),0,1),mi=1-Xn*Xn*(3-2*Xn)*(1-Wi),Vn=A/2*Kn,Gs=qm(fn,Vn,Vn,-1),Yi=Km({rootPitch:J.root.rotation.x,rootRoll:J.root.rotation.z,jointPitch:J.joint.rotation.x},Gs,xe(F*mi,0,1),Math.PI);J.root.rotation.x=Yi.rootPitch,J.root.rotation.z=Yi.rootRoll,J.joint.rotation.x=Math.min(Yi.jointPitch,-.06);const Jn=1/Math.sqrt(Kn);J.upperMesh.scale.set(Jn,Kn,Jn),J.upperMesh.position.y=-Vn/2,J.joint.position.y=-Vn,J.lowerMesh.scale.set(Jn,Kn,Jn),J.lowerMesh.position.y=-Vn/2,J.hand.position.y=-Vn,Wt={active:!0,dist:Hn,gy:ue,pitch:Yi.rootPitch,joint:J.joint.rotation.x,grip:mi}}function h0(F,K){if(!m.enabled){Qt=0,ve=0,ht.wrist.rotation.set(0,0,0),Nt=ht.root.rotation.x,ft=wd();return}const vt=ht.root.rotation.x,Mt=wd();if(K!==ie){ie=K,Nt=vt,ft=Mt,ht.wrist.rotation.set(Qt,0,ve);return}if(!Number.isFinite(Nt)||F<=1e-5){Nt=vt,ft=Mt,ht.wrist.rotation.set(Qt,0,ve);return}const qt=(vt-Nt)/F,Kt=He(Mt-ft)/F;Nt=vt,ft=Mt;const re=Math.max(0,m.maxAngle),we=Math.max(0,m.maxTwist),We=.15+.85*xe(ii,0,1),sn=-xe(Xe,0,1.4)*Math.max(0,m.runDrag),je=xe(-qt*m.lag*We+sn,-re,re),Ye=xe(Kt*m.twistLag*We,-we,we),Te=1-Math.exp(-Math.max(0,m.rate)*F);Qt+=(je-Qt)*Te,ve+=(Ye-ve)*Te,ht.wrist.rotation.set(Qt,0,ve)}function d0(F){const K=Math.PI/180;return F==="greatsword"?s.greatswordPitchDeg*K:F==="staff"?s.staffPitchDeg*K:F==="bow"?s.bowPitchDeg*K:s.swordPitchDeg*K}function pc(F){const K=Math.PI/180;return F==="sword-shield"?s.shieldPitchDeg*K:F==="greatsword"?s.greatswordPitchDeg*K:F==="bow"?s.bowPitchDeg*K:s.swordPitchDeg*K}function u0(F){const K=Math.PI/180;return F==="sword-shield"||F==="dual-swords"?(s.swordCantDeg??0)*K:F==="greatsword"?(s.greatswordCantDeg??0)*K:0}function f0(F,K){const vt=F.weapon;if(vt==="staff"||vt==="bow")return;const Mt=Ns==="R",qt=Mt?ht:J,Kt=Mt?$t:dt,re=Mt?J:ht,we=Mt?dt:$t,We=vt==="greatsword"&&Mt?xt:0,ye=vt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,sn=Math.PI/180,je=-ye*sn,Ye=ye*sn,Te=(Xn,mi)=>{const Vn=Math.max(0,Math.PI/2-Math.abs(mi));return Math.sign(Xn)*Math.min(Math.abs(Xn),Vn)},tn=(Pe??d0(vt)+H)+We,on=K+qt.root.rotation.x+qt.joint.rotation.x;Kt.rotation.set(Math.PI/2-tn-on,0,Te(Mt?je:Ye,tn));const fn=Ve??(vt==="sword-shield"?null:pc(vt)+pt),Hn=K+re.root.rotation.x+re.joint.rotation.x;vt==="sword-shield"?we.rotation.x=fn===null?pc(vt):pc(vt)-fn-Hn:we.rotation.set(Math.PI/2-(fn??0)-Hn,0,Te(Mt?Ye:je,fn??0));const Gn=u0(vt),Kn=Gi??0,pi=Us??0,Vi=un??0,Wi=wn??0;Mt?(W.rotation.z=-Gn+Kn,W.rotation.y=Vi,N.rotation.z=Gn+pi,N.rotation.y=Wi):(N.rotation.z=Gn+Kn,N.rotation.y=Vi,W.rotation.z=-Gn+pi,W.rotation.y=Wi)}function _d(F){Pe=F.bladePitch,Ve=F.bladePitchOff,un=F.bladeTwist,wn=F.bladeTwistOff,Gi=F.bladeYaw,Us=F.bladeYawOff,Ns=F.lead,Xi=F.rootYaw+F.spinYaw,v.rotation.y=Xi,w.rotation.y+=F.yaw,w.rotation.x+=F.pitch,w.rotation.z+=F.roll,x.position.z+=F.pelvisZ,x.position.x+=F.pelvisX,F.armR&&(ht.root.rotation.x=F.armR.pitch,ht.root.rotation.y=F.armR.yaw,ht.root.rotation.z=F.armR.roll,ht.joint.rotation.x=F.armR.elbow),F.armL&&(J.root.rotation.x=F.armL.pitch,J.root.rotation.y=F.armL.yaw,J.root.rotation.z=F.armL.roll,J.joint.rotation.x=F.armL.elbow)}function Md(F,K){const vt=Re??Uo(F.attackProgress),Mt=WA(F.weapon,F.comboIndex,vt,p,F.attackProgress);if(F.comboIndex!==dn){Ee=oe,Ae=0,dn=F.comboIndex;const re=F.timings.windup+F.timings.active+F.timings.recovery,we=Math.max(p.segBlendMin??.03,re*.22);bn=jA(Ee,Mt,p,Mt.blend??null,we)}const qt=Math.max(.008,bn);Ae=Math.min(1,Ae+K/qt);const Kt=Ee&&Ae<1?YA(Ee,Mt,Qf(Ae)):Mt;return oe=Kt,Kt}function p0(F,K){const vt=R/2+b/2,Mt=M-.04-D;if(!p.enabled){J.root.position.set(-vt,Mt,0),ht.root.position.set(vt,Mt,0),fe={lx:-vt,ly:Mt,lz:0,rx:vt,ry:Mt,rz:0};return}const qt=Math.max(0,p.shoulderLift),Kt=Math.max(0,p.shoulderPush),re=F&&K==="greatsword"?Math.max(0,p.shoulderIn):0,we=on=>qt*xe((-on-.5)/1.45,0,1),We=on=>Kt*xe((-on-.2)/1.9,0,1),ye=-vt+re,sn=Mt+we(J.root.rotation.x),je=We(J.root.rotation.x),Ye=vt-re,Te=Mt+we(ht.root.rotation.x),tn=We(ht.root.rotation.x);J.root.position.set(ye,sn,je),ht.root.position.set(Ye,Te,tn),fe={lx:ye,ly:sn,lz:je,rx:Ye,ry:Te,rz:tn}}function m0(F,K,vt){if(F.phase==="idle"||F.charging){Cn=0,rn=0,$=0;return}const Mt=F.attackProgress,qt=Uo(Mt),Kt=Math.max(0,qt),re=c.stride,we=Number.isFinite(re.stepReach)?re.stepReach:.17,We=Number.isFinite(re.stepSideReach)?re.stepSideReach:.14,ye=Number.isFinite(re.stepDipReach)?re.stepDipReach:.05,sn=F.weapon==="greatsword"?xe(Number.isFinite(re.heavyScale)?re.heavyScale:1,0,1):1,je=1-Math.exp(-12*Math.max(0,vt));Cn+=(we*Kt*sn-Cn)*je,rn+=(K*We*Kt*sn-rn)*je,$+=(ye*Math.sin(Math.PI*Mt)*sn-$)*je,x.position.z+=Cn,x.position.x+=rn,x.position.y-=$}let bd=null;function g0(){bd={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:J.root.rotation.x,lry:J.root.rotation.y,lrz:J.root.rotation.z,lj:J.joint.rotation.x,rrx:ht.root.rotation.x,rry:ht.root.rotation.y,rrz:ht.root.rotation.z,rj:ht.joint.rotation.x,rootY:v.rotation.y}}function x0(F){const K=bd;if(!K)return;const vt=Qf(xe(F,0,1));if(vt>=1)return;const Mt=(qt,Kt)=>qt+(Kt-qt)*vt;w.rotation.x=Mt(K.upperX,w.rotation.x),w.rotation.y=Mt(K.upperY,w.rotation.y),w.rotation.z=Mt(K.upperZ,w.rotation.z),w.position.x=Mt(K.upperPX,w.position.x),w.position.z=Mt(K.upperPZ,w.position.z),x.position.x=Mt(K.pelvisX,x.position.x),x.position.y=Mt(K.pelvisY,x.position.y),x.position.z=Mt(K.pelvisZ,x.position.z),x.rotation.x=Mt(K.pelvisRX,x.rotation.x),x.rotation.z=Mt(K.pelvisRZ,x.rotation.z),J.root.rotation.x=Mt(K.lrx,J.root.rotation.x),J.root.rotation.y=Mt(K.lry,J.root.rotation.y),J.root.rotation.z=Mt(K.lrz,J.root.rotation.z),J.joint.rotation.x=Mt(K.lj,J.joint.rotation.x),ht.root.rotation.x=Mt(K.rrx,ht.root.rotation.x),ht.root.rotation.y=Mt(K.rry,ht.root.rotation.y),ht.root.rotation.z=Mt(K.rrz,ht.root.rotation.z),ht.joint.rotation.x=Mt(K.rj,ht.joint.rotation.x),v.rotation.y=K.rootY+He(v.rotation.y-K.rootY)*vt,Xi=v.rotation.y}let Hs=null,mc=0,Sd=0;function v0(){if(!L)return;const F=k,K=Math.max(0,F.waist??1),vt=Math.max(0,F.chest??0),Mt=K+vt,qt=Mt>1e-6?K/Mt:1,Kt=Mt>1e-6?vt/Mt:0,re=w.rotation.x,we=w.rotation.y,We=w.rotation.z;w.rotation.set(re*qt,we*qt,We*qt),C.rotation.set(re*Kt,we*Kt,We*Kt);const ye=xe(F.neck??0,0,1);ye>0&&(ut.rotation.x-=re*ye),Hs={x:re,y:we,z:We}}function No(){return{yaw:w.rotation.y+(L?C.rotation.y:0),pitch:w.rotation.x+(L?C.rotation.x:0),lean:w.rotation.z+(L?C.rotation.z:0)}}function wd(){return No().yaw}function y0(F,K){if(!(h!=null&&h.enabled)){Io=null,da=0;return}v.updateWorldMatrix(!0,!0);const vt=new G,Mt=[],qt=(Jn,Ri,Xs=0)=>{Jn.getWorldPosition(vt),Mt.push({x:vt.x,y:vt.y+Xs,z:vt.z,mass:Ri})},Kt=n.headSize;qt(ut,.08,Kt/2),qt(O,.14),qt(B??C,.24),qt(x,.12),qt(J.hand,.05),qt(ht.hand,.05),qt(lt.joint,.15),qt(at.joint,.15);const re=Lt?Oo(yt[Lt].right):null;re&&Mt.push({x:(re.base.x+re.tip.x)/2,y:(re.base.y+re.tip.y)/2,z:(re.base.z+re.tip.z)/2,mass:Lt==="greatsword"?.09:.04});const we=Math.max(.05,n.limbThickness*1.15/2+.015),We=Math.max(.06,n.limbThickness*1.7/2+.02);let ye=1/0,sn=-1/0,je=1/0,Ye=-1/0,Te=0;for(const Jn of[lt,at])Jn.tip.getWorldPosition(vt),vt.y<=.13&&(Te+=1),ye=Math.min(ye,vt.x-we),sn=Math.max(sn,vt.x+we),je=Math.min(je,vt.z-We),Ye=Math.max(Ye,vt.z+We);(!Number.isFinite(ye)||Te===0)&&(ye=sn=je=Ye=0);let tn=0,on=0;Number.isFinite(hc)&&K>1e-5&&(tn=xe((F.position.x-hc)/K,-20,20),on=xe((F.position.z-gd)/K,-20,20)),hc=F.position.x,gd=F.position.z;const fn=zA(Mt,{minX:ye,maxX:sn,minZ:je,maxZ:Ye},tn,on,h);if(Io=fn,!h.autoCounter){da=0;return}const Hn=Math.cos(F.bodyYaw),Gn=-Math.sin(F.bodyYaw),Kn=fn.xcomX-fn.centerX,pi=fn.xcomZ-fn.centerZ,Vi=Kn*Hn+pi*Gn,Wi=tn*Hn+on*Gn,Xn=fn.grounded?FA(Vi,Wi,h.predLead??0):0;Sd=Xn;const mi=Math.abs(Xn)-.45*fn.halfX;md=mi;let Vn=0;mi>.002&&fn.grounded&&(Vn=-Math.sign(Xn)*Math.min(Math.max(.005,h.maxShift??.045),(mi+.002)*1.1666666666666667));const Gs=Math.abs(Xn)/Math.max(1e-4,fn.halfX),Yi=Math.max(.1,UA(h.counterRate,Gs,h.counterBoost??0));da+=(Vn-da)*(1-Math.exp(-Yi*K))}function _0(F,K){if(Tt.drawString.position.z=-.06,St.position.z=0,zt.orb.scale.setScalar(1),w.rotation.y=0,F.charging&&F.weapon==="bow"){const Kt=F.charge;J.root.rotation.x=-1.25,J.joint.rotation.x=-.15,ht.root.rotation.x=.35+Kt*.3,ht.joint.rotation.x=-1.15,Tt.drawString.position.z=-.06-Kt*.22,St.position.z=-Kt*.3,w.rotation.y=-.22;return}if(F.phase==="idle"&&Ln<=.001){Ee=null,oe=null,dn=0,Ae=1,bn=Math.max(.008,p.segBlend),Pe=null,Ve=null,un=null,wn=null,Gi=null,Us=null,ue=NaN,F.weapon==="greatsword"&&($t.position.x=-Math.max(0,s.twoHandInsetX??0));return}const vt=Uo(F.attackProgress),Mt=Math.max(0,-vt),qt=Math.max(0,vt);if(F.weapon==="bow")J.root.rotation.x=-1.2,J.joint.rotation.x=-.15,ht.root.rotation.x=.9-qt*.8,ht.joint.rotation.x=-.3;else if(F.weapon==="greatsword")if(p.enabled)_d(Md(F,K));else{const Kt=-1.6*Mt+1.25*qt,re=xe(Number.isFinite(c.stride.heavyScale)?c.stride.heavyScale:1,0,1);ht.root.rotation.x=Kt,ht.joint.rotation.x=-(.25+Mt*.4),J.root.rotation.x=Kt+.06,J.joint.rotation.x=-(.32+Mt*.4),J.root.rotation.z=.42,ht.root.rotation.z=0;const we=-Math.sin(ht.root.rotation.x);ht.root.rotation.y=-.72*Math.tanh(we*4),w.rotation.y=-.2*vt*re}else if(p.enabled)_d(Md(F,K));else{const Kt=F.comboIndex;if(Kt===1)ht.root.rotation.x=-1.7*Mt+1.1*qt,ht.joint.rotation.x=-(.2+Mt*.5),J.root.rotation.x=.1,w.rotation.y=-.18*vt;else if(Kt===2)J.root.rotation.x=-1.5*Mt+1*qt,J.joint.rotation.x=-(.2+Mt*.5),ht.root.rotation.x=.2,w.rotation.y=.45*-vt;else{const re=-1.9*Mt+1.2*qt;J.root.rotation.x=re,ht.root.rotation.x=re,J.joint.rotation.x=-(.15+Mt*.4),ht.joint.rotation.x=-(.15+Mt*.4),w.rotation.y=-.3*vt}}if(F.weapon==="greatsword"){const Kt=xe((-ht.root.rotation.x-1.3)/1.2,0,1);$t.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Kt)}m0(F,Le%2===0?1:-1,K)}function M0(F,K){F&&(ht.root.rotation.x=-1.05,ht.joint.rotation.x=-.35,J.root.rotation.x=-.45,J.joint.rotation.x=-.2,w.rotation.y=-.12,zt.orb.scale.setScalar(1.25+.12*Math.sin(K*2)))}function b0(F){if(!F||F.phase==="idle")return;const K=F.progress,vt=K<.3?-.35+K/.3*1.35:K<.7?1:Math.max(0,1-(K-.7)/.3),Mt=Math.PI/180;w.rotation.x+=_.leanDeg*Mt*vt,J.root.rotation.x-=_.shieldPitchDeg*Mt*vt,J.joint.rotation.x-=.22*vt,ht.root.rotation.x-=.3*vt,x.position.z+=_.pelvisReach*Math.max(0,vt)}function Oo(F){if(!F)return null;const K=F.getObjectByName("bladeBase"),vt=F.getObjectByName("bladeTip");if(!K||!vt)return null;F.updateWorldMatrix(!0,!1);const Mt=K.getWorldPosition(new G),qt=vt.getWorldPosition(new G),Kt=new G().setFromMatrixColumn(F.matrixWorld,0).normalize();return{base:{x:Mt.x,y:Mt.y,z:Mt.z},tip:{x:qt.x,y:qt.y,z:qt.z},normal:{x:Kt.x,y:Kt.y,z:Kt.z}}}return{group:v,update(F,K,vt,Mt,qt=!1,Kt,re,we){var Od;vd(K.weapon);const We=Kt===void 0||z<0?Mt:xe(Kt-z,0,.1);Kt!==void 0&&(z=Kt),v.rotation.y=0,Xi=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=E,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,C.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const ye=Math.max(1/240,Math.min(Mt,.1));tt=((Od=c.stance)==null?void 0:Od[K.weapon])??null,U!==K.weapon&&(U=K.weapon,T=tt?0:1);const sn=Math.max(.01,(tt==null?void 0:tt.blend)??.22);T=Math.min(1,T+ye/sn);const je=tt?T:0;H=((tt==null?void 0:tt.bladePitchDeg)??0)*Math.PI/180*je,pt=((tt==null?void 0:tt.bladePitchOffDeg)??0)*Math.PI/180*je;const Ye=Kt===void 0?a0+=Mt:Kt;dc=Ye;const Te=c.landing;Te.enabled?uc&&!F.grounded?(Bs="jump",Ha=Ye,Ga=Te.anticipationDuration,Xa=Math.max(0,Te.jumpAnticipation),Fo=.32):!uc&&F.grounded&&(Bs="land",Ha=Ye,Ga=Te.duration,Xa=RA(fc,Te),Fo=Te.compressRatio,xd=fc):(Bs="none",Xa=0),Ye<Ha&&(Bs="none",Xa=0),uc=F.grounded,fc=F.velocity.y;const tn=qf(Ye,Ha,Ga,Xa,Fo),on=K.phase!=="idle",fn=(we==null?void 0:we.phase)==="active";ii=wA(ii,on,ye,c.attack.blendRate);const Hn=EA(ii,c.attack.gaitWeight,c.attack.lowerBodyWeight);ai=Hn.attackLegWeight,pd=Hn.gaitScale;const Gn=Math.sin(F.bodyYaw),Kn=Math.cos(F.bodyYaw),pi=(F.velocity.x-ot)/ye,Vi=(F.velocity.z-It)/ye,Wi=xe(pi,-60,60),Xn=xe(Vi,-60,60),mi=Wi*Gn+Xn*Kn,Vn=He(F.bodyYaw-Et)/ye,Gs=We>1e-6?He(F.bodyYaw-Et)/We:0,Yi=Math.hypot(F.velocity.x,F.velocity.z),Jn=o.maxForwardDeg*Math.PI/180,Ri=o.maxSideDeg*Math.PI/180,Xs=xe(mi*o.accelGain,-Jn,Jn),Vs=xe(-Vn*Yi*o.turnGain,-Ri,Ri),Ws=1-Math.exp(-o.smoothing*ye);bt+=(Xs-bt)*Ws,Vt+=(Vs-Vt)*Ws,ot=F.velocity.x,It=F.velocity.z,Et=F.bodyYaw;const Nn=Math.hypot(F.velocity.x,F.velocity.z),Va=xe(a.knockGaitScale??0,0,1),Wa=vt.knockX*Va,S0=vt.knockZ*Va,w0=Va>0&&Math.hypot(vt.knockX,vt.knockZ)>.001,gc=F.velocity.x+Wa,xc=F.velocity.z+S0,Ed=Math.hypot(gc,xc);he=Ed;const E0=Math.cos(F.bodyYaw),T0=-Math.sin(F.bodyYaw),A0=F.velocity.x*E0+F.velocity.z*T0,Td=Nn>zi?xe(A0/Nn,-1,1):0,Ad=Nn>zi?xe((F.velocity.x*Gn+F.velocity.z*Kn)/Nn,-1,1):1,R0=hd(Ad,a.backStrafeStartDeg,a.backStrafeFullDeg);ge==="settled"&&q&&Rt>Ht*1.02+1e-4&&(ge="none");let Ys=1;ge==="blend"?(Ys=Vm(it?st:P,a.stopYawBlendMode,it),it||(P=Math.min(1,P+ye/Math.max(.01,a.stopYawAfterSec)),(P>=1||a.stopYawBlendMode==="inStop"||q)&&(ge="settled",Ys=0))):ge==="settled"&&(Ys=xe(Nn/Math.max(zi,a.stopEnterRatio*e),0,1)),j=Ys;const P0=Um(Td,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Rd=(a.hipYawTrackRateDeg??0)*Math.PI/180,C0=(a.hipYawBackRateDeg??0)*Math.PI/180,vc=We>1e-6?We:Mt;At=Rd>0?km(At,Dm(Gs),vc):0;const Pd=Nm(R0,At),L0=xe(Nn/.5,0,1),D0=Bm(Ad,Td,P0,Pd)*Ys*L0,Cd=Im(Ft,D0,Om(Rd,C0,Pd),vc,At);Ft=Cd,ct+=(Cd-ct)*(1-Math.exp(-i.hipYawSmoothing*vc));const $s=F.bodyYaw+ct;Bt=$s;const k0=Math.sin($s),I0=Math.cos($s),z0=Math.cos($s),F0=-Math.sin($s),Qn={speed:Ed,phase:F.gaitPhase,localForward:gc*k0+xc*I0,localRight:gc*z0+xc*F0,stride:F.stride};if(on&&K.attackId!==xn){const ae=!Dt;xn=K.attackId,Le+=1,an=ae&&(!ze||Qn.speed>.05)?Qn.phase:gn,ze=!0}Dt=on;const si=ii>0?bA(Qn,K.attackProgress,Le,ii,c.stride,an):Qn;zo=si,on&&(gn=si.phase);const yc=Math.max(0,a.dirFlipSec??0);yc>0?(ua=Kr(ua,si.localForward>=0?1:-1,ye,yc),fa=Kr(fa,si.localRight>=0?1:-1,ye,yc)):(ua=si.localForward>=0?1:-1,fa=si.localRight>=0?1:-1);const Ld=Math.max(0,a.stopBlendSec||0),Dd=Ld>0&&!on&&!w0&&F.grounded,_c=Hm(Nn,Se,e,a.stopEnterRatio,a.stopExitRatio);if(!Dd||_c.resume)_t=-1;else if(_t<0&&_c.enter){_t=0,Q=F.gaitPhase,rt=zm(F.gaitPhase),Ct=Nn,wt=Math.max(F.stride,zi),jt=Qn.localForward,ce=Qn.localRight;const ae=1/Math.max(zi,Nn);de=F.velocity.x*ae,ne=F.velocity.z*ae}const U0=Se;Se=Nn;const gi=Dd&&_t>=0;gi&&(_t=Math.min(1,_t+ye/Ld)),gi&&ge!=="blend"&&(ge="blend",P=0),it=gi&&_t<1,st=_t,q=_c.resume,Rt=Nn,Ht=U0;const kd=gi?{phase:Q,speed:Ct,moveSpeed:e,localForward:jt,localRight:ce,dirF:ua,dirR:fa,legLength:n.legLength,stride:wt,grounded:!0}:{phase:si.phase,speed:si.speed,moveSpeed:e,localForward:si.localForward,localRight:si.localRight,dirF:ua,dirR:fa,legLength:n.legLength,stride:si.stride??0,grounded:F.grounded};let Mc=gi?Fm(kd,a,{progress:_t,phase0:Q,phaseEnd:rt}):Jr(kd,a);const pa=c.attack.moveTakeover;if(pa&&!gi){const ae=K.phase==="windup"?pa.windup:K.phase==="recovery"?pa.recovery:K.phase==="settle"?pa.settle:0,pe=Math.max(.05,pa.full-pa.speed),En=xe((Qn.speed-pa.speed)/pe,0,1),Dn=xe(ae,0,1)*En,Bo=Dn>fi?10:6;fi=xe(fi+(Dn-fi)*(1-Math.exp(-Bo*ye)),0,1)}else gi?fi=0:fi=xe(fi*Math.exp(-8*ye),0,1);if(fi>.001&&!gi){const ae=Jr({phase:Qn.phase,speed:Qn.speed,moveSpeed:e,localForward:Qn.localForward,localRight:Qn.localRight,dirF:ua,dirR:fa,legLength:n.legLength,stride:Qn.stride??0,grounded:F.grounded},a);Mc=TA(Mc,ae,fi)}const Fe=AA(Mc,Hn.gaitScale);if(Zt=0,fn&&we){const ae=yA(we.progress,we.dir,a),pe=Hn.gaitScale;Fe.legL.pitchX+=ae.legL.pitchX*pe,Fe.legL.rollZ+=ae.legL.rollZ*pe,Fe.legL.kneeX+=ae.legL.kneeX*pe,Fe.legR.pitchX+=ae.legR.pitchX*pe,Fe.legR.rollZ+=ae.legR.rollZ*pe,Fe.legR.kneeX+=ae.legR.kneeX*pe,Fe.pelvisY+=ae.pelvisY*pe,Zt=ae.env}let bc=0,Sc=0,wc=0,Id=0;if(gi){const ae=Xm(F.bodyYaw,de,ne),pe=Wm(_t,Q,ae.forward,ae.right,a);pe.leadLeft?(Fe.legL.pitchX-=pe.leadPitch,Fe.legL.kneeX+=pe.leadKnee,Fe.legR.pitchX+=pe.trailPitch):(Fe.legR.pitchX-=pe.leadPitch,Fe.legR.kneeX+=pe.leadKnee,Fe.legL.pitchX+=pe.trailPitch),Sc=pe.bodyShift*pe.fwdN,bc=pe.bodyShift*pe.rightN,wc=pe.bodyDip,Id=pe.chestPitch,Ut=pe.leadPitch,Jt=pe.bodyShift,le=pe.bodyDip}else Ut=0,Jt=0,le=0;if(Os={lp:Fe.legL.pitchX,lr:Fe.legL.rollZ,rp:Fe.legR.pitchX,rr:Fe.legR.rollZ},!F.grounded)lt.root.rotation.x=-.55,at.root.rotation.x=-.25,lt.joint.rotation.x=.75,at.joint.rotation.x=.55,J.root.rotation.x=-.9,ht.root.rotation.x=-.7,J.joint.rotation.x=-.6,ht.joint.rotation.x=-.6,lt.root.rotation.z=0,at.root.rotation.z=0;else{lt.root.rotation.x=Fe.legL.pitchX,at.root.rotation.x=Fe.legR.pitchX,lt.root.rotation.z=Fe.legL.rollZ,at.root.rotation.z=Fe.legR.rollZ,lt.joint.rotation.x=Fe.legL.kneeX,at.joint.rotation.x=Fe.legR.kneeX;const ae=tt?T:0,pe=1+(((tt==null?void 0:tt.armSwing)??1)-1)*ae,En=tt==null?void 0:tt.armR,Dn=tt==null?void 0:tt.armL,Bo=Fe.armL*pe+((Dn==null?void 0:Dn.pitch)??0)*ae,Bd=Fe.armR*pe+((En==null?void 0:En.pitch)??0)*ae;J.root.rotation.x=Bo,ht.root.rotation.x=Bd,J.joint.rotation.x=-(.18+Bo*.2)+((Dn==null?void 0:Dn.elbow)??0)*ae,ht.joint.rotation.x=-(.18+Bd*.2)+((En==null?void 0:En.elbow)??0)*ae,J.root.rotation.z=((Dn==null?void 0:Dn.roll)??0)*ae,ht.root.rotation.z=((En==null?void 0:En.roll)??0)*ae,J.root.rotation.y=((Dn==null?void 0:Dn.yaw)??0)*ae,ht.root.rotation.y=((En==null?void 0:En.yaw)??0)*ae,x.position.x=Fe.pelvisX,x.position.y=E+Fe.pelvisY,x.position.z=0,x.rotation.z=Fe.pelvisRoll}const N0=Jm(x,y),Zs=fn?{...f,weight:0}:gi&&f.enabled?{...f,weight:1}:f,zd=Zs.enabled&&F.grounded&&Zs.weight>0?xe(Zs.weight,0,1)*(on?xe(Zs.attackScale,0,1):1):0;x.position.x+=bc,x.position.z+=Sc,x.position.y-=wc,y.position.y+=wc,zd<=0&&(y.position.x-=bc,y.position.z-=Sc);const Ec=Nn/Math.max(e,zi);Xe=Ec;const O0=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,B0=1-Math.exp(-Math.max(0,O0)*ye);Y+=(xe(Ec,0,1)-Y)*B0;const Ya=jm({leanForward:bt,leanSide:Vt,speedRatio:Y},o);x.rotation.x+=Ya.pelvisPitch,x.rotation.z+=Ya.pelvisRoll,x.position.x+=Ya.pelvisX,x.position.z+=Ya.pelvisZ,x.position.y-=Ya.crouch,y.position.y+=Ya.crouch*(1-xe(zd,0,1));const Fd=K.phase!=="idle"||K.charging&&K.weapon==="bow",Tc=Fd?1:0,H0=Math.max(.001,Tc>Ln?p.poseIn??.1:p.poseOut??.16);if(Ln!==Tc){const ae=ye/H0;Ln=xe(Ln+(Tc>Ln?ae:-ae),0,1)}if((Ln>0||Fd)&&g0(),_0(K,ye),Ln>0&&Ln<1&&x0(Ln),tt){const ae=(1-Ln)*T;w.rotation.y+=(tt.torsoYaw??0)*ae,w.rotation.x+=(tt.torsoPitch??0)*ae}M0(qt,F.gaitPhase),b0(re);const G0=K.weapon==="greatsword",Ud=Math.hypot(F.velocity.x,F.velocity.z),X0=G0&&K.phase==="idle"&&Ud>.5?Math.min(1.15,Ud/Math.max(e,.001)*.9):0;xt+=(X0-xt)*(1-Math.exp(-6*ye));const V0=w.rotation.x;K.weapon==="bow"&&(Tt.g.rotation.x=-(J.root.rotation.x+J.joint.rotation.x),St.rotation.x=-(ht.root.rotation.x+ht.joint.rotation.x));const W0=w.rotation.y;r0(vt,F.bodyYaw);const Nd=vt.type==="none"?1:.4;if(w.rotation.x+=bt*Nd+Id,w.rotation.z+=(Vt+Fe.sideLean)*Nd,tn>0&&(lt.root.rotation.x-=Te.hipPitch*tn,at.root.rotation.x-=Te.hipPitch*tn,lt.joint.rotation.x+=Te.kneeBend*tn,at.joint.rotation.x+=Te.kneeBend*tn,x.position.y-=Te.crouchDepth*tn,y.position.y+=Te.crouchDepth*(1-Te.lowerScale)*tn,w.rotation.x+=Te.upperPitch*tn,J.root.rotation.x-=Te.armTuck*tn,ht.root.rotation.x-=Te.armTuck*tn),ai>0&&F.grounded){const ae=SA(K.attackProgress,Le,c.stride),pe=ai;lt.root.rotation.x+=ae.legL.pitchX*pe,at.root.rotation.x+=ae.legR.pitchX*pe,lt.root.rotation.z+=ae.legL.rollZ*pe,at.root.rotation.z+=ae.legR.rollZ*pe,lt.joint.rotation.x+=ae.legL.kneeX*pe,at.joint.rotation.x+=ae.legR.kneeX*pe,x.position.x+=ae.pelvisX*pe,x.position.y+=ae.pelvisY*pe,x.rotation.z+=ae.pelvisRoll*pe}if(p0(on,K.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(da)>1e-4&&(x.position.x+=da),g.enabled){const ae=K.phase!=="idle"&&!K.charging,pe=ae?Uo(K.attackProgress):0;ae&&te>.55&&pe<te-1e-4&&(se=1),te=pe,se=HA(se,ye,g.impactDecay);const En=OA({swing:pe,charge:K.charging?K.charge:0,impact:se,speedRatio:Ec,grounded:F.grounded},g);Yt=BA(Yt,En,ye,g.smoothing)}else Yt={...Lh};c0(Yt),y.rotation.y=ct,me=Gm(ct,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=me;const Y0=W0;if(ut.rotation.y=He(F.headYaw-F.bodyYaw-Y0-me),ut.rotation.x=-xe(F.headPitch??0,-.7,.7),w.rotation.x+=-xe(F.bodyPitch??0,-.4,.4),v0(),h0(Mt,K.comboIndex),f0(K,V0),K.weapon==="greatsword"&&!K.charging&&(K.phase!=="idle"||Ln>0)){v.updateWorldMatrix(!0,!0);const ae=K.phase==="idle"?Math.max(Ln,ii):1;l0(xe(ae,0,1),ye)}if(X=Qm({root:v,pelvis:x,lower:y,limbs:Ot,base:N0,cfg:Zs,grounded:F.grounded,attacking:on}),y0(F,ye),L&&Hs){const ae=No();mc=Math.max(Math.abs(ae.pitch-Hs.x),Math.abs(ae.yaw-Hs.y),Math.abs(ae.lean-Hs.z))}else mc=0},lean(){return{forward:bt,side:Vt}},landing(){const F=qf(dc,Ha,Ga,Xa,Fo),K=Ga>0?Math.max(0,Ga-Math.max(0,dc-Ha)):0;return{pulse:F,remaining:K,kind:F>0?Bs:"none",impactVy:xd}},hurt(){return Pt},ik(){return X},stretch(){return{...Yt,impact:se}},gripDebug(){return{...Wt}},weaponDebug(){return{wristPitch:Qt,wristTwist:ve}},setClipT(F){Re=F===null||!Number.isFinite(F)?null:Math.max(0,Math.min(1,F))},stanceDebug(){const F=tt==null?void 0:tt.armR,K=tt==null?void 0:tt.armL,vt=tt?T:0;return{weapon:Lt??"sword-shield",weight:vt,armL:{pitch:((K==null?void 0:K.pitch)??0)*vt,yaw:((K==null?void 0:K.yaw)??0)*vt,roll:((K==null?void 0:K.roll)??0)*vt,elbow:((K==null?void 0:K.elbow)??0)*vt},armR:{pitch:((F==null?void 0:F.pitch)??0)*vt,yaw:((F==null?void 0:F.yaw)??0)*vt,roll:((F==null?void 0:F.roll)??0)*vt,elbow:((F==null?void 0:F.elbow)??0)*vt},torsoYaw:((tt==null?void 0:tt.torsoYaw)??0)*vt,torsoPitch:((tt==null?void 0:tt.torsoPitch)??0)*vt,bladePitchDeg:H*180/Math.PI,bladePitchOffDeg:pt*180/Math.PI,armSwing:(tt==null?void 0:tt.armSwing)??1}},swingDebug(){const F=oe;return{seg:dn,kind:(F==null?void 0:F.kind)??"right-left",lead:(F==null?void 0:F.lead)??"R",yaw:(F==null?void 0:F.yaw)??0,rootYaw:(F==null?void 0:F.rootYaw)??0,spinYaw:(F==null?void 0:F.spinYaw)??0,rootTurn:Xi,pitch:(F==null?void 0:F.pitch)??0,roll:(F==null?void 0:F.roll)??0,strike:(F==null?void 0:F.strike)??0,bladeTwist:(F==null?void 0:F.bladeTwist)??0,bladeTwistOff:(F==null?void 0:F.bladeTwistOff)??0,bladeYaw:(F==null?void 0:F.bladeYaw)??0,bladeYawOff:(F==null?void 0:F.bladeYawOff)??0,shoulderL:{x:fe.lx,y:fe.ly,z:fe.lz},shoulderR:{x:fe.rx,y:fe.ry,z:fe.rz}}},attackBlend(){return ii},attackWeights(){return{gaitScale:pd,attackLegWeight:ai,driveSpeed:zo.speed,stridePhase:zo.phase,strideBase:an,stepIndex:Le}},hipYaw(){return ct},torsoTotal(){return No()},spineDebug(){if(!L)return null;const F=No();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:C.rotation.y,totalYaw:F.yaw,totalPitch:F.pitch,totalLean:F.lean,neckPitch:ut.rotation.x,leak:mc}},balanceDebug(){return Io?{...Io,shift:da,latDeficit:md,lateralFf:Sd}:null},gaitDebug(){return{stopT:_t,hipYaw:ct,chestYaw:me,speed:Se,gaitSpeed:he,stopStep:Ut,stopShift:Jt,stopDip:le,stopYawFade:j,turnStep:Zt,legTakeover:fi,legLPitch:Os.lp,legLRoll:Os.lr,legRPitch:Os.rp,legRRoll:Os.rr,phase:zo.phase,dirF:ua,dirR:fa,hipYawTarget:Ft,spin:At}},gaitYaw(){return Bt},arrowDirection(){St.updateWorldMatrix(!0,!1);const F=St.matrixWorld.elements,K=F[8],vt=F[9],Mt=F[10],qt=Math.hypot(K,vt,Mt)||1;return{x:K/qt,y:vt/qt,z:Mt/qt}},weaponBlade(){return Lt?Oo(yt[Lt].right):null},bladesWorld(){return Lt?{right:Oo(yt[Lt].right),left:Oo(yt[Lt].left)}:{right:null,left:null}},dispose(){v.traverse(F=>{if(F instanceof be){F.geometry.dispose();const K=F.material;Array.isArray(K)?K.forEach(vt=>vt.dispose()):K.dispose()}})}}}function e2(n){const t=t0(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new ke;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const c=new G(s,o,r),l=new G;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(l);const f=l.distanceToSquared(c);f<u&&(u=f,d=h)}return d?{node:d,point:c}:null},dispose(){t.dispose()}}}const wa=.012,Ea=.016;function n2(n,t){const e=t.lab,i=new ke;i.name="test-lab";const a=[],s=[],o=[],r=[];function c(v){return o.push(v),v}function l(v){return r.push(v),v}function d(v,x,y,w=wa){const S=c(new _n({color:x,transparent:!0,opacity:y,depthWrite:!1,side:en,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),E=new be(v,S);return E.rotation.x=-Math.PI/2,E.position.y=w,E.renderOrder=2,E}function u(v,x){return l(new Ss(Math.max(v,.001),x,72))}function h(v,x,y,w=Ea){const E=document.createElement("canvas"),A=E.getContext("2d");if(!A)return new be;const b='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';A.font=b,E.width=Iu.ceilPowerOfTwo(Math.ceil(A.measureText(v).width)+32),E.height=Iu.ceilPowerOfTwo(96*1.4);const M=E.getContext("2d");if(!M)return new be;M.font=b,M.textAlign="center",M.textBaseline="middle",M.fillStyle=y,M.fillText(v,E.width/2,E.height/2);const R=new Ah(E);R.colorSpace=Fn,s.push(R);const k=E.width/E.height,L=l(new ei(x*k,x)),D=c(new _n({map:R,transparent:!0,depthWrite:!1,side:en,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),C=new be(L,D);return C.rotation.x=-Math.PI/2,C.position.y=w,C.renderOrder=3,C}function f(v,x,y,w,S,E){const A=y-x,b=l(new ei(A,w)),M=d(b,S,E,wa);M.position.set(A/2+x,wa,0);const R=new ke;return R.add(M),R.rotation.y=v-Math.PI/2,R}function m(v,x,y,w,S){const E=new Em;E.moveTo(0,x*.5),E.lineTo(-y*.5,x*.5-y*.9),E.lineTo(-y*.18,x*.5-y*.9),E.lineTo(-y*.18,-x*.5),E.lineTo(y*.18,-x*.5),E.lineTo(y*.18,x*.5-y*.9),E.lineTo(y*.5,x*.5-y*.9),E.closePath();const A=l(new ld(E)),b=d(A,w,S,wa+.002),M=new ke;return M.add(b),M.rotation.y=v+Math.PI,M}function _(v){var A;const x=new ke,y=h(`${v.index} · ${v.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((A=y.geometry.parameters)==null?void 0:A.width)??3;x.add(y);const E=d(l(new ei(S*.98,.08)),v.color,.7,Ea);return E.position.set(0,Ea,t.lab.labelTextHeight*.66),x.add(E),x.position.set(v.labelX,0,v.labelZ),x}const g=new ke;for(const v of n??[]){const x=new ke;if(x.position.set(v.x,0,v.z),v.shape==="square"){const y=v.radius,w=d(l(new ei(y*2,y*2)),v.color,e.padOpacity*.09);x.add(w);const S=.07,E=[[0,y,y*2+S,S],[0,-y,y*2+S,S],[-y,0,S,y*2+S],[y,0,S,y*2+S]];for(const[A,b,M,R]of E){const k=d(l(new ei(M,R)),v.color,e.padOpacity);k.position.x=A,k.position.z=b,x.add(k)}}else x.add(d(l(new sd(v.radius,72)),v.color,e.padOpacity*.075)),x.add(d(u(v.radius-.075,v.radius),v.color,e.padOpacity));if(v.id==="hub"){for(let y=0;y<4;y++){const w=y*Math.PI/4,S=y%2===0;for(const E of[0,Math.PI])x.add(f(w+E,v.radius*.12,v.radius*.94,S?.09:.055,v.color,S?.5:.32))}x.add(d(u(.5,.56),v.color,.4))}else if(v.id==="dash"){const y=v.spawnZ-v.z,w=-v.radius+.5,S=y-w,E=d(l(new ei(.06,S)),v.color,.36);E.position.set(0,wa,(y+w)/2),x.add(E);let A=0;for(let M=y;M>=w-.01;M-=1,A++){const R=A%5===0,k=d(l(new ei(R?2.4:1.3,R?.1:.07)),v.color,R?.72:.42);k.position.set(0,wa,M),x.add(k);const L=h(String(A),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");L.position.set(1.6,Ea,M),x.add(L)}const b=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[M,R]of b){const k=y-M,L=d(l(new ei(1.9,.09)),"#ffffff",.5);L.position.set(-1.5,wa,k),x.add(L);const D=h(R,.42,"rgba(220, 236, 250, 0.86)");D.position.set(-3,Ea,k),x.add(D)}}else if(v.id==="gait"){x.add(d(u(1.44,1.5),v.color,.5)),x.add(d(u(1.14,1.2),v.color,.22));const y=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,E,A]of w){const M=Math.sin(S),R=Math.cos(S),k=m(S,1.7,.34,A,.75);k.position.set(M*1.7*.5,0,y+R*1.7*.5),x.add(k);const L=h(E,.44,A);L.position.set(M*(1.7+.7),Ea,y+R*(1.7+.7)),x.add(L)}}if(g.add(x),e.showLabels){const y=_(v);a.push(y),g.add(y)}}i.add(g);const p=n==null?void 0:n.find(v=>v.id==="hub");if(p&&e.showLabels){const v=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,y,w]of v){const S=h(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),Ea,p.z+y*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(v){i.visible=v},setLabelsVisible(v){for(const x of a)x.visible=v},dispose(){for(const v of r)v.dispose();for(const v of o)v.dispose();for(const v of s)v.dispose();i.clear()}}}const $e={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function _l(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function Ml(n,t,e){const i=Array.from({length:t.count},()=>{const a=new _n({color:t.color,transparent:!0,opacity:0,side:en,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new be(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,c){const l=i.find(d=>d.life<=0)??i[0];c!=null&&c.color&&l.mat.color.set(c.color),l.mesh.position.set(a,e(a,s,o)+t.yOffset,s),l.base=r,l.mesh.scale.setScalar(r*t.scaleFrom),l.mesh.visible=!0,l.mat.opacity=t.spawnOpacity,l.life=t.duration,l.delay=(c==null?void 0:c.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function i2(n,t,e,i){const a=t.dash,s={count:6,geometry:new Ss(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:$e.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=Ml(n,s,i),r=t.links,c={count:5,geometry:new Ss(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:$e.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},l=Ml(n,c,i),d=t.groundSlam,u={count:4,geometry:new Ss(.78,1,56),color:d.color,blending:Ui,renderOrder:$e.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=Ml(n,u,i);let f=e.dash.id,m="none",_=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,v=0;return{update(x,y,w){var A;const S=x.character;if(x.dash.id!==f){f=x.dash.id;const b=x.dash;m=b.kind,b.kind==="blink"?(o.spawn(b.fromX,b.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(b.toX,b.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(b.fromX,b.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,v+=1,d.enabled)){const b=(A=x.config.combat.weapons[x.combat.weapon])==null?void 0:A.groundSlam,M=Math.max(.6,(b==null?void 0:b.radius)??2.2);h.spawn(S.position.x,S.position.z,S.position.y,M,{delay:0}),h.spawn(S.position.x,S.position.z,S.position.y,M*d.outerScale,{delay:d.delay}),w(d.shake)}h.update(y);const E=x.playerLink;E.id!==_&&(_=E.id,g=E.hitIds.length,l.spawn(S.position.x,S.position.z,S.position.y,1)),E.hitIds.length>g?(g=E.hitIds.length,l.spawn(S.position.x,S.position.z,S.position.y,1.35)):E.hitIds.length<g&&(g=E.hitIds.length),l.update(y)},slamDebug(){return{spawns:v,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??$e.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),l.dispose(),h.dispose();for(const x of[s.geometry,c.geometry,u.geometry])x.dispose()}}}const ud=64,e0=[0,.24,.76,1],a2=[0,1,1,0],n0=[0,.12,.28,.5,.72,.88,1],s2=[0,.16,.5,1,.5,.16,0];function tp(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function fd(n,t,e,i,a=ud,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),c=s==="glow"?n0:e0,l=s==="glow"?s2:a2,d=c.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,v=(p-.5)*e,x=tp(p,i)*tp(1-p,i),y=Math.sin(v),w=Math.cos(v);for(let S=0;S<d;S++){const E=o+(r-o)*c[S],A=g*d+S;h[A*3]=y*E,h[A*3+1]=0,h[A*3+2]=w*E;const b=x*l[S];f[A*4]=1,f[A*4+1]=1,f[A*4+2]=1,f[A*4+3]=b}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const v=g*d+p,x=v+d;m.push(v,x,v+1,v+1,x,x+1)}const _=new hn;return _.setAttribute("position",new Mn(h,3)),_.setAttribute("color",new Mn(f,4)),_.setIndex(m),_.computeBoundingSphere(),_}function bl(n){const t=new _n({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:en,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(c,l)=>{const d=Math.round(c*32)/32,u=Math.max(.05,Math.round(l*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=fd(n.radius,n.thickness*u,d,n.edgeFade,ud,n.profile??"band");if(e.set(h,m),e.size>64){for(const[_,g]of e)if(_!==h&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new be(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(c,l,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(c-o)>.01||Math.abs(m-r)>.01)&&(i=a(c,m),s.geometry=i,o=c,r=m),t.opacity=l,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=l>.002},arcRad(){return o},dispose(){for(const c of e.values())c.dispose();e.clear(),t.dispose()}}}function ep(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function o2(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),c=Math.min(1,Math.max(0,e)),l=a.selectedArcDeg*Math.PI/180,d=s+(l-s)*(.35+.65*r),u=4+4*r+6*c,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*c)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function r2(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function c2(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let l=0;l<i;l++){const d=l/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,_=t+(1-t)*m,g=l*a+f;s[g*3]=u*_,s[g*3+1]=0,s[g*3+2]=h*_;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let l=0;l<n;l++)for(let d=0;d<e;d++){const u=l*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const c=new hn;return c.setAttribute("position",new Mn(s,3)),c.setAttribute("color",new Mn(o,4)),c.setIndex(r),c.computeBoundingSphere(),c}function np(n){const t=n.segments??ud,e=n.profile??"band",a=((e==="glow"?n0.length:e0.length)-1)*6,s=fd(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new _n({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:en,vertexColors:!0,toneMapped:!1}),r=new be(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let c=0;return{mesh:r,set(l,d,u,h,f=1){const m=Math.min(1,Math.max(0,l)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),c=_,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?c/t:0},filledSegments(){return c},dispose(){s.dispose(),o.dispose()}}}function ip(n){const t=new ke,e=c2(48),i=new _n({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:en,vertexColors:!0,toneMapped:!1}),a=new be(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=fd(1-s*.5,s,Math.PI*2,0,64,"band"),r=new _n({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:en,vertexColors:!0,toneMapped:!1}),c=new be(o,r);return c.renderOrder=(n.renderOrder??2)+1,t.add(c),t.position.y=n.y,{group:t,set(l,d,u,h,f,m){const _=Math.min(1,Math.max(0,f));t.position.set(l,u,d),a.scale.set(h,1,h),c.scale.set(h,1,h),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function ap(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function l2(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function h2(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function d2(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function u2(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function f2(n,t,e){return n?t:e}function i0(n){return{x:0,y:0,z:1}}function p2(n){return Math.asin(i0().y)}function m2(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const g2=Math.PI/3;function sp(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function x2(){let n=0,t=!1;return{update(e,i,a,s=g2){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=sp(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=sp(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function v2(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new hn,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new Mn(i,3),o=new Mn(a,3);s.setUsage(fo),o.setUsage(fo),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,w=y+1,S=y+2,E=y+3;r.push(y,w,S,w,E,S)}e.setIndex(r),e.setDrawRange(0,0);const c=new _n({vertexColors:!0,transparent:!0,opacity:1,blending:Ui,depthWrite:!1,side:en}),l=new be(e,c);l.frustumCulled=!1,l.renderOrder=6,l.visible=!1;const d=new ee(n.color);let u=[],h=null,f=0,m=0,_=!1,g=!1,p=0;function v(){const x=u.length;if(x<2||!n.enabled){l.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],E=Math.max(0,1-S.age/y),A=E*E,b=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),M=n.intensity*A*(.55+.45*b)*(1+p),R=.18+.82*E,k=w*6;i[k]=S.tx+(S.bx-S.tx)*R,i[k+1]=S.ty+(S.by-S.ty)*R,i[k+2]=S.tz+(S.bz-S.tz)*R,i[k+3]=S.tx,i[k+4]=S.ty,i[k+5]=S.tz;const L=d.r*M,D=d.g*M,C=d.b*M,I=L*.22,O=D*.22,B=C*.22;a[k]=I,a[k+1]=O,a[k+2]=B;const V=1+n.tipBoost;a[k+3]=Math.min(1,L*V),a[k+4]=Math.min(1,D*V),a[k+5]=Math.min(1,C*V)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),l.visible=!0}return{object:l,update(x,y,w){if(!n.enabled){l.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const E of u)E.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const E=h?Math.hypot(y.tip.x-h.x,y.tip.y-h.y,y.tip.z-h.z)/Math.max(1e-4,S):0,A=u[u.length-1],b=A?Math.hypot(y.tip.x-A.tx,y.tip.y-A.ty,y.tip.z-A.tz):1/0;if(w&&b>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:E});u.length>t;)u.shift();h={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=E,m=b,_=!0}else h=null,_=!1,f=0,m=0;g=w,v()},debug(){return{count:u.length,visible:l.visible,speed:f,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,l.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),c.dispose()}}}const y2=`#include <common>
attribute vec2 aWindPhase;
attribute vec3 aWindRoot;
attribute vec4 aWindGeom;
uniform float uWindTime;
uniform vec2 uWindDir;
uniform vec2 uWindOmega;
uniform vec2 uWindAmp;
uniform float uWindGust;
uniform float uWindShade;
uniform float uWindOn;
varying float vWindShade;
vec3 rotAxis(vec3 v, vec3 axis, float c, float s) {
  return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
}`,_2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
{
  // 两波叠加：主浪 + 更短更快的次浪（与 Core.windSample 同式）
  float s1 = sin(aWindPhase.x - uWindOmega.x * uWindTime);
  float s2 = sin(aWindPhase.y - uWindOmega.y * uWindTime);
  float sway = uWindGust * (uWindAmp.x * s1 + uWindAmp.y * s2) * uWindOn * aWindGeom.z;

  // 割断 / 缓慢生长抑制：instanceMatrix 的 Y 列长度 = 当前实际段高，除以设计段高即存活比例。
  // 断茬变矮 → 摆幅按比减弱；上段被隐藏(scale=0) → 完全不摆。无需额外上传。
  vec3 ay = instanceMatrix[1].xyz;
  float designSegH = mix(aWindGeom.x, aWindGeom.y, aWindGeom.w);
  float alive = clamp(length(ay) / max(designSegH, 1e-4), 0.0, 1.0);
  sway *= alive;

  // 草顶摆幅(米) → 倾角：有效力臂 LOW·hBase + hTip（折线弯折的等效力臂），
  // 与 Core.windPivotAngles / windPivotEffLength 同源，顶端实际位移 ≈ sway。
  float effL = ${ou.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${ou.toFixed(2)};
  float tUp  = theta * ${Ox.toFixed(2)};

  // 世界风向 → 水平旋转轴 (dirZ, 0, -dirX)：草朝风向倾倒；物体空间即世界空间
  vec3 axis = normalize(vec3(uWindDir.y, 0.0, -uWindDir.x));
  vec3 P0 = aWindRoot;                                   // 草根枢轴
  vec3 v = mvPosition.xyz;
  float cL = cos(tLow), sL = sin(tLow);
  vec3 vLow = P0 + rotAxis(v - P0, axis, cL, sL);      // 下段：绕草根刚体转 low

  if (aWindGeom.w > 0.5) {
    // 上段：先继承下段旋转，再绕「下段转后顶端」额外折 up → 与下段顶端无缝
    vec3 P1 = (instanceMatrix * vec4(0.0, -0.5, 0.0, 1.0)).xyz;   // 上段底 = 下段顶
    vec3 P1p = P0 + rotAxis(P1 - P0, axis, cL, sL);
    float cU = cos(tUp), sU = sin(tUp);
    vLow = P1p + rotAxis(vLow - P1p, axis, cU, sU);
  }
  mvPosition.xyz = vLow;

  // 明暗带：波峰亮、波谷暗，形成一条条推进的浪
  vWindShade = 1.0 - uWindShade * uWindOn * (0.5 + 0.5 * s1) * alive;
}
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,M2=`#include <common>
varying float vWindShade;`,b2=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function S2(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),c=new Float32Array(o*3),l=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],_=Math.min(d,m.height),g=Math.max(0,m.height-_),[p,v]=Ux(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let y=0;y<2;y++){const w=f*2+y;r[w*2]=p,r[w*2+1]=v,c[w*3]=m.x,c[w*3+1]=m.y,c[w*3+2]=m.z,l[w*4]=_,l[w*4+1]=g,l[w*4+2]=x,l[w*4+3]=y}}t.setAttribute("aWindPhase",new mo(r,2)),t.setAttribute("aWindRoot",new mo(c,3)),t.setAttribute("aWindGeom",new mo(l,4));const u=kp(a),h={uWindTime:{value:0},uWindDir:{value:new Xt(u.dirX,u.dirZ)},uWindOmega:{value:new Xt(u.omega1,u.omega2)},uWindAmp:{value:new Xt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",y2).replace("#include <project_vertex>",_2),f.fragmentShader=f.fragmentShader.replace("#include <common>",M2).replace("#include <color_fragment>",b2)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function w2(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function E2(n,t,e=So){const i=new ke;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),c=r*2,l=t.enabled&&c>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(N=>new ee(N)),h=new ee(t.stumpColor),f=new ee(t.debris.color),m=new qn(1,1,1),_=new qn(1,1,1),g=new Na({color:16777215,transparent:!1}),p=S2(g,_,n,t,e),v=new Na({color:f,transparent:!1});let x=null,y=null,w=null;const S=[],E=w2(2654435769^r),A=new Float32Array(r),b=new Uint8Array(r),M=new Float32Array(r),R=new Uint8Array(r).fill(1),k=new De,L=new ra,D=new ra,C=new ra,I=new G,O=new G,B=new G,V=new G,et=new ee,ut=new ee,mt=new De().makeScale(0,0,0);let kt=0,Z=0,nt=0,lt=0,at=1,J=1;const ht=8;let Ot={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function $t(N,zt){if(u.length===1)return zt.copy(u[0]);const Tt=Math.max(0,Math.min(u.length-1,N*(u.length-1))),St=Math.min(u.length-2,Math.max(0,Math.floor(Tt)));return zt.copy(u[St]).lerp(u[St+1],Math.min(1,Math.max(0,Tt-St)))}if(l){x=new Df(_,g,c),x.instanceMatrix.setUsage(fo),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(fo);for(let zt=0;zt<c;zt++)x.setMatrixAt(zt,mt);i.add(x);const N=Math.max(1,Math.floor(t.debris.max));w=new Df(m,v,N),w.instanceMatrix.setUsage(fo),w.castShadow=!1,w.receiveShadow=!1,w.frustumCulled=!1,w.name="grass-debris";for(let zt=0;zt<N;zt++)w.setMatrixAt(zt,mt);i.add(w)}i.visible=l;function dt(N,zt,Tt,St,yt,gt){if(!w)return;const Lt=w.count;if(S.length>=Lt)return;const U=t.debris.life,T=1.1+E()*1.5;S.push({x:N,y:zt,z:Tt,vx:St*T+(E()-.5)*1.2,vy:1.9+E()*1.8,vz:yt*T+(E()-.5)*1.2,life:U,total:U,size:gt*(.55+E()*.45),spin:(E()-.5)*9})}function W(N){if(!w)return;const zt=w.count,Tt=12;for(let yt=S.length-1;yt>=0;yt--){const gt=S[yt];if(gt.life-=N,gt.life<=0){S.splice(yt,1);continue}gt.vy-=Tt*N,gt.x+=gt.vx*N,gt.y+=gt.vy*N,gt.z+=gt.vz*N,gt.y<.02&&(gt.y=.02,gt.vy=-gt.vy*.25,gt.vx*=.6,gt.vz*=.6)}const St=1e-4;for(let yt=0;yt<zt;yt++){const gt=S[yt];if(!gt){w.setMatrixAt(yt,mt);continue}const Lt=Math.max(St,gt.life/gt.total);O.set(gt.x,gt.y,gt.z),I.set(.4+yt*.13,1,.2).normalize(),L.setFromAxisAngle(I,gt.spin*(gt.total-gt.life)),B.set(gt.size*Lt,gt.size*.7*Lt,gt.size*Lt),k.compose(O,L,B),w.setMatrixAt(yt,k)}w.instanceMatrix.needsUpdate=!0}return{object:i,update(N,zt){var ct,Bt,Ft;if(!l||!x)return;const Tt=N.grass,St=((ct=N.config.grass)==null?void 0:ct.wind)??So,yt=kp(St),gt=((Bt=Tt.wind)==null?void 0:Bt.time)??0,Lt=((Ft=Tt.wind)==null?void 0:Ft.gust)??1;p.uWindTime.value=gt,p.uWindGust.value=Lt,p.uWindDir.value.set(yt.dirX,yt.dirZ),p.uWindOmega.value.set(yt.omega1,yt.omega2),p.uWindAmp.value.set(yt.amp1,yt.amp2),p.uWindShade.value=yt.shadeAmount,p.uWindOn.value=St.enabled?1:0,Ot={enabled:St.enabled,time:gt,gust:Lt,mode:"pivot"};const U=Math.min(r,Tt.blades.length),T=Math.min(.05,Math.max(0,zt)),H=N.config.grass,pt=(H==null?void 0:H.regrowSec)??0,tt=Math.min(1,Math.max(.05,(H==null?void 0:H.stumpRatio)??.34)),ot=t.segmentHeight,It=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let Et=0,bt=0,Vt=0,xt=0,Pt=0,X=0,Y=0;for(let At=0;At<U;At++){const z=Tt.blades[At],_t=z.cut!==0?1:0,Q=z.yaw/It,rt=Bx(z.cut,pt,Q),Ct=Math.min(ot,z.height),wt=Ct*tt,jt=wt+(z.height-wt)*rt;if(At<ht&&(X+=jt/Math.max(1e-6,z.height),Y+=1),rt>.001&&rt<1-.001&&(xt+=1,Pt+=rt),!(R[At]===1||Math.abs(z.bend-A[At])>1e-4||_t!==b[At]||Math.abs(rt-M[At])>.001)){z.bend>.02&&(bt+=1),_t&&(Vt+=1);continue}_t&&!b[At]&&R[At]!==1&&(dt(z.x,z.y+Ct*.75,z.z,z.bendX||1,z.bendZ||0,z.width*1.5),dt(z.x,z.y+Ct+(z.height-Ct)*.5,z.z,z.bendX||1,z.bendZ||0,z.width*1.2)),I.set(Math.cos(z.yaw),0,-Math.sin(z.yaw)),C.setFromAxisAngle(I,z.lean),I.set(z.bendZ,0,-z.bendX),D.setFromAxisAngle(I,z.bend),L.copy(D).multiply(C),V.set(z.x,z.y,z.z);const de=Math.min(ot,jt),ne=Math.max(0,jt-ot);O.set(0,de*.5,0).applyQuaternion(L).add(V),B.set(z.width,de,z.width),k.compose(O,L,B),x.setMatrixAt(At*2,k),ne<1e-4?x.setMatrixAt(At*2+1,mt):(O.set(0,de+ne*.5,0).applyQuaternion(L).add(V),B.set(z.width*.84,ne,z.width*.84),k.compose(O,L,B),x.setMatrixAt(At*2+1,k)),$t(z.tone,ut),rt>=1?et.copy(ut):et.copy(h).lerp(ut,rt),x.setColorAt(At*2,et),x.setColorAt(At*2+1,et),x.instanceMatrix.addUpdateRange(At*32,32),y&&y.addUpdateRange(At*6,6),A[At]=z.bend,b[At]=_t,M[At]=rt,R[At]=0,Et+=1,z.bend>.02&&(bt+=1),_t&&(Vt+=1)}Et>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),W(T),kt=Et,Z=bt,nt=Vt,lt=xt,at=xt>0?Pt/xt:1,J=Y>0?X/Y:1},debug(){return{enabled:l,blades:s,patches:n.patches.length,instances:c,drawCalls:l?2:0,dirty:kt,bent:Z,cut:nt,debris:S.length,growing:lt,avgGrowth:at,sampleHeight:J,wind:{...Ot}}},dispose(){m.dispose(),_.dispose(),g.dispose(),v.dispose(),i.clear()}}}function T2(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function A2(n,t,e,i){var Cn,rn;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new bT({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=Vp,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new ST;r.background=new ee("#12161d"),r.add(new oA(11061486,2764600,1.15));const c=new lA(16773852,1.5);c.position.set(9,18,11),c.castShadow=!0,c.shadow.mapSize.set(1024,1024);const l=c.shadow.camera;l.left=-20,l.right=20,l.top=20,l.bottom=-20,l.near=1,l.far=60,r.add(c);const d=[],u=new ke;for(const $ of t.boxes){const Dt=$.maxX-$.minX,Ut=$.maxY-$.minY,Jt=$.maxZ-$.minZ;let le=T2($.kind,e);$.kind==="step"&&(le=new ee(le).offsetHSL(0,0,$.maxY*.09).getStyle());const he=new Na({color:le,transparent:!1,opacity:1}),ge=new be(new qn(Dt,Ut,Jt),he);ge.position.set(($.minX+$.maxX)/2,($.minY+$.maxY)/2,($.minZ+$.maxZ)/2),ge.castShadow=$.kind!=="ground",ge.receiveShadow=!0,ge.add(new _m(new HT(ge.geometry),new nd({color:10467020,transparent:!0,opacity:.32}))),u.add(ge),d.push(he)}r.add(u);const h=t.gridMeta.maxX-t.gridMeta.minX,f=new dA(h,h,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const m=n2(i,e);r.add(m.group);const _=E2(t.grass,e.grass,t.config.grass.wind);_l(_.object,$e.grass),r.add(_.object);const g=$=>t0(($==null?void 0:$.voxel)??e.voxel,$!=null&&$.colors?{...e.colors,...$.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let p="standard",v=g((Cn=e.bodyTypes)==null?void 0:Cn[p]);const x=v2(e.weaponTrail);_l(x.object,$e.trail),r.add(x.object);const y=new ke,w=.9,S=new ke;S.position.y=w,v.group.position.y=-w,S.add(v.group),y.add(S),r.add(y);const E=x2();let A=0;const b=((rn=t.config.dummies.fighters)==null?void 0:rn.moveSpeed)??t.config.dummies.moveSpeed;function M($,Dt){const Ut=e.dummies.colors,Jt=Ut[Dt%Ut.length]??"#cccccc";let le;if($.weapon){const he=e.dummies.fighterColors,ge=he&&he.length>0?he[(Dt-t.config.dummies.count)%he.length]:void 0;le=e2({voxel:e.voxel,colors:ge?{...e.colors,...ge}:e.colors,moveSpeed:b,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const he=kA(e.voxel,e.colors,Jt,$.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);le={group:he.group,update:(ge,P)=>he.update(ge,P),boneAtWorld:(ge,P,j)=>he.boneAtWorld(ge,P,j),dispose:()=>he.dispose()}}return le.group.traverse(he=>{he.userData.dummyId=$.id}),r.add(le.group),le}const R=t.dummies.map(M),k=R.map($=>$.group),L=new hA,D=e.groundRing,C=e.voxel.bodyWidth,I=ep(C,D.playerRadiusFactor),O=ep(C,D.dummyRadiusFactor),B=C*D.thicknessFactor,V=D.arcDeg*Math.PI/180;let et=0;const ut=($,Dt,Ut)=>_p(t.boxes,$,Dt,Ut+.55,0),mt=bl({radius:I,thickness:B,arcRad:V,edgeFade:D.edgeFade,color:D.playerColor,opacity:D.playerOpacity,y:.028,renderOrder:$e.ring});mt.mesh.name="player-ground-ring",r.add(mt.mesh);function kt($){const Dt=bl({radius:O,thickness:B,arcRad:V,edgeFade:D.edgeFade,color:D.neutralColor,opacity:D.opacity,y:.022,renderOrder:$e.ring});return Dt.mesh.name=`dummy-ground-ring-${$.id}`,r.add(Dt.mesh),Dt}function Z($){const Dt=bl({radius:O*D.haloRadiusFactor,thickness:B*D.haloThicknessFactor,arcRad:V,edgeFade:D.edgeFade,color:D.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:$e.ringHalo});return Dt.mesh.name=`dummy-ground-halo-${$.id}`,r.add(Dt.mesh),Dt}function nt($){const Dt=np({radius:O*D.warnRadiusFactor,thickness:B*D.warnThicknessFactor,arcRad:V,edgeFade:.02,color:D.warnColor,y:.031,renderOrder:$e.ringWarn});return Dt.mesh.name=`dummy-ground-warn-${$.id}`,r.add(Dt.mesh),Dt}const lt=t.dummies.map(kt),at=t.dummies.map(Z),J=t.dummies.map(()=>0),ht=t.dummies.map(()=>0),Ot=np({radius:I*D.meterRadiusFactor,thickness:B*D.meterThicknessFactor,arcRad:V,edgeFade:.06,color:D.meterColorCharge,y:.03,renderOrder:$e.ringMeter});Ot.mesh.name="player-ground-meter",r.add(Ot.mesh);const $t=t.dummies.map(nt),dt=ip({color:D.playerColor,y:.042,renderOrder:$e.groundArea});dt.group.name="player-landing-preview",r.add(dt.group);const W=new ee,N=new ee(D.playerColor),zt=new ee(D.neutralColor),Tt=new ee(D.lowThreatColor),St=new ee(D.highThreatColor),yt=new ee(D.meterColorCharge),gt=new ee(D.meterColorChannel),Lt=new ee(D.meterColorCooldown),U=new ee(D.warnColor),T=new ke;r.add(T);const H=e.projectiles;function pt(){const Dt=document.createElement("canvas");Dt.width=64,Dt.height=64;const Ut=Dt.getContext("2d");if(Ut){const le=Ut.createRadialGradient(32,32,0,32,32,32);le.addColorStop(0,"rgba(255,255,255,1)"),le.addColorStop(.28,"rgba(255,255,255,0.72)"),le.addColorStop(.62,"rgba(255,255,255,0.22)"),le.addColorStop(1,"rgba(255,255,255,0)"),Ut.fillStyle=le,Ut.fillRect(0,0,64,64)}const Jt=new Ah(Dt);return Jt.colorSpace=Fn,Jt}function tt(){const Ut=document.createElement("canvas");Ut.width=2,Ut.height=64;const Jt=Ut.getContext("2d");if(Jt){const he=Jt.createLinearGradient(0,0,0,64);he.addColorStop(0,"rgba(255,255,255,0)"),he.addColorStop(.55,"rgba(255,255,255,0.35)"),he.addColorStop(1,"rgba(255,255,255,0.95)"),Jt.fillStyle=he,Jt.fillRect(0,0,2,64)}const le=new Ah(Ut);return le.colorSpace=Fn,le}const ot=pt(),It=tt(),Et=new _n({color:12577023,transparent:!0,opacity:0,side:en,depthWrite:!1}),bt=new _n({color:14217983,transparent:!0,opacity:0,side:en,depthWrite:!1,blending:Ui}),Vt=new ke;Vt.position.set(0,.95,.72),T.add(Vt);const xt=new ke;xt.rotation.x=p2(e.camera.pitchDeg),Vt.add(xt);const Pt=new lc(.78,H.slashThickness,6,28,Math.PI*1.15),X=new ke,Y=new be(Pt,Et),ct=new be(Pt,bt);ct.scale.setScalar(1.09),_l(X,$e.slash),ct.renderOrder=$e.slash+1,X.add(Y,ct),xt.add(X);const Bt=new qn(H.arrowWidth,H.arrowWidth,H.arrowLength),Ft=new od(H.arrowHeadSize*.42,H.arrowHeadSize,4);Ft.rotateX(Math.PI/2);const At=new qn(H.arrowWidth*2.6,H.arrowWidth*.4,.1),z=new Ro(H.arrowWidth*.45,H.arrowWidth*1.3,H.trailLength,6,1,!0);z.rotateX(-Math.PI/2),z.translate(0,0,-H.trailLength/2);const _t=Array.from({length:10},()=>{const $=new ke,Dt=new _n({color:H.arrowColor,transparent:!0}),Ut=new _n({color:H.arrowHeadColor,transparent:!0}),Jt=new Th({map:ot,color:H.arrowColor,transparent:!0,opacity:.85,blending:Ui,depthWrite:!1}),le=new _n({color:H.arrowTrailColor,map:It,transparent:!0,opacity:0,blending:Ui,depthWrite:!1,side:en}),he=new be(Bt,Dt),ge=new be(Ft,Ut);ge.position.z=H.arrowLength/2+H.arrowHeadSize*.42;const P=new be(At,Ut),j=new be(At,Ut);P.position.z=-H.arrowLength/2+.08,j.position.z=P.position.z,j.rotation.z=Math.PI/2;const it=new Pf(Jt);it.scale.setScalar(H.arrowGlowSize),it.renderOrder=$e.projectileGlow;const st=new be(z,le);return st.renderOrder=$e.projectileTrail,he.renderOrder=$e.projectile,ge.renderOrder=$e.projectile,P.renderOrder=$e.projectile,j.renderOrder=$e.projectile,$.add(he,ge,P,j,it,st),$.visible=!1,r.add($),{group:$,shaftMat:Dt,tipMat:Ut,glowMat:Jt,trailMat:le,glow:it,trail:st,arrowId:0,bone:null}}),Q=new cd(1,0),rt=new G(H.boltShapeX,H.boltShapeY,H.boltShapeZ),Ct=new _n({color:H.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),wt=new Th({map:ot,color:H.boltGlowColor,transparent:!0,opacity:.45,blending:Ui,depthWrite:!1}),jt=new _n({color:H.boltGlowColor,map:It,transparent:!0,opacity:H.trailOpacity,blending:Ui,depthWrite:!1,side:en}),ce=new Ro(.5,.03,H.boltTrailScale,6,1,!0);ce.rotateX(-Math.PI/2),ce.translate(0,0,-H.boltTrailScale/2);const de=Array.from({length:24},()=>{const $=new ke,Dt=new be(Q,Ct);Dt.scale.copy(rt);const Ut=new Pf(wt);Ut.scale.setScalar(H.boltGlowScale),Ut.renderOrder=$e.projectileGlow;const Jt=new be(ce,jt);return Jt.renderOrder=$e.projectileTrail,Dt.renderOrder=$e.projectile,$.add(Dt,Ut,Jt),$.visible=!1,r.add($),{group:$,core:Dt}}),ne=Array.from({length:6},()=>{const $=ip({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:$e.groundArea});return $.group.visible=!1,r.add($.group),$}),Se=i2(r,e,t,ut),me=fA(e.camera,e.smartCamera,e.zoom,a/s),an=t.character.position;me.update(an.x,an.y,an.z,1,t.camera);function gn($){const Dt=$.dummies.length;for(;R.length<Dt;){const Jt=R.length,le=$.dummies[Jt],he=M(le,Jt);R.push(he),k.push(he.group),lt.push(kt(le)),at.push(Z(le)),$t.push(nt(le)),J.push(0),ht.push(0)}let Ut=!1;for(;R.length>Dt;){Ut=!0;const Jt=R.pop();r.remove(Jt.group),Jt.dispose(),k.pop();const le=lt.pop();r.remove(le.mesh),le.dispose();const he=at.pop();r.remove(he.mesh),he.dispose();const ge=$t.pop();r.remove(ge.mesh),ge.dispose(),J.pop(),ht.pop()}if(Ut)for(let Jt=0;Jt<Dt;Jt++){const le=$.dummies[Jt].id;R[Jt].group.userData.dummyId!==le&&R[Jt].group.traverse(he=>{he.userData.dummyId=le})}}function ze($,Dt){if(k.length===0)return 0;const Ut=o.domElement.getBoundingClientRect(),Jt=new Xt(($-Ut.left)/Ut.width*2-1,-((Dt-Ut.top)/Ut.height)*2+1);L.setFromCamera(Jt,me.camera);const le=L.intersectObjects(k,!0);for(const he of le){const ge=he.object.userData.dummyId;if(ge&&ge>0)return ge}return 0}function Le($,Dt,Ut){const Jt=o.domElement.getBoundingClientRect(),le=new G($,Dt,Ut).project(me.camera);return{x:Jt.left+(le.x*.5+.5)*Jt.width,y:Jt.top+(-le.y*.5+.5)*Jt.height}}let xn=!1;return{balanceDebug(){return v.balanceDebug()},spineDebug(){return v.spineDebug()},gaitDebug(){return v.gaitDebug()},trailDebug(){return x.debug()},stretchDebug(){const $=v.stretch();return{arm:$.arm,leg:$.leg,torso:$.torso,impact:$.impact}},swingDebug(){return v.swingDebug()},stanceDebug(){return v.stanceDebug()},bladeWorld(){return v.weaponBlade()},bladesWorld(){return v.bladesWorld()},slamDebug(){return Se.slamDebug()},yawDebug(){var $;return{target:A,shown:E.value,tauMs:(($=e.renderInterp)==null?void 0:$.yawSmoothMs)??0}},grassDebug(){return _.debug()},fxDebug(){var $,Dt;return{boxOpaque:d.every(Ut=>!Ut.transparent),boxCount:d.length,orders:{ring:mt.mesh.renderOrder,groundFx:Se.groundOrder(),trail:x.object.renderOrder,slash:X.renderOrder,projectile:((Dt=($=_t[0])==null?void 0:$.group.children[0])==null?void 0:Dt.renderOrder)??-1}}},renderPose(){return{x:y.position.x,y:y.position.y,z:y.position.z,bodyYaw:y.rotation.y}},projectPoint($,Dt,Ut){return Le($,Dt,Ut)},setClipT($){v.setClipT($)},weaponDebug(){return v.weaponDebug()},gripDebug(){return v.gripDebug()},render($,Dt){var Xe;gn($);const Ut=$.character,Jt=$.combat,le=e.hitstop.enabled&&$.combat.hitstop>0,he=Dt*Math.max(0,Math.min(4,Jt.warp??1));if(le&&!xn){const Nt=Math.max(0,$.combat.hitstop),ft=Math.max(0,Math.min(1,Nt/.1));me.addShake(.34+ft*.48);let ie=null;for(let oe=0;oe<$.events.length;oe++){const Ee=$.events[oe];if(Ee.type==="hit"){ie=Ee;break}}ie&&me.addKick(ie.x-Ut.position.x,ie.z-Ut.position.z,.03+ft*.05)}xn=le;for(let Nt=0;Nt<$.events.length;Nt++){const ft=$.events[Nt];if(ft.type!=="notify")continue;const ie=Number.isFinite(ft.value)?ft.value:0;if(ft.name==="blade-air"){const oe=Math.max(0,Math.min(1,ie));x.pulse((Jt.weapon==="greatsword"?.9:.55)*(.4+.6*oe))}}y.position.set(Ut.position.x,Ut.position.y,Ut.position.z),A=Ut.bodyYaw,y.rotation.y=E.update(A,Dt,((Xe=e.renderInterp)==null?void 0:Xe.yawSmoothMs)??0);const ge=$.dash.phase==="active"&&$.dash.kind==="roll",P=ge&&$.dash.duration>0?Math.min(1,1-$.dash.timer/$.dash.duration):0;if(S.rotation.x=ge?P*Math.PI*2:0,S.position.y=w-(ge?.2*Math.sin(Math.PI*P):0),he>0&&v.update(Ut,Jt,$.playerHurt,he,$.abilities.channeling,$.time,$.playerLink,$.turnInPlace),x.update(he,he>0?v.weaponBlade():null,he>0&&(Jt.phase==="active"||$.playerLink.phase==="active"||ge&&$.dash.duration>0)),he>0)for(let Nt=0;Nt<R.length;Nt++)$.dummies[Nt]&&R[Nt].update($.dummies[Nt],he,$.time);const j=me.camera.position,it=Math.atan2(j.x-Ut.position.x,j.z-Ut.position.z),st=$.config.gaze.hurtHoldSec,q=$.time-$.playerHurt.lastAt,Rt=st>0&&q>=0&&q<st?1-q/st:0,Ht=o2($.gaze.active,$.gaze.threat,Rt,$.time,D);r2(W,N,Tt,St,Ht.level),et=f2(Ut.grounded,Ut.position.y,et),mt.mesh.position.set(Ut.position.x,et+.028,Ut.position.z),mt.update(Ht.arcRad,Ht.opacity,Ht.scale,W,it);const Zt=$.config.abilities.arcane,Yt=Math.max(1,Math.floor(Zt.waves)),se=Math.max(1e-4,Zt.waveInterval),te=h2({charging:Jt.charging,charge:Jt.charge,channeling:$.abilities.channeling,fireTimer:$.abilities.fireTimer,fireInterval:se,channelProgress:$.abilities.channeling?($.abilities.waveIndex+(1-Math.min(1,Math.max(0,$.abilities.fireTimer/se))))/Yt:0,arcaneCooldown:$.abilities.cooldown,arcaneCooldownMax:Zt.cooldown,dashCooldown:$.dash.cooldown,dashCooldownMax:$.dash.kind==="blink"?$.config.dash.blinkCooldown:$.config.dash.rollCooldown});Ot.mesh.position.set(Ut.position.x,Ut.position.y+.03,Ut.position.z),Ot.set(te.ratio,te.source==="none"?0:D.meterOpacity,te.source==="charge"?yt:te.source==="channel"?gt:Lt,it);const Wt=$.playerLink,ue=Wt.weapon?$.config.links.moves[Wt.weapon]:void 0,Qt=d2(Wt.phase,Ut.position.x,Ut.position.z,Wt.facing,Wt.travel,(ue==null?void 0:ue.hit.radius)??.9);dt.set(Qt.x,Qt.z,ut(Qt.x,Qt.z,Ut.position.y)+.042,Qt.radius,Qt.active?D.landingOpacity:0,$.time);for(let Nt=0;Nt<lt.length;Nt++){const ft=$.dummies[Nt],ie=lt[Nt],oe=at[Nt],Ee=$t[Nt];if(!ft){ie.mesh.visible=!1,oe.mesh.visible=!1,Ee.mesh.visible=!1;continue}const dn=$.targeting.hasTarget&&$.targeting.targetId===ft.id;if(Ix($,ft)){const wn=zx($,ft);W.copy(Tt).lerp(St,wn)}else W.copy(zt);const Ae=l2(ft.attackPhase,ft.attackPhaseTimer,$.config.dummies.attackWindup);Ae.active?(W.lerp(U,.5*Ae.urgency),Ee.mesh.position.set(ft.position.x,ft.position.y+.031,ft.position.z),Ee.set(Ae.ratio,D.warnOpacity*(.65+.35*Ae.urgency),U,it)):Ee.set(0,0,U,it);const bn=dn?1:0,Re=bn>J[Nt]?D.haloFadeInSec:D.haloFadeOutSec;J[Nt]=ap(J[Nt],bn,Dt,Re);const fe=J[Nt],Pe=1+.02*fe*Math.sin($.time*2.2+ft.id),Ve=D.arcDeg+(D.selectedArcDeg-D.arcDeg)*fe;ie.mesh.position.set(ft.position.x,ft.position.y+.022,ft.position.z),ie.update(Ve*Math.PI/180,D.opacity+(D.selectedOpacity-D.opacity)*fe,1+(D.selectedScale-1)*fe*Pe,W,it,1+(D.selectedThicknessScale-1)*fe),ht[Nt]=ap(ht[Nt],bn,Dt,bn>ht[Nt]?D.haloFadeInSec:D.haloFadeOutSec);const un=ht[Nt];oe.mesh.position.set(ft.position.x,ft.position.y+.019,ft.position.z),oe.update(Ve*Math.PI/180,D.haloOpacity*un*(.88+.12*Math.sin($.time*2.2+ft.id)),D.selectedScale*(.94+.06*un)*Pe,W,it)}T.position.set(Ut.position.x,Ut.position.y,Ut.position.z),T.rotation.y=Jt.phase!=="idle"?Jt.attackFacing:Ut.bodyYaw,Se.update($,Dt,Nt=>me.addShake(Nt));const ve=H.slashEnabled&&Jt.phase==="active"&&Jt.comboIndex>=3;Et.opacity=ve?.7:0,bt.opacity=ve?H.slashGlowOpacity:0,ve&&(X.rotation.z=-1.2+Jt.attackProgress*3.2,X.scale.setScalar(.9+Jt.comboIndex*.13));for(let Nt=0;Nt<de.length;Nt++){const ft=$.abilities.projectiles[Nt],ie=de[Nt];ie.group.visible=!!ft,ft&&(ie.group.position.set(ft.x,ft.y,ft.z),ie.group.scale.setScalar(ft.radius),ie.group.rotation.set(0,Math.atan2(ft.dirX,ft.dirZ),0))}for(let Nt=0;Nt<ne.length;Nt++){const ft=$.abilities.rings[Nt],ie=ne[Nt];if(!ft){ie.group.visible=!1;continue}const oe=Math.max(0,Math.min(1,ft.life/Math.max(ft.duration,1e-6))),Ee=u2(Math.max(0,ft.duration-ft.life),D.areaExpandSec);ie.set(ft.x,ft.z,ut(ft.x,ft.z,Ut.position.y)+.045,ft.radius*Ee.scale,D.areaOpacity*(.35+.65*oe)*Ee.alpha,$.time)}for(let Nt=0;Nt<_t.length;Nt++){const ft=$.arrows[Nt],ie=_t[Nt];if(!ft){ie.group.visible=!1,ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=0;continue}const oe=ft.stuck&&ft.stuckDummy>=0;if(ie.arrowId!==ft.id){if(ie.bone&&(r.attach(ie.group),ie.bone=null),ie.arrowId=ft.id,ie.group.position.set(ft.x,ft.y,ft.z),ie.group.rotation.set(ft.pitch,ft.yaw,0,"YXZ"),oe){const dn=R[ft.stuckDummy],Ae=dn?dn.boneAtWorld(ft.x,ft.y,ft.z):null;Ae&&(Ae.node.attach(ie.group),ie.bone=Ae.node)}}else ie.bone||(ie.group.position.set(ft.x,ft.y,ft.z),ie.group.rotation.set(ft.pitch,ft.yaw,0,"YXZ"));ie.group.visible=!0;const Ee=ft.stuck?Math.min(1,ft.rest/.6):1;ie.shaftMat.opacity=Ee,ie.tipMat.opacity=Ee,ie.glowMat.opacity=(ft.stuck?.28:.85)*Ee,ie.trailMat.opacity=ft.stuck?0:H.trailOpacity*Ee,ie.trail.visible=!ft.stuck}_.update($,Dt),me.update(Ut.position.x,Ut.position.y,Ut.position.z,Dt,$.camera),o.render(r,me.camera)},resize(){const $=Math.max(1,n.clientWidth),Dt=Math.max(1,n.clientHeight);o.setSize($,Dt,!1),me.resize($/Dt)},getGroundBasis(){return me.getGroundBasis()},setCollidersVisible($){for(const Dt of d)Dt.opacity=$?.3:1,Dt.wireframe=$,Dt.transparent=$,Dt.depthWrite=!$,Dt.needsUpdate=!0},setGridVisible($){f.visible=$},setLabVisible($){m.setVisible($)},setLabLabelsVisible($){m.setLabelsVisible($)},snapCamera($,Dt,Ut){me.snap($,Dt,Ut)},setZoom($){me.setZoom($)},setBodyType($){var Ut;const Dt=(Ut=e.bodyTypes)==null?void 0:Ut[$];return!Dt||$===p||(S.remove(v.group),v.dispose(),v=g(Dt),v.group.position.y=-w,S.add(v.group),x.reset(),p=$,t.config.characterHeight=Dt.height,Dt.radius!==void 0&&(t.config.characterRadius=Dt.radius)),p},bodyTypes(){return{id:p,ids:Object.keys(e.bodyTypes??{})}},pickDummy:ze,dummyRenderCount:()=>R.length,projectToScreen:Le,dummyRigDebug($){const Dt=R[$-1];return Dt!=null&&Dt.debug?Dt.debug():null},diagnostics(){const $=i0(e.camera.pitchDeg),Dt=m2($,T.rotation.y);return{lean:v.lean(),slashNormal:Dt,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:S.rotation.x,activeRings:Se.activeDash(),lastKind:Se.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...me.smart(),shake:me.shakeLevel(),kick:me.kickLevel(),kickCount:me.kickCount()}}},dispose(){v.dispose(),m.dispose(),_.dispose();for(const $ of R)$.dispose();mt.dispose();for(const $ of lt)$.dispose();for(const $ of at)$.dispose();Ot.dispose(),x.dispose();for(const $ of $t)$.dispose();dt.dispose(),Pt.dispose(),Et.dispose(),bt.dispose(),Q.dispose(),Ct.dispose(),wt.dispose(),jt.dispose(),ce.dispose();for(const $ of ne)$.dispose();Bt.dispose(),Ft.dispose(),At.dispose(),z.dispose();for(const $ of _t)$.shaftMat.dispose(),$.tipMat.dispose(),$.glowMat.dispose(),$.trailMat.dispose();ot.dispose(),It.dispose(),Se.dispose(),u.traverse($=>{$ instanceof be&&$.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function R2(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function P2(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function C2(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=v=>e.querySelector(`#${v}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),c=i("diag-clear"),l=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function _(){const v=n.status();a.textContent=v.enabled?`已记录 ${v.durationS.toFixed(1)}s · ${v.frames} 帧 · 事件 ${v.events} · 异常 ${v.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",l.textContent=v.enabled?"暂停记录":"继续记录"}function g(v){h=v,e.hidden=!v,v?_():s.hidden=!0}function p(v){o.textContent=v,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const v=n.summary();R2(v).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=v,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const v=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);P2(`harness-${v.meta.version}-${x}.json`,JSON.stringify(v)),p("已导出")}),c.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),l.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const v=n.status();t==null||t.classList.toggle("is-alert",v.alert),h&&_()},isOpen:()=>h,close:()=>g(!1)}}const L2={intents:{...rp},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function D2(){var dt;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=Zx(S_,wo),i=A2(n,e,vn,wo.stations),a=tv(e),s=oM(t),o=rM(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.67 · 11-09 16:48 · 诊断");const c=W=>String(W).padStart(2,"0"),l=new Date,d=Cv({meta:{version:"v0.9.67",buildTime:"11-09 16:48",startedAt:`${c(l.getMonth()+1)}-${c(l.getDate())} ${c(l.getHours())}:${c(l.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=C2(d,r),h=iM({deadZone:()=>vn.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0,phaseSource:()=>i.gaitDebug().phase});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:vn.showColliders,showGrid:vn.showGrid,showLab:vn.lab.enabled,showLabLabels:vn.lab.showLabels};let m=1,_=!1;const g=yv({maxRadiusPx:()=>vn.joystick.maxRadiusPx,deadZone:vn.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>vn.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let v=e.combat.weapon;function x(W){if(W===v)return;v=W;const N=ca.indexOf(W)+1;for(const zt of p)zt.classList.toggle("is-active",Number(zt.dataset.weapon)===N);E.refreshWeapon()}let y=L2,w=0;const S=()=>{m=1,i.setZoom(1)},E=F_(e,vn,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({...rp,resetPressed:!0})},resetZoom:S,onToggleColliders:W=>i.setCollidersVisible(W),onToggleGrid:W=>i.setGridVisible(W),onToggleLab:W=>i.setLabVisible(W),onToggleLabLabels:W=>i.setLabLabelsVisible(W),setFighterMode:W=>{for(const N of e.dummies)N.weapon&&(N.mode=W,N.attackPhase="idle",N.attackPhaseTimer=0,N.attackProgress=0,N.attackCooldown=0,N.combat&&(N.combat.phase="idle",N.combat.attackProgress=0,N.combat.comboIndex=0))}}),A=O_({stations:Qi.stations,plots:fu,world:e,view:i,onResetZoom:S,onPlotTest:W=>{kl(e);const N=vx(e,W);return C(`已在「${W.name}」生成 ${N} 人 · 点「清除测试单位」回基线`),N},onClearTestUnits:()=>{const W=kl(e);return C(W>0?`已清除 ${W} 个测试单位`:"当前没有测试单位"),W}});o.register({motion:h,debug:E.gui}),window.addEventListener("resize",()=>i.resize());const b=i.bodyTypes().ids,M=document.getElementById("body-toggle"),R=W=>{var N,zt;return((zt=(N=vn.bodyTypes)==null?void 0:N[W])==null?void 0:zt.name)??W},k=()=>{if(!M)return;const W=i.bodyTypes().id;M.textContent=`体型 ${R(W)}`,M.setAttribute("aria-label",`切换体型（当前：${R(W)}，快捷键 B）`)},L=document.createElement("div");L.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(L);let D=0;const C=W=>{L.textContent=W,L.style.opacity="1",window.clearTimeout(D),D=window.setTimeout(()=>{L.style.opacity="0"},1600)},I=()=>{if(b.length<2){C("只有一个体型预设");return}const W=i.bodyTypes().id,N=Math.max(0,b.indexOf(W)),zt=i.setBodyType(b[(N+1)%b.length]);k(),C(`体型：${R(zt)}（B / 顶部胶囊切换）`)};k(),M==null||M.addEventListener("click",I);const O=document.getElementById("wind-toggle"),B=()=>{var W;return(W=e.config.grass)==null?void 0:W.wind},V=()=>{var N;if(!O)return;const W=!!((N=B())!=null&&N.enabled);O.textContent=`风：${W?"开":"关"}`,O.classList.toggle("is-off",!W),O.setAttribute("aria-label",`${W?"关闭":"开启"}风吹麦浪（当前${W?"开启":"关闭"}，快捷键 G）`)},et=()=>{const W=B();if(!W){C("本场景未启用草块");return}W.enabled=!W.enabled,V(),C(`风吹麦浪：${W.enabled?"开":"关"}（G 切换）`)};V(),O==null||O.addEventListener("click",et),window.addEventListener("keydown",W=>{W.repeat||(W.code==="KeyB"?I():W.code==="KeyG"&&et())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:vn,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:W=>i.dummyRigDebug(W),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:at,applied:J,enabled:Z,skip:ht}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),windDebug:()=>{var N;const W=i.grassDebug().wind;return{configured:!!((N=B())!=null&&N.enabled),rendered:W.enabled,time:W.time,gust:W.gust}},setWind:W=>{const N=B();return N?(N.enabled=!!W,V(),N.enabled):!1},setRenderInterp:W=>(Z=!!W,Z),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(W,N,zt)=>i.projectPoint(W,N,zt),setBodyType:W=>{const N=i.setBodyType(W);return k(),N},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var W;return Object.keys(((W=vn.animation.swing)==null?void 0:W.clips)??{})},preview:W=>{const N=e.combat,zt={...N};N.weapon=W.weapon,N.phase="active",N.comboIndex=Math.max(1,Math.min(3,Math.floor(W.comboIndex))),N.attackProgress=Math.max(0,Math.min(1,W.progress)),N.attackFacing=e.character.bodyYaw,i.setClipT(typeof W.t=="number"?W.t:null);const Tt=Math.max(1,Math.min(30,Math.floor(W.warm??12)));_=!0;for(let St=0;St<Tt;St++)i.render(e,1/60);return i.setClipT(null),Object.assign(N,zt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:W=>{e.character.bodyYaw=W},zoom:W=>{m=hu(W,1,vn.zoom.min,vn.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.67",count:Qi.plots.length,diagnostics:Qi.diagnostics,testUnits:yx(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),plots:Qi.plots.map(W=>({id:W.id,index:W.index,placement:W.placement,slot:W.slot,centerX:W.centerX,centerZ:W.centerZ,spawnX:W.station.spawnX,spawnZ:W.station.spawnZ,hasTest:!!W.testSpawn}))}),spawnAt:W=>A.spawnAt(W),clearSpawned:()=>A.clearSpawned(),lab:{stations:Qi.stations,plots:fu,goto:W=>A.goto(W),current:()=>A.current(),recall:()=>A.recall(),spawnAt:W=>A.spawnAt(W),clearSpawned:()=>A.clearSpawned()}};let ut=performance.now(),mt=60,kt=0,Z=((dt=vn.renderInterp)==null?void 0:dt.enabled)??!0,nt=lu(e),lt=null,at=1,J=!1,ht="";function Ot(W){const N=Z&&!f.paused&&f.timeScale>0;if(J=!1,ht="",!N)return ht="off",at=1,e;if(!lt)return ht="noprev",at=1,e;if(!nv(lt,nt))return ht="key",at=1,e;const zt=a.alpha;return at=zt,zt>=.999?(ht="alpha",e):(J=!0,av(e,iv(lt,nt,zt)))}function $t(W){const N=Math.min((W-ut)/1e3,.1);ut=W,N>0&&(mt=mt*.9+1/N*.1);const zt=g.sample();zt.intents.resetPressed&&(m=1),m=hu(m,zt.zoomScale,vn.zoom.min,vn.zoom.max),i.setZoom(m);let Tt=zt.intents.dummyClickId;if(zt.tap){const gt=i.pickDummy(zt.tap.x,zt.tap.y);gt>0&&(Tt=gt)}Tt>0&&(w=Tt),y={...zt,intents:{...zt.intents,dummyClickId:w}};const St=a.frame(N,y.intents,f.timeScale,f.paused,()=>{const gt=e.events;for(let Lt=0;Lt<gt.length;Lt++)d.event(gt[Lt],e.time);lt=nt,nt=lu(e)});St>0&&(w=0),d.sample(e,y,N*1e3,St);for(const gt of y.gestures)d.gesture(gt);W-kt>250&&(kt=W,u.tick()),x(e.combat.weapon),_||i.render(Ot(),N),A.tick(),h.update(e,y,i.getGroundBasis());const yt=i.diagnostics();s.update(e,mt,St,y,f,{attackBlend:yt.attackBlend,attackWeights:yt.attackWeights,landing:yt.landing,hurt:yt.hurt,ik:yt.ik,zoom:yt.camera.zoom},o.hudCompact()),requestAnimationFrame($t)}requestAnimationFrame($t)}D2();

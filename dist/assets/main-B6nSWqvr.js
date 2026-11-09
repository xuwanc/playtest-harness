(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=e(a);fetch(a.href,s)}})();const na=["sword-shield","dual-swords","greatsword","staff","bow"],f0=["wander","follow","keep-distance","attack","idle"],zf=["spar","wander","follow","keep-distance","attack","idle"],Ff={moveX:0,moveZ:0,jumpPressed:!1,sprintHeld:!1,sprintPressed:!1,resetPressed:!1,attackPressed:!1,attackHeld:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0,aimX:0,aimZ:0,aimActive:!1},br=1e-6;function ro(n,t){return t.aimActive&&Math.hypot(t.aimX,t.aimZ)>br?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:Math.hypot(t.moveX,t.moveZ)>br?Math.atan2(t.moveX,t.moveZ):n.character.facing}function p0(n,t){if(t.aimActive&&Math.hypot(t.aimX,t.aimZ)>br){const a=Math.hypot(t.aimX,t.aimZ);return{x:t.aimX/a,z:t.aimZ/a}}const e=Math.hypot(t.moveX,t.moveZ);if(e>br)return{x:t.moveX/e,z:t.moveZ/e};const i=n.character.facing;return{x:Math.sin(i),z:Math.cos(i)}}const We=1e-6,Ki=Math.PI/180,vh=-1e9;function Uf(){return{type:"none",lastAt:vh,timer:0,duration:0,dirX:0,dirZ:0,knockX:0,knockZ:0}}function Js(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Sd(n,t,e,i,a){n.type=t,n.duration=e,n.timer=e,n.dirX=i,n.dirZ=a,n.knockX=0,n.knockZ=0}function yh(n,t,e){var c,d;const i=e.duration>0?e.duration:Or(n,e.type);if(t.kind==="player"){const u=n.playerHurt;if(Sd(u,e.type,i,e.dirX,e.dirZ),u.lastAt=n.time,!n.config.hits.noDamageToPlayer&&e.knockback>We){const h=e.knockback*n.config.hits.knockbackDecay;u.knockX=e.dirX*h,u.knockZ=e.dirZ*h}Js(n,"player-hurt",e.sourceId??0,n.character.position);return}const a=n.dummies[t.index];if(!a)return;if(Sd(a.hurt,e.type,i,e.dirX,e.dirZ),e.knockback>We){const u=e.knockback*n.config.hits.knockbackDecay;a.hurt.knockX=e.dirX*u,a.hurt.knockZ=e.dirZ*u}n.hitCount+=1,Js(n,"hit",a.id,a.position);const s=n.config.hits.hitstop;let o=((c=n.config.hits.hitstopByWeapon)==null?void 0:c[n.combat.weapon])??1;const r=n.config.hits.hitstopComboFalloff;if(r&&r.length>0){const u=Math.max(0,Math.min(r.length-1,n.combat.comboIndex-1));o*=Math.max(0,r[u])}o*=Math.max(0,e.holdMul??1);const l=s&&e.type!=="none"?(s[e.type]??0)*Math.max(0,o):0;l>0&&n.combat.hitstop<l&&(n.combat.hitstop=l,n.combat.warpPhase=1,n.combat.warp=(d=n.config.hits.hitstopWarp)!=null&&d.enabled?Math.max(0,Math.min(1,n.config.hits.hitstopWarp.holdRate)):0,Js(n,"hitstop",l,a.position))}function _o(n,t,e){yh(n,{kind:"dummy",index:t},e)}function m0(n,t){const e=[n.playerHurt];for(const a of n.dummies)e.push(a.hurt);const i=Math.exp(-n.config.hits.knockbackDecay*t);for(const a of e)a.timer>0&&(a.timer=Math.max(0,a.timer-t),a.timer===0&&(a.type="none",a.knockX=0,a.knockZ=0)),(a.knockX!==0||a.knockZ!==0)&&(a.knockX*=i,a.knockZ*=i,Math.abs(a.knockX)<1e-4&&(a.knockX=0),Math.abs(a.knockZ)<1e-4&&(a.knockZ=0))}function Or(n,t){const e=n.config.hits;return t==="knock"?e.hurtKnock:t==="heavy"?e.hurtHeavy:e.hurtLight}function Sr(n,t){if(n.length===0)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++){const[i,a]=n[e];if(t<=i){const[s,o]=n[e-1],r=i>s?(t-s)/(i-s):1;return o+(a-o)*r}}return n[n.length-1][1]}function Nf(n){let t=n;for(;t>180;)t-=360;for(;t<-180;)t+=360;return t}function g0(n){var _,g;const t=n.combat,e=n.character.position,i={active:!1,x:e.x,z:e.z,facing:t.attackFacing,fx:Math.sin(t.attackFacing),fz:Math.cos(t.attackFacing),reach:0,cosArc:1,sweepActive:!1,sweepLo:0,sweepHi:0,slamRadius:0,slamX:e.x,slamZ:e.z};if(t.phase!=="active"||t.weapon==="bow")return i;const a=n.config.hits,s=n.config.combat.weapons[t.weapon],o=s==null?void 0:s.hitWindow,r=o?Math.min(1,Math.max(0,o.start)):0,l=o?Math.min(1,Math.max(r,o.end)):1,c=t.timings.active,d=c>We?Math.min(1,Math.max(0,t.phaseTimer/c)):1;if(d<r-We||d>l+We)return i;i.active=!0,i.reach=a.reach[t.weapon]??0,i.cosArc=Math.cos(Math.min(90,Math.max(0,a.arcDeg))*Ki);const u=s==null?void 0:s.hitSweep,h=((_=u==null?void 0:u.byCombo)==null?void 0:_[String(t.comboIndex)])??((g=u==null?void 0:u.byCombo)==null?void 0:g["1"]),f=(u==null?void 0:u.tolDeg)??10;if(h){if(typeof h.stabU=="number"){if(d<h.stabU)return i.active=!1,i}else if(h.pts&&h.pts.length>=2){const p=Sr(h.pts,0),v=Sr(h.pts,d);i.sweepActive=!0,i.sweepLo=Math.min(p,v)-f,i.sweepHi=Math.max(p,v)+f}}const m=s==null?void 0:s.groundSlam;return m&&d>=m.slamU-We&&t.slamAttackId===t.attackId&&(i.slamRadius=Math.max(0,m.radius),i.slamX=e.x+i.fx*Math.min(i.slamRadius*.25,.5),i.slamZ=e.z+i.fz*Math.min(i.slamRadius*.25,.5)),i}function x0(n,t,e,i){if(!n.active)return!1;const a=t-n.x,s=e-n.z,o=Math.sqrt(a*a+s*s);if(o>n.reach+i||o>We&&(a*n.fx+s*n.fz)/o<n.cosArc)return!1;if(n.sweepActive){const r=Nf(Math.atan2(a,s)/Ki-n.facing/Ki);if(r<n.sweepLo||r>n.sweepHi)return!1}return!0}function v0(n,t,e,i){if(n.slamRadius<=0)return!1;const a=t-n.slamX,s=e-n.slamZ;return a*a+s*s<=(n.slamRadius+i)*(n.slamRadius+i)}function y0(n){var S,T;const t=n.combat,e=n.config.hits,i=n.character.position;if(t.weapon==="bow")return;const a=n.config.combat.weapons[t.weapon],s=a==null?void 0:a.hitWindow,o=s?Math.min(1,Math.max(0,s.start)):0,r=s?Math.min(1,Math.max(o,s.end)):1,l=t.timings.active,c=l>We?Math.min(1,Math.max(0,t.phaseTimer/l)):1;if(c<o-We||c>r+We)return;const d=e.reach[t.weapon]??0,u=Math.cos(Math.min(90,Math.max(0,e.arcDeg))*Ki),h=Math.sin(t.attackFacing),f=Math.cos(t.attackFacing),m=n.config.dummies.radius,_=n.config.targeting.idealRange,g=a==null?void 0:a.hitSweep,p=((S=g==null?void 0:g.byCombo)==null?void 0:S[String(t.comboIndex)])??((T=g==null?void 0:g.byCombo)==null?void 0:T["1"]),v=(g==null?void 0:g.tolDeg)??10;let x=0,y=0,w=!1;if(p){if(typeof p.stabU=="number"){if(c<p.stabU)return}else if(p.pts&&p.pts.length>=2){const E=Sr(p.pts,0),M=Sr(p.pts,c);x=Math.min(E,M)-v,y=Math.max(E,M)+v,w=!0}}for(const E of n.dummies){if(t.hitIds.indexOf(E.id)>=0)continue;const M=E.position.x-i.x,b=E.position.z-i.z,R=Math.hypot(M,b);if(R>d+m)continue;const k=R>We?M/R:h,C=R>We?b/R:f;if(R>We&&(M*h+b*f)/R<u)continue;if(w){const B=Nf(Math.atan2(M,b)/Ki-t.attackFacing/Ki);if(B<x||B>y)continue}let I="light";t.weapon==="greatsword"?I="knock":t.comboIndex>=3&&(I="heavy");const L=e.knockback[t.weapon]??0;let D=R;L>0&&(D=Math.max(R+L,_));const O=Math.max(0,D-R);_o(n,n.dummies.indexOf(E),{type:I,duration:Or(n,I),dirX:k,dirZ:C,knockback:O}),t.hitIds.push(E.id)}}function _0(n){const t=n.combat,e=n.config.combat.weapons[t.weapon],i=e==null?void 0:e.groundSlam;if(!i||t.slamAttackId===t.attackId)return;const a=t.timings.active;if((a>We?Math.min(1,Math.max(0,t.phaseTimer/a)):1)<i.slamU-We)return;t.slamAttackId=t.attackId;const o=n.config.hits,r=n.character.position,l=Math.sin(t.attackFacing),c=Math.cos(t.attackFacing),d=n.config.dummies.radius,u=Math.max(0,i.radius),h=i.onlyUnhit!==!1,f=i.type??(t.weapon==="greatsword"?"knock":"heavy"),m=i.knockback??o.knockback[t.weapon]??0,_=n.config.targeting.idealRange,g=i.holdMul??1.6;for(let p=0;p<n.dummies.length;p++){const v=n.dummies[p];if(h&&t.hitIds.indexOf(v.id)>=0)continue;const x=v.position.x-r.x,y=v.position.z-r.z,w=Math.hypot(x,y);if(w>u+d)continue;const S=w>We?x/w:l,T=w>We?y/w:c,E=m>0?Math.max(w+m,_):w,M=Math.max(0,E-w);_o(n,p,{type:f,duration:Or(n,f),dirX:S,dirZ:T,knockback:M,holdMul:g}),t.hitIds.push(v.id)}Js(n,"ground-slam",u,{x:r.x+l*Math.min(u*.25,.5),y:r.y,z:r.z+c*Math.min(u*.25,.5)})}function M0(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="active")return;const a=i.weapon===""?void 0:e.moves[i.weapon];if(!a||!a.enabled||!n.modules.hits||!n.modules.dummies)return;const s=a.hit;if(i.pulseTimer-=t,i.pulseTimer>0)return;i.pulseTimer=Math.max(s.pulseInterval,0);const o=n.character.position,r=i.fromX,l=i.fromZ,c=o.x,d=o.z,u=c-r,h=d-l,f=u*u+h*h,m=Math.sin(i.facing),_=Math.cos(i.facing),g=Math.cos(wd(s.arcDeg,0,180)*Ki),p=n.config.dummies.radius;for(let v=0;v<n.dummies.length;v++){const x=n.dummies[v];if(i.hitIds.indexOf(x.id)>=0)continue;const y=f>We?wd(((x.position.x-r)*u+(x.position.z-l)*h)/f,0,1):0,w=r+u*y,S=l+h*y,T=Math.hypot(x.position.x-w,x.position.z-S);let E=!1;if(s.shape==="circle")E=T<=s.radius+p;else if(s.shape==="capsule")E=T<=Math.max(s.radius,s.width)+p;else{const I=x.position.x-c,L=x.position.z-d,D=Math.hypot(I,L),O=D>We?(I*m+L*_)/D>=g:!0;E=D<=s.radius+p&&O||T<=s.width+p}if(!E)continue;const M=x.position.x-r,b=x.position.z-l,R=Math.hypot(M,b);if(R>We&&(M*m+b*_)/R<Math.cos(Math.max(s.arcDeg,90)*Ki))continue;const k=R>We?M/R:m,C=R>We?b/R:_;yh(n,{kind:"dummy",index:v},{type:s.type,duration:s.duration,dirX:k,dirZ:C,knockback:s.knockback}),i.hitIds.push(x.id),Js(n,"link-hit",x.id,x.position)}}function b0(n){const t=n.config.hits,e=n.config.dummies.fighters,i=n.character.position;for(const a of n.events){if(a.type!=="dummy-hit")continue;const s=n.dummies[a.value-1];if(!s)continue;const o=s.weapon?t.reach[s.weapon]??t.dummyReach:t.dummyReach,r=i.x-s.position.x,l=i.z-s.position.z,c=Math.hypot(r,l);if(c>o)continue;const d=c>We?r/c:0,u=c>We?l/c:1,f=(s.weapon?Math.max(t.knockback[s.weapon]??0,t.dummyKnockback):t.dummyKnockback)*(s.weapon?(e==null?void 0:e.knockbackScale)??1:1),_=s.weapon==="greatsword"&&s.attackComboLeft<=0?"knock":"light";yh(n,{kind:"player"},{type:_,duration:Or(n,_),dirX:d,dirZ:u,knockback:f,sourceId:s.id})}}function S0(n,t){n.modules.hits&&(n.combat.phase==="active"&&(y0(n),_0(n)),M0(n,t),b0(n))}function wd(n,t,e){return n<t?t:n>e?e:n}const Of=Math.PI/180,_h=1e-6;function w0(){return{phase:"idle",fromYaw:0,targetYaw:0,dir:1,progress:0,armTime:0}}function wr(n){const t=n.turnInPlace;t.phase="idle",t.fromYaw=0,t.targetYaw=0,t.dir=1,t.progress=0,t.armTime=0}function Bf(n,t,e){return n.modules.gaze&&n.gaze.active?n.gaze.centroidYaw:t.aimActive&&Math.hypot(t.aimX,t.aimZ)>_h?Math.atan2(t.aimX,t.aimZ):n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget?n.targeting.targetYaw:null}function Hf(n,t,e){const i=n.character,a=Math.hypot(i.velocity.x,i.velocity.z),s=Math.hypot(t.moveX,t.moveZ),o=n.combat.phase!=="idle"||n.combat.charging||n.abilities.channeling||n.dash.phase!=="idle"||n.playerLink.phase!=="idle"||n.playerHurt.type!=="none"||t.attackPressed||t.attackHeld||t.skill2Pressed||t.sprintPressed||t.jumpPressed;return i.grounded&&a<=Math.max(0,e.idleSpeedRatio)*Math.max(n.config.moveSpeed,_h)&&s<=Math.max(0,e.inputDeadZone)&&!o}function E0(n){const t=n<0?0:n>1?1:n;return t*t*(3-2*t)}function T0(n,t){const e=n.config.turnInPlace;if(!e.enabled||!n.modules.turnInPlace||!Hf(n,t,e))return!1;const i=Bf(n,t,e.lookRange);if(i===null)return!1;const a=Ye(i-n.character.bodyYaw);return Math.abs(a)>Gf(n,e)}function Gf(n,t){const i=n.modules.gaze&&n.gaze.active?Math.max(t.triggerDeg,t.gazeTriggerDeg):t.triggerDeg;return Math.max(0,i)*Of}function A0(n,t,e){const i=n.turnInPlace,a=n.config.turnInPlace;if(!a.enabled||!n.modules.turnInPlace||!Hf(n,e,a)){wr(n);return}const s=Bf(n,e,a.lookRange);if(s===null){wr(n);return}const o=n.character,r=Ye(s-o.bodyYaw),l=Math.abs(r),c=Gf(n,a),d=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>_h;if(i.phase==="idle"&&(i.armTime=l>=c?i.armTime+t:0,l>c&&i.armTime>=Math.max(0,a.armSec))){i.phase="active",i.fromYaw=o.bodyYaw,i.dir=r>=0?1:-1;const u=Math.min(l,Math.max(0,a.settleDeg)*Of);i.targetYaw=Ye(o.bodyYaw+i.dir*(l-u)),i.progress=0}if(i.phase==="active"){const u=Math.max(a.durationSec,n.config.fixedDt);i.progress=Math.min(1,i.progress+t/u);const h=Ye(i.targetYaw-i.fromYaw);o.bodyYaw=Ye(i.fromYaw+h*E0(i.progress)),d||(o.facing=o.bodyYaw),i.progress>=1&&(i.phase="idle",i.progress=0,i.armTime=0)}}const Ji=1e-6;function Ye(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Ro(n,t,e,i){const a=Ye(t-n);return n+a*(1-Math.exp(-Math.max(e,Ji)*i))}function Po(n,t,e,i,a){const o=Ye(t-n)*(1-Math.exp(-Math.max(e,Ji)*a)),r=Math.max(i,0)*a;return r<=Ji?n:n+cs(o,-r,r)}function Ed(n,t,e,i,a){const s=(t-n)*(1-Math.exp(-Math.max(e,Ji)*a)),o=Math.max(i,0)*a;return o<=Ji?n+s:n+cs(s,-o,o)}function cs(n,t,e){return n<t?t:n>e?e:n}function Td(n,t,e,i){const a=Ye(t-n),s=Math.abs(a);return s<=i||s<=e?t:Ye(n+Math.sign(a)*Math.max(e,0))}function R0(n,t,e){const i=n.character,a=n.config.orientation,s=n.combat,o=n.modules.gaze&&n.gaze.active,r=n.abilities.channeling,l=s.phase!=="idle"||s.charging||r||n.dash.phase!=="idle",c=o&&!l,d=Math.hypot(e.moveX,e.moveZ),u=e.aimActive&&Math.hypot(e.aimX,e.aimZ)>Ji,h=s.charging&&s.weapon==="bow"&&n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;if(s.phase!=="idle")i.facing=s.attackFacing;else if(r)i.facing=ro(n,e);else if(c)i.facing=Po(i.facing,n.gaze.centroidYaw,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t);else if(u)i.facing=ro(n,e);else if(h)i.facing=n.targeting.targetYaw;else if(d>Math.max(a.facingDeadZone,Ji)){const b=Math.atan2(e.moveX,e.moveZ),R=a.facingTurnRate*Math.PI/180*t,k=a.facingSnapDeg*Math.PI/180;if(d>=.35)i.facing=Td(i.facing,b,R,k);else if(d>=a.facingMinMagnitude&&Math.abs(Ye(b-i.facing))>a.facingDeadbandDeg*Math.PI/180){const I=Ro(i.facing,b,a.facingSmoothRate,t);i.facing=Td(i.facing,I,R,0)}}const f=i.velocity;Math.hypot(f.x,f.z)>.15&&(i.moveYaw=Math.atan2(f.x,f.z));const m=c?n.gaze.centroidYaw:i.facing;n.turnInPlace.phase==="active"||T0(n,e)||(c?i.bodyYaw=Po(i.bodyYaw,m,n.config.gaze.bodyTurnRate,n.config.gaze.maxBodySpeedDeg*Math.PI/180,t):i.bodyYaw=Ro(i.bodyYaw,m,a.bodyTurnRate,t));const g=n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget;let p=i.facing;if(o?p=c?n.gaze.mainYaw:i.facing:u?p=Math.atan2(e.aimX,e.aimZ):g&&(p=n.targeting.targetYaw),!o){const b=n.config.gaze.headLookLimitDeg*Math.PI/180;Math.abs(Ye(p-i.bodyYaw))>b&&(p=i.moveYaw)}const v=o||u||g,x=a.maxHeadTurnDeg*Math.PI/180;let y;if(v){const b=c?n.config.gaze.headTurnRate:a.headTurnRate;y=c?Po(i.headYaw,p,b,n.config.gaze.maxHeadSpeedDeg*Math.PI/180,t):Ro(i.headYaw,p,b,t)}else{const b=Ye(i.headYaw-i.bodyYaw),R=Ye(p-i.bodyYaw),k=Math.abs(R)<Math.abs(b)-1e-9,C=k?n.config.gaze.headReturnRate:a.headTurnRate,I=k?n.config.gaze.headReturnSpeedDeg*Math.PI/180:Number.POSITIVE_INFINITY,L=Number.isFinite(I)?Po(b,R,C,I,t):Ro(b,R,C,t);y=i.bodyYaw+L}const w=Ye(y-i.bodyYaw);w>x?y=i.bodyYaw+x:w<-x&&(y=i.bodyYaw-x),i.headYaw=y;const S=n.config.gaze;let T=0;if(c)T=n.gaze.mainPitch;else if(n.config.targeting.targetAssist&&n.modules.targeting&&n.targeting.hasTarget){const b=n.dummies[n.targeting.targetId-1];if(b){const R=i.position.y+n.config.characterHeight*cs(S.eyeHeightRatio,0,1),k=b.position.y+n.config.dummies.height*cs(S.aimHeightRatio,0,1),C=Math.hypot(b.position.x-i.position.x,b.position.z-i.position.z);T=Math.atan2(k-R,Math.max(Ji,C))}}const E=Math.max(0,S.maxHeadPitchDeg)*Math.PI/180;T=cs(T,-E,E);const M=v?S.headPitchRate:Math.min(S.headPitchRate,S.headReturnRate);i.headPitch=Ed(i.headPitch,T,M,Math.max(0,S.maxHeadPitchDeg)*4*Math.PI/180,t),i.bodyPitch=Ed(i.bodyPitch,i.headPitch*cs(S.bodyPitchScale,0,1),S.bodyPitchRate,Math.max(0,S.maxHeadPitchDeg)*Math.PI/180,t)}const Xf=1e-6,Br=Math.PI/180;function Hr(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function P0(n,t,e){const i=n.character.position,a=Math.max(0,e.homingConeDeg)*Br,s=Math.max(0,e.homingRange),o=[];for(let r=0;r<n.dummies.length;r++){const l=n.dummies[r],c=l.position.x-i.x,d=l.position.z-i.z,u=Math.hypot(c,d);u<.001||u>s||Math.abs(Ye(Math.atan2(c,d)-t))>a||o.push({i:r,d:u})}return o.sort((r,l)=>r.d-l.d||r.i-l.i),o.map(r=>r.i)}function C0(n,t){const e=Math.sin((n+1)*12.9898+(t+1)*78.233)*43758.5453;return e-Math.floor(e)}function L0(n,t){const e=n.abilities,i=n.character.position,a=Math.max(1,Math.floor(t.perWave)),s=t.spreadDeg*Br,o=Math.max(0,t.spawnSideStep),r=Math.max(0,Math.min(1,t.speedJitter)),l=P0(n,e.channelYaw,t);for(let c=0;c<a;c++){const d=(c-(a-1)*.5)*s,u=e.channelYaw+d,h=(c-(a-1)*.5)*o,f=Math.sin(u),m=Math.cos(u);e.pending.push({delay:c*Math.max(0,t.spawnDelay),x:i.x+f*.5+Math.cos(u)*h,y:i.y+1,z:i.z+m*.5-Math.sin(u)*h,yaw:u,speed:t.speed*(1+(C0(e.waveIndex,c)*2-1)*r),targetIndex:l.length>0?l[c%l.length]:-1,wave:e.waveIndex})}Hr(n,"arcane-wave",e.waveIndex,{x:i.x,y:i.y+1,z:i.z})}function D0(n,t,e){const i=n.abilities;if(i.pending.length===0)return;const a=[];for(const s of i.pending){if(s.delay-=t,s.delay>0){a.push(s);continue}const o={id:++i.nextId,x:s.x,y:s.y,z:s.z,dirX:Math.sin(s.yaw),dirZ:Math.cos(s.yaw),speed:s.speed,life:e.life,radius:e.radius,targetIndex:s.targetIndex,turnRate:Math.max(0,e.turnRateDeg)*Br,homing:Math.max(0,e.homingTime),spread:Math.max(0,e.spreadTime),retarget:0,wave:s.wave};i.projectiles.push(o),i.volleyId+=1,Hr(n,"projectile-fire",i.volleyId,o)}i.pending=a}function Ad(n,t){const e=n.abilities;e.channeling&&(e.channeling=!1,e.fireTimer=0,e.cooldown=Math.max(0,t.cooldown),e.channelMoveScale=1,e.needsRelease=!0,Hr(n,"channel-end",0,n.character.position))}function k0(n,t,e,i,a,s){const o=n.abilities,r=n.dash.phase==="active",l=n.playerLink,c=s==="skill2"?e.skill2Pressed:e.attackHeld,d=a&&c&&!r&&l.phase==="idle"&&!l.consumedAttack;if(o.cooldown>0&&(o.cooldown=Math.max(0,o.cooldown-t)),o.needsRelease&&!d&&(o.needsRelease=!1),o.channeling){if(!d){Ad(n,i);return}}else{if(!(d&&!o.needsRelease&&o.cooldown<=0))return;o.channeling=!0,o.channelId+=1,o.waveIndex=0,o.fireTimer=0,o.channelMoveScale=Math.max(0,Math.min(1,i.moveScale)),Hr(n,"channel-start",o.channelId,n.character.position)}o.channelYaw=ro(n,e),o.fireTimer-=t;let u=0;for(;o.fireTimer<=0&&u++<8;)if(o.fireTimer+=Math.max(i.waveInterval,Xf),L0(n,i),o.waveIndex+=1,o.waveIndex>=Math.max(1,Math.floor(i.waves))){Ad(n,i);break}}function I0(n,t,e){const i=Math.max(0,e.homingConeDeg)*Br,a=Math.max(0,e.homingRange),s=Math.atan2(t.dirX,t.dirZ);let o=-1,r=a+Xf;for(let l=0;l<n.dummies.length;l++){const c=n.dummies[l],d=c.position.x-t.x,u=c.position.z-t.z,h=Math.hypot(d,u);h<.001||h>r||Math.abs(Ye(Math.atan2(d,u)-s))>i||(o=l,r=h)}return o}function z0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.projectiles){if(r.spread>0)r.spread=Math.max(0,r.spread-t);else if(r.homing>0&&(r.homing=Math.max(0,r.homing-t)),r.retarget-=t,r.retarget<=0&&(r.retarget=Math.max(.05,e.retargetInterval),r.targetIndex=I0(n,r,e)),r.targetIndex>=0&&r.turnRate>0&&r.homing>0){const c=n.dummies[r.targetIndex];if(!c)r.targetIndex=-1;else{const d=Math.atan2(c.position.x-r.x,c.position.z-r.z),u=Math.atan2(r.dirX,r.dirZ),h=Ye(d-u),f=r.turnRate*t,m=Math.max(-f,Math.min(f,h)),_=u+m;r.dirX=Math.sin(_),r.dirZ=Math.cos(_)}}if(r.x+=r.dirX*r.speed*t,r.z+=r.dirZ*r.speed*t,r.life-=t,r.life<=0)continue;let l=!1;if(s)for(let c=0;c<n.dummies.length;c++){const d=n.dummies[c],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(!(u*u+h*h>f*f)){_o(n,c,{type:e.hurtType,duration:e.hurtDuration,dirX:r.dirX,dirZ:r.dirZ,knockback:e.knockback}),l=!0;break}}l||o.push(r)}i.projectiles=o}const F0={kind:"channelVolley",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params;k0(n,t,e,s,a,i.cfg.slot),D0(n,t,s),z0(n,t,s)}},fc=1e-6;function Vf(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function U0(n,t){const e=n.character.position,i={id:++n.abilities.nextId,x:e.x,z:e.z,radius:t.radius,life:t.duration,duration:t.duration,pulseTimer:0};n.abilities.rings.push(i),Vf(n,"ring-place",i.id,e)}function N0(n,t,e){const i=n.abilities,a=n.config.dummies.radius,s=n.modules.hits&&n.modules.dummies,o=[];for(const r of i.rings){r.life-=t,r.pulseTimer-=t;let l=0;for(;r.pulseTimer<=0&&l++<8;){if(r.pulseTimer+=Math.max(e.pulseInterval,fc),s)for(let c=0;c<n.dummies.length;c++){const d=n.dummies[c],u=d.position.x-r.x,h=d.position.z-r.z,f=r.radius+a;if(u*u+h*h>f*f)continue;const m=Math.hypot(u,h),_=m>fc?u/m:0,g=m>fc?h/m:1;_o(n,c,{type:"heavy",duration:e.stun,dirX:_,dirZ:g,knockback:e.knockback})}Vf(n,"ring-pulse",r.id,{x:r.x,y:0,z:r.z})}r.life>0&&o.push(r)}i.rings=o}const O0={kind:"groundRing",update({world:n,dt:t,intents:e,skill:i,onWeapon:a}){const s=i.params,o=i.cfg.slot==="attack"?e.attackPressed:e.skill2Pressed;a&&o&&n.dash.phase!=="active"&&n.playerLink.phase==="idle"&&U0(n,s),N0(n,t,s)}},B0={channelVolley:F0,groundRing:O0};function H0(n){const t=Array.isArray(n.skills)?n.skills:[],e=n.abilities;return t.map(i=>{if(i.params)return{cfg:i,params:i.params};const a=i.paramsRef,s=a?e[a]:void 0;if(!s||typeof s!="object")throw new Error(`[skills] ${i.id}: paramsRef "${a??""}" 在 core.abilities 中不存在`);return{cfg:i,params:s}})}function G0(n,t,e){for(const i of n.skills){if(i.cfg.enabled===!1)continue;const a=B0[i.cfg.kind];if(!a)continue;const s=!i.cfg.weapon||n.combat.weapon===i.cfg.weapon;a.update({world:n,dt:t,intents:e,skill:i,onWeapon:s})}}function X0(){return{channeling:!1,channelYaw:0,fireTimer:0,waveIndex:0,cooldown:0,needsRelease:!1,channelId:0,channelMoveScale:1,volleyId:0,pending:[],projectiles:[],rings:[],nextId:0}}function Wf(n){const t=n.abilities;t.channeling=!1,t.channelYaw=0,t.fireTimer=0,t.waveIndex=0,t.cooldown=0,t.needsRelease=!1,t.channelMoveScale=1,t.pending.length=0,t.projectiles.length=0,t.rings.length=0}function V0(n,t,e){G0(n,t,e)}function pc(n){n.rngState=n.rngState+1831565813>>>0;let t=n.rngState;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}const Rd=1e-6;function Pd(n,t,e){return n<t?t:n>e?e:n}function Yf(){return{distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0}}function $f(n){const t=n.camera,e=Yf();t.distanceScale=e.distanceScale,t.offsetX=e.offsetX,t.offsetZ=e.offsetZ,t.pitchDelta=e.pitchDelta,t.threat=e.threat,t.threatCount=e.threatCount,t.centroidX=n.character.position.x,t.centroidZ=n.character.position.z}function W0(n){const t=n.camera,e=n.config.camera,i=n.character.position;let a=0,s=0,o=0,r=0;for(const c of n.dummies){const d=c.position.x-i.x,u=c.position.z-i.z,h=Math.hypot(d,u);if(h>e.radius)continue;const f=Pd((e.radius-h)/Math.max(Rd,e.radius-e.nearDistance),0,1);let m=f*(e.modeWeight[c.mode]??.5);c.attackPhase==="active"&&(m+=e.attackBoost*f),a+=m,s+=c.position.x*m,o+=c.position.z*m,r+=1}const l=a<=0?0:Pd(a/(a+Math.max(Rd,e.saturation)),0,1);if(t.threat=l,t.threatCount=r,a<=0)t.centroidX=i.x,t.centroidZ=i.z,t.offsetX=0,t.offsetZ=0;else{const c=s/a,d=o/a;t.centroidX=c,t.centroidZ=d;let u=(c-i.x)*e.framingBias*l,h=(d-i.z)*e.framingBias*l;const f=Math.hypot(u,h);f>e.maxOffset&&(u=u/f*e.maxOffset,h=h/f*e.maxOffset),t.offsetX=u,t.offsetZ=h}t.distanceScale=1-e.pushIn*(1-l)+e.maxPullback*l,t.pitchDelta=e.maxPitchDelta*l}function Y0(n){const t=[],e=n.ground.size;t.push(Ha("ground","ground",0,0,e,e,-n.ground.thickness,0));for(const i of n.steps)t.push(Ha(i.id,"step",i.x,i.z,i.width,i.depth,0,i.height));for(const i of n.doorways){const a=i.openingWidth/2,s=i.wallThickness;t.push(Ha(`${i.id}-left`,"wall",i.x-a-i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ha(`${i.id}-right`,"wall",i.x+a+i.wallSpan/2,i.z,i.wallSpan,s,0,i.wallHeight)),t.push(Ha(`${i.id}-lintel`,"lintel",i.x,i.z,i.openingWidth,s,i.openingHeight,i.wallHeight))}for(const i of n.obstacles)t.push(Ha(i.id,"obstacle",i.x,i.z,i.width,i.depth,0,i.height));return t}function Ha(n,t,e,i,a,s,o,r){return{id:n,kind:t,minX:e-a/2,maxX:e+a/2,minY:o,maxY:r,minZ:i-s/2,maxZ:i+s/2}}const Zf={cellSize:.5,originX:0,originZ:14,stepX:-4.5,stepZ:-4.5,columns:4,gap:.3,spawnDz:0,labelDz:-2.8,defaultRadius:2,defaultShape:"circle",defaultColor:"#7fd8c0",bounds:{minX:-13,maxX:13,minZ:-13,maxZ:14}};function fi(n){return Math.round(n*1e6)/1e6}function $0(n,t,e){return Math.hypot(n.x-t.x,n.z-t.z)<n.r+t.r+e}const Z0=400;function j0(n,t=Zf){const e={duplicates:[],relocated:[],unplaced:[]},i=new Set,a=[];for(const h of n)if(!(!h||typeof h.id!="string"||h.id.length===0)){if(i.has(h.id)){e.duplicates.push(h.id);continue}i.add(h.id),a.push(h)}const s=[...a].sort((h,f)=>h.id<f.id?-1:h.id>f.id?1:0),o=[],r=[];for(const h of s){if(!h.anchor)continue;const f=fi(h.anchor.x),m=fi(h.anchor.z);r.push({def:h,centerX:f,centerZ:m}),o.push({x:f,z:m,r:h.radius??t.defaultRadius})}let l=0;for(const h of s)typeof h.index=="number"&&(l=Math.max(l,h.index));const c=[];let d=0;const u=(h,f,m,_,g,p)=>{const v=h.radius??t.defaultRadius,x=h.shape??t.defaultShape,y=h.color??t.defaultColor,w=h.spawn??{dx:0,dz:t.spawnDz},S=h.label??{dx:0,dz:t.labelDz},T={id:h.id,index:p,name:h.name,hint:h.hint,shape:x,x:fi(f),z:fi(m),radius:v,spawnX:fi(f+w.dx),spawnZ:fi(m+w.dz),labelX:fi(f+S.dx),labelZ:fi(m+S.dz),color:y},E=[];if(h.grass){const M=h.grass,b=M.absolute?0:Math.round(f/t.cellSize),R=M.absolute?0:Math.round(m/t.cellSize),k={minCellX:M.minCellX+b,maxCellX:M.maxCellX+b,minCellZ:M.minCellZ+R,maxCellZ:M.maxCellZ+R};M.density!==void 0&&(k.density=M.density),M.clearMarginCells!==void 0&&(k.clearMarginCells=M.clearMarginCells),E.push(k)}return{id:h.id,index:p,name:h.name,hint:h.hint,owner:h.owner??"",centerX:T.x,centerZ:T.z,placement:_,slot:g,shape:x,radius:v,color:y,station:T,grassPlots:E,testSpawn:h.testSpawn}};for(const h of r)c.push(u(h.def,h.centerX,h.centerZ,"pinned",-1,h.def.index??++l));for(const h of s){if(h.anchor)continue;const f=h.radius??t.defaultRadius;let m=-1,_=0,g=0,p=0;for(let v=d;v<Z0;v++){const x=v%t.columns,y=Math.floor(v/t.columns),w=fi(t.originX+x*t.stepX),S=fi(t.originZ+y*t.stepZ),T=t.bounds;if(T&&(w<T.minX||w>T.maxX||S<T.minZ||S>T.maxZ)){p++;continue}const E={x:w,z:S,r:f};if(o.some(M=>$0(E,M,t.gap))){p++;continue}m=v,_=w,g=S;break}if(m<0){e.unplaced.push(h.id);continue}p>0&&e.relocated.push(h.id),o.push({x:_,z:g,r:f}),d=m+1,c.push(u(h,_,g,"auto",m,h.index??++l))}return c.sort((h,f)=>h.index-f.index),{plots:c,stations:c.map(h=>h.station),grassPlots:c.flatMap(h=>h.grassPlots),diagnostics:e}}const Ii=1e-6;function Er(n,t,e){return n<t?t:n>e?e:n}function co(n,t,e,i,a,s,o){const r=a*.85;let l=Number.NEGATIVE_INFINITY;for(const c of n)c.maxY>i+s+Ii||c.maxY<i-o-Ii||t+r<c.minX||t-r>c.maxX||e+r<c.minZ||e-r>c.maxZ||c.maxY>l&&(l=c.maxY);return l}function jf(n,t,e,i,a=0,s=.05){let o=Number.NEGATIVE_INFINITY;for(const r of n)r.maxY>i+s||t<r.minX||t>r.maxX||e<r.minZ||e>r.maxZ||r.maxY>o&&(o=r.maxY);return o===Number.NEGATIVE_INFINITY?a:o}function Mh(n,t,e,i,a){let s=!1;const o=t.y+i;for(let r=0;r<2;r++)for(const l of n){if(l.maxY<=t.y+a+Ii||l.minY>=o-Ii)continue;const c=Er(t.x,l.minX,l.maxX),d=Er(t.z,l.minZ,l.maxZ),u=t.x-c,h=t.z-d,f=u*u+h*h;if(!(f>=e*e))if(s=!0,f>Ii*Ii){const m=Math.sqrt(f),_=(e-m)/m;t.x+=u*_,t.z+=h*_}else{const m=t.x-l.minX,_=l.maxX-t.x,g=t.z-l.minZ,p=l.maxZ-t.z,v=Math.min(m,_,g,p);v===m?t.x=l.minX-e:v===_?t.x=l.maxX+e:v===g?t.z=l.minZ-e:t.z=l.maxZ+e}}return s}function bh(n,t,e,i,a){const s=t.y+i;for(const o of n){if(o.maxY<=t.y+a+Ii||o.minY>=s-Ii)continue;const r=Er(t.x,o.minX,o.maxX),l=Er(t.z,o.minZ,o.maxZ),c=t.x-r,d=t.z-l;if(c*c+d*d<e*e-Ii)return!0}return!1}const ji=1e-6,ys=Math.PI/180;function Sh(n){return Math.atan2(Math.sin(n),Math.cos(n))}function ll(n,t,e,i){n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function qf(n){n.arrows.length=0}function q0(n,t,e,i,a,s,o,r,l,c,d){const u=i-n,h=s-e,f=u*u+h*h;let m=0;f>ji&&(m=((o-n)*u+(r-e)*h)/f,m=Math.max(0,Math.min(1,m)));const _=n+u*m,g=e+h*m,p=_-o,v=g-r;if(p*p+v*v>d*d)return-1;const x=t+(a-t)*m;return x<l-.1||x>l+c?-1:m}function K0(n,t){const e=n.config.combat.bow.trajectory,i=Math.max(0,e.homingRange);if(i<=ji)return-1;const a=n.character.position,s=Math.max(0,e.homingConeDeg)*ys,o=n.config.targeting.targetAssist&&n.modules.targeting?n.targeting:null,r=o&&o.hasTarget?o.targetId:0;let l=-1,c=i+ji;for(const d of n.dummies){if(!n.modules.dummies)break;const u=d.position.x-a.x,h=d.position.z-a.z,f=Math.hypot(u,h);if(!(f<.001||f>i)){if(d.id===r)return d.id;Math.abs(Sh(Math.atan2(u,h)-t))>s||f<c&&(l=d.id,c=f)}}return l}function J0(n,t,e){if(e<=0)return t;const i=n.dummies.find(r=>r.id===e);if(!i)return t;const a=n.character.position,s=Math.atan2(i.position.x-a.x,i.position.z-a.z),o=Math.max(0,n.config.combat.bow.trajectory.homingConeDeg)*ys;return t+us(Sh(s-t),-o,o)}function Q0(n,t,e,i,a,s){const o=n.config.combat.bow.trajectory,r={vy:s*Math.sin(Math.max(0,o.launchPitchDeg)*ys),horizontal:0};if(r.horizontal=s*Math.cos(Math.max(0,o.launchPitchDeg)*ys),a<=0)return r;const l=n.dummies.find(_=>_.id===a);if(!l)return r;const c=Math.hypot(l.position.x-t,l.position.z-i);if(c<.4)return r;const d=c/Math.max(ji,s),u=l.position.y+n.config.dummies.height*us(o.aimHeightRatio,0,1),h=Math.max(0,o.gravity),f=(u-e+.5*h*d*d)/d,m=us(f,-s*.45,s*.92);return{vy:m,horizontal:Math.sqrt(Math.max(0,s*s-m*m))}}function tg(n,t,e){const i=n.config.combat.bow.trajectory,a=Math.max(0,Math.min(1,t)),s=i.speedMin+(i.speedMax-i.speedMin)*a,o=n.character.position,r=K0(n,e),l=J0(n,e,r),c=Math.sin(l),d=Math.cos(l),u=o.x+Math.sin(e)*.55,h=o.z+Math.cos(e)*.55,f=o.y+.95,m=Q0(n,u,f,h,r,s),_={id:++n.arrowSeq,x:u,y:f,z:h,vx:c*m.horizontal,vy:m.vy,vz:d*m.horizontal,life:Math.max(.1,i.maxLife),stuck:!1,stuckDummy:-1,offX:0,offY:0,offZ:0,yaw:e,localYaw:0,pitch:0,rest:0,hit:!1,targetId:r,homing:Math.max(0,i.homingTime),turnRate:Math.max(0,i.turnRateDeg)*ys};return n.arrows.push(_),ll(n,"arrow-shot",a,_),_}function us(n,t,e){return n<t?t:n>e?e:n}function eg(n,t){const e=n.arrows;if(e.length===0)return;const i=n.config.combat.bow.trajectory,a=n.config.dummies.radius,s=n.config.dummies.height,o=n.modules.hits&&n.modules.dummies,r=Math.max(0,i.gravity),l=[];for(const c of e){if(c.stuck){if(c.rest-=t,c.rest<=0)continue;if(c.stuckDummy>=0){const y=n.dummies[c.stuckDummy];if(y){const w=Math.cos(y.bodyYaw),S=Math.sin(y.bodyYaw);c.x=y.position.x+c.offX*w+c.offZ*S,c.y=y.position.y+c.offY,c.z=y.position.z-c.offX*S+c.offZ*w,c.yaw=y.bodyYaw+c.localYaw}}l.push(c);continue}if(c.life-=t,c.life<=0)continue;const d=c.x,u=c.y,h=c.z;if(c.homing>0&&(c.homing=Math.max(0,c.homing-t),c.targetId>0&&c.turnRate>0)){const y=n.dummies.find(w=>w.id===c.targetId);if(!y)c.targetId=0;else{const w=Math.hypot(c.vx,c.vz);if(w>ji){const S=Math.atan2(y.position.x-c.x,y.position.z-c.z),T=Math.atan2(c.vx,c.vz),E=c.turnRate*t,M=T+us(Sh(S-T),-E,E);c.vx=Math.sin(M)*w,c.vz=Math.cos(M)*w;const b=Math.hypot(y.position.x-c.x,y.position.z-c.z);if(b>.3){const R=b/w,C=(y.position.y+s*us(i.aimHeightRatio,0,1)-c.y+.5*r*R*R)/R,I=Math.max(0,i.verticalTurnRate)*t;c.vy+=us(C-c.vy,-I,I)}}}}c.yaw=Math.atan2(c.vx,c.vz),c.pitch=-Math.atan2(c.vy,Math.hypot(c.vx,c.vz)),c.vy-=r*t;const f=d+c.vx*t,m=u+c.vy*t,_=h+c.vz*t;let g=-1,p=2;if(o)for(let y=0;y<n.dummies.length;y++){const w=n.dummies[y],S=q0(d,u,h,f,m,_,w.position.x,w.position.z,w.position.y,s,a+i.radius);S>=0&&S<p&&(p=S,g=y)}if(g>=0){const y=n.dummies[g];c.x=d+(f-d)*p,c.y=u+(m-u)*p,c.z=h+(_-h)*p,c.stuck=!0,c.stuckDummy=g;const w=Math.cos(y.bodyYaw),S=Math.sin(y.bodyYaw),T=c.x-y.position.x,E=c.z-y.position.z;c.offX=T*w-E*S,c.offZ=T*S+E*w,c.offY=c.y-y.position.y;const M=Math.atan2(c.vx,c.vz);c.localYaw=M-y.bodyYaw,c.yaw=M,c.pitch=Math.atan2(-c.vy,Math.hypot(c.vx,c.vz)),c.rest=Math.max(.2,i.stickSec),c.hit=!0;const b=Math.hypot(c.vx,c.vz);_o(n,g,{type:"light",duration:.22,dirX:b>ji?c.vx/b:0,dirZ:b>ji?c.vz/b:1,knockback:.14}),ll(n,"arrow-land",y.id,c),l.push(c);continue}const v=co(n.boxes,f,_,m+.4,.04,0,6),x=Number.isFinite(v)?v:0;if(m<=x+.02&&c.vy<0){c.x=f,c.y=x+Math.max(0,i.groundStickLift),c.z=_,c.stuck=!0,c.stuckDummy=-1,c.yaw=Math.atan2(c.vx,c.vz);const y=Math.atan2(-c.vy,Math.max(ji,Math.hypot(c.vx,c.vz)));c.pitch=Math.max(y,Math.max(0,i.stickMinPitchDeg)*ys),c.rest=Math.max(.2,i.stickSec),ll(n,"arrow-land",-1,c),l.push(c);continue}c.x=f,c.y=m,c.z=_,l.push(c)}n.arrows=l}const hl=1e-6,ng=Math.PI/180;function dl(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function wh(n,t,e){return n<t?t:n>e?e:n}function Gr(){return{phase:"idle",source:"none",linkWindow:0,windowId:0,usedWindowId:-1,cooldown:0,kind:"",weapon:"",id:0,timer:0,progress:0,facing:0,targetId:0,targetDist:0,travel:0,travelled:0,fromX:0,fromZ:0,pulseTimer:0,hitIds:[],consumedAttack:!1,prevSprinting:!1}}function ul(n){const t=n.id,e=n.windowId;Object.assign(n,Gr()),n.id=t,n.windowId=e}function ig(n){ul(n)}function Kf(n){ul(n.playerLink);for(const t of n.dummies)ul(t.link)}function ag(n,t){const e=[n.playerLink];for(const i of n.dummies)e.push(i.link);for(const i of e)i.linkWindow=Math.max(0,i.linkWindow-t),i.cooldown=Math.max(0,i.cooldown-t),i.linkWindow===0&&i.phase==="idle"&&i.source!=="none"&&(i.source="none",i.usedWindowId=-1)}function fl(n,t){const e=n.config.links,i=n.playerLink;if(!e.enabled||i.phase!=="idle")return;const a=t==="roll"?e.windows.roll:t==="blink"?e.windows.blink:t==="sprint"?e.windows.sprint:0;a<=0||(i.linkWindow=Math.max(i.linkWindow,a),i.source=t,i.windowId+=1,i.usedWindowId=-1,i.prevSprinting=!1)}function Tr(n){const t=n.playerLink;if(t.phase==="idle")return;const e=t.id,i=t.windowId;Object.assign(t,Gr()),t.id=e,t.windowId=i,t.fromX=n.character.position.x,t.fromZ=n.character.position.z}function sg(n,t){const e=n.config.links.search,i=n.character.position,a=wh(e.maxAngleDeg,0,180)*ng;let s=0,o=t,r=Number.POSITIVE_INFINITY;for(const l of n.dummies){const c=l.position.x-i.x,d=l.position.z-i.z,u=Math.hypot(c,d);if(u<hl||u>e.range)continue;const h=Math.atan2(c,d);Math.abs(Ye(h-t))>a||u<r&&(r=u,s=l.id,o=h)}return{id:s,yaw:o,dist:s>0?r:0}}function og(n,t,e,i){const a=n.config.links,s=n.playerLink,o=n.character.position,r=ro(n,t),l=sg(n,r),c=l.id>0?l.yaw:r,d=l.id>0?wh(l.dist-a.search.stopDistance,0,e.distance):a.noTargetFallback?e.distance:0;s.phase="windup",s.linkWindow=0,s.source="none",s.usedWindowId=s.windowId,s.cooldown=a.sharedCooldown,s.kind=e.kind,s.weapon=i,s.id+=1,s.timer=0,s.progress=0,s.facing=c,s.targetId=l.id,s.targetDist=l.dist,s.travel=d,s.travelled=0,s.fromX=o.x,s.fromZ=o.z,s.pulseTimer=0,s.hitIds=[],s.consumedAttack=!0,n.dash.cooldown=Math.max(n.dash.cooldown,a.sharedCooldown),dl(n,"link-start",s.id)}function rg(n,t){const e=n.playerLink;if(e.phase==="idle")return;const i=e.weapon===""?void 0:n.config.links.moves[e.weapon];if(!i){Tr(n);return}if(e.weapon!==n.combat.weapon){Tr(n);return}e.timer+=t;const a=l=>l==="windup"?i.windup:l==="active"?i.active:i.recovery;let s=0;for(;e.phase!=="idle"&&s++<8;){const l=a(e.phase);if(e.timer<l)break;e.timer-=l,e.phase==="windup"?(e.phase="active",e.pulseTimer=0,dl(n,"link-active",e.id)):e.phase==="active"?e.phase="recovery":(e.phase="idle",e.timer=0,dl(n,"link-end",e.id))}const o=i.windup+i.active+i.recovery;let r=0;if(e.phase==="windup"?r=e.timer:e.phase==="active"?r=i.windup+e.timer:e.phase==="recovery"?r=i.windup+i.active+e.timer:r=o,e.progress=o>0?wh(r/o,0,1):1,e.phase==="active"&&i.active>hl){const l=Math.max(0,e.travel-e.travelled),c=Math.max(hl,i.active-e.timer),d=l/c;n.impulse.x=Math.sin(e.facing)*d,n.impulse.z=Math.cos(e.facing)*d}}function cg(n,t,e){const i=n.config.links,a=n.playerLink,s=n.character.position;if(a.consumedAttack=!1,n.combat.hitstop>0)return;if(a.phase==="active"&&(a.travelled+=Math.hypot(s.x-a.fromX,s.z-a.fromZ)),a.fromX=s.x,a.fromZ=s.z,!i.enabled||!n.modules.links){a.phase!=="idle"&&Tr(n);return}const o=n.combat,r=n.character.sprinting;r&&i.triggerWhileSprinting&&a.phase==="idle"&&a.usedWindowId!==a.windowId&&i.windows.sprint>0&&(a.linkWindow=Math.max(a.linkWindow,i.windows.sprint),a.source="sprint"),a.phase==="idle"&&a.prevSprinting&&!r&&fl(n,"sprint"),a.prevSprinting=r,rg(n,t);const l=i.moves[o.weapon];e.attackPressed&&a.phase==="idle"&&a.linkWindow>0&&a.usedWindowId!==a.windowId&&a.cooldown<=0&&o.phase==="idle"&&!o.charging&&n.dash.phase==="idle"&&!!l&&l.enabled&&og(n,e,l,o.weapon)}const ur={windup:0,active:1,recovery:2},Cd=1e-9;function Jf(n){return Number.isFinite(n)?n<0?0:n>1?1:n:0}function lg(n){return n==="windup"||n==="active"||n==="recovery"}function hg(n,t){return ur[n]+Jf(t)}function dg(n,t,e){if(!n||n.length===0)return[];if(!Number.isFinite(e)||e<0)return[];const i=Number.isFinite(t)?t:-1,a=[];for(const s of n){if(!s||!lg(s.at))continue;const o=Jf(s.u??0),r=ur[s.at]+o;r>i+Cd&&r<=e+Cd&&a.push({name:s.name,value:Number.isFinite(s.value)?s.value:0,at:s.at,u:o})}return a.sort((s,o)=>ur[s.at]+s.u-(ur[o.at]+o.u)),a}const lo=1e-6;function qi(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function ug(n,t,e){const i=n.character.position;n.events.push({type:"notify",tick:n.tick,x:i.x,y:i.y,z:i.z,value:e,name:t})}function Qf(){return{windup:0,active:0,recovery:0,settle:0,lunge:0}}function Xr(n){const t=n.combat;t.phase="idle",t.comboIndex=0,t.phaseTimer=0,t.comboWindow=0,t.queued=!1,t.charging=!1,t.charge=0,t.attackProgress=0,t.attackFacing=0,t.lastCharge=0,t.hitstop=0,t.notifyCursor=-1,t.hitIds.length=0,t.warp=1,t.warpDebt=0,t.warpPhase=0,t.warpTimer=0,t.slamAttackId=0,t.timings=Qf()}function tp(n){return{weapon:na[Math.max(0,n-1)]??na[0],phase:"idle",comboIndex:0,phaseTimer:0,comboWindow:0,queued:!1,charging:!1,charge:0,attackProgress:0,attackFacing:0,attackId:0,lastCharge:0,hitstop:0,notifyCursor:-1,hitIds:[],warp:1,warpDebt:0,warpPhase:0,warpTimer:0,slamAttackId:0,timings:Qf()}}function fg(n,t){return ro(n,t)}function pg(n,t){const e=n.config.targeting;if(!e.targetAssist||!n.modules.targeting||!n.targeting.hasTarget)return t;const i=n.targeting.targetDist-e.idealRange,a=Math.max(0,t*e.maxLungeScale),s=t*n.config.combat.minLungeScale;return Math.min(Math.max(i,0)+s,a)}function ep(n,t,e,i){const a=n.combat;a.phase="windup",a.phaseTimer=0,a.comboIndex=i,a.queued=!1,a.charging=!1,a.charge=0,a.attackFacing=fg(n,t),a.attackProgress=0,a.timings=e,a.attackId+=1,a.warpDebt=0,a.warpPhase=0,a.warpTimer=0,a.warp=1,a.notifyCursor=-1,a.hitIds.length=0,qi(n,"attack-start",i)}function np(n){return Math.max(0,n.config.combat.settle)}function pl(n,t,e){const i=n.config.combat.weapons[n.combat.weapon];ep(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:np(n),lunge:pg(n,i.lunge[e-1]??0)},e)}function Ld(n,t,e){const i=n.config.combat.bow.release;n.combat.lastCharge=e,ep(n,t,{windup:i.windup,active:i.active,recovery:i.recovery,settle:np(n),lunge:i.lunge},0),tg(n,e,n.combat.attackFacing),qi(n,"charge-release",e)}function mg(n,t){const e=n.combat,i=n.config.hits.hitstopWarp;if(!i||!i.enabled)return e.warp=e.hitstop>0?0:1,e.warp;const a=Math.max(0,Math.min(1,i.holdRate));if(e.hitstop>0)return e.warpPhase=1,e.warpTimer=e.hitstop,e.warp=a,e.warpDebt+=t*(1-a),e.warp;if(e.warpPhase===1&&(e.warpPhase=2,e.warpTimer=0),e.warpPhase===2){const s=Math.max(.001,i.release);e.warpTimer+=t;const o=Math.min(1,e.warpTimer/s),r=1-(1-o)*(1-o),l=a+(1-a)*r;if(e.warp=l,e.warpDebt+=t*(1-l),o>=1){e.warpPhase=3,e.warpTimer=0;const c=Math.max(0,e.timings.recovery)*Math.max(0,i.payback-1)*Math.max(0,Math.min(1,i.paybackBudget));e.warpDebt=Math.min(e.warpDebt,c)}return e.warp}if(e.warpPhase===3&&e.warpDebt>1e-6){const s=Math.min(Math.max(0,i.payback-1),e.warpDebt/Math.max(t,1e-5));return e.warp=1+s,e.warpDebt=Math.max(0,e.warpDebt-t*s),e.warpDebt<=1e-6&&(e.warpPhase=0,e.warp=1),e.warp}return e.warpPhase=0,e.warp=1,1}function gg(n,t,e){const i=n.combat;if(i.phase==="idle"){i.warp=1,i.warpPhase=0,i.warpTimer=0,i.warpDebt=0;return}const a=i.timings,s=mg(n,t),o=t*s;i.phaseTimer+=o;let r=0;for(;i.phase!=="idle"&&r++<8;){const d=i.phase==="windup"?a.windup:i.phase==="active"?a.active:i.phase==="recovery"?a.recovery:a.settle;if(i.phaseTimer<d)break;if(i.phaseTimer-=d,i.phase==="windup")i.phase="active",qi(n,"attack-active",i.comboIndex);else if(i.phase==="active")i.phase="recovery";else if(i.phase==="recovery")i.phase="settle",i.warpPhase=0,i.warpDebt=0,i.warpTimer=0,i.warp=1,qi(n,"attack-end",i.comboIndex);else if(i.phase="idle",i.phaseTimer=0,i.comboWindow=n.config.combat.weapons[i.weapon].comboWindow??n.config.combat.comboWindow,i.queued){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&pl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}if(i.queued&&i.phase==="recovery"){const d=i.timings.recovery;if(d>lo&&i.phaseTimer>=d*n.config.combat.cancelWindow){i.queued=!1;const u=n.config.combat.weapons[i.weapon];u.comboCount>0&&pl(n,e,i.comboIndex<u.comboCount?i.comboIndex+1:1)}}const l=a.windup+a.active+a.recovery;let c=0;i.phase==="windup"?c=i.phaseTimer:i.phase==="active"?c=a.windup+i.phaseTimer:i.phase==="recovery"?c=a.windup+a.active+i.phaseTimer:i.phase==="settle"&&(c=l),i.phase!=="idle"&&(i.attackProgress=l>0?Math.min(1,c/l):1),xg(n)}function xg(n){const t=n.combat;if(t.phase==="idle")return;const e=t.timings,i=t.phase==="windup"?e.windup:t.phase==="active"?e.active:t.phase==="recovery"?e.recovery:0,a=i>lo?Math.min(1,Math.max(0,t.phaseTimer/i)):1,s=t.phase==="settle"?3:hg(t.phase,a);if(s<=t.notifyCursor+lo)return;const o=n.config.combat.weapons[t.weapon].notifies;for(const r of dg(o,t.notifyCursor,s))ug(n,r.name,r.value);t.notifyCursor=s}function vg(n,t,e){const i=n.combat,a=n.config.combat;if(e.weaponSlot>=1&&e.weaponSlot<=na.length){const l=na[e.weaponSlot-1];l!==i.weapon&&(i.weapon=l,Xr(n),Tr(n),qi(n,"weapon-change",e.weaponSlot))}i.phase==="idle"&&i.comboWindow>0&&(i.comboWindow=Math.max(0,i.comboWindow-t),i.comboWindow===0&&i.comboIndex>0&&(i.comboIndex=0,qi(n,"combo-reset",0))),i.hitstop>0&&(n.impulse.x=0,n.impulse.z=0,n.character.velocity.x=0,n.character.velocity.z=0),gg(n,t,e);const s=a.weapons[i.weapon],o=n.dash.phase==="active";if(s.comboCount>0){const l=n.playerLink.phase!=="idle"||n.playerLink.consumedAttack;if(!o&&!l&&(e.attackPressed||a.autoCombo&&e.attackHeld))if(i.phase==="idle"){const d=i.comboWindow>0&&i.comboIndex<s.comboCount?i.comboIndex+1:1;pl(n,e,d)}else i.queued=!0}else if(i.weapon!=="staff"){if(i.weapon==="bow"&&!o&&!n.playerLink.consumedAttack){if(e.attackHeld){if(i.charging||(i.charging=!0,i.charge=0,qi(n,"charge-start",0)),i.charge=Math.min(1,i.charge+t/Math.max(a.bow.maxChargeTime,lo)),a.bow.autoFire&&i.charge>=1){i.charging=!1;const l=i.charge;i.charge=0,Ld(n,e,l)}}else if(i.charging){i.charging=!1;const l=i.charge;i.charge=0,l>=a.bow.minChargeToFire?Ld(n,e,l):qi(n,"charge-release",0)}}}if(!(n.playerLink.phase==="active")&&(n.impulse.x=0,n.impulse.z=0,i.phase==="active"&&i.hitstop<=0&&i.timings.active>lo)){const l=i.timings.active,c=Math.max(0,i.timings.lunge),d=Math.max(.2,a.lungeCurve),u=g=>c*(1-Math.pow(1-Math.min(1,Math.max(0,g/l)),d+1)),h=t*i.warp,f=Math.min(l,Math.max(0,i.phaseTimer)),m=Math.min(l,Math.max(0,i.phaseTimer-h));let _=Math.max(0,u(f)-u(m))/Math.max(h,1e-4);_=Math.min(_,Math.max(0,a.lungeMaxSpeed)),n.impulse.x=Math.sin(i.attackFacing)*_,n.impulse.z=Math.cos(i.attackFacing)*_}i.hitstop>0&&(i.hitstop=Math.max(0,i.hitstop-t))}const sn=1e-6,ml=Math.PI*2,yg=7,_g=18,ip=1.3,ap=.4,Mg=.9,Dd=.9;function kd(n,t,e,i){const a=Math.max(e,.1),s=((n+t*2.37)%a+a)%a,o=Math.min(Math.max(i,0),1)*a;if(o<=sn||s>=o)return 0;const r=Math.min(Math.max(a*.12,.15),o*.5),l=Math.min(1,Math.min(s/r,(o-s)/r));return l*l*(3-2*l)}function bg(n,t){const e=Math.hypot(n,t);return e<=1?{x:n,z:t}:{x:n/e,z:t/e}}function Sg(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Id(n,t,e,i){return n+Sg(t-n)*(1-Math.exp(-Math.max(e,sn)*i))}function Ar(n,t,e){n.events.push({type:t,tick:n.tick,x:e.position.x,y:e.position.y,z:e.position.z,value:e.id})}function wg(n){var i;const t=[];for(let a=0;a<n.count;a++){const s=n.spawn[a]??{x:0,z:0},o=n.initialModes[a]??"idle";t.push(gl(a+1,o,s.x,s.z,null))}const e=n.fighters;if(e)for(let a=0;a<e.weapons.length;a++){const s=e.spawn[a]??{x:0,z:0},o=((i=e.initialModes)==null?void 0:i[a])??"spar",r=e.attackInterval*(.25+.22*a);t.push(gl(t.length+1,o,s.x,s.z,e.weapons[a],r))}return t}function gl(n,t,e,i,a,s=0){return{id:n,mode:t,initialMode:t,homeX:e,homeZ:i,position:{x:e,y:0,z:i},velocity:{x:0,y:0,z:0},facing:0,bodyYaw:0,headYaw:0,gaitPhase:0,stride:1,distance:0,targetX:e,targetZ:i,wanderTimer:0,attackCooldown:s,attackPhase:"idle",attackPhaseTimer:0,attackProgress:0,attackId:0,attackComboIndex:0,attackComboLeft:0,comboGap:0,hurt:Uf(),link:Gr(),weapon:a,combat:a?{...tp(na.indexOf(a)+1),weapon:a}:null}}function Eg(n,t=!1){const e=t?zf:f0,i=e.indexOf(n);return e[(i+1)%e.length]}function sp(n){const t=n.config.dummies;for(let e=0;e<n.dummies.length;e++){const i=n.dummies[e],a=t.spawn[e]??{x:i.homeX,z:i.homeZ},s=t.initialModes[e]??i.initialMode;i.mode=s,i.initialMode=s,i.homeX=a.x,i.homeZ=a.z,i.position.x=a.x,i.position.y=0,i.position.z=a.z,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.bodyYaw=0,i.headYaw=0,i.gaitPhase=0,i.stride=1,i.distance=0,i.targetX=a.x,i.targetZ=a.z,i.wanderTimer=0,i.attackCooldown=0,i.attackPhase="idle",i.attackPhaseTimer=0,i.attackProgress=0,i.attackComboIndex=0,i.attackComboLeft=0,i.comboGap=0;const o=i.hurt;if(o.type="none",o.timer=0,o.duration=0,o.dirX=0,o.dirZ=0,o.knockX=0,o.knockZ=0,ig(i.link),i.combat){const r=i.combat;r.phase="idle",r.comboIndex=0,r.phaseTimer=0,r.attackProgress=0,r.attackFacing=0,r.charging=!1,r.charge=0,r.hitstop=0,r.warp=1,r.warpPhase=0,r.warpDebt=0,r.warpTimer=0,r.hitIds.length=0,r.timings={windup:0,active:0,recovery:0,settle:0,lunge:0}}}n.dummyAttackCount=0}function Tg(n,t,e){const i=pc(n)*ml,a=Math.sqrt(pc(n))*e.wanderRadius;t.targetX=t.homeX+Math.cos(i)*a,t.targetZ=t.homeZ+Math.sin(i)*a,t.wanderTimer=e.wanderInterval*(.6+pc(n)*.8)}function Eh(n,t,e){if(t.weapon){const i=n.config.combat.weapons[t.weapon];if(i)return{windup:i.windup,active:i.active,recovery:i.recovery}}return{windup:e.attackWindup,active:e.attackActive,recovery:e.attackRecovery}}function xl(n,t,e){var s;if(!t.weapon)return e.attackRange;const i=n.config.hits.reach[t.weapon]??e.attackRange,a=((s=e.fighters)==null?void 0:s.attackRangeScale)??.9;return Math.max(.4,i*a)}function vl(n,t){return n.weapon&&t.fighters?t.fighters.attackInterval:t.attackInterval}function Ag(n,t){return n.weapon&&t.fighters?Math.max(t.leashRadius,t.fighters.leashRadius):t.leashRadius}function Rg(n,t,e){const i=Eh(e,n,t);return n.attackPhase==="windup"?i.windup:n.attackPhase==="active"?i.active:n.attackPhase==="recovery"?i.recovery:0}function Pg(n,t,e){var s;if(!t.weapon)return 1;const i=((s=e.fighters)==null?void 0:s.comboCount)??0;if(i>0)return Math.max(1,Math.round(i));const a=n.config.combat.weapons[t.weapon];return Math.max(1,Math.round((a==null?void 0:a.comboCount)??1))}function Cg(n,t){var i;const e=((i=t.fighters)==null?void 0:i.comboGap)??0;return e>0?e:Math.max(0,n.config.combat.settle)}function Lg(n){return n.attackPhase!=="idle"||n.attackComboLeft>0}function Dg(n,t,e,i){if(t.attackPhase==="idle"){t.attackProgress=0,zd(n,t,i);return}t.attackPhaseTimer+=e;let a=0;for(;t.attackPhase!=="idle"&&a++<4;){const l=Math.max(Rg(t,i,n),sn);if(t.attackPhaseTimer<l)break;t.attackPhaseTimer-=l,t.attackPhase==="windup"?(t.attackPhase="active",Ar(n,"dummy-hit",t)):t.attackPhase==="active"?t.attackPhase="recovery":(t.attackPhase="idle",t.attackPhaseTimer=0,t.attackComboLeft>0?t.comboGap=Cg(n,i):(t.attackComboIndex=0,t.weapon&&t.attackCooldown<=0&&(t.attackCooldown=vl(t,i)*ap)))}const s=Eh(n,t,i),o=s.windup+s.active+s.recovery;let r=0;t.attackPhase==="windup"?r=t.attackPhaseTimer:t.attackPhase==="active"?r=s.windup+t.attackPhaseTimer:t.attackPhase==="recovery"&&(r=s.windup+s.active+t.attackPhaseTimer),t.attackProgress=t.attackPhase==="idle"||o<=0?0:Math.min(1,r/o),zd(n,t,i)}function zd(n,t,e){const i=t.combat;if(!i)return;const a=Eh(n,t,e),s=t.attackPhase==="idle"&&t.attackComboLeft>0&&t.comboGap>0;i.weapon=t.weapon??i.weapon,i.phase=s?"settle":t.attackPhase,i.comboIndex=t.attackComboIndex,i.phaseTimer=t.attackPhaseTimer,i.attackProgress=s?1:t.attackProgress,i.attackFacing=t.facing,i.timings={windup:a.windup,active:a.active,recovery:a.recovery,settle:0,lunge:0},i.hitstop=0,i.warp=1,i.warpPhase=0,i.charging=!1,i.charge=0}function kg(n,t,e){if(t.hurt.timer>0)return{x:0,z:0,facing:t.facing};const i=n.character.position,a=i.x-t.position.x,s=i.z-t.position.z,o=Math.hypot(a,s),r=o>sn?a/o:0,l=o>sn?s/o:0;let c=0,d=0;if(t.mode==="wander"){const h=t.targetX-t.position.x,f=t.targetZ-t.position.z,m=Math.hypot(h,f);(t.wanderTimer<=0||m<.3)&&Tg(n,t,e);const _=t.targetX-t.position.x,g=t.targetZ-t.position.z,p=Math.hypot(_,g);p>sn&&(c=_/p,d=g/p)}else if(t.mode==="follow")o>e.followStopDistance&&(c=r,d=l);else if(t.mode==="keep-distance"){const h=o-e.keepDistance,f=Math.max(e.keepDeadZone,.2),m=Math.max(-1,Math.min(1,h/f))*Dd,_=kd(n.time,t.id,e.strafePeriod,e.strafeDuty)*e.keepStrafe;c=r*m-l*_,d=l*m+r*_}else if(t.mode==="attack")o>xl(n,t,e)&&t.attackPhase==="idle"&&(c=r,d=l);else if(t.mode==="spar"){const h=xl(n,t,e),f=h*1.7;if(Lg(t))o>h*ip?(c=r,d=l):o<h*.55&&(c=-r*.6,d=-l*.6);else if(t.attackPhase==="idle"&&t.attackCooldown<=0&&o>h)c=r,d=l;else{const _=Math.max(-1,Math.min(1,(o-f)/.5))*Dd,g=kd(n.time,t.id,e.strafePeriod,e.strafeDuty)*Mg;c=r*_-l*g,d=l*_+r*g}}({x:c,z:d}=bg(c,d));let u=t.facing;if(t.mode==="wander"?Math.hypot(c,d)>sn&&(u=Math.atan2(c,d)):o>sn&&(u=Math.atan2(r,l)),e.leashRadius>sn&&t.mode!=="wander"&&t.mode!=="idle"){const h=Ag(t,e),f=t.position.x-t.homeX,m=t.position.z-t.homeZ,_=Math.hypot(f,m);if(_>h){const g=Math.min(1,(_-h)/Math.max(h*.5,.5)),p=-f/_,v=-m/_;c=c*(1-g)+p*g,d=d*(1-g)+v*g;const x=Math.hypot(c,d);x>sn&&(c/=x,d/=x)}}return{x:c,z:d,facing:u}}function Ig(n,t,e,i){if(e.wanderTimer-=t,e.attackCooldown=Math.max(0,e.attackCooldown-t),e.comboGap=Math.max(0,e.comboGap-t),e.hurt.timer>0&&(e.attackComboLeft=0,e.comboGap=0),(e.mode==="attack"||e.mode==="spar")&&e.attackPhase==="idle"&&e.hurt.timer<=0){const v=n.character.position,x=Math.hypot(v.x-e.position.x,v.z-e.position.z),y=xl(n,e,i);if(e.attackComboLeft>0)e.comboGap<=0&&(x<=y*ip+sn?(e.attackComboIndex+=1,e.attackComboLeft-=1,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,n.dummyAttackCount+=1,Ar(n,"dummy-attack",e)):(e.attackComboLeft=0,e.attackComboIndex=0,e.attackCooldown=Math.max(e.attackCooldown,vl(e,i)*ap)));else if(e.attackCooldown<=0&&x<=y+sn){const w=Pg(n,e,i);e.attackComboIndex=1,e.attackComboLeft=Math.max(0,w-1),e.comboGap=0,e.attackPhase="windup",e.attackPhaseTimer=0,e.attackId+=1,e.attackCooldown=vl(e,i),n.dummyAttackCount+=1,Ar(n,"dummy-attack",e)}}Dg(n,e,t,i);const a=kg(n,e,i),s=n.config.worldBounds;(a.x>0&&e.position.x>=s.maxX-sn||a.x<0&&e.position.x<=s.minX+sn)&&(a.x=0),(a.z>0&&e.position.z>=s.maxZ-sn||a.z<0&&e.position.z<=s.minZ+sn)&&(a.z=0);const o=1-Math.exp(-Math.max(i.acceleration,sn)*t),r=e.weapon&&i.fighters?i.fighters.moveSpeed:i.moveSpeed;e.velocity.x+=(a.x*r-e.velocity.x)*o,e.velocity.z+=(a.z*r-e.velocity.z)*o,e.facing=a.facing,e.bodyYaw=Id(e.bodyYaw,e.facing,yg,t),e.headYaw=Id(e.headYaw,e.facing,_g,t);const l=e.position.x,c=e.position.z;e.position.x+=e.velocity.x*t,e.position.z+=e.velocity.z*t,e.position.x+=e.hurt.knockX*t,e.position.z+=e.hurt.knockZ*t;const d=n.config.stepHeight;if(Mh(n.boxes,e.position,i.radius,i.height,d))if(bh(n.boxes,e.position,i.radius,i.height,d))e.position.x=l,e.position.z=c,e.velocity.x=0,e.velocity.z=0;else{const v=e.position.x-l,x=e.position.z-c;Math.abs(v)<Math.abs(e.velocity.x*t)*.5&&(e.velocity.x=0),Math.abs(x)<Math.abs(e.velocity.z*t)*.5&&(e.velocity.z=0)}const h=n.config.worldBounds;e.position.x<h.minX?(e.position.x=h.minX,e.velocity.x<0&&(e.velocity.x=0),e.hurt.knockX<0&&(e.hurt.knockX=0)):e.position.x>h.maxX&&(e.position.x=h.maxX,e.velocity.x>0&&(e.velocity.x=0),e.hurt.knockX>0&&(e.hurt.knockX=0)),e.position.z<h.minZ?(e.position.z=h.minZ,e.velocity.z<0&&(e.velocity.z=0),e.hurt.knockZ<0&&(e.hurt.knockZ=0)):e.position.z>h.maxZ&&(e.position.z=h.maxZ,e.velocity.z>0&&(e.velocity.z=0),e.hurt.knockZ>0&&(e.hurt.knockZ=0));const f=co(n.boxes,e.position.x,e.position.z,e.position.y,i.radius,d,Number.POSITIVE_INFINITY);f>Number.NEGATIVE_INFINITY&&f<=e.position.y+d+sn&&(e.position.y=f);const m=Math.hypot(e.position.x-l,e.position.z-c);e.distance+=m;const _=Math.hypot(e.velocity.x,e.velocity.z),g=Math.min(n.config.strideSpeedCap,_/Math.max(n.config.moveSpeed,sn)),p=Math.max(n.config.strideLength*(1+g*n.config.strideSpeedGain),sn);e.stride=p,e.gaitPhase=(e.gaitPhase+m/p*ml)%ml}function zg(n,t,e){const i=n.config.dummies;if(e.dummyClickId>=1&&e.dummyClickId<=n.dummies.length){const a=n.dummies[e.dummyClickId-1];a.mode=Eg(a.mode,!!a.weapon),a.targetX=a.position.x,a.targetZ=a.position.z,a.wanderTimer=0,a.attackCooldown=0,a.attackPhase="idle",a.attackPhaseTimer=0,a.attackProgress=0,a.attackComboIndex=0,a.attackComboLeft=0,a.comboGap=0,a.combat&&(a.combat.phase="idle",a.combat.attackProgress=0,a.combat.comboIndex=0),Ar(n,"dummy-mode",a)}for(const a of n.dummies)Ig(n,t,a,i)}const Fg=["idle","attack","keep-distance"],Ug=["sword-shield","dual-swords","greatsword"];function yl(n,t){const e=n.dummies.length,i=n.dummies.filter(a=>a.spawnedByPlot?t!==void 0&&a.spawnedByPlot!==t:!0);n.dummies=i;for(let a=0;a<n.dummies.length;a++)n.dummies[a].id=a+1;return e-n.dummies.length}function Ng(n,t){var h,f;const e=t.testSpawn??{},i=Math.max(0,Math.floor(e.dummies??0)),a=Math.max(0,Math.floor(e.fighters??0));yl(n,t.id);const s=i+a;if(s===0)return 0;const o=Math.max(.4,e.ringRadius??1.6),r=e.startDeg??-90,l=e.modes??Fg,c=e.weapons??((h=n.config.dummies.fighters)==null?void 0:h.weapons)??Ug,d=((f=n.config.dummies.fighters)==null?void 0:f.attackInterval)??3.4,u=[];for(let m=0;m<s;m++){const _=(r+360*m/s)*Math.PI/180,g=t.centerX+Math.cos(_)*o,p=t.centerZ+Math.sin(_)*o,v=m>=i,x=m-i,y=v?"spar":l[m%l.length],w=v?c[x%c.length]:null,S=v?d*(.25+.22*x):0,T=gl(n.dummies.length+u.length+1,y,g,p,w,S);T.spawnedByPlot=t.id,u.push(T)}return n.dummies.push(...u),u.length}function Og(n){let t=0;for(const e of n.dummies)e.spawnedByPlot&&t++;return t}const _l=1e-6;function mc(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Bg(){return{kind:"none",phase:"idle",timer:0,duration:0,cooldown:0,dirX:0,dirZ:0,fromX:0,fromZ:0,toX:0,toZ:0,id:0}}function op(n){const t=n.dash;t.kind="none",t.phase="idle",t.timer=0,t.duration=0,t.cooldown=0,t.dirX=0,t.dirZ=0,t.fromX=n.character.position.x,t.fromZ=n.character.position.z,t.toX=t.fromX,t.toZ=t.fromZ}function Fd(n,t,e){return n<t?t:n>e?e:n}function Hg(n,t,e){const i=n.config.dash,s=n.character.position,o=n.config.worldBounds,r=Math.max(.05,i.blinkStep),l=Math.max(0,i.blinkDistance);let c=0,d=s.x,u=s.z;for(;c<l-_l;){const h=Math.min(l,c+r),f=s.x+t*h,m=s.z+e*h,_=Fd(f,o.minX,o.maxX),g=Fd(m,o.minZ,o.maxZ),p={x:_,y:s.y,z:g};if(bh(n.boxes,p,n.config.characterRadius,n.config.characterHeight,n.config.stepHeight)||(d=_,u=g,c=h,_!==f||g!==m))break}return{x:d,z:u}}function Gg(n,t,e){const i=n.dash,a=n.config.dash;if(i.phase==="active"&&i.timer<=0&&(i.phase="idle",i.timer=0,fl(n,"roll")),i.cooldown>0){const l=i.cooldown;i.cooldown=Math.max(0,i.cooldown-t),l>0&&i.cooldown===0&&mc(n,"dash-ready",0)}const s=n.combat,o=s.weapon==="bow"&&(s.charging||s.phase!=="idle");if(e.sprintPressed&&i.cooldown<=0&&i.phase==="idle"&&(s.phase==="idle"||o)&&n.playerLink.phase==="idle"){o&&(s.charging=!1,s.charge=0,s.phase!=="idle"&&Xr(n));const l=p0(n,e),c=l.x,d=l.z,u=n.combat.weapon==="staff";if(i.kind=u?"blink":"roll",i.dirX=c,i.dirZ=d,i.fromX=n.character.position.x,i.fromZ=n.character.position.z,i.id+=1,i.cooldown=u?a.blinkCooldown:a.rollCooldown,u){const h=Hg(n,c,d);n.character.position.x=h.x,n.character.position.z=h.z,i.toX=h.x,i.toZ=h.z,i.duration=0,i.timer=0,i.phase="idle",a.blinkClearVelocity&&(n.character.velocity.x=0,n.character.velocity.z=0),fl(n,"blink"),mc(n,"blink",i.id)}else i.phase="active",i.duration=Math.max(_l,a.rollDuration),i.timer=i.duration,i.toX=i.fromX+c*a.rollDistance,i.toZ=i.fromZ+d*a.rollDistance,mc(n,"roll",i.id)}if(i.phase==="active"&&i.kind==="roll"){const l=Math.max(_l,i.timer),c=n.character.position.x,d=n.character.position.z;n.impulse.x=(i.toX-c)/l,n.impulse.z=(i.toZ-d)/l}i.phase==="active"&&(i.timer=Math.max(0,i.timer-t))}const ei=1e-6,Ud=Math.PI*2;function Nd(n,t){return Math.sqrt(n*n+t*t)}function Co(n,t,e){const i=n.character.position;n.events.push({type:t,tick:n.tick,x:i.x,y:i.y,z:i.z,value:e})}function Xg(n){const t=n.character,e=n.config.spawn;t.position.x=e.x,t.position.y=e.y,t.position.z=e.z,t.velocity.x=0,t.velocity.y=0,t.velocity.z=0,t.facing=0,t.moveYaw=0,t.bodyYaw=0,t.headYaw=0,t.headPitch=0,t.bodyPitch=0,t.grounded=!0,t.sprinting=!1,t.gaitPhase=0,t.stride=n.config.strideLength,t.distance=0,t.coyoteTime=n.config.coyoteTime,t.jumpBuffer=0,Xr(n)}function Vg(n,t,e){const i=n.character,a=n.config,s=co(n.boxes,t,e,a.characterHeight,a.characterRadius,a.stepHeight,Number.POSITIVE_INFINITY);i.position.x=t,i.position.y=s>Number.NEGATIVE_INFINITY?s:0,i.position.z=e,i.velocity.x=0,i.velocity.y=0,i.velocity.z=0,i.facing=0,i.moveYaw=0,i.bodyYaw=0,i.headYaw=0,i.headPitch=0,i.bodyPitch=0,i.grounded=!0,i.sprinting=!1,i.gaitPhase=0,i.stride=a.strideLength,i.distance=0,i.coyoteTime=a.coyoteTime,i.jumpBuffer=0,Xr(n),Kf(n),op(n),Wf(n),qf(n),wr(n);const o=n.targeting;o.targetId=0,o.targetYaw=0,o.targetDist=0,o.hasTarget=!1;const r=n.playerHurt;r.type="none",r.lastAt=vh,r.timer=0,r.duration=0,r.dirX=0,r.dirZ=0,r.knockX=0,r.knockZ=0,n.events.length=0}function Wg(n,t,e){const i=n.config,a=n.character,s=a.position,o=a.velocity;let r=Number.isFinite(e.moveX)?e.moveX:0,l=Number.isFinite(e.moveZ)?e.moveZ:0;const c=Nd(r,l);c>1&&(r/=c,l/=c);const d=i.worldBounds;(r>0&&s.x>=d.maxX-ei||r<0&&s.x<=d.minX+ei)&&(r=0),(l>0&&s.z>=d.maxZ-ei||l<0&&s.z<=d.minZ+ei)&&(l=0);const u=n.combat.phase!=="idle",h=n.playerLink.phase!=="idle",f=n.dash.phase==="active",m=u||f||h;a.sprinting=!m&&e.sprintHeld&&c>ei;const _=i.combat.weapons[n.combat.weapon];let g=_?_.moveMultiplier:1;f||h?g=0:u?g*=n.combat.phase==="active"?i.combat.lungeMoveScale:n.combat.phase==="settle"?i.combat.settleMoveScale:i.combat.attackMoveScale:n.combat.charging?g*=i.combat.bow.chargeMoveMultiplier:n.abilities.channeling&&(g*=Math.max(0,Math.min(1,n.abilities.channelMoveScale)));const p=i.moveSpeed*(a.sprinting?i.sprintMultiplier:1)*g;{const C=m?i.skillDecel:c>ei?i.acceleration:i.friction,I=1-Math.exp(-C*t);o.x+=(r*p-o.x)*I,o.z+=(l*p-o.z)*I}e.jumpPressed?a.jumpBuffer=i.jumpBufferTime:a.jumpBuffer=Math.max(0,a.jumpBuffer-t),a.coyoteTime=a.grounded?i.coyoteTime:Math.max(0,a.coyoteTime-t),a.jumpBuffer>0&&a.coyoteTime>0&&(o.y=i.jumpSpeed,a.grounded=!1,a.coyoteTime=0,a.jumpBuffer=0,Co(n,"jumped",i.jumpSpeed)),n.events.some(C=>C.type==="blink"&&C.tick===n.tick)&&(o.x=0,o.z=0,n.impulse.x=0,n.impulse.z=0);const x=s.x,y=s.z;if(s.x+=(o.x+n.impulse.x+n.playerHurt.knockX)*t,s.z+=(o.z+n.impulse.z+n.playerHurt.knockZ)*t,Mh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight)){if(bh(n.boxes,s,i.characterRadius,i.characterHeight,i.stepHeight))s.x=x,s.z=y,o.x=0,o.z=0;else{const C=s.x-x,I=s.z-y;Math.abs(C)<Math.abs(o.x*t)*.5&&(o.x=0),Math.abs(I)<Math.abs(o.z*t)*.5&&(o.z=0)}Co(n,"blocked",1)}s.x<d.minX?(s.x=d.minX,o.x<0&&(o.x=0),n.playerHurt.knockX<0&&(n.playerHurt.knockX=0)):s.x>d.maxX&&(s.x=d.maxX,o.x>0&&(o.x=0),n.playerHurt.knockX>0&&(n.playerHurt.knockX=0)),s.z<d.minZ?(s.z=d.minZ,o.z<0&&(o.z=0),n.playerHurt.knockZ<0&&(n.playerHurt.knockZ=0)):s.z>d.maxZ&&(s.z=d.maxZ,o.z>0&&(o.z=0),n.playerHurt.knockZ>0&&(n.playerHurt.knockZ=0));const S=co(n.boxes,s.x,s.z,s.y,i.characterRadius,i.stepHeight,i.fallTolerance);a.grounded&&S>s.y+ei&&S-s.y<=i.stepHeight+ei&&(s.y=S,o.y=0,Co(n,"stepUp",S));const T=s.y;o.y-=i.gravity*t,s.y+=o.y*t;const E=co(n.boxes,s.x,s.z,T,i.characterRadius,i.stepHeight,Number.POSITIVE_INFINITY);E>Number.NEGATIVE_INFINITY&&s.y<=E&&o.y<=0?(s.y=E,o.y=0,a.grounded||Co(n,"landed",E),a.grounded=!0):a.grounded=!1;const M=Nd(s.x-x,s.z-y);a.distance+=M;const b=M/Math.max(t,ei),R=Math.min(i.strideSpeedCap,b/Math.max(i.moveSpeed,ei)),k=Math.max(i.strideLength*(1+R*i.strideSpeedGain),ei);a.stride=k,a.gaitPhase=(a.gaitPhase+M/k*Ud)%Ud}const Ml=1e-6,Od=2.399963229728653;function ya(n,t,e){return n<t?t:n>e?e:n}function Bd(n,t,e,i,a,s,o,r,l){const c=t.x-n.x,d=t.z-n.z,u=Math.hypot(c,d),h=e+i;if(u>=h)return;let f,m,_;u<Ml?(f=r,m=l,_=h):(f=c/u,m=d/u,_=h-u);const g=_+o;n.x-=f*g*a,n.z-=m*g*a,t.x+=f*g*s,t.z+=m*g*s}function Yg(n){const t=n.config.separation,e=n.dummies,i=n.character.position,a=n.config.characterRadius,s=n.config.dummies.radius,o=Math.max(1,Math.floor(t.iterations)),r=Math.max(0,t.slop);for(let d=0;d<o;d++){for(let u=0;u<e.length;u++)for(let h=u+1;h<e.length;h++){const f=(u*3+h)*Od;Bd(e[u].position,e[h].position,s,s,.5,.5,r,Math.cos(f),Math.sin(f))}for(let u=0;u<e.length;u++){const h=(u+1)*Od;Bd(i,e[u].position,a,s,0,1,r,Math.cos(h),Math.sin(h))}}const l=n.config.stepHeight,c=n.config.worldBounds;for(const d of e)Mh(n.boxes,d.position,s,n.config.dummies.height,l),d.position.x=ya(d.position.x,c.minX,c.maxX),d.position.z=ya(d.position.z,c.minZ,c.maxZ)}function $g(n,t,e,i,a,s,o,r){const l=Math.hypot(e,i),c=Math.max(0,r.contactBand),d=ya(r.minScale,0,1);if(l<Ml||c<=0||d>=1)return 1;const u=a+o,h=ya(r.approachDot,0,.99);let f=0;for(const m of s){const _=m.position.x-n,g=m.position.z-t,p=Math.hypot(_,g);if(p>=u+c)continue;if(p<Ml){f=1;continue}const v=(e*_+i*g)/(l*p);if(v<=h)continue;const x=ya(1-(p-u)/c,0,1),y=ya((v-h)/(1-h),0,1);f=Math.max(f,x*y)}return 1-(1-d)*ya(f,0,1)}function Zg(n){const t=n.config.separation.crowd;if(!t)return;const e=n.character,i=$g(e.position.x,e.position.z,e.velocity.x,e.velocity.z,n.config.characterRadius,n.dummies,n.config.dummies.radius,t);i>=1||(e.velocity.x*=i,e.velocity.z*=i)}const gc=1e-6,jg=Math.PI/180;function qg(){return{targetId:0,targetYaw:0,targetDist:0,hasTarget:!1}}function Kg(n,t,e){return n<t?t:n>e?e:n}function Jg(n,t,e){const i=n.config.targeting,a=n.targeting,s=n.character.position;let o=n.character.facing;const r=Math.hypot(e.aimX,e.aimZ);e.aimActive&&r>gc?o=Math.atan2(e.aimX,e.aimZ):Math.hypot(e.moveX,e.moveZ)>gc&&(o=Math.atan2(e.moveX,e.moveZ));const l=Kg(i.maxAngleDeg,0,180)*jg;let c=Number.POSITIVE_INFINITY,d=0,u=0,h=0;for(const f of n.dummies){const m=f.position.x-s.x,_=f.position.z-s.z,g=Math.hypot(m,_);if(g<gc||g>i.range)continue;const p=Math.atan2(m,_),v=Math.abs(Ye(p-o));if(v>l)continue;const x=g-i.frontBias*Math.cos(v);x<c&&(c=x,d=f.id,u=p,h=g)}a.targetId=d,a.targetYaw=u,a.targetDist=h,a.hasTarget=d>0}const gi=1e-6;function ls(n,t,e){return n<t?t:n>e?e:n}function Hd(n){return Math.atan2(Math.sin(n),Math.cos(n))}function Qg(n,t,e){const i=n.config.gaze,a=n.gaze;if(!i.enabled||!n.modules.gaze){a.active=!1,a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}const s=n.character.position,o=(C,I)=>{const L=C.position.x-s.x,D=C.position.z-s.z,O=Math.hypot(L,D);if(O<gi||O>I)return 0;const B=ls((I-O)/Math.max(gi,I-i.nearDistance),0,1);let V=B*(i.modeWeight[C.mode]??.5);return C.attackPhase==="active"&&(V+=i.attackBoost*B),V},r=[];let l=0,c=!1,d=!1,u=!1;for(const C of n.dummies){const I=o(C,i.threatRange),L=C.position.x-s.x,D=C.position.z-s.z,O=Math.hypot(L,D);I>0&&(r.push({id:C.id,x:C.position.x,z:C.position.z,dx:L,dz:D,yaw:Math.atan2(L,D),w:I}),l+=I,O<=i.approachDist&&(i.modeWeight[C.mode]??.5)>=i.hostileModeWeight&&(u=!0)),O>gi&&O<=i.recoveryDist&&(c=!0),(C.attackPhase==="windup"||C.attackPhase==="active")&&O<=i.threatRange&&(d=!0)}const h=l<=0?0:ls(l/(l+Math.max(gi,i.saturation)),0,1),f=r.length>0,m=a.active,_=f&&(e.aimActive&&h>=i.enterThreshold||i.reactToAttack&&d&&h>=i.enterThreshold||i.reactToApproach&&u),g=i.hurtHoldSec>gi&&n.time-n.playerHurt.lastAt<i.hurtHoldSec,p=m&&(c||g);if(a.active=_||p,!a.active){a.mainId=0,a.mainYaw=0,a.mainPitch=0,a.centroidYaw=0,a.threatCount=0,a.threat=0;return}if(r.length===0)return;r.sort((C,I)=>I.w-C.w);const v=r.slice(0,Math.max(1,i.maxThreats)),x=r[0],y=Math.atan2(x.dx,x.dz),w=i.behindAngleDeg*Math.PI/180,S=n.character.bodyYaw;let T=0,E=0,M=0;for(const C of v){const I=Math.abs(Hd(C.yaw-y))/Math.PI;let L=C.w/(1+Math.max(i.spreadFalloff,0)*I*I);C!==x&&i.behindFalloff<1&&Math.abs(Hd(C.yaw-S))>w&&(L*=Math.max(i.behindFalloff,0)),T+=C.x*L,E+=C.z*L,M+=L}a.mainId=x.id,a.mainYaw=y;const b=n.dummies.find(C=>C.id===x.id),R=(b?b.position.y:0)+n.config.dummies.height*ls(i.aimHeightRatio,0,1),k=s.y+n.config.characterHeight*ls(i.eyeHeightRatio,0,1);a.mainPitch=Math.atan2(R-k,Math.max(gi,Math.hypot(x.dx,x.dz))),a.centroidYaw=M>gi?Math.atan2(T/M-s.x,E/M-s.z):y,a.threatCount=r.length,a.threat=h}function tx(n,t){const e=n.config.gaze;return(e.modeWeight[t.mode]??.5)>=e.hostileModeWeight}function ex(n,t){const e=n.config.gaze;if(!e.enabled||!n.modules.gaze)return 0;const i=n.character.position,a=Math.hypot(t.position.x-i.x,t.position.z-i.z);if(a<gi||a>e.threatRange)return 0;const s=Math.max(gi,e.threatRange-e.nearDistance),o=ls((e.threatRange-a)/s,0,1);let r=o*(e.modeWeight[t.mode]??.5);t.attackPhase==="active"&&(r+=e.attackBoost*o);const l=Math.max(gi,e.modeWeight.attack??1.5);return ls(r/l,0,1)}const Ea=1e-6,_s=Math.PI*2,ho={enabled:!1,dirDeg:0,speed:0,amplitude:0,wavelength:4,secondWave:{wavelength:2,amplitude:0,speedScale:1},gust:{periodSec:8,depth:0},jitter:0,shadeAmount:0};function rp(n){var t;return((t=n==null?void 0:n.grass)==null?void 0:t.wind)??ho}function Vr(n){return{time:0,gust:1-Math.min(1,Math.max(0,n.gust.depth))}}function nx(n,t,e){if(!t.enabled)return;n.time+=Math.max(0,e);const i=Math.max(.1,t.gust.periodSec),a=Math.min(1,Math.max(0,t.gust.depth));n.gust=1-a+a*(.5+.5*Math.sin(_s*n.time/i-Math.PI/2))}function ix(n,t,e,i){const a=n.dirDeg*Math.PI/180,s=t*Math.cos(a)+e*Math.sin(a),o=_s/Math.max(.1,n.wavelength),r=_s/Math.max(.1,n.secondWave.wavelength);return[o*s+i,r*s+i*1.7]}function cp(n){const t=n.dirDeg*Math.PI/180,e=_s/Math.max(.1,n.wavelength),i=_s/Math.max(.1,n.secondWave.wavelength);return{dirX:Math.cos(t),dirZ:Math.sin(t),omega1:e*n.speed,omega2:i*n.speed*n.secondWave.speedScale,amp1:n.amplitude,amp2:n.secondWave.amplitude,shadeAmount:n.shadeAmount}}const ax=.18,Gd=.4,sx=.6;function ox(n,t,e){if(n<0)return 0;if(n===0)return 1;if(t<=0)return 0;const i=Math.min(1,Math.max(0,1-n/t)),a=Math.min(1,Math.max(0,e))*ax,s=Math.min(1,Math.max(0,(i-a)/(1-a)));return s*s*(3-2*s)}function rx(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function lp(n,t){return n+","+t}function cx(n,t,e){return{spec:e??{minCellX:0,maxCellX:0,minCellZ:0,maxCellZ:0,density:0,bladesPerPatch:[0,0],avoidMargin:0,seed:0},cellSize:t.cellSize>0?t.cellSize:.5,bucketCells:(n==null?void 0:n.bucketCells)??4,blades:[],patches:[],buckets:{},cutCount:0,lastCutAt:0,wind:Vr((n==null?void 0:n.wind)??ho)}}function lx(n,t,e,i){const a=t.grass,s=n.grass;if(!a||!s||!s.enabled)return cx(s,i,a);const o=i.cellSize>0?i.cellSize:.5,r=rx(a.seed),l=Math.max(1,Math.floor(s.footprintCells)),c=Math.max(1,s.bucketCells)*o,d=Math.max(o,s.minHeightCells*o),u=Math.max(d,s.maxHeightCells*o),[h,f]=a.bladesPerPatch,m=Math.max(0,Math.floor(h)),_=Math.max(m,Math.floor(f)),g=e.filter(E=>E.kind!=="ground").map(E=>({minX:E.minX-a.avoidMargin,maxX:E.maxX+a.avoidMargin,minZ:E.minZ-a.avoidMargin,maxZ:E.maxZ+a.avoidMargin})),p=[],v=[],x={},y=a.plots??[],w=(E,M)=>{const b=E+l/2,R=M+l/2;for(let k=0;k<y.length;k++){const C=y[k],I=Math.max(0,C.clearMarginCells??0);if(b>=C.minCellX-I&&b<=C.maxCellX+I&&R>=C.minCellZ-I&&R<=C.maxCellZ+I)return!0}return!1},S=(E,M,b)=>{const R=p.length;for(let k=0;k<b;k++){const C=(E+r()*l)*o,I=(M+r()*l)*o;let L=!1;for(let It=0;It<g.length;It++){const K=g[It];if(C>=K.minX&&C<=K.maxX&&I>=K.minZ&&I<=K.maxZ){L=!0;break}}if(L)continue;const D=jf(e,C,I,3,0,.05),O=d+(u-d)*r(),B=(O-d)/Math.max(Ea,u-d),V=Math.min(1,Math.max(0,r()*.68+B*.32)),ot=p.length;p.push({id:ot,x:C,y:D,z:I,yaw:r()*_s,height:O,width:o*.26,tone:V,lean:(r()-.5)*.24,bend:0,bendX:0,bendZ:0,targetBend:0,recover:0,cut:0,cutAt:0});const gt=lp(Math.floor(C/c),Math.floor(I/c)),vt=x[gt];vt?vt.push(ot):x[gt]=[ot]}p.length>R&&v.push({id:v.length,cellX:E,cellZ:M,bladeFrom:R,bladeTo:p.length})},T=()=>m+Math.floor(r()*(_-m+1));for(let E=a.minCellZ;E+l<=a.maxCellZ;E+=l)for(let M=a.minCellX;M+l<=a.maxCellX;M+=l){const b=r();w(M,E)||b>a.density||S(M,E,T())}for(let E=0;E<y.length;E++){const M=y[E],b=Math.min(1,Math.max(0,M.density??1));for(let R=M.minCellZ;R+l<=M.maxCellZ;R+=l)for(let k=M.minCellX;k+l<=M.maxCellX;k+=l)r()>b||S(k,R,T())}return{spec:a,cellSize:o,bucketCells:s.bucketCells,blades:p,patches:v,buckets:x,cutCount:0,lastCutAt:0,wind:Vr(s.wind??ho)}}function hp(n,t,e,i){const a=Math.max(1,n.bucketCells)*n.cellSize,s=Math.floor((t-i)/a),o=Math.floor((t+i)/a),r=Math.floor((e-i)/a),l=Math.floor((e+i)/a),c=[];for(let d=s;d<=o;d++)for(let u=r;u<=l;u++){const h=n.buckets[lp(d,u)];if(h)for(let f=0;f<h.length;f++)c.push(h[f])}return c}function hx(n){const t=n.grass,e=n.config.grass;if(!t||!e||!e.enabled||!n.modules.grass)return 0;const i=g0(n);if(!i.active&&i.slamRadius<=0)return 0;const a=.02,s=Math.max(i.reach,i.slamRadius)+1;let o=0;const r=hp(t,i.x,i.z,s);for(let l=0;l<r.length;l++){const c=t.blades[r[l]];if(c.cut!==0||!x0(i,c.x,c.z,a)&&!v0(i,c.x,c.z,a))continue;c.cut=e.regrow?Math.max(Ea,e.regrowSec):-1,c.cutAt=n.time;const d=c.x-i.x,u=c.z-i.z,h=Math.sqrt(d*d+u*u);c.bendX=h>Ea?d/h:i.fx,c.bendZ=h>Ea?u/h:i.fz,c.bend=Math.min(e.maxBendRad,.55),c.targetBend=0,o+=1}return o>0&&(t.cutCount+=o,t.lastCutAt=n.time,n.events.push({type:"grass-cut",tick:n.tick,x:i.x,y:n.character.position.y,z:i.z,value:o})),o}function dx(n,t){const e=n.grass,i=n.config.grass;if(!e||e.blades.length===0||!i||!i.enabled||!n.modules.grass)return;const a=rp(n.config);e.wind||(e.wind=Vr(a)),nx(e.wind,a,t);const s=e.blades,o=s.length,r=new Array(o).fill(0),l=Math.max(0,i.bendRadius)+n.config.characterRadius;for(let m=0;m<o;m++)s[m].targetBend=0;const c=n.character.position.x,d=n.character.position.z,u=(m,_)=>{const g=hp(e,m,_,l);for(let p=0;p<g.length;p++){const v=g[p],x=s[v];if(x.cut!==0)continue;const y=x.x-m,w=x.z-_,S=Math.sqrt(y*y+w*w);if(S>l)continue;const T=1-S/l,E=i.maxBendRad*T*T;if(E>x.targetBend){x.targetBend=E;const M=S>Ea?1/S:0;x.bendX=S>Ea?y*M:0,x.bendZ=S>Ea?w*M:1,x.recover=0}r[v]=1}};if(u(c,d),n.modules.dummies)for(let m=0;m<n.dummies.length;m++)u(n.dummies[m].position.x,n.dummies[m].position.z);const h=1-Math.exp(-Math.max(0,i.bendRate)*t),f=1-Math.exp(-Math.max(0,i.recoverRate)*t);for(let m=0;m<o;m++){const _=s[m];_.bend+=(_.targetBend-_.bend)*(_.targetBend>_.bend?h:f),_.bend<1e-4&&(_.bend=0),!r[m]&&_.bend===0&&(_.recover+=t),_.cut>0&&(_.cut-=t,_.cut<=0&&(_.cut=0))}hx(n)}function ux(n){const t=n.grass;if(!t)return;for(let i=0;i<t.blades.length;i++){const a=t.blades[i];a.bend=0,a.targetBend=0,a.bendX=0,a.bendZ=0,a.recover=0,a.cut=0,a.cutAt=0}t.cutCount=0,t.lastCutAt=0;const e=Vr(rp(n.config));t.wind.time=e.time,t.wind.gust=e.gust}function fx(){return{active:!1,mainId:0,mainYaw:0,mainPitch:0,centroidYaw:0,threatCount:0,threat:0}}function px(n,t){const e=Y0(t);return{tick:0,time:0,rngState:2654435769,config:n,boxes:e,gridMeta:t.grid,character:{position:{x:n.spawn.x,y:n.spawn.y,z:n.spawn.z},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:n.strideLength,distance:0,coyoteTime:n.coyoteTime,jumpBuffer:0},combat:tp(1),playerLink:Gr(),arrows:[],arrowSeq:0,abilities:X0(),skills:H0(n),impulse:{x:0,z:0},targeting:qg(),turnInPlace:w0(),playerHurt:Uf(),hitCount:0,dash:{...Bg(),fromX:n.spawn.x,fromZ:n.spawn.z,toX:n.spawn.x,toZ:n.spawn.z},camera:{...Yf(),centroidX:n.spawn.x,centroidZ:n.spawn.z},gaze:fx(),dummies:wg(n.dummies),dummyAttackCount:0,grass:lx(n,t,e,t.grid),events:[],modules:{movement:!0,pathfinding:!1,combat:!0,links:!0,abilities:!0,orientation:!0,turnInPlace:!0,targeting:!0,hits:!0,separation:!0,dash:!0,camera:!0,gaze:!0,dummies:!0,grass:!0}}}function mx(n){Xg(n),sp(n),Kf(n);const t=n.targeting;t.targetId=0,t.targetYaw=0,t.targetDist=0,t.hasTarget=!1;const e=n.playerHurt;e.type="none",e.lastAt=vh,e.timer=0,e.duration=0,e.dirX=0,e.dirZ=0,n.hitCount=0,Wf(n),qf(n),op(n),$f(n),wr(n);const i=n.gaze;i.active=!1,i.mainId=0,i.mainYaw=0,i.mainPitch=0,i.centroidYaw=0,i.threatCount=0,i.threat=0,ux(n),n.events.length=0}function Xd(n,t,e){if(n.events.length=0,n.tick+=1,n.time+=t,n.impulse.x=0,n.impulse.z=0,e.resetPressed){mx(n);const i=n.config.spawn;return n.events.push({type:"reset",tick:n.tick,x:i.x,y:i.y,z:i.z,value:0}),n}return n.modules.dummies&&n.modules.targeting?Jg(n,t,e):(n.targeting.targetId=0,n.targeting.targetYaw=0,n.targeting.targetDist=0,n.targeting.hasTarget=!1),cg(n,t,e),n.modules.combat&&vg(n,t,e),n.modules.dash&&Gg(n,t,e),n.modules.movement&&Wg(n,t,e),n.modules.gaze&&Qg(n,t,e),n.modules.orientation&&R0(n,t,e),A0(n,t,e),n.modules.dummies&&zg(n,t,e),m0(n,t),ag(n,t),n.modules.abilities&&V0(n,t,e),n.modules.combat&&eg(n,t),n.modules.dummies&&(S0(n,t),n.modules.separation&&(Yg(n),Zg(n))),dx(n,t),n.modules.camera?W0(n):$f(n),n}const dp=["bodyYaw","bodyPitch","bodyRoll","pelvisX","pelvisZ","armPitch","armYaw","armRoll","elbow","bladePitch","armLPitch","armLYaw","armLRoll","elbowL","rootYaw","bladePitchOff","bladeTwist","bladeTwistOff","bladeYaw","bladeYawOff"],Vd=1e-9;function gx(n,t,e){return n<t?t:n>e?e:n}function up(n){return gx(Number.isFinite(n)?n:0,0,1)}function fp(n,t){const e=up(t);return n==="in"?e*e:n==="out"?1-(1-e)*(1-e):n==="inOut"?e*e*(3-2*e):e}function xx(){const n={};for(const t of dp)n[t]=0;return n}function vx(n,t){const e=xx(),i=(n==null?void 0:n.keys)??[];if(i.length===0)return e;const a=up(t);let s=0;for(;s<i.length-1&&a>i[s+1].t+Vd;)s+=1;const o=i[s],r=i[Math.min(s+1,i.length-1)],l=r.t-o.t,c=l>Vd?(a-o.t)/l:0,d=fp(o.ease??"linear",c);for(const u of dp){const h=o.pose[u]??r.pose[u]??0,f=r.pose[u]??o.pose[u]??0;e[u]=h+(f-h)*d}return e}function yx(n,t){const e=n==null?void 0:n.spin;if(!e||!Number.isFinite(e.turns)||e.turns===0)return 0;const i=e.ease??"linear",a=Number.isFinite(e.span)&&e.span>0?Math.min(1,e.span):1,s=fp(i,t/a);return e.turns*Math.PI*2*s}function oa(n,t){return((n==null?void 0:n.keys)??[]).some(e=>typeof e.pose[t]=="number")}function _x(n){let t=0;return{frame(e,i,a,s,o){if(s||a<=0)return t=0,0;t+=Math.min(e,.1)*a;const r=n.config.fixedDt,l=n.config.maxStepsPerFrame;let c=0;for(;t>=r&&c<l;){const d=c===0?i:{...i,jumpPressed:!1,resetPressed:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2Pressed:!1,weaponSlot:0,dummyClickId:0};Xd(n,r,d),o&&o(),t-=r,c++}return c>=l&&(t=0),c},singleStep(e){Xd(n,n.config.fixedDt,e),t=0},reset(){t=0},get accumulator(){return t},get alpha(){const e=n.config.fixedDt;return e>0?Math.max(0,Math.min(1,t/e)):1}}}function Ei(n,t,e){let i=t-n;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return n+i*e}function Ue(n,t,e){return n+(t-n)*e}function Mx(n){const t=n.combat,e=n.dummies;let i=`${t.weapon}|${t.phase}|${t.comboIndex}|${t.attackId}|${n.character.grounded?1:0}|${n.character.sprinting?1:0}|${n.playerHurt.type}|${t.hitstop>0?1:0}|d:${n.dash.phase}:${n.dash.kind}|t:${n.turnInPlace.phase}|l:${n.playerLink.phase}:${n.playerLink.kind}`;for(let a=0;a<e.length;a++){const s=e[a];i+=`|${s.id}:${s.mode}:${s.attackPhase}:${s.attackId}:${s.hurt.type}`}return i}function Wd(n){const t=n.character,e=n.combat,i=n.playerHurt;return{time:n.time,key:Mx(n),ch:{x:t.position.x,y:t.position.y,z:t.position.z,facing:t.facing,moveYaw:t.moveYaw,bodyYaw:t.bodyYaw,headYaw:t.headYaw,headPitch:t.headPitch,bodyPitch:t.bodyPitch,gaitPhase:t.gaitPhase,stride:t.stride,vx:t.velocity.x,vy:t.velocity.y,vz:t.velocity.z},cb:{attackProgress:e.attackProgress,phaseTimer:e.phaseTimer,charge:e.charge,hitstop:e.hitstop},dash:{timer:n.dash.timer},turn:{progress:n.turnInPlace.progress},link:{progress:n.playerLink.progress},hurt:{timer:i.timer,duration:i.duration,knockX:i.knockX,knockZ:i.knockZ},dm:n.dummies.map(a=>({x:a.position.x,y:a.position.y,z:a.position.z,facing:a.facing,bodyYaw:a.bodyYaw,headYaw:a.headYaw,gaitPhase:a.gaitPhase,stride:a.stride,attackProgress:a.attackProgress,vx:a.velocity.x,vy:a.velocity.y,vz:a.velocity.z}))}}function bx(n,t){return n.key===t.key&&n.dm.length===t.dm.length}function Sx(n,t,e){const i=Math.max(0,Math.min(1,e)),a={position:{x:Ue(n.ch.x,t.ch.x,i),y:Ue(n.ch.y,t.ch.y,i),z:Ue(n.ch.z,t.ch.z,i)},facing:Ei(n.ch.facing,t.ch.facing,i),moveYaw:Ei(n.ch.moveYaw,t.ch.moveYaw,i),bodyYaw:Ei(n.ch.bodyYaw,t.ch.bodyYaw,i),headYaw:Ei(n.ch.headYaw,t.ch.headYaw,i),headPitch:Ue(n.ch.headPitch,t.ch.headPitch,i),bodyPitch:Ue(n.ch.bodyPitch,t.ch.bodyPitch,i),gaitPhase:Ei(n.ch.gaitPhase,t.ch.gaitPhase,i),stride:Ue(n.ch.stride,t.ch.stride,i),velocity:{x:Ue(n.ch.vx,t.ch.vx,i),y:Ue(n.ch.vy,t.ch.vy,i),z:Ue(n.ch.vz,t.ch.vz,i)}},s={attackProgress:Ue(n.cb.attackProgress,t.cb.attackProgress,i),phaseTimer:Ue(n.cb.phaseTimer,t.cb.phaseTimer,i),charge:Ue(n.cb.charge,t.cb.charge,i),hitstop:i<1?Math.max(0,Ue(n.cb.hitstop,t.cb.hitstop,i)):t.cb.hitstop},o={timer:Ue(n.hurt.timer,t.hurt.timer,i),knockX:Ue(n.hurt.knockX,t.hurt.knockX,i),knockZ:Ue(n.hurt.knockZ,t.hurt.knockZ,i)},r=t.dm.map((l,c)=>{const d=n.dm[c];return d?{position:{x:Ue(d.x,l.x,i),y:Ue(d.y,l.y,i),z:Ue(d.z,l.z,i)},facing:Ei(d.facing,l.facing,i),bodyYaw:Ei(d.bodyYaw,l.bodyYaw,i),headYaw:Ei(d.headYaw,l.headYaw,i),gaitPhase:Ei(d.gaitPhase,l.gaitPhase,i),stride:Ue(d.stride,l.stride,i),attackProgress:Ue(d.attackProgress,l.attackProgress,i),velocity:{x:Ue(d.vx,l.vx,i),y:Ue(d.vy,l.vy,i),z:Ue(d.vz,l.vz,i)}}:null});return{time:Ue(n.time,t.time,i),character:a,combat:s,playerHurt:o,dash:{timer:Ue(n.dash.timer,t.dash.timer,i)},turn:{progress:Ue(n.turn.progress,t.turn.progress,i)},link:{progress:Ue(n.link.progress,t.link.progress,i)},dummies:r}}function wx(n,t){const e=n.dummies.map((i,a)=>{const s=t.dummies[a];return s?{...i,...s}:i});return{...n,time:t.time,character:{...n.character,...t.character},combat:{...n.combat,...t.combat},playerHurt:{...n.playerHurt,...t.playerHurt},dash:{...n.dash,timer:t.dash.timer},turnInPlace:{...n.turnInPlace,progress:t.turn.progress},playerLink:{...n.playerLink,progress:t.link.progress},dummies:e}}const pp={slopPx:12,longPressMs:450,doubleTapMs:280};function Ex(n,t,e=pp.slopPx){if(n.distance<e)return{...n,worldX:0,worldZ:0};const i=n.dx/n.distance,a=n.dy/n.distance,s=t.rightX*i+t.forwardX*-a,o=t.rightZ*i+t.forwardZ*-a,r=Math.hypot(s,o);return r<1e-6?{...n,worldX:0,worldZ:0}:{...n,worldX:s/r,worldZ:o/r}}function ra(n,t,e,i,a,s){const o=Math.hypot(e,i);return{button:n,kind:t,dx:e,dy:i,distance:o,angleDeg:o>.001?Math.atan2(i,e)*180/Math.PI:0,heldMs:a,taps:s,worldX:0,worldZ:0}}function Tx(n=pp){const t=new Map,e=new Map,i=a=>t.get(a);return{begin(a,s,o,r,l){if(t.has(s))return null;for(const c of t.values())if(c.button===a)return null;return t.set(s,{button:a,pointerId:s,startX:o,startY:r,x:o,y:r,startedAt:l,dragging:!1,longFired:!1}),ra(a,"press",0,0,0,1)},move(a,s,o,r){const l=i(a);if(!l)return null;l.x=s,l.y=o;const c=s-l.startX,d=o-l.startY;return!l.dragging&&Math.hypot(c,d)>=n.slopPx?(l.dragging=!0,ra(l.button,"drag",c,d,r-l.startedAt,1)):null},end(a,s,o,r){const l=i(a);if(!l)return null;t.delete(a),l.x=s,l.y=o;const c=s-l.startX,d=o-l.startY,u=r-l.startedAt,h=Math.hypot(c,d);if(l.dragging||l.longFired||h>=n.slopPx)return ra(l.button,"release",c,d,u,1);const f=e.get(l.button);return f!==void 0&&r-f.at<=n.doubleTapMs&&Math.hypot(s-f.x,o-f.y)<=n.slopPx*2?(e.delete(l.button),ra(l.button,"doubleTap",c,d,u,2)):(e.set(l.button,{at:r,x:s,y:o}),ra(l.button,"tap",c,d,u,1))},cancel(a,s){const o=i(a);return o?(t.delete(a),ra(o.button,"cancel",o.x-o.startX,o.y-o.startY,s-o.startedAt,1)):null},poll(a){for(const s of t.values())if(!(s.longFired||s.dragging)&&a-s.startedAt>=n.longPressMs)return s.longFired=!0,ra(s.button,"longPress",s.x-s.startX,s.y-s.startY,a-s.startedAt,1);return null},isHeld(a){for(const s of t.values())if(s.button===a)return!0;return!1},reset(){t.clear(),e.clear()}}}const xc=.001,Ax=18;function bl(n,t,e){return n<t?t:n>e?e:n}function Sl(){return{active:!1,lastDist:0,armDist:0,armed:!1}}function Rx(n){const t=n.length;if(t<2)return null;const e=n[t-2],i=n[t-1];return e.id===i.id?null:[e,i]}function Px(n,t,e,i,a=Ax){const s=Rx(t);if(!s)return{state:Sl(),scale:1,started:!1,ended:n.active,armedNow:!1,pinching:!1};const o=Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y),r=a,l=Math.max(1.0001,Number.isFinite(i)?i:1.25),c=1/l,d=l;if(!Number.isFinite(o)||o<xc)return{state:{active:!0,lastDist:0,armDist:0,armed:n.armed},scale:1,started:!n.active,ended:!1,armedNow:!1,pinching:n.armed};if(!n.active){const m=r<=0;return{state:{active:!0,lastDist:o,armDist:o,armed:m},scale:1,started:!0,ended:!1,armedNow:!1,pinching:m}}if(!n.armed)return n.armDist<xc?{state:{active:!0,lastDist:o,armDist:o,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:Math.abs(o-n.armDist)<r?{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!1},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!1}:{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!0,pinching:!0};if(n.lastDist<xc)return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:1,started:!1,ended:!1,armedNow:!1,pinching:!0};const u=o/n.lastDist,h=Math.max(0,Number.isFinite(e)?e:1),f=Number.isFinite(u)&&u>0?Math.pow(u,h):1;return{state:{active:!0,lastDist:o,armDist:n.armDist,armed:!0},scale:bl(Number.isFinite(f)?f:1,c,d),started:!1,ended:!1,armedNow:!1,pinching:!0}}function Yd(n,t,e,i){const a=Math.min(e,i),s=Math.max(e,i),o=Number.isFinite(t)&&t>0?t:1,r=n*o;return Number.isFinite(r)?bl(r,a,s):bl(n,a,s)}function Cx(n,t){const e=Number.isFinite(t)&&t>0?t:1,i=Number.isFinite(n)?n:0;return Math.pow(e,i/100)}function Lx(){const n=typeof window<"u"?window.visualViewport:null;return n?{left:n.offsetLeft,top:n.offsetTop}:typeof window<"u"?{left:0,top:0}:null}const vc=["jump","sprint","reset","attack","skill2"],Dx=8,kx=16,yc=10,$d=14,Zd=140,Ix=18,zx=16,Fx=400,Ux=1.0001;function fr(n){return n instanceof Element&&n.closest("[data-ui-button], [data-ui-region], #panel-row, #panel-stack, #hud, #weapon-bar")!==null}function Nx(n,t){if(!Number.isFinite(n)||!Number.isFinite(t)||typeof document.elementFromPoint!="function")return!1;const e=document.elementFromPoint(n,t);return e instanceof Element&&fr(e)}function Ox(n){const{maxRadiusPx:t,deadZone:e,getBasis:i,zoom:a}=n,s=()=>Math.max(8,t());let o=null,r=0,l=0,c=0,d=0,u=0,h=0,f=-1,m=0,_=null,g=-1,p=0,v=0,x=0,y=0,w=!1,S=0,T=1,E=0,M=null,b=0,R=0,k=!1,C=null,I=null,L=0,D=0,O=0,B=0,V=!1,ot=!0,gt=-1;const vt=Tx({slopPx:$d,longPressMs:450,doubleTapMs:350});let It=[],K=null;const it=new Set;function ct(H){H&&It.push(H)}const Z=new Map;let J=Sl(),lt=!1,Ht=1;function qt(){const H=Array.from(Z.values()),ht=a(),yt=Px(J,H,ht.pinchGain,ht.maxStepRatio,Ix);if(J=yt.state,lt=yt.pinching,yt.scale!==1&&(Ht*=yt.scale),yt.started||yt.armedNow)M=null,k=!0,C=null;else if(yt.ended&&o===null&&H.length===1){const Gt=H[0];o=Gt.id,r=Gt.x,l=Gt.y,c=0,d=0,u=Gt.x,h=Gt.y,w=!1,S=0,T=1,E=0,performance.now(),M=null,k=!0,C=null}}const Ct={jump:!1,sprint:!1,reset:!1,attack:!1,skill2:!1},q={jump:!1,reset:!1,sprintPressed:!1,attackPressed:!1,attackReleased:!1,skill2:!1};let U=0,Nt=0;const Dt={},St=new Set,_t=[];function xt(){for(const H of vc)Dt[H]!==void 0&&(Dt[H]=void 0),G(H);vt.reset(),it.clear(),Z.clear(),J=Sl(),lt=!1,o=null,c=0,d=0,u=0,h=0,w=!1,S=0,T=1,E=0,p=0,v=0,x=0,y=0,_=null,g=-1,M=null,k=!1,C=null,I=null,gt=-1,O=0,B=0,V=!1,ot=!0}const Rt=()=>{document.hidden&&xt()},F=H=>{if(H.clientX===0&&H.clientY===0){m++;return}if(fr(H.target)||Nx(H.clientX,H.clientY)){it.add(H.pointerId);return}if(it.delete(H.pointerId),Z.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),o===null&&!lt){_=null,g=-1,o=H.pointerId,r=H.clientX,l=H.clientY,c=0,d=0,u=H.clientX,h=H.clientY,performance.now();const ht=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY)&&(H.screenX!==0||H.screenY!==0);w=ht,S=0,T=1,E=0,p=ht?H.screenX:0,v=ht?H.screenY:0,x=p,y=v,M=H.pointerId,b=H.clientX,R=H.clientY,k=!1}qt()},A=H=>{if(H.pointerId===I&&(H.pointerType==="mouse"&&H.buttons===0||H.clientX===0&&H.clientY===0&&(L!==0||D!==0)||(ot?(O=H.clientX-L,B=H.clientY-D):(L=H.clientX,D=H.clientY,ot=!0,O=0,B=0))),ct(vt.move(H.pointerId,H.clientX,H.clientY,performance.now())),!it.has(H.pointerId)&&Z.has(H.pointerId)&&(Z.set(H.pointerId,{id:H.pointerId,x:H.clientX,y:H.clientY}),qt()),it.has(H.pointerId)||H.pointerId!==o)return;const ht=performance.now();if(_===H.pointerId&&ht-g<150){m++;return}const yt=H.clientX,Gt=H.clientY;if(yt===0&&Gt===0&&(r!==0||l!==0)){m++;return}const Lt=yt-u,N=Gt-h,wt=Number.isFinite(H.screenX)&&Number.isFinite(H.screenY),st=wt?H.screenX:0,dt=wt?H.screenY:0,Et=wt&&(st!==0||dt!==0),Tt=st-x,Qt=dt-y;if(w&&Et){const Be=Math.hypot(Tt,Qt),Re=Math.hypot(Lt,N);if(Be>3){if(S=0,E<30&&Re>6&&Tt*Lt+Qt*N>.7*Be*Re){const qe=Be/Re;qe>.2&&qe<5&&(T+=(qe-T)*.3,E++)}}else Re>12&&(S++,S>=2&&(w=!1))}const re=Math.hypot(Lt,N);if(!w){const Be=f<0?Number.POSITIVE_INFINITY:ht-f,Re=Et?Math.hypot(Tt,Qt):1/0;re>28&&(Be<200||Re<re*.4)&&(r+=Lt,l+=N,m++)}u=yt,h=Gt,x=st,y=dt,H.pointerId===M&&Math.hypot(H.clientX-b,H.clientY-R)>Dx&&(k=!0);let de,ae;w&&Et?(de=(st-p)/T,ae=(dt-v)/T):(de=yt-r,ae=Gt-l);const Te=Math.hypot(de,ae),ge=s();Te>ge&&(de*=ge/Te,ae*=ge/Te);const gn=Math.hypot(c,d),wn=Math.hypot(de,ae);if(gn>10&&wn>10){const Be=Math.abs(Math.atan2(c*ae-d*de,c*de+d*ae)),Re=Math.max(gn,wn)*Be,qe=Math.max(Math.hypot(Lt,N),Math.hypot(Tt,Qt)/Math.max(.2,T));if(Be>.6&&qe<Math.max(6,Re*.5)){m++;return}}c=de,d=ae};function G(H){if(!Ct[H])return;Ct[H]=!1,H==="attack"&&(q.attackReleased=!0);const ht=document.getElementById(`btn-${H}`);ht==null||ht.classList.remove("is-down")}function pt(){o!==null&&(_=o,g=performance.now(),o=null,c=0,d=0,u=0,h=0,w=!1,S=0,T=1,E=0,p=0,v=0,x=0,y=0)}const Q=H=>{const ht=Z.delete(H.pointerId),yt=it.delete(H.pointerId);ht&&qt(),H.pointerId===I&&(I=null,V?gt=performance.now():(O=0,B=0,gt=-1)),ct(vt.end(H.pointerId,H.clientX,H.clientY,performance.now()));for(const Ot of vc)Dt[Ot]===H.pointerId&&(Dt[Ot]=void 0,G(Ot));const Gt=!ht&&!yt&&Z.size<=1&&o!==null;(H.pointerId===o||Z.size===0||Gt)&&pt(),!yt&&H.pointerId===M&&(!k&&!fr(H.target)&&(C={x:H.clientX,y:H.clientY}),M=null)};for(const H of vc){const ht=document.getElementById(`btn-${H}`);if(!ht)continue;const yt=H==="attack"||H==="skill2",Gt=N=>{if(N.preventDefault(),Dt[H]===void 0){Dt[H]=N.pointerId,Ct[H]=!0,H==="jump"&&(q.jump=!0),H==="reset"&&(q.reset=!0),H==="sprint"&&(q.sprintPressed=!0),H==="attack"&&(q.attackPressed=!0),H==="skill2"&&(q.skill2=!0),ht.classList.add("is-down"),ct(vt.begin(H,N.pointerId,N.clientX,N.clientY,performance.now()));try{ht.setPointerCapture(N.pointerId)}catch{}yt&&(I=N.pointerId,L=N.clientX,D=N.clientY,ot=!(N.clientX===0&&N.clientY===0),O=0,B=0,V=!1,gt=-1)}},Ot=N=>{Dt[H]===N.pointerId&&(Dt[H]=void 0,G(H),ct(vt.end(N.pointerId,N.clientX,N.clientY,performance.now())))},Lt=N=>{Dt[H]===N.pointerId&&(Dt[H]=void 0,G(H),ct(vt.cancel(N.pointerId,performance.now())))};ht.addEventListener("pointerdown",Gt),ht.addEventListener("pointerup",Ot),ht.addEventListener("pointercancel",Lt),_t.push(()=>{ht.removeEventListener("pointerdown",Gt),ht.removeEventListener("pointerup",Ot),ht.removeEventListener("pointercancel",Lt)})}const rt=Array.from(document.querySelectorAll(".wp[data-weapon]"));for(const H of rt){const ht=yt=>{yt.preventDefault(),U=Number(H.dataset.weapon)||0};H.addEventListener("pointerdown",ht),_t.push(()=>H.removeEventListener("pointerdown",ht))}const Ft=H=>{const ht=H.key.toLowerCase();if((ht===" "||ht.startsWith("arrow"))&&H.preventDefault(),St.has(ht))return;St.add(ht),ht===" "&&(q.jump=!0),ht==="r"&&(q.reset=!0),ht==="shift"&&(q.sprintPressed=!0),ht==="j"&&(q.attackPressed=!0),ht==="k"&&(q.skill2=!0),ht>="1"&&ht<="5"&&(U=Number(ht)),ht>="6"&&ht<="9"&&(Nt=Number(ht)-5);const yt=Math.max(Ux,a().keyStep||1.12);(ht==="="||ht==="+")&&(Ht*=yt),(ht==="-"||ht==="_")&&(Ht/=yt)},tt=H=>{const ht=H.key.toLowerCase();St.has(ht)&&(St.delete(ht),ht==="j"&&(q.attackReleased=!0))},ut=H=>{if(fr(H.target))return;H.preventDefault();const ht=H.deltaMode===1?H.deltaY*zx:H.deltaMode===2?H.deltaY*Fx:H.deltaY;Ht*=Cx(ht,a().wheelStep)},Ut=H=>{H.preventDefault()},at=()=>{f=performance.now()};window.addEventListener("resize",at),window.addEventListener("orientationchange",at);const bt=typeof window<"u"?window.visualViewport:null;return bt&&(bt.addEventListener("resize",at),bt.addEventListener("scroll",at)),window.addEventListener("pointerdown",F),window.addEventListener("pointermove",A),window.addEventListener("pointerup",Q),window.addEventListener("pointercancel",Q),window.addEventListener("blur",xt),document.addEventListener("visibilitychange",Rt),window.addEventListener("keydown",Ft),window.addEventListener("keyup",tt),window.addEventListener("wheel",ut,{passive:!1}),window.addEventListener("gesturestart",Ut),{peekStick(){return{id:o,held:o!==null,originX:r,originY:l,x:u,y:h,dx:u-r,dy:h-l,radius:s(),badMoves:m,screenOk:w,originSX:p,originSY:v,screenX:x,screenY:y,scale:T}},peekAim(){const H=performance.now(),ht=Math.hypot(O,B),yt=I!==null||gt>=0&&H-gt<Zd;if(!(yt&&V&&ht>=yc))return{active:!1,holding:yt,x:0,z:0,dx:O,dy:B};const Ot=i(),Lt=O/ht,N=B/ht,wt=Ot.rightX*Lt+Ot.forwardX*-N,st=Ot.rightZ*Lt+Ot.forwardZ*-N,dt=Math.hypot(wt,st)||1;return{active:!0,holding:yt,x:wt/dt,z:st/dt,dx:O,dy:B}},sample(){var kn;const H=s();let ht=o!==null?Math.max(-1,Math.min(1,c/H)):0,yt=o!==null?Math.max(-1,Math.min(1,d/H)):0,Gt=0,Ot=0;(St.has("a")||St.has("arrowleft"))&&(Gt-=1),(St.has("d")||St.has("arrowright"))&&(Gt+=1),(St.has("w")||St.has("arrowup"))&&(Ot-=1),(St.has("s")||St.has("arrowdown"))&&(Ot+=1),ht+=Gt,yt+=Ot;let Lt=Math.hypot(ht,yt);Lt>1&&(ht/=Lt,yt/=Lt,Lt=1);const N=ht,wt=yt;Lt<e&&(ht=0,yt=0);const st=i();let dt=st.rightX*ht+st.forwardX*-yt,Et=st.rightZ*ht+st.forwardZ*-yt;const Tt=Math.hypot(dt,Et);Tt>1&&(dt/=Tt,Et/=Tt);const Qt=performance.now();ct(vt.poll(Qt));const re=Math.hypot(O,B);I!==null&&(re>=kx?V=!0:re<yc&&(V=!1));const de=I!==null||gt>=0&&Qt-gt<Zd,ae=de&&V&&re>=yc;let Te=0,ge=0;if(ae){const nn=O/re,W=B/re,Pt=st.rightX*nn+st.forwardX*-W,kt=st.rightZ*nn+st.forwardZ*-W,ee=Math.hypot(Pt,kt)||1;Te=Pt/ee,ge=kt/ee}!de&&I===null&&(O=0,B=0,gt=-1,V=!1);const gn=C;C=null;const wn=Ht;Ht=1;const Be={moveX:dt,moveZ:Et,jumpPressed:q.jump,sprintHeld:Ct.sprint||St.has("shift"),sprintPressed:q.sprintPressed,resetPressed:q.reset,attackPressed:q.attackPressed,attackHeld:Ct.attack||St.has("j"),attackReleased:q.attackReleased,skill2Pressed:q.skill2,weaponSlot:U,dummyClickId:Nt,aimX:Te,aimZ:ge,aimActive:ae};q.jump=!1,q.reset=!1,q.sprintPressed=!1,q.attackPressed=!1,q.attackReleased=!1,q.skill2=!1,U=0,Nt=0;const Re=It.map(nn=>Ex(nn,st,$d));It=[],Re.length>0&&(K=Re[Re.length-1]);const qe=o!==null?"pointer":St.size>0?"keyboard":"idle";return{intents:Be,stickX:ht,stickY:yt,stickRawX:N,stickRawY:wt,stickHeld:o!==null,stickId:o,stickOriginX:r,stickOriginY:l,stickPxX:u,stickPxY:h,stickBad:m,stickScreenOk:w,stickOriginSX:p,stickOriginSY:v,stickScreenX:x,stickScreenY:y,stickScale:T,stickVpTop:((kn=Lx())==null?void 0:kn.top)??0,stickVpAge:f<0?-1:Math.round(performance.now()-f),aimDX:O,aimDY:B,source:qe,tap:gn,zoomScale:wn,gestures:Re,lastGesture:K}},dispose(){window.removeEventListener("pointerdown",F),window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",Q),window.removeEventListener("pointercancel",Q),window.removeEventListener("blur",xt),document.removeEventListener("visibilitychange",Rt),window.removeEventListener("keydown",Ft),window.removeEventListener("keyup",tt),window.removeEventListener("wheel",ut),window.removeEventListener("resize",at),window.removeEventListener("orientationchange",at),bt&&(bt.removeEventListener("resize",at),bt.removeEventListener("scroll",at)),window.removeEventListener("gesturestart",Ut),vt.reset();for(const H of _t)H()}}}const Rr=1,Pr=2,Cr=4,mp=8,Lr=16,Qs=32,gp=64,xp=128,Bx=[[Rr,"atk"],[Pr,"dash"],[Cr,"link"],[mp,"air"],[Lr,"hurt"],[Qs,"aim"],[gp,"spr"],[xp,"chan"]];function Ga(n){if(n===0)return"-";const t=Bx.filter(([e])=>(n&e)!==0).map(([,e])=>e);return t.length>0?t.join(","):"-"}const Hx=["t","tick","dt","st","sy","rs","ry","held","src","mx","mz","px","pz","vx","vz","yaw","body","fl","stride","inYaw","pid","ox","oy","fx","fy","bad","vvt","osx","osy","fsx","fsy","scr","scl"],Gx=0,Xx=15,_c=19,Vx=21,Wx=22,Yx=23,$x=24,pi={sampleHz:30,sampleCapacity:600,eventCapacity:160,anomalyCapacity:24,dirJumpDeg:50,aimDropDeg:22,freezeMs:220,freezeSpeed:.08,stickLostMs:300,spikeMs:50},In=n=>Number.isFinite(n)?Math.round(n*1e3)/1e3:0,ni=n=>Math.round(n*180/Math.PI*10)/10,Mc=Math.PI*2;function Us(n){let t=n%Mc;return t>Math.PI&&(t-=Mc),t<-Math.PI&&(t+=Mc),t}function Zx(n,t){let e=0;return n.combat.phase!=="idle"&&(e|=Rr),n.dash.phase!=="idle"&&(e|=Pr),n.playerLink.phase!=="idle"&&(e|=Cr),n.character.grounded||(e|=mp),n.playerHurt.type!=="none"&&(e|=Lr),t.intents.aimActive&&(e|=Qs),n.character.sprinting&&(e|=gp),n.abilities.channeling&&(e|=xp),e}function jx(n){const t=`(${n.x.toFixed(1)},${n.z.toFixed(1)})`;switch(n.type){case"attack-start":return`slot${n.value}`;case"hit":case"link-hit":case"player-hurt":case"dummy-hit":return`dummy${n.value} ${t}`;case"link-start":case"link-active":case"link-end":return`link${n.value} ${t}`;case"weapon-change":return`slot${n.value}`;case"dummy-mode":return`dummy${n.value}`;case"blocked":return t;case"landed":case"jumped":return t;default:return n.value!==0?`v${n.value}`:""}}function qx(n){const t={sampleHz:n.sampleHz??pi.sampleHz,sampleCapacity:n.sampleCapacity??pi.sampleCapacity,eventCapacity:n.eventCapacity??pi.eventCapacity,anomalyCapacity:n.anomalyCapacity??pi.anomalyCapacity,dirJumpDeg:n.dirJumpDeg??pi.dirJumpDeg,aimDropDeg:n.aimDropDeg??pi.aimDropDeg,freezeMs:n.freezeMs??pi.freezeMs,freezeSpeed:n.freezeSpeed??pi.freezeSpeed,stickLostMs:n.stickLostMs??pi.stickLostMs,spikeMs:n.spikeMs??pi.spikeMs},e=n.meta,i=[],a=[],s=[],o={frames:0,wallMs:0,simS:0,fps:0,dtMax:0,spikes:0,steps:0,stickActiveMs:0,gestures:{},attacks:0,hits:0,hurts:0,links:0,linkHits:0,rolls:0,blinks:0,jumps:0,resets:0,channels:0,bolts:0,rings:0,bowCharges:0,inTurns:0,inTurnMax:0,dirJumps:0,aimDrops:0,freezes:0,stickLosts:0,stickJumps:0,stickBads:0,stickDrifts:0,screenFrames:0,clientFrames:0};let r=!0,l=-1,c=-1e9,d=null,u=0,h=0,f="",m=-1,_=-1,g=-1,p=0,v=-1e9,x=-1,y={},w=null,S=0,T=0,E=0,M=0;function b(L,D){const O=1/t.sampleHz,B=L[Gx];B-c<O-1e-6||(i.length>=t.sampleCapacity&&i.shift(),i.push(L),c=B)}function R(L,D,O,B,V,ot){const gt=y[L]??-1e9;if(D-gt<1.2)return;if(y[L]=D,L==="frameSpike"){let It=0;for(const K of s)K.kind==="frameSpike"&&It++;if(It>=6)return}s.length>=t.anomalyCapacity&&s.shift();let vt=i.slice(-7);ot&&(vt.length===0||vt[vt.length-1]!==ot)&&(vt=[...vt.slice(-6),ot]),s.push({kind:L,t:In(D),tick:O,ms:Math.round(B),detail:V,ctx:vt}),L==="dirJump"?o.dirJumps++:L==="aimDrop"?o.aimDrops++:L==="moveFreeze"?o.freezes++:L==="stickLost"?o.stickLosts++:L==="stickJump"?o.stickJumps++:L==="stickBad"?o.stickBads++:L==="stickDrift"&&o.stickDrifts++}function k(L,D,O,B){a.length>=t.eventCapacity&&a.shift(),a.push({t:In(O),tick:B,k:L,d:D})}function C(L){switch(L.type){case"attack-start":o.attacks++;break;case"hit":o.hits++;break;case"player-hurt":o.hurts++;break;case"link-start":o.links++;break;case"link-hit":o.linkHits++;break;case"roll":o.rolls++;break;case"blink":o.blinks++;break;case"channel-start":o.channels++;break;case"projectile-fire":o.bolts++;break;case"ring-place":o.rings++;break;case"charge-start":o.bowCharges++;break;case"jumped":o.jumps++;break;case"reset":o.resets++;break;case"blocked":v=L.tick;break}}function I(){const L=o,D=L.wallMs/1e3,O=L.gestures,B=vt=>Object.entries(O).filter(([It])=>It.endsWith(`.${vt}`)).reduce((It,[,K])=>It+K,0),V=[];if(V.push(`# ${e.version} · ${e.startedAt} · ${e.screen}@${e.dpr} ${e.orientation==="portrait"?"竖":"横"} · ${e.cores}核`),V.push(`运行 ${D.toFixed(1)}s / ${L.frames} 帧 · ${L.fps.toFixed(1)}fps · 最大 ${L.dtMax.toFixed(0)}ms · 尖峰 ${L.spikes} · 步 ${L.steps}`),V.push(`摇杆活跃 ${D>0?Math.round(L.stickActiveMs/1e3/D*100):0}% · 手势 按下 ${B("press")}（单击 ${B("tap")} / 双击 ${B("doubleTap")} / 拖拽 ${B("drag")} / 长按 ${B("longPress")} / 打断 ${B("cancel")} / 拖放 ${B("release")}）`),V.push(`攻击 ${L.attacks}(中${L.hits}) · 受击 ${L.hurts} · 派生 ${L.links}(中${L.linkHits}) · 翻滚 ${L.rolls} 闪现 ${L.blinks} · 跳 ${L.jumps} · 复位 ${L.resets}`),V.push(`法杖 引导${L.channels} 飞弹${L.bolts} 电环${L.rings} · 弓蓄力${L.bowCharges} · 当前武器 ${f||"-"}`),V.push(`异常 ${L.dirJumps+L.aimDrops+L.freezes+L.stickLosts+L.stickJumps+L.stickBads+L.stickDrifts}（dir ${L.dirJumps} / aim ${L.aimDrops} / freeze ${L.freezes} / stick ${L.stickLosts} / stickJump ${L.stickJumps} / 坏指针 ${L.stickBads} / 坐标漂移 ${L.stickDrifts}） · 掉帧尖峰 ${L.spikes}`+(L.inTurns>0?` · 输入转向 ${L.inTurns} 次（最大 ${L.inTurnMax.toFixed(0)}°）`:"")),s.length>0)for(const vt of s.slice(-6)){V.push(`· ${vt.kind} @t${vt.t.toFixed(2)} tick${vt.tick} ${vt.ms>0?`${vt.ms}ms `:""}${vt.detail}`);const It=vt.ctx.map(it=>String(it[Xx])).join(" "),K=vt.ctx.map(it=>it[_c]===""||it[_c]==null?".":String(it[_c])).join(" ");if(V.push(`  yaw ${It}`),V.push(`  in  ${K}`),vt.kind==="stickJump"||vt.kind==="stickBad"||vt.kind==="stickLost"){const it=vt.ctx.map(Z=>`${Z[Vx]},${Z[Wx]}`).join(" "),ct=vt.ctx.map(Z=>`${Z[Yx]},${Z[$x]}`).join(" ");V.push(`  o   ${it}`),V.push(`  p   ${ct}`)}}if(a.length>0){V.push("最近事件：");for(const vt of a.slice(-12))V.push(`  ${vt.t.toFixed(2)} ${vt.k} ${vt.d}`.trimEnd())}const ot=o.screenFrames>0?`屏幕 screenX/Y（${o.screenFrames} 帧）`:"client（该浏览器未提供可用屏幕坐标）",gt=o.screenFrames>0&&o.clientFrames>0?` / client 回退 ${o.clientFrames} 帧`:"";return V.push(`摇杆坐标源 ${ot}${gt}`),V.push(`UA ${e.ua}`),V.join(`
`)}return{sample(L,D,O,B=0){o.frames++,D.stickHeld&&(D.stickScreenOk?o.screenFrames++:o.clientFrames++),o.steps+=B,o.wallMs+=O,O>o.dtMax&&(o.dtMax=O),o.fps=o.wallMs>0?o.frames*1e3/o.wallMs:0,o.simS=L.time;const V=L.time;if(l<0&&(l=V),E=V,M=L.tick,!r)return;const ot=L.character,gt=Math.hypot(D.stickX,D.stickY),vt=Math.hypot(ot.velocity.x,ot.velocity.z);f=L.combat.weapon;const It=Zx(L,D),K=ot.facing,ct=Math.hypot(D.intents.moveX,D.intents.moveZ)>.05?Math.atan2(D.intents.moveX,D.intents.moveZ):null;gt>.2&&(o.stickActiveMs+=O);const Z=[In(V),L.tick,Math.round(O*10)/10,In(D.stickX),In(D.stickY),In(D.stickRawX),In(D.stickRawY),D.stickHeld?1:0,D.source.slice(0,8),In(D.intents.moveX),In(D.intents.moveZ),In(ot.position.x),In(ot.position.z),In(ot.velocity.x),In(ot.velocity.z),ni(K),ni(ot.bodyYaw),It,In(ot.stride),ct===null?"":ni(ct),D.stickId===null?"":D.stickId,Math.round(D.stickOriginX),Math.round(D.stickOriginY),Math.round(D.stickPxX),Math.round(D.stickPxY),D.stickBad,Math.round(D.stickVpTop),Math.round(D.stickOriginSX),Math.round(D.stickOriginSY),Math.round(D.stickScreenX),Math.round(D.stickScreenY),D.stickScreenOk?1:0,Math.round(D.stickScale*100)/100];b(Z);const J=V*1e3<x;if(O>t.spikeMs&&!J&&V-l>.6&&(o.spikes++,R("frameSpike",V,L.tick,O,`dt ${O.toFixed(0)}ms fl=${Ga(It)}`,Z)),d!==null&&!J){const xt=Math.abs(ni(Us(K-d))),Rt=Math.abs(ni(Us(ot.moveYaw-u))),F=(h|It)&(Rr|Pr|Cr|Lr)|It&Qs,A=ct===null?null:Math.abs(ni(Us(K-ct))),G=ct===null||d===null?null:Math.abs(ni(Us(d-ct))),pt=A!==null&&G!==null&&A<G-.5,Q=(h&Qs)!==0&&(It&Qs)===0&&ct===null,rt=A!==null&&(A<=12||pt);xt>t.aimDropDeg&&Q?R("aimDrop",V,L.tick,0,`${xt.toFixed(0)}° @aim→none stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Ga(It)}`,Z):xt>t.dirJumpDeg&&F===0&&!Q&&(rt?(o.inTurns++,xt>o.inTurnMax&&(o.inTurnMax=xt)):R("dirJump",V,L.tick,0,`${xt.toFixed(0)}° res${A===null?" 无输入":`${A.toFixed(0)}°`} yaw ${ni(d)}→${ni(K)} in ${ct===null?".":ni(ct)}° mvΔ${Rt.toFixed(0)}° aim(${D.aimDX.toFixed(0)},${D.aimDY.toFixed(0)}) fl=${Ga(h)}→${Ga(It)}`,Z))}const lt=(It&(Rr|Pr|Cr|Lr))!==0,Ht=L.tick-v<30;gt>.35&&vt<t.freezeSpeed&&!lt&&!Ht?(m<0&&(m=V),V-m>=t.freezeMs/1e3&&V>=_&&(R("moveFreeze",V,L.tick,(V-m)*1e3,`stick(${D.stickX.toFixed(2)},${D.stickY.toFixed(2)}) v${vt.toFixed(2)} ${D.source} fl=${Ga(It)}`,Z),_=V+1.5,m=-1)):m=-1,D.stickHeld?(gt>p&&(p=gt),p>.35&&gt<.06?(g<0&&(g=V),V-g>=t.stickLostMs/1e3&&(R("stickLost",V,L.tick,(V-g)*1e3,`raw(${D.stickRawX.toFixed(2)},${D.stickRawY.toFixed(2)}) peak ${p.toFixed(2)} fl=${Ga(It)}`,Z),g=-1,p=0)):g=-1):(p=0,g=-1);const qt=D.stickScale>.2&&D.stickScale<5?D.stickScale:1,Ct=D.stickScreenOk,q=Ct?D.stickScreenX/qt:D.stickPxX,U=Ct?D.stickScreenY/qt:D.stickPxY,Nt=Ct?D.stickOriginSX/qt:D.stickOriginX,Dt=Ct?D.stickOriginSY/qt:D.stickOriginY,St=q-Nt,_t=U-Dt;if(D.stickHeld&&D.stickId!==null){const xt=w;if(xt&&xt.held&&xt.id===D.stickId){const Rt=Math.hypot(xt.dx,xt.dy),F=Math.hypot(St,_t),A=Math.max(Rt,F),G=Math.hypot(q-xt.cx,U-xt.cy),pt=Math.abs(ni(Us(Math.atan2(_t,St)-Math.atan2(xt.dy,xt.dx)))),Q=A*pt*Math.PI/180,rt=Math.hypot(Nt-xt.ox,Dt-xt.oy);if(A>18&&pt>35&&G<Math.max(5,Q*.35)&&R("stickJump",V,L.tick,0,`Δ${pt.toFixed(0)}° 手指只动${G.toFixed(0)}px(弧长应${Q.toFixed(0)}px) o(${Math.round(xt.ox)},${Math.round(xt.oy)})→(${Math.round(Nt)},${Math.round(Dt)}) 原点位移${rt.toFixed(0)}px p(${Math.round(q)},${Math.round(U)}) raw(${Math.round(St)},${Math.round(_t)}) id${D.stickId} ${Ct?"src=屏幕":"src=client"}`,Z),Ct&&xt.screenOk){const Ft=Math.hypot(D.stickPxX-xt.x,D.stickPxY-xt.y),tt=Math.hypot((D.stickScreenX-xt.sx)/qt,(D.stickScreenY-xt.sy)/qt);S+=Ft-tt,Math.abs(S)>20&&(R("stickDrift",V,L.tick,0,`client 相对屏幕漂移 ${S>0?"+":""}${S.toFixed(0)}px（方向未受影响，已按屏幕坐标校正） client(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) screen(${Math.round(D.stickScreenX)},${Math.round(D.stickScreenY)})`,Z),S=0)}}w={id:D.stickId,ox:Nt,oy:Dt,cx:q,cy:U,x:D.stickPxX,y:D.stickPxY,sx:D.stickScreenX,sy:D.stickScreenY,dx:St,dy:_t,held:!0,screenOk:Ct}}else w=null,S=0;if(D.stickBad>T){const xt=D.stickBad-T;R("stickBad",V,L.tick,0,`拦截 ${xt} 条可疑指针事件（幻影丢弃 / 坐标平移吸收，共${D.stickBad}）o(${Math.round(D.stickOriginX)},${Math.round(D.stickOriginY)}) p(${Math.round(D.stickPxX)},${Math.round(D.stickPxY)}) id${D.stickId??"-"}`,Z)}T=D.stickBad,d=K,u=ot.moveYaw,h=It},event(L,D){const O=jx(L);C(L),r&&(L.type==="dash-ready"||L.type==="combo-reset"||L.type==="stepUp"||k(L.type,O,D,L.tick))},gesture(L){const D=`${L.button}.${L.kind}`;o.gestures[D]=(o.gestures[D]??0)+1,r&&(L.kind==="longPress"||L.kind==="doubleTap"||L.kind==="drag"||L.kind==="cancel")&&k(`g:${L.kind}`,`${L.button} ${L.heldMs.toFixed(0)}ms d${L.distance.toFixed(0)}px ${L.angleDeg.toFixed(0)}°`,E,M)},suspend(L){x=E*1e3+L,m=-1,g=-1},setEnabled(L){r=L,L||(d=null,w=null,m=-1,g=-1)},clear(){i.length=0,a.length=0,s.length=0,y={},c=-1e9,d=null,h=0,m=-1,g=-1,p=0,o.frames=0,o.wallMs=0,o.dtMax=0,o.spikes=0,o.stickActiveMs=0,o.attacks=0,o.hits=0,o.hurts=0,o.links=0,o.linkHits=0,o.rolls=0,o.blinks=0,o.channels=0,o.bolts=0,o.rings=0,o.bowCharges=0,o.jumps=0,o.resets=0,o.dirJumps=0,o.aimDrops=0,o.inTurns=0,o.inTurnMax=0,o.freezes=0,o.stickLosts=0,o.stickJumps=0,o.stickBads=0,o.stickDrifts=0,o.screenFrames=0,o.clientFrames=0,S=0,w=null,T=0;for(const L of Object.keys(o.gestures))delete o.gestures[L]},status(){const L=o.simS,D=s.some(O=>L-O.t<8&&(O.kind==="dirJump"||O.kind==="aimDrop"||O.kind==="moveFreeze"||O.kind==="stickLost"||O.kind==="stickJump"||O.kind==="stickBad"||O.kind==="stickDrift"));return{durationS:o.wallMs/1e3,frames:o.frames,events:a.length,anomalies:s.length,alert:D,enabled:r}},dump(){return{schema:"harness-telemetry/1",meta:e,stats:{...o,gestures:{...o.gestures}},columns:Hx,samples:i.slice(),events:a.slice(),anomalies:s.slice()}},summary:I}}const Kx="dash",Jx=6,Qx="冲刺标尺",tv="沿刻度跑：翻滚 3.2m / 闪现 5m，看落点差多少",ev="square",nv=5.2,iv="#bfe8ff",av="v9s.15 历史固定工位",sv={x:9.8,z:8.2},ov={dx:0,dz:4.6},rv={dx:-2.8,dz:-4},cv={id:Kx,index:Jx,name:Qx,hint:tv,shape:ev,radius:nv,color:iv,owner:av,anchor:sv,spawn:ov,label:rv},lv="gait",hv=7,dv="侧后方步态",uv="面向假人贴到 1.2m，沿引线按 90 / 135 / 180 走",fv="circle",pv=3.2,mv="#6fc9a0",gv="v9s.15 历史固定工位",xv={x:-9.5,z:0},vv={dx:0,dz:2.6},yv={dx:0,dz:-2.5},_v={id:lv,index:hv,name:dv,hint:uv,shape:fv,radius:pv,color:mv,owner:gv,anchor:xv,spawn:vv,label:yv},Mv="hub",bv=1,Sv="中央 8 向",wv="推杆走 8 个方向 · 松手看停步收相 / 转身踏步",Ev="circle",Tv=3.6,Av="#8fe7ff",Rv="v9s.15 历史固定工位",Pv={x:0,z:0},Cv={dx:0,dz:0},Lv={dx:0,dz:-3.1},Dv={minCellX:-4,maxCellX:4,minCellZ:0,maxCellZ:6,density:1,clearMarginCells:2,absolute:!0},kv={id:Mv,index:bv,name:Sv,hint:wv,shape:Ev,radius:Tv,color:Av,owner:Rv,anchor:Pv,spawn:Cv,label:Lv,grass:Dv},Iv="meter",zv=5,Fv="进度弧",Uv="弓长按 = 黄弧 · 法杖技2 = 紫弧 · 冲刺后 = 青弧冷却",Nv="circle",Ov=3.2,Bv="#b48cff",Hv="v9s.15 历史固定工位",Gv={x:-9.5,z:8.6},Xv={dx:0,dz:2.8},Vv={dx:0,dz:1.3},Wv={id:Iv,index:zv,name:Fv,hint:Uv,shape:Nv,radius:Ov,color:Bv,owner:Hv,anchor:Gv,spawn:Xv,label:Vv},Yv="rings",$v=2,Zv="环状态色阶",jv="同距三假人：中立蓝 / 戒备黄 / 敌对红 · 点选看 3/4 环",qv="circle",Kv=3.4,Jv="#ffc85a",Qv="v9s.15 历史固定工位",ty={x:-9.5,z:-8.2},ey={dx:0,dz:3},ny={dx:0,dz:-2.7},iy={id:Yv,index:$v,name:Zv,hint:jv,shape:qv,radius:Kv,color:Jv,owner:Qv,anchor:ty,spawn:ey,label:ny},ay="sparring-demo",sy="陪练试验场",oy="动态拼合示范地块 · 点「生成 4 人」就地摆出假人 + 持械陪练，用完点「清除」回基线",ry=2,cy="#7fd8c0",ly="v9s.43 动态拼合示范（auto 地块，不写世界坐标，由 assemblePlots 自动分配槽位）",hy={label:"生成 4 人",dummies:2,modes:["idle","keep-distance"],fighters:2,ringRadius:1.5,startDeg:-90},dy={id:ay,name:sy,hint:oy,radius:ry,color:cy,owner:ly,testSpawn:hy},uy="terrain",fy=4,py="地形 / 门洞",my="宽门 2.4m / 窄门 0.5m · 0.2m 台阶可走，0.6/0.9/1.2m 要跳",gy="square",xy=5.2,vy="#7fb8d8",yy="v9s.15 历史固定工位",_y={x:8.9,z:-7.4},My={dx:0,dz:4.6},by={dx:0,dz:-4.5},Sy={id:uy,index:fy,name:py,hint:my,shape:gy,radius:xy,color:vy,owner:yy,anchor:_y,spawn:My,label:by},wy="windup",Ey=3,Ty="起手预警",Ay="走进 1.6m：脚下红弧填满 = 命中帧",Ry="circle",Py=3.2,Cy="#ff5a4a",Ly="v9s.15 历史固定工位",Dy={x:0,z:-10},ky={dx:0,dz:3},Iy={dx:0,dz:-2.6},zy={id:wy,index:Ey,name:Ty,hint:Ay,shape:Ry,radius:Py,color:Cy,owner:Ly,anchor:Dy,spawn:ky,label:Iy},Fy={fixedDt:.0166666667,maxStepsPerFrame:5,moveSpeed:4.2,sprintMultiplier:1.75,acceleration:16,friction:14,skillDecel:14,gravity:24,jumpSpeed:8,stepHeight:.45,characterRadius:.3,characterHeight:1.2,coyoteTime:.1,jumpBufferTime:.12,strideLength:1,strideSpeedGain:.45,strideSpeedCap:1.8,fallTolerance:.6,spawn:{x:0,y:0,z:0},worldBounds:{minX:-15.5,maxX:15.5,minZ:-15.5,maxZ:15.5},orientation:{bodyTurnRate:7,headTurnRate:12,maxHeadTurnDeg:55,facingSmoothRate:14,facingDeadZone:.12,facingDeadbandDeg:22,facingMinMagnitude:.18,facingTurnRate:1800,facingSnapDeg:30},turnInPlace:{enabled:!0,triggerDeg:50,settleDeg:8,durationSec:.45,idleSpeedRatio:.05,inputDeadZone:.12,lookRange:0,armSec:.03,gazeTriggerDeg:120},combat:{comboWindow:.65,settle:.16,attackMoveScale:.3,lungeMoveScale:.08,lungeCurve:1.2,lungeMaxSpeed:17,settleMoveScale:.32,cancelWindow:.45,minLungeScale:.4,autoCombo:!0,weapons:{"sword-shield":{moveMultiplier:1,windup:.09,active:.13,recovery:.24,lunge:[.45,.6,.95],comboCount:3,hitWindow:{start:0,end:.85},comboWindow:.62,notifies:[{at:"windup",u:.7,name:"blade-air",value:.5},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.35,name:"foot-step",value:.6}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,148],[.2,125],[.4,68],[.6,-16],[.8,-78]]},2:{pts:[[0,-77],[.2,-68],[.4,-4],[.6,67],[.8,120]]},3:{stabU:.42}}}},"dual-swords":{moveMultiplier:1.08,windup:.07,active:.1,recovery:.18,lunge:[.4,.55,.85],comboCount:3,hitWindow:{start:0,end:.9},comboWindow:.5,notifies:[{at:"windup",u:.5,name:"blade-air",value:.45},{at:"active",u:0,name:"blade-air",value:1},{at:"active",u:.6,name:"blade-air",value:.7},{at:"recovery",u:.3,name:"foot-step",value:.5}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,151],[.2,137],[.4,62],[.6,-46],[.8,-128]]},2:{pts:[[0,-3],[.2,7],[.4,57],[.6,105],[.8,135]]},3:{pts:[[0,-150],[.2,-100],[.4,-40],[.6,1],[.8,36]]}}}},greatsword:{moveMultiplier:.85,windup:.16,active:.18,recovery:.36,lunge:[.7,.9,1.4],comboCount:3,hitWindow:{start:0,end:.8},comboWindow:.78,notifies:[{at:"windup",u:.85,name:"blade-air",value:.8},{at:"active",u:0,name:"blade-air",value:1},{at:"recovery",u:.45,name:"foot-step",value:1}],hitSweep:{tolDeg:12,byCombo:{1:{pts:[[0,152],[.2,114],[.4,15],[.6,-65],[.8,-120]]},2:{pts:[[0,-124],[.2,-81],[.4,22],[.6,92],[.8,141]]},3:{pts:[[0,90],[.2,39],[.4,8],[.6,4],[.8,7]]}}},groundSlam:{slamU:.6,radius:2.4,knockback:.9,type:"knock",onlyUnhit:!0,holdMul:1.7}},staff:{moveMultiplier:.95,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0},bow:{moveMultiplier:1,windup:0,active:0,recovery:0,lunge:[0,0,0],comboCount:0}},bow:{maxChargeTime:.85,minChargeToFire:.15,chargeMoveMultiplier:.55,autoFire:!0,release:{windup:.04,active:.12,recovery:.26,lunge:0},trajectory:{speedMin:9,speedMax:16,launchPitchDeg:3.5,gravity:9,maxLife:2.4,radius:.2,stickMinPitchDeg:50,groundStickLift:.32,stickSec:4,homingRange:14,homingConeDeg:30,turnRateDeg:90,homingTime:.9,aimHeightRatio:.7,verticalTurnRate:18}}},abilities:{arcane:{perWave:3,waves:5,waveInterval:.2,spreadDeg:8,spreadTime:.22,spawnDelay:.035,spawnSideStep:.2,speedJitter:.12,homingRange:8,homingConeDeg:40,turnRateDeg:300,homingTime:1.1,retargetInterval:.25,cooldown:1,speed:10,life:1.4,radius:.3,hurtType:"light",hurtDuration:.2,knockback:.12,moveScale:.6},ring:{radius:2.4,duration:1.2,pulseInterval:.34,stun:.45,knockback:.35}},skills:[{id:"arcane",kind:"channelVolley",slot:"attack",weapon:"staff",paramsRef:"arcane",enabled:!0},{id:"ring",kind:"groundRing",slot:"skill2",weapon:"staff",paramsRef:"ring",enabled:!0}],targeting:{range:7,maxAngleDeg:90,frontBias:1.2,idealRange:1.35,maxLungeScale:1.6,targetAssist:!0},hits:{arcDeg:65,reach:{"sword-shield":1.6,"dual-swords":1.5,greatsword:2,staff:2.6,bow:9},hurtLight:.2,hurtHeavy:.32,hurtKnock:.42,knockback:{"sword-shield":0,"dual-swords":0,greatsword:.75,staff:.2,bow:0},knockbackDecay:9,dummyReach:1.8,noDamageToPlayer:!1,dummyKnockback:.18,hitstop:{light:.045,heavy:.07,knock:.1},hitstopByWeapon:{"sword-shield":1,"dual-swords":.85,greatsword:1.3,staff:1.1,bow:.9},hitstopWarp:{enabled:!0,holdRate:.05,release:.055,payback:1.5,paybackBudget:.6},hitstopComboFalloff:[1,.85,.72]},separation:{iterations:3,slop:.002,crowd:{contactBand:.45,minScale:.32,approachDot:.25}},links:{enabled:!0,windows:{roll:.3,blink:.55,sprint:.5},sharedCooldown:.85,triggerWhileSprinting:!0,search:{range:6.5,maxAngleDeg:85,stopDistance:1.25},noTargetFallback:!0,moves:{"sword-shield":{enabled:!0,kind:"shield-charge",distance:3.4,windup:.08,active:.22,recovery:.26,hit:{shape:"capsule",radius:1.25,arcDeg:75,width:.85,type:"heavy",duration:.34,knockback:.7,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"thrust",distance:4.2,windup:.07,active:.2,recovery:.24,hit:{shape:"capsule",radius:.9,arcDeg:40,width:.55,type:"heavy",duration:.28,knockback:.35,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"whirlwind",distance:1.4,windup:.12,active:.5,recovery:.34,hit:{shape:"circle",radius:2.4,arcDeg:180,width:.9,type:"knock",duration:.4,knockback:.6,pulseInterval:.16,liftHeight:0,freeze:0}},staff:{enabled:!1,kind:"frost-ring",distance:0,windup:.1,active:.18,recovery:.3,hit:{shape:"circle",radius:2.6,arcDeg:180,width:.9,type:"heavy",duration:.3,knockback:.12,pulseInterval:.2,liftHeight:0,freeze:1.2}}},landing:{enabled:!1,maxAirTime:1.2,moves:{"sword-shield":{enabled:!1,kind:"shield-slam",distance:0,windup:.06,active:.16,recovery:.24,hit:{shape:"cone",radius:2,arcDeg:100,width:.8,type:"heavy",duration:.3,knockback:.3,pulseInterval:0,liftHeight:0,freeze:0}},"dual-swords":{enabled:!1,kind:"cross-slam",distance:0,windup:.06,active:.18,recovery:.24,hit:{shape:"cone",radius:1.8,arcDeg:85,width:.7,type:"heavy",duration:.26,knockback:.2,pulseInterval:0,liftHeight:0,freeze:0}},greatsword:{enabled:!1,kind:"shockwave",distance:0,windup:.08,active:.2,recovery:.3,hit:{shape:"cone",radius:3,arcDeg:140,width:1,type:"knock",duration:.42,knockback:.25,pulseInterval:0,liftHeight:.9,freeze:0}}}}},dash:{rollDistance:3.2,rollDuration:.36,rollCooldown:.7,blinkDistance:5,blinkStep:.22,blinkCooldown:1.1,blinkClearVelocity:!0},camera:{radius:9,nearDistance:1.5,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,saturation:2.6,pushIn:.12,maxPullback:.38,maxOffset:2.6,maxPitchDelta:7,framingBias:.55},gaze:{enabled:!0,headLookLimitDeg:55,headGazeRange:7,threatRange:8,recoveryDist:3.5,maxThreats:3,bodyTurnRate:3.2,headTurnRate:8,maxHeadSpeedDeg:300,maxBodySpeedDeg:130,headReturnRate:3.5,headReturnSpeedDeg:120,aimHeightRatio:.75,eyeHeightRatio:.78,headPitchRate:7,maxHeadPitchDeg:28,bodyPitchScale:.3,bodyPitchRate:4,enterThreshold:.05,reactToAttack:!0,reactToApproach:!0,approachDist:2.5,hurtHoldSec:2,hostileModeWeight:.6,spreadFalloff:1.5,behindFalloff:.35,behindAngleDeg:100,modeWeight:{idle:.2,wander:.45,follow:.8,"keep-distance":.7,attack:1.5,spar:1.2},attackBoost:.6,nearDistance:1.5,saturation:2.6},dummies:{count:6,spawn:[{x:-11.1,z:-8.35},{x:-9.5,z:-8.35},{x:-7.9,z:-8.35},{x:0,z:-10.2},{x:-9.5,z:0},{x:-9.5,z:7.2}],initialModes:["idle","keep-distance","attack","attack","follow","idle"],leashRadius:2.4,radius:.3,height:1.2,moveSpeed:2.6,acceleration:10,wanderRadius:3,wanderInterval:2.2,followStopDistance:1.2,keepDistance:4,keepDeadZone:.6,keepStrafe:.35,strafePeriod:5.2,strafeDuty:.34,attackRange:1.6,attackInterval:1.6,attackWindup:.34,attackActive:.18,attackRecovery:.4,fighters:{weapons:["sword-shield","dual-swords","greatsword"],spawn:[{x:-3.6,z:3.8},{x:3.9,z:3.6},{x:.2,z:5.9}],initialModes:["spar","spar","spar"],moveSpeed:2.1,attackInterval:3.4,attackRangeScale:.9,knockbackScale:.6,leashRadius:7,comboCount:0,comboGap:0}},grass:{enabled:!0,footprintCells:2,minHeightCells:1,maxHeightCells:2,bendRadius:.85,maxBendRad:.95,bendRate:18,recoverRate:3.2,stumpRatio:.34,regrow:!0,regrowSec:6,bucketCells:4,wind:{enabled:!0,dirDeg:28,speed:1.35,amplitude:.19,wavelength:4.2,secondWave:{wavelength:1.7,amplitude:.055,speedScale:1.55},gust:{periodSec:7.5,depth:.35},jitter:.16,shadeAmount:.26}}},Uy={ground:{size:32,thickness:.4},steps:[{id:"stair-1",x:6.6,z:-5.6,width:2.4,depth:.9,height:.2},{id:"stair-2",x:6.6,z:-6.5,width:2.4,depth:.9,height:.4},{id:"stair-3",x:6.6,z:-7.4,width:2.4,depth:.9,height:.6},{id:"stair-4",x:6.6,z:-8.3,width:2.4,depth:.9,height:.8},{id:"plateau",x:6.6,z:-9.6,width:2.4,depth:1.6,height:.8},{id:"block-060",x:11.4,z:-6,width:1.4,depth:1.4,height:.6},{id:"block-090",x:11.4,z:-7.9,width:1.4,depth:1.4,height:.9},{id:"block-120",x:11.4,z:-9.8,width:1.4,depth:1.4,height:1.2}],doorways:[{id:"gate-wide",x:6.6,z:-4.3,openingWidth:2.4,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2},{id:"gate-narrow",x:11.4,z:-4.3,openingWidth:.5,openingHeight:1.85,wallThickness:.5,wallSpan:1.1,wallHeight:2}],obstacles:[{id:"crate-hub",x:2.5,z:-2.5,width:1.1,depth:1.1,height:.8},{id:"pillar-sw",x:-14.3,z:12.8,width:1.2,depth:1.2,height:2.2}],grid:{cellSize:.5,minX:-16,maxX:16,minZ:-16,maxZ:16},grass:{minCellX:-12,maxCellX:12,minCellZ:4,maxCellZ:24,density:.72,bladesPerPatch:[3,6],avoidMargin:.45,seed:20261108}},Ny={camera:{pitchDeg:50,yawDeg:0,distance:17,smoothing:6.5,fov:45},smartCamera:{smoothing:3.2},zoom:{min:.45,max:2.4,smoothing:12,pinchGain:1,maxStepRatio:1.25,wheelStep:1.12,keyStep:1.12},links:{chargeColor:"#7fd4ff",ringRadius:1.25,fxDuration:.42,leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},joystick:{maxRadiusPx:28,deadZone:.08},showGrid:!0,showColliders:!1,voxel:{headSize:.4,bodyWidth:.46,bodyHeight:.4,limbThickness:.14,legLength:.4,armLength:.42},bodyTypes:{standard:{name:"标准",height:1.2,radius:.3},tall:{name:"瘦高",height:1.32,radius:.26,voxel:{headSize:.36,bodyWidth:.34,bodyHeight:.28,limbThickness:.1,legLength:.68,armLength:.5},colors:{body:"#58b39a",head:"#ffe0b2",limb:"#3f8f7c",shoe:"#24443c"}}},orientation:{legYawScale:.35,hipYawMaxDeg:90,hipYawSmoothing:12,headPivotHeight:.4},gait:{reachRatio:.25,strideGain:.8,maxAmp:1.35,sideWeight:.85,crossStep:.65,kneeLift:.75,plantLock:1,comSway:.05,comBob:.045,hipLean:.16,armSwing:.6,stopBlendSec:.56,strafeHipBoost:.6,strafeHipScale:.7,strafeHipMaxDeg:62,stopEnterRatio:.17,stopExitRatio:.39,chestYawScale:.6,chestYawMaxDeg:40,stopYawBlendMode:"inStop",stopYawAfterSec:.3,turnStepEnabled:!0,turnStepPitch:.5,turnStepKnee:.35,turnStepDip:.02,stopStepPitch:0,stopTrailPitch:0,stopStepKnee:.2,stopBodyShift:.07,stopBodyDip:.03,stopChestPitch:.01,stopPeakRatio:.48,knockGaitScale:1,backStrafeStartDeg:100,backStrafeFullDeg:132},animation:{attack:{lowerBodyWeight:0,gaitWeight:1,blendRate:14,moveTakeover:{speed:.35,full:1.2,windup:.55,recovery:1,settle:1}},stride:{cycles:1,strideSpeed:2.4,strideScale:1.3,forwardBias:.72,stepPitch:.55,stepKnee:.5,stepSide:.3,stepDip:.07,stepSway:.05,stepReach:.12,stepSideReach:.09,stepDipReach:.035,heavyScale:.7},landing:{enabled:!0,duration:.34,compressRatio:.18,crouchDepth:.13,kneeBend:.62,hipPitch:.3,upperPitch:.16,armTuck:.22,lowerScale:.45,impactSpeed:9,minScale:.45,jumpAnticipation:.32,anticipationDuration:.13},stretch:{enabled:!0,swingArm:1.45,chargeArm:.88,runLeg:1,torsoGain:.5,impactSquash:.2,impactDecay:11,volumeExp:.5,smoothing:30},swing:{enabled:!0,bodyScale:1,shoulderLift:.055,shoulderPush:.045,shoulderIn:.032,segBlend:.1,segBlendMin:.03,segBlendRef:6,segBlendMax:.14,weaponScale:{greatsword:1,"sword-shield":.78,"dual-swords":.9},combo:{greatsword:["gs.right-left","gs.left-right","gs.overhead"],"sword-shield":["gs.right-left","gs.left-right","ss.shield-bash"],"dual-swords":["ds.right-left","ds.left-right","ds.spin"]},clips:{"gs.right-left":{kind:"right-left",note:"段 1：从右后方扫到左后方。rootYaw 整体带转 ±0.55 rad（≈31°）叠在腰椎 ±60° 上，大剑刃尖水平扫角约 210°",keys:[{t:0,ease:"in",pose:{bodyYaw:1.05,bodyPitch:-.14,bodyRoll:-.18,pelvisX:.06,pelvisZ:-.07,armPitch:-1.15,armYaw:.4,armRoll:.2,elbow:-.5,rootYaw:.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.08,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:0,armRoll:.04,elbow:-.3,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.15,bodyPitch:.16,bodyRoll:.2,pelvisX:-.07,pelvisZ:.11,armPitch:-1.5,armYaw:-.4,armRoll:-.14,elbow:-.12,rootYaw:-.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:-1.55}}]},"gs.left-right":{kind:"left-right",note:"段 2：承接段 1 左后方收势，整体带转 −0.55→+0.55 rad 反向拧回右后方，剑身仍水平",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-.4,armRoll:-.16,elbow:-.5,rootYaw:-.75,bladePitch:.3,bladePitchOff:.25,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:0,armRoll:.02,elbow:-.32,rootYaw:0,bladePitch:.12,bladePitchOff:.1,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:.4,armRoll:.16,elbow:-.12,rootYaw:.75,bladePitch:-.05,bladePitchOff:-.05,bladeTwist:1.55}}]},"gs.overhead":{kind:"overhead",note:"段 3：举过头顶（剑身 75° 朝上）向前下劈到 −31°，躯干后仰 → 前压",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.32,bodyRoll:-.05,pelvisX:0,pelvisZ:-.07,armPitch:-1.9,armYaw:-.3,armRoll:.16,elbow:-.55,bladePitch:1.62,bladeTwist:0}},{t:.55,pose:{bodyYaw:.06,bodyPitch:.1,bodyRoll:0,pelvisX:0,pelvisZ:.03,armPitch:-1.1,armYaw:-.26,armRoll:.08,elbow:-.3,bladePitch:.55,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.55,bodyRoll:.02,pelvisX:0,pelvisZ:.13,armPitch:-.15,armYaw:-.2,armRoll:0,elbow:-.1,bladePitch:-.75,bladeTwist:0}}]},"ds.right-left":{kind:"right-left",note:"双持段 1：右手横扫到左后方，左手同时向左后方收（后摆 + 屈肘），两把剑都保持水平",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:1,bodyPitch:-.12,bodyRoll:-.16,pelvisX:.05,pelvisZ:-.06,armPitch:-1.15,armYaw:.9,armRoll:.18,elbow:-.45,armLPitch:.5,armLYaw:-1,armLRoll:.12,elbowL:-1.15,rootYaw:.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:-1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:.06,pelvisX:.01,pelvisZ:-.01,armPitch:-1.4,armYaw:-.1,armRoll:.04,elbow:-.3,armLPitch:.6,armLYaw:-1,armLRoll:.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:-1.55}},{t:1,pose:{bodyYaw:-1.1,bodyPitch:.14,bodyRoll:.18,pelvisX:-.06,pelvisZ:.1,armPitch:-1.5,armYaw:-1.4,armRoll:-.12,elbow:-.12,armLPitch:.65,armLYaw:-.9,armLRoll:.18,elbowL:-1.3,rootYaw:-.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.55}}]},"ds.left-right":{kind:"left-right",note:"双持段 2：左手横扫回右后方，右手同时向右后方收（段 1 的镜像，主挥换到左手）",lead:"L",keys:[{t:0,ease:"in",pose:{bodyYaw:-1,bodyPitch:-.1,bodyRoll:.18,pelvisX:-.05,pelvisZ:-.05,armPitch:-1.2,armYaw:-1.4,armRoll:-.16,elbow:-.5,armLPitch:.5,armLYaw:1,armLRoll:-.12,elbowL:-1.15,rootYaw:-.5,bladePitch:.1,bladePitchOff:.05,bladeTwist:1.55}},{t:.55,pose:{bodyYaw:.05,bodyPitch:.02,bodyRoll:-.04,pelvisX:.01,pelvisZ:.01,armPitch:-1.42,armYaw:-.1,armRoll:.02,elbow:-.32,armLPitch:.6,armLYaw:.9,armLRoll:-.15,elbowL:-1.25,rootYaw:0,bladePitch:.06,bladePitchOff:.05,bladeTwist:1.55}},{t:1,pose:{bodyYaw:1.1,bodyPitch:.16,bodyRoll:-.2,pelvisX:.07,pelvisZ:.11,armPitch:-1.52,armYaw:1.4,armRoll:.16,elbow:-.12,armLPitch:.65,armLYaw:.8,armLRoll:-.18,elbowL:-1.3,rootYaw:.5,bladePitch:.02,bladePitchOff:.02,bladeTwist:1.55}}]},"ds.spin":{kind:"spin",note:"双持段 3：双剑水平展开（主副手 roll 外张到 ±1.15），整个人原地转一整圈。spin 按 attackProgress 单调推进到 2π≡0，收招自动回正",lead:"R",spin:{turns:1,ease:"inOut",span:.6},keys:[{t:0,ease:"in",pose:{bodyYaw:.1,bodyPitch:-.14,bodyRoll:0,pelvisX:0,pelvisZ:-.05,armPitch:-1.1,armYaw:1.7,armRoll:.3,elbow:-.5,armLPitch:-1.1,armLYaw:0,armLRoll:-.3,elbowL:-.5,bladePitch:.05,bladePitchOff:.05,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:.5,pose:{bodyYaw:0,bodyPitch:.04,bodyRoll:0,pelvisX:0,pelvisZ:.04,armPitch:-1.55,armYaw:2.1,armRoll:.45,elbow:-.05,armLPitch:-1.55,armLYaw:.3,armLRoll:-.45,elbowL:-.05,bladePitch:0,bladePitchOff:0,bladeTwist:-1.35,bladeTwistOff:1.35}},{t:1,pose:{bodyYaw:-.1,bodyPitch:.12,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:-1.3,armYaw:1.9,armRoll:.4,elbow:-.25,armLPitch:-1.3,armLYaw:-.05,armLRoll:-.4,elbowL:-.25,bladePitch:.02,bladePitchOff:.02,bladeTwist:-1.35,bladeTwistOff:1.35}}]},"ss.shield-bash":{kind:"bash",note:"剑盾段 3：收盾蓄力 → 左臂持盾猛前顶（臂前伸 + 肘伸直 + 身体前压 + 骨盆前冲）。bladePitchOff 反解让盾面始终正对前方",lead:"R",keys:[{t:0,ease:"in",pose:{bodyYaw:.12,bodyPitch:-.28,bodyRoll:-.04,pelvisX:.01,pelvisZ:-.08,armPitch:.1,armYaw:-.2,armRoll:.1,elbow:-.7,armLPitch:-.7,armLYaw:.1,armLRoll:.15,elbowL:-.9,bladePitch:.2,bladePitchOff:.1,bladeTwist:0}},{t:.55,pose:{bodyYaw:.04,bodyPitch:.15,bodyRoll:0,pelvisX:0,pelvisZ:.08,armPitch:.2,armYaw:-.15,armRoll:.05,elbow:-.6,armLPitch:-1.1,armLYaw:.05,armLRoll:.1,elbowL:-.45,bladePitch:.1,bladePitchOff:.02,bladeTwist:0}},{t:1,pose:{bodyYaw:0,bodyPitch:.5,bodyRoll:.02,pelvisX:0,pelvisZ:.18,armPitch:.25,armYaw:-.1,armRoll:0,elbow:-.5,armLPitch:-1.55,armLYaw:0,armLRoll:.05,elbowL:-.05,bladePitch:.05,bladePitchOff:0,bladeTwist:0}}]}},poseIn:.1,poseOut:.16},stance:{"sword-shield":{armSwing:.85,armR:{pitch:-.12,roll:.1,elbow:-.15},armL:{pitch:-.45,roll:.1,elbow:-.75},torsoYaw:.12,bladePitchDeg:-8,blend:.22},"dual-swords":{armSwing:1,armR:{pitch:-.15,roll:.16,elbow:-.45},armL:{pitch:-.15,roll:-.16,elbow:-.45},torsoYaw:0,bladePitchDeg:-12,bladePitchOffDeg:-8,blend:.22},greatsword:{armSwing:.45,armR:{pitch:-.3,roll:.05,elbow:-.55},armL:{pitch:-.2,roll:-.1,elbow:-.65},torsoPitch:.04,bladePitchDeg:-30,blend:.26},staff:{armSwing:.6,armR:{pitch:-.1,roll:.06,elbow:-.35},armL:{pitch:.02,roll:-.08,elbow:-.15},torsoYaw:.06,blend:.22},bow:{armSwing:.55,armL:{pitch:-.15,roll:-.1,elbow:-.2},armR:{pitch:.02,elbow:-.25},torsoYaw:-.08,blend:.22}},spine:{enabled:!0,waist:.58,chest:.42,neck:.16,chestPivot:.42}},weaponMount:{swordPitchDeg:68,swordYawDeg:16,greatswordPitchDeg:58,greatswordYawDeg:10,staffPitchDeg:16,shieldPitchDeg:8,bowPitchDeg:6,twoHandInsetX:.15,twoHandGripY:-.1,twoHandMaxStretch:1.3,twoHandMinGrip:.62,twoHandGripStart:1.02,twoHandSlideRate:9,swordCantDeg:10,greatswordCantDeg:0},weaponWrist:{enabled:!0,lag:.042,maxAngle:.72,rate:24,twistLag:.03,maxTwist:.5,runDrag:.11},lean:{accelGain:.02,turnGain:.05,maxForwardDeg:13,maxSideDeg:11,smoothing:8,pelvisTiltGain:.35,pelvisShift:.018,moveCrouch:.035,crouchSmoothing:8},ik:{enabled:!0,weight:.9,attackScale:.65,maxCorrectionDeg:70},dash:{rollColor:"#bfe8ff",blinkColor:"#a98bff",fxDuration:.42,ringRadius:.55},hurt:{flashColor:"#ff6a52",flashStrength:.9,leanLight:.28,leanHeavy:.5,leanKnock:.82,enabled:!0,hitHeight:{light:.2,heavy:.6,knock:.9},forceHitHeight:-1,pulseRatio:.16,comShift:.06,lowerScale:.45,upperShiftScale:.45,maxUpperShift:.1,abdomen:{upperPitch:.85,upperRoll:.5,upperYaw:.12,fold:.42,shift:.26,drop:.14,back:.16,knee:.9,hip:.42,arm:.5},shoulder:{upperPitch:1,upperRoll:1,upperYaw:.55,fold:0,shift:.34,drop:.07,back:.09,knee:.42,hip:.2,arm:-.35}},groundRing:{playerRadiusFactor:2.3,dummyRadiusFactor:2.05,thicknessFactor:.16,arcDeg:180,selectedArcDeg:270,opacity:.22,playerOpacity:.44,selectedOpacity:.62,selectedScale:1.06,selectedThicknessScale:1.6,edgeFade:.2,playerColor:"#8fe7ff",neutralColor:"#7fb8d8",lowThreatColor:"#ffc85a",highThreatColor:"#ff3b30",haloRadiusFactor:1.16,haloThicknessFactor:2.6,haloOpacity:.14,haloFadeInSec:.05,haloFadeOutSec:.36,meterRadiusFactor:1.34,meterThicknessFactor:.52,meterOpacity:.9,meterColorCharge:"#ffd166",meterColorChannel:"#b48cff",meterColorCooldown:"#7fb8d8",warnRadiusFactor:1.14,warnThicknessFactor:1.5,warnOpacity:.9,warnColor:"#ff5a4a",areaOpacity:.5,landingOpacity:.55,areaExpandSec:.22},projectiles:{arrowColor:"#ffe3a6",arrowHeadColor:"#fff6d8",arrowTrailColor:"#ffcf86",arrowLength:.72,arrowWidth:.062,arrowHeadSize:.16,arrowGlowSize:.5,trailLength:1.05,trailOpacity:.42,boltColor:"#a9ecff",boltGlowColor:"#7fe3ff",boltShapeX:.42,boltShapeY:.42,boltShapeZ:.85,boltGlowScale:1.6,boltTrailScale:2.2,slashEnabled:!1,slashThickness:.075,slashGlowOpacity:.34},weaponTrail:{enabled:!0,maxSamples:30,minStep:.015,life:.11,minSpeed:5.5,color:"#8fd0ff",intensity:.42,tipBoost:.35,pulseDecay:14},hitstop:{enabled:!0,duration:.07},lab:{enabled:!0,showLabels:!0,padOpacity:.55,labelTextHeight:.82},colors:{ground:"#2b3440",step:"#4a6d8c",wall:"#6b7280",lintel:"#c08442",obstacle:"#9c5a5a",body:"#4ea1de",head:"#f2c98a",limb:"#2f6fa8",shoe:"#1d2733",blade:"#d8e6f2",bladeEdge:"#ffffff",metal:"#8fa6bb",wood:"#8b5e3c",glow:"#7fe3ff"},dummies:{colors:["#e2a45c","#6fc9a0","#b58fe0","#e26d6d"],attackArcColor:"#ff6b5e",fighterColors:[{body:"#c85a4a",limb:"#8d3a30",head:"#f0c9a0"},{body:"#c9a03c",limb:"#8a6b22",head:"#f0d6a0"},{body:"#7d6ec4",limb:"#4f4488",head:"#e6d2b0"}]},balance:{enabled:!0,reactionTime:.18,gravity:9.81,autoCounter:!0,maxShift:.045,counterRate:8,predLead:.12,counterBoost:1.6},renderInterp:{enabled:!0,yawSmoothMs:35},groundSlam:{enabled:!0,color:"#e8d8b0",duration:.42,delay:.09,outerScale:1.25,shake:.95},grass:{enabled:!0,bladeWidth:.13,segmentHeight:.5,palette:["#3f7d4f","#569a5c","#6fb56a","#8ccb78","#a9dc86"],stumpColor:"#6b7a48",maxInstances:6e3,debris:{max:220,life:.85,color:"#a9dc86"}}},Oy={core:Fy,scene:Uy,view:Ny};function Th(n){return JSON.parse(JSON.stringify(n))}const Ah=Oy,By=Object.assign({"../config/plots/dash.json":cv,"../config/plots/gait.json":_v,"../config/plots/hub.json":kv,"../config/plots/meter.json":Wv,"../config/plots/rings.json":iy,"../config/plots/sparring-demo.json":dy,"../config/plots/terrain.json":Sy,"../config/plots/windup.json":zy}),Hy=Object.values(By).filter(n=>n&&typeof n.id=="string"&&n.id.length>0),Gy=Zf,$i=j0(Hy,Gy),jd=$i.plots,Xy=Th(Ah.core),uo=Th(Ah.scene),un=Th(Ah.view);uo.stations=$i.stations;uo.grass&&(uo.grass.plots=$i.grassPlots);/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class _i{constructor(t,e,i,a,s="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("name"),_i.nextNameID=_i.nextNameID||0,this.$name.id=`lil-gui-name-${++_i.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",o=>o.stopPropagation()),this.domElement.addEventListener("keyup",o=>o.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Vy extends _i{constructor(t,e,i){super(t,e,i,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function wl(n){let t,e;return(t=n.match(/(#|0x)?([a-f0-9]{6})/i))?e=t[2]:(t=n.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=n.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),e?"#"+e:!1}const Wy={isPrimitive:!0,match:n=>typeof n=="string",fromHexString:wl,toHexString:wl},fo={isPrimitive:!0,match:n=>typeof n=="number",fromHexString:n=>parseInt(n.substring(1),16),toHexString:n=>"#"+n.toString(16).padStart(6,0)},Yy={isPrimitive:!1,match:n=>Array.isArray(n),fromHexString(n,t,e=1){const i=fo.fromHexString(n);t[0]=(i>>16&255)/255*e,t[1]=(i>>8&255)/255*e,t[2]=(i&255)/255*e},toHexString([n,t,e],i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return fo.toHexString(a)}},$y={isPrimitive:!1,match:n=>Object(n)===n,fromHexString(n,t,e=1){const i=fo.fromHexString(n);t.r=(i>>16&255)/255*e,t.g=(i>>8&255)/255*e,t.b=(i&255)/255*e},toHexString({r:n,g:t,b:e},i=1){i=255/i;const a=n*i<<16^t*i<<8^e*i<<0;return fo.toHexString(a)}},Zy=[Wy,fo,Yy,$y];function jy(n){return Zy.find(t=>t.match(n))}class qy extends _i{constructor(t,e,i,a){super(t,e,i,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=jy(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=wl(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class bc extends _i{constructor(t,e,i){super(t,e,i,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Ky extends _i{constructor(t,e,i,a,s,o){super(t,e,i,"number"),this._initInput(),this.min(a),this.max(s);const r=o!==void 0;this.step(r?o:this._getImplicitStep(),r),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=e*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const e=()=>{let v=parseFloat(this.$input.value);isNaN(v)||(this._stepExplicit&&(v=this._snap(v)),this.setValue(this._clamp(v)))},i=v=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+v),this.$input.value=this.getValue())},a=v=>{v.key==="Enter"&&this.$input.blur(),v.code==="ArrowUp"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v))),v.code==="ArrowDown"&&(v.preventDefault(),i(this._step*this._arrowKeyMultiplier(v)*-1))},s=v=>{this._inputFocused&&(v.preventDefault(),i(this._step*this._normalizeMouseWheel(v)))};let o=!1,r,l,c,d,u;const h=5,f=v=>{r=v.clientX,l=c=v.clientY,o=!0,d=this.getValue(),u=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",_)},m=v=>{if(o){const x=v.clientX-r,y=v.clientY-l;Math.abs(y)>h?(v.preventDefault(),this.$input.blur(),o=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>h&&_()}if(!o){const x=v.clientY-c;u-=x*this._step*this._arrowKeyMultiplier(v),d+u>this._max?u=this._max-d:d+u<this._min&&(u=this._min-d),this._snapClampSetValue(d+u)}c=v.clientY},_=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",_)},g=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",e),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",f),this.$input.addEventListener("focus",g),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=(p,v,x,y,w)=>(p-v)/(x-v)*(w-y)+y,e=p=>{const v=this.$slider.getBoundingClientRect();let x=t(p,v.left,v.right,this._min,this._max);this._snapClampSetValue(x)},i=p=>{this._setDraggingStyle(!0),e(p.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",s)},a=p=>{e(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",s)};let o=!1,r,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),e(p.touches[0].clientX),o=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(r=p.touches[0].clientX,l=p.touches[0].clientY,o=!0):c(p),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=p=>{if(o){const v=p.touches[0].clientX-r,x=p.touches[0].clientY-l;Math.abs(v)>Math.abs(x)?c(p):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else p.preventDefault(),e(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},f=this._callOnFinishChange.bind(this),m=400;let _;const g=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const x=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(_),_=setTimeout(f,m)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",g,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle(`lil-gui-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120,i*=this._stepExplicit?1:10),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){const e=Math.round(t/this._step)*this._step;return parseFloat(e.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Jy extends _i{constructor(t,e,i,a){super(t,e,i,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(e=>{const i=document.createElement("option");i.textContent=e,this.$select.appendChild(i)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=e===-1?t:this._names[e],this}}class Qy extends _i{constructor(t,e,i){super(t,e,i,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const t_=`.lil-gui {
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
}`;function e_(n){const t=document.createElement("style");t.innerHTML=n;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(t,e):document.head.appendChild(t)}let qd=!1;class Dr{constructor({parent:t,autoPlace:e=t===void 0,container:i,width:a,title:s="Controls",closeFolders:o=!1,injectStyles:r=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!qd&&r&&(e_(t_),qd=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=o}add(t,e,i,a,s){if(Object(i)===i)return new Jy(this,t,e,i);const o=t[e];switch(typeof o){case"number":return new Ky(this,t,e,i,a,s);case"boolean":return new Vy(this,t,e);case"string":return new Qy(this,t,e);case"function":return new bc(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,o)}addColor(t,e,i=1){return new qy(this,t,e,i)}addFolder(t){const e=new Dr({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof bc||i._name in t.controllers&&i.load(t.controllers[i._name])}),e&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const e={controllers:{},folders:{}};return this.controllers.forEach(i=>{if(!(i instanceof bc)){if(i._name in e.controllers)throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);e.controllers[i._name]=i.save()}}),t&&this.folders.forEach(i=>{if(i._title in e.folders)throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);e.folders[i._title]=i.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("transition");const i=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);const a=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(i=>i.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}function n_(n,t,e,i){const a=document.getElementById("debug-panel"),s=a?new Dr({title:"实验台 · 调试面板",autoPlace:!1,container:a}):new Dr({title:"实验台 · 调试面板"}),o=n.config,r=[],l=[],c=ut=>{const Ut=s.addFolder(ut);return l.push(Ut),Ut},d=(ut,Ut)=>{const at=ut.addFolder(Ut);return r.push(at),at},u=c("模拟 / 显示");u.add(e,"timeScale",0,3,.05).name("时间缩放"),u.add(e,"paused").name("暂停"),u.add({step:i.singleStep},"step").name("单步 (1 tick)"),u.add({reset:i.reset},"reset").name("复位全部"),u.add(e,"showColliders").name("碰撞盒线框").onChange(i.onToggleColliders),u.add(e,"showGrid").name("地面网格").onChange(i.onToggleGrid),u.add(e,"showLab").name("工位地面盘").onChange(i.onToggleLab),u.add(e,"showLabLabels").name("工位标牌").onChange(i.onToggleLabLabels);const h=d(u,"模块开关");h.add(n.modules,"movement").name("movement"),h.add(n.modules,"combat").name("combat"),h.add(n.modules,"links").name("links"),h.add(n.modules,"orientation").name("orientation"),h.add(n.modules,"turnInPlace").name("turnInPlace"),h.add(n.modules,"targeting").name("targeting"),h.add(n.modules,"hits").name("hits"),h.add(n.modules,"separation").name("separation"),h.add(n.modules,"dash").name("dash"),h.add(n.modules,"camera").name("camera"),h.add(n.modules,"dummies").name("dummies"),h.add(n.modules,"abilities").name("abilities");const f=c("移动 / 输入"),m=d(f,"基础移动参数");m.add(o,"moveSpeed",1,10,.1).name("移动速度"),m.add(o,"sprintMultiplier",1,3,.05).name("冲刺倍率"),m.add(o,"acceleration",1,40,.5).name("加速度"),m.add(o,"friction",1,40,.5).name("摩擦"),m.add(o,"skillDecel",2,40,.5).name("进入技能时的减速速率"),m.add(o,"gravity",5,60,.5).name("重力"),m.add(o,"jumpSpeed",2,16,.2).name("起跳速度"),m.add(o,"stepHeight",0,1.2,.01).name("自动爬台阶阈值"),m.add(o,"characterRadius",.1,.8,.01).name("角色半径"),m.add(o,"characterHeight",.6,2.2,.05).name("角色身高"),m.add(o,"strideLength",.3,3,.05).name("基础步幅"),m.add(o,"strideSpeedGain",0,1.5,.05).name("步幅随速度增益"),m.add(o,"strideSpeedCap",.5,4,.1).name("步幅增速上限");const _=d(f,"摇杆 / 输入");_.add(t.joystick,"maxRadiusPx",24,140,2).name("摇杆满推行程 (px)"),_.add(t.joystick,"deadZone",0,.3,.01).name("摇杆死区");const g=o.dash,p=d(f,"冲刺 / 闪避");p.add(g,"rollDistance",.5,8,.1).name("翻滚距离 (m)"),p.add(g,"rollDuration",.1,1.2,.02).name("翻滚时长 (s)"),p.add(g,"rollCooldown",.1,3,.05).name("翻滚冷却 (s)"),p.add(g,"blinkDistance",1,12,.25).name("闪现距离 (m)"),p.add(g,"blinkStep",.05,1,.02).name("闪现采样步长 (m)"),p.add(g,"blinkCooldown",.1,4,.05).name("闪现冷却 (s)"),p.add(g,"blinkClearVelocity").name("闪现清空速度"),p.add(t.dash,"fxDuration",.1,1.5,.05).name("特效时长 (s)"),p.add(t.dash,"ringRadius",.3,1.5,.05).name("光环半径 (m)");const v=o.separation,x=d(f,"角色间分离 / 挤压阻力");x.add(v,"iterations",1,8,1).name("迭代次数"),x.add(v,"slop",0,.05,.002).name("额外分离量 (m)"),x.add(v.crowd,"contactBand",0,1.5,.05).name("挤压接触带 (m)"),x.add(v.crowd,"minScale",0,1,.02).name("正面顶住时速度保留"),x.add(v.crowd,"approachDot",0,.9,.05).name("主动挤判定方向阈值");const y=c("动作 / 步态"),w=d(y,"程序化步态");w.add(t.gait,"reachRatio",.05,.6,.01).name("脚前伸 / 步幅比"),w.add(t.gait,"maxAmp",.2,2.5,.05).name("摆幅上限 (rad)"),w.add(t.gait,"sideWeight",0,2,.05).name("侧向步幅比例"),w.add(t.gait,"crossStep",0,1.5,.05).name("交叉步强度"),w.add(t.gait,"kneeLift",0,2,.05).name("抬膝幅度"),w.add(t.gait,"plantLock",0,1,.05).name("零滑步支撑相 0..1"),w.add(t.gait,"strideGain",.1,2,.05).name("摆幅回退增益(攻击用)"),w.add(t.gait,"comSway",0,.2,.005).name("重心侧移 (m)"),w.add(t.gait,"comBob",0,.2,.005).name("重心起伏 (m)"),w.add(t.gait,"hipLean",0,.6,.01).name("侧移侧倾 (rad)"),w.add(t.gait,"armSwing",0,2,.05).name("手臂对侧摆"),w.add(t.gait,"strafeHipBoost",0,2,.05).name("侧移下盘偏转增益"),w.add(t.gait,"strafeHipScale",0,1,.05).name("假人下盘偏转基准"),w.add(t.gait,"strafeHipMaxDeg",0,120,1).name("假人下盘偏转上限 (°)"),w.add(t.gait,"backStrafeStartDeg",20,170,1).name("侧后方起步角 (°)"),w.add(t.gait,"backStrafeFullDeg",40,180,1).name("完全后退角 (°)"),w.add(t.gait,"knockGaitScale",0,1.5,.05).name("击退步态驱动 (0=旧)");const S=d(y,"停步 / 收相 / 惯性");S.add(t.gait,"stopBlendSec",0,.8,.02).name("停步收相时长 (s)"),S.add(t.gait,"stopEnterRatio",.01,.4,.01).name("进入收相速度比"),S.add(t.gait,"stopExitRatio",.05,.8,.01).name("退出收相速度比"),S.add(t.gait,"stopStepPitch",0,.8,.02).name("前脚踩出 (rad)"),S.add(t.gait,"stopTrailPitch",0,.5,.02).name("跟随腿后蹬 (rad)"),S.add(t.gait,"stopStepKnee",0,.5,.02).name("前脚抬膝 (rad)"),S.add(t.gait,"stopBodyShift",0,.25,.005).name("身体惯性前移 (m)"),S.add(t.gait,"stopChestPitch",0,.4,.01).name("上身惯性前倾 (rad)"),S.add(t.gait,"stopBodyDip",0,.2,.005).name("骨盆跟随下沉 (m)"),S.add(t.gait,"stopPeakRatio",.05,.95,.02).name("惯性峰值位置"),S.add(t.gait,"chestYawScale",0,1.5,.05).name("胸随下盘偏转比例"),S.add(t.gait,"chestYawMaxDeg",0,90,1).name("胸偏转上限 (度)");const T=d(y,"足部 IK"),E=t.ik;T.add(E,"enabled").name("启用 IK 足部锚定 (关=旧 FK)"),T.add(E,"weight",0,1,.01).name("钉地权重"),T.add(E,"attackScale",0,1,.01).name("攻击时权重倍率"),T.add(E,"maxCorrectionDeg",5,120,1).name("单帧最大修正 (°)");const M=d(y,"惯性倾斜 / 盆骨"),b=t.lean;M.add(b,"accelGain",0,.1,.002).name("前后加速度增益"),M.add(b,"turnGain",0,.2,.005).name("绕圈侧倾增益"),M.add(b,"maxForwardDeg",0,30,1).name("前后最大倾角 (°)"),M.add(b,"maxSideDeg",0,30,1).name("侧向最大倾角 (°)"),M.add(b,"smoothing",1,30,1).name("倾斜平滑速率"),M.add(b,"pelvisTiltGain",0,1,.01).name("盆骨倾角比例"),M.add(b,"pelvisShift",0,.1,.002).name("盆骨重心平移 (m/rad)"),M.add(b,"moveCrouch",0,.15,.002).name("移动下沉 (m)"),M.add(b,"crouchSmoothing",1,30,1).name("下沉平滑速率");const R=o.orientation,k=d(y,"朝向 / 接敌注视 / 原地转身");k.add(R,"bodyTurnRate",.5,30,.5).name("身体平滑速率"),k.add(R,"headTurnRate",.5,40,.5).name("头部转向速率"),k.add(R,"maxHeadTurnDeg",0,90,1).name("头部相对身体限幅"),k.add(t.orientation,"legYawScale",0,1,.01).name("下盘跟随移动强度"),k.add(t.orientation,"hipYawMaxDeg",0,120,1).name("下盘带转上限 (°)"),k.add(t.orientation,"hipYawSmoothing",1,40,1).name("下盘带转平滑速率");const C=o.gaze;k.add(C,"headReturnRate",.5,12,.1).name("无目标回正速率 (1/s)"),k.add(C,"headReturnSpeedDeg",20,400,10).name("回正角速度上限 (°/s)"),k.add(C,"bodyTurnRate",.2,12,.1).name("接敌身体转向速率"),k.add(C,"headTurnRate",.5,30,.5).name("接敌头部转向速率"),k.add(C,"maxHeadSpeedDeg",30,900,10).name("头部最大角速度 (°/s)"),k.add(C,"maxBodySpeedDeg",20,600,10).name("身体最大角速度 (°/s)"),k.add(C,"aimHeightRatio",.2,1,.05).name("注视点高度（身高比例）"),k.add(C,"headPitchRate",.5,20,.5).name("头部俯仰速率"),k.add(C,"maxHeadPitchDeg",0,60,1).name("头部俯仰限幅 (°)"),k.add(C,"bodyPitchScale",0,1,.05).name("身体俯仰比例"),k.add(C,"bodyPitchRate",.5,20,.5).name("身体俯仰速率");const I=o.turnInPlace;k.add(I,"enabled").name("启用原地转身 (关=纯插值)"),k.add(I,"triggerDeg",20,180,5).name("触发夹角 (°)"),k.add(I,"gazeTriggerDeg",20,180,5).name("接敌时触发夹角 (°)"),k.add(I,"settleDeg",0,60,1).name("转身保留余角 (°)"),k.add(I,"durationSec",.1,1.5,.02).name("转身时长 (s)"),k.add(I,"idleSpeedRatio",0,.3,.01).name("静止速度比上限"),k.add(I,"inputDeadZone",0,.5,.01).name("起步输入死区"),k.add(I,"armSec",0,.5,.01).name("触发防抖 (s)"),k.add(t.gait,"stopYawBlendMode",["inStop","afterStop"]).name("停步偏差消化窗口"),k.add(t.gait,"stopYawAfterSec",.05,1,.02).name("收相后消化时长 (s)"),k.add(t.gait,"turnStepEnabled").name("转身踏步 (关=滑过去)"),k.add(t.gait,"turnStepPitch",0,1.2,.02).name("踏步前迈 (rad)"),k.add(t.gait,"turnStepKnee",0,1,.02).name("踏步抬膝 (rad)"),k.add(t.gait,"turnStepDip",0,.1,.002).name("踏步重心下沉 (m)");const L=c("战斗 / 命中"),D=o.combat,O=d(L,"连击 / 武器时序"),B=O.add(n.combat,"weapon",na).name("当前武器");O.add(D,"comboWindow",.1,2,.05).name("连击窗口 (s)"),O.add(D,"settle",0,.8,.01).name("段间停顿 (s)"),O.add(D,"attackMoveScale",0,1,.01).name("攻击时移动比例"),O.add(D,"lungeMoveScale",0,.4,.01).name("跨步时移动比例"),O.add(D,"lungeCurve",.2,4,.1).name("跨步曲线指数 (大=更冲)"),O.add(D,"lungeMaxSpeed",4,30,.5).name("跨步速度上限 (m/s)"),O.add(D,"settleMoveScale",0,1,.01).name("段间停顿移动比例"),O.add(D,"cancelWindow",0,1,.01).name("取消窗口 (s)"),O.add(D,"minLungeScale",0,2,.05).name("有目标前冲最小比例"),O.add(D,"autoCombo").name("按住自动连击"),O.add(D.weapons.greatsword,"windup",.02,.6,.01).name("大剑前摇"),O.add(D.weapons.greatsword,"active",.02,.6,.01).name("大剑命中帧"),O.add(D.weapons.greatsword,"recovery",.05,1,.01).name("大剑后摇"),O.add(D.weapons.greatsword,"moveMultiplier",.3,1.5,.05).name("大剑移速倍率"),O.add(D.bow,"maxChargeTime",.2,2,.05).name("满蓄力时间 (s)"),O.add(D.bow,"minChargeToFire",0,1,.02).name("最小可发射蓄力"),O.add(D.bow,"autoFire").name("蓄满自动放箭 (按住连射)"),O.add(D.bow.trajectory,"gravity",0,24,.5).name("箭矢重力 (m/s²)"),O.add(D.bow.trajectory,"speedMax",8,32,.5).name("满蓄初速 (m/s)"),O.add(D.bow.trajectory,"homingRange",0,30,1).name("自动瞄准距离 (m)"),O.add(D.bow.trajectory,"turnRateDeg",0,240,5).name("箭追踪转向 (°/s)"),O.add(D.bow.trajectory,"homingTime",0,2,.05).name("追踪时长 (s)"),O.add(D.bow.trajectory,"aimHeightRatio",0,1,.05).name("瞄准点高度");const V=o.abilities;O.add(V.arcane,"perWave",1,8,1).name("每波飞弹数"),O.add(V.arcane,"waves",1,12,1).name("每次引导波数"),O.add(V.arcane,"waveInterval",.05,.8,.01).name("波间隔 (s)"),O.add(V.arcane,"spreadDeg",0,20,.5).name("波内散布 (度)"),O.add(V.arcane,"spreadTime",0,.6,.01).name("出膛散开时长 (s)"),O.add(V.arcane,"spawnDelay",0,.2,.005).name("波内出膛错落 (s)"),O.add(V.arcane,"speedJitter",0,.5,.02).name("速度浮动比例"),O.add(V.arcane,"turnRateDeg",0,420,10).name("制导转向 (度/秒)"),O.add(V.arcane,"retargetInterval",.05,1,.05).name("重新索敌间隔 (s)"),O.add(V.arcane,"cooldown",0,3,.05).name("引导结束冷却 (s)"),O.add(V.arcane,"speed",3,24,.5).name("飞弹速度"),O.add(V.arcane,"moveScale",.2,1,.02).name("引导时移速倍率"),O.add(V.ring,"radius",.5,5,.1).name("电环半径"),O.add(V.ring,"stun",.1,1.5,.05).name("电环僵直 (s)"),O.add(V.ring,"pulseInterval",.1,1,.02).name("电环脉冲间隔");const ot=o.hits.hitstopWarp;if(ot){const ut=d(L,"卡肉节奏（接触瓦片）");ut.add(ot,"enabled").name("瓦片开（关=硬冻结）"),ut.add(ot,"holdRate",0,.4,.01).name("保持期速率"),ut.add(ot,"release",.005,.2,.005).name("释放时长 (s)"),ut.add(ot,"payback",1,2.5,.05).name("偿还倍率"),ut.add(o.hits.hitstop,"light",0,.2,.005).name("轻击保持 (s)"),ut.add(o.hits.hitstop,"heavy",0,.25,.005).name("重击保持 (s)"),ut.add(o.hits.hitstop,"knock",0,.3,.005).name("击飞保持 (s)")}const gt=o.hits,vt=d(L,"命中 / 受击 / 击退");vt.add(gt,"arcDeg",10,120,5).name("命中扇区半角 (°)"),vt.add(gt,"hurtLight",.05,1,.01).name("轻受击时长 (s)"),vt.add(gt,"hurtHeavy",.05,1,.01).name("重受击时长 (s)"),vt.add(gt,"hurtKnock",.05,1,.01).name("击退受击时长 (s)"),vt.add(gt.knockback,"greatsword",0,2,.05).name("大剑击退 (m)"),vt.add(gt.reach,"greatsword",.5,4,.1).name("大剑攻击距离 (m)"),vt.add(gt,"dummyReach",.5,4,.1).name("假人命中距离 (m)"),vt.add(gt,"knockbackDecay",0,10,.1).name("击退衰减 (初速系数)");const It={get enabled(){return!gt.noDamageToPlayer},set enabled(ut){gt.noDamageToPlayer=!ut}};vt.add(It,"enabled").name("玩家受击击退");const K=d(L,"受击分层"),it=t.hurt;K.add(it,"enabled").name("启用分层受击 (关=旧版对照)"),K.add(it,"forceHitHeight",-1,1,.01).name("强制部位 -1自动 / 0腹 / 1肩"),K.add(it,"pulseRatio",.05,.6,.01).name("冲击→回弹分段"),K.add(it,"comShift",0,.4,.005).name("整体重心偏离 (应 < 上身位移)"),K.add(it,"lowerScale",0,1,.01).name("下盘跟随骨盆比例"),K.add(it,"upperShiftScale",0,1,.01).name("上身位移缩放"),K.add(it,"maxUpperShift",0,.4,.005).name("上身位移上限 (m)"),K.add(it.hitHeight,"light",0,1,.01).name("轻击命中部位"),K.add(it.hitHeight,"heavy",0,1,.01).name("重击命中部位"),K.add(it.hitHeight,"knock",0,1,.01).name("击退命中部位"),K.add(it,"leanLight",0,1.5,.01).name("轻击力度"),K.add(it,"leanHeavy",0,1.5,.01).name("重击力度"),K.add(it,"leanKnock",0,1.5,.01).name("击退力度"),K.add(it,"flashStrength",0,2,.05).name("受击闪光强度");for(const{name:ut,p:Ut}of[{name:"打腹 (abdomen)",p:it.abdomen},{name:"打肩 (shoulder)",p:it.shoulder}]){const at=d(K,ut);at.add(Ut,"upperPitch",0,2,.01).name("上身前后倾斜"),at.add(Ut,"upperRoll",0,2,.01).name("上身侧倾"),at.add(Ut,"upperYaw",0,1.5,.01).name("肩部扭转"),at.add(Ut,"fold",-1,1,.01).name("躯干前屈 (蜷缩)"),at.add(Ut,"shift",0,.8,.01).name("身体反应位移"),at.add(Ut,"drop",0,.4,.01).name("整体下沉"),at.add(Ut,"back",0,.4,.01).name("屁股向后"),at.add(Ut,"knee",0,1.6,.01).name("屈膝"),at.add(Ut,"hip",0,1,.01).name("髋前倾"),at.add(Ut,"arm",-1,1,.01).name("手臂 (正收拢 / 负甩开)")}const ct=d(L,"派生招"),Z=o.links;ct.add(Z,"enabled").name("总开关 (false=旧连击)"),ct.add(Z.windows,"roll",0,1.2,.01).name("翻滚后窗口 (s)"),ct.add(Z.windows,"blink",0,1.2,.01).name("闪现后窗口 (s)"),ct.add(Z.windows,"sprint",0,1.2,.01).name("长跑后窗口 (s)"),ct.add(Z,"sharedCooldown",0,3,.05).name("共享 CD (s)"),ct.add(Z,"triggerWhileSprinting").name("长跑中可直接触发"),ct.add(Z.search,"range",1,14,.1).name("索敌距离 (m)"),ct.add(Z.search,"maxAngleDeg",0,180,1).name("索敌扇区半角 (°)"),ct.add(Z.search,"stopDistance",0,3,.05).name("停住距离 (m)");const J=Z.moves["sword-shield"];J&&(ct.add(J,"enabled").name("剑盾盾击"),ct.add(J,"distance",0,8,.1).name("冲锋极限 (m)"),ct.add(J,"windup",0,.5,.01).name("前摇 (s)"),ct.add(J,"active",0,.8,.01).name("冲锋 / 命中 (s)"),ct.add(J,"recovery",0,.8,.01).name("收势 (s)"),ct.add(J.hit,"radius",0,4,.05).name("命中半径 (m)"),ct.add(J.hit,"width",0,2,.05).name("扫掠半径 (m)"),ct.add(J.hit,"knockback",0,2,.05).name("盾撞击退 (m)"),ct.add(J.hit,"duration",0,1.5,.01).name("僵直 (s)"));const lt=o.targeting,Ht=d(L,"目标辅助");Ht.add(lt,"targetAssist").name("启用目标辅助"),Ht.add(lt,"range",1,14,.5).name("锁定范围 (m)"),Ht.add(lt,"maxAngleDeg",10,180,5).name("前方扇区半角 (°)"),Ht.add(lt,"frontBias",0,4,.1).name("朝向加权"),Ht.add(lt,"idealRange",.6,4,.05).name("理想攻击距离 (m)"),Ht.add(lt,"maxLungeScale",1,3,.1).name("前冲最大放大");const qt=c("表现 / 特效"),Ct=d(qt,"挥击幅度 / 刀光"),q=t.animation.swing;Ct.add(q,"enabled").name("挥击身体幅度 开"),Ct.add(q,"bodyScale",0,1.6,.05).name("躯干 / 骨盆幅度倍率"),Ct.add(q,"shoulderLift",0,.12,.005).name("肩部抬升上限 (m)"),Ct.add(q,"shoulderPush",0,.1,.005).name("肩部前送上限 (m)"),Ct.add(q,"shoulderIn",0,.1,.005).name("双手武器肩内收 (m)"),Ct.add(q,"segBlend",0,.35,.01).name("段间过渡兜底 (s)"),Ct.add(q,"segBlendMin",.008,.12,.004).name("段间过渡下限 (s)"),Ct.add(q,"segBlendRef",2,16,.5).name("段间过渡参考距离 (rad)"),Ct.add(q.weaponScale,"greatsword",0,1.6,.05).name("大剑幅度倍率");const U=t.weaponTrail;Ct.add(U,"enabled").name("挥击刀光 开"),Ct.add(U,"life",.04,.4,.01).name("刀光残留 (s)"),Ct.add(U,"intensity",0,1.5,.05).name("刀光亮度"),Ct.add(U,"minStep",.005,.1,.005).name("采样最小位移 (m)"),Ct.add(t.hitstop,"enabled").name("命中卡肉 / 震屏");const Nt=d(qt,"夸张化 / 四肢伸缩"),Dt=t.animation.stretch;Nt.add(Dt,"enabled").name("四肢伸缩 开"),Nt.add(Dt,"swingArm",1,1.8,.01).name("挥出时手臂拉伸"),Nt.add(Dt,"chargeArm",.7,1,.01).name("蓄力时手臂压缩"),Nt.add(Dt,"impactSquash",0,.5,.01).name("命中挤压量"),Nt.add(Dt,"impactDecay",2,30,.5).name("挤压回弹速率 (1/s)"),Nt.add(Dt,"torsoGain",0,1,.05).name("躯干跟随比例"),Nt.add(Dt,"volumeExp",0,1.5,.05).name("体积补偿指数");const St=d(qt,"武器握持 / 腕部"),_t=t.weaponWrist;St.add(_t,"enabled").name("腕部滞后 开（关掉=武器焊在手上）"),St.add(_t,"lag",0,.08,.002).name("臂速 → 腕滞后"),St.add(_t,"maxAngle",0,1.2,.02).name("腕滞后上限 (rad)"),St.add(_t,"rate",4,50,1).name("腕部跟随速率 (1/s)"),St.add(_t,"twistLag",0,.06,.002).name("躯干扭转 → 剑横甩"),St.add(_t,"maxTwist",0,.9,.02).name("横甩上限 (rad)");const xt=t.weaponMount;St.add(xt,"twoHandInsetX",0,.3,.01).name("双手武器内收 (m)"),St.add(xt,"twoHandGripY",-.5,0,.01).name("副握点在柄上的位置"),St.add(xt,"twoHandMaxStretch",1,1.8,.01).name("副手臂长拉伸上限"),St.add(xt,"twoHandMinGrip",0,1,.02).name("最低握持权重（1=永不松手）"),St.add(xt,"twoHandGripStart",1,1.4,.01).name("开始松手的臂展比"),St.add(xt,"twoHandSlideRate",0,30,1).name("握点滑柄跟随速率 (1/s)"),St.add(xt,"swordPitchDeg",0,90,1).name("剑前倾角"),St.add(xt,"swordYawDeg",0,45,1).name("剑外张角"),St.add(xt,"greatswordPitchDeg",0,90,1).name("大剑前倾角"),St.add(xt,"staffPitchDeg",0,60,1).name("法杖前倾角");const Rt=c("假人 / 混战"),F=o.dummies,A=d(Rt,"普通假人 AI");A.add(F,"moveSpeed",.5,8,.1).name("移动速度"),A.add(F,"wanderRadius",.5,8,.1).name("游走半径"),A.add(F,"wanderInterval",.3,8,.1).name("换目标间隔 (s)"),A.add(F,"followStopDistance",.3,5,.1).name("跟随停距"),A.add(F,"keepDistance",1,10,.1).name("保持距离"),A.add(F,"keepDeadZone",.1,2,.05).name("保持死区"),A.add(F,"attackRange",.5,5,.1).name("攻击距离"),A.add(F,"attackInterval",.3,5,.1).name("攻击间隔 (s)"),A.add(F,"leashRadius",0,8,.1).name("牵引半径 (0=不限)");const G=F.fighters;if(G){const ut=d(Rt,"持械陪练（剑盾 / 双刀 / 大剑）");ut.add(G,"moveSpeed",.5,6,.1).name("移动速度"),ut.add(G,"attackInterval",.5,8,.1).name("攻击间隔 (s)"),ut.add(G,"attackRangeScale",.5,1.2,.02).name("起手距离 / 武器 reach"),ut.add(G,"knockbackScale",0,2,.05).name("击退比例"),ut.add(G,"leashRadius",0,14,.5).name("牵引半径 (m)"),ut.add(G,"comboCount",0,3,1).name("连击段数 (0=随武器)"),ut.add(G,"comboGap",0,.6,.01).name("段间缝隙 (s, 0=用全局)");const Ut=()=>n.dummies.find(bt=>bt.weapon!==null),at={get mode(){var bt;return((bt=Ut())==null?void 0:bt.mode)??"spar"},set mode(bt){i.setFighterMode(bt)}};ut.add(at,"mode",zf).name("陪练行为（全部）")}const pt=c("相机"),Q=d(pt,"基础");Q.add(t.camera,"pitchDeg",20,80,1).name("俯角"),Q.add(t.camera,"yawDeg",-180,180,1).name("方位角"),Q.add(t.camera,"distance",6,35,.5).name("距离"),Q.add(t.camera,"smoothing",.5,20,.5).name("跟随平滑"),Q.add(t.camera,"fov",25,90,1).name("FOV");const rt=o.camera,Ft=d(pt,"智能构图");Ft.add(rt,"radius",2,18,.5).name("威胁评估半径 (m)"),Ft.add(rt,"nearDistance",.2,6,.1).name("权重饱和距离 (m)"),Ft.add(rt,"saturation",.5,8,.1).name("威胁归一化饱和"),Ft.add(rt,"pushIn",0,.5,.01).name("无威胁推进比例"),Ft.add(rt,"maxPullback",0,1,.02).name("最大拉远比例"),Ft.add(rt,"maxOffset",0,6,.1).name("最大构图平移 (m)"),Ft.add(rt,"maxPitchDelta",0,20,.5).name("最大俯角增量 (°)"),Ft.add(rt,"framingBias",0,1,.05).name("威胁质心平移系数"),Ft.add(rt,"attackBoost",0,2,.05).name("挥砍中额外加权"),Ft.add(rt.modeWeight,"attack",0,3,.05).name("攻击模式威胁倍率"),Ft.add(rt.modeWeight,"spar",0,3,.05).name("陪练模式威胁倍率"),Ft.add(t.smartCamera,"smoothing",.2,12,.2).name("构图平滑速率");const tt=d(pt,"缩放");return tt.add(t.zoom,"min",.2,1,.01).name("最小倍率 (拉近下限)"),tt.add(t.zoom,"max",1,4,.05).name("最大拉远上限"),tt.add(t.zoom,"smoothing",1,40,1).name("缩放平滑速率"),tt.add(t.zoom,"pinchGain",0,3,.05).name("捏合灵敏度"),tt.add(t.zoom,"maxStepRatio",1,2,.05).name("单帧缩放限幅"),tt.add(t.zoom,"wheelStep",1,1.5,.01).name("滚轮步长"),tt.add(t.zoom,"keyStep",1,1.5,.01).name("按键步长"),tt.add({reset:i.resetZoom},"reset").name("缩放归 1"),r.forEach(ut=>ut.close()),l.forEach(ut=>ut.close()),s.close(),{gui:s,refreshWeapon:()=>B.updateDisplay()}}function i_(n,t,e){let i=null,a=Number.POSITIVE_INFINITY;for(const s of n){const o=Math.hypot(t-s.x,e-s.z);o<=s.radius&&o<a&&(i=s,a=o)}return i}function a_(n,t){return n.find(e=>e.id===t)??null}function Kd(n,t,e){if(n.length===0)return null;const i=[...n].sort((r,l)=>r.index-l.index),a=i.findIndex(r=>r.id===t),s=e<0?-1:1,o=a<0?s>0?0:i.length-1:(a+s+i.length)%i.length;return i[o]??null}function s_({stations:n,plots:t=[],world:e,view:i,container:a,onResetZoom:s,onPlotTest:o,onClearTestUnits:r}){var E;const l=a??document.getElementById("lab-panel");let c=null,d=null;const u=new Map,h=document.createElement("div");h.id="lab-toast",h.setAttribute("aria-live","polite"),document.body.appendChild(h);let f=0;function m(M){h.textContent=`${M.index} · ${M.name} — ${M.hint}`,h.style.borderColor=M.color,h.classList.add("is-on"),window.clearTimeout(f),f=window.setTimeout(()=>h.classList.remove("is-on"),5e3)}function _(){return i_(n,e.character.position.x,e.character.position.z)}function g(){const M=_(),b=(M==null?void 0:M.id)??null;if(b===c)return;const R=c!==null;c=b;for(const[k,C]of u)C.classList.toggle("is-active",k===b);d&&(d.textContent=M?`${M.index} · ${M.hint}`:"不在任何工位内：点上面的名字传送，或直接走过去",d.style.color=M?"rgba(206, 226, 244, 0.9)":"rgba(150, 172, 192, 0.62)"),M?m(M):R&&h.classList.remove("is-on")}function p(M){const b=typeof M=="number"?n.find(R=>R.index===M)??null:a_(n,M);return b?(Vg(e,b.spawnX,b.spawnZ),e.camera.centroidX=b.spawnX,e.camera.centroidZ=b.spawnZ,i.snapCamera(b.spawnX,e.character.position.y,b.spawnZ),g(),!0):!1}function v(){sp(e)}function x(M){return p(M.id),o?o(M):0}function y(){return r?r():0}function w(M){const b=typeof M=="number"?t.find(R=>R.index===M):t.find(R=>R.id===M);return b&&b.testSpawn?x(b):0}const S=t.filter(M=>M.testSpawn),T=M=>{var b,R;return(((b=M.testSpawn)==null?void 0:b.dummies)??0)+(((R=M.testSpawn)==null?void 0:R.fighters)??0)};if(l){l.textContent="";const M=document.createElement("div");M.className="lab-head",M.textContent="测试工位";const b=document.createElement("span");b.className="lab-tip",b.textContent="[ / ] 切换",M.appendChild(b),l.appendChild(M);for(const C of[...n].sort((I,L)=>I.index-L.index)){const I=document.createElement("button");I.type="button",I.className="lab-row",I.dataset.station=C.id,I.dataset.uiButton="",I.style.setProperty("--lab-color",C.color),I.setAttribute("aria-label",`传送到工位 ${C.index}：${C.name}`);const L=document.createElement("span");L.className="lab-idx",L.textContent=String(C.index);const D=document.createElement("span");D.className="lab-name",D.textContent=C.name,I.append(L,D),I.addEventListener("pointerdown",O=>{O.preventDefault(),O.stopPropagation(),p(C.id)}),l.appendChild(I),u.set(C.id,I)}if(d=document.createElement("div"),d.className="lab-hint",l.appendChild(d),S.length>0){const C=document.createElement("div");C.className="lab-head lab-subhead",C.textContent="地块测试";const I=document.createElement("span");I.className="lab-tip",I.textContent="就地生成",C.appendChild(I),l.appendChild(C);for(const L of S){const D=document.createElement("div");D.className="lab-row lab-test-row",D.dataset.plot=L.id;const O=document.createElement("span");O.className="lab-name",O.textContent=L.name;const B=document.createElement("button");B.type="button",B.className="lab-btn lab-test",B.dataset.uiButton="",B.dataset.plotTest=L.id,B.textContent=((E=L.testSpawn)==null?void 0:E.label)??`生成 ${T(L)} 人`,B.setAttribute("aria-label",`在${L.name}就地生成 ${T(L)} 个测试单位`),B.addEventListener("pointerdown",V=>{V.preventDefault(),V.stopPropagation(),x(L)}),D.append(O,B),l.appendChild(D)}}const R=document.createElement("div");R.className="lab-foot";const k=document.createElement("button");if(k.type="button",k.className="lab-btn",k.dataset.uiButton="",k.textContent="召回假人",k.setAttribute("aria-label","召回全部假人回到各自工位"),k.addEventListener("pointerdown",C=>{C.preventDefault(),C.stopPropagation(),v()}),R.appendChild(k),S.length>0){const C=document.createElement("button");C.type="button",C.className="lab-btn",C.dataset.uiButton="",C.dataset.clearTestUnits="",C.textContent="清除测试单位",C.setAttribute("aria-label","清除所有由地块测试按钮生成的假人与陪练"),C.addEventListener("pointerdown",I=>{I.preventDefault(),I.stopPropagation(),y()}),R.appendChild(C)}if(s){const C=document.createElement("button");C.type="button",C.className="lab-btn",C.dataset.uiButton="",C.textContent="镜头归位",C.setAttribute("aria-label","把镜头缩放恢复到默认"),C.addEventListener("pointerdown",I=>{I.preventDefault(),I.stopPropagation(),s()}),R.appendChild(C)}l.appendChild(R)}return window.addEventListener("keydown",M=>{var b,R;if(!(M.metaKey||M.ctrlKey||M.altKey))if(M.key==="["){const k=Kd(n,((b=_())==null?void 0:b.id)??c,-1);k&&p(k.id)}else if(M.key==="]"){const k=Kd(n,((R=_())==null?void 0:R.id)??c,1);k&&p(k.id)}else M.key==="\\"&&v()}),g(),{goto:p,current:_,tick:g,recall:v,spawnAt:w,clearSpawned:y,element:l}}const Sc=Math.PI*2,mi={input:"#38bdf8",raw:"#7dd3fc",move:"#fbbf24",face:"#f472b6",aim:"#fb923c",lock:"#f87171",ring:"rgba(150, 190, 220, 0.34)",grid:"rgba(150, 190, 220, 0.14)",dead:"rgba(190, 214, 234, 0.28)"},o_=45,r_=50;function c_(n,t,e){return{x:e.rightX*n+e.rightZ*t,y:-(e.forwardX*n+e.forwardZ*t)}}function Ns(n,t,e){const i=c_(n,t,e);return Math.atan2(i.x,-i.y)*180/Math.PI}function l_(n,t){return Math.atan2(n,-t)*180/Math.PI}function Jd(n,t){return Math.abs(((n-t)%360+540)%360-180)}function Lo(n){return(n%360+360)%360}const h_={inDeg:null,inLen:0,rawDeg:null,rawLen:0,stickHeld:!1,moveDeg:null,speed:0,faceDeg:0,lockDeg:null,lockId:0,lockDist:0,aimDeg:null,gapMove:null,gapFace:null,warnMove:!1};function d_(n,t,e,i=8){const a=n.character,s=t.intents,o=Math.hypot(s.moveX,s.moveZ),r=Math.hypot(t.stickRawX,t.stickRawY),l=a.velocity,c=Math.hypot(l.x,l.z),d=o>.001?Ns(s.moveX,s.moveZ,e):null,u=c>.15?Ns(l.x,l.z,e):null,h=Ns(Math.sin(a.facing),Math.cos(a.facing),e),f=s.aimActive&&Math.hypot(s.aimX,s.aimZ)>1e-6?Ns(s.aimX,s.aimZ,e):null,m=n.targeting,_=m.hasTarget?Ns(Math.sin(m.targetYaw),Math.cos(m.targetYaw),e):null,g=d!==null&&u!==null?Jd(d,u):null,p=d!==null?Jd(d,h):null,v=g!==null&&g>o_&&o>=.35&&c>=.4;return{inDeg:d,inLen:Math.min(1,o),rawDeg:r>.02?l_(t.stickRawX,t.stickRawY):null,rawLen:Math.min(1,r),stickHeld:t.stickHeld,moveDeg:u,speed:c,faceDeg:h,lockDeg:_,lockId:m.targetId,lockDist:m.targetDist,aimDeg:f,gapMove:g,gapFace:p,warnMove:v}}function Qd(n,t){return!t&&n.aimDeg===null&&n.gapFace!==null&&n.gapFace>r_&&(n.inLen>=.35||n.speed>=.4)}const tu="harness.dirDebug";function u_(n={}){const t=!!n.embedded,e=document.createElement("div");e.id="dirdbg",t&&e.classList.add("is-embedded");const i=['<canvas id="dirdbg-canvas" width="118" height="118"></canvas>','<div id="dirdbg-read">','  <span class="dd-line"><span class="dd-in" data-k="in">入 -</span><span class="dd-mv" data-k="mv">移 -</span><span class="dd-fc" data-k="fc">面 -</span></span>','  <span class="dd-line dd-sub" data-k="gap">Δ -</span>',"</div>"];e.innerHTML=t?i.join(""):['<button id="dirdbg-toggle" type="button" data-ui-button aria-label="收起方向调试盘">方向 ⌄</button>',...i].join(""),(n.container??document.body).appendChild(e);const a=e.querySelector("#dirdbg-canvas"),s=e.querySelector("#dirdbg-toggle"),o={in:e.querySelector('[data-k="in"]'),mv:e.querySelector('[data-k="mv"]'),fc:e.querySelector('[data-k="fc"]'),gap:e.querySelector('[data-k="gap"]')},r=a.getContext("2d");let l=!0;if(!t)try{l=window.localStorage.getItem(tu)!=="0"}catch{}function c(){e.classList.toggle("is-off",!l),s&&(s.textContent=l?"方向 ⌄":"方向 ▸",s.setAttribute("aria-expanded",String(l)))}c();function d(x){if(l=x,!t)try{window.localStorage.setItem(tu,x?"1":"0")}catch{}c()}s==null||s.addEventListener("pointerdown",x=>{x.preventDefault(),x.stopPropagation(),d(!l)}),t||window.addEventListener("keydown",x=>{x.key.toLowerCase()==="v"&&!x.metaKey&&!x.ctrlKey&&d(!l)});const u=Math.min(3,Math.max(1,window.devicePixelRatio||1)),h=118;a.width=Math.round(h*u),a.height=Math.round(h*u);let f=h_,m=0,_="",g=8;function p(x){if(!r)return;const y=h,w=h,S=y/2,T=w/2,E=Math.min(y,w)/2-13;r.setTransform(u,0,0,u,0,0),r.clearRect(0,0,y,w),r.beginPath(),r.arc(S,T,E,0,Sc),r.fillStyle="rgba(8, 12, 17, 0.5)",r.fill(),r.lineWidth=1,r.strokeStyle=x.warnMove?"rgba(251, 191, 36, 0.85)":mi.ring,r.stroke(),r.strokeStyle=mi.grid,r.beginPath(),r.moveTo(S-E,T),r.lineTo(S+E,T),r.moveTo(S,T-E),r.lineTo(S,T+E),r.stroke();for(let k=0;k<8;k++){const C=k*Math.PI/4,I=S+Math.sin(C)*(E-3),L=T-Math.cos(C)*(E-3),D=S+Math.sin(C)*E,O=T-Math.cos(C)*E;r.beginPath(),r.moveTo(I,L),r.lineTo(D,O),r.stroke()}const M=n.deadZone?Math.min(.9,Math.max(0,n.deadZone())):0;M>0&&(r.save(),r.setLineDash([2,3]),r.strokeStyle=mi.dead,r.beginPath(),r.arc(S,T,E*M,0,Sc),r.stroke(),r.restore());const b=(k,C,I,L,D=!1,O=1)=>{const B=k*Math.PI/180,V=Math.sin(B),ot=-Math.cos(B),gt=E*Math.max(.14,Math.min(1,C)),vt=S+V*E*.14,It=T+ot*E*.14,K=S+V*gt,it=T+ot*gt;if(r.save(),r.globalAlpha=O,r.strokeStyle=I,r.fillStyle=I,r.lineWidth=L,r.lineCap="round",D&&r.setLineDash([3,3]),r.beginPath(),r.moveTo(vt,It),r.lineTo(K,it),r.stroke(),!D&&gt>E*.3){const ct=-ot,Z=V,J=5.2;r.beginPath(),r.moveTo(K+V*1.5,it+ot*1.5),r.lineTo(K-V*J+ct*J*.72,it-ot*J+Z*J*.72),r.lineTo(K-V*J-ct*J*.72,it-ot*J-Z*J*.72),r.closePath(),r.fill()}r.restore()},R=(k,C)=>{const I=k*Math.PI/180,L=Math.sin(I),D=-Math.cos(I),O=-D,B=L,V=E+1.5,ot=V+6.5;r.save(),r.fillStyle=C,r.strokeStyle=C,r.lineWidth=1,r.beginPath(),r.moveTo(S+L*ot,T+D*ot),r.lineTo(S+L*V+O*4,T+D*V+B*4),r.lineTo(S+L*V-O*4,T+D*V-B*4),r.closePath(),r.fill(),r.restore()};x.lockDeg!==null&&b(x.lockDeg,1,mi.lock,1,!0,.7),x.rawDeg!==null&&x.stickHeld&&b(x.rawDeg,x.rawLen,mi.raw,1,!0,.9),x.aimDeg!==null&&b(x.aimDeg,1,mi.aim,1.6,!0,.95),b(x.faceDeg,1,mi.face,1.1,!0,.55),x.moveDeg!==null&&b(x.moveDeg,x.speed/Math.max(1,g),mi.move,5.5,!1,.8),x.inDeg!==null&&b(x.inDeg,x.inLen,mi.input,2.2),R(x.faceDeg,mi.face),r.beginPath(),r.arc(S,T,2.2,0,Sc),r.fillStyle="rgba(220, 235, 248, 0.85)",r.fill()}function v(x,y){const w=E=>E===null?"-":String(Math.round(Lo(E)));o.in.textContent=`入 ${w(x.inDeg)}`,o.mv.textContent=`移 ${w(x.moveDeg)}`,o.fc.textContent=`面 ${w(x.faceDeg)}`;const S=E=>E===null?"-":`${Math.round(E)}°`,T=[`Δ入→移 ${S(x.gapMove)}`,`Δ入→面 ${S(x.gapFace)}`];x.speed>.05&&T.push(`v${x.speed.toFixed(1)}`),x.lockDeg!==null&&T.push(`锁#${x.lockId} ${x.lockDist.toFixed(1)}m`),x.aimDeg!==null&&T.push("拖拽瞄准"),o.gap.textContent=T.join("  "),e.classList.toggle("is-warn",x.warnMove||Qd(x,y))}return{update(x,y,w){if(!l)return;g=Math.max(1,x.config.moveSpeed*Math.max(1,x.config.sprintMultiplier));const S=d_(x,y,w,g);f=S;const T=x.combat.phase!=="idle";p(S);const E=performance.now(),M=`${S.inDeg}|${S.moveDeg}|${S.faceDeg}|${S.lockId}|${S.aimDeg}|${S.warnMove}|${S.speed.toFixed(1)}`;(E-m>90||M!==_)&&(m=E,_=M,v(S,T),e.dataset.in=S.inDeg===null?"":Lo(S.inDeg).toFixed(1),e.dataset.mv=S.moveDeg===null?"":Lo(S.moveDeg).toFixed(1),e.dataset.fc=Lo(S.faceDeg).toFixed(1),e.dataset.warn=S.warnMove||Qd(S,T)?"1":"0")},setEnabled:d,toggle(){return d(!l),l},enabled:()=>l,last:()=>f}}const f_=6,p_=480,eu=240,nu=92,m_=18;function g_(n,t,e,i){const a=t-n;return{t:i,speed:t,drive:t,raw:t,dv:a,accel:e>1e-4?a/e:0,busy:!1}}function x_(n,t,e,i){const s=Math.hypot(t.x-n.x,t.z-n.z)/Math.max(e,1e-4);return{raw:s,speed:Math.min(s,Math.max(1,i))}}function v_(n){return n.combat.phase!=="idle"||n.dash.phase==="active"||n.abilities.channeling||Math.hypot(n.playerHurt.knockX,n.playerHurt.knockZ)>.001}function y_(n={}){const t=Math.max(1,n.windowS??f_),e=Math.max(60,n.capacity??p_),i=Math.max(1,n.speedCap??m_),a=!!(n.container&&n.toggle),s=n.container??document.createElement("div");s.id="motiondbg",n.container||(s.setAttribute("data-ui-region",""),document.body.appendChild(s));const o=['<div id="motiondbg-head"><span>速度(位移) / Δv</span><span id="motiondbg-window">6.0s</span></div>','<canvas id="motiondbg-graph" width="240" height="92"></canvas>','<div id="motiondbg-read">v - · 峰 - · Δv -</div>','<div id="motiondbg-dir"></div>'].join("");s.innerHTML=a?`<div id="motiondbg-body">${o}</div>`:['<button id="motiondbg-toggle" type="button" data-ui-button aria-label="展开手感调试面板" aria-expanded="false">手感 ▸</button>',`<div id="motiondbg-body">${o}</div>`].join("");const r=n.toggle??s.querySelector("#motiondbg-toggle"),l=s.querySelector("#motiondbg-graph"),c=s.querySelector("#motiondbg-read"),d=s.querySelector("#motiondbg-window"),u=s.querySelector("#motiondbg-dir");d.textContent=`${t.toFixed(1)}s`;const h=l.getContext("2d"),f=Math.min(3,Math.max(1,window.devicePixelRatio||1));l.width=Math.round(eu*f),l.height=Math.round(nu*f);const m=u_({deadZone:n.deadZone,container:u,embedded:!0});let _=!1;function g(E){_=E,s.classList.toggle("is-off",!E),!a&&r&&(r.textContent=E?"手感 ⌄":"手感 ▸",r.setAttribute("aria-expanded",String(E)),r.setAttribute("aria-label",E?"收起手感调试面板":"展开手感调试面板"))}g(!1),a||(r==null||r.addEventListener("pointerdown",E=>{E.preventDefault(),E.stopPropagation(),g(!_)}),window.addEventListener("keydown",E=>{E.key.toLowerCase()==="v"&&!E.metaKey&&!E.ctrlKey&&g(!_)}));const p=[];let v=0,x=null,y=-1,w={speed:0,drive:0,raw:0,dv:0,accel:0,peak:0,samples:0,windowS:t,busy:!1};function S(E){const M=E-t;let b=0;for(;b<p.length&&p[b].t<M;)b++;return p.slice(b)}function T(E,M){if(!h)return;const b=eu,R=nu;h.setTransform(f,0,0,f,0,0),h.clearRect(0,0,b,R),h.fillStyle="rgba(8, 12, 17, 0.55)",h.fillRect(0,0,b,R);const k=4,C=4,I=b-k-C,L=9,D=46,O=62,B=22,V=M-t,ot=Z=>k+Math.max(0,Math.min(1,(Z-V)/t))*I;for(let Z=0;Z<E.length;Z++){if(!E[Z].busy)continue;const J=ot(E[Z].t),lt=Z+1<E.length?ot(E[Z+1].t):J+2;h.fillStyle="rgba(251, 146, 60, 0.13)",h.fillRect(J,L,Math.max(2,lt-J),D)}h.strokeStyle="rgba(150, 190, 220, 0.14)",h.lineWidth=1,h.beginPath();for(const Z of[L,L+D/2,L+D])h.moveTo(k,Z),h.lineTo(b-C,Z);h.moveTo(k,O+B/2),h.lineTo(b-C,O+B/2),h.stroke();const vt=Math.max(1,...E.map(Z=>Z.speed),...E.map(Z=>Z.drive))*1.15,It=Z=>L+D-Z/vt*D;if(E.length>1){h.beginPath(),h.moveTo(ot(E[0].t),It(E[0].speed));for(let Z=1;Z<E.length;Z++)h.lineTo(ot(E[Z].t),It(E[Z].speed));h.strokeStyle="#38bdf8",h.lineWidth=1.8,h.lineJoin="round",h.stroke(),h.lineTo(ot(E[E.length-1].t),L+D),h.lineTo(ot(E[0].t),L+D),h.closePath(),h.fillStyle="rgba(56, 189, 248, 0.14)",h.fill(),h.beginPath(),h.moveTo(ot(E[0].t),It(E[0].drive));for(let Z=1;Z<E.length;Z++)h.lineTo(ot(E[Z].t),It(E[Z].drive));h.setLineDash([3,3]),h.strokeStyle="rgba(190, 205, 220, 0.6)",h.lineWidth=1.2,h.stroke(),h.setLineDash([])}let K=.02;for(const Z of E)K=Math.max(K,Math.abs(Z.dv));K*=1.1;const it=O+B/2,ct=B/2;for(const Z of E){const J=Math.min(ct,Math.abs(Z.dv)/K*ct);h.fillStyle=Z.dv>=0?"rgba(56, 189, 248, 0.85)":"rgba(251, 146, 60, 0.85)",h.fillRect(ot(Z.t)-.7,Z.dv>=0?it-J:it,1.4,Math.max(.5,J))}h.font="9px ui-monospace, monospace",h.fillStyle="rgba(190, 214, 234, 0.55)",h.textAlign="left",h.fillText(vt.toFixed(1),k+2,L+8),h.fillText("v",k+2,L+D-2),h.fillText("Δv",k+2,O+9),h.textAlign="right",h.fillText("0",b-C-2,L+D-2),h.textAlign="left"}return{dirDebug:m,update(E,M,b){const R=performance.now()/1e3,k=y<0?1/60:Math.max(1e-4,Math.min(.25,R-y));y=R;const C=E.character,I={x:C.position.x,z:C.position.z},L=Math.hypot(C.velocity.x,C.velocity.z),{speed:D,raw:O}=x?x_(x,I,k,i):{speed:0,raw:0},B=g_(v,D,k,R);B.drive=L,B.raw=O,B.busy=v_(E),x=I,v=D,p.push(B),p.length>e&&p.shift();const V=S(R);let ot=0;for(const gt of V)ot=Math.max(ot,gt.speed);if(w={speed:D,drive:L,raw:O,dv:B.dv,accel:B.accel,peak:ot,samples:V.length,windowS:t,busy:B.busy},m.update(E,M,b),_){T(V,R);const gt=B.dv>=0?"+":"";c.textContent=`v ${D.toFixed(2)} · 驱 ${L.toFixed(2)} · 峰 ${ot.toFixed(2)} · Δv ${gt}${B.dv.toFixed(3)} · ${V.length} 帧`}},setEnabled:g,toggle(){return g(!_),_},enabled:()=>_,last:()=>({...w}),samples:()=>S(performance.now()/1e3).map(E=>({...E}))}}const __=["剑盾","双剑","大剑","法杖","弓"],M_={idle:"待机",wander:"游走",follow:"跟随","keep-distance":"保持",attack:"攻击",spar:"陪练"};function b_(n){return{update(t,e,i,a,s,o,r=!1){const l=t.character,c=l.position,d=l.velocity,u=t.combat,h=t.events.length>0?t.events[t.events.length-1]:null,f=Ct=>Ct.toFixed(2),m=Ct=>(Ct*180/Math.PI).toFixed(0),_=__[na.indexOf(u.weapon)]??u.weapon,g=Math.round(u.charge*10),p="|".repeat(g)+".".repeat(10-g),v=t.dash,x=v.phase==="active"&&v.duration>0?(1-v.timer/v.duration)*100:0,y=v.phase==="active"?`${v.kind}@${x.toFixed(0)}%`:`${v.kind} cd${f(v.cooldown)}`,w=a.intents.aimActive?`(${f(a.intents.aimX)},${f(a.intents.aimZ)})`:"-",S=d.x*Math.sin(l.bodyYaw)+d.z*Math.cos(l.bodyYaw),T=d.x*Math.cos(l.bodyYaw)-d.z*Math.sin(l.bodyYaw),E=Math.abs(S)+Math.abs(T)+1e-6,M=Math.round(Math.abs(T)/E*100),b=`strafe ${M}%${S<-.05?" back":""}`,R=t.camera,k=`threat ${(R.threat*100).toFixed(0)}%  dist×${f(R.distanceScale)}  off (${f(R.offsetX)},${f(R.offsetZ)})  pitch +${f(R.pitchDelta)}°  n=${R.threatCount}`,C=o?f(o.attackBlend):"-",I=o==null?void 0:o.attackWeights,L=I?`gw ${f(I.gaitScale)}  lw ${f(I.attackLegWeight)}  spd ${f(I.driveSpeed)}`:"-",D=I?`${f(I.gaitScale)}/${f(I.attackLegWeight)}`:"-",O=o?`${o.landing.kind} ${f(o.landing.pulse)} t${f(o.landing.remaining)} vy${f(o.landing.impactVy)}`:"-",B=o?`${o.landing.kind}/${f(o.landing.pulse)}`:"-",V=(o==null?void 0:o.zoom)!==void 0?`zoom ×${f(o.zoom)}`:"-",ot=o==null?void 0:o.hurt,gt=ot?`hurt ${t.playerHurt.type}  部位h${f(ot.hitHeight)}  脉冲p${f(ot.pulse)}  上身${f(ot.upperShift)}  重心${f(ot.comShift)}  后坐${f(ot.pelvisBack)}  屈膝${f(ot.knee)}`:"-",vt=ot?`${f(ot.hitHeight)}/${f(ot.pulse)}/${f(ot.knee)}`:"-",It=o==null?void 0:o.ik,K=It?`${It.active?"on":"off"} w${f(It.weight)} e${f(It.maxError)}`:"-",it=t.playerLink,ct=`link ${it.kind||"-"}  ${it.phase}  prog ${f(it.progress)}  win ${f(it.linkWindow)}s  cd ${f(it.cooldown)}s  hits ${it.hitIds.length}  travel ${f(it.travelled)}/${f(it.travel)}m  id ${it.id}`,Z=`${it.phase}/${it.kind||"-"}/w${f(it.linkWindow)}`,J=a.lastGesture,lt=J?`${J.button} ${J.kind} ${J.heldMs.toFixed(0)}ms d${J.distance.toFixed(0)}px ${J.angleDeg.toFixed(0)}° taps${J.taps}`:"-",Ht=t.dummies.map(Ct=>`${Ct.id}:${M_[Ct.mode]}`).join("  ");if(r){n.textContent=`t${t.tick} ${e.toFixed(0)}fps · ${_} ${u.phase} · lk ${it.phase}${it.kind?`/${it.kind}`:""} w${f(it.linkWindow)} · hit ${t.hitCount}`;return}window.innerHeight>window.innerWidth?n.textContent=[`tick ${t.tick}  fps ${e.toFixed(0)}  steps ${i}`,`pos (${f(c.x)},${f(c.y)},${f(c.z)})  vel (${f(d.x)},${f(d.y)},${f(d.z)})`,`face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  st${M}%  stick(${f(a.stickX)},${f(a.stickY)}) ${a.source}  str${f(l.stride)}`,`weapon ${_}  ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}  dash ${y}  ab ${C}  gw/lw ${D}  land ${B}  ik ${K}`,`aim ${w}  target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m`:"无"}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  lay ${vt}`,`dummies ${Ht}  atkCount ${t.dummyAttackCount}  cam ${(R.threat*100).toFixed(0)}% ×${f(R.distanceScale)}  ${V}  lk ${Z}`,`event ${h?`${h.type} ${f(h.value)}`:"-"}  scale ${f(s.timeScale)}${s.paused?" [P]":""}  g ${lt}`].join(`
`):n.textContent=[`tick ${t.tick}   t ${f(t.time)}s   fps ${e.toFixed(0)}   steps ${i}`,`pos  (${f(c.x)}, ${f(c.y)}, ${f(c.z)})`,`vel  (${f(d.x)}, ${f(d.y)}, ${f(d.z)})`,`grounded ${l.grounded?"Y":"N"}   sprint ${l.sprinting?"Y":"N"}   facing ${m(l.facing)}deg   atkBlend ${C}   ${L}   land ${O}`,gt,`ik ${K}  clamped ${It?It.clamped:"-"}  (两骨 IK 足部锚定：骨盆被推走时脚仍踩在落点)`,`orient face ${m(l.facing)}  body ${m(l.bodyYaw)}  head ${m(l.headYaw)}  move ${m(l.moveYaw)}  (head-body ${m(l.headYaw-l.bodyYaw)})  ${b}`,`move (${f(a.intents.moveX)}, ${f(a.intents.moveZ)})  stick (${f(a.stickX)}, ${f(a.stickY)})  ${a.source}  aim ${w}`,`weapon ${_}  phase ${u.phase}  combo ${u.comboIndex}/3  atk ${f(u.attackProgress)}${u.phase==="settle"?" [停顿]":""}  chan ${t.abilities.channeling?"Y":"N"}  bolts ${t.abilities.projectiles.length}  rings ${t.abilities.rings.length}`,`dash  kind ${v.kind}  phase ${v.phase}  prog ${x.toFixed(0)}%  cd ${f(v.cooldown)}s  id ${v.id}  from (${f(v.fromX)},${f(v.fromZ)}) → to (${f(v.toX)},${f(v.toZ)})`,ct,`camera ${k}  ${V}`,`target ${t.targeting.hasTarget?`#${t.targeting.targetId} @${f(t.targeting.targetDist)}m  face ${m(t.targeting.targetYaw)}deg`:"无 (前方扇区内无敌人)"}   charge [${p}] ${(u.charge*100).toFixed(0)}%  charging ${u.charging?"Y":"N"}`,`dummies ${Ht}   atkCount ${t.dummyAttackCount}  hit ${t.hitCount}  hurt ${t.playerHurt.type}  impulse (${f(t.impulse.x)}, ${f(t.impulse.z)})`,`event ${h?`${h.type} ${f(h.value)}`:"-"}   scale ${f(s.timeScale)}${s.paused?" [PAUSED]":""}   gesture ${lt}`].join(`
`)}}}const Do=["lab","hud","motion","debug"],iu={lab:{short:"工位",full:"测试工位"},hud:{short:"状态",full:"状态读数"},motion:{short:"手感",full:"手感调试面板"},debug:{short:"调试",full:"调试面板"}},au={lab:{toggle:"lab-toggle",panel:"lab-panel"},hud:{toggle:"hud-toggle",panel:"hud"},motion:{toggle:"motiondbg-toggle",panel:"motiondbg"},debug:{toggle:"debug-toggle",panel:"debug-panel"}};function S_(n){var l;const t=Object.fromEntries(Do.map(c=>[c,document.getElementById(au[c].toggle)])),e=Object.fromEntries(Do.map(c=>[c,document.getElementById(au[c].panel)]));let i={},a=null;function s(){var c,d,u;for(const h of Do){const f=a===h,m=t[h],_=e[h];m&&(m.setAttribute("aria-expanded",String(f)),m.textContent=`${iu[h].short} ${f?"▾":"▸"}`,m.setAttribute("aria-label",`${f?"收起":"展开"}${iu[h].full}`)),_&&_.classList.toggle("is-open",f)}n.classList.toggle("is-compact",a!=="hud"),(c=i.motion)==null||c.setEnabled(a==="motion"),a==="debug"?(d=i.debug)==null||d.open():(u=i.debug)==null||u.close()}function o(c){a=a===c?null:c,s()}function r(){a!==null&&(a=null,s())}for(const c of Do)(l=t[c])==null||l.addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),o(c)});return window.addEventListener("keydown",c=>{c.key.toLowerCase()==="v"&&!c.metaKey&&!c.ctrlKey&&o("motion")}),s(),{hudCompact:()=>a!=="hud",register(c){i=c,s()},toggle:o,closeAll:r,isOpen:c=>a===c}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Rh="170",w_=0,su=1,E_=2,vp=1,yp=2,Di=3,ia=0,zn=1,Qe=2,Qi=0,fs=1,ki=2,ou=3,ru=4,T_=5,_a=100,A_=101,R_=102,P_=103,C_=104,L_=200,D_=201,k_=202,I_=203,El=204,Tl=205,z_=206,F_=207,U_=208,N_=209,O_=210,B_=211,H_=212,G_=213,X_=214,Al=0,Rl=1,Pl=2,Ms=3,Cl=4,Ll=5,Dl=6,kl=7,Ph=0,V_=1,W_=2,ta=0,Y_=1,$_=2,Z_=3,j_=4,q_=5,K_=6,J_=7,_p=300,bs=301,Ss=302,Il=303,zl=304,Wr=306,Fl=1e3,ba=1001,Ul=1002,Yn=1003,Q_=1004,ko=1005,vi=1006,wc=1007,Sa=1008,Ui=1009,Mp=1010,bp=1011,po=1012,Ch=1013,Ta=1014,yi=1015,Mo=1016,Lh=1017,Dh=1018,ws=1020,Sp=35902,wp=1021,Ep=1022,ri=1023,Tp=1024,Ap=1025,ps=1026,Es=1027,kh=1028,Ih=1029,Rp=1030,zh=1031,Fh=1033,pr=33776,mr=33777,gr=33778,xr=33779,Nl=35840,Ol=35841,Bl=35842,Hl=35843,Gl=36196,Xl=37492,Vl=37496,Wl=37808,Yl=37809,$l=37810,Zl=37811,jl=37812,ql=37813,Kl=37814,Jl=37815,Ql=37816,th=37817,eh=37818,nh=37819,ih=37820,ah=37821,vr=36492,sh=36494,oh=36495,Pp=36283,rh=36284,ch=36285,lh=36286,tM=3200,eM=3201,Cp=0,nM=1,Zi="",Dn="srgb",As="srgb-linear",Yr="linear",Ne="srgb",Xa=7680,cu=519,iM=512,aM=513,sM=514,Lp=515,oM=516,rM=517,cM=518,lM=519,hh=35044,to=35048,lu="300 es",zi=2e3,kr=2001;class Rs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const a=this._listeners[t];if(a!==void 0){const s=a.indexOf(e);s!==-1&&a.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const a=i.slice(0);for(let s=0,o=a.length;s<o;s++)a[s].call(this,t);t.target=null}}}const _n=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hu=1234567;const ms=Math.PI/180,mo=180/Math.PI;function Mi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_n[n&255]+_n[n>>8&255]+_n[n>>16&255]+_n[n>>24&255]+"-"+_n[t&255]+_n[t>>8&255]+"-"+_n[t>>16&15|64]+_n[t>>24&255]+"-"+_n[e&63|128]+_n[e>>8&255]+"-"+_n[e>>16&255]+_n[e>>24&255]+_n[i&255]+_n[i>>8&255]+_n[i>>16&255]+_n[i>>24&255]).toLowerCase()}function xn(n,t,e){return Math.max(t,Math.min(e,n))}function Uh(n,t){return(n%t+t)%t}function hM(n,t,e,i,a){return i+(n-t)*(a-i)/(e-t)}function dM(n,t,e){return n!==t?(e-n)/(t-n):0}function eo(n,t,e){return(1-e)*n+e*t}function uM(n,t,e,i){return eo(n,t,1-Math.exp(-e*i))}function fM(n,t=1){return t-Math.abs(Uh(n,t*2)-t)}function pM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function mM(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function gM(n,t){return n+Math.floor(Math.random()*(t-n+1))}function xM(n,t){return n+Math.random()*(t-n)}function vM(n){return n*(.5-Math.random())}function yM(n){n!==void 0&&(hu=n);let t=hu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function _M(n){return n*ms}function MM(n){return n*mo}function bM(n){return(n&n-1)===0&&n!==0}function SM(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function wM(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function EM(n,t,e,i,a){const s=Math.cos,o=Math.sin,r=s(e/2),l=o(e/2),c=s((t+i)/2),d=o((t+i)/2),u=s((t-i)/2),h=o((t-i)/2),f=s((i-t)/2),m=o((i-t)/2);switch(a){case"XYX":n.set(r*d,l*u,l*h,r*c);break;case"YZY":n.set(l*h,r*d,l*u,r*c);break;case"ZXZ":n.set(l*u,l*h,r*d,r*c);break;case"XZX":n.set(r*d,l*m,l*f,r*c);break;case"YXY":n.set(l*f,r*d,l*m,r*c);break;case"ZYZ":n.set(l*m,l*f,r*d,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function oi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ze(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const du={DEG2RAD:ms,RAD2DEG:mo,generateUUID:Mi,clamp:xn,euclideanModulo:Uh,mapLinear:hM,inverseLerp:dM,lerp:eo,damp:uM,pingpong:fM,smoothstep:pM,smootherstep:mM,randInt:gM,randFloat:xM,randFloatSpread:vM,seededRandom:yM,degToRad:_M,radToDeg:MM,isPowerOfTwo:bM,ceilPowerOfTwo:SM,floorPowerOfTwo:wM,setQuaternionFromProperEuler:EM,normalize:ze,denormalize:oi};class Yt{constructor(t=0,e=0){Yt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,a=t.elements;return this.x=a[0]*e+a[3]*i+a[6],this.y=a[1]*e+a[4]*i+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(xn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),a=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*a+t.x,this.y=s*a+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class me{constructor(t,e,i,a,s,o,r,l,c){me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c)}set(t,e,i,a,s,o,r,l,c){const d=this.elements;return d[0]=t,d[1]=a,d[2]=r,d[3]=e,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],f=i[5],m=i[8],_=a[0],g=a[3],p=a[6],v=a[1],x=a[4],y=a[7],w=a[2],S=a[5],T=a[8];return s[0]=o*_+r*v+l*w,s[3]=o*g+r*x+l*S,s[6]=o*p+r*y+l*T,s[1]=c*_+d*v+u*w,s[4]=c*g+d*x+u*S,s[7]=c*p+d*y+u*T,s[2]=h*_+f*v+m*w,s[5]=h*g+f*x+m*S,s[8]=h*p+f*y+m*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],d=t[8];return e*o*d-e*r*c-i*s*d+i*r*l+a*s*c-a*o*l}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],d=t[8],u=d*o-r*c,h=r*l-d*s,f=c*s-o*l,m=e*u+i*h+a*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return t[0]=u*_,t[1]=(a*c-d*i)*_,t[2]=(r*i-a*o)*_,t[3]=h*_,t[4]=(d*e-a*l)*_,t[5]=(a*s-r*e)*_,t[6]=f*_,t[7]=(i*l-c*e)*_,t[8]=(o*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,a,s,o,r){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*r)+o+t,-a*c,a*l,-a*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Ec.makeScale(t,e)),this}rotate(t){return this.premultiply(Ec.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ec.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<9;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ec=new me;function Dp(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ir(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function TM(){const n=Ir("canvas");return n.style.display="block",n}const uu={};function js(n){n in uu||(uu[n]=!0,console.warn(n))}function AM(n,t,e){return new Promise(function(i,a){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:a();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}function RM(n){const t=n.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function PM(n){const t=n.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ae={enabled:!0,workingColorSpace:As,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Ne&&(n.r=Fi(n.r),n.g=Fi(n.g),n.b=Fi(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Ne&&(n.r=gs(n.r),n.g=gs(n.g),n.b=gs(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Zi?Yr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Fi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function gs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const fu=[.64,.33,.3,.6,.15,.06],pu=[.2126,.7152,.0722],mu=[.3127,.329],gu=new me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xu=new me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ae.define({[As]:{primaries:fu,whitePoint:mu,transfer:Yr,toXYZ:gu,fromXYZ:xu,luminanceCoefficients:pu,workingColorSpaceConfig:{unpackColorSpace:Dn},outputColorSpaceConfig:{drawingBufferColorSpace:Dn}},[Dn]:{primaries:fu,whitePoint:mu,transfer:Ne,toXYZ:gu,fromXYZ:xu,luminanceCoefficients:pu,outputColorSpaceConfig:{drawingBufferColorSpace:Dn}}});let Va;class CM{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Va===void 0&&(Va=Ir("canvas")),Va.width=t.width,Va.height=t.height;const i=Va.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Va}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ir("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const a=i.getImageData(0,0,t.width,t.height),s=a.data;for(let o=0;o<s.length;o++)s[o]=Fi(s[o]/255)*255;return i.putImageData(a,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Fi(e[i]/255)*255):e[i]=Fi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let LM=0;class kp{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:LM++}),this.uuid=Mi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},a=this.data;if(a!==null){let s;if(Array.isArray(a)){s=[];for(let o=0,r=a.length;o<r;o++)a[o].isDataTexture?s.push(Tc(a[o].image)):s.push(Tc(a[o]))}else s=Tc(a);i.url=s}return e||(t.images[this.uuid]=i),i}}function Tc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?CM.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let DM=0;class Sn extends Rs{constructor(t=Sn.DEFAULT_IMAGE,e=Sn.DEFAULT_MAPPING,i=ba,a=ba,s=vi,o=Sa,r=ri,l=Ui,c=Sn.DEFAULT_ANISOTROPY,d=Zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:DM++}),this.uuid=Mi(),this.name="",this.source=new kp(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Yt(0,0),this.repeat=new Yt(1,1),this.center=new Yt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_p)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fl:t.x=t.x-Math.floor(t.x);break;case ba:t.x=t.x<0?0:1;break;case Ul:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fl:t.y=t.y-Math.floor(t.y);break;case ba:t.y=t.y<0?0:1;break;case Ul:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Sn.DEFAULT_IMAGE=null;Sn.DEFAULT_MAPPING=_p;Sn.DEFAULT_ANISOTROPY=1;class tn{constructor(t=0,e=0,i=0,a=1){tn.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,a){return this.x=t,this.y=e,this.z=i,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*a+o[12]*s,this.y=o[1]*e+o[5]*i+o[9]*a+o[13]*s,this.z=o[2]*e+o[6]*i+o[10]*a+o[14]*s,this.w=o[3]*e+o[7]*i+o[11]*a+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,a,s;const l=t.elements,c=l[0],d=l[4],u=l[8],h=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(f+1)/2,w=(p+1)/2,S=(d+h)/4,T=(u+_)/4,E=(m+g)/4;return x>y&&x>w?x<.01?(i=0,a=.707106781,s=.707106781):(i=Math.sqrt(x),a=S/i,s=T/i):y>w?y<.01?(i=.707106781,a=0,s=.707106781):(a=Math.sqrt(y),i=S/a,s=E/a):w<.01?(i=.707106781,a=.707106781,s=0):(s=Math.sqrt(w),i=T/s,a=E/s),this.set(i,a,s,e),this}let v=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-_)/v,this.z=(h-d)/v,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kM extends Rs{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new tn(0,0,t,e),this.scissorTest=!1,this.viewport=new tn(0,0,t,e);const a={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Sn(a,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let r=0;r<o;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let a=0,s=this.textures.length;a<s;a++)this.textures[a].image.width=t,this.textures[a].image.height=e,this.textures[a].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,a=t.textures.length;i<a;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new kp(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Aa extends kM{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ip extends Sn{constructor(t=null,e=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Yn,this.minFilter=Yn,this.wrapR=ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class IM extends Sn{constructor(t=null,e=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:a},this.magFilter=Yn,this.minFilter=Yn,this.wrapR=ba,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ea{constructor(t=0,e=0,i=0,a=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=a}static slerpFlat(t,e,i,a,s,o,r){let l=i[a+0],c=i[a+1],d=i[a+2],u=i[a+3];const h=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=d,t[e+3]=u;return}if(r===1){t[e+0]=h,t[e+1]=f,t[e+2]=m,t[e+3]=_;return}if(u!==_||l!==h||c!==f||d!==m){let g=1-r;const p=l*h+c*f+d*m+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),S=Math.atan2(w,p*v);g=Math.sin(g*S)/w,r=Math.sin(r*S)/w}const y=r*v;if(l=l*g+h*y,c=c*g+f*y,d=d*g+m*y,u=u*g+_*y,g===1-r){const w=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=w,c*=w,d*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,a,s,o){const r=i[a],l=i[a+1],c=i[a+2],d=i[a+3],u=s[o],h=s[o+1],f=s[o+2],m=s[o+3];return t[e]=r*m+d*u+l*f-c*h,t[e+1]=l*m+d*h+c*u-r*f,t[e+2]=c*m+d*f+r*h-l*u,t[e+3]=d*m-r*u-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,a){return this._x=t,this._y=e,this._z=i,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,a=t._y,s=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(i/2),d=r(a/2),u=r(s/2),h=l(i/2),f=l(a/2),m=l(s/2);switch(o){case"XYZ":this._x=h*d*u+c*f*m,this._y=c*f*u-h*d*m,this._z=c*d*m+h*f*u,this._w=c*d*u-h*f*m;break;case"YXZ":this._x=h*d*u+c*f*m,this._y=c*f*u-h*d*m,this._z=c*d*m-h*f*u,this._w=c*d*u+h*f*m;break;case"ZXY":this._x=h*d*u-c*f*m,this._y=c*f*u+h*d*m,this._z=c*d*m+h*f*u,this._w=c*d*u-h*f*m;break;case"ZYX":this._x=h*d*u-c*f*m,this._y=c*f*u+h*d*m,this._z=c*d*m-h*f*u,this._w=c*d*u+h*f*m;break;case"YZX":this._x=h*d*u+c*f*m,this._y=c*f*u+h*d*m,this._z=c*d*m-h*f*u,this._w=c*d*u-h*f*m;break;case"XZY":this._x=h*d*u-c*f*m,this._y=c*f*u-h*d*m,this._z=c*d*m+h*f*u,this._w=c*d*u+h*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,a=Math.sin(i);return this._x=t.x*a,this._y=t.y*a,this._z=t.z*a,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],a=e[4],s=e[8],o=e[1],r=e[5],l=e[9],c=e[2],d=e[6],u=e[10],h=i+r+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-l)*f,this._y=(s-c)*f,this._z=(o-a)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(d-l)/f,this._x=.25*f,this._y=(a+o)/f,this._z=(s+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(s-c)/f,this._x=(a+o)/f,this._y=.25*f,this._z=(l+d)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(o-a)/f,this._x=(s+c)/f,this._y=(l+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const a=Math.min(1,e/i);return this.slerp(t,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,a=t._y,s=t._z,o=t._w,r=e._x,l=e._y,c=e._z,d=e._w;return this._x=i*d+o*r+a*c-s*l,this._y=a*d+o*l+s*r-i*c,this._z=s*d+o*c+i*l-a*r,this._w=o*d-i*r-a*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,a=this._y,s=this._z,o=this._w;let r=o*t._w+i*t._x+a*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=i,this._y=a,this._z=s,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*i+e*this._x,this._y=f*a+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,r),u=Math.sin((1-e)*d)/c,h=Math.sin(e*d)/c;return this._w=o*u+this._w*h,this._x=i*u+this._x*h,this._y=a*u+this._y*h,this._z=s*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),a=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(a*Math.sin(t),a*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,i=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(vu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(vu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*a,this.y=s[1]*e+s[4]*i+s[7]*a,this.z=s[2]*e+s[5]*i+s[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,a=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*a+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*a+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*a+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*a+s[14])*o,this}applyQuaternion(t){const e=this.x,i=this.y,a=this.z,s=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*a-r*i),d=2*(r*e-s*a),u=2*(s*i-o*e);return this.x=e+l*c+o*u-r*d,this.y=i+l*d+r*c-s*u,this.z=a+l*u+s*d-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,a=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*a,this.y=s[1]*e+s[5]*i+s[9]*a,this.z=s[2]*e+s[6]*i+s[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,a=t.y,s=t.z,o=e.x,r=e.y,l=e.z;return this.x=a*l-s*r,this.y=s*o-i*l,this.z=i*r-a*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ac.copy(this).projectOnVector(t),this.sub(Ac)}reflect(t){return this.sub(Ac.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(xn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,a=this.z-t.z;return e*e+i*i+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const a=Math.sin(e)*t;return this.x=a*Math.sin(i),this.y=Math.cos(e)*t,this.z=a*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=a,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ac=new X,vu=new ea;class Ca{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=s.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ii):ii.fromBufferAttribute(s,o),ii.applyMatrix4(t.matrixWorld),this.expandByPoint(ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Io.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Io.copy(i.boundingBox)),Io.applyMatrix4(t.matrixWorld),this.union(Io)}const a=t.children;for(let s=0,o=a.length;s<o;s++)this.expandByObject(a[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ii),ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Os),zo.subVectors(this.max,Os),Wa.subVectors(t.a,Os),Ya.subVectors(t.b,Os),$a.subVectors(t.c,Os),Hi.subVectors(Ya,Wa),Gi.subVectors($a,Ya),ca.subVectors(Wa,$a);let e=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-ca.z,ca.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,ca.z,0,-ca.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-ca.y,ca.x,0];return!Rc(e,Wa,Ya,$a,zo)||(e=[1,0,0,0,1,0,0,0,1],!Rc(e,Wa,Ya,$a,zo))?!1:(Fo.crossVectors(Hi,Gi),e=[Fo.x,Fo.y,Fo.z],Rc(e,Wa,Ya,$a,zo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ti),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Ti=[new X,new X,new X,new X,new X,new X,new X,new X],ii=new X,Io=new Ca,Wa=new X,Ya=new X,$a=new X,Hi=new X,Gi=new X,ca=new X,Os=new X,zo=new X,Fo=new X,la=new X;function Rc(n,t,e,i,a){for(let s=0,o=n.length-3;s<=o;s+=3){la.fromArray(n,s);const r=a.x*Math.abs(la.x)+a.y*Math.abs(la.y)+a.z*Math.abs(la.z),l=t.dot(la),c=e.dot(la),d=i.dot(la);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>r)return!1}return!0}const zM=new Ca,Bs=new X,Pc=new X;class Ps{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):zM.setFromPoints(t).getCenter(i);let a=0;for(let s=0,o=t.length;s<o;s++)a=Math.max(a,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(a),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Bs.subVectors(t,this.center);const e=Bs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),a=(i-this.radius)*.5;this.center.addScaledVector(Bs,a/i),this.radius+=a}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Pc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Bs.copy(t.center).add(Pc)),this.expandByPoint(Bs.copy(t.center).sub(Pc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ai=new X,Cc=new X,Uo=new X,Xi=new X,Lc=new X,No=new X,Dc=new X;class Nh{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ai.copy(this.origin).addScaledVector(this.direction,e),Ai.distanceToSquared(t))}distanceSqToSegment(t,e,i,a){Cc.copy(t).add(e).multiplyScalar(.5),Uo.copy(e).sub(t).normalize(),Xi.copy(this.origin).sub(Cc);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Uo),r=Xi.dot(this.direction),l=-Xi.dot(Uo),c=Xi.lengthSq(),d=Math.abs(1-o*o);let u,h,f,m;if(d>0)if(u=o*l-r,h=o*r-l,m=s*d,u>=0)if(h>=-m)if(h<=m){const _=1/d;u*=_,h*=_,f=u*(u+o*h+2*r)+h*(o*u+h+2*l)+c}else h=s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*l)+c;else h<=-m?(u=Math.max(0,-(-o*s+r)),h=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c):h<=m?(u=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(u=Math.max(0,-(o*s+r)),h=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c);else h=o>0?-s:s,u=Math.max(0,-(o*h+r)),f=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(Cc).addScaledVector(Uo,h),f}intersectSphere(t,e){Ai.subVectors(t.center,this.origin);const i=Ai.dot(this.direction),a=Ai.dot(Ai)-i*i,s=t.radius*t.radius;if(a>s)return null;const o=Math.sqrt(s-a),r=i-o,l=i+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,a,s,o,r,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(t.min.x-h.x)*c,a=(t.max.x-h.x)*c):(i=(t.max.x-h.x)*c,a=(t.min.x-h.x)*c),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),i>o||s>a||((s>i||isNaN(i))&&(i=s),(o<a||isNaN(a))&&(a=o),u>=0?(r=(t.min.z-h.z)*u,l=(t.max.z-h.z)*u):(r=(t.max.z-h.z)*u,l=(t.min.z-h.z)*u),i>l||r>a)||((r>i||i!==i)&&(i=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(i>=0?i:a,e)}intersectsBox(t){return this.intersectBox(t,Ai)!==null}intersectTriangle(t,e,i,a,s){Lc.subVectors(e,t),No.subVectors(i,t),Dc.crossVectors(Lc,No);let o=this.direction.dot(Dc),r;if(o>0){if(a)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Xi.subVectors(this.origin,t);const l=r*this.direction.dot(No.crossVectors(Xi,No));if(l<0)return null;const c=r*this.direction.dot(Lc.cross(Xi));if(c<0||l+c>o)return null;const d=-r*Xi.dot(Dc);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pe{constructor(t,e,i,a,s,o,r,l,c,d,u,h,f,m,_,g){Pe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,a,s,o,r,l,c,d,u,h,f,m,_,g)}set(t,e,i,a,s,o,r,l,c,d,u,h,f,m,_,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=a,p[1]=s,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pe().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,a=1/Za.setFromMatrixColumn(t,0).length(),s=1/Za.setFromMatrixColumn(t,1).length(),o=1/Za.setFromMatrixColumn(t,2).length();return e[0]=i[0]*a,e[1]=i[1]*a,e[2]=i[2]*a,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,a=t.y,s=t.z,o=Math.cos(i),r=Math.sin(i),l=Math.cos(a),c=Math.sin(a),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,m=r*d,_=r*u;e[0]=l*d,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=h-_*c,e[9]=-r*l,e[2]=_-h*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){const h=l*d,f=l*u,m=c*d,_=c*u;e[0]=h+_*r,e[4]=m*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*d,e[9]=-r,e[2]=f*r-m,e[6]=_+h*r,e[10]=o*l}else if(t.order==="ZXY"){const h=l*d,f=l*u,m=c*d,_=c*u;e[0]=h-_*r,e[4]=-o*u,e[8]=m+f*r,e[1]=f+m*r,e[5]=o*d,e[9]=_-h*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const h=o*d,f=o*u,m=r*d,_=r*u;e[0]=l*d,e[4]=m*c-f,e[8]=h*c+_,e[1]=l*u,e[5]=_*c+h,e[9]=f*c-m,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const h=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*d,e[4]=_-h*u,e[8]=m*u+f,e[1]=u,e[5]=o*d,e[9]=-r*d,e[2]=-c*d,e[6]=f*u+m,e[10]=h-_*u}else if(t.order==="XZY"){const h=o*l,f=o*c,m=r*l,_=r*c;e[0]=l*d,e[4]=-u,e[8]=c*d,e[1]=h*u+_,e[5]=o*d,e[9]=f*u-m,e[2]=m*u-f,e[6]=r*d,e[10]=_*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(FM,t,UM)}lookAt(t,e,i){const a=this.elements;return Hn.subVectors(t,e),Hn.lengthSq()===0&&(Hn.z=1),Hn.normalize(),Vi.crossVectors(i,Hn),Vi.lengthSq()===0&&(Math.abs(i.z)===1?Hn.x+=1e-4:Hn.z+=1e-4,Hn.normalize(),Vi.crossVectors(i,Hn)),Vi.normalize(),Oo.crossVectors(Hn,Vi),a[0]=Vi.x,a[4]=Oo.x,a[8]=Hn.x,a[1]=Vi.y,a[5]=Oo.y,a[9]=Hn.y,a[2]=Vi.z,a[6]=Oo.z,a[10]=Hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,a=e.elements,s=this.elements,o=i[0],r=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],v=i[3],x=i[7],y=i[11],w=i[15],S=a[0],T=a[4],E=a[8],M=a[12],b=a[1],R=a[5],k=a[9],C=a[13],I=a[2],L=a[6],D=a[10],O=a[14],B=a[3],V=a[7],ot=a[11],gt=a[15];return s[0]=o*S+r*b+l*I+c*B,s[4]=o*T+r*R+l*L+c*V,s[8]=o*E+r*k+l*D+c*ot,s[12]=o*M+r*C+l*O+c*gt,s[1]=d*S+u*b+h*I+f*B,s[5]=d*T+u*R+h*L+f*V,s[9]=d*E+u*k+h*D+f*ot,s[13]=d*M+u*C+h*O+f*gt,s[2]=m*S+_*b+g*I+p*B,s[6]=m*T+_*R+g*L+p*V,s[10]=m*E+_*k+g*D+p*ot,s[14]=m*M+_*C+g*O+p*gt,s[3]=v*S+x*b+y*I+w*B,s[7]=v*T+x*R+y*L+w*V,s[11]=v*E+x*k+y*D+w*ot,s[15]=v*M+x*C+y*O+w*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],a=t[8],s=t[12],o=t[1],r=t[5],l=t[9],c=t[13],d=t[2],u=t[6],h=t[10],f=t[14],m=t[3],_=t[7],g=t[11],p=t[15];return m*(+s*l*u-a*c*u-s*r*h+i*c*h+a*r*f-i*l*f)+_*(+e*l*f-e*c*h+s*o*h-a*o*f+a*c*d-s*l*d)+g*(+e*c*u-e*r*f-s*o*u+i*o*f+s*r*d-i*c*d)+p*(-a*r*d-e*l*u+e*r*h+a*o*u-i*o*h+i*l*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=e,a[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],a=t[2],s=t[3],o=t[4],r=t[5],l=t[6],c=t[7],d=t[8],u=t[9],h=t[10],f=t[11],m=t[12],_=t[13],g=t[14],p=t[15],v=u*g*c-_*h*c+_*l*f-r*g*f-u*l*p+r*h*p,x=m*h*c-d*g*c-m*l*f+o*g*f+d*l*p-o*h*p,y=d*_*c-m*u*c+m*r*f-o*_*f-d*r*p+o*u*p,w=m*u*l-d*_*l-m*r*h+o*_*h+d*r*g-o*u*g,S=e*v+i*x+a*y+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/S;return t[0]=v*T,t[1]=(_*h*s-u*g*s-_*a*f+i*g*f+u*a*p-i*h*p)*T,t[2]=(r*g*s-_*l*s+_*a*c-i*g*c-r*a*p+i*l*p)*T,t[3]=(u*l*s-r*h*s-u*a*c+i*h*c+r*a*f-i*l*f)*T,t[4]=x*T,t[5]=(d*g*s-m*h*s+m*a*f-e*g*f-d*a*p+e*h*p)*T,t[6]=(m*l*s-o*g*s-m*a*c+e*g*c+o*a*p-e*l*p)*T,t[7]=(o*h*s-d*l*s+d*a*c-e*h*c-o*a*f+e*l*f)*T,t[8]=y*T,t[9]=(m*u*s-d*_*s-m*i*f+e*_*f+d*i*p-e*u*p)*T,t[10]=(o*_*s-m*r*s+m*i*c-e*_*c-o*i*p+e*r*p)*T,t[11]=(d*r*s-o*u*s-d*i*c+e*u*c+o*i*f-e*r*f)*T,t[12]=w*T,t[13]=(d*_*a-m*u*a+m*i*h-e*_*h-d*i*g+e*u*g)*T,t[14]=(m*r*a-o*_*a-m*i*l+e*_*l+o*i*g-e*r*g)*T,t[15]=(o*u*a-d*r*a+d*i*l-e*u*l-o*i*h+e*r*h)*T,this}scale(t){const e=this.elements,i=t.x,a=t.y,s=t.z;return e[0]*=i,e[4]*=a,e[8]*=s,e[1]*=i,e[5]*=a,e[9]*=s,e[2]*=i,e[6]*=a,e[10]*=s,e[3]*=i,e[7]*=a,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,a))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),a=Math.sin(e),s=1-i,o=t.x,r=t.y,l=t.z,c=s*o,d=s*r;return this.set(c*o+i,c*r-a*l,c*l+a*r,0,c*r+a*l,d*r+i,d*l-a*o,0,c*l-a*r,d*l+a*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,a,s,o){return this.set(1,i,s,0,t,1,o,0,e,a,1,0,0,0,0,1),this}compose(t,e,i){const a=this.elements,s=e._x,o=e._y,r=e._z,l=e._w,c=s+s,d=o+o,u=r+r,h=s*c,f=s*d,m=s*u,_=o*d,g=o*u,p=r*u,v=l*c,x=l*d,y=l*u,w=i.x,S=i.y,T=i.z;return a[0]=(1-(_+p))*w,a[1]=(f+y)*w,a[2]=(m-x)*w,a[3]=0,a[4]=(f-y)*S,a[5]=(1-(h+p))*S,a[6]=(g+v)*S,a[7]=0,a[8]=(m+x)*T,a[9]=(g-v)*T,a[10]=(1-(h+_))*T,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,e,i){const a=this.elements;let s=Za.set(a[0],a[1],a[2]).length();const o=Za.set(a[4],a[5],a[6]).length(),r=Za.set(a[8],a[9],a[10]).length();this.determinant()<0&&(s=-s),t.x=a[12],t.y=a[13],t.z=a[14],ai.copy(this);const c=1/s,d=1/o,u=1/r;return ai.elements[0]*=c,ai.elements[1]*=c,ai.elements[2]*=c,ai.elements[4]*=d,ai.elements[5]*=d,ai.elements[6]*=d,ai.elements[8]*=u,ai.elements[9]*=u,ai.elements[10]*=u,e.setFromRotationMatrix(ai),i.x=s,i.y=o,i.z=r,this}makePerspective(t,e,i,a,s,o,r=zi){const l=this.elements,c=2*s/(e-t),d=2*s/(i-a),u=(e+t)/(e-t),h=(i+a)/(i-a);let f,m;if(r===zi)f=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(r===kr)f=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,a,s,o,r=zi){const l=this.elements,c=1/(e-t),d=1/(i-a),u=1/(o-s),h=(e+t)*c,f=(i+a)*d;let m,_;if(r===zi)m=(o+s)*u,_=-2*u;else if(r===kr)m=s*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let a=0;a<16;a++)if(e[a]!==i[a])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Za=new X,ai=new Pe,FM=new X(0,0,0),UM=new X(1,1,1),Vi=new X,Oo=new X,Hn=new X,yu=new Pe,_u=new ea;class bi{constructor(t=0,e=0,i=0,a=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,a=this._order){return this._x=t,this._y=e,this._z=i,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const a=t.elements,s=a[0],o=a[4],r=a[8],l=a[1],c=a[5],d=a[9],u=a[2],h=a[6],f=a[10];switch(e){case"XYZ":this._y=Math.asin(xn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(xn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-xn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(xn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-xn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return yu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _u.setFromEuler(this),this.setFromQuaternion(_u,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class Oh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let NM=0;const Mu=new X,ja=new ea,Ri=new Pe,Bo=new X,Hs=new X,OM=new X,BM=new ea,bu=new X(1,0,0),Su=new X(0,1,0),wu=new X(0,0,1),Eu={type:"added"},HM={type:"removed"},qa={type:"childadded",child:null},kc={type:"childremoved",child:null};class je extends Rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:NM++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=je.DEFAULT_UP.clone();const t=new X,e=new bi,i=new ea,a=new X(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Pe},normalMatrix:{value:new me}}),this.matrix=new Pe,this.matrixWorld=new Pe,this.matrixAutoUpdate=je.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ja.setFromAxisAngle(t,e),this.quaternion.multiply(ja),this}rotateOnWorldAxis(t,e){return ja.setFromAxisAngle(t,e),this.quaternion.premultiply(ja),this}rotateX(t){return this.rotateOnAxis(bu,t)}rotateY(t){return this.rotateOnAxis(Su,t)}rotateZ(t){return this.rotateOnAxis(wu,t)}translateOnAxis(t,e){return Mu.copy(t).applyQuaternion(this.quaternion),this.position.add(Mu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bu,t)}translateY(t){return this.translateOnAxis(Su,t)}translateZ(t){return this.translateOnAxis(wu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ri.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Bo.copy(t):Bo.set(t,e,i);const a=this.parent;this.updateWorldMatrix(!0,!1),Hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ri.lookAt(Hs,Bo,this.up):Ri.lookAt(Bo,Hs,this.up),this.quaternion.setFromRotationMatrix(Ri),a&&(Ri.extractRotation(a.matrixWorld),ja.setFromRotationMatrix(Ri),this.quaternion.premultiply(ja.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Eu),qa.child=t,this.dispatchEvent(qa),qa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(HM),kc.child=t,this.dispatchEvent(kc),kc.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ri.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ri.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ri),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Eu),qa.child=t,this.dispatchEvent(qa),qa.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,a=this.children.length;i<a;i++){const o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,t,OM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hs,BM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,a=e.length;i<a;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const a=this.children;for(let s=0,o=a.length;s<o;s++)a[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function s(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(s(t.materials,this.material[l]));a.material=r}else a.material=s(t.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(s(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),m=o(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=a,i;function o(r){const l=[];for(const c in r){const d=r[c];delete d.metadata,l.push(d)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const a=t.children[i];this.add(a.clone())}return this}}je.DEFAULT_UP=new X(0,1,0);je.DEFAULT_MATRIX_AUTO_UPDATE=!0;je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new X,Pi=new X,Ic=new X,Ci=new X,Ka=new X,Ja=new X,Tu=new X,zc=new X,Fc=new X,Uc=new X,Nc=new tn,Oc=new tn,Bc=new tn;class Wn{constructor(t=new X,e=new X,i=new X){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,a){a.subVectors(i,e),si.subVectors(t,e),a.cross(si);const s=a.lengthSq();return s>0?a.multiplyScalar(1/Math.sqrt(s)):a.set(0,0,0)}static getBarycoord(t,e,i,a,s){si.subVectors(a,e),Pi.subVectors(i,e),Ic.subVectors(t,e);const o=si.dot(si),r=si.dot(Pi),l=si.dot(Ic),c=Pi.dot(Pi),d=Pi.dot(Ic),u=o*c-r*r;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(c*l-r*d)*h,m=(o*d-r*l)*h;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,a){return this.getBarycoord(t,e,i,a,Ci)===null?!1:Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(t,e,i,a,s,o,r,l){return this.getBarycoord(t,e,i,a,Ci)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ci.x),l.addScaledVector(o,Ci.y),l.addScaledVector(r,Ci.z),l)}static getInterpolatedAttribute(t,e,i,a,s,o){return Nc.setScalar(0),Oc.setScalar(0),Bc.setScalar(0),Nc.fromBufferAttribute(t,e),Oc.fromBufferAttribute(t,i),Bc.fromBufferAttribute(t,a),o.setScalar(0),o.addScaledVector(Nc,s.x),o.addScaledVector(Oc,s.y),o.addScaledVector(Bc,s.z),o}static isFrontFacing(t,e,i,a){return si.subVectors(i,e),Pi.subVectors(t,e),si.cross(Pi).dot(a)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,a){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,e,i,a){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return si.subVectors(this.c,this.b),Pi.subVectors(this.a,this.b),si.cross(Pi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,a,s){return Wn.getInterpolation(t,this.a,this.b,this.c,e,i,a,s)}containsPoint(t){return Wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,a=this.b,s=this.c;let o,r;Ka.subVectors(a,i),Ja.subVectors(s,i),zc.subVectors(t,i);const l=Ka.dot(zc),c=Ja.dot(zc);if(l<=0&&c<=0)return e.copy(i);Fc.subVectors(t,a);const d=Ka.dot(Fc),u=Ja.dot(Fc);if(d>=0&&u<=d)return e.copy(a);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return o=l/(l-d),e.copy(i).addScaledVector(Ka,o);Uc.subVectors(t,s);const f=Ka.dot(Uc),m=Ja.dot(Uc);if(m>=0&&f<=m)return e.copy(s);const _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return r=c/(c-m),e.copy(i).addScaledVector(Ja,r);const g=d*m-f*u;if(g<=0&&u-d>=0&&f-m>=0)return Tu.subVectors(s,a),r=(u-d)/(u-d+(f-m)),e.copy(a).addScaledVector(Tu,r);const p=1/(g+_+h);return o=_*p,r=h*p,e.copy(i).addScaledVector(Ka,o).addScaledVector(Ja,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const zp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wi={h:0,s:0,l:0},Ho={h:0,s:0,l:0};function Hc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ie{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const a=t;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ae.toWorkingColorSpace(this,e),this}setRGB(t,e,i,a=Ae.workingColorSpace){return this.r=t,this.g=e,this.b=i,Ae.toWorkingColorSpace(this,a),this}setHSL(t,e,i,a=Ae.workingColorSpace){if(t=Uh(t,1),e=xn(e,0,1),i=xn(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=Hc(o,s,t+1/3),this.g=Hc(o,s,t),this.b=Hc(o,s,t-1/3)}return Ae.toWorkingColorSpace(this,a),this}setStyle(t,e=Dn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=a[1],r=a[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=a[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Dn){const i=zp[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=gs(t.r),this.g=gs(t.g),this.b=gs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Dn){return Ae.fromWorkingColorSpace(Mn.copy(this),t),Math.round(xn(Mn.r*255,0,255))*65536+Math.round(xn(Mn.g*255,0,255))*256+Math.round(xn(Mn.b*255,0,255))}getHexString(t=Dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ae.workingColorSpace){Ae.fromWorkingColorSpace(Mn.copy(this),e);const i=Mn.r,a=Mn.g,s=Mn.b,o=Math.max(i,a,s),r=Math.min(i,a,s);let l,c;const d=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=d<=.5?u/(o+r):u/(2-o-r),o){case i:l=(a-s)/u+(a<s?6:0);break;case a:l=(s-i)/u+2;break;case s:l=(i-a)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=d,t}getRGB(t,e=Ae.workingColorSpace){return Ae.fromWorkingColorSpace(Mn.copy(this),e),t.r=Mn.r,t.g=Mn.g,t.b=Mn.b,t}getStyle(t=Dn){Ae.fromWorkingColorSpace(Mn.copy(this),t);const e=Mn.r,i=Mn.g,a=Mn.b;return t!==Dn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(a*255)})`}offsetHSL(t,e,i){return this.getHSL(Wi),this.setHSL(Wi.h+t,Wi.s+e,Wi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Wi),t.getHSL(Ho);const i=eo(Wi.h,Ho.h,e),a=eo(Wi.s,Ho.s,e),s=eo(Wi.l,Ho.l,e);return this.setHSL(i,a,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,a=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*a,this.g=s[1]*e+s[4]*i+s[7]*a,this.b=s[2]*e+s[5]*i+s[8]*a,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mn=new ie;ie.NAMES=zp;let GM=0;class La extends Rs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:GM++}),this.uuid=Mi(),this.name="",this.blending=fs,this.side=ia,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=El,this.blendDst=Tl,this.blendEquation=_a,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xa,this.stencilZFail=Xa,this.stencilZPass=Xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const a=this[e];if(a===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(i):a&&a.isVector3&&i&&i.isVector3?a.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(i.blending=this.blending),this.side!==ia&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==El&&(i.blendSrc=this.blendSrc),this.blendDst!==Tl&&(i.blendDst=this.blendDst),this.blendEquation!==_a&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ms&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xa&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Xa&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Xa&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function a(s){const o=[];for(const r in s){const l=s[r];delete l.metadata,o.push(l)}return o}if(e){const s=a(t.textures),o=a(t.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const a=e.length;i=new Array(a);for(let s=0;s!==a;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class pn extends La{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const an=new X,Go=new Yt;class mn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=hh,this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let a=0,s=this.itemSize;a<s;a++)this.array[t+a]=e.array[i+a];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Go.fromBufferAttribute(this,e),Go.applyMatrix3(t),this.setXY(e,Go.x,Go.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)an.fromBufferAttribute(this,e),an.applyMatrix3(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=oi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=oi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=oi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=oi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,a){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=a,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==hh&&(t.usage=this.usage),t}}class Fp extends mn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Up extends mn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class De extends mn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let XM=0;const Zn=new Pe,Gc=new je,Qa=new X,Gn=new Ca,Gs=new Ca,fn=new X;class on extends Rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:XM++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Dp(t)?Up:Fp)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new me().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Zn.makeRotationFromQuaternion(t),this.applyMatrix4(Zn),this}rotateX(t){return Zn.makeRotationX(t),this.applyMatrix4(Zn),this}rotateY(t){return Zn.makeRotationY(t),this.applyMatrix4(Zn),this}rotateZ(t){return Zn.makeRotationZ(t),this.applyMatrix4(Zn),this}translate(t,e,i){return Zn.makeTranslation(t,e,i),this.applyMatrix4(Zn),this}scale(t,e,i){return Zn.makeScale(t,e,i),this.applyMatrix4(Zn),this}lookAt(t){return Gc.lookAt(t),Gc.updateMatrix(),this.applyMatrix4(Gc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qa).negate(),this.translate(Qa.x,Qa.y,Qa.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let a=0,s=t.length;a<s;a++){const o=t[a];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new De(i,3))}else{for(let i=0,a=e.count;i<a;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ca);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,a=e.length;i<a;i++){const s=e[i];Gn.setFromBufferAttribute(s),this.morphTargetsRelative?(fn.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(fn),fn.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(fn)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ps);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(t){const i=this.boundingSphere.center;if(Gn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const r=e[s];Gs.setFromBufferAttribute(r),this.morphTargetsRelative?(fn.addVectors(Gn.min,Gs.min),Gn.expandByPoint(fn),fn.addVectors(Gn.max,Gs.max),Gn.expandByPoint(fn)):(Gn.expandByPoint(Gs.min),Gn.expandByPoint(Gs.max))}Gn.getCenter(i);let a=0;for(let s=0,o=t.count;s<o;s++)fn.fromBufferAttribute(t,s),a=Math.max(a,i.distanceToSquared(fn));if(e)for(let s=0,o=e.length;s<o;s++){const r=e[s],l=this.morphTargetsRelative;for(let c=0,d=r.count;c<d;c++)fn.fromBufferAttribute(r,c),l&&(Qa.fromBufferAttribute(t,c),fn.add(Qa)),a=Math.max(a,i.distanceToSquared(fn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,a=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),r=[],l=[];for(let E=0;E<i.count;E++)r[E]=new X,l[E]=new X;const c=new X,d=new X,u=new X,h=new Yt,f=new Yt,m=new Yt,_=new X,g=new X;function p(E,M,b){c.fromBufferAttribute(i,E),d.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),h.fromBufferAttribute(s,E),f.fromBufferAttribute(s,M),m.fromBufferAttribute(s,b),d.sub(c),u.sub(c),f.sub(h),m.sub(h);const R=1/(f.x*m.y-m.x*f.y);isFinite(R)&&(_.copy(d).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(R),g.copy(u).multiplyScalar(f.x).addScaledVector(d,-m.x).multiplyScalar(R),r[E].add(_),r[M].add(_),r[b].add(_),l[E].add(g),l[M].add(g),l[b].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let E=0,M=v.length;E<M;++E){const b=v[E],R=b.start,k=b.count;for(let C=R,I=R+k;C<I;C+=3)p(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const x=new X,y=new X,w=new X,S=new X;function T(E){w.fromBufferAttribute(a,E),S.copy(w);const M=r[E];x.copy(M),x.sub(w.multiplyScalar(w.dot(M))).normalize(),y.crossVectors(S,M);const R=y.dot(l[E])<0?-1:1;o.setXYZW(E,x.x,x.y,x.z,R)}for(let E=0,M=v.length;E<M;++E){const b=v[E],R=b.start,k=b.count;for(let C=R,I=R+k;C<I;C+=3)T(t.getX(C+0)),T(t.getX(C+1)),T(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const a=new X,s=new X,o=new X,r=new X,l=new X,c=new X,d=new X,u=new X;if(t)for(let h=0,f=t.count;h<f;h+=3){const m=t.getX(h+0),_=t.getX(h+1),g=t.getX(h+2);a.fromBufferAttribute(e,m),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),r.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),r.add(d),l.add(d),c.add(d),i.setXYZ(m,r.x,r.y,r.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)a.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(a,s),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)fn.fromBufferAttribute(t,e),fn.normalize(),t.setXYZ(e,fn.x,fn.y,fn.z)}toNonIndexed(){function t(r,l){const c=r.array,d=r.itemSize,u=r.normalized,h=new c.constructor(l.length*d);let f=0,m=0;for(let _=0,g=l.length;_<g;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*d;for(let p=0;p<d;p++)h[m++]=c[f++]}return new mn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new on,i=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=t(l,i);e.setAttribute(r,c)}const s=this.morphAttributes;for(const r in s){const l=[],c=s[r];for(let d=0,u=c.length;d<u;d++){const h=c[d],f=t(h,i);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const a={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const f=c[u];d.push(f.toJSON(t.data))}d.length>0&&(a[l]=d,s=!0)}s&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const a=t.attributes;for(const c in a){const d=a[c];this.setAttribute(c,d.clone(e))}const s=t.morphAttributes;for(const c in s){const d=[],u=s[c];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[c]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,d=o.length;c<d;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Au=new Pe,ha=new Nh,Xo=new Ps,Ru=new X,Vo=new X,Wo=new X,Yo=new X,Xc=new X,$o=new X,Pu=new X,Zo=new X;class _e extends je{constructor(t=new on,e=new pn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,a=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(a,t);const r=this.morphTargetInfluences;if(s&&r){$o.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=r[l],u=s[l];d!==0&&(Xc.fromBufferAttribute(u,t),o?$o.addScaledVector(Xc,d):$o.addScaledVector(Xc.sub(e),d))}e.add($o)}return e}raycast(t,e){const i=this.geometry,a=this.material,s=this.matrixWorld;a!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xo.copy(i.boundingSphere),Xo.applyMatrix4(s),ha.copy(t.ray).recast(t.near),!(Xo.containsPoint(ha.origin)===!1&&(ha.intersectSphere(Xo,Ru)===null||ha.origin.distanceToSquared(Ru)>(t.far-t.near)**2))&&(Au.copy(s).invert(),ha.copy(t.ray).applyMatrix4(Au),!(i.boundingBox!==null&&ha.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ha)))}_computeIntersections(t,e,i){let a;const s=this.geometry,o=this.material,r=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(o))for(let m=0,_=h.length;m<_;m++){const g=h[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),x=Math.min(r.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,w=x;y<w;y+=3){const S=r.getX(y),T=r.getX(y+1),E=r.getX(y+2);a=jo(this,p,t,i,c,d,u,S,T,E),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const v=r.getX(g),x=r.getX(g+1),y=r.getX(g+2);a=jo(this,o,t,i,c,d,u,v,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=h.length;m<_;m++){const g=h[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),x=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=v,w=x;y<w;y+=3){const S=y,T=y+1,E=y+2;a=jo(this,p,t,i,c,d,u,S,T,E),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=g.materialIndex,e.push(a))}}else{const m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const v=g,x=g+1,y=g+2;a=jo(this,o,t,i,c,d,u,v,x,y),a&&(a.faceIndex=Math.floor(g/3),e.push(a))}}}}function VM(n,t,e,i,a,s,o,r){let l;if(t.side===zn?l=i.intersectTriangle(o,s,a,!0,r):l=i.intersectTriangle(a,s,o,t.side===ia,r),l===null)return null;Zo.copy(r),Zo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Zo);return c<e.near||c>e.far?null:{distance:c,point:Zo.clone(),object:n}}function jo(n,t,e,i,a,s,o,r,l,c){n.getVertexPosition(r,Vo),n.getVertexPosition(l,Wo),n.getVertexPosition(c,Yo);const d=VM(n,t,e,i,Vo,Wo,Yo,Pu);if(d){const u=new X;Wn.getBarycoord(Pu,Vo,Wo,Yo,u),a&&(d.uv=Wn.getInterpolatedAttribute(a,r,l,c,u,new Yt)),s&&(d.uv1=Wn.getInterpolatedAttribute(s,r,l,c,u,new Yt)),o&&(d.normal=Wn.getInterpolatedAttribute(o,r,l,c,u,new X),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:r,b:l,c,normal:new X,materialIndex:0};Wn.getNormal(Vo,Wo,Yo,h.normal),d.face=h,d.barycoord=u}return d}class $n extends on{constructor(t=1,e=1,i=1,a=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:a,heightSegments:s,depthSegments:o};const r=this;a=Math.floor(a),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],u=[];let h=0,f=0;m("z","y","x",-1,-1,i,e,t,o,s,0),m("z","y","x",1,-1,i,e,-t,o,s,1),m("x","z","y",1,1,t,i,e,a,o,2),m("x","z","y",1,-1,t,i,-e,a,o,3),m("x","y","z",1,-1,t,e,i,a,s,4),m("x","y","z",-1,-1,t,e,-i,a,s,5),this.setIndex(l),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(d,3)),this.setAttribute("uv",new De(u,2));function m(_,g,p,v,x,y,w,S,T,E,M){const b=y/T,R=w/E,k=y/2,C=w/2,I=S/2,L=T+1,D=E+1;let O=0,B=0;const V=new X;for(let ot=0;ot<D;ot++){const gt=ot*R-C;for(let vt=0;vt<L;vt++){const It=vt*b-k;V[_]=It*v,V[g]=gt*x,V[p]=I,c.push(V.x,V.y,V.z),V[_]=0,V[g]=0,V[p]=S>0?1:-1,d.push(V.x,V.y,V.z),u.push(vt/T),u.push(1-ot/E),O+=1}}for(let ot=0;ot<E;ot++)for(let gt=0;gt<T;gt++){const vt=h+gt+L*ot,It=h+gt+L*(ot+1),K=h+(gt+1)+L*(ot+1),it=h+(gt+1)+L*ot;l.push(vt,It,it),l.push(It,K,it),B+=6}r.addGroup(f,B,M),f+=B,h+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ts(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const a=n[e][i];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=a.clone():Array.isArray(a)?t[e][i]=a.slice():t[e][i]=a}}return t}function Ln(n){const t={};for(let e=0;e<n.length;e++){const i=Ts(n[e]);for(const a in i)t[a]=i[a]}return t}function WM(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Np(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ae.workingColorSpace}const YM={clone:Ts,merge:Ln};var $M=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ZM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class aa extends La{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$M,this.fragmentShader=ZM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ts(t.uniforms),this.uniformsGroups=WM(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const a in this.uniforms){const o=this.uniforms[a].value;o&&o.isTexture?e.uniforms[a]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[a]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[a]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[a]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[a]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[a]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[a]={type:"m4",value:o.toArray()}:e.uniforms[a]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const a in this.extensions)this.extensions[a]===!0&&(i[a]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Op extends je{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pe,this.projectionMatrix=new Pe,this.projectionMatrixInverse=new Pe,this.coordinateSystem=zi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yi=new X,Cu=new Yt,Lu=new Yt;class qn extends Op{constructor(t=50,e=1,i=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=a,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=mo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ms*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return mo*2*Math.atan(Math.tan(ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z),Yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Yi.x,Yi.y).multiplyScalar(-t/Yi.z)}getViewSize(t,e){return this.getViewBounds(t,Cu,Lu),e.subVectors(Lu,Cu)}setViewOffset(t,e,i,a,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ms*.5*this.fov)/this.zoom,i=2*e,a=this.aspect*i,s=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*a/l,e-=o.offsetY*i/c,a*=o.width/l,i*=o.height/c}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+a,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ts=-90,es=1;class jM extends je{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new qn(ts,es,t,e);a.layers=this.layers,this.add(a);const s=new qn(ts,es,t,e);s.layers=this.layers,this.add(s);const o=new qn(ts,es,t,e);o.layers=this.layers,this.add(o);const r=new qn(ts,es,t,e);r.layers=this.layers,this.add(r);const l=new qn(ts,es,t,e);l.layers=this.layers,this.add(l);const c=new qn(ts,es,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,a,s,o,r,l]=e;for(const c of e)this.remove(c);if(t===zi)i.up.set(0,1,0),i.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===kr)i.up.set(0,-1,0),i.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:a}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,r,l,c,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,a),t.render(e,s),t.setRenderTarget(i,1,a),t.render(e,o),t.setRenderTarget(i,2,a),t.render(e,r),t.setRenderTarget(i,3,a),t.render(e,l),t.setRenderTarget(i,4,a),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,a),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Bp extends Sn{constructor(t,e,i,a,s,o,r,l,c,d){t=t!==void 0?t:[],e=e!==void 0?e:bs,super(t,e,i,a,s,o,r,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class qM extends Aa{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},a=[i,i,i,i,i,i];this.texture=new Bp(a,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:vi}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new $n(5,5,5),s=new aa({name:"CubemapFromEquirect",uniforms:Ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:zn,blending:Qi});s.uniforms.tEquirect.value=e;const o=new _e(a,s),r=e.minFilter;return e.minFilter===Sa&&(e.minFilter=vi),new jM(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,i,a){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,a);t.setRenderTarget(s)}}const Vc=new X,KM=new X,JM=new me;class xa{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,a){return this.normal.set(t,e,i),this.constant=a,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const a=Vc.subVectors(i,e).cross(KM.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(a,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Vc),a=this.normal.dot(i);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/a;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||JM.getNormalMatrix(t),a=this.coplanarPoint(Vc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-a.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const da=new Ps,qo=new X;class Bh{constructor(t=new xa,e=new xa,i=new xa,a=new xa,s=new xa,o=new xa){this.planes=[t,e,i,a,s,o]}set(t,e,i,a,s,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(a),r[4].copy(s),r[5].copy(o),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=zi){const i=this.planes,a=t.elements,s=a[0],o=a[1],r=a[2],l=a[3],c=a[4],d=a[5],u=a[6],h=a[7],f=a[8],m=a[9],_=a[10],g=a[11],p=a[12],v=a[13],x=a[14],y=a[15];if(i[0].setComponents(l-s,h-c,g-f,y-p).normalize(),i[1].setComponents(l+s,h+c,g+f,y+p).normalize(),i[2].setComponents(l+o,h+d,g+m,y+v).normalize(),i[3].setComponents(l-o,h-d,g-m,y-v).normalize(),i[4].setComponents(l-r,h-u,g-_,y-x).normalize(),e===zi)i[5].setComponents(l+r,h+u,g+_,y+x).normalize();else if(e===kr)i[5].setComponents(r,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),da.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),da.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(da)}intersectsSprite(t){return da.center.set(0,0,0),da.radius=.7071067811865476,da.applyMatrix4(t.matrixWorld),this.intersectsSphere(da)}intersectsSphere(t){const e=this.planes,i=t.center,a=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<a)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const a=e[i];if(qo.x=a.normal.x>0?t.max.x:t.min.x,qo.y=a.normal.y>0?t.max.y:t.min.y,qo.z=a.normal.z>0?t.max.z:t.min.z,a.distanceToPoint(qo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Hp(){let n=null,t=!1,e=null,i=null;function a(s,o){e(s,o),i=n.requestAnimationFrame(a)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(a),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function QM(n){const t=new WeakMap;function e(r,l){const c=r.array,d=r.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),r.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,r),u.length===0)n.bufferSubData(c,0,d);else{u.sort((f,m)=>f.start-m.start);let h=0;for(let f=1;f<u.length;f++){const m=u[h],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++h,u[h]=_)}u.length=h+1;for(let f=0,m=u.length;f<m;f++){const _=u[f];n.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const l=t.get(r);l&&(n.deleteBuffer(l.buffer),t.delete(r))}function o(r,l){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const d=t.get(r);(!d||d.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const c=t.get(r);if(c===void 0)t.set(r,e(r,l));else if(c.version<r.version){if(c.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,r,l),c.version=r.version}}return{get:a,remove:s,update:o}}class jn extends on{constructor(t=1,e=1,i=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:a};const s=t/2,o=e/2,r=Math.floor(i),l=Math.floor(a),c=r+1,d=l+1,u=t/r,h=e/l,f=[],m=[],_=[],g=[];for(let p=0;p<d;p++){const v=p*h-o;for(let x=0;x<c;x++){const y=x*u-s;m.push(y,-v,0),_.push(0,0,1),g.push(x/r),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<r;v++){const x=v+c*p,y=v+c*(p+1),w=v+1+c*(p+1),S=v+1+c*p;f.push(x,y,S),f.push(y,w,S)}this.setIndex(f),this.setAttribute("position",new De(m,3)),this.setAttribute("normal",new De(_,3)),this.setAttribute("uv",new De(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jn(t.width,t.height,t.widthSegments,t.heightSegments)}}var tb=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,eb=`#ifdef USE_ALPHAHASH
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
#endif`,nb=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ib=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ab=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sb=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ob=`#ifdef USE_AOMAP
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
#endif`,rb=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cb=`#ifdef USE_BATCHING
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
#endif`,lb=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hb=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,db=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ub=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fb=`#ifdef USE_IRIDESCENCE
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
#endif`,pb=`#ifdef USE_BUMPMAP
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
#endif`,mb=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xb=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vb=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yb=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_b=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mb=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,bb=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Sb=`#define PI 3.141592653589793
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
} // validated`,wb=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Eb=`vec3 transformedNormal = objectNormal;
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
#endif`,Tb=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ab=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Rb=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pb=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cb="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lb=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Db=`#ifdef USE_ENVMAP
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
#endif`,kb=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ib=`#ifdef USE_ENVMAP
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
#endif`,zb=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fb=`#ifdef USE_ENVMAP
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
#endif`,Ub=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nb=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ob=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bb=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hb=`#ifdef USE_GRADIENTMAP
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
}`,Gb=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xb=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Wb=`uniform bool receiveShadow;
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
#endif`,Yb=`#ifdef USE_ENVMAP
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
#endif`,$b=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Zb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jb=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qb=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Kb=`PhysicalMaterial material;
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
#endif`,Jb=`struct PhysicalMaterial {
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
}`,Qb=`
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
#endif`,t1=`#if defined( RE_IndirectDiffuse )
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
#endif`,e1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,n1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,i1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,a1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,o1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,r1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,l1=`#if defined( USE_POINTS_UV )
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
#endif`,h1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,d1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,u1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,f1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,p1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m1=`#ifdef USE_MORPHTARGETS
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
#endif`,g1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,x1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,v1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,y1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,b1=`#ifdef USE_NORMALMAP
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
#endif`,S1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,w1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,E1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,T1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,A1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,R1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,P1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,C1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,L1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,D1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,k1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,I1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,z1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,U1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,N1=`float getShadowMask() {
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
}`,O1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,B1=`#ifdef USE_SKINNING
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
#endif`,H1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G1=`#ifdef USE_SKINNING
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
#endif`,X1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,V1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,W1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$1=`#ifdef USE_TRANSMISSION
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
#endif`,Z1=`#ifdef USE_TRANSMISSION
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
#endif`,j1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Q1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tS=`uniform sampler2D t2D;
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
}`,eS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,iS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`#include <common>
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
}`,oS=`#if DEPTH_PACKING == 3200
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
}`,rS=`#define DISTANCE
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
}`,cS=`#define DISTANCE
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
}`,lS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dS=`uniform float scale;
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
}`,uS=`uniform vec3 diffuse;
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
}`,fS=`#include <common>
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
}`,pS=`uniform vec3 diffuse;
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
}`,mS=`#define LAMBERT
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
}`,gS=`#define LAMBERT
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
}`,xS=`#define MATCAP
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
}`,vS=`#define MATCAP
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
}`,yS=`#define NORMAL
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
}`,_S=`#define NORMAL
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
}`,MS=`#define PHONG
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
}`,bS=`#define PHONG
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
}`,SS=`#define STANDARD
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
}`,wS=`#define STANDARD
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
}`,ES=`#define TOON
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
}`,TS=`#define TOON
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
}`,AS=`uniform float size;
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
}`,RS=`uniform vec3 diffuse;
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
}`,PS=`#include <common>
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
}`,CS=`uniform vec3 color;
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
}`,LS=`uniform float rotation;
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
}`,DS=`uniform vec3 diffuse;
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
}`,xe={alphahash_fragment:tb,alphahash_pars_fragment:eb,alphamap_fragment:nb,alphamap_pars_fragment:ib,alphatest_fragment:ab,alphatest_pars_fragment:sb,aomap_fragment:ob,aomap_pars_fragment:rb,batching_pars_vertex:cb,batching_vertex:lb,begin_vertex:hb,beginnormal_vertex:db,bsdfs:ub,iridescence_fragment:fb,bumpmap_pars_fragment:pb,clipping_planes_fragment:mb,clipping_planes_pars_fragment:gb,clipping_planes_pars_vertex:xb,clipping_planes_vertex:vb,color_fragment:yb,color_pars_fragment:_b,color_pars_vertex:Mb,color_vertex:bb,common:Sb,cube_uv_reflection_fragment:wb,defaultnormal_vertex:Eb,displacementmap_pars_vertex:Tb,displacementmap_vertex:Ab,emissivemap_fragment:Rb,emissivemap_pars_fragment:Pb,colorspace_fragment:Cb,colorspace_pars_fragment:Lb,envmap_fragment:Db,envmap_common_pars_fragment:kb,envmap_pars_fragment:Ib,envmap_pars_vertex:zb,envmap_physical_pars_fragment:Yb,envmap_vertex:Fb,fog_vertex:Ub,fog_pars_vertex:Nb,fog_fragment:Ob,fog_pars_fragment:Bb,gradientmap_pars_fragment:Hb,lightmap_pars_fragment:Gb,lights_lambert_fragment:Xb,lights_lambert_pars_fragment:Vb,lights_pars_begin:Wb,lights_toon_fragment:$b,lights_toon_pars_fragment:Zb,lights_phong_fragment:jb,lights_phong_pars_fragment:qb,lights_physical_fragment:Kb,lights_physical_pars_fragment:Jb,lights_fragment_begin:Qb,lights_fragment_maps:t1,lights_fragment_end:e1,logdepthbuf_fragment:n1,logdepthbuf_pars_fragment:i1,logdepthbuf_pars_vertex:a1,logdepthbuf_vertex:s1,map_fragment:o1,map_pars_fragment:r1,map_particle_fragment:c1,map_particle_pars_fragment:l1,metalnessmap_fragment:h1,metalnessmap_pars_fragment:d1,morphinstance_vertex:u1,morphcolor_vertex:f1,morphnormal_vertex:p1,morphtarget_pars_vertex:m1,morphtarget_vertex:g1,normal_fragment_begin:x1,normal_fragment_maps:v1,normal_pars_fragment:y1,normal_pars_vertex:_1,normal_vertex:M1,normalmap_pars_fragment:b1,clearcoat_normal_fragment_begin:S1,clearcoat_normal_fragment_maps:w1,clearcoat_pars_fragment:E1,iridescence_pars_fragment:T1,opaque_fragment:A1,packing:R1,premultiplied_alpha_fragment:P1,project_vertex:C1,dithering_fragment:L1,dithering_pars_fragment:D1,roughnessmap_fragment:k1,roughnessmap_pars_fragment:I1,shadowmap_pars_fragment:z1,shadowmap_pars_vertex:F1,shadowmap_vertex:U1,shadowmask_pars_fragment:N1,skinbase_vertex:O1,skinning_pars_vertex:B1,skinning_vertex:H1,skinnormal_vertex:G1,specularmap_fragment:X1,specularmap_pars_fragment:V1,tonemapping_fragment:W1,tonemapping_pars_fragment:Y1,transmission_fragment:$1,transmission_pars_fragment:Z1,uv_pars_fragment:j1,uv_pars_vertex:q1,uv_vertex:K1,worldpos_vertex:J1,background_vert:Q1,background_frag:tS,backgroundCube_vert:eS,backgroundCube_frag:nS,cube_vert:iS,cube_frag:aS,depth_vert:sS,depth_frag:oS,distanceRGBA_vert:rS,distanceRGBA_frag:cS,equirect_vert:lS,equirect_frag:hS,linedashed_vert:dS,linedashed_frag:uS,meshbasic_vert:fS,meshbasic_frag:pS,meshlambert_vert:mS,meshlambert_frag:gS,meshmatcap_vert:xS,meshmatcap_frag:vS,meshnormal_vert:yS,meshnormal_frag:_S,meshphong_vert:MS,meshphong_frag:bS,meshphysical_vert:SS,meshphysical_frag:wS,meshtoon_vert:ES,meshtoon_frag:TS,points_vert:AS,points_frag:RS,shadow_vert:PS,shadow_frag:CS,sprite_vert:LS,sprite_frag:DS},Xt={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new me}},envmap:{envMap:{value:null},envMapRotation:{value:new me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new me},normalScale:{value:new Yt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0},uvTransform:{value:new me}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new Yt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}}},xi={basic:{uniforms:Ln([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.fog]),vertexShader:xe.meshbasic_vert,fragmentShader:xe.meshbasic_frag},lambert:{uniforms:Ln([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new ie(0)}}]),vertexShader:xe.meshlambert_vert,fragmentShader:xe.meshlambert_frag},phong:{uniforms:Ln([Xt.common,Xt.specularmap,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,Xt.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:xe.meshphong_vert,fragmentShader:xe.meshphong_frag},standard:{uniforms:Ln([Xt.common,Xt.envmap,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.roughnessmap,Xt.metalnessmap,Xt.fog,Xt.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag},toon:{uniforms:Ln([Xt.common,Xt.aomap,Xt.lightmap,Xt.emissivemap,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.gradientmap,Xt.fog,Xt.lights,{emissive:{value:new ie(0)}}]),vertexShader:xe.meshtoon_vert,fragmentShader:xe.meshtoon_frag},matcap:{uniforms:Ln([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,Xt.fog,{matcap:{value:null}}]),vertexShader:xe.meshmatcap_vert,fragmentShader:xe.meshmatcap_frag},points:{uniforms:Ln([Xt.points,Xt.fog]),vertexShader:xe.points_vert,fragmentShader:xe.points_frag},dashed:{uniforms:Ln([Xt.common,Xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xe.linedashed_vert,fragmentShader:xe.linedashed_frag},depth:{uniforms:Ln([Xt.common,Xt.displacementmap]),vertexShader:xe.depth_vert,fragmentShader:xe.depth_frag},normal:{uniforms:Ln([Xt.common,Xt.bumpmap,Xt.normalmap,Xt.displacementmap,{opacity:{value:1}}]),vertexShader:xe.meshnormal_vert,fragmentShader:xe.meshnormal_frag},sprite:{uniforms:Ln([Xt.sprite,Xt.fog]),vertexShader:xe.sprite_vert,fragmentShader:xe.sprite_frag},background:{uniforms:{uvTransform:{value:new me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xe.background_vert,fragmentShader:xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new me}},vertexShader:xe.backgroundCube_vert,fragmentShader:xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xe.cube_vert,fragmentShader:xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xe.equirect_vert,fragmentShader:xe.equirect_frag},distanceRGBA:{uniforms:Ln([Xt.common,Xt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xe.distanceRGBA_vert,fragmentShader:xe.distanceRGBA_frag},shadow:{uniforms:Ln([Xt.lights,Xt.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:xe.shadow_vert,fragmentShader:xe.shadow_frag}};xi.physical={uniforms:Ln([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new me},clearcoatNormalScale:{value:new Yt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new me},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new me},transmissionSamplerSize:{value:new Yt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new me},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new me},anisotropyVector:{value:new Yt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new me}}]),vertexShader:xe.meshphysical_vert,fragmentShader:xe.meshphysical_frag};const Ko={r:0,b:0,g:0},ua=new bi,kS=new Pe;function IS(n,t,e,i,a,s,o){const r=new ie(0);let l=s===!0?0:1,c,d,u=null,h=0,f=null;function m(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?e:t).get(x)),x}function _(v){let x=!1;const y=m(v);y===null?p(r,l):y&&y.isColor&&(p(y,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(v,x){const y=m(x);y&&(y.isCubeTexture||y.mapping===Wr)?(d===void 0&&(d=new _e(new $n(1,1,1),new aa({name:"BackgroundCubeMaterial",uniforms:Ts(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),ua.copy(x.backgroundRotation),ua.x*=-1,ua.y*=-1,ua.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ua.y*=-1,ua.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(kS.makeRotationFromEuler(ua)),d.material.toneMapped=Ae.getTransfer(y.colorSpace)!==Ne,(u!==y||h!==y.version||f!==n.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new _e(new jn(2,2),new aa({name:"BackgroundMaterial",uniforms:Ts(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:ia,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Ae.getTransfer(y.colorSpace)!==Ne,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=y,h=y.version,f=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,x){v.getRGB(Ko,Np(n)),i.buffers.color.setClear(Ko.r,Ko.g,Ko.b,x,o)}return{getClearColor:function(){return r},setClearColor:function(v,x=1){r.set(v),l=x,p(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(r,l)},render:_,addToRenderList:g}}function zS(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},a=h(null);let s=a,o=!1;function r(b,R,k,C,I){let L=!1;const D=u(C,k,R);s!==D&&(s=D,c(s.object)),L=f(b,C,k,I),L&&m(b,C,k,I),I!==null&&t.update(I,n.ELEMENT_ARRAY_BUFFER),(L||o)&&(o=!1,y(b,R,k,C),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,R,k){const C=k.wireframe===!0;let I=i[b.id];I===void 0&&(I={},i[b.id]=I);let L=I[R.id];L===void 0&&(L={},I[R.id]=L);let D=L[C];return D===void 0&&(D=h(l()),L[C]=D),D}function h(b){const R=[],k=[],C=[];for(let I=0;I<e;I++)R[I]=0,k[I]=0,C[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:k,attributeDivisors:C,object:b,attributes:{},index:null}}function f(b,R,k,C){const I=s.attributes,L=R.attributes;let D=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){const ot=I[B];let gt=L[B];if(gt===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(gt=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(gt=b.instanceColor)),ot===void 0||ot.attribute!==gt||gt&&ot.data!==gt.data)return!0;D++}return s.attributesNum!==D||s.index!==C}function m(b,R,k,C){const I={},L=R.attributes;let D=0;const O=k.getAttributes();for(const B in O)if(O[B].location>=0){let ot=L[B];ot===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(ot=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(ot=b.instanceColor));const gt={};gt.attribute=ot,ot&&ot.data&&(gt.data=ot.data),I[B]=gt,D++}s.attributes=I,s.attributesNum=D,s.index=C}function _(){const b=s.newAttributes;for(let R=0,k=b.length;R<k;R++)b[R]=0}function g(b){p(b,0)}function p(b,R){const k=s.newAttributes,C=s.enabledAttributes,I=s.attributeDivisors;k[b]=1,C[b]===0&&(n.enableVertexAttribArray(b),C[b]=1),I[b]!==R&&(n.vertexAttribDivisor(b,R),I[b]=R)}function v(){const b=s.newAttributes,R=s.enabledAttributes;for(let k=0,C=R.length;k<C;k++)R[k]!==b[k]&&(n.disableVertexAttribArray(k),R[k]=0)}function x(b,R,k,C,I,L,D){D===!0?n.vertexAttribIPointer(b,R,k,I,L):n.vertexAttribPointer(b,R,k,C,I,L)}function y(b,R,k,C){_();const I=C.attributes,L=k.getAttributes(),D=R.defaultAttributeValues;for(const O in L){const B=L[O];if(B.location>=0){let V=I[O];if(V===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(V=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(V=b.instanceColor)),V!==void 0){const ot=V.normalized,gt=V.itemSize,vt=t.get(V);if(vt===void 0)continue;const It=vt.buffer,K=vt.type,it=vt.bytesPerElement,ct=K===n.INT||K===n.UNSIGNED_INT||V.gpuType===Ch;if(V.isInterleavedBufferAttribute){const Z=V.data,J=Z.stride,lt=V.offset;if(Z.isInstancedInterleavedBuffer){for(let Ht=0;Ht<B.locationSize;Ht++)p(B.location+Ht,Z.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Ht=0;Ht<B.locationSize;Ht++)g(B.location+Ht);n.bindBuffer(n.ARRAY_BUFFER,It);for(let Ht=0;Ht<B.locationSize;Ht++)x(B.location+Ht,gt/B.locationSize,K,ot,J*it,(lt+gt/B.locationSize*Ht)*it,ct)}else{if(V.isInstancedBufferAttribute){for(let Z=0;Z<B.locationSize;Z++)p(B.location+Z,V.meshPerAttribute);b.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let Z=0;Z<B.locationSize;Z++)g(B.location+Z);n.bindBuffer(n.ARRAY_BUFFER,It);for(let Z=0;Z<B.locationSize;Z++)x(B.location+Z,gt/B.locationSize,K,ot,gt*it,gt/B.locationSize*Z*it,ct)}}else if(D!==void 0){const ot=D[O];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(B.location,ot);break;case 3:n.vertexAttrib3fv(B.location,ot);break;case 4:n.vertexAttrib4fv(B.location,ot);break;default:n.vertexAttrib1fv(B.location,ot)}}}}v()}function w(){E();for(const b in i){const R=i[b];for(const k in R){const C=R[k];for(const I in C)d(C[I].object),delete C[I];delete R[k]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const k in R){const C=R[k];for(const I in C)d(C[I].object),delete C[I];delete R[k]}delete i[b.id]}function T(b){for(const R in i){const k=i[R];if(k[b.id]===void 0)continue;const C=k[b.id];for(const I in C)d(C[I].object),delete C[I];delete k[b.id]}}function E(){M(),o=!0,s!==a&&(s=a,c(s.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:r,reset:E,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function FS(n,t,e){let i;function a(c){i=c}function s(c,d){n.drawArrays(i,c,d),e.update(d,i,1)}function o(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),e.update(d,i,u))}function r(c,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let f=0;for(let m=0;m<u;m++)f+=d[m];e.update(f,i,1)}function l(c,d,u,h){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],d[m],h[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_]*h[_];e.update(m,i,1)}}this.setMode=a,this.render=s,this.renderInstances=o,this.renderMultiDraw=r,this.renderMultiDrawInstances=l}function US(n,t,e,i){let a;function s(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");a=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(T){return!(T!==ri&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(T){const E=T===Mo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Ui&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==yi&&!E)}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=e.logarithmicDepthBuffer===!0,h=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:r,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:w,maxSamples:S}}function NS(n){const t=this;let e=null,i=0,a=!1,s=!1;const o=new xa,r=new me,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||i!==0||a;return a=h,i=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=n.get(u);if(!a||m===null||m.length===0||s&&!g)s?d(null):c();else{const v=s?0:i,x=v*4;let y=p.clippingState||null;l.value=y,y=d(m,h,x,f);for(let w=0;w!==x;++w)y[w]=e[w];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function d(u,h,f,m){const _=u!==null?u.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=f+_*4,v=h.matrixWorldInverse;r.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==_;++x,y+=4)o.copy(u[x]).applyMatrix4(v,r),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}function OS(n){let t=new WeakMap;function e(o,r){return r===Il?o.mapping=bs:r===zl&&(o.mapping=Ss),o}function i(o){if(o&&o.isTexture){const r=o.mapping;if(r===Il||r===zl)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new qM(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",a),e(c.texture,o.mapping)}else return null}}return o}function a(o){const r=o.target;r.removeEventListener("dispose",a);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class Gp extends Op{constructor(t=-1,e=1,i=1,a=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=a,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,a,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=a,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let s=i-t,o=i+t,r=a+e,l=a-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,r-=d*this.view.offsetY,l=r-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const hs=4,Du=[.125,.215,.35,.446,.526,.582],Ma=20,Wc=new Gp,ku=new ie;let Yc=null,$c=0,Zc=0,jc=!1;const va=(1+Math.sqrt(5))/2,ns=1/va,Iu=[new X(-va,ns,0),new X(va,ns,0),new X(-ns,0,va),new X(ns,0,va),new X(0,va,-ns),new X(0,va,ns),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)];class zu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,a=100){Yc=this._renderer.getRenderTarget(),$c=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,a,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Yc,$c,Zc),this._renderer.xr.enabled=jc,t.scissorTest=!1,Jo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bs||t.mapping===Ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Yc=this._renderer.getRenderTarget(),$c=this._renderer.getActiveCubeFace(),Zc=this._renderer.getActiveMipmapLevel(),jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:vi,minFilter:vi,generateMipmaps:!1,type:Mo,format:ri,colorSpace:As,depthBuffer:!1},a=Fu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fu(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BS(s)),this._blurMaterial=HS(s,t,e)}return a}_compileMaterial(t){const e=new _e(this._lodPlanes[0],t);this._renderer.compile(e,Wc)}_sceneToCubeUV(t,e,i,a){const r=new qn(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(ku),d.toneMapping=ta,d.autoClear=!1;const f=new pn({name:"PMREM.Background",side:zn,depthWrite:!1,depthTest:!1}),m=new _e(new $n,f);let _=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,_=!0):(f.color.copy(ku),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):v===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const x=this._cubeSize;Jo(a,v*x,p>2?x:0,x,x),d.setRenderTarget(a),_&&d.render(m,r),d.render(t,r)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,t.background=g}_textureToCubeUV(t,e){const i=this._renderer,a=t.mapping===bs||t.mapping===Ss;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uu());const s=a?this._cubemapMaterial:this._equirectMaterial,o=new _e(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const l=this._cubeSize;Jo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Wc)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const a=this._lodPlanes.length;for(let s=1;s<a;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=Iu[(a-s-1)%Iu.length];this._blur(t,s-1,s,o,r)}e.autoClear=i}_blur(t,e,i,a,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,a,"latitudinal",s),this._halfBlur(o,t,i,i,a,"longitudinal",s)}_halfBlur(t,e,i,a,s,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new _e(this._lodPlanes[a],c),h=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Ma-1),_=s/m,g=isFinite(s)?1+Math.floor(d*_):Ma;g>Ma&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ma}`);const p=[];let v=0;for(let T=0;T<Ma;++T){const E=T/_,M=Math.exp(-E*E/2);p.push(M),T===0?v+=M:T<g&&(v+=2*M)}for(let T=0;T<p.length;T++)p[T]=p[T]/v;h.envMap.value=t.texture,h.samples.value=g,h.weights.value=p,h.latitudinal.value=o==="latitudinal",r&&(h.poleAxis.value=r);const{_lodMax:x}=this;h.dTheta.value=m,h.mipInt.value=x-i;const y=this._sizeLods[a],w=3*y*(a>x-hs?a-x+hs:0),S=4*(this._cubeSize-y);Jo(e,w,S,3*y,2*y),l.setRenderTarget(e),l.render(u,Wc)}}function BS(n){const t=[],e=[],i=[];let a=n;const s=n-hs+1+Du.length;for(let o=0;o<s;o++){const r=Math.pow(2,a);e.push(r);let l=1/r;o>n-hs?l=Du[o-n+hs-1]:o===0&&(l=0),i.push(l);const c=1/(r-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,m=6,_=3,g=2,p=1,v=new Float32Array(_*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let S=0;S<f;S++){const T=S%3*2/3-1,E=S>2?0:-1,M=[T,E,0,T+2/3,E,0,T+2/3,E+1,0,T,E,0,T+2/3,E+1,0,T,E+1,0];v.set(M,_*m*S),x.set(h,g*m*S);const b=[S,S,S,S,S,S];y.set(b,p*m*S)}const w=new on;w.setAttribute("position",new mn(v,_)),w.setAttribute("uv",new mn(x,g)),w.setAttribute("faceIndex",new mn(y,p)),t.push(w),a>hs&&a--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Fu(n,t,e){const i=new Aa(n,t,e);return i.texture.mapping=Wr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Jo(n,t,e,i,a){n.viewport.set(t,e,i,a),n.scissor.set(t,e,i,a)}function HS(n,t,e){const i=new Float32Array(Ma),a=new X(0,1,0);return new aa({name:"SphericalGaussianBlur",defines:{n:Ma,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Hh(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Uu(){return new aa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hh(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Nu(){return new aa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Hh(){return`

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
	`}function GS(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===Il||l===zl,d=l===bs||l===Ss;if(c||d){let u=t.get(r);const h=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==h)return e===null&&(e=new zu(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return c&&f&&f.height>0||d&&f&&a(f)?(e===null&&(e=new zu(n)),u=c?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",s),u.texture):null}}}return r}function a(r){let l=0;const c=6;for(let d=0;d<c;d++)r[d]!==void 0&&l++;return l===c}function s(r){const l=r.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function XS(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let a;switch(i){case"WEBGL_depth_texture":a=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=n.getExtension(i)}return t[i]=a,a}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const a=e(i);return a===null&&js("THREE.WebGLRenderer: "+i+" extension not supported."),a}}}function VS(n,t,e,i){const a={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const m in h.attributes)t.remove(h.attributes[m]);for(const m in h.morphAttributes){const _=h.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)t.remove(_[g])}h.removeEventListener("dispose",o),delete a[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function r(u,h){return a[h.id]===!0||(h.addEventListener("dispose",o),a[h.id]=!0,e.memory.geometries++),h}function l(u){const h=u.attributes;for(const m in h)t.update(h[m],n.ARRAY_BUFFER);const f=u.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)t.update(_[g],n.ARRAY_BUFFER)}}function c(u){const h=[],f=u.index,m=u.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let x=0,y=v.length;x<y;x+=3){const w=v[x+0],S=v[x+1],T=v[x+2];h.push(w,S,S,T,T,w)}}else if(m!==void 0){const v=m.array;_=m.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const w=x+0,S=x+1,T=x+2;h.push(w,S,S,T,T,w)}}else return;const g=new(Dp(h)?Up:Fp)(h,1);g.version=_;const p=s.get(u);p&&t.remove(p),s.set(u,g)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:r,update:l,getWireframeAttribute:d}}function WS(n,t,e){let i;function a(h){i=h}let s,o;function r(h){s=h.type,o=h.bytesPerElement}function l(h,f){n.drawElements(i,f,s,h*o),e.update(f,i,1)}function c(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*o,m),e.update(f,i,m))}function d(h,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,i,1)}function u(h,f,m,_){if(m===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<h.length;p++)c(h[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,h,0,_,0,m);let p=0;for(let v=0;v<m;v++)p+=f[v]*_[v];e.update(p,i,1)}}this.setMode=a,this.setIndex=r,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function YS(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,r){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:a,update:i}}function $S(n,t,e){const i=new WeakMap,a=new tn;function s(o,r,l){const c=o.morphTargetInfluences,d=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(r);if(h===void 0||h.count!==u){let b=function(){E.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var f=b;h!==void 0&&h.texture.dispose();const m=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,g=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],v=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;m===!0&&(y=1),_===!0&&(y=2),g===!0&&(y=3);let w=r.attributes.position.count*y,S=1;w>t.maxTextureSize&&(S=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const T=new Float32Array(w*S*4*u),E=new Ip(T,w,S,u);E.type=yi,E.needsUpdate=!0;const M=y*4;for(let R=0;R<u;R++){const k=p[R],C=v[R],I=x[R],L=w*S*4*R;for(let D=0;D<k.count;D++){const O=D*M;m===!0&&(a.fromBufferAttribute(k,D),T[L+O+0]=a.x,T[L+O+1]=a.y,T[L+O+2]=a.z,T[L+O+3]=0),_===!0&&(a.fromBufferAttribute(C,D),T[L+O+4]=a.x,T[L+O+5]=a.y,T[L+O+6]=a.z,T[L+O+7]=0),g===!0&&(a.fromBufferAttribute(I,D),T[L+O+8]=a.x,T[L+O+9]=a.y,T[L+O+10]=a.z,T[L+O+11]=I.itemSize===4?a.w:1)}}h={count:u,texture:E,size:new Yt(w,S)},i.set(r,h),r.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=r.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function ZS(n,t,e,i){let a=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,u=t.get(l,d);if(a.get(u)!==c&&(t.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;a.get(h)!==c&&(h.update(),a.set(h,c))}return u}function o(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Xp extends Sn{constructor(t,e,i,a,s,o,r,l,c,d=ps){if(d!==ps&&d!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===ps&&(i=Ta),i===void 0&&d===Es&&(i=ws),super(null,a,s,o,r,l,d,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Yn,this.minFilter=l!==void 0?l:Yn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Vp=new Sn,Ou=new Xp(1,1),Wp=new Ip,Yp=new IM,$p=new Bp,Bu=[],Hu=[],Gu=new Float32Array(16),Xu=new Float32Array(9),Vu=new Float32Array(4);function Cs(n,t,e){const i=n[0];if(i<=0||i>0)return n;const a=t*e;let s=Bu[a];if(s===void 0&&(s=new Float32Array(a),Bu[a]=s),t!==0){i.toArray(s,0);for(let o=1,r=0;o!==t;++o)r+=e,n[o].toArray(s,r)}return s}function cn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ln(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function $r(n,t){let e=Hu[t];e===void 0&&(e=new Int32Array(t),Hu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function jS(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function qS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2fv(this.addr,t),ln(e,t)}}function KS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(cn(e,t))return;n.uniform3fv(this.addr,t),ln(e,t)}}function JS(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4fv(this.addr,t),ln(e,t)}}function QS(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;Vu.set(i),n.uniformMatrix2fv(this.addr,!1,Vu),ln(e,i)}}function tw(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;Xu.set(i),n.uniformMatrix3fv(this.addr,!1,Xu),ln(e,i)}}function ew(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(cn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ln(e,t)}else{if(cn(e,i))return;Gu.set(i),n.uniformMatrix4fv(this.addr,!1,Gu),ln(e,i)}}function nw(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function iw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2iv(this.addr,t),ln(e,t)}}function aw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(cn(e,t))return;n.uniform3iv(this.addr,t),ln(e,t)}}function sw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4iv(this.addr,t),ln(e,t)}}function ow(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function rw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(cn(e,t))return;n.uniform2uiv(this.addr,t),ln(e,t)}}function cw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(cn(e,t))return;n.uniform3uiv(this.addr,t),ln(e,t)}}function lw(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(cn(e,t))return;n.uniform4uiv(this.addr,t),ln(e,t)}}function hw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a);let s;this.type===n.SAMPLER_2D_SHADOW?(Ou.compareFunction=Lp,s=Ou):s=Vp,e.setTexture2D(t||s,a)}function dw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture3D(t||Yp,a)}function uw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTextureCube(t||$p,a)}function fw(n,t,e){const i=this.cache,a=e.allocateTextureUnit();i[0]!==a&&(n.uniform1i(this.addr,a),i[0]=a),e.setTexture2DArray(t||Wp,a)}function pw(n){switch(n){case 5126:return jS;case 35664:return qS;case 35665:return KS;case 35666:return JS;case 35674:return QS;case 35675:return tw;case 35676:return ew;case 5124:case 35670:return nw;case 35667:case 35671:return iw;case 35668:case 35672:return aw;case 35669:case 35673:return sw;case 5125:return ow;case 36294:return rw;case 36295:return cw;case 36296:return lw;case 35678:case 36198:case 36298:case 36306:case 35682:return hw;case 35679:case 36299:case 36307:return dw;case 35680:case 36300:case 36308:case 36293:return uw;case 36289:case 36303:case 36311:case 36292:return fw}}function mw(n,t){n.uniform1fv(this.addr,t)}function gw(n,t){const e=Cs(t,this.size,2);n.uniform2fv(this.addr,e)}function xw(n,t){const e=Cs(t,this.size,3);n.uniform3fv(this.addr,e)}function vw(n,t){const e=Cs(t,this.size,4);n.uniform4fv(this.addr,e)}function yw(n,t){const e=Cs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function _w(n,t){const e=Cs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Mw(n,t){const e=Cs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function bw(n,t){n.uniform1iv(this.addr,t)}function Sw(n,t){n.uniform2iv(this.addr,t)}function ww(n,t){n.uniform3iv(this.addr,t)}function Ew(n,t){n.uniform4iv(this.addr,t)}function Tw(n,t){n.uniform1uiv(this.addr,t)}function Aw(n,t){n.uniform2uiv(this.addr,t)}function Rw(n,t){n.uniform3uiv(this.addr,t)}function Pw(n,t){n.uniform4uiv(this.addr,t)}function Cw(n,t,e){const i=this.cache,a=t.length,s=$r(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture2D(t[o]||Vp,s[o])}function Lw(n,t,e){const i=this.cache,a=t.length,s=$r(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture3D(t[o]||Yp,s[o])}function Dw(n,t,e){const i=this.cache,a=t.length,s=$r(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTextureCube(t[o]||$p,s[o])}function kw(n,t,e){const i=this.cache,a=t.length,s=$r(e,a);cn(i,s)||(n.uniform1iv(this.addr,s),ln(i,s));for(let o=0;o!==a;++o)e.setTexture2DArray(t[o]||Wp,s[o])}function Iw(n){switch(n){case 5126:return mw;case 35664:return gw;case 35665:return xw;case 35666:return vw;case 35674:return yw;case 35675:return _w;case 35676:return Mw;case 5124:case 35670:return bw;case 35667:case 35671:return Sw;case 35668:case 35672:return ww;case 35669:case 35673:return Ew;case 5125:return Tw;case 36294:return Aw;case 36295:return Rw;case 36296:return Pw;case 35678:case 36198:case 36298:case 36306:case 35682:return Cw;case 35679:case 36299:case 36307:return Lw;case 35680:case 36300:case 36308:case 36293:return Dw;case 36289:case 36303:case 36311:case 36292:return kw}}class zw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=pw(e.type)}}class Fw{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Iw(e.type)}}class Uw{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const a=this.seq;for(let s=0,o=a.length;s!==o;++s){const r=a[s];r.setValue(t,e[r.id],i)}}}const qc=/(\w+)(\])?(\[|\.)?/g;function Wu(n,t){n.seq.push(t),n.map[t.id]=t}function Nw(n,t,e){const i=n.name,a=i.length;for(qc.lastIndex=0;;){const s=qc.exec(i),o=qc.lastIndex;let r=s[1];const l=s[2]==="]",c=s[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===a){Wu(e,c===void 0?new zw(r,n,t):new Fw(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new Uw(r),Wu(e,u)),e=u}}}class yr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const s=t.getActiveUniform(e,a),o=t.getUniformLocation(e,s.name);Nw(s,o,this)}}setValue(t,e,i,a){const s=this.map[e];s!==void 0&&s.setValue(t,i,a)}setOptional(t,e,i){const a=e[i];a!==void 0&&this.setValue(t,i,a)}static upload(t,e,i,a){for(let s=0,o=e.length;s!==o;++s){const r=e[s],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,a)}}static seqWithValue(t,e){const i=[];for(let a=0,s=t.length;a!==s;++a){const o=t[a];o.id in e&&i.push(o)}return i}}function Yu(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Ow=37297;let Bw=0;function Hw(n,t){const e=n.split(`
`),i=[],a=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=a;o<s;o++){const r=o+1;i.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return i.join(`
`)}const $u=new me;function Gw(n){Ae._getMatrix($u,Ae.workingColorSpace,n);const t=`mat3( ${$u.elements.map(e=>e.toFixed(4))} )`;switch(Ae.getTransfer(n)){case Yr:return[t,"LinearTransferOETF"];case Ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Zu(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),a=n.getShaderInfoLog(t).trim();if(i&&a==="")return"";const s=/ERROR: 0:(\d+)/.exec(a);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+a+`

`+Hw(n.getShaderSource(t),o)}else return a}function Xw(n,t){const e=Gw(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Vw(n,t){let e;switch(t){case Y_:e="Linear";break;case $_:e="Reinhard";break;case Z_:e="Cineon";break;case j_:e="ACESFilmic";break;case K_:e="AgX";break;case J_:e="Neutral";break;case q_:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Qo=new X;function Ww(){Ae.getLuminanceCoefficients(Qo);const n=Qo.x.toFixed(4),t=Qo.y.toFixed(4),e=Qo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Yw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function $w(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Zw(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let a=0;a<i;a++){const s=n.getActiveAttrib(t,a),o=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[o]={type:s.type,location:n.getAttribLocation(t,o),locationSize:r}}return e}function qs(n){return n!==""}function ju(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function qu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const jw=/^[ \t]*#include +<([\w\d./]+)>/gm;function dh(n){return n.replace(jw,Kw)}const qw=new Map;function Kw(n,t){let e=xe[t];if(e===void 0){const i=qw.get(t);if(i!==void 0)e=xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return dh(e)}const Jw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ku(n){return n.replace(Jw,Qw)}function Qw(n,t,e,i){let a="";for(let s=parseInt(t);s<parseInt(e);s++)a+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return a}function Ju(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function tE(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===vp?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===yp?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Di&&(t="SHADOWMAP_TYPE_VSM"),t}function eE(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case bs:case Ss:t="ENVMAP_TYPE_CUBE";break;case Wr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function nE(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ss:t="ENVMAP_MODE_REFRACTION";break}return t}function iE(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Ph:t="ENVMAP_BLENDING_MULTIPLY";break;case V_:t="ENVMAP_BLENDING_MIX";break;case W_:t="ENVMAP_BLENDING_ADD";break}return t}function aE(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function sE(n,t,e,i){const a=n.getContext(),s=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=tE(e),c=eE(e),d=nE(e),u=iE(e),h=aE(e),f=Yw(e),m=$w(s),_=a.createProgram();let g,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(qs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(qs).join(`
`),p.length>0&&(p+=`
`)):(g=[Ju(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),p=[Ju(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ta?"#define TONE_MAPPING":"",e.toneMapping!==ta?xe.tonemapping_pars_fragment:"",e.toneMapping!==ta?Vw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",xe.colorspace_pars_fragment,Xw("linearToOutputTexel",e.outputColorSpace),Ww(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qs).join(`
`)),o=dh(o),o=ju(o,e),o=qu(o,e),r=dh(r),r=ju(r,e),r=qu(r,e),o=Ku(o),r=Ku(r),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===lu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=v+g+o,y=v+p+r,w=Yu(a,a.VERTEX_SHADER,x),S=Yu(a,a.FRAGMENT_SHADER,y);a.attachShader(_,w),a.attachShader(_,S),e.index0AttributeName!==void 0?a.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function T(R){if(n.debug.checkShaderErrors){const k=a.getProgramInfoLog(_).trim(),C=a.getShaderInfoLog(w).trim(),I=a.getShaderInfoLog(S).trim();let L=!0,D=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(L=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(a,_,w,S);else{const O=Zu(a,w,"vertex"),B=Zu(a,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+k+`
`+O+`
`+B)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(C===""||I==="")&&(D=!1);D&&(R.diagnostics={runnable:L,programLog:k,vertexShader:{log:C,prefix:g},fragmentShader:{log:I,prefix:p}})}a.deleteShader(w),a.deleteShader(S),E=new yr(a,_),M=Zw(a,_)}let E;this.getUniforms=function(){return E===void 0&&T(this),E};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=a.getProgramParameter(_,Ow)),b},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bw++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=S,this}let oE=0;class rE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,a=this._getShaderStage(e),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new cE(t),e.set(t,i)),i}}class cE{constructor(t){this.id=oE++,this.code=t,this.usedTimes=0}}function lE(n,t,e,i,a,s,o){const r=new Oh,l=new rE,c=new Set,d=[],u=a.logarithmicDepthBuffer,h=a.vertexTextures;let f=a.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,b,R,k,C){const I=k.fog,L=C.geometry,D=M.isMeshStandardMaterial?k.environment:null,O=(M.isMeshStandardMaterial?e:t).get(M.envMap||D),B=O&&O.mapping===Wr?O.image.height:null,V=m[M.type];M.precision!==null&&(f=a.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const ot=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,gt=ot!==void 0?ot.length:0;let vt=0;L.morphAttributes.position!==void 0&&(vt=1),L.morphAttributes.normal!==void 0&&(vt=2),L.morphAttributes.color!==void 0&&(vt=3);let It,K,it,ct;if(V){const ae=xi[V];It=ae.vertexShader,K=ae.fragmentShader}else It=M.vertexShader,K=M.fragmentShader,l.update(M),it=l.getVertexShaderID(M),ct=l.getFragmentShaderID(M);const Z=n.getRenderTarget(),J=n.state.buffers.depth.getReversed(),lt=C.isInstancedMesh===!0,Ht=C.isBatchedMesh===!0,qt=!!M.map,Ct=!!M.matcap,q=!!O,U=!!M.aoMap,Nt=!!M.lightMap,Dt=!!M.bumpMap,St=!!M.normalMap,_t=!!M.displacementMap,xt=!!M.emissiveMap,Rt=!!M.metalnessMap,F=!!M.roughnessMap,A=M.anisotropy>0,G=M.clearcoat>0,pt=M.dispersion>0,Q=M.iridescence>0,rt=M.sheen>0,Ft=M.transmission>0,tt=A&&!!M.anisotropyMap,ut=G&&!!M.clearcoatMap,Ut=G&&!!M.clearcoatNormalMap,at=G&&!!M.clearcoatRoughnessMap,bt=Q&&!!M.iridescenceMap,H=Q&&!!M.iridescenceThicknessMap,ht=rt&&!!M.sheenColorMap,yt=rt&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Ot=!!M.specularColorMap,Lt=!!M.specularIntensityMap,N=Ft&&!!M.transmissionMap,wt=Ft&&!!M.thicknessMap,st=!!M.gradientMap,dt=!!M.alphaMap,Et=M.alphaTest>0,Tt=!!M.alphaHash,Qt=!!M.extensions;let re=ta;M.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(re=n.toneMapping);const de={shaderID:V,shaderType:M.type,shaderName:M.name,vertexShader:It,fragmentShader:K,defines:M.defines,customVertexShaderID:it,customFragmentShaderID:ct,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Ht,batchingColor:Ht&&C._colorsTexture!==null,instancing:lt,instancingColor:lt&&C.instanceColor!==null,instancingMorph:lt&&C.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:As,alphaToCoverage:!!M.alphaToCoverage,map:qt,matcap:Ct,envMap:q,envMapMode:q&&O.mapping,envMapCubeUVHeight:B,aoMap:U,lightMap:Nt,bumpMap:Dt,normalMap:St,displacementMap:h&&_t,emissiveMap:xt,normalMapObjectSpace:St&&M.normalMapType===nM,normalMapTangentSpace:St&&M.normalMapType===Cp,metalnessMap:Rt,roughnessMap:F,anisotropy:A,anisotropyMap:tt,clearcoat:G,clearcoatMap:ut,clearcoatNormalMap:Ut,clearcoatRoughnessMap:at,dispersion:pt,iridescence:Q,iridescenceMap:bt,iridescenceThicknessMap:H,sheen:rt,sheenColorMap:ht,sheenRoughnessMap:yt,specularMap:Gt,specularColorMap:Ot,specularIntensityMap:Lt,transmission:Ft,transmissionMap:N,thicknessMap:wt,gradientMap:st,opaque:M.transparent===!1&&M.blending===fs&&M.alphaToCoverage===!1,alphaMap:dt,alphaTest:Et,alphaHash:Tt,combine:M.combine,mapUv:qt&&_(M.map.channel),aoMapUv:U&&_(M.aoMap.channel),lightMapUv:Nt&&_(M.lightMap.channel),bumpMapUv:Dt&&_(M.bumpMap.channel),normalMapUv:St&&_(M.normalMap.channel),displacementMapUv:_t&&_(M.displacementMap.channel),emissiveMapUv:xt&&_(M.emissiveMap.channel),metalnessMapUv:Rt&&_(M.metalnessMap.channel),roughnessMapUv:F&&_(M.roughnessMap.channel),anisotropyMapUv:tt&&_(M.anisotropyMap.channel),clearcoatMapUv:ut&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Ut&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:H&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:yt&&_(M.sheenRoughnessMap.channel),specularMapUv:Gt&&_(M.specularMap.channel),specularColorMapUv:Ot&&_(M.specularColorMap.channel),specularIntensityMapUv:Lt&&_(M.specularIntensityMap.channel),transmissionMapUv:N&&_(M.transmissionMap.channel),thicknessMapUv:wt&&_(M.thicknessMap.channel),alphaMapUv:dt&&_(M.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(St||A),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!L.attributes.uv&&(qt||dt),fog:!!I,useFog:M.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:J,skinning:C.isSkinnedMesh===!0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:vt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:re,decodeVideoTexture:qt&&M.map.isVideoTexture===!0&&Ae.getTransfer(M.map.colorSpace)===Ne,decodeVideoTextureEmissive:xt&&M.emissiveMap.isVideoTexture===!0&&Ae.getTransfer(M.emissiveMap.colorSpace)===Ne,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Qe,flipSided:M.side===zn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Qt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&M.extensions.multiDraw===!0||Ht)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return de.vertexUv1s=c.has(1),de.vertexUv2s=c.has(2),de.vertexUv3s=c.has(3),c.clear(),de}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const R in M.defines)b.push(R),b.push(M.defines[R]);return M.isRawShaderMaterial===!1&&(v(b,M),x(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function v(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function x(M,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),M.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reverseDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),M.push(r.mask)}function y(M){const b=m[M.type];let R;if(b){const k=xi[b];R=YM.clone(k.uniforms)}else R=M.uniforms;return R}function w(M,b){let R;for(let k=0,C=d.length;k<C;k++){const I=d[k];if(I.cacheKey===b){R=I,++R.usedTimes;break}}return R===void 0&&(R=new sE(n,b,M,s),d.push(R)),R}function S(M){if(--M.usedTimes===0){const b=d.indexOf(M);d[b]=d[d.length-1],d.pop(),M.destroy()}}function T(M){l.remove(M)}function E(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:w,releaseProgram:S,releaseShaderCache:T,programs:d,dispose:E}}function hE(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let r=n.get(o);return r===void 0&&(r={},n.set(o,r)),r}function i(o){n.delete(o)}function a(o,r,l){n.get(o)[r]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:a,dispose:s}}function dE(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Qu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function tf(){const n=[];let t=0;const e=[],i=[],a=[];function s(){t=0,e.length=0,i.length=0,a.length=0}function o(u,h,f,m,_,g){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:h,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},n[t]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),t++,p}function r(u,h,f,m,_,g){const p=o(u,h,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?a.push(p):e.push(p)}function l(u,h,f,m,_,g){const p=o(u,h,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?a.unshift(p):e.unshift(p)}function c(u,h){e.length>1&&e.sort(u||dE),i.length>1&&i.sort(h||Qu),a.length>1&&a.sort(h||Qu)}function d(){for(let u=t,h=n.length;u<h;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:a,init:s,push:r,unshift:l,finish:d,sort:c}}function uE(){let n=new WeakMap;function t(i,a){const s=n.get(i);let o;return s===void 0?(o=new tf,n.set(i,[o])):a>=s.length?(o=new tf,s.push(o)):o=s[a],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function fE(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new ie};break;case"SpotLight":e={position:new X,direction:new X,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new ie,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":e={color:new ie,position:new X,halfWidth:new X,halfHeight:new X};break}return n[t.id]=e,e}}}function pE(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Yt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let mE=0;function gE(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function xE(n){const t=new fE,e=pE(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new X);const a=new X,s=new Pe,o=new Pe;function r(c){let d=0,u=0,h=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,v=0,x=0,y=0,w=0,S=0,T=0;c.sort(gE);for(let M=0,b=c.length;M<b;M++){const R=c[M],k=R.color,C=R.intensity,I=R.distance,L=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=k.r*C,u+=k.g*C,h+=k.b*C;else if(R.isLightProbe){for(let D=0;D<9;D++)i.probe[D].addScaledVector(R.sh.coefficients[D],C);T++}else if(R.isDirectionalLight){const D=t.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const O=R.shadow,B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.directionalShadow[f]=B,i.directionalShadowMap[f]=L,i.directionalShadowMatrix[f]=R.shadow.matrix,v++}i.directional[f]=D,f++}else if(R.isSpotLight){const D=t.get(R);D.position.setFromMatrixPosition(R.matrixWorld),D.color.copy(k).multiplyScalar(C),D.distance=I,D.coneCos=Math.cos(R.angle),D.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),D.decay=R.decay,i.spot[_]=D;const O=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,O.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[_]=O.matrix,R.castShadow){const B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=L,y++}_++}else if(R.isRectAreaLight){const D=t.get(R);D.color.copy(k).multiplyScalar(C),D.halfWidth.set(R.width*.5,0,0),D.halfHeight.set(0,R.height*.5,0),i.rectArea[g]=D,g++}else if(R.isPointLight){const D=t.get(R);if(D.color.copy(R.color).multiplyScalar(R.intensity),D.distance=R.distance,D.decay=R.decay,R.castShadow){const O=R.shadow,B=e.get(R);B.shadowIntensity=O.intensity,B.shadowBias=O.bias,B.shadowNormalBias=O.normalBias,B.shadowRadius=O.radius,B.shadowMapSize=O.mapSize,B.shadowCameraNear=O.camera.near,B.shadowCameraFar=O.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=L,i.pointShadowMatrix[m]=R.shadow.matrix,x++}i.point[m]=D,m++}else if(R.isHemisphereLight){const D=t.get(R);D.skyColor.copy(R.color).multiplyScalar(C),D.groundColor.copy(R.groundColor).multiplyScalar(C),i.hemi[p]=D,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Xt.LTC_FLOAT_1,i.rectAreaLTC2=Xt.LTC_FLOAT_2):(i.rectAreaLTC1=Xt.LTC_HALF_1,i.rectAreaLTC2=Xt.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const E=i.hash;(E.directionalLength!==f||E.pointLength!==m||E.spotLength!==_||E.rectAreaLength!==g||E.hemiLength!==p||E.numDirectionalShadows!==v||E.numPointShadows!==x||E.numSpotShadows!==y||E.numSpotMaps!==w||E.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+w-S,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,E.directionalLength=f,E.pointLength=m,E.spotLength=_,E.rectAreaLength=g,E.hemiLength=p,E.numDirectionalShadows=v,E.numPointShadows=x,E.numSpotShadows=y,E.numSpotMaps=w,E.numLightProbes=T,i.version=mE++)}function l(c,d){let u=0,h=0,f=0,m=0,_=0;const g=d.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const x=c[p];if(x.isDirectionalLight){const y=i.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),u++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),a.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const y=i.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),h++}else if(x.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),_++}}}return{setup:r,setupView:l,state:i}}function ef(n){const t=new xE(n),e=[],i=[];function a(d){c.camera=d,e.length=0,i.length=0}function s(d){e.push(d)}function o(d){i.push(d)}function r(){t.setup(e)}function l(d){t.setupView(e,d)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:r,setupLightsView:l,pushLight:s,pushShadow:o}}function vE(n){let t=new WeakMap;function e(a,s=0){const o=t.get(a);let r;return o===void 0?(r=new ef(n),t.set(a,[r])):s>=o.length?(r=new ef(n),o.push(r)):r=o[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}class yE extends La{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=tM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class _E extends La{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ME=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bE=`uniform sampler2D shadow_pass;
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
}`;function SE(n,t,e){let i=new Bh;const a=new Yt,s=new Yt,o=new tn,r=new yE({depthPacking:eM}),l=new _E,c={},d=e.maxTextureSize,u={[ia]:zn,[zn]:ia,[Qe]:Qe},h=new aa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Yt},radius:{value:4}},vertexShader:ME,fragmentShader:bE}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const m=new on;m.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new _e(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vp;let p=this.type;this.render=function(S,T,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Qi),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const C=p!==Di&&this.type===Di,I=p===Di&&this.type!==Di;for(let L=0,D=S.length;L<D;L++){const O=S[L],B=O.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;a.copy(B.mapSize);const V=B.getFrameExtents();if(a.multiply(V),s.copy(B.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(s.x=Math.floor(d/V.x),a.x=s.x*V.x,B.mapSize.x=s.x),a.y>d&&(s.y=Math.floor(d/V.y),a.y=s.y*V.y,B.mapSize.y=s.y)),B.map===null||C===!0||I===!0){const gt=this.type!==Di?{minFilter:Yn,magFilter:Yn}:{};B.map!==null&&B.map.dispose(),B.map=new Aa(a.x,a.y,gt),B.map.texture.name=O.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const ot=B.getViewportCount();for(let gt=0;gt<ot;gt++){const vt=B.getViewport(gt);o.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),k.viewport(o),B.updateMatrices(O,gt),i=B.getFrustum(),y(T,E,B.camera,O,this.type)}B.isPointLightShadow!==!0&&this.type===Di&&v(B,E),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(M,b,R)};function v(S,T){const E=t.update(_);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Aa(a.x,a.y)),h.uniforms.shadow_pass.value=S.map.texture,h.uniforms.resolution.value=S.mapSize,h.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(T,null,E,h,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(T,null,E,f,_,null)}function x(S,T,E,M){let b=null;const R=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)b=R;else if(b=E.isPointLight===!0?l:r,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const k=b.uuid,C=T.uuid;let I=c[k];I===void 0&&(I={},c[k]=I);let L=I[C];L===void 0&&(L=b.clone(),I[C]=L,T.addEventListener("dispose",w)),b=L}if(b.visible=T.visible,b.wireframe=T.wireframe,M===Di?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,E.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const k=n.properties.get(b);k.light=E}return b}function y(S,T,E,M,b){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===Di)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const C=t.update(S),I=S.material;if(Array.isArray(I)){const L=C.groups;for(let D=0,O=L.length;D<O;D++){const B=L[D],V=I[B.materialIndex];if(V&&V.visible){const ot=x(S,V,M,b);S.onBeforeShadow(n,S,T,E,C,ot,B),n.renderBufferDirect(E,null,C,ot,S,B),S.onAfterShadow(n,S,T,E,C,ot,B)}}}else if(I.visible){const L=x(S,I,M,b);S.onBeforeShadow(n,S,T,E,C,L,null),n.renderBufferDirect(E,null,C,L,S,null),S.onAfterShadow(n,S,T,E,C,L,null)}}const k=S.children;for(let C=0,I=k.length;C<I;C++)y(k[C],T,E,M,b)}function w(S){S.target.removeEventListener("dispose",w);for(const E in c){const M=c[E],b=S.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const wE={[Al]:Rl,[Pl]:Dl,[Cl]:kl,[Ms]:Ll,[Rl]:Al,[Dl]:Pl,[kl]:Cl,[Ll]:Ms};function EE(n,t){function e(){let N=!1;const wt=new tn;let st=null;const dt=new tn(0,0,0,0);return{setMask:function(Et){st!==Et&&!N&&(n.colorMask(Et,Et,Et,Et),st=Et)},setLocked:function(Et){N=Et},setClear:function(Et,Tt,Qt,re,de){de===!0&&(Et*=re,Tt*=re,Qt*=re),wt.set(Et,Tt,Qt,re),dt.equals(wt)===!1&&(n.clearColor(Et,Tt,Qt,re),dt.copy(wt))},reset:function(){N=!1,st=null,dt.set(-1,0,0,0)}}}function i(){let N=!1,wt=!1,st=null,dt=null,Et=null;return{setReversed:function(Tt){if(wt!==Tt){const Qt=t.get("EXT_clip_control");wt?Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.ZERO_TO_ONE_EXT):Qt.clipControlEXT(Qt.LOWER_LEFT_EXT,Qt.NEGATIVE_ONE_TO_ONE_EXT);const re=Et;Et=null,this.setClear(re)}wt=Tt},getReversed:function(){return wt},setTest:function(Tt){Tt?Z(n.DEPTH_TEST):J(n.DEPTH_TEST)},setMask:function(Tt){st!==Tt&&!N&&(n.depthMask(Tt),st=Tt)},setFunc:function(Tt){if(wt&&(Tt=wE[Tt]),dt!==Tt){switch(Tt){case Al:n.depthFunc(n.NEVER);break;case Rl:n.depthFunc(n.ALWAYS);break;case Pl:n.depthFunc(n.LESS);break;case Ms:n.depthFunc(n.LEQUAL);break;case Cl:n.depthFunc(n.EQUAL);break;case Ll:n.depthFunc(n.GEQUAL);break;case Dl:n.depthFunc(n.GREATER);break;case kl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}dt=Tt}},setLocked:function(Tt){N=Tt},setClear:function(Tt){Et!==Tt&&(wt&&(Tt=1-Tt),n.clearDepth(Tt),Et=Tt)},reset:function(){N=!1,st=null,dt=null,Et=null,wt=!1}}}function a(){let N=!1,wt=null,st=null,dt=null,Et=null,Tt=null,Qt=null,re=null,de=null;return{setTest:function(ae){N||(ae?Z(n.STENCIL_TEST):J(n.STENCIL_TEST))},setMask:function(ae){wt!==ae&&!N&&(n.stencilMask(ae),wt=ae)},setFunc:function(ae,Te,ge){(st!==ae||dt!==Te||Et!==ge)&&(n.stencilFunc(ae,Te,ge),st=ae,dt=Te,Et=ge)},setOp:function(ae,Te,ge){(Tt!==ae||Qt!==Te||re!==ge)&&(n.stencilOp(ae,Te,ge),Tt=ae,Qt=Te,re=ge)},setLocked:function(ae){N=ae},setClear:function(ae){de!==ae&&(n.clearStencil(ae),de=ae)},reset:function(){N=!1,wt=null,st=null,dt=null,Et=null,Tt=null,Qt=null,re=null,de=null}}}const s=new e,o=new i,r=new a,l=new WeakMap,c=new WeakMap;let d={},u={},h=new WeakMap,f=[],m=null,_=!1,g=null,p=null,v=null,x=null,y=null,w=null,S=null,T=new ie(0,0,0),E=0,M=!1,b=null,R=null,k=null,C=null,I=null;const L=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,O=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(B)[1]),D=O>=1):B.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),D=O>=2);let V=null,ot={};const gt=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),It=new tn().fromArray(gt),K=new tn().fromArray(vt);function it(N,wt,st,dt){const Et=new Uint8Array(4),Tt=n.createTexture();n.bindTexture(N,Tt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Qt=0;Qt<st;Qt++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(wt,0,n.RGBA,1,1,dt,0,n.RGBA,n.UNSIGNED_BYTE,Et):n.texImage2D(wt+Qt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Et);return Tt}const ct={};ct[n.TEXTURE_2D]=it(n.TEXTURE_2D,n.TEXTURE_2D,1),ct[n.TEXTURE_CUBE_MAP]=it(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[n.TEXTURE_2D_ARRAY]=it(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ct[n.TEXTURE_3D]=it(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),r.setClear(0),Z(n.DEPTH_TEST),o.setFunc(Ms),Dt(!1),St(su),Z(n.CULL_FACE),U(Qi);function Z(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function J(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function lt(N,wt){return u[N]!==wt?(n.bindFramebuffer(N,wt),u[N]=wt,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=wt),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=wt),!0):!1}function Ht(N,wt){let st=f,dt=!1;if(N){st=h.get(wt),st===void 0&&(st=[],h.set(wt,st));const Et=N.textures;if(st.length!==Et.length||st[0]!==n.COLOR_ATTACHMENT0){for(let Tt=0,Qt=Et.length;Tt<Qt;Tt++)st[Tt]=n.COLOR_ATTACHMENT0+Tt;st.length=Et.length,dt=!0}}else st[0]!==n.BACK&&(st[0]=n.BACK,dt=!0);dt&&n.drawBuffers(st)}function qt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const Ct={[_a]:n.FUNC_ADD,[A_]:n.FUNC_SUBTRACT,[R_]:n.FUNC_REVERSE_SUBTRACT};Ct[P_]=n.MIN,Ct[C_]=n.MAX;const q={[L_]:n.ZERO,[D_]:n.ONE,[k_]:n.SRC_COLOR,[El]:n.SRC_ALPHA,[O_]:n.SRC_ALPHA_SATURATE,[U_]:n.DST_COLOR,[z_]:n.DST_ALPHA,[I_]:n.ONE_MINUS_SRC_COLOR,[Tl]:n.ONE_MINUS_SRC_ALPHA,[N_]:n.ONE_MINUS_DST_COLOR,[F_]:n.ONE_MINUS_DST_ALPHA,[B_]:n.CONSTANT_COLOR,[H_]:n.ONE_MINUS_CONSTANT_COLOR,[G_]:n.CONSTANT_ALPHA,[X_]:n.ONE_MINUS_CONSTANT_ALPHA};function U(N,wt,st,dt,Et,Tt,Qt,re,de,ae){if(N===Qi){_===!0&&(J(n.BLEND),_=!1);return}if(_===!1&&(Z(n.BLEND),_=!0),N!==T_){if(N!==g||ae!==M){if((p!==_a||y!==_a)&&(n.blendEquation(n.FUNC_ADD),p=_a,y=_a),ae)switch(N){case fs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.ONE,n.ONE);break;case ou:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ru:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case fs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ki:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ou:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ru:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}v=null,x=null,w=null,S=null,T.set(0,0,0),E=0,g=N,M=ae}return}Et=Et||wt,Tt=Tt||st,Qt=Qt||dt,(wt!==p||Et!==y)&&(n.blendEquationSeparate(Ct[wt],Ct[Et]),p=wt,y=Et),(st!==v||dt!==x||Tt!==w||Qt!==S)&&(n.blendFuncSeparate(q[st],q[dt],q[Tt],q[Qt]),v=st,x=dt,w=Tt,S=Qt),(re.equals(T)===!1||de!==E)&&(n.blendColor(re.r,re.g,re.b,de),T.copy(re),E=de),g=N,M=!1}function Nt(N,wt){N.side===Qe?J(n.CULL_FACE):Z(n.CULL_FACE);let st=N.side===zn;wt&&(st=!st),Dt(st),N.blending===fs&&N.transparent===!1?U(Qi):U(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const dt=N.stencilWrite;r.setTest(dt),dt&&(r.setMask(N.stencilWriteMask),r.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),r.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),xt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):J(n.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function St(N){N!==w_?(Z(n.CULL_FACE),N!==R&&(N===su?n.cullFace(n.BACK):N===E_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):J(n.CULL_FACE),R=N}function _t(N){N!==k&&(D&&n.lineWidth(N),k=N)}function xt(N,wt,st){N?(Z(n.POLYGON_OFFSET_FILL),(C!==wt||I!==st)&&(n.polygonOffset(wt,st),C=wt,I=st)):J(n.POLYGON_OFFSET_FILL)}function Rt(N){N?Z(n.SCISSOR_TEST):J(n.SCISSOR_TEST)}function F(N){N===void 0&&(N=n.TEXTURE0+L-1),V!==N&&(n.activeTexture(N),V=N)}function A(N,wt,st){st===void 0&&(V===null?st=n.TEXTURE0+L-1:st=V);let dt=ot[st];dt===void 0&&(dt={type:void 0,texture:void 0},ot[st]=dt),(dt.type!==N||dt.texture!==wt)&&(V!==st&&(n.activeTexture(st),V=st),n.bindTexture(N,wt||ct[N]),dt.type=N,dt.texture=wt)}function G(){const N=ot[V];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function pt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function tt(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ut(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function at(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function H(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ht(N){It.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),It.copy(N))}function yt(N){K.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),K.copy(N))}function Gt(N,wt){let st=c.get(wt);st===void 0&&(st=new WeakMap,c.set(wt,st));let dt=st.get(N);dt===void 0&&(dt=n.getUniformBlockIndex(wt,N.name),st.set(N,dt))}function Ot(N,wt){const dt=c.get(wt).get(N);l.get(wt)!==dt&&(n.uniformBlockBinding(wt,dt,N.__bindingPointIndex),l.set(wt,dt))}function Lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},V=null,ot={},u={},h=new WeakMap,f=[],m=null,_=!1,g=null,p=null,v=null,x=null,y=null,w=null,S=null,T=new ie(0,0,0),E=0,M=!1,b=null,R=null,k=null,C=null,I=null,It.set(0,0,n.canvas.width,n.canvas.height),K.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),r.reset()}return{buffers:{color:s,depth:o,stencil:r},enable:Z,disable:J,bindFramebuffer:lt,drawBuffers:Ht,useProgram:qt,setBlending:U,setMaterial:Nt,setFlipSided:Dt,setCullFace:St,setLineWidth:_t,setPolygonOffset:xt,setScissorTest:Rt,activeTexture:F,bindTexture:A,unbindTexture:G,compressedTexImage2D:pt,compressedTexImage3D:Q,texImage2D:bt,texImage3D:H,updateUBOMapping:Gt,uniformBlockBinding:Ot,texStorage2D:Ut,texStorage3D:at,texSubImage2D:rt,texSubImage3D:Ft,compressedTexSubImage2D:tt,compressedTexSubImage3D:ut,scissor:ht,viewport:yt,reset:Lt}}function nf(n,t,e,i){const a=TE(i);switch(e){case wp:return n*t;case Tp:return n*t;case Ap:return n*t*2;case kh:return n*t/a.components*a.byteLength;case Ih:return n*t/a.components*a.byteLength;case Rp:return n*t*2/a.components*a.byteLength;case zh:return n*t*2/a.components*a.byteLength;case Ep:return n*t*3/a.components*a.byteLength;case ri:return n*t*4/a.components*a.byteLength;case Fh:return n*t*4/a.components*a.byteLength;case pr:case mr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case gr:case xr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ol:case Hl:return Math.max(n,16)*Math.max(t,8)/4;case Nl:case Bl:return Math.max(n,8)*Math.max(t,8)/2;case Gl:case Xl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Vl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Wl:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Yl:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case $l:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Zl:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case jl:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case ql:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Kl:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Jl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Ql:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case th:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case eh:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case nh:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case ih:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ah:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case vr:case sh:case oh:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Pp:case rh:return Math.ceil(n/4)*Math.ceil(t/4)*8;case ch:case lh:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function TE(n){switch(n){case Ui:case Mp:return{byteLength:1,components:1};case po:case bp:case Mo:return{byteLength:2,components:1};case Lh:case Dh:return{byteLength:2,components:4};case Ta:case Ch:case yi:return{byteLength:4,components:1};case Sp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function AE(n,t,e,i,a,s,o){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Yt,d=new WeakMap;let u;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(F,A){return f?new OffscreenCanvas(F,A):Ir("canvas")}function _(F,A,G){let pt=1;const Q=Rt(F);if((Q.width>G||Q.height>G)&&(pt=G/Math.max(Q.width,Q.height)),pt<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const rt=Math.floor(pt*Q.width),Ft=Math.floor(pt*Q.height);u===void 0&&(u=m(rt,Ft));const tt=A?m(rt,Ft):u;return tt.width=rt,tt.height=Ft,tt.getContext("2d").drawImage(F,0,0,rt,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+rt+"x"+Ft+")."),tt}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),F;return F}function g(F){return F.generateMipmaps}function p(F){n.generateMipmap(F)}function v(F){return F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:F.isWebGL3DRenderTarget?n.TEXTURE_3D:F.isWebGLArrayRenderTarget||F.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(F,A,G,pt,Q=!1){if(F!==null){if(n[F]!==void 0)return n[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let rt=A;if(A===n.RED&&(G===n.FLOAT&&(rt=n.R32F),G===n.HALF_FLOAT&&(rt=n.R16F),G===n.UNSIGNED_BYTE&&(rt=n.R8)),A===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(rt=n.R8UI),G===n.UNSIGNED_SHORT&&(rt=n.R16UI),G===n.UNSIGNED_INT&&(rt=n.R32UI),G===n.BYTE&&(rt=n.R8I),G===n.SHORT&&(rt=n.R16I),G===n.INT&&(rt=n.R32I)),A===n.RG&&(G===n.FLOAT&&(rt=n.RG32F),G===n.HALF_FLOAT&&(rt=n.RG16F),G===n.UNSIGNED_BYTE&&(rt=n.RG8)),A===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(rt=n.RG8UI),G===n.UNSIGNED_SHORT&&(rt=n.RG16UI),G===n.UNSIGNED_INT&&(rt=n.RG32UI),G===n.BYTE&&(rt=n.RG8I),G===n.SHORT&&(rt=n.RG16I),G===n.INT&&(rt=n.RG32I)),A===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(rt=n.RGB8UI),G===n.UNSIGNED_SHORT&&(rt=n.RGB16UI),G===n.UNSIGNED_INT&&(rt=n.RGB32UI),G===n.BYTE&&(rt=n.RGB8I),G===n.SHORT&&(rt=n.RGB16I),G===n.INT&&(rt=n.RGB32I)),A===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(rt=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(rt=n.RGBA16UI),G===n.UNSIGNED_INT&&(rt=n.RGBA32UI),G===n.BYTE&&(rt=n.RGBA8I),G===n.SHORT&&(rt=n.RGBA16I),G===n.INT&&(rt=n.RGBA32I)),A===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(rt=n.RGB9_E5),A===n.RGBA){const Ft=Q?Yr:Ae.getTransfer(pt);G===n.FLOAT&&(rt=n.RGBA32F),G===n.HALF_FLOAT&&(rt=n.RGBA16F),G===n.UNSIGNED_BYTE&&(rt=Ft===Ne?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(rt=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(rt=n.RGB5_A1)}return(rt===n.R16F||rt===n.R32F||rt===n.RG16F||rt===n.RG32F||rt===n.RGBA16F||rt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function y(F,A){let G;return F?A===null||A===Ta||A===ws?G=n.DEPTH24_STENCIL8:A===yi?G=n.DEPTH32F_STENCIL8:A===po&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ta||A===ws?G=n.DEPTH_COMPONENT24:A===yi?G=n.DEPTH_COMPONENT32F:A===po&&(G=n.DEPTH_COMPONENT16),G}function w(F,A){return g(F)===!0||F.isFramebufferTexture&&F.minFilter!==Yn&&F.minFilter!==vi?Math.log2(Math.max(A.width,A.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?A.mipmaps.length:1}function S(F){const A=F.target;A.removeEventListener("dispose",S),E(A),A.isVideoTexture&&d.delete(A)}function T(F){const A=F.target;A.removeEventListener("dispose",T),b(A)}function E(F){const A=i.get(F);if(A.__webglInit===void 0)return;const G=F.source,pt=h.get(G);if(pt){const Q=pt[A.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(F),Object.keys(pt).length===0&&h.delete(G)}i.remove(F)}function M(F){const A=i.get(F);n.deleteTexture(A.__webglTexture);const G=F.source,pt=h.get(G);delete pt[A.__cacheKey],o.memory.textures--}function b(F){const A=i.get(F);if(F.depthTexture&&(F.depthTexture.dispose(),i.remove(F.depthTexture)),F.isWebGLCubeRenderTarget)for(let pt=0;pt<6;pt++){if(Array.isArray(A.__webglFramebuffer[pt]))for(let Q=0;Q<A.__webglFramebuffer[pt].length;Q++)n.deleteFramebuffer(A.__webglFramebuffer[pt][Q]);else n.deleteFramebuffer(A.__webglFramebuffer[pt]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[pt])}else{if(Array.isArray(A.__webglFramebuffer))for(let pt=0;pt<A.__webglFramebuffer.length;pt++)n.deleteFramebuffer(A.__webglFramebuffer[pt]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let pt=0;pt<A.__webglColorRenderbuffer.length;pt++)A.__webglColorRenderbuffer[pt]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[pt]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const G=F.textures;for(let pt=0,Q=G.length;pt<Q;pt++){const rt=i.get(G[pt]);rt.__webglTexture&&(n.deleteTexture(rt.__webglTexture),o.memory.textures--),i.remove(G[pt])}i.remove(F)}let R=0;function k(){R=0}function C(){const F=R;return F>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+a.maxTextures),R+=1,F}function I(F){const A=[];return A.push(F.wrapS),A.push(F.wrapT),A.push(F.wrapR||0),A.push(F.magFilter),A.push(F.minFilter),A.push(F.anisotropy),A.push(F.internalFormat),A.push(F.format),A.push(F.type),A.push(F.generateMipmaps),A.push(F.premultiplyAlpha),A.push(F.flipY),A.push(F.unpackAlignment),A.push(F.colorSpace),A.join()}function L(F,A){const G=i.get(F);if(F.isVideoTexture&&_t(F),F.isRenderTargetTexture===!1&&F.version>0&&G.__version!==F.version){const pt=F.image;if(pt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(G,F,A);return}}e.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+A)}function D(F,A){const G=i.get(F);if(F.version>0&&G.__version!==F.version){K(G,F,A);return}e.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+A)}function O(F,A){const G=i.get(F);if(F.version>0&&G.__version!==F.version){K(G,F,A);return}e.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+A)}function B(F,A){const G=i.get(F);if(F.version>0&&G.__version!==F.version){it(G,F,A);return}e.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+A)}const V={[Fl]:n.REPEAT,[ba]:n.CLAMP_TO_EDGE,[Ul]:n.MIRRORED_REPEAT},ot={[Yn]:n.NEAREST,[Q_]:n.NEAREST_MIPMAP_NEAREST,[ko]:n.NEAREST_MIPMAP_LINEAR,[vi]:n.LINEAR,[wc]:n.LINEAR_MIPMAP_NEAREST,[Sa]:n.LINEAR_MIPMAP_LINEAR},gt={[iM]:n.NEVER,[lM]:n.ALWAYS,[aM]:n.LESS,[Lp]:n.LEQUAL,[sM]:n.EQUAL,[cM]:n.GEQUAL,[oM]:n.GREATER,[rM]:n.NOTEQUAL};function vt(F,A){if(A.type===yi&&t.has("OES_texture_float_linear")===!1&&(A.magFilter===vi||A.magFilter===wc||A.magFilter===ko||A.magFilter===Sa||A.minFilter===vi||A.minFilter===wc||A.minFilter===ko||A.minFilter===Sa)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,V[A.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,V[A.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,V[A.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,ot[A.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,ot[A.minFilter]),A.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,gt[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Yn||A.minFilter!==ko&&A.minFilter!==Sa||A.type===yi&&t.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||i.get(A).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");n.texParameterf(F,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,a.getMaxAnisotropy())),i.get(A).__currentAnisotropy=A.anisotropy}}}function It(F,A){let G=!1;F.__webglInit===void 0&&(F.__webglInit=!0,A.addEventListener("dispose",S));const pt=A.source;let Q=h.get(pt);Q===void 0&&(Q={},h.set(pt,Q));const rt=I(A);if(rt!==F.__cacheKey){Q[rt]===void 0&&(Q[rt]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,G=!0),Q[rt].usedTimes++;const Ft=Q[F.__cacheKey];Ft!==void 0&&(Q[F.__cacheKey].usedTimes--,Ft.usedTimes===0&&M(A)),F.__cacheKey=rt,F.__webglTexture=Q[rt].texture}return G}function K(F,A,G){let pt=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(pt=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(pt=n.TEXTURE_3D);const Q=It(F,A),rt=A.source;e.bindTexture(pt,F.__webglTexture,n.TEXTURE0+G);const Ft=i.get(rt);if(rt.version!==Ft.__version||Q===!0){e.activeTexture(n.TEXTURE0+G);const tt=Ae.getPrimaries(Ae.workingColorSpace),ut=A.colorSpace===Zi?null:Ae.getPrimaries(A.colorSpace),Ut=A.colorSpace===Zi||tt===ut?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let at=_(A.image,!1,a.maxTextureSize);at=xt(A,at);const bt=s.convert(A.format,A.colorSpace),H=s.convert(A.type);let ht=x(A.internalFormat,bt,H,A.colorSpace,A.isVideoTexture);vt(pt,A);let yt;const Gt=A.mipmaps,Ot=A.isVideoTexture!==!0,Lt=Ft.__version===void 0||Q===!0,N=rt.dataReady,wt=w(A,at);if(A.isDepthTexture)ht=y(A.format===Es,A.type),Lt&&(Ot?e.texStorage2D(n.TEXTURE_2D,1,ht,at.width,at.height):e.texImage2D(n.TEXTURE_2D,0,ht,at.width,at.height,0,bt,H,null));else if(A.isDataTexture)if(Gt.length>0){Ot&&Lt&&e.texStorage2D(n.TEXTURE_2D,wt,ht,Gt[0].width,Gt[0].height);for(let st=0,dt=Gt.length;st<dt;st++)yt=Gt[st],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,st,0,0,yt.width,yt.height,bt,H,yt.data):e.texImage2D(n.TEXTURE_2D,st,ht,yt.width,yt.height,0,bt,H,yt.data);A.generateMipmaps=!1}else Ot?(Lt&&e.texStorage2D(n.TEXTURE_2D,wt,ht,at.width,at.height),N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at.width,at.height,bt,H,at.data)):e.texImage2D(n.TEXTURE_2D,0,ht,at.width,at.height,0,bt,H,at.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ot&&Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,wt,ht,Gt[0].width,Gt[0].height,at.depth);for(let st=0,dt=Gt.length;st<dt;st++)if(yt=Gt[st],A.format!==ri)if(bt!==null)if(Ot){if(N)if(A.layerUpdates.size>0){const Et=nf(yt.width,yt.height,A.format,A.type);for(const Tt of A.layerUpdates){const Qt=yt.data.subarray(Tt*Et/yt.data.BYTES_PER_ELEMENT,(Tt+1)*Et/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,st,0,0,Tt,yt.width,yt.height,1,bt,Qt)}A.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,st,0,0,0,yt.width,yt.height,at.depth,bt,yt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,st,ht,yt.width,yt.height,at.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?N&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,st,0,0,0,yt.width,yt.height,at.depth,bt,H,yt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,st,ht,yt.width,yt.height,at.depth,0,bt,H,yt.data)}else{Ot&&Lt&&e.texStorage2D(n.TEXTURE_2D,wt,ht,Gt[0].width,Gt[0].height);for(let st=0,dt=Gt.length;st<dt;st++)yt=Gt[st],A.format!==ri?bt!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_2D,st,0,0,yt.width,yt.height,bt,yt.data):e.compressedTexImage2D(n.TEXTURE_2D,st,ht,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?N&&e.texSubImage2D(n.TEXTURE_2D,st,0,0,yt.width,yt.height,bt,H,yt.data):e.texImage2D(n.TEXTURE_2D,st,ht,yt.width,yt.height,0,bt,H,yt.data)}else if(A.isDataArrayTexture)if(Ot){if(Lt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,wt,ht,at.width,at.height,at.depth),N)if(A.layerUpdates.size>0){const st=nf(at.width,at.height,A.format,A.type);for(const dt of A.layerUpdates){const Et=at.data.subarray(dt*st/at.data.BYTES_PER_ELEMENT,(dt+1)*st/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,dt,at.width,at.height,1,bt,H,Et)}A.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,bt,H,at.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ht,at.width,at.height,at.depth,0,bt,H,at.data);else if(A.isData3DTexture)Ot?(Lt&&e.texStorage3D(n.TEXTURE_3D,wt,ht,at.width,at.height,at.depth),N&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,bt,H,at.data)):e.texImage3D(n.TEXTURE_3D,0,ht,at.width,at.height,at.depth,0,bt,H,at.data);else if(A.isFramebufferTexture){if(Lt)if(Ot)e.texStorage2D(n.TEXTURE_2D,wt,ht,at.width,at.height);else{let st=at.width,dt=at.height;for(let Et=0;Et<wt;Et++)e.texImage2D(n.TEXTURE_2D,Et,ht,st,dt,0,bt,H,null),st>>=1,dt>>=1}}else if(Gt.length>0){if(Ot&&Lt){const st=Rt(Gt[0]);e.texStorage2D(n.TEXTURE_2D,wt,ht,st.width,st.height)}for(let st=0,dt=Gt.length;st<dt;st++)yt=Gt[st],Ot?N&&e.texSubImage2D(n.TEXTURE_2D,st,0,0,bt,H,yt):e.texImage2D(n.TEXTURE_2D,st,ht,bt,H,yt);A.generateMipmaps=!1}else if(Ot){if(Lt){const st=Rt(at);e.texStorage2D(n.TEXTURE_2D,wt,ht,st.width,st.height)}N&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,bt,H,at)}else e.texImage2D(n.TEXTURE_2D,0,ht,bt,H,at);g(A)&&p(pt),Ft.__version=rt.version,A.onUpdate&&A.onUpdate(A)}F.__version=A.version}function it(F,A,G){if(A.image.length!==6)return;const pt=It(F,A),Q=A.source;e.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+G);const rt=i.get(Q);if(Q.version!==rt.__version||pt===!0){e.activeTexture(n.TEXTURE0+G);const Ft=Ae.getPrimaries(Ae.workingColorSpace),tt=A.colorSpace===Zi?null:Ae.getPrimaries(A.colorSpace),ut=A.colorSpace===Zi||Ft===tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut);const Ut=A.isCompressedTexture||A.image[0].isCompressedTexture,at=A.image[0]&&A.image[0].isDataTexture,bt=[];for(let dt=0;dt<6;dt++)!Ut&&!at?bt[dt]=_(A.image[dt],!0,a.maxCubemapSize):bt[dt]=at?A.image[dt].image:A.image[dt],bt[dt]=xt(A,bt[dt]);const H=bt[0],ht=s.convert(A.format,A.colorSpace),yt=s.convert(A.type),Gt=x(A.internalFormat,ht,yt,A.colorSpace),Ot=A.isVideoTexture!==!0,Lt=rt.__version===void 0||pt===!0,N=Q.dataReady;let wt=w(A,H);vt(n.TEXTURE_CUBE_MAP,A);let st;if(Ut){Ot&&Lt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,wt,Gt,H.width,H.height);for(let dt=0;dt<6;dt++){st=bt[dt].mipmaps;for(let Et=0;Et<st.length;Et++){const Tt=st[Et];A.format!==ri?ht!==null?Ot?N&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et,0,0,Tt.width,Tt.height,ht,Tt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et,Gt,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et,0,0,Tt.width,Tt.height,ht,yt,Tt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et,Gt,Tt.width,Tt.height,0,ht,yt,Tt.data)}}}else{if(st=A.mipmaps,Ot&&Lt){st.length>0&&wt++;const dt=Rt(bt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,wt,Gt,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(at){Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,bt[dt].width,bt[dt].height,ht,yt,bt[dt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Gt,bt[dt].width,bt[dt].height,0,ht,yt,bt[dt].data);for(let Et=0;Et<st.length;Et++){const Qt=st[Et].image[dt].image;Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et+1,0,0,Qt.width,Qt.height,ht,yt,Qt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et+1,Gt,Qt.width,Qt.height,0,ht,yt,Qt.data)}}else{Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,ht,yt,bt[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,Gt,ht,yt,bt[dt]);for(let Et=0;Et<st.length;Et++){const Tt=st[Et];Ot?N&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et+1,0,0,ht,yt,Tt.image[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Et+1,Gt,ht,yt,Tt.image[dt])}}}g(A)&&p(n.TEXTURE_CUBE_MAP),rt.__version=Q.version,A.onUpdate&&A.onUpdate(A)}F.__version=A.version}function ct(F,A,G,pt,Q,rt){const Ft=s.convert(G.format,G.colorSpace),tt=s.convert(G.type),ut=x(G.internalFormat,Ft,tt,G.colorSpace),Ut=i.get(A),at=i.get(G);if(at.__renderTarget=A,!Ut.__hasExternalTextures){const bt=Math.max(1,A.width>>rt),H=Math.max(1,A.height>>rt);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?e.texImage3D(Q,rt,ut,bt,H,A.depth,0,Ft,tt,null):e.texImage2D(Q,rt,ut,bt,H,0,Ft,tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,F),St(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,pt,Q,at.__webglTexture,0,Dt(A)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,pt,Q,at.__webglTexture,rt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Z(F,A,G){if(n.bindRenderbuffer(n.RENDERBUFFER,F),A.depthBuffer){const pt=A.depthTexture,Q=pt&&pt.isDepthTexture?pt.type:null,rt=y(A.stencilBuffer,Q),Ft=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,tt=Dt(A);St(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,tt,rt,A.width,A.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,rt,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,rt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ft,n.RENDERBUFFER,F)}else{const pt=A.textures;for(let Q=0;Q<pt.length;Q++){const rt=pt[Q],Ft=s.convert(rt.format,rt.colorSpace),tt=s.convert(rt.type),ut=x(rt.internalFormat,Ft,tt,rt.colorSpace),Ut=Dt(A);G&&St(A)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ut,ut,A.width,A.height):St(A)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ut,ut,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,ut,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function J(F,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,F),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pt=i.get(A.depthTexture);pt.__renderTarget=A,(!pt.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),L(A.depthTexture,0);const Q=pt.__webglTexture,rt=Dt(A);if(A.depthTexture.format===ps)St(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(A.depthTexture.format===Es)St(A)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function lt(F){const A=i.get(F),G=F.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==F.depthTexture){const pt=F.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),pt){const Q=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,pt.removeEventListener("dispose",Q)};pt.addEventListener("dispose",Q),A.__depthDisposeCallback=Q}A.__boundDepthTexture=pt}if(F.depthTexture&&!A.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");J(A.__webglFramebuffer,F)}else if(G){A.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[pt]),A.__webglDepthbuffer[pt]===void 0)A.__webglDepthbuffer[pt]=n.createRenderbuffer(),Z(A.__webglDepthbuffer[pt],F,!1);else{const Q=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,rt=A.__webglDepthbuffer[pt];n.bindRenderbuffer(n.RENDERBUFFER,rt),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,rt)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),Z(A.__webglDepthbuffer,F,!1);else{const pt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,pt,n.RENDERBUFFER,Q)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ht(F,A,G){const pt=i.get(F);A!==void 0&&ct(pt.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&lt(F)}function qt(F){const A=F.texture,G=i.get(F),pt=i.get(A);F.addEventListener("dispose",T);const Q=F.textures,rt=F.isWebGLCubeRenderTarget===!0,Ft=Q.length>1;if(Ft||(pt.__webglTexture===void 0&&(pt.__webglTexture=n.createTexture()),pt.__version=A.version,o.memory.textures++),rt){G.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer[tt]=[];for(let ut=0;ut<A.mipmaps.length;ut++)G.__webglFramebuffer[tt][ut]=n.createFramebuffer()}else G.__webglFramebuffer[tt]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){G.__webglFramebuffer=[];for(let tt=0;tt<A.mipmaps.length;tt++)G.__webglFramebuffer[tt]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(Ft)for(let tt=0,ut=Q.length;tt<ut;tt++){const Ut=i.get(Q[tt]);Ut.__webglTexture===void 0&&(Ut.__webglTexture=n.createTexture(),o.memory.textures++)}if(F.samples>0&&St(F)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let tt=0;tt<Q.length;tt++){const ut=Q[tt];G.__webglColorRenderbuffer[tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[tt]);const Ut=s.convert(ut.format,ut.colorSpace),at=s.convert(ut.type),bt=x(ut.internalFormat,Ut,at,ut.colorSpace,F.isXRRenderTarget===!0),H=Dt(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,H,bt,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+tt,n.RENDERBUFFER,G.__webglColorRenderbuffer[tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),Z(G.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,pt.__webglTexture),vt(n.TEXTURE_CUBE_MAP,A);for(let tt=0;tt<6;tt++)if(A.mipmaps&&A.mipmaps.length>0)for(let ut=0;ut<A.mipmaps.length;ut++)ct(G.__webglFramebuffer[tt][ut],F,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,ut);else ct(G.__webglFramebuffer[tt],F,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);g(A)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let tt=0,ut=Q.length;tt<ut;tt++){const Ut=Q[tt],at=i.get(Ut);e.bindTexture(n.TEXTURE_2D,at.__webglTexture),vt(n.TEXTURE_2D,Ut),ct(G.__webglFramebuffer,F,Ut,n.COLOR_ATTACHMENT0+tt,n.TEXTURE_2D,0),g(Ut)&&p(n.TEXTURE_2D)}e.unbindTexture()}else{let tt=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(tt=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(tt,pt.__webglTexture),vt(tt,A),A.mipmaps&&A.mipmaps.length>0)for(let ut=0;ut<A.mipmaps.length;ut++)ct(G.__webglFramebuffer[ut],F,A,n.COLOR_ATTACHMENT0,tt,ut);else ct(G.__webglFramebuffer,F,A,n.COLOR_ATTACHMENT0,tt,0);g(A)&&p(tt),e.unbindTexture()}F.depthBuffer&&lt(F)}function Ct(F){const A=F.textures;for(let G=0,pt=A.length;G<pt;G++){const Q=A[G];if(g(Q)){const rt=v(F),Ft=i.get(Q).__webglTexture;e.bindTexture(rt,Ft),p(rt),e.unbindTexture()}}}const q=[],U=[];function Nt(F){if(F.samples>0){if(St(F)===!1){const A=F.textures,G=F.width,pt=F.height;let Q=n.COLOR_BUFFER_BIT;const rt=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ft=i.get(F),tt=A.length>1;if(tt)for(let ut=0;ut<A.length;ut++)e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ut,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ut,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let ut=0;ut<A.length;ut++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[ut]);const Ut=i.get(A[ut]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ut,0)}n.blitFramebuffer(0,0,G,pt,0,0,G,pt,Q,n.NEAREST),l===!0&&(q.length=0,U.length=0,q.push(n.COLOR_ATTACHMENT0+ut),F.depthBuffer&&F.resolveDepthBuffer===!1&&(q.push(rt),U.push(rt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,U)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,q))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),tt)for(let ut=0;ut<A.length;ut++){e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ut,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[ut]);const Ut=i.get(A[ut]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ut,n.TEXTURE_2D,Ut,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&l){const A=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function Dt(F){return Math.min(a.maxSamples,F.samples)}function St(F){const A=i.get(F);return F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function _t(F){const A=o.render.frame;d.get(F)!==A&&(d.set(F,A),F.update())}function xt(F,A){const G=F.colorSpace,pt=F.format,Q=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||G!==As&&G!==Zi&&(Ae.getTransfer(G)===Ne?(pt!==ri||Q!==Ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),A}function Rt(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(c.width=F.naturalWidth||F.width,c.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(c.width=F.displayWidth,c.height=F.displayHeight):(c.width=F.width,c.height=F.height),c}this.allocateTextureUnit=C,this.resetTextureUnits=k,this.setTexture2D=L,this.setTexture2DArray=D,this.setTexture3D=O,this.setTextureCube=B,this.rebindTextures=Ht,this.setupRenderTarget=qt,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=lt,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=St}function RE(n,t){function e(i,a=Zi){let s;const o=Ae.getTransfer(a);if(i===Ui)return n.UNSIGNED_BYTE;if(i===Lh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Dh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Sp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Mp)return n.BYTE;if(i===bp)return n.SHORT;if(i===po)return n.UNSIGNED_SHORT;if(i===Ch)return n.INT;if(i===Ta)return n.UNSIGNED_INT;if(i===yi)return n.FLOAT;if(i===Mo)return n.HALF_FLOAT;if(i===wp)return n.ALPHA;if(i===Ep)return n.RGB;if(i===ri)return n.RGBA;if(i===Tp)return n.LUMINANCE;if(i===Ap)return n.LUMINANCE_ALPHA;if(i===ps)return n.DEPTH_COMPONENT;if(i===Es)return n.DEPTH_STENCIL;if(i===kh)return n.RED;if(i===Ih)return n.RED_INTEGER;if(i===Rp)return n.RG;if(i===zh)return n.RG_INTEGER;if(i===Fh)return n.RGBA_INTEGER;if(i===pr||i===mr||i===gr||i===xr)if(o===Ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===pr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===mr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===pr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===mr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===gr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===xr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nl||i===Ol||i===Bl||i===Hl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Nl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ol)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Bl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Gl||i===Xl||i===Vl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Gl||i===Xl)return o===Ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Vl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Wl||i===Yl||i===$l||i===Zl||i===jl||i===ql||i===Kl||i===Jl||i===Ql||i===th||i===eh||i===nh||i===ih||i===ah)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Wl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Yl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$l)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===jl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ql)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Kl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jl)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ql)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===th)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===eh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nh)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ih)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ah)return o===Ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===vr||i===sh||i===oh)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===vr)return o===Ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Pp||i===rh||i===ch||i===lh)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===vr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===rh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ch)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===lh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ws?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class PE extends qn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Le extends je{constructor(){super(),this.isGroup=!0,this.type="Group"}}const CE={type:"move"};class Kc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let a=null,s=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const g=e.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&h>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=e.getPose(t.targetRaySpace,i),a===null&&s!==null&&(a=s),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(CE)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Le;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const LE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,DE=`
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

}`;class kE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const a=new Sn,s=t.properties.get(a);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=a}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new aa({vertexShader:LE,fragmentShader:DE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new _e(new jn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class IE extends Rs{constructor(t,e){super();const i=this;let a=null,s=1,o=null,r="local-floor",l=1,c=null,d=null,u=null,h=null,f=null,m=null;const _=new kE,g=e.getContextAttributes();let p=null,v=null;const x=[],y=[],w=new Yt;let S=null;const T=new qn;T.viewport=new tn;const E=new qn;E.viewport=new tn;const M=[T,E],b=new PE;let R=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let it=x[K];return it===void 0&&(it=new Kc,x[K]=it),it.getTargetRaySpace()},this.getControllerGrip=function(K){let it=x[K];return it===void 0&&(it=new Kc,x[K]=it),it.getGripSpace()},this.getHand=function(K){let it=x[K];return it===void 0&&(it=new Kc,x[K]=it),it.getHandSpace()};function C(K){const it=y.indexOf(K.inputSource);if(it===-1)return;const ct=x[it];ct!==void 0&&(ct.update(K.inputSource,K.frame,c||o),ct.dispatchEvent({type:K.type,data:K.inputSource}))}function I(){a.removeEventListener("select",C),a.removeEventListener("selectstart",C),a.removeEventListener("selectend",C),a.removeEventListener("squeeze",C),a.removeEventListener("squeezestart",C),a.removeEventListener("squeezeend",C),a.removeEventListener("end",I),a.removeEventListener("inputsourceschange",L);for(let K=0;K<x.length;K++){const it=y[K];it!==null&&(y[K]=null,x[K].disconnect(it))}R=null,k=null,_.reset(),t.setRenderTarget(p),f=null,h=null,u=null,a=null,v=null,It.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return a},this.setSession=async function(K){if(a=K,a!==null){if(p=t.getRenderTarget(),a.addEventListener("select",C),a.addEventListener("selectstart",C),a.addEventListener("selectend",C),a.addEventListener("squeeze",C),a.addEventListener("squeezestart",C),a.addEventListener("squeezeend",C),a.addEventListener("end",I),a.addEventListener("inputsourceschange",L),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),a.renderState.layers===void 0){const it={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(a,e,it),a.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Aa(f.framebufferWidth,f.framebufferHeight,{format:ri,type:Ui,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let it=null,ct=null,Z=null;g.depth&&(Z=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=g.stencil?Es:ps,ct=g.stencil?ws:Ta);const J={colorFormat:e.RGBA8,depthFormat:Z,scaleFactor:s};u=new XRWebGLBinding(a,e),h=u.createProjectionLayer(J),a.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new Aa(h.textureWidth,h.textureHeight,{format:ri,type:Ui,depthTexture:new Xp(h.textureWidth,h.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(r),It.setContext(a),It.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function L(K){for(let it=0;it<K.removed.length;it++){const ct=K.removed[it],Z=y.indexOf(ct);Z>=0&&(y[Z]=null,x[Z].disconnect(ct))}for(let it=0;it<K.added.length;it++){const ct=K.added[it];let Z=y.indexOf(ct);if(Z===-1){for(let lt=0;lt<x.length;lt++)if(lt>=y.length){y.push(ct),Z=lt;break}else if(y[lt]===null){y[lt]=ct,Z=lt;break}if(Z===-1)break}const J=x[Z];J&&J.connect(ct)}}const D=new X,O=new X;function B(K,it,ct){D.setFromMatrixPosition(it.matrixWorld),O.setFromMatrixPosition(ct.matrixWorld);const Z=D.distanceTo(O),J=it.projectionMatrix.elements,lt=ct.projectionMatrix.elements,Ht=J[14]/(J[10]-1),qt=J[14]/(J[10]+1),Ct=(J[9]+1)/J[5],q=(J[9]-1)/J[5],U=(J[8]-1)/J[0],Nt=(lt[8]+1)/lt[0],Dt=Ht*U,St=Ht*Nt,_t=Z/(-U+Nt),xt=_t*-U;if(it.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(xt),K.translateZ(_t),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),J[10]===-1)K.projectionMatrix.copy(it.projectionMatrix),K.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const Rt=Ht+_t,F=qt+_t,A=Dt-xt,G=St+(Z-xt),pt=Ct*qt/F*Rt,Q=q*qt/F*Rt;K.projectionMatrix.makePerspective(A,G,pt,Q,Rt,F),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function V(K,it){it===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(it.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(a===null)return;let it=K.near,ct=K.far;_.texture!==null&&(_.depthNear>0&&(it=_.depthNear),_.depthFar>0&&(ct=_.depthFar)),b.near=E.near=T.near=it,b.far=E.far=T.far=ct,(R!==b.near||k!==b.far)&&(a.updateRenderState({depthNear:b.near,depthFar:b.far}),R=b.near,k=b.far),T.layers.mask=K.layers.mask|2,E.layers.mask=K.layers.mask|4,b.layers.mask=T.layers.mask|E.layers.mask;const Z=K.parent,J=b.cameras;V(b,Z);for(let lt=0;lt<J.length;lt++)V(J[lt],Z);J.length===2?B(b,T,E):b.projectionMatrix.copy(T.projectionMatrix),ot(K,b,Z)};function ot(K,it,ct){ct===null?K.matrix.copy(it.matrixWorld):(K.matrix.copy(ct.matrixWorld),K.matrix.invert(),K.matrix.multiply(it.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(it.projectionMatrix),K.projectionMatrixInverse.copy(it.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=mo*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(K){l=K,h!==null&&(h.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let gt=null;function vt(K,it){if(d=it.getViewerPose(c||o),m=it,d!==null){const ct=d.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Z=!1;ct.length!==b.cameras.length&&(b.cameras.length=0,Z=!0);for(let lt=0;lt<ct.length;lt++){const Ht=ct[lt];let qt=null;if(f!==null)qt=f.getViewport(Ht);else{const q=u.getViewSubImage(h,Ht);qt=q.viewport,lt===0&&(t.setRenderTargetTextures(v,q.colorTexture,h.ignoreDepthValues?void 0:q.depthStencilTexture),t.setRenderTarget(v))}let Ct=M[lt];Ct===void 0&&(Ct=new qn,Ct.layers.enable(lt),Ct.viewport=new tn,M[lt]=Ct),Ct.matrix.fromArray(Ht.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(Ht.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(qt.x,qt.y,qt.width,qt.height),lt===0&&(b.matrix.copy(Ct.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Z===!0&&b.cameras.push(Ct)}const J=a.enabledFeatures;if(J&&J.includes("depth-sensing")){const lt=u.getDepthInformation(ct[0]);lt&&lt.isValid&&lt.texture&&_.init(t,lt,a.renderState)}}for(let ct=0;ct<x.length;ct++){const Z=y[ct],J=x[ct];Z!==null&&J!==void 0&&J.update(Z,it,c||o)}gt&&gt(K,it),it.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:it}),m=null}const It=new Hp;It.setAnimationLoop(vt),this.setAnimationLoop=function(K){gt=K},this.dispose=function(){}}}const fa=new bi,zE=new Pe;function FE(n,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Np(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function a(g,p,v,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),d(g,p)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&r(g,p)):p.isPointsMaterial?l(g,p,v,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===zn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===zn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const v=t.get(p),x=v.envMap,y=v.envMapRotation;x&&(g.envMap.value=x,fa.copy(y),fa.x*=-1,fa.y*=-1,fa.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(fa.y*=-1,fa.z*=-1),g.envMapRotation.value.setFromMatrix4(zE.makeRotationFromEuler(fa)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function r(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,v,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=x*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function d(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===zn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:a}}function UE(n,t,e,i){let a={},s={},o=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,x){const y=x.program;i.uniformBlockBinding(v,y)}function c(v,x){let y=a[v.id];y===void 0&&(m(v),y=d(v),a[v.id]=y,v.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(v,w);const S=t.render.frame;s[v.id]!==S&&(h(v),s[v.id]=S)}function d(v){const x=u();v.__bindingPointIndex=x;const y=n.createBuffer(),w=v.__size,S=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function u(){for(let v=0;v<r;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const x=a[v.id],y=v.uniforms,w=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let S=0,T=y.length;S<T;S++){const E=Array.isArray(y[S])?y[S]:[y[S]];for(let M=0,b=E.length;M<b;M++){const R=E[M];if(f(R,S,M,w)===!0){const k=R.__offset,C=Array.isArray(R.value)?R.value:[R.value];let I=0;for(let L=0;L<C.length;L++){const D=C[L],O=_(D);typeof D=="number"||typeof D=="boolean"?(R.__data[0]=D,n.bufferSubData(n.UNIFORM_BUFFER,k+I,R.__data)):D.isMatrix3?(R.__data[0]=D.elements[0],R.__data[1]=D.elements[1],R.__data[2]=D.elements[2],R.__data[3]=0,R.__data[4]=D.elements[3],R.__data[5]=D.elements[4],R.__data[6]=D.elements[5],R.__data[7]=0,R.__data[8]=D.elements[6],R.__data[9]=D.elements[7],R.__data[10]=D.elements[8],R.__data[11]=0):(D.toArray(R.__data,I),I+=O.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,x,y,w){const S=v.value,T=x+"_"+y;if(w[T]===void 0)return typeof S=="number"||typeof S=="boolean"?w[T]=S:w[T]=S.clone(),!0;{const E=w[T];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return w[T]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function m(v){const x=v.uniforms;let y=0;const w=16;for(let T=0,E=x.length;T<E;T++){const M=Array.isArray(x[T])?x[T]:[x[T]];for(let b=0,R=M.length;b<R;b++){const k=M[b],C=Array.isArray(k.value)?k.value:[k.value];for(let I=0,L=C.length;I<L;I++){const D=C[I],O=_(D),B=y%w,V=B%O.boundary,ot=B+V;y+=V,ot!==0&&w-ot<O.storage&&(y+=w-ot),k.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=O.storage}}}const S=y%w;return S>0&&(y+=w-S),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function g(v){const x=v.target;x.removeEventListener("dispose",g);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(a[x.id]),delete a[x.id],delete s[x.id]}function p(){for(const v in a)n.deleteBuffer(a[v]);o=[],a={},s={}}return{bind:l,update:c,dispose:p}}class NE{constructor(t={}){const{canvas:e=TM(),context:i=null,depth:a=!0,stencil:s=!1,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const v=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Dn,this.toneMapping=ta,this.toneMappingExposure=1;const y=this;let w=!1,S=0,T=0,E=null,M=-1,b=null;const R=new tn,k=new tn;let C=null;const I=new ie(0);let L=0,D=e.width,O=e.height,B=1,V=null,ot=null;const gt=new tn(0,0,D,O),vt=new tn(0,0,D,O);let It=!1;const K=new Bh;let it=!1,ct=!1;const Z=new Pe,J=new Pe,lt=new X,Ht=new tn,qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ct=!1;function q(){return E===null?B:1}let U=i;function Nt(P,Y){return e.getContext(P,Y)}try{const P={alpha:!0,depth:a,stencil:s,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Rh}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",Et,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),U===null){const Y="webgl2";if(U=Nt(Y,P),U===null)throw Nt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Dt,St,_t,xt,Rt,F,A,G,pt,Q,rt,Ft,tt,ut,Ut,at,bt,H,ht,yt,Gt,Ot,Lt,N;function wt(){Dt=new XS(U),Dt.init(),Ot=new RE(U,Dt),St=new US(U,Dt,t,Ot),_t=new EE(U,Dt),St.reverseDepthBuffer&&h&&_t.buffers.depth.setReversed(!0),xt=new YS(U),Rt=new hE,F=new AE(U,Dt,_t,Rt,St,Ot,xt),A=new OS(y),G=new GS(y),pt=new QM(U),Lt=new zS(U,pt),Q=new VS(U,pt,xt,Lt),rt=new ZS(U,Q,pt,xt),ht=new $S(U,St,F),at=new NS(Rt),Ft=new lE(y,A,G,Dt,St,Lt,at),tt=new FE(y,Rt),ut=new uE,Ut=new vE(Dt),H=new IS(y,A,G,_t,rt,f,l),bt=new SE(y,rt,St),N=new UE(U,xt,St,_t),yt=new FS(U,Dt,xt),Gt=new WS(U,Dt,xt),xt.programs=Ft.programs,y.capabilities=St,y.extensions=Dt,y.properties=Rt,y.renderLists=ut,y.shadowMap=bt,y.state=_t,y.info=xt}wt();const st=new IE(y,U);this.xr=st,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const P=Dt.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Dt.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(P){P!==void 0&&(B=P,this.setSize(D,O,!1))},this.getSize=function(P){return P.set(D,O)},this.setSize=function(P,Y,et=!0){if(st.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=P,O=Y,e.width=Math.floor(P*B),e.height=Math.floor(Y*B),et===!0&&(e.style.width=P+"px",e.style.height=Y+"px"),this.setViewport(0,0,P,Y)},this.getDrawingBufferSize=function(P){return P.set(D*B,O*B).floor()},this.setDrawingBufferSize=function(P,Y,et){D=P,O=Y,B=et,e.width=Math.floor(P*et),e.height=Math.floor(Y*et),this.setViewport(0,0,P,Y)},this.getCurrentViewport=function(P){return P.copy(R)},this.getViewport=function(P){return P.copy(gt)},this.setViewport=function(P,Y,et,nt){P.isVector4?gt.set(P.x,P.y,P.z,P.w):gt.set(P,Y,et,nt),_t.viewport(R.copy(gt).multiplyScalar(B).round())},this.getScissor=function(P){return P.copy(vt)},this.setScissor=function(P,Y,et,nt){P.isVector4?vt.set(P.x,P.y,P.z,P.w):vt.set(P,Y,et,nt),_t.scissor(k.copy(vt).multiplyScalar(B).round())},this.getScissorTest=function(){return It},this.setScissorTest=function(P){_t.setScissorTest(It=P)},this.setOpaqueSort=function(P){V=P},this.setTransparentSort=function(P){ot=P},this.getClearColor=function(P){return P.copy(H.getClearColor())},this.setClearColor=function(){H.setClearColor.apply(H,arguments)},this.getClearAlpha=function(){return H.getClearAlpha()},this.setClearAlpha=function(){H.setClearAlpha.apply(H,arguments)},this.clear=function(P=!0,Y=!0,et=!0){let nt=0;if(P){let $=!1;if(E!==null){const At=E.texture.format;$=At===Fh||At===zh||At===Ih}if($){const At=E.texture.type,zt=At===Ui||At===Ta||At===po||At===ws||At===Lh||At===Dh,Zt=H.getClearColor(),jt=H.getClearAlpha(),Vt=Zt.r,$t=Zt.g,Wt=Zt.b;zt?(m[0]=Vt,m[1]=$t,m[2]=Wt,m[3]=jt,U.clearBufferuiv(U.COLOR,0,m)):(_[0]=Vt,_[1]=$t,_[2]=Wt,_[3]=jt,U.clearBufferiv(U.COLOR,0,_))}else nt|=U.COLOR_BUFFER_BIT}Y&&(nt|=U.DEPTH_BUFFER_BIT),et&&(nt|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Et,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),ut.dispose(),Ut.dispose(),Rt.dispose(),A.dispose(),G.dispose(),rt.dispose(),Lt.dispose(),N.dispose(),Ft.dispose(),st.dispose(),st.removeEventListener("sessionstart",gn),st.removeEventListener("sessionend",wn),Be.stop()};function dt(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Et(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const P=xt.autoReset,Y=bt.enabled,et=bt.autoUpdate,nt=bt.needsUpdate,$=bt.type;wt(),xt.autoReset=P,bt.enabled=Y,bt.autoUpdate=et,bt.needsUpdate=nt,bt.type=$}function Tt(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function Qt(P){const Y=P.target;Y.removeEventListener("dispose",Qt),re(Y)}function re(P){de(P),Rt.remove(P)}function de(P){const Y=Rt.get(P).programs;Y!==void 0&&(Y.forEach(function(et){Ft.releaseProgram(et)}),P.isShaderMaterial&&Ft.releaseShaderCache(P))}this.renderBufferDirect=function(P,Y,et,nt,$,At){Y===null&&(Y=qt);const zt=$.isMesh&&$.matrixWorld.determinant()<0,Zt=Kt(P,Y,et,nt,$);_t.setMaterial(nt,zt);let jt=et.index,Vt=1;if(nt.wireframe===!0){if(jt=Q.getWireframeAttribute(et),jt===void 0)return;Vt=2}const $t=et.drawRange,Wt=et.attributes.position;let le=$t.start*Vt,ve=($t.start+$t.count)*Vt;At!==null&&(le=Math.max(le,At.start*Vt),ve=Math.min(ve,(At.start+At.count)*Vt)),jt!==null?(le=Math.max(le,0),ve=Math.min(ve,jt.count)):Wt!=null&&(le=Math.max(le,0),ve=Math.min(ve,Wt.count));const Ee=ve-le;if(Ee<0||Ee===1/0)return;Lt.setup($,nt,Zt,et,jt);let Fe,Bt=yt;if(jt!==null&&(Fe=pt.get(jt),Bt=Gt,Bt.setIndex(Fe)),$.isMesh)nt.wireframe===!0?(_t.setLineWidth(nt.wireframeLinewidth*q()),Bt.setMode(U.LINES)):Bt.setMode(U.TRIANGLES);else if($.isLine){let ft=nt.linewidth;ft===void 0&&(ft=1),_t.setLineWidth(ft*q()),$.isLineSegments?Bt.setMode(U.LINES):$.isLineLoop?Bt.setMode(U.LINE_LOOP):Bt.setMode(U.LINE_STRIP)}else $.isPoints?Bt.setMode(U.POINTS):$.isSprite&&Bt.setMode(U.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)Bt.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(Dt.get("WEBGL_multi_draw"))Bt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const ft=$._multiDrawStarts,ne=$._multiDrawCounts,ce=$._multiDrawCount,Me=jt?pt.get(jt).bytesPerElement:1,En=Rt.get(nt).currentProgram.getUniforms();for(let He=0;He<ce;He++)En.setValue(U,"_gl_DrawID",He),Bt.render(ft[He]/Me,ne[He])}else if($.isInstancedMesh)Bt.renderInstances(le,Ee,$.count);else if(et.isInstancedBufferGeometry){const ft=et._maxInstanceCount!==void 0?et._maxInstanceCount:1/0,ne=Math.min(et.instanceCount,ft);Bt.renderInstances(le,Ee,ne)}else Bt.render(le,Ee)};function ae(P,Y,et){P.transparent===!0&&P.side===Qe&&P.forceSinglePass===!1?(P.side=zn,P.needsUpdate=!0,Pt(P,Y,et),P.side=ia,P.needsUpdate=!0,Pt(P,Y,et),P.side=Qe):Pt(P,Y,et)}this.compile=function(P,Y,et=null){et===null&&(et=P),p=Ut.get(et),p.init(Y),x.push(p),et.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),P!==et&&P.traverseVisible(function($){$.isLight&&$.layers.test(Y.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const nt=new Set;return P.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const At=$.material;if(At)if(Array.isArray(At))for(let zt=0;zt<At.length;zt++){const Zt=At[zt];ae(Zt,et,$),nt.add(Zt)}else ae(At,et,$),nt.add(At)}),x.pop(),p=null,nt},this.compileAsync=function(P,Y,et=null){const nt=this.compile(P,Y,et);return new Promise($=>{function At(){if(nt.forEach(function(zt){Rt.get(zt).currentProgram.isReady()&&nt.delete(zt)}),nt.size===0){$(P);return}setTimeout(At,10)}Dt.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let Te=null;function ge(P){Te&&Te(P)}function gn(){Be.stop()}function wn(){Be.start()}const Be=new Hp;Be.setAnimationLoop(ge),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(P){Te=P,st.setAnimationLoop(P),P===null?Be.stop():Be.start()},st.addEventListener("sessionstart",gn),st.addEventListener("sessionend",wn),this.render=function(P,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(st.cameraAutoUpdate===!0&&st.updateCamera(Y),Y=st.getCamera()),P.isScene===!0&&P.onBeforeRender(y,P,Y,E),p=Ut.get(P,x.length),p.init(Y),x.push(p),J.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),K.setFromProjectionMatrix(J),ct=this.localClippingEnabled,it=at.init(this.clippingPlanes,ct),g=ut.get(P,v.length),g.init(),v.push(g),st.enabled===!0&&st.isPresenting===!0){const At=y.xr.getDepthSensingMesh();At!==null&&Re(At,Y,-1/0,y.sortObjects)}Re(P,Y,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(V,ot),Ct=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,Ct&&H.addToRenderList(g,P),this.info.render.frame++,it===!0&&at.beginShadows();const et=p.state.shadowsArray;bt.render(et,P,Y),it===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const nt=g.opaque,$=g.transmissive;if(p.setupLights(),Y.isArrayCamera){const At=Y.cameras;if($.length>0)for(let zt=0,Zt=At.length;zt<Zt;zt++){const jt=At[zt];kn(nt,$,P,jt)}Ct&&H.render(P);for(let zt=0,Zt=At.length;zt<Zt;zt++){const jt=At[zt];qe(g,P,jt,jt.viewport)}}else $.length>0&&kn(nt,$,P,Y),Ct&&H.render(P),qe(g,P,Y);E!==null&&(F.updateMultisampleRenderTarget(E),F.updateRenderTargetMipmap(E)),P.isScene===!0&&P.onAfterRender(y,P,Y),Lt.resetDefaultState(),M=-1,b=null,x.pop(),x.length>0?(p=x[x.length-1],it===!0&&at.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Re(P,Y,et,nt){if(P.visible===!1)return;if(P.layers.test(Y.layers)){if(P.isGroup)et=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(Y);else if(P.isLight)p.pushLight(P),P.castShadow&&p.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||K.intersectsSprite(P)){nt&&Ht.setFromMatrixPosition(P.matrixWorld).applyMatrix4(J);const zt=rt.update(P),Zt=P.material;Zt.visible&&g.push(P,zt,Zt,et,Ht.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||K.intersectsObject(P))){const zt=rt.update(P),Zt=P.material;if(nt&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Ht.copy(P.boundingSphere.center)):(zt.boundingSphere===null&&zt.computeBoundingSphere(),Ht.copy(zt.boundingSphere.center)),Ht.applyMatrix4(P.matrixWorld).applyMatrix4(J)),Array.isArray(Zt)){const jt=zt.groups;for(let Vt=0,$t=jt.length;Vt<$t;Vt++){const Wt=jt[Vt],le=Zt[Wt.materialIndex];le&&le.visible&&g.push(P,zt,le,et,Ht.z,Wt)}}else Zt.visible&&g.push(P,zt,Zt,et,Ht.z,null)}}const At=P.children;for(let zt=0,Zt=At.length;zt<Zt;zt++)Re(At[zt],Y,et,nt)}function qe(P,Y,et,nt){const $=P.opaque,At=P.transmissive,zt=P.transparent;p.setupLightsView(et),it===!0&&at.setGlobalState(y.clippingPlanes,et),nt&&_t.viewport(R.copy(nt)),$.length>0&&nn($,Y,et),At.length>0&&nn(At,Y,et),zt.length>0&&nn(zt,Y,et),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function kn(P,Y,et,nt){if((et.isScene===!0?et.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[nt.id]===void 0&&(p.state.transmissionRenderTarget[nt.id]=new Aa(1,1,{generateMipmaps:!0,type:Dt.has("EXT_color_buffer_half_float")||Dt.has("EXT_color_buffer_float")?Mo:Ui,minFilter:Sa,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ae.workingColorSpace}));const At=p.state.transmissionRenderTarget[nt.id],zt=nt.viewport||R;At.setSize(zt.z,zt.w);const Zt=y.getRenderTarget();y.setRenderTarget(At),y.getClearColor(I),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear(),Ct&&H.render(et);const jt=y.toneMapping;y.toneMapping=ta;const Vt=nt.viewport;if(nt.viewport!==void 0&&(nt.viewport=void 0),p.setupLightsView(nt),it===!0&&at.setGlobalState(y.clippingPlanes,nt),nn(P,et,nt),F.updateMultisampleRenderTarget(At),F.updateRenderTargetMipmap(At),Dt.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let Wt=0,le=Y.length;Wt<le;Wt++){const ve=Y[Wt],Ee=ve.object,Fe=ve.geometry,Bt=ve.material,ft=ve.group;if(Bt.side===Qe&&Ee.layers.test(nt.layers)){const ne=Bt.side;Bt.side=zn,Bt.needsUpdate=!0,W(Ee,et,nt,Fe,Bt,ft),Bt.side=ne,Bt.needsUpdate=!0,$t=!0}}$t===!0&&(F.updateMultisampleRenderTarget(At),F.updateRenderTargetMipmap(At))}y.setRenderTarget(Zt),y.setClearColor(I,L),Vt!==void 0&&(nt.viewport=Vt),y.toneMapping=jt}function nn(P,Y,et){const nt=Y.isScene===!0?Y.overrideMaterial:null;for(let $=0,At=P.length;$<At;$++){const zt=P[$],Zt=zt.object,jt=zt.geometry,Vt=nt===null?zt.material:nt,$t=zt.group;Zt.layers.test(et.layers)&&W(Zt,Y,et,jt,Vt,$t)}}function W(P,Y,et,nt,$,At){P.onBeforeRender(y,Y,et,nt,$,At),P.modelViewMatrix.multiplyMatrices(et.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),$.onBeforeRender(y,Y,et,nt,P,At),$.transparent===!0&&$.side===Qe&&$.forceSinglePass===!1?($.side=zn,$.needsUpdate=!0,y.renderBufferDirect(et,Y,nt,$,P,At),$.side=ia,$.needsUpdate=!0,y.renderBufferDirect(et,Y,nt,$,P,At),$.side=Qe):y.renderBufferDirect(et,Y,nt,$,P,At),P.onAfterRender(y,Y,et,nt,$,At)}function Pt(P,Y,et){Y.isScene!==!0&&(Y=qt);const nt=Rt.get(P),$=p.state.lights,At=p.state.shadowsArray,zt=$.state.version,Zt=Ft.getParameters(P,$.state,At,Y,et),jt=Ft.getProgramCacheKey(Zt);let Vt=nt.programs;nt.environment=P.isMeshStandardMaterial?Y.environment:null,nt.fog=Y.fog,nt.envMap=(P.isMeshStandardMaterial?G:A).get(P.envMap||nt.environment),nt.envMapRotation=nt.environment!==null&&P.envMap===null?Y.environmentRotation:P.envMapRotation,Vt===void 0&&(P.addEventListener("dispose",Qt),Vt=new Map,nt.programs=Vt);let $t=Vt.get(jt);if($t!==void 0){if(nt.currentProgram===$t&&nt.lightsStateVersion===zt)return ee(P,Zt),$t}else Zt.uniforms=Ft.getUniforms(P),P.onBeforeCompile(Zt,y),$t=Ft.acquireProgram(Zt,jt),Vt.set(jt,$t),nt.uniforms=Zt.uniforms;const Wt=nt.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Wt.clippingPlanes=at.uniform),ee(P,Zt),nt.needsLights=pe(P),nt.lightsStateVersion=zt,nt.needsLights&&(Wt.ambientLightColor.value=$.state.ambient,Wt.lightProbe.value=$.state.probe,Wt.directionalLights.value=$.state.directional,Wt.directionalLightShadows.value=$.state.directionalShadow,Wt.spotLights.value=$.state.spot,Wt.spotLightShadows.value=$.state.spotShadow,Wt.rectAreaLights.value=$.state.rectArea,Wt.ltc_1.value=$.state.rectAreaLTC1,Wt.ltc_2.value=$.state.rectAreaLTC2,Wt.pointLights.value=$.state.point,Wt.pointLightShadows.value=$.state.pointShadow,Wt.hemisphereLights.value=$.state.hemi,Wt.directionalShadowMap.value=$.state.directionalShadowMap,Wt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Wt.spotShadowMap.value=$.state.spotShadowMap,Wt.spotLightMatrix.value=$.state.spotLightMatrix,Wt.spotLightMap.value=$.state.spotLightMap,Wt.pointShadowMap.value=$.state.pointShadowMap,Wt.pointShadowMatrix.value=$.state.pointShadowMatrix),nt.currentProgram=$t,nt.uniformsList=null,$t}function kt(P){if(P.uniformsList===null){const Y=P.currentProgram.getUniforms();P.uniformsList=yr.seqWithValue(Y.seq,P.uniforms)}return P.uniformsList}function ee(P,Y){const et=Rt.get(P);et.outputColorSpace=Y.outputColorSpace,et.batching=Y.batching,et.batchingColor=Y.batchingColor,et.instancing=Y.instancing,et.instancingColor=Y.instancingColor,et.instancingMorph=Y.instancingMorph,et.skinning=Y.skinning,et.morphTargets=Y.morphTargets,et.morphNormals=Y.morphNormals,et.morphColors=Y.morphColors,et.morphTargetsCount=Y.morphTargetsCount,et.numClippingPlanes=Y.numClippingPlanes,et.numIntersection=Y.numClipIntersection,et.vertexAlphas=Y.vertexAlphas,et.vertexTangents=Y.vertexTangents,et.toneMapping=Y.toneMapping}function Kt(P,Y,et,nt,$){Y.isScene!==!0&&(Y=qt),F.resetTextureUnits();const At=Y.fog,zt=nt.isMeshStandardMaterial?Y.environment:null,Zt=E===null?y.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:As,jt=(nt.isMeshStandardMaterial?G:A).get(nt.envMap||zt),Vt=nt.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,$t=!!et.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),Wt=!!et.morphAttributes.position,le=!!et.morphAttributes.normal,ve=!!et.morphAttributes.color;let Ee=ta;nt.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ee=y.toneMapping);const Fe=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,Bt=Fe!==void 0?Fe.length:0,ft=Rt.get(nt),ne=p.state.lights;if(it===!0&&(ct===!0||P!==b)){const hn=P===b&&nt.id===M;at.setState(nt,P,hn)}let ce=!1;nt.version===ft.__version?(ft.needsLights&&ft.lightsStateVersion!==ne.state.version||ft.outputColorSpace!==Zt||$.isBatchedMesh&&ft.batching===!1||!$.isBatchedMesh&&ft.batching===!0||$.isBatchedMesh&&ft.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&ft.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&ft.instancing===!1||!$.isInstancedMesh&&ft.instancing===!0||$.isSkinnedMesh&&ft.skinning===!1||!$.isSkinnedMesh&&ft.skinning===!0||$.isInstancedMesh&&ft.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&ft.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&ft.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&ft.instancingMorph===!1&&$.morphTexture!==null||ft.envMap!==jt||nt.fog===!0&&ft.fog!==At||ft.numClippingPlanes!==void 0&&(ft.numClippingPlanes!==at.numPlanes||ft.numIntersection!==at.numIntersection)||ft.vertexAlphas!==Vt||ft.vertexTangents!==$t||ft.morphTargets!==Wt||ft.morphNormals!==le||ft.morphColors!==ve||ft.toneMapping!==Ee||ft.morphTargetsCount!==Bt)&&(ce=!0):(ce=!0,ft.__version=nt.version);let Me=ft.currentProgram;ce===!0&&(Me=Pt(nt,Y,$));let En=!1,He=!1,vn=!1;const Se=Me.getUniforms(),Ce=ft.uniforms;if(_t.useProgram(Me.program)&&(En=!0,He=!0,vn=!0),nt.id!==M&&(M=nt.id,He=!0),En||b!==P){_t.buffers.depth.getReversed()?(Z.copy(P.projectionMatrix),RM(Z),PM(Z),Se.setValue(U,"projectionMatrix",Z)):Se.setValue(U,"projectionMatrix",P.projectionMatrix),Se.setValue(U,"viewMatrix",P.matrixWorldInverse);const Ke=Se.map.cameraPosition;Ke!==void 0&&Ke.setValue(U,lt.setFromMatrixPosition(P.matrixWorld)),St.logarithmicDepthBuffer&&Se.setValue(U,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&Se.setValue(U,"isOrthographic",P.isOrthographicCamera===!0),b!==P&&(b=P,He=!0,vn=!0)}if($.isSkinnedMesh){Se.setOptional(U,$,"bindMatrix"),Se.setOptional(U,$,"bindMatrixInverse");const hn=$.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),Se.setValue(U,"boneTexture",hn.boneTexture,F))}$.isBatchedMesh&&(Se.setOptional(U,$,"batchingTexture"),Se.setValue(U,"batchingTexture",$._matricesTexture,F),Se.setOptional(U,$,"batchingIdTexture"),Se.setValue(U,"batchingIdTexture",$._indirectTexture,F),Se.setOptional(U,$,"batchingColorTexture"),$._colorsTexture!==null&&Se.setValue(U,"batchingColorTexture",$._colorsTexture,F));const Un=et.morphAttributes;if((Un.position!==void 0||Un.normal!==void 0||Un.color!==void 0)&&ht.update($,et,Me),(He||ft.receiveShadow!==$.receiveShadow)&&(ft.receiveShadow=$.receiveShadow,Se.setValue(U,"receiveShadow",$.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(Ce.envMap.value=jt,Ce.flipEnvMap.value=jt.isCubeTexture&&jt.isRenderTargetTexture===!1?-1:1),nt.isMeshStandardMaterial&&nt.envMap===null&&Y.environment!==null&&(Ce.envMapIntensity.value=Y.environmentIntensity),He&&(Se.setValue(U,"toneMappingExposure",y.toneMappingExposure),ft.needsLights&&oe(Ce,vn),At&&nt.fog===!0&&tt.refreshFogUniforms(Ce,At),tt.refreshMaterialUniforms(Ce,nt,B,O,p.state.transmissionRenderTarget[P.id]),yr.upload(U,kt(ft),Ce,F)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(yr.upload(U,kt(ft),Ce,F),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&Se.setValue(U,"center",$.center),Se.setValue(U,"modelViewMatrix",$.modelViewMatrix),Se.setValue(U,"normalMatrix",$.normalMatrix),Se.setValue(U,"modelMatrix",$.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const hn=nt.uniformsGroups;for(let Ke=0,Tn=hn.length;Ke<Tn;Ke++){const ci=hn[Ke];N.update(ci,Me),N.bind(ci,Me)}}return Me}function oe(P,Y){P.ambientLightColor.needsUpdate=Y,P.lightProbe.needsUpdate=Y,P.directionalLights.needsUpdate=Y,P.directionalLightShadows.needsUpdate=Y,P.pointLights.needsUpdate=Y,P.pointLightShadows.needsUpdate=Y,P.spotLights.needsUpdate=Y,P.spotLightShadows.needsUpdate=Y,P.rectAreaLights.needsUpdate=Y,P.hemisphereLights.needsUpdate=Y}function pe(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(P,Y,et){Rt.get(P.texture).__webglTexture=Y,Rt.get(P.depthTexture).__webglTexture=et;const nt=Rt.get(P);nt.__hasExternalTextures=!0,nt.__autoAllocateDepthBuffer=et===void 0,nt.__autoAllocateDepthBuffer||Dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),nt.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,Y){const et=Rt.get(P);et.__webglFramebuffer=Y,et.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(P,Y=0,et=0){E=P,S=Y,T=et;let nt=!0,$=null,At=!1,zt=!1;if(P){const jt=Rt.get(P);if(jt.__useDefaultFramebuffer!==void 0)_t.bindFramebuffer(U.FRAMEBUFFER,null),nt=!1;else if(jt.__webglFramebuffer===void 0)F.setupRenderTarget(P);else if(jt.__hasExternalTextures)F.rebindTextures(P,Rt.get(P.texture).__webglTexture,Rt.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Wt=P.depthTexture;if(jt.__boundDepthTexture!==Wt){if(Wt!==null&&Rt.has(Wt)&&(P.width!==Wt.image.width||P.height!==Wt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");F.setupDepthRenderbuffer(P)}}const Vt=P.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(zt=!0);const $t=Rt.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray($t[Y])?$=$t[Y][et]:$=$t[Y],At=!0):P.samples>0&&F.useMultisampledRTT(P)===!1?$=Rt.get(P).__webglMultisampledFramebuffer:Array.isArray($t)?$=$t[et]:$=$t,R.copy(P.viewport),k.copy(P.scissor),C=P.scissorTest}else R.copy(gt).multiplyScalar(B).floor(),k.copy(vt).multiplyScalar(B).floor(),C=It;if(_t.bindFramebuffer(U.FRAMEBUFFER,$)&&nt&&_t.drawBuffers(P,$),_t.viewport(R),_t.scissor(k),_t.setScissorTest(C),At){const jt=Rt.get(P.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+Y,jt.__webglTexture,et)}else if(zt){const jt=Rt.get(P.texture),Vt=Y||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,jt.__webglTexture,et||0,Vt)}M=-1},this.readRenderTargetPixels=function(P,Y,et,nt,$,At,zt){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Zt=Rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&zt!==void 0&&(Zt=Zt[zt]),Zt){_t.bindFramebuffer(U.FRAMEBUFFER,Zt);try{const jt=P.texture,Vt=jt.format,$t=jt.type;if(!St.textureFormatReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!St.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=P.width-nt&&et>=0&&et<=P.height-$&&U.readPixels(Y,et,nt,$,Ot.convert(Vt),Ot.convert($t),At)}finally{const jt=E!==null?Rt.get(E).__webglFramebuffer:null;_t.bindFramebuffer(U.FRAMEBUFFER,jt)}}},this.readRenderTargetPixelsAsync=async function(P,Y,et,nt,$,At,zt){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Zt=Rt.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&zt!==void 0&&(Zt=Zt[zt]),Zt){const jt=P.texture,Vt=jt.format,$t=jt.type;if(!St.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!St.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=P.width-nt&&et>=0&&et<=P.height-$){_t.bindFramebuffer(U.FRAMEBUFFER,Zt);const Wt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Wt),U.bufferData(U.PIXEL_PACK_BUFFER,At.byteLength,U.STREAM_READ),U.readPixels(Y,et,nt,$,Ot.convert(Vt),Ot.convert($t),0);const le=E!==null?Rt.get(E).__webglFramebuffer:null;_t.bindFramebuffer(U.FRAMEBUFFER,le);const ve=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await AM(U,ve,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Wt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,At),U.deleteBuffer(Wt),U.deleteSync(ve),At}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,Y=null,et=0){P.isTexture!==!0&&(js("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,P=arguments[1]);const nt=Math.pow(2,-et),$=Math.floor(P.image.width*nt),At=Math.floor(P.image.height*nt),zt=Y!==null?Y.x:0,Zt=Y!==null?Y.y:0;F.setTexture2D(P,0),U.copyTexSubImage2D(U.TEXTURE_2D,et,0,0,zt,Zt,$,At),_t.unbindTexture()},this.copyTextureToTexture=function(P,Y,et=null,nt=null,$=0){P.isTexture!==!0&&(js("WebGLRenderer: copyTextureToTexture function signature has changed."),nt=arguments[0]||null,P=arguments[1],Y=arguments[2],$=arguments[3]||0,et=null);let At,zt,Zt,jt,Vt,$t,Wt,le,ve;const Ee=P.isCompressedTexture?P.mipmaps[$]:P.image;et!==null?(At=et.max.x-et.min.x,zt=et.max.y-et.min.y,Zt=et.isBox3?et.max.z-et.min.z:1,jt=et.min.x,Vt=et.min.y,$t=et.isBox3?et.min.z:0):(At=Ee.width,zt=Ee.height,Zt=Ee.depth||1,jt=0,Vt=0,$t=0),nt!==null?(Wt=nt.x,le=nt.y,ve=nt.z):(Wt=0,le=0,ve=0);const Fe=Ot.convert(Y.format),Bt=Ot.convert(Y.type);let ft;Y.isData3DTexture?(F.setTexture3D(Y,0),ft=U.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(F.setTexture2DArray(Y,0),ft=U.TEXTURE_2D_ARRAY):(F.setTexture2D(Y,0),ft=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,Y.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,Y.unpackAlignment);const ne=U.getParameter(U.UNPACK_ROW_LENGTH),ce=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Me=U.getParameter(U.UNPACK_SKIP_PIXELS),En=U.getParameter(U.UNPACK_SKIP_ROWS),He=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Ee.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ee.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,jt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Vt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,$t);const vn=P.isDataArrayTexture||P.isData3DTexture,Se=Y.isDataArrayTexture||Y.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const Ce=Rt.get(P),Un=Rt.get(Y),hn=Rt.get(Ce.__renderTarget),Ke=Rt.get(Un.__renderTarget);_t.bindFramebuffer(U.READ_FRAMEBUFFER,hn.__webglFramebuffer),_t.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ke.__webglFramebuffer);for(let Tn=0;Tn<Zt;Tn++)vn&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Rt.get(P).__webglTexture,$,$t+Tn),P.isDepthTexture?(Se&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Rt.get(Y).__webglTexture,$,ve+Tn),U.blitFramebuffer(jt,Vt,At,zt,Wt,le,At,zt,U.DEPTH_BUFFER_BIT,U.NEAREST)):Se?U.copyTexSubImage3D(ft,$,Wt,le,ve+Tn,jt,Vt,At,zt):U.copyTexSubImage2D(ft,$,Wt,le,ve+Tn,jt,Vt,At,zt);_t.bindFramebuffer(U.READ_FRAMEBUFFER,null),_t.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Se?P.isDataTexture||P.isData3DTexture?U.texSubImage3D(ft,$,Wt,le,ve,At,zt,Zt,Fe,Bt,Ee.data):Y.isCompressedArrayTexture?U.compressedTexSubImage3D(ft,$,Wt,le,ve,At,zt,Zt,Fe,Ee.data):U.texSubImage3D(ft,$,Wt,le,ve,At,zt,Zt,Fe,Bt,Ee):P.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,$,Wt,le,At,zt,Fe,Bt,Ee.data):P.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,$,Wt,le,Ee.width,Ee.height,Fe,Ee.data):U.texSubImage2D(U.TEXTURE_2D,$,Wt,le,At,zt,Fe,Bt,Ee);U.pixelStorei(U.UNPACK_ROW_LENGTH,ne),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ce),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Me),U.pixelStorei(U.UNPACK_SKIP_ROWS,En),U.pixelStorei(U.UNPACK_SKIP_IMAGES,He),$===0&&Y.generateMipmaps&&U.generateMipmap(ft),_t.unbindTexture()},this.copyTextureToTexture3D=function(P,Y,et=null,nt=null,$=0){return P.isTexture!==!0&&(js("WebGLRenderer: copyTextureToTexture3D function signature has changed."),et=arguments[0]||null,nt=arguments[1]||null,P=arguments[2],Y=arguments[3],$=arguments[4]||0),js('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,Y,et,nt,$)},this.initRenderTarget=function(P){Rt.get(P).__webglFramebuffer===void 0&&F.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?F.setTextureCube(P,0):P.isData3DTexture?F.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?F.setTexture2DArray(P,0):F.setTexture2D(P,0),_t.unbindTexture()},this.resetState=function(){S=0,T=0,E=null,_t.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=Ae._getUnpackColorSpace()}}class OE extends je{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class BE{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=hh,this.updateRanges=[],this.version=0,this.uuid=Mi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let a=0,s=this.stride;a<s;a++)this.array[t+a]=e.array[i+a];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Cn=new X;class zr{constructor(t,e,i,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)Cn.fromBufferAttribute(this,e),Cn.applyMatrix4(t),this.setXYZ(e,Cn.x,Cn.y,Cn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Cn.fromBufferAttribute(this,e),Cn.applyNormalMatrix(t),this.setXYZ(e,Cn.x,Cn.y,Cn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Cn.fromBufferAttribute(this,e),Cn.transformDirection(t),this.setXYZ(e,Cn.x,Cn.y,Cn.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=oi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ze(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=oi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=oi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=oi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=oi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,a){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this}setXYZW(t,e,i,a,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ze(e,this.array),i=ze(i,this.array),a=ze(a,this.array),s=ze(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=a,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return new mn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new zr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const a=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[a+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class uh extends La{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let is;const Xs=new X,as=new X,ss=new X,os=new Yt,Vs=new Yt,Zp=new Pe,tr=new X,Ws=new X,er=new X,af=new Yt,Jc=new Yt,sf=new Yt;class of extends je{constructor(t=new uh){if(super(),this.isSprite=!0,this.type="Sprite",is===void 0){is=new on;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new BE(e,5);is.setIndex([0,1,2,0,2,3]),is.setAttribute("position",new zr(i,3,0,!1)),is.setAttribute("uv",new zr(i,2,3,!1))}this.geometry=is,this.material=t,this.center=new Yt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),as.setFromMatrixScale(this.matrixWorld),Zp.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ss.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&as.multiplyScalar(-ss.z);const i=this.material.rotation;let a,s;i!==0&&(s=Math.cos(i),a=Math.sin(i));const o=this.center;nr(tr.set(-.5,-.5,0),ss,o,as,a,s),nr(Ws.set(.5,-.5,0),ss,o,as,a,s),nr(er.set(.5,.5,0),ss,o,as,a,s),af.set(0,0),Jc.set(1,0),sf.set(1,1);let r=t.ray.intersectTriangle(tr,Ws,er,!1,Xs);if(r===null&&(nr(Ws.set(-.5,.5,0),ss,o,as,a,s),Jc.set(0,1),r=t.ray.intersectTriangle(tr,er,Ws,!1,Xs),r===null))return;const l=t.ray.origin.distanceTo(Xs);l<t.near||l>t.far||e.push({distance:l,point:Xs.clone(),uv:Wn.getInterpolation(Xs,tr,Ws,er,af,Jc,sf,new Yt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function nr(n,t,e,i,a,s){os.subVectors(n,e).addScalar(.5).multiply(i),a!==void 0?(Vs.x=s*os.x-a*os.y,Vs.y=a*os.x+s*os.y):Vs.copy(os),n.copy(t),n.x+=Vs.x,n.y+=Vs.y,n.applyMatrix4(Zp)}class HE extends Sn{constructor(t=null,e=1,i=1,a,s,o,r,l,c=Yn,d=Yn,u,h){super(null,o,r,l,c,d,a,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class no extends mn{constructor(t,e,i,a=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const rs=new Pe,rf=new Pe,ir=[],cf=new Ca,GE=new Pe,Ys=new _e,$s=new Ps;class lf extends _e{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new no(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<i;a++)this.setMatrixAt(a,GE)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ca),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,rs),cf.copy(t.boundingBox).applyMatrix4(rs),this.boundingBox.union(cf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ps),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,rs),$s.copy(t.boundingSphere).applyMatrix4(rs),this.boundingSphere.union($s)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,a=this.morphTexture.source.data.data,s=i.length+1,o=t*s+1;for(let r=0;r<i.length;r++)i[r]=a[o+r]}raycast(t,e){const i=this.matrixWorld,a=this.count;if(Ys.geometry=this.geometry,Ys.material=this.material,Ys.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$s.copy(this.boundingSphere),$s.applyMatrix4(i),t.ray.intersectsSphere($s)!==!1))for(let s=0;s<a;s++){this.getMatrixAt(s,rs),rf.multiplyMatrices(i,rs),Ys.matrixWorld=rf,Ys.raycast(t,ir);for(let o=0,r=ir.length;o<r;o++){const l=ir[o];l.instanceId=s,l.object=this,e.push(l)}ir.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new no(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,a=i.length+1;this.morphTexture===null&&(this.morphTexture=new HE(new Float32Array(a*this.count),a,this.count,kh,yi));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const r=this.geometry.morphTargetsRelative?1:1-o,l=a*t;s[l]=r,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Gh extends La{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Fr=new X,Ur=new X,hf=new Pe,Zs=new Nh,ar=new Ps,Qc=new X,df=new X;class XE extends je{constructor(t=new on,e=new Gh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let a=1,s=e.count;a<s;a++)Fr.fromBufferAttribute(e,a-1),Ur.fromBufferAttribute(e,a),i[a]=i[a-1],i[a]+=Fr.distanceTo(Ur);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,a=this.matrixWorld,s=t.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere),ar.applyMatrix4(a),ar.radius+=s,t.ray.intersectsSphere(ar)===!1)return;hf.copy(a).invert(),Zs.copy(t.ray).applyMatrix4(hf);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=d.getX(_),v=d.getX(_+1),x=sr(this,t,Zs,l,p,v);x&&e.push(x)}if(this.isLineLoop){const _=d.getX(m-1),g=d.getX(f),p=sr(this,t,Zs,l,_,g);p&&e.push(p)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=c){const p=sr(this,t,Zs,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=sr(this,t,Zs,l,m-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const a=e[i[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=a.length;s<o;s++){const r=a[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function sr(n,t,e,i,a,s){const o=n.geometry.attributes.position;if(Fr.fromBufferAttribute(o,a),Ur.fromBufferAttribute(o,s),e.distanceSqToSegment(Fr,Ur,Qc,df)>i)return;Qc.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Qc);if(!(l<t.near||l>t.far))return{distance:l,point:df.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const uf=new X,ff=new X;class jp extends XE{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let a=0,s=e.count;a<s;a+=2)uf.fromBufferAttribute(e,a),ff.fromBufferAttribute(e,a+1),i[a]=a===0?0:i[a-1],i[a+1]=i[a]+uf.distanceTo(ff);t.setAttribute("lineDistance",new De(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class fh extends Sn{constructor(t,e,i,a,s,o,r,l,c){super(t,e,i,a,s,o,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Si{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,a=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),s+=i.distanceTo(a),e.push(s),a=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let a=0;const s=i.length;let o;e?o=e:o=t*i[s-1];let r=0,l=s-1,c;for(;r<=l;)if(a=Math.floor(r+(l-r)/2),c=i[a]-o,c<0)r=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,i[a]===o)return a/(s-1);const d=i[a],h=i[a+1]-d,f=(o-d)/h;return(a+f)/(s-1)}getTangent(t,e){let a=t-1e-4,s=t+1e-4;a<0&&(a=0),s>1&&(s=1);const o=this.getPoint(a),r=this.getPoint(s),l=e||(o.isVector2?new Yt:new X);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new X,a=[],s=[],o=[],r=new X,l=new Pe;for(let f=0;f<=t;f++){const m=f/t;a[f]=this.getTangentAt(m,new X)}s[0]=new X,o[0]=new X;let c=Number.MAX_VALUE;const d=Math.abs(a[0].x),u=Math.abs(a[0].y),h=Math.abs(a[0].z);d<=c&&(c=d,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),h<=c&&i.set(0,0,1),r.crossVectors(a[0],i).normalize(),s[0].crossVectors(a[0],r),o[0].crossVectors(a[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(a[f-1],a[f]),r.length()>Number.EPSILON){r.normalize();const m=Math.acos(xn(a[f-1].dot(a[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(r,m))}o[f].crossVectors(a[f],s[f])}if(e===!0){let f=Math.acos(xn(s[0].dot(s[t]),-1,1));f/=t,a[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let m=1;m<=t;m++)s[m].applyMatrix4(l.makeRotationAxis(a[m],f*m)),o[m].crossVectors(a[m],s[m])}return{tangents:a,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Xh extends Si{constructor(t=0,e=0,i=1,a=1,s=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=a,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e=new Yt){const i=e,a=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=a;for(;s>a;)s-=a;s<Number.EPSILON&&(o?s=0:s=a),this.aClockwise===!0&&!o&&(s===a?s=-a:s=s-a);const r=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*d-f*u+this.aX,c=h*u+f*d+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class VE extends Xh{constructor(t,e,i,a,s,o){super(t,e,i,i,a,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Vh(){let n=0,t=0,e=0,i=0;function a(s,o,r,l){n=s,t=r,e=-3*s+3*o-2*r-l,i=2*s-2*o+r+l}return{initCatmullRom:function(s,o,r,l,c){a(o,r,c*(r-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,r,l,c,d,u){let h=(o-s)/c-(r-s)/(c+d)+(r-o)/d,f=(r-o)/d-(l-o)/(d+u)+(l-r)/u;h*=d,f*=d,a(o,r,h,f)},calc:function(s){const o=s*s,r=o*s;return n+t*s+e*o+i*r}}}const or=new X,tl=new Vh,el=new Vh,nl=new Vh;class WE extends Si{constructor(t=[],e=!1,i="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=a}getPoint(t,e=new X){const i=e,a=this.points,s=a.length,o=(s-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:l===0&&r===s-1&&(r=s-2,l=1);let c,d;this.closed||r>0?c=a[(r-1)%s]:(or.subVectors(a[0],a[1]).add(a[0]),c=or);const u=a[r%s],h=a[(r+1)%s];if(this.closed||r+2<s?d=a[(r+2)%s]:(or.subVectors(a[s-1],a[s-2]).add(a[s-1]),d=or),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(h),f),g=Math.pow(h.distanceToSquared(d),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),tl.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,m,_,g),el.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,m,_,g),nl.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,m,_,g)}else this.curveType==="catmullrom"&&(tl.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),el.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),nl.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return i.set(tl.calc(l),el.calc(l),nl.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new X().fromArray(a))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function pf(n,t,e,i,a){const s=(i-t)*.5,o=(a-e)*.5,r=n*n,l=n*r;return(2*e-2*i+s+o)*l+(-3*e+3*i-2*s-o)*r+s*n+e}function YE(n,t){const e=1-n;return e*e*t}function $E(n,t){return 2*(1-n)*n*t}function ZE(n,t){return n*n*t}function io(n,t,e,i){return YE(n,t)+$E(n,e)+ZE(n,i)}function jE(n,t){const e=1-n;return e*e*e*t}function qE(n,t){const e=1-n;return 3*e*e*n*t}function KE(n,t){return 3*(1-n)*n*n*t}function JE(n,t){return n*n*n*t}function ao(n,t,e,i,a){return jE(n,t)+qE(n,e)+KE(n,i)+JE(n,a)}class qp extends Si{constructor(t=new Yt,e=new Yt,i=new Yt,a=new Yt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(ao(t,a.x,s.x,o.x,r.x),ao(t,a.y,s.y,o.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class QE extends Si{constructor(t=new X,e=new X,i=new X,a=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=a}getPoint(t,e=new X){const i=e,a=this.v0,s=this.v1,o=this.v2,r=this.v3;return i.set(ao(t,a.x,s.x,o.x,r.x),ao(t,a.y,s.y,o.y,r.y),ao(t,a.z,s.z,o.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Kp extends Si{constructor(t=new Yt,e=new Yt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Yt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Yt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tT extends Si{constructor(t=new X,e=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new X){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new X){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jp extends Si{constructor(t=new Yt,e=new Yt,i=new Yt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Yt){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(io(t,a.x,s.x,o.x),io(t,a.y,s.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class eT extends Si{constructor(t=new X,e=new X,i=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new X){const i=e,a=this.v0,s=this.v1,o=this.v2;return i.set(io(t,a.x,s.x,o.x),io(t,a.y,s.y,o.y),io(t,a.z,s.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qp extends Si{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Yt){const i=e,a=this.points,s=(a.length-1)*t,o=Math.floor(s),r=s-o,l=a[o===0?o:o-1],c=a[o],d=a[o>a.length-2?a.length-1:o+1],u=a[o>a.length-3?a.length-1:o+2];return i.set(pf(r,l.x,c.x,d.x,u.x),pf(r,l.y,c.y,d.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const a=this.points[e];t.points.push(a.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const a=t.points[e];this.points.push(new Yt().fromArray(a))}return this}}var mf=Object.freeze({__proto__:null,ArcCurve:VE,CatmullRomCurve3:WE,CubicBezierCurve:qp,CubicBezierCurve3:QE,EllipseCurve:Xh,LineCurve:Kp,LineCurve3:tT,QuadraticBezierCurve:Jp,QuadraticBezierCurve3:eT,SplineCurve:Qp});class nT extends Si{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mf[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),a=this.getCurveLengths();let s=0;for(;s<a.length;){if(a[s]>=i){const o=a[s]-i,r=this.curves[s],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,a=this.curves.length;i<a;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let a=0,s=this.curves;a<s.length;a++){const o=s[a],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const d=l[c];i&&i.equals(d)||(e.push(d),i=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(a.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const a=this.curves[e];t.curves.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const a=t.curves[e];this.curves.push(new mf[a.type]().fromJSON(a))}return this}}class gf extends nT{constructor(t){super(),this.type="Path",this.currentPoint=new Yt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Kp(this.currentPoint.clone(),new Yt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,a){const s=new Jp(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a));return this.curves.push(s),this.currentPoint.set(i,a),this}bezierCurveTo(t,e,i,a,s,o){const r=new qp(this.currentPoint.clone(),new Yt(t,e),new Yt(i,a),new Yt(s,o));return this.curves.push(r),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Qp(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,a,s,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,a,s,o),this}absarc(t,e,i,a,s,o){return this.absellipse(t,e,i,i,a,s,o),this}ellipse(t,e,i,a,s,o,r,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+c,e+d,i,a,s,o,r,l),this}absellipse(t,e,i,a,s,o,r,l){const c=new Xh(t,e,i,a,s,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Wh extends on{constructor(t=1,e=32,i=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:a},e=Math.max(3,e);const s=[],o=[],r=[],l=[],c=new X,d=new Yt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=i+u/e*a;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,l.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(r,3)),this.setAttribute("uv",new De(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wh(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class go extends on{constructor(t=1,e=1,i=1,a=32,s=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:a,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:l};const c=this;a=Math.floor(a),s=Math.floor(s);const d=[],u=[],h=[],f=[];let m=0;const _=[],g=i/2;let p=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(f,2));function v(){const y=new X,w=new X;let S=0;const T=(e-t)/i;for(let E=0;E<=s;E++){const M=[],b=E/s,R=b*(e-t)+t;for(let k=0;k<=a;k++){const C=k/a,I=C*l+r,L=Math.sin(I),D=Math.cos(I);w.x=R*L,w.y=-b*i+g,w.z=R*D,u.push(w.x,w.y,w.z),y.set(L,T,D).normalize(),h.push(y.x,y.y,y.z),f.push(C,1-b),M.push(m++)}_.push(M)}for(let E=0;E<a;E++)for(let M=0;M<s;M++){const b=_[M][E],R=_[M+1][E],k=_[M+1][E+1],C=_[M][E+1];(t>0||M!==0)&&(d.push(b,R,C),S+=3),(e>0||M!==s-1)&&(d.push(R,k,C),S+=3)}c.addGroup(p,S,0),p+=S}function x(y){const w=m,S=new Yt,T=new X;let E=0;const M=y===!0?t:e,b=y===!0?1:-1;for(let k=1;k<=a;k++)u.push(0,g*b,0),h.push(0,b,0),f.push(.5,.5),m++;const R=m;for(let k=0;k<=a;k++){const I=k/a*l+r,L=Math.cos(I),D=Math.sin(I);T.x=M*D,T.y=g*b,T.z=M*L,u.push(T.x,T.y,T.z),h.push(0,b,0),S.x=L*.5+.5,S.y=D*.5*b+.5,f.push(S.x,S.y),m++}for(let k=0;k<a;k++){const C=w+k,I=R+k;y===!0?d.push(I,I+1,C):d.push(I+1,I,C),E+=3}c.addGroup(p,E,y===!0?1:2),p+=E}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new go(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yh extends go{constructor(t=1,e=1,i=32,a=1,s=!1,o=0,r=Math.PI*2){super(0,t,e,i,a,s,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:r}}static fromJSON(t){return new Yh(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $h extends on{constructor(t=[],e=[],i=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:a};const s=[],o=[];r(a),c(i),d(),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(s.slice(),3)),this.setAttribute("uv",new De(o,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function r(v){const x=new X,y=new X,w=new X;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],y),f(e[S+2],w),l(x,y,w,v)}function l(v,x,y,w){const S=w+1,T=[];for(let E=0;E<=S;E++){T[E]=[];const M=v.clone().lerp(y,E/S),b=x.clone().lerp(y,E/S),R=S-E;for(let k=0;k<=R;k++)k===0&&E===S?T[E][k]=M:T[E][k]=M.clone().lerp(b,k/R)}for(let E=0;E<S;E++)for(let M=0;M<2*(S-E)-1;M++){const b=Math.floor(M/2);M%2===0?(h(T[E][b+1]),h(T[E+1][b]),h(T[E][b])):(h(T[E][b+1]),h(T[E+1][b+1]),h(T[E+1][b]))}}function c(v){const x=new X;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(v),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function d(){const v=new X;for(let x=0;x<s.length;x+=3){v.x=s[x+0],v.y=s[x+1],v.z=s[x+2];const y=g(v)/2/Math.PI+.5,w=p(v)/Math.PI+.5;o.push(y,1-w)}m(),u()}function u(){for(let v=0;v<o.length;v+=6){const x=o[v+0],y=o[v+2],w=o[v+4],S=Math.max(x,y,w),T=Math.min(x,y,w);S>.9&&T<.1&&(x<.2&&(o[v+0]+=1),y<.2&&(o[v+2]+=1),w<.2&&(o[v+4]+=1))}}function h(v){s.push(v.x,v.y,v.z)}function f(v,x){const y=v*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function m(){const v=new X,x=new X,y=new X,w=new X,S=new Yt,T=new Yt,E=new Yt;for(let M=0,b=0;M<s.length;M+=9,b+=6){v.set(s[M+0],s[M+1],s[M+2]),x.set(s[M+3],s[M+4],s[M+5]),y.set(s[M+6],s[M+7],s[M+8]),S.set(o[b+0],o[b+1]),T.set(o[b+2],o[b+3]),E.set(o[b+4],o[b+5]),w.copy(v).add(x).add(y).divideScalar(3);const R=g(w);_(S,b+0,v,R),_(T,b+2,x,R),_(E,b+4,y,R)}}function _(v,x,y,w){w<0&&v.x===1&&(o[x]=v.x-1),y.x===0&&y.z===0&&(o[x]=w/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $h(t.vertices,t.indices,t.radius,t.details)}}const rr=new X,cr=new X,il=new X,lr=new Wn;class iT extends on{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const a=Math.pow(10,4),s=Math.cos(ms*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],d=["a","b","c"],u=new Array(3),h={},f=[];for(let m=0;m<l;m+=3){o?(c[0]=o.getX(m),c[1]=o.getX(m+1),c[2]=o.getX(m+2)):(c[0]=m,c[1]=m+1,c[2]=m+2);const{a:_,b:g,c:p}=lr;if(_.fromBufferAttribute(r,c[0]),g.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),lr.getNormal(il),u[0]=`${Math.round(_.x*a)},${Math.round(_.y*a)},${Math.round(_.z*a)}`,u[1]=`${Math.round(g.x*a)},${Math.round(g.y*a)},${Math.round(g.z*a)}`,u[2]=`${Math.round(p.x*a)},${Math.round(p.y*a)},${Math.round(p.z*a)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let v=0;v<3;v++){const x=(v+1)%3,y=u[v],w=u[x],S=lr[d[v]],T=lr[d[x]],E=`${y}_${w}`,M=`${w}_${y}`;M in h&&h[M]?(il.dot(h[M].normal)<=s&&(f.push(S.x,S.y,S.z),f.push(T.x,T.y,T.z)),h[M]=null):E in h||(h[E]={index0:c[v],index1:c[x],normal:il.clone()})}}for(const m in h)if(h[m]){const{index0:_,index1:g}=h[m];rr.fromBufferAttribute(r,_),cr.fromBufferAttribute(r,g),f.push(rr.x,rr.y,rr.z),f.push(cr.x,cr.y,cr.z)}this.setAttribute("position",new De(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class tm extends gf{constructor(t){super(t),this.uuid=Mi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,a=this.holes.length;i<a;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(a.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const a=this.holes[e];t.holes.push(a.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const a=t.holes[e];this.holes.push(new gf().fromJSON(a))}return this}}const aT={triangulate:function(n,t,e=2){const i=t&&t.length,a=i?t[0]*e:n.length;let s=em(n,0,a,e,!0);const o=[];if(!s||s.next===s.prev)return o;let r,l,c,d,u,h,f;if(i&&(s=lT(n,t,s,e)),n.length>80*e){r=c=n[0],l=d=n[1];for(let m=e;m<a;m+=e)u=n[m],h=n[m+1],u<r&&(r=u),h<l&&(l=h),u>c&&(c=u),h>d&&(d=h);f=Math.max(c-r,d-l),f=f!==0?32767/f:0}return xo(s,o,e,r,l,f,0),o}};function em(n,t,e,i,a){let s,o;if(a===_T(n,t,e,i)>0)for(s=t;s<e;s+=i)o=xf(s,n[s],n[s+1],o);else for(s=e-i;s>=t;s-=i)o=xf(s,n[s],n[s+1],o);return o&&Zr(o,o.next)&&(yo(o),o=o.next),o}function Ra(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Zr(e,e.next)||Ze(e.prev,e,e.next)===0)){if(yo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function xo(n,t,e,i,a,s,o){if(!n)return;!o&&s&&pT(n,i,a,s);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?oT(n,i,a,s):sT(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),yo(n),n=c.next,r=c.next;continue}if(n=c,n===r){o?o===1?(n=rT(Ra(n),t,e),xo(n,t,e,i,a,s,2)):o===2&&cT(n,t,e,i,a,s):xo(Ra(n),t,e,i,a,s,1);break}}}function sT(n){const t=n.prev,e=n,i=n.next;if(Ze(t,e,i)>=0)return!1;const a=t.x,s=e.x,o=i.x,r=t.y,l=e.y,c=i.y,d=a<s?a<o?a:o:s<o?s:o,u=r<l?r<c?r:c:l<c?l:c,h=a>s?a>o?a:o:s>o?s:o,f=r>l?r>c?r:c:l>c?l:c;let m=i.next;for(;m!==t;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=f&&ds(a,r,s,l,o,c,m.x,m.y)&&Ze(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function oT(n,t,e,i){const a=n.prev,s=n,o=n.next;if(Ze(a,s,o)>=0)return!1;const r=a.x,l=s.x,c=o.x,d=a.y,u=s.y,h=o.y,f=r<l?r<c?r:c:l<c?l:c,m=d<u?d<h?d:h:u<h?u:h,_=r>l?r>c?r:c:l>c?l:c,g=d>u?d>h?d:h:u>h?u:h,p=ph(f,m,t,e,i),v=ph(_,g,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=v;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ds(r,d,l,u,c,h,x.x,x.y)&&Ze(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ds(r,d,l,u,c,h,y.x,y.y)&&Ze(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==a&&x!==o&&ds(r,d,l,u,c,h,x.x,x.y)&&Ze(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=v;){if(y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==a&&y!==o&&ds(r,d,l,u,c,h,y.x,y.y)&&Ze(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function rT(n,t,e){let i=n;do{const a=i.prev,s=i.next.next;!Zr(a,s)&&nm(a,i,i.next,s)&&vo(a,s)&&vo(s,a)&&(t.push(a.i/e|0),t.push(i.i/e|0),t.push(s.i/e|0),yo(i),yo(i.next),i=n=s),i=i.next}while(i!==n);return Ra(i)}function cT(n,t,e,i,a,s){let o=n;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&xT(o,r)){let l=im(o,r);o=Ra(o,o.next),l=Ra(l,l.next),xo(o,t,e,i,a,s,0),xo(l,t,e,i,a,s,0);return}r=r.next}o=o.next}while(o!==n)}function lT(n,t,e,i){const a=[];let s,o,r,l,c;for(s=0,o=t.length;s<o;s++)r=t[s]*i,l=s<o-1?t[s+1]*i:n.length,c=em(n,r,l,i,!1),c===c.next&&(c.steiner=!0),a.push(gT(c));for(a.sort(hT),s=0;s<a.length;s++)e=dT(a[s],e);return e}function hT(n,t){return n.x-t.x}function dT(n,t){const e=uT(n,t);if(!e)return t;const i=im(e,n);return Ra(i,i.next),Ra(e,e.next)}function uT(n,t){let e=t,i=-1/0,a;const s=n.x,o=n.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const h=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>i&&(i=h,a=e.x<e.next.x?e:e.next,h===s))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,l=a.x,c=a.y;let d=1/0,u;e=a;do s>=e.x&&e.x>=l&&s!==e.x&&ds(o<c?s:i,o,l,c,o<c?i:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),vo(e,n)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&fT(a,e)))&&(a=e,d=u)),e=e.next;while(e!==r);return a}function fT(n,t){return Ze(n.prev,n,t.prev)<0&&Ze(t.next,n,n.next)<0}function pT(n,t,e,i){let a=n;do a.z===0&&(a.z=ph(a.x,a.y,t,e,i)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==n);a.prevZ.nextZ=null,a.prevZ=null,mT(a)}function mT(n){let t,e,i,a,s,o,r,l,c=1;do{for(e=n,n=null,s=null,o=0;e;){for(o++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(a=e,e=e.nextZ,r--):(a=i,i=i.nextZ,l--),s?s.nextZ=a:n=a,a.prevZ=s,s=a;e=i}s.nextZ=null,c*=2}while(o>1);return n}function ph(n,t,e,i,a){return n=(n-e)*a|0,t=(t-i)*a|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function gT(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ds(n,t,e,i,a,s,o,r){return(a-o)*(t-r)>=(n-o)*(s-r)&&(n-o)*(i-r)>=(e-o)*(t-r)&&(e-o)*(s-r)>=(a-o)*(i-r)}function xT(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!vT(n,t)&&(vo(n,t)&&vo(t,n)&&yT(n,t)&&(Ze(n.prev,n,t.prev)||Ze(n,t.prev,t))||Zr(n,t)&&Ze(n.prev,n,n.next)>0&&Ze(t.prev,t,t.next)>0)}function Ze(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Zr(n,t){return n.x===t.x&&n.y===t.y}function nm(n,t,e,i){const a=dr(Ze(n,t,e)),s=dr(Ze(n,t,i)),o=dr(Ze(e,i,n)),r=dr(Ze(e,i,t));return!!(a!==s&&o!==r||a===0&&hr(n,e,t)||s===0&&hr(n,i,t)||o===0&&hr(e,n,i)||r===0&&hr(e,t,i))}function hr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function dr(n){return n>0?1:n<0?-1:0}function vT(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&nm(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function vo(n,t){return Ze(n.prev,n,n.next)<0?Ze(n,t,n.next)>=0&&Ze(n,n.prev,t)>=0:Ze(n,t,n.prev)<0||Ze(n,n.next,t)<0}function yT(n,t){let e=n,i=!1;const a=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&a<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function im(n,t){const e=new mh(n.i,n.x,n.y),i=new mh(t.i,t.x,t.y),a=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=a,a.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function xf(n,t,e,i){const a=new mh(n,t,e);return i?(a.next=i.next,a.prev=i,i.next.prev=a,i.next=a):(a.prev=a,a.next=a),a}function yo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function mh(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function _T(n,t,e,i){let a=0;for(let s=t,o=e-i;s<e;s+=i)a+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return a}class so{static area(t){const e=t.length;let i=0;for(let a=e-1,s=0;s<e;a=s++)i+=t[a].x*t[s].y-t[s].x*t[a].y;return i*.5}static isClockWise(t){return so.area(t)<0}static triangulateShape(t,e){const i=[],a=[],s=[];vf(t),yf(i,t);let o=t.length;e.forEach(vf);for(let l=0;l<e.length;l++)a.push(o),o+=e[l].length,yf(i,e[l]);const r=aT.triangulate(i,a);for(let l=0;l<r.length;l+=3)s.push(r.slice(l,l+3));return s}}function vf(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function yf(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class Zh extends $h{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,a,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Zh(t.radius,t.detail)}}class xs extends on{constructor(t=.5,e=1,i=32,a=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:a,thetaStart:s,thetaLength:o},i=Math.max(3,i),a=Math.max(1,a);const r=[],l=[],c=[],d=[];let u=t;const h=(e-t)/a,f=new X,m=new Yt;for(let _=0;_<=a;_++){for(let g=0;g<=i;g++){const p=s+g/i*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/e+1)/2,m.y=(f.y/e+1)/2,d.push(m.x,m.y)}u+=h}for(let _=0;_<a;_++){const g=_*(i+1);for(let p=0;p<i;p++){const v=p+g,x=v,y=v+i+1,w=v+i+2,S=v+1;r.push(x,y,S),r.push(y,w,S)}}this.setIndex(r),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xs(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class jh extends on{constructor(t=new tm([new Yt(0,.5),new Yt(-.5,-.5),new Yt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],a=[],s=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let d=0;d<t.length;d++)c(t[d]),this.addGroup(r,l,d),r+=l,l=0;this.setIndex(i),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(s,3)),this.setAttribute("uv",new De(o,2));function c(d){const u=a.length/3,h=d.extractPoints(e);let f=h.shape;const m=h.holes;so.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){const v=m[g];so.isClockWise(v)===!0&&(m[g]=v.reverse())}const _=so.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){const v=m[g];f=f.concat(v)}for(let g=0,p=f.length;g<p;g++){const v=f[g];a.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let g=0,p=_.length;g<p;g++){const v=_[g],x=v[0]+u,y=v[1]+u,w=v[2]+u;i.push(x,y,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return MT(e,t)}static fromJSON(t,e){const i=[];for(let a=0,s=t.shapes.length;a<s;a++){const o=e[t.shapes[a]];i.push(o)}return new jh(i,t.curveSegments)}}function MT(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const a=n[e];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t}class jr extends on{constructor(t=1,e=.4,i=12,a=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:a,arc:s},i=Math.floor(i),a=Math.floor(a);const o=[],r=[],l=[],c=[],d=new X,u=new X,h=new X;for(let f=0;f<=i;f++)for(let m=0;m<=a;m++){const _=m/a*s,g=f/i*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(_),u.y=(t+e*Math.cos(g))*Math.sin(_),u.z=e*Math.sin(g),r.push(u.x,u.y,u.z),d.x=t*Math.cos(_),d.y=t*Math.sin(_),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(m/a),c.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=a;m++){const _=(a+1)*f+m-1,g=(a+1)*(f-1)+m-1,p=(a+1)*(f-1)+m,v=(a+1)*f+m;o.push(_,g,v),o.push(g,p,v)}this.setIndex(o),this.setAttribute("position",new De(r,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Pa extends La{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Cp,this.normalScale=new Yt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class am extends je{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class bT extends am{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(je.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ie(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const al=new Pe,_f=new X,Mf=new X;class ST{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Yt(512,512),this.map=null,this.mapPass=null,this.matrix=new Pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bh,this._frameExtents=new Yt(1,1),this._viewportCount=1,this._viewports=[new tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;_f.setFromMatrixPosition(t.matrixWorld),e.position.copy(_f),Mf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Mf),e.updateMatrixWorld(),al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(al),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(al)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class wT extends ST{constructor(){super(new Gp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ET extends am{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(je.DEFAULT_UP),this.updateMatrix(),this.target=new je,this.shadow=new wT}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const bf=new Pe;class TT{constructor(t,e,i=0,a=1/0){this.ray=new Nh(t,e),this.near=i,this.far=a,this.camera=null,this.layers=new Oh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return bf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(bf),this}intersectObject(t,e=!0,i=[]){return gh(t,this,i,e),i.sort(Sf),i}intersectObjects(t,e=!0,i=[]){for(let a=0,s=t.length;a<s;a++)gh(t[a],this,i,e);return i.sort(Sf),i}}function Sf(n,t){return n.distance-t.distance}function gh(n,t,e,i){let a=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(a=!1),a===!0&&i===!0){const s=n.children;for(let o=0,r=s.length;o<r;o++)gh(s[o],t,e,!0)}}class AT extends jp{constructor(t=10,e=10,i=4473924,a=8947848){i=new ie(i),a=new ie(a);const s=e/2,o=t/e,r=t/2,l=[],c=[];for(let h=0,f=0,m=-r;h<=e;h++,m+=o){l.push(-r,0,m,r,0,m),l.push(m,0,-r,m,0,r);const _=h===s?i:a;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const d=new on;d.setAttribute("position",new De(l,3)),d.setAttribute("color",new De(c,3));const u=new Gh({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rh);const RT={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,threat:0,threatCount:0,centroidX:0,centroidZ:0};function PT(n,t,e,i){const a=new qn(n.fov,i,.1,200),s=new X,o=new X,r=new X;let l=!1,c=n.fov;const d={distanceScale:1,offsetX:0,offsetZ:0,pitchDelta:0,zoom:1};let u=1,h=0,f=0,m=0,_=0,g=0,p=0;function v(){const x=(n.pitchDeg+d.pitchDelta)*Math.PI/180,y=n.yawDeg*Math.PI/180;r.set(Math.sin(y)*Math.cos(x),Math.sin(x),Math.cos(y)*Math.cos(x)).multiplyScalar(n.distance*d.distanceScale*d.zoom)}return v(),{camera:a,update(x,y,w,S,T=RT){const E=y+.6;if(!l)s.set(x,E,w),l=!0;else{const R=1-Math.exp(-Math.max(n.smoothing,.001)*S);s.x+=(x-s.x)*R,s.y+=(E-s.y)*R,s.z+=(w-s.z)*R}const M=1-Math.exp(-Math.max(t.smoothing,.001)*S);d.distanceScale+=(T.distanceScale-d.distanceScale)*M,d.offsetX+=(T.offsetX-d.offsetX)*M,d.offsetZ+=(T.offsetZ-d.offsetZ)*M,d.pitchDelta+=(T.pitchDelta-d.pitchDelta)*M;const b=1-Math.exp(-Math.max(e.smoothing,.001)*S);if(d.zoom+=(u-d.zoom)*b,v(),(a.fov!==c||a.fov!==n.fov)&&(a.fov=n.fov,c=n.fov,a.updateProjectionMatrix()),o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),a.position.copy(o).add(r),a.lookAt(o),h>.001){f+=S*52;const R=h*.055;a.position.x+=Math.sin(f*1.7)*R,a.position.y+=Math.sin(f*2.3+1.1)*R*.75,a.position.z+=Math.sin(f*1.3+2.4)*R*.5,h*=Math.exp(-9*S)}else h=0;g>.001?(a.position.x+=m*g,a.position.z+=_*g,g*=Math.exp(-13*S)):g=0,a.updateMatrixWorld()},snap(x,y,w){s.set(x,y+.6,w),l=!0,o.set(s.x+d.offsetX,s.y,s.z+d.offsetZ),v(),a.position.copy(o).add(r),a.lookAt(o),a.updateMatrixWorld()},resize(x){a.aspect=x,a.updateProjectionMatrix()},getGroundBasis(){const x=new X().setFromMatrixColumn(a.matrixWorld,0),y=new X().setFromMatrixColumn(a.matrixWorld,2).negate(),w=Math.hypot(x.x,x.z)||1,S=Math.hypot(y.x,y.z)||1;return{rightX:x.x/w,rightZ:x.z/w,forwardX:y.x/S,forwardZ:y.z/S}},addShake(x){!Number.isFinite(x)||x<=0||(h=Math.min(1,h+x))},shakeLevel(){return h},addKick(x,y,w){if(!Number.isFinite(x)||!Number.isFinite(y)||!(w>0))return;const S=Math.hypot(x,y);S<1e-4||(m=x/S*w,_=y/S*w,g=1,p++)},kickLevel(){return g},kickCount(){return p},setZoom(x){u=Number.isFinite(x)&&x>0?x:1},smart(){return{...d}}}}const wa=Math.PI*2,Kn=1e-6;function Fn(n,t,e){return n<t?t:n>e?e:n}function sm(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function CT(n){if(n<=Math.PI)return 1-2*n/Math.PI;const t=(n-Math.PI)/Math.PI;return-8*t*t*t+12*t*t-2*t-1}function om(n,t){const e=Math.cos(n),i=t<=0?0:t>=1?1:t;if(i===0)return e;const a=CT(n);return i===1?a:e+(a-e)*i}function wf(n){return(1-Math.sin(n))/2}function qh(n,t,e){const i=Math.PI/180,a=Fn(Number.isFinite(t)?t:100,0,180),s=Fn(Number.isFinite(e)?e:132,0,180);if(s<=a)return n>=Math.cos(a*i)?1:0;const o=Math.cos(a*i),r=Math.cos(s*i);if(n>=o)return 1;const l=Fn((o-n)/(o-r),0,1);return 1-l*l*(3-2*l)}function Nr(n,t){if(!n.grounded||n.speed<Kn)return sm();const e=n.speed/Math.max(n.moveSpeed,Kn),i=Math.max(n.legLength,Kn),a=n.stride>Kn?n.stride*t.reachRatio:Math.min(t.maxAmp,e*t.strideGain)*i,s=Math.min(t.maxAmp,a/i),o=i*Math.sin(Math.min(t.maxAmp,1.25)),r=Math.abs(n.localForward),l=Math.abs(n.localRight),c=r+l+Kn,d=qh(n.localForward/Math.max(n.speed,Kn),t.backStrafeStartDeg,t.backStrafeFullDeg),u=l/c*d,h=r/c+l/c*(1-d),f=n.localForward>=0?1:-1,m=n.localRight>=0?1:-1,_=a,g=I=>Math.asin(Fn(I,-o,o)/i);function p(I,L){const D=om(I,t.plantLock),O=wf(I),B=f*h*_*D,V=-g(B),ot=L*m>0?1:-1,gt=1+ot*t.crossStep*.45,vt=m*ot*t.crossStep*_*.4*O,It=m*u*_*t.sideWeight*gt*D+vt*u,K=g(It),it=t.kneeLift*O*s*(.55+.25*h+(ot>0?.2*u:0));return{pitchX:V,rollZ:K,kneeX:it}}const v=(n.phase%wa+wa)%wa,x=p(v,-1),y=p((v+Math.PI)%wa,1),w=Math.cos(v),S=wf(v),T=-t.comSway*s*w*(.6*h+.8*u)-m*t.comSway*s*u*.45,E=t.comBob*S*s,M=m*t.hipLean*s*u*w*.6,b=m*t.hipLean*s*u*(.45+.25*w),R=t.armSwing*s*w*(h*f+.3*u),k=R,C=-R;return{legL:x,legR:y,pelvisX:T,pelvisY:E,pelvisRoll:M,sideLean:b,armL:k,armR:C,strafe:u,backward:f<0?h:0}}function rm(n){const t=(n%wa+wa)%wa,e=Math.floor((t-Math.PI/2)/Math.PI+1e-9)+1;return Math.PI/2+e*Math.PI}function cm(n,t,e){const i=Fn(e.progress,0,1);if(i>=1||n.speed<Kn)return sm();const a=i*i*(3-2*i),s=1-a;return Nr({...n,phase:e.phase0+(e.phaseEnd-e.phase0)*a,speed:n.speed*s,stride:n.stride*s},t)}function lm(n,t,e,i){const a=Fn(n,-1,1),s=Math.abs(a),o=Math.min(1,t*(1+Math.max(0,i)*s*s));return Fn(o*a,-1,1)*(e*Math.PI/180)}function hm(n,t,e,i){if(!(Math.hypot(n,t)>1e-6))return e;const s=Math.atan2(t,n)*180/Math.PI;if(Math.abs(s)<=90)return e;const r=(s-Math.sign(s)*180)*Math.PI/180,l=Fn(i,0,1),c=l*l;return e*c+r*(1-c)}function dm(n,t,e,i,a){const s=Math.max(e,Kn),o=Math.max(0,i)*s,r=Math.max(0,a)*s,l=t>Kn?(t-n)/t:0,c=l>.02,d=l<-.015,u=n<=o*.15,h=!d&&n<r&&(c||u);return{enter:n>Kn&&n<=o&&c,resume:!h}}function um(n,t,e){const i=Math.max(0,e)*(Math.PI/180);return Fn(n*Fn(t,0,2),-i,i)}function fm(n,t,e){const i=Math.sin(n),a=Math.cos(n),s=Math.cos(n),o=-Math.sin(n);return{forward:t*i+e*a,right:t*s+e*o}}function pm(n,t,e){const i=Fn(n,0,1),a=i*i*(3-2*i);return e?t==="inStop"?1-a:1:t==="afterStop"?1-a:0}function LT(n,t,e){const i=()=>({legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisY:0,env:0});if(!e.turnStepEnabled)return i();const a=Fn(n,0,1),s=Math.sin(Math.PI*a),o=s*s;if(o<=1e-9)return i();const r=t>=0,l=r?1:.35,c=r?.35:1,d=Math.max(0,e.turnStepPitch)*o,u=Math.max(0,e.turnStepKnee)*o,h=Math.max(0,e.turnStepPitch)*.35*o,f=r?1:-1;return{legL:{pitchX:-d*l,rollZ:f*h*l,kneeX:u*l},legR:{pitchX:-d*c,rollZ:-f*h*c,kneeX:u*c},pelvisY:-Math.max(0,e.turnStepDip)*o,env:o}}function mm(n,t,e,i,a){const s=Fn(n,0,1),o=Fn(a.stopPeakRatio,.05,.95),r=s<=o?s/o:(s-o)/(1-o),l=r*r*(3-2*r),c=s<=o?l:1-l,d=Math.hypot(e,i),u=d>Kn?e/d:1,h=d>Kn?i/d:0,f=om(t,1)>0;return{leadPitch:Math.max(0,a.stopStepPitch)*c,trailPitch:Math.max(0,a.stopTrailPitch)*c,leadKnee:Math.max(0,a.stopStepKnee)*c,bodyShift:Math.max(0,a.stopBodyShift)*c,bodyDip:Math.max(0,a.stopBodyDip)*c,chestPitch:Math.max(0,a.stopChestPitch)*c,leadLeft:f,fwdN:u,rightN:h,env:c}}function bn(n){return n<0?0:n>1?1:n}const _r=Math.PI*2;function DT(n){return((n+Math.PI)%_r+_r)%_r-Math.PI}function kT(){return{legL:{pitchX:0,rollZ:0,kneeX:0},legR:{pitchX:0,rollZ:0,kneeX:0},pelvisX:0,pelvisY:0,pelvisRoll:0,sideLean:0,armL:0,armR:0,strafe:0,backward:0}}function IT(n,t,e,i,a,s=n.phase){const o=bn(i);if(o<=0)return n;const r=bn(t),l=Math.max(1,Math.round(a.cycles)),c=Math.max(0,a.strideSpeed),d=e%2===0?1:-1,u=bn(a.forwardBias),h=Math.max(0,n.stride??0),f=Math.max(0,a.strideScale??0)*h,m=r<=.5?r*2:(r-.5)*2,_=m*m*(3-2*m),g=r<=.5?_:1-_,p={speed:c,phase:s+_r*l/2*g,localForward:c*u,localRight:c*(1-u)*d},v=DT(p.phase-n.phase),x=o*o*(3-2*o),y=n.speed>.05?h:0;return{speed:n.speed+(p.speed-n.speed)*o,phase:n.phase+v*x,localForward:n.localForward+(p.localForward-n.localForward)*o,localRight:n.localRight+(p.localRight-n.localRight)*o,stride:y+(f-y)*o*o}}function zT(n,t,e){const i=kT(),a=bn(n),s=Math.sin(Math.PI*a)**2;if(s<=1e-12)return i;const o=t%2===0?1:-1,r=o<0,l=o>0,c=e.stepPitch*s,d=e.stepKnee*s,u=e.stepSide*s;return i.legL.pitchX=r?-c:c*.55,i.legR.pitchX=l?-c:c*.55,i.legL.kneeX=r?d:d*.4,i.legR.kneeX=l?d:d*.4,i.legL.rollZ=-u*o,i.legR.rollZ=u*o,i.pelvisX=e.stepSway*s*o,i.pelvisY=-e.stepDip*s,i.pelvisRoll=u*.25*o,i}function gm(n,t){if(n<=0||n>=1)return 0;const e=Math.min(.9,Math.max(.05,t));return n<e?Math.sin(Math.PI/2*(n/e)):Math.cos(Math.PI/2*((n-e)/(1-e)))}function Ef(n,t,e,i,a){if(e<=0||i<=0)return 0;const s=(n-t)/e;return s<0||s>=1?0:i*gm(s,a)}function FT(n,t,e,i){const a=t?1:0,s=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),o=n+(a-n)*s;return t&&o>.999?1:!t&&o<.001?0:o}function UT(n,t,e){const i=bn(n);return{gaitScale:1-i*(1-bn(t)),attackLegWeight:bn(e)*i}}function NT(n,t,e){const i=bn(e);if(i<=0)return n;if(i>=1)return{...n,...t,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward};const a=(s,o)=>s+(o-s)*i;return{legL:{pitchX:a(n.legL.pitchX,t.legL.pitchX),rollZ:a(n.legL.rollZ,t.legL.rollZ),kneeX:a(n.legL.kneeX,t.legL.kneeX)},legR:{pitchX:a(n.legR.pitchX,t.legR.pitchX),rollZ:a(n.legR.rollZ,t.legR.rollZ),kneeX:a(n.legR.kneeX,t.legR.kneeX)},pelvisX:a(n.pelvisX,t.pelvisX),pelvisY:a(n.pelvisY,t.pelvisY),pelvisRoll:a(n.pelvisRoll,t.pelvisRoll),sideLean:n.sideLean,armL:n.armL,armR:n.armR,strafe:n.strafe,backward:n.backward}}function OT(n,t){const e=bn(t);return e===1?n:{legL:{pitchX:n.legL.pitchX*e,rollZ:n.legL.rollZ*e,kneeX:n.legL.kneeX*e},legR:{pitchX:n.legR.pitchX*e,rollZ:n.legR.rollZ*e,kneeX:n.legR.kneeX*e},pelvisX:n.pelvisX*e,pelvisY:n.pelvisY*e,pelvisRoll:n.pelvisRoll*e,sideLean:n.sideLean*e,armL:n.armL*e,armR:n.armR*e,strafe:n.strafe,backward:n.backward}}function BT(n,t){const e=Math.min(1,Math.abs(n)/Math.max(t.impactSpeed,1e-6));return bn(t.minScale+(1-t.minScale)*e)}function HT(){return xm()}function xm(){return{active:!1,legacy:!1,intensity:0,pulse:0,hitHeight:0,localFwd:0,localRight:0,upperPitch:0,upperRoll:0,upperYaw:0,upperShiftX:0,upperShiftZ:0,upperShift:0,comX:0,comZ:0,comShift:0,pelvisBack:0,drop:0,knee:0,hip:0,arm:0,flash:0}}function GT(n,t){return n.type==="light"?Math.max(0,t.leanLight):n.type==="heavy"?Math.max(0,t.leanHeavy):n.type==="knock"?Math.max(0,t.leanKnock):0}function XT(n,t){return Number.isFinite(t.forceHitHeight)&&t.forceHitHeight>=0?bn(t.forceHitHeight):n.type==="light"?bn(t.hitHeight.light):n.type==="heavy"?bn(t.hitHeight.heavy):n.type==="knock"?bn(t.hitHeight.knock):0}function VT(n,t,e){const i=bn(e),a=(s,o)=>s+(o-s)*i;return{upperPitch:a(n.upperPitch,t.upperPitch),upperRoll:a(n.upperRoll,t.upperRoll),upperYaw:a(n.upperYaw,t.upperYaw),fold:a(n.fold,t.fold),shift:a(n.shift,t.shift),drop:a(n.drop,t.drop),back:a(n.back,t.back),knee:a(n.knee,t.knee),hip:a(n.hip,t.hip),arm:a(n.arm,t.arm)}}function vm(n,t,e){const i=xm(),a=GT(n,e);if(i.intensity=a,a<=0||n.duration<=0||!Number.isFinite(n.timer))return i;const s=bn(1-n.timer/n.duration),o=gm(s,e.pulseRatio);i.pulse=o,i.active=o>0,i.hitHeight=XT(n,e);const r=Math.sin(t),l=Math.cos(t),c=Math.cos(t),d=-Math.sin(t),u=n.dirX*r+n.dirZ*l,h=n.dirX*c+n.dirZ*d;if(i.localFwd=u,i.localRight=h,!e.enabled){i.legacy=!0;const _=Math.sin(Math.PI*s);return i.upperPitch=a*_*u,i.upperRoll=-a*_*h*.7,i.drop=(a>.5?.09:.04)*_,i.flash=e.flashStrength*_,i.active=_>0,i}const f=a*o,m=VT(e.abdomen,e.shoulder,i.hitHeight);return i.upperPitch=f*(m.upperPitch*u+m.fold),i.upperRoll=-f*m.upperRoll*h,i.upperYaw=f*m.upperYaw*h,i.upperShift=f*m.shift,i.upperShiftX=i.upperShift*h,i.upperShiftZ=i.upperShift*u,i.comShift=f*e.comShift,i.comX=i.comShift*h,i.comZ=i.comShift*u,i.pelvisBack=f*m.back,i.drop=f*m.drop,i.knee=f*m.knee,i.hip=f*m.hip,i.arm=f*m.arm,i.flash=e.flashStrength*o,i}function ym(n,t){const e=Math.max(0,t.pelvisTiltGain),i=Math.max(0,t.pelvisShift),a=Number.isFinite(n.leanForward)?n.leanForward:0,s=Number.isFinite(n.leanSide)?n.leanSide:0,o=Number.isFinite(n.speedRatio)?Math.max(0,Math.min(1,n.speedRatio)):0;return{pelvisPitch:a*e,pelvisRoll:s*e,pelvisX:-s*i,pelvisZ:a*i,crouch:Math.max(0,t.moveCrouch)*o}}const pa=1e-6;function oo(n,t,e){return n<t?t:n>e?e:n}function _m(n,t,e,i=1){const a=t,s=e;if(!Number.isFinite(a)||!Number.isFinite(s)||a<=pa||s<=pa||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isFinite(n.z))return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const r=a+s,l=Math.abs(a-s)+pa,c=Math.hypot(n.x,n.y,n.z);if(c<=pa)return{rootPitch:0,rootRoll:0,jointPitch:0,clamped:!0,reach:0};const d=Math.atan2(n.x,-n.y),u=Math.hypot(n.x,n.y),h=n.z,f=Math.hypot(h,u),m=oo(f,l,r),_=f>r+pa||f<l-pa,g=Math.atan2(-h,Math.max(u,pa)),p=oo((a*a+m*m-s*s)/(2*a*m),-1,1),v=oo((s*s+m*m-a*a)/(2*s*m),-1,1),x=Math.acos(p),y=Math.acos(v),w=i>=0?1:-1;return{rootPitch:g-w*x,rootRoll:d,jointPitch:w*(x+y),clamped:_,reach:c/r}}function Mm(n,t,e,i){const a=oo(e,0,1),s=Math.max(0,i),o=(r,l)=>{const c=oo((l-r)*a,-s,s);return r+c};return{rootPitch:o(n.rootPitch,t.rootPitch),rootRoll:o(n.rootRoll,t.rootRoll),jointPitch:o(n.jointPitch,t.jointPitch)}}function bm(n,t){return{pelvisPos:n.position.clone(),pelvisRotX:n.rotation.x,pelvisRotZ:n.rotation.z,lowerPos:t.position.clone(),lowerRotZ:t.rotation.z}}const Kh={active:!1,weight:0,clamped:0,maxError:0};function Sm(n){const{root:t,pelvis:e,lower:i,limbs:a,base:s,cfg:o}=n;if(!o.enabled||o.weight<=0||!n.grounded||a.length===0)return{...Kh};const r={pelvisPos:e.position.clone(),pelvisRotX:e.rotation.x,pelvisRotZ:e.rotation.z,lowerPos:i.position.clone(),lowerRotZ:i.rotation.z};e.position.copy(s.pelvisPos),e.rotation.x=s.pelvisRotX,e.rotation.z=s.pelvisRotZ,i.position.copy(s.lowerPos),i.rotation.z=s.lowerRotZ,t.updateWorldMatrix(!0,!0);const l=a.map(f=>f.tip.getWorldPosition(new X));e.position.copy(r.pelvisPos),e.rotation.x=r.pelvisRotX,e.rotation.z=r.pelvisRotZ,i.position.copy(r.lowerPos),i.rotation.z=r.lowerRotZ,t.updateWorldMatrix(!0,!0),i.updateWorldMatrix(!0,!1);const c=Math.max(0,Math.min(1,o.weight))*(n.attacking?Math.max(0,Math.min(1,o.attackScale)):1),d=Math.max(0,o.maxCorrectionDeg)*Math.PI/180;let u=0;for(let f=0;f<a.length;f++){const m=a[f],_=i.worldToLocal(l[f].clone()),g={x:_.x-m.root.position.x,y:_.y-m.root.position.y,z:_.z-m.root.position.z},p=_m(g,m.upperLen,m.lowerLen,m.bend);p.clamped&&(u+=1);const v=Mm({rootPitch:m.root.rotation.x,rootRoll:m.root.rotation.z,jointPitch:m.joint.rotation.x},p,c,d);m.root.rotation.x=v.rootPitch,m.root.rotation.z=v.rootRoll,m.joint.rotation.x=v.jointPitch}t.updateWorldMatrix(!0,!0);let h=0;for(let f=0;f<a.length;f++){const m=a[f].tip.getWorldPosition(new X);h=Math.max(h,m.distanceTo(l[f]))}return{active:!0,weight:c,clamped:u,maxError:h}}function Xn(n,t,e){return n<t?t:n>e?e:n}function WT(n,t,e,i,a,s,o,r,l,c){const d=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},u=new Le,h=new Le;h.name="pelvis",h.position.y=n.legLength,u.add(h);const f=new Le;f.name="lower";const m=new Le;m.name="upper",h.add(f),h.add(m);const _=[],g=(tt,ut,Ut,at)=>{const bt=new Pa({color:at}),H=new _e(new $n(tt,ut,Ut),bt);return H.castShadow=!0,H.receiveShadow=!0,_.push(bt),H},p=n.headSize,v=n.legLength,x=n.armLength,y=n.limbThickness,w=n.bodyHeight,S=n.bodyWidth,T=g(S,w,.28,e);T.position.y=w/2,m.add(T);const E=new Le;E.name="headPivot",E.rotation.order="YXZ",E.position.y=w,m.add(E);const M=g(p,p,p,e);M.position.y=p/2,E.add(M);for(const tt of[-1,1]){const ut=g(.06,.07,.02,t.shoe);ut.position.set(tt*.09,p/2+.03,p/2+.011),E.add(ut)}const b=(tt,ut)=>{const Ut=ut?x:v,at=new Le;at.name=ut?tt<0?"shoulderL":"shoulderR":tt<0?"hipL":"hipR",ut||(at.rotation.order="ZYX"),at.position.set(tt*(ut?S/2+y/2:S/2-y/2),ut?w-.04:0,0),(ut?m:f).add(at);const bt=g(y,Ut/2,y,t.limb);bt.position.y=-Ut/4,at.add(bt);const H=new Le;H.name=ut?"elbow":"knee",H.position.y=-Ut/2,at.add(H);const ht=g(y,Ut/2,y,t.limb);if(ht.position.y=-Ut/4,H.add(ht),!ut){const yt=g(y*1.15,.07,y*1.7,t.shoe);yt.position.set(0,-Ut/2+.035,.045),H.add(yt);const Gt=new je;return Gt.name="footTip",Gt.position.y=-Ut/2,H.add(Gt),{root:at,joint:H,tip:Gt}}return{root:at,joint:H}},R=b(-1,!1),k=b(1,!1),C=b(-1,!0),I=b(1,!0),L=[R,k].map(tt=>({root:tt.root,joint:tt.joint,tip:tt.tip,upperLen:v/2,lowerLen:v/2,bend:1})),D=new pn({color:a.attackArcColor,transparent:!0,opacity:0,side:Qe,depthWrite:!1}),O=new _e(new jr(.62,.042,6,20,Math.PI*1.1),D);O.position.set(0,.78-v,.56),m.add(O);const B=new ie(e),V=new ie(r.flashColor),ot=new ie;let gt=null,vt=0,It=0,K=0,it=0,ct=0,Z=0,J=0,lt={...Kh},Ht=-1,qt=0,Ct=0,q=0,U=0,Nt=0,Dt=0,St=0,_t=1,xt=0,Rt=0,F="none",A=0,G=!1,pt=-1,Q=!1,rt=0,Ft=0;return{group:u,boneAtWorld(tt,ut,Ut){const at=[{node:m,ax:0,ay:.05,az:0,bx:0,by:w,bz:0},{node:E,ax:0,ay:0,az:0,bx:0,by:p,bz:0},{node:C.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:C.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.root,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:I.joint,ax:0,ay:0,az:0,bx:0,by:-x/2,bz:0},{node:R.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:R.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:k.root,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0},{node:k.joint,ax:0,ay:0,az:0,bx:0,by:-v/2,bz:0}],bt=new X,H=new X,ht=new X(tt,ut,Ut),yt=new X;let Gt=null,Ot=Number.POSITIVE_INFINITY;for(const Lt of at){Lt.node.updateWorldMatrix(!0,!1),bt.set(Lt.ax,Lt.ay,Lt.az),H.set(Lt.bx,Lt.by,Lt.bz),Lt.node.localToWorld(bt),Lt.node.localToWorld(H);const N=H.x-bt.x,wt=H.y-bt.y,st=H.z-bt.z,dt=N*N+wt*wt+st*st;let Et=dt>1e-8?((ht.x-bt.x)*N+(ht.y-bt.y)*wt+(ht.z-bt.z)*st)/dt:0;Et=Math.max(0,Math.min(1,Et));const Tt=bt.x+N*Et,Qt=bt.y+wt*Et,re=bt.z+st*Et,de=(ht.x-Tt)**2+(ht.y-Qt)**2+(ht.z-re)**2;de<Ot&&(Ot=de,Gt=Lt.node,yt.set(Tt,Qt,re))}return Gt?{node:Gt,point:yt.clone()}:null},update(tt,ut){u.position.set(tt.position.x,tt.position.y,tt.position.z),u.rotation.y=tt.bodyYaw,E.rotation.y=(tt.headYaw-tt.bodyYaw+Math.PI*3)%(Math.PI*2)-Math.PI,tt.mode!==gt&&(gt=tt.mode,vt=1),vt=Math.max(0,vt-ut*2.2);const Ut=tt.hurt,at=vm(Ut,tt.bodyYaw,r),bt=at.flash;ot.copy(V).multiplyScalar(bt);for(const Vt of _)Vt.emissive.copy(B).multiplyScalar(vt*.5),bt>0&&Vt.emissive.add(ot);h.position.set(0,v,0),h.rotation.set(0,0,0),m.position.set(0,0,0),m.rotation.set(0,0,0),f.position.set(0,0,0),f.rotation.z=0;const H=Math.hypot(tt.velocity.x,tt.velocity.z),ht=Xn(o.knockGaitScale??0,0,1),yt=tt.hurt.knockX*ht,Gt=tt.hurt.knockZ*ht,Ot=ht>0&&Math.hypot(tt.hurt.knockX,tt.hurt.knockZ)>.001,Lt=tt.velocity.x+yt,N=tt.velocity.z+Gt,wt=Math.hypot(Lt,N),st=Math.cos(tt.bodyYaw),dt=-Math.sin(tt.bodyYaw),Et=H>1e-6?Xn((tt.velocity.x*st+tt.velocity.z*dt)/H,-1,1):0,Tt=H>1e-6?Xn((tt.velocity.x*Math.sin(tt.bodyYaw)+tt.velocity.z*Math.cos(tt.bodyYaw))/H,-1,1):1,Qt=qh(Tt,o.backStrafeStartDeg,o.backStrafeFullDeg);F==="settled"&&Q&&rt>Ft*1.02+1e-4&&(F="none");let re=1;F==="blend"?(re=pm(G?pt:A,o.stopYawBlendMode,G),G||(A=Math.min(1,A+ut/Math.max(.01,o.stopYawAfterSec)),(A>=1||o.stopYawBlendMode==="inStop"||Q)&&(F="settled",re=0))):F==="settled"&&(re=Xn(H/Math.max(1e-6,o.stopEnterRatio*s),0,1));const de=lm(Et,o.strafeHipScale,o.strafeHipMaxDeg,o.strafeHipBoost),ae=hm(Tt,Et,de,Qt)*re;xt+=(ae-xt)*(1-Math.exp(-12*Math.max(0,ut))),f.rotation.y=xt;const Te=tt.bodyYaw+xt,ge=Math.sin(Te),gn=Math.cos(Te),wn=Math.cos(Te),Be=-Math.sin(Te),Re=Lt*ge+N*gn,qe=Lt*wn+N*Be,kn=Math.max(0,o.stopBlendSec||0),nn=kn>0&&!Ot,W=dm(H,Rt,s,o.stopEnterRatio,o.stopExitRatio);if(!nn||W.resume)Ht=-1;else if(Ht<0&&W.enter){Ht=0,qt=tt.gaitPhase,Ct=rm(tt.gaitPhase),q=H,U=Math.max(tt.stride,1e-6),Nt=Re,Dt=qe;const Vt=1/Math.max(1e-6,H);St=tt.velocity.x*Vt,_t=tt.velocity.z*Vt}const Pt=Rt;Rt=H;const kt=nn&&Ht>=0;kt&&(Ht=Math.min(1,Ht+ut/kn)),kt&&F!=="blend"&&(F="blend",A=0),G=kt&&Ht<1,pt=Ht,Q=W.resume,rt=H,Ft=Pt;const ee=kt?{phase:qt,speed:q,moveSpeed:s,localForward:Nt,localRight:Dt,legLength:n.legLength,stride:U,grounded:!0}:{phase:tt.gaitPhase,speed:wt,moveSpeed:s,localForward:Re,localRight:qe,legLength:n.legLength,stride:tt.stride,grounded:!0},Kt=kt?cm(ee,o,{progress:Ht,phase0:qt,phaseEnd:Ct}):Nr(ee,o);let oe=0,pe=0,P=0,Y=0;if(kt){const Vt=fm(tt.bodyYaw,St,_t),$t=mm(Ht,qt,Vt.forward,Vt.right,o);$t.leadLeft?(Kt.legL.pitchX-=$t.leadPitch,Kt.legL.kneeX+=$t.leadKnee,Kt.legR.pitchX+=$t.trailPitch):(Kt.legR.pitchX-=$t.leadPitch,Kt.legR.kneeX+=$t.leadKnee,Kt.legL.pitchX+=$t.trailPitch),pe=$t.bodyShift*$t.fwdN,oe=$t.bodyShift*$t.rightN,P=$t.bodyDip,Y=$t.chestPitch}R.root.rotation.x=Kt.legL.pitchX,k.root.rotation.x=Kt.legR.pitchX,R.root.rotation.z=Kt.legL.rollZ,k.root.rotation.z=Kt.legR.rollZ,R.joint.rotation.x=Kt.legL.kneeX,k.joint.rotation.x=Kt.legR.kneeX,C.root.rotation.x=Kt.armL,I.root.rotation.x=Kt.armR,C.joint.rotation.x=-.18,I.joint.rotation.x=-.18,h.position.x=Kt.pelvisX,h.position.y=v+Kt.pelvisY,h.position.z=0,h.rotation.z=Kt.pelvisRoll,m.rotation.z=Kt.sideLean*(at.intensity>0?.4:1);const et=bm(h,f),nt=kt&&d.enabled?{...d,weight:1}:d,$=nt.enabled&&nt.weight>0?Xn(nt.weight,0,1):0;if(h.position.x+=oe,h.position.z+=pe,h.position.y-=P,f.position.y+=P,$<=0&&(f.position.x-=oe,f.position.z-=pe),l){const Vt=Math.max(.004166666666666667,Math.min(ut,.1)),$t=Math.sin(tt.bodyYaw),Wt=Math.cos(tt.bodyYaw),le=Xn((tt.velocity.x-It)/Vt,-60,60),ve=Xn((tt.velocity.z-K)/Vt,-60,60),Ee=le*$t+ve*Wt,Fe=Ye(tt.bodyYaw-it)/Vt,Bt=l.maxForwardDeg*Math.PI/180,ft=l.maxSideDeg*Math.PI/180,ne=1-Math.exp(-Math.max(0,l.smoothing)*Vt);ct+=(Xn(Ee*l.accelGain,-Bt,Bt)-ct)*ne,Z+=(Xn(-Fe*H*l.turnGain,-ft,ft)-Z)*ne;const ce=Number.isFinite(l.crouchSmoothing)?l.crouchSmoothing:8;J+=(Xn(H/Math.max(s,1e-6),0,1)-J)*(1-Math.exp(-Math.max(0,ce)*Vt));const Me=ym({leanForward:ct,leanSide:Z,speedRatio:J},l);m.rotation.x+=ct+Y,m.rotation.z+=Z,h.rotation.x+=Me.pelvisPitch,h.rotation.z+=Me.pelvisRoll,h.position.x+=Me.pelvisX,h.position.z+=Me.pelvisZ,h.position.y-=Me.crouch,f.position.y+=Me.crouch*(1-$)}It=tt.velocity.x,K=tt.velocity.z,it=tt.bodyYaw,m.rotation.x+=at.upperPitch,m.rotation.z+=at.upperRoll,m.rotation.y+=at.upperYaw;const At=Xn(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),zt=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;m.position.x+=Xn(at.upperShiftX*At,-zt,zt),m.position.z+=Xn(at.upperShiftZ*At,-zt,zt),h.position.x+=at.comX,h.position.z+=at.comZ-at.pelvisBack,h.position.y-=at.drop;const Zt=at.legacy?0:Math.max(0,Math.min(1,r.lowerScale));if(f.position.z+=at.pelvisBack*(1-Zt),f.position.y+=at.drop*(1-Zt),R.joint.rotation.x+=at.knee,k.joint.rotation.x+=at.knee,R.root.rotation.x-=at.hip,k.root.rotation.x-=at.hip,C.root.rotation.x+=at.arm,I.root.rotation.x+=at.arm*.8,tt.attackPhase!=="idle"&&at.intensity===0){const Vt=tt.attackProgress,$t=Vt<.34?-1:Vt<.68?-1+(Vt-.34)/.34*2:Math.max(0,1-(Vt-.68)/.32),Wt=Math.max(0,-$t),le=Math.max(0,$t);I.root.rotation.x=-1.7*Wt+1.25*le,I.joint.rotation.x=-(.25+Wt*.45),m.rotation.y=-.28*$t,D.opacity=tt.attackPhase==="active"?.85:0,tt.attackPhase==="active"&&(O.rotation.z=-1.1+Vt*3)}else D.opacity=0;const jt=um(xt,o.chestYawScale,o.chestYawMaxDeg);m.rotation.y+=jt,E.rotation.y=(tt.headYaw-tt.bodyYaw-jt+Math.PI*3)%(Math.PI*2)-Math.PI,lt=Sm({root:u,pelvis:h,lower:f,limbs:L,base:et,cfg:nt,grounded:!0,attacking:tt.attackPhase!=="idle"})},ik(){return lt},dispose(){u.traverse(tt=>{if(tt instanceof _e){tt.geometry.dispose();const ut=tt.material;Array.isArray(ut)?ut.forEach(Ut=>Ut.dispose()):ut.dispose()}})}}}const YT=9.81;function Ks(n,t,e){return n<t?t:n>e?e:n}function $T(n,t,e,i,a){const s=a!=null&&a.gravity&&a.gravity>0?a.gravity:YT,o={comX:0,comY:0,comZ:0,xcomX:0,xcomZ:0,centerX:0,centerZ:0,halfX:0,halfZ:0,marginX:1,marginZ:1,score:1,leanDeg:0,side:0,overX:0,overZ:0,grounded:!1};let r=0,l=0,c=0,d=0;for(const M of n){const b=Number.isFinite(M.mass)&&M.mass>0?M.mass:0;!Number.isFinite(M.x)||!Number.isFinite(M.y)||!Number.isFinite(M.z)||(r+=b,l+=M.x*b,c+=M.y*b,d+=M.z*b)}if(r<=1e-6)return o;l/=r,c/=r,d/=r;const u=Math.max(.02,(t.maxX-t.minX)/2),h=Math.max(.02,(t.maxZ-t.minZ)/2),f=(t.minX+t.maxX)/2,m=(t.minZ+t.maxZ)/2;if(!(t.maxX-t.minX>.03&&t.maxZ-t.minZ>.03))return{...o,comX:l,comY:c,comZ:d,centerX:f,centerZ:m,halfX:u,halfZ:h};const g=Ks((a==null?void 0:a.reactionTime)??.18,.02,1),p=Math.sqrt(Math.max(.05,c)/s)*g*4,v=l+(Number.isFinite(e)?e:0)*p,x=d+(Number.isFinite(i)?i:0)*p,y=Math.abs(v-f)/u,w=Math.abs(x-m)/h,S=Ks(1-Math.max(y,w),0,1),T=Math.max(0,Math.abs(v-f)-u),E=Math.max(0,Math.abs(x-m)-h);return{comX:l,comY:c,comZ:d,xcomX:v,xcomZ:x,centerX:f,centerZ:m,halfX:u,halfZ:h,marginX:Ks(1-y,-1,1),marginZ:Ks(1-w,-1,1),score:S,leanDeg:Math.atan2(v-f,x-m)*180/Math.PI,side:y>.98?v>f?1:-1:0,overX:T,overZ:E,grounded:!0}}function ZT(n,t,e){if(!Number.isFinite(n))return 0;if(!Number.isFinite(t)||!(e>0))return n;const i=n+t*e;return n!==0&&Math.sign(i)!==Math.sign(n)?0:Math.abs(i)>Math.abs(n)?i:n}function jT(n,t,e){const i=Math.max(0,n);if(!(e>0))return i;const a=Ks(Number.isFinite(t)?t:0,0,2);return i*(1+e*a)}const xh={arm:1,leg:1,torso:1,girthArm:1,girthLeg:1,girthTorso:1},qT=1e-6;function Vn(n,t,e){return n<t?t:n>e?e:n}function sl(n,t){const e=Math.max(.2,n);return Vn(Math.pow(e,-t),.5,2)}function KT(n,t){if(!t.enabled)return{...xh};const e=Vn(n.swing,-1,1),i=Vn(n.charge,0,1),a=Vn(n.impact,0,1),s=Vn(n.speedRatio,0,1),o=Math.max(0,e),r=1-(1-o)*(1-o),l=1+(Math.max(1,t.swingArm)-1)*r,c=Math.max(0,-e),d=Vn(t.chargeArm,.6,1),u=1-(1-d)*c,h=1-(1-d)*i;let f=1;o>0?f=l:c>0?f=u:i>0&&(f=h);const m=1-Vn(t.impactSquash,0,.6)*a;f*=m;const _=Math.max(1,t.runLeg),p=(n.grounded?1+(_-1)*s:1)*(1-Vn(t.impactSquash,0,.6)*a*.6),v=Vn(t.torsoGain,0,1),x=1+(f-1)*v;return f=Vn(f,.6,1.6),{arm:f,leg:Vn(p,.6,1.4),torso:Vn(x,.7,1.4),girthArm:sl(f,t.volumeExp),girthLeg:sl(p,t.volumeExp),girthTorso:sl(x,t.volumeExp)}}function JT(n,t,e,i){const a=1-Math.exp(-Math.max(0,i)*Math.max(0,e)),s=(o,r)=>o+(r-o)*a;return{arm:s(n.arm,t.arm),leg:s(n.leg,t.leg),torso:s(n.torso,t.torso),girthArm:s(n.girthArm,t.girthArm),girthLeg:s(n.girthLeg,t.girthLeg),girthTorso:s(n.girthTorso,t.girthTorso)}}function QT(n,t,e){const i=n*Math.exp(-Math.max(qT,e)*Math.max(0,t));return i<.001?0:Vn(i,0,1)}const Tf=[{yaw:.85,pitch:-.12,roll:-.14,pz:-.06,px:.045,ap:-1.2,ay:-.42,ar:.16,el:-.48,blade:.3},{yaw:-.95,pitch:.14,roll:.17,pz:.1,px:-.05,ap:-1.46,ay:-.6,ar:-.1,el:-.14,blade:-.05},{yaw:-.75,pitch:-.08,roll:.14,pz:-.04,px:-.04,ap:-1.28,ay:-.58,ar:-.12,el:-.5,blade:.3},{yaw:.92,pitch:.15,roll:-.18,pz:.1,px:.05,ap:-1.48,ay:-.4,ar:.12,el:-.13,blade:-.05},{yaw:.12,pitch:-.32,roll:-.05,pz:-.07,px:0,ap:-1.9,ay:-.3,ar:.16,el:-.55,blade:1.3},{yaw:0,pitch:.55,roll:.02,pz:.13,px:0,ap:.05,ay:-.2,ar:0,el:-.1,blade:-.55}];function vs(n,t,e){return n<t?t:n>e?e:n}function Oe(n,t,e){return n+(t-n)*e}function tA(n){return n?typeof n=="string"?{clip:n}:n:null}function eA(){return{bodyYaw:0,bodyPitch:0,bodyRoll:0,pelvisX:0,pelvisZ:0,armPitch:0,armYaw:0,armRoll:0,elbow:0,bladePitch:0,armLPitch:0,armLYaw:0,armLRoll:0,elbowL:0,rootYaw:0,bladePitchOff:0,bladeTwist:0,bladeTwistOff:0,bladeYaw:0,bladeYawOff:0}}function nA(n,t){const e=n%3*2,i=Tf[e],a=Tf[e+1];return{...eA(),bodyYaw:Oe(i.yaw,a.yaw,t),bodyPitch:Oe(i.pitch,a.pitch,t),bodyRoll:Oe(i.roll,a.roll,t),pelvisX:Oe(i.px,a.px,t),pelvisZ:Oe(i.pz,a.pz,t),armPitch:Oe(i.ap,a.ap,t),armYaw:Oe(i.ay,a.ay,t),armRoll:Oe(i.ar,a.ar,t),elbow:Oe(i.el,a.el,t),bladePitch:Oe(i.blade,a.blade,t)}}function iA(n,t,e,i,a=0){var M,b,R;const s=((M=i.combo)==null?void 0:M[n])??[],o=Math.max(1,s.length),r=(((Math.round(t)||1)-1)%o+o)%o,l=tA(s[r]),c=l?((b=i.clips)==null?void 0:b[l.clip])??null:null,d=vs(((R=i.weaponScale)==null?void 0:R[n])??1,0,2),u=Number.isFinite(i.bodyScale)?Math.max(0,i.bodyScale):1,h=l&&Number.isFinite(l.scale)?l.scale:d,f=h*u,m=vs((e+1)/2,0,1),_=c&&c.keys.length>0?vx(c,m):nA(r,m),g=((l==null?void 0:l.lead)??(c==null?void 0:c.lead)??"R")==="L"?"L":"R",p=(c==null?void 0:c.kind)??["right-left","left-right","overhead"][r]??"custom",v=n==="dual-swords",x=c&&oa(c,"bladeTwistOff")?_.bladeTwistOff:v?_.bladeTwist:0,y=c&&oa(c,"bladeYawOff")?_.bladeYawOff:-_.bladeYaw,w={yaw:_.bodyYaw*f,rootYaw:_.rootYaw*f,spinYaw:yx(c,vs(a,0,1)),pitch:_.bodyPitch*f,roll:_.bodyRoll*f,pelvisZ:_.pelvisZ*f,pelvisX:_.pelvisX*f,armR:null,armL:null,bladePitch:_.bladePitch,bladePitchOff:c&&oa(c,"bladePitchOff")?_.bladePitchOff:null,bladeTwist:_.bladeTwist,bladeTwistOff:x,bladeYaw:_.bladeYaw,bladeYawOff:y,lead:g,kind:p,strike:m,blend:l&&Number.isFinite(l.blend)?l.blend:null},S={pitch:_.armPitch*h,yaw:_.armYaw*h,roll:_.armRoll*h,elbow:_.elbow*h},T=c?oa(c,"armLPitch")||oa(c,"armLYaw")||oa(c,"armLRoll")||oa(c,"elbowL"):!1,E=T?{pitch:_.armLPitch*h,yaw:_.armLYaw*h,roll:_.armLRoll*h,elbow:_.elbowL*h}:{pitch:S.pitch+(n==="greatsword"?.08:.1),yaw:S.yaw*.8,roll:n==="greatsword"?.4:-S.roll*.6,elbow:S.elbow};return g==="L"?(w.armL=S,w.armR=n==="greatsword"?null:E):(w.armR=S,(n==="greatsword"||n==="dual-swords"||T)&&(w.armL=E)),w}function aA(n,t,e){const i=vs(e,0,1),a=(s,o)=>s?o?{pitch:Oe(s.pitch,o.pitch,i),yaw:Oe(s.yaw,o.yaw,i),roll:Oe(s.roll,o.roll,i),elbow:Oe(s.elbow,o.elbow,i)}:null:o;return{yaw:Oe(n.yaw,t.yaw,i),rootYaw:Oe(n.rootYaw,t.rootYaw,i),spinYaw:t.spinYaw,pitch:Oe(n.pitch,t.pitch,i),roll:Oe(n.roll,t.roll,i),pelvisZ:Oe(n.pelvisZ,t.pelvisZ,i),pelvisX:Oe(n.pelvisX,t.pelvisX,i),armR:a(n.armR,t.armR),armL:a(n.armL,t.armL),bladePitch:n.bladePitch===null||t.bladePitch===null?i<.5?n.bladePitch:t.bladePitch:Oe(n.bladePitch,t.bladePitch,i),bladePitchOff:n.bladePitchOff===null||t.bladePitchOff===null?i<.5?n.bladePitchOff:t.bladePitchOff:Oe(n.bladePitchOff,t.bladePitchOff,i),bladeTwist:Oe(n.bladeTwist,t.bladeTwist,i),bladeTwistOff:Oe(n.bladeTwistOff,t.bladeTwistOff,i),bladeYaw:Oe(n.bladeYaw,t.bladeYaw,i),bladeYawOff:Oe(n.bladeYawOff,t.bladeYawOff,i),lead:t.lead,kind:t.kind,strike:Oe(n.strike,t.strike,i),blend:t.blend??null}}function sA(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Af(n,t){return!n||!t?n||t?.6:0:Math.abs(n.pitch-t.pitch)*1+Math.abs(n.yaw-t.yaw)*.8+Math.abs(n.roll-t.roll)*.6+Math.abs(n.elbow-t.elbow)*.8}function oA(n,t){const e=(a,s)=>Math.abs(sA(a-s));let i=0;return i+=e(n.yaw,t.yaw)*1,i+=e(n.rootYaw,t.rootYaw)*.7,i+=e(n.pitch,t.pitch)*.9,i+=e(n.roll,t.roll)*.9,i+=Math.abs(n.pelvisX-t.pelvisX)*2,i+=Math.abs(n.pelvisZ-t.pelvisZ)*2,i+=Af(n.armR,t.armR),i+=Af(n.armL,t.armL)*.8,i+=e(n.bladePitch??0,t.bladePitch??0)*1.1,i+=e(n.bladePitchOff??0,t.bladePitchOff??0)*.7,i+=e(n.bladeTwist,t.bladeTwist)*.5,i+=e(n.bladeYaw,t.bladeYaw)*.5,i}function rA(n,t,e,i,a){if(i!=null&&Number.isFinite(i)&&i>=0)return Math.max(.008,i);const s=Math.max(.008,e.segBlend??.1);if(!n)return s;const o=Math.max(.008,e.segBlendMin??.03),r=Math.max(o,Number.isFinite(a)?a:e.segBlendMax??.14),l=Math.max(.1,e.segBlendRef??6),c=vs(oA(n,t)/l,0,1);return o+(r-o)*c}function Rf(n){const t=vs(n,0,1);return t*t*(3-2*t)}function Ge(n,t,e,i){const a=new _e(new $n(n,t,e),new Pa({color:i}));return a.castShadow=!0,a.receiveShadow=!0,a}function $e(){return new Le}function Mr(n,t,e){const i=$e(),a=Ge(t*.7,.12,t*.7,e.wood);a.position.y=.06,i.add(a);const s=Ge(t*2.4,.045,t*.8,e.metal);s.position.y=.13,i.add(s);const o=Ge(t*.38,n,t,e.blade);o.position.y=.13+n/2,i.add(o);const r=Ge(t*.42,n*.96,t*.2,e.bladeEdge);r.position.set(0,.13+n/2,t*.5),i.add(r);const l=Ge(t*.3,.09,t*.45,e.blade);return l.position.y=.13+n+.045,i.add(l),i}function cA(n){const t=Mr(.72,.15,n),e=Ge(.12,.46,.12,n.wood);return e.position.y=-.3,t.add(e),t}function lA(n){const t=$e(),e=Ge(.32,.38,.06,n.metal);e.position.set(0,.02,.1),t.add(e);const i=Ge(.11,.11,.045,n.blade);return i.position.set(0,.02,.145),t.add(i),t}function hA(n){const t=$e(),e=Ge(.055,.88,.055,n.wood);e.position.y=.42,t.add(e);const i=Ge(.15,.15,.15,n.glow);i.position.y=.92;const a=i.material;return a.emissive=new ie(n.glow),a.emissiveIntensity=.85,t.add(i),{g:t,orb:i}}function dA(n){const t=$e();for(let i=0;i<5;i++){const a=(i-2)*.15,s=Ge(.055,.16,.05,n.wood);s.position.set(.16-Math.abs(a)*.46,a,0),t.add(s)}const e=Ge(.014,.66,.014,n.blade);return e.position.z=-.06,t.add(e),{g:t,drawString:e}}function uA(n){const t=$e(),e=Ge(.025,.025,.46,n.wood);e.position.z=.23,t.add(e);const i=Ge(.055,.055,.09,n.blade);return i.position.z=.5,t.add(i),t}function fe(n,t,e){return n<t?t:n>e?e:n}const Li=1e-6;function wm(n,t,e,i,a,s,o,r,l,c,d,u,h){const f=c??{enabled:!1,weight:0,attackScale:1,maxCorrectionDeg:70},m=u??{enabled:!1,lag:.022,maxAngle:.62,rate:26,twistLag:.018,maxTwist:.45,runDrag:0},_=d??{leanDeg:16,shieldPitchDeg:42,pelvisReach:.12},g=l.stretch??{enabled:!1,swingArm:1,chargeArm:1,runLeg:1,torsoGain:0,impactSquash:0,impactDecay:12,volumeExp:.5,smoothing:26},p=l.swing??{enabled:!1,bodyScale:1,shoulderLift:.045,shoulderPush:.035,shoulderIn:.03,segBlend:.1,weaponScale:{greatsword:1,"sword-shield":.62,"dual-swords":.55}},v=$e(),x=$e();x.name="pelvis",x.position.y=n.legLength,v.add(x);const y=$e();y.name="lower";const w=$e();w.name="upper",x.add(y),x.add(w);const S=n.headSize,T=n.legLength,E=n.armLength,M=n.limbThickness,b=n.bodyHeight,R=n.bodyWidth,k=l.spine,C=!!(k!=null&&k.enabled),I=C?fe(k.chestPivot??.42,.15,.85)*b:0,L=$e();L.name="chest",L.position.y=I,w.add(L);const D=C?L:w;let O,B=null,V=b,ot=0;C?(V=Math.max(.05,I),ot=Math.max(.05,b-I),O=Ge(R,V,.28,t.body),O.name="torsoLower",O.position.y=V/2,w.add(O),B=Ge(R+.008,ot,.288,t.body),B.name="torsoUpper",B.position.y=ot/2,L.add(B)):(O=Ge(R,b,.28,t.body),O.name="torso",O.position.y=b/2,w.add(O));const gt=$e();gt.name="headPivot",gt.rotation.order="YXZ",gt.position.y=Math.min(i.headPivotHeight,b)-I,D.add(gt);const vt=Ge(S,S,S,t.head);vt.position.y=S/2,gt.add(vt);const It=new Pa({color:"#1b2733"});for(const z of[-1,1]){const j=new _e(new $n(.06,.07,.02),It);j.position.set(z*.09,S/2+.03,S/2+.011),gt.add(j)}const K=z=>{const j=$e();j.name=z<0?"hipL":"hipR",j.rotation.order="ZYX",j.position.set(z*(R/2-M/2),0,0),y.add(j);const mt=Ge(M,T/2,M,t.limb);mt.position.y=-T/4,j.add(mt);const Mt=$e();Mt.name="knee",Mt.position.y=-T/2,j.add(Mt);const te=Ge(M,T/2,M,t.limb);te.position.y=-T/4,Mt.add(te);const Jt=Ge(M*1.15,.07,M*1.7,t.shoe);Jt.position.set(0,-T/2+.035,.045),Mt.add(Jt);const he=new je;he.name="footTip",he.position.y=-T/2,Mt.add(he);const be=$e();return{root:j,joint:Mt,hand:be,wrist:be,tip:he,upperMesh:mt,lowerMesh:te,segLen:T/2}},it=z=>{const j=$e();j.name=z<0?"shoulderL":"shoulderR",j.rotation.order="YXZ",j.position.set(z*(R/2+M/2),b-.04-I,0),D.add(j);const mt=Ge(M,E/2,M,t.limb);mt.position.y=-E/4,j.add(mt);const Mt=$e();Mt.name="elbow",Mt.position.y=-E/2,j.add(Mt);const te=Ge(M,E/2,M,t.limb);te.position.y=-E/4,Mt.add(te);const Jt=$e();Jt.name=z<0?"handL":"handR",Jt.position.y=-E/2,Mt.add(Jt);const he=Ge(M*1.1,.09,M*1.1,t.head);he.position.y=.045,Jt.add(he);const be=$e();return be.name=z<0?"wristL":"wristR",Jt.add(be),{root:j,joint:Mt,hand:Jt,wrist:be,upperMesh:mt,lowerMesh:te,segLen:E/2}},ct=K(-1),Z=K(1),J=it(-1),lt=it(1),Ht=[ct,Z].map(z=>({root:z.root,joint:z.joint,tip:z.tip,upperLen:T/2,lowerLen:T/2,bend:1})),qt=$e(),Ct=$e();qt.name="mountR",Ct.name="mountL";const q=$e(),U=$e();q.name="gripR",U.name="gripL",lt.wrist.add(qt),J.wrist.add(Ct),qt.add(q),Ct.add(U);const Nt=hA(t),Dt=dA(t),St=uA(t),_t={"sword-shield":{right:Mr(.42,.075,t),left:lA(t)},"dual-swords":{right:Mr(.42,.075,t),left:Mr(.42,.075,t)},greatsword:{right:cA(t),left:Ge(.12,.2,.12,t.wood)},staff:{right:Nt.g,left:$e(),orb:Nt.orb},bow:{right:St,left:Dt.g,arrow:St,drawString:Dt.drawString}};for(const z of Object.keys(_t))q.add(_t[z].right),U.add(_t[z].left),_t[z].right.visible=!1,_t[z].left.visible=!1;function xt(z,j,mt){const Mt=new je;Mt.name="bladeBase",Mt.position.y=j,z.add(Mt);const te=new je;te.name="bladeTip",te.position.y=mt,z.add(te)}xt(_t["sword-shield"].right,.44,.55),xt(_t["dual-swords"].right,.44,.55),xt(_t["dual-swords"].left,.44,.55),xt(_t.greatsword.right,.74,.88),xt(_t.staff.right,.78,.92);let Rt=null,F=null,A=1,G=0,pt=0,Q=null,rt=0,Ft=0,tt=0,ut=0,Ut=0,at=0,bt=HT(),H={...Kh},ht=0,yt=0,Gt=0,Ot=-1,Lt=0,N=0,wt=0,st=0,dt=0,Et=0,Tt=0,Qt=1,re=0,de=0,ae=0,Te=!1,ge=0,gn=0,wn=0,Be=0,Re="none",qe=0,kn=1,nn=!1,W=-1,Pt=!1,kt=0,ee=0,Kt=0,oe={...xh},pe=0,P=0,Y={active:!1,dist:0,gy:0,pitch:0,joint:0,grip:1},et=NaN,nt=0,$=0,At=0,zt=NaN,Zt=NaN,jt=-1,Vt=null,$t=null,Wt=0,le=1,ve=.1,Ee=null,Fe={lx:0,ly:0,lz:0,rx:0,ry:0,rz:0},Bt=null,ft=null,ne=null,ce=null,Me=null,En=null,He="R",vn=0,Se=0,Ce=0,Un=0,hn=1,Ke=0,Tn=null,ci=0,td=0,qr=NaN,ed=NaN,Kr={speed:0,phase:0},Ls={lp:0,lr:0,rp:0,rr:0},Rm=0,Jr=0,Qr=!0,tc=0,Ds="none",Da=0,ka=0,Ia=0,bo=.3,nd=0;function Pm(z){const j=Math.PI/180,mt=s;let Mt=0,te=0,Jt=0,he=0;z==="sword-shield"?(Mt=mt.swordPitchDeg*j,Jt=mt.shieldPitchDeg*j):z==="dual-swords"?(Mt=mt.swordPitchDeg*j,Jt=mt.swordPitchDeg*j):z==="greatsword"?(Mt=mt.greatswordPitchDeg*j,Jt=mt.greatswordPitchDeg*j):z==="staff"?Mt=mt.staffPitchDeg*j:Jt=mt.bowPitchDeg*j,qt.rotation.set(Mt,0,te),Ct.rotation.set(Jt,0,he),qt.position.x=z==="greatsword"?-Math.max(0,s.twoHandInsetX??0):0}function id(z){if(z!==Rt){Rt=z;for(const j of Object.keys(_t))_t[j].right.visible=j===z,_t[j].left.visible=j===z;Pm(z),Dt.drawString.position.z=-.06,St.position.z=0,Nt.orb.scale.setScalar(1),w.rotation.y=0}}id("sword-shield");const ad=[];v.traverse(z=>{z instanceof _e&&z.material instanceof Pa&&ad.push(z.material)});const Cm=new ie(r.flashColor);function Lm(z,j){const mt=vm(z,j,r);bt=mt,w.rotation.x+=mt.upperPitch,w.rotation.z+=mt.upperRoll,w.rotation.y+=mt.upperYaw;const Mt=fe(Number.isFinite(r.upperShiftScale)?r.upperShiftScale:1,0,1),te=Number.isFinite(r.maxUpperShift)?Math.max(0,r.maxUpperShift):Number.POSITIVE_INFINITY;w.position.x+=fe(mt.upperShiftX*Mt,-te,te),w.position.z+=fe(mt.upperShiftZ*Mt,-te,te),x.position.x+=mt.comX,x.position.z+=mt.comZ-mt.pelvisBack,x.position.y-=mt.drop;const Jt=mt.legacy?0:fe(r.lowerScale,0,1);y.position.z+=mt.pelvisBack*(1-Jt),y.position.y+=mt.drop*(1-Jt),ct.joint.rotation.x+=mt.knee,Z.joint.rotation.x+=mt.knee,ct.root.rotation.x-=mt.hip,Z.root.rotation.x-=mt.hip,J.root.rotation.x+=mt.arm,lt.root.rotation.x+=mt.arm*.8;for(const he of ad)he.emissive.copy(Cm).multiplyScalar(mt.flash)}function So(z){return z<.22?-1:z<.42?-1+(z-.22)/.2*2:z<.5?1:Math.max(0,1-(z-.5)/.5)}function Dm(z){for(const j of[J,lt])j.upperMesh.scale.set(z.girthArm,z.arm,z.girthArm),j.upperMesh.position.y=-j.segLen/2*z.arm,j.joint.position.y=-j.segLen*z.arm,j.lowerMesh.scale.set(z.girthArm,z.arm,z.girthArm),j.lowerMesh.position.y=-j.segLen/2*z.arm,j.hand.position.y=-j.segLen*z.arm;for(const j of[ct,Z])j.upperMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),j.upperMesh.position.y=-j.segLen/2*z.leg,j.joint.position.y=-j.segLen*z.leg,j.lowerMesh.scale.set(z.girthLeg,z.leg,z.girthLeg),j.lowerMesh.position.y=-j.segLen/2*z.leg,j.tip.position.y=-j.segLen*z.leg;O.scale.set(z.girthTorso,z.torso,z.girthTorso),O.position.y=V/2*z.torso,B&&(B.scale.set(z.girthTorso,z.torso,z.girthTorso),B.position.y=ot/2*z.torso,L.position.y=V*z.torso)}function km(z,j){const mt=s.twoHandGripY??-.16,Mt=Math.max(1,s.twoHandMaxStretch??1.25),te=E*Mt*.99,Jt=J.root.position.x,he=J.root.position.y,be=J.root.position.z,ye=J.root.rotation.y,Xe=Math.cos(ye),dn=Math.sin(ye),Je=Bi=>{const Fa=qt.localToWorld(new X(0,Bi,0)),Rn=(C?L:w).worldToLocal(Fa),Ua=Rn.x-Jt,ic=Rn.y-he,To=Rn.z-be,Na={x:Ua*Xe-To*dn,y:ic,z:Ua*dn+To*Xe};return{t:Na,dist:Math.hypot(Na.x,Na.y,Na.z)}};let we=mt,ke=Je(we);if(!Number.isFinite(ke.dist)||ke.dist<=Li)return;for(let Bi=0;Bi<18&&ke.dist>te;Bi++)if(we*=.78,ke=Je(we),!Number.isFinite(ke.dist)||ke.dist<=Li)return;Number.isFinite(et)||(et=we);const rn=Math.max(0,s.twoHandSlideRate??9);et+=(we-et)*(1-Math.exp(-rn*j));const An=Je(et),en=An.t,Jn=An.dist,Nn=Jn/Math.max(Li,E),Qn=fe(Nn,1,Mt),li=Math.max(1,s.twoHandGripStart??1.02),Ni=Math.max(li+.001,Mt),Oi=fe(s.twoHandMinGrip??1,0,1),On=fe((Nn-li)/(Ni-li),0,1),hi=1-On*On*(3-2*On)*(1-Oi),Bn=E/2*Qn,za=_m(en,Bn,Bn,-1),wi=Mm({rootPitch:J.root.rotation.x,rootRoll:J.root.rotation.z,jointPitch:J.joint.rotation.x},za,fe(z*hi,0,1),Math.PI);J.root.rotation.x=wi.rootPitch,J.root.rotation.z=wi.rootRoll,J.joint.rotation.x=Math.min(wi.jointPitch,-.06);const ti=1/Math.sqrt(Qn);J.upperMesh.scale.set(ti,Qn,ti),J.upperMesh.position.y=-Bn/2,J.joint.position.y=-Bn,J.lowerMesh.scale.set(ti,Qn,ti),J.lowerMesh.position.y=-Bn/2,J.hand.position.y=-Bn,Y={active:!0,dist:Jn,gy:et,pitch:wi.rootPitch,joint:J.joint.rotation.x,grip:hi}}function Im(z,j){if(!m.enabled){nt=0,$=0,lt.wrist.rotation.set(0,0,0),zt=lt.root.rotation.x,Zt=ld();return}const mt=lt.root.rotation.x,Mt=ld();if(j!==jt){jt=j,zt=mt,Zt=Mt,lt.wrist.rotation.set(nt,0,$);return}if(!Number.isFinite(zt)||z<=1e-5){zt=mt,Zt=Mt,lt.wrist.rotation.set(nt,0,$);return}const te=(mt-zt)/z,Jt=Ye(Mt-Zt)/z;zt=mt,Zt=Mt;const he=Math.max(0,m.maxAngle),be=Math.max(0,m.maxTwist),ye=.15+.85*fe(Se,0,1),dn=-fe(At,0,1.4)*Math.max(0,m.runDrag),Je=fe(-te*m.lag*ye+dn,-he,he),we=fe(Jt*m.twistLag*ye,-be,be),ke=1-Math.exp(-Math.max(0,m.rate)*z);nt+=(Je-nt)*ke,$+=(we-$)*ke,lt.wrist.rotation.set(nt,0,$)}function zm(z){const j=Math.PI/180;return z==="greatsword"?s.greatswordPitchDeg*j:z==="staff"?s.staffPitchDeg*j:z==="bow"?s.bowPitchDeg*j:s.swordPitchDeg*j}function ec(z){const j=Math.PI/180;return z==="sword-shield"?s.shieldPitchDeg*j:z==="greatsword"?s.greatswordPitchDeg*j:z==="bow"?s.bowPitchDeg*j:s.swordPitchDeg*j}function Fm(z){const j=Math.PI/180;return z==="sword-shield"||z==="dual-swords"?(s.swordCantDeg??0)*j:z==="greatsword"?(s.greatswordCantDeg??0)*j:0}function Um(z,j){const mt=z.weapon;if(mt==="staff"||mt==="bow")return;const Mt=He==="R",te=Mt?lt:J,Jt=Mt?qt:Ct,he=Mt?J:lt,be=Mt?Ct:qt,ye=mt==="greatsword"&&Mt?at:0,Xe=mt==="greatsword"?s.greatswordYawDeg:s.swordYawDeg,dn=Math.PI/180,Je=-Xe*dn,we=Xe*dn,ke=(On,hi)=>{const Bn=Math.max(0,Math.PI/2-Math.abs(hi));return Math.sign(On)*Math.min(Math.abs(On),Bn)},rn=(Bt??zm(mt)+G)+ye,An=j+te.root.rotation.x+te.joint.rotation.x;Jt.rotation.set(Math.PI/2-rn-An,0,ke(Mt?Je:we,rn));const en=ft??(mt==="sword-shield"?null:ec(mt)+pt),Jn=j+he.root.rotation.x+he.joint.rotation.x;mt==="sword-shield"?be.rotation.x=en===null?ec(mt):ec(mt)-en-Jn:be.rotation.set(Math.PI/2-(en??0)-Jn,0,ke(Mt?we:Je,en??0));const Nn=Fm(mt),Qn=Me??0,li=En??0,Ni=ne??0,Oi=ce??0;Mt?(q.rotation.z=-Nn+Qn,q.rotation.y=Ni,U.rotation.z=Nn+li,U.rotation.y=Oi):(U.rotation.z=Nn+Qn,U.rotation.y=Ni,q.rotation.z=-Nn+li,q.rotation.y=Oi)}function sd(z){Bt=z.bladePitch,ft=z.bladePitchOff,ne=z.bladeTwist,ce=z.bladeTwistOff,Me=z.bladeYaw,En=z.bladeYawOff,He=z.lead,vn=z.rootYaw+z.spinYaw,v.rotation.y=vn,w.rotation.y+=z.yaw,w.rotation.x+=z.pitch,w.rotation.z+=z.roll,x.position.z+=z.pelvisZ,x.position.x+=z.pelvisX,z.armR&&(lt.root.rotation.x=z.armR.pitch,lt.root.rotation.y=z.armR.yaw,lt.root.rotation.z=z.armR.roll,lt.joint.rotation.x=z.armR.elbow),z.armL&&(J.root.rotation.x=z.armL.pitch,J.root.rotation.y=z.armL.yaw,J.root.rotation.z=z.armL.roll,J.joint.rotation.x=z.armL.elbow)}function od(z,j){const mt=Ee??So(z.attackProgress),Mt=iA(z.weapon,z.comboIndex,mt,p,z.attackProgress);if(z.comboIndex!==Wt){$t=Vt,le=0,Wt=z.comboIndex;const he=z.timings.windup+z.timings.active+z.timings.recovery,be=Math.max(p.segBlendMin??.03,he*.22);ve=rA($t,Mt,p,Mt.blend??null,be)}const te=Math.max(.008,ve);le=Math.min(1,le+j/te);const Jt=$t&&le<1?aA($t,Mt,Rf(le)):Mt;return Vt=Jt,Jt}function Nm(z,j){const mt=R/2+M/2,Mt=b-.04-I;if(!p.enabled){J.root.position.set(-mt,Mt,0),lt.root.position.set(mt,Mt,0),Fe={lx:-mt,ly:Mt,lz:0,rx:mt,ry:Mt,rz:0};return}const te=Math.max(0,p.shoulderLift),Jt=Math.max(0,p.shoulderPush),he=z&&j==="greatsword"?Math.max(0,p.shoulderIn):0,be=An=>te*fe((-An-.5)/1.45,0,1),ye=An=>Jt*fe((-An-.2)/1.9,0,1),Xe=-mt+he,dn=Mt+be(J.root.rotation.x),Je=ye(J.root.rotation.x),we=mt-he,ke=Mt+be(lt.root.rotation.x),rn=ye(lt.root.rotation.x);J.root.position.set(Xe,dn,Je),lt.root.position.set(we,ke,rn),Fe={lx:Xe,ly:dn,lz:Je,rx:we,ry:ke,rz:rn}}function Om(z){if(z.phase==="idle"||z.charging)return;const j=z.attackProgress,mt=So(j),Mt=Math.max(0,mt),te=z.comboIndex%2===0?1:-1,Jt=l.stride,he=Number.isFinite(Jt.stepReach)?Jt.stepReach:.17,be=Number.isFinite(Jt.stepSideReach)?Jt.stepSideReach:.14,ye=Number.isFinite(Jt.stepDipReach)?Jt.stepDipReach:.05,Xe=z.weapon==="greatsword"?fe(Number.isFinite(Jt.heavyScale)?Jt.heavyScale:1,0,1):1;x.position.z+=he*Mt*Xe,x.position.x+=te*be*Mt*Xe,x.position.y-=ye*Math.sin(Math.PI*j)*Xe}let rd=null;function Bm(){rd={upperX:w.rotation.x,upperY:w.rotation.y,upperZ:w.rotation.z,upperPX:w.position.x,upperPZ:w.position.z,pelvisX:x.position.x,pelvisY:x.position.y,pelvisZ:x.position.z,pelvisRX:x.rotation.x,pelvisRZ:x.rotation.z,lrx:J.root.rotation.x,lry:J.root.rotation.y,lrz:J.root.rotation.z,lj:J.joint.rotation.x,rrx:lt.root.rotation.x,rry:lt.root.rotation.y,rrz:lt.root.rotation.z,rj:lt.joint.rotation.x,rootY:v.rotation.y}}function Hm(z){const j=rd;if(!j)return;const mt=Rf(fe(z,0,1));if(mt>=1)return;const Mt=(te,Jt)=>te+(Jt-te)*mt;w.rotation.x=Mt(j.upperX,w.rotation.x),w.rotation.y=Mt(j.upperY,w.rotation.y),w.rotation.z=Mt(j.upperZ,w.rotation.z),w.position.x=Mt(j.upperPX,w.position.x),w.position.z=Mt(j.upperPZ,w.position.z),x.position.x=Mt(j.pelvisX,x.position.x),x.position.y=Mt(j.pelvisY,x.position.y),x.position.z=Mt(j.pelvisZ,x.position.z),x.rotation.x=Mt(j.pelvisRX,x.rotation.x),x.rotation.z=Mt(j.pelvisRZ,x.rotation.z),J.root.rotation.x=Mt(j.lrx,J.root.rotation.x),J.root.rotation.y=Mt(j.lry,J.root.rotation.y),J.root.rotation.z=Mt(j.lrz,J.root.rotation.z),J.joint.rotation.x=Mt(j.lj,J.joint.rotation.x),lt.root.rotation.x=Mt(j.rrx,lt.root.rotation.x),lt.root.rotation.y=Mt(j.rry,lt.root.rotation.y),lt.root.rotation.z=Mt(j.rrz,lt.root.rotation.z),lt.joint.rotation.x=Mt(j.rj,lt.joint.rotation.x),v.rotation.y=j.rootY+Ye(v.rotation.y-j.rootY)*mt,vn=v.rotation.y}let ks=null,nc=0,cd=0;function Gm(){if(!C)return;const z=k,j=Math.max(0,z.waist??1),mt=Math.max(0,z.chest??0),Mt=j+mt,te=Mt>1e-6?j/Mt:1,Jt=Mt>1e-6?mt/Mt:0,he=w.rotation.x,be=w.rotation.y,ye=w.rotation.z;w.rotation.set(he*te,be*te,ye*te),L.rotation.set(he*Jt,be*Jt,ye*Jt);const Xe=fe(z.neck??0,0,1);Xe>0&&(gt.rotation.x-=he*Xe),ks={x:he,y:be,z:ye}}function wo(){return{yaw:w.rotation.y+(C?L.rotation.y:0),pitch:w.rotation.x+(C?L.rotation.x:0),lean:w.rotation.z+(C?L.rotation.z:0)}}function ld(){return wo().yaw}function Xm(z,j){if(!(h!=null&&h.enabled)){Tn=null,ci=0;return}v.updateWorldMatrix(!0,!0);const mt=new X,Mt=[],te=(ti,Bi,Fa=0)=>{ti.getWorldPosition(mt),Mt.push({x:mt.x,y:mt.y+Fa,z:mt.z,mass:Bi})},Jt=n.headSize;te(gt,.08,Jt/2),te(O,.14),te(B??L,.24),te(x,.12),te(J.hand,.05),te(lt.hand,.05),te(ct.joint,.15),te(Z.joint,.15);const he=Rt?Eo(_t[Rt].right):null;he&&Mt.push({x:(he.base.x+he.tip.x)/2,y:(he.base.y+he.tip.y)/2,z:(he.base.z+he.tip.z)/2,mass:Rt==="greatsword"?.09:.04});const be=Math.max(.05,n.limbThickness*1.15/2+.015),ye=Math.max(.06,n.limbThickness*1.7/2+.02);let Xe=1/0,dn=-1/0,Je=1/0,we=-1/0,ke=0;for(const ti of[ct,Z])ti.tip.getWorldPosition(mt),mt.y<=.13&&(ke+=1),Xe=Math.min(Xe,mt.x-be),dn=Math.max(dn,mt.x+be),Je=Math.min(Je,mt.z-ye),we=Math.max(we,mt.z+ye);(!Number.isFinite(Xe)||ke===0)&&(Xe=dn=Je=we=0);let rn=0,An=0;Number.isFinite(qr)&&j>1e-5&&(rn=fe((z.position.x-qr)/j,-20,20),An=fe((z.position.z-ed)/j,-20,20)),qr=z.position.x,ed=z.position.z;const en=$T(Mt,{minX:Xe,maxX:dn,minZ:Je,maxZ:we},rn,An,h);if(Tn=en,!h.autoCounter){ci=0;return}const Jn=Math.cos(z.bodyYaw),Nn=-Math.sin(z.bodyYaw),Qn=en.xcomX-en.centerX,li=en.xcomZ-en.centerZ,Ni=Qn*Jn+li*Nn,Oi=rn*Jn+An*Nn,On=en.grounded?ZT(Ni,Oi,h.predLead??0):0;cd=On;const hi=Math.abs(On)-.45*en.halfX;td=hi;let Bn=0;hi>.002&&en.grounded&&(Bn=-Math.sign(On)*Math.min(Math.max(.005,h.maxShift??.045),(hi+.002)*1.1666666666666667));const za=Math.abs(On)/Math.max(1e-4,en.halfX),wi=Math.max(.1,jT(h.counterRate,za,h.counterBoost??0));ci+=(Bn-ci)*(1-Math.exp(-wi*j))}function Vm(z,j){if(Dt.drawString.position.z=-.06,St.position.z=0,Nt.orb.scale.setScalar(1),w.rotation.y=0,z.charging&&z.weapon==="bow"){const Jt=z.charge;J.root.rotation.x=-1.25,J.joint.rotation.x=-.15,lt.root.rotation.x=.35+Jt*.3,lt.joint.rotation.x=-1.15,Dt.drawString.position.z=-.06-Jt*.22,St.position.z=-Jt*.3,w.rotation.y=-.22;return}if(z.phase==="idle"&&Ce<=.001){$t=null,Vt=null,Wt=0,le=1,ve=Math.max(.008,p.segBlend),Bt=null,ft=null,ne=null,ce=null,Me=null,En=null,et=NaN,z.weapon==="greatsword"&&(qt.position.x=-Math.max(0,s.twoHandInsetX??0));return}const mt=So(z.attackProgress),Mt=Math.max(0,-mt),te=Math.max(0,mt);if(z.weapon==="bow")J.root.rotation.x=-1.2,J.joint.rotation.x=-.15,lt.root.rotation.x=.9-te*.8,lt.joint.rotation.x=-.3;else if(z.weapon==="greatsword")if(p.enabled)sd(od(z,j));else{const Jt=-1.6*Mt+1.25*te,he=fe(Number.isFinite(l.stride.heavyScale)?l.stride.heavyScale:1,0,1);lt.root.rotation.x=Jt,lt.joint.rotation.x=-(.25+Mt*.4),J.root.rotation.x=Jt+.06,J.joint.rotation.x=-(.32+Mt*.4),J.root.rotation.z=.42,lt.root.rotation.z=0;const be=-Math.sin(lt.root.rotation.x);lt.root.rotation.y=-.72*Math.tanh(be*4),w.rotation.y=-.2*mt*he}else if(p.enabled)sd(od(z,j));else{const Jt=z.comboIndex;if(Jt===1)lt.root.rotation.x=-1.7*Mt+1.1*te,lt.joint.rotation.x=-(.2+Mt*.5),J.root.rotation.x=.1,w.rotation.y=-.18*mt;else if(Jt===2)J.root.rotation.x=-1.5*Mt+1*te,J.joint.rotation.x=-(.2+Mt*.5),lt.root.rotation.x=.2,w.rotation.y=.45*-mt;else{const he=-1.9*Mt+1.2*te;J.root.rotation.x=he,lt.root.rotation.x=he,J.joint.rotation.x=-(.15+Mt*.4),lt.joint.rotation.x=-(.15+Mt*.4),w.rotation.y=-.3*mt}}if(z.weapon==="greatsword"){const Jt=fe((-lt.root.rotation.x-1.3)/1.2,0,1);qt.position.x=-Math.max(0,s.twoHandInsetX??0)*(1-Jt)}Om(z)}function Wm(z,j){z&&(lt.root.rotation.x=-1.05,lt.joint.rotation.x=-.35,J.root.rotation.x=-.45,J.joint.rotation.x=-.2,w.rotation.y=-.12,Nt.orb.scale.setScalar(1.25+.12*Math.sin(j*2)))}function Ym(z){if(!z||z.phase==="idle")return;const j=z.progress,mt=j<.3?-.35+j/.3*1.35:j<.7?1:Math.max(0,1-(j-.7)/.3),Mt=Math.PI/180;w.rotation.x+=_.leanDeg*Mt*mt,J.root.rotation.x-=_.shieldPitchDeg*Mt*mt,J.joint.rotation.x-=.22*mt,lt.root.rotation.x-=.3*mt,x.position.z+=_.pelvisReach*Math.max(0,mt)}function Eo(z){if(!z)return null;const j=z.getObjectByName("bladeBase"),mt=z.getObjectByName("bladeTip");if(!j||!mt)return null;z.updateWorldMatrix(!0,!1);const Mt=j.getWorldPosition(new X),te=mt.getWorldPosition(new X),Jt=new X().setFromMatrixColumn(z.matrixWorld,0).normalize();return{base:{x:Mt.x,y:Mt.y,z:Mt.z},tip:{x:te.x,y:te.y,z:te.z},normal:{x:Jt.x,y:Jt.y,z:Jt.z}}}return{group:v,update(z,j,mt,Mt,te=!1,Jt,he,be){var Md;id(j.weapon),v.rotation.y=0,vn=0,w.rotation.x=0,w.rotation.z=0,x.position.x=0,x.position.y=T,x.position.z=0,x.rotation.z=0,x.rotation.x=0,w.position.x=0,w.position.y=0,w.position.z=0,L.rotation.set(0,0,0),y.position.x=0,y.position.y=0,y.position.z=0,y.rotation.z=0;const ye=Math.max(1/240,Math.min(Mt,.1));Q=((Md=l.stance)==null?void 0:Md[j.weapon])??null,F!==j.weapon&&(F=j.weapon,A=Q?0:1);const Xe=Math.max(.01,(Q==null?void 0:Q.blend)??.22);A=Math.min(1,A+ye/Xe);const dn=Q?A:0;G=((Q==null?void 0:Q.bladePitchDeg)??0)*Math.PI/180*dn,pt=((Q==null?void 0:Q.bladePitchOffDeg)??0)*Math.PI/180*dn;const Je=Jt===void 0?Rm+=Mt:Jt;Jr=Je;const we=l.landing;we.enabled?Qr&&!z.grounded?(Ds="jump",Da=Je,ka=we.anticipationDuration,Ia=Math.max(0,we.jumpAnticipation),bo=.32):!Qr&&z.grounded&&(Ds="land",Da=Je,ka=we.duration,Ia=BT(tc,we),bo=we.compressRatio,nd=tc):(Ds="none",Ia=0),Je<Da&&(Ds="none",Ia=0),Qr=z.grounded,tc=z.velocity.y;const ke=Ef(Je,Da,ka,Ia,bo),rn=j.phase!=="idle",An=(be==null?void 0:be.phase)==="active";Se=FT(Se,rn,ye,l.attack.blendRate);const en=UT(Se,l.attack.gaitWeight,l.attack.lowerBodyWeight);Un=en.attackLegWeight,hn=en.gaitScale;const Jn=Math.sin(z.bodyYaw),Nn=Math.cos(z.bodyYaw),Qn=(z.velocity.x-rt)/ye,li=(z.velocity.z-Ft)/ye,Ni=fe(Qn,-60,60),Oi=fe(li,-60,60),On=Ni*Jn+Oi*Nn,hi=Ye(z.bodyYaw-tt)/ye,Bn=Math.hypot(z.velocity.x,z.velocity.z),za=o.maxForwardDeg*Math.PI/180,wi=o.maxSideDeg*Math.PI/180,ti=fe(On*o.accelGain,-za,za),Bi=fe(-hi*Bn*o.turnGain,-wi,wi),Fa=1-Math.exp(-o.smoothing*ye);ut+=(ti-ut)*Fa,Ut+=(Bi-Ut)*Fa,rt=z.velocity.x,Ft=z.velocity.z,tt=z.bodyYaw;const Rn=Math.hypot(z.velocity.x,z.velocity.z),Ua=fe(a.knockGaitScale??0,0,1),ic=mt.knockX*Ua,To=mt.knockZ*Ua,Na=Ua>0&&Math.hypot(mt.knockX,mt.knockZ)>.001,ac=z.velocity.x+ic,sc=z.velocity.z+To,hd=Math.hypot(ac,sc);Be=hd;const $m=Math.cos(z.bodyYaw),Zm=-Math.sin(z.bodyYaw),jm=z.velocity.x*$m+z.velocity.z*Zm,dd=Rn>Li?fe(jm/Rn,-1,1):0,ud=Rn>Li?fe((z.velocity.x*Jn+z.velocity.z*Nn)/Rn,-1,1):1,qm=qh(ud,a.backStrafeStartDeg,a.backStrafeFullDeg);Re==="settled"&&Pt&&kt>ee*1.02+1e-4&&(Re="none");let Is=1;Re==="blend"?(Is=pm(nn?W:qe,a.stopYawBlendMode,nn),nn||(qe=Math.min(1,qe+ye/Math.max(.01,a.stopYawAfterSec)),(qe>=1||a.stopYawBlendMode==="inStop"||Pt)&&(Re="settled",Is=0))):Re==="settled"&&(Is=fe(Rn/Math.max(Li,a.stopEnterRatio*e),0,1)),kn=Is;const Km=lm(dd,i.legYawScale,i.hipYawMaxDeg,a.strafeHipBoost),Jm=hm(ud,dd,Km,qm)*Is;yt+=(Jm-yt)*(1-Math.exp(-i.hipYawSmoothing*ye));const zs=z.bodyYaw+yt;Gt=zs;const Qm=Math.sin(zs),t0=Math.cos(zs),e0=Math.cos(zs),n0=-Math.sin(zs),di={speed:hd,phase:z.gaitPhase,localForward:ac*Qm+sc*t0,localRight:ac*e0+sc*n0,stride:z.stride};rn&&!Te&&(ae=z.gaitPhase),Te=rn;const Oa=Se>0?IT(di,j.attackProgress,j.comboIndex,Se,l.stride,ae):di;Kr=Oa;const fd=Math.max(0,a.stopBlendSec||0),pd=fd>0&&!rn&&!Na&&z.grounded,oc=dm(Rn,re,e,a.stopEnterRatio,a.stopExitRatio);if(!pd||oc.resume)Ot=-1;else if(Ot<0&&oc.enter){Ot=0,Lt=z.gaitPhase,N=rm(z.gaitPhase),wt=Rn,st=Math.max(z.stride,Li),dt=di.localForward,Et=di.localRight;const se=1/Math.max(Li,Rn);Tt=z.velocity.x*se,Qt=z.velocity.z*se}const i0=re;re=Rn;const ui=pd&&Ot>=0;ui&&(Ot=Math.min(1,Ot+ye/fd)),ui&&Re!=="blend"&&(Re="blend",qe=0),nn=ui&&Ot<1,W=Ot,Pt=oc.resume,kt=Rn,ee=i0;const md=ui?{phase:Lt,speed:wt,moveSpeed:e,localForward:dt,localRight:Et,legLength:n.legLength,stride:st,grounded:!0}:{phase:Oa.phase,speed:Oa.speed,moveSpeed:e,localForward:Oa.localForward,localRight:Oa.localRight,legLength:n.legLength,stride:Oa.stride??0,grounded:z.grounded};let rc=ui?cm(md,a,{progress:Ot,phase0:Lt,phaseEnd:N}):Nr(md,a);const sa=l.attack.moveTakeover;if(sa&&!ui){const se=j.phase==="windup"?sa.windup:j.phase==="recovery"?sa.recovery:j.phase==="settle"?sa.settle:0,ue=Math.max(.05,sa.full-sa.speed),yn=fe((di.speed-sa.speed)/ue,0,1),Pn=fe(se,0,1)*yn,Ao=Pn>Ke?10:6;Ke=fe(Ke+(Pn-Ke)*(1-Math.exp(-Ao*ye)),0,1)}else ui?Ke=0:Ke=fe(Ke*Math.exp(-8*ye),0,1);if(Ke>.001&&!ui){const se=Nr({phase:di.phase,speed:di.speed,moveSpeed:e,localForward:di.localForward,localRight:di.localRight,legLength:n.legLength,stride:di.stride??0,grounded:z.grounded},a);rc=NT(rc,se,Ke)}const Ie=OT(rc,en.gaitScale);if(Kt=0,An&&be){const se=LT(be.progress,be.dir,a),ue=en.gaitScale;Ie.legL.pitchX+=se.legL.pitchX*ue,Ie.legL.rollZ+=se.legL.rollZ*ue,Ie.legL.kneeX+=se.legL.kneeX*ue,Ie.legR.pitchX+=se.legR.pitchX*ue,Ie.legR.rollZ+=se.legR.rollZ*ue,Ie.legR.kneeX+=se.legR.kneeX*ue,Ie.pelvisY+=se.pelvisY*ue,Kt=se.env}let cc=0,lc=0,hc=0,gd=0;if(ui){const se=fm(z.bodyYaw,Tt,Qt),ue=mm(Ot,Lt,se.forward,se.right,a);ue.leadLeft?(Ie.legL.pitchX-=ue.leadPitch,Ie.legL.kneeX+=ue.leadKnee,Ie.legR.pitchX+=ue.trailPitch):(Ie.legR.pitchX-=ue.leadPitch,Ie.legR.kneeX+=ue.leadKnee,Ie.legL.pitchX+=ue.trailPitch),lc=ue.bodyShift*ue.fwdN,cc=ue.bodyShift*ue.rightN,hc=ue.bodyDip,gd=ue.chestPitch,ge=ue.leadPitch,gn=ue.bodyShift,wn=ue.bodyDip}else ge=0,gn=0,wn=0;if(Ls={lp:Ie.legL.pitchX,lr:Ie.legL.rollZ,rp:Ie.legR.pitchX,rr:Ie.legR.rollZ},!z.grounded)ct.root.rotation.x=-.55,Z.root.rotation.x=-.25,ct.joint.rotation.x=.75,Z.joint.rotation.x=.55,J.root.rotation.x=-.9,lt.root.rotation.x=-.7,J.joint.rotation.x=-.6,lt.joint.rotation.x=-.6,ct.root.rotation.z=0,Z.root.rotation.z=0;else{ct.root.rotation.x=Ie.legL.pitchX,Z.root.rotation.x=Ie.legR.pitchX,ct.root.rotation.z=Ie.legL.rollZ,Z.root.rotation.z=Ie.legR.rollZ,ct.joint.rotation.x=Ie.legL.kneeX,Z.joint.rotation.x=Ie.legR.kneeX;const se=Q?A:0,ue=1+(((Q==null?void 0:Q.armSwing)??1)-1)*se,yn=Q==null?void 0:Q.armR,Pn=Q==null?void 0:Q.armL,Ao=Ie.armL*ue+((Pn==null?void 0:Pn.pitch)??0)*se,bd=Ie.armR*ue+((yn==null?void 0:yn.pitch)??0)*se;J.root.rotation.x=Ao,lt.root.rotation.x=bd,J.joint.rotation.x=-(.18+Ao*.2)+((Pn==null?void 0:Pn.elbow)??0)*se,lt.joint.rotation.x=-(.18+bd*.2)+((yn==null?void 0:yn.elbow)??0)*se,J.root.rotation.z=((Pn==null?void 0:Pn.roll)??0)*se,lt.root.rotation.z=((yn==null?void 0:yn.roll)??0)*se,J.root.rotation.y=((Pn==null?void 0:Pn.yaw)??0)*se,lt.root.rotation.y=((yn==null?void 0:yn.yaw)??0)*se,x.position.x=Ie.pelvisX,x.position.y=T+Ie.pelvisY,x.position.z=0,x.rotation.z=Ie.pelvisRoll}const a0=bm(x,y),Fs=An?{...f,weight:0}:ui&&f.enabled?{...f,weight:1}:f,xd=Fs.enabled&&z.grounded&&Fs.weight>0?fe(Fs.weight,0,1)*(rn?fe(Fs.attackScale,0,1):1):0;x.position.x+=cc,x.position.z+=lc,x.position.y-=hc,y.position.y+=hc,xd<=0&&(y.position.x-=cc,y.position.z-=lc);const dc=Rn/Math.max(e,Li);At=dc;const s0=Number.isFinite(o.crouchSmoothing)?o.crouchSmoothing:8,o0=1-Math.exp(-Math.max(0,s0)*ye);ht+=(fe(dc,0,1)-ht)*o0;const Ba=ym({leanForward:ut,leanSide:Ut,speedRatio:ht},o);x.rotation.x+=Ba.pelvisPitch,x.rotation.z+=Ba.pelvisRoll,x.position.x+=Ba.pelvisX,x.position.z+=Ba.pelvisZ,x.position.y-=Ba.crouch,y.position.y+=Ba.crouch*(1-fe(xd,0,1));const vd=j.phase!=="idle"||j.charging&&j.weapon==="bow",uc=vd?1:0,r0=Math.max(.001,uc>Ce?p.poseIn??.1:p.poseOut??.16);if(Ce!==uc){const se=ye/r0;Ce=fe(Ce+(uc>Ce?se:-se),0,1)}if((Ce>0||vd)&&Bm(),Vm(j,ye),Ce>0&&Ce<1&&Hm(Ce),Q){const se=(1-Ce)*A;w.rotation.y+=(Q.torsoYaw??0)*se,w.rotation.x+=(Q.torsoPitch??0)*se}Wm(te,z.gaitPhase),Ym(he);const c0=j.weapon==="greatsword",yd=Math.hypot(z.velocity.x,z.velocity.z),l0=c0&&j.phase==="idle"&&yd>.5?Math.min(1.15,yd/Math.max(e,.001)*.9):0;at+=(l0-at)*(1-Math.exp(-6*ye));const h0=w.rotation.x;j.weapon==="bow"&&(Dt.g.rotation.x=-(J.root.rotation.x+J.joint.rotation.x),St.rotation.x=-(lt.root.rotation.x+lt.joint.rotation.x));const d0=w.rotation.y;Lm(mt,z.bodyYaw);const _d=mt.type==="none"?1:.4;if(w.rotation.x+=ut*_d+gd,w.rotation.z+=(Ut+Ie.sideLean)*_d,ke>0&&(ct.root.rotation.x-=we.hipPitch*ke,Z.root.rotation.x-=we.hipPitch*ke,ct.joint.rotation.x+=we.kneeBend*ke,Z.joint.rotation.x+=we.kneeBend*ke,x.position.y-=we.crouchDepth*ke,y.position.y+=we.crouchDepth*(1-we.lowerScale)*ke,w.rotation.x+=we.upperPitch*ke,J.root.rotation.x-=we.armTuck*ke,lt.root.rotation.x-=we.armTuck*ke),Un>0&&z.grounded){const se=zT(j.attackProgress,j.comboIndex,l.stride),ue=Un;ct.root.rotation.x+=se.legL.pitchX*ue,Z.root.rotation.x+=se.legR.pitchX*ue,ct.root.rotation.z+=se.legL.rollZ*ue,Z.root.rotation.z+=se.legR.rollZ*ue,ct.joint.rotation.x+=se.legL.kneeX*ue,Z.joint.rotation.x+=se.legR.kneeX*ue,x.position.x+=se.pelvisX*ue,x.position.y+=se.pelvisY*ue,x.rotation.z+=se.pelvisRoll*ue}if(Nm(rn,j.weapon),h!=null&&h.enabled&&h.autoCounter&&Math.abs(ci)>1e-4&&(x.position.x+=ci),g.enabled){const se=j.phase!=="idle"&&!j.charging,ue=se?So(j.attackProgress):0;se&&P>.55&&ue<P-1e-4&&(pe=1),P=ue,pe=QT(pe,ye,g.impactDecay);const yn=KT({swing:ue,charge:j.charging?j.charge:0,impact:pe,speedRatio:dc,grounded:z.grounded},g);oe=JT(oe,yn,ye,g.smoothing)}else oe={...xh};Dm(oe),y.rotation.y=yt,de=um(yt,a.chestYawScale,a.chestYawMaxDeg),w.rotation.y+=de;const u0=d0;if(gt.rotation.y=Ye(z.headYaw-z.bodyYaw-u0-de),gt.rotation.x=-fe(z.headPitch??0,-.7,.7),w.rotation.x+=-fe(z.bodyPitch??0,-.4,.4),Gm(),Im(Mt,j.comboIndex),Um(j,h0),j.weapon==="greatsword"&&!j.charging&&(j.phase!=="idle"||Ce>0)){v.updateWorldMatrix(!0,!0);const se=j.phase==="idle"?Math.max(Ce,Se):1;km(fe(se,0,1),ye)}if(H=Sm({root:v,pelvis:x,lower:y,limbs:Ht,base:a0,cfg:Fs,grounded:z.grounded,attacking:rn}),Xm(z,ye),C&&ks){const se=wo();nc=Math.max(Math.abs(se.pitch-ks.x),Math.abs(se.yaw-ks.y),Math.abs(se.lean-ks.z))}else nc=0},lean(){return{forward:ut,side:Ut}},landing(){const z=Ef(Jr,Da,ka,Ia,bo),j=ka>0?Math.max(0,ka-Math.max(0,Jr-Da)):0;return{pulse:z,remaining:j,kind:z>0?Ds:"none",impactVy:nd}},hurt(){return bt},ik(){return H},stretch(){return{...oe,impact:pe}},gripDebug(){return{...Y}},weaponDebug(){return{wristPitch:nt,wristTwist:$}},setClipT(z){Ee=z===null||!Number.isFinite(z)?null:Math.max(0,Math.min(1,z))},stanceDebug(){const z=Q==null?void 0:Q.armR,j=Q==null?void 0:Q.armL,mt=Q?A:0;return{weapon:Rt??"sword-shield",weight:mt,armL:{pitch:((j==null?void 0:j.pitch)??0)*mt,yaw:((j==null?void 0:j.yaw)??0)*mt,roll:((j==null?void 0:j.roll)??0)*mt,elbow:((j==null?void 0:j.elbow)??0)*mt},armR:{pitch:((z==null?void 0:z.pitch)??0)*mt,yaw:((z==null?void 0:z.yaw)??0)*mt,roll:((z==null?void 0:z.roll)??0)*mt,elbow:((z==null?void 0:z.elbow)??0)*mt},torsoYaw:((Q==null?void 0:Q.torsoYaw)??0)*mt,torsoPitch:((Q==null?void 0:Q.torsoPitch)??0)*mt,bladePitchDeg:G*180/Math.PI,bladePitchOffDeg:pt*180/Math.PI,armSwing:(Q==null?void 0:Q.armSwing)??1}},swingDebug(){const z=Vt;return{seg:Wt,kind:(z==null?void 0:z.kind)??"right-left",lead:(z==null?void 0:z.lead)??"R",yaw:(z==null?void 0:z.yaw)??0,rootYaw:(z==null?void 0:z.rootYaw)??0,spinYaw:(z==null?void 0:z.spinYaw)??0,rootTurn:vn,pitch:(z==null?void 0:z.pitch)??0,roll:(z==null?void 0:z.roll)??0,strike:(z==null?void 0:z.strike)??0,bladeTwist:(z==null?void 0:z.bladeTwist)??0,bladeTwistOff:(z==null?void 0:z.bladeTwistOff)??0,bladeYaw:(z==null?void 0:z.bladeYaw)??0,bladeYawOff:(z==null?void 0:z.bladeYawOff)??0,shoulderL:{x:Fe.lx,y:Fe.ly,z:Fe.lz},shoulderR:{x:Fe.rx,y:Fe.ry,z:Fe.rz}}},attackBlend(){return Se},attackWeights(){return{gaitScale:hn,attackLegWeight:Un,driveSpeed:Kr.speed,stridePhase:Kr.phase}},hipYaw(){return yt},torsoTotal(){return wo()},spineDebug(){if(!C)return null;const z=wo();return{enabled:!0,waistYaw:w.rotation.y,chestYaw:L.rotation.y,totalYaw:z.yaw,totalPitch:z.pitch,totalLean:z.lean,neckPitch:gt.rotation.x,leak:nc}},balanceDebug(){return Tn?{...Tn,shift:ci,latDeficit:td,lateralFf:cd}:null},gaitDebug(){return{stopT:Ot,hipYaw:yt,chestYaw:de,speed:re,gaitSpeed:Be,stopStep:ge,stopShift:gn,stopDip:wn,stopYawFade:kn,turnStep:Kt,legTakeover:Ke,legLPitch:Ls.lp,legLRoll:Ls.lr,legRPitch:Ls.rp,legRRoll:Ls.rr}},gaitYaw(){return Gt},arrowDirection(){St.updateWorldMatrix(!0,!1);const z=St.matrixWorld.elements,j=z[8],mt=z[9],Mt=z[10],te=Math.hypot(j,mt,Mt)||1;return{x:j/te,y:mt/te,z:Mt/te}},weaponBlade(){return Rt?Eo(_t[Rt].right):null},bladesWorld(){return Rt?{right:Eo(_t[Rt].right),left:Eo(_t[Rt].left)}:{right:null,left:null}},dispose(){v.traverse(z=>{if(z instanceof _e){z.geometry.dispose();const j=z.material;Array.isArray(j)?j.forEach(mt=>mt.dispose()):j.dispose()}})}}}function fA(n){const t=wm(n.voxel,n.colors,n.moveSpeed,n.orientation,n.gait,n.mount,n.lean,n.hurt,n.animation,n.ik,n.links,n.wrist,n.balance),e=new Le;e.add(t.group);const i={position:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},facing:0,moveYaw:0,bodyYaw:0,headYaw:0,headPitch:0,bodyPitch:0,grounded:!0,sprinting:!1,gaitPhase:0,stride:1,distance:0,coyoteTime:0,jumpBuffer:0},a=[];for(const s of["headPivot","chest","torsoUpper","torso","pelvis"]){const o=t.group.getObjectByName(s);o&&a.push(o)}return{group:e,update(s,o,r){i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.velocity.x=s.velocity.x,i.velocity.y=s.velocity.y,i.velocity.z=s.velocity.z,i.facing=s.facing,i.moveYaw=Math.atan2(i.velocity.x,i.velocity.z),i.bodyYaw=s.bodyYaw,i.headYaw=s.headYaw,i.gaitPhase=s.gaitPhase,i.stride=s.stride,i.distance=s.distance,i.grounded=!0,i.sprinting=!1,e.position.set(s.position.x,s.position.y,s.position.z),e.rotation.y=s.bodyYaw,s.combat&&t.update(i,s.combat,s.hurt,o,!1,r,s.link)},debug(){return t.gaitDebug()},boneAtWorld(s,o,r){if(a.length===0)return null;const l=new X(s,o,r),c=new X;let d=null,u=Number.POSITIVE_INFINITY;for(const h of a){h.updateWorldMatrix(!0,!1),h.getWorldPosition(c);const f=c.distanceToSquared(l);f<u&&(u=f,d=h)}return d?{node:d,point:l}:null},dispose(){t.dispose()}}}const ma=.012,ga=.016;function pA(n,t){const e=t.lab,i=new Le;i.name="test-lab";const a=[],s=[],o=[],r=[];function l(v){return o.push(v),v}function c(v){return r.push(v),v}function d(v,x,y,w=ma){const S=l(new pn({color:x,transparent:!0,opacity:y,depthWrite:!1,side:Qe,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),T=new _e(v,S);return T.rotation.x=-Math.PI/2,T.position.y=w,T.renderOrder=2,T}function u(v,x){return c(new xs(Math.max(v,.001),x,72))}function h(v,x,y,w=ga){const T=document.createElement("canvas"),E=T.getContext("2d");if(!E)return new _e;const M='700 96px "Noto Sans SC", ui-monospace, Menlo, monospace';E.font=M,T.width=du.ceilPowerOfTwo(Math.ceil(E.measureText(v).width)+32),T.height=du.ceilPowerOfTwo(96*1.4);const b=T.getContext("2d");if(!b)return new _e;b.font=M,b.textAlign="center",b.textBaseline="middle",b.fillStyle=y,b.fillText(v,T.width/2,T.height/2);const R=new fh(T);R.colorSpace=Dn,s.push(R);const k=T.width/T.height,C=c(new jn(x*k,x)),I=l(new pn({map:R,transparent:!0,depthWrite:!1,side:Qe,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3})),L=new _e(C,I);return L.rotation.x=-Math.PI/2,L.position.y=w,L.renderOrder=3,L}function f(v,x,y,w,S,T){const E=y-x,M=c(new jn(E,w)),b=d(M,S,T,ma);b.position.set(E/2+x,ma,0);const R=new Le;return R.add(b),R.rotation.y=v-Math.PI/2,R}function m(v,x,y,w,S){const T=new tm;T.moveTo(0,x*.5),T.lineTo(-y*.5,x*.5-y*.9),T.lineTo(-y*.18,x*.5-y*.9),T.lineTo(-y*.18,-x*.5),T.lineTo(y*.18,-x*.5),T.lineTo(y*.18,x*.5-y*.9),T.lineTo(y*.5,x*.5-y*.9),T.closePath();const E=c(new jh(T)),M=d(E,w,S,ma+.002),b=new Le;return b.add(M),b.rotation.y=v+Math.PI,b}function _(v){var E;const x=new Le,y=h(`${v.index} · ${v.name}`,t.lab.labelTextHeight,"#eaf4ff"),S=((E=y.geometry.parameters)==null?void 0:E.width)??3;x.add(y);const T=d(c(new jn(S*.98,.08)),v.color,.7,ga);return T.position.set(0,ga,t.lab.labelTextHeight*.66),x.add(T),x.position.set(v.labelX,0,v.labelZ),x}const g=new Le;for(const v of n??[]){const x=new Le;if(x.position.set(v.x,0,v.z),v.shape==="square"){const y=v.radius,w=d(c(new jn(y*2,y*2)),v.color,e.padOpacity*.09);x.add(w);const S=.07,T=[[0,y,y*2+S,S],[0,-y,y*2+S,S],[-y,0,S,y*2+S],[y,0,S,y*2+S]];for(const[E,M,b,R]of T){const k=d(c(new jn(b,R)),v.color,e.padOpacity);k.position.x=E,k.position.z=M,x.add(k)}}else x.add(d(c(new Wh(v.radius,72)),v.color,e.padOpacity*.075)),x.add(d(u(v.radius-.075,v.radius),v.color,e.padOpacity));if(v.id==="hub"){for(let y=0;y<4;y++){const w=y*Math.PI/4,S=y%2===0;for(const T of[0,Math.PI])x.add(f(w+T,v.radius*.12,v.radius*.94,S?.09:.055,v.color,S?.5:.32))}x.add(d(u(.5,.56),v.color,.4))}else if(v.id==="dash"){const y=v.spawnZ-v.z,w=-v.radius+.5,S=y-w,T=d(c(new jn(.06,S)),v.color,.36);T.position.set(0,ma,(y+w)/2),x.add(T);let E=0;for(let b=y;b>=w-.01;b-=1,E++){const R=E%5===0,k=d(c(new jn(R?2.4:1.3,R?.1:.07)),v.color,R?.72:.42);k.position.set(0,ma,b),x.add(k);const C=h(String(E),.52,R?"#eaf4ff":"rgba(200,225,245,0.8)");C.position.set(1.6,ga,b),x.add(C)}const M=[[3.2,"翻滚 3.2"],[5,"闪现 5.0"]];for(const[b,R]of M){const k=y-b,C=d(c(new jn(1.9,.09)),"#ffffff",.5);C.position.set(-1.5,ma,k),x.add(C);const I=h(R,.42,"rgba(220, 236, 250, 0.86)");I.position.set(-3,ga,k),x.add(I)}}else if(v.id==="gait"){x.add(d(u(1.44,1.5),v.color,.5)),x.add(d(u(1.14,1.2),v.color,.22));const y=1.55,w=[[0,"180° 正后退","#ff9a8a"],[Math.PI/4,"135° 斜后","#ffd166"],[Math.PI/2,"90° 正侧移","#8fe7ff"]];for(const[S,T,E]of w){const b=Math.sin(S),R=Math.cos(S),k=m(S,1.7,.34,E,.75);k.position.set(b*1.7*.5,0,y+R*1.7*.5),x.add(k);const C=h(T,.44,E);C.position.set(b*(1.7+.7),ga,y+R*(1.7+.7)),x.add(C)}}if(g.add(x),e.showLabels){const y=_(v);a.push(y),g.add(y)}}i.add(g);const p=n==null?void 0:n.find(v=>v.id==="hub");if(p&&e.showLabels){const v=[[0,-1,"屏上"],[0,1,"屏下"],[-1,0,"屏左"],[1,0,"屏右"]];for(const[x,y,w]of v){const S=h(w,.4,"rgba(190, 224, 248, 0.8)");S.position.set(p.x+x*(p.radius+.7),ga,p.z+y*(p.radius+.7)),i.add(S),a.push(S)}}return i.visible=e.enabled,{group:i,setVisible(v){i.visible=v},setLabelsVisible(v){for(const x of a)x.visible=v},dispose(){for(const v of r)v.dispose();for(const v of o)v.dispose();for(const v of s)v.dispose();i.clear()}}}const Ve={grass:8,groundArea:12,ringHalo:20,ring:22,ringMeter:24,ringWarn:26,groundFx:30,trail:40,slash:44,projectileTrail:46,projectile:48,projectileGlow:50};function ol(n,t){n.renderOrder=t,n.traverse(e=>{e.renderOrder=t})}function rl(n,t,e){const i=Array.from({length:t.count},()=>{const a=new pn({color:t.color,transparent:!0,opacity:0,side:Qe,depthWrite:!1,...t.blending?{blending:t.blending}:{}}),s=new _e(t.geometry,a);return s.rotation.x=-Math.PI/2,s.renderOrder=t.renderOrder,s.visible=!1,n.add(s),{mesh:s,mat:a,life:0,base:1,delay:0}});return{entries:i,spawn(a,s,o,r,l){const c=i.find(d=>d.life<=0)??i[0];l!=null&&l.color&&c.mat.color.set(l.color),c.mesh.position.set(a,e(a,s,o)+t.yOffset,s),c.base=r,c.mesh.scale.setScalar(r*t.scaleFrom),c.mesh.visible=!0,c.mat.opacity=t.spawnOpacity,c.life=t.duration,c.delay=(l==null?void 0:l.delay)??0},update(a){for(const s of i){if(s.life<=0)continue;if(s.delay>0){s.delay-=a;continue}s.life-=a;const o=Math.max(0,s.life/Math.max(t.duration,1e-6));s.mesh.scale.setScalar(s.base*(t.scaleFrom+t.scaleSpan*(1-Math.pow(o,t.growPow)))),s.mat.opacity=t.peak*Math.pow(o,t.fadePow),s.life<=0&&(s.mesh.visible=!1)}},live(){return i.filter(a=>a.life>0)},dispose(){for(const a of i)a.mat.dispose()}}}function mA(n,t,e,i){const a=t.dash,s={count:6,geometry:new xs(a.ringRadius-.06,a.ringRadius,28),color:"#ffffff",renderOrder:Ve.groundFx,duration:a.fxDuration,peak:.9,fadePow:1,scaleFrom:.6,scaleSpan:1.2,growPow:1,yOffset:.04,spawnOpacity:.9},o=rl(n,s,i),r=t.links,l={count:5,geometry:new xs(r.ringRadius-.07,r.ringRadius,28),color:r.chargeColor,renderOrder:Ve.groundFx,duration:r.fxDuration,peak:.85,fadePow:1,scaleFrom:.55,scaleSpan:1.1,growPow:1,yOffset:.05,spawnOpacity:.85},c=rl(n,l,i),d=t.groundSlam,u={count:4,geometry:new xs(.78,1,56),color:d.color,blending:ki,renderOrder:Ve.groundFx+1,duration:d.duration,peak:.85,fadePow:1.3,scaleFrom:.35,scaleSpan:.65,growPow:1.8,yOffset:.035,spawnOpacity:0},h=rl(n,u,i);let f=e.dash.id,m="none",_=e.playerLink.id,g=e.playerLink.hitIds.length,p=e.combat.slamAttackId,v=0;return{update(x,y,w){var E;const S=x.character;if(x.dash.id!==f){f=x.dash.id;const M=x.dash;m=M.kind,M.kind==="blink"?(o.spawn(M.fromX,M.fromZ,S.position.y,.9,{color:a.blinkColor}),o.spawn(M.toX,M.toZ,S.position.y,1.35,{color:a.blinkColor})):o.spawn(M.fromX,M.fromZ,S.position.y,1.1,{color:a.rollColor})}if(o.update(y),x.combat.slamAttackId!==p&&(p=x.combat.slamAttackId,v+=1,d.enabled)){const M=(E=x.config.combat.weapons[x.combat.weapon])==null?void 0:E.groundSlam,b=Math.max(.6,(M==null?void 0:M.radius)??2.2);h.spawn(S.position.x,S.position.z,S.position.y,b,{delay:0}),h.spawn(S.position.x,S.position.z,S.position.y,b*d.outerScale,{delay:d.delay}),w(d.shake)}h.update(y);const T=x.playerLink;T.id!==_&&(_=T.id,g=T.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1)),T.hitIds.length>g?(g=T.hitIds.length,c.spawn(S.position.x,S.position.z,S.position.y,1.35)):T.hitIds.length<g&&(g=T.hitIds.length),c.update(y)},slamDebug(){return{spawns:v,lastId:p,live:h.live().map(x=>({life:x.life,scale:x.mesh.scale.x,opacity:x.mat.opacity,visible:x.mesh.visible}))}},groundOrder(){var x;return((x=h.entries[0])==null?void 0:x.mesh.renderOrder)??Ve.groundFx+1},activeDash(){return o.live().length},dashKind(){return m},dispose(){o.dispose(),c.dispose(),h.dispose();for(const x of[s.geometry,l.geometry,u.geometry])x.dispose()}}}const Jh=64,Em=[0,.24,.76,1],gA=[0,1,1,0],Tm=[0,.12,.28,.5,.72,.88,1],xA=[0,.16,.5,1,.5,.16,0];function Pf(n,t){if(t<=1e-6)return 1;const e=Math.min(1,Math.max(0,n/t));return e*e*(3-2*e)}function Qh(n,t,e,i,a=Jh,s="band"){const o=Math.max(.001,n-t*.5),r=Math.max(o+.001,n+t*.5),l=s==="glow"?Tm:Em,c=s==="glow"?xA:gA,d=l.length,u=a+1,h=new Float32Array(u*d*3),f=new Float32Array(u*d*4),m=[];for(let g=0;g<u;g++){const p=g/a,v=(p-.5)*e,x=Pf(p,i)*Pf(1-p,i),y=Math.sin(v),w=Math.cos(v);for(let S=0;S<d;S++){const T=o+(r-o)*l[S],E=g*d+S;h[E*3]=y*T,h[E*3+1]=0,h[E*3+2]=w*T;const M=x*c[S];f[E*4]=1,f[E*4+1]=1,f[E*4+2]=1,f[E*4+3]=M}}for(let g=0;g<a;g++)for(let p=0;p<d-1;p++){const v=g*d+p,x=v+d;m.push(v,x,v+1,v+1,x,x+1)}const _=new on;return _.setAttribute("position",new mn(h,3)),_.setAttribute("color",new mn(f,4)),_.setIndex(m),_.computeBoundingSphere(),_}function cl(n){const t=new pn({color:n.color,transparent:!0,opacity:n.opacity,depthWrite:!1,side:Qe,vertexColors:!0,toneMapped:!1}),e=new Map;let i=null;const a=(l,c)=>{const d=Math.round(l*32)/32,u=Math.max(.05,Math.round(c*20)/20),h=`${Math.round(d*32)}|${Math.round(u*20)}`,f=e.get(h);if(f)return f;const m=Qh(n.radius,n.thickness*u,d,n.edgeFade,Jh,n.profile??"band");if(e.set(h,m),e.size>64){for(const[_,g]of e)if(_!==h&&g!==i){g.dispose(),e.delete(_);break}}return m};i=a(n.arcRad,1);const s=new _e(i,t);s.position.y=n.y,s.renderOrder=n.renderOrder??4;let o=n.arcRad,r=1;return{mesh:s,update(l,c,d,u,h,f=1){const m=Math.max(.05,f);(Math.abs(l-o)>.01||Math.abs(m-r)>.01)&&(i=a(l,m),s.geometry=i,o=l,r=m),t.opacity=c,t.color.copy(u),s.scale.set(d,1,d),s.rotation.y=h,s.visible=c>.002},arcRad(){return o},dispose(){for(const l of e.values())l.dispose();e.clear(),t.dispose()}}}function Cf(n,t){return Math.max(.05,n*.5*Math.max(.1,t))}function vA(n,t,e,i,a){const s=a.arcDeg*Math.PI/180,o=a.playerOpacity;if(!n)return{arcRad:s,opacity:o,scale:1,level:0};const r=Math.min(1,Math.max(0,t)),l=Math.min(1,Math.max(0,e)),c=a.selectedArcDeg*Math.PI/180,d=s+(c-s)*(.35+.65*r),u=4+4*r+6*l,h=.5+.5*Math.sin(i*u),f=Math.min(.95,o+(.2+.1*l)*r+.04*h),m=1+.02*r+.012*h*r;return{arcRad:d,opacity:f,scale:m,level:r}}function yA(n,t,e,i,a){const s=Math.min(1,Math.max(0,a));return s<=.001?n.copy(t):s<.5?n.copy(t).lerp(e,s*2):n.copy(e).lerp(i,(s-.5)*2)}function _A(n=64,t=.06,e=5){const i=n+1,a=e+1,s=new Float32Array(i*a*3),o=new Float32Array(i*a*4),r=[];for(let c=0;c<i;c++){const d=c/n*Math.PI*2,u=Math.sin(d),h=Math.cos(d);for(let f=0;f<a;f++){const m=f/e,_=t+(1-t)*m,g=c*a+f;s[g*3]=u*_,s[g*3+1]=0,s[g*3+2]=h*_;const p=Math.pow(1-m,1.8)*.9+(f===0?.1:0);o[g*4]=1,o[g*4+1]=1,o[g*4+2]=1,o[g*4+3]=Math.min(1,p)}}for(let c=0;c<n;c++)for(let d=0;d<e;d++){const u=c*a+d,h=u+a;r.push(u,h,u+1,u+1,h,h+1)}const l=new on;return l.setAttribute("position",new mn(s,3)),l.setAttribute("color",new mn(o,4)),l.setIndex(r),l.computeBoundingSphere(),l}function Lf(n){const t=n.segments??Jh,e=n.profile??"band",a=((e==="glow"?Tm.length:Em.length)-1)*6,s=Qh(n.radius,n.thickness,n.arcRad,n.edgeFade,t,e),o=new pn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Qe,vertexColors:!0,toneMapped:!1}),r=new _e(s,o);r.position.y=n.y,r.renderOrder=n.renderOrder??7,r.visible=!1,s.setDrawRange(0,0);let l=0;return{mesh:r,set(c,d,u,h,f=1){const m=Math.min(1,Math.max(0,c)),_=Math.round(m*t),g=m>.001?Math.max(1,_)*a:0;g!==s.drawRange.count&&s.setDrawRange(0,g),l=_,o.opacity=d,o.color.copy(u),r.scale.set(f,1,f),r.rotation.y=h,r.visible=d>.002&&m>.001},ratio(){return t>0?l/t:0},filledSegments(){return l},dispose(){s.dispose(),o.dispose()}}}function Df(n){const t=new Le,e=_A(48),i=new pn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Qe,vertexColors:!0,toneMapped:!1}),a=new _e(e,i);a.renderOrder=n.renderOrder??2,t.add(a);const s=Math.max(.01,n.edgeWidthRatio??.045),o=Qh(1-s*.5,s,Math.PI*2,0,64,"band"),r=new pn({color:n.color,transparent:!0,opacity:0,depthWrite:!1,side:Qe,vertexColors:!0,toneMapped:!1}),l=new _e(o,r);return l.renderOrder=(n.renderOrder??2)+1,t.add(l),t.position.y=n.y,{group:t,set(c,d,u,h,f,m){const _=Math.min(1,Math.max(0,f));t.position.set(c,u,d),a.scale.set(h,1,h),l.scale.set(h,1,h),i.opacity=_*.26,r.opacity=_*(.72+.18*Math.sin(m*7)),t.visible=_>.004},dispose(){e.dispose(),i.dispose(),o.dispose(),r.dispose()}}}function kf(n,t,e,i){if(i<=1e-4||e<=0)return t;const a=1-Math.exp(-e/i);return n+(t-n)*a}function MA(n,t,e){if(n!=="windup")return{active:!1,ratio:0,urgency:0};const i=Math.max(1e-4,e),a=Math.min(1,Math.max(0,t/i));return{active:!0,ratio:a,urgency:.35+.65*a}}function bA(n){if(n.charging)return{source:"charge",ratio:Math.min(1,Math.max(0,n.charge))};if(n.channeling){if(n.channelProgress!==void 0)return{source:"channel",ratio:Math.min(1,Math.max(0,n.channelProgress))};const i=Math.max(1e-4,n.fireInterval);return{source:"channel",ratio:1-Math.min(1,Math.max(0,n.fireTimer/i))}}const t=n.arcaneCooldown??0,e=n.arcaneCooldownMax??0;return t>0&&e>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,t/e))}:n.dashCooldown>0&&n.dashCooldownMax>0?{source:"cooldown",ratio:1-Math.min(1,Math.max(0,n.dashCooldown/n.dashCooldownMax))}:{source:"none",ratio:0}}function SA(n,t,e,i,a,s){return n!=="windup"||a<=.05?{active:!1,x:t,z:e,radius:0}:{active:!0,x:t+Math.sin(i)*a,z:e+Math.cos(i)*a,radius:Math.max(.3,s)}}function wA(n,t){const e=Math.max(.02,t),i=Math.min(1,Math.max(0,n/e));return{scale:.06+.94*(1-Math.pow(1-i,3)),alpha:i}}function EA(n,t,e){return n?t:e}function Am(n){return{x:0,y:0,z:1}}function TA(n){return Math.asin(Am().y)}function AA(n,t){const e=Math.cos(t),i=Math.sin(t);return{x:n.x*e+n.z*i,y:n.y,z:-0*i+n.z*e}}const RA=Math.PI/3;function If(n){let t=n;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function PA(){let n=0,t=!1;return{update(e,i,a,s=RA){if(!Number.isFinite(e))return n;if(!t)return t=!0,n=e,n;if(!(a>0)||!(i>0))return n=e,n;const o=If(e-n);if(Math.abs(o)>=s)return n=e,n;const r=1-Math.exp(-i/(a/1e3));return n=If(n+o*r),n},reset(e){t=!0,n=e},get value(){return n},get ready(){return t}}}function CA(n){const t=Math.max(2,Math.floor(n.maxSamples)),e=new on,i=new Float32Array(t*2*3),a=new Float32Array(t*2*3),s=new mn(i,3),o=new mn(a,3);s.setUsage(to),o.setUsage(to),e.setAttribute("position",s),e.setAttribute("color",o);const r=[];for(let x=0;x<t-1;x++){const y=x*2,w=y+1,S=y+2,T=y+3;r.push(y,w,S,w,T,S)}e.setIndex(r),e.setDrawRange(0,0);const l=new pn({vertexColors:!0,transparent:!0,opacity:1,blending:ki,depthWrite:!1,side:Qe}),c=new _e(e,l);c.frustumCulled=!1,c.renderOrder=6,c.visible=!1;const d=new ie(n.color);let u=[],h=null,f=0,m=0,_=!1,g=!1,p=0;function v(){const x=u.length;if(x<2||!n.enabled){c.visible=!1,e.setDrawRange(0,0);return}const y=Math.max(.001,n.life);for(let w=0;w<x;w++){const S=u[w],T=Math.max(0,1-S.age/y),E=T*T,M=Math.min(1,S.speed/Math.max(.001,n.minSpeed*2)),b=n.intensity*E*(.55+.45*M)*(1+p),R=.18+.82*T,k=w*6;i[k]=S.tx+(S.bx-S.tx)*R,i[k+1]=S.ty+(S.by-S.ty)*R,i[k+2]=S.tz+(S.bz-S.tz)*R,i[k+3]=S.tx,i[k+4]=S.ty,i[k+5]=S.tz;const C=d.r*b,I=d.g*b,L=d.b*b,D=C*.22,O=I*.22,B=L*.22;a[k]=D,a[k+1]=O,a[k+2]=B;const V=1+n.tipBoost;a[k+3]=Math.min(1,C*V),a[k+4]=Math.min(1,I*V),a[k+5]=Math.min(1,L*V)}s.needsUpdate=!0,o.needsUpdate=!0,e.setDrawRange(0,(x-1)*6),c.visible=!0}return{object:c,update(x,y,w){if(!n.enabled){c.visible=!1;return}const S=Math.max(0,x);p*=Math.exp(-Math.max(1,n.pulseDecay??14)*S),p<.001&&(p=0);for(const T of u)T.age+=S;for(;u.length>0&&u[0].age>n.life;)u.shift();if(y){const T=h?Math.hypot(y.tip.x-h.x,y.tip.y-h.y,y.tip.z-h.z)/Math.max(1e-4,S):0,E=u[u.length-1],M=E?Math.hypot(y.tip.x-E.tx,y.tip.y-E.ty,y.tip.z-E.tz):1/0;if(w&&M>=n.minStep)for(u.push({bx:y.base.x,by:y.base.y,bz:y.base.z,tx:y.tip.x,ty:y.tip.y,tz:y.tip.z,age:0,speed:T});u.length>t;)u.shift();h={x:y.tip.x,y:y.tip.y,z:y.tip.z},f=T,m=M,_=!0}else h=null,_=!1,f=0,m=0;g=w,v()},debug(){return{count:u.length,visible:c.visible,speed:f,moved:m,hasBlade:_,active:g,pulse:p}},pulse(x){!Number.isFinite(x)||x<=0||(p=Math.min(1.5,p+x))},reset(){u=[],h=null,p=0,c.visible=!1,e.setDrawRange(0,0)},dispose(){e.dispose(),l.dispose()}}}const LA=`#include <common>
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
}`,DA=`vec4 mvPosition = vec4( transformed, 1.0 );
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
  float effL = ${Gd.toFixed(2)} * aWindGeom.x + aWindGeom.y;
  float theta = atan(sway, max(effL, 1e-3));
  float tLow = theta * ${Gd.toFixed(2)};
  float tUp  = theta * ${sx.toFixed(2)};

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
gl_Position = projectionMatrix * mvPosition;`,kA=`#include <common>
varying float vWindShade;`,IA=`#include <color_fragment>
diffuseColor.rgb *= vWindShade;`;function zA(n,t,e,i,a){const s=Math.min(e.blades.length,Math.floor(Math.max(0,i.maxInstances)/2)),o=s*2,r=new Float32Array(o*2),l=new Float32Array(o*3),c=new Float32Array(o*4),d=Math.max(.01,i.segmentHeight);for(let f=0;f<s;f++){const m=e.blades[f],_=Math.min(d,m.height),g=Math.max(0,m.height-_),[p,v]=ix(a,m.x,m.z,m.yaw*a.jitter),x=Math.min(1.4,Math.max(.6,m.height/(d*1.5)));for(let y=0;y<2;y++){const w=f*2+y;r[w*2]=p,r[w*2+1]=v,l[w*3]=m.x,l[w*3+1]=m.y,l[w*3+2]=m.z,c[w*4]=_,c[w*4+1]=g,c[w*4+2]=x,c[w*4+3]=y}}t.setAttribute("aWindPhase",new no(r,2)),t.setAttribute("aWindRoot",new no(l,3)),t.setAttribute("aWindGeom",new no(c,4));const u=cp(a),h={uWindTime:{value:0},uWindDir:{value:new Yt(u.dirX,u.dirZ)},uWindOmega:{value:new Yt(u.omega1,u.omega2)},uWindAmp:{value:new Yt(u.amp1,u.amp2)},uWindGust:{value:1},uWindShade:{value:u.shadeAmount},uWindOn:{value:a.enabled?1:0}};return n.onBeforeCompile=f=>{Object.assign(f.uniforms,h),f.vertexShader=f.vertexShader.replace("#include <common>",LA).replace("#include <project_vertex>",DA),f.fragmentShader=f.fragmentShader.replace("#include <common>",kA).replace("#include <color_fragment>",IA)},n.customProgramCacheKey=()=>"grass-wind-pivot-v2",h}function FA(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function UA(n,t,e=ho){const i=new Le;i.name="grass-layer";const s=n.blades.length,o=Math.max(0,Math.floor(t.maxInstances)),r=Math.min(s,Math.floor(o/2)),l=r*2,c=t.enabled&&l>0,u=(t.palette.length>0?t.palette:["#4a8f57"]).map(U=>new ie(U)),h=new ie(t.stumpColor),f=new ie(t.debris.color),m=new $n(1,1,1),_=new $n(1,1,1),g=new Pa({color:16777215,transparent:!1}),p=zA(g,_,n,t,e),v=new Pa({color:f,transparent:!1});let x=null,y=null,w=null;const S=[],T=FA(2654435769^r),E=new Float32Array(r),M=new Uint8Array(r),b=new Float32Array(r),R=new Uint8Array(r).fill(1),k=new Pe,C=new ea,I=new ea,L=new ea,D=new X,O=new X,B=new X,V=new X,ot=new ie,gt=new ie,vt=new Pe().makeScale(0,0,0);let It=0,K=0,it=0,ct=0,Z=1,J=1;const lt=8;let Ht={enabled:e.enabled,time:0,gust:1,mode:"pivot"};function qt(U,Nt){if(u.length===1)return Nt.copy(u[0]);const Dt=Math.max(0,Math.min(u.length-1,U*(u.length-1))),St=Math.min(u.length-2,Math.max(0,Math.floor(Dt)));return Nt.copy(u[St]).lerp(u[St+1],Math.min(1,Math.max(0,Dt-St)))}if(c){x=new lf(_,g,l),x.instanceMatrix.setUsage(to),x.castShadow=!1,x.receiveShadow=!0,x.frustumCulled=!1,x.name="grass-blades",x.setColorAt(0,u[0]),y=x.instanceColor,y&&y.setUsage(to);for(let Nt=0;Nt<l;Nt++)x.setMatrixAt(Nt,vt);i.add(x);const U=Math.max(1,Math.floor(t.debris.max));w=new lf(m,v,U),w.instanceMatrix.setUsage(to),w.castShadow=!1,w.receiveShadow=!1,w.frustumCulled=!1,w.name="grass-debris";for(let Nt=0;Nt<U;Nt++)w.setMatrixAt(Nt,vt);i.add(w)}i.visible=c;function Ct(U,Nt,Dt,St,_t,xt){if(!w)return;const Rt=w.count;if(S.length>=Rt)return;const F=t.debris.life,A=1.1+T()*1.5;S.push({x:U,y:Nt,z:Dt,vx:St*A+(T()-.5)*1.2,vy:1.9+T()*1.8,vz:_t*A+(T()-.5)*1.2,life:F,total:F,size:xt*(.55+T()*.45),spin:(T()-.5)*9})}function q(U){if(!w)return;const Nt=w.count,Dt=12;for(let _t=S.length-1;_t>=0;_t--){const xt=S[_t];if(xt.life-=U,xt.life<=0){S.splice(_t,1);continue}xt.vy-=Dt*U,xt.x+=xt.vx*U,xt.y+=xt.vy*U,xt.z+=xt.vz*U,xt.y<.02&&(xt.y=.02,xt.vy=-xt.vy*.25,xt.vx*=.6,xt.vz*=.6)}const St=1e-4;for(let _t=0;_t<Nt;_t++){const xt=S[_t];if(!xt){w.setMatrixAt(_t,vt);continue}const Rt=Math.max(St,xt.life/xt.total);O.set(xt.x,xt.y,xt.z),D.set(.4+_t*.13,1,.2).normalize(),C.setFromAxisAngle(D,xt.spin*(xt.total-xt.life)),B.set(xt.size*Rt,xt.size*.7*Rt,xt.size*Rt),k.compose(O,C,B),w.setMatrixAt(_t,k)}w.instanceMatrix.needsUpdate=!0}return{object:i,update(U,Nt){var yt,Gt,Ot;if(!c||!x)return;const Dt=U.grass,St=((yt=U.config.grass)==null?void 0:yt.wind)??ho,_t=cp(St),xt=((Gt=Dt.wind)==null?void 0:Gt.time)??0,Rt=((Ot=Dt.wind)==null?void 0:Ot.gust)??1;p.uWindTime.value=xt,p.uWindGust.value=Rt,p.uWindDir.value.set(_t.dirX,_t.dirZ),p.uWindOmega.value.set(_t.omega1,_t.omega2),p.uWindAmp.value.set(_t.amp1,_t.amp2),p.uWindShade.value=_t.shadeAmount,p.uWindOn.value=St.enabled?1:0,Ht={enabled:St.enabled,time:xt,gust:Rt,mode:"pivot"};const F=Math.min(r,Dt.blades.length),A=Math.min(.05,Math.max(0,Nt)),G=U.config.grass,pt=(G==null?void 0:G.regrowSec)??0,Q=Math.min(1,Math.max(.05,(G==null?void 0:G.stumpRatio)??.34)),rt=t.segmentHeight,Ft=Math.PI*2;x.instanceMatrix.clearUpdateRanges(),y&&y.clearUpdateRanges();let tt=0,ut=0,Ut=0,at=0,bt=0,H=0,ht=0;for(let Lt=0;Lt<F;Lt++){const N=Dt.blades[Lt],wt=N.cut!==0?1:0,st=N.yaw/Ft,dt=ox(N.cut,pt,st),Et=Math.min(rt,N.height),Tt=Et*Q,Qt=Tt+(N.height-Tt)*dt;if(Lt<lt&&(H+=Qt/Math.max(1e-6,N.height),ht+=1),dt>.001&&dt<1-.001&&(at+=1,bt+=dt),!(R[Lt]===1||Math.abs(N.bend-E[Lt])>1e-4||wt!==M[Lt]||Math.abs(dt-b[Lt])>.001)){N.bend>.02&&(ut+=1),wt&&(Ut+=1);continue}wt&&!M[Lt]&&R[Lt]!==1&&(Ct(N.x,N.y+Et*.75,N.z,N.bendX||1,N.bendZ||0,N.width*1.5),Ct(N.x,N.y+Et+(N.height-Et)*.5,N.z,N.bendX||1,N.bendZ||0,N.width*1.2)),D.set(Math.cos(N.yaw),0,-Math.sin(N.yaw)),L.setFromAxisAngle(D,N.lean),D.set(N.bendZ,0,-N.bendX),I.setFromAxisAngle(D,N.bend),C.copy(I).multiply(L),V.set(N.x,N.y,N.z);const de=Math.min(rt,Qt),ae=Math.max(0,Qt-rt);O.set(0,de*.5,0).applyQuaternion(C).add(V),B.set(N.width,de,N.width),k.compose(O,C,B),x.setMatrixAt(Lt*2,k),ae<1e-4?x.setMatrixAt(Lt*2+1,vt):(O.set(0,de+ae*.5,0).applyQuaternion(C).add(V),B.set(N.width*.84,ae,N.width*.84),k.compose(O,C,B),x.setMatrixAt(Lt*2+1,k)),qt(N.tone,gt),dt>=1?ot.copy(gt):ot.copy(h).lerp(gt,dt),x.setColorAt(Lt*2,ot),x.setColorAt(Lt*2+1,ot),x.instanceMatrix.addUpdateRange(Lt*32,32),y&&y.addUpdateRange(Lt*6,6),E[Lt]=N.bend,M[Lt]=wt,b[Lt]=dt,R[Lt]=0,tt+=1,N.bend>.02&&(ut+=1),wt&&(Ut+=1)}tt>0&&(x.instanceMatrix.needsUpdate=!0,y&&(y.needsUpdate=!0)),q(A),It=tt,K=ut,it=Ut,ct=at,Z=at>0?bt/at:1,J=ht>0?H/ht:1},debug(){return{enabled:c,blades:s,patches:n.patches.length,instances:l,drawCalls:c?2:0,dirty:It,bent:K,cut:it,debris:S.length,growing:ct,avgGrowth:Z,sampleHeight:J,wind:{...Ht}}},dispose(){m.dispose(),_.dispose(),g.dispose(),v.dispose(),i.clear()}}}function NA(n,t){switch(n){case"ground":return t.colors.ground;case"step":return t.colors.step;case"wall":return t.colors.wall;case"lintel":return t.colors.lintel;case"obstacle":return t.colors.obstacle;default:return"#ffffff"}}function OA(n,t,e,i){var kn,nn;const a=Math.max(1,n.clientWidth),s=Math.max(1,n.clientHeight),o=new NE({antialias:!0});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),o.shadowMap.enabled=!0,o.shadowMap.type=yp,o.setSize(a,s,!1),n.appendChild(o.domElement);const r=new OE;r.background=new ie("#12161d"),r.add(new bT(11061486,2764600,1.15));const l=new ET(16773852,1.5);l.position.set(9,18,11),l.castShadow=!0,l.shadow.mapSize.set(1024,1024);const c=l.shadow.camera;c.left=-20,c.right=20,c.top=20,c.bottom=-20,c.near=1,c.far=60,r.add(l);const d=[],u=new Le;for(const W of t.boxes){const Pt=W.maxX-W.minX,kt=W.maxY-W.minY,ee=W.maxZ-W.minZ;let Kt=NA(W.kind,e);W.kind==="step"&&(Kt=new ie(Kt).offsetHSL(0,0,W.maxY*.09).getStyle());const oe=new Pa({color:Kt,transparent:!1,opacity:1}),pe=new _e(new $n(Pt,kt,ee),oe);pe.position.set((W.minX+W.maxX)/2,(W.minY+W.maxY)/2,(W.minZ+W.maxZ)/2),pe.castShadow=W.kind!=="ground",pe.receiveShadow=!0,pe.add(new jp(new iT(pe.geometry),new Gh({color:10467020,transparent:!0,opacity:.32}))),u.add(pe),d.push(oe)}r.add(u);const h=t.gridMeta.maxX-t.gridMeta.minX,f=new AT(h,h,4873328,3358797);f.position.y=.002,f.visible=e.showGrid,r.add(f);const m=pA(i,e);r.add(m.group);const _=UA(t.grass,e.grass,t.config.grass.wind);ol(_.object,Ve.grass),r.add(_.object);const g=W=>wm((W==null?void 0:W.voxel)??e.voxel,W!=null&&W.colors?{...e.colors,...W.colors}:e.colors,t.config.moveSpeed,e.orientation,e.gait,e.weaponMount,e.lean,e.hurt,e.animation,e.ik,e.links,e.weaponWrist,e.balance);let p="standard",v=g((kn=e.bodyTypes)==null?void 0:kn[p]);const x=CA(e.weaponTrail);ol(x.object,Ve.trail),r.add(x.object);const y=new Le,w=.9,S=new Le;S.position.y=w,v.group.position.y=-w,S.add(v.group),y.add(S),r.add(y);const T=PA();let E=0;const M=((nn=t.config.dummies.fighters)==null?void 0:nn.moveSpeed)??t.config.dummies.moveSpeed;function b(W,Pt){const kt=e.dummies.colors,ee=kt[Pt%kt.length]??"#cccccc";let Kt;if(W.weapon){const oe=e.dummies.fighterColors,pe=oe&&oe.length>0?oe[(Pt-t.config.dummies.count)%oe.length]:void 0;Kt=fA({voxel:e.voxel,colors:pe?{...e.colors,...pe}:e.colors,moveSpeed:M,orientation:e.orientation,gait:e.gait,mount:e.weaponMount,lean:e.lean,hurt:e.hurt,animation:e.animation,ik:e.ik,links:e.links,wrist:e.weaponWrist,balance:e.balance})}else{const oe=WT(e.voxel,e.colors,ee,W.id,e.dummies,t.config.dummies.moveSpeed,e.gait,e.hurt,e.lean,e.ik);Kt={group:oe.group,update:(pe,P)=>oe.update(pe,P),boneAtWorld:(pe,P,Y)=>oe.boneAtWorld(pe,P,Y),dispose:()=>oe.dispose()}}return Kt.group.traverse(oe=>{oe.userData.dummyId=W.id}),r.add(Kt.group),Kt}const R=t.dummies.map(b),k=R.map(W=>W.group),C=new TT,I=e.groundRing,L=e.voxel.bodyWidth,D=Cf(L,I.playerRadiusFactor),O=Cf(L,I.dummyRadiusFactor),B=L*I.thicknessFactor,V=I.arcDeg*Math.PI/180;let ot=0;const gt=(W,Pt,kt)=>jf(t.boxes,W,Pt,kt+.55,0),vt=cl({radius:D,thickness:B,arcRad:V,edgeFade:I.edgeFade,color:I.playerColor,opacity:I.playerOpacity,y:.028,renderOrder:Ve.ring});vt.mesh.name="player-ground-ring",r.add(vt.mesh);function It(W){const Pt=cl({radius:O,thickness:B,arcRad:V,edgeFade:I.edgeFade,color:I.neutralColor,opacity:I.opacity,y:.022,renderOrder:Ve.ring});return Pt.mesh.name=`dummy-ground-ring-${W.id}`,r.add(Pt.mesh),Pt}function K(W){const Pt=cl({radius:O*I.haloRadiusFactor,thickness:B*I.haloThicknessFactor,arcRad:V,edgeFade:I.edgeFade,color:I.neutralColor,opacity:0,profile:"glow",y:.019,renderOrder:Ve.ringHalo});return Pt.mesh.name=`dummy-ground-halo-${W.id}`,r.add(Pt.mesh),Pt}function it(W){const Pt=Lf({radius:O*I.warnRadiusFactor,thickness:B*I.warnThicknessFactor,arcRad:V,edgeFade:.02,color:I.warnColor,y:.031,renderOrder:Ve.ringWarn});return Pt.mesh.name=`dummy-ground-warn-${W.id}`,r.add(Pt.mesh),Pt}const ct=t.dummies.map(It),Z=t.dummies.map(K),J=t.dummies.map(()=>0),lt=t.dummies.map(()=>0),Ht=Lf({radius:D*I.meterRadiusFactor,thickness:B*I.meterThicknessFactor,arcRad:V,edgeFade:.06,color:I.meterColorCharge,y:.03,renderOrder:Ve.ringMeter});Ht.mesh.name="player-ground-meter",r.add(Ht.mesh);const qt=t.dummies.map(it),Ct=Df({color:I.playerColor,y:.042,renderOrder:Ve.groundArea});Ct.group.name="player-landing-preview",r.add(Ct.group);const q=new ie,U=new ie(I.playerColor),Nt=new ie(I.neutralColor),Dt=new ie(I.lowThreatColor),St=new ie(I.highThreatColor),_t=new ie(I.meterColorCharge),xt=new ie(I.meterColorChannel),Rt=new ie(I.meterColorCooldown),F=new ie(I.warnColor),A=new Le;r.add(A);const G=e.projectiles;function pt(){const Pt=document.createElement("canvas");Pt.width=64,Pt.height=64;const kt=Pt.getContext("2d");if(kt){const Kt=kt.createRadialGradient(32,32,0,32,32,32);Kt.addColorStop(0,"rgba(255,255,255,1)"),Kt.addColorStop(.28,"rgba(255,255,255,0.72)"),Kt.addColorStop(.62,"rgba(255,255,255,0.22)"),Kt.addColorStop(1,"rgba(255,255,255,0)"),kt.fillStyle=Kt,kt.fillRect(0,0,64,64)}const ee=new fh(Pt);return ee.colorSpace=Dn,ee}function Q(){const kt=document.createElement("canvas");kt.width=2,kt.height=64;const ee=kt.getContext("2d");if(ee){const oe=ee.createLinearGradient(0,0,0,64);oe.addColorStop(0,"rgba(255,255,255,0)"),oe.addColorStop(.55,"rgba(255,255,255,0.35)"),oe.addColorStop(1,"rgba(255,255,255,0.95)"),ee.fillStyle=oe,ee.fillRect(0,0,2,64)}const Kt=new fh(kt);return Kt.colorSpace=Dn,Kt}const rt=pt(),Ft=Q(),tt=new pn({color:12577023,transparent:!0,opacity:0,side:Qe,depthWrite:!1}),ut=new pn({color:14217983,transparent:!0,opacity:0,side:Qe,depthWrite:!1,blending:ki}),Ut=new Le;Ut.position.set(0,.95,.72),A.add(Ut);const at=new Le;at.rotation.x=TA(e.camera.pitchDeg),Ut.add(at);const bt=new jr(.78,G.slashThickness,6,28,Math.PI*1.15),H=new Le,ht=new _e(bt,tt),yt=new _e(bt,ut);yt.scale.setScalar(1.09),ol(H,Ve.slash),yt.renderOrder=Ve.slash+1,H.add(ht,yt),at.add(H);const Gt=new $n(G.arrowWidth,G.arrowWidth,G.arrowLength),Ot=new Yh(G.arrowHeadSize*.42,G.arrowHeadSize,4);Ot.rotateX(Math.PI/2);const Lt=new $n(G.arrowWidth*2.6,G.arrowWidth*.4,.1),N=new go(G.arrowWidth*.45,G.arrowWidth*1.3,G.trailLength,6,1,!0);N.rotateX(-Math.PI/2),N.translate(0,0,-G.trailLength/2);const wt=Array.from({length:10},()=>{const W=new Le,Pt=new pn({color:G.arrowColor,transparent:!0}),kt=new pn({color:G.arrowHeadColor,transparent:!0}),ee=new uh({map:rt,color:G.arrowColor,transparent:!0,opacity:.85,blending:ki,depthWrite:!1}),Kt=new pn({color:G.arrowTrailColor,map:Ft,transparent:!0,opacity:0,blending:ki,depthWrite:!1,side:Qe}),oe=new _e(Gt,Pt),pe=new _e(Ot,kt);pe.position.z=G.arrowLength/2+G.arrowHeadSize*.42;const P=new _e(Lt,kt),Y=new _e(Lt,kt);P.position.z=-G.arrowLength/2+.08,Y.position.z=P.position.z,Y.rotation.z=Math.PI/2;const et=new of(ee);et.scale.setScalar(G.arrowGlowSize),et.renderOrder=Ve.projectileGlow;const nt=new _e(N,Kt);return nt.renderOrder=Ve.projectileTrail,oe.renderOrder=Ve.projectile,pe.renderOrder=Ve.projectile,P.renderOrder=Ve.projectile,Y.renderOrder=Ve.projectile,W.add(oe,pe,P,Y,et,nt),W.visible=!1,r.add(W),{group:W,shaftMat:Pt,tipMat:kt,glowMat:ee,trailMat:Kt,glow:et,trail:nt,arrowId:0,bone:null}}),st=new Zh(1,0),dt=new X(G.boltShapeX,G.boltShapeY,G.boltShapeZ),Et=new pn({color:G.boltColor,transparent:!0,opacity:.98,depthWrite:!1}),Tt=new uh({map:rt,color:G.boltGlowColor,transparent:!0,opacity:.45,blending:ki,depthWrite:!1}),Qt=new pn({color:G.boltGlowColor,map:Ft,transparent:!0,opacity:G.trailOpacity,blending:ki,depthWrite:!1,side:Qe}),re=new go(.5,.03,G.boltTrailScale,6,1,!0);re.rotateX(-Math.PI/2),re.translate(0,0,-G.boltTrailScale/2);const de=Array.from({length:24},()=>{const W=new Le,Pt=new _e(st,Et);Pt.scale.copy(dt);const kt=new of(Tt);kt.scale.setScalar(G.boltGlowScale),kt.renderOrder=Ve.projectileGlow;const ee=new _e(re,Qt);return ee.renderOrder=Ve.projectileTrail,Pt.renderOrder=Ve.projectile,W.add(Pt,kt,ee),W.visible=!1,r.add(W),{group:W,core:Pt}}),ae=Array.from({length:6},()=>{const W=Df({color:"#9ad0ff",edgeWidthRatio:.038,y:.045,renderOrder:Ve.groundArea});return W.group.visible=!1,r.add(W.group),W}),Te=mA(r,e,t,gt),ge=PT(e.camera,e.smartCamera,e.zoom,a/s),gn=t.character.position;ge.update(gn.x,gn.y,gn.z,1,t.camera);function wn(W){const Pt=W.dummies.length;for(;R.length<Pt;){const ee=R.length,Kt=W.dummies[ee],oe=b(Kt,ee);R.push(oe),k.push(oe.group),ct.push(It(Kt)),Z.push(K(Kt)),qt.push(it(Kt)),J.push(0),lt.push(0)}let kt=!1;for(;R.length>Pt;){kt=!0;const ee=R.pop();r.remove(ee.group),ee.dispose(),k.pop();const Kt=ct.pop();r.remove(Kt.mesh),Kt.dispose();const oe=Z.pop();r.remove(oe.mesh),oe.dispose();const pe=qt.pop();r.remove(pe.mesh),pe.dispose(),J.pop(),lt.pop()}if(kt)for(let ee=0;ee<Pt;ee++){const Kt=W.dummies[ee].id;R[ee].group.userData.dummyId!==Kt&&R[ee].group.traverse(oe=>{oe.userData.dummyId=Kt})}}function Be(W,Pt){if(k.length===0)return 0;const kt=o.domElement.getBoundingClientRect(),ee=new Yt((W-kt.left)/kt.width*2-1,-((Pt-kt.top)/kt.height)*2+1);C.setFromCamera(ee,ge.camera);const Kt=C.intersectObjects(k,!0);for(const oe of Kt){const pe=oe.object.userData.dummyId;if(pe&&pe>0)return pe}return 0}function Re(W,Pt,kt){const ee=o.domElement.getBoundingClientRect(),Kt=new X(W,Pt,kt).project(ge.camera);return{x:ee.left+(Kt.x*.5+.5)*ee.width,y:ee.top+(-Kt.y*.5+.5)*ee.height}}let qe=!1;return{balanceDebug(){return v.balanceDebug()},spineDebug(){return v.spineDebug()},gaitDebug(){return v.gaitDebug()},trailDebug(){return x.debug()},stretchDebug(){const W=v.stretch();return{arm:W.arm,leg:W.leg,torso:W.torso,impact:W.impact}},swingDebug(){return v.swingDebug()},stanceDebug(){return v.stanceDebug()},bladeWorld(){return v.weaponBlade()},bladesWorld(){return v.bladesWorld()},slamDebug(){return Te.slamDebug()},yawDebug(){var W;return{target:E,shown:T.value,tauMs:((W=e.renderInterp)==null?void 0:W.yawSmoothMs)??0}},grassDebug(){return _.debug()},fxDebug(){var W,Pt;return{boxOpaque:d.every(kt=>!kt.transparent),boxCount:d.length,orders:{ring:vt.mesh.renderOrder,groundFx:Te.groundOrder(),trail:x.object.renderOrder,slash:H.renderOrder,projectile:((Pt=(W=wt[0])==null?void 0:W.group.children[0])==null?void 0:Pt.renderOrder)??-1}}},renderPose(){return{x:y.position.x,y:y.position.y,z:y.position.z,bodyYaw:y.rotation.y}},projectPoint(W,Pt,kt){return Re(W,Pt,kt)},setClipT(W){v.setClipT(W)},weaponDebug(){return v.weaponDebug()},gripDebug(){return v.gripDebug()},render(W,Pt){var Fe;wn(W);const kt=W.character,ee=W.combat,Kt=e.hitstop.enabled&&W.combat.hitstop>0,oe=Pt*Math.max(0,Math.min(4,ee.warp??1));if(Kt&&!qe){const Bt=Math.max(0,W.combat.hitstop),ft=Math.max(0,Math.min(1,Bt/.1));ge.addShake(.34+ft*.48);let ne=null;for(let ce=0;ce<W.events.length;ce++){const Me=W.events[ce];if(Me.type==="hit"){ne=Me;break}}ne&&ge.addKick(ne.x-kt.position.x,ne.z-kt.position.z,.03+ft*.05)}qe=Kt;for(let Bt=0;Bt<W.events.length;Bt++){const ft=W.events[Bt];if(ft.type!=="notify")continue;const ne=Number.isFinite(ft.value)?ft.value:0;if(ft.name==="blade-air"){const ce=Math.max(0,Math.min(1,ne));x.pulse((ee.weapon==="greatsword"?.9:.55)*(.4+.6*ce))}}y.position.set(kt.position.x,kt.position.y,kt.position.z),E=kt.bodyYaw,y.rotation.y=T.update(E,Pt,((Fe=e.renderInterp)==null?void 0:Fe.yawSmoothMs)??0);const pe=W.dash.phase==="active"&&W.dash.kind==="roll",P=pe&&W.dash.duration>0?Math.min(1,1-W.dash.timer/W.dash.duration):0;if(S.rotation.x=pe?P*Math.PI*2:0,S.position.y=w-(pe?.2*Math.sin(Math.PI*P):0),oe>0&&v.update(kt,ee,W.playerHurt,oe,W.abilities.channeling,W.time,W.playerLink,W.turnInPlace),x.update(oe,oe>0?v.weaponBlade():null,oe>0&&(ee.phase==="active"||W.playerLink.phase==="active"||pe&&W.dash.duration>0)),oe>0)for(let Bt=0;Bt<R.length;Bt++)W.dummies[Bt]&&R[Bt].update(W.dummies[Bt],oe,W.time);const Y=ge.camera.position,et=Math.atan2(Y.x-kt.position.x,Y.z-kt.position.z),nt=W.config.gaze.hurtHoldSec,$=W.time-W.playerHurt.lastAt,At=nt>0&&$>=0&&$<nt?1-$/nt:0,zt=vA(W.gaze.active,W.gaze.threat,At,W.time,I);yA(q,U,Dt,St,zt.level),ot=EA(kt.grounded,kt.position.y,ot),vt.mesh.position.set(kt.position.x,ot+.028,kt.position.z),vt.update(zt.arcRad,zt.opacity,zt.scale,q,et);const Zt=W.config.abilities.arcane,jt=Math.max(1,Math.floor(Zt.waves)),Vt=Math.max(1e-4,Zt.waveInterval),$t=bA({charging:ee.charging,charge:ee.charge,channeling:W.abilities.channeling,fireTimer:W.abilities.fireTimer,fireInterval:Vt,channelProgress:W.abilities.channeling?(W.abilities.waveIndex+(1-Math.min(1,Math.max(0,W.abilities.fireTimer/Vt))))/jt:0,arcaneCooldown:W.abilities.cooldown,arcaneCooldownMax:Zt.cooldown,dashCooldown:W.dash.cooldown,dashCooldownMax:W.dash.kind==="blink"?W.config.dash.blinkCooldown:W.config.dash.rollCooldown});Ht.mesh.position.set(kt.position.x,kt.position.y+.03,kt.position.z),Ht.set($t.ratio,$t.source==="none"?0:I.meterOpacity,$t.source==="charge"?_t:$t.source==="channel"?xt:Rt,et);const Wt=W.playerLink,le=Wt.weapon?W.config.links.moves[Wt.weapon]:void 0,ve=SA(Wt.phase,kt.position.x,kt.position.z,Wt.facing,Wt.travel,(le==null?void 0:le.hit.radius)??.9);Ct.set(ve.x,ve.z,gt(ve.x,ve.z,kt.position.y)+.042,ve.radius,ve.active?I.landingOpacity:0,W.time);for(let Bt=0;Bt<ct.length;Bt++){const ft=W.dummies[Bt],ne=ct[Bt],ce=Z[Bt],Me=qt[Bt];if(!ft){ne.mesh.visible=!1,ce.mesh.visible=!1,Me.mesh.visible=!1;continue}const En=W.targeting.hasTarget&&W.targeting.targetId===ft.id;if(tx(W,ft)){const Tn=ex(W,ft);q.copy(Dt).lerp(St,Tn)}else q.copy(Nt);const He=MA(ft.attackPhase,ft.attackPhaseTimer,W.config.dummies.attackWindup);He.active?(q.lerp(F,.5*He.urgency),Me.mesh.position.set(ft.position.x,ft.position.y+.031,ft.position.z),Me.set(He.ratio,I.warnOpacity*(.65+.35*He.urgency),F,et)):Me.set(0,0,F,et);const vn=En?1:0,Se=vn>J[Bt]?I.haloFadeInSec:I.haloFadeOutSec;J[Bt]=kf(J[Bt],vn,Pt,Se);const Ce=J[Bt],Un=1+.02*Ce*Math.sin(W.time*2.2+ft.id),hn=I.arcDeg+(I.selectedArcDeg-I.arcDeg)*Ce;ne.mesh.position.set(ft.position.x,ft.position.y+.022,ft.position.z),ne.update(hn*Math.PI/180,I.opacity+(I.selectedOpacity-I.opacity)*Ce,1+(I.selectedScale-1)*Ce*Un,q,et,1+(I.selectedThicknessScale-1)*Ce),lt[Bt]=kf(lt[Bt],vn,Pt,vn>lt[Bt]?I.haloFadeInSec:I.haloFadeOutSec);const Ke=lt[Bt];ce.mesh.position.set(ft.position.x,ft.position.y+.019,ft.position.z),ce.update(hn*Math.PI/180,I.haloOpacity*Ke*(.88+.12*Math.sin(W.time*2.2+ft.id)),I.selectedScale*(.94+.06*Ke)*Un,q,et)}A.position.set(kt.position.x,kt.position.y,kt.position.z),A.rotation.y=ee.phase!=="idle"?ee.attackFacing:kt.bodyYaw,Te.update(W,Pt,Bt=>ge.addShake(Bt));const Ee=G.slashEnabled&&ee.phase==="active"&&ee.comboIndex>=3;tt.opacity=Ee?.7:0,ut.opacity=Ee?G.slashGlowOpacity:0,Ee&&(H.rotation.z=-1.2+ee.attackProgress*3.2,H.scale.setScalar(.9+ee.comboIndex*.13));for(let Bt=0;Bt<de.length;Bt++){const ft=W.abilities.projectiles[Bt],ne=de[Bt];ne.group.visible=!!ft,ft&&(ne.group.position.set(ft.x,ft.y,ft.z),ne.group.scale.setScalar(ft.radius),ne.group.rotation.set(0,Math.atan2(ft.dirX,ft.dirZ),0))}for(let Bt=0;Bt<ae.length;Bt++){const ft=W.abilities.rings[Bt],ne=ae[Bt];if(!ft){ne.group.visible=!1;continue}const ce=Math.max(0,Math.min(1,ft.life/Math.max(ft.duration,1e-6))),Me=wA(Math.max(0,ft.duration-ft.life),I.areaExpandSec);ne.set(ft.x,ft.z,gt(ft.x,ft.z,kt.position.y)+.045,ft.radius*Me.scale,I.areaOpacity*(.35+.65*ce)*Me.alpha,W.time)}for(let Bt=0;Bt<wt.length;Bt++){const ft=W.arrows[Bt],ne=wt[Bt];if(!ft){ne.group.visible=!1,ne.bone&&(r.attach(ne.group),ne.bone=null),ne.arrowId=0;continue}const ce=ft.stuck&&ft.stuckDummy>=0;if(ne.arrowId!==ft.id){if(ne.bone&&(r.attach(ne.group),ne.bone=null),ne.arrowId=ft.id,ne.group.position.set(ft.x,ft.y,ft.z),ne.group.rotation.set(ft.pitch,ft.yaw,0,"YXZ"),ce){const En=R[ft.stuckDummy],He=En?En.boneAtWorld(ft.x,ft.y,ft.z):null;He&&(He.node.attach(ne.group),ne.bone=He.node)}}else ne.bone||(ne.group.position.set(ft.x,ft.y,ft.z),ne.group.rotation.set(ft.pitch,ft.yaw,0,"YXZ"));ne.group.visible=!0;const Me=ft.stuck?Math.min(1,ft.rest/.6):1;ne.shaftMat.opacity=Me,ne.tipMat.opacity=Me,ne.glowMat.opacity=(ft.stuck?.28:.85)*Me,ne.trailMat.opacity=ft.stuck?0:G.trailOpacity*Me,ne.trail.visible=!ft.stuck}_.update(W,Pt),ge.update(kt.position.x,kt.position.y,kt.position.z,Pt,W.camera),o.render(r,ge.camera)},resize(){const W=Math.max(1,n.clientWidth),Pt=Math.max(1,n.clientHeight);o.setSize(W,Pt,!1),ge.resize(W/Pt)},getGroundBasis(){return ge.getGroundBasis()},setCollidersVisible(W){for(const Pt of d)Pt.opacity=W?.3:1,Pt.wireframe=W,Pt.transparent=W,Pt.depthWrite=!W,Pt.needsUpdate=!0},setGridVisible(W){f.visible=W},setLabVisible(W){m.setVisible(W)},setLabLabelsVisible(W){m.setLabelsVisible(W)},snapCamera(W,Pt,kt){ge.snap(W,Pt,kt)},setZoom(W){ge.setZoom(W)},setBodyType(W){var kt;const Pt=(kt=e.bodyTypes)==null?void 0:kt[W];return!Pt||W===p||(S.remove(v.group),v.dispose(),v=g(Pt),v.group.position.y=-w,S.add(v.group),x.reset(),p=W,t.config.characterHeight=Pt.height,Pt.radius!==void 0&&(t.config.characterRadius=Pt.radius)),p},bodyTypes(){return{id:p,ids:Object.keys(e.bodyTypes??{})}},pickDummy:Be,dummyRenderCount:()=>R.length,projectToScreen:Re,dummyRigDebug(W){const Pt=R[W-1];return Pt!=null&&Pt.debug?Pt.debug():null},diagnostics(){const W=Am(e.camera.pitchDeg),Pt=AA(W,A.rotation.y);return{lean:v.lean(),slashNormal:Pt,arrowForward:v.arrowDirection(),gait:{hipYaw:v.hipYaw(),gaitYaw:v.gaitYaw()},attackBlend:v.attackBlend(),attackWeights:v.attackWeights(),landing:v.landing(),hurt:v.hurt(),ik:v.ik(),link:{phase:t.playerLink.phase,kind:t.playerLink.kind,window:t.playerLink.linkWindow,cooldown:t.playerLink.cooldown,progress:t.playerLink.progress,hits:t.playerLink.hitIds.length,id:t.playerLink.id},dash:{rollAngle:S.rotation.x,activeRings:Te.activeDash(),lastKind:Te.dashKind()},camera:{threat:t.camera.threat,threatCount:t.camera.threatCount,...ge.smart(),shake:ge.shakeLevel(),kick:ge.kickLevel(),kickCount:ge.kickCount()}}},dispose(){v.dispose(),m.dispose(),_.dispose();for(const W of R)W.dispose();vt.dispose();for(const W of ct)W.dispose();for(const W of Z)W.dispose();Ht.dispose(),x.dispose();for(const W of qt)W.dispose();Ct.dispose(),bt.dispose(),tt.dispose(),ut.dispose(),st.dispose(),Et.dispose(),Tt.dispose(),Qt.dispose(),re.dispose();for(const W of ae)W.dispose();Gt.dispose(),Ot.dispose(),Lt.dispose(),N.dispose();for(const W of wt)W.shaftMat.dispose(),W.tipMat.dispose(),W.glowMat.dispose(),W.trailMat.dispose();rt.dispose(),Ft.dispose(),Te.dispose(),u.traverse(W=>{W instanceof _e&&W.geometry.dispose()}),o.dispose(),o.domElement.remove()}}}async function BA(n){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(n),!0}catch{}try{const t=document.createElement("textarea");t.value=n,t.setAttribute("readonly",""),t.style.cssText="position:fixed;top:-2000px;left:0;opacity:0;",document.body.appendChild(t),t.select(),t.setSelectionRange(0,n.length);const e=document.execCommand("copy");return document.body.removeChild(t),e}catch{return!1}}function HA(n,t){const e=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(e),a=document.createElement("a");a.href=i,a.download=n,a.rel="noopener",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),2e3)}function GA(n,t){const e=document.createElement("div");e.id="diag",e.setAttribute("data-ui-region",""),e.hidden=!0,e.innerHTML=['<div id="diag-mask"></div>','<div id="diag-card">','  <div id="diag-head"><span id="diag-title">诊断记录</span><button id="diag-close" type="button" aria-label="关闭">×</button></div>','  <div id="diag-status">—</div>','  <div id="diag-row">','    <button id="diag-copy" class="diag-btn diag-primary" type="button">复制摘要</button>','    <button id="diag-json" class="diag-btn" type="button">下载完整记录</button>','    <button id="diag-clear" class="diag-btn" type="button">清空</button>','    <button id="diag-toggle" class="diag-btn" type="button">暂停记录</button>',"  </div>",'  <textarea id="diag-text" readonly hidden spellcheck="false"></textarea>','  <div id="diag-note">数据只存在这台设备的内存里，点了按钮才会导出；不采集文字输入与设备标识。</div>',"</div>"].join(""),document.body.appendChild(e);const i=v=>e.querySelector(`#${v}`),a=i("diag-status"),s=i("diag-text"),o=i("diag-copy"),r=i("diag-json"),l=i("diag-clear"),c=i("diag-toggle"),d=i("diag-close"),u=i("diag-mask");let h=!1,f=!0,m=0;function _(){const v=n.status();a.textContent=v.enabled?`已记录 ${v.durationS.toFixed(1)}s · ${v.frames} 帧 · 事件 ${v.events} · 异常 ${v.anomalies}`:"已暂停 · 建议在复现问题前点「继续记录」",c.textContent=v.enabled?"暂停记录":"继续记录"}function g(v){h=v,e.hidden=!v,v?_():s.hidden=!0}function p(v){o.textContent=v,window.clearTimeout(m),m=window.setTimeout(()=>{o.textContent="复制摘要"},1800)}return t==null||t.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),g(!h)}),d.addEventListener("click",()=>g(!1)),u.addEventListener("click",()=>g(!1)),o.addEventListener("click",()=>{const v=n.summary();BA(v).then(x=>{x?(p("已复制 ✓"),s.hidden=!0):(s.value=v,s.hidden=!1,s.focus(),s.select(),p("请长按全选复制"))})}),r.addEventListener("click",()=>{const v=n.dump(),x=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);HA(`harness-${v.meta.version}-${x}.json`,JSON.stringify(v)),p("已导出")}),l.addEventListener("click",()=>{n.clear(),s.hidden=!0,_(),p("已清空")}),c.addEventListener("click",()=>{f=!f,n.setEnabled(f),_()}),{tick(){const v=n.status();t==null||t.classList.toggle("is-alert",v.alert),h&&_()},isOpen:()=>h,close:()=>g(!1)}}const XA={intents:{...Ff},stickX:0,stickY:0,stickRawX:0,stickRawY:0,stickHeld:!1,stickId:null,stickOriginX:0,stickOriginY:0,stickPxX:0,stickPxY:0,stickBad:0,stickScreenOk:!1,stickOriginSX:0,stickOriginSY:0,stickScreenX:0,stickScreenY:0,stickScale:1,stickVpTop:0,stickVpAge:-1,aimDX:0,aimDY:0,source:"idle",tap:null,zoomScale:1,gestures:[],lastGesture:null};function VA(){var Ct;const n=document.getElementById("app"),t=document.getElementById("hud");if(!n||!t)throw new Error("缺少 #app / #hud 容器");const e=px(Xy,uo),i=OA(n,e,un,uo.stations),a=_x(e),s=b_(t),o=S_(t),r=document.getElementById("version-badge");r&&(r.textContent="v0.9.63 · 11-09 13:18 · 诊断");const l=q=>String(q).padStart(2,"0"),c=new Date,d=qx({meta:{version:"v0.9.63",buildTime:"11-09 13:18",startedAt:`${l(c.getMonth()+1)}-${l(c.getDate())} ${l(c.getHours())}:${l(c.getMinutes())}`,ua:navigator.userAgent.slice(0,90),screen:`${window.innerWidth}×${window.innerHeight}`,dpr:Math.round((window.devicePixelRatio||1)*100)/100,orientation:window.innerHeight>window.innerWidth?"portrait":"landscape",cores:navigator.hardwareConcurrency||0}}),u=GA(d,r),h=y_({deadZone:()=>un.joystick.deadZone,container:document.getElementById("motiondbg")??void 0,toggle:document.getElementById("motiondbg-toggle")??void 0});document.addEventListener("visibilitychange",()=>{document.hidden&&d.suspend(800)});const f={timeScale:1,paused:!1,showColliders:un.showColliders,showGrid:un.showGrid,showLab:un.lab.enabled,showLabLabels:un.lab.showLabels};let m=1,_=!1;const g=Ox({maxRadiusPx:()=>un.joystick.maxRadiusPx,deadZone:un.joystick.deadZone,getBasis:()=>i.getGroundBasis(),zoom:()=>un.zoom}),p=Array.from(document.querySelectorAll(".wp[data-weapon]"));let v=e.combat.weapon;function x(q){if(q===v)return;v=q;const U=na.indexOf(q)+1;for(const Nt of p)Nt.classList.toggle("is-active",Number(Nt.dataset.weapon)===U);T.refreshWeapon()}let y=XA,w=0;const S=()=>{m=1,i.setZoom(1)},T=n_(e,un,f,{singleStep:()=>a.singleStep(y.intents),reset:()=>{m=1,a.singleStep({...Ff,resetPressed:!0})},resetZoom:S,onToggleColliders:q=>i.setCollidersVisible(q),onToggleGrid:q=>i.setGridVisible(q),onToggleLab:q=>i.setLabVisible(q),onToggleLabLabels:q=>i.setLabLabelsVisible(q),setFighterMode:q=>{for(const U of e.dummies)U.weapon&&(U.mode=q,U.attackPhase="idle",U.attackPhaseTimer=0,U.attackProgress=0,U.attackCooldown=0,U.combat&&(U.combat.phase="idle",U.combat.attackProgress=0,U.combat.comboIndex=0))}}),E=s_({stations:$i.stations,plots:jd,world:e,view:i,onResetZoom:S,onPlotTest:q=>{yl(e);const U=Ng(e,q);return L(`已在「${q.name}」生成 ${U} 人 · 点「清除测试单位」回基线`),U},onClearTestUnits:()=>{const q=yl(e);return L(q>0?`已清除 ${q} 个测试单位`:"当前没有测试单位"),q}});o.register({motion:h,debug:T.gui}),window.addEventListener("resize",()=>i.resize());const M=i.bodyTypes().ids,b=document.getElementById("body-toggle"),R=q=>{var U,Nt;return((Nt=(U=un.bodyTypes)==null?void 0:U[q])==null?void 0:Nt.name)??q},k=()=>{if(!b)return;const q=i.bodyTypes().id;b.textContent=`体型 ${R(q)}`,b.setAttribute("aria-label",`切换体型（当前：${R(q)}，快捷键 B）`)},C=document.createElement("div");C.style.cssText=["position:fixed","left:50%","top:14px","transform:translateX(-50%)","padding:6px 14px","border-radius:999px","font:600 13px/1.4 system-ui,sans-serif","color:#0b1620","background:#8fd0ff","box-shadow:0 4px 16px rgba(0,0,0,.35)","opacity:0","transition:opacity .18s","pointer-events:none","z-index:99"].join(";"),document.body.appendChild(C);let I=0;const L=q=>{C.textContent=q,C.style.opacity="1",window.clearTimeout(I),I=window.setTimeout(()=>{C.style.opacity="0"},1600)},D=()=>{if(M.length<2){L("只有一个体型预设");return}const q=i.bodyTypes().id,U=Math.max(0,M.indexOf(q)),Nt=i.setBodyType(M[(U+1)%M.length]);k(),L(`体型：${R(Nt)}（B / 顶部胶囊切换）`)};k(),b==null||b.addEventListener("click",D);const O=document.getElementById("wind-toggle"),B=()=>{var q;return(q=e.config.grass)==null?void 0:q.wind},V=()=>{var U;if(!O)return;const q=!!((U=B())!=null&&U.enabled);O.textContent=`风：${q?"开":"关"}`,O.classList.toggle("is-off",!q),O.setAttribute("aria-label",`${q?"关闭":"开启"}风吹麦浪（当前${q?"开启":"关闭"}，快捷键 G）`)},ot=()=>{const q=B();if(!q){L("本场景未启用草块");return}q.enabled=!q.enabled,V(),L(`风吹麦浪：${q.enabled?"开":"关"}（G 切换）`)};V(),O==null||O.addEventListener("click",ot),window.addEventListener("keydown",q=>{q.repeat||(q.code==="KeyB"?D():q.code==="KeyG"&&ot())}),window.__harness={world:e,view:i,clock:a,input:g,viewConfig:un,debug:f,getUserZoom:()=>m,getGestures:()=>y.gestures,getLastGesture:()=>y.lastGesture,telemetry:d,telemetrySummary:()=>d.summary(),dirDebug:h.dirDebug,dirAngles:()=>h.dirDebug.last(),motionDebug:h,speedDebug:()=>h.last(),speedSamples:()=>h.samples(),gaitDebug:()=>i.gaitDebug(),dummyRigDebug:q=>i.dummyRigDebug(q),swingDebug:()=>i.swingDebug(),stanceDebug:()=>i.stanceDebug(),balanceDebug:()=>i.balanceDebug(),spineDebug:()=>i.spineDebug(),interpDebug:()=>({alpha:Z,applied:J,enabled:K,skip:lt}),renderPose:()=>i.renderPose(),yawDebug:()=>i.yawDebug(),slamDebug:()=>i.slamDebug(),fxDebug:()=>i.fxDebug(),grassDebug:()=>i.grassDebug(),windDebug:()=>{var U;const q=i.grassDebug().wind;return{configured:!!((U=B())!=null&&U.enabled),rendered:q.enabled,time:q.time,gust:q.gust}},setWind:q=>{const U=B();return U?(U.enabled=!!q,V(),U.enabled):!1},setRenderInterp:q=>(K=!!q,K),renderHold:()=>_,trailDebug:()=>i.trailDebug(),bladeWorld:()=>i.bladeWorld(),projectPoint:(q,U,Nt)=>i.projectPoint(q,U,Nt),setBodyType:q=>{const U=i.setBodyType(q);return k(),U},bodyTypes:()=>i.bodyTypes(),bladesWorld:()=>i.bladesWorld(),clipLab:{clips:()=>{var q;return Object.keys(((q=un.animation.swing)==null?void 0:q.clips)??{})},preview:q=>{const U=e.combat,Nt={...U};U.weapon=q.weapon,U.phase="active",U.comboIndex=Math.max(1,Math.min(3,Math.floor(q.comboIndex))),U.attackProgress=Math.max(0,Math.min(1,q.progress)),U.attackFacing=e.character.bodyYaw,i.setClipT(typeof q.t=="number"?q.t:null);const Dt=Math.max(1,Math.min(30,Math.floor(q.warm??12)));_=!0;for(let St=0;St<Dt;St++)i.render(e,1/60);return i.setClipT(null),Object.assign(U,Nt),{...i.swingDebug(),blade:i.bladeWorld(),blades:i.bladesWorld()}},face:q=>{e.character.bodyYaw=q},zoom:q=>{m=Yd(q,1,un.zoom.min,un.zoom.max),i.setZoom(m)},release:()=>{_=!1}},weaponDebug:()=>i.weaponDebug(),gripDebug:()=>i.gripDebug(),plotDebug:()=>({version:"v0.9.63",count:$i.plots.length,diagnostics:$i.diagnostics,testUnits:Og(e),dummies:e.dummies.length,rendered:i.dummyRenderCount(),plots:$i.plots.map(q=>({id:q.id,index:q.index,placement:q.placement,slot:q.slot,centerX:q.centerX,centerZ:q.centerZ,spawnX:q.station.spawnX,spawnZ:q.station.spawnZ,hasTest:!!q.testSpawn}))}),spawnAt:q=>E.spawnAt(q),clearSpawned:()=>E.clearSpawned(),lab:{stations:$i.stations,plots:jd,goto:q=>E.goto(q),current:()=>E.current(),recall:()=>E.recall(),spawnAt:q=>E.spawnAt(q),clearSpawned:()=>E.clearSpawned()}};let gt=performance.now(),vt=60,It=0,K=((Ct=un.renderInterp)==null?void 0:Ct.enabled)??!0,it=Wd(e),ct=null,Z=1,J=!1,lt="";function Ht(q){const U=K&&!f.paused&&f.timeScale>0;if(J=!1,lt="",!U)return lt="off",Z=1,e;if(!ct)return lt="noprev",Z=1,e;if(!bx(ct,it))return lt="key",Z=1,e;const Nt=a.alpha;return Z=Nt,Nt>=.999?(lt="alpha",e):(J=!0,wx(e,Sx(ct,it,Nt)))}function qt(q){const U=Math.min((q-gt)/1e3,.1);gt=q,U>0&&(vt=vt*.9+1/U*.1);const Nt=g.sample();Nt.intents.resetPressed&&(m=1),m=Yd(m,Nt.zoomScale,un.zoom.min,un.zoom.max),i.setZoom(m);let Dt=Nt.intents.dummyClickId;if(Nt.tap){const xt=i.pickDummy(Nt.tap.x,Nt.tap.y);xt>0&&(Dt=xt)}Dt>0&&(w=Dt),y={...Nt,intents:{...Nt.intents,dummyClickId:w}};const St=a.frame(U,y.intents,f.timeScale,f.paused,()=>{const xt=e.events;for(let Rt=0;Rt<xt.length;Rt++)d.event(xt[Rt],e.time);ct=it,it=Wd(e)});St>0&&(w=0),d.sample(e,y,U*1e3,St);for(const xt of y.gestures)d.gesture(xt);q-It>250&&(It=q,u.tick()),x(e.combat.weapon),_||i.render(Ht(),U),E.tick(),h.update(e,y,i.getGroundBasis());const _t=i.diagnostics();s.update(e,vt,St,y,f,{attackBlend:_t.attackBlend,attackWeights:_t.attackWeights,landing:_t.landing,hurt:_t.hurt,ik:_t.ik,zoom:_t.camera.zoom},o.hudCompact()),requestAnimationFrame(qt)}requestAnimationFrame(qt)}VA();
